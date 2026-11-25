// Run with: node tools/tests/run.mjs (or node tools/tests/t308.mjs)
// v0.0.501 to 503 (Lucas's reports on v0.0.500 to 502): the condition icons (condnum.mjs: numbered in 501 and 502, plain again in 503), the Save dialog's chips in
// words and its color tokens (checkwindow.mjs chipWords; ckwin carries the cards' tokens), the Token HUD's layer above the interface, a Large
// token's wall test (inset corners, and every position change), and the cone of a larger creature being moved (book, Chapter 3).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= {}; globalThis.foundry.applications ??= { api: { ApplicationV2: class {}, DialogV2: {} } };
await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const N = await import(ROOTURL + "module/condnum.mjs"), CW = await import(ROOTURL + "module/checkwindow.mjs"), MV = await import(ROOTURL + "module/move.mjs");

console.log("--- the condition icons on the token: plain again (v0.0.503, Lucas: \"just leave without a number on it\")");
const I = "systems/twod12/icons/conditions/";
for (const img of [`${I}numbered/vulnerable-1.svg`, `${I}numbered/slowed-12.svg`, `${I}vulnerable.svg`, `${I}half-blinded.svg`, "icons/svg/eye.svg"]) console.log(img.replace(I, ""), "->", JSON.stringify(N.restoredImg({ img }).replace(I, "")));
console.log("the HUD's pill and the panel draw the plain icon:", N.plainIcon(`${I}numbered/dazed-3.svg`).replace(I, ""), N.plainIcon(`${I}prone.svg`).replace(I, ""), "| values:", N.valueOf({ name: "Sickened 2 (EoT)" }), N.valueOf({ name: "Dazed", flags: { twod12: { value: 1 } } }));
console.log("the numbered icons and their tool are gone:", !fs.existsSync(`${ROOT}icons/conditions/numbered`), !fs.existsSync(`${ROOT}tools/build-cond-numbers.mjs`), "| the restore wired:", src("module/twod12.mjs").includes("registerCondNumbers();"));

console.log("--- v0.0.503: the status palette's rows are the buttons (click toggles or +1, right-click -1)");
const sp = src("module/statuspal.mjs");
console.log(sp.includes('pal.addEventListener("contextmenu", ev => act(ev, true), true);'), sp.includes("right ? { overlay: true, active: on } : { active: !on }"), src("module/effects.mjs").includes("if (options?.overlay) await bumpValued(valued, -1);"));
console.log("--- v0.0.503: the HUD's boxes inside Foundry's own Health box (bar1)");
console.log(src("module/hudhp.mjs").includes('bar1.classList.add("twod12-hpbar1"); bar1.append(el);'), src("styles/system.css").includes("#token-hud .twod12-hpbar1 .twod12-hphud {"));

console.log("--- the Save dialog");
for (const t of ['3d6[mind,holy], "@Move[pushed|distance:1]"', '"You are @Condition[vulnerable|value:1|eot] and @Condition[prone]{Prone}."', "@Move[pull|distance:2]", "@Condition[bleed]"]) console.log(JSON.stringify(t), "->", CW.saveTierWords(t));
console.log("the dialog carries the cards' color tokens (dark theme):", src("styles/system.css").includes(".twod12.rolldlg .twod12, .twod12.ckwin, .twod12.ckwin .twod12 {"), "| in the theme:", src("styles/theme.css").includes("ckwin"));

console.log("--- the Token HUD above the interface");
console.log(src("module/hudhp.mjs").includes('layer.style.zIndex = "1000"'));

console.log("--- a Large token in a wall");
const mv = src("module/move.mjs");
console.log("inset corners tested (the Alt-drag):", mv.includes("squareProbes(c.i + di, c.j + dj, size)"), "| a willing drag isn't checked (v0.0.502):", !mv.includes("every position change of a larger token is checked here too"));
console.log("--- v0.0.502: the panel beside the chat draws the plain icon and a large number");
console.log(src("module/effects.mjs").includes("const img = plainIcon(e.img);"), src("styles/system.css").includes("#twod12-effects .fx-val { right: -6px; bottom: -6px; min-width: 22px;"));

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

console.log("--- v0.0.504: the HUD's boxes plain (Lucas: \"just two plain boxes, with the outline red and blue, with the number\")");
const H = await import(ROOTURL + "module/hudhp.mjs"), hh = H.hudHpHtml({ vigorLeft: 9, bdt: 14, resolveLeft: 4, mdt: 10 });
console.log("two inputs, no words:", (hh.match(/<input /g) ?? []).length, !/Vigor<|Resolve<|\/ 14/.test(hh.replace(/aria-label="[^"]*"/g, "")), "| within the token's width:", src("styles/system.css").includes("#token-hud .twod12-hpbar1 .twod12-hphud { flex: 1 1 auto; display: flex; gap: 4px; width: 100%;"));
console.log("--- v0.0.504: an old numbered icon is plain in memory before the tokens draw (no Invalid Asset)");
console.log(src("module/condnum.mjs").includes("P.prepareDerivedData = wrapped;"), src("module/condnum.mjs").includes("restoredImg({ img: e._source?.img ?? e.img })"));
console.log("--- v0.0.504: Alt shows every visible token's conditions (condline.mjs; Lucas: \"C is good\")");
const CL = await import(ROOTURL + "module/condline.mjs");
const fx = [{ name: "Vulnerable 1 (1 round)" }, { name: "Slowed", flags: { twod12: { value: 2 } } }, { name: "Prone" }, { name: "Gone", disabled: true }, { name: "Wound", flags: { twod12: { wound: true } } }, { name: "Aim", flags: { twod12: { grants: [{ spec: "Basic Attack" }] } } }, { name: "Prone" }];
console.log(JSON.stringify(CL.condLine(fx)), "| none:", JSON.stringify(CL.condLine([])), "| wired:", src("module/twod12.mjs").includes("registerCondLine();"), "| no hover text:", !/data-tooltip|title=/.test(src("module/condline.mjs")));
