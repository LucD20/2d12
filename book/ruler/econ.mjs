// The price list of the core rules (pack E1, 2026-10-29): what everything an Action can do is worth, in damage-equivalents (DE), at levels 1 to 3;
// then every Action, Reaction and passive of a class catalogue (book/ruler/catalogue/*.txt) priced against it, with a verdict for its Frequency.
// Exact dice math where it can (calc.mjs tierProbs: 2d12, exploding d12s, Doubles, Boons and Banes as 1d3-1, Favored and Doomed); the fight
// simulation (spec.mjs) for timing (how many turns reach each Escalation). Writes book/ruler/prices.md.
//   node book/ruler/econ.mjs            writes prices.md and prints it
//   node book/ruler/econ.mjs --quiet    writes prices.md only
// What it can't price yet (it needs positions: pack E2) is listed per Action: movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone.
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("./spec.mjs", import.meta.url).href);
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);
const TW = CF.TWOD12, HERE = fileURLToPath(new URL(".", import.meta.url));

/* ------------------------------------------------------------------ the assumptions (each one is in the report) */
export const A = {
  heal: 1.1,              // 1 Health healed = 1.1 DE (Lucas: "a tiny bit higher" than damage)
  downTurns: 1.5,         // a Down prevented or undone = 1.5 turns of a baseline PC (the turns it would lose) + the Health
  vulnAttacks: 2.5,       // attacks the party makes against a Vulnerable target before its turn ends (the fight sim measures 2.6)
  quarryShare: 0.3,       // share of an enemy's Strikes aimed at you (Hunter's Focus reduction)
  rangedShare: 0.3,       // share of NPCs that use [Ranged] Actions (Suppressing Fire)
  othersShare: 0.75,      // share of an enemy's Strikes aimed at someone other than you (Champion's Challenge)
  // The roles (Lucas, 2026-10-29), as shares of the baseline PC: damage a turn, Health.
  roles: { Paladin: { sustained: [0.85, 0.90], nova: [1.5, 1.8], health: [1.20, 1.30], note: "tank and support: more Health, heals and Defense for allies, Nova damage" },
           Archer: { sustained: [1.00, 1.05], nova: [1.1, 1.3], health: [0.80, 0.85], note: "mobile, fragile, constant ranged damage (a future melee class has the top damage: about 1.15)" } },
  bands: { "at-will": [0.9, 1.1], round: [1.0, 1.3], turn: [1.0, 1.3], encounter: [1.4, 2.0], daily: [2.0, 3.0], none: [0.9, 1.1] },
};

/* ------------------------------------------------------------------ the exchange rate at a level */
const npcStrikeAvg = (npc, ad, banes) => { const p = C.tierProbs(npc.mod, ad, 0, banes, ""); return p[1] * npc.t2 + p[2] * npc.t3; };
const npcTurnAvg = (npc, ad, extraBanes = 0) => { let s = 0; for (let k = 0; k < npc.strikes; k++) s += npcStrikeAvg(npc, ad, k + extraBanes); return s; };
const pool = (file, lv) => S.parseSpec(fs.readFileSync(HERE + "classes/" + file, "utf8").replace(/^level \d+$/m, `level ${lv}`), file).pool;
export function rates(lv) {
  const B = TW.pcDamageVsDefense[13] * (TW.npcMeasured.h[lv] ?? 1), npc = S.npcOf("standard", "medium", lv);
  const avgPool = (pool("paladin-2.txt", lv) + pool("archer-2.txt", lv)) / 2;
  return {
    lv, B, perAP: B / 5, npc, avgPool, rallyHeal: Math.ceil(avgPool / 4),
    incoming: npcTurnAvg(npc, 13),                                      // one Standard's turn against AD 13: what a PC takes a round in a normal fight
    def: n => npcTurnAvg(npc, 13) - npcTurnAvg(npc, 13 + n),            // +n Defense for 1 round on one PC
    banes: n => npcTurnAvg(npc, 13) - npcTurnAvg(npc, 13, n),           // n Banes on one enemy's Strikes for its turn
    hits: npc.strikes * (C.tierProbs(npc.mod, 13, 0, 0, "")[1] + C.tierProbs(npc.mod, 13, 0, 0, "")[2]),   // damaging hits of one Standard's turn
    hitAvg: (npc.t2 + npc.t3) / 2,
    down: A.downTurns * B, pDownFight: DAY.pDownFight, pDownDay: DAY.pDownDay, lohPerTurn: DAY.lohPerTurn
  };
}

/* ------------------------------------------------------------------ the value of an Action */
const weaponTraits = b => [...(b.weapon?.traits ?? []).filter(x => x === "ranged" || x === "melee"), ...((b.weapon?.traits ?? []).includes("projectile") ? ["shot"] : [])];
const traitsOf = (b, a) => [...new Set([...a.traits, ...(a.traits.includes("weapon") ? weaponTraits(b) : [])])];
const matches = (b, eff, a) => (!eff.name || a.name.toLowerCase().startsWith(eff.name)) && (eff.traits ?? []).every(t => traitsOf(b, a).includes(t));
/** The Action a "next ..." effect most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the named Action, else the first that fits. */
function refFor(b, eff) {
  const list = Object.values(b.actions).filter(a => (a.tiers || a.does.length) && a.vs !== "none" && !a.vs.startsWith("dc") && matches(b, eff, a));
  return list.find(a => a.name === "Weapon Attack") ?? list.find(a => / 2$/.test(a.name)) ?? list[0] ?? null;
}
const probsOf = (b, a, r, o) => {
  const mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
  if (a.vs.startsWith("save")) return C.tierProbs(r.npc.save?.[a.vs.split(/\s+/)[1] ?? "instinct"] ?? 0, 11 + mod, 0, 0, "");
  return C.tierProbs(mod, a.vs === "wd" ? r.npc.wd : r.npc.ad, o.boons ?? 0, o.banes ?? 0, o.favored ? "favored" : "");
};
/** The average damage of an Action against the level's Standard (AD and WD 13), with extra Boons, Empowered, extra dice or Favored. */
export function dmgOf(b, a, r, o = {}) {
  if (!a) return 0;
  if (a.does.length) {
    const each = { boons: (o.boons ?? 0) + a.each.filter(e => e.kind === "boon").reduce((s, e) => s + e.n, 0), empowered: (o.empowered ?? 0) + a.each.filter(e => e.kind === "empowered").reduce((s, e) => s + e.n, 0), extra: [...(o.extra ?? []), ...a.each.filter(e => e.kind === "extra").map(e => e.dmg)], favored: o.favored };
    return a.does.reduce((s, d) => s + dmgOf(b, b.actions[d.toLowerCase()], r, each), 0) * (a.area > 1 ? a.area : 1);
  }
  if (!a.tiers || a.vs === "none" || a.vs.startsWith("dc")) return 0;
  const p = probsOf(b, a, r, o), mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
  const per = [0, 1, 2].reduce((s, t) => s + p[t] * S.avgDamage(a.tiers[t], b.weapon, t + 1, mod, o.empowered ?? 0, o.extra ?? []), 0);
  return per * (a.area > 1 ? a.area : 1) + a.then.reduce((s, x) => s + dmgOf(b, b.actions[x.toLowerCase()], r), 0);
}
const pDeals = (b, a, r) => { const p = probsOf(b, a, r, {}), mod = a.vs === "wd" ? b.powerMod : b.weaponMod; return [0, 1, 2].reduce((s, t) => s + (S.avgDamage(a.tiers?.[t] ?? S.parseDamage("0"), b.weapon, t + 1, mod) > 0 ? p[t] : 0), 0); };

/** The value of one effect in DE, and a note when part of it can't be priced yet. */
/** What n Boons or Empowered n add to the class's typical turn (catalogue line "turn Typical"), on the Actions the effect fits. */
function onTypical(b, e, r, o) {
  const t = b.turns.typical; if (!t) return 0;
  return t.steps.map(x => b.actions[x.toLowerCase()]).filter(a => a && (matches(b, { ...e, name: "" }, a) || a.does.some(d => matches(b, { ...e, name: "" }, b.actions[d.toLowerCase()]))))
    .reduce((s, a) => s + dmgOf(b, a, r, o) - dmgOf(b, a, r), 0);
}
export function priceEffect(b, a, e, r) {
  const ref = () => refFor(b, e), on = (o) => { const x = ref(); return x ? dmgOf(b, x, r, o) - dmgOf(b, x, r) : 0; };
  const turnMul = (a.rounds ?? 1) * (a.allies ?? 1);
  switch (e.kind) {
    case "boon": return { v: e.scope === "turn" ? onTypical(b, e, r, { boons: e.n }) * turnMul : on({ boons: e.n }) };
    case "bane": return { v: -on({ banes: e.n }) };
    case "empowered": return { v: e.scope === "turn" ? onTypical(b, e, r, { empowered: e.n }) * turnMul : on({ empowered: e.n }) };
    case "favored": return { v: on({ favored: true }) };
    case "extra": { const x = ref(); return { v: x ? S.avgDamage(e.dmg, b.weapon, 2, b.weaponMod) * pDeals(b, x, r) : 0 }; }
    case "vulnerable": return { v: e.n * (dmgOf(b, b.actions["weapon attack"], r, { boons: 1 }) - dmgOf(b, b.actions["weapon attack"], r)) * A.vulnAttacks };
    case "defense": return { v: r.def(e.n) * (e.who === "allies" ? (a.allies ?? 1) : 1) * (a.rounds ?? 1) };
    case "taunt": return { v: r.banes(e.n) * A.othersShare };
    case "banes": return { v: r.banes(e.n) * (e.others ? A.othersShare : 1) * (/ranged/.test(e.text) ? A.rangedShare : 1) * (a.area > 1 ? a.area : 1) * (a.rounds ?? 1) };
    case "heal": return { v: e.n * r.rallyHeal * A.heal, note: a.name.startsWith("Lay On Hands") || a.name.startsWith("Steel") ? "uses the target's own Rally Points" : "" };
    case "healdice": return { v: S.avgDamage(e.dmg, null, 2, 0) * (a.allies ?? 1) * (a.rounds ?? 1) * A.heal };
    case "reducefrom": return { v: e.n * r.hits * A.quarryShare * (a.rounds ?? 1) };
    case "revive": case "prevent-down": { const pDown = a.freq === "daily" ? r.pDownDay : r.pDownFight;
      return { v: r.down * pDown, note: `a Down undone or prevented: ${r.down.toFixed(0)} DE a use, x ${Math.round(pDown * 100)}% (how often an ally goes Down ${a.freq === "daily" ? "in a day" : "in a fight"})` }; }
    case "debuff": return /next Save/.test(e.name) ? { v: 0.2 } : { v: 0, e2: e.name };
    case "evade": case "push": return { v: 0, e2: `${e.kind === "evade" ? "Evade" : "Push"} ${e.n}` };
    case "cover": return { v: 0, e2: "ignores Cover" };
    case "range": return { v: 0, e2: "range" };
    case "save-boon": return { v: 0, e2: "Boon on Saves (NPC Save Actions are not modeled)" };
    case "remove-effect": return { v: 0, e2: "ends an effect" };
    case "note": return { v: 0, e2: e.text || "not modeled" };
    case "area": case "reload": return { v: 0 };
    default: return { v: 0, e2: e.kind };
  }
}
/** Damage + effects of an Action (each effect weighted by the chance of its tier; target effects times the creatures reached). */
export function valueOf(b, a, r) {
  const dmg = dmgOf(b, a, r), e2 = [], notes = [];
  let fx = 0;
  const p = a.tiers && a.vs !== "none" && !a.vs.startsWith("dc") ? probsOf(b, a, r, {}) : null;
  const perTarget = new Set(["vulnerable", "taunt", "debuff"]);
  for (const { min, max, effect } of a.effects) {
    const w = p ? p.slice(min - 1, max).reduce((s, x) => s + x, 0) : (a.does.length && min > 1 ? 0.72 : 1);
    const pr = priceEffect(b, a, effect, r);
    fx += w * pr.v * (perTarget.has(effect.kind) && a.area > 1 ? a.area : 1);
    if (pr.e2) e2.push(pr.e2); if (pr.note) notes.push(pr.note);
  }
  return { dmg, fx, total: dmg + fx, e2: [...new Set(e2)], notes: [...new Set(notes)] };
}

/* ------------------------------------------------------------------ timing and how often things happen: the Standard day of fights.txt */
// The level 1 party through the first `day` of fights.txt: the share of rounds at each Escalation, how often an ally goes Down, how often Lay On Hands is used.
const DAY = (() => {
  const cls = name => S.parseSpec(fs.readFileSync(HERE + "classes/" + name, "utf8"), name);
  const fights = S.parseFights(fs.readFileSync(HERE + "fights.txt", "utf8")), d = fights.days[0];
  const party = [cls("paladin-1.txt"), cls("paladin-1.txt"), cls("archer-1.txt"), cls("archer-1.txt")], R = S.rng(17), byRound = [];
  let fightsRun = 0, fightsDown = 0, daysDown = 0, loh = 0, turns = 0; const real = {};
  const n = 800;
  for (let k = 0; k < n; k++) {
    const res = S.day(party, d.fights.map(f => f.map(x => S.npcOf(x.role, x.rating, 1))), R);
    for (const f of res.fights) { fightsRun++; if (f.firstDown) fightsDown++; for (let rr = 1; rr <= f.rounds; rr++) byRound[rr] = (byRound[rr] ?? 0) + 1; }
    if (res.pcs.some(p => p.st.downs)) daysDown++;
    loh += res.pcs.reduce((s, p) => s + p.st.rpByAlly, 0); turns += res.pcs.filter(p => p.build.name === "Paladin").reduce((s, p) => s + p.st.rounds, 0);
    for (const p of res.pcs) { const c = (real[p.build.name] ??= { dealt: 0, turns: 0 }); c.dealt += p.st.dealt; c.turns += p.st.rounds; }
  }
  const total = byRound.reduce((s, x) => s + (x ?? 0), 0);
  return { name: d.name, esc: [0, 1, 2, 3].map(e => byRound.reduce((s, x, rr) => s + (rr >= e + 1 ? (x ?? 0) : 0), 0) / total),   // share of rounds at Escalation >= e
    pDownFight: fightsDown / fightsRun, pDownDay: daysDown / n, lohPerTurn: loh / turns, real: Object.fromEntries(Object.entries(real).map(([k, v]) => [k, v.dealt / v.turns])) };
})();
export const escalationShare = () => DAY.esc;

/* ------------------------------------------------------------------ the report */
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : "-"), f2 = x => (Number.isFinite(x) ? x.toFixed(2) : "-"), pc = x => `${Math.round(x * 100)}%`;
function verdict(eff, freq) {
  const [lo, hi] = A.bands[freq] ?? A.bands.round;
  return eff < lo * 0.9 ? "**under**" : eff > hi * 1.1 ? "**over**" : eff < lo ? "a little under" : eff > hi ? "a little over" : "on target";
}
const t0 = (b, k) => b.unloadedTurn === k || b.whenSelf?.turn === k;
export function report() {
  const L = [], R = [1, 2, 3].map(rates), esc = escalationShare();
  const load = f => S.parseSpec(fs.readFileSync(HERE + "catalogue/" + f, "utf8"), `catalogue/${f}`);
  const cats = ["paladin.txt", "archer.txt"].map(load);
  L.push("# The price list of the core rules (pack E1)", "", "Written by `node book/ruler/econ.mjs` from the class catalogues (`book/ruler/catalogue/*.txt`) and the system's dice math. Don't edit this file: edit those and run it again.", "");
  L.push("Everything is priced in **damage-equivalents (DE)**: average damage against the level's Medium Standard (AD and WD 13, Saves +1, Body +2), with Weapon and Power Modifier +2 (no Attribute growth in levels 1 to 3 yet).", "");
  // 1. The exchange rate.
  L.push("## 1. The exchange rate", "", "| | Level 1 | Level 2 | Level 3 | Where it comes from |", "|---|---:|---:|---:|---|");
  const row = (n, fn, src) => L.push(`| ${n} | ${R.map(r => f2(fn(r))).join(" | ")} | ${src} |`);
  row("A baseline PC's damage a turn (Defense 13)", r => r.B, "the Bestiary's PC baseline (config pcDamageVsDefense, x the level's measured growth)");
  row("**1 AP** (the baseline turn / 5)", r => r.perAP, "the price of one Action Point");
  row("A Paladin Weapon Attack (Greatsword)", r => dmgOf(cats[0], cats[0].actions["weapon attack"], r), "exact");
  row("An Archer Weapon Attack (Crossbow)", r => dmgOf(cats[1], cats[1].actions["weapon attack"], r), "exact");
  row("A Standard's turn against AD 13", r => r.incoming, "exact: 2 Strikes, the 2nd with 1 Bane; what a PC takes a round in a normal fight (CV 1 per PC)");
  row("A Rally Point (Health it heals)", r => r.rallyHeal, "ceil(Pool / 4), the average Pool of the Paladin and the Archer");
  row("1 Health healed", () => A.heal, "Lucas: a little more than 1 damage");
  row("A Down prevented or undone", r => r.down, `${A.downTurns} baseline turns (the turns it would lose), plus the Health`);
  L.push("");
  L.push(`**Escalation timing** (the ${DAY.name} of fights.txt, level 1 party, simulated): share of the rounds at Escalation 0 or more: ${pc(esc[0])}; 1 or more: ${pc(esc[1])}; 2 or more: ${pc(esc[2])}; **3 or more: ${pc(esc[3])}**. An Escalation 1 ability is there for about ${pc(esc[1])} of the turns, an Escalation 3 one for ${pc(esc[3])}. In the same day an ally goes Down in ${pc(R[0].pDownFight)} of the fights and on ${pc(R[0].pDownDay)} of the days; a Paladin uses Lay On Hands on ${pc(R[0].lohPerTurn)} of its turns.`, "");
  // 2. The price list.
  const r1 = R[0], pal = cats[0], arc = cats[1], wa = b => b.actions["weapon attack"];
  const on = (b, o, r = r1) => dmgOf(b, wa(b), r, o) - dmgOf(b, wa(b), r);
  L.push("## 2. The price list (level 1; DE, and as a share of what it modifies)", "", "| Effect | DE | Share | Notes |", "|---|---:|---:|---|");
  const P = (n, v, share, note = "") => L.push(`| ${n} | ${f2(v)} | ${share} | ${note} |`);
  P("+1 Boon on a Weapon Attack (Paladin / Archer)", (on(pal, { boons: 1 }) + on(arc, { boons: 1 })) / 2, pc(on(pal, { boons: 1 }) / dmgOf(pal, wa(pal), r1)), "+1 Modifier and -1 target Defense are the same");
  P("+2 Boons", (on(pal, { boons: 2 }) + on(arc, { boons: 2 })) / 2, pc(on(pal, { boons: 2 }) / dmgOf(pal, wa(pal), r1)), "");
  P("+1 Bane", -(on(pal, { banes: 1 }) + on(arc, { banes: 1 })) / 2 * -1, pc(on(pal, { banes: 1 }) / dmgOf(pal, wa(pal), r1)), "");
  P("Favored", (on(pal, { favored: true }) + on(arc, { favored: true })) / 2, pc(on(pal, { favored: true }) / dmgOf(pal, wa(pal), r1)), "about 3.7 Boons");
  P("Empowered 1 on a Greatsword / Crossbow Weapon Attack", on(pal, { empowered: 1 }), `${pc(on(pal, { empowered: 1 }) / dmgOf(pal, wa(pal), r1))} / ${pc(on(arc, { empowered: 1 }) / dmgOf(arc, wa(arc), r1))}`, `Crossbow ${f2(on(arc, { empowered: 1 }))}: +1 a die that lands, so more dice = more value`);
  P("Vulnerable 1 (until the target's turn ends)", priceEffect(pal, wa(pal), { kind: "vulnerable", n: 1 }, r1).v, "-", `${A.vulnAttacks} party attacks reach it`);
  P("+1 Defense for 1 round on one ally", r1.def(1), pc(r1.def(1) / r1.incoming), "of what it would take that round; +2: " + f2(r1.def(2)));
  P("1 Bane on one enemy's Strikes for its turn", r1.banes(1), pc(r1.banes(1) / r1.incoming), "the same as +1 Defense for everyone it attacks");
  P("A Rally Point used in a fight", r1.rallyHeal * A.heal, "-", "Steel Yourself pays 2 AP for it: " + f2(r1.rallyHeal * A.heal / 2) + " DE per AP");
  P("A Down prevented or undone", r1.down, "-", "");
  L.push("", `**Frequency bands** (DE per AP, divided by the price of 1 AP): At-will ${A.bands["at-will"].join(" to ")}, Round and Turn ${A.bands.round.join(" to ")}, Encounter ${A.bands.encounter.join(" to ")}, Daily ${A.bands.daily.join(" to ")}. An At-will Action takes a Bane on each use after the first, so its first use can sit at the top. A **0 AP** Action is priced per use as a share of a baseline turn. Verdict: **under** or **over** when more than 10% outside its band; **+ E2** when part of its value (movement, Evade, Push, Cover, range, Hindered, Immobilized, Prone, Saves) can't be priced before pack E2, so the verdict isn't final.`, "");
  // Role budgets.
  L.push("## 3. The role budgets (level 1 and 2 builds of `classes/`)", "", "Baseline Health: the average Health Pool of the Paladin and the Archer builds at the level. Sustained (Esc 0): the best turn with no Encounter or Daily Action and no Escalation (a Reload Shot turn is left out: it needs a Reload turn after it); with Escalation: the best turn available at each Escalation, weighted by the share of the rounds at it; Nova: the best turn with an Encounter or Daily Action. Real: the damage a turn in the simulated day (openings, heals and Steel Yourself turns included; level 1).", "",
    "| Build | Sustained (Esc 0) | Sustained (with Escalation) | Nova | Real (the day) | Health | Budget: sustained / Nova / Health | Verdict |", "|---|---:|---:|---:|---:|---:|---|---|");
  for (const file of ["paladin-1", "archer-1", "paladin-2", "archer-2"]) {
    const b = S.parseSpec(fs.readFileSync(HERE + `classes/${file}.txt`, "utf8"), file), r = R[b.level - 1], role = A.roles[b.name];
    const rows = Object.entries(b.turns).map(([k, t]) => {
      const acts = t.steps.map(x => b.actions[x.toLowerCase().replace(/\s*\(.*\)$/, "")]).filter(Boolean);
      const esc = Math.max(0, ...acts.map(a => a.escalation)), nova = acts.some(a => a.freq === "encounter" || a.freq === "daily"), heal = acts.some(a => a.effects.some(e => e.effect.kind === "heal"));
      return { k, esc, nova, heal, v: S.turnDamage(b, k, 13, { n: 6000, escalation: esc }) };
    }).filter(x => !x.v.problems.length && !x.heal && !t0(b, x.k) && !b.turns[x.k].steps.some(st => /reload shot/i.test(st)));
    const best = list => list.reduce((m, x) => Math.max(m, x.v.avg), 0);
    // With Escalation: the best turn available at each Escalation, weighted by the share of the rounds spent at it.
    const at = e => rows.filter(x => !x.nova && x.esc <= e).reduce((m, x) => Math.max(m, S.turnDamage(b, x.k, 13, { n: 6000, escalation: e }).avg), 0), sh = [0, 1, 2, 3].map(e => esc[e] - (esc[e + 1] ?? 0));   // passives count at that Escalation too
    const s0 = at(0), sE = [0, 1, 2, 3].reduce((s, e) => s + sh[e] * at(e), 0), nv = best(rows.filter(x => x.nova));
    const baseHealth = r.avgPool, real = b.level === 1 ? DAY.real[b.name] : NaN;
    const fit = (x, [lo, hi]) => (x < lo * 0.97 ? "low" : x > hi * 1.03 ? "high" : "ok");
    const v = [`sustained ${fit(sE / r.B, role.sustained)} (${pc(sE / r.B)})`, `Nova ${nv ? fit(nv / r.B, role.nova) + ` (${pc(nv / r.B)})` : "none"}`, `Health ${fit(b.pool / baseHealth, role.health)} (${pc(b.pool / baseHealth)})`];
    L.push(`| ${b.name} L${b.level} | ${f1(s0)} (${pc(s0 / r.B)}) | ${f1(sE)} (${pc(sE / r.B)}) | ${nv ? `${f1(nv)} (${pc(nv / r.B)})` : "-"} | ${Number.isFinite(real) ? `${f1(real)} (${pc(real / r.B)})` : "-"} | ${b.pool} (${pc(b.pool / baseHealth)}) | ${pc(role.sustained[0])}-${pc(role.sustained[1])} / ${pc(role.nova[0])}-${pc(role.nova[1])} / ${pc(role.health[0])}-${pc(role.health[1])} | ${v.join("; ")} |`);
  }
  L.push("", `Roles: Paladin: ${A.roles.Paladin.note}. Archer: ${A.roles.Archer.note}.`, "");
  // 4. The audit.
  for (const b of cats) {
    L.push(`## 4. ${b.name}: every Action (level 1; efficiency also at levels 2 and 3)`, "", "| Action | AP | Frequency | Esc | Damage | Effects | Total DE | DE / AP | Efficiency L1 | L2 | L3 | Verdict (L1) | Not priced yet (E2) / notes |", "|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|");
    for (const a of Object.values(b.actions)) {
      if (!a.ap && !a.escalation && a.name !== "Smite Light") continue;
      if (a.name === "Smite Light") continue;   // counted inside Smite 3
      const v = R.map(r => valueOf(b, a, r)), freq = a.freq;
      const eff = R.map((r, i) => (a.ap ? v[i].total / a.ap / r.perAP : v[i].total / r.B));
      let verd = a.ap ? verdict(eff[0], freq) : (eff[0] > 0.25 ? "**over** (0 AP: >25% of a turn)" : eff[0] < 0.08 ? "under (0 AP: <8% of a turn)" : "on target (0 AP)");
      if (a.name === "Reload") verd = "a cost (of a Reload Shot)";
      else if (v[0].e2.length && !/over/.test(verd)) verd += " + E2";   // part of its value needs positions: not final
      const extra = [...v[0].e2.map(x => `E2: ${x}`), ...v[0].notes, a.reaction ? "Reaction: needs AP kept after your turn" : "", a.escalation ? `there in ${pc(esc[Math.min(3, a.escalation)])} of the rounds` : ""].filter(Boolean).join("; ");
      L.push(`| ${a.name}${a.reaction ? " (R)" : ""} | ${a.ap} | ${freq} | ${a.escalation || ""} | ${f1(v[0].dmg)} | ${f1(v[0].fx)} | ${f1(v[0].total)} | ${a.ap ? f2(v[0].total / a.ap) : "-"} | ${a.ap ? f2(eff[0]) : pc(eff[0]) + " of a turn"} | ${a.ap ? f2(eff[1]) : pc(eff[1])} | ${a.ap ? f2(eff[2]) : pc(eff[2])} | ${verd} | ${extra} |`);
    }
    L.push("");
    // Passives.
    L.push(`**${b.name} passives** (DE a turn, weighted by the share of the rounds at its Escalation):`, "", "| Passive | Esc | DE a turn (when on) | Weighted | Share of a baseline turn | How / not priced |", "|---|---:|---:|---:|---:|---|");
    for (const p of b.passives) {
      const e = p.effect, w = esc[Math.min(3, p.escalation)];
      let v = 0, how = "";
      if (e.kind === "boon" && e.quarry) { v = onTypical(b, e, r1, { boons: e.n }); how = `the typical turn's Shot Strikes against the quarry, +${e.n} Boon each`; }
      else if (e.kind === "boon" && e.scope === "next" && !e.quarry) { v = on(b, { boons: e.n }) / 3; how = "about once a fight (a third of the turns)"; }
      else if (e.kind === "boon") { v = onTypical(b, e, r1, { boons: e.n }); how = "the typical turn's Shots; only while you don't leave your square: against the Archer's role (mobile)"; }
      else if (e.kind === "extra") { v = S.avgDamage(e.dmg, null, 2, 0) * pDeals(b, wa(b), r1); how = "the first qualifying hit each round"; }
      else if (e.kind === "reduce") { v = Math.min(e.n, r1.hitAvg) * r1.hits * (1.5 + 1); how = "Body damage: you (chosen 1.5 times as often) and one adjacent ally; only while you don't leave your square"; }
      else if (e.kind === "empowered") { const s2 = b.actions["smite 2"]; v = s2 ? (dmgOf(b, s2, r1, { empowered: e.n }) - dmgOf(b, s2, r1)) : 0; how = `${f1(v)} a Smite after a Lay On Hands that heals; weighted by Lay On Hands on ${pc(r1.lohPerTurn)} of the turns`; v *= r1.lohPerTurn; }
      else { how = `E2 / not modeled: ${e.text || (e.kind === "save-boon" ? "Boon on Saves" : e.kind)}`; }
      L.push(`| ${p.name} | ${p.escalation || ""} | ${f1(v)} | ${f1(v * w)} | ${pc((v * w) / r1.B)} | ${how} |`);
    }
    L.push("");
  }
  L.push("## Assumptions", "", ...Object.entries(A).filter(([k]) => k !== "bands").map(([k, v]) => `- \`${k}\`: ${v}`), "- Areas: the catalogues write `area N` as the creatures reached (Emanation 1: 1.5, 2: 2, 3: 2.5 of a normal fight's 4 enemies) and `allies N` as the allies reached (Aura 1: 1.5, Aura 2: 2.5, Aura 3: 3, you included).", "- A \"next ...\" effect is priced on the Action it most likely lands on: a Weapon Attack if it fits, else the 2 AP Version of the Action it names (Smite 2).", "- Divine Retribution: Weapon mode 2R, Power mode 3R (the card has 2 / 3R and two columns).", "");
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const text = report();
  fs.writeFileSync(HERE + "prices.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
}
