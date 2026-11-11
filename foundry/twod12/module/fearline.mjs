// v0.0.345 (Lucas, playtest 4: "selecting a Frightened creature should show where its origin is, so you know the direction and plan your turn"):
// while you control a creature with a Movement limit (Frightened: moving closer to its source is Difficult Terrain), the map draws a dashed line
// from it to the source, a ring on the source and a label. Faded, with "(not seen)", while the creature can't see its source (no effect then).
// Nothing is saved: it is drawn from the effects of the controlled tokens.
import { allEffects } from "./passives.mjs";
import { effectOff, seesOrigin } from "./escalation.mjs";
const F = "twod12", NAME = "twod12-fearline", PURPLE = 0xb06ad8;

/** Pure: the label for one limit. how: "difficult" | "cant"; dir: "closer" | "away". */
export function fearLabel({ name, source, how, dir, seen }) {
  const what = how === "difficult" ? `moving ${dir === "away" ? "away" : "closer"} is Difficult Terrain` : `can't move ${dir === "away" ? "away" : "closer"}`;
  return `${name} of ${source}: ${seen ? what : "not seen (no effect now)"}`;
}

/** The limits of a token's creature, each with its source token: [{ name, source, token, how, dir, seen }]. */
export function fearSources(tok) {
  const actor = tok?.actor, out = [];
  if (!actor) return out;
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const l of e.getFlag?.(F, "moveLimits") ?? []) {
      const o = e.origin ?? "", src = (canvas?.tokens?.placeables ?? []).find(t => t.document?.uuid === o || (t.actor && t.actor.uuid === o));
      if (!src || src.id === tok.id) continue;
      let seen = true; if (l.seen) { try { seen = seesOrigin(actor, e); } catch (err) { seen = true; } }
      out.push({ name: String(e.name ?? "").replace(/\s*\(.*\)\s*$/, ""), source: src.name, token: src, how: l.how === "difficult" ? "difficult" : "cant", dir: l.dir === "away" ? "away" : "closer", seen });
    }
  }
  return out;
}

const layer = () => canvas?.controls ?? canvas?.interface ?? null;
function clear() { const l = layer(); for (const c of [...(l?.children ?? [])].filter(x => x.name === NAME)) { l.removeChild(c); c.destroy({ children: true }); } }
const center = t => t.center ?? { x: t.x + t.w / 2, y: t.y + t.h / 2 };
function draw() {
  queued = false;
  clear();
  if (!canvas?.ready) return;
  const box = new PIXI.Container(); box.name = NAME; box.eventMode = "none";
  for (const tok of canvas.tokens?.controlled ?? []) {
    for (const f of fearSources(tok)) {
      const a = center(tok), b = center(f.token), alpha = f.seen ? 0.95 : 0.4;
      const g = new PIXI.Graphics(), dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, dash = 14, gap = 9;
      g.lineStyle(4, PURPLE, alpha);
      for (let s = 0; s < len; s += dash + gap) { const e = Math.min(len, s + dash); g.moveTo(a.x + (dx * s) / len, a.y + (dy * s) / len).lineTo(a.x + (dx * e) / len, a.y + (dy * e) / len); }
      const r = Math.max(f.token.w, f.token.h) / 2 + 6;
      g.lineStyle(4, PURPLE, alpha).drawCircle(b.x, b.y, r);
      box.addChild(g);
      const text = new PIXI.Text(fearLabel(f), { fontFamily: "Signika, sans-serif", fontSize: 17, fontWeight: "600", fill: f.seen ? "#ecd6fb" : "#bfb3c8", stroke: "#111111", strokeThickness: 4 });
      text.anchor.set(0.5, 1); text.alpha = f.seen ? 1 : 0.8;
      text.position.set(a.x, (tok.y ?? a.y) - 6);
      box.addChild(text);
    }
  }
  if (box.children.length) layer()?.addChild(box); else box.destroy();
}
let queued = false;
const redraw = () => { if (queued) return; queued = true; requestAnimationFrame(() => { try { draw(); } catch (e) { console.warn("twod12 | Frightened line", e); } }); };

export function registerFearLine() {
  for (const h of ["controlToken", "refreshToken", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect", "canvasReady"]) Hooks.on(h, redraw);
}
