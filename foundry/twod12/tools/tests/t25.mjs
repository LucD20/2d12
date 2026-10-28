// Run with: node tools/tests/run.mjs (or node tools/tests/t25.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = globalThis.Combat ?? class {};
globalThis.Combat = class {}; globalThis.CONFIG = {};
const confirmed = true;
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => confirmed } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
const warns = []; globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
const msgs = []; globalThis.ChatMessage = { create: async d => msgs.push(d.content.replace(/<[^>]+>/g, "")) };
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
// --- world
const mkEffect = (id, name) => ({ id, _id: id, name, toObject() { return { _id: id, name, flags: { twod12: { remaining: 2 } } }; } });
const actorData = { uuid: "Actor.a", system: { damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, wounds: 0 }, effects: [mkEffect("e1", "Bless")] };
const actor = { ...actorData, async update(d) { for (const [k, v] of Object.entries(d)) { const [, key] = k.split("."); this.system[key] = v; } }, async deleteEmbeddedDocuments(n, ids) { this.effects = this.effects.filter(e => !ids.includes(e.id)); }, async createEmbeddedDocuments(n, data) { for (const d of data) this.effects.push(mkEffect(d._id, d.name)); } };
globalThis.fromUuid = async u => (u === "Actor.a" ? actor : null);
const tokens = [{ id: "t1", x: 100, y: 100, elevation: 0, light: { toObject: () => ({ bright: 0 }) } }];
const regions = [{ id: "r1", toObject: () => ({ _id: "r1", name: "Aura", flags: {} }) }];
const col = arr => Object.assign(arr, { get: id => arr.find(x => x.id === id) });
const scene = { tokens: col(tokens), regions: col(regions),
  async updateEmbeddedDocuments(n, ups) { for (const u of ups) { if (n === "Token") Object.assign(tokens.find(t => t.id === u._id), u); } },
  async deleteEmbeddedDocuments(n, ids) { if (n === "Region") { for (const id of ids) regions.splice(regions.findIndex(r => r.id === id), 1); Object.assign(scene.regions, col(regions)); } },
  async createEmbeddedDocuments(n, data) { for (const d of data) regions.push({ id: d._id, toObject: () => d }); } };
globalThis.canvas = { scene };
const flagsA = { ap: 5, acted: false, moveLeft: 0 };
const comb = { id: "c1", name: "Paladin", initiative: 14, actor, flags: { twod12: flagsA } };
const combatFlags = {};
const combat = { round: 1, turn: 0, combatant: comb, combatants: [comb], getFlag: (s, k) => combatFlags[k], setFlag: async (s, k, v) => { combatFlags[k] = JSON.parse(JSON.stringify(v)); },
  async updateEmbeddedDocuments(n, ups) { for (const u of ups) { comb.initiative = u.initiative; comb.flags = { twod12: u.flags.twod12 }; } }, async update(d) { Object.assign(combat, d); } };
const { takeSnapshot, resetTurn } = await import(ROOTURL + "module/combat.mjs");
await takeSnapshot(combat);
console.log("snapshot saved:", Object.keys(combatFlags.snapshot).join(","), "| effects:", combatFlags.snapshot.actors[0].effects.length);
// the player messes up: takes damage, loses the effect, moves, spends AP, creates an area, swaps initiative
actor.system.damage.bodyLethal = 9; actor.effects = []; tokens[0].x = 400; flagsA.ap = 1; flagsA.moveLeft = 3; comb.flags = { twod12: { ...flagsA, frozen: true } }; comb.initiative = 3;
regions.push({ id: "r2", toObject: () => ({ _id: "r2" }) }); Object.assign(scene.regions, col(regions)); regions.shift(); Object.assign(scene.regions, col(regions));
console.log("before reset: damage", actor.system.damage.bodyLethal, "effects", actor.effects.length, "x", tokens[0].x, "regions", regions.map(r => r.id).join(","), "ap", comb.flags.twod12.ap, "init", comb.initiative);
await resetTurn(combat);
console.log("after reset : damage", actor.system.damage.bodyLethal, "effects", actor.effects.map(e => e.name).join(","), "x", tokens[0].x, "regions", regions.map(r => r.id).join(","), "ap", comb.flags.twod12.ap, "frozen", comb.flags.twod12.frozen, "moveLeft", comb.flags.twod12.moveLeft, "init", comb.initiative);
console.log(msgs.at(-1));
combat.turn = 2; await resetTurn(combat); console.log("different turn:", warns.at(-1));
