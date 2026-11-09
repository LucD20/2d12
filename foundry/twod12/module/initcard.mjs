// The Initiative card (v0.0.206, Lucas: layout B4, collapsed rows, click to expand; mockup in the 2d12 Project).
// One card per roll of initiative: the creatures who rolled, in the TURN order (the tracker's own order, Combat#setupTurns and its zipper),
// in a band per side (Foe red, Ally green, Neutral; the strip's banner colors), each row keeping its place in the whole order (1..N).
// A row: its place, the name (repeats numbered on the card only; "(...)" muted), the Attribute rolled as a letter chip, the total, a chevron.
// Clicked, it opens the Check's dice line: diamonds, an exploded 12 chained to its reroll, "+ Modifier", Boon and Bane pills with the value
// rolled, Favored or Doomed with the dropped die dimmed. No Doubles mark (initiative has no DC). Open or closed is each viewer's own.
import { cardHead, cardVars } from "./config.mjs";
import { SYS_COLOR } from "./sysmsg.mjs";
import { esc } from "./util.mjs";

export const ATTR_LETTER = { body: "B", mind: "M", appeal: "A", instinct: "I" };
export const ATTR_NAME = { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" };
const BAND = { "-1": { key: "foe", label: "Foe" }, "1": { key: "ally", label: "Ally" }, "0": { key: "neutral", label: "Neutral" }, "-2": { key: "neutral", label: "Secret" } };
const sgn = n => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);

/** "Archer 1 (Double Shot, Marksman)" → { base: "Archer 1", note: "Double Shot, Marksman" }. */
export function splitName(name) {
  const m = String(name ?? "").match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  return m && m[1] ? { base: m[1], note: m[2] } : { base: String(name ?? ""), note: "" };
}

/**
 * Pure: the card's data. rows = [{ id, name, side (-1, 0, 1), attr, mod, r (performCheck's result) }] in roll order;
 * order = the combat's turn order after the roll (ids). Returns { bands: [{ key, label, best, rows: [{ pos, base, num, note, ... }] }] }.
 */
export function initCardData(rows, order) {
  const pos = id => order.indexOf(id) + 1;
  const count = new Map(), seen = new Map();
  for (const x of rows) { const b = splitName(x.name).base; count.set(b, (count.get(b) ?? 0) + 1); }
  const list = rows.map(x => {
    const { base, note } = splitName(x.name);
    const num = count.get(base) > 1 ? (seen.set(base, (seen.get(base) ?? 0) + 1), seen.get(base)) : 0;   // repeats numbered in roll order
    const r = x.r ?? {};
    return { id: x.id, pos: pos(x.id), base, num, note, side: String(x.side ?? -1), attr: x.attr, mod: Number(x.mod) || 0, total: r.total ?? 0,
      d1: r.d1 ?? [], d2: r.d2 ?? [], dropped: r.dropped ?? null, state: r.state ?? "", bo: r.bo ?? 0, ba: r.ba ?? 0,
      boons: r.manualBoons ?? 0, banes: r.manualBanes ?? 0, boonFaces: r.boonFaces ?? [], baneFaces: r.baneFaces ?? [] };
  }).sort((a, b) => a.pos - b.pos);
  const bands = new Map();
  for (const x of list) {
    const b = BAND[x.side] ?? BAND["-1"];
    if (!bands.has(b.key)) bands.set(b.key, { key: b.key, label: b.label, best: x.total, first: x.pos, rows: [] });
    const band = bands.get(b.key);
    band.rows.push(x);
    band.best = Math.max(band.best, x.total);
  }
  return { bands: [...bands.values()].sort((a, b) => a.first - b.first) };
}

/** A die chain: the 12 (counts as 11, rolled again), a link, the reroll; again for each 12. */
const chainHtml = faces => faces.map((f, i) => `${i ? '<i class="fa-solid fa-link dlink"></i>' : ""}<span class="die d12${f === 12 ? " boom" : ""}${i ? " chain" : ""}"${f === 12 ? ' data-tooltip="A 12 counts as 11 and is rolled again"' : ""}>${f}</span>`).join("");

/** The dice line of one row. */
export function diceLineHtml(x) {
  const tag = x.state ? `<span class="ic-pill ${x.state === "favored" ? "boon" : "bane"}" data-tooltip="${x.state === "favored" ? "3d12, the two highest kept" : "3d12, the lowest two kept"}">${x.state === "favored" ? "Favored" : "Doomed"}</span>` : "";
  const dropped = x.dropped ? `<span class="dgroup ic-drop" data-tooltip="Dropped die">${chainHtml(x.dropped)}</span>` : "";
  // v0.0.301 (PACK BB): +1 / -1 each, they cancel
  const boon = x.boons ? `<span class="ic-pill boon" data-tooltip="${x.boons} Boon${x.boons === 1 ? "" : "s"}: +1 each">Boon${x.boons === 1 ? "" : `s ×${x.boons}`} +${x.bo}</span>` : "";
  const bane = x.banes ? `<span class="ic-pill bane" data-tooltip="${x.banes} Bane${x.banes === 1 ? "" : "s"}: −1 each">Bane${x.banes === 1 ? "" : `s ×${x.banes}`} −${x.ba}</span>` : "";
  return `${tag}<span class="dgroup">${chainHtml(x.d1)}</span><span class="plus">+</span><span class="dgroup">${chainHtml(x.d2)}</span>${dropped}<span class="plus ic-mod" data-tooltip="${esc(ATTR_NAME[x.attr] ?? "")} Modifier">${sgn(x.mod)}</span>${boon}${bane}`;
}

/** Pure: the card's HTML. */
export function initCardHtml(data) {
  const row = x => `<div class="ic-row ${x.k}" data-ic-row><span class="ic-pos">${x.pos}</span><span class="ic-name">${esc(x.base)}${x.num ? ` <span class="ic-num">${x.num}</span>` : ""}${x.note ? ` <i class="ic-note">(${esc(x.note)})</i>` : ""}</span><span class="ic-attr ${x.attr}" data-tooltip="${esc(ATTR_NAME[x.attr] ?? x.attr)}">${ATTR_LETTER[x.attr] ?? "?"}</span><span class="ic-tot">${x.total}</span><i class="fa-solid fa-chevron-right ic-chev"></i></div>`
    + `<div class="ic-exp"><div class="ic-k">${esc(ATTR_NAME[x.attr] ?? "")} Check</div><div class="ic-dice dice">${diceLineHtml(x)}</div></div>`;
  const bands = data.bands.map(b => `<div class="ic-band ${b.key}"><span>${b.label}</span><span class="ic-best">best ${b.best}</span></div>${b.rows.map(x => row({ ...x, k: b.key })).join("")}`).join("");
  return `<div class="twod12 chat action sysmsg initcard" style="${cardVars(SYS_COLOR)}">${cardHead("Initiative", "", "")}<div class="orn">&#10022; &#10022; &#10022;</div>${bands}</div>`;
}

/** Each viewer opens and closes rows on their own copy (renderChatMessageHTML). */
export function bindInitCard(msg, html) {
  const el = html instanceof HTMLElement ? html : html?.[0];
  const card = el?.querySelector?.(".twod12.chat.initcard");
  if (!card || card.dataset.icInit) return;
  card.dataset.icInit = "1";
  card.querySelectorAll("[data-ic-row]").forEach(r => r.addEventListener("click", () => r.classList.toggle("open")));
}
