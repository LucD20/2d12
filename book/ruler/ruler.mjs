globalThis.foundry ??= { utils: {} };
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const P = (mod, dc, bo = 0, ba = 0, st = "") => C.tierProbs(mod, dc, bo, ba, st);
const ev = (p, t) => p[0] * t[0] + p[1] * t[1] + p[2] * t[2];
const M = 2;   // Weapon Modifier at level 1 (Attribute 2 -> ceil(2/2)+1 = 2) for both
const out = [];
for (const dc of [12, 13, 14]) {
  // ---- Paladin: Greatsword 0 / 1d8 / 2d6 (avg 0 / 4.5 / 7); [Mod] on T2-3.
  const GS = [0, 4.5 + M, 7 + M];
  const smite = { 1: [0, 4.5 + M + 2.5, 7 + M + 3.5], 2: [0 + 5, 4.5 + M + 7, 7 + M + 9], 3: [0 + 5, 4.5 + M + 7, 7 + M + 9] };
  const pal = {
    "Smite 3 AP + Weapon Attack + Weapon Attack (1 bane)": ev(P(M, dc), smite[3]) + ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS),
    "Smite 2 AP + Weapon Attack + Weapon Attack (1 bane), 1 AP to move": ev(P(M, dc), smite[2]) + ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS),
    "Weapon Attack x3 (0, 1, 2 banes)": ev(P(M, dc), GS) + ev(P(M, dc, 0, 1), GS) + ev(P(M, dc, 0, 2), GS)
  };
  // ---- Archer: Crossbow 0 / 1d4+2 / 1d10+2 (avg 0 / 4.5 / 7.5); Lock & Loose [Mod] / 1d4+2+[Mod] / 1d10+[Mod] (Bow Mastery);
  //      Wing Clip 1[W] / 1[W]+[Mod]+1d4 / 1[W]+[Mod]+1d6; Marked Quarry +1 boon on every Shot Strike against the quarry.
  const XB = [0, 4.5 + M, 7.5 + M], LL = [M, 4.5 + M, 5.5 + M], WC = [0, 4.5 + M + 2.5, 7.5 + M + 3.5];
  const q = 1;   // Marked Quarry
  const rs = [0, 4.5 + 2 + M, 7.5 + 2 * 2 + M];   // a Reload Shot: Favored, Empowered 2 (2 dice on Tier 3 only? 1d4 and 1d10: one die each) -> +2 per die
  const arc = {
    "Precise Aim + Double Shot + Wing Clip + Lock & Loose (quarry)": ev(P(M, dc, q + 1), XB) + ev(P(M, dc, q), XB) + ev(P(M, dc, q), WC) + ev(P(M, dc, q), LL),
    "same, the 2nd Double Shot attack a Reload Shot (Reload next turn)": ev(P(M, dc, q + 1), XB) + ev(P(M, dc, q, 0, "favored"), rs) + ev(P(M, dc, q), WC) + ev(P(M, dc, q), LL),
    "Double Shot + Wing Clip + Lock & Loose, no quarry, no aim": ev(P(M, dc), XB) * 2 + ev(P(M, dc), WC) + ev(P(M, dc), LL)
  };
  const probs = P(M, dc).map(x => (x * 100).toFixed(0) + "%").join(" / ");
  out.push({ dc, probs, pal, arc });
}
for (const o of out) {
  console.log(`\n=== AD ${o.dc}  (+2 vs ${o.dc}: Tier 1/2/3 = ${o.probs})`);
  for (const [k, v] of Object.entries(o.pal)) console.log(`  Paladin  ${v.toFixed(1).padStart(5)}  ${k}`);
  for (const [k, v] of Object.entries(o.arc)) console.log(`  Archer   ${v.toFixed(1).padStart(5)}  ${k}`);
}
// Health at level 1 (book formula), and what the PCs' Defense is
const thr = (attr, mult, sp) => Math.ceil((attr + 2) * mult + sp);
const pcs = [
  ["Human Paladin (Body 2, Mind 1), Heavy armor AD 14", thr(2, 4, 3), thr(1, 3, 4)],
  ["Dwarf Paladin (Body 2, Mind 2), AD 14", thr(2, 4, 5), thr(2, 3, 3)],
  ["Human Archer (Body 1, Mind 1, Instinct 2), Medium armor AD 13", thr(1, 3, 3), thr(1, 2.5, 4)],
  ["Elf Archer (Body -1, Mind 2, Instinct 2), AD 13", thr(-1, 3, 1), thr(2, 2.5, 5)]
];
console.log("\n=== Health Pool at level 1");
for (const [n, b, m] of pcs) console.log(`  ${n}: Body ${b} + Mind ${m} = ${b + m}`);
