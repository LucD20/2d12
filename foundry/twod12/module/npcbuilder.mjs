// The NPC Builder tab's helpers (v0.0.163; the cleanup audit, 2026-11-26: the old Builder model, npcBuilderContext, computed on every NPC sheet and
// rendered by nothing since v0.0.291, is removed: the tab is pcsheet.mjs npcBuilderModel). Left: the Stage label, the CV tooltip, a rating switch.
import { TWOD12 } from "./config.mjs";

import { diceFor } from "./sheetmodel.mjs";   // v0.0.308: moved to sheetmodel.mjs (pure; the Builder tab uses it too)
export { diceFor };

/** "Stage 2 (levels 5-7)". */
export const stageLabel = n => { const st = TWOD12.stages.find(x => x.n === Number(n)) ?? TWOD12.stages[0]; return `Stage ${st.n} (levels ${st.from}-${st.to})`; };
/** The CV tooltip (v0.0.181): a normal fight is CV 100 a PC; an NPC of an earlier Stage than the party counts for less. */
export const cvTip = role => `Combat Value: what it counts for in an encounter. A normal fight is CV 100 a PC (75 easy, 125 hard, 150 deadly). `
  + `Against a party of its Stage: ${role.cv[0]}; one Stage above it: ${role.cv[1]}; two Stages above it: ${role.cv[2]}`;

/** What a rating switch writes: the rating, and when it becomes Custom, the number it showed (so nothing jumps). */
export function ratingUpdate(actor, key, rating) {
  const s = actor.system, upd = { [`system.ratings.${key}`]: rating };
  if (rating !== "custom") return upd;
  if (key in TWOD12.attributes) upd[`system.custom.${key}`] = s.attributes?.[key] ?? 0;
  else if (key === "bodyHm") upd["system.custom.bodyHealth"] = s.bdt ?? 0;
  else if (key === "mindHm") upd["system.custom.mindHealth"] = s.mdt ?? 0;
  else if (key === "ad") upd["system.armorDef"] = s.armorDC ?? 13;
  else if (key === "wd") upd["system.wardDef"] = s.wardDC ?? 13;
  else if (key === "speed") upd["system.speed"] = s.speed ?? 5;
  return upd;
}
