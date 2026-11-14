// The PC budget (Lucas, 2026-11-13: "this done before the card sessions"): what a PC's Actions, riders, Reactions and helps are worth, in points of a PC's
// turn, measured as the Bestiary's turn budget was (calib.mjs). It writes ../pc-budget.md.   node book/ruler/sim/pcbudget.mjs   (about 50 minutes; --quick: a draft)
// The yardstick: a plain PC (its class's Health, armor, weapon and Modifiers; no Feature, no Passive, no Reaction) whose turn is three Weapon Attacks.
// That turn is 100 points; a Weapon Attack is 25. The scale is the party's cost (its Health lost with the Rally Points it spent): 0 points is a PC in that
// seat that deals no damage, 100 the plain PC; anything else is placed on that line by what the party's fights cost with it. Two seats: the melee one (the Smite Paladin's) and the ranged one (the Double Shot Archer's); the other three PCs are the Stage 0 builds.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { S, party, build, fights, mean, FILES } from "./stage0lib.mjs";
import * as B from "./budget.mjs";
import { STANDARDS, RANKS } from "./designs.mjs";
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick"), N = QUICK ? 500 : 2500, t0 = Date.now();
const log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`), f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f0 = x => Math.round(x).toString(), pc = x => `${Math.round(x * 100)}%`;
const SEAT = { melee: { i: 0, file: "paladin-smite-r1", label: "melee (a Paladin's Greatsword)" }, ranged: { i: 2, file: "archer-double-r1", label: "ranged (an Archer's Crossbow)" } };
const stds = k => () => Array.from({ length: k }, (_, i) => B.npcBuilt("standard", STANDARDS[i % 4]));
const ENC = { std: stds(4), hard: stds(5), deadly: stds(6), elite: () => Array.from({ length: 2 }, () => B.npcBuilt("elite", RANKS.elite)) };
const rd = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8");
/** The plain PC of a seat with what a test adds: actions (action lines), turn (its steps), plan, reaction, scale (its damage × this), lines (anything else). */
function plain(seat, level, o = {}) {
  const keep = rd(SEAT[seat].file).split(/\r?\n/).filter(l => !/^(reaction|passive|turn|plan|when|hook)\b/.test(l)).join("\n").replace(/^level .*$/m, `level ${level}`).replace(/^class .*$/m, `class Plain (${seat})`);
  const t = [keep, ...(o.actions ?? []), ...(o.lines ?? []), o.reaction ? `reaction ${o.reaction}` : "", ...(o.turns ?? [`turn Plain: ${o.turn ?? "Weapon Attack, Weapon Attack, Weapon Attack"}`]), `plan ${o.plan ?? "Plain"}`, o.scale ? `damage-scale ${o.scale}` : ""].filter(Boolean).join("\n");
  return S.parseSpec(t, `plain ${seat}`);
}
/** A Weapon Attack's average damage by Tier for a seat (its points are 25): the flat damage of an Action worth `pts`. */
const waAvg = seat => { const b = plain(seat, 1), d = S.parseDamage("1[W] + [Mod]"); return [2, 3].map(t => S.avgDamage(d, b.weapon, t, b.weaponMod)); };
const flat = (seat, pts) => { const [a, b] = waAvg(seat); return `0 / ${Math.round(a * pts / 25)} / ${Math.round(b * pts / 25)}`; };
const run = (seat, mk, enc = "std", lvls = [1, 2, 3], o = {}) => {
  S.RULES.areasOnGrid = !!o.grid;
  const rows = lvls.map(lv => { const P = party(lv); P[SEAT[seat].i] = mk(lv); const f = fights(P, ENC[enc], { n: o.n ?? N, seed: 53, map: o.map ?? "open", mom: o.mom ?? 0 }); const st = k => mean(f.out.map(x => x.pcs[SEAT[seat].i].st[k] ?? 0));
    S.RULES.areasOnGrid = false;
    return { cost: f.cost, down: f.down, won: f.won, areaUse: mean(f.out.map(x => Object.values(x.pcs[SEAT[seat].i].st.area ?? {}).reduce((q, a) => q + a.uses, 0))), areaHit: mean(f.out.map(x => Object.values(x.pcs[SEAT[seat].i].st.area ?? {}).reduce((q, a) => q + a.hits, 0))), collision: st("collision"), forced: st("forced"), pool: f.out[0].pcs.reduce((q, p) => q + p.build.pool, 0), dealt: st("dealt"), rounds: st("rounds"), atk: st("swings") + st("shots"), rx: st("reactions"), cond: st("condApplied") }; });
  return Object.fromEntries(Object.keys(rows[0]).map(k => [k, mean(rows.map(r => r[k]))]));
};
const REF = {};
/** The two ends of the scale for a seat and an encounter: the PC that deals no damage (0 points) and the plain PC (100). */
const ref = (seat, enc = "std", lvls, o = {}) => (REF[`${seat}|${enc}|${lvls ?? ""}|${JSON.stringify(o)}`] ??= { zero: run(seat, lv => plain(seat, lv, { scale: 0.001 }), enc, lvls, o), one: run(seat, lv => plain(seat, lv), enc, lvls, o) });
const worth = (seat, mk, enc = "std", lvls, o = {}) => { const c = ref(seat, enc, lvls, o), r = run(seat, mk, enc, lvls, o); return { ...r, worth: 100 * (c.zero.cost - r.cost) / (c.zero.cost - c.one.cost), base: c.one }; };
const out = [];
out.push(`# The PC budget

Written by \`node book/ruler/sim/pcbudget.mjs\`; don't edit, run it again. ${N} fights a level (levels 1, 2 and 3, no Momentum), the plan policy, the open field, against four Standards with effects (\`stage0.md\` section 9) unless a column says two Elites. **A guide for writing class cards, not a rule of the book.**

**The unit:** points of a PC's turn. **The yardstick is a plain PC:** its class's Health, armor, weapon and Modifiers, no Feature, no Passive, no Reaction, and a turn of **three Weapon Attacks = 100 points** (a Weapon Attack is 25; the fourth AP moves it or becomes Guard). It sits in one seat of the usual party (the melee seat: the Smite Paladin's; the ranged seat: the Double Shot Archer's); the other three PCs are the Stage 0 builds. **The scale is what the fights cost the party** (its Health lost with the Rally Points it spent): a PC in that seat that deals no damage is 0 points, the plain PC 100, and anything else sits on that line. So a point is worth the same whether it comes from damage dealt, damage prevented or Health given back. One worth is good to about ±3 points.
`);
/* 1 */
out.push("## 1. The yardstick: what damage and Health are worth", "", "| Seat | A Weapon Attack (Tier 2 / Tier 3 average) | The party's cost with a PC that deals no damage → the plain PC | So 100 points are | The plain PC deals a fight |", "|---|---|---|---|---|");
for (const seat of ["melee", "ranged"]) { const c = ref(seat); out.push(`| ${SEAT[seat].label} | ${waAvg(seat).map(f1).join(" / ")} | ${pc(c.zero.cost)} → ${pc(c.one.cost)} | ${f1((c.zero.cost - c.one.cost) * c.one.pool)} Health saved a fight | ${f0(c.one.dealt)} damage |`); log(`scale ${seat}`); }
out.push("", "**How much damage is a point of Health worth?** The melee seat, by the size of the fight: what the plain PC's whole offense saves the party, and three other things on the same scale (the plain PC with +40% damage; with a 1 AP heal of 1d8 + [Mod] in the place of its third attack; with Shield of Faith).", "", "| Fight | The plain PC's damage saves (Health · the party wins) | 1 Health saved = this much damage dealt | +40% damage | The 1 AP heal | Shield of Faith |", "|---|---|---:|---:|---:|---:|");
for (const [enc, label] of [["std", "4 Standards (normal)"], ["hard", "5 Standards (hard)"], ["deadly", "6 Standards (deadly)"]]) {
  const c = ref("melee", enc), saved = (c.zero.cost - c.one.cost) * c.one.pool, cell = w => `${f0(w.worth)} points · won ${pc(w.won)}`;
  const up = worth("melee", lv => plain("melee", lv, { scale: 1.4 }), enc), heal = worth("melee", lv => plain("melee", lv, { actions: ["action Help | ap 1 | round | traits power | vs none | always: mend 1d8+[Mod] any"], turn: "Weapon Attack, Weapon Attack, Help" }), enc), sof = worth("melee", lv => plain("melee", lv, { reaction: "Shield of Faith: block 2d6+[Mod]" }), enc);
  out.push(`| ${label} | ${f1(saved)} Health · won ${pc(c.zero.won)} → ${pc(c.one.won)} | ${f1(c.one.dealt / Math.max(1e-9, saved))} | ${cell(up)} | ${cell(heal)} | ${cell(sof)} |`); log(`exchange ${enc}`);
}
out.push("", "### What a class is worth today", "", "The Stage 0 builds in the same seats (the R builds cut to the Stage 0 lists, \`stage0lib.mjs\`): **what a class's Features, Hallmarks, Passives and Reaction add to the plain turn.**", "", "| Build | Seat | Level 1 | Level 2 | Level 3 |", "|---|---|---:|---:|---:|");
const CLASS = {};
for (const [file, seat] of [["paladin-smite-r1", "melee"], ["paladin-hands-r1", "melee"], ["archer-double-r1", "ranged"], ["archer-rolling-r1", "ranged"]]) {
  const w = [1, 2, 3].map(lv => worth(seat, () => build(file, lv), "std", [lv]).worth); CLASS[file] = w;
  out.push(`| ${build(file, 1).name} | ${seat} | ${w.map(f0).join(" | ")} |`); log(`class ${file}`);
}
out.push("");
/* 2 */
out.push("## 2. AP and Frequency: the same points in different shapes", "", "The plain PC with one Action of flat damage in the place of Weapon Attacks (its points: 25 = a Weapon Attack's average on each Tier). The turn's points are what it uses; its worth is what the fights give.", "", "| The turn | Points used | Worth, melee | Worth, ranged |", "|---|---:|---:|---:|");
const SHAPES = [
  ["three Weapon Attacks (the yardstick)", 75, s => ({})],
  ["a 2 AP Action of 50 and a Weapon Attack", 75, s => ({ actions: [`action Heavy | ap 2 | at-will | traits weapon strike | vs ad | tiers ${flat(s, 50)}`], turn: "Heavy, Weapon Attack" })],
  ["a 3 AP Action of 75", 75, s => ({ actions: [`action Big | ap 3 | at-will | traits weapon strike | vs ad | tiers ${flat(s, 75)}`], turn: "Big" })],
  ["a 2 AP Action of 50 and two Weapon Attacks (4 AP)", 100, s => ({ actions: [`action Heavy | ap 2 | at-will | traits weapon strike | vs ad | tiers ${flat(s, 50)}`], turn: "Heavy, Weapon Attack, Weapon Attack" })],
  ["a 2 AP Action of 60 and a Weapon Attack", 85, s => ({ actions: [`action Heavy | ap 2 | at-will | traits weapon strike | vs ad | tiers ${flat(s, 60)}`], turn: "Heavy, Weapon Attack" })],
  ["once an encounter, a 2 AP Action of 100 (double) and a Weapon Attack; else the yardstick", 125, s => ({ actions: [`action Nova | ap 2 | encounter | traits weapon strike | vs ad | tiers ${flat(s, 100)}`], turns: ["turn Nova: Nova, Weapon Attack", "turn Plain: Weapon Attack, Weapon Attack, Weapon Attack"], plan: "Nova | Plain" })],
  ["once an encounter, a 3 AP Action of 150 (double); else the yardstick", 150, s => ({ actions: [`action Nova | ap 3 | encounter | traits weapon strike | vs ad | tiers ${flat(s, 150)}`], turns: ["turn Nova: Nova", "turn Plain: Weapon Attack, Weapon Attack, Weapon Attack"], plan: "Nova | Plain" })],
];
const SH = {};
for (const [name, pts, mk] of SHAPES) { const w = ["melee", "ranged"].map(s => worth(s, lv => plain(s, lv, mk(s))).worth); SH[name] = w; out.push(`| ${name} | ${pts}${/once/.test(name) ? " (that turn)" : ""} | ${f1(w[0])} | ${f1(w[1])} |`); log(name.slice(0, 30)); }
out.push("");
/* 3 */
const RIDERS = [["Hindered (EoT)", "debuff Hindered (EoT)"], ["Frightened (EoT)", "debuff Frightened (EoT)"], ["Taunted (by you)", "taunt 1"], ["Immobilized (EoT)", "debuff Immobilized (EoT)"], ["Immobilized (until it escapes)", "debuff Immobilized"], ["Blinded (EoT)", "debuff Blinded (EoT)"], ["Vulnerable 1", "vulnerable 1"], ["Vulnerable 2", "vulnerable 2"], ["Slowed 1", "debuff Slowed 1"], ["Dazed 1", "debuff Dazed 1"], ["Prone", "debuff Prone"], ["Lingering 1d4", "debuff Lingering 1d4"], ["Lingering 1d6", "debuff Lingering 1d6"], ["Slowed 2", "debuff Slowed 2"]];
out.push("## 3. Riders a PC puts on an enemy (on a hit: Tier 2 or 3)", "", "The plain PC's Weapon Attacks carry the rider for free. **On an Action** is what the rider adds to one Weapon Attack that carries it (what it adds to the turn, over the attacks of the turn): its price. Against four Standards, and against two Elites (a creature that lives longer and whose turn is bigger).", "", "| Rider | Melee seat, 4 Standards | Ranged seat, 4 Standards | Melee seat, 2 Elites | Lands a fight (melee, Standards) |", "|---|---:|---:|---:|---:|");
const RD = {};
const oneOf = (seat, enc) => ({ ...ref(seat, enc).one, worth: 100 }), baseR = { m: oneOf("melee"), r: oneOf("ranged"), e: oneOf("melee", "elite") };
for (const [name, eff] of RIDERS) {
  const act = "action Weapon Attack | ap 1 | at-will | traits weapon strike | vs ad | tiers 0 / 1[W] + [Mod] / 1[W] + [Mod] | on 2+: " + eff, mk = s => lv => plain(s, lv, { actions: [act] });
  const m = worth("melee", mk("melee")), r = worth("ranged", mk("ranged")), e = worth("melee", mk("melee"), "elite"), per = (w, b) => (w.worth - b.worth) / (w.atk / w.rounds);
  RD[name] = { m: per(m, baseR.m), r: per(r, baseR.r), e: per(e, baseR.e) };
  out.push(`| ${name} | ${f1(RD[name].m)} | ${f1(RD[name].r)} | ${f1(RD[name].e)} | ${f1(m.cond)} |`); log(`rider ${name}`);
}
out.push("", `The plain PC makes ${f1(baseR.m.atk / baseR.m.rounds)} attacks a turn in the melee seat and ${f1(baseR.r.atk / baseR.r.rounds)} in the ranged one (it moves, and the fight ends).`, "");
/* 4 */
out.push("## 4. Reactions", "", "The plain PC with one of the classes' Reactions (1R, its Reaction AP), for free.", "", "| Reaction | Seat | Fires in what share of its rounds | Worth it adds a turn |", "|---|---|---:|---:|");
const RX = {};
for (const [name, seat, line] of [["Shield of Faith (a hit on you or an ally within 5: block 2d6 + [Mod])", "melee", "Shield of Faith: block 2d6+[Mod]"], ["Rebuke (an enemy within 5 Strikes an ally: an Appeal Save, damage, Pushed, Frightened)", "melee", "Rebuke: rebuke 5 turn"], ["Overwatch (an enemy moves closer within 10: a Weapon Attack)", "ranged", "Overwatch: quick-draw 10"], ["Covering Shot (a Strike would damage an ally within 10: a Weapon Attack with 1 Boon; a Tier 3 halves the damage)", "ranged", "Covering Shot: cover"]]) {
  const b = seat === "melee" ? baseR.m : baseR.r, w = worth(seat, lv => plain(seat, lv, { reaction: line })); RX[name] = w;
  out.push(`| ${name} | ${seat} | ${pc(w.rx / w.rounds)} | ${f1(w.worth - b.worth)} |`); log(`reaction ${name.slice(0, 12)}`);
}
out.push("");
/* 5 */
out.push("## 5. Helps: 1 AP that isn't an attack", "", "The plain PC in the melee seat gives up its third Weapon Attack (25 points) for a 1 AP help each turn. **Worth of the AP** = 25 + what the turn gained or lost.", "", "| The 1 AP | Worth of the AP |", "|---|---:|");
const HP = {};
for (const [name, eff] of [["the most hurt ally (or you) heals 1d8 + [Mod] (new Health, not a Rally Point)", "mend 1d8+[Mod] any"], ["the most hurt ally (or you) heals 2d6 + [Mod]", "mend 2d6+[Mod] any"], ["an ally uses 1 of its Rally Points (Lay On Hands' heal)", "heal 1"], ["you gain Guard 1d8 + [Mod]", "guard 1d8+[Mod] self"], ["an ally gains +1 Defense until your next turn", "defense 1 ally"], ["nothing (the AP is not used: its Guard at the next turn)", null]]) {
  const o = eff ? { actions: [`action Help | ap 1 | round | traits power | vs none | always: ${eff}`], turn: "Weapon Attack, Weapon Attack, Help" } : { turn: "Weapon Attack, Weapon Attack" };
  const w = worth("melee", lv => plain("melee", lv, o)); HP[name] = w; out.push(`| ${name} | ${f1(25 + w.worth - baseR.m.worth)} |`); log(`help ${name.slice(0, 14)}`);
}
out.push("");
/* 6 */
out.push("## 6. The classes' Actions in points (level 3 lists, Defense 13, no Passive)", "", "Each Action's **damage points**: its average damage on one creature over its own Weapon Attack's, × 25 (a Weapon Attack: 25). What else it does is listed, not priced: price it with sections 3 to 5.", "", "| Build | Action | AP | Frequency | Damage points | Points an AP | And |", "|---|---|---:|---|---:|---:|---|");
for (const file of FILES) { const b = build(file, 3), one = (name, n = 40000) => S.turnDamage({ ...b, passives: [], turns: { one: { name: "one", steps: [name] } } }, "one", 13, { n, escalation: 6 }).avg, wa = one("Weapon Attack");
  const used = new Set(Object.values(b.turns).flatMap(t => t.steps.map(s => S.stepOf(s)).filter(x => x.kind === "action").map(x => x.name)));
  for (const a of Object.values(b.actions)) { if (!used.has(a.name.toLowerCase()) || /^(weapon attack|steel yourself)/i.test(a.name)) continue; let d = 0; try { d = one(a.name); } catch (e) { d = NaN; }
    const pts = 25 * d / wa, fx = [...new Set([...(a.effects ?? []).map(e => e.effect.name ?? e.effect.kind), ...(a.does?.length ? [`${a.does.length} linked`] : []), a.area > 1 ? `area ${a.area}` : ""].filter(Boolean))].join(", ");
    out.push(`| ${b.name} | ${a.name} | ${a.ap} | ${a.freq} | ${f0(pts)} | ${f1(pts / Math.max(1, a.ap))} | ${fx} |`); }
  log(`ledger ${file}`); }
/* 7 */
const RUNG = { "Radiant Zeal": 2, "Searing Blows": 4, Reckoning: 6, "Font of Mercy": 2, "Mending Light": 4, "Hallowed Stance": 6, "Killer's Focus": 2, "Hunter's Edge": 4, Finisher: 6 };
const withPassive = (seat, names) => lv => { const b = plain(seat, lv, { lines: names.map(n => `passive ${n}`) }); for (const p of b.passives) if (RUNG[p.name]) p.escalation = RUNG[p.name]; return b; };
out.push("## 7. Each Passive and Feature on its own", "", "The plain PC with one Passive or Feature of its class, at the Escalation the Stage 0 lists give it (2, 4 or 6). **What it adds to the turn**, in a fight that starts at Escalation 1 (Momentum 0) and at Escalation 3 (Momentum 2): a Passive at Escalation 6 is seldom reached without Momentum. Levels 1 to 3 (the plain PC is the same at each).", "", "| Passive or Feature | Seat | At Escalation | Adds, Momentum 0 | Adds, Momentum 2 |", "|---|---|---:|---:|---:|");
for (const [seat, list] of [["melee", [["Radiant Zeal"], ["Searing Blows"], ["Reckoning"], ["Font of Mercy"], ["Mending Light"], ["Hallowed Stance"]]], ["ranged", [["Sharpshooter"], ["Marked Quarry", "Marked Quarry floor: floor [Mod] shot strike quarry"], ["Killer's Focus"], ["Hunter's Edge"], ["Finisher"]]]]) for (const names of list) {
  const w = [0, 2].map(mom => worth(seat, withPassive(seat, names), "std", undefined, { mom }).worth - 100);
  out.push(`| ${names[0]} | ${seat} | ${RUNG[names[0]] ?? "always"} | ${f1(w[0])} | ${f1(w[1])} |`); log(`passive ${names[0]}`);
}
out.push("");
/* 8 */
out.push("## 8. Areas", "", "The plain PC with a 2 AP Round area Action and a Weapon Attack (the area placed on the grid where it catches the most enemies). **Each creature in it takes the listed points** (50 = the 2 AP price in full; 33 = two thirds; 25 = half). Against 4 Standards and against 6.", "", "| Area | Seat | Points to each | Creatures hit a use: 4 · 6 Standards | Worth: 4 Standards | Worth: 6 Standards |", "|---|---|---:|---|---:|---:|");
for (const [label, seat, shape] of [["2 Burst within 10 squares", "ranged", "shape burst 2 dist 10 who enemies"], ["1 Emanation around you", "melee", "shape emanation 1 dist self who enemies"], ["2 Emanation around you", "melee", "shape emanation 2 dist self who enemies"]]) for (const pts of [50, 33, 25]) {
  const mk = lv => plain(seat, lv, { actions: [`action Blast | ap 2 | round | traits power strike area | vs ad | tiers ${flat(seat, pts)} | area 2 | ${shape}`], turn: "Blast, Weapon Attack" });
  const a = worth(seat, mk, "std", undefined, { grid: true }), d = worth(seat, mk, "deadly", undefined, { grid: true }), hit = w => w.areaHit / Math.max(1e-9, w.areaUse);
  out.push(`| ${label} | ${seat} | ${pts} | ${f1(hit(a))} · ${f1(hit(d))} | ${f1(a.worth)} | ${f1(d.worth)} |`); log(`area ${label} ${pts}`);
}
out.push("", "The same turn with the 2 AP Action on one creature at 50: section 2 (106 to 107).", "");
/* 9 */
const NMAP = QUICK ? 150 : 600, MAPS = ["open", "pillars", "corridor"], mo = m => (m === "open" ? {} : { map: m, n: NMAP });
// On a map the plain ranged PC is worth little (cover and blocked lines), so its 0-to-100 line is short and points get noisy: this section is in Health saved a fight.
const saved = (seat, mk, m, lvls) => { const c = ref(seat, "std", lvls, mo(m)), r = run(seat, mk, "std", lvls, mo(m)); return { vsZero: (c.zero.cost - r.cost) * r.pool, vsPlain: (c.one.cost - r.cost) * r.pool, r }; };
out.push("## 9. On maps with walls", "", `Two maps beside the open field (${NMAP} fights a level on a map: good to about ±0.6 Health). **In Health saved a fight**, not points: on a map the plain ranged PC is worth little (cover, blocked lines), so its line from 0 to 100 is too short to measure on. The first rows are against the PC that deals no damage; the others are what the thing adds to the plain PC.`, "", "| Health saved a fight | Seat | open | pillars | corridor |", "|---|---|---:|---:|---:|");
for (const seat of ["melee", "ranged"]) { out.push(`| The plain PC's three Weapon Attacks (its 100 points) | ${seat} | ${MAPS.map(m => f1(saved(seat, lv => plain(seat, lv), m).vsZero)).join(" | ")} |`); log(`map scale ${seat}`); }
for (const [file, seat] of [["paladin-smite-r1", "melee"], ["paladin-hands-r1", "melee"], ["archer-double-r1", "ranged"], ["archer-rolling-r1", "ranged"]]) { out.push(`| ${build(file, 2).name}, level 2 | ${seat} | ${MAPS.map(m => f1(saved(seat, () => build(file, 2), m, [2]).vsZero)).join(" | ")} |`); log(`map class ${file}`); }
const wa = eff => "action Weapon Attack | ap 1 | at-will | traits weapon strike | vs ad | tiers 0 / 1[W] + [Mod] / 1[W] + [Mod] | on 2+: " + eff;
for (const [label, eff] of [["Push 1", "push 1"], ["Push 2", "push 2"], ["Hindered (EoT)", "debuff Hindered (EoT)"], ["Immobilized (EoT)", "debuff Immobilized (EoT)"], ["Prone", "debuff Prone"], ["Slowed 1", "debuff Slowed 1"]]) for (const seat of ["melee", "ranged"]) {
  out.push(`| + ${label} on its Weapon Attacks | ${seat} | ${MAPS.map(m => f1(saved(seat, lv => plain(seat, lv, { actions: [wa(eff)] }), m).vsPlain)).join(" | ")} |`); log(`map rider ${label} ${seat}`); }
for (const [label, seat, line] of [["Shield of Faith", "melee", "Shield of Faith: block 2d6+[Mod]"], ["Rebuke", "melee", "Rebuke: rebuke 5 turn"], ["Overwatch", "ranged", "Overwatch: quick-draw 10"], ["Covering Shot", "ranged", "Covering Shot: cover"]]) { out.push(`| + ${label} | ${seat} | ${MAPS.map(m => f1(saved(seat, lv => plain(seat, lv, { reaction: line }), m).vsPlain)).join(" | ")} |`); log(`map reaction ${label}`); }
out.push(`| A 1 AP heal of 1d8 + [Mod] in the place of the third attack | melee | ${MAPS.map(m => f1(saved("melee", lv => plain("melee", lv, { actions: ["action Help | ap 1 | round | traits power | vs none | always: mend 1d8+[Mod] any"], turn: "Weapon Attack, Weapon Attack, Help" }), m).vsPlain)).join(" | ")} |`, "");
log("maps");
fs.writeFileSync(RULER + "pc-budget.md", `${out.join("\n")}\n\n(${Math.round((Date.now() - t0) / 60000)} minutes.)\n`);
log("done");
