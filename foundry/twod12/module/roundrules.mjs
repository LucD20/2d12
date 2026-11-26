// v0.0.365 (SIM-1, 2026-11-12; book, Chapters 2 and 3): the rules of a round as pure functions, one copy for the system and for the automated
// playtest environment (book/ruler/sim, which imports this file under Node). Nothing here reads Foundry: numbers in, numbers out. The system's
// own modules call these (combat.mjs, escalation.mjs, sheetmodel.mjs, flanking.mjs) and export them under their old names, so nothing else changed.
// When a rule of the round is written, it goes here first; test t246 checks the functions against the book's examples and that the callers use them.
import { TWOD12 } from "./config.mjs";
import { BB_LIMIT } from "./calc.mjs";
import { apGuardOf } from "./guard.mjs";

/* ---- Action Points (Ch. 2, Action Points) ---- */
export const AP_PER_TURN = TWOD12.apPerTurn, REACTION_AP = TWOD12.reactionAp;
/** The AP a creature regains at the start of its turn: its base (4; a Minion 3), more with Quickened, fewer with Slowed, never under 0. The Reaction Point is apart. */
export const turnAP = (base = AP_PER_TURN, { slowed = 0, quickened = 0 } = {}) => Math.max(0, (Number(base) || 0) + (Number(quickened) || 0) - (Number(slowed) || 0));
/** The Reaction Point a creature has: it is gained when it regains AP at the start of its turn, so none before its first turn of the encounter. */
export const reactionAPAt = hadTurn => (hadTurn ? REACTION_AP : 0);
/** Paying a Reaction (cost N R): the Reaction Point first, then AP kept from the turn. { fromRap, fromAp } (fromAp can be more than the AP there are: the caller checks). */
export const payReaction = (cost, ap, rap) => { const fromRap = Math.min(Math.max(0, rap), Math.max(0, cost)); return { fromRap, fromAp: Math.max(0, cost - fromRap) }; };
/** Can it pay a Reaction of this cost with these AP and this Reaction Point? */
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
// The Elite Escalation ladder (ELITE_RUNGS, ELITE_RUNGS_LADDER, eliteFirstAttackBoons, eliteRoundSpecials, eliteEncounterBack): removed by the cleanup
// audit (2026-11-26, Lucas: "Remove the Default ladder"); the SIM keeps its frozen copy (book/ruler/sim/tables.mjs).

/* ---- Stage 0 in the book (2026-11-12, pack "Stage 0 into the book"; Ch. 2, Escalation and Momentum; Ch. 3, Ranged Combat While Engaged) ---- */
// The book's rules since that pack; the system's callers use them since v0.0.407 (pack "Stage 0 in Foundry": escalation.mjs, actions.mjs, combat.mjs),
// and the automated playtest environment (book/ruler/sim) too.
/** Escalation runs 1 to 6; Momentum is a number from 0 to 4 the party keeps between encounters. */
export const ESC_LADDER_MAX = ESC_MAX, MOMENTUM_MAX = TWOD12.escalation.momentumMax;
const momentumOf = m => Math.max(0, Math.min(MOMENTUM_MAX, Math.trunc(Number(m)) || 0));
/** The Escalation an encounter starts at: 1 + the party's Momentum (0 to 4), so 5 at most. */
export const escalationStartAt = momentum => ESC_MIN + momentumOf(momentum);
/** v0.0.509 (Lucas, 2026-11-25; book, Chapter 2, The Escalation die): dE, a die with twice your Escalation's sides, at least a d4 (d4 at 1 and 2, d6 at 3 ... d12 at 6); it never explodes. */
export const escalationDie = esc => Math.max(4, 2 * Math.min(ESC_LADDER_MAX, Math.max(ESC_MIN, Math.trunc(Number(esc)) || ESC_MIN)));
/** Pure: a damage formula's dE ("2dE", "dE") as the creature's die ("2d6" at Escalation 3); everything else untouched. */
export const withEscalationDie = (formula, esc) => String(formula ?? "").replace(/(\d*)dE\b/g, (m, n) => `${n || 1}d${escalationDie(esc)}`);
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
/** Ranged Combat While Engaged since Stage 0: a [Ranged] Action while you are Engaged is Doomed (it was 2 Banes: ENGAGED_RANGED_BANES below). */
export const ENGAGED_RANGED_DOOMED = true;
/** A Thrown weapon thrown deals this much less damage on Tiers 2 and 3 (Ch. 15, Thrown; Lucas, 2026-11-12): each instance of its [W]. */
export const THROWN_LESS = 1;
/** Up to this many Minions can act in the same turn slot, one after another (the Bestiary; Lucas, 2026-11-12: 3; the Bestiary's rebuild, Lucas,
 *  2026-11-25: "Ok, lets do Squads of 2"). */
export const MINION_SQUAD = 2;

/**
 * Creatures in your way (Ch. 3, the core rework batch 4) and Drifting (the Bestiary's rebuild, 2026-11-25: the Grave Wisp): what another creature's
 * space is to a mover's own movement (pure). "block": an unwilling creature that isn't Down; "dt": an ally's, or a Down creature's (Difficult
 * Terrain); "pass": a drifting mover passes through every creature's space, never Difficult Terrain (it still can't end in one).
 */
// v0.0.525 (book, Chapter 3, Creatures in your way; Lucas, 2026-11-26: "Agreed on the difficult terrain"): "none": a dead creature doesn't affect
// movement (pass through its space and end in it), for every mover; down: an Unconscious creature (Difficult Terrain), never one Down and fighting.
export const creatureWay = ({ drifting = false, unwilling = false, down = false, dead = false } = {}) => (dead ? "none" : drifting ? "pass" : !down && unwilling ? "block" : "dt");

/**
 * One square of Difficult Terrain always (v0.0.525, the cleanup audit, B2-016; book, Chapter 3, Difficult Terrain: "A movement of at least 1 square
 * can always enter one square, whatever it costs"; its example: Mark Crawls 1 into rubble, then Advances into it with a Speed of 1). Pure: what a
 * move costs the movement. cost: its squares with Difficult Terrain; entered: the squares it enters; budget: what this movement has left; size: the
 * movement's whole size (budget === size: none of it used yet). A movement of at least 1 square, unused, entering one square that costs more than
 * it has: it enters it and the movement is spent (its budget). Anything else costs what it costs.
 */
export const oneSquareCost = ({ cost = 0, entered = 0, budget = 0, size = 0 } = {}) => {
  const c = Number(cost) || 0, b = Number(budget) || 0;
  return Math.round(Number(entered) || 0) === 1 && b >= 1 && Math.abs(b - (Number(size) || 0)) < 1e-6 && c > b + 1e-6 ? b : c;
};

/* ---- Minion ticks (the Bestiary's rebuild, 2026-11-25; book, Bestiary, Ticks; book/cards/goblin-sneak-redesign.md) ---- */
/** A Minion's ticks when its entry names no other number. */
export const MINION_TICKS = 2;
/**
 * The ticks one damage removes from a Minion (pure). dealt: the damage that reaches it (after its Resistance, Immunity, reductions and Guard);
 * tier: the Action's Tier against it (1 to 3; 0 or none: damage with no Tier: a Collision, a Lingering, a hazard, a zone); save: the Tier is the
 * Minion's own Save (turned over: its Tier 1 removes 3, its Tier 3 removes 1); ticked: what dealt it (the Action) has already removed ticks from
 * this Minion. Rules 1 to 5: a Tier removes its ticks once an Action, only if it deals damage; damage with no Tier removes 1 when what dealt it
 * hasn't ticked the Minion; a rider with no damage removes none (dealt 0).
 */
export function ticksRemoved({ dealt = 0, tier = 0, save = false, ticked = false } = {}) {
  if (!((Number(dealt) || 0) > 0) || ticked) return 0;
  const t = Math.trunc(Number(tier)) || 0;
  if (t >= 1 && t <= 3) return save ? 4 - t : t;
  return 1;
}
/** Rule 6: a heal of any size restores 1 tick, up to its ticks. left, max: its ticks. Returns the ticks after. */
export const ticksAfterHeal = (left, max) => Math.max(0, Math.min(Math.trunc(Number(max)) || 0, (Math.trunc(Number(left)) || 0) + 1));
/**
 * Rule 7 and going Down (pure): a Minion's state from its ticks. max: its ticks; lost: the ticks removed (no overflow: never more than max); by: the
 * pools of the damage that left it at 1 tick ("B" Vigor, "M" Resolve, "BM" both). { left, down, bloodied, strained }.
 */
export function minionState({ max = MINION_TICKS, lost = 0, by = "" } = {}) {
  const m = Math.max(1, Math.trunc(Number(max)) || MINION_TICKS), left = Math.max(0, m - Math.max(0, Math.trunc(Number(lost)) || 0));
  const one = left === 1 && m > 1;
  return { left, max: m, down: left <= 0, bloodied: one && /B/.test(String(by)), strained: one && /M/.test(String(by)) };
}
/**
 * The ticks as the creature's damage record (pure): each tick removed counts as one point of the damage that removed it, in the pool that took
 * more of it (Vigor on a tie) and as Lethal or Nonlethal by the larger share, so Chapter 4's NPCs Going Down reads the ticks as it reads damage.
 * a: the damage that reached it { B: { l, n }, M: { l, n } }; n: the ticks removed. Returns { a: the tick buckets, by: the pools it touched }.
 */
export function tickBuckets(a, n) {
  const B = (a?.B?.l ?? 0) + (a?.B?.n ?? 0), M = (a?.M?.l ?? 0) + (a?.M?.n ?? 0), p = M > B ? "M" : "B";
  const l = (a?.[p]?.l ?? 0), nl = (a?.[p]?.n ?? 0), k = nl > l ? "n" : "l";
  const out = { B: { l: 0, n: 0 }, M: { l: 0, n: 0 } };
  out[p][k] = Math.max(0, Math.trunc(Number(n)) || 0);
  return { a: out, by: `${B > 0 ? "B" : ""}${M > 0 ? "M" : ""}` };
}
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
 * 2d12 (every die gains 0.5 on average). rollFace(sides) rolls one die. A die explodes where its formula writes ! (1d6!): every weapon's die ([W]), and
 * any creature's card that writes it; the Empowered die always. v0.0.523 (Lucas, 2026-11-26): no rank's dice are an exception (the old npcDieExplodes,
 * a Minor enemy's dice never exploding, is the SIM's frozen copy now: book/ruler/sim/tables.mjs).
 */
export function explodingDie(rollFace, sides) { let f = rollFace(sides), t = 0; while (sides > 1 && f === sides) { t += sides - 1; f = rollFace(sides); } return t + f; }
/** Empowered (Ch. 8; Lucas, 2026-11-13): the first time a creature deals damage on each of its turns it adds this die, exploding (1d6!). No value. */
export const EMPOWERED_DIE = 6;
/** Vulnerable N (Ch. 8): Actions against the creature gain N Boons (only the highest value counts). */
export const vulnerableBoons = n => Math.max(0, Math.trunc(Number(n)) || 0);

/* ---- Position (Ch. 3: Flanking, Cover; Ch. 1: Named Boons and Banes) ---- */
/** Flanking before the core rework's batch 4 (the frozen SIM still reads it): 1 Field Boon for each other creature that threatens the target, minus 1 for each ally of the target that threatens the attacker, then the limit of 2. { raw, boons }. */
/**
 * Flanking, the core rework batch 4 (Lucas, 2026-11-25; book, Chapter 3, D1): two creatures flank an enemy when both threaten it and they stand on
 * opposite sides of it: the partner is within 45° (the edge counts) of the straight line from the flanker through the enemy's center, between square
 * centers, any square of each one's space. Pure: cells are { i, j } squares.
 */
export function oppositeSides(aCells, bCells, tCells) {
  const c = { y: tCells.reduce((s, q) => s + q.i, 0) / tCells.length, x: tCells.reduce((s, q) => s + q.j, 0) / tCells.length };
  for (const a of aCells) {
    const ux = c.x - a.j, uy = c.y - a.i, ul = Math.hypot(ux, uy);
    if (ul < 1e-9) continue;
    for (const b of bCells) {
      const vx = b.j - c.x, vy = b.i - c.y, vl = Math.hypot(vx, vy);
      if (vl < 1e-9) continue;
      if ((ux * vx + uy * vy) / (ul * vl) >= Math.SQRT1_2 - 1e-9) return true;
    }
  }
  return false;
}
/** Flanking (batch 4): a flat 1 Field Boon with a partner opposite, none when an ally of the enemy threatens you (the cancel). { raw, boons }. */
export const flankBoon = (opposite, cancels) => { const raw = opposite ? 1 : 0; return { raw, boons: raw && !(Number(cancels) > 0) ? 1 : 0 }; };
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
