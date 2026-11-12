// SIM-1 (2026-11-12): the decisions of a fight, apart from its rules. The engine asks a policy who to hit, which turn to take, whom to heal and
// whether to react; it never decides by itself. `planPolicy` is "the old decision rules": exactly what spec.mjs's fight did inline until SIM-1, so
// report.md comes out the same (the gate). SIM-3 writes other policies with the same functions (focus the weakest, protect the healer, kite,
// casual) and runs every headline number under two or three of them.
// E is the engine's view of the fight: { pcs, foes, alive(): the NPCs not dead, up(): the PCs not Down, round, R, M: the map's settings or null, W }.
// What is still decided inside the engine (movement: who a creature walks to, how far a ranged PC steps away, a Charge when it can) moves here
// with SIM-2's maps: book/ruler/sim/README.md.
import { RULES, MP } from "./core.mjs";
import { turnFor } from "./turn.mjs";

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
  /** Without positions (`map off`): how often an NPC chooses each PC. */
  npcFlatWeight: (E, f, p) => p.build.targeted,
};
