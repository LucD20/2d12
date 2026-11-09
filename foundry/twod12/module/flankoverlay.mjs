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
const label = (txt, fill, size = 16) => new PIXI.Text(txt, { fontFamily: "Signika, sans-serif", fontSize: size, fontWeight: "700", fill, stroke: "#111111", strokeThickness: 4 });

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
  for (const row of pic.flanked) {
    if (!visible(row.target)) continue;
    for (const f of row.flankers) {
      if (!visible(f.token)) continue;
      const e = ends(f.token, row.target), color = SIDE[String(f.token.document?.disposition ?? 0)] ?? SIDE[0];
      g.lineStyle(f.boons ? 4 : 2, color, f.boons ? 0.95 : 0.55).moveTo(e.x1, e.y1).lineTo(e.x2, e.y2);
      const t = label(`+${f.boons}`, f.boons ? "#ffffff" : "#c9c9c9", 15);
      t.anchor.set(0.5); t.position.set(e.x1 + (e.x2 - e.x1) * 0.35, e.y1 + (e.y2 - e.y1) * 0.35);
      box.addChild(t);
      for (const c of f.cancels) {
        if (!visible(c)) continue;
        const k = ends(c, f.token);
        g.lineStyle(3, CANCEL, 0.95); dashed(g, k.x1, k.y1, k.x2, k.y2);
        const ct = label("−1", "#ffd27a", 14);
        ct.anchor.set(0.5); ct.position.set((k.x1 + k.x2) / 2, (k.y1 + k.y2) / 2);
        box.addChild(ct);
      }
    }
    const tt = label(flankedText(row), "#ffe3a3", 15);
    tt.anchor.set(0.5, 1); tt.position.set(centerOf(row.target).x, (row.target.document?.y ?? 0) - 6);
    box.addChild(tt);
  }
  for (const x of pic.idle) {
    if (!visible(x.token)) continue;
    const t = label(`threatens no one: ${x.why}`, "#d0d0d0", 12);
    t.anchor.set(0.5, 0); t.position.set(centerOf(x.token).x, (x.token.document?.y ?? 0) + (x.token.h ?? canvas.grid.size) + 2);
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
