// Run with: node tools/tests/run.mjs (or node tools/tests/t158.mjs)
// v0.0.195 (pack C-c): the class window's Talent filter bar, and movement-only Actions through the banner (no card, one line at the end).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => true }, user: { getFlag: () => undefined }, combat: null };
const A = await import(ROOTURL + "module/actions.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
console.log("--- movement-only Actions (the banner) and the others (their card)");
const traits = t => new Set(t);
const basic = k => ({ it: { traits: traits(BASIC_ACTIONS[k].traits) }, vs: BASIC_ACTIONS[k].versions });
for (const k of ["advance", "safeMovement", "crawl", "stand", "charge", "relocate"]) {
  const { it, vs } = basic(k);
  console.log(`${BASIC_ACTIONS[k].name}:`, vs.map(v => JSON.stringify(A.pureMove(it, v, k))).join(" | "));
}
const card = n => C.docs.find(d => d.type === "action" && d.name === n);
for (const n of ["Vanish", "Rolling Shot", "Double Shot"]) { const d = card(n); console.log(`${n}:`, d.system.versions.map(v => JSON.stringify(A.pureMove({ traits: traits(d.system.traits) }, v))).join(" | ")); }
const src = f => fs.readFileSync(ROOT + f, "utf8"), act = src("module/actions.mjs"), mv = src("module/move.mjs");
console.log("wired: no card when the banner takes it", act.includes("if (!bannerMove) await ChatMessage.create({"), "| the banner", mv.includes("if (cfg.banner && kind !== \"charge\") { showRange(c, n); moveBanner(c, kind, n, cfg.banner); return true; }"),
  "| one line at the end", mv.includes("${VERB[mode] ?? \"moves\"} ${moved} square"), "| Done, Advance instead", mv.includes('data-mb="done"') && mv.includes('data-mb="advance"'), "| closes on a turn change", mv.includes('on("combatTurnChange", () => finish(false));'));
console.log("--- the Talent filter bar");
const cw = src("module/classwindow.mjs"), css = src("styles/system.css");
console.log("search, Category, Only what I can take, compact list:", cw.includes('class="cw-fq"') && cw.includes('class="cw-fcat"') && cw.includes('class="cw-fok"') && cw.includes('data-key="tfview"'),
  "| checked by canTake at the level being taken:", cw.includes("const r = d?.type === \"talent\" ? canTake(who, d)") && cw.includes("level: this.o.level"),
  "| the reasons on the tile:", cw.includes("Not yet: ${tal.reasons.join"), "| filtered in place (no redraw):", cw.includes("tile.hidden = !ok;"), "| the actor reaches the window:", (cw.match(/, actor \}\);/g) ?? []).length, "| compact list CSS:", css.includes(".classwin .cw-tiles.compact .cw-view"));
