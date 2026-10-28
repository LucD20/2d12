globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (m, ba = 0) => { const a = C.tierProbs(m, 13, 0, ba, ""), b = C.tierProbs(m, 14, 0, ba, ""); return a.map((x, i) => (x + b[i]) / 2); };
const avg = s => s.split("+").reduce((t, p) => { const m = p.trim().match(/^(\d*)d(\d+)$/); return t + (m ? (Number(m[1] || 1) * (Number(m[2]) + 1)) / 2 : Number(p)); }, 0);
// role: Modifier, Strikes per turn (banes), Strike dice for Tier 2 / Tier 3 (+ [Mod]), Health: multiplier, base, attribute array
const R = {
  Minion:   { mod: 2, banes: [0], t2: "1d4", t3: "1d8", mult: 1, base: 1, arr: [1, 0, 0, -1], ad: 12, ward: 0, worth: 0.25, target: [3, "~6, one hit"] },
  Grunt:    { mod: 2, banes: [0, 1], t2: "1", t3: "1d4", mult: 4, base: 3, arr: [1, 1, 0, 0], ad: 13, ward: 0, worth: 0.5, target: [5, "~25, 1 PC turn"] },
  Standard: { mod: 2, banes: [0, 1], t2: "1d4", t3: "1d10", mult: 8, base: 4, arr: [2, 1, 0, 0], ad: 13, ward: 1, worth: 1, target: [7.5, "~50, 2 PC turns"] },
  Elite:    { mod: 3, banes: [0, 1, 2], t2: "1d6", t3: "2d6", mult: 14, base: 6, arr: [3, 2, 1, 0], ad: 14, ward: 2, worth: 2, target: [15, "~110, 4-5 PC turns"] }
};
const health = (r, body, mind) => (body + 2) * r.mult + r.base + (mind + 2) * r.mult + r.base;
for (const [n, r] of Object.entries(R)) {
  const dmg = r.banes.reduce((s, b) => { const p = P(r.mod, b); return s + p[1] * (avg(r.t2) + r.mod) + p[2] * (avg(r.t3) + r.mod); }, 0);
  const [hi, lo] = [health(r, r.arr[0], r.arr[1]), health(r, r.arr[3] < 0 ? 0 : r.arr[2], r.arr[3] < 0 ? 0 : r.arr[3])];
  const low = health(r, Math.min(...r.arr), Math.min(...r.arr.filter(x => x !== Math.min(...r.arr)).concat([Math.min(...r.arr)])));
  console.log(`${n.padEnd(9)} Strike ${r.t2}+[Mod] / ${r.t3}+[Mod] (Mod +${r.mod}) x${r.banes.length}: ${dmg.toFixed(1)}/turn (target ${r.target[0]}) | Health Body+Mind high ${hi}, both lowest ${low} (target ${r.target[1]}) | AD ${r.ad}, WD ${11 + r.ward}, Worth ${r.worth}`);
}
