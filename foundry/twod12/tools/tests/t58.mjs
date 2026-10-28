// Run with: node tools/tests/run.mjs (or node tools/tests/t58.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const cf = await import(ROOT + "module/config.mjs");
console.log("targets line with retarget:", cf.targetsRowHtml(["Goblin"], { retarget: true }).includes('data-twod12="retargetAction"'), "| empty, still shows the button:", cf.targetsRowHtml([], { retarget: true }).includes("No target"), "| plain (no button):", cf.targetsRowHtml(["Goblin"]).includes("retarget"), "| nothing when empty and plain:", cf.targetsRowHtml([]) === "");
