import { logEvent, makeLine, nextLog, stamp } from "./ticker.mjs";
import { swapCardHtml, thawLineHtml, sysLine } from "./sysmsg.mjs";
import { unusedApGuard, turnAP } from "./roundrules.mjs";
import { momentumNow, setMomentum } from "./escalation.mjs";
import { sideDisp, lastOrder } from "./initmodel.mjs";   // v0.0.310: the Initiative windows (initwindow.mjs, loaded when used)
import { groupColor } from "./config.mjs";
// Combat: attribute-roll Initiative for everyone, "zipper" turn order between the two sides,
// and an Action Points counter per combatant (shown and editable in the tracker, changes sent to the chat).
import { esc } from "./roll.mjs";
import { TWOD12 } from "./config.mjs";
import { forgetRestored } from "./effects.mjs";
import { unset } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
import { payReaction } from "./sheetmodel.mjs";
import { activeHooks } from "./hooks.mjs";
const F = "twod12";
const warn = m => ui.notifications.warn(m);

// v0.0.243 (pack R; book, Chapter 2): 4 AP a turn and 1 Reaction Point (the combatant flag "rap"), which pays only for Reactions and lasts until the AP
// are regained; losing or gaining AP, Slowed and Quickened touch the 4 only. v0.0.274: the AP a turn left unused become Guard for 1 round when
// the next turn starts (system.apGuard, guard.mjs).
export const AP_PER_TURN = TWOD12.apPerTurn, REACTION_AP = TWOD12.reactionAp;
/** The value of a condition with a value on a creature (Slowed 2, Quickened 1): the highest of its effects, or 0. */
export function conditionValue(actor, id) {
  let v = 0;
  for (const e of actor?.effects ?? []) if (!e.disabled && e.statuses?.has?.(id)) v = Math.max(v, Math.max(1, Math.trunc(Number(e.getFlag?.(F, "value"))) || 1));
  return v;
}
/** Slowed: the highest of the creature's Slowed effects (Desperate, Dying and Shattered add one as a rider: down.mjs), +1 while Imperiled. */
export function slowedOf(actor) {
  let v = conditionValue(actor, "slowed");
  if (actor?.statuses?.has?.("imperiled")) v += 1;
  return v;
}
/** Quickened N raises the most AP the creature can have and what it regains at the start of its turn. */
export const quickenedOf = actor => conditionValue(actor, "quickened");
/** The most AP a creature can have: 4 + Quickened - Slowed (Slowed also lowers the most AP, so Quickened 1 and Slowed 2 make it 3). */
/** A creature's AP a turn before conditions: 4, or its own (a Minion has 3: the Bestiary). The Reaction Point is apart. */
export const baseAP = actor => Number(actor?.system?.apPerTurn) || AP_PER_TURN;
export const apMax = combatant => turnAP(baseAP(combatant?.actor), { quickened: quickenedOf(combatant?.actor), slowed: slowedOf(combatant?.actor) });   // v0.0.365: roundrules.mjs turnAP
/** AP regained at the start of a creature's turn: 4 + Quickened - Slowed (they cancel out without changing each other). */
export const apPerTurn = combatant => {
  const a = combatant?.actor;
  return Math.max(0, baseAP(a) + quickenedOf(a) - slowedOf(a));
};
/** The Reaction Point a creature has (0 or 1): regained with its AP, spent only on Reactions. */
/** v0.0.407 (the Bestiary): a creature's Reaction Point (1; a Minion none: its data's reactionApMax). */
const rapMaxBase = c => { const v = c?.actor?.system?.reactionApMax; return v === undefined || v === null || !Number.isFinite(Number(v)) ? REACTION_AP : Math.max(0, Number(v)); };
// v0.0.409 (pack F2, Tireless Vigil: hooks.mjs rapMore): more Reaction Point while the passive works (the book: only for [Divine] Reactions, by hand)
export const rapMaxOf = c => rapMaxBase(c) + activeHooks(c?.actor, "rapMore").reduce((n, h) => n + Math.max(0, Math.trunc(Number(h.hook.n) || 1)), 0);
export const getRAP = c => Math.max(0, Math.min(rapMaxOf(c), Math.trunc(Number(c?.getFlag(F, "rap"))) || 0));
/** The core rework batch 2 (book, Chapter 4, Strained): the Reaction Point a creature has after regaining AP: its maximum, or, while Strained, only
 *  the one it still has (it doesn't regain it). */
export const rapAtRegain = c => (c?.actor?.system?.strained ? getRAP(c) : rapMaxOf(c));
/** Pure: how a Reaction's cost is paid: the Reaction Point first, then AP (kept from the turn, or the turn's own). { fromRap, fromAp } */
export { payReaction };   // v0.0.297: the one AP rule lives in sheetmodel.mjs (pure), with versionCant
/** The Stage of a combatant's creature (for the Guard an unspent AP gives). */
const stageOfC = c => Math.max(0, Math.min(3, Number(c?.actor?.system?.stage) || 0));   // v0.0.407: Stages 0 to 3

/** Imperiled ends at the start of the creature's turn: it gets back to safety, to a legal square next to the hazard. */
export async function climbUp(c) {
  const a = c?.actor;
  const ids = (a?.effects ?? []).filter(e => e.statuses?.has?.("imperiled")).map(e => e.id);
  if (!ids.length) return;
  await a.deleteEmbeddedDocuments("ActiveEffect", ids);
  await ChatMessage.create({ content: sysLine("fa-person-falling-burst", `<b>${esc(c.name)}</b> gets back to safety. Imperiled ends (they were Slowed 1 for this turn).`) });
}
export const getAP = c => Number(c?.getFlag(F, "ap")) || 0;

export const initRollIds = combat => [...(combat?.combatants ?? [])].filter(c => c.initiative === null || c.initiative === undefined).map(c => c.id);
/** v0.0.310 (Lucas): the Initiative button. The GM opens the Initiative window (who rolls is chosen there); a player rolls their own creatures still to roll. */
export async function rollPendingInitiative(combat) {
  if (!combat) return;
  if (game.user.isGM) { const { openInitiative } = await import("./initwindow.mjs"); return openInitiative(combat); }
  const ids = initRollIds(combat).filter(id => combat.combatants.get(id)?.isOwner);
  if (!ids.length) return ui.notifications.info("Your creatures have rolled their initiative.");
  return combat.rollInitiative(ids);
}
export function combatantOf(actor, combat = game.combat) {
  if (!combat || !actor) return null;
  // A token of an unlinked NPC: its own combatant (several tokens can share one actor id, so the id alone is not enough).
  if (actor.isToken && actor.token) return combat.combatants.find(c => c.tokenId === actor.token.id) ?? null;
  const same = combat.combatants.find(c => c.actor === actor);
  if (same) return same;
  const byId = combat.combatants.filter(c => c.actorId === actor.id);
  return byId.length === 1 ? byId[0] : null;
}


/** Set a combatant's AP and say so in the chat. */
export async function setAP(c, value, why = "", { quiet = false, reaction = false, kind: as = "", rap = null, patch = null } = {}) {   // patch (v0.0.361): more of the combatant's changes, written with the AP in one update
  // Nobody holds more than their most AP (4, or more while Quickened); the GM's own edits in the tracker are not limited.
  const want = Math.max(0, Math.round(Number(value) || 0));
  const from = getAP(c), to = why === "edited" ? want : Math.min(want, Math.max(apMax(c), from));
  if (from === to && why === "edited") return;
  const rapLine = rap ?? { b: getRAP(c), a: getRAP(c) };   // the Reaction Point on the line's pips (v0.0.243)
  // v0.0.200 (Lucas, design M1 + L3): a ticker with the Turn Log instead of "AP 5 → 4 (…)". A movement posts its own line when it ends
  // (move.mjs); an edit in the tracker or the strip posts nothing.
  const start = /^(start of turn|swapped in)/i.test(why);
  const off = !start && game.combat?.combatant?.id !== c.id;   // spent in someone else's turn: a Reaction
  const kind = as || (start ? "start" : (reaction || off ? "react" : "act"));
  const name = start ? "Turn start" : String(why).replace(/^swap with /i, "Swap with ");
  const line = quiet || why === "edited" ? null : makeLine(kind, name, from, to, Math.max(apMax(c), from, to), rapLine);
  // v0.0.361 (PACK PERF, D27): a turn start writes its fresh flags, the AP and the Turn Log in one update (it was three writes, each redrawing the sheets)
  if (patch) {
    const lines = line ? nextLog(c.getFlag?.(F, "turnLog") ?? [], stamp(line)) : null;
    await c.update({ ...patch, [`flags.${F}.ap`]: to, ...(lines ? { [`flags.${F}.turnLog`]: lines } : {}) });
    if (line) await logEvent(c, line, { lines });
    return;
  }
  await c.setFlag(F, "ap", to);
  if (line) await logEvent(c, line);
}

/** The Reaction Point: set it (1 at the start of the turn, 0 when spent) without a line of its own. */
export const setRAP = (c, n) => c.setFlag(F, "rap", Math.max(0, Math.min(rapMaxOf(c), Math.trunc(Number(n)) || 0)));

/**
 * v0.0.274 (Lucas, the book's Unspent AP rewritten): nothing happens when a turn ends with AP left (they can still pay Reactions). When the
 * creature regains AP at the start of its next turn, each AP it didn't use is Guard 2 / 3 / 4 by Stage for 1 round (until it regains AP again):
 * it adds to the other Guard and is taken first. A creature's first turn of the encounter has no unused AP. Pure: { unused, guard }.
 */
export { unusedApGuard };   // v0.0.365 (SIM-1): the rule itself is in roundrules.mjs (pure, shared with the automated playtest environment)
/** The start of a turn: the Guard of the AP the last turn left unused replaces the one before (1 round); the Turn Breakdown shows it. */
export async function setUnusedApGuard(c, hadTurn, apLeft) {
  const a = c?.actor;
  if (!a) return 0;
  // v0.0.435 (the Bestiary audit, question 3): an NPC gains no Guard from unspent AP (an AP it keeps only pays a Reaction)
  const { guard } = a.type === "npc" ? { guard: 0 } : unusedApGuard(hadTurn, apLeft, stageOfC(c));
  if ((Number(a.system?.apGuard) || 0) !== guard) await a.update({ "system.apGuard": guard });
  // v0.0.362 (Lucas): no chat line: the Turn Breakdown dock shows "Kaela: Guard 8 (unused AP)" (turndock.mjs), and the End of Turn line keeps it
  return guard;
}

/** v0.0.414: the Advance under way: { left: its squares left (an Advance Action's button or a drag), own: it is the Advance Action used on its own, interacted: its one Interact is used }. */
export const advState = c => ({ left: (Number(c?.getFlag?.(F, "freeMove")) || 0) + (Number(c?.getFlag?.(F, "moveLeft")) || 0), own: !!c?.getFlag?.(F, "advOwn"), interacted: !!c?.getFlag?.(F, "advInteract") });
/**
 * Pure (v0.0.414; book, Chapter 3, Advance): what an Action does to the Advance under way. kind: the Basic Action's key ("advance", "interact", or
 * "" for any other). Returns the flags to set (null: nothing). The Advance Action starts a new one (own); one Interact fits inside the Advance Action
 * used on its own, once; anything else ends it (its squares left are lost).
 */
export function advanceAfterAction(st, kind = "") {
  if (kind === "advance") return { freeMove: 0, moveLeft: 0, advOwn: true, advInteract: false };
  if (!(st?.left > 0)) return st?.own || st?.interacted ? { advOwn: false, advInteract: false } : null;
  if (kind === "interact" && st.own && !st.interacted) return { advInteract: true };
  return { freeMove: 0, moveLeft: 0, advOwn: false, advInteract: false };
}

/** Pay the AP of an action. Returns false when the player decides not to go ahead. Does nothing outside combat. */
export async function spendAP(actor, cost, label = "", { quiet = false, reaction = false, force = false, kind = "" } = {}) {   // force (v0.0.293): no "Not enough AP" question (the roll dialog warned); kind (v0.0.414): the Basic Action's key
  const c = combatantOf(actor);
  if (!c || !game.combat?.started) return true;
  // v0.0.243 (book, Reactions): a Reaction is paid with the Reaction Point first, then with AP (kept from the turn, or the turn's own on its own turn).
  const have = getAP(c), rap = reaction ? getRAP(c) : 0, pay = payReaction(cost, have, rap);
  if (c.getFlag(F, "frozen") && pay.fromAp > 0) {
    const ok = await (await import("./pickwindow.mjs")).pickConfirm({ title: "Frozen", name: "Frozen", sub: label, icon: "fa-snowflake", tone: "warn", confirm: "Use it anyway", text: `<b>${esc(c.name)}</b> swapped initiative, so its remaining actions are frozen until its turn.` });   // v0.0.415 (pack CL): was a DialogV2
    if (!ok) return false;
  }
  if (have < pay.fromAp && !force) {
    const ok = await (await import("./pickwindow.mjs")).pickConfirm({ title: "Not enough AP", name: "Not enough AP", sub: label, icon: "fa-bolt", tone: "warn", confirm: "Use it anyway", text: `<b>${esc(c.name)}</b> has ${have} AP${reaction ? ` and ${rap} Reaction Point` : ""} and ${esc(label)} costs ${cost}${reaction ? "R" : ""}.` });   // v0.0.415 (pack CL): was a DialogV2
    if (!ok) return false;
  }
  await c.setFlag(F, "acted", true);
  // v0.0.414 (book, Chapter 3, "An Advance is one piece"): another Action ends an Advance under way (its movement left is lost), except one Interact
  // during the Advance Action used on its own (advanceAfterAction); a Reaction off your turn leaves it alone.
  const evading = Number(c.getFlag(F, "evadeMove")) > 0, upd = !reaction ? advanceAfterAction(advState(c), kind) : null;
  const goesOn = !!upd?.advInteract && !("freeMove" in upd);   // the one Interact inside the Advance: its movement (and its line) go on
  // v0.0.200: a movement still under way is written to the Turn Log before this Action (its line comes first). v0.0.428 (the audit: the line read
  // "Advance 5 sq." after 2): written before its squares left are cleared, so it counts only the squares moved
  if (!goesOn) { try { const { closeMoveLine } = await import("./move.mjs"); await closeMoveLine(c); } catch (e) { /* none */ } }
  if (evading) await c.update({ [`flags.${F}.evadeMove`]: 0, ...unset(`flags.${F}.ignoreTerrain`) });   // v0.0.182: an Evade left unused ends when another Action is used
  if (upd) await c.update(Object.fromEntries(Object.entries(upd).map(([k, v]) => [`flags.${F}.${k}`, v])));
  if (pay.fromRap) await setRAP(c, rap - pay.fromRap);
  // v0.0.274: a kept AP that pays a Reaction is simply one AP less at the start of the next turn (its Guard comes then: setUnusedApGuard)
  await setAP(c, Math.max(0, have - pay.fromAp), label, { quiet, reaction, rap: reaction ? { b: rap, a: rap - pay.fromRap } : null });
  return true;
}

/* ---- Zipper order ---- */
/** Creatures are grouped by token disposition (Friendly, Neutral, Hostile): usually the PCs against one group of enemies, but a three-way fight works too.
 *  v0.0.310 (Lucas, the Initiative window): a side the GM chose in the window (the combatant flag twod12.init.side: a Fourth side too) comes first,
 *  and Secret counts as Hostile (it was a side of its own), so the order matches the window's sides. */
const sideOf = c => {
  const own = c.getFlag?.(F, "init")?.side;
  if (own) return sideDisp(own);
  const d = c.token?.disposition;
  if (d !== undefined && d !== null) return d < -1 ? -1 : d;
  return c.actor?.type === "character" ? 1 : -1;
};

/**
 * list is sorted by initiative (highest first). Each group keeps that order. Groups take turns, one creature at a time,
 * in the order of their highest result (a tie goes to the higher disposition: Friendly first). A group with no creatures left is skipped.
 * A Minions' squad takes one turn of its side: its members one after another (v0.0.433).
 */
export function zipper(list) {
  // v0.0.433 (the Bestiary audit; book, Bestiary: "Up to 3 Minions can act in the same turn slot, one after another"): a Minions' squad (the members
  // whose init.squad names their leader, on its side, with its Initiative) is one entry of its side: its members go one after another.
  const squadOf = c => c.getFlag?.(F, "init")?.squad ?? c.flags?.[F]?.init?.squad ?? "";
  const leaderOf = new Map();
  for (const c of list) { const s = squadOf(c), l = s && s !== c.id ? list.find(x => x.id === s) : null; if (l && sideOf(l) === sideOf(c) && l.initiative === c.initiative) leaderOf.set(c.id, l.id); }
  const groups = new Map();
  for (const c of list) {
    if (leaderOf.has(c.id)) continue;
    const k = sideOf(c); if (!groups.has(k)) groups.set(k, []);
    // v0.0.440 (Lucas: "The GM decides the order each minion goes"): a squad in the order the GM picked (init.sqOrder), else the leader first
    const sq = [c, ...(c.id ? list.filter(x => x !== c && leaderOf.has(x.id) && leaderOf.get(x.id) === c.id) : [])], ord = (x, i) => { const v = Number((x.getFlag?.(F, "init") ?? x.flags?.[F]?.init)?.sqOrder); return Number.isFinite(v) ? v : i; };
    groups.get(k).push(sq.length > 1 ? sq.map((x, i) => [x, ord(x, i)]).sort((a, b) => a[1] - b[1]).map(e => e[0]) : sq);
  }
  const tieAttr = c => Number(c.getFlag?.(F, "initAttr")) || 0;
  const order = [...groups.entries()].sort((a, b) => ((b[1][0][0].initiative ?? -Infinity) - (a[1][0][0].initiative ?? -Infinity)) || (tieAttr(b[1][0][0]) - tieAttr(a[1][0][0])) || (b[0] - a[0])).map(e => e[1]);
  const out = [];
  while (order.some(g => g.length)) for (const g of order) if (g.length) out.push(...g.shift());
  return out;
}

/** Pure (v0.0.440): the squad a combatant is in (its leader's id; "" for none): its init.squad, or the leader that others name. */
export function squadKeyOf(c, turns) {
  const flag = x => x?.getFlag?.(F, "init") ?? x?.flags?.[F]?.init ?? {};
  const s = flag(c).squad;
  if (s && (turns ?? []).some(x => x.id === s)) return s;
  return c?.id && (turns ?? []).some(x => x !== c && flag(x).squad === c.id) ? c.id : "";
}
/** Pure (v0.0.440): the members of the squad at turns[i] still to act, from i on (the run of that squad); [] when turns[i] is in none. */
export function squadRun(turns, i) {
  const k = turns?.[i] ? squadKeyOf(turns[i], turns) : "";
  if (!k) return [];
  const out = [];
  for (let j = i; j < turns.length && squadKeyOf(turns[j], turns) === k; j++) out.push(turns[j]);
  return out;
}
/** Pure (v0.0.440): the squad's new order (its members' ids) when `pick` goes next at turns[i]: those already gone, the pick, the rest. */
export function squadOrderAfter(turns, i, pick) {
  const run = squadRun(turns, i), k = run.length ? squadKeyOf(run[0], turns) : "";
  if (!k) return [];
  const before = turns.slice(0, i).filter(x => squadKeyOf(x, turns) === k).map(x => x.id);
  return [...before, pick, ...run.map(x => x.id).filter(id => id !== pick)];
}

// v0.0.244: the Initiative window (initwindow.mjs) replaced the dialog; it answers the same { attr, per, boons, banes, favored, doomed }.
export class TwoD12Combat extends Combat {
  /** An encounter can't end while a creature is Dying or Shattered: every creature must be unharmed, stabilized or dead. */
  async endCombat() {
    const down = this.combatants.filter(x => x.actor?.statuses?.has("dying") || x.actor?.statuses?.has("shattered")).map(x => x.name);
    if (down.length) {
      const ok = await (await import("./pickwindow.mjs")).pickConfirm({ title: "End the encounter?", name: "End the encounter?", icon: "fa-flag-checkered", tone: "warn", confirm: "End it anyway", text: `The encounter can't end while a creature is Dying or Shattered: <b>${down.map(esc).join(", ")}</b>. Every creature must be unharmed, stabilized or dead.` });   // v0.0.415 (pack CL): was a DialogV2
      if (!ok) return this;
    }
    return super.endCombat();
  }

  /**
   * v0.0.440 (Lucas, the checklist: "The GM decides the order each minion goes ... when ending the turn, you get to select who of the next two left
   * is next"): before a turn goes to a Minions' squad with two or more still to act (at the start of the combat and of each round too), the GM picks
   * on the bottom bar which of them goes now; the others follow, and the next pick comes at the end of that turn.
   */
  async _squadPick(i) {
    if (!game.user?.isGM) return;
    const run = squadRun(this.turns ?? [], i);
    if (run.length < 2) return;
    const { pickBar } = await import("./pickbar.mjs");
    // v0.0.454 (Lucas, playtest 6, D5 "Proposed A"): the token pictures, each with its number; the name on a hover
    const kinds = new Set(run.map(c => c.name.replace(/\s*\d+$/, "")));
    const pick = await pickBar({ icon: "fa-people-group", cls: "squadpick", text: `<b>${esc(kinds.size === 1 ? [...kinds][0] : "Minions")}</b> <span class="lb-tag">${run.length} of the squad left</span><span class="lb-q">Which one goes now?</span>`,
      options: run.map(c => ({ id: c.id, label: c.name, token: c.token?.object ?? null, img: c.token?.texture?.src || c.img || c.actor?.img || "icons/svg/mystery-man.svg", num: /(\d+)\s*$/.exec(c.name)?.[1] ?? "" })) });
    if (!pick || pick === run[0].id) return;
    const order = squadOrderAfter(this.turns, i, pick);
    await this.updateEmbeddedDocuments("Combatant", order.map((id, k) => ({ _id: id, [`flags.${F}.init.sqOrder`]: k })));
  }
  async startCombat() {
    try { await this._squadPick(0); } catch (e) { console.warn("twod12 | the squad's order", e); }
    return super.startCombat();
  }
  async nextTurn() {
    try { if (this.started) await this._squadPick((this.turn ?? -1) + 1 < (this.turns?.length ?? 0) ? (this.turn ?? -1) + 1 : 0); } catch (e) { console.warn("twod12 | the squad's order", e); }
    return super.nextTurn();
  }

  setupTurns() {
    const tieAttr = c => Number(c.getFlag?.(F, "initAttr")) || 0;
    const all = [...super.setupTurns()].sort((a, b) => ((b.initiative ?? -Infinity) - (a.initiative ?? -Infinity)) || (tieAttr(b) - tieAttr(a)) || (sideOf(b) - sideOf(a)));
    // v0.0.310 (Lucas): a creature that goes last (Dying or Shattered before the encounter) doesn't roll and is placed after everyone,
    // several of them by the tie rule (the higher Attribute Modifier for the called Check, then Friendly)
    const isLast = c => !!c.getFlag?.(F, "init")?.last;
    const call = { attr: this.getFlag?.(F, "initCall")?.attr || "instinct" };
    const lastC = all.filter(isLast), base = all.filter(c => !isLast(c));
    const lastIds = lastOrder(lastC.map(c => ({ id: c.id, mods: c.actor?.system?.attributes ?? {}, set: c.getFlag?.(F, "init") ?? {}, disp: sideOf(c) })), call).map(x => x.id);
    const ordered = [...zipper([...base]), ...lastIds.map(id => lastC.find(c => c.id === id))];
    this.turns = ordered;
    const c = ordered[this.turn];
    if (this.current) { this.current.combatantId = c?.id ?? null; this.current.tokenId = c?.tokenId ?? null; }
    return ordered;
  }

  /**
   * v0.0.310 (Lucas): the GM's roll opens the Initiative window (initwindow.mjs: who rolls, each creature's Check, Favored, Doomed, Boons and
   * Banes); a player's roll (portrait, tracker, sheet) rolls their own creatures at once with the GM's settings and their own effects.
   * options.direct: roll these now, without the window (the GM too).
   */
  async rollInitiative(ids, options = {}) {
    ids = typeof ids === "string" ? [ids] : [...ids];
    const W = await import("./initwindow.mjs");
    if (game.user.isGM && !options.direct) { await W.openInitiative(this); return this; }
    if (game.user.isGM) await W.rollCreatures(this, ids, "GM");
    else await W.playerRoll(this, ids);
    return this;
  }
}

/** Give the creature whose turn it is its AP (once per turn). GM only. */
async function startTurn(combat) {
  if (!game.user.isActiveGM) return;
  const c = combat.combatant;
  if (!c) return;
  const key = `${combat.round}:${c.id}`;
  // v0.0.204: a creature that swapped had its turn start this round already; its new slot is a new start (it thaws), so frozen skips this check.
  if (c.getFlag(F, "apTurn") === key && !c.getFlag(F, "frozen")) return;
  const hadTurn = !!c.getFlag(F, "apTurn"), apLeft = getAP(c);   // v0.0.274: the AP its last turn left unused (none on its first turn)
  const fresh = { [`flags.${F}.apTurn`]: key, [`flags.${F}.acted`]: false, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, ...unset(`flags.${F}.ignoreTerrain`) };
  if (c.getFlag(F, "frozen")) {
    // It swapped initiative earlier: it carries on with the AP it had left.
    await c.update({ ...fresh, [`flags.${F}.frozen`]: false, [`flags.${F}.thawed`]: key });   // v0.0.205: a thawed turn can't swap again
    await ChatMessage.create({ content: thawLineHtml(c.name, getAP(c)) });
  } else {
    // v0.0.243: the Reaction Point comes back with the AP; v0.0.361 (PACK PERF): one update for the fresh flags, the AP and the Turn Log
    const rapNow = rapAtRegain(c);   // the core rework batch 2: Strained regains no Reaction Point
    await setAP(c, apPerTurn(c), "start of turn", { rap: { b: 0, a: rapNow }, patch: { ...fresh, [`flags.${F}.rap`]: rapNow } });
    await setUnusedApGuard(c, hadTurn, apLeft);   // v0.0.274: its unused AP are Guard for 1 round (the one before ends)
    try { const { dazeAtTurnStart } = await import("./conditions.mjs"); await dazeAtTurnStart(c); } catch (e) { console.warn("twod12 | Dazed", e); }   // v0.0.314: the rest of a Dazed
    await climbUp(c);
    // v0.0.187: the Effects its Features give at the start of each turn (Killer's Focus, Radiant Zeal); not when it carries on after a swap.
    try { const { applyTurnStartEffects } = await import("./automation.mjs"); await applyTurnStartEffects(c.actor); } catch (e) { console.warn("twod12 | Effect each turn", e); }
    // v0.0.207: its "At the start of each of its turns" Chat message settings.
    try { const { postMessages } = await import("./automation.mjs"); await postMessages(c.actor, "turn"); } catch (e) { console.warn("twod12 | turn messages", e); }
    // v0.0.261 (Consecrated Ground): the heals of the Zones it stands in; the lit Half of a Covering Shot ends with its new turn
    try { const { healAtTurnStart } = await import("./areafx.mjs"); await healAtTurnStart(c); } catch (e) { console.warn("twod12 | area heals", e); }   // v0.0.327 (PACK ZONE): Zones and Auras, each row's Who
    try { const { clearHalfHint } = await import("./halfhint.mjs"); if (c.actor) await clearHalfHint(c.actor.uuid); } catch (e) { /* no hint */ }
  }
  await takeSnapshot(combat);
}

/* ---- Reset Turn: the state is saved when a turn begins ----
 * v0.0.361 (PACK PERF, D29; Lucas: yes): the snapshot stays in the memory of the GM's client that started the turn (it was a Combat flag sent
 * to every client at each turn start, with every token and Region). A reload, or another GM, has none for the current turn: Reset Turn says so. */
const SNAPS = new Map();   // combat id -> the snapshot of its current turn
/** The saved state of the combat's current turn on this client, or null. */
export const turnSnapshot = combat => SNAPS.get(combat?.id ?? "") ?? null;
const FLAG_DEFAULTS = { ap: 0, rap: 0, frozen: false, acted: false, apTurn: "", moveLeft: 0, freeMove: 0, evadeMove: 0 };
const clone = o => foundry.utils.deepClone(o);

export async function takeSnapshot(combat) {
  const actors = new Map();
  for (const x of combat.combatants) if (x.actor?.uuid) actors.set(x.actor.uuid, x.actor);
  const scene = canvas.scene;
  const snap = {
    round: combat.round, turn: combat.turn, who: combat.combatant?.name ?? "",
    combatants: [...combat.combatants].map(x => ({ id: x.id, initiative: x.initiative, flags: clone(x.flags?.[F] ?? {}) })),
    actors: [...actors].map(([uuid, a]) => ({ uuid, damage: clone(a.system?.damage ?? {}), bodyWounds: a.system?.bodyWounds ?? 0, mindWounds: a.system?.mindWounds ?? 0, guard: a.system?.guard ?? 0, apGuard: a.system?.apGuard ?? 0, escalation: a.system?.escalation ?? 0, effects: [...(a.effects ?? [])].map(e => e.toObject()) })),
    tokens: [...(scene?.tokens ?? [])].map(t => ({ _id: t.id, x: t.x, y: t.y, elevation: t.elevation ?? 0, light: t.light?.toObject?.() ?? null })),
    regions: [...(scene?.regions ?? [])].map(r => r.toObject())
  };
  SNAPS.clear();   // one combat runs at a time; an old one's state is never wanted again
  SNAPS.set(combat?.id ?? "", snap);
  // a Combat from before v0.0.361 still holds its old snapshot flag: removed once, the next time a turn starts
  if (combat?.flags?.[F]?.snapshot !== undefined && typeof combat.update === "function") { try { await combat.update(unset(`flags.${F}.snapshot`)); } catch (e) { /* stays */ } }
}

/** GM: put everything back as it was when the current turn began. */
export async function resetTurn(combat, { confirm = null } = {}) {   // confirm (v0.0.361): the question, for the tests
  const snap = turnSnapshot(combat);
  if (!snap) return warn("No saved state for this turn: it is kept on the GM's client that started the turn, until a reload.");
  if (snap.round !== combat.round || snap.turn !== combat.turn) return warn(`The saved state is from round ${snap.round}, turn ${snap.turn + 1}. Reset only works during that turn.`);
  // v0.0.361: the confirmation in the pick window's style (no Foundry default windows)
  const ask = confirm ?? (await import("./pickwindow.mjs")).pickConfirm;
  const ok = await ask({ title: "Reset Turn", name: "Reset Turn", sub: `Round ${snap.round}, ${snap.who}`, icon: "fa-rotate-left", confirm: "Reset",
    text: `<p>Put everything back as it was when <b>${esc(snap.who)}</b>'s turn began: damage, effects, token positions, areas, AP and movement.</p>` });
  if (!ok) return;
  try { const { voidTurn } = await import("./enclog.mjs"); voidTurn(combat, snap.round, snap.turn, "Reset Turn"); } catch (e) { /* no log */ }   // v0.0.223: the Encounter Log
  const scene = canvas.scene;
  for (const a of snap.actors) {
    const actor = await fromUuid(a.uuid);
    if (!actor) continue;
    await actor.update({ "system.damage": a.damage, "system.bodyWounds": a.bodyWounds ?? 0, "system.mindWounds": a.mindWounds ?? 0, ...(a.guard !== undefined ? { "system.guard": a.guard, "system.apGuard": a.apGuard ?? 0, "system.escalation": a.escalation ?? 0 } : {}) }, { twod12Reset: true });   // the Encounter Log ignores it
    const have = [...actor.effects].map(e => e.id);
    if (have.length) await actor.deleteEmbeddedDocuments("ActiveEffect", have);
    for (const e of a.effects) forgetRestored(e._id);
    if (a.effects.length) await actor.createEmbeddedDocuments("ActiveEffect", a.effects, { keepId: true, twod12Reset: true });
  }
  if (scene) {
    await scene.updateEmbeddedDocuments("Token", snap.tokens.filter(t => scene.tokens.get(t._id)).map(t => ({ ...t })), { twod12Forced: true, animate: true });
    const keep = new Set(snap.regions.map(r => r._id));
    const extra = [...scene.regions].filter(r => !keep.has(r.id)).map(r => r.id);
    if (extra.length) await scene.deleteEmbeddedDocuments("Region", extra);
    const missing = snap.regions.filter(r => !scene.regions.get(r._id));
    if (missing.length) await scene.createEmbeddedDocuments("Region", missing, { keepId: true });
    const flagUpdates = snap.regions.filter(r => scene.regions.get(r._id)).map(r => ({ _id: r._id, flags: r.flags }));
    if (flagUpdates.length) await scene.updateEmbeddedDocuments("Region", flagUpdates);
  }
  await combat.updateEmbeddedDocuments("Combatant", snap.combatants.map(x => ({ _id: x.id, initiative: x.initiative, flags: { [F]: { ...FLAG_DEFAULTS, ...x.flags } } })));
  if (combat.turn !== snap.turn) await combat.update({ turn: snap.turn });
  await ChatMessage.create({ content: sysLine("fa-rotate-left", `<b>Turn reset</b>: everything is back to the start of ${esc(snap.who)}'s turn.`) });
}

/** The Initiative button on a sheet: this creature rolls with an Attribute of its choice. */
export async function rollActorInitiative(actor) {
  const combat = game.combat;
  if (!combat) return warn("There is no active combat.");
  let c = combatantOf(actor, combat);
  if (!c) {
    const tok = actor.token ?? actor.getActiveTokens(true, true)[0];
    if (!tok) return warn(`${actor.name} has no token on this scene to add to the combat.`);
    [c] = await combat.createEmbeddedDocuments("Combatant", [{ tokenId: tok.id, sceneId: tok.parent?.id ?? canvas.scene.id, actorId: actor.id, hidden: tok.hidden }]);
  }
  await combat.rollInitiative([c.id]);
}

/* ---- Swapping initiative ---- */

/** Allies who have not had a turn this round: same side, later in the order. */
/** v0.0.205 (Lucas): is this the turn a creature carries on after swapping? (It can't swap again.) */
export const thawedNow = (combat, c) => !!c && c.getFlag?.(F, "thawed") === `${combat?.round}:${c.id}`;

export function swapCandidates(combat, a) {
  const idx = combat.turns.indexOf(a);
  return combat.turns.slice(idx + 1).filter(b => sideOf(b) === sideOf(a) && !b.isDefeated);
}

/** GM side: A (whose turn it is, no actions yet) pays 1 AP and trades places with ally B. B takes the turn now; A is frozen until its new turn. */
export async function performSwap(combat, aId, bId, userId = null) {
  const A = combat.combatants.get(aId), B = combat.combatants.get(bId);
  if (!A || !B || A.id === B.id) return;
  if (userId && !A.testUserPermission(game.users.get(userId), "OWNER")) return;
  if (combat.combatant?.id !== A.id) return warn("It is not that creature's turn.");
  if (thawedNow(combat, A)) return warn(`${A.name} already swapped this round and can't swap again.`);
  if (A.getFlag(F, "acted")) return warn(`${A.name} has already taken an action this turn.`);
  if (!swapCandidates(combat, A).some(b => b.id === B.id)) return warn(`${B.name} cannot be swapped with.`);
  const left = getAP(A);
  if (left < 1) return warn(`${A.name} has no AP left to swap.`);
  let ia = A.initiative ?? 0; const ib = B.initiative ?? 0;
  const aNew = ia === ib ? ib - 0.01 : ib;
  await combat.updateEmbeddedDocuments("Combatant", [{ _id: A.id, initiative: aNew }, { _id: B.id, initiative: ia }]);
  const idx = combat.turns.findIndex(c => c.id === B.id);
  if (idx >= 0 && idx !== combat.turn) await combat.update({ turn: idx });
  await A.update({ [`flags.${F}.frozen`]: true });
  await setAP(A, left - 1, `swap with ${B.name}`, { kind: "act" });   // its own turn, though the turn has already moved to B
  const bHad = !!B.getFlag(F, "apTurn"), bLeft = getAP(B);   // v0.0.274: B's unused AP from its last turn
  await B.update({ [`flags.${F}.apTurn`]: `${combat.round}:${B.id}`, [`flags.${F}.acted`]: false, [`flags.${F}.frozen`]: false, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, ...unset(`flags.${F}.ignoreTerrain`), [`flags.${F}.rap`]: rapAtRegain(B) });
  await setAP(B, apPerTurn(B), "swapped in: start of turn", { rap: { b: 0, a: rapAtRegain(B) } });
  await setUnusedApGuard(B, bHad, bLeft);
  await climbUp(B);
  // v0.0.203: the system card (sysmsg.mjs); the slot is where A acts now (B's old place), counted from 1.
  const slot = combat.turns.findIndex(c => c.id === A.id) + 1;
  await ChatMessage.create({ content: swapCardHtml(A.name, B.name, getAP(B), getAP(A), slot), flags: { [F]: { swap: { a: A.id, b: B.id, slot, round: combat.round } } } });
}

/** v0.0.199: swap with a chosen ally (the strip's Swap, then a click on the ally): the GM does it, or is asked to. */
export async function swapWith(combat, a, bId) {
  if (a?.actor?.system?.atZero) return warn(`${a.name} is Down and can't swap initiative.`);
  if (game.user.isGM) return performSwap(combat, a.id, bId);
  game.socket.emit("system.twod12", { type: "swapInit", combatId: combat.id, aId: a.id, bId, userId: game.user.id });
}

export async function requestSwap(combat, a) {
  // Swapping Initiative: not while Down (at 0 HP: Desperate, Dying, Shattered or Unconscious).
  if (a?.actor?.system?.atZero) return warn(`${a.name} is Down and can't swap initiative.`);
  const list = swapCandidates(combat, a);
  if (!list.length) return warn("No ally is left to swap with this round.");
  // v0.0.415 (pack CL): the pick window (was a DialogV2)
  const id = await (await import("./pickwindow.mjs")).pickOne({ title: `${a.name}: swap initiative (1 AP)`, name: "Swap initiative", sub: `${a.name}, 1 AP`, icon: "fa-right-left",
    text: `Swap places with an ally who has not had a turn this round. ${a.name}'s remaining AP is frozen until its new turn.`, options: list.map(b => ({ k: b.id, l: b.name })) });
  if (!id) return;
  if (game.user.isGM) return performSwap(combat, a.id, id);
  game.socket.emit("system.twod12", { type: "swapInit", combatId: combat.id, aId: a.id, bId: id, userId: game.user.id });
}

export function registerCombatHooks() {
  game.socket.on("system.twod12", async data => {
    if (data?.type === "nextTurn" && game.user.isActiveGM) {
      const cb = game.combats.get(data.combatId);
      const cur = cb?.combatant;
      if (cb?.started && cur?.testUserPermission(game.users.get(data.userId), "OWNER")) await cb.nextTurn();
      return;
    }
    if (data?.type !== "swapInit" || !game.user.isActiveGM) return;
    const combat = game.combats.get(data.combatId);
    if (combat) await performSwap(combat, data.aId, data.bId, data.userId);
  });
  Hooks.on("combatStart", combat => startTurn(combat));
  Hooks.on("combatTurnChange", async (combat, prior) => {
    // v0.0.274 (Lucas): nothing happens to the AP left when a turn ends (v0.0.243 made them Guard here): the next turn's start does it
    await startTurn(combat);
  });
  Hooks.on("renderCombatTracker", (app, html) => {
    const el = html instanceof HTMLElement ? html : html?.[0];
    const combat = game.combat;
    if (!el || !combat) return;
    el.querySelectorAll("[data-combatant-id]").forEach(li => {
      const c = combat.combatants.get(li.dataset.combatantId);
      if (!c || li.querySelector(".twod12-ap")) return;
      const box = document.createElement("label");
      box.className = "twod12-ap";
      box.setAttribute("aria-label", "Action Points");
      const canSwap = combat.started && combat.combatant?.id === c.id && c.isOwner && !c.getFlag(F, "acted") && getAP(c) >= 1;
      box.innerHTML = `<span>AP</span><input type="number" min="0" value="${getAP(c)}" ${c.isOwner ? "" : "disabled"}><span class="hsep"></span><a class="twod12-rap${getRAP(c) ? " on" : ""}" aria-label="Reaction Point: ${getRAP(c) ? "ready (pays only for Reactions; click to spend it by hand)" : "spent (back at the start of its turn; click to give it back)"}"></a>${canSwap ? '<button type="button" class="twod12-swap" aria-label="Swap initiative with an ally (1 AP)"><i class="fa-solid fa-right-left"></i></button>' : ""}`;
      box.querySelector(".twod12-swap")?.addEventListener("click", () => requestSwap(combat, c));
      box.querySelector(".twod12-rap")?.addEventListener("click", () => { if (c.isOwner) setRAP(c, getRAP(c) ? 0 : rapMaxOf(c)); });
      if (c.getFlag(F, "frozen")) box.classList.add("frozen");
      const input = box.querySelector("input");
      for (const ev of ["click", "dblclick", "pointerdown", "contextmenu"]) box.addEventListener(ev, e => e.stopPropagation());
      input.addEventListener("change", () => setAP(c, input.value, "edited"));
      const init = li.querySelector(".token-initiative");
      if (init) init.before(box); else li.append(box);
    });
    if (game.user.isGM && combat.started && !el.querySelector(".twod12-reset")) {
      const rb = document.createElement("button");
      rb.type = "button"; rb.className = "twod12-reset";
      rb.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Reset Turn';
      rb.addEventListener("click", () => resetTurn(combat));
      (el.querySelector("header") ?? el).append(rb);
    }
    el.querySelectorAll("li.combatant").forEach(li => { const cb = combat.combatants.get(li.dataset.combatantId); if (cb) { li.classList.add("tc-group"); li.style.setProperty("--tcc", groupColor(cb)); } });
    el.querySelector(".twod12-init")?.remove();
    el.querySelector(".twod12-momentum")?.remove();
    if (!combat.started) {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "twod12-init";
      btn.innerHTML = '<i class="fa-solid fa-dice-d20"></i> Initiative';
      btn.addEventListener("click", () => rollPendingInitiative(combat));   // v0.0.273: only the ones still to roll, not left out
      (el.querySelector("header") ?? el).append(btn);
      // v0.0.243 (book, Momentum): the GM's switch; v0.0.407: the party's Momentum 0 to 4 (left-click +1, right-click -1): every PC starts at 1 + Momentum.
      if (game.user.isGM) {
        const mo = document.createElement("button");
        const n = momentumNow();
        mo.type = "button"; mo.className = `twod12-momentum${n ? " on" : ""}`;
        mo.innerHTML = `<i class="fa-solid fa-fire"></i> Momentum ${n}`;
        mo.setAttribute("aria-label", `The party's Momentum (0 to 4): every PC starts this encounter at Escalation ${1 + n}. Left-click +1, right-click -1.`);
        mo.addEventListener("click", async () => { await setMomentum(momentumNow() + 1, "set by the GM"); ui.combat?.render(); });
        mo.addEventListener("contextmenu", async ev => { ev.preventDefault(); await setMomentum(momentumNow() - 1, "set by the GM"); ui.combat?.render(); });
        (el.querySelector("header") ?? el).append(mo);
      }
    }
  });
}


/** End the turn of the creature whose turn it is: the GM does it, a player asks the GM (only for a creature they own). */
export async function endTurnFor(combat) {
  if (game.user.isGM) return combat.nextTurn();
  game.socket.emit("system.twod12", { type: "nextTurn", combatId: combat.id, userId: game.user.id });
}
