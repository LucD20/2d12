// v0.0.214 (pack L): the Line area and the squares of a straight line (book: Areas > Line, and Straight Line).
// Pure grid math (no canvas): x = column, y = row (down). One square per step along the segment's longer direction: at each step,
// the square whose center is nearest to the segment. A tie (the segment passes exactly between two squares) takes the side chosen
// once for the whole line: LEFT or RIGHT, seen from above looking from the origin toward the target.

/** The book's distance of a square at (major, minor) steps: major + floor(minor / 2) (the 1-2-1 count). */
export const lineCost = (dx, dy) => { const a = Math.abs(dx), b = Math.abs(dy); return Math.max(a, b) + Math.floor(Math.min(a, b) / 2); };

/** Is a square (relative to the origin) on the left of the segment toward (dx, dy)? Left when dx * p.y - dy * p.x < 0 (y down). */
export const isLeft = (dx, dy, p) => dx * p.y - dy * p.x < 0;

/**
 * The squares of a line from (0, 0) toward (dx, dy), steps 1..steps (relative to the origin): [{ x, y, tie, other }], where other is
 * the square passed over at a tie (the side not taken).
 */
export function lineWalk(dx, dy, steps, side = "left") {
  dx = Math.trunc(dx); dy = Math.trunc(dy);
  const ax = Math.abs(dx), ay = Math.abs(dy), maj = Math.max(ax, ay), mn = Math.min(ax, ay), out = [];
  if (!maj) return out;
  const xMajor = ax >= ay, sMaj = Math.sign(xMajor ? dx : dy) || 1, sMin = Math.sign(xMajor ? dy : dx) || 1;
  const at = (k, m) => (xMajor ? { x: sMaj * k, y: sMin * m } : { x: sMin * m, y: sMaj * k });
  for (let k = 1; k <= steps; k++) {
    const num = k * mn, q = Math.floor(num / maj), rem = num % maj;
    if (2 * rem !== maj) { out.push({ ...at(k, 2 * rem > maj ? q + 1 : q), tie: false }); continue; }
    const a = at(k, q), b = at(k, q + 1), aLeft = isLeft(dx, dy, a);
    const [take, other] = (side === "right") === aLeft ? [b, a] : [a, b];
    out.push({ ...take, tie: true, other });
  }
  return out;
}

/**
 * The squares of a Line with this value from the origin square toward the aimed square (absolute { x, y }), continuing past the aimed square
 * until the book's count would pass the value. Aiming at the origin: no squares. Returns [{ x, y, tie, other }] (other: absolute too).
 */
export function lineSquares(origin, target, value, side = "left") {
  const dx = target.x - origin.x, dy = target.y - origin.y, n = Math.max(0, Math.floor(Number(value) || 0));
  if (!dx && !dy) return [];
  const out = [];
  for (const c of lineWalk(dx, dy, 4 * n + 4, side)) {
    if (lineCost(c.x, c.y) > n) break;
    out.push({ x: origin.x + c.x, y: origin.y + c.y, tie: c.tie, ...(c.other ? { other: { x: origin.x + c.other.x, y: origin.y + c.other.y } } : {}) });
  }
  return out;
}

/** True when the Line (or straight movement) toward that square has a tie within its squares: only then does the side matter. */
export const lineHasTie = (origin, target, value) => lineSquares(origin, target, value, "left").some(c => c.tie);

/** The squares of a straight movement from one square to another (Straight Line: Charge, Forced Movement), the destination last; the start not included. */
export function lineSteps(from, to, side = "left") {
  const dx = to.x - from.x, dy = to.y - from.y;
  return lineWalk(dx, dy, Math.max(Math.abs(dx), Math.abs(dy)), side).map(c => ({ x: from.x + c.x, y: from.y + c.y, tie: c.tie, ...(c.other ? { other: { x: from.x + c.other.x, y: from.y + c.other.y } } : {}) }));
}

/** A Line stops at the first square it can't enter (a wall or a solid obstacle): blocked(prev, cell) -> true cuts the line there. prev starts at the origin. */
export function cutLine(cells, origin, blocked) {
  const out = [];
  let prev = origin;
  for (const c of cells) { if (blocked(prev, c)) break; out.push(c); prev = c; }
  return out;
}

/**
 * The square a larger creature starts its Line from: a square of its space on the side it aims toward (the one nearest to the aimed square;
 * equal: nearest to the exact aim point, when given). space: [{ x, y }]; aim: { x, y } (a square); point: { x, y } in squares (optional).
 */
export function lineStart(space, aim, point = null) {
  if (!space?.length) return null;
  const d = (c, p) => (c.x + 0.5 - p.x) ** 2 + (c.y + 0.5 - p.y) ** 2;
  const target = { x: aim.x + 0.5, y: aim.y + 0.5 };
  let best = space[0];
  for (const c of space.slice(1)) {
    const a = d(c, target), b = d(best, target);
    if (a < b - 1e-9 || (Math.abs(a - b) < 1e-9 && point && d(c, point) < d(best, point))) best = c;
  }
  return { x: best.x, y: best.y };
}

/** The Line's squares for a creature's space: the start square, then its squares (none inside its own space). */
export function lineFromSpace(space, aim, value, side = "left", point = null) {
  const start = lineStart(space, aim, point);
  if (!start) return { start: null, cells: [] };
  const own = new Set(space.map(c => `${c.x},${c.y}`));
  if (own.has(`${aim.x},${aim.y}`)) return { start, cells: [] };
  return { start, cells: lineSquares(start, aim, value, side).filter(c => !own.has(`${c.x},${c.y}`)) };
}

/** Does a creature reach into a Line's height? The Line is `height` squares high from the user's elevation (squares); a creature is as tall as it is wide. */
export const inLineHeight = (userElev, elev, tall = 1, height = 1) => elev < userElev + height - 1e-9 && elev + Math.max(1, tall) > userElev + 1e-9;
