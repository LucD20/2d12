// Weapon Range & Threat Reach Rings overlay: a token-controls toggle that draws the selected token's
// Normal / Far / Max weapon range bands and Melee Threat Reach using 2d12's exact 1-2-1 grid distance
// (weaponrange.mjs + template.mjs emanationCells).
// Z-order: floor rings sit at MK.Z.RINGS (20), cleanly below tokens and LoE/Flanking/Area lines;
// target 3D range tags sit at MK.Z.RANGE_TAGS (8600) BELOW targeted tokens via MK.claimPlateSpot("range", ..., { prefer: "down" }),
// and yield to LoE plates when Line of Effect is already active so nothing overlaps or duplicates.
import { weaponRanges } from "./weaponrange.mjs";
import { tokenDistance, verticalSquares } from "./light.mjs";
import { tokenCells, emanationCells } from "./template.mjs";
import * as MK from "./mapmark.mjs";

const NAME_RINGS = "twod12-range-rings";
const NAME_TAGS = "twod12-range-tags";
const MAX_DRAW_SQ = 24;
const AMBER = 0xe5a93c, SKY = 0x7cc4f2;

let on = false, queued = false, loeActiveFn = null;

/** Let loe.mjs register its active-state check without a circular import. */
export function setLoEActiveCheck(fn) { loeActiveFn = fn; }

const parseNums = text => String(text ?? "").split("/").map(x => Number(String(x).trim())).filter(n => Number.isFinite(n) && n > 0);

/** Pure: collect the effective melee & ranged bands for an actor's wielded weapons (or Reach if unarmed). */
export function actorRangeProfile(actor) {
  const reach = Math.max(1, Number(actor?.system?.reach ?? actor?.system?.reachBase) || 1);
  const weapons = (actor?.itemTypes?.weapon ?? []).filter(w => w.system?.wielded && !w.system?.traits?.has?.("barehanded"));
  let meleeMax = 0, meleeLong = false, ranged = [], thrown = false;
  for (const w of weapons) {
    const r = weaponRanges(w, reach);
    const mNums = parseNums(r.melee), rNums = parseNums(r.ranged);
    if (mNums.length) {
      const top = mNums[mNums.length - 1];
      if (top > meleeMax) { meleeMax = top; meleeLong = !!r.long; }
      else if (top === meleeMax && !r.long) meleeLong = false;
    }
    if (rNums.length) {
      const top = rNums[rNums.length - 1];
      const curTop = ranged.length ? ranged[ranged.length - 1] : 0;
      if (top > curTop) { ranged = rNums; thrown = !!r.thrown; }
    }
  }
  if (!meleeMax && !ranged.length) meleeMax = reach;
  return { reach, meleeMax, meleeLong, ranged, thrown };
}

/** Pure: evaluate a 3D distance in squares against an actor's range profile -> { label, warn, band }. */
export function describeRangeBand(actor, dist) {
  const p = actorRangeProfile(actor);
  if (p.meleeLong && dist === 1) return { label: "Long · 1 Bane", warn: true, band: "dead" };
  if (p.meleeMax && dist <= p.meleeMax) return { label: "Melee Reach", warn: false, band: "melee" };
  if (p.ranged.length) {
    const [n, f, m] = p.ranged;
    const pre = p.thrown ? "Thrown " : "";
    if (n && dist <= n) return { label: `${pre}Normal`, warn: false, band: "norm" };
    if (f && dist <= f) return { label: `${pre}Far · 1 Bane`, warn: false, band: "far" };
    if (m && dist <= m) return { label: `${pre}Max · 2 Banes`, warn: true, band: "max" };
    return { label: "Out of range", warn: true, band: "out" };
  }
  return { label: "Out of reach", warn: true, band: "out" };
}

function clear() {
  MK.clearPlateSpots("range");
  for (const l of [canvas?.interface, canvas?.stage].filter(Boolean)) {
    for (const c of [...(l.children ?? [])].filter(x => x.name === NAME_RINGS || x.name === NAME_TAGS)) {
      l.removeChild(c);
      c.destroy({ children: true });
    }
  }
}

function drawPerimeter(g, cells, { color, width, alpha = 0.9, dash = 0, gap = 0, fill = null, fillAlpha = 0 } = {}) {
  const gs = canvas.grid.size;
  const set = new Set(cells.map(c => `${c.i},${c.j}`));
  const tl = (i, j) => canvas.grid.getTopLeftPoint({ i, j });
  if (fill !== null && fillAlpha > 0) {
    g.lineStyle(0);
    g.beginFill(fill, fillAlpha);
    for (const c of cells) { const p = tl(c.i, c.j); g.drawRect(p.x, p.y, gs, gs); }
    g.endFill();
  }
  const segs = [];
  for (const c of cells) {
    const p = tl(c.i, c.j);
    if (!set.has(`${c.i - 1},${c.j}`)) segs.push([{ x: p.x, y: p.y }, { x: p.x + gs, y: p.y }]);
    if (!set.has(`${c.i + 1},${c.j}`)) segs.push([{ x: p.x, y: p.y + gs }, { x: p.x + gs, y: p.y + gs }]);
    if (!set.has(`${c.i},${c.j - 1}`)) segs.push([{ x: p.x, y: p.y }, { x: p.x, y: p.y + gs }]);
    if (!set.has(`${c.i},${c.j + 1}`)) segs.push([{ x: p.x + gs, y: p.y }, { x: p.x + gs, y: p.y + gs }]);
  }
  if (dash > 0) {
    for (const [a, b] of segs) MK.dashLine(g, a, b, { dash, gap: gap || dash, color, alpha, width });
  } else {
    g.lineStyle(width, color, alpha);
    for (const [a, b] of segs) g.moveTo(a.x, a.y).lineTo(b.x, b.y);
  }
}

function hatchCells(g, cells, color, alpha = 0.55) {
  const gs = canvas.grid.size, n = 4;
  g.lineStyle(1.5, color, alpha);
  for (const c of cells) {
    const t = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j });
    for (let k = 1; k <= n * 2 - 1; k++) {
      const d = (k / (n * 2)) * 2 * gs;
      const ax = t.x + Math.max(0, d - gs), ay = t.y + Math.min(d, gs);
      const bx = t.x + Math.min(d, gs), by = t.y + Math.max(0, d - gs);
      g.moveTo(ax, ay).lineTo(bx, by);
    }
  }
}

function clipToScene(cells) {
  const r = canvas?.dimensions?.sceneRect;
  if (!r) return cells;
  const gs = canvas.grid.size;
  return cells.filter(c => {
    const p = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j });
    return p.x + gs > r.x && p.x < r.x + r.width && p.y + gs > r.y && p.y < r.y + r.height;
  });
}

function draw() {
  queued = false;
  clear();
  if (!on || !canvas?.ready || !canvas.grid?.isSquare) return;
  const controlled = (canvas.tokens?.controlled ?? []).filter(t => t.actor && (game.user.isGM || t.isOwner));
  if (controlled.length !== 1) return;
  const src = controlled[0];
  const prof = actorRangeProfile(src.actor);
  const origin = tokenCells(src);
  if (!origin.length) return;
  const ownSet = new Set(origin.map(c => `${c.i},${c.j}`));

  const rings = new PIXI.Container();
  rings.name = NAME_RINGS;
  rings.eventMode = "none";
  const g = new PIXI.Graphics();
  rings.addChild(g);

  const [rNorm, rFar, rMax] = prof.ranged;
  // Draw from outermost to innermost so inner lines stay crisp on top
  if (rMax && rMax <= MAX_DRAW_SQ) drawPerimeter(g, clipToScene(emanationCells(origin, rMax)), { color: MK.RED, width: 2, alpha: 0.72, dash: 4, gap: 6 });
  if (rFar && rFar <= MAX_DRAW_SQ) drawPerimeter(g, clipToScene(emanationCells(origin, rFar)), { color: AMBER, width: 2.2, alpha: 0.85, dash: 8, gap: 6 });
  if (rNorm && rNorm <= MAX_DRAW_SQ) drawPerimeter(g, clipToScene(emanationCells(origin, rNorm)), { color: MK.GOLD, width: 2.8, alpha: 0.92, fill: MK.GOLD, fillAlpha: 0.06 });

  if (prof.meleeMax && prof.meleeMax <= MAX_DRAW_SQ) {
    const mCells = clipToScene(emanationCells(origin, prof.meleeMax));
    const col = prof.ranged.length ? SKY : MK.GOLD;
    drawPerimeter(g, mCells, { color: col, width: 3, alpha: 0.95, fill: col, fillAlpha: prof.ranged.length ? 0.1 : 0.12 });
  }
  if (prof.meleeLong) {
    const dead = clipToScene(emanationCells(origin, 1)).filter(c => !ownSet.has(`${c.i},${c.j}`));
    drawPerimeter(g, dead, { color: MK.RED, width: 1.8, alpha: 0.85, dash: 5, gap: 4, fill: MK.RED, fillAlpha: 0.1 });
    hatchCells(g, dead, MK.RED, 0.45);
  }
  MK.addOnTop(rings, MK.Z.RINGS);

  // Target range tags: placed BELOW targeted tokens (MK.Z.RANGE_TAGS), and skipped if LoE overlay is already showing them!
  if (!loeActiveFn?.() && game.user?.targets?.size) {
    const tags = new PIXI.Container();
    tags.name = NAME_TAGS;
    tags.eventMode = "none";
    const gs = canvas.grid.size;
    const fs = Math.max(12, Math.round(gs * 0.15));
    for (const t of game.user.targets) {
      if (t.id === src.id || t.document?.parent !== canvas.scene) continue;
      const tot = tokenDistance(src, t), up = verticalSquares(src, t);
      const band = describeRangeBand(src.actor, tot);
      const line1 = `${tot} sq · ${band.label}`;
      const line2 = up > 0 ? `incl. ${up} sq height diff` : "";
      const pl = MK.plate(line2 ? [line1, line2] : [line1], { fs, color: band.warn ? MK.RED : MK.GOLD, warn: band.warn });
      const b = pl.getLocalBounds?.() ?? { width: 140, height: 28 };
      const sc = pl.scale?.x || 1;
      const w = b.width * sc, h = b.height * sc;
      const cx = t.center?.x ?? (t.x + (t.w ?? gs) / 2);
      const anchorY = (t.y ?? 0) + (t.h ?? gs) + h + 8;
      const pos = MK.claimPlateSpot("range", cx, anchorY - h / 2, w, h, { prefer: "down" });
      pl.position.set(pos.x, pos.y + h / 2);
      tags.addChild(pl);
    }
    if (tags.children.length) MK.addOnTop(tags, MK.Z.RANGE_TAGS);
  }
}

export const redrawRangeRings = () => { if (!on || queued) return; queued = true; requestAnimationFrame(draw); };
const redraw = redrawRangeRings;

export function toggleRangeRings(v) {
  on = !!v;
  if (on) {
    if (!canvas?.grid?.isSquare) { ui.notifications.warn("Weapon Range Rings are drawn on square grids only."); on = false; return false; }
    draw();
  } else clear();
  return on;
}
export const rangeRingsShown = () => on;

export function registerRangeOverlay() {
  for (const h of ["controlToken", "refreshToken", "updateToken", "deleteToken", "updateItem", "createItem", "deleteItem", "canvasReady", "canvasPan"]) Hooks.on(h, redraw);
  Hooks.on("targetToken", user => { if (user === game.user) redraw(); });
  Hooks.on("canvasTearDown", clear);
}
