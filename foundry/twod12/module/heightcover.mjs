// Cover height calculation (v0.0.166): a side view of you and your target, for cover through heights (a ledge, a wall top, a creature on a roof).
// A manual, visual help (Lucas: mostly for the GM, open to everyone): you click squares to put blocks (one click a half square, two a full square,
// three clear it), and the window draws the cover lines as the rules say: from the center of your space to the four corners of the target's space,
// green when clear, red when a block is in the way, with the cover. Click one of your corners to start the lines there (as Leaning does, without
// the status). Nothing is applied: boons and banes are put on the roll by hand. Nothing is stored: the blocks last while the window is open.
// Units are squares; a creature is as tall as it is wide (Movement, Elevation); the starting heights are the tokens' elevations.
import { COVER_LABELS, segmentHitsRect } from "./cover.mjs";

const INSET = 0.04, EPS = 0.001;
const CORNER_KEYS = ["tl", "tr", "bl", "br"];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const mirrorCorner = k => ({ tl: "tr", tr: "tl", bl: "br", br: "bl" }[k] ?? k);

/** Where everything is in the side view (squares, y up): your space, the target's, and the columns between. */
export function sideLayout(st) {
  const wA = Math.max(1, Number(st.wA) || 1), wT = Math.max(1, Number(st.wT) || 1), d = clamp(Math.round(Number(st.dist) || 1), 1, 40);
  const hA = clamp(Number(st.hA) || 0, -20, 40), hT = clamp(Number(st.hT) || 0, -20, 40);
  const left = { x: 0, y: hA, w: wA, h: wA }, right = { x: wA + d - 1, y: hT, w: wT, h: wT };
  const A = st.flipped ? right : left, T = st.flipped ? left : right;
  const cols = right.x + right.w, rMin = Math.floor(Math.min(0, hA, hT)), rMax = Math.ceil(Math.max(hA + wA, hT + wT)) + 2;
  return { A, T, cols, rMin, rMax };
}

/** The block of one square: 1 = the lower half of the square, 2 = the whole square. */
export const blockRect = (c, r, v) => ({ x: c, y: r, w: 1, h: v >= 2 ? 1 : 0.5 });

/** Where the lines start: the center of your space, or one of its corners. */
export function originOf(A, corner) {
  if (!CORNER_KEYS.includes(corner)) return { x: A.x + A.w / 2, y: A.y + A.h / 2 };
  return { x: corner.endsWith("l") ? A.x : A.x + A.w, y: corner.startsWith("t") ? A.y + A.h : A.y };
}

/** The cover in the side view: { origin, corners: [{ x, y, blocked }], blocked, level, label, noLoE, exposed }. */
export function heightCover(st) {
  const { A, T } = sideLayout(st);
  const origin = originOf(A, st.origin);
  const blocks = Object.entries(st.blocks ?? {}).filter(([, v]) => v > 0).map(([k, v]) => { const [c, r] = k.split(",").map(Number); const b = blockRect(c, r, v); return { x: b.x + EPS, y: b.y + EPS, w: b.w - 2 * EPS, h: b.h - 2 * EPS }; });
  const t = { x: T.x + INSET, y: T.y + INSET, w: T.w - 2 * INSET, h: T.h - 2 * INSET };
  const corners = [{ x: t.x, y: t.y + t.h }, { x: t.x + t.w, y: t.y + t.h }, { x: t.x + t.w, y: t.y }, { x: t.x, y: t.y }]
    .map(p => ({ ...p, blocked: blocks.some(b => segmentHitsRect(origin, p, b)) }));
  const blocked = corners.filter(c => c.blocked).length, rawLevel = Math.min(4, blocked);
  const exposed = !!st.leaning && rawLevel >= 1;
  const level = exposed ? rawLevel - 1 : rawLevel;
  return { origin, corners, blocked, level, noLoE: level >= 4, exposed, label: COVER_LABELS[level] };
}

/** The text under the view. */
export function heightLabel(c) {
  const leanNote = c.exposed ? " · Target Leaning (−1)" : "";
  return c.noLoE ? "No Line of Effect: 4 of 4 blocked" : `${c.label}: ${c.blocked} blocked${leanNote}${c.level ? ` (${c.level} Bane${c.level > 1 ? "s" : ""}, put on the roll by hand)` : ""}`;
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
const CELL = 34, PADL = 26, PADB = 20;

/** v0.0.172: the chat message of a Snapshot: the title, the side view (the window's SVG) and the result, for everyone. */
export function snapshotHtml(title, viewHtml, st) {
  const cov = heightCover(st);
  const aName = st.flipped ? st.nameT : st.nameA, tName = st.flipped ? st.nameA : st.nameT;
  const aH = st.flipped ? st.hT : st.hA, tH = st.flipped ? st.hA : st.hT;
  return `<div class="twod12 chat twod12-height hc-snap"><h4>${esc(title)}</h4><div class="hc-view">${viewHtml}</div><p class="hc-result ${cov.noLoE ? "noloe" : cov.level ? "cover" : "clear"}"><b>${esc(heightLabel(cov))}</b></p><p class="hc-hint">${esc(aName)} height ${aH}, ${esc(tName)} height ${tH}, ${st.dist} square${st.dist === 1 ? "" : "s"} apart.</p></div>`;
}

/** The window's HTML: the heights and distance, the side view (SVG) and the result. */
export function heightHtml(st) {
  const L = sideLayout(st), cov = heightCover(st), rows = L.rMax - L.rMin;
  const X = x => PADL + x * CELL, Y = y => (L.rMax - y) * CELL + 4, W = PADL + L.cols * CELL + 8, H = rows * CELL + PADB + 8;
  const inside = (c, r, R) => c + 0.5 > R.x && c + 0.5 < R.x + R.w && r + 0.5 > R.y && r + 0.5 < R.y + R.h;
  let cells = "";
  for (let r = L.rMin; r < L.rMax; r++) {
    cells += `<text class="hc-axis" x="${PADL - 5}" y="${Y(r + 0.5) + 3.5}" text-anchor="end">${r >= 0 ? `+${r}` : r}</text>`;
    for (let c = 0; c < L.cols; c++) {
      if (inside(c, r, L.A) || inside(c, r, L.T)) continue;
      const v = st.blocks?.[`${c},${r}`] ?? 0;
      cells += `<rect class="hc-cell" data-cell="${c},${r}" x="${X(c)}" y="${Y(r + 1)}" width="${CELL}" height="${CELL}"><title>${v ? (v >= 2 ? "Full square (click: clear · right-click: erase)" : "Half square (click: full · right-click: erase)") : "Click or drag: paint block"}</title></rect>`;
      if (v) { const b = blockRect(c, r, v); cells += `<rect class="hc-block ${v >= 2 ? "full" : "half"}" x="${X(b.x) + 1}" y="${Y(b.y + b.h) + 1}" width="${CELL - 2}" height="${b.h * CELL - 2}" pointer-events="none"></rect>`; }
    }
  }
  for (let c = 0; c < L.cols; c++) cells += `<text class="hc-axis" x="${X(c + 0.5)}" y="${Y(L.rMin) + 14}" text-anchor="middle">${c}</text>`;
  const creature = (R, img, name, cls) => `<g class="hc-cre ${cls}"><rect x="${X(R.x)}" y="${Y(R.y + R.h)}" width="${R.w * CELL}" height="${R.h * CELL}"></rect>${img ? `<image href="${esc(img)}" x="${X(R.x) + 2}" y="${Y(R.y + R.h) + 2}" width="${R.w * CELL - 4}" height="${R.h * CELL - 4}" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>` : ""}<title>${esc(name)}</title></g>`;
  const lines = cov.corners.map(p => `<line class="hc-line ${p.blocked ? "red" : "green"}" x1="${X(cov.origin.x)}" y1="${Y(cov.origin.y)}" x2="${X(p.x)}" y2="${Y(p.y)}"></line><circle class="hc-dot ${p.blocked ? "red" : "green"}" cx="${X(p.x)}" cy="${Y(p.y)}" r="4"></circle>`).join("");
  const corners = ["center", ...CORNER_KEYS].map(k => { const p = originOf(L.A, k), on = (st.origin || "center") === k;
    return `<circle class="hc-corner${on ? " on" : ""}" data-corner="${k}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${on ? 7 : 6}"><title>${k === "center" ? "From the center of your space" : `From your ${{ tl: "top", tr: "top", bl: "bottom", br: "bottom" }[k]} ${k.endsWith("l") ? "left" : "right"} corner`}${on ? " (now)" : ""}</title></circle>`; }).join("");
  const ground = `<line class="hc-ground" x1="${PADL}" y1="${Y(0)}" x2="${PADL + L.cols * CELL}" y2="${Y(0)}"></line>`;   // the ground (height 0)
  const num = (n, v, step, label) => `<label>${label} <input type="number" name="${n}" value="${v}" step="${step}"></label>`;
  const aImg = st.flipped ? st.imgT : st.imgA, tImg = st.flipped ? st.imgA : st.imgT;
  const aName = st.flipped ? st.nameT : st.nameA, tName = st.flipped ? st.nameA : st.nameT;
  return `<div class="hc">
    <div class="hc-row">${num("hA", st.hA, 0.5, `${esc(st.nameA)} height`)}${num("hT", st.hT, 0.5, `${esc(st.nameT)} height`)}${num("dist", st.dist, 1, "Squares apart")}<button type="button" class="hc-fill" aria-label="Fill solid stone blocks beneath elevated creatures"><i class="fa-solid fa-layer-group"></i> Fill floor</button><button type="button" class="hc-flip${st.flipped ? " on" : ""}" aria-label="Swap attacker and target to check return fire"><i class="fa-solid fa-right-left"></i> Flip</button><button type="button" class="hc-lean${st.leaning ? " on" : ""}" aria-pressed="${!!st.leaning}">Target Leaning (&minus;1)</button><button type="button" class="hc-clear">Clear</button><button type="button" class="hc-snapbtn" aria-label="Send this side view and its result to the chat, for everyone"><i class="fa-solid fa-camera"></i> Snapshot</button></div>
    <div class="hc-view"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Side view: ${esc(heightLabel(cov))}">${cells}${ground}${creature(L.A, aImg, aName, "you")}${creature(L.T, tImg, tName, "target")}${lines}${corners}</svg></div>
    <p class="hc-result ${cov.noLoE ? "noloe" : cov.level ? "cover" : "clear"}"><b>${esc(heightLabel(cov))}</b></p>
    <p class="hc-hint">Left-click or drag to paint blocks (half → full → clear); right-click to erase. Click dots on the attacker to Lean. Heights in squares; a creature is as tall as it is wide.</p>
  </div>`;
}

/* ------------------------------------------------------------------ the Snapshot as a picture (v0.0.173: the chat strips an SVG, so it is sent as a PNG) */
// STYLE-3 warm stone blocks on dark charcoal so green/red sightlines stay high-contrast in chat snapshots too.
const SNAP_CSS = `.hc-cell{fill:transparent;stroke:rgba(255,255,255,.10);stroke-width:1}.hc-axis{fill:#8f8066;font:700 10px "Source Sans 3",sans-serif}.hc-block.full{fill:#4a4338;stroke:#8c7d63;stroke-width:1.5}
.hc-block.half{fill:#6e624d;stroke:#b3a68e;stroke-width:1.5}.hc-ground{stroke:#d2a75a;stroke-width:2.5}.hc-cre rect{fill:rgba(46,92,107,.55);stroke:#7cc4f2;stroke-width:2}
.hc-cre.target rect{fill:rgba(135,51,46,.55);stroke:#d2a75a}.hc-line{stroke-width:2.5}.hc-line.green,.hc-dot.green{stroke:#58c472;fill:#58c472}.hc-line.red,.hc-dot.red{stroke:#e85d52;fill:#e85d52}
.hc-corner{fill:#1f1c18;stroke:#d2a75a;stroke-width:2}.hc-corner.on{fill:#d2a75a}`;

/** A file (a token's picture) as a data: URL, or "" when it can't be read. */
async function asDataUrl(src) {
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(""); fr.readAsDataURL(blob); });
  } catch (e) { return ""; }
}

/** The side view (the window's SVG element) as a PNG Blob, twice its size, on the STYLE-3 charcoal grid backdrop. */
export async function svgToPng(svg, cssText = SNAP_CSS) {
  const NS = "http://www.w3.org/2000/svg", W = Number(svg.getAttribute("width")) || 300, H = Number(svg.getAttribute("height")) || 200;
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", NS);
  clone.querySelectorAll("title").forEach(t => t.remove());
  for (const im of [...clone.querySelectorAll("image")]) { const d = await asDataUrl(im.getAttribute("href")); if (d) im.setAttribute("href", d); else im.remove(); }
  const style = document.createElementNS(NS, "style"); style.textContent = cssText; clone.prepend(style);
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`; });
  const k = 2, cv = document.createElement("canvas");
  cv.width = W * k; cv.height = H * k;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#171411"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  return await new Promise(res => cv.toBlob(res, "image/png"));
}

/** Where the picture lives: uploaded to twod12-snapshots/ in the Data folder; a user who can't upload files sends it inside the message instead. */
export async function storeSnapshot(blob, prefix = "cover-height") {
  const FP = foundry.applications?.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
  try {
    try { await FP.createDirectory("data", "twod12-snapshots", {}); } catch (e) { /* already there */ }
    const res = await FP.upload("data", "twod12-snapshots", new File([blob], `${prefix}-${Date.now()}.png`, { type: "image/png" }), {}, { notify: false });
    if (res?.path) return res.path;
  } catch (e) { console.warn("twod12 | the Snapshot could not be uploaded; it goes inside the message", e); }
  return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(""); fr.readAsDataURL(blob); });
}

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? class {};
export class HeightCover extends ApplicationV2 {
  static DEFAULT_OPTIONS = { classes: ["twod12", "twod12-height"], tag: "div", window: { title: "Cover height calculation", icon: "fa-solid fa-mountain", resizable: true }, position: { width: 640, height: "auto" } };
  static open(attacker, target) {
    const gs = canvas.grid.size, unit = Number(canvas.scene?.grid?.distance ?? canvas.dimensions?.distance) || 1;
    const id = `twod12-height-${attacker.id}-${target.id}`;
    const existing = foundry.applications?.instances?.get?.(id);
    if (existing?.rendered) { existing.bringToFront?.(); return existing; }
    const st = { nameA: attacker.name, nameT: target.name, imgA: attacker.document.texture?.src ?? "", imgT: target.document.texture?.src ?? "",
      wA: attacker.document.width, wT: target.document.width, hA: (Number(attacker.document.elevation) || 0) / unit, hT: (Number(target.document.elevation) || 0) / unit,
      dist: flatSquares(attacker, target, gs), blocks: {}, origin: "center", leaning: !!target.actor?.statuses?.has?.("leaning"), flipped: false };
    const app = new HeightCover({ id, window: { title: `Cover height: ${attacker.name} \u2192 ${target.name}` } });
    app.st = st;
    app._paint = null;
    return app.render({ force: true });
  }
  async _renderHTML() { return heightHtml(this.st); }
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this._onUp = () => { this._paint = null; };
    window.addEventListener("pointerup", this._onUp);
    this.element.addEventListener("keydown", ev => { if (ev.key === "Escape") { ev.preventDefault(); this.close(); } });
  }
  async close(options) {
    if (this._onUp) { window.removeEventListener("pointerup", this._onUp); this._onUp = null; }
    return super.close(options);
  }
  _replaceHTML(result, content) {
    const oldView = content.querySelector(".hc-view");
    const sx = oldView?.scrollLeft ?? 0, sy = oldView?.scrollTop ?? 0;
    content.innerHTML = result;
    const view = content.querySelector(".hc-view");
    if (view) { view.scrollLeft = sx; view.scrollTop = sy; }
    const st = this.st;
    const svg = content.querySelector("svg");
    if (svg) {
      svg.addEventListener("contextmenu", ev => {
        const cell = ev.target.closest?.("[data-cell]");
        if (!cell) return;
        ev.preventDefault();
        delete st.blocks[cell.dataset.cell];
        this.render();
      });
      svg.addEventListener("pointerdown", ev => {
        if (ev.button !== 0) return;
        const corner = ev.target.closest?.("[data-corner]");
        if (corner) { st.origin = corner.dataset.corner; this.render(); return; }
        const cell = ev.target.closest?.("[data-cell]");
        if (!cell) return;
        const k = cell.dataset.cell, next = ((st.blocks[k] ?? 0) + 1) % 3;
        this._paint = next;
        if (next) st.blocks[k] = next; else delete st.blocks[k];
        this.render();
      });
      svg.addEventListener("pointermove", ev => {
        if (this._paint === null || !(ev.buttons & 1)) return;
        const cell = ev.target.closest?.("[data-cell]");
        if (!cell) return;
        const k = cell.dataset.cell, cur = st.blocks[k] ?? 0;
        if (cur === this._paint) return;
        if (this._paint) st.blocks[k] = this._paint; else delete st.blocks[k];
        this.render();
      });
    }
    content.querySelectorAll("input[type=number]").forEach(i => i.addEventListener("change", () => {
      const v = Number(i.value);
      if (Number.isFinite(v)) st[i.name] = i.name === "dist" ? clamp(Math.round(v), 1, 40) : clamp(v, -20, 40);
      this.render();
    }));
    content.querySelector(".hc-fill")?.addEventListener("click", () => {
      const L = sideLayout(st);
      for (const R of [L.A, L.T]) {
        const top = Math.floor(R.y);
        for (let c = R.x; c < R.x + R.w; c++) for (let r = Math.min(0, L.rMin); r < top; r++) st.blocks[`${c},${r}`] = 2;
      }
      this.render();
    });
    content.querySelector(".hc-flip")?.addEventListener("click", () => {
      st.flipped = !st.flipped;
      st.origin = mirrorCorner(st.origin);
      const aName = st.flipped ? st.nameT : st.nameA, tName = st.flipped ? st.nameA : st.nameT;
      const ttl = this.element?.querySelector?.(".window-title");
      const title = `Cover height: ${aName} \u2192 ${tName}`;
      if (this.options?.window) this.options.window.title = title;
      if (ttl) ttl.textContent = title;
      this.render();
    });
    content.querySelector(".hc-lean")?.addEventListener("click", () => { st.leaning = !st.leaning; this.render(); });
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
