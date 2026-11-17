// Going Down (Chapter 4: Going Down, Desperate, Dying, Shattered). Run on one client: the first active player who owns the character,
// or the active GM when no player does, so the choices are asked to the person playing it.
//   Reaching the Health Pool: Nonlethal >= 50% -> Unconscious; some Nonlethal -> choose Unconscious or Desperate;
//   no Nonlethal -> Dying (Body dominant) or Shattered (Mind dominant; a tie: choose), roll on the Table the first time in the encounter,
//   then choose to collapse (Unconscious) or keep fighting.
//   Desperate and taking Lethal damage -> Dying or Shattered (as above); Nonlethal reaching 50% -> Unconscious.
//   Dying or Shattered and fighting, taking damage -> a Body Check (Body damage) or Mind Check (Mind damage): Tier 1 or 2, roll on the Table;
//   then you may collapse.
//   End of each turn while Dying or Shattered -> a Body (Dying) or Mind (Shattered) Check: Tier 1, roll on the Table; collapsed and Tier 3,
//   roll on the Table and stabilize (no longer Dying or Shattered, still Unconscious). Fighting: then you may collapse.
// The choice (fighting or collapsed) is the actor flag twod12.downChoice; the Table already rolled this encounter: twod12.downTableCombat.
import { performCheck, checkHtml, rollTable, showDice } from "./roll.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
const F = "twod12";

/** The client that handles a character's going Down: its first active player owner, else the active GM. */
export function handlerOf(actor) {
  const player = game.users.find(u => u.active && !u.isGM && actor.testUserPermission?.(u, "OWNER"));
  return player ?? game.users.activeGM ?? null;
}
const mine = actor => handlerOf(actor)?.id === game.user.id;
const has = (actor, s) => !!actor.statuses?.has?.(s);
const setStatus = (actor, s, on) => (has(actor, s) === on ? null : actor.toggleStatusEffect(s, { active: on }));

// v0.0.289 (PACK SHEET, the standing rule: no Foundry default windows): the choice in the system's pick window. Closed: the last option.
async function ask(actor, text, buttons) {
  const { pickOne } = await import("./pickwindow.mjs");
  const k = await pickOne({ title: actor.name, name: actor.name, sub: "Going Down", icon: "fa-heart-crack", text: String(text).replace(/<[^>]+>/g, ""), options: buttons.map(([k, l]) => ({ k, l })) });
  return k ?? buttons[buttons.length - 1][0];
}

/** v0.0.289 (PACK SHEET): the sheet's Keep fighting / Collapse (Give up) while Dying or Shattered. Collapsing asks first (it can't be undone while Down). */
export async function setDownChoice(actor, choice) {
  const kind = has(actor, "dying") ? "dying" : (has(actor, "shattered") ? "shattered" : "");
  if (!kind) return;
  if (choice === "fight") {
    if (has(actor, "unconscious")) return ui.notifications.warn(`${actor.name} is Unconscious: you can't wake up while ${kind === "dying" ? "Dying" : "Shattered"}.`);
    await actor.setFlag(F, "downChoice", "fighting");
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-person-rifle", `<b>${esc(actor.name)}</b> keeps fighting (${kind === "dying" ? "Dying" : "Shattered"}).`) });
  }
  const { pickConfirm } = await import("./pickwindow.mjs");
  const word = kind === "dying" ? "Collapse" : "Give up";
  const ok = await pickConfirm({ title: `${word}: ${actor.name}`, name: word, sub: kind === "dying" ? "Dying" : "Shattered", icon: "fa-bed", confirm: word,
    text: `${esc(actor.name)} falls <b>Unconscious</b>. While ${kind === "dying" ? "Dying" : "Shattered"} you can't wake up; at the end of each of your turns you make a ${kind === "dying" ? "Body" : "Mind"} Check (Tier 3: stabilize).` });
  if (!ok) return;
  await actor.setFlag(F, "downChoice", "collapsed");
  await setStatus(actor, "unconscious", true);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-bed", `<b>${esc(actor.name)}</b> ${kind === "dying" ? "collapses" : "gives up"}: Unconscious.`) });
}

/** Dying or Shattered: by the Dominant Damage (a tie: the creature chooses). */
async function dyingKind(actor) {
  const d = actor.system.dominant;
  if (d === "Body") return "dying";
  if (d === "Mind") return "shattered";
  return ask(actor, "Vigor and Resolve damage are tied: which do you become?", [["dying", "Dying (Vigor)"], ["shattered", "Shattered (Resolve)"]]);
}

/**
 * The Table marks of this encounter: { combat: id, kinds: ["dying", ...] } (v0.0.176). An older flag (only the combat's id) counted for both
 * conditions; it is read as "Dying and Shattered both rolled" so nothing rolls twice. Pure: the tests use it.
 */
export function firstTimeThisEncounter(flag, cid, kind) {
  if (!flag) return true;
  if (typeof flag === "string") return flag !== cid;
  return flag.combat !== cid || !(flag.kinds ?? []).includes(kind);
}
export function tableMark(flag, cid, kind) {
  const kinds = flag && typeof flag === "object" && flag.combat === cid ? [...(flag.kinds ?? [])] : [];
  return { combat: cid, kinds: [...new Set([...kinds, kind])] };
}

/** Become Dying or Shattered: the Table the first time in this encounter, then collapse or keep fighting. */
async function becomeDying(actor) {
  const kind = await dyingKind(actor);
  await setStatus(actor, "desperate", false);
  await setStatus(actor, kind, true);
  const cid = game.combat?.id ?? "none";
  // v0.0.176 (book, Dying and Shattered): the first time you become Dying in an encounter you roll on the Dying Table, and the first time you
  // become Shattered on the Shattered Table; again in the same encounter, no roll. Each condition counts on its own.
  if (firstTimeThisEncounter(actor.getFlag(F, "downTableCombat"), cid, kind)) { await rollTable(actor, kind); await actor.setFlag(F, "downTableCombat", tableMark(actor.getFlag(F, "downTableCombat"), cid, kind)); }
  await chooseFight(actor, kind);
}

async function chooseFight(actor, kind) {
  const word = kind === "dying" ? "collapse" : "give up";
  const c = await ask(actor, `You are <b>${kind === "dying" ? "Dying" : "Shattered"}</b>. Keep fighting, or ${word} and fall Unconscious?`, [["fight", "Keep fighting"], ["collapse", word[0].toUpperCase() + word.slice(1)]]);
  await actor.setFlag(F, "downChoice", c === "fight" ? "fighting" : "collapsed");
  if (c !== "fight") await setStatus(actor, "unconscious", true);
}

/** A Body or Mind Check (never Doomed: these are the checks the rules exempt), posted to the chat. Returns the Tier. */
async function downCheck(actor, attr, title) {
  const r = await performCheck({ mod: Number(actor.system.attributes?.[attr]) || 0, dc: 13 });
  await showDice(r.rolls);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<div class="twod12 chat">${checkHtml(title, r, [], { showTier: true })}</div>` });
  return r.tier;
}

/** Called after an update of a character's damage (old values from before the update). */
export async function afterDamage(actor, before) {
  if (actor.type !== "character" || !mine(actor)) return;
  const s = actor.system, pool = s.pool || 0;
  if (!s.atZero) return;
  const more = (s.totalDamage ?? 0) > (before.total ?? 0);
  if (!before.down) {
    // Going Down now.
    if (s.nonlethal >= pool / 2) return setStatus(actor, "unconscious", true);
    if (s.nonlethal > 0) {
      const c = await ask(actor, "You are <b>Down</b> with some Nonlethal damage. Keep fighting as Desperate, or fall Unconscious?", [["desperate", "Keep fighting (Desperate)"], ["unconscious", "Fall Unconscious"]]);
      return setStatus(actor, c, true);
    }
    return becomeDying(actor);
  }
  if (!more) return;
  if (has(actor, "desperate")) {
    if (s.nonlethal >= pool / 2) { await setStatus(actor, "desperate", false); return setStatus(actor, "unconscious", true); }
    if ((s.lethal ?? 0) > (before.lethal ?? 0)) return becomeDying(actor);
    return;
  }
  const kind = has(actor, "dying") ? "dying" : (has(actor, "shattered") ? "shattered" : "");
  if (!kind) return;
  if (actor.getFlag(F, "downChoice") === "fighting" && !has(actor, "unconscious")) {
    const bodyHit = (s.bodyDamage ?? 0) > (before.body ?? 0);
    const tier = await downCheck(actor, bodyHit ? "body" : "mind", `${bodyHit ? "Body" : "Mind"} Check (${kind === "dying" ? "Dying" : "Shattered"}, damage)`);
    if (tier <= 2) await rollTable(actor, kind);
    await chooseFight(actor, kind);
  }
}

/** At the end of a Dying or Shattered creature's turn. */
export async function endOfTurn(actor, { force = false } = {}) {
  if (!actor || actor.type !== "character" || (!force && !mine(actor))) return;   // v0.0.289: force, the sheet's button
  const kind = has(actor, "dying") ? "dying" : (has(actor, "shattered") ? "shattered" : "");
  if (!kind) return;
  const attr = kind === "dying" ? "body" : "mind", collapsed = has(actor, "unconscious");
  const tier = await downCheck(actor, attr, `${attr === "body" ? "Body" : "Mind"} Check (${kind === "dying" ? "Dying" : "Shattered"}, end of turn)`);
  if (tier === 1) await rollTable(actor, kind);
  if (collapsed && tier === 3) {
    await rollTable(actor, kind);
    await setStatus(actor, kind, false);   // stabilized: no longer Dying or Shattered, still Unconscious
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-heart-pulse", `<b>${esc(actor.name)}</b> stabilizes: no longer ${kind === "dying" ? "Dying" : "Shattered"}, still Unconscious.`) });
    return;
  }
  if (!collapsed) await chooseFight(actor, kind);
}

/** Desperate, Dying and Shattered come with Slowed as a rider: Slowed 1, or 1 more than the creature's other Slowed (to at most 3).
 *  The rider is its own effect (flag twod12.rider = "down"), kept in step with the other Slowed effects and removed with the condition. */
export async function syncDownSlowed(actor) {
  if (!actor?.effects) return;
  const down = ["desperate", "dying", "shattered"].some(s => has(actor, s));
  const rider = actor.effects.find(e => e.getFlag?.(F, "rider") === "down");
  if (!down) { if (rider) await rider.delete(); return; }
  let base = 0;
  for (const e of actor.effects) if (e !== rider && !e.disabled && e.statuses?.has?.("slowed")) base = Math.max(base, Math.max(1, Math.trunc(Number(e.getFlag(F, "value"))) || 1));
  const want = Math.min(3, base + 1), why = ["Desperate", "Dying", "Shattered"].find(w => has(actor, w.toLowerCase()));
  const data = { name: `Slowed ${want} (${why})`, "flags.twod12.value": want };
  if (rider) { if (Number(rider.getFlag(F, "value")) !== want || rider.name !== data.name) await rider.update(data); return; }
  await actor.createEmbeddedDocuments("ActiveEffect", [{ name: data.name, img: "icons/svg/stoned.svg", statuses: ["slowed"], flags: { twod12: { value: want, rider: "down" } } }]);
}

export function registerDownHooks() {
  for (const h of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) Hooks.on(h, async effect => {
    const actor = effect.parent;
    if (!game.user.isActiveGM || actor?.documentName !== "Actor" || effect.getFlag?.(F, "rider") === "down") return;
    if (!["desperate", "dying", "shattered", "slowed"].some(s => effect.statuses?.has?.(s))) return;
    try { await syncDownSlowed(actor); } catch (e) { console.warn("twod12 | Slowed while Down", e); }
  });
  Hooks.on("preUpdateActor", (actor, changes, options) => {
    const s = actor.system ?? {};
    options.twod12Down = { down: !!s.atZero, total: s.totalDamage ?? 0, lethal: s.lethal ?? 0, body: s.bodyDamage ?? 0 };
  });
  Hooks.on("updateActor", async (actor, changes, options) => {
    if (!options.twod12Down) return;
    if (!actor.system?.atZero && options.twod12Down.down && mine(actor)) { if (actor.getFlag(F, "downChoice")) await actor.unsetFlag(F, "downChoice"); return; }
    try { await afterDamage(actor, options.twod12Down); } catch (e) { console.warn("twod12 | going Down", e); }
  });
  Hooks.on("combatTurnChange", async (combat, prior) => {
    const c = combat.combatants.get(prior?.combatantId);
    try { await endOfTurn(c?.actor); } catch (e) { console.warn("twod12 | Dying/Shattered at the end of the turn", e); }
  });
}

/**
 * v0.0.176 (book, Unconscious): "Unless you are Down, a creature can wake you with the Interact Action (1A)". Down: damage at or above the
 * Health Pool, or Desperate, Dying or Shattered. Returns "" (it can be woken) or why not. Pure: the tests use it.
 */
export function wakeProblem(actor) {
  const st = actor?.statuses;
  if (!st?.has?.("unconscious")) return "isn't Unconscious";
  if (actor.system?.atZero || ["desperate", "dying", "shattered"].some(k => st.has(k))) return "is Down: Interact can't wake a creature that is Down";
  return "";
}

/** Interact with an Unconscious creature targeted: offer to wake it (it stops being Unconscious), or say why it can't be woken. */
export async function offerWake(user, tokens) {
  for (const t of tokens ?? []) {
    const a = t?.actor;
    if (!a?.statuses?.has?.("unconscious")) continue;
    const why = wakeProblem(a);
    if (why) { ui.notifications.warn(`${t.name} ${why}.`); continue; }
    // v0.0.415 (pack CL): the pick window (was a DialogV2) and a sysLine (was a plain line)
    const ok = await (await import("./pickwindow.mjs")).pickConfirm({ title: "Interact", name: "Wake", sub: t.name, icon: "fa-bell", confirm: "Wake", text: `Wake <b>${esc(t.name)}</b>? It stops being Unconscious.` });
    if (!ok) continue;
    if (a.isOwner) await a.toggleStatusEffect("unconscious", { active: false });
    const { sysLine } = await import("./sysmsg.mjs");
    await ChatMessage.create({ content: sysLine("fa-bell", `<b>${esc(user?.name ?? "Someone")}</b> wakes <b>${esc(t.name)}</b> (Interact)${a.isOwner ? "" : ": the GM removes Unconscious"}.`) });
  }
}
