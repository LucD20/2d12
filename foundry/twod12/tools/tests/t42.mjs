// Run with: node tools/tests/run.mjs (or node tools/tests/t42.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
let seq = []; let idx = 0;
globalThis.Roll = class { constructor(f) { this.f = f; this.dice = []; this.total = 0; } async evaluate() { const m = String(this.f).match(/^(\d+)d(\d+)$/); const n = Number(m[1]), s = Number(m[2]); const res = []; for (let i = 0; i < n; i++) res.push({ result: seq.length ? seq[idx++ % seq.length] : 1 + Math.floor(Math.random() * s) }); this.dice = [{ faces: s, results: res }]; this.total = res.reduce((a, b) => a + b.result, 0); return this; } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { performCheck, checkHtml } = await import(ROOT + "module/roll.mjs");
const run = async (dice, opts) => { seq = dice; idx = 0; return performCheck({ mod: 2, dc: 13, ...opts }); };
// dice come in this order: die1, die2, (die3)
let r = await run([3, 9, 6], { doomed: true });
console.log("Doomed 3,9,6 keeps", r.d1, r.d2, "dropped", r.dropped, "state", r.state, "| total", r.total, "rolls", r.rolls.length);
r = await run([3, 9, 6], { favored: true }); console.log("Favored 3,9,6 keeps", r.d1, r.d2, "dropped", r.dropped, "total", r.total);
r = await run([3, 9, 6], { favored: true, doomed: true }); console.log("both:", r.state === "", r.dropped, "rolls", r.rolls.length);
r = await run([12, 5, 4, 8], { favored: true }); console.log("Favored with an explosion (12 -> 11+5=16, 4, 8):", r.d1, r.d2, "dropped", r.dropped, "total", r.total, "(16+8+2=26)");
r = await run([5, 5, 7], { doomed: true }); console.log("Doomed 5,5,7: doubles on the kept pair:", r.doubles, "tier", r.tier);
const html = checkHtml("Test", await run([3, 9, 6], { doomed: true }), []); console.log("html: dropped die shown:", /dgroup dropped/.test(html), "| Doomed chip:", /Doomed/.test(html));
// strip check: meta row
const cf = await import(ROOT + "module/config.mjs");
console.log(cf.metaRowHtml({ frequency: "round", targetText: "Two or more creatures", distance: "10 / 20 / 40" }).replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "*").replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"), "||", JSON.stringify(cf.metaRowHtml({ frequency: "round", distance: "Self", self: true }).replace(/<[^>]+>/g, "")));
// expire on all
const bn = await import(ROOT + "module/bonus.mjs");
const deleted = []; const fl = { expireOn: ["ranged", "strike", "weapon"], expireAll: true };
const actor = { effects: [{ id: "e1", getFlag: (s, k) => fl[k] }], deleteEmbeddedDocuments: async (t, ids) => deleted.push(...ids) };
console.log("melee strike keeps it:", await bn.expireOnUse(actor, new Set(["strike", "weapon", "melee"])), "| ranged weapon strike ends it:", await bn.expireOnUse(actor, new Set(["strike", "weapon", "ranged"])), deleted);
