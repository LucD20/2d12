// What the canvas shows follows the rules of Light, not Foundry's lighting (see Light and Senses in the rules): a token is visible to a creature by sight only if the light on it, after the
// creature's Sight Senses, is not Darkness. So Global Illumination can stay on for the map, and a Darkness region (Adjust Darkness Level) or a Darkness source hides creatures from those
// who can't see in it. A token that is not seen may still be heard (the Hearing ripple, see senses.mjs).
import { tokenLight, seenLight, lightAt, darknessDetail, sceneDarkness, tokenSquares, LIGHT_NAMES } from "./light.mjs";
import { modeList } from "./modes.mjs";

/** Does the observer see this token by the rules? Its own token and tokens without a creature are not judged here. */
export function canSeeByRules(observer, target) {
  if (!observer?.actor || !target?.actor || observer === target || (observer.id && observer.id === target.id)) return true;
  // v0.0.316 (Lucas: Blinded hid the Hearing ripple too): Blinded is the system's own status, not Foundry's blind one; it only stops these
  // sight modes here, so the Hearing mode (senses.mjs) still shows what the creature hears
  if (observer.actor.statuses?.has?.("blinded")) return false;
  return seenLight(tokenLight(target), observer.actor.system?.senses ?? {}) !== "dark";
}

/**
 * v0.0.495 (Lucas playtest Image 3), tuned v0.0.496 (Lucas: 0.04*gs leaked through thin wall slivers):
 * Foundry's default testVisibility checks only ±0.25*gs around a token's overall center, leaving a 75% blind rim on Large (2×2) tokens.
 * Testing Foundry's same 0.25*gs tolerance (center + 4 quarter-inset corners) for each occupied 1×1 square keeps Large tokens visible
 * whenever at least a quarter of any occupied square peeks into sight, without revealing tokens through razor-thin wall slivers.
 */
export function cornerInLos(visionSource, mode, target, modeId = "") {
  const poly = modeId === "basicSight" && typeof visionSource?.shape?.contains === "function" ? visionSource.shape : visionSource?.los;
  if (typeof poly?.contains !== "function" || !target?.document || target.document.hidden) return false;
  const gs = globalThis.canvas?.grid?.size || 100;
  const distUnit = globalThis.canvas?.grid?.distance || 1;
  const rangeUnits = mode?.range;
  let rangePx = Infinity;
  if (rangeUnits !== null && rangeUnits !== undefined && rangeUnits !== Infinity) {
    if (!(Number(rangeUnits) > 0)) return false;
    rangePx = Number(rangeUnits) * (gs / distUnit) + 4;
  }
  const d = target.document, e = 0.25 * gs;
  const cols = Math.max(1, Math.round(Number(d.width) || 1));
  const rows = Math.max(1, Math.round(Number(d.height) || 1));
  const ox = Number(visionSource.x), oy = Number(visionSource.y);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const bx = Number(d.x) + i * gs, by = Number(d.y) + j * gs;
      const mx = bx + 0.5 * gs, my = by + 0.5 * gs;
      const x0 = bx + e, y0 = by + e;
      const x1 = bx + gs - e, y1 = by + gs - e;
      for (const [cx, cy] of [[mx, my], [x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
        if (Number.isFinite(rangePx) && Number.isFinite(ox) && Number.isFinite(oy) && Math.hypot(cx - ox, cy - oy) > rangePx) continue;
        if (poly.contains(cx, cy)) return true;
      }
    }
  }
  return false;
}

// The modes of Foundry's sight that can make a token visible: Basic Sight (what the creature's vision reaches), Light Perception (anything in a lit area: this is the one
// Global Illumination feeds) and See Invisibility. All of them must also be allowed by the rules.
const SIGHT_MODES = ["basicSight", "lightPerception", "seeInvisibility"];
let installed = [];

/** Each of Foundry's sight modes also asks the rules: what it shows as seen must be allowed by canSeeByRules. Returns the modes it was put on. */
export function registerSightGate() {
  installed = [];
  try {
    for (const id of SIGHT_MODES) {
      const mode = CONFIG?.Canvas?.detectionModes?.[id];
      if (!mode || typeof mode.testVisibility !== "function") continue;
      if (mode.testVisibility.twod12Gate) { installed.push(id); continue; }
      const orig = mode.testVisibility;
      const gated = function (visionSource, m, config) {
        const seen = orig.call(this, visionSource, m, config);
        const target = config?.object;
        if (!seen) {
          if (id === "seeInvisibility" || !target?.actor || !visionSource?.object) return seen;
          try {
            if (typeof this?._canDetect === "function" && !this._canDetect(visionSource, target)) return false;
            return canSeeByRules(visionSource.object, target) && cornerInLos(visionSource, m, target, id);
          } catch (e) { return seen; }
        }
        try { return target?.actor ? canSeeByRules(visionSource?.object, target) : seen; } catch (e) { return seen; }
      };
      gated.twod12Gate = true;
      mode.testVisibility = gated;
      installed.push(id);
    }
  } catch (e) { console.warn("twod12 | could not put the rules of Light on Foundry's sight", e); }
  return [...installed];
}

/** What changes the picture: a region, the combat (who makes noise), a status, a creature's Senses. Vision is refreshed (once, a moment later). */
const CHANGES = {
  createRegion: () => true, updateRegion: () => true, deleteRegion: () => true,
  createRegionBehavior: () => true, updateRegionBehavior: () => true, deleteRegionBehavior: () => true,
  createCombat: () => true, deleteCombat: () => true, updateCombat: (d, ch) => "round" in (ch ?? {}),
  createCombatant: () => true, deleteCombatant: () => true, updateCombatant: (d, ch) => "defeated" in (ch ?? {}),
  createActiveEffect: e => hasPerception(e), updateActiveEffect: e => hasPerception(e), deleteActiveEffect: e => hasPerception(e),
  updateActor: (d, ch) => !!ch?.system?.senses,
  createWall: () => true, deleteWall: () => true, updateWall: (d, ch) => !!ch?.flags?.twod12 || "c" in (ch ?? {})   // v0.0.525: a thick wall blocks Hearing
};
const hasPerception = e => ["unsensed", "hidden", "obscured", "unconscious", "blinded"].some(s => e?.statuses?.has?.(s));
export function registerSightRefresh() {
  if (typeof Hooks === "undefined") return null;
  let timer = null;
  const refresh = () => { clearTimeout(timer); timer = setTimeout(() => { try { canvas?.perception?.update?.({ refreshVision: true }); } catch (e) { /* no canvas */ } }, 120); };
  for (const [hook, wants] of Object.entries(CHANGES)) Hooks.on(hook, (doc, changes) => { try { if (wants(doc, changes)) refresh(); } catch (e) { /* ignore */ } });
  return refresh;
}

/** game.twod12.lightInfo(): the light by the rules for the controlled tokens (or the characters), and the Darkness regions Foundry has: a line of text to copy. */
export function lightInfo() {
  const sel = canvas.tokens?.controlled ?? [];
  const toks = sel.length ? sel : (canvas.tokens?.placeables ?? []).filter(t => t.actor?.type === "character");
  const regions = (canvas.regions?.placeables ?? []).flatMap(r => (r.document.behaviors ?? []).filter(b => /darkness/i.test(b.type)).map(b => ({ region: r.document.name, type: b.type, disabled: !!b.disabled, system: b.system?.toObject?.() ?? b.system })));
  const info = {
    sightGate: installed,
    detectionModes: Object.fromEntries(Object.entries(CONFIG.Canvas?.detectionModes ?? {}).map(([k, m]) => [k, m.type])),
    sceneDarkness: sceneDarkness(),
    globalLight: canvas.scene?.environment?.globalLight?.enabled ?? canvas.scene?.globalLight ?? null,
    foundryHasDarknessAt: typeof canvas.effects?.getDarknessLevel === "function",
    darknessRegions: regions,
    tokens: toks.map(t => {
      const sq = tokenSquares(t)[0],
        d = sq ? darknessDetail(sq) : null;
      return {
        name: t.name,
        light: LIGHT_NAMES[tokenLight(t)],
        darkness: d?.value ?? null,
        via: d?.via ?? null,
        adjustedBy: d?.regions ?? [],
        darkSight: !!t.actor?.system?.senses?.darksight,
        squareLight: sq ? lightAt(sq) : null,
        sight: { enabled: t.document.sight?.enabled ?? null, range: t.document.sight?.range ?? null, visionMode: t.document.sight?.visionMode ?? null },
        detection: modeList(t.document.detectionModes).map(m => `${m.id}:${m.range ?? "-"}`)
      };
    })
  };
  console.log("twod12 | light " + JSON.stringify(info));
  ui.notifications.info(
    `${installed.length ? `Foundry's sight (${installed.join(", ")}) follows the rules of Light` : "The rules of Light are NOT on Foundry's sight (its modes were not found)"}; ${regions.length} region behavior${regions.length === 1 ? "" : "s"} about darkness. Copy the console line that starts with "twod12 | light" for the details.`
  );
  return info;
}
