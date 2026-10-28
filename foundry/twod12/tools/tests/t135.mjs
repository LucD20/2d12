// Run with: node tools/tests/run.mjs (or node tools/tests/t135.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.162: Ward Defense = 11 + Power Modifier + Ward value (no species Ward); an NPC's Armor and Ward Defenses are typed (the Bestiary), its armor items are loot;
// elevation counts in distances; Killer's Focus in the roll dialog; the Marked Quarry mark.
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
const { deriveDefenses } = await import(ROOT + "module/data.mjs");
const D = await import(ROOT + "module/defense.mjs");
const { verticalSquares, withHeight, tokenDistance } = await import(ROOT + "module/light.mjs");
const S = a => new Set(a);
const armorItem = (category, ward = 0) => ({ id: "ar", name: `${category} armor`, system: { category, bonus: 0, ward, worn: true } });
const pc = (powerMod, ward = 0, armor = null, species = { system: { ward: 2 } }) => ({ powerMod, ward, weaponMod: 2, signatureMod: 2, attributes: {}, parent: { type: "character", itemTypes: { armor: armor ? [armor] : [], species: [species] } } });
console.log("--- characters: WD = 11 + Power Modifier + Ward value (a species' old ward is ignored)");
for (const [label, m] of [["Power Modifier +2, no ward", pc(2)], ["Power Modifier +3 (Attribute 4)", pc(3)], ["Power Modifier +1", pc(1)], ["+2, a charm (Ward value 1)", pc(2, 1)], ["+2, worn Warded medium armor (ward 1)", pc(2, 0, armorItem("medium", 1))]]) {
  deriveDefenses(m, "heavy"); console.log(label.padEnd(40), `AD ${m.armorDC} [${m.armorParts.join(" ")}]  WD ${m.wardDC} [${m.wardParts.join(" ")}]`);
}
console.log("--- NPCs: typed Defenses, armor items ignored, never below 11");
for (const [label, sys, items] of [["Standard default", { armorDef: 13, wardDef: 13 }, []], ["knight 14 / 12", { armorDef: 14, wardDef: 12 }, []], ["typed 9 (floor 11)", { armorDef: 9, wardDef: 0 }, []], ["wearing heavy armor (loot)", { armorDef: 12, wardDef: 13 }, [armorItem("heavy", 2)]]]) {
  const m = { ...sys, armor: "medium", attributes: {}, parent: { type: "npc", itemTypes: { armor: items } } }; deriveDefenses(m, "heavy");
  console.log(label.padEnd(30), `AD ${m.armorDC}  WD ${m.wardDC}  armor item used: ${!!m.armorItemId}  untrained: ${m.armorUntrained}`);
}
console.log("--- the DC text in the roll (computeDC uses the actor's Defense and its parts)");
const power = { name: "Judgment", system: { traits: S(["magic"]), vs: "", versions: [] }, getFlag: () => undefined };
const weapon = { name: "Strike", system: { traits: S(["strike", "weapon"]), vs: "", versions: [] }, getFlag: () => undefined };
const p = pc(2); deriveDefenses(p, "heavy");
const n = { armorDef: 14, wardDef: 12, armor: "medium", attributes: {}, parent: { type: "npc", itemTypes: { armor: [] } } }; deriveDefenses(n, "heavy");
for (const [who, sys] of [["Paladin", p], ["Knight NPC", n]]) {
  const t = { name: who, system: sys, itemTypes: { feature: [] }, effects: [] };
  console.log(D.computeDC(power, t, "", { kind: "power" }).note, "|", D.computeDC(weapon, t, "", { kind: "weapon" }).note);
}
globalThis.canvas = { grid: { size: 100 } };   // no scene: 1 grid unit = 1 square
console.log("--- elevation (1 grid unit = 1 square here)");
const tok = (x, y, elevation = 0, width = 1) => ({ document: { x: x * 100, y: y * 100, width, height: width, elevation } });
for (const [label, a, b] of [["next to each other, same height", tok(0, 0), tok(1, 0)], ["same square, 1 up (touching)", tok(0, 0), tok(0, 0, 1)], ["same square, 3 up", tok(0, 0), tok(0, 0, 3)], ["4 away, 4 up", tok(0, 0), tok(4, 0, 4)], ["6 away, 2 up", tok(0, 0), tok(6, 0, 2)], ["size 2 creature, flyer 1 up over it", tok(0, 0, 0, 2), tok(0, 0, 2)]])
  console.log(label.padEnd(38), "vertical", verticalSquares(a, b), "| distance", tokenDistance(a, b));
console.log("withHeight(5, 0) =", withHeight(5, 0), "| withHeight(4, 4) =", withHeight(4, 4), "| withHeight(1, 1) =", withHeight(1, 1));
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("--- wiring");
console.log("squaresBetween adds the height:", src("module/move.mjs").includes("withHeight(best, verticalSquares(a, b))"),
  "| Killer's Focus in the roll dialog:", src("module/actions.mjs").includes('bonusSeen.set("killersFocus"'),
  "| quarry mark on refreshToken:", src("module/archer.mjs").includes('Hooks.on("refreshToken", token => drawQuarryMark(token))'),
  "| species sheet has no Ward input:", !src("templates/item-sheet.hbs").includes("Part of the Ward value"),
  "| SpeciesData has no ward:", !/the species' Ward value/.test(src("module/data.mjs")));
