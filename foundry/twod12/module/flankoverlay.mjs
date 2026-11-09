// v0.0.302 (Lucas tested v0.0.301): "Show flanking", a toggle in the token controls. It draws how Flanking stands on the map right now (book, Ch. 3; the same
// test as the roll: flanking.mjs flankPicture): for every creature threatened by two or more enemies, a line from each flanker with the Field Boons it gets
// ("+2"; "+0" when its Boons are cancelled), a dashed orange line from each creature that cancels one of them, and a small note under each creature that
// threatens no one ("no Melee weapon in hand (Crossbow)"). Only for the user who turns it on; players see only the tokens they can see. It follows the tokens.
import { flankPicture } from "./flanking.mjs";

const NAME = "twod12-flank";
const SIDE = { 1: 0x2f7fd0, "-1": 0xd23b2f, 0: 0x9a9a9a, "-2": 0x7a4fc0 };   // friendly blue, hostile red, neutral grey, secret purple
const CANCEL = 0xf0a020;
let on = false, queued = false;

const layer = () => canvas?.controls ?? canvas?.interface ?? null;
function clear() { const l = layer(); for (const c of [...(l?.children ?? [])].filter(x => x.name === NAME)) { l.removeChild(c); c.destroy({ children: true }); } }
const centerOf = t => t.center ?? { x: (t.document?.x ?? 0) + (t.w ?? 100) / 2, y: (t.document?.y ?? 0) + (t.h ?? 100) / 2 };
const visible = t => game.user.isGM || t.visible !== false;

/** A line from a toward b that stops short of both tokens' centers (so the labels and the tokens stay readable). */
function ends(a, b, cut = 30) {
  const A = centerOf(a), B = centerOf(b), dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1, k = Math.min(cut, len / 3) / len;
  return { x1: A.x + dx * k, y1: A.y + dy * k, x2: B.x - dx * k, y2: B.y - dy * k };
}
function dashed(g, x1, y1, x2, y2, dash = 10, gap = 7) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  for (let s = 0; s < len; s += dash + gap) { const e = Math.min(len, s + dash); g.moveTo(x1 + ux * s, y1 + uy * s).lineTo(x1 + ux * e, y1 + uy * e); }
}
// v0.0.303 (Lucas: "a bit too small"): the text scales with the grid, on a dark pill like the Reactions overlay's labels
const fsz = k => Math.round((canvas?.grid?.size ?? 100) * k);
function label(txt, fill, size = fsz(0.24), bgColor = 0x1b2433) {
  const box = new PIXI.Container(), t = new PIXI.Text(txt, { fontFamily: "Signika, sans-serif", fontSize: size, fontWeight: "700", fill, stroke: "#111111", strokeThickness: 3 });
  t.anchor.set(0.5);
  const w = t.width + size * 0.8, h = t.height + size * 0.25, bg = new PIXI.Graphics();
  bg.lineStyle(2, 0xd9c9a3, 0.9).beginFill(bgColor, 0.85).drawRoundedRect(-w / 2, -h / 2, w, h, size * 0.35).endFill();
  box.addChild(bg, t);
  box.anchor = { set: (ax, ay = ax) => { box.pivot.set((ax - 0.5) * w, (ay - 0.5) * h); } };   // the same anchor calls as a Text
  return box;
}
/** A ring around a token (the Reactions overlay's outlines): solid, or dashed. */
function ring(g, tok, color, width = 4, dash = false) {
  const c = centerOf(tok), r = (tok.w ?? canvas.grid.size) * 0.58;
  g.lineStyle(width, color, 0.95);
  if (!dash) { g.drawCircle(c.x, c.y, r); return; }
  const n = 24;
  for (let i = 0; i < n; i += 2) { const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2; g.moveTo(c.x + r * Math.cos(a0), c.y + r * Math.sin(a0)).arc(c.x, c.y, r, a0, a1); }
}

/** The text over a flanked creature: "Flanked: Kai +2 · Nari +1 · Rin +0 (cancelled by Orc)". */
export function flankedText(row) {
  return `Flanked: ${row.flankers.map(f => `${f.token.name} +${f.boons}${f.cancels.length ? ` (${f.raw === 0 ? "cancelled" : `−${f.cancels.length}`} by ${f.cancels.map(c => c.name).join(", ")})` : ""}`).join(" · ")}`;
}

function draw() {
  queued = false;
  clear();
  if (!on || !canvas?.ready) return;
  const pic = flankPicture(canvas.tokens?.placeables ?? []);
  const box = new PIXI.Container();
  box.name = NAME; box.eventMode = "none";
  const g = new PIXI.Graphics();
  box.addChild(g);
  const FLANKED = 0xf0c040, IDLE = 0x9a9a9a;
  for (const row of pic.flanked) {
    if (!visible(row.target)) continue;
    ring(g, row.target, FLANKED, 6);   // v0.0.303 (Lucas): outlines: the flanked creature gold, each flanker in its side's color, a canceller dashed orange
    for (const f of row.flankers) if (visible(f.token)) ring(g, f.token, SIDE[String(f.token.document?.disposition ?? 0)] ?? SIDE[0], f.boons ? 4 : 2);
    for (const c of new Set(row.flankers.flatMap(f => f.cancels))) if (visible(c)) ring(g, c, CANCEL, 3, true);
    for (const f of row.flankers) {
      if (!visible(f.token)) continue;
      const e = ends(f.token, row.target), color = SIDE[String(f.token.document?.disposition ?? 0)] ?? SIDE[0];
      g.lineStyle(f.boons ? 4 : 2, color, f.boons ? 0.95 : 0.55).moveTo(e.x1, e.y1).lineTo(e.x2, e.y2);
      const t = label(`+${f.boons}`, f.boons ? "#ffffff" : "#c9c9c9", fsz(0.28));
      t.anchor.set(0.5); t.position.set(e.x1 + (e.x2 - e.x1) * 0.35, e.y1 + (e.y2 - e.y1) * 0.35);
      box.addChild(t);
      for (const c of f.cancels) {
        if (!visible(c)) continue;
        const k = ends(c, f.token);
        g.lineStyle(3, CANCEL, 0.95); dashed(g, k.x1, k.y1, k.x2, k.y2);
        const ct = label("−1", "#ffd27a", fsz(0.24), 0x4a2e00);
        ct.anchor.set(0.5); ct.position.set((k.x1 + k.x2) / 2, (k.y1 + k.y2) / 2);
        box.addChild(ct);
      }
    }
    const tt = label(flankedText(row), "#ffe3a3", fsz(0.22));
    tt.anchor.set(0.5, 1); tt.position.set(centerOf(row.target).x, (row.target.document?.y ?? 0) - 10);
    box.addChild(tt);
  }
  for (const x of pic.idle) {
    if (!visible(x.token)) continue;
    ring(g, x.token, IDLE, 2, true);
    const t = label(`threatens no one: ${x.why}`, "#e0e0e0", fsz(0.18));
    t.anchor.set(0.5, 0); t.position.set(centerOf(x.token).x, (x.token.document?.y ?? 0) + (x.token.h ?? canvas.grid.size) + 6);
    box.addChild(t);
  }
  layer()?.addChild(box);
}
const redraw = () => { if (!on || queued) return; queued = true; requestAnimationFrame(draw); };

export function toggleFlanking(v) {
  on = !!v;
  if (on) { if (!canvas?.grid?.isSquare) ui.notifications.warn("Flanking is drawn on square grids only."); draw(); }
  else clear();
  return on;
}
export const flankingShown = () => on;

export function registerFlankOverlay() {
  Hooks.on("refreshToken", redraw);
  for (const h of ["createToken", "updateToken", "deleteToken", "updateActor", "createItem", "updateItem", "deleteItem", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect", "sightRefresh"]) Hooks.on(h, redraw);
  Hooks.on("canvasReady", redraw);
  Hooks.on("canvasTearDown", () => { queued = false; });
}
