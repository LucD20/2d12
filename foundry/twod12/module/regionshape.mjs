// Regions on whole squares (v0.0.178).
// 1. An area placed from a chat button is ONE region shape: the outline of its squares (a polygon), not a rectangle per row (v0.0.177 and before).
// 2. A Region drawn by hand is snapped to the grid when it is created (Foundry 14's drawing tool doesn't use the layer's snapping): a circle
//    becomes the book's area of that size, an N Emanation when its center is on a square or an N Burst when it is on a grid corner (N = the
//    radius rounded to a whole number of squares: draw "2" for a 2 Emanation); a rectangle and a polygon snap their points to grid corners.
//    A world setting ("Regions snap to whole squares", on by default) turns it off.
import { emanationCells, burstCells } from "./template.mjs";

const k = (i, j) => `${i},${j}`;

/**
 * The outline of a set of squares, as loops of grid corners ({ i: row, j: column } of the corner = the top-left of square i, j), clockwise,
 * with the corners in the middle of a straight side left out. One loop for an area in one piece without holes (an Emanation, a Burst).
 */
export function cellsOutline(cells) {
  const set = new Set(cells.map(c => k(c.i, c.j))), has = (i, j) => set.has(k(i, j));
  const next = new Map(), add = (a, b) => { const key = k(a.i, a.j); if (!next.has(key)) next.set(key, []); next.get(key).push(b); };
  for (const { i, j } of cells) {
    if (!has(i - 1, j)) add({ i, j }, { i, j: j + 1 });                    // top, left to right
    if (!has(i, j + 1)) add({ i, j: j + 1 }, { i: i + 1, j: j + 1 });      // right, downward
    if (!has(i + 1, j)) add({ i: i + 1, j: j + 1 }, { i: i + 1, j });      // bottom, right to left
    if (!has(i, j - 1)) add({ i: i + 1, j }, { i, j });                    // left, upward
  }
  const loops = [];
  while (next.size) {
    const [startKey, outs] = next.entries().next().value;
    const [si, sj] = startKey.split(",").map(Number), loop = [{ i: si, j: sj }];
    let cur = outs.shift(); if (!outs.length) next.delete(startKey);
    for (let guard = 0; guard < 100000 && k(cur.i, cur.j) !== startKey; guard++) {
      loop.push(cur);
      const list = next.get(k(cur.i, cur.j));
      if (!list?.length) break;
      const nx = list.shift(); if (!list.length) next.delete(k(cur.i, cur.j));
      cur = nx;
    }
    // Leave out the corners in the middle of a straight side.
    const n = loop.length, keep = loop.filter((p, idx) => { const a = loop[(idx - 1 + n) % n], b = loop[(idx + 1) % n]; return !((a.i === p.i && p.i === b.i) || (a.j === p.j && p.j === b.j)); });
    loops.push(keep);
  }
  return loops;
}

/** The region shapes of a set of squares: one polygon when the area is in one piece; a rectangle per row otherwise (as before). */
export function shapesForCells(cells, topLeft, size) {
  const loops = cellsOutline(cells);
  if (loops.length === 1) {
    const points = loops[0].flatMap(p => { const t = topLeft(p.i, p.j); return [t.x, t.y]; });
    return [{ type: "polygon", points, hole: false }];
  }
  const rows = new Map(), out = [];
  for (const c of cells) { if (!rows.has(c.i)) rows.set(c.i, []); rows.get(c.i).push(c.j); }
  for (const [i, js] of rows) {
    js.sort((a, b) => a - b);
    let start = js[0], prev = js[0];
    const flush = (a, b) => { const t = topLeft(i, a); out.push({ type: "rectangle", x: t.x, y: t.y, width: (b - a + 1) * size, height: size, rotation: 0, hole: false }); };
    for (let n = 1; n < js.length; n++) { if (js[n] === prev + 1) { prev = js[n]; continue; } flush(start, prev); start = prev = js[n]; }
    flush(start, prev);
  }
  return out;
}

/**
 * A drawn shape on whole squares. Circle -> the squares of an N Emanation (center on a square) or N Burst (center on a corner), N the radius rounded
 * (at least 1); rectangle -> its corners snapped to grid corners (at least one square); polygon -> each point snapped. Other shapes are kept.
 * Returns a list of shapes (a circle becomes one polygon).
 */
export function snapShape(shape, grid) {
  // grid: { size, vertex(p) -> the nearest grid corner, cellOf(p) -> { i, j }, center({ i, j }) -> point, topLeft(i, j) -> point, emanationCells, burstCells }
  const s = grid.size, snapV = p => grid.vertex(p);
  if (shape.type === "circle" || (shape.type === "ellipse" && Math.abs((shape.radiusX ?? 0) - (shape.radiusY ?? 0)) < 1)) {
    const r = shape.type === "circle" ? shape.radius : shape.radiusX, n = Math.max(1, Math.round(r / s));
    const cell = grid.cellOf(shape), corner = snapV(shape), center = grid.center(cell);
    const onCorner = Math.hypot(corner.x - shape.x, corner.y - shape.y) < Math.hypot(center.x - shape.x, center.y - shape.y);
    const cells = onCorner ? grid.burstCells(corner, n) : grid.emanationCells([cell], n);
    return shapesForCells(cells, grid.topLeft, s).map(x => ({ ...x, hole: !!shape.hole }));
  }
  if (shape.type === "rectangle" && !shape.rotation) {
    const a = snapV({ x: shape.x, y: shape.y }), b = snapV({ x: shape.x + shape.width, y: shape.y + shape.height });
    return [{ ...shape, x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.max(s, Math.abs(b.x - a.x)), height: Math.max(s, Math.abs(b.y - a.y)) }];
  }
  if (shape.type === "polygon" && Array.isArray(shape.points)) {
    const pts = [];
    for (let n = 0; n + 1 < shape.points.length; n += 2) { const p = snapV({ x: shape.points[n], y: shape.points[n + 1] }); pts.push(p.x, p.y); }
    return [{ ...shape, points: pts }];
  }
  return [shape];
}

/** The canvas's grid, for snapShape (square grids only). */
const canvasGrid = () => ({
  size: canvas.grid.size,
  vertex: p => canvas.grid.getSnappedPoint({ x: p.x, y: p.y }, { mode: CONST.GRID_SNAPPING_MODES.VERTEX }),
  cellOf: p => { const o = canvas.grid.getOffset({ x: p.x, y: p.y }); return { i: o.i, j: o.j }; },
  center: c => canvas.grid.getCenterPoint({ i: c.i, j: c.j }),
  topLeft: (i, j) => canvas.grid.getTopLeftPoint({ i, j }),
  emanationCells, burstCells
});

export function registerRegionSnap() {
  Hooks.on("preCreateRegion", (doc, data, options, userId) => {
    try {
      if (userId !== game.user.id || options?.twod12Area || !canvas.grid?.isSquare) return;
      if (!game.settings.get("twod12", "regionSnapCorners")) return;
      const shapes = (data.shapes ?? []).flatMap(sh => snapShape(sh, canvasGrid()));
      doc.updateSource({ shapes });
    } catch (e) { console.warn("twod12 | snapping a Region to the grid", e); }
  });
}
