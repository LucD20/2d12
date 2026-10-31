// The mark (v0.0.161 as the Archer's Marked Quarry; v0.0.186 general): an Action with "Marks the target" (Mark Quarry) marks a creature
// (actor flag twod12.quarry = { uuid, name } of its token). Settings "only against my marked target" read it (automation.mjs): Marked Quarry's
// Boon and Tier 1 [Mod], Hunter's Focus. When the marked creature dies or goes Down the mark ends and the marker is told; at the start of an
// encounter every creature that uses a mark is reminded to choose one. The Archer's other cards are settings on their items (no code here).
import { usesMark } from "./automation.mjs";
import { sysLine, apText } from "./sysmsg.mjs";
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
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: archer }), whisper: game.users.filter(u => archer.testUserPermission?.(u, "OWNER")).map(u => u.id), content: sysLine("fa-crosshairs", `<b>${esc(archer.name)}</b>: your mark, <b>${esc(q.name)}</b>, went Down. Choose a new one: target a creature and use your marking Action (Mark Quarry, ${apText(0)}).`, "mark") });
    }
  });
  // An encounter starts: every creature that uses a mark is reminded to choose one.
  Hooks.on("combatStart", async combat => {
    if (!game.user.isActiveGM) return;
    for (const c of combat.combatants) {
      const a = c.actor;
      if (!a || !usesMark(a)) continue;
      if (quarryOf(a)) await a.unsetFlag(F, "quarry");
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: a }), whisper: game.users.filter(u => a.testUserPermission?.(u, "OWNER")).map(u => u.id), content: sysLine("fa-crosshairs", `<b>${esc(a.name)}</b>: choose a creature to mark. Target it and use your marking Action (Mark Quarry, ${apText(0)}).`, "mark") });
    }
  });
}
