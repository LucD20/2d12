// The benchmark PC turn (bestiary-design.md, decision 4): what a level 1 pregen's turn deals ON PAPER,
// by exact dice math on the cards of v0.0.507 (no Arts, no Escalation Passives). Not the SIM: no map,
// no movement, no Cover, no enemy. Run: node book/ruler/benchmark.mjs [AD] [WD]   (default 13 13)
// Re-read (and re-run) when a level 1 class card, the Basic Attack or a designed weapon changes.

// ---- the roll: 2d12, a 12 counts 11 and rolls again, Doubles raise the Tier, Tier 3 at DC + 7 ----
function dieDist(depth = 6) {
  const m = new Map(); const add = (v, p) => m.set(v, (m.get(v) || 0) + p);
  (function rec(base, p, d) { for (let f = 1; f <= 12; f++) { if (f === 12 && d < depth) rec(base + 11, p / 12, d + 1); else add(base + f, p / 12); } })(0, 1, 0);
  return m;
}
const TAIL = dieDist();
const after = face => face < 12 ? new Map([[face, 1]]) : new Map([...TAIL].map(([v, p]) => [11 + v, p]));
const memo = new Map();
/** [Tier 1, Tier 2, Tier 3 without a Critical, Critical] for a net bonus (Modifier + Boons - Banes) against a DC. */
export function odds(bonus, dc) {
  const k = bonus + ":" + dc; if (memo.has(k)) return memo.get(k);
  const o = [0, 0, 0, 0];
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) for (const [va, pa] of after(a)) for (const [vb, pb] of after(b)) {
    const p = pa * pb / 144, tot = va + vb + bonus; let tier = tot < dc ? 1 : tot < dc + 7 ? 2 : 3, crit = false;
    if (a === b) { if (tier === 3) crit = true; else tier++; }
    if (tot >= dc + 20) crit = true;
    o[crit ? 3 : tier - 1] += p;
  }
  memo.set(k, o); return o;
}
const X = n => n / 2 + 1;          // the average of a die that explodes (dN!)
const D = n => (n + 1) / 2;        // the average of a plain die
/** Expected damage of one use: tiers = [Tier 1, Tier 2, Tier 3], crit = what a Critical adds to the Tier 3. */
const use = (bonus, dc, tiers, crit = 0) => { const o = odds(bonus, dc); return o[0] * tiers[0] + o[1] * tiers[1] + o[2] * tiers[2] + o[3] * (tiers[2] + crit); };

// ---- the designed weapons (Chapter 15): [W] on Tier 2 and Tier 3, and the Tier 3 die [D] ----
const WEAPON = {
  "Longsword":    { t2: 6 + X(4), t3: 9 + X(6), d3: X(6) },
  "Arming Sword": { t2: 3 + X(4), t3: 4 + X(6), d3: X(6) },
  "Hunting Bow":  { t2: 1 + X(4), t3: 2 + X(4), d3: X(4) },
  "Recurve Bow":  { t2: 1 + X(4), t3: 1 + X(6), d3: X(6) },
};
const CRIT = X(10);                // a Basic attack's Critical: 1d10!

// ---- the cards (Stage 0, v0.0.507) ----
const basic = (w, mod, ad, boon = 0, bane = 0) => use(mod + boon - bane, ad, [X(4), w.t2 + mod, w.t3 + w.d3 + mod], CRIT);
const drawingLight = (pow, wd, bane = 0) => use(pow - bane, wd, [X(4), X(8), 2 * X(6)], CRIT);
const harryingShot = (pow, wd, bane = 0) => use(pow - bane, wd, [X(4), X(8), X(12)], CRIT);
const bindingLight = (w, sig, ad) => use(sig, ad, [D(6), w.t2 + sig + D(6), w.t3 + sig + D(8)]);
const smite = (w, sig, ad, dice, die = 8) => use(sig, ad, [dice * X(die), w.t2 + sig + dice * X(die), w.t3 + sig + (dice + 1) * X(die)]);   // on the Judged (Profane) creature: 1d8!s
const quickShots = (w, mod, ad, boon = 0) => use(mod + boon, ad, [mod, 2 * w.t2 + mod, 3 * w.t3 + mod]);
const strafeEach = (w, mod, ad, boon = 0) => use(mod + boon, ad, [mod, w.t2 + mod, w.t3 + mod]);

/** Each pregen's paper turn against a creature with Armor Defense ad and Ward Defense wd. */
export function pregens(ad = 13, wd = 13, rounds = 3.5) {
  const out = [];
  { // Aveline: Human Paladin, Longsword, Weapon +1 / Power +2 (Signature +2); Binding Light
    const w = WEAPON["Longsword"], wm = 1, pm = 2;
    const second = Math.max(drawingLight(pm, wd, 1), basic(w, wm, ad, 0, 1));
    const turn = bindingLight(w, pm, ad) + basic(w, wm, ad) + second;
    const smiteTurn = smite(w, pm, ad, 3) + bindingLight(w, pm, ad);            // round 3: Escalation 3, 3 Smite dice
    out.push({ name: "Aveline", health: 35, rally: 7, ad: 14, wd: 13, turn, fight: (turn * (rounds - 1) + smiteTurn) / rounds, note: "Binding Light + Basic Attack + a second Basic attack; Smite once (round 3) beside Binding Light" });
  }
  { // Durgan: Dwarf Paladin, Arming Sword, Weapon +1 / Power +2; Lay On Hands (no damage Hallmark)
    const w = WEAPON["Arming Sword"], wm = 1, pm = 2;
    const turn = basic(w, wm, ad) + drawingLight(pm, wd, 1);                     // 2 AP of Strikes, 2 AP on Lay On Hands
    const smiteTurn = smite(w, pm, ad, 3) + basic(w, wm, ad);
    out.push({ name: "Durgan", health: 35, rally: 7, ad: 14, wd: 13, turn, fight: (turn * (rounds - 1) + smiteTurn) / rounds, note: "Basic Attack + Drawing Light, 2 AP on Lay On Hands; Smite once (round 3)" });
  }
  { // Sylwen: Elf Archer, Hunting Bow, Weapon +2 / Power +1; Quick Shots (its Evade 2 gives the next shot Shifting Aim's Boon)
    const w = WEAPON["Hunting Bow"], wm = 2;
    const qs = quickShots(w, wm, ad);
    const turn = qs + basic(w, wm, ad, 1, 0) + basic(w, wm, ad, 0, 1);
    out.push({ name: "Sylwen", health: 29, rally: 6, ad: 12, wd: 12, turn, fight: turn, note: "Quick Shots + 2 Basic Attacks (the first with Shifting Aim's Boon)" });
  }
  { // Kaela: Human Archer, Recurve Bow, Weapon +2 / Power +1; Strafe (its Advance gives Shifting Aim's Boon), on 2 creatures
    const w = WEAPON["Recurve Bow"], wm = 2;
    const turn = 2 * strafeEach(w, wm, ad, 1) + basic(w, wm, ad) + basic(w, wm, ad, 0, 1);
    out.push({ name: "Kaela", health: 29, rally: 6, ad: 12, wd: 12, turn, fight: turn, note: "Strafe on 2 creatures (with Shifting Aim's Boon) + 2 Basic Attacks" });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ad = +(process.argv[2] ?? 13), wd = +(process.argv[3] ?? 13);
  const f = x => x.toFixed(1);
  const pct = o => o.map(x => (100 * x).toFixed(1) + "%").join(" / ");
  console.log(`Target: Armor Defense ${ad}, Ward Defense ${wd}. Tier 1 / 2 / 3 / Critical: +2 ${pct(odds(2, ad))}; +1 ${pct(odds(1, ad))}`);
  const ps = pregens(ad, wd);
  console.log("| PC | Paper turn (no Encounter Action) | Average turn of a 3½-round fight | The turn |");
  console.log("|---|---:|---:|---|");
  for (const p of ps) console.log(`| ${p.name} | ${f(p.turn)} | ${f(p.fight)} | ${p.note} |`);
  const avg = k => ps.reduce((s, p) => s + p[k], 0) / ps.length;
  console.log(`| **The four** | **${f(avg("turn"))}** | **${f(avg("fight"))}** | a round: ${f(4 * avg("fight"))} |`);
  console.log(`Party: Health ${ps.reduce((s, p) => s + p.health, 0)} (average ${f(avg("health"))}), Rally Points ${ps.reduce((s, p) => s + p.rally, 0)}; a Rally Point removes ${f(avg("health") / 4)} on average.`);
  console.log(`A creature with Modifier +2 against these PCs' Armor Defense (14, 14, 12, 12): Tier 1 ${(100 * (odds(2, 14)[0] + odds(2, 12)[0]) / 2).toFixed(1)}%.`);
}
