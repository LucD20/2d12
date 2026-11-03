// Run with: node tools/tests/run.mjs (or node tools/tests/t125.mjs)
// v0.0.146 (Pass B of the core rules update): Slowed and Quickened, the AP cap, Round = once per turn-cycle, no Round default for Weapon,
// no swapping while Down, Reload as a Weapon Action against DC 13, Imperiled and Immobilized texts.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).docs, cdoc = (n, t = "action") => CDOCS.find(d => d.name === n && d.type === t);   // v0.0.230 (pack CS): the cards are data (book/cards), read from the built content
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1 } };
globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null };
const cb = await import(ROOTURL + "module/combat.mjs");
const fx = (id, value) => ({ statuses: new Set([id]), getFlag: (s, k) => (k === "value" ? value : undefined) });
const actor = (effects = [], statuses = []) => ({ effects, statuses: new Set(statuses), system: {} });
const c = a => ({ actor: a });
const row = (label, a) => `${label}: regain ${cb.apPerTurn(c(a))}, most ${cb.apMax(c(a))}`;
console.log([
  row("healthy", actor()), row("Slowed 2", actor([fx("slowed", 2)])), row("Quickened 2", actor([fx("quickened", 2)])),
  row("Quickened 2 + Slowed 2", actor([fx("quickened", 2), fx("slowed", 2)])), row("Desperate", actor([], ["desperate"])),
  row("Dying + Slowed 3", actor([fx("slowed", 3)], ["dying"])), row("Dying + Slowed 1", actor([fx("slowed", 1)], ["dying"])),
  row("Imperiled", actor([], ["imperiled"])), row("Slowed 9", actor([fx("slowed", 9)]))
].join(" | "));
const G = await import(ROOTURL + "module/config.mjs");
console.log("Frequency: Weapon with none", JSON.stringify(G.effectiveFrequency({ frequency: "", traits: new Set(["weapon"]) })), "| Round", G.effectiveFrequency({ frequency: "round", traits: new Set() }));
console.log("Vs.: Reload", G.vsText({ traits: new Set(["handle", "weapon"]), versions: [{ noTiers: false }] }), "| Weapon Attack", G.vsText({ traits: new Set(["strike", "weapon"]), versions: [{ noTiers: false }] }));
// Round: once per turn-cycle. The creature is 3rd in the order (turn index 2).
const us = await import(ROOTURL + "module/usage.mjs");
const me = { type: "character", id: "A", getFlag: (s, k) => (k === "usage" ? store : undefined), effects: [] };
const item = { id: "R", type: "action", system: { frequency: "round", traits: new Set() } };
let store = {};
const at = (round, turn, usedAt) => { game.combat = { id: "c", started: true, round, turn, turns: [{ actor: {} }, { actor: {} }, { actor: me }] }; store = { combatId: "c", roundAt: usedAt ? { R: usedAt } : {} }; return us.isFaded(me, item).faded; };
console.log("Round, used on its own turn (round 1, turn 2):", ["r1 t2", "r2 t0", "r2 t1", "r2 t2"].map(k => { const [r, t] = k.match(/\d+/g).map(Number); return `${k} ${at(r, t, [1, 2]) ? "used" : "free"}`; }).join(", "));
console.log("Round, used as a Reaction before its turn (round 2, turn 0):", ["r2 t1", "r2 t2", "r3 t0"].map(k => { const [r, t] = k.match(/\d+/g).map(Number); return `${k} ${at(r, t, [2, 0]) ? "used" : "free"}`; }).join(", "));
console.log("Round, used at the end of the order (round 1, turn 2), new round starts: r2 t0", at(2, 0, [1, 2]) ? "used" : "free", "(the rules' example)");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const combat = src("module/combat.mjs"), basic = src("module/basic.mjs"), content = src("tools/content.mjs"), main = src("module/twod12.mjs"), car = src("module/carousel.mjs");
console.log("no swap while Down:", combat.includes("is Down and can't swap initiative"), "| AP over the most only when edited:", combat.includes('why === "edited" ? want : Math.min(want, Math.max(apMax(c), from))'), "| tracker shows the most:", car.includes("Math.max(apMax(c), ap, 1)"));
console.log("Reload is [Handle, Weapon]:", JSON.stringify(BD.reload.traits) === '["handle","weapon"]', "| Slowed and Quickened conditions:", content.includes('cond("Slowed"') && content.includes('cond("Quickened"') && main.includes('["slowed", ') && main.includes('["quickened", '));
console.log("Imperiled: Slowed 1:", content.includes("you are Slowed 1 for that turn"), "| Immobilized: 1 AP [Move] (v0.0.224):", content.includes("by spending 1 AP [Move]"), "| old Weapon Actions set to Round once:", main.includes('"weaponRoundApplied"'));
console.log("Smite, Reaping Sweep and Lock & Loose say Round:", ["Smite", "Reaping Sweep", "Lock & Loose"].every(n => cdoc(n).system.distance === "weapon" && cdoc(n).system.frequency === "round"));
