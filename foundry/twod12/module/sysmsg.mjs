// The default look of the system's own chat messages (v0.0.203, Lucas: design "one line", mockup 2d12_Swap_chat_message.html).
// A card: the Action cards' title bar (sheet navy) with the name and a tight cost chip, then one bold line and one plain line.
// A line: a small parchment strip with an icon, for a short follow-up (no title bar).
import { cardHead, cardVars, apIcon, highlightText } from "./config.mjs";
import { esc } from "./util.mjs";

export const SYS_COLOR = "#1e2a3a";
// v0.0.221 (Lucas): the class documents' colors in the system's messages too (Bane red, Boon blue, Rally Point turquoise, AP, movement).
const hl = html => { try { return highlightText(html); } catch (e) { return html; } };
/** AP in the book's AP color ("5 AP"). */
export const apText = n => `<span class="kw-ap">${Math.max(0, Math.round(Number(n) || 0))} AP</span>`;
/** A card: title, cost (AP, or none), a bold lead line and a text line (both HTML). */
export const sysCard = ({ title, ap = null, lead = "", text = "", cls = "" }) =>
  `<div class="twod12 chat action sysmsg${cls ? ` ${cls}` : ""}" style="${cardVars(SYS_COLOR)}">${cardHead(title, "", ap === null ? "" : apIcon(ap))}${lead ? `<div class="sm-lead">${hl(lead)}</div>` : ""}${text ? `<div class="sm-text">${hl(text)}</div>` : ""}</div>`;
/** A one-line follow-up with an icon (Font Awesome name). */
export const sysLine = (icon, html, cls = "") => `<div class="twod12 chat sysline${cls ? ` ${cls}` : ""}"><i class="fa-solid ${icon}"></i><span>${hl(html)}</span></div>`;

/** Swapping Initiative: A pays 1 AP and swaps with ally B; B acts now with bAp; A keeps aAp, frozen until its slot (1-based). */
export const swapCardHtml = (aName, bName, bAp, aAp, slot) => sysCard({
  title: "Swap Initiative", ap: 1, cls: "swapmsg",
  lead: `${esc(aName)} <i class="fa-solid fa-right-left sm-swap" aria-label="swaps with"></i> ${esc(bName)}`,
  text: `${esc(bName)} acts now with ${apText(bAp)}. ${esc(aName)} keeps ${apText(aAp)}, frozen until slot ${slot}.`
});
/** Its slot comes: it thaws with the AP it kept. */
export const thawLineHtml = (name, ap) => sysLine("fa-lock-open", `<b>${esc(name)}</b> thaws and carries on with ${apText(ap)}. No new AP.`, "thaw");
