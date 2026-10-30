import { groupColor } from "./config.mjs";
// Combat: attribute-roll Initiative for everyone, "zipper" turn order between the two sides,
// and an Action Points counter per combatant (shown and editable in the tracker, changes sent to the chat).
import { performCheck, esc, sgn, combineRolls } from "./roll.mjs";
import { TWOD12 } from "./config.mjs";
import { forgetRestored } from "./effects.mjs";
const { DialogV2 } = foundry.applications.api;
const F = "twod12";
const warn = m => ui.notifications.warn(m);

export const AP_PER_TURN = 5;
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
/** The most AP a creature can have: 5 + Quickened - Slowed (Slowed also lowers the most AP, so Quickened 1 and Slowed 2 make it 4). */
/** A creature's AP a turn before conditions: 5, or its own (a Minion has 3: the Bestiary, v0.0.163). */
export const baseAP = actor => Number(actor?.system?.apPerTurn) || AP_PER_TURN;
export const apMax = combatant => Math.max(0, baseAP(combatant?.actor) + quickenedOf(combatant?.actor) - slowedOf(combatant?.actor));
/** AP regained at the start of a creature's turn: 5 + Quickened - Slowed (they cancel out without changing each other). */
export const apPerTurn = combatant => {
  const a = combatant?.actor;
  return Math.max(0, baseAP(a) + quickenedOf(a) - slowedOf(a));
};

/** Imperiled ends at the start of the creature's turn: it gets back to safety, to a legal square next to the hazard. */
export async function climbUp(c) {
  const a = c?.actor;
  const ids = (a?.effects ?? []).filter(e => e.statuses?.has?.("imperiled")).map(e => e.id);
  if (!ids.length) return;
  await a.deleteEmbeddedDocuments("ActiveEffect", ids);
  await ChatMessage.create({ content: `<div class="twod12 chat apmsg"><b>${c.name}</b> gets back to safety. Imperiled ends (they were Slowed 1 for this turn).</div>` });
}
export const getAP = c => Number(c?.getFlag(F, "ap")) || 0;

export function combatantOf(actor, combat = game.combat) {
  if (!combat || !actor) return null;
  // A token of an unlinked NPC: its own combatant (several tokens can share one actor id, so the id alone is not enough).
  if (actor.isToken && actor.token) return combat.combatants.find(c => c.tokenId === actor.token.id) ?? null;
  const same = combat.combatants.find(c => c.actor === actor);
  if (same) return same;
  const byId = combat.combatants.filter(c => c.actorId === actor.id);
  return byId.length === 1 ? byId[0] : null;
}

const apMessage = (c, from, to, why) => ChatMessage.create({
  content: `<div class="twod12 chat apmsg"><b>${esc(c.name)}</b>: AP ${from} &rarr; <b>${to}</b>${why ? ` <small>(${esc(why)})</small>` : ""}</div>`
});

/** Set a combatant's AP and say so in the chat. */
export async function setAP(c, value, why = "") {
  // Nobody holds more than their most AP (5, or more while Quickened); the GM's own edits in the tracker are not limited.
  const want = Math.max(0, Math.round(Number(value) || 0));
  const from = getAP(c), to = why === "edited" ? want : Math.min(want, Math.max(apMax(c), from));
  if (from === to && why === "edited") return;
  await c.setFlag(F, "ap", to);
  await apMessage(c, from, to, why);
}

/** Pay the AP of an action. Returns false when the player decides not to go ahead. Does nothing outside combat. */
export async function spendAP(actor, cost, label = "") {
  const c = combatantOf(actor);
  if (!c || !game.combat?.started) return true;
  if (c.getFlag(F, "frozen")) {
    const ok = await DialogV2.confirm({ window: { title: "Frozen" }, content: `<p><b>${esc(c.name)}</b> swapped initiative, so its remaining actions are frozen until its turn. Use ${esc(label)} anyway?</p>`, rejectClose: false });
    if (!ok) return false;
  }
  const have = getAP(c);
  if (have < cost) {
    const ok = await DialogV2.confirm({ window: { title: "Not enough AP" }, content: `<p><b>${esc(c.name)}</b> has ${have} AP and ${esc(label)} costs ${cost}. Use it anyway?</p>`, rejectClose: false });
    if (!ok) return false;
  }
  await c.setFlag(F, "acted", true);
  if (Number(c.getFlag(F, "evadeMove")) > 0) await c.update({ [`flags.${F}.evadeMove`]: 0, [`flags.${F}.-=ignoreTerrain`]: null });   // v0.0.182: an Evade left unused ends when another Action is used
  await setAP(c, Math.max(0, have - cost), label);
  return true;
}

/* ---- Zipper order ---- */
/** Creatures are grouped by token disposition (Friendly, Neutral, Hostile, Secret): usually the PCs against one group of enemies, but a three-way fight works too. */
const sideOf = c => {
  const d = c.token?.disposition;
  if (d !== undefined && d !== null) return d;
  return c.actor?.type === "character" ? CONST.TOKEN_DISPOSITIONS.FRIENDLY : CONST.TOKEN_DISPOSITIONS.HOSTILE;
};

/**
 * list is sorted by initiative (highest first). Each group keeps that order. Groups take turns, one creature at a time,
 * in the order of their highest result (a tie goes to the higher disposition: Friendly first). A group with no creatures left is skipped.
 */
export function zipper(list) {
  const groups = new Map();
  for (const c of list) { const k = sideOf(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); }
  const tieAttr = c => Number(c.getFlag?.(F, "initAttr")) || 0;
  const order = [...groups.entries()].sort((a, b) => ((b[1][0].initiative ?? -Infinity) - (a[1][0].initiative ?? -Infinity)) || (tieAttr(b[1][0]) - tieAttr(a[1][0])) || (b[0] - a[0])).map(e => e[1]);
  const out = [];
  while (order.some(g => g.length)) for (const g of order) if (g.length) out.push(g.shift());
  return out;
}

async function askInitiativeAttr() {
  return DialogV2.prompt({
    window: { title: "Initiative" },
    content: `<p>Initiative is an Attribute Check. Roll with:</p>${Object.entries(TWOD12.attributes).map(([k, l]) => `<label class="pick"><input type="radio" name="attr" value="${k}" ${k === "instinct" ? "checked" : ""}> ${l}</label>`).join("<br>")}`,
    ok: { label: "Roll", callback: (ev, btn) => new FormData(btn.form).get("attr") }, rejectClose: false
  });
}

const chip = (f, dbl) => `<span class="die d12${f === 12 ? " boom" : ""}${dbl ? " dbl" : ""}">${f}</span>`;

export class TwoD12Combat extends Combat {
  /** An encounter can't end while a creature is Dying or Shattered: every creature must be unharmed, stabilized or dead. */
  async endCombat() {
    const down = this.combatants.filter(x => x.actor?.statuses?.has("dying") || x.actor?.statuses?.has("shattered")).map(x => x.name);
    if (down.length) {
      const ok = await DialogV2.confirm({ window: { title: "End the encounter?" }, content: `<p>The encounter can't end while a creature is Dying or Shattered: <b>${down.map(esc).join(", ")}</b>. Every creature must be unharmed, stabilized or dead.</p><p>End it anyway?</p>`, rejectClose: false });
      if (!ok) return this;
    }
    return super.endCombat();
  }

  setupTurns() {
    const tieAttr = c => Number(c.getFlag?.(F, "initAttr")) || 0;
    const disp = c => c.token?.disposition ?? (c.actor?.type === "character" ? 1 : -1);
    const base = [...super.setupTurns()].sort((a, b) => ((b.initiative ?? -Infinity) - (a.initiative ?? -Infinity)) || (tieAttr(b) - tieAttr(a)) || (disp(b) - disp(a)));
    const ordered = zipper([...base]);
    this.turns = ordered;
    const c = ordered[this.turn];
    if (this.current) { this.current.combatantId = c?.id ?? null; this.current.tokenId = c?.tokenId ?? null; }
    return ordered;
  }

  /** Everyone rolls the same Attribute Check (asked once). */
  async rollInitiative(ids, options = {}) {
    ids = typeof ids === "string" ? [ids] : [...ids];
    const list = ids.map(id => this.combatants.get(id)).filter(c => c?.isOwner && c.actor);
    if (!list.length) return this;
    const attr = await askInitiativeAttr();
    if (!attr) return this;
    const curId = this.started ? this.combatant?.id : null;
    const rows = [], rolls = [], updates = [];
    for (const c of list) {
      const mod = c.actor.system.attributes?.[attr] ?? 0;
      const r = await performCheck({ mod });
      rolls.push(...r.rolls);
      updates.push({ _id: c.id, initiative: r.total, [`flags.${F}.initAttr`]: mod });
      rows.push(
        `<div class="irow"><span class="sname">${esc(c.name)}</span><span class="dice"><span class="dgroup">${r.d1.map((f, i) => chip(f, r.doubles && i === 0)).join("")}</span><span class="plus">+</span><span class="dgroup">${r.d2.map((f, i) => chip(f, r.doubles && i === 0)).join("")}</span><span class="plus">${sgn(mod)}</span></span><b class="rtotal">${r.total}</b></div>`
      );
    }
    await this.updateEmbeddedDocuments("Combatant", updates);
    const all = combineRolls(rolls);
    await ChatMessage.create({
      rolls: all ? [all] : [], content: `<div class="twod12 chat"><div class="ahead"><b>Initiative</b><span>${esc(TWOD12.attributes[attr])}</span></div>${rows.join("")}</div>`
    });
    // Keep the creature whose turn it is as the current one when the order changes.
    if (curId) { const idx = this.turns.findIndex(c => c.id === curId); if (idx >= 0 && idx !== this.turn) await this.update({ turn: idx }); }
    return this;
  }
}

/** Give the creature whose turn it is its AP (once per turn). GM only. */
async function startTurn(combat) {
  if (!game.user.isActiveGM) return;
  const c = combat.combatant;
  if (!c) return;
  const key = `${combat.round}:${c.id}`;
  if (c.getFlag(F, "apTurn") === key) return;
  const fresh = { [`flags.${F}.apTurn`]: key, [`flags.${F}.acted`]: false, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, [`flags.${F}.-=ignoreTerrain`]: null };
  if (c.getFlag(F, "frozen")) {
    // It swapped initiative earlier: it carries on with the AP it had left.
    await c.update({ ...fresh, [`flags.${F}.frozen`]: false });
    await ChatMessage.create({ content: `<div class="twod12 chat apmsg"><b>${esc(c.name)}</b> carries on with <b>${getAP(c)}</b> AP.</div>` });
  } else {
    await c.update(fresh);
    await setAP(c, apPerTurn(c), "start of turn");
    await climbUp(c);
    // v0.0.187: the Effects its Features give at the start of each turn (Killer's Focus, Radiant Zeal); not when it carries on after a swap.
    try { const { applyTurnStartEffects } = await import("./automation.mjs"); await applyTurnStartEffects(c.actor); } catch (e) { console.warn("twod12 | Effect each turn", e); }
  }
  await takeSnapshot(combat);
}

/* ---- Reset Turn: the state is saved when a turn begins ---- */
const FLAG_DEFAULTS = { ap: 0, frozen: false, acted: false, apTurn: "", moveLeft: 0, freeMove: 0, evadeMove: 0 };
const clone = o => foundry.utils.deepClone(o);

export async function takeSnapshot(combat) {
  const actors = new Map();
  for (const x of combat.combatants) if (x.actor?.uuid) actors.set(x.actor.uuid, x.actor);
  const scene = canvas.scene;
  const snap = {
    round: combat.round, turn: combat.turn, who: combat.combatant?.name ?? "",
    combatants: [...combat.combatants].map(x => ({ id: x.id, initiative: x.initiative, flags: clone(x.flags?.[F] ?? {}) })),
    actors: [...actors].map(([uuid, a]) => ({ uuid, damage: clone(a.system?.damage ?? {}), bodyWounds: a.system?.bodyWounds ?? 0, mindWounds: a.system?.mindWounds ?? 0, effects: [...(a.effects ?? [])].map(e => e.toObject()) })),
    tokens: [...(scene?.tokens ?? [])].map(t => ({ _id: t.id, x: t.x, y: t.y, elevation: t.elevation ?? 0, light: t.light?.toObject?.() ?? null })),
    regions: [...(scene?.regions ?? [])].map(r => r.toObject())
  };
  await combat.setFlag(F, "snapshot", snap);
}

/** GM: put everything back as it was when the current turn began. */
export async function resetTurn(combat) {
  const snap = combat.getFlag(F, "snapshot");
  if (!snap) return warn("No saved state for this turn.");
  if (snap.round !== combat.round || snap.turn !== combat.turn) return warn(`The saved state is from round ${snap.round}, turn ${snap.turn + 1}. Reset only works during that turn.`);
  const ok = await DialogV2.confirm({ window: { title: "Reset Turn" }, content: `<p>Put everything back as it was when ${esc(snap.who)}'s turn began: damage, effects, token positions, areas, AP and movement.</p>`, rejectClose: false });
  if (!ok) return;
  const scene = canvas.scene;
  for (const a of snap.actors) {
    const actor = await fromUuid(a.uuid);
    if (!actor) continue;
    await actor.update({ "system.damage": a.damage, "system.bodyWounds": a.bodyWounds ?? 0, "system.mindWounds": a.mindWounds ?? 0 });
    const have = [...actor.effects].map(e => e.id);
    if (have.length) await actor.deleteEmbeddedDocuments("ActiveEffect", have);
    for (const e of a.effects) forgetRestored(e._id);
    if (a.effects.length) await actor.createEmbeddedDocuments("ActiveEffect", a.effects, { keepId: true });
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
  await ChatMessage.create({ content: `<div class="twod12 chat apmsg"><b>Turn reset</b>: everything is back to the start of ${esc(snap.who)}'s turn.</div>` });
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
  await setAP(A, left - 1, `swap with ${B.name}`);
  await B.update({ [`flags.${F}.apTurn`]: `${combat.round}:${B.id}`, [`flags.${F}.acted`]: false, [`flags.${F}.frozen`]: false, [`flags.${F}.moveLeft`]: 0, [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, [`flags.${F}.-=ignoreTerrain`]: null });
  await setAP(B, apPerTurn(B), "swapped in: start of turn");
  await climbUp(B);
  await ChatMessage.create({ content: `<div class="twod12 chat apmsg"><b>${esc(A.name)}</b> swaps initiative with <b>${esc(B.name)}</b>. ${esc(B.name)} takes the turn now; ${esc(A.name)}'s remaining actions are frozen until its new turn.</div>` });
}

export async function requestSwap(combat, a) {
  // Swapping Initiative: not while Down (at 0 HP: Desperate, Dying, Shattered or Unconscious).
  if (a?.actor?.system?.atZero) return warn(`${a.name} is Down and can't swap initiative.`);
  const list = swapCandidates(combat, a);
  if (!list.length) return warn("No ally is left to swap with this round.");
  const id = await DialogV2.prompt({
    window: { title: `${a.name}: swap initiative (1 AP)` },
    content: `<p>Swap places with an ally who has not had a turn this round. ${esc(a.name)}'s remaining AP is frozen until its new turn.</p>${list.map((b, i) => `<label class="pick"><input type="radio" name="b" value="${b.id}" ${i === 0 ? "checked" : ""}> ${esc(b.name)}</label>`).join("<br>")}`,
    ok: { label: "Swap", callback: (ev, btn) => new FormData(btn.form).get("b") }, rejectClose: false
  });
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
  Hooks.on("combatTurnChange", combat => startTurn(combat));
  Hooks.on("renderCombatTracker", (app, html) => {
    const el = html instanceof HTMLElement ? html : html?.[0];
    const combat = game.combat;
    if (!el || !combat) return;
    el.querySelectorAll("[data-combatant-id]").forEach(li => {
      const c = combat.combatants.get(li.dataset.combatantId);
      if (!c || li.querySelector(".twod12-ap")) return;
      const box = document.createElement("label");
      box.className = "twod12-ap";
      box.dataset.tooltip = "Action Points";
      const canSwap = combat.started && combat.combatant?.id === c.id && c.isOwner && !c.getFlag(F, "acted") && getAP(c) >= 1;
      box.innerHTML = `<span>AP</span><input type="number" min="0" value="${getAP(c)}" ${c.isOwner ? "" : "disabled"}>${canSwap ? '<button type="button" class="twod12-swap" data-tooltip="Swap initiative with an ally (1 AP)"><i class="fa-solid fa-right-left"></i></button>' : ""}`;
      box.querySelector(".twod12-swap")?.addEventListener("click", () => requestSwap(combat, c));
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
    if (!combat.started) {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "twod12-init";
      btn.innerHTML = '<i class="fa-solid fa-dice-d20"></i> Initiative';
      btn.addEventListener("click", () => combat.rollInitiative(combat.combatants.map(c => c.id)));
      (el.querySelector("header") ?? el).append(btn);
    }
  });
}


/** End the turn of the creature whose turn it is: the GM does it, a player asks the GM (only for a creature they own). */
export async function endTurnFor(combat) {
  if (game.user.isGM) return combat.nextTurn();
  game.socket.emit("system.twod12", { type: "nextTurn", combatId: combat.id, userId: game.user.id });
}
