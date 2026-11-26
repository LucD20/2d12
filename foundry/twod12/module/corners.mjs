// Corners and the straight line (v0.0.170, book Chapter 3 "Corners" and "Straight Line").
// Corners: a diagonal step goes through the corner point where four squares meet. Anything solid that reaches that point blocks it:
// a wall that ends at it or passes through it, a Tile flagged solid that covers it (a pillar on the corner, an object that fills a square beside the path).
// A small object in the middle of a square doesn't reach the point. Creatures aren't solid: a diagonal between two creatures is Difficult Terrain
// for your own movement, a Collision for Forced Movement, and nothing for Reposition.
const F = "twod12";
const k = c => `${c.i},${c.j}`;

/* ------------------------------------------------------------------ pure geometry (cells { i: row, j: column }) */
/** The corner point (as grid indices: the top-left corner of square { i, j }) a diagonal step from a to b goes through, or null for a straight step. */
export function cornerOf(a, b) {
  if (Math.abs(a.i - b.i) !== 1 || Math.abs(a.j - b.j) !== 1) return null;
  return { i: Math.max(a.i, b.i), j: Math.max(a.j, b.j) };
}

/** The two squares beside a diagonal step (the ones the corner touches that are not a or b). */
export const sideCells = (a, b) => [{ i: a.i, j: b.j }, { i: b.i, j: a.j }];

/**
 * What a step of a creature's whole space meets at the corners: "" (open), "solid" (a solid corner: the step is refused or stops),
 * or "creatures" (both squares beside it hold creatures). A creature that occupies several squares follows the rule with each square it occupies;
 * its own squares (before or after the step) never count as creatures beside it.
 *  - from, to: the top-left square of the space before and after the step; w, h: its size in squares
 *  - solidAt(corner): true when the corner point is solid; creatureAt(cell): the creature in that square (or null)
 * Returns { kind, creatures: [the creatures beside the step] }.
 */
export function stepCorners(from, to, { w = 1, h = 1, solidAt = () => false, creatureAt = () => null } = {}) {
  const di = to.i - from.i, dj = to.j - from.j;
  if (Math.abs(di) !== 1 || Math.abs(dj) !== 1) return { kind: "", creatures: [] };
  const own = new Set();
  for (let a = 0; a < h; a++) for (let b = 0; b < w; b++) { own.add(k({ i: from.i + a, j: from.j + b })); own.add(k({ i: to.i + a, j: to.j + b })); }
  let between = null;
  for (let a = 0; a < h; a++) for (let b = 0; b < w; b++) {
    const p = { i: from.i + a, j: from.j + b }, q = { i: p.i + di, j: p.j + dj };
    if (solidAt(cornerOf(p, q))) return { kind: "solid", creatures: [] };
    const sides = sideCells(p, q).filter(c => !own.has(k(c)));
    if (sides.length < 2) continue;   // a square of its own is beside this one: no corner to squeeze between
    const cs = sides.map(c => creatureAt(c));
    if (cs.every(Boolean) && cs[0] !== cs[1] && !between) between = cs;   // two different creatures (one creature's own two squares are its space)
  }
  return between ? { kind: "creatures", creatures: [...new Set(between)] } : { kind: "", creatures: [] };
}

/**
 * The squares of a straight line from the center of square a to the center of square b, one square per step (diagonals count as one step).
 * Where the line passes exactly between two squares (a tie) both are kept: the creature that moves chooses.
 * Returns [{ i, j, alt?: { i, j } }]: alt is the other square of a tie.
 */
export function straightCells(a, b) {
  const di = b.i - a.i, dj = b.j - a.j, n = Math.max(Math.abs(di), Math.abs(dj));
  const out = [{ i: a.i, j: a.j }];
  for (let s = 1; s <= n; s++) {
    const fi = a.i + (di * s) / n, fj = a.j + (dj * s) / n;
    const tie = v => Math.abs(v - Math.floor(v) - 0.5) < 1e-9;
    if (tie(fi) || tie(fj)) {
      const lo = tie(fi) ? { i: Math.floor(fi), j: Math.round(fj) } : { i: Math.round(fi), j: Math.floor(fj) };
      const hi = tie(fi) ? { i: Math.ceil(fi), j: Math.round(fj) } : { i: Math.round(fi), j: Math.ceil(fj) };
      out.push({ ...lo, alt: hi });
    } else out.push({ i: Math.round(fi), j: Math.round(fj) });
  }
  return out;
}

/**
 * One line from straightCells, choosing at each tie: a legal square (legal(prev, cell)) the mover's own path passed through (prefer),
 * else any legal one, else the preferred one, else the first. A mover always takes a legal square when there is one. Returns the cells (without alt).
 */
export function chooseLine(cells, { prefer = new Set(), legal = () => true } = {}) {
  const out = [];
  for (const c of cells) {
    if (!c.alt) { out.push({ i: c.i, j: c.j }); continue; }
    const opts = [{ i: c.i, j: c.j }, { i: c.alt.i, j: c.alt.j }], prev = out[out.length - 1];
    const ok = opts.filter(o => legal(prev, o));
    out.push(ok.find(o => prefer.has(k(o))) ?? ok[0] ?? opts.find(o => prefer.has(k(o))) ?? opts[0]);
  }
  return out;
}


/* ------------------------------------------------------------------ the canvas */
const onSegment = (p, x0, y0, x1, y1, tol) => {
  const vx = x1 - x0, vy = y1 - y0, len2 = vx * vx + vy * vy;
  const t = len2 ? Math.max(0, Math.min(1, ((p.x - x0) * vx + (p.y - y0) * vy) / len2)) : 0;
  return Math.hypot(x0 + t * vx - p.x, y0 + t * vy - p.y) <= tol;
};

/** True when a wall stops movement: it blocks movement and is not an open door. */
export function movementWall(doc) {
  if (!doc) return false;
  const none = globalThis.CONST?.WALL_MOVEMENT_TYPES?.NONE ?? 0, open = globalThis.CONST?.WALL_DOOR_STATES?.OPEN ?? 1;
  if ((doc.move ?? 1) === none) return false;
  return !(Number(doc.door) > 0 && doc.ds === open);
}

/** A Tile the GM marked solid (its Tile settings: "Solid", or game.twod12.solidTiles()): it blocks the corners it covers. */
export const solidTile = doc => !!doc?.getFlag?.(F, "solid");

/** True when anything solid reaches this corner point (grid indices): a wall that touches it, or a solid Tile that covers it. */
export function solidCorner(corner, { walls = null, tiles = null } = {}) {
  if (!corner || typeof globalThis.canvas?.grid?.getTopLeftPoint !== "function") return false;
  try {
    const p = canvas.grid.getTopLeftPoint({ i: corner.i, j: corner.j }), tol = 1.5;
    for (const w of walls ?? canvas.walls?.placeables ?? []) {
      const d = w.document ?? w, c = d.c;
      if (c?.length === 4 && movementWall(d) && onSegment(p, c[0], c[1], c[2], c[3], tol)) return true;
    }
    for (const t of tiles ?? canvas.tiles?.placeables ?? []) {
      const d = t.document ?? t;
      if (!solidTile(d)) continue;
      const x = d.x, y = d.y, wd = Math.abs(d.width ?? 0), ht = Math.abs(d.height ?? 0);
      if (p.x >= x - tol && p.x <= x + wd + tol && p.y >= y - tol && p.y <= y + ht + tol) return true;
    }
  } catch (e) { console.warn("twod12 | corners", e); }
  return false;
}

/** The creature (token) in a square, leaving out some tokens (the mover). Hidden tokens are left out, as for the rest of movement. */
export function creatureIn(cell, exclude = []) {
  const ids = new Set(exclude.map(t => t?.id ?? t?.document?.id ?? t).filter(Boolean));
  for (const t of globalThis.canvas?.tokens?.placeables ?? []) {
    if (ids.has(t.id) || !t.actor || t.document?.hidden) continue;
    const d = t.document, w = Math.max(1, Math.round(d.width ?? 1)), h = Math.max(1, Math.round(d.height ?? 1));
    const o = canvas.grid.getOffset({ x: d.x + 2, y: d.y + 2 });
    if (cell.i >= o.i && cell.i < o.i + h && cell.j >= o.j && cell.j < o.j + w) return t;
  }
  return null;
}

/** Mark the selected Tiles as solid (or not): they then block the corners they cover. */
export async function solidTiles(on = true) {
  const tiles = canvas.tiles?.controlled ?? [];
  if (!tiles.length) return ui.notifications.warn("Select one or more Tiles first (the Tiles layer).");
  for (const t of tiles) await t.document.setFlag(F, "solid", !!on);
  ui.notifications.info(`${tiles.length} Tile${tiles.length === 1 ? "" : "s"} ${on ? "now block" : "no longer block"} the corners they cover.`);
}

/** A "Solid" checkbox in the Tile settings window. */
export function tileConfigSolid(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const doc = app?.document;
  if (!root || !doc || root.querySelector("[name='flags.twod12.solid']")) return;
  const anchor = root.querySelector("[name='hidden']")?.closest(".form-group") ?? root.querySelector(".form-group");
  if (!anchor) return;
  const g = document.createElement("div");
  g.className = "form-group";
  g.innerHTML = `<label>Solid (2d12)</label><div class="form-fields"><input type="checkbox" name="flags.twod12.solid" ${solidTile(doc) ? "checked" : ""}></div><p class="hint">Movement can't cut a corner this Tile covers (a pillar, an object that fills a square).</p>`;
  anchor.after(g);
}
