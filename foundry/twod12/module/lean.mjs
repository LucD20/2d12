// Leaning (Cover and the Leaning Basic Action): while you are Leaning you calculate cover from one of the corners of your space, and you see from it.
// While a token is Leaning, the four corners of its space are clickable on the map (only for whoever owns it). Choosing one nudges the token a
// little toward that corner, inside its own square, so Foundry's vision and targeting use it, and cover.mjs calculates cover from that corner
// (with none chosen: from the best corner, as before). The token's square for everything else (movement, Engaged, areas, [HT], light, auras)
// stays the square it is in: flags.twod12.lean = { corner, home: { x, y } } remembers it (homePos). The nudge is not a move (options.twod12Lean).
// It ends with the Leaning condition, when the token really moves, or when you click the chosen corner again (back to the best corner).
import { unset } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
const F = "twod12";
export const LEAN_NUDGE = 0.4;   // the fallback: toward the corner but still inside its own square (when walls don't allow more)
export const LEAN_OVER = 0.1;   // how far PAST the corner the viewpoint goes (in squares), so you can see around a wall that ends at the corner
export const CORNERS = { tl: [0, 0], tr: [1, 0], br: [1, 1], bl: [0, 1] };
export const CORNER_LABEL = { tl: "top-left", tr: "top-right", br: "bottom-right", bl: "bottom-left" };

/** The lean flag of a token document ({ corner, home }), or null. */
export const leanOf = doc => { try { return doc?.getFlag?.(F, "lean") ?? doc?.flags?.[F]?.lean ?? null; } catch (e) { return null; } };
/** Where the token really is: the top-left of its own square(s), whatever the nudge. */
export const homePos = doc => { const l = leanOf(doc); return l?.home ?? { x: doc?.x ?? 0, y: doc?.y ?? 0 }; };
/** A corner of a rectangle { x, y, w, h }. */
export function cornerPoint(rect, corner) { const [cx, cy] = CORNERS[corner] ?? [0, 0]; return { x: rect.x + cx * rect.w, y: rect.y + cy * rect.h }; }
/** The top-left a token takes to peek at `corner` from its home position (size = the grid size in pixels). */
export function nudgeTarget(home, corner, size, k = LEAN_NUDGE) { const [cx, cy] = CORNERS[corner] ?? [0, 0]; return { x: home.x + (cx ? 1 : -1) * k * size, y: home.y + (cy ? 1 : -1) * k * size }; }
/**
 * Where a token goes to peek at `corner` (rect = its home space { x, y, w, h }, size = the grid size): its center goes a little PAST the corner
 * (LEAN_OVER), so a wall that ends at the corner no longer hides what is around it. And, as in real life, you are also out in the open.
 * The way there is an L (out along one axis, then along the other) and must not cross a wall: that is what stops a token pressed against a long wall
 * from "leaning" through it. Tries past the corner, then the old nudge that stays inside the square. (Not exactly AT the corner: on a long wall that is a
 * point on the wall itself, where sight could leak through.)
 * blockedFn(a, b): is a wall between two points? (cover.wallBlocks). A big token moves at most 0.6 squares. Returns { x, y, mode } (the top-left).
 */
export function pickPeek(rect, corner, size, blockedFn) {
  const c = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 }, p = cornerPoint(rect, corner), [cx, cy] = CORNERS[corner] ?? [0, 0], cap = 0.6 * size;
  const clamp = v => Math.max(-cap, Math.min(cap, v));
  for (const over of [LEAN_OVER]) {
    const sx = clamp(p.x + (cx ? 1 : -1) * over * size - c.x), sy = clamp(p.y + (cy ? 1 : -1) * over * size - c.y);
    const v = { x: c.x + sx, y: c.y + sy };
    const free = legs => !blockedFn(legs[0], legs[1]) && !blockedFn(legs[1], legs[2]);
    if (free([c, { x: v.x, y: c.y }, v])) return { x: rect.x + sx, y: rect.y + sy, mode: "past", via: { x: rect.x + sx, y: rect.y } };   // across first, then up or down
    if (free([c, { x: c.x, y: v.y }, v])) return { x: rect.x + sx, y: rect.y + sy, mode: "past", via: { x: rect.x, y: rect.y + sy } };   // up or down first, then across
  }
  const t = nudgeTarget({ x: rect.x, y: rect.y }, corner, size);
  return { ...t, mode: "inside" };
}
/**
 * The way a token walks from where it leans now to where it will lean (top-left positions): back along its old L to the center of its square,
 * then out along the new L. Never a straight line between two peeks: that line can graze the end of a wall (Foundry refuses the move) or cross it.
 * cur: the lean flag now (or null), home: the top-left of its square, to: pickPeek's result (or null to go home).
 */
export function leanRoute(cur, home, to) {
  const pts = [];
  if (cur?.via) pts.push(cur.via);
  pts.push(home);
  if (to?.via) pts.push(to.via);
  if (to) pts.push({ x: to.x, y: to.y });
  return pts.filter((p, i) => i === 0 || Math.abs(p.x - pts[i - 1].x) > 0.5 || Math.abs(p.y - pts[i - 1].y) > 0.5);
}

/** Is this update or movement the lean nudge? (the argument can be the update options, a movement operation or a movement) */
export const isLeanMove = (...args) => args.some(a => a?.twod12Lean || a?.options?.twod12Lean || a?.operation?.twod12Lean);

const busy = new Map();
/** One lean at a time per token: a second click waits for the first to finish. */
function queue(doc, job) {
  const run = (busy.get(doc.id) ?? Promise.resolve()).then(job).catch(e => console.warn("twod12 | Leaning", e));
  busy.set(doc.id, run);
  return run;
}
/** Walk the token through the points (the steps jump; the last one is animated). `first` goes with the first step (the lean flag). */
async function walk(doc, pts, first = {}) {
  let extra = first;
  const steps = pts.filter(p => Math.abs(p.x - doc.x) > 0.5 || Math.abs(p.y - doc.y) > 0.5 || pts.indexOf(p) === pts.length - 1);
  for (const [i, p] of steps.entries()) {
    if (Math.abs(p.x - doc.x) <= 0.5 && Math.abs(p.y - doc.y) <= 0.5 && !Object.keys(extra).length) continue;
    await doc.update({ x: p.x, y: p.y, ...extra }, { twod12Lean: true, animate: i === steps.length - 1 });
    extra = {};
  }
  if (Object.keys(extra).length) await doc.update(extra, { twod12Lean: true });
}

/** Lean toward a corner (the same corner again: back to the center). */
export function leanTo(doc, corner) {
  if (!doc?.isOwner || !CORNERS[corner] || !canvas?.grid) return null;
  return queue(doc, async () => {
    const cur = leanOf(doc);
    if (cur?.corner === corner) return goHome(doc);
    const s = canvas.grid.size, home = cur?.home ?? { x: doc.x, y: doc.y };
    let blocked = () => false;
    try { blocked = (await import("./cover.mjs")).wallBlocks; } catch (e) { console.warn("twod12 | Leaning: walls", e); }
    const to = pickPeek({ x: home.x, y: home.y, w: doc.width * s, h: doc.height * s }, corner, s, blocked);
    await walk(doc, leanRoute(cur, home, to), { [`flags.${F}.lean`]: { corner, home, mode: to.mode, via: to.via ?? null } });
  });
}
/** Back to the home square (the way it came), forgetting the corner. */
async function goHome(doc) {
  const cur = leanOf(doc);
  if (!cur?.home) return;
  await walk(doc, leanRoute(cur, cur.home, null));
  await doc.update({ ...unset(`flags.${F}.lean`) }, { twod12Lean: true });
}
export function leanHome(doc) { return leanOf(doc)?.home ? queue(doc, () => goHome(doc)) : Promise.resolve(); }

let layer = null, queued = false;
const redraw = () => {
  if (queued) return;
  queued = true;
  queueMicrotask(() => { queued = false; try { drawCorners(); } catch (e) { console.warn("twod12 | Leaning corners", e); } });
};
function dot(g, r, color, alpha) {
  if (typeof g.beginFill === "function") { g.lineStyle(2, 0xffffff, 0.95); g.beginFill(color, alpha); g.drawCircle(0, 0, r); g.endFill(); }   // Pixi
  else { g.circle(0, 0, r); g.fill({ color, alpha }); g.stroke({ width: 2, color: 0xffffff, alpha: 0.95 }); }   // PixiJS 8
}
function drawCorners() {
  if (!canvas?.ready || !canvas.grid?.isSquare) return;
  if (!layer || layer.destroyed) { layer = new PIXI.Container(); (canvas.interface ?? canvas.stage).addChild(layer); }
  for (const c of layer.removeChildren()) c.destroy?.();
  const s = canvas.grid.size;
  for (const t of canvas.tokens?.controlled ?? []) {
    const d = t.document;
    if (!t.actor?.statuses?.has?.("leaning") || !d?.isOwner) continue;
    const home = homePos(d), w = d.width * s, h = d.height * s, cur = leanOf(d)?.corner;
    for (const [k, [cx, cy]] of Object.entries(CORNERS)) {
      const g = new PIXI.Graphics();
      dot(g, s * 0.11, cur === k ? 0xf3c9ee : 0xb05aa0, cur === k ? 0.95 : 0.75);
      g.position.set(home.x + cx * w, home.y + cy * h);
      g.eventMode = "static"; g.cursor = "pointer"; g.hitArea = new PIXI.Circle(0, 0, s * 0.2);
      g.on("pointerdown", ev => { ev.stopPropagation(); leanTo(d, k); });   // queued: a quick second click waits
      layer.addChild(g);
    }
  }
}

/** Tokens of an actor (a linked one on the scene, or the unlinked token itself). */
const docsOf = actor => (actor?.isToken ? [actor.token] : (actor?.getActiveTokens?.() ?? []).map(t => t.document)).filter(Boolean);

export function registerLeanHooks() {
  for (const h of ["controlToken", "refreshToken", "canvasReady", "createActiveEffect", "deleteActiveEffect", "updateToken"]) Hooks.on(h, redraw);
  Hooks.on("canvasTearDown", () => { layer = null; });
  Hooks.on("createActiveEffect", (effect, options, userId) => {
    const a = effect.parent;
    if (!effect.statuses?.has?.("leaning") || a?.documentName !== "Actor" || !a.isOwner || (game.user.isGM && userId !== game.user.id)) return;
    if (docsOf(a).length) ui.notifications.info("Leaning: click a corner of your square on the map to lean toward it.");
  });
  // Leaning ends: the token goes back to its square (done by the active GM, who can always do it).
  Hooks.on("deleteActiveEffect", async effect => {
    const a = effect.parent;
    if (!game.user.isActiveGM || !effect.statuses?.has?.("leaning") || a?.documentName !== "Actor" || a.statuses?.has?.("leaning")) return;
    for (const d of docsOf(a)) if (leanOf(d)) await leanHome(d).catch(e => console.warn("twod12 | Leaning ends", e));
  });
  // A real move ends the nudge (the token's flag goes in the same update); the nudge itself is not a move.
  Hooks.on("preUpdateToken", (doc, changes, options) => {
    if (isLeanMove(options) || !("x" in changes || "y" in changes) || !leanOf(doc)) return;
    changes.flags ??= {};
    Object.assign(changes.flags[F] ??= {}, unset("lean"));
  });
  // After a reload: a token still nudged whose creature is no longer Leaning goes back.
  Hooks.on("canvasReady", async () => {
    if (!game.user.isActiveGM) return;
    for (const d of canvas.scene?.tokens ?? []) if (leanOf(d) && !d.actor?.statuses?.has?.("leaning")) await leanHome(d).catch(() => {});
  });
}
