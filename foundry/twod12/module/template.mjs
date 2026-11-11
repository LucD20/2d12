// Grid areas: Emanation (squares within N by the 1-2-1 diagonal rule, from the creature's squares),
// Burst (squares whose centers are within N of a square center or a grid corner) and, v0.0.214, Line (linearea.mjs: from your square, aimed).
const { DialogV2 } = foundry.applications.api;
const COLOR = 0xb05aa0;
const MOVES = { walk: "Walk", fly: "Fly", swim: "Swim", climb: "Climb", crawl: "Crawl", burrow: "Burrow" };
const key = c => `${c.i},${c.j}`;
const size = () => canvas.grid.size;
import { HT_PATTERNS, parsePatterns, patternText } from "./hazard.mjs";
import { homePos } from "./lean.mjs";
import { tokenDistance } from "./light.mjs";
import { coverFromPoint, wallBlocks } from "./cover.mjs";
import { lineFromSpace, cutLine, inLineHeight } from "./linearea.mjs";
import { solidTile } from "./corners.mjs";
import { shapesForCells } from "./regionshape.mjs";

/** The center of a token's whole space. */
const spaceCenter = tk => { const s = canvas.grid.size, d = tk.document, h = homePos(d); return { x: h.x + (d.width ?? 1) * s / 2, y: h.y + (d.height ?? 1) * s / 2 }; };

/**
 * How far the Point of Origin is from the creature using the Action, in squares (the book's count): the target creature of an Emanation, a square, or a grid corner
 * (the squares that touch it: the nearest counts).
 */
export function placementDistance(user, placed) {
  if (!user || !placed) return 0;
  if (placed.origin) return tokenDistance(user, placed.origin);
  const p = placed.point;
  if (!p) return 0;
  const cells = new Map();
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) { const c = cellAt({ x: p.x + dx, y: p.y + dy }); cells.set(`${c.i},${c.j}`, c); }
  return Math.min(...[...cells.values()].map(c => { const tl = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j }); return tokenDistance(user, { document: { x: tl.x, y: tl.y, width: 1, height: 1 } }); }));
}

/**
 * The creatures an area really affects: Line of Effect is checked from the Point of Origin to each creature in it (from the center of the space when the origin is a creature's space).
 * Returns { affected, blocked (no Line of Effect), cover: { tokenId: cover from the Point of Origin } }.
 */
export function areaReach(placed, tokens, { blockedFn } = {}) {
  const affected = [], blocked = [], cover = {};
  // v0.0.214: creatures in a Line don't give cover to other creatures in it (placed.noCover: their ids and the user's); walls still do.
  const opts = { ...(blockedFn ? { blockedFn } : {}), exclude: [placed?.origin?.id, ...(placed?.noCover ?? [])].filter(Boolean) };
  for (const t of tokens) {
    const cov = placed?.point ? coverFromPoint(placed.point, t, opts) : null;
    if (cov) cover[t.id] = cov;
    (cov?.noLoE ? blocked : affected).push(t);
  }
  return { affected, blocked, cover };
}

export const cellAt = p => { const o = canvas.grid.getOffset(p); return { i: o.i, j: o.j }; };
const cTL = (i, j) => canvas.grid.getTopLeftPoint({ i, j });
const cost = (di, dj) => { const a = Math.max(Math.abs(di), Math.abs(dj)), b = Math.min(Math.abs(di), Math.abs(dj)); return a + Math.floor(b / 2); };

export function tokenCells(token) {
  const doc = token.document ?? token;
  const home = homePos(doc), tl = cellAt({ x: home.x + 2, y: home.y + 2 });   // a nudged (Leaning) token is in its own square
  const out = [];
  for (let a = 0; a < Math.max(1, Math.round(doc.height)); a++) for (let b = 0; b < Math.max(1, Math.round(doc.width)); b++) out.push({ i: tl.i + a, j: tl.j + b });
  return out;
}

export function emanationCells(origin, n) {
  const out = new Map();
  const is = origin.map(c => c.i), js = origin.map(c => c.j);
  for (let i = Math.min(...is) - n; i <= Math.max(...is) + n; i++) {
    for (let j = Math.min(...js) - n; j <= Math.max(...js) + n; j++) {
      if (Math.min(...origin.map(o => cost(i - o.i, j - o.j))) <= n) out.set(key({ i, j }), { i, j });
    }
  }
  return [...out.values()];
}

export function burstCells(center, r) {
  const s = size(), c0 = cellAt(center), out = [];
  const reach = Math.ceil(r) + 1;
  for (let i = c0.i - reach; i <= c0.i + reach; i++) {
    for (let j = c0.j - reach; j <= c0.j + reach; j++) {
      const tl = cTL(i, j);
      if (Math.hypot(tl.x + s / 2 - center.x, tl.y + s / 2 - center.y) <= r * s + 0.01) out.push({ i, j });
    }
  }
  return out;
}

function rect(g, x, y, w, h, color, alpha) {
  if (typeof g.beginFill === "function") { g.beginFill(color, alpha); g.drawRect(x, y, w, h); g.endFill(); }
  else { g.rect(x, y, w, h); g.fill({ color, alpha }); }
}

function line(g, a, b, color, width, alpha = 1) {
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); }
  else { g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke({ width, color, alpha }); }
}
export const cellCenter = (i, j) => canvas.grid.getCenterPoint({ i, j });
export function fillCells(g, cells, color, alpha) {
  const s = size();
  for (const c of cells) { const tl = cTL(c.i, c.j); rect(g, tl.x, tl.y, s, s, color, alpha); }
}
/** An edge around the whole area (not around every square): a dark line under a bright one. */
export function outlineCells(g, cells, { color = 0xffffff, width = 3, under = 0x000000 } = {}) {
  const s = size(), set = new Set(cells.map(key)), segs = [];
  for (const c of cells) {
    const tl = cTL(c.i, c.j);
    if (!set.has(key({ i: c.i - 1, j: c.j }))) segs.push([{ x: tl.x, y: tl.y }, { x: tl.x + s, y: tl.y }]);
    if (!set.has(key({ i: c.i + 1, j: c.j }))) segs.push([{ x: tl.x, y: tl.y + s }, { x: tl.x + s, y: tl.y + s }]);
    if (!set.has(key({ i: c.i, j: c.j - 1 }))) segs.push([{ x: tl.x, y: tl.y }, { x: tl.x, y: tl.y + s }]);
    if (!set.has(key({ i: c.i, j: c.j + 1 }))) segs.push([{ x: tl.x + s, y: tl.y }, { x: tl.x + s, y: tl.y + s }]);
  }
  for (const [w, col, al] of [[width + 3, under, 0.6], [width, color, 1]]) for (const [a, b] of segs) line(g, a, b, col, w, al);
}

/** The name of an area: "Line 10" (the value after the word, like Aura, as the book writes it); "Burst 2", "Emanation 1" as before. */
export const areaName = (shape, n) => (shape === "line" ? `Line ${n}` : `${shape === "burst" ? "Burst" : "Emanation"} ${n}`);   // the old names of the other two kept (region and chat names)

/** A square a Line can't enter: a solid Tile (marked solid by the GM) over its center. */
function solidCell(c) {
  const p = cellCenter(c.i, c.j);
  return (canvas.tiles?.placeables ?? []).some(t => { const d = t.document; return solidTile(d) && p.x >= d.x && p.x <= d.x + d.width && p.y >= d.y && p.y <= d.y + d.height; });
}

/**
 * A Line from the user's space toward a square (book: Areas > Line). Its squares are cut at the first square it can't enter (a wall between it and the
 * previous square, or a solid Tile). Returns { cells, passed (tie squares not taken, among the kept ones), hasTie, origin: null, point, line, user }.
 */
export function lineCompute(user, n, pos, side = "left") {
  if (!user) return null;
  const s = size(), aimC = cellAt(pos), tl = cTL(aimC.i, aimC.j);
  const space = tokenCells(user).map(c => ({ x: c.j, y: c.i })), aim = { x: aimC.j, y: aimC.i };
  const point = { x: aim.x + (pos.x - tl.x) / s, y: aim.y + (pos.y - tl.y) / s };
  const { start, cells } = lineFromSpace(space, aim, n, side, point);
  if (!start) return null;
  const toIJ = c => ({ i: c.y, j: c.x });
  const kept = cutLine(cells, start, (a, b) => wallBlocks(cellCenter(a.y, a.x), cellCenter(b.y, b.x)) || solidCell(toIJ(b)));
  return {
    cells: kept.map(toIJ), passed: kept.filter(c => c.other).map(c => toIJ(c.other)), hasTie: cells.some(c => c.tie), cut: kept.length < cells.length,
    origin: null, point: cellCenter(start.y, start.x), line: { origin: start, target: aim, value: n, side }, user
  };
}

/** The squares of a placed Line, rebuilt from what its region keeps ({ origin, target, value, side }; the same walls cut it). */
export function lineCellsFromFlag(flag, user) {
  if (!flag?.origin || !flag?.target) return [];
  const tl = cTL(flag.target.y, flag.target.x), s = size();
  const tk = user ?? { document: { x: cTL(flag.origin.y, flag.origin.x).x, y: cTL(flag.origin.y, flag.origin.x).y, width: 1, height: 1 } };
  return lineCompute(tk, flag.value, { x: tl.x + s / 2, y: tl.y + s / 2 }, flag.side)?.cells ?? [];
}

/** The creatures a Line reaches in height: 1 square high from the user's elevation unless the card says otherwise (a creature flying above it is not in it). */
function lineHeightOk(user, t, height = 1) {
  const unit = Number(canvas.scene?.grid?.distance) || 5, e = d => (Number(d?.elevation) || 0) / unit;
  return inLineHeight(e(user?.document), e(t.document), Number(t.document?.width) || 1, height);
}

/** Dashed square edges (PIXI has no dashed lines): the tie squares a Line passed over. */
function dashedCells(g, cells, color = 0xf3c9ee) {
  const s = size(), dash = s / 8;
  for (const c of cells) {
    const tl = cTL(c.i, c.j), pts = [[tl.x, tl.y, 1, 0], [tl.x + s, tl.y, 0, 1], [tl.x + s, tl.y + s, -1, 0], [tl.x, tl.y + s, 0, -1]];
    for (const [x, y, ux, uy] of pts) for (let d = 0; d < s; d += 2 * dash) line(g, { x: x + ux * d, y: y + uy * d }, { x: x + ux * Math.min(s, d + dash), y: y + uy * Math.min(s, d + dash) }, color, 2, 0.9);
  }
}

const tokensAt = c => canvas.tokens.placeables.filter(t => tokenCells(t).some(x => x.i === c.i && x.j === c.j));
const tokensIn = cells => { const set = new Set(cells.map(key)); return canvas.tokens.placeables.filter(t => tokenCells(t).some(c => set.has(key(c)))); };
/**
 * v0.0.246 (cards 1, Smite): the creatures in an N Emanation around these tokens (the book's 1-2-1 shape from every square of their spaces: the squares
 * a light of size N reaches), the tokens themselves left out. Hidden tokens and tokens with no creature are left out too.
 */
export function tokensInEmanation(tokens, n) {
  const list = (tokens ?? []).filter(Boolean);
  if (!list.length || !(Number(n) > 0)) return [];
  const cells = new Map();
  for (const t of list) for (const c of emanationCells(tokenCells(t), Number(n))) cells.set(key(c), c);
  const ids = new Set(list.map(t => t.id));
  return tokensIn([...cells.values()]).filter(t => !ids.has(t.id) && t.actor && !t.document?.hidden);
}

function compute(shape, n, pos, { user = null, side = "left" } = {}) {
  if (shape === "line") return lineCompute(user, n, pos, side);
  if (shape === "emanation") {
    const c = cellAt(pos), tk = tokensAt(c)[0] ?? null;
    const baseCells = tk ? tokenCells(tk) : [c];
    return { cells: emanationCells(baseCells, n), origin: tk, baseCells, point: tk ? spaceCenter(tk) : cellCenter(c.i, c.j) };
  }
  const o = cellAt(pos), tl = cTL(o.i, o.j), s = size();
  // v0.0.176 (book, Burst): a Burst is centered on a corner, never on the center of a square: it snaps to the nearest grid corner.
  const pts = [{ x: tl.x, y: tl.y }, { x: tl.x + s, y: tl.y }, { x: tl.x, y: tl.y + s }, { x: tl.x + s, y: tl.y + s }];
  const c = pts.reduce((a, b) => (Math.hypot(b.x - pos.x, b.y - pos.y) < Math.hypot(a.x - pos.x, a.y - pos.y) ? b : a));
  return { cells: burstCells(c, n), origin: null, point: c };
}

const localPos = ev => (ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage));

/** Interactive placement: move to preview, left-click to place, right-click or Escape to cancel. */
/** Minimize every open window (character sheets, item sheets, dialogs) while an area is placed on the map; returns what brings them back. */
export async function stepAside() {
  const done = [];
  try {
    for (const a of foundry.applications?.instances?.values?.() ?? []) if (a.rendered && a.hasFrame && !a.minimized && a.options?.window?.minimizable !== false) { await a.minimize?.(); done.push(a); }
    for (const a of Object.values(ui.windows ?? {})) if (a.rendered && !a._minimized && a.popOut) { await a.minimize?.(); done.push(a); }
  } catch (e) { console.warn("twod12 | minimizing windows", e); }
  return async () => { for (const a of done) { try { await a.maximize?.(); } catch (e) { /* closed meanwhile */ } } };
}

function place(shape, n, { within = 0, user = null } = {}) {
  return new Promise(resolve => {
    const gfx = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(gfx);
    const prevInteractive = canvas.tokens.interactiveChildren;
    canvas.tokens.interactiveChildren = false;
    let current = null, side = "left", lastPos = null;
    const isLine = shape === "line";
    // v0.0.214: a Line's tie side (left or right, from you toward the target), chosen before placing and locked when placed: Tab or the button.
    const bar = isLine ? document.createElement("div") : null;
    if (bar) {
      // v0.0.216 (Lucas: the bar looked poor and the button text overflowed): the target-picking banner's look; Left and Right are two buttons.
      bar.className = "twod12-linebar";
      bar.innerHTML = `<i class="fa-solid fa-arrow-right-long lb-ic"></i><span class="lb-text">Line ${n}: aim with the mouse, click to place, right-click or Esc to cancel.</span><span class="lb-side" hidden><span class="lb-lbl" data-tooltip="Where the line passes exactly between two squares, every tie takes this side (seen from you toward the aim). Tab switches.">Ties</span><button type="button" data-side="left">Left</button><button type="button" data-side="right">Right</button><kbd>Tab</kbd></span>`;
      document.body.append(bar);
      bar.querySelectorAll(".lb-side button").forEach(b => b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); if (b.dataset.side !== side) flip(); }));
    }
    const flip = () => { side = side === "left" ? "right" : "left"; if (lastPos) current = compute(shape, n, lastPos, { user, side }); draw(); };
    const showBar = () => {
      if (!bar) return;
      const b = bar.querySelector(".lb-side"), tie = !!current?.hasTie;
      b.hidden = !tie; b.style.display = tie ? "" : "none";
      b.querySelectorAll("button").forEach(x => x.classList.toggle("on", x.dataset.side === side));
      bar.querySelector(".lb-text").textContent = !current ? `Line ${n}: aim with the mouse at any square.` : `Line ${n}: ${current.cells.length} square${current.cells.length === 1 ? "" : "s"}${current.cut ? ", stopped by a wall" : ""}. Click to place.`;
    };
    // "Within N sq.": the Point of Origin can be at most that far from the creature using the Action (a spot that is too far is shown in red).
    const tooFar = c => !!(within && user && c && placementDistance(user, c) > within);
    const limit = within && user ? emanationCells(tokenCells(user), within) : [];   // v0.0.249 (Lucas): the reach of the placement, outlined in gold like a Charge's
    const draw = () => {
      gfx.clear();
      showBar();
      if (limit.length) outlineCells(gfx, limit, { color: 0xf1c84b, width: 2 });
      if (!current) return;
      const far = tooFar(current);
      fillCells(gfx, current.cells, far ? 0xc0392b : COLOR, far ? 0.35 : 0.5);
      outlineCells(gfx, current.cells, { color: far ? 0xe74c3c : 0xf3c9ee });
      if (current.passed?.length) dashedCells(gfx, current.passed);
      if (isLine && current.line) { const t = current.line.target; line(gfx, current.point, cellCenter(t.y, t.x), 0xffffff, 1.5, 0.7); }
    };
    const move = ev => { lastPos = localPos(ev); current = compute(shape, n, lastPos, { user, side }); draw(); };
    const done = result => {
      bar?.remove();
      canvas.stage.off("pointermove", move); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", key_, true);
      canvas.tokens.interactiveChildren = prevInteractive;
      gfx.destroy();
      resolve(result);
    };
    const down = ev => {
      if (ev.button === 2) return done(null);
      if (ev.button !== 0) return;
      lastPos = localPos(ev); current = compute(shape, n, lastPos, { user, side });
      if (isLine && !current?.cells?.length) { ui.notifications.warn("Aim the Line at a square outside your space."); return; }
      if (tooFar(current)) { ui.notifications.warn(`Too far: the Point of Origin is ${placementDistance(user, current)} squares away, and the Action says within ${within}.`); draw(); return; }
      done(current);
    };
    const key_ = ev => {
      if (ev.key === "Escape") done(null);
      if (isLine && ev.key === "Tab") { ev.preventDefault(); ev.stopImmediatePropagation(); if (current?.hasTie) flip(); }   // before Foundry's own Tab
    };
    canvas.stage.on("pointermove", move);
    canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", key_, true);
    if (!isLine) ui.notifications.info(`${n} ${shape === "burst" ? "Burst" : "Emanation"}${within ? ` (within ${within} sq.)` : ""}: click to place, right-click or Esc to cancel.`);   // v0.0.246: the book's order (a 2 Emanation)
    else showBar();
  });
}

/** The token of the creature that used the Action on this card (or null). */
function cardToken(ctx) {
  if (ctx?.token) return ctx.token;                       // placed by an Action before its roll
  try { const a = fromUuidSync(ctx?.message?.getFlag?.("twod12", "action")?.actorUuid); return a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null; } catch (e) { return null; }
}

export async function startTemplate(cfg, ctx = {}) {
  if (!canvas.ready || !canvas.grid?.isSquare) return ui.notifications.warn("Templates need a scene with a square grid.");
  const shape = ["burst", "line"].includes(cfg.shape) ? cfg.shape : "emanation";
  const n = Number(cfg.distance) || 1;
  const user = cardToken(ctx) ?? canvas.tokens.controlled[0] ?? game.user.character?.getActiveTokens()[0] ?? null;
  // at:self: an Emanation centered on the user (a Self Action), no placing needed.
  let placed, preview = null;
  const dropPreview = () => { try { preview?.destroy(); } catch (e) { /* gone */ } preview = null; };
  let back0 = async () => {};
  if (cfg.at === "self") {
    if (!user) return ui.notifications.warn("Select your token first.");
    back0 = await stepAside();   // v0.0.251 (Lucas): the windows step aside while the area is shown, as when one is placed
    const base = tokenCells(user);
    placed = { cells: emanationCells(base, n), origin: user, baseCells: base, point: spaceCenter(user) };
    // Show it on the map before applying, so everyone sees what it covers.
    preview = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(preview);
    fillCells(preview, placed.cells, COLOR, 0.5);
    outlineCells(preview, placed.cells, { color: 0xf3c9ee });
  } else {
    const back = await stepAside();   // the sheets and dialogs get out of the way of the map, and come back after
    if (shape === "line" && !user) { await back(); return ui.notifications.warn("Select your token first: a Line starts from your square."); }
    try { placed = await place(shape, n, { within: shape === "line" ? 0 : Number(cfg.within) || 0, user }); } finally { await back(); }
  }
  if (!placed) return;
  // The target of an Emanation: the creature it is placed around (null for a square or a Burst).
  const center = placed.origin ?? null;
  const escT = x => String(x ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const sel = (v, cur) => `<option value="${v}" ${cur === v ? "selected" : ""}>${v[0].toUpperCase() + v.slice(1)}</option>`;
  const targetsDef = ["all", "allies", "enemies"].includes(cfg.targets) ? cfg.targets : "all";
  // Hazardous Terrain: what the area does, by default the Effects row of the Action that placed it (the GM can change it here).
  const htText = (() => { try { const f = ctx?.message?.getFlag?.("twod12", "action"), it = fromUuidSync(f?.actorUuid)?.items?.get?.(f?.itemId); return it?.system?.versions?.find(v => v.ap === f.ap)?.effects ?? ""; } catch (e) { return ""; } })();
  const htDef = cfg.ht ? parsePatterns(cfg.ht) : [];
  // quick:yes: the Action already says how the area works (its Area settings), so there is no dialog.
  const data = cfg.quick
    ? {
        targets: cfg.targets ?? "all",
        self: !!cfg.self,
        keep: !!cfg.places || (cfg.rounds ?? 0) > 0,
        rounds: cfg.rounds ?? 0,
        expire: cfg.expire ?? "",
        difficult: false,
        dfor: "all",
        dtypes: [],
        ht: htDef, httext: htText
      }
    : await DialogV2.prompt({
        window: { title: areaName(shape, n) },
        content: `<div class="form-group"><label>Targets</label><select name="targets">${["all", "allies", "enemies"].map(v => sel(v, targetsDef)).join("")}</select></div>
      ${center ? `<div class="form-group"><label>Affect ${escT(center.name)} (the creature it is around)?</label><input type="checkbox" name="self" ${cfg.self ? "checked" : ""}></div>` : ""}
      <div class="form-group"><label>Keep the area on the map?</label><input type="checkbox" name="keep" ${(cfg.places ?? cfg.keep) || cfg.rounds || cfg.expire === "eot" || cfg.difficult?.length ? "checked" : ""}></div>
      <div class="form-group"><label>Rounds (0 = until removed)</label><input type="number" name="rounds" value="${cfg.rounds ?? 0}" min="0"></div>
      <div class="form-group"><label>Expires</label><select name="expire"><option value="" ${cfg.expire === "eot" ? "" : "selected"}>After the rounds (end of the current turn)</option><option value="eot" ${cfg.expire === "eot" ? "selected" : ""}>End of the origin's turn</option></select></div>
      <div class="form-group"><label>Difficult terrain</label><input type="checkbox" name="difficult" ${cfg.difficult?.length ? "checked" : ""}></div>
      <div class="form-group"><label data-tooltip="Hazardous Terrain [HT]: what the area does to a creature that enters it, ends its turn in it, or moves within it. Entering and Turn: at most once per turn-cycle.">Hazardous Terrain</label><span>${Object.entries(HT_PATTERNS).map(([k, l]) => `<label class="inline"><input type="checkbox" name="ht" value="${k}" ${htDef.includes(k) ? "checked" : ""}> ${l}</label>`).join(" ")}</span></div>
      <div class="form-group"><label>It does</label><input type="text" name="httext" value="${escT(htText)}" placeholder="@Save[instinct|t1:1d8 Fi|t2:1d4 Fi|t3:0] or a note"></div>
      <div class="form-group"><label>Difficult for</label><select name="dfor">${["all", "allies", "enemies"].map(v => sel(v, ["all", "allies", "enemies"].includes(cfg.dfor) ? cfg.dfor : "all")).join("")}</select></div>
      <div class="form-group"><label>Movement</label><span>${Object.entries(MOVES)
        .map(
          ([k, l]) =>
            `<label class="inline"><input type="checkbox" name="dtypes" value="${k}" ${(cfg.difficult?.length ? cfg.difficult : ["walk"]).includes(k) ? "checked" : ""}> ${l}</label>`
        )
        .join(" ")}</span></div>`,
        ok: {
          label: "Place",
          callback: (ev, btn) => {
            const fd = new FormData(btn.form);
            return {
              targets: fd.get("targets"),
              self: fd.get("self") === "on",
              keep: fd.get("keep") === "on",
              rounds: Math.max(0, parseInt(fd.get("rounds")) || 0),
              expire: fd.get("expire"),
              difficult: fd.get("difficult") === "on",
              dfor: fd.get("dfor"),
              dtypes: fd.getAll("dtypes"),
              ht: fd.getAll("ht"), httext: String(fd.get("httext") ?? "")
            };
          }
        },
        rejectClose: false
      });
  if (!data) { dropPreview(); await back0(); return; }

  // The origin is the creature using the Action: allies and enemies are judged from its side.
  const origin = user ?? placed.origin ?? null;
  const od = origin?.document.disposition ?? 1;
  let tokens = tokensIn(placed.cells);
  if (data.targets === "allies") tokens = tokens.filter(t => t.document.disposition === od);
  if (data.targets === "enemies") tokens = tokens.filter(t => t.document.disposition !== 0 && t.document.disposition !== od);
  const centerTok = center && tokens.find(t => t.id === center.id);   // v0.0.215: the creature it is around, if it could be affected (asked below)
  if (!data.self && center) tokens = tokens.filter(t => t.id !== center.id);
  if (shape === "line") {
    // v0.0.214: a Line is 1 square high (a creature flying above its squares is not in it), and its creatures give no cover to each other.
    tokens = tokens.filter(t => t.id !== origin?.id && lineHeightOk(origin, t, Number(cfg.height) || 1));
    placed.noCover = [origin?.id, ...tokensIn(placed.cells).map(t => t.id)].filter(Boolean);
  }
  // Line of Effect from the Point of Origin to each creature: one it can't reach isn't affected. Its cover (from the Point of Origin) goes to the roll.
  const reach = areaReach(placed, tokens);
  tokens = reach.affected;
  const noLoE = reach.blocked.map(t => t.name);
  if (ctx?.outcome) { ctx.outcome.cover = reach.cover; ctx.outcome.blocked = noLoE; ctx.outcome.point = placed.point ?? null; }
  if (preview) {
    const actName = (() => { try { const f = ctx?.message?.getFlag?.("twod12", "action"); return fromUuidSync(f?.actorUuid)?.items?.get?.(f?.itemId)?.name ?? ""; } catch (e) { return ""; } })();
    const names = tokens.filter(t => t.id !== centerTok?.id).map(t => escT(t.name)).join(", ") || "nobody";
    // v0.0.215 (Lucas, playtest 2: Ground Slam): an Emanation around its user is only shown; this window asks whether the user is affected too, and confirms.
    // v0.0.251 (Lucas): the question is a bar at the bottom, in the system's style; "you too" follows the Action's Area setting (the item sheet: "Affect the creature it is around") and is a click away
    const { pickBar } = await import("./pickbar.mjs");
    const withMe = { id: "me", label: `Apply, ${escT(centerTok?.name ?? "you")} too` }, withoutMe = { id: "others", label: centerTok ? `Apply, not ${escT(centerTok.name)}` : "Apply" };
    const res = await pickBar({ icon: "fa-vector-square", aside: false, text: `<b>${escT(actName || "the area")}</b>: apply the area shown on the map? Targets: <b>${names}</b>.${noLoE.length ? ` No Line of Effect: ${noLoE.map(escT).join(", ")}.` : ""}`,
      options: centerTok ? (data.self ? [withMe, withoutMe] : [withoutMe, withMe]) : [withoutMe] });
    dropPreview();
    await back0();
    if (res == null) return;
    if (centerTok) tokens = res === "me" ? [...new Set([...tokens, centerTok])] : tokens.filter(t => t.id !== centerTok.id);
  }
  // Restart the targeting: release every current target, then target the tokens in the area.
  for (const t of [...game.user.targets]) t.setTarget(false, { releaseOthers: false, groupSelection: true });
  for (const t of tokens) t.setTarget(true, { releaseOthers: false, groupSelection: true });
  if (ctx?.outcome) { ctx.outcome.ok = true; ctx.outcome.count = tokens.length; ctx.outcome.point = placed.point ?? null; }   // the caller knows it was placed and applied
  // The Action's card lists the creatures in the area as its targets.
  if (tokens.length && ctx?.message?.getFlag?.("twod12", "action")) { try { const { retargetAction } = await import("./actions.mjs"); await retargetAction(ctx.message); } catch (e) { console.warn("twod12 | card targets", e); } }
  const timed = data.expire === "eot" || data.rounds > 0;
  const difficult = data.difficult && data.dtypes.length;
  const hazard = (data.ht ?? []).length > 0;
  const zone = cfg.zone ?? null;   // v0.0.261 (Consecrated Ground): the area is a Zone: its rules on the region, the creatures inside get them (zone.mjs)
  if (data.keep || timed || difficult || hazard || zone) {
    const comb = game.combat?.combatants.find(c => c.tokenId === origin?.id);
    const cur = game.combat?.combatant;
    const flags = { twod12: { template: true, ...(placed.line ? { line: placed.line } : {}) } };   // a Line keeps { origin, target, value, side }: lineCellsFromFlag rebuilds it
    if (hazard) {
      const actName = (() => { try { const f = ctx?.message?.getFlag?.("twod12", "action"); return fromUuidSync(f?.actorUuid)?.items?.get?.(f?.itemId)?.name ?? ""; } catch (e) { return ""; } })();
      flags.twod12.ht = { patterns: data.ht, text: data.httext ?? "", originUuid: origin?.actor?.uuid ?? "", name: actName || cfg.source || "", cells: placed.cells.map(key), hits: {}, appearHandled: !!cfg.htSave };   // a Save Action makes the creatures inside save itself
    }
    if (zone) flags.twod12.zone = { ...zone, ...(data.rounds > 0 && zone.ends ? { ends: { ...zone.ends, time: { on: true, mode: "rounds", rounds: data.rounds } } } : {}), cells: placed.cells.map(key), originUuid: origin?.actor?.uuid ?? "", originDisposition: Number(origin?.document?.disposition ?? 1) };   // v0.0.327: the rounds it was given
    // The area starts when it is placed (reactions included); see registerEffectHooks for the countdown.
    if (timed) Object.assign(flags.twod12, {
      duration: { type: data.expire === "eot" ? "eot" : "rounds", rounds: data.rounds, expire: data.expire === "eot" ? "eot" : "" },
      remaining: data.rounds, originCombatantId: comb?.id ?? "", anchorCombatantId: cur?.id ?? comb?.id ?? "",
      originSlot: comb?.initiative ?? null, anchorSlot: (cur ?? comb)?.initiative ?? null,
      appliedRound: game.combat?.round ?? null, appliedTurn: game.combat?.turn ?? null
    });
    const difficulties = Object.fromEntries(data.dtypes.map(a => [a, 2]));
    // v0.0.327 (PACK ZONE): a Zone's colors (its outline) and "Shown on the map" (off: only on the Regions layer; it still works)
    const zoneLook = zone && (zone.outline || zone.fill) ? { color: zone.outline || zone.fill } : {};
    const base = {
      ...zoneLook,
      name: zone ? `${zone.name}${timed && data.rounds ? ` (${data.rounds} round${data.rounds === 1 ? "" : "s"})` : ""}` : hazard && flags.twod12.ht.name ? `${flags.twod12.ht.name} [HT: ${patternText(data.ht)}]` : `${hazard ? "[HT] " : ""}${difficult ? "Difficult " : ""}${areaName(shape, n)}`, color: zone ? "#c9a227" : hazard ? "#c0502a" : difficult ? "#8a6a3a" : "#b05aa0",
      visibility: zone?.show === false ? (CONST.REGION_VISIBILITY?.LAYER ?? 0) : (CONST.REGION_VISIBILITY?.ALWAYS ?? 2), flags
    };
    const core = { type: "modifyMovementCost", name: "Difficult Terrain", system: { difficulties } };
    const custom = { type: "difficultTerrain", name: "Difficult Terrain", system: { difficulties, targets: data.dfor, originDisposition: od } };
    // Hazardous Terrain: its own behavior in the Region's Behaviors tab (what it does, its patterns, where it came from); without it, only the flags.
    const htB = hazard && CONFIG.RegionBehavior?.dataModels?.hazard ? [{ type: "hazard", name: "Hazardous Terrain", system: { patterns: data.ht, text: data.httext ?? "", source: flags.twod12.ht.name ?? "" } }] : [];
    const behaviorSets = (!difficult ? [[]] : data.dfor === "all" ? [[core]] : [[custom], [core]]).map(b => [...b, ...htB]);
    if (htB.length) behaviorSets.push(!difficult ? [] : data.dfor === "all" ? [core] : [core]);   // if the behavior can't be made, the area still works
    const tryCreate = async shapes => {
      let last;
      for (const [k, behaviors] of behaviorSets.entries()) {
        try {
          const [r] = await canvas.scene.createEmbeddedDocuments("Region", [{ ...base, shapes, behaviors }], { twod12Area: true });
          if (k > 0) ui.notifications.warn("The Allies/Enemies filter is not available: the terrain is difficult for everyone.");
          return r;
        } catch (e) { last = e; console.warn("twod12 | region creation failed", e); }
      }
      throw last;
    };
    try {
      // The area is made of grid squares, as the rules say (areas are drawn on the grid as squares): the cells that were placed.
      const made = await tryCreate(shapesForCells(placed.cells, cTL, size()));   // v0.0.178: one outline (a polygon), not a rectangle per row
      if (ctx?.outcome) ctx.outcome.region = made;
    } catch (e) { console.warn("twod12 | could not create the region", e); ui.notifications.warn("Could not keep the area on the map (permissions?)."); }
  }
  // v0.0.284 (Lucas: "it's sending 'targeting x, y, z' as plain text"): no chat line any more (the Action's card lists its targets); only what the map can't show is a notification
  if (noLoE.length) ui.notifications.info(`${areaName(shape, n)}: no Line of Effect to ${noLoE.join(", ")}.`);
  if (placed.cut) ui.notifications.info(`${areaName(shape, n)}: the Line is stopped by a wall (${placed.cells.length} square${placed.cells.length === 1 ? "" : "s"}).`);
}
