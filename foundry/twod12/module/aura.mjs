// Auras (Round 11 of the rules): an area that follows its origin. It reaches a number of squares from every square the creature occupies
// (the footprint of an Emanation around that creature) and moves with it. A creature inside gains the Aura's Effect as soon as it enters and
// loses it when it leaves. The origin decides whether it is affected itself. The GM's client keeps the scene's Auras up to date.
// An Aura is a setting of an Effect or of a passive (Feature or Talent): "Aura N around the creature: [who] inside gain [an Effect]".
import { evalFormula, refValues } from "./fxrules.mjs";
import { homePos } from "./lean.mjs";
import { effectOff } from "./escalation.mjs";
import { TWOD12 } from "./config.mjs";
import { allEffects } from "./passives.mjs";
import { tokenDistance } from "./light.mjs";
import { createEffect, originInfo } from "./effects.mjs";
const F = "twod12";

/** Pure: which creatures are inside which Auras. sources: [{ key, token, aura: { size, who, self } }]; dist(a, b): squares (adjacent: 1); side(t): the disposition. Returns Map(token id -> Map(key -> source)). */
export function auraPlan(sources, tokens, dist, side) {
  const want = new Map();
  for (const src of sources) {
    for (const t of tokens) {
      const own = t.id === src.token.id;
      if (own) { if (!src.aura.self) continue; }
      else {
        const sa = side(src.token), st = side(t), ally = sa !== 0 && sa === st, enemy = sa !== 0 && st !== 0 && sa !== st;
        const who = src.aura.who ?? "allies";
        if (!(who === "all" || (who === "allies" && ally) || (who === "enemies" && enemy))) continue;
        if (dist(src.token, t) > (Number(src.aura.size) || 1)) continue;
      }
      if (!want.has(t.id)) want.set(t.id, new Map());
      want.get(t.id).set(src.key, src);
    }
  }
  return want;
}

/** The Auras of the creatures in the scene: one for each Aura setting of each effect or passive that is on. */
function sourcesOf(tokens) {
  const out = [];
  for (const t of tokens) for (const e of allEffects(t.actor)) {
    if (effectOff(t.actor, e) || e.getFlag?.(F, "auraFrom")) continue;
    (e.getFlag?.(F, "auras") ?? []).forEach((aura0, i) => {
      // v0.0.323 (PACK EFFECT-SHEET): a formula size ("@origin.pow"): the effect's origin's values (else the creature's own), at least 1
      let aura = aura0;
      if (aura0.formula) { let o = null; try { o = e.origin ? fromUuidSync(e.origin) : null; } catch (err) { o = null; } const oa = o?.documentName === "Actor" ? o : o?.actor ?? t.actor;
        aura = { ...aura0, size: Math.max(1, Math.trunc(Number(evalFormula(aura0.formula, { origin: refValues(oa), target: refValues(t.actor) }).value) || 1)) }; }
      out.push({ key: `${t.actor.uuid}|${e.id}|${i}`, token: t, aura });
    });
  }
  return out;
}

let timer = null, running = false, again = false;
export function scheduleAuraRefresh() { clearTimeout(timer); timer = setTimeout(refreshAuras, 250); }

export async function refreshAuras() {
  if (!game.user?.isActiveGM || !canvas?.scene) return;
  if (running) { again = true; return; }
  running = true;
  try {
    const tokens = (canvas.tokens?.placeables ?? []).filter(t => t.actor);
    const want = auraPlan(sourcesOf(tokens), tokens, tokenDistance, t => Number(t.document?.disposition ?? 0));
    const items = new Map();
    const itemOf = async uuid => { if (!items.has(uuid)) items.set(uuid, await fromUuid(uuid)); return items.get(uuid); };
    const done = new Set();
    for (const t of tokens) {
      const actor = t.actor;
      if (done.has(actor.uuid)) continue;
      done.add(actor.uuid);
      const mine = want.get(t.id) ?? new Map();
      const have = actor.effects.filter(e => e.getFlag(F, "auraFrom"));
      const stale = have.filter(e => !mine.has(e.getFlag(F, "auraFrom"))).map(e => e.id);
      if (stale.length) await actor.deleteEmbeddedDocuments("ActiveEffect", stale);
      for (const [key, src] of mine) {
        if (have.some(e => e.getFlag(F, "auraFrom") === key)) continue;
        const item = await itemOf(src.aura.fxUuid);
        if (item) await createEffect(actor, item, originInfo(src.token.actor.uuid), null, { auraFrom: key });
      }
    }
  } catch (e) { console.warn("twod12 | auras", e); }
  finally { running = false; if (again) { again = false; scheduleAuraRefresh(); } }
}

/** The squares an Aura covers around a token, as top-left pixels: every square whose distance (in squares, adjacent: 1) to the token is within the size. */
export function auraCells(token, size, gs, dist) {
  const d = token.document ?? token, w = Math.max(1, Math.round(d.width ?? 1)), h = Math.max(1, Math.round(d.height ?? 1));
  const out = [];
  for (let j = -size; j < h + size; j++) for (let i = -size; i < w + size; i++) {
    const hp = homePos(d), cell = { x: hp.x + i * gs, y: hp.y + j * gs, width: 1, height: 1 };
    if (dist(cell, token) <= size) out.push({ x: cell.x, y: cell.y });
  }
  return out;
}

/** The color of an Aura's outline and of its squares: its own ("#rrggbb"), else the default of who it affects. */
export const auraColors = aura => {
  const def = TWOD12.auraColors[aura?.who] ?? TWOD12.auraColors.allies, num = (v, d) => parseInt(/^#[0-9a-f]{6}$/i.test(String(v ?? "")) ? String(v).slice(1) : d.slice(1), 16);
  return { outline: num(aura?.outline, def), fill: num(aura?.fill, def) };
};

/** The edges of a set of squares, [[x1, y1, x2, y2]]: only the ones next to a square that is not in the set (the limits of the area). cells: top-left pixels. */
export function outlineSegments(cells, gs) {
  const has = new Set(cells.map(c => `${c.x},${c.y}`)), seg = [];
  for (const { x, y } of cells) {
    if (!has.has(`${x},${y - gs}`)) seg.push([x, y, x + gs, y]);
    if (!has.has(`${x},${y + gs}`)) seg.push([x, y + gs, x + gs, y + gs]);
    if (!has.has(`${x - gs},${y}`)) seg.push([x, y, x, y + gs]);
    if (!has.has(`${x + gs},${y}`)) seg.push([x + gs, y, x + gs, y + gs]);
  }
  return seg;
}

// On the map: during a combat the limits of every Aura are drawn (a line with a soft glow); hovering a token always shows its Aura, and also
// tints the squares it covers. Each Aura can have its own colors. Every client draws it (the GM's client is the one that applies the effects).
const LAYER = "twod12-aura", overlays = new Map();
let hoveredId = null, drawTimer = null;
const outlinesOn = () => { try { return game.settings.get("twod12", "auraOutlines") !== false; } catch (e) { return true; } };
const gridOk = () => !!(canvas?.ready && canvas.scene && canvas.grid && canvas.grid.type !== 0 && !canvas.grid.isHexagonal);

function strokeSegments(g, segs, color, width, alpha) {
  if (!segs.length) return;
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); for (const [a, b, c, d] of segs) { g.moveTo(a, b); g.lineTo(c, d); } }   // PixiJS 7
  else { for (const [a, b, c, d] of segs) { g.moveTo(a, b); g.lineTo(c, d); } g.stroke({ width, color, alpha, cap: "round", join: "round" }); }   // PixiJS 8
}
function clearOverlays() {
  for (const h of overlays.values()) { try { h.parent?.removeChild(h); h.destroy({ children: true }); } catch (e) { /* already gone */ } }
  overlays.clear();
  try { canvas?.interface?.grid?.clearHighlightLayer?.(LAYER); } catch (e) { /* nothing drawn */ }
}
export const clearAura = () => { hoveredId = null; clearOverlays(); };

export function redrawAuras() {
  clearOverlays();
  if (!gridOk()) return;
  try {
    const inCombat = !!game.combat?.started && outlinesOn(), gs = canvas.grid.size;
    const tokens = (canvas.tokens?.placeables ?? []).filter(t => t.actor && (game.user.isGM || (!t.document.hidden && t.visible !== false)));
    for (const t of tokens) {
      if (!inCombat && t.id !== hoveredId) continue;
      const sources = sourcesOf([t]);
      if (!sources.length) continue;
      const holder = new PIXI.Container(), grid = canvas.interface?.grid;
      for (const src of sources) {
        if (src.aura.show === false) continue;   // v0.0.323: "Shown on the map" off: it works, it isn't drawn
        const cells = auraCells(t, Math.max(1, Number(src.aura.size) || 1), gs, tokenDistance), { outline, fill } = auraColors(src.aura);
        const segs = outlineSegments(cells, gs), glow = new PIXI.Graphics(), line = new PIXI.Graphics();
        strokeSegments(glow, segs, outline, 8, 0.22);
        strokeSegments(line, segs, outline, 3, 0.95);
        holder.addChild(glow, line);
        if (t.id === hoveredId && grid?.highlightPosition) {   // the squares it covers, only on hover
          if (!grid.highlightLayers?.[LAYER]) grid.addHighlightLayer(LAYER);
          for (const c of cells) grid.highlightPosition(LAYER, { x: c.x, y: c.y, color: fill, border: fill, alpha: 0.22 });
        }
      }
      (canvas.interface ?? canvas.stage).addChild(holder);
      overlays.set(t.id, holder);
    }
  } catch (e) { console.warn("twod12 | aura drawing", e); }
}
export function scheduleAuraDraw() { clearTimeout(drawTimer); drawTimer = setTimeout(redrawAuras, 120); }

export function registerAuraHooks() {
  const poke = () => { scheduleAuraRefresh(); scheduleAuraDraw(); };
  Hooks.on("hoverToken", (token, hovered) => { hoveredId = hovered ? token.id : (hoveredId === token.id ? null : hoveredId); redrawAuras(); });
  Hooks.on("canvasTearDown", () => { clearTimeout(drawTimer); clearAura(); });
  Hooks.on("updateToken", (doc, ch) => { if (["x", "y", "width", "height", "hidden", "disposition"].some(k => k in ch)) poke(); });
  for (const h of ["createToken", "deleteToken", "canvasReady", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect", "createCombat", "deleteCombat", "combatStart", "updateCombat", "createItem", "deleteItem", "updateItem"]) Hooks.on(h, poke);
  Hooks.on("sightRefresh", scheduleAuraDraw);
  Hooks.on("updateActor", (a, ch) => { if (ch?.system && "escalation" in ch.system) poke(); });
}
