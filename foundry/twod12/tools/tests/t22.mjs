// Run with: node tools/tests/run.mjs (or node tools/tests/t22.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
class FakeCombat { setupTurns() { this.turns = this._c.slice().sort((a, b) => b.initiative - a.initiative); this.current = {}; return this.turns; } }
globalThis.Combat = FakeCombat;
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
let confirmAnswer = true;
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => confirmAnswer } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const handlers = {}; globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
const msgs = []; globalThis.ChatMessage = { create: async d => msgs.push(d.content.replace(/<[^>]+>/g, "").replace(/&rarr;/g, "→")) };
globalThis.ui = { notifications: { warn: m => msgs.push("WARN: " + m) } };
globalThis.game = { user: { isActiveGM: true, isGM: true }, users: { get: () => ({}) }, socket: { on() {}, emit() {} }, combats: { get: () => combat } };
const { TwoD12Combat, performSwap, swapCandidates, spendAP, getAP, registerCombatHooks } = await import(ROOTURL + "module/combat.mjs");
const mk = (name, init, disp) => {
  const flags = {};
  const c = { id: name, name, initiative: init, flags: {},  token: { disposition: disp }, actor: { id: name, type: disp === 1 ? "character" : "npc" }, actorId: name, isDefeated: false, flags, testUserPermission: () => true,
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
  return c;
};
const all = [mk("PC1", 14, 1), mk("PC2", 13, 1), mk("PC3", 10, 1), mk("NPC1", 12, -1), mk("NPC2", 10, -1)];
const combat = new TwoD12Combat(); combat._c = all; combat.round = 1; combat.turn = 0; combat.started = true;
combat.combatants = Object.assign(all.slice(), { get: id => all.find(c => c.id === id), find: f => all.find(f) }); globalThis.canvas = { scene: { tokens: [], regions: [] } }; combat.setFlag = async () => {}; combat.getFlag = () => null;
combat.updateEmbeddedDocuments = async (n, ups) => { for (const u of ups) all.find(c => c.id === u._id).initiative = u.initiative; combat.setupTurns(); };
combat.update = async d => { Object.assign(combat, d); combat.setupTurns(); };
Object.defineProperty(combat, "combatant", { get() { return combat.turns[combat.turn]; } });
combat.setupTurns(); game.combat = combat; registerCombatHooks();
const names = () => combat.turns.map(c => c.name).join(", ");
const PC1 = all[0], PC3 = all[2];
PC1.flags.ap = 5;
console.log("start:", names(), "| current:", combat.combatant.name);
console.log("candidates for PC1:", swapCandidates(combat, PC1).map(c => c.name).join(","));
await performSwap(combat, "PC1", "PC3");
console.log("after swap:", names(), "| current:", combat.combatant.name, "| PC1 AP", getAP(PC1), "frozen", PC1.flags.frozen, "| PC3 AP", getAP(PC3));
console.log(msgs.splice(0).join("\n"));
// frozen PC1 tries to act
confirmAnswer = false; console.log("frozen action blocked:", !(await spendAP(PC1.actor, 1, "Slash")));
// advance to PC1's new turn: PC1 should carry on with 4 AP
combat.turn = combat.turns.findIndex(c => c.id === "PC1"); handlers.combatTurnChange(combat); await new Promise(r => setTimeout(r, 5));
console.log("PC1 new turn:", names().split(", ")[combat.turn], "AP", getAP(PC1), "frozen", PC1.flags.frozen, "|", msgs.splice(0).join(" / "));
// A who already acted cannot swap; PC3 (not current) cannot initiate
const PC2 = all[1]; combat.turn = combat.turns.findIndex(c => c.id === "PC2"); PC2.flags.acted = true; PC2.flags.ap = 3;
await performSwap(combat, "PC2", "PC1"); console.log("acted/earlier ally:", msgs.splice(0).join(" / "));
// tie
all[0].initiative = 10; all[2].initiative = 10; PC3.flags.acted = false;
console.log("done");
