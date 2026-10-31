import { allEffects } from "./passives.mjs";
import { appliedFlags } from "./appliedflags.mjs";
import { effectOff } from "./escalation.mjs";
import { openEffectSheet } from "./fxopen.mjs";
import { bumpExhausted, isExhaustedFx, exhaustedClick, heldModifiers } from "./sleep.mjs";
import { esc } from "./roll.mjs";
import { TWOD12 } from "./config.mjs";
import { combatantOf } from "./combat.mjs";
import { onceKey, onceBlocked, isMarked } from "./automation.mjs";
const SOCKET = "system.twod12";
const F = "twod12";

export const durationText = d => (d?.type === "eot" ? "EoT" : (d?.type === "rounds" ? `${d.rounds} round${d.rounds === 1 ? "" : "s"}` : ""));

/** Who applied the effect and when (used for Rounds expiry). */
export function originInfo(actorUuid) {
  const c = game.combat;
  const comb = c?.combatants.find(x => x.actor?.uuid === actorUuid);
  return { actorUuid, combatantId: comb?.id ?? "", slot: comb?.initiative ?? null, round: c?.round ?? null, turn: c?.turn ?? null };
}

/** Notes of the actor's effects that apply to rolls with this attribute. */
export function notesFor(actor, attrKey) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const n of e.getFlag(F, "notes") ?? []) if (n.attrs?.includes(attrKey)) out.push({ name: e.name.replace(/^\s*Effect:\s*/i, ""), title: n.title || e.name.replace(/^\s*Effect:\s*/i, ""), text: n.text });
  }
  return out;
}

/** Predicate: all listed traits present, at least one of "any" (if given), none of "none". */
export const matches = (m, traits, from = null) => (m.all ?? []).every(t => traits.has(t))
  && (!(m.any?.length) || m.any.some(t => traits.has(t)))
  && !(m.none ?? []).some(t => traits.has(t))
  && (!(m.from?.length) || (!!from && m.from.some(t => from.has(t))));   // "from": traits of the Action that caused a Save

// __action marks every Action and stays hidden; the roll kinds a player can pick (Check, Save, Attribute Action) are shown by name.
const vis = list => (list ?? []).filter(t => !String(t).startsWith("__") || t in TWOD12.rollKinds);
const tname = t => TWOD12.traits[t] ?? TWOD12.rollKinds[t] ?? t;
const predText = m0 => { const m = { ...m0, all: vis(m0.all), any: vis(m0.any), none: vis(m0.none) }; return [
  m.all?.length ? m.all.map(tname).join(" and ") : "",
  m.any?.length ? `any of ${m.any.map(tname).join(", ")}` : "",
  m.none?.length ? `not ${m.none.map(tname).join(", ")}` : "",
  m.from?.length ? `Saves against ${m.from.map(tname).join(" or ")} Actions` : ""
].filter(Boolean).join("; ") || "Any roll"; };

/** The Empowered and Enfeebled values that a creature's effects give to the damage of an Action with these traits: { empowered: [{ name, n }], enfeebled: [{ name, n }] } (Bloodlust: Empowered 1). */
export function damageSteps(actor, traits, target = null) {
  const out = { empowered: [], enfeebled: [] };
  for (const e of allEffects(actor)) for (const m of (effectOff(actor, e) ? [] : e.getFlag(F, "modifiers") ?? [])) {
    if (m.against || !matches(m, traits)) continue;
    if (m.vsMarked && !isMarked(actor, target)) continue;   // v0.0.186: only against the creature it marked (Hunter's Focus)
    const emp = m.empowered === true ? 1 : Math.trunc(Number(m.empowered)) || 0, enf = Math.trunc(Number(m.enfeebled)) || 0;   // (older effects stored true for Empowered)
    if (emp > 0) out.empowered.push({ name: shortName(e.name), n: emp });
    if (enf > 0) out.enfeebled.push({ name: shortName(e.name), n: enf });
  }
  for (const e of actor?.effects ?? []) for (const id of ["empowered", "enfeebled"]) {   // the conditions Empowered N and Enfeebled N
    if (e.statuses?.has?.(id)) out[id].push({ name: baseNameOf(e), n: Math.max(1, Math.trunc(Number(e.getFlag(F, "value"))) || 1) });
  }
  return out;
}

/** A one-off effect from a @Boon button: N boons (banes when negative) on the creature's next matching roll, ending at the end of its turn or after some rounds. */
export async function applyBoonEffect(actor, cfg, origin) {
  if (!actor.isOwner) return game.socket.emit(SOCKET, { type: "applyBoon", actorUuid: actor.uuid, cfg, origin });
  const n = Number(cfg.n) || 0;
  if (!n) return;
  const traits = cfg.traits ?? [];
  const what = traits.length ? traits.map(t => TWOD12.traits[t] ?? t).join(" ") : "Roll";
  const name = cfg.name || `${Math.abs(n)} ${n < 0 ? "Bane" : "Boon"}${Math.abs(n) === 1 ? "" : "s"} on the next ${what}`;
  const d = Number(cfg.rounds) > 0 ? { type: "rounds", rounds: Number(cfg.rounds) } : { type: "eot", rounds: 1 };
  const own = combatantOf(actor);
  await actor.createEmbeddedDocuments("ActiveEffect", [{
    name, img: n < 0 ? "icons/svg/downgrade.svg" : "icons/svg/upgrade.svg", origin: origin?.actorUuid ?? null, showIcon: 2,
    flags: { [F]: {
      duration: d, remaining: d.rounds, slotInit: own?.initiative ?? null, originSlot: origin?.slot ?? null,
      originCombatantId: origin?.combatantId ?? "", appliedRound: origin?.round ?? null, appliedTurn: origin?.turn ?? null,
      description: "", notes: [], bonuses: [], grants: [],
      modifiers: [{ against: false, boons: n > 0 ? n : 0, banes: n < 0 ? -n : 0, empowered: 0, enfeebled: 0, all: traits, any: [], none: [], from: [] }],
      // "the next ...": it is used up by the next roll with all those traits (with no traits it lasts its duration)
      expireOn: traits, expireAll: true
    } }
  }]);
}

/** Every boon/bane modifier on the actor's effects, with whether it matches these traits. */
/** Effects are often named "Effect: Name" in the world; cards and dialogs show just "Name". */
export const shortName = n => String(n ?? "").replace(/^\s*Effect:\s*/i, "");

/** Banes from the creature's own state. Bloodied: [Strike] and [Weapon] Actions, Body and Instinct Saves. Strained: [Magic] Actions, Mind and Appeal Saves. */
export function derivedMods(actor) {
  const s = actor?.system, out = [];
  if (s?.bloodied) {
    out.push({ id: "syn:bloodied", name: "Bloodied", boons: 0, banes: 1, all: ["__action"], any: ["strike", "weapon"], none: [] });
    out.push({ id: "syn:bloodied-save", name: "Bloodied", boons: 0, banes: 1, all: ["__save"], any: ["body", "instinct"], none: [] });
  }
  if (s?.strained) {
    out.push({ id: "syn:strained", name: "Strained", boons: 0, banes: 1, all: ["__action"], any: ["magic"], none: [] });
    out.push({ id: "syn:strained-save", name: "Strained", boons: 0, banes: 1, all: ["__save"], any: ["mind", "appeal"], none: [] });
  }
  // A two-handed weapon held with one hand: 3 banes on all [Strike, Weapon] Actions, whichever weapon they use.
  if ((actor?.itemTypes?.weapon ?? []).some(w => w.system.wielded && w.system.traits?.has?.("twohanded") && (w.system.hands ?? 1) < 2)) out.push({ id: "syn:onehand", name: "Two-handed weapon in one hand", boons: 0, banes: 3, all: ["strike", "weapon"], any: [], none: [] });
  return out;
}

const onceText = m => (m.oncePerRound ? " (the first one each round)" : "");
/** How many times a modifier counts: one that is "by value" (a condition with a value) counts as many times as the value (Vulnerable 2: 2 boons). */
const kOf = (m, e) => (m.byValue ? Math.max(1, Number(e.getFlag(F, "value")) || 1) : 1);
/** The value of a Vulnerable effect: the condition with a value, or an older effect named "Vulnerable 2". 0 for anything else. */
const vulnerableOf = e => {
  if (/^Vulnerable\b/i.test(e.getFlag?.(F, "baseName") ?? "")) return Math.max(1, Number(e.getFlag(F, "value")) || 1);
  const m = String(e.name ?? "").match(/^Vulnerable\s+(\d+)/i);
  return m ? Number(m[1]) : 0;
};

export function modifierList(actor, traits, targetActors = [], from = null) {
  const out = [];
  for (const m of derivedMods(actor)) out.push({ id: m.id, name: m.name, boons: m.boons, banes: m.banes, match: matches(m, traits, from), predicate: predText(m) });
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    (e.getFlag(F, "modifiers") ?? []).forEach((m, i) => {
      if (m.against || !(m.boons || m.banes)) return;
      // v0.0.186: once per round (used: not offered) and only against the marked target (one chip for that target).
      const once = m.oncePerRound ? onceKey(e, "m", i) : "";
      if (once && onceBlocked(actor, once)) return;
      const base = { name: shortName(e.name), boons: m.boons * kOf(m, e), banes: m.banes * kOf(m, e), match: matches(m, traits, from), predicate: predText(m) + onceText(m), ...(once ? { once, onceActor: actor.uuid } : {}) };
      if (!m.vsMarked) return out.push({ id: `${e.id}:${i}`, ...base });
      for (const t of targetActors) if (isMarked(actor, t)) out.push({ ...base, id: `${t.uuid}|${e.id}:${i}`, name: `${base.name} (${t.name})`, predicate: `Against your marked target, ${t.name}: ${base.predicate}` });
    });
  }
  // Effects on the target that change rolls made against it (Prone: Melee Actions against you gain 1 boon).
  for (const t of targetActors) {
    // Vulnerable N: only the highest value applies (and a second one with the same value counts once).
    const vul = Math.max(0, ...[...(t?.effects ?? [])].map(vulnerableOf));
    let vulSeen = false;
    for (const e of allEffects(t)) {
      if (effectOff(t, e)) continue;
      const vo = vulnerableOf(e);
      if (vo) { if (vo < vul || vulSeen) continue; vulSeen = true; }
      (e.getFlag(F, "modifiers") ?? []).forEach((m, i) => {
        if (!m.against || !(m.boons || m.banes)) return;
        const once = m.oncePerRound ? onceKey(e, "m", i) : "";   // v0.0.186: the first matching Action against it each round (Elusive)
        if (once && onceBlocked(t, once)) return;
        out.push({ id: `${t.uuid}|${e.id}:${i}`, name: `${shortName(e.name)} (${t.name})`, boons: m.boons * kOf(m, e), banes: m.banes * kOf(m, e), match: matches(m, traits), predicate: `Against ${t.name}: ${predText(m)}${onceText(m)}`, ...(once ? { once, onceActor: t.uuid } : {}) });
      });
    }
  }
  return out;
}

/** v0.0.186: the "once per round" modifiers that were in this roll (selected in the dialog) are used: remembered on the creature that has them. */
export async function useOnceModifiers(actor, traits, targetActors = [], from = null, selected = []) {
  const ids = new Set((Array.isArray(selected) ? selected : [selected]).filter(Boolean).map(String));
  const byActor = new Map([actor, ...targetActors].filter(Boolean).map(a => [a.uuid, a]));
  const keys = new Map();
  for (const m of modifierList(actor, traits, targetActors, from)) if (m.once && ids.has(String(m.id))) {
    if (!keys.has(m.onceActor)) keys.set(m.onceActor, []);
    keys.get(m.onceActor).push(m.once);
  }
  const { markOnce } = await import("./automation.mjs");
  for (const [uuid, list] of keys) { const a = byActor.get(uuid); if (a) await markOnce(a, list); }
}

/** Sum of the chosen modifiers ("effectId:index" ids). */
export function resolveModifiers(actor, ids, extra = []) {
  let boons = 0, banes = 0;
  const sources = [];
  for (const id of ids ?? []) {
    if (String(id).startsWith("syn:")) {
      const m = [...derivedMods(actor), ...extra].find(x => x.id === id);
      if (m) { boons += m.boons ?? 0; banes += m.banes ?? 0; sources.push({ name: m.name, boons: m.boons ?? 0, banes: m.banes ?? 0 }); }
      continue;
    }
    const [owner, rest] = id.includes("|") ? id.split("|") : [null, id];
    const [eid, idx] = rest.split(":");
    const holder = owner ? fromUuidSync(owner) : actor;
    const e = holder?.effects?.get(eid);
    const m = e?.getFlag(F, "modifiers")?.[Number(idx)];
    if (!m) continue;
    const k = kOf(m, e);
    boons += m.boons * k; banes += m.banes * k;
    sources.push({ name: shortName(e.name), boons: m.boons * k, banes: m.banes * k });
  }
  return { boons, banes, sources };
}

/** The radius (in squares, from the token's center) of a light of size N around a creature whose token is `half` squares wide from its center (lightradius.mjs draws it so). */
export const lightRadius = (n, half = 0.5) => (Number(n) > 0 ? Number(n) + half : 0);

async function applyLight(actor, light) {
  const dist = canvas.scene?.grid?.distance ?? 1;
  const backup = [];
  for (const td of actor.getActiveTokens(false, true)) {
    backup.push({ uuid: td.uuid, bright: td.light.bright, dim: td.light.dim, color: td.light.color ?? null });
    // v0.0.177: the token's light gets the book's size (N); lightradius.mjs adds half the token's width when the light is drawn (v0.0.176 wrote N + 0.5 here).
    await td.update({ "light.bright": light.bright * dist, "light.dim": light.dim * dist, "light.color": light.color || null });
  }
  return backup;
}

export { appliedFlags };

export async function createEffect(actor, item, origin, over = null, extra = {}) {
  const s = item.system;
  const olds = actor.effects.filter(e => e.getFlag(F, "effectUuid") === item.uuid), old = olds.map(e => e.id);
  const d = over?.duration ? { type: over.duration.type, rounds: over.duration.rounds ?? 1 } : { type: s.duration.type, rounds: s.duration.rounds };
  // The same effect again doesn't stack: it keeps the longer duration (the value is the same: it is the same effect).
  if (d.type === "rounds") for (const e of olds) if (e.getFlag(F, "duration")?.type === "rounds") d.rounds = Math.max(d.rounds, Number(e.getFlag(F, "remaining")) || 0);
  // A condition with a value: the same condition again doesn't stack, it keeps the higher value.
  let value = s.valued ? Math.max(1, Math.trunc(Number(over?.value)) || 1) : undefined;
  if (s.valued) for (const e of olds) value = Math.max(value, Number(e.getFlag(F, "value")) || 0);
  if (old.length) await actor.deleteEmbeddedDocuments("ActiveEffect", old);
  const sid = shortName(item.name).trim().toLowerCase();
  const baseId = sid.replace(/\s*\(.*\)\s*$/, "");   // "Hindered (until Move)" is the Hindered status
  const statuses = (CONFIG.statusEffects ?? []).some(e => e.id === sid) ? [sid] : ((CONFIG.statusEffects ?? []).some(e => e.id === baseId) ? [baseId] : []);
  const light = s.settings.find(x => x.type === "light");
  const lightBackup = light ? await applyLight(actor, light) : null;
  // The "slot" is the initiative count: EoT and Rounds end at the end of that count even if the creature swaps initiative later.
  const own = combatantOf(actor);
  const slotInit = own?.initiative ?? null;
  const made = (await actor.createEmbeddedDocuments("ActiveEffect", [{
    name: value !== undefined ? `${item.name} ${value}` : item.name, img: item.img, origin: origin?.actorUuid ?? null, showIcon: 2, statuses,
    flags: { [F]: {
      ...extra, effectUuid: item.uuid, duration: d, remaining: d.rounds, ...(value !== undefined ? { value, baseName: item.name } : {}),
      slotInit, originSlot: origin?.slot ?? null,
      originCombatantId: origin?.combatantId ?? "", appliedRound: origin?.round ?? null, appliedTurn: origin?.turn ?? null,
      ...appliedFlags(s, item.toObject().system), lightBackup, fromEscalation: !!origin?.escalation,
      // Immobilized (v0.0.174): its DC, 11 + the Modifier its origin used (13 without an origin or a Modifier). Forced Movement and Reposition read it.
      ...(statuses.includes("immobilized") ? { immobileDc: origin?.actorUuid && Number.isFinite(origin?.mod) ? 11 + origin.mod : TWOD12.baseDC } : {})
    } }
  }]))?.[0];
  if (made) await createLinked(actor, item, made, origin, d);
  if (made) await createRiders(actor, item, made, origin, d);
}

/** The conditions an Effect applies with it (its Conditions list, each with a value): they end with it. One the creature already has keeps the higher value. */
export async function createRiders(actor, item, parent, origin, duration) {
  for (const r of item.system.conditions ?? []) {
    const cond = r.uuid ? await fromUuid(r.uuid).catch(() => null) : null;
    if (!cond || cond.uuid === item.uuid) continue;
    // halfLevel (Squeezing, v0.0.170): the value is half the creature's level, rounded up, when the condition is applied.
    const value = r.valued ? (r.mode === "halfLevel" ? Math.max(1, Math.ceil((Number(actor.system?.level) || 1) / 2)) : Math.max(1, Number(r.value) || 1)) : undefined;
    const have = actor.effects.find(x => x.getFlag(F, "effectUuid") === cond.uuid);
    if (have) {
      const now = Number(have.getFlag(F, "value")) || 0;
      if (value !== undefined && r.mode === "increase") await setValued(have, now + value);   // "increase your value by N": this one does stack
      else if (value !== undefined && value > now) await setValued(have, value);                // the same condition again doesn't stack: the higher value
      continue;                                                                                // already there: no second copy
    }
    await createEffect(actor, cond, origin, { duration, ...(value !== undefined ? { value } : {}) }, { linkedTo: parent.id });
  }
}


/** The conditions an Effect brings with it (its "Also applies" list): created with it, flagged with its id, and ended with it. */
async function createLinked(actor, item, parent, origin, duration) {
  const names = String(item.system.linked ?? "").split(",").map(x => x.trim()).filter(Boolean);
  for (const name of names) {
    const linked = await conditionItem(name);
    if (!linked || linked.uuid === item.uuid) continue;
    const id = shortName(linked.name).trim().toLowerCase();
    if (actor.effects.some(x => shortName(x.name).trim().toLowerCase() === id || x.statuses?.has?.(id))) continue;   // already has it from somewhere else: don't double it
    await createEffect(actor, linked, origin, { duration }, { linkedTo: parent.id });
  }
}

/** Apply effect items to target tokens (through the GM when the user does not own the target). */
export async function applyEffects(effectUuids, targetUuids, origin, over = null) {
  const toActor = async uuid => { const d = await fromUuid(uuid); return d?.documentName === "Actor" ? d : d?.actor; };
  for (const eu of effectUuids) {
    const item = await fromUuid(eu);
    if (!item) continue;
    const targets = item.system.selfApplied ? (origin?.actorUuid ? [origin.actorUuid] : []) : targetUuids;
    for (const tu of targets) {
      const actor = await toActor(tu);
      if (!actor) continue;
      if (actor.isOwner) await createEffect(actor, item, origin, over);
      else game.socket.emit(SOCKET, { type: "applyEffects", effectUuids: [eu], targetUuids: [tu], origin, over });
    }
  }
}

const restored = new Set();
export const forgetRestored = id => restored.delete(id);
async function restoreLight(effect) {
  const b = effect.getFlag(F, "lightBackup");
  if (!Array.isArray(b) || restored.has(effect.id)) return;
  restored.add(effect.id);
  for (const v of b) {
    try {
      const td = await fromUuid(v.uuid);
      if (td) await td.update({ "light.bright": v.bright, "light.dim": v.dim, "light.color": v.color });
    } catch (err) { console.warn("twod12 | could not restore token light", v.uuid, err); }
  }
}

export function registerEffectHooks() {
  Hooks.on("renderTokenHUD", (app, html) => { try { valuedHud(app, html); } catch (e) { console.warn("twod12 | token HUD", e); } });
  // An effect that brought other conditions with it takes them away when it goes (removed by hand, from the HUD, or ended).
  Hooks.on("deleteActiveEffect", (fx, options, userId) => {
    try {
      if (userId !== game.user?.id || !fx.parent?.effects) return;
      const ids = fx.parent.effects.filter(x => x.getFlag?.(F, "linkedTo") === fx.id).map(x => x.id);
      if (ids.length) fx.parent.deleteEmbeddedDocuments("ActiveEffect", ids).catch(() => {});
    } catch (err) { console.warn("twod12 | linked conditions", err); }
  });
  // Drag an Effect item from the sidebar onto a token to apply it.
  Hooks.on("dropCanvasData", (cv, data) => {
    if (data?.type !== "Item" || !data.uuid) return;
    const item = fromUuidSync(data.uuid);
    if (item?.type !== "effect") return;
    const hits = canvas.tokens.placeables.filter(t => t.visible && t.bounds.contains(data.x, data.y));
    const token = hits[hits.length - 1];
    if (!token) return;
    const src = canvas.tokens.controlled[0]?.actor ?? game.user.character ?? token.actor;
    applyEffects([item.uuid], [token.document.uuid], originInfo(src.uuid)).then(() => ui.notifications.info(`${item.name} applied to ${token.name}.`));
    return false;
  });
  // Restore on the client that removes the effect; the GM also restores as a fallback.
  Hooks.on("preDeleteActiveEffect", effect => { restoreLight(effect); });
  Hooks.on("deleteActiveEffect", effect => { if (game.user.isActiveGM) restoreLight(effect); });
  // EoT ends with the affected creature's turn; Rounds count down at the end of the origin's turn.
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const ended = combat.combatants.get(prior?.combatantId);
    const actors = new Set();
    for (const c of combat.combatants) if (c.actor) actors.add(c.actor);
    for (const td of canvas.scene?.tokens ?? []) if (td.actor) actors.add(td.actor);
    for (const actor of actors) {
      for (const e of [...actor.effects]) {
        const dur = e.getFlag(F, "duration");
        if (!dur?.type) continue;
        const slot = e.getFlag(F, "slotInit");
        if (dur.type === "eot") {
          const hit = slot !== null && slot !== undefined ? ended?.initiative === slot : ended?.actor === actor;
          if (hit) await e.delete();
          continue;
        }
        const oslot = e.getFlag(F, "originSlot");
        const mine = oslot !== null && oslot !== undefined ? ended?.initiative === oslot : e.getFlag(F, "originCombatantId") === ended?.id;
        if (!ended || !mine) continue;
        if (e.getFlag(F, "appliedRound") === prior.round && e.getFlag(F, "appliedTurn") === prior.turn) continue;
        if (e.getFlag(F, "lastTick") === prior.round) continue;
        const rem = (e.getFlag(F, "remaining") ?? dur.rounds) - 1;
        if (rem <= 0) await e.delete(); else { await e.setFlag(F, "remaining", rem); await e.setFlag(F, "lastTick", prior.round); }
      }
    }
    // Kept template areas with a duration. They start when placed (reactions included):
    // "expire:eot" ends at the end of the origin's turn; otherwise the rounds count down at the end of the
    // turn that was current when the area was placed, skipping that first turn.
    for (const reg of [...(canvas.scene?.regions ?? [])]) {
      const dur = reg.getFlag(F, "duration");
      if (!dur?.type || !ended) continue;
      const isSlot = (slotKey, idKey) => { const sl = reg.getFlag(F, slotKey); return sl !== null && sl !== undefined ? ended.initiative === sl : reg.getFlag(F, idKey) === ended.id; };
      if (dur.expire === "eot") { if (isSlot("originSlot", "originCombatantId")) await reg.delete(); continue; }
      if (!isSlot("anchorSlot", "anchorCombatantId")) continue;
      if (reg.getFlag(F, "appliedRound") === prior.round && reg.getFlag(F, "appliedTurn") === prior.turn) continue;
      if (reg.getFlag(F, "lastTick") === prior.round) continue;
      const rem = (reg.getFlag(F, "remaining") ?? dur.rounds) - 1;
      if (rem <= 0) await reg.delete(); else { await reg.setFlag(F, "remaining", rem); await reg.setFlag(F, "lastTick", prior.round); }
    }
  });
}

/* Effects panel next to the sidebar: hover for info, click for details, right-click to remove. */
let panel;
function currentActor() {
  const t = canvas.tokens?.controlled ?? [];
  return t.length === 1 ? t[0].actor : (game.user.character ?? null);
}
function positionPanel() {
  const sb = document.getElementById("sidebar");
  if (!panel || !sb) return;
  const r = sb.getBoundingClientRect();
  panel.style.right = `${Math.max(8, window.innerWidth - r.left + 8)}px`;
  panel.style.top = `${Math.max(8, r.top + 8)}px`;
}
function renderPanel() {
  if (!panel) return;
  const actor = currentActor();
  panel.innerHTML = "";
  if (actor) {
    for (const e of actor.effects) {
      if (e.disabled) continue;
      const dur = durationText(e.getFlag(F, "duration"));
      const note = (e.getFlag(F, "notes") ?? []).map(n => n.text).filter(Boolean).join(" ");
      const el = document.createElement("div");
      el.className = "fx-icon";
      el.dataset.effectId = e.id;
      el.dataset.tooltip = esc(`${e.name}${dur ? ` (${dur})` : ""}${note ? `: ${note}` : ""}${isExhaustedFx(e) && actor.type === "character" ? " · Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove" : ""}`);
      el.innerHTML = `<img src="${e.img}" alt="">${isExhaustedFx(e) && actor.type === "character" && actor.system.exhausted > 0 ? `<span class="fx-val">${actor.system.exhausted}</span>` : ""}`;
      if (isValued(e)) {
        const v = Number(e.getFlag(F, "value")) || 1;
        el.innerHTML = `<img src="${e.img}" alt=""><span class="fx-val">${v}</span>`;
        el.dataset.tooltip = esc(`${baseNameOf(e)} ${v}${dur ? ` (${dur})` : ""} · Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove`);
      }
      panel.appendChild(el);
    }
  }
  positionPanel();
}
export function setupPanel() {
  panel = document.createElement("div");
  panel.id = "twod12-effects";
  document.body.appendChild(panel);
  for (const h of ["controlToken", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect", "canvasReady", "collapseSidebar", "renderSidebar"]) Hooks.on(h, () => renderPanel());
  window.addEventListener("resize", positionPanel);
  const sb = document.getElementById("sidebar");
  if (sb && window.ResizeObserver) new ResizeObserver(positionPanel).observe(sb);
  panel.addEventListener("contextmenu", async ev => {
    const el = ev.target.closest("[data-effect-id]");
    if (!el) return;
    ev.preventDefault();
    const actor = currentActor();
    if (!actor?.isOwner) return ui.notifications.warn("You can't remove effects from this character.");
    const fx = actor.effects.get(el.dataset.effectId);
    if (isExhaustedFx(fx) && actor.type === "character") return void (await bumpExhausted(actor, -1));   // a condition with a value: right-click is -1
    if (isValued(fx)) return void (await bumpValued(fx, -1));
    await fx?.delete();
  });
  panel.addEventListener("click", ev => {
    const el = ev.target.closest("[data-effect-id]");
    const actor = currentActor(), fx = el ? actor?.effects.get(el.dataset.effectId) : null;
    if (isExhaustedFx(fx) && actor.type === "character") { exhaustedClick(actor, fx, { shift: ev.shiftKey, ctrl: ev.ctrlKey || ev.metaKey }); return; }   // click: +1; Shift: settings; Ctrl: remove
    if (isValued(fx)) { valuedClick(fx, { shift: ev.shiftKey, ctrl: ev.ctrlKey || ev.metaKey }); return; }   // click: +1; Shift: settings; Ctrl: remove
    if (el) openEffectSheet(fx);
  });
  renderPanel();
  setTimeout(positionPanel, 500);
}


/**
 * A condition by name (hindered, immobilized, prone...): the Effect item with that name is applied (with the given duration instead of its own),
 * or, when there is no such item, just the status. dur: { type: "eot" } or { type: "rounds", rounds: N } or null.
 */
/** The Effect item (the world's, or the system's compendium) with a condition's name, or null. */
export async function conditionItem(cond) {
  const id = String(cond).trim().toLowerCase();
  let item = game.items.find(i => i.type === "effect" && shortName(i.name).trim().toLowerCase() === id);
  if (!item) {   // the system's Conditions compendium, then its Effects
    for (const key of ["twod12.conditions", "twod12.effects"]) {
      const pack = game.packs?.get(key);
      const entry = pack ? (await pack.getIndex()).find(x => shortName(x.name).trim().toLowerCase() === id) : null;
      item = entry ? await pack.getDocument(entry._id) : null;
      if (item) break;
    }
  }
  return item;
}

/** A condition with a value on a creature (Empowered 2): the value is kept on its effect. */
export const isValued = fx => !!fx && fx.getFlag?.(F, "value") != null && !isExhaustedFx(fx);
/** The condition's own name, without its value ("Enfeebled" for the effect "Enfeebled 2"). */
export const baseNameOf = fx => fx.getFlag?.(F, "baseName") ?? shortName(fx.name).replace(/\s+\d+\s*$/, "");
/**
 * Set the value of a condition: the effect is renamed with it ("Enfeebled 2"), which is what makes the floating text on the token work like Exhausted's
 * ("+ Enfeebled 2" floating up when it is raised, "\u2212 Enfeebled 1" sliding down when it is lowered, "\u2212 Enfeebled" when it goes).
 */
export async function setValued(fx, v) { await fx.update({ name: `${baseNameOf(fx)} ${v}`, [`flags.${F}.value`]: v }); }
/** Raise or lower the value; at 0 the condition goes. */
export async function bumpValued(fx, delta) {
  const v = (Number(fx.getFlag(F, "value")) || 0) + delta;
  if (v <= 0) await fx.delete(); else await setValued(fx, v);
}
function valuedClick(fx, { shift, ctrl }) {
  if (ctrl) return fx.delete();
  if (shift) return openEffectSheet(fx);
  return bumpValued(fx, 1);
}

/** The token HUD's condition grid: the tooltip of a condition with a value says its value and the clicks. (The clicks go through the status toggle, wrapped below.) */
export function valuedHud(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const actor = (app?.document ?? app?.object)?.actor;
  if (!root?.querySelectorAll || !actor) return 0;
  let n = 0;
  for (const el of root.querySelectorAll("[data-status-id]")) {
    const fx = actor.effects.find(x => x.statuses?.has?.(el.dataset.statusId) && isValued(x));
    if (!fx) continue;
    el.dataset.tooltip = `${baseNameOf(fx)} ${Number(fx.getFlag(F, "value")) || 1} · Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove`;
    n++;
  }
  return n;
}

export async function applyCondition(cond, actors, dur, origin) {
  const id = String(cond).trim().toLowerCase();
  const item = await conditionItem(id);
  for (const actor of actors) {
    if (item) {
      await applyEffects([item.uuid], [actor.uuid], origin, dur ? { duration: dur } : null);
    } else if (actor.isOwner) {
      await actor.toggleStatusEffect(id, { active: true });
    } else {
      game.socket.emit(SOCKET, { type: "applyCondition", cond: id, actorUuid: actor.uuid, dur, origin });
    }
  }
  return !!item;
}


/**
 * Foundry's condition grid (the Token HUD) makes a bare status: an icon with none of the system's rules. For a condition that has an Effect in the
 * system's compendium (Prone, Hindered, Immobilized, Leaning, Imperiled...), switching it ON from the HUD applies that Effect instead, so Prone brings
 * its Hindered and its boons and Hindered halves the Speed, like the buttons on cards do. Switching OFF, and every other status, is Foundry's own.
 */
export function wrapConditions(proto, deps = {}) {
  const inner = proto?.toggleStatusEffect;
  if (typeof inner !== "function" || inner.twod12Conditions) return false;
  const find = deps.find ?? conditionItem, apply = deps.apply ?? applyEffects;
  const wrapped = async function (statusId, options = {}) {
    if (statusId === "exhausted" || options?.twod12Raw) return inner.call(this, statusId, options);
    // A condition with a value that is already on (Empowered 2): a click is +1 (Shift: settings, Ctrl: remove) and a right-click (Foundry passes overlay: true) is -1, whatever `active` says.
    const valued = this.effects?.find?.(x => x.statuses?.has?.(statusId) && isValued(x));
    if (valued) {
      if (this.isOwner) { if (options?.overlay) await bumpValued(valued, -1); else await valuedClick(valued, heldModifiers()); }
      try { globalThis.canvas?.hud?.token?.render?.(); } catch (e) { /* no HUD open */ }
      return this.effects.find(x => x.statuses?.has?.(statusId)) ?? false;
    }
    const has = !!this.statuses?.has?.(statusId);
    const want = options?.active ?? !has;
    if (!want || has) return inner.call(this, statusId, options);          // switching off, or already on: Foundry's own
    const item = await find(statusId);
    if (!item) return inner.call(this, statusId, options);                 // no Effect with that name: just the status
    if (item.system?.valued && options?.overlay) return false;             // a right-click on a condition it doesn't have: nothing to lower
    await apply([item.uuid], [this.uuid], originInfo(this.uuid), item.system?.valued ? { value: 1 } : null);   // a condition with a value starts at 1
    return this.effects.find(x => x.statuses?.has?.(statusId)) ?? false;
  };
  wrapped.twod12Conditions = true;
  proto.toggleStatusEffect = wrapped;
  return true;
}

/**
 * World Effects with the same name as an Effect of the system's compendium. A condition applied from a card or the HUD uses the world's Effect first,
 * so an old copy keeps its old rules after the system is updated. Returns [{ name, uuid, differs: [fields that are not the same] }] and tells you.
 */
export async function shadowedEffects() {
  const packs = ["twod12.conditions", "twod12.effects"].map(k => game.packs?.get(k)).filter(Boolean);
  if (!packs.length) return [];
  const indexes = await Promise.all(packs.map(async p => [p, await p.getIndex()])), norm = v => JSON.stringify(v ?? ""), out = [];
  for (const w of game.items.filter(i => i.type === "effect")) {
    const same = x => shortName(x.name).trim().toLowerCase() === shortName(w.name).trim().toLowerCase();
    const hit = indexes.map(([p, idx]) => [p, idx.find(same)]).find(([p, entry]) => entry);
    if (!hit) continue;
    const c = await hit[0].getDocument(hit[1]._id);
    out.push({ name: w.name, uuid: w.uuid, differs: ["linked", "description", "duration", "settings", "selfApplied", "expireOn", "valued", "conditions", "isCondition"].filter(k => norm(w.system[k]) !== norm(c.system[k])) });
  }
  console.table(out.map(o => ({ name: o.name, uuid: o.uuid, differs: o.differs.join(", ") || "(same)" })));
  const old = out.filter(o => o.differs.length);
  ui.notifications.info(
    old.length
      ? `${old.length} world Effect${old.length === 1 ? " differs" : "s differ"} from the compendium and ${old.length === 1 ? "is" : "are"} used instead of it: ${old.map(o => `${o.name} (${o.differs.join(", ")})`).join("; ")}. Delete them, or edit them, to use the system's.`
      : out.length
        ? "The world's Effects with a compendium name are the same as the compendium's."
        : "No world Effect shadows the compendium."
  );
  return out;
}
