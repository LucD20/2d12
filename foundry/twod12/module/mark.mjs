// The mark (v0.0.161 as the Archer's Marked Quarry; v0.0.186 general; v0.0.207 the messages are settings): an Action with "Marks the target"
// (Mark Quarry) marks a creature (actor flag twod12.quarry = { uuid, name } of its token). Settings "only against the creature it marked" read it
// (automation.mjs). The mark ends when an encounter starts and when the marked creature dies or goes Down. What the marker is told then is
// not code: the "Chat message" settings of its items (Marked Quarry: "At the start of an encounter", "When the creature it marked goes Down").
import { postMessages } from "./automation.mjs";
import { sysLine } from "./sysmsg.mjs";
import { esc } from "./util.mjs";
const F = "twod12";
export const quarryOf = actor => actor?.getFlag?.(F, "quarry") ?? null;
const uuidOfToken = t => t?.document?.uuid ?? t?.uuid ?? "";

/** Mark a creature (a token) as this creature's marked target, or clear it (token null). */
export async function setQuarry(actor, token) {
  if (!token) { if (quarryOf(actor)) await actor.unsetFlag(F, "quarry"); return; }
  await actor.setFlag(F, "quarry", { uuid: uuidOfToken(token), name: token.name });
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(actor.name)}</b> marks <b>${esc(token.name)}</b>.`, "mark") });   // v0.0.204: the system line (sysmsg.mjs)
}

/** The creatures that could hold a mark: the world's actors and the unlinked tokens of the scene. */
const markers = () => game.actors.contents.concat((canvas?.scene?.tokens ?? []).filter(t => !t.actorLink).map(t => t.actor).filter(Boolean));
/** The token uuids that are marked by a creature this user owns (the GM sees every mark). */
function quarryMarks() {
  return new Set(markers().filter(a => game.user.isGM || a.isOwner).map(a => quarryOf(a)?.uuid).filter(Boolean));
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

export function registerMarkHooks() {
  // v0.0.162: a marked creature shows a crosshair on its token (for the marker's owners and the GM).
  Hooks.on("refreshToken", token => drawQuarryMark(token));
  Hooks.on("canvasReady", redrawQuarryMarks);
  Hooks.on("updateActor", (actor, change) => { const f = change?.flags?.twod12; if (f && ("quarry" in f || "-=quarry" in f)) redrawQuarryMarks(); });
  // The marked creature dies or goes Down: the mark ends, and the marker's "When the creature it marked goes Down" messages are posted (the active GM).
  Hooks.on("createActiveEffect", async effect => {
    if (!game.user.isActiveGM) return;
    if (!["dead", "unconscious", "desperate", "dying", "shattered"].some(s => effect.statuses?.has?.(s))) return;
    const a = effect.parent;
    if (a?.documentName !== "Actor") return;
    const uuids = new Set((a.isToken ? [a.token] : (a.getActiveTokens?.() ?? []).map(t => t.document)).filter(Boolean).map(d => d.uuid));
    for (const marker of markers()) {
      const q = quarryOf(marker);
      if (!q || !uuids.has(q.uuid)) continue;
      await marker.unsetFlag(F, "quarry");
      await postMessages(marker, "markDown", { mark: q.name });
    }
  });
  // An encounter starts: every mark ends, then each creature's "At the start of an encounter" messages are posted.
  Hooks.on("combatStart", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) {
      const a = c.actor;
      if (!a) continue;
      if (quarryOf(a)) await a.unsetFlag(F, "quarry");
      await postMessages(a, "encounter");
    }
  });
}
