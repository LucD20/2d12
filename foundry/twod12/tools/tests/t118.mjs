// Run with: node tools/tests/run.mjs (or node tools/tests/t118.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.136 (new sheet, step 6): the NPC stat block, the NPC toolbar and Features tab, Generate Action (written like the card) and Generate Weapon.
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } }, abstract: { TypeDataModel: class {} } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null }; globalThis.ui = { notifications: {} };
const G = await import(ROOTURL + "module/genaction.mjs");
const W = await import(ROOTURL + "module/gen.mjs");
const show = t => { const r = G.parseCardTier(t); return `${JSON.stringify(t)} -> ${r.insts.map(i => `${i.useW ? `${i.wCount}[W]` : i.useAt ? "[At]" : i.dice}${i.subtype ? ` ${i.subtype}` : ""} to ${i.pool}`).join(" + ") || "no damage"}${r.text ? ` | text: ${r.text}` : ""}`; };
console.log("--- tiers written like the card (and the old short codes)");
for (const t of ["[B] 1d8 Co", "[B] 2d8 Co; Hindered (EoT)", "1[W]", "[B] 2[W] Sl + [M] 1d6 Ho", "[At]", "[M] 2d6 Ho; Prone", "1WB, 1d8MCo", "1d4+2", "Pushed 2", "[B] 1d8 Cold; Appeal Save", "nonsense words", ""]) console.log(show(t));
console.log("--- a whole Action");
const sys = G.actionFromForm({ name: "Grave Chill", traits: ["power", "ranged"], frequency: "encounter", reaction: false, targets: "One creature", distance: "5 squares",
  versions: [{ ap: "2", t1: "[B] 1d8 Co", t2: "[B] 2d8 Co; Hindered (EoT)", t3: "[B] 3d8 Co; Hindered (EoT)", critical: "Immobilized (EoT)", effects: "" }, { ap: "3", t1: "", t2: "", t3: "", critical: "", effects: "Pushed 2" }] });
console.log("versions:", sys.versions.map(v => `${v.ap}AP noTiers ${v.noTiers} T1 ${v.t1.length} T2 ${v.t2.length}+"${v.x2}" T3 ${v.t3.length}+"${v.x3}" crit "${v.critical}" effects "${v.effects}"`).join(" | "), "| traits", sys.traits.join(","), sys.frequency, sys.targets, sys.distance);
console.log("Understood:", G.understood(sys));
console.log("back to the card's writing:", [1, 2, 3].map(n => JSON.stringify(G.tierCardText(sys.versions[0], n))).join(" "));
console.log("--- Generate Weapon: what it understood");
for (const t of ["rusty greatsword: two-handed, melee, slash, range 1, 0/1d8/2d6", "crossbow, reload, two-handed pierce, ranges 10/20/40, 0/1d4+2/1d10+2", "dagger: melee, thrown 4/8/12, pierce, 0/1d4/1d6", "club, blunt, sparkly, 0/1d6"]) {
  const sm = W.weaponSummary(W.parseWeaponText(t));
  console.log(`${t}\n   understood: ${sm.chips.join(" | ")}\n   not understood: ${sm.unknown.join(", ") || "nothing"}${sm.missing.length ? ` | ${sm.missing.join("; ")}` : ""}\n   card: Use ${sm.use} | Damage ${sm.damage}`);
}
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet-pc.hbs"), sh = src("module/actor-sheets.mjs"), gen = src("module/gen.mjs"), isheet = src("module/item-sheet.mjs");
console.log("--- the NPC sheet: stat block", ["system.level", "system.weaponAttribute", "system.powerAttribute", "system.armor"].every(n => tpl.includes(`name="${n}"`)) && tpl.includes('data-action="setRole"'), "| Tags as chips with + and ×", tpl.includes('data-action="removeTag"') && tpl.includes('<select class="tagadd"'),
  "| header Level as text (one Level field)", tpl.includes("{{else}}<span>Level {{system.level}}</span>{{/if}}"), "| toolbar", tpl.includes('data-action="generateAction"') && tpl.includes('data-action="browseCompendium"'), "| Features tab for NPCs", tpl.includes('<div class="fsec"><span>Features</span></div>') && !tpl.includes("feat.archetypes") && !tpl.includes('{{#if isPc}}<a class="tabbtn" data-action="switchTab" data-tab-target="class">'));
console.log("Generate Action from the NPC and from an Action's sheet:", sh.includes("openActionGenerator({ actor: this.actor })") && isheet.includes("openActionGenerator({ item: this.item })"), "| Weapon buttons", gen.includes('["world", "Create in the world"]') && gen.includes('["give", `Give to ${actor.name}`]') && gen.includes('[["update", `Update ${item.name}`]]'));
console.log("v0.0.135 fixes: no room around the sheet (inline !important)", sh.includes('el.style.setProperty("padding", "0", "important")'), "| no Grants word", !tpl.includes(">Grants</div>"));
