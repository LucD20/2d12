// Grid areas: Emanation (squares within N by the 1-2-1 diagonal rule, from the creature's squares)
// and Burst (squares whose centers are within N of a square center or a grid corner).
const { DialogV2 } = foundry.applications.api;
const COLOR = 0xb05aa0;
const MOVES = { walk: "Walk", fly: "Fly", swim: "Swim", climb: "Climb", crawl: "Crawl", burrow: "Burrow" };
const key = c => `${c.i},${c.j}`;
const size = () => canvas.grid.size;
import { HT_PATTERNS, parsePatterns, patternText } from "./hazard.mjs";
import { homePos } from "./lean.mjs";
import { tokenDistance } from "./light.mjs";
import { coverFromPoint } from "./cover.mjs";
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
  const opts = { ...(blockedFn ? { blockedFn } : {}), exclude: [placed?.origin?.id].filter(Boolean) };
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

const tokensAt = c => canvas.tokens.placeables.filter(t => tokenCells(t).some(x => x.i === c.i && x.j === c.j));
const tokensIn = cells => { const set = new Set(cells.map(key)); return canvas.tokens.placeables.filter(t => tokenCells(t).some(c => set.has(key(c)))); };

function compute(shape, n, pos) {
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
async function stepAside() {
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
    let current = null;
    // "Within N sq.": the Point of Origin can be at most that far from the creature using the Action (a spot that is too far is shown in red).
    const tooFar = c => !!(within && user && c && placementDistance(user, c) > within);
    const draw = () => {
      gfx.clear();
      if (!current) return;
      const far = tooFar(current);
      fillCells(gfx, current.cells, far ? 0xc0392b : COLOR, far ? 0.35 : 0.5);
      outlineCells(gfx, current.cells, { color: far ? 0xe74c3c : 0xf3c9ee });
    };
    const move = ev => { current = compute(shape, n, localPos(ev)); draw(); };
    const done = result => {
      canvas.stage.off("pointermove", move); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", key_);
      canvas.tokens.interactiveChildren = prevInteractive;
      gfx.destroy();
      resolve(result);
    };
    const down = ev => {
      if (ev.button === 2) return done(null);
      if (ev.button !== 0) return;
      current = compute(shape, n, localPos(ev));
      if (tooFar(current)) { ui.notifications.warn(`Too far: the Point of Origin is ${placementDistance(user, current)} squares away, and the Action says within ${within}.`); draw(); return; }
      done(current);
    };
    const key_ = ev => { if (ev.key === "Escape") done(null); };
    canvas.stage.on("pointermove", move);
    canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", key_);
    ui.notifications.info(`${shape === "burst" ? "Burst" : "Emanation"} ${n}${within ? ` (within ${within} sq.)` : ""}: click to place, right-click or Esc to cancel.`);
  });
}

/** The token of the creature that used the Action on this card (or null). */
function cardToken(ctx) {
  if (ctx?.token) return ctx.token;                       // placed by an Action before its roll
  try { const a = fromUuidSync(ctx?.message?.getFlag?.("twod12", "action")?.actorUuid); return a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null; } catch (e) { return null; }
}

export async function startTemplate(cfg, ctx = {}) {
  if (!canvas.ready || !canvas.grid?.isSquare) return ui.notifications.warn("Templates need a scene with a square grid.");
  const shape = cfg.shape === "burst" ? "burst" : "emanation";
  const n = Number(cfg.distance) || 1;
  const user = cardToken(ctx) ?? canvas.tokens.controlled[0] ?? game.user.character?.getActiveTokens()[0] ?? null;
  // at:self: an Emanation centered on the user (a Self Action), no placing needed.
  let placed, preview = null;
  const dropPreview = () => { try { preview?.destroy(); } catch (e) { /* gone */ } preview = null; };
  if (cfg.at === "self") {
    if (!user) return ui.notifications.warn("Select your token first.");
    const base = tokenCells(user);
    placed = { cells: emanationCells(base, n), origin: user, baseCells: base, point: spaceCenter(user) };
    // Show it on the map before applying, so everyone sees what it covers.
    preview = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(preview);
    fillCells(preview, placed.cells, COLOR, 0.5);
    outlineCells(preview, placed.cells, { color: 0xf3c9ee });
  } else {
    const back = await stepAside();   // the sheets and dialogs get out of the way of the map, and come back after
    try { placed = await place(shape, n, { within: Number(cfg.within) || 0, user }); } finally { await back(); }
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
        window: { title: `${shape === "burst" ? "Burst" : "Emanation"} ${n}` },
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
  if (!data) { dropPreview(); return; }

  // The origin is the creature using the Action: allies and enemies are judged from its side.
  const origin = user ?? placed.origin ?? null;
  const od = origin?.document.disposition ?? 1;
  let tokens = tokensIn(placed.cells);
  if (data.targets === "allies") tokens = tokens.filter(t => t.document.disposition === od);
  if (data.targets === "enemies") tokens = tokens.filter(t => t.document.disposition !== 0 && t.document.disposition !== od);
  if (!data.self && center) tokens = tokens.filter(t => t.id !== center.id);
  // Line of Effect from the Point of Origin to each creature: one it can't reach isn't affected. Its cover (from the Point of Origin) goes to the roll.
  const reach = areaReach(placed, tokens);
  tokens = reach.affected;
  const noLoE = reach.blocked.map(t => t.name);
  if (ctx?.outcome) { ctx.outcome.cover = reach.cover; ctx.outcome.blocked = noLoE; ctx.outcome.point = placed.point ?? null; }
  if (preview) {
    const actName = (() => { try { const f = ctx?.message?.getFlag?.("twod12", "action"); return fromUuidSync(f?.actorUuid)?.items?.get?.(f?.itemId)?.name ?? ""; } catch (e) { return ""; } })();
    const names = tokens.map(t => escT(t.name)).join(", ") || "nobody";
    const ok = await DialogV2.confirm({
      window: { title: actName || "Apply Area" },
      content: `<p>Apply ${escT(actName || "the area")}'s area (shown on the map)?</p><p>Targets: <b>${names}</b></p>${noLoE.length ? `<p>No Line of Effect from the Point of Origin: <b>${noLoE.map(escT).join(", ")}</b></p>` : ""}`,
      rejectClose: false
    });
    dropPreview();
    if (!ok) return;
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
  if (data.keep || timed || difficult || hazard) {
    const comb = game.combat?.combatants.find(c => c.tokenId === origin?.id);
    const cur = game.combat?.combatant;
    const flags = { twod12: { template: true } };
    if (hazard) {
      const actName = (() => { try { const f = ctx?.message?.getFlag?.("twod12", "action"); return fromUuidSync(f?.actorUuid)?.items?.get?.(f?.itemId)?.name ?? ""; } catch (e) { return ""; } })();
      flags.twod12.ht = { patterns: data.ht, text: data.httext ?? "", originUuid: origin?.actor?.uuid ?? "", name: actName || cfg.source || "", cells: placed.cells.map(key), hits: {}, appearHandled: !!cfg.htSave };   // a Save Action makes the creatures inside save itself
    }
    // The area starts when it is placed (reactions included); see registerEffectHooks for the countdown.
    if (timed) Object.assign(flags.twod12, {
      duration: { type: data.expire === "eot" ? "eot" : "rounds", rounds: data.rounds, expire: data.expire === "eot" ? "eot" : "" },
      remaining: data.rounds, originCombatantId: comb?.id ?? "", anchorCombatantId: cur?.id ?? comb?.id ?? "",
      originSlot: comb?.initiative ?? null, anchorSlot: (cur ?? comb)?.initiative ?? null,
      appliedRound: game.combat?.round ?? null, appliedTurn: game.combat?.turn ?? null
    });
    const difficulties = Object.fromEntries(data.dtypes.map(a => [a, 2]));
    const base = {
      name: hazard && flags.twod12.ht.name ? `${flags.twod12.ht.name} [HT: ${patternText(data.ht)}]` : `${hazard ? "[HT] " : ""}${difficult ? "Difficult " : ""}${shape === "burst" ? "Burst" : "Emanation"} ${n}`, color: hazard ? "#c0502a" : difficult ? "#8a6a3a" : "#b05aa0",
      visibility: CONST.REGION_VISIBILITY?.ALWAYS ?? 2, flags
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
  await ChatMessage.create({ content: `<div class="twod12 chat"><b>${shape === "burst" ? "Burst" : "Emanation"} ${n}</b>: ${tokens.length ? "targeting " + tokens.map(t => t.name).join(", ") : "no targets"}.${noLoE.length ? ` No Line of Effect: ${noLoE.join(", ")}.` : ""}</div>` });
}
