// The six bows of book/weapon-trees.md turn by turn at levels 1 to 10 (the Revision of 2026-10-31): node book/ruler/bows.mjs
const { tierProbs } = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const AVG = { d4: 2.5, d6: 3.5, d8: 4.5, d10: 5.5, d12: 6.5 };
const av = s => String(s).split("+").map(x => x.trim()).reduce((t, x) => { const m = /^(\d*)(d\d+)$/.exec(x); return t + (m ? (Number(m[1] || 1) * AVG[m[2]]) : Number(x) || 0); }, 0);
const ref = m => { const q = tierProbs(m, 13); return q[1] * (4.5 + m) + q[2] * (7 + m); };
const AP = m => 4.66 * ref(m) / ref(2), SC = m => AP(m) / 4.66;
const P = (m, b = 0, fav = false) => tierProbs(m, 13, b < 0 ? -b : 0, b > 0 ? b : 0, fav ? "favored" : "");
const W = { hunting: [3.5, 5.5], recurve: [3.5, 5.5], longbow: [4.5, 5.5], composite: [3.5, 6.5], warbow: [5.5, 7], flight: [3.5, 9] };
const VOL = { longbow: 0.02, warbow: 0.02 };
// a roll: base[t] = damage without Mod; Mod on T2/T3 (and T1 if t1mod); nW = how many [W] (Master: +1)
const roll = (k, m, { b = 0, fav = false, nW = 1, add = [0, 0, 0], t1mod = false, master = false }) => {
  const q = P(m, b, fav), w = W[k], n = nW + (master && nW > 0 ? 1 : 0);
  return (q[0] * ((t1mod ? m : 0) + add[0]) + q[1] * (n * w[0] + m + add[1]) + q[2] * (n * w[1] + m + add[2])) * (1 - (VOL[k] ?? 0));
};
const wa = (k, m, b, M) => roll(k, m, { b, master: M });
const three = (k, m, M) => wa(k, m, 0, M) + wa(k, m, 1, M) + wa(k, m, 2, M);
const two = (k, m, M) => wa(k, m, 0, M) + wa(k, m, 1, M);
function table(opt) {
  const rows = [];
  for (const [L, m] of [[1, 2], [2, 2], [4, 2], [5, 3], [7, 3], [8, 4], [10, 4]]) {
    const M = L >= 8, r = { L, m };
    // Hunting: Wounding Shot 2 AP from L2 (Bleed 1d4/1d6/2d4 x1.5 ticks), written with 1[W]
    const ws2 = roll("hunting", m, { t1mod: true, master: M, add: [3.75, 5.25, 7.5] });
    r.hunting = L < 2 ? three("hunting", m, M) : ws2 + two("hunting", m, M) + (L >= 7 ? 0.6 * wa("hunting", m, 0, M) : 0);
    // Recurve: 3 WA + Parthian Shot 2R (WA with 1 Boon + Evade 2 worth half an AP)
    const pt = opt.parthP(L);
    r.recurve = three("recurve", m, M) + (L >= 2 ? pt * (wa("recurve", m, -1, M) + 0.5 * AP(m)) : 0) + (L >= 5 ? 0.3 * wa("recurve", m, 0, M) : 0);
    // Longbow: Plunging Shot 2 AP (1[W] + 1d8; 1d8 + [Mod] on T1), Loose Together 1R (70%) from its 14
    const startA = 5, techA = opt.techAtStart ? 5 : 6;
    const pl2 = roll("longbow", m, { t1mod: true, master: M, add: [4.5, 4.5, 4.5] });
    r.longbow = L < startA ? null : (L < techA ? three("longbow", m, M) : pl2 + two("longbow", m, M)) + (L >= 7 ? 0.7 * wa("longbow", m, 0, M) : 0);
    // Composite: Flurry 2 AP
    const c = b => wa("composite", m, b, M), t1 = b => P(m, b)[0];
    const [b2, b3] = opt.flurryBanes(L);
    const fl = c(0) + (1 - t1(0)) * (c(b2) + (1 - t1(b2)) * c(b3));
    r.composite = L < startA ? null : (L < techA ? three("composite", m, M) : fl + two("composite", m, M));
    // Warbow and Flight (from L8): Heavy Shaft 2 AP Line (1.6 creatures), Pinpoint Shot 2 AP (Favored, two choices)
    const techE = opt.techAtStart ? 8 : 9;
    const hs = 1.6 * roll("warbow", m, { t1mod: true, master: M });
    const pp = roll("flight", m, { fav: true, master: M }) + (P(m, 0, true)[1] + P(m, 0, true)[2]) * 2 * 1.18 * SC(m);
    r.warbow = L < 8 ? null : (L < techE ? three("warbow", m, M) : hs + two("warbow", m, M)) + (L >= 10 ? 0 : 0);
    r.flight = L < 8 ? null : (L < techE ? three("flight", m, M) : pp + two("flight", m, M)) + (L >= 10 ? 0.9 * wa("flight", m, 0, M) * 0.5 : 0);
    rows.push(r);
  }
  return rows;
}
const show = (name, rows) => { console.log("\n" + name); console.log("L   Mod | Hunting Recurve | Longbow Composite | Warbow Flight"); for (const r of rows) { const f = x => (x == null ? "  -  " : x.toFixed(1).padStart(5)); console.log(String(r.L).padEnd(3), "+" + r.m, "|", f(r.hunting), "  ", f(r.recurve), "|", f(r.longbow), "  ", f(r.composite), "  |", f(r.warbow), f(r.flight)); } };
show("A. As confirmed (Technique at 9 / 14; Parthian on melee Strikes 50%, 65% from L4; Flurry Banes 1-2, Rhythm 0-2 at L8)", table({ techAtStart: false, parthP: L => (L >= 4 ? 0.65 : 0.5), flurryBanes: L => (L >= 8 ? [0, 2] : [1, 2]) }));
show("B. + Technique when you start using it (Advanced at 6, Exotic at 11)", table({ techAtStart: true, parthP: L => (L >= 4 ? 0.65 : 0.5), flurryBanes: L => (L >= 8 ? [0, 2] : [1, 2]) }));
show("C. + Parthian on any [Strike] against you (70%, 85% with Turn and Loose)", table({ techAtStart: true, parthP: L => (L >= 4 ? 0.85 : 0.7), flurryBanes: L => (L >= 8 ? [0, 2] : [1, 2]) }));
show("D. + Flurry Banes 2 then 4 (Rhythm: 1 then 4)", table({ techAtStart: true, parthP: L => (L >= 4 ? 0.85 : 0.7), flurryBanes: L => (L >= 8 ? [1, 4] : [2, 4]) }));
