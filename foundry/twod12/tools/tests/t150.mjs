// Run with: node tools/tests/run.mjs (or node tools/tests/t150.mjs)
// v0.0.185 (pack C2): the Foundry side of the class levels, with stand-ins: the Class tab's sections (granted Features, picks by section,
// the levels not reached), the Talent slots of the Talent sections, the window's tile lines, and the wiring (drop, Level change, sheets).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: {} };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: {} }; globalThis.ui = { notifications: {} };
const W = await import(ROOTURL + "module/classwindow.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");

// A level 2 Paladin built like the compendium's (its items carry classLevel and classSection).
const pc = JSON.parse(fs.readFileSync(ROOT + "packs/_source/pcs/aveline-human-paladin-smite.pc.json", "utf8"));
const mkItems = list => list.map(i => ({ ...i, id: i._id, getFlag: (s, k) => i.flags?.twod12?.[k] }));
const actorOf = (level, items) => { const its = mkItems(items); return { type: "character", system: { level }, items: Object.assign(its, { get: id => its.find(i => i.id === id) }), itemTypes: { class: its.filter(i => i.type === "class") } }; };
const a1 = actorOf(1, pc.items), cls = a1.itemTypes.class[0];
console.log("the compendium Paladin's class copy:", cls.system.chosenAttrs.join(", "), "| picks:", Object.keys(cls.flags.twod12.classPicks[1]).join(", "));
const tab = W.classTabSections(a1, cls);
console.log("Class tab, level 1: granted", tab.granted.map(g => g.it.name).join(", "), "| picks", tab.picks.map(p => `${p.title}: ${p.items.map(i => i.name).join(", ")}`).join(" | "), "| not reached", tab.locked.map(l => `${l.title} (${l.level})`).join(", "));
console.log("Talent slots at level 1:", JSON.stringify(W.classTalentSlots(a1)), "| Heavy Blows is in it:", pc.items.find(i => i.name === "Heavy Blows")?.flags.twod12.slot);
const a3 = actorOf(3, pc.items);
console.log("at level 3 (nothing chosen yet): slots", W.classTalentSlots(a3).map(s => s.feature).join(", "), "| not reached:", W.classTabSections(a3, a3.itemTypes.class[0]).locked.length);
console.log("hasLevels: the compendium classes", C.docs.filter(d => d.type === "class").map(d => `${d.name} ${W.hasLevels(d)}`).join(", "), "| a class without levels:", W.hasLevels({ system: { levels: [] } }));

console.log("--- the tiles' meta lines");
const doc = n => { const d = C.docs.find(x => x.name === n && ["action", "feature", "talent"].includes(x.type)); return { ...d, uuid: n }; };
for (const n of ["Smite", "Bulwark of Faith", "Divine Surge", "Font of Mercy", "Divine Power", "Heavy Blows", "Aim"]) console.log(`${n}:`, W.itemInfo(doc(n)).meta);

console.log("--- the wiring");
const g = src("module/grants.mjs"), main = src("module/twod12.mjs"), win = src("module/classwindow.mjs"), sheet = src("module/actor-sheets.mjs"), is = src("module/item-sheet.mjs"), tpl = src("templates/item-sheet.hbs");
console.log("a class with levels dropped on a character opens the window:", g.includes("if (s.levels?.length && actor.type === \"character\") return dropClassLevels(actor, item);"), "| the old dialogs stay for a class without levels:", g.includes("const picks = await classChoices(item);"));
console.log("the Level before a change is kept:", main.includes('options.twod12FromLevel = actor.system.level'), "| the window runs on a change, the old grant without levels:", main.includes("classLevelChange(actor, options.twod12FromLevel, actor.system.level).then(done => { if (!done) grantClassFeatures(actor); });"));
console.log("Cancel on a level up puts the Level back:", win.includes('await actor.update({ "system.level": l - 1 }, { twod12Class: "skip" });'), "| a lower Level asks, then removes what the higher levels gave:", win.includes("Going down to level") && win.includes("deleteEmbeddedDocuments(\"Item\", gone.map(i => i.id))"), "| No keeps the Level:", win.includes('return actor.update({ "system.level": from }, { twod12Class: "skip" });'));
console.log("nothing applied before confirm (drop):", win.indexOf("const res = await chooseLevel({ name: item.name") < win.indexOf("for (const old of actor.itemTypes.class) await old.delete();"), "| confirm disabled until complete:", win.includes('data-confirm${m.complete ? "" : " disabled"}'), "| buttons:", win.includes("`Add ${esc(name)} to sheet`") && win.includes("`Level up to ${level}`"));
console.log("the sheet reads the sections:", sheet.includes("const t = classTabSections(this.actor, cls);") && sheet.includes("for (const sl of classTalentSlots(a))"));
console.log("Class Details: the Levels button", tpl.includes('data-action="editLevels"'), "| Repertoire and Escalation drop zones", tpl.includes('data-list="repertoire"') && tpl.includes('data-list="escalation"'), "| Modifier values and order (pack MOD)", tpl.includes('name="system.modHigh"') && tpl.includes('name="system.modOrder"') && tpl.includes('name="system.modStage2"'), "| the old Features list only when there is one", tpl.includes("{{#if featuresList.length}}"));
