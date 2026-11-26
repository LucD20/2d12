// v0.0.513 (the Hide package; Lucas, 2026-11-24, applied 2026-11-25; book, Chapter 3, Hiding; Chapter 6, Hide, Sneak, Seek, Point Out):
// Hidden or Unsensed FROM HIDE is kept for each creature on its own: the hider's actor flag twod12.hide = { <observer token id>: "hidden" | "unsensed" }.
// senses.mjs perceive() uses whichever is worse for the observer: what Hide gave, or what its senses give. Hide ends against a creature when it gains
// Sight of you without High Cover (Unsensed with High Cover: Hidden instead), when it finds you (Seek, Point Out), or after you use an Action that
// isn't [Subtle] (against every creature). Sneak keeps it during its movement (the flag twod12.sneaking).
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
import { tokenDistance } from "./light.mjs";
const F = "twod12";

/* ------------------------------------------------------------------ pure */
/** The Hide state of a hider against one observer: "unsensed", "hidden" or "" (none). map: the hider's flag. */
export const hideStateOf = (map, observerId) => { const v = map?.[observerId]; return v === "unsensed" || v === "hidden" ? v : ""; };
/** One step better for the observer (Seek, Point Out): Unsensed to Hidden, Hidden to nothing (its own senses again). */
export const stepBetter = state => (state === "unsensed" ? "hidden" : "");
const RANK = { unsensed: 0, hidden: 1, obscured: 2, clear: 3 };
/**
 * v0.0.525 (the cleanup audit, B2-030; book, Point Out: "perceives the target 1 step better: Unsensed becomes Hidden, whatever the reason; Hidden from
 * Hide goes back to what its own senses give. Never better than you perceive it"). Pure: hide, the ally's Hide state against the target; senses,
 * how its own senses perceive it (without Hide); mine, how you perceive it. Returns { hide (its new Hide state), floor (it perceives the target
 * as Hidden at least: Unsensed for another reason), changed }.
 */
export function pointOutStep({ hide = "", senses = "unsensed", mine = "clear" } = {}) {
  if (hide === "unsensed") return { hide: "hidden", floor: senses === "unsensed", changed: true };
  if (senses === "unsensed") return { hide, floor: true, changed: true };
  // Hidden from Hide: its own senses again, never better than you perceive it (you perceive it as Hidden: it stays Hidden)
  if (hide === "hidden" && (RANK[mine] ?? 3) > RANK.hidden) return { hide: "", floor: false, changed: true };
  return { hide, floor: false, changed: false };
}
/** Hide's result against one creature on a Tier: "unsensed" (it can't see you), "hidden" (your High Cover against it), "" (Tier 1, or neither). */
export function hideResult(tier, { seesYou = true, highCover = false } = {}) {
  if (!(Number(tier) >= 2)) return "";
  if (!seesYou) return "unsensed";
  return highCover ? "hidden" : "";
}
/**
 * What becomes of one Hide state when the observer's view changes (Chapter 3, Hiding, rule 1; Sneak). sees: the observer has Sight of you;
 * highCover: you have High Cover against it; sneaking: during Sneak's movement; turnEnd: the end of your turn (Sneak's last check).
 * Returns the new state ("" ends it against that creature).
 */
export function afterView(state, { sees = false, highCover = false, sneaking = false, turnEnd = false } = {}) {
  if (!state || !sees) return state;
  if (sneaking && !turnEnd) return "hidden";   // Sneak: an Unsensed creature that sees you makes you Hidden; a Hidden one keeps you Hidden during the movement
  if (state === "unsensed") return highCover ? "hidden" : "";
  return highCover ? "hidden" : "";
}
/** Without [Subtle], an Action ends Hide against every creature once it is resolved. */
export const endsHide = traits => !(traits?.has?.("subtle") || (Array.isArray(traits) && traits.includes("subtle")));

/* ------------------------------------------------------------------ Foundry */
const tokenOf = a => a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null;
export const hideMap = actor => foundry.utils.deepClone(actor?.getFlag?.(F, "hide") ?? {});
/** Does the observer see the hider (Sight, not another sense)? senses.mjs perceive without the Hide state. */
export async function seesBySight(observerTok, hiderTok) {
  const { perceive } = await import("./senses.mjs"), { coverBetween } = await import("./cover.mjs");
  const pv = perceive(observerTok, hiderTok, { loe: !coverBetween(observerTok, hiderTok)?.noLoE, noHide: true });
  return /^Sight/.test(String(pv.why ?? "")) && (pv.level === "clear" || pv.level === "obscured");
}
export async function highCoverAgainst(observerTok, hiderTok) {
  const { coverBetween } = await import("./cover.mjs");
  return (coverBetween(observerTok, hiderTok)?.level ?? 0) >= 3;
}
async function setHide(actor, map) {
  const clean = Object.fromEntries(Object.entries(map).filter(([, v]) => v));
  await actor.unsetFlag(F, "hide").catch(() => {});
  if (Object.keys(clean).length) await actor.setFlag(F, "hide", clean);
}
const nameOfToken = id => canvas.tokens?.get?.(id)?.name ?? "a creature";

/** Hide's results (actions.mjs): rows [{ uuid, name, tier }] against each targeted creature. */
export async function applyHide(actor, rows) {
  const me = tokenOf(actor); if (!me) return;
  const map = hideMap(actor), out = [];
  for (const r of rows) {
    let tok = null; try { const d = await fromUuid(r.uuid); tok = d?.object ?? null; } catch (e) { tok = null; }
    if (!tok) continue;
    const res = hideResult(r.tier, { seesYou: await seesBySight(tok, me), highCover: await highCoverAgainst(tok, me) });
    if (res) { map[tok.id] = res; out.push(`${res === "unsensed" ? "Unsensed" : "Hidden"} to <b>${esc(tok.name)}</b>${r.tier >= 3 ? " (it takes 1 Bane on Seek and Point Out against you, 1 round: by hand)" : ""}`); }
    else out.push(`no effect against <b>${esc(tok.name)}</b>`);
  }
  await setHide(actor, map);
  if (out.length) await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-user-secret", `<b>Hide</b>: ${esc(actor.name)} is ${out.join("; ")}.`, "fxm") });
}
/** The creatures Hidden or Unsensed to the seeker from Hide within N squares (Seek's targets). */
export function seekCandidates(seekerTok, squares) {
  return (canvas.tokens?.placeables ?? []).filter(t => t.actor && t.id !== seekerTok?.id && hideStateOf(t.actor.getFlag?.(F, "hide"), seekerTok?.id)
    && tokenDistance(seekerTok, t) <= squares);
}
/** v0.0.514: Hide's targets: each creature (not the hider, not Down) that can't see the hider, or against which the hider has High Cover (no Line of Effect needed). */
export async function hideCandidates(hiderTok) {
  const out = [];
  for (const t of canvas.tokens?.placeables ?? []) {
    if (!t.actor || t.id === hiderTok?.id || t.document?.hidden || t.actor.statuses?.has?.("dead")) continue;
    if (!(await seesBySight(t, hiderTok)) || await highCoverAgainst(t, hiderTok)) out.push(t);
  }
  return out;
}
/** Seek's and Point Out's results: each observer perceives each hider 1 step better. pairs: [{ hiderUuid, observerId }]. */
export async function improve(pairs, why) {
  const lines = [];
  for (const p of pairs) {
    let hider = null; try { const d = await fromUuid(p.hiderUuid); hider = d?.actor ?? d ?? null; } catch (e) { hider = null; }
    if (!hider?.getFlag) continue;
    const map = hideMap(hider), was = hideStateOf(map, p.observerId);
    if (!was) continue;
    map[p.observerId] = stepBetter(was);
    await setHide(hider, map);
    lines.push(`<b>${esc(nameOfToken(p.observerId))}</b> perceives <b>${esc(hider.name)}</b> ${map[p.observerId] ? "as Hidden (was Unsensed)" : "with its own senses again"}`);
  }
  if (lines.length) await ChatMessage.create({ content: sysLine("fa-eye", `<b>${esc(why)}</b>: ${lines.join("; ")}.`, "fxm") });
  return lines.length;
}
/**
 * v0.0.525 (B2-030): Point Out's result: each ally (observer) perceives the target 1 step better, whatever made it Unsensed (Hide, Darkness, a wall),
 * never better than the creature that pointed it out perceives it (pointOutStep). An Unsensed for another reason is kept on the target as
 * twod12.pointedOut = { <observer token id>: { x, y } } (senses.mjs perceive: Hidden at least, while it stays in that square).
 */
export async function pointOut(hiderUuid, observers, pointerTok, why) {
  let hider = null, hiderTok = null; try { const d = await fromUuid(hiderUuid); hider = d?.actor ?? d ?? null; hiderTok = d?.object ?? tokenOf(hider); } catch (e) { hider = null; }
  if (!hider?.getFlag || !hiderTok) return 0;
  const { perceive } = await import("./senses.mjs"), { coverBetween } = await import("./cover.mjs");
  const loe = (a, b) => !coverBetween(a, b)?.noLoE;
  const mine = pointerTok ? perceive(pointerTok, hiderTok, { loe: loe(pointerTok, hiderTok) }).level : "clear";
  const map = hideMap(hider), floors = foundry.utils.deepClone(hider.getFlag(F, "pointedOut") ?? {}), lines = [];
  for (const o of observers) {
    const r = pointOutStep({ hide: hideStateOf(map, o.id), senses: perceive(o, hiderTok, { loe: loe(o, hiderTok), noHide: true }).level, mine });
    if (!r.changed) continue;
    map[o.id] = r.hide;
    if (r.floor) floors[o.id] = { x: hiderTok.document?.x, y: hiderTok.document?.y };
    lines.push(`<b>${esc(o.name)}</b> perceives <b>${esc(hider.name)}</b> ${r.floor || r.hide ? "as Hidden (was Unsensed)" : "with its own senses again"}`);
  }
  if (!lines.length) return 0;
  await setHide(hider, map);
  await hider.setFlag(F, "pointedOut", floors);
  await ChatMessage.create({ content: sysLine("fa-eye", `<b>${esc(why)}</b>: ${lines.join("; ")}.`, "fxm") });
  return lines.length;
}
/** After an Action that isn't [Subtle]: Hide ends against every creature. */
export async function endHideAfterAction(actor, item) {
  if (!actor?.getFlag?.(F, "hide") || !endsHide(item?.system?.traits)) return;
  await actor.unsetFlag(F, "hide");
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-user-secret", `<b>${esc(actor.name)}</b>'s Hide ends: <b>${esc(item?.name ?? "an Action")}</b> isn't [Subtle].`, "fxm") });
}
/** Rule 1 (and Sneak): after a movement or at the end of the hider's turn, each observer that sees the hider ends or lowers its Hide state. */
export async function reviewHide(hiderActor, { turnEnd = false } = {}) {
  const map0 = hiderActor?.getFlag?.(F, "hide"); if (!map0 || !hiderActor.isOwner) return;
  const me = tokenOf(hiderActor); if (!me) return;
  const sneaking = !!game.combat?.combatants?.find?.(c => c.actor === hiderActor)?.getFlag?.(F, "sneaking");
  const map = hideMap(hiderActor), ended = [], dropped = [];
  for (const [id, state] of Object.entries(map)) {
    const obs = canvas.tokens?.get?.(id); if (!obs) continue;
    const next = afterView(state, { sees: await seesBySight(obs, me), highCover: await highCoverAgainst(obs, me), sneaking, turnEnd });
    if (next === state) continue;
    map[id] = next; (next ? dropped : ended).push(obs.name);
  }
  if (!ended.length && !dropped.length) return;
  await setHide(hiderActor, map);
  const parts = [ended.length ? `Hide ends against ${ended.map(esc).join(", ")} (it sees you without High Cover)` : "", dropped.length ? `Hidden (no longer Unsensed) to ${dropped.map(esc).join(", ")}` : ""].filter(Boolean);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: hiderActor }), content: sysLine("fa-user-secret", `<b>${esc(hiderActor.name)}</b>: ${parts.join("; ")}.`, "fxm") });
}
/** The hooks: a token's move reviews every hider (the observer or the hider moved); the end of a turn reviews its creature (Sneak's last check). */
export function registerHide() {
  let pending = null;
  const reviewAll = () => { clearTimeout(pending); pending = setTimeout(() => { for (const t of canvas.tokens?.placeables ?? []) if (t.actor?.getFlag?.(F, "hide") && t.actor.isOwner) reviewHide(t.actor).catch(e => console.warn("twod12 | Hide", e)); }, 300); };
  Hooks.on("updateToken", (doc, ch) => { if ("x" in (ch ?? {}) || "y" in (ch ?? {})) reviewAll(); });
  Hooks.on("combatTurnChange", (combat, prior) => {
    const was = combat?.combatants?.get?.(prior?.combatantId);
    if (!was?.actor) return;
    was.unsetFlag?.(F, "sneaking").catch(() => {});
    reviewHide(was.actor, { turnEnd: true }).catch(e => console.warn("twod12 | Hide", e));
  });
  Hooks.on("deleteCombat", combat => { for (const c of combat?.combatants ?? []) if (c.actor?.getFlag?.(F, "hide") && c.actor.isOwner) c.actor.unsetFlag(F, "hide").catch(() => {}); });
}

/* ------------------------------------------------------------------ v0.0.517: by hand (Lucas, 2026-11-25: the HUD's Hiding entry, the mockup
 * foundry/mockups/hide-hud, layout A; "default to all others": shown during the turn the creature used Hide or Sneak and while it hides from someone;
 * Add sets every targeted creature at once; a change posts a short chat line) */
/** Pure: the HUD's Hiding entry. map: the hider's flag; names: id -> name; targets: [{ id, name }] (the hider's user's targets); hidThisTurn. null when
 *  nothing is shown. rows: [{ id, name, state }] (Unsensed first); add: { ids, label } for the targets not listed, or null (then hint). */
export function hidingModel(map, { names = {}, targets = [], hidThisTurn = false, selfId = "" } = {}) {
  const rows = Object.entries(map ?? {}).filter(([, s]) => s === "hidden" || s === "unsensed").map(([id, state]) => ({ id, name: names[id] ?? "a creature", state }))
    .sort((a, b) => (a.state === b.state ? a.name.localeCompare(b.name) : a.state === "unsensed" ? -1 : 1));
  if (!rows.length && !hidThisTurn) return null;
  const listed = new Set(rows.map(r => r.id)), fresh = (targets ?? []).filter(t => t.id && t.id !== selfId && !listed.has(t.id));
  const add = fresh.length ? { ids: fresh.map(t => t.id), label: fresh.length === 1 ? fresh[0].name : `${fresh.length} creatures` } : null;
  return { rows, add };
}
/** Pure: Hidden and Unsensed flip (the state button). */
export const flipState = s => (s === "hidden" ? "unsensed" : "hidden");
const WORDS = { hidden: "Hidden", unsensed: "Unsensed" };
/** Set (or remove, state "") the hider's Hide state against some creatures by hand, with a chat line. */
export async function setHideByHand(actor, ids = [], state = "") {
  if (!actor?.isOwner || !ids.length) return;
  const map = hideMap(actor), names = [];
  for (const id of ids) { map[id] = state || ""; names.push(nameOfToken(id)); }
  await setHide(actor, map);
  const what = state ? `${WORDS[state]} to <b>${names.map(esc).join(", ")}</b>` : `no longer hiding from <b>${names.map(esc).join(", ")}</b>`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-user-secret", `<b>${esc(actor.name)}</b>: ${what} (set by hand).`, "fxm") });
}
/** The turn a creature used Hide or Sneak (the entry shows during it). */
export const turnStamp = () => (game.combat?.started ? `${game.combat.id}:${game.combat.round}:${game.combat.turn}` : "");
export async function markHidTurn(actor) { const s = turnStamp(); if (s && actor?.isOwner) await actor.setFlag(F, "hidTurn", s); }
