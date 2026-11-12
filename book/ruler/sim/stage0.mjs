// Stage 0 (levels 1 to 3) as the book has it since 2026-11-12 (pack "Stage 0 into the book"): the report. Writes book/ruler/stage0.md.
//   node book/ruler/sim/stage0.mjs   (about 8 minutes; --quick 3)
// The rules: core.mjs RULES_S0 (Escalation 1 to 6, Momentum 0 to 4, no Opportunity Attack, a [Ranged] Action while Engaged is Doomed), the weapon table of
// Chapter 15, the Bestiary's Stage 0 table (the system's config.mjs npcStage0). The builds: stage0lib.mjs (the R builds cut to decisions-s1.md's level
// lists, until the class cards are written for Stage 0). The prototype this replaces: archive/ruler-old/stage0-prototype/.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { S, FILES, build, party, allCrossbows, enc, ENC, fights, cell, CELL, bisect, npcAt, mean, f1, f2, pc } from "./stage0lib.mjs";
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick"), N = QUICK ? 200 : 600, NM = QUICK ? 120 : 300;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`), TW = S.TW;
const short = r => `${pc(r.lost)} · ${pc(r.down)} · ${pc(r.won)}`, momMix = k => k % 3;   // Momentum 0, 1, 2 in turn

const L = ["# Stage 0: levels 1 to 3 in the ruler", "", "Written by `node book/ruler/sim/stage0.mjs`; don't edit, run it again. Stage 0 as the book has it since 2026-11-12: **Escalation 1 to 6**, a fight starts at 1 + **Momentum** (0 to 4); **no Opportunity Attack**; a [Ranged] Action while Engaged is **Doomed**; the weapon table of Chapter 15 (a flat part plus one small die; melee +4 two-handed, +2 one-handed); **the Bestiary's Stage 0 table** (ready numbers: the system's `config.mjs npcStage0`).", "",
  `Runs: ${N} fights a cell on the open field, ${NM} on a map${QUICK ? " (--quick: a draft)" : ""}. Each fight cell: ${CELL}. The decisions are the plan policy's unless a column says otherwise.`, "",
  "**The builds are not the classes' final Stage 0:** the class cards are still written for the old level lists (card sessions with Lucas come next). Until then the four R builds (Smite and Lay On Hands Paladins with Greatswords, Double Shot and Rolling Shot Archers with Crossbows; Human, 35 and 29 Health, Modifiers +2 / +1, Rally + 1, Guard 2 an unused AP) are cut to `book/decisions-s1.md`'s lists, with the Passives at Escalation 2, 4 and 6, no Apex, no Daily, no Talents:", "",
  "| Level | Paladin (Smite / Lay On Hands) | Archer (Double Shot / Rolling Shot) |", "|---|---|---|",
  "| 1 | Smite or Lay On Hands; Rebuke or Shield of Faith; at Escalation 2: Radiant Zeal / Font of Mercy | Sharpshooter, Mark Quarry; Double Shot or Rolling Shot; Overwatch or Covering Shot; at Escalation 2: Killer's Focus |",
  "| 2 | + the hook (Kindled Wrath); Holy Wrath (Encounter); at Escalation 4: Searing Blows / Mending Light | + the hook (Thrill of the Kill); Pinning Shot (Encounter); at Escalation 4: Hunter's Edge |",
  "| 3 | + at Escalation 6: Reckoning / Hallowed Stance | + at Escalation 6: Finisher |", ""];

// 1. The turns.
L.push("## 1. A turn's damage by level and Escalation", "", "The build's planned turn against Defense 13 (20,000 turns; one target; no Reactions).", "", "| Build | Level | Turn | Escalation 1 | 2 | 4 | 6 |", "|---|---:|---|---:|---:|---:|---:|");
for (const f of FILES) for (const lv of [1, 2, 3]) { const b = build(f, lv), names = [...new Set(b.plan.flatMap(x => x.split("|").map(y => y.trim())))];
  for (const k of names) L.push(`| ${b.name} | ${lv} | ${b.turns[k].name} | ${[1, 2, 4, 6].map(e => f1(S.turnDamage(b, k, 13, { escalation: e }).avg)).join(" | ")} |`); }
log("1. turns");

// 2. The Bestiary's table.
const T = TW.npcStage0, RAT = ["Terrible", "Low", "Medium", "High", "Extreme"], P1 = party(1);
L.push("", "## 2. The Bestiary's Stage 0 table", "", "The book's tables (`foundry/twod12/module/config.mjs npcStage0`). **Health:** an NPC's Vigor or Resolve by rating (the Health Pool is the two added). **Damage:** Tier 2 / Tier 3 as written, the Modifier already in it.", "", "| Role | Vigor or Resolve: " + RAT.join(" / ") + " | Health, both Medium | Basic attack, Medium | Its Round Special, Medium | Deals a turn to a level 1 Paladin (AD 14) / Archer (AD 13) |", "|---|---|---:|---|---|---|");
for (const role of ["minion", "grunt", "standard", "elite"]) { const t = T[role], n = npcAt(role), k = S.specialKey(n.kit.round.mult);
  L.push(`| ${TW.npcRoles[role].label} | ${t.oneHit ? "none: any damage kills it" : t.health.join(" / ")} | ${t.oneHit ? "-" : n.pool} | ${t.basic[2].join(" / ")} | ${t[k][2].join(" / ")} (${n.kit.round.ap} AP) | ${f1(S.npcTurn(n, P1[0]))} / ${f1(S.npcTurn(n, P1[2]))} |`); }
L.push("", "The fit behind it (`node book/ruler/sim/stage0fit.mjs`): over pack R's first row (a Standard with 63 Health in the ruler, a Basic attack of 4 / 7.5), the Health factor **h** for which the normal fight lasts 3.5 rounds, then the damage factor **d** for each of the Bestiary's two targets. As before, the two targets don't meet at one number.", "", "| Level | Momentum | h (3.5 rounds) | d: the fight costs a fifth (Rally Points counted) | d: a PC Down in 1 fight of 5 |", "|---:|---:|---:|---:|---:|");
for (const lv of [1, 2, 3]) for (const mom of [0, 2]) { const P = party(lv), n = QUICK ? 200 : 400;
  const h = bisect(x => fights(P, enc(ENC.normal, { h: x }), { mom, n, seed: 23 }).rounds, 3.5, 0.5, 1.6), d = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n, seed: 23 }).cost, 0.2, 0.4, 1.8), d2 = bisect(x => fights(P, enc(ENC.normal, { h, d: x }), { mom, n, seed: 23 }).down, 0.2, 0.4, 1.8);
  L.push(`| ${lv} | ${mom} | × ${f2(h)} | × ${f2(d)} | × ${f2(d2)} |`); log(`2. fit level ${lv}, Momentum ${mom}`); }
L.push("", "**The table chosen: Health × 0.95 of that row (a Standard: 30 + 30 = 60) and damage × 0.75**, as ready numbers, on the low side on purpose (Lucas, 2026-11-12: level 1 was too hard, make lower monsters). **Then, with Lucas the same day:** a Standard's Medium 2 AP Special half a step up (4 + 1d6 on Tier 2, was 3 + 1d6; the full step, × 0.80, gives a level 1 party a PC Down in 14% of normal fights and wins the deadly fight 68% of the time); **a Grunt has 3 AP** (with 4, eight Grunts cost a level 1 party 37% of its Health with the Rally Points against 28% for four Standards; with 3: 23%); **a Minion dies to any damage** and has no Reaction AP; **an Elite's Escalation follows the 1-to-6 ladder** (+1 a round and at each phase; its three abilities at 2, 4 and 6).");

// 3. Normal, hard and deadly at levels 1, 2 and 3.
L.push("", "## 3. The fights at levels 1, 2 and 3", "", "| Level | Momentum | 3 Standards (easy) | 4 Standards (normal) | 5 Standards (hard) | 6 Standards (deadly) |", "|---:|---:|---|---|---|---|");
for (const lv of [1, 2, 3]) for (const mom of [0, 2, 4]) { L.push(`| ${lv} | ${mom} | ${["easy", "normal", "hard", "deadly"].map(k => cell(fights(party(lv), enc(ENC[k]), { mom }))).join(" | ")} |`); log(`3. level ${lv}, Momentum ${mom}`); }
L.push("", "**The other normal encounters (CV 400)**, Momentum 0:", "", "| Level | 1 Elite + 2 Standards | 2 Elites | 8 Grunts | 2 Standards + 8 Minions |", "|---:|---|---|---|---|");
for (const lv of [1, 2, 3]) L.push(`| ${lv} | ${[ENC.mixed, [["elite", 2]], ENC.grunts, ENC.minions].map(e => cell(fights(party(lv), enc(e), { mom: 0 }))).join(" | ")} |`);
log("3. mixes");

// 4. Escalation's timing.
L.push("", "## 4. Escalation 1 to 6: where the turns are", "", "The normal fight (4 Standards), the level 3 party. The share of the PCs' turns at each Escalation, by the Momentum the fight starts with.", "", "| Momentum | Starts at | Escalation 1 | 2-3 | 4-5 | 6 | A Passive works: Escalation 2 / 4 / 6 | The fight |", "|---:|---:|---:|---:|---:|---:|---|---|");
for (const mom of [0, 1, 2, 3, 4]) { const r = fights(party(3), enc(ENC.normal), { mom }), h = [0, 1, 2, 3, 4, 5, 6].map(e => r.out.reduce((s, x) => s + x.pcs.reduce((s2, p) => s2 + (p.st.escHist?.[e] ?? 0), 0), 0)), tot = h.reduce((s, x) => s + x, 0) || 1, sh = (...es) => pc(es.reduce((s, e) => s + h[e], 0) / tot);
  L.push(`| ${mom} | ${1 + mom} | ${sh(1)} | ${sh(2, 3)} | ${sh(4, 5)} | ${sh(6)} | ${sh(2, 3, 4, 5, 6)} / ${sh(4, 5, 6)} / ${sh(6)} | ${cell(r)} |`); }
log("4. Escalation");

// 5. The decisions.
L.push("", "## 5. How it is played (level 2, Momentum 0 to 2 in turn)", "", "| Encounter | The plan | The party holds the line | A casual party | The enemies all on the weakest PC |", "|---|---|---|---|---|");
for (const [name, key] of [["3 Standards (easy)", "easy"], ["4 Standards (normal)", "normal"], ["1 Elite + 2 Standards (normal)", "mixed"], ["5 Standards (hard)", "hard"], ["6 Standards (deadly)", "deadly"]]) { const P = party(2), mk = enc(ENC[key]);
  L.push(`| ${name} | ${cell(fights(P, mk, { mom: momMix }))} | ${cell(fights(P, mk, { mom: momMix, policy: S.POLICIES.hold }))} | ${cell(fights(P, mk, { mom: momMix, policy: S.POLICIES.casual }))} | ${cell(fights(P, mk, { mom: momMix, npcPolicy: S.NPC_POLICIES.weakest }))} |`); }
log("5. decisions");

// 6. Ranged against melee.
L.push("", "## 6. Ranged against melee", "", "Level 2, Momentum 0 to 2 in turn. **As built:** two Paladins with Greatswords (0 / 5 + 1d6 / 8 + 1d8) and two Archers with Crossbows (0 / 2 + 1d4 / 4 + 1d4). **All Crossbows:** the Paladins with the Archers' weapon. The gap is closed when the second party is no longer the better one. Fight cells: Health lost · a PC Down · won.", "", "| Map | Normal: as built | Normal: all Crossbows | Deadly: as built | Deadly: all Crossbows | Smite Paladin, damage that counted a turn: Greatsword / Crossbow | ... damage taken a turn |", "|---|---|---|---|---|---|---|");
for (const map of ["open", "pillars"]) { const n = map === "open" ? N : NM, base = party(2), rng = allCrossbows(2);
  const a = fights(base, enc(ENC.normal), { mom: momMix, map, n }), b = fights(rng, enc(ENC.normal), { mom: momMix, map, n }), c = fights(base, enc(ENC.deadly), { mom: momMix, map, n }), d = fights(rng, enc(ENC.deadly), { mom: momMix, map, n });
  L.push(`| ${map} | ${short(a)} | ${short(b)} | ${short(c)} | ${short(d)} | ${f1(a.per(0, "counted"))} / ${f1(b.per(0, "counted"))} | ${f1(a.per(0, "taken"))} / ${f1(b.per(0, "taken"))} |`); log(`6. ${map}`); }

// 7. Maps.
L.push("", "## 7. On the maps (level 2)", "", "| Encounter | Policy | open | corridor | pillars |", "|---|---|---|---|---|");
for (const [name, key] of [["4 Standards (normal)", "normal"], ["6 Standards (deadly)", "deadly"]]) for (const [pn, pk] of [["the plan", "plan"], ["holding the line", "hold"]]) L.push(`| ${name} | ${pn} | ${["open", "corridor", "pillars"].map(m => cell(fights(party(2), enc(ENC[key]), { mom: momMix, map: m, n: NM, policy: S.POLICIES[pk] }))).join(" | ")} |`);
log("7. maps");

// 8. A day with the Momentum ladder.
L.push("", "## 8. A day: Momentum 0 to 4", "", "Four fights with no Rest (easy, normal, normal, hard). **The ladder** (Chapter 2): Momentum +1 after each encounter overcome, -1 when a PC goes Down, 4 at most; a fight starts at Escalation 1 + Momentum (the system's `roundrules.mjs escalationStartAt`, `momentumAfter`). **Flat:** every fight starts at Escalation 1.", "", "| Level | | Fight 1 (easy) | Fight 2 (normal) | Fight 3 (normal) | Fight 4 (hard) | The day cleared |", "|---:|---|---|---|---|---|---|");
for (const lv of [1, 2, 3]) for (const [name, ladder] of [["The ladder", true], ["Flat", false]]) {
  const R = S.rng(41), days = QUICK ? 200 : 500, per = [[], [], [], []], moms = [[], [], [], []]; let cleared = 0;
  for (let k = 0; k < days; k++) { const pcs = party(lv).map(S.pcState); let mom = 0, ok = true;
    for (const [i, key] of ["easy", "normal", "normal", "hard"].entries()) { if (!pcs.some(p => p.damage < p.build.pool)) { ok = false; break; } for (const p of pcs) p.startEsc = S.RR.escalationStartAt(ladder ? mom : 0); const d0 = pcs.reduce((s, p) => s + p.st.downs, 0);
      const r = S.fight(pcs, enc(ENC[key])(), R, { maxRounds: 15 }); per[i].push(r); moms[i].push(ladder ? mom : 0); if (!r.won) { ok = false; break; }
      mom = S.RR.momentumAfter(mom, { overcome: 1, downs: pcs.reduce((s, p) => s + p.st.downs, 0) - d0 }); S.between(pcs); }
    if (ok) cleared++; }
  L.push(`| ${lv} | ${name} | ${per.map((a, i) => (a.length ? `Momentum ${f1(mean(moms[i]))}: ${f1(mean(a.map(x => x.rounds)))} r · ${pc(mean(a.map(x => x.lost)))} · Down ${pc(mean(a.map(x => (x.firstDown ? 1 : 0))))} · won ${pc(mean(a.map(x => (x.won ? 1 : 0))))}` : "-")).join(" | ")} | ${pc(cleared / days)} |`); log(`8. day, level ${lv}, ${name}`); }
L.push("", `(${f1((Date.now() - t0) / 60000)} minutes.)`, "");
fs.writeFileSync(RULER + "stage0.md", L.join("\n"));
