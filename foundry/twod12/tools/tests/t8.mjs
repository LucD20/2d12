// Run with: node tools/tests/run.mjs (or node tools/tests/t8.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat ??= class {}; globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= {}; globalThis.foundry ??= {}; globalThis.foundry.utils ??= { deepClone: o => JSON.parse(JSON.stringify(o)), debounce: f => f, setProperty() {} }; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }; globalThis.game ??= { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } } };
globalThis.Hooks = { on() {} };
globalThis.game = { socket: { emit() {} }, user: {} };
const { splitTop, parseParts, parseInline } = await import(ROOTURL + "module/inline.mjs");
console.log(JSON.stringify(parseParts("(1d4+1)[body,slash],1d6[mind,holy]")));
console.log(JSON.stringify(parseParts('1d4[body,blunt],1d4[mind,nonlethal,holy],"The target is Prone",@UUID[Item.abc],0')));
const c = parseInline("Check", "body|dc:14|adj:2|boon:1|bane:2|traits:divine,attack");
console.log(JSON.stringify(c));
const sv = parseInline("Save", "appeal|t1:1d6[mind,holy]|t2:1d4[body,slash]|t3:0");
console.log(JSON.stringify(sv.tiers), JSON.stringify(parseParts(sv.tiers.t1)));
const t = parseInline("Template", "emanation|distance:2|targets:enemies|self:no|places:yes");
console.log(JSON.stringify(t));
// enricher pattern
const re = /@(Check|Damage|Save|Template)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]+)\})?/g;
const text = "Roll @Check[body|dc:14]{Body test} then @Damage[(1d4+1)[body,slash],1d6[mind,holy]] and @Save[appeal|t1:1d6[mind,holy]|t3:0].";
console.log([...text.matchAll(re)].map(m => `${m[1]} <${m[2]}> {${m[3]}}`));
