// SIM-1 (2026-11-12): the rules a run can change, the system's modules, the dice, damage expressions and the Bestiary's NPCs.
// Moved here from spec.mjs unchanged (spec.mjs exports them again). Nothing here chooses anything: decisions are in policy.mjs.
/* eslint-disable prefer-const */
globalThis.foundry ??= { utils: {}, applications: { api: {} } }; globalThis.foundry.data ??= { fields: {} }; globalThis.foundry.data.fields ??= {}; globalThis.foundry.abstract ??= {}; globalThis.foundry.abstract.TypeDataModel ??= class {};   // stand-ins: the system's data.mjs declares its data models on load (the ruler reads only its pure NPC Modifier functions) globalThis.game ??= { settings: { get: () => true } }; globalThis.CONFIG ??= {}; globalThis.Hooks ??= { on() {} };
export const C = await import(new URL("../../../foundry/twod12/module/calc.mjs", import.meta.url).href);
export const CF = await import(new URL("../../../foundry/twod12/module/config.mjs", import.meta.url).href);
export const TW = CF.TWOD12;
export const RR = await import(new URL("../../../foundry/twod12/module/roundrules.mjs", import.meta.url).href);   // SIM-1: the rules of a round, the system's own (v0.0.365)
export const GD = await import(new URL("../../../foundry/twod12/module/guard.mjs", import.meta.url).href);   // the catch-up: the unused AP's Guard by Stage (guardPerAP), the system's own
export const DM = await import(new URL("../../../foundry/twod12/module/data.mjs", import.meta.url).href);   // the catch-up: the NPC Modifier ratings (npcModRatings, npcModValue), the system's own
export const BT = await import(new URL("../bestiary-today.mjs", import.meta.url).href);   // pack R-bestiary: the pre-R tables (RULES.bestiary "today")
export const bHm = (...a) => (RULES.bestiary === "r" ? CF.npcHm : BT.npcHm)(...a); export const bDmg = (...a) => (RULES.bestiary === "r" ? CF.npcDamage : BT.npcDamage)(...a);
export const MP = await import(new URL("../map.mjs", import.meta.url).href);   // the map model (pack E2)
export const MAP = MP.MAP, MAPDIST = MP.dist, MAPCOND = MP.applyCondition, MAPFORCE = MP.force;
/**
 * The rules a run can change (pack R prep, 2026-11-04; rework.mjs sets them; the defaults are the book today, so report.md doesn't move):
 * ap: AP a PC regains a turn · reactionAp: AP a PC may spend only on Reactions (kept after its turn on top of what it didn't spend) ·
 * escalation: "spent" (an Active costs its Escalation) or "level" (an Active needs its Escalation and spends nothing; a passive works from its level) ·
 * npcAp / minionAp: an NPC's AP a turn (its Strikes keep 1 AP for moving) · npcReactionAp: AP an NPC may spend only on Reactions (Elites' Opportunity Attacks cost no next-turn AP with it).
 * Pack R prep, part 2 (the decision sheet; all off by default): npcSpecials: 0 = the NPCs make their Bestiary Strikes (the calibration so far), else the
 * scale of the Special multipliers (1 = the book's × 1.4 / 2.2 / 3.5; 1.25) and an NPC with a `kit` spends every AP left after moving on its Specials and
 * Basic attacks (3 Strikes at most) · apGuard: Guard per turn AP left unspent at the end of a PC's turn (it adds to other Guard and ends at the start of
 * its next turn; the Reaction AP never converts) · apGuardKeep: those AP may still pay a Reaction (each one spent loses its Guard) · escHooks: the
 * Escalation hooks (+1 Escalation once an encounter on a Critical; the build's `escHook`: "ally" = an ally within 5 squares becomes Bloodied or goes
 * Down, "quarry" = its Marked Quarry goes Down; each once an encounter, used only when it raises the Escalation) · oaDisrupt: a Critical on an
 * Opportunity Attack stops the movement (the book today; Lucas, 2026-11-04: off in pack R, a Talent later) · bloodiedBanes: the book's Bloodied rule (1 Bane
 * on [Strike] and [Weapon] Actions while Bloodied, PCs and NPCs; off: the ruler's calibrations never had it, and pack R removes it).
 */
/**
 * The ruler catch-up (2026-11-12): **the default is the book's rules today (pack R)**: 4 AP + 1 Reaction AP for PCs and NPCs (a Minion 3; the
 * system's config.mjs apPerTurn / reactionAp / npcRoles.ap), Escalation as a level from 1 (2 with Momentum) with the Critical and class hooks, the
 * unused AP's Guard (apGuard "stage": config.mjs guardPerAp, 2 / 3 / 4; given when the next turn starts, for 1 round: guardAt "next"), the NPCs'
 * Specials, Opportunity Attack for every creature (oaAll) with no disrupt, the live Bestiary with Elite Escalation and the phases.
 * **RULES_PRE_R** is the book before pack R (5 AP, no Reaction AP, Escalation spent...): the pre-R studies set it (`node spec.mjs --pre-r`,
 * econ.mjs, positions.mjs, progression.mjs, bestiary.mjs, rework.mjs's "today" side). New switches: oaAll (every creature has the Opportunity
 * Attack Reaction: a PC's class file needs no line for it), guardAt ("end": the Guard starts when the turn ends, pack R prep's model; "next": the
 * book since v0.0.274: each AP still unused when the next turn starts gives Guard for 1 round), startEsc (the Escalation an encounter starts with),
 * npcOa (false: the NPCs make no Opportunity Attack; a measurement), oaPolicy (a decision, not a rule: "spare" = a PC with a class Reaction makes the
 * basic Opportunity Attack only with an AP to spare, so its Reaction AP stays for the class Reaction; "first" = it reacts to the first trigger. "spare"
 * loses less Health in every fight measured: report.md, "Reactions in the 4 + 1 AP economy"), reactFromStart (false: the book and Foundry: a creature
 * gains its Reaction AP when it regains AP at the start of its turn, so it has none before its first turn of an encounter; true: pack R prep's
 * model, it has one from the first moment), areasOnGrid (SIM-2: on a map an Action's Area is always placed on the grid and a lasting one is a Zone;
 * true does the same on the open field too, where the default keeps the number of creatures the card's ruler line says: report.md's gate), outAtOnce (true: an enemy at 0 Health is out at once and the rest of the turn goes to another; false: the ruler until 2026-11-12, which marked it out
 * at the end of the turn and kept hitting it: its "damage dealt" counted damage past the last point of Health).
 * The Stage 0 prototype's switches (none is a rule; sim/stage0.mjs sets them): escMax (the Escalation ladder's top: 3, or 6), engagedRanged ("banes": 2 Banes on a
 * [Ranged] Action while Engaged; "doomed": the roll is Doomed), rangedOa (a [Ranged] Action while Engaged draws Opportunity Attacks), meleeGuard (Guard a melee PC
 * has until its next turn when it ends its turn Engaged).
 */
export const RULES_PRE_R = { ap: 5, reactionAp: 0, escalation: "spent", npcAp: 5, minionAp: 3, npcReactionAp: 0, npcSpecials: 0, apGuard: 0, apGuardKeep: false, guardAt: "end", escHooks: false, oaDisrupt: true, oaAll: false, npcOa: true, oaPolicy: "first", reactFromStart: true, areasOnGrid: false, outAtOnce: false, escMax: TW.escalation.max, engagedRanged: "banes", rangedOa: false, meleeGuard: 0, weapons: "r", momentum: "flag", startEsc: 0, bloodiedBanes: false, bestiary: "today", eliteEsc: false, elitePhases: false };
export const RULES_R = { ap: TW.apPerTurn, reactionAp: TW.reactionAp, escalation: "level", npcAp: TW.npcRoles.standard.ap, minionAp: TW.npcRoles.minion.ap, npcReactionAp: TW.reactionAp, npcSpecials: 1, apGuard: "stage", apGuardKeep: true, guardAt: "next", escHooks: true, oaDisrupt: false, oaAll: true, npcOa: true, oaPolicy: "spare", reactFromStart: false, areasOnGrid: false, outAtOnce: true, escMax: TW.escalation.max, engagedRanged: "banes", rangedOa: false, meleeGuard: 0, weapons: "r", momentum: "flag", startEsc: TW.escalation.min, bloodiedBanes: false, bestiary: "r", eliteEsc: true, elitePhases: true };
/**
 * Stage 0 into the book (2026-11-12): **RULES_BOOK is the book today for the classes as their cards are written**: pack R's rules (RULES_R) with what
 * changed for every creature: no basic Opportunity Attack (oaAll and npcOa off: it left the Basic Actions, for PCs and NPCs) and a [Ranged] Action while
 * Engaged is Doomed (the system's roundrules.mjs: BASIC_OPPORTUNITY_ATTACK, ENGAGED_RANGED_DOOMED). The weapon table changed too: the class files'
 * `weapon` lines. **RULES_S0 adds the 1-to-6 Escalation ladder and Momentum 0 to 4** (momentum "ladder": a day's fights start at Escalation
 * 1 + Momentum, +1 per encounter overcome, -1 per PC that went Down; roundrules.mjs escalationStartAt, momentumAfter). It is not the default yet,
 * because the class cards still write their Passives at Escalation 1 / 2 / 3 and the Apex at 3: sim/stage0.mjs sets it, with the Passives moved to
 * 2 / 4 / 6 and the level lists of decisions-s1.md. When the class cards are on the new ladder (the card sessions), RULES becomes RULES_S0: one line.
 * weapons "r": a class file's `weapon` line is read with the weapon table of before Stage 0 (WEAPONS_R below), so the studies pinned to RULES_R
 * (maps.md, policies.md, areas.md, playtest-4-sim.md, reactions.md, rclasses.md, rbestiary.md) still come out as they were written.
 * RULES_R stays as pack R's rules (the Opportunity Attack for every creature, 2 Banes): the studies of that time can still set it.
 */
/** The weapon table before Stage 0 (Chapter 15 until 2026-11-12), for the builds' weapons: read when RULES.weapons is "r". */
export const WEAPONS_R = { Greatsword: "0 / 1d8 / 2d6", Crossbow: "0 / 1d4+2 / 1d10+2" };
export const RULES_BOOK = { ...RULES_R, weapons: "book", oaAll: RR.BASIC_OPPORTUNITY_ATTACK, npcOa: RR.BASIC_OPPORTUNITY_ATTACK, engagedRanged: RR.ENGAGED_RANGED_DOOMED ? "doomed" : "banes" };
export const RULES_S0 = { ...RULES_BOOK, escMax: RR.ESC_LADDER_MAX, momentum: "ladder", eliteMax: RR.ESC_LADDER_MAX, eliteRungs: RR.ELITE_RUNGS_LADDER, minionSquad: RR.MINION_SQUAD };   // eliteMax / eliteRungs (Lucas, 2026-11-12): an Elite's Escalation follows the 1-to-6 ladder; its three abilities at 2, 4 and 6 until it gets its own
export const RULES = { ...RULES_BOOK };
/** Guard per unused AP for a PC of this level (apGuard "stage": the book's 2 / 3 / 4 by Stage; a number: that much). */
export const guardPerAp = lv => (RULES.apGuard === "stage" ? GD.guardPerAP(CF.stageOf(lv)) : Number(RULES.apGuard) || 0);
// Pack R-bestiary (2026-11-05): bestiary "today" reads the pre-R tables (bestiary-today.mjs: report.md stays), "r" the live tables of config.mjs (the ones
// R-bestiary writes); eliteEsc: an Elite's Escalation (1 in round 1, +1 a round: its first attack each round has 1 Boon; at 2 its Round Special twice a round;
// at 3 its Encounter Special comes back once); elitePhases: +1 Escalation when it becomes Bloodied and when it becomes Strained (once each).
// An NPC tagged `power` (fights.txt: `1 standard power`) attacks Ward Defense and deals [R]: its damage is Resolve damage on the PC (Strained).
/** An NPC's average damage on one Strike against this AD (no Banes). */
export const npcStrikeAvg = (npc, ad) => { const p = C.tierProbs(npc.mod, ad, 0, 0, ""); return p[1] * npc.t2 + p[2] * npc.t3; };

/* ------------------------------------------------------------------ random numbers (seeded) */
export function rng(seed = 2026) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const die = (R, s) => 1 + Math.floor(R() * s);
/**
 * One roll, die by die, with the system's own rules (calc.mjs: bbFive, mergeState, keepThree, tierOf): 2d12 + mod + Boons - Banes against a DC, each 12
 * counted as 11 and rolled again; 3d12 when Favored or Doomed. Returns { tier, crit, total }. The fights pick a Tier from tierProbs (the same odds, faster);
 * `--check` rolls this against them, and SIM can roll it.
 */
export function rollDice(R, mod, dc, boons = 0, banes = 0, state = "") {
  const one = () => { let f = die(R, 12), t = 0; const first = f; while (f === 12) { t += 11; f = die(R, 12); } return { f: first, t: t + f }; };
  const five = C.bbFive(boons, banes), st = C.mergeState(state, five.five);
  if (!st) { const a = one(), b = one(), total = a.t + b.t + mod + five.add; return { ...C.tierOf(total, dc, a.f === b.f), total }; }
  const trio = [one(), one(), one()], k = C.keepThree(trio, st), total = trio[k.keep[0]].t + trio[k.keep[1]].t + mod + five.add;
  return { ...C.tierOf(total, dc, k.doubles, k.triple), total };
}
/** The map's rules against the book's examples (Chapter 3: Flanking, Cover; Chapter 1: Named Boons and Banes): [name, got, want]. */
export function mapChecks() {
  const mk = (side, x, y, o = {}) => ({ side, pos: { x, y }, melee: true, cond: MP.noCond(), ...o }), out = [];
  const world = (pcs, foes, cover = []) => ({ pcs, foes, R: () => 0, M: { ...MP.MAP, cover, off: {} } });
  const g = mk("npc", 0, 0), a = mk("pc", -1, 0), b = mk("pc", 1, 0), c = mk("pc", 0, 1), d = mk("pc", 0, -1), g2 = mk("npc", -2, 0);
  out.push(["Flanking, two flankers", MP.flankBoons(a, g, world([a, b], [g])), 1]);
  out.push(["Flanking, three flankers (the limit)", MP.flankBoons(a, g, world([a, b, c], [g])), 2]);
  out.push(["Flanking, four flankers and one cancel (3 - 1, then the limit)", MP.flankBoons(a, g, world([a, b, c, d], [g, g2])), 2]);
  out.push(["Flanking, three flankers and one cancel", MP.flankBoons(a, g, world([a, b, c], [g, g2])), 1]);
  const sh = mk("pc", -6, 0, { melee: false, range: [10, 20, 40] }), far = mk("npc", 0, 0, { cond: { ...MP.noCond(), prone: true } }), pal = mk("pc", 1, 0);
  const m1 = MP.mapMods(sh, far, "ranged", world([sh, pal], [far], [{ p: 1, n: 2 }]));   // Medium cover 2 + into melee 1 + Prone 1 = 4 Field Banes: 2
  out.push(["the Field limit (Medium cover, into melee, Prone)", [m1.banes, m1.fieldBanes, m1.doomed], [2, 4, false]]);
  const sh2 = mk("pc", -15, 0, { melee: false, range: [10, 20, 40] });
  const m2 = MP.mapMods(sh2, far, "ranged", world([sh2, pal], [far], [{ p: 1, n: 2 }]));   // far range adds 1 unnamed Bane on top
  out.push(["range Banes add to the Field ones", m2.banes, 3]);
  const m3 = MP.mapMods(sh, far, "ranged", world([sh, pal], [far], [{ p: 1, n: 3 }]));   // High cover: Doomed, no Field Banes from the Cover; into melee and Prone stay
  out.push(["High cover (Doomed, the other Field Banes stay)", [m3.banes, m3.doomed], [2, true]]);
  const m4 = MP.mapMods(a, far, "melee", world([a, b, c], [far]));   // Flanking 2 + Prone 1 = 3 Field Boons: 2
  out.push(["the Field limit on Boons (Flanking 2, Prone)", m4.boons, 2]);
  return out;
}
export const pickU = (x, probs) => (x < probs[0] ? 1 : x < probs[0] + probs[1] ? 2 : 3);
export const pick = (R, probs) => pickU(R(), probs);

/* ------------------------------------------------------------------ damage expressions */
/**
 * "[B] 1[W] + [Mod] + [M] 2d6 Ho" -> { w: 1, mod: 1, dice: [[2, 6]], flat: 0 }. Pools ([B] [M]) and damage types (Ho, Pi...) are read and left out
 * (the fight counts one Health Pool). "0", "-" and "" are no damage.
 */
export function parseDamage(text) {
  // Pack R prep: the pool of each part is kept (mind: the share of the expression that is Mind damage, [M]; the rest is Body) for the Bloodied / Strained counts.
  const out = { w: 0, mod: 0, dice: [], flat: 0, mind: { w: 0, mod: 0, dice: [], flat: 0 } };
  const t = String(text ?? "").replace(/\[(B|C|V)\]/g, " [B] ").replace(/\[(M|R)\]/g, " [M] ").replace(/\b(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, " ").trim();
  if (!t || t === "-" || t === "0" || t === "[B]" || t === "[M]") return out;
  let pool = "B";
  for (const raw of t.split("+")) {
    let p = raw.trim();
    let m;
    if (!p) continue;
    if ((m = p.match(/^\[(B|M)\]\s*(.*)$/))) { pool = m[1]; p = m[2].trim(); if (!p) continue; }
    const into = pool === "M" ? out.mind : out;
    if ((m = p.match(/^(\d*)\[W\]$/))) { out.w += Number(m[1] || 1); if (pool === "M") into.w += Number(m[1] || 1); }
    else if (p === "[Mod]") { out.mod += 1; if (pool === "M") into.mod += 1; }
    else if ((m = p.match(/^(\d+)d(\d+)$/))) { out.dice.push([Number(m[1]), Number(m[2])]); if (pool === "M") into.dice.push([Number(m[1]), Number(m[2])]); }
    else if ((m = p.match(/^-?\d+$/))) { out.flat += Number(p); if (pool === "M") into.flat += Number(p); }
    else throw new Error(`can't read the damage "${text}" (the part "${p}")`);
  }
  return out;
}
/** The share of a damage expression that is Mind damage, at its average (a [W] counts the weapon's average on this tier). */
export function mindShare(dmg, weapon = null, tier = 2, mod = 0) {
  if (!dmg?.mind) return 0;
  const avg = d => avgDamage(d, weapon, tier, mod);
  const all = avg(dmg), m = avg({ ...dmg.mind, mind: null });
  return all > 0 ? Math.max(0, Math.min(1, m / all)) : 0;
}
/** The weapon's damage of a tier ("1d8", "1d10+2"), as parsed parts. */
export const weaponTier = (weapon, tier) => parseDamage(weapon?.tiers?.[tier - 1] ?? "0");
/** Roll a damage expression: { total, dice: how many dice were rolled } (Empowered adds per die; a die never goes below 1 with Enfeebled). */
export function rollDamage(R, dmg, { weapon = null, tier = 2, mod = 0, empowered = 0, keepBest = 0 } = {}) {
  let total = dmg.flat + dmg.mod * mod, n = 0;
  const rolled = [];   // [sides, value] of every die (keep the best)
  const roll = (count, sides) => { for (let k = 0; k < count; k++) { const v = Math.max(1, die(R, sides) + empowered); total += v; n++; rolled.push([sides, v]); } };
  for (const [c, s] of dmg.dice) roll(c, s);
  for (let k = 0; k < dmg.w; k++) { const wt = weaponTier(weapon, tier); total += wt.flat; for (const [c, s] of wt.dice) roll(c, s); }
  // Keep the best (pack LV, proposed): roll keepBest extra dice of the largest size rolled, then drop as many of the lowest dice of that size.
  if (keepBest && rolled.length) {
    const big = Math.max(...rolled.map(x => x[0])), pool = rolled.filter(x => x[0] === big).map(x => x[1]);
    for (let k = 0; k < keepBest; k++) pool.push(Math.max(1, die(R, big) + empowered));
    pool.sort((x, y) => x - y);
    total += pool.slice(keepBest).reduce((s2, v) => s2 + v, 0) - rolled.filter(x => x[0] === big).reduce((s2, x) => s2 + x[1], 0);
  }
  return { total, dice: n };
}

/** The average of a damage expression on a tier (Empowered per die; the extras only when the tier deals damage). */
export function avgDamage(dmg, weapon, tier, mod, emp = 0, extra = []) {
  const wt = weaponTier(weapon, tier), dice = d => d.reduce((s, [c, n]) => s + c * ((n + 1) / 2 + emp), 0);
  const deals = dmg.dice.length || dmg.flat || dmg.mod || (dmg.w && (wt.dice.length || wt.flat));
  if (!deals) return 0;
  return dmg.flat + dmg.mod * mod + dice(dmg.dice) + dmg.w * (wt.flat + dice(wt.dice)) + extra.reduce((s, x) => s + x.flat + x.mod * mod + dice(x.dice), 0);
}

/* ------------------------------------------------------------------ NPCs from the Bestiary */
/** A role's Specials (the Bestiary's Special Actions; config.mjs npcSpecial: 1 AP × 1.4, 2 AP × 2.2, 3 AP × 3.5): Minions and Grunts the 1 AP one once a round, Standards the 2 AP one, Elites that and the 3 AP one once an encounter. */
export function npcKit(role) {
  const x = k => TW.npcSpecial.find(s => s.key === k).x, s1 = { ap: 1, mult: x("s1") }, s2 = { ap: 2, mult: x("s2") }, s3 = { ap: 3, mult: x("s3") };
  return { minion: { round: s1 }, grunt: { round: s1 }, standard: { round: s2 }, elite: { round: s2, enc: s3 } }[role] ?? { round: s2 };
}
/** A Bestiary NPC (every rating Medium but the Weapon Attribute, High as in the Builder): Health, Defenses, Modifier, damage, Strikes a turn. */
export function npcOf(role, rating = "medium", level = 1, opts = {}) {
  const r = TW.npcRoles[role] ?? TW.npcRoles.standard, R = TW.npcRatings, attr = k => r.attr + R[k].off;
  const body = attr("high"), mind = attr("medium");
  const hm = bHm(role, opts.hrating ?? rating, level),   // SIM-4: opts.hrating / opts.drating: its Health and its Basic attack can have their own rating (an Ogre: Health Medium, attack High); opts.name
     hp = a => Math.max(0, Math.ceil((a + 2) * hm + r.hb - 1e-9));
  // The catch-up: an NPC's Modifiers are ratings of its role's table (the Bestiary, Attributes and Modifiers; the system's npcModRatings / npcModValue):
  // by default the lead one Medium and the other Low (a Standard's Medium too); a `power` NPC leads with Power. fights.txt: `wmod-high`, `pmod-low`.
  // `mod` is the Modifier of its Basic attack (Weapon; Power for a `power` NPC). Before: ceil(Body / 2 + 1), the same numbers at the defaults.
  const mr = DM.npcModRatings({ role, modLead: opts.power ? "power" : "weapon", ratings: { wmod: opts.wmod ?? "", pmod: opts.pmod ?? "" } });
  const weaponMod = DM.npcModValue(role, mr.weapon), powerMod = DM.npcModValue(role, mr.power), mod = opts.power ? powerMod : weaponMod;
  const kit = RULES.npcSpecials ? npcKit(role) : undefined;
  return { role, rating, name: opts.name ?? r.label, pool: hp(body) + hp(mind), ad: Math.max(TW.defenseBase, r.defense), wd: Math.max(TW.defenseBase, r.defense), mod, weaponMod, powerMod, modRatings: mr, ...(kit ? { kit } : {}),
    save: { body, mind, instinct: attr("medium"), appeal: attr("medium") }, t2: bDmg(role in TW.npcRoles ? role : "standard", opts.drating ?? rating, level)[0], t3: bDmg(role in TW.npcRoles ? role : "standard", opts.drating ?? rating, level)[1],
    strikes: { minion: 1, grunt: 2, standard: 2, elite: 3 }[role] ?? 2, bodyPool: hp(body), mindPool: hp(mind),
    apMax: role === "minion" ? RULES.minionAp : RULES.npcAp, speed: opts.speed ?? 5, ranged: !!opts.ranged, power: !!opts.power };   // the map model: AP a turn (the Bestiary), Speed 5, a ranged Basic attack; power: Vs. WD, [R] (pack R-bestiary)
}
/** Which of the Bestiary's Actions a damage multiplier is (config.mjs npcSpecial: 1 basic, 1.4 s1, 2.2 s2, 3.5 s3). */
export const specialKey = mult => TW.npcSpecial.reduce((b, x) => (Math.abs(x.x - mult) < Math.abs(b.x - mult) ? x : b)).key;
/**
 * A Stage 0 NPC (the Bestiary since 2026-11-12; the system's config.mjs npcStage0, or a `table` of the same shape: the fit tries several): its Vigor and
 * its Resolve are each a ready number by rating (no Attributes, no multiplier; a Minion has none: any damage kills it, a pool of 1 here), and its Basic attack and Specials are written damage ("2 + 1d4").
 * Defenses, Modifiers, AP and the Specials it has are its role's, as at every Stage (npcOf).
 */
export function npcS0(role, rating = "medium", opts = {}, table = TW.npcStage0) {
  const n = npcOf(role, rating, 1, opts), key = role in table ? role : "standard", t = table[key], col = k => Math.min(t.basic.length - 1, TW.npcRatings[k]?.i ?? 2);
  if (t.ap) n.apMax = t.ap;   // a Stage 0 Grunt has 3 AP a turn
  const lower = k => Object.keys(TW.npcRatings).find(x => TW.npcRatings[x].i === Math.max(0, (TW.npcRatings[k]?.i ?? 2) - (TW.npcRangedStep ?? 0))) ?? k;
  const hp = t.oneHit ? 0.5 : t.health[col(opts.hrating ?? rating)], dr = col(opts.drating ?? (opts.ranged ? lower(rating) : rating)), dmg = {};   // a ranged attack pays one step of damage rating for its range (config.mjs npcRangedStep), unless the caller gives its damage rating
  for (const k of ["basic", "s1", "s2", "s3"]) if (t[k]) dmg[k] = t[k][dr].map(parseDamage);
  const avg = e => avgDamage(e, null, 2, 0);
  const def = k => (TW.npcDefense?.[key] ?? [])[col(k)]; if (opts.adrating && def(opts.adrating)) n.ad = def(opts.adrating); if (opts.wdrating && def(opts.wdrating)) n.wd = def(opts.wdrating);   // its Defenses by rating (config.mjs npcDefense), Medium unless given
  const vig = opts.vrating ? t.health[col(opts.vrating)] : hp, res = opts.rrating ? t.health[col(opts.rrating)] : hp;   // Vigor and Resolve can each have their own rating (a Role's preset)
  return { ...n, stage: 0, pool: vig + res, bodyPool: vig, mindPool: res, dmg, t2: avg(dmg.basic[0]), t3: avg(dmg.basic[1]) };
}
/** An NPC's attack damage on a tier: the Builder's dice for the average, the Modifier added (Tier 1 deals nothing). */
export const DICE = [[0, 0, 0], [1, 1, 1], [1, 2, 2], [1, 4, 2.5], [1, 6, 3.5], [1, 8, 4.5], [1, 10, 5.5], [1, 12, 6.5], [2, 6, 7], [2, 8, 9], [2, 10, 11], [2, 12, 13], [3, 8, 13.5], [3, 10, 16.5], [3, 12, 19.5], [4, 10, 22], [4, 12, 26]];
export const diceFor = avg => DICE.reduce((b, d) => (Math.abs(d[2] - avg) < Math.abs(b[2] - avg) ? d : b));
export function npcDamage(R, npc, tier) {
  if (tier < 2) return 0;
  if (npc.curDmg) return rollDamage(R, npc.curDmg[tier - 2]).total;   // the Bestiary's turn budget: the Action's own damage
  if (npc.dmg) { const e = npc.dmg[specialKey(npc.curMult ?? 1)] ?? npc.dmg.basic; return rollDamage(R, e[tier - 2]).total; }   // Stage 0: the table's own damage (a flat part plus one small die), Specials included
  const avg = tier === 2 ? npc.t2 : npc.t3, d = diceFor(avg - npc.mod);
  let t = npc.mod;
  if (d[1] <= 2 && d[0] === 1) t += d[1]; else for (let k = 0; k < d[0]; k++) t += die(R, d[1]);
  if (npc.exact) t += avg - npc.mod - d[2];   // pack E3: the table's average exactly (the dice's mean moved by a flat amount), not the nearest dice
  return Math.max(0, t) * (npc.curMult ?? 1);   // pack R prep: a Special Action deals the Basic attack's damage × its multiplier
}
