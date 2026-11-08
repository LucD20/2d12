// Run with: node tools/tests/run.mjs (or node tools/tests/t113.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.130 (new sheet, step 1): the Donut and Classic health views, the base vs. temporary split for green and red, the header band.
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
const H = await import(ROOTURL + "module/healthview.mjs");
const dmg = (bL, bN, mL, mN) => ({ bodyLethal: bL, bodyNonlethal: bN, mindLethal: mL, mindNonlethal: mN });
const show = (label, sys) => {
  const v = H.healthView(sys);
  console.log(`--- ${label}: ${v.dmg} / ${v.pool} damage, ${v.left} to Down, states [${v.states.join(", ")}], Body slice ends at ${v.bodyDeg} deg`);
  console.log("donut:", v.gradient.replace(/var\(--np-tick, #ffffff\)/g, "tick").replace(/var\(--np-empty, #3a4a62\)/g, "empty").replace(/#d0544b/g, "body").replace(/#8e342d/g, "bodyNl").replace(/#eba29c/g, "bodySpill").replace(/#4a86e0/g, "mind").replace(/#28589f/g, "mindNl").replace(/#8fb5ef/g, "mindSpill").replace(/#3a4a62/g, "empty"));
  console.log("legend:", v.legend.map(l => `${l.label} ${l.value}${l.max !== undefined ? ` / ${l.max}` : ""}`).join(" | "));
  console.log("bars:", v.bars.map(b => `${b.label} ${b.value}/${b.max}${b.badge ? ` ${b.badge}` : ""} [${b.segs.map(s => `${s.cls} ${s.w}%`).join(", ")}]`).join(" | "));
};
show("Human Paladin, the mockup's sample (Mind past its threshold)", { bdt: 21, mdt: 14, damage: dmg(9, 0, 12, 5) });
show("unhurt", { bdt: 21, mdt: 14, damage: dmg(0, 0, 0, 0) });
show("Body past its threshold, some Nonlethal", { bdt: 21, mdt: 14, damage: dmg(20, 6, 2, 0) });
show("Down (the whole pool)", { bdt: 18, mdt: 7, damage: dmg(18, 0, 7, 3) });
show("no thresholds yet (no class)", { bdt: 0, mdt: 0, damage: dmg(0, 0, 0, 0) });
console.log("--- a click on the donut (Body slice ends at 216 deg)");
for (const [name, dx, dy] of [["top right", 10, -10], ["right", 10, 0], ["bottom", 0, 10], ["bottom left", -10, 10], ["left", -10, 0], ["top left", -10, -10]]) console.log(name.padEnd(12), H.donutPoolAt(dx, dy, 216));

console.log("--- base vs. temporary: only temporary effects and Escalation passives color a number");
const { isBaseSource } = await import(ROOTURL + "module/passives.mjs");
const D = await import(ROOTURL + "module/defense.mjs");
const { applySpeedMods } = await import(ROOTURL + "module/speedmods.mjs");
const feature = (name, settings, defenses = []) => ({ id: name, name, system: { settings, defenses, description: "" } });
const blank = { attrs: new Set(), all: new Set(), any: new Set(), none: new Set(), from: new Set(), tiers: new Set() };
const fx = (name, flags) => ({ name, disabled: false, flags: { twod12: flags }, getFlag: (s, k) => flags[k] });
const actor = (feats, effects, esc = 0) => ({ type: "character", system: { escalation: esc }, itemTypes: { feature: feats, talent: [] }, effects, statuses: new Set() });
const bulwark = feature("Bulwark", [{ ...blank, type: "defense", defKind: "armor", defValue: 1, minEscalation: 0 }]);
const vigil = feature("Divine Vigil", [{ ...blank, type: "defense", defKind: "armor", defValue: 2, minEscalation: 2 }]);
const fleet = feature("Fleet", [{ ...blank, type: "speed", speedMode: "add", speedFormula: "1", minEscalation: 0 }]);
const shield = fx("Shield of Faith", { defenses: [{ kind: "armor", bonus: 2 }] });
const hindered = fx("Hindered", { speedMods: [{ mode: "override", formula: "floor(speed/2)" }] });
const S = new Set();
for (const [label, a] of [
  ["always-on passive only", actor([bulwark], [])],
  ["+ Shield of Faith (applied)", actor([bulwark], [shield])],
  ["+ Escalation passive, Escalation 2", actor([bulwark, vigil], [], 2)],
  ["+ Escalation passive, Escalation 1 (off)", actor([bulwark, vigil], [], 1)]
]) {
  const now = 13 + D.defenseBonus(a, "armor", S).total, base = 13 + D.defenseBonus(a, "armor", S, { baseOnly: true }).total;
  console.log(label.padEnd(42), `Armor now ${now}, base ${base}`, now > base ? "green" : now < base ? "red" : "plain");
}
console.log("sources:", ["passive always", "passive Escalation 2", "applied effect"].map((n, i) => `${n} ${isBaseSource([{ flags: { twod12: { passive: true, minEscalation: 0 } } }, { flags: { twod12: { passive: true, minEscalation: 2 } } }, shield][i]) ? "base" : "temporary"}`).join(", "));
const runner = actor([fleet], [hindered]);
console.log("Speed 5, Fleet (+1, always) and Hindered: now", applySpeedMods(runner, 5), "base", applySpeedMods(runner, 5, { baseOnly: true }));

console.log("--- the sheet");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), main = src("module/twod12.mjs");
console.log("header band:", tpl.includes('<header class="hb">'), "| AP pips:", tpl.includes('data-action="setApPip"'), "| Escalation pips in the header:", tpl.includes('class="hpip esc'), "| NPC Health Pool:", tpl.includes("Health Pool <b>{{health.pool}}</b>"), "| Initiative, Senses, Recovery:", ["rollInitiative", "editSenses", "rest"].every(k => tpl.includes(`data-action="${k}"`)));
console.log("panel order:", [...sh.matchAll(/key: "(\w+)", title: "([^"]+)"/g)].map(m => m[2]).join(", "), "| toggle:", tpl.includes('data-action="setHealthView"'), "per user:", sh.includes('game.user.getFlag("twod12", "healthView")'), "| donut and bars bound:", sh.includes('querySelector(".np-donut")') && sh.includes('".np-track[data-pool]"'));
console.log("kept: wounds and tables", tpl.includes('data-kind="dying"') && tpl.includes('data-kind="shattered"'), "| conditions", tpl.includes('data-action="openEffect"'), "| NPC Builder fields (v0.0.163)", tpl.includes('data-tab="builder"') && tpl.includes('setRating'), "| untrained warning", sh.includes('"Untrained armor"'), "| editable tiles", sh.includes('querySelectorAll(".np-tile.editable")'));
console.log("AP redraw hook registered:", main.includes("registerSheetHooks();") && sh.includes('hasProperty(ch ?? {}, "flags.twod12")'), "| no padding around the sheet:", css.includes(".application.twod12.twod12-actor .window-content { padding: 0 !important; }"));
