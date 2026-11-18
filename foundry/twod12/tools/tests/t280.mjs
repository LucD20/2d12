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
console.log("--- the hooks fitted (a cell that never grows)");
// a stand-in for the DOM: an element whose width needs 9 px a font pixel per hook word, in a cell 200 px wide and 50 px tall
const fake = (words, w = 200, h = 50) => { const cell = { clientHeight: h }, hl = { parentElement: cell, style: { fontSize: "14px" }, classList: new Set(), clientWidth: w };
  hl.classList.remove = k => Set.prototype.delete.call(hl.classList, k);
  const px = () => parseFloat(hl.style.fontSize);
  Object.defineProperty(hl, "scrollWidth", { get: () => (hl.classList.has("wrap") ? Math.min(words * 9 * px(), w) : words * 9 * px()) });
  Object.defineProperty(cell, "scrollHeight", { get: () => 18 + (hl.classList.has("wrap") ? Math.ceil((words * 9 * px()) / w) : 1) * px() * 1.2 });
  SM.fitHooks(hl); return `${hl.style.fontSize} ${hl.classList.has("wrap") ? "two lines" : "one line"}`; };
console.log("one hook:", fake(1), "| two:", fake(2), "| three:", fake(3), "| six:", fake(6));
console.log("run after each render and on a resize:", sh.includes("this._fitHooks();") && sh.includes("fitHooks(hl)") && sh.includes("new ResizeObserver(() => fit())"), "| the line's height fixed:", css.includes(".twod12-actor .twod12.sheet.pcs.ps2 .ps2-combat { grid-template-columns: minmax(0, 1fr) 150px auto; height: 66px;"));
console.log("the hooks' list:", pcs.includes("hookList: hooksLeft("), "| \"None this encounter\":", tpl.includes('<span class="ps2-none">None this encounter</span>'), "| no rung words on a PC's line:", !/ps2-hooks[\s\S]{0,400}pc\.strip\.esc\.rungs/.test(tpl));
console.log("--- the rest");
console.log("a bar's Frequency only under Reactions, Granted, Escalation, Favorites:", tpl.includes('{{#if showFq}}<span class="ps2-fq">{{bar.fqWord}}</span>{{/if}}') && pcs.includes('for (const k of ["reaction", "granted", "apex"]) for (const r of secRows[k] ?? []) r.showFq = true;') && pcs.includes("showFq: true }))"));
console.log("Out of combat alone:", tpl.includes('<span class="ps2-outc">Out of combat</span>') && !tpl.includes("appear when"), "| the gauge is the click area (its numbers still edit):", tpl.includes('class="ps2-gauge np-gauge') && sh.includes('if (ev.target.closest(".hpnum")) return; change(ev, t.dataset.pool, 1);'));
console.log("the Build tab's cost in ink:", tpl.includes('<span class="ps-pill ps2-ink">{{cost}}</span>') && !tpl.includes('class="ps-pill" style="--fc:{{fc}}"'));
