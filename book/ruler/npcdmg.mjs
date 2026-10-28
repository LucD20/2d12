globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (m, dc, ba = 0) => { const a = C.tierProbs(m, dc, 0, ba, ""), b = C.tierProbs(m, dc + 1, 0, ba, ""); return a.map((x, i) => (x + b[i]) / 2); };   // AD 13 and 14 averaged
// A Strike's damage profile: Tier 1 0, Tier 2 x, Tier 3 1.6x. Per turn: Minion 1 Strike; Grunt and Standard 2 (the 2nd with 1 bane: At-will); Elite 3 (0, 1, 2 banes).
const roles = [["Minion", 1, 3, [0]], ["Grunt", 2, 5, [0, 1]], ["Standard", 2, 7.5, [0, 1]], ["Elite", 3, 15, [0, 1, 2]]];
for (const [name, mod, target, banes] of roles) {
  const per = banes.reduce((s, b) => { const p = P(mod, 13, b); return s + p[1] * 1 + p[2] * 1.6; }, 0);
  const x = target / per;
  console.log(`${name.padEnd(9)} Modifier +${mod}, ${banes.length} Strike(s)/turn, target ${target}/turn -> Strike Tier 2 avg ${x.toFixed(1)}, Tier 3 avg ${(1.6 * x).toFixed(1)}`);
}
