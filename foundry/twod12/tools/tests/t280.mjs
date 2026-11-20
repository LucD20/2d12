// Run with: node tools/tests/run.mjs (or node tools/tests/t280.mjs)
// v0.0.442 (Lucas on v0.0.441; the fixes mockup foundry/mockups/sheets/fixes.html, round 4 approved: "Yes, with one note: Escalation hooks should
// always fit in there... That area should never grow in size"): a bar's Frequency only where its heading doesn't say it, "Out of combat" alone,
// the gauges' whole width clickable, the Build tab's cost in ink, the combat line: the hooks alone (fitted), the Hands, the marks (AP and Esc.).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const SM = await import(ROOTURL + "module/sheetmodel.mjs");
const tpl = src("templates/actor-sheet-pc.hbs"), pcs = src("module/pcsheet.mjs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("--- the Escalation marks");
console.log(JSON.stringify(SM.escMarks(4, 6, [2, 4, 6])));
console.log(JSON.stringify(SM.escMarks(0, 6, [])), "| a click sets it:", tpl.includes('data-action="setEscalation" data-n="{{n}}" role="button" aria-label="Escalation {{n}}"'));
// v0.0.443 (group 1): the hooks' cell became the two lists (t281 tests them and their fit)
console.log("--- the rest");
console.log("a bar's Frequency only under Reactions, Granted, Escalation, Favorites:", tpl.includes('{{#if showFq}}<span class="ps2-fq">{{bar.fqWord}}</span>{{/if}}') && pcs.includes('for (const k of ["reaction", "granted", "apex"]) for (const r of secRows[k] ?? []) r.showFq = true;') && pcs.includes("showFq: true }))"));
console.log("Out of combat alone:", tpl.includes('<span class="ps2-outc">Out of combat</span>') && !tpl.includes("appear when"), "| the gauge is the click area (its numbers still edit):", tpl.includes('class="ps2-gauge np-gauge') && sh.includes('if (ev.target.closest(".hpnum")) return; change(ev, t.dataset.pool, 1);'));
console.log("the Build tab's cost in ink:", tpl.includes('<span class="ps-pill ps2-ink">{{cost}}</span>') && !tpl.includes('class="ps-pill" style="--fc:{{fc}}"'));
