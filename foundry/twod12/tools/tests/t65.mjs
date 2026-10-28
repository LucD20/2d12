// Run with: node tools/tests/run.mjs (or node tools/tests/t65.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { derivedMods, matches } = await import(ROOT + "module/effects.mjs");
const mods = derivedMods({ system: { bloodied: true, strained: true }, itemTypes: { weapon: [] } });
const rolls = { "Weapon Attack (Instinct weapon)": ["strike", "weapon", "__action"], "Trip (Body)": ["strike", "handle", "body", "instinct", "__action"], "Steel Yourself": ["self", "__action"], "Rimebrand (Magic)": ["divine", "magic", "self", "__action"], "Body Save": ["body", "__save"], "Instinct Save": ["instinct", "__save"], "Mind Save": ["mind", "__save"], "Appeal Save": ["appeal", "__save"], "Body Check": ["body", "__check"], "Mind Check": ["mind", "__check"] };
for (const [n, t] of Object.entries(rolls)) { const s = new Set(t); console.log(n.padEnd(32), mods.filter(m => matches(m, s)).map(m => m.name).join(", ") || "-"); }
