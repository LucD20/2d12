// Run with: node tools/tests/run.mjs (or node tools/tests/t59.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s }, data: { fields: Object.fromEntries(["SchemaField","NumberField","StringField","BooleanField","ArrayField","SetField","HTMLField"].map(n => [n, class {}])) }, abstract: { TypeDataModel: class {} } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined } };
const { CharacterSheet } = await import(ROOT + "module/sheets.mjs");
const sheet = Object.create(CharacterSheet.prototype);
sheet._talentSlots = () => ({ talentSlots: [{ key: "dc:0", talent: { id: "oa" } }, { key: "dc:1", talent: null }] });
const zone = slot => ({ target: { closest: sel => (sel === "[data-slot]" && slot !== undefined ? { dataset: { slot } } : null) } });
console.log("dropped on the empty Divine Connection slot:", sheet._slotFor(zone("dc:1"), { type: "talent" }));
console.log("dropped on the extra zone:", JSON.stringify(sheet._slotFor(zone(""), { type: "talent" })));
console.log("dropped elsewhere on the sheet (first empty slot):", sheet._slotFor(zone(undefined), { type: "talent" }));
console.log("no event (fallback path without target):", sheet._slotFor(null, { type: "talent" }));
console.log("a weapon gets no slot:", JSON.stringify(sheet._slotFor(zone("dc:1"), { type: "weapon" })));
