// Run with: node tools/tests/run.mjs (or node tools/tests/t226.mjs)
// v0.0.328 (Lucas on v0.0.327: "I can't open effects anymore"): the item sheet's rules tab (_fxTab) read the Zone's Action before declaring it
// (a ReferenceError: every Effect, Feature and Talent window failed). This runs _fxTab itself, with Foundry stubbed, for every compendium Effect,
// Feature and Talent, and for an Effect placed on the map.
const ROOTURL = new URL("../../", import.meta.url).href;
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
class Base { constructor(o) { this.options = o; } }
globalThis.foundry = deep();
Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)), mergeObject: (a, b) => ({ ...a, ...b }) } });
const api = deep(), sheets = deep(), apps = deep();
api.HandlebarsApplicationMixin = C => C; sheets.ItemSheetV2 = Base; apps.api = api; apps.sheets = sheets; foundry.applications = apps;
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "RegionDocument", "JournalEntry", "Scene", "Application", "FormApplication", "CombatTracker", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.canvas = { ready: true };
globalThis.game = { items: [], packs: [], settings: { get() { return false; } }, user: { isGM: true }, i18n: { localize: s => s } };
globalThis.TWOD12 = { automationRanks: {}, frequencies: {} }; globalThis.fromUuid = async () => null;
const { TwoD12ItemSheet } = await import(ROOTURL + "module/item-sheet.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const { migrateZone } = await import(ROOTURL + "module/settingsmigrate.mjs");
globalThis.game = { items: [], packs: [], settings: { get() { return false; } }, user: { isGM: true }, i18n: { localize: s => s } };   // after the imports (content.mjs sets its own)
const tab = async (type, name, system) => {
  const sh = Object.create(TwoD12ItemSheet.prototype);
  Object.defineProperty(sh, "item", { value: { type, name, system, uuid: `Item.${name}`, getFlag() { return null; } } });
  try { return { html: await sh._fxTab() }; } catch (e) { return { err: `${e.name}: ${e.message}` }; }
};
const counts = {}, fails = [];
for (const d of C.docs.filter(d => ["effect", "feature", "talent"].includes(d.type))) {
  const sys = d.type === "effect" ? migrateZone(JSON.parse(JSON.stringify(d.system))) : d.system;
  const r = await tab(d.type, d.name, sys);
  counts[d.type] = (counts[d.type] ?? 0) + 1;
  if (r.err || !r.html?.includes("fr-")) fails.push(`${d.type} ${d.name}: ${r.err ?? "no tab"}`);
}
console.log("the rules tab renders:", Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", "), "| failures:", fails.length ? fails.join("; ") : "none");
const cg = C.docs.find(d => d.type === "effect" && /Consecrated Ground/.test(d.name) && d.system.where === "map");
console.log("an Effect on the map (Set here):", /<h3>The area/.test((await tab("effect", "Fire", { rules: [], ends: {}, where: "map", zone: { src: "here", shape: "emanation", size: "2" } })).html ?? ""), "| Consecrated Ground on the map:", cg ? /<h3>The area/.test((await tab("effect", cg.name, cg.system)).html ?? "") : "(not on the map in the source)");
