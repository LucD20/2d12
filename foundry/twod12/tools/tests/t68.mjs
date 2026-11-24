// Run with: node tools/tests/run.mjs (or node tools/tests/t68.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const GS = 100, hooks = {};
globalThis.Hooks = { on: (h, f) => (hooks[h] = f) };
globalThis.game = { settings: { get: (s, k) => ({ lightDimBelow: 0.7, lightDarkBelow: 0.4 }[k]) }, user: { isGM: true } };
globalThis.ui = { notifications: { info() {} } };
globalThis.foundry = { applications: { api: { ApplicationV2: class {}, DialogV2: {} } }, utils: { debounce: f => f } };
const fills = [];
globalThis.PIXI = { Graphics: class { clear() { fills.length = 0; } beginFill(c) { this.c = c; } drawRect(x, y) { fills.push([x, y, this.c]); } endFill() {} } };
const light = { active: true, data: { x: 450, y: 450, bright: 200, dim: 400 }, shape: { contains: () => true } };   // center of square (4,4): Bright 2, Dim 4
globalThis.canvas = { ready: true, grid: { size: GS, isSquare: true }, dimensions: { sceneRect: { x: 0, y: 0, width: 900, height: 900 } }, environment: { darknessLevel: 1 }, effects: { lightSources: [light], darknessSources: [] }, interface: { addChild() {} } };
const ov = await import(ROOTURL + "module/lightoverlay.mjs");
ov.registerLightOverlay();
ov.toggle(true);
const grid = Array.from({ length: 9 }, () => Array(9).fill(" ."));
for (const [x, y, c] of fills) grid[Math.floor(y / GS)][Math.floor(x / GS)] = c === 0xc0392b ? " X" : " d";
console.log(". Bright (clear), d Dim (yellow), X Darkness (red); light at the center: Bright 2, Dim 4");
console.log(grid.map(r => r.join("")).join("\n"));
console.log("Dim squares:", fills.filter(f => f[2] === 0xd8b02a).length, "| Darkness squares:", fills.filter(f => f[2] === 0xc0392b).length, "| Bright (no tint):", 81 - fills.length);
// v0.0.487: Light Levels Overlay moved into the consolidated 2d12 Tools drawer (toolbox.mjs)
const tb = await import(ROOTURL + "module/toolbox.mjs");
const lightItem = tb.toolboxGroups({ isGM: true }).flatMap(g => g.items).find(i => i.id === "light");
const v12 = [{ name: "token", tools: [] }]; tb.addToolboxControl(v12);
const v13 = { tokens: { tools: { select: {} } } }; tb.addToolboxControl(v13);
console.log("button added: V12 style", v12[0].tools.length === 1, "| V13+ style", !!v13.tokens.tools["twod12-tools"], "| light toggle in toolbox:", !!lightItem?.toggle);
