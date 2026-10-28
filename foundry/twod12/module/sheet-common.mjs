// Helpers shared by the sheets (actor-sheets.mjs, item-sheet.mjs, versions.mjs).

export function applyTab(app) {
  const t = app._activeTab;
  app.element.querySelectorAll("[data-tab]").forEach(el => el.classList.toggle("active", el.dataset.tab === t));
  app.element.querySelectorAll("[data-tab-target]").forEach(el => el.classList.toggle("active", el.dataset.tabTarget === t));
}
/** How long an effect lasts, as shown on the sheet: "until Move · 1 round", "EoT", "2 rounds". */
export function durationText(e) {
  const paren = e.name.match(/\(([^)]*)\)\s*$/)?.[1] ?? "";
  const d = e.getFlag?.("twod12", "duration") ?? {}, left = e.getFlag?.("twod12", "remaining");
  const bits = [];
  if (paren && !/^\d/.test(paren)) bits.push(paren);
  if (d.type === "eot") bits.push("EoT");
  else if (d.type === "rounds") { const n = left ?? d.rounds ?? 1; bits.push(`${n} round${n === 1 ? "" : "s"}`); }
  const label = e.duration?.label ?? "";
  return bits.join(" \u00b7 ") || (label === "None" ? "" : label);
}
export const dragData = ev => { try { return JSON.parse(ev.dataTransfer.getData("text/plain")); } catch { return null; } };
