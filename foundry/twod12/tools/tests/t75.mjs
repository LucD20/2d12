// Run with: node tools/tests/run.mjs (or node tools/tests/t75.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// The World Clock: the time as the world's calendar names it, and "Everyone sleeps (8 hours)".
const hooks = {}, chat = [];
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once() {} };
globalThis.ChatMessage = { create: async m => chat.push(m.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()), getSpeaker: () => ({}) };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0, async advance(s) { this.worldTime += s; hooks.updateWorldTime?.(this.worldTime); } }, user: { isActiveGM: true, isGM: true }, i18n: { localize: s => s } };
const { clockText, everyoneSleeps, registerClock } = await import(ROOTURL + "module/clock.mjs");
const S = await import(ROOTURL + "module/sleep.mjs");
console.log("no calendar, start:", clockText(0), "| 1 day 14:05 later:", clockText(86400 + 14 * 3600 + 5 * 60));
game.time.calendar = { timeToComponents: t => ({ year: 2, day: 33, month: 1, dayOfMonth: 2, dayOfWeek: 0, hour: 9, minute: 7 }), months: { values: [{ name: "Deepwinter" }, { name: "Claw of Winter" }] }, days: { values: [{ name: "Firstday" }] }, years: { yearZero: 1490 } };
console.log("with the world's calendar:", clockText(123));
delete game.time.calendar;
// everyone sleeps: 8 hours pass, then each player character completes a Sleep (an NPC is left alone)
const mk = (name, type, owned, exh) => { const a = { name, type, hasPlayerOwner: owned, isOwner: true, flags: { twod12: { lastSleep: 0, awakeDays: 0 } }, system: { exhausted: exh, mdt: 8 }, effects: [] };
  a.getFlag = (s, k) => a.flags.twod12[k]; a.setFlag = async (s, k, v) => { a.flags.twod12[k] = v; }; a.unsetFlag = async (s, k) => { delete a.flags.twod12[k]; };
  a.update = async u => { for (const [k, v] of Object.entries(u)) { if (k === "system.exhausted") a.system.exhausted = v; else if (k.startsWith("flags.twod12.-=")) delete a.flags.twod12[k.slice(15)]; else if (k.startsWith("flags.twod12.")) a.flags.twod12[k.slice(13)] = v; } };
  a.createEmbeddedDocuments = async (t, d) => { a.effects.push(...d.map(x => ({ ...x, statuses: new Set(x.statuses), update: async () => {}, delete: async () => {} }))); }; return a; };
game.actors = [mk("Kai", "character", true, 3), mk("Nari", "character", true, 0), mk("Bandit", "npc", false, 0)];
S.registerSleep(); registerClock();
game.time.worldTime = 10 * 3600;
await everyoneSleeps();
console.log("after everyone sleeps:", game.actors.map(a => `${a.name} Exhausted ${a.system.exhausted}, last Sleep at hour ${a.getFlag("twod12", "lastSleep") / 3600}`).join(" | "));
console.log("chat:", chat.at(-1));
const tb = await import(ROOTURL + "module/toolbox.mjs");
const clockItem = tb.toolboxGroups({ isGM: true }).flatMap(g => g.items).find(i => i.id === "clock");
const controls = { tokens: { tools: { select: {} } } }; tb.addToolboxControl(controls);
console.log("clock in 2d12 Tools drawer:", !!clockItem && !clockItem.toggle, "| single token-controls button:", !!controls.tokens.tools["twod12-tools"] && controls.tokens.tools["twod12-tools"].button === true);
