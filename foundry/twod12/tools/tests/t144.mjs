// Run with: node tools/tests/run.mjs (or node tools/tests/t144.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.177: a light of size N reaches the squares of an N Emanation (the half square Foundry leaves out is added), and Regions snap to whole squares.
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
const lr = await import(ROOTURL + "module/lightradius.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const GS = 100;
// the squares whose centers are within the radius, around a light on the center of square (0, 0) or on the corner (0, 0)
const count = (cx, cy, r) => { let n = 0; for (let i = -8; i <= 8; i++) for (let j = -8; j <= 8; j++) if (Math.hypot(j * GS + 50 - cx, i * GS + 50 - cy) <= r + 0.5) n++; return n; };
console.log("a scene light on a square's center (radius 1, 2, 3 typed; Foundry's own radius vs the system's):");
for (const n of [1, 2, 3]) console.log(`  ${n}: Foundry ${count(50, 50, n * GS)} squares, the system ${count(50, 50, lr.radiusPx(n, 0.5, GS, GS))} squares`);
console.log("a scene light on a corner (a Burst): 1 ->", count(0, 0, lr.radiusPx(1, 0, GS, GS)), "| 2 ->", count(0, 0, lr.radiusPx(2, 0, GS, GS)), "| 3 ->", count(0, 0, lr.radiusPx(3, 0, GS, GS)));
console.log("no light stays no light:", lr.radiusPx(0, 0.5, GS, GS), "| a 2x2 token's light 2 (squares from its center):", lr.radiusPx(2, 1, GS, GS) / GS);
const m = src("module/lightradius.mjs"), t = src("module/twod12.mjs"), e = src("module/effects.mjs");
console.log("installed at setup:", t.includes('Hooks.once("setup", () => { try { registerLightRadius(); }'), "| scene lights and tokens:", m.includes('wrap(CONFIG.AmbientLight?.objectClass?.prototype, "_getLightSourceData"') && m.includes('wrap(CONFIG.Token?.objectClass?.prototype, "_getLightSourceData"'), "| an effect's light writes N (not N + 0.5):", e.includes('"light.bright": light.bright * dist'));
console.log("regions snap to corners:", m.includes("mode: CONST.GRID_SNAPPING_MODES.VERTEX"), "| a world setting, on:", /"regionSnapCorners", \{[^}]*default: true \}/.test(t));
