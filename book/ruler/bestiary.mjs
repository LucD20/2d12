// The Bestiary refit (pack E3, 2026-10-29): the Bestiary measured with the real classes (the P1 Paladin, the A1 Archer: book/ruler/classes)
// on the map (spec.mjs + map.mjs), with LV's decisions (book/progression-lv.md: model A, standard fights of 3.5 rounds, the CV scale
// 3/4 / 1 / 1 1/4 / 1 1/2 a PC, CV by tier gap, the Health factor (Level + 17) / 16).
//   1. today: the parties of levels 1-3 against today's Bestiary (and today's Health factor),
//   2. the tier 1 refit: the NPC Health and damage factors for a 3.5-round standard fight that costs the party a target share of its Health,
//   3. fight length and Health lost by CV on the new scale (levels 1-3, one tier: the NPCs don't change),
//   4. what an Elite, a Grunt and a Minion are worth in Standards (CV), and Elite fixes that bring it to CV 2,
//   5. the Standard day on the new scale,
//   6. tiers 2 and 3 (levels 5-10): the factors from LV's stand-ins scaled to this refit, and the CV of a lower tier (the square-root rule),
//   7. the proposed Bestiary tables by tier, 8. the PCs' Health with the new factor.
// Writes book/ruler/bestiary.md (about 20 minutes; --quick about 7). Seeded: the same code gives the same numbers.
//   node book/ruler/bestiary.mjs            writes bestiary.md and prints it
//   node book/ruler/bestiary.mjs --quick    fewer runs (a draft)
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);   // the Bestiary's tables (after spec.mjs: it sets Foundry's globals)
const HERE = fileURLToPath(new URL(".", import.meta.url));
const QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 300 : 1000, CAL = QUICK ? 250 : 600, DAYS = QUICK ? 200 : 600;
const TARGETS = [0.33, 0.40];                 // the share of the party's Health a standard fight costs (LV's stand-ins: 33%; the book today: about 40%)
const ROUNDS = 3.5;                           // decided (LV): a standard fight lasts 3.5 rounds
// LV, model A (progression.md section 2): the NPC Health factor that keeps 4 Standards at 3.5 rounds against the stand-ins, by level.
const LV_A = { 1: { h: 1.22 }, 5: { h: 1.43 }, 8: { h: 1.97 } };
const CV = { minion: 0.25, grunt: 0.5, standard: 1, elite: 2 };

/* ------------------------------------------------------------------ the PCs */
const healthNew = lv => (lv + 17) / 16, healthOld = lv => (lv + 10) / 10;
const load = (file, hf) => S.parseSpec(fs.readFileSync(`${HERE}classes/${file}.txt`, "utf8") + (hf ? `\nhealth-factor ${hf}` : ""), file);
/** The parties: 2 P1 Paladins (Smite) + 2 A1 Archers of each Hallmark Action; a mixed party as a check. */
const PARTIES = {
  double: { name: "Smite ×2 + Double Shot ×2", files: lv => [`paladin-smite-${lv}`, `paladin-smite-${lv}`, `archer-double-${lv}`, `archer-double-${lv}`] },
  rolling: { name: "Smite ×2 + Rolling Shot ×2", files: lv => [`paladin-smite-${lv}`, `paladin-smite-${lv}`, `archer-rolling-${lv}`, `archer-rolling-${lv}`] },
  mixed: { name: "Smite + Lay On Hands + Double Shot + Rolling Shot (a check)", files: lv => [`paladin-smite-${lv}`, `paladin-hands-${lv}`, `archer-double-${lv}`, `archer-rolling-${lv}`] },
};
const partyOf = (key, lv, hf = healthNew) => PARTIES[key].files(lv).map(f => load(f, hf(lv)));
const MAIN = ["double", "rolling"];           // the measurements average these two

/* ------------------------------------------------------------------ NPCs */
/** A level 1 Bestiary NPC (Medium; Foundry's default ratings) with its Health × h and its damage × d. */
const npcAt = (role, h = 1, d = 1) => { const n = S.npcOf(role, "medium", 1); return { ...n, exact: true, pool: Math.round(n.pool * h), t2: n.t2 * d, t3: n.t3 * d }; };
/** Today's Bestiary NPC of a level (its own row), with the exact averages too. */
const npcToday = (role, lv) => ({ ...S.npcOf(role, "medium", lv), exact: true });
/** An encounter from a list [[role, count], ...] with the tier's factors F { h, d } and a role's own fix F.x[role] { h, d } on top. */
const enc = (list, F) => list.flatMap(([role, k]) => Array(k).fill(npcAt(role, F.h * (F.x?.[role]?.h ?? 1), F.d * (F.x?.[role]?.d ?? 1))));
const withFix = (F, role, h = 1, d = 1) => ({ ...F, x: { ...(F.x ?? {}), [role]: { h, d } } });
const cvOf = list => list.reduce((s, [role, k]) => s + CV[role] * k, 0);
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/** Fights of a party against NPCs; half start with Momentum (the charter's Standard day); a Daily only in a hard fight (CV 1.25 a PC or more). */
function fights(party, npcs, n = RUNS, seed = 17) {
  const R = S.rng(seed), out = [], cv = npcs.reduce((s, x) => s + CV[x.role], 0) / party.length;
  for (let k = 0; k < n; k++) {
    const pcs = party.map(S.pcState);
    for (const p of pcs) { p.startEsc = k % 2 ? 0 : S.MOMENTUM.startEsc(p.build.level); p.dailyOK = cv >= 1.25; }
    out.push(S.fight(pcs, npcs, R, { maxRounds: 15 }));
  }
  return { rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))) };
}
/** The same fight for each main party, averaged. */
function both(lv, list, F, n = RUNS, seed = 17, keys = MAIN) {
  const rs = keys.map(k => fights(partyOf(k, lv), enc(list, F), n, seed));
  return Object.fromEntries(["rounds", "lost", "down", "won"].map(x => [x, mean(rs.map(r => r[x]))]));
}

/** Bisection on a factor (geometric) so that f(x) reaches the target; f grows with x. */
function solve(f, target, lo, hi, steps = 11) { for (let i = 0; i < steps; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) < target) lo = mid; else hi = mid; } return Math.sqrt(lo * hi); }
/** The tier 1 factors: Health for 3.5 rounds and damage for the target Health lost (4 Standards at this level), alternating. */
function calibrate(lv, target) {
  let h = 1.2, d = 1;
  for (let it = 0; it < 3; it++) {
    h = solve(x => both(lv, [["standard", 4]], { h: x, d }, CAL).rounds, ROUNDS, 0.6, 2.5);
    d = solve(x => both(lv, [["standard", 4]], { h, d: x }, CAL).lost, target, 0.6, 3);
  }
  return { h, d };
}
/** How many Standards take as much of the party's Health as this encounter (interpolated between whole counts). */
function standardsFor(lv, list, F) {
  const ref = both(lv, list, F, RUNS, 37).lost, at = k => both(lv, [["standard", k]], F, RUNS, 37);
  let k = 1, prev = at(1), cur = prev;
  while (cur.lost < ref && k < 24) { prev = cur; k++; cur = at(k); }
  if (k === 1) return { n: ref / Math.max(1e-6, cur.lost), ref };
  const x = Math.max(0, Math.min(1, (ref - prev.lost) / Math.max(1e-6, cur.lost - prev.lost)));
  return { n: k - 1 + x, ref };
}

/* ------------------------------------------------------------------ the report */
const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
const cell = r => `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)} · won ${pc(r.won)}`;

export function run() {
  const L = [], t0 = Date.now(), log = s => process.stderr.write(`${s} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  L.push("# The Bestiary refit: the numbers (pack E3)", "",
    "Written by `node book/ruler/bestiary.mjs` (the spec ruler with the map model). Don't edit this file: edit the script and run it again. The proposal that reads it is `book/bestiary-e3.md`.", "",
    `Runs: ${RUNS} fights a measurement, ${CAL} a calibration step${QUICK ? " (--quick: a draft)" : ""}, ${DAYS} days. **The parties** (book/ruler/classes): ${MAIN.map(k => PARTIES[k].name).join("; ")}; each number is the mean of the two. Half the fights start with Momentum; a Daily only in a hard fight (CV 1.25 a PC or more). **The NPCs:** the level 1 Bestiary (Medium, Foundry's default ratings: Body High) with Health and damage × the factors; Defense and Modifier never change (decided). NPC damage is rolled with the table's exact average (exact: the nearest dice moved by a flat amount), so the tables below are what was simulated. The PCs' Health uses the new factor (Level + 17) / 16 unless a row says *today*.`, "");

  // 1. Today.
  L.push("## 1. Today: the real classes against today's Bestiary", "", "Levels 1-3 against the Bestiary's own rows for that level (Health ×1.14 at levels 2-3, damage ×12/11 and ×13/11) and today's Health factor (Level + 10) / 10. Rounds · Health lost · a PC Down · the party wins.", "",
    "| Fight (CV) | Level 1 | Level 2 | Level 3 |", "|---|---|---|---|");
  const TODAY = [["4 Standards (4)", [["standard", 4]]], ["Elite + 2 Standards (4)", [["elite", 1], ["standard", 2]]], ["2 Elites (4)", [["elite", 2]]], ["6 Standards (6, today's hard)", [["standard", 6]]], ["2 Elites + 2 Standards (6, today's hard)", [["elite", 2], ["standard", 2]]]];
  for (const [name, list] of TODAY) {
    const cells = [1, 2, 3].map(lv => { const rs = MAIN.map(k => fights(partyOf(k, lv, healthOld), list.flatMap(([role, n]) => Array(n).fill(npcToday(role, lv)))));
      return cell(Object.fromEntries(["rounds", "lost", "down", "won"].map(x => [x, mean(rs.map(r => r[x]))]))); });
    L.push(`| ${name} | ${cells.join(" | ")} |`);
  }
  L.push("");
  log("today");

  // 2. Calibration.
  L.push("## 2. The tier 1 refit: NPC Health and damage factors", "",
    `For each target share of Health lost, the factors on the level 1 Bestiary for which 4 Standards last ${ROUNDS} rounds and cost the party that share (found by bisection, alternating). Levels 2 and 3 are calibrated on their own to show how far a flat tier drifts (model A: the NPCs of a tier don't change).`, "",
    "| Target Health lost | Level 1: Health / damage factor | Level 2 | Level 3 | Level 3 against the level 1 factors: rounds · lost |", "|---|---:|---:|---:|---|");
  const CALS = {};
  for (const t of TARGETS) {
    const c = [1, 2, 3].map(lv => calibrate(lv, t)); CALS[t] = c[0];
    const r3 = both(3, [["standard", 4]], c[0]);
    L.push(`| ${pc(t)} | ${f2(c[0].h)} / ${f2(c[0].d)} | ${f2(c[1].h)} / ${f2(c[1].d)} | ${f2(c[2].h)} / ${f2(c[2].d)} | ${f1(r3.rounds)} r · ${pc(r3.lost)} |`);
    log(`calibrated ${t}`);
  }
  L.push("");

  // 3. Difficulty.
  const DIFF = [["easy: 3 Standards (CV 3)", [["standard", 3]], "2.5"], ["standard: 4 Standards (CV 4)", [["standard", 4]], "3.5"], ["standard: Elite + 2 Standards (CV 4)", [["elite", 1], ["standard", 2]], "3.5"], ["standard: 2 Elites (CV 4)", [["elite", 2]], "3.5"],
    ["standard: 8 Grunts (CV 4)", [["grunt", 8]], "3.5"], ["standard: 2 Standards + 8 Minions (CV 4)", [["standard", 2], ["minion", 8]], "3.5"],
    ["hard: 5 Standards (CV 5)", [["standard", 5]], "4-4.5"], ["hard: Elite + 3 Standards (CV 5)", [["elite", 1], ["standard", 3]], "4-4.5"], ["deadly: 6 Standards (CV 6)", [["standard", 6]], "5"], ["deadly: 2 Elites + 2 Standards (CV 6)", [["elite", 2], ["standard", 2]], "5"], ["beyond: 8 Standards (CV 8, today's deadly)", [["standard", 8]], ""]];
  L.push("## 3. Fight length and Health lost by CV (the refit, Elites unchanged)", "", "Rounds · Health lost · a PC Down · the party wins. Target rounds: LV's (easy 2.5, standard 3.5, hard 4-4.5, deadly 5).", "");
  for (const t of TARGETS) {
    L.push(`### Target ${pc(t)} (factors ${f2(CALS[t].h)} / ${f2(CALS[t].d)})`, "", "| Fight | target rounds | Level 1 | Level 2 | Level 3 |", "|---|---:|---|---|---|");
    for (const [name, list, tr] of DIFF) L.push(`| ${name} | ${tr} | ${[1, 2, 3].map(lv => cell(both(lv, list, CALS[t], RUNS, 31))).join(" | ")} |`);
    L.push("");
  }
  log("difficulty");

  // 4. What each role is worth, and Elite fixes.
  L.push("## 4. What a role is worth in Standards (its real CV)", "",
    "How many Standards take as much of the party's Health as the encounter (interpolated between whole counts); **CV each** = (that count − the Standards in it) ÷ the role's count. Level 1 and level 3, the refit's factors.", "");
  const WORTH = [["Elite + 2 Standards", [["elite", 1], ["standard", 2]], "elite", 1, 2], ["Elite + 3 Standards", [["elite", 1], ["standard", 3]], "elite", 1, 3], ["2 Elites", [["elite", 2]], "elite", 2, 0], ["2 Elites + 2 Standards", [["elite", 2], ["standard", 2]], "elite", 2, 2],
    ["8 Grunts", [["grunt", 8]], "grunt", 8, 0], ["4 Grunts + 2 Standards", [["grunt", 4], ["standard", 2]], "grunt", 4, 2], ["2 Standards + 8 Minions", [["standard", 2], ["minion", 8]], "minion", 8, 2], ["16 Minions", [["minion", 16]], "minion", 16, 0]];
  const worth = {};
  for (const t of TARGETS) {
    L.push(`### Target ${pc(t)}`, "", "| Encounter | book CV | Level 1: Standards for it · CV each | Level 3: Standards · CV each |", "|---|---:|---|---|");
    for (const [name, list, role, k, std] of WORTH) {
      const cells = [1, 3].map(lv => { const s = standardsFor(lv, list, CALS[t]), each = (s.n - std) / k; (worth[t] ??= {})[name] ??= []; worth[t][name].push(each); return `${f1(s.n)} · ${f2(each)}`; });
      L.push(`| ${name} | ${cvOf(list)} | ${cells.join(" | ")} |`);
    }
    L.push("");
    log(`worth ${t}`);
  }
  // Role fixes: an Elite's (or a Grunt's) damage, Health or both scaled so that the encounter costs what 4 Standards cost (level 1).
  L.push("### Role fixes", "", "Each fix found by bisection at level 1 so that the encounter (Elite + 2 Standards; 8 Grunts) costs the party what 4 Standards cost; the factor is on top of section 2's. Rounds · Health lost · a PC Down, at level 1 · level 3.", "",
    "| Target | Role: fix | factor | Medium Health / damage a turn vs AD 14 | Elite + 2 Standards or 8 Grunts | 2 Elites or 4 Grunts + 2 Standards | Elite + 3 Standards (hard) or 10 Grunts (hard) |", "|---|---|---:|---|---|---|---|");
  const FIX = {}, tank = partyOf("double", 1)[0];
  const ROLEFIX = { elite: [[["elite", 1], ["standard", 2]], [["elite", 2]], [["elite", 1], ["standard", 3]]], grunt: [[["grunt", 8]], [["grunt", 4], ["standard", 2]], [["grunt", 10]]] };
  for (const t of TARGETS) {
    const F = CALS[t], ref = both(1, [["standard", 4]], F, RUNS, 37).lost;
    for (const role of ["elite", "grunt"]) for (const [name, mk] of [["damage only", x => withFix(F, role, 1, x)], ["Health only", x => withFix(F, role, x, 1)], ["both (√ each)", x => withFix(F, role, Math.sqrt(x), Math.sqrt(x))], ["no change", () => F]]) {
      const x = name === "no change" ? 1 : solve(v => both(1, ROLEFIX[role][0], mk(v), CAL, 37).lost, ref, 0.3, 1.3), G = mk(x), n = enc([[role, 1]], G)[0];
      ((FIX[t] ??= {})[role] ??= {})[name] = { x, G };
      const show = list => [1, 3].map(lv => { const r = both(lv, list, G, RUNS, 31); return `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)}`; }).join(" / ");
      L.push(`| ${pc(t)} | ${role}: ${name} | ${f2(x)} | ${n.pool} / ${f1(S.npcTurn(n, tank))} | ${ROLEFIX[role].map(show).join(" | ")} |`);
    }
    L.push(`| ${pc(t)} | reference: 4 Standards | | ${npcAt("standard", F.h, F.d).pool} / ${f1(S.npcTurn(npcAt("standard", F.h, F.d), tank))} (today ${npcToday("standard", 1).pool} / ${f1(S.npcTurn(npcToday("standard", 1), tank))}) | ${[1, 3].map(lv => { const r = both(lv, [["standard", 4]], F, RUNS, 31); return `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)}`; }).join(" / ")} | | |`);
    log(`role fixes ${t}`);
  }
  L.push("");
  /** The proposal at a target: the refit, the Elite's damage fix and the Grunt's Health fix. */
  const PROP = t => withFix(withFix(CALS[t], "elite", 1, FIX[t].elite["damage only"].x), "grunt", FIX[t].grunt["Health only"].x, 1);

  // 5. The Standard day.
  L.push("## 5. The Standard day on the new scale", "", "spec.mjs day(): four fights with no Rest; Momentum after each fight harder than easy; Rally Points carried over; a Daily in the hard fight. **New scale:** easy 3 Standards | standard 4 Standards | standard Elite + 2 Standards | hard Elite + 3 Standards (CV 5). **Today's scale** for comparison: the same, hard 2 Elites + 2 Standards (CV 6). **The proposal** = the refit + the Elite's damage fix + the Grunt's Health fix (section 4). Cleared · Downs a day (the party) · Rally Points left.", "",
    "| NPCs | Scale | Level 1 | Level 2 | Level 3 |", "|---|---|---|---|---|");
  const dayList = { new: [[["standard", 3]], [["standard", 4]], [["elite", 1], ["standard", 2]], [["elite", 1], ["standard", 3]]], today: [[["standard", 3]], [["standard", 4]], [["elite", 1], ["standard", 2]], [["elite", 2], ["standard", 2]]] };
  const dayCell = (lv, which, mkNpcs, hf = healthNew, keys = MAIN) => {
    const rs = keys.map(k => { const party = partyOf(k, lv, hf), R = S.rng(43), out = []; for (let i = 0; i < DAYS; i++) out.push(S.day(party, dayList[which].map(mkNpcs(lv)), R)); return { out, rp: party.reduce((s2, b2) => s2 + b2.rallyPoints, 0) }; });
    const cl = mean(rs.map(r => mean(r.out.map(x => (x.cleared ? 1 : 0))))), dn = mean(rs.map(r => mean(r.out.map(x => x.pcs.reduce((s2, p) => s2 + p.st.downs, 0))))), rl = mean(rs.map(r => mean(r.out.map(x => x.pcs.reduce((s2, p) => s2 + p.rallyLeft, 0))) / r.rp));
    return `${pc(cl)} · ${f2(dn)} · ${pc(rl)}`;
  };
  const todayNpcs = l => list => list.flatMap(([role, n]) => Array(n).fill(npcToday(role, l)));
  L.push(`| today's Bestiary, today's Health factor | today's | ${[1, 2, 3].map(lv => dayCell(lv, "today", todayNpcs, healthOld)).join(" | ")} |`);
  L.push(`| today's Bestiary, today's Health factor | new | ${[1, 2, 3].map(lv => dayCell(lv, "new", todayNpcs, healthOld)).join(" | ")} |`);
  for (const t of TARGETS) {
    L.push(`| refit ${pc(t)}, no role fix | today's | ${[1, 2, 3].map(lv => dayCell(lv, "today", () => list => enc(list, CALS[t]))).join(" | ")} |`);
    L.push(`| refit ${pc(t)}, no role fix | new | ${[1, 2, 3].map(lv => dayCell(lv, "new", () => list => enc(list, CALS[t]))).join(" | ")} |`);
    L.push(`| **the proposal, ${pc(t)}** | new | ${[1, 2, 3].map(lv => dayCell(lv, "new", () => list => enc(list, PROP(t)))).join(" | ")} |`);
  }
  L.push(`| the proposal, ${pc(TARGETS[0])}: ${PARTIES.mixed.name} | new | ${[1, 2, 3].map(lv => dayCell(lv, "new", () => list => enc(list, PROP(TARGETS[0])), healthNew, ["mixed"])).join(" | ")} |`);
  L.push("");
  log("days");

  // The proposal as a whole.
  L.push(`## 5b. The proposal as a whole (target ${pc(TARGETS[0])}): fights by CV`, "", "The refit with the Elite's damage fix and the Grunt's Health fix. Rounds · Health lost · a PC Down · the party wins. Last column: the mixed party at level 1 (a check).", "",
    "| Fight | target rounds | Level 1 | Level 2 | Level 3 | mixed party, level 1 |", "|---|---:|---|---|---|---|");
  for (const [name, list, tr] of DIFF) { const P = PROP(TARGETS[0]); L.push(`| ${name} | ${tr} | ${[1, 2, 3].map(lv => cell(both(lv, list, P, RUNS, 31))).join(" | ")} | ${cell(both(1, list, P, RUNS, 31, ["mixed"]))} |`); }
  L.push("");
  log("proposal");

  // 6. Tiers 2 and 3.
  const lvTab = LV_A;
  L.push("## 6. Tiers 2 and 3 (levels 5-10): from LV's stand-ins", "",
    "No class has levels above 3 yet, so the steps of model A come from LV (progression.md section 2, model A): NPC Health × its level's factor ÷ level 1's; NPC damage × the PCs' Health factor (Level + 17) / 16 at the tier's first level ÷ level 1's. **CV of a lower tier** = √(its Health × damage factors ÷ the party tier's) (LV: within about 0.05 of every measured value).", "",
    "| Tier (levels) | NPC Health (tier 1 = 1) | NPC damage (tier 1 = 1) | CV of an NPC one tier below | two tiers below |", "|---|---:|---:|---:|---:|");
  const T = [[1, "1-4"], [5, "5-7"], [8, "8-10"]].map(([first, name]) => ({ name, h: lvTab[first].h / lvTab[1].h, d: healthNew(first) / healthNew(1) }));
  T.forEach((x, i) => L.push(`| ${i + 1} (${x.name}) | ×${f2(x.h)} | ×${f2(x.d)} | ${i ? `×${f2(Math.sqrt((T[i - 1].h * T[i - 1].d) / (x.h * x.d)))}` : "-"} | ${i > 1 ? `×${f2(Math.sqrt((T[0].h * T[0].d) / (x.h * x.d)))}` : "-"} |`));

  // 7. The proposed tables.
  const P = PROP(TARGETS[0]), r25 = x => Math.round(x * 4) / 4, r5 = x => Math.round(x * 2) / 2;
  L.push("", `## 7. The proposed tables (target ${pc(TARGETS[0])})`, "",
    `Today's level 1 numbers × the refit (Health ×${f2(P.h)}, damage ×${f2(P.d)}; Elite damage ×${f2(P.x.elite.d)} more, Grunt Health ×${f2(P.x.grunt.h)} more) × the tier (section 6). Health Multipliers rounded to 0.25, damage to 0.5. The ratings keep today's level 1 steps at every tier (no drift between ratings inside a tier). Health Base, Attributes and Defenses don't change.`, "");
  const RT = ["terrible", "low", "medium", "high", "extreme"];
  for (const role of ["minion", "grunt", "standard", "elite"]) {
    const rr = RT.filter(k => role !== "minion" || k !== "extreme"), fx = P.x?.[role] ?? {}, rd = CF.TWOD12.npcRoles[role];
    L.push(`### ${rd.label}`, "", `| Tier | ${rr.map(k => `Health Multiplier ${k}`).join(" | ")} | ${rr.map(k => `damage ${k}`).join(" | ")} | all Medium: Health |`, `|---|${rr.map(() => "---:").join("|")}|${rr.map(() => "---:").join("|")}|---:|`);
    T.forEach((tt, i) => {
      const hm = k => r25(CF.npcHm(role, k, 1) * P.h * (fx.h ?? 1) * tt.h), dm = k => { const n = S.npcOf(role, k, 1), f = P.d * (fx.d ?? 1) * tt.d; return `${r5(n.t2 * f)} / ${r5(n.t3 * f)}`; };
      const med = Math.ceil((rd.attr + 2) * hm("medium") + rd.hb - 1e-9) * 2;
      L.push(`| ${i + 1} (${tt.name}) | ${rr.map(k => `×${hm(k)}`).join(" | ")} | ${rr.map(dm).join(" | ")} | ${med} |`);
    });
    L.push(`| today, level 1 | ${rr.map(k => `×${CF.npcHm(role, k, 1)}`).join(" | ")} | ${rr.map(k => { const n = S.npcOf(role, k, 1); return `${n.t2} / ${n.t3}`; }).join(" | ")} | ${Math.ceil((rd.attr + 2) * CF.npcHm(role, "medium", 1) + rd.hb - 1e-9) * 2} |`, "");
  }
  // 8. The PCs' Health with the new factor.
  L.push("## 8. The PCs' Health: (Level + 10) / 10 today, (Level + 17) / 16 decided", "", "| Build | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 | Level 8 | Level 10 |", "|---|---|---|---|---|---|---|---|");
  for (const f of ["paladin-smite", "archer-double"]) {
    const src = fs.readFileSync(`${HERE}classes/${f}-1.txt`, "utf8");
    const pool = (lv, hf) => S.parseSpec(src.replace(/^level 1$/m, `level ${lv}`) + `\nhealth-factor ${hf(lv)}`, f).pool;
    L.push(`| ${f} (today → decided) | ${[1, 2, 3, 4, 5, 8, 10].map(lv => `${pool(lv, healthOld)} → ${pool(lv, healthNew)}`).join(" | ")} |`);
  }
  L.push("", `Run time: ${((Date.now() - t0) / 1000).toFixed(0)} s.`);
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = run();
  fs.writeFileSync(HERE + "bestiary.md", text + "\n");
  if (!process.argv.includes("--quiet")) console.log(text);
}
