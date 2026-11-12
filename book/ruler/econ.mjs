// The price list of the core rules (pack E1, 2026-10-29): what everything an Action can do is worth, in damage-equivalents (DE), at levels 1 to 3;
// then every Action, Reaction and passive of a class catalogue (book/ruler/catalogue/*.txt) priced against it, with a verdict for its Frequency.
// Exact dice math where it can (calc.mjs tierProbs: 2d12, exploding d12s, Doubles, Boons and Banes as 1d3-1, Favored and Doomed); the fight
// simulation (spec.mjs) for timing (how many turns reach each Escalation). Writes book/ruler/prices.md.
//   node book/ruler/econ.mjs            writes prices.md and prints it
//   node book/ruler/econ.mjs --quiet    writes prices.md only
// Positions (pack E2, positions.mjs with the map model map.mjs) price movement, Evade, Forced Movement, Cover, range, Hindered, Immobilized and Prone;
// what still has no price (NPC Saves, ending an effect, hazardous areas) is listed per Action.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);
const TW = CF.TWOD12, HERE = fileURLToPath(new URL(".", import.meta.url));
const PO = await import(new URL("./positions.mjs", import.meta.url).href);   // pack E2: the prices of positions (map.mjs)

/* ------------------------------------------------------------------ the assumptions (each one is in the report) */
export const A = {
  heal: 1.1,              // 1 Health healed = 1.1 DE (Lucas: "a tiny bit higher" than damage)
  downTurns: 1.5,         // a Down prevented or undone = 1.5 turns of a baseline PC (the turns it would lose) + the Health
  vulnAttacks: 2.5,       // attacks the party makes against a Vulnerable target before its turn ends (the fight sim measures 2.6)
  quarryShare: 0.3,       // share of an enemy's Strikes aimed at you (Hunter's Focus reduction): an Archer's share, measured by positions (E2) in report()
  rangedShare: 0.3,       // share of NPCs that use [Ranged] Actions (Suppressing Fire)
  othersShare: 0.75,      // share of an enemy's Strikes aimed at someone other than you (Champion's Challenge): 1 - a Paladin's share, measured by positions (E2) in report()
  surgeLands: 0.9,        // Divine Surge: chance that an ally damages the target before your next turn
  hitBeforeTurn: 0.95,
  guardUsed: 0.3,         // Guard (proposed): share of it that a later hit uses before the encounter ends (the Standard day: 1.3 of 4.5 a turn on the Paladin itself)    // a ward Reaction (block): chance that an ally within reach is hit before your next turn
  // The baseline PC's Health (frozen, pack P1): the average of the Paladin and the Archer as they were before P1 (the Bestiary was built for them).
  baseHealthSpecs: ["attributes body 2, mind 1\nhealth body x4 +3, mind x3 +4", "attributes body 1, mind 1\nhealth body x3 +3, mind x2.5 +4"],
  // The roles (Lucas, 2026-10-29), as shares of the baseline PC: damage a turn, Health.
  roles: { Paladin: { sustained: [0.85, 0.90], nova: [1.5, 1.8], health: [1.20, 1.30], note: "tank and support: more Health, heals and Defense for allies, Nova damage" },
           Archer: { sustained: [1.00, 1.05], nova: [1.1, 1.3], health: [0.80, 0.85], note: "mobile, fragile, constant ranged damage (a future melee class has the top damage: about 1.15)" } },
  growth: 0,              // model A (pack LV, decided 2026-10-29): no sustained growth inside tier 1 (levels 1-4); was the charter's +10% a level
  bands: { "at-will": [0.9, 1.1], round: [1.0, 1.3], turn: [1.0, 1.3], encounter: [1.4, 2.0], daily: [2.0, 3.0], none: [0.9, 1.1] },
};

/* ------------------------------------------------------------------ the exchange rate at a level */
const npcStrikeAvg = (npc, ad, banes) => { const p = C.tierProbs(npc.mod, ad, 0, banes, ""); return p[1] * npc.t2 + p[2] * npc.t3; };
const npcTurnAvg = (npc, ad, extraBanes = 0) => { let s = 0; for (let k = 0; k < npc.strikes; k++) s += npcStrikeAvg(npc, ad, k + extraBanes); return s; };
const refPool = (text, lv) => S.parseSpec(`class ref\nlevel ${lv}\n${text}`, "baseline").pool;
export function rates(lv) {
  const B = TW.pcDamageVsDefense[13] * (1 + A.growth * (lv - 1)), npc = S.npcOf("standard", "medium", lv);
  const avgPool = A.baseHealthSpecs.reduce((s2, t) => s2 + refPool(t, lv), 0) / A.baseHealthSpecs.length;
  return {
    lv, B, perAP: B / S.RULES_PRE_R.ap, npc, avgPool, rallyHeal: Math.ceil(avgPool / 4),
    incoming: npcTurnAvg(npc, 13),                                      // one Standard's turn against AD 13: what a PC takes a round in a normal fight
    def: n => npcTurnAvg(npc, 13) - npcTurnAvg(npc, 13 + n),            // +n Defense for 1 round on one PC
    banes: n => npcTurnAvg(npc, 13) - npcTurnAvg(npc, 13, n),           // n Banes on one enemy's Strikes for its turn
    hits: npc.strikes * (C.tierProbs(npc.mod, 13, 0, 0, "")[1] + C.tierProbs(npc.mod, 13, 0, 0, "")[2]),   // damaging hits of one Standard's turn
    hitAvg: (npc.t2 + npc.t3) / 2,
    down: A.downTurns * B, pDownFight: DAY.pDownFight, pDownDay: DAY.pDownDay, lohPerTurn: DAY.lohPerTurn, mercyPerTurn: (DAYS[lv] ?? DAY).mercyPerTurn
  };
}

/* ------------------------------------------------------------------ the value of an Action */
const weaponTraits = b => [...(b.weapon?.traits ?? []).filter(x => x === "ranged" || x === "melee"), ...((b.weapon?.traits ?? []).includes("projectile") ? ["shot"] : [])];
const traitsOf = (b, a) => [...new Set([...a.traits, ...(a.traits.includes("weapon") ? weaponTraits(b) : [])])];
const matches = (b, eff, a) => (!eff.name || a.name.toLowerCase().startsWith(eff.name)) && (eff.traits ?? []).every(t => traitsOf(b, a).includes(t));
/** The Action a "next ..." effect most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the named Action, else the first that fits. */
function refFor(b, eff) {
  const list = Object.values(b.actions).filter(a => (a.tiers || a.does.length) && a.vs !== "none" && !a.vs.startsWith("dc") && matches(b, eff, a));
  return list.find(a => a.name === "Weapon Attack") ?? list.find(a => / 2$/.test(a.name)) ?? list[0] ?? null;
}
const probsOf = (b, a, r, o) => {
  const mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
  if (a.vs.startsWith("save")) return C.tierProbs(r.npc.save?.[a.vs.split(/\s+/)[1] ?? "instinct"] ?? 0, 11 + mod, 0, 0, "");
  return C.tierProbs(mod, a.vs === "wd" ? r.npc.wd : r.npc.ad, o.boons ?? 0, o.banes ?? 0, o.favored ? "favored" : "");
};
/** The average damage of an Action against the level's Standard (AD and WD 13), with extra Boons, Empowered, extra dice or Favored. */
export function dmgOf(b, a, r, o = {}) {
  if (!a) return 0;
  if (a.does.length) {
    const each = { boons: (o.boons ?? 0) + a.each.filter(e => e.kind === "boon").reduce((s, e) => s + e.n, 0), empowered: (o.empowered ?? 0) + a.each.filter(e => e.kind === "empowered").reduce((s, e) => s + e.n, 0), extra: [...(o.extra ?? []), ...a.each.filter(e => e.kind === "extra").map(e => e.dmg)], favored: o.favored };
    return a.does.reduce((s, d) => s + dmgOf(b, b.actions[d.toLowerCase()], r, each), 0) * (a.area > 1 ? a.area : 1);
  }
  if (!a.tiers || a.vs === "none" || a.vs.startsWith("dc")) return 0;
  const p = probsOf(b, a, r, { ...o, favored: o.favored || a.favored }), mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
  const per = [0, 1, 2].reduce((s, t) => s + p[t] * S.avgDamage(a.tiers[t], b.weapon, t + 1, mod, o.empowered ?? 0, o.extra ?? []), 0);
  return per * (a.area > 1 ? a.area : 1) + a.then.reduce((s, x) => s + dmgOf(b, b.actions[x.toLowerCase()], r), 0);
}
const pDeals = (b, a, r) => { const p = probsOf(b, a, r, {}), mod = a.vs === "wd" ? b.powerMod : b.weaponMod; return [0, 1, 2].reduce((s, t) => s + (S.avgDamage(a.tiers?.[t] ?? S.parseDamage("0"), b.weapon, t + 1, mod) > 0 ? p[t] : 0), 0); };

/** The value of one effect in DE, and a note when part of it can't be priced yet. */
/** What n Boons or Empowered n add to the class's typical turn (catalogue line "turn Typical"), on the Actions the effect fits. */
function onTypical(b, e, r, o) {
  const t = b.turns.typical; if (!t) return 0;
  return t.steps.map(x => b.actions[x.toLowerCase()]).filter(a => a && (matches(b, { ...e, name: "" }, a) || a.does.some(d => matches(b, { ...e, name: "" }, b.actions[d.toLowerCase()]))))
    .reduce((s, a) => s + dmgOf(b, a, r, o) - dmgOf(b, a, r), 0);
}
export function priceEffect(b, a, e, r) {
  const ref = () => refFor(b, e), on = (o) => { const x = ref(); return x ? dmgOf(b, x, r, o) - dmgOf(b, x, r) : 0; };
  const turnMul = (a.rounds ?? 1) * (a.allies ?? 1);
  switch (e.kind) {
    case "boon": return { v: e.scope === "turn" ? onTypical(b, e, r, { boons: e.n }) * turnMul : on({ boons: e.n }) };
    case "bane": return { v: -on({ banes: e.n }) };
    case "empowered": return { v: e.scope === "turn" ? onTypical(b, e, r, { empowered: e.n }) * turnMul : on({ empowered: e.n }) };
    case "favored": return { v: on({ favored: true }) };
    case "extra": { const x = ref(); return { v: x ? S.avgDamage(e.dmg, b.weapon, 2, b.weaponMod) * (e.anyTier ? 1 : pDeals(b, x, r)) : 0 }; }   // any-tier: a single-value Buff lands on Tier 1 too
    case "vulnerable": return { v: e.n * (dmgOf(b, b.actions["weapon attack"], r, { boons: 1 }) - dmgOf(b, b.actions["weapon attack"], r)) * A.vulnAttacks };
    case "defense": return { v: r.def(e.n) * (e.who === "allies" ? (a.allies ?? 1) : 1) * (a.rounds ?? 1) };
    case "taunt": return { v: r.banes(e.n) * A.othersShare };
    case "banes": return { v: r.banes(e.n) * (e.others ? A.othersShare : 1) * (/ranged/.test(e.text) ? A.rangedShare : 1) * (a.area > 1 ? a.area : 1) * (a.rounds ?? 1) };
    case "heal": return { v: e.n * r.rallyHeal * A.heal, note: a.name.startsWith("Lay On Hands") || a.name.startsWith("Steel") ? "uses the target's own Rally Points" : "" };
    case "healdice": return { v: S.avgDamage(e.dmg, null, 2, 0) * (a.allies ?? 1) * (a.rounds ?? 1) * A.heal };
    case "mend": return { v: S.avgDamage(e.dmg, null, 2, b.powerMod) * A.heal, note: "new Health (no Rally Point)" };
    case "guard": return { v: S.avgDamage(e.dmg, null, 2, b.powerMod) * A.heal * A.guardUsed, note: `Guard: only what a later hit uses (${Math.round(A.guardUsed * 100)}%)` };
    case "surge": return { v: S.avgDamage(e.dmg, null, 2, b.powerMod) * A.surgeLands, note: `an ally's damage (${Math.round(A.surgeLands * 100)}% that one hits the target in time)` };
    case "block": return { v: Math.min(S.avgDamage(e.dmg, null, 2, b.powerMod), r.hitAvg) * A.hitBeforeTurn, note: "damage an ally doesn't take (one hit)" };
    case "reducefrom": return { v: e.n * r.hits * A.quarryShare * (a.rounds ?? 1) };
    case "revive": case "prevent-down": { const pDown = a.freq === "daily" ? r.pDownDay : r.pDownFight;
      return { v: r.down * pDown, note: `a Down undone or prevented: ${r.down.toFixed(0)} DE a use, x ${Math.round(pDown * 100)}% (how often an ally goes Down ${a.freq === "daily" ? "in a day" : "in a fight"})` }; }
    case "debuff": { if (/next Save/.test(e.name)) return { v: 0.2 };
      const v = PO.priceOf("debuff", e.name); return v == null ? { v: 0, e2: e.name } : { v: v * lvScale(r), note: `${e.name}: ${f2(v * lvScale(r))} (positions)` }; }
    case "push": case "pull": case "slide": { const v = PO.priceOf(e.kind, "", e.n) * lvScale(r); return { v, note: `${{ push: "Pushed", pull: "Pulled", slide: "Slid" }[e.kind]} ${e.n}: ${f2(v)} (positions)` }; }
    case "evade": { const st = PO.prices(1).stats, v = st.turnsEngaged * r.perAP;   // the AP of the step away, on the turns the Archer starts Engaged
      return { v, note: `Evade ${e.n}: saves the step away (1 AP) on the ${pc(st.turnsEngaged)} of the turns it starts Engaged` }; }
    case "cover": { const st = PO.prices(1).stats, v = st.coverBanes * baneOnWA(b, r); return { v, note: `ignores Cover: ${f2(st.coverBanes)} Banes on an average shot` }; }
    case "range": { const st = PO.prices(1).stats, v = Math.min(1, st.rangeBanes) * baneOnWA(b, r); return { v, note: `range: ${f2(st.rangeBanes)} range Banes on an average shot` }; }
    case "save-boon": return { v: 0, e2: "Boon on Saves (NPC Save Actions are not modeled)" };
    case "remove-effect": { const v = endEffect() * lvScale(r); return { v, note: `ends an effect: ${f2(v)} (the average Moderate condition on a PC, positions)` }; }
    case "note": return { v: 0, e2: e.text || "not modeled" };
    case "area": case "reload": return { v: 0 };
    default: return { v: 0, e2: e.kind };
  }
}
/** Positions are measured at level 1: a higher level scales them by its AP price. */
const lvScale = r => r.perAP / rates1().perAP;
let R1 = null; const rates1 = () => (R1 ??= rates(1));
/** The value of 1 Bane on a Weapon Attack of this build (what removing one is worth). */
const baneOnWA = (b, r) => { const wa = b.actions["weapon attack"]; return wa ? dmgOf(b, wa, r) - dmgOf(b, wa, r, { banes: 1 }) : 0.55; };
/** Ending an effect on an ally: the average Moderate condition on a PC (positions.mjs). */
const endEffect = () => { const m = PO.prices(1).pc.filter(x => x.sev === "Moderate"); return m.reduce((s2, x) => s2 + x.avg, 0) / m.length; };
/** Damage + effects of an Action (each effect weighted by the chance of its tier; target effects times the creatures reached). */
export function valueOf(b, a, r) {
  const dmg = dmgOf(b, a, r), e2 = [], notes = [];
  let fx = 0;
  const p = a.tiers && a.vs !== "none" && !a.vs.startsWith("dc") ? probsOf(b, a, r, {}) : null;
  const perTarget = new Set(["vulnerable", "taunt", "debuff"]);
  for (const { min, max, effect } of a.effects) {
    const w = p ? p.slice(min - 1, max).reduce((s, x) => s + x, 0) : (a.does.length && min > 1 ? 0.72 : 1);
    const pr = priceEffect(b, a, effect, r);
    fx += w * pr.v * (perTarget.has(effect.kind) && a.area > 1 ? a.area : 1);
    if (pr.e2) e2.push(pr.e2); if (pr.note) notes.push(pr.note);
  }
  return { dmg, fx, total: dmg + fx, e2: [...new Set(e2)], notes: [...new Set(notes)] };
}

/* ------------------------------------------------------------------ timing and how often things happen: the Standard day of fights.txt */
// A party of 2 Paladins and 2 Archers of the level through the first `day` of fights.txt (with Momentum): every fight's rounds and starting
// Escalation, how often an ally goes Down, how often Lay On Hands is used, the damage a turn of each class.
const cls = name => S.parseSpec(fs.readFileSync(HERE + "classes/" + name, "utf8"), `classes/${name}`);
/** The party of a Standard day for a build: two of it with two of the other class's main build at its level. */
export const partyFor = file => { const b = cls(file), lv = b.level, pal = `paladin-smite-${lv}.txt`, arc = `archer-${lv}.txt`;
  return /^Archer/.test(b.name) ? [cls(pal), cls(pal), b, b] : [b, b, cls(arc), cls(arc)]; };
// The catch-up (2026-11-12): the day is a pre-R measurement (the 5 AP classes): it runs under RULES_PRE_R whoever calls it (this file measures at load,
// and rclasses.mjs imports it under its own rules), and puts the caller's rules back.
const preR = fn => { const keep = { ...S.RULES }; Object.assign(S.RULES, S.RULES_PRE_R); try { return fn(); } finally { Object.assign(S.RULES, keep); } };
const dayStats = (...a) => preR(() => dayStats0(...a));
const dayStats0 = (lv, file = `paladin-smite-${lv}.txt`, n = 800, map = S.MAP) => {
  const fights = S.parseFights(fs.readFileSync(HERE + "fights-pre-r.txt", "utf8")), d = fights.days[0];
  const party = partyFor(file), R = S.rng(17), log = [];
  let fightsRun = 0, fightsDown = 0, daysDown = 0, loh = 0, turns = 0, mercy = 0, combatRp = 0; const real = {};
  for (let k = 0; k < n; k++) {
    const res = S.day(party, d.fights.map(f => f.map(x => S.npcOf(x.role, x.rating, lv, x))), R, { map });
    for (const f of res.fights) { fightsRun++; if (f.firstDown) fightsDown++; log.push({ rounds: f.rounds, start: f.startEsc ?? 0 }); }
    if (res.pcs.some(p => p.st.downs)) daysDown++;
    loh += res.pcs.reduce((s, p) => s + p.st.rpByAlly, 0); turns += res.pcs.filter(p => /^Paladin/.test(p.build.name)).reduce((s, p) => s + p.st.rounds, 0);
    mercy += res.pcs.reduce((s, p) => s + p.st.mercyGiven, 0); combatRp += res.pcs.reduce((s, p) => s + p.st.rpSelf + p.st.rpByAlly, 0);
    for (const p of res.pcs) { const c = (real[p.build.file] ??= { dealt: 0, turns: 0, nova: 0, novaTurns: 0 }); c.dealt += p.st.dealt; c.turns += p.st.rounds; c.nova += p.st.novaDealt; c.novaTurns += p.st.novaTurns; }
  }
  const rounds = log.reduce((s, f) => s + f.rounds, 0);
  /** Share of the rounds at Escalation >= e if nothing is spent (momentum false: every fight starts at 0). */
  const share = (e, momentum = true) => log.reduce((s, f) => { let c = 0; for (let r = 1; r <= f.rounds; r++) if (Math.min(3, (momentum ? f.start : 0) + r - 1) >= e) c++; return s + c; }, 0) / rounds;
  /** Uses a fight of an Escalation Active costing `cost`, spent as soon as you have it (once a round), with nothing else spent. */
  const uses = (cost, momentum = true) => log.reduce((s, f) => { let esc = momentum ? f.start : 0, u = 0; for (let r = 1; r <= f.rounds; r++) { if (r > 1) esc = Math.min(3, esc + 1); if (esc >= cost) { u++; esc -= cost; } } return s + u; }, 0) / log.length;
  return { name: d.name, share, uses, roundsPerFight: rounds / log.length, startShare: log.filter(f => f.start > 0).length / log.length,
    pDownFight: fightsDown / fightsRun, pDownDay: daysDown / n, lohPerTurn: loh / turns, mercyPerTurn: mercy / turns, combatRpPerTurn: combatRp / turns,
    real: Object.fromEntries(Object.entries(real).map(([k2, v]) => [k2, { all: v.dealt / v.turns, sustained: (v.dealt - v.nova) / Math.max(1, v.turns - v.novaTurns), nova: v.novaTurns ? v.nova / v.novaTurns : NaN, novaShare: v.novaTurns / v.turns }])) };
};
const DAYS = { 1: dayStats(1), 2: dayStats(2), 3: dayStats(3) }, REAL = {};
const DAY = DAYS[1];
const DAYH = dayStats(1, "paladin-hands-1.txt");
DAY.lohPerTurn = DAYH.lohPerTurn;   // how often a Lay On Hands Paladin heals
export const escalationShare = (momentum = true) => [0, 1, 2, 3].map(e => DAY.share(e, momentum));

/* ------------------------------------------------------------------ the report */
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => `${Math.round(x * 100)}%`;
function verdict(eff, freq) {
  const [lo, hi] = A.bands[freq] ?? A.bands.round;
  return eff < lo * 0.9 ? "**under**" : eff > hi * 1.1 ? "**over**" : eff < lo ? "a little under" : eff > hi ? "a little over" : "on target";
}
const t0 = (b, k) => b.unloadedTurn === k || b.whenSelf?.turn === k;
const roleOf = b => A.roles[b.name.split(" (")[0]];
const CATALOGUE_NOTES = {
  "catalogue/paladin-p1.txt": "**The P1 main build (pack P1, 2026-10-29; in the book since 2026-10-29)**: the defaults of every level 1 to 3 Pick, then the options in the Paladin document (Shield of Faith, Bulwark of Faith, Aura of Protection, Font of Mercy).",
  "catalogue/paladin.txt": "**The Paladin before P1** (the book until 2026-10-29), kept to compare.",
  "catalogue/paladin-options.txt": "**The Paladin's options (pack OT, 2026-10-30; in the book: book/options-talents.md)**: every option of a level 1 to 3 Pick slot, to compare with its default above.",
  "catalogue/archer-options.txt": "**The Archer's options (pack OT, 2026-10-30; in the book: book/options-talents.md)**: every option of a level 1 to 3 Pick slot, to compare with its default (A1).",
  "catalogue/talents.txt": "**The Talents, melee (pack OT, 2026-10-30; in the book: book/options-talents.md)**: priced on the P1 Paladin's numbers.",
  "catalogue/talents-ranged.txt": "**The Talents, ranged (pack OT, 2026-10-30; in the book: book/options-talents.md)**: priced on the A1 Archer's numbers.",
  "catalogue/archer-a1.txt": "**The A1 main build (pack A1, 2026-10-29; PROPOSED: book/archer-a1.md)**: both Signatures and the defaults of every level 1 to 3 Pick.",
  "catalogue/gear-d2.txt": "**The weapons and Weapon Techniques of D2 (2026-10-31; book/gear-d2.md)**: every weapon's Weapon Attack and its Technique, on a level 1 PC (Weapon Modifier +2).",
};
export function report() {
  Object.assign(S.RULES, S.RULES_PRE_R);   // the catch-up (2026-11-12): a pre-R study (the 5 AP classes of classes/, the rules before pack R); spec.mjs's default is the book today
  // Measured by positions (pack E2) instead of assumed: who the NPCs strike on the map.
  const ST = PO.prices(1).stats; A.quarryShare = +(ST.struckArcher / 2).toFixed(2); A.othersShare = +(1 - ST.struckPal / 2).toFixed(2);
  const L = [], R = [1, 2, 3].map(rates), esc = escalationShare();
  const load = f => S.parseSpec(fs.readFileSync(HERE + "catalogue/" + f, "utf8"), `catalogue/${f}`);
  const catFiles = fs.readdirSync(HERE + "catalogue").filter(f => f.endsWith(".txt")).sort((x, y) => (x.startsWith("paladin-p1") ? -1 : y.startsWith("paladin-p1") ? 1 : x.localeCompare(y)));
  const cats = catFiles.map(load), pal = cats.find(c => c.file === "catalogue/paladin.txt"), arc = cats.find(c => c.file === "catalogue/archer.txt");
  L.push("# The price list of the core rules (pack E1; positions: pack E2)", "", "Written by `node book/ruler/econ.mjs` from the class catalogues (`book/ruler/catalogue/*.txt`) and the system's dice math. Don't edit this file: edit those and run it again.", "");
  L.push("Everything is priced in **damage-equivalents (DE)**: average damage against the level's Medium Standard (AD and WD 13, Saves +1, Body +2), with Weapon and Power Modifier +2 (no Attribute growth in levels 1 to 3 yet).", "");
  // 1. The exchange rate.
  L.push("## 1. The exchange rate", "", "| | Level 1 | Level 2 | Level 3 | Where it comes from |", "|---|---:|---:|---:|---|");
  const row = (n, fn, src) => L.push(`| ${n} | ${R.map(r => f2(fn(r))).join(" | ")} | ${src} |`);
  row("A baseline PC's damage a turn (Defense 13)", r => r.B, "the Bestiary's PC baseline (config pcDamageVsDefense, flat inside Stage 1: model A, pack LV)");
  row("**1 AP** (the baseline turn / 5)", r => r.perAP, "the price of one Action Point");
  row("A Paladin Weapon Attack (Greatsword)", r => dmgOf(pal, pal.actions["weapon attack"], r), "exact");
  row("An Archer Weapon Attack (Crossbow)", r => dmgOf(arc, arc.actions["weapon attack"], r), "exact");
  row("A Standard's turn against AD 13", r => r.incoming, "exact: 2 Strikes, the 2nd with 1 Bane; what a PC takes a round in a normal fight (CV 1 per PC)");
  row("The baseline PC's Health Pool", r => r.avgPool, "frozen (pack P1): the average of the Paladin and the Archer as they were before P1 (a Human Paladin and a Human Archer)");
  row("A Rally Point (Health it heals)", r => r.rallyHeal, "ceil(Pool / 4) of that baseline Pool");
  row("1 Health healed", () => A.heal, "Lucas: a little more than 1 damage");
  row("A Down prevented or undone", r => r.down, `${A.downTurns} baseline turns (the turns it would lose), plus the Health`);
  L.push("");
  const e0 = escalationShare(false);
  L.push(`**Escalation is spent** (the book, Escalation): an Active costs its Escalation; a passive works while you have at least its number, so spending turns it off. **Momentum** (Lucas, 2026-10-29): +1 after each fight harder than easy; with Momentum you start a fight with half your level in Escalation (rounded up), up to 2; a Rest resets it. In the ${DAY.name} of fights.txt (level 1 party, simulated; ${f1(DAY.roundsPerFight)} rounds a fight, ${pc(DAY.startShare)} of the fights start with Momentum):`, "",
    "| | Escalation 1 or more | 2 or more | 3 or more |", "|---|---:|---:|---:|",
    `| Share of the rounds, nothing spent, with Momentum | ${pc(esc[1])} | ${pc(esc[2])} | ${pc(esc[3])} |`, `| The same without Momentum | ${pc(e0[1])} | ${pc(e0[2])} | ${pc(e0[3])} |`,
    `| Uses a fight of an Active that costs it (spent as soon as possible) | ${f2(DAY.uses(1))} | ${f2(DAY.uses(2))} | ${f2(DAY.uses(3))} |`, `| The same without Momentum | ${f2(DAY.uses(1, false))} | ${f2(DAY.uses(2, false))} | ${f2(DAY.uses(3, false))} |`, "");
  L.push(`An Active and a passive compete: a level 1 PC who spends 1 Escalation every round never reaches 2, so its Escalation 2 passive stays off. In the same day an ally goes Down in ${pc(R[0].pDownFight)} of the fights and on ${pc(R[0].pDownDay)} of the days; a Paladin uses Lay On Hands on ${pc(R[0].lohPerTurn)} of its turns.`, "");
  // 2. The price list.
  const r1 = R[0], wa = b => b.actions["weapon attack"];
  const on = (b, o, r = r1) => dmgOf(b, wa(b), r, o) - dmgOf(b, wa(b), r);
  L.push("## 2. The price list (level 1; DE, and as a share of what it modifies)", "", "| Effect | DE | Share | Notes |", "|---|---:|---:|---|");
  const P = (n, v, share, note = "") => L.push(`| ${n} | ${f2(v)} | ${share} | ${note} |`);
  P("+1 Boon on a Weapon Attack (Paladin / Archer)", (on(pal, { boons: 1 }) + on(arc, { boons: 1 })) / 2, pc(on(pal, { boons: 1 }) / dmgOf(pal, wa(pal), r1)), "+1 Modifier and -1 target Defense are the same");
  P("+2 Boons", (on(pal, { boons: 2 }) + on(arc, { boons: 2 })) / 2, pc(on(pal, { boons: 2 }) / dmgOf(pal, wa(pal), r1)), "");
  P("+1 Bane", -(on(pal, { banes: 1 }) + on(arc, { banes: 1 })) / 2 * -1, pc(on(pal, { banes: 1 }) / dmgOf(pal, wa(pal), r1)), "");
  P("Favored", (on(pal, { favored: true }) + on(arc, { favored: true })) / 2, pc(on(pal, { favored: true }) / dmgOf(pal, wa(pal), r1)), "about 3.7 Boons");
  P("Empowered 1 on a Greatsword / Crossbow Weapon Attack", on(pal, { empowered: 1 }), `${pc(on(pal, { empowered: 1 }) / dmgOf(pal, wa(pal), r1))} / ${pc(on(arc, { empowered: 1 }) / dmgOf(arc, wa(arc), r1))}`, `Crossbow ${f2(on(arc, { empowered: 1 }))}: +1 a die that lands, so more dice = more value`);
  P("Vulnerable 1 (until the target's turn ends)", priceEffect(pal, wa(pal), { kind: "vulnerable", n: 1 }, r1).v, "-", `${A.vulnAttacks} party attacks reach it`);
  P("+1 Defense for 1 round on one ally", r1.def(1), pc(r1.def(1) / r1.incoming), "of what it would take that round; +2: " + f2(r1.def(2)));
  P("1 Bane on one enemy's Strikes for its turn", r1.banes(1), pc(r1.banes(1) / r1.incoming), "the same as +1 Defense for everyone it attacks");
  P("A Rally Point used in a fight", r1.rallyHeal * A.heal, "-", "Steel Yourself pays 2 AP for it: " + f2(r1.rallyHeal * A.heal / 2) + " DE per AP");
  P("A Down prevented or undone", r1.down, "-", "");
  L.push("", `**Frequency bands** (DE per AP, divided by the price of 1 AP): At-will ${A.bands["at-will"].join(" to ")}, Round and Turn ${A.bands.round.join(" to ")}, Encounter ${A.bands.encounter.join(" to ")}, Daily ${A.bands.daily.join(" to ")}. An At-will Action takes a Bane on each use after the first, so its first use can sit at the top. A **0 AP** Action is priced per use as a share of a baseline turn. Verdict: **under** or **over** when more than 10% outside its band; **+ ?** when part of its value is still not modeled (NPC Saves, hazardous areas), so the verdict isn't final. Movement, Evade, Forced Movement, Cover, range, Hindered, Immobilized, Prone and ending an effect are priced by positions (pack E2, section 5).`, "");
  // Role budgets.
  L.push("## 3. The role budgets (every build of `classes/`)", "",
    "Shares of the baseline PC: damage against the Bestiary's baseline turn of the level (" + R.map(r => f1(r.B)).join(" / ") + " at levels 1 / 2 / 3), and in brackets against model A (pack LV: flat inside tier 1, +" + pc(A.growth) + " a level: " + [1, 2, 3].map(lv => f1(R[0].B * (1 + A.growth * (lv - 1)))).join(" / ") + "; pack E3 refits the Bestiary to it). Health against the baseline Pool (" + R.map(r => f1(r.avgPool)).join(" / ") + ").", "",
    "**Sustained (best)**: the best turn with no Encounter or Daily Action and no Escalation (a Reload Shot turn and heal turns left out). **Nova**: the best turn with an Encounter or Daily Action, at the Escalation it spends or the Escalation Momentum starts a fight with (" + [1, 2, 3].map(lv => S.MOMENTUM.startEsc(lv)).join(" / ") + "), whichever is more. **Sustained (real)**: the damage a turn in the simulated Standard day on the turns without an Encounter or Daily Action (openings, Steel Yourself turns and Escalation as the plan spends it, Momentum on); **this is the column the sustained budget is checked on**. **All turns**: the same with the Nova turns in (a once-a-fight Nova is about a third of a PC's turns: fights last about 3 rounds). The real columns use the map model (pack E2: positions, movement, Banes from range, cover and shooting into melee, Flanking); **No positions** is the sustained real damage in the old fight with no map, to compare.", "",
    "| Build | Sustained (best) | Nova | Sustained (real) | No positions | All turns (real) | Health | Budget: sustained / Nova / Health | Verdict |", "|---|---:|---:|---:|---:|---:|---:|---|---|");
  const classFiles = fs.readdirSync(HERE + "classes").filter(f => f.endsWith(".txt")).sort();
  for (const file of classFiles) {
    const b = S.parseSpec(fs.readFileSync(HERE + `classes/${file}`, "utf8"), `classes/${file}`), r = R[b.level - 1], role = roleOf(b);
    if (!role) continue;
    const rows = Object.entries(b.turns).map(([k, t]) => {
      const acts = t.steps.map(x => b.actions[x.toLowerCase().replace(/\s*\(.*\)$/, "")]).filter(Boolean);
      const esc = Math.min(3, acts.reduce((s2, a) => s2 + a.escalation, 0)), nova = acts.some(a => a.freq === "encounter" || a.freq === "daily"), heal = acts.some(a => a.effects.some(e => e.effect.kind === "heal" && e.effect.who === "self"));
      return { k, esc, nova, heal, v: S.turnDamage(b, k, 13, { n: 6000, escalation: nova ? Math.max(esc, S.MOMENTUM.startEsc(b.level)) : esc }) };
    }).filter(x => !x.v.problems.length && !x.heal && !t0(b, x.k) && !b.turns[x.k].steps.some(st => /reload shot/i.test(st)));
    const best = list => list.reduce((m, x) => Math.max(m, x.v.avg), 0);
    const s0 = best(rows.filter(x => !x.nova && x.esc === 0)), nv = best(rows.filter(x => x.nova));
    const real = (REAL[file] ??= dayStats(b.level, file, 500).real[`classes/${file}`]) ?? {};
    const flat = dayStats(b.level, file, 500, { ...S.MAP, on: false }).real[`classes/${file}`] ?? {};
    const curve = R[0].B * (1 + A.growth * (b.level - 1));
    const both = x => (Number.isFinite(x) ? `${f1(x)} (${pc(x / r.B)}${b.level > 1 ? `; ${pc(x / curve)}` : ""})` : "-");
    const fit = (x, [lo, hi]) => (x < lo * 0.97 ? "low" : x > hi * 1.03 ? "high" : "ok");
    const share = x => x / (b.level > 1 ? curve : r.B);   // the verdict uses model A's curve from level 2
    const v = [`sustained ${fit(share(real.sustained), role.sustained)}`, `Nova ${nv ? fit(share(nv), role.nova) : "none"}`, `Health ${fit(b.pool / r.avgPool, role.health)} (${pc(b.pool / r.avgPool)})`];
    L.push(`| ${b.name} L${b.level} \`${file.replace(/\.txt$/, "")}\` | ${both(s0)} | ${nv ? both(nv) : "-"} | ${both(real.sustained)} | ${both(flat.sustained)} | ${both(real.all)} | ${b.pool} (${pc(b.pool / r.avgPool)}) | ${pc(role.sustained[0])}-${pc(role.sustained[1])} / ${pc(role.nova[0])}-${pc(role.nova[1])} / ${pc(role.health[0])}-${pc(role.health[1])} | ${v.join("; ")} |`);
  }
  L.push("", `Roles: Paladin: ${A.roles.Paladin.note}. Archer: ${A.roles.Archer.note}. The verdict at level 2 and 3 uses model A (pack LV: the baseline stays at level 1's inside tier 1; the Bestiary's level 2-3 rows are refit in E3).`, "");
  // 4. The audit.
  for (const b of cats) {
    L.push(`## 4. ${b.name}: every Action of \`${b.file}\` (level 1; efficiency also at levels 2 and 3)`, "", ...(CATALOGUE_NOTES[b.file] ? [CATALOGUE_NOTES[b.file], ""] : []), "| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Notes (positions; what is not modeled) |", "|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|");
    for (const a of Object.values(b.actions)) {
      if (!a.ap && !a.escalation && a.name !== "Smite Light") continue;
      if (a.name === "Smite Light") continue;   // counted inside Smite 3
      const v = R.map(r => valueOf(b, a, r)), freq = a.freq;
      const eff = R.map((r, i) => (a.ap ? v[i].total / a.ap / r.perAP : v[i].total / r.B));
      let verd = a.ap ? verdict(eff[0], freq) : (eff[0] > 0.25 ? "**over** (0 AP: >25% of a turn)" : eff[0] < 0.08 ? "under (0 AP: <8% of a turn)" : "on target (0 AP)");
      if (a.name === "Reload") verd = "a cost (of a Reload Shot)";
      else if (v[0].e2.length && !/over/.test(verd)) verd += " + ?";   // part of its value is not modeled: not final
      const extra = [...v[0].e2.map(x => `not modeled: ${x}`), ...v[0].notes, a.reaction ? "Reaction: needs AP kept after your turn" : "", a.escalation ? `costs ${a.escalation} Escalation: ${f2(DAY.uses(a.escalation))} uses a fight (${f2(DAY.uses(a.escalation, false))} without Momentum), ${f1(v[0].total * (a.effects.some(e => e.effect.kind === "revive") ? Math.min(1, DAY.uses(a.escalation)) : DAY.uses(a.escalation)) / DAY.roundsPerFight)} DE a turn` : ""].filter(Boolean).join("; ");
      L.push(`| ${a.name}${a.reaction ? " (R)" : ""} | ${a.ap} | ${freq} | ${a.escalation || ""} | ${f1(v[0].dmg)} | ${f1(v[0].fx)} | ${f1(v[0].total)} | ${a.ap ? f2(v[0].total / a.ap) : "-"} | ${a.ap ? f2(eff[0]) : pc(eff[0]) + " of a turn"} | ${a.ap ? f2(eff[1]) : pc(eff[1])} | ${a.ap ? f2(eff[2]) : pc(eff[2])} | ${verd} | ${extra} |`);
    }
    L.push("");
    // Passives.
    L.push(`**${b.name} passives** (DE a turn, weighted by the share of the rounds at its Escalation):`, "", "| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |", "|---|---:|---:|---:|---:|---|");
    for (const p of b.passives) {
      const e = p.effect, w = esc[Math.min(3, p.escalation)];
      let v = 0, how = "";
      if (e.kind === "boon" && e.quarry) { v = onTypical(b, e, r1, { boons: e.n }); how = `the typical turn's Shot Strikes against the quarry, +${e.n} Boon each`; }
      else if (e.kind === "boon" && e.scope === "next" && !e.quarry) { v = on(b, { boons: e.n }) / 3; how = "about once a fight (a third of the turns)"; }
      else if (e.kind === "boon") { const still = PO.prices(1).stats.stillTurns; v = onTypical(b, e, r1, { boons: e.n }) * still; how = `the typical turn's Shots, on the ${pc(still)} of the Archer's turns it hasn't left its square since its last one (positions): against the Archer's role (mobile)`; }
      else if (e.kind === "extra") { v = S.avgDamage(e.dmg, null, 2, 0) * pDeals(b, wa(b), r1); how = "the first qualifying hit each round"; }
      else if (e.kind === "reduce") { v = Math.min(e.n, r1.hitAvg) * r1.hits * (1.5 + 1); how = "Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square"; }
      else if (e.kind === "bonus") { const t = b.turns.typical; v = t ? t.steps.map(x => b.actions[x.toLowerCase()]).filter(a => a?.tiers && (e.traits ?? []).every(tr => traitsOf(b, a).includes(tr))).reduce((s2, a) => s2 + e.n * pDeals(b, a, r1), 0) : 0; how = `+${e.n} on each damaging hit of the typical turn's matching Actions`; }
      else if (e.kind === "rallybonus") { const rp = DAY.combatRpPerTurn; v = rp * e.n * A.heal; how = `+${e.n} on every Rally Point the party uses in a fight (Escalation is 0 between fights): ${f2(rp)} a Paladin turn in the Standard day (a Lay On Hands party uses more: ${f2(DAYH.combatRpPerTurn)}, ${f1(DAYH.combatRpPerTurn * e.n * A.heal)} DE)`; }
      else if (e.kind === "empowered") { const s2 = b.actions["smite 2"]; v = s2 ? (dmgOf(b, s2, r1, { empowered: e.n }) - dmgOf(b, s2, r1)) : 0; how = `${f1(v)} a Smite after a Lay On Hands that heals; weighted by Lay On Hands on ${pc(r1.lohPerTurn)} of the turns`; v *= r1.lohPerTurn; }
      else if (e.kind === "steady-nerves" || (e.kind === "note" && /Engaged/.test(e.text))) { const st = PO.prices(1).stats, shots = st.shots / st.archerTurns; v = st.engagedShots * shots * 2 * baneOnWA(b, r1); how = `2 Banes off the ${pc(st.engagedShots)} of the shots made while Engaged (the Archer kites: positions); an Archer that doesn't kite: section 5`; }
      else if (e.kind === "range" || e.kind === "long-draw") { const st = PO.prices(1).stats, shots = st.shots / st.archerTurns; v = Math.min(1, st.rangeBanes) * shots * baneOnWA(b, r1); how = `1 range Bane off (${f2(st.rangeBanes)} a shot on average: positions)`; }
      else { how = `not modeled: ${e.text || (e.kind === "save-boon" ? "Boon on Saves" : e.kind)}`; }
      L.push(`| ${p.name} | ${p.escalation || ""} | ${f1(v)} | ${f1(v * w)} | ${pc((v * w) / r1.B)} | ${how} |`);
    }
    L.push("");
  }
  L.push(PO.section(1));
  L.push("## Assumptions", "", ...Object.entries(A).filter(([k]) => k !== "bands").map(([k, v]) => `- \`${k}\`: ${v}`), "- Areas: the catalogues write `area N` as the creatures reached (Emanation 1: 1.5, 2: 2, 3: 2.5 of a normal fight's 4 enemies) and `allies N` as the allies reached (Aura 1: 1.5, Aura 2: 2.5, Aura 3: 3, you included).", "- A \"next ...\" effect is priced on the Action it most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the Action it names (Smite 2).", "- Divine Retribution: Weapon mode 2R, Power mode 3R (the card has 2 / 3R and two columns).", "");
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = report();
  fs.writeFileSync(HERE + "prices.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
}
