// Run with: node tools/tests/run.mjs (or node tools/tests/t18.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
const c = await import(ROOT + "module/calc.mjs");
console.log("avg", c.avgFormula("1d4+2"), c.avgFormula("2d6+1d4"), c.avgFormula("3"), c.avgFormula("1d12+1"), c.avgFormula("abc"), c.avgFormula(""));
const p = c.tierProbs(2); console.log("probs +2", p.map(x => x.toFixed(4)), (p[0] + p[1] + p[2]).toFixed(6));
console.log("probs +2, 1 bane", c.tierProbs(2, 13, 1).map(x => x.toFixed(3)), "1 boon", c.tierProbs(2, 13, -1).map(x => x.toFixed(3)));
const gs = { system: { damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } } } };
const I = o => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", effect: "", heal: false, ...o });
const pal = { t1: [I({ useW: true, wCount: 1 }), I({ dice: "1d4", subtype: "H" })], t2: [I({ useW: true }), I({ dice: "1d8", subtype: "H" })], t3: [I({ useW: true }), I({ dice: "1d12+1", subtype: "H" })] };
const s = c.versionStats(pal, { weapon: gs, attrVal: 2, isWeapon: true, mod: 2 });
console.log("Paladin 1.. 2AP-ish", s.avg, s.exp.map(x => x.toFixed(2)), s.expTotal.toFixed(2));
const gsa = { t1: [I({ useAt: true })], t2: [I({ dice: "1d10" })], t3: [I({ dice: "2d6" })] };
const g = c.versionStats(gsa, { weapon: gs, attrVal: 2, isWeapon: true, mod: 2 }); console.log("Greatsword Attack", g.avg, g.expTotal.toFixed(3), "(was 6.373)");
const bw = { t1: [I({ useW: true })], t2: [I({ useW: true })], t3: [I({ useW: true })] };
const b = c.versionStats(bw, { weapon: gs, attrVal: 2, isWeapon: true, mod: 2 }); console.log("Basic", b.avg, b.expTotal.toFixed(3), "(was 5.363)");
console.log(c.fmt(7.25), c.fmt(null), c.fmt(0));
