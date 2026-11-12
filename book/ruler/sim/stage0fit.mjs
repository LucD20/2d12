// The Bestiary's Stage 0 table: the fit (2026-11-12, pack "Stage 0 into the book").   node book/ruler/sim/stage0fit.mjs   (about 6 minutes)
// 1. The two factors over pack R's first row (Health h, damage d) for the Bestiary's targets, with the weapon table, no Opportunity Attack and the Doomed
//    shot in (core.mjs RULES_S0), at each level and Momentum 0 and 2. 2. Candidate tables (makeTable(h, d): ready numbers) measured at levels 1, 2 and 3.
// It prints; the table chosen is written by hand into the system's config.mjs (npcStage0) and the Bestiary, and stage0.mjs reports on it.
import process from "node:process";
import { S, party, enc, ENC, fights, cell, CELL, bisect, makeTable, f2, mean } from "./stage0lib.mjs";
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`), N = 400;
const args = process.argv.slice(2), pairs = args.filter(a => /^[\d.]+,[\d.]+$/.test(a)).map(a => a.split(",").map(Number));
if (!pairs.length) {
  console.log("| Level | Momentum | h (3.5 rounds) | d for a cost of a fifth | d for a Down in 1 of 5 |", "\n|---:|---:|---:|---:|---:|");
  const FIT = {};
  for (const lv of [1, 2, 3]) for (const mom of [0, 2]) { const P = party(lv);
    const h = bisect(x => fights(P, enc(ENC.normal, { h: x }), { mom, n: N, seed: 23 }).rounds, 3.5, 0.5, 1.6), d = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n: N, seed: 23 }).cost, 0.2, 0.4, 1.8), d2 = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n: N, seed: 23 }).down, 0.2, 0.4, 1.8);
    FIT[`${lv}|${mom}`] = { h, d, d2 }; console.log(`| ${lv} | ${mom} | × ${f2(h)} | × ${f2(d)} | × ${f2(d2)} |`); log(`fit level ${lv}, Momentum ${mom}`); }
  const all = Object.values(FIT); console.log(`\nmeans: h ${f2(mean(all.map(x => x.h)))}, d (cost) ${f2(mean(all.map(x => x.d)))}, d (Down) ${f2(mean(all.map(x => x.d2)))}`);
}
for (const [h, d] of pairs) {
  const table = makeTable(h, d);
  console.log(`\n## Health × ${f2(h)}, damage × ${f2(d)}\n\n${JSON.stringify(table)}\n\n${CELL}\n\n| Level | Momentum | Normal (4 Standards) | Hard (5) | Deadly (6) |\n|---:|---:|---|---|---|`);
  for (const lv of [1, 2, 3]) for (const mom of [0, 2]) { console.log(`| ${lv} | ${mom} | ${["normal", "hard", "deadly"].map(k => cell(fights(party(lv), enc(ENC[k], { table }), { mom, n: N }))).join(" | ")} |`); log(`table ${h},${d} level ${lv} Momentum ${mom}`); }
}
void S;
