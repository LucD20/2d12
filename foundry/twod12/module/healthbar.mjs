// Flat Matte Concept A token resource bar for the "health" attribute + Token State Overlays:
//   - Converging split-threshold bar: Vigor (left, crimson) drains toward left; Resolve (right, cobalt) drains toward right.
//   - Type-colored Nonlethal diagonal hatches beside remaining fill (Vigor warm terracotta, Resolve cool ice-cyan).
//   - Overflow past a threshold spills across the Forged Brass Pin into the opposite half in directional dark hatch.
//   - Guard renders as a crisp flat matte crown bar above the main bar.
//   - Token State Overlays (below token.effects / marks / bars): Rim vignette + micro-ribbon for Bloodied, Strained,
//     Bloodied·Strained, Down (Dying / Shattered / Unconscious / Desperate), and faded desaturated Dead overlay + DEAD ribbon.

const COLORS = {
  // Flat matte Concept A fills
  vigor: 0xc23b32,
  resolve: 0x3f73c9,
  track: 0x14110e,
  nbodyBg: 0x6e261d,
  nbodyStripe: 0xe8965d,
  nmindBg: 0x203c66,
  nmindStripe: 0x74dbe2,
  spillVBg: 0x16110e,
  spillVStripe: 0xc23b32,
  spillRBg: 0x121721,
  spillRStripe: 0x3f73c9,
  guard: 0x74bee8,
  guardTrack: 0x0e151d,
  guardEdge: 0x3d6485,
  pin: 0xf5d57a,
  pinEdge: 0x16110c,
  // Bar frame borders by state
  frameNormal: 0x7d6844,
  frameBloodied: 0xdf5b50,
  frameStrained: 0x74a4ef,
  frameBoth: 0xc986a8,
  frameDown: 0xe6be5a,
  frameDead: 0x5b5854
};

const RIBBON_STYLE = {
  dead:        { bg: 0x1a1a1c, border: 0x75736e, text: "#c7c5c0" },
  dying:       { bg: 0x240a0a, border: 0xe0584c, text: "#ffb0a8" },
  shattered:   { bg: 0x0a1324, border: 0x6698ec, text: "#b5d2ff" },
  unconscious: { bg: 0x1a1c20, border: 0x8c94a3, text: "#e6e9f0" },
  desperate:   { bg: 0x2a1426, border: 0xd978c4, text: "#ffd6f5" },
  both:        { bg: 0x241322, border: 0xc77ab8, text: "#f5d0eb" },
  bloodied:    { bg: 0x280c0b, border: 0xd64e44, text: "#ffada6" },
  strained:    { bg: 0x0c162b, border: 0x5d8fe0, text: "#b5d2ff" }
};

/** Pure layout planner for Concept A token bar & state overlay (unit-tested without PIXI). */
export function planHealthBar(sys = {}, statuses = new Set(), w = 100) {
  const nn = v => Math.max(0, Number(v) || 0);
  const bdt = nn(sys?.bdt), mdt = nn(sys?.mdt);
  const pool = Math.max(1, nn(sys?.pool) || (bdt + mdt) || 1);
  const d = sys?.damage ?? {};
  const vL = nn(d.bodyLethal), vN = nn(d.bodyNonlethal);
  const rL = nn(d.mindLethal), rN = nn(d.mindNonlethal);
  const vTot = vL + vN, rTot = rL + rN, total = vTot + rTot;
  const hpLeft = Math.max(0, pool - total);
  const vCur = bdt - vTot, rCur = mdt - rTot;
  const guard = nn(sys?.guard) + nn(sys?.apGuard);

  const has = k => !!statuses?.has?.(k);
  const dead = has("dead");
  const down = !dead && (bdt + mdt > 0) && total >= pool;
  const bloodied = !dead && bdt > 0 && vTot >= bdt;
  const strained = !dead && mdt > 0 && rTot >= mdt;

  let downState = null;
  if (down) {
    if (has("dying")) downState = "DYING";
    else if (has("shattered")) downState = "SHATTERED";
    else if (has("desperate")) downState = "DESPERATE";
    else if (has("unconscious")) downState = "UNCONSCIOUS";
    else if ((vN + rN) >= pool / 2) downState = "UNCONSCIOUS";
    else downState = vTot >= rTot ? "DYING" : "SHATTERED";
  }

  const px = v => Math.max(0, Math.min(w, (v / pool) * w));
  const vZone = px(bdt);
  const vSolid = dead ? 0 : Math.max(0, Math.min(bdt - vTot, hpLeft));
  const rSolid = dead ? 0 : Math.max(0, Math.min(mdt - rTot, hpLeft));
  const vFillW = px(vSolid);
  const rFillW = px(rSolid);
  const rFillX = w - rFillW;

  // Type-colored Nonlethal hatches sit immediately beside their remaining solid fill
  const vNlX = vFillW;
  const vNlW = dead ? 0 : Math.max(0, Math.min(px(vSolid + vN), rFillX) - vNlX);
  const rNlEnd = rFillX;
  const rNlStart = dead ? rNlEnd : Math.max(vNlX + vNlW, rNlEnd - px(rN));
  const rNlW = Math.max(0, rNlEnd - rNlStart);

  // Directional overflow spill hatches past the V/R brass pin
  const vOver = Math.max(0, vTot - bdt);
  const vSpillStart = Math.max(vZone, vNlX + vNlW);
  const vSpillEnd = Math.min(rFillX, vZone + px(vOver));
  const vSpillW = dead ? 0 : Math.max(0, vSpillEnd - vSpillStart);

  const rOver = Math.max(0, rTot - mdt);
  const rSpillEnd = Math.min(vZone, rNlStart);
  const rSpillStart = Math.max(vFillW, vZone - px(rOver));
  const rSpillW = dead ? 0 : Math.max(0, rSpillEnd - rSpillStart);

  const guardW = !dead && guard > 0 ? Math.max(3, px(guard)) : 0;

  const frame = dead ? "dead"
    : down ? "down"
    : (bloodied && strained) ? "both"
    : bloodied ? "bloodied"
    : strained ? "strained" : "normal";

  let overlay = null;
  if (dead) overlay = { kind: "dead", label: "DEAD" };
  else if (down) overlay = { kind: downState.toLowerCase(), label: downState };
  else if (bloodied && strained) overlay = { kind: "both", label: "BLOODIED · STRAINED" };
  else if (bloodied) overlay = { kind: "bloodied", label: "BLOODIED" };
  else if (strained) overlay = { kind: "strained", label: "STRAINED" };

  return {
    pool, bdt, mdt, vCur, rCur, hpLeft, guard,
    dead, down, downState, bloodied, strained, frame, overlay,
    vZone, vFillW, rFillX, rFillW,
    vNlX, vNlW, rNlStart, rNlW,
    vSpillStart, vSpillW, rSpillStart, rSpillW,
    guardW
  };
}

/* ------------------------------------------------------------------ PIXI v7 / v8 drawing helpers */
function rect(g, x, y, w, h, color, alpha = 1) {
  if (w <= 0 || h <= 0) return;
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawRect(x, y, w, h); g.endFill(); }
  else { g.rect(x, y, w, h); g.fill({ color, alpha }); }
}

function roundRectFill(g, x, y, w, h, r, color, alpha = 1) {
  if (w <= 0 || h <= 0) return;
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawRoundedRect(x, y, w, h, r); g.endFill(); }
  else { g.roundRect(x, y, w, h, r); g.fill({ color, alpha }); }
}

function roundRectStroke(g, x, y, w, h, r, width, color, alpha = 1) {
  if (w <= 0 || h <= 0) return;
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); g.drawRoundedRect(x, y, w, h, r); g.lineStyle(0); }
  else { g.roundRect(x, y, w, h, r); g.stroke({ width, color, alpha }); }
}

function circleFill(g, cx, cy, r, color, alpha = 1) {
  if (r <= 0) return;
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawCircle(cx, cy, r); g.endFill(); }
  else { g.circle(cx, cy, r); g.fill({ color, alpha }); }
}

function circleStroke(g, cx, cy, r, width, color, alpha = 1) {
  if (r <= 0) return;
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); g.drawCircle(cx, cy, r); g.lineStyle(0); }
  else { g.circle(cx, cy, r); g.stroke({ width, color, alpha }); }
}

function polyFill(g, pts, color, alpha = 1) {
  if (pts.length < 6) return;
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawPolygon(pts); g.endFill(); }
  else { g.poly(pts); g.fill({ color, alpha }); }
}

/** Clip a 2D polygon against vertical slab [xMin, xMax] so diagonal hatches never need PIXI masks. */
function clipPolyX(verts, xMin, xMax) {
  const clip = (poly, keep, xBound) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ka = keep(a[0]), kb = keep(b[0]);
      if (ka) out.push(a);
      if (ka !== kb && Math.abs(b[0] - a[0]) > 1e-6) {
        const t = (xBound - a[0]) / (b[0] - a[0]);
        out.push([xBound, a[1] + t * (b[1] - a[1])]);
      }
    }
    return out;
  };
  let p = clip(verts, x => x >= xMin, xMin);
  if (p.length < 3) return [];
  p = clip(p, x => x <= xMax, xMax);
  return p.length < 3 ? [] : p.flat();
}

/** Crisp flat matte diagonal hatch inside [x, x+w] x [y, y+h]. dir: -1 = / , +1 = \ . */
function drawHatch(g, x, y, w, h, bgCol, stripeCol, { step = 6, sw = 2.6, dir = -1, stripeAlpha = 1 } = {}) {
  if (w <= 0.5 || h <= 0.5) return;
  rect(g, x, y, w, h, bgCol, 1);
  const dx = dir * h * 0.85;
  const start = x - Math.abs(dx) - step;
  const end = x + w + Math.abs(dx) + step;
  for (let s = start; s < end; s += step) {
    const quad = [[s, y], [s + sw, y], [s + sw + dx, y + h], [s + dx, y + h]];
    const clipped = clipPolyX(quad, x, x + w);
    if (clipped.length >= 6) polyFill(g, clipped, stripeCol, stripeAlpha);
  }
}

/* ------------------------------------------------------------------ Concept A Flat Bar */
function draw(token, number, bar) {
  const s = token.actor.system;
  const w = token.w;
  const h = Math.max(canvas.dimensions.size / 11, 9) * (token.document.height >= 2 ? 1.5 : 1);
  const p = planHealthBar(s, token.actor.statuses, w);
  const hasGuard = p.guardW > 0;
  const ext = Math.max(2, Math.min(3, h * 0.24));
  // v0.0.500 (Lucas on v0.0.499: "Guard bar can be a bit bigger to the bottom, so it is closer to the Health bar"): the crown grows down into
  // the old gap (the bar keeps its height): 2 px from the Health bar, the brass pin's top may touch it
  const gap0 = hasGuard ? Math.ceil(ext) + 2 : 0, gap = hasGuard ? 2 : 0;
  const gh = hasGuard ? Math.max(3.5, Math.round(h * 0.36)) + (gap0 - gap) : 0;
  const barY = gh + gap;
  const total = barY + h;

  const frameColor = p.frame === "dead" ? COLORS.frameDead
    : p.frame === "down" ? COLORS.frameDown
    : p.frame === "both" ? COLORS.frameBoth
    : p.frame === "bloodied" ? COLORS.frameBloodied
    : p.frame === "strained" ? COLORS.frameStrained
    : COLORS.frameNormal;
  const barAlpha = p.dead ? 0.6 : 1;

  bar.clear();

  // Optional Guard crown above main bar (flat matte frosted steel-blue)
  if (hasGuard) {
    rect(bar, -1, -1, w + 2, gh + 2, COLORS.guardEdge, 0.85);
    rect(bar, 0, 0, w, gh, COLORS.guardTrack, 0.95);
    rect(bar, 0, 0, p.guardW, gh, COLORS.guard, 0.95);
  }

  // Subtle dark shadow + colored state frame around main bar
  rect(bar, -2, barY - 2, w + 4, h + 4, 0x000000, 0.55 * barAlpha);
  rect(bar, -1, barY - 1, w + 2, h + 2, frameColor, 0.95 * barAlpha);
  rect(bar, 0, barY, w, h, COLORS.track, barAlpha);

  if (!p.dead) {
    // Remaining solid flat Vigor (left) & Resolve (right)
    if (p.vFillW > 0) rect(bar, 0, barY, p.vFillW, h, COLORS.vigor, 1);
    if (p.rFillW > 0) rect(bar, p.rFillX, barY, p.rFillW, h, COLORS.resolve, 1);

    // Type-colored Nonlethal diagonal hatches beside remaining fill
    if (p.vNlW > 0) drawHatch(bar, p.vNlX, barY, p.vNlW, h, COLORS.nbodyBg, COLORS.nbodyStripe, { step: 6, sw: 2.6, dir: -1 });
    if (p.rNlW > 0) drawHatch(bar, p.rNlStart, barY, p.rNlW, h, COLORS.nmindBg, COLORS.nmindStripe, { step: 6, sw: 2.6, dir: -1 });

    // Directional overflow spill hatches past the V/R brass pin
    if (p.vSpillW > 0) drawHatch(bar, p.vSpillStart, barY, p.vSpillW, h, COLORS.spillVBg, COLORS.spillVStripe, { step: 6, sw: 2.5, dir: 1, stripeAlpha: 0.68 });
    if (p.rSpillW > 0) drawHatch(bar, p.rSpillStart, barY, p.rSpillW, h, COLORS.spillRBg, COLORS.spillRStripe, { step: 6, sw: 2.5, dir: -1, stripeAlpha: 0.68 });
  }

  // Forged Brass Pin V/R threshold divider (extends ±ext above & below main bar, clear of Guard crown)
  if (p.bdt > 0 && p.mdt > 0) {
    const pinW = Math.max(3.5, Math.min(5, w * 0.036));
    const px0 = p.vZone - pinW / 2;
    roundRectFill(bar, px0 - 1, barY - ext - 1, pinW + 2, h + (ext + 1) * 2, 1.5, COLORS.pinEdge, 0.95 * barAlpha);
    roundRectFill(bar, px0, barY - ext, pinW, h + ext * 2, 1, COLORS.pin, barAlpha);
  }

  bar.position.set(0, number === 0 ? token.h - total : 0);
}

/* ------------------------------------------------------------------ Token State Overlays (Rim Vignette + Micro-Ribbon + Faded Dead) */
function applyDeadFilter(token, isDead) {
  const mesh = token?.mesh;
  if (!mesh || mesh.destroyed) return;
  const cur = Array.isArray(mesh.filters) ? mesh.filters : [];
  const has = cur.some(f => f?._twod12Dead);
  if (isDead && !has) {
    try {
      const CM = PIXI.ColorMatrixFilter ?? PIXI.filters?.ColorMatrixFilter;
      if (!CM) return;
      const flt = new CM();
      flt.desaturate();
      if (typeof flt.brightness === "function") flt.brightness(0.72, true);
      flt._twod12Dead = true;
      mesh.filters = [...cur, flt];
    } catch (e) { /* PIXI filter unavailable */ }
  } else if (!isDead && has) {
    const next = cur.filter(f => !f?._twod12Dead);
    mesh.filters = next.length ? next : null;
  }
}

function drawStateOverlay(token) {
  if (!token || token.destroyed) return;
  token.children?.filter(c => c.name === "twod12-state-overlay").forEach(c => { token.removeChild(c); c.destroy({ children: true }); });
  const actor = token.actor;
  if (!actor?.system?.pool) { applyDeadFilter(token, false); return; }

  const w = token.w ?? (token.document?.width ?? 1) * (canvas.grid?.size ?? 100);
  const h = token.h ?? (token.document?.height ?? 1) * (canvas.grid?.size ?? 100);
  const p = planHealthBar(actor.system, actor.statuses, w);

  applyDeadFilter(token, p.dead);
  if (!p.overlay) return;

  const box = new PIXI.Container();
  box.name = "twod12-state-overlay";
  box.eventMode = "none";

  const g = new PIXI.Graphics();
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.48;

  // Rim vignette rings (subtle for Bloodied/Strained, darker full veil for Down/Dead)
  if (p.overlay.kind === "dead") {
    circleFill(g, cx, cy, r, 0x101012, 0.42);
    circleStroke(g, cx, cy, r * 0.94, Math.max(2, r * 0.12), 0x0c0c0e, 0.55);
  } else if (p.down) {
    circleFill(g, cx, cy, r, 0x100c0a, 0.34);
    const tint = p.overlay.kind === "dying" ? 0x9b1a14 : p.overlay.kind === "shattered" ? 0x244ea8 : p.overlay.kind === "desperate" ? 0x7d3270 : 0x3b404a;
    circleStroke(g, cx, cy, r * 0.92, Math.max(2.5, r * 0.16), tint, 0.52);
  } else if (p.overlay.kind === "bloodied") {
    circleStroke(g, cx, cy, r * 0.86, Math.max(2, r * 0.16), 0x9b1a14, 0.28);
    circleStroke(g, cx, cy, r * 0.95, Math.max(2, r * 0.1), 0xc32820, 0.52);
  } else if (p.overlay.kind === "strained") {
    circleStroke(g, cx, cy, r * 0.86, Math.max(2, r * 0.16), 0x244ea8, 0.28);
    circleStroke(g, cx, cy, r * 0.95, Math.max(2, r * 0.1), 0x4882e8, 0.52);
  } else if (p.overlay.kind === "both") {
    circleStroke(g, cx, cy, r * 0.86, Math.max(2, r * 0.16), 0x7c2c66, 0.32);
    circleStroke(g, cx, cy, r * 0.95, Math.max(2, r * 0.1), 0xb85c9c, 0.54);
  }

  // Micro-ribbon pill positioned cleanly inside lower token area (clear of Guard-crowned HP bar)
  const st = RIBBON_STYLE[p.overlay.kind] ?? RIBBON_STYLE.bloodied;
  const fontSize = Math.max(8, Math.min(18, w * (p.overlay.kind === "both" ? 0.072 : 0.088)));
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? globalThis.PIXI.Text;
  const txt = new PT(p.overlay.label, {
    fontFamily: "Signika, system-ui, sans-serif",
    fontSize,
    fontWeight: "800",
    letterSpacing: p.overlay.kind === "dead" ? 1.4 : 0.8,
    fill: st.text
  });
  txt.anchor?.set?.(0.5);

  const padX = Math.max(5, w * 0.055), padY = Math.max(2, h * 0.018);
  const pillW = Math.min(w * 0.96, txt.width + padX * 2);
  const pillH = txt.height + padY * 2;
  const pillY = h * (p.down || p.dead ? 0.68 : 0.72);

  roundRectFill(g, cx - pillW / 2, pillY - pillH / 2, pillW, pillH, 3, st.bg, 0.92);
  roundRectStroke(g, cx - pillW / 2, pillY - pillH / 2, pillW, pillH, 3, 1.2, st.border, 0.9);
  txt.position.set(cx, pillY);

  box.addChild(g, txt);

  // Insert below token.effects, token.bars, and marks so overlays never obscure HUD icons or bars
  const anchorIndices = [token.effects, token.bars, ...(token.children?.filter(c => c.name === "twod12-quarry") ?? [])]
    .map(c => (c ? token.children.indexOf(c) : -1))
    .filter(i => i >= 0);
  if (anchorIndices.length) token.addChildAt(box, Math.min(...anchorIndices));
  else token.addChild(box);
}

function refreshActorTokens(actor) {
  if (!actor) return;
  for (const t of actor.getActiveTokens?.() ?? []) {
    try { t.renderFlags?.set?.({ refreshBars: true }); } catch (e) { t.drawBars?.(); }
    try { drawStateOverlay(t); } catch (e) { /* overlay refresh */ }
  }
}

const STATE_STATUSES = new Set(["dead", "bloodied", "strained", "dying", "shattered", "unconscious", "desperate"]);

export function registerHealthBar() {
  const Tok = foundry.canvas?.placeables?.Token ?? globalThis.Token;
  const orig = Tok.prototype._drawBar;
  Tok.prototype._drawBar = function (number, bar, data) {
    if (data?.attribute === "health" && this.actor?.system?.pool) {
      try { draw(this, number, bar); return true; } catch (err) { console.warn("twod12 | health bar failed, using default", err); }
    }
    return orig.call(this, number, bar, data);
  };

  Hooks.on("refreshToken", token => {
    try { drawStateOverlay(token); } catch (e) { /* cosmetic */ }
  });
  Hooks.on("canvasReady", () => {
    for (const t of canvas.tokens?.placeables ?? []) {
      try { drawStateOverlay(t); } catch (e) { /* cosmetic */ }
    }
  });

  // Guard, damage, or health-state changes redraw both the token bar and the state overlay.
  Hooks.on("updateActor", (actor, change) => {
    if (change?.system?.guard === undefined && change?.system?.apGuard === undefined && change?.system?.damage === undefined) return;
    refreshActorTokens(actor);
  });
  for (const h of ["createActiveEffect", "deleteActiveEffect", "updateActiveEffect"]) {
    Hooks.on(h, effect => {
      if (effect?.parent?.documentName !== "Actor") return;
      if ([...(effect.statuses ?? [])].some(s => STATE_STATUSES.has(s))) refreshActorTokens(effect.parent);
    });
  }
}
