// Pack R prep (2026-11-04): the numbers of the playtest 2 rework (book/playtest-2.md), run through the spec ruler (spec.mjs) with the
// map model: 4 AP + 1 Reaction AP (PCs and NPCs), Escalation as a level (nothing spent), the Health factors that keep a standard fight
// at 3.5 rounds and a third of the party's Health, what a Reaction AP buys (Opportunity Attack, Quick Draw, Shield of Faith as a block),
// the Escalation ladder's timing and what each Passive is worth, Overcast as the caster's Passive ladder (LV's stand-ins), Bloodied and
// Strained as hooks (when NPCs and PCs reach them), Slowed and Minions at 4 AP. Writes book/ruler/rework.md; the proposal that reads it
// is archive/book-drafts/rework-r.md. Nothing here changes report.md: the rules it moves are spec.mjs RULES, set per run and reset after.
//   node book/ruler/rework.mjs           writes rework.md and prints it (about 5 minutes)
//   node book/ruler/rework.mjs --quick   fewer runs (a draft in about 2 minutes)
//   node book/ruler/rework.mjs --sheet   part 2, the decision sheet's numbers (archive/book-drafts/rework-r.md section 14): writes rework-sheet.md (--sheet --quick: a draft)
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL(".", import.meta.url));
const QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 300 : 1000, CAL = QUICK ? 150 : 300, PAIRS = QUICK ? 1000 : 3000, DAYS = QUICK ? 150 : 400;
const ROUNDS = 3.5, TARGET = 0.33;              // decided (LV, E3): a standard fight lasts 3.5 rounds and costs a third of the party's Health
const HF = 1.125;                                // the book's Health factor at level 1: (Level + 17) / 16
const CV = { minion: 0.25, grunt: 0.5, standard: 1, elite: 2 };
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : "-");

/* ------------------------------------------------------------------ the rules of a run */
const TODAY = { ...S.RULES_PRE_R };   // the catch-up (2026-11-12): this is the prep study, so every run starts from the rules before pack R and adds the rework's pieces (R_RULES, SHEET) as the prep modeled them (Guard given when the turn ends, Opportunity Attack as the Talent, the pre-R Bestiary); spec.mjs's default is now the book today
const R_RULES = { ap: 4, reactionAp: 1, escalation: "level", npcAp: 4, minionAp: 3, npcReactionAp: 1 };
const setRules = o => Object.assign(S.RULES, TODAY, o);

/* ------------------------------------------------------------------ the PCs */
const read = (dir, file) => fs.readFileSync(`${HERE}${dir}/${file}.txt`, "utf8");
/** A build: the file's text, an edit (a function on the text), the Health factor on top of the book's. */
const load = (dir, file, { edit = x => x, hp = 1 } = {}) => S.parseSpec(edit(read(dir, file)).replace(/^health-factor .*$/m, "") + `\nhealth-factor ${HF * hp}\n`, `${dir}/${file}`);
const PARTIES = {
  today: { name: "today's builds (5 AP)", files: ["paladin-smite-1", "paladin-smite-1", "archer-double-1", "archer-double-1"], dir: "classes" },
  todayRolling: { name: "today's builds, Rolling Shot (5 AP)", files: ["paladin-smite-1", "paladin-smite-1", "archer-rolling-1", "archer-rolling-1"], dir: "classes" },
  r: { name: "the 4 AP builds (rework/)", files: ["paladin-smite-r1", "paladin-smite-r1", "archer-double-r1", "archer-double-r1"], dir: "rework" },
  rRolling: { name: "the 4 AP builds, Rolling Shot", files: ["paladin-smite-r1", "paladin-smite-r1", "archer-rolling-r1", "archer-rolling-r1"], dir: "rework" },
};
const partyOf = (key, o = {}) => PARTIES[key].files.map(f => o.line ? lineHealth(load(PARTIES[key].dir, f, { ...o, edit: o.edits?.[f] ?? o.edit ?? (x => x) }), o) : load(PARTIES[key].dir, f, { ...o, edit: o.edits?.[f] ?? o.edit ?? (x => x) }));
/* Part 2: the Stage Health line (section 12.4): the class's high / low (high on Vigor here: NPC Basic attacks are Vigor damage), the species' flat bonus (Human +3 / +2), no
   Attribute; Rally Points = the class's Rally value + Stage; the Escalation hook written on the class; o.dmg = every damage it deals × this (the dice cut, shape B). */
const LINE = { Paladin: [[20, 10], [32, 16], [46, 23]], Archer: [[16, 8], [25, 13], [36, 19]] }, SPECIES = { human: [3, 2], dwarf: [4, 1], elf: [1, 4] };   // per Stage; species: [Vigor, Resolve] (Human: + 3 on its high, + 2 on its low)
const stageOf = lv => (lv >= 8 ? 3 : lv >= 5 ? 2 : 1);
function lineValues(cls, lv = 1, species = "human") { const [hi, lo] = LINE[cls][stageOf(lv) - 1], sp = SPECIES[species]; return { vigor: hi + sp[0], resolve: lo + sp[1] }; }
function lineHealth(b, o = {}) {
  const cls = b.name.startsWith("Paladin") ? "Paladin" : "Archer", v = lineValues(cls, b.level);
  b.bodyHealth = v.vigor; b.mindHealth = v.resolve; b.pool = v.vigor + v.resolve; b.rallyHeal = Math.ceil(b.pool / 4); b.rallyPoints = b.rally + stageOf(b.level);
  b.escHook = cls === "Paladin" ? "ally" : "quarry"; if (o.dmg) b.dmgScale = o.dmg;
  return b;
}
const noReactions = x => x.replace(/^reaction .*$/gm, "");
const sofBlock = x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 1d8+[Mod]");

/* ------------------------------------------------------------------ the NPCs */
/** A level 1 Bestiary NPC (Medium, exact averages) with its Health × h and damage × d; built after the rules are set (its AP a turn). */
const KIT = { minion: { round: { ap: 1, mult: 1.4 } }, grunt: { round: { ap: 1, mult: 1.4 } }, standard: { round: { ap: 2, mult: 2.2 } }, elite: { round: { ap: 2, mult: 2.2 }, enc: { ap: 3, mult: 3.5 } } };   // part 2: each role's Specials (used only with RULES.npcSpecials)
const npcAt = (role, h = 1, d = 1) => { const n = S.npcOf(role, "medium", 1); return { ...n, exact: true, kit: KIT[role], pool: Math.round(n.pool * h), bodyPool: Math.round(n.bodyPool * h), mindPool: Math.round(n.mindPool * h), t2: n.t2 * d, t3: n.t3 * d }; };
const enc = (list, F = {}) => list.flatMap(([role, k]) => Array(k).fill(0).map(() => npcAt(role, (F.h ?? 1) * (F.x?.[role]?.h ?? 1), (F.d ?? 1) * (F.x?.[role]?.d ?? 1))));
const cvOf = list => list.reduce((s, [role, k]) => s + CV[role] * k, 0);
const ENCOUNTERS = [["3 Standards (CV 3, easy)", [["standard", 3]]], ["4 Standards (4)", [["standard", 4]]], ["Elite + 2 Standards (4)", [["elite", 1], ["standard", 2]]], ["2 Elites (4)", [["elite", 2]]],
  ["8 Grunts (4)", [["grunt", 8]]], ["2 Standards + 8 Minions (4)", [["standard", 2], ["minion", 8]]], ["5 Standards (5, hard)", [["standard", 5]]], ["6 Standards (6, deadly)", [["standard", 6]]], ["2 Elites + 2 Standards (6, deadly)", [["elite", 2], ["standard", 2]]]];
const MAIN = ENCOUNTERS.filter(e => cvOf(e[1]) === 4);

/* ------------------------------------------------------------------ fights */
/** Fights of a party against NPCs; half start with Momentum (1 Escalation at level 1); a Daily only in a hard fight. Returns the means and the per-creature records. */
let START = null;   // part 2: a function (fight index) -> the Escalation a PC starts the fight with; null = part 1's (0, or Momentum's 1 in half the fights)
function fights(party, npcs, n = RUNS, seed = 17) {
  const R = S.rng(seed), out = [], cv = npcs.reduce((s, x) => s + CV[x.role], 0) / party.length;
  for (let k = 0; k < n; k++) {
    const pcs = party.map(S.pcState);
    for (const p of pcs) { p.startEsc = START ? START(k) : k % 2 ? 0 : S.MOMENTUM.startEsc(p.build.level); p.dailyOK = cv >= 1.25; }
    out.push(S.fight(pcs, npcs, R, { maxRounds: 15 }));
  }
  const st = key => mean(out.flatMap(f => f.pcs.map(p => p.st[key] ?? 0)));
  const sum = (sel, key) => mean(out.map(f => f.pcs.filter(sel).reduce((s, p) => s + (p.st[key] ?? 0), 0)));
  const foes = out.flatMap(f => f.W?.foes ?? []);
  return {
    rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))), downs: mean(out.map(x => x.downs)),
    dealt: sum(() => true, "dealt"), turns: sum(() => true, "rounds"), reactions: sum(() => true, "reactions"), reactionDealt: sum(() => true, "reactionDealt"), oaMade: sum(() => true, "oaMade"), blocked: sum(() => true, "blockCredit"),
    surge: sum(() => true, "surgeCredit"), guard: sum(() => true, "guardCredit"), reduced: sum(() => true, "reducedGiven") + sum(() => true, "reduced"), mercy: sum(() => true, "mercyGiven"), elusive: sum(() => true, "elusive"), mindDealt: sum(() => true, "mindDealt"),
    escTurns: [0, 1, 2, 3].map(k => mean(out.flatMap(f => f.pcs.map(p => p.st.escTurns[k])))), bloodiedTurns: st("bloodiedTurns"), pcRounds: st("rounds"),
    by: cls => ({ dealt: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.dealt))), turns: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.rounds))),
      reactions: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.reactions))), reactionDealt: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.reactionDealt))),
      blocked: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.blockCredit))), taken: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.taken))),
      mind: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.mindDealt))), bloodiedTurns: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.bloodiedTurns))),
      bloodiedBy: r => mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => (p.bloodiedRound != null && p.bloodiedRound <= r ? 1 : 0)))), downs: mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st.downs))) }),
    foe: role => { const fs2 = foes.filter(f => f.role === role); const dead = fs2.filter(f => f.dead); return { n: fs2.length, bloodied: mean(dead.map(f => (f.bloodiedRound != null && f.bloodiedRound <= f.deadRound ? 1 : 0))), strained: mean(dead.map(f => (f.strainedRound != null && f.strainedRound <= f.deadRound ? 1 : 0))),
      bloodiedFirst: mean(dead.filter(f => f.bloodiedRound != null && f.strainedRound != null).map(f => (f.bloodiedRound < f.strainedRound ? 1 : 0))), both: mean(dead.map(f => (f.bloodiedRound != null && f.strainedRound != null ? 1 : 0))),
      bloodiedRound: mean(dead.filter(f => f.bloodiedRound != null).map(f => f.bloodiedRound)), strainedRound: mean(dead.filter(f => f.strainedRound != null).map(f => f.strainedRound)), deadRound: mean(dead.map(f => f.deadRound)), strainedAlive: mean(fs2.map(f => (f.strainedRound != null ? 1 : 0))), bloodiedAlive: mean(fs2.map(f => (f.bloodiedRound != null ? 1 : 0))) }; },
    out,
  };
}
/** The same fight for the two main parties (Double Shot, Rolling Shot), averaged. */
function both(keys, list, F = {}, n = RUNS, seed = 17, o = {}) {
  const rs = keys.map(k => fights(partyOf(k, o), enc(list, F), n, seed));
  const r = Object.fromEntries(["rounds", "lost", "down", "won", "downs", "dealt", "turns", "reactions", "reactionDealt", "oaMade", "blocked", "surge", "guard", "reduced", "mercy", "elusive", "mindDealt", "bloodiedTurns", "pcRounds"].map(x => [x, mean(rs.map(r => r[x]))]));
  r.escTurns = [0, 1, 2, 3].map(k => mean(rs.map(r => r.escTurns[k]))); r.rs = rs;
  return r;
}
const cell = r => `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)} · won ${pc(r.won)}`;
/** Bisection on a factor (geometric) so that f(x) reaches the target; f grows with x. */
function solve(f, target, lo, hi, steps = 9) { for (let i = 0; i < steps; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) < target) lo = mid; else hi = mid; } return Math.sqrt(lo * hi); }

/* ------------------------------------------------------------------ the report */
export function run() {
  const L = [];
  L.push("# The playtest 2 rework: the numbers (pack R prep)", "",
    "Written by `node book/ruler/rework.mjs` (the spec ruler with the map model; `spec.mjs RULES` moves the rules per run). Don't edit this file: edit the script and run it again. The proposal that reads it is `archive/book-drafts/rework-r.md`.", "",
    `Runs: ${RUNS} fights a measurement, ${CAL} a calibration step, ${PAIRS} pairs a price, ${DAYS} days${QUICK ? " (--quick: a draft)" : ""}. **The parties:** 2 P1 Smite Paladins + 2 A1 Archers (Double Shot; and Rolling Shot: each number is the mean of the two parties) at level 1, with the book's Health factor (Level + 17) / 16. **Today** = the book's rules (5 AP, Escalation spent, NPCs 5 AP) with the builds of \`classes/\`; **4 AP** = the rework (4 AP + 1 Reaction AP for PCs and NPCs, Escalation as a level) with the builds of \`rework/\` (the same cards, the turns cut to 4 AP, a Reaction each: the Paladin's Opportunity Attack, the Archer's Quick Draw as a stand-in for its Hallmark Reaction). Half the fights start with Momentum (1 Escalation); a Daily only in a hard fight. NPCs: the E3 Bestiary at level 1, Medium, exact averages; Elites have an Opportunity Attack.`, "");

  // 1. The AP cut: each build's turns at 5 and at 4 AP.
  L.push("## 1. The AP cut: a turn at 4 AP against 5", "", "Damage a turn against one creature at Defense 13 (20,000 turns each; no map), with the Escalation the turn needs and at Escalation 3. **Today** spends Escalation (an Active turns the passive off); **level** keeps it (Escalation as a level: the passives stay on, an Active spends nothing). The plan's turn is in bold.", "",
    "| Build | Turn | AP | Def 13 (its Esc) | Def 13, Esc 3 | Esc 3, Escalation as a level | Problems |", "|---|---|---:|---:|---:|---:|---|");
  const turnRows = (dir, file, rules) => {
    setRules(rules);
    const b = load(dir, file), rows = [];
    for (const [k, t] of Object.entries(b.turns)) {
      const esc = Math.min(3, t.steps.map(s => b.actions[s.replace(/\s*\(.*\)$/, "").toLowerCase()]).filter(Boolean).reduce((s2, a) => s2 + a.escalation, 0));
      const r = S.turnDamage(b, k, 13, { escalation: esc }), e3 = S.turnDamage(b, k, 13, { escalation: 3 });
      setRules({ ...rules, escalation: "level" });
      const lv = S.turnDamage(b, k, 13, { escalation: 3 });
      setRules(rules);
      const planned = b.plan.some(p => p.split("|").map(x => x.trim()).includes(k)) || b.whenSelf?.turn === k || b.whenEngaged === k;
      rows.push({ k, name: t.name, planned, ap: r.ap, esc, d: r.avg, e3: e3.avg, lv: lv.avg, problems: r.problems.join("; ") });
    }
    return { b, rows };
  };
  const BUILDS = [["classes", "paladin-smite-1", TODAY], ["rework", "paladin-smite-r1", R_RULES], ["classes", "paladin-hands-1", TODAY], ["rework", "paladin-hands-r1", R_RULES], ["classes", "archer-double-1", TODAY], ["rework", "archer-double-r1", R_RULES], ["classes", "archer-rolling-1", TODAY], ["rework", "archer-rolling-r1", R_RULES]];
  const best = {};
  for (const [dir, file, rules] of BUILDS) {
    const { b, rows } = turnRows(dir, file, rules);
    for (const r of rows) L.push(`| ${b.name} \`${dir}/${file}\` | ${r.planned ? `**${r.name}**` : r.name} | ${r.ap} | ${f1(r.d)} | ${f1(r.e3)} | ${f1(r.lv)} | ${r.problems} |`);
    const main = rows.filter(r => r.planned && !/steel|kite|nova/i.test(r.name) && !r.problems).sort((x, y) => y.d - x.d)[0], nova = rows.filter(r => /nova/i.test(r.name) && !r.problems).sort((x, y) => y.d - x.d)[0];
    best[`${dir}/${file}`] = { name: b.name, main, nova, all: rows };
  }
  setRules({});
  L.push("", "**The cut** (the plan's main turn at its Escalation, Defense 13; the best 4 AP turn of the file against today's; a Nova = the turn with the Encounter Action):", "", "| Class | Today's main turn | At 4 AP | 4 AP / today | Today's Nova | 4 AP Nova | Nova 4 AP / today |", "|---|---|---|---:|---|---|---:|");
  for (const [a, b] of [["classes/paladin-smite-1", "rework/paladin-smite-r1"], ["classes/paladin-hands-1", "rework/paladin-hands-r1"], ["classes/archer-double-1", "rework/archer-double-r1"], ["classes/archer-rolling-1", "rework/archer-rolling-r1"]]) {
    const A = best[a], B = best[b], bm = B.all.filter(r => !r.problems && !/steel|kite|nova/i.test(r.name)).sort((x, y) => y.d - x.d)[0];
    L.push(`| ${A.name} | ${A.main.name} ${f1(A.main.d)} | ${bm.name} ${f1(bm.d)} | ${pc(bm.d / A.main.d)} | ${A.nova ? `${A.nova.name} ${f1(A.nova.d)}` : "-"} | ${B.nova ? `${B.nova.name} ${f1(B.nova.d)}` : "-"} | ${A.nova && B.nova ? pc(B.nova.d / A.nova.d) : "-"} |`);
  }
  L.push("", "The Bestiary's baseline PC turn is 23.3 at Defense 13 (5 AP: 1 AP = 4.66 DE, econ.mjs). At 4 AP the price of 1 AP is the 4 AP baseline turn / 4 (section 4).", "");
  log("1. the AP cut");

  // 2. Fights by variant.
  L.push("## 2. The fights, rule by rule", "", "The CV 4 encounters (4 PCs), rounds · the party's Health lost · a PC goes Down · the party wins. Each column adds one piece of the rework; the NPCs keep today's Health and damage until section 3.", "");
  const VARIANTS = [
    ["Today", ["today", "todayRolling"], TODAY, {}],
    ["PCs 4 + 1 AP (NPCs 5 AP)", ["r", "rRolling"], { ap: 4, reactionAp: 1 }, {}],
    ["+ NPCs 4 + 1 AP", ["r", "rRolling"], { ap: 4, reactionAp: 1, npcAp: 4, npcReactionAp: 1 }, {}],
    ["+ Escalation as a level", ["r", "rRolling"], R_RULES, {}],
    ["Escalation as a level, NPCs 5 AP", ["r", "rRolling"], { ...R_RULES, npcAp: 5, npcReactionAp: 0 }, {}],
  ];
  L.push(`| Encounter | ${VARIANTS.map(v => v[0]).join(" | ")} |`, `|---|${VARIANTS.map(() => "---").join("|")}|`);
  const V = {};
  for (const [name, list] of MAIN) {
    const cells = VARIANTS.map(([vn, keys, rules]) => { setRules(rules); const r = both(keys, list); (V[vn] ??= {})[name] = r; return cell(r); });
    L.push(`| ${name} | ${cells.join(" | ")} |`);
  }
  L.push("", "What the party deals and takes in the 4 Standards fight (per fight, all 4 PCs; Reactions = the Reactions made, with the damage they dealt):", "", `| | ${VARIANTS.map(v => v[0]).join(" | ")} |`, `|---|${VARIANTS.map(() => "---:").join("|")}|`);
  const row = (label, fn) => L.push(`| ${label} | ${VARIANTS.map(v => fn(V[v[0]]["4 Standards (4)"])).join(" | ")} |`);
  row("Damage dealt a fight (the party)", r => f1(r.dealt));
  row("Damage dealt a PC turn", r => f1(r.dealt / r.turns));
  row("PC turns a fight", r => f1(r.turns));
  row("Reactions made a fight (damage)", r => `${f2(r.reactions)} (${f1(r.reactionDealt)})`);
  row("PC turns at Escalation 0 / 1 / 2 / 3", r => r.escTurns.map(f1).join(" / "));
  row("Divine Surge: allies' extra damage a fight (Guard used)", r => `${f1(r.surge)} (${f1(r.guard)})`);
  row("Hallowed Stance: damage reduced a fight", r => f1(r.reduced));
  row("Font of Mercy: extra healing a fight", r => f1(r.mercy));
  L.push("");
  log("2. the fights by variant");

  // 3. Calibration.
  L.push("## 3. Health about -20%: the factors", "", `For 4 Standards against the 4 AP party (Escalation as a level): the NPC Health factor **h** for which the fight lasts ${ROUNDS} rounds, then the PC Health factor **p** for which it costs the party ${pc(TARGET)} of its Health (bisection, alternating twice; NPC damage stays). Once with NPCs at 4 + 1 AP (the rework) and once with NPCs at 5 AP.`, "");
  const calib = rules => { setRules(rules); let h = 0.85, p = 1; for (let it = 0; it < 2; it++) { h = solve(x => both(["r", "rRolling"], [["standard", 4]], { h: x }, CAL, 17, { hp: p }).rounds, ROUNDS, 0.5, 1.6); p = solve(x => 1 - both(["r", "rRolling"], [["standard", 4]], { h }, CAL, 17, { hp: x }).lost, 1 - TARGET, 0.5, 1.6); } return { h, p }; };
  const F4 = calib(R_RULES); log("3. calibrated (NPCs 4 AP)");
  const F5 = calib({ ...R_RULES, npcAp: 5, npcReactionAp: 0 }); log("3. calibrated (NPCs 5 AP)");
  L.push("| NPCs | NPC Health × h | PC Health × p | 4 Standards at these factors |", "|---|---:|---:|---|");
  setRules(R_RULES); L.push(`| 4 + 1 AP (the rework) | ${f2(F4.h)} | ${f2(F4.p)} | ${cell(both(["r", "rRolling"], [["standard", 4]], { h: F4.h }, RUNS, 17, { hp: F4.p }))} |`);
  setRules({ ...R_RULES, npcAp: 5, npcReactionAp: 0 }); L.push(`| 5 AP | ${f2(F5.h)} | ${f2(F5.p)} | ${cell(both(["r", "rRolling"], [["standard", 4]], { h: F5.h }, RUNS, 17, { hp: F5.p }))} |`);
  L.push("", `A Standard today: ${S.npcOf("standard", "medium", 1).pool} Health (Body ${S.npcOf("standard", "medium", 1).bodyPool} + Mind ${S.npcOf("standard", "medium", 1).mindPool}); the P1 Paladin ${load("rework", "paladin-smite-r1").pool}, the A1 Archer ${load("rework", "archer-double-r1").pool}. With the factors: a Standard ${Math.round(S.npcOf("standard", "medium", 1).pool * F4.h)}, the Paladin ${load("rework", "paladin-smite-r1", { hp: F4.p }).pool}, the Archer ${load("rework", "archer-double-r1", { hp: F4.p }).pool}.`, "");
  L.push("**Fights by CV at the rework's factors** (NPCs 4 + 1 AP, NPC Health × h, PC Health × p; the Bestiary's targets: easy 2.5 rounds / 20%, normal 3.5 / a third, hard 4.5-5 / half, deadly 6 / half to three quarters):", "", "| Encounter | Today (the book) | The rework at its factors |", "|---|---|---|");
  const F = { h: F4.h }, O = { hp: F4.p };
  const R4 = {};
  for (const [name, list] of ENCOUNTERS) { setRules(TODAY); const a = both(["today", "todayRolling"], list); setRules(R_RULES); const b = both(["r", "rRolling"], list, F, RUNS, 17, O); R4[name] = b; L.push(`| ${name} | ${cell(a)} | ${cell(b)} |`); }
  L.push("");
  log("3. fights by CV");

  // 4. Escalation as a level.
  setRules(R_RULES);
  const S4 = R4["4 Standards (4)"];
  const share = k => S4.escTurns.slice(k).reduce((s, x) => s + x, 0) / S4.escTurns.reduce((s, x) => s + x, 0);
  L.push("## 4. Escalation as a level", "", "**Timing** (the 4 Standards fight at the rework's factors; half the fights start with Momentum, 1 Escalation at level 1):", "", "| | Escalation 0 | 1 | 2 | 3 |", "|---|---:|---:|---:|---:|",
    `| PC turns a fight at this level | ${S4.escTurns.map(f2).join(" | ")} |`, `| Share of the PC turns at this level or more | ${[0, 1, 2, 3].map(k => pc(share(k))).join(" | ")} |`, "");
  const reach = (k, sel) => mean(S4.rs.flatMap(r => r.out.filter(sel).flatMap(f => f.pcs.map(p => (p.st.escTurns.slice(k).some(x => x > 0) ? 1 : 0)))));
  const turnsAt = (k, sel) => mean(S4.rs.flatMap(r => r.out.filter(sel).flatMap(f => f.pcs.map(p => p.st.escTurns.slice(k).reduce((s, x) => s + x, 0)))));
  const mom = (f, i) => i % 2 === 0, noMom = (f, i) => i % 2 === 1, all = () => true;
  L.push("| Per PC | all fights | with Momentum (starts at 1) | without |", "|---|---:|---:|---:|");
  for (const k of [1, 2, 3]) L.push(`| Fights with a turn at Escalation ${k} or more · such turns a fight | ${pc(reach(k, all))} · ${f2(turnsAt(k, all))} | ${pc(reach(k, mom))} · ${f2(turnsAt(k, mom))} | ${pc(reach(k, noMom))} · ${f2(turnsAt(k, noMom))} |`);
  L.push("", `So an **Encounter ability that needs Escalation 3** is used in about ${pc(reach(3, all))} of the fights (${pc(reach(3, mom))} with Momentum, ${pc(reach(3, noMom))} without); a Round ability that needs Escalation 2 fires ${f2(turnsAt(2, all))} times a fight, one that needs Escalation 1 ${f2(turnsAt(1, all))} times.`, "");
  // The passives, each priced at Escalation 3 on the 4 AP main turn (with and without it).
  L.push("**What each Passive is worth** (the 4 AP main turn at Escalation 3, Defense 13: with and without the Passive; the defensive ones from the 4 Standards fight at the rework's factors, per fight for the PC that has it):", "", "| Passive (today's level) | Build | Worth | How |", "|---|---|---:|---|");
  const without = (dir, file, name, turn) => { const b1 = load(dir, file), b0 = load(dir, file, { edit: x => x + `\n# no ${name}\n` }); b0.passives = b0.passives.filter(p => !p.name.toLowerCase().startsWith(name.toLowerCase())); return { with: S.turnDamage(b1, turn, 13, { escalation: 3 }).avg, without: S.turnDamage(b0, turn, 13, { escalation: 3 }).avg }; };
  const addPassive = (dir, file, line, turn) => { const b1 = load(dir, file, { edit: x => x + `\n${line}\n` }), b0 = load(dir, file); return { with: S.turnDamage(b1, turn, 13, { escalation: 3 }).avg, without: S.turnDamage(b0, turn, 13, { escalation: 3 }).avg }; };
  const kf = without("rework", "archer-double-r1", "Killer's Focus", "main"), mq = without("rework", "archer-double-r1", "Marked Quarry", "main"), rz = addPassive("rework", "paladin-smite-r1", "passive Radiant Zeal", "main");
  L.push(`| Killer's Focus (2+) | Archer | +${f1(kf.with - kf.without)} a turn (${pc(kf.with / kf.without - 1)}) | +1d6 on the first [Shot] Strike a round |`);
  L.push(`| Marked Quarry (a Feature; both parts) | Archer | +${f1(mq.with - mq.without)} a turn (${pc(mq.with / mq.without - 1)}) | 1 Boon on [Shot] Strikes against it and [Mod] on a Tier 1 |`);
  L.push(`| Radiant Zeal (1+) | Paladin | +${f1(rz.with - rz.without)} a turn (${pc(rz.with / rz.without - 1)}) | +1d6 Holy on the first Strike a round |`);
  const palStat = S4.rs.map(r => r.by("Paladin")), arcStat = S4.rs.map(r => r.by("Archer"));
  L.push(`| Hallowed Stance (2+) | Paladin | ${f1(S4.reduced / 2)} damage a fight per Paladin (${f1(S4.reduced / 2 / mean(palStat.map(x => x.turns)))} a turn) | Body damage reduced by [PMod] for it and adjacent allies, while it hasn't left its square |`);
  L.push(`| Font of Mercy (1+, a Feature) | Paladin | ${f1(S4.mercy / 2)} Health a fight per Paladin | +[PMod] + 2 on every Rally Point used within 5 squares |`);
  const elu = (() => { const b = partyOf("r", { edits: { "archer-double-r1": x => x + "\npassive Elusive\n" } }); setRules(R_RULES); const r = fights(b, enc([["standard", 4]], F), RUNS, 17); const base = fights(partyOf("r", O), enc([["standard", 4]], F), RUNS, 17); return { r, base }; })();
  L.push(`| Elusive (1+) | Archer | ${f1((elu.base.by("Archer").taken - elu.r.by("Archer").taken))} damage a fight per Archer (${f2(elu.r.elusive / 2)} Strikes a fight take its Bane) | 1 Bane on the first Strike against it each round (a run with Elusive added, the same dice) |`);
  L.push(`| Divine Surge (an Active, 1, Round, 0 AP) | Paladin | ${f1(S4.surge / 2)} allies' damage + ${f1(S4.guard / 2)} Guard used a fight per Paladin | as a level: used every round from Escalation 1 (today: spent, so it turns Hallowed Stance off) |`);
  L.push("");
  // The Archer's Actives as a level: Pinning Shot and Twin Shot as Round (every turn at the level) and as Encounter.
  L.push("**The Archer's Actives when Escalation is a level** (the 4 Standards fight at the rework's factors; the Archer's damage a fight and the conditions it puts on):", "", "| The Archer's plan | Damage a fight | Immobilized a fight | Notes |", "|---|---:|---:|---|");
  const twinEnc = "action Twin Shot | ap 1 | encounter | traits ranged shot strike weapon | escalation 3 | does Weapon Attack | each extra 1d6 | area 2";
  const archerPlans = [
    ["Pinning Shot from Escalation 2, every round (Round; today's card as a level)", x => x],
    ["Twin Shot from Escalation 3, every round (Round; today's card as a level)", x => x.replace(/^turn Pin: .*$/m, "turn Pin: Double Shot 2, Lock & Loose, Twin Shot (else Weapon Attack)")],
    ["Twin Shot at Escalation 3 once a fight (Encounter)", x => x.replace(/^turn Pin: .*$/m, "turn Pin: Double Shot 2, Lock & Loose, Twin Shot (else Weapon Attack)") + `\n${twinEnc}\n`],
    ["Neither (a Weapon Attack instead)", x => x.replace(/^turn Pin: .*$/m, "turn Pin: Double Shot 2, Lock & Loose, Weapon Attack")],
  ];
  for (const [name, edit] of archerPlans) { setRules(R_RULES); const r = fights(partyOf("r", { ...O, edits: { "archer-double-r1": edit } }), enc([["standard", 4]], F), RUNS, 17); const a = r.by("Archer"); const imm = mean(r.out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith("Archer")).map(p => (p.st.debuffs["Immobilized (EoT)"] ?? 0)))); L.push(`| ${name} | ${f1(a.dealt)} | ${f2(imm)} | ${f1(a.dealt / a.turns)} a turn |`); }
  L.push("");
  log("4. Escalation");

  // 5. Reactions.
  L.push("## 5. The Reaction AP", "", "The 4 Standards fight at the rework's factors, three ways: no Reactions; the Paladins with Opportunity Attack and the Archers with Quick Draw (a Weapon Attack when an enemy within 5 squares moves closer: a stand-in for the Archer's Hallmark Reaction); the Paladins with Shield of Faith as a 1R block (1d8 + [PMod] off one hit on them or an ally within 5 squares, once per NPC turn) and the Archers with Quick Draw. Per fight.", "",
    "| Reactions | rounds · lost · Down · won | Paladin: Reactions a fight (damage) | Archer: Reactions a fight (damage) | Shield of Faith: damage blocked a fight (both Paladins) | Party damage a fight | Party damage taken a fight | Worth against none (DE a fight · a PC turn) |", "|---|---|---|---|---:|---:|---:|---:|");
  let none = null;
  for (const [name, edits] of [["None", { edit: noReactions }], ["Opportunity Attack + Quick Draw", {}], ["Shield of Faith (block) + Quick Draw", { edits: { "paladin-smite-r1": sofBlock } }]]) {
    setRules(R_RULES);
    const r = both(["r", "rRolling"], [["standard", 4]], F, RUNS, 17, { ...O, ...edits });
    const P = r.rs.map(x => x.by("Paladin")), A = r.rs.map(x => x.by("Archer")), taken = mean(r.rs.map(x => mean(x.out.map(f => f.pcs.reduce((s, p) => s + p.st.taken, 0)))));
    none ??= { dealt: r.dealt, taken, turns: r.turns };
    const de = (r.dealt - none.dealt) + (none.taken - taken);
    L.push(`| ${name} | ${cell(r)} | ${f2(mean(P.map(x => x.reactions)))} (${f1(mean(P.map(x => x.reactionDealt)))}) | ${f2(mean(A.map(x => x.reactions)))} (${f1(mean(A.map(x => x.reactionDealt)))}) | ${f1(r.blocked)} | ${f1(r.dealt)} | ${f1(taken)} | ${f1(de)} · ${f2(de / r.turns)} |`);
  }
  L.push("", `For scale: 1 AP at 4 AP is worth ${f1(23.3 * (best["rework/paladin-smite-r1"].main.d / best["classes/paladin-smite-1"].main.d + best["rework/archer-double-r1"].main.d / best["classes/archer-double-1"].main.d) / 2 / 4)} DE (the baseline turn 23.3 × the AP cut of section 1 / 4) and a Weapon Attack about 5.4; a Reaction AP is worth what its Reaction does times how often it fires.`, "");
  log("5. Reactions");

  // 6. Overcast as the caster's Passive ladder (LV's stand-ins at 4 AP, Escalation as a level).
  L.push("## 6. Overcast as the caster's Passive ladder (LV's stand-ins)", "", "Pack LV's weapon user and caster (progression.mjs: the same budget, [W] dice against Power dice; model A: Modifier +2 / +3 / +4 by tier, Mastery 2[W] and keep the best at level 8), with 4 AP turns and Escalation as a level: the weapon user's Surge (+1d8 on its next Strike) works every round from Escalation 1 and Killer (+1d6 on the first Strike) from 2; the caster's first Bolt each round is **Overcast up to its Escalation level**, capped by the tier's limit (1 / 2 / 3). Damage a round against one target at Defense 13, half the fights with Momentum (1 / 2 / 3 Escalation at levels 1-4 / 5-7 / 8-10); **fight** = rounds 1-3 + half of round 4. Today's check (Overcast paid with Escalation, the round-1 floor): progression.md section 5.", "",
    "| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |", "|---:|---|---:|---:|---:|---:|---:|---|");
  const tier = lv => (lv >= 8 ? 3 : lv >= 5 ? 2 : 1), modOf = lv => [2, 3, 4][tier(lv) - 1], healthOf = lv => 1.1 * (1 + (lv - 1) / 18), startEsc = lv => (lv >= 8 ? 3 : Math.min(2, Math.ceil(lv / 2)));
  const weaponUser = lv => { const W = lv >= 8 ? "2[W]" : "1[W]"; return S.parseSpec(`class Weapon user
role melee
level ${lv}
attributes body 2, mind 1, instinct 0, appeal 0
health body x4 +3, mind x3 +4
health-factor ${healthOf(lv)}
armor 3
weapon-mod ${modOf(lv)}
power-mod ${modOf(lv)}
rally 6
weapon Greatsword (melee, two-handed): 0 / 1d8 / 2d6
action Weapon Attack | ap 1 | at-will | traits strike weapon | vs ad | tiers 0 / ${W} + [Mod] / ${W} + [Mod]
action Strike 2 | ap 2 | round | traits signature strike weapon | vs ad | tiers [B] ${W} + [M] 1d6 / [B] ${W} + [Mod] + [M] 1d10 / [B] ${W} + [Mod] + [M] 2d8
action Wrath 3 | ap 3 | encounter | traits strike weapon | vs ad | tiers [B] ${W} + [M] 3d8 / [B] ${W} + [Mod] + [M] 5d8 / [B] ${W} + [Mod] + [M] 7d8
action Surge 1 | ap 0 | round | traits self | escalation 1 | always: extra 1d8 next strike
passive Killer: escalation 2: extra 1d6 first strike
turn Main: Surge 1, Strike 2, Weapon Attack, Weapon Attack
turn Nova: Surge 1, Wrath 3, Weapon Attack
plan Nova | Main, Main
`, `weapon-${lv}`); };
  const caster = (lv, limit = tier(lv), kb = lv >= 8 ? 1 : 0) => { const w = [[], ["1d8"], ["2d6"]], times = (d, n) => (n ? `${n}d8` : "");
    const tiers = (rest, n = 0) => [0, 1, 2].map(t => ["[M]", [...w[t], ...(t ? [rest[t], "[Mod]"] : [rest[t]]), ...(n ? [times("1d8", n)] : [])].filter(Boolean).join(" + ")].join(" ")).join(" / ").replace(/\[M\] (\/|$)/g, "0 $1");
    const spell = (name, ap, freq, rest, n = 0) => `action ${name} | ap ${ap} | ${freq} | traits power spell strike ranged | vs wd |${n ? ` escalation ${n} |` : ""} tiers ${tiers(rest, n)}`;
    return S.parseSpec(`class Caster
role ranged
level ${lv}
attributes body 1, mind 1, instinct 0, appeal 2
health body x3 +3, mind x2.5 +4
health-factor ${healthOf(lv)}
armor 2
weapon-mod ${modOf(lv)}
power-mod ${modOf(lv)}
rally 5
weapon Focus (ranged, range 10/20/40): 0 / 0 / 0
${kb ? `keep-best ${kb} power` : ""}
${spell("Spark", 1, "at-will", ["", "", ""])}
${Array.from({ length: limit + 1 }, (_, n) => spell(`Bolt ${n}`, 2, "round", ["1d6", "1d10", "2d8"], n)).join("\n")}
${spell("Blast 3", 3, "encounter", ["3d8", "5d8", "7d8"])}
turn Main: Bolt ${limit}, Spark, Spark
turn Nova: Blast 3, Spark
plan Nova | Main, Main
`, `caster-${lv}`); };
  const byRound = (build, lv, n = QUICK ? 4000 : 12000) => { const R = S.rng(23), sums = [0, 0, 0, 0];
    for (let k = 0; k < n; k++) { const target = { ad: 13, wd: 13, save: { body: 2, mind: 1, instinct: 1, appeal: 1 } }, p = { build, quarry: target, esc: k % 2 ? 0 : startEsc(lv), spent: new Set(), floorUsed: false, dailyOK: false };
      for (let r = 1; r <= 4; r++) { if (r > 1) p.esc = Math.min(3, p.esc + 1); p.firstThisRound = new Set(); sums[r - 1] += S.runTurn(p, build.turns[S.turnFor(p, r)], { R, escalation: p.esc, target: () => target, others: () => [] }).damage; } }
    return sums.map(x => x / n); };
  const fightTotal = r => r[0] + r[1] + r[2] + 0.5 * r[3];
  setRules(R_RULES);
  for (const lv of [1, 5, 8]) {
    const w = byRound(weaponUser(lv), lv), wt = fightTotal(w);
    L.push(`| ${lv} | weapon user (Surge from 1, Killer from 2) | ${w.map(f1).join(" | ")} | ${f1(wt)} | |`);
    for (const [name, limit] of [["caster, Overcast up to the tier's limit", tier(lv)], ...(tier(lv) < 3 ? [["caster, Overcast up to 3 (no tier limit)", 3]] : []), ["caster, no Overcast", 0]]) {
      const c = byRound(caster(lv, limit), lv), ct = fightTotal(c);
      L.push(`| ${lv} | ${name} | ${c.map(f1).join(" | ")} | ${f1(ct)} | ${pc(c[0] / w[0])} · ${pc(ct / wt)} |`);
    }
  }
  L.push("", "The weapon user's Surge as a level (every round from Escalation 1) is the comparison the rework implies: the Paladin's Divine Surge works the same way. Overcast capped by tier keeps the caster within a few percent of the weapon user; a caster whose Overcast reaches 3 at level 1 is ahead (the tier cap stays).", "");
  log("6. Overcast");

  // 7. Bloodied and Strained.
  setRules(R_RULES);
  L.push("## 7. Bloodied and Strained as hooks", "", "**The thresholds** (level 1, the book's Health factor; the Bestiary's Medium NPCs with Body High; a PC's Body and Mind thresholds from its class multipliers and species):", "", "| Creature | Body threshold (Bloodied) | Mind threshold (Strained) | Health Pool | Bloodied at | Strained at |", "|---|---:|---:|---:|---:|---:|");
  const pcSpec = (cls, body, mind, sb, sm) => S.parseSpec(`class ${cls}\nlevel 1\nattributes body ${body}, mind ${mind}\nhealth body x${cls === "Paladin" ? 4 : 3} +${sb}, mind x${cls === "Paladin" ? 4 : 2.5} +${sm}\nhealth-factor ${HF}\n`, cls);
  for (const [name, b] of [["Human Paladin (Body 2, Mind 1)", pcSpec("Paladin", 2, 1, 3, 4)], ["Dwarf Paladin (Body 2, Mind 2)", pcSpec("Paladin", 2, 2, 5, 3)], ["Elf Paladin (Body 1, Mind 2)", pcSpec("Paladin", 1, 2, 1, 5)], ["Human Archer (Body 1, Mind 1)", pcSpec("Archer", 1, 1, 3, 4)], ["Dwarf Archer (Body 1, Mind 1)", pcSpec("Archer", 1, 1, 5, 3)], ["Elf Archer (Body -1, Mind 2)", pcSpec("Archer", -1, 2, 1, 5)]])
    L.push(`| ${name} | ${b.bodyHealth} | ${b.mindHealth} | ${b.pool} | ${pc(b.bodyHealth / b.pool)} of its Health in Body damage | ${pc(b.mindHealth / b.pool)} in Mind damage |`);
  for (const role of ["minion", "grunt", "standard", "elite"]) { const n = S.npcOf(role, "medium", 1); L.push(`| ${n.name} (Medium, Body High) | ${n.bodyPool} | ${n.mindPool} | ${n.pool} | ${pc(n.bodyPool / n.pool)} | ${pc(n.mindPool / n.pool)} |`); }
  L.push("", "**In the fights** (the rework at its factors; the party's damage by pool: arrows and [W] dice are Body, Holy dice are Mind; an NPC's Basic attack is Body): how often an NPC is Bloodied or Strained before it dies, and in which round; how often a PC is Bloodied by the end of round 1, 2 and 3, and the share of its turns taken while Bloodied.", "",
    "| Encounter | NPC role | Bloodied before dying (mean round) | Strained before dying (mean round) | Both | Bloodied first, of those with both | Dies (mean round) |", "|---|---|---|---|---:|---:|---:|");
  for (const name of ["4 Standards (4)", "Elite + 2 Standards (4)", "2 Elites (4)", "8 Grunts (4)"]) for (const role of ["standard", "elite", "grunt"]) {
    const fs2 = R4[name].rs.map(r => r.foe(role)); if (!fs2[0].n) continue;
    const m = k => mean(fs2.map(x => x[k]));
    L.push(`| ${name} | ${role} | ${pc(m("bloodied"))} (${f1(m("bloodiedRound"))}) | ${pc(m("strained"))} (${f1(m("strainedRound"))}) | ${pc(m("both"))} | ${pc(m("bloodiedFirst"))} | ${f1(m("deadRound"))} |`);
  }
  L.push("", "| Encounter | PC | Bloodied by the end of round 1 / 2 / 3 | Turns taken while Bloodied (of its turns) | Down a fight | Mind share of its damage |", "|---|---|---|---:|---:|---:|");
  for (const name of ["4 Standards (4)", "Elite + 2 Standards (4)", "2 Elites (4)"]) for (const cls of ["Paladin", "Archer"]) {
    const xs = R4[name].rs.map(r => r.by(cls)), m = k => mean(xs.map(x => x[k])), bb = r => mean(xs.map(x => x.bloodiedBy(r)));
    L.push(`| ${name} | ${cls} | ${pc(bb(1))} / ${pc(bb(2))} / ${pc(bb(3))} | ${pc(m("bloodiedTurns") / m("turns"))} | ${f2(m("downs"))} | ${pc(m("mind") / m("dealt"))} |`);
  }
  L.push("", "Today's rule (a Bane on every [Weapon] Action while Bloodied, on every [Power] Action while Strained) is not in the simulation. With the thresholds above, the Elf Archer is Bloodied by the first hit and the Paladin at about half its Health. NPCs: the Paladins' Holy dice are about half of a Smite's damage (their Mind share above), the Archers deal Body only, and the party focuses one enemy at a time, so an NPC is nearly always Bloodied (its Body threshold is 56% of its Health) about one round before it dies, and Strained only when both Paladins work on it.", "");
  log("7. Bloodied / Strained");

  // 8. Slowed and Minions.
  L.push("## 8. Slowed and Minions at 4 AP", "", "**Slowed** priced as pack E2 did (positions.mjs): the party against 4 Standards that don't die, a window of 2 rounds from round 2, each price a pair of fights with the same dice (the condition put on one creature at the start of round 2); value = damage the party deals more + takes less (DE). Under today's rules and under the rework's (PCs and NPCs 4 + 1 AP; Slowed lowers the turn's AP, not the Reaction AP). Not the same measurement as prices.md section 5 (positions.mjs averages rounds 1 to 3 with 6,000 pairs): compare the two columns with each other.", "",
    "| Condition | Today (5 AP), DE | 4 + 1 AP, DE | AP it takes, as a share of the turn: today / 4 AP |", "|---|---:|---:|---|");
  const pair = (keys, rules, inject, o = {}) => { setRules(rules); const party = keys.map(k => partyOf(k, o)); let diffs = [];
    for (const pt of party) for (let k = 0; k < PAIRS; k++) {
      const npcs = enc([["standard", 4]]);
      const a = S.fight(pt, npcs, S.rng(900 + k), { immortal: true, streams: true, maxRounds: 3 }), pick = S.rng(77 + k);
      const b = S.fight(pt, npcs, S.rng(900 + k), { immortal: true, streams: true, maxRounds: 3, inject: { round: 2, fn: w => inject(w, pick) } });
      const tot = f => ({ dealt: f.pcs.reduce((s, p) => s + p.st.dealt, 0), taken: f.pcs.reduce((s, p) => s + p.st.taken + p.st.guardCredit, 0) });
      const A = tot(a), B = tot(b); diffs.push((B.dealt - A.dealt) + (A.taken - B.taken));
    }
    return mean(diffs); };
  const onNpc = n => (w, pick) => { const list = w.foes.filter(x => !x.dead), f = list[Math.floor(pick() * list.length)]; if (f) f.cond.slowed = n; };
  const onPc = (cls, n) => (w, pick) => { const list = w.pcs.filter(p => !p.down && p.build.name.startsWith(cls)), p = list[Math.floor(pick() * list.length)]; if (p) p.cond.slowed = n; };
  for (const [name, inj, who] of [["Slowed 1 on a Standard", onNpc(1), "npc"], ["Slowed 2 on a Standard", onNpc(2), "npc"], ["Slowed 1 on a Paladin (what it costs the party)", onPc("Paladin", 1), "pc"], ["Slowed 1 on an Archer", onPc("Archer", 1), "pc"]]) {
    const a = pair(["today"], TODAY, inj), b = pair(["r"], R_RULES, inj, O);
    const n = /Slowed (\d)/.exec(name)[1];
    L.push(`| ${name} | ${f1(who === "pc" ? -a : a)} | ${f1(who === "pc" ? -b : b)} | ${pc(n / 5)} / ${pc(n / 4)} |`);
  }
  L.push("", "**Minions:** today a Minion has 3 AP (its whole turn: move and strike). Under 4 + 1 AP the choices are 3 AP (three quarters of a Standard's turn instead of three fifths) or 2 AP + 1 Reaction AP. The 2 Standards + 8 Minions fight at the rework's factors:", "", "| Minions' AP | rounds · lost · Down · won |", "|---|---|");
  for (const [name, m] of [["3 AP (today's)", 3], ["2 AP (+ 1 Reaction AP)", 2]]) { setRules({ ...R_RULES, minionAp: m }); L.push(`| ${name} | ${cell(both(["r", "rRolling"], [["standard", 2], ["minion", 8]], F, RUNS, 17, O))} |`); }
  L.push("", "In the model a Minion's one Strike costs its AP after 1 AP for moving: with 3 AP it strikes after up to two Advances, with 2 AP after one; a Minion that has to walk two Advances loses its Strike.", "");
  log("8. Slowed and Minions");

  // 9. The Standard day.
  L.push("## 9. The Standard day (easy, normal, normal, hard)", "", `${DAYS} days of the Double Shot party with no Rest (the day model of report.md: Rally Points between fights, Steel Yourself below 35%, Lay On Hands none in this party): today's rules against the rework at its factors.`, "",
    "| Rules | Day cleared | A PC Down during the day | Downs a day | Rally Points left | Health at the end | Fight 4 (2 Elites + 2 Standards) won |", "|---|---:|---:|---:|---:|---:|---:|");
  const DAY = [[["standard", 2], ["minion", 4]], [["standard", 4]], [["elite", 1], ["standard", 2]], [["elite", 2], ["standard", 2]]];
  for (const [name, key, rules, Fd, Od] of [["Today", "today", TODAY, {}, {}], ["The rework at its factors", "r", R_RULES, F, O]]) {
    setRules(rules);
    const party = partyOf(key, Od), days = [];
    for (let k = 0; k < DAYS; k++) days.push(S.day(party, DAY.map(d => enc(d, Fd)), S.rng(500 + k)));
    const cleared = mean(days.map(d => (d.cleared ? 1 : 0))), anyDown = mean(days.map(d => (d.pcs.some(p => p.st.downs > 0) ? 1 : 0))), downs = mean(days.map(d => d.pcs.reduce((s, p) => s + p.st.downs, 0)));
    const rp = mean(days.map(d => mean(d.pcs.map(p => p.rallyLeft / p.build.rallyPoints)))), hp = mean(days.map(d => mean(d.pcs.map(p => 1 - Math.min(1, p.damage / p.build.pool)))));
    const f4 = days.filter(d => d.fights.length === 4), won4 = mean(f4.map(d => (d.fights[3].won ? 1 : 0)));
    L.push(`| ${name} | ${pc(cleared)} | ${pc(anyDown)} | ${f2(downs)} | ${pc(rp)} | ${pc(hp)} | ${pc(won4)} (reached in ${pc(f4.length / days.length)}) |`);
  }
  L.push("");
  log("9. the day");

  // 10. The Specials' arithmetic.
  const sd = S.npcOf("standard", "medium", 1), basic = S.npcStrikeAvg(sd, 13);
  L.push("## 10. A Standard's turn and the Special multipliers (arithmetic)", "", `A Medium Standard's Basic attack against AD 13 averages ${f1(basic)} (a second one in the turn, with its At-will Bane, about ${f1(basic * 0.9)}). The Bestiary's Special multipliers (1 AP Round × 1.4, 2 AP Round × 2.2, 3 AP Encounter × 3.5) are on the Basic attack's average damage. The turn as the Bestiary's tables see it:`, "",
    "| AP a turn | A full turn (Basic attacks and a 2 AP Special, 1 AP to move) | In Basic attacks | With a 3 AP Special |", "|---|---|---:|---:|",
    "| 5 (today) | Basic + Basic (1 Bane) + 2 AP Special + move | 1 + 0.9 + 2.2 = 4.1 | 3 AP Special + Basic + move: 3.5 + 1 = 4.5 |",
    "| 4 (the rework) | Basic + 2 AP Special + move | 1 + 2.2 = 3.2 (−22%) | 3 AP Special + move: 3.5 (−22%) |",
    "| 4, no move | Basic + Basic (1 Bane) + 2 AP Special | 4.1 (the same as today) | 3 AP Special + Basic: 4.5 |", "",
    "The ruler's NPCs make their 2 Basic attacks a turn (the tables' 'deals about'; Specials are not simulated) with 1 AP for moving: at 4 AP a Standard still strikes twice when it doesn't move far, so the model's NPC damage a turn hardly changes (section 2: the NPC AP column), and the Health factor of section 3 carries the whole cut. For the sheet: keep the multipliers (an AP is worth the same, a 3 AP Special is now the whole turn) or scale them to the 4 AP turn (× 1.25: 1.75 / 2.75 / 4.4).", "");
  setRules({});
  return L.join("\n");
}

/* ------------------------------------------------------------------ part 2: the decision sheet's numbers */
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const SHEET = { ...R_RULES, npcSpecials: 1, apGuard: 2, escHooks: true, oaDisrupt: false };   // oaDisrupt: Lucas 2026-11-04 (item 6: no Critical disrupt on the basic Opportunity Attack)   // the rework as decided (section 12), with the Specials at the book's multipliers
const START1 = k => (k % 2 ? 1 : 2);                                         // every fight starts at Escalation 1 (Momentum: 2): half the fights with Momentum
const LN = { line: true };
export function sheet() {
  const L = [], keys = ["r", "rRolling"];
  const at = (rules, start) => { setRules(rules); START = start; };
  L.push("# The playtest 2 rework, part 2: the decision sheet's numbers", "",
    "Written by `node book/ruler/rework.mjs --sheet`; don't edit, run it again. Read by `archive/book-drafts/rework-r.md` section 14. Part 1's numbers: `rework.md`.", "",
    `Runs: ${RUNS} fights a measurement, ${CAL} a calibration step. **The party:** the 4 AP builds of \`rework/\` (2 Smite Paladins + 2 Archers, Double Shot and Rolling Shot, each number the mean of the two parties), level 1, Human. **The rework as decided** (archive/book-drafts/rework-r.md section 12) = 4 + 1 AP for PCs and NPCs, Escalation as a level; **the Health line** (Paladin Vigor 23 / Resolve 12 = 35, Archer 19 / 10 = 29; Rally Points = Rally + Stage: 7 and 6; today's builds: 40 and 27); **Escalation from 1** (Momentum 2: half the fights) with **the hooks** (a Critical, about 1 in 12 Tier 3s: +1 once an encounter; the Paladin: an ally within 5 squares becomes Bloodied or goes Down; the Archer: its Marked Quarry goes Down; each once an encounter); **Guard from unspent AP** (2 per turn AP left at the end of the turn, until the start of the next; the Reaction AP never converts; the AP that become Guard no longer pay Reactions unless said); **the Specials** (each NPC spends every AP left after moving on attacks: the 3 AP Encounter Special once (Elites), the Round Special once a round (Minions and Grunts 1 AP × 1.4, Standards and Elites 2 AP × 2.2), then Basic attacks with the At-will Bane, 3 Strikes at most; a Special is modeled as a single-target Strike with the multiplied damage: its condition, area or Save are its damage's worth, as the Bestiary prices them).`, "");
  const t1 = Date.now();

  // 1. An NPC's turn with its Specials (arithmetic).
  const npc1 = role => S.npcOf(role, "medium", 1), strike = (n, ad, banes = 0) => { const p = C.tierProbs(n.mod, ad, 0, banes, ""); return p[1] * n.t2 + p[2] * n.t3; };
  L.push("## 1. An NPC's turn with its Specials (arithmetic, AD 13)", "", "Damage a turn against one PC at AD 13: the Bestiary's Strikes (the calibration so far: 2 Basic attacks, 3 for an Elite, 1 for a Minion), and every AP on attacks with the Specials, standing next to its target or after 1 AP of movement. A Basic attack's 2nd and 3rd uses take the At-will Bane.", "",
    "| Role (AP) | Basic attack | The Bestiary's Strikes | Specials × 1 (the book), no move · after a move | Specials × 1.25, no move · after a move | ratio to the Strikes (× 1, no move) |", "|---|---:|---:|---|---|---:|");
  for (const role of ["minion", "grunt", "standard", "elite"]) {
    const n = npc1(role), ap = role === "minion" ? 3 : 4, b0 = strike(n, 13), k = KIT[role];
    const strikes = Array.from({ length: n.strikes }, (_, i) => strike(n, 13, i)).reduce((a, x) => a + x, 0);
    const turn = (apLeft, scale, first = true) => { let d = 0, basics = 0, s = 0, encU = !first; let a = apLeft, rnd = false;
      while (s < 3 && a > 0) { if (k.enc && !encU && a >= k.enc.ap) { d += b0 * k.enc.mult * scale; a -= k.enc.ap; encU = true; } else if (!rnd && a >= k.round.ap) { d += b0 * k.round.mult * scale; a -= k.round.ap; rnd = true; } else { d += strike(n, 13, basics++); a--; } s++; }
      return d; };
    const e = role === "elite" ? " (the Encounter Special's turn · a later turn)" : "";
    const cellT = sc => role === "elite" ? `${f1(turn(ap, sc))} / ${f1(turn(ap, sc, false))} · ${f1(turn(ap - 1, sc))} / ${f1(turn(ap - 1, sc, false))}` : `${f1(turn(ap, sc))} · ${f1(turn(ap - 1, sc))}`;
    L.push(`| ${n.name} (${ap})${e} | ${f1(b0)} | ${f1(strikes)} | ${cellT(1)} | ${cellT(1.25)} | × ${f2(turn(ap, 1, false) / strikes)} |`);
  }
  L.push("");

  // 2. The fights, piece by piece.
  L.push("## 2. The fights, piece by piece", "", "The CV 4 encounters (rounds · the party's Health lost · a PC goes Down · won), NPC Health and damage as the Bestiary has them (no factor); each column adds one piece to the one before. **Part 1** = the rework of part 1 (4 + 1 AP, Escalation as a level from 0, Momentum 1 in half the fights, today's Health).", "");
  const PIECES = [
    ["Part 1", { ...R_RULES }, null, {}],
    ["+ the Health line", { ...R_RULES }, null, LN],
    ["+ Escalation from 1, hooks", { ...R_RULES, escHooks: true }, START1, LN],
    ["+ Guard from unspent AP", { ...R_RULES, escHooks: true, apGuard: 2 }, START1, LN],
    ["+ the Specials (× 1)", SHEET, START1, LN],
    ["the Specials × 1.25 instead", { ...SHEET, npcSpecials: 1.25 }, START1, LN],
  ];
  L.push(`| Encounter | ${PIECES.map(v => v[0]).join(" | ")} |`, `|---|${PIECES.map(() => "---").join("|")}|`);
  const P = {};
  for (const [name, list] of MAIN) { L.push(`| ${name} | ${PIECES.map(([vn, rules, st, o]) => { at(rules, st); const r = both(keys, list, {}, RUNS, 17, o); (P[vn] ??= {})[name] = r; return cell(r); }).join(" | ")} |`); }
  const taken = r => mean(r.rs.map(x => mean(x.out.map(f => f.pcs.reduce((s2, p) => s2 + p.st.taken, 0)))));
  L.push("", "The 4 Standards fight, per fight (all 4 PCs):", "", `| | ${PIECES.map(v => v[0]).join(" | ")} |`, `|---|${PIECES.map(() => "---:").join("|")}|`);
  const prow = (label, fn) => L.push(`| ${label} | ${PIECES.map(v => fn(P[v[0]]["4 Standards (4)"])).join(" | ")} |`);
  prow("Party damage dealt · a PC turn", r => `${f1(r.dealt)} · ${f1(r.dealt / r.turns)}`);
  prow("Damage taken (after Guard and blocks)", r => f1(taken(r)));
  prow("PC turns at Escalation 0 / 1 / 2 / 3", r => r.escTurns.map(f1).join(" / "));
  L.push("", "Guard from unspent AP changes nothing here: the plans spend every AP (section 4 prices it with turns that hold one).", "");
  log("S2. the pieces");

  // 3. Escalation from 1 with the hooks.
  at(SHEET, START1);
  const S3 = P["+ the Specials (× 1)"]["4 Standards (4)"];
  const reach = (R0, k, sel) => mean(R0.rs.flatMap(r => r.out.filter(sel).flatMap(f => f.pcs.map(p => (p.st.escTurns.slice(k).some(x => x > 0) ? 1 : 0)))));
  const turnsAt = (R0, k, sel) => mean(R0.rs.flatMap(r => r.out.filter(sel).flatMap(f => f.pcs.map(p => p.st.escTurns.slice(k).reduce((s2, x) => s2 + x, 0)))));
  const mom = (f, i) => i % 2 === 0, noMom = (f, i) => i % 2 === 1, all = () => true;
  const hk = (R0, cls, key) => mean(R0.rs.flatMap(r => r.out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => p.st[key]))));
  L.push("## 3. Escalation from 1, with the hooks", "", "The 4 Standards fight with every piece (column 5 of section 2). An Apex (Encounter, needs Escalation 3) is usable in the fights where the PC has a turn at 3:", "",
    "| Per PC | all fights | with Momentum (starts at 2) | without (starts at 1) | Part 1 (starts at 0, Momentum 1), all fights |", "|---|---:|---:|---:|---:|");
  const P1 = P["Part 1"]["4 Standards (4)"];
  for (const k of [2, 3]) L.push(`| A turn at Escalation ${k} or more · such turns a fight | ${pc(reach(S3, k, all))} · ${f2(turnsAt(S3, k, all))} | ${pc(reach(S3, k, mom))} · ${f2(turnsAt(S3, k, mom))} | ${pc(reach(S3, k, noMom))} · ${f2(turnsAt(S3, k, noMom))} | ${pc(reach(P1, k, all))} · ${f2(turnsAt(P1, k, all))} |`);
  const S3n = P["+ the Health line"]["4 Standards (4)"];
  L.push("", `**The hooks, per PC a fight:** the Critical hook fires ${f2(hk(S3, "Paladin", "hookCrit"))} times for a Paladin and ${f2(hk(S3, "Archer", "hookCrit"))} for an Archer (it can't fire twice); the Paladin's hook (an ally within 5 squares Bloodied or Down) ${f2(hk(S3, "Paladin", "hookClass"))}; the Archer's (its Marked Quarry goes Down) ${f2(hk(S3, "Archer", "hookClass"))}. A hook is used only when it raises the Escalation (at 3 it waits), so these are raises.`, "");
  log("S3. Escalation");

  // 4. Guard from unspent AP.
  const byCls = (R0, cls, key, per = false) => mean(R0.rs.flatMap(r => r.out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith(cls)).map(p => (per ? p.st[key] / Math.max(1, p.st.rounds) : p.st[key])))));
  const holdP = x => x.replace(/^turn Main: Divine Surge, Smite 2, Weapon Attack, Weapon Attack$/m, "turn Main: Divine Surge, Smite 2, Weapon Attack");
  const holdA = x => x.replace(/^turn Pin: .*$/m, "turn Pin: Double Shot 2, Lock & Loose");
  L.push("## 4. Guard from unspent AP", "", "The 4 Standards fight with every piece, NPCs as the Bestiary has them. The plans spend every AP, so an AP is left only when a step can't be made; to price the rule, a **hold** turn keeps one AP: the Paladins' main turn drops its second Weapon Attack (Divine Surge, Smite 2, Weapon Attack), the Archers' drops Pinning Shot (Double Shot 2, Lock & Loose). Per PC a fight; party = all 4 PCs.", "",
    "| Rule and plan | rounds · lost · Down · won | AP left a turn (Paladin · Archer) | Guard gained · used a fight (Paladin / Archer) | Reactions a fight (Paladin · Archer) | Party dealt · taken |", "|---|---|---|---|---|---|");
  const G4 = {};
  for (const [name, rules, o] of [["Guard 2 an AP, the plans (every AP spent)", SHEET, LN], ["Paladins hold an AP, no Guard (part 1's rule: the AP pays Reactions)", { ...SHEET, apGuard: 0 }, { ...LN, edits: { "paladin-smite-r1": holdP } }], ["Paladins hold an AP, Guard 2 (the AP is gone)", SHEET, { ...LN, edits: { "paladin-smite-r1": holdP } }], ["Paladins hold, Guard 2, and the kept AP may still pay a Reaction (losing its Guard)", { ...SHEET, apGuardKeep: true }, { ...LN, edits: { "paladin-smite-r1": holdP } }], ["Paladins hold, Guard 3 (Stage 2's value)", { ...SHEET, apGuard: 3 }, { ...LN, edits: { "paladin-smite-r1": holdP } }], ["Archers hold an AP, Guard 2", SHEET, { ...LN, edits: { "archer-double-r1": holdA, "archer-rolling-r1": x => x.replace(/^turn Main: .*$/m, "turn Main: Rolling Shot 2, Lock & Loose") } }]]) {
    at(rules, START1); const r = both(keys, [["standard", 4]], {}, RUNS, 17, o); G4[name] = r;
    L.push(`| ${name} | ${cell(r)} | ${f2(byCls(r, "Paladin", "apLeft", true))} · ${f2(byCls(r, "Archer", "apLeft", true))} | ${f1(byCls(r, "Paladin", "apGuardGiven"))} · ${f1(byCls(r, "Paladin", "apGuardUsed"))} / ${f1(byCls(r, "Archer", "apGuardGiven"))} · ${f1(byCls(r, "Archer", "apGuardUsed"))} | ${f2(byCls(r, "Paladin", "reactions"))} · ${f2(byCls(r, "Archer", "reactions"))} | ${f1(r.dealt)} · ${f1(taken(r))} |`);
  }
  L.push("", "For scale: 1 AP is worth 5.8 DE at 4 AP (part 1, section 2), a Weapon Attack about 5.4, the second one in a turn (its At-will Bane) about 4.5.", "");
  log("S4. Guard");

  // 5. The Bestiary's factors.
  L.push("## 5. The Bestiary's factors: a quarter, 30% or a third of the party's Health", "", `Every piece on (the Health line is the PCs' and stays): the NPC Health factor **h** for which 4 Standards last ${ROUNDS} rounds, then the NPC damage factor **d** (on the Basic attack tables, so on the Specials too) for which the fight costs the party the target share of its Health (bisection, alternating twice). Once with the book's Special multipliers, once with them × 1.25.`, "",
    "| Specials | Target | NPC Health × h | NPC damage × d | 4 Standards at these factors | Party damage taken a fight | Downs a fight: a Paladin · an Archer |", "|---|---|---:|---:|---|---:|---|");
  const calib2 = (rules, target) => { at(rules, START1); let h = 1, d = 0.7; for (let it = 0; it < 2; it++) { h = solve(x => both(keys, [["standard", 4]], { h: x, d }, CAL, 17, LN).rounds, ROUNDS, 0.5, 2); d = solve(x => both(keys, [["standard", 4]], { h, d: x }, CAL, 17, LN).lost, target, 0.25, 1.6); } return { h, d }; };
  const FIT = {};
  const downsBy = (r, cls) => mean(r.rs.map(x => x.by(cls).downs));
  for (const [sn, rules] of [["× 1 (the book)", SHEET], ["× 1.25", { ...SHEET, npcSpecials: 1.25 }]]) for (const target of [0.25, 0.3, 0.33]) {
    const f = calib2(rules, target); FIT[`${sn}|${target}`] = { ...f, rules };
    at(rules, START1); const r = both(keys, [["standard", 4]], f, RUNS, 17, LN);
    L.push(`| ${sn} | ${pc(target)} | ${f2(f.h)} | ${f2(f.d)} | ${cell(r)} | ${f1(taken(r))} | ${f2(downsBy(r, "Paladin"))} · ${f2(downsBy(r, "Archer"))} |`);
    log(`S5. fitted ${sn} ${target}`);
  }
  { const f0 = FIT["× 1 (the book)|0.25"]; at(SHEET, START1); const d = solve(x => both(keys, [["standard", 4]], { h: f0.h, d: x }, CAL, 17, LN).down, 0.1, 0.25, 1.2); FIT.down10 = { h: f0.h, d, rules: SHEET };
    const r = both(keys, [["standard", 4]], FIT.down10, RUNS, 17, LN);
    L.push(`| × 1 (the book) | a Down in 1 fight of 10 | ${f2(f0.h)} | ${f2(d)} | ${cell(r)} | ${f1(taken(r))} | ${f2(downsBy(r, "Paladin"))} · ${f2(downsBy(r, "Archer"))} |`); log("S5. fitted Down 10%"); }
  L.push("", `With the factors, a Medium Standard has ${npc1("standard").pool} × h Health and a Basic attack of ${npc1("standard").t2} / ${npc1("standard").t3} × d.`, "");
  L.push("**Fights by CV at the book's Special multipliers** (the Bestiary's targets so far: easy 2.5 rounds / 20%, normal 3.5 / a third, hard 4.5-5 / half, deadly 6 / half to three quarters):", "", "| Encounter | a quarter | 30% | a third |", "|---|---|---|---|");
  const CVR = {};
  for (const [name, list] of ENCOUNTERS) L.push(`| ${name} | ${[0.25, 0.3, 0.33].map(t => { const f = FIT[`× 1 (the book)|${t}`]; at(f.rules, START1); const r = both(keys, list, f, RUNS, 17, LN); (CVR[t] ??= {})[name] = r; return cell(r); }).join(" | ")} |`);
  L.push("");
  log("S5. by CV");

  // 6. The Hallmark Reaction's budget: Shield of Faith's size.
  const DF = FIT["× 1 (the book)|0.25"];   // the sheet's default target (archive/book-drafts/rework-r.md section 14)
  L.push("## 6. The Hallmark Reaction: Shield of Faith's size", "", `The 4 Standards fight at the default factors (a quarter of the Health: h ${f2(DF.h)}, d ${f2(DF.d)}), every piece on; both Paladins with the Reaction named (the Archers keep Quick Draw). A block takes its dice off one NPC hit on the Paladin or an ally within 5 squares, once per NPC turn. **Worth** = what the Reaction itself did (its damage, the damage its block took off, the damage its Guard absorbed) per Paladin turn, and in AP at 5.8 DE. (A fight to the death can't price it by the party's damage: the NPCs' Health caps it; a Reaction's damage ends the fight sooner.)`, "",
    "| Paladin's Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · its Guard used · its damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |", "|---|---|---:|---|---|");
  let g0 = 0;
  for (const [name, edit] of [["None", x => x.replace(/^reaction .*$/m, "")], ["Opportunity Attack (the basic Reaction)", x => x], ["Shield of Faith 1d4 + [Mod]", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 1d4+[Mod]")], ["Shield of Faith 1d6 + [Mod]", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 1d6+[Mod]")], ["Shield of Faith 1d8 + [Mod] (today's)", sofBlock], ["Shield of Faith 2d6 + [Mod]", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 2d6+[Mod]")], ["Shield of Faith 2d8 + [Mod]", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 2d8+[Mod]")], ["Shield of Faith 1d8 + [Mod], the rest becomes Guard on the target", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 1d8+[Mod] spill")], ["Shield of Faith 2d6 + [Mod], the rest becomes Guard", x => x.replace(/^reaction Opportunity Attack: opportunity$/m, "reaction Shield of Faith: block 2d6+[Mod] spill")]]) {
    at(DF.rules, START1); const r = both(keys, [["standard", 4]], DF, RUNS, 17, { ...LN, edits: { "paladin-smite-r1": edit } });
    const gc = byCls(r, "Paladin", "guardCredit"); if (name === "None") g0 = gc;
    const bl = byCls(r, "Paladin", "blockCredit"), sp = Math.max(0, gc - g0), dm = byCls(r, "Paladin", "reactionDealt"), de = (bl + sp + dm) / byCls(r, "Paladin", "rounds");   // sp: Guard used over the "None" row's (Divine Surge's): the block's rest
    L.push(`| ${name} | ${cell(r)} | ${f2(byCls(r, "Paladin", "reactions"))} | ${f1(bl)} · ${f1(sp)} · ${f1(dm)} | ${f2(de)} · ${f2(de / 5.8)} |`);
  }
  L.push("", "The worth includes what the other PCs gain (a blocked hit on an ally); the Archers' Quick Draw is in every row. A block can't take more than the hit: at these factors a Standard's Basic attack averages " + `${f1(6 * DF.d)} / ${f1(11 * DF.d)} and its 2 AP Special ${f1(6 * DF.d * 2.2)} / ${f1(11 * DF.d * 2.2)}` + ", so bigger dice saturate.", "");
  log("S6. Shield of Faith");

  // 7. The dice cut: two shapes.
  L.push("## 7. The dice cut: the Encounter and Daily ceilings, or × 0.75 on everything", "", "**A. Ceilings:** an Encounter Action's dice (besides [W] and [Mod]) at most its AP on Tier 2 and its AP + 1 on Tier 3 (a Daily: one more each); in these builds only Holy Wrath moves (3 AP: 3d8 / 5d8 / 7d8 → 2d8 / 3d8 / 4d8; 2 AP: 2d6 / 3d8 / 4d8 → 1d8 / 2d8 / 3d8). **B. × 0.75:** every damage the PCs deal × 0.75 (weapon, dice, Modifier). Both at the default factors (a quarter); then h re-fitted so the fight lasts 3.5 rounds again.", "");
  const HW = x => x + "\naction Holy Wrath 3 | ap 3 | encounter | traits divine strike weapon | vs ad | tiers [B] 1[W] + [M] 2d8 Ho / [B] 1[W] + [Mod] + [M] 3d8 Ho / [B] 1[W] + [Mod] + [M] 4d8 Ho\naction Holy Wrath 2 | ap 2 | encounter | traits divine strike weapon | vs ad | tiers [B] 1[W] + [M] 1d8 Ho / [B] 1[W] + [Mod] + [M] 2d8 Ho / [B] 1[W] + [Mod] + [M] 3d8 Ho\n";
  const SHAPES = [["None (today's dice)", LN], ["A. Ceilings", { ...LN, edits: { "paladin-smite-r1": HW } }], ["B. × 0.75", { ...LN, dmg: 0.75 }]];
  setRules(SHEET);
  const pal = o => partyOf("r", o)[0], arc = o => partyOf("r", o)[2];
  L.push("| Shape | Paladin main turn · Nova (Def 13, Esc 3) | Archer main turn | 4 Standards at the default factors | h for 3.5 rounds | 4 Standards at that h | The Nova's share of a Paladin's damage |", "|---|---|---|---|---:|---|---:|");
  for (const [name, o] of SHAPES) {
    const pb = pal(o), ab = arc(o), pm = S.turnDamage(pb, "main", 13).avg, pn = S.turnDamage(pb, "nova", 13).avg, am = S.turnDamage(ab, "pin", 13).avg;
    at(DF.rules, START1); const r = both(keys, [["standard", 4]], DF, RUNS, 17, o);
    const h = solve(x => both(keys, [["standard", 4]], { h: x, d: DF.d }, CAL, 17, o).rounds, ROUNDS, 0.4, 2);
    const r2 = both(keys, [["standard", 4]], { h, d: DF.d }, RUNS, 17, o);
    const nova = mean(r2.rs.map(x => mean(x.out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith("Paladin")).map(p => p.st.novaDealt / Math.max(1, p.st.dealt))))));
    L.push(`| ${name} | ${f1(pm)} · ${f1(pn)} | ${f1(am)} | ${cell(r)} | ${f2(h)} | ${cell(r2)} | ${pc(nova)} |`);
  }
  L.push("");
  log("S7. the dice cut");

  // 8. The Health line at levels 1, 5 and 8 (arithmetic).
  L.push("## 8. The Health line at levels 1, 5 and 8 (arithmetic)", "", "Human, high on Vigor. **Today** = the book's thresholds with today's Attributes (they don't grow) × (Level + 17) / 16. A Standard's turn = the Bestiary's 2 Basic attacks against the PC's AD (Paladin 14, Archer 13) with today's Stage rows, before any factor; **turns to Down** = Health ÷ that.", "",
    "| Level | Paladin today · the line | Archer today · the line | Party (2 + 2) today · the line | A Standard's turn (vs AD 14 · 13) | Standard turns to Down the Paladin · the Archer (the line) | Rally Point heal (the line: Paladin · Archer) |", "|---:|---|---|---|---|---|---|");
  const today = (body, mind, bm, mm, sb, sm, lv) => Math.ceil(((body + 2) * bm + sb) * (lv + 17) / 16) + Math.ceil(((mind + 2) * mm + sm) * (lv + 17) / 16);
  for (const lv of [1, 5, 8]) {
    const pT = today(2, 1, 4, 4, 3, 4, lv), aT = today(1, 1, 3, 2.5, 3, 4, lv), pv = lineValues("Paladin", lv), av = lineValues("Archer", lv), pL = pv.vigor + pv.resolve, aL = av.vigor + av.resolve;
    const n = S.npcOf("standard", "medium", lv), st14 = strike(n, 14) + strike(n, 14, 1), st13 = strike(n, 13) + strike(n, 13, 1);
    L.push(`| ${lv} | ${pT} · **${pL}** (${pv.vigor} / ${pv.resolve}) | ${aT} · **${aL}** (${av.vigor} / ${av.resolve}) | ${2 * pT + 2 * aT} · ${2 * pL + 2 * aL} | ${f1(st14)} · ${f1(st13)} | ${f1(pL / st14)} · ${f1(aL / st13)} (today ${f1(pT / st14)} · ${f1(aT / st13)}) | ${Math.ceil(pL / 4)} · ${Math.ceil(aL / 4)} |`);
  }
  L.push("", `A Standard's Health by Stage (today's rows): ${[1, 5, 8].map(lv => S.npcOf("standard", "medium", lv).pool).join(" / ")}; its Basic attack ${[1, 5, 8].map(lv => `${S.npcOf("standard", "medium", lv).t2} / ${S.npcOf("standard", "medium", lv).t3}`).join(" → ")}.`, "");
  // The healing and Guard cards against the pools.
  L.push("**Healing, Guard and blocks against the pools** (level 1; average amount and its share of the Paladin's · the Archer's Health, today → the line):", "", "| Card | Average | Paladin 40 → 35 | Archer 27 → 29 |", "|---|---:|---|---|");
  for (const [name, avg] of [["A Rally Point (a quarter of the pool; Lay On Hands spends them)", null], ["Mending Light (start of turn, [PMod] + 1)", 3], ["Divine Surge's Guard (2d6)", 7], ["Smite 3's Guard (1d8 + [PMod])", 6.5], ["Shield of Faith (block 1d8 + [PMod])", 6.5], ["Bulwark of Faith (block 9)", 9], ["Guard from 1 unspent AP (Stage 1)", 2]])
    L.push(avg == null ? `| ${name} | 10 · 7 → 9 · 8 | 25% → 25% | 25% → 25% |` : `| ${name} | ${f1(avg)} | ${pc(avg / 40)} → ${pc(avg / 35)} | ${pc(avg / 27)} → ${pc(avg / 29)} |`);
  L.push("");
  // 9. The Archer's Hallmark Reaction: what makes a Weapon Attack Reaction worth 1 AP (Lucas's question on item 9).
  L.push("## 9. The Archer's Reaction: bigger hits or a trigger that comes more often", "", `The 4 Standards fight at the default factors (h ${f2(DF.h)}, d ${f2(DF.d)}), every piece on; the Paladins keep Opportunity Attack; both Archers take the Reaction named. **Quick Draw** = a Trigger when an enemy within 5 squares moves closer (the stand-in); **Overwatch** = a Trigger after an enemy within 10 squares makes a Strike (once per NPC turn). **Worth** = the Reaction's own damage per Archer turn, and in AP (5.8 DE).`, "",
    "| The Archer's Reaction | rounds · lost · Down · won | Reactions a fight (an Archer) | Its damage a fight (an Archer) | Worth an Archer turn (DE · AP) |", "|---|---|---:|---:|---|");
  const QS = (tiers, extra = "") => x => x + `\naction Quick Shot | ap 1 | traits ranged shot strike weapon${extra} | vs ad | tiers ${tiers}\n`;
  const rx = (line, act) => x => x.replace(/^reaction .*$/m, line ? `reaction ${line}` : "") + (act ? act("") : "");
  for (const [name, edit] of [["None", rx(null)], ["Quick Draw: a Weapon Attack (1[W])", x => x], ["Quick Draw with 2[W]", rx("Quick Draw: quick-draw with Quick Shot", QS("0 / [B] 2[W] + [Mod] / [B] 2[W] + [Mod]"))], ["Quick Draw, Empowered 2 (+2 a die)", rx("Quick Draw: quick-draw with Quick Shot", QS("0 / [B] 1[W] + [Mod] + 2 / [B] 1[W] + [Mod] + 2"))], ["Quick Draw with 1 Boon", rx("Quick Draw: quick-draw with Weapon Attack (+1 boon)")], ["Overwatch: a Weapon Attack", rx("Overwatch: overwatch")], ["Overwatch with 2[W]", rx("Overwatch: overwatch with Quick Shot", QS("0 / [B] 2[W] + [Mod] / [B] 2[W] + [Mod]"))]]) {
    at(DF.rules, START1); const r = both(keys, [["standard", 4]], DF, RUNS, 17, { ...LN, edits: { "archer-double-r1": edit, "archer-rolling-r1": edit } });
    const de = byCls(r, "Archer", "reactionDealt") / byCls(r, "Archer", "rounds");
    L.push(`| ${name} | ${cell(r)} | ${f2(byCls(r, "Archer", "reactions"))} | ${f1(byCls(r, "Archer", "reactionDealt"))} | ${f2(de)} · ${f2(de / 5.8)} |`);
  }
  L.push("", "**Action compression** (arithmetic): a Reaction that makes your next turn's first 1 AP Action cost 0 is worth 1 AP each time it fires; at Quick Draw's rate (about 1.5 fires in 3.5 turns) that is 0.43 AP a turn, a little over Quick Draw's Weapon Attack: the trigger's frequency, not the effect's kind, is what keeps a Reaction under 1 AP.", "");
  log("S9. the Archer's Reaction");

  // 10. Divine Surge and Vanish as Escalation 1 Passives (Lucas's question on item 15): every fight starts at Escalation 1, so they are on from turn 1.
  L.push("## 10. Divine Surge and Vanish as Escalation 1 Passives", "", `The 4 Standards fight at the default factors, every piece on (every fight starts at Escalation 1, so an Escalation 1 Passive works from the first turn). Divine Surge is already in every Paladin turn (0 AP, every round): its worth is the allies' extra damage it gives plus the Guard it absorbs. Vanish (Evade 2 and +1 Defense for 1 round, 0 AP) is added at the end of each Archer turn: its worth is the damage the Archers take less (and they keep their AP). Per turn of its owner; for scale, part 1's Escalation Passives: Radiant Zeal +3.5 damage a turn, Killer's Focus +2.7, Marked Quarry +3.9, Hallowed Stance 0.8, Elusive 0.2, Font of Mercy 0.3.`, "",
    "| | rounds · lost · Down · won | Worth a turn of its owner (DE · AP) | How |", "|---|---|---|---|");
  { at(DF.rules, START1); const r = both(keys, [["standard", 4]], DF, RUNS, 17, LN), t = byCls(r, "Paladin", "rounds"), su = byCls(r, "Paladin", "surgeCredit"), gu = byCls(r, "Paladin", "guardCredit");
    L.push(`| Divine Surge (Paladin) | ${cell(r)} | ${f2((su + gu) / t)} · ${f2((su + gu) / t / 5.8)} | ${f1(su)} allies' damage + ${f1(gu)} Guard used a fight |`);
    const noS = x => x.replace(/^(turn [^:]+:) Divine Surge, /gm, "$1 ");
    const r0 = both(keys, [["standard", 4]], DF, RUNS, 17, { ...LN, edits: { "paladin-smite-r1": noS } });
    L.push(`| Without Divine Surge | ${cell(r0)} | | the same fight with no Divine Surge in the turns |`);
    const vA = x => x.replace(/^(turn (?:Main|Pin|Kite|Main with the step|Main with the long roll): .*)$/gm, "$1, Vanish");
    const r1 = both(keys, [["standard", 4]], DF, RUNS, 17, { ...LN, edits: { "archer-double-r1": vA, "archer-rolling-r1": vA } });
    const tk0 = byCls(r, "Archer", "taken"), tk1 = byCls(r1, "Archer", "taken"), ta = byCls(r1, "Archer", "rounds");
    L.push(`| Vanish at the end of each Archer turn | ${cell(r1)} | ${f2((tk0 - tk1) / ta)} · ${f2((tk0 - tk1) / ta / 5.8)} | an Archer takes ${f1(tk1)} a fight instead of ${f1(tk0)} |`); }
  L.push("");
  log("S10. the Escalation 1 Passives");
  START = null; setRules({});
  L.push(`(${((Date.now() - t1) / 60000).toFixed(0)} minutes.)`);
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1]) && process.argv.includes("--sheet")) {
  const text = sheet();
  fs.writeFileSync(HERE + "rework-sheet.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
  log("done");
} else if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = run();
  fs.writeFileSync(HERE + "rework.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
  log("done");
}
