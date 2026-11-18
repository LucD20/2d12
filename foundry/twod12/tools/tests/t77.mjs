// Run with: node tools/tests/run.mjs (or node tools/tests/t77.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// The quick time bar (inserted first in the chat tab, clicks move the clock, errors are shown) and the token HUD's Exhausted clicks.
const hooks = {}, notes = [], settings = { trackExhaustion: true, timeBar: true };
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once: (h, f) => (hooks[h + ":once"] = f) };
globalThis.ChatMessage = { create: async () => {}, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info: m => notes.push("info: " + m), error: m => notes.push("error: " + m) } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: (s, k) => settings[k], register() {}, set: async (s, k, v) => { settings[k] = v; } }, time: { worldTime: 3 * 3600 + 5 * 60 + 9, async advance(s) { this.worldTime += s; } }, user: { isActiveGM: true, isGM: true, id: "u1" }, i18n: { localize: s => s } };
// a tiny stand-in for the page
const made = [];
globalThis.document = { createElement: () => { const el = { className: "", innerHTML: "", listeners: {}, addEventListener(t, f) { this.listeners[t] = f; }, remove() {} }; made.push(el); return el; }, querySelectorAll: () => [] };
const C = await import(ROOTURL + "module/clock.mjs");
const S = await import(ROOTURL + "module/sleep.mjs");
const { date, time } = C.clockParts(); console.log("parts:", date, "|", time);
const html = C.barHtml();
console.log("bar has 6 movement buttons:", (html.match(/data-s="/g) || []).length, "| steps:", [...html.matchAll(/data-s="(-?\d+)"/g)].map(m => m[1]).join(" "), "| opens the clock from the time:", (html.match(/data-open="1"/g) || []).length, "| one line, no date row:", !html.includes("tb-date") && !html.includes("tb-row"));
let prepended = null;
const root = { prepend: el => (prepended = el), querySelector: () => null };
C.insertBar(root);
console.log("inserted first in the chat tab:", prepended === made[0], "| class:", made[0].className);
const click = async s => { await C.barClick({ fromTest: true, target: { closest: () => ({ dataset: { s }, closest: () => ({}) }) }, stopPropagation() {} }); return game.time.worldTime; };
const t0 = game.time.worldTime;
console.log("+1 round:", (await click("10")) - t0, "| +1 hour:", (await click("3600")) - t0 - 10, "| -10 minutes:", (await click("-600")) - t0 - 10 - 3600);
game.time.advance = async () => { throw new Error("permission denied"); };
const quiet = console.error; console.error = () => {};
await click("10"); console.error = quiet; console.log("a failing move says so on screen:", notes.at(-1));
settings.timeBar = false; made.length = 0; C.insertBar({ prepend: () => (made.push("x")), querySelector: () => null }); console.log("hidden by the setting:", made.length === 0);
settings.timeBar = true; game.user.isGM = false; made.length = 0; C.insertBar({ prepend: () => (made.push("x")), querySelector: () => null }); console.log("not shown to players:", made.length === 0);
// the token HUD: only the tooltip (the clicks go through Foundry's own status toggle, tested in t82)
{
  const el = { dataset: {}, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };   // v0.0.420: the instructions are a screen-reader label now
  const kai = { name: "Kai", type: "character", isOwner: true, system: { exhausted: 1, mdt: 8 }, effects: [] };
  const app = { document: { actor: kai } };
  const root = { querySelector: sel => (sel === '[data-status-id="exhausted"]' ? el : null) };
  console.log("HUD label (no hover since v0.0.420):", S.exhaustedHud(app, root), "|", el.attrs["aria-label"], "| no tooltip:", el.dataset.tooltip === undefined);
  console.log("a non-character gets nothing:", S.exhaustedHud({ document: { actor: { type: "npc" } } }, root), "| no icon in the HUD:", S.exhaustedHud(app, { querySelector: () => null }));
}
