// Run with: node tools/tests/run.mjs (or node tools/tests/t184.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.244 (Lucas's test of v0.0.243): the Species window and the Initiative window in the class window's format (pickwindow.mjs: selections like the
// Attribute increases, what it grants, a click to confirm); the Health line's high side as a selection in the class window at level 1; the Reaction AP pip
// teal everywhere with a thin divider before it.
globalThis.foundry = { applications: { api: {} }, utils: {} }; globalThis.Hooks = { on() {} }; globalThis.CONFIG = {};
const P = await import(ROOTURL + "module/pickwindow.mjs"), S = await import(ROOTURL + "module/specieswindow.mjs"), I = await import(ROOTURL + "module/initwindow.mjs");
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
console.log("--- the Initiative window");
let it = { attr: "instinct", per: {}, boons: 0, banes: 0, favored: false, doomed: false };
const list = [{ id: "a", name: "Nari" }, { id: "b", name: "Goblin" }];
m = I.initiativeModel(list, it); console.log("sections:", m.sections.map(x => `${x.title} [${x.pill}]`).join(" | "), "| message:", m.message, "| icon:", m.icon);
it = I.initiativePick(it, "attr", "body"); it = I.initiativePick(it, "fav", "favored"); it = I.initiativePick(it, "per:b", "mind"); it = I.initiativeInput(it, "boons", "2"); it = I.initiativeInput(it, "banes", "-1");
console.log("after the clicks:", JSON.stringify(it), "| Favored again toggles off:", I.initiativePick(it, "fav", "favored").favored, "| Same clears the creature's own:", JSON.stringify(I.initiativePick(it, "per:b", "").per));
m = I.initiativeModel(list, it); console.log("pills:", m.sections.map(x => x.pill).join(" | "), "| the per row for the Goblin:", m.sections[2].rows[1].opts.filter(o => o.on).map(o => o.l).join(""));
console.log("--- the window's HTML (pure)");
const html = P.pickWindowHtml(m);
console.log("header, stats, 3 sections, footer:", html.includes('<h1>Initiative <small>2 creatures</small></h1>'), html.includes("cw-stats"), (html.match(/<section class="cw-sec">/g) ?? []).length, html.includes('data-confirm>Roll</button>'), "| a pressed button:", /data-key="pick:attr:body"[^>]*aria-pressed="true"/.test(html), "| the Boons input:", html.includes('data-field="boons" value="2"'), "| disabled confirm when incomplete:", P.pickWindowHtml({ name: "x", complete: false }).includes("data-confirm disabled"));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("--- wiring: a dropped species opens the window:", src("module/grants.mjs").includes('const res = await chooseSpecies({ item, actor, adding: true });') && src("module/grants.mjs").includes('"system.speciesHigh": res.side'), "| the sheet opens it (Species: Choices):", src("templates/actor-sheet.hbs").includes('data-action="openSpecies"') && src("module/actor-sheets.mjs").includes("editSpecies(this.actor)"), "| Initiative uses it:", src("module/combat.mjs").includes("const ask = await askInitiative(list);") && !src("module/combat.mjs").includes("async function askInitiativeAttr"));
console.log("the class window's high side: a selection at level 1:", src("module/classwindow.mjs").includes('data-hhigh="${k}"') && src("module/classwindow.mjs").includes("healthHigh: this.healthHigh }") && src("module/classwindow.mjs").includes('await actor.update({ "system.healthHigh": res.healthHigh })'), "| no swap on the sheet (v0.0.245: chosen once), a dropped class starts on Vigor:", !src("templates/actor-sheet.hbs").includes("swapHealthHigh") && !src("module/actor-sheets.mjs").includes("swapHealthHigh") && src("module/classwindow.mjs").includes('this.healthHigh = "vigor";'), "| a dropped species starts fresh:", src("module/specieswindow.mjs").includes('adding ? { chosen: [], side: "" }'));
console.log("the Reaction AP pip: teal in the turn too, a divider before it:", ["#twod12-carousel .tp.act .tp-pips i.rap.on { background: var(--tp-teal)", ".hpip.rap.on { background: #43b3a8; }", '<span class="hsep"></span><a class="hpip rap'].every(s => src("styles/system.css").includes(s) || src("templates/actor-sheet.hbs").includes(s)), "| strip, ticker, tracker:", src("module/carousel.mjs").includes('<span class="hsep"></span><i class="rap') && src("module/ticker.mjs").includes('<span class="hsep"></span><i class="rap') && src("module/combat.mjs").includes('<span class="hsep"></span><a class="twod12-rap'), "| a 1px line, a span:", src("styles/system.css").includes(".hsep { display: inline-block; flex: none; width: 1px;"));
console.log("colored names: Attributes in the rows:", P.pickWindowHtml(m).includes('<span class="cw-a-body">Body</span>'), "| the creatures by side:", (() => { const h = P.pickWindowHtml(I.initiativeModel([{ id: "a", name: "Nari", side: 1 }, { id: "b", name: "Goblin", side: -1 }], it)); return h.includes('<span class="cw-ally">Nari</span>') && h.includes('<span class="cw-foe">Goblin</span>'); })());
