// Health states (v0.0.243, pack R; book, Chapter 4): Bloodied and Strained have no effect by themselves. They are hooks: every creature knows when a
// creature it perceives becomes one, so the system says so in the chat (a system line), and the class's Escalation hooks read them: an "Escalation hook"
// setting on a Feature (Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down; Thrill of the Kill: the mark goes Down, mark.mjs).
// The active GM's client does it after a damage update.
import { allEffects } from "./passives.mjs";
import { effectOff, raiseEscalation, escalationOf, elitePhases } from "./escalation.mjs";
import { tokenDistance } from "./light.mjs";
import { areEnemies } from "./engaged.mjs";
const F = "twod12";

/** Pure: what changed between two states { bloodied, strained, down }: the words to announce ([] when nothing new). */
export function stateChanges(before, after) {
  const out = [];
  if (!before?.bloodied && after?.bloodied) out.push("Bloodied");
  if (!before?.strained && after?.strained) out.push("Strained");
  if (!before?.down && after?.down) out.push("Down");
  return out;
}

/** The Escalation hooks of a creature's Features and Talents that work now: [{ when, range, source }]. */
export function escHooksOf(actor) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const h of e.getFlag(F, "escHooks") ?? []) out.push({ ...h, source: String(e.name ?? "").replace(/^\s*Effect:\s*/i, "") });
  }
  return out;
}

const tokensOf = a => (a?.isToken && a.token ? [a.token.object ?? a.token] : (a?.getActiveTokens?.() ?? []));
/** Are these two creatures allies (the same side by token disposition), and the nearest of their tokens within range squares? */
function allyWithin(hooked, other, range) {
  if (hooked === other) return false;
  const A = tokensOf(hooked), B = tokensOf(other);
  if (!A.length || !B.length) return false;
  for (const a of A) for (const b of B) {
    const da = a.document?.disposition ?? 0, db = b.document?.disposition ?? 0;
    if (da === 0 || db === 0 || areEnemies(a, b)) continue;
    if (!range || tokenDistance(a, b) <= range) return true;   // v0.0.409 (pack F2, Kindled Wrath): range 0 = any ally
  }
  return false;
}

/** A creature became Bloodied or Strained, or went Down: say so, and run the "an ally within N squares" hooks of the creatures in the combat. */
export async function onStateChange(actor, words) {
  if (!words.length) return;
  // v0.0.418 (Lucas, playtest 5, C3, C5): no "is Bloodied / Strained / Down" line any more (the HP bars and the token show it); the hooks still run
  // v0.0.314: Grabbed (an effect that ends with its origin) ends when the holder goes Down
  if (words.includes("Down")) { try { const { endHeldBy } = await import("./conditions.mjs"); await endHeldBy(actor); } catch (e) { console.warn("twod12 | Grabbed", e); } }
  if (words.includes("Down")) { try { await (await import("./areafx.mjs")).endZonesOfOrigin(actor); } catch (e) { console.warn("twod12 | Zones", e); } }   // v0.0.327: a Zone's "Origin goes Down"
  const combat = game.combat;
  if (!combat?.started) return;
  // v0.0.314 (pack AU; book, Elite Escalation): an Elite's phases, +1 Escalation when it becomes Bloodied and when it becomes Strained (once each)
  if (actor.type === "npc" && escalationOf(actor) !== null) for (const ph of elitePhases(words)) await raiseEscalation(actor, ph, { combat, label: `${actor.name} becomes ${ph === "bloodied" ? "Bloodied" : "Strained"} (Elite phase)` });
  // v0.0.426 (the audit): "An ally within N squares becomes Bloodied or goes Down" (Kindled Wrath): not Strained; the name is the ally's (v0.0.418
  // removed the line's own name, and the label read "( is Strained)")
  const ally = words.filter(w => w === "Bloodied" || w === "Down");
  for (const c of ally.length ? combat.combatants : []) {
    const a = c.actor;
    if (!a || a === actor) continue;
    for (const h of escHooksOf(a)) {
      if (h.when !== "allyState") continue;
      if (!allyWithin(a, actor, h.range)) continue;
      await raiseEscalation(a, "hook", { combat, label: `${h.source} (${actor.name} is ${ally.join(" and ")})` });
    }
  }
}

export function registerStateHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options) => {
    if (!["character", "npc"].includes(actor.type) || !foundry.utils.hasProperty(changes, "system.damage")) return;
    options.twod12States = { bloodied: !!actor.system?.bloodied, strained: !!actor.system?.strained, down: !!actor.system?.atZero };
  });
  Hooks.on("updateActor", async (actor, changes, options) => {
    if (!game.user.isActiveGM || !options.twod12States || options.twod12Reset) return;
    const words = stateChanges(options.twod12States, { bloodied: !!actor.system?.bloodied, strained: !!actor.system?.strained, down: !!actor.system?.atZero });
    try { await onStateChange(actor, words); } catch (e) { console.warn("twod12 | health states", e); }
  });
}
