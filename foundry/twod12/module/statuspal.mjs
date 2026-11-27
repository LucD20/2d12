// v0.0.500 (Lucas on v0.0.499):
//   - "Can the assign status effect window on the token show each category instead of just a list? Even better if it can show the names": the
//     Token HUD's status palette is grouped (Health, Movement, Senses, Harmful, Helpful; the book has no groups: Claude's) and each icon has its
//     name beside it. Foundry's own icons are kept (moved into the groups); v0.0.503: the whole row is the button (groupPalette).
//   - (v0.0.501: the numbers on the map's icons are the numbered icons of condnum.mjs; v0.0.500's drawing over Foundry's effect sprites showed
//     nothing and is gone. effectNumber stays for the tests.)
// Pure helpers first (the tests load them).

/**
 * v0.0.530 (Lucas on v0.0.521, hq-lingering: "Lingering should be allowed to be applied from the token hud even when one is already on"; book,
 * Chapter 8, Several Lingerings): a click on Lingering when the creature has one asks in the pick bar: add another, or end one of those it has
 * (each by its text). Pure: the options. list: [{ id, text }] (the creature's Lingerings).
 */
export const lingeringChoices = list => [{ id: "__add", label: "Add another Lingering" }, ...(list ?? []).map(x => ({ id: x.id, label: `End ${x.text}` }))];

export const STATUS_GROUPS = [
  { key: "health", label: "Health", ids: ["bloodied", "strained", "desperate", "dying", "shattered", "unconscious", "dead"] },
  { key: "movement", label: "Movement", ids: ["prone", "hindered", "immobilized", "grabbed", "slowed", "squeezing", "leaning"] },
  { key: "senses", label: "Senses", ids: ["blinded", "half-blinded", "obscured", "hidden", "unsensed", "called-out"] },
  { key: "harmful", label: "Harmful", ids: ["vulnerable", "daunted", "dazed", "pressed", "sickened", "staggered", "taunted", "imperiled", "bleed", "exhausted"] },
  { key: "helpful", label: "Helpful", ids: ["empowered", "quickened"] }
];

/** Pure: the status ids in groups, in the groups' order; an id in no group goes to "Other" at the end. -> [{ key, label, ids }] */
export function groupStatuses(ids = []) {
  const have = new Set(ids), placed = new Set();
  const out = STATUS_GROUPS.map(g => ({ key: g.key, label: g.label, ids: g.ids.filter(id => have.has(id)) })).filter(g => g.ids.length);
  for (const g of out) for (const id of g.ids) placed.add(id);
  const rest = ids.filter(id => !placed.has(id));
  if (rest.length) out.push({ key: "other", label: "Other", ids: rest });
  return out;
}

/** Pure: the number an effect shows on the map: its value flag, else the number its name ends with ("Vulnerable 1"); 0 for none. */
export function effectNumber(e) {
  const v = Math.trunc(Number(e?.flags?.twod12?.value ?? e?.getFlag?.("twod12", "value")));
  if (Number.isFinite(v) && v > 0) return v;
  const m = String(e?.name ?? "").trim().match(/\s(\d+)$/);
  return m ? Number(m[1]) : 0;
}

const nameOf = id => (CONFIG.statusEffects ?? []).find(s => s.id === id)?.name ?? id;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** The Token HUD's status palette, grouped and named. */
export function groupPalette(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const pal = root?.querySelector?.(".status-effects");
  if (!pal || pal.dataset.twod12Grouped) return false;
  const icons = [...pal.querySelectorAll("[data-status-id]")];
  if (!icons.length) return false;
  pal.dataset.twod12Grouped = "1";
  pal.classList.add("twod12-statuspal");
  const byId = new Map(icons.map(el => [el.dataset.statusId, el]));
  const frag = document.createDocumentFragment();
  for (const g of groupStatuses(icons.map(el => el.dataset.statusId))) {
    const sec = document.createElement("section");
    sec.className = `twod12-sg ${g.key}`;
    sec.innerHTML = `<h4>${esc(g.label)}</h4><div class="twod12-sg-list"></div>`;
    const list = sec.querySelector(".twod12-sg-list");
    for (const id of g.ids) {
      const icon = byId.get(id), row = document.createElement("div");
      row.className = "twod12-sitem";
      row.append(icon);
      const name = document.createElement("span");
      name.className = "twod12-sname";
      name.textContent = nameOf(id);
      row.append(name);
      row.dataset.statusRow = id;
      list.append(row);
    }
    frag.append(sec);
  }
  pal.replaceChildren(frag);
  // v0.0.503 (Lucas on v0.0.502: "it should allow to click on the whole selection box it appears when you hover"; "Right-clicking isnt reducing"):
  // the whole row is the button, and the system handles it itself (Foundry's handler on the icon no longer reached the valued rule): a click
  // toggles the condition (a valued one already on: +1; Shift: its settings, Ctrl: remove), a right-click lowers a valued one by 1 (at 1 it goes)
  // or does Foundry's right-click on the others (effects.mjs wrapConditions, through toggleStatusEffect)
  const actor = (app?.document ?? app?.object)?.actor;
  const act = async (ev, right) => {
    const row = ev.target.closest?.("[data-status-row]");
    if (!row || !actor) return;
    ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation?.();
    const id = row.dataset.statusRow, on = !!actor.statuses?.has?.(id);
    // v0.0.530 (hq-lingering): Lingering already on: another one (of another subtype, they run together), or end one, in the pick bar
    if (id === "bleed" && on && !right) {
      try {
        const { bleedOf, bleedText } = await import("./condrules.mjs"), { pickBar } = await import("./pickbar.mjs"), { esc } = await import("./util.mjs");
        const list = [...(actor.effects ?? [])].filter(e => !e.disabled && bleedOf(e)).map(e => ({ id: e.id, text: bleedText(bleedOf(e)) }));
        const pick = await pickBar({ icon: "fa-droplet", text: `<b>Lingering</b>: ${esc(actor.name)} has ${list.length === 1 ? "one" : list.length}. Add another, or end one?`, options: lingeringChoices(list), cancel: "Cancel" }).catch(() => "");
        if (pick === "__add") await actor.toggleStatusEffect(id, { active: true, twod12Add: true });
        else if (pick) await actor.effects.get(pick)?.delete();
      } catch (e) { console.warn("twod12 | Lingering from the HUD", e); }
      try { globalThis.canvas?.hud?.token?.render?.(); } catch (e) { /* no HUD open */ }
      return;
    }
    try { await actor.toggleStatusEffect(id, right ? { overlay: true, active: on } : { active: !on }); }
    catch (e) { console.warn("twod12 | the status palette", e); }
    try { globalThis.canvas?.hud?.token?.render?.(); } catch (e) { /* no HUD open */ }
  };
  pal.addEventListener("click", ev => act(ev, false), true);
  pal.addEventListener("contextmenu", ev => act(ev, true), true);
  return true;
}

/* ---- v0.0.533 (Lucas, 2026-11-27, on v0.0.532's pt-fxzoom: "No, not the token icons, I mean the right click -> active effect window"): the Token
   HUD lives in #hud, which Foundry scales with the canvas, so zoomed out the status palette shrank with the map. Zoomed out, the palette is scaled
   back by the inverse of the canvas's scale (the CSS `scale` property, which composes with any transform Foundry gives it, from its top-left corner:
   it stays on its button's side and keeps its centre line), so it keeps its normal size on screen; at 100% or closer it is left alone (never grown).
   Zoomed out and pushed past the window's edge, it is moved back inside. Only the palette: the HUD's buttons and bars stay as Foundry draws them. ---- */
export const PALETTE_MAX_SCALE = 4;
/** Pure: the palette's scale for a canvas scale: 1 at 1 and above, 1 / scale below, at most PALETTE_MAX_SCALE (a scale of 0 or nonsense: 1). */
export function paletteScale(z, max = PALETTE_MAX_SCALE) {
  const s = Number(z);
  if (!Number.isFinite(s) || s <= 0 || s >= 1) return 1;
  return Math.min(max, 1 / s);
}
/**
 * Pure: the shift (in screen pixels) that brings a box back inside the window, with a margin. rect: { left, top, right, bottom } on screen. A box
 * bigger than the window keeps its top-left corner at the margin. -> { dx, dy }
 */
export function clampShift(rect, w, h, margin = 8) {
  const fit = (lo, hi, size) => (hi - lo > size - 2 * margin ? margin - lo : lo < margin ? margin - lo : hi > size - margin ? size - margin - hi : 0);
  return { dx: fit(rect.left, rect.right, w), dy: fit(rect.top, rect.bottom, h) };
}
/** The open palette (if any) at the canvas's scale: its scale, then a shift back inside the window (in its own units: the HUD's scale undone). */
function fitPalette() {
  const pal = document.querySelector("#token-hud .twod12-statuspal");
  if (!pal) return;
  const z = Number(globalThis.canvas?.stage?.scale?.x) || 1, k = paletteScale(z);
  pal.style.setProperty("--twod12-palk", String(k));
  pal.style.setProperty("--twod12-paldx", "0px"); pal.style.setProperty("--twod12-paldy", "0px");
  if (k === 1) return;   // at 100% or closer: as Foundry draws it
  const r = pal.getBoundingClientRect();
  if (!r.width || !r.height) return;   // closed
  const { dx, dy } = clampShift(r, window.innerWidth, window.innerHeight);
  if (dx) pal.style.setProperty("--twod12-paldx", `${dx / z}px`);
  if (dy) pal.style.setProperty("--twod12-paldy", `${dy / z}px`);
}
let fitQueued = false;
const queueFit = () => { if (fitQueued) return; fitQueued = true; requestAnimationFrame(() => { fitQueued = false; try { fitPalette(); } catch (e) { /* the HUD is closing */ } }); };

export function registerStatusPalette() {
  Hooks.on("renderTokenHUD", (app, html) => {
    try { groupPalette(app, html); } catch (e) { console.warn("twod12 | the status palette", e); }
    // v0.0.533: its size on screen, now and each time it opens (Foundry toggles its "active" class)
    try {
      const root = html instanceof HTMLElement ? html : (html?.[0] ?? app?.element), pal = root?.querySelector?.(".twod12-statuspal");
      if (pal && !pal.dataset.twod12Fit) { pal.dataset.twod12Fit = "1"; new MutationObserver(queueFit).observe(pal, { attributes: true, attributeFilter: ["class"] }); }
      queueFit();
    } catch (e) { console.warn("twod12 | the status palette's size", e); }
  });
  Hooks.on("canvasPan", queueFit);
}
