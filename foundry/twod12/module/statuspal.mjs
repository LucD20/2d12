// v0.0.500 (Lucas on v0.0.499):
//   - "Can the assign status effect window on the token show each category instead of just a list? Even better if it can show the names": the
//     Token HUD's status palette is grouped (Health, Movement, Senses, Harmful, Helpful; the book has no groups: Claude's) and each icon has its
//     name beside it. Foundry's own icons are kept (moved into the groups), so its click and right-click still work on them; a click on a name
//     clicks its icon.
//   - "Numbers of conditions dont show in the token": a condition with a value (Vulnerable 1, Slowed 2, Exhausted 3) shows its number on its icon
//     on the map (a badge drawn over the icon's corner).
// Pure helpers first (the tests load them).

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
      // a click (or right-click) on the name is a click on its icon (Foundry's handlers stay on the icon)
      for (const type of ["click", "contextmenu"]) name.addEventListener(type, ev => { ev.preventDefault(); ev.stopPropagation(); icon.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "contextmenu" ? 2 : 0 })); });
      row.append(name);
      list.append(row);
    }
    frag.append(sec);
  }
  pal.replaceChildren(frag);
  return true;
}

/* ---- the numbers on the map's icons ---- */
function numberText(n, size) {
  const t = new PIXI.Text(String(n), { fontFamily: "Source Sans 3, Signika, sans-serif", fontSize: Math.max(10, Math.round(size * 0.62)), fontWeight: "800", fill: 0xffffff, stroke: 0x000000, strokeThickness: Math.max(3, Math.round(size * 0.16)), lineJoin: "round" });
  t.name = "twod12-cnum"; t.eventMode = "none"; t.zIndex = 10000;
  return t;
}
/** After Foundry draws a token's effect icons: each icon of an effect with a number gets it (the icon's zIndex is its effect's index). */
function addNumbers(token) {
  const box = token?.effects;
  if (!box?.children) return;
  for (const c of [...box.children]) if (c.name === "twod12-cnum") { box.removeChild(c); c.destroy(); }
  const list = token.actor?.temporaryEffects ?? [];
  for (const c of [...box.children]) {
    if (c === box.bg || c === box.overlay || !(c instanceof PIXI.Sprite)) continue;
    const n = effectNumber(list[c.zIndex]);
    if (n > 0) { c._twod12Num = numberText(n, c.height || 20); box.addChild(c._twod12Num); }
    else c._twod12Num = null;
  }
  placeNumbers(token);
}
function placeNumbers(token) {
  const box = token?.effects;
  for (const c of box?.children ?? []) {
    const t = c._twod12Num;
    if (!t || t.destroyed) continue;
    t.style.fontSize = Math.max(10, Math.round((c.height || 20) * 0.62));
    t.position.set(c.x + (c.width || 20) - t.width * 0.75, c.y + (c.height || 20) - t.height * 0.8);
  }
}

export function registerStatusPalette() {
  Hooks.on("renderTokenHUD", (app, html) => { try { groupPalette(app, html); } catch (e) { console.warn("twod12 | the status palette", e); } });
  Hooks.once("ready", () => {
    try {
      const P = CONFIG.Token?.objectClass?.prototype;
      if (!P || P._twod12Nums) return;
      P._twod12Nums = true;
      const draw = P._drawEffects, refresh = P._refreshEffects;
      if (typeof draw === "function") P._drawEffects = async function (...args) { const r = await draw.apply(this, args); try { addNumbers(this); } catch (e) { console.warn("twod12 | effect numbers", e); } return r; };
      if (typeof refresh === "function") P._refreshEffects = function (...args) { const r = refresh.apply(this, args); try { placeNumbers(this); } catch (e) { /* drawn next time */ } return r; };
      for (const t of canvas?.tokens?.placeables ?? []) t.renderFlags?.set?.({ redrawEffects: true });
    } catch (e) { console.warn("twod12 | effect numbers", e); }
  });
}
