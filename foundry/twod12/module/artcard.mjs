// v0.0.454 (Lucas, playtest 6, D4: "Using an Art should open a window like the right click on an Art in the token hud ... the clicking should show the
// same"; the mockup foundry/mockups/pt6, his answer "Proposed A yes"): a click on an Art (the sheet's stamp, the HUD's) opens its card, floating by
// what was clicked, with a top line (its name, "Art · Once per round", "Choose a Mode"); each Mode's "Use · 1 AP" uses that Mode. Escape, the ×
// or a click elsewhere closes it and spends nothing. It replaces the pick window with the Modes' names.
import { esc } from "./util.mjs";

let lastEl = null, open = null;
if (typeof document !== "undefined") document.addEventListener("pointerdown", ev => { if (!open?.contains?.(ev.target)) lastEl = ev.target; }, true);

const ONCE = { atwill: "At-will", turn: "Once per turn", round: "Once per round", encounter: "Once per encounter", daily: "Once per day" };

/** The card's top line (pure). */
export const artHeadHtml = (name, freq, kind = "Art") => `<div class="ac-top"><b class="ac-name">${esc(name)}</b><span class="ac-kind">${esc(kind || "Art")}${ONCE[freq] ? ` · ${ONCE[freq]}` : ""}</span><span class="ac-ask">Choose a Mode</span></div>`;

/** Opens the Art's card; a Mode's Use button calls pick(mode, ap, { dialog }) (dialog: Shift was held). Returns the card element (or null with no DOM). */
export async function openArtCard(actor, item, pick, at = lastEl) {
  if (typeof document === "undefined") return null;
  open?.remove();
  const { buildActionCard } = await import("./actioncard.mjs");
  const { effectiveFrequency } = await import("./config.mjs");
  const div = document.createElement("div");
  div.className = "twod12-hudcard twod12-artcard";
  div.innerHTML = `<button type="button" class="hc-x" aria-label="Close the card">&times;</button>${artHeadHtml(item.name, effectiveFrequency(item.system), item.system?.category)}${await buildActionCard(item, { actor })}`;
  document.body.append(div);
  const r = at?.isConnected ? at.getBoundingClientRect() : { left: window.innerWidth / 2 - 180, top: window.innerHeight / 2, right: window.innerWidth / 2 + 180 };
  const w = div.offsetWidth, h = div.offsetHeight;
  // above what was clicked when it fits (the HUD's way), else beside it; always on the screen
  const above = r.top - h - 8 >= 8;
  div.style.left = `${Math.max(8, Math.min(above ? r.left : r.right + 8, window.innerWidth - w - 8))}px`;
  div.style.top = `${Math.max(8, Math.min(above ? r.top - h - 8 : r.top - 20, window.innerHeight - h - 8))}px`;
  open = div;
  const close = () => { div.remove(); if (open === div) open = null; document.removeEventListener("pointerdown", away, true); document.removeEventListener("keydown", key, true); };
  // v0.0.460 (Lucas, checklist v0.0.459: "Allow moving that window"): dragged by its top line; once moved it stays until the ×, Escape or a Use
  let moved = false;
  const away = ev => { if (!moved && !div.contains(ev.target)) close(); };
  const top = div.querySelector(".ac-top");
  top?.addEventListener("pointerdown", ev => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    const sx = ev.clientX, sy = ev.clientY, l0 = div.offsetLeft, t0 = div.offsetTop;
    const mv = e => { moved = true; div.style.left = `${Math.max(0, Math.min(l0 + e.clientX - sx, window.innerWidth - 40))}px`; div.style.top = `${Math.max(0, Math.min(t0 + e.clientY - sy, window.innerHeight - 30))}px`; };
    const up = () => { document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); };
    document.addEventListener("pointermove", mv); document.addEventListener("pointerup", up);
  });
  const key = ev => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); close(); } };
  setTimeout(() => { document.addEventListener("pointerdown", away, true); document.addEventListener("keydown", key, true); }, 0);
  div.addEventListener("click", ev => {
    if (ev.target.closest(".hc-x")) { ev.preventDefault(); return close(); }
    const b = ev.target.closest("[data-action='useVersion'][data-ap]");
    if (!b) return;
    ev.preventDefault(); ev.stopPropagation();
    close();
    // v0.0.460 (Lucas: "clicking on the ap sends directly to the chat ... (holding shift opens the roll dialog). These are faster actions")
    pick(b.dataset.mode ?? "", Number(b.dataset.ap) || 0, { dialog: !!ev.shiftKey });
  });
  return div;
}
