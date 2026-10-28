// Run with: node tools/tests/run.mjs (or node tools/tests/t97.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
// Empowered N and Enfeebled N: +N or -N on every damage die (each die at least 1), one value of each (the highest), netted.
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] } }; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => true }, user: { id: "u", targets: new Set() }, socket: { emit() {} }, combat: null };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, dice: { terms: { OperatorTerm: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), hasProperty: () => false } };
const C = await import(ROOT + "module/calc.mjs");
console.log("--- how much a step adds to a roll (the dice that came up -> the change)");
const table = (results, steps) => console.log(`dice ${JSON.stringify(results).padEnd(14)}`, steps.map(n => `${n > 0 ? "Empowered " + n : "Enfeebled " + -n}: ${C.perDieDelta(results, n) >= 0 ? "+" : ""}${C.perDieDelta(results, n)}`).join(" | "));
table([3], [1, 2, 3, -1, -2, -3]);
table([2, 5], [1, 2, -1, -2]);
table([1, 1, 1], [3, -3]);
table([6, 1, 4, 2], [1, -2]);
table([], [2, -2]);
console.log("step 0 or nothing:", C.perDieDelta([4, 4], 0), C.perDieDelta([4, 4]), C.perDieDelta([4, 4], "x"), "| a fraction is cut:", C.perDieDelta([4], 1.9), C.perDieDelta([4, 6], -1.9));
console.log("--- one value of each counts, and they net");
const L = (...ns) => ns.map(n => ({ n }));
const nets = [["no sources", [], []], ["Empowered 1", L(1), []], ["Empowered 1 and 2 (the highest)", L(1, 2), []], ["Empowered 1 twice", L(1, 1), []], ["Enfeebled 1 twice", [], L(1, 1)], ["Empowered 2, Enfeebled 1", L(2), L(1)], ["Empowered 1, Enfeebled 3", L(1), L(3)], ["Empowered 2, Enfeebled 2", L(2), L(2)]];
for (const [label, e, f] of nets) { const n = C.netStep(e, f); console.log(label.padEnd(34), "->", n, JSON.stringify(C.stepLabel(n))); }
console.log("netStep with nothing:", C.netStep(), "| labels:", JSON.stringify([C.stepLabel(0), C.stepLabel(1), C.stepLabel(-3)]));
// ------------------------------------------------------------------ the damage of an instance, rolled with a stand-in for Roll
console.log("--- the damage of an instance");
let queue = [];
globalThis.Roll = class { constructor(f) { this.formula = f; } async evaluate() {
  const dice = []; let expr = this.formula.replace(/(\d*)d(\d+)/g, (m, n, f) => { const c = Number(n || 1), results = []; for (let i = 0; i < c; i++) results.push({ result: queue.shift() ?? 1 }); dice.push({ faces: Number(f), results }); return `(${results.reduce((a, r) => a + r.result, 0)})`; });
  this.dice = dice; this.total = Function(`return (${expr})`)(); return this; } };
const A = await import(ROOT + "module/actions.mjs");
const run = async (label, inst, ctx, results) => { queue = [...results]; const r = await A.resolveInstance(inst, { rolls: [], attrVal: 3, tier: 2, ...ctx }); const c = r.comps.map(x => `${x.kind} "${x.formula}" = ${x.total} (dice ${JSON.stringify(x.dice.map(d => d.results))})`).join(" ; "); console.log(label.padEnd(46), c); };
await run("2d6, dice 3 and 5, no step", { dice: "2d6" }, { empowered: 0 }, [3, 5]);
await run("... Empowered 1", { dice: "2d6" }, { empowered: 1 }, [3, 5]);
await run("... Empowered 2", { dice: "2d6" }, { empowered: 2 }, [3, 5]);
await run("... Enfeebled 1", { dice: "2d6" }, { empowered: -1 }, [3, 5]);
await run("... Enfeebled 2 (a die can't go below 1)", { dice: "2d6" }, { empowered: -2 }, [1, 3]);
await run("1d8 and the attribute [At] (3), Empowered 2", { dice: "1d8", useAt: true }, { empowered: 2 }, [4]);
await run("1d8 and the attribute, Enfeebled 3", { dice: "1d8", useAt: true }, { empowered: -3 }, [2]);
await run("the attribute alone, Empowered 2 (no dice)", { dice: "", useAt: true }, { empowered: 2 }, []);
const w = (die, count, mod) => ({ system: { subtype: "Sl", damage: { t2: { die, count, mod } } } });
await run("a weapon 2d6+1, Empowered 1", { useW: true, wCount: 1 }, { weapon: w("d6", 2, 1), empowered: 1 }, [2, 6]);
await run("a weapon 2d6+1, Enfeebled 1", { useW: true, wCount: 1 }, { weapon: w("d6", 2, 1), empowered: -1 }, [2, 6]);
await run("a weapon 1d4+2 (a crossbow), Empowered 2", { useW: true, wCount: 1 }, { weapon: w("d4", 1, 2), empowered: 2 }, [3]);
await run("a weapon with a flat number only (Fists: 1)", { useW: true, wCount: 1 }, { weapon: w("", 0, 1), empowered: 2 }, []);
await run("a weapon with no damage on this tier", { useW: true, wCount: 1 }, { weapon: { system: { subtype: "Bl", damage: {} } }, empowered: 2 }, []);
await run("4d8 + 5 (high level), Empowered 3", { dice: "4d8+5" }, { empowered: 3 }, [8, 1, 4, 7]);
await run("... Enfeebled 3", { dice: "4d8+5" }, { empowered: -3 }, [8, 1, 4, 7]);
await run("two instances do not share the step", { dice: "1d6" }, { empowered: 1 }, [4]);
console.log("--- what older cards stored");
console.log([true, false, undefined, null, 0, 1, 2, -1, "2", 1.7, "x"].map(v => `${JSON.stringify(v)} -> ${A.stepOf(v)}`).join(" | "));
