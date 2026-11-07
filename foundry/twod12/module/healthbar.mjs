// Custom token resource bar for the "health" attribute: lethal damage from the left (Body red, Mind blue),
// Nonlethal damage from the right on a bar above (bright yellow / cyan). No threshold ticks.
const COLORS = { body: 0xd2331f, mind: 0x2c62e6, nbody: 0xffd21f, nmind: 0x2fe6dc, track: 0xdcdcdc, guard: 0x7cc4f2, guardEdge: 0xffffff };

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
  // v0.0.182: Guard is a shield over the right end of the main bar (what it can still take, against the Health Pool), with a white edge.
  const g = Math.max(0, Number(s.guard) || 0) + Math.max(0, Number(s.apGuard) || 0);   // v0.0.243: the Guard of the unused AP too (v0.0.274: given when the next turn starts)
  if (g > 0) { const gw = Math.max(3, px(g)); rect(bar, w - gw - 1, nh + gap - 1, gw + 1, h + 2, COLORS.guardEdge, 0.9); rect(bar, w - gw, nh + gap, gw, h, COLORS.guard, 0.95); }
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
  // v0.0.182: a change of Guard alone redraws the bars too (Foundry only watches the bar's own attribute).
  Hooks.on("updateActor", (actor, change) => {
    if (change?.system?.guard === undefined && change?.system?.apGuard === undefined) return;
    for (const t of actor.getActiveTokens?.() ?? []) { try { t.renderFlags?.set?.({ refreshBars: true }); } catch (e) { t.drawBars?.(); } }
  });
}
