// Run with: node tools/tests/run.mjs (or node tools/tests/t192.mjs)
// v0.0.253 (Lucas): the hover card of an effect or condition: the name and its duration, a short description (the item's, cut to its first sentences),
// the source, and a small line with the controls; on the sheet's condition chips and on the effect names of a chat card.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const U = await import(ROOTURL + "module/util.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("shortText cuts at a sentence:", JSON.stringify(U.shortText("<p>Enfeebled N subtracts N from every die of your damage, but each die still deals at least 1. Only the highest Enfeebled value applies, and it is taken from the Empowered value. A third sentence that goes on and on and on past the limit of the card for sure, really.</p>", 120)));
console.log("a short text stays:", U.shortText("Prone. Stand costs 1 AP.", 100), "| a long word run ends with an ellipsis:", U.shortText("a".repeat(50) + " " + "b".repeat(50) + " " + "c".repeat(50), 60));
console.log(U.fxTipHtml({ name: "Enfeebled 1", dur: "1 round", text: "<p>Enfeebled N subtracts N from every die of your damage.</p>", source: "From Krysta", controls: "Click the name: open · ×: remove" }));
const sh = src("module/actor-sheets.mjs"), ac = src("module/actions.mjs"), hbs = src("templates/actor-sheet.hbs");
console.log("the sheet's chips carry the card (the controls differ for the Exhausted counter):", sh.includes('controls: counter ? "Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove" : "Click the name: open · ×: remove"') && hbs.includes('{{{tipAttrs}}}>') && !hbs.includes("{{#if counter}}Click: +1"), "| Bloodied and Strained too:", sh.includes('fxTipHtml({ name: "Bloodied"') && sh.includes('fxTipHtml({ name: "Strained"'));
console.log("the chat card's effect names carry it (auto / with the Effects button):", ac.includes('controls: x.mode === "auto" ? "Applied with the damage." : "Applied with the Effects button."') && ac.includes('<span class="fxname"') && (ac.match(/fxNames\(fxn/g) ?? []).length >= 2, "| the CSS:", src("styles/system.css").includes(".twod12.fxtip .ft-ctl"));
