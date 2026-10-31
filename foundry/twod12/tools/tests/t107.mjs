// Run with: node tools/tests/run.mjs (or node tools/tests/t107.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.119: Armor items (one worn at a time; the worn one gives the Armor and adds its Ward), the sidebar numbers in three rows.
globalThis.Hooks = { on() {} };
const { setWorn } = await import(ROOTURL + "module/armor.mjs");
const mk = (id, worn) => ({ id, system: { worn } });
const items = [mk("leather", true), mk("plate", false), mk("mail", false)];
let sent = null;
const actor = { itemTypes: { armor: items }, updateEmbeddedDocuments: async (t, u) => { sent = u; } };
items.forEach(i => { i.parent = actor; });
await setWorn(items[1], true); console.log("wear the plate:", JSON.stringify(sent));
await setWorn(items[1], false); console.log("take it off:", JSON.stringify(sent));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const data = src("module/data.mjs"), sys = JSON.parse(src("system.json"));
console.log("item type:", "armor" in sys.documentTypes.Item, "| pack label:", sys.packs.find(p => p.name === "weapons").label, "| ArmorData fields:", ["category: choice(", "bonus: sint(0), ward: int(0, 0)", "worn: bool()"].every(k => data.includes(k)));
console.log("Defenses use the worn armor:", data.includes("find(i => i.system.worn)"), "| a character without one is Unarmored, an NPC uses its stat block:", data.includes('(npc ? m.armor : "unarmored")'), "| an NPC's Defenses are typed (v0.0.162):", data.includes("m.armorDC = Number(m.armorDef) || 0"));
const tpl = src("templates/actor-sheet.hbs");
console.log("sheet: armor cards with a Worn switch:", tpl.includes('{{#each armorRows}}') && tpl.includes('class="lr-seg"'), "| rows:", tpl.includes("{{#each panel}}"), "| no separate Armor/Ward row:", !tpl.includes("sb-def"), "| NPC Armor type choice:", tpl.includes('name="system.armor">{{selectOptions armorTypeChoices'), "| NPC Speed only in the Builder tab (a typed Speed is its Custom input), no Size field (v0.0.164):", !tpl.includes('name="system.speed"') && fs.readFileSync(ROOT + "module/npcbuilder.mjs", "utf8").includes('name: "system.speed"') && !tpl.includes('name="system.size"'), "| editable cells:", tpl.includes('data-edit="{{edit}}" data-base="{{base}}"'));
const sh = src("module/actor-sheets.mjs");
console.log("cells: current vs base colored:", sh.includes('cls: now < ref ? "down" : now > ref ? "up" : ""'), "| what each edit saves:", ['speed: { "system.speed"', 'size: { "system.size"', 'reach: { "system.reachBase"'].every(k => sh.includes(k)) && !sh.includes('"system.armorDef": Math.max') && ['speed: { "system.speed"'].every(k => sh.includes(k)), "| bonuses from effects shown:", sh.includes('defenseBonus(a, "armor", none)'));
const arm = n => JSON.parse(src(`packs/_source/weapons/${n}.armor.json`)).system;
console.log("compendium:", ["light-armor", "medium-armor", "heavy-armor"].map(n => `${n} ${arm(n).category}`).join(", "));
const pcs = n => JSON.parse(src(`packs/_source/pcs/${n}.pc.json`));
for (const n of ["paladin-1-smite-heavy-blows", "paladin-3-lay-on-hands-protector", "archer-1-double-shot-marksman", "archer-3-rolling-shot-kickboxer"]) { const a = pcs(n); const w = a.items.filter(i => i.type === "armor"); console.log(`${a.name} wears:`, w.map(i => `${i.name} (worn ${i.system.worn})`).join(", ")); }
console.log("v0.0.121: titled groups:", tpl.includes('<h3>{{title}}{{#if note}}') && ['title: "Movement"', 'title: "Modifiers"', 'title: "Defenses"'].every(k => sh.includes(k)), "| Enter with the same number closes the box:", sh.includes("if (upd && v !== Number(cell.dataset.base)) await this.actor.update(upd);") && sh.includes("this.render();   // an unchanged number"));
