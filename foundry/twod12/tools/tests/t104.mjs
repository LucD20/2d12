// Run with: node tools/tests/run.mjs (or node tools/tests/t104.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// Editing an applied effect (v0.0.113): what an edit writes back to it, and where a click on it goes.
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.game = { settings: { get: () => true, register() {} }, user: { id: "u" }, socket: { on() {}, emit() {} } };
const { appliedUpdate } = await import(ROOTURL + "module/fxsync.mjs");
const S = a => new Set(a), blank = { attrs: S(), all: S(), any: S(), none: S(), from: S(), tiers: S() };
const mkFx = flags => ({ name: "Battle Fervor", flags: { twod12: flags }, getFlag: (s, k) => flags[k] });
const sys = (settings, extra = {}) => ({ description: "", settings: settings.map(x => ({ ...blank, ...x })), expireOn: S(["magic"]), expireAll: false, duration: { type: "rounds", rounds: 2 }, conditions: [], ...extra });
const plainSrc = s => JSON.parse(JSON.stringify(s, (k, v) => v instanceof Set ? [...v] : v));
console.log("--- a boon becomes 2, Speed is added");
let fx = mkFx({ duration: { type: "rounds", rounds: 2 }, remaining: 1, grants: [], source: { conditions: [] } });
let s = sys([{ type: "boonbane", boons: 2, all: S(["melee"]) }, { type: "speed", speedMode: "add", speedFormula: "2" }]);
let r = appliedUpdate(fx, s, plainSrc(s), "Battle Fervor", "i.svg");
console.log("name:", r.update.name, "| modifiers:", JSON.stringify(r.update["flags.twod12.modifiers"]), "| speed:", JSON.stringify(r.update["flags.twod12.speedMods"]));
console.log("same duration: the rounds left stay:", !("flags.twod12.remaining" in r.update), "| source kept:", r.update["flags.twod12.source"].settings.length === 2);
console.log("--- the duration changes: it starts again");
s = sys([], { duration: { type: "rounds", rounds: 3 } });
r = appliedUpdate(fx, s, plainSrc(s), "Battle Fervor", "i.svg");
console.log(JSON.stringify(r.update["flags.twod12.duration"]), "remaining", r.update["flags.twod12.remaining"]);
console.log("--- a condition with a value keeps its value in the name");
fx = mkFx({ value: 2, baseName: "Empowered", duration: { type: "", rounds: 1 }, source: { conditions: [] } });
s = sys([], { duration: { type: "", rounds: 1 } });
r = appliedUpdate(fx, s, plainSrc(s), "Empowered", "i.svg");
console.log("name:", r.update.name, "| baseName:", r.update["flags.twod12.baseName"]);
console.log("--- granted uses keep what was spent");
fx = mkFx({ duration: { type: "", rounds: 1 }, grants: [{ spec: "Weapon Attack", count: 2, left: 1, used: ["t1"] }], source: { conditions: [] } });
s = sys([{ type: "grant", grantAction: "Weapon Attack", grantCount: 3, grantAp: 0 }], { duration: { type: "", rounds: 1 } });
r = appliedUpdate(fx, s, plainSrc(s), "X", "i");
console.log("same Action, 2 -> 3 uses, 1 spent:", JSON.stringify(r.update["flags.twod12.grants"].map(g => [g.count, g.left, g.used])));
s = sys([{ type: "grant", grantAction: "Shove", grantCount: 1, grantAp: 0 }], { duration: { type: "", rounds: 1 } });
r = appliedUpdate(fx, s, plainSrc(s), "X", "i"); console.log("another Action: fresh:", JSON.stringify(r.update["flags.twod12.grants"].map(g => [g.spec, g.left, g.used])));
console.log("--- conditions it applies");
fx = mkFx({ duration: { type: "", rounds: 1 }, source: { conditions: [{ uuid: "C.prone", name: "Prone" }, { uuid: "C.emp", name: "Empowered" }] } });
s = sys([], { duration: { type: "", rounds: 1 }, conditions: [{ uuid: "C.emp", name: "Empowered", value: 1 }, { uuid: "C.hind", name: "Hindered", value: 1 }] });
r = appliedUpdate(fx, s, plainSrc(s), "X", "i");
console.log("added:", r.added.map(c => c.name).join(","), "| removed:", r.removed.map(c => c.name).join(","));
console.log("--- where a click goes");
const { openEffectSheet, setEffectOpener } = await import(ROOTURL + "module/fxopen.mjs");
const log = []; const f = { name: "A", sheet: { render: () => log.push("foundry window") } };
openEffectSheet(f); setEffectOpener(() => (log.push("2d12 editor"), true)); openEffectSheet(f);
setEffectOpener(() => false); openEffectSheet(f); setEffectOpener(() => { throw new Error("x"); });
const warn = console.warn; console.warn = () => {}; openEffectSheet(f); console.warn = warn;
console.log(log.join(" | "));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("panel, sheet and Shift+click use it:", (src("module/effects.mjs").match(/openEffectSheet\(fx\)/g) || []).length, (src("module/actor-sheets.mjs").match(/openEffectSheet\(fx\)/g) || []).length, "| registered:", src("module/twod12.mjs").includes("registerAppliedEditor()"), "| template has the Applied part:", src("templates/item-sheet.hbs").includes("data-apvalue"));
console.log("--- v0.0.114: Exhausted and the form");
const ap = src("module/fxapplied.mjs");
console.log("the form's own fields go to the temporary item:", /_processSubmitData\(event, form, submitData, options = \{\}\) \{ await this\.document\.update\(submitData, options\)/.test(ap), "| Exhausted opens it:", !/if \(!fx \|\| isExhaustedFx\(fx\)\) return false/.test(ap) && ap.includes("src = sourceFromFlags(fx)"), "| Shift+click on Exhausted:", src("module/sleep.mjs").includes("if (shift) { openEffectSheet(fx);"));
const exFx = { name: "Exhausted 2", flags: { twod12: { counter: "exhausted" } }, statuses: new Set(["exhausted"]), getFlag: (s, k) => ({ counter: "exhausted" })[k] };
s = sys([{ type: "boonbane", banes: 1 }], { duration: { type: "", rounds: 1 } });
r = appliedUpdate(exFx, s, plainSrc(s), "Exhausted", "x.svg");
console.log("Exhausted keeps its name and picture:", !("name" in r.update) && !("img" in r.update), "| gets the bane:", r.update["flags.twod12.modifiers"][0].banes);
s = sys([], { duration: { type: "eot", rounds: 1 } });
fx = mkFx({ duration: { type: "rounds", rounds: 2 }, remaining: 2, source: { conditions: [] } });
r = appliedUpdate(fx, s, plainSrc(s), "X", "i"); console.log("Lasts changed from 2 rounds to EoT:", JSON.stringify(r.update["flags.twod12.duration"]));
console.log("--- v0.0.115: an applied effect with no copy of its settings");
const { sourceFromFlags } = await import(ROOTURL + "module/fxsync.mjs");
const old = { name: "Old Blessing", description: "", statuses: new Set(), flags: { twod12: {
  duration: { type: "rounds", rounds: 3 }, expireOn: ["magic", "bogus"], expireAll: true,
  modifiers: [{ boons: 1, banes: 0, empowered: 1, all: ["melee", "flanking"], any: [], none: ["ranged"], from: [], against: false }],
  bonuses: [{ dmg: "1d6", dmgPool: "M", dmgSub: "Ho", tiers: ["t3"], text: "Holy", all: ["weapon"], any: [], none: [] }],
  grants: [{ spec: "Weapon Attack", count: 2, left: 1, ap: 0, boons: 1, distinct: true, used: [] }],
  speedMods: [{ mode: "override", formula: "floor(speed/2)" }], notes: [{ attrs: ["body"], title: "Careful", text: "x" }] } } };
old.getFlag = (s, k) => old.flags.twod12[k];
const rb = sourceFromFlags(old);
console.log(rb.settings.map(x => `${x.type}${x.type === "boonbane" ? ` ${x.boons}/${x.banes} E${x.empowered} all=${x.all} none=${x.none} predicate=${x.predicate}` : ""}${x.type === "bonusdamage" ? ` ${x.dmg} ${x.dmgPool} ${x.dmgSub} ${x.tiers}` : ""}${x.type === "grant" ? ` ${x.grantAction} x${x.grantCount} ${x.grantAp}AP distinct=${x.grantDistinct}` : ""}${x.type === "speed" ? ` ${x.speedMode} ${x.speedFormula}` : ""}${x.type === "note" ? ` ${x.title} ${x.attrs}` : ""}`).join(" | "));
console.log("ends:", JSON.stringify(rb.duration), rb.expireOn.join(","), rb.expireAll);
// and back: the same flags come out (uses already spent stay spent)
const back = appliedUpdate(old, { ...rb, settings: rb.settings.map(x => ({ ...x, all: S(x.all), any: S(x.any), none: S(x.none), from: S(x.from), tiers: S(x.tiers), attrs: S(x.attrs) })), expireOn: S(rb.expireOn) }, rb, "Old Blessing", "i");
console.log("round trip: modifiers", JSON.stringify(back.update["flags.twod12.modifiers"][0].all), "| grant left", back.update["flags.twod12.grants"][0].left, "| duration unchanged:", !("flags.twod12.duration" in back.update));
console.log("Exhausted with nothing stored:", JSON.stringify(sourceFromFlags({ flags: { twod12: { counter: "exhausted" } }, statuses: new Set(["exhausted"]), getFlag: () => undefined })));
console.log("an effect on an item keeps Foundry's window:", src("module/fxapplied.mjs").includes('fx.parent?.documentName !== "Actor") return false'));
