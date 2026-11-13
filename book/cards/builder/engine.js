// The Action Builder's pricing (no DOM): the page and test.mjs both run this file. DATA is builder-data.mjs's block; CALC is the system's own calc.mjs
// (build.mjs pastes its source: the dice are not written a second time); the NPC price functions below the marker are budget.mjs's own source.
function makeEngine(DATA, CALC) {
  "use strict";
  const PC = DATA.pc, NPC = DATA.npc, P = NPC.budget, PRICES = () => P, SEV = ["forced", "mild", "moderate", "severe", "extreme"];
  /*@@NPC_FN@@*/
  const sum = a => a.reduce((s, x) => s + x, 0), r1 = x => Math.round(x * 10) / 10, clone = o => JSON.parse(JSON.stringify(o));
  const TYPES = ["Ac", "Bl", "Co", "El", "Fi", "Fo", "Ho", "Pi", "Ps", "Sl", "Th", "Un"], TYPE_RE = new RegExp(`\\s+(${TYPES.join("|")})$`);
  const stripLinks = s => String(s ?? "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\*\*(.+?)\*\*/g, "$1");

  /* ------------------------------------------------------------ damage as the book writes it */
  /** "[V] 1[W] + [Mod] + [R] 1d6 Ho" -> { w, mod, pmod, flat, dice: [[n, sides, explodes]], pool, type } (null: not damage). */
  function parseDmg(text) {
    let s = stripLinks(text).trim(); const out = { w: 0, mod: 0, pmod: 0, flat: 0, dice: [], pool: "", type: "" };
    if (!s || s === "-" || s === "0") return out;
    const ty = s.match(TYPE_RE); if (ty) { out.type = ty[1]; s = s.replace(TYPE_RE, ""); }
    for (const raw of s.split("+")) {
      const pm = raw.match(/\[(B|M|V|R)\]/); if (pm) out.pool = pm[1] === "B" ? "V" : pm[1] === "M" ? "R" : pm[1];
      const t = raw.replace(/\[(B|M|V|R)\]/g, "").trim(); let m;
      if ((m = t.match(/^(\d*)\[W\]$/))) out.w += Number(m[1] || 1);
      else if (/^\[Mod\]$/i.test(t)) out.mod += 1;
      else if (/^\[PMod\]$/i.test(t)) out.pmod += 1;
      else if ((m = t.match(/^(\d*)d(\d+)(!?)$/i))) out.dice.push([Number(m[1] || 1), Number(m[2]), !!m[3]]);
      else if (/^\d+$/.test(t)) out.flat += Number(t);
      else return null;
    }
    return out;
  }
  /** A tier cell "damage; text" -> { dmg (parsed; zero when the cell is all text), text }. */
  function parseCell(cell) {
    const s = String(cell ?? ""), i = s.indexOf(";"), a = (i < 0 ? s : s.slice(0, i)).trim(), b = i < 0 ? "" : s.slice(i + 1).trim(), d = parseDmg(a);
    return d ? { dmg: d, text: b, raw: a } : { dmg: parseDmg("0"), text: s.trim(), raw: "0" };
  }
  // An exploding die ("explodes -1": the top face counts one less and is rolled again) is worth +0.5 on average, as the ruler counts it (core.mjs avgDamage).
  const diceAvg = dice => sum(dice.map(([n, s, ex]) => n * ((s + 1) / 2 + (ex && s > 1 ? 0.5 : 0))));
  const weaponOf = name => { const w = DATA.weapons.find(x => x.name === name); return w ? { ...w, parsed: w.tiers.map(parseDmg) } : null; };
  const weaponAvg = (weapon, tier) => { const d = weapon?.parsed?.[tier - 1]; return d ? d.flat + diceAvg(d.dice) : 0; };
  /** Average of parsed damage on a Tier. ctx: { weapon (weaponOf), mod (the [Mod] the damage adds), pmod }. */
  const avgDmg = (d, ctx, tier) => (d ? d.w * weaponAvg(ctx.weapon, tier) + d.mod * (ctx.mod ?? 0) + d.pmod * (ctx.pmod ?? 0) + d.flat + diceAvg(d.dice) : 0);
  const avgExpr = (text, ctx) => { const d = parseDmg(String(text ?? "").replace(/\s+/g, "").replace(/\+/g, " + ")); return d ? avgDmg(d, ctx, 2) : null; };

  /* ------------------------------------------------------------ the roll (the system's calc.mjs) */
  /** Tier chances and the Critical's. roll: { mod, dc, boons, banes, state }. */
  const probs = roll => ({ p: CALC.tierProbs(roll.mod, roll.dc, roll.boons || 0, roll.banes || 0, roll.state || ""), crit: CALC.critProb(roll.mod, roll.dc, roll.boons || 0, roll.banes || 0, roll.state || "") });
  const expOf = (avgs, p) => sum(avgs.map((a, i) => a * p[i]));
  const zeroOf = (avgs, p) => sum(avgs.map((a, i) => (a <= 0 ? p[i] : 0)));

  /* ------------------------------------------------------------ drafts */
  const blankTier = () => ({ w: 0, mod: false, flat: 0, dn: 0, ds: 6, ex: false, pool: "V", type: "", text: "" });
  const blankVersion = (ap, on) => ({ ap, on: !!on, tiers: [blankTier(), blankTier(), blankTier()], linked: 0, linkedExtra: "", riders: [], helps: [], effects: "", critical: "" });
  function blankDraft(tab) {
    const b = DATA.builds.find(x => /Smite/.test(x.name)) ?? DATA.builds[0];
    return { id: "", tab, name: "", category: tab === "npc" ? "Special Action" : "", level: "", flavor: "", traits: tab === "npc" ? "melee, strike, weapon" : "strike, weapon", kind: "weapon", vs: "AD", frequency: tab === "npc" ? "Round" : "Round",
      reaction: "", reactionCost: 1, reactionText: "", fires: 0.5, rxKind: "other",
      target: "one", targetsN: 2, areaShape: "Emanation", areaSize: 2, areaFrom: "self", distance: tab === "npc" ? "Weapon" : "Weapon", targetText: "", setup: "",
      cls: b.name, weapon: b.weapon, wmod: b.wmod, pmod: b.pmod, saveMod: 1, boons: 0, banes: 0, state: "", elite: false, fight: "normal", enemies: 0,
      rank: "standard", rating: "medium", modRating: "medium", ranged: false, basic: false, four: false, npc: "",
      versions: [blankVersion(1, true), blankVersion(2, false), blankVersion(3, false)], compare: "" };
  }
  /** A draft read again (an older save, a paste): every field it lacks filled from a blank one. */
  function normalize(d) {
    const b = blankDraft(d?.tab === "npc" ? "npc" : "pc"), out = { ...b, ...d, versions: [1, 2, 3].map(ap => { const v = (d?.versions ?? []).find(x => x.ap === ap); return v ? { ...blankVersion(ap, v.on), ...v, tiers: [0, 1, 2].map(i => ({ ...blankTier(), ...(v.tiers?.[i] ?? {}) })), riders: (v.riders ?? []).map(r => ({ at: "hit", ...r })), helps: (v.helps ?? []).map(h => ({ kind: "heal", amount: "", who: "ally", n: 1, at: "always", ...h })) } : blankVersion(ap, false); }) };
    return out;
  }
  /** A tier of the form as the book's text: "[V] 1[W] + [Mod] + [R] 1d6 Ho". */
  function tierDamage(t) {
    const terms = []; let pool = "";
    const put = (pl, s) => { terms.push(pl !== pool ? `[${pl}] ${s}` : s); pool = pl; };
    if (t.w > 0) put("V", `${t.w}[W]`);
    if (t.mod) put(t.w > 0 ? "V" : t.pool, "[Mod]");
    if (Number(t.flat) > 0) put(t.pool, String(Number(t.flat)));
    if (t.dn > 0) put(t.pool, `${t.dn}d${t.ds}${t.ex ? "!" : ""}`);
    return terms.length ? terms.join(" + ") + (t.type ? ` ${t.type}` : "") : "0";
  }
  const isSave = d => d.kind === "save", noRoll = d => d.kind === "none";
  const freqKey = f => (f === "Encounter" || f === "Daily" ? "enc" : f === "At-will" ? "atwill" : "round");
  const ridersAt = (v, at) => v.riders.filter(r => r.name && r.at === at).map(r => r.name);
  function helpText(h, d) {
    const who = h.who === "self" ? "you gain" : h.who === "allies" ? `${h.n} allies gain` : "an ally gains", amt = h.amount || "?";
    if (d.tab === "npc") return h.kind === "boon" ? `${h.who === "allies" ? `${h.n} allies` : "an ally"} within 5 squares gain${h.who === "allies" ? "" : "s"} 1 Boon on ${h.who === "allies" ? "their" : "its"} next attack` : h.kind === "basic" ? `${h.who === "allies" ? `${h.n} allies make their` : "an ally makes its"} Basic attack` : `${h.who === "self" ? "it heals" : h.who === "allies" ? `${h.n} allies heal` : "an ally heals"} ${amt}`;
    if (h.kind === "heal") return `${h.who === "self" ? "you heal" : h.who === "allies" ? `${h.n} allies heal` : "an ally heals"} ${amt}`;
    if (h.kind === "rally") return `${h.who === "self" ? "you can use" : h.who === "allies" ? `${h.n} allies can each use` : "an ally can use"} 1 Rally Point${h.amount ? `, healing ${amt} more` : ""}`;
    if (h.kind === "guard") return `${who} [[Guard]] ${amt}`;
    if (h.kind === "defense") return `${who} +1 Defense until your next turn`;
    if (h.kind === "block") return `the triggering damage is reduced by ${amt}`;
    return "";
  }
  const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : s);
  /** A Version's Effects cell, written from the form (riders on a hit, the helps, then the free text). */
  function effectsText(v, d) {
    const parts = [...ridersAt(v, "hit").map(n => `${n}.`)];
    for (const h of v.helps) { const t = helpText(h, d); if (t) parts.push(cap(t) + (h.at === "t3" ? ` (${isSave(d) ? "Tier 1" : "Tier 3"} only)` : h.at === "always" && !noRoll(d) ? " (whatever the result)" : "") + "."); }
    if (v.linked > 0) parts.push(`You make ${v.linked === 1 ? "a Weapon Attack" : `${["", "", "two", "three"][v.linked] ?? v.linked} Weapon Attacks`} (1A)${v.linkedExtra ? `, each dealing ${v.linkedExtra} more` : ""}.`);
    if (v.effects) parts.push(v.effects.trim());
    return parts.join(" ");
  }
  /** The three tier cells of a Version (the damage, then the riders that sit on that Tier only). */
  function tierCells(v, d) {
    const best = isSave(d) ? 0 : 2, miss = isSave(d) ? 2 : 0;
    return v.tiers.map((t, i) => { const dm = tierDamage(t), extra = [...(i === best ? ridersAt(v, "t3") : []), ...(i === miss ? ridersAt(v, "miss") : [])].map(n => `${n}.`).join(" "), txt = [extra, t.text].filter(Boolean).join(" "); return txt ? (dm === "0" ? txt : `${dm}; ${txt}`) : dm; });
  }
  const hasTiers = (v, d) => !noRoll(d) && (v.tiers.some(t => tierDamage(t) !== "0" || t.text) || v.riders.some(r => r.name) || !v.linked);
  const areaText = d => (d.target !== "area" ? "" : d.areaShape === "Aura" ? `Aura ${d.areaSize}` : `${d.areaSize} ${d.areaShape}`);
  const targetLine = d => d.targetText || (d.target === "one" ? "One creature" : d.target === "several" ? `${cap(["", "one", "two", "three", "four", "five", "six"][d.targetsN] ?? String(d.targetsN))} creatures` : d.areaFrom === "self" && d.areaShape !== "Aura" ? "Each enemy in the area" : "Each creature in the area");
  const vsLine = d => (noRoll(d) ? "" : isSave(d) ? `${d.vs === "AD" || d.vs === "WD" ? "Body" : d.vs} Save` : d.vs);
  const costLine = d => { const on = d.versions.filter(v => v.on).map(v => v.ap); return d.reaction ? `${d.reactionCost}R` : `${on.join(" / ")} AP`; };

  /** The ruler's line for a Version, where the form can say it (book/cards/README.md, "The extras": `ruler`). */
  function rulerLine(v, d) {
    const fx = [], bars = [], hit = isSave(d) ? "on 1: X; on 2: X" : "on 2+: X", best = isSave(d) ? "on 1: X" : "on 3: X", miss = isSave(d) ? "on 3: X" : "on 1: X";
    const tok = (name) => (d.tab === "npc" ? (/^(Pushed|Pulled|Slid) (\d)/.test(name) ? `${{ Pushed: "push", Pulled: "pull", Slid: "slide" }[name.split(" ")[0]]} ${name.match(/\d/)[0]}` : /^Vulnerable (\d)/.test(name) ? `vulnerable ${name.match(/\d/)[0]}` : `debuff ${name}`) : (PC.riders.find(r => r.name === name)?.ruler ?? `debuff ${name}`));
    for (const r of v.riders.filter(x => x.name)) { const t = tok(r.name), w = noRoll(d) || r.at === "always" ? "always: X" : r.at === "t3" ? best : r.at === "miss" ? miss : hit; fx.push(w.replace(/X/g, t)); }
    for (const h of v.helps) {
      const amt = String(h.amount || "0").replace(/\s+/g, ""), who = h.who === "self" ? "self" : h.who === "allies" ? "any" : "ally", w = noRoll(d) || h.at === "always" ? (d.reaction || noRoll(d) ? "" : "always: ") : h.at === "t3" ? best.replace("X", "") : hit.split(";")[0].replace("X", "");
      const t = h.kind === "heal" ? `mend ${amt} ${who}` : h.kind === "rally" ? `heal 1${h.amount ? `; mend ${amt} ${who}` : ""}` : h.kind === "guard" ? `guard ${amt} ${who}` : h.kind === "defense" ? `defense 1 ${h.who === "allies" ? "allies" : "ally"}` : h.kind === "block" ? `block ${amt}` : h.kind === "boon" ? `boon 1 ${who}` : "";
      if (t) fx.push(w + t); if (h.who === "allies" && h.n > 1) bars.push(`allies ${h.n}`);
    }
    if (v.linked > 0) bars.push(`does Weapon Attack${v.linked > 1 ? ` x${v.linked}` : ""}`, ...(v.linkedExtra ? [`each extra ${v.linkedExtra.replace(/\s+/g, "")}`] : []), ...(d.target === "several" ? ["different"] : []));
    if (d.target === "area") { const a = areaInfo(d); bars.push(`area ${r1(a.hit[0])}`); }
    return [...bars, fx.join("; ")].filter(Boolean).join(" | ");
  }
  /** The draft as a card of book/cards (the keys in the README's order). */
  function toCard(d) {
    const card = { name: d.name || "Unnamed Action", category: d.category || (d.tab === "npc" ? "Special Action" : "Class Action") };
    if (d.level !== "" && d.level != null) card.level = Number(d.level);
    if (d.tab === "npc") { card.book = false; card.npc = d.npc || `${NPC.rank[d.rank].label} (${d.rating})`; }
    card.flavor = d.flavor || "";
    card.traits = String(d.traits).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    card.frequency = d.frequency;
    if (d.reaction) card[d.reaction] = d.reactionText || "";
    card.target = d.reaction && !d.targetText ? "The triggering creature" : targetLine(d);
    if (d.target === "area") card.area = areaText(d);
    if (d.distance && !(d.target === "area" && d.areaShape === "Aura")) card.distance = d.distance;
    if (vsLine(d)) card.vs = vsLine(d);
    const setup = [...new Set(d.versions.filter(v => v.on).flatMap(v => (noRoll(d) ? [] : ridersAt(v, "always"))))];
    if (d.setup || setup.length) card.setup = [d.setup, ...setup.map(n => `${n}.`)].filter(Boolean).join(" ");
    card.versions = d.versions.filter(v => v.on).map(v => {
      const o = { ap: d.reaction ? d.reactionCost : v.ap }, fx = effectsText(v, d), rl = rulerLine(v, d);
      if (hasTiers(v, d)) o.tiers = tierCells(v, d);
      if (fx) o.effects = fx; if (v.critical) o.critical = v.critical; if (rl) o.ruler = rl;
      return o;
    });
    if (d.tab === "npc") card.ruler = false;
    return card;
  }
  /** An existing card into the form (its damage, its texts; what the form can't hold stays in the Effects text). */
  function fromCard(card, tab) {
    const d = blankDraft(tab), tr = card.traits ?? [];
    Object.assign(d, { name: card.name, category: card.category ?? "", level: card.level ?? "", flavor: card.flavor ?? "", traits: tr.join(", "), frequency: card.frequency ?? "Round", distance: card.distance ?? "", setup: card.setup ?? "", npc: card.npc ?? "" });
    d.kind = tr.includes("save") ? "save" : tr.includes("power") && !tr.includes("weapon") ? "power" : "weapon";
    const vs = String(card.vs ?? "AD"); d.vs = /WD/.test(vs) ? "WD" : /AD/.test(vs) ? "AD" : (vs.match(/Body|Mind|Appeal|Instinct/)?.[0] ?? "AD");
    if (/Save/.test(vs)) d.kind = "save";
    if (card.interrupt || card.trigger) { d.reaction = card.interrupt ? "interrupt" : "trigger"; d.reactionText = card.interrupt ?? card.trigger; d.reactionCost = card.versions[0]?.ap || 1; }
    const am = String(card.area ?? "").match(/(Aura) (\d)|(\d)(?: \/ \d)* (Emanation|Burst)/);
    if (am) { d.target = "area"; d.areaShape = am[1] ?? am[4]; d.areaSize = Number(am[2] ?? am[3]); d.areaFrom = /sq\.|range/i.test(card.distance ?? "") ? "range" : "self"; }
    else { const n = { two: 2, three: 3, four: 4 }[String(card.target ?? "").split(" ")[0].toLowerCase()]; if (n) { d.target = "several"; d.targetsN = n; } }
    d.targetText = card.target && !/^(One creature|Two creatures|Three creatures)$/.test(card.target) ? card.target : "";
    for (const v of d.versions) v.on = false;
    card.versions.forEach((cv, k) => {
      const v = d.reaction ? d.versions[k] : d.versions.find(x => x.ap === cv.ap); if (!v) return;
      v.on = true; v.effects = cv.effects ?? ""; v.critical = cv.critical ?? "";
      (cv.tiers ?? []).forEach((cell, i) => { const c = parseCell(cell), x = c.dmg, t = v.tiers[i]; t.w = x.w; t.mod = x.mod > 0; t.flat = x.flat; t.dn = x.dice[0]?.[0] ?? 0; t.ds = x.dice[0]?.[1] ?? 6; t.ex = !!x.dice[0]?.[2]; t.type = x.type; t.pool = x.w ? (x.dice.length || x.flat ? (/\[R\]|\[M\]/.test(cell) ? "R" : "V") : "V") : (x.pool || "V"); t.text = c.text; });
      const lm = String(cv.ruler ?? "").match(/does Weapon Attack(?: x(\d))?/); if (lm && !cv.tiers) { v.linked = Number(lm[1] ?? 1); v.linkedExtra = String(cv.ruler).match(/each extra (\S+)/)?.[1] ?? ""; }
    });
    if (!d.versions.some(v => v.on)) d.versions[0].on = true;
    return d;
  }

  /* ------------------------------------------------------------ Areas: how many creatures one catches */
  /** The measured numbers for the draft's Area: { hit: [4 Standards, 6 Standards], rows (every measured Area of that shape), measured }. */
  function areaInfo(d) {
    const shape = d.areaShape === "Aura" ? "Emanation" : d.areaShape, from = d.areaShape === "Aura" ? "self" : d.areaFrom, size = Number(d.areaSize), all = [...PC.areas.map(a => ({ ...a, card: a.label })), ...DATA.areasGrid];
    let rows = all.filter(a => a.shape === shape && a.size === size && a.from === from), measured = rows.length > 0;
    if (!measured) { const pool = all.filter(a => a.from === from), best = Math.min(...pool.map(a => Math.abs(a.size - size) + (a.shape === shape ? 0 : 0.5))); rows = pool.filter(a => Math.abs(a.size - size) + (a.shape === shape ? 0 : 0.5) === best); }
    return { hit: [0, 1].map(k => sum(rows.map(a => a.hit[k])) / rows.length), rows, measured, from, shape, size };
  }
  /** What one use is multiplied by for its targets, on the PC budget: N creatures N times; an Area the guide's share (half to each from range, two thirds around yourself). */
  function pcTargets(d) {
    if (d.target === "several") return { mult: Math.max(1, Number(d.targetsN) || 1), why: `${d.targetsN} creatures` };
    if (d.target !== "area") return { mult: 1, why: "" };
    const a = areaInfo(d), share = PC.areaShare[a.from];
    return { mult: 1 / share, why: a.from === "range" ? "an Area from range should deal half to each: its points count double" : "an Area around yourself should deal two thirds to each: its points count 1.5 times", area: a };
  }

  /* ------------------------------------------------------------ the PC budget */
  const NEXT = { mild: "moderate", moderate: "severe", severe: "extreme", extreme: "beyond" };
  const pcRiderBase = (name, elite) => { const r = PC.riders.find(x => x.name === name); if (!r) return null; const size = elite && r.eliteUp ? NEXT[r.size] : r.size; return { ...r, sizeUsed: size, price: size === "beyond" ? PC.riderPrice.extreme + P.riders.step : PC.riderPrice[size] }; };
  /** The roll a PC draft makes: its Modifier and what the [Mod] of its damage is. */
  function pcCtx(d) {
    const weapon = weaponOf(d.weapon), rollMod = d.kind === "power" ? Number(d.pmod) : d.kind === "save" ? (/power/.test(d.traits) ? Number(d.pmod) : Number(d.wmod)) : Number(d.wmod);
    return { weapon, mod: rollMod, pmod: Number(d.pmod), wmod: Number(d.wmod), rollMod, seat: weapon?.ranged ? "ranged" : "melee" };
  }
  const rollOf = (d, ctx, dc) => (isSave(d) ? { mod: dc, dc: 11 + ctx.rollMod, boons: d.boons, banes: d.banes, state: d.state } : { mod: ctx.rollMod, dc, boons: d.boons, banes: d.banes, state: d.state });
  /** A Weapon Attack's averages by Tier for this PC (0 / 1[W] + [Mod] / 1[W] + [Mod]) and its expected damage against the budget's Defense (13). */
  function weaponAttack(ctx) {
    const d = parseDmg("1[W] + [Mod]"), c = { ...ctx, mod: ctx.wmod }, avgs = [0, avgDmg(d, c, 2), avgDmg(d, c, 3)], p = CALC.tierProbs(ctx.wmod, PC.refDefense);
    return { avgs, p, exp: expOf(avgs, p), hit: p[1] + p[2] };
  }
  /** A Version's average damage by Tier (the form's tiers, and its Weapon Attacks (1A) counted on a hit). */
  function versionAvgs(v, d, ctx) {
    const base = noRoll(d) ? [0, 0, 0] : v.tiers.map((t, i) => avgDmg(parseDmg(tierDamage(t)), ctx, i + 1));
    return base;
  }
  function pricePc(d, v, opts = {}) {
    const ctx = pcCtx(d), wa = weaponAttack(ctx), avgs = versionAvgs(v, d, ctx), save = isSave(d), none = noRoll(d);
    const ref = none ? [0, 0, 1] : probs(rollOf(d, ctx, save ? 1 : PC.refDefense)).p, refPlain = none ? ref : CALC.tierProbs(save ? 1 : ctx.rollMod, save ? 11 + ctx.rollMod : PC.refDefense);
    const hitI = save ? [0, 1] : [1, 2], best = save ? 0 : 2, missI = save ? 2 : 0, pHit = none ? 1 : refPlain[hitI[0]] + refPlain[hitI[1]];
    const T = pcTargets(d), fight = PC.fights.find(f => f.key === d.fight) ?? PC.fights[0];
    const linkAvg = v.linked > 0 ? v.linked * (wa.exp + wa.hit * (avgExpr(v.linkedExtra, ctx) ?? 0)) : 0;
    const dmgPts = PC.wa * expOf(avgs, refPlain) / wa.exp, linkedPts = PC.wa * linkAvg / wa.exp;
    const lines = [];
    if (dmgPts > 0.05) lines.push({ what: T.mult !== 1 ? `Damage, ${r1(dmgPts)} to each × ${r1(T.mult)}` : "Damage", pts: dmgPts * T.mult, note: T.why });
    if (linkedPts > 0) lines.push({ what: `${v.linked} Weapon Attack${v.linked > 1 ? "s" : ""} (1A)${v.linkedExtra ? ` + ${v.linkedExtra}` : ""}`, pts: linkedPts });
    for (const r of v.riders.filter(x => x.name)) {
      const b = pcRiderBase(r.name, d.elite); if (!b) continue;
      const at = none ? "always" : r.at, f = at === "hit" ? 1 : at === "t3" ? refPlain[best] / pHit : at === "miss" ? refPlain[missI] / pHit : 1 / wa.hit;
      lines.push({ what: `${r.name} (${b.sizeUsed}${at === "hit" ? "" : at === "t3" ? ", best Tier only" : at === "miss" ? ", on a miss" : ", always"})`, pts: b.price * f * T.mult, note: b.measured ? `measured ${b.measured.melee} melee · ${b.measured.ranged} ranged · ${b.measured.elite} against an Elite` : "not measured: priced as Mild (the guide)", rider: true });
    }
    for (const h of v.helps) {
      const amt = avgExpr(h.amount, ctx) ?? 0, n = h.who === "allies" ? Math.max(1, Number(h.n) || 1) : 1, ch = none || h.at === "always" ? 1 : h.at === "t3" ? refPlain[best] : pHit;
      const per = h.kind === "heal" || h.kind === "rally" ? PC.health * fight.healFactor : h.kind === "guard" ? PC.guard * fight.healFactor : h.kind === "block" ? (d.reaction ? PC.blockPoint : PC.health * fight.healFactor) : 0;
      const pts = h.kind === "defense" ? PC.defense1 * n * ch : amt * per * n * ch;
      lines.push({ what: cap(stripLinks(helpText(h, d))), pts, help: true, health: h.kind === "defense" ? 0 : amt * n * ch,
        note: h.kind === "rally" ? `the Rally Point's own heal is priced 0 (it moves Health the ally already had; measured ${PC.rallyHeal} for the bare AP); only what the card adds on top counts` : h.kind === "defense" ? `measured ${PC.defense1} for 1 AP` : h.kind === "block" && d.reaction ? `${r1(PC.blockPoint)} points a point blocked each time it fires (Shield of Faith's measure)` : `${r1(amt * n * ch)} Health on average × ${r1(per)} points (about ${r1(amt * n * ch * fight.dmgPerHealth)} damage dealt in this fight)` });
    }
    let total = sum(lines.map(l => l.pts)), budget, band, rx = null;
    const big = d.frequency === "Encounter" || d.frequency === "Daily";
    if (d.reaction) {
      const fires = Number(d.fires) || 0.5, dmg = sum(lines.filter(l => !l.help).map(l => l.pts)), help = sum(lines.filter(l => l.help).map(l => l.pts));
      rx = { fires, raw: total, dmg, help, damageShare: PC.reactionDamage };
      total = fires * (dmg * PC.reactionDamage + help);
      band = PC.reactionBand.map(x => x * (Number(d.reactionCost) === 2 ? 2 : 1) * (big ? PC.encounter : 1)); budget = (band[0] + band[1]) / 2;
    } else { budget = PC.ap[v.ap] * (big ? PC.encounter : 1); const tol = Math.max(5, budget * 0.1); band = [budget - tol, budget + tol]; }
    const perDef = (opts.defenses ?? (save ? [0, 1, 2] : [13, 14, 16, 18])).map(dc => { const r = none ? { p: [0, 0, 1], crit: 0 } : probs(rollOf(d, ctx, dc)); return { dc, p: r.p, crit: save ? 0 : r.crit, exp: expOf(avgs, r.p) + (v.linked ? linkAvg * 0 : 0), zero: zeroOf(avgs, r.p) }; });
    const flags = [];
    const missAvg = avgs[missI];
    if (!none && !d.reaction && missAvg <= 0 && !(v.linked > 0)) flags.push({ level: d.frequency === "At-will" || d.frequency === "Round" ? "bad" : "note", text: `${save ? "The target's Tier 3" : "Tier 1"} deals nothing${d.frequency === "At-will" || d.frequency === "Round" ? ": every build needs an attack it uses most turns that deals something on Tier 1 (your rule of thumb, 2026-11-13)" : " (fine on a big Action; the rule of thumb is for the attack used most turns)"}` });
    if (v.tiers.some(t => t.dn > 1 || (t.dn > 0 && t.ds > 8))) flags.push({ level: "note", text: "The book writes damage as a flat number plus at most one small die (d4, d6, d8)" });
    if (v.riders.filter(r => r.name).length > 2) flags.push({ level: "note", text: "More than 2 riders on one Action" });
    if (big && d.frequency === "Daily") flags.push({ level: "note", text: "A Daily Action is priced as an Encounter one (double): the PC budget doesn't measure Dailies" });
    if (d.reaction && Number(d.reactionCost) === 2) flags.push({ level: "note", text: "A 2R Reaction is priced at twice the 1R band: not measured" });
    if (d.target === "area" && !T.area.measured) flags.push({ level: "note", text: `A ${areaText(d)} ${T.area.from === "self" ? "around you" : "from range"} was not measured: the count is the nearest measured Area's` });
    return { ap: v.ap, ctx, wa, avgs, ref: refPlain, lines, total, budget, band, rx, perDef, flags, targets: T, verdict: verdict(total, band), linkAvg, exp13: expOf(avgs, refPlain) + linkAvg, zero13: v.linked > 0 ? 0 : zeroOf(avgs, refPlain), dmgPts, linkedPts };
  }
  const verdict = (total, band) => (total < band[0] ? "under" : total > band[1] ? "over" : "on");

  /* ------------------------------------------------------------ the Bestiary's turn budget */
  const lower = { extreme: "high", high: "medium", medium: "low", low: "terrible", terrible: "terrible" };
  const LADDER = i => (i <= 0 ? 0 : i <= 5 ? P.riders[SEV[i - 1]] : P.riders.extreme + P.riders.step * (i - 5));
  /** A Bestiary rider's price where it is (hit, t3, setup), one size less when four or more creatures carry it. */
  function npcRiderPrice(name, at, four) {
    const r = NPC.riders.find(x => x.name === name); if (!r) return null;
    if (/^Staggered/.test(name) && at === "setup") return { ...r, used: 12 - (four ? P.riders.severe - P.riders.moderate : 0) };
    const shift = (at === "setup" ? 1 : at === "t3" ? -1 : 0) - (four ? 1 : 0);
    if (r.sev === "beyond2") return { ...r, used: Math.max(0, r.price + P.riders.step * shift) };
    if (!four && SEV.includes(r.sev)) return { ...r, used: riderPrice(r.sev, at === "setup" ? "setup" : at === "t3" ? "t3" : "hit", P) };   // the ruler's own function
    return { ...r, used: LADDER((r.sev === "beyond1" ? 6 : SEV.indexOf(r.sev) + 1) + shift) };
  }
  function npcCtx(d) {
    const rk = NPC.rank[d.rank], ri = NPC.ratings.indexOf(d.modRating), mod = rk.modBy[Math.min(ri, rk.modBy.length - 1)];
    return { weapon: null, mod, pmod: mod, rollMod: mod, rank: rk, refMod: rk.modBy[2] };
  }
  /** Points of written damage: what it deals on average over what one point deals, at the rank's Medium Modifier against Defense 13 (a 25-point Basic attack is 3.5 / 5.5). */
  function npcPoints(avgs, ctx) { const p = CALC.tierProbs(ctx.refMod, 13); return expOf(avgs, p) / (p[1] * P.toDamage[0] + p[2] * P.toDamage[1]); }
  function priceNpc(d, v, opts = {}) {
    const ctx = npcCtx(d), save = isSave(d), none = noRoll(d), fk = freqKey(d.frequency), attack = !none;
    const rating = d.ranged && attack ? Array.from({ length: NPC.rangedStep }).reduce(r => lower[r], d.rating) : d.rating, ap = d.reaction ? Number(d.reactionCost) : v.ap;
    const price = d.reaction ? actionPoints(d.rank, ap, "round", rating, P) : actionPoints(d.rank, ap, fk, rating, P);
    const raw = none ? [0, 0, 0] : v.tiers.map((t, i) => avgDmg(parseDmg(tierDamage(t)), ctx, i + 1)), asAttack = save ? [raw[2], raw[1], raw[0]] : raw;
    const multi = d.target === "one" ? 1 : fk === "enc" && !d.reaction ? P.multiEnc : P.multi, dmgPts = npcPoints(asAttack, ctx), lines = [];
    if (dmgPts > 0.05) lines.push({ what: multi !== 1 ? `Damage, ${r1(dmgPts)} to each (${fk === "enc" ? "half" : "two thirds"} of its points)` : "Damage", pts: dmgPts / multi });
    const explodes = v.tiers.some(t => t.dn > 0 && t.ex);
    if (explodes && !d.basic) lines.push({ what: "An exploding die (!)", pts: P.explode });
    for (const r of v.riders.filter(x => x.name)) { const at = none ? "hit" : r.at === "always" ? "setup" : r.at === "miss" ? "setup" : r.at, b = npcRiderPrice(r.name, at, d.four); if (b) lines.push({ what: `${r.name} (${b.sev.replace(/beyond\d/, "beyond")}${at === "setup" ? ", Setup: one size more" : at === "t3" ? ", Tier 3 only: one size less" : ""}${d.four ? ", four or more carry it: one size less" : ""})`, pts: b.used, rider: true }); }
    for (const h of v.helps) {
      const n = h.who === "allies" ? Math.max(1, Number(h.n) || 1) : 1, amt = avgExpr(h.amount, ctx) ?? 0;
      const pts = h.kind === "boon" ? P.help.boon * n : h.kind === "basic" ? P.perAp[d.rank] * P.rating[d.rating] * n : amt * P.help.health * n;
      lines.push({ what: cap(helpText(h, d)), pts, help: true });
    }
    const total = sum(lines.map(l => l.pts)), tol = Math.max(3, price * 0.1), band = [price - tol, price + tol], other = sum(lines.filter((l, i) => !(i === 0 && dmgPts > 0.05)).map(l => l.pts));
    const left = Math.max(0, price - other) * multi, buys = none ? null : pointsAvg(left, P).map(expr);
    const budget = turnBudget(d.rank, d.rating, P), perAp = P.perAp[d.rank] * P.rating[d.rating];
    const perDef = (opts.defenses ?? (save ? [0, 1, 2] : [12, 13, 14])).map(dc => { const r = none ? { p: [0, 0, 1], crit: 0 } : probs(save ? { mod: dc, dc: 11 + ctx.rollMod, boons: d.boons, banes: d.banes, state: d.state } : { mod: ctx.rollMod, dc, boons: d.boons, banes: d.banes, state: d.state }); return { dc, p: r.p, crit: save ? 0 : r.crit, exp: expOf(raw, r.p), zero: zeroOf(raw, r.p) }; });
    const flags = [], ri = NPC.ratings.indexOf(d.rating);
    if (explodes && !NPC.rank[d.rank].explodes) flags.push({ level: "bad", text: "A Minor enemy's dice never explode (Minions and Grunts)" });
    if (d.basic && raw[save ? 2 : 0] > 0) flags.push({ level: "note", text: "A Basic attack's Tier 1 deals nothing" });
    if (d.basic && (v.ap !== 1 || d.frequency !== "At-will")) flags.push({ level: "note", text: "The Basic attack is 1 AP, At-will" });
    if (!d.reaction && fk === "enc" && ap >= 2 && d.target === "one") flags.push({ level: "bad", text: `A ${ap} AP Encounter Action should hit several creatures: against one PC it is a killing blow (count the encounter one step harder if a boss keeps it)` });
    if (!d.reaction && fk === "enc") flags.push({ level: "note", text: `Its pay-back: every other Action of the creature, and its Reaction, loses ${["", "a fifth", "a quarter", "half"][ap]} of its points (${r1(P.payBack[ap] * budget)} of the turn budget)` });
    if (d.frequency === "Daily") flags.push({ level: "note", text: "The Bestiary has no Daily: priced as an Encounter Action" });
    if (d.reaction) { const share = ap === 2 ? P.reaction.twoR : d.rxKind === "self" ? P.reaction.self : P.reaction.other; flags.push({ level: "note", text: ap === 2 ? "A 2R Reaction takes nothing more off the turn (the AP it keeps is its price) and is weak on an NPC: prefer 1R" : `Off its turn budget: ${d.rxKind === "self" ? "a third" : "a quarter"} of its points, ${r1(share * price)}` }); if (!NPC.rank[d.rank].reactionAp) flags.push({ level: "bad", text: "Minions have no Reaction AP" }); }
    if (d.ranged && attack) flags.push({ level: "note", text: `A ranged attack pays one rating for its range: priced at ${rating}` });
    if (v.riders.filter(r => r.name).length > 2) flags.push({ level: "note", text: "At most 2 riders on an Action, as guidance" });
    if (d.rank === "minion" && d.rating === "extreme") flags.push({ level: "bad", text: "A Minion has no Extreme rating" });
    if (v.tiers.some(t => t.dn > 1 || (t.dn > 0 && t.ds > 8))) flags.push({ level: "note", text: "The Bestiary writes damage as a flat number plus at most one small die" });
    const s0 = NPC.stage0[d.rank], key = d.basic ? "basic" : `s${ap}`, table = s0[key]?.[Math.min(ri, (s0[key]?.length ?? 1) - 1)] ?? null;
    return { ap, ctx, avgs: raw, lines, total, budget: price, band, perDef, flags, verdict: verdict(total, band), buys, left, turnBudget: budget, perAp, share: price / budget, table, tableKey: key, exp13: perDef.find(x => x.dc === 13)?.exp ?? perDef[1].exp, zero13: perDef[1].zero, dmgPts, multi,
      sheet: { mod: ctx.rollMod, defense: NPC.defense[d.rank][Math.min(ri, NPC.defense[d.rank].length - 1)], health: s0.health[Math.min(ri, s0.health.length - 1)], ap: NPC.rank[d.rank].ap, cv: NPC.rank[d.rank].cv } };
  }
  const price = (d, v, opts) => (d.tab === "npc" ? priceNpc(d, v, opts) : pricePc(d, v, opts));

  /* ------------------------------------------------------------ an existing card on the same scale */
  /** A card's Versions priced for damage only, with the draft's PC (or its NPC): [{ ap, avgs, exp, zero, points, also }]. */
  function cardStats(card, d) {
    const npc = d.tab === "npc", ctx = npc ? npcCtx(d) : pcCtx(d), tr = card.traits ?? [], save = tr.includes("save") || /Save/.test(card.vs ?? "");
    const mod = npc ? ctx.rollMod : tr.includes("weapon") ? ctx.wmod : tr.includes("power") ? ctx.pmod : ctx.wmod, c = { ...ctx, mod }, wa = npc ? null : weaponAttack(ctx);
    return card.versions.map(cv => {
      let avgs = (cv.tiers ?? ["0", "0", "0"]).map((cell, i) => avgDmg(parseCell(cell).dmg, c, i + 1)), linkAvg = 0;
      const lm = String(cv.ruler ?? "").match(/does Weapon Attack(?: x(\d))?/);
      if (lm && !npc) { const n = Number(lm[1] ?? 1), ex = avgExpr(String(cv.ruler).match(/each extra (\S+)/)?.[1] ?? "", c) ?? 0; linkAvg = n * (wa.exp + wa.hit * ex); }
      const p = npc ? CALC.tierProbs(ctx.rollMod, 13) : save ? CALC.tierProbs(1, 11 + mod) : CALC.tierProbs(mod, PC.refDefense);
      const exp = expOf(avgs, p) + linkAvg, points = npc ? npcPoints(save ? [avgs[2], avgs[1], avgs[0]] : avgs, ctx) : PC.wa * exp / wa.exp;
      const led = PC.ledger.filter(l => l.action === card.name || l.action === `${card.name} ${cv.ap}`).map(l => l.points);
      return { ap: cv.ap, avgs, exp, zero: linkAvg ? 0 : zeroOf(avgs, p), points, ledger: [...new Set(led)], also: stripLinks(cv.effects ?? "") };
    });
  }
  /** The plain Weapon Attack (a PC) or the rank's table Basic attack (an NPC), as a comparison row. */
  function plainRow(d) {
    if (d.tab === "npc") { const ctx = npcCtx(d), ri = NPC.ratings.indexOf(d.rating), b = NPC.stage0[d.rank].basic, row = b[Math.min(ri, b.length - 1)], avgs = [0, ...row.map(s => avgDmg(parseDmg(s), ctx, 2))], p = CALC.tierProbs(ctx.rollMod, 13);
      return { name: `Basic attack (${NPC.rank[d.rank].label}, ${d.rating}: ${row.join(" / ")})`, ap: 1, avgs, exp: expOf(avgs, p), zero: p[0], points: npcPoints(avgs, ctx) }; }
    const ctx = pcCtx(d), wa = weaponAttack(ctx);
    return { name: `Weapon Attack (${d.weapon}, +${ctx.wmod})`, ap: 1, avgs: wa.avgs, exp: wa.exp, zero: wa.p[0], points: PC.wa };
  }

  /* ------------------------------------------------------------ Copy for Claude */
  function exportText(d) {
    const card = toCard(d), on = d.versions.filter(v => v.on), res = on.map(v => price(d, v)), pct = x => `${Math.round(x * 1000) / 10}%`;
    const computed = { tool: `Action Builder, data of ${DATA.generated}, ${DATA.stage}`, budget: d.tab === "npc" ? "the Bestiary's turn budget" : "the PC budget",
      built_for: d.tab === "npc" ? { rank: d.rank, damage_rating: d.rating, modifier: res[0]?.ctx.rollMod, ranged: !!d.ranged, basic_attack: !!d.basic, points_an_ap: res[0]?.perAp, turn_budget: res[0]?.turnBudget } : { class: d.cls, weapon: d.weapon, weapon_mod: Number(d.wmod), power_mod: Number(d.pmod), fight: d.fight, against_an_elite: !!d.elite },
      roll: noRoll(d) ? "none" : isSave(d) ? `the target's Save against DC ${11 + (res[0]?.ctx.rollMod ?? 0)}` : `2d12 + ${res[0]?.ctx.rollMod} Vs. ${d.vs}${d.boons || d.banes || d.state ? ` (${d.boons || 0} Boons, ${d.banes || 0} Banes${d.state ? `, ${d.state}` : ""})` : ""}`,
      versions: res.map(r => ({ ap: r.ap, points: r1(r.total), should_cost: r1(r.budget), within: r.band.map(r1), verdict: r.verdict === "on" ? "within limits" : r.verdict, breakdown: r.lines.map(l => `${l.what}: ${r1(l.pts)}`), ...(r.rx ? { reaction: `fires in ${pct(r.rx.fires)} of rounds; ${r1(r.rx.raw)} points each time it fires` } : {}), average_damage_by_tier: r.avgs.map(r1),
        chances: r.perDef.map(x => ({ [isSave(d) ? "save_modifier" : "defense"]: x.dc, tier1: pct(x.p[0]), tier2: pct(x.p[1]), tier3: pct(x.p[2]), ...(isSave(d) ? {} : { critical: pct(x.crit) }), average_damage: r1(x.exp), deals_0: pct(x.zero) })),
        ...(r.buys ? { the_points_left_buy: r.buys.join(" / ") } : {}), flags: r.flags.map(f => f.text) })) };
    return [`Action Builder draft: ${card.name} (${d.tab === "npc" ? "an NPC Action" : "a PC Action"}). Please measure it in the SIM.`, "", "Card (book/cards format):", "```json", JSON.stringify(card, null, 2), "```", "", "Computed by the page (a guide, not a measure):", "```json", JSON.stringify(computed, null, 2), "```", "", "Draft (the page's own form, to load it again):", "```json", JSON.stringify(d), "```"].join("\n");
  }

  return { DATA, parseDmg, parseCell, avgDmg, avgExpr, weaponOf, probs, expOf, zeroOf, blankDraft, blankVersion, normalize, tierDamage, tierCells, effectsText, rulerLine, toCard, fromCard, areaInfo, areaText, targetLine, vsLine, costLine, pcCtx, npcCtx, weaponAttack, pricePc, priceNpc, price, cardStats, plainRow, exportText, isSave, noRoll, freqKey, stripLinks, clone, r1, hasTiers, npcRiderPrice, pcRiderBase, pointsExpr: pts => pointsAvg(pts, P).map(expr), actionPoints: (rank, ap, f, rating) => actionPoints(rank, ap, f, rating, P), turnBudget: (rank, rating) => turnBudget(rank, rating, P) };
}
