// Run with: node tools/tests/run.mjs (or node tools/tests/t66.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.CONFIG = {}; globalThis.foundry = {};
const { perceptionOf } = await import(ROOT + "module/senses.mjs");
const A = (...s) => ({ statuses: new Set(s) });
console.log("Clear:", JSON.stringify(perceptionOf(A())), "| Obscured:", perceptionOf(A("obscured")), "| Hidden:", perceptionOf(A("hidden")), "| Unsensed:", perceptionOf(A("unsensed")));
console.log("the worst one wins: hidden+obscured →", perceptionOf(A("obscured", "hidden")), "| unsensed+hidden →", perceptionOf(A("hidden", "unsensed")), "| no actor →", JSON.stringify(perceptionOf(null)));
