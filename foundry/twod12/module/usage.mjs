// What a creature has already used: Turn actions (until the current turn ends, whoever's turn it is), Round actions (once per turn-cycle: until the creature's own
// next turn starts), Encounter actions (until the combat ends)
// and the Strikes of its turn (three Strikes is the limit). The sheets show used actions faded.
import { techniqueLock, techniqueState, TECHNIQUE_AT } from "./mastery.mjs";
import { effectiveFrequency } from "./config.mjs";
import { allEffects } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
const F = "twod12";

/** Does a grant spec ("Basic Attack", "category:Weapon Technique", "trait:strike") name this Action? */
export function grantMatches(spec, item) {
  const s = String(spec ?? "").trim(), low = s.toLowerCase();
  if (low.startsWith("category:")) return String(item.system.category ?? "").trim().toLowerCase() === low.slice(9).trim();
  if (low.startsWith("trait:")) return item.system.traits?.has?.(low.slice(6).trim()) ?? false;
  // v0.0.500: the Weapon Attack is the Basic Attack since v0.0.480; a grant an older world wrote with the old name still names it
  const alias = n => (n === "weapon attack" ? "basic attack" : n);
  return alias(item.name.trim().toLowerCase()) === alias(low);
}

/** The granted uses of an Action the creature has right now: [{ effect, index, grant }]. */
export function activeGrants(actor, item) {
  const out = [];
  for (const e of actor?.effects ?? []) {
    if (e.disabled) continue;
    (e.getFlag?.(F, "grants") ?? e.flags?.[F]?.grants ?? []).forEach((g, index) => { if (g.left > 0 && grantMatches(g.spec, item)) out.push({ effect: e, index, grant: g }); });
  }
  return out;
}

/** v0.0.216: the creature's combatant in this combat (its token's, for an unlinked NPC). */
export function combatantOf(combat, actor) {
  const list = [...(combat?.combatants ?? [])];
  return list.find(c => actor?.isToken && c.tokenId === actor.token?.id) ?? list.find(c => c.actor === actor) ?? list.find(c => !actor?.isToken && c.actorId === actor?.id) ?? null;
}
/** v0.0.216 (Lucas: Encounter uses came back after a reload): the uses are also kept on the combatant (saved with the combat), and both are read. */
const backup = (combat, actor) => { try { return combatantOf(combat, actor)?.getFlag?.(F, "usedHere") ?? null; } catch (e) { return null; } };

const state = actor => {
  const combat = game.combat;
  if (!combat?.started) return null;
  const u = actor.getFlag(F, "usage");
  const mine = u && u.combatId === combat.id;
  const b = backup(combat, actor), bm = b && b.combatId === combat.id;
  const roundAt = { ...(bm ? (b.roundAt ?? {}) : {}), ...(mine ? (u.roundAt ?? {}) : {}) };
  for (const [id, at] of Object.entries(bm ? (b.roundAt ?? {}) : {})) if (!roundAt[id] || at[0] > roundAt[id][0] || (at[0] === roundAt[id][0] && at[1] > roundAt[id][1])) roundAt[id] = at;
  return {
    combat,
    roundUsed: mine && u.round === combat.round ? (u.roundUsed ?? []) : [],   // (before v0.0.146: used this round number)
    roundAt,   // id -> [round, turn] when it was used (the latest of the actor's and the combatant's)
    turnUsed: mine && u.turnUsedKey === `${combat.round}:${combat.turn}` ? (u.turnUsed ?? []) : [],
    encounter: [...new Set([...(mine ? (u.encounter ?? []) : []), ...(bm ? (b.encounter ?? []) : [])])],
    // v0.0.320: the use before the last one of a Round Action (a second use in one turn-cycle) and the Encounter Actions used a second time
    roundPrev: { ...(bm ? (b.roundPrev ?? {}) : {}), ...(mine ? (u.roundPrev ?? {}) : {}) },
    encounter2: [...new Set([...(mine ? (u.encounter2 ?? []) : []), ...(bm ? (b.encounter2 ?? []) : [])])],
    // v0.0.494 (Playtest 8 Pass 1): targets already Demoralized by this actor this encounter (immune to your Demoralize, EoE)
    demoralized: [...new Set([...(mine ? (u.demoralized ?? []) : []), ...(bm ? (b.demoralized ?? []) : [])])],
    strikes: mine && u.turnKey === `${combat.round}:${combat.turn}` ? (u.strikes ?? 0) : 0,
    // v0.0.215 (Lucas, playtest 2): a list, not an object. setFlag merges objects, so last turn's counts (an object keyed by item id) stayed in
    // the flag and a first use this turn got "At-will use 2". A list is replaced whole.
    atwill: mine && u.atwillKey === `${combat.round}:${combat.turn}` ? Object.fromEntries(u.atwillList ?? []) : {}
  };
};

const hasTrait = (item, t) => !!(item?.system?.traits?.has?.(t) || (Array.isArray(item?.system?.traits) && item.system.traits.includes(t)));
/** v0.0.494 (Playtest 8 Pass 1; book, Chapter 7 Strike): all At-will [Strike] Actions share one At-will count. */
export const atWillKeyOf = item => (hasTrait(item, "strike") ? "__strike" : item?.id);

/**
 * v0.0.320 (pack AU part 2; book, Bestiary, Elite Escalation): the extra uses this creature's settings give right now ("More uses of a Frequency":
 * "round" = its own Round Actions twice a round, "encounter" = its own Encounter Actions a second time). Its own = not a Basic Action (isSpecial: the old name).
 */
export function freqMoreOf(actor) {
  const out = new Set();
  for (const e of allEffects(actor)) { if (effectOff(actor, e)) continue; for (const w of e.getFlag?.(F, "freqMore") ?? e.flags?.[F]?.freqMore ?? []) out.add(w); }
  return out;
}
const isSpecial = item => !(item?.getFlag?.(F, "basic") ?? item?.flags?.[F]?.basic);
/** Pure: how many uses this Frequency allows in its span (a turn-cycle for Round, the encounter for Encounter). */
// v0.0.435 (the Bestiary audit, question 13): Relentless doubles a Round Special Action, not a Reaction
export const usesAllowed = (freq, more, special, reaction = false) => (special && ((freq === "round" && more.has("round") && !reaction) || (freq === "encounter" && more.has("encounter"))) ? 2 : 1);

/** Is this Action unavailable right now? { faded, why } */
export function isFaded(actor, item) {
  const lock = techniqueLock(actor, item);   // a Weapon Technique before 3 Mastery with its weapon (mastery.mjs)
  if (lock.locked) return { faded: true, why: `Locked: ${TECHNIQUE_AT} ${lock.group} Mastery unlocks it (now ${lock.value})` };
  if (techniqueState(actor, item) === "unwielded") return { faded: true, why: `Wield the ${actor.items.get(item.getFlag(F, "weaponId"))?.name ?? "weapon"} to use it` };
  if (item?.type === "action" && effectiveFrequency(item.system) === "daily" && (actor?.getFlag?.(F, "dailyUsed") ?? []).includes(item.id)) return { faded: true, why: "Used today: renews after a Sleep or a Rest" };
  const s = actor?.type && item?.type === "action" ? state(actor) : null;
  if (!s) return { faded: false, why: "" };
  if (activeGrants(actor, item).length) return { faded: false, why: "" };   // a granted use is free: the Action is available
  const f = effectiveFrequency(item.system);
  if (f === "turn" && s.turnUsed.includes(item.id)) return { faded: true, why: "Used this turn" };
  const twice = (f === "round" || f === "encounter") && usesAllowed(f, freqMoreOf(actor), isSpecial(item), !!item?.system?.reaction) > 1;   // v0.0.320: the Elite ladder
  if (f === "round" && (s.roundUsed.includes(item.id) || roundBlocked(actor, s.combat, s.roundAt[item.id])) && (!twice || roundBlocked(actor, s.combat, s.roundPrev[item.id]))) return { faded: true, why: twice ? "Used twice: available again at the start of your next turn" : "Used: available again at the start of your next turn" };
  if (f === "encounter" && s.encounter.includes(item.id) && (!twice || s.encounter2.includes(item.id))) return { faded: true, why: twice ? "Used twice this encounter" : "Used this encounter" };
  // v0.0.224 (Lucas): the 3 Strikes are not greyed like a used Frequency: the row gets its own marker (strikeCap).
  if (item.system.traits.has("strike") && s.strikes >= 3) return { faded: false, strikeCap: true, why: "Three Strikes this turn" };
  return { faded: false, why: "" };
}

/** Round Frequency: once per turn-cycle. A use at (round, turn) blocks the Action until this creature's own next turn starts:
 *  later this round if it was used before the creature's turn came up (a Reaction), otherwise next round. */
function roundBlocked(actor, combat, at) {
  if (!at || !combat) return false;
  const own = combat.turns.findIndex(c => c.actor === actor || (actor?.isToken && c.tokenId === actor.token?.id));
  return turnCycleBlocked(combat.round, combat.turn, own, at);
}

/** Pure: is something done at `at` = [round, turn] still within the creature's turn-cycle (its own turn index `own`), at round/turn now?
 *  A turn-cycle runs from the start of the creature's turn to the start of its next turn. Not in the turn order (own < 0): the round number decides. */
export function turnCycleBlocked(round, turn, own, at) {
  if (!at) return false;
  const [r, t] = at;
  // v0.0.222 (Lucas: Round Actions stayed greyed): a use recorded after now (the round was moved back: Previous Round, or reset to test) is stale.
  if (r > round || (own >= 0 && r === round && t > turn)) return false;
  if (own < 0) return round === r;
  const next = t < own ? [r, own] : [r + 1, own];
  return round < next[0] || (round === next[0] && turn < next[1]);
}

/** v0.0.224: the Strikes this creature made in the current turn (any creature's turn: up to 3 in each). */
export function strikesUsed(actor) { if (typeof actor?.getFlag !== "function") return 0; const s = actor?.type ? state(actor) : null; return s ? s.strikes : 0; }

/** At-will: how many times this Action (or any At-will [Strike], which share one count) was used this turn. Each use after the first adds 1 bane. */
export function atWillUses(actor, item) {
  const s = actor?.type ? state(actor) : null;
  return effectiveFrequency(item.system) === "atwill" && s ? (s.atwill[atWillKeyOf(item)] ?? 0) : 0;
}

/** v0.0.494 (Playtest 8 Pass 1; Demoralize): has `actor` already used Demoralize on `targetUuid` this encounter? */
export function demoralizedTarget(actor, targetUuid) {
  if (!actor?.type || !targetUuid) return false;
  const s = state(actor);
  return !!(s && s.demoralized.includes(targetUuid));
}

/** v0.0.494: remember that `actor` used Demoralize on `targetUuids` this encounter (target is immune to your Demoralize, EoE). */
export async function markDemoralized(actor, targetUuids = []) {
  const combat = game.combat;
  const ids = [...new Set((targetUuids ?? []).filter(Boolean))];
  if (!combat?.started || !actor?.isOwner || !ids.length) return;
  const u = foundry.utils.deepClone(actor.getFlag(F, "usage") ?? {});
  if (u.combatId !== combat.id) Object.assign(u, { combatId: combat.id, round: combat.round, roundUsed: [], encounter: [], turnKey: "", strikes: 0, demoralized: [] });
  u.demoralized = [...new Set([...(u.demoralized ?? []), ...ids])];
  await actor.setFlag(F, "usage", u);
  try {
    const c = combatantOf(combat, actor);
    const old = c?.getFlag?.(F, "usedHere"), same = old?.combatId === combat.id;
    if (c?.isOwner) await c.setFlag(F, "usedHere", { combatId: combat.id, encounter: same ? (old.encounter ?? []) : [], roundAt: same ? (old.roundAt ?? {}) : {}, roundPrev: same ? (old.roundPrev ?? {}) : {}, encounter2: same ? (old.encounter2 ?? []) : [], demoralized: [...new Set([...(same ? old.demoralized ?? [] : []), ...u.demoralized])] });
  } catch (e) { console.warn("twod12 | keeping demoralized targets on the combatant", e); }
}

/** Remember that an Action was used (in combat). */
export async function markUsed(actor, item, { keepFrequency = false } = {}) {   // v0.0.453: keepFrequency (Unfailing on a Tier 1): only the Strike counts
  // Daily: remembered in or out of combat, until a Sleep or a Rest (sleep.mjs) clears it.
  if (actor?.isOwner && !keepFrequency && effectiveFrequency(item.system) === "daily") {
    const used = actor.getFlag(F, "dailyUsed") ?? [];
    if (!used.includes(item.id)) await actor.setFlag(F, "dailyUsed", [...used, item.id]);
  }
  const combat = game.combat;
  if (!combat?.started || !actor?.isOwner) return;
  const u = foundry.utils.deepClone(actor.getFlag(F, "usage") ?? {});
  if (u.combatId !== combat.id) Object.assign(u, { combatId: combat.id, round: combat.round, roundUsed: [], encounter: [], turnKey: "", strikes: 0, demoralized: [] });
  if (u.round !== combat.round) { u.round = combat.round; u.roundUsed = []; }
  const f = keepFrequency ? "" : effectiveFrequency(item.system);
  if (f === "turn") {
    const k = `${combat.round}:${combat.turn}`;
    if (u.turnUsedKey !== k) { u.turnUsedKey = k; u.turnUsed = []; }
    if (!u.turnUsed.includes(item.id)) u.turnUsed.push(item.id);
  }
  if (f === "round") { if (u.roundAt?.[item.id]) (u.roundPrev ??= {})[item.id] = u.roundAt[item.id]; (u.roundAt ??= {})[item.id] = [combat.round, combat.turn]; }   // v0.0.320: the use before is kept (twice a round)
  if (f === "encounter") { if (!(u.encounter ??= []).includes(item.id)) u.encounter.push(item.id); else if (!(u.encounter2 ??= []).includes(item.id)) u.encounter2.push(item.id); }
  if (f === "atwill") {
    const k = `${combat.round}:${combat.turn}`, ak = atWillKeyOf(item);
    const counts = u.atwillKey === k ? Object.fromEntries(u.atwillList ?? []) : {};
    u.atwillKey = k;
    counts[ak] = (counts[ak] ?? 0) + 1;
    u.atwillList = Object.entries(counts);
    delete u.atwill;
  }
  if (item.system.traits.has("strike")) {
    const key = `${combat.round}:${combat.turn}`;
    if (u.turnKey !== key) { u.turnKey = key; u.strikes = 0; }
    u.strikes += 1;
  }
  await actor.setFlag(F, "usage", u);
  if (f === "encounter" || f === "round") {
    try {
      const c = combatantOf(combat, actor);
      const old = c?.getFlag?.(F, "usedHere"), same = old?.combatId === combat.id;
      const dem = [...new Set([...(same ? old.demoralized ?? [] : []), ...(u.demoralized ?? [])])];
      if (c?.isOwner) await c.setFlag(F, "usedHere", { combatId: combat.id, encounter: [...new Set([...(same ? old.encounter ?? [] : []), ...(u.encounter ?? [])])], roundAt: { ...(same ? old.roundAt ?? {} : {}), ...(u.roundAt ?? {}) },
        roundPrev: { ...(same ? old.roundPrev ?? {} : {}), ...(u.roundPrev ?? {}) }, encounter2: [...new Set([...(same ? old.encounter2 ?? [] : []), ...(u.encounter2 ?? [])])], ...(dem.length ? { demoralized: dem } : {}) });   // v0.0.320
    } catch (e) { console.warn("twod12 | keeping the uses on the combatant", e); }
  }
}

/** v0.0.224: a Linked use that counts toward At-will Banes only (a Charge's Weapon Attack): not its Frequency or the 3 Strikes. */
export async function markAtWill(actor, item) {
  const combat = game.combat;
  if (!combat?.started || !actor?.isOwner || effectiveFrequency(item.system) !== "atwill") return;
  const u = foundry.utils.deepClone(actor.getFlag(F, "usage") ?? {});
  if (u.combatId !== combat.id) Object.assign(u, { combatId: combat.id, round: combat.round, roundUsed: [], encounter: [], turnKey: "", strikes: 0, demoralized: [] });
  const k = `${combat.round}:${combat.turn}`, ak = atWillKeyOf(item);
  const counts = u.atwillKey === k ? Object.fromEntries(u.atwillList ?? []) : {};
  u.atwillKey = k; counts[ak] = (counts[ak] ?? 0) + 1; u.atwillList = Object.entries(counts);
  await actor.setFlag(F, "usage", u);
}

/** v0.0.219: take a use back (a Charge given up before it moved): its Frequency and Strike count as unused again. */
export async function unmarkUsed(actor, item) {
  const combat = game.combat;
  if (!combat?.started || !actor?.isOwner || !item) return;
  const u = foundry.utils.deepClone(actor.getFlag(F, "usage") ?? {});
  const id = item.id, ak = atWillKeyOf(item);
  if (u.combatId === combat.id) {
    // an object merges: overwrite the entry rather than delete it; v0.0.320: a second use taken back leaves the first one
    if (u.roundAt?.[id]) { u.roundAt[id] = u.roundPrev?.[id] ?? [-1, -1]; if (u.roundPrev?.[id]) u.roundPrev[id] = [-1, -1]; }
    u.turnUsed = (u.turnUsed ?? []).filter(x => x !== id);
    if ((u.encounter2 ?? []).includes(id)) u.encounter2 = u.encounter2.filter(x => x !== id);
    else u.encounter = (u.encounter ?? []).filter(x => x !== id);
    u.roundUsed = (u.roundUsed ?? []).filter(x => x !== id);
    if (u.atwillKey === `${combat.round}:${combat.turn}`) u.atwillList = (u.atwillList ?? []).map(([k, n]) => [k, k === ak ? Math.max(0, n - 1) : n]);
    if (hasTrait(item, "strike") && u.turnKey === `${combat.round}:${combat.turn}`) u.strikes = Math.max(0, (u.strikes ?? 0) - 1);
    await actor.setFlag(F, "usage", u);
  }
  try {   // the combatant's copy too, even when the actor had no record (v0.0.221)
    const c = combatantOf(combat, actor), old = c?.getFlag?.(F, "usedHere");
    if (c?.isOwner && old?.combatId === combat.id) {
      const second = (old.encounter2 ?? []).includes(id);   // v0.0.320: a second use taken back leaves the first one
      await c.setFlag(F, "usedHere", { combatId: combat.id, encounter: second ? (old.encounter ?? []) : (old.encounter ?? []).filter(x => x !== id), encounter2: (old.encounter2 ?? []).filter(x => x !== id),
        roundAt: { ...(old.roundAt ?? {}), ...(old.roundAt?.[id] ? { [id]: old.roundPrev?.[id] ?? [-1, -1] } : {}) }, roundPrev: { ...(old.roundPrev ?? {}), ...(old.roundPrev?.[id] ? { [id]: [-1, -1] } : {}) },
        ...(old.demoralized?.length ? { demoralized: old.demoralized } : {}) });
    }
  } catch (e) { /* the combatant's copy stays */ }
}
// v0.0.361 (PACK PERF, D27): registerUsageHooks is gone: it drew every open actor window again at each turn change, on top of
// actor-sheets.mjs registerSheetHooks (which draws each combatant's sheet once).
