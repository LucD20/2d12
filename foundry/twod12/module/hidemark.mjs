// v0.0.515 (Lucas, 2026-11-25, the Hide indicator's mockup, foundry/mockups/hide-indicator: "A but with a catch: After 5 seconds, it goes away, you
// must select or hover the token again to show it"; "Whole party"): to whom a creature is Hidden or Unsensed from Hide (hide.mjs, the flag twod12.hide).
//   - At rest: a small seal on the hider's left edge for each creature it hides from (Judge's seals use the right edge): an empty dashed ring for
//     Unsensed, a half-filled disc for Hidden, in ink (a shape each, never a color alone).
//   - The hider selected or hovered: a line to each of those creatures (dotted for Unsensed, dashed for Hidden) and a plate under it with the word;
//     the lines show for 5 seconds (mapmark.mjs trackLines), then fade.
// Who sees it: everyone for a creature on the players' side (the whole party), the GM only for one on another side.
import * as MK from "./mapmark.mjs";
const F = "twod12", SEAL = "twod12-hideseal", LINES = "twod12-hidelines";
const INK = 0xf0ece4, DARK = 0x0b0b0d;

/* ------------------------------------------------------------------ pure */
/** Who sees a creature's Hide marks: the GM always; everyone for a creature of the players' side (disposition 1). */
export const hideMarksVisible = (isGM, disposition) => !!isGM || Number(disposition) === 1;
/** The seals' order: Unsensed first, then Hidden, each by the observer's name. entries: [[id, state, name]]. */
export function sealOrder(entries = []) {
  const rank = s => (s === "unsensed" ? 0 : 1);
  return [...entries].filter(([, s]) => s === "unsensed" || s === "hidden").sort((a, b) => rank(a[1]) - rank(b[1]) || String(a[2] ?? "").localeCompare(String(b[2] ?? "")));
}
/** The seals' places down the left edge of a token tokenW wide (mark.mjs markSealLayout's size, the other edge). */
export function hideSealLayout(count, tokenW = 100) {
  const r = Math.max(7, Math.min(11, tokenW * 0.09)), step = Math.round(r * 2.6);
  return Array.from({ length: Math.max(0, count) }, (_, k) => ({ x: r * 0.6, y: r * 1.1 + k * step, r }));
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
function sealGraphic(state, r) {
  const g = new PIXI.Graphics();
  g.beginFill(DARK, 0.9).drawCircle(0, 0, r + 2.5).endFill();
  if (state === "hidden") {
    g.lineStyle(Math.max(1.4, r * 0.18), INK, 1).drawCircle(0, 0, r).lineStyle(0);
    g.beginFill(INK, 1).moveTo(0, -r).arc(0, 0, r, -Math.PI / 2, Math.PI / 2, true).closePath().endFill();
  } else {
    const n = 10, w = Math.max(1.4, r * 0.18);
    g.lineStyle(w, INK, 1);
    for (let k = 0; k < n; k++) { const a0 = (k / n) * Math.PI * 2, a1 = a0 + (Math.PI * 2) / n / 2; g.moveTo(Math.cos(a0) * r, Math.sin(a0) * r).arc(0, 0, r, a0, a1); }
    g.lineStyle(0);
  }
  return g;
}
const nameOf = id => canvas.tokens?.get?.(id)?.name ?? "";
function entriesOf(token) {
  const map = token?.actor?.getFlag?.(F, "hide") ?? {};
  return sealOrder(Object.entries(map).map(([id, s]) => [id, s, nameOf(id)]).filter(([id]) => canvas.tokens?.get?.(id)));
}
const canSee = token => hideMarksVisible(game.user?.isGM, token?.document?.disposition);

/** The seals on one token (or none). */
function drawSeals(token) {
  if (!token || token.destroyed) return;
  token.children?.filter(c => c.name === SEAL).forEach(c => { token.removeChild(c); c.destroy({ children: true }); });
  if (!canSee(token)) return;
  const list = entriesOf(token);
  if (!list.length) return;
  const w = token.w ?? token.document.width * (canvas.grid?.size ?? 100), slots = hideSealLayout(list.length, w);
  list.forEach(([, state], k) => { const s = sealGraphic(state, slots[k].r); s.name = SEAL; s.eventMode = "none"; s.position.set(slots[k].x, slots[k].y); token.addChild(s); });
}
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
export function redrawHideMarks() { if (!canvas?.ready) return; for (const t of canvas.tokens?.placeables ?? []) drawSeals(t); if (focusId) drawLines(); }
export function registerHideMarks() {
  Hooks.on("refreshToken", t => drawSeals(t));
  Hooks.on("canvasReady", () => { focusId = ""; clearLines(); redrawHideMarks(); });
  Hooks.on("canvasTearDown", () => { focusId = ""; clearLines(); });
  Hooks.on("controlToken", (t, on) => { if (on && t.actor?.getFlag?.(F, "hide")) { focus(t); MK.showLines(); } });
  Hooks.on("hoverToken", (t, on) => { if (on && t.actor?.getFlag?.(F, "hide")) { focus(t); MK.showLines(); } });
  Hooks.on("updateActor", (actor, ch) => { const f = ch?.flags?.twod12; if (f && "hide" in f) redrawHideMarks();   // V14: an unset flag comes as a ForcedDeletion under its own key });
  Hooks.on("updateToken", (doc, ch) => { if (focusId && ("x" in (ch ?? {}) || "y" in (ch ?? {}))) setTimeout(drawLines, 50); });
  Hooks.on("deleteToken", doc => { if (doc.id === focusId) { focusId = ""; clearLines(); } else redrawHideMarks(); });
}
