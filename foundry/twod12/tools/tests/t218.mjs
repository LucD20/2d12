// Run with: node tools/tests/run.mjs (or node tools/tests/t218.mjs)
// v0.0.305 PACK MOD (book, Chapter 5, Weapon, Power and Signature Modifiers; the Bestiary, Attributes and Modifiers): the Modifiers are class values.
// The track (modifiers.mjs classTrack), the compendium's classes, a character's derived Modifiers and Ward Defense by Stage, a class copy from before
// (the Attribute formula until it is updated), the NPC role values (npcMods, npcLead), the rolls without an Attribute (no "Body Rolls" on a Weapon
// roll), and the migration's choice of the lead Modifier (migrater.mjs modLeadOf).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } }, utils: {}, applications: { api: { DialogV2: {} } } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = {};
const { classTrack, npcMods, classModifiers } = await import(ROOTURL + "module/modifiers.mjs");
const { CharacterData, npcLead, npcModRatings, npcModValue } = await import(ROOTURL + "module/data.mjs");
const { rollSource, rollTraits } = await import(ROOTURL + "module/rollsource.mjs");
const { modLeadOf } = await import(ROOTURL + "module/migrater.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const cls = n => C.docs.find(d => d.type === "class" && d.name === n).system;
const sg = n => (n >= 0 ? `+${n}` : `${n}`);
const t = o => { const r = classTrack(o); return `${sg(r.weapon)} / ${sg(r.power)} (Signature ${sg(r.signature)} from ${r.from})`; };

console.log("--- the track (Weapon / Power)");
for (const [name, o] of [["Paladin, sword first", { order: "either", lead: "weapon" }], ["Paladin, faith first", { order: "either", lead: "power" }], ["Archer (fixed Weapon first)", { order: "weapon", lead: "power" }]]) {
  console.log(`${name}: level 1 ${t({ ...o, stage: 1 })} | Stage 2 default ${t({ ...o, stage: 2 })} | Stage 2 +1 to the other ${t({ ...o, stage: 2, stage2: o.lead === "power" && o.order === "either" ? "weapon" : "power" })} | Stage 3 ${t({ ...o, stage: 3 })} | Stage 3 after the other ${t({ ...o, stage: 3, stage2: o.lead === "power" && o.order === "either" ? "weapon" : "power" })}`);
}
console.log("never above +4:", t({ high: 4, low: 3, order: "weapon", stage: 3 }), "| a tie goes to the lead:", t({ order: "either", lead: "power", stage: 2, stage2: "weapon" }));
console.log("--- the compendium's classes");
for (const n of ["Paladin", "Archer"]) { const c = cls(n); console.log(`${n}: high ${c.modHigh}, low ${c.modLow}, order ${c.modOrder} | no Attribute lists: ${!(c.weaponAttrs?.length || c.magicAttrs?.length)}`); }

console.log("--- a character (stubs)");
const mk = (type, system, name = "x") => ({ type, system, name });
const pc = (lv, clsSys) => {
  const s = Object.create(CharacterData.prototype);
  s.level = lv; s.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }; s.rallyUsed = 0; s.exhausted = 0; s.bodyWounds = 0; s.mindWounds = 0; s.healthHigh = "vigor"; s.speciesHigh = "";
  const species = mk("species", { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, pickTwo: true, chosen: ["body", "appeal"], speed: 5, bodyMod: 3, mindMod: 2, pickHealth: true }, "Human");
  const klass = mk("class", { chosenA: "body", chosenB: "mind", ...clsSys }, "Paladin");
  s.parent = { items: [species, klass], type: "character" }; s.parent.itemTypes = { species: [species], class: [klass], feature: [], weapon: [], armor: [] };
  s.prepareDerivedData(); return s;
};
const show = s => `Weapon ${sg(s.weaponMod)}, Power ${sg(s.powerMod)}, Signature ${sg(s.signatureMod)} (${s.signatureFrom}) | WD ${s.wardDC} | Save DCs ${s.saveDC.weapon} / ${s.saveDC.power} | source ${s.modSource}`;
for (const [label, extra] of [["sword-first Paladin", { modPriority: "weapon" }], ["faith-first Paladin", { modPriority: "power" }], ["sword-first, Stage 2 to Power", { modPriority: "weapon", modStage2: "power" }]]) {
  for (const lv of [1, 5, 8]) console.log(`${label}, level ${lv}: ${show(pc(lv, { ...cls("Paladin"), ...extra }))}`);
}
console.log("an Archer, level 1:", show(pc(1, { ...cls("Archer"), modPriority: "power" })));
const old = pc(1, { ...cls("Paladin"), modHigh: 0, modLow: 0, weaponAttrs: new Set(["body", "appeal"]), magicAttrs: new Set(["mind", "appeal"]) });
console.log("a class copy from before (values 0): the Attribute formula until updated:", show(old), `| Weapon Attribute ${old.weaponAttribute}`);

console.log("--- NPCs (the role's values)");
for (const r of ["minion", "grunt", "standard", "elite"]) console.log(`${TWOD12.npcRoles[r].label}: ${TWOD12.npcRoles[r].mods.join(" and ")} | lead Weapon: ${JSON.stringify(npcMods(TWOD12.npcRoles[r].mods, "weapon"))} | lead Power: ${JSON.stringify(npcMods(TWOD12.npcRoles[r].mods, "power"))}`);
console.log("npcLead: set", npcLead({ modLead: "power" }), "| an NPC from before, Mind High as its Power Attribute:", npcLead({ modLead: "", attributes: { body: 0, mind: 2 }, weaponAttribute: "body", powerAttribute: "mind" }), "| a tie:", npcLead({ modLead: "", attributes: { body: 1, mind: 1 }, weaponAttribute: "body", powerAttribute: "mind" }));
console.log("--- v0.0.307: NPC Modifier ratings (Terrible / Low / Medium / High / Extreme)");
for (const r of ["minion", "grunt", "standard", "elite"]) console.log(`${TWOD12.npcRoles[r].label}: ${["terrible", "low", "medium", "high", "extreme"].map(k => sg(npcModValue(r, k))).join(" / ")} | defaults: ${JSON.stringify(npcModRatings({ role: r, modLead: "weapon" }))} | leading with Power: ${JSON.stringify(npcModRatings({ role: r, modLead: "power" }))}`);
console.log("a rating set by the GM wins:", JSON.stringify(npcModRatings({ role: "elite", modLead: "weapon", ratings: { wmod: "high", pmod: "terrible" } })));
const { vsAttribute } = await import(ROOTURL + "module/sheetmodel.mjs");
console.log("--- v0.0.307: Vs. an Attribute = 12 + the Attribute:", [-1, 0, 1, 2, 3, 4].map(v => `${v} -> ${vsAttribute(v)}`).join(", "), "| with a +1 bonus:", vsAttribute(2, 1));
const npcs = C.actors ?? [];
for (const a of npcs.filter(x => ["Grave Wisp"].includes(x.name) || /Goblin|Orc|Ogre/.test(x.name))) console.log(`${a.name}: role ${a.system.role}, leads with ${a.system.modLead}`);

console.log("--- rolls: a class value has no Attribute behind it");
const ps = pc(1, { ...cls("Paladin"), modPriority: "weapon" });
for (const tr of [["weapon", "strike"], ["magic"], ["signature", "weapon"], ["body", "strike"]]) {
  const src = rollSource(ps, { traits: new Set(tr) });
  console.log(`[${tr.join(", ")}]: ${src.kind} ${sg(src.mod)} "${src.label}" attrKey "${src.attrKey}" | sees "body" (Body Rolls): ${rollTraits(new Set(tr), src).has("body")}`);
}
const srcOld = rollSource(old, { traits: new Set(["weapon"]) });
console.log("a class copy from before still reads its Attribute:", srcOld.label, `| Body Rolls: ${rollTraits(new Set(["weapon"]), srcOld).has("body")}`);

console.log("--- the migration: the lead is the Modifier that was higher");
for (const [label, attrs, prio] of [["Body 2, Mind 1, Appeal 0", { body: 2, mind: 1, appeal: 0 }, "weapon"], ["Body 0, Mind 1, Appeal 2 (Weapon kept Appeal)", { body: 0, mind: 1, appeal: 2 }, "weapon"], ["Body 0, Mind 2, Appeal 2", { body: 0, mind: 2, appeal: 2 }, "weapon"], ["Body 1, Mind 3, Appeal 0", { body: 1, mind: 3, appeal: 0 }, "weapon"]]) {
  console.log(`${label}: old copy ${modLeadOf(attrs, { weaponAttrs: new Set(["body", "appeal"]), magicAttrs: new Set(["mind", "appeal"]), modPriority: prio }, "Paladin", classModifiers)} | already updated (no lists) ${modLeadOf(attrs, { modPriority: prio }, "Paladin", classModifiers)}`);
}
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- wiring: the class window's picks", src("module/classwindow.mjs").includes('segBtn("prio"') && src("module/classwindow.mjs").includes('segBtn("s2"') && src("module/classwindow.mjs").includes('upd["system.modStage2"]'),
  "| under the Attribute increases (v0.0.306)", src("module/classwindow.mjs").includes('if (x.kind === "attr" && !modPlaced) { modPlaced = true; return html + modSec; }'),
  "| refresh keeps modStage2", src("module/refresh.mjs").includes('"modStage2"'), "| the migration registered", src("module/twod12.mjs").includes("registerMigrationMod()"),
  "| the Builder's Weapon Mod / Power Mod rows", src("module/pcsheet.mjs").includes('{ title: "Weapon Mod", rows: [wmod]') && src("module/pcsheet.mjs").includes('{ title: "Power Mod", rows: [pmod]'),
  "| the Archer's fixed row", src("module/classwindow.mjs").includes("const fixedRow = level === 1"),
  "| 12 + Attribute in defense.mjs", src("module/defense.mjs").includes("dc = vb + attr;"), "| no DialogV2 in the migration", !src("module/migrater.mjs").split("export async function migrateMod")[1].includes("DialogV2"));
