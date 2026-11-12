// The Stage 0 run (2026-11-12; MASTER-PLAN 3.3): a prototype, nothing here is in the book. Levels 1 to 3 on book/decisions-s1.md's level lists (no Talents,
// no Apex, no Daily), Escalation 1 to 6 with Momentum 0 to 4, the Bestiary's Stage 0 row fitted, and the four ranged-against-melee candidates Lucas
// asked for (A, B, C, E: rules-backlog "RANGED AGAINST MELEE"). Writes book/ruler/stage0.md.   node book/ruler/sim/stage0.mjs   (about 12 minutes; --quick 4)
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick"), N = QUICK ? 200 : 600, NM = QUICK ? 120 : 300;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`);

/* ------------------------------------------------------------------ the rules of the prototype */
const STAGE0 = { ...S.RULES_R, escMax: 6 };   // Escalation 1 to 6; everything else as the book today (4 + 1 AP, Guard 2 an unused AP, Rally + 1)
const setRules = (o = {}) => Object.assign(S.RULES, STAGE0, o);
setRules();

/* ------------------------------------------------------------------ the builds: the R builds cut to Lucas's level lists */
// decisions-s1.md item 5: level 1 the Hallmark Action and Reaction and the Passive of today's rung 2 (at Escalation 4); level 2 the hook, an Encounter Pick
// and the Passive of today's rung 1 (at Escalation 2); level 3 the Passive of today's rung 3 (at Escalation 6). No Apex (level 4), no Talents.
const RUNG = { "Radiant Zeal": [2, 2], "Searing Blows": [4, 1], Reckoning: [6, 3], "Font of Mercy": [2, 2], "Mending Light": [4, 1], "Hallowed Stance": [6, 3], "Killer's Focus": [2, 2], "Hunter's Edge": [4, 1], Finisher: [6, 3] };   // [Escalation, level]
const FILES = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"], rd = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8");
const XBOW = "weapon Crossbow (ranged, projectile, reload, two-handed, range 10/20/40): 0 / 1d4+2 / 1d10+2", XBOW_A = "weapon Crossbow (ranged, projectile, reload, two-handed, range 10/20/40): 0 / 1d4+1 / 1d8+2";
function build(file, level, { weapon = null, edge = 0, smallRanged = false } = {}) {
  let t = rd(file).replace(/^level .*$/m, `level ${level}`).replace(/^when escalation 3: .*$/m, "");
  if (level < 2) t = t.replace(/^plan .*$/m, "plan Main").replace(/^hook .*$/m, "");   // no Encounter Pick and no hook at level 1
  if (weapon) t = t.replace(/^weapon .*$/m, weapon);
  if (smallRanged) t = t.replace(/^weapon Crossbow.*$/m, XBOW_A);
  if (edge) t += `\npassive Melee edge: bonus ${edge} melee strike\n`;
  const b = S.parseSpec(t, `rework/${file} (Stage 0, level ${level}${weapon ? ", Crossbow" : ""})`);
  b.passives = b.passives.filter(p => !RUNG[p.name] || level >= RUNG[p.name][1]); for (const p of b.passives) if (RUNG[p.name]) p.escalation = RUNG[p.name][0];
  for (const a of Object.values(b.actions)) a.escalation *= 2;   // an Action's Escalation line on the 1 to 6 ladder
  return b;
}
const party = (level, o = {}) => FILES.map(f => build(f, level, o[f] ?? o.all ?? {}));

/* ------------------------------------------------------------------ NPCs and fights */
const npcAt = (role, { h = 1, d = 1 } = {}, opts = {}) => { const n = S.npcOf(role, "medium", 1, opts); return { ...n, exact: true, pool: Math.round(n.pool * h), bodyPool: Math.round(n.bodyPool * h), mindPool: Math.round(n.mindPool * h), t2: n.t2 * d, t3: n.t3 * d }; };
const enc = (list, row) => () => list.flatMap(([role, k]) => Array(k).fill(0).map(() => npcAt(role, row)));
const ENC = { easy: [["standard", 3]], normal: [["standard", 4]], mixed: [["elite", 1], ["standard", 2]], hard: [["standard", 5]], deadly: [["standard", 6]] };
function fights(builds, mk, { mom = 0, n = N, seed = 17, policy = S.planPolicy, npcPolicy = S.planPolicy, map = "open", states = null } = {}) {
  const R = S.rng(seed), out = [], M = { ...S.MAP, grid: S.MP.loadMap(map) };
  for (let k = 0; k < n; k++) { const pcs = states ? states() : builds.map(S.pcState); for (const p of pcs) p.startEsc = 1 + (typeof mom === "function" ? mom(k) : mom); out.push(S.fight(pcs, mk(), R, { map: M, policy, npcPolicy, maxRounds: 15 })); }
  const pool = out[0].pcs.reduce((s, p) => s + p.build.pool, 0);
  return { out, rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))),
    cost: mean(out.map(x => x.lost + x.pcs.reduce((s, p) => s + (p.st.rpSelf + p.st.rpByAlly) * p.build.rallyHeal, 0) / pool)),
    per: (i, key) => mean(out.map(x => (x.pcs[i].st[key] ?? 0) / Math.max(1, x.pcs[i].st.rounds))) };
}
const cell = r => `${f1(r.rounds)} · ${pc(r.lost)} · ${pc(r.cost)} · ${pc(r.down)} · ${pc(r.won)}`, CELL = "rounds · Health lost · cost (with the Rally Points spent) · a PC Down · won";
const bisect = (fn, target, lo, hi, steps = 7) => { for (let i = 0; i < steps; i++) { const mid = (lo + hi) / 2; if (fn(mid) < target) lo = mid; else hi = mid; } return (lo + hi) / 2; };

const L = ["# The Stage 0 run: a prototype (levels 1 to 3)", "", "Written by `node book/ruler/sim/stage0.mjs`; don't edit, run it again. **Nothing here is in the book**: it is the numbers for Stage 0 as `book/decisions-s1.md` describes it, for Lucas to decide on.", "",
  `Runs: ${N} fights a cell on the open field, ${NM} on a map${QUICK ? " (--quick: a draft)" : ""}. Each fight cell: ${CELL}. The decisions are the plan policy's unless a column says otherwise (the Bestiary's target is the plan's: Lucas, 2026-11-12).`, "",
  "**What Stage 0 is here:** the four R builds (Smite and Lay On Hands Paladins, Double Shot and Rolling Shot Archers; Human, 35 and 29 Health, Modifiers +2 / +1, Rally + 1, Guard 2 an unused AP) with only what their level gives; **Escalation runs 1 to 6**, starts at 1 + Momentum (0 to 4), +1 a round, +1 on a Critical and on the class's hook; the Passives sit at Escalation 2, 4 and 6; no Apex, no Daily, no Talents. The enemies are today's Stage 1 rows unless a section fits them.", "",
  "| Level | Paladin (Smite / Lay On Hands) | Archer (Double Shot / Rolling Shot) |", "|---|---|---|",
  "| 1 | Smite or Lay On Hands; Rebuke or Shield of Faith; at Escalation 4: Searing Blows / Mending Light | Sharpshooter, Marked Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; at Escalation 4: Hunter's Edge |",
  "| 2 | + the hook (Kindled Wrath); Holy Wrath (Encounter); at Escalation 2: Radiant Zeal / Font of Mercy | + the hook (Thrill of the Kill); Pinning Shot (Encounter); at Escalation 2: Killer's Focus |",
  "| 3 | + at Escalation 6: Reckoning / Hallowed Stance | + at Escalation 6: Finisher |", ""];

// 1. The turns.
L.push("## 1. A turn's damage by level and Escalation", "", "The build's planned turn against Defense 13 (20,000 turns; one target; no Reactions).", "", "| Build | Level | Turn | Escalation 1 | 2 | 4 | 6 |", "|---|---:|---|---:|---:|---:|---:|");
for (const f of FILES) for (const lv of [1, 2, 3]) { const b = build(f, lv), names = [...new Set(b.plan.flatMap(x => x.split("|").map(y => y.trim())))];
  for (const k of names) L.push(`| ${b.name} | ${lv} | ${b.turns[k].name} | ${[1, 2, 4, 6].map(e => f1(S.turnDamage(b, k, 13, { escalation: e }).avg)).join(" | ")} |`); }
log("1. turns");

// 2. Escalation's timing.
L.push("", "## 2. Escalation 1 to 6: where the turns are", "", "The normal fight (4 Standards, today's rows), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.", "", "| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |", "|---:|---:|---:|---:|---:|---:|---|---|");
for (const mom of [0, 1, 2, 3, 4]) { const r = fights(party(3), enc(ENC.normal), { mom }), h = [0, 1, 2, 3, 4, 5, 6].map(e => r.out.reduce((s, x) => s + x.pcs.reduce((s2, p) => s2 + (p.st.escHist?.[e] ?? 0), 0), 0)), tot = h.reduce((s, x) => s + x, 0) || 1, sh = (...es) => pc(es.reduce((s, e) => s + h[e], 0) / tot);
  L.push(`| ${mom} | ${1 + mom} | ${sh(1)} | ${sh(2, 3)} | ${sh(4, 5)} | ${sh(6)} | ${sh(2, 3, 4, 5, 6)} / ${sh(4, 5, 6)} / ${sh(6)} | ${cell(r)} |`); }
log("2. Escalation");

// 3. Against today's Stage 1 rows.
L.push("", "## 3. Levels 1 to 3 against today's Stage 1 rows (4 Standards)", "", "| Level | Momentum 0 | Momentum 2 | Momentum 4 |", "|---:|---|---|---|");
for (const lv of [1, 2, 3]) L.push(`| ${lv} | ${[0, 2, 4].map(mom => cell(fights(party(lv), enc(ENC.normal), { mom }))).join(" | ")} |`);
L.push("", "For scale, today's level 1 party (the three Passives at Escalation 1 / 2 / 3, the hook, Holy Wrath and Pinning Shot, the Apex) in report.md: 3.7 rounds, 14% of its Health lost, a PC Down in 24%.");
log("3. today's rows");

// 4. The Stage 0 row.
L.push("", "## 4. The Bestiary's Stage 0 row: the fit", "", "For each level and Momentum: **h**, the NPC Health factor over today's Stage 1 row for which the normal fight lasts 3.5 rounds; then the NPC damage factor **d** for each of the Bestiary's two targets: the fight costs a fifth of the party's Health (the Rally Points it spends counted), and a PC goes Down in 1 fight of 5. As pack R-bestiary found, the two don't meet at one number.", "", "| Level | Momentum | h (3.5 rounds) | d for a cost of a fifth | The fight there | d for a Down in 1 of 5 | The fight there |", "|---:|---:|---:|---:|---|---:|---|");
const FIT = {};
for (const lv of [1, 2, 3]) for (const mom of [0, 2]) { const P = party(lv), n = QUICK ? 200 : 400;
  const h = bisect(x => fights(P, enc(ENC.normal, { h: x }), { mom, n, seed: 23 }).rounds, 3.5, 0.5, 1.6), d = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n, seed: 23 }).cost, 0.2, 0.4, 1.8), d2 = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n, seed: 23 }).down, 0.2, 0.4, 1.8);
  FIT[`${lv}|${mom}`] = { h, d, d2 }; L.push(`| ${lv} | ${mom} | × ${f2(h)} | × ${f2(d)} | ${cell(fights(P, enc(ENC.normal, { h, d }), { mom }))} | × ${f2(d2)} | ${cell(fights(P, enc(ENC.normal, { h, d: d2 }), { mom }))} |`); log(`4. fit level ${lv}, Momentum ${mom}`); }
const r05 = x => Math.round(x * 20) / 20, K = ["2|0", "2|2"], ROW = { h: r05(mean(K.map(k => FIT[k].h))), d: r05(mean(K.flatMap(k => [FIT[k].d, FIT[k].d2]))) };
L.push("", `**The Stage 0 row used below: today's Stage 1 rows with Health × ${f2(ROW.h)} and damage × ${f2(ROW.d)}**: level 2's fit (the mean of Momentum 0 and 2), its damage halfway between the two targets, rounded to 0.05. Lucas decides the row; this one is to have numbers to look at. With it:`, "", "| Level | Momentum 0 | Momentum 2 | Momentum 4 |", "|---:|---|---|---|");
for (const lv of [1, 2, 3]) L.push(`| ${lv} | ${[0, 2, 4].map(mom => cell(fights(party(lv), enc(ENC.normal, ROW), { mom }))).join(" | ")} |`);
log("4. the row");

// 5. The difficulty table and the range of the decisions.
const momMix = k => k % 3;   // Momentum 0, 1, 2 in turn
L.push("", `## 5. The difficulty table at that row (level 2, Momentum 0 to 2 in turn)`, "", "| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |", "|---|---|---|---|---|");
for (const [name, key] of [["3 Standards (easy)", "easy"], ["4 Standards (normal)", "normal"], ["1 Elite + 2 Standards (normal)", "mixed"], ["5 Standards (hard)", "hard"], ["6 Standards (deadly)", "deadly"]]) {
  const P = party(2), mk = enc(ENC[key], ROW);
  L.push(`| ${name} | ${cell(fights(P, mk, { mom: momMix }))} | ${cell(fights(P, mk, { mom: momMix, policy: S.POLICIES.hold }))} | ${cell(fights(P, mk, { mom: momMix, policy: S.POLICIES.casual }))} | ${cell(fights(P, mk, { mom: momMix, npcPolicy: S.NPC_POLICIES.weakest }))} |`); }
log("5. difficulty");

// 6. Ranged against melee.
L.push("", "## 6. Ranged against melee: the four candidates", "", `Level 2, Momentum 0 to 2 in turn, the Stage 0 row above. **As built:** two melee Paladins (Greatswords) and two Archers (Crossbows). **Both Paladins on Crossbows:** the same builds with the Archers' weapon. A candidate works when the second party stops being the better one, and the Archer keeps its place. Fight cells: Health lost · a PC Down · won.`, "",
  "| Candidate | Normal: as built | Normal: both Paladins on Crossbows | Deadly: as built | Deadly: both Paladins on Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn: Greatsword / Crossbow | Double Shot Archer: damage a turn |", "|---|---|---|---|---|---|---|---|");
const short = r => `${pc(r.lost)} · ${pc(r.down)} · ${pc(r.won)}`;
const CAND = [
  ["Today's rules", {}, {}],
  ["A. Ranged weapons one die smaller (Crossbow 0 / 1d4+1 / 1d8+2)", {}, { smallRanged: true }],
  ["B1. +2 damage on a [Melee] Strike that deals damage", {}, { edge: 2 }],
  ["B2. A melee PC that ends its turn Engaged has Guard 3 until its next turn", { meleeGuard: 3 }, {}],
  ["B1 + B2", { meleeGuard: 3 }, { edge: 2 }],
  ["C2. A [Ranged] Action while Engaged is Doomed (not 2 Banes)", { engagedRanged: "doomed" }, {}],
  ["C3. A [Ranged] Action while Engaged draws an Opportunity Attack", { rangedOa: true }, {}],
  ["C2 + C3", { engagedRanged: "doomed", rangedOa: true }, {}],
  ["B2 + C3", { meleeGuard: 3, rangedOa: true }, {}],
  ["A + B2 + C3", { meleeGuard: 3, rangedOa: true }, { smallRanged: true }],
];
const sixRows = (rules, o, map = "open", n = N) => { setRules(rules); const base = party(2, { all: o }), rng = party(2, { all: o, "paladin-smite-r1": { ...o, weapon: o.smallRanged ? XBOW_A : XBOW }, "paladin-hands-r1": { ...o, weapon: o.smallRanged ? XBOW_A : XBOW } });
  const a = fights(base, enc(ENC.normal, ROW), { mom: momMix, map, n }), b = fights(rng, enc(ENC.normal, ROW), { mom: momMix, map, n }), c = fights(base, enc(ENC.deadly, ROW), { mom: momMix, map, n }), d = fights(rng, enc(ENC.deadly, ROW), { mom: momMix, map, n }); setRules(); return { a, b, c, d }; };
for (const [name, rules, o] of CAND) { const r = sixRows(rules, o); L.push(`| ${name} | ${short(r.a)} | ${short(r.b)} | ${short(r.c)} | ${short(r.d)} | ${f1(r.a.per(0, "counted"))} / ${f1(r.b.per(0, "counted"))} | ${f1(r.a.per(0, "taken"))} / ${f1(r.b.per(0, "taken"))} | ${f1(r.a.per(2, "counted"))} |`); log(`6. ${name}`); }
L.push("", "**The same among the pillars** (walls, blocked lines):", "", "| Candidate | Normal: as built | Normal: both Paladins on Crossbows | Deadly: as built | Deadly: both Paladins on Crossbows |", "|---|---|---|---|---|");
for (const [name, rules, o] of [CAND[0], CAND[1], CAND[4], CAND[7], CAND[8], CAND[9]]) { const r = sixRows(rules, o, "pillars", NM); L.push(`| ${name} | ${short(r.a)} | ${short(r.b)} | ${short(r.c)} | ${short(r.d)} |`); log(`6. pillars, ${name}`); }
// E. Carrying both.
L.push("", "**E. Carrying both weapons.** Both Paladins start with a Crossbow (they shoot while the enemies walk) and take the Greatsword when an enemy is within 2 squares, once a fight. What the switch costs decides whether it is worth doing. Under today's rules, and under B2 + C3 (Guard for a melee PC that ends its turn Engaged; a shot while Engaged draws an Opportunity Attack):", "", "| Rules | The Paladins carry | Normal | Deadly | Smite Paladin: damage that counted a turn · taken a turn |", "|---|---|---|---|---|");
for (const [rn, rules] of [["Today's", {}], ["B2 + C3", { meleeGuard: 3, rangedOa: true }]]) { setRules(rules); const base = party(2), rb = party(2, { "paladin-smite-r1": { weapon: XBOW }, "paladin-hands-r1": { weapon: XBOW } });
  const row = (name, st) => { const a = fights(null, enc(ENC.normal, ROW), { mom: momMix, states: st }), c = fights(null, enc(ENC.deadly, ROW), { mom: momMix, states: st }); L.push(`| ${rn} | ${name} | ${short(a)} | ${short(c)} | ${f1(a.per(0, "counted"))} · ${f1(a.per(0, "taken"))} |`); };
  row("Greatswords only (as built)", () => base.map(S.pcState)); row("Crossbows only", () => rb.map(S.pcState));
  for (const cost of [0, 1, 2]) row(`both: the switch costs ${cost} AP`, () => rb.map((b, i) => { const p = S.pcState(b); if (i < 2) p.alt = { build: base[i], cost }; return p; })); }
setRules();
log("6. E");

// 7. Maps.
L.push("", "## 7. On the maps (level 2, the Stage 0 row)", "", "| Encounter | Policy | open | corridor | pillars |", "|---|---|---|---|---|");
for (const [name, key] of [["4 Standards (normal)", "normal"], ["6 Standards (deadly)", "deadly"]]) for (const [pn, pk] of [["the plan", "plan"], ["holding the line", "hold"]]) L.push(`| ${name} | ${pn} | ${["open", "corridor", "pillars"].map(m => cell(fights(party(2), enc(ENC[key], ROW), { mom: momMix, map: m, n: NM, policy: S.POLICIES[pk] }))).join(" | ")} |`);
log("7. maps");

// 8. A day with the Momentum ladder.
L.push("", "## 8. A day: Momentum 0 to 4", "", "Four fights with no Rest (easy, normal, normal, hard) at the Stage 0 row, level 2. **The ladder** (decisions-s1.md): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum. **Flat:** every fight starts at Escalation 1.", "", "| | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |", "|---|---|---|---|---|---|");
for (const [name, ladder] of [["The ladder", true], ["Flat", false]]) {
  const R = S.rng(41), days = QUICK ? 200 : 500, per = [[], [], [], []], moms = [[], [], [], []]; let cleared = 0;
  for (let k = 0; k < days; k++) { const pcs = party(2).map(S.pcState); let mom = 0, ok = true;
    for (const [i, key] of ["easy", "normal", "normal", "hard"].entries()) { if (!pcs.some(p => p.damage < p.build.pool)) { ok = false; break; } for (const p of pcs) p.startEsc = 1 + (ladder ? mom : 0); const d0 = pcs.reduce((s, p) => s + p.st.downs, 0);
      const r = S.fight(pcs, enc(ENC[key], ROW)(), R, { maxRounds: 15 }); per[i].push(r); moms[i].push(ladder ? mom : 0); if (!r.won) { ok = false; break; }
      mom = Math.max(0, Math.min(4, mom + 1 - (pcs.reduce((s, p) => s + p.st.downs, 0) - d0))); S.between(pcs); }
    if (ok) cleared++; }
  L.push(`| ${name} | ${per.map((a, i) => (a.length ? `Momentum ${f1(mean(moms[i]))}: ${f1(mean(a.map(x => x.rounds)))} r · ${pc(mean(a.map(x => x.lost)))} · Down ${pc(mean(a.map(x => (x.firstDown ? 1 : 0))))} · won ${pc(mean(a.map(x => (x.won ? 1 : 0))))}` : "-")).join(" | ")} | ${pc(cleared / days)} |`); }
log("8. day");
L.push("", `(${f1((Date.now() - t0) / 60000)} minutes.)`, "");
fs.writeFileSync(RULER + "stage0.md", L.join("\n")); console.log(L.join("\n"));
