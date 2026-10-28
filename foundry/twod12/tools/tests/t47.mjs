// Run with: node tools/tests/run.mjs (or node tools/tests/t47.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} };
const sm = await import(ROOT + "module/speedmods.mjs");
const eff = mods => ({ disabled: false, getFlag: () => mods });
const hind = [{ mode: "override", formula: "floor(speed/2)" }];
console.log("Prone + Hindered on Speed 6:", sm.applySpeedMods({ effects: [eff(hind), eff([{ mode: "override", formula: "floor( speed / 2 )" }])] }, 6), "(3, not 1) | Hindered + Immobilized:", sm.applySpeedMods({ effects: [eff(hind), eff([{ mode: "override", formula: "0" }])] }, 6));
