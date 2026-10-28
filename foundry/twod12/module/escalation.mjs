// Escalation (Round 10 of the rules): a PC's adrenaline.
//   0 when an encounter starts; +1 at the start of every round after the first, up to 3; not while Unconscious (kept, not spendable).
//   Spent on Escalation Actions (their cost is on top of the AP). Back to 0 when the encounter ends, and every effect that spending it
//   created ends too. NPCs don't have it. A passive needs "Escalation 2 or more": an effect with a minimum Escalation is off below it.
const F = "twod12";
export const ESC_MAX = 3;

/** A creature's Escalation (null: it has none, as NPCs). */
export const escalationOf = actor => (actor?.type === "character" || (actor?.type === "npc" && actor.system?.useEscalation) ? Math.max(0, Math.min(ESC_MAX, Number(actor.system?.escalation) || 0)) : null);   // NPCs: only with Escalation switched on

/** Is this applied effect off because its owner's Escalation is under the effect's minimum (or it is disabled)? */
export function effectOff(actor, e) {
  if (e?.disabled) return true;
  const min = Number(e?.getFlag?.(F, "minEscalation") ?? e?.flags?.[F]?.minEscalation) || 0;
  return min > 0 && (escalationOf(actor) ?? 0) < min;
}

/** Can this creature pay this Escalation cost now? { ok, why }. */
export function canPayEscalation(actor, cost) {
  const n = Number(cost) || 0;
  if (n <= 0) return { ok: true, why: "" };
  const have = escalationOf(actor);
  if (have === null) return { ok: false, why: `${actor?.name ?? "This creature"} has no Escalation (only PCs do).` };
  if (actor.statuses?.has?.("unconscious")) return { ok: false, why: `${actor.name} is Unconscious: Escalation can't be spent.` };
  if (have < n) return { ok: false, why: `${actor.name} has ${have} Escalation; this costs ${n}.` };
  return { ok: true, why: "" };
}

/** Spend it (after the AP). */
export async function spendEscalation(actor, cost) {
  const n = Number(cost) || 0;
  if (n <= 0 || escalationOf(actor) === null) return;
  await actor.update({ "system.escalation": Math.max(0, escalationOf(actor) - n) });
}

/** The round changed: every PC in the combat that isn't Unconscious gains 1, from round 2, up to 3 (once per round, by the GM). */
export async function gainForRound(combat) {
  if (!game.user.isActiveGM || !combat?.started || (combat.round ?? 0) < 2) return;
  if ((combat.getFlag?.(F, "escRound") ?? 0) >= combat.round) return;
  await combat.setFlag?.(F, "escRound", combat.round);
  for (const c of combat.combatants ?? []) {
    const a = c.actor;
    if (escalationOf(a) === null || a.statuses?.has?.("unconscious") || c.defeated) continue;
    const now = escalationOf(a);
    if (now < ESC_MAX) await a.update({ "system.escalation": now + 1 });
  }
}

/** The encounter ended: Escalation back to 0, and the effects that spending it created end. */
export async function resetAfterCombat(combat) {
  if (!game.user.isActiveGM) return;
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (escalationOf(a) === null) continue;
    if (escalationOf(a) > 0) await a.update({ "system.escalation": 0 });
    const ids = [...(a.effects ?? [])].filter(e => e.getFlag?.(F, "fromEscalation")).map(e => e.id);
    if (ids.length) await a.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}

/** An encounter starts: every PC in it starts at 0 (in case one was left over). */
export async function startAtZero(combat) {
  if (!game.user.isActiveGM) return;
  for (const c of combat?.combatants ?? []) if ((escalationOf(c.actor) ?? 0) > 0) await c.actor.update({ "system.escalation": 0 });
}

export function registerEscalationHooks() {
  Hooks.on("combatStart", combat => startAtZero(combat));
  Hooks.on("updateCombat", (combat, changes) => { if ("round" in changes) gainForRound(combat); });
  Hooks.on("deleteCombat", combat => resetAfterCombat(combat));
}
