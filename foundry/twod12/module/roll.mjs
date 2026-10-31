import { esc } from "./util.mjs";
export { esc };
export const TIER_NAMES = ["", "Failure", "Marginal Success", "Full Success"];
export const sgn = n => (n >= 0 ? "+" : "-") + Math.abs(n);
const faces = r => (r ? r.dice.flatMap(d => d.results.map(x => x.result)) : []);
const boonFacesOf = r => faces(r).map(x => x - 1);

// One d12: a 12 counts as 11 and is rolled again (and added).
async function rollDie() {
  const rolls = [], f = [];
  let total = 0;
  for (let i = 0; i < 15; i++) {
    const r = await new Roll("1d12").evaluate();
    rolls.push(r); f.push(r.total);
    if (r.total === 12) { total += 11; continue; }
    total += r.total;
    break;
  }
  return { total, first: f[0], faces: f, rolls };
}

/**
 * Which two of the d12 to keep, and the result they give (Favored and Doomed Rolls, Doubles).
 * dice: [{ total, first }] (2 or 3 of them); state: "", "favored" or "doomed"; flat: everything added to the dice (mod, adj, boons, banes).
 * Doomed keeps the two lowest totals and can't produce Doubles. Favored keeps the pair that gives the highest Tier
 * (then a Critical, then the higher total): usually the two highest, but sometimes a pair of Doubles. Pure: the tests load it.
 */
export function keepDice(dice, state, flat = 0, dc = 13, noDoubles = false) {   // v0.0.206: noDoubles for a roll where Doubles do nothing (initiative): Favored keeps the highest pair
  const score = (a, b) => {
    const total = a.total + b.total + flat;
    const base = total < dc ? 1 : (total < dc + 7 ? 2 : 3);
    const doubles = !noDoubles && state !== "doomed" && a.first === b.first;
    return { total, base, doubles, tier: doubles ? Math.min(3, base + 1) : base, crit: (doubles && base === 3) || total >= dc + 20 };
  };
  if (!state || dice.length < 3) return { i: [0, 1], out: -1, ...score(dice[0], dice[1]) };
  const pairs = [[0, 1], [0, 2], [1, 2]].map(([x, y]) => ({ i: [x, y], out: 3 - x - y, ...score(dice[x], dice[y]) }));
  if (state === "doomed") {
    const order = dice.map((d, i) => ({ t: d.total, i })).sort((a, b) => a.t - b.t || a.i - b.i);
    const keep = [order[0].i, order[1].i].sort((a, b) => a - b);
    return pairs.find(p => p.i[0] === keep[0] && p.i[1] === keep[1]);
  }
  return pairs.sort((a, b) => b.tier - a.tier || Number(b.crit) - Number(a.crit) || b.total - a.total || a.out - b.out)[0];
}

/** One Roll holding every die of several rolls, so Dice So Nice can throw them all at once. */
export function combineRolls(rolls) {
  const list = rolls.filter(Boolean);
  if (list.length < 2) return list[0] ?? null;
  const Op = foundry.dice.terms.OperatorTerm, terms = [];
  for (const r of list) { if (terms.length) terms.push(new Op({ operator: "+" })); terms.push(...r.terms); }
  return Roll.fromTerms(terms);
}

/** Show 3D dice for several rolls at the same time. Rolls are already evaluated, so this only animates. */
export async function showDice(rolls) {
  if (!game.dice3d) return;
  const list = rolls.filter(Boolean);
  try { const one = combineRolls(list); if (one) await game.dice3d.showForRoll(one, game.user, true); }
  catch (e) { await Promise.all(list.map(r => game.dice3d.showForRoll(r, game.user, true))); }
}

/** 2d12 + mod + boons - banes vs DC. Does not post anything. */
export async function performCheck({ mod = 0, boons = 0, banes = 0, dc = 13, sources = [], manualBoons = 0, manualBanes = 0, adj = 0, adjLabel = "", favored = false, doomed = false, noDoubles = false } = {}) {
  // Favored: 3d12, keep the pair with the best Tier. Doomed: keep the two lowest, no Doubles. Both cancel out.
  const state = favored && doomed ? "" : (favored ? "favored" : (doomed ? "doomed" : ""));
  const dice = [await rollDie(), await rollDie()];
  if (state) dice.push(await rollDie());
  // Each boon is 1d3-1 (0 to 2) and each bane subtracts 1d3-1; the dice show their value minus 1.
  const boonRoll = boons > 0 ? await new Roll(`${boons}d3-${boons}`).evaluate() : null;
  const baneRoll = banes > 0 ? await new Roll(`${banes}d3-${banes}`).evaluate() : null;
  const bo = boonRoll?.total ?? 0, ba = baneRoll?.total ?? 0;
  const k = keepDice(dice, state, mod + adj + bo - ba, dc, noDoubles);
  const d1 = dice[k.i[0]], d2 = dice[k.i[1]], dropped = k.out >= 0 ? dice[k.out] : null;
  return {
    adjLabel, tier: k.tier, crit: k.crit, total: k.total, base: k.base, doubles: k.doubles, dc, mod, adj, bo, ba, sources, manualBoons, manualBanes,
    d1: d1.faces, d2: d2.faces, state, dropped: dropped?.faces ?? null, boonFaces: boonFacesOf(boonRoll), baneFaces: boonFacesOf(baneRoll),
    rolls: [...dice.flatMap(d => d.rolls), boonRoll, baneRoll].filter(Boolean)
  };
}

/** Check block: title, dice, modifier chips, total. */
export function checkHtml(title, r, chips = [], { showTier = false, status: showStatus = true } = {}) {
  const die = (f, dbl, chain = false) => `<span class="die d12${f === 12 ? " boom" : ""}${dbl ? " dbl" : ""}${chain ? " chain" : ""}"${f === 12 ? ' data-tooltip="A 12 counts as 11 and is rolled again."' : (chain ? ' data-tooltip="Rolled again after a 12"' : "")}>${f}</span>`;
  // An exploding die: the 12, then each die it adds, joined by a small chain.
  const dieChain = (faces, dblFirst) => faces.map((f, i) => `${i ? '<i class="fa-solid fa-link dlink"></i>' : ""}${die(f, dblFirst && i === 0, i > 0)}`).join("");
  const side = (f, label, cls, sign) => f.length
    ? `<span class="plus">${sign}</span><span class="dgroup ${cls}"><small>${label}</small>${f.map(x => `<span class="die d3 ${cls}">${x}</span>`).join("")}</span>` : "";
  const chipHtml =
    (r.state
      ? `<span class="chip ${r.state === "favored" ? "boon" : "bane"}" data-tooltip="${r.state === "favored" ? "3d12, keep the pair with the best Tier" : "3d12, keep the two lowest (no Doubles)"}">${r.state === "favored" ? "Favored" : "Doomed"}</span>`
      : "") +
    chips.map(c => `<span class="chip">${esc(c)}</span>`).join("") +
    (r.adj ? `<span class="chip${r.adjLabel ? " bane" : ""}">${esc(r.adjLabel || "Modifier")} ${sgn(r.adj)}</span>` : "") +
    (r.sources ?? [])
      .map(
        x =>
          `${x.boons ? `<span class="chip boon" data-tooltip="Boon">${esc(x.name)}</span>` : ""}${x.banes ? `<span class="chip bane" data-tooltip="Bane">${esc(x.name)}</span>` : ""}`
      )
      .join("") +
    (r.manualBoons ? `<span class="chip boon" data-tooltip="Boons: ${r.boonFaces.join(" + ")}">Boons +${r.manualBoons}</span>` : "") +
    (r.manualBanes ? `<span class="chip bane" data-tooltip="Banes: ${r.baneFaces.join(" + ")}">Banes -${r.manualBanes}</span>` : "");
  // Doubles and Critical are chips under the roll (a card with tier rows also marks them in the rows).
  const status = r.crit && showStatus ? `<span class="chip crit">Critical: ${r.doubles && r.base === 3 ? "Doubles on a Tier 3" : "20 above the DC"}</span>` : (r.doubles && r.base < 3 ? `<span class="chip dbl">Doubles: +1 Tier</span>` : "");
  return `<div class="chk"><div class="chkline"><span class="chk-title">${esc(title)}</span>
    <span class="dice"><span class="dgroup">${dieChain(r.d1, r.doubles)}</span><span class="plus">+</span><span class="dgroup">${dieChain(r.d2, r.doubles)}</span>${r.dropped ? `<span class="dgroup dropped" data-tooltip="Dropped die">${r.dropped.map(f => die(f, false)).join("")}</span>` : ""}${r.mod ? `<span class="plus">${r.mod > 0 ? "+" : "&minus;"}</span><span class="modv" data-tooltip="Modifier">${Math.abs(r.mod)}</span>` : ""}${side(r.boonFaces, "Boons", "boon", "+")}${side(r.baneFaces, "Banes", "bane", "&minus;")}</span>
    <span class="shield${r.dc ? (r.total >= r.dc ? " win" : " lose") : ""}" data-tooltip="Total ${r.total}${r.dc ? ` against ${r.dcLabel ?? "DC"} ${r.dc}` : ""}"><b class="rtotal">${r.total}</b>${r.dc ? `<small class="vsdc">${r.dcLabel ?? "DC"} ${r.dc}</small>` : ""}</span></div>
    ${chipHtml || status ? `<div class="chips">${chipHtml}${status}</div>` : ""}
    ${showTier ? `<div class="tier t${r.tier}">Tier ${r.tier}: ${TIER_NAMES[r.tier]}</div>` : ""}</div>`;
}

/* ------------------------------------------------------------------ one roll for several targets (see "Several Targets" in the rules) */
const stateOf = sp => (sp.favored && sp.doomed ? "" : (sp.favored ? "favored" : (sp.doomed ? "doomed" : "")));
const sumFaces = list => list.reduce((a, b) => a + b, 0);

/** Roll the dice every target shares: two d12 (a third when any target has Favored or Doomed), and as many boon and bane dice as any target needs. */
export async function rollSharedDice({ third = false, boonDice = 0, baneDice = 0 } = {}) {
  const d = [await rollDie(), await rollDie()];
  if (third) d.push(await rollDie());
  const boonRoll = boonDice > 0 ? await new Roll(`${boonDice}d3-${boonDice}`).evaluate() : null;
  const baneRoll = baneDice > 0 ? await new Roll(`${baneDice}d3-${baneDice}`).evaluate() : null;
  return { d, boonFaces: boonFacesOf(boonRoll), baneFaces: boonFacesOf(baneRoll), rolls: [...d.flatMap(x => x.rolls), boonRoll, baneRoll].filter(Boolean) };
}

/**
 * One target's result from the shared dice: it uses the first two d12 (Favored: the two highest of three, Doomed: the two lowest),
 * and only the first boon and bane dice it needs. Same shape as performCheck's result.
 * spec: { mod, adj, adjLabel, dc, boons, banes, favored, doomed, sources, manualBoons, manualBanes }
 */
export function resolveShared(dice, spec) {
  const { mod = 0, adj = 0, adjLabel = "", dc = 13, boons = 0, banes = 0, sources = [], manualBoons = 0, manualBanes = 0 } = spec;
  const state = stateOf(spec);
  const boonFaces = dice.boonFaces.slice(0, Math.max(0, boons)), baneFaces = dice.baneFaces.slice(0, Math.max(0, banes));
  const bo = sumFaces(boonFaces), ba = sumFaces(baneFaces);
  const pool = state && dice.d[2] ? dice.d : dice.d.slice(0, 2);
  const k = keepDice(pool, state, mod + adj + bo - ba, dc);
  const d1 = pool[k.i[0]], d2 = pool[k.i[1]], dropped = k.out >= 0 ? pool[k.out] : null;
  return {
    adjLabel, tier: k.tier, crit: k.crit, total: k.total, base: k.base, doubles: k.doubles, dc, mod, adj, bo, ba, sources, manualBoons, manualBanes,
    d1: d1.faces, d2: d2.faces, state, dropped: dropped?.faces ?? null, boonFaces, baneFaces, rolls: []
  };
}

/** Roll once for every target: [{ key, ...spec }] → { dice, rolls, results: [{ key, chk }] }. */
export async function performMultiCheck(specs) {
  const dice = await rollSharedDice({ third: specs.some(sp => stateOf(sp) !== ""), boonDice: Math.max(0, ...specs.map(sp => sp.boons || 0)), baneDice: Math.max(0, ...specs.map(sp => sp.banes || 0)) });
  return { dice, rolls: dice.rolls, results: specs.map(sp => ({ key: sp.key, chk: resolveShared(dice, sp) })) };
}

/** "Skeleton Captain, Skeleton Captain, Nari" → "Skeleton Captain ×2, Nari". */
export function collapseNames(names) {
  const counts = new Map();
  for (const n of names) counts.set(n, (counts.get(n) ?? 0) + 1);
  return [...counts].map(([n, k]) => (k > 1 ? `${n} \u00d7${k}` : n)).join(", ");
}

/** The same name more than once gets numbers, in order: ["Orc", "Nari", "Orc"] → ["Orc 1", "Nari", "Orc 2"]. */
export function uniqueLabels(names) {
  const total = new Map(), seen = new Map();
  for (const n of names) total.set(n, (total.get(n) ?? 0) + 1);
  return names.map(n => (total.get(n) > 1 ? `${n} ${seen.set(n, (seen.get(n) ?? 0) + 1).get(n)}` : n));
}

/**
 * The shared dice once, then a compact row per kind of result: creatures with the same name and the same result share one row ("Skeleton Captain ×6").
 * rows: [{ name, label, chk, chips: [{ text, cls }], odds }]; label is the creature's own (numbered) name, odds a short text.
 */
export function multiCheckHtml(title, dice, rows, chips = []) {
  const die = (f, chain) => `<span class="die d12${f === 12 ? " boom" : ""}${chain ? " chain" : ""}"${f === 12 ? ' data-tooltip="A 12 counts as 11 and is rolled again."' : ""}>${f}</span>`;
  const chain = faces => faces.map((f, i) => `${i ? '<i class="fa-solid fa-link dlink"></i>' : ""}${die(f, i > 0)}`).join("");
  const dtot = faces => faces.reduce((a, f) => a + (f === 12 ? 11 : f), 0);
  const side = (f, cls) => (f.length ? `<span class="dgroup ${cls}">${f.map(x => `<span class="die d3 ${cls}">${x}</span>`).join("")}</span>` : "");
  const diceHtml = `<span class="dgroup">${chain(dice.d[0].faces)}</span><span class="plus">+</span><span class="dgroup">${chain(dice.d[1].faces)}</span>`
    + (dice.d[2] ? `<span class="plus">&middot;</span><span class="dgroup third" data-tooltip="A third die: Favored keeps the two highest, Doomed the two lowest">${chain(dice.d[2].faces)}</span>` : "")
    + (dice.boonFaces.length ? `<span class="plus">+</span>${side(dice.boonFaces, "boon")}` : "") + (dice.baneFaces.length ? `<span class="plus">&minus;</span>${side(dice.baneFaces, "bane")}` : "");
  // Same name and same result: one row.
  const key = r => [r.name, r.chk.dc, r.chk.total, r.chk.tier, r.chk.doubles, r.chk.crit, r.chk.state ?? "", (r.chips ?? []).map(c => c.text).join(",")].join("|");
  const groups = [], at = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!at.has(k)) { at.set(k, groups.length); groups.push({ ...r, labels: [] }); }
    groups[at.get(k)].labels.push(r.label ?? r.name);
  }
  const rowHtml = groups.map(g => {
    const chk = g.chk, win = chk.total >= chk.dc, mods = chk.mod + chk.adj;
    const calc = `${dtot(chk.d1)} + ${dtot(chk.d2)}${mods ? ` ${mods > 0 ? "+" : "\u2212"} ${Math.abs(mods)}` : ""}${chk.bo ? ` + ${chk.bo}` : ""}${chk.ba ? ` \u2212 ${chk.ba}` : ""} = ${chk.total} vs ${chk.dcLabel ?? "DC"} ${chk.dc}`;
    const name = g.labels.length > 1 ? `${g.name} \u00d7${g.labels.length}` : g.labels[0];
    const tags = [...(g.chips ?? []), ...(chk.state ? [{ text: chk.state === "favored" ? "Favored" : "Doomed", cls: chk.state === "favored" ? "boon" : "bane" }] : []), ...(chk.doubles ? [{ text: "Doubles", cls: "dbl" }] : []), ...(chk.crit ? [{ text: "Critical", cls: "crit" }] : [])];
    return `<div class="mrow t${chk.tier}"><span class="mname" data-tooltip="${esc(g.labels.length > 1 ? g.labels.join(", ") : name)}">${esc(name)}</span>`
      + `<span class="shield small ${win ? "win" : "lose"}" data-tooltip="${esc(`${chk.dropped ? "A die was dropped. " : ""}${calc}`)}"><b class="rtotal">${chk.total}</b><small class="vsdc">${chk.dcLabel ?? "DC"} ${chk.dc}</small></span><span class="rtag rolled${chk.tier === 1 ? " fail" : ""}">Tier ${chk.tier}</span>`
      + (tags.length ? `<div class="mchips">${tags.map(t => `<span class="chip ${t.cls ?? ""}">${esc(t.text)}</span>`).join("")}</div>` : "")
      + (g.odds ? `<div class="modds">${esc(g.odds)}</div>` : "") + `</div>`;
  }).join("");
  return `<div class="chk multi"><div class="chkline"><span class="chk-title">${esc(title)}</span><span class="dice">${diceHtml}</span></div>`
    + (chips.length ? `<div class="chips">${chips.map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : "") + `<div class="mtable">${rowHtml}</div></div>`;
}

export async function rollCheck({ actor, label, mod = 0, boons = 0, banes = 0, dc = 13, chips = null, sources = [], manualBoons = 0, manualBanes = 0, adj = 0, favored = false, doomed = false } = {}) {
  const r = await performCheck({ mod, boons, banes, dc, sources, manualBoons, manualBanes, adj, favored, doomed });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }), rolls: r.rolls,
    content: `<div class="twod12 chat">${checkHtml(label, r, [...(chips ?? (mod ? [`Modifier ${sgn(mod)}`] : [])), `DC ${dc}`], { showTier: true })}</div>`
  });
  return r;
}

const BANDS = [[4, "Very minor"], [8, "Minor"], [12, "Minor"], [16, "Moderate"], [20, "Moderate"], [24, "Severe"], [26, "Soft death"], [Infinity, "Death"]];

/** Dying / Shattered table: 2d12 (no exploding) - attribute + 1d6 per Wound. Each result adds a Wound. */
export async function rollTable(actor, kind) {
  const s = actor.system;
  const at = kind === "dying" ? s.attributes.body : s.attributes.mind;
  const w = kind === "dying" ? s.bodyWounds : s.mindWounds;   // each Wound of the same kind adds 1d6
  const formula = `2d12 - ${at}` + (w > 0 ? ` + ${w}d6` : "");
  const r = await new Roll(formula).evaluate();
  const band = BANDS.find(([max]) => r.total <= max)[1];
  await actor.update(kind === "dying" ? { "system.bodyWounds": s.bodyWounds + 1 } : { "system.mindWounds": s.mindWounds + 1 });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }), rolls: [r],
    content: `<div class="twod12 chat"><h3>${kind === "dying" ? "Dying" : "Shattered"} Table</h3><div>${formula} = <b>${r.total}</b></div><div class="tier t${r.total >= 25 ? 1 : 2}">${band} (Wounds now ${w + 1})</div></div>`
  });
}
