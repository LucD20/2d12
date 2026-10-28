// Run with: node tools/tests/run.mjs (or node tools/tests/t74.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
// Sleep, Exhausted and Daily, driven by the world clock (1 round = 10 seconds; a day = 86400 seconds).
const hooks = {}, chat = [];
let confirmAnswer = true;
globalThis.Combat = class {}; globalThis.CONFIG = { time: {} };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once() {} };
globalThis.ChatMessage = { create: async m => chat.push(m.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()), getSpeaker: () => ({}) };
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => confirmAnswer }, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true, register() {}, set: async () => {} }, time: { worldTime: 0 }, user: { isActiveGM: true }, combat: null };
const mdtBase = 8;
const makeActor = name => {
  const a = { name, type: "character", isOwner: true, flags: { twod12: {} }, system: { exhausted: 0, mdt: mdtBase }, effects: [] };
  a.getFlag = (s, k) => a.flags.twod12[k];
  a.setFlag = async (s, k, v) => { a.flags.twod12[k] = v; };
  a.unsetFlag = async (s, k) => { delete a.flags.twod12[k]; };
  a.update = async u => { for (const [k, v] of Object.entries(u)) { if (k === "system.exhausted") { a.system.exhausted = v; a.system.mdt = Math.max(0, mdtBase - 4 * v); } else if (k.startsWith("flags.twod12.-=")) delete a.flags.twod12[k.slice(15)]; else if (k.startsWith("flags.twod12.")) a.flags.twod12[k.slice(13)] = v; } };
  a.createEmbeddedDocuments = async (t, docs) => { for (const d of docs) { const e = { ...d, statuses: new Set(d.statuses) }; e.update = async u => Object.assign(e, u); e.delete = async () => { a.effects = a.effects.filter(x => x !== e); }; a.effects.push(e); } };
  return a;
};
const kai = makeActor("Kai");
game.actors = [kai];
const S = await import(ROOT + "module/sleep.mjs");
const U = await import(ROOT + "module/usage.mjs");
S.registerSleep();
const tick = async h => { game.time.worldTime += h * 3600; hooks.updateWorldTime(game.time.worldTime); await S.clockTick(game.time.worldTime); };
const state = () => `Exhausted ${kai.system.exhausted}, threshold ${kai.system.mdt}, condition "${kai.effects.map(e => e.name).join(", ") || "none"}"`;
console.log("hoursText:", S.hoursText(3600 * 5), "|", S.hoursText(3600 * 27), "|", S.hoursText(0));
await tick(0); console.log("clock starts counting:", kai.getFlag("twod12", "lastSleep") === 0);
await tick(23); console.log("after 23 hours awake:", state());
await tick(1); console.log("after 24 hours:", state());
await tick(24); console.log("after 48 hours:", state(), "| Mind Save asked:", chat.some(c => c.includes("Mind Save")));
const asks = chat.filter(c => c.includes("Mind Save")).length;
await tick(6); console.log("6 hours later, no new Save yet:", chat.filter(c => c.includes("Mind Save")).length === asks);
await tick(6); console.log("12 hours after the first, asked again:", chat.filter(c => c.includes("Mind Save")).length === asks + 1);
const daily = { id: "d1", type: "action", system: { frequency: "daily", traits: new Set() } };
await U.markUsed(kai, daily); console.log("Daily used:", JSON.stringify(U.isFaded(kai, daily)));
confirmAnswer = true; await S.completeSleep(kai);
console.log("after a Sleep:", state(), "| Daily renewed:", !U.isFaded(kai, daily).faded, "| last chat:", chat.at(-1));
confirmAnswer = false; await tick(10); const ok = await S.completeSleep(kai);
console.log("Sleep again 10 hours later, declined at the 16-hour warning:", ok === false, "|", state());
await tick(14); await S.completeSleep(kai); console.log("24 hours after the first Sleep, Sleep again:", state());
// the clock moving many times in a row (a combat: 6 rounds of 10 seconds) must not count anything twice
const before = kai.system.exhausted;
for (let i = 0; i < 6; i++) { game.time.worldTime += 10; hooks.updateWorldTime(game.time.worldTime); }
await S.clockTick(game.time.worldTime);
console.log("6 rounds in a row change nothing:", kai.system.exhausted === before);
console.log("chat:", chat.slice(0, 3).join(" || "));
