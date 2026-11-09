// v0.0.310 (Lucas's design, the "FAB · GM window" mockup; replaces the pick-window Initiative of v0.0.244 to v0.0.274): the Initiative windows.
//   The GM's window: every creature of the encounter by side, who rolls (the GM or its player), each row's Check, Favored / Doomed, Boons / Banes,
//   moving a creature to another side, Goes last; identical NPCs stacked when there are more than 5 enemies. The model is initmodel.mjs, the HTML
//   initview.mjs. The GM's settings are the combatant flag twod12.init ({ who, attr, fav, doom, boons, banes, side, last, by, rolledAttr }) and
//   the Attribute called is the combat flag twod12.initCall ({ attr }), so a player's client reads them and its roll uses them.
//   The players' window: opened on each player who owns a creature (the socket, "initOpen"), read-only: their creatures' cards with a Roll button.
//   Rolls go through performCheck like any Check: the creature's effects (Boons, Banes, Favored, Doomed, Exhausted) are in it.
import { gmModel, playerModel, applyClick, rollOf, whoOf, goesLast, isRolled, attrOf, sideOf, sideDisp } from "./initmodel.mjs";
import { gmHtml, playerHtml } from "./initview.mjs";
import { performCheck, combineRolls } from "./roll.mjs";
import { modifierList, resolveModifiers } from "./effects.mjs";
import { unconsciousDoom, doomStatus } from "./config.mjs";
import { initCardData, initCardHtml } from "./initcard.mjs";
import { cleanName } from "./moment.mjs";
const F = "twod12", SOCKET = "system.twod12";
const { ApplicationV2 } = foundry.applications?.api ?? {};

/* ---------------------------------------------------------------- the settings, the socket, live updates */

export function registerInitiativeSettings() {
  game.settings.register(F, "initPlayersOpen", { name: "Initiative opens for the players", hint: "When the GM opens Initiative, each player who owns a creature in the encounter gets their own Initiative window. Off: players roll from their portraits.", scope: "world", config: true, type: Boolean, default: true });
  game.settings.register(F, "initNpcsForPlayers", { name: "NPCs in the players' Initiative window", hint: "Hidden tokens are never shown.", scope: "world", config: true, type: String, default: "visible",
    choices: { visible: "Show visible NPCs", afterStart: "Don't show NPCs until combat starts" } });
}
const setting = (k, d) => { try { return game.settings.get(F, k); } catch (e) { return d; } };

export function registerInitiativeSocket() {
  game.socket.on(SOCKET, data => {
    if (data?.type !== "initOpen" || game.user.isGM || !setting("initPlayersOpen", true)) return;
    const combat = game.combats.get(data.combatId);
    if (combat && [...combat.combatants].some(c => c.isOwner && c.actor)) PlayerInitWindow.show(combat);
  });
}

/* ---------------------------------------------------------------- the creatures */

/** The Attribute the GM calls (Instinct by default). */
export const callOf = combat => ({ attr: combat?.getFlag?.(F, "initCall")?.attr || "instinct" });

/** The player who owns an actor (its character's user first), or "". */
function ownerName(actor) {
  const users = [...(game.users ?? [])].filter(u => !u.isGM && actor?.testUserPermission?.(u, "OWNER"));
  return (users.find(u => u.character?.id === actor?.id) ?? users[0])?.name ?? "";
}

/** A creature's effects on an Attribute Check (the roll dialog's own pieces): Boons, Banes, Favored, Doomed and Exhausted, with chips. */
export function fxFor(actor, attr) {
  const out = { boons: 0, banes: 0, sources: [], fav: false, doom: false, favBy: [], doomBy: [], exh: 0, chips: [] };
  if (!actor) return out;
  try {
    const mods = modifierList(actor, new Set([attr, "__check"])).filter(m => m.match && !m.info && !m.once);
    const res = resolveModifiers(actor, mods.map(m => m.id));
    Object.assign(out, { boons: res.boons, banes: res.banes, sources: res.sources, fav: !!res.favored, doom: !!res.doomed, favBy: [...(res.favBy ?? [])], doomBy: [...(res.doomBy ?? [])] });
    for (const s of res.sources) { if (s.boons) out.chips.push(`${s.name}: ${s.boons} Boon${s.boons === 1 ? "" : "s"}`); if (s.banes) out.chips.push(`${s.name}: ${s.banes} Bane${s.banes === 1 ? "" : "s"}`); }
  } catch (e) { console.warn("twod12 | initiative effects", e); }
  if (unconsciousDoom(actor, attr, "Check")) { out.doom = true; out.doomBy.push(doomStatus(actor) || "Unconscious"); }
  if (actor.system?.armorUntrained) { out.doom = true; out.doomBy.push("Untrained armor"); }
  for (const n of out.favBy) out.chips.push(`${n}: Favored`);
  for (const n of out.doomBy) out.chips.push(`${n}: Doomed`);
  out.exh = Math.max(0, Number(actor.system?.exhausted) || 0);
  if (out.exh) out.chips.unshift(`Exhausted ${out.exh}: −${out.exh}`);
  return out;
}

/** One combatant as the model's creature. */
export function creatureOf(c, call) {
  const a = c.actor, set = c.getFlag?.(F, "init") ?? {};
  const disp = c.token?.disposition ?? (a?.type === "character" ? 1 : -1);
  const pc = a?.type === "character" && !!c.hasPlayerOwner, npc = a?.type === "npc";
  const st = k => !!a?.statuses?.has?.(k);
  const cr = { id: c.id, name: cleanName(c.name), base: cleanName(game.actors?.get(c.actorId)?.name ?? a?.name ?? c.name), img: c.img || a?.img, actorId: c.actorId,
    pc, npc, ally: npc && disp === 1, owner: pc ? ownerName(a) : "", disp, hidden: !!(c.hidden || c.token?.hidden), mine: !game.user?.isGM && !!c.isOwner && !!a,
    mods: { ...(a?.system?.attributes ?? {}) }, rolled: c.initiative ?? null, rolledAttr: set.rolledAttr || "", rolledBy: set.by || "",
    dying: st("dying") ? "Dying" : st("shattered") ? "Shattered" : "", set };
  cr.fx = fxFor(a, attrOf(cr, call));
  return cr;
}
export const creaturesOf = combat => [...(combat?.combatants ?? [])].filter(c => c.actor).map(c => creatureOf(c, callOf(combat)));

/* ---------------------------------------------------------------- rolling */

/** Roll these creatures (those not rolled and not going last), each with its own settings and effects; one chat card. by: "GM" or the player's name. */
export async function rollCreatures(combat, ids, by = "GM") {
  const call = callOf(combat), rows = [], rolls = [], updates = [];
  const curId = combat.started ? combat.combatant?.id : null;
  for (const id of ids) {
    const c = combat.combatants.get(id);
    if (!c?.actor || !c.isOwner) continue;
    const cr = creatureOf(c, call);
    if (isRolled(cr) || goesLast(cr)) continue;
    const ro = rollOf(cr, call);
    const r = await performCheck({ mod: ro.mod, boons: ro.boons, banes: ro.banes, manualBoons: ro.manualBoons, manualBanes: ro.manualBanes, favored: ro.favored, doomed: ro.doomed,
      adj: ro.adj, adjLabel: ro.adjLabel, sources: cr.fx.sources, noDoubles: true });
    rolls.push(...r.rolls);
    updates.push({ _id: c.id, initiative: r.total, [`flags.${F}.initAttr`]: ro.mod, [`flags.${F}.init.by`]: by, [`flags.${F}.init.rolledAttr`]: ro.attr });
    rows.push({ id: c.id, name: cr.name, side: sideDisp(sideOf(cr)), attr: ro.attr, mod: ro.mod, r });
  }
  if (!updates.length) return 0;
  await combat.updateEmbeddedDocuments("Combatant", updates);
  const all = combineRolls(rolls);
  const data = initCardData(rows, (combat.turns ?? []).map(c => c.id));
  await ChatMessage.create({ rolls: all ? [all] : [], content: initCardHtml(data), flags: { [F]: { initiative: rows.map(x => ({ id: x.id, attr: x.attr, mod: x.mod, total: x.r.total })) } } });
  // Keep the creature whose turn it is as the current one when the order changes (the GM only can move the turn).
  if (curId && game.user.isGM) { const idx = combat.turns.findIndex(c => c.id === curId); if (idx >= 0 && idx !== combat.turn) await combat.update({ turn: idx }); }
  return updates.length;
}

/** A player's roll of their own creatures (portrait, tracker, sheet): with the GM's settings; not a creature the GM rolls or one that goes last. */
export async function playerRoll(combat, ids) {
  const call = callOf(combat), ok = [];
  for (const id of ids) {
    const c = combat.combatants.get(id);
    if (!c?.isOwner || !c.actor || (c.initiative !== null && c.initiative !== undefined)) continue;
    const cr = creatureOf(c, call);
    if (goesLast(cr)) { ui.notifications.info(`${cr.name} goes last: no initiative roll.`); continue; }
    if (whoOf(cr) === "gm" && cr.set?.who === "gm") { ui.notifications.info(`The GM rolls ${cr.name}'s initiative.`); continue; }
    ok.push(id);
  }
  if (ok.length) await rollCreatures(combat, ok, game.user.name);
}

/** The GM opens Initiative: Goes last turned on for a Dying or Shattered creature (once: the GM can turn it off), the window, and the players' windows. */
export async function openInitiative(combat) {
  if (!combat || !game.user.isGM) return;
  const ups = [];
  for (const c of combat.combatants) {
    const st = k => !!c.actor?.statuses?.has?.(k), set = c.getFlag(F, "init") ?? {};
    if ((c.initiative === null || c.initiative === undefined) && (st("dying") || st("shattered")) && set.last === undefined) ups.push({ _id: c.id, [`flags.${F}.init.last`]: true });
  }
  if (ups.length) await combat.updateEmbeddedDocuments("Combatant", ups);
  if (!combat.getFlag(F, "initCall")) await combat.setFlag(F, "initCall", { attr: "instinct" });
  InitWindow.show(combat);
  if (setting("initPlayersOpen", true)) game.socket.emit(SOCKET, { type: "initOpen", combatId: combat.id });
}

/* ---------------------------------------------------------------- the windows */

const LIVE = ["updateCombatant", "createCombatant", "deleteCombatant", "updateCombat", "updateActor", "createActiveEffect", "updateActiveEffect", "deleteActiveEffect", "updateToken"];

class BaseInitWindow extends (ApplicationV2 ?? class {}) {
  constructor(combat, options = {}) { super(options); this.combat = combat; this._hooks = []; }
  _html() { return ""; }
  async _renderHTML() { const div = document.createElement("div"); div.innerHTML = this._html(); return div.firstElementChild ?? div; }
  _replaceHTML(result, content) {
    const body = content.querySelector(".iw-body"), scroll = body?.scrollTop ?? 0, act = document.activeElement, key = act && content.contains(act) ? keyOf(act) : "";
    content.replaceChildren(result);
    const nb = content.querySelector(".iw-body"); if (nb) nb.scrollTop = scroll;
    if (key) content.querySelector(key)?.focus({ preventScroll: true });
  }
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const soon = () => { clearTimeout(this._t); this._t = setTimeout(() => { if (this.rendered) this.render(); }, 60); };
    for (const h of LIVE) this._hooks.push([h, Hooks.on(h, doc => { const cb = doc?.parent ?? doc; if (h === "updateCombat" && doc?.id !== this.combat.id) return; if (h.endsWith("Combatant") && cb?.id !== this.combat.id) return; soon(); })]);
    this._hooks.push(["deleteCombat", Hooks.on("deleteCombat", doc => { if (doc?.id === this.combat.id) this.close(); })]);
    this.element.addEventListener("click", ev => this._click(ev));
    this.element.addEventListener("change", ev => this._change(ev));
    this.element.addEventListener("keydown", ev => this._key(ev));
  }
  async _onClose(options) { for (const [h, id] of this._hooks) Hooks.off(h, id); this._hooks = []; return super._onClose?.(options); }
  _click() {}
  _change() {}
  _key(ev) { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); this.close(); } }
}
const keyOf = el => (el?.dataset?.act ? `[data-act="${el.dataset.act}"]${el.dataset.row ? `[data-row="${CSS.escape(el.dataset.row)}"]` : ""}${el.dataset.v ? `[data-v="${CSS.escape(el.dataset.v)}"]` : ""}${el.dataset.id ? `[data-id="${CSS.escape(el.dataset.id)}"]` : ""}` : "");

/** The GM's window (one at a time). */
export class InitWindow extends BaseInitWindow {
  static DEFAULT_OPTIONS = { id: "twod12-initiative", classes: ["twod12", "iwin"], window: { title: "Initiative", resizable: true }, position: { width: 980, height: "auto" } };
  static show(combat) {
    const open = foundry.applications.instances?.get?.("twod12-initiative");
    if (open) { open.combat = combat; open.render({ force: true }); open.bringToFront?.(); return open; }
    return new InitWindow(combat).render({ force: true });
  }
  constructor(combat) { super(combat); this.ui = { closed: {}, open: {}, moving: {} }; }
  _model() { return gmModel(creaturesOf(this.combat), callOf(this.combat), this.ui, { playersOpen: setting("initPlayersOpen", true) }); }
  _html() { return gmHtml(this._model()); }
  _members(el) { const ids = new Set(String(el.dataset.ids ?? "").split(",").filter(Boolean)); return creaturesOf(this.combat).filter(c => ids.has(c.id)); }
  async _save(byId) {
    const ups = Object.entries(byId).map(([id, set]) => ({ _id: id, [`flags.${F}.init`]: set }));
    if (ups.length) await this.combat.updateEmbeddedDocuments("Combatant", ups);
  }
  async _click(ev) {
    const b = ev.target.closest("button[data-act]");
    if (!b || b.disabled) return;
    ev.preventDefault();
    const act = b.dataset.act, call = callOf(this.combat);
    if (act === "call") return this.combat.setFlag(F, "initCall", { attr: b.dataset.v });
    if (act === "fold") { this.ui.closed[b.dataset.key] = !this.ui.closed[b.dataset.key]; return this.render(); }
    if (act === "stack") { this.ui.open[b.dataset.key] = !this.ui.open[b.dataset.key]; return this.render(); }
    if (act === "move") { this.ui.moving[b.dataset.row] = !this.ui.moving[b.dataset.row]; return this.render(); }
    if (act === "cancel") return this.close();
    if (act === "roll") return this._roll();
    if (act === "gmAll") return this._save(applyClick(creaturesOf(this.combat), call, "gmAll"));
    if (act === "reroll") return this.combat.updateEmbeddedDocuments("Combatant", this._members(b).map(c => ({ _id: c.id, initiative: null, [`flags.${F}.init.who`]: "gm", [`flags.${F}.init.by`]: "", [`flags.${F}.init.rolledAttr`]: "" })));
    const ms = this._members(b);
    if (ms.length) return this._save(applyClick(ms, call, act, b.dataset.v));
  }
  async _change(ev) {
    const s = ev.target.closest("select[data-act]");
    if (!s) return;
    const ms = this._members(s);
    if (s.dataset.act === "side") this.ui.moving[s.dataset.row] = false;
    if (ms.length) await this._save(applyClick(ms, callOf(this.combat), s.dataset.act, s.value));
  }
  _key(ev) {
    if (ev.key === "Enter" && !ev.target.closest("select, textarea, input")) { ev.preventDefault(); this._roll(); return; }
    super._key(ev);
  }
  async _roll() {
    const m = this._model();
    if (!m.rollN) return ui.notifications.info(m.pending ? "Nothing for the GM to roll: the players are rolling." : "Nobody left for the GM to roll.");
    await rollCreatures(this.combat, m.rollIds, "GM");
    if (!this._model().pending) this.close();
  }
}

/** A player's window: their creatures (read-only, a Roll button each), the other Heroes, the other sides by name (never a number). */
export class PlayerInitWindow extends BaseInitWindow {
  static DEFAULT_OPTIONS = { id: "twod12-initiative-player", classes: ["twod12", "iwin", "iwpl"], window: { title: "Initiative", resizable: true }, position: { width: 540, height: "auto" } };
  static show(combat) {
    const open = foundry.applications.instances?.get?.("twod12-initiative-player");
    if (open) { open.combat = combat; open.render({ force: true }); open.bringToFront?.(); return open; }
    return new PlayerInitWindow(combat).render({ force: true });
  }
  _html() { return playerHtml(playerModel(creaturesOf(this.combat), callOf(this.combat), game.user.name, { npcMode: setting("initNpcsForPlayers", "visible"), started: !!this.combat.started })); }
  async _click(ev) {
    const b = ev.target.closest("button[data-act]");
    if (!b || b.disabled) return;
    ev.preventDefault();
    if (b.dataset.act === "cancel") return this.close();
    if (b.dataset.act === "proll") { b.disabled = true; await playerRoll(this.combat, [b.dataset.id]); }
  }
}
