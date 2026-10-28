// Run with: node tools/tests/run.mjs (or node tools/tests/t54.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const cf = await import(ROOTURL + "module/config.mjs");
const t = h => h.replace(/<[^>]+>/g, "");
console.log("labels:", [t(cf.apLabel([1, 2, 3])), t(cf.apLabel([2, 1])), t(cf.apLabel([1])), t(cf.apLabel([1, 2], true)), t(cf.apLabel([1], true)), t(cf.apIcon(3))].join(" | "));
