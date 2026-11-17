// Run with: node tools/tests/run.mjs (or node tools/tests/t167.mjs)
// v0.0.207: the "Starting Mastery" setting (Sharpshooter, Bow Mastery: choose one Projectile weapon, it starts at 3 Mastery). It replaces the
// code that looked for those two Features by name; any Feature or Talent can have one (and several, each with its own choice).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {};
const stub = () => { globalThis.foundry = { applications: { api: { DialogV2: { prompt: async o => { shown.push(o.content); return pick; } }, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } }; globalThis.Hooks = { on() {} }; };
const shown = []; let pick = "";
const PICK = async o => { shown.push(`${o.text} [${o.options.map(x => x.l).join(", ")}]`); return pick; };   // v0.0.412: the pick window (was a DialogV2)
stub(); globalThis.game = { settings: { get: () => true } };
const { allDocs: docs0 , OLD_CLASS_DOCS } = await import(ROOTURL + "tools/content.mjs");
const docs = [...docs0, ...OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
stub();
const W = (name, traits) => ({ name, type: "weapon", system: { traits: new Set(traits), masteryGroup: "" } });
globalThis.game = { settings: { get: () => true }, packs: new Map([["twod12.weapons", { getDocuments: async () => [W("Longbow", ["ranged", "projectile", "twohanded"]), W("Crossbow", ["ranged", "projectile", "reload"]), W("Javelin", ["thrown", "melee"])] }]]) };
globalThis.ui = { notifications: { warn: m => shown.push(`warn: ${m}`) } };
const M = await import(ROOTURL + "module/mastery.mjs"), FD = await import(ROOTURL + "module/fxdetails.mjs");
const F = "twod12";
const full = x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], attrs: [], minEscalation: 0, ...x });
const feat = (id, name, settings) => ({ id, name, type: "feature", system: { settings: settings.map(full) } });
function character(features, { type = "character", weapons = [] } = {}) {
  const flags = {};
  const a = { type, itemTypes: { feature: features, talent: [], weapon: weapons }, flags: { [F]: flags },
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = { ...(flags[k] ?? {}), ...v }; },
    update: async u => { for (const [k, v] of Object.entries(u)) { const p = k.split("."); let o = a.flags; for (const x of p.slice(1, -1)) o = (o[x] ??= {}); o[p.at(-1)] = v; } } };
  return a;
}
const settingsOf = n => docs.find(d => d.name === n && (d.type === "feature" || d.system.settings?.length)).system.settings;

console.log("--- the compendium");
for (const n of ["Sharpshooter", "Bow Mastery"]) console.log(n.padEnd(13), JSON.stringify(settingsOf(n).filter(x => x.type === "mastery")));
const lana = character([feat("sh", "Sharpshooter", settingsOf("Sharpshooter")), feat("mq", "Marked Quarry", settingsOf("Mark Quarry"))]);
console.log("Lana (Sharpshooter):", JSON.stringify(M.startMasteryOf(lana)));
console.log("an NPC with it: none (Mastery is for characters):", M.startMasteryOf(character([feat("sh", "Sharpshooter", settingsOf("Sharpshooter"))], { type: "npc" })).length, "| a character without one:", M.startMasteryOf(character([])).length);

console.log("--- choosing the weapon");
pick = "crossbow";
await M.chooseStartMastery(lana, "sh", { picker: PICK });
console.log("the window:", shown.at(-1));
console.log("chosen:", JSON.stringify(M.startMasteryOf(lana).map(x => x.chosen)), "| Mastery:", JSON.stringify(M.masteryOf(lana)));
await lana.setFlag(F, "mastery", { crossbow: { name: "Crossbow", value: 5 } });
await M.chooseStartMastery(lana, "sh", { picker: PICK });
console.log("chosen again with 5 Mastery: it stays 5:", M.masteryOf(lana).crossbow.value);

console.log("--- made from scratch: a Talent \"Javelin Thrower\" (a Thrown weapon at 2 Mastery), next to Sharpshooter");
const kai = character([feat("sh", "Sharpshooter", settingsOf("Sharpshooter")), feat("jt", "Javelin Thrower", [{ type: "mastery", mstTrait: "thrown", mstValue: 2 }])]);
pick = "javelin";
await M.chooseStartMastery(kai, "jt", { picker: PICK });
console.log("only Thrown weapons offered:", shown.at(-1));
console.log(JSON.stringify(M.startMasteryOf(kai).map(x => `${x.from}: ${x.traitName} ${x.value} -> ${x.chosen || "(to choose)"}`)), "| Mastery:", JSON.stringify(M.masteryOf(kai)));
pick = "";
await M.chooseStartMastery(kai, "sh", { picker: PICK });
console.log("closing the window changes nothing:", JSON.stringify(M.startMasteryOf(kai).map(x => x.chosen)));
const before = shown.length;
await M.chooseStartMastery(character([feat("x", "Odd", [{ type: "mastery", mstTrait: "reload", mstValue: 3 }])]), "nope");
console.log("an unknown item: nothing asked:", shown.length === before);

console.log("--- the editor's sentences");
for (const x of [full(settingsOf("Sharpshooter").find(x => x.type === "mastery")), full({ type: "mastery", mstTrait: "thrown", mstValue: 2 })]) console.log(FD.settingSentence(x), "|", FD.settingShort(x));
