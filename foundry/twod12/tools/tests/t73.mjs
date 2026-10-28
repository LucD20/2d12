// Run with: node tools/tests/run.mjs (or node tools/tests/t73.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Required Linked Actions: how many creatures a Target needs, and who is within Reach after a Charge.
const GS = 100;
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f } };
const tokens = [];
globalThis.canvas = { grid: { size: GS, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }) }, tokens: { placeables: tokens } };
const { targetsNeeded } = await import(ROOTURL + "module/config.mjs");
const { creaturesInReach } = await import(ROOTURL + "module/move.mjs");
for (const t of ["One creature", "Two creatures", "Three different creatures", "4 creatures", "All creatures in the Area", "", "Self"]) console.log(`targets needed for ${JSON.stringify(t)}:`, targetsNeeded(t));
const tok = (id, name, i, j, disp, w = 1) => ({ name, actor: {}, document: { id, x: j * GS, y: i * GS, width: w, height: w, disposition: disp, hidden: false } });
const me = tok("me", "Paladin", 5, 5, 1);
tokens.push(me, tok("a", "Ally", 5, 6, 1), tok("g", "Goblin", 5, 8, -1), tok("o", "Ogre", 2, 5, -1, 2), tok("h", "Hidden thief", 4, 4, -1));
tokens.at(-1).document.hidden = true;
const names = r => creaturesInReach(me, r).map(t => t.name).join(", ") || "nobody";
console.log("Reach 1 (ally adjacent, a hidden thief diagonal):", names(1));
console.log("Reach 2 (the 2x2 Ogre's edge is 2 away):", names(2));
console.log("Reach 3 (the Goblin is 3 away):", names(3));
