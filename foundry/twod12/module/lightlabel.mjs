// The scene's light level, shown under the Darkness slider of the lighting controls (like the light level ranges of the PF2e system): a thin bar the width of the slider, split into the
// three zones of the book (Bright, Dim, Darkness: where your thresholds put them), with a marker at the scene's Darkness and its name below.
// (The light level squares have their own overlay: see lightoverlay.mjs.)
import { sceneDarkness, levelFromDarkness, LIGHT_NAMES } from "./light.mjs";

const setting = (k, d) => { try { const v = Number(game.settings.get("twod12", k)); return Number.isFinite(v) ? v : d; } catch (e) { return d; } };
const clamp01 = v => Math.max(0, Math.min(1, v));

/** "Scene light: Dim (Darkness 0.55)". */
export const lightLabelText = (darkness = sceneDarkness()) => `Scene light: ${LIGHT_NAMES[levelFromDarkness(darkness)] ?? "?"} (Darkness ${(Number(darkness) || 0).toFixed(2)})`;

/** The three zones along the slider (from 0 to 1 of Darkness): the scene's light level is 1 minus its Darkness. */
export function lightBands(dimBelow = setting("lightDimBelow", 0.7), darkBelow = setting("lightDarkBelow", 0.4)) {
  const a = clamp01(1 - dimBelow), b = Math.max(a, clamp01(1 - darkBelow));
  return [{ level: "bright", from: 0, to: a }, { level: "dim", from: a, to: b }, { level: "dark", from: b, to: 1 }];
}

/** The bar's HTML: the zones with their names, the marker at the scene's Darkness, and the text. */
export function barHtml(darkness = sceneDarkness(), bands = lightBands()) {
  const seg = b => `<span class="lb-${b.level}" style="width:${((b.to - b.from) * 100).toFixed(1)}%">${(b.to - b.from) >= 0.12 ? LIGHT_NAMES[b.level] : ""}</span>`;
  return `<div class="lb-track">${bands.map(seg).join("")}<i class="lb-mark" style="left:${(clamp01(Number(darkness) || 0) * 100).toFixed(1)}%"></i></div><div class="lb-text">${lightLabelText(darkness)}</div>`;
}

const nameHas = el => /dark/i.test(`${el.id ?? ""} ${el.className ?? ""} ${el.getAttribute?.("name") ?? ""} ${el.getAttribute?.("data-tooltip") ?? ""} ${el.getAttribute?.("aria-label") ?? ""}`) ? 1 : 0;
/** The Darkness slider of the lighting controls, as far as it can be recognized: a wide range input (or range picker) near the top of the screen, the one that names darkness first. Null if there is none. */
export function findDarknessSlider(doc = globalThis.document) {
  const found = [...(doc?.querySelectorAll?.('input[type="range"], range-picker, [class*="darkness" i], [id*="darkness" i]') ?? [])]
    .map(el => ({ el, r: el.getBoundingClientRect?.() })).filter(x => x.r && x.r.width > 200 && x.r.height > 0 && x.r.top < 220);
  found.sort((a, b) => (nameHas(b.el) - nameHas(a.el)) || (b.r.width - a.r.width));
  return found[0]?.el ?? null;
}

/** Where the bar goes: under the slider, the same width. Null when there is no slider (then there is no bar: the button of the lighting controls has the same information and a slider of its own). */
export const barPlacement = sliderRect => (sliderRect ? { left: sliderRect.left, top: sliderRect.bottom + 3, width: sliderRect.width } : null);

/* ------------------------------------------------------------------ the button in the lighting controls, and its panel */
const TOOL = "twod12LightLevel";
const LEVEL_ICON = { bright: "fa-sun", dim: "fa-cloud-sun", dark: "fa-moon" };
/** The icon of the button: the sun, a cloud over the sun, or the moon, for Bright, Dim or Darkness. */
export const lightIcon = (darkness = sceneDarkness()) => `fa-solid ${LEVEL_ICON[levelFromDarkness(darkness)] ?? "fa-circle-half-stroke"}`;

/** The panel's HTML: the zones, the marker and the name, and a slider for the scene's Darkness (only the GM can move it). */
export function popoverHtml(darkness = sceneDarkness(), canEdit = !!globalThis.game?.user?.isGM) {
  return `${barHtml(darkness)}<input type="range" class="lb-range" min="0" max="1" step="0.01" value="${clamp01(Number(darkness) || 0)}"${canEdit ? "" : " disabled"}><div class="lb-hint">${canEdit ? "Drag to change the scene's Darkness." : "Only the GM can change the Darkness."}</div>`;
}
/** Where the panel goes: right of its button (or near the left toolbar when the button can't be found). */
export const popoverPlacement = btnRect => (btnRect ? { left: btnRect.right + 8, top: btnRect.top } : { left: 64, top: 80 });

/** Set the scene's Darkness (a value from 0 to 1, in hundredths). Only the GM can; returns whether it was set. */
export async function setSceneDarkness(v, scene = globalThis.canvas?.scene) {
  if (!globalThis.game?.user?.isGM || !scene || v === null || v === "" || !Number.isFinite(Number(v))) return false;   // (an empty value is not 0)
  await scene.update({ "environment.darknessLevel": clamp01(Math.round(Number(v) * 100) / 100) });
  return true;
}

/** Add the button to the lighting controls (the controls are an object in Foundry 13 and later, an array before). onChange(event, active) is called when it is switched. */
export function addLightTool(controls, onChange, icon = lightIcon()) {
  const tool = { name: TOOL, title: "Scene light level", icon, toggle: true, active: false, visible: true, order: 99, onChange };
  if (Array.isArray(controls)) { const c = controls.find(x => x.name === "lighting"); if (!c?.tools) return false; if (!c.tools.some(t => t.name === TOOL)) c.tools.push(tool); return true; }
  const c = controls?.lighting;
  if (!c?.tools) return false;
  c.tools[TOOL] = tool;
  return true;
}

const state = { pop: false, el: null, timer: null, refresh: () => {} };
/** Registered when the module loads (before the controls are first drawn): the button, and the panel it opens. */
export function registerLightTool() {
  Hooks.on("getSceneControlButtons", controls => { try { addLightTool(controls, (ev, active) => { state.pop = !!active; state.refresh(); }); } catch (e) { console.warn("twod12 | light level button", e); } });
}

const describe = el => {
  const r = el.getBoundingClientRect?.() ?? {};
  return {
    tag: String(el.tagName ?? "").toLowerCase(),
    id: el.id || "",
    class: String(el.className ?? "").slice(0, 80),
    name: el.getAttribute?.("name") ?? "",
    rect: [r.left, r.top, r.width, r.height].map(v => Math.round(v ?? 0)).join(",")
  };
};
/** game.twod12.sliderInfo(): what was taken for the Darkness slider and every candidate, as a line of text to copy (for when the bar isn't where it should be). */
export function sliderInfo() {
  const doc = globalThis.document, found = findDarknessSlider(doc);
  const info = { found: found ? describe(found) : null, ranges: [...(doc?.querySelectorAll?.('input[type="range"], range-picker') ?? [])].map(describe), lighting: !!canvas?.lighting?.active };
  console.log("twod12 | slider " + JSON.stringify(info));
  ui.notifications.info(found ? "The Darkness slider was found: the light level bar is under it." : "No Darkness slider was found: copy the console line that starts with \"twod12 | slider\" to see what is on the screen.");
  return info;
}

export function registerLightLabel() {
  let el = null; const watched = new WeakSet();
  const hide = () => { if (el) el.style.display = "none"; };
  const update = () => {
    try {
      if (!canvas?.ready || !canvas.lighting?.active) return hide();
      if (!el) { el = document.createElement("div"); el.id = "twod12-lightlevel"; document.body.appendChild(el); }
      el.innerHTML = barHtml();
      const slider = findDarknessSlider(document);
      if (slider && !watched.has(slider)) { watched.add(slider); for (const ev of ["input", "change"]) slider.addEventListener?.(ev, () => update()); }   // it moves while the slider is dragged
      const p = barPlacement(slider?.getBoundingClientRect?.());
      if (!p) return hide();                                         // no slider on the screen: the button's panel is the way
      Object.assign(el.style, { display: "block", left: `${p.left}px`, top: `${p.top}px`, width: `${p.width}px` });
    } catch (e) { /* no canvas yet */ }
  };
  // The panel of the button: the zones and a slider (the GM drags it to change the Darkness; it is not redrawn while it is held).
  const popUpdate = () => {
    try {
      const show = state.pop && canvas?.ready && canvas.lighting?.active;
      if (!show) { if (state.el) state.el.style.display = "none"; return; }
      if (!state.el) {
        state.el = document.createElement("div"); state.el.id = "twod12-lightpop"; document.body.appendChild(state.el);
        state.el.addEventListener?.("input", ev => {
          if (!ev.target?.classList?.contains?.("lb-range")) return;
          const v = Number(ev.target.value);
          const set = (sel, fn) => { const n = state.el.querySelector?.(sel); if (n) fn(n); };
          set(".lb-mark", n => { n.style.left = `${(clamp01(v) * 100).toFixed(1)}%`; }); set(".lb-text", n => { n.textContent = lightLabelText(v); });
          clearTimeout(state.timer); state.timer = setTimeout(() => setSceneDarkness(v), 150);
        });
      }
      const held = globalThis.document?.activeElement?.classList?.contains?.("lb-range");
      if (!held) state.el.innerHTML = popoverHtml();
      const p = popoverPlacement(document.querySelector?.(`[data-tool="${TOOL}"]`)?.getBoundingClientRect?.());
      Object.assign(state.el.style, { display: "block", left: `${p.left}px`, top: `${p.top}px` });
      const icon = document.querySelector?.(`[data-tool="${TOOL}"] i`); if (icon) icon.className = lightIcon();   // the button shows the level too
    } catch (e) { /* no canvas yet */ }
  };
  state.refresh = () => { update(); popUpdate(); };
  const later = () => { state.refresh(); setTimeout(state.refresh, 80); setTimeout(state.refresh, 400); };   // the controls and the slider are drawn a moment after the hook
  for (const h of ["canvasReady", "renderSceneControls", "updateScene", "lightingRefresh", "activateCanvasLayer"]) Hooks.on(h, () => later());
  state.refresh();
  return state.refresh;
}
