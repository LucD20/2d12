// Run with: node tools/tests/run.mjs (or node tools/tests/t64.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { parseInline } = await import(ROOT + "module/inline.mjs");
for (const t of ["-1|trait:strike|rounds:eot", "2|traits:ranged,weapon|rounds:2|self:yes", "-2"]) { const c = parseInline("Boon", t); console.log(t.padEnd(42), JSON.stringify({ n: c.n, traits: c.traits, rounds: c.rounds, self: !!c.self })); }
const { derivedMods } = await import(ROOT + "module/effects.mjs");
const m = derivedMods({ system: { bloodied: true, strained: true }, itemTypes: { weapon: [] } });
console.log("Bloodied matches:", m[0].any, "| Strained matches:", m[1].any);
