// Pack R-classes (2026-11-04): the rebuilt classes measured under pack R's rules (book/rework-r.md sections 12 and 14, all decided):
// 4 AP + 1 Reaction AP for PCs and NPCs, Escalation as a level from 1 (Momentum 2 in half the fights) with the Critical and class hooks,
// Guard from unspent AP (2 an AP, it can still pay a Reaction), the NPC Specials, Opportunity Attack without the disrupt, the Stage Health
// line (Human, high on Vigor) and the decision sheet's fit (NPC Health × 1, the Basic attack tables × 0.6: item 3). The builds: rework/*.txt
// (the R builds). Writes book/ruler/rclasses.md. Nothing here changes report.md: the rules it moves are spec.mjs RULES, set per run.
//   node book/ruler/rclasses.mjs           writes rclasses.md and prints it (a few minutes)
//   node book/ruler/rclasses.mjs --quick   fewer runs
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL(".", import.meta.url));
const QUICK = process.argv.includes("--quick");
const RUNS = QUICK ? 200 : 800;
const HF = 1.125;
const AP_DE = 5.8;   // 1 AP at 4 AP (rework-r.md part 1, section 2)
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : "-");

/* ------------------------------------------------------------------ the rules and the fit */
const TODAY = { ap: 5, reactionAp: 0, escalation: "spent", npcAp: 5, minionAp: 3, npcReactionAp: 0, npcSpecials: 0, apGuard: 0, apGuardKeep: false, escHooks: false, oaDisrupt: true, bloodiedBanes: false };
const R = { ap: 4, reactionAp: 1, escalation: "level", npcAp: 4, minionAp: 3, npcReactionAp: 1, npcSpecials: 1, apGuard: 2, apGuardKeep: true, escHooks: true, oaDisrupt: false, bloodiedBanes: false };
const FIT = { h: 1, d: 0.6 };   // decision sheet item 3
const setRules = o => Object.assign(S.RULES, TODAY, o);

/* ------------------------------------------------------------------ the PCs: the R builds with the Health line */
const read = file => fs.readFileSync(`${HERE}rework/${file}.txt`, "utf8");
const LINE = { Paladin: [[20, 10], [32, 16], [46, 23]], Archer: [[16, 8], [25, 13], [36, 19]] }, SPECIES = { human: [3, 2] };
const stageOf = lv => (lv >= 8 ? 3 : lv >= 5 ? 2 : 1);
function load(file, edit = x => x) {
  const b = S.parseSpec(edit(read(file)).replace(/^health-factor .*$/m, "") + `\nhealth-factor ${HF}\n`, `rework/${file}`);
  const cls = b.name.startsWith("Paladin") ? "Paladin" : "Archer", [hi, lo] = LINE[cls][stageOf(b.level) - 1], sp = SPECIES.human;
  b.bodyHealth = hi + sp[0]; b.mindHealth = lo + sp[1]; b.pool = b.bodyHealth + b.mindHealth; b.rallyHeal = Math.ceil(b.pool / 4); b.rallyPoints = b.rally + stageOf(b.level);
  b.escHook = cls === "Paladin" ? "ally" : "quarry";
  return b;
}
const PARTY = ["paladin-smite-r1", "paladin-hands-r1", "archer-double-r1", "archer-rolling-r1"];
const party = (edits = {}) => PARTY.map(f => load(f, edits[f] ?? edits["*"] ?? (x => x)));

/* ------------------------------------------------------------------ the NPCs */
const KIT = { minion: { round: { ap: 1, mult: 1.4 } }, grunt: { round: { ap: 1, mult: 1.4 } }, standard: { round: { ap: 2, mult: 2.2 } }, elite: { round: { ap: 2, mult: 2.2 }, enc: { ap: 3, mult: 3.5 } } };
const npcAt = (role, h = FIT.h, d = FIT.d) => { const n = S.npcOf(role, "medium", 1); return { ...n, exact: true, kit: KIT[role], pool: Math.round(n.pool * h), bodyPool: Math.round(n.bodyPool * h), mindPool: Math.round(n.mindPool * h), t2: n.t2 * d, t3: n.t3 * d }; };
const enc = list => list.flatMap(([role, k]) => Array(k).fill(0).map(() => npcAt(role)));
const CV = { minion: 0.25, grunt: 0.5, standard: 1, elite: 2 };

/* ------------------------------------------------------------------ fights */
function fights(pcsBuilds, npcs, n = RUNS, seed = 17) {
  const Rn = S.rng(seed), out = [], cv = npcs.reduce((s, x) => s + CV[x.role], 0) / pcsBuilds.length;
  for (let k = 0; k < n; k++) {
    const pcs = pcsBuilds.map(S.pcState);
    for (const p of pcs) { p.startEsc = k % 2 ? 1 : 2; p.dailyOK = cv >= 1.25; }   // every fight starts at Escalation 1, Momentum (2) in half
    out.push(S.fight(pcs, npcs, Rn, { maxRounds: 15 }));
  }
  const sel = (cls, key, per = false) => mean(out.flatMap(f => f.pcs.filter(p => !cls || p.build.name.startsWith(cls)).map(p => (per ? (p.st[key] ?? 0) / Math.max(1, p.st.rounds) : (p.st[key] ?? 0)))));
  const one = (file, key) => mean(out.flatMap(f => f.pcs.filter(p => p.build.file === `rework/${file}`).map(p => p.st[key] ?? 0)));
  return { rounds: mean(out.map(x => x.rounds)), lost: mean(out.map(x => x.lost)), down: mean(out.map(x => (x.downs ? 1 : 0))), won: mean(out.map(x => (x.won ? 1 : 0))),
    taken: mean(out.map(f => f.pcs.reduce((s, p) => s + (p.st.taken ?? 0), 0))), dealt: mean(out.map(f => f.pcs.reduce((s, p) => s + (p.st.dealt ?? 0), 0))),
    escTurns: [0, 1, 2, 3].map(k => mean(out.flatMap(f => f.pcs.filter(p => p.build.name.startsWith("Paladin")).map(p => p.st.escTurns[k])))), sel, one, out };
}
const cell = r => `${f1(r.rounds)} r · ${pc(r.lost)} · Down ${pc(r.down)} · won ${pc(r.won)}`;
const STD4 = [["standard", 4]];

/* ------------------------------------------------------------------ the report */
export function run() {
  const L = [];
  L.push("# Pack R-classes: the rebuilt Paladin and Archer under pack R's rules", "",
    "Written by `node book/ruler/rclasses.mjs`; don't edit, run it again. Read by `book/rules-backlog.md` (pack R-classes) and the class documents' design notes.", "",
    `Runs: ${RUNS} fights a measurement. **The party:** the R builds of \`rework/\` (a Smite Paladin, a Lay On Hands Paladin, a Double Shot Archer, a Rolling Shot Archer), level 1, Human, high on Vigor (the Paladin 23 / 12 = 35 Health, the Archer 19 / 10 = 29; Rally Points = Rally + 1). **The rules:** every piece of the rework as decided (rework-r.md section 14): 4 + 1 AP, Escalation as a level from 1 (Momentum 2 in half the fights) with the Critical hook and the class hooks (the Paladin's Kindled Wrath: an ally within 5 squares becomes Bloodied or goes Down), Guard 2 per unspent AP (it can still pay a Reaction), the NPC Specials (a Standard's 2 AP Special × 2.2 once a round), Opportunity Attack without the disrupt, and the fit of item 3 (NPC Health × 1, the Basic attack tables × 0.6). **The fight:** 4 Standards (CV 4, the "normal" fight: the target is about a quarter of the party's Health in 3.5 rounds, a Down in about 1 fight of 9). 1 AP = ${AP_DE} DE.`, "");
  setRules(R);
  const t1 = Date.now();

  // 1. The builds' turns.
  L.push("## 1. The Paladin's turns (damage at Defense 13; Monte Carlo)", "", "| Build | Turn | Escalation 1 | Escalation 3 | AP | Steps |", "|---|---|---:|---:|---:|---|");
  for (const f of ["paladin-smite-r1", "paladin-hands-r1"]) { const b = load(f); for (const k of Object.keys(b.turns)) { const e1 = S.turnDamage(b, k, 13, { escalation: 1 }), e3 = S.turnDamage(b, k, 13, { escalation: 3 }); L.push(`| ${b.name} | ${b.turns[k].name} | ${f1(e1.avg)} | ${f1(e3.avg)} | ${e3.ap} | ${b.turns[k].steps.join(", ")} |`); } }
  L.push("", "The Apex turn is taken at Escalation 3 while the Apex is unused (`when escalation 3`); the Nova (Holy Wrath 3 at the Encounter ceilings: 2d8 / 3d8 / 4d8) in round 1. Final Verdict hits every adjacent enemy (1.5 on average here).", "");
  log("1. turns");

  // 2. The normal fight.
  L.push("## 2. The fights", "", "| Fight | rounds · lost · Down · won | Party dealt · taken a fight | A Paladin's turns at Escalation 1 / 2 / 3 | Smite Paladin: dealt a fight · reactions · blocked · surge given · mend given | Lay On Hands Paladin: dealt · reactions · blocked · mend given · reduced |", "|---|---|---|---|---|---|");
  const col = (r, f) => `${f1(r.one(f, "dealt"))} · ${f2(r.one(f, "reactions"))} · ${f1(r.one(f, "blockCredit"))} · ${f1(r.one(f, "surgeCredit"))} · ${f1(r.one(f, "mendGiven"))}`;
  for (const [fname, list] of [["4 Standards (normal)", STD4], ["6 Standards (hard)", [["standard", 6]]], ["2 Elites + 2 Standards (deadly)", [["elite", 2], ["standard", 2]]]]) { const base = fights(party(), enc(list));
  L.push(`| ${fname} | ${cell(base)} | ${f1(base.dealt)} · ${f1(base.taken)} | ${base.escTurns.slice(1).map(f2).join(" / ")} | ${col(base, "paladin-smite-r1")} | ${f1(base.one("paladin-hands-r1", "dealt"))} · ${f2(base.one("paladin-hands-r1", "reactions"))} · ${f1(base.one("paladin-hands-r1", "blockCredit"))} · ${f1(base.one("paladin-hands-r1", "mendGiven"))} · ${f1(base.one("paladin-hands-r1", "reducedGiven") + base.one("paladin-hands-r1", "reduced"))} |`); }
  L.push("", "For scale, the decision sheet's row with the P1 builds at the same fit (rework-sheet.md section 5): 3.5 r · 25% · Down 18% · won 100%.", "");
  log("2. the normal fight");

  // 3. The Hallmark Reactions.
  L.push("## 3. The Hallmark Reactions (both Paladins with the Reaction named; the Archers keep Quick Draw)", "", "**Worth** = what the Reaction itself did a fight (its damage, what its block took off, the Guard its rest gave that was used) per Paladin turn, in DE and AP. A Turn Reaction fires once per NPC turn, a Round one once a round.", "",
    "| Paladins' Reaction | rounds · lost · Down · won | Reactions a fight (a Paladin) | Blocked · Guard used · damage, a fight (a Paladin) | Worth a Paladin turn (DE · AP) |", "|---|---|---:|---|---|");
  let g0 = 0;
  for (const [name, line] of [["None", ""], ["Opportunity Attack (the basic Reaction)", "reaction Opportunity Attack: opportunity"], ["Shield of Faith (1R, Turn: 2d6 + [PMod])", "reaction Shield of Faith: block 2d6+[Mod]"], ["Bulwark of Faith (1R, Round: the ally's Rally Point as Guard)", "reaction Bulwark of Faith: block 9 spill round ally"], ["Bulwark of Faith on you too (not the card)", "reaction Bulwark of Faith: block 9 spill round"]]) {
    const edit = x => x.replace(/^reaction .*$/m, line);
    const r = fights(party({ "paladin-smite-r1": edit, "paladin-hands-r1": edit }), enc(STD4));
    const gc = r.sel("Paladin", "guardCredit"); if (name === "None") g0 = gc;
    const bl = r.sel("Paladin", "blockCredit"), sp = Math.max(0, gc - g0), dm = r.sel("Paladin", "reactionDealt"), de = (bl + sp + dm) / r.sel("Paladin", "rounds");
    L.push(`| ${name} | ${cell(r)} | ${f2(r.sel("Paladin", "reactions"))} | ${f1(bl)} · ${f1(sp)} · ${f1(dm)} | ${f2(de)} · ${f2(de / AP_DE)} |`);
  }
  L.push("", "A block can't take more than the hit: at this fit a Standard's Basic attack averages 3.6 / 6.6 and its 2 AP Special 7.9 / 14.5. Bulwark's Guard is the ally's Rally Point (9 for a Paladin, 8 for an Archer here: 9 in the model), before the damage, so its rest stays as Guard (Stacking: the higher value).", "");
  log("3. the Hallmark Reactions");

  // 4. The Escalation Passives: the wrath ones on the turn tables (a fight to the death caps damage by the NPCs' Health), the mercy ones by what they did in the fights.
  L.push("## 4. The Escalation Passives", "", "**The wrath Passives** (the Main turn at Defense 13 with and without the Passive, at its rung; Reckoning against a Bloodied target): the damage it adds a turn, in DE and AP. **The mercy Passives:** what each did a fight in the normal fight (4 Standards) and in a hard one (6 Standards, CV 6): the allies' extra damage (Divine Surge), the healing (Mending Light; the extra on the Rally Points used: Font of Mercy), the damage reduced (Hallowed Stance), per turn of its owner and per turn at its rung. The rung budgets (rework-r.md 14.2 item 15): rung 1 about 0.4-0.6 AP a turn, rung 2 0.6-0.8, rung 3 0.8-1; a rung 3 Passive is on for the last turn or two of a normal fight.", "",
    "| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |", "|---|---|---|---|");
  const smite = load("paladin-smite-r1");
  for (const [name, rung, blood] of [["Radiant Zeal", 1, false], ["Searing Blows", 2, false], ["Reckoning", 3, true]]) {
    const w = S.turnDamage(smite, "main", 13, { escalation: rung, bloodied: blood }).avg, wo = S.turnDamage({ ...smite, passives: smite.passives.filter(p => p.name !== name) }, "main", 13, { escalation: rung, bloodied: blood }).avg;
    L.push(`| ${name} (${rung}) | smite | ${f1(w)} · ${f1(wo)} | ${f2(w - wo)} · ${f2((w - wo) / AP_DE)} |`);
  }
  L.push("", "| Mercy Passive (rung) | Build | Fight | rounds · lost · Down · won | What it did a fight | Worth a turn (DE · AP) | Worth a turn at its rung (DE · AP) |", "|---|---|---|---|---|---|---|");
  const swapIn = (name, rung) => x => { const lines = x.match(/^passive .*$/mg) ?? [], RUNG = { "Radiant Zeal": 1, "Divine Surge": 1, "Font of Mercy": 1, "Searing Blows": 2, "Mending Light": 2, "Reckoning": 3, "Hallowed Stance": 3 }; const at = lines.find(l => RUNG[l.replace(/^passive\s+/, "").trim()] === rung); return at ? x.replace(at, `passive ${name}`) : x + `\npassive ${name}\n`; };
  const noApex = x => x.replace(/^when escalation 3: .*$/m, "");
  for (const [fname, list] of [["4 Standards", STD4], ["6 Standards (hard)", [["standard", 6]]]]) for (const [name, rung, file, key] of [["Divine Surge", 1, "paladin-smite-r1", "surgeCredit"], ["Font of Mercy", 1, "paladin-hands-r1", "mercyGiven"], ["Mending Light", 2, "paladin-hands-r1", "mendGiven"], ["Hallowed Stance", 3, "paladin-hands-r1", "reduced"]]) {
    const r = fights(party({ [file]: x => noApex(swapIn(name, rung)(x)) }), enc(list));   // without the Apex turn: Hallowed Dawn heals too
    const did = key === "reduced" ? r.one(file, "reduced") + r.one(file, "reducedGiven") : r.one(file, key), turns = r.one(file, "rounds"), atRung = mean(r.out.flatMap(f => f.pcs.filter(p => p.build.file === `rework/${file}`).map(p => p.st.escTurns.slice(rung).reduce((s, x) => s + x, 0))));
    L.push(`| ${name} (${rung}) | ${file.replace("paladin-", "").replace("-r1", "")} | ${fname} | ${cell(r)} | ${f1(did)} | ${f2(did / turns)} · ${f2(did / turns / AP_DE)} | ${f2(did / atRung)} · ${f2(did / atRung / AP_DE)} |`);
  }
  L.push("", "Font of Mercy adds to the Rally Points used in the fight: the ruler's Lay On Hands spends one only on an ally hurt at least three quarters of what it heals, so in a normal fight it hardly fires (the Standard day's between-fight Rally Points, where it also works, are not in these numbers).", "");
  log("4. the Passives");

  // 5. The Apex.
  L.push("## 5. The Apex (the fight with and without the Apex turn)", "", "| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Party taken with · without | Apex turns a fight | Worth a use (DE) · per AP |", "|---|---|---|---|---|---|---:|---|");
  for (const [fname, list] of [["4 Standards", STD4], ["6 Standards (hard)", [["standard", 6]]]]) for (const [name, file, ap] of [["Final Verdict (2 AP)", "paladin-smite-r1", 2], ["Hallowed Dawn (3 AP)", "paladin-hands-r1", 3]]) {
    const withIt = fights(party(), enc(list)), without = fights(party({ [file]: noApex }), enc(list));
    const uses = mean(withIt.out.flatMap(f => f.pcs.filter(p => p.build.file === `rework/${file}`).map(p => p.spent?.has(name.split(" (")[0].toLowerCase()) ? 1 : 0)));
    const gain = (withIt.one(file, "dealt") - without.one(file, "dealt")) + (without.taken - withIt.taken) + ["mendGiven", "healGiven"].reduce((g, k) => g + withIt.one(file, k) - without.one(file, k), 0);
    L.push(`| ${name} | ${file.replace("paladin-", "").replace("-r1", "")} | ${fname} | ${cell(withIt)} · ${cell(without)} | ${f1(withIt.one(file, "dealt"))} · ${f1(without.one(file, "dealt"))} | ${f1(withIt.taken)} · ${f1(without.taken)} | ${f2(uses)} | ${f1(gain / Math.max(0.01, uses))} · ${f1(gain / Math.max(0.01, uses) / ap)} |`);
  }
  L.push("", `The Encounter band is 1.4 to 2 × ${AP_DE} = ${f1(1.4 * AP_DE)} to ${f1(2 * AP_DE)} DE per AP (prices.md). Hallowed Dawn's worth is its healing (new Health to the three most hurt of you and your allies, 3d6 + [PMod] each); its Enfeebled 1 on the enemies and the cleansing are not modeled.`, "");
  log("5. the Apex");

  // 6. The Archer: its turns, its Hallmark Reactions, its wrath Passives on the turn tables, its Apexes in the fights.
  L.push("## 6. The Archer", "", "The R builds of the Archer: Double Shot with Overwatch and Deathmark, Rolling Shot with Ready Shot and Open Season; both with Killer's Focus (1), Hunter's Edge (2) and Finisher (3). Vanish (a free Evade 1 when an enemy comes adjacent), Sure Step (a free Evade 1 after a Shot on the Quarry), Harrying Shots (a Bane on the Quarry's Strikes) and Pinned Down (Immobilized (EoT) on the Quarry each round) are positional: not modeled (positions priced Immobilized (EoT) on a Standard at 4.7 DE, prices.md section 5).", "",
    "| Build | Turn | Escalation 1 | Escalation 3 | AP | Steps |", "|---|---|---:|---:|---:|---|");
  for (const f of ["archer-double-r1", "archer-rolling-r1"]) { const b = load(f); for (const k of Object.keys(b.turns)) { const e1 = S.turnDamage(b, k, 13, { escalation: 1 }), e3 = S.turnDamage(b, k, 13, { escalation: 3 }); L.push(`| ${b.name} | ${b.turns[k].name} | ${f1(e1.avg)} | ${f1(e3.avg)} | ${e3.ap} | ${b.turns[k].steps.join(", ")} |`); } }
  L.push("", "**The Hallmark Reactions** (both Archers with the Reaction named; the Paladins keep Shield of Faith): worth = the Reaction's own damage, the extra damage its AP bought (the 5 AP turn's damage over the 4 AP turn's, for Ready Shot) or the extra damage its Vulnerable gave the party (the same roll with and without the Boon), per Archer turn.", "",
    "| Archers' Reaction | rounds · lost · Down · won | Reactions a fight (an Archer) | Its damage · its Vulnerable's extra · an Archer's damage a fight | Worth an Archer turn (DE · AP) |", "|---|---|---:|---|---|");
  let d0 = 0;
  for (const [name, line] of [["None", ""], ["Opportunity Attack (the basic Reaction)", "reaction Opportunity Attack: opportunity"], ["Quick Draw (the sheet's stand-in: an enemy within 5 squares moves closer)", "reaction Quick Draw: quick-draw"], ["Overwatch (1R, Turn: an enemy within 10 squares makes a Strike)", "reaction Overwatch: overwatch"], ["Ready Shot (1R, Round: an enemy within 10 squares makes a Strike: 1 AP less on your next turn's first Shot)", "reaction Ready Shot: ready"], ["Call the Shot (considered: an ally damages your Quarry: Vulnerable 1 until your next turn)", "reaction Call the Shot: callshot"]]) {
    const edit = x => x.replace(/^reaction .*$/m, line);
    const r = fights(party({ "archer-double-r1": edit, "archer-rolling-r1": edit }), enc(STD4));
    const dm = r.sel("Archer", "reactionDealt"), vc = r.sel("Archer", "vulnCredit"), dealt = r.sel("Archer", "dealt"); if (name === "None") d0 = dealt;
    const de = (dm + vc + (name.startsWith("Ready") ? Math.max(0, dealt - d0) : 0)) / r.sel("Archer", "rounds");
    L.push(`| ${name} | ${cell(r)} | ${f2(r.sel("Archer", "reactions"))} | ${f1(dm)} · ${f1(vc)} · ${f1(dealt)} | ${f2(de)} · ${f2(de / AP_DE)} |`);
  }
  { const rb = load("archer-rolling-r1"), big = S.turnDamage(rb, "big", 13, { escalation: 3 }).avg, main = S.turnDamage(rb, "main", 13, { escalation: 3 }).avg, per = 2.8 / 3.7;
    L.push(`| Ready Shot by the turn tables (the 5 AP turn over the 4 AP turn at Escalation 3: ${f1(big)} − ${f1(main)}, × ${f2(per)} fires an Archer turn) | | | | ${f2((big - main) * per)} · ${f2((big - main) * per / AP_DE)} |`); }
  L.push("", "Ready Shot's AP is spent on a 5 AP turn (Double Shot 3 or Rolling Shot 3, Lock & Loose, a Weapon Attack); its worth is the Archer's damage over the row with no Reaction (a fight to the death caps it: the NPCs' Health). Open Season's Vulnerable lasts until the end of the Archer's next turn, as the card says.", "");
  L.push("| Wrath Passive (rung) | Build | Main turn with · without | Worth a turn (DE · AP) |", "|---|---|---|---|");
  const arch = load("archer-double-r1");
  for (const [name, rung, blood] of [["Killer's Focus", 1, false], ["Hunter's Edge", 2, false], ["Finisher", 3, true]]) {
    const w = S.turnDamage(arch, "main", 13, { escalation: rung, bloodied: blood }).avg, wo = S.turnDamage({ ...arch, passives: arch.passives.filter(p => p.name !== name) }, "main", 13, { escalation: rung, bloodied: blood }).avg;
    L.push(`| ${name} (${rung}) | double | ${f1(w)} · ${f1(wo)} | ${f2(w - wo)} · ${f2((w - wo) / AP_DE)} |`);
  }
  L.push("", "| Apex | Build | Fight | rounds · lost · Down · won with · without | Owner dealt a fight with · without | Its Vulnerable's extra with · without | Apex turns a fight | Worth a use (DE) · per AP |", "|---|---|---|---|---|---|---:|---|");
  for (const [fname, list] of [["4 Standards", STD4], ["6 Standards (hard)", [["standard", 6]]]]) for (const [name, file, ap] of [["Deathmark (2 AP)", "archer-double-r1", 2], ["Open Season (2 AP)", "archer-rolling-r1", 2]]) {
    const withIt = fights(party(), enc(list)), without = fights(party({ [file]: noApex }), enc(list));
    const uses = mean(withIt.out.flatMap(f => f.pcs.filter(p => p.build.file === `rework/${file}`).map(p => p.spent?.has(name.split(" (")[0].toLowerCase()) ? 1 : 0)));
    const gain = (withIt.one(file, "dealt") - without.one(file, "dealt")) + (withIt.one(file, "vulnCredit") - without.one(file, "vulnCredit")) + (without.taken - withIt.taken);
    L.push(`| ${name} | ${file.replace("archer-", "").replace("-r1", "")} | ${fname} | ${cell(withIt)} · ${cell(without)} | ${f1(withIt.one(file, "dealt"))} · ${f1(without.one(file, "dealt"))} | ${f1(withIt.one(file, "vulnCredit"))} · ${f1(without.one(file, "vulnCredit"))} | ${f2(uses)} | ${f1(gain / Math.max(0.01, uses))} · ${f1(gain / Math.max(0.01, uses) / ap)} |`);
  }
  L.push("", "Deathmark's Boon against the Quarry and its chain shot on a kill are not modeled (a floor); Open Season's allies' extra [V] 1d6 Pi is not modeled either, (a floor). Hunter's Edge's Cover part (about 1.5 DE a turn: positions) is not in the turn table.", "");
  log("6. the Archer");

  setRules({});
  L.push(`(${((Date.now() - t1) / 60000).toFixed(1)} minutes.)`);
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = run();
  fs.writeFileSync(HERE + "rclasses.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
  log("done");
}
