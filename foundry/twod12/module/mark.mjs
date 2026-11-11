// The mark (v0.0.161 as the Archer's Marked Quarry; v0.0.186 general; v0.0.207 the messages are settings): an Action with "Marks the target"
// (Mark Quarry) marks a creature (actor flag twod12.quarry = { uuid, name } of its token). Settings "only against the creature it marked" read it
// (automation.mjs). The mark ends when an encounter starts and when the marked creature dies or goes Down. What the marker is told then is
// not code: the "Chat message" settings of its items (Marked Quarry: "At the start of an encounter", "When the creature it marked goes Down").
import { postMessages } from "./automation.mjs";
const F = "twod12";
export const quarryOf = actor => actor?.getFlag?.(F, "quarry") ?? null;
const uuidOfToken = t => t?.document?.uuid ?? t?.uuid ?? "";

/** Mark a creature (a token) as this creature's marked target, or clear it (token null). */
export async function setQuarry(actor, token) {
  if (!token) { if (quarryOf(actor)) await actor.unsetFlag(F, "quarry"); return; }
  await actor.setFlag(F, "quarry", { uuid: uuidOfToken(token), name: token.name });
  // v0.0.343 (Lucas, playtest 4): no "X marks Y" line: the Action's card says it, and the mark shows on the map (its icon on the token)
}

/** The creatures that could hold a mark: the world's actors and the unlinked tokens of the scene. */
const markers = () => game.actors.contents.concat((canvas?.scene?.tokens ?? []).filter(t => !t.actorLink).map(t => t.actor).filter(Boolean));
/** The token uuids that are marked by a creature this user owns (the GM sees every mark): uuid -> the marker's image (v0.0.224). */
function quarryMarks() {
  const out = new Map();
  for (const a of markers().filter(x => game.user.isGM || x.isOwner)) {
    const q = quarryOf(a);
    if (q?.uuid) out.set(q.uuid, (a.isToken ? a.token?.texture?.src : a.getActiveTokens?.()[0]?.document?.texture?.src) || a.prototypeToken?.texture?.src || a.img || "");
  }
  return out;
}
/** Draws (or removes) the crosshair mark at the top right of a token. */
function drawQuarryMark(token, marks = quarryMarks()) {
  if (!token || token.destroyed) return;
  token.children?.filter(c => c.name === "twod12-quarry").forEach(c => { token.removeChild(c); c.destroy(); });
  if (!marks.has(token.document?.uuid)) return;
  const w = token.w ?? token.document.width * (canvas.grid?.size ?? 100), r = Math.max(10, w * 0.16);
  // v0.0.224 (Lucas, playtest 3): the marker's portrait in the red ring (who marked it), with the crosshair ticks around it.
  const box = new PIXI.Container();
  box.name = "twod12-quarry"; box.eventMode = "none"; box.position.set(w - r * 0.9, r * 0.9);
  const g = new PIXI.Graphics();
  g.beginFill(0xffffff, 0.9).drawCircle(0, 0, r).endFill();
  box.addChild(g);
  const src = marks.get(token.document?.uuid);
  if (src) {
    try {
      const sp = PIXI.Sprite.from(src); sp.anchor.set(0.5); sp.width = sp.height = r * 2;
      const mask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, r - 1).endFill();
      sp.mask = mask; box.addChild(mask, sp);
    } catch (e) { /* no image: the plain mark */ }
  }
  const ring = new PIXI.Graphics();
  ring.lineStyle(Math.max(2, r * 0.2), 0xb3261e, 1).drawCircle(0, 0, r);
  ring.moveTo(-r * 1.4, 0).lineTo(-r * 0.95, 0).moveTo(r * 0.95, 0).lineTo(r * 1.4, 0).moveTo(0, -r * 1.4).lineTo(0, -r * 0.95).moveTo(0, r * 0.95).lineTo(0, r * 1.4);
  if (!src) ring.beginFill(0xb3261e, 1).drawCircle(0, 0, r * 0.25).endFill();
  box.addChild(ring);
  token.addChild(box);
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
      // v0.0.243 (pack R): the class hook "the creature it marked goes Down" (Thrill of the Kill): once an encounter, +1 Escalation.
      try {
        const { escHooksOf } = await import("./states.mjs"), { raiseEscalation } = await import("./escalation.mjs");
        for (const h of escHooksOf(marker)) if (h.when === "markDown" && game.combat?.started) await raiseEscalation(marker, "hook", { label: `${h.source} (${q.name} goes Down)` });
      } catch (e) { console.warn("twod12 | Escalation hook (mark)", e); }
    }
  });
  // v0.0.224 (Lucas: the mark stayed after the combat): the combat ends (deleted): every mark of its creatures ends.
  Hooks.on("deleteCombat", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) { const a = c.actor; if (a && quarryOf(a)) await a.unsetFlag(F, "quarry"); }
    try { await (await import("./automation.mjs")).endEncounterEffects(combat); } catch (e) { console.warn("twod12 | encounter effects", e); }   // v0.0.323: "This encounter"
    redrawQuarryMarks();
  });
  // An encounter starts: every mark ends, then each creature's "At the start of an encounter" messages are posted.
  Hooks.on("combatStart", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) {
      const a = c.actor;
      if (!a) continue;
      if (quarryOf(a)) await a.unsetFlag(F, "quarry");
      await postMessages(a, "encounter");
      try { await (await import("./automation.mjs")).applyEncounterStartEffects(a); } catch (e) { console.warn("twod12 | encounter effects", e); }   // v0.0.323
    }
  });
}
