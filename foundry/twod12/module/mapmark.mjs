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
  return { radius: r * (1 + 0.45 * k), alpha: 0.7 * (1 - k) * (1 - k) };
}

function tick() {
  const now = Date.now();
  for (const rp of ripples) {
    if (rp.g.destroyed) { ripples.delete(rp); continue; }
    const { radius, alpha } = rippleAt(now - rp.t0, rp.r);
    rp.g.clear(); rp.g.lineStyle(Math.max(2, rp.r * 0.06), rp.color, alpha).drawCircle(rp.x, rp.y, radius);
  }
  if (!ripples.size) stopTicker();
}
function startTicker() { if (tickerOn) return; try { globalThis.canvas?.app?.ticker?.add(tick); tickerOn = true; } catch (e) { tickerOn = false; } }
function stopTicker() { if (!tickerOn) return; try { globalThis.canvas?.app?.ticker?.remove(tick); } catch (e) { /* gone */ } tickerOn = false; }

/**
 * The attention mark around a token: the steady ring and the slow ripple (B). parent: a PIXI container; c: the center; r: the ring's radius
 * (about 0.62 of the token's width). Returns { ring, ripple }; destroying the parent stops the ripple.
 */
export function attentionRing(parent, c, r, { color = GOLD, width = 3, hot = false } = {}) {
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
  bg.lineStyle(1, PLATE_LINE, 1).beginFill(PLATE_BG, 0.94).drawRect(-w / 2, -h, w, h).endFill();
  box.addChild(bg);
  let y = -h + padY;
  for (const t of texts) { t.position.set(-w / 2 + padX, y); box.addChild(t); y += t.height + gap; }
  return box;
}

/** A small gold square with a number (a pickable creature's number, the same as its picture in the HUD). */
export function numberPin(n, { fs = 13 } = {}) {
  const P = globalThis.PIXI;
  const box = new P.Container(), s = Math.round(fs * 1.3);
  const bg = new P.Graphics();
  bg.lineStyle(1, PLATE_BG, 1).beginFill(GOLD, 1).drawRect(-s / 2, -s / 2, s, s).endFill();
  const t = new P.Text(String(n), { fontFamily: FONT, fontSize: Math.round(fs * 0.9), fontWeight: "700", fill: PLATE_BG });
  t.anchor?.set?.(0.5, 0.5);
  box.addChild(bg, t);
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
