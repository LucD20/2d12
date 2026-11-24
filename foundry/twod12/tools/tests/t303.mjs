// Run with: node tools/tests/run.mjs (or node tools/tests/t303.mjs)
// v0.0.495 (Lucas's v0.0.494 report fixes):
// (1) Test checklist world setting defaults ON;
// (2) sightgate cornerInLos keeps Large/peeking tokens visible whenever any occupied 1x1 square corner is inside visionSource.los;
// (3) moment.mjs isInertMover skips dead/defeated/unconscious movers; dragSlabs blocks Trigger/Interrupt cross-drag in dragover & dragend;
// (4) moveBanner mounts freeMoveBar so Basic Actions Advance & Evade surface End movement in the HUD Situational tab;
// (5) .twod12 .calc:not(.twod12-inline) keeps calculated inline buttons full-size; .tp-tgt i centered at 10px inside 16px badge.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(ROOTURL);
const src = f => fs.readFileSync(ROOT + f, "utf8");

globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {}, Canvas: { detectionModes: {} } };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id_1" }
};
globalThis.game = { system: { version: "0.0.495" }, user: { id: "gm", isGM: true, isActiveGM: true }, settings: { register() {}, get: () => true } };
globalThis.canvas = { grid: { size: 100, distance: 1, isSquare: true }, environment: { darknessLevel: 0.1 }, scene: { environment: { globalLight: { enabled: true } } }, effects: { lightSources: [], darknessSources: [] }, regions: { placeables: [] }, tokens: { controlled: [], placeables: [] } };

// 1. Test checklist default ON
const chk = src("module/checklist.mjs");
console.log("testChecklist default true:", chk.includes('game.settings.register(F, "testChecklist"') && chk.includes("type: Boolean, default: true"));

// 2. sightgate cornerInLos (Image 3: 2x2 Ogre with only bottom-left corner inside sight polygon)
const SG = await import(ROOTURL + "module/sightgate.mjs");
const ogre = { id: "ogre", name: "Ogre", document: { x: 300, y: 100, width: 2, height: 2, hidden: false }, actor: { name: "Ogre", statuses: new Set(), system: {} } };
// Only bottom-left corner of Ogre's (300..400, 200..300) square around (304, 296) is inside los polygon:
const peekPoly = { contains: (x, y) => x <= 310 && y >= 290 };
const blockedPoly = { contains: () => false };
const vsPeek = { x: 550, y: 450, los: peekPoly, shape: peekPoly, object: { id: "syl", actor: { statuses: new Set(), system: { senses: {} } } } };
const vsBlocked = { x: 550, y: 450, los: blockedPoly, shape: blockedPoly, object: vsPeek.object };
console.log("cornerInLos peeking 2x2 Ogre:", SG.cornerInLos(vsPeek, { range: Infinity }, ogre, "lightPerception"),
  "| fully behind wall:", SG.cornerInLos(vsBlocked, { range: Infinity }, ogre, "lightPerception"),
  "| out of range (1 sq):", SG.cornerInLos(vsPeek, { range: 1 }, ogre, "basicSight"),
  "| zero range basicSight:", SG.cornerInLos(vsPeek, { range: 0 }, ogre, "basicSight"));
const hiddenOgre = { ...ogre, document: { ...ogre.document, hidden: true } };
console.log("cornerInLos skips GM-hidden token:", SG.cornerInLos(vsPeek, { range: Infinity }, hiddenOgre, "lightPerception"));

// 3. moment.mjs: isInertMover + dragSlabs Interrupt/Trigger guard
const M = await import(ROOTURL + "module/moment.mjs");
const aliveNpc = { type: "npc", statuses: new Set(), system: { atZero: false } };
const deadNpc = { type: "npc", statuses: new Set(["dead"]), system: { atZero: true } };
const defeatedCbt = { isDefeated: true, defeated: true };
const dyingPc = { type: "character", statuses: new Set(["dying"]), system: { atZero: true } };
const uncPc = { type: "character", statuses: new Set(["unconscious"]), system: { atZero: true } };
console.log("isInertMover alive/dead/defeated/dyingPC/unconsciousPC:",
  M.isInertMover(aliveNpc),
  M.isInertMover(deadNpc),
  M.isInertMover(aliveNpc, defeatedCbt),
  M.isInertMover(dyingPc),
  M.isInertMover(uncPc));
const mo = src("module/moment.mjs");
console.log("moveMoment checks isInertMover & dragSlabs guards kindRank:",
  mo.includes("if (isInertMover(actor, cbt, doc)) return;")
  && mo.includes("if (kindRank(rowOf(dragged)) !== kindRank(rowOf(over))) return;")
  && mo.includes("if (!validOrder(now)) {"));

// 4. move.mjs: moveBanner mounts freeMoveBar for End movement in Situational tab
const mv = src("module/move.mjs");
console.log("moveBanner mounts freeMoveBar:", mv.includes("closeSit = freeMoveBar(c, kind, what, { drag, onEnd: () => finish(true)") && mv.includes("try { closeSit?.(); }"));

// 5. CSS: calculated inline button size & centered .tp-tgt crosshair
const css = src("styles/system.css"), th = src("styles/theme.css");
console.log("calc inline buttons keep full size:", css.includes(".twod12 .calc:not(.twod12-inline)"),
  "| tp-tgt icon centered:", th.includes(".tp-tgt i, .twod12-type.twod12-type #twod12-carousel .tp-hid i { margin: 0 !important; font-size: 10px; line-height: 1; display: block; }"));
