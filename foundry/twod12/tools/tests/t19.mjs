// Run with: node tools/tests/run.mjs (or node tools/tests/t19.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: {} } } } };
globalThis.Hooks = { on() {} };
const g = await import(ROOT + "module/gen.mjs");
const parseTier = text => g.parseTierFull(text).insts;   // (the module keeps parseTierFull only)
const show = t => console.log(JSON.stringify(t), "->", JSON.stringify(parseTier(t).map(i => `${i.heal ? "heal " : ""}[${i.pool}] W${i.useW ? i.wCount : "-"} d:${i.dice || "-"} At:${i.useAt ? 1 : 0} s:${i.subtype || "-"}${i.effect ? " fx:" + i.effect : ""}`)));
show("1WB,1d4BH,1d6MH"); show("1d4BS"); show("BB"); show("1d8BB"); show("2WM"); show("AtB"); show("1d10BS, Cleave 1"); show('1WB,"Push 1, then Prone"'); show("h:1d6B"); show("1d6+2MH"); show("1d4"); show("0"); show("-"); show("1d4S"); show("1d4M");
console.log(g.convertEffects("Bright light 2Emanation 1/round"));
console.log(g.convertEffects("DC 14 Body Save or 1d6MH holy, 3Burst"));
const ins = parseTier("1WB,1d4BH,1d6MH,h:1d8C,\"Prone\"");
console.log(g.tierToText(ins), "| roundtrip same:", g.tierToText(parseTier(g.tierToText(ins))) === g.tierToText(ins));
console.log(g.convertEffects(g.convertEffects("2Emanation")) === "@Template[emanation|distance:2]");
