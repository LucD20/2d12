import { esc } from "./util.mjs";
import { bbResolve, keepThree, tierOf } from "./calc.mjs";
export { esc };
export const TIER_NAMES = ["", "Failure", "Marginal Success", "Full Success"];
export const sgn = n => (n >= 0 ? "+" : "-") + Math.abs(n);
// v0.0.301 (PACK BB): a Boon is +1 and a Bane -1 (no dice): the lists hold a 1 for each one that counts
const ones = n => Array(Math.max(0, Number(n) || 0)).fill(1);

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
 * Which two of the d12 to keep, and the result they give (Favored and Doomed Rolls, Doubles; book Ch. 1, v0.0.301).
 * dice: [{ total, first }] (2 or 3 of them); state: "", "favored" or "doomed"; flat: everything added to the dice (mod, adj, boons, banes).
 * Doomed keeps the two lowest totals and can't produce Doubles. Favored keeps the two highest totals; any two matching first faces of the three are
 * Doubles (even one not kept), and three of a kind is a Critical whatever the total. noDoubles: a roll where Doubles do nothing (initiative). Pure.
 */
export function keepDice(dice, state, flat = 0, dc = 13, noDoubles = false) {
  if (!state || dice.length < 3) {
    const doubles = !noDoubles && state !== "doomed" && dice[0].first === dice[1].first, total = dice[0].total + dice[1].total + flat;
    return { i: [0, 1], out: -1, total, doubles, triple: false, ...tierOf(total, dc, doubles) };
  }
  const k = keepThree(dice.map(d => ({ f: d.first, t: d.total })), state, noDoubles);
  const total = dice[k.keep[0]].total + dice[k.keep[1]].total + flat;
  return { i: k.keep, out: 3 - k.keep[0] - k.keep[1], total, doubles: k.doubles, triple: k.triple, ...tierOf(total, dc, k.doubles, k.triple) };
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

/**
 * v0.0.301 (PACK BB): what the Boons and Banes add and the state they leave: boons and banes are counts after the limits of their names
 * (calc.mjs bbCount); they cancel, and 5 or more left make the roll Favored / Doomed instead. { state, five, bo, ba, net }.
 */
export function bbRoll(boons = 0, banes = 0, favored = false, doomed = false) {
  // v0.0.536 (book, Chapter 1): the Boons and Banes add in every state, at most 4 after cancelling (the larger side shown cut to the smaller + 4)
  const r = bbResolve(boons, banes, favored, doomed);
  let bo = Math.max(0, Number(boons) || 0), ba = Math.max(0, Number(banes) || 0);
  if (bo - ba > r.add) bo = ba + r.add; else if (bo - ba < r.add) ba = bo - r.add;
  return { state: r.state, five: r.five, bo, ba, net: r.net };
}

/** 2d12 + mod + boons - banes vs DC. Does not post anything. */
export async function performCheck({ mod = 0, boons = 0, banes = 0, dc = 13, sources = [], manualBoons = 0, manualBanes = 0, adj = 0, adjLabel = "", favored = false, doomed = false, noDoubles = false } = {}) {
  // Favored: 3d12, keep the two highest (any pair is Doubles, three of a kind a Critical). Doomed: keep the two lowest, no Doubles. Both cancel out.
  // v0.0.301: each Boon +1, each Bane -1; 5 or more left after cancelling: Favored / Doomed instead.
  const bb = bbRoll(boons, banes, favored, doomed), state = bb.state;
  const dice = [await rollDie(), await rollDie()];
  if (state) dice.push(await rollDie());
  const { bo, ba } = bb;
  const k = keepDice(dice, state, mod + adj + bo - ba, dc, noDoubles);
  const d1 = dice[k.i[0]], d2 = dice[k.i[1]], dropped = k.out >= 0 ? dice[k.out] : null;
  return {
    adjLabel, tier: k.tier, crit: k.crit, total: k.total, base: k.base, doubles: k.doubles, triple: !!k.triple, dc, mod, adj, bo, ba, five: bb.five, sources, manualBoons, manualBanes,
    d1: d1.faces, d2: d2.faces, state, dropped: dropped?.faces ?? null, boonFaces: ones(bo), baneFaces: ones(ba),
    rolls: dice.flatMap(d => d.rolls)
  };
}

/** Check block: title, dice, modifier chips, total. */
export function checkHtml(title, r, chips = [], { showTier = false, status: showStatus = true } = {}) {
  const die = (f, dbl, chain = false) => `<span class="die d12${f === 12 ? " boom" : ""}${dbl ? " dbl" : ""}${chain ? " chain" : ""}">${f}</span>`;
  // An exploding die: the 12, then each die it adds, joined by a small chain.
  const dieChain = (faces, dblFirst) => faces.map((f, i) => `${i ? '<i class="fa-solid fa-link dlink"></i>' : ""}${die(f, dblFirst && i === 0, i > 0)}`).join("");
  // v0.0.301 (PACK BB): Boons and Banes are a flat +1 / -1 each: one number, no dice
  const side = (f, label, cls, sign) => f.length
    ? `<span class="plus">${sign}</span><span class="dgroup ${cls}"><small>${label}</small><span class="modv">${f.length}</span></span>` : "";
  const chipHtml =
    (r.state
      ? `<span class="chip ${r.state === "favored" ? "boon" : "bane"}">${r.state === "favored" ? "Favored" : "Doomed"}</span>`
      : "") +
    (r.five ? `<span class="chip ${r.five === "favored" ? "boon" : "bane"}">5 ${r.five === "favored" ? "Boons" : "Banes"}</span>` : "") +
    chips.map(c => `<span class="chip">${esc(c)}</span>`).join("") +
    (r.adj ? `<span class="chip${r.adjLabel ? " bane" : ""}">${esc(r.adjLabel || "Modifier")} ${sgn(r.adj)}</span>` : "") +
    (r.sources ?? [])
      .map(
        x =>
          `${x.boons ? `<span class="chip boon">${esc(x.name)}</span>` : ""}${x.banes ? `<span class="chip bane">${esc(x.name)}</span>` : ""}`
      )
      .join("") +
    (r.manualBoons ? `<span class="chip boon">Boons +${r.manualBoons}</span>` : "") +
    (r.manualBanes ? `<span class="chip bane">Banes -${r.manualBanes}</span>` : "");
  // Doubles and Critical are chips under the roll (a card with tier rows also marks them in the rows).
  const status = r.crit && showStatus ? `<span class="chip crit">Critical: ${r.triple ? "three of a kind" : r.doubles && r.base === 3 ? "Doubles on a Tier 3" : "20 above the DC"}</span>` : (r.doubles && r.base < 3 ? `<span class="chip dbl">Doubles: +1 Tier</span>` : "");
  return `<div class="chk"><div class="chkline"><span class="chk-title">${esc(title)}</span>
    <span class="dice"><span class="dgroup">${dieChain(r.d1, r.doubles)}</span><span class="plus">+</span><span class="dgroup">${dieChain(r.d2, r.doubles)}</span>${r.dropped ? `<span class="dgroup dropped" aria-label="Dropped die">${r.dropped.map(f => die(f, false)).join("")}</span>` : ""}${r.mod ? `<span class="plus">${r.mod > 0 ? "+" : "&minus;"}</span><span class="modv" aria-label="Modifier">${Math.abs(r.mod)}</span>` : ""}${side(r.boonFaces, "Boons", "boon", "+")}${side(r.baneFaces, "Banes", "bane", "&minus;")}</span>
    <span class="shield${r.dc ? (r.total >= r.dc ? " win" : " lose") : ""}"><b class="rtotal">${r.total}</b>${r.dc ? `<small class="vsdc">${r.dcLabel ?? "DC"} ${r.dc}</small>` : ""}</span></div>
    ${chipHtml || status ? `<div class="chips">${chipHtml}${status}</div>` : ""}
    ${showTier ? `<div class="tier t${r.tier}">Tier ${r.tier}: ${TIER_NAMES[r.tier]}</div>` : ""}</div>`;
}

/* ------------------------------------------------------------------ one roll for several targets (see "Several Targets" in the rules) */

/** Roll the dice every target shares: two d12 (a third when any target has Favored or Doomed). v0.0.301: Boons and Banes are flat, no dice. */
export async function rollSharedDice({ third = false } = {}) {
  const d = [await rollDie(), await rollDie()];
  if (third) d.push(await rollDie());
  return { d, boonFaces: [], baneFaces: [], rolls: d.flatMap(x => x.rolls) };
}

/**
 * One target's result from the shared dice: it uses the first two d12 (Favored: the two highest of three, any pair Doubles; Doomed: the two lowest),
 * its own Boons and Banes (+1 / -1, 5 or more: Favored / Doomed). Same shape as performCheck's result.
 * spec: { mod, adj, adjLabel, dc, boons, banes, favored, doomed, sources, manualBoons, manualBanes }
 */
export function resolveShared(dice, spec) {
  const { mod = 0, adj = 0, adjLabel = "", dc = 13, boons = 0, banes = 0, sources = [], manualBoons = 0, manualBanes = 0 } = spec;
  const bb = bbRoll(boons, banes, !!spec.favored, !!spec.doomed), state = bb.state, { bo, ba } = bb;
  const boonFaces = ones(bo), baneFaces = ones(ba);
  const pool = state && dice.d[2] ? dice.d : dice.d.slice(0, 2);
  const k = keepDice(pool, state, mod + adj + bo - ba, dc);
  const d1 = pool[k.i[0]], d2 = pool[k.i[1]], dropped = k.out >= 0 ? pool[k.out] : null;
  return {
    adjLabel, tier: k.tier, crit: k.crit, total: k.total, base: k.base, doubles: k.doubles, triple: !!k.triple, dc, mod, adj, bo, ba, five: bb.five, sources, manualBoons, manualBanes,
    d1: d1.faces, d2: d2.faces, state, dropped: dropped?.faces ?? null, boonFaces, baneFaces, rolls: []
  };
}

/** Roll once for every target: [{ key, ...spec }] → { dice, rolls, results: [{ key, chk }] }. */
export async function performMultiCheck(specs) {
  const dice = await rollSharedDice({ third: specs.some(sp => bbRoll(sp.boons, sp.banes, !!sp.favored, !!sp.doomed).state !== "") });
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
  const die = (f, chain) => `<span class="die d12${f === 12 ? " boom" : ""}${chain ? " chain" : ""}">${f}</span>`;
  const chain = faces => faces.map((f, i) => `${i ? '<i class="fa-solid fa-link dlink"></i>' : ""}${die(f, i > 0)}`).join("");
  const diceHtml = `<span class="dgroup">${chain(dice.d[0].faces)}</span><span class="plus">+</span><span class="dgroup">${chain(dice.d[1].faces)}</span>`
    + (dice.d[2] ? `<span class="plus">&middot;</span><span class="dgroup third">${chain(dice.d[2].faces)}</span>` : "");
  // Same name and same result: one row.
  const key = r => [r.name, r.chk.dc, r.chk.total, r.chk.tier, r.chk.doubles, r.chk.crit, r.chk.state ?? "", (r.chips ?? []).map(c => c.text).join(",")].join("|");
  const groups = [], at = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!at.has(k)) { at.set(k, groups.length); groups.push({ ...r, labels: [] }); }
    groups[at.get(k)].labels.push(r.label ?? r.name);
  }
  const rowHtml = groups.map(g => {
    const chk = g.chk, win = chk.total >= chk.dc;
    const name = g.labels.length > 1 ? `${g.name} \u00d7${g.labels.length}` : g.labels[0];
    const tags = [...(g.chips ?? []), ...(chk.five ? [{ text: chk.five === "favored" ? "5 Boons" : "5 Banes", cls: chk.five === "favored" ? "boon" : "bane" }] : []), ...(chk.state ? [{ text: chk.state === "favored" ? "Favored" : "Doomed", cls: chk.state === "favored" ? "boon" : "bane" }] : []), ...(chk.doubles ? [{ text: "Doubles", cls: "dbl" }] : []), ...(chk.crit ? [{ text: "Critical", cls: "crit" }] : [])];
    return `<div class="mrow t${chk.tier}"><span class="mname">${esc(name)}</span>`
      + `<span class="shield small ${win ? "win" : "lose"}"><b class="rtotal">${chk.total}</b><small class="vsdc">${chk.dcLabel ?? "DC"} ${chk.dc}</small></span><span class="rtag rolled${chk.tier === 1 ? " fail" : ""}">Tier ${chk.tier}</span>`
      + (tags.length ? `<div class="mchips">${tags.map(t => `<span class="chip ${t.cls ?? ""}">${esc(t.text)}</span>`).join("")}</div>` : "")
      + (g.odds ? `<div class="modds">${esc(g.odds)}</div>` : "") + `</div>`;
  }).join("");
  return `<div class="chk multi"><div class="chkline"><span class="chk-title">${esc(title)}</span><span class="dice">${diceHtml}</span></div>`
    + (chips.length ? `<div class="chips">${chips.map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : "") + `<div class="mtable">${rowHtml}</div></div>`;
}

export async function rollCheck({ actor, label, mod = 0, boons = 0, banes = 0, dc = 13, chips = null, sources = [], manualBoons = 0, manualBanes = 0, adj = 0, favored = false, doomed = false } = {}) {
  const r = await performCheck({ mod, boons, banes, dc, sources, manualBoons, manualBanes, adj, favored, doomed });
  // v0.0.447 (Lucas's checklist, hud-identity: a Save from the HUD "sends a very old card style"): a Check or a Save is drawn as the chat card of
  // an Action (chatcards.mjs: the stamp, the ladder against its DC, the breakdown), without the target line; the old block only if that fails
  let content = "";
  try {
    const CC = await import("./chatcards.mjs"), { ccRowOf } = await import("./actions.mjs");
    const row = { ...ccRowOf({ ...r, dcLabel: "DC" }, String(actor?.name ?? ""), "", String(chips?.[0] ?? "").replace(/\s*[+\u2212-]\s*\d+$/, "") || "Modifier") };
    content = CC.cardContent({ kind: "attack", name: label, freq: "", cost: "", traitsHtml: "", flavor: "", hasDamage: false, outcomes: {}, rows: [row], locked: true })
      .replace(/<hr class="cc-hr"><div class="cc-foot">[\s\S]*?<\/div>(?=(?:<div class="cc-des|<div class="cc-pfoot|<\/div>\s*$))/, "");
  } catch (e) { console.warn("twod12 | the Check card", e); }
  if (!content) content = `<div class="twod12 chat">${checkHtml(label, r, [...(chips ?? (mod ? [`Modifier ${sgn(mod)}`] : [])), `DC ${dc}`], { showTier: true })}</div>`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: r.rolls, content });
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
    // v0.0.415 (pack CL): a system card (was a plain block)
    content: (await import("./sysmsg.mjs")).sysCard({ title: `${kind === "dying" ? "Dying" : "Shattered"} Table`, lead: `${esc(actor.name)}: ${band}`, text: `${formula} = <b>${r.total}</b>; Wounds now ${w + 1}.` })
  });
}
