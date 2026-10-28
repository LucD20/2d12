// Run with: node tools/tests/run.mjs (or node tools/tests/t126.mjs)
// v0.0.147 (Pass C of the core rules update): Hazardous Terrain [HT] patterns and the turn-cycle limit; Leaning out of Total cover.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null };
const H = await import(ROOTURL + "module/hazard.mjs");
const U = await import(ROOTURL + "module/usage.mjs");
console.log("patterns:", ["entering+turn", "Movement", "yes", "", "turn", "no", "Entering, Turn, Movement"].map(v => `${JSON.stringify(v)} -> ${H.parsePatterns(v).join("+") || "(none)"}`).join(" | "));
console.log("pattern text:", H.patternText([]), "|", H.patternText(["movement"]));
// The turn-cycle limit: the creature is 3rd in the order (turn index 2), hit at [round, turn].
const b = (round, turn, at) => (U.turnCycleBlocked(round, turn, 2, at) ? "blocked" : "again");
console.log("hit on entering at r1 t0 (before its turn): r1 t1", b(1, 1, [1, 0]), "| r1 t2 (its turn)", b(1, 2, [1, 0]));
console.log("hit at the end of its own turn (r1 t2): r2 t0", b(2, 0, [1, 2]), "| r2 t2", b(2, 2, [1, 2]));
console.log("not in the turn order: same round", U.turnCycleBlocked(3, 0, -1, [3, 1]) ? "blocked" : "again", "| next round", U.turnCycleBlocked(4, 0, -1, [3, 1]) ? "blocked" : "again");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const hz = src("module/hazard.mjs"), tpl = src("module/template.mjs"), main = src("module/twod12.mjs"), cover = src("module/cover.mjs"), inl = src("module/inline.mjs");
console.log("hooks: entering", hz.includes('if (is && !was) await trigger(r, doc, "entering")'), "| movement", hz.includes('if (was || is) await trigger(r, doc, "movement")'), "| appears", hz.includes('Hooks.on("createRegion"'), "| end of turn", hz.includes('await trigger(r, td, "turn")'), "| Movement has no limit", hz.includes('if (how !== "movement" && combat?.started)'), "| registered", main.includes("registerHazardHooks();"));
console.log("area: [HT] checkboxes and text", tpl.includes('name="ht" value="${k}"') && tpl.includes('name="httext"'), "| Region flags", tpl.includes("flags.twod12.ht = { patterns: data.ht, text: data.httext"), "| @Area ht: key", inl.includes('else if (key === "ht") cfg.ht = val;'));
console.log("Leaning: Total becomes High:", (cover.match(/statuses\?\.has\?\.\("leaning"\) && level >= 1;/g) || []).length === 2);
console.log("v0.0.149: movement through moveToken (origin and destination):", hz.includes('Hooks.on("moveToken", async (doc, movement, operation) =>') && hz.includes("await moved(doc, { ...size, ...movement.origin }, { ...size, ...movement.destination })"));
