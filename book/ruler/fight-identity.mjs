// The fight identity (bestiary-design.md, decisions 13 and 14): a turn-by-turn COUNT, not a simulation of the game.
// No map, no cards, no conditions: 4 PCs who each deal the benchmark turn at the table (wide spread) to one enemy
// at a time, against N enemies of Health H in zipper order. It answers two questions only: in which round the
// fight ends, and how many enemy turns happen. An enemy's damage a turn for a wanted cost = cost / those turns.
// Run: node book/ruler/fight-identity.mjs [benchmark turn at the table, default 18] [cost in damage, default 51]
export function count(H, N = 4, B = 18, trials = 60000) {
  let rounds = 0, turns = 0;
  for (let t = 0; t < trials; t++) {
    const hp = Array(N).fill(H); let r = 0; const pcFirst = Math.random() < 0.5;
    while (hp.some(h => h > 0) && r < 30) {
      r++; const acted = Array(N).fill(false); const order = [...Array(N).keys()].sort(() => Math.random() - 0.5);
      const pc = () => { let x = Math.max(0, B + (Math.random() + Math.random() + Math.random() - 1.5) * 24);       // spread: a standard deviation of about 12
        while (x > 0) { const k = hp.findIndex(h => h > 0); if (k < 0) break; const a = Math.min(x, hp[k]); hp[k] -= a; x -= a; if (hp[k] > 0) break; x *= 0.5; } };   // half of an overkill reaches the next enemy (the turn's later Strikes)
      const npc = () => { const k = order.find(j => hp[j] > 0 && !acted[j]); if (k !== undefined) { acted[k] = true; turns++; } };
      const slots = Math.max(4, N);
      for (let i = 0; i < slots; i++) { if (pcFirst) { if (i < 4) pc(); npc(); } else { npc(); if (i < 4) pc(); } }   // the side with spare turns takes them at the end of the round
    }
    rounds += r;
  }
  return { rounds: rounds / trials, turns: turns / trials };
}
/**
 * The same count for Minions (ticks, not Health; core-rework G3): M Minions of `ticks` ticks in squads of `squad` to a turn slot, against 4 plain PCs.
 * A PC turn at the table is taken as 2 Basic Attacks, or 3 one turn in four (three quarters of its paper turn); each attack removes its Tier's
 * ticks (a Tier 1 of the Basic Attack deals damage, so it removes 1); nothing carries over to another Minion. odds(bonus, dc) comes from benchmark.mjs.
 */
export function countMinions(M, ticks, odds, { squad = 2, dc = 13, mod = 2, trials = 40000 } = {}) {
  let rounds = 0, turns = 0;
  const tierOf = bane => { const o = odds(mod - bane, dc), r = Math.random(); return r < o[0] ? 1 : r < o[0] + o[1] ? 2 : 3; };
  for (let t = 0; t < trials; t++) {
    const hp = Array(M).fill(ticks); let r = 0; const pcFirst = Math.random() < 0.5;
    while (hp.some(h => h > 0) && r < 30) {
      r++; const acted = Array(M).fill(false); const order = [...Array(M).keys()].sort(() => Math.random() - 0.5);
      const pc = () => { const n = Math.random() < 0.25 ? 3 : 2; for (let a = 0; a < n; a++) { const k = hp.findIndex(h => h > 0); if (k < 0) break; hp[k] = Math.max(0, hp[k] - tierOf(a)); } };
      const slot = () => { let n = 0; for (const j of order) { if (n >= squad) break; if (hp[j] > 0 && !acted[j]) { acted[j] = true; turns++; n++; } } };
      const slots = Math.max(4, Math.ceil(M / squad));
      for (let i = 0; i < slots; i++) { if (pcFirst) { if (i < 4) pc(); slot(); } else { slot(); if (i < 4) pc(); } }
    }
    rounds += r;
  }
  return { rounds: rounds / trials, turns: turns / trials };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const B = +(process.argv[2] ?? 18), cost = +(process.argv[3] ?? 51);
  console.log("| Enemies | Health each | The fight ends in round | Enemy turns | Damage a turn for the cost | Three on one PC |");
  console.log("|---:|---:|---:|---:|---:|---:|");
  for (const [N, H] of [[4, 54], [4, 46], [4, 36], [6, 36], [8, 27]]) { const c = count(H, N, B); const d = cost / c.turns;
    console.log(`| ${N} | ${H} | ${c.rounds.toFixed(1)} | ${c.turns.toFixed(1)} | ${d.toFixed(1)} | ${(3 * d).toFixed(0)} |`); }
}
