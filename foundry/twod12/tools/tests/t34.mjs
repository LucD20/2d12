// Run with: node tools/tests/run.mjs (or node tools/tests/t34.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const g = await import(ROOTURL + "module/gen.mjs");
const parseTier = text => g.parseTierFull(text).insts;   // (the module keeps parseTierFull only)
const t = x => console.log(JSON.stringify(x).padEnd(60), "->", g.convertEffects(x));
t("Appeal Save"); t("Body Check"); t("DC 14 Body Check"); t("DC 15 Mind Save");
t("Appeal Save: 1d6 / 1d4 / 0 Holy"); t("Appeal Save: 1d6 / 1d4 / 0 [M] Holy damage"); t("DC 14 Body Save: 2d6 / 1d6 / 0 [B] Slash"); t("Instinct Save: 1d4 / 1d4 / 0");
t("Bright light 2Emanation 1/round"); t("Bright light [2Emanation 1/round]"); t("3Burst EoT"); t("2Emanation"); t("Bright light 2Emanation 1/round. 1 Bane on Hide.");
t("As 2 AP. Enemies in the Bright Light must roll an Appeal Save: 1d6 / 1d4 / 0 [M] Holy damage.");
t("Target can use up to 2 Rally Points. Evade 2."); t("Pushed 5 and Move Speed/2"); t("1d6MH holy and Strike 1d4BC");
const p = parseTier; const L = x => p(x).map(i => `${i.pool}${i.useAt ? " At" : ""}${i.useW ? " W" + i.wCount : ""}${i.dice ? " " + i.dice : ""}${i.subtype ? " /" + i.subtype : ""}`).join(" | ");
console.log("tier tokens:", L("Attribute"), "||", L("AttributeB"), "||", L("At M H"), "||", L("1WB,1d4BC,1d6MH"));
// inline parse of what the generator produces
globalThis.CONFIG.TextEditor = { enrichers: [] };
const inl = await import(ROOTURL + "module/inline.mjs");
console.log(JSON.stringify(inl.parseInline("Save", "appeal|t1:1d6[mind,holy]|t2:1d4[mind,holy]|t3:0")).slice(0, 220));
console.log(JSON.stringify(inl.parseInline("Template", "emanation|distance:2|rounds:1")));
