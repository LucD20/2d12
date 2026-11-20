// Run with: node tools/tests/run.mjs (or node tools/tests/t286.mjs)
// v0.0.457 (B3/E6, Lucas 2026-11-19: "each damage type one color everywhere"): one hue a damage type, a light and a dark variant, the same
// in the book (build_rules.py DTYPE2) and in Foundry (config.mjs subtypeInk / subtypeColors); no surface keeps a palette of its own.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const CFG = await import(ROOTURL + "module/config.mjs"), CC = await import(ROOTURL + "module/chatcards.mjs");
const T = CFG.TWOD12, py = src("../../book/build_rules.py");
const book = Object.fromEntries([...py.match(/DTYPE2 = \{([^}]*)\}/)[1].matchAll(/"(\w+)": \("(#[0-9a-f]{6})", "(#[0-9a-f]{6})"\)/g)].map(m => [m[1], [m[2], m[3]]]));
const codes = Object.keys(T.subtypeInk);
console.log("12 types, both variants:", codes.length, codes.every(c => T.subtypeColors[c]));
console.log("the book's pair equals Foundry's:", codes.every(c => book[T.subtypes[c]]?.[0] === T.subtypeInk[c] && book[T.subtypes[c]]?.[1] === T.subtypeColors[c]));
for (const c of codes) console.log(" ", c, T.subtypes[c], "light", T.subtypeInk[c], "dark", T.subtypeColors[c]);
console.log("the chat card's codes read config:", codes.every(c => CC.SUBS[c]?.[1] === T.subtypeInk[c]), "| Fi:", CC.subCode("Fi"), "| no empty key:", !("" in CC.SUBS));
console.log("no own palette left:", !/SUB_INK = \{/.test(src("module/rolldlg.mjs")), !/Fi: \["Fire", "#/.test(src("module/chatcards.mjs")),
  !/ap-tt \.dtype \{ color: #/.test(src("styles/system.css")), !/\.comp\.sub-Fi \{ background/.test(src("styles/system.css")));
console.log("a damage word carries both:", CFG.prettyDamage("[V] 1d6 Fi").includes(`--sc-d:${T.subtypeColors.Fi}`));
