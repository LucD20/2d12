// The PC ruler by level (2026-10-24): sustained damage a turn against one creature (no Encounter or Daily Actions, no Escalation),
// with the level list of the Paladin and the Archer (L1: Class Actions and Core Features + 1 Encounter Pick; L2: + 1 Pick from any list;
// L3: + 1 Pick from any list + 1 Daily Pick). A level adds the best Round Pick for damage. At most 5 AP and 3 Strikes a turn.
// Health: the book's thresholds x (Level / 10 + 1) (Foundry: (lv + 10) / 10).
globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (mod, dc, bo = 0, ba = 0, st = "") => C.tierProbs(mod, dc, bo, ba, st);
const ev = (p, t) => p[0] * t[0] + p[1] * t[1] + p[2] * t[2];
const add = (t, n) => t.map(x => x + n);
const M = 2;                       // Weapon and Power Modifier at level 1 (Attribute 2)
const emp = (t, dice, n) => t.map((x, i) => x + n * dice[i]);   // Empowered n: +n on every damage die
// ---- Paladin: Greatsword 0 / 1d8 / 2d6; Smite 2 AP: [B] 1[W] + [M] 2d4 / [B] 1[W] + [Mod] + [M] 2d6 / [B] 1[W] + [Mod] + [M] 2d8
const GS = [0, 4.5 + M, 7 + M], GSd = [0, 1, 2];
const SM = [5, 4.5 + M + 7, 7 + M + 9], SMd = [2, 3, 4];
function paladin(dc, wd) {
  const r = {};
  r["L1  Smite 2 AP + Weapon Attack + Weapon Attack (1 Bane), 1 AP to move"] = ev(P(M, dc), SM) + ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS);
  // Vow of Enmity 1 AP vs WD: Tier 2: the next Strike gains 1 Boon and Empowered +1; Tier 3: the same and [M] 1d8 Ho (4.5)
  const pv = P(M, wd);
  const smiteVow = pv[0] * ev(P(M, dc), SM) + (pv[1] + pv[2]) * ev(P(M, dc, 1), emp(SM, SMd, 1)) + pv[2] * 4.5;
  r["L2  Vow of Enmity + Smite 2 AP + Weapon Attack + Weapon Attack (1 Bane)"] = smiteVow + ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS);
  // Sacred Weapon 1 AP (no roll): Empowered 1 for 1 round, on every attack
  r["L2  Sacred Weapon + Smite 2 AP + Weapon Attack + Weapon Attack (1 Bane)"] = ev(P(M, dc), emp(SM, SMd, 1)) + ev(P(M, dc), emp(GS, GSd, 1)) + ev(P(M, dc, 0, 1), emp(GS, GSd, 1));
  // both: Vow + Sacred Weapon + Smite 2 AP + Weapon Attack (5 AP, 2 Strikes)
  const smiteBoth = pv[0] * ev(P(M, dc), emp(SM, SMd, 1)) + (pv[1] + pv[2]) * ev(P(M, dc, 1), emp(SM, SMd, 2)) + pv[2] * 4.5;
  r["L3  Vow of Enmity + Sacred Weapon + Smite 2 AP + Weapon Attack"] = smiteBoth + ev(P(M, dc), emp(GS, GSd, 1));
  return r;
}
// ---- Archer: Crossbow 0 / 1d4+2 / 1d10+2; Lock & Loose [Mod] / 1d4+2+[Mod] / 1d10+[Mod] (Bow Mastery); Wing Clip 1[W] / 1[W]+[Mod]+1d4 / 1[W]+[Mod]+1d6;
//      Marked Quarry +1 Boon on [Shot, Strike] Actions against the quarry. Double Shot is one Strike; its two attacks take no At-will Banes.
const XB = [0, 4.5 + M, 7.5 + M], LL = [M, 4.5 + M, 5.5 + M], WC = [0, 4.5 + M + 2.5, 7.5 + M + 3.5];
function archer(dc) {
  const q = 1, r = {};
  r["L1  Precise Aim + Double Shot + Lock & Loose + Weapon Attack"] = ev(P(M, dc, q + 1), XB) + ev(P(M, dc, q), XB) + ev(P(M, dc, q), LL) + ev(P(M, dc, q), XB);
  r["L1  Precise Aim 2 AP + Double Shot + Lock & Loose"] = ev(P(M, dc, q + 2), XB) + ev(P(M, dc, q), XB) + ev(P(M, dc, q), LL);
  r["L1  Double Shot 3 AP + Lock & Loose + Weapon Attack"] = ev(P(M, dc, q + 1), XB) * 2 + ev(P(M, dc, q), LL) + ev(P(M, dc, q), XB);
  r["L2  Precise Aim + Double Shot + Wing Clip + Lock & Loose"] = ev(P(M, dc, q + 1), XB) + ev(P(M, dc, q), XB) + ev(P(M, dc, q), WC) + ev(P(M, dc, q), LL);
  r["L3  (no Round Pick adds damage: AP and Strikes are full) same as L2"] = r["L2  Precise Aim + Double Shot + Wing Clip + Lock & Loose"];
  return r;
}
const best = (r, lv) => Math.max(...Object.entries(r).filter(([k]) => Number(k[1]) <= lv).map(([, v]) => v));   // a level keeps the turns of the levels before it
const rows = [];
for (const dc of [12, 13, 14]) {
  const pal = paladin(dc, 13), arc = archer(dc);
  console.log(`\n=== AD ${dc} (Ward Defense 13 for Vow of Enmity)`);
  for (const [k, v] of Object.entries(pal)) console.log(`  Paladin ${v.toFixed(1).padStart(5)}  ${k}`);
  for (const [k, v] of Object.entries(arc)) console.log(`  Archer  ${v.toFixed(1).padStart(5)}  ${k}`);
  rows.push([dc, [1, 2, 3].map(l => [best(pal, l), best(arc, l)])]);
}
console.log("\n=== Best sustained damage a turn, by level (Paladin / Archer / average)");
for (const [dc, ls] of rows) console.log(`  AD ${dc}: ` + ls.map(([p, a], i) => `L${i + 1} ${p.toFixed(1)} / ${a.toFixed(1)} / ${((p + a) / 2).toFixed(1)}`).join("   "));
const t13 = rows.find(r => r[0] === 13)[1].map(([p, a]) => (p + a) / 2);
console.log("  growth at AD 13 (average of the two, level 1 = 1): " + t13.map(x => (x / t13[0]).toFixed(3)).join(" / "));
// Health by level (book: thresholds x (Level / 10 + 1), rounded up)
const thr = (attr, mult, sp, lv) => Math.ceil(((attr + 2) * mult + sp) * (lv + 10) / 10);
const pcs = [["Human Paladin (Body 2, Mind 1)", [2, 4, 3], [1, 3, 4]], ["Dwarf Paladin (Body 2, Mind 2)", [2, 4, 5], [2, 3, 3]], ["Human Archer (Body 1, Mind 1)", [1, 3, 3], [1, 2.5, 4]], ["Elf Archer (Body -1, Mind 2)", [-1, 3, 1], [2, 2.5, 5]]];
console.log("\n=== Health Pool (Body + Mind) by level");
for (const [n, b, m] of pcs) console.log(`  ${n.padEnd(32)} ` + [1, 2, 3].map(l => `L${l} ${thr(...b, l) + thr(...m, l)}`).join("   "));
