// Escalation (v0.0.243, pack R; book, Chapter 2): a PC's adrenaline, a LEVEL from 1 to 3 that is never spent.
//   1 when an encounter starts (2 with Momentum, a party switch the GM sets after a hard fight; the encounter uses it up); +1 at the start of every
//   round after the first (not while Unconscious: the level is kept); +1 once an encounter on a Critical on one of the creature's Actions, and once an
//   encounter on the class's hook (an "Escalation hook" setting on a Feature: Kindled Wrath, Thrill of the Kill); at most 3 (a Critical or a hook at 3
//   does nothing and isn't used up). Back to 1 when the encounter ends. The Escalation Passives work while the level is at least theirs; the Apex (an
//   Action with Escalation 3) can be used while it is 3 and spends nothing. NPCs have none, except an Elite (the NPC sheet's switch: it starts at 1 and
//   gains 1 a round like a PC; its phases, Bloodied and Strained, are by hand until R-Foundry 2).
import { TWOD12 } from "./config.mjs";
import { unset } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
const F = "twod12";
export const ESC_MAX = TWOD12.escalation.max, ESC_MIN = TWOD12.escalation.min, ESC_MOMENTUM = TWOD12.escalation.momentum;

/** A creature's Escalation (null: it has none, as NPCs). */
export const escalationOf = actor => (actor?.type === "character" || (actor?.type === "npc" && actor.system?.useEscalation) ? Math.max(0, Math.min(ESC_MAX, Number(actor.system?.escalation) || 0)) : null);   // NPCs: only with Escalation switched on

/** Is this applied effect off because its owner's Escalation is under the effect's minimum (or it is disabled)? */
export function effectOff(actor, e) {
  if (e?.disabled) return true;
  const min = Number(e?.getFlag?.(F, "minEscalation") ?? e?.flags?.[F]?.minEscalation) || 0;
  return min > 0 && (escalationOf(actor) ?? 0) < min;
}

/** Can this creature use an Action that needs this Escalation now? { ok, why }. Nothing is spent: the level is a requirement. */
export function canPayEscalation(actor, cost) {
  const n = Number(cost) || 0;
  if (n <= 0) return { ok: true, why: "" };
  const have = escalationOf(actor);
  if (have === null) return { ok: false, why: `${actor?.name ?? "This creature"} has no Escalation (only PCs and Elites do).` };
  if (have < n) return { ok: false, why: `${actor.name} is at Escalation ${have}; this needs Escalation ${n}.` };
  return { ok: true, why: "" };
}

/** Momentum (book, Chapter 2): the party starts the next encounter at Escalation 2; that encounter uses it up (a world setting the GM switches). */
export const hasMomentum = () => { try { return !!game.settings.get(F, "momentum"); } catch (e) { return false; } };
export async function setMomentum(on) { try { await game.settings.set(F, "momentum", !!on); } catch (e) { /* not registered yet */ } }
export function registerMomentumSetting() {
  game.settings.register(F, "momentum", { name: "Momentum", hint: "After an encounter harder than easy, the party has Momentum: every PC starts the next encounter at Escalation 2. That encounter (or a Rest) uses it up.", scope: "world", config: true, type: Boolean, default: false });
}

/** Pure: the level an encounter starts at. */
export const startLevel = momentum => (momentum ? ESC_MOMENTUM : ESC_MIN);
/** Pure: the level after a raise (a Critical, a hook, the GM's valve): one more, at most 3. */
export const raised = (now, by = 1) => Math.max(0, Math.min(ESC_MAX, (Number(now) || 0) + (Number(by) || 0)));

/** The round changed: every creature with Escalation in the combat that isn't Unconscious gains 1, from round 2, up to 3 (once per round, by the GM). */
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

/**
 * A raise outside the rounds: "crit" (a Critical on one of the creature's Actions) or "hook" (its class's hook), each once an encounter; "gm" (the
 * GM's valve) as often as the GM wants. At 3 nothing happens and the once isn't used up. Says so in the chat (sysmsg.mjs). Returns the new level, or null.
 */
export async function raiseEscalation(actor, why = "gm", { combat = globalThis.game?.combat ?? null, label = "" } = {}) {
  const now = escalationOf(actor);
  if (now === null) return null;
  const once = why === "crit" || why === "hook";
  const used = actor.getFlag?.(F, "escUsed") ?? {};
  if (once && combat?.id && used[why] === combat.id) return null;   // already this encounter
  if (now >= ESC_MAX) return null;   // does nothing and isn't used up
  const to = raised(now, 1);
  const upd = { "system.escalation": to };
  if (once && combat?.id) upd[`flags.${F}.escUsed.${why}`] = combat.id;
  await actor.update(upd);
  try { await Hooks.callAll?.("twod12.escalationChanged", actor); } catch (e) { console.warn("twod12 | the rung's effects", e); }   // v0.0.249: the rung's effects (twod12.mjs listens)
  try {
    const { sysLine } = await import("./sysmsg.mjs");
    const { esc } = await import("./util.mjs");
    const what = why === "crit" ? "A Critical" : why === "hook" ? (label || "The class hook") : (label || "The GM");
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-fire", `${esc(what)}: <b>${esc(actor.name)}</b>'s Escalation rises to <b>${to}</b>${once ? " (once an encounter)" : ""}.`, "escmsg") });
  } catch (e) { console.warn("twod12 | Escalation line", e); }
  return to;
}

/** The encounter ended: Escalation back to 1, the effects it created end, the Guards end (v0.0.181; the AP Guard too, v0.0.243). */
export async function resetAfterCombat(combat) {
  if (!game.user.isActiveGM) return;
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (!a) continue;
    const g = {};
    if (a.system?.guard > 0) g["system.guard"] = 0;
    if (a.system?.apGuard > 0) g["system.apGuard"] = 0;
    if (Object.keys(g).length) await a.update(g);
    if (escalationOf(a) === null) continue;
    if (escalationOf(a) !== ESC_MIN) await a.update({ "system.escalation": ESC_MIN });
    if (a.getFlag?.(F, "escUsed")) await a.unsetFlag(F, "escUsed");
    const ids = [...(a.effects ?? [])].filter(e => e.getFlag?.(F, "fromEscalation")).map(e => e.id);
    if (ids.length) await a.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}

/** An encounter starts: every creature with Escalation starts at 1 (2 with Momentum, which is used up); the once-an-encounter raises are free again. */
export async function startAtOne(combat, { momentum = hasMomentum() } = {}) {
  if (!game.user.isActiveGM) return;
  const lv = startLevel(momentum);
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (escalationOf(a) === null) continue;
    const to = a.type === "npc" ? ESC_MIN : lv;   // an Elite has no Momentum
    const upd = {};
    if (escalationOf(a) !== to) upd["system.escalation"] = to;
    if (a.getFlag?.(F, "escUsed")) Object.assign(upd, unset(`flags.${F}.escUsed`));
    if (Object.keys(upd).length) await a.update(upd);
    try { await Hooks.callAll?.("twod12.escalationChanged", a); } catch (e) { console.warn("twod12 | the rung's effects", e); }   // v0.0.249: Radiant Zeal at Escalation 1 from the start (twod12.mjs listens)
  }
  if (momentum) {
    await combat?.setFlag?.(F, "momentumStart", true);   // v0.0.289 (PACK SHEET): the strip's Momentum badge
    await setMomentum(false);
    try {
      const { sysLine } = await import("./sysmsg.mjs");
      await ChatMessage.create({ content: sysLine("fa-fire", `<b>Momentum</b>: the party starts this encounter at Escalation <b>${lv}</b>. It is used up.`, "escmsg") });
    } catch (e) { /* no chat */ }
  }
}

/** The GM's valve (a console tool, game.twod12.escalation(delta, actors)): every PC in the combat (or the given creatures) gains delta Escalation (or loses). */
export async function escalationAll(delta = 1, actors = null) {
  const list = actors ?? [...(game.combat?.combatants ?? [])].map(c => c.actor).filter(a => a?.type === "character");
  for (const a of list) {
    if (escalationOf(a) === null) continue;
    if (delta > 0) await raiseEscalation(a, "gm", { label: "The GM's valve" });
    else { const to = raised(escalationOf(a), delta); if (to !== escalationOf(a)) await a.update({ "system.escalation": Math.max(ESC_MIN, to) }); }
  }
}

export function registerEscalationHooks() {
  Hooks.on("combatStart", combat => startAtOne(combat));
  Hooks.on("updateCombat", (combat, changes) => { if ("round" in changes) gainForRound(combat); });
  Hooks.on("deleteCombat", combat => resetAfterCombat(combat));
}
