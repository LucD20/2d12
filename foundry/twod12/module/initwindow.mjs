// v0.0.310 (Lucas's design, the "FAB · GM window" mockup; replaces the pick-window Initiative of v0.0.244 to v0.0.274): the Initiative windows.
//   The GM's window: every creature of the encounter by side, who rolls (the GM or its player), each row's Check, Favored / Doomed, Boons / Banes,
//   moving a creature to another side, Goes last; identical NPCs stacked when there are more than 5 enemies. The model is initmodel.mjs, the HTML
//   initview.mjs. The GM's settings are the combatant flag twod12.init ({ who, attr, fav, doom, boons, banes, side, last, by, rolledAttr }) and
//   the Attribute called is the combat flag twod12.initCall ({ attr }), so a player's client reads them and its roll uses them.
//   The players' window: opened on each player who owns a creature (the socket, "initOpen"), read-only: their creatures' cards with a Roll button.
//   Rolls go through performCheck like any Check: the creature's effects (Boons, Banes, Favored, Doomed, Exhausted) are in it.
import { gmModel, playerModel, applyClick, squadMove, squadGroupsForRoll, squadJoin, squadCreate, squadRemove, squadDissolve, squadAutoMinions, squadUngroupSide, rollOf, whoOf, goesLast, isRolled, attrOf, sideOf, sideDisp } from "./initmodel.mjs";
import { gmHtml, playerHtml } from "./initview.mjs";
import { performCheck, combineRolls } from "./roll.mjs";
import { modifierList, resolveModifiers } from "./effects.mjs";
import { unconsciousDoom, doomStatus } from "./config.mjs";
import { initCardData, initCardHtml } from "./initcard.mjs";
import { cleanName } from "./moment.mjs";
import { logOnlyChange } from "./util.mjs";
import { minionGroupOf } from "./roundrules.mjs";   // v0.0.440: legacy Minion squad click
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
    pc, npc, role: npc ? String(a?.system?.role ?? "") : "", ally: npc && disp === 1, minion: npc && a?.system?.role === "minion" ? `${c.actorId}|${a.name}` : "" /* v0.0.440: its kind, for the squads */, owner: pc ? ownerName(a) : "", disp, hidden: !!(c.hidden || c.token?.hidden), mine: !game.user?.isGM && !!c.isOwner && !!a,
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
  // v0.0.489: honor GM Squad Cards (custom squads, "solo" ungroups, and Minion auto-squads); each member still keeps its own turn
  const todo = ids.map(id => combat.combatants.get(id)).filter(c => c?.actor && c.isOwner && !isRolled(creatureOf(c, call)) && !goesLast(creatureOf(c, call)));
  const todoCrs = todo.map(c => creatureOf(c, call));
  const squads = squadGroupsForRoll(todoCrs);
  const follows = new Set(Object.values(squads).flatMap(m => m.slice(1)));
  for (const id of ids) {
    const c = combat.combatants.get(id);
    if (!c?.actor || !c.isOwner) continue;
    const cr = creatureOf(c, call);
    if (isRolled(cr) || goesLast(cr) || follows.has(c.id)) continue;
    const ro = rollOf(cr, call);
    const r = await performCheck({ mod: ro.mod, boons: ro.boons, banes: ro.banes, manualBoons: ro.manualBoons, manualBanes: ro.manualBanes, favored: ro.favored, doomed: ro.doomed,
      adj: ro.adj, adjLabel: ro.adjLabel, sources: cr.fx.sources, noDoubles: true });
    rolls.push(...r.rolls);
    const sqMembers = squads[c.id] ?? [];
    updates.push({ _id: c.id, initiative: r.total, [`flags.${F}.initAttr`]: ro.mod, [`flags.${F}.init.by`]: by, [`flags.${F}.init.rolledAttr`]: ro.attr });
    rows.push({ id: c.id, name: sqMembers.length > 1 ? `${cr.base || cr.name} ×${sqMembers.length}` : cr.name, side: sideDisp(sideOf(cr)), attr: ro.attr, mod: ro.mod, r });
    for (const m of sqMembers.slice(1)) updates.push({ _id: m, initiative: r.total, [`flags.${F}.initAttr`]: ro.mod, [`flags.${F}.init.by`]: by, [`flags.${F}.init.rolledAttr`]: ro.attr, [`flags.${F}.init.squad`]: c.id });   // its squad takes the leader's roll
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
    for (const h of LIVE) this._hooks.push([h, Hooks.on(h, (doc, ch) => { const cb = doc?.parent ?? doc; if (h === "updateCombat" && (doc?.id !== this.combat.id || logOnlyChange(ch))) return; if (h.endsWith("Combatant") && cb?.id !== this.combat.id) return; soon(); })]);
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
  constructor(combat) { super(combat); this.ui = { closed: {}, open: {}, moving: {}, sqOpen: {}, sel: {}, pop: "" }; this._dragId = ""; }
  _onFirstRender(context, options) {
    super._onFirstRender(context, options);
    this.element.addEventListener("dragstart", ev => {
      if (ev.target.closest("button, input, select, option, .iw-pop")) { ev.preventDefault(); return; }
      const el = ev.target.closest("[data-drag-id]");
      if (!el) return;
      this._dragId = el.dataset.dragId || "";
      try { ev.dataTransfer.effectAllowed = "move"; ev.dataTransfer.setData("text/plain", this._dragId); } catch (e) { /* synthetic */ }
    });
    this.element.addEventListener("dragover", ev => {
      if (!this._dragId) return;
      const box = ev.target.closest("[data-drop-squad]"), solo = !box ? ev.target.closest("[data-drop-solo]") : null, zone = !box && !solo ? ev.target.closest("[data-drop-zone]") : null;
      if (solo && solo.dataset.dropSolo === this._dragId) return;
      if (box || solo || zone) {
        ev.preventDefault();
        this.element.querySelectorAll(".iw-drag-over").forEach(x => { if (x !== (box || solo)) x.classList.remove("iw-drag-over"); });
        if (box || solo) (box || solo).classList.add("iw-drag-over");
      }
    });
    this.element.addEventListener("dragleave", ev => {
      const t = ev.target.closest?.(".iw-drag-over");
      if (t && !t.contains(ev.relatedTarget)) t.classList.remove("iw-drag-over");
    });
    this.element.addEventListener("drop", async ev => {
      const id = this._dragId;
      this._dragId = "";
      this.element.querySelectorAll(".iw-drag-over").forEach(x => x.classList.remove("iw-drag-over"));
      if (!id) return;
      const box = ev.target.closest("[data-drop-squad]"), solo = !box ? ev.target.closest("[data-drop-solo]") : null, zone = !box && !solo ? ev.target.closest("[data-drop-zone]") : null;
      const all = creaturesOf(this.combat);
      if (box) { ev.preventDefault(); this.ui.pop = ""; delete this.ui.sel[id]; await this._save(squadJoin(all, [id], box.dataset.dropSquad)); }
      else if (solo && solo.dataset.dropSolo !== id) { ev.preventDefault(); this.ui.pop = ""; delete this.ui.sel[id]; delete this.ui.sel[solo.dataset.dropSolo]; await this._save(squadCreate(all, [solo.dataset.dropSolo, id])); }
      else if (zone) { ev.preventDefault(); this.ui.pop = ""; await this._save(squadRemove(all, [id])); }
    });
  }
  _clearPop() {
    this._popEl?.remove();
    this._popEl = null;
    if (this._popOutside) { window.removeEventListener("pointerdown", this._popOutside, true); this._popOutside = null; }
    if (this._popKey) { window.removeEventListener("keydown", this._popKey, true); this._popKey = null; }
  }
  async _onClose(options) { this._clearPop(); return super._onClose?.(options); }
  _replaceHTML(result, content) {
    this._clearPop();
    super._replaceHTML(result, content);
    const pop = content.querySelector(".iw-pop");
    const btn = pop?.closest(".iw-popwrap")?.querySelector('[data-act="sqPop"]');
    if (pop && btn && typeof document !== "undefined" && document.body) {
      const r = btn.getBoundingClientRect();
      const host = document.createElement("div");
      const themeCls = this.element?.classList?.contains("theme-light") ? " theme-light" : this.element?.classList?.contains("theme-dark") ? " theme-dark" : "";
      host.className = `twod12 iwin iwin-pop-portal${themeCls}`;
      pop.style.position = "fixed";
      pop.style.right = "auto";
      pop.style.bottom = "auto";
      pop.style.left = `${Math.max(8, r.left)}px`;
      pop.style.top = `${r.bottom + 4}px`;
      host.appendChild(pop);
      document.body.appendChild(host);
      const pr = pop.getBoundingClientRect();
      const left = Math.max(8, Math.min(r.left, window.innerWidth - pr.width - 8));
      const fitsBelow = r.bottom + 4 + pr.height <= window.innerHeight - 10;
      const top = fitsBelow ? (r.bottom + 4) : Math.max(8, r.top - pr.height - 4);
      pop.style.left = `${left}px`;
      pop.style.top = `${top}px`;
      host.addEventListener("click", ev => this._click(ev));
      this._popEl = host;
      this._popOutside = ev => {
        if (host.contains(ev.target) || ev.target.closest?.(".iw-popwrap")) return;
        this.ui.pop = "";
        this._clearPop();
      };
      this._popKey = ev => {
        if (ev.key !== "Escape") return;
        this.ui.pop = "";
        this._clearPop();
      };
      window.addEventListener("pointerdown", this._popOutside, true);
      window.addEventListener("keydown", this._popKey, true);
      const body = content.querySelector(".iw-body");
      body?.addEventListener("scroll", () => { if (this.ui.pop) { this.ui.pop = ""; this._clearPop(); } }, { once: true });
    }
  }
  _model() { return gmModel(creaturesOf(this.combat), callOf(this.combat), this.ui, { playersOpen: setting("initPlayersOpen", true) }); }
  _html() { return gmHtml(this._model()); }
  _members(el) { const ids = new Set(String(el.dataset.ids ?? "").split(",").filter(Boolean)); return creaturesOf(this.combat).filter(c => ids.has(c.id)); }
  async _save(byId) {
    const ups = Object.entries(byId).map(([id, set]) => ({ _id: id, [`flags.${F}.init`]: set }));
    if (ups.length) { await this.combat.updateEmbeddedDocuments("Combatant", ups); if (this.rendered) this.render(); }
  }
  async _click(ev) {
    if (this.ui.pop && !ev.target.closest(".iw-popwrap") && !ev.target.closest(".iwin-pop-portal")) { this.ui.pop = ""; this._clearPop(); }
    const b = ev.target.closest("button[data-act]");
    if (!b || b.disabled) return;
    ev.preventDefault();
    const act = b.dataset.act, call = callOf(this.combat);
    if (act === "sqPop") { ev.stopPropagation(); this.ui.pop = this.ui.pop === b.dataset.v ? "" : (b.dataset.v || ""); return this.render(); }
    this.ui.pop = "";
    this._clearPop();
    if (act === "sqSel") {
      const id = b.dataset.id;
      if (this.ui.sel[id]) delete this.ui.sel[id];
      else this.ui.sel[id] = true;
      return this.render();
    }
    if (act === "call") return this.combat.setFlag(F, "initCall", { attr: b.dataset.v });
    if (act === "fold") { this.ui.closed[b.dataset.key] = !this.ui.closed[b.dataset.key]; return this.render(); }
    if (act === "stack") { this.ui.open[b.dataset.key] = !this.ui.open[b.dataset.key]; return this.render(); }
    if (act === "sqExpand") { this.ui.sqOpen[b.dataset.sq] = !this.ui.sqOpen[b.dataset.sq]; return this.render(); }
    if (act === "move") { this.ui.moving[b.dataset.row] = !this.ui.moving[b.dataset.row]; return this.render(); }
    if (act === "cancel") return this.close();
    if (act === "roll") return this._roll();
    if (act === "gmAll") return this._save(applyClick(creaturesOf(this.combat), call, "gmAll"));
    if (act === "reroll") return this.combat.updateEmbeddedDocuments("Combatant", this._members(b).map(c => ({ _id: c.id, initiative: null, [`flags.${F}.init.who`]: "gm", [`flags.${F}.init.by`]: "", [`flags.${F}.init.rolledAttr`]: "", [`flags.${F}.init.squad`]: "" })));
    if (act === "sqJoin") { delete this.ui.sel[b.dataset.id]; return this._save(squadJoin(creaturesOf(this.combat), [b.dataset.id], b.dataset.sq)); }
    if (act === "sqNew") { delete this.ui.sel[b.dataset.a]; delete this.ui.sel[b.dataset.b]; return this._save(squadCreate(creaturesOf(this.combat), [b.dataset.a, b.dataset.b])); }
    if (act === "sqRemove") return this._save(squadRemove(creaturesOf(this.combat), [b.dataset.id]));
    if (act === "sqDissolve") return this._save(squadDissolve(creaturesOf(this.combat), b.dataset.sq));
    if (act === "sqAuto") { this.ui.sel = {}; return this._save(squadAutoMinions(creaturesOf(this.combat), b.dataset.key)); }
    if (act === "sqUngroup") { this.ui.sel = {}; return this._save(squadUngroupSide(creaturesOf(this.combat), b.dataset.key)); }
    if (act === "sqGroupSel") {
      const all = creaturesOf(this.combat), ids = all.filter(c => sideOf(c) === b.dataset.key && this.ui.sel[c.id] && !isRolled(c)).map(c => c.id);
      for (const id of ids) delete this.ui.sel[id];
      return this._save(squadCreate(all, ids));
    }
    if (act === "sqClearSel") {
      for (const c of creaturesOf(this.combat)) if (sideOf(c) === b.dataset.key) delete this.ui.sel[c.id];
      return this.render();
    }
    const ms = this._members(b);
    // v0.0.453 (playtest 6): legacy squad click fallback
    if (act === "squad" && ms.length === 1) {
      const all = creaturesOf(this.combat), me = ms[0];
      const kind = all.filter(c => c.minion && c.minion === me.minion && !isRolled(c));
      const sq = minionGroupOf(kind.map(c => ({ id: c.id, kind: c.minion, group: c.set?.group ?? 0 })))[me.id];
      if (sq) return this._save(squadMove(kind, me.id, b.dataset.v, sq.groups));
    }
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
    if (ev.key === "Escape" && this.ui.pop) { ev.preventDefault(); ev.stopPropagation(); this.ui.pop = ""; this.render(); return; }
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
