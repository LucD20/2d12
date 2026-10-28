// Run with: node tools/tests/run.mjs (or node tools/tests/t101.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Conditions with a value: the text that floats over the token (like Exhausted's), and Vulnerable as one condition with a value (boons by value, the highest counts).
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [{ id: "vulnerable" }, { id: "empowered" }] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => true }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
const FT = await import(ROOTURL + "module/floattext.mjs");
const E = await import(ROOTURL + "module/effects.mjs");
console.log("--- the text on the token when the value of a condition changes (the effect is renamed with its value)");
const show = (a, b) => { const t = FT.renameText(a, b); console.log(`${JSON.stringify(a)} -> ${JSON.stringify(b)}`.padEnd(44), t ? `${JSON.stringify(t.text)} ${t.down ? "slides down" : "floats up"}` : "(nothing)"); };
show("Enfeebled 1", "Enfeebled 2"); show("Enfeebled 2", "Enfeebled 1"); show("Empowered 1", "Empowered 3"); show("Vulnerable 3", "Vulnerable 2"); show("Vulnerable 2", "Vulnerable 2"); show("Prone", "Prone (changed)");
console.log("--- the name an effect gets");
console.log("base names:", [{ n: "Enfeebled 2", b: "Enfeebled" }, { n: "Enfeebled 12", b: undefined }, { n: "Vulnerable 3", b: undefined }, { n: "Hindered (until Move)", b: undefined }, { n: "Exhausted", b: undefined }].map(x => JSON.stringify(E.baseNameOf({ name: x.n, getFlag: (s, k) => (k === "baseName" ? x.b : undefined) }))).join(" "));
let calls = []; const fx = { name: "Enfeebled 1", getFlag: (s, k) => ({ value: 1, baseName: "Enfeebled" }[k]), update: async u => calls.push(JSON.stringify(u)), delete: async () => calls.push("delete") };
await E.setValued(fx, 4); await E.bumpValued(fx, 1); await E.bumpValued({ ...fx, getFlag: (s, k) => ({ value: 1, baseName: "Enfeebled" }[k]) }, -1);
console.log("renamed with the value:", calls.join(" | "));
// ---------------------------------------------------------------- Vulnerable
console.log("--- Vulnerable");
const F = "twod12";
const vulFx = (id, name, value, baseName = "Vulnerable", mods = [{ against: true, boons: 1, banes: 0, byValue: true, all: [], any: [], none: [], from: [] }]) => ({ id, name, statuses: new Set(value != null ? ["vulnerable"] : []), getFlag: (s, k) => ({ modifiers: mods, value, baseName: value != null ? baseName : undefined })[k] });
const target = (effects, name = "Goblin") => ({ name, uuid: "Actor." + name, effects, statuses: new Set(), system: {}, itemTypes: { weapon: [] } });
const me = { name: "Kai", uuid: "Actor.Kai", effects: [], statuses: new Set(), system: { }, itemTypes: { weapon: [] }, items: [] };
globalThis.fromUuidSync = u => (u === "Actor.Goblin" ? goblin : u === "Actor.Orc" ? orc : null);
const boonsAgainst = t => { try { return E.modifierList(me, new Set(["melee"]), [t]).filter(m => /Vulnerable/.test(m.name)).map(m => `${m.name}: ${m.boons} boon${m.boons === 1 ? "" : "s"}`).join(" ; ") || "no Vulnerable boons"; } catch (e) { return "ERROR " + e.message; } };
let goblin = target([vulFx("e1", "Vulnerable 2", 2)]); console.log("a Goblin with Vulnerable 2 (a condition with a value):", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 1", 1)]); console.log("Vulnerable 1:", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 3", 3)]); console.log("Vulnerable 3:", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 2", 2), vulFx("e2", "Vulnerable 3", 3)]); console.log("two Vulnerable effects (2 and 3): only the highest counts:", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 2", 2), vulFx("e2", "Vulnerable 2", 2)]); console.log("two with the same value count once:", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 1", undefined, undefined, [{ against: true, boons: 1, banes: 0, all: [], any: [], none: [], from: [] }])]); console.log("an older item named Vulnerable 1 (no value on it):", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 3", undefined, undefined, [{ against: true, boons: 3, banes: 0, all: [], any: [], none: [], from: [] }]), vulFx("e2", "Vulnerable 2", 2)]); console.log("an older Vulnerable 3 and a new Vulnerable 2: the 3 counts:", boonsAgainst(goblin));
goblin = target([vulFx("e1", "Vulnerable 2", 2), vulFx("e2", "Prone", undefined, undefined, [{ against: true, boons: 1, banes: 0, all: [], any: ["melee"], none: [], from: [] }])]); const all = E.modifierList(me, new Set(["melee"]), [goblin]).filter(m => m.match);
console.log("Vulnerable 2 and Prone together (Prone is another condition):", all.map(m => `${m.name}: ${m.boons}`).join(" ; "));
const orc = target([vulFx("o1", "Vulnerable 3", 3)], "Orc"); goblin = target([vulFx("e1", "Vulnerable 1", 1)]);
const both = E.modifierList(me, new Set(["melee"]), [goblin, orc]).filter(m => /Vulnerable/.test(m.name)).map(m => `${m.name}: ${m.boons}`).join(" ; "); console.log("two targets, each with its own value:", both);
const ids = E.modifierList(me, new Set(["melee"]), [target([vulFx("e1", "Vulnerable 2", 2)])]).filter(m => /Vulnerable/.test(m.name)).map(m => m.id);
goblin = target([vulFx("e1", "Vulnerable 2", 2)]); goblin.effects.get = id => goblin.effects.find(e => e.id === id); goblin.effects = Object.assign(goblin.effects, { get: id => goblin.effects.find(e => e.id === id) });
console.log("the chosen modifier counts the value:", JSON.stringify(E.resolveModifiers(me, ids.map(i => i.replace("Actor.Goblin", "Actor.Goblin")))));
// the compendium
import fs from "node:fs";
const pack = JSON.parse(fs.readFileSync(ROOT + "packs/_source/conditions/" + fs.readdirSync(ROOT + "packs/_source/conditions").find(f => /^vulnerable/i.test(f)), "utf8"));
const imp = JSON.parse(fs.readFileSync(ROOT + "packs/_source/conditions/" + fs.readdirSync(ROOT + "packs/_source/conditions").find(f => /^imperiled/i.test(f)), "utf8"));
console.log("--- the compendium");
console.log("Conditions:", fs.readdirSync(ROOT + "packs/_source/conditions").map(f => f.replace(/\..*/, "")).sort().join(", "));
console.log("Vulnerable: valued", pack.system.valued, "| condition", pack.system.isCondition, "| modifier:", JSON.stringify(pack.system.settings.map(s => ({ against: s.against, boons: s.boons, byValue: s.byValue }))));
console.log("Imperiled: its own modifiers", JSON.stringify(imp.system.settings), "| applies:", JSON.stringify(imp.system.conditions.map(c => ({ name: c.name, value: c.value, valued: c.valued, uuidOfVulnerable: c.uuid.endsWith(pack._id) }))));
