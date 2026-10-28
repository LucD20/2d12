// Run with: node tools/tests/run.mjs (or node tools/tests/t33.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, NEUTRAL: 0, HOSTILE: -1, SECRET: -2 } };
globalThis.foundry = { applications: { api: { DialogV2: {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } }; globalThis.Hooks = { on() {} };
const { zipper } = await import(ROOT + "module/combat.mjs");
const mk = (n, i, d) => ({ name: n, initiative: i, token: { disposition: d }, actor: {} });
const s = a => a.slice().sort((x, y) => y.initiative - x.initiative);
console.log("two groups:", zipper(s([mk("PC1", 14, 1), mk("PC2", 13, 1), mk("PC3", 10, 1), mk("N1", 12, -1), mk("N2", 10, -1)])).map(c => c.name).join(", "), "(PC1, N1, PC2, N2, PC3)");
console.log("three groups:", zipper(s([mk("PC1", 14, 1), mk("PC2", 9, 1), mk("E1", 12, -1), mk("E2", 8, -1), mk("T1", 13, 0), mk("T2", 5, 0)])).map(c => c.name).join(", "));
console.log("tie, Friendly first:", zipper(s([mk("E", 12, -1), mk("P", 12, 1)])).map(c => c.name).join(", "));
