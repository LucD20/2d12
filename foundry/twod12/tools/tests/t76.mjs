// Run with: node tools/tests/run.mjs (or node tools/tests/t76.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// The World Clock window and bar, the Exhaustion toggle, and clicking the Exhausted condition.
const hooks = {}, chat = [], settings = { trackExhaustion: true };
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once() {} };
globalThis.ChatMessage = { create: async m => chat.push(m.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()), getSpeaker: () => ({}) };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: (s, k) => settings[k] ?? true, register() {}, set: async (s, k, v) => { settings[k] = v; } }, time: { worldTime: 0, async advance(s) { this.worldTime += s; hooks.updateWorldTime?.(this.worldTime); } }, user: { isActiveGM: true, isGM: true, id: "u1" }, i18n: { localize: s => s } };
const { clockTitle, secondsUntil, UNITS, moveClock } = await import(ROOTURL + "module/clock.mjs");
const S = await import(ROOTURL + "module/sleep.mjs");
// the header, like PF2e's
console.log("no calendar:", clockTitle(86400 + 3 * 3600 + 43 * 60 + 54));
game.time.calendar = { timeToComponents: () => ({ year: 3236, day: 40, month: 4, dayOfMonth: 1, dayOfWeek: 5, hour: 3, minute: 43, second: 54 }), months: { values: [0, 0, 0, 0, { name: "Lamashan" }] }, days: { values: [0, 0, 0, 0, 0, { name: "Fireday" }] }, years: { yearZero: 1490 } };
console.log("with a calendar:", clockTitle(1), "| ordinals:", [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 30].map(n => { const t = { dayOfMonth: n - 1 }; game.time.calendar.timeToComponents = () => ({ year: 0, month: 4, dayOfMonth: n - 1, dayOfWeek: 5, hour: 0, minute: 0, second: 0 }); return clockTitle(1).split(",")[1].trim().split(" ")[0]; }).join(" "));
delete game.time.calendar;
// advance to dawn / noon / dusk / midnight
const at = (h, m = 0) => h * 3600 + m * 60;
console.log("from 03:00:", ["dawn", "noon", "dusk", "midnight"].map(k => `${k} +${secondsUntil(at(3), k) / 3600}h`).join(", "));
console.log("from 14:30:", ["dawn", "noon", "dusk", "midnight"].map(k => `${k} +${secondsUntil(at(14, 30), k) / 3600}h`).join(", "));
console.log("exactly at noon, noon again is a full day:", secondsUntil(at(12), "noon") / 3600, "| units:", Object.entries(UNITS).map(([k, v]) => `${k}=${v}`).join(" "));
// moving back
game.time.worldTime = 5000; await moveClock(-3600 * 0 - 600); console.log("back 10 minutes from 5000:", game.time.worldTime);
// Exhaustion tracking off: the clock moves many days and nobody gets Exhausted; turning it on starts from now
const mk = name => { const a = { name, type: "character", isOwner: true, hasPlayerOwner: true, flags: { twod12: { lastSleep: 0, awakeDays: 0 } }, system: { exhausted: 0, mdt: 8 }, effects: [] };
  a.getFlag = (s, k) => a.flags.twod12[k]; a.setFlag = async (s, k, v) => { a.flags.twod12[k] = v; }; a.unsetFlag = async (s, k) => { delete a.flags.twod12[k]; };
  a.update = async u => { for (const [k, v] of Object.entries(u)) { if (k === "system.exhausted") { a.system.exhausted = v; a.system.mdt = Math.max(0, 8 - 4 * v); } else if (k.startsWith("flags.twod12.-=")) delete a.flags.twod12[k.slice(15)]; else if (k.startsWith("flags.twod12.")) a.flags.twod12[k.slice(13)] = v; } };
  a.createEmbeddedDocuments = async (t, docs) => { for (const d of docs) { const e = { ...d, statuses: new Set(d.statuses) }; e.update = async u => Object.assign(e, u); e.delete = async () => { a.effects = a.effects.filter(x => x !== e); }; a.effects.push(e); } };
  return a; };
const kai = mk("Kai"); game.actors = [kai];
S.registerSleep();
await S.setTracking(false); console.log("tracking:", S.trackingExhaustion());
game.time.worldTime = 0; await game.time.advance(10 * 86400); await S.clockTick(game.time.worldTime);
console.log("10 days with tracking off → Exhausted", kai.system.exhausted, "| chat messages about Sleep:", chat.filter(c => c.includes("without a Sleep")).length);
await S.setTracking(true);
console.log("tracking on again:", S.trackingExhaustion(), "| time awake restarts at day", kai.getFlag("twod12", "lastSleep") / 86400);
await game.time.advance(86400); await S.clockTick(game.time.worldTime);
console.log("one more day → Exhausted", kai.system.exhausted);
// the condition: click +1, right-click -1 (down to none)
await S.bumpExhausted(kai, 1); console.log("click: Exhausted", kai.system.exhausted, "| condition:", kai.effects.map(e => e.name).join(", "));
await S.bumpExhausted(kai, -1); await S.bumpExhausted(kai, -1); console.log("two right-clicks: Exhausted", kai.system.exhausted, "| condition:", kai.effects.map(e => e.name).join(", ") || "none");
await S.bumpExhausted(kai, -1); console.log("right-click at none stays at", kai.system.exhausted);
const npc = { type: "npc" }; console.log("an NPC has no value to change:", await S.bumpExhausted(npc, 1));
// a condition added by hand (the token HUD) and removed again
const hand = mk("Nari"); game.actors.push(hand); let eff = { parent: hand, statuses: new Set(["exhausted"]), name: "Exhausted", update: async () => {}, delete: async () => { hand.effects = hand.effects.filter(x => x !== eff); } }; hand.effects.push(eff);
hooks.createActiveEffect(eff, {}, "u1"); await new Promise(r => setTimeout(r, 5));
console.log("added by hand → value", hand.system.exhausted);
hooks.deleteActiveEffect(eff, {}, "u1"); await new Promise(r => setTimeout(r, 5));
console.log("removed by hand → value", hand.system.exhausted);
