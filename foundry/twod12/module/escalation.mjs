// Escalation (v0.0.243, pack R; book, Chapter 2): a PC's adrenaline, a LEVEL that is never spent; since v0.0.407 (Stage 0 in Foundry) from 1 to 6.
//   1 + the party's Momentum (0 to 4) when an encounter starts; +1 at the start of every round after the first (not while Unconscious: the level is
//   kept); +1 once an encounter on a Critical on one of the creature's Actions, and once an encounter on the class's hook (an "Escalation hook" setting
//   on a Feature: Kindled Wrath, Thrill of the Kill); at most 6 (a Critical or a hook at 6 does nothing and isn't used up). Back to 1 when the encounter
//   ends. The Escalation Passives work while the level is at least theirs; an Action with an Escalation line can be used while the level is at least
//   that and spends nothing. NPCs have none, except an Elite (the NPC sheet's switch: it starts at 1, gains 1 a round like a PC, and 1 more when it
//   becomes Bloodied and when it becomes Strained, once each; no Critical hook; its ladder's three steps at 2, 4 and 6).
// Momentum (v0.0.407; book, Chapter 2, Momentum): the party's number from 0 to 4, a world setting: +1 for each encounter overcome (the GM says so when
//   the encounter ends), -1 when a PC goes Down, -1 at each Sleep (once a night, whoever sleeps), 0 on a retreat and after a Rest; the GM can set it.
import { TWOD12 } from "./config.mjs";
import { escalationStartAt, escalationRaisedTo, momentumAfter, momentumValue, ELITE_RUNGS_LADDER, MOMENTUM_MAX } from "./roundrules.mjs";
import { unset } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
const F = "twod12";
export const ESC_MAX = TWOD12.escalation.max, ESC_MIN = TWOD12.escalation.min;

/** A creature's Escalation (null: it has none, as NPCs). */
export const escalationOf = actor => (actor?.type === "character" || (actor?.type === "npc" && actor.system?.useEscalation) ? Math.max(0, Math.min(ESC_MAX, Number(actor.system?.escalation) || 0)) : null);   // NPCs: only with Escalation switched on

/** Is this applied effect off because its owner's Escalation is under the effect's minimum (or it is disabled)? */
// v0.0.314 (pack AU): an applied effect with the "whileSeen" rule (Frightened) is off while its creature doesn't see the effect's origin;
// the sight check is Foundry's (the map), set by conditions.mjs, so this file stays pure.
let seenGate = null;
export const setSeenGate = fn => { seenGate = typeof fn === "function" ? fn : null; };
/** v0.0.323 (PACK EFFECT-SHEET): one rule's own "While they see the origin": false while the creature doesn't see the effect's origin. */
export function seesOrigin(actor, e) {
  if (!seenGate) return true;
  try { return seenGate(actor, e) !== false; } catch (err) { return true; }
}
/** v0.0.323: a rule "Next one only" that was used: spent (the effect keeps the ids). */
export const isSpent = (e, m) => !!(m?.spend && m.ruleId && (e?.getFlag?.(F, "spent") ?? e?.flags?.[F]?.spent ?? []).includes(m.ruleId));
export function effectOff(actor, e) {
  if (e?.disabled) return true;
  if ((e?.getFlag?.(F, "whileSeen") ?? e?.flags?.[F]?.whileSeen) && seenGate) { try { if (seenGate(actor, e) === false) return true; } catch (err) { /* no map: it works */ } }
  const min = Number(e?.getFlag?.(F, "minEscalation") ?? e?.flags?.[F]?.minEscalation) || 0;
  return min > 0 && (escalationOf(actor) ?? 0) < min;
}

/** Can this creature use an Action that needs this Escalation now? { ok, why }. Nothing is spent: the level is a requirement. */
export function canPayEscalation(actor, cost) {
  const n = Number(cost) || 0;
  if (n <= 0) return { ok: true, why: "" };
  const have = escalationOf(actor);
  if (have === null) return { ok: false, why: `${actor?.name ?? "This creature"} has no Escalation (only PCs and Elites do).` };
  if (have < n) return { ok: false, why: `${actor.name} is at Escalation ${have}; this needs Escalation ${n}.` };
  return { ok: true, why: "" };
}

/** The party's Momentum now, 0 to 4 (an old world's true / false switch reads 1 / 0). */
export const momentumNow = () => { try { return momentumValue(game.settings.get(F, "momentum")); } catch (e) { return 0; } };
/** v0.0.243's name, kept for old callers: does the party have any Momentum? */
export const hasMomentum = () => momentumNow() > 0;
/** Pure: the line a change of Momentum posts ("" when nothing changed). */
export const momentumLineText = (from, to, why = "") => (from === to ? "" : `<b>Momentum</b> ${from} → <b>${to}</b>${why ? `: ${why}` : ""}. The next encounter starts at Escalation <b>${escalationStartAt(to)}</b>.`);
/** Set the party's Momentum (the GM; kept within 0 to 4) and say so in the chat (a system line). Returns the new value. */
export async function setMomentum(n, why = "", { quiet = false } = {}) {
  const from = momentumNow(), to = momentumValue(n);
  if (!game.user?.isGM) return from;
  if (from !== to) { try { await game.settings.set(F, "momentum", to); } catch (e) { return from; } }
  if (!quiet && from !== to) {
    try { const { sysLine } = await import("./sysmsg.mjs"); await ChatMessage.create({ content: sysLine("fa-fire", momentumLineText(from, to, why), "escmsg momline") }); } catch (e) { /* no chat */ }
  }
  return to;
}
/** Something that changes Momentum happened (roundrules.mjs momentumAfter): { overcome, downs, sleeps, retreat, rest }. Only the active GM writes it. */
export async function momentumEvent(ev, why = "") {
  if (!game.user?.isActiveGM) return momentumNow();
  return setMomentum(momentumAfter(momentumNow(), ev), why);
}
/** A player's client asks the active GM's to apply a Momentum event (a Rest, a Sleep). */
export function momentumRequest(ev, why = "") { try { game.socket.emit("system.twod12", { type: "momentum", ev, why, userId: game.user.id }); } catch (e) { /* no socket */ } }
export function registerMomentumSetting() {
  // v0.0.407 (Stage 0 in Foundry): a number from 0 to 4 (it was an on / off switch: an old true reads 1)
  game.settings.register(F, "momentum", { name: "Momentum", hint: "The party's Momentum, 0 to 4 (book, Chapter 2): every PC starts an encounter at Escalation 1 + Momentum. +1 for each encounter overcome, -1 when a PC goes Down and at each Sleep, 0 on a retreat and after a Rest. The combat strip and the HUD show it; the GM can change it there (left-click +1, right-click -1).",
    scope: "world", config: true, type: Number, range: { min: 0, max: MOMENTUM_MAX, step: 1 }, default: 0,
    // v0.0.405 (Lucas: "Momentum isn't showing in the combat strip"): the strip and the HUD redraw when it changes
    onChange: () => { import("./carousel.mjs").then(m => m.renderCarousel?.()).catch(() => null); import("./hud.mjs").then(m => m.renderHud?.()).catch(() => null); } });
  // v0.0.407 (book, Chapter 5, Swapping on a Rest, optional rule): on a Rest a PC may also change its class's Attribute choices and which Health value is Vigor
  game.settings.register(F, "restSwapAttributes", { name: "Swapping on a Rest: Attributes too (optional rule)", hint: "On a Rest a character may also change its class's Attribute choices and which of its two Health values is Vigor (book, Chapter 5).", scope: "world", config: true, type: Boolean, default: false });
  // the last Sleep that took Momentum (world time, seconds): the party's other Sleeps that night take none
  game.settings.register(F, "momentumSleepAt", { scope: "world", config: false, type: Number, default: -1e12 });
}
/** Pure: does a Sleep at this time take Momentum, after one that took it at `last`? (one a night: 12 hours apart; seconds) */
export const sleepTakesMomentum = (now, last) => !Number.isFinite(Number(last)) || Number(now) - Number(last) >= 12 * 3600;
/** A PC completed a Sleep: -1 Momentum, once a night for the party. */
export async function momentumAfterSleep() {
  if (!game.user?.isActiveGM) return momentumNow();
  const t = Number(game.time?.worldTime) || 0;
  let last = -1e12; try { last = game.settings.get(F, "momentumSleepAt"); } catch (e) { /* not registered */ }
  if (!sleepTakesMomentum(t, last)) return momentumNow();
  try { await game.settings.set(F, "momentumSleepAt", t); } catch (e) { /* not registered */ }
  return momentumEvent({ sleeps: 1 }, "the party slept");
}

/** Pure: the level an encounter starts at: 1 + Momentum (v0.0.407: roundrules.mjs escalationStartAt). */
export const startLevel = escalationStartAt;
/** Pure: the level after a raise (a Critical, a hook, the GM's valve): one more, at most 6. */
export const raised = (now, by = 1) => escalationRaisedTo(now, by, ESC_MAX);

/** The round changed: every creature with Escalation in the combat that isn't Unconscious gains 1, from round 2, up to 3 (once per round, by the GM). */
export async function gainForRound(combat) {
  if (!game.user.isActiveGM || !combat?.started || (combat.round ?? 0) < 2) return;
  if ((combat.getFlag?.(F, "escRound") ?? 0) >= combat.round) return;
  await combat.setFlag?.(F, "escRound", combat.round);
  for (const c of combat.combatants ?? []) {
    const a = c.actor;
    if (escalationOf(a) === null || a.statuses?.has?.("unconscious") || c.defeated) continue;
    const now = escalationOf(a);
    if (now < ESC_MAX) {
      await a.update({ "system.escalation": now + 1 });
      // v0.0.314 (pack AU; book: "the players always see an Elite change"): an Elite's new level, and what it does, as a system line
      if (a.type === "npc") try {
        const { sysLine } = await import("./sysmsg.mjs");
        const { esc } = await import("./util.mjs");
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: a }), content: sysLine("fa-fire", `Round ${combat.round}: <b>${esc(c.name)}</b>'s Escalation rises to <b>${now + 1}</b>. Now: ${esc(eliteRung(now + 1))}.`, "escmsg") });
      } catch (e) { console.warn("twod12 | Elite Escalation line", e); }
    }
  }
}

/**
 * A raise outside the rounds: "crit" (a Critical on one of the creature's Actions) or "hook" (its class's hook), each once an encounter; "gm" (the
 * GM's valve) as often as the GM wants. At 3 nothing happens and the once isn't used up. Says so in the chat (sysmsg.mjs). Returns the new level, or null.
 */
/** v0.0.314 (pack AU; book, Bestiary, Elite Escalation): what an Elite's Escalation does (unless its entry says otherwise); v0.0.407: at 2, 4 and 6. */
const [ER1, ER2, ER3] = ELITE_RUNGS_LADDER;
// v0.0.431 (Lucas, 2026-11-18, the book audit Q38): each Elite has its own steps; these are the default ladder's (Pressing, Relentless, Second Wind)
export const ELITE_RUNGS = { [ER1]: "Pressing (1 Boon on its first [Strike] Action each turn-cycle)", [ER2]: "Pressing (1 Boon on its first [Strike] Action each turn-cycle), Relentless (each of its Round Special Actions twice per turn-cycle)", [ER3]: "Pressing (1 Boon on its first [Strike] Action each turn-cycle), Relentless (each of its Round Special Actions twice per turn-cycle), Second Wind (its Encounter Special Actions back, once)" };
/** What an Elite's ladder gives at this level (everything up to it), or "nothing yet" below the first step. */
export const eliteRung = n => { const l = Math.trunc(Number(n)) || 0, at = [...ELITE_RUNGS_LADDER].reverse().find(r => l >= r); return at ? ELITE_RUNGS[at] : `nothing yet (its ladder starts at Escalation ${ER1})`; };
/** Pure: the Elite phases an Elite gains from these state words (["Bloodied", "Strained", "Down"]): "bloodied" and/or "strained". */
export const elitePhases = words => ["Bloodied", "Strained"].filter(w => (words ?? []).includes(w)).map(w => w.toLowerCase());

export async function raiseEscalation(actor, why = "gm", { combat = globalThis.game?.combat ?? null, label = "" } = {}) {
  const now = escalationOf(actor);
  if (now === null) return null;
  if (why === "crit" && actor?.type === "npc") return null;   // v0.0.314 (book, Elite Escalation): an Elite has no Critical hook
  // v0.0.314 (pack AU): an Elite's phases, once each an encounter: it becomes Bloodied, it becomes Strained
  const once = why === "crit" || why === "hook" || why === "bloodied" || why === "strained";
  const used = actor.getFlag?.(F, "escUsed") ?? {};
  if (once && combat?.id && used[why] === combat.id) return null;   // already this encounter
  if (now >= ESC_MAX) return null;   // does nothing and isn't used up
  const to = raised(now, 1);
  const upd = { "system.escalation": to };
  if (once && combat?.id) upd[`flags.${F}.escUsed.${why}`] = combat.id;
  await actor.update(upd);
  try { await Hooks.callAll?.("twod12.escalationChanged", actor); } catch (e) { console.warn("twod12 | the rung's effects", e); }   // v0.0.249: the rung's effects (twod12.mjs listens)
  try {
    const { sysLine } = await import("./sysmsg.mjs");
    const { esc } = await import("./util.mjs");
    const what = why === "crit" ? "A Critical" : why === "hook" ? (label || "The class hook") : (label || "The GM");
    const rung = actor?.type === "npc" ? ` Now: ${esc(eliteRung(to))}.` : "";   // v0.0.314: an Elite's line says what its new level does
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-fire", `${esc(what)}: <b>${esc(actor.name)}</b>'s Escalation rises to <b>${to}</b>${once ? " (once an encounter)" : ""}.${rung}`, "escmsg") });
  } catch (e) { console.warn("twod12 | Escalation line", e); }
  return to;
}

/** The encounter ended: Escalation back to 1, the effects it created end, the Guards end (v0.0.181; the AP Guard too, v0.0.243). */
export async function resetAfterCombat(combat) {
  if (!game.user.isActiveGM) return;
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (!a) continue;
    const g = {};
    if (a.system?.guard > 0) g["system.guard"] = 0;
    if (a.system?.apGuard > 0) g["system.apGuard"] = 0;
    if (Object.keys(g).length) await a.update(g);
    if (escalationOf(a) === null) continue;
    if (escalationOf(a) !== ESC_MIN) await a.update({ "system.escalation": ESC_MIN });
    if (a.getFlag?.(F, "escUsed")) await a.unsetFlag(F, "escUsed");
    const ids = [...(a.effects ?? [])].filter(e => e.getFlag?.(F, "fromEscalation")).map(e => e.id);
    if (ids.length) await a.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}

/** An encounter starts: every PC starts at 1 + Momentum (Momentum stays: v0.0.407), an Elite at 1; the once-an-encounter raises are free again. */
export async function startAtOne(combat, { momentum = momentumNow() } = {}) {
  if (!game.user.isActiveGM) return;
  // v0.0.407 (book, Swapping on a Rest): the swap a Rest allowed ends when an encounter starts
  for (const c of combat?.combatants ?? []) if (c.actor?.getFlag?.(F, "restSwap")) await c.actor.unsetFlag(F, "restSwap");
  const lv = startLevel(momentum);
  for (const c of combat?.combatants ?? []) {
    const a = c.actor;
    if (escalationOf(a) === null) continue;
    const to = a.type === "npc" ? ESC_MIN : lv;   // an Elite has no Momentum
    const upd = {};
    if (escalationOf(a) !== to) upd["system.escalation"] = to;
    if (a.getFlag?.(F, "escUsed")) Object.assign(upd, unset(`flags.${F}.escUsed`));
    if (Object.keys(upd).length) await a.update(upd);
    try { await Hooks.callAll?.("twod12.escalationChanged", a); } catch (e) { console.warn("twod12 | the rung's effects", e); }   // v0.0.249: Radiant Zeal at Escalation 1 from the start (twod12.mjs listens)
  }
  await combat?.setFlag?.(F, "momentumStart", momentumValue(momentum));   // v0.0.289 (PACK SHEET): the strip's Momentum badge; v0.0.407: the number it started with
  if (momentumValue(momentum) > 0) {
    try {
      const { sysLine } = await import("./sysmsg.mjs");
      await ChatMessage.create({ content: sysLine("fa-fire", `<b>Momentum ${momentumValue(momentum)}</b>: the party starts this encounter at Escalation <b>${lv}</b>.`, "escmsg") });
    } catch (e) { /* no chat */ }
  }
}

/**
 * v0.0.407 (book, Momentum): the encounter ended: the GM says how (overcome +1, a retreat loses all of it, or neither: a test, a pause), in the
 * system's pick window. Only for an encounter that started with a PC in it. Returns the choice ("overcome", "retreat", "none") or null.
 */
export async function askEncounterEnd(combat) {
  if (!game.user?.isActiveGM || !combat?.started) return null;
  if (![...(combat.combatants ?? [])].some(c => c.actor?.type === "character")) return null;
  const now = momentumNow();
  const { pickOne } = await import("./pickwindow.mjs");
  const k = await pickOne({ title: "The encounter ends", name: "The encounter ends", sub: `Momentum ${now}`, icon: "fa-fire",
    text: "How did it end for the party? Overcoming it (winning a fight, a negotiation, a sneak, a Challenge) gives +1 Momentum; a retreat loses all of it.",
    options: [{ k: "overcome", l: `Overcome (Momentum ${momentumAfter(now, { overcome: 1 })})`, tip: "+1 Momentum, at most 4" }, { k: "retreat", l: "Retreat (Momentum 0)", tip: "The party loses all its Momentum" }, { k: "none", l: `Neither (Momentum ${now})`, tip: "No change: a test, or the encounter goes on later" }] });
  if (k === "overcome") { await momentumEvent({ overcome: 1 }, "the encounter was overcome"); try { await (await import("./mastery.mjs")).masteryAtEncounterEnd(combat); } catch (e) { console.warn("twod12 | Mastery", e); } }   // v0.0.412: Mastery after a won encounter
  else if (k === "retreat") await momentumEvent({ retreat: true }, "the party retreated");
  return k;
}

/** The GM's valve (a console tool, game.twod12.escalation(delta, actors)): every PC in the combat (or the given creatures) gains delta Escalation (or loses). */
export async function escalationAll(delta = 1, actors = null) {
  const list = actors ?? [...(game.combat?.combatants ?? [])].map(c => c.actor).filter(a => a?.type === "character");
  for (const a of list) {
    if (escalationOf(a) === null) continue;
    if (delta > 0) await raiseEscalation(a, "gm", { label: "The GM's valve" });
    else { const to = raised(escalationOf(a), delta); if (to !== escalationOf(a)) await a.update({ "system.escalation": Math.max(ESC_MIN, to) }); }
  }
}

export function registerEscalationHooks() {
  // v0.0.407: a player's Rest or Sleep (momentumRequest); only these two events are accepted from a player
  Hooks.once("ready", () => { try { game.socket.on("system.twod12", data => {
    if (data?.type !== "momentum" || !game.user?.isActiveGM) return;
    if (data.ev?.rest) momentumEvent({ rest: true }, "the party rested");
    else if (data.ev?.sleeps) momentumAfterSleep();
  }); } catch (e) { /* no socket */ } });
  Hooks.on("combatStart", combat => startAtOne(combat));
  Hooks.on("updateCombat", (combat, changes) => { if ("round" in changes) gainForRound(combat); });
  Hooks.on("deleteCombat", combat => {
    resetAfterCombat(combat); askEncounterEnd(combat).catch(e => console.warn("twod12 | Momentum at the end", e));
    // v0.0.428 (the audit: with the world clock never moved, only the first night's Sleep took Momentum): an encounter ended, so the next Sleep is
    // another night's and takes its −1
    if (game.user?.isActiveGM) game.settings.set(F, "momentumSleepAt", -1e12).catch?.(() => {});
  });
  // v0.0.407 (book, Momentum): -1 each time a PC goes Down (data.mjs atZero is Down). The active GM's client remembers who was Down (whoever made
  // the update: a player's client sends it), so a change from up to Down counts once.
  const wasDown = new Map();
  Hooks.once("ready", () => { for (const a of game.actors ?? []) if (a.type === "character") wasDown.set(a.uuid, !!a.system?.atZero); });
  Hooks.on("updateActor", actor => {
    if (actor?.type !== "character") return;
    const before = wasDown.get(actor.uuid), now = !!actor.system?.atZero;
    wasDown.set(actor.uuid, now);
    if (game.user?.isActiveGM && before === false && now) momentumEvent({ downs: 1 }, `${actor.name} went Down`).catch(e => console.warn("twod12 | Momentum on a Down", e));
  });
}
