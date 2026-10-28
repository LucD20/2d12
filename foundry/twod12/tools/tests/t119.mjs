// Run with: node tools/tests/run.mjs (or node tools/tests/t118.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.137: the Favorites rows, the sheet pinned to the window, colored damage amounts, the generators (Not understood, buttons in view, readable preview).
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } }, abstract: { TypeDataModel: class {} } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null }; globalThis.ui = { notifications: {} };
const G = await import(ROOT + "module/genaction.mjs");
const C = await import(ROOT + "module/config.mjs");
const f = { versions: [{ ap: 2, t1: "[B] 1d8 Co", t2: "[B] 2d8 Co; Hindered (EoT); glows faintly", t3: "[B] 3d8 Frost", critical: "Immobilized (EoT)" }, { ap: 3, t1: '"on purpose text"', t2: "1WB, 1d8MCo", t3: "Pushed 2", critical: "the bones rattle" }] };
console.log("Not understood:", JSON.stringify(G.notUnderstood(f)));
console.log("colored amounts:", C.prettyDamage("[B] 1d8 Co + [M] 1[W] + 2d6 Ho").replace(/<i [^>]*><\/i>/g, "").replace(/ data-tooltip="[^"]*"/g, ""));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), ga = src("module/genaction.mjs"), gen = src("module/gen.mjs"), pv = src("module/preview.mjs");
console.log("Favorites: rows like the Actions table", tpl.includes('<div class="atable" data-list="favorites">{{#each favRows}}{{> actrow}}{{/each}}</div>') && sh.includes("favRows: favs.map(id => a.items.get(id))"), "| reorder", sh.includes('.atable[data-list=\\"favorites\\"]'), "| old view switch gone", !tpl.includes('data-action="setView"'));
console.log("sheet pinned to the window:", sh.includes('[["position", "absolute"], ["inset", "0"]') && sh.includes('["scrollbar-gutter", "auto"]'), "| sent-to-chat card colored too:", pv.includes("prettyDamage(esc(dmg))") && pv.includes('class="dtamt"'));
console.log("generators: fixed height, content scrolls, buttons stay", ga.includes('classes: ["twod12-gen"]') && gen.includes('classes: ["twod12-gen"]') && css.includes(".application.twod12-gen .dialog-content { flex: 1 1 auto; min-height: 0; overflow-y: auto;"), "| weapon preview has its own colors", css.includes(".twod12.genw .gw-wcard { background: #fffdf8; color: #1e2430;"), "| Not understood line", ga.includes('<div class="ga-no"></div>'));
