// Run with: node tools/tests/run.mjs (or node tools/tests/t184.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.244 (Lucas's test of v0.0.243): the Species window and the Initiative window in the class window's format (pickwindow.mjs: selections like the
// Attribute increases, what it grants, a click to confirm); the Health line's high side as a selection in the class window at level 1; the Reaction AP pip
// teal everywhere with a thin divider before it.
globalThis.foundry = { applications: { api: {} }, utils: {} }; globalThis.Hooks = { on() {} }; globalThis.CONFIG = {};
const P = await import(ROOTURL + "module/pickwindow.mjs"), S = await import(ROOTURL + "module/specieswindow.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const sp = n => C.docs.find(d => d.type === "species" && d.name === n);
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- the Species window: a Human (two Attributes and the side of the +3 to choose)");
let st = { chosen: [], side: "" };
let m = S.speciesModel(sp("Human"), st, { className: "Paladin" });
console.log("sections:", m.sections.map(x => `${x.title} [${x.pill}]`).join(" | "), "| complete:", m.complete, "| message:", m.message, "| confirm:", m.confirm);
console.log("stats:", m.stats.map(([k, v]) => `${k} ${v}`).join(", "));
st = S.speciesPick(st, "attr", "body"); st = S.speciesPick(st, "attr", "mind"); console.log("Body then Mind:", JSON.stringify(st.chosen), "| a third replaces the oldest:", JSON.stringify(S.speciesPick(st, "attr", "appeal").chosen), "| clicking a chosen one removes it:", JSON.stringify(S.speciesPick(st, "attr", "body").chosen));
m = S.speciesModel(sp("Human"), st, { className: "Paladin" });
console.log("complete:", m.complete, "| the Attribute row:", m.sections[0].rows[0].opts.map(o => `${o.l}${o.on ? "*" : ""}${o.off ? " (off)" : ""}`).join(" "), "| the Health row:", m.sections[1].rows[0].opts.map(o => `${o.l}${o.on ? "*" : ""}`).join(" / "));
st = S.speciesPick(st, "side", "resolve"); console.log("+3 on Resolve:", JSON.stringify(st), "| back to the high value:", S.speciesPick(st, "side", "").side === "");
console.log("--- a Dwarf: everything granted");
m = S.speciesModel(sp("Dwarf"), { chosen: [] }, { adding: false });
console.log("sections:", m.sections.map(x => `${x.title} [${x.pill}]: ${strip(x.html ?? "") || x.rows.length + " rows"}`).join(" | "), "| complete:", m.complete, "| confirm:", m.confirm);
console.log("--- the Initiative window: rebuilt in v0.0.310 (initmodel.mjs, initview.mjs; t219)");
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- wiring: a dropped species opens the window:", src("module/grants.mjs").includes('const res = await chooseSpecies({ item, actor, adding: true });') && src("module/grants.mjs").includes('"system.speciesHigh": res.side'), "| the sheet opens it (Species: Choices):", src("templates/actor-sheet-pc.hbs").includes('data-action="openSpecies"') && src("module/actor-sheets.mjs").includes("editSpecies(this.actor)"), "| Initiative is its own window since v0.0.310 (not the pick window):", !src("module/initwindow.mjs").includes("pickWith") && src("module/combat.mjs").includes("W.openInitiative(this)"));
console.log("the class window's high side: a selection at level 1:", src("module/classwindow.mjs").includes('data-hhigh="${k}"') && src("module/classwindow.mjs").includes("healthHigh: this.healthHigh }") && src("module/classwindow.mjs").includes('await actor.update({ "system.healthHigh": res.healthHigh })'), "| no swap on the sheet (v0.0.245: chosen once), a dropped class starts on Vigor:", !src("templates/actor-sheet-pc.hbs").includes("swapHealthHigh") && !src("module/actor-sheets.mjs").includes("swapHealthHigh") && src("module/classwindow.mjs").includes('this.healthHigh = o.swap?.healthHigh ?? "vigor";'), "| a dropped species starts fresh:", src("module/specieswindow.mjs").includes('adding ? { chosen: [], side: "" }'));
console.log("the Reaction AP pip: teal in the turn too, a divider before it:", ["#twod12-carousel .tp.act .tp-pips i.rap.on { background: var(--tp-teal)", ".hpip.rap.on { background: #43b3a8; }", '<span class="hsep"></span><a class="hpip rap'].every(s => src("styles/system.css").includes(s) || src("templates/actor-sheet-pc.hbs").includes(s)), "| strip, ticker, tracker:", (src("module/carousel.mjs").includes("marksHtml(") && src("module/hudview.mjs").includes('<b class="hm-sep"></b>${diamonds}')) && src("module/ticker.mjs").includes('<span class="hsep"></span><i class="rap') && src("module/combat.mjs").includes('<span class="hsep"></span><a class="twod12-rap'), "| a 1px line, a span:", src("styles/system.css").includes(".hsep { display: inline-block; flex: none; width: 1px;"));
