// The Paladin's Judge (pack F2, v0.0.409; book, the Paladin: Judge). Judge marks a creature (mark.mjs, the mark's kind "judge"): it is Judged by
// the Paladin until the encounter ends or it goes Down. A creature Judged by you counts as Profane for you (Smite's d8s, Word of Radiance's
// d8s, every "Profane" rule of yours). Weight of Judgment (Escalation 4) takes 2 from its Speed (data.mjs, to a minimum of 1). v0.0.527 (Lucas,
// 2026-11-26): Judge no longer reduces the Judged creature's damage (the reduction and its question are gone; the Encounter Log reads old lines).
import { markOf, isMarked } from "./automation.mjs";
import { tagChoices } from "./config.mjs";
import { turnCycleBlocked } from "./usage.mjs";
const norm = s => String(s ?? "").trim().toLowerCase();
const actorOf = d => (d?.documentName === "Actor" ? d : d?.actor ?? null);

/** Does this creature have an Action that Judges (Judge)? */
export const judgesWith = actor => (actor?.itemTypes?.action ?? []).some(i => i.system?.marksTarget && i.system?.markKind === "judge");
/** Is the target (an actor or a token) Judged by this creature? */
export const isJudgedBy = (judge, target) => !!judge && !!target && judgesWith(judge) && markOf(judge)?.kind === "judge" && isMarked(judge, target);
/** Pure: does a creature's Tags list hold Profane (keys or their labels)? */
export function hasProfaneTag(target, labels = {}) {
  const a = actorOf(target) ?? target;
  return [...(a?.system?.tags ?? [])].some(k => norm(k) === "profane" || norm(labels[k]) === "profane");
}
/** Is the target Profane for this creature: the Profane Tag, or Judged by it ("counts as Profane for you")? */
export function isProfaneFor(source, target) {
  let labels = {};
  try { labels = tagChoices() ?? {}; } catch (e) { /* no world tags */ }
  return hasProfaneTag(target, labels) || isJudgedBy(source, target);
}

/** Pure: Smite's dice (book, Smite): 1 a point of Escalation, up to 4, plus the extra ones (Tier 3's, the Reaction Point's); d8s against a Profane creature. */
export const smiteDice = (escalation, extra = 0, profane = false) => `${Math.min(4, Math.max(0, Math.trunc(Number(escalation) || 0))) + Math.max(0, Math.trunc(Number(extra) || 0))}d${profane ? 8 : 6}!`;
/**
 * Pure: a Version's dice under its dice rule (data.mjs diceRule). "smite": a written "Nd6!" is Smite's dice with N - 1 extra (Tier 1 and 2 write
 * 1d6!, Tier 3 2d6!), plus 1 with the Reaction Point spent; "profane": its d6s are d8s against a Profane creature (Word of Radiance). Other dice stay.
 */
export function ruledDice(dice, rule, { escalation = 0, profane = false, more = false } = {}) {
  const d = String(dice ?? "");
  if (rule === "smite") { const m = d.match(/^(\d+)d6!?$/); return m ? smiteDice(escalation, Number(m[1]) - 1 + (more ? 1 : 0), profane) : d; }
  if (rule === "profane" && profane) return d.replace(/(\d+)d6(!?)/g, "$1d8$2");
  return d;
}

/** The key of now (once each round), or "" outside a combat. v0.0.431 (the book audit Q2, Chapter 2: "once a round" and "once each round" mean once
 *  per turn-cycle): it carries the turn too, and usedThisCycle reads it against the creature's own turn-cycle. */
export const roundKey = combat => (combat?.started ? `${combat.id}:${combat.round}:${combat.turn ?? 0}` : "");
/** Pure: was a use recorded at `seen` (a roundKey) in this creature's current turn-cycle? Outside a combat, or another combat's key: no. */
export function usedThisCycle(combat, actor, seen) {
  if (!combat?.started || !seen) return false;
  const [id, r, t] = String(seen).split(":");
  if (id !== combat.id || !Number.isFinite(Number(r))) return false;
  if (t === undefined) return Number(r) === combat.round;   // a key written before v0.0.431 (the round only)
  const own = (combat.turns ?? []).findIndex(x => (x.actor && actor && (x.actor === actor || x.actor.uuid === actor.uuid)) || (actor?.isToken && x.tokenId === actor.token?.id));
  return turnCycleBlocked(combat.round, combat.turn, own, [Number(r), Number(t)]);
}
