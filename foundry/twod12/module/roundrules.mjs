// v0.0.365 (SIM-1, 2026-11-12; book, Chapters 2 and 3): the rules of a round as pure functions, one copy for the system and for the automated
// playtest environment (book/ruler/sim, which imports this file under Node). Nothing here reads Foundry: numbers in, numbers out. The system's
// own modules call these (combat.mjs, escalation.mjs, sheetmodel.mjs, flanking.mjs) and export them under their old names, so nothing else changed.
// When a rule of the round is written, it goes here first; test t246 checks the functions against the book's examples and that the callers use them.
import { TWOD12 } from "./config.mjs";
import { BB_LIMIT } from "./calc.mjs";
import { apGuardOf } from "./guard.mjs";

/* ---- Action Points (Ch. 2, Action Points) ---- */
export const AP_PER_TURN = TWOD12.apPerTurn, REACTION_AP = TWOD12.reactionAp;
/** The AP a creature regains at the start of its turn: its base (4; a Minion 3), more with Quickened, fewer with Slowed, never under 0. The Reaction AP is apart. */
export const turnAP = (base = AP_PER_TURN, { slowed = 0, quickened = 0 } = {}) => Math.max(0, (Number(base) || 0) + (Number(quickened) || 0) - (Number(slowed) || 0));
/** The Reaction AP a creature has: it is gained when it regains AP at the start of its turn, so none before its first turn of the encounter. */
export const reactionAPAt = hadTurn => (hadTurn ? REACTION_AP : 0);
/** Paying a Reaction (cost N R): the Reaction AP first, then AP kept from the turn. { fromRap, fromAp } (fromAp can be more than the AP there are: the caller checks). */
export const payReaction = (cost, ap, rap) => { const fromRap = Math.min(Math.max(0, rap), Math.max(0, cost)); return { fromRap, fromAp: Math.max(0, cost - fromRap) }; };
/** Can it pay a Reaction of this cost with these AP and this Reaction AP? */
export const canPayReaction = (cost, ap, rap) => payReaction(cost, ap, rap).fromAp <= Math.max(0, Number(ap) || 0);
/** Unspent AP (Ch. 2): when the next turn starts, each AP still unused gives Guard for 1 round (2 / 3 / 4 by Stage); the first turn of an encounter has none. { unused, guard }. */
export const unusedApGuard = (hadTurn, apLeft, stage) => { const unused = hadTurn ? Math.max(0, Math.trunc(Number(apLeft)) || 0) : 0; return { unused, guard: apGuardOf(unused, stage) }; };
/** A turn has at most 3 [Strike] Actions (Ch. 7, Strike). */
export const STRIKES_PER_TURN = 3;
/** The At-will Bane (Ch. 2, At-will): an At-will Action used again in the same turn takes 1 Bane for each earlier use (no name: it adds up). */
export const atWillBanes = usesBefore => Math.max(0, Math.trunc(Number(usesBefore)) || 0);

/* ---- Escalation (Ch. 2, Escalation and Momentum) ---- */
/** The ladder (v0.0.407, Stage 0 in Foundry): Escalation runs 1 to 6 (config.mjs escalation). */
export const ESC_MIN = TWOD12.escalation.min, ESC_MAX = TWOD12.escalation.max;
/**
 * Pack R's ladder (1 to 3; Momentum an on / off switch that started an encounter at 2), before Stage 0. The system no longer uses it (v0.0.407: the
 * Stage 0 block below); the ruler's RULES_R still models it (book/ruler/sim/core.mjs), as the class cards in the ruler are written on it until the
 * class card sessions. The numbers are pack R's, fixed here.
 */
export const ESC_MAX_R = 3, ESC_MOMENTUM_R = 2;
/** Pack R: the level an encounter started at: 1, or 2 with Momentum. */
export const escalationStart = momentum => (momentum ? ESC_MOMENTUM_R : ESC_MIN);
/** Pack R: the level after a raise, at most 3. */
export const escalationRaised = (now, by = 1) => Math.max(0, Math.min(ESC_MAX_R, (Number(now) || 0) + (Number(by) || 0)));
/** Pack R's Momentum: after an encounter harder than easy (more than CV 75 a PC) the next one started with it. */
export const givesMomentum = cvPerPc => (Number(cvPerPc) || 0) > 75;
/** An Elite's Escalation ladder (the Bestiary): its first [Strike] Action each turn-cycle has 1 Boon (Pressing), its Round Specials twice per turn-cycle, its Encounter Special back, once. */
/** rungs: the Escalation each of the three starts at: [1, 2, 3] (pack R), or ELITE_RUNGS_LADDER on the 1-to-6 ladder (the book since Stage 0; the system since v0.0.407). */
export const ELITE_RUNGS = [1, 2, 3], ELITE_RUNGS_LADDER = [2, 4, 6];
export const eliteFirstAttackBoons = (esc, rungs = ELITE_RUNGS) => ((Number(esc) || 0) >= rungs[0] ? 1 : 0);
export const eliteRoundSpecials = (esc, rungs = ELITE_RUNGS) => ((Number(esc) || 0) >= rungs[1] ? 2 : 1);
export const eliteEncounterBack = (esc, rungs = ELITE_RUNGS) => (Number(esc) || 0) >= rungs[2];

/* ---- Stage 0 in the book (2026-11-12, pack "Stage 0 into the book"; Ch. 2, Escalation and Momentum; Ch. 3, Ranged Combat While Engaged) ---- */
// The book's rules since that pack; the system's callers use them since v0.0.407 (pack "Stage 0 in Foundry": escalation.mjs, actions.mjs, combat.mjs),
// and the automated playtest environment (book/ruler/sim) too.
/** Escalation runs 1 to 6; Momentum is a number from 0 to 4 the party keeps between encounters. */
export const ESC_LADDER_MAX = ESC_MAX, MOMENTUM_MAX = TWOD12.escalation.momentumMax;
const momentumOf = m => Math.max(0, Math.min(MOMENTUM_MAX, Math.trunc(Number(m)) || 0));
/** The Escalation an encounter starts at: 1 + the party's Momentum (0 to 4), so 5 at most. */
export const escalationStartAt = momentum => ESC_MIN + momentumOf(momentum);
/** The level after a raise on the 1-to-6 ladder (a new round, a Critical, the class's hook, the GM's valve). */
export const escalationRaisedTo = (now, by = 1, max = ESC_LADDER_MAX) => Math.max(0, Math.min(max, (Number(now) || 0) + (Number(by) || 0)));
/**
 * The party's Momentum after something happens: +1 for each encounter overcome (a fight, a negotiation, a sneak, a Challenge), -1 for each PC that
 * goes Down, -1 at each Sleep, all of it on a Retreat and at a Rest; never under 0 or above 4.
 */
export const momentumAfter = (now, { overcome = 0, downs = 0, sleeps = 0, retreat = false, rest = false } = {}) =>
  (retreat || rest ? 0 : momentumOf((Number(now) || 0) + (Number(overcome) || 0) - (Number(downs) || 0) - (Number(sleeps) || 0)));
/** The party's Momentum as a number from 0 to 4 (a stored value of any kind: an old true / false switch reads 1 / 0). */
export const momentumValue = m => momentumOf(m === true ? 1 : m);
/** A Critical or a hook at the top of the ladder does nothing and isn't used up (Ch. 2, "At most 6"): can the level rise? */
export const canRaise = (now, max = ESC_LADDER_MAX) => (Number(now) || 0) < max;
/** Swapping on a Rest (Ch. 5): the order of the Modifiers can be swapped only during Stage 0; the other level-list choices at every Stage. */
export const canSwapModifierOrder = stage => (Math.trunc(Number(stage)) || 0) === 0;
/** Ranged Combat While Engaged since Stage 0: a [Ranged] Action while you are Engaged is Doomed (it was 2 Banes: ENGAGED_RANGED_BANES below). */
export const ENGAGED_RANGED_DOOMED = true;
/** A Thrown weapon thrown deals this much less damage on Tiers 2 and 3 (Ch. 15, Thrown; Lucas, 2026-11-12): each instance of its [W]. */
export const THROWN_LESS = 1;
/** Up to this many Minions can act in the same turn slot, one after another (the Bestiary; Lucas, 2026-11-12). */
export const MINION_SQUAD = 3;
/**
 * The Minions' squads for an Initiative roll: list [{ id, kind, group }] in order (kind: the same creature, such as its actor; "" for one that isn't a
 * Minion). Up to MINION_SQUAD Minions of the same kind share one roll: { leaderId: [memberIds] }, the leader first (it rolls; the others take its result).
 * v0.0.440 (Lucas, 2026-11-18, the checklist: "always attempt to keep as even as possible. If there are four minions, two groups of two ... The GM
 * decides who goes together when initiative is rolled"): the fewest squads that hold them (n / 3, rounded up), as even as can be (4: 2 + 2, 5: 3 + 2,
 * 7: 3 + 2 + 2); group (1, 2...) is the GM's choice for a Minion (the Initiative window), honored while its squad has room.
 */
export function minionSquads(list, size = MINION_SQUAD) {
  const out = {}, kinds = new Map();
  for (const x of list ?? []) { if (!x?.kind) continue; if (!kinds.has(x.kind)) kinds.set(x.kind, []); kinds.get(x.kind).push(x); }
  for (const xs of kinds.values()) for (const g of evenGroups(xs, size)) if (g.length) out[g[0].id] = g.map(x => x.id);
  return out;
}
/** Pure (v0.0.440; v0.0.453, playtest 6: the book's recommendation, "3-4, 2 squads, 5-6, 3 squads"): the squads of one kind of Minion, [[x]].
 *  With no squad set by the GM: one squad for every 2 Minions, rounded up, as even as can be. Once the GM has set them (x.group, 1 to n), the
 *  squads are the GM's (never more than `size` in one; an empty squad number is dropped). */
export function evenGroups(xs, size = MINION_SQUAD) {
  const n = xs?.length ?? 0, min = Math.max(1, Math.ceil(n / size)), gOf = x => Math.trunc(Number(x.group)) || 0;
  const valid = (xs ?? []).map(gOf).filter(g => g >= 1 && g <= n), allSet = n > 0 && valid.length === n;
  const k = Math.max(min, allSet ? Math.max(...valid) : Math.max(Math.ceil(n / 2), ...valid, 0));
  const gs = Array.from({ length: k }, () => []), cap = allSet ? size : Math.ceil(n / k), rest = [];
  for (const x of xs ?? []) { const g = gOf(x); if (g >= 1 && g <= k && gs[g - 1].length < cap) gs[g - 1].push(x); else rest.push(x); }
  for (const x of rest) { let i = 0; for (let j = 1; j < k; j++) if (gs[j].length < gs[i].length) i = j; gs[i].push(x); }
  const out = gs.filter(g => g.length);
  return out.length ? out : [[]];
}
/** Pure (v0.0.440): each Minion's squad for the Initiative window, { id: { n, of } } (its squad's number and how many squads its kind has). */
export function minionGroupOf(list, size = MINION_SQUAD) {
  const out = {}, kinds = new Map();
  for (const x of list ?? []) { if (!x?.kind) continue; if (!kinds.has(x.kind)) kinds.set(x.kind, []); kinds.get(x.kind).push(x); }
  // v0.0.453: shown from 2 Minions (the GM can split two); `next` is the squad a click moves it to: the next one, a new one after the last while
  // its own squad has others (and there are fewer squads than Minions), then the first
  for (const xs of kinds.values()) {
    if (xs.length < 2) continue;
    const gs = evenGroups(xs, size);
    gs.forEach((g, i) => g.forEach(x => {
      const n = i + 1, of = gs.length, fits = j => j !== n && (gs[j - 1]?.length ?? 0) < size;
      let next = 0;
      for (let j = n + 1; j <= of && !next; j++) if (fits(j)) next = j;
      if (!next && g.length > 1 && of < xs.length) next = of + 1;
      for (let j = 1; j < n && !next; j++) if (fits(j)) next = j;
      out[x.id] = { n, of, next: next || n, groups: Object.fromEntries(gs.flatMap((gg, gi) => gg.map(y => [y.id, gi + 1]))) };
    }));
  }
  return out;
}
/** No creature has an Opportunity Attack by default since Stage 0 (it left the Basic Actions, for PCs and NPCs; a Talent brings it back later). */
export const BASIC_OPPORTUNITY_ATTACK = false;

/* ---- Conditions on a roll (Ch. 8; pack "The Bestiary's turn budget", 2026-11-12) ---- */
/**
 * What a creature's own conditions do to a roll it makes (Ch. 8): Frightened 1 Bane on all its Rolls (while it sees the source: the ruler counts
 * it always), Taunted 1 Bane on its Actions against anyone but the taunter, Blinded makes its Actions Doomed (against a creature it only hears:
 * the ruler counts every Strike), and the "next roll" riders of the Bestiary (1 Pressure Bane, Doomed) on the next roll it makes. { banes, doomed }.
 */
export function rollerConditionMods({ frightened = false, taunted = false, againstTaunter = false, blinded = false, nextBanes = 0, nextDoomed = false } = {}) {
  const banes = (frightened ? 1 : 0) + (taunted && !againstTaunter ? 1 : 0) + Math.max(0, Math.trunc(Number(nextBanes)) || 0);
  return { banes, doomed: !!blinded || !!nextDoomed };
}
/**
 * A damage die that explodes (Ch. 1, Exploding Dice; Lucas, 2026-11-12): its top face counts as one less and it is rolled again, as a 12 does on the
 * 2d12 (every die gains 0.5 on average). rollFace(sides) rolls one die. A PC's weapon die ([W]) explodes; a Standard's or an Elite's Basic attack and an
 * Action that writes its die with ! (1d6!) do; a Minor enemy's dice never (explodes()).
 */
export function explodingDie(rollFace, sides) { let f = rollFace(sides), t = 0; while (sides > 1 && f === sides) { t += sides - 1; f = rollFace(sides); } return t + f; }
/** Empowered (Ch. 8; Lucas, 2026-11-13): the first time a creature deals damage on each of its turns it adds this die, exploding (1d6!). No value. */
export const EMPOWERED_DIE = 6;
export const npcDieExplodes = (rank, { basic = false, trait = false } = {}) => rank !== "minion" && rank !== "grunt" && (!!basic || !!trait);
/** Vulnerable N (Ch. 8): Actions against the creature gain N Boons (only the highest value counts). */
export const vulnerableBoons = n => Math.max(0, Math.trunc(Number(n)) || 0);

/* ---- Position (Ch. 3: Flanking, Cover; Ch. 1: Named Boons and Banes) ---- */
/** Flanking: 1 Field Boon for each other creature that threatens the target, minus 1 for each ally of the target that threatens the attacker, then the limit of 2. { raw, boons }. */
export const flankBoons = (others, cancels) => { const raw = Math.max(0, (Number(others) || 0) - (Number(cancels) || 0)); return { raw, boons: Math.min(BB_LIMIT, raw) }; };
/**
 * Cover by its level (blocked corners: 0 none, 1 Low, 2 Medium, 3 High; 4 is no Line of Effect) on an Action against the creature behind it:
 * Low 1 and Medium 2 Field Banes; High cover makes the roll Doomed and gives no Field Banes. On a Save the creature behind it rolls (save: true):
 * 1 / 2 Field Boons, and High cover makes the Save Favored. { boons, banes, bb, doomed, favored, noLoE }.
 */
export function coverMods(level, { save = false } = {}) {
  const l = Math.max(0, Math.min(4, Math.trunc(Number(level)) || 0)), out = { boons: 0, banes: 0, bb: "field", doomed: false, favored: false, noLoE: l >= 4 };
  if (l === 3) out[save ? "favored" : "doomed"] = true;
  else if (l === 1 || l === 2) out[save ? "boons" : "banes"] = l;
  return out;
}
/** Ranged Combat While Engaged (Ch. 3): 2 Banes (no name) on a [Ranged] Action while you are Engaged; 1 Field Bane against a creature Engaged with someone else. */
export const ENGAGED_RANGED_BANES = 2, INTO_MELEE_FIELD_BANES = 1;
/** Prone (Ch. 8): 1 Field Boon on [Melee] Actions against it, 1 Field Bane on [Ranged] ones. */
export const proneMods = ranged => (ranged ? { boons: 0, banes: 1, bb: "field" } : { boons: 1, banes: 0, bb: "field" });
/** Weapon Range (Ch. 3): normal 0 Banes, far 1, maximum 2 (no name: they add to Cover); beyond the maximum the Action can't be used (Infinity). ranges: [normal, far, maximum]. */
export function rangeBanes(ranges, distance, { longDraw = false } = {}) {
  const r = ranges ?? [1], d = Number(distance) || 0;
  if (d <= r[0]) return 0;
  if (d <= (r[1] ?? r[0])) return longDraw ? 0 : 1;
  if (d <= (r[2] ?? r[1] ?? r[0])) return longDraw ? 1 : 2;
  return Infinity;
}
