// Run with: node tools/tests/run.mjs (or node tools/tests/t292.mjs)
// v0.0.470 (Lucas, 2026-11-20, a rule: "Yes, I want this rule"; book, Chapter 3, Forced Movement): a creature as the origin of a push or a pull is
// measured from its square nearest the moved creature, not from its center: a Large creature pushes straight away from the side it touches.
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { debounce: f => f, deepClone: o => JSON.parse(JSON.stringify(o)) } };
const M = await import(ROOTURL + "module/move.mjs");
const ogre = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 1, j: 1 }], aveline = [{ i: 0, j: 2 }];
console.log("the square measured from:", JSON.stringify(M.nearestOriginCell(ogre, aveline)), "| a one-square origin:", JSON.stringify(M.nearestOriginCell([{ i: 5, j: 5 }], aveline)));
const ends = map => [...map.values()].filter(n => n.steps === 1).map(n => `${n.di},${n.dj}`).sort().join(" ");
console.log("Pushed 1, Aveline beside the Ogre's top row, its first steps (di,dj):", ends(M.pushShifts(aveline, ogre, 1)), "(down-right 1,1 now allowed; was up-right and right only)");
console.log("beside its bottom row:", ends(M.pushShifts([{ i: 1, j: 2 }], ogre, 1)));
const goblin = [{ i: 0, j: 4 }];
console.log("Pulled 2 toward the Ogre from 2 squares right of its top row, first steps:", ends(M.pullShifts(goblin, ogre, 2)));
