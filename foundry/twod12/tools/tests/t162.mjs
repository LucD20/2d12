// Run with: node tools/tests/run.mjs (or node tools/tests/t162.mjs)
// v0.0.203 (Lucas): the Swap Initiative card (real AP numbers and slot) and the thaw line at the swapper's slot, in a three-way fight.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
class FakeCombat { setupTurns() { this.turns = this._c.slice().sort((a, b) => b.initiative - a.initiative); this.current = {}; return this.turns; } }
globalThis.Combat = FakeCombat;
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
let confirmAnswer = true;
globalThis.foundry = { applications: { api: { DialogV2: { confirm: async () => confirmAnswer } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const handlers = {}; globalThis.Hooks = { on: (n, f) => (handlers[n] = f) };
const msgs = [], rawMsgs = [], rawFlags = []; globalThis.ChatMessage = { create: async d => { rawMsgs.push(d.content); rawFlags.push(d.flags); msgs.push(d.content); } };
globalThis.ui = { notifications: { warn: m => msgs.push("WARN: " + m) } };
globalThis.game = { user: { isActiveGM: true, isGM: true }, users: { get: () => ({}) }, socket: { on() {}, emit() {} }, combats: { get: () => combat } };
const { TwoD12Combat, performSwap, swapCandidates, spendAP, getAP, registerCombatHooks } = await import(ROOTURL + "module/combat.mjs");
const mk = (name, init, disp) => {
  const flags = {};
  const c = { id: name, name, initiative: init, flags: {},  token: { disposition: disp }, actor: { id: name, type: disp === 1 ? "character" : "npc" }, actorId: name, isDefeated: false, flags, testUserPermission: () => true,
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, update: async d => { for (const [p, v] of Object.entries(d)) flags[p.split(".").pop()] = v; } };
  return c;
};
const all = [mk("Nari", 18, 1), mk("Steven", 16, -1), mk("Zack", 14, 1), mk("Jacob", 12, 0), mk("Drak", 8, 1)];
const combat = new TwoD12Combat(); combat._c = all; combat.round = 2; combat.turn = 0; combat.started = true;
combat.combatants = Object.assign(all.slice(), { get: id => all.find(c => c.id === id), find: f => all.find(f) }); globalThis.canvas = { scene: { tokens: [], regions: [] } }; combat.setFlag = async () => {}; combat.getFlag = () => null;
combat.updateEmbeddedDocuments = async (n, ups) => { for (const u of ups) all.find(c => c.id === u._id).initiative = u.initiative; combat.setupTurns(); };
combat.update = async d => { Object.assign(combat, d); combat.setupTurns(); };
Object.defineProperty(combat, "combatant", { get() { return combat.turns[combat.turn]; } });
combat.setupTurns(); game.combat = combat; registerCombatHooks();
const names = () => combat.turns.map(c => c.name).join(", ");
const [Nari, , , , Drak] = all;
Nari.flags.ap = 5;
console.log("three-way fight (ally, foe, ally, neutral, ally):", names());
console.log("Nari can swap with:", swapCandidates(combat, Nari).map(c => c.name).join(", "));
await performSwap(combat, "Nari", "Drak");   // the last ally in the order
console.log("after:", names(), "| now:", combat.combatant.name);
const card = rawMsgs.find(m => m.includes("Swap Initiative"));
console.log("card:", card.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
console.log("card parts: header with 1AP chip:", card.includes('class="ahead"') && card.includes(">1AP<"), "| swap icon:", card.includes("fa-right-left"), "| AP in the AP color:", (card.match(/class="kw-ap"/g) ?? []).length === 2, "| flag slot:", JSON.stringify(rawFlags.at(-1)?.twod12?.swap));
combat.turn = combat.turns.findIndex(c => c.id === "Nari"); handlers.combatTurnChange(combat); await new Promise(r => setTimeout(r, 5));
const thaw = rawMsgs.at(-1);
console.log("thaw:", thaw.replace(/<[^>]+>/g, "").trim(), "| a line, no header:", thaw.includes("sysline") && !thaw.includes("ahead"), "| lock icon:", thaw.includes("fa-lock-open"));
const before = rawMsgs.length; combat.turn = combat.turns.findIndex(c => c.id === "Steven"); handlers.combatTurnChange(combat); await new Promise(r => setTimeout(r, 5));
console.log("Steven's turn posts no thaw:", !rawMsgs.slice(before).some(m => m.includes("thaws")));
const { swapCardHtml } = await import(ROOTURL + "module/sysmsg.mjs");
console.log("names are escaped:", swapCardHtml("<b>Zack</b>", "Lana", 5, 4, 3).includes("&lt;b&gt;Zack"));
