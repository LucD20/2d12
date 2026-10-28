// Bestiary v3 check: damage a turn that each Basic attack rating gives, against the PC Defense of 13 and 14 averaged, vs the role's target.
globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (m, dc, ba) => { const a = C.tierProbs(m, dc, 0, ba, ""), b = C.tierProbs(m, dc + 1, 0, ba, ""); return a.map((x, i) => (x + b[i]) / 2); };
const STEP = { Terrible: .6, Low: .8, Medium: 1, High: 1.2, Extreme: 1.4 };
const r5 = x => Math.round(x * 2) / 2;
// [Modifier, banes of its Strikes in a turn, Medium T2, Medium T3, target per turn]
const R = { Minion: [2, [0, 1], 2, 4, "3 to 4"], Grunt: [2, [0, 1], 3, 4.5, "5"], Standard: [2, [0, 1], 4.5, 7.5, "7 to 8"], Elite: [3, [0, 1, 2], 6.5, 10, "15"] };
for (const [n, [m, banes, t2, t3, tgt]] of Object.entries(R)) {
  const cells = Object.entries(STEP).filter(([k]) => n !== "Minion" || k !== "Extreme").map(([k, s]) => {
    const a = r5(t2 * s), b = r5(t3 * s);
    const d = banes.reduce((z, ba) => { const p = P(m, 13, ba); return z + p[1] * a + p[2] * b; }, 0);
    return `${k} ${a}/${b} → ${d.toFixed(1)}`;
  });
  console.log(`${n.padEnd(9)} (Modifier +${m}, ${banes.length} Strike${banes.length > 1 ? "s" : ""}; target ${tgt}):  ` + cells.join(" | "));
}
