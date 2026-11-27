// v0.0.529 (Lucas, 2026-11-27: "use mockup A"; the mockup foundry/mockups/sit-fixed, rule A): a question asked on the map (an area, the pick bar, a
// Forced Movement, End movement, a Setup's movement, the Charge) is one frame with fixed bands, in one order: a title line (.lb-head), the text
// (.lb-text, a fixed number of lines), what changes (.lb-stat, lines of its own), the options (.lb-opts), the keys (.lb-keys), then one row of
// buttons (.lb-acts): the main ones from the left, the way out (.lb-give: Cancel, Pass, End movement, Give up, Don't move it, Cancel the Action,
// Later) at its right end. A button that can only sometimes be used keeps its place and is shown off (disabled), never hidden.
// In the HUD's Situational tab the frame takes the tab's height (system.css, the v0.0.529 block); elsewhere (the HUD's middle, the floating bar)
// the bands fall back into the old row. Pure: no Foundry, no DOM (test t325).

/** The lead of a question's text: its first <b> at the very start (and a .lb-tag right after it), the rest the text (its leading ": " dropped). */
export function splitLead(html) {
  const s = String(html ?? "");
  const m = /^\s*<b>([\s\S]*?)<\/b>(?:\s*<span class="lb-tag">([\s\S]*?)<\/span>)?\s*:?\s*/.exec(s);
  if (!m || !m[1].trim()) return { head: "", tag: "", text: s.trim() };
  return { head: m[1], tag: m[2] ?? "", text: s.slice(m[0].length) };
}

/**
 * The frame's HTML (each part already escaped HTML). p = { icon (a Font Awesome class, the floating bar's icon), head, tag, text, lines (the text's
 * lines kept in the Situational tab), stat (null: no band), statCls, opts (null: no band; its buttons), optsCls, keys (null: no band), left (the
 * buttons at the left), give (the way out, last) }.
 */
export function askHtml(p = {}) {
  const lines = Math.max(1, Math.trunc(Number(p.lines)) || 2);
  return (p.icon ? `<i class="fa-solid ${p.icon} lb-ic"></i>` : "")
    + (p.head ? `<span class="lb-head"><b>${p.head}</b>${p.tag ? ` <span class="lb-tag">${p.tag}</span>` : ""}</span>` : "")
    + `<span class="lb-text" style="--n:${lines}">${p.text ?? ""}</span>`
    + (p.stat === null || p.stat === undefined ? "" : `<span class="lb-stat${p.statCls ? ` ${p.statCls}` : ""}">${p.stat}</span>`)
    + (p.opts === null || p.opts === undefined ? "" : `<span class="lb-side lb-opts${p.optsCls ? ` ${p.optsCls}` : ""}">${p.opts}</span>`)
    + (p.keys === null || p.keys === undefined ? "" : `<span class="lb-keys">${p.keys}</span>`)
    + `<span class="lb-acts">${p.left ?? ""}<span class="lb-sp"></span>${p.give ?? ""}</span>`;
}

/** The Ties pair (the Line, the Charge): always drawn; with no tie both are off (rule A 4), the side chosen is on. The Tab key is named in the keys' line. */
export const tiesHtml = (tie, side = "left") => `<span class="lb-side lb-ties${tie ? "" : " off"}"><span class="lb-lbl">Ties</span>${["left", "right"].map(s => `<button type="button" data-side="${s}" class="${tie && side === s ? "on" : ""}"${tie ? "" : " disabled"}>${s === "left" ? "Left" : "Right"}</button>`).join("")}<kbd>Tab</kbd></span>`;
/** Sets an existing Ties pair to the state tiesHtml would draw (the bar is not redrawn: the mouse may be on it). */
export function setTies(el, tie, side = "left") {
  if (!el) return;
  el.hidden = false; el.style.display = ""; el.style.visibility = "";
  el.classList.toggle("off", !tie);
  el.querySelectorAll("button").forEach(b => { b.disabled = !tie; b.classList.toggle("on", !!tie && b.dataset.side === side); });
}

/** The area's band of what changes (two lines of its own): "" (nothing under the mouse), the count, or Too far (a warning). */
export function areaStat({ placed = false, far = false, dist = 0, within = 0, count = "", cut = false } = {}) {
  if (!placed) return { stat: "", cls: "two" };
  if (far) return { stat: `Too far (${dist} sq., max ${within}).`, cls: "two lb-warn" };
  return { stat: `${count}${cut ? " · cut by wall" : ""}`, cls: "two" };
}

/** The Charge's buttons by its state (rule A 4): Charge off with no target or too close, its two wordings in one slot; the way out filled while it is the only choice. */
export function chargeButtons({ target = false, short = false, blocked = false } = {}) {
  if (!target) return { goOff: true, goLabel: "Charge", goFill: false, giveFill: true };
  return { goOff: short, goLabel: blocked ? "Charge anyway" : "Charge", goFill: !blocked && !short, giveFill: blocked };
}

/**
 * v0.0.530 (Lucas on v0.0.529, sf-area: "hovering over Cancel also lit up 'left' for some reason"): the map's pointermove also fires while the
 * mouse is over the HUD or a window (PIXI listens on the whole document), so the Line was aimed at the map under the Cancel button, found a tie
 * there and lit Left. A question's hover ignores a move whose element is not the map (pure: the event and the canvas element are passed in).
 */
export function offMap(ev, view) {
  const t = (ev?.nativeEvent ?? ev?.data?.originalEvent ?? null)?.target ?? null;
  return !!t && !!view && t !== view && t.id !== "board";
}
