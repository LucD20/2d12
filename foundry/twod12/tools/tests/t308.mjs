// Run with: node tools/tests/run.mjs (or node tools/tests/t308.mjs)
// v0.0.501 (Lucas's report on v0.0.500): the numbered condition icons (condnum.mjs, tools/build-cond-numbers.mjs), the Save dialog's chips in
// words and its color tokens (checkwindow.mjs chipWords; ckwin carries the cards' tokens), the Token HUD's layer above the interface, a Large
// token's wall test (inset corners, and every position change), and the cone of a larger creature being moved (book, Chapter 3).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= {}; globalThis.foundry.applications ??= { api: { ApplicationV2: class {}, DialogV2: {} } };
await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const N = await import(ROOTURL + "module/condnum.mjs"), CW = await import(ROOTURL + "module/checkwindow.mjs"), MV = await import(ROOTURL + "module/move.mjs");
const B = await import(ROOTURL + "tools/build-cond-numbers.mjs");

console.log("--- the numbered condition icons");
const I = "systems/twod12/icons/conditions/";
for (const d of [
  { img: `${I}vulnerable.svg`, name: "Vulnerable 1", statuses: ["vulnerable"] },
  { img: `${I}slowed.svg`, name: "Slowed", statuses: ["slowed"], flags: { twod12: { value: 2 } } },
  { img: `${I}numbered/slowed-2.svg`, name: "Slowed", statuses: ["slowed"], flags: { twod12: { value: 3 } } },
  { img: `${I}numbered/exhausted-2.svg`, name: "Exhausted", statuses: ["exhausted"] },
  { img: `${I}vulnerable.svg`, name: "Vulnerable 14 (1 round)", statuses: ["vulnerable"] },
  { img: `${I}prone.svg`, name: "Prone", statuses: ["prone"] },
  { img: "icons/svg/eye.svg", name: "Vulnerable 1", statuses: ["vulnerable"] },
  { img: `${I}numbered/vulnerable-1.svg`, name: "Vulnerable 1", statuses: ["vulnerable"] }
]) console.log(`${d.name} (${d.img.replace(I, "")}) ->`, JSON.stringify(N.wantedImg(d).replace(I, "")));
console.log("the HUD's pill draws the plain icon:", N.plainIcon(`${I}numbered/dazed-3.svg`).replace(I, ""), "| values:", N.valueOf({ name: "Sickened 2 (EoT)" }), N.valueOf({ name: "Dazed", flags: { twod12: { value: 1 } } }));
const built = B.buildAll({ write: false }), onDisk = Object.keys(built).every(f => { try { return fs.readFileSync(`${ROOT}icons/conditions/numbered/${f}`, "utf8") === built[f]; } catch (e) { return false; } });
console.log("icons:", Object.keys(built).length, "| up to date (node tools/build-cond-numbers.mjs):", onDisk, "| every valued condition has an icon:", N.VALUED_CONDITIONS.every(id => fs.existsSync(`${ROOT}icons/conditions/${id}.svg`)));
console.log("wired:", src("module/twod12.mjs").includes("registerCondNumbers();"), "| v0.0.500's drawing over Foundry's sprites gone:", !src("module/statuspal.mjs").includes("_drawEffects ="));

console.log("--- the Save dialog");
for (const t of ['3d6[mind,holy], "@Move[pushed|distance:1]"', '"You are @Condition[vulnerable|value:1|eot] and @Condition[prone]{Prone}."', "@Move[pull|distance:2]", "@Condition[bleed]"]) console.log(JSON.stringify(t), "->", CW.saveTierWords(t));
console.log("the dialog carries the cards' color tokens (dark theme):", src("styles/system.css").includes(".twod12.rolldlg .twod12, .twod12.ckwin, .twod12.ckwin .twod12 {"), "| in the theme:", src("styles/theme.css").includes("ckwin"));

console.log("--- the Token HUD above the interface");
console.log(src("module/hudhp.mjs").includes('layer.style.zIndex = "1000"'));

console.log("--- a Large token in a wall");
const mv = src("module/move.mjs");
console.log("inset corners tested (the Alt-drag):", mv.includes("squareProbes(c.i + di, c.j + dj, size)"), "| a willing drag isn't checked (v0.0.502):", !mv.includes("every position change of a larger token is checked here too"));
console.log("--- v0.0.502: the HUD's boxes stacked above the Token HUD's columns; the panel beside the chat draws the plain icon and a large number");
console.log(src("styles/system.css").includes("#token-hud .twod12-hphud { position: relative; z-index: 5; flex-direction: column;"), src("module/effects.mjs").includes("const img = plainIcon(e.img);"), src("styles/system.css").includes("#twod12-effects .fx-val { right: -6px; bottom: -6px; min-width: 22px;"));

console.log("--- the cone of a larger creature being moved (book, Chapter 3)");
const big = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 1, j: 1 }];
const show = m => [...m.values()].filter(n => n.steps).map(n => `${n.di},${n.dj}`).sort().join(" ");
console.log("nearest squares, a Medium at its left:", JSON.stringify(MV.nearestMovedCells(big, [{ i: 0, j: -1 }])), "| from straight above its middle (a Large origin):", JSON.stringify(MV.nearestMovedCells(big, [{ i: -2, j: 0 }, { i: -2, j: 1 }])));
console.log("Pushed 2, a Medium at its left:", show(MV.pushShifts(big, [{ i: 0, j: -1 }], 2)));
console.log("the same as a one-square creature's:", show(MV.pushShifts(big, [{ i: 0, j: -1 }], 2)) === show(MV.pushShifts([{ i: 0, j: 0 }], [{ i: 0, j: -1 }], 2)));
console.log("Pushed 2, a Large origin above it:", show(MV.pushShifts(big, [{ i: -2, j: 0 }, { i: -2, j: 1 }, { i: -1, j: 0 }, { i: -1, j: 1 }], 2)));
console.log("Pulled 2 from 3 squares to its left:", show(MV.pullShifts(big, [{ i: 0, j: -4 }], 2)));
const book = fs.readFileSync(`${ROOT}../../book/rules-src/03-movement.md`, "utf8");
console.log("the book's rule:", book.includes("**A larger creature being moved is measured from its squares nearest the origin.**"));
