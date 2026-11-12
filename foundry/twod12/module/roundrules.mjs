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
export const ESC_MIN = TWOD12.escalation.min, ESC_MAX = TWOD12.escalation.max, ESC_MOMENTUM = TWOD12.escalation.momentum;
/** The level an encounter starts at: 1, or 2 with Momentum. */
export const escalationStart = momentum => (momentum ? ESC_MOMENTUM : ESC_MIN);
/** The level after a raise (a new round, a Critical, the class's hook, the GM's valve): one more, at most 3. */
export const escalationRaised = (now, by = 1) => Math.max(0, Math.min(ESC_MAX, (Number(now) || 0) + (Number(by) || 0)));
/** Momentum (Ch. 2): after an encounter harder than easy (more than CV 75 a PC) the next one starts with it; that encounter uses it up. */
export const givesMomentum = cvPerPc => (Number(cvPerPc) || 0) > 75;
/** An Elite's Escalation ladder (the Bestiary): at 1 its first attack each round has 1 Boon; at 2 its Round Special twice a round; at 3 its Encounter Special back, once. */
/** rungs: the Escalation each of the three starts at: [1, 2, 3] (the system today), or ELITE_RUNGS_LADDER on the 1-to-6 ladder (the book since Stage 0). */
export const ELITE_RUNGS = [1, 2, 3], ELITE_RUNGS_LADDER = [2, 4, 6];
export const eliteFirstAttackBoons = (esc, rungs = ELITE_RUNGS) => ((Number(esc) || 0) >= rungs[0] ? 1 : 0);
export const eliteRoundSpecials = (esc, rungs = ELITE_RUNGS) => ((Number(esc) || 0) >= rungs[1] ? 2 : 1);
export const eliteEncounterBack = (esc, rungs = ELITE_RUNGS) => (Number(esc) || 0) >= rungs[2];

/* ---- Stage 0 in the book (2026-11-12, pack "Stage 0 into the book"; Ch. 2, Escalation and Momentum; Ch. 3, Ranged Combat While Engaged) ---- */
// The book's rules since that pack. **The system's own callers still use the functions above** (the 1-to-3 ladder, the on / off Momentum, the 2 Banes)
// until the pack "Stage 0 in Foundry" rewires them (foundry-backlog.md); the automated playtest environment (book/ruler/sim) uses these already.
/** Escalation runs 1 to 6; Momentum is a number from 0 to 4 the party keeps between encounters. */
export const ESC_LADDER_MAX = 6, MOMENTUM_MAX = 4;
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
/** Ranged Combat While Engaged since Stage 0: a [Ranged] Action while you are Engaged is Doomed (it was 2 Banes: ENGAGED_RANGED_BANES below). */
export const ENGAGED_RANGED_DOOMED = true;
/** No creature has an Opportunity Attack by default since Stage 0 (it left the Basic Actions, for PCs and NPCs; a Talent brings it back later). */
export const BASIC_OPPORTUNITY_ATTACK = false;

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
