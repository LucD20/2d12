// v0.0.302 (Lucas tested v0.0.301): "Show flanking", a toggle in the token controls. It draws how Flanking stands on the map right now (book, Ch. 3; the same
// test as the roll: flanking.mjs flankPicture): for every creature threatened by two or more enemies, a line from each flanker with the Field Boons it gets
// ("+2"), a dashed orange line from each creature that cancels one of them. (v0.0.350: no "+0" labels and no "threatens no one" notes.) Only for the user who turns it on; players see only the tokens they can see. It follows the tokens.
import { flankPicture } from "./flanking.mjs";
import * as MK from "./mapmark.mjs";

const NAME = "twod12-flank";
const SIDE = { 1: 0x2f7fd0, "-1": 0xd23b2f, 0: 0x9a9a9a, "-2": 0x7a4fc0 };   // friendly blue, hostile red, neutral grey, secret purple
const CANCEL = 0xf0a020;
let on = false, queued = false;

function clear() {
  MK.clearPlateSpots("flank");
  for (const l of [canvas?.interface, canvas?.controls, canvas?.stage].filter(Boolean)) {
    for (const c of [...(l.children ?? [])].filter(x => x.name === NAME)) { l.removeChild(c); c.destroy({ children: true }); }
  }
}
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
// STYLE-3 warm charcoal flat plate with crisp gold rule and zoom compensation.
const fsz = k => Math.round((canvas?.grid?.size ?? 100) * k);
function label(txt, fill, size = fsz(0.18), bgColor = MK.PLATE_BG, edge = MK.GOLD, accent = false) {
  const s3Bg = bgColor === 0x1b2433 ? MK.PLATE_BG : bgColor;
  const s3Edge = edge === 0xf0c040 ? MK.GOLD : edge;
  const s3Fill = fill === "#f0c040" ? "#d2a75a" : fill;
  const box = new PIXI.Container(), t = new PIXI.Text(txt, { fontFamily: MK.FONT, fontSize: size, fontWeight: "700", fill: s3Fill, align: "center" });
  t.anchor.set(0.5);
  const w = t.width + size * 0.85, h = t.height + size * 0.32, bg = new PIXI.Graphics();
  bg.lineStyle(1.5, s3Edge, 0.95).beginFill(s3Bg, 0.94).drawRect(-w / 2, -h / 2, w, h).endFill();
  if (accent) bg.lineStyle(0).beginFill(s3Edge, 1).drawRect(-w / 2, -h / 2, 3, h).endFill();
  box.addChild(bg, t);
  const z = Number(canvas?.stage?.scale?.x) || 1;
  box.scale.set(Math.max(0.35, Math.min(2.5, 1 / z)));
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

/** v0.0.350 (Lucas, playtest 4: "too cluttered; only first names"): a creature's first name ("Sylwen (Elf Archer...)" -> "Sylwen"). */
export { firstName } from "./util.mjs";   // v0.0.358: one rule everywhere (a name that starts with "The" keeps its next word)
import { firstName } from "./util.mjs";
/** The text over a flanked creature: "Flanked: Kai +2 · Nari +1" (v0.0.350: first names; a flanker whose Boons are all cancelled is left out). "" when none gives any. */
export function flankedText(row) {
  const live = row.flankers.filter(f => f.boons > 0);
  return live.length ? `Flanked: ${live.map(f => `${firstName(f.token.name)} +${f.boons}${f.cancels.length ? ` (−${f.cancels.length} ${f.cancels.map(c => firstName(c.name)).join(", ")})` : ""}`).join(" · ")}` : "";
}
/** v0.0.350: pure: a position for a label of size w × h that overlaps none placed so far (moved up, then down, by its height). placed: [{x, y, w, h}] (centers). */
export function freeSpot(placed, x, y, w, h) {
  const hits = (cx, cy) => placed.some(p => Math.abs(p.x - cx) < (p.w + w) / 2 + 2 && Math.abs(p.y - cy) < (p.h + h) / 2 + 2);
  for (let k = 0; k < 12; k++) { const cy = y + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (h + 3); if (!hits(x, cy)) { placed.push({ x, y: cy, w, h }); return { x, y: cy }; } }
  placed.push({ x, y, w, h });
  return { x, y };
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
  const FLANKED = MK.GOLD, placed = [];
  const put = (t, x, y) => {
    const w = t.width || 60, h = t.height || 20;
    const p = MK.claimPlateSpot("flank", x, y, w, h, { prefer: "up" });
    placed.push({ x: p.x, y: p.y, w, h });
    t.position.set(p.x, p.y);
    box.addChild(t);
  };
  const seen = new Set();
  for (const row of pic.flanked) {
    if (!visible(row.target) || seen.has(row.target.id)) continue;
    const live = row.flankers.filter(f => f.boons > 0 && visible(f.token));
    if (!live.length) continue;
    seen.add(row.target.id);
    ring(g, row.target, FLANKED, 6);   // the flanked creature gold, each flanker in its side's color, a canceller dashed orange
    for (const f of live) ring(g, f.token, SIDE[String(f.token.document?.disposition ?? 0)] ?? SIDE[0], 4);
    for (const f of live) {
      const e = ends(f.token, row.target), color = SIDE[String(f.token.document?.disposition ?? 0)] ?? SIDE[0];
      g.lineStyle(4, color, 0.95).moveTo(e.x1, e.y1).lineTo(e.x2, e.y2);
      const t = label(`+${f.boons}`, "#ece3cf", fsz(0.2));
      t.anchor.set(0.5); put(t, e.x1 + (e.x2 - e.x1) * 0.35, e.y1 + (e.y2 - e.y1) * 0.35);
      for (const c of f.cancels) {
        if (!visible(c)) continue;
        ring(g, c, CANCEL, 3, true);
        const k = ends(c, f.token);
        g.lineStyle(3, CANCEL, 0.95); dashed(g, k.x1, k.y1, k.x2, k.y2);
      }
    }
    const cc = centerOf(row.target), rr = (row.target.w ?? canvas.grid.size) * 0.58;
    const nm = label(firstName(row.target.name), "#f0c040", fsz(0.15), 0x1b2433, 0xf0c040);
    nm.anchor.set(0.5); nm.position.set(cc.x, cc.y - rr); box.addChild(nm);
    MK.claimPlateSpot("flank", cc.x, cc.y - rr, nm.width || 40, nm.height || 14, { prefer: "up" });
    placed.push({ x: cc.x, y: cc.y - rr, w: nm.width || 40, h: nm.height || 14 });
    const tt = label(flankedText(row), "#ece3cf", fsz(0.16), MK.PLATE_BG, MK.GOLD, true);
    tt.anchor.set(0.5); put(tt, cc.x, cc.y - rr - (nm.height || 14) - 4);
  }
  MK.addOnTop(box, MK.Z.FLANK);
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
  Hooks.on("canvasPan", redraw);   // v0.0.352: the zoom changed: the labels' size follows
  Hooks.on("canvasTearDown", () => { queued = false; MK.clearPlateSpots("flank"); });
}
