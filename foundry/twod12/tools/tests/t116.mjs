// Run with: node tools/tests/run.mjs (or node tools/tests/t116.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.133 (new sheet, step 4): the Gear item type and the Items tab.
const src = n => fs.readFileSync(ROOT + n, "utf8");
const sys = JSON.parse(src("system.json")), en = JSON.parse(src("lang/en.json"));
const data = src("module/data.mjs"), main = src("module/twod12.mjs"), grants = src("module/grants.mjs"), isheet = src("templates/item-sheet.hbs"), tpl = src("templates/actor-sheet-pc.hbs"), sh = src("module/actor-sheets.mjs");
console.log("Gear type:", "gear" in sys.documentTypes.Item, en.TYPES?.Item?.gear ?? JSON.stringify(en).includes('"gear": "Gear"'), "| data:", /class GearData[\s\S]*?quantity: int\(1, 0\), weight: num\(\), cost: num\(\)/.test(data), "| registered:", main.includes("gear: GearData") && main.includes('"armor", "gear", "effect"'),
  "| coins on creatures:", data.includes("coins: int(0, 0)"));
console.log("item sheet fields:", ["system.quantity", "system.weight", "system.cost"].every(n => isheet.includes(`name="${n}"`)), "| the same gear dropped again adds to its quantity:", grants.includes('case "gear"') && grants.includes('"system.quantity": (same.system.quantity || 0) + Math.max(1, item.system.quantity || 1)'));
console.log("Items tab: toolbar", ["generateWeapon", "newWeapon", "newGear"].every(k => tpl.includes(`data-action="${k}"`)), "| loadout and lists", tpl.includes('<div class="lo-strip">') && tpl.includes("{{#each weaponRows}}") && tpl.includes("{{#each armorRows}}"), "| Where buttons", tpl.includes('class="lr-seg"') && tpl.includes('data-action="setWhere"'));
console.log("armor: Training gone from the title", !tpl.includes("Training: {{armorTrainingLabel}}"), "| NPC note", tpl.includes("its stat block's Armor is used") || tpl.includes("stat block's Armor is used"), "| gear list: Coins and weight on the line", tpl.includes('name="system.coins"') && tpl.includes("Weight {{gearWeight}}"), "| quantity typed in place", tpl.includes('class="gq"') && sh.includes('"system.quantity": Math.max(0'),
  "| drag to reorder (itemOrder)", (tpl.match(/data-order-flag="itemOrder"/g) || []).length === 3);
