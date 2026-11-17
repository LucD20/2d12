// Run with: node tools/tests/run.mjs (or node tools/tests/t159.mjs)
// v0.0.198 (Lucas): the Basic Actions in 4 groups (2x2), the Frequency column gone, a legend; the movement's squares on the combat strip.
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } }, abstract: { TypeDataModel: class {} } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null };
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
const { basicGroupsOf } = await import(ROOTURL + "module/actor-sheets.mjs");
const names = Object.values(BASIC_ACTIONS).map(a => a.name);
const mapped = TWOD12.basicGroups.flatMap(g => g.names);
console.log("16 mapped:", mapped.length, "| every one is a Basic Action:", mapped.every(n => names.includes(n)), "| Basic Actions not in a group:", JSON.stringify(names.filter(n => !mapped.includes(n))));
const rows = names.map(name => ({ name })).reverse();   // any order in: the groups' order out
console.log(basicGroupsOf(rows).map(g => `${g.label}: ${g.rows.map(r => r.name).join(", ")}`).join(" | "));
console.log("an NPC without Steel Yourself, and a homebrew one:", basicGroupsOf([...rows.filter(r => r.name !== "Steel Yourself"), { name: "Grapple" }]).map(g => `${g.label} ${g.rows.length}`).join(", "));
const src = f => fs.readFileSync(ROOT + f, "utf8"), tpl = src("templates/actor-sheet-pc.hbs"), css = src("styles/system.css");
console.log("the grid and the legend:", tpl.includes('<div class="bx-grid">{{#each basicGroups}}') && tpl.includes('class="bx-legend"'), "| no Frequency column:", css.includes(".twod12.sheet.ns .bx-rows .ar-freq { display: none; }"), "| name / Range / AP / Use:", css.includes("> .ar-range { order: 3;") && css.includes("> .ar-cost { order: 4; }"), "| one column when narrow:", css.includes(".twod12.sheet.ns .bx-grid { grid-template-columns: minmax(0, 1fr); }"));
