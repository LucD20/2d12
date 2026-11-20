// Light levels (see Light in the rules): every square is Bright, Dim or Darkness.
// A square is lit by the brightest of: the scene's own light (from its Darkness level and two thresholds),
// and any light source whose shape reaches it (inside its bright radius: Bright; inside its dim radius: Dim).
// Darkness sources make a square Darkness. A creature bigger than one square is in the brightest light of its squares.
import { homePos } from "./lean.mjs";

export const LIGHT = { bright: 2, dim: 1, dark: 0 };
export const LIGHT_NAMES = { bright: "Bright", dim: "Dim", dark: "Darkness" };

export function registerLight() {
  const opts = { scope: "world", config: true, type: Number, range: { min: 0, max: 1, step: 0.05 }, onChange: () => { lightSettings.clear(); ui.scenes?.render?.(); } };
  game.settings.register("twod12", "lightDimBelow", { ...opts, name: "Scene light: Dim below this light level", hint: "The scene's light level is 1 minus its Darkness level. Below this value the scene's own light is Dim (0.7: Dim from Darkness 0.3).", default: 0.7 });
  game.settings.register("twod12", "lightDarkBelow", { ...opts, name: "Scene light: Darkness below this light level", hint: "Below this value the scene's own light is Darkness (0.4: Darkness from Darkness 0.6).", default: 0.4 });
  Hooks.on("renderSceneConfig", (app, html) => { try { sliderLegend(app, html instanceof HTMLElement ? html : html?.[0]); } catch (e) { console.warn("twod12 | scene light legend", e); } });
}

// v0.0.361 (PACK PERF, D40): the two thresholds are read once and kept until they change (the sight test read both world settings each time)
const lightSettings = new Map();
const setting = (k, d) => { if (lightSettings.has(k)) return lightSettings.get(k); try { const v = Number(game.settings.get("twod12", k)); lightSettings.set(k, v); return v; } catch (e) { return d; } };

/** The scene's own light from a Darkness level (0 to 1). */
export function levelFromDarkness(darkness) {
  const light = 1 - (Number(darkness) || 0);
  if (light >= setting("lightDimBelow", 0.7)) return "bright";
  if (light >= setting("lightDarkBelow", 0.4)) return "dim";
  return "dark";
}

/** The scene's own Darkness level (0 to 1). */
export const sceneDarkness = () => canvas?.environment?.darknessLevel ?? canvas?.scene?.environment?.darknessLevel ?? canvas?.scene?.darkness ?? 0;

export function sceneLight() {
  return levelFromDarkness(sceneDarkness());
}

/** Is the point inside the region? (Foundry 13 takes one point with its elevation; older Foundry took the elevation apart.) */
export function regionHasPoint(doc, p, elevation = 0) {
  try { const r = doc.testPoint({ x: p.x, y: p.y, elevation }); if (typeof r === "boolean") return r; } catch (e) { /* the other shape */ }
  try { return !!doc.testPoint(p, elevation); } catch (e) { return false; }
}

/**
 * The Darkness level at a point (0 to 1): Foundry's own answer for the point (it knows its regions that adjust the Darkness level and its Darkness sources), or, when Foundry has none,
 * the scene's Darkness adjusted by the "Adjust Darkness Level" regions as this code reads them (Override sets it to the modifier, Brighten lowers it by that share, Darken raises it by that share).
 * detail: { value, via, regions } for the console.
 */
export function darknessDetail(p, elevation = 0) {
  try {
    const f = canvas?.effects?.getDarknessLevel;
    if (typeof f === "function") { const v = Number(f.call(canvas.effects, { x: p.x, y: p.y, elevation })); if (Number.isFinite(v)) return { value: v, via: "foundry", regions: [] }; }
  } catch (e) { /* not there */ }
  const base = sceneDarkness(), hit = [];
  let d = base;
  try {
    for (const r of canvas?.regions?.placeables ?? []) {
      const doc = r.document ?? r;
      if (!regionHasPoint(doc, p, elevation)) continue;
      for (const b of doc.behaviors ?? []) {
        if (b.type !== "adjustDarknessLevel" || b.disabled) continue;
        const mode = Number(b.system?.mode ?? 0), mod = Number(b.system?.modifier ?? 0) || 0;
        d = mode === 1 ? d * (1 - mod) : mode === 2 ? 1 - (1 - d) * (1 - mod) : mod;   // 0 Override, 1 Brighten, 2 Darken
        hit.push({ region: doc.name, mode, modifier: mod });
      }
    }
  } catch (e) { /* no regions */ }
  return hit.length ? { value: Math.min(1, Math.max(0, d)), via: "regions", regions: hit } : { value: base, via: "scene", regions: [] };
}
export const darknessAt = (p, elevation = 0) => darknessDetail(p, elevation).value;

const inside = (src, p) => {
  try {
    if (!src.shape) return true;
    if (src.shape.contains(p.x, p.y)) return true;
    // A square whose center is exactly on the edge of the light counts (see Light in the rules), but a point exactly on the edge of the shape can test as outside: look one pixel nearer to the light.
    const sx = src.data?.x ?? src.x, sy = src.data?.y ?? src.y;
    if (!Number.isFinite(sx) || !Number.isFinite(sy)) return false;
    const dx = sx - p.x, dy = sy - p.y, d = Math.hypot(dx, dy);
    return d > 0 && src.shape.contains(p.x + dx / d, p.y + dy / d);
  } catch (e) { return false; }
};

/** Bright, Dim or Darkness at a point on the canvas (pixels). */
export function lightAt(p) {
  try {
    for (const src of canvas.effects?.darknessSources ?? []) if (src?.active && inside(src, p)) return "dark";
  } catch (e) { /* no darkness sources */ }
  let best = levelFromDarkness(darknessAt(p));   // the scene's Darkness, adjusted by the regions that adjust it
  if (best === "bright") return best;
  try {
    const global = canvas.environment?.globalLightSource;
    for (const src of canvas.effects?.lightSources ?? []) {
      if (!src?.active || src === global || src.constructor?.name === "GlobalLightSource") continue;
      if (!inside(src, p)) continue;
      const d = Math.hypot(p.x - (src.data?.x ?? src.x ?? 0), p.y - (src.data?.y ?? src.y ?? 0));
      const bright = Math.abs(src.data?.bright ?? 0), dim = Math.abs(src.data?.dim ?? 0);
      if (d <= bright + 0.5) return "bright";   // (half a pixel: a center exactly on the edge counts)
      if (d <= dim + 0.5) best = "dim";
    }
  } catch (e) { /* no light sources */ }
  return best;
}

/** The centers of the squares a token occupies. */
export function tokenSquares(token) {
  const doc = token?.document ?? token;
  const gs = canvas?.grid?.size ?? 100;
  if (!doc) return [];
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
  const out = [];
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) out.push({ x: homePos(doc).x + (i + 0.5) * gs, y: homePos(doc).y + (j + 0.5) * gs });
  return out;
}

/** The light a creature is in: the brightest of its squares. */
export function tokenLight(token) {
  let best = "dark";
  for (const p of tokenSquares(token)) {
    const l = lightAt(p);
    if (LIGHT[l] > LIGHT[best]) best = l;
    if (best === "bright") break;
  }
  return tokenSquares(token).length ? best : sceneLight();
}

/** How light looks to a creature, after its Sight Senses (Dim-light Sight, Dark Sight); Blinded (senses.blind, sightSenses) sees Darkness everywhere. */
export const sightSenses = actor => ({ ...(actor?.system?.senses ?? {}), blind: !!actor?.statuses?.has?.("blinded") });
export function seenLight(light, senses = {}) {
  if (senses.blind) return "dark";   // v0.0.459 (book, Blinded: "Every square is Difficult Terrain for you, as Darkness is"): everything is Darkness to it
  if (senses.darksight) return "bright";
  if (senses.dimlight && light === "dim") return "bright";
  return light;
}

/**
 * Elevation (v0.0.162): the squares between two creatures up and down, counted like a third axis. A token is as tall as it is wide
 * (a Medium creature 1 square, a size 2 one 2 squares), from its elevation up; elevation is in the scene's grid units. 0 when they overlap in height.
 */
export function verticalSquares(a, b) {
  const cv = globalThis.canvas, unit = Number(cv?.scene?.grid?.distance ?? cv?.dimensions?.distance) || 1;
  const v = t => { const d = t?.document ?? t; return { e: (Number(d?.elevation) || 0) / unit, h: Math.max(1, Number(d?.width) || 1) }; };
  const A = v(a), B = v(b);
  if (A.e < B.e + B.h - 1e-6 && B.e < A.e + A.h - 1e-6) return 0;
  return Math.round(Math.max(0, A.e - (B.e + B.h), B.e - (A.e + A.h))) + 1;
}
/** Adds the up-and-down squares to the squares on the map with the same rule as diagonals: every second one counts 2. */
export const withHeight = (flat, up) => Math.max(flat, up) + Math.floor(Math.min(flat, up) / 2);

/** Squares between two tokens, counted by the rules: adjacent is 1 (even diagonally) and every second diagonal counts as 2 (1, 2, 1, 2...); elevation counts too. */
export function tokenDistance(a, b) {
  const gs = canvas?.grid?.size ?? 100;
  const r = t => { const d = t?.document ?? t; return { x: d.x, y: d.y, w: (d.width ?? 1) * gs, h: (d.height ?? 1) * gs }; };
  const A = r(a), B = r(b);
  // along one axis: 0 when they overlap, otherwise the squares from the nearest square of one to the nearest square of the other (next to each other: 1)
  const along = (a1, aw, b1, bw) => ((a1 < b1 + bw - 1e-6 && b1 < a1 + aw - 1e-6) ? 0 : Math.round(Math.max(0, a1 - (b1 + bw), b1 - (a1 + aw)) / gs) + 1);
  const di = along(A.y, A.h, B.y, B.h), dj = along(A.x, A.w, B.x, B.w);
  return Math.max(1, withHeight(Math.max(di, dj) + Math.floor(Math.min(di, dj) / 2), verticalSquares(a, b)));
}

/** Under the scene's Darkness slider: where Bright, Dim and Darkness start, and what the current value gives. */
function sliderLegend(app, root) {
  if (!root || root.querySelector(".twod12-light-legend")) return;
  const input = root.querySelector('[name="environment.darknessLevel"]') ?? root.querySelector('[name="darkness"]');
  if (!input) return;
  const group = input.closest(".form-group") ?? input.parentElement;
  const dimFrom = (1 - setting("lightDimBelow", 0.7)).toFixed(2), darkFrom = (1 - setting("lightDarkBelow", 0.4)).toFixed(2);
  const p = document.createElement("p");
  p.className = "hint twod12-light-legend";
  const show = () => { p.innerHTML = `2d12 light: <b>Bright</b> up to ${dimFrom}, <b>Dim</b> above ${dimFrom}, <b>Darkness</b> above ${darkFrom}. This scene: <b>${LIGHT_NAMES[levelFromDarkness(input.value)]}</b>.`; };
  show();
  input.addEventListener("input", show);
  input.addEventListener("change", show);
  group.after(p);
}
