// SIM-1 (2026-11-12): the decisions of a fight, apart from its rules. The engine asks a policy who to hit, which turn to take, whom to heal and
// whether to react; it never decides by itself. `planPolicy` is "the old decision rules": exactly what spec.mjs's fight did inline until SIM-1, so
// report.md comes out the same (the gate). SIM-3 writes other policies with the same functions (focus the weakest, protect the healer, kite,
// casual) and runs every headline number under two or three of them.
// E is the engine's view of the fight: { pcs, foes, alive(): the NPCs not dead, up(): the PCs not Down, round, R, M: the map's settings or null, W }.
// What is still decided inside the engine (movement: who a creature walks to, how far a ranged PC steps away, a Charge when it can) moves here
// with SIM-2's maps: book/ruler/sim/README.md.
import { RULES, MP } from "./core.mjs";
import { turnFor, stepOf, group } from "./turn.mjs";

export const planPolicy = {
  name: "plan",
  /** The enemy to bring down first: the one closest to dying. */
  focus: (E, list = E.alive()) => list.sort((x, y) => (x.pool - x.damage) - (y.pool - y.damage))[0],
  /** The ally that needs help most: the largest share of its Health lost. */
  mostHurt: (E, list) => list.sort((x, y) => y.damage / y.build.pool - x.damage / x.build.pool)[0],
  /** The turn a PC takes this round: its class file's plan and `when` lines (turn.mjs turnFor). */
  pcTurn: (E, pc, engaged = false) => turnFor(pc, E.round, E.pcs, engaged),
  /** Whom an Archer marks (Mark Quarry; a new one when the old one dies). */
  quarry: (E, pc) => planPolicy.focus(E),
  /** The target of a PC's Action: a melee PC what is next to it, a ranged PC its Marked Quarry while in range, else the focus. */
  pcTarget(E, pc) {
    const P = this, quarry = pc.quarry && !pc.quarry.dead && pc.build.passives.some(p => p.effect.quarry);
    if (!E.M) return quarry ? pc.quarry : P.focus(E);
    if (pc.melee) return P.focus(E, E.alive().filter(f => MP.adj(pc, f) && MP.canTarget(pc, f, E.W))) ?? null;   // canTarget: on a map, Line of Effect
    const inRange = E.alive().filter(f => Number.isFinite(MP.rangeBanes(pc.range, MP.dist(pc.pos, f.pos))) && MP.canTarget(pc, f, E.W));
    return quarry && inRange.includes(pc.quarry) ? pc.quarry : P.focus(E, inRange) ?? null;
  },
  /** The other creatures of an area or of "a different creature": not the quarry, not the focus first. */
  pcOthers: (E, pc, n) => E.alive().filter(f => f !== pc.quarry && f !== planPolicy.focus(E)).concat(E.alive().filter(f => f !== pc.quarry)).filter((f, i, a) => a.indexOf(f) === i).filter(f => !E.M?.grid || MP.canTarget(pc, f, E.W)).slice(0, n),   // on a map: only the ones it has a line to
  /** Who uses a Rally Point through an ally's heal: the most hurt, and only when it heals at least 3/4 of its value. */
  healTarget: (E, who, kind) => (kind === "self" ? who : planPolicy.mostHurt(E, E.up().filter(x => x.damage >= 0.75 * x.build.rallyHeal && x.rallyLeft > 0))),
  /** Who gets a Defense bonus: "allies" = you and the allies most often in front, "self", else the most hurt ally. */
  defendTargets(E, who, kind, a) {
    const near = [who, ...E.up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 99));
    return kind === "allies" ? near : kind === "self" ? [who] : [this.mostHurt(E, E.up().filter(x => x !== who)) ?? who];
  },
  /** Who is healed with new Health: one creature, or the n most hurt. */
  mendTarget: (E, who, kind) => (kind === "self" ? who : kind === "any" ? planPolicy.mostHurt(E, E.up().filter(x => x.damage > 0)) : planPolicy.mostHurt(E, E.up().filter(x => x !== who && x.damage > 0))),
  mendTargets: (E, who, kind, n) => E.up().filter(x => x.damage > 0 && (kind === "any" || x !== who)).sort((x, y) => y.damage - x.damage).slice(0, n),
  /** Who gets Guard from a card. */
  guardTarget: (E, who, kind) => (kind === "self" ? who : kind === "any" ? planPolicy.mostHurt(E, E.up()) : planPolicy.mostHurt(E, E.up().filter(x => x !== who)) ?? who),
  /**
   * The AP a PC wants to have before it makes this Reaction. The basic Opportunity Attack of a PC with a class Reaction waits for an AP to spare
   * (its Reaction AP stays for the class Reaction: taking every Opportunity Attack loses Health, report.md); RULES.oaPolicy "first" takes the first trigger.
   */
  reactionReserve: (E, p, rx) => (rx.basic && RULES.oaPolicy === "spare" && p.build.reactions.some(x => !x.basic) ? 2 : 1),
  /** How much an NPC wants a PC: the Strikes it can make on it after moving (squared), fewer when the way there passes an Opportunity Attack, a hurt PC a little more. */
  npcWeight(E, f, t, strikes, pastOpportunity) { let s2 = strikes; if (pastOpportunity) s2 *= 0.6; return s2 * s2 * (1 + 0.5 * t.damage / t.build.pool); },
  /** With no PC it can strike this turn: the nearest. */
  npcNearest: (E, f, targets) => targets.sort((x, y) => MP.dist(f.pos, x.pos) - MP.dist(f.pos, y.pos))[0],
  /** Its target went Down or out of reach during its attacks: the first PC it can still attack. */
  npcRetarget: (E, f) => (f.melee ? E.up().find(p => MP.adj(f, p) && MP.canTarget(f, p, E.W)) : E.up().find(p => Number.isFinite(MP.rangeBanes(f.range, MP.dist(f.pos, p.pos))) && MP.canTarget(f, p, E.W))),
  /**
   * Where an Area goes (SIM-2, areas). spots: the places that hold its target (map.mjs areaSpots); count(spot): { foes, friends } that would stand in it.
   * The plan: the most of the creatures it is for; a damaging Area that hits "all creatures" never goes where an ally stands (if every spot has one: the spot with the fewest); an Area that lasts and deals no damage counts allies too (a little more than enemies).
   */
  placeArea(E, who, a, spots, count) {
    let best = null, bs = -Infinity;
    for (const s of spots) { const c = count(s), v = a.shape.who === "allies" ? c.friends : a.rounds > 1 && !a.tiers ? c.foes + 1.5 * c.friends : c.foes - (a.shape.who === "all" && a.tiers ? 100 * c.friends : 0); if (v > bs) { bs = v; best = s; } }   // an Area that lasts and deals no damage (Consecrated Ground, Covering Fire) goes where the fight will be: on the party's line when the enemies are still far
    return best;
  },
  /** Without positions (`map off`): how often an NPC chooses each PC. */
  npcFlatWeight: (E, f, p) => p.build.targeted,
};

/* ------------------------------------------------------------------ SIM-3 (2026-11-12): other policies, built from switches on top of the plan policy.
   Each switch is one decision; policies.mjs runs every headline number with the switches one at a time and together (book/ruler/policies.md). */
const lowest = list => list.sort((x, y) => (x.build ? x.build.pool - x.damage : x.pool - x.damage) - (y.build ? y.build.pool - y.damage : y.pool - y.damage))[0];
const encounterSpent = (pc, key) => pc.build.turns[key].steps.map(stepOf).filter(x => x.kind === "action").some(x => { const a = pc.build.actions[x.name]; return (a.freq === "encounter" || a.freq === "daily") && pc.spent?.has(group(a.name)); });
/**
 * A party policy. Switches (all off = the plan policy):
 *  hold: a melee PC doesn't walk to an enemy it can't reach with one Advance while melee enemies are still coming (rounds 1 and 2): it keeps its AP (Guard) and its place;
 *  kite: a ranged PC that starts its turn Engaged steps away first (1 AP), whatever its turn says;
 *  protect: a melee PC walks to the enemy nearest to a ranged ally when one is within 3 squares of it, not to the one nearest to itself;
 *  novaLate: the round 1 turn with an Encounter Action is kept for round 2 (when Escalation is higher);
 *  react: "first" = every Reaction on its first trigger, the Opportunity Attack too (the plan: "spare", its Reaction AP stays for the class Reaction);
 *  focus: "nearest" = each PC hits the enemy nearest to it (no focus fire: the casual table); the plan: the enemy closest to dying.
 */
export function makePolicy(name, sw = {}) {
  const P = { ...planPolicy, name, switches: sw };
  if (sw.hold) P.holds = (E, pc, t, gap, speed) => E.round <= 2 && gap > speed && E.alive().some(f => f.melee && !E.up().some(p => MP.adj(f, p)));
  if (sw.kite) P.kites = () => true;
  if (sw.protect) P.meleeGoal = (E, pc, list) => { const back = E.up().filter(p => !p.melee); let best = null, bd = 4; for (const f of list) for (const a of back) { const d = MP.dist(f.pos, a.pos); if (d < bd) { bd = d; best = f; } } return best; };
  if (sw.novaLate) P.pcTurn = (E, pc, engaged = false) => { const k1 = turnFor(pc, 1, E.pcs, engaged), k2 = turnFor(pc, 2, E.pcs, engaged); return E.round === 1 || encounterSpent(pc, k1) ? k2 : k1; };
  if (sw.react === "first") P.reactionReserve = () => 1;
  if (sw.focus === "nearest") {
    P.quarry = (E, pc) => MP.nearest(pc, E.alive(), E.W ?? { M: null });
    P.pcTarget = (E, pc) => { if (!E.M) return E.alive()[E.pcs.indexOf(pc) % E.alive().length] ?? null;
      const ok = E.alive().filter(f => MP.canTarget(pc, f, E.W) && (pc.melee ? MP.adj(pc, f) : Number.isFinite(MP.rangeBanes(pc.range, MP.dist(pc.pos, f.pos)))));
      return ok.sort((x, y) => MP.dist(pc.pos, x.pos) - MP.dist(pc.pos, y.pos))[0] ?? null; };
  }
  return P;
}
/**
 * An enemy policy: how an NPC picks its target. "weakest": the PC with the least Health left that it can strike this turn (focus fire);
 * "nearest": the nearest PC, whoever it is; "back": the ranged PCs first (it goes for the Archers). The plan: by the Strikes it can make, a hurt PC a little more.
 */
export function makeNpcPolicy(name, how) {
  const P = { ...planPolicy, name };
  if (how === "weakest") P.npcWeight = (E, f, t, strikes) => (strikes > 0 ? (lowest(E.up().filter(p => true)) === t ? 1000 : 0.001) : 0);
  if (how === "nearest") P.npcWeight = (E, f, t) => 1e-6 + (MP.nearest(f, E.up(), E.W) === t ? 1000 : 0);
  if (how === "back") P.npcWeight = (E, f, t, strikes, past) => planPolicy.npcWeight(E, f, t, strikes, past) * (t.melee ? 1 : 4);
  return P;
}
export const POLICIES = {
  plan: planPolicy,
  hold: makePolicy("hold the line", { hold: true }),
  kite: makePolicy("kite", { kite: true }),
  protect: makePolicy("protect the back line", { protect: true }),
  novaLate: makePolicy("Encounter Actions in round 2", { novaLate: true }),
  reactFirst: makePolicy("react to the first trigger", { react: "first" }),
  tactical: makePolicy("tactical (hold, kite, protect)", { hold: true, kite: true, protect: true }),
  casual: makePolicy("casual (no focus fire, first trigger)", { focus: "nearest", react: "first" }),
};
export const NPC_POLICIES = { plan: planPolicy, weakest: makeNpcPolicy("focus the weakest", "weakest"), nearest: makeNpcPolicy("the nearest", "nearest"), back: makeNpcPolicy("go for the back line", "back") };
