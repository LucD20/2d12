// 2d12 Tools drawer: consolidates the system's Token Controls buttons (map overlays, 3D height calculators,
// world clock, and GM utilities) behind one clean Token Controls button so Foundry's toolbar stays uncluttered.
import { esc } from "./util.mjs";
import { loeShown, setLoEFollow, heightShortcut, redraw as redrawLoE } from "./loe.mjs";
import { flankingShown, toggleFlanking } from "./flankoverlay.mjs";
import { rangeRingsShown, toggleRangeRings } from "./rangeoverlay.mjs";
import { lightOverlayShown, toggle as toggleLightOverlay } from "./lightoverlay.mjs";
import { AreaHeightWindow } from "./areaheight.mjs";
import { WorldClock } from "./clock.mjs";
import { openBuilder } from "./builder.mjs";
import { toggleDamageReport } from "./damagelog.mjs";
import { toggleEncounterLog } from "./enclog.mjs";

let open = false, panel = null;

/** Pure: describe the grouped tool entries for a user (GM tools only for GMs). */
export function toolboxGroups({ isGM = false, active = {} } = {}) {
  const groups = [
    {
      title: "Map Overlays",
      items: [
        { id: "loe", label: "Line of Effect & Cover", sub: "Cover lines & 3D distance to targets", icon: "fa-bezier-curve", toggle: true, on: !!active.loe },
        { id: "range", label: "Weapon Range & Reach", sub: "Normal / Far / Max & melee threat", icon: "fa-bullseye", toggle: true, on: !!active.range },
        { id: "flank", label: "Show Flanking", sub: "Flankers, Field Boons & cancels", icon: "fa-people-arrows", toggle: true, on: !!active.flank },
        { id: "light", label: "Light Levels Overlay", sub: "Bright clear, yellow Dim, red Dark", icon: "fa-lightbulb", toggle: true, on: !!active.light }
      ]
    },
    {
      title: "3D & Rules Tools",
      items: [
        { id: "height", label: "Cover Height (3D)", sub: "Side view between token & target", icon: "fa-mountain" },
        { id: "areaheight", label: "Area Height (3D)", sub: "Burst, Emanation & Line heights", icon: "fa-cube" },
        { id: "clock", label: "World Clock", sub: "In-world time, light & rest", icon: "fa-clock" }
      ]
    }
  ];
  if (isGM) {
    groups.push({
      title: "GM Tools",
      items: [
        { id: "enclog", label: "Encounter Log", sub: "Turn-by-turn encounter history", icon: "fa-book-open" },
        { id: "report", label: "Damage Report", sub: "Per-creature damage totals", icon: "fa-chart-column" },
        { id: "button", label: "Create Chat Button", sub: "Build inline check/save/move chip", icon: "fa-square-plus" }
      ]
    });
  }
  return groups;
}

/** Pure: HTML for the floating 2d12 Tools drawer. */
export function toolboxHtml(opts = {}) {
  const groups = toolboxGroups(opts);
  const activeCount = groups.flatMap(g => g.items).filter(x => x.toggle && x.on).length;
  const body = groups.map(g => `<section class="tbx-sec"><h4>${esc(g.title)}</h4><div class="tbx-list">${g.items.map(it =>
    `<button type="button" class="tbx-btn${it.toggle ? " is-tog" : ""}${it.on ? " on" : ""}" data-tool="${esc(it.id)}"${it.toggle ? ` aria-pressed="${it.on}"` : ""}>` +
    `<span class="tbx-ic"><i class="fa-solid ${esc(it.icon)}" aria-hidden="true"></i></span>` +
    `<span class="tbx-txt"><span class="tbx-lbl">${esc(it.label)}</span><span class="tbx-sub">${esc(it.sub)}</span></span>` +
    `${it.toggle ? `<span class="tbx-pill${it.on ? " on" : ""}">${it.on ? "ON" : "OFF"}</span>` : '<span class="tbx-go"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>'}` +
    `</button>`).join("")}</div></section>`).join("");
  return `<div class="tbx-head"><span class="tbx-ttl"><i class="fa-solid fa-compass-drafting" aria-hidden="true"></i> 2d12 Tools${activeCount ? ` <span class="tbx-cnt">${activeCount} on</span>` : ""}</span><button type="button" class="tbx-close" data-tool="close" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><div class="tbx-body">${body}</div>`;
}

const currentActive = () => ({ loe: loeShown(), range: rangeRingsShown(), flank: flankingShown(), light: lightOverlayShown() });
export const anyOverlayActive = () => Object.values(currentActive()).some(Boolean);

function runTool(id) {
  if (id === "close") return closeToolbox();
  if (id === "loe") setLoEFollow(!loeShown());
  else if (id === "range") toggleRangeRings(!rangeRingsShown());
  else if (id === "flank") { toggleFlanking(!flankingShown()); redrawLoE(); }
  else if (id === "light") toggleLightOverlay(!lightOverlayShown());
  else if (id === "height") { heightShortcut(); closeToolbox(); return; }
  else if (id === "areaheight") { AreaHeightWindow.open(); closeToolbox(); return; }
  else if (id === "clock") { WorldClock.open(); closeToolbox(); return; }
  else if (id === "enclog") { toggleEncounterLog(); closeToolbox(); return; }
  else if (id === "report") { toggleDamageReport(); closeToolbox(); return; }
  else if (id === "button") { openBuilder(); closeToolbox(); return; }
  renderToolbox();
  syncControlButton();
}

function syncControlButton() {
  try {
    const btn = document.querySelector('#controls [data-tool="twod12-tools"], #scene-controls [data-tool="twod12-tools"], button[data-tool="twod12-tools"]');
    if (btn) btn.classList.toggle("active", open || anyOverlayActive());
  } catch (e) { /* no DOM */ }
}

function positionPanel() {
  if (!panel) return;
  try {
    const btn = document.querySelector('#controls [data-tool="twod12-tools"], #scene-controls [data-tool="twod12-tools"], button[data-tool="twod12-tools"]');
    const r = btn?.getBoundingClientRect?.();
    if (r && r.width > 0) {
      const left = Math.round(r.right + 10);
      const top = Math.max(12, Math.min(Math.round(r.top), Math.max(12, window.innerHeight - 460)));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      return;
    }
  } catch (e) { /* fallback */ }
  panel.style.left = "110px";
  panel.style.top = "84px";
}

function renderToolbox() {
  if (!panel) return;
  panel.innerHTML = toolboxHtml({ isGM: !!game.user?.isGM, active: currentActive() });
  positionPanel();
}

export function closeToolbox() {
  open = false;
  panel?.remove();
  panel = null;
  syncControlButton();
}

export function toggleToolbox(force = null) {
  const next = force === null ? !open : !!force;
  if (!next) return closeToolbox();
  open = true;
  if (!panel) {
    panel = document.createElement("aside");
    panel.id = "twod12-toolbox";
    panel.className = "twod12 twod12-toolbox";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "2d12 Tools");
    panel.addEventListener("click", ev => {
      const b = ev.target.closest("button[data-tool]");
      if (b) { ev.preventDefault(); ev.stopPropagation(); runTool(b.dataset.tool); }
    });
    document.body.appendChild(panel);
  }
  renderToolbox();
  syncControlButton();
}

/** Add the single 2d12 Tools button to Foundry's Token Controls (V12 array or V13+/V14 keyed object). */
export function addToolboxControl(controls) {
  const tool = {
    name: "twod12-tools",
    title: "2d12 Tools: overlays, 3D height calculators, clock, and GM tools",
    icon: "fa-solid fa-compass-drafting",
    button: true,
    visible: true,
    active: open || anyOverlayActive()
  };
  if (Array.isArray(controls)) {
    const tc = controls.find(c => c.name === "token");
    if (tc && !tc.tools.some(x => x.name === tool.name)) tc.tools.push({ ...tool, onClick: () => toggleToolbox() });
    return;
  }
  const tc = controls?.tokens ?? controls?.token;
  if (!tc?.tools) return;
  tc.tools[tool.name] = { ...tool, order: Object.keys(tc.tools).length + 1, onChange: () => toggleToolbox() };
}

export function registerToolbox() {
  Hooks.on("getSceneControlButtons", controls => { try { addToolboxControl(controls); } catch (e) { console.warn("twod12 | toolbox control", e); } });
  Hooks.on("canvasTearDown", () => closeToolbox());
  globalThis.window?.addEventListener?.("keydown", ev => { if (ev.key === "Escape" && open) { ev.preventDefault(); closeToolbox(); } });
}
