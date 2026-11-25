// Run with: node tools/tests/run.mjs (or node tools/tests/t313.mjs)
// v0.0.511 (Lucas, 2026-11-25: "Do 1, then 2"; core rework section R and the Bestiary's ask): the Encounter Log's new lines and report sections:
// Flanking on a [Melee] Action's targets (by side, the cancels), moves refused by blocking (move.mjs logBlocked), a card's Check (inline.mjs logCheck:
// Tumble's against its targets), and what cards took off each enemy's damage (enclog.mjs cardShare: another creature's reduction or Judge, Guard a card
// gave; the unspent AP's Guard and Resist are not cards), with "would reach a plain PC".
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Hooks = { on() {}, once() {} }; globalThis.Combat = class {}; globalThis.CONFIG = { time: {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id1" } };
globalThis.game = { settings: { register() {}, get: () => true, set: async () => {} }, user: { isGM: true } };
const EL = await import(ROOTURL + "module/enclog.mjs");

console.log("cardShare:", EL.cardShare([{ kind: "reduce", label: "Judge (Aveline)", v: 2, byUuid: "A" }, { kind: "reduce", label: "Shield of Faith", v: 3, byUuid: "D" }, { kind: "guard", label: "Guard", v: 5, ap: 2 }, { kind: "reduce", label: "Reduction", v: 1 }]),
  "| AP Guard only:", EL.cardShare([{ kind: "guard", v: 4, ap: 4 }]), "| none:", EL.cardShare([]));
const crs = [{ id: "av", name: "Aveline", fullName: "Aveline", abbr: "Av", side: "pc", maxHp: 35 }, { id: "ka", name: "Kaela", fullName: "Kaela", abbr: "Ka", side: "pc", maxHp: 29 },
  { id: "or", name: "Orc Warrior", fullName: "Orc Warrior", abbr: "OW", side: "npc", maxHp: 60 }, { id: "gs", name: "Goblin Sneak", fullName: "Goblin Sneak", abbr: "GS", side: "npc", maxHp: 30 }];
const L = (k, who, d, r = 1, t = 0) => ({ id: `${k}${Math.random()}`, r, t, own: { id: who.id, name: who.name }, k, who, d });
const av = { id: "av", name: "Aveline" }, ka = { id: "ka", name: "Kaela" }, ow = { id: "or", name: "Orc Warrior" }, gs = { id: "gs", name: "Goblin Sneak" };
const log = [
  L("act", av, { name: "Basic Attack", ap: 1, tg: [{ id: "or", name: "Orc Warrior", tier: 2, flank: 1 }] }),
  L("act", ow, { name: "Cleaver", ap: 2, tg: [{ id: "av", name: "Aveline", tier: 3, flankCancel: true }] }),
  L("dmg", av, { n: 4, v: 4, r: 0, text: "4 Vigor", raw: 10, reducedBy: 6, reducedNote: "Judge (Aveline) −2, Guard −4", origin: ow, cards: 4, target: av }),
  L("dmg", ka, { n: 5, v: 5, r: 0, text: "5 Vigor", raw: 7, reducedBy: 2, reducedNote: "Guard −2", origin: gs, cards: 0, target: ka }),
  L("block", ka, { by: "Orc Warrior", mode: "Advance" }, 2, 1),
  L("act", ka, { name: "Tumble", ap: 1, tg: [] }, 2, 1),
  L("check", ka, { label: "Instinct Check", total: 15, dc: 14, tier: 2, vs: "Orc Warrior, Goblin Sneak", banes: 1 }, 2, 1)
];
console.log("lines:", log.map(e => EL.lineText(e)).filter(Boolean).join(" | "));
const st = EL.computeEncounterStats(log, crs);
console.log("flanks:", JSON.stringify(st.sectionR.flankCount), "| blocks:", st.sectionR.blocks.length, "| checks:", st.sectionR.checks.length);
console.log("Orc:", JSON.stringify((({ rawDealt, removedOff, cardsOff }) => ({ rawDealt, removedOff, cardsOff }))(st.rows.find(r => r.id === "or"))), "| Aveline cardsTaken:", st.rows.find(r => r.id === "av").cardsTaken);
const md = EL.exportAnalysis(log, crs, { title: "Test" });
for (const l of md.split("\n").filter(l => /What Cards Took|^\| (Orc Warrior|Goblin Sneak) \||Flanking Boons|refused by blocking|Checks \(/.test(l))) console.log(l);
console.log("wired: actions (flank)", src("module/actions.mjs").includes("t.flankCancel = true"), "| move (logBlocked)", (src("module/move.mjs").match(/logBlocked\(/g) ?? []).length, "| inline (logCheck)", src("module/inline.mjs").includes("logCheck(actor"), "| ccdamage (mods)", src("module/ccdamage.mjs").includes("mods: report.mods"), "| damage (Guard's ap)", src("module/damage.mjs").includes("ap: g.takenAp"));
