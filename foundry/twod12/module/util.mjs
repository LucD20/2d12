// Small helpers shared by every module (no Foundry needed, so the tests can load them).

/**
 * v0.0.277 (Lucas: "forced deletion key -=ignoreTerrain using legacy syntax" on every turn start): removes a key in an update.
 * unset("flags.twod12.lean") is { "flags.twod12.lean": ForcedDeletion } where Foundry has it (V14), else the old { "flags.twod12.-=lean": null }.
 */
export function unset(path) {
  const FD = globalThis.foundry?.data?.operators?.ForcedDeletion;
  if (FD) return { [path]: new FD() };
  const k = String(path).split(".");
  k[k.length - 1] = `-=${k[k.length - 1]}`;
  return { [k.join(".")]: null };
}

/** Escape text for HTML (text and double-quoted attributes). */
/** v0.0.295 (Lucas): the Vs. value in its color: AD and WD as the NPC Builder (the Weapon / Power Modifier's), an Attribute (or its Save) in the Attribute's. */
export const VS_COLORS = { ad: "#9a4a00", wd: "#5b3a9e", body: "#7a1626", mind: "#17327a", appeal: "#6b4e00", instinct: "#14532d" };
export function vsColored(vs) {
  const e = String(vs ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return e.replace(/\b(AD|WD)\b|\b(Body|Mind|Appeal|Instinct)( Save)?\b/g, (m, d, a) => `<span class="vsv" style="color:${VS_COLORS[(d ?? a).toLowerCase()]};font-weight:700">${m}</span>`);
}
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
export const fxTipHtml = ({ name, dur = "", text = "", what = "", source = "", controls = "" }) => {   // v0.0.267: what (the effect's settings in a line)
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<div class="twod12 fxtip"><div class="ft-head"><b>${e(name)}</b>${dur ? `<span class="ft-dur">${e(dur)}</span>` : ""}</div>${text ? `<div class="ft-text">${e(shortText(text))}</div>` : ""}${what ? `<div class="ft-what">${e(shortText(what, 200))}</div>` : ""}${source ? `<div class="ft-src">${e(source)}</div>` : ""}${controls ? `<div class="ft-ctl">${e(controls)}</div>` : ""}</div>`;
};
/** v0.0.256: the attributes that make an element show an HTML card on hover: Foundry 13 reads data-tooltip-html, older versions data-tooltip (both are written). */
export const tipAttrs = html => { const e = String(html ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); return html ? `data-tooltip-html="${e}" data-tooltip="${e}"` : ""; };
export const hoverOf = (hover, description) => {
  const h = String(hover ?? "").trim();
  if (h) return h;
  return String(description ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
};
