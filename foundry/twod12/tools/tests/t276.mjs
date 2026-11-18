// Run with: node tools/tests/run.mjs (or node tools/tests/t276.mjs)
// v0.0.437 (CARD-ONE step 4) tested the one-page sheet's stat block face here; it is retired with that sheet (v0.0.441). v0.0.441 (pack SHEETS-HUD;
// Lucas, 2026-11-18, the sheets' "Option 1"): the SHORT card under an Action's bar, from the card model (cardmodel.mjs shortModel / SHORT_CARD:
// no Flavor, rank word, Distance, Attack / Save line, Your roll, Ruler or Use button), and the bar (sheetmodel.mjs actionBar). The card gallery's
// face "short" (wrap "bar") shows every compendium Action in it.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [] };
const C = await import(ROOTURL + "tools/content.mjs");
const CM = await import(ROOTURL + "module/cardmodel.mjs"), AC = await import(ROOTURL + "module/actioncard.mjs"), SM = await import(ROOTURL + "module/sheetmodel.mjs");
foundry.applications.ux = { TextEditor: { implementation: { enrichHTML: async t => t } } };   // content.mjs brings its own stand-ins
const all = [...C.docs, ...C.actors.flatMap(a => a.items ?? [])];
const item = n => { const d = all.find(x => x.name === n && x.type === "action"); return { id: n, name: d.name, getFlag: () => undefined, system: { ...d.system, traits: new Set(d.system.traits ?? []) } }; };
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- the short card's model: what it leaves out");
for (const n of ["Snap Shot", "Smite", "Avenge Kin", "Ground Slam", "Rebuke"]) {
  const m = CM.cardModel(item(n)), s = CM.shortModel(m);
  console.log(`${n}: full [${CM.modelLabels(m).join(", ")}] distance "${m.grid.distance}" | short [${CM.modelLabels(s).join(", ")}] distance "${s.grid.distance}" flavor "${s.flavor}"`);
}
console.log("--- the short card drawn");
for (const n of ["Snap Shot", "Smite"]) {
  const full = await AC.buildActionCard(item(n)), short = await AC.buildActionCard(item(n), { short: true });
  console.log(`${n}: no Flavor ${!short.includes("st-flavor")} (full has one: ${full.includes("st-flavor")}) | no rank word ${!short.includes("st-auto")} | no Distance ${!/<b>Distance:<\/b>/.test(short.split('class="st-b')[0])} | no Use ${!short.includes("st-use")} | no Ruler ${!short.includes("st-ruler")} | marked ${short.includes("acard d2 st st-short")}`);
}
console.log(strip(await AC.buildActionCard(item("Snap Shot"), { short: true })));
console.log("--- the bar");
console.log(JSON.stringify(SM.actionBar({ aps: [1, 2, 3], frequency: "encounter", dist: "8/16", vs: "AD", inCombat: true, ap: 2 })));
console.log(JSON.stringify(SM.actionBar({ aps: [1], reaction: true, frequency: "turn", dist: "—", vs: "", inCombat: true, ap: 0, rap: 0 })));
console.log(JSON.stringify(SM.actionBar({ aps: [2, 2], frequency: "round", escalation: 6 })), "| out of combat nothing is struck");
console.log("--- the wiring");
const sh = src("module/actor-sheets.mjs"), tpl = src("templates/actor-sheet-pc.hbs");
console.log("a bar's row opens the short card:", sh.includes('short: row.classList.contains("ps2-oa")'), "| the stamp is the Use button:", tpl.includes('data-action="useStamp"') && sh.includes("static async useStamp(event, target)"),
  "| two fitting weapons keep a hand button each:", tpl.includes('{{#if bar.hands}}') && tpl.includes('data-action="useWith" data-weapon-id="{{id}}"'));
console.log("the gallery has the short face:", src("tools/gallery/shoot.mjs").includes('["short", ["bar"]]'), "| no stat block face:", !src("tools/gallery/shoot.mjs").includes('"statblock"'));
console.log("E6: a damage type's bright color for a dark surface:", src("module/config.mjs").includes(";--sc-d:${TWOD12.subtypeColors?.[k]") && src("styles/system.css").includes('@scope (.theme-dark) to (.theme-light) { .dtype[style*="--sc-d"]'));
