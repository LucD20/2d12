// v0.0.461 (the map notes' redesign; the mockup foundry/mockups/mapnotes, Lucas's answers 2026-11-20: "A - B", everything else as proposed):
// the shared marks every map note draws, so the map and the HUD's Situational section read as one instruction.
//   - "You can click this / this needs you": a steady gold ring around the token and a slow ripple that grows out of it and fades (Lucas's
//     choice B), in the Situational section's gold; still under the browser's reduced motion or the client setting "mapMotion" off.
//   - A plate: a flat dark label (dark in both themes: it sits on the map's art), a bold first line and a muted second, Source Sans 3.
//   - A number pin in the ring's corner (the same number as the HUD's picture).
//   - The origin ring of a Forced Movement, the Evade's dashed edge.
// Colors only for a meaning: gold = a choice for you; red = not allowed / it stops here; pale ink = the path and where you can stop.
export const GOLD = 0xd2a75a, GOLD_HI = 0xf0d48a, RED = 0xd9534a, INK = 0xece3cf, PLATE_BG = 0x1f1c18, PLATE_LINE = 0x6b5d45;
export const FONT = "Source Sans 3, Signika, sans-serif";

const RIPPLE_MS = 2400;
const ripples = new Set();
let tickerOn = false;

/** Pure: does the map animate? Off with the browser's reduced motion or the client setting "mapMotion" (Configure Settings). */
export function motionOn() {
  try { if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return false; } catch (e) { /* no media queries */ }
  try { return globalThis.game?.settings?.get?.("twod12", "mapMotion") !== false; } catch (e) { return true; }
}

/** Pure: a ripple's radius and alpha at time t (ms): it grows from r to 1.45 r and fades out over 2.4 s, then starts again. */
export function rippleAt(t, r) {
  const k = ((t % RIPPLE_MS) + RIPPLE_MS) % RIPPLE_MS / RIPPLE_MS;
  return { radius: r * (1 + 0.45 * k), alpha: 0.95 * (1 - k) * (1 - k) };   // v0.0.466: stronger (was 0.7)
}

/** Clamped inverse canvas zoom scale so map plates and pins remain legible at any zoom level. */
export function zoomScale() {
  const z = Number(globalThis.canvas?.stage?.scale?.x) || 1;
  return Math.max(0.6, Math.min(1.5, 1 / z));
}

function tick() {
  const now = Date.now();
  for (const rp of ripples) {
    if (rp.g.destroyed || !rp.g.parent) { ripples.delete(rp); continue; }
    const { radius, alpha } = rippleAt(now - rp.t0, rp.r);
    rp.g.clear(); rp.g.lineStyle(Math.max(3, rp.r * 0.08), rp.color, alpha).drawCircle(rp.x, rp.y, radius);
  }
  if (!ripples.size) stopTicker();
}
function startTicker() { if (tickerOn) return; try { globalThis.canvas?.app?.ticker?.add(tick); tickerOn = true; } catch (e) { tickerOn = false; } }
function stopTicker() { if (!tickerOn) return; try { globalThis.canvas?.app?.ticker?.remove(tick); } catch (e) { /* gone */ } tickerOn = false; }

/**
 * The attention mark around a token: the steady ring and the slow ripple (B). parent: a PIXI container; c: the center; r: the ring's radius
 * (about 0.62 of the token's width). Returns { ring, ripple }; destroying the parent stops the ripple.
 */
export function attentionRing(parent, c, r, { color = GOLD, width = 4, hot = false } = {}) {   // v0.0.466 (Lucas: "very very faint"): 4 px (was 3)
  const P = globalThis.PIXI;
  if (!P || !parent) return null;
  const ring = new P.Graphics();
  ring.lineStyle(hot ? width + 2 : width, hot ? GOLD_HI : color, 1).drawCircle(c.x, c.y, r);
  parent.addChild(ring);
  let ripple = null;
  if (motionOn()) {
    ripple = new P.Graphics();
    parent.addChildAt(ripple, Math.max(0, parent.children.indexOf(ring)));
    ripples.add({ g: ripple, x: c.x, y: c.y, r, color, t0: Date.now() - Math.random() * 400 });
    startTicker();
  }
  return { ring, ripple };
}

/** A flat dark plate with one or two lines (the first bold); anchored at its bottom center (pos is where its arrow points). */
export function plate(lines, { fs = 14, color = INK, mute = 0xb3a68e, warn = false } = {}) {
  const P = globalThis.PIXI;
  const box = new P.Container();
  const rows = (Array.isArray(lines) ? lines : [lines]).filter(x => x !== null && x !== undefined && String(x) !== "");
  const texts = rows.map((s, i) => new P.Text(String(s), { fontFamily: FONT, fontSize: i ? Math.round(fs * 0.85) : fs, fontWeight: i ? "400" : "600", fill: i ? (warn ? RED : mute) : color }));
  const padX = Math.round(fs * 0.55), padY = Math.round(fs * 0.3), gap = Math.round(fs * 0.12);
  const w = Math.max(...texts.map(t => t.width), fs) + padX * 2, h = texts.reduce((a, t) => a + t.height, 0) + gap * Math.max(0, texts.length - 1) + padY * 2;
  const bg = new P.Graphics();
  bg.lineStyle(1, warn ? RED : PLATE_LINE, 1).beginFill(PLATE_BG, 0.94).drawRect(-w / 2, -h, w, h).endFill();
  box.addChild(bg);
  let y = -h + padY;
  for (const t of texts) { t.position.set(-w / 2 + padX, y); box.addChild(t); y += t.height + gap; }
  const sc = zoomScale();
  if (sc !== 1) box.scale?.set?.(sc);
  return box;
}

/** A small gold square with a number (a pickable creature's number, the same as its picture in the HUD). */
export function numberPin(n, { fs = 13, color = GOLD } = {}) {
  const P = globalThis.PIXI;
  const box = new P.Container(), s = Math.round(fs * 1.3);
  const bg = new P.Graphics();
  bg.lineStyle(1, PLATE_BG, 1).beginFill(color, 1).drawRect(-s / 2, -s / 2, s, s).endFill();
  const t = new P.Text(String(n), { fontFamily: FONT, fontSize: Math.round(fs * 0.9), fontWeight: "700", fill: PLATE_BG });
  t.anchor?.set?.(0.5, 0.5);
  box.addChild(bg, t);
  const sc = zoomScale();
  if (sc !== 1) box.scale?.set?.(sc);
  return box;
}

/** A Forced Movement's origin: a thin pale ring (where the push comes from or the pull goes to). */
export function originRing(g, c, r) { g.lineStyle(2, INK, 0.7).drawCircle(c.x, c.y, r); return g; }

/** A dashed rectangle edge (the Evade's squares). */
export function dashRect(g, x, y, w, h, { dash = 8, gap = 6, color = INK, alpha = 0.85, width = 2 } = {}) {
  g.lineStyle(width, color, alpha);
  const seg = (ax, ay, bx, by) => { const len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.floor(len / (dash + gap))); for (let k = 0; k < n; k++) { const s = (k * (dash + gap)) / len, e = Math.min(1, (k * (dash + gap) + dash) / len); g.moveTo(ax + (bx - ax) * s, ay + (by - ay) * s).lineTo(ax + (bx - ax) * e, ay + (by - ay) * e); } };
  seg(x, y, x + w, y); seg(x + w, y, x + w, y + h); seg(x + w, y + h, x, y + h); seg(x, y + h, x, y);
  return g;
}

/** A dashed line from a to b (the Evade's edge). */
export function dashLine(g, a, b, { dash = 8, gap = 6, color = INK, alpha = 0.85, width = 2 } = {}) {
  g.lineStyle(width, color, alpha);
  const len = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(len / (dash + gap)));
  for (let k = 0; k < n; k++) { const s = (k * (dash + gap)) / len, e = Math.min(1, (k * (dash + gap) + dash) / len); if (s >= 1) break; g.moveTo(a.x + (b.x - a.x) * s, a.y + (b.y - a.y) * s); g.lineTo(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e); }
  return g;
}

/** Unified Z-order tiers on canvas.interface so overlays stack cleanly and never fight each other. */
export const Z = {
  FLOOR: 10,       // Light-level tint
  RINGS: 20,       // Weapon Range / Threat Rings floor perimeters
  FLANK: 8200,     // Flanking lines & STYLE-3 plates
  LOE: 8400,       // Line of Effect rays & 3D distance plates
  AREA: 8500,      // Active Area template shapes
  RANGE_TAGS: 8600,// Range target badges (placed below target tokens)
  ACTIVE: 9000     // Active Move / Charge / Reaction overlays
};

const plateSpots = new Map();
/** Clear all claimed label rectangles for an overlay group (e.g. "flank", "loe", "range"). */
export function clearPlateSpots(group) { plateSpots.delete(group); }
/**
 * Claim a non-overlapping center position (x, y) for a label of size w×h in `group`,
 * checking against ALL active overlay groups while keeping the label near its anchor.
 * prefer: "up" (default, above token) or "down" (below token).
 */
export function claimPlateSpot(group, x, y, w, h, { prefer = "up", pad = 4 } = {}) {
  const all = [];
  for (const list of plateSpots.values()) all.push(...list);
  const hits = (cx, cy) => all.some(p => Math.abs(p.x - cx) < (p.w + w) / 2 + pad && Math.abs(p.y - cy) < (p.h + h) / 2 + pad);
  const step = h + pad;
  const dir = prefer === "down" ? 1 : -1;
  let chosen = { x, y };
  if (hits(x, y)) {
    let found = false;
    for (let k = 1; k <= 8; k++) {
      const cy = y + dir * k * step;
      if (!hits(x, cy)) { chosen = { x, y: cy }; found = true; break; }
    }
    if (!found) {
      for (let k = 1; k <= 6; k++) {
        const cy = y - dir * k * step;
        if (!hits(x, cy)) { chosen = { x, y: cy }; break; }
      }
    }
  }
  const box = { x: chosen.x, y: chosen.y, w, h };
  if (!plateSpots.has(group)) plateSpots.set(group, []);
  plateSpots.get(group).push(box);
  return chosen;
}

/** v0.0.467 (Lucas, checklist v0.0.466: Charge's overlay "is below tokens"): a map note goes on the interface layer above the tokens (as the
 *  Reactions overlay, rxoverlay.mjs: z-index 9000 on a sortable host). Returns the object. */
export function addOnTop(obj, z = Z.ACTIVE) {
  const host = globalThis.canvas?.interface ?? globalThis.canvas?.stage;
  if (!host || !obj) return obj;
  try { host.sortableChildren = true; obj.zIndex = z; } catch (e) { /* an old canvas */ }
  host.addChild(obj);
  return obj;
}

/* ------------------------------------------------------------------ v0.0.515: lines on the map show for 5 seconds
 * Lucas, 2026-11-25 (the Hide indicator): "After 5 seconds, it goes away, you must select or hover the token again to show it. Reducing clutter.
 * I think this should be applied to all lines drawn". Each overlay that draws lines (Line of Effect, Flanking, Hide) hands its container here by a
 * key; it shows for LINE_SHOW_MS after the last "show" (a token selected, hovered or targeted, or the overlay turned on), then fades out. A redraw
 * keeps the time left, so moving tokens don't keep the lines up. */
export const LINE_SHOW_MS = 5000;
const lineFades = new Map();   // key -> { obj, until, t }
let lineShowUntil = 0;
/** Pure: is a line still shown at `now`? */
export const lineShown = (until, now = Date.now()) => Number(until) > now;
function lineFadeOut(o) {
  if (!o || o.destroyed) return;
  if (!motionOn()) { o.alpha = 0; return; }
  const t0 = performance.now(), step = () => { if (o.destroyed) return; const k = (performance.now() - t0) / 400; o.alpha = Math.max(0, 1 - k); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function lineReveal(e) {
  if (!e?.obj || e.obj.destroyed) return;
  clearTimeout(e.t);
  const left = e.until - Date.now();
  if (!lineShown(e.until)) { e.obj.alpha = 0; return; }
  e.obj.alpha = 1;
  e.t = setTimeout(() => lineFadeOut(e.obj), left);
}
/** Show every overlay's lines again for 5 seconds (a selection, a hover, a target, an overlay turned on). */
export function showLines() {
  lineShowUntil = Date.now() + LINE_SHOW_MS;
  for (const e of lineFades.values()) { e.until = lineShowUntil; lineReveal(e); }
}
/** An overlay drew its lines in `obj`: it shows for the time left (a new key shows for 5 seconds). */
export function trackLines(key, obj) {
  const e = lineFades.get(key) ?? { until: Math.max(lineShowUntil, Date.now() + LINE_SHOW_MS) };
  e.obj = obj; lineFades.set(key, e); lineReveal(e);
}
/** The overlay was turned off: forget its key (the next time it is on, it shows for 5 seconds). */
export const untrackLines = key => { const e = lineFades.get(key); if (e) clearTimeout(e.t); lineFades.delete(key); };
let lineHooks = false;
export function registerLineFade() {
  if (lineHooks) return; lineHooks = true;
  Hooks.on("controlToken", (t, on) => { if (on) showLines(); });
  Hooks.on("hoverToken", (t, on) => { if (on) showLines(); });
  Hooks.on("targetToken", user => { if (user === game.user) showLines(); });
}
