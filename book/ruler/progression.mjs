// Progression models (pack LV, 2026-10-29): the brainstorm's decisions (rules-backlog top: level cap 10 in tiers 1-4 / 5-7 / 8-10, fight
// lengths by difficulty, Modifiers +2 -> +3 -> +4, flat Defenses and NPC accuracy, Health about x1.5 at level 10, Mastery 2[W], keep the best,
// Overcast paid with Escalation and limited by tier, Momentum up to 3 at levels 8-10) run through the spec ruler (spec.mjs) at levels 1 to 10.
// Three models of where a PC's growth comes from (MODELS below); for each one:
//   1. two stand-in PCs a level (a weapon user and a caster; not classes: the same budget, one with [W] dice, one with [Spell] Power dice),
//   2. the NPC Health each level needs for a Standard fight (4 Standards against 4 PCs) to last 3.5 rounds (NPC damage follows PC Health),
//   3. fight length and Health lost by difficulty (easy, standard, hard, deadly) at levels 1 / 5 / 10,
//   4. the CV of a lower-level NPC (how many of them make the same fight as 4 Standards of the party's level),
//   5. the weapon user against the caster, round by round (Overcast limits, the round-1 floor).
// Writes book/ruler/progression.md (about 10 minutes; seeded: the same code gives the same numbers).
//   node book/ruler/progression.mjs           writes progression.md and prints it
//   node book/ruler/progression.mjs --quick   fewer runs (a draft in about 2 minutes)
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL(".", import.meta.url));
const QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 250 : 800;          // fights per measurement
const CAL_RUNS = QUICK ? 200 : 500;      // fights per step of the Health calibration
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SHOW = [1, 5, 10];

/* ------------------------------------------------------------------ the models */
const tier = lv => (lv >= 8 ? 3 : lv >= 5 ? 2 : 1);
const decided = {
  mod: lv => [2, 3, 4][tier(lv) - 1],                               // (3) Modifiers +2 -> +3 -> +4 by tier
  health: lv => 1.1 * (1 + (lv - 1) / 18),                         // (5) Health x1.5 at level 10 (level 1 keeps the book's x1.1)
  startEsc: lv => (lv >= 8 ? 3 : Math.min(2, Math.ceil(lv / 2))),  // (9) Momentum: half your level rounded up, up to 2; up to 3 at levels 8-10
  overcast: lv => tier(lv),                                         // (8) the most you can Overcast: 1 / 2 / 3 by tier
};
export const MODELS = {
  A: { key: "A", name: "A. Bounded", ...decided,
    note: "Growth from the decided numbers only: the Modifier steps (+3 at level 5, +4 at level 8), Mastery 2[W] at level 8 for weapon users and keep the best for Power damage at level 8 for casters (matched by level), the tier's Overcast limit and Momentum. Picks after level 3 are options (sidegrades), not power.",
    mastery: lv => lv >= 8, keepBest: lv => (lv >= 8 ? 1 : 0), escDie: () => "1d8", holdPassive: () => false },
  B: { key: "B", name: "B. Escalation-heavy", ...decided,
    note: "The Modifier steps as in A, but no Mastery 2[W] or keep the best before level 10; the growth is in Escalation: each Escalation spent (the weapon user's Surge, the caster's Overcast) adds 1d8 / 2d6 / 2d8 by tier, and the weapon user gains a hold passive at level 5 (while Escalation 2+: Empowered 1 on its Strikes).",
    mastery: lv => lv >= 10, keepBest: lv => (lv >= 10 ? 1 : 0), escDie: lv => ["1d8", "2d6", "2d8"][tier(lv) - 1], holdPassive: lv => lv >= 5 },
  C: { key: "C", name: "C. +10% a level (the charter today)", ...decided,
    note: "To compare: the charter's +10% sustained damage a level (from Talents; a flat damage factor here), Modifiers stay +2, Health (level + 10) / 10 (x2 at level 10, the book today); Momentum and Overcast as decided.",
    mod: () => 2, health: lv => (lv + 10) / 10, scale: lv => 1 + 0.1 * (lv - 1),
    mastery: () => false, keepBest: () => 0, escDie: () => "1d8", holdPassive: () => false },
};

/* ------------------------------------------------------------------ the stand-in PCs */
const plus = (dmg, extra) => (extra ? `${dmg} + ${extra}` : dmg);
const times = (d, n) => { if (!n) return ""; const m = d.match(/^(\d+)d(\d+)$/); return `${Number(m[1]) * n}d${m[2]}`; };
/** A weapon user: the baseline weapon turn (a 2 AP Round Strike + two Weapon Attacks), Surge (1 Escalation: +die on the next Strike) and Killer (hold 2: +1d6 on the first Strike a round). */
export function weaponSpec(M, lv, { floor = 0 } = {}) {
  const W = M.mastery(lv) ? "2[W]" : "1[W]", d = M.escDie(lv);
  return S.parseSpec(`class Weapon user
role melee
level ${lv}
attributes body 2, mind 1, instinct 0, appeal 0
health body x4 +3, mind x3 +4
health-factor ${M.health(lv)}
armor 3
weapon-mod ${M.mod(lv)}
power-mod ${M.mod(lv)}
rally 6
targeted 1.25
damage-scale ${M.scale?.(lv) ?? 1}
weapon Greatsword (melee, two-handed): 0 / 1d8 / 2d6
speed 5
overcast-floor ${floor}
action Steel Yourself 2 | ap 2 | round | traits self | heal 1 self
action Weapon Attack | ap 1 | at-will | traits strike weapon | vs ad | tiers 0 / ${W} + [Mod] / ${W} + [Mod]
action Strike 2 | ap 2 | round | traits signature strike weapon | vs ad | tiers [B] ${W} + [M] 1d6 / [B] ${W} + [Mod] + [M] 1d10 / [B] ${W} + [Mod] + [M] 2d8
action Wrath 2 | ap 2 | encounter | traits strike weapon | vs ad | tiers [B] ${W} + [M] 2d6 / [B] ${W} + [Mod] + [M] 3d8 / [B] ${W} + [Mod] + [M] 4d8
action Wrath 3 | ap 3 | encounter | traits strike weapon | vs ad | tiers [B] ${W} + [M] 3d8 / [B] ${W} + [Mod] + [M] 5d8 / [B] ${W} + [Mod] + [M] 7d8
${lv >= 3 ? `action Ruin 3 | ap 3 | daily | traits strike weapon | vs ad | tiers [B] ${W} + [M] 4d8 / [B] ${W} + [Mod] + [M] 7d8 / [B] ${W} + [Mod] + [M] 10d8` : ""}
action Surge 1 | ap 0 | round | traits self | escalation 1 | always: extra ${d} next strike
passive Killer: escalation 2: extra 1d6 first strike
${M.holdPassive(lv) ? "passive Battle Rhythm: escalation 2: empowered 1 strike" : ""}
turn Main: Surge 1 (keep 2), Strike 2, Weapon Attack, Weapon Attack
turn Nova: Surge 1 (keep 2), Wrath 3, Strike 2
${lv >= 3 ? "turn Daily: Surge 1 (keep 2), Ruin 3, Strike 2" : ""}
turn Steel: Steel Yourself 2, Strike 2, Weapon Attack
plan ${lv >= 3 ? "Daily | Nova | Main" : "Nova | Main"}, Nova | Main
when self below 35%: Steel
`, `weapon-${M.key}-${lv}`);
}
/**
 * A caster: the same budget in [Spell] Power dice: each spell is the weapon user's Action with the Greatsword's [W] (0 / 1d8 / 2d6) written as
 * Power dice (Spark = the Weapon Attack, Bolt = the Strike, Blast = Wrath, Cataclysm = Ruin). Overcast N: +N dice for N Escalation, up to the
 * tier's limit (Bolt only). Options: floor (the round-1 floor), limit, kb (keep the best: extra dice), mastery (a second [W] of dice, as 2[W]).
 */
export function casterSpec(M, lv, { floor = 0, limit = M.overcast(lv), kb = M.keepBest(lv), mastery = false } = {}) {
  const d = M.escDie(lv), w = [[], ["1d8"], ["2d6"]].map(x => (mastery ? [...x, ...x] : x));
  const tiers = (rest, n = 0) => [0, 1, 2].map(t => ["[M]", [...w[t], ...(t ? [rest[t], "[Mod]"] : [rest[t]]), ...(n ? [times(d, n)] : [])].filter(Boolean).join(" + ")].join(" ")).join(" / ").replace(/\[M\] (\/|$)/g, "0 $1");
  const spell = (name, ap, freq, rest, n = 0) => `action ${name} | ap ${ap} | ${freq} | traits power spell strike ranged | vs wd |${n ? ` escalation ${n} |` : ""} tiers ${tiers(rest, n)}`;
  const bolt = n => spell(`Bolt ${n}`, 2, "round", ["1d6", "1d10", "2d8"], n);
  return S.parseSpec(`class Caster
role ranged
level ${lv}
attributes body 1, mind 1, instinct 0, appeal 2
health body x3 +3, mind x2.5 +4
health-factor ${M.health(lv)}
armor 2
weapon-mod ${M.mod(lv)}
power-mod ${M.mod(lv)}
rally 5
targeted 0.75
damage-scale ${M.scale?.(lv) ?? 1}
weapon Focus (ranged, range 10/20/40): 0 / 0 / 0
speed 5
overcast-floor ${floor}
${kb ? `keep-best ${kb} power` : ""}
action Steel Yourself 2 | ap 2 | round | traits self | heal 1 self
${spell("Spark", 1, "at-will", ["", "", ""])}
${Array.from({ length: limit + 1 }, (_, n) => bolt(n)).join("\n")}
${spell("Blast 2", 2, "encounter", ["2d6", "3d8", "4d8"])}
${spell("Blast 3", 3, "encounter", ["3d8", "5d8", "7d8"])}
${lv >= 3 ? spell("Cataclysm 3", 3, "daily", ["4d8", "7d8", "10d8"]) : ""}
turn Main: Bolt ${limit}, Spark, Spark
turn Nova: Blast 3, Bolt ${limit}
${lv >= 3 ? `turn Daily: Cataclysm 3, Bolt ${limit}` : ""}
turn Kite: advance, Bolt ${limit}, Spark
turn Steel: Steel Yourself 2, Bolt ${limit}, Spark
plan ${lv >= 3 ? "Daily | Nova | Main" : "Nova | Main"}, Nova | Main
when self below 35%: Steel
when engaged: Kite
`, `caster-${M.key}-${lv}`);
}
const partyOf = (M, lv, o = {}) => { const w = weaponSpec(M, lv, o), c = casterSpec(M, lv, { floor: 1, ...o }); return [w, w, c, c]; };

/* ------------------------------------------------------------------ NPCs by level */
/** A Bestiary NPC of level 1 (Medium) with its Health x h and its damage x d (Defense and Modifier stay: decided (3)). */
const npcAt = (role, h, d, rating = "medium") => { const n = S.npcOf(role, rating, 1); return { ...n, pool: Math.round(n.pool * h), t2: n.t2 * d, t3: n.t3 * d }; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
/** Fights of the party against a list of NPCs; half start with Momentum (the charter: half the fights of a Standard day). */
function fights(party, npcs, n, seed = 17) {
  const R = S.rng(seed), out = [], cv = npcs.reduce((s2, x) => s2 + ({ minion: 0.25, grunt: 0.5, standard: 1, elite: 2 }[x.role] ?? 1), 0) / party.length;
  for (let k = 0; k < n; k++) {
    const pcs = party.map(S.pcState), start = k % 2 ? 0 : null;
    for (const p of pcs) { p.startEsc = start ?? MODEL_NOW.startEsc(p.build.level); p.dailyOK = cv >= 1.25; }   // a Daily only in a hard fight (spec.mjs day())
    out.push(S.fight(pcs, npcs, R, { maxRounds: 15 }));
  }
  return { rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), won: mean(out.map(x => (x.won ? 1 : 0))), down: mean(out.map(x => (x.downs ? 1 : 0))), out };
}
let MODEL_NOW = MODELS.A;

/** The NPC Health factor for which 4 Standards last `target` rounds against the party (bisection on the factor; the same dice every step). */
function calibrate(M, lv, dmgF, target = 3.5) {
  MODEL_NOW = M;
  const party = partyOf(M, lv);
  let lo = 0.3, hi = 6;
  for (let i = 0; i < 12; i++) {
    const mid = Math.sqrt(lo * hi), r = fights(party, Array(4).fill(npcAt("standard", mid, dmgF)), CAL_RUNS).rounds;
    if (r < target) lo = mid; else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

/* ------------------------------------------------------------------ the report */
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => `${Math.round(x * 100)}%`;
/** A build's damage a round, rounds 1 to 4, against one Standard-like target (Defense 13), half the fights with Momentum. */
function byRound(build, M, n = QUICK ? 4000 : 12000) {
  const R = S.rng(23), sums = [0, 0, 0, 0];
  for (let k = 0; k < n; k++) {
    const target = { ad: 13, wd: 13, save: { body: 2, mind: 1, instinct: 1, appeal: 1 } };
    const p = { build, quarry: target, esc: k % 2 ? 0 : M.startEsc(build.level), spent: new Set(), floorUsed: false, dailyOK: false };   // a normal fight: the Encounter Nova, no Daily
    for (let r = 1; r <= 4; r++) {
      if (r > 1) p.esc = Math.min(3, p.esc + 1);
      p.firstThisRound = new Set();
      const res = S.runTurn(p, build.turns[S.turnFor(p, r)], { R, escalation: p.esc, target: () => target, others: () => [] });
      sums[r - 1] += res.damage;
    }
  }
  return sums.map(x => x / n);
}
const fightTotal = r => r[0] + r[1] + r[2] + 0.5 * r[3];   // a Standard fight: 3.5 rounds

export function run() {
  const L = [], t0 = Date.now();
  const log = s => { if (!process.argv.includes("--silent")) process.stderr.write(s + "\n"); };
  L.push("# Progression models: the numbers (pack LV)", "",
    "Written by `node book/ruler/progression.mjs` (the spec ruler, spec.mjs, with the map model). Don't edit this file: edit the script and run it again. The proposal that reads these numbers is `book/progression-lv.md`.", "",
    `Runs: ${RUNS} fights a measurement, ${CAL_RUNS} a calibration step${QUICK ? " (--quick: a draft)" : ""}. Half the fights start with Momentum. The party: 2 weapon users (melee, AD 14) + 2 casters (ranged, AD 13, the round-1 floor). NPCs: the Bestiary's level 1 Medium NPCs with Health and damage multiplied by the level's factors; their Defense and Modifier never change (decided).`, "");
  for (const M of Object.values(MODELS)) L.push(`- **${M.name}.** ${M.note}`);
  L.push("");

  // 1. The PCs by level.
  L.push("## 1. The stand-in PCs by level", "", "Damage a turn against Defense 13 (one target, Monte Carlo): **Esc 0** = the main turn with no Escalation (no floor); **3.5-round fight** = rounds 1 to 3 and half of round 4, the Encounter Nova in round 1, no Daily, half the fights with Momentum, Escalation spent as the plan says. Health = the Health Pool.", "");
  L.push("| Model | Level | Modifier | Weapon user: Esc 0 / 3.5-round fight / Health | Caster: Esc 0 / 3.5-round fight / Health | growth of the fight damage (avg of both, level 1 = 100%) | Health (level 1 = 100%) |", "|---|---:|---:|---|---|---:|---:|");
  const base = {};
  for (const M of Object.values(MODELS)) for (const lv of LEVELS) {
    MODEL_NOW = M;
    const w = weaponSpec(M, lv), c = casterSpec(M, lv, { floor: 1 });
    const we = S.turnDamage(w, "main", 13, { escalation: 0, n: 8000 }).avg, ce = S.turnDamage(casterSpec(M, lv), "main", 13, { escalation: 0, n: 8000 }).avg;
    const wr = fightTotal(byRound(w, M)), cr = fightTotal(byRound(c, M));
    const avg = (wr + cr) / 2, hp = (w.pool + c.pool) / 2;
    if (lv === 1) base[M.key] = { avg, hp };
    M.growth ??= {}; M.growth[lv] = { dmg: avg / base[M.key].avg, hp: hp / base[M.key].hp, w: wr, c: cr };
    if (SHOW.includes(lv) || [3, 8].includes(lv)) L.push(`| ${M.key} | ${lv} | +${M.mod(lv)} | ${f1(we)} / ${f1(wr)} / ${w.pool} | ${f1(ce)} / ${f1(cr)} / ${c.pool} | ${pc(avg / base[M.key].avg)} | ${pc(hp / base[M.key].hp)} |`);
  }
  L.push("");
  log(`PCs done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);

  // 2. Calibration: NPC Health for 3.5 rounds, NPC damage x the PCs' Health growth.
  L.push("## 2. NPC Health and damage by level (a Standard fight lasts 3.5 rounds)", "",
    "**Health factor**: what the level 1 Bestiary's NPC Health is multiplied by so that 4 Standards last 3.5 rounds (mean) against the party of that level (found by bisection). **Damage factor**: NPC damage follows the PCs' Health (the share of Health a hit takes stays the same). Level 1 shows the refit E3 needs for 3.5 rounds (the Bestiary was built for about 3).", "");
  L.push(`| Level | ${Object.values(MODELS).map(M => `${M.key}: Health / damage factor`).join(" | ")} |`, `|---:|${Object.values(MODELS).map(() => "---:").join("|")}|`);
  const cal = {};
  for (const M of Object.values(MODELS)) { cal[M.key] = {}; for (const lv of LEVELS) { const d = M.growth[lv].hp; cal[M.key][lv] = { h: calibrate(M, lv, d), d }; } log(`calibrated ${M.key} (${((Date.now() - t0) / 1000).toFixed(0)} s)`); }
  for (const lv of LEVELS) L.push(`| ${lv} | ${Object.values(MODELS).map(M => `${f2(cal[M.key][lv].h)} / ${f2(cal[M.key][lv].d)}`).join(" | ")} |`);
  L.push("", "NPC Health a level (the factor's growth from level 1): " + Object.values(MODELS).map(M => `${M.key} ${pc(cal[M.key][5].h / cal[M.key][1].h)} at level 5, ${pc(cal[M.key][10].h / cal[M.key][1].h)} at level 10`).join("; ") + ".", "");

  // 3. Difficulty.
  const DIFF = [["easy (CV 3)", [["standard", 3]], "2.5"], ["standard (CV 4)", [["standard", 4]], "3.5"], ["standard: Elite + 2 Standards (CV 4)", [["elite", 1], ["standard", 2]], "3.5"],
    ["CV 5 (5 Standards)", [["standard", 5]], ""], ["hard (CV 6)", [["standard", 6]], "4-4.5"], ["CV 7 (7 Standards)", [["standard", 7]], ""], ["hard: 2 Elites + 2 Standards (CV 6)", [["elite", 2], ["standard", 2]], "4-4.5"], ["deadly (CV 8)", [["standard", 8]], "5"], ["deadly: 2 Elites + 4 Standards (CV 8)", [["elite", 2], ["standard", 4]], "5"]];
  L.push("## 3. Fight length and Health lost by difficulty", "", "The NPCs of the party's level (section 2's factors). Rounds (mean) · Health lost (share of the party's Health Pool) · a PC Down · the party wins.", "");
  for (const M of Object.values(MODELS)) {
    MODEL_NOW = M;
    L.push(`### ${M.name}`, "", `| Fight | target rounds | ${SHOW.map(lv => `Level ${lv}`).join(" | ")} |`, `|---|---:|${SHOW.map(() => "---").join("|")}|`);
    for (const [name, list, target] of DIFF) {
      const cells = SHOW.map(lv => { const c = cal[M.key][lv], npcs = list.flatMap(([role, k]) => Array(k).fill(npcAt(role, c.h, c.d))), r = fights(partyOf(M, lv), npcs, RUNS, 31);
        return `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)} · won ${pc(r.won)}`; });
      L.push(`| ${name} | ${target} | ${cells.join(" | ")} |`);
    }
    L.push("");
  }
  log(`difficulty done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);

  // 4. The level gap.
  L.push("## 4. The CV of a lower-level NPC (the level-gap factor)", "",
    "The party of the level against Standards of 1 to 4 levels lower: how many of them take as much of the party's Health as 4 Standards of its own level (interpolated between whole counts). **CV each** = 4 / that count; **a level** = the factor for one level of gap (CV each to the power 1 / gap). The brainstorm's guess: about ×0.8 a level. The last column is a prediction (Lanchester's square law: a side's strength grows with its numbers squared, so a creature's worth is the square root of Health × damage): it should match CV each.", "");
  for (const M of Object.values(MODELS)) {
    MODEL_NOW = M;
    L.push(`### ${M.name}`, "", "| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |", "|---:|---:|---:|---:|---:|---:|---:|");
    for (const lv of [3, 5, 10]) {
      const party = partyOf(M, lv), c0 = cal[M.key][lv], ref = fights(party, Array(4).fill(npcAt("standard", c0.h, c0.d)), RUNS, 37).lost;
      for (const gap of [1, 2, 3, 4]) {
        const nl = lv - gap; if (nl < 1) continue;
        const c = cal[M.key][nl], at = k => fights(party, Array(k).fill(npcAt("standard", c.h, c.d)), RUNS, 37);
        // Whole counts from 4 up until the Health lost reaches the reference; then linear between the last two counts.
        let k = 4, prev = at(4), cur = prev;
        while (cur.lost < ref && k < 24) { prev = cur; k++; cur = at(k); }
        const x = cur === prev ? 0 : Math.max(0, Math.min(1, (ref - prev.lost) / Math.max(1e-6, cur.lost - prev.lost)));
        const n = cur === prev ? 4 * ref / Math.max(1e-6, cur.lost) : k - 1 + x, rounds = prev.rounds + (cur.rounds - prev.rounds) * x;
        L.push(`| ${lv} | ${nl} | ${f1(n)}${k >= 24 && cur.lost < ref ? "+" : ""} | ${f2(4 / n)} | ${f2((4 / n) ** (1 / gap))} | ${f1(rounds)} | ${f2(Math.sqrt((c.h * c.d) / (c0.h * c0.d)))} |`);
      }
    }
    L.push("");
  }
  log(`level gap done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);

  // 5. Weapon user against caster.
  L.push("## 5. The weapon user against the caster, round by round", "",
    "Damage a round against one target at Defense 13 (no map: the same target, no range or melee Banes), half the fights with Momentum; **fight** = a 3.5-round fight (rounds 1-3 + half of round 4). The brainstorm's check: the fight totals equal, the caster's round 1 at least 90% of the weapon user's. Caster variants: the tier's Overcast limit (1 / 2 / 3) or a fixed one, with or without the round-1 floor (once a fight, Overcast 1 without Escalation).", "");
  for (const M of Object.values(MODELS)) {
    MODEL_NOW = M;
    L.push(`### ${M.name}`, "", "| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |", "|---:|---|---:|---:|---:|---:|---:|---|");
    for (const lv of SHOW) {
      const w = byRound(weaponSpec(M, lv), M), wt = fightTotal(w);
      L.push(`| ${lv} | weapon user | ${w.map(f1).join(" | ")} | ${f1(wt)} | |`);
      const variants = [["caster, tier limit, floor", { floor: 1 }], ["caster, tier limit, no floor", { floor: 0 }], ...[1, 2, 3].filter(x => x !== M.overcast(lv)).map(x => [`caster, limit ${x}, floor`, { floor: 1, limit: x }])];
      for (const [name, o] of variants) {
        const c = byRound(casterSpec(M, lv, o), M), ct = fightTotal(c);
        L.push(`| ${lv} | ${name} | ${c.map(f1).join(" | ")} | ${f1(ct)} | ${pc(c[0] / w[0])} · ${pc(ct / wt)} |`);
      }
    }
    L.push("");
  }
  // 6. What matches Mastery 2[W] for a caster.
  L.push("## 6. What matches Mastery 2[W] for a caster", "", "Model A at level 8 (Modifier +4, Overcast limit 3, the floor): the weapon user with 1[W] and with 2[W]; the caster with each candidate. Same columns as section 5.", "",
    "| Build | round 1 | round 2 | round 3 | round 4 | fight | against the weapon user with 2[W]: round 1 · fight |", "|---|---:|---:|---:|---:|---:|---|");
  {
    const M = MODELS.A, lv = 8; MODEL_NOW = M;
    const w2 = byRound(weaponSpec(M, lv), M), w1 = byRound(weaponSpec({ ...M, mastery: () => false }, lv), M), wt = fightTotal(w2);
    L.push(`| weapon user, 1[W] | ${w1.map(f1).join(" | ")} | ${f1(fightTotal(w1))} | ${pc(w1[0] / w2[0])} · ${pc(fightTotal(w1) / wt)} |`);
    L.push(`| weapon user, 2[W] | ${w2.map(f1).join(" | ")} | ${f1(wt)} | |`);
    for (const [name, o] of [["caster, nothing", { kb: 0 }], ["caster, keep the best (1 extra die)", { kb: 1 }], ["caster, keep the best (2 extra dice)", { kb: 2 }], ["caster, keep the best (3 extra dice)", { kb: 3 }], ["caster, Spell Mastery (a second [W] of dice: +1d8 / +2d6)", { kb: 0, mastery: true }], ["caster, Spell Mastery + keep the best 1", { kb: 1, mastery: true }]]) {
      const c = byRound(casterSpec(M, lv, { floor: 1, ...o }), M), ct = fightTotal(c);
      L.push(`| ${name} | ${c.map(f1).join(" | ")} | ${f1(ct)} | ${pc(c[0] / w2[0])} · ${pc(ct / wt)} |`);
    }
    L.push("");
  }

  // 7. The Standard day.
  L.push("## 7. The Standard day (easy, normal, normal, hard)", "", "spec.mjs day(): four fights with no Rest between; Momentum after each fight harder than easy (the model's starting Escalation); Rally Points carried over (the book's formula: 6 or 5 + (Body + Mind + level) / 2 rounded up, each heals a quarter of the Pool); a Daily only in the hard fight. The NPCs of the party's level. **Today's scale**: 3 Standards | 4 Standards | Elite + 2 Standards | 2 Elites + 2 Standards (hard = CV 6). **Proposed scale** (hard = CV 1.25 a PC): 3 Standards | 4 Standards | Elite + 2 Standards | Elite + 3 Standards (CV 5).", "",
    `| Model | ${SHOW.map(lv => `Level ${lv}: cleared · Downs a day · Rally Points left`).join(" | ")} |`, `|---|${SHOW.map(() => "---").join("|")}|`);
  const DAYS = { today: [[["standard", 3]], [["standard", 4]], [["elite", 1], ["standard", 2]], [["elite", 2], ["standard", 2]]], proposed: [[["standard", 3]], [["standard", 4]], [["elite", 1], ["standard", 2]], [["elite", 1], ["standard", 3]]] };
  const dayRows = [...Object.values(MODELS).flatMap(M => [[M, `${M.name}, today's scale`, null, "today"], [M, `${M.name}, proposed scale`, null, "proposed"]]),
    [MODELS.A, "Level 1 against today's Bestiary (NPC Health x1: fights of about 3 rounds), today's scale", 1, "today"], [MODELS.A, "Level 1 against today's Bestiary, proposed scale", 1, "proposed"]];
  for (const [M, label, h1, which] of dayRows) {
    MODEL_NOW = M; const keep = S.MOMENTUM.startEsc; S.MOMENTUM.startEsc = M.startEsc;
    const cells = SHOW.map(lv => {
      if (h1 && lv !== 1) return "";
      const c = h1 ? { h: h1, d: 1 } : cal[M.key][lv], party = partyOf(M, lv), enc = DAYS[which].map(e => e.flatMap(([role, k]) => Array(k).fill(npcAt(role, c.h, c.d))));
      const R = S.rng(43), days = []; for (let k = 0; k < (QUICK ? 150 : 500); k++) days.push(S.day(party, enc, R));
      const rp = party.reduce((s2, b) => s2 + b.rallyPoints, 0);
      return `${pc(mean(days.map(x => (x.cleared ? 1 : 0))))} · ${f2(mean(days.map(x => x.pcs.reduce((s2, p) => s2 + p.st.downs, 0))))} · ${pc(mean(days.map(x => x.pcs.reduce((s2, p) => s2 + p.rallyLeft, 0))) / rp)} of ${rp}`;
    });
    S.MOMENTUM.startEsc = keep;
    L.push(`| ${label} | ${cells.join(" | ")} |`);
  }
  L.push("");
  L.push(`Run time: ${((Date.now() - t0) / 1000).toFixed(0)} s.`);
  return { text: L.join("\n"), cal };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const { text } = run();
  fs.writeFileSync(HERE + "progression.md", text + "\n");
  if (!process.argv.includes("--quiet")) console.log(text);
}
