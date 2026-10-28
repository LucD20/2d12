// Bestiary v3 check: what each Defense value (11 to 16) costs a level 1 PC, and what NPC offence does against the new PC Ward Defense (11 + Power Modifier).
globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (mod, dc, bo = 0, ba = 0, st = "") => C.tierProbs(mod, dc, bo, ba, st);
const ev = (p, t) => p[0] * t[0] + p[1] * t[1] + p[2] * t[2];
const M = 2;
const avg = s => s.split("+").reduce((t, p) => { const m = p.trim().match(/^(\d*)d(\d+)$/); return t + (m ? (Number(m[1] || 1) * (Number(m[2]) + 1)) / 2 : Number(p)); }, 0);
const GS = [0, 4.5 + M, 7 + M];
const smite2 = [5, 4.5 + M + 7, 7 + M + 9];
const XB = [0, 4.5 + M, 7.5 + M], LL = [M, 4.5 + M, 5.5 + M], WC = [0, 4.5 + M + 2.5, 7.5 + M + 3.5];
const pal = dc => ev(P(M, dc), smite2) + ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS);
const arc = dc => ev(P(M, dc), XB) * 2 + ev(P(M, dc), WC) + ev(P(M, dc), LL);
const base = (pal(13) + arc(13)) / 2;
console.log("== PC damage a turn by the target's Defense (level 1, Modifier +2; Paladin = Smite 2 AP + 2 Weapon Attacks; Archer = Double Shot + Wing Clip + Lock & Loose, no quarry)");
console.log("Defense | Paladin | Archer | mean  | vs Defense 13 | = Health x");
for (let dc = 11; dc <= 16; dc++) {
  const m = (pal(dc) + arc(dc)) / 2;
  console.log(`${String(dc).padStart(7)} | ${pal(dc).toFixed(1).padStart(7)} | ${arc(dc).toFixed(1).padStart(6)} | ${m.toFixed(1).padStart(5)} | ${((m / base - 1) * 100 >= 0 ? "+" : "") + ((m / base - 1) * 100).toFixed(0)}%`.padEnd(48) + ` | x${(base / m).toFixed(2)}`);
}
// Power vs Weapon at level 1: both Modifier +2, so equal against equal Defense. Old Standard Ward 12 against the new 13:
console.log(`\nSmite chain vs Ward 12 (old Standard Medium): ${pal(12).toFixed(1)}; vs Ward 13 (new): ${pal(13).toFixed(1)}  (${((pal(13) / pal(12) - 1) * 100).toFixed(0)}%)`);
// NPC offence vs the PC Defense range. PC Ward Defense = 11 + Power Modifier (1 to 3) = 12 to 14; Armor 12 to 14 (light 12, medium 13, heavy 14).
const roles = { Minion: [2, [0], "1d4", "1d8"], Grunt: [2, [0, 1], "1", "1d4"], Standard: [2, [0, 1], "1d4", "1d10"], Elite: [3, [0, 1, 2], "1d6", "2d6"] };
console.log("\n== NPC Strike damage a turn against a PC Defense of 12 / 13 / 14 (the table's attack dice, all Medium)");
for (const [n, [m, banes, t2, t3]] of Object.entries(roles)) {
  const row = [12, 13, 14].map(dc => banes.reduce((s, b) => { const p = P(m, dc, 0, b); return s + p[1] * (avg(t2) + m) + p[2] * (avg(t3) + m); }, 0));
  console.log(`${n.padEnd(9)} ${row.map(x => x.toFixed(1).padStart(5)).join(" ")}   (13/14 mean ${((row[1] + row[2]) / 2).toFixed(1)})`);
}
// Turns for the PCs to kill a Medium NPC, by its Defense rating.
const H = { Minion: [6, [11, 11, 12, 13]], Grunt: [26, [11, 12, 13, 14, 15]], Standard: [50, [11, 12, 13, 14, 15]], Elite: [108, [12, 13, 14, 15, 16]] };
console.log("\n== PC turns to kill a Medium-Health NPC, by Defense rating (Terrible..Extreme), mean of the two PC turns above");
for (const [n, [h, ds]] of Object.entries(H)) console.log(`${n.padEnd(9)} Health ${String(h).padStart(3)}: ` + ds.map(d => `${d}→${(h / ((pal(d) + arc(d)) / 2)).toFixed(2)}`).join("  "));
