// Run with: node tools/tests/run.mjs (or node tools/tests/t304.mjs)
// v0.0.496 (Lucas's v0.0.495 report + QoL):
// (1) Option B LoE/Cover lines: dark-cased emerald (#34d399) & crimson (#f0473a) dashed rays (9/6), ringed dots with white X on blocked corners;
// (2) sightgate cornerInLos tuned to 0.25*gs + square centers: hides razor-thin 4-15px wall slivers while keeping >=25% peeking Large squares visible;
// (3) dragRangeSquares + drag-to-Advance refreshToken preview (both GM and players) + remaining moveLeft range kept visible after drag;
// (4) Undo Movement (Ctrl+Z priority keybinding + Situational button): refunds 2d12 AP/flags/turnLog/enclog AND calls Foundry V14 revertRecordedMovement(),
//     with fallback to doc.update + clearMovementHistory, and returns false from Ctrl+Z when no 2d12 combat move is queued.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(ROOTURL);
const src = f => fs.readFileSync(ROOT + f, "utf8");

globalThis.Hooks = { on() {}, off() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {}, Canvas: { detectionModes: {} } };
globalThis.CONST = { KEYBINDING_PRECEDENCE: { PRIORITY: 1 } };
const infos = [];
globalThis.ui = { notifications: { info: m => infos.push(m), warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)), randomID: () => "id_1" }
};
globalThis.game = {
  system: { version: "0.0.496" },
  user: { id: "gm", isGM: true, isActiveGM: true },
  settings: { register() {}, get: () => true },
  combat: null
};
globalThis.canvas = {
  grid: { size: 100, distance: 1, isSquare: true },
  environment: { darknessLevel: 0.1 },
  scene: { environment: { globalLight: { enabled: true } } },
  effects: { lightSources: [], darknessSources: [] },
  regions: { placeables: [] },
  tokens: { controlled: [], placeables: [], get: () => null },
  activeLayer: null
};
globalThis.canvas.activeLayer = globalThis.canvas.tokens;

// 1. Option B LoE lines
const loe = src("module/loe.mjs");
console.log("loe Option B colors & casing & blocked X:",
  loe.includes("GREEN = 0x34d399, RED = 0xf0473a, AMBER = 0xff6b2b, CASE = 0x111315, RING = 0x141210")
  && loe.includes("dashed(c.origin, k, CASE, 4.8, 0.55);")
  && loe.includes("dashed(c.origin, k, k.blocked ? RED : GREEN, 2.6, 0.96);")
  && loe.includes("g.lineStyle(1.6, 0xffffff, 1).moveTo(k.x - 3, k.y - 3)"));

// 2. sightgate cornerInLos tuned to 0.25*gs + centers
const SG = await import(ROOTURL + "module/sightgate.mjs");
const ogre = { id: "ogre", name: "Ogre", document: { x: 300, y: 100, width: 2, height: 2, hidden: false }, actor: { name: "Ogre", statuses: new Set(), system: {} } };
// Sliver along bottom edge (only bottom 12px y >= 288 is lit — like Lucas's v0.0.495 screenshots): MUST stay hidden!
const sliverPoly = { contains: (x, y) => x >= 400 && y >= 288 };
// Quarter-square peek (bottom-right square's lower-right quarter at (475, 275) is lit): MUST stay visible!
const quarterPoly = { contains: (x, y) => x >= 470 && y >= 270 };
// Center-only peek of bottom-right square (450, 250): MUST stay visible!
const centerPoly = { contains: (x, y) => Math.hypot(x - 450, y - 250) <= 10 };
const obs = { id: "syl", actor: { statuses: new Set(), system: { senses: {} } } };
console.log("cornerInLos sliver hidden / quarter visible / square-center visible:",
  SG.cornerInLos({ x: 50, y: 350, los: sliverPoly, shape: sliverPoly, object: obs }, { range: Infinity }, ogre, "lightPerception"),
  SG.cornerInLos({ x: 50, y: 350, los: quarterPoly, shape: quarterPoly, object: obs }, { range: Infinity }, ogre, "lightPerception"),
  SG.cornerInLos({ x: 50, y: 350, los: centerPoly, shape: centerPoly, object: obs }, { range: Infinity }, ogre, "lightPerception"));

// 3. dragRangeSquares helper
const MV = await import(ROOTURL + "module/move.mjs");
const makeCbt = ({ id = "c1", tokenId = "t1", name = "Sylwen", speed = 6, ap = 4, evadeMove = 0, freeMove = 0, moveLeft = 0, diagPar = 0, immob = false, turnLog = [] } = {}) => {
  const flags = { ap, evadeMove, freeMove, moveLeft, diagPar, advOwn: false, advInteract: false, turnLog };
  return {
    id, tokenId, name, isOwner: true,
    actor: { name, system: { moveSpeed: speed, speed }, statuses: new Set(immob ? ["immobilized"] : []) },
    getFlag: (ns, k) => flags[k],
    update: async patch => {
      for (const [k, v] of Object.entries(patch)) {
        const m = k.match(/^flags\.twod12\.(.+)$/);
        if (m) flags[m[1]] = v;
      }
    },
    _flags: flags
  };
};
const combat = { id: "cb1", started: true, round: 1, turn: 0, combatant: null, combatants: new Map() };
const syl = makeCbt({ ap: 4, speed: 6 });
combat.combatant = syl;
combat.combatants.set(syl.id, syl);
globalThis.game.combat = combat;

console.log("dragRangeSquares own turn (AP 4, speed 6):", JSON.stringify(MV.dragRangeSquares(syl, combat)),
  "| remaining moveLeft 4:", JSON.stringify(MV.dragRangeSquares(makeCbt({ moveLeft: 4, ap: 3 }), combat)),
  "| evading 3 par 1:", JSON.stringify(MV.dragRangeSquares(makeCbt({ evadeMove: 3, diagPar: 1 }), combat)),
  "| 0 AP:", JSON.stringify(MV.dragRangeSquares(makeCbt({ ap: 0, speed: 6 }), combat)),
  "| immobilized:", JSON.stringify(MV.dragRangeSquares(makeCbt({ ap: 4, speed: 6, immob: true }), combat)),
  "| off turn no free:", JSON.stringify(MV.dragRangeSquares(makeCbt({ id: "c2", ap: 4, speed: 6 }), combat)));

// 4. Undo Movement stack, Foundry revertRecordedMovement, and Ctrl+Z passthrough
let revertedCalls = 0, updatedPos = null, clearedHist = 0;
const doc = {
  id: "t1", uuid: "Scene.s.Token.t1", name: "Sylwen", isOwner: true,
  x: 300, y: 100, elevation: 0,
  movementHistory: [{ x: 100, y: 100 }, { x: 300, y: 100 }],
  revertRecordedMovement: async () => { revertedCalls++; doc.x = 100; doc.y = 100; doc.movementHistory = []; },
  clearMovementHistory: async () => { clearedHist++; doc.movementHistory = []; },
  update: async pos => { updatedPos = pos; doc.x = pos.x; doc.y = pos.y; }
};
globalThis.canvas.tokens.get = id => (id === "t1" ? { id: "t1", isOwner: true, document: doc } : null);
globalThis.canvas.tokens.controlled = [{ id: "t1", isOwner: true, document: doc }];

// No undo queued -> Ctrl+Z returns false (Foundry default undo runs!)
MV.clearMoveUndo();
console.log("Ctrl+Z returns false when stack empty:", MV.undoMoveShortcut());

// Simulate a drag-paid 2 sq move from (100,100) to (300,100): AP 4->3, moveLeft 0->4
const snap = MV.snapshotMoveUndo(syl, { doc, from: { x: 100, y: 100, elevation: 0 }, to: { x: 300, y: 100, elevation: 0 }, histLen: 0 }, 2);
snap.spentAp = 1;
snap.openedBanner = true;
syl._flags.ap = 3; syl._flags.moveLeft = 4; syl._flags.advOwn = true;
MV.recordMoveUndo(snap);
console.log("canUndoMove after drag:", MV.canUndoMove("t1"), "| pickUndoTokenId:", MV.pickUndoTokenId());

const ok = await MV.undoLastMove("t1");
console.log("undoLastMove ok:", ok,
  "| revertRecordedMovement called:", revertedCalls,
  "| doc back at (100,100):", `${doc.x},${doc.y}`,
  "| movementHistory cleared:", doc.movementHistory.length === 0,
  "| AP restored to 4:", syl._flags.ap,
  "| moveLeft restored to 0:", syl._flags.moveLeft,
  "| stack empty now:", !MV.canUndoMove("t1"),
  "| notification:", infos[infos.length - 1]);

// Fallback path when revertRecordedMovement is unavailable: doc.update + clearMovementHistory
const docFallback = {
  id: "t2", uuid: "Scene.s.Token.t2", name: "Kaela", isOwner: true,
  x: 400, y: 200, elevation: 0,
  movementHistory: [{ x: 200, y: 200 }],
  clearMovementHistory: async () => { clearedHist++; docFallback.movementHistory = []; },
  update: async pos => { updatedPos = pos; docFallback.x = pos.x; docFallback.y = pos.y; }
};
const kaela = makeCbt({ id: "c2", tokenId: "t2", name: "Kaela", ap: 3, freeMove: 4 });
combat.combatants.set(kaela.id, kaela);
const snap2 = MV.snapshotMoveUndo(kaela, { doc: docFallback, from: { x: 200, y: 200, elevation: 0 }, to: { x: 400, y: 200, elevation: 0 }, histLen: 0 }, 2);
kaela._flags.freeMove = 2;
MV.recordMoveUndo(snap2);
const ok2 = await MV.undoLastMove(docFallback);
console.log("fallback undo ok:", ok2,
  "| doc.update called:", JSON.stringify(updatedPos),
  "| clearMovementHistory called:", clearedHist,
  "| freeMove restored to 4:", kaela._flags.freeMove);

// 5. Keybinding & Situational Undo button wiring
const tw = src("module/twod12.mjs"), mv = src("module/move.mjs");
console.log("wired: Ctrl+Z keybinding & Situational Undo button & preMoveToken undo guard:",
  tw.includes('game.keybindings.register("twod12", "undoMovement"')
  && tw.includes('key: "KeyZ", modifiers: ["Control"]')
  && mv.includes('class="lb-go lb-undo"')
  && mv.includes('if (movement?.method === "undo")')
  && mv.includes("export function dragRangeSquares("));
