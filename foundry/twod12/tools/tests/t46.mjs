// Run with: node tools/tests/run.mjs (or node tools/tests/t46.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class { setupTurns() { return this._t; } }; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1 } };
const warns = []; globalThis.ui = { notifications: { warn: m => warns.push(m), info() {} } };
const cb = await import(ROOT + "module/combat.mjs");
const c = sys => ({ actor: { system: sys } });
console.log("AP: healthy", cb.apPerTurn(c({})), "| Down + Bloodied", cb.apPerTurn(c({ atZero: true, bloodied: true })), "| Down + both", cb.apPerTurn(c({ atZero: true, bloodied: true, strained: true })), "| Bloodied not Down", cb.apPerTurn(c({ bloodied: true })));
const mk = (name, init, attr, disp) => ({ name, initiative: init, token: { disposition: disp }, getFlag: (s, k) => (k === "initAttr" ? attr : undefined), actor: {} });
const combat = new cb.TwoD12Combat(); combat._t = [mk("PC-low", 14, 1, 1), mk("NPC-high", 14, 3, -1), mk("PC-high", 14, 2, 1), mk("NPC2", 9, 0, -1)];
console.log("tie order:", combat.setupTurns().map(x => x.name).join(", "), "(NPC-high has the higher Attribute, so its group goes first)");
combat._t = [mk("PC", 12, 1, 1), mk("NPC", 12, 1, -1)]; console.log("full tie:", combat.setupTurns().map(x => x.name).join(", "), "(Friendly first)");
console.log("(Rally Points can now be used while Down through other Actions; the Rally Action itself is blocked in useAction)");
