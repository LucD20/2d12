// Run with: node tools/tests/run.mjs (or node tools/tests/t175.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.223 (Lucas): the Encounter Log: its lines, the short names, a turn in the playtest format, the copy, removed lines left out.
globalThis.foundry = { applications: { api: { ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
const L = await import(ROOTURL + "module/enclog.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("Action names:", ["Lay on Hands", "Lock & Loose", "Weapon Attack", "Shield of Faith", "Cleaver", "Rolling Shot (+1d6 Pi)"].map(L.actionAbbr).join(" "));
const cast = [{ id: "oc", name: "Ogre Chieftain" }, { id: "dp", name: "Dwarf Paladin" }, { id: "hp", name: "Human Paladin" }, { id: "g1", name: "Goblin Sneak" }, { id: "g2", name: "Goblin Sneak" }, { id: "na", name: "Nari" }];
const ab = L.creatureAbbrs(cast, { na: "N" });
console.log("Creatures:", JSON.stringify(ab));
const R = (id) => ({ id, name: cast.find(c => c.id === id).name });
let n = 0;
const E = (r, t, own, k, who, d, extra = {}) => ({ id: `e${++n}`, r, t, own: R(own), k, who: who ? R(who) : null, d, ...extra });
const log = [
  E(1, 0, "oc", "act", "oc", { name: "Charge", ap: 2, multiAp: false, tg: [] }),
  E(1, 0, "oc", "move", "oc", { mode: "Charge", n: 4 }),
  E(1, 0, "oc", "act", "oc", { name: "Weapon Attack", ap: 1, tg: [{ id: "dp", name: "Dwarf Paladin", tier: 3 }], free: true }),
  E(1, 0, "oc", "dmg", "dp", { n: 14, text: "14 Body" }),
  E(1, 0, "oc", "act", "oc", { name: "Club", ap: 1, tg: [{ id: "dp", name: "Dwarf Paladin", tier: 3 }] }),
  E(1, 0, "oc", "act", "oc", { name: "Club", ap: 1, tg: [{ id: "hp", name: "Human Paladin", tier: 1 }] }, { off: true, why: "Removed by hand" }),
  E(1, 0, "oc", "act", "hp", { name: "Shield of Faith", ap: 1, multiAp: true, react: true, tg: [{ id: "dp", name: "Dwarf Paladin", tier: null }] }),
  E(1, 0, "oc", "move", "oc", { mode: "Advance", n: 1 }),
  E(1, 0, "oc", "move", "oc", { mode: "Advance", n: 2 }),
  E(1, 0, "oc", "down", "dp", {}),
  E(1, 0, "oc", "note", null, { text: "DP chose to keep fighting" }),
  E(1, 1, "hp", "act", "hp", { name: "Lay on Hands", ap: 3, multiAp: true, tg: [{ id: "dp", name: "Dwarf Paladin", tier: null }] }),
  E(1, 1, "hp", "heal", "dp", { n: 18, rp: 2 }),
  E(1, 1, "hp", "up", "dp", {}),
  E(2, 0, "oc", "act", "oc", { name: "Ground Slam", ap: 3, tg: [{ id: "dp", name: "Dwarf Paladin" }, { id: "hp", name: "Human Paladin" }], save: "Body" }),
  E(2, 0, "oc", "push", "oc", { target: R("g1"), mode: "Pushed", n: 2, note: "hits a wall" }),
  E(2, 0, "oc", "cond", "dp", { name: "Prone" }),
  E(2, 1, "g2", "act", "g2", { name: "Rusty Knife", ap: 1, tg: [{ id: "na", name: "Nari", tier: 2 }] }, { txt: "RK vs Nari T2 (forced)" })
];
console.log("one line:", L.lineText(log[4]), "|", L.lineText(log[6]), "|", L.lineText(log[14]), "|", L.lineText(log[12]), "| edited:", L.lineText(log[17]));
console.log("turns:", L.turnsOf(log).map(t => `${t.r}.${t.t} ${t.items.length}`).join(", "), "| with the removed line:", L.turnsOf(log, { all: true })[0].items.length);
console.log("--- the copy (short names)");
console.log(L.exportText(log, { abbr: ab }));
console.log("--- full names, with damage and conditions");
console.log(L.exportText(log, { abbr: ab, short: false, details: true }));
const act = src("module/actions.mjs"), mv = src("module/move.mjs"), cb = src("module/combat.mjs"), tw = src("module/twod12.mjs");
console.log("--- wired: Actions", act.includes("logAction(selfToken ?? actor, item"), "| movement", mv.includes('logMove(c.token?.object ?? c.actor, logMode || (useEvade ? "Evade" : "Advance"), cost)') && mv.includes('{ logMode: "Charge" }'), "| Pushed / Pulled", mv.includes("logPush(origin, target"),
  "| Reset Turn removes the turn", cb.includes('voidTurn(combat, snap.round, snap.turn, "Reset Turn")'), "| a Charge given up", mv.includes('"Charge given up")'), "| the toolbar button", tw.includes('name: "twod12-enclog"'));
