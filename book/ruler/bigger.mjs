globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = m => { const a = C.tierProbs(m, 13, 0, 0, ""), b = C.tierProbs(m, 14, 0, 0, ""); return a.map((x, i) => (x + b[i]) / 2); };
const avg = s => s.split("+").reduce((t, p) => { const m = p.trim().match(/^(\d*)d(\d+)$/); return t + (m ? (Number(m[1] || 1) * (Number(m[2]) + 1)) / 2 : Number(p)); }, 0);
const ev = (m, t2, t3) => { const p = P(m); return p[1] * (avg(t2) + m) + p[2] * (avg(t3) + m); };
const R = { Minion: [2, "1d4", "1d8"], Grunt: [2, "1", "1d4"], Standard: [2, "1d4", "1d10"], Elite: [3, "1d6", "2d6"] };
// bigger Actions: 2 AP (Round) about 2.2 Strikes, 3 AP (Encounter) about 3.5 Strikes, no At-will banes
const cands = []; for (const n of [1, 2, 3, 4, 5, 6]) for (const d of [4, 6, 8, 10, 12]) cands.push(`${n}d${d}`);
for (const [n, [m, t2, t3]] of Object.entries(R)) {
  const one = ev(m, t2, t3);
  const best = k => { let b = null; for (const a of cands) for (const c of cands) { const r = (avg(c) + m) / (avg(a) + m); if (r < 1.45 || r > 1.8 || Number(c.split("d")[0]) < Number(a.split("d")[0]) || Number(c.split("d")[0]) > Number(a.split("d")[0]) + 1) continue; const e = ev(m, a, c), d = Math.abs(e - one * k); if (!b || d < b.d) b = { a, c, e, d }; } return b; };
  const two = best(2.2), three = best(3.5);
  console.log(`${n}|${one.toFixed(1)}|${two.a} / ${two.c} (${two.e.toFixed(1)})|${three.a} / ${three.c} (${three.e.toFixed(1)})`);
}
