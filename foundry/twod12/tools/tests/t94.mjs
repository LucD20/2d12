// Run with: node tools/tests/run.mjs (or node tools/tests/t94.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// Token vision follows the Senses, and a scene starts without Global Illumination.
const notes = [], updates = [];
globalThis.ui = { notifications: { info: m => notes.push(m), warn: m => notes.push("warn: " + m) } };
const mkSight = (range, visionMode) => ({ range, visionMode, enabled: true });
const mkToken = (id, actorId, sight) => ({ id, actorId, sight, name: id });
const mkActor = (id, name, type, senses, protoSight) => {
  const a = { id, name, type, system: { senses }, prototypeToken: { sight: protoSight }, async update(d) { updates.push(`${name}: ${JSON.stringify(d)}`); if ("prototypeToken.sight.range" in d) { a.prototypeToken.sight = { ...a.prototypeToken.sight, range: d["prototypeToken.sight.range"], visionMode: d["prototypeToken.sight.visionMode"] }; } }, updateSource(d) { a.src = d; } };
  return a;
};
const mkScene = (name, tokens, gl) => { const sc = { name, tokens, environment: { globalLight: { enabled: gl } }, async updateEmbeddedDocuments(kind, ups) { updates.push(`${name} scene tokens: ${ups.map(u => `${u._id} ${u["sight.range"]}/${u["sight.visionMode"]}`).join(", ")}`); for (const u of ups) { const t = tokens.find(x => x.id === u._id); t.sight = { ...t.sight, range: u["sight.range"], visionMode: u["sight.visionMode"] }; } }, async update(d) { updates.push(`${name}: ${JSON.stringify(d)}`); sc.environment.globalLight.enabled = d["environment.globalLight.enabled"]; } }; return sc; };
const V = await import(ROOT + "module/vision.mjs");
console.log("--- what the vision should be");
console.log("no Dark Sight:", JSON.stringify(V.visionFor({})), "| undefined:", JSON.stringify(V.visionFor(undefined)), "| Dim-light Sight only:", JSON.stringify(V.visionFor({ dimlight: true })), "| Dark Sight:", JSON.stringify(V.visionFor({ darksight: true })));
console.log("--- a new character");
const fresh = mkActor("a0", "New", "character", { darksight: false }, mkSight(null, "basic")); V.giveVision(fresh); console.log("a normal one:", JSON.stringify(fresh.src));
const fresh2 = mkActor("a0b", "New2", "character", { darksight: true }, mkSight(null, "basic")); V.giveVision(fresh2); console.log("with Dark Sight:", JSON.stringify(fresh2.src));
console.log("--- syncing the characters of a world");
const kai = mkActor("a1", "Kai", "character", {}, mkSight(60, "basic"));           // a vision range somebody typed in
const nari = mkActor("a2", "Nari", "character", { darksight: true }, mkSight(0, "basic"));
const ok = mkActor("a3", "Mara", "character", {}, mkSight(0, "basic"));            // already right
const orc = mkActor("a4", "Orc", "npc", { darksight: true }, mkSight(0, "basic"));   // an NPC: not touched
const tokens1 = [mkToken("k1", "a1", mkSight(60, "basic")), mkToken("n1", "a2", mkSight(0, "basic")), mkToken("m1", "a3", mkSight(0, "basic")), mkToken("o1", "a4", mkSight(0, "basic"))];
const tokens2 = [mkToken("k2", "a1", mkSight(null, "basic"))];
globalThis.game = { actors: [kai, nari, ok, orc], scenes: [mkScene("Cave", tokens1, true), mkScene("Hall", tokens2, false)] };
updates.length = 0; notes.length = 0;
const n = await V.syncVision();
console.log("changed:", n, "|", notes.pop());
console.log(updates.join("\n"));
console.log("the NPC and the right one were left alone:", !updates.some(u => /Orc|Mara|o1|m1/.test(u)));
updates.length = 0; const again = await V.syncVision(); console.log("a second time:", again, "|", notes.pop(), "|", updates.length, "updates");
console.log("--- the Senses dialog (one character)");
nari.system.senses.darksight = false; updates.length = 0; console.log("Dark Sight taken away from Nari:", await V.syncVisionOf(nari), "|", updates.join(" ; "));
console.log("--- Global Illumination");
game.scenes = [mkScene("Cave", [], true), mkScene("Hall", [], true), mkScene("Camp", [], false)];
globalThis.canvas = { scene: game.scenes[0], tokens: { placeables: [] } };
updates.length = 0; console.log("this scene off:", await V.globalLight(false), "|", notes.pop(), "|", updates.join(" ; "));
updates.length = 0; console.log("every scene off:", await V.globalLight(false, { all: true }), "|", notes.pop(), "|", updates.join(" ; "));
updates.length = 0; console.log("on again, one scene:", await V.globalLight(true), "|", notes.pop());
console.log("--- the diagnostic");
const sc = mkScene("Cave", [], true); sc.environment.darknessLevel = 0.9; sc.environment.globalLight.darkness = { min: 0, max: 1 }; sc.tokenVision = true;
const mkPl = (name, type, controlled, darksight, sight, det) => ({ name, controlled, actor: { type, system: { senses: { darksight } } }, document: { sight, detectionModes: det } });
globalThis.canvas = { scene: sc, tokens: { placeables: [mkPl("Kai", "character", true, false, { enabled: true, range: 0, visionMode: "basic" }, [{ id: "basicSight", range: 0 }, { id: "hearing", range: null }]), mkPl("Orc", "npc", false, false, { enabled: false }, []), mkPl("Nari", "character", false, true, { enabled: true, range: 1000, visionMode: "darkvision" }, [])] } };
const logs = []; const lg = console.log; console.log = (...a) => logs.push(a.join(" ")); const info = V.visionInfo(); console.log = lg;
console.log("the line to copy:", logs[0].slice(0, 70) + "...", "| tokens listed:", info.tokens.map(t => t.name).join(", "), "(the NPC is left out unless controlled)");
console.log("the scene:", JSON.stringify(info.scene));
console.log("the notice with Global Illumination on:", notes.pop().slice(0, 95) + "...");
sc.environment.globalLight.enabled = false; V.visionInfo(); console.log("with it off:", notes.pop().slice(0, 60) + "...");
// the new scenes no longer start lit
const code = fs.readFileSync(ROOT + "module/twod12.mjs", "utf8");
console.log("new scenes get Global Illumination again (v0.0.164; the sight gate of v0.0.101 still hides creatures in Darkness):", /Hooks\.on\("preCreateScene"/.test(code) && /"environment\.globalLight\.enabled": true/.test(code), "| a new character gets its vision:", code.includes("giveVision(actor)"));
