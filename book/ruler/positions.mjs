// The price of positions (pack E2, 2026-10-29): what movement and the conditions that act on it are worth, in damage-equivalents (DE),
// measured with the map model (map.mjs) in the fight of spec.mjs. Each price is a pair of simulations with the same dice: the party of a
// Standard day (2 Smite Paladins + 2 Archers of the level) against 4 Standards that don't die, a window of rounds, once with the change and
// once without. Its value = the damage the party deals more + the damage it takes less (1 Health = 1 DE, as +1 Defense in econ.mjs).
//   node book/ruler/positions.mjs           measures everything (about 15 minutes) and writes positions.json (econ.mjs reads it: prices.md, section 5)
//   Run it again after changing map.mjs, the fight in spec.mjs, or the level 1 class files of the party (paladin-smite-1, archer-1).
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const HERE = fileURLToPath(new URL(".", import.meta.url));

export const P = {
  runs: 6000,          // pairs of fights for each price
  window: 2,           // rounds measured from the round the condition is put on (covers the creature's next turn, whatever the initiative)
  rounds: [1, 2, 3],   // round 1: the NPCs are closing in; rounds 2 and 3: the lines are in contact
  buildWindow: 4,      // a build or rule change is measured over rounds 1 to 4
  encounter: "4 standard",
};

const text = f => fs.readFileSync(HERE + "classes/" + f, "utf8");
const build = (f, edit = x => x) => S.parseSpec(edit(text(f)), `classes/${f}`);
const partyOf = (lv, edits = {}) => [`paladin-smite-${lv}.txt`, `paladin-smite-${lv}.txt`, `archer-${lv}.txt`, `archer-${lv}.txt`].map(f => build(f, edits[f.replace(/-\d\.txt$/, "")] ?? (x => x)));
const npcsOf = (lv, spec = P.encounter) => spec.split(",").flatMap(x => { const [n, role, ...tags] = x.trim().split(/\s+/); return Array(Number(n)).fill(0).map(() => S.npcOf(role, "medium", lv, { ranged: tags.includes("ranged") })); });

/** Totals of a window: damage dealt and taken by the party, and per class (Paladin, Archer) its own damage and turns. */
function totals(res) {
  const t = { dealt: 0, taken: 0, turns: 0, by: {} };
  for (const p of res.pcs) {
    const k = p.build.name.split(" ")[0];
    const c = (t.by[k] ??= { dealt: 0, taken: 0, turns: 0, st: {} });
    t.dealt += p.st.dealt; t.taken += p.st.taken + p.st.guardCredit; t.turns += p.st.rounds;
    c.dealt += p.st.dealt; c.taken += p.st.taken; c.turns += p.st.rounds;
    for (const [k2, v] of Object.entries(p.st)) if (typeof v === "number") c.st[k2] = (c.st[k2] ?? 0) + v;
  }
  return t;
}
const add = (a, b) => { a.dealt += b.dealt; a.taken += b.taken; a.turns += b.turns; for (const [k, c] of Object.entries(b.by)) { const d = (a.by[k] ??= { dealt: 0, taken: 0, turns: 0, st: {} }); d.dealt += c.dealt; d.taken += c.taken; d.turns += c.turns; for (const [k2, v] of Object.entries(c.st)) d.st[k2] = (d.st[k2] ?? 0) + v; } return a; };
const zero = () => ({ dealt: 0, taken: 0, turns: 0, by: {} });

/**
 * A pair of runs: base and changed. opts: { lv, party (builds), changed party, npcs, map, mapB (the changed run's map), inject (fn(world, pick)), round, window, runs }.
 * Returns { base, changed, value: DE per run (dealt more + taken less), se }.
 */
export function pair({ lv = 1, party, partyB = party, npcs, map = S.MAP, mapB = map, inject = null, round = 1, window = P.window, runs = P.runs, seed = 900 }) {
  const A = zero(), B = zero(), diffs = [];
  for (let k = 0; k < runs; k++) {
    const a = totals(S.fight(party, npcs, S.rng(seed + k), { map, immortal: true, streams: true, maxRounds: round + window - 1 }));
    const pick = S.rng(77 + k);   // the creature the condition goes on: its own dice, so both runs keep the same dice
    const b = totals(S.fight(partyB, npcs, S.rng(seed + k), { map: mapB, immortal: true, streams: true, maxRounds: round + window - 1, inject: inject ? { round, fn: w => inject(w, pick) } : null }));
    add(A, a); add(B, b); diffs.push((b.dealt - a.dealt) + (a.taken - b.taken));
  }
  const m = diffs.reduce((s, x) => s + x, 0) / runs, sd = Math.sqrt(diffs.reduce((s, x) => s + (x - m) ** 2, 0) / runs);
  return { base: A, changed: B, value: m, se: sd / Math.sqrt(runs), runs };
}

const rnd = (pick, list) => list[Math.floor(pick() * list.length)];
const upFoes = w => w.foes.filter(f => !f.dead);
const nearestPc = (w, f, cls) => w.pcs.filter(p => !p.down && (!cls || p.build.name.startsWith(cls))).sort((x, y) => S.MAPDIST(f.pos, x.pos) - S.MAPDIST(f.pos, y.pos))[0] ?? (cls ? nearestPc(w, f) : undefined);   // no PC of that class up: any PC (pack R-classes: both Paladins can be Down in round 4)
/** The conditions and Forced Movement priced on one Standard (the NPC prices) and on one PC (the Bestiary's severity check). */
export const ON_NPC = [
  ["Hindered (EoT)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Hindered (EoT)")],
  ["Hindered until it moves (Lock & Loose)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Hindered (until it moves)")],
  ["Immobilized (EoT)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Immobilized (EoT)")],
  ["Immobilized until it escapes (Interact, 1 AP)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Immobilized")],
  ["Prone (Stand, 1 AP)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Prone")],
  ["Slowed 1 (its next turn)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Slowed 1")],
  ["Slowed 2 (its next turn)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Slowed 2")],
  // Pack R-classes (the conditions pass, 2026-11-04): the new conditions, in their raw form (Frightened's Bane only: its "can't move closer" is not modeled).
  ["Dazed 1", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Dazed 1")],
  ["Dazed 2", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Dazed 2")],
  ["Staggered (EoT)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Staggered (EoT)")],
  ["Blinded (EoT)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Blinded (EoT)")],
  ["Frightened (EoT)", (w, p) => S.MAPCOND(rnd(p, upFoes(w)), "Frightened (EoT)")],
  ["Taunted by the nearest Paladin (1 round)", (w, p) => { const f = rnd(p, upFoes(w)); return S.MAPCOND(f, "Taunted (1 round)", nearestPc(w, f, "Paladin")); }],
  ["Bleed 1d4 (Bo/In)", (w, p) => { const f = rnd(p, upFoes(w)); return S.MAPCOND(f, "Bleed 1d4 (Bo/In)", nearestPc(w, f)); }],   // credited to the PC that caused it
  ["Bleed 2d6 (Bo/In)", (w, p) => { const f = rnd(p, upFoes(w)); return S.MAPCOND(f, "Bleed 2d6 (Bo/In)", nearestPc(w, f)); }],
  ["Pushed 1 (from the nearest PC)", (w, p) => { const f = rnd(p, upFoes(w)); const o = nearestPc(w, f); if (o) S.MAPFORCE("push", o, f, 1, w); }],
  ["Pushed 2 (from the nearest PC)", (w, p) => { const f = rnd(p, upFoes(w)); const o = nearestPc(w, f); if (o) S.MAPFORCE("push", o, f, 2, w); }],
  ["Pushed 4 (from the nearest PC)", (w, p) => { const f = rnd(p, upFoes(w)); const o = nearestPc(w, f); if (o) S.MAPFORCE("push", o, f, 4, w); }],
  ["Slid 2 (away from the PCs)", (w, p) => { const f = rnd(p, upFoes(w)); const o = nearestPc(w, f); if (o) S.MAPFORCE("slide", o, f, 2, w); }],
  ["Pulled 2 (toward the nearest Paladin)", (w, p) => { const f = rnd(p, upFoes(w)); const o = nearestPc(w, f, "Paladin"); if (o) S.MAPFORCE("pull", o, f, 2, w); }],
  ["Vulnerable 1 (EoT; E1 prices it 1.23)", (w, p) => { const f = rnd(p, upFoes(w)); f.vulnerable = Math.max(f.vulnerable ?? 0, 1); }],
];
const onPc = (cls, name) => (w, p) => { const list = w.pcs.filter(x => !x.down && x.build.name.startsWith(cls)); if (list.length) S.MAPCOND(rnd(p, list), name); };
const pushPc = (cls, n) => (w, p) => { const list = w.pcs.filter(x => !x.down && x.build.name.startsWith(cls)); if (!list.length) return; const t = rnd(p, list), f = upFoes(w).sort((x, y) => S.MAPDIST(t.pos, x.pos) - S.MAPDIST(t.pos, y.pos))[0]; S.MAPFORCE("push", f, t, n, w); };
export const ON_PC = [
  ["Hindered (EoT) on a Paladin", onPc("Paladin", "Hindered (EoT)"), "Mild"],
  ["Hindered (EoT) on an Archer", onPc("Archer", "Hindered (EoT)"), "Mild"],
  ["Pushed 2 on a Paladin", pushPc("Paladin", 2), "Mild"],
  ["Pushed 2 on an Archer", pushPc("Archer", 2), "Mild"],
  ["Prone on a Paladin", onPc("Paladin", "Prone"), "Moderate"],
  ["Prone on an Archer", onPc("Archer", "Prone"), "Moderate"],
  ["Immobilized (EoT) on a Paladin", onPc("Paladin", "Immobilized (EoT)"), "Moderate"],
  ["Immobilized (EoT) on an Archer", onPc("Archer", "Immobilized (EoT)"), "Moderate"],
  ["Slowed 1 on a Paladin", onPc("Paladin", "Slowed 1"), "Moderate"],
  ["Slowed 1 on an Archer", onPc("Archer", "Slowed 1"), "Moderate"],
  ["Pushed 4 on a Paladin", pushPc("Paladin", 4), "Moderate"],
  ["Immobilized until it escapes, on an Archer", onPc("Archer", "Immobilized"), "Severe"],
  ["Slowed 2 on a Paladin", onPc("Paladin", "Slowed 2"), "Severe"],
];

/** Every price of the level (cached): conditions on an NPC and on a PC by round, rules and builds over rounds 1-4, and the share of each Bane source. */
const CACHE = {};
const JSON_FILE = HERE + "positions.json";
export function prices(lv = 1, { fresh = false } = {}) {
  if (CACHE[lv]) return CACHE[lv];
  if (!fresh && fs.existsSync(JSON_FILE)) { const j = JSON.parse(fs.readFileSync(JSON_FILE, "utf8")); if (j[lv]) return (CACHE[lv] = j[lv]); }
  Object.assign(S.RULES, S.RULES_PRE_R);   // the catch-up (2026-11-12): a pre-R study, pinned only when it measures (rclasses.mjs reads the saved prices under its own rules) (the 5 AP classes of classes/, the rules before pack R); spec.mjs's default is the book today
  const party = partyOf(lv), npcs = npcsOf(lv), out = { lv, npc: [], pc: [], rules: [], builds: [], stats: null };
  const byRound = (name, fn, sign = 1, extra = {}) => { const r = P.rounds.map(round => pair({ lv, party, npcs, inject: fn, round }));
    return { name, rounds: r.map(x => sign * x.value), se: Math.max(...r.map(x => x.se)), avg: sign * r.reduce((s, x) => s + x.value, 0) / r.length, ...extra }; };
  for (const [name, fn] of ON_NPC) out.npc.push(byRound(name, fn));
  for (const [name, fn, sev] of ON_PC) out.pc.push(byRound(name, fn, -1, { sev }));
  // The rules of Chapter 3, priced by turning each off (what it costs the party, so the sign is: on minus off).
  const W4 = { round: 1, window: P.buildWindow };
  const rule = (name, off, who) => { const r = pair({ lv, party, npcs, map: { ...S.MAP, off: { [off]: true } }, mapB: S.MAP, ...W4 });
    out.rules.push({ name, total: r.value / P.buildWindow, se: r.se / P.buildWindow, who }); };
  rule("Ranged while Engaged (2 Banes)", "engaged", "Archer");
  rule("Ranged into melee (1 Bane)", "intoMelee", "Archer");
  rule("Cover (creatures in the line, the map's cover)", "cover", "Archer");
  rule("Range (far 1 Bane, maximum 2)", "range", "Archer");
  rule("Flanking (both sides)", "flank", "Paladin");
  // Builds: a change to one class, priced per turn of that class (the party's gain over the window / the turns of the changed PCs).
  const variant = (name, file, edit, who, note = "", mapB = S.MAP, mapA = S.MAP, baseEdit = null) => {
    const partyB = partyOf(lv, { [file]: edit }), r = pair({ lv, party: baseEdit ? partyOf(lv, { [file]: baseEdit }) : party, partyB, npcs, map: mapA, mapB, ...W4 });
    const turns = (r.changed.by[who]?.turns ?? 1) / r.runs;
    out.builds.push({ name, perTurn: r.value / turns, se: r.se / turns, who, note });
  };
  const add1 = (line, after = /^speed .*$/m) => x => x.replace(after, m => `${m}\n${line}`);
  variant("+1 Speed (Archer 6 → 7)", "archer", x => x.replace(/^speed 6/m, "speed 7"), "Archer");
  variant("-1 Speed (Archer 6 → 5)", "archer", x => x.replace(/^speed 6/m, "speed 5"), "Archer");
  variant("+1 Speed (Paladin 5 → 6)", "paladin-smite", x => x.replace(/^speed 5/m, "speed 6"), "Paladin");
  variant("-1 Speed (Paladin 5 → 4)", "paladin-smite", x => x.replace(/^speed 5/m, "speed 4"), "Paladin");
  variant("The Archer stands and shoots when Engaged (no Kite turn)", "archer", x => x.replace(/^when engaged:.*$/m, ""), "Archer", "the price of stepping away");
  // Talents are not in the class files (Lucas, 2026-10-29): a Talent is priced here by adding it.
  const oa = add1("reaction Opportunity Attack: opportunity");
  variant("Talent: Opportunity Attack added", "paladin-smite", oa, "Paladin", "AP kept after its turn are rare: most turns spend 5");
  variant("Talent: Opportunity Attack, keeping 1 AP for it (its last Weapon Attack dropped)", "paladin-smite", x => oa(x).replace(/^(turn Main: .*), Weapon Attack$/m, "$1"), "Paladin");
  variant("Steady Nerves always on (no Engaged Banes)", "archer", add1("passive Steady Nerves: steady-nerves"), "Archer", "the Archer kites, so it is rarely Engaged when it shoots");
  const noKite = x => x.replace(/^when engaged:.*$/m, "");
  variant("Steady Nerves, an Archer that doesn't kite", "archer", x => add1("passive Steady Nerves: steady-nerves")(noKite(x)), "Archer", "against the same Archer without it", S.MAP, S.MAP, noKite);
  variant("Long Draw (far range no Bane, maximum 1)", "archer", add1("passive Long Draw: long-draw"), "Archer");
  variant("Rolling Shot 1 for the step away (Evade 1 + a Weapon Attack for the Advance's AP)", "archer",
    x => add1("action Rolling Shot 1 | ap 1 | round | traits ranged shot strike weapon | does Weapon Attack | evade 1", /^action Twin Shot.*$/m)(x).replace(/^turn Kite: advance, /m, "turn Kite: Rolling Shot 1, "), "Archer", "the Evade is worth the AP of the step away on the turns the Archer starts Engaged");
  variant("Every Standard has an Opportunity Attack; the Archer still steps away", "archer", x => x, "Archer", "what it costs the party (map npc-reactions standard, elite)", { ...S.MAP, npcReactions: ["standard", "elite"] });
  variant("Every Standard has an Opportunity Attack; Rolling Shot 1 to step away", "archer",
    x => add1("action Rolling Shot 1 | ap 1 | round | traits ranged shot strike weapon | does Weapon Attack | evade 1", /^action Twin Shot.*$/m)(x).replace(/^turn Kite: advance, /m, "turn Kite: Rolling Shot 1, "), "Archer", "against the Advance away, in the same world", { ...S.MAP, npcReactions: ["standard", "elite"] }, { ...S.MAP, npcReactions: ["standard", "elite"] });
  // How often each thing happens (the base runs of the rules window): the share of the Archer's shots with each Bane, how often it starts Engaged.
  const base = pair({ lv, party, npcs, ...W4, runs: 3000 }).base, a = base.by.Archer.st, pal = base.by.Paladin.st;
  out.stats = {
    archerTurns: base.by.Archer.turns, shots: a.shots, engagedShots: a.engagedShots / a.shots, intoMelee: a.intoMelee / a.shots, covered: a.covered / a.shots,
    coverBanes: a.coverBanes / a.shots, rangeBanes: a.rangeBanes / a.shots, mapBanes: a.mapBanes / a.shots, turnsEngaged: a.turnsEngaged / base.by.Archer.turns,
    stillTurns: a.stillTurns / base.by.Archer.turns, archerMoveAP: a.moveAP / base.by.Archer.turns,
    palMoveAP: pal.moveAP / base.by.Paladin.turns, palLostAP: pal.lostAP / base.by.Paladin.turns, flankBoons: pal.flankBoons / Math.max(1, pal.swings), oa: pal.oaMade / base.by.Paladin.turns,
    struckPal: pal.struck / (pal.struck + a.struck), struckArcher: a.struck / (pal.struck + a.struck),
  };
  return (CACHE[lv] = out);
}

/** The price of a debuff name (the catalogues' "debuff ..."), a Forced Movement, or null when it has none. Average over rounds 1 to 3, level 1, scaled by the level's AP. */
export function priceOf(kind, name = "", n = 0) {
  const p = prices(1), find = re => p.npc.find(x => re.test(x.name))?.avg ?? null, nm = String(name).toLowerCase();
  if (kind === "debuff") {
    if (/hindered/.test(nm)) return /until|moves/.test(nm) ? find(/until it moves/) : find(/^Hindered \(EoT\)/);
    if (/immobilized/.test(nm)) return /eot/.test(nm) ? find(/^Immobilized \(EoT\)/) : find(/until it escapes/);
    if (/prone/.test(nm)) return find(/^Prone/);
    const s = nm.match(/slowed (\d)/); if (s) return find(new RegExp(`^Slowed ${s[1]}`));
    return null;
  }
  if (kind === "push" || kind === "slide" || kind === "pull") {   // Pushed 1 to 4 measure about the same (the NPC walks back with its spare AP): one price for any distance
    if (kind === "slide") return find(/^Slid 2/);
    if (kind === "pull") return find(/^Pulled 2/);
    return (find(/^Pushed 1/) + find(/^Pushed 2/) + find(/^Pushed 4/)) / 3;
  }
  return null;
}

/** The report section (econ.mjs puts it in prices.md). */
export function section(lv = 1) {
  const p = prices(lv), f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => `${Math.round(x * 100)}%`, s = p.stats, L = [];
  L.push(`## 5. Positions (pack E2): movement and conditions (level ${lv})`, "",
    `Measured with the map model (\`map.mjs\`; README "The map model"): the party of a Standard day (2 Smite Paladins, 2 Archers) against ${P.encounter.replace(/^4 standard$/, "4 Standards")} that don't die, ${P.runs} pairs of fights with the same dice, the change in one and not the other. **Value = the party's damage dealt more + its damage taken less** (1 Health = 1 DE) over ${P.window} rounds from the round the condition is put on (round 1: the NPCs are closing in; rounds 2 and 3: the lines are in contact). The ± is one standard error.`, "",
    "### What a fight on the map looks like (rounds 1 to 4)", "",
    `| | |`, `|---|---:|`,
    `| Archer: Banes from the map on each shot (average) | ${f2(s.mapBanes)} |`,
    `| ... shots into melee (the target is Engaged with a Paladin: 1 Bane) | ${pc(s.intoMelee)} |`,
    `| ... shots with Cover (a creature in the line, or the map's own cover) | ${pc(s.covered)} (${f2(s.coverBanes)} Banes a shot) |`,
    `| ... Range Banes a shot (far range) | ${f2(s.rangeBanes)} |`,
    `| ... shots while Engaged (2 Banes) | ${pc(s.engagedShots)} |`,
    `| Archer turns that start Engaged (it steps away: the Kite turn) | ${pc(s.turnsEngaged)} |`,
    `| Archer turns it hadn't left its square since its last turn (Patient Hunter) | ${pc(s.stillTurns)} |`,
    `| Archer AP spent moving a turn | ${f2(s.archerMoveAP)} |`,
    `| Paladin AP spent moving a turn (closing in, round 1 mostly) | ${f2(s.palMoveAP)} |`,
    `| Paladin Flanking Boons a Weapon Action | ${f2(s.flankBoons)} |`,
    `| Paladin Opportunity Attacks a turn | ${f2(s.oa)} |`,
    `| NPC Strikes aimed at a Paladin / an Archer (each) | ${pc(s.struckPal / 2)} / ${pc(s.struckArcher / 2)} |`, "");
  L.push("### Conditions and Forced Movement on one NPC (a Standard)", "", "| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Share of 1 AP |", "|---|---:|---:|---:|---:|---:|---:|");
  const perAP = 23.3 / S.RULES_PRE_R.ap;
  for (const x of p.npc) L.push(`| ${x.name} | ${x.rounds.map(f2).join(" | ")} | **${f2(x.avg)}** | ${f2(x.se)} | ${pc(x.avg / perAP)} |`);
  L.push("", "### The same on a PC (what an NPC's condition costs the party), against the Bestiary's severity steps", "",
    "The Bestiary prices a condition on an NPC Action in steps of damage rating (Mild 1, Moderate 2, Severe 3; one step is 20 to 25% of the Action's damage). For a Standard's 2 AP Special (Basic attack × 2.2 against AD 13) one step is about " + f1(stepDE(lv)) + " DE.", "",
    "| Effect | Round 1 | Round 2 | Round 3 | **Average** | ± | Bestiary | In steps |", "|---|---:|---:|---:|---:|---:|---|---:|");
  for (const x of p.pc) L.push(`| ${x.name} | ${x.rounds.map(f2).join(" | ")} | **${f2(x.avg)}** | ${f2(x.se)} | ${x.sev} | ${f1(x.avg / stepDE(lv))} |`);
  L.push("", "### The map's rules (on against off, rounds 1 to 4)", "", "| Rule | What it costs the party a round | ± (per run) | Who it hits |", "|---|---:|---:|---|");
  for (const x of p.rules) L.push(`| ${x.name} | ${f2(-x.total)} | ${f2(x.se)} | ${x.who === "Archer" ? "the Archers' shots" : "both sides' melee"} |`);
  L.push("", "### Builds and Talents (per turn of the changed class, rounds 1 to 4)", "", "| Change | DE a turn | ± | Share of a baseline turn | Note |", "|---|---:|---:|---:|---|");
  for (const x of p.builds) L.push(`| ${x.name} | ${f2(x.perTurn)} | ${f2(x.se)} | ${pc(x.perTurn / 23.3)} | ${x.note} |`);
  L.push("");
  return L.join("\n");
}
/** One Bestiary severity step on a Standard's 2 AP Special: 22.5% of its expected damage against AD 13. */
export function stepDE(lv = 1) { const npc = S.npcOf("standard", "medium", lv); return 0.225 * 2.2 * S.npcStrikeAvg(npc, 13); }

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const runs = process.argv.find(x => /^--runs=\d+$/.test(x)); if (runs) P.runs = Number(runs.slice(7));
  const t0 = Date.now(), p1 = prices(1, { fresh: true });
  fs.writeFileSync(JSON_FILE, JSON.stringify({ 1: p1, measured: new Date().toISOString().slice(0, 10), runs: P.runs }, null, 1));
  console.log(section(1)); console.log(`(${Math.round((Date.now() - t0) / 1000)} s; positions.json written)`);
}
