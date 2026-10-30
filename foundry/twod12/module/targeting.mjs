// Targeting mode (v0.0.189, Lucas): an Action that needs targets, used with nothing targeted, doesn't stop with a warning any more.
// The open windows collapse, a banner asks for the creatures, and each left click on a token targets it (T works as usual; clicking a
// targeted token again un-targets it). Cancel (or Escape) stops; No target rolls against a DC (13, editable). When enough creatures are targeted, the windows come back and the
// Action goes on to its roll dialog.
import { esc } from "./util.mjs";
const BANNER = "twod12-targeting";

/** Collapse every open window; returns the ones to bring back. */
function collapseWindows() {
  const out = [];
  for (const app of foundry.applications?.instances?.values?.() ?? []) {
    if (!app.rendered || app.minimized || app.id === BANNER || app.options?.window?.frame === false) continue;
    try { app.minimize(); out.push(app); } catch (e) { /* not minimizable */ }
  }
  for (const app of Object.values(globalThis.ui?.windows ?? {})) {
    if (!app.rendered || app._minimized) continue;
    try { app.minimize(); out.push(app); } catch (e) { /* not minimizable */ }
  }
  return out;
}

// v0.0.191 (Lucas): the banner sits at the bottom, above the macro bar, and can be dragged by its grip; where it was left is kept (per user).
const POS_KEY = "twod12.targetingPos";
export function placeBar(bar) {
  let pos = null;
  try { pos = JSON.parse(localStorage.getItem(POS_KEY) ?? "null"); } catch (e) { /* no storage */ }
  if (pos && Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
    bar.style.left = `${Math.min(Math.max(0, pos.left), window.innerWidth - 80)}px`;
    bar.style.top = `${Math.min(Math.max(0, pos.top), window.innerHeight - 40)}px`;
    bar.style.bottom = "auto"; bar.style.transform = "none";
  }
  bar.querySelector(".tb-grip")?.addEventListener("pointerdown", ev => {
    ev.preventDefault();
    const r = bar.getBoundingClientRect(), dx = ev.clientX - r.left, dy = ev.clientY - r.top;
    const move = e => { bar.style.left = `${e.clientX - dx}px`; bar.style.top = `${e.clientY - dy}px`; bar.style.bottom = "auto"; bar.style.transform = "none"; };
    const up = () => {
      document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up);
      const q = bar.getBoundingClientRect();
      try { localStorage.setItem(POS_KEY, JSON.stringify({ left: Math.round(q.left), top: Math.round(q.top) })); } catch (e) { /* no storage */ }
    };
    document.addEventListener("pointermove", move); document.addEventListener("pointerup", up);
  });
}

/** Pure: how the banner reads ("Aim: target 1 creature (0 of 1)"). */
export const bannerText = (name, need, have) => `${name}: target ${need} creature${need === 1 ? "" : "s"} (${have} of ${need}). Click a token, or press T over it.`;

/**
 * Ask for `need` targets on the map. Resolves { ok: true } once the user has that many (counting the ones already targeted),
 * { ok: true, noTarget: true, dc } when "No target" is clicked (the roll goes on against that DC), and { ok: false } on Cancel or Esc.
 * v0.0.190 (Lucas): buttons on the banner instead of the right click (which pans the map). Without a map it resolves null at once.
 */
export function pickTargets(need, name) {
  if (typeof canvas === "undefined" || !canvas?.ready || typeof document === "undefined") return Promise.resolve(null);   // no map: the caller goes on as before
  return new Promise(resolve => {
    const restore = collapseWindows();
    const view = canvas.app?.view ?? canvas.app?.canvas;
    const bar = document.createElement("div");
    bar.id = BANNER;
    bar.className = "twod12-targeting twod12-bar";
    bar.innerHTML = `<i class="fa-solid fa-grip-vertical tb-grip" data-tooltip="Drag to move"></i><span class="tb-text"></span><span class="tb-btns"><label class="tb-dc" data-tooltip="Roll with no target, against this DC"><button type="button" data-tb="none"><i class="fa-solid fa-ban"></i> No target</button> DC <input type="number" value="13" min="0"></label><button type="button" data-tb="cancel"><i class="fa-solid fa-xmark"></i> Cancel</button></span>`;
    const draw = () => { bar.querySelector(".tb-text").innerHTML = `<i class="fa-solid fa-crosshairs"></i> ${esc(bannerText(name, need, game.user.targets.size))}`; };
    draw();
    document.body.append(bar);
    placeBar(bar);
    let done = false;
    const finish = res => {
      if (done) return;
      done = true;
      Hooks.off("targetToken", onTarget);
      view?.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
      bar.remove();
      for (const app of restore) { try { app.maximize(); } catch (e) { /* closed meanwhile */ } }
      resolve(res);
    };
    bar.querySelector('[data-tb="cancel"]').addEventListener("click", () => finish({ ok: false }));
    bar.querySelector('[data-tb="none"]').addEventListener("click", () => {
      for (const t of [...game.user.targets]) t.setTarget(false, { releaseOthers: false });
      finish({ ok: true, noTarget: true, dc: Math.max(0, Math.trunc(Number(bar.querySelector(".tb-dc input").value)) || 13) });
    });
    const onTarget = user => { if (user?.id !== game.user.id) return; draw(); if (game.user.targets.size >= need) finish({ ok: true }); };
    const onDown = ev => {
      if (ev.button !== 0) return;
      const p = canvas.canvasCoordinatesFromClient?.({ x: ev.clientX, y: ev.clientY });
      if (!p) return;
      const hits = canvas.tokens.placeables.filter(t => t.visible && t.bounds?.contains(p.x, p.y));
      const tok = hits.at(-1);
      if (!tok) return;
      ev.stopPropagation(); ev.preventDefault();
      tok.setTarget(!tok.isTargeted, { releaseOthers: false });
    };
    const onKey = ev => { if (ev.key === "Escape") { ev.stopPropagation(); ev.preventDefault(); finish({ ok: false }); } };
    Hooks.on("targetToken", onTarget);
    view?.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey, true);
  });
}

/** Does this Action pick creatures on the map (a Target line, not Self, no Area)? */
export const needsTargets = it => { const t = String(it?.targets ?? "").trim(); return !!t && !/^(all|allies|you and)\b/i.test(t) && !it?.traits?.has?.("self") && !String(it?.area ?? "").trim(); };
