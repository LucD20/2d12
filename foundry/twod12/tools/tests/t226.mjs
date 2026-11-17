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
for (const d of C.allDocs.filter(d => ["effect", "feature", "talent"].includes(d.type))) {
  const sys = d.type === "effect" ? migrateZone(JSON.parse(JSON.stringify(d.system))) : d.system;
  const r = await tab(d.type, d.name, sys);
  counts[d.type] = (counts[d.type] ?? 0) + 1;
  if (r.err || !r.html?.includes("fr-")) fails.push(`${d.type} ${d.name}: ${r.err ?? "no tab"}`);
}
console.log("the rules tab renders:", Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", "), "| failures:", fails.length ? fails.join("; ") : "none");
const cg = C.allDocs.find(d => d.type === "effect" && /Consecrated Ground/.test(d.name) && d.system.where === "map");
console.log("an Effect on the map (Set here):", /<h3>The area/.test((await tab("effect", "Fire", { rules: [], ends: {}, where: "map", zone: { src: "here", shape: "emanation", size: "2" } })).html ?? ""), "| Consecrated Ground on the map:", cg ? /<h3>The area/.test((await tab("effect", cg.name, cg.system)).html ?? "") : "(not on the map in the source)");
// v0.0.329 (Lucas: "effects can't be placed on the map"): Place on the map with no Action (From the Action reads the shape set here), and with one;
// an Effect on a tier (t1, t2, t3) of an Action's Version is a Zone too.
const noAct = (await tab("effect", "Trap", { rules: [], ends: {}, where: "map", zone: { src: "action", shape: "burst", size: "2" } })).html ?? "";
console.log("From the Action, no Action: the shape set here and Place on the map:", /fr-zpv/.test(noAct) && /data-fr="placeZone"/.test(noAct) && /No Action applies this effect yet, so its area is the one below/.test(noAct));
const V = await import(ROOTURL + "module/fxsheet.mjs");
const withAct = V.fxTabHtml({ host: "effect", name: "CG", rules: [], where: "map", canPlace: true, zone: { src: "action" }, ends: {}, zoneAction: { name: "Consecrated Ground", area: "2 / 3 Emanation", dist: "10 sq." } });
console.log("From the Action, with one: its card and Place on the map:", /Area: 2 \/ 3 Emanation/.test(withAct) && /data-fr="placeZone"/.test(withAct));
globalThis.fromUuid = async u => (u === "Z" ? { name: "Fire", uuid: "Z", system: { where: "map", zone: {}, ends: {} } } : { name: "Burning", system: { where: "creature" } });
globalThis.fromUuidSync = () => null;
const { zoneOf } = await import(ROOTURL + "module/zone.mjs");
const zn = await zoneOf([{ fx: { all: [{ uuid: "B" }], t1: [{ uuid: "Z" }] } }]);
console.log("a Zone on a tier:", zn?.zone?.name, [...(zn?.uuids ?? [])].join(","));
// v0.0.330 (Lucas: double-click a Zone to edit its Effect; a test Action whose area deals damage): an edit reaches a placed Zone (its rows, Ends,
// colors; its squares, origin, Action's Area and given rounds stay); the test Action places the test Zone.
const { zoneEdited } = await import(ROOTURL + "module/areafx.mjs");
const placed = { name: "Fire Patch", rows: { ht: { on: true } }, ends: { time: { on: true, mode: "rounds", rounds: 3 } }, cells: ["1,1"], originUuid: "A", originDisposition: -1, area: "1 Emanation", outline: "#e8582a" };
const ed = zoneEdited(placed, { name: "Fire Patch", rows: { ht: { on: true }, diff: { on: true } }, ends: { time: { on: true, mode: "encounter" }, down: { on: true } }, outline: "#3a8ee8" });
console.log("an edit on a placed Zone:", JSON.stringify({ rows: Object.keys(ed.rows), time: ed.ends.time.rounds, down: ed.ends.down.on, cells: ed.cells, origin: ed.originUuid, od: ed.originDisposition, area: ed.area, outline: ed.outline }));
const fp = C.allDocs.find(d => d.name === "Fire Patch (test)"), fz = C.allDocs.find(d => d.name === "Fire Patch (test Zone)");
console.log("the test Action:", fp.folder, fp.system.areaCfg.size, fp.system.areaCfg.shape, "keep", fp.system.areaCfg.keep, "| its Effect is a Zone:", fz.system.where, "|", fz.system.autoHover);
