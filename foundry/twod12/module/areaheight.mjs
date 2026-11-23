// 3D Area Height Calculator: linked Top-Down Map + Side Cross-Section using exact 2d12 3D geometry.
// - Burst (N Burst): 3D Euclidean sphere from grid corner (cx, cy, cz): hypot(j+0.5-cx, i+0.5-cy, k+0.5-cz) <= N + 0.01
// - Emanation (N Emanation): 1-2-1 horizontal + withHeight vertical from every cube of the origin's space (supports 1x1..4x4)
// - Line (Line N): lineSquares from linearea.mjs (angled/diagonal aiming) + inLineHeight (configurable height)
import { esc } from "./util.mjs";
import { withHeight } from "./light.mjs";
import { lineSquares, inLineHeight } from "./linearea.mjs";
import { svgToPng, storeSnapshot } from "./heightcover.mjs";

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? class {};
const cost2d = (di, dj) => Math.max(Math.abs(di), Math.abs(dj)) + Math.floor(Math.min(Math.abs(di), Math.abs(dj)) / 2);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Pure: compute the 2D squares of a Line when shape === "line". */
export function lineCellSet(st) {
  const start = { x: st.cx, y: st.cy };
  const aim = { x: st.aimX ?? (st.cx + st.radius), y: st.aimY ?? st.cy };
  if (aim.x === start.x && aim.y === start.y) aim.x += 1;
  const cells = lineSquares(start, aim, st.radius, st.lineSide ?? "left");
  return new Set(cells.map(c => `${c.x},${c.y}`));
}

/** Pure: whether grid cube (j, i, k) falls inside the 3D area. */
export function cubeInArea(j, i, k, st, lineSet = null) {
  if (st.shape === "burst") {
    return Math.hypot(j + 0.5 - st.cx, i + 0.5 - st.cy, k + 0.5 - st.cz) <= st.radius + 0.01;
  }
  if (st.shape === "emanation") {
    const osz = Math.max(1, Math.min(4, Math.trunc(Number(st.originSize) || 1)));
    let best = Infinity;
    for (let di = 0; di < osz; di++) {
      for (let dj = 0; dj < osz; dj++) {
        for (let dk = 0; dk < osz; dk++) {
          const d = withHeight(cost2d(i - (st.cy + di), j - (st.cx + dj)), Math.abs(k - (st.cz + dk)));
          if (d < best) best = d;
        }
      }
    }
    return best <= st.radius;
  }
  const ls = lineSet ?? lineCellSet(st);
  if (!ls.has(`${j},${i}`)) return false;
  return inLineHeight(st.cz, k, 1, Math.max(1, Number(st.lineHeight) || 1));
}

/** Pure: whether square (j, i) falls inside the 2D top-down footprint (dz = 0). */
export function cellIn2D(j, i, st, lineSet = null) {
  if (st.shape === "burst") {
    return Math.hypot(j + 0.5 - st.cx, i + 0.5 - st.cy) <= st.radius + 0.01;
  }
  if (st.shape === "emanation") {
    const osz = Math.max(1, Math.min(4, Math.trunc(Number(st.originSize) || 1)));
    let best = Infinity;
    for (let di = 0; di < osz; di++) for (let dj = 0; dj < osz; dj++) {
      const d = cost2d(i - (st.cy + di), j - (st.cx + dj));
      if (d < best) best = d;
    }
    return best <= st.radius;
  }
  return (lineSet ?? lineCellSet(st)).has(`${j},${i}`);
}

/** Pure: evaluate whether a cube creature (x, y, z, size) is hit, missed by height, or horizontally out of area. */
export function evaluateCreature(c, st, lineSet = null) {
  const sz = Math.max(1, Math.round(Number(c.size) || 1));
  const hitZ = [];
  let inFlat = false;
  for (let di = 0; di < sz; di++) {
    for (let dj = 0; dj < sz; dj++) {
      const j = c.x + dj, i = c.y + di;
      if (cellIn2D(j, i, st, lineSet)) inFlat = true;
      for (let dk = 0; dk < sz; dk++) {
        const k = c.z + dk;
        if (cubeInArea(j, i, k, st, lineSet)) hitZ.push(k);
      }
    }
  }
  if (hitZ.length) {
    const lo = Math.min(...hitZ), hi = Math.max(...hitZ);
    return { hit: true, missedByHeight: false, reason: `Hit at +${lo}${hi > lo ? `\u2013+${hi}` : ""}` };
  }
  if (inFlat) {
    const cTop = c.z + sz;
    const blastRef = st.shape === "burst" ? st.cz : st.cz + 0.5;
    return { hit: false, missedByHeight: true, reason: cTop <= blastRef ? "Below blast" : "Above blast" };
  }
  return { hit: false, missedByHeight: false, reason: "Out of area" };
}

/** Seed initial state from tokens on the current Foundry scene (or a sensible sandbox if empty). */
function seedFromScene() {
  const gm = !!game.user?.isGM;
  const unit = Number(canvas?.scene?.grid?.distance ?? canvas?.dimensions?.distance) || 5;
  const toks = (canvas?.tokens?.placeables ?? []).filter(t => t.actor && (gm || (!t.document?.hidden && t.visible !== false)));
  const selected = (canvas?.tokens?.controlled ?? [])[0] ?? [...(game.user?.targets ?? [])][0] ?? toks[0] ?? null;

  if (!toks.length) {
    return {
      cols: 12, rows: 9, zMax: 7,
      shape: "burst", radius: 3, originSize: 1, lineHeight: 1, lineSide: "left",
      cx: 6, cy: 5, cz: 2, aimX: 9, aimY: 5,
      sliceMode: "ground", sliceRow: null,
      creatures: [
        { id: "c1", name: "Ally", side: "ally", x: 5, y: 5, z: 0, size: 1, col: "#2e5c6b", abbr: "AL" },
        { id: "c2", name: "Ogre", side: "foe", x: 6, y: 4, z: 0, size: 2, col: "#7a2c29", abbr: "OG" },
        { id: "c3", name: "Archer", side: "foe", x: 8, y: 5, z: 2, size: 1, col: "#87332e", abbr: "AR" },
        { id: "c4", name: "Harpy", side: "foe", x: 5, y: 3, z: 4, size: 1, col: "#783f6a", abbr: "HA" }
      ]
    };
  }

  const raw = toks.map(t => {
    const d = t.document, o = canvas.grid.getOffset({ x: d.x + 2, y: d.y + 2 });
    const z = Math.max(0, Math.round((Number(d.elevation) || 0) / unit));
    const sz = Math.max(1, Math.round(Number(d.width) || 1));
    const disp = Number(d.disposition ?? (t.actor?.type === "character" ? 1 : -1));
    const clean = String(t.name ?? "?").replace(/\s*\(.*\)\s*$/, "").trim() || "?";
    const abbr = clean.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
    return { id: t.id, name: clean, side: disp > 0 ? "ally" : "foe", gx: o.j, gy: o.i, z, size: sz, col: disp > 0 ? "#2e5c6b" : disp < 0 ? "#7a2c29" : "#6b6152", abbr };
  });

  // Center a 14×10 window around the selected token (or centroid of visible tokens)
  const anchor = selected ? raw.find(r => r.id === selected.id) ?? raw[0] : raw[0];
  const cols = 14, rows = 10;
  const x0 = Math.round(anchor.gx - cols / 2), y0 = Math.round(anchor.gy - rows / 2);
  const creatures = raw
    .map(r => ({ ...r, x: r.gx - x0, y: r.gy - y0 }))
    .filter(r => r.x + r.size > 0 && r.x < cols && r.y + r.size > 0 && r.y < rows)
    .slice(0, 16);
  const maxZ = Math.max(6, ...creatures.map(c => c.z + c.size + 2));
  const cx = clamp(anchor.gx - x0, 1, cols - 2), cy = clamp(anchor.gy - y0, 1, rows - 2);
  return {
    cols, rows, zMax: Math.min(12, maxZ),
    shape: "burst", radius: 3, originSize: 1, lineHeight: 1, lineSide: "left",
    cx, cy, cz: Math.max(0, anchor.z), aimX: clamp(cx + 4, 0, cols - 1), aimY: cy,
    sliceMode: "ground", sliceRow: null,
    creatures
  };
}

const AH_SNAP_CSS = `.ah-cell{fill:transparent;stroke:rgba(255,255,255,.09);stroke-width:1}.ah-cell.in{fill:rgba(210,167,90,.34);stroke:rgba(210,167,90,.55)}
.ah-cell.sil{fill:rgba(176,90,160,.16)}.ah-sil{stroke:#d2a75a;stroke-width:1.5;stroke-dasharray:4 3;opacity:.7}.ah-axis{fill:#8f8066;font:700 9.5px "Source Sans 3",sans-serif}
.ah-ground{stroke:#d2a75a;stroke-width:2.5}.ah-orig{fill:#d2a75a;stroke:#1a1713;stroke-width:2}.ah-sline{stroke:#7cc4f2;stroke-width:1;stroke-dasharray:3 3;opacity:.55}`;

/** Pure HTML render for the Area Height Calculator window. */
export function areaHeightHtml(st) {
  const COLS = st.cols, ROWS = st.rows, ZMAX = st.zMax, CELL = 28, PADL = 24, PADB = 18;
  const lineSet = st.shape === "line" ? lineCellSet(st) : null;
  const inspectZ = st.sliceMode === "ground" ? 0 : Math.max(0, st.cz - (st.shape === "burst" && st.cz > 0 ? 1 : 0));
  const activeRow = st.sliceRow !== null && st.sliceRow !== undefined ? clamp(st.sliceRow, 0, ROWS - 1) : (st.shape === "burst" ? clamp(st.cy - 1, 0, ROWS - 1) : clamp(st.cy, 0, ROWS - 1));

  const hasAny = (j, i) => { for (let k = 0; k < ZMAX; k++) if (cubeInArea(j, i, k, st, lineSet)) return true; return false; };
  let tdCells = "", silSegs = "";
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const inSlice = cubeInArea(j, i, inspectZ, st, lineSet);
      const inAny = inSlice || hasAny(j, i);
      const x = j * CELL, y = i * CELL;
      const cls = inSlice ? "ah-cell in" : inAny ? "ah-cell sil" : "ah-cell";
      tdCells += `<rect class="${cls}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" data-ah-td="${j},${i}"/>`;
      if (inAny) {
        if (!hasAny(j, i - 1)) silSegs += `<line class="ah-sil" x1="${x}" y1="${y}" x2="${x + CELL}" y2="${y}" pointer-events="none"/>`;
        if (!hasAny(j, i + 1)) silSegs += `<line class="ah-sil" x1="${x}" y1="${y + CELL}" x2="${x + CELL}" y2="${y + CELL}" pointer-events="none"/>`;
        if (!hasAny(j - 1, i)) silSegs += `<line class="ah-sil" x1="${x}" y1="${y}" x2="${x}" y2="${y + CELL}" pointer-events="none"/>`;
        if (!hasAny(j + 1, i)) silSegs += `<line class="ah-sil" x1="${x + CELL}" y1="${y}" x2="${x + CELL}" y2="${y + CELL}" pointer-events="none"/>`;
      }
    }
  }

  const evaluated = st.creatures.map(c => ({ c, info: evaluateCreature(c, st, lineSet) }));
  const tdCreatures = evaluated.map(({ c, info }) => {
    const x = c.x * CELL, y = c.y * CELL, s = c.size * CELL;
    const ring = info.hit ? "#d2a75a" : info.missedByHeight ? "#7cc4f2" : "#5a5040";
    const badge = info.hit ? "HIT" : info.missedByHeight ? (info.reason === "Below blast" ? "BELOW" : "ABOVE") : "";
    return `<g pointer-events="none">
      <rect x="${x + 2}" y="${y + 2}" width="${s - 4}" height="${s - 4}" rx="${c.size === 1 ? s / 2 : 5}" fill="${c.col}" stroke="${ring}" stroke-width="${info.hit ? 2.4 : 1.4}" opacity="${info.hit ? 1 : 0.68}"/>
      <text x="${x + s / 2}" y="${y + s / 2 + 3.5}" text-anchor="middle" fill="#f6eedc" font-size="9.5" font-weight="800">${esc(c.abbr)}</text>
      <rect x="${x + s - 19}" y="${y + 1}" width="18" height="11" fill="#171411" stroke="#5c503d" stroke-width="1"/>
      <text x="${x + s - 10}" y="${y + 9}" text-anchor="middle" fill="#ece3cf" font-size="8" font-weight="700">+${c.z}</text>
      ${badge ? `<rect x="${x + s / 2 - 17}" y="${y + s - 10}" width="34" height="11" fill="${info.hit ? "#d2a75a" : "#1f1c18"}" stroke="${info.hit ? "#d2a75a" : "#7cc4f2"}" stroke-width="1"/><text x="${x + s / 2}" y="${y + s - 2}" text-anchor="middle" fill="${info.hit ? "#1a1713" : "#7cc4f2"}" font-size="7.5" font-weight="800">${badge}</text>` : ""}
    </g>`;
  }).join("");

  const osz = st.shape === "emanation" ? Math.max(1, Math.min(4, Math.trunc(Number(st.originSize) || 1))) : 1;
  const ox = st.shape === "burst" ? st.cx * CELL : (st.cx + osz / 2) * CELL;
  const oy = st.shape === "burst" ? st.cy * CELL : (st.cy + osz / 2) * CELL;
  const sliceLineY = (activeRow + 0.5) * CELL;

  // Side Cross-Section along activeRow
  const SW = PADL + COLS * CELL + 8, SH = ZMAX * CELL + PADB + 8;
  const sx = j => PADL + j * CELL, sy = k => (ZMAX - 1 - k) * CELL + 4;
  const groundY = sy(0) + CELL;
  let sideCells = "";
  for (let k = 0; k < ZMAX; k++) {
    sideCells += `<text class="ah-axis" x="${PADL - 4}" y="${sy(k) + CELL / 2 + 3.5}" text-anchor="end">+${k}</text>`;
    for (let j = 0; j < COLS; j++) {
      const inSlice = cubeInArea(j, activeRow, k, st, lineSet) || (st.shape === "burst" && st.sliceRow === null && cubeInArea(j, st.cy, k, st, lineSet));
      sideCells += `<rect class="ah-cell${inSlice ? " in" : ""}" x="${sx(j)}" y="${sy(k)}" width="${CELL}" height="${CELL}" data-ah-side="${j},${k}"/>`;
    }
  }
  sideCells += `<line class="ah-ground" x1="${PADL}" y1="${groundY}" x2="${PADL + COLS * CELL}" y2="${groundY}"/>`;
  for (let j = 0; j < COLS; j++) sideCells += `<text class="ah-axis" x="${sx(j) + CELL / 2}" y="${groundY + 13}" text-anchor="middle">${j}</text>`;

  const scx = st.shape === "burst" ? sx(st.cx) : sx(st.cx) + (osz * CELL) / 2;
  const scy = st.shape === "burst" ? groundY - st.cz * CELL : groundY - (st.cz + osz / 2) * CELL;

  const sideCreatures = evaluated.map(({ c, info }) => {
    const x = sx(c.x), w = c.size * CELL, h = c.size * CELL, y = groundY - (c.z + c.size) * CELL;
    const onSlice = activeRow >= c.y && activeRow < c.y + c.size;
    const dy = onSlice ? 0 : (activeRow < c.y ? c.y - activeRow : activeRow - (c.y + c.size - 1));
    const stroke = info.hit ? "#d2a75a" : info.missedByHeight ? "#7cc4f2" : "#6a5d48";
    const dash = onSlice ? "" : ' stroke-dasharray="3 2"';
    const floorBar = c.z > 0 ? `<line x1="${x + w / 2}" y1="${y + h}" x2="${x + w / 2}" y2="${groundY}" stroke="#6a5d48" stroke-width="1" stroke-dasharray="3 2"/>` : "";
    return `<g pointer-events="none">${floorBar}
      <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" fill="${c.col}" fill-opacity="${onSlice ? (info.hit ? 0.88 : 0.55) : 0.3}" stroke="${stroke}" stroke-width="${info.hit ? 2.2 : 1.4}"${dash}/>
      <text x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle" fill="#f6eedc" font-size="9.5" font-weight="800">${esc(c.abbr)}</text>
      ${dy ? `<text x="${x + w / 2}" y="${y - 2}" text-anchor="middle" fill="#8f8066" font-size="8" font-weight="700">\u0394y=${dy}</text>` : ""}
    </g>`;
  }).join("");

  const hits = evaluated.filter(x => x.info.hit);
  const hitFoes = hits.filter(x => x.c.side === "foe").length, hitAllies = hits.filter(x => x.c.side === "ally").length;
  const shapeLabel = st.shape === "burst" ? `${st.radius} Burst` : st.shape === "emanation" ? `${st.radius} Emanation` : `Line ${st.radius}`;

  const rowsHtml = evaluated.map(({ c, info }) => `
    <div class="ah-cre ${info.hit ? "hit" : "miss"}" data-ah-focus="${esc(c.id)}">
      <div class="ah-cmeta">
        <div class="ah-cname"><i class="ah-dot" style="background:${c.col}"></i><span>${esc(c.name)}</span></div>
        <div class="ah-csub">${c.size === 1 ? "1\u00d71" : `${c.size}\u00d7${c.size}`} \u00b7 +${c.z} sq \u00b7 ${esc(info.reason)}</div>
      </div>
      <div class="ah-cctrl">
        <span class="pw-step ah-sm"><button type="button" data-ah-cz="${esc(c.id)}:-1" aria-label="Lower creature">&minus;</button><button type="button" data-ah-cz="${esc(c.id)}:+1" aria-label="Raise creature">+</button></span>
        <span class="ah-tag ${info.hit ? "hit" : info.missedByHeight ? "ht" : "out"}">${info.hit ? "HIT" : info.missedByHeight ? "HT" : "OUT"}</span>
      </div>
    </div>`).join("");

  return `<div class="ah">
    <div class="ah-bar">
      <span class="ah-seg">
        <button type="button" data-ah-sh="burst" class="${st.shape === "burst" ? "on" : ""}">Burst</button>
        <button type="button" data-ah-sh="emanation" class="${st.shape === "emanation" ? "on" : ""}">Emanation</button>
        <button type="button" data-ah-sh="line" class="${st.shape === "line" ? "on" : ""}">Line</button>
      </span>
      <span class="ah-grp"><span>Size</span><span class="pw-step"><button type="button" data-ah-act="r-1" aria-label="Smaller">&minus;</button><b>${st.radius}</b><button type="button" data-ah-act="r+1" aria-label="Larger">+</button></span></span>
      <span class="ah-grp"><span>Height</span><span class="pw-step"><button type="button" data-ah-act="z-1" aria-label="Lower">&minus;</button><b>+${st.cz} sq</b><button type="button" data-ah-act="z+1" aria-label="Higher">+</button></span></span>
      ${st.shape === "emanation" ? `<span class="ah-grp"><span>Origin</span><span class="pw-step"><button type="button" data-ah-act="o-1" aria-label="Smaller origin">&minus;</button><b>${osz}\u00d7${osz}</b><button type="button" data-ah-act="o+1" aria-label="Larger origin">+</button></span></span>` : ""}
      ${st.shape === "line" ? `<span class="ah-grp"><span>Tall</span><span class="pw-step"><button type="button" data-ah-act="lh-1" aria-label="Shorter line">&minus;</button><b>${st.lineHeight} sq</b><button type="button" data-ah-act="lh+1" aria-label="Taller line">+</button></span></span>` : ""}
      <span class="ah-seg ah-right">
        <button type="button" data-ah-sm="ground" class="${st.sliceMode === "ground" ? "on" : ""}">Ground (0)</button>
        <button type="button" data-ah-sm="blast" class="${st.sliceMode === "blast" ? "on" : ""}">Blast (+${Math.max(0, st.cz - (st.shape === "burst" && st.cz > 0 ? 1 : 0))})</button>
      </span>
      <button type="button" class="ah-btn" data-ah-act="sync" aria-label="Reload tokens from scene"><i class="fa-solid fa-rotate"></i></button>
      <button type="button" class="ah-btn" data-ah-act="snap" aria-label="Send snapshot to chat"><i class="fa-solid fa-camera"></i> Snapshot</button>
    </div>
    <div class="ah-grid">
      <div class="ah-pane">
        <div class="ah-cap"><b>Top-Down (z = +${inspectZ})</b><span>${st.shape === "line" ? "Click = origin · Right-click = aim" : "Click to move origin"}</span></div>
        <div class="ah-svgbox"><svg class="ah-tdsvg" viewBox="0 0 ${COLS * CELL} ${ROWS * CELL}" width="${COLS * CELL}" height="${ROWS * CELL}">${tdCells}${silSegs}<line class="ah-sline" x1="0" y1="${sliceLineY}" x2="${COLS * CELL}" y2="${sliceLineY}" pointer-events="none"/>${tdCreatures}<circle class="ah-orig" cx="${ox}" cy="${oy}" r="5" pointer-events="none"/></svg></div>
      </div>
      <div class="ah-pane">
        <div class="ah-cap"><b>Side Cross-Section (row y=${activeRow})</b><span>Click to set X &amp; Height${st.sliceRow !== null ? ' · <a data-ah-act="resetrow">Center</a>' : ""}</span></div>
        <div class="ah-svgbox"><svg class="ah-sidesvg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}">${sideCells}${sideCreatures}<circle class="ah-orig" cx="${scx}" cy="${scy}" r="5" pointer-events="none"/></svg></div>
      </div>
      <div class="ah-pane ah-roster">
        <div class="ah-cap"><b>Hit: <span class="ah-gold">${hits.length} / ${evaluated.length}</span></b><span>${hitFoes} foe \u00b7 ${hitAllies} ally</span></div>
        <div class="ah-list">${rowsHtml || '<div class="ah-empty">No tokens in view.</div>'}</div>
      </div>
    </div>
    <div class="ah-foot"><b>${esc(shapeLabel)} at +${st.cz} sq</b> \u2014 Q / E adjusts height. Click a creature row to slice through its row; \u0394y marks creatures off the current slice.</div>
  </div>`;
}

export class AreaHeightWindow extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "twod12-area-height",
    classes: ["twod12", "twod12-areaheight"],
    tag: "div",
    window: { title: "Area Height Calculator (3D)", icon: "fa-solid fa-cube", resizable: true },
    position: { width: 960, height: "auto" }
  };

  static open() {
    const existing = foundry.applications?.instances?.get?.("twod12-area-height");
    if (existing?.rendered) { existing.bringToFront?.(); return existing; }
    const app = new AreaHeightWindow();
    app.st = seedFromScene();
    return app.render({ force: true });
  }

  async _renderHTML() { return areaHeightHtml(this.st); }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this.element.addEventListener("keydown", ev => {
      if (ev.target.closest?.("input, textarea, select")) return;
      if (ev.key === "Escape") { ev.preventDefault(); return this.close(); }
      if (!ev.shiftKey && !ev.ctrlKey && !ev.altKey && !ev.metaKey) {
        if (ev.key === "q" || ev.key === "Q") { ev.preventDefault(); this.st.cz = Math.max(0, this.st.cz - 1); return this.render(); }
        if (ev.key === "e" || ev.key === "E") { ev.preventDefault(); this.st.cz = Math.min(this.st.zMax - 1, this.st.cz + 1); return this.render(); }
      }
    });
  }

  _replaceHTML(result, content) {
    content.innerHTML = result;
    const st = this.st;
    content.querySelectorAll("[data-ah-sh]").forEach(b => b.addEventListener("click", () => {
      st.shape = b.dataset.ahSh;
      if (st.shape === "line" && st.radius < 4) st.radius = 6;
      this.render();
    }));
    content.querySelectorAll("[data-ah-sm]").forEach(b => b.addEventListener("click", () => { st.sliceMode = b.dataset.ahSm; this.render(); }));
    content.querySelectorAll("[data-ah-act]").forEach(b => b.addEventListener("click", async () => {
      const a = b.dataset.ahAct;
      if (a === "r-1") st.radius = Math.max(1, st.radius - 1);
      else if (a === "r+1") st.radius = Math.min(10, st.radius + 1);
      else if (a === "z-1") st.cz = Math.max(0, st.cz - 1);
      else if (a === "z+1") st.cz = Math.min(st.zMax - 1, st.cz + 1);
      else if (a === "o-1") st.originSize = Math.max(1, (st.originSize || 1) - 1);
      else if (a === "o+1") st.originSize = Math.min(4, (st.originSize || 1) + 1);
      else if (a === "lh-1") st.lineHeight = Math.max(1, (st.lineHeight || 1) - 1);
      else if (a === "lh+1") st.lineHeight = Math.min(6, (st.lineHeight || 1) + 1);
      else if (a === "resetrow") st.sliceRow = null;
      else if (a === "sync") this.st = seedFromScene();
      else if (a === "snap") {
        b.disabled = true;
        try {
          const svg = content.querySelector(".ah-sidesvg");
          const src = svg ? await storeSnapshot(await svgToPng(svg, AH_SNAP_CSS), "area-height") : "";
          const hits = st.creatures.filter(c => evaluateCreature(c, st).hit).map(c => c.name);
          const lbl = st.shape === "burst" ? `${st.radius} Burst` : st.shape === "emanation" ? `${st.radius} Emanation` : `Line ${st.radius}`;
          const pic = src ? `<img class="hc-snapimg" src="${esc(src)}" alt="Area height cross-section">` : "";
          await ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<div class="twod12 chat twod12-height hc-snap"><h4>Area Height: ${esc(lbl)} at +${st.cz} sq</h4><div class="hc-view">${pic}</div><p class="hc-result cover"><b>Hit (${hits.length}):</b> ${hits.length ? esc(hits.join(", ")) : "none"}</p></div>`
          });
        } catch (e) { console.error("twod12 | Area Height Snapshot", e); ui.notifications.warn("Could not post Area Height snapshot."); }
        finally { b.disabled = false; }
        return;
      }
      this.render();
    }));
    content.querySelectorAll("[data-ah-cz]").forEach(b => b.addEventListener("click", ev => {
      ev.stopPropagation();
      const [id, d] = b.dataset.ahCz.split(":");
      const c = st.creatures.find(x => x.id === id);
      if (c) { c.z = clamp(c.z + Number(d), 0, st.zMax - 1); this.render(); }
    }));
    content.querySelectorAll("[data-ah-focus]").forEach(row => row.addEventListener("click", ev => {
      if (ev.target.closest("button")) return;
      const c = st.creatures.find(x => x.id === row.dataset.ahFocus);
      if (c) { st.sliceRow = c.y; this.render(); }
    }));
    const td = content.querySelector(".ah-tdsvg");
    if (td) {
      td.addEventListener("click", ev => {
        const cell = ev.target.closest?.("[data-ah-td]");
        if (!cell) return;
        const [j, i] = cell.dataset.ahTd.split(",").map(Number);
        st.cx = j; st.cy = i;
        if (st.shape === "line" && st.aimX === j && st.aimY === i) st.aimX = clamp(j + 4, 0, st.cols - 1);
        this.render();
      });
      td.addEventListener("contextmenu", ev => {
        if (st.shape !== "line") return;
        const cell = ev.target.closest?.("[data-ah-td]");
        if (!cell) return;
        ev.preventDefault();
        const [j, i] = cell.dataset.ahTd.split(",").map(Number);
        st.aimX = j; st.aimY = i;
        this.render();
      });
    }
    content.querySelector(".ah-sidesvg")?.addEventListener("click", ev => {
      const cell = ev.target.closest?.("[data-ah-side]");
      if (!cell) return;
      const [j, k] = cell.dataset.ahSide.split(",").map(Number);
      st.cx = j; st.cz = k;
      this.render();
    });
  }
}
