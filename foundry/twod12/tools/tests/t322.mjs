// Run with: node tools/tests/run.mjs (or node tools/tests/t322.mjs)
// v0.0.524 (Lucas, 2026-11-26: "Band: this shouldn't be in the book [...] It is a designers thing only. But for our notes, it should be 3 for deadly."):
// the Encounter Log names a fight by its cost in Rally Points a PC (book/bestiary-design.md, "The designers' measure of a fight"):
// all the damage that reached the PCs' Health, divided by what one Rally Point of each PC removes (ceil(Health Pool / 4) each, added).
// Easy up to 1¼; Normal above 1¼ up to 2; Hard above 2 up to 3; Deadly above 3. No "Trivial", no percentage cuts.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.Hooks ??= { on() {}, once() {} };
globalThis.Combat ??= class {};
globalThis.CONFIG ??= { time: {} };
globalThis.ui ??= { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry ??= { applications: { api: { ApplicationV2: class {}, DialogV2: {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id1" } };
globalThis.game ??= { system: { version: "0.0.524" }, user: { id: "gm", isGM: true, isActiveGM: true }, i18n: { localize: s => s }, settings: { register() {}, get: () => [], set: async () => {} } };
const EL = await import(ROOTURL + "module/enclog.mjs");

// 1. The edges
const edges = [0, 1, 1.25, 1.26, 2, 2.01, 3, 3.01, 4.5].map(c => `${c}: ${EL.fightDifficulty(c).text} (${EL.fightDifficulty(c).cls})`);
console.log("1. edges:", edges.join(" | "));

// 2. Playtest 8's party (Health 35, 35, 29, 29: one Rally Point each removes 9 + 9 + 8 + 8 = 34), 45 to Health in all
const pc = (id, pool, rallyHeal) => ({ id, name: id, side: "pc", maxHp: pool, rallyHeal });
const creatures = [pc("Aveline", 35, 9), pc("Durgan", 35, 9), pc("Sylwen", 29, 8), pc("Kaela", 29, 8), { id: "OC", name: "Ogre Chieftain", side: "npc", maxHp: 72 }];
const dmg = (id, n, healed = 0) => [
  { id: `d${id}`, r: 1, t: 0, k: "dmg", who: { id }, d: { n, v: n, r: 0, raw: n, reducedBy: 0, origin: { id: "OC" } } },
  ...(healed ? [{ id: `h${id}`, r: 2, t: 0, k: "heal", who: { id }, d: { target: { id }, n: healed, rp: 1 } }] : [])
];
const log = [...dmg("Aveline", 20, 9), ...dmg("Durgan", 10), ...dmg("Sylwen", 8), ...dmg("Kaela", 7)];
const st = EL.computeEncounterStats(log, creatures);
console.log("2. playtest 8:", `net ${st.party.net}, one Rally Point each ${st.party.rallyOne}, cost ${st.party.rpCost.toFixed(2)}`, "|", st.difficulty.text, "| healed damage still counts:", st.party.net === 45);

// 3. No rallyHeal given (an archive from before v0.0.524): ceil(Health Pool / 4)
const st2 = EL.computeEncounterStats(log, creatures.map(c => ({ ...c, rallyHeal: undefined })));
console.log("3. fallback:", st2.party.rallyOne, st2.difficulty.text);

// 4. The report text, the JSON and the window's legend follow; the old cuts are gone
const md = EL.exportAnalysis(log, creatures);
console.log("4. report line:", md.split("\n").find(l => l.startsWith("**Party Health Cost:**")));
const js = JSON.parse(EL.exportJson(log, creatures));
console.log("   json:", js.difficulty, js.rpCost, "| no g9 key:", !("g9" in js));
const srcTxt = fs.readFileSync(ROOT + "module/enclog.mjs", "utf8");
console.log("   legend:", EL.DIFFICULTY_LEGEND, "| old cuts gone:", !/Trivial|G9 targets|g9DifficultyBand|35–45%/.test(srcTxt));
