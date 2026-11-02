// What a creature has already used: Turn actions (until the current turn ends, whoever's turn it is), Round actions (once per turn-cycle: until the creature's own
// next turn starts), Encounter actions (until the combat ends)
// and the Strikes of its turn (three Strikes is the limit). The sheets show used actions faded.
import { techniqueLock, techniqueState, TECHNIQUE_AT } from "./mastery.mjs";
import { effectiveFrequency } from "./config.mjs";
const F = "twod12";

/** Does a grant spec ("Weapon Attack", "category:Weapon Technique", "trait:strike") name this Action? */
export function grantMatches(spec, item) {
  const s = String(spec ?? "").trim(), low = s.toLowerCase();
  if (low.startsWith("category:")) return String(item.system.category ?? "").trim().toLowerCase() === low.slice(9).trim();
  if (low.startsWith("trait:")) return item.system.traits?.has?.(low.slice(6).trim()) ?? false;
  return item.name.trim().toLowerCase() === low;
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

const state = actor => {
  const combat = game.combat;
  if (!combat?.started) return null;
  const u = actor.getFlag(F, "usage");
  const mine = u && u.combatId === combat.id;
  return {
    combat,
    roundUsed: mine && u.round === combat.round ? (u.roundUsed ?? []) : [],   // (before v0.0.146: used this round number)
    roundAt: mine ? (u.roundAt ?? {}) : {},   // id -> [round, turn] when it was used
    turnUsed: mine && u.turnUsedKey === `${combat.round}:${combat.turn}` ? (u.turnUsed ?? []) : [],
    encounter: mine ? (u.encounter ?? []) : [],
    strikes: mine && u.turnKey === `${combat.round}:${combat.turn}` ? (u.strikes ?? 0) : 0,
    // v0.0.215 (Lucas, playtest 2): a list, not an object. setFlag merges objects, so last turn's counts (an object keyed by item id) stayed in
    // the flag and a first use this turn got "At-will use 2". A list is replaced whole.
    atwill: mine && u.atwillKey === `${combat.round}:${combat.turn}` ? Object.fromEntries(u.atwillList ?? []) : {}
  };
};

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
  if (f === "round" && (s.roundUsed.includes(item.id) || roundBlocked(actor, s.combat, s.roundAt[item.id]))) return { faded: true, why: "Used: available again at the start of your next turn" };
  if (f === "encounter" && s.encounter.includes(item.id)) return { faded: true, why: "Used this encounter" };
  if (item.system.traits.has("strike") && s.strikes >= 3) return { faded: true, why: "Three Strikes this turn" };
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
  if (own < 0) return round === r;
  const next = t < own ? [r, own] : [r + 1, own];
  return round < next[0] || (round === next[0] && turn < next[1]);
}

/** At-will: how many times this Action was used this turn. Each use after the first adds 1 bane (so the next use has this many banes). */
export function atWillUses(actor, item) {
  const s = actor?.type ? state(actor) : null;
  return effectiveFrequency(item.system) === "atwill" && s ? (s.atwill[item.id] ?? 0) : 0;
}

/** Remember that an Action was used (in combat). */
export async function markUsed(actor, item) {
  // Daily: remembered in or out of combat, until a Sleep or a Rest (sleep.mjs) clears it.
  if (actor?.isOwner && effectiveFrequency(item.system) === "daily") {
    const used = actor.getFlag(F, "dailyUsed") ?? [];
    if (!used.includes(item.id)) await actor.setFlag(F, "dailyUsed", [...used, item.id]);
  }
  const combat = game.combat;
  if (!combat?.started || !actor?.isOwner) return;
  const u = foundry.utils.deepClone(actor.getFlag(F, "usage") ?? {});
  if (u.combatId !== combat.id) Object.assign(u, { combatId: combat.id, round: combat.round, roundUsed: [], encounter: [], turnKey: "", strikes: 0 });
  if (u.round !== combat.round) { u.round = combat.round; u.roundUsed = []; }
  const f = effectiveFrequency(item.system);
  if (f === "turn") {
    const k = `${combat.round}:${combat.turn}`;
    if (u.turnUsedKey !== k) { u.turnUsedKey = k; u.turnUsed = []; }
    if (!u.turnUsed.includes(item.id)) u.turnUsed.push(item.id);
  }
  if (f === "round") (u.roundAt ??= {})[item.id] = [combat.round, combat.turn];
  if (f === "encounter" && !(u.encounter ??= []).includes(item.id)) u.encounter.push(item.id);
  if (f === "atwill") {
    const k = `${combat.round}:${combat.turn}`;
    const counts = u.atwillKey === k ? Object.fromEntries(u.atwillList ?? []) : {};
    u.atwillKey = k;
    counts[item.id] = (counts[item.id] ?? 0) + 1;
    u.atwillList = Object.entries(counts);
    delete u.atwill;
  }
  if (item.system.traits.has("strike")) {
    const key = `${combat.round}:${combat.turn}`;
    if (u.turnKey !== key) { u.turnKey = key; u.strikes = 0; }
    u.strikes += 1;
  }
  await actor.setFlag(F, "usage", u);
}

/** Open actor sheets redraw when the round or the turn changes. */
export function registerUsageHooks() {
  const refresh = () => { for (const app of foundry.applications.instances.values()) if (app.document?.documentName === "Actor") app.render(); };
  Hooks.on("updateCombat", (c, changes) => { if ("round" in changes || "turn" in changes) refresh(); });
  Hooks.on("deleteCombat", refresh);
}
