// SIM-1 (2026-11-12): the encounter engine: the round and turn loop on the open field, Reactions, the NPCs' turns, days.
// Moved here from spec.mjs; the decisions it used to make inline are in policy.mjs, and every thing that happens is written to the fight's log.
import { RULES, C, CF, TW, RR, MP, rng, pick, pickU, rollDamage, parseDamage, npcDamage, guardPerAp } from "./core.mjs";
import { runTurn, group } from "./turn.mjs";
import { planPolicy } from "./policy.mjs";

export const npcAvg = (f, tier) => (tier < 2 ? 0 : tier === 2 ? f.t2 : f.t3);
/**
 * One NPC Strike against a PC. One random number decides the tier with and without the PC's Defense bonus (the difference, in average damage,
 * is credited to the bonus's giver), then damage reduction (Hallowed Stance) is applied and credited to the PC. Returns the damage taken.
 */
export const npcStrike = (R, f, t, banes, escalation = 3, pcs = [], boons = 0, block = null, doomed = false) => {
  // Damage reduction: its own passive, or an adjacent ally's (Hallowed Stance: "you and your adjacent allies"; the sim makes N allies adjacent for the fight).
  let reduce = t.build.passives.filter(p => p.effect.kind === "reduce" && escalation >= p.escalation && (!t.stanceOff || p.effect.always)).reduce((s, p) => Math.max(s, p.effect.n), 0), reducer = null;   // "if you haven't left your square since your last turn"
  for (const g of pcs) if (g !== t && !g.down && g.adjacent?.includes(t)) for (const p of g.build.passives) if (p.effect.kind === "reduce" && p.effect.adjacent && (!g.stanceOff || p.effect.always) && (g.esc ?? 0) >= p.escalation && p.effect.n > reduce) { reduce = p.effect.n; reducer = g; }
  const zb = f.zone && f.zone.left > 0 ? f.zone.n : 0;   // Consecrated Ground: Banes on its Strikes while it stands in the area
  const def = ((f.curPower ?? f.power) ? t.build.wd : t.build.ad) + (t.defBonus ?? 0) + (t.passiveDef ?? 0);   // curPower: an Action with its own Defense (the Bestiary's turn budget)   // pack R-bestiary: a `power` NPC rolls against Ward Defense
  const fr = f.cond?.frightened ? 1 : 0, st = f.cond?.blinded || doomed ? "doomed" : "";   // pack R-classes: Frightened's Bane, Blinded's Doomed; the catch-up: High cover's Doomed
  const u = R(), tier = f.forceTier ?? pickU(u, C.tierProbs(f.mod, def, boons, banes + zb + fr, st));   // forceTier: a Save Action's Tier, rolled by the PC
  f.lastTier = tier;   // for the log
  if (t.defBonus && t.defBy?.st) t.defBy.st.defCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def - t.defBonus, boons, banes + zb, ""))) - npcAvg(f, tier);
  if (zb && f.zone.by?.st) f.zone.by.st.baneCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def, boons, banes, ""))) - npcAvg(f, tier);
  let d = npcDamage(R, f, tier);
  if (d > 0 && block?.half) { const b = Math.floor(d / 2); d -= b; block.by.st.blockCredit += b; }   // Covering Shot's Tier 3
  else if (d > 0 && block) { const roll = rollDamage(R, block.dmg, { mod: block.by.build.powerMod }).total, b = Math.min(d, roll); d -= b; block.by.st.blockCredit += b; block.used();
    if (block.spill && roll - b > (t.guard ?? 0)) { t.guard = roll - b; t.guardBy = block.by; } }   // pack R prep: the rest of the block becomes Guard on the target (Stacking: the higher value counts)   // pack R prep: a blocking Reaction (Shield of Faith) on a hit that lands
  const afterReduce = d > 0 ? Math.max(0, d - reduce) : 0;
  const absorbed = Math.min(t.guard ?? 0, afterReduce), apAbs = Math.min(t.apGuard ?? 0, afterReduce - absorbed), taken = afterReduce - absorbed - apAbs;   // Guard takes the damage first
  if (absorbed) { t.guard -= absorbed; if (t.guardBy?.st) t.guardBy.st.guardCredit += absorbed; }
  if (apAbs) { t.apGuard -= apAbs; if (t.st) t.st.apGuardUsed += apAbs; }   // pack R prep: the Guard of unspent AP (it adds to the other Guard)
  if (t.st) { t.st.incoming += d; t.st.reduced += d - afterReduce; t.st.taken += taken; }
  if (reducer?.st) reducer.st.reducedGiven += d - taken;
  return taken;
};

/**
 * The attacks an NPC makes with `ap` AP (pack R, RULES.npcSpecials; the same order as the map's turn): its Encounter Special once, its Round Special
 * once a round (twice at Elite Escalation 2), then Basic attacks with the At-will Bane; 3 Strikes at most. It moves f.encUsed / f.roundSpecialN / f.firstAtk.
 * Returns [{ k: At-will Banes, mult: the damage multiplier, boons: Elite Escalation 1's Boon on its first attack }].
 */
export function kitSeq(f, ap) {
  const out = []; let basics = 0;
  for (let s = 0; s < 3 && ap > 0; s++) {
    const enc = f.kit.enc && !f.encUsed && ap >= f.kit.enc.ap ? f.kit.enc : null, rnd = !enc && f.kit.round && (f.roundSpecialN ?? 0) < RR.eliteRoundSpecials(f.esc, RULES.eliteRungs) && ap >= f.kit.round.ap ? f.kit.round : null, sp = enc ?? rnd;
    const boons = f.firstAtk ? RR.eliteFirstAttackBoons(f.esc, RULES.eliteRungs) : 0; f.firstAtk = false;
    if (sp) { ap -= sp.ap; if (enc) f.encUsed = true; else f.roundSpecialN = (f.roundSpecialN ?? 0) + 1; out.push({ k: 0, mult: sp.mult * RULES.npcSpecials, boons }); }
    else { ap--; out.push({ k: basics++, mult: 1, boons }); }
  }
  return out;
}
/** An NPC's attacks in a turn where it doesn't move: its Bestiary Strikes (before pack R), or everything its AP buys (kitSeq). */
export const npcSeq = f => (RULES.npcSpecials && f.kit ? kitSeq(f, f.apMax) : Array.from({ length: f.strikes }, (_, k) => ({ k, mult: 1, boons: 0 })));
/** An NPC's average damage a turn to this PC (the PC's AD; no damage reduction: Escalation 0). Before pack R: its Strikes with the At-will Banes. With the
 *  Specials (pack R): a turn in which it doesn't move, its Round Special and Basic attacks (no Encounter Special, no Elite Escalation). */
export function npcTurn(npc, build, n = 20000) {
  const R = rng(5), me = { build }; let sum = 0;
  for (let k = 0; k < n; k++) { const f = { ...npc, encUsed: true, roundSpecialN: 0, firstAtk: false }; for (const a of npcSeq(f)) { f.curMult = a.mult; sum += npcStrike(R, f, me, a.k, 0, [], a.boons); } }
  return sum / n;
}

/** A PC's state across a day: its damage, Rally Points, and what it did (st). */
export const pcState = b => ({ build: b, damage: 0, mindDamage: 0, down: false, rallyLeft: b.rallyPoints, defBonus: 0, defBy: null,
  st: { bleedDealt: 0, dealt: 0, counted: 0, mindTaken: 0, strainedTurns: 0, rounds: 0, novaDealt: 0, novaTurns: 0, incoming: 0, reduced: 0, reducedGiven: 0, taken: 0, defCredit: 0, vulnCredit: 0, surgeCredit: 0, guardCredit: 0, blockCredit: 0, apGuardGiven: 0, apGuardUsed: 0, apLeft: 0, hookCrit: 0, hookClass: 0, specials: 0, reactionDealt: 0, mindDealt: 0, bloodiedTurns: 0, escTurns: [0, 0, 0, 0], baneCredit: 0, healGiven: 0, mendGiven: 0, mercyGiven: 0, rpSelf: 0, rpByAlly: 0, rpBetween: 0, downs: 0, debuffs: {},
    shots: 0, engagedShots: 0, intoMelee: 0, covered: 0, coverBanes: 0, rangeBanes: 0, turnsEngaged: 0, stillTurns: 0, struck: 0, mapBanes: 0, swings: 0, flankBoons: 0, outOfReach: 0, moveAP: 0, lostAP: 0, charges: 0, reactions: 0, oaMade: 0, oaReal: 0, oaDealt: 0, oaDisrupt: 0, oaTaken: 0, oaTakenDmg: 0, carefulSteps: 0, condApplied: 0, forced: 0 } });
/** The most a PC heals more per Rally Point from a party member's passive (Font of Mercy; the best one, they don't stack), and who gives it. */
export const rallyBonus = (pcs, t, inCombat = true) => { let n = 0, by = null; for (const g of pcs) if (!g.down || g === t) for (const p of g.build.passives) if (p.effect.kind === "rallybonus" && p.effect.n > n && (inCombat ? (g.esc ?? 0) : 0) >= p.escalation) { n = p.effect.n; by = g; } return { n, by }; };   // an Escalation passive works only in a fight (Escalation is 0 between fights)

/**
 * A fight: the party (builds, or PC states carried through a day) against NPCs. A PC already at its Health Pool starts Down and stays out.
 * opts: maxRounds; map (the map model's settings, map.mjs MAP; `map.on` false = the old fight with no positions); immortal (the NPCs never
 * die: econ.mjs measures a window of rounds with it); inject { round, fn(W) } (called at the start of that round: econ.mjs puts a condition on).
 * Returns { rounds, won, lost: share of the party's Health lost in this fight, downs, firstDown, wipe, downBy, pcs, W }.
 */
export function fight(party, npcs, R, { maxRounds = 12, map = MP.MAP, immortal = false, inject = null, streams = false, policy = planPolicy, npcPolicy = null, log = false } = {}) {
  const P = policy, PN = npcPolicy ?? policy, events = log ? [] : null;   // SIM-3: the party's decisions and the enemies' (the same policy unless npcPolicy is given)
  const M = map?.on ? map : null;
  const pcs = party.map(p => (p.build ? p : pcState(p)));
  for (const p of pcs) { if (p.build0) p.build = p.build0; else if (p.alt) p.build0 = p.build; p.switched = false; }   // candidate E: back to the first weapon at the start of a fight
  for (const p of pcs) { p.leftSquare = null; p.zoneHeal = null; p.guard = 0; p.guardBy = null; p.down = p.damage >= p.build.pool; p.defBonus = 0; p.defBy = null; p.spent = new Set([...(p.spent ?? [])].filter(g => p.build.actions[Object.keys(p.build.actions).find(k => group(k) === g)]?.freq === "daily")); p.quarry = null; p.unloaded = false; p.startDamage = p.damage; p.esc = p.startEsc ?? RULES.startEsc; p.floorUsed = false; p.elusiveRound = null; p.encFx = []; p.mindDamage = Math.min(p.mindDamage ?? 0, p.damage); p.bloodiedRound = p.damage - p.mindDamage >= p.build.bodyHealth ? 0 : null; p.strainedRound = p.mindDamage >= p.build.mindHealth ? 0 : null; p.keptAP = RULES.reactFromStart ? RULES.reactionAp : RR.reactionAPAt(false); p.blockedFor = null; p.apGuard = 0; p.turnKept = 0; p.hooked = {}; p.stanceOff = false; }
  const foes = npcs.map(n => ({ ...n, damage: 0, mindDamage: 0, dead: false, vulnerable: 0, surge: null, zone: null, bloodiedRound: null, strainedRound: null, deadRound: null, encUsed: false, roundSpecial: 0, roundSpecialN: 0, esc: 0, firstAtk: false, encBack: false, escTurns: [0, 0, 0, 0], ...(immortal ? { pool: 1e9, bodyPool: 1e9, mindPool: 1e9 } : {}) }));
  // Adjacent allies (Hallowed Stance): the N allies most often in front (highest "targeted"), fixed for the fight (the map model: the allies really adjacent).
  for (const p of pcs) { const k = Math.max(0, ...p.build.passives.filter(x => x.effect.kind === "reduce").map(x => x.effect.adjacent)); p.adjacent = pcs.filter(x => x !== p).sort((x, y) => y.build.targeted - x.build.targeted).slice(0, k); p.reduceAdj = k; }
  // The map model: positions, Speed, conditions, AP kept for Reactions.
  const W = M ? { pcs, foes, R, M } : null;
  // SIM-2: a Collision (Forced Movement into a wall or a creature, on a map): its damage is the mover's, and it is written to the log.
  if (W) W.onCollision = (origin, t, dmg, other) => { if (origin?.st) { origin.st.dealt += t.build ? 0 : dmg; origin.st.collision = (origin.st.collision ?? 0) + dmg; } ev("collision", { who: nameOf(t), into: other ? nameOf(other) : "a wall", damage: dmg, by: origin ? nameOf(origin) : null }); };
  if (M) {
    for (const p of pcs) { p.side = "pc"; p.cond = MP.noCond(); p.melee = !(p.build.weapon?.traits ?? []).includes("ranged"); p.range = p.build.weapon?.range ?? (p.melee ? [1] : M.npcRange); p.speed = p.build.speed ?? 5; }
    for (const f of foes) { f.side = "npc"; f.cond = MP.noCond(); f.melee = !f.ranged; f.range = f.ranged ? M.npcRange : [1]; f.speed ??= 5; f.apMax ??= RULES.npcAp; f.apDebt = 0; f.oa = RULES.oaAll ? f.melee && RULES.npcOa !== false : RULES.npcOa !== false && M.npcReactions.includes(f.role);   /* Stage 0 (npcOa off): no NPC has one */ /* the catch-up: every creature has the Opportunity Attack (a ranged NPC's is not modeled) */ f.reactAP = RULES.reactFromStart ? RULES.npcReactionAp : RR.reactionAPAt(false); }
    MP.place(pcs, foes, M);
  }
  const order = [...pcs.map(p => ({ pc: p })), ...foes.map(f => ({ npc: f }))];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }   // initiative
  if (RULES.minionSquad) {   // a measurement (Lucas, 2026-11-12; off by default): Minions act in squads of this many that share one turn slot (Infinity: all of them); minionSquadFirst: the squads act before everyone
    const ms = order.filter(o => o.npc?.role === "minion"), rest = order.filter(o => o.npc?.role !== "minion"), size = Math.min(ms.length || 1, RULES.minionSquad);
    for (let k = 0; k < ms.length; k += size) rest.splice(RULES.minionSquadFirst ? 0 : Math.floor(R() * (rest.length + 1)), 0, { squad: ms.slice(k, k + size) });
    order.length = 0; for (const o of rest) if (o.squad) order.push(...o.squad); else order.push(o);
  }
  // streams: each creature rolls its own dice (econ's paired runs: a change to one creature leaves the others' rolls as they were).
  if (streams) { const base = Math.floor(R() * 2 ** 31); [...pcs, ...foes].forEach((c, i) => { c.R = rng(base + i * 7919); }); } else for (const p of pcs) delete p.R;
  let round = 0, firstDown = 0, actionId = 0;
  // The fix of 2026-11-12 (Playtest 4's replay): an enemy at 0 Health is out at once, not at the end of the turn that did it, so the rest of that turn goes to
  // another enemy (RULES.outAtOnce; false: the ruler until then, which kept hitting it and counted that damage).
  const alive = () => (RULES.outAtOnce ? foes.filter(f => !f.dead && f.damage < f.pool) : foes.filter(f => !f.dead)), up = () => pcs.filter(p => !p.down);
  // The engine's view of the fight for the policy (policy.mjs), and the log (opts.log: every thing that happens, in order; nothing reads it back).
  const E = { pcs, foes, alive, up, R, M, get round() { return round; }, get W() { return W; } };
  const nameOf = c => c.label ?? (c.label = c.build ? `${c.build.name} ${pcs.indexOf(c) + 1}` : `${c.name} ${foes.indexOf(c) + 1}`), at = c => (c?.pos ? [c.pos.x, c.pos.y] : null), trail = c => c.walked?.map(q => [q.x, q.y]);
  // Each event also carries `ch`: the creatures whose state changed since the last event ({ i: its place in the start list, dmg, pos, out, guard, esc,
  // cond }), so a viewer follows Health, Guard, places (Forced Movement too) and conditions without knowing any rule.
  const seen = new Map(), condOf = c => { const k = c.cond ?? {}; return [k.prone && "Prone", k.hindered && "Hindered", k.immob && "Immobilized", k.slowed && `Slowed ${k.slowed}`, k.dazed && `Dazed ${k.dazed}`, k.staggered && "Staggered", k.blinded && "Blinded", k.frightened && "Frightened", k.bleed && "Lingering", c.vulnerable && `Vulnerable ${c.vulnerable}`, c.taunt && "Taunted"].filter(Boolean).join(", "); };
  const snap = c => `${Math.round((c.damage ?? 0) * 10) / 10}|${c.pos ? `${c.pos.x},${c.pos.y}` : ""}|${c.down || c.dead ? 1 : 0}|${Math.round(((c.guard ?? 0) + (c.apGuard ?? 0)) * 10) / 10}|${c.esc ?? 0}|${condOf(c)}`;
  const changes = () => { const out = []; [...pcs, ...foes].forEach((c, i) => { const k = snap(c); if (seen.get(c) !== k) { seen.set(c, k); out.push({ i, dmg: Math.round((c.damage ?? 0) * 10) / 10, pos: at(c), out: !!(c.down || c.dead), guard: Math.round(((c.guard ?? 0) + (c.apGuard ?? 0)) * 10) / 10, esc: c.esc ?? 0, cond: condOf(c) }); } }); return out; };
  const ev = (type, o = {}) => { if (!events) return null; const ch = changes(), e = { round, type, ...o, ...(ch.length ? { ch } : {}) }; events.push(e); return e; };
  const focus = (list = alive()) => P.focus(E, list);   // the enemy closest to dying (the plan policy)
  const mostHurt = list => P.mostHurt(E, list);
  const useRally = (t, n, by) => {   // t uses n Rally Points (Steel Yourself, or an ally's Lay On Hands)
    for (let k = 0; k < n && t && t.rallyLeft > 0 && t.damage > 0; k++) {
      const rb = rallyBonus(pcs, t), h0 = Math.min(t.damage, t.build.rallyHeal), h = Math.min(t.damage, t.build.rallyHeal + rb.n);
      t.damage -= h; t.rallyLeft--; if (rb.by) rb.by.st.mercyGiven += h - h0; ev("help", { who: nameOf(by), target: nameOf(t), what: by === t ? "Steel Yourself (a Rally Point)" : "a Rally Point", amount: h });
      if (by === t) t.st.rpSelf++; else { t.st.rpByAlly++; by.st.healGiven += h0; }
    }
  };
  const mendOne = (t, amount, by) => { if (!t) return; const h = Math.min(t.damage, amount); t.damage -= h; by.st.mendGiven += h; if (h > 0) ev("help", { who: nameOf(by), target: nameOf(t), what: "heals", amount: h }); };   // new Health
  /** Pack R prep: an Escalation hook (+1 Escalation, up to 3; each kind once an encounter). */
  const hook = (p, kind) => { if (!RULES.escHooks || p.down || p.hooked[kind] || (p.esc ?? 0) >= RULES.escMax) return; p.hooked[kind] = true; p.esc = Math.min(RULES.escMax, (p.esc ?? 0) + 1); if (kind === "crit") p.st.hookCrit++; else p.st.hookClass++; };   // used only when it raises the Escalation
  /** Pack R prep: a Reaction spends the Reaction AP first, then a turn AP kept (which loses its Guard). */
  const spendReact = p => { p.keptAP--; if (p.keptAP < p.turnKept) { p.turnKept--; if (RULES.guardAt !== "next") p.apGuard = Math.max(0, (p.apGuard ?? 0) - guardPerAp(p.build.level)); } };   // guardAt "next": the AP is one less when its next turn starts (no Guard from it)
  /** The catch-up: a PC's Reactions now (its file's, and the basic Opportunity Attack while every creature has it), and who an Opportunity Attack can hit:
   *  an adjacent enemy its weapon can target (the book since v0.0.335; a ranged weapon takes Engaged's 2 Banes); before pack R, the Talent: a creature it threatens. */
  const rxOf = p => (p.build.reactions ?? []).filter(rx => !rx.basic || (RULES.oaAll && !p.noOa));
  const oaCan = (p, c) => (RULES.oaAll ? MP.up(p) && MP.adj(p, c) : MP.threatens(p, c));
  /** The AP a PC needs to make this Opportunity Attack: 1; with oaPolicy "spare", the basic one leaves 1 AP for its class Reaction (a decision, not a rule). */
  const oaNeed = (p, rx) => P.reactionReserve(E, p, rx);
  /* SIM-2 (areas and Zones, 2026-11-12). On a map (or with RULES.areasOnGrid) an Action with an Area (its card's: a.shape) is placed on the grid and hits
     who stands in it; an Area that lasts is a Zone: its squares stay for its rounds (an Aura follows its maker), and what it does is read from where a
     creature stands when it matters. Without it (the open field of report.md): the number of creatures the card's ruler line says, as before. */
  const geo = () => !!M && (!!M.grid || !!RULES.areasOnGrid), zones = [];
  const rangeOf = (who, a) => (a.shape.dist === "self" ? 0 : a.shape.dist === "weapon" ? who.range[0] : a.shape.dist === "max" ? who.range.at(-1) : Number(a.shape.dist) || 0);
  const sideOf = c => (c.build ? "pc" : "npc"), foesOf = who => (sideOf(who) === "pc" ? alive() : up()), friendsOf = who => (sideOf(who) === "pc" ? up() : alive());
  const placeArea = (who, a, target) => {
    if (who.lastArea && who.lastArea.a === a && who.lastArea.id === actionId) return who.lastArea;   // the same Action's other effects use the same place
    const kind = a.shape.kind === "aura" ? "emanation" : a.shape.kind, range = rangeOf(who, a), tg = target ?? (a.shape.who === "allies" ? who : focus()) ?? who;
    const inside = (c, spot, sq) => MP.inArea(c, sq, kind, spot, W);
    const count = spot => { const sq = MP.areaSquares(kind, a.shape.n, spot); return { foes: foesOf(who).filter(c => inside(c, spot, sq)).length, friends: friendsOf(who).filter(c => inside(c, spot, sq)).length }; };
    const spots = [...MP.areaSpots(kind, a.shape.n, who, tg, range, W), ...(a.rounds > 1 && range && tg !== who ? MP.areaSpots(kind, a.shape.n, who, who, range, W) : [])], spot = (spots.length ? P.placeArea(E, who, a, spots, count) : null) ?? { ...who.pos };
    const sq = MP.areaSquares(kind, a.shape.n, spot), place = { a, id: actionId, kind, spot, squares: sq, has: c => inside(c, spot, sq) };
    who.lastArea = place; who.st.areas = (who.st.areas ?? 0) + 1;
    return place;
  };
  const cells = sq => [...sq].map(k => k.split(",").map(Number));
  const tally = (who, name, key, n = 1) => { const t = ((who.st.area ??= {})[name] ??= { uses: 0, hits: 0, baned: 0, healed: 0, defended: 0 }); t[key] += n; };   // per card: what its Area did
  /** The Zone of this Action by this creature (made when the Action's first lasting effect is applied). */
  const zoneOf = (who, a, target) => {
    let z = zones.find(x => x.by === who && x.a === a && x.made === actionId);
    if (!z) { const pl = placeArea(who, a, target); z = { by: who, a, made: actionId, kind: pl.kind, spot: pl.spot, squares: pl.squares, aura: a.shape.kind === "aura" ? a.shape.n : 0, left: a.rounds ?? 1, banes: 0, heal: null, def: 0 }; zones.push(z);
      who.st.zones = (who.st.zones ?? 0) + 1; tally(who, a.name, "uses"); tally(who, a.name, "hits", foesOf(who).filter(c => pl.has(c)).length); ev("zone", { who: nameOf(who), name: a.name, rounds: z.left, squares: cells(z.squares), aura: z.aura || undefined, id: zones.length }); z.id = zones.length; }
    return z;
  };
  const inZone = (z, c) => (z.aura ? MP.dist(z.by.pos, c.pos) <= z.aura && (!M.grid || MP.canTarget(z.by, c, W) || z.by === c) : MP.inArea(c, z.squares, z.kind, z.spot, W));
  const zoneBanes = f => zones.filter(z => z.left > 0 && z.banes && !z.by.down && sideOf(z.by) !== sideOf(f) && inZone(z, f)).sort((x, y) => y.banes - x.banes)[0];
  const zoneHelp = (t, key) => zones.filter(z => z.left > 0 && z[key] && sideOf(z.by) === sideOf(t) && inZone(z, t))[0];
  /** Pack R-bestiary: an Elite's phases (+1 Escalation when it becomes Bloodied and when it becomes Strained) and its rung 3 (the Encounter Special comes back once). */
  const eliteRung = f => { if (RR.eliteEncounterBack(f.esc, RULES.eliteRungs) && !f.encBack) { f.encBack = true; f.encUsed = false; f.encDone = null; } };   // encDone: its own Actions (the turn budget)
  const phase = f => { if (RULES.eliteEsc && RULES.elitePhases && f.role === "elite" && !f.dead && f.esc > 0 && f.esc < (RULES.eliteMax ?? 3)) { f.esc++; eliteRung(f); } };
  const killCheck = () => { for (const f of foes) {
    if (!f.dead && f.damage >= f.pool) { f.dead = true; f.deadRound = round; ev("dead", { who: nameOf(f) }); for (const p of pcs) if (p.build.escHook === "quarry" && p.quarry === f) hook(p, "class"); }
    // Pack R prep: when an NPC becomes Bloodied (Body damage at its Body threshold) and Strained (Mind damage at its Mind threshold).
    if (!f.bloodiedRound && f.damage - (f.mindDamage ?? 0) >= f.bodyPool) { f.bloodiedRound = round; phase(f); }
    if (!f.strainedRound && (f.mindDamage ?? 0) >= f.mindPool) { f.strainedRound = round; phase(f); }
  } };
  /** One NPC Strike on a PC (taunt Banes, the map's Boons and Banes), and a Down. */
  const npcHit = (f, t, k, boons = 0, banes = 0, doomed = false) => {
    if (geo()) { const z = zoneBanes(f); f.zone = z ? { n: z.banes, left: 1, by: z.by } : null; if (z) { z.by.st.zoneBaned = (z.by.st.zoneBaned ?? 0) + 1; tally(z.by, z.a.name, "baned"); } const d = zoneHelp(t, "def"); t.passiveDef = d ? d.def : 0; if (d) tally(d.by, d.a.name, "defended"); }   // SIM-2: what the Zones do where the two stand
    const taunted = f.taunt && !f.taunt.by.down && t !== f.taunt.by ? f.taunt.n : 0;   // Champion's Challenge: Banes against anyone else
    if (M) for (const p of pcs) if (p.reduceAdj) p.adjacent = pcs.filter(x => x !== p && !x.down && MP.adj(p, x));   // Hallowed Stance: the allies adjacent now
    t.st.struck++;
    const el = t.elusiveRound !== round ? t.build.passives.filter(p => p.effect.kind === "elusive" && (t.esc ?? 0) >= p.escalation).reduce((m, p) => Math.max(m, p.effect.n), 0) : 0;
    if (el) { t.elusiveRound = round; t.st.elusive = (t.st.elusive ?? 0) + 1; }   // the first Strike against it this round
    // Pack R prep: a PC with a blocking Reaction and a Reaction AP (or AP kept) takes damage off the hit (itself or an ally within 5 squares; once per NPC turn each: the Turn Frequency).
    let block = null;
    // Pack R-classes, part 4: Covering Shot (1R, Turn, Interrupt: a Strike would damage an ally within 10 squares): a Weapon Attack with 1 Boon on the attacker; on a Tier 3 the ally takes half the damage.
    for (const p of up()) { const rx = (p.build.reactions ?? []).find(x => x.kind === "cover"); if (!rx || f.curSave || p === t || (p.keptAP ?? 0) < 1 || p.cond?.staggered || p.coverFor === f.turnId || (M && MP.dist(p.pos, t.pos) > 10)) continue;
      p.coverFor = f.turnId; spendReact(p); const r = pcReact((p.rxNow = rx.name, p), f, rx.action, 1); if (r.tier === 3 && !f.dead) block = { half: true, by: p, used: () => {} }; break; }
    for (const p of up()) { if (block) break; const rx = (p.build.reactions ?? []).find(x => x.kind === "block"); if (!rx || (p.keptAP ?? 0) < 1 || p.cond?.staggered || p.blockedFor === f.turnId) continue; if (M && p !== t && MP.dist(p.pos, t.pos) > 5) continue;
      if (rx.ally && p === t) continue; if (rx.round && p.blockedRound === round) continue;   // pack R-classes: `ally` (never on itself: Bulwark of Faith), `round` (once a round: the Round Frequency)
      block = { dmg: rx.dmg, spill: rx.spill, by: p, used: () => { ev("reaction", { who: nameOf(p), reaction: rx.name, on: nameOf(f), protects: nameOf(t) }); spendReact(p); p.blockedFor = f.turnId; p.blockedRound = round; p.st.reactions++; } }; break; }
    const bb = RULES.bloodiedBanes && f.bloodiedRound != null ? 1 : 0;   // the book's Bloodied rule on the NPC's Strikes
    if (t.cond?.vuln) boons += RR.vulnerableBoons(t.cond.vuln);   // the Bestiary's turn budget: a PC made Vulnerable by an enemy
    if (f.nextBoons) { boons += f.nextBoons; f.nextBoons = 0; f.boonUsed = (f.boonUsed ?? 0) + 1; }   // a Leader's help: Boons on its next attack
    const taken = npcStrike(f.R ?? R, f, t, k + taunted + banes + el + bb, t.esc, pcs, boons, block, doomed);   // At-will Banes on the 2nd and 3rd Strike
    t.damage += taken; f.dealt = (f.dealt ?? 0) + taken; ev("attack", { who: nameOf(f), target: nameOf(t), kind: f.curName ?? ((f.curMult ?? 1) > 1 ? "special" : "basic"), tier: f.lastTier, damage: taken, pool: (f.curPower ?? f.power) ? "R" : "V" });   // an NPC's Basic attack is Vigor damage (a weapon)...
    if (f.curPower ?? f.power) { t.mindDamage = (t.mindDamage ?? 0) + taken; t.st.mindTaken += taken; }   // ...unless it is a `power` NPC: [R] (pack R-bestiary)
    // Pack R prep: an "overwatch" Reaction (a Trigger: an enemy within 10 squares makes a Strike; once per NPC turn), after the Strike.
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "overwatch" && !f.curSave && p.keptAP >= 1 && !p.cond?.staggered && p.owFor !== f.turnId && !f.dead && (!M || MP.dist(p.pos, f.pos) <= 10)) { p.owFor = f.turnId; spendReact(p); p.st.oaMade++; pcReact((p.rxNow = rx.name, p), f, rx.action); }
    // Pack R-classes, part 3: Rebuke (1R, Round, Trigger: an enemy within your Reach makes a Strike against an ally): an Appeal Save against 11 + [PMod]; Tier 1 [R] 1d8 Ho, Pushed 2, Frightened (EoT); Tier 2 [R] 1d6 Ho, Pushed 1.
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "rebuke" && !f.curSave && p !== t && p.keptAP >= 1 && !p.cond?.staggered && (rx.turn ? p.rebukeFor !== f.turnId : p.rebukeRound !== round) && !f.dead && (!M || (rx.range ? MP.dist(p.pos, f.pos) <= rx.range : MP.adj(p, f)))) {   // `rebuke 5`: within 5 squares instead of your Reach
      p.rebukeRound = round; p.rebukeFor = f.turnId; spendReact(p); p.st.reactions++; ev("reaction", { who: nameOf(p), reaction: rx.name, on: nameOf(f) });
      const tier = pick(p.R ?? R, C.tierProbs(f.save?.appeal ?? 1, 11 + p.build.powerMod, 0, 0, ""));
      if (tier <= 2) { const v = rollDamage(p.R ?? R, parseDamage(tier === 1 ? "1d8" : "1d6")).total; p.st.counted += Math.min(v, Math.max(0, f.pool - f.damage)); f.damage += v; f.mindDamage = (f.mindDamage ?? 0) + v; p.st.dealt += v; p.st.reactionDealt += v; p.st.mindDealt += v;
        if (M) MP.force("push", p, f, tier === 1 ? 2 : 1, W); if (tier === 1) { MP.applyCondition(f, "Frightened (EoT)", p); p.st.condApplied++; } killCheck(); }
    }
    for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "ready" && p.keptAP >= 1 && !p.cond?.staggered && p.readyRound !== round && (!M || MP.dist(p.pos, f.pos) <= 10)) { p.readyRound = round; spendReact(p); p.st.reactions++; p.readyAP = 1; }   // pack R-classes: Ready Shot (1R, Round): +1 AP on its next turn
    pcHurt(t);
  };
  /** A PC took damage (a Strike, a Collision, a Lingering from an enemy): Bloodied, Strained, Down, and the Paladin's hook. */
  const pcHurt = t => {
    const wasB = !!t.bloodiedRound, wasD = t.down;
    if (t.damage - (t.mindDamage ?? 0) >= t.build.bodyHealth && !t.bloodiedRound) t.bloodiedRound = round;   // Bloodied: Vigor damage at the Vigor threshold
    if ((t.mindDamage ?? 0) >= t.build.mindHealth && !t.strainedRound) t.strainedRound = round;   // Strained: Resolve damage at the Resolve threshold (pack R-bestiary)
    if (t.damage >= t.build.pool && !t.down) { t.down = true; t.st.downs++; if (!firstDown) firstDown = round; ev("down", { who: nameOf(t) }); }
    if ((!wasB && t.bloodiedRound) || (!wasD && t.down)) for (const p of up()) if (p !== t && p.build.escHook === "ally" && (!M || MP.dist(p.pos, t.pos) <= 5)) hook(p, "class");   // pack R prep: the Paladin's hook
  };
  /* ---------------------------------------------------------------- the Bestiary's turn budget (2026-11-12): enemies that do more than damage.
     Only an NPC with `acts` (sim/budget.mjs builds it) or a `reaction` uses this: every other NPC turns exactly as before. */
  const FX = (f, k, n = 1) => { (f.fx ??= {})[k] = (f.fx[k] ?? 0) + n; };   // what its effects did, for the reports
  const hasRider = (t, r) => { const c = t.cond ?? {}, n = r.eff.toLowerCase();
    if (/^(push|pull|slide)/.test(n)) return false;
    if (/prone/.test(n)) return c.prone; if (/slowed/.test(n)) return c.slowed > 0; if (/dazed/.test(n)) return c.dazed > 0; if (/staggered/.test(n)) return !!c.staggered;
    if (/blinded/.test(n)) return !!c.blinded; if (/frightened/.test(n)) return !!c.frightened; if (/hindered/.test(n)) return !!c.hindered; if (/immobilized|grabbed/.test(n)) return !!c.immob;
    if (/vulnerable/.test(n)) return (c.vuln ?? 0) > 0; if (/enfeebled/.test(n)) return (c.enf ?? 0) > 0; if (/taunted/.test(n)) return !!t.taunt; if (/lingering|bleed/.test(n)) return !!c.bleed;
    if (/pressure bane/.test(n)) return !!c.nextBane; if (/doomed \(next/.test(n)) return !!c.nextDoomed; return false; };
  /** One rider on a PC: a Forced Movement (with its Collision) or a condition. A condition it already has is wasted (no limit on repeating a rider: Lucas). */
  const riderOn = (f, t, r) => {
    if (!t || t.down) return;
    const n = r.eff.toLowerCase(), fm = n.match(/^(push|pull|slide)\s+(\d+)/);
    if (fm && RULES.forcedUse !== "always") {   // the GM pushes when it hurts: into a wall or into another PC (a Collision); else the rider is declined
      const pv = MP.forcePreview(fm[1], f, t, Number(fm[2]), W); if (!pv.unused || (pv.into && pv.into !== "wall" && !pv.into.build)) { FX(f, "declined"); return; } }
    if (fm) { const d0 = t.damage; const moved = MP.force(fm[1], f, t, Number(fm[2]), W); FX(f, "forced"); FX(f, "squares", moved); if (t.damage > d0) { FX(f, "collision", t.damage - d0); for (const p of pcs) if (!p.down) pcHurt(p); } return; }   // the PC it was thrown into took damage too
    if (hasRider(t, r)) { FX(f, "wasted"); return; }
    const dz = n.match(/dazed\s*(\d)/);
    if (dz) { const k = Number(dz[1]), fromKept = Math.min(k, t.turnKept ?? 0); t.turnKept = (t.turnKept ?? 0) - fromKept; t.keptAP -= fromKept; t.cond.dazed += k - fromKept; FX(f, "cond"); return; }   // Dazed: AP now (the AP it kept, never the Reaction AP), the rest from its next turn
    if (/taunted/.test(n)) { t.taunt = { by: f, n: 1 }; FX(f, "cond"); return; }
    if (MP.applyCondition(t, r.eff, f)) FX(f, "cond");
  };
  /** The PCs an Action hits: its target, and for an Area the other PCs within r squares of it (n creatures at most). */
  const actTargets = (a, t) => (a.area ? [t, ...up().filter(p => p !== t && MP.dist(p.pos, t.pos) <= (a.area.r ?? 1)).sort((x, y) => MP.dist(x.pos, t.pos) - MP.dist(y.pos, t.pos)).slice(0, (a.area.n ?? 3) - 1)] : [t]);
  /** One attack of an Action on one PC: Setup riders first (they always happen), then the roll (a Save Action: the PC's Save, its Tier 1 the worst), then the riders by Tier. Returns the Tier. */
  const actHit = (f, a, t, k, m) => {
    for (const r of a.riders ?? []) if (r.at === "setup") riderOn(f, t, r);
    if (t.down) return 0;
    f.curDmg = a.dmg; f.curPower = a.power; f.curName = a.name; f.curExplode = a.explode;
    let tier;
    if (a.save) {   // a Save Action: DC 11 + its Modifier; the PC's Tier 1 is the attack's Tier 3
      const st = (t.build.attributes?.[a.save] ?? 1), pt = pick(f.R ?? R, C.tierProbs(st, 11 + (a.power ? f.powerMod : f.weaponMod), 0, 0, "")); tier = 4 - pt; f.lastTier = tier;
      if (a.dmg && tier >= 2) { f.forceTier = tier; f.curSave = true; npcHit(f, t, 0); f.forceTier = undefined; f.curSave = false; }   // its damage meets the PC's damage reduction, blocks and Guard as any hit; not a Strike (no Reaction to a Strike)
    } else if (a.dmg) { npcHit(f, t, k, (m?.boons ?? 0), (m?.banes ?? 0), !!m?.doomed); tier = f.lastTier; }
    else { const def = (a.power ? t.build.wd : t.build.ad) + (t.defBonus ?? 0); tier = pick(f.R ?? R, C.tierProbs(a.power ? f.powerMod : f.weaponMod, def, (m?.boons ?? 0) + RR.vulnerableBoons(t.cond?.vuln), (m?.banes ?? 0), m?.doomed ? "doomed" : "")); f.lastTier = tier; ev("attack", { who: nameOf(f), target: nameOf(t), kind: a.name, tier, damage: 0 }); }
    f.curDmg = null; f.curPower = undefined; f.curName = null;
    for (const r of a.riders ?? []) if ((r.at === "hit" && tier >= 2) || (r.at === "t3" && tier === 3)) riderOn(f, t, r);
    FX(f, "uses"); FX(f, `use:${a.name}`); return tier;
  };
  /** An Action with no damage that helps the NPC's side: Boons on its allies' next attack, or a heal on the most hurt ally. */
  const actHelp = (f, a) => {
    const allies = alive().filter(x => x !== f && (!M || MP.dist(x.pos, f.pos) <= (a.range ?? 5)));
    if (a.buff) { for (const x of allies.slice(0, a.buff.n ?? 99)) { x.nextBoons = Math.max(x.nextBoons ?? 0, a.buff.boons ?? 1); FX(f, "buffed"); } ev("help", { who: nameOf(f), target: nameOf(f), what: a.name }); }
    if (a.heal) { const t = [...alive().filter(x => !M || MP.dist(x.pos, f.pos) <= (a.range ?? 5))].sort((x, y) => y.damage - x.damage)[0]; if (t) { const h = Math.min(t.damage, rollDamage(f.R ?? R, a.heal).total); t.damage -= h; if (t.mindDamage > t.damage) t.mindDamage = t.damage; FX(f, "healed", h); ev("help", { who: nameOf(f), target: nameOf(t), what: "heals", amount: h }); } }
    FX(f, "uses");
  };
  /** Is the Action worth using now? A help only when it helps; an Action whose only effect is a condition only on a PC that hasn't it. */
  const actUseful = (f, a, t) => {
    if (a.kind === "help") return a.heal ? alive().some(x => x.damage >= 4) : alive().some(x => x !== f && !x.nextBoons);
    if (!a.dmg && (a.riders ?? []).every(r => !/^(push|pull|slide)/i.test(r.eff))) return (a.riders ?? []).some(r => !hasRider(t, r));
    return true;
  };
  /** The PC an Action with conditions should go to: one in reach that hasn't them, if any (the GM spreads riders), else t. */
  const spreadTarget = (f, a, t) => {
    const conds = (a.riders ?? []).filter(r => !/^(push|pull|slide)/i.test(r.eff)); if (!conds.length || !conds.every(r => hasRider(t, r))) return t;
    return up().find(p => (f.melee ? MP.adj(f, p) : MP.dist(f.pos, p.pos) <= f.range[0] && MP.canTarget(f, p, W)) && !conds.every(r => hasRider(p, r))) ?? t;
  };
  /** An NPC's turn with its own Actions (after it moved): the Encounter Action first, then by points an AP (Round before At-will), helps when they help; 3 Strikes at most. */
  const actsTurn = (f, t, ap) => {
    let strikes = 0; const aw = {}; FX(f, "turns");
    ap -= f.reaction?.cost === 2 ? 1 : 0;   // a 2R Reaction needs an AP kept from the turn
    for (let guard = 0; guard < 8 && ap > 0 && !f.dead; guard++) {
      if (t?.down || (t && f.melee && !MP.adj(f, t))) t = PN.npcRetarget(E, f);
      const ok = a => a.ap <= ap && (a.freq !== "enc" || !f.encDone?.has(a.name)) && (a.freq !== "round" || (f.roundDone?.get(a.name) ?? 0) < RR.eliteRoundSpecials(f.esc, RULES.eliteRungs)) && (a.kind === "help" || (t && strikes < RR.STRIKES_PER_TURN)) && actUseful(f, a, t);
      const c = f.acts.filter(ok).sort((x, y) => (y.freq === "enc") - (x.freq === "enc") || y.pts / y.ap - x.pts / x.ap || (y.freq === "round") - (x.freq === "round") || y.ap - x.ap)[0];
      if (!c) break;
      ap -= c.ap; if (c.freq === "enc") (f.encDone ??= new Set()).add(c.name); if (c.freq === "round") (f.roundDone ??= new Map()).set(c.name, (f.roundDone.get(c.name) ?? 0) + 1);   // an Elite at its second rung: each Round Action twice
      if (c.kind === "help") { actHelp(f, c); continue; }
      const tt = spreadTarget(f, c, t), m = MP.mapMods(f, tt, f.melee ? "melee" : "ranged", W); if (!m) break;
      const eb = f.firstAtk ? RR.eliteFirstAttackBoons(f.esc, RULES.eliteRungs) : 0; f.firstAtk = false;
      const k = c.freq === "atwill" ? (aw[c.name] = (aw[c.name] ?? -1) + 1) : 0; strikes++;
      const tg = actTargets(c, tt); if (c.area) { FX(f, "areaHits", tg.length); FX(f, "areaUses"); } for (const x of tg) actHit(f, c, x, k, { ...m, boons: m.boons + eb });
    }
    f.keptAP = f.reaction?.cost === 2 ? 1 : 0;
  };
  /** An NPC's Reaction (its entry's `reaction`): 1R from its Reaction AP, 2R with an AP kept too; once a round. */
  const npcCanReact = f => !f.dead && f.damage < f.pool && f.reaction && !f.cond?.staggered && f.rxRound !== round && f.reactAP >= 1 && (f.reaction.cost !== 2 || (f.keptAP ?? 0) >= 1);
  const npcReactPay = f => { f.rxRound = round; f.reactAP--; if (f.reaction.cost === 2) f.keptAP--; FX(f, "reactions"); ev("reaction", { who: nameOf(f), reaction: f.reaction.name, on: "" }); };
  const npcReactHit = (f, pc) => { if (pc.down || !f.reaction.act) return; const m = MP.mapMods(f, pc, f.melee ? "melee" : "ranged", W); if (!m) return; actHit(f, f.reaction.act, pc, 0, m); };
  /** A PC's turn context (the targets, heals, buffs, areas; and with the map model, its movement, Boons and Banes, conditions). */
  const ctxFor = (pc, extra = {}) => ({
    R: pc.R ?? R, escalation: pc.esc,
    log: events ? (type, o) => ev(type, { who: nameOf(pc), ...o, target: o.target ? nameOf(o.target) : null }) : null,
    target: a => P.pcTarget(E, pc, a),
    others: n => P.pcOthers(E, pc, n),
    heal: (who, n, kind) => useRally(P.healTarget(E, who, kind), n, who),   // an ally's Rally Point only when it heals at least 3/4 of its value
    defend: (who, n, kind, a) => { if (geo() && a?.shape && kind === "allies") { zoneOf(who, a, null).def = n; return; } for (const t of P.defendTargets(E, who, kind, a)) if (n >= t.defBonus) { t.defBonus = n; t.defBy = who; ev("help", { who: nameOf(who), target: nameOf(t), what: `+${n} Defense` }); } },
    // Pack R-classes: "callshot" (Call the Shot, 1R Round, Trigger: an ally deals damage to your Marked Quarry: it is Vulnerable 1 until the end of your next turn; here until its own turn ends).
    onDamage: (who, t, total) => { for (const p of up()) for (const rx of p.build.reactions ?? []) if (rx.kind === "callshot" && p !== who && p.keptAP >= 1 && !p.cond?.staggered && p.quarry === t && !t.dead && p.calledRound !== round) { p.calledRound = round; spendReact(p); p.st.reactions++; if (1 >= (t.vulnerable ?? 0)) t.vulnBy = p; t.vulnerable = Math.max(t.vulnerable ?? 0, 1); t.vulnKeep = p; } },
    mendMany: (who, roll, kind, n, a) => { const pl = geo() && a?.shape ? (actionId++, placeArea(who, a, who)) : null; if (pl) ev("area", { who: nameOf(who), name: a.name, squares: cells(pl.squares), good: true }); for (const t of pl ? up().filter(x => x.damage > 0 && (kind === "any" || x !== who) && pl.has(x)) : P.mendTargets(E, who, kind, n)) mendOne(t, roll(), who); },
    mend: (who, amount, kind) => mendOne(P.mendTarget(E, who, kind), amount, who),
    guard: (who, amount, kind) => { const t = P.guardTarget(E, who, kind); if (t && amount > (t.guard ?? 0)) { t.guard = amount; t.guardBy = who; ev("help", { who: nameOf(who), target: nameOf(t), what: "Guard", amount }); } },
    areaTargets: (a, target) => { if (!geo() || !a.shape || a.shape.who === "allies") return null; actionId++;
      const pl = placeArea(pc, a, target), hit = alive().filter(f => f !== target && pl.has(f)); pc.st.areaHits = (pc.st.areaHits ?? 0) + 1 + hit.length; tally(pc, a.name, "uses"); tally(pc, a.name, "hits", 1 + hit.length);
      ev("area", { who: nameOf(pc), name: a.name, squares: cells(pl.squares), hits: 1 + hit.length }); return [target, ...hit]; },
    zone: (who, e, a, target) => { if (geo() && a?.shape) { zoneOf(who, a, target).banes = e.n; return; } for (const f of [target, ...alive().filter(x => x !== target)].filter(Boolean).slice(0, Math.round(a?.area ?? 1))) f.zone = { n: e.n, left: a?.rounds ?? 1, by: who }; },
    zoneHeal: (who, e, a) => { if (geo() && a?.shape) { zoneOf(who, a, null).heal = e.dmg; return; } for (const t of [who, ...up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 1))) t.zoneHeal = { dmg: e.dmg, left: a?.rounds ?? 1, by: who }; },
    ...(M ? {
      mods: (a, traits, t) => {
        if (!t?.pos) return null;
        const kind = traits.includes("ranged") ? "ranged" : traits.includes("melee") ? "melee" : null;
        if (!kind) return null;
        const ign = !!pc.ignoreCover && traits.includes("strike"); if (ign) pc.ignoreCover = false;
        const pas = pc.build.passives.filter(p => pc.esc >= p.escalation);
        const m = MP.mapMods(pc, t, kind, W, { engagedDoomed: RULES.engagedRanged === "doomed", ignoreCover: ign, noEngagedBanes: pas.some(p => p.effect.kind === "steady-nerves"), noIntoMelee: pas.some(p => p.effect.kind === "clear-shot"), longDraw: pas.some(p => p.effect.kind === "long-draw"), range: pc.range });
        if (!m) { pc.st.outOfReach++; return { skip: true }; }
        // The Stage 0 prototype, candidate C3: a [Ranged] Action made while Engaged draws an Opportunity Attack from each adjacent enemy that can still react.
        if (RULES.rangedOa && kind === "ranged" && m.engagedBanes) for (const f of alive()) if (f.oa && f.melee && !f.cond?.staggered && f.reactAP > 0 && MP.adj(f, pc) && !pc.down) { f.reactAP--; pc.st.oaTaken++; ev("reaction", { who: nameOf(f), reaction: "Opportunity Attack", on: nameOf(pc) }); const t0 = pc.st.taken; npcHit(f, pc, 0); pc.st.oaTakenDmg += pc.st.taken - t0; }
        if (kind === "ranged") { pc.st.shots++; pc.st.engagedShots += m.engagedBanes ? 1 : 0; pc.st.intoMelee += m.intoMelee; pc.st.covered += m.coverBanes ? 1 : 0; pc.st.coverBanes += m.coverBanes; pc.st.rangeBanes += m.rangeBanes; pc.st.mapBanes += m.banes; }
        else { pc.st.swings++; pc.st.flankBoons += m.boons; }
        return m;
      },
      move: (p, step) => pcMove(p, step),
      // The Bestiary's turn budget: the PC's own conditions on its rolls (roundrules.mjs rollerConditionMods), and the enemies' Reactions to its Strikes.
      selfMods: (p, t) => { const c = p.cond; if (!c) return null; const o = RR.rollerConditionMods({ frightened: !!c.frightened, taunted: !!p.taunt, againstTaunter: p.taunt?.by === t, blinded: !!c.blinded, nextBanes: c.nextBane, nextDoomed: c.nextDoomed });
        c.nextBane = 0; c.nextDoomed = false; return o.banes || o.doomed || c.enf ? { ...o, enf: c.enf ?? 0 } : null; },
      beforeStrike: (p, t) => { for (const f of alive()) if (f.reaction?.trigger === "allyStruck" && f !== t && MP.dist(f.pos, t.pos) <= (f.reaction.range ?? 1) && npcCanReact(f)) { npcReactPay(f); return { def: f.reaction.def ?? 2 }; } return null; },
      afterStrike: (p, t, tier) => {
        if (p.down) return;
        for (const f of alive()) {
          const rx = f.reaction; if (!rx || !npcCanReact(f)) continue;
          const reach = f.melee ? MP.adj(f, p) : MP.dist(f.pos, p.pos) <= f.range[0];
          if (rx.trigger === "struck" && f === t && tier >= 2 && reach) { npcReactPay(f); npcReactHit(f, p); }
          else if (rx.trigger === "allyHit" && f !== t && tier >= 2 && MP.dist(f.pos, t.pos) <= (rx.range ?? 2) && reach) { npcReactPay(f); npcReactHit(f, p); }
        }
      },
      condition: (who, e, t) => {
        if (!t?.cond) return;
        if (e.kind === "debuff") { if (MP.applyCondition(t, e.name, who)) who.st.condApplied++; }
        else { const n = MP.force(e.kind, who, t, e.n, W); who.st.forced += n; }
      },
    } : {}),
    ...extra,
  });
  /** A PC's Reaction: a Weapon Attack against f (Opportunity Attack, Quick Draw). Returns { crit }. */
  const pcReact = (p, f, action = "Weapon Attack", boons = 0, oa = false) => {
    const r = runTurn(p, { name: "Reaction", steps: [action] }, ctxFor(p, { target: () => f, startNext: boons ? [{ kind: "boon", n: boons, scope: "next", traits: [] }] : [], log: null, noEmp: true }));   // its roll is written with the Reaction's own line
    p.st.dealt += r.damage; p.st.counted += r.counted; p.st.reactionDealt += r.damage; p.st.reactions++; ev("reaction", { who: nameOf(p), reaction: p.rxNow ?? (oa ? "Opportunity Attack" : action), on: nameOf(f), damage: r.damage, tier: r.lastTier || undefined }); p.rxNow = null; if (oa) { p.st.oaReal++; p.st.oaDealt += r.damage; } killCheck();
    if (r.crit) hook(p, "crit");
    return { crit: r.crit || (r.lastTier === 3 && (p.R ?? R)() < (r.critShare ?? 1 / 12)), tier: r.lastTier };   // a Critical (the share of its Tier 3s: calc.mjs)
  };
  /** An NPC uses the Stand Action: the PCs' Opportunity Attacks (the Talent's other trigger). */
  const standReact = f => { const id = ++actionId; for (const p of up()) for (const rx of rxOf(p)) if (rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx) && !p.cond?.staggered && !f.dead && oaCan(p, f) && p.reacted !== id) { p.reacted = id; spendReact(p); p.st.oaMade++; pcReact((p.rxNow = rx.name, p), f, rx.action, 0, true); } };
  /** An NPC leaves a square during an Advance: the PCs' Interrupts (Opportunity Attack: it leaves your reach; Quick Draw: it moves closer). */
  const npcLeave = id => (c, np) => {
    for (const p of up()) for (const rx of rxOf(p)) {
      if (p.keptAP < 1 || c.dead || p.cond?.staggered) continue;
      if (rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx) && oaCan(p, c) && p.reacted !== id) { p.reacted = id; spendReact(p); p.st.oaMade++; if (pcReact((p.rxNow = rx.name, p), c, rx.action, 0, true).crit && !c.dead && RULES.oaDisrupt) { p.st.oaDisrupt++; return false; } }
      else if (rx.kind === "quick-draw" && p.qdReacted !== id && MP.dist(c.pos, p.pos) <= (rx.range ?? 5) && MP.dist(np, p.pos) < MP.dist(c.pos, p.pos)) { p.qdReacted = id; spendReact(p); p.st.oaMade++; pcReact((p.rxNow = rx.name, p), c, rx.action); }   // once per triggering Action (the Advance)
    }
    return !c.dead;
  };
  /** A PC leaves a square during an Advance: the NPCs' Opportunity Attacks (1 AP of their next turn). */
  const pcLeave = id => (c, np) => {
    for (const f of alive()) if (f.reaction?.trigger === "approach" && MP.cheb(np, f.pos) === 1 && !MP.adj(f, c) && f.reacted !== id && npcCanReact(f)) { f.reacted = id; npcReactPay(f); const was = c.pos; c.pos = np; npcReactHit(f, c); c.pos = was; if (c.down) return false; }   // it strikes the PC as it arrives   // the Bestiary's turn budget: "an enemy would enter a square next to it"
    for (const f of alive()) if (f.oa && !f.cond?.staggered && MP.threatens(f, c) && f.reacted !== id) {
      if (RULES.npcReactionAp > 0 && f.reactAP <= 0) continue;   // the catch-up: with a Reaction AP (pack R) an NPC that spent it can't react (it keeps no turn AP); before pack R it paid with its next turn's AP
      f.reacted = id; if (f.reactAP > 0) f.reactAP--; else f.apDebt++; c.st.oaTaken++; ev("reaction", { who: nameOf(f), reaction: "Opportunity Attack", on: nameOf(c) });
      const m = MP.mapMods(f, c, "melee", W), t0 = c.st.taken; npcHit(f, c, 0, m?.boons ?? 0, m?.banes ?? 0, !!m?.doomed); c.st.oaTakenDmg += c.st.taken - t0;
      if (c.down) return false;
    }
    return true;
  };
  /** A PC's movement step ("advance", "evade 1", "evade 2", "move N", an Action's "Evade N"): melee PCs close in, ranged PCs get away. Returns false when it doesn't move. */
  const pcMove = (p, step) => {
    if (!M) return true;
    const foesUp = alive();
    if (!foesUp.length) return false;
    const evade = step.how === "evade";
    if (evade && (p.cond.prone || p.cond.immob)) return false;
    let sq = evade ? (step.sq === "half" ? Math.floor(p.speed / 2) : step.sq) : p.speed;
    sq = Math.min(sq, MP.speedOf(p));
    if (sq <= 0) return false;
    if (p.melee) {
      if (foesUp.some(f => MP.adj(p, f))) return false;   // already Engaged: it stays
      const t = P.meleeGoal?.(E, p, foesUp) ?? MP.nearest(p, foesUp, W);
      const from = at(p), n = MP.walk(p, MP.toward(t), sq, W, evade ? null : pcLeave(++actionId)); if (n) ev("move", { who: nameOf(p), how: evade ? "Evade" : "Advance", from, to: at(p) , path: trail(p) });
      if (n) { p.leftSquare = round; p.stanceOff = true; }
      if (n && !step.free) p.st.moveAP += step.ap ?? 0;
      return n > 0 || step.free ? undefined : false;
    }
    if (!step.free && step.how === "move" && !MP.engaged(p, W) && !(M.grid && foesUp.every(f => !MP.canTarget(p, f, W)))) return false;   // a ranged PC moves only to get away (on a map: or to see an enemy)
    // Next to an enemy with an Opportunity Attack, an Advance away would provoke it: the same AP buys an Evade 1 (the Evade Action), which breaks off from it.
    const careful = !evade && foesUp.some(f => f.oa && !f.cond?.staggered && (RULES.npcReactionAp > 0 ? f.reactAP > 0 : true) && MP.threatens(f, p));
    if (careful) { sq = Math.min(1, sq); p.st.carefulSteps++; }
    // Away from the enemies (up to one NPC Advance + 1 from the nearest), but within the weapon's normal range of its target.
    const tg = p.quarry && !p.quarry.dead ? p.quarry : MP.nearest(p, foesUp, W);
    const cap = Math.max(...foesUp.map(f => f.speed)) + 1, away = MP.awayFrom(foesUp, cap);
    const from = at(p), n = MP.walk(p, MP.sightScore(q => away(q) + 3 * Math.max(0, MP.dist(q, tg.pos) - p.range[0]), tg, W), sq, W, evade || careful ? null : pcLeave(++actionId)); if (n) ev("move", { who: nameOf(p), how: evade || careful ? "Evade" : "Advance", from, to: at(p) , path: trail(p) });
    if (n) { p.leftSquare = round; p.stanceOff = true; }
    if (n && !step.free) p.st.moveAP += step.ap ?? 0;
    if (p.cond.hindered === "move") p.cond.hindered = null;
    return n > 0 || step.free ? undefined : false;
  };
  /** A melee PC closes in before its turn's Actions: a Charge (2 AP: Advance + a Weapon Attack with 1 Boon) when it can, else Advances. Returns { ap, startNext }. */
  const approach = (pc, turn) => {
    const out = { ap: 0, startNext: [] };
    // SIM-3: a ranged PC that starts its turn Engaged steps away first when its policy kites (1 AP: an Advance, or an Evade 1 next to an Opportunity Attack), whatever its turn says.
    let kiteAp = 0; if (!pc.melee && P.kites?.(E, pc) && MP.engaged(pc, W) && !pc.cond.immob && pcMove(pc, { how: "advance", ap: 1 }) !== false) { kiteAp = 1; out.ap = 1; pc.st.kited = (pc.st.kited ?? 0) + 1; }
    if (!pc.melee && M.grid) {   // SIM-2, on a map: a ranged PC that can target no enemy from where it stands Advances to a square with a line to one (a decision: SIM-3 moves it to the policy)
      const sees = () => alive().some(f => MP.canTarget(pc, f, W) && Number.isFinite(MP.rangeBanes(pc.range, MP.dist(pc.pos, f.pos))));
      for (let k = 0; k < 2 && !sees() && out.ap < RULES.ap - 1 && MP.speedOf(pc) > 0 && !pc.down; k++) {
        const tg = pc.quarry && !pc.quarry.dead ? pc.quarry : MP.nearest(pc, alive(), W); if (!tg) break;
        if (pc.cond.immob === "escape") { pc.cond.immob = null; out.ap++; }
        const from = at(pc), n = MP.walk(pc, MP.sightScore(q => 0.2 * MP.dist(q, tg.pos) + 3 * Math.max(0, MP.dist(q, tg.pos) - pc.range[0]) - 0.1 * Math.min(4, ...alive().map(f => MP.dist(q, f.pos))), tg, W), MP.speedOf(pc), W, pcLeave(++actionId));
        if (!n) break;
        out.ap++; pc.leftSquare = round; pc.stanceOff = true; ev("move", { who: nameOf(pc), how: "Advance", from, to: at(pc) , path: trail(pc) });
      }
      pc.st.moveAP += out.ap - kiteAp; return out;
    }
    if (!pc.melee || alive().some(f => MP.adj(pc, f))) return out;
    const t = P.meleeGoal?.(E, pc, alive()) ?? MP.nearest(pc, alive(), W);   // SIM-3: whom a melee PC walks to (the plan: the nearest)
    if (!t) return out;
    if (pc.cond.immob === "escape") { pc.cond.immob = null; out.ap++; }   // 1 AP [Move] to end it (Immobilized)
    const gap = M.grid ? MP.gap(pc, t, W) : MP.dist(pc.pos, t.pos) - 1, sp = MP.speedOf(pc);
    if (P.holds?.(E, pc, t, gap, sp)) { out.held = true; pc.st.held = (pc.st.held ?? 0) + 1; ev("hold", { who: nameOf(pc) }); return out; }   // SIM-3: it waits for the enemy to come (its AP stay unspent: Guard at its next turn)
    if (sp <= 0) return out;
    const hasWA = turn.steps.some(x => /^weapon attack/i.test(x));
    if (!pc.cond.hindered && gap >= 3 && gap <= sp && hasWA && MP.canTarget(pc, t, W)) {   // Charge: the Advance part costs 1 AP here, its Weapon Attack is the turn's first one, with 1 Boon
      const from = at(pc); if (MP.walk(pc, MP.toward(t), sp, W, pcLeave(++actionId))) { pc.leftSquare = round; pc.stanceOff = true; } out.ap++; pc.st.charges++; ev("move", { who: nameOf(pc), how: "Charge", from, to: at(pc) , path: trail(pc) });
      out.startNext.push({ kind: "boon", n: 1, scope: "next", name: "weapon attack", quarry: false, traits: [] });
    } else {
      while (!alive().some(f => MP.adj(pc, f)) && out.ap < RULES.ap && !pc.down) {
        out.ap++; const from = at(pc), n = MP.walk(pc, MP.toward(t), MP.speedOf(pc), W, pcLeave(++actionId)); if (n) { pc.leftSquare = round; pc.stanceOff = true; ev("move", { who: nameOf(pc), how: "Advance", from, to: at(pc) , path: trail(pc) }); }
        if (pc.cond.hindered === "move") pc.cond.hindered = null;
        if (!n) break;
      }
    }
    pc.st.moveAP += out.ap;
    return out;
  };
  /** An NPC's turn on the map: it stands up, ends Immobilized when it must move, chooses a PC it can reach (the most Strikes after moving), moves and strikes. */
  const npcTurnMap = f => {
    f.escTurns[Math.min(3, f.esc ?? 0)]++;   // pack R-bestiary: an Elite's turns by Escalation level
    let ap = f.apMax - (f.cond.slowed || 0) - f.apDebt - (f.cond.dazed || 0); f.cond.slowed = 0; f.apDebt = 0; f.cond.dazed = 0;   // Dazed: AP it lost (pack R-classes)
    const cost = (f.apMax - 1) / f.strikes;   // its Strikes are its Bestiary damage a turn with 1 AP left for moving
    if (f.cond.prone) { ap--; f.cond.prone = false; standReact(f); if (f.dead) return; }   // Stand (1 AP [Move]): an Opportunity Attack's trigger too
    const targets = up(); if (!targets.length) return;
    const reachAP = t => {
      const gap = f.melee ? (M.grid ? MP.gap(f, t, W) : MP.cheb(f.pos, t.pos) <= 1 ? 0 : MP.dist(f.pos, t.pos) - 1) : Math.max(MP.canTarget(f, t, W) ? 0 : 1, MP.dist(f.pos, t.pos) - f.range[0]);
      const stepAway = !f.melee && MP.engaged(f, W) ? 1 : 0;
      if (!gap) return stepAway;
      if (f.cond.immob === "eot") return Infinity;
      const esc = f.cond.immob === "escape" ? 1 : 0, half = Math.floor(f.speed / 2), first = f.cond.hindered ? half : f.speed, rest = f.cond.hindered === "eot" ? half : f.speed;
      if (first <= 0) return Infinity;
      return esc + (gap <= first ? 1 : 1 + Math.ceil((gap - first) / Math.max(1, rest)));
    };
    const oaNear = up().some(p => rxOf(p).some(rx => rx.kind === "opportunity" && p.keptAP >= oaNeed(p, rx)) && oaCan(p, f));
    const w = targets.map(t => PN.npcWeight(E, f, t, Math.min(f.strikes, Math.max(0, ap - reachAP(t)) / cost), f.melee && oaNear && !MP.adj(f, t)));
    const sum = w.reduce((a, x) => a + x, 0);
    let t;
    if (sum > 0) { let x = (f.R ?? R)() * sum; t = targets.find((p, k) => (x -= w[k]) < 0) ?? targets[0]; }
    else t = PN.npcNearest(E, f, targets);
    const there = () => (f.melee ? MP.adj(f, t) : MP.dist(f.pos, t.pos) <= f.range[0] && !MP.engaged(f, W) && MP.canTarget(f, t, W));
    while (!there() && ap > 0 && !f.dead) {
      if (f.cond.immob === "eot") break;
      if (f.cond.immob === "escape") { ap--; f.cond.immob = null; continue; }
      const sp = MP.speedOf(f); if (sp <= 0) break;
      ap--;
      const from0 = at(f), n = MP.walk(f, f.melee ? MP.toward(t) : (MP.engaged(f, W) ? MP.awayFrom(up(), 3) : MP.sightScore(p => Math.max(0, MP.dist(p, t.pos) - f.range[0]), t, W)), sp, W, npcLeave(++actionId)); if (n) ev("move", { who: nameOf(f), how: "Advance", from: from0, to: at(f) , path: trail(f) });
      if (f.cond.hindered === "move") f.cond.hindered = null;
      if (!n) break;
      if (!f.melee) break;   // a ranged NPC moves once
    }
    if (!f.dead && f.acts) actsTurn(f, t, ap);   // the Bestiary's turn budget: its own Actions
    else if (!f.dead && RULES.npcSpecials && f.kit) {   // pack R prep: every AP left goes to attacks: the Encounter Special (once), the Round Special (once a round), Basic attacks (At-will Banes); 3 Strikes
      let basics = 0;
      for (let s = 0; s < 3 && ap > 0; s++) {
        const enc = f.kit.enc && !f.encUsed && ap >= f.kit.enc.ap ? f.kit.enc : null, rnd = !enc && f.kit.round && f.roundSpecialN < RR.eliteRoundSpecials(f.esc, RULES.eliteRungs) && ap >= f.kit.round.ap ? f.kit.round : null, sp = enc ?? rnd;   // Elite Escalation 2: the Round Special twice a round
        if (t.down || (f.melee && !MP.adj(f, t))) t = PN.npcRetarget(E, f);
        if (!t) break;
        const m = MP.mapMods(f, t, f.melee ? "melee" : "ranged", W); if (!m) break;
        const eb = f.firstAtk ? RR.eliteFirstAttackBoons(f.esc, RULES.eliteRungs) : 0; f.firstAtk = false;   // Elite Escalation 1: its first attack each round has 1 Boon
        if (sp) { ap -= sp.ap; if (enc) f.encUsed = true; else { f.roundSpecial = round; f.roundSpecialN++; } f.curMult = sp.mult * RULES.npcSpecials; npcHit(f, t, 0, m.boons + eb, m.banes, m.doomed); f.curMult = 1; }
        else { ap--; npcHit(f, t, basics++, m.boons + eb, m.banes, m.doomed); }
      }
    } else if (!f.dead) {
      const x = Math.min(f.strikes, Math.max(0, ap) / cost);
      const n = Math.floor(x + 1e-9) + (x % 1 > 1e-9 && (f.R ?? R)() < x % 1 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        if (t.down || (f.melee && !MP.adj(f, t))) t = PN.npcRetarget(E, f);
        if (!t) break;
        const m = MP.mapMods(f, t, f.melee ? "melee" : "ranged", W); if (!m) break;
        npcHit(f, t, k, m.boons, m.banes, m.doomed);
      }
    }
    if (f.cond.hindered) f.cond.hindered = null;   // EoT, and Lock & Loose's "for 1 round"
    if (f.cond.immob === "eot") f.cond.immob = null;
  };
  ev("start", { map: M ? (M.grid ? M.grid.title : "open field") : "no positions", grid: M?.grid ? { w: M.grid.w, h: M.grid.h, walls: M.grid.walls, rough: M.grid.roughs } : undefined, order: order.map(o => nameOf(o.pc ?? o.npc)), creatures: [...pcs, ...foes].map(c => ({ name: nameOf(c), side: c.build ? "pc" : "npc", pos: at(c), health: c.build ? c.build.pool : c.pool, damage: c.damage })) });
  while (alive().length && up().length && round < maxRounds) {
    round++; ev("round");
    for (const p of pcs) { p.firstThisRound = new Set(); if (round > 1 && !p.down) p.esc = Math.min(RULES.escMax, (p.esc ?? 0) + 1); }   // RULES.escMax: 3 (the book: roundrules.mjs ESC_MAX), or the Stage 0 prototype's 6   // +1 Escalation at the start of every round after the first
    for (const f of foes) { f.roundSpecialN = 0; f.firstAtk = true; f.roundDone = null; if (RULES.eliteEsc && f.role === "elite" && !f.dead) { f.esc = round === 1 ? 1 : Math.min(RULES.eliteMax ?? 3, f.esc + 1); eliteRung(f); } }   // pack R-bestiary: Elite Escalation (+1 a round from round 2)
    if (inject && round === inject.round) inject.fn({ pcs, foes, R, M, round });
    for (const o of order) {
      if (!alive().length || !up().length) break;
      if (o.pc) {
        const pc = o.pc; if (pc.down) continue;
        if (pc.guardMelee) { pc.guardMelee = false; if (pc.guardBy === pc) pc.guard = 0; }
        const tev = ev("turn", { who: nameOf(pc), escalation: pc.esc, pos: at(pc) });   // its turn's line comes first in the log; the turn's name and AP are written when they are known
        // The unused AP's Guard (Chapter 2, Unspent AP; the book since v0.0.274): when the turn starts, each AP still unused gives Guard for 1 round (what is left of the last one ends).
        // guardAt "end" (pack R prep's model): the Guard was given when the turn ended and ends here.
        { const g = guardPerAp(pc.build.level); if (g && RULES.guardAt === "next") { pc.apGuard = RULES.apGuard === "stage" ? RR.unusedApGuard(true, pc.turnKept ?? 0, CF.stageOf(pc.build.level)).guard : (pc.turnKept ?? 0) * g; pc.st.apGuardGiven += pc.apGuard; } else pc.apGuard = 0; pc.turnKept = 0; }
        pc.stanceOff = false;   // Hallowed Stance: a new turn; moving during it turns the Stance off until the next
        pc.st.rounds++; pc.st.escTurns[Math.min(3, pc.esc)]++; (pc.st.escHist ??= [0, 0, 0, 0, 0, 0, 0])[Math.min(6, pc.esc)]++; if (pc.damage - (pc.mindDamage ?? 0) >= pc.build.bodyHealth) pc.st.bloodiedTurns++; if ((pc.mindDamage ?? 0) >= pc.build.mindHealth) pc.st.strainedTurns++;   // pack R prep: turns by Escalation level, turns while Bloodied
        for (const x of pcs) if (x.defBy === pc) { x.defBonus = 0; x.defBy = null; }   // a Defense bonus lasts 1 round: until its giver's next turn
        for (const f of foes) { if (f.surge?.by === pc) f.surge = null; if (f.zone?.by === pc) f.zone.left--; if (f.vulnKeep === pc) { f.vulnKeep = null; f.vulnerable = 0; } }   // Divine Surge lasts until your next turn; an area counts its rounds down on its maker's turn
        for (const x of pcs) if (x.zoneHeal?.by === pc) x.zoneHeal.left--;
        if (geo()) { for (const z of zones) if (z.by === pc && z.left > 0 && --z.left <= 0) ev("zone-end", { id: z.id, name: z.a.name }); const z = zoneHelp(pc, "heal"); pc.zoneHeal = z ? { dmg: z.heal, left: 1, by: z.by } : null; if (z && pc.damage > 0) { z.by.st.zoneHealed = (z.by.st.zoneHealed ?? 0) + 1; tally(z.by, z.a.name, "healed"); } }
        if (pc.zoneHeal?.left > 0 && pc.damage > 0) mendOne(pc, rollDamage(pc.R ?? R, pc.zoneHeal.dmg).total, pc.zoneHeal.by);   // healing at the start of its turn (Consecrated Ground)
        if (!pc.quarry || pc.quarry.dead) pc.quarry = P.quarry(E, pc);   // Marked Quarry: the first target; a new one when it dies
        // Pack R-classes: start-of-turn Passives: `mend` heals the most hurt of you and your allies (Mending Light), `surge` marks the focus target (Divine Surge as a Passive).
        for (const p of pc.build.passives.filter(x => pc.esc >= x.escalation)) {
          if (p.effect.kind === "mend") { const t = p.effect.who === "self" ? pc : mostHurt(up().filter(x => (p.effect.who === "any" || x !== pc) && x.damage > 0)); if (t) mendOne(t, rollDamage(pc.R ?? R, p.effect.dmg, { mod: pc.build.powerMod }).total, pc); }
          if (p.effect.kind === "surge") { const t = focus(); if (t) t.surge = { dmg: p.effect.dmg, by: pc }; }
        }
        let extra = {};
        if (M) {
          let limit = RULES.ap - (pc.cond.slowed || 0) - (pc.cond.dazed || 0) + (pc.readyAP ?? 0); pc.cond.dazed = 0; pc.cond.slowed = 0;   // Slowed (an enemy's, EoT): it takes its AP, then ends
          if (pc.cond.bleed?.by && !pc.cond.bleed.by.build && limit > RR.SHAKE_OFF_AP) { limit -= RR.SHAKE_OFF_AP; const tier = pick(pc.R ?? R, C.tierProbs(Math.max(...Object.values(pc.build.attributes ?? { x: 1 })), 13, 0, 0, "")); if (tier === 3) pc.cond.bleed = null; else if (tier === 2) pc.cond.bleed.half = true; }   // an enemy's Lingering (it was Bleed): the Shake Off Action (1 AP; pack Advance: its own Action, no longer an Interact) to end it, a Save against DC 13   // pack R-classes: Ready Shot's AP (turnFor reads it, then it is spent)   // pack R: Slowed lowers the turn's AP, not the Reaction AP (the default to confirm)
          if (pc.cond.prone) { limit--; pc.cond.prone = false; }   // Stand (1 AP)
          // The Stage 0 prototype, candidate E: a PC with a second weapon (pc.alt: { build, cost }) puts the ranged one away for the melee one when an enemy is on it (once a fight; cost AP).
          if (pc.alt && !pc.switched && alive().some(f => MP.dist(pc.pos, f.pos) <= 2)) { pc.build = pc.alt.build; pc.melee = true; pc.range = [1]; pc.switched = true; limit -= pc.alt.cost; pc.st.switches = (pc.st.switches ?? 0) + 1; }
          const eng = MP.engaged(pc, W); if (eng) pc.st.turnsEngaged++;
          if (pc.leftSquare == null || pc.leftSquare < round - 1) pc.st.stillTurns++;   // it hasn't left its square since the start of its last turn (Patient Hunter)
          const turn = pc.build.turns[P.pcTurn(E, pc, eng)];
          pc.readyAP = 0;
          if (tev) Object.assign(tev, { turn: turn.name, ap: limit, guard: (pc.guard ?? 0) + (pc.apGuard ?? 0) });
          const ap = approach(pc, turn);
          extra = { apLimit: Math.max(0, limit - ap.ap), startNext: ap.startNext, turnKey: ap.held ? { name: "Hold", steps: [] } : turn };
        }
        const turn = extra.turnKey ?? pc.build.turns[P.pcTurn(E, pc)];
        if (!M && tev) Object.assign(tev, { turn: turn.name, ap: extra.apLimit ?? RULES.ap, guard: (pc.guard ?? 0) + (pc.apGuard ?? 0) });
        const r = runTurn(pc, turn, ctxFor(pc, extra));
        const left = Math.max(0, (extra.apLimit ?? RULES.ap) - r.ap);
        pc.keptAP = RULES.reactionAp + left;   // pack R: the Reaction AP on top of what the turn left
        { const g = guardPerAp(pc.build.level);
          if (g && RULES.guardAt === "next") { pc.st.apLeft += left; pc.turnKept = left; }   // kept until its next turn starts: they can pay a Reaction, and what is left then becomes Guard
          else if (g) { pc.apGuard = left * g; pc.st.apGuardGiven += pc.apGuard; pc.st.apLeft += left; pc.turnKept = RULES.apGuardKeep ? left : 0; if (!RULES.apGuardKeep) pc.keptAP = RULES.reactionAp; } }   // pack R prep: unspent AP become Guard at once
        if (r.crit) hook(pc, "crit");
        if (RULES.meleeGuard && M && pc.melee && !pc.down && MP.engaged(pc, W) && RULES.meleeGuard >= (pc.guard ?? 0)) { pc.guard = RULES.meleeGuard; pc.guardBy = pc; pc.guardMelee = true; }   // candidate B2: a melee PC that ends its turn Engaged has Guard until its next turn
        if (M) { pc.st.lostAP += r.lostAP; pc.reacted = null; if (pc.cond.hindered) pc.cond.hindered = null; if (pc.cond.immob === "eot") pc.cond.immob = null; pc.cond.staggered = null; pc.cond.blinded = null; pc.cond.frightened = null;
          if (pc.cond.bleed) { let v = rollDamage(pc.R ?? R, parseDamage(pc.cond.bleed.dmg)).total; if (pc.cond.bleed.half) { v = Math.floor(v / 2); pc.cond.bleed = null; } pc.damage += v; pc.st.taken += v; if (v) pcHurt(pc); }
          pc.cond.vuln = 0; pc.cond.enf = 0; pc.taunt = null; }   // a PC's Lingering at the end of its turn (pack R-classes)
        pc.st.dealt += r.damage; pc.st.counted += r.counted; pc.st.mindDealt += r.mind;
        if (r.nova) { pc.st.novaDealt += r.damage; pc.st.novaTurns++; }
        killCheck();
      } else {
        const f = o.npc; if (f.dead) continue;
        f.turnId = `${round}:${foes.indexOf(f)}`; f.reactAP = f.reactionAp ?? RULES.npcReactionAp; ev("turn", { who: nameOf(f), escalation: f.esc || undefined, pos: at(f) });
        if (M) npcTurnMap(f);
        else for (const a of npcSeq(f)) {   // no positions: its Bestiary Strikes, or (pack R) everything its AP buys
          const targets = up(); if (!targets.length) break;
          const w = targets.map(p => PN.npcFlatWeight(E, f, p)), sum = w.reduce((a2, x) => a2 + x, 0); let x = R() * sum;
          const t = targets.find((p, k) => (x -= w[k]) < 0) ?? targets[0];
          f.curMult = a.mult; npcHit(f, t, a.k, a.boons); f.curMult = 1;
        }
        f.taunt = null; if (!f.vulnKeep) f.vulnerable = 0;   // EoT effects end with its turn (a kept Vulnerable ends at its giver's next turn: pack R-classes)
        if (f.cond?.bleed) { const v = rollDamage(f.R ?? R, parseDamage(f.cond.bleed.dmg)).total; f.damage += v; if (f.cond.bleed.mind) f.mindDamage = (f.mindDamage ?? 0) + v; if (f.cond.bleed.by?.st) { f.cond.bleed.by.st.bleedDealt += v; f.cond.bleed.by.st.dealt += v; } killCheck(); }   // Lingering at the end of its turn (pack R-classes)
        if (f.cond) { f.cond.staggered = null; f.cond.blinded = null; f.cond.frightened = null; }
        if (f.zone && f.zone.left <= 0) f.zone = null;
      }
    }
  }
  const health = pcs.reduce((s, p) => s + p.build.pool, 0), lost = pcs.reduce((s, p) => s + Math.max(0, Math.min(p.damage, p.build.pool) - p.startDamage), 0);
  ev("end", { won: !alive().length, rounds: round, creatures: [...pcs, ...foes].map(c => ({ name: nameOf(c), pos: at(c), damage: Math.round(c.damage * 10) / 10, out: !!(c.down || c.dead) })) });
  return { log: events, rounds: round, won: !alive().length, lost: lost / health, downs: pcs.filter(p => p.down).length, firstDown, wipe: !up().length, downBy: pcs.map(p => p.down), pcs, W };
}

/**
 * Between two fights (minutes, not a Rest): a PC that is Down is brought back (it uses a Rally Point through an ally's Lay On Hands when an
 * ally has it, or heals what one Rally Point heals after an hour Unconscious); then every PC uses Rally Points (Steel Yourself, no AP limit
 * out of combat) while its damage is at least 3/4 of what one heals. Rally Points come back only with a Rest.
 */
export function between(pcs) {
  const healer = pcs.some(p => p.damage < p.build.pool && Object.values(p.build.actions).some(a => a.effects.some(e => e.effect.kind === "heal" && e.effect.who !== "self")));
  const use = p => { const rb = rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false), h0 = Math.min(p.damage, p.build.rallyHeal), h = Math.min(p.damage, p.build.rallyHeal + rb.n);
    p.damage -= h; p.rallyLeft--; p.st.rpBetween++; if (rb.by) pcs.find(x => x.build === rb.by.build && x.st === rb.by.st).st.mercyGiven += h - h0; };
  for (const p of pcs) {
    if (p.damage >= p.build.pool) {
      if (healer && p.rallyLeft > 0) use(p);
      else p.damage -= Math.min(p.damage, p.build.rallyHeal);
    }
    while (p.rallyLeft > 0 && p.damage >= 0.75 * (p.build.rallyHeal + rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false).n)) use(p);
  }
}

/**
 * A day: the party (builds) through its fights, in order, with no Rest. Momentum (Lucas, 2026-10-29): +1 after each fight harder than easy
 * (more than CV 3/4 per PC); with Momentum a PC starts a fight with half its level in Escalation (rounded up), up to 2; a Rest resets it.
 * Returns { fights: [fight results], pcs, cleared }.
 */
/** An NPC role's CV a PC (pack E3: the Bestiary writes CV ×100, by Stage gap; the same Stage here). */
export const roleCv = role => { const c = TW.npcRoles[role]?.cv; return Array.isArray(c) ? c[0] / 100 : (c ?? 1); };
export const MOMENTUM = { on: true, minCvPerPc: 0.75, startEsc: lv => (RULES.escalation === "level" ? RR.escalationStart(true) : Math.min(2, Math.ceil(lv / 2))) };   // the book (Chapter 2, Momentum): Escalation 2 instead of 1; before pack R: half the level, up to 2
export function day(party, encounters, R, { momentum = MOMENTUM.on, map = MP.MAP } = {}) {
  const pcs = party.map(pcState), out = [];
  let mom = 0;
  const cvOf = e => e.reduce((s, n) => s + (n.cv ?? roleCv(n.role)), 0) / pcs.length;
  for (const [i, e] of encounters.entries()) {
    if (!pcs.some(p => p.damage < p.build.pool)) break;
    const ladder = RULES.momentum === "ladder", d0 = pcs.reduce((s, p) => s + p.st.downs, 0);   // Stage 0: Momentum 0 to 4, a fight starts at Escalation 1 + Momentum
    for (const p of pcs) { p.startEsc = ladder ? RR.escalationStartAt(momentum ? mom : 0) : momentum && mom > 0 ? MOMENTUM.startEsc(p.build.level) : RULES.startEsc; p.dailyOK = cvOf(e) >= 1.25 || i === encounters.length - 1; }   // a Daily is kept for a hard fight (or the last one)
    out.push(fight(pcs, e, R, { map }));
    out.at(-1).momentum = mom; out.at(-1).startEsc = pcs[0].startEsc;
    if (!out.at(-1).won) break;
    const cvPc = e.reduce((s, n) => s + (n.cv ?? roleCv(n.role)), 0) / pcs.length, hard = RULES.escalation === "level" ? RR.givesMomentum(Math.round(cvPc * 1e6) / 1e4) : cvPc > MOMENTUM.minCvPerPc;
    if (ladder) mom = RR.momentumAfter(mom, { overcome: 1, downs: pcs.reduce((s, p) => s + p.st.downs, 0) - d0 });   // +1 for the encounter overcome, -1 for each PC that went Down in it
    else if (RULES.escalation === "level") mom = hard ? 1 : 0; else if (hard) mom++;   // the book: the next encounter uses Momentum up (an easy fight gives none); before pack R the ruler kept it for the day
    between(pcs);
  }
  return { fights: out, pcs, cleared: out.length === encounters.length && out.every(f => f.won) };
}
