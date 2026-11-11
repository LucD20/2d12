// Run with: node tools/tests/run.mjs (or node tools/tests/t7.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
globalThis.Hooks = { on() {} };
globalThis.game = { socket: { emit() {} }, user: {} };
const { modifierList, resolveModifiers, matches } = await import(ROOTURL + "module/effects.mjs");
const mk = (id, name, mods) => ({ id, name, getFlag: () => mods });
const actor = { effects: Object.assign([mk("e1", "Paladin's Attack", [{ boons: 1, banes: 0, all: ["divine"], any: [], none: [] }]), mk("e2", "Fear", [{ boons: 0, banes: 1, all: [], any: ["melee", "ranged"], none: ["divine"] }])], { get(id) { return this.find(e => e.id === id); } }) };
const t1 = new Set(["attack", "divine", "melee"]), t2 = new Set(["attack", "melee"]), t3 = new Set(["self"]);
for (const t of [t1, t2, t3]) console.log([...t].join(","), modifierList(actor, t).map(m => `${m.name}:${m.match}`).join(" | "));
console.log(modifierList(actor, t1)[0].predicate, "/", modifierList(actor, t1)[1].predicate);
console.log(resolveModifiers(actor, ["e1:0", "e2:0"]));
const { checkHtml } = await import(ROOTURL + "module/roll.mjs");
const r = { d1: [8], d2: [8], boonFaces: [1, 1], baneFaces: [], bo: 2, ba: 0, total: 20, dc: 13, doubles: true, tier: 3, base: 3, sources: [{ name: "Paladin's Attack", boons: 1, banes: 0 }], manualBoons: 1, manualBanes: 0 };
console.log(checkHtml("Weapon Attack \u2022 Body", r, ["Weapon Attack +2"]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
