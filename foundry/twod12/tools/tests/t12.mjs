// Run with: node tools/tests/run.mjs (or node tools/tests/t12.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {};
globalThis.foundry = { applications: { api: { DialogV2: { prompt: async () => ({ dc: "30", mod: "0", boons: "0", banes: "0", fx: [] }) } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.ui = { notifications: { warn: console.log, info: console.log } };
globalThis.Hooks = { on() {} };
class Roll { constructor(f) { this.f = String(f).replace(/xs/g, ""); } async evaluate() { const m = this.f.match(/^(\d+)d(\d+)(?:\+(\d+))?$/); const n = +m[1], faces = +m[2]; this.dice = [{ faces, results: Array.from({ length: n }, () => ({ result: Math.min(faces - 1, 7) })) }]; this.total = n * Math.min(faces - 1, 7) + (+m[3] || 0); return this; } }
globalThis.Roll = Roll;
const msgs = [];
globalThis.ChatMessage = { create: async d => msgs.push(d), getSpeaker: () => ({}) };
const actor = { name: "Orc", uuid: "Actor.orc", isOwner: true, effects: [], system: { attributes: { body: 0, mind: 0, appeal: 2, instinct: 0 }, damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 } }, update: async u => console.log("update", JSON.stringify(u)) };
globalThis.fromUuid = async u => ({ actor, name: "x" });
let stored = null;
const msg = { id: "m1", isAuthor: true, getFlag: () => stored, update: async d => { stored = d["flags.twod12.saveCard"]; console.log("msg updated; has result:", !!stored.rows[0].result); } };
globalThis.game = { socket: { emit() {}, on() {} }, user: { isGM: true, targets: new Set() }, messages: { get: () => msg } };
const { buildCommand } = await import(ROOTURL + "module/builder.mjs");
const { parseInline, saveRoll, postSaveCard } = await import(ROOTURL + "module/inline.mjs");
const cmds = [
  buildCommand({ type: "check", attr: "body", dc: "14", adj: "2", boon: "1", bane: "2", traits: ["divine"] }),
  buildCommand({ type: "damage", f1: "1d4+1", p1: "body", s1: "slash", f2: "1d6", p2: "mind", s2: "holy", n2: "on" }),
  buildCommand({ type: "save", attr: "appeal", dc: "30", traits: ["divine"], t1: "1d6[mind,holy]", t2: '1d4[body,slash], "Prone"', t3: "0" }),
  buildCommand({ type: "template", shape: "emanation", distance: "2", targets: "enemies", self: "on", places: "on" })
];
console.log(cmds.join("\n"));
const m = cmds[2].match(/@Save\[(.*)\]/);
const cfg = parseInline("Save", m[1]);
console.log(JSON.stringify(cfg.tiers), cfg.traits);
globalThis.game.user.targets = new Set([{ document: { uuid: "Token.orc" }, name: "Orc" }]);
await postSaveCard(cfg);
stored = msgs[0].flags.twod12.saveCard;
console.log(msgs[0].content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
await saveRoll(msg, 0);
console.log(msgs.slice(1).map(m => m.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")));
console.log("FINAL CARD:", stored.rows[0].result);
console.log("messages posted after card:", msgs.length);
const { retargetSave } = await import(ROOTURL + "module/inline.mjs");
globalThis.game.user.targets = new Set([{ document: { uuid: "Token.orc" }, name: "Orc" }, { document: { uuid: "Token.gob" }, name: "Goblin" }]);
await retargetSave(msg);
console.log(stored.rows.map(r => r.name + ":" + (r.result ? "done" : "open")).join(", "));
