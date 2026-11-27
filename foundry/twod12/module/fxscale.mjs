// v0.0.532 (Lucas, playtest 11: "The Active Effect marks on a token don't scale with zoom: its hard to see when it is small"): the effect icons on a
// token are Foundry's own (Token#effects, a PIXI container of the token, drawn in map units, so they shrink with the map when zoomed out). They get a
// minimum size on screen: zoomed out, the container is scaled up (from the token's top-left corner, where Foundry lays them out) so an icon is
// never smaller than MIN_PX on screen, up to MAX times its size; at a normal or closer zoom it keeps its own size (never grown when zoomed in).
// Pure helper first (the tests load it).

const MIN_PX = 16, MAX = 3;

/** Pure: the scale of a token's effect icons. iconPx: an icon's size in map pixels; zoom: the canvas's scale (1 = 100%). 1 when it is big enough. */
export function fxIconScale(iconPx, zoom, { minPx = MIN_PX, max = MAX } = {}) {
  const on = (Number(iconPx) || 0) * (Number(zoom) || 0);
  if (!(on > 0) || on >= minPx) return 1;
  return Math.min(max, minPx / on);
}

/** The size of one effect icon in map pixels: the first icon sprite's, else Foundry's default (a fifth of a square). */
const iconSize = t => {
  const kids = t?.effects?.children ?? [];
  const sp = kids.find(k => k?.texture && Number(k.width) > 0 && k.visible !== false);
  const s = sp ? Number(sp.width) : 0;   // its own width (the container's scale is not in it)
  return s > 0 ? s : (globalThis.canvas?.dimensions?.size ?? 100) / 5;
};

function scaleToken(t) {
  try {
    const fx = t?.effects;
    if (!fx || fx.destroyed || !fx.scale) return;
    const k = fxIconScale(iconSize(t), globalThis.canvas?.stage?.scale?.x ?? 1);
    if (Math.abs((fx.scale.x || 1) - k) > 1e-3) fx.scale.set(k, k);
  } catch (e) { /* a token being drawn */ }
}
let queued = false;
function scaleAll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; for (const t of globalThis.canvas?.tokens?.placeables ?? []) scaleToken(t); });
}

export function registerFxScale() {
  Hooks.on("canvasPan", scaleAll);
  Hooks.on("canvasReady", scaleAll);
  Hooks.on("refreshToken", t => scaleToken(t));   // Foundry lays the icons out again on a refresh
  Hooks.on("drawToken", t => setTimeout(() => scaleToken(t), 0));
}
