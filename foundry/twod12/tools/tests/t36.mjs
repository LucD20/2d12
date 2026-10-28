// Run with: node tools/tests/run.mjs (or node tools/tests/t36.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: {} } }; globalThis.Hooks = { on() {} };
const g = await import(ROOTURL + "module/gen.mjs");
const parseTier = text => g.parseTierFull(text).insts;   // (the module keeps parseTierFull only)
const L = x => parseTier(x).map(i => `${i.pool || "-"} ${i.useW ? "W" + i.wCount : ""}${i.dice || ""}${i.useAt ? "At" : ""}${i.subtype ? "/" + i.subtype : ""}${i.effect ? " fx:" + i.effect : ""}`).join(" | ");
console.log(L('1WB,1d6BB,"Pushed 2"')); console.log(L('"Evade 1"')); console.log(L("1d10BS, Cleave 1")); console.log(L('"Prone"'));
console.log("roundtrip:", g.tierToText(parseTier('1WB,"Pushed 2"')));
