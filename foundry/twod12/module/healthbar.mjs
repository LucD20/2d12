// Custom token resource bar for the "health" attribute: lethal damage from the left (Body red, Mind blue),
// Nonlethal damage from the right on a bar above (bright yellow / cyan). No threshold ticks.
const COLORS = { body: 0xd2331f, mind: 0x2c62e6, nbody: 0xffd21f, nmind: 0x2fe6dc, track: 0xdcdcdc };

function rect(g, x, y, w, h, color, alpha = 1) {
  if (w <= 0 || h <= 0) return;
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawRect(x, y, w, h); g.endFill(); }
  else { g.rect(x, y, w, h); g.fill({ color, alpha }); }
}

function draw(token, number, bar) {
  const s = token.actor.system, d = s.damage, pool = s.pool;
  const w = token.w;
  const h = Math.max(canvas.dimensions.size / 12, 8) * (token.document.height >= 2 ? 1.6 : 1);
  const nh = Math.max(5, h * 0.6), gap = 2, total = nh + gap + h;
  const px = v => Math.max(0, Math.min(w, (v / pool) * w));
  bar.clear();
  rect(bar, -1, -1, w + 2, total + 2, 0x000000, 0.65);
  rect(bar, 0, nh + gap, w, h, COLORS.track, 0.9);
  rect(bar, 0, 0, w, nh, COLORS.track, 0.5);
  const bl = px(d.bodyLethal), ml = Math.min(px(d.mindLethal), w - bl);
  rect(bar, 0, nh + gap, bl, h, COLORS.body);
  rect(bar, bl, nh + gap, ml, h, COLORS.mind);
  const bn = px(d.bodyNonlethal), mn = Math.min(px(d.mindNonlethal), w - bn);
  rect(bar, w - bn, 0, bn, nh, COLORS.nbody);
  rect(bar, w - bn - mn, 0, mn, nh, COLORS.nmind);
  bar.position.set(0, number === 0 ? token.h - total : 0);
}

export function registerHealthBar() {
  const Tok = foundry.canvas?.placeables?.Token ?? globalThis.Token;
  const orig = Tok.prototype._drawBar;
  Tok.prototype._drawBar = function (number, bar, data) {
    if (data?.attribute === "health" && this.actor?.system?.pool) {
      try { draw(this, number, bar); return true; } catch (err) { console.warn("twod12 | health bar failed, using default", err); }
    }
    return orig.call(this, number, bar, data);
  };
}
