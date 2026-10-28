// Run with: node tools/tests/run.mjs (or node tools/tests/t95.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// The canvas follows the rules of Light: Darkness regions (Adjust Darkness Level), the gate on Foundry's sight, the refresh and the ripple, with Global Illumination on.
const GS = 100, settings = { lightDimBelow: 0.7, lightDarkBelow: 0.4 }, notes = [], hooks = {}, combatants = [];
globalThis.ui = { notifications: { info: m => notes.push(m), warn: m => notes.push("warn: " + m) } };
globalThis.Hooks = { on: (n, f) => (hooks[n] ??= []).push(f), once() {} };
globalThis.game = { settings: { get: (s, k) => settings[k] }, combat: { started: true, combatants: { find: f => combatants.find(f) } } };
class FakeMode { constructor(o) { Object.assign(this, o); } static DETECTION_TYPES = { SOUND: 1 }; }
let basicCalls = 0;
let lightPerceptionSees = true;
globalThis.CONFIG = { specialStatusEffects: { BLIND: "blind" }, Canvas: { detectionModes: { basicSight: { type: 0, testVisibility() { basicCalls++; return true; } }, lightPerception: { type: 0, testVisibility() { return lightPerceptionSees; } }, seeInvisibility: { type: 0, testVisibility() { return false; } }, feelTremor: { type: 1, testVisibility() { return true; } } } } };
globalThis.foundry = { canvas: { perception: { DetectionMode: FakeMode }, rendering: { filters: { OutlineOverlayFilter: { create: () => ({}) } } } } };
const regions = [], torches = [], updates = [];
globalThis.canvas = { grid: { size: GS }, environment: { darknessLevel: 0.2 }, scene: { environment: { globalLight: { enabled: true } } }, effects: { lightSources: torches, darknessSources: [] }, regions: { placeables: regions }, tokens: { controlled: [], placeables: [] }, perception: { update: o => updates.push(JSON.stringify(o)) } };
const L = await import(ROOTURL + "module/light.mjs");
const G = await import(ROOTURL + "module/sightgate.mjs");
const S = await import(ROOTURL + "module/senses.mjs");
const inCols = (a, b) => p => p.x >= a * GS && p.x < (b + 1) * GS;   // a region over columns a..b
const region = (name, test, ...behaviors) => { const r = { document: { name, testPoint: p => test(p), behaviors } }; regions.push(r); return r; };
const adj = (mode, modifier, disabled = false) => ({ type: "adjustDarknessLevel", disabled, system: { mode, modifier } });
const at = col => ({ x: col * GS + 50, y: 50 });
const d = col => { const x = L.darknessDetail(at(col)); return `${+x.value.toFixed(3)} (${x.via})`; };
console.log("--- the Darkness level at a point");
console.log("no regions:", d(5));
region("Darkness ability", inCols(5, 7), adj(0, 1));
console.log("an Override region over columns 5-7: inside", d(5), "| outside", d(2), "| the edge column 7", d(7), "and 8", d(8));
regions.length = 0; canvas.environment.darknessLevel = 0.8; region("Lamp", inCols(5, 7), adj(1, 0.5));
console.log("Brighten 50% on a scene at 0.8:", d(6), "| Darken 50% on a scene at 0.2:", (canvas.environment.darknessLevel = 0.2, regions.length = 0, region("Gloom", inCols(5, 7), adj(2, 0.5)), d(6)));
regions.length = 0; region("A", inCols(5, 7), adj(0, 0.5)); region("B", inCols(6, 8), adj(1, 0.5));
console.log("two regions stack (Override 0.5, then Brighten 50% where they overlap):", d(5), d(6), d(8), "(0.5, 0.25, 0.1)");
regions.length = 0; region("Off", inCols(5, 7), adj(0, 1, true)); region("Another kind", inCols(5, 7), { type: "modifyMovementCost", system: {} });
console.log("a disabled one and another kind of behavior change nothing:", d(6));
regions.length = 0; const asked = []; canvas.effects.getDarknessLevel = (...args) => { asked.push(args); return 0.77; };
console.log("Foundry's own answer, when it has one:", d(3), "| how it was asked:", JSON.stringify(asked[0]), "(one point with its elevation: Foundry 13)");
region("Override", inCols(5, 7), adj(0, 0.3)); console.log("Foundry's answer is the first choice, a region of the stand-in does not change it:", d(6), "| and the regions are not read:", d(3));
delete canvas.effects.getDarknessLevel; regions.length = 0;
console.log("--- whether a point is inside a region (both shapes of the call)");
const probe = shape => ({ testPoint: shape === "new" ? (...a) => { if (a.length !== 1 || typeof a[0] !== "object") throw new Error("one point please"); return a[0].x === 650; } : (p, e) => { if (typeof e !== "number") throw new Error("two arguments please"); return p.x === 650; } });
console.log("Foundry 13:", L.regionHasPoint(probe("new"), { x: 650, y: 50 }, 0), L.regionHasPoint(probe("new"), { x: 150, y: 50 }, 0), "| older Foundry:", L.regionHasPoint(probe("old"), { x: 650, y: 50 }, 0), L.regionHasPoint(probe("old"), { x: 150, y: 50 }, 0), "| one that throws:", L.regionHasPoint({ testPoint() { throw new Error("x"); } }, { x: 1, y: 1 }));
console.log("--- the light by the rules");
canvas.environment.darknessLevel = 0.1; region("Darkness ability", inCols(5, 7), adj(0, 1));
const lvl = col => L.lightAt(at(col));
console.log("a bright scene with a Darkness region: outside", lvl(2), "| inside", lvl(6));
regions.length = 0; region("Darkness ability", inCols(2, 10), adj(0, 1));
torches.push({ active: true, data: { x: 6 * GS + 50, y: 50, bright: 1 * GS, dim: 2 * GS }, shape: { contains: () => true } });
console.log("a torch (Bright 1, Dim 1 more) at column 6, inside a larger Darkness region: at the torch", lvl(6), "| 1 away", lvl(5), lvl(7), "| 2 away", lvl(4), lvl(8), "| 3 away", lvl(3), lvl(9), "(bright, bright, dim, dark)");
torches.length = 0; regions.length = 0; region("Darkness ability", inCols(5, 7), adj(0, 1));   // back to the region over columns 5-7
// ------------------------------------------------------------------ who sees whom
let id = 0;
const tok = (col, { senses = {}, noActor = false } = {}) => ({ id: "t" + ++id, name: "t" + id, document: { id: "t" + id, x: col * GS, y: 0, width: 1, height: 1 }, actor: noActor ? null : { name: "t" + id, statuses: new Set(), system: { senses } } });
const you = tok(0), seer = tok(1, { senses: { darksight: true } }), dimsight = tok(2, { senses: { dimlight: true } });
console.log("--- does the observer see the token, by the rules");
const row = (label, target, o = you) => console.log(label.padEnd(66), G.canSeeByRules(o, target));
row("a creature in the open", tok(3));
row("a creature inside the Darkness region", tok(6));
row("... for an observer with Dark Sight", tok(6), seer);
row("... for an observer with Dim-light Sight (Darkness stays Darkness)", tok(6), dimsight);
canvas.environment.darknessLevel = 0.6; row("a Dim scene (light 0.4): the creature in the open, no region", tok(3)); canvas.environment.darknessLevel = 0.1;
row("the observer's own token", you, you);
row("a token without a creature", tok(6, { noActor: true }));
row("an observer without a creature", tok(6), tok(0, { noActor: true }));
// ------------------------------------------------------------------ the gate
console.log("--- the gate on Foundry's sight modes");
const modes = CONFIG.Canvas.detectionModes;
console.log("put on:", JSON.stringify(G.registerSightGate()), "| again:", JSON.stringify(G.registerSightGate()), "| the sound-type mode is not touched:", !modes.feelTremor.testVisibility.twod12Gate);
const visibleBy = (target, o = you) => Object.entries(modes).filter(([k, m]) => m.type === 0).some(([k, m]) => m.testVisibility({ object: o }, {}, { object: target }));
basicCalls = 0;
console.log("Basic Sight says seen, the rules say Darkness:", modes.basicSight.testVisibility({ object: you }, {}, { object: tok(6) }), "| in the open:", modes.basicSight.testVisibility({ object: you }, {}, { object: tok(3) }), "| with Dark Sight:", modes.basicSight.testVisibility({ object: seer }, {}, { object: tok(6) }), "| Foundry's own call ran once per question:", basicCalls === 3);
// what Global Illumination does: Basic Sight does not reach (vision range 0), Light Perception sees everything that is lit
const wasBasic = modes.basicSight.testVisibility; let origBasic = wasBasic;
console.log("Light Perception (Global Illumination) says seen, the rules say Darkness:", modes.lightPerception.testVisibility({ object: you }, {}, { object: tok(6) }), "| in the open:", modes.lightPerception.testVisibility({ object: you }, {}, { object: tok(3) }), "| for Dark Sight:", modes.lightPerception.testVisibility({ object: seer }, {}, { object: tok(6) }));
console.log("a token that no sight mode shows, then the ripple:", visibleBy(tok(6)), "(not seen) |", visibleBy(tok(3)), "(in the open: seen)");
console.log("a test of something that is not a token (no object):", modes.lightPerception.testVisibility({ object: you }, {}, {}), "| no vision source object:", modes.lightPerception.testVisibility({}, {}, { object: tok(6) }));
const keep = modes.lightPerception; lightPerceptionSees = false;
console.log("when Foundry says not seen it stays not seen:", modes.lightPerception.testVisibility({ object: you }, {}, { object: tok(3) })); lightPerceptionSees = true;
const broken = tok(3); broken.document = null;
console.log("if the rules fail to answer, Foundry's answer stands:", modes.lightPerception.testVisibility({ object: you }, {}, { object: broken }));
const savedModes = { ...modes }; delete modes.lightPerception; delete modes.seeInvisibility; console.log("with only Basic Sight present:", JSON.stringify(G.registerSightGate()));
for (const k of Object.keys(modes)) delete modes[k]; console.log("with no sight modes:", JSON.stringify(G.registerSightGate())); Object.assign(modes, savedModes);
G.registerSightGate();
const basic = modes.basicSight; const see = (target, o = you) => visibleBy(target, o);
// ------------------------------------------------------------------ the refresh
console.log("--- the refresh");
const wait = ms => new Promise(r => setTimeout(r, ms));
G.registerSightRefresh();
console.log("hooks watched:", Object.keys(hooks).filter(h => /Region|Combat|ActiveEffect|updateActor/.test(h)).sort().join(", "));
const fire = (h, ...a) => (hooks[h] ?? []).forEach(f => f(...a));
updates.length = 0; for (let i = 0; i < 5; i++) fire("updateRegion", {}, {}); await wait(250); console.log("five region changes in a row: refreshes", updates.length, JSON.stringify(updates[0]));
const tryHook = async (label, h, ...a) => { updates.length = 0; fire(h, ...a); await wait(200); console.log(label.padEnd(54), updates.length ? "refresh" : "no refresh"); };
await tryHook("a new turn of the combat", "updateCombat", {}, { turn: 2 });
await tryHook("a new round", "updateCombat", {}, { round: 2 });
await tryHook("a combatant defeated", "updateCombatant", {}, { defeated: true });
await tryHook("a combatant's initiative", "updateCombatant", {}, { initiative: 12 });
await tryHook("a creature's damage", "updateActor", {}, { system: { damage: { bodyLethal: 3 } } });
await tryHook("a creature's Senses", "updateActor", {}, { system: { senses: { darksight: true } } });
await tryHook("the Unsensed status put on", "createActiveEffect", { statuses: new Set(["unsensed"]) });
await tryHook("an ordinary effect", "createActiveEffect", { statuses: new Set(["prone"]) });
await tryHook("the combat is created / deleted", "createCombat", {});
await tryHook("a Darkness region deleted", "deleteRegion", {});
// ------------------------------------------------------------------ Global Illumination on, a Darkness ability, and the ripple
console.log("--- Global Illumination on, a bright scene, an ability puts a Darkness region over a goblin");
canvas.environment.darknessLevel = 0; regions.length = 0; combatants.length = 0;
const hero = tok(0), keen = tok(0, { senses: { darksight: true } }), goblin = tok(6);
combatants.push({ tokenId: goblin.id, isDefeated: false });
console.log("before the ability: the hero sees the goblin:", see(goblin, hero));
region("Darkness", inCols(5, 7), adj(0, 1));
S.registerSenses();
const ripple = CONFIG.Canvas.detectionModes.hearing;
console.log("after it: Global Illumination is", canvas.scene.environment.globalLight.enabled ? "on" : "off", "| by any sight mode the hero sees the goblin:", see(goblin, hero), "| it shows as a ripple:", ripple._canDetect({ object: hero }, goblin), "| a hero with Dark Sight sees it:", see(goblin, keen));
console.log("the goblin out of the combat: the ripple is gone too:", (combatants.length = 0, ripple._canDetect({ object: hero }, goblin)));
// ------------------------------------------------------------------ the diagnostic
console.log("--- lightInfo");
canvas.tokens.placeables = [hero, goblin]; hero.actor.type = "character"; canvas.tokens.controlled = []; hero.document.sight = { enabled: true, range: 0, visionMode: "basic" }; hero.document.detectionModes = [{ id: "basicSight", range: 0 }, { id: "hearing", range: null }];
const logs = []; const lg = console.log; console.log = (...a) => logs.push(a.join(" "));
const info = G.lightInfo(); console.log = lg;
console.log("the line to copy starts:", logs[0].slice(0, 60) + "...", "| the notice:", notes.pop().slice(0, 100) + "...");
console.log(JSON.stringify({ sightGate: info.sightGate, detectionModes: info.detectionModes, sceneDarkness: info.sceneDarkness, globalLight: info.globalLight, foundryHasDarknessAt: info.foundryHasDarknessAt, darknessRegions: info.darknessRegions }));
console.log("the tokens listed (the characters when none is controlled):", info.tokens.map(t => `${t.name} ${t.light} | sight ${JSON.stringify(t.sight)} | detection ${t.detection.join(", ")}`).join(", "));
canvas.tokens.controlled = [goblin]; goblin.actor.type = "npc"; regions.length = 0; regions.push({ document: { name: "Gloom", testPoint: () => true, behaviors: [adj(2, 0.5)] } });
console.log = (...a) => logs.push(a.join(" ")); const info2 = G.lightInfo(); console.log = lg;
console.log("a controlled token is listed whoever it is:", info2.tokens.map(t => `${t.name} darkness ${t.darkness} via ${t.via} adjusted by ${JSON.stringify(t.adjustedBy)}`).join(" | "));
// ------------------------------------------------------------------ detection modes of a token, in whatever shape this Foundry gives them
console.log("--- the detection modes of a token (lightInfo failed on a shape that is not an array)");
const { modeList } = await import(ROOTURL + "module/modes.mjs");
const show2 = (label, raw) => console.log(label.padEnd(34), JSON.stringify(modeList(raw)));
show2("an array", [{ id: "basicSight", range: 0 }, { id: "hearing", range: null }]);
show2("a record keyed by id", { basicSight: { range: 0 }, hearing: { id: "hearing", range: null } });
show2("a collection (contents)", { contents: [{ id: "basicSight", range: 0 }] });
show2("nothing", undefined); show2("null", null); show2("a number", 5);
canvas.tokens.placeables = [hero]; canvas.tokens.controlled = [];
for (const [label, raw] of [["a record", { basicSight: { range: 0 }, hearing: { range: null } }], ["a collection", { contents: [{ id: "basicSight", range: 0 }, { id: "hearing", range: null }] }], ["nothing", undefined]]) {
  hero.document.detectionModes = raw; const logs2 = []; const lg2 = console.log; console.log = (...a) => logs2.push(a.join(" "));
  let outcome; try { const i = G.lightInfo(); outcome = i.tokens.map(t => `${t.name} detection [${t.detection.join(", ")}]`).join("; "); } catch (e) { outcome = "ERROR " + e.message; } console.log = lg2;
  console.log("lightInfo with detectionModes as", label.padEnd(13), "→", outcome);
}
const V2 = await import(ROOTURL + "module/vision.mjs");
globalThis.canvas.scene = { name: "S", environment: { globalLight: { enabled: false } } }; hero.document.sight = { enabled: true, range: 0, visionMode: "basic" }; hero.document.detectionModes = { basicSight: { range: 0 } };
{ const logs3 = []; const lg3 = console.log; console.log = (...a) => logs3.push(a.join(" ")); let out; try { out = V2.visionInfo().tokens.map(t => t.detection.join(",")).join(";"); } catch (e) { out = "ERROR " + e.message; } console.log = lg3; console.log("visionInfo with a record:", out); }
