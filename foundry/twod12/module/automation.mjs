// General automation (v0.0.186, pack C-a): what an Effect's or a passive's settings can say beyond "boons, damage, Defense".
// Lucas's rule: a card is automated with settings anyone can see and edit on the item, never with code that tests its name.
//   Once per round: a Boons and Banes or a Bonus Damage setting counts only for the first matching Action of each turn-cycle
//     (from the start of the creature's turn to the start of its next one; for "against this creature", the turn-cycle of the creature that has it).
//   Only against my marked target: the creature an Action with "Marks the target" marked (Mark Quarry). The mark is the actor flag twod12.quarry.
//   Ignore a Bane: a Bane rule that matching Actions don't take (one range Bane less; the Engaged Banes).
//   Rally Points: each Rally Point heals more, for the creature and its allies within N squares.
import { allEffects } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
import { matches } from "./effects.mjs";
import { turnCycleBlocked } from "./usage.mjs";
const F = "twod12";

/* ------------------------------------------------------------------ once per round */
const ownIndex = (c, actor) => c.turns.findIndex(x => x.actor === actor || (actor?.isToken && x.tokenId === actor.token?.id));
/** The key a setting's use is remembered under: the effect (or passive) id, the kind (m: modifier, b: bonus) and its index. */
export const onceKey = (e, kind, i) => `${String(e.id).replace(/\./g, "_")}~${kind}${i}`;
/** Was this setting already used in the creature's current turn-cycle? (Out of combat: never.) */
export function onceBlocked(actor, key) {
  const c = globalThis.game?.combat;
  if (!c?.started || !actor) return false;
  const at = (actor.getFlag?.(F, "fxOnce") ?? {})[key];
  return turnCycleBlocked(c.round, c.turn, ownIndex(c, actor), at);
}
/** Remember that these settings were used now (only in combat; only an owner can write it). */
export async function markOnce(actor, keys) {
  const c = globalThis.game?.combat;
  const list = [...new Set(keys ?? [])];
  if (!c?.started || !actor || !list.length) return;
  if (!actor.isOwner) return game.socket?.emit("system.twod12", { type: "markOnce", actorUuid: actor.uuid, keys: list });   // the GM writes it (damage.mjs)
  const now = foundry.utils.deepClone(actor.getFlag(F, "fxOnce") ?? {});
  for (const k of list) now[k] = [c.round, c.turn];
  await actor.setFlag(F, "fxOnce", now);
}

/* ------------------------------------------------------------------ the marked target */
export const markOf = actor => actor?.getFlag?.(F, "quarry") ?? null;
const tokenUuids = a => new Set([...(a?.isToken && a.token ? [a.token.uuid] : []), ...(a?.getActiveTokens?.() ?? []).map(t => t.document?.uuid)].filter(Boolean));
/** Is this creature (an actor, or a token) the one `actor` marked? */
export function isMarked(actor, target) {
  const m = markOf(actor);
  if (!m || !target) return false;
  if (target.document?.uuid || target.documentName === "Token") return m.uuid === (target.document?.uuid ?? target.uuid);
  return tokenUuids(target).has(m.uuid);
}
/** Does this creature have something that reads its mark (a setting "only against my marked target", or an Action that marks)? */
export function usesMark(actor) {
  if ((actor?.itemTypes?.action ?? []).some(i => i.system?.marksTarget)) return true;
  return allEffects(actor).some(e => [...(e.getFlag(F, "modifiers") ?? []), ...(e.getFlag(F, "bonuses") ?? [])].some(m => m.vsMarked));
}

/* ------------------------------------------------------------------ Ignore a Bane */
/** The names of what lets this creature ignore a Bane rule for an Action with these traits ([] when nothing does). */
export function ignoredBy(actor, rule, traits) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    if ((e.getFlag(F, "ignores") ?? []).some(x => x.rule === rule && matches(x, traits))) out.push(String(e.name ?? "").replace(/^\s*Effect:\s*/i, ""));
  }
  return out;
}

/* ------------------------------------------------------------------ Rally Points */
/** A number from a formula with the creature's Modifiers: "power + 2", "signature", "ceil(level/2)". null when it can't be read. */
export function evalStat(formula, actor) {
  const s = actor?.system ?? {};
  const vars = { power: s.powerMod, weapon: s.weaponMod, signature: s.signatureMod, body: s.attributes?.body, mind: s.attributes?.mind, appeal: s.attributes?.appeal, instinct: s.attributes?.instinct, level: s.level };
  const src = String(formula ?? "").toLowerCase().replace(/\s+/g, "").replace(/modifier/g, "").replace(/\[mod\]/g, "signature");
  if (!src) return null;
  const expr = src.replace(/\b(power|weapon|signature|body|mind|appeal|instinct|level)\b/g, (k) => `(${Number(vars[k]) || 0})`).replace(/\b(floor|ceil|round|min|max|abs)\(/g, "Math.$1(");
  if (!/^[0-9+\-*/().,Mathfloorceilroundminxabs]+$/.test(expr)) return null;
  try { const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? Math.trunc(v) : null; } catch (e) { return null; }
}

/**
 * The extra healing each Rally Point of `actor` gets: the highest of its own Rally settings and those of allies (same disposition) within their range.
 * near(source, actor) says whether the source's creature is within N squares. Returns { name, source, bonus } or null.
 */
export async function rallyBonusFor(actor) {
  let near = () => false, mine = null;
  if (typeof canvas !== "undefined" && canvas?.ready) {
    const { squaresBetween } = await import("./move.mjs");
    mine = actor.getActiveTokens?.()[0] ?? null;
    near = (t, n) => !!mine && t.document?.disposition === mine.document?.disposition && squaresBetween(t, mine) <= n;
  }
  const holders = [{ a: actor, token: mine, self: true }];
  if (typeof canvas !== "undefined" && canvas?.ready) for (const t of canvas.tokens?.placeables ?? []) if (t.actor && t.actor !== actor) holders.push({ a: t.actor, token: t, self: false });
  let best = null;
  for (const h of holders) for (const e of allEffects(h.a)) {
    if (effectOff(h.a, e)) continue;
    for (const r of e.getFlag(F, "rallies") ?? []) {
      if (!h.self && !(r.range > 0 && near(h.token, r.range))) continue;
      const bonus = evalStat(r.bonus, h.a);
      if (!bonus || bonus <= 0) continue;
      if (!best || bonus > best.bonus) best = { name: h.a.name, source: String(e.name ?? ""), bonus };
    }
  }
  return best;
}

/* ------------------------------------------------------------------ v0.0.187: an Effect each turn */
/**
 * The start of a creature's turn (the active GM): each "Effect each turn" setting of its Features, Talents and effects that works now
 * (its Escalation minimum met) gives it that Effect again, replacing the old copy (Killer's Focus: a Bonus Damage used up by the next
 * [Shot, Strike, Weapon] Action). It ends with the encounter. The player can remove or switch it off like any applied effect.
 */
export async function applyTurnStartEffects(actor) {
  if (!actor) return 0;
  const { createEffect, originInfo } = await import("./effects.mjs");
  let n = 0;
  const given = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const t of e.getFlag(F, "turnStarts") ?? []) {
      const item = await fromUuid(t.fxUuid);
      if (item?.type !== "effect") continue;
      await createEffect(actor, item, { ...originInfo(actor.uuid), escalation: true }, null, { turnStart: true });
      given.push(t.fxUuid);
      n++;
    }
  }
  // v0.0.194: when each was given (the Escalation block reads it: given this turn-cycle and gone = "Used"; still there = "Ready").
  const c = globalThis.game?.combat;
  if (given.length && c?.started && actor.isOwner) {
    const at = foundry.utils.deepClone(actor.getFlag(F, "tsGiven") ?? {});
    for (const u of given) at[tsKey(u)] = [c.round, c.turn];
    await actor.setFlag(F, "tsGiven", at);
  }
  return n;
}
export const tsKey = uuid => String(uuid).replace(/\./g, "_");

/* ------------------------------------------------------------------ v0.0.186, once per world */
/**
 * The cards whose automation was code that tested their name (Font of Mercy, Radiant Zeal, Elusive, Killer's Focus, Long Draw, Steady Nerves,
 * Sharpshooter, Marked Quarry, Hunter's Focus) carry settings now. A copy with no settings (world items and the ones on creatures) gets the
 * compendium's settings, matched by the compendium it came from or by its name. Returns how many items were updated.
 */
export async function giveSettingsV186(items, actors) {
  const NAMES = ["Font of Mercy", "Radiant Zeal", "Elusive", "Killer's Focus", "Long Draw", "Steady Nerves", "Sharpshooter", "Marked Quarry", "Hunter's Focus"];
  const src = new Map();
  for (const key of ["twod12.features", "twod12.effects"]) {
    const pack = globalThis.game?.packs?.get(key);
    if (!pack) continue;
    for (const d of await pack.getDocuments()) if (NAMES.includes(d.name) && (d.system?.settings ?? []).length) src.set(`${d.type}|${d.name}`, d.system.toObject?.().settings ?? foundry.utils.deepClone(d.system.settings));
  }
  let n = 0;
  const fix = async it => {
    const settings = src.get(`${it.type}|${it.name}`);
    if (!settings || (it.system?.settings ?? []).length) return;
    try { await it.update({ "system.settings": settings }); n++; } catch (e) { console.warn("twod12 | settings for", it.name, e); }
  };
  for (const it of items ?? []) await fix(it);
  for (const a of actors ?? []) if (a.isOwner) for (const it of a.items) await fix(it);
  return n;
}

/**
 * v0.0.187, once per world: Killer's Focus and Radiant Zeal give an Effect each turn instead of a once-per-round passive Bonus Damage
 * (a copy whose settings are none or only Bonus Damage gets the compendium's), and Font of Mercy is ticked as an Escalation Passive.
 */
export async function giveSettingsV187(items, actors) {
  const pack = globalThis.game?.packs?.get("twod12.features");
  const src = new Map();
  if (pack) for (const d of await pack.getDocuments()) if (["Killer's Focus", "Radiant Zeal"].includes(d.name) && d.type === "feature") src.set(d.name, d.system.toObject?.().settings ?? foundry.utils.deepClone(d.system.settings));
  let n = 0;
  const fix = async it => {
    if (it.type !== "feature") return;
    const upd = {};
    const st = it.system?.settings ?? [];
    if (src.has(it.name) && st.every(x => x.type === "bonusdamage")) upd["system.settings"] = src.get(it.name);
    if (it.name === "Font of Mercy" && !it.system?.escalationPassive) upd["system.escalationPassive"] = true;
    if (!Object.keys(upd).length) return;
    try { await it.update(upd); n++; } catch (e) { console.warn("twod12 | v0.0.187 settings for", it.name, e); }
  };
  for (const it of items ?? []) await fix(it);
  for (const a of actors ?? []) if (a.isOwner) for (const it of a.items) await fix(it);
  return n;
}
