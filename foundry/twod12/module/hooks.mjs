// v0.0.409 (pack F2, the Paladin's passives): a Feature's small hooks (FeatureData.hooks), read where they act, while the passive works: an
// Escalation passive from its rung (escblock.mjs passiveThreshold: the class section "Escalation 2 / 4 / 6 Ability"), any other always.
//   reactionGuard (Armor of Faith): after a Reaction with these traits is used, its user gains Guard (formula: N + pow)   actions.mjs
//   apCost (Roving Judgment): an Action of this mark kind (Judge) at this AP costs `cost` AP instead                       actions.mjs
//   rapMore (Tireless Vigil): n more Reaction AP (the book: it pays only for [Divine] Reactions: by hand)                  combat.mjs rapMaxOf
//   setupAdvance (Hallowed Stance): once on your turn, an Action with these traits gains "Setup: You Advance N"            actions.mjs
import { passiveThreshold } from "./escblock.mjs";
import { escalationOf } from "./escalation.mjs";

/** Pure: does a hook's passive work at this Escalation (rung 0: always)? */
export const hookOn = (rung, escalation) => !rung || (Number(escalation) || 0) >= rung;
/** The working hooks of this kind on a creature's Features: [{ hook, item }]. */
export function activeHooks(actor, kind) {
  const out = [];
  if (!actor?.items) return out;
  let esc = 0; try { esc = escalationOf(actor); } catch (e) { esc = Number(actor.system?.escalation) || 0; }
  const items = actor.items?.contents ?? (typeof actor.items?.[Symbol.iterator] === "function" ? [...actor.items] : []);   // a Collection, or a list
  for (const it of items) {
    const hooks = it.system?.hooks;
    if (!Array.isArray(hooks) || !hooks.length) continue;
    const rung = it.system?.escalationPassive ? passiveThreshold(it) : 0;
    if (!hookOn(rung, esc)) continue;
    for (const h of hooks) if (h?.kind === kind) out.push({ hook: h, item: it });
  }
  return out;
}
/** Pure: does an Action's trait set have every trait of a hook? */
export const hasTraits = (traits, need = []) => (need ?? []).every(t => traits?.has?.(t) ?? (traits ?? []).includes?.(t));
