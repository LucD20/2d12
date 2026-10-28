// The light-level overlay: a toggle in the token controls that tints each square by its light level
// (Bright left clear, yellow Dim, red Darkness). Only for the user who turns it on; it redraws when lights,
// tokens or the scene change. Players only see it on squares they can currently see.
import { lightAt } from "./light.mjs";

let gfx = null, on = false;
const COLORS = { dim: [0xd8b02a, 0.3], dark: [0xc0392b, 0.3] };
const TITLE = "Light levels (2d12): clear Bright, yellow Dim, red Darkness";

export function registerLightOverlay() {
  Hooks.on("getSceneControlButtons", controls => {
    try {
      const tool = { name: "twod12Light", title: TITLE, icon: "fa-solid fa-lightbulb", toggle: true, active: on, button: false };
      if (Array.isArray(controls)) {   // V12: an array of controls, tools are arrays
        const tc = controls.find(c => c.name === "token");
        if (tc && !tc.tools.some(t => t.name === tool.name)) tc.tools.push({ ...tool, onClick: v => toggle(v) });
      } else {                          // V13+: objects keyed by name
        const tc = controls.tokens ?? controls.token;
        if (tc?.tools) tc.tools[tool.name] = { ...tool, order: Object.keys(tc.tools).length + 1, onChange: (event, active) => toggle(active) };
      }
    } catch (e) { console.warn("twod12 | light overlay button", e); }
  });
  const redraw = foundry.utils.debounce(() => { if (on) draw(); }, 150);
  for (const h of ["lightingRefresh", "sightRefresh", "refreshToken", "createAmbientLight", "updateAmbientLight", "deleteAmbientLight", "updateScene", "canvasReady"]) Hooks.on(h, redraw);
  Hooks.on("canvasTearDown", () => { try { gfx?.destroy(); } catch (e) { /* already gone */ } gfx = null; });
}

export function toggle(v) {
  on = !!v;
  if (on) { draw(); ui.notifications?.info?.(TITLE); } else gfx?.clear?.();
}

const fillRect = (g, x, y, w, h, color, alpha) => {
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawRect(x, y, w, h); g.endFill(); }
  else g.rect(x, y, w, h).fill({ color, alpha });
};

/** Draw the tint for every square of the scene. Returns how many squares of each level were drawn (for tests). */
export function draw() {
  const count = { dim: 0, dark: 0 };
  if (!canvas?.ready || !canvas.grid?.isSquare || !canvas.dimensions) return count;
  if (!gfx || gfx.destroyed) {
    gfx = new PIXI.Graphics();
    gfx.eventMode = "none";
    (canvas.interface ?? canvas.stage).addChild(gfx);
  }
  gfx.clear();
  const gs = canvas.grid.size, r = canvas.dimensions.sceneRect;
  const gm = game.user?.isGM;
  for (let x = r.x; x < r.x + r.width; x += gs) {
    for (let y = r.y; y < r.y + r.height; y += gs) {
      const p = { x: x + gs / 2, y: y + gs / 2 };
      if (!gm && canvas.visibility?.testVisibility && !canvas.visibility.testVisibility(p, { tolerance: gs / 4 })) continue;
      const level = lightAt(p), c = COLORS[level];
      if (!c) continue;
      fillRect(gfx, x + 1, y + 1, gs - 2, gs - 2, c[0], c[1]);
      count[level]++;
    }
  }
  return count;
}
