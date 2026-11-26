// v0.0.376 (PACK STYLE-2; Lucas, 2026-11-12; the brief foundry/mockups/npc-hud-brief.md, the approved pages npc-hud-hud.html and npc-hud-screen.html):
// the HUD across the bottom of the screen, one for PCs and NPCs, in the dark table look. Pure: the HTML from a model (test t252); module/hud.mjs
// builds the model from the selected token and handles the clicks.
//   NPC: two lines, its attacks (Basic, Special) then the rest (Reactions, Escalation, Checks and Saves); it never grows (hud.mjs folds the Saves
//        into one button, then the last Actions into "+N more").
//   PC:  the Quick row (the Versions the player pinned) over the categories, each opening a panel above the HUD.
//   Several tokens: the list (a click selects that token alone). Nothing: the player's character, or the GM's empty bar at the same height.
import { esc } from "./util.mjs";

export const HUD_CATS = [["actions", "Actions"], ["basic", "Basic Actions"], ["react", "Reactions"], ["esc", "Escalation"], ["hands", "Hands and Gear"], ["checks", "Checks and Saves"], ["skills", "Skills", "later"], ["fx", "Conditions and Effects"], ["utility", "Utility"]];
export const HUD_SAVES = [["body", "Body", "Bo"], ["mind", "Mind", "Mi"], ["appeal", "Appeal", "Ap"], ["instinct", "Instinct", "In"]];
const sign = n => (Number(n) > 0 ? `+${Number(n)}` : Number(n) < 0 ? `−${-Number(n)}` : "0");

/** The id block: the portrait (its ring in the rank's color for an NPC), the name and a line under it. */
export const hudIdHtml = m => `<div class="hud-id${m.rankKey ? ` rk-${esc(m.rankKey)}` : ""}">${m.img ? `<img src="${esc(m.img)}" alt="">` : ""}<div class="hud-who"><b>${esc(m.name)}</b><small>${esc(m.sub ?? "")}</small></div></div>`;

/** One Action: a small diamond in its frequency's color, its name (click or right-click: the Action card), a cost stamp per Version (click: the roll dialog on it;
 *  v0.0.384, Lucas: no tooltip on a stamp that can be used; a struck one still says why). */
export function hudActionHtml(a) {
  const v = x => (x.off
    ? `<button type="button" class="hv no${x.used ? " used" : ""}" disabled data-tooltip="${esc(x.why || "")}" aria-label="${esc(`${a.name}, ${x.label}: ${x.why || ""}`)}">${esc(x.label)}</button>`
    : `<button type="button" class="hv${x.fav ? " fav" : ""}" data-hud="use" data-ap="${Number(x.ap) || 0}" aria-label="Use ${esc(a.name)}, ${esc(x.label)}">${esc(x.label)}</button>`);
  return `<span class="ha${a.dim ? " dim" : ""}" data-item-id="${esc(a.id)}" style="--fq:${esc(a.fq ?? "#5F5E5A")}"><b data-hud="card">${esc(a.name)}</b>${(a.versions ?? []).map(v).join("")}</span>`;
}

/** A group on a line: its name in small grey capitals, then its Actions. */
const groupHtml = (label, acts, cls = "") => (acts.length ? `<span class="hud-g${cls ? ` ${cls}` : ""}"><span class="hud-gl">${esc(label)}</span>${acts.map(hudActionHtml).join("")}</span>` : "");
/** The four Check / Save buttons (click: a Check; Shift: a Save), and their folded form (one button). */
export const hudSavesHtml = saves => `<span class="hud-g g-saves"><span class="hud-gl">Checks and Saves</span>${saves.map(s => `<button type="button" class="hsv at-${esc(s.key)}" data-hud="attr" data-key="${esc(s.key)}">${esc(s.short)} ${esc(sign(s.value))}</button>`).join("")}<button type="button" class="hsv fold" data-hud="cat" data-cat="checks">Checks</button></span>`;

/** NPC: m = { name, img, sub, rankKey, groups: { basic, special, react, esc: [action] }, saves: [{ key, label, short, value }], escPips } */
export function npcHudHtml(m) {
  // v0.0.381 (Lucas: "too much mouse travel"): beside the name, Escalation over the Checks and Saves; the attacks (Basic, Other; v0.0.521: no "Special") and the
  // Reactions in the middle. A line wraps (the HUD grows taller) rather than hiding anything.
  const g = m.groups ?? {};
  const esc = groupHtml(m.escPips ? `Escalation ${m.escPips}` : "Escalation", g.esc ?? []);
  const side = `<div class="hud-blk hud-side">${esc ? `<div class="hud-l">${esc}</div>` : ""}<div class="hud-l">${hudSavesHtml(m.saves ?? [])}</div></div>`;
  const l1 = groupHtml("Basic", g.basic ?? []) + groupHtml("Other", g.special ?? []), l2 = groupHtml("Reactions", g.react ?? []);
  return `${hudIdHtml(m)}<div class="hud-mid npc">${side}<div class="hud-blk hud-center"><div class="hud-l">${l1 || '<span class="hud-none">No Actions.</span>'}</div>${l2 ? `<div class="hud-l">${l2}</div>` : ""}</div></div>`;
}

/** PC: m = { name, img, sub, quick: [action with only its pinned Versions], open: the open category's key } */
export const HUD_QUICK_SLOTS = 8;
export function pcHudHtml(m) {
  // v0.0.381 (Lucas: "buttons on the left, favorites on the right"): the categories beside the name (two lines), the pinned Actions in the middle.
  // v0.0.383 (Lucas): no "Quick" label; slots instead, two rows of empty dashed boxes (the look of "Skills later"), each pinned Action filling
  // one; a slot is sized for one stamp and grows with an Action that has more pinned Versions; more pins than slots add columns.
  const pinned = (m.quick ?? []).map(a => `<div class="qslot full">${hudActionHtml(a)}</div>`);
  const empty = Array.from({ length: Math.max(0, HUD_QUICK_SLOTS - pinned.length) }, () => '<div class="qslot" aria-label="Right-click a Version\'s stamp to pin it here"></div>');
  const cats = HUD_CATS.map(([k, l, later]) => (later ? `<span class="cat later">${esc(l)} <i>later</i></span>` : `<button type="button" class="cat${m.open === k ? " on" : ""}" data-hud="cat" data-cat="${k}" aria-pressed="${m.open === k}">${esc(l)}</button>`)).join("");
  return `${hudIdHtml(m)}<div class="hud-mid pc"><div class="hud-blk hud-cats">${cats}</div><div class="hud-blk hud-quick">${[...pinned, ...empty].join("")}</div></div>`;
}

/** Several tokens selected: one button each (a click selects that token alone and opens its HUD). */
export const listHudHtml = toks => `<div class="hud-mid list"><span class="hud-ll">${toks.length} tokens selected.<br>Click one for its HUD.</span>${toks.map(t => `<button type="button" class="tk${t.rankKey ? ` rk-${esc(t.rankKey)}` : ""}" data-hud="pick" data-token="${esc(t.id)}">${t.img ? `<img src="${esc(t.img)}" alt="">` : ""}<span><b>${esc(t.name)}</b><small>${esc(t.sub ?? "")}</small></span></button>`).join("")}</div>`;

/** Nothing selected (the GM): the empty bar, at the HUD's height so nothing jumps. */
export const emptyHudHtml = (text = "No token selected.") => `<div class="hud-mid empty"><span class="hud-none">${esc(text)}</span></div>`;

/** A category's panel (or "+N more"): rows, each an Action's line, a Passive's text, or a button. rows: [{ action } | { text, sub } | { button, hud, data }] */
export function hudPanelHtml(title, rows) {
  const row = r => (r.action ? `<div class="pr">${hudActionHtml(r.action)}${r.action.sub ? `<small>${esc(r.action.sub)}</small>` : ""}</div>`
    : r.button ? `<div class="pr"><button type="button" class="hp-btn${r.cls ? ` ${esc(r.cls)}` : ""}" data-hud="${esc(r.hud)}"${Object.entries(r.data ?? {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join("")}${r.tip ? `` : ""}>${esc(r.button)}</button>${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</div>`
      : `<div class="pr txt"><b>${esc(r.text)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</div>`);
  return `<div class="hud-pop"><div class="hud-poph">${esc(title)}<button type="button" class="x" data-hud="close" aria-label="Close">&times;</button></div><div class="hud-popb">${rows.length ? rows.map(row).join("") : '<div class="pr txt"><small>Nothing here.</small></div>'}</div></div>`;
}
