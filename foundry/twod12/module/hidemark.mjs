// v0.0.515 (Lucas, 2026-11-25, the Hide indicator's mockup, foundry/mockups/hide-indicator: "A but with a catch: After 5 seconds, it goes away, you
// must select or hover the token again to show it"; "Whole party"): to whom a creature is Hidden or Unsensed from Hide (hide.mjs, the flag twod12.hide).
//   - v0.0.516 (Lucas: "remove the little pips/circles on the token"): no seals at rest.
//   - The hider selected or hovered: a line to each of those creatures (dotted for Unsensed, dashed for Hidden) and a plate under it with the word;
//     the lines show for 5 seconds (mapmark.mjs trackLines), then fade.
// Who sees it: everyone for a creature on the players' side (the whole party), the GM only for one on another side.
import * as MK from "./mapmark.mjs";
const F = "twod12", LINES = "twod12-hidelines";
const INK = 0xf0ece4;

/* ------------------------------------------------------------------ pure */
/** Who sees a creature's Hide marks: the GM always; everyone for a creature of the players' side (disposition 1). */
export const hideMarksVisible = (isGM, disposition) => !!isGM || Number(disposition) === 1;
/** The seals' order: Unsensed first, then Hidden, each by the observer's name. entries: [[id, state, name]]. */
export function sealOrder(entries = []) {
  const rank = s => (s === "unsensed" ? 0 : 1);
  return [...entries].filter(([, s]) => s === "unsensed" || s === "hidden").sort((a, b) => rank(a[1]) - rank(b[1]) || String(a[2] ?? "").localeCompare(String(b[2] ?? "")));
}
/** A line from one token's edge to the other's: its two ends. a, b: { x, y } centers; ra, rb: the radii to trim. */
export function trimmedLine(a, b, ra, rb) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  return { x1: a.x + ux * ra, y1: a.y + uy * ra, x2: b.x - ux * rb, y2: b.y - uy * rb, len: Math.max(0, d - ra - rb) };
}

/* ------------------------------------------------------------------ drawing */
function dashed(g, x1, y1, x2, y2, dash, gap, width, color, alpha = 1) {
  const len = Math.hypot(x2 - x1, y2 - y1); if (!len) return;
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  g.lineStyle(width, color, alpha);
  for (let s = 0; s < len; s += dash + gap) { const e = Math.min(len, s + dash); g.moveTo(x1 + ux * s, y1 + uy * s).lineTo(x1 + ux * e, y1 + uy * e); }
  g.lineStyle(0);
}
const nameOf = id => canvas.tokens?.get?.(id)?.name ?? "";
function entriesOf(token) {
  const map = token?.actor?.getFlag?.(F, "hide") ?? {};
  return sealOrder(Object.entries(map).map(([id, s]) => [id, s, nameOf(id)]).filter(([id]) => canvas.tokens?.get?.(id)));
}
const canSee = token => hideMarksVisible(game.user?.isGM, token?.document?.disposition);

let linesBox = null, focusId = "";
function clearLines() { try { linesBox?.destroy({ children: true }); } catch (e) { /* gone */ } linesBox = null; }
/** The lines from the focused hider (selected or hovered) to each creature it hides from, with their plates. */
function drawLines() {
  clearLines();
  const hider = focusId ? canvas.tokens?.get?.(focusId) : null;
  if (!hider || !canSee(hider)) return;
  const list = entriesOf(hider);
  if (!list.length) return;
  const gs = canvas.grid?.size ?? 100, box = new PIXI.Container();
  box.name = LINES; box.eventMode = "none";
  const g = new PIXI.Graphics(); box.addChild(g);
  const ctr = t => ({ x: t.center?.x ?? t.x + t.w / 2, y: t.center?.y ?? t.y + t.h / 2 }), rad = t => Math.max(t.w ?? gs, t.h ?? gs) / 2;
  for (const [id, state] of list) {
    const obs = canvas.tokens.get(id); if (!obs) continue;
    const L = trimmedLine(ctr(hider), ctr(obs), rad(hider) + 4, rad(obs) + 4);
    dashed(g, L.x1, L.y1, L.x2, L.y2, state === "hidden" ? gs * 0.12 : gs * 0.025, gs * 0.07, Math.max(2, gs * 0.025), INK, 0.9);
    const pl = MK.plate([state === "hidden" ? "Hidden" : "Unsensed"], { fs: Math.max(12, Math.round(gs * 0.15)) });
    const oc = ctr(obs); pl.position.set(oc.x, oc.y + rad(obs) + pl.height + 4);
    box.addChild(pl);
  }
  MK.addOnTop(box, MK.Z.FLANK);
  linesBox = box;
  MK.trackLines("hide", box);
}
const focus = token => { focusId = token?.id ?? ""; drawLines(); };
export function redrawHideMarks() { if (!canvas?.ready) return; if (focusId) drawLines(); }
export function registerHideMarks() {
  // v0.0.516 (Lucas on v0.0.515: "remove the little pips/circles on the token"): no seals at rest; only the lines on select or hover
  Hooks.on("canvasReady", () => { focusId = ""; clearLines(); redrawHideMarks(); });
  Hooks.on("canvasTearDown", () => { focusId = ""; clearLines(); });
  Hooks.on("controlToken", (t, on) => { if (on && t.actor?.getFlag?.(F, "hide")) { focus(t); MK.showLines(); } });
  Hooks.on("hoverToken", (t, on) => { if (on && t.actor?.getFlag?.(F, "hide")) { focus(t); MK.showLines(); } });
  // V14: an unset flag comes as a ForcedDeletion under its own key
  Hooks.on("updateActor", (actor, ch) => { const f = ch?.flags?.twod12; if (f && "hide" in f) redrawHideMarks(); });
  Hooks.on("updateToken", (doc, ch) => { if (focusId && ("x" in (ch ?? {}) || "y" in (ch ?? {}))) setTimeout(drawLines, 50); });
  Hooks.on("deleteToken", doc => { if (doc.id === focusId) { focusId = ""; clearLines(); } else redrawHideMarks(); });
}
