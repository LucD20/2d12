// Light radius and region snapping (v0.0.177).
// A light of size N reaches the squares of an N Emanation (book, Light). Foundry measures a light's radius from its exact point, so a scene light
// of 2 placed on a square's center reaches fewer squares than a 2 Emanation (2.5 did). The system adds the missing part itself, so the number
// typed in a light's settings is the book's number: a scene light gets + half a square, a token's light + half the token's width (Foundry may already
// add that for tokens: then nothing changes). The rules' light (light.mjs lightAt) reads the drawn source, so it follows the same radius.
// Regions snap to grid corners (whole squares), never to half squares (a world setting, on by default).
/** A light's radius in pixels: its size (in the scene's units) plus `extra` squares (half a square, or half a token), when it sheds light. */
export const radiusPx = (units, extra, pxPerUnit, gridPx, maxR = Infinity) => {
  const u = Math.abs(Number(units) || 0);
  return u > 0 ? Math.min(maxR, u * pxPerUnit + extra * gridPx) : 0;
};

function wrap(proto, name, fix) {
  const orig = proto?.[name];
  if (typeof orig !== "function") return false;
  if (orig.twod12) return true;
  const w = function (...args) {
    const out = orig.apply(this, args);
    try { if (out) fix(this, out); } catch (e) { console.warn(`twod12 | ${name}`, e); }
    return out;
  };
  w.twod12 = true;
  proto[name] = w;
  return true;
}

/** Install the light radius and the region snapping. Returns what was found, for the console. */
export function registerLightRadius() {
  const found = {};
  const d = () => canvas.dimensions;
  const fix = (cfg, out, extra) => {
    for (const k of ["dim", "bright"]) {
      const u = Number(cfg?.[k]) || 0;
      if (u > 0 && Number(out[k]) > 0) out[k] = radiusPx(u, extra, d().distancePixels ?? d().size / (d().distance || 1), d().size, d().maxR ?? Infinity);
    }
  };
  // A scene light on a square's center is an Emanation (+ half a square); on a grid corner it is a Burst (book, Light): its size is from the corner.
  const onCorner = doc => { try { const v = canvas.grid.getSnappedPoint({ x: doc.x, y: doc.y }, { mode: CONST.GRID_SNAPPING_MODES.VERTEX }); return Math.hypot(v.x - doc.x, v.y - doc.y) < 1; } catch (e) { return false; } };
  found.ambient = wrap(CONFIG.AmbientLight?.objectClass?.prototype, "_getLightSourceData", (obj, out) => fix(obj.document?.config, out, onCorner(obj.document) ? 0 : 0.5));
  found.token = wrap(CONFIG.Token?.objectClass?.prototype, "_getLightSourceData", (obj, out) => {
    const doc = obj.document, half = Math.max(Number(doc?.width) || 1, Number(doc?.height) || 1) / 2;
    fix(doc?.light, out, half);
  });
  // Regions: snap to the grid's corners (whole squares). Shift while drawing still skips snapping (Foundry's own rule).
  const RL = CONFIG.Canvas?.layers?.regions?.layerClass?.prototype;
  if (RL && typeof RL.getSnappedPoint === "function" && !RL.getSnappedPoint.twod12corner) {
    const orig = RL.getSnappedPoint;
    const w = function (point, ...rest) {
      try {
        if (game.settings.get("twod12", "regionSnapCorners") && canvas.grid?.isSquare) return canvas.grid.getSnappedPoint(point, { mode: CONST.GRID_SNAPPING_MODES.VERTEX });
      } catch (e) { /* the setting or the grid isn't ready */ }
      return orig.call(this, point, ...rest);
    };
    w.twod12corner = true;
    RL.getSnappedPoint = w;
    found.regions = true;
  }
  if (!found.ambient || !found.token) console.warn("twod12 | light radius: Foundry's light methods were not found", found);
  return found;
}
