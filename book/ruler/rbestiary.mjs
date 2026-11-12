// Pack R-bestiary (2026-11-05): the Bestiary re-fitted to the rebuilt party (pack R-classes) under pack R's rules (book/rework-r.md sections 12
// and 14; MASTER-PLAN item 6). The party: the R builds of rework/*.txt (rclasses.mjs's party) with the Stage Health line, Rally + Stage,
// Guard 2 / 3 / 4 by Stage, one Attribute +1 a Stage, Modifiers +1 at Stage 3 (cap 4), the PCs' WD 13 / 14 / 14 by Stage (the ward sheet)
// and 2[W] at Stage 3 (Gear: Master, from level 8). The NPCs: the Bestiary's pre-R tables (bestiary-today.mjs) × the factors this script fits,
// with their Specials (a Standard's 2 AP Special × 2.2 once a round, a Minion's and a Grunt's 1 AP × 1.4, an Elite's 3 AP × 3.5 once), one NPC in
// four attacking Ward Defense with [R] (`power`), Elite Escalation (+1 a round from round 2, the ladder) and the Elite phases (+1 when Bloodied,
// +1 when Strained). What it writes: book/ruler/rbestiary.md (the numbers) and book/ruler/bestiary-r.json (the new tables: the book's rows and
// config.mjs's arrays are copied from it; the script says whether config.mjs matches). Nothing here changes report.md (RULES are set per run).
//   node book/ruler/rbestiary.mjs           writes rbestiary.md and bestiary-r.json and prints the report (a few minutes)
//   node book/ruler/rbestiary.mjs --quick   fewer runs
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const BT = await import(new URL("./bestiary-today.mjs", import.meta.url).href);
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL(".", import.meta.url));
const QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 200 : 800;
const HF = 1.125;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : "-");
const r5 = x => Math.round(x * 2) / 2, r25 = x => Math.round(x * 4) / 4, fmt = x => String(x);

/* ------------------------------------------------------------------ the rules and the targets */
const TODAY = { ...S.RULES_PRE_R };   // the catch-up (2026-11-12): spec.mjs's rule sets (RULES_PRE_R; RULES_R, its default: the book today, Guard 2 / 3 / 4 by Stage)
const R = { ...S.RULES_R, bestiary: "today" };   // the fit is made over the pre-R tables (bestiary-today.mjs)
const setRules = o => Object.assign(S.RULES, TODAY, o);
const TARGET = { lost: 0.25, down: 0.10, rounds: 3.5 };   // the normal fight (decision sheet item 1, Lucas 2026-11-05: a quarter, a Down in about 1 fight of 10)
const STAGE_D = [1, 1.2, 1.5];   // the Stage 2 and 3 damage rows over today's (decision sheet item 17)
const RESERVE = 1.07;   // the Folk Traits' reserve: about a Talent's worth on each PC (0.3 AP a turn of a 4 AP turn: +7% damage); the fit is made with it on
const MASTERY = true;   // 2[W] at Stage 3 (Gear: Master, from level 8)
const WD = [13, 14, 14], APG = [2, 3, 4], LV = [1, 5, 8];

/* ------------------------------------------------------------------ the PCs: the R builds at a Stage */
const read = file => fs.readFileSync(`${HERE}rework/${file}.txt`, "utf8");
const LINE = { Paladin: [[20, 10], [32, 16], [46, 23]], Archer: [[16, 8], [25, 13], [36, 19]] }, SPECIES = { human: [3, 2] };
const doubleW = line => line.replace(/(\d+)d(\d+)(\+(\d+))?/g, (m, n, d, _, k) => `${2 * Number(n)}d${d}${k ? `+${2 * Number(k)}` : ""}`);
function load(file, stage = 1, opts = {}) {
  let txt = read(file);
  const cls = /^class Paladin/m.test(txt) ? "Paladin" : "Archer", wAttr = cls === "Paladin" ? "body" : "instinct";
  txt = txt.replace(/^level .*$/m, `level ${LV[stage - 1]}`);
  txt = txt.replace(/^attributes .*$/m, l => l.replace(new RegExp(`${wAttr} (\\d+)`), (m, n) => `${wAttr} ${Number(n) + stage - 1}`));   // one Attribute +1 a Stage: the Weapon one
  const attr = Number(txt.match(new RegExp(`${wAttr} (\\d+)`))[1]), step = stage === 3 ? 1 : 0;
  const wm = Math.min(4, Math.ceil(attr / 2) + 1 + step), pm = Math.min(4, 2 + step);   // Modifiers +1 at Stage 3, never above +4
  txt = txt.replace(/^weapon-mod .*$/m, `weapon-mod ${wm}`).replace(/^power-mod .*$/m, `power-mod ${pm}`).replace(/^ward .*$/m, "") + `\nward ${WD[stage - 1] - 11 - pm}\n`;
  if (stage === 3 && (opts.mastery ?? MASTERY)) txt = txt.replace(/^weapon .*$/m, doubleW);   // Master: one more [W] from level 8
  if (stage > 1) txt = txt.replace(/block 2d6\+\[Mod\]/, `block ${stage + 1}d6+[Mod]`);   // Shield of Faith's Stage steps (3d6 / 4d6)
  txt = (opts.edit ?? (x => x))(txt).replace(/^health-factor .*$/m, "") + `\nhealth-factor ${HF}\n`;
  const b = S.parseSpec(txt, `rework/${file}`), [hi, lo] = LINE[cls][stage - 1], sp = SPECIES.human;
  b.bodyHealth = hi + sp[0]; b.mindHealth = lo + sp[1]; b.pool = b.bodyHealth + b.mindHealth; b.rallyHeal = Math.ceil(b.pool / 4); b.rallyPoints = b.rally + stage;
  b.escHook = cls === "Paladin" ? "ally" : "quarry";
  if (opts.reserve) b.dmgScale = (b.dmgScale ?? 1) * RESERVE;
  return b;
}
const PARTY = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"];
const party = (stage = 1, opts = {}) => PARTY.map(f => load(f, stage, opts));

/* ------------------------------------------------------------------ the NPCs */
const KIT = { minion: { round: { ap: 1, mult: 1.4 } }, grunt: { round: { ap: 1, mult: 1.4 } }, standard: { round: { ap: 2, mult: 2.2 } }, elite: { round: { ap: 2, mult: 2.2 }, enc: { ap: 3, mult: 3.5 } } };
const CV = { minion: 0.25, grunt: 0.5, standard: 1, elite: 2 };
/** An NPC of the role at a Stage: today's tables × h (Health) and × d (damage; `ed` more on an Elite), `power` for a Vs. WD / [R] attacker. */
const npcAt = (role, stage = 1, { h = 1, d = 1, ed = 1, power = false, rating = "medium" } = {}) => {
  const n = S.npcOf(role, rating, LV[stage - 1], { power }), dd = d * (role === "elite" ? ed : 1);
  return { ...n, exact: true, kit: KIT[role], pool: Math.round(n.pool * h), bodyPool: Math.round(n.bodyPool * h), mindPool: Math.round(n.mindPool * h), t2: n.t2 * dd, t3: n.t3 * dd };
};
/** `[["standard", 3], ["standard", 1, { power: true }]]` → the NPC list. */
const enc = (list, stage = 1, f = {}) => list.flatMap(([role, k, o = {}]) => Array(k).fill(0).map(() => npcAt(role, stage, { ...f, ...o })));
const NORMAL = [["standard", 3], ["standard", 1, { power: true }]];   // the normal fight: 4 Standards, one of them attacking Ward Defense
const STD4 = [["standard", 4]];

/* ------------------------------------------------------------------ fights */
function fights(pcsBuilds, npcs, n = RUNS, seed = 17) {
  const Rn = S.rng(seed), out = [], cv = npcs.reduce((s, x) => s + CV[x.role], 0) / pcsBuilds.length;
  for (let k = 0; k < n; k++) {
    const pcs = pcsBuilds.map(S.pcState);
    for (const p of pcs) { p.startEsc = k % 2 ? 1 : 2; p.dailyOK = cv >= 1.25; }   // every fight starts at Escalation 1, Momentum (2) in half
    out.push(S.fight(pcs, npcs, Rn, { maxRounds: 15 }));
  }
  const sum = (f, key) => f.pcs.reduce((s, p) => s + (p.st[key] ?? 0), 0);
  const byRole = role => { const xs = out.flatMap(f => (f.W?.foes ?? []).filter(x => x.role === role)); return xs.length ? { dealt: mean(xs.map(x => x.dealt ?? 0)), turns: mean(xs.map(x => x.escTurns.reduce((s, v) => s + v, 0))), esc: [1, 2, 3].map(k => mean(xs.map(x => x.escTurns[k]))) } : null; };
  const health = pcsBuilds.reduce((s, b) => s + b.pool, 0), rp = mean(out.map(f => f.pcs.reduce((s, p) => s + ((p.st.rpSelf ?? 0) + (p.st.rpByAlly ?? 0)) * p.build.rallyHeal, 0)));   // the Rally Points spent in the fight, as the Health they heal
  return { rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), rp, cost: mean(out.map(x => x.lost)) + rp / health, down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))),
    taken: mean(out.map(f => sum(f, "taken"))), mindTaken: mean(out.map(f => sum(f, "mindTaken"))), dealt: mean(out.map(f => sum(f, "dealt"))),
    strainedTurns: mean(out.map(f => sum(f, "strainedTurns"))), pcTurns: mean(out.map(f => sum(f, "rounds"))), byRole, out,
    downPal: mean(out.map(f => (f.pcs.some(p => p.down && p.build.name.startsWith("Paladin")) ? 1 : 0))), downArc: mean(out.map(f => (f.pcs.some(p => p.down && p.build.name.startsWith("Archer")) ? 1 : 0))) };
}
const cell = r => `${f1(r.rounds)} r · lost ${pc(r.lost)} · cost ${pc(r.cost)} · Down ${pc(r.down)} · won ${pc(r.won)}`;   // cost = the Health lost at the end + the Rally Points spent in the fight (what they heal), as a share of the party's Health
/** Bisection: the x in [lo, hi] at which measure(x) crosses target (measure rising in x). */
function bisect(measure, target, lo, hi, iters = QUICK ? 5 : 7) { let a = lo, b = hi; for (let i = 0; i < iters; i++) { const m = (a + b) / 2; if (measure(m) < target) a = m; else b = m; } return (a + b) / 2; }
const stageParty = (stage, reserve = true) => party(stage, { reserve });
/** A Medium Standard's Basic attack against a Defense: the exact expected damage (Tier 2 / 3 averages × the tier chances). */
const expected = (npc, def) => { const p = C.tierProbs(npc.mod, def, 0, 0, ""); return p[1] * npc.t2 + p[2] * npc.t3; };

/* ------------------------------------------------------------------ the tables */
const ROLES = ["minion", "grunt", "standard", "elite"], RATINGS = ["Terrible", "Low", "Medium", "High", "Extreme"], STAGES = ["Stage 1 (levels 1-4)", "Stage 2 (levels 5-7)", "Stage 3 (levels 8-10)"];
/** The new tables from today's: damage × D[stage] (× ED on an Elite), Health × H[stage]; damage to 0.5, Health Multipliers to 0.25. */
function newTables(D, H, ED) {
  const out = {};
  for (const role of ROLES) out[role] = {
    hm: BT.ROLES[role].hm.map((row, s) => row.map(v => r25(v * H[s]))),
    basic: BT.ROLES[role].basic.map((row, s) => monotone(row.map(([a, b]) => [r5(a * D[s] * (role === "elite" ? ED : 1)), r5(b * D[s] * (role === "elite" ? ED : 1))])))
  };
  return out;
}
/** Each rating strictly above the one before it on both tiers (the rounding to 0.5 can make two equal): raised by 0.5 where needed. */
const monotone = row => { for (let i = 1; i < row.length; i++) for (const k of [0, 1]) if (row[i][k] <= row[i - 1][k]) row[i][k] = row[i - 1][k] + 0.5; return row; };
const sameTables = (a, b) => ROLES.every(r => JSON.stringify(a[r].hm) === JSON.stringify(b[r].hm) && JSON.stringify(a[r].basic) === JSON.stringify(b[r].basic));
const liveTables = () => Object.fromEntries(ROLES.map(r => [r, { hm: CF.TWOD12.npcRoles[r].hm, basic: CF.TWOD12.npcRoles[r].basic }]));
const mdTables = T => {
  const L = [];
  for (const role of ROLES) {
    const r = T[role], n = r.hm[0].length, heads = RATINGS.slice(0, n).map(x => `**${x}**`).join(" | ");
    L.push(`### ${role[0].toUpperCase() + role.slice(1)}s`, "", `**Health Multiplier**`, "", `| Stage | ${heads} |`, `|---|${"---|".repeat(n)}`);
    r.hm.forEach((row, s) => L.push(`| **${STAGES[s]}** | ${row.map(v => `×${v}`).join(" | ")} |`));
    L.push("", `**Basic attack, average damage: Tier 2 / Tier 3**`, "", `| Stage | ${heads} |`, `|---|${"---|".repeat(n)}`);
    r.basic.forEach((row, s) => L.push(`| **${STAGES[s]}** | ${row.map(([a, b]) => `${a} / ${b}`).join(" | ")} |`));
    L.push("");
  }
  return L;
};
const jsTables = T => ROLES.map(role => `    // ${role}\n      hm: ${JSON.stringify(T[role].hm)},\n      basic: ${JSON.stringify(T[role].basic)} },`).join("\n");
/** An NPC's Health with every rating Medium (the book's line under each role): (Attr + 2) × Medium multiplier + Health Base, each pool rounded up. */
const mediumHealth = (role, T, s) => { const r = CF.TWOD12.npcRoles[role], hm = T[role].hm[s][2], hp = a => Math.ceil((a + 2) * hm + r.hb - 1e-9); return hp(r.attr) + hp(r.attr); };

/* ------------------------------------------------------------------ the report */
export function run() {
  const L = [], T1 = Date.now();
  L.push("# Pack R-bestiary: the Bestiary re-fitted to the rebuilt party", "",
    "Written by `node book/ruler/rbestiary.mjs`; don't edit, run it again. Read by `book/rules-src/14-bestiary.md` (its tables and targets) and `book/rules-backlog.md` (pack R-bestiary).", "",
    `Runs: ${RUNS} fights a measurement. **The party:** rclasses.md's (a Smite Paladin, a Lay On Hands Paladin, a Double Shot Archer, a Rolling Shot Archer; Human, high on Vigor) at **Stage 1** (level 1: 35 / 35 / 29 / 29 Health, WD ${WD[0]}, Guard ${APG[0]} an unspent AP), **Stage 2** (level 5: the Health line, Rally + 2, Guard ${APG[1]}, the Weapon Attribute +1, WD ${WD[1]}) and **Stage 3** (level 8: Rally + 3, Guard ${APG[2]}, the Attribute +2 and Modifiers +1 (cap 4), WD ${WD[2]}, ${MASTERY ? "2[W] (Master, from level 8)" : "1[W]"}; Shield of Faith 3d6 / 4d6). **The reserve:** the fit is made with each PC dealing × ${RESERVE} (about a Talent's worth, the future Folk Traits: rules-backlog.md), so today's party has a little less than the fit assumes. **The rules:** rclasses.md's (4 + 1 AP, Escalation from 1 with Momentum in half the fights and the hooks, Guard from unspent AP, the NPC Specials, Opportunity Attack without the disrupt) plus **Elite Escalation** (1 in round 1, +1 a round: its first attack each round has 1 Boon; at 2 its Round Special twice a round; at 3 its Encounter Special comes back once) and the **Elite phases** (+1 Escalation when it becomes Bloodied and when it becomes Strained). **The NPCs:** today's tables (bestiary-today.mjs) × the factors fitted here; **a \`power\` NPC attacks Ward Defense and deals [R]**; the normal fight is 3 Standards + 1 power Standard (CV 400). **The targets:** ${pc(TARGET.lost)} of the party's Health, a Down in ${pc(TARGET.down)} of the fights, ${TARGET.rounds} rounds.`, "");
  setRules(R);

  // 1. The Stage 1 fit: NPC damage × d over today's tables, Health × 1.
  L.push("## 1. The Stage 1 fit: the NPC damage factor", "", "The normal fight (3 Standards + 1 power Standard) with the NPC Basic attack tables × d over today's (Health × 1), the party with the reserve and without. The decision sheet's × 0.6 was fitted on the P1 builds; the rebuilt party takes much less (rclasses.md section 2: 7%, a Down in 10% at × 0.6).", "",
    "| d | With the reserve: rounds · lost · Down · won | Taken · healed back a fight | Without the reserve | Taken a fight |", "|---|---|---|---|---|");
  const DS = QUICK ? [0.5, 0.6, 0.7, 0.9] : [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2];
  const health1 = party(1).reduce((s, b) => s + b.pool, 0);
  for (const d of DS) { const a = fights(stageParty(1), enc(NORMAL, 1, { d })), b = fights(stageParty(1, false), enc(NORMAL, 1, { d })); L.push(`| × ${f2(d)} | ${cell(a)} | ${f1(a.taken)} · ${f1(a.taken - a.lost * health1)} (${f1(a.rp)} by Rally Points) | ${cell(b)} | ${f1(b.taken)} |`); }
  L.push("", "The same with the Special multipliers scaled (× 0.75: a Standard's 2 AP Special × 1.65 instead of × 2.2; × 0.5: × 1.1) and NPC Health × 1.25 (a longer fight with smaller hits):", "", "| d | Specials × 0.75 | Specials × 0.5 | Health × 1.25 |", "|---|---|---|---|");
  for (const d of DS) { const rows = []; for (const [o, h] of [[{ npcSpecials: 0.75 }, 1], [{ npcSpecials: 0.5 }, 1], [{}, 1.25]]) { setRules({ ...R, ...o }); rows.push(cell(fights(stageParty(1), enc(NORMAL, 1, { d, h })))); } setRules(R); L.push(`| × ${f2(d)} | ${rows.join(" | ")} |`); }
  const dCost = bisect(d => fights(stageParty(1), enc(NORMAL, 1, { d }), RUNS, 23).cost, TARGET.lost, 0.3, 1.6), dDown = bisect(d => fights(stageParty(1), enc(NORMAL, 1, { d }), RUNS, 23).down, TARGET.down, 0.3, 1.6);
  const D1 = 0.7;   // the default (see the paragraph): the knee between the two targets, which this party can't meet together
  const at = fights(stageParty(1), enc(NORMAL, 1, { d: D1 })), at0 = fights(stageParty(1, false), enc(NORMAL, 1, { d: D1 }));
  L.push("", `**The two targets don't meet:** the cost reaches ${pc(TARGET.lost)} at d = ${f2(dCost)}, where a PC goes Down in about ${pc(fights(stageParty(1), enc(NORMAL, 1, { d: dCost })).down)} of the fights; a Down in ${pc(TARGET.down)} comes at d = ${f2(dDown)}, where the fight costs ${pc(fights(stageParty(1), enc(NORMAL, 1, { d: dDown })).cost)}. Whatever the shape (smaller Specials, more NPC Health), the Down rate follows the cost about 2 points under it: the Downs come from focus (the NPCs strike the hurt PC and the one in front), not from the shape of the damage. **The default: D1 = × ${f2(D1)}, the knee between them:** with the reserve ${cell(at)} (a Paladin Down in ${pc(at.downPal)}, an Archer in ${pc(at.downArc)}); today's party (no reserve) ${cell(at0)}. The Stage 1 tables are today's × ${D1}; × 0.6 gives the 1-in-10 at a cost of about 15%, × 0.9 the quarter with a Down in 2 fights of 5 (the table): Lucas picks by exception.`, "");
  log("1. the Stage 1 fit");

  // 2. Ward Defense.
  L.push("## 2. Ward Defense: the `power` NPCs", "", "A `power` NPC rolls its attacks against the PC's WD and its damage is Resolve damage ([R]); the Vs. AD damage tables serve it unchanged. The PCs' WD is 13 at Stage 1 against the Paladin's AD 14 and the Archer's AD 13, so a Vs. WD attack is a little stronger against the Paladin and the same against the Archer; what moves is which pool takes it: Resolve is the low pool (12 and 10 at level 1), so a party facing Resolve attackers is Strained early.", "");
  { const std = npcAt("standard", 1, { d: D1 }); L.push(`A Medium Standard's Basic attack at D1 (${f1(std.t2)} / ${f1(std.t3)}, Modifier +${std.mod}) deals on average ${f2(expected(std, 14))} against AD 14 (the Paladin), ${f2(expected(std, 13))} against AD 13 (the Archer) and ${f2(expected(std, 13))} against WD 13 (both): the Paladin takes ${pc(expected(std, 13) / expected(std, 14) - 1)} more from a Vs. WD attack.`, ""); }
  L.push("| The 4 Standards | rounds · lost · Down · won | Taken a fight · of it Resolve | PC turns while Strained (of all PC turns) |", "|---|---|---|---|");
  for (const [name, list] of [["4 Vs. AD", STD4], ["3 Vs. AD + 1 Vs. WD (the normal fight)", NORMAL], ["2 + 2", [["standard", 2], ["standard", 2, { power: true }]]], ["4 Vs. WD (a ghost pack)", [["standard", 4, { power: true }]]]]) {
    const r = fights(stageParty(1), enc(list, 1, { d: D1 })); L.push(`| ${name} | ${cell(r)} | ${f1(r.taken)} · ${f1(r.mindTaken)} | ${f1(r.strainedTurns)} (${pc(r.strainedTurns / r.pcTurns)}) |`);
  }
  L.push("", "So the Vs. AD damage table fits Vs. WD attacks as it is: the fight's cost barely moves with the share of Resolve attackers; what they change is the Strained hooks, which is their point.", "");
  log("2. Ward Defense");

  // 3. Elites: Elite Escalation and the phases.
  L.push("## 3. Elites: Elite Escalation and the phases", "", "An Elite fight at CV 400 (1 Elite + 2 Standards; 2 Elites) against the normal fight, with Elite Escalation off, on, and on with the phases; then the Elite's own damage factor (ed, on top of D1) that brings 2 Elites to the normal fight's cost.", "",
    "| Fight | Elite rules | rounds · lost · Down · won | Taken a fight | An Elite's turns at Escalation 1 / 2 / 3 | An Elite deals a turn |", "|---|---|---|---|---|---|");
  const ELITE_FIGHTS = [["1 Elite + 2 Standards", [["elite", 1], ["standard", 2]]], ["2 Elites", [["elite", 2]]]];
  for (const [name, list] of ELITE_FIGHTS) for (const [rule, o] of [["no Escalation", { eliteEsc: false, elitePhases: false }], ["Escalation", { eliteEsc: true, elitePhases: false }], ["Escalation + phases", { eliteEsc: true, elitePhases: true }]]) {
    setRules({ ...R, ...o }); const r = fights(stageParty(1), enc(list, 1, { d: D1 })), e = r.byRole("elite");
    L.push(`| ${name} | ${rule} | ${cell(r)} | ${f1(r.taken)} | ${e.esc.map(f2).join(" / ")} | ${f1(e.dealt / Math.max(1, e.turns))} |`);
  }
  setRules(R);
  L.push("", "| 2 Elites, Elite damage × ed | rounds · lost · Down · won | Taken a fight | An Elite deals a turn |", "|---|---|---|---|");
  for (const ed of (QUICK ? [1, 1.2] : [0.8, 0.9, 1, 1.1, 1.2, 1.3])) { const r = fights(stageParty(1), enc([["elite", 2]], 1, { d: D1, ed })), e = r.byRole("elite"); L.push(`| × ${f2(ed)} | ${cell(r)} | ${f1(r.taken)} | ${f1(e.dealt / Math.max(1, e.turns))} |`); }
  const edFit = bisect(ed => fights(stageParty(1), enc([["elite", 2]], 1, { d: D1, ed }), RUNS, 29).lost, at.lost, 0.6, 1.6);
  const ED = Math.round(edFit * 20) / 20;
  const e2 = fights(stageParty(1), enc([["elite", 2]], 1, { d: D1, ed: ED })), e12 = fights(stageParty(1), enc([["elite", 1], ["standard", 2]], 1, { d: D1, ed: ED }));
  L.push("", `**The Elite factor: 2 Elites cost the normal fight's ${pc(at.lost)} at ed = ${f2(edFit)}; rounded, ED = × ${f2(ED)}:** 2 Elites ${cell(e2)}; 1 Elite + 2 Standards ${cell(e12)}. The Elite's Basic attack rows are today's × ${D1} × ${ED}; its Health rows stay.`, "");
  log("3. Elites");

  // 4. Minions and Grunts.
  L.push("## 4. Minions and Grunts at CV 400", "", "| Fight | rounds · lost · Down · won | Taken a fight | A Minion / Grunt / Standard deals a turn |", "|---|---|---|---|");
  const dealsBy = {};
  for (const [name, list] of [["4 Standards", STD4], ["2 Standards + 8 Minions", [["standard", 2], ["minion", 8]]], ["8 Grunts", [["grunt", 8]]], ["4 Grunts + 2 Standards", [["grunt", 4], ["standard", 2]]], ["16 Minions", [["minion", 16]]]]) {
    const r = fights(stageParty(1), enc(list, 1, { d: D1, ed: ED })), deals = ["minion", "grunt", "standard"].map(role => { const x = r.byRole(role); if (x && !dealsBy[role]) dealsBy[role] = x.dealt / Math.max(1, x.turns); return x ? f1(x.dealt / Math.max(1, x.turns)) : "-"; });
    L.push(`| ${name} | ${cell(r)} | ${f1(r.taken)} | ${deals.join(" / ")} |`);
  }
  { const x = e2.byRole("elite"); dealsBy.elite = x.dealt / Math.max(1, x.turns); }
  L.push("", "A role's \"deals a turn\" is what it dealt (its Basic attacks and Specials, after the party's blocks, Guard and Defenses) per turn it took; a Minion's turns are few (it dies first).", "");
  log("4. Minions and Grunts");

  // 5. Stages 2 and 3: the damage rows × 1.2 / × 1.5 over today's (× D1), the Health rows fitted to 3.5 rounds.
  L.push("## 5. Stages 2 and 3", "", `The party at Stage 2 and 3 (the header's model) against the normal fight with the NPC damage rows at today's × D1 × ${STAGE_D[1]} / × ${STAGE_D[2]} (decision sheet item 17) and the Health rows × h over today's: h fitted so the fight lasts ${TARGET.rounds} rounds; what the fight then costs.`, "",
    "| Stage | h | rounds · lost · Down · won | Taken a fight | The party's Health | A PC's main turn at Escalation 3 (Smite Paladin / Double Shot Archer, Defense 13) |", "|---|---|---|---|---|---|");
  const H = [1, 1, 1];
  for (const stage of [2, 3]) {
    const d = D1 * STAGE_D[stage - 1], pcs = stageParty(stage), hp = pcs.reduce((s, b) => s + b.pool, 0);
    const turns = `${f1(S.turnDamage(load("paladin-smite-r1", stage), "main", 13, { escalation: 3 }).avg)} / ${f1(S.turnDamage(load("archer-double-r1", stage), "main", 13, { escalation: 3 }).avg)}`;
    for (const h of (QUICK ? [1] : [1, 1.25, 1.5])) { const r = fights(pcs, enc(NORMAL, stage, { d, h, ed: ED })); L.push(`| ${stage} | × ${f2(h)} | ${cell(r)} | ${f1(r.taken)} | ${hp} | ${turns} |`); }
    const hFit = bisect(h => fights(pcs, enc(NORMAL, stage, { d, h, ed: ED }), RUNS, 31).rounds, TARGET.rounds, 0.6, 2.5);
    H[stage - 1] = Math.abs(hFit - 1) < 0.15 ? 1 : Math.round(hFit * 20) / 20;   // today's Health rows stay unless the fit is far from them (the Stage party is a model)
    const r = fights(pcs, enc(NORMAL, stage, { d, h: H[stage - 1], ed: ED }));
    L.push(`| ${stage} | **× ${f2(H[stage - 1])} (the fit: ${f2(hFit)}${H[stage - 1] === 1 && Math.abs(hFit - 1) >= 0.005 ? "; today's rows kept: within 15%" : ""})** | ${cell(r)} | ${f1(r.taken)} | ${hp} | ${turns} |`);
  }
  { const r1 = S.turnDamage(load("paladin-smite-r1", 1), "main", 13, { escalation: 3 }).avg, r2 = S.turnDamage(load("archer-double-r1", 1), "main", 13, { escalation: 3 }).avg; L.push("", `For scale, at Stage 1 the same turns are ${f1(r1)} / ${f1(r2)} and the party's Health ${health1}. The Stage 2 and 3 party is a model (no Talents beyond level 1, no Stage Talents; R-classes wrote no level 5 or 8 cards): read the rows as the direction, and re-fit when the classes have their Stage 2 and 3 picks.`, ""); }
  log("5. Stages 2 and 3");

  // 6. The difficulty table at Stage 1.
  L.push("## 6. The difficulty table (Stage 1, the fitted tables)", "", "| Enemies (total CV) | rounds · lost · Down · won | Taken a fight |", "|---|---|---|");
  const DIFF = [["3 Standards (300, easy)", [["standard", 3]]], ["2 Standards + 4 Minions (300, easy)", [["standard", 2], ["minion", 4]]], ["4 Standards (400, normal)", STD4], ["3 Standards + 1 Vs. WD Standard (400, normal)", NORMAL], ["1 Elite + 2 Standards (400)", [["elite", 1], ["standard", 2]]], ["2 Elites (400)", [["elite", 2]]], ["8 Grunts (400)", [["grunt", 8]]], ["2 Standards + 8 Minions (400)", [["standard", 2], ["minion", 8]]],
    ["5 Standards (500, hard)", [["standard", 5]]], ["1 Elite + 3 Standards (500, hard)", [["elite", 1], ["standard", 3]]], ["6 Standards (600, deadly)", [["standard", 6]]], ["2 Elites + 2 Standards (600, deadly)", [["elite", 2], ["standard", 2]]]];
  const diff = {};
  for (const [name, list] of DIFF) { const r = fights(stageParty(1), enc(list, 1, { d: D1, ed: ED })); diff[name] = r; L.push(`| ${name} | ${cell(r)} | ${f1(r.taken)} |`); }
  L.push("", "The party with the reserve. Today's party (without it) takes about 2 points more of its Health in the normal fight (section 1).", "");
  log("6. the difficulty table");

  // 7. The tables.
  const D = [D1, D1 * STAGE_D[1], D1 * STAGE_D[2]], T = newTables(D, H, ED), live = liveTables(), match = sameTables(T, live);
  // The catch-up (2026-11-12): bestiary-r.json is the tables the book and config.mjs have. A run whose fit differs from them writes its tables to
  // bestiary-r-refit.json instead (a proposal: Lucas decides before the book's rows change), and leaves bestiary-r.json alone.
  const OUT = match ? "bestiary-r.json" : "bestiary-r-refit.json";
  if (match && fs.existsSync(HERE + "bestiary-r-refit.json")) fs.rmSync(HERE + "bestiary-r-refit.json");
  if (!match || !fs.existsSync(HERE + OUT)) fs.writeFileSync(HERE + OUT, JSON.stringify({ written: new Date().toISOString().slice(0, 10), D1, ED, H, D, deals: dealsBy, tables: T }, null, 1) + "\n");   // raw turns: the report's table
  L.push("## 7. The tables", "", `Today's tables × the factors: damage × ${D.map(f2).join(" / ")} by Stage (an Elite × ${ED} more), Health × ${H.map(f2).join(" / ")}; damage rounded to 0.5, multipliers to 0.25. ${match ? "They are the tables of \`bestiary-r.json\`; **config.mjs matches them.**" : "**This fit DIFFERS from the book's tables (config.mjs, \`bestiary-r.json\`): it is written to \`bestiary-r-refit.json\` as a proposal, and nothing is changed until Lucas decides.**"}`, "",
    "| Role | Health, every rating Medium, Stage 1 / 2 / 3 | Deals a turn against AD 13 (its Basic attack and Specials, 1 AP to move) | Deals a turn, measured (after the party's Guard, blocks and reduction; section 4) | Takes about (PC turns at Defense 13, Stage 1) |", "|---|---|---|---|---|");
  const pcTurn = mean(["paladin-smite-r1", "archer-double-r1"].map(f => S.turnDamage(load(f, 1), "main", 13, { escalation: 2 }).avg));
  setRules({ ...R, bestiary: match ? "r" : "today" });
  const TURN = { minion: 1.4 + 1, grunt: 1.4 + 1 + 0.9, standard: 2.2 + 1, elite: (3.5 + 1 + 2.5 * (2.2 + 1)) / 3.5 };   // the kit's multipliers a turn (the Elite's over 3.5 rounds; the At-will Bane on a second Basic attack about × 0.9)
  const raw = {};
  for (const role of ROLES) { const n = match ? S.npcOf(role, "medium", 1) : npcAt(role, 1, { d: D1, ed: ED }); raw[role] = TURN[role] * expected(n, 13); }
  for (const role of ROLES) L.push(`| ${role} | ${[0, 1, 2].map(s => mediumHealth(role, T, s)).join(" / ")} | ${f1(raw[role])} | ${f1(dealsBy[role] ?? NaN)} | ${f1(mediumHealth(role, T, 0) / pcTurn)} |`);
  setRules(R);
  L.push("", `A Stage 1 PC's main turn at Escalation 2 against Defense 13 averages ${f1(pcTurn)} here (the mean of the Smite Paladin's and the Double Shot Archer's). "Deals a turn against AD 13" is the design target an NPC's Actions are checked against (the Builder's "should deal"): the expected damage of its turn's attacks, before anything the party does about it.`, "", ...mdTables(T), "```", jsTables(T), "```", "");
  log("7. the tables");

  setRules({});
  L.push(`(${((Date.now() - T1) / 60000).toFixed(1)} minutes.)`);
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = run();
  fs.writeFileSync(HERE + "rbestiary.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
  log("done");
}
