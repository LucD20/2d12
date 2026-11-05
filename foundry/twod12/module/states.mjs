// Health states (v0.0.243, pack R; book, Chapter 4): Bloodied and Strained have no effect by themselves. They are hooks: every creature knows when a
// creature it perceives becomes one, so the system says so in the chat (a system line), and the class's Escalation hooks read them: an "Escalation hook"
// setting on a Feature (Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down; Thrill of the Kill: the mark goes Down, mark.mjs).
// The active GM's client does it after a damage update.
import { allEffects } from "./passives.mjs";
import { effectOff, raiseEscalation } from "./escalation.mjs";
import { tokenDistance } from "./light.mjs";
import { areEnemies } from "./engaged.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
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
    if (tokenDistance(a, b) <= range) return true;
  }
  return false;
}

/** A creature became Bloodied or Strained, or went Down: say so, and run the "an ally within N squares" hooks of the creatures in the combat. */
export async function onStateChange(actor, words) {
  if (!words.length) return;
  const name = esc(actor.name);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-heart-crack", `<b>${name}</b> is <b>${words.join("</b> and <b>")}</b>.${words.includes("Down") ? "" : " (No effect by itself: a hook for cards.)"}`, "statemsg") });
  const combat = game.combat;
  if (!combat?.started) return;
  for (const c of combat.combatants) {
    const a = c.actor;
    if (!a || a === actor) continue;
    for (const h of escHooksOf(a)) {
      if (h.when !== "allyState") continue;
      if (!allyWithin(a, actor, h.range)) continue;
      await raiseEscalation(a, "hook", { combat, label: `${h.source} (${name} is ${words.join(" and ")})` });
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
