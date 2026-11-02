// The Line of Effect button (v0.0.165), on the token HUD of your own token. It draws the lines your cover is counted with: from the center of your
// square (or your best square, or your Leaning corner) to the four corners of each creature you target. Green: nothing blocks the line. Red: blocked.
// At the target: the cover and how many corners are blocked ("Medium cover: 2 blocked"). The lines stay until you click the button again, follow the
// tokens and your targets, and only you see them. Same test as the roll's cover (cover.mjs coverBetween).
import { coverBetween } from "./cover.mjs";
import { HeightCover } from "./heightcover.mjs";

const NAME = "twod12-loe";
const GREEN = 0x2fa84f, RED = 0xd23b2f;
let state = null;   // { tokenId } while the lines are on
let queued = false;

/** The text over a target: its cover and why. */
export function loeLabel(c) {
  if (c.noLoE) return `No Line of Effect: ${c.blocked} of 4 blocked`;
  const why = [`${c.blocked} blocked`, c.inWay ? "a creature in the way" : "", c.exposed ? "it is Leaning (-1)" : ""].filter(Boolean).join(", ");
  return `${c.label}: ${why}`;
}

function layer() { return canvas?.controls ?? canvas?.interface ?? null; }
function clear() { const l = layer(); for (const c of [...(l?.children ?? [])].filter(x => x.name === NAME)) { l.removeChild(c); c.destroy({ children: true }); } }

function draw() {
  queued = false;
  clear();
  if (!state || !canvas?.ready) return;
  const src = canvas.tokens?.get(state.tokenId);
  if (!src) { state = null; return; }
  const box = new PIXI.Container();
  box.name = NAME; box.eventMode = "none";
  for (const t of game.user.targets) {
    if (t.id === src.id || t.document?.parent !== canvas.scene) continue;
    const c = coverBetween(src, t);
    if (!c?.origin) continue;
    const g = new PIXI.Graphics();
    for (const k of c.corners) {
      g.lineStyle(3, k.blocked ? RED : GREEN, 0.95).moveTo(c.origin.x, c.origin.y).lineTo(k.x, k.y);
      g.lineStyle(0).beginFill(k.blocked ? RED : GREEN, 1).drawCircle(k.x, k.y, 5).endFill();
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

export function registerLoE() {
  Hooks.on("renderTokenHUD", (hud, html) => {
    const root = html instanceof HTMLElement ? html : html?.[0];
    const token = hud.object;
    if (!root || !token?.isOwner) return;
    const col = root.querySelector(".col.left") ?? root.querySelector(".left");
    if (!col || col.querySelector(".twod12-loe")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = `control-icon twod12-loe${loeOn(token) ? " active" : ""}`;
    b.dataset.tooltip = "Line of Effect: the lines your cover is counted with, to each creature you target (green clear, red blocked). Click again to hide them.";
    b.setAttribute("aria-label", "Line of Effect");
    b.innerHTML = '<i class="fa-solid fa-bezier-curve"></i>';
    b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); b.classList.toggle("active", toggleLoE(token)); });
    col.appendChild(b);
    // v0.0.166: Cover height calculation, a side view of you and your (first) target (heightcover.mjs).
    const h = document.createElement("button");
    h.type = "button"; h.className = "control-icon twod12-height";
    h.dataset.tooltip = "Cover height calculation: a side view of you and your target, to work out cover through heights by hand.";
    h.setAttribute("aria-label", "Cover height calculation");
    h.innerHTML = '<i class="fa-solid fa-mountain"></i>';
    h.addEventListener("click", ev => {
      ev.preventDefault(); ev.stopPropagation();
      const targets = [...game.user.targets].filter(t => t.id !== token.id);
      if (!targets.length) return ui.notifications.warn("Target a creature first: the side view shows you and your target.");
      if (targets.length > 1) ui.notifications.info(`Side view with your first target, ${targets[0].name}.`);
      HeightCover.open(token, targets[0]);
    });
    col.appendChild(h);
  });
  Hooks.on("targetToken", user => { if (user === game.user) redraw(); });
  Hooks.on("refreshToken", redraw);
  for (const h of ["createWall", "updateWall", "deleteWall", "updateToken"]) Hooks.on(h, redraw);
  Hooks.on("deleteToken", doc => { if (state?.tokenId === doc.id) { state = null; clear(); } else redraw(); });
  Hooks.on("canvasTearDown", () => { state = null; });
}
