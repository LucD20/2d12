// Run with: node tools/tests/run.mjs (or node tools/tests/t289.mjs)
// v0.0.460 (Lucas, checklist v0.0.459, large-difficult: "a 2x2 token moving through a 1x1 token ... should take two movements to completely move
// around them and this would be 4 squares ... Instead of 2"): each step whose covered squares hold an unwilling creature costs 1 more.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const GS = 100;
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { debounce: f => f, deepClone: o => JSON.parse(JSON.stringify(o)) } };
const tokens = [];
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }) }, tokens: { placeables: tokens } };
const { creaturesOnPath } = await import(ROOTURL + "module/move.mjs");
const tok = (id, name, i, j, disp, w = 1) => ({ name, actor: {}, document: { id, x: j * GS, y: i * GS, width: w, height: w, disposition: disp, hidden: false } });
const P = (i, j) => ({ x: j * GS, y: i * GS });
tokens.push(tok("g", "Goblin", 1, 2, -1));
const big = { id: "me", x: 0, y: 0, width: 2, height: 2, disposition: 1, actor: { system: {}, statuses: new Set() } };
const small = { ...big, width: 1, height: 1 };
for (const [label, who, pts] of [["2x2 past a 1x1 Goblin (0,0 -> 0,3): two steps beside it", big, [P(0, 0), P(0, 3)]], ["2x2 one step onto it (0,0 -> 0,1)", big, [P(0, 0), P(0, 1)]],
  ["1x1 straight through the Goblin (1,0 -> 1,4)", small, [P(1, 0), P(1, 4)]], ["1x1 beside it (0,0 -> 0,4)", small, [P(0, 0), P(0, 4)]]]) {
  const r = creaturesOnPath(who, pts); console.log(label.padEnd(58), "extra", r.extra, "| through", r.through.join(", ") || "-");
}
