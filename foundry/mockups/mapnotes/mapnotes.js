// The map notes' mockup (Lucas, 2026-11-20): each state drawn TODAY (from move.mjs, pickbar.mjs, rxoverlay.mjs, setup.mjs as of v0.0.460)
// beside the PROPOSAL, with the HUD's Situational tab beside the map. A classic script (opens from file:// too); ?theme=light for the parchment.
function build() {
"use strict";
const S = 48, COLS = 11, ROWS = 7, W = COLS * S, H = ROWS * S;
const ART = "../../twod12/art/";
const TOK = {
  durgan: { name: "Durgan", img: ART + "pcs/durgan.png", side: 1 },
  aveline: { name: "Aveline", img: ART + "pcs/aveline.png", side: 1 },
  kaela: { name: "Kaela", img: ART + "pcs/kaela.webp", side: 1 },
  sylwen: { name: "Sylwen", img: ART + "pcs/sylwen.webp", side: 1 },
  orc: { name: "Orc Warrior", img: ART + "npcs/orc-warrior.png", side: -1 },
  gob1: { name: "Goblin Sneak 1", img: ART + "npcs/goblin-sneak.png", side: -1 },
  gob2: { name: "Goblin Sneak 2", img: ART + "npcs/goblin-sneak.png", side: -1 },
  gob3: { name: "Goblin Sneak 3", img: ART + "npcs/goblin-sneak.png", side: -1 }
};
// proposed colors (meaning only): ink = where / the path; gold = you can click this (the HUD's Situational gold); red = not allowed / stops
const INK = "#ece3cf", GOLD = "#d4a548", RED = "#e4572e", PLATE = "#1b1814", RULE = "#7a683f";
let uid = 0;

/* ------------------------------------------------------------------ geometry */
const cx = j => (j + 0.5) * S, cy = i => (i + 0.5) * S;
const key = c => c.i + "," + c.j;
const dist = (a, b) => { const di = Math.abs(a.i - b.i), dj = Math.abs(a.j - b.j); return Math.max(di, dj) + Math.floor(Math.min(di, dj) / 2); };
const inMap = c => c.i >= 0 && c.j >= 0 && c.i < ROWS && c.j < COLS;
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
/** The squares a movement can end in: every second diagonal counts 2, Difficult Terrain +1 (an Evade can't enter it), not ending on a creature. */
function reach(start, n, o = {}) {
  const hard = new Set((o.hard ?? []).map(key)), occ = new Set((o.occ ?? []).map(key));
  const best = new Map([[key(start) + ",0", 0]]), q = [{ i: start.i, j: start.j, c: 0, p: 0 }], out = new Map([[key(start), start]]);
  while (q.length) {
    q.sort((a, b) => a.c - b.c); const s = q.shift();
    for (const [di, dj] of DIRS) {
      const c = { i: s.i + di, j: s.j + dj }; if (!inMap(c)) continue;
      const diag = di && dj; let step = diag ? (s.p ? 2 : 1) : 1; const np = diag ? 1 - s.p : s.p;
      if (hard.has(key(c))) { if (o.evade) continue; step += 1; }
      const cost = s.c + step; if (cost > n) continue;
      const sk = key(c) + "," + np; if (best.has(sk) && best.get(sk) <= cost) continue;
      best.set(sk, cost); q.push({ ...c, c: cost, p: np });
      if (!occ.has(key(c))) out.set(key(c), c);
    }
  }
  return [...out.values()];
}
/** Forced Movement's squares: each step strictly away from (push) or toward (pull) the origin, up to n steps, never onto a creature. */
function forced(origin, from, n, mode, occ = []) {
  const o = new Set(occ.map(key)), seen = new Map([[key(from), from]]); let front = [from];
  for (let k = 0; k < n; k++) {
    const next = [];
    for (const s of front) for (const [di, dj] of DIRS) {
      const c = { i: s.i + di, j: s.j + dj }; if (!inMap(c) || seen.has(key(c)) || o.has(key(c))) continue;
      const ok = mode === "pull" ? dist(origin, c) < dist(origin, s) && dist(origin, c) > 0 : dist(origin, c) > dist(origin, s);
      if (ok) { seen.set(key(c), c); next.push(c); }
    }
    front = next;
  }
  seen.delete(key(from));
  return [...seen.values()];
}
function edges(cells) {
  const set = new Set(cells.map(key)), segs = [];
  for (const c of cells) {
    const x = c.j * S, y = c.i * S;
    if (!set.has((c.i - 1) + "," + c.j)) segs.push([x, y, x + S, y]);
    if (!set.has((c.i + 1) + "," + c.j)) segs.push([x, y + S, x + S, y + S]);
    if (!set.has(c.i + "," + (c.j - 1))) segs.push([x, y, x, y + S]);
    if (!set.has(c.i + "," + (c.j + 1))) segs.push([x + S, y, x + S, y + S]);
  }
  return segs.map(s => `M${s[0]} ${s[1]}L${s[2]} ${s[3]}`).join("");
}
const C = (i, j) => ({ i, j });

/* ------------------------------------------------------------------ drawing pieces (SVG strings) */
const fill = (cells, color, op) => cells.map(c => `<rect x="${c.j * S}" y="${c.i * S}" width="${S}" height="${S}" fill="${color}" fill-opacity="${op}"/>`).join("");
const outline = (cells, color, w, o = {}) => `<path d="${edges(cells)}" fill="none" stroke="#000" stroke-width="${w + 2}" stroke-opacity="${o.underOp ?? 0.55}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/><path d="${edges(cells)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-opacity="${o.op ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const line = (pts, color, w, o = {}) => `<polyline points="${pts.map(p => p.x + "," + p.y).join(" ")}" fill="none" stroke="${color}" stroke-width="${w}" stroke-opacity="${o.op ?? 1}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const P = c => ({ x: cx(c.j), y: cy(c.i) });
function arrowHead(a, b, color, size = 11) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x), p1 = { x: b.x - size * Math.cos(ang - 0.45), y: b.y - size * Math.sin(ang - 0.45) }, p2 = { x: b.x - size * Math.cos(ang + 0.45), y: b.y - size * Math.sin(ang + 0.45) };
  return `<polygon points="${b.x},${b.y} ${p1.x},${p1.y} ${p2.x},${p2.y}" fill="${color}" stroke="#000" stroke-opacity=".5" stroke-width="1"/>`;
}
function token(k, c, o = {}) {
  const t = TOK[k], x = c.j * S + 2, y = c.i * S + 2, s = S - 4;
  let out = `<g opacity="${o.ghost ? 0.35 : 1}"><image href="${t.img}" x="${x}" y="${y}" width="${s}" height="${s}"/></g>`;
  if (o.control) out += `<rect x="${c.j * S + 1}" y="${c.i * S + 1}" width="${S - 2}" height="${S - 2}" fill="none" stroke="#ff9829" stroke-width="2"/>`;   // Foundry's own selection frame
  if (!o.ghost && o.name !== false) out += `<text x="${cx(c.j)}" y="${c.i * S + S + 15}" text-anchor="middle" font-size="10" font-weight="600" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke" font-family="Source Sans 3">${t.name}</text>`;
  return out;
}
/** Proposed: gold corner brackets around a square (or a token's square): "you can click this". anim: "breathe" | "ripple" | "" */
function brackets(c, o = {}) {
  const pad = o.pad ?? 5, x0 = c.j * S - pad, y0 = c.i * S - pad, x1 = (c.j + (o.w ?? 1)) * S + pad, y1 = (c.i + (o.h ?? 1)) * S + pad, L = S * 0.3;
  const d = `M${x0} ${y0 + L}V${y0}H${x0 + L}M${x1 - L} ${y0}H${x1}V${y0 + L}M${x1} ${y1 - L}V${y1}H${x1 - L}M${x0 + L} ${y1}H${x0}V${y1 - L}`;
  const w = o.width ?? 3.5;
  const g = `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="${w + 2.5}" stroke-linecap="square"/><path d="${d}" fill="none" stroke="${o.color ?? GOLD}" stroke-width="${w}" stroke-linecap="square"/>`;
  if (o.anim === "ripple") {
    const r = S * 0.5 + pad, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    return `<circle cx="${mx}" cy="${my}" r="${r}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="5"/><circle cx="${mx}" cy="${my}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="2.5"/><circle class="mn-ripple" cx="${mx}" cy="${my}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="2"/>`;
  }
  return o.anim ? `<g class="mn-${o.anim}">${g}</g>` : g;
}
/** Proposed: the number that links a token to its picture in the HUD (a small gold square at the token's top left). */
const badge = (c, n) => `<rect x="${c.j * S - 4}" y="${c.i * S - 4}" width="15" height="15" fill="${GOLD}" stroke="#000" stroke-opacity=".6"/><text x="${c.j * S + 3.5}" y="${c.i * S + 7.5}" text-anchor="middle" font-size="11" font-weight="700" fill="#1b1814" font-family="Source Sans 3">${n}</text>`;
/** Proposed: the origin of a Forced Movement (a ring with a dot). */
const origin = c => `<circle cx="${cx(c.j)}" cy="${cy(c.i)}" r="${S * 0.56}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="4.5"/><circle cx="${cx(c.j)}" cy="${cy(c.i)}" r="${S * 0.56}" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="${cx(c.j)}" cy="${c.i * S - 4}" r="4" fill="${INK}" stroke="#000" stroke-opacity=".6"/>`;
const xMark = (x, y, r = 7, color = RED) => `<path d="M${x - r} ${y - r}L${x + r} ${y + r}M${x - r} ${y + r}L${x + r} ${y - r}" stroke="#000" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/><path d="M${x - r} ${y - r}L${x + r} ${y + r}M${x - r} ${y + r}L${x + r} ${y - r}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
const dots = cells => cells.map(c => `<circle cx="${cx(c.j)}" cy="${cy(c.i)}" r="3.6" fill="${INK}" stroke="#000" stroke-opacity=".6"/>`).join("");
/** Proposed: Difficult Terrain as hatching (a pattern, not a color); closed (an Evade) adds a red slash. */
function hatch(cells, o = {}) {
  const id = "h" + (++uid), col = o.closed ? RED : INK;
  return `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="none"/><line x1="0" y1="0" x2="0" y2="7" stroke="${col}" stroke-width="1.6" stroke-opacity="${o.closed ? 0.75 : 0.55}"/></pattern></defs>`
    + cells.map(c => `<rect x="${c.j * S + 1}" y="${c.i * S + 1}" width="${S - 2}" height="${S - 2}" fill="url(#${id})"/>`
      + (o.closed ? `<rect x="${c.j * S + 1.5}" y="${c.i * S + 1.5}" width="${S - 3}" height="${S - 3}" fill="none" stroke="${RED}" stroke-width="1.5"/>`
        : (o.plus ? `<rect x="${c.j * S + S - 19}" y="${c.i * S + 3}" width="16" height="13" fill="${PLATE}" fill-opacity=".9"/><text x="${c.j * S + S - 11}" y="${c.i * S + 13.5}" text-anchor="middle" font-size="11" font-weight="700" fill="${INK}" font-family="Source Sans 3">+1</text>` : ""))).join("");
}
/* the plate: a flat dark box, square corners, a thin line; the first line the number, the rest the cost or the problem */
let ctx2d = null;
const tw = (s, font) => { ctx2d = ctx2d ?? document.createElement("canvas").getContext("2d"); ctx2d.font = font; return ctx2d.measureText(s).width; };
function plate(x, y, lines, o = {}) {
  const F1 = '600 13px "Source Sans 3"', F2 = '400 12px "Source Sans 3"';
  const w = Math.ceil(Math.max(...lines.map((l, k) => tw(l.t, k === 0 ? F1 : F2)))) + 14 + (o.mark ? 14 : 0), h = lines.length * 15 + 7;
  let px = o.anchor === "left" ? x : o.anchor === "right" ? x - w : x - w / 2, py = o.below ? y : y - h;
  px = Math.max(3, Math.min(W - w - 3, px)); py = Math.max(3, Math.min(H - h - 3, py));
  const col = { bad: "#ff9c92", mute: "#b3a68e", ink: INK, gold: GOLD };
  let out = `<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${PLATE}" fill-opacity=".94" stroke="${RULE}" stroke-width="1"/>`;
  if (o.mark) out += `<rect x="${px + 7}" y="${py + 7}" width="8" height="8" fill="${GOLD}"/>`;
  lines.forEach((l, k) => { out += `<text x="${px + 7 + (o.mark ? 14 : 0)}" y="${py + 15 + k * 15}" font-family="Source Sans 3" font-size="${k ? 12 : 13}" font-weight="${k ? 400 : 600}" fill="${col[l.c ?? (k ? "mute" : "ink")]}">${l.t}</text>`; });
  return out;
}
/* today's pieces */
function todayTag(x, y, text, o = {}) {   // rxoverlay.mjs tag(): a rounded pill, a parchment edge, Signika bold
  const fs = o.fs ?? 14, w = tw(text, `700 ${fs}px Signika, "Trebuchet MS", sans-serif`) + fs * 0.9, h = fs * 1.55;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${fs * 0.35}" fill="${o.bg ?? "#1f1c18"}" stroke="#f4eddc" stroke-width="2"/><text x="${x}" y="${y + fs * 0.35}" text-anchor="middle" font-family="Signika, 'Trebuchet MS', sans-serif" font-size="${fs}" font-weight="700" fill="${o.fg ?? "#fff3d6"}">${text}</text>`;
}
function foundryRuler(cells, label) {   // Foundry's own token ruler while dragging (approximate): the path in the user's color and its label
  const pts = cells.map(P);
  let out = fill(cells.slice(1), "#ff9829", 0.22) + line(pts, "#000", 7, { op: 0.6 }) + line(pts, "#ff9829", 4);
  const e = pts[pts.length - 1], w = tw(label, '600 14px Signika, "Trebuchet MS", sans-serif') + 14;
  out += `<rect x="${e.x - w / 2}" y="${e.y - S * 0.5 - 26}" width="${w}" height="22" rx="4" fill="#000" fill-opacity=".72"/><text x="${e.x}" y="${e.y - S * 0.5 - 10}" text-anchor="middle" font-family="Signika, 'Trebuchet MS', sans-serif" font-size="14" font-weight="600" fill="#fff">${label}</text>`;
  return out;
}
function pushTip(x, y, text) {   // move.mjs .twod12-pushtip: a black box that follows the pointer
  const w = tw(text, '400 13px "Source Sans 3"') + 16;
  const px = Math.max(2, Math.min(W - w - 2, x + 14));
  return `<rect x="${px}" y="${y + 14}" width="${w}" height="22" rx="4" fill="#000" fill-opacity=".85"/><text x="${px + 8}" y="${y + 29}" font-family="Source Sans 3" font-size="13" fill="#fff">${text}</text>`;
}
const cursor = (x, y) => `<path d="M${x} ${y}l0 17 4.5-4 3 7 3-1.4-3-6.8 6-.3z" fill="#fff" stroke="#000" stroke-width="1.2"/>`;
const handCursor = (x, y) => `<g transform="translate(${x - 6} ${y - 2})"><path d="M6 1c1.2 0 2 .8 2 2v6l1-.2c1-.2 1.8.3 2 1.2 1-.4 2 .1 2.3 1 1-.3 2 .3 2.1 1.4V17c0 2.8-2.2 5-5 5H9.5C7.8 22 6.4 21 5.7 19.5L3 13.6c-.4-.9 0-1.9.9-2.2.8-.3 1.6.1 2.1.8V3c0-1.2-.2-2 0-2z" fill="#fff" stroke="#000" stroke-width="1.1"/></g>`;

/** The map: a stone floor, its grid, the scene's art (rubble = Difficult Terrain, walls), then the layers under the tokens, the tokens, the layers over. */
function map(scene, under = "", over = "") {
  let s = `<svg class="map" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<rect width="${W}" height="${H}" fill="#474b42"/>`;
  for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) if ((i * 7 + j * 3) % 5 === 0) s += `<rect x="${j * S}" y="${i * S}" width="${S}" height="${S}" fill="#000" fill-opacity=".06"/>`;
  for (const r of scene.rubble ?? []) { const x = r.j * S, y = r.i * S; s += `<rect x="${x + 3}" y="${y + 3}" width="${S - 6}" height="${S - 6}" fill="#6b5a43" fill-opacity=".55"/><circle cx="${x + 14}" cy="${y + 16}" r="6" fill="#7d6b52"/><circle cx="${x + 31}" cy="${y + 27}" r="8" fill="#5e4f3b"/><circle cx="${x + 20}" cy="${y + 35}" r="4.5" fill="#857257"/>`; }
  let g = ""; for (let j = 1; j < COLS; j++) g += `M${j * S} 0V${H}`; for (let i = 1; i < ROWS; i++) g += `M0 ${i * S}H${W}`;
  s += `<path d="${g}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
  for (const w of scene.walls ?? []) s += `<line x1="${w[0]}" y1="${w[1]}" x2="${w[2]}" y2="${w[3]}" stroke="#2a2621" stroke-width="10" stroke-linecap="square"/><line x1="${w[0]}" y1="${w[1]}" x2="${w[2]}" y2="${w[3]}" stroke="#8a7d68" stroke-width="5" stroke-linecap="square"/>`;
  s += under;
  for (const t of scene.tokens ?? []) s += token(t.k, t.c, t);
  s += over + "</svg>";
  return s;
}

/* ------------------------------------------------------------------ the HUD column */
const mk = `<svg class="mk" viewBox="0 0 12 12"><path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" fill="none" stroke="${GOLD}" stroke-width="1.8"/></svg>`;
const hud = (inner, tab = "Hands") => `<div class="mn-hud"><div class="mn-tabs"><span class="on">Situational</span><span>${tab}</span></div><div class="mn-sit">${inner}</div></div>`;
const tItem = (lead, tag, text, btns) => `<div><div class="h"><b>${lead}</b>${tag ? `<span class="tg">${tag}</span>` : ""}</div>${text ? `<div class="t">${text}</div>` : ""}<div class="bs">${btns}</div></div>`;
const tBar = (text, btns) => `<div><div class="t">${text}</div><div class="bs">${btns}</div></div>`;
const tb = (l, q) => `<span class="tb${q ? " q" : ""}">${l}</span>`;
const pb = (l, cls = "") => `<span class="pb ${cls}">${l}</span>`;
const keys = s => `<div class="keys">${s}</div>`;
const pic = (k, n, cls = "") => `<span class="sq ${cls}"><img src="${TOK[k].img}" alt="">${n ? `<b>${n}</b>` : ""}</span>`;
function pItem(o) {
  return `<div class="h">${o.mark === false ? "" : mk}<b>${o.lead}</b>${o.tag ? `<span class="tg">${o.tag}</span>` : ""}</div>`
    + (o.cnt ? `<div class="cnt">${o.cnt}</div>` : "") + (o.text ? `<div class="t">${o.text}</div>` : "") + (o.pics ? `<div class="pics">${o.pics}</div>` : "")
    + (o.rd ? `<div class="rd">${o.rd}</div>` : "") + (o.extra ?? "") + `<div class="bs">${o.btns}</div>` + keys(o.keys);
}
const fig = (kind, title, shot, note = "") => `<div class="mn-fig"><h3><span class="k${kind === "Today" ? "" : " prop"}">${kind}</span>${title}</h3><div class="mn-shot">${shot}</div>${note ? `<p class="mn-note">${note}</p>` : ""}</div>`;
const row = (...figs) => `<div class="mn-row">${figs.join("")}</div>`;
const sec = (id, title, quote, today, prop, body) => `<section class="mn-sec" id="s-${id}"><h2>${title}</h2>${quote ? `<p class="mn-q">${quote}</p>` : ""}<div class="mn-lists"><div><b>Today (from the code)</b><ul>${today.map(x => `<li>${x}</li>`).join("")}</ul></div><div><b>Proposed</b><ul>${prop.map(x => `<li>${x}</li>`).join("")}</ul></div></div>${body}</section>`;

/* ================================================================== the states */
const out = [];

/* ---------- legend */
function legendSvg(inner, w = 96, h = 56) { return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`; }
{
  const L = [
    [legendSvg(`<path d="M10 8H86V48H10Z" fill="${INK}" fill-opacity=".07" stroke="#000" stroke-opacity=".5" stroke-width="4"/><path d="M10 8H86V48H10Z" fill="none" stroke="${INK}" stroke-width="2"/>`), "<b>Solid pale edge: where you can stop</b>Advance, a Setup's movement, the Charge's farthest square. A very light fill inside."],
    [legendSvg(`<path d="M10 8H86V48H10Z" fill="${INK}" fill-opacity=".07" stroke="#000" stroke-opacity=".5" stroke-width="4" stroke-dasharray="7 5"/><path d="M10 8H86V48H10Z" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="7 5"/>`), "<b>Dashed pale edge: an Evade</b>No Reactions; Difficult Terrain is closed. The only dashed thing on the map."],
    [legendSvg(`${line([{ x: 10, y: 40 }, { x: 46, y: 40 }, { x: 80, y: 16 }], "#000", 6, { op: .5 })}${line([{ x: 10, y: 40 }, { x: 46, y: 40 }, { x: 80, y: 16 }], INK, 3)}<circle cx="46" cy="40" r="3.6" fill="${INK}"/><circle cx="80" cy="16" r="3.6" fill="${INK}"/>`), "<b>Pale line, a dot a square: the path</b>From the token to where it stops; an arrow when someone else moves it."],
    [legendSvg(`<rect x="28" y="6" width="44" height="44" fill="#2a2620"/>` + `<path d="M24 16V2H38M62 2H76V16M76 40V54H62M38 54H24V40" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="5.5"/><path d="M24 16V2H38M62 2H76V16M76 40V54H62M38 54H24V40" fill="none" stroke="${GOLD}" stroke-width="3"/><rect x="20" y="0" width="13" height="13" fill="${GOLD}"/><text x="26.5" y="10.5" text-anchor="middle" font-size="10" font-weight="700" fill="#1b1814">1</text>`), "<b>Gold corners: you can click this</b>A token or a square. The same gold as the HUD's Situational tab; the number is its picture's in the HUD. Gold means nothing else on the map."],
    [legendSvg(`${line([{ x: 10, y: 28 }, { x: 50, y: 28 }], INK, 3)}${line([{ x: 50, y: 28 }, { x: 80, y: 28 }], RED, 3)}${xMark(50, 28)}<rect x="62" y="10" width="30" height="36" fill="none" stroke="${RED}" stroke-width="1.5"/>`), "<b>Red: not allowed, or it stops here</b>A red cross where it stops, the rest in red. Never a fill over the whole path."],
    [legendSvg(`<defs><pattern id="lg1" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${INK}" stroke-width="1.6" stroke-opacity=".55"/></pattern><pattern id="lg2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${RED}" stroke-width="1.6" stroke-opacity=".75"/></pattern></defs><rect x="6" y="6" width="40" height="44" fill="url(#lg1)"/><rect x="28" y="9" width="16" height="13" fill="${PLATE}"/><text x="36" y="19.5" text-anchor="middle" font-size="11" font-weight="700" fill="${INK}">+1</text><rect x="52" y="6" width="40" height="44" fill="url(#lg2)" stroke="${RED}" stroke-width="1.5"/>`), "<b>Hatching: Difficult Terrain</b>Pale with \"+1\": it costs 1 more (Advance). Red and framed: closed (an Evade, a Charge)."],
    [legendSvg(plate(4, 4, [{ t: "5 of 6" }, { t: "+1 Difficult Terrain" }], { below: true }), 140), "<b>The plate: the count and the cost</b>At the path's end, above the square. First line the number; then the cost or the problem (in red). Flat, square corners, Source Sans 3."],
    [legendSvg(origin(C(0.08, 0.5)).replace(/cx="(\d+(\.\d+)?)"/g, (m, v) => `cx="${Number(v)}"`), 96, 56), "<b>A ring with a dot: the origin</b>Who a Forced Movement goes away from or toward."],
    [legendSvg(`<g opacity=".38"><image href="${TOK.durgan.img}" x="26" y="4" width="46" height="46"/></g><rect x="25" y="3" width="48" height="48" fill="none" stroke="${INK}" stroke-width="1.5"/>`), "<b>A faint portrait: where it ends</b>The token's picture on its stop square (Charge, Forced Movement), or where it started (a Reaction's trigger)."]
  ];
  out.push(`<section class="mn-sec" id="s-legend"><h2>One language for every map note</h2><p class="mn-q">Color only for a meaning: pale ink is where and how, gold is "click this" (the Situational tab's own gold, so the map and the HUD read as one instruction), red is "no". The kind of movement is said by a word on the plate and in the HUD, and by its shape (an arrow away, toward, numbered steps), never by a new color. The labels sit on the map art, so they stay dark in both themes.</p><div class="mn-legend">${L.map(([s, p]) => `<div>${s}<p>${p}</p></div>`).join("")}</div></section>`);
}

/* ---------- a. attention */
{
  const sc = { tokens: [{ k: "aveline", c: C(3, 3) }, { k: "orc", c: C(3, 6) }, { k: "durgan", c: C(5, 2) }, { k: "gob1", c: C(1, 8) }] };
  const ghost = token("orc", C(3, 4), { ghost: true });
  const dashSq = c => { const x = c.j * S, y = c.i * S; return `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="none" stroke="#ecdcae" stroke-opacity=".8" stroke-width="2" stroke-dasharray="8 6"/>`; };
  const ringT = `<circle cx="${cx(3)}" cy="${cy(3)}" r="${S * 0.62}" fill="none" stroke="#f0b54a" stroke-width="3" stroke-dasharray="${(Math.PI * S * 0.62 / 16).toFixed(2)} ${(Math.PI * S * 0.62 / 16).toFixed(2)}"/>`;
  const today = map(sc, ghost + dashSq(C(3, 5)) + dashSq(C(3, 6)), ringT + todayTag(cx(3), 3 * S - 18, "Rebuke?"));
  const trig = line([P(C(3, 4)), { x: cx(6) - S * 0.5, y: cy(3) }], "#000", 6, { op: .5 }) + line([P(C(3, 4)), { x: cx(6) - S * 0.5, y: cy(3) }], INK, 3) + arrowHead(P(C(3, 4)), { x: cx(6) - S * 0.48, y: cy(3) }, INK) + dots([C(3, 5)]);
  const pA = map(sc, ghost, trig + brackets(C(3, 3), { anim: "breathe" }) + plate(cx(3), 3 * S - 12, [{ t: "Rebuke?" }, { t: "Use or Pass in the HUD" }], { mark: true }) + plate(cx(6), 4 * S + 14, [{ t: "moved away from Aveline", c: "mute" }], { below: true }));
  const pB = map(sc, ghost, trig + brackets(C(3, 3), { anim: "ripple" }) + plate(cx(3), 3 * S - 12, [{ t: "Rebuke?" }, { t: "Use or Pass in the HUD" }], { mark: true }) + plate(cx(6), 4 * S + 14, [{ t: "moved away from Aveline", c: "mute" }], { below: true }));
  const hT = hud(tItem("Rebuke", "Reaction", "Orc Warrior moves away from you.", tb("Use · 1 AP") + tb("Pass", true)));
  const hP = hud(pItem({ lead: "Rebuke", tag: "Reaction · Aveline", text: "Orc Warrior moved away from you.", btns: pb("Use · 1 AP", "go") + pb("Pass", "q"), keys: "Aveline is marked on the map. Right-click pans the map." }));
  // the motion, drawn as frames (the page animates; a screenshot can't)
  const frames = (anim) => { let s = ""; [0, 0.5, 1, 0.5].forEach((k, n) => { const x0 = 20 + n * 120, sc2 = 1 + 0.14 * k; const c = { x: x0 + 40, y: 58 };
      s += `<image href="${TOK.aveline.img}" x="${c.x - 22}" y="${c.y - 22}" width="44" height="44"/>`;
      if (anim === "breathe") { const h = 26 * sc2, L = 12; const d = `M${c.x - h} ${c.y - h + L}V${c.y - h}H${c.x - h + L}M${c.x + h - L} ${c.y - h}H${c.x + h}V${c.y - h + L}M${c.x + h} ${c.y + h - L}V${c.y + h}H${c.x + h - L}M${c.x - h + L} ${c.y + h}H${c.x - h}V${c.y + h - L}`; s += `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="3" opacity="${1 - 0.3 * k}"/>`; }
      else { s += `<circle cx="${c.x}" cy="${c.y}" r="27" fill="none" stroke="${GOLD}" stroke-width="2.5"/>`; const r = 27 * (1 + 0.7 * [0, 0.45, 0.9, 0.2][n]); s += `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="${(0.9 * (1 - [0, 0.45, 0.9, 0.2][n] / 0.95)).toFixed(2)}"/>`; }
      s += `<text x="${c.x}" y="114" text-anchor="middle" font-size="11" fill="#b3a68e" font-family="Source Sans 3">${["0 s", "0.6 s", "1.2 s", "1.8 s"][n]}</text>`; });
    return `<svg class="map" width="${W}" height="122" viewBox="0 0 ${W} 122"><rect width="${W}" height="122" fill="#474b42"/>${s}</svg>`; };
  const motion = `<div style="display:flex;flex-direction:column">${frames("breathe")}<div style="height:1px;background:#000"></div>${frames("ripple")}</div>`;
  out.push(sec("attention", "a. A token that needs you: the attention mark",
    "\"The blinking on tokens on the map need to be more clear, in the situational tab is good, but on the tokens it needs to draw more attentions. Maybe a different blinking? Remember to keep the serious tone and colors.\"",
    ["A Reaction that can trigger: a <b>dashed amber ring</b> (#f0b54a, 3 px) around the creature and, for the one who answers, a rounded pill \"Rebuke?\" over it (rxoverlay.mjs:136-142). The ring is the same weight as every other line on the map and doesn't move: it can pass unnoticed.",
      "Creatures to pick (a push, a Minion): a gold fill at 22% and a gold edge on their squares (pickbar.mjs:79). Nothing moves either, and the gold is also the Charge's limit (move.mjs:1712) and a Forced Movement's ghost origin (move.mjs:808): three meanings for one color.",
      "The HUD's Situational tab: a steady gold top line and a 9% gold tint (system.css 5139). Lucas: good.",
      "No map mark moves today; the only animations are in the HUD (the Reactions tab's pulse, 1.2 s) and the Turn dock's live dot."],
    ["<b>One mark for \"you\", everywhere: gold corners</b> around the token, in the Situational tab's gold, with a short plate (\"Rebuke?\" and \"Use or Pass in the HUD\"). The HUD's item gets the same corner glyph before its name, so the two read as one instruction.",
      "<b>The motion, A (recommended): the corners breathe</b>: they open 14% and close again, 2.4 s, ease in and out, never off. Slow enough to stay serious, and it moves the outline, not the colors (no flashing). <b>B: a steady ring and one ripple</b> that grows and fades every 2.4 s (a sonar).",
      "<b>Still with reduced motion</b> (the system's <code>prefers-reduced-motion</code>, and a client setting): the corners alone carry the meaning, so nothing is lost.",
      "The trigger is drawn in the shared language: a pale arrow from where the Orc started (its faint portrait) to where it is."],
    row(fig("Today", "Aveline can Rebuke: the dashed amber ring and the pill", today + hT), fig("Proposed A", "Gold corners that breathe (recommended), the plate, the HUD's glyph", pA + hP))
    + row(fig("Proposed B", "A steady ring and a slow ripple", pB + hP), fig("Motion", "How A (top) and B (bottom) move, frame by frame", motion, "A screenshot freezes both at rest. Open index.html to see them move; with the system's reduced-motion setting they stand still."))));
}

/* ---------- b. Advance */
{
  const rubble = [C(4, 4), C(3, 4), C(2, 4), C(3, 5)];
  const sc = { rubble, tokens: [{ k: "durgan", c: C(4, 1), control: true }, { k: "aveline", c: C(5, 3) }, { k: "gob1", c: C(1, 7) }, { k: "orc", c: C(2, 9) }] };
  const area = reach(C(4, 1), 6, { hard: [...rubble, C(1, 7)], occ: [C(5, 3), C(1, 7)] });
  const path = [C(4, 1), C(4, 2), C(4, 3), C(4, 4), C(4, 5)], path2 = [...path, C(4, 6), C(4, 7)];
  const blueT = fill(area, "#66ccff", 0.2) + outline(area, "#8fdcff", 3);
  const today = map(sc, blueT + foundryRuler(path, "4 sq (+1)"));
  const today2 = map(sc, blueT + foundryRuler(path2, "6 sq (+1)"));
  const paleArea = fill(area, INK, 0.07) + outline(area, INK, 2);
  const hardIn = rubble.filter(c => area.some(a => key(a) === key(c)));
  const pPath = (cells, endCol = INK) => line(cells.map(P), "#000", 6, { op: .5 }) + line(cells.map(P), endCol, 3) + dots(cells.slice(1));
  const prop = map(sc, paleArea + hatch(hardIn, { plus: true }), pPath(path) + `<rect x="${5 * S + 1}" y="${4 * S + 1}" width="${S - 2}" height="${S - 2}" fill="none" stroke="${INK}" stroke-width="1.5"/>` + plate(cx(5), 5 * S + 4, [{ t: "5 of 6 · 1 left" }, { t: "+1 Difficult Terrain" }], { below: true }));
  const prop2 = map(sc, paleArea + hatch(hardIn, { plus: true }), pPath(path) + line([P(C(4, 5)), P(C(4, 6)), P(C(4, 7))], "#000", 6, { op: .5 }) + line([P(C(4, 5)), P(C(4, 6)), P(C(4, 7))], INK, 3) + dots([C(4, 6), C(4, 7)]) + `<line x1="${6 * S}" y1="${4 * S + 6}" x2="${6 * S}" y2="${5 * S - 6}" stroke="${INK}" stroke-width="3"/>` + plate(cx(7), 5 * S + 4, [{ t: "7 squares: 6 free + 1" }, { t: "the 1 more is an Advance: 1 AP", c: "ink" }], { below: true }));
  const hT = hud(tBar("<b>Durgan</b>: Advance up to 6 squares without spending AP. Drag your token.", tb("End movement", true)));
  const hP = hud(pItem({ lead: "Advance", tag: "6 squares, free (from a card)", cnt: "<b>1</b><span>of 6 squares left</span>", text: "Drag Durgan. Hatched squares cost 1 more.", btns: pb("End movement", "go"), keys: "<kbd>Enter</kbd> End movement · Right-click pans the map" }));
  const hP2 = hud(pItem({ lead: "Advance", tag: "6 squares, free (from a card)", cnt: "<b>0</b><span>of 6 squares left</span>", text: "Past the edge, the drag pays a new Advance: <b>1 AP</b> (2 AP left).", btns: pb("End movement", "go"), keys: "<kbd>Enter</kbd> End movement · Right-click pans the map" }));
  out.push(sec("advance", "b. Advance",
    "The movement area, its path and the label \"2 sq (+1)\".",
    ["The squares it can reach: blue at 20% with a light blue edge (#66ccff / #8fdcff, move.mjs:1579-1580). Difficult Terrain inside it isn't marked: the map art may show it or not.",
      "The label is Foundry's own ruler: \"4 sq (+1)\", the squares and the extra cost, nothing about how many are left or what happens past the edge.",
      "Past the blue edge the drag silently pays a new Advance from the AP (move.mjs:246, chargeMovement); nothing on the map says it costs 1 AP.",
      "The HUD: \"Durgan: Advance up to 6 squares without spending AP. Drag your token.\" and End movement. No count of what is left."],
    ["<b>The area in pale ink</b> (7% and a 2 px edge): neutral, it isn't a choice to click. Difficult Terrain inside it is <b>hatched with \"+1\"</b>.",
      "<b>The plate at the path's end</b>: \"5 of 6 · 1 left\", then the cost that changed it (\"+1 Difficult Terrain\"). Foundry's ruler label stays (it is Foundry's), the plate says the system's part.",
      "<b>The limit</b>: a tick where the path crosses the edge; the path goes on (it is allowed, it costs) and the plate says \"the 1 more is an Advance: 1 AP\". With no AP left the part past the tick is red: \"no AP for another Advance\".",
      "<b>The HUD</b>: the count big (\"1 of 6 squares left\"), one line of how-to, End movement filled (the one thing to click). The tag names the Action that gave it."],
    row(fig("Today", "Durgan's free Advance 6 (from an Action), dragged over rubble", today + hT), fig("Proposed", "The count and the cost on a plate; the rubble hatched", prop + hP))
    + row(fig("Today", "The limit reached: dragged 1 past the blue edge", today2 + hT), fig("Proposed", "The limit: the square beyond costs a new Advance", prop2 + hP2, "Past the tick the path stays pale, not red: it is allowed, it costs. Red would mean \"can't\"; gold is kept for \"click this\"."))));
}

/* ---------- c. Evade */
{
  const rubble = [C(3, 3), C(3, 4), C(2, 4), C(2, 3)];
  const sc = { rubble, tokens: [{ k: "sylwen", c: C(4, 2), control: true }, { k: "gob1", c: C(4, 5) }, { k: "orc", c: C(2, 7) }] };
  const hard = [...rubble, C(4, 5), C(2, 7)], occ = [C(4, 5), C(2, 7)];
  const ev = reach(C(4, 2), 3, { hard, occ, evade: true }), adv = reach(C(4, 2), 3, { hard, occ: [] });
  const closed = adv.filter(c => hard.some(h => key(h) === key(c)) && !ev.some(e => key(e) === key(c)) && !occ.some(o => key(o) === key(c)));
  const path = [C(4, 2), C(5, 3), C(5, 4)];
  const today = map(sc, fill(ev, "#66ccff", 0.2) + outline(ev, "#8fdcff", 3) + foundryRuler(path, "2 sq"));
  const pPath = line(path.map(P), "#000", 6, { op: .5 }) + line(path.map(P), INK, 3) + dots(path.slice(1));
  const prop = map(sc, fill(ev, INK, 0.07) + outline(ev, INK, 2, { dash: "7 5" }) + hatch(closed, { closed: true }), pPath + plate(cx(4), 6 * S + 4, [{ t: "2 of 3 · 1 left" }], { below: true }) + plate(4, 4, [{ t: "Evade: no Reactions" }, { t: "Difficult Terrain closed", c: "bad" }], { anchor: "left", below: true }));
  const hT = hud(tBar("<b>Sylwen</b>: Evade up to 3 squares: no reactions; not into or through Difficult Terrain. Drag your token.", tb("Advance instead") + tb("End movement", true)));
  const hP = hud(pItem({ lead: "Evade", tag: "3 squares, free (from a card)", cnt: "<b>1</b><span>of 3 squares left</span>", text: "No Reactions. Can't enter the red squares (Difficult Terrain, a creature).", btns: pb("End movement", "go") + pb("Advance instead"), keys: "<kbd>Enter</kbd> End movement · Right-click pans the map" }));
  out.push(sec("evade", "c. Evade", "",
    ["Drawn exactly as an Advance: the same blue fill and edge (move.mjs:1579-1580); the only difference is the squares it leaves out, which look like the edge of the room.",
      "Its two rules (no Reactions, no Difficult Terrain) are only in the HUD's sentence."],
    ["<b>A dashed edge</b>, the only dashed line on the map: \"this is an Evade\" at a glance.",
      "<b>The squares it can't enter are hatched red and framed</b> (inside its range): the player sees why the area has a hole.",
      "A plate at the area's corner says the two rules once: \"Evade: no Reactions\" / \"Difficult Terrain closed\".",
      "The HUD the same as the Advance's, with Advance instead as a second, outlined button."],
    row(fig("Today", "Sylwen Evades 3 beside rubble and a Goblin", today + hT), fig("Proposed", "A dashed edge, the closed squares in red hatching", prop + hP))));
}

/* ---------- d. a Setup's movement */
{
  const rubble = [C(2, 3), C(3, 3)];
  const sc = { rubble, tokens: [{ k: "kaela", c: C(5, 1), control: true }, { k: "orc", c: C(1, 8) }, { k: "gob2", c: C(3, 9) }] };
  const area = reach(C(5, 1), 6, { hard: [...rubble, C(1, 8), C(3, 9)], occ: [C(1, 8), C(3, 9)] });
  const path = [C(5, 1), C(4, 2), C(4, 3)];
  const today = map(sc, fill(area, "#66ccff", 0.2) + outline(area, "#8fdcff", 3) + foundryRuler(path, "2 sq"));
  const pPath = line(path.map(P), "#000", 6, { op: .5 }) + line(path.map(P), INK, 3) + dots(path.slice(1));
  const prop = map(sc, fill(area, INK, 0.07) + outline(area, INK, 2) + hatch(rubble.filter(c => area.some(a => key(a) === key(c))), { plus: true }), pPath + plate(cx(3), 4 * S - 4, [{ t: "2 of 6 · 4 left" }, { t: "then Strafe's roll from here" }]));
  const hT = hud(tBar("<b>Strafe</b>: You {Advance}. Move your token, then Continue. <span class=\"tl\"><b>4</b> of 6 squares left.</span>", tb("Continue: the roll") + tb("Cancel the Action", true)));
  const hP = hud(pItem({ lead: "Strafe", tag: "Setup: Advance 6", cnt: "<b>4</b><span>of 6 squares left</span>", text: "Move first. The roll is made from where you stop.", btns: pb("Continue: the roll", "go") + pb("Cancel the Action", "q"), keys: "<kbd>Enter</kbd> Continue · <kbd>Esc</kbd> Cancel the Action · Right-click pans" }));
  out.push(sec("setup", "d. A Setup's movement (Strafe)", "",
    ["The same blue area, no label of its own (Foundry's ruler only).",
      "The HUD reads <b>\"Strafe: You {Advance}.\"</b>: setup.mjs:12 (<code>plainSetup</code>) strips the <code>@Move[...]</code> tag but leaves its label in braces; a Setup written \"You @Move[evade|distance:1].\" reads \"You .\" (a bug).",
      "\"4 of 6 squares left\" sits at the end of the sentence, in the same size as the rest."],
    ["The Advance's language (pale area, hatching, the plate), and the plate's second line says what comes next: \"then Strafe's roll from here\".",
      "The HUD: the count big, one line (\"Move first. The roll is made from where you stop.\"), Continue: the roll filled, Cancel the Action quiet and last. The tag names it a Setup.",
      "The key line says what Escape does here (it cancels the Action) and that right-click pans."],
    row(fig("Today", "Kaela's Strafe: Setup, Advance 6", today + hT), fig("Proposed", "The count first; what comes after the movement on the plate", prop + hP))));
}

/* ---------- e. Charge */
{
  const lim = []; for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) if (dist(C(4, 1), C(i, j)) <= 6) lim.push(C(i, j));
  const base = [{ k: "durgan", c: C(4, 1), control: true }, { k: "orc", c: C(4, 7) }, { k: "gob2", c: C(5, 2) }, { k: "gob1", c: C(0, 10) }];
  const sc1 = { tokens: [...base, { k: "aveline", c: C(1, 3) }] };
  const sc3 = { tokens: [...base, { k: "aveline", c: C(4, 4) }] };
  const goldLim = outline(lim, "#f1c84b", 2);
  const paleLim = outline(lim, INK, 1.5, { op: 0.55, underOp: 0.3 });
  // 1. before a target
  const t1 = map(sc1, goldLim);
  const p1 = map(sc1, paleLim, brackets(C(4, 7), { anim: "breathe" }) + badge(C(4, 7), 1) + plate(cx(7), 4 * S - 6, [{ t: "Charge it?" }, { t: "5 squares, then a Weapon Attack" }], { mark: true })
    + plate(3 * S + 4, cy(5) - 11, [{ t: "too close (needs 3)", c: "mute" }], { below: true, anchor: "left" }) + plate(10 * S - 10, cy(0) - 11, [{ t: "too far (11)", c: "mute" }], { below: true, anchor: "right" }));
  const h1T = hud(tBar("Charge: at least 3, up to 6 squares (the gold outline). Click the destination, or an enemy to Charge it.", `<span class="tl" style="visibility:hidden">Ties</span>${tb("Left") .replace("tb", "tb ghost")}${tb("Right").replace("tb", "tb ghost")}${tb("Charge!")}${tb("Give up", true)}`));
  const h1P = hud(pItem({ lead: "Charge", tag: "2 AP · 3 to 6 squares", text: "<b>Pick the enemy to Charge</b>, on the map or here. You run straight at it, then make a Weapon Attack (1A).", pics: pic("orc", 1), extra: `<div class="sep">Too close: Goblin Sneak 2. Too far: Goblin Sneak 1.</div>`, btns: pb("Give up · 2 AP back", "q"), keys: "<kbd>Esc</kbd> Give up · Right-click pans the map" }));
  // 2. with a target
  const path = [C(4, 1), C(4, 2), C(4, 3), C(4, 4), C(4, 5), C(4, 6)];
  const t2 = map(sc1, goldLim + fill(path.slice(1, -1), "#6fa8dc", 0.5) + fill([C(4, 6)], "#5fbf86", 0.65) + outline([C(4, 6)], "#d8ffe6", 3));
  const pLine = cells => line(cells.map(P), "#000", 6, { op: .5 }) + line(cells.map(P), INK, 3) + dots(cells.slice(1, -1));
  const p2 = map(sc1, paleLim + token("durgan", C(4, 6), { ghost: true }) + `<rect x="${6 * S + 1}" y="${4 * S + 1}" width="${S - 2}" height="${S - 2}" fill="none" stroke="${INK}" stroke-width="1.5"/>`,
    pLine(path) + brackets(C(4, 7)) + badge(C(4, 7), 1) + plate(cx(6), 4 * S - 6, [{ t: "5 squares · in Reach" }, { t: "then Weapon Attack (1A) on Orc" }]));
  const h2T = hud(tBar("Charge 5 squares toward Orc Warrior: in Reach at the end. Click to Charge, or click another enemy to Charge it.", `<span class="tl" style="visibility:hidden">Ties</span>${tb("Left").replace("tb", "tb ghost")}${tb("Right").replace("tb", "tb ghost")}${tb("Charge!")}${tb("Give up", true)}`));
  const h2P = hud(pItem({ lead: "Charge → Orc Warrior", tag: "5 squares", text: "In Reach at the end. Then: Weapon Attack (1A). Another enemy: click it.", btns: pb("Charge", "go") + pb("Give up · 2 AP back", "q"), keys: "<kbd>Enter</kbd> Charge · <kbd>Esc</kbd> Give up · Right-click pans" }));
  // 3. blocked by a creature
  const pathB = [C(4, 1), C(4, 2), C(4, 3)];
  const t3 = map(sc3, goldLim + fill([C(4, 2)], "#6fa8dc", 0.5) + fill([C(4, 3)], "#5fbf86", 0.65) + fill([C(4, 4)], "#e07a6a", 0.5) + outline([C(4, 3)], "#d8ffe6", 3));
  const edgeX = 4 * S, my = cy(4);
  const p3 = map(sc3, paleLim + token("durgan", C(4, 3), { ghost: true }) + `<rect x="${3 * S + 1}" y="${4 * S + 1}" width="${S - 2}" height="${S - 2}" fill="none" stroke="${INK}" stroke-width="1.5"/>`,
    pLine(pathB) + line([P(C(4, 3)), { x: edgeX, y: my }], RED, 3) + line([{ x: 5 * S, y: my }, { x: cx(7) - S * 0.5, y: my }], RED, 2, { op: 0.5 }) + xMark(edgeX, my) + brackets(C(4, 7)) + badge(C(4, 7), 1)
    + plate(cx(3), 4 * S - 6, [{ t: "Stops after 2" }, { t: "Aveline is in the way", c: "bad" }, { t: "Orc not in Reach: disrupted", c: "bad" }]));
  const h3T = hud(tBar("a creature in the way: the Charge stops after 2 squares, Orc Warrior not in Reach: it would be disrupted. Click to choose it, then again to confirm.", `<span class="tl" style="visibility:hidden">Ties</span>${tb("Left").replace("tb", "tb ghost")}${tb("Right").replace("tb", "tb ghost")}${tb("Charge!")}${tb("Give up", true)}`));
  const h3P = hud(pItem({ lead: "Charge → Orc Warrior", tag: "blocked", rd: `<span class="bad">Aveline is in the way.</span> You stop after 2 squares, out of Reach: the Charge is disrupted (its AP stay spent).`, btns: pb("Give up · 2 AP back", "go") + pb("Charge anyway"), keys: "<kbd>Esc</kbd> Give up · Right-click pans the map" }));
  out.push(sec("charge", "e. Charge",
    "\"It isn't at all intuitive, it doesn't have a feedback to know you need to target enemies to see the charge etc.\"",
    ["<b>Before a target</b>: only a thin gold edge around every square within 6 (move.mjs:1712) and the sentence \"Click the destination, or an enemy to Charge it.\" Nothing marks which enemies can be charged; the tokens can't be hovered (the picker turns them off, move.mjs:1640), so the map gives no feedback until a click.",
      "<b>With a target</b>: the squares passed blue (50%), the end green (65%) with a pale edge, the illegal red (move.mjs:1723-1726): a third set of meanings for blue and green. The bar's text is plain (textContent, no bold, move.mjs:1711).",
      "<b>With a target, a left click anywhere on the map Charges</b> (move.mjs:1743-1760): only a click on another enemy changes the target. A mis-click on an empty square launches it.",
      "<b>Blocked</b>: \"Click to choose it, then again to confirm\": a hidden two-click arming, explained in a 2-line clamp.",
      "Escape gives up (AP back); right-click pans since v0.0.460; the Ties buttons keep their place hidden."],
    ["<b>Before a target, the enemies are the question</b>: each enemy it can Charge gets the gold corners (breathing) and its number; the HUD lists them as pictures, like the push picker. The others get a quiet plate (\"too close (needs 3)\", \"too far (11)\"). The limit is a faint pale edge, not gold.",
      "<b>With a target</b>: the straight line in pale ink, the token's faint portrait on its stop square, the plate \"5 squares · in Reach\" / \"then Weapon Attack (1A) on Orc\". <b>Only the Charge button, Enter, or a click on the target confirms</b>; a click on an empty square does nothing.",
      "<b>Blocked</b>: the line stops at a red cross on the creature's edge; the rest of the way faint red; the plate says who is in the way and the result (\"disrupted\"). The HUD offers the two real choices as buttons: Give up · 2 AP back (filled) and Charge anyway.",
      "Ties (Left / Right, Tab) appear only when the line has ties, under the text."],
    row(fig("Today", "Charge used, no target yet", t1 + h1T), fig("Proposed", "The enemies it can Charge are marked and listed", p1 + h1P))
    + row(fig("Today", "The Orc Warrior targeted", t2 + h2T), fig("Proposed", "The line, where it stops, the attack it gives", p2 + h2P))
    + row(fig("Today", "Aveline on the line: it stops before her", t3 + h3T), fig("Proposed", "Blocked: the cross, the result, the two choices", p3 + h3P))));
}

/* ---------- f. Forced Movement */
{
  const walls = [[6 * S, 2 * S, 6 * S, 4 * S]];
  const wallPair = (a, b) => (a.i === b.i && a.i >= 2 && a.i <= 3 && Math.min(a.j, b.j) === 5 && Math.max(a.j, b.j) === 6);
  // Pushed 2: Aveline pushes Goblin Sneak 2 away
  const sc = { walls, tokens: [{ k: "aveline", c: C(4, 3), control: true }, { k: "gob2", c: C(4, 4) }, { k: "durgan", c: C(6, 1) }, { k: "orc", c: C(1, 1) }] };
  const area = forced(C(4, 3), C(4, 4), 2, "push", [C(6, 1), C(4, 3)]);
  const pt = c => P(c);
  const tT = map(sc, fill(area, "#ffffff", 0.22) + outline(area, "#ffffff", 3), line([pt(C(4, 4)), pt(C(3, 5))], "#44cc77", 5, { op: .95 }) + line([pt(C(3, 5)), pt(C(3, 6))], "#dd3333", 5, { op: .95 }) + `<path d="M${cx(6) - 9} ${cy(3) - 9}L${cx(6) + 9} ${cy(3) + 9}M${cx(6) - 9} ${cy(3) + 9}L${cx(6) + 9} ${cy(3) - 9}" stroke="#dd3333" stroke-width="6"/>` + cursor(cx(6) + 6, cy(3) + 4) + pushTip(cx(6) - 230, cy(3) + 12, "Wall: 1 unused, 1 Vigor damage (1 of 2 squares aimed (maximum 2))"));
  const goldArea = fill(area, GOLD, 0.12) + outline(area, GOLD, 2);
  const pP = map(sc, goldArea + token("gob2", C(3, 5), { ghost: true }), origin(C(4, 3)) + line([pt(C(4, 4)), pt(C(3, 5))], "#000", 6, { op: .5 }) + line([pt(C(4, 4)), pt(C(3, 5))], INK, 3) + arrowHead(pt(C(4, 4)), pt(C(3, 5)), INK) + line([pt(C(3, 5)), { x: 6 * S, y: cy(3) }], RED, 3) + xMark(6 * S, cy(3)) + brackets(C(3, 6), { pad: 1, width: 2.5 }) + handCursor(cx(6) + 4, cy(3) + 6)
    + plate(cx(5), 2 * S - 6, [{ t: "Pushed 1 of 2" }, { t: "Wall: 1 unused · 1 Vigor damage", c: "bad" }]) + plate(3 * S - 8, cy(4) - 10, [{ t: "from Aveline", c: "mute" }], { below: true, anchor: "right" }));
  const hT = hud(tBar("<b>Goblin Sneak 2</b> is Pushed up to 2 squares away from <b>Aveline</b>: click the square where it ends. <small>Forced Movement ignores Difficult Terrain and triggers no Reactions; a wall or a creature in the way stops it (a Collision).</small> <b>Wall: 1 unused, 1 Vigor damage (1 of 2 squares aimed (maximum 2))</b>", tb("Rules") + tb("End movement")));
  const hP = hud(pItem({ lead: "Pushed 2", tag: "Goblin Sneak 2 · away from Aveline", text: "Click the square where it ends (gold).", rd: `Here: moves 1, <span class="bad">hits a wall</span>: 1 unused, 1 Vigor damage.`, extra: `<div class="sep">No Reactions; Difficult Terrain doesn't slow it. <a>Rules</a></div>`, btns: pb("Don't move it", "q"), keys: "<kbd>Esc</kbd> Don't move it (0, said in the chat) · Right-click pans" }));
  // Slid 3: Sylwen slides Goblin Sneak 2 (the path tool)
  const sc2 = { tokens: [{ k: "sylwen", c: C(2, 2), control: true }, { k: "gob2", c: C(4, 4) }, { k: "orc", c: C(1, 8) }] };
  const steps = [C(4, 4), C(4, 5), C(5, 6)], left = 1, last = steps[steps.length - 1];
  const reachNext = []; for (let di = -left; di <= left; di++) for (let dj = -left; dj <= left; dj++) { const c = C(last.i + di, last.j + dj); if ((di || dj) && !steps.some(s => key(s) === key(c))) reachNext.push(c); }
  const tS = map(sc2, fill(reachNext, "#ffffff", 0.22) + outline(reachNext, "#ffffff", 3) + fill(steps.slice(1), "#66ccff", 0.25) + fill([C(5, 7)], "#ffffff", 0.35), line(steps.map(pt), "#44cc77", 5, { op: .95 }) + cursor(cx(7) + 4, cy(5) + 2) + pushTip(cx(7) - 330, cy(5) - 50, "Slid 3 (path 3 of 3). Click the last square again or press Enter to move; right-click takes a square back.")
    + `<rect x="${W / 2 - 250}" y="6" width="500" height="34" fill="#000" fill-opacity=".8"/><text x="${W / 2 - 240}" y="21" font-size="11.5" fill="#fff" font-family="Source Sans 3">Slid 3: click the squares of Goblin Sneak 2's path one by one, then click the last one again</text><text x="${W / 2 - 240}" y="35" font-size="11.5" fill="#fff" font-family="Source Sans 3">(or Enter). Right-click takes a square back; Esc cancels.   (a Foundry notification, top of the screen)</text>`);
  const num = (c, n) => `<rect x="${cx(c.j) - 8}" y="${cy(c.i) - 8}" width="16" height="16" fill="${PLATE}" stroke="${INK}" stroke-width="1.2"/><text x="${cx(c.j)}" y="${cy(c.i) + 4.5}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}" font-family="Source Sans 3">${n}</text>`;
  const pS = map(sc2, fill(reachNext, GOLD, 0.12) + outline(reachNext, GOLD, 2) + token("gob2", C(5, 6), { ghost: true }), origin(C(2, 2)) + line(steps.map(pt), "#000", 6, { op: .5 }) + line(steps.map(pt), INK, 3) + arrowHead(pt(C(4, 5)), pt(C(5, 6)), INK) + num(C(4, 5), 1) + num(C(5, 6), 2)
    + plate(7 * S + 6, cy(5) - 12, [{ t: "Slid 2 of 3" }, { t: "click 2 again (or Enter) to stop" }], { anchor: "left", below: true }));
  const hST = hud(tBar("<b>Goblin Sneak 2</b> is Slid up to 3 squares in any direction: click the squares of its path one by one, then the last one again (Enter). <small>Forced Movement ignores Difficult Terrain and triggers no Reactions; a wall or a creature in the way stops it (a Collision).</small> <b>Slid 3 (path 3 of 3). Click the last square again or press Enter to move; right-click takes a square back.</b>", tb("Rules") + tb("End movement")));
  const hSP = hud(pItem({ lead: "Slid 3", tag: "Goblin Sneak 2 · by Sylwen", text: "Click its path square by square (gold: the next steps). Click the last again to stop.", rd: "2 of 3 squares. No Collision so far.", btns: pb("Move it here", "go") + pb("Take back a step") + pb("Don't move it", "q"), keys: "<kbd>Enter</kbd> Move it here · <kbd>Backspace</kbd> Take back · <kbd>Esc</kbd> Don't move it" }));
  // Pulled 2: Durgan pulls the Goblin; and B (a color per kind)
  const sc3 = { tokens: [{ k: "durgan", c: C(3, 1), control: true }, { k: "gob2", c: C(3, 5) }, { k: "orc", c: C(0, 8) }] };
  const pa = forced(C(3, 1), C(3, 5), 2, "pull", [C(3, 1)]);
  const pPu = map(sc3, fill(pa, GOLD, 0.12) + outline(pa, GOLD, 2) + token("gob2", C(3, 3), { ghost: true }), origin(C(3, 1)) + line([pt(C(3, 5)), pt(C(3, 3))], "#000", 6, { op: .5 }) + line([pt(C(3, 5)), pt(C(3, 3))], INK, 3) + arrowHead(pt(C(3, 5)), pt(C(3, 3)), INK) + dots([C(3, 4)]) + brackets(C(3, 3), { pad: 1, width: 2.5 })
    + plate(cx(3), 3 * S - 6, [{ t: "Pulled 2 of 2" }, { t: "toward Durgan" }]) + plate(cx(1), 4 * S + 6, [{ t: "into Durgan: a Collision", c: "bad" }], { below: true }));
  const pB = map(sc3, fill(pa, "#2366a3", 0.3) + outline(pa, "#5b9ad6", 2) + token("gob2", C(3, 3), { ghost: true }), line([pt(C(3, 5)), pt(C(3, 3))], "#5b9ad6", 4) + plate(cx(3), 3 * S - 6, [{ t: "Pulled 2 of 2" }])
    + `<g transform="translate(${6 * S + 8} ${4 * S + 10})"><rect width="${4 * S}" height="${2 * S + 20}" fill="${PLATE}" fill-opacity=".92" stroke="${RULE}"/>${[["Pushed", "#a8471a"], ["Pulled", "#2366a3"], ["Slid", "#0e6e52"]].map(([n, c], k) => `<rect x="10" y="${12 + k * 28}" width="18" height="18" fill="${c}"/><text x="36" y="${26 + k * 28}" font-size="13" fill="${INK}" font-family="Source Sans 3">${n}</text>`).join("")}<text x="10" y="${2 * S + 12}" font-size="11.5" fill="#ff9c92" font-family="Source Sans 3">= the Tier colors; red = "no"</text></g>`);
  out.push(sec("forced", "f. Forced Movement: Pushed, Pulled, Slid",
    "\"…the forced movement (and if they need different coloring)…\"",
    ["Pushed / Pulled: every square it may end in, white at 22% with a white edge; the path under the pointer green, a Collision red with a red cross (move.mjs:813-827). The white reads as \"the movement area\", the same job blue does for an Advance.",
      "The result is said <b>three times</b>: a black tip that follows the pointer (<code>.twod12-pushtip</code>), the HUD's bar, and for Slid a Foundry notification at the top (move.mjs:972). The HUD's sentence is the longest on screen (the rule's reminder in small type inside it).",
      "The wall damage reads \"Vigor damage\" here (move.mjs:835) and \"Body\" everywhere else (move.mjs:836, 923, 1061, 1385).",
      "<b>Escape is silent</b>: the creature isn't moved and nothing is said (move.mjs:1047). End movement moves it 0 and says so. The HUD has no Cancel.",
      "Slid: the path's squares blue, the next squares white; right-click takes a square back (the only place right-click does something else than pan)."],
    ["<b>The squares you may click are gold</b> (12% and a gold edge): they are a choice, like a creature to pick. The square under the pointer gets the gold corners.",
      "<b>The kind is told by shape and word, not color</b> (recommended, A): Pushed's arrow points away from the origin's ring, Pulled's toward it, Slid's steps are numbered. The plate names it (\"Pushed 1 of 2\") and gives the result; the faint portrait shows where it lands; a Collision is the red cross on the wall.",
      "<b>B, a color per kind</b> (drawn, not recommended): the only three free hues are palette A's Tier colors, so the map would say \"Tier 1\" for a push; and a red Pushed fights red = \"no\".",
      "<b>One readout</b> in the HUD (\"Here: moves 1, hits a wall: 1 unused, 1 Vigor damage.\"), no tip at the pointer, no notification. Rules a link.",
      "<b>Escape = Don't move it</b>, and it says so in the chat (\"was Pushed 0\"), the same as the button. Slid's take-back moves to Backspace and a button, so right-click pans everywhere."],
    row(fig("Today", "Aveline pushes Goblin Sneak 2 (Pushed 2), the pointer past the wall", tT + hT), fig("Proposed", "Gold squares to click, the arrow away from the ring, the result on the plate", pP + hP))
    + row(fig("Today", "Sylwen slides Goblin Sneak 2 (Slid 3), two squares chosen", tS + hST), fig("Proposed", "Numbered steps, the next squares gold, Backspace takes back", pS + hSP))
    + row(fig("Proposed A", "Pulled 2: the same colors, the arrow toward the ring", pPu + hud(pItem({ lead: "Pulled 2", tag: "Goblin Sneak 2 · toward Durgan", text: "Click the square where it ends (gold). Durgan's own square: a Collision.", rd: "Here: moves 2, no Collision.", btns: pb("Don't move it", "q"), keys: "<kbd>Esc</kbd> Don't move it · Right-click pans" }))),
      fig("B", "A color per kind (not recommended): Pulled in the Tier 3 blue", pB + hud(pItem({ lead: "Pulled 2", tag: "Goblin Sneak 2 · toward Durgan", text: "Click the square where it ends (blue).", btns: pb("Don't move it", "q"), keys: "<kbd>Esc</kbd> Don't move it" }))))));
}

/* ---------- g. picking whom to push */
{
  const sc = { tokens: [{ k: "aveline", c: C(5, 3), control: true }, { k: "orc", c: C(3, 5) }, { k: "gob1", c: C(1, 7) }, { k: "gob2", c: C(4, 6) }, { k: "gob3", c: C(2, 4) }] };
  const sqs = [C(4, 6), C(2, 4)];
  const tT = map(sc, sqs.map(c => fill([c], "#c9a24a", 0.22) + outline([c], "#c9a24a", 3)).join(""));
  const tH = hud(tBar("<b>Pushed 1</b> away from <b>Orc Warrior</b>: click a creature (here or its token) to move it. <small>Moved: Goblin Sneak 1.</small>", `<span class="pics" style="display:flex;gap:4px;flex:1 1 100%">${pic("gob2")}${pic("gob3")}</span>` + tb("Done") + tb("Stop", true)));
  const prop = (hov) => map(sc, "", origin(C(3, 5)) + brackets(C(4, 6), { anim: hov ? "" : "breathe", width: hov ? 4 : 3 }) + badge(C(4, 6), 2) + brackets(C(2, 4), { anim: "breathe" }) + badge(C(2, 4), 3)
    + plate(8 * S + 6, cy(1) - 10, [{ t: "Pushed 1 ✓", c: "mute" }], { below: true, anchor: "left" }) + plate(6 * S + 8, cy(3) - 10, [{ t: "from Orc Warrior", c: "mute" }], { below: true, anchor: "left" })
    + (hov ? line([P(C(4, 6)), P(C(5, 7))], "#000", 6, { op: .5 }) + line([P(C(4, 6)), P(C(5, 7))], INK, 3) + arrowHead(P(C(4, 6)), P(C(5, 7)), INK) + handCursor(cx(6) + 6, cy(4) + 4) + plate(8 * S, cy(5) - 6, [{ t: "Goblin Sneak 2" }, { t: "click to push it" }], { below: true, anchor: "left" }) : ""));
  const pH = hov => hud(pItem({ lead: "Smite", tag: "Pushed 1 · away from Orc Warrior", text: "Pick who is pushed next, here or on the map.", cnt: "<b>1</b><span>of 3 moved</span>", pics: pic("gob1", 1, "done") + pic("gob2", 2, hov ? "hov" : "") + pic("gob3", 3), btns: pb("Done: the rest stay", "q"), keys: "<kbd>Enter</kbd> the first left · <kbd>Esc</kbd> Done · Right-click pans" }));
  out.push(sec("pick", "g. Picking whom to push", "Smite (3 AP): the other creatures in the light are Pushed 1, away from the target, one at a time.",
    ["The candidates: a gold fill at 22% and a gold edge on their squares (pickbar.mjs:79); hovered, a pale yellow fill and a white edge. A creature already moved simply loses its mark; the bar lists it in small type (\"Moved: Goblin Sneak 1.\").",
      "The pictures in the HUD carry no number here (pushPicker passes none), so three Goblin Sneaks are three identical squares.",
      "<b>Done and Stop do the same thing</b> (move.mjs:1150: both end the list). And <b>Escape during one push counts that creature as moved</b> although it wasn't (move.mjs:1047 returns, then 1154 adds it to Moved and drops it from the list).",
      "The origin (the Orc, \"away from\") isn't marked on the map."],
    ["<b>The same gold corners as a Reaction</b>, breathing, with the number of its picture in the HUD (2, 3). The square isn't filled, so the token stays readable.",
      "<b>Done stays on the map</b>: a quiet plate \"Pushed 1 ✓\"; in the HUD its picture is faded with a check. The count: \"1 of 3 moved\".",
      "<b>Hover</b> (the pointer on a token or its picture): the corners stop breathing and thicken, its picture in the HUD is outlined, and a short pale arrow shows which way it would go.",
      "<b>One end button</b>, \"Done: the rest stay\" (Escape the same). Escape inside one creature's push doesn't count it as moved: it comes back to the list."],
    row(fig("Today", "Smite's Pushed 1: Goblin Sneak 1 already moved", tT + tH), fig("Proposed", "Corners and numbers; the moved one checked", prop(false) + pH(false)))
    + row(fig("Proposed", "The pointer on Goblin Sneak 2: the map and the HUD light together", prop(true) + pH(true), "Gold is only ever \"you can click this\": the HUD's Situational tab, the corners, the number squares, the squares of a Forced Movement."))));
}

/* ---------- h. finishing and cancelling */
{
  const R = [
    ["A Reaction", "Use · Pass", "-", "-", "-", "Use (filled) · Pass", "-", "Use", "pans"],
    ["Advance, Evade (from a card)", "End movement · Advance instead", "nothing", "-", "Foundry's", "End movement (filled) · Advance instead", "-", "End movement", "pans"],
    ["A Setup's movement", "Continue: the roll · Cancel the Action", "cancels the Action", "Continue", "Foundry's", "Continue: the roll (filled) · Cancel the Action", "Cancel the Action", "Continue", "pans"],
    ["Charge", "Charge! · Give up", "gives up (AP back)", "-", "pans (v0.0.460)", "Charge (filled) · Give up · 2 AP back", "Give up · 2 AP back", "Charge", "pans"],
    ["Charge, target set", "a left click anywhere Charges", "", "", "", "only Charge, Enter, or a click on the target", "", "", ""],
    ["Pushed, Pulled", "Rules · End movement (moves 0)", "<span class='bad'>silent: no move, no line</span>", "-", "ignored", "Don't move it (quiet) · Rules a link", "Don't move it (posts \"0\")", "-", "pans"],
    ["Slid, Reposition", "Rules · End movement", "<span class='bad'>silent</span>", "moves", "takes back a square", "Move it here (filled) · Take back a step · Don't move it", "Don't move it", "Move it here", "pans (Backspace takes back)"],
    ["Picking whom to push", "Done · Stop (<span class='bad'>the same</span>)", "stops", "the first", "ignored", "Done: the rest stay", "Done", "the first left", "pans"],
    ["Placing an area", "Cancel (the area bar)", "cancels", "-", "pans (v0.0.403)", "unchanged", "", "", ""]
  ];
  const tbl = `<table class="mn-t"><tr><th>State</th><th>Today: buttons</th><th>Esc</th><th>Enter</th><th>Right-click</th><th>Proposed: buttons</th><th>Esc</th><th>Enter</th><th>Right-click</th></tr>${R.map(r => `<tr>${r.map((c, k) => `<td${k === 0 ? ' style="font-weight:600"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</table>`;
  const one = (lead, tag, btns, k) => `<div style="border:1px solid var(--s-hair);width:300px">${hud(pItem({ lead, tag, text: "", btns, keys: k }), "Hands")}</div>`;
  const strip = `<div style="display:flex;gap:16px;flex-wrap:wrap">${one("Advance", "6 squares, free", pb("End movement", "go") + pb("Advance instead"), "<kbd>Enter</kbd> End movement · Right-click pans the map")}${one("Charge → Orc Warrior", "5 squares", pb("Charge", "go") + pb("Give up · 2 AP back", "q"), "<kbd>Enter</kbd> Charge · <kbd>Esc</kbd> Give up · Right-click pans")}${one("Pushed 2", "Goblin Sneak 2", pb("Don't move it", "q"), "<kbd>Esc</kbd> Don't move it · Right-click pans")}${one("Smite", "Pushed 1", pb("Done: the rest stay", "q"), "<kbd>Enter</kbd> the first left · <kbd>Esc</kbd> Done · Right-click pans")}${one("Strafe", "Setup", pb("Continue: the roll", "go") + pb("Cancel the Action", "q"), "<kbd>Enter</kbd> Continue · <kbd>Esc</kbd> Cancel the Action")}</div>`;
  out.push(sec("controls", "h. Finishing and cancelling, the same in every state", "",
    ["Eight names for ending: Done, Stop, Cancel, Give up, End movement, Cancel the Action, Charge!, Continue. Done and Stop do the same.",
      "Escape does five different things (gives up with AP back, cancels the Action, silently drops a push, stops a list, nothing at all for a free Advance) and is written nowhere on screen.",
      "Right-click pans in the Charge and the area placement, takes back a square in Slid, is ignored in a push."],
    ["<b>One order</b>: the thing to do filled and first; the others outlined; the way out quiet and last, named for what it does (\"Give up · 2 AP back\", \"Don't move it\", \"Cancel the Action\", \"Done: the rest stay\").",
      "<b>Escape presses the way-out button</b> (where there is one; never Pass on a Reaction), Enter the filled one, and <b>the key line under the buttons says both</b> (it is the same line in every state).",
      "<b>Right-click pans the map, always</b>; it never cancels or undoes (Slid's take-back moves to Backspace).",
      "Ending a Forced Movement without moving always posts its line (\"was Pushed 0\"), whether by the button or by Escape."],
    tbl + `<h3>The footer, five states side by side</h3>` + strip));
}

/* ---------- the choices */
out.push(`<section class="mn-sec mn-choices" id="s-choices"><h2>Lucas's choices</h2><p class="mn-q">The defaults are what is drawn as Proposed. The README has the reasons.</p><ol>
<li><b>The attention mark's motion:</b> A, gold corners that breathe (default) · B, a steady ring and a slow ripple · C, no motion (the gold corners alone).</li>
<li><b>Forced Movement's colors:</b> A, one set for every kind, the kind told by the arrow and the word (default) · B, a color per kind (palette A's Tier colors).</li>
<li><b>Charge without a target:</b> A, enemies only: a Charge always picks a creature first, as the book says (default) · B, keep clicking a destination square too.</li>
<li><b>Charge, confirming:</b> A, only the Charge button, Enter or a click on the target (default) · B, as today, any left click on the map.</li>
<li><b>Escape in a Forced Movement:</b> A, "Don't move it", posted as "was Pushed 0" (default) · B, as today, silent.</li>
<li><b>Slid's take-back:</b> A, Backspace and a "Take back a step" button, right-click pans (default) · B, keep right-click.</li>
<li><b>The plates:</b> A, dark in both themes (they sit on the map's art) (default) · B, parchment in the light theme.</li>
<li><b>The tip that follows the pointer</b> in a Forced Movement: A, removed (the plate and the HUD's readout say it) (default) · B, kept.</li>
</ol></section>`);

document.getElementById("page").insertAdjacentHTML("beforeend", out.join(""));
}
// the plates are measured with the page's font: build once it is loaded
const fontsIn = () => Promise.all(['600 13px "Source Sans 3"', '400 12px "Source Sans 3"', '600 22px "Source Serif 4"'].map(f => document.fonts.load(f))).catch(() => {});
document.documentElement.classList.toggle("twod12-light", new URLSearchParams(location.search).get("theme") === "light");
fontsIn().then(() => { build(); return document.fonts.ready; }).then(() => { const imgs = [...document.images]; return Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); }).then(() => { document.body.dataset.ready = "1"; });
