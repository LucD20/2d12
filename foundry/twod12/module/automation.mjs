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
import { unset, oneAtATime } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
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

/**
 * v0.0.323 (PACK EFFECT-SHEET, "Next one only"): these rules ("effectId|ruleId") were used: each is spent on its effect (greyed in the editor, never offered
 * again), and the effect ends when every rule that can be spent is spent (fxrules.mjs allSpent). Only an owner writes it (else the GM, damage.mjs).
 */
export async function markSpent(actor, keys) {
  const list = [...new Set(keys ?? [])].filter(Boolean);
  if (!actor || !list.length) return;
  if (!actor.isOwner) return game.socket?.emit("system.twod12", { type: "markSpent", actorUuid: actor.uuid, keys: list });
  const byFx = new Map();
  for (const k of list) { const [eid, rid] = String(k).split("|"); if (!byFx.has(eid)) byFx.set(eid, []); byFx.get(eid).push(rid); }
  for (const [eid, rids] of byFx) {
    const e = actor.effects?.get?.(eid);
    if (!e) continue;   // a Feature's passive: nothing to spend
    const spent = [...new Set([...(e.getFlag(F, "spent") ?? []), ...rids])], all = e.getFlag(F, "spendable") ?? [];
    if (all.length && all.every(r => spent.includes(r))) await e.delete();
    else await e.setFlag(F, "spent", spent);
  }
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

/* ------------------------------------------------------------------ Ignore a Bane */
/** The names of what lets this creature ignore a Bane rule for an Action with these traits ([] when nothing does). */
export function ignoredBy(actor, rule, traits) {
  const out = [];
  out.all = false;   // v0.0.323 (PACK EFFECT-SHEET): one of them ignores ALL the range Banes
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    const hits = (e.getFlag(F, "ignores") ?? []).filter(x => x.rule === rule && matches(x, traits));
    if (hits.length) { out.push(String(e.name ?? "").replace(/^\s*Effect:\s*/i, "")); if (hits.some(x => x.rangeAll)) out.all = true; }
  }
  return out;
}

/** v0.0.266 (Lucas, Aim): the names of what lets the creature's matching Actions ignore this cover level ("low", "medium", "high"). */
export function coverIgnored(actor, level, traits, grantEffectId = null) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    // v0.0.270 (Lucas, Aim): an effect that grants a use keeps its other settings for that use: on another roll they don't count
    if ((e.getFlag(F, "grants") ?? []).some(g => g.left > 0) && e.id !== grantEffectId) continue;
    if ((e.getFlag(F, "covers") ?? []).some(x => x.levels?.includes(level) && matches(x, traits))) out.push(String(e.name ?? "").replace(/^\s*Effect:\s*/i, ""));
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
// v0.0.373 (STYLE-2, Lucas saw Aveline with two Radiant Zeal effects): the turn's start and the Escalation reaching a rung can give the same
// Effect at the same moment; each read "none yet" and both created one. They now run one after the other for a creature, so the second sees
// (and replaces, or skips) the first's.
export async function applyTurnStartEffects(actor) { return oneAtATime(actor, () => turnStartEffects(actor)); }
async function turnStartEffects(actor) {
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
/**
 * v0.0.249 (Lucas): a rung Passive's effect comes as soon as the Escalation reaches its rung, not only at the start of the creature's turn:
 * the "Effect each turn" settings whose minimum is met now and whose Effect the creature doesn't carry yet are given (in an encounter only).
 */
export async function applyReachedEffects(actor) { return oneAtATime(actor, () => reachedEffects(actor)); }
async function reachedEffects(actor) {
  if (!actor || !globalThis.game?.combat?.started) return 0;
  const { createEffect, originInfo } = await import("./effects.mjs");
  const has = u => actor.effects.some(x => x.getFlag(F, "effectUuid") === u);
  let n = 0;
  for (const e of allEffects(actor)) {
    const min = Number(e.getFlag?.(F, "minEscalation") ?? e.flags?.[F]?.minEscalation) || 0;
    if (!min || effectOff(actor, e)) continue;
    for (const t of e.getFlag(F, "turnStarts") ?? []) {
      if (has(t.fxUuid)) continue;
      const item = await fromUuid(t.fxUuid);
      if (item?.type !== "effect") continue;
      await createEffect(actor, item, { ...originInfo(actor.uuid), escalation: true }, null, { turnStart: true });
      n++;
    }
  }
  return n;
}
export const tsKey = uuid => String(uuid).replace(/\./g, "_");
/** v0.0.323 (PACK EFFECT-SHEET): "Grants: an Effect, at the start of each encounter": given when the encounter starts (the active GM). */
export async function applyEncounterStartEffects(actor) {
  if (!actor) return 0;
  const { createEffect, originInfo } = await import("./effects.mjs");
  let n = 0;
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const t of e.getFlag(F, "encStarts") ?? []) {
      const item = await fromUuid(t.fxUuid);
      if (item?.type !== "effect") continue;
      await createEffect(actor, item, originInfo(actor.uuid));
      n++;
    }
  }
  return n;
}
/** v0.0.426 (the audit; book, Chapter 8: "a condition written with no duration lasts until the end of the encounter"; Lingering: "the end of the
 *  encounter does [end it]"): an applied condition (a status from a condition item) with no duration, no Save to end it and no parent effect. The
 *  health states (Dying, Unconscious...) are Foundry's own statuses with no condition item: never. Pure. */
const HEALTH = new Set(["dying", "shattered", "unconscious", "dead", "bloodied", "strained", "desperate"]);
export const endsWithEncounter = e => {
  const d = e?.getFlag?.(F, "duration")?.type;
  if (d === "encounter") return true;
  const st = [...(e?.statuses ?? [])];
  return !d && !!e?.getFlag?.(F, "effectUuid") && st.length > 0 && !st.some(s => HEALTH.has(s)) && !e.getFlag(F, "linkedTo") && !e.getFlag(F, "saveEnd");
};
/** v0.0.323: the effects that last "This encounter" end when it does (v0.0.426: and the conditions with no duration). */
export async function endEncounterEffects(combat) {
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (!a?.isOwner) continue;
    const gone = a.effects.filter(endsWithEncounter).map(e => e.id);
    if (gone.length) await a.deleteEmbeddedDocuments("ActiveEffect", gone);
  }
}

/* ------------------------------------------------------------------ v0.0.207: Chat message */
/**
 * The "Chat message" settings of a creature's Features, Talents and effects that work now, for one moment (TWOD12.messageWhen):
 * [{ source, text, action, ap, to }]. Marked Quarry: "At the start of an encounter" and "When the creature it marked goes Down".
 */
export function messagesFor(actor, when) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const m of e.getFlag(F, "messages") ?? []) if (m.when === when) out.push({ ...m, source: String(e.name ?? "").replace(/^\s*Effect:\s*/i, "") });
  }
  return out;
}
const escHtml = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
/** One message as HTML before the buttons are made: "<b>Name</b>: text" ({name}, {mark} filled in) and a @Use button for the Action it offers. */
export function messageHtml(actor, m, { mark = "", withActor = false } = {}) {   // withActor (v0.0.345): the @Use names its creature
  const text = escHtml(m.text).replace(/\{name\}/g, `<b>${escHtml(actor?.name)}</b>`).replace(/\{mark\}/g, `<b>${escHtml(mark || "?")}</b>`);
  const clean = s => String(s).replace(/[[\]|]/g, " ").trim();
  const btn = m.action ? ` @Use[${clean(m.action)}|ap:${m.ap}|source:${clean(m.source)}${withActor && actor?.uuid ? `|actor:${actor.uuid}` : ""}|label:${clean(m.action)} (${m.ap} AP)]` : "";
  return `<b>${escHtml(actor?.name)}</b>: ${text}${btn}`;
}
/** Post a creature's messages for this moment (the active GM calls it): the system line (sysmsg.mjs), whispered to its owners unless "everyone". */
export async function postMessages(actor, when, opts = {}) {
  const list = actor ? messagesFor(actor, when) : [];
  if (!list.length) return 0;
  const { sysLine } = await import("./sysmsg.mjs");
  const TE = foundry.applications?.ux?.TextEditor?.implementation;
  for (const m of list) {
    const raw = messageHtml(actor, m, opts);
    const html = TE?.enrichHTML ? await TE.enrichHTML(raw) : raw;
    const whisper = m.to === "all" ? [] : game.users.filter(u => actor.testUserPermission?.(u, "OWNER")).map(u => u.id);
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), whisper, content: sysLine("fa-comment-dots", html, "cardmsg"), flags: { [F]: { action: { actorUuid: actor.uuid } } } });
  }
  return list.length;
}

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

/**
 * v0.0.207 (editability sweep), once per world: the last hidden card rules are settings and fields now. On world items and the items of creatures:
 *   a copy of Marked Quarry, Sharpshooter, Bow Mastery or Brawler gets the compendium's new settings it lacks (Chat message, Starting Mastery,
 *   Weapon property; matched by name, the settings it already has are kept);
 *   the old hidden flags become what the Details show: fistsOnly / kick on an Action -> its "Weapon used" (Pummel, Leg Sweep; the Fists Basic
 *   Action too), fistsThreaten / fistsWeapon on a Talent or Feature -> a "Weapon property" setting (Brawler); the flags are removed;
 *   a character's Bow Mastery choice (flag bowMastery) becomes the choice of its first Starting Mastery setting.
 * source: optional Map name -> settings (else read from the system compendium). Returns how many documents were updated.
 */
export async function giveSettingsV207(items, actors, source = null) {
  const NAMES = ["Marked Quarry", "Sharpshooter", "Bow Mastery", "Brawler"], NEW = ["message", "mastery", "weaponprop"];
  let src = source;
  if (!src) {
    src = new Map();
    const pack = globalThis.game?.packs?.get("twod12.features");
    if (pack) for (const d of await pack.getDocuments()) if (NAMES.includes(d.name) && ["feature", "talent"].includes(d.type)) src.set(d.name, (d.system.toObject?.().settings ?? foundry.utils.deepClone(d.system.settings)).filter(x => NEW.includes(x.type)));
  }
  const PROP = { type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening" };
  let n = 0;
  const fix = async it => {
    const upd = {}, fl = it.flags?.twod12 ?? {};
    if (it.type === "action") {
      const use = fl.fistsOnly || fl.basic === "fists" || it.name === "Pummel" ? "fists" : (fl.kick || it.name === "Leg Sweep" ? "kick" : "");
      if (use && !it.system?.weaponUse) upd["system.weaponUse"] = use;
      if ("fistsOnly" in fl) Object.assign(upd, unset("flags.twod12.fistsOnly"));
      if ("kick" in fl) Object.assign(upd, unset("flags.twod12.kick"));
    } else if (["feature", "talent"].includes(it.type)) {
      const have = (it.system?.toObject?.().settings ?? foundry.utils.deepClone(it.system?.settings ?? []));
      const add = (src.get(it.name) ?? []).filter(x => !have.some(h => h.type === x.type && (x.type !== "message" || h.msgWhen === x.msgWhen)));
      if ((fl.fistsThreaten || fl.fistsWeapon) && !have.some(h => h.type === "weaponprop") && !add.some(x => x.type === "weaponprop")) add.push(PROP);
      if (add.length) upd["system.settings"] = [...have, ...foundry.utils.deepClone(add)];
      if ("fistsThreaten" in fl) Object.assign(upd, unset("flags.twod12.fistsThreaten"));
      if ("fistsWeapon" in fl) Object.assign(upd, unset("flags.twod12.fistsWeapon"));
    }
    if (!Object.keys(upd).length) return;
    try { await it.update(upd); n++; } catch (e) { console.warn("twod12 | v0.0.207 settings for", it.name, e); }
  };
  for (const it of items ?? []) await fix(it);
  for (const a of actors ?? []) {
    if (!a.isOwner) continue;
    for (const it of a.items) await fix(it);
    const bow = a.flags?.twod12?.bowMastery;
    if (bow === undefined) continue;
    const { startMasteryOf } = await import("./mastery.mjs");
    const first = startMasteryOf(a)[0];
    const upd = { ...unset("flags.twod12.bowMastery") };
    if (first && bow && !first.chosen) upd[`flags.twod12.startMastery.${first.itemId}`] = bow;
    try { await a.update(upd); n++; } catch (e) { console.warn("twod12 | v0.0.207 Bow Mastery of", a.name, e); }
  }
  return n;
}
