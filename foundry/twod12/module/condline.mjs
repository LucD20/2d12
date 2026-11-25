// v0.0.504 (Lucas, 2026-11-25, on the number of a token's conditions: "C is good"): while Alt is held, every visible token shows a short line of
// its conditions under it (and under its name): "Vulnerable 1 · Slowed 2 · Prone", the number of each valued one, on a dark plate. Nothing pops up
// as the mouse moves (the tooltip rule); Foundry's own Alt shows the names at the same time. Pure helpers first (the tests load them).
import { roundRectFill, roundRectStroke } from "./healthbar.mjs";

const F = "twod12";

/** Pure: an effect's short name with its number ("Vulnerable 1 (1 round)" -> "Vulnerable 1"; a value flag adds the number its name lacks). */
export function condWord(e) {
  const name = String(e?.name ?? "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  const v = Math.trunc(Number(e?.flags?.[F]?.value ?? e?.getFlag?.(F, "value")));
  return Number.isFinite(v) && v > 0 && !/\s\d+$/.test(name) ? `${name} ${v}` : name;
}
/** Pure: the conditions a creature shows (as the HUD's row: not disabled, not a Wound, not a granted use), as one line; "" for none. */
export function condLine(effects = []) {
  const flag = (e, k) => e?.flags?.[F]?.[k] ?? e?.getFlag?.(F, k);
  const words = [...effects].filter(e => e && !e.disabled && !flag(e, "wound") && !(flag(e, "grants") ?? []).length).map(condWord).filter(Boolean);
  return [...new Set(words)].join(" · ");
}

let shown = false;
const NAME = "twod12-condline";
function clear() { for (const t of canvas?.tokens?.placeables ?? []) for (const c of (t.children ?? []).filter(c => c.name === NAME)) { t.removeChild(c); c.destroy({ children: true }); } }
function drawOne(t) {
  for (const c of (t.children ?? []).filter(c => c.name === NAME)) { t.removeChild(c); c.destroy({ children: true }); }
  if (!t.visible || !t.actor) return;
  const text = condLine(t.actor.effects ?? []);
  if (!text) return;
  const size = canvas.dimensions?.size ?? 100, fontSize = Math.max(11, Math.round(size * 0.17));
  const PT = globalThis.foundry?.canvas?.containers?.PreciseText ?? globalThis.PreciseText ?? globalThis.PIXI.Text;
  const txt = new PT(text, { fontFamily: "Signika, system-ui, sans-serif", fontSize, fontWeight: "700", fill: 0xf0ece4, wordWrap: true, wordWrapWidth: Math.max(t.w * 1.8, size * 1.6), align: "center" });
  txt.anchor?.set?.(0.5, 0);
  const padX = Math.round(fontSize * 0.5), padY = Math.round(fontSize * 0.25), w = txt.width + padX * 2, h = txt.height + padY * 2;
  const plate = new PIXI.Container();
  plate.name = NAME; plate.eventMode = "none"; plate.zIndex = 1000;
  const g = new PIXI.Graphics();
  roundRectFill(g, -w / 2, 0, w, h, 3, 0x0b0b0d, 0.88);
  roundRectStroke(g, -w / 2, 0, w, h, 3, 1.5, 0xc9a227, 0.85);
  txt.position.set(0, padY);
  plate.addChild(g, txt);
  const np = t.nameplate, below = np?.visible && np?.text ? np.y + np.height + 3 : t.h + 4;
  plate.position.set(t.w / 2, below);
  t.addChild(plate);
}
function drawAll() { if (!shown || !canvas?.ready) return; for (const t of canvas.tokens?.placeables ?? []) { try { drawOne(t); } catch (e) { /* that token: none */ } } }
const set = on => { if (on === shown) return; shown = on; if (on) drawAll(); else clear(); };

export function registerCondLine() {
  const typing = ev => { const el = ev.target; return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)); };
  globalThis.window?.addEventListener?.("keydown", ev => { if (ev.key === "Alt" && !ev.repeat && !typing(ev)) setTimeout(() => set(true), 0); });
  globalThis.window?.addEventListener?.("keyup", ev => { if (ev.key === "Alt") set(false); });
  globalThis.window?.addEventListener?.("blur", () => set(false));
  // while it is shown, a change redraws it (Foundry's Alt also redraws the name plates)
  for (const h of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) Hooks.on(h, () => { if (shown) queueMicrotask(drawAll); });
  Hooks.on("refreshToken", t => { if (shown) { try { drawOne(t); } catch (e) { /* none */ } } });   // that token only (its name plate may have moved)
  Hooks.on("canvasTearDown", () => { shown = false; });
}
