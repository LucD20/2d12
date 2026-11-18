// Cover height calculation (v0.0.166): a side view of you and your target, for cover through heights (a ledge, a wall top, a creature on a roof).
// A manual, visual help (Lucas: mostly for the GM, open to everyone): you click squares to put blocks (one click a half square, two a full square,
// three clear it), and the window draws the cover lines as the rules say: from the center of your space to the four corners of the target's space,
// green when clear, red when a block is in the way, with the cover. Click one of your corners to start the lines there (as Leaning does, without
// the status). Nothing is applied: boons and banes are put on the roll by hand. Nothing is stored: the blocks last while the window is open.
// Units are squares; a creature is as tall as it is wide (Movement, Elevation); the starting heights are the tokens' elevations.
import { COVER_LABELS, segmentHitsRect } from "./cover.mjs";

const INSET = 0.04, EPS = 0.001;
const CORNER_KEYS = ["tl", "tr", "bl", "br"];

/** Where everything is in the side view (squares, y up): your space, the target's, and the columns between. */
export function sideLayout(st) {
  const wA = Math.max(1, Number(st.wA) || 1), wT = Math.max(1, Number(st.wT) || 1), d = Math.max(1, Math.round(Number(st.dist) || 1));
  const hA = Number(st.hA) || 0, hT = Number(st.hT) || 0;
  const A = { x: 0, y: hA, w: wA, h: wA }, xT = wA + d - 1, T = { x: xT, y: hT, w: wT, h: wT };
  const cols = xT + wT, rMin = Math.floor(Math.min(0, hA, hT)), rMax = Math.ceil(Math.max(hA + wA, hT + wT)) + 2;
  return { A, T, cols, rMin, rMax };
}

/** The block of one square: 1 = the lower half of the square, 2 = the whole square. */
export const blockRect = (c, r, v) => ({ x: c, y: r, w: 1, h: v >= 2 ? 1 : 0.5 });

/** Where the lines start: the center of your space, or one of its corners. */
export function originOf(A, corner) {
  if (!CORNER_KEYS.includes(corner)) return { x: A.x + A.w / 2, y: A.y + A.h / 2 };
  return { x: corner.endsWith("l") ? A.x : A.x + A.w, y: corner.startsWith("t") ? A.y + A.h : A.y };
}

/** The cover in the side view: { origin, corners: [{ x, y, blocked }], blocked, level, label, noLoE }. */
export function heightCover(st) {
  const { A, T } = sideLayout(st);
  const origin = originOf(A, st.origin);
  const blocks = Object.entries(st.blocks ?? {}).filter(([, v]) => v > 0).map(([k, v]) => { const [c, r] = k.split(",").map(Number); const b = blockRect(c, r, v); return { x: b.x + EPS, y: b.y + EPS, w: b.w - 2 * EPS, h: b.h - 2 * EPS }; });
  const t = { x: T.x + INSET, y: T.y + INSET, w: T.w - 2 * INSET, h: T.h - 2 * INSET };
  const corners = [{ x: t.x, y: t.y + t.h }, { x: t.x + t.w, y: t.y + t.h }, { x: t.x + t.w, y: t.y }, { x: t.x, y: t.y }]
    .map(p => ({ ...p, blocked: blocks.some(b => segmentHitsRect(origin, p, b)) }));
  const blocked = corners.filter(c => c.blocked).length, level = Math.min(4, blocked);
  return { origin, corners, blocked, level, noLoE: level >= 4, label: COVER_LABELS[level] };
}

/** The text under the view. */
export function heightLabel(c) {
  return c.noLoE ? "No Line of Effect: 4 of 4 blocked" : `${c.label}: ${c.blocked} blocked${c.level ? ` (${c.level} Bane${c.level > 1 ? "s" : ""}, put on the roll by hand)` : ""}`;
}

/** Squares between two tokens on the map, without heights (the book's count: every second diagonal counts 2). */
export function flatSquares(a, b, gs) {
  const r = t => { const d = t?.document ?? t; return { x: d.x, y: d.y, w: (d.width ?? 1) * gs, h: (d.height ?? 1) * gs }; };
  const A = r(a), B = r(b);
  const along = (a1, aw, b1, bw) => ((a1 < b1 + bw - 1e-6 && b1 < a1 + aw - 1e-6) ? 0 : Math.round(Math.max(0, a1 - (b1 + bw), b1 - (a1 + aw)) / gs) + 1);
  const di = along(A.y, A.h, B.y, B.h), dj = along(A.x, A.w, B.x, B.w);
  return Math.max(1, Math.max(di, dj) + Math.floor(Math.min(di, dj) / 2));
}

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[c]);
const CELL = 34;

/** v0.0.172: the chat message of a Snapshot: the title, the side view (the window's SVG) and the result, for everyone. */
export function snapshotHtml(title, viewHtml, st) {
  const cov = heightCover(st);
  return `<div class="twod12 chat twod12-height hc-snap"><h4>${esc(title)}</h4><div class="hc-view">${viewHtml}</div><p class="hc-result ${cov.noLoE ? "noloe" : cov.level ? "cover" : "clear"}"><b>${esc(heightLabel(cov))}</b></p><p class="hc-hint">${esc(st.nameA)} height ${st.hA}, ${esc(st.nameT)} height ${st.hT}, ${st.dist} square${st.dist === 1 ? "" : "s"} apart.</p></div>`;
}

/** The window's HTML: the heights and distance, the side view (SVG) and the result. */
export function heightHtml(st) {
  const L = sideLayout(st), cov = heightCover(st), rows = L.rMax - L.rMin;
  const X = x => x * CELL, Y = y => (L.rMax - y) * CELL, W = L.cols * CELL, H = rows * CELL;
  const inside = (c, r, R) => c + 0.5 > R.x && c + 0.5 < R.x + R.w && r + 0.5 > R.y && r + 0.5 < R.y + R.h;
  let cells = "";
  for (let r = L.rMin; r < L.rMax; r++) for (let c = 0; c < L.cols; c++) {
    if (inside(c, r, L.A) || inside(c, r, L.T)) continue;
    const v = st.blocks?.[`${c},${r}`] ?? 0;
    cells += `<rect class="hc-cell" data-cell="${c},${r}" x="${X(c)}" y="${Y(r + 1)}" width="${CELL}" height="${CELL}"><title>${v ? (v >= 2 ? "Full square (click: clear)" : "Half square (click: full)") : "Click: a half square"}</title></rect>`;
    if (v) { const b = blockRect(c, r, v); cells += `<rect class="hc-block ${v >= 2 ? "full" : "half"}" x="${X(b.x) + 1}" y="${Y(b.y + b.h) + 1}" width="${CELL - 2}" height="${b.h * CELL - 2}" pointer-events="none"></rect>`; }
  }
  const creature = (R, img, name, cls) => `<g class="hc-cre ${cls}"><rect x="${X(R.x)}" y="${Y(R.y + R.h)}" width="${R.w * CELL}" height="${R.h * CELL}"></rect>${img ? `<image href="${esc(img)}" x="${X(R.x) + 2}" y="${Y(R.y + R.h) + 2}" width="${R.w * CELL - 4}" height="${R.h * CELL - 4}" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>` : ""}<title>${esc(name)}</title></g>`;
  const lines = cov.corners.map(p => `<line class="hc-line ${p.blocked ? "red" : "green"}" x1="${X(cov.origin.x)}" y1="${Y(cov.origin.y)}" x2="${X(p.x)}" y2="${Y(p.y)}"></line><circle class="hc-dot ${p.blocked ? "red" : "green"}" cx="${X(p.x)}" cy="${Y(p.y)}" r="4"></circle>`).join("");
  const corners = ["center", ...CORNER_KEYS].map(k => { const p = originOf(L.A, k), on = (st.origin || "center") === k;
    return `<circle class="hc-corner${on ? " on" : ""}" data-corner="${k}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${on ? 7 : 6}"><title>${k === "center" ? "From the center of your space" : `From your ${{ tl: "top", tr: "top", bl: "bottom", br: "bottom" }[k]} ${k.endsWith("l") ? "back" : "front"} corner`}${on ? " (now)" : ""}</title></circle>`; }).join("");
  const ground = `<line class="hc-ground" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"></line>`;   // the ground (height 0)
  const num = (n, v, step, label) => `<label>${label} <input type="number" name="${n}" value="${v}" step="${step}"></label>`;
  return `<div class="hc">
    <div class="hc-row">${num("hA", st.hA, 0.5, `${esc(st.nameA)} height`)}${num("hT", st.hT, 0.5, `${esc(st.nameT)} height`)}${num("dist", st.dist, 1, "Squares apart")}<button type="button" class="hc-clear">Clear blocks</button><button type="button" class="hc-snapbtn" aria-label="Send this side view and its result to the chat, for everyone"><i class="fa-solid fa-camera"></i> Snapshot</button></div>
    <div class="hc-view"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Side view: ${esc(heightLabel(cov))}">${cells}${ground}${creature(L.A, st.imgA, st.nameA, "you")}${creature(L.T, st.imgT, st.nameT, "target")}${lines}${corners}</svg></div>
    <p class="hc-result ${cov.noLoE ? "noloe" : cov.level ? "cover" : "clear"}"><b>${esc(heightLabel(cov))}</b></p>
    <p class="hc-hint">Click a square: a half square, then a full square, then empty. Click the center or a corner of your space to start the lines there. Heights in squares (from the tokens' elevation); a creature is as tall as it is wide.</p>
  </div>`;
}

/* ------------------------------------------------------------------ the Snapshot as a picture (v0.0.173: the chat strips an SVG, so it is sent as a PNG) */
// The window's colors, written into the picture (an SVG drawn as an image can't read the system's CSS).
const SNAP_CSS = `.hc-cell{fill:transparent;stroke:rgba(30,36,48,.25);stroke-width:1}.hc-block.full{fill:rgba(192,57,43,.65);stroke:#e02020;stroke-width:3}
.hc-block.half{fill:rgba(224,192,32,.55);stroke:#f0d000;stroke-width:3}.hc-ground{stroke:#1e2430;stroke-width:3}.hc-cre rect{fill:rgba(255,255,255,.15);stroke:#1e2430;stroke-width:2}
.hc-cre.target rect{stroke:#b06a12}.hc-line{stroke-width:2.5}.hc-line.green,.hc-dot.green{stroke:#2fa84f;fill:#2fa84f}.hc-line.red,.hc-dot.red{stroke:#d23b2f;fill:#d23b2f}
.hc-corner{fill:#fff;stroke:#1e2430;stroke-width:2}.hc-corner.on{fill:#7a2f22}`;

/** A file (a token's picture) as a data: URL, or "" when it can't be read. */
async function asDataUrl(src) {
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(""); fr.readAsDataURL(blob); });
  } catch (e) { return ""; }
}

/** The side view (the window's SVG element) as a PNG Blob, twice its size, on the window's grey. */
export async function svgToPng(svg) {
  const NS = "http://www.w3.org/2000/svg", W = Number(svg.getAttribute("width")) || 300, H = Number(svg.getAttribute("height")) || 200;
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", NS);
  clone.querySelectorAll("title").forEach(t => t.remove());
  for (const im of [...clone.querySelectorAll("image")]) { const d = await asDataUrl(im.getAttribute("href")); if (d) im.setAttribute("href", d); else im.remove(); }
  const style = document.createElementNS(NS, "style"); style.textContent = SNAP_CSS; clone.prepend(style);
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`; });
  const k = 2, cv = document.createElement("canvas");
  cv.width = W * k; cv.height = H * k;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#8f8f8f"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  return await new Promise(res => cv.toBlob(res, "image/png"));
}

/** Where the picture lives: uploaded to twod12-snapshots/ in the Data folder; a user who can't upload files sends it inside the message instead. */
async function storeSnapshot(blob) {
  const FP = foundry.applications?.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
  try {
    try { await FP.createDirectory("data", "twod12-snapshots", {}); } catch (e) { /* already there */ }
    const res = await FP.upload("data", "twod12-snapshots", new File([blob], `cover-height-${Date.now()}.png`, { type: "image/png" }), {}, { notify: false });
    if (res?.path) return res.path;
  } catch (e) { console.warn("twod12 | the Snapshot could not be uploaded; it goes inside the message", e); }
  return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(""); fr.readAsDataURL(blob); });
}

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? class {};
export class HeightCover extends ApplicationV2 {
  static DEFAULT_OPTIONS = { classes: ["twod12", "twod12-height"], tag: "div", window: { title: "Cover height calculation", icon: "fa-solid fa-mountain", resizable: true }, position: { width: 600, height: "auto" } };
  static open(attacker, target) {
    const gs = canvas.grid.size, unit = Number(canvas.scene?.grid?.distance ?? canvas.dimensions?.distance) || 1;
    const id = `twod12-height-${attacker.id}-${target.id}`;
    const st = { nameA: attacker.name, nameT: target.name, imgA: attacker.document.texture?.src ?? "", imgT: target.document.texture?.src ?? "",
      wA: attacker.document.width, wT: target.document.width, hA: (Number(attacker.document.elevation) || 0) / unit, hT: (Number(target.document.elevation) || 0) / unit,
      dist: flatSquares(attacker, target, gs), blocks: {}, origin: "center" };
    const app = new HeightCover({ id, window: { title: `Cover height: ${attacker.name} \u2192 ${target.name}` } });
    app.st = st;
    return app.render({ force: true });
  }
  async _renderHTML() { return heightHtml(this.st); }
  _replaceHTML(result, content) {
    content.innerHTML = result;
    const st = this.st;
    content.querySelector("svg")?.addEventListener("click", ev => {
      const cell = ev.target.closest?.("[data-cell]"), corner = ev.target.closest?.("[data-corner]");
      if (corner) st.origin = corner.dataset.corner;
      else if (cell) { const k = cell.dataset.cell, v = ((st.blocks[k] ?? 0) + 1) % 3; if (v) st.blocks[k] = v; else delete st.blocks[k]; }
      else return;
      this.render();
    });
    content.querySelectorAll("input[type=number]").forEach(i => i.addEventListener("change", () => { const v = Number(i.value); if (Number.isFinite(v)) st[i.name] = i.name === "dist" ? Math.max(1, Math.round(v)) : v; this.render(); }));
    content.querySelector(".hc-clear")?.addEventListener("click", () => { st.blocks = {}; this.render(); });
    content.querySelector(".hc-snapbtn")?.addEventListener("click", async ev => {
      const btn = ev.currentTarget; btn.disabled = true;
      try {
        const svg = content.querySelector(".hc-view svg"), src = svg ? await storeSnapshot(await svgToPng(svg)) : "";
        const pic = src ? `<img class="hc-snapimg" src="${esc(src)}" alt="Side view">` : "";
        await ChatMessage.create({ content: snapshotHtml(this.options.window?.title ?? "Cover height", pic, st), speaker: ChatMessage.getSpeaker() });
      } catch (e) { console.error("twod12 | Snapshot", e); ui.notifications.warn("The Snapshot could not be made (see the console)."); }
      finally { btn.disabled = false; }
    });
  }
}
