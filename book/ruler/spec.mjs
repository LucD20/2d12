// The spec-driven ruler (2026-10-29; adventuring days added the same day): describe a class build in a plain file and the fights in book/ruler/fights.txt;
// this script writes book/ruler/report.md: each turn's damage against Defense 12 to 14, the build's numbers, duels against each NPC role
// (rounds to kill it, rounds to go Down), a Monte Carlo fight of the party against each encounter (rounds, Health lost, who goes Down), what the
// Reactions do, and adventuring days. It uses the system's own rules, one copy of each (foundry/twod12/module: calc.mjs the dice, config.mjs the
// Bestiary and the AP, data.mjs the NPC Modifier ratings, guard.mjs the unused AP's Guard). Random numbers are seeded: the same files give the same report.
// Since the catch-up (2026-11-12) the default is the book's rules today (pack R: RULES below) and the classes of today (book/ruler/rework/*.txt).
//   node book/ruler/spec.mjs            writes report.md and prints it
//   node book/ruler/spec.mjs --quiet    writes report.md only
//   node book/ruler/spec.mjs --check    checks the simulation against the exact dice math (calc.mjs) and the map's rules; prints only "ok"
//   node book/ruler/spec.mjs --pre-r    the classes before pack R (classes/*.txt, fights-pre-r.txt) under RULES_PRE_R; writes report-pre-r.md
// The file format is described in book/ruler/README.md ("The spec files").
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
globalThis.foundry ??= { utils: {}, applications: { api: {} } }; globalThis.foundry.data ??= { fields: {} }; globalThis.foundry.data.fields ??= {}; globalThis.foundry.abstract ??= {}; globalThis.foundry.abstract.TypeDataModel ??= class {};   // stand-ins: the system's data.mjs declares its data models on load (the ruler reads only its pure NPC Modifier functions) globalThis.game ??= { settings: { get: () => true } }; globalThis.CONFIG ??= {}; globalThis.Hooks ??= { on() {} };
const HERE = fileURLToPath(new URL(".", import.meta.url));
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);
const TW = CF.TWOD12;
const GD = await import(new URL("../../foundry/twod12/module/guard.mjs", import.meta.url).href);   // the catch-up: the unused AP's Guard by Stage (guardPerAP), the system's own
const DM = await import(new URL("../../foundry/twod12/module/data.mjs", import.meta.url).href);   // the catch-up: the NPC Modifier ratings (npcModRatings, npcModValue), the system's own
const BT = await import(new URL("./bestiary-today.mjs", import.meta.url).href);   // pack R-bestiary: the pre-R tables (RULES.bestiary "today")
const bHm = (...a) => (RULES.bestiary === "r" ? CF.npcHm : BT.npcHm)(...a), bDmg = (...a) => (RULES.bestiary === "r" ? CF.npcDamage : BT.npcDamage)(...a);
const MP = await import(new URL("./map.mjs", import.meta.url).href);   // the map model (pack E2)
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
 * model, it has one from the first moment).
 */
export const RULES_PRE_R = { ap: 5, reactionAp: 0, escalation: "spent", npcAp: 5, minionAp: 3, npcReactionAp: 0, npcSpecials: 0, apGuard: 0, apGuardKeep: false, guardAt: "end", escHooks: false, oaDisrupt: true, oaAll: false, npcOa: true, oaPolicy: "first", reactFromStart: true, startEsc: 0, bloodiedBanes: false, bestiary: "today", eliteEsc: false, elitePhases: false };
export const RULES_R = { ap: TW.apPerTurn, reactionAp: TW.reactionAp, escalation: "level", npcAp: TW.npcRoles.standard.ap, minionAp: TW.npcRoles.minion.ap, npcReactionAp: TW.reactionAp, npcSpecials: 1, apGuard: "stage", apGuardKeep: true, guardAt: "next", escHooks: true, oaDisrupt: false, oaAll: true, npcOa: true, oaPolicy: "spare", reactFromStart: false, startEsc: TW.escalation.min, bloodiedBanes: false, bestiary: "r", eliteEsc: true, elitePhases: true };
export const RULES = { ...RULES_R };
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
const die = (R, s) => 1 + Math.floor(R() * s);
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
const pickU = (x, probs) => (x < probs[0] ? 1 : x < probs[0] + probs[1] ? 2 : 3);
const pick = (R, probs) => pickU(R(), probs);

/* ------------------------------------------------------------------ the cards (book/cards/*.json; pack CS, 2026-11-03) */
// Every build starts with one action line per Version of every card that has tiers or a ruler modeling string (and a passive line per
// Passive with one): the same line a class file would write, generated from the card. A class file's own line for the same name overrides it
// (experiments, options; catalogue/paladin.txt keeps the old cards). `[PMod]` in a card's ruler string is the build's power-mod.
const CARDS = await import(new URL("../cards/load.mjs", import.meta.url).href);
const RFREQ = { "at-will": "at-will", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const rulerVs = vs => { const t = String(vs ?? "").trim(); if (/^AD$/i.test(t)) return "vs ad"; if (/^WD$/i.test(t)) return "vs wd"; const m = t.match(/^(\w+) Save$/); return m ? `vs save ${m[1].toLowerCase()}` : ""; };
export function cardLines(cards = CARDS.loadCards()) {
  const out = [];
  for (const c of cards) {
    if (c.ruler === false || c.ruler?.skip) continue;
    const multi = (c.versions ?? []).length > 1;
    for (const v of c.versions ?? []) {
      const tiers = v.tiers ? v.tiers.map(t => CARDS.splitTier(t)[0]) : null;
      const damage = tiers && tiers.some(CARDS.isDamage);
      if (!damage && !v.ruler) continue;   // nothing the ruler models (Advance, Interact...)
      const f = [`action ${c.name}${multi ? " " + v.ap : ""}`, `ap ${v.ap}`, RFREQ[String(c.frequency).toLowerCase()] ?? "none"];
      if (c.traits?.length) f.push(`traits ${c.traits.join(" ")}`);
      if (CARDS.isReaction(c)) f.push("reaction");
      if (c.escalation) f.push(`escalation ${c.escalation}`);
      const vs = rulerVs(c.vs); if (vs) f.push(vs);
      if (damage) f.push(`tiers ${tiers.map(t => (CARDS.isDamage(t) ? t : "0")).join(" / ")}`);
      if (v.ruler) f.push(v.ruler);
      out.push(f.join(" | "));
    }
    if (c.ruler?.passive) out.push(`passive ${c.name}: ${c.ruler.passive}`);
  }
  return out;
}
let CARD_LINES = null;
const cardLinesFor = () => (CARD_LINES ??= cardLines().filter(l => l.startsWith("action ")));   // every build has every card's Actions (its turns name the ones it uses)
let CARD_PASSIVES = null;   // a Passive is a build's choice: a class file names it ("passive Hallowed Stance") and the card's ruler string fills the line
const cardPassive = name => { CARD_PASSIVES ??= Object.fromEntries(cardLines().filter(l => l.startsWith("passive ")).map(l => { const m = l.match(/^passive (.+?):\s*(.+)$/); return [m[1].toLowerCase(), m[2]]; })); return CARD_PASSIVES[name.toLowerCase()]; };

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
const weaponTier = (weapon, tier) => parseDamage(weapon?.tiers?.[tier - 1] ?? "0");
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

/* ------------------------------------------------------------------ the spec files */
const clean = l => l.replace(/#.*$/, "").trim();
const words = s => String(s ?? "").toLowerCase().split(/[\s,+]+/).filter(Boolean);
const FREQ = new Set(["at-will", "turn", "round", "encounter", "daily", "none"]);

/** A damage expression written without pool markers: all Mind when the effect says "mind" (pack R prep: Radiant Zeal, Divine Surge, Lay On Hands' Holy rider). */
const poolOf = (dmg, rest) => (/\bmind\b/.test(rest) ? { ...dmg, mind: { w: dmg.w, mod: dmg.mod, dice: [...dmg.dice], flat: dmg.flat } } : dmg);
/** One effect: "boon 1 next shot strike", "empowered 1 turn", "extra 1d8 next @Smite", "heal 1 rally", "defense 1 ally", "taunt 1", "vulnerable 2", "area 2", "reload", "favored next ...". */
function parseEffect(text) {
  const t = text.trim(), w = t.split(/\s+/), what = w[0].toLowerCase(), n = Number(w[1]);
  const rest = w.slice(2).join(" ");
  const filter = s => { const at = s.match(/@([^,;]+)/), ws = words(s.replace(/@[^,;]+/, "")); return { name: at ? at[1].trim().toLowerCase() : "", quarry: ws.includes("quarry"), traits: ws.filter(x => !["next", "turn", "first", "first-hit", "each", "bloodied", "strained", "quarry", "on"].includes(x)) }; };   // first: the first matching Action each round; first-hit: the first that deals damage (Radiant Zeal)
  if (what === "boon" || what === "bane" || what === "empowered") return { kind: what, n, scope: /\bturn\b/.test(rest) ? "turn" : /\bencounter\b/.test(rest) ? "encounter" : "next", ...filter(rest.replace(/\bencounter\b/, "")) };   // encounter: until the fight ends (Hunter's Focus)
  if (what === "favored") return { kind: "favored", scope: "next", ...filter(w.slice(1).join(" ")) };
  if (what === "extra") return { kind: "extra", dmg: poolOf(parseDamage(w[1]), rest), scope: /\bfirst-hit\b/.test(rest) ? "first-hit" : /\bfirst\b/.test(rest) ? "first" : /\beach\b/.test(rest) ? "each" : "next", anyTier: /\bany-tier\b/.test(rest), bloodied: /\bbloodied\b/.test(rest), strained: /\bstrained\b/.test(rest), ...filter(rest.replace(/\bany-tier\b/, "").replace(/\bmind\b/, "")) };   // any-tier: a single-value Buff, which applies on Tier 1 too (the book, Buffs); "mind": Mind damage (Holy), else Body
  if (what === "heal") return { kind: "heal", n, who: /\bself\b/.test(rest) ? "self" : "ally" };
  if (what === "debuff") return { kind: "debuff", name: w.slice(1).join(" ") };   // counted for the day's report (Prone, Hindered...); no effect in the fight
  if (what === "defense") return { kind: "defense", n, who: /allies/.test(rest) ? "allies" : /self/.test(rest) ? "self" : "ally" };
  if (what === "taunt") return { kind: "taunt", n };
  if (what === "vulnerable") return { kind: "vulnerable", n, keep: /\bround\b/.test(rest) };   // round (pack R-classes): until the giver's next turn, not EoT (Open Season)
  if (what === "area") return { kind: "area", n };
  if (what === "reload") return { kind: "reload" };
  if (what === "reduce") return { kind: "reduce", n, adjacent: Number(rest.match(/adjacent\s+(\d+)/)?.[1] ?? 0), always: /\balways\b/.test(rest) };   // always (pack R-classes): no "haven't left your square" clause   // a passive: Body damage you (and N adjacent allies) take is reduced by n (each NPC Strike)
  if (what === "mend") return { kind: "mend", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // new Health (not a Rally Point): ally = the most hurt ally, any = you or an ally
  if (what === "guard") return { kind: "guard", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // Guard (proposed): a buffer that takes damage first and ends with the encounter; the highest one counts
  if (what === "surge") return { kind: "surge", dmg: poolOf(parseDamage(w[1]), rest) };   // the next ally (not you) who deals damage to the target before your next turn deals this extra ("mind": Mind damage)
  if (what === "bonus") return { kind: "bonus", n, ...filter(rest) };       // a passive: +n damage on matching Actions that deal damage
  if (what === "rally-bonus") return { kind: "rallybonus", n };
  if (what === "floor") return { kind: "floor", dmg: parseDamage(w[1]), ...filter(rest) };   // a passive (pack A1): matching Actions deal this on a Tier 1 (Marked Quarry: [Mod])
  if (what === "elusive") return { kind: "elusive", n };                                     // a passive (pack A1): the first NPC Strike against you each round takes N Banes              // a passive: you and your allies heal n more for each Rally Point used
  if (what === "block") return { kind: "block", dmg: parseDamage(w[1]) };    // price list: a Reaction that reduces one hit on an ally by this
  // Effects the price list (econ.mjs) reads; the fight ignores them.
  if (what === "banes") return { kind: "banes", n, others: /\bothers\b/.test(rest), text: rest };   // the target's (or the area's) Strikes take N Banes
  if (what === "heal-dice") return { kind: "healdice", dmg: parseDamage(w[1]) };                     // each ally in it heals that at the start of its turns
  if (what === "reduce-from") return { kind: "reducefrom", n };                                        // damage you take from the target's Actions is reduced by N
  if (["revive", "prevent-down", "evade", "push", "pull", "slide", "cover", "remove-effect", "save-boon", "range", "note", "steady-nerves", "long-draw", "clear-shot"].includes(what)) return { kind: what, n: Number.isFinite(n) ? n : 0, text: w.slice(1).join(" ") };
  throw new Error(`unknown effect "${t}"`);
}
/** "on 2+: boon 1 next divine; on 3: vulnerable 2" -> [{ min, max, effect }]. "always:" is every tier (and actions with no roll). */
function parseEffects(text) {
  const out = [];
  for (const part of String(text ?? "").split(";").map(s => s.trim()).filter(Boolean)) {
    const m = part.match(/^(on\s+(\d)(\+)?|always)\s*:\s*(.*)$/i);
    if (!m) { out.push({ min: 1, max: 3, effect: parseEffect(part) }); continue; }
    const min = m[2] ? Number(m[2]) : 1, max = m[2] ? (m[3] ? 3 : Number(m[2])) : 3;
    out.push({ min, max, effect: parseEffect(m[4]) });
  }
  return out;
}

/** A class build file -> the build. Errors say the line. */
export function parseSpec(text, file = "spec") {
  const b = { file, name: "", role: "", level: 1, attributes: {}, weaponMod: 2, powerMod: 2, health: null, armor: 0, wdBonus: 0, rally: 0, targeted: 1,
    weapon: null, actions: {}, passives: [], turns: {}, plan: [], when: [], speed: 5, reactions: [], dmgScale: 1, keepBest: null, overcastFloor: 0, healthFactor: null };
  const pmod = (text.match(/^power-mod\s+(\d+)/m) ?? [])[1] ?? "2";
  const pm = l => l.replace(/\[PMod(?:x(\d+))?([+-]\d+)?\]/g, (m, k, n) => String(Number(pmod) * Number(k ?? 1) + Number(n ?? 0)));   // [PMod+2], [PModx2], [PModx2+1]: the build's power-mod   // [PMod], [PMod+2]: the build's power-mod (card lines, and a file's own lines since pack R-classes)
  const lines = [...cardLinesFor().map(l => [pm(l), "book/cards"]), ...text.split(/\r?\n/).map(l => [pm(l), file])];
  lines.forEach(([rawLine, where], i) => {
    const line = clean(rawLine);
    if (!line) return;
    const fail = msg => { throw new Error(`${where}, line ${where === file ? i + 1 - cardLinesFor().length : i + 1}: ${msg}\n  ${rawLine.trim()}`); };
    const [head] = line.split(/\s+/), rest = line.slice(head.length).trim(), key = head.toLowerCase();
    try {
      if (key === "class") b.name = rest;
      else if (key === "role") b.role = rest;
      else if (key === "level") b.level = Number(rest);
      else if (key === "attributes") for (const p of rest.split(",")) { const [k, v] = p.trim().split(/\s+/); b.attributes[k.toLowerCase()] = Number(v); }
      else if (key === "weapon-mod") b.weaponMod = Number(rest);
      else if (key === "power-mod") b.powerMod = Number(rest);
      else if (key === "health") {   // health body x4 +3, mind x3 +4  (the book: (Attribute + 2) x multiplier + species, x (level / 10 + 1), rounded up)
        b.health = {};
        for (const p of rest.split(",")) { const m = p.trim().match(/^(body|mind)\s+x([\d.]+)\s*([+-]\s*\d+)?$/i); if (!m) fail("write health like: body x4 +3, mind x3 +4"); b.health[m[1].toLowerCase()] = { mult: Number(m[2]), sp: Number((m[3] ?? "0").replace(/\s/g, "")) }; }
      } else if (key === "armor") b.armor = Number(rest);
      else if (key === "ward") b.wdBonus = Number(rest);
      else if (key === "rally") b.rally = Number(rest);
      else if (key === "targeted") b.targeted = Number(rest);
      else if (key === "weapon") {   // weapon Crossbow (ranged, reload): 0 / 1d4+2 / 1d10+2
        const m = rest.match(/^(.+?)(?:\s*\(([^)]*)\))?:\s*(.+)$/); if (!m) fail("write weapon like: Greatsword (melee): 0 / 1d8 / 2d6");
        b.weapon = { name: m[1].trim(), traits: words((m[2] ?? "melee").replace(/range\s+[\d/]+/i, "")), tiers: m[3].split("/").map(s => s.trim()) };
        const rg = (m[2] ?? "").match(/range\s+([\d/]+)/i);   // its Range: normal / far / maximum (the map model); melee 1, ranged 10 / 20 / 40 by default
        b.weapon.range = rg ? rg[1].split("/").map(Number) : b.weapon.traits.includes("ranged") ? [10, 20, 40] : [1];
      }
      else if (key === "speed") b.speed = Number(rest);
      // The catch-up (pack R's sheet): `vigor 23` / `resolve 12` are the Health thresholds as the sheet shows them (Chapter 4: the class's Stage line + the species);
      // with them Rally Points = the Rally value + the Stage. `hook ally` / `hook quarry`: the class's Escalation hook. `no-opportunity`: it never makes an Opportunity Attack.
      else if (key === "vigor") b.vigor = Number(rest);
      else if (key === "resolve") b.resolve = Number(rest);
      else if (key === "hook") b.escHook = rest.toLowerCase();
      else if (key === "no-opportunity") b.noOa = true;
      // Progression models (pack LV, progression.mjs): none of these is a rule of the book yet.
      else if (key === "damage-scale") b.dmgScale = Number(rest);   // every damage it deals x this (the charter's "+10% a level", growth not on any card)
      else if (key === "keep-best") { const m = rest.match(/^(\d+)\s+(.+)$/); if (!m) fail("write keep-best like: keep-best 1 power"); b.keepBest = { n: Number(m[1]), traits: words(m[2]) }; }   // its Actions with these traits roll N extra dice and drop the lowest
      else if (key === "overcast-floor") b.overcastFloor = Number(rest);   // once a fight, an Action that costs up to N Escalation costs N less (the round-1 floor)
      else if (key === "health-factor") b.healthFactor = Number(rest);   // the level factor of Health (the book: (level + 10) / 10)
      else if (key === "reaction") {   // reaction Opportunity Attack: opportunity  ·  reaction Quick Draw: quick-draw  (the map model uses them)
        const m = rest.match(/^(.+?):\s*(opportunity|quick-draw(?:\s+\d+)?|overwatch|callshot|cover|ready|rebuke(?:\s+\d+)?(?:\s+turn)?|block\s+\S+(?:\s+(?:spill|round|ally))*)(?:\s+with\s+(.+))?$/i); if (!m) fail("write reaction like: Opportunity Attack: opportunity (or quick-draw; or block 1d8+[Mod]: a Reaction that takes that much off one NPC hit on you or an ally within 5 squares)");
        const kind = m[2].toLowerCase().split(/\s+/)[0];
        b.reactions.push({ name: m[1].trim(), kind, action: (m[3] ?? "Weapon Attack").trim(), ...(kind === "block" ? { dmg: parseDamage(m[2].split(/\s+/)[1]), spill: /\sspill\b/i.test(m[2]), round: /\sround\b/i.test(m[2]), ally: /\sally\b/i.test(m[2]) } : {}), ...(kind === "rebuke" ? { range: Number(m[2].split(/\s+/)[1] ?? 0), turn: /\bturn\b/i.test(m[2]) } : {}), ...(kind === "quick-draw" ? { range: Number(m[2].split(/\s+/)[1] ?? 5) } : {}) });   // spill: what the hit doesn't use becomes Guard on the target
      }
      else if (key === "action") {
        const f = rest.split("|").map(s => s.trim());
        const a = { name: f[0], ap: 0, freq: "none", traits: [], vs: "none", tiers: null, does: [], then: [], each: [], effects: [], escalation: 0, area: 1 };
        for (const field of f.slice(1)) {
          const fw = field.split(/\s+/), fk = fw[0].toLowerCase(), fv = field.slice(fw[0].length).trim();
          if (fk === "ap") a.ap = Number(fv);
          else if (FREQ.has(fk)) a.freq = fk;
          else if (fk === "traits") a.traits = words(fv);
          else if (fk === "vs") a.vs = fv.toLowerCase();
          else if (fk === "tiers") { const t = fv.split("/").map(s => s.trim()); if (t.length !== 3) fail("tiers needs three values: Tier 1 / Tier 2 / Tier 3"); a.tiers = t.map(parseDamage); a.tierText = t; }
          else if (fk === "does") a.does = fv.split(",").map(s => s.trim()).filter(Boolean).flatMap(s => { const m = s.match(/^(.+?)\s+x(\d+)$/); return m ? Array(Number(m[2])).fill(m[1].trim()) : [s]; });
          else if (fk === "each") a.each = fv.split(",").map(s => parseEffect(s));
          else if (fk === "escalation") a.escalation = Number(fv);
          else if (fk === "different") a.different = true;
          else if (fk === "favored") a.favored = true;      // the Action's own roll is Favored
          else if (fk === "allies") a.allies = Number(fv);   // price list: how many allies a buff or heal reaches (default 1)
          else if (fk === "rounds") a.rounds = Number(fv);   // price list: how many rounds its effects last (default 1)
          else if (fk === "reaction") a.reaction = true;     // price list: a Reaction (its AP come from the AP kept after your turn)
          else if (fk === "then") a.then = fv.split(",").map(s => s.trim()).filter(Boolean);   // Linked Actions made after its own roll (Smite 3's light)   // its Linked Actions each target a different creature
          else if (fk === "gives") a.gives = words(fv.replace(/^traits\s+/i, ""));   // its Linked Actions also count as having these traits (the book: they keep only their own)
          else a.effects.push(...parseEffects(field));
        }
        for (const e of a.effects) if (e.effect.kind === "area") a.area = e.effect.n;
        if (where !== file) a.fromCard = true;   // pack CS: a card's line (dropped below unless the build names it)
        b.actions[a.name.toLowerCase()] = a;
      } else if (key === "passive") {
        let full = rest;
        if (!rest.includes(":")) { const cp = cardPassive(rest.trim()); if (!cp) fail(`"${rest.trim()}" is not a card with a ruler passive (book/cards); write the passive in full`); full = `${rest.trim()}: ${pm(cp)}`; }   // pack CS: the card's line
        const m = full.match(/^(.+?):\s*(?:escalation\s+(\d)\s*:\s*)?(.+)$/i); if (!m) fail("write passive like: Marked Quarry: boon 1 shot strike");
        b.passives = b.passives.filter(x => x.name.toLowerCase() !== m[1].trim().toLowerCase());   // a file's passive line replaces the card's (pack CS)
        b.passives.push({ name: m[1].trim(), escalation: Number(m[2] ?? 0), effect: parseEffect(m[3]) });
      } else if (key === "turn") {
        const m = rest.match(/^(.+?):\s*(.+)$/); if (!m) fail("write turn like: Main: Smite 2, Weapon Attack, move 1");
        b.turns[m[1].trim().toLowerCase()] = { name: m[1].trim(), steps: m[2].split(",").map(s => s.trim()).filter(Boolean) };
      } else if (key === "plan") b.plan = rest.replace(/^:\s*/, "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);   // "A | B": A while its Encounter and Daily Actions are unused, else B
      else if (key === "when") {
        const m = rest.match(/^ally below (\d+)%\s*:\s*(.+)$/i), u = rest.match(/^unloaded\s*:\s*(.+)$/i), me = rest.match(/^self below (\d+)%\s*:\s*(.+)$/i), en = rest.match(/^engaged\s*:\s*(.+)$/i), es = rest.match(/^escalation (\d)\s*:\s*(.+)$/i), rd = rest.match(/^ready\s*:\s*(.+)$/i);
        if (m) b.when.push({ below: Number(m[1]) / 100, turn: m[2].trim().toLowerCase() });
        else if (es) b.whenEsc = { esc: Number(es[1]), turn: es[2].trim().toLowerCase() };
        else if (rd) b.whenReady = rd[1].trim().toLowerCase();   // pack R-classes: the turn it takes with the AP its "ready" Reaction gave it (Ready Shot: a 5 AP turn)   // pack R-classes: the turn it takes at that Escalation or more (the Apex turn), while its Encounter Actions are unused
        else if (me) b.whenSelf = { below: Number(me[1]) / 100, turn: me[2].trim().toLowerCase() };
        else if (u) b.unloadedTurn = u[1].trim().toLowerCase();
        else if (en) b.whenEngaged = en[1].trim().toLowerCase();   // the map model: the turn it takes when it starts its turn Engaged
        else fail("write when like: when ally below 50%: Heal, when self below 30%: Steel, when escalation 3: Apex, or when unloaded: Reload turn");
      }
      else fail(`unknown line "${head}"`);
    } catch (e) { if (/line \d+:/.test(e.message)) throw e; fail(e.message); }
  });
  // The derived numbers (the book's formulas).
  const lvf = b.healthFactor ?? (b.level + 10) / 10, at = k => Number(b.attributes[k] ?? 0);
  const thr = (k, h) => Math.max(0, Math.ceil(((at(k) + 2) * h.mult + h.sp) * lvf));
  b.bodyHealth = b.health ? thr("body", b.health.body) : 0; b.mindHealth = b.health ? thr("mind", b.health.mind) : 0;
  b.pool = b.bodyHealth + b.mindHealth;
  b.ad = 11 + b.armor; b.wd = 11 + b.powerMod + b.wdBonus;
  b.rallyPoints = b.rally + Math.ceil((at("body") + at("mind") + b.level) / 2);
  if (b.vigor != null || b.resolve != null) { b.bodyHealth = b.vigor ?? b.bodyHealth; b.mindHealth = b.resolve ?? b.mindHealth; b.pool = b.bodyHealth + b.mindHealth; b.rallyPoints = b.rally + CF.stageOf(b.level); }
  b.rallyHeal = Math.ceil(b.pool / 4);
  // The catch-up: every creature has the Opportunity Attack Reaction (Chapter 2, Reactions; the Basic Action's card): a build gets it without a line
  // (`basic`: used only while RULES.oaAll; a file's own `reaction ...: opportunity` line is the pre-R Talent and always counts).
  if (!b.noOa && !b.reactions.some(r => r.kind === "opportunity") && b.weapon) b.reactions.push({ name: "Opportunity Attack", kind: "opportunity", action: "Weapon Attack", basic: true });
  // Pack CS: a build keeps the card Actions its turns, reactions and Linked Actions name (with their other Versions, for the lower-Version fallback) and drops the rest,
  // so a build has only its own cards (the day model and the fallbacks look at a build's whole action list).
  const named = new Set();
  for (const t of Object.values(b.turns)) for (const s of t.steps) { const st = stepOf(s); if (st.kind === "action") { named.add(st.name); if (st.alt) named.add(st.alt); } }
  for (const r of b.reactions) { named.add(r.name.toLowerCase()); named.add(stepOf(r.action).name); }   // "with Quick Shot (+1 boon)": the Action the Reaction makes
  const grp = n => n.replace(/ \d$/, "");
  for (let more = true; more;) { more = false; for (const a of Object.values(b.actions)) if (!a.fromCard || named.has(a.name.toLowerCase()) || [...named].some(n => grp(n) === grp(a.name.toLowerCase()))) for (const d of [...a.does, ...a.then]) if (!named.has(d.toLowerCase())) { named.add(d.toLowerCase()); more = true; } }
  const groups = new Set([...named].map(grp));
  for (const [k, a] of Object.entries(b.actions)) if (a.fromCard && !named.has(k) && !groups.has(grp(k))) delete b.actions[k];
  // Every turn and plan entry must name things that exist.
  for (const t of Object.values(b.turns)) for (const s of t.steps) { const st = stepOf(s); if (st.kind === "action" && (!b.actions[st.name] || (st.alt && !b.actions[st.alt]))) throw new Error(`${file}: turn "${t.name}" uses "${s}", which is not an action of the file`); }
  for (const p of [...b.plan.flatMap(x => x.split("|").map(y => y.trim())), ...b.when.map(w => w.turn), ...(b.unloadedTurn ? [b.unloadedTurn] : []), ...(b.whenSelf ? [b.whenSelf.turn] : []), ...(b.whenEsc ? [b.whenEsc.turn] : []), ...(b.whenReady ? [b.whenReady] : []), ...(b.whenEngaged ? [b.whenEngaged] : [])]) if (!b.turns[p]) throw new Error(`${file}: the plan names "${p}", which is not a turn of the file`);
  for (const a of Object.values(b.actions)) for (const d of [...a.does, ...a.then]) if (!b.actions[d.toLowerCase()]) throw new Error(`${file}: "${a.name}" does "${d}", which is not an action of the file`);
  return b;
}
/** A turn's step: "move 1", "Weapon Attack", "Weapon Attack (reload shot)", "Weapon Attack (+1 boon)". */
function stepOf(s) {
  const mv = s.match(/^move\s+(\d+)$/i);
  if (mv) return { kind: "move", ap: Number(mv[1]), how: "move" };
  if (/^advance$/i.test(s)) return { kind: "move", ap: 1, how: "advance" };                        // the Advance Action: up to your Speed
  const ev = s.match(/^evade\s+([12])$/i);                                                        // the Evade Action: 1 AP Evade 1, 2 AP Evade half your Speed
  if (ev) return { kind: "move", ap: Number(ev[1]), how: "evade", sq: ev[1] === "1" ? 1 : "half" };
  const m = s.match(/^(.+?)\s*(?:\((.+)\))?$/), opts = (m[2] ?? "").toLowerCase();
  return { kind: "action", name: m[1].trim().toLowerCase(), alt: opts.match(/else ([^,)]+)/)?.[1]?.trim() ?? null, reloadShot: /reload shot/.test(opts), keep: Number(opts.match(/keep (\d+)/)?.[1] ?? 0), boons: Number(opts.match(/\+(\d+) boon/)?.[1] ?? 0), banes: Number(opts.match(/\+(\d+) bane/)?.[1] ?? 0) };
}

/** The encounters file: "party Paladin, Paladin, Archer, Archer", "encounter 4 Standards: 4 standard", "runs 2000", "level 1". */
export function parseFights(text) {
  const f = { party: [], encounters: [], days: [], dayParties: [], dayRuns: 1000, runs: 2000, level: 1, defenses: [12, 13, 14] };
  const RATINGS = ["terrible", "low", "medium", "high", "extreme"];
  const npcOne = s => { const mm = s.trim().match(/^(\d+)\s+(\w+)((?:\s+[\w-]+)*)$/); if (!mm) throw new Error(`fights.txt: can't read "${s.trim()}" (write: 2 standard, 1 elite high, 2 standard ranged)`);
    const tags = mm[3].trim().toLowerCase().split(/\s+/).filter(Boolean), sp = tags.find(t => /^speed-\d+$/.test(t));
    const md = k => { const t = tags.find(x => x.startsWith(k + "-") && RATINGS.includes(x.slice(k.length + 1))); return t ? { [k]: t.slice(k.length + 1) } : {}; };   // wmod-high, pmod-low: a Modifier's rating
    return Array(Number(mm[1])).fill({ role: mm[2].toLowerCase().replace(/s$/, ""), rating: tags.find(t => RATINGS.includes(t)) ?? "medium", ranged: tags.includes("ranged"), power: tags.includes("power"), ...md("wmod"), ...md("pmod"), ...(sp ? { speed: Number(sp.slice(6)) } : {}) }); };
  const npcList = txt => txt.split(",").flatMap(npcOne);
  for (const raw of text.split(/\r?\n/)) {
    const line = clean(raw); if (!line) continue;
    const [head] = line.split(/\s+/), rest = line.slice(head.length).trim();
    if (head === "party") f.party = rest.split(",").map(s => s.trim()).filter(Boolean);
    else if (head === "runs") f.runs = Number(rest);
    else if (head === "day-runs") f.dayRuns = Number(rest);
    else if (head === "day") { const m = rest.match(/^(.+?):\s*(.+)$/); f.days.push({ name: m[1].trim(), fights: m[2].split("|").map(x => npcList(x)), text: m[2].split("|").map(x => x.trim()) }); }
    else if (head === "day-party") { const m = rest.match(/^(.+?):\s*(.+)$/); f.dayParties.push({ name: m[1].trim(), files: m[2].split(",").map(x => x.trim()) }); }
    else if (head === "level") f.level = Number(rest);
    else if (head === "defenses") f.defenses = rest.split(/[\s,]+/).map(Number);
    else if (head === "encounter") {
      const m = rest.match(/^(.+?):\s*(.+)$/);
      f.encounters.push({ name: m[1].trim(), npcs: npcList(m[2]) });
    } else if (head === "map") {   // the map model's settings (map.mjs MAP): map on | off · map start 8 · map back 3 · map cover 10% 2, 20% 1 · map npc-reactions elite, standard
      const [k, ...v] = rest.split(/\s+/), val = v.join(" ");
      if (k === "on" || k === "off") MP.MAP.on = k === "on";
      else if (k === "start" || k === "back" || k === "spacing") MP.MAP[k] = Number(val);
      else if (k === "cover") MP.MAP.cover = val.split(",").map(x => x.trim()).filter(Boolean).map(x => { const mm = x.match(/^(\d+)%\s+(\d)$/); if (!mm) throw new Error(`fights.txt: write map cover like: 10% 2, 20% 1`); return { p: Number(mm[1]) / 100, n: Number(mm[2]) }; }).sort((x, y) => y.n - x.n);
      else if (k === "npc-reactions") MP.MAP.npcReactions = val.split(/[\s,]+/).filter(Boolean).map(x => x.toLowerCase().replace(/s$/, "")).filter(x => x !== "none");
      else throw new Error(`fights.txt: unknown map setting "${k}"`);
      f.map = { ...MP.MAP };
    } else throw new Error(`fights.txt: unknown line "${line}"`);
  }
  return f;
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
  const hm = bHm(role, rating, level), hp = a => Math.max(0, Math.ceil((a + 2) * hm + r.hb - 1e-9));
  // The catch-up: an NPC's Modifiers are ratings of its role's table (the Bestiary, Attributes and Modifiers; the system's npcModRatings / npcModValue):
  // by default the lead one Medium and the other Low (a Standard's Medium too); a `power` NPC leads with Power. fights.txt: `wmod-high`, `pmod-low`.
  // `mod` is the Modifier of its Basic attack (Weapon; Power for a `power` NPC). Before: ceil(Body / 2 + 1), the same numbers at the defaults.
  const mr = DM.npcModRatings({ role, modLead: opts.power ? "power" : "weapon", ratings: { wmod: opts.wmod ?? "", pmod: opts.pmod ?? "" } });
  const weaponMod = DM.npcModValue(role, mr.weapon), powerMod = DM.npcModValue(role, mr.power), mod = opts.power ? powerMod : weaponMod;
  const kit = RULES.npcSpecials ? npcKit(role) : undefined;
  return { role, rating, name: r.label, pool: hp(body) + hp(mind), ad: Math.max(TW.defenseBase, r.defense), wd: Math.max(TW.defenseBase, r.defense), mod, weaponMod, powerMod, modRatings: mr, ...(kit ? { kit } : {}),
    save: { body, mind, instinct: attr("medium"), appeal: attr("medium") }, t2: bDmg(role in TW.npcRoles ? role : "standard", rating, level)[0], t3: bDmg(role in TW.npcRoles ? role : "standard", rating, level)[1],
    strikes: { minion: 1, grunt: 2, standard: 2, elite: 3 }[role] ?? 2, bodyPool: hp(body), mindPool: hp(mind),
    apMax: role === "minion" ? RULES.minionAp : RULES.npcAp, speed: opts.speed ?? 5, ranged: !!opts.ranged, power: !!opts.power };   // the map model: AP a turn (the Bestiary), Speed 5, a ranged Basic attack; power: Vs. WD, [R] (pack R-bestiary)
}
/** An NPC's attack damage on a tier: the Builder's dice for the average, the Modifier added (Tier 1 deals nothing). */
const DICE = [[0, 0, 0], [1, 1, 1], [1, 2, 2], [1, 4, 2.5], [1, 6, 3.5], [1, 8, 4.5], [1, 10, 5.5], [1, 12, 6.5], [2, 6, 7], [2, 8, 9], [2, 10, 11], [2, 12, 13], [3, 8, 13.5], [3, 10, 16.5], [3, 12, 19.5], [4, 10, 22], [4, 12, 26]];
const diceFor = avg => DICE.reduce((b, d) => (Math.abs(d[2] - avg) < Math.abs(b[2] - avg) ? d : b));
function npcDamage(R, npc, tier) {
  if (tier < 2) return 0;
  const avg = tier === 2 ? npc.t2 : npc.t3, d = diceFor(avg - npc.mod);
  let t = npc.mod;
  if (d[1] <= 2 && d[0] === 1) t += d[1]; else for (let k = 0; k < d[0]; k++) t += die(R, d[1]);
  if (npc.exact) t += avg - npc.mod - d[2];   // pack E3: the table's average exactly (the dice's mean moved by a flat amount), not the nearest dice
  return Math.max(0, t) * (npc.curMult ?? 1);   // pack R prep: a Special Action deals the Basic attack's damage × its multiplier
}

/* ------------------------------------------------------------------ one PC's turn */
const matches = (eff, a, traits, target, pc) => (!eff.name || a.name.toLowerCase().startsWith(eff.name)) && (eff.traits ?? []).every(t => traits.includes(t)) && (!eff.quarry || (target && target === pc.quarry))
  && (!eff.bloodied || (target && (target.bloodiedRound != null || target.strainedRound != null)))   // pack R-classes: "bloodied" = only against a Bloodied or Strained target (Finisher)
  && (!eff.strained || (target && target.strainedRound != null));   // "strained": only against a Strained target (Reckoning)
const group = name => name.toLowerCase().replace(/\s+\d+$/, "");   // "Smite 2" and "Smite 3" share their Frequency
const hasDamage = d => d.dice.length + d.w + d.flat + d.mod > 0;

/**
 * Run one turn. pc: { build, unloaded, spent, quarry, firstThisRound }; turn: { steps }; ctx: { R, escalation, target(): the enemy to hit,
 * others(n): other enemies (an area, a different target), heal(pc, n), defend(pc, n, who) }. Returns { damage, ap, strikes, problems }.
 */
export function runTurn(pc, turn, ctx) {
  const b = pc.build, R = ctx.R, st = { next: [...(ctx.startNext ?? [])], turnFx: [], atWill: {}, used: new Set() }, res = { damage: 0, mind: 0, ap: 0, strikes: 0, problems: [], missed: [], lostAP: 0, lastTier: 0 };
  // Escalation is a resource (the book, Escalation): an Active spends what it costs; a passive works while you have at least its number.
  pc.esc ??= ctx.escalation ?? 3;
  const passives = () => b.passives.filter(p => pc.esc >= p.escalation);
  pc.firstThisRound ??= new Set();
  // A Weapon Action takes Ranged or Melee from the weapon, and Shot when the weapon is Projectile (the book, Traits: Shot).
  const weaponGives = () => [...(b.weapon?.traits ?? []).filter(x => x === "ranged" || x === "melee"), ...((b.weapon?.traits ?? []).includes("projectile") ? ["shot"] : [])];
  const traitsOf = (a, extra = []) => [...new Set([...a.traits, ...extra, ...(a.traits.includes("weapon") ? weaponGives() : [])])];
  const apply = (e, target, a = null) => {
    if (["boon", "bane", "empowered", "favored", "extra"].includes(e.kind)) (e.scope === "turn" ? st.turnFx : e.scope === "encounter" ? (pc.encFx ??= []) : st.next).push(e);
    else if (e.kind === "heal") ctx.heal?.(pc, e.n, e.who);
    else if (e.kind === "mend") { const n = Math.round(a?.allies ?? 1); if (n > 1 && ctx.mendMany) ctx.mendMany(pc, () => rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who, n); else ctx.mend?.(pc, rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who); }   // `allies N`: the N most hurt (pack R-classes: Hallowed Dawn)
    else if (e.kind === "guard") ctx.guard?.(pc, rollDamage(R, e.dmg, { mod: a && a.vs !== "none" && a.vs !== "wd" ? b.weaponMod : b.powerMod }).total, e.who);   // [Mod] is the Action's Modifier (Smite 3's Guard: the Weapon Modifier)
    else if (e.kind === "surge" && target) target.surge = { dmg: e.dmg, by: pc };
    else if (e.kind === "banes") ctx.zone?.(pc, e, a, target);
    else if (e.kind === "healdice") ctx.zoneHeal?.(pc, e, a);
    else if (e.kind === "debuff") { if (pc.st) pc.st.debuffs[e.name] = (pc.st.debuffs[e.name] ?? 0) + 1; ctx.condition?.(pc, e, target); }
    else if (["push", "pull", "slide"].includes(e.kind)) ctx.condition?.(pc, e, target);   // Forced Movement (the map model)
    else if (e.kind === "cover") pc.ignoreCover = true;                                    // True Shot, Perfect Shot: the next Strike ignores Cover
    else if (e.kind === "defense") ctx.defend?.(pc, e.n, e.who, a);
    else if (e.kind === "evade") { /* moved before the roll */ }
    else if (e.kind === "taunt" && target) target.taunt = { by: pc, n: e.n };
    else if (e.kind === "vulnerable" && target) { if (e.n >= (target.vulnerable ?? 0)) target.vulnBy = pc; target.vulnerable = Math.max(target.vulnerable ?? 0, e.n); if (e.keep) target.vulnKeep = pc; if (pc.st) pc.st.debuffs[`Vulnerable ${e.n}`] = (pc.st.debuffs[`Vulnerable ${e.n}`] ?? 0) + 1; }
    else if (e.kind === "reload") pc.unloaded = false;
  };
  const doAction = (a, opts = {}, extraTraits = [], linked = false, forced = null) => {
    const traits = traitsOf(a, extraTraits);
    if (!linked) for (const e of a.effects) if (e.effect.kind === "evade" && e.min === 1) ctx.move?.(pc, { how: "evade", sq: e.effect.n, free: true });   // "Evade 1, then ...": before the roll (the map model)
    if (traits.includes("weapon") && pc.unloaded && !a.effects.some(e => e.effect.kind === "reload")) { res.missed.push(`${a.name}: the weapon is unloaded`); return; }   // a failed Reload roll: bad luck, not a rule problem
    if (a.does.length) {   // Linked Actions (1A): no AP, no Frequency, no Strike, no At-will Bane
      const each = { boons: a.each.filter(e => e.kind === "boon").reduce((s, e) => s + e.n, 0), empowered: a.each.filter(e => e.kind === "empowered").reduce((s, e) => s + e.n, 0), extra: a.each.filter(e => e.kind === "extra").map(e => e.dmg) };
      const first = ctx.target(), others = a.different ? (ctx.others(a.does.length - 1) ?? []) : [];
      // "Two creatures" with one enemy left: the Action can't be used (no valid target); the player would make Weapon Attacks instead (the same AP), so the repeat takes the At-will Bane.
      a.does.forEach((d, k) => { const repeat = k > 0 && a.different && !others[k - 1]; doAction(b.actions[d.toLowerCase()], { ...each, reloadShot: opts.reloadShot && k === a.does.length - 1, atWillBane: repeat }, a.gives ?? [], true, k === 0 || !a.different ? first : (others[k - 1] ?? first)); });
      for (const e of a.effects) apply(e.effect, first, a);
      return;
    }
    if (a.vs === "none") { for (const e of a.effects) apply(e.effect, ctx.target(), a); return; }
    const reloadShot = opts.reloadShot && traits.includes("weapon") && (b.weapon?.traits ?? []).includes("reload");
    if (opts.reloadShot && !reloadShot) res.problems.push(`${a.name}: a Reload Shot needs a Weapon Action with a Reload weapon`);
    let boons = opts.boons ?? 0, banes = opts.banes ?? 0, favored = reloadShot || !!a.favored, emp = (opts.empowered ?? 0) + (reloadShot ? 2 : 0), bonus = 0;
    const extra = [...(opts.extra ?? [])], anyTier = [], floors = [], firstHit = [], dc = a.vs.match(/^dc\s+(\d+)/)?.[1];
    const target = dc ? null : (forced ?? ctx.target());
    if (!dc && !target) return;
    for (const p of passives()) {
      if (!matches(p.effect, a, traits, target, pc)) continue;
      if (p.effect.kind === "boon") boons += p.effect.n;
      if (p.effect.kind === "empowered") emp += p.effect.n;
      if (p.effect.kind === "bonus") bonus += p.effect.n;
      if (p.effect.kind === "extra" && p.effect.scope === "first" && !pc.firstThisRound.has(p.name)) { extra.push(p.effect.dmg); pc.firstThisRound.add(p.name); }
      if (p.effect.kind === "extra" && p.effect.scope === "first-hit" && !pc.firstThisRound.has(p.name)) { extra.push(p.effect.dmg); firstHit.push(p.name); }   // used up only if this Action deals damage
      if (p.effect.kind === "extra" && p.effect.scope === "each") extra.push(p.effect.dmg);   // pack R-classes: on every matching Action (Reckoning: "each ... bloodied")
      if (p.effect.kind === "floor") floors.push(p.effect.dmg);
    }
    for (const x of [...st.turnFx, ...(pc.encFx ?? [])]) if (matches(x, a, traits, target, pc)) { if (x.kind === "empowered") emp += x.n; if (x.kind === "boon") boons += x.n; }
    st.next = st.next.filter(x => {
      if (!matches(x, a, traits, target, pc)) return true;
      if (x.kind === "boon") boons += x.n; else if (x.kind === "bane") banes += x.n; else if (x.kind === "empowered") emp += x.n; else if (x.kind === "favored") favored = true; else if (x.kind === "extra") (x.anyTier ? anyTier : extra).push(x.dmg);
      return false;
    });
    if (a.freq === "at-will" && !linked) { const k = group(a.name); banes += st.atWill[k] ?? 0; st.atWill[k] = (st.atWill[k] ?? 0) + 1; }
    if (opts.atWillBane) { const k = "weapon attack"; banes += st.atWill[k] ?? 0; st.atWill[k] = (st.atWill[k] ?? 0) + 1; }   // a Linked attack that had to repeat a target counts as a Weapon Attack (Double Shot with one enemy left)
    if (RULES.bloodiedBanes && (traits.includes("strike") || traits.includes("weapon")) && pc.damage != null && pc.build.bodyHealth && pc.damage >= pc.build.bodyHealth) banes++;   // the book's Bloodied rule
    const mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
    if (dc) {   // a roll against a DC (Reload): no target, no damage
      const tier = pick(R, C.tierProbs(mod, Number(dc), boons, banes, favored ? "favored" : ""));
      for (const e of a.effects) if (tier >= e.min && tier <= e.max) apply(e.effect, null);
      return;
    }
    const targets = [target, ...(a.area > 1 ? ctx.others(a.area - 1) : [])];
    let mainTier = 1, critShare = 0;
    for (const t of targets) {
      let tier;
      const mm = a.vs.startsWith("save") ? null : ctx.mods?.(a, traits, t);   // the map model: range, Engaged, Cover, Flanking, Prone
      if (mm?.skip) continue;
      const mb = mm?.boons ?? 0, mn = mm?.banes ?? 0;
      if (a.vs.startsWith("save")) {   // a Save Action: the target rolls against your DC (11 + Modifier); its Tier 1 is the worst for it
        const attr = a.vs.split(/\s+/)[1] ?? "instinct";
        tier = pick(R, C.tierProbs(t.save?.[attr] ?? 0, 11 + mod, 0, 0, ""));
      } else {
        // One random number for the roll with and without the target's Vulnerable: the difference is credited to whoever made it Vulnerable.
        const u = R(), def = a.vs === "wd" ? t.wd : t.ad, st = C.rollState(favored, !!mm?.doomed, "");   // the catch-up: High cover makes the roll Doomed (Favored and Doomed together: a normal roll)
        const pr = C.tierProbs(mod, def, boons + mb + (t.vulnerable ?? 0), banes + mn, st);
        tier = pickU(u, pr);
        if (t === target) critShare = pr[2] > 0 ? C.critProb(mod, def, boons + mb + (t.vulnerable ?? 0), banes + mn, st) / pr[2] : 0;   // the share of its Tier 3s that are Criticals (calc.mjs, exact)
        if (t.vulnerable && t.vulnBy?.st && a.tiers) {
          const without = pickU(u, C.tierProbs(mod, def, boons + mb, banes + mn, st)), av = k => avgDamage(a.tiers[k - 1], b.weapon, k, mod, emp, extra);
          t.vulnBy.st.vulnCredit += av(tier) - av(without);
        }
      }
      const dmg = a.tiers?.[tier - 1];
      const land = (v, mind) => { t.damage = (t.damage ?? 0) + v; t.mindDamage = (t.mindDamage ?? 0) + mind; res.mind += mind; };   // pack R prep: the Mind part is kept for Bloodied / Strained
      if (t === target && tier === 1) for (const x of floors) { const v = rollDamage(R, x, { mod }).total * b.dmgScale; land(v, v * mindShare(x, b.weapon, tier, mod)); res.damage += v; }   // a Tier 1 floor (Marked Quarry)
      if (t === target) for (const x of anyTier) { const v = rollDamage(R, x, { mod, empowered: emp }).total * b.dmgScale; land(v, v * mindShare(x, b.weapon, tier, mod)); res.damage += v; }   // on every Tier, whatever the Action deals
      if (dmg && (dmg.dice.length || dmg.flat || dmg.mod || (dmg.w && hasDamage(weaponTier(b.weapon, tier))))) {   // 1[W] of a weapon that deals 0 on this tier is no damage (and no extra)
        const kb = b.keepBest && b.keepBest.traits.every(x => traits.includes(x)) ? b.keepBest.n : 0;
        let total = rollDamage(R, dmg, { weapon: b.weapon, tier, mod, empowered: emp, keepBest: kb }).total, mindT = total * mindShare(dmg, b.weapon, tier, mod);
        for (const x of extra) { const v = rollDamage(R, x, { mod, empowered: emp }).total; total += v; mindT += v * mindShare(x, b.weapon, tier, mod); }
        total = (total + bonus) * b.dmgScale; mindT *= b.dmgScale;
        land(total, mindT); res.damage += total;
        if (total > 0) ctx.onDamage?.(pc, t, total);   // pack R-classes: Reactions to an ally's damage (Call the Shot)
        if (t === target) for (const nm of firstHit) pc.firstThisRound.add(nm);
        if (t.surge && t.surge.by !== pc) {   // Divine Surge: an ally's extra damage, credited to the Paladin who gave it (not in anyone's own damage)
          const x = rollDamage(R, t.surge.dmg, { mod }).total; land(x, x * mindShare(t.surge.dmg, b.weapon, tier, mod)); if (t.surge.by.st) t.surge.by.st.surgeCredit += x; t.surge = null;
        }
      }
      if (t === target) { mainTier = tier; res.critShare = critShare; if (RULES.escHooks && tier === 3 && !a.vs.startsWith("save") && R() < critShare) res.crit = true; }   // a Critical: Doubles on a Tier 3, 20 over the Defense, three of a kind on a Favored roll (before the catch-up: 1 Tier 3 in 12)
    }
    res.lastTier = mainTier;
    if (reloadShot) pc.unloaded = true;
    for (const e of a.effects) if (mainTier >= e.min && mainTier <= e.max) apply(e.effect, target, a);
    for (const t of a.then) doAction(b.actions[t.toLowerCase()], {}, [], true, target);
  };
  for (const s of turn.steps) {
    const step = stepOf(s);
    if (step.kind === "move") {
      if (ctx.apLimit != null && res.ap + step.ap > ctx.apLimit) { res.missed.push(`${s}: no AP left`); continue; }
      if (ctx.move?.(pc, step) !== false) res.ap += step.ap;   // the map model: a move it doesn't need is not made (the AP stay for Reactions)
      continue;
    }
    let a = b.actions[step.name];
    if (step.alt && a.escalation > pc.esc && !(b.overcastFloor && !pc.floorUsed)) a = b.actions[step.alt];   // "(else Weapon Attack)": when the Escalation isn't there
    if (ctx.apLimit != null && res.ap + a.ap > ctx.apLimit) {   // the map model: AP spent moving; a lower Version that fits, else a Weapon Attack, else nothing
      const alt = Object.values(b.actions).filter(x => group(x.name) === group(a.name) && x.ap < a.ap && res.ap + x.ap <= ctx.apLimit).sort((x, y) => y.ap - x.ap)[0]
        ?? (a.traits.includes("strike") && b.actions["weapon attack"] && res.ap + 1 <= ctx.apLimit && res.strikes < 3 ? b.actions["weapon attack"] : null);
      res.lostAP += a.ap - (alt?.ap ?? 0);
      if (!alt) { res.missed.push(`${a.name}: no AP left after moving`); continue; }
      a = alt;
    }
    // Overcast (pack LV): the round-1 floor pays up to its number once a fight; else a lower Version of the same Action that the Escalation left pays for.
    let floor = 0;
    if (a.escalation > pc.esc) {
      const fl = b.overcastFloor && !pc.floorUsed ? b.overcastFloor : 0;
      const low = Object.values(b.actions).filter(x => group(x.name) === group(a.name) && x.escalation <= pc.esc + fl && x.ap <= a.ap).sort((x, y) => y.escalation - x.escalation)[0];
      if (low) { a = low; if (a.escalation > pc.esc) { floor = a.escalation - pc.esc; pc.floorUsed = true; } }
    }
    const g = group(a.name);
    if (a.escalation - floor > pc.esc) { res.missed.push(`${a.name}: costs ${a.escalation} Escalation (you have ${pc.esc})`); continue; }   // not a rule problem: the plan tries it when it can
    if (RULES.escalation === "spent" && step.keep && pc.esc - a.escalation < step.keep) { res.missed.push(`${a.name}: kept ${step.keep} Escalation for a passive`); continue; }   // "(keep 2)": spend only what is above 2
    if (a.freq === "daily" && pc.dailyOK === false) { res.missed.push(`${a.name}: the Daily is kept for a hard fight`); continue; }
    if ((a.freq === "encounter" || a.freq === "daily") && pc.spent?.has(g)) { res.problems.push(`${a.name}: already used this ${a.freq === "encounter" ? "encounter" : "day"}`); continue; }
    if (a.freq === "round" || a.freq === "turn") { if (st.used.has(g)) res.problems.push(`${a.name}: once a ${a.freq}`); st.used.add(g); }
    if (a.freq === "encounter" || a.freq === "daily") { (pc.spent ??= new Set()).add(g); res.nova = true; }
    res.ap += a.ap;
    if (a.traits.includes("strike")) res.strikes++;
    if (RULES.escalation === "spent") pc.esc -= a.escalation - floor;   // pack R: as a level, an Active needs its Escalation and spends nothing
    doAction(a, step);
  }
  if (res.ap > RULES.ap) res.problems.push(`${res.ap} AP (${RULES.ap} a turn)`);
  if (res.strikes > 3) res.problems.push(`${res.strikes} Strikes (3 a turn)`);
  return res;
}

/* ------------------------------------------------------------------ the tables */
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : "-");
const pct = x => `${Math.round(x * 100)}%`;
const median = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/** Expected damage of a turn against one creature with this Defense (AD and WD the same): Monte Carlo, n runs. A turn that starts with a Reload starts unloaded. */
export function turnDamage(build, turnName, defense, { n = 20000, seed = 7, escalation = 3, bloodied = false, strained = false } = {}) {   // bloodied (pack R-classes): the target counts as Bloodied (Reckoning)
  const R = rng(seed), turn = build.turns[turnName], first = build.actions[stepOf(turn.steps[0]).name];
  const startsUnloaded = !!first?.effects.some(e => e.effect.kind === "reload");
  let sum = 0, last = null;
  for (let k = 0; k < n; k++) {
    const target = { ad: defense, wd: defense, save: { body: 2, mind: 1, instinct: 1, appeal: 1 }, bloodiedRound: bloodied ? 1 : null, strainedRound: strained ? 1 : null }, pc = { build, quarry: target, unloaded: startsUnloaded, esc: escalation };
    last = runTurn(pc, turn, { R, escalation, target: () => target, others: () => [] });
    sum += last.damage;
  }
  return { avg: sum / n, problems: last.problems, ap: last.ap, strikes: last.strikes };
}

/** The turn a PC takes: its "when unloaded" turn, its "when ally below" turn, else the plan's turn for the round (the last one repeats). */
export function turnFor(pc, round, allies = [], engagedNow = false) {
  const b = pc.build;
  if (pc.unloaded && b.unloadedTurn) return b.unloadedTurn;
  if (b.whenEsc && (pc.esc ?? 0) >= b.whenEsc.esc) { const t = b.turns[b.whenEsc.turn]; if (t.steps.map(stepOf).filter(x => x.kind === "action").every(x => { const a = b.actions[x.name], g = group(a.name); return !(a.freq === "encounter" || a.freq === "daily") || !pc.spent?.has(g); })) return b.whenEsc.turn; }   // pack R-classes: the Apex turn comes first (before the Engaged and ready turns)
  if (engagedNow && b.whenEngaged) return b.whenEngaged;   // the map model: it starts its turn next to an enemy
  if (b.whenReady && pc.readyAP) return b.whenReady;   // pack R-classes: the AP a "ready" Reaction gave it
  if (b.whenSelf && pc.rallyLeft > 0 && (pc.damage ?? 0) >= (1 - b.whenSelf.below) * b.pool) return b.whenSelf.turn;
  for (const w of b.when) if (allies.some(x => x !== pc && !x.down && x.damage >= (1 - w.below) * x.build.pool)) return w.turn;
  const entry = b.plan[Math.min(round - 1, b.plan.length - 1)];
  if (!entry) return Object.keys(b.turns)[0];
  const opts = entry.split("|").map(x => x.trim());   // "A | B": the first whose Encounter and Daily Actions are still unused (a Daily only where it may be used)
  const ready = k => b.turns[k].steps.map(stepOf).filter(x => x.kind === "action").every(x => { const a = b.actions[x.name], g = group(a.name);
    return !(a.freq === "encounter" || a.freq === "daily") || (!pc.spent?.has(g) && !(a.freq === "daily" && pc.dailyOK === false)); });
  return opts.find(ready) ?? opts.at(-1);
}

const npcAvg = (f, tier) => (tier < 2 ? 0 : tier === 2 ? f.t2 : f.t3);
/**
 * One NPC Strike against a PC. One random number decides the tier with and without the PC's Defense bonus (the difference, in average damage,
 * is credited to the bonus's giver), then damage reduction (Hallowed Stance) is applied and credited to the PC. Returns the damage taken.
 */
const npcStrike = (R, f, t, banes, escalation = 3, pcs = [], boons = 0, block = null, doomed = false) => {
  // Damage reduction: its own passive, or an adjacent ally's (Hallowed Stance: "you and your adjacent allies"; the sim makes N allies adjacent for the fight).
  let reduce = t.build.passives.filter(p => p.effect.kind === "reduce" && escalation >= p.escalation && (!t.stanceOff || p.effect.always)).reduce((s, p) => Math.max(s, p.effect.n), 0), reducer = null;   // "if you haven't left your square since your last turn"
  for (const g of pcs) if (g !== t && !g.down && g.adjacent?.includes(t)) for (const p of g.build.passives) if (p.effect.kind === "reduce" && p.effect.adjacent && (!g.stanceOff || p.effect.always) && (g.esc ?? 0) >= p.escalation && p.effect.n > reduce) { reduce = p.effect.n; reducer = g; }
  const zb = f.zone && f.zone.left > 0 ? f.zone.n : 0;   // Consecrated Ground: Banes on its Strikes while it stands in the area
  const def = (f.power ? t.build.wd : t.build.ad) + (t.defBonus ?? 0) + (t.passiveDef ?? 0);   // pack R-bestiary: a `power` NPC rolls against Ward Defense
  const fr = f.cond?.frightened ? 1 : 0, st = f.cond?.blinded || doomed ? "doomed" : "";   // pack R-classes: Frightened's Bane, Blinded's Doomed; the catch-up: High cover's Doomed
  const u = R(), tier = pickU(u, C.tierProbs(f.mod, def, boons, banes + zb + fr, st));
  if (t.defBonus && t.defBy?.st) t.defBy.st.defCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def - t.defBonus, boons, banes + zb, ""))) - npcAvg(f, tier);
  if (zb && f.zone.by?.st) f.zone.by.st.baneCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def, boons, banes, ""))) - npcAvg(f, tier);
  let d = npcDamage(R, f, tier);
  if (d > 0 && block?.half) { const b = Math.floor(d / 2); d -= b; block.by.st.blockCredit += b; }   // Covering Shot's Tier 3
  else if (d > 0 && block) { const roll = rollDamage(R, block.dmg, { mod: block.by.build.powerMod }).total, b = Math.min(d, roll); d -= b; block.by.st.blockCredit += b; block.used();
    if (block.spill && roll - b > (t.guard ?? 0)) { t.guard = roll - b; t.guardBy = block.by; } }   // pack R prep: the rest of the block becomes Guard on the target (Stacking: the higher value counts)   // pack R prep: a blocking Reaction (Shield of Faith) on a hit that lands
  const afterReduce = d > 0 ? Math.max(0, d - reduce) : 0;
  const absorbed = Math.min(t.guard ?? 0, afterReduce), apAbs = Math.min(t.apGuard ?? 0, afterReduce - absorbed), taken = afterReduce - absorbed - apAbs;   // Guard takes the damage first
  if (absorbed) { t.guard -= absorbed; if (t.guardBy?.st) t.guardBy.st.guardCredit += absorbed; }
  if (apAbs) { t.apGuard -= apAbs; if (t.st) t.st.apGuardUsed += apAbs; }   // pack R prep: the Guard of unspent AP (it adds to the other Guard)
  if (t.st) { t.st.incoming += d; t.st.reduced += d - afterReduce; t.st.taken += taken; }
  if (reducer?.st) reducer.st.reducedGiven += d - taken;
  return taken;
};

/**
 * The attacks an NPC makes with `ap` AP (pack R, RULES.npcSpecials; the same order as the map's turn): its Encounter Special once, its Round Special
 * once a round (twice at Elite Escalation 2), then Basic attacks with the At-will Bane; 3 Strikes at most. It moves f.encUsed / f.roundSpecialN / f.firstAtk.
 * Returns [{ k: At-will Banes, mult: the damage multiplier, boons: Elite Escalation 1's Boon on its first attack }].
 */
export function kitSeq(f, ap) {
  const out = []; let basics = 0;
  for (let s = 0; s < 3 && ap > 0; s++) {
    const enc = f.kit.enc && !f.encUsed && ap >= f.kit.enc.ap ? f.kit.enc : null, rnd = !enc && f.kit.round && (f.roundSpecialN ?? 0) < ((f.esc ?? 0) >= 2 ? 2 : 1) && ap >= f.kit.round.ap ? f.kit.round : null, sp = enc ?? rnd;
    const boons = (f.esc ?? 0) >= 1 && f.firstAtk ? 1 : 0; f.firstAtk = false;
    if (sp) { ap -= sp.ap; if (enc) f.encUsed = true; else f.roundSpecialN = (f.roundSpecialN ?? 0) + 1; out.push({ k: 0, mult: sp.mult * RULES.npcSpecials, boons }); }
    else { ap--; out.push({ k: basics++, mult: 1, boons }); }
  }
  return out;
}
/** An NPC's attacks in a turn where it doesn't move: its Bestiary Strikes (before pack R), or everything its AP buys (kitSeq). */
const npcSeq = f => (RULES.npcSpecials && f.kit ? kitSeq(f, f.apMax) : Array.from({ length: f.strikes }, (_, k) => ({ k, mult: 1, boons: 0 })));
/** An NPC's average damage a turn to this PC (the PC's AD; no damage reduction: Escalation 0). Before pack R: its Strikes with the At-will Banes. With the
 *  Specials (pack R): a turn in which it doesn't move, its Round Special and Basic attacks (no Encounter Special, no Elite Escalation). */
export function npcTurn(npc, build, n = 20000) {
  const R = rng(5), me = { build }; let sum = 0;
  for (let k = 0; k < n; k++) { const f = { ...npc, encUsed: true, roundSpecialN: 0, firstAtk: false }; for (const a of npcSeq(f)) { f.curMult = a.mult; sum += npcStrike(R, f, me, a.k, 0, [], a.boons); } }
  return sum / n;
}

/** A PC's state across a day: its damage, Rally Points, and what it did (st). */
export const pcState = b => ({ build: b, damage: 0, mindDamage: 0, down: false, rallyLeft: b.rallyPoints, defBonus: 0, defBy: null,
  st: { bleedDealt: 0, dealt: 0, mindTaken: 0, strainedTurns: 0, rounds: 0, novaDealt: 0, novaTurns: 0, incoming: 0, reduced: 0, reducedGiven: 0, taken: 0, defCredit: 0, vulnCredit: 0, surgeCredit: 0, guardCredit: 0, blockCredit: 0, apGuardGiven: 0, apGuardUsed: 0, apLeft: 0, hookCrit: 0, hookClass: 0, specials: 0, reactionDealt: 0, mindDealt: 0, bloodiedTurns: 0, escTurns: [0, 0, 0, 0], baneCredit: 0, healGiven: 0, mendGiven: 0, mercyGiven: 0, rpSelf: 0, rpByAlly: 0, rpBetween: 0, downs: 0, debuffs: {},
    shots: 0, engagedShots: 0, intoMelee: 0, covered: 0, coverBanes: 0, rangeBanes: 0, turnsEngaged: 0, stillTurns: 0, struck: 0, mapBanes: 0, swings: 0, flankBoons: 0, outOfReach: 0, moveAP: 0, lostAP: 0, charges: 0, reactions: 0, oaMade: 0, oaReal: 0, oaDealt: 0, oaDisrupt: 0, oaTaken: 0, oaTakenDmg: 0, carefulSteps: 0, condApplied: 0, forced: 0 } });
/** The most a PC heals more per Rally Point from a party member's passive (Font of Mercy; the best one, they don't stack), and who gives it. */
const rallyBonus = (pcs, t, inCombat = true) => { let n = 0, by = null; for (const g of pcs) if (!g.down || g === t) for (const p of g.build.passives) if (p.effect.kind === "rallybonus" && p.effect.n > n && (inCombat ? (g.esc ?? 0) : 0) >= p.escalation) { n = p.effect.n; by = g; } return { n, by }; };   // an Escalation passive works only in a fight (Escalation is 0 between fights)

/**
 * A fight: the party (builds, or PC states carried through a day) against NPCs. A PC already at its Health Pool starts Down and stays out.
 * opts: maxRounds; map (the map model's settings, map.mjs MAP; `map.on` false = the old fight with no positions); immortal (the NPCs never
 * die: econ.mjs measures a window of rounds with it); inject { round, fn(W) } (called at the start of that round: econ.mjs puts a condition on).
 * Returns { rounds, won, lost: share of the party's Health lost in this fight, downs, firstDown, wipe, downBy, pcs, W }.
 */
export function fight(party, npcs, R, { maxRounds = 12, map = MP.MAP, immortal = false, inject = null, streams = false } = {}) {
  const M = map?.on ? map : null;
  const pcs = party.map(p => (p.build ? p : pcState(p)));
  for (const p of pcs) { p.leftSquare = null; p.zoneHeal = null; p.guard = 0; p.guardBy = null; p.down = p.damage >= p.build.pool; p.defBonus = 0; p.defBy = null; p.spent = new Set([...(p.spent ?? [])].filter(g => p.build.actions[Object.keys(p.build.actions).find(k => group(k) === g)]?.freq === "daily")); p.quarry = null; p.unloaded = false; p.startDamage = p.damage; p.esc = p.startEsc ?? RULES.startEsc; p.floorUsed = false; p.elusiveRound = null; p.encFx = []; p.mindDamage = Math.min(p.mindDamage ?? 0, p.damage); p.bloodiedRound = p.damage - p.mindDamage >= p.build.bodyHealth ? 0 : null; p.strainedRound = p.mindDamage >= p.build.mindHealth ? 0 : null; p.keptAP = RULES.reactFromStart ? RULES.reactionAp : 0; p.blockedFor = null; p.apGuard = 0; p.turnKept = 0; p.hooked = {}; p.stanceOff = false; }
  const foes = npcs.map(n => ({ ...n, damage: 0, mindDamage: 0, dead: false, vulnerable: 0, surge: null, zone: null, bloodiedRound: null, strainedRound: null, deadRound: null, encUsed: false, roundSpecial: 0, roundSpecialN: 0, esc: 0, firstAtk: false, encBack: false, escTurns: [0, 0, 0, 0], ...(immortal ? { pool: 1e9, bodyPool: 1e9, mindPool: 1e9 } : {}) }));
  // Adjacent allies (Hallowed Stance): the N allies most often in front (highest "targeted"), fixed for the fight (the map model: the allies really adjacent).
  for (const p of pcs) { const k = Math.max(0, ...p.build.passives.filter(x => x.effect.kind === "reduce").map(x => x.effect.adjacent)); p.adjacent = pcs.filter(x => x !== p).sort((x, y) => y.build.targeted - x.build.targeted).slice(0, k); p.reduceAdj = k; }
  // The map model: positions, Speed, conditions, AP kept for Reactions.
  const W = M ? { pcs, foes, R, M } : null;
  if (M) {
    for (const p of pcs) { p.side = "pc"; p.cond = MP.noCond(); p.melee = !(p.build.weapon?.traits ?? []).includes("ranged"); p.range = p.build.weapon?.range ?? (p.melee ? [1] : M.npcRange); p.speed = p.build.speed ?? 5; }
    for (const f of foes) { f.side = "npc"; f.cond = MP.noCond(); f.melee = !f.ranged; f.range = f.ranged ? M.npcRange : [1]; f.speed ??= 5; f.apMax ??= RULES.npcAp; f.apDebt = 0; f.oa = RULES.oaAll ? f.melee && RULES.npcOa !== false : M.npcReactions.includes(f.role); /* the catch-up: every creature has the Opportunity Attack (a ranged NPC's is not modeled) */ f.reactAP = RULES.reactFromStart ? RULES.npcReactionAp : 0; }
    MP.place(pcs, foes, M);
  }
  const order = [...pcs.map(p => ({ pc: p })), ...foes.map(f => ({ npc: f }))];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }   // initiative
  // streams: each creature rolls its own dice (econ's paired runs: a change to one creature leaves the others' rolls as they were).
  if (streams) { const base = Math.floor(R() * 2 ** 31); [...pcs, ...foes].forEach((c, i) => { c.R = rng(base + i * 7919); }); } else for (const p of pcs) delete p.R;
  let round = 0, firstDown = 0, actionId = 0;
  const alive = () => foes.filter(f => !f.dead), up = () => pcs.filter(p => !p.down);
  const focus = (list = alive()) => list.sort((x, y) => (x.pool - x.damage) - (y.pool - y.damage))[0];   // the enemy closest to dying
  const mostHurt = list => list.sort((x, y) => y.damage / y.build.pool - x.damage / x.build.pool)[0];
  const useRally = (t, n, by) => {   // t uses n Rally Points (Steel Yourself, or an ally's Lay On Hands)
    for (let k = 0; k < n && t && t.rallyLeft > 0 && t.damage > 0; k++) {
      const rb = rallyBonus(pcs, t), h0 = Math.min(t.damage, t.build.rallyHeal), h = Math.min(t.damage, t.build.rallyHeal + rb.n);
      t.damage -= h; t.rallyLeft--; if (rb.by) rb.by.st.mercyGiven += h - h0;
      if (by === t) t.st.rpSelf++; else { t.st.rpByAlly++; by.st.healGiven += h0; }
    }
  };
  const mendOne = (t, amount, by) => { if (!t) return; const h = Math.min(t.damage, amount); t.damage -= h; by.st.mendGiven += h; };   // new Health
  /** Pack R prep: an Escalation hook (+1 Escalation, up to 3; each kind once an encounter). */
  const hook = (p, kind) => { if (!RULES.escHooks || p.down || p.hooked[kind] || (p.esc ?? 0) >= 3) return; p.hooked[kind] = true; p.esc++; if (kind === "crit") p.st.hookCrit++; else p.st.hookClass++; };   // used only when it raises the Escalation
  /** Pack R prep: a Reaction spends the Reaction AP first, then a turn AP kept (which loses its Guard). */
  const spendReact = p => { p.keptAP--; if (p.keptAP < p.turnKept) { p.turnKept--; if (RULES.guardAt !== "next") p.apGuard = Math.max(0, (p.apGuard ?? 0) - guardPerAp(p.build.level)); } };   // guardAt "next": the AP is one less when its next turn starts (no Guard from it)
  /** The catch-up: a PC's Reactions now (its file's, and the basic Opportunity Attack while every creature has it), and who an Opportunity Attack can hit:
   *  an adjacent enemy its weapon can target (the book since v0.0.335; a ranged weapon takes Engaged's 2 Banes); before pack R, the Talent: a creature it threatens. */
  const rxOf = p => (p.build.reactions ?? []).filter(rx => !rx.basic || (RULES.oaAll && !p.noOa));
  const oaCan = (p, c) => (RULES.oaAll ? MP.up(p) && MP.adj(p, c) : MP.threatens(p, c));
  /** The AP a PC needs to make this Opportunity Attack: 1; with oaPolicy "spare", the basic one leaves 1 AP for its class Reaction (a decision, not a rule). */
  const oaNeed = (p, rx) => (rx.basic && RULES.oaPolicy === "spare" && p.build.reactions.some(x => !x.basic) ? 2 : 1);
  /** Pack R-bestiary: an Elite's phases (+1 Escalation when it becomes Bloodied and when it becomes Strained) and its rung 3 (the Encounter Special comes back once). */
  const eliteRung = f => { if (f.esc >= 3 && !f.encBack) { f.encBack = true; f.encUsed = false; } };
  const phase = f => { if (RULES.eliteEsc && RULES.elitePhases && f.role === "elite" && !f.dead && f.esc > 0 && f.esc < 3) { f.esc++; eliteRung(f); } };
  const killCheck = () => { for (const f of foes) {
    if (!f.dead && f.damage >= f.pool) { f.dead = true; f.deadRound = round; for (const p of pcs) if (p.build.escHook === "quarry" && p.quarry === f) hook(p, "class"); }
    // Pack R prep: when an NPC becomes Bloodied (Body damage at its Body threshold) and Strained (Mind damage at its Mind threshold).
    if (!f.bloodiedRound && f.damage - (f.mindDamage ?? 0) >= f.bodyPool) { f.bloodiedRound = round; phase(f); }
    if (!f.strainedRound && (f.mindDamage ?? 0) >= f.mindPool) { f.strainedRound = round; phase(f); }
  } };
  /** One NPC Strike on a PC (taunt Banes, the map's Boons and Banes), and a Down. */
  const npcHit = (f, t, k, boons = 0, banes = 0, doomed = false) => {
    const taunted = f.taunt && !f.taunt.by.down && t !== f.taunt.by ? f.taunt.n : 0;   // Champion's Challenge: Banes against anyone else
    if (M) for (const p of pcs) if (p.reduceAdj) p.adjacent = pcs.filter(x => x !== p && !x.down && MP.adj(p, x));   // Hallowed Stance: the allies adjacent now
    t.st.struck++;
    const el = t.elusiveRound !== round ? t.build.passives.filter(p => p.effect.kind === "elusive" && (t.esc ?? 0) >= p.escalation).reduce((m, p) => Math.max(m, p.effect.n), 0) : 0;
    if (el) { t.elusiveRound = round; t.st.elusive = (t.st.elusive ?? 0) + 1; }   // the first Strike against it this round
    // Pack R prep: a PC with a blocking Reaction and a Reaction AP (or AP kept) takes damage off the hit (itself or an ally within 5 squares; once per NPC turn each: the Turn Frequency).
    let block = null;
    // Pack R-classes, part 4: Covering Shot (1R, Turn, Interrupt: a Strike would damage an ally within 10 squares): a Weapon Attack with 1 Boon on the attacker; on a Tier 3 the ally takes half the damage.
    for (const p of up()) { const rx = (p.build.reactions ?? []).find(x => x.kind === "cover"); if (!rx || p === t || (p.keptAP ?? 0) < 1 || p.cond?.staggered || p.coverFor === f.turnId || (M && MP.dist(p.pos, t.pos) > 10)) continue;
      p.coverFor = f.turnId; spendReact(p); const r = pcReact(p, f, rx.action, 1); if (r.tier === 3 && !f.dead) block = { half: true, by: p, used: () => {} }; break; }
    for (const p of up()) { if (block) break; const rx = (p.build.reactions ?? []).find(x => x.kind === "block"); if (!rx || (p.keptAP ?? 0) < 1 || p.cond?.staggered || p.blockedFor === f.turnId) continue; if (M && p !== t && MP.dist(p.pos, t.pos) > 5) continue;
      if (rx.ally && p === t) continue; if (rx.round && p.blockedRound === round) continue;   // pack R-classes: `ally` (never on itself: Bulwark of Faith), `round` (once a round: the Round Frequency)
      block = { dmg: rx.dmg, spill: rx.spill, by: p, used: () => { spendReact(p); p.blockedFor = f.turnId; p.blockedRound = round; p.st.reactions++; } }; break; }
    const bb = RULES.bloodiedBanes && f.bloodiedRound != null ? 1 : 0;   // the book's Bloodied rule on the NPC's Strikes
    const taken = npcStrike(f.R ?? R, f, t, k + taunted + banes + el + bb, t.esc, pcs, boons, block, doomed);   // At-will Banes on the 2nd and 3rd Strike
    t.damage += taken; f.dealt = (f.dealt ?? 0) + taken;   // an NPC's Basic attack is Vigor damage (a weapon)...
    if (f.power) { t.mindDamage = (t.mindDamage ?? 0) + taken; t.st.mindTaken += taken; }   // ...unless it is a `power` NPC: [R] (pack R-bestiary)
    // Pack R prep: an "overwatch" Reaction (a Trigger: an enemy within 10 squares makes a Strike; once per NPC turn), after the Strike.
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "overwatch" && p.keptAP >= 1 && !p.cond?.staggered && p.owFor !== f.turnId && !f.dead && (!M || MP.dist(p.pos, f.pos) <= 10)) { p.owFor = f.turnId; spendReact(p); p.st.oaMade++; pcReact(p, f, rx.action); }
    // Pack R-classes, part 3: Rebuke (1R, Round, Trigger: an enemy within your Reach makes a Strike against an ally): an Appeal Save against 11 + [PMod]; Tier 1 [R] 1d8 Ho, Pushed 2, Frightened (EoT); Tier 2 [R] 1d6 Ho, Pushed 1.
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "rebuke" && p !== t && p.keptAP >= 1 && !p.cond?.staggered && (rx.turn ? p.rebukeFor !== f.turnId : p.rebukeRound !== round) && !f.dead && (!M || (rx.range ? MP.dist(p.pos, f.pos) <= rx.range : MP.adj(p, f)))) {   // `rebuke 5`: within 5 squares instead of your Reach
      p.rebukeRound = round; p.rebukeFor = f.turnId; spendReact(p); p.st.reactions++;
      const tier = pick(p.R ?? R, C.tierProbs(f.save?.appeal ?? 1, 11 + p.build.powerMod, 0, 0, ""));
      if (tier <= 2) { const v = rollDamage(p.R ?? R, parseDamage(tier === 1 ? "1d8" : "1d6")).total; f.damage += v; f.mindDamage = (f.mindDamage ?? 0) + v; p.st.dealt += v; p.st.reactionDealt += v; p.st.mindDealt += v;
        if (M) MP.force("push", p, f, tier === 1 ? 2 : 1, W); if (tier === 1) { MP.applyCondition(f, "Frightened (EoT)", p); p.st.condApplied++; } killCheck(); }
    }
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "ready" && p.keptAP >= 1 && !p.cond?.staggered && p.readyRound !== round && (!M || MP.dist(p.pos, f.pos) <= 10)) { p.readyRound = round; spendReact(p); p.st.reactions++; p.readyAP = 1; }   // pack R-classes: Ready Shot (1R, Round): +1 AP on its next turn
    const wasB = !!t.bloodiedRound, wasD = t.down;
    if (t.damage - (t.mindDamage ?? 0) >= t.build.bodyHealth && !t.bloodiedRound) t.bloodiedRound = round;   // Bloodied: Vigor damage at the Vigor threshold
    if ((t.mindDamage ?? 0) >= t.build.mindHealth && !t.strainedRound) t.strainedRound = round;   // Strained: Resolve damage at the Resolve threshold (pack R-bestiary)
    if (t.damage >= t.build.pool && !t.down) { t.down = true; t.st.downs++; if (!firstDown) firstDown = round; }
    if ((!wasB && t.bloodiedRound) || (!wasD && t.down)) for (const p of up()) if (p !== t && p.build.escHook === "ally" && (!M || MP.dist(p.pos, t.pos) <= 5)) hook(p, "class");   // pack R prep: the Paladin's hook
  };
  /** A PC's turn context (the targets, heals, buffs, areas; and with the map model, its movement, Boons and Banes, conditions). */
  const ctxFor = (pc, extra = {}) => ({
    R: pc.R ?? R, escalation: pc.esc,
    target: () => {
      if (!M) return pc.quarry && !pc.quarry.dead && pc.build.passives.some(p => p.effect.quarry) ? pc.quarry : focus();
      if (pc.melee) return focus(alive().filter(f => MP.adj(pc, f))) ?? null;   // a melee PC hits what is next to it
      const inRange = alive().filter(f => Number.isFinite(MP.rangeBanes(pc.range, MP.dist(pc.pos, f.pos))));
      return pc.quarry && !pc.quarry.dead && inRange.includes(pc.quarry) && pc.build.passives.some(p => p.effect.quarry) ? pc.quarry : focus(inRange) ?? null;
    },
    others: n => alive().filter(f => f !== pc.quarry && f !== focus()).concat(alive().filter(f => f !== pc.quarry)).filter((f, i, a) => a.indexOf(f) === i).slice(0, n),
    heal: (who, n, kind) => useRally(kind === "self" ? who : mostHurt(up().filter(x => x.damage >= 0.75 * x.build.rallyHeal && x.rallyLeft > 0)), n, who),   // an ally's Rally Point only when it heals at least 3/4 of its value
    defend: (who, n, kind, a) => { const near = [who, ...up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 99));
      const list = kind === "allies" ? near : kind === "self" ? [who] : [mostHurt(up().filter(x => x !== who)) ?? who]; for (const t of list) if (n >= t.defBonus) { t.defBonus = n; t.defBy = who; } },
    // Pack R-classes: "callshot" (Call the Shot, 1R Round, Trigger: an ally deals damage to your Marked Quarry: it is Vulnerable 1 until the end of your next turn; here until its own turn ends).
    onDamage: (who, t, total) => { for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "callshot" && p !== who && p.keptAP >= 1 && !p.cond?.staggered && p.quarry === t && !t.dead && p.calledRound !== round) { p.calledRound = round; spendReact(p); p.st.reactions++; if (1 >= (t.vulnerable ?? 0)) t.vulnBy = p; t.vulnerable = Math.max(t.vulnerable ?? 0, 1); t.vulnKeep = p; } },
    mendMany: (who, roll, kind, n) => { for (const t of up().filter(x => x.damage > 0 && (kind === "any" || x !== who)).sort((x, y) => y.damage - x.damage).slice(0, n)) mendOne(t, roll(), who); },
    mend: (who, amount, kind) => mendOne(kind === "self" ? who : kind === "any" ? mostHurt(up().filter(x => x.damage > 0)) : mostHurt(up().filter(x => x !== who && x.damage > 0)), amount, who),
    guard: (who, amount, kind) => { const t = kind === "self" ? who : kind === "any" ? mostHurt(up()) : mostHurt(up().filter(x => x !== who)) ?? who; if (t && amount > (t.guard ?? 0)) { t.guard = amount; t.guardBy = who; } },
    zone: (who, e, a, target) => { for (const f of [target, ...alive().filter(x => x !== target)].filter(Boolean).slice(0, Math.round(a?.area ?? 1))) f.zone = { n: e.n, left: a?.rounds ?? 1, by: who }; },
    zoneHeal: (who, e, a) => { for (const t of [who, ...up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 1))) t.zoneHeal = { dmg: e.dmg, left: a?.rounds ?? 1, by: who }; },
    ...(M ? {
      mods: (a, traits, t) => {
        if (!t?.pos) return null;
        const kind = traits.includes("ranged") ? "ranged" : traits.includes("melee") ? "melee" : null;
        if (!kind) return null;
        const ign = !!pc.ignoreCover && traits.includes("strike"); if (ign) pc.ignoreCover = false;
        const pas = pc.build.passives.filter(p => pc.esc >= p.escalation);
        const m = MP.mapMods(pc, t, kind, W, { ignoreCover: ign, noEngagedBanes: pas.some(p => p.effect.kind === "steady-nerves"), noIntoMelee: pas.some(p => p.effect.kind === "clear-shot"), longDraw: pas.some(p => p.effect.kind === "long-draw"), range: pc.range });
        if (!m) { pc.st.outOfReach++; return { skip: true }; }
        if (kind === "ranged") { pc.st.shots++; pc.st.engagedShots += m.engagedBanes ? 1 : 0; pc.st.intoMelee += m.intoMelee; pc.st.covered += m.coverBanes ? 1 : 0; pc.st.coverBanes += m.coverBanes; pc.st.rangeBanes += m.rangeBanes; pc.st.mapBanes += m.banes; }
        else { pc.st.swings++; pc.st.flankBoons += m.boons; }
        return m;
      },
      move: (p, step) => pcMove(p, step),
      condition: (who, e, t) => {
        if (!t?.cond) return;
        if (e.kind === "debuff") { if (MP.applyCondition(t, e.name, who)) who.st.condApplied++; }
        else { const n = MP.force(e.kind, who, t, e.n, W); who.st.forced += n; }
      },
    } : {}),
    ...extra,
  });
  /** A PC's Reaction: a Weapon Attack against f (Opportunity Attack, Quick Draw). Returns { crit }. */
  const pcReact = (p, f, action = "Weapon Attack", boons = 0, oa = false) => {
    const r = runTurn(p, { name: "Reaction", steps: [action] }, ctxFor(p, { target: () => f, startNext: boons ? [{ kind: "boon", n: boons, scope: "next", traits: [] }] : [] }));
    p.st.dealt += r.damage; p.st.reactionDealt += r.damage; p.st.reactions++; if (oa) { p.st.oaReal++; p.st.oaDealt += r.damage; } killCheck();
    if (r.crit) hook(p, "crit");
    return { crit: r.crit || (r.lastTier === 3 && (p.R ?? R)() < (r.critShare ?? 1 / 12)), tier: r.lastTier };   // a Critical (the share of its Tier 3s: calc.mjs)
  };
  /** An NPC uses the Stand Action: the PCs' Opportunity Attacks (the Talent's other trigger). */
  const standReact = f => { const id = ++actionId; for (const p of up()) for (const rx of rxOf(p)) if (rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx) && !p.cond?.staggered && !f.dead && oaCan(p, f) && p.reacted !== id) { p.reacted = id; spendReact(p); p.st.oaMade++; pcReact(p, f, rx.action, 0, true); } };
  /** An NPC leaves a square during an Advance: the PCs' Interrupts (Opportunity Attack: it leaves your reach; Quick Draw: it moves closer). */
  const npcLeave = id => (c, np) => {
    for (const p of up()) for (const rx of rxOf(p)) {
      if (p.keptAP < 1 || c.dead || p.cond?.staggered) continue;
      if (rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx) && oaCan(p, c) && p.reacted !== id) { p.reacted = id; spendReact(p); p.st.oaMade++; if (pcReact(p, c, rx.action, 0, true).crit && !c.dead && RULES.oaDisrupt) { p.st.oaDisrupt++; return false; } }
      else if (rx.kind === "quick-draw" && p.qdReacted !== id && MP.dist(c.pos, p.pos) <= (rx.range ?? 5) && MP.dist(np, p.pos) < MP.dist(c.pos, p.pos)) { p.qdReacted = id; spendReact(p); p.st.oaMade++; pcReact(p, c, rx.action); }   // once per triggering Action (the Advance)
    }
    return !c.dead;
  };
  /** A PC leaves a square during an Advance: the NPCs' Opportunity Attacks (1 AP of their next turn). */
  const pcLeave = id => (c, np) => {
    for (const f of alive()) if (f.oa && !f.cond?.staggered && MP.threatens(f, c) && f.reacted !== id) {
      if (RULES.npcReactionAp > 0 && f.reactAP <= 0) continue;   // the catch-up: with a Reaction AP (pack R) an NPC that spent it can't react (it keeps no turn AP); before pack R it paid with its next turn's AP
      f.reacted = id; if (f.reactAP > 0) f.reactAP--; else f.apDebt++; c.st.oaTaken++;
      const m = MP.mapMods(f, c, "melee", W), t0 = c.st.taken; npcHit(f, c, 0, m?.boons ?? 0, m?.banes ?? 0, !!m?.doomed); c.st.oaTakenDmg += c.st.taken - t0;
      if (c.down) return false;
    }
    return true;
  };
  /** A PC's movement step ("advance", "evade 1", "evade 2", "move N", an Action's "Evade N"): melee PCs close in, ranged PCs get away. Returns false when it doesn't move. */
  const pcMove = (p, step) => {
    if (!M) return true;
    const foesUp = alive();
    if (!foesUp.length) return false;
    const evade = step.how === "evade";
    if (evade && (p.cond.prone || p.cond.immob)) return false;
    let sq = evade ? (step.sq === "half" ? Math.floor(p.speed / 2) : step.sq) : p.speed;
    sq = Math.min(sq, MP.speedOf(p));
    if (sq <= 0) return false;
    if (p.melee) {
      if (foesUp.some(f => MP.adj(p, f))) return false;   // already Engaged: it stays
      const t = foesUp.sort((x, y) => MP.dist(p.pos, x.pos) - MP.dist(p.pos, y.pos))[0];
      const n = MP.walk(p, MP.toward(t), sq, W, evade ? null : pcLeave(++actionId));
      if (n) { p.leftSquare = round; p.stanceOff = true; }
      if (n && !step.free) p.st.moveAP += step.ap ?? 0;
      return n > 0 || step.free ? undefined : false;
    }
    if (!step.free && step.how === "move" && !MP.engaged(p, W)) return false;   // a ranged PC moves only to get away
    // Next to an enemy with an Opportunity Attack, an Advance away would provoke it: the same AP buys an Evade 1 (the Evade Action), which breaks off from it.
    const careful = !evade && foesUp.some(f => f.oa && !f.cond?.staggered && (RULES.npcReactionAp > 0 ? f.reactAP > 0 : true) && MP.threatens(f, p));
    if (careful) { sq = Math.min(1, sq); p.st.carefulSteps++; }
    // Away from the enemies (up to one NPC Advance + 1 from the nearest), but within the weapon's normal range of its target.
    const tg = p.quarry && !p.quarry.dead ? p.quarry : foesUp.sort((x, y) => MP.dist(p.pos, x.pos) - MP.dist(p.pos, y.pos))[0];
    const cap = Math.max(...foesUp.map(f => f.speed)) + 1, away = MP.awayFrom(foesUp, cap);
    const n = MP.walk(p, q => away(q) + 3 * Math.max(0, MP.dist(q, tg.pos) - p.range[0]), sq, W, evade || careful ? null : pcLeave(++actionId));
    if (n) { p.leftSquare = round; p.stanceOff = true; }
    if (n && !step.free) p.st.moveAP += step.ap ?? 0;
    if (p.cond.hindered === "move") p.cond.hindered = null;
    return n > 0 || step.free ? undefined : false;
  };
  /** A melee PC closes in before its turn's Actions: a Charge (2 AP: Advance + a Weapon Attack with 1 Boon) when it can, else Advances. Returns { ap, startNext }. */
  const approach = (pc, turn) => {
    const out = { ap: 0, startNext: [] };
    if (!pc.melee || alive().some(f => MP.adj(pc, f))) return out;
    const t = alive().sort((x, y) => MP.dist(pc.pos, x.pos) - MP.dist(pc.pos, y.pos))[0];
    if (!t) return out;
    if (pc.cond.immob === "escape") { pc.cond.immob = null; out.ap++; }   // 1 AP [Move] to end it (Immobilized)
    const gap = MP.dist(pc.pos, t.pos) - 1, sp = MP.speedOf(pc);
    if (sp <= 0) return out;
    const hasWA = turn.steps.some(x => /^weapon attack/i.test(x));
    if (!pc.cond.hindered && gap >= 3 && gap <= sp && hasWA) {   // Charge: the Advance part costs 1 AP here, its Weapon Attack is the turn's first one, with 1 Boon
      if (MP.walk(pc, MP.toward(t), sp, W, pcLeave(++actionId))) { pc.leftSquare = round; pc.stanceOff = true; } out.ap++; pc.st.charges++;
      out.startNext.push({ kind: "boon", n: 1, scope: "next", name: "weapon attack", quarry: false, traits: [] });
    } else {
      while (!alive().some(f => MP.adj(pc, f)) && out.ap < RULES.ap && !pc.down) {
        out.ap++; const n = MP.walk(pc, MP.toward(t), MP.speedOf(pc), W, pcLeave(++actionId)); if (n) { pc.leftSquare = round; pc.stanceOff = true; }
        if (pc.cond.hindered === "move") pc.cond.hindered = null;
        if (!n) break;
      }
    }
    pc.st.moveAP += out.ap;
    return out;
  };
  /** An NPC's turn on the map: it stands up, ends Immobilized when it must move, chooses a PC it can reach (the most Strikes after moving), moves and strikes. */
  const npcTurnMap = f => {
    f.escTurns[Math.min(3, f.esc ?? 0)]++;   // pack R-bestiary: an Elite's turns by Escalation level
    let ap = f.apMax - (f.cond.slowed || 0) - f.apDebt - (f.cond.dazed || 0); f.cond.slowed = 0; f.apDebt = 0; f.cond.dazed = 0;   // Dazed: AP it lost (pack R-classes)
    const cost = (f.apMax - 1) / f.strikes;   // its Strikes are its Bestiary damage a turn with 1 AP left for moving
    if (f.cond.prone) { ap--; f.cond.prone = false; standReact(f); if (f.dead) return; }   // Stand (1 AP [Move]): an Opportunity Attack's trigger too
    const targets = up(); if (!targets.length) return;
    const reachAP = t => {
      const gap = f.melee ? (MP.cheb(f.pos, t.pos) <= 1 ? 0 : MP.dist(f.pos, t.pos) - 1) : Math.max(0, MP.dist(f.pos, t.pos) - f.range[0]);
      const stepAway = !f.melee && MP.engaged(f, W) ? 1 : 0;
      if (!gap) return stepAway;
      if (f.cond.immob === "eot") return Infinity;
      const esc = f.cond.immob === "escape" ? 1 : 0, half = Math.floor(f.speed / 2), first = f.cond.hindered ? half : f.speed, rest = f.cond.hindered === "eot" ? half : f.speed;
      if (first <= 0) return Infinity;
      return esc + (gap <= first ? 1 : 1 + Math.ceil((gap - first) / Math.max(1, rest)));
    };
    const oaNear = up().some(p => rxOf(p).some(rx => rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx)) && oaCan(p, f));
    const w = targets.map(t => { let s2 = Math.min(f.strikes, Math.max(0, ap - reachAP(t)) / cost); if (f.melee && oaNear && !MP.adj(f, t)) s2 *= 0.6; return s2 * s2 * (1 + 0.5 * t.damage / t.build.pool); });
    const sum = w.reduce((a, x) => a + x, 0);
    let t;
    if (sum > 0) { let x = (f.R ?? R)() * sum; t = targets.find((p, k) => (x -= w[k]) < 0) ?? targets[0]; }
    else t = targets.sort((x, y) => MP.dist(f.pos, x.pos) - MP.dist(f.pos, y.pos))[0];
    const there = () => (f.melee ? MP.adj(f, t) : MP.dist(f.pos, t.pos) <= f.range[0] && !MP.engaged(f, W));
    while (!there() && ap > 0 && !f.dead) {
      if (f.cond.immob === "eot") break;
      if (f.cond.immob === "escape") { ap--; f.cond.immob = null; continue; }
      const sp = MP.speedOf(f); if (sp <= 0) break;
      ap--;
      const n = MP.walk(f, f.melee ? MP.toward(t) : (MP.engaged(f, W) ? MP.awayFrom(up(), 3) : (p => Math.max(0, MP.dist(p, t.pos) - f.range[0]))), sp, W, npcLeave(++actionId));
      if (f.cond.hindered === "move") f.cond.hindered = null;
      if (!n) break;
      if (!f.melee) break;   // a ranged NPC moves once
    }
    if (!f.dead && RULES.npcSpecials && f.kit) {   // pack R prep: every AP left goes to attacks: the Encounter Special (once), the Round Special (once a round), Basic attacks (At-will Banes); 3 Strikes
      let basics = 0;
      for (let s = 0; s < 3 && ap > 0; s++) {
        const enc = f.kit.enc && !f.encUsed && ap >= f.kit.enc.ap ? f.kit.enc : null, rnd = !enc && f.kit.round && f.roundSpecialN < (f.esc >= 2 ? 2 : 1) && ap >= f.kit.round.ap ? f.kit.round : null, sp = enc ?? rnd;   // Elite Escalation 2: the Round Special twice a round
        if (t.down || (f.melee && !MP.adj(f, t))) t = f.melee ? up().find(p => MP.adj(f, p)) : up().find(p => Number.isFinite(MP.rangeBanes(f.range, MP.dist(f.pos, p.pos))));
        if (!t) break;
        const m = MP.mapMods(f, t, f.melee ? "melee" : "ranged", W); if (!m) break;
        const eb = f.esc >= 1 && f.firstAtk ? 1 : 0; f.firstAtk = false;   // Elite Escalation 1: its first attack each round has 1 Boon
        if (sp) { ap -= sp.ap; if (enc) f.encUsed = true; else { f.roundSpecial = round; f.roundSpecialN++; } f.curMult = sp.mult * RULES.npcSpecials; npcHit(f, t, 0, m.boons + eb, m.banes, m.doomed); f.curMult = 1; }
        else { ap--; npcHit(f, t, basics++, m.boons + eb, m.banes, m.doomed); }
      }
    } else if (!f.dead) {
      const x = Math.min(f.strikes, Math.max(0, ap) / cost);
      const n = Math.floor(x + 1e-9) + (x % 1 > 1e-9 && (f.R ?? R)() < x % 1 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        if (t.down || (f.melee && !MP.adj(f, t))) t = f.melee ? up().find(p => MP.adj(f, p)) : up().find(p => Number.isFinite(MP.rangeBanes(f.range, MP.dist(f.pos, p.pos))));
        if (!t) break;
        const m = MP.mapMods(f, t, f.melee ? "melee" : "ranged", W); if (!m) break;
        npcHit(f, t, k, m.boons, m.banes, m.doomed);
      }
    }
    if (f.cond.hindered) f.cond.hindered = null;   // EoT, and Lock & Loose's "for 1 round"
    if (f.cond.immob === "eot") f.cond.immob = null;
  };
  while (alive().length && up().length && round < maxRounds) {
    round++;
    for (const p of pcs) { p.firstThisRound = new Set(); if (round > 1 && !p.down) p.esc = Math.min(3, p.esc + 1); }   // +1 Escalation at the start of every round after the first
    for (const f of foes) { f.roundSpecialN = 0; f.firstAtk = true; if (RULES.eliteEsc && f.role === "elite" && !f.dead) { f.esc = round === 1 ? 1 : Math.min(3, f.esc + 1); eliteRung(f); } }   // pack R-bestiary: Elite Escalation (+1 a round from round 2)
    if (inject && round === inject.round) inject.fn({ pcs, foes, R, M, round });
    for (const o of order) {
      if (!alive().length || !up().length) break;
      if (o.pc) {
        const pc = o.pc; if (pc.down) continue;
        // The unused AP's Guard (Chapter 2, Unspent AP; the book since v0.0.274): when the turn starts, each AP still unused gives Guard for 1 round (what is left of the last one ends).
        // guardAt "end" (pack R prep's model): the Guard was given when the turn ended and ends here.
        { const g = guardPerAp(pc.build.level); if (g && RULES.guardAt === "next") { pc.apGuard = (pc.turnKept ?? 0) * g; pc.st.apGuardGiven += pc.apGuard; } else pc.apGuard = 0; pc.turnKept = 0; }
        pc.stanceOff = false;   // Hallowed Stance: a new turn; moving during it turns the Stance off until the next
        pc.st.rounds++; pc.st.escTurns[Math.min(3, pc.esc)]++; if (pc.damage - (pc.mindDamage ?? 0) >= pc.build.bodyHealth) pc.st.bloodiedTurns++; if ((pc.mindDamage ?? 0) >= pc.build.mindHealth) pc.st.strainedTurns++;   // pack R prep: turns by Escalation level, turns while Bloodied
        for (const x of pcs) if (x.defBy === pc) { x.defBonus = 0; x.defBy = null; }   // a Defense bonus lasts 1 round: until its giver's next turn
        for (const f of foes) { if (f.surge?.by === pc) f.surge = null; if (f.zone?.by === pc) f.zone.left--; if (f.vulnKeep === pc) { f.vulnKeep = null; f.vulnerable = 0; } }   // Divine Surge lasts until your next turn; an area counts its rounds down on its maker's turn
        for (const x of pcs) if (x.zoneHeal?.by === pc) x.zoneHeal.left--;
        if (pc.zoneHeal?.left > 0 && pc.damage > 0) mendOne(pc, rollDamage(pc.R ?? R, pc.zoneHeal.dmg).total, pc.zoneHeal.by);   // healing at the start of its turn (Consecrated Ground)
        if (!pc.quarry || pc.quarry.dead) pc.quarry = focus();   // Marked Quarry: the first target; a new one when it dies
        // Pack R-classes: start-of-turn Passives: `mend` heals the most hurt of you and your allies (Mending Light), `surge` marks the focus target (Divine Surge as a Passive).
        for (const p of pc.build.passives.filter(x => pc.esc >= x.escalation)) {
          if (p.effect.kind === "mend") { const t = p.effect.who === "self" ? pc : mostHurt(up().filter(x => (p.effect.who === "any" || x !== pc) && x.damage > 0)); if (t) mendOne(t, rollDamage(pc.R ?? R, p.effect.dmg, { mod: pc.build.powerMod }).total, pc); }
          if (p.effect.kind === "surge") { const t = focus(); if (t) t.surge = { dmg: p.effect.dmg, by: pc }; }
        }
        let extra = {};
        if (M) {
          let limit = RULES.ap - (pc.cond.slowed || 0) - (pc.cond.dazed || 0) + (pc.readyAP ?? 0); pc.cond.dazed = 0;   // pack R-classes: Ready Shot's AP (turnFor reads it, then it is spent)   // pack R: Slowed lowers the turn's AP, not the Reaction AP (the default to confirm)
          if (pc.cond.prone) { limit--; pc.cond.prone = false; }   // Stand (1 AP)
          const eng = MP.engaged(pc, W); if (eng) pc.st.turnsEngaged++;
          if (pc.leftSquare == null || pc.leftSquare < round - 1) pc.st.stillTurns++;   // it hasn't left its square since the start of its last turn (Patient Hunter)
          const turn = pc.build.turns[turnFor(pc, round, pcs, eng)];
          pc.readyAP = 0;
          const ap = approach(pc, turn);
          extra = { apLimit: Math.max(0, limit - ap.ap), startNext: ap.startNext, turnKey: turn };
        }
        const turn = extra.turnKey ?? pc.build.turns[turnFor(pc, round, pcs)];
        const r = runTurn(pc, turn, ctxFor(pc, extra));
        const left = Math.max(0, (extra.apLimit ?? RULES.ap) - r.ap);
        pc.keptAP = RULES.reactionAp + left;   // pack R: the Reaction AP on top of what the turn left
        { const g = guardPerAp(pc.build.level);
          if (g && RULES.guardAt === "next") { pc.st.apLeft += left; pc.turnKept = left; }   // kept until its next turn starts: they can pay a Reaction, and what is left then becomes Guard
          else if (g) { pc.apGuard = left * g; pc.st.apGuardGiven += pc.apGuard; pc.st.apLeft += left; pc.turnKept = RULES.apGuardKeep ? left : 0; if (!RULES.apGuardKeep) pc.keptAP = RULES.reactionAp; } }   // pack R prep: unspent AP become Guard at once
        if (r.crit) hook(pc, "crit");
        if (M) { pc.st.lostAP += r.lostAP; pc.reacted = null; if (pc.cond.hindered) pc.cond.hindered = null; if (pc.cond.immob === "eot") pc.cond.immob = null; pc.cond.staggered = null; pc.cond.blinded = null; pc.cond.frightened = null;
          if (pc.cond.bleed) { const v = rollDamage(pc.R ?? R, parseDamage(pc.cond.bleed.dmg)).total; pc.damage += v; pc.st.taken += v; } }   // a PC's Bleed at the end of its turn (pack R-classes)
        pc.st.dealt += r.damage; pc.st.mindDealt += r.mind;
        if (r.nova) { pc.st.novaDealt += r.damage; pc.st.novaTurns++; }
        killCheck();
      } else {
        const f = o.npc; if (f.dead) continue;
        f.turnId = `${round}:${foes.indexOf(f)}`; f.reactAP = RULES.npcReactionAp;
        if (M) npcTurnMap(f);
        else for (const a of npcSeq(f)) {   // no positions: its Bestiary Strikes, or (pack R) everything its AP buys
          const targets = up(); if (!targets.length) break;
          const w = targets.map(p => p.build.targeted), sum = w.reduce((a2, x) => a2 + x, 0); let x = R() * sum;
          const t = targets.find((p, k) => (x -= w[k]) < 0) ?? targets[0];
          f.curMult = a.mult; npcHit(f, t, a.k, a.boons); f.curMult = 1;
        }
        f.taunt = null; if (!f.vulnKeep) f.vulnerable = 0;   // EoT effects end with its turn (a kept Vulnerable ends at its giver's next turn: pack R-classes)
        if (f.cond?.bleed) { const v = rollDamage(f.R ?? R, parseDamage(f.cond.bleed.dmg)).total; f.damage += v; if (f.cond.bleed.mind) f.mindDamage = (f.mindDamage ?? 0) + v; if (f.cond.bleed.by?.st) { f.cond.bleed.by.st.bleedDealt += v; f.cond.bleed.by.st.dealt += v; } killCheck(); }   // Bleed at the end of its turn (pack R-classes)
        if (f.cond) { f.cond.staggered = null; f.cond.blinded = null; f.cond.frightened = null; }
        if (f.zone && f.zone.left <= 0) f.zone = null;
      }
    }
  }
  const health = pcs.reduce((s, p) => s + p.build.pool, 0), lost = pcs.reduce((s, p) => s + Math.max(0, Math.min(p.damage, p.build.pool) - p.startDamage), 0);
  return { rounds: round, won: !alive().length, lost: lost / health, downs: pcs.filter(p => p.down).length, firstDown, wipe: !up().length, downBy: pcs.map(p => p.down), pcs, W };
}

/**
 * Between two fights (minutes, not a Rest): a PC that is Down is brought back (it uses a Rally Point through an ally's Lay On Hands when an
 * ally has it, or heals what one Rally Point heals after an hour Unconscious); then every PC uses Rally Points (Steel Yourself, no AP limit
 * out of combat) while its damage is at least 3/4 of what one heals. Rally Points come back only with a Rest.
 */
export function between(pcs) {
  const healer = pcs.some(p => p.damage < p.build.pool && Object.values(p.build.actions).some(a => a.effects.some(e => e.effect.kind === "heal" && e.effect.who !== "self")));
  const use = p => { const rb = rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false), h0 = Math.min(p.damage, p.build.rallyHeal), h = Math.min(p.damage, p.build.rallyHeal + rb.n);
    p.damage -= h; p.rallyLeft--; p.st.rpBetween++; if (rb.by) pcs.find(x => x.build === rb.by.build && x.st === rb.by.st).st.mercyGiven += h - h0; };
  for (const p of pcs) {
    if (p.damage >= p.build.pool) {
      if (healer && p.rallyLeft > 0) use(p);
      else p.damage -= Math.min(p.damage, p.build.rallyHeal);
    }
    while (p.rallyLeft > 0 && p.damage >= 0.75 * (p.build.rallyHeal + rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false).n)) use(p);
  }
}

/**
 * A day: the party (builds) through its fights, in order, with no Rest. Momentum (Lucas, 2026-10-29): +1 after each fight harder than easy
 * (more than CV 3/4 per PC); with Momentum a PC starts a fight with half its level in Escalation (rounded up), up to 2; a Rest resets it.
 * Returns { fights: [fight results], pcs, cleared }.
 */
/** An NPC role's CV a PC (pack E3: the Bestiary writes CV ×100, by Stage gap; the same Stage here). */
export const roleCv = role => { const c = TW.npcRoles[role]?.cv; return Array.isArray(c) ? c[0] / 100 : (c ?? 1); };
export const MOMENTUM = { on: true, minCvPerPc: 0.75, startEsc: lv => (RULES.escalation === "level" ? TW.escalation.momentum : Math.min(2, Math.ceil(lv / 2))) };   // the book (Chapter 2, Momentum): Escalation 2 instead of 1; before pack R: half the level, up to 2
export function day(party, encounters, R, { momentum = MOMENTUM.on, map = MP.MAP } = {}) {
  const pcs = party.map(pcState), out = [];
  let mom = 0;
  const cvOf = e => e.reduce((s, n) => s + (n.cv ?? roleCv(n.role)), 0) / pcs.length;
  for (const [i, e] of encounters.entries()) {
    if (!pcs.some(p => p.damage < p.build.pool)) break;
    for (const p of pcs) { p.startEsc = momentum && mom > 0 ? MOMENTUM.startEsc(p.build.level) : RULES.startEsc; p.dailyOK = cvOf(e) >= 1.25 || i === encounters.length - 1; }   // a Daily is kept for a hard fight (or the last one)
    out.push(fight(pcs, e, R, { map }));
    out.at(-1).momentum = mom; out.at(-1).startEsc = pcs[0].startEsc;
    if (!out.at(-1).won) break;
    const hard = e.reduce((s, n) => s + (n.cv ?? roleCv(n.role)), 0) / pcs.length > MOMENTUM.minCvPerPc;
    if (RULES.escalation === "level") mom = hard ? 1 : 0; else if (hard) mom++;   // the book: the next encounter uses Momentum up (an easy fight gives none); before pack R the ruler kept it for the day
    between(pcs);
  }
  return { fights: out, pcs, cleared: out.length === encounters.length && out.every(f => f.won) };
}

/* ------------------------------------------------------------------ the Reactions in the 4 + 1 AP economy (the catch-up, 2026-11-12) */
/**
 * What each Reaction and the unused AP's Guard do in the party fights: the first encounter of fights.txt (the normal fight) and its hardest one, each
 * variant with the same seed and each creature rolling its own dice (streams), so a change to one piece leaves the other rolls alone.
 */
function reactionsSection(party, fights, lv) {
  const L = [], keep = { ...RULES }, n = fights.runs;
  const cvOf = e => e.npcs.reduce((s2, x) => s2 + roleCv(x.role), 0), hardest = [...fights.encounters].sort((x, y) => cvOf(y) - cvOf(x))[0];
  const encs = [...new Set([fights.encounters[0], hardest])];
  const noBasic = b => ({ ...b, reactions: b.reactions.filter(r => !r.basic) }), onlyBasic = b => ({ ...b, reactions: b.reactions.filter(r => r.basic) }), none = b => ({ ...b, reactions: [] });
  const VARIANTS = [
    ["The rules as they are", {}, x => x],
    ["The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP)", { oaPolicy: "first" }, x => x],
    ["No Opportunity Attack for the PCs", {}, noBasic],
    ["No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1)", { npcOa: false }, x => x],
    ["No class Reaction (the PCs keep the Opportunity Attack)", {}, onlyBasic],
    ["No Reactions for the PCs", {}, none],
    ["No Reaction AP for the PCs (a Reaction needs an AP kept from the turn)", { reactionAp: 0 }, x => x],
    ["A Reaction AP from the first moment of the encounter (before the first turn too)", { reactFromStart: true }, x => x],
    ["No Guard from unused AP", { apGuard: 0 }, x => x],
  ];
  L.push("## Reactions in the 4 + 1 AP economy", "",
    `Each row is the same ${n} fights (the same seed, every creature rolling its own dice) with one piece changed or taken away. "The rules as they are" keeps a PC's Reaction AP for its class Reaction (an Opportunity Attack only with an AP to spare). **Per PC, a fight:** the Reactions it used, the Opportunity Attacks among them and their damage, the Opportunity Attacks it took and their damage, the turn AP it left unspent and the Guard they gave / the Guard that stopped damage. The class Reactions: ${[...new Set(party.flatMap(b => b.reactions.filter(r => !r.basic).map(r => `${r.name} (${b.name})`)))].join(", ") || "none"}.`, "");
  for (const e of encs) {
    const npcsOf = () => e.npcs.map(x => npcOf(x.role, x.rating, lv, x));
    L.push(`**${e.name}** (CV ${cvOf(e)})`, "", "| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
    for (const [name, rules, edit] of VARIANTS) {
      Object.assign(RULES, keep, rules);
      const R = rng(53), res = [], pcsB = party.map(edit), npcs = npcsOf();
      for (let k = 0; k < n; k++) res.push(fight(pcsB, npcs, R, { streams: true }));
      const per = key => mean(res.map(r => mean(r.pcs.map(p => p.st[key] ?? 0))));
      L.push(`| ${name} | ${fmt(mean(res.map(r => r.rounds)))} | ${pct(mean(res.map(r => (r.won ? 1 : 0))))} | ${pct(mean(res.map(r => r.lost)))} | ${pct(mean(res.map(r => (r.downs ? 1 : 0))))} | ${fmt(mean(res.map(r => r.pcs.reduce((s2, p) => s2 + p.st.taken, 0))))} | ${fmt(per("reactions"), 2)} | ${fmt(per("oaReal"), 2)} · ${fmt(per("oaDealt"))} | ${fmt(per("oaTaken"), 2)} · ${fmt(per("oaTakenDmg"))} | ${fmt(per("apLeft"), 2)} · ${fmt(per("apGuardGiven"))} · ${fmt(per("apGuardUsed"))} |`);
    }
    Object.assign(RULES, keep);
    // Per build, the rules as they are.
    const R = rng(53), res = [], npcs = npcsOf(); for (let k = 0; k < n; k++) res.push(fight(party, npcs, R, { streams: true }));
    L.push("", `| Per PC, a fight (the rules as they are) | ${party.map(b => b.name).join(" | ")} |`, `|---|${party.map(() => "---:").join("|")}|`);
    const row = (label, fn, dg = 2) => L.push(`| ${label} | ${party.map((b, i) => fmt(mean(res.map(r => fn(r.pcs[i].st))), dg)).join(" | ")} |`);
    row("Turns", st => st.rounds, 1);
    row("Reactions used", st => st.reactions);
    row("... Opportunity Attacks", st => st.oaReal);
    row("Damage its Reactions dealt", st => st.reactionDealt, 1);
    row("... its Opportunity Attacks", st => st.oaDealt, 1);
    row("Damage its Reactions blocked", st => st.blockCredit, 1);
    row("Opportunity Attacks it took", st => st.oaTaken);
    row("... their damage", st => st.oaTakenDmg, 1);
    row("Turn AP left unspent", st => st.apLeft);
    row("Guard from them: given", st => st.apGuardGiven, 1);
    row("... used", st => st.apGuardUsed, 1);
    row("Its Reactions' damage as a share of its damage (%)", st => (st.dealt ? (100 * st.reactionDealt) / st.dealt : 0), 0);
    L.push("");
  }
  return L;
}

/* ------------------------------------------------------------------ the report */
export function report({ builds, fights }) {
  const L = [];
  const lv = fights.level;
  const LEVEL = RULES.escalation === "level", src = fights.source ?? { dir: "classes", fights: "fights.txt", cmd: "node book/ruler/spec.mjs" };
  L.push(`# The ruler: class builds and fights (level ${lv})`, "", `Written by \`${src.cmd}\` from \`book/ruler/${src.dir}/*.txt\` and \`book/ruler/${src.fights}\`. Don't edit this file: edit those and run the script again.`, "",
    LEVEL ? `**The rules: the book today (pack R; the ruler's default since the catch-up of 2026-11-12).** ${RULES.ap} AP + ${RULES.reactionAp} Reaction AP (NPCs ${RULES.npcAp} + ${RULES.npcReactionAp}, Minions ${RULES.minionAp}); Escalation is a level from ${RULES.startEsc} (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard ${TW.guardPerAp.join(" / ")} (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); every creature has the Opportunity Attack Reaction (an adjacent enemy that leaves a square with a Move Action or stands up); NPCs use their Specials (Round: ${TW.npcSpecial.filter(x => x.key !== "basic").map(x => `${x.label.replace("Special, ", "")} × ${x.x}`).join(", ")} for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs).`
      : `**The rules: the book before pack R** (\`--pre-r\`: ${RULES.ap} AP, no Reaction AP, Escalation spent, the pre-R Bestiary, Opportunity Attack as a Talent), with today's dice and map rules (flat Boons and Banes, the new Favored, the Field limit, Flanking up to 2). The builds are the classes as they were before pack R-classes: this report is kept for the pre-R studies (prices.md, positions.json, bestiary.md, progression.md, rework.md).`, "");
  for (const b of builds) {
    L.push(`## ${b.name} (${b.role || "no role"}), \`${b.file}\``, "");
    L.push(`Health ${b.pool} (Body ${b.bodyHealth} + Mind ${b.mindHealth}) · AD ${b.ad} · WD ${b.wd} · Weapon Modifier +${b.weaponMod} · Power Modifier +${b.powerMod} · Rally Points ${b.rallyPoints} (each heals ${b.rallyHeal}) · targeted ×${b.targeted}`, "");
    L.push(`**Damage a turn** (Monte Carlo, 20,000 turns each; measured ${LEVEL ? `at the Escalation the turn needs ("Esc": ${RULES.startEsc}, or its Action's Escalation; the Passives of that level and below work)` : `with the Escalation the turn spends ("Esc"; its passives see what is left after spending)`}, and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]} among the valid turns):`, "");
    L.push(`| Turn | Esc | ${fights.defenses.map(d => `Def ${d}`).join(" | ")} | Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]}, Esc 3 | AP | Strikes | Steps | Problems |`, `|---|---:|${fights.defenses.map(() => "---:").join("|")}|---:|---:|---:|---|---|`);
    const mid = Math.floor(fights.defenses.length / 2);
    const rows = Object.entries(b.turns).map(([k, t]) => {
      const acts = t.steps.map(stepOf).filter(x => x.kind === "action").map(x => b.actions[x.name].escalation);
      const esc = LEVEL ? Math.max(RULES.startEsc, ...acts) : Math.min(3, acts.reduce((s2, x) => s2 + x, 0));   // the Escalation the turn needs (a level), or spends (before pack R)
      return { k, t, esc, r: fights.defenses.map(d => turnDamage(b, k, d, { escalation: esc })), e3: turnDamage(b, k, fights.defenses[mid], { escalation: 3 }) };
    });
    const ok = rows.filter(x => !x.r[mid].problems.length && !(b.unloadedTurn === x.k));
    const best = ok.reduce((m, x) => (!m || x.r[mid].avg > m.r[mid].avg ? x : m), null);
    for (const { k, t, r } of rows) {
      const tags = [b.plan.includes(k) ? "plan" : "", b.unloadedTurn === k ? "when unloaded" : "", b.when.some(w => w.turn === k) ? "when an ally is hurt" : "", best?.k === k ? "**best**" : ""].filter(Boolean);
      L.push(`| ${t.name}${tags.length ? ` (${tags.join(", ")})` : ""} | ${rows.find(x => x.k === k).esc} | ${r.map(x => fmt(x.avg)).join(" | ")} | ${fmt(rows.find(x => x.k === k).e3.avg)} | ${r[0].ap} | ${r[0].strikes} | ${t.steps.join(", ")} | ${r[0].problems.join("; ") || ""} |`);
    }
    L.push("", `Plan: ${b.plan.map((p, i) => `round ${i + 1}${i === b.plan.length - 1 ? "+" : ""}: ${p.split("|").map(x => b.turns[x.trim()].name).join(" (once used: ")}${p.includes("|") ? ")" : ""}`).join(" · ")}${b.when.map(w => ` · when an ally is below ${pct(w.below)} Health: ${b.turns[w.turn].name}`).join("")}${b.whenSelf ? ` · when itself below ${pct(b.whenSelf.below)} Health: ${b.turns[b.whenSelf.turn].name}` : ""}${b.unloadedTurn ? ` · when unloaded: ${b.turns[b.unloadedTurn].name}` : ""}`, "");
    // Duels: the build alone against one NPC of each role (Medium), and that NPC alone against the build.
    L.push(`**Duels** (one of each, Medium NPCs; rounds counted with this build's plan${RULES.npcSpecials ? "; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard" : ""}):`, "", "| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |", "|---|---:|---:|---:|---:|---:|---:|");
    for (const role of ["minion", "grunt", "standard", "elite"]) {
      const npc = npcOf(role, "medium", lv), R = rng(11), kill = [], down = [];
      for (let k = 0; k < 2000; k++) {
        const f = { ...npc, damage: 0 }, pc = { build: b, quarry: f }; let r = 0;
        pc.esc = RULES.startEsc;
        while (f.damage < f.pool && r < 30) { r++; if (r > 1) pc.esc = Math.min(3, pc.esc + 1); pc.firstThisRound = new Set(); runTurn(pc, b.turns[turnFor(pc, r)], { R, escalation: pc.esc, target: () => f, others: () => [] }); f.vulnerable = 0; }
        kill.push(r);
        const me = { build: b }; let dmg = 0, rr = 0;
        const g = { ...npc, encUsed: false, firstAtk: false };
        while (dmg < b.pool && rr < 60) { rr++; g.roundSpecialN = 0; for (const a of npcSeq(g)) { g.curMult = a.mult; dmg += npcStrike(R, g, me, a.k, Math.min(3, RULES.startEsc + rr - 1), [], a.boons); } }
        down.push(rr);
      }
      const cap = (a, max) => (median(a) >= max ? `${max}+ / -` : `${median(a)} / ${fmt(mean(a))}`);
      L.push(`| ${npc.name} | ${npc.pool} | ${npc.ad} | ${npc.mod} | ${fmt(npcTurn(npc, b))} | ${cap(kill, 30)} | ${cap(down, 60)} |`);
    }
    L.push("");
  }
  // Party fights.
  const fileOf = b => b.file.replace(/^[\w-]+\//, "").replace(/\.txt$/, "");
  const party = fights.party.map(n => builds.find(b => fileOf(b) === n) ?? builds.find(b => b.name.toLowerCase() === n.toLowerCase() && b.level === lv) ?? (() => { throw new Error(`fights.txt: the party names "${n}", and no class file has that name, or that class at level ${lv}`); })());
  L.push(`## Party fights (${party.map(b => b.name).join(", ")}; ${fights.runs} runs each)`, "");
  L.push(LEVEL ? "The Bestiary's target for a normal fight (CV 100 a PC: 4 Standards against 4 PCs): about **3.5 rounds**, about **a fifth of the party's Health** with the Rally Points it spends, a PC Down in about **1 fight of 5** (pack R-bestiary: rbestiary.md)." : "The book's target for a typical fight before pack R (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.", "");
  L.push(`| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | ${party.map(b => `${b.name} Down`).join(" | ")} | no positions: rounds / Health lost |`, `|---|---:|---:|---:|---:|---:|---:|${party.map(() => "---:").join("|")}|---:|`);
  for (const e of fights.encounters) {
    const R = rng(29), npcs = e.npcs.map(n => npcOf(n.role, n.rating, lv, n)), res = [];
    for (let k = 0; k < fights.runs; k++) res.push(fight(party, npcs, R));
    const rounds = res.map(r => r.rounds), sorted = [...rounds].sort((x, y) => x - y), firsts = res.filter(r => r.firstDown).map(r => r.firstDown);
    const cv = e.npcs.reduce((s, n) => s + (roleCv(n.role)), 0);
    const R0 = rng(29), flat = []; for (let k = 0; k < fights.runs; k++) flat.push(fight(party, npcs, R0, { map: { ...MP.MAP, on: false } }));
    L.push(`| ${e.name} | ${cv} | ${median(rounds)} / ${fmt(mean(rounds))} / ${sorted[Math.floor(sorted.length * 0.9)]} | ${pct(mean(res.map(r => (r.won ? 1 : 0))))} | ${pct(mean(res.map(r => r.lost)))} | ${pct(mean(res.map(r => (r.downs ? 1 : 0))))} | ${firsts.length ? median(firsts) : "-"} | ${party.map((b, i) => pct(mean(res.map(r => (r.downBy[i] ? 1 : 0))))).join(" | ")} | ${fmt(mean(flat.map(r => r.rounds)))} / ${pct(mean(flat.map(r => r.lost)))} |`);
  }
  L.push("", `How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its \`when\` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); ${RULES.npcSpecials ? "each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane" : "each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd)"}, choosing a PC at random weighted by \`targeted\` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; \`map on\` in fights.txt):** the melee PCs start on a line, the ranged PCs ${MP.MAP.back} squares behind and to the sides, the NPCs ${MP.MAP.start} squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its \`when engaged\` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving ${RULES.npcSpecials ? "(each Advance is an AP its attacks don't get)" : "(its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike)"}, stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover ${MP.MAP.cover.map(c => `${Math.round(c.p * 100)}% ${c.n === 1 ? "Low" : c.n === 2 ? "Medium" : "High"}`).join(", ")}); Flanking for both sides (Field Boons: the cancels, then 2 at most); ${RULES.oaAll ? `every creature's Opportunity Attack (1R: its Reaction AP, or an AP kept from its turn; ${RULES.oaPolicy === "spare" ? "a PC with a class Reaction keeps its Reaction AP for it and makes an Opportunity Attack only with an AP to spare: the better choice, see the Reactions section" : "a PC reacts to the first trigger"}; a ranged PC's is a shot with Engaged's 2 Banes; ranged NPCs make none)` : `Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: ${MP.MAP.npcReactions.join(", ") || "none"})`}; Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (\`map off\`) every PC reaches every NPC at once and NPCs choose a PC weighted by \`targeted\`. ${LEVEL ? `Escalation is ${RULES.startEsc} in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).` : "Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off)."}`, "");
  if (RULES.oaAll && MP.MAP.on && fights.encounters.length) L.push(...reactionsSection(party, fights, lv));
  // Adventuring days: the fights between two Rests, one after another.
  if (fights.days.length && fights.dayParties.length) {
    const byFile = n => builds.find(b => fileOf(b) === n) ?? (() => { throw new Error(`${src.fights}: day-party names "${n}", which is not a file in ${src.dir}/`); })();
    L.push(`## Adventuring days (${fights.dayRuns} days each)`, "",
      "The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.", "",
      "Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.", "");
    for (const d of fights.days) {
      const cv = d.fights.map(f => f.reduce((s, n) => s + (roleCv(n.role)), 0));
      L.push(`### ${d.name}`, "", d.text.map((t, i) => `Fight ${i + 1}: ${t} (CV ${cv[i]})`).join(" · "), "");
      for (const dp of fights.dayParties) {
        const party = dp.files.map(byFile), R = rng(41), days = [], encs = d.fights.map(f => f.map(n => npcOf(n.role, n.rating, party[0].level, n)));   // the NPCs of the party's level
        for (let k = 0; k < fights.dayRuns; k++) days.push(day(party, encs, R));
        const pool = party.reduce((s, b) => s + b.pool, 0), rp = party.reduce((s, b) => s + b.rallyPoints, 0);
        L.push(`**${dp.name}** (${dp.files.join(", ")}; NPCs of level ${party[0].level}): the day cleared ${pct(mean(days.map(x => (x.cleared ? 1 : 0))))} · a PC Down during the day ${pct(mean(days.map(x => (x.pcs.some(p => p.st.downs) ? 1 : 0))))} · Downs a day ${fmt(mean(days.map(x => x.pcs.reduce((s, p) => s + p.st.downs, 0))), 2)} · Rally Points left at the end ${pct(mean(days.map(x => x.pcs.reduce((s, p) => s + p.rallyLeft, 0) / rp)))} · Health at the end ${pct(mean(days.map(x => 1 - x.pcs.reduce((s, p) => s + Math.min(p.damage, p.build.pool), 0) / pool)))}`, "");
        L.push("| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |", "|---|---:|---:|---:|---:|");
        d.fights.forEach((f, i) => { const r = days.map(x => x.fights[i]).filter(Boolean); L.push(`| ${i + 1}: ${d.text[i]} | ${pct(mean(r.map(x => (x.won ? 1 : 0))))} | ${fmt(mean(r.map(x => x.rounds)))} | ${pct(mean(r.map(x => x.lost)))} | ${pct(mean(r.map(x => (x.firstDown ? 1 : 0))))} |`); });
        L.push("");
        // One row per build (the PCs of the same file averaged), each number for one PC over the whole day.
        const files = [...new Set(dp.files)];
        L.push(`| Per PC, over the day | ${files.map(f => `${byFile(f).name} \`${f}\``).join(" | ")} |`, `|---|${files.map(() => "---:").join("|")}|`);
        const col = (fn, dg = 1) => files.map(f => { const idx = dp.files.map((x, i) => (x === f ? i : -1)).filter(i => i >= 0), v = days.flatMap(x => idx.map(i => fn(x.pcs[i], x)));
          if (typeof v[0] === "string") { const parts = v.map(x => x.split(" / ").map(Number)); return parts[0].map((_, j) => fmt(mean(parts.map(p => p[j])), dg)).join(" / "); }
          return fmt(mean(v), dg); });
        const row = (label, fn, dg) => L.push(`| ${label} | ${col(fn, dg).join(" | ")} |`);
        const partyDealt = x => x.pcs.reduce((s, p) => s + p.st.dealt, 0) || 1;
        row("Damage dealt", p => p.st.dealt);
        row("Damage a turn (its own turns)", p => p.st.dealt / Math.max(1, p.st.rounds));
        row("Damage a turn without its Nova turns (no Encounter or Daily Action)", p => (p.st.dealt - p.st.novaDealt) / Math.max(1, p.st.rounds - p.st.novaTurns));
        row("Damage a Nova turn (with an Encounter or Daily Action)", p => (p.st.novaTurns ? p.st.novaDealt / p.st.novaTurns : NaN));
        row("Share of the party's damage (%)", (p, x) => (100 * p.st.dealt) / partyDealt(x), 0);
        row("Turns taken", p => p.st.rounds);
        row("Health Pool", p => p.build.pool, 0);
        row("Damage aimed at it (before reduction)", p => p.st.incoming);
        row("Reduced (Hallowed Stance, its own or an adjacent ally's)", p => p.st.reduced);
        row("Reduced for adjacent allies (its Hallowed Stance)", p => p.st.reducedGiven);
        row("Damage taken", p => p.st.taken);
        row("Damage taken a round of combat", (p, x) => p.st.taken / Math.max(1, x.fights.reduce((s, f) => s + f.rounds, 0)));
        row("Times Down", p => p.st.downs, 2);
        row(`Rally Points (of ${files.map(f => byFile(f).rallyPoints).join(" / ")}): used in combat (Steel Yourself)`, p => p.st.rpSelf, 2);
        row("Rally Points used through an ally's Lay On Hands", p => p.st.rpByAlly, 2);
        row("Rally Points used between fights", p => p.st.rpBetween, 2);
        row("Rally Points left", p => p.rallyLeft, 2);
        row("**Buffs:** healed allies (Lay On Hands)", p => p.st.healGiven);
        row("Defense given (damage it stopped)", p => p.st.defCredit);
        row("Vulnerable given (extra damage dealt by the party)", p => p.st.vulnCredit);
        row("Divine Surge given (extra damage dealt by allies)", p => p.st.surgeCredit);
        row("Banes given (damage its areas stopped)", p => p.st.baneCredit);
        row("Healed with new Health (Smite, Consecrated Ground)", p => p.st.mendGiven);
        row("Guard given (damage it took instead of Health)", p => p.st.guardCredit);
        row("Extra healing on Rally Points (Font of Mercy)", p => p.st.mercyGiven);
        if (MP.MAP.on) {
          row("**Map:** AP spent moving", p => p.st.moveAP);
          row("AP lost to moving (Actions dropped or made smaller)", p => p.st.lostAP);
          row("Turns that start Engaged", p => p.st.turnsEngaged);
          row("Shots ([Ranged] Actions)", p => p.st.shots);
          row("... into melee (1 Bane)", p => p.st.intoMelee);
          row("... with Cover", p => p.st.covered);
          row("... while Engaged (2 Banes)", p => p.st.engagedShots);
          row("Flanking Boons on its melee Actions", p => p.st.flankBoons);
          row("Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken", p => `${fmt(p.st.oaMade, 2)} / ${fmt(p.st.oaTaken, 2)}`);
          row("Opportunity Attacks made (the basic Reaction): how many / their damage", p => `${fmt(p.st.oaReal, 2)} / ${fmt(p.st.oaDealt, 2)}`);
          row("Reactions used (all kinds) / the damage they dealt", p => `${fmt(p.st.reactions, 2)} / ${fmt(p.st.reactionDealt, 2)}`);
          if (RULES.apGuard) row("AP left unspent / Guard they gave / Guard used", p => `${fmt(p.st.apLeft, 2)} / ${fmt(p.st.apGuardGiven, 2)} / ${fmt(p.st.apGuardUsed, 2)}`);
          row("Conditions it put on NPCs (Hindered, Immobilized, Prone...)", p => p.st.condApplied, 2);
        }
        const names = [...new Set(days.flatMap(x => x.pcs.flatMap(p => Object.keys(p.st.debuffs))))].sort();
        for (const n of names) row(`**Debuff:** ${n} (times)`, p => p.st.debuffs[n] ?? 0, 2);
        L.push("");
      }
    }
  }
  return L.join("\n");
}

/* ------------------------------------------------------------------ run */
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  // The catch-up (2026-11-12): the default is the book today: the R builds of rework/ and fights.txt, into report.md. `--pre-r`: the classes as they
  // were before pack R (classes/, fights-pre-r.txt) under RULES_PRE_R, into report-pre-r.md (the pre-R studies read those builds).
  const PRE = process.argv.includes("--pre-r"), SRC = PRE ? { dir: "classes", fights: "fights-pre-r.txt", out: "report-pre-r.md", cmd: "node book/ruler/spec.mjs --pre-r" } : { dir: "rework", fights: "fights.txt", out: "report.md", cmd: "node book/ruler/spec.mjs" };
  Object.assign(RULES, PRE ? RULES_PRE_R : RULES_R);
  const dir = `${HERE}${SRC.dir}/`;
  const builds = fs.readdirSync(dir).filter(f => f.endsWith(".txt")).sort().map(f => parseSpec(fs.readFileSync(dir + f, "utf8"), `${SRC.dir}/${f}`));
  const fights = parseFights(fs.readFileSync(HERE + SRC.fights, "utf8")); fights.source = SRC;
  if (process.argv.includes("--check")) {   // the simulation against the exact dice math (calc.mjs); prints only "ok" when everything agrees
    let bad = 0;
    // 1. The dice themselves: 2d12 (3d12 Favored / Doomed) rolled die by die with the system's keepThree / tierOf / bbFive, against tierProbs and critProb.
    for (const [mod, dc, boons, banes, state] of [[2, 13, 0, 0, ""], [2, 13, 2, 0, ""], [2, 13, 1, 3, ""], [2, 14, 0, 0, "favored"], [3, 13, 0, 2, "doomed"], [2, 13, 6, 1, ""], [2, 12, 0, 5, ""], [1, 13, 5, 0, "doomed"], [2, 13, 3, 0, "favored"]]) {
      const R = rng(101), n = 400000, got = [0, 0, 0]; let crit = 0;
      for (let k = 0; k < n; k++) { const r = rollDice(R, mod, dc, boons, banes, state); got[r.tier - 1]++; if (r.crit) crit++; }
      const want = C.tierProbs(mod, dc, boons, banes, state), wc = C.critProb(mod, dc, boons, banes, state);
      const ok = want.every((w, i) => Math.abs(w - got[i] / n) < 0.004) && Math.abs(wc - crit / n) < 0.002; if (!ok) { bad++; console.log(`FAIL dice +${mod} vs ${dc}, ${boons} Boons, ${banes} Banes${state ? ", " + state : ""}: exact ${want.map(x => x.toFixed(3)).join(" / ")} crit ${wc.toFixed(3)}, rolled ${got.map(x => (x / n).toFixed(3)).join(" / ")} crit ${(crit / n).toFixed(3)}`); }
    }
    // 2. The map's Boons and Banes: the Field limit, High cover, Flanking (map.mjs against the book's examples).
    for (const [name, got, want] of mapChecks()) if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log(`FAIL map ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }
    // 3. A turn: one Weapon Attack of each build (no passives) against every Defense, both rule sets' builds.
    const all = [...builds, ...fs.readdirSync(`${HERE}${PRE ? "rework" : "classes"}/`).filter(f => f.endsWith(".txt")).sort().map(f => parseSpec(fs.readFileSync(`${HERE}${PRE ? "rework" : "classes"}/${f}`, "utf8"), `${PRE ? "rework" : "classes"}/${f}`))];
    for (const b of all) for (const d of fights.defenses) {
      const p = C.tierProbs(b.weaponMod, d), w = [0, 1, 2].map(t => weaponTier(b.weapon, t + 1)), avg = x => x.flat + x.dice.reduce((s, [c, n]) => s + c * (n + 1) / 2, 0);
      const exact = p[1] * (avg(w[1]) + b.weaponMod) + p[2] * (avg(w[2]) + b.weaponMod);
      const sim = turnDamage({ ...b, passives: [], turns: { one: { name: "one", steps: ["Weapon Attack"] } } }, "one", d, { n: 200000 }).avg;
      const ok = Math.abs(sim - exact) < 0.1; if (!ok) { bad++; console.log(`FAIL ${b.file} Weapon Attack vs ${d}: exact ${exact.toFixed(2)}, simulated ${sim.toFixed(2)}`); }
    }
    if (!bad) console.log("ok");
    process.exit(bad ? 1 : 0);
  }
  const text = report({ builds, fights });
  fs.writeFileSync(HERE + SRC.out, text);
  if (!process.argv.includes("--quiet")) console.log(text);
}
