// Run with: node tools/tests/run.mjs (or node tools/tests/t152.mjs)
// v0.0.186 (pack C-a): a Talent's Category, Level and Prerequisites as data (talents.mjs), what the class window's Talent picker will check.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).docs, cdoc = (n, t = "action") => CDOCS.find(d => d.name === n && d.type === t);   // v0.0.232 (pack CS): the cards are data (book/cards), read from the built content
import fs from "node:fs";
class Fld { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fld, NumberField: Fld, StringField: Fld, BooleanField: Fld, ArrayField: Fld, SetField: Fld, HTMLField: Fld } }, utils: {} };
const { categoryText } = await import(ROOTURL + "module/config.mjs");
const T = await import(ROOTURL + "module/talents.mjs");
const { TalentData } = await import(ROOTURL + "module/data.mjs");

console.log("--- the head: Category + Level");
console.log([{ group: "combat", category: "Talent", level: 1 }, { group: "mobility", category: "", level: 1 }, { group: "combat", category: "Talent", level: 5 }, { category: "Paladin Feature", level: 1 }].map(categoryText).join(" | "));
console.log("old 'Magic Talent' in the Category:", JSON.stringify(TalentData.migrateData({ category: "Magic Talent" })), "| 'Talent' stays:", JSON.stringify(TalentData.migrateData({ category: "Talent" })));

console.log("--- the Prerequisites line");
const tal = (name, s) => ({ name, type: "talent", system: { level: 1, prereqs: [], prereqMode: "all", ...s } });
const sacred = tal("Sacred Weapon", { prereqs: [{ kind: "talent", name: "Lesser Blessing" }, { kind: "trait", name: "divine" }], prereqMode: "any" });
const expertise = tal("Class Expertise", { level: 5, prereqs: [{ kind: "level", value: 5 }] });
const kick = tal("Kickboxer", { prereqs: [{ kind: "talent", name: "Brawler" }] });
const strong = tal("Iron Grip", { prereqs: [{ kind: "attribute", name: "body", value: 2 }, { kind: "other", name: "a shield in hand" }] });
for (const t of [sacred, expertise, kick, strong]) console.log(`${t.name}:`, T.prereqLine(t.system));
console.log("old free text when there is no list:", JSON.stringify(T.prereqLine({ requirements: "Brawler." })));

console.log("--- can this creature take it?");
const pc = (level, items = [], attributes = {}) => ({ system: { level, attributes }, items });
const act = (name, traits) => ({ type: "action", name, system: { traits: new Set(traits) } });
const show = (who, t) => { const r = T.canTake(who, t); return `${r.ok ? "yes" : "no"}${r.reasons.length ? ` (${r.reasons.join("; ")})` : ""}${r.notes.length ? ` [${r.notes.join("; ")}]` : ""}`; };
const lv1 = pc(1), paladin = pc(1, [act("Smite", ["divine", "strike"])]), blessed = pc(1, [{ type: "talent", name: "Lesser Blessing" }]), brawler = pc(1, [{ type: "talent", name: "Brawler" }]);
console.log("Sacred Weapon: a level 1 nobody", show(lv1, sacred), "| a Paladin ([Divine] Smite)", show(paladin, sacred), "| with Lesser Blessing", show(blessed, sacred));
console.log("Class Expertise: level 1", show(lv1, expertise), "| level 5", show(pc(5), expertise));
console.log("Kickboxer: no Brawler", show(lv1, kick), "| Brawler", show(brawler, kick), "| already a Kickboxer", show(pc(1, [{ type: "talent", name: "Brawler" }, { type: "talent", name: "Kickboxer" }]), kick));
console.log("Iron Grip: Body 1", show(pc(1, [], { body: 1 }), strong), "| Body 2", show(pc(1, [], { body: 2 }), strong));
const content = fs.readFileSync(ROOT + "tools/content.mjs", "utf8"), hbs = fs.readFileSync(ROOT + "templates/item-sheet.hbs", "utf8");
console.log("content: Kickboxer needs Brawler as data", (() => { const k = cdoc("Kickboxer", "talent").system; return k.group === "combat" && k.theme === "Unarmed" && k.prereqs?.[0]?.kind === "talent" && k.prereqs[0].name === "Brawler"; })(), "| the Talent sheet: Category, Theme, rows", hbs.includes('name="system.group"') && hbs.includes('name="system.theme"') && hbs.includes("data-pfield"));
console.log("--- v0.0.187");
const { FeatureData } = await import(ROOTURL + "module/data.mjs");
console.log("a Feature's Escalation Passive box from an old 'Archer Escalation' Category:", FeatureData.migrateData({ category: "Archer Escalation" }).escalationPassive, "| 'Paladin Feature':", FeatureData.migrateData({ category: "Paladin Feature" }).escalationPassive, "| on the sheet:", hbs.includes('name="system.escalationPassive"'));
console.log("Prerequisites as one line of chips joined by and / or:", hbs.includes('class="pq-line"') && hbs.includes('data-action="togglePrereqMode"') && hbs.includes("data-prereqadd"), "| Escalation section always shown with a class:", fs.readFileSync(ROOT + "templates/actor-sheet.hbs", "utf8").includes("No Escalation Passives or Actives yet"));
