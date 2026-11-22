// Line of Effect and Cover. From the center of the attacker's square, draw a line to each of the four corners of the target's space:
// the number of blocked corners is the cover (1 Low, 2 Medium, 3 High: that many banes), and 4 means no Line of Effect.
// A creature on the line to the target's center gives Low cover. A Large attacker uses its best square; a Large target uses its outer corners.

import { homePos, leanOf, pickPeek, CORNERS, CORNER_LABEL } from "./lean.mjs";

export const COVER_LABELS = ["No cover", "Low cover", "Medium cover", "High cover", "Total cover"];
const INSET = 0.04;
const WAY_INSET = 0.03;   // v0.0.350: a creature in the way: its square less a sliver, so a line that only touches it (an edge, a corner) doesn't count (book, Chapter 3; v0.0.477 counted a touch, v0.0.478 reverses it: Lucas, 2026-11-22)   // corners are pulled slightly inward, so a wall running along the target's edge doesn't block its own corner

/** Do walls that block sight or movement lie between two points? A line that only touches the end of a wall isn't blocked. */
export function wallBlocks(a, b) {
  // v0.0.476 (Lucas, checklist v0.0.475: "the pillar cant be targeted since it is surrounded by walls"): a placed solid object (the Ice Pillar,
  // objects.mjs) has walls for movement only; it blocks Line of Effect here, as its square: a line through it is blocked, a line that ends in it
  // (to the object itself, or from it) is not
  try {
    for (const t of canvas?.tokens?.placeables ?? []) {
      if (!solidPlaced(t)) continue;
      const r = inset(rectOf(t), 0.01);
      if (inRect(a, r) || inRect(b, r)) continue;
      if (segmentHitsRect(a, b, r)) return true;
    }
  } catch (e) { /* no map */ }
  for (const type of ["sight", "move"]) {
    try {
      const back = CONFIG.Canvas?.polygonBackends?.[type];
      if (back?.testCollision && back.testCollision(a, b, { type, mode: "any" })) return true;
    } catch (e) { /* try the next type */ }
  }
  return false;
}

const rectOf = t => { const s = canvas.grid.size, d = t.document, h = homePos(d); return { x: h.x, y: h.y, w: d.width * s, h: d.height * s }; };   // a Leaning token is nudged: its own square counts (lean.mjs)
const centerOf = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
/** The core rework D5 (book, Chapter 3): a Prone or dead creature gives no cover (it lies too low to be in the way). */
export const liesLow = t => { const st = t?.actor?.statuses; return !!(st?.has?.("prone") || st?.has?.("dead") || t?.document?.hasStatusEffect?.("dead")); };
const inset = (r, f) => { const e = f * canvas.grid.size; return { x: r.x + e, y: r.y + e, w: Math.max(1, r.w - 2 * e), h: Math.max(1, r.h - 2 * e) }; };
const cornersOf = r => [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y }, { x: r.x + r.w, y: r.y + r.h }, { x: r.x, y: r.y + r.h }];

/** The centers of the squares a token occupies (the possible starting squares of a Large attacker). */
export function squareCenters(r) {
  const s = canvas.grid.size, out = [];
  for (let j = 0; j < Math.max(1, Math.round(r.h / s)); j++) for (let i = 0; i < Math.max(1, Math.round(r.w / s)); i++) out.push({ x: r.x + i * s + s / 2, y: r.y + j * s + s / 2 });
  return out;
}

/** Does the segment a-b cross the rectangle? (Liang-Barsky) */
export function segmentHitsRect(a, b, r) {
  let t0 = 0, t1 = 1;
  const dx = b.x - a.x, dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy], q = [a.x - r.x, r.x + r.w - a.x, a.y - r.y, r.y + r.h - a.y];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return false; continue; }
    const t = q[i] / p[i];
    if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
  }
  return t1 >= t0;
}

/**
 * Cover of `target` against `attacker` (tokens). Returns { blocked, level, banes, noLoE, inWay, label } or null on a grid that isn't square.
 * `blockedFn(a, b)` can replace the wall test (used by the tests).
 */
/** v0.0.411: does the attacker have Clear Lines working (its allies give its targets no Cover)? (hooks.mjs, read lazily: no import cycle) */
let hooksMod = null;
import("./hooks.mjs").then(m => { hooksMod = m; }).catch(() => {});
const clearLinesOf = tok => { try { return !!hooksMod && hooksMod.activeHooks(tok?.actor, "clearLines").length > 0; } catch (e) { return false; } };
// pack TALENTS-PT: a placed solid object (objects.mjs)
const solidPlaced = t => !!(t?.document?.flags?.twod12?.placed && t?.actor?.getFlag?.("twod12", "object")?.solid);
const inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
export function coverBetween(attacker, target, { blockedFn: bf = wallBlocks, others = null } = {}) {
  if (!attacker || !target || !canvas?.grid?.isSquare) return null;
  const ar = rectOf(attacker), tr = rectOf(target);
  const blockedFn = bf;
  const targetCorners = cornersOf(inset(tr, INSET));
  // Leaning: you calculate cover from your corner instead of the center of your square. v0.0.166: from the SAME point vision uses (lean.mjs pickPeek:
  // just past the corner, or nudged inside the square when walls don't allow it), so a wall that ends at the corner doesn't block every line.
  const leaning = !!attacker.actor?.statuses?.has?.("leaning");
  const chosen = leaning ? (leanOf(attacker.document)?.corner ?? "") : "";   // the corner picked on the map, if any
  const peek = k => { const p = pickPeek(ar, k, canvas.grid.size, blockedFn); return { x: p.x + ar.w / 2, y: p.y + ar.h / 2 }; };
  const origins = leaning ? (chosen ? [peek(chosen)] : Object.keys(CORNERS).map(peek)) : squareCenters(ar);
  let best = null;
  for (const origin of origins) {
    const blocked = targetCorners.filter(c => blockedFn(origin, c)).length;
    if (!best || blocked < best.blocked) best = { blocked, origin };
  }
  const tc = centerOf(tr);
  // v0.0.411 (pack F3, Clear Lines: hooks.mjs clearLines): the attacker's allies give its targets no Cover
  const clear = clearLinesOf(attacker), mine = Number(attacker.document?.disposition ?? 0);
  const crowd = others ?? (canvas.tokens?.placeables ?? []).filter(t => t.id !== attacker.id && t.id !== target.id && !t.document.hidden && !liesLow(t) && !(clear && mine && Number(t.document.disposition) === mine));
  // v0.0.350 (Lucas, playtest 4: "show center-to-center cover too; I think it isn't calculating it correctly"): a creature whose square the center
  // line crosses is in the way (book: "on the line"); a line along an edge or through a corner point doesn't count (only a sliver is left out)
  const blockers = best.blocked < 4 ? crowd.filter(t => segmentHitsRect(best.origin, tc, inset(rectOf(t), WAY_INSET))) : [];
  const inWay = blockers.length > 0;
  let level = Math.min(4, Math.max(best.blocked, inWay ? 1 : 0));
  // A target that is Leaning is exposed: its cover is reduced by 1 level (Total -> High -> Medium -> Low -> none).
  const exposed = !!target.actor?.statuses?.has?.("leaning") && level >= 1;   // Total cover becomes High: a creature Leaning out of it can be targeted
  if (exposed) level -= 1;
  // origin and corners: the lines the cover was counted with (the Line of Effect button draws them, v0.0.165).
  const corners = targetCorners.map(c => ({ x: c.x, y: c.y, blocked: !!blockedFn(best.origin, c) }));
  return { blocked: best.blocked, level, banes: level >= 4 ? 0 : level, noLoE: level >= 4, inWay, leaning, leanCorner: chosen, exposed, label: COVER_LABELS[level], origin: best.origin, corners, center: tc, blockers: blockers.map(t => ({ id: t.id, name: t.name })) };
}

/**
 * Cover of `target` from a Point of Origin (an area effect): a straight line from the point to each corner of the target's space, as for an attacker, but from a point:
 * the center of a creature's space, a square's center or a grid corner. `exclude`: ids of creatures that never stand in the way (the creature whose space is the origin).
 * Returns { blocked, level, banes, noLoE, inWay, exposed, label }, or null on a grid that isn't square. `blockedFn(a, b)` can replace the wall test (used by the tests).
 */
export function coverFromPoint(point, target, { blockedFn: bf = wallBlocks, others = null, exclude = [] } = {}) {
  if (!point || !target || !canvas?.grid?.isSquare) return null;
  const tr = rectOf(target);
  const blockedFn = bf;
  const blocked = cornersOf(inset(tr, INSET)).filter(c => blockedFn(point, c)).length;
  const crowd = others ?? (canvas.tokens?.placeables ?? []).filter(t => t.id !== target.id && !exclude.includes(t.id) && !t.document.hidden && !liesLow(t));
  const inWay = blocked < 4 && crowd.some(t => segmentHitsRect(point, centerOf(tr), inset(rectOf(t), WAY_INSET)));   // v0.0.350
  let level = Math.min(4, Math.max(blocked, inWay ? 1 : 0));
  const exposed = !!target.actor?.statuses?.has?.("leaning") && level >= 1;   // Total cover becomes High: a creature Leaning out of it can be targeted
  if (exposed) level -= 1;
  return { blocked, level, banes: level >= 4 ? 0 : level, noLoE: level >= 4, inWay, leaning: false, exposed, label: COVER_LABELS[level] };
}

/** A line for the roll dialog: why the cover is what it is. */
export const coverWhy = c =>
  (c.exposed ? "The target is Leaning: cover reduced by 1. " : "") +
  (c.leaning ? `You are Leaning${c.leanCorner ? ` from your ${CORNER_LABEL[c.leanCorner]} corner` : " (from the best corner)"}. ` : "") +
  (c.blocked > 0 ? `${c.blocked} of the target's 4 corners are blocked` : "A creature is in the way") +
  (c.inWay && c.blocked > 0 ? ", and a creature is in the way" : "");
