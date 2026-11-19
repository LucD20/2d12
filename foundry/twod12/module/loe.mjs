// The Line of Effect lines (v0.0.165; a token-controls toggle since v0.0.302, it was on the token HUD). They are the lines your cover is counted with: from the center of your
// square (or your best square, or your Leaning corner) to the four corners of each creature you target. Green: nothing blocks the line. Red: blocked.
// At the target: the cover and how many corners are blocked ("Medium cover: 2 blocked"). The lines stay until you click the button again, follow the
// tokens and your targets, and only you see them. Same test as the roll's cover (cover.mjs coverBetween).
import { coverBetween } from "./cover.mjs";
import { HeightCover } from "./heightcover.mjs";
import { toggleFlanking, flankingShown } from "./flankoverlay.mjs";
// v0.0.302 (Lucas tested v0.0.301): the buttons moved from the token HUD to the token controls (the left toolbar): Line of Effect (a toggle that follows
// your selected token), Cover height calculation (a button) and Show flanking (a toggle, flankoverlay.mjs). The shortcuts (Shift+L, Shift+H) stay.

const NAME = "twod12-loe";
const GREEN = 0x2fa84f, RED = 0xd23b2f, AMBER = 0xff5a1f;   // v0.0.350: the center line through a creature; v0.0.351 (Lucas: "red / brighter orange when blocked"): bright red-orange
let state = null;   // { tokenId } while the lines are on for one token (the shortcut), { follow: true } for the toolbar's toggle (your selected token)
let queued = false;

/** The text over a target: its cover and why. */
export function loeLabel(c) {
  if (c.noLoE) return `No Line of Effect: ${c.blocked} of 4 blocked`;
  // v0.0.453 (Lucas, playtest 6: the lines as they count): walls on the corners, creatures on the center line
  const why = [`walls block ${c.blocked} of 4 corners`, c.inWay ? "" : "no creature on the center line", c.inWay ? `${(c.blockers ?? []).map(b => String(b.name ?? "").replace(/\s*\(.*\)\s*$/, "").split(/\s+/)[0]).filter(Boolean).join(", ") || "a creature"} on the center line` : "", c.exposed ? "it is Leaning (-1)" : ""].filter(Boolean).join(", ");
  return `${c.label}: ${why}`;
}

function layer() { return canvas?.controls ?? canvas?.interface ?? null; }
function clear() { const l = layer(); for (const c of [...(l?.children ?? [])].filter(x => x.name === NAME)) { l.removeChild(c); c.destroy({ children: true }); } }

function draw() {
  queued = false;
  clear();
  if (!state || !canvas?.ready) return;
  const mine = (canvas.tokens?.controlled ?? []).filter(x => x.isOwner);
  const src = state.follow ? (mine.length === 1 ? mine[0] : null) : canvas.tokens?.get(state.tokenId);
  if (!src) { if (!state.follow) state = null; return; }
  const box = new PIXI.Container();
  box.name = NAME; box.eventMode = "none";
  for (const t of game.user.targets) {
    if (t.id === src.id || t.document?.parent !== canvas.scene) continue;
    const c = coverBetween(src, t);
    if (!c?.origin) continue;
    const g = new PIXI.Graphics();
    // v0.0.453 (Lucas, playtest 6: "Change the display to be more intuitive": a corner line crossing Kaela looked like it should give cover): the
    // corner lines only count walls, so they are thin and dashed, faint when clear and red when a wall blocks them; the center line is the one
    // creatures count on, so it is solid and strong: pale when clear, amber with a ring on the creature in the way (Low cover)
    const dashed = (a, z, col, w, alpha, on = 8, off = 7) => { const dx = z.x - a.x, dy = z.y - a.y, len = Math.hypot(dx, dy) || 1; g.lineStyle(w, col, alpha); for (let s0 = 0; s0 < len; s0 += on + off) { const e = Math.min(len, s0 + on); g.moveTo(a.x + (dx * s0) / len, a.y + (dy * s0) / len).lineTo(a.x + (dx * e) / len, a.y + (dy * e) / len); } };
    for (const k of c.corners) {
      dashed(c.origin, k, k.blocked ? RED : GREEN, k.blocked ? 2.5 : 1.5, k.blocked ? 0.95 : 0.5);
      g.lineStyle(0).beginFill(k.blocked ? RED : GREEN, k.blocked ? 1 : 0.7).drawCircle(k.x, k.y, k.blocked ? 5 : 3.5).endFill();
    }
    if (c.center) {
      const a = c.origin, z = c.center, col = c.inWay ? AMBER : 0xe8e2d0;
      g.lineStyle(c.inWay ? 5 : 3.5, col, 1).moveTo(a.x, a.y).lineTo(z.x, z.y);
      g.lineStyle(0).beginFill(col, 1).drawCircle(z.x, z.y, 5).endFill();
      for (const b of c.blockers ?? []) { const bt = canvas.tokens?.get(b.id); if (bt) g.lineStyle(3, AMBER, 0.95).drawCircle(bt.center.x, bt.center.y, Math.max(bt.w, bt.h) / 2 + 3); }
    }
    g.lineStyle(2, 0x1e2430, 1).beginFill(0xffffff, 1).drawCircle(c.origin.x, c.origin.y, 6).endFill();
    box.addChild(g);
    const text = new PIXI.Text(loeLabel(c), { fontFamily: "Signika, sans-serif", fontSize: 18, fontWeight: "600", fill: c.noLoE ? "#ffb3ad" : (c.level ? "#ffe3a3" : "#c8f5d2"), stroke: "#111111", strokeThickness: 4 });
    text.anchor.set(0.5, 1);
    text.position.set(t.center?.x ?? (t.x + t.w / 2), (t.y ?? 0) - 6);
    box.addChild(text);
  }
  layer()?.addChild(box);
}
/** Draws again on the next frame (moving tokens refresh many times). */
const redraw = () => { if (!state || queued) return; queued = true; requestAnimationFrame(draw); };

/** The button: on or off for this token. */
export function toggleLoE(token) {
  if (state?.tokenId === token?.id) { state = null; clear(); return false; }
  if (!canvas?.grid?.isSquare) { ui.notifications.warn("Line of Effect is drawn on square grids only."); return false; }
  state = { tokenId: token.id };
  if (!game.user.targets.size) ui.notifications.info("Line of Effect is on: target a creature to see the lines to it. Click the button again to hide them.");
  draw();
  return true;
}
export const loeOn = token => state?.tokenId === token?.id;

/** v0.0.215 (Lucas, playtest 2): the selected token of yours (the shortcuts), or a warning. */
function selectedOwn() {
  const t = (canvas?.tokens?.controlled ?? []).filter(x => x.isOwner);
  if (t.length !== 1) { ui.notifications.warn("Select one token of yours first."); return null; }
  return t[0];
}
/** Shortcut (Shift+L by default): Line of Effect on or off for the selected token, as its HUD button. */
export function loeShortcut() { const t = selectedOwn(); if (t) toggleLoE(t); return true; }
/** Shortcut (Shift+H by default): Cover height calculation with the selected token and its first target, as its HUD button. */
export function heightShortcut() {
  const token = selectedOwn();
  if (!token) return true;
  const targets = [...game.user.targets].filter(t => t.id !== token.id);
  if (!targets.length) { ui.notifications.warn("Target a creature first: the side view shows you and your target."); return true; }
  if (targets.length > 1) ui.notifications.info(`Side view with your first target, ${targets[0].name}.`);
  HeightCover.open(token, targets[0]);
  return true;
}

/** v0.0.302: the toolbar's Line of Effect toggle: the lines from your selected token (whichever it is) to your targets. */
export function setLoEFollow(v) {
  if (!v) { state = null; clear(); return false; }
  if (!canvas?.grid?.isSquare) { ui.notifications.warn("Line of Effect is drawn on square grids only."); return false; }
  state = { follow: true };
  if (!game.user.targets.size) ui.notifications.info("Line of Effect is on: select your token and target a creature to see the lines to it.");
  draw();
  return true;
}

/** The token controls' tools (V12: an array of controls; V13+: objects keyed by name). */
function addTools(controls) {
  const tools = [
    { name: "twod12-loe", title: "Line of Effect: the lines your cover is counted with, from your selected token to each creature you target (green clear, red blocked)", icon: "fa-solid fa-bezier-curve", toggle: true, active: !!state, change: (ev, active) => setLoEFollow(active) },
    { name: "twod12-height", title: "Cover height calculation: a side view of your selected token and your target", icon: "fa-solid fa-mountain", button: true, change: () => heightShortcut() },
    { name: "twod12-flank", title: "Show flanking: who flanks whom, the Field Boons each gets, and who cancels them", icon: "fa-solid fa-people-arrows", toggle: true, active: flankingShown(), change: (ev, active) => toggleFlanking(active) }
  ];
  if (Array.isArray(controls)) {
    const tc = controls.find(c => c.name === "token");
    for (const t of tools) if (tc && !tc.tools.some(x => x.name === t.name)) tc.tools.push({ ...t, onClick: v => t.change(null, t.toggle ? v : true) });
    return;
  }
  const tc = controls.tokens ?? controls.token;
  if (!tc?.tools) return;
  for (const t of tools) { const { change, ...rest } = t; tc.tools[t.name] = { ...rest, order: Object.keys(tc.tools).length + 1, visible: true, onChange: (ev, active) => change(ev, active) }; }
}

export function registerLoE() {
  Hooks.on("getSceneControlButtons", controls => { try { addTools(controls); } catch (e) { console.warn("twod12 | token controls", e); } });
  Hooks.on("controlToken", () => { if (state?.follow) redraw(); });
  Hooks.on("targetToken", user => { if (user === game.user) redraw(); });
  Hooks.on("refreshToken", redraw);
  for (const h of ["createWall", "updateWall", "deleteWall", "updateToken"]) Hooks.on(h, redraw);
  Hooks.on("deleteToken", doc => { if (state?.tokenId === doc.id) { state = null; clear(); } else redraw(); });
  Hooks.on("canvasTearDown", () => { state = null; });
}
