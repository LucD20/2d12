// Run with: node tools/tests/run.mjs (or node tools/tests/t198.mjs)
// v0.0.259 (Lucas's test of v0.0.258): one target is a tag, several are "N targets" with a small list under it (a dot per side); the Apply rows
// put one creature's name beside the side and several in a small list under it; the panel's chain is a line with a badge, the linked icon dashed.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const cf = await import(ROOTURL + "module/config.mjs");
const T = (n, d) => ({ name: n, disposition: d });
const mixed = [T("Paladin 1", 1), T("NPC", -1), T("NPC", -1)];
console.log("entries:", JSON.stringify(cf.targetEntries(mixed, 1)));
console.log("three targets, mixed:", cf.targetsRowHtml(cf.targetEntries(mixed, 1), { retarget: true }));
console.log("two of a name:", cf.targetsRowHtml(cf.targetEntries([T("NPC", -1), T("NPC", -1)], 1), { retarget: true }));
console.log("two allies:", cf.targetsRowHtml(cf.targetEntries([T("Nari", 1), T("Lonny", 1)], 1)));
console.log("a name only (the old way):", cf.targetsRowHtml(["Goblin"], { retarget: true }));
const a = src("module/actions.mjs");
console.log("the card and the retarget pass entries:", a.includes("targetsRowHtml(targetEntries(targets, selfToken?.document?.disposition ?? 1), { retarget: true })") && a.includes("targetsRowHtml(targetEntries(targets, mine), { retarget: true })"));
console.log("the Apply rows: the name beside the side, or a list under it:", a.includes("const head = ns.length === 1 ? `${prefix}${word}: <b>${ns[0]}</b>`") && a.includes('<ul class="aplist ${side}">'));
const css = src("styles/system.css"), e = src("module/effects.mjs");
console.log("the styles and the chain:", css.includes(".twod12.chat .cardtargets .tlist {") && css.includes(".twod12.chat .applyrow { display: flex; flex-wrap: wrap;") && css.includes("#twod12-effects .fx-chain .fx-chainline {") && e.includes('<span class="fx-chainline"></span><i class="fa-solid fa-link"></i>') && e.includes('" fx-linked"'));
