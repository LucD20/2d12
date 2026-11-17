// Run with: node tools/tests/run.mjs (or node tools/tests/t195.mjs)
// v0.0.256 (Lucas's test of v0.0.255): the hover cards through data-tooltip-html (Foundry 13) and data-tooltip (older), the HUD's card given to the
// tooltip manager as an element on hover; the Apply rows' two columns with the buttons of one width; the card's target name bigger.
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const U = await import(ROOTURL + "module/util.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("tipAttrs:", U.tipAttrs('<div class="x">a "b" &amp; c</div>'), "| none:", JSON.stringify(U.tipAttrs("")));
console.log("the chips, the chat's effect names and the HUD write both attributes:", src("templates/actor-sheet-pc.hbs").includes("{{{tipAttrs}}}>{{#if linkedTo}}") && src("module/actor-sheets.mjs").includes("c.tipAttrs = tipAttrs(c.tip)") && src("module/actions.mjs").includes("${tipAttrs(x.tip)}") && src("module/effects.mjs").includes("el.dataset.tooltipHtml = html; el.dataset.tooltip = html;"));
console.log("the HUD gives the manager an element on pointerover (capture):", src("module/effects.mjs").includes('game.tooltip?.activate?.(el, { content: box, direction: "LEFT" })') && src("module/effects.mjs").includes('root.addEventListener("pointerover"'));
console.log("the Apply rows' grid and the target name:", src("styles/system.css").includes(".twod12.chat .applyrow { display: grid; grid-template-columns: minmax(0, 1fr) 196px;") && src("styles/system.css").includes(".twod12.chat .cardtargets { font-size: 14px; font-weight: 700; }"));
