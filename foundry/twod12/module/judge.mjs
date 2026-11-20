// The Paladin's Judge (pack F2, v0.0.409; book, the Paladin: Judge). Judge marks a creature (mark.mjs, the mark's kind "judge"): it is Judged by
// the Paladin until the encounter ends or it goes Down. A creature Judged by you counts as Profane for you (Smite's d8s, Word of Radiance's
// d8s, every "Profane" rule of yours); the first time each round it damages an ally within 5 squares of you, that damage is reduced by your
// Power Modifier (damage.mjs applyToActor). Weight of Judgment (Escalation 4) takes 2 from its Speed (data.mjs, to a minimum of 1).
import { markOf, isMarked } from "./automation.mjs";
import { tagChoices } from "./config.mjs";
import { turnCycleBlocked } from "./usage.mjs";
const F = "twod12";
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

/** Pure: Smite's dice (book, Smite): 1 a point of Escalation, up to 4, plus the extra ones (Tier 3's, the Reaction AP's); d8s against a Profane creature. */
export const smiteDice = (escalation, extra = 0, profane = false) => `${Math.min(4, Math.max(0, Math.trunc(Number(escalation) || 0))) + Math.max(0, Math.trunc(Number(extra) || 0))}d${profane ? 8 : 6}!`;
/**
 * Pure: a Version's dice under its dice rule (data.mjs diceRule). "smite": a written "Nd6!" is Smite's dice with N - 1 extra (Tier 1 and 2 write
 * 1d6!, Tier 3 2d6!), plus 1 with the Reaction AP spent; "profane": its d6s are d8s against a Profane creature (Word of Radiance). Other dice stay.
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
/** v0.0.419: asks the judge's player (the pick bar, on their client) whether to reduce this damage. The tests (no DOM): yes. */
async function askJudge(judge, src, target, by) {
  try {
    const { askOwner } = await import("./ccdamage.mjs");
    const name = s => String(s?.name ?? "").replace(/[<>&"]/g, "");
    const pick = await askOwner(judge, `<b>Judge</b> (${name(judge)}): ${name(src)}, Judged by you, damages ${name(target)}. Reduce that damage by ${by} (once each round)?`,
      [{ id: "no", label: "Not now" }, { id: "yes", label: `Reduce by ${by}` }]);   // v0.0.421 (the audit): dismissed or no answer: not reduced (the use is kept)
    return pick === "yes";
  } catch (e) { return true; }
}
/**
 * Before damage lands on `actor` (damage.mjs): the Paladins near it whose Judged creature is dealing it. The first time each round the Judged
 * creature damages an ally within 5 squares of its judge, the judge can reduce that damage by its Power Modifier (v0.0.419: asked). Returns [{ judge, by }].
 */
export async function judgeReductions(actor, from) {
  if (!from?.uuid || !globalThis.canvas?.tokens) return [];
  let src = null;
  try { src = actorOf(await fromUuid(from.uuid)); } catch (e) { src = null; }
  if (!src) return [];
  const me = actor.getActiveTokens?.()[0] ?? null;
  if (!me) return [];
  const { tokenDistance } = await import("./light.mjs");
  const key = roundKey(game.combat), out = [];
  for (const t of canvas.tokens.placeables) {
    const j = t.actor;
    if (!j || j.uuid === actor.uuid || !isJudgedBy(j, src)) continue;
    if (Number(t.document.disposition) !== Number(me.document.disposition)) continue;   // the judge's ally
    if (tokenDistance(t, me) > 5) continue;
    // v0.0.463 (Lucas: "Judge damage reduction doesnt respect line of effect"; the book: Line of Effect for every effect): no line from the judge to
    // the ally, no reduction (and no question)
    try { const { coverBetween } = await import("./cover.mjs"); if (coverBetween(t, me)?.noLoE) continue; } catch (e) { /* no walls to read: as before */ }
    const seen = j.getFlag?.(F, "judgeRound") ?? "";
    if (key && usedThisCycle(game.combat, j, seen)) continue;   // the first time each round (per the judge's turn-cycle: v0.0.431)
    const by = Math.max(0, Number(j.system?.powerMod) || 0);
    if (!by) continue;
    // v0.0.419 (Lucas, playtest 5: "allow the Paladins to decide if the attack is reduced or not"): the judge's player chooses; declined, the
    // once-a-round is kept for a later damage this round
    if (!(await askJudge(j, src, actor, by))) continue;
    if (key) { try { if (j.isOwner) await j.setFlag(F, "judgeRound", key); else game.socket?.emit("system.twod12", { type: "setFlag", actorUuid: j.uuid, key: "judgeRound", value: key }); } catch (e) { /* not kept */ } }
    out.push({ judge: j, by });
  }
  return out;
}
