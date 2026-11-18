// Run with: node tools/tests/run.mjs (or node tools/tests/t251.mjs)
// v0.0.375 (PACK STYLE-2) tested the one-page NPC sheet here. v0.0.441 (pack SHEETS-HUD; Lucas, 2026-11-18: "no need for one-page sheet since the
// npc one is already better anyway"): it is retired; this test checks that it is gone and that an NPC set to it opens the NPC sheet, and the small
// sheets' sizes, the plate, the stat lines, the tiles and the combat line (the approved mockup foundry/mockups/sheets, "Option 1").
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url)), src = f => fs.readFileSync(ROOT + f, "utf8");
const tw = src("module/twod12.mjs"), as = src("module/actor-sheets.mjs"), tpl = src("templates/actor-sheet-pc.hbs"), sh = src("module/sheets.mjs");
console.log("--- the one-page sheet retired");
console.log("no class:", !as.includes("class NpcStatBlockSheet"), "| not registered:", !tw.includes("registerSheet(Actor, \"twod12\", NpcStatBlockSheet"), "| no setting:", !tw.includes('"npcSheetDefault"'), "| not exported:", !sh.includes("NpcStatBlockSheet"),
  "| the module moved to deprecated:", !fs.existsSync(ROOT + "module/statblock.mjs") && fs.existsSync(ROOT + "../deprecated/module/statblock.mjs"));
console.log("an NPC set to it opens the NPC sheet (its flag cleared by the GM):", tw.includes('a.getFlag?.("core", "sheetClass") !== "twod12.NpcStatBlockSheet"') && tw.includes('a.unsetFlag("core", "sheetClass")'));
console.log("no stat block in the template:", !tpl.includes("statblock"));
console.log("--- the small sheets");
console.log("PC 540 x 840:", as.includes("position: { width: 540, height: 840 }"), "| NPC 540 x 760:", as.includes("position: { width: 540, height: 760 }"));
console.log("the plate: the portrait, the name an input (renamed there), the rank's color:", tpl.includes('class="ps2-port"') && tpl.includes('class="ps-nameinput ps2-name" type="text" name="name"') && tpl.includes('class="ps2-plate rk-{{#if pc.npc}}{{pc.head.roleKey}}{{else}}pc{{/if}}"'));
console.log("its tools: Post stat block (GM, NPC), Roll Initiative (when there is a roll), Senses:", ['data-action="postStatBlock"', 'data-action="rollInitiative"', 'data-action="editSenses"'].every(x => tpl.includes(x)));
console.log("no side panel:", !tpl.includes('<aside class="ps-side'), "| the stat lines: Health, the pools (click: damage), Defenses, Immune / Resist / Weak, Rally and the Wounds:",
  ['data-action="hpEdit"', 'class="ps2-track np-track"', "{{#each pc.defs.main}}", "{{{pc.dmgHtml}}}", 'data-action="setRally"', 'name="system.{{key}}Wounds"'].every(x => tpl.includes(x)));
console.log("the tiles: the Attribute rolls, Vs. under it, the Modifiers with their DC:", tpl.includes('data-action="rollAttr" data-key="{{key}}"') && tpl.includes("<small>Vs. {{vs}}</small>") && tpl.includes("<small>{{dc}}</small>"));
console.log("the Hands with no word, one above the other:", !tpl.includes('<span class="ps-k">Hands</span>') && (tpl.match(/class="ps2-hands"/g) ?? []).length === 2);
console.log("the Wounds' rolls on the Upkeep tab:", tpl.indexOf('data-action="rollTable"') > tpl.indexOf('data-tab="upkeep"'));
