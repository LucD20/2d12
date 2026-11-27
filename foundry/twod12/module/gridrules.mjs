// v0.0.366 (SIM-2, 2026-11-12; book, Chapter 3): the rules of the grid as pure functions for the automated playtest environment (book/ruler/sim),
// beside the pure ones the system already had: linearea.mjs (lineCost: a distance; lineSquares: a Line area) and corners.mjs (stepCorners: solid
// corners; straightCells: a straight line of squares). Nothing here reads Foundry. Squares are { x, y } with whole numbers; a square's center is
// (x + 0.5, y + 0.5). Test t247 checks them against the book's examples. The system's own Cover (cover.mjs) and area cells (template.mjs) still
// do this with the canvas; they can call these when those files are next touched (foundry-backlog "v0.0.366").
import { TWOD12 } from "./config.mjs";
import { lineCost } from "./linearea.mjs";

/** Squares between two squares: every second diagonal counts 2 (Ch. 3, Playing on the Grid). */
export const gridDistance = (a, b) => lineCost(b.x - a.x, b.y - a.y);
/** What one step of a movement costs (Ch. 3): 1, the second diagonal of the movement 2 (then 1, 2...); Difficult Terrain counts 1 more (v0.0.533,
 *  Lucas, 2026-11-27: 2 for a square, 3 for a second diagonal; it was double). */
export const stepCost = (diagonal, diagonalsBefore = 0, difficult = false) => (diagonal ? (diagonalsBefore % 2 ? 2 : 1) : 1) + (difficult ? 1 : 0);

/** Does the segment (ax, ay)-(bx, by) pass through the inside of the square at (sx, sy)? A line that only touches its edge or its corner doesn't. */
export function segmentHitsSquare(ax, ay, bx, by, sx, sy, inset = 0.02) {
  const x0 = sx + inset, x1 = sx + 1 - inset, y0 = sy + inset, y1 = sy + 1 - inset, dx = bx - ax, dy = by - ay;
  let t0 = 0, t1 = 1;
  for (const [p, q] of [[-dx, ax - x0], [dx, x1 - ax], [-dy, ay - y0], [dy, y1 - ay]]) {
    if (p === 0) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
  }
  return t1 > t0 + 1e-9;
}
/**
 * Line of Effect and Cover (Ch. 3): from the center of `from`'s square, a line to each of the four corners of `target`'s square; the number of
 * blocked corners is the cover (0 none, 1 Low, 2 Medium, 3 High, 4 no Line of Effect). blocks(ax, ay, bx, by): does something solid block that line?
 * The corners are taken a hair inside the target's square, so a wall along its edge doesn't block its own corner (as cover.mjs does).
 */
export function coverLevel(from, target, blocks, inset = 0.04) {
  const ox = from.x + 0.5, oy = from.y + 0.5;
  let n = 0;
  for (const [cx, cy] of [[inset, inset], [1 - inset, inset], [inset, 1 - inset], [1 - inset, 1 - inset]]) if (blocks(ox, oy, target.x + cx, target.y + cy)) n++;
  return n;
}
/** The squares of an Emanation N around a space (its squares): every square within N squares of one of them (a 2 Emanation around one square: 21). */
export function emanationSquares(space, n) {
  const cells = Array.isArray(space) ? space : [space], out = [];
  const xs = cells.map(c => c.x), ys = cells.map(c => c.y);
  for (let x = Math.min(...xs) - n; x <= Math.max(...xs) + n; x++) for (let y = Math.min(...ys) - n; y <= Math.max(...ys) + n; y++) if (cells.some(c => lineCost(x - c.x, y - c.y) <= n)) out.push({ x, y });
  return out;
}
/** The squares of a Burst N on a corner (the point where four squares meet: the corner at (x, y) is the lower corner of square (x, y)): every square whose center is within N squares of it in a straight line (1: 4 squares, 2: 12). */
export function burstSquares(corner, n) {
  const out = [], r = Math.ceil(n) + 1;
  for (let x = corner.x - r; x <= corner.x + r; x++) for (let y = corner.y - r; y <= corner.y + r; y++) if (Math.hypot(x + 0.5 - corner.x, y + 0.5 - corner.y) <= n + 1e-9) out.push({ x, y });
  return out;
}
/** Collision (Ch. 3): a creature that stops short takes damage for its unused squares: 2 each against an object, 1 each (to both) against a creature. */
export const collisionDamage = (unused, into = "wall") => Math.max(0, Math.trunc(Number(unused)) || 0) * (into === "creature" ? TWOD12.collision.creature : TWOD12.collision.wall);
