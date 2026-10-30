// The Archer's automation (v0.0.161, Archer pass 3).
//   Marked Quarry: a creature you mark (actor flag twod12.quarry = { uuid, name } of its token). Your [Shot, Strike] Actions against it gain 1 boon.
//     Mark it with the Mark Quarry Action (0 AP when you have none: the start of an encounter, or it died or went Down; 1 AP [Focus] to change it,
//     once per turn). When it dies or goes Down, the mark ends and you are told to choose a new one.
//   Hunter's Focus (Daily): for the encounter, against your Marked Quarry, 1 boon and Empowered 1 (its damage reduction is not automated).
//   Marked Quarry (A1, v0.0.181): [B] [Mod] on a Tier 1 of those Actions. Sharpshooter (A1): [Shot] Actions skip the Bane for shooting into melee.
//   Long Draw: with a Projectile weapon, far range has no bane and maximum range 1 (one bane less).
//   Steady Nerves: while your Escalation is 2 or more, no banes for shooting while you are Engaged.
//   Killer's Focus: while your Escalation is 2 or more, your first [Ranged, Shot, Strike, Weapon] Action each turn-cycle deals an extra [B] 1d6 Pi.
//   Patient Hunter is not automated yet (it needs to know whether you left your square since your last turn).
import { turnCycleBlocked } from "./usage.mjs";
const F = "twod12";
export const hasFeature = (actor, name) => (actor?.itemTypes?.feature ?? []).some(f => f.name === name);
const escOf = actor => Number(actor?.system?.escalation) || 0;
export const quarryOf = actor => actor?.getFlag?.(F, "quarry") ?? null;
const uuidOfToken = t => t?.document?.uuid ?? t?.uuid ?? "";
export const isQuarry = (actor, token) => { const q = quarryOf(actor); return !!q && !!token && q.uuid === uuidOfToken(token); };
export const hunterFocus = actor => (actor?.effects ?? []).some(e => !e.disabled && /^Hunter's Focus/i.test(String(e.name ?? "")));

/** Mark a creature (a token) as this Archer's Marked Quarry, or clear it (token null). */
export async function setQuarry(actor, token) {
  if (!token) { if (quarryOf(actor)) await actor.unsetFlag(F, "quarry"); return; }
  await actor.setFlag(F, "quarry", { uuid: uuidOfToken(token), name: token.name });
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<div class="twod12 chat"><i class="fa-solid fa-crosshairs"></i> <b>${actor.name}</b> marks <b>${token.name}</b> as their Marked Quarry.</div>` });
}

/** The boons an Archer's roll gains against a target (they show in the roll dialog like the other modifiers). */
export function archerMods(actor, traits, targetToken) {
  const out = [];
  if (!targetToken || !isQuarry(actor, targetToken)) return out;
  if (hasFeature(actor, "Marked Quarry") && traits.has("shot") && traits.has("strike"))
    out.push({ id: "syn:quarry", name: `Marked Quarry (${targetToken.name})`, boons: 1, banes: 0, match: true, predicate: "Your [Shot, Strike] Actions against your Marked Quarry gain 1 Boon, and deal [B] [Mod] on a Tier 1" });
  if (hunterFocus(actor)) out.push({ id: "syn:hunter", name: "Hunter's Focus (1 Boon)", boons: 1, banes: 0, match: true, predicate: "Against your Marked Quarry: 1 boon and Empowered 1" });
  return out;
}
/** Hunter's Focus: Empowered 1 against the Marked Quarry (added to the roll's Empowered sources). */
export const hunterEmpowered = (actor, targetToken) => (hunterFocus(actor) && isQuarry(actor, targetToken) ? { name: "Hunter's Focus", n: 1 } : null);
/** Long Draw: one bane less for range with a Projectile weapon (far range 0, maximum range 1). */
export const longDraw = (actor, weapon) => hasFeature(actor, "Long Draw") && !!weapon?.system?.traits?.has?.("projectile");
/** Steady Nerves: no Engaged banes for shooting while your Escalation is 2 or more. */
export const steadyNerves = actor => hasFeature(actor, "Steady Nerves") && escOf(actor) >= 2;

/** Marked Quarry (A1, v0.0.181): a [Shot, Strike] Action against your Marked Quarry deals [B] [Mod] on a Tier 1 (a bonus like the effects' ones), or null. */
export function quarryTier1Bonus(actor, traits, token, mod) {
  const m = Number(mod) || 0;
  if (m <= 0 || !hasFeature(actor, "Marked Quarry") || !traits.has("shot") || !traits.has("strike") || !isQuarry(actor, token)) return null;
  return { effectId: "markedQuarry", effect: "Marked Quarry", dmg: String(m), pool: "B", sub: "", text: "", fxUuid: "" };
}
/** Sharpshooter (A1, v0.0.181): your [Shot] Actions don't take the Bane for targeting a creature Engaged with a creature other than you. */
export const sharpshooterShot = (actor, traits) => hasFeature(actor, "Sharpshooter") && traits.has("shot");

/** Killer's Focus: the extra damage of the first [Ranged, Shot, Strike, Weapon] Action of this turn-cycle (a bonus like the effects' ones), or null. */
export function killersFocusBonus(actor, traits) {
  if (!hasFeature(actor, "Killer's Focus") || escOf(actor) < 2 || !["ranged", "shot", "strike", "weapon"].every(t => traits.has(t))) return null;
  const c = game.combat, at = actor.getFlag?.(F, "killersFocus");
  if (c?.started) {
    const own = c.turns.findIndex(x => x.actor === actor || (actor.isToken && x.tokenId === actor.token?.id));
    if (turnCycleBlocked(c.round, c.turn, own, at)) return null;
  }
  return { effectId: "killersFocus", effect: "Killer's Focus", dmg: "1d6", pool: "B", sub: "Pi", text: "", fxUuid: "" };
}
export async function useKillersFocus(actor) {
  const c = game.combat;
  if (c?.started) await actor.setFlag(F, "killersFocus", [c.round, c.turn]);
}

/** The token uuids that are a Marked Quarry this user should see: of an Archer they own (the GM sees every mark). */
function quarryMarks() {
  const archers = game.actors.contents.concat((canvas?.scene?.tokens ?? []).filter(t => !t.actorLink).map(t => t.actor).filter(Boolean));
  return new Set(archers.filter(a => game.user.isGM || a.isOwner).map(a => quarryOf(a)?.uuid).filter(Boolean));
}
/** Draws (or removes) the crosshair mark at the top right of a token. */
function drawQuarryMark(token, marks = quarryMarks()) {
  if (!token || token.destroyed) return;
  token.children?.filter(c => c.name === "twod12-quarry").forEach(c => { token.removeChild(c); c.destroy(); });
  if (!marks.has(token.document?.uuid)) return;
  const w = token.w ?? token.document.width * (canvas.grid?.size ?? 100), r = Math.max(8, w * 0.13);
  const g = new PIXI.Graphics();
  g.name = "twod12-quarry";
  g.lineStyle(Math.max(2, r * 0.22), 0xb3261e, 1).beginFill(0xffffff, 0.85).drawCircle(0, 0, r).endFill();
  g.moveTo(-r * 1.35, 0).lineTo(r * 1.35, 0).moveTo(0, -r * 1.35).lineTo(0, r * 1.35);
  g.beginFill(0xb3261e, 1).drawCircle(0, 0, r * 0.25).endFill();
  g.position.set(w - r * 0.9, r * 0.9);
  g.eventMode = "none";
  token.addChild(g);
}
const redrawQuarryMarks = () => { if (!canvas?.ready) return; const m = quarryMarks(); for (const t of canvas.tokens?.placeables ?? []) drawQuarryMark(t, m); };

export function registerArcherHooks() {
  // v0.0.162: the Marked Quarry shows a crosshair on its token (for the Archer's owners and the GM).
  Hooks.on("refreshToken", token => drawQuarryMark(token));
  Hooks.on("canvasReady", redrawQuarryMarks);
  Hooks.on("updateActor", (actor, change) => { const f = change?.flags?.twod12; if (f && ("quarry" in f || "-=quarry" in f)) redrawQuarryMarks(); });
  // The Marked Quarry dies or goes Down: the mark ends, and its Archer is told (the active GM does it).
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    if (!["dead", "unconscious", "desperate", "dying", "shattered"].some(s => effect.statuses?.has?.(s))) return;
    const a = effect.parent;
    if (a?.documentName !== "Actor") return;
    const uuids = new Set((a.isToken ? [a.token] : (a.getActiveTokens?.() ?? []).map(t => t.document)).filter(Boolean).map(d => d.uuid));
    for (const archer of game.actors.contents.concat((canvas.scene?.tokens ?? []).filter(t => !t.actorLink).map(t => t.actor).filter(Boolean))) {
      const q = quarryOf(archer);
      if (!q || !uuids.has(q.uuid)) continue;
      await archer.unsetFlag(F, "quarry");
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: archer }), whisper: game.users.filter(u => archer.testUserPermission?.(u, "OWNER")).map(u => u.id), content: `<div class="twod12 chat"><i class="fa-solid fa-crosshairs"></i> <b>${archer.name}</b>: your Marked Quarry, ${q.name}, went Down. Choose a new one: target a creature and use <b>Mark Quarry</b> (0 AP).</div>` });
    }
  });
  // An encounter starts: Archers are reminded to choose their Marked Quarry.
  Hooks.on("combatStart", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) {
      const a = c.actor;
      if (!a || !hasFeature(a, "Marked Quarry")) continue;
      if (quarryOf(a)) await a.unsetFlag(F, "quarry");
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: a }), whisper: game.users.filter(u => a.testUserPermission?.(u, "OWNER")).map(u => u.id), content: `<div class="twod12 chat"><i class="fa-solid fa-crosshairs"></i> <b>${a.name}</b>: choose your Marked Quarry: target a creature and use <b>Mark Quarry</b> (0 AP).</div>` });
    }
  });
}
