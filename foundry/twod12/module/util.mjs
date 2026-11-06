// Small helpers shared by every module (no Foundry needed, so the tests can load them).

/** Escape text for HTML (text and double-quoted attributes). */
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** The hover text of an effect or ability: its own "Hover text" if it has one, else the start of its description (plain text). */
/**
 * v0.0.253 (Lucas): the hover card of an effect or condition (a tooltip in the system's style): the name with its duration, a short description
 * (the item's, cut to its first sentences), and a small line with the controls. Shown through data-tooltip (Foundry renders it as HTML).
 */
export const shortText = (text, max = 260) => {
  const t = String(text ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max), end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > max * 0.4 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "\u2026").trim();
};
export const fxTipHtml = ({ name, dur = "", text = "", source = "", controls = "" }) => {
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<div class="twod12 fxtip"><div class="ft-head"><b>${e(name)}</b>${dur ? `<span class="ft-dur">${e(dur)}</span>` : ""}</div>${text ? `<div class="ft-text">${e(shortText(text))}</div>` : ""}${source ? `<div class="ft-src">${e(source)}</div>` : ""}${controls ? `<div class="ft-ctl">${e(controls)}</div>` : ""}</div>`;
};
/** v0.0.256: the attributes that make an element show an HTML card on hover: Foundry 13 reads data-tooltip-html, older versions data-tooltip (both are written). */
export const tipAttrs = html => { const e = String(html ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); return html ? `data-tooltip-html="${e}" data-tooltip="${e}"` : ""; };
export const hoverOf = (hover, description) => {
  const h = String(hover ?? "").trim();
  if (h) return h;
  return String(description ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
};
