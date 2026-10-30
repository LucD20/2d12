import { homePos, leanOf } from "./lean.mjs";
import { tokenDistance, lightAt, seenLight, regionHasPoint, verticalSquares, withHeight } from "./light.mjs";
// Movement: AP tracking for the creature whose turn it is (split movement, free movement from @Move[walk]),
// and Pushed and Pulled with collision: @Move[pushed|distance:N] (@Move[pulled|distance:N]) lets the clicking player drag the target away from (toward) the origin.
import { esc } from "./roll.mjs";
import { tokenCells, fillCells, outlineCells, cellCenter, cellAt } from "./template.mjs";
import { TWOD12 } from "./config.mjs";
import { applyToActor } from "./damage.mjs";
import { getAP, setAP, combatantOf } from "./combat.mjs";
import { expireOnUse } from "./bonus.mjs";
import { evalExpr } from "./refs.mjs";
import { stepCorners, solidCorner, creatureIn, straightCells, chooseLine } from "./corners.mjs";
import { coverFromPoint } from "./cover.mjs";
import { hazardIn } from "./hazard.mjs";
import { steadinessOf } from "./defense.mjs";
const F = "twod12", SOCKET = "system.twod12";
const warn = m => ui.notifications.warn(m);
const refuse = m => { warn(m); return false; };   // a refusal that says no
const post = html => ChatMessage.create({ content: `<div class="twod12 chat apmsg">${html}</div>` });
const endBtn = c => `<button type="button" class="endmove" data-twod12="endMove" data-combatant="${c.id}"><i class="fa-solid fa-flag-checkered"></i> End movement</button>`;
const num = v => Number(v) || 0;

/* ------------------------------------------------------------------ */
/* Pure geometry (cell units)                                          */
/* ------------------------------------------------------------------ */
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
export const shiftKey = s => `${s.di},${s.dj}`;

const centerOfCells = cells => ({ y: cells.reduce((a, c) => a + c.i + 0.5, 0) / cells.length, x: cells.reduce((a, c) => a + c.j + 0.5, 0) / cells.length });

/** Steps (di, dj) that lead away from the origin: within coneDeg of the bearing origin -> target (at least the closest one). */
export function awayDirs(cells, originCells, coneDeg) {
  const o = centerOfCells(originCells), t = centerOfCells(cells);
  const vx = t.x - o.x, vy = t.y - o.y;
  if (Math.hypot(vx, vy) < 1e-6) return DIRS;
  const bearing = Math.atan2(vy, vx);
  const diff = ([a, b]) => { let d = Math.atan2(a, b) - bearing; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d); };
  const lim = (coneDeg * Math.PI) / 180 + 1e-6;
  const ok = DIRS.filter(d => diff(d) <= lim);
  return ok.length ? ok : [DIRS.reduce((a, b) => (diff(b) < diff(a) ? b : a))];
}

/**
 * Every shift (in squares) the pushed creature can end on: at most N steps (diagonals count 1), every step leading
 * away from the origin (inside the cone) and ending farther from it than the one before.
 * Returns Map key -> { di, dj, steps, parent }.
 */
export function pushShifts(cells, originCells, N, coneDeg = TWOD12.pushCone) {
  const o = centerOfCells(originCells), t = centerOfCells(cells);
  const dist = s => Math.hypot(t.x + s.dj - o.x, t.y + s.di - o.y);
  const dirs = awayDirs(cells, originCells, coneDeg);
  const out = new Map([["0,0", { di: 0, dj: 0, steps: 0, parent: null }]]);
  let layer = [out.get("0,0")];
  for (let step = 1; step <= N; step++) {
    const next = [];
    for (const cur of layer) {
      for (const [a, b] of dirs) {
        const s = { di: cur.di + a, dj: cur.dj + b }, k = shiftKey(s);
        if (out.has(k) || dist(s) <= dist(cur) + 1e-9) continue;
        const node = { ...s, steps: step, parent: shiftKey(cur) };
        out.set(k, node); next.push(node);
      }
    }
    layer = next;
  }
  out.dist = dist;
  return out;
}

/**
 * Pulled (v0.0.170, the book's figures): every shift the pulled creature can end on. The cone has its apex on the creature and points at the origin:
 * a square is inside it when the direction from the creature's starting square to it is LESS than 45 degrees from the line to the origin (the edge is out).
 * Each step (diagonals count 1) ends closer to the origin than the one before, never in the origin's space, and a creature next to the origin
 * stops there (it is not pulled any closer). Returns Map key -> { di, dj, steps, parent }, like pushShifts.
 */
export function pullShifts(cells, originCells, N) {
  const o = centerOfCells(originCells), t = centerOfCells(cells);
  const dist = s => Math.hypot(t.x + s.dj - o.x, t.y + s.di - o.y);
  const bearing = Math.atan2(o.y - t.y, o.x - t.x), lim = Math.PI / 4 - 1e-9;
  const inCone = s => { let d = Math.atan2(s.di, s.dj) - bearing; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d) < lim; };
  const oset = new Set(originCells.map(c => `${c.i},${c.j}`));
  const intoOrigin = s => cells.some(c => oset.has(`${c.i + s.di},${c.j + s.dj}`));
  const nextTo = s => cells.some(c => originCells.some(q => Math.max(Math.abs(c.i + s.di - q.i), Math.abs(c.j + s.dj - q.j)) <= 1));
  const out = new Map([["0,0", { di: 0, dj: 0, steps: 0, parent: null }]]);
  let layer = [out.get("0,0")];
  for (let step = 1; step <= N; step++) {
    const next = [];
    for (const cur of layer) {
      if (nextTo(cur)) continue;   // next to the origin: it can't be pulled any closer
      for (const [a, b] of DIRS) {
        const s = { di: cur.di + a, dj: cur.dj + b }, k = shiftKey(s);
        if (out.has(k) || intoOrigin(s) || !inCone(s) || dist(s) >= dist(cur) - 1e-9) continue;
        const node = { ...s, steps: step, parent: shiftKey(cur) };
        out.set(k, node); next.push(node);
      }
    }
    layer = next;
  }
  out.dist = s => -dist(s);   // pathTo checks that every step "goes on": for a pull, closer
  return out;
}

/** Pulled aimed at the origin's own space (the book allows it: Collision with the origin). The shift that puts the creature's space on the hovered square of the origin, when it is within N steps. */
export function pullIntoOrigin(cells, originCells, hovered, N) {
  if (!originCells.some(c => c.i === hovered.i && c.j === hovered.j)) return null;
  const tl = { i: Math.min(...cells.map(c => c.i)), j: Math.min(...cells.map(c => c.j)) };
  const di = hovered.i - tl.i, dj = hovered.j - tl.j, steps = Math.max(Math.abs(di), Math.abs(dj));
  return steps && steps <= N ? { di, dj, steps, parent: null, intoOrigin: true } : null;
}

/** Every shift a Reposition N can use: any square inside an N Emanation of the creature that is also within the origin's Reach (and not the origin's own square). */
export function repositionShifts(cells, originCells, N, reach = 1) {
  const out = new Map([["0,0", { di: 0, dj: 0, steps: 0, parent: null }]]);
  for (let di = -N; di <= N; di++) for (let dj = -N; dj <= N; dj++) {
    if (!di && !dj) continue;
    if (cells.some(c => originCells.some(o => o.i === c.i + di && o.j === c.j + dj))) continue;
    const near = originCells.some(o => cells.some(c => Math.max(Math.abs(c.i + di - o.i), Math.abs(c.j + dj - o.j)) <= reach));
    if (near) out.set(`${di},${dj}`, { di, dj, steps: Math.max(Math.abs(di), Math.abs(dj)), parent: null });
  }
  return out;
}

/** The straight line (one square per step) from the creature's square to the shift. Reposition moves along this line. */
export function lineShifts(node) {
  const n = node.steps || 1;
  return Array.from({ length: n + 1 }, (_, k) => ({ di: Math.round((node.di * k) / n) || 0, dj: Math.round((node.dj * k) / n) || 0 }));
}

/** The straight line to the square when it is a valid push path, otherwise the first shortest path found. */
export function pathTo(map, key) {
  const node = map.get(key);
  if (!node) return [];
  const n = node.steps;
  const line = [];
  for (let k = 0; k <= n; k++) line.push({ di: Math.round((node.di * k) / n || 0), dj: Math.round((node.dj * k) / n || 0) });
  const ok = line.every((s, k) => map.has(shiftKey(s)) && (k === 0 || (map.dist ? map.dist(s) > map.dist(line[k - 1]) : true)));
  if (ok) return line.map(s => map.get(shiftKey(s)));
  const path = [];
  for (let k = key; k; k = map.get(k)?.parent) path.unshift(map.get(k));
  return path;
}

/**
 * Walk the path: stops before the first wall, solid corner or creature. Returns { done, block, final, unused }.
 * cornerAt(a, b) (optional): { kind: "" | "solid" | "creatures", creatures } for a diagonal step; a solid corner is an object (a wall),
 * a diagonal between two creatures is a Collision with a creature (unless throughCreatures: kept for abilities that let a movement pass creatures;
 * since v0.0.173 Reposition doesn't, it stops there without damage).
 * loeAt(shift) (optional, Slid and Reposition, v0.0.174): false when the origin would lose Line of Effect to the creature there: the movement ends
 * before that square, and that is not a Collision (no damage). damageless: a Reposition never deals Collision damage.
 */
export function analyzePath(path, N, { wallBetween, creatureAt, cornerAt = null, throughCreatures = false, loeAt = null, damageless = false }) {
  let done = 0, block = null;
  for (let n = 1; n < path.length; n++) {
    const a = path[n - 1], b = path[n];
    if (wallBetween(a, b)) { block = { type: "wall" }; break; }
    const corner = cornerAt ? cornerAt(a, b) : null;
    if (corner?.kind === "solid") { block = { type: "wall", corner: true }; break; }
    if (corner?.kind === "creatures" && !throughCreatures) { block = { type: "creature", token: corner.creatures[0], corner: true }; break; }
    const t = creatureAt(b);
    if (t) { block = { type: "creature", token: t }; break; }
    if (loeAt && !loeAt(b)) { block = { type: "loe" }; break; }
    done = n;
  }
  const unused = block ? N - done : 0;
  const k = TWOD12.collision;
  const damage = !block || damageless || block.type === "loe" ? { self: 0, other: 0 } : (block.type === "wall" ? { self: unused * k.wall, other: 0 } : { self: unused * k.creature, other: unused * k.creature });
  return { done, block, final: path[done], unused, damage };
}

/**
 * The path tool (Slid and Reposition, v0.0.174): can the next square (a shift) be added to the path? It must be next to the last square
 * (diagonals count 1), not a square the path already has, and within the value. Returns "" or why not.
 */
export function pathStepProblem(path, next, N) {
  const last = path[path.length - 1];
  if (Math.max(Math.abs(next.di - last.di), Math.abs(next.dj - last.dj)) !== 1) return "each square must be next to the previous one";
  if (path.some(s => s.di === next.di && s.dj === next.dj)) return "the path already passes there";
  if (path.length - 1 >= N) return `the value is ${N}: the path is full`;
  return "";
}

/**
 * Immobilized (book, Conditions): an Action that doesn't roll can't move an Immobilized creature; one that rolls needs a result of at least the
 * Immobilized DC; a Save Action has the origin roll 2d12 + its Modifier once (saveTotal). Returns { moved, why }.
 */
export function immobilizedOutcome({ rolls = false, total = null, save = false, saveTotal = null, dc = 13 } = {}) {
  if (save) return Number.isFinite(saveTotal) && saveTotal >= dc ? { moved: true, why: `the origin's roll ${saveTotal} beats the Immobilized DC ${dc}` } : { moved: false, why: `the origin's roll ${saveTotal ?? "?"} is below the Immobilized DC ${dc}` };
  if (!rolls || !Number.isFinite(total)) return { moved: false, why: "it is Immobilized, and this movement doesn't come from a roll" };
  return total >= dc ? { moved: true, why: `the roll ${total} beats the Immobilized DC ${dc}` } : { moved: false, why: `the roll ${total} is below the Immobilized DC ${dc}` };
}

/** The Immobilized DC of a creature: the highest stored on its Immobilized conditions (11 + the Modifier its origin used), 13 when none says. */
export function immobilizedDc(actor) {
  const dcs = (actor?.effects ?? []).filter(e => e.statuses?.has?.("immobilized")).map(e => Number(e.getFlag?.(F, "immobileDc") ?? e.flags?.[F]?.immobileDc)).filter(Number.isFinite);
  return dcs.length ? Math.max(...dcs) : TWOD12.baseDC;
}

/* ------------------------------------------------------------------ */
/* Movement tracking                                                   */
/* ------------------------------------------------------------------ */
/** Charge a move of `cost` squares: free movement first, then Walk allotments (1 AP each, they can be split). */
export async function chargeMovement(c, cost, dest = null) {
  const walk = num(c.actor?.system?.moveSpeed ?? c.actor?.system?.speed);
  let evade = num(c.getFlag(F, "evadeMove")), free = num(c.getFlag(F, "freeMove")), left = num(c.getFlag(F, "moveLeft"));
  let need = cost;
  // v0.0.182: an Evade goes on square by square (its area stays shown) until the creature uses another Action or ends the movement:
  // it can't be split around other Actions (spendAP in combat.mjs clears what is left), but one Evade can take several drags.
  const useEvade = Math.min(evade, need); need -= useEvade; evade -= useEvade;
  const useFree = Math.min(free, need); free -= useFree; need -= useFree;
  let spent = 0;
  if (need > 0) {
    if (walk <= 0) warn(`${c.name} has no Speed.`);
    else { while (need > left + 1e-9) { left += walk; spent++; } left -= need; }
  }
  await c.update({ [`flags.${F}.evadeMove`]: evade, [`flags.${F}.freeMove`]: free, [`flags.${F}.moveLeft`]: Math.round(left * 100) / 100, ...(useEvade > 0 && evade <= 0 ? { [`flags.${F}.-=ignoreTerrain`]: null } : {}) });
  clearRange();
  // "Until it uses a Move Action": the effect lasts through this move and ends once it is resolved (an Evade is not a Move Action).
  if (!useEvade) await expireOnUse(c.actor, new Set(["move"])).catch(() => {});
  if (free + evade > 0 && dest) showRange(c, free + evade, dest);
  const ap = getAP(c);
  const sq = Math.round(cost * 100) / 100;
  const what = useEvade ? `Evade ${sq} sq, no reactions` : `Advance ${sq} sq`;
  if (spent) await setAP(c, Math.max(0, ap - spent), what);
  else await post(`<b>${esc(c.name)}</b>: ${what}${left > 0 ? `, ${Math.round(left * 100) / 100} sq of Speed left` : ""}${free + evade > 0 ? `. ${free + evade} sq left ${endBtn(c)}` : ""}`);
  if (spent && ap < spent) warn(`${c.name} did not have enough AP for that movement.`);
}

/** The distance of a @Move button: a number, or an expression such as walk/2 (rounded up). */
export function moveDistance(cfg, actor) {
  const raw = cfg.distanceExpr ? evalExpr(cfg.distanceExpr, actor) : (num(cfg.distance) || 1);
  // When you move with an Action you can't move more than your current Speed, unless an ability says otherwise (a tag with |uncapped:yes). Forced Movement doesn't use your Speed.
  if (cfg.uncapped || !raw || !["advance", "evade", "charge"].includes(cfg.kind)) return raw;
  const speed = evalExpr("speed", actor);
  return Number.isFinite(speed) ? Math.min(raw, Math.max(0, speed)) : raw;
}

/**
 * Who moves when a free Advance, Evade or Charge button is clicked:
 *  - a Self Action (or a button with |traits:self): the selected token, otherwise the creature that used the Action;
 *  - any other Action: the target of the Action (a selected token that is a target comes first), otherwise the selected token.
 */
export function moverToken(ctx, cfg = {}) {
  const f = ctx?.message?.getFlag("twod12", "action");
  const targets = (f?.targets ?? []).map(t => { try { return fromUuidSync(t.uuid)?.object; } catch (e) { return null; } }).filter(Boolean);
  const selected = canvas.tokens.controlled.filter(t => t.actor?.isOwner);
  // The button inherits the Self trait of its Action (or has it written: |traits:self).
  const self = (cfg.traits ?? []).includes("self") || !!f?.self;
  // Self: the creature that used the Action (the selected token). Otherwise: the target of the Action (the ally of a Lay On Hands).
  if (self) return ctx?.token ?? (selected.length === 1 ? selected[0] : tokenOf(contextActor(ctx)));
  // Advance, Evade and Charge are made willingly: an enemy target never moves because of an Action used on it (that is Forced Movement), so the creature that used the Action moves, or an ally that is a target (a buff).
  if (["advance", "evade", "charge"].includes(cfg.kind)) {
    const user = ctx?.token ?? tokenOf(contextActor(ctx)) ?? (selected.length === 1 ? selected[0] : null);   // the creature that used the Action
    const allies = targets.filter(t => user && t.id !== user.id && t.document?.disposition === user.document?.disposition && t.document?.disposition !== 0);
    return allies.find(t => selected.some(x => x.id === t.id)) ?? (allies.length === 1 ? allies[0] : user);
  }
  const pickedTarget = selected.find(s => targets.some(t => t.id === s.id));
  if (pickedTarget) return pickedTarget;
  if (targets.length === 1) return targets[0];
  if (selected.length === 1) return selected[0];
  return tokenOf(contextActor(ctx));
}

/* ------------------------------------------------------------------ Difficult Terrain in Foundry's own movement cost (the ruler shows 2 for it) */
/** True when Foundry's own movement cost counts what this system adds (Darkness, unwilling creatures' squares): then the ruler and the measured cost already include it. */
export let rulerCountsDifficult = false;

/** The squares to add to what Foundry measured. foundryCounted: its cost is more than the distance (regions of Difficult Terrain). If its cost function is ours, it has counted everything. */
export function extraCost(way, foundryCounted, countsAll = rulerCountsDifficult) {
  if (countsAll) return 0;                                    // our cost function is in Foundry's: it counted everything (the diagonals between two creatures too, v0.0.171)
  if (foundryCounted) return way.cornerDT ?? 0;               // Foundry's own regions were counted, not the diagonals between two creatures
  return (way.extra ?? 0) + (way.cornerDT ?? 0);
}

const squareOf = o => ({ i: Math.round(o?.i ?? 0), j: Math.round(o?.j ?? 0) });

/**
 * A step into a square that is Difficult Terrain for the token (Darkness its Sight can't see in, or an unwilling creature's square) costs double.
 * Difficult Terrain does not stack: a square that already costs double stays at double.
 */
function hardStep(doc, to, step, cost, from = null) {
  try {
    if (!doc?.actor || !to) return cost;
    if (ignoresTerrain(doc)) return Number.isFinite(step) && step > 0 ? step : cost;   // (Cut Through) the terrain costs nothing extra
    const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1)), at = squareOf(to);
    const cells = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) cells.push({ i: at.i + di, j: at.j + dj });
    const senses = doc.actor.system?.senses ?? {};
    let hard = cells.some(c => seenLight(lightAt(canvas.grid.getCenterPoint(c)), senses) === "dark");
    if (!hard) {
      const others = (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc.id && t.actor && !t.document?.hidden && (t.document.disposition ?? 0) !== (doc.disposition ?? 0));
      hard = others.some(t => tokenCells(t).some(c => cells.some(m => m.i === c.i && m.j === c.j)));
    }
    // v0.0.171: a diagonal between two creatures is Difficult Terrain too, so the movement label shows it while dragging.
    if (!hard && from) hard = stepCorners(squareOf(from), at, { w, h, creatureAt: c => unwillingIn(c, doc) }).kind === "creatures";
    if (!hard) return cost;
    return Number.isFinite(step) && step > 0 ? Math.max(cost, 2 * step) : cost * 2;
  } catch (e) { return cost; }
}

/**
 * A cost function of Foundry takes one of two shapes: (from, to, distance, segment) for a path, or (baseCost, from, to, distance, segment) for a movement action,
 * where baseCost is what the terrain already cost. Either way this adds this system's Difficult Terrain to what it returns.
 */
const hardCost = (base, doc) => (...a) => {
  const action = typeof a[0] === "number", from = a[action ? 1 : 0], to = a[action ? 2 : 1], step = a[action ? 3 : 2];
  const cost = typeof base === "function" ? base(...a) : (action ? a[0] : step);
  return hardStep(doc, to, step, cost, from);
};
const wrapCost = (orig, docOf) => function (...args) {
  const base = orig.apply(this, args);
  return typeof base === "function" ? hardCost(base, docOf(this, args)) : base;
};
const COST_METHOD = /cost.*function$/i, HINTS = /cost|terrain|difficult|measure|waypoint|label|ruler/i;
const protoNames = (start, re) => {
  const out = new Set();
  for (let p = start; p && p !== Object.prototype; p = Object.getPrototypeOf(p))
    for (const n of Object.getOwnPropertyNames(p)) if (re.test(n) && typeof Object.getOwnPropertyDescriptor(p, n)?.value === "function") out.add(n);
  return [...out];
};

/**
 * Put a cost function on an action. Foundry may have locked the setting (read-only, or a sealed object), so this tries, in order: plain assignment, defining the property,
 * a copy of the action in its place, a copy of the actions in their place, and a copy of the movement settings in their place. Returns how it worked, or "".
 */
function adoptCostFunction(name, wrapped) {
  const token = CONFIG.Token, took = () => token?.movement?.actions?.[name]?.getCostFunction === wrapped;
  const cfg = token?.movement?.actions?.[name];
  try { cfg.getCostFunction = wrapped; if (took()) return "assigned"; } catch (e) { /* locked */ }
  try { Object.defineProperty(cfg, "getCostFunction", { value: wrapped, writable: true, configurable: true, enumerable: true }); if (took()) return "defined"; } catch (e) { /* locked */ }
  const copy = { ...cfg, getCostFunction: wrapped };
  try { token.movement.actions[name] = copy; if (took()) return "replaced the action"; } catch (e) { /* locked */ }
  try { token.movement.actions = { ...token.movement.actions, [name]: copy }; if (took()) return "replaced the actions"; } catch (e) { /* locked */ }
  try { token.movement = { ...token.movement, actions: { ...token.movement.actions, [name]: copy } }; if (took()) return "replaced the movement settings"; } catch (e) { /* locked */ }
  return "";
}

/**
 * Make Difficult Terrain of this system part of the movement cost that Foundry measures, so its ruler shows 2 for a dark square or an enemy's square.
 * Two places are tried: the cost function of each movement action (CONFIG.Token.movement.actions.*.getCostFunction), and Token or TokenDocument methods whose name ends in "CostFunction".
 * If Foundry has neither, or they are locked, nothing changes (the cost is added when the move is made). Returns { installed, how, failed, candidates, hints }.
 */
export function installDarknessCost() {
  const installed = [], how = {}, failed = {}, candidates = [], hints = {};
  try {
    const actions = CONFIG?.Token?.movement?.actions ?? {};
    for (const name of Object.keys(actions)) {
      try {
        const cfg = CONFIG.Token.movement.actions[name];
        if (!cfg || typeof cfg !== "object" || cfg.teleport) continue;   // a teleport has no path to be hard
        const label = `actions.${name}.getCostFunction`, had = typeof cfg.getCostFunction === "function";
        if (had) candidates.push(label);
        if (cfg.getCostFunction?.twod12Hard) { installed.push(label); how[label] = "already"; continue; }
        const orig = had ? cfg.getCostFunction : null;
        const wrapped = function (token, options) {   // an action without a cost function gets one that only adds the Difficult Terrain
          const base = orig ? orig.call(this ?? cfg, token, options) : null;
          return hardCost(typeof base === "function" ? base : null, token?.document ?? token);
        };
        wrapped.twod12Hard = true;
        const result = adoptCostFunction(name, wrapped);
        if (result) { installed.push(label); how[label] = result; } else failed[label] = "the setting is locked in every way tried";
      } catch (e) { failed[`actions.${name}`] = String(e?.message ?? e); }
    }
    for (const [label, proto, docOf] of [["TokenDocument", CONFIG?.Token?.documentClass?.prototype, self => self], ["Token", CONFIG?.Token?.objectClass?.prototype, self => self?.document]]) {
      if (!proto) continue;
      for (const n of protoNames(proto, COST_METHOD)) {
        candidates.push(`${label}#${n}`);
        const orig = proto[n];
        if (orig.twod12Hard) { installed.push(`${label}#${n}`); continue; }
        try { const wrapped = wrapCost(orig, docOf); wrapped.twod12Hard = true; proto[n] = wrapped; installed.push(`${label}#${n}`); how[`${label}#${n}`] = "assigned"; } catch (e) { failed[`${label}#${n}`] = String(e?.message ?? e); }
      }
    }
  } catch (e) { console.warn("twod12 | Difficult Terrain cost", e); }
  if (!installed.length) {   // what is there to look at, for the developer
    try {
      hints.movementKeys = Object.keys(CONFIG?.Token?.movement ?? {});
      hints.actionKeys = Object.keys(CONFIG?.Token?.movement?.actions?.walk ?? {});
      hints.walkFrozen = Object.isFrozen(CONFIG?.Token?.movement?.actions?.walk ?? {});
      hints.actionsFrozen = Object.isFrozen(CONFIG?.Token?.movement?.actions ?? {});
      hints.movementFrozen = Object.isFrozen(CONFIG?.Token?.movement ?? {});
      hints.TokenDocument = protoNames(CONFIG?.Token?.documentClass?.prototype, HINTS);
      hints.Token = protoNames(CONFIG?.Token?.objectClass?.prototype, HINTS);
      hints.TokenRuler = protoNames(CONFIG?.Token?.rulerClass?.prototype, HINTS);
      hints.rulerClass = CONFIG?.Token?.rulerClass?.name ?? null;
    } catch (e) { hints.error = String(e?.message ?? e); }
  }
  rulerCountsDifficult = installed.length > 0;
  return { installed, how, failed, candidates, hints };
}

/** What the Difficult Terrain cost found in this Foundry (for the console). */
export function rulerInfo() {
  const info = { countsDifficult: rulerCountsDifficult, ...installDarknessCost() };
  console.log("twod12 | ruler " + JSON.stringify(info));
  ui.notifications.info(
    info.installed.length
      ? `Difficult Terrain is part of Foundry's movement cost (${info.installed.map(n => `${n}: ${info.how[n]}`).join("; ")}): the ruler counts it.`
      : "Foundry's movement cost function was not found, so the ruler does not count Darkness or enemies' squares (the cost is added when the move is made). Copy the console line that starts with \"twod12 | ruler\" and send it to the developer."
  );
  return info;
}

/** A creature whose free movement ignores terrain (Cut Through's Evade): it may move through creatures (not end in one) and Difficult Terrain costs nothing extra. */
const ignoresTerrain = doc => { try { const c = game.combat?.started ? game.combat.combatants.find(x => x.tokenId === doc?.id) : null; return !!c?.getFlag(F, "ignoreTerrain"); } catch (e) { return false; } };

/**
 * Solid corners for a creature's own movement (Advance, Evade, Charge) are a world setting, off by default (v0.0.171): Foundry's own movement already
 * refuses those diagonals, so the check only matters with Unrestricted movement. Forced Movement and Reposition always check them (Foundry doesn't).
 */
export const ownCorners = () => { try { return !!game.settings.get(F, "ownMoveCorners"); } catch (e) { return false; } };
const ownSolid = () => (ownCorners() ? solidCorner : () => false);

/**
 * The creature in a square that is unwilling for this mover (another disposition), or null (v0.0.173, Lucas: a diagonal between two creatures is
 * Difficult Terrain only when both are unwilling; a willing creature letting you pass is left to the players).
 */
const unwillingIn = (cell, doc) => { const t = creatureIn(cell, [doc.id]); return t && (t.document?.disposition ?? 0) !== (doc.disposition ?? 0) ? t : null; };

/** The system setting that lets the movement buttons work when there is no combat. */
export const movesOutsideCombat = () => { try { return !!game.settings.get(F, "moveOutsideCombat"); } catch (e) { return false; } };

let looseId = null;   // the token whose movement area (outside combat) is on the canvas
/** Outside combat: show the area the token can reach. Nothing is tracked or charged; the area goes away when the token moves, or with the Clear button. */
async function looseMove(token, n, kind, cfg) {
  const sq = `${n} square${n === 1 ? "" : "s"}`;
  const what = kind === "evade" ? `Evade up to ${sq}: no reactions, and not into or through Difficult Terrain`
    : kind === "charge" ? `Charge in a straight line, at least ${cfg.min || 3} and up to ${sq}, not through Difficult Terrain` : `Advance up to ${sq}`;
  showRange({ token: { object: token } }, n);
  looseId = token.document?.id ?? token.id;
  await post(`<b>${esc(token.name)}</b> can ${what}. Outside combat the movement is not tracked. <button type="button" class="endmove" data-twod12="clearMove"><i class="fa-solid fa-eraser"></i> Clear</button>`);
}

/** Take the movement area off the canvas. */
export function clearLooseMove() { clearRange(); looseId = null; }

async function grantFreeMove(cfg, ctx, kind = "walk") {
  const token = moverToken(ctx, cfg);
  const actor = token?.actor ?? contextActor(ctx), combat = game.combat;
  const c = token ? (combat?.combatants.find(x => x.tokenId === token.id) ?? combatantOf(actor, combat)) : combatantOf(actor, combat);
  const inCombat = !!c && !!combat?.started;
  if (!inCombat && !movesOutsideCombat()) return refuse(`${token?.name ?? actor?.name ?? "That creature"} is not in a combat that has started, so its free movement can't be tracked. (The GM can allow it outside combat in the system settings.)`);
  if (!inCombat && !token) return refuse("Select a token to show where it can move.");
  if (actor?.statuses?.has?.("immobilized")) return refuse(`${actor.name} is Immobilized and can't move.`);
  if (kind === "evade" && actor?.statuses?.has?.("prone")) return refuse(`${actor.name} is Prone and can't Evade.`);
  const n = moveDistance(cfg, actor);
  if (!n && moveDistance({ ...cfg, uncapped: true }, actor) > 0) return refuse(`${actor.name} has Speed 0 and can't move.`);   // the distance is fine, but the cap (your Speed) leaves nothing
  if (!n) return refuse(`Could not work out the distance "${cfg.distanceExpr}".`);
  if (!inCombat) { await looseMove(token, n, kind, cfg); return true; }
  const key = kind === "evade" ? "evadeMove" : "freeMove";
  await c.setFlag(F, key, num(c.getFlag(F, key)) + n);
  if (cfg.ignoreTerrain) await c.setFlag(F, "ignoreTerrain", true);
  if (kind === "charge") await c.setFlag(F, "charge", { min: cfg.min || 3, max: n });
  const sq = `${n} square${n === 1 ? "" : "s"}`;
  if (kind === "charge") {
    await post(`<b>${esc(c.name)}</b> can Charge: move in a straight line at least ${cfg.min || 3} and up to ${sq}, not through Difficult Terrain. ${endBtn(c)}`);
    showRange(c, n);
    return true;
  }
  await post(
    kind === "evade"
      ? `<b>${esc(c.name)}</b> can Evade up to ${sq} (in one or more drags, until another Action): no reactions are triggered, and ${cfg.ignoreTerrain ? "it can move through the space of any creature (it can't end in one) and ignores Difficult Terrain" : "it can't enter or pass through Difficult Terrain"}. ${endBtn(c)} <button type="button" class="endmove" data-twod12="evadeAdvance" data-combatant="${c.id}"><i class="fa-solid fa-person-running"></i> Advance instead</button>`
      : `<b>${esc(c.name)}</b> can Advance up to ${sq} without spending AP. ${endBtn(c)}`
  );
  showRange(c, n);
  return true;   // granted: the area is on the map
}

/** The Evade becomes an Advance: it can then be used on a move that does trigger reactions (or by a creature that can not Evade). */
export async function evadeAsAdvance(combatantId) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c?.isOwner) return warn("Only the owner can change this movement.");
  const n = num(c.getFlag(F, "evadeMove"));
  if (!n) return warn("There is no Evade movement left.");
  await c.update({ [`flags.${F}.evadeMove`]: 0, [`flags.${F}.freeMove`]: num(c.getFlag(F, "freeMove")) + n, [`flags.${F}.-=ignoreTerrain`]: null });
  await post(`<b>${esc(c.name)}</b> uses the movement as an Advance of up to ${n} square${n === 1 ? "" : "s"} instead of an Evade.`);
  showRange(c, n);
}

/** The creature is done moving: the free squares it did not use are dropped. */
export async function endMovement(combatantId) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c) return warn("That combatant is no longer in the combat.");
  if (!c.isOwner) return warn("Only the owner can end this movement.");
  const left = num(c.getFlag(F, "freeMove")) + num(c.getFlag(F, "evadeMove"));
  const charging = !!c.getFlag(F, "charge");
  await c.update({ [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, [`flags.${F}.-=charge`]: null, [`flags.${F}.-=ignoreTerrain`]: null });
  clearRange();
  // Giving up a Charge before its movement means its required Weapon Attack (1A) never happens: the Charge is disrupted.
  if (charging) return post(`<b>${esc(c.name)}</b> gives up the Charge: it is disrupted, and the AP stays spent.`);
  await post(left > 0 ? `<b>${esc(c.name)}</b> ends the movement. ${left} free square${left === 1 ? "" : "s"} unused.` : `<b>${esc(c.name)}</b> has no free movement left.`);
}

/* ------------------------------------------------------------------ */
/* Pushed                                                              */
/* ------------------------------------------------------------------ */
function contextActor(ctx) {
  if (ctx?.actor) return ctx.actor;   // the creature that is using an Action (its Setup)
  const f = ctx?.message?.getFlag(F, "action");
  try { const a = f?.actorUuid ? fromUuidSync(f.actorUuid) : null; if (a) return a; } catch (e) { /* not loaded */ }
  return canvas.tokens.controlled[0]?.actor ?? game.user.character ?? null;
}
const tokenOf = actor => actor?.token?.object ?? actor?.getActiveTokens?.()[0] ?? null;

function targetTokens(ctx) {
  const f = ctx?.message?.getFlag(F, "action");
  const fromCard = (f?.targets ?? []).map(t => { try { return fromUuidSync(t.uuid)?.object; } catch (e) { return null; } }).filter(Boolean);
  return fromCard.length ? fromCard : [...game.user.targets];
}

function wallBetween(a, b) {
  try {
    const back = CONFIG.Canvas?.polygonBackends?.move;
    if (back?.testCollision) return !!back.testCollision(a, b, { type: "move", mode: "any" });
  } catch (e) { /* fall through */ }
  try { return !!canvas.walls.checkCollision(new foundry.canvas.geometry.Ray(a, b), { type: "move", mode: "any" }); } catch (e) { return false; }
}

function gfxLine(g, pts, color, width, alpha = 1) {
  if (pts.length < 2) return;
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); }
  else { g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); g.stroke({ width, color, alpha }); }
}

const MOVE_LABEL = { push: "Pushed", pull: "Pulled", slid: "Slid", reposition: "Reposition" };

/**
 * Drag the target to a square: only the squares the movement allows (Pushed: away from the origin; Pulled: toward it, or the origin's own square
 * for a Collision; Reposition: the old square in an Emanation) within N steps. Resolves to { path, result } or null.
 */
function choosePush(origin, target, N, mode = "push") {
  const repo = mode === "reposition", pull = mode === "pull";
  return new Promise(resolve => {
    const cells = tokenCells(target), tl = { i: Math.min(...cells.map(c => c.i)), j: Math.min(...cells.map(c => c.j)) };
    const oCells = tokenCells(origin);
    const map = repo ? repositionShifts(cells, oCells, N, origin.actor?.system?.reach ?? 1) : pull ? pullShifts(cells, oCells, N) : pushShifts(cells, oCells, N);
    // The origin is a creature in the way of a Pulled aimed at its own square (both take damage); a Pushed moves away from it.
    const others = canvas.tokens.placeables.filter(t => t.id !== target.id && (repo || pull || t.id !== origin.id));
    const occupied = others.map(t => ({ t, set: new Set(tokenCells(t).map(c => `${c.i},${c.j}`)) }));
    const pt = sh => {
      const pts = cells.map(c => cellCenter(c.i + sh.di, c.j + sh.dj));
      return { x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length };
    };
    const covered = [...new Map([...map.values()].flatMap(n => cells.map(c => ({ i: c.i + n.di, j: c.j + n.dj }))).map(c => [`${c.i},${c.j}`, c])).values()];
    const creatureAt = sh => occupied.find(o => cells.some(c => o.set.has(`${c.i + sh.di},${c.j + sh.dj}`)))?.t ?? null;
    // The whole creature must fit: every square it occupies is tested against walls (a Forced Movement never squeezes), and against the corners it cuts.
    const wallsOn = (a, b) => cells.some(c => wallBetween(cellCenter(c.i + a.di, c.j + a.dj), cellCenter(c.i + b.di, c.j + b.dj)));
    const w = Math.max(1, Math.round(target.document.width ?? 1)), h = Math.max(1, Math.round(target.document.height ?? 1));
    const cornerAt = (a, b) => stepCorners({ i: tl.i + a.di, j: tl.j + a.dj }, { i: tl.i + b.di, j: tl.j + b.dj }, { w, h, solidAt: solidCorner, creatureAt: c => creatureIn(c, [target]) });
    const gfx = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(gfx);
    const tip = document.createElement("div");
    tip.className = "twod12-pushtip"; tip.style.display = "none"; document.body.append(tip);
    const prevInteractive = canvas.tokens.interactiveChildren;
    canvas.tokens.interactiveChildren = false;
    let current = null;
    const draw = () => {
      gfx.clear();
      fillCells(gfx, covered, 0xffffff, 0.22);
      outlineCells(gfx, covered, { color: 0xffffff, width: 3 });
      if (pull) fillCells(gfx, oCells, 0xdd3333, 0.18);   // aiming at the origin's own square: a Collision
      if (!current) return;
      const pts = current.path.map(s => pt(s)), good = pts.slice(0, current.result.done + 1);
      gfxLine(gfx, good, 0x44cc77, 5, 0.95);
      if (current.result.block) {
        const bad = pts.slice(current.result.done, current.result.done + 2);
        gfxLine(gfx, bad, 0xdd3333, 5, 0.95);
        const e = bad[bad.length - 1], r = canvas.grid.size * 0.18;
        gfxLine(gfx, [{ x: e.x - r, y: e.y - r }, { x: e.x + r, y: e.y + r }], 0xdd3333, 6);
        gfxLine(gfx, [{ x: e.x - r, y: e.y + r }, { x: e.x + r, y: e.y - r }], 0xdd3333, 6);
      }
    };
    const text = r => {
      if (repo) return r.block ? `${r.block.type === "wall" ? (r.block.corner ? "A solid corner" : "A wall") : r.block.token.name} is in the way: stops after ${r.done} square${r.done === 1 ? "" : "s"}` : `Reposition ${r.done} square${r.done === 1 ? "" : "s"}`;
      const steps = `${r.done} of ${r.done + r.unused} squares aimed (maximum ${N})`;
      if (!r.block) return `${MOVE_LABEL[mode]} ${r.done} (${steps})`;
      const d = r.damage;
      return r.block.type === "wall"
        ? `${r.block.corner ? "Solid corner" : "Wall"}: ${r.unused} unused, ${d.self} Body damage (${steps})`
        : `${r.block.token.name}${r.block.corner ? " (between two creatures)" : ""}: ${r.unused} unused, ${d.self} Body to each (${steps})`;
    };
    const hover = ev => {
      const p = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage);
      const o = canvas.grid.getOffset(p), key = shiftKey({ di: o.i - tl.i, dj: o.j - tl.j });
      const node = map.get(key) ?? (pull ? pullIntoOrigin(cells, oCells, { i: o.i, j: o.j }, N) : null);
      if (!node || !node.steps) { current = null; tip.style.display = "none"; return draw(); }
      const path = repo || node.intoOrigin ? lineShifts(node) : pathTo(map, key);
      const result = analyzePath(path, path.length - 1, { wallBetween: wallsOn, creatureAt, cornerAt });
      current = { path, result };
      tip.textContent = text(result); tip.style.display = "block";
      const n = ev.nativeEvent ?? ev.data?.originalEvent;
      if (n) { tip.style.left = `${n.clientX + 14}px`; tip.style.top = `${n.clientY + 14}px`; }
      draw();
    };
    const done = v => {
      canvas.stage.off("pointermove", hover); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", esc_);
      canvas.tokens.interactiveChildren = prevInteractive;
      gfx.destroy(); tip.remove();
      resolve(v);
    };
    const down = ev => {
      if (ev.button === 2) return done(null);
      if (ev.button !== 0) return;
      hover(ev);
      if (current) done(current);
    };
    const esc_ = ev => { if (ev.key === "Escape") done(null); };
    canvas.stage.on("pointermove", hover); canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", esc_);
    ui.notifications.info(`${MOVE_LABEL[mode]} ${N}: move the pointer to choose where ${target.name} ends${pull ? ` (or ${origin.name}'s own square: Collision)` : ""}. Click to confirm, right-click or Esc to cancel.`);
    draw();
  });
}

/** Line of Effect from the origin (any square it occupies) to the target's space moved by a shift (book: any corner of the space, unblocked). */
function loeTo(origin, target, sh) {
  try {
    const s = canvas.grid.size, d = target.document, h = homePos(d);
    const ghost = { id: target.id, actor: null, document: { x: h.x + sh.dj * s, y: h.y + sh.di * s, width: d.width, height: d.height, flags: {} } };
    const others = [];   // creatures don't block Line of Effect
    return tokenCells(origin).some(c => !coverFromPoint(cellCenter(c.i, c.j), ghost, { others })?.noLoE);
  } catch (e) { console.warn("twod12 | Line of Effect on the path", e); return true; }
}

/**
 * The path tool (Slid and Reposition, v0.0.174): click the squares of the path one by one (each next to the previous one; diagonals count 1).
 * Click the last square again, or press Enter, to move; right-click takes back the last square (or cancels with none); Esc cancels.
 * Slid: a wall, a solid corner, a creature or the origin on the path is a Collision there. Reposition: it stops before them, with no damage,
 * can't enter Hazardous Terrain, and (Relocate: withinReach) the target must stay within the origin's Reach. Both: if the origin would lose
 * Line of Effect, the movement ends before that square (no damage). Resolves to { path, result } or null.
 */
function choosePath(origin, target, N, mode = "slid", { withinReach = false } = {}) {
  const repo = mode === "reposition";
  return new Promise(resolve => {
    const cells = tokenCells(target), tl = { i: Math.min(...cells.map(c => c.i)), j: Math.min(...cells.map(c => c.j)) };
    const oCells = tokenCells(origin), reach = Math.max(1, num(origin.actor?.system?.reach) || 1);
    const w = Math.max(1, Math.round(target.document.width ?? 1)), h = Math.max(1, Math.round(target.document.height ?? 1));
    const occupied = canvas.tokens.placeables.filter(t => t.id !== target.id && t.actor && !t.document?.hidden).map(t => ({ t, set: new Set(tokenCells(t).map(c => `${c.i},${c.j}`)) }));
    const foot = sh => cells.map(c => ({ i: c.i + sh.di, j: c.j + sh.dj }));
    const creatureAt = sh => occupied.find(o => foot(sh).some(c => o.set.has(`${c.i},${c.j}`)))?.t ?? null;
    const wallsOn = (a, b) => cells.some(c => wallBetween(cellCenter(c.i + a.di, c.j + a.dj), cellCenter(c.i + b.di, c.j + b.dj)));
    const cornerAt = (a, b) => stepCorners({ i: tl.i + a.di, j: tl.j + a.dj }, { i: tl.i + b.di, j: tl.j + b.dj }, { w, h, solidAt: solidCorner, creatureAt: c => creatureIn(c, [target]) });
    const loeAt = sh => loeTo(origin, target, sh);
    const inReach = sh => foot(sh).some(c => oCells.some(o => Math.max(Math.abs(c.i - o.i), Math.abs(c.j - o.j)) <= reach));
    const path = [{ di: 0, dj: 0 }];
    let hover = null;
    const analyze = p => analyzePath(p, p.length - 1, { wallBetween: wallsOn, creatureAt, cornerAt, loeAt, damageless: repo });
    const why = sh => {
      const p = pathStepProblem(path, sh, N);
      if (p) return p;
      if (repo && hazardIn(foot(sh))) return "a Reposition can't move a creature into Hazardous Terrain";
      if (withinReach && !inReach(sh)) return `the target must remain within ${origin.name}'s Reach (${reach})`;
      return "";
    };
    const gfx = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(gfx);
    const tip = document.createElement("div");
    tip.className = "twod12-pushtip"; tip.style.display = "none"; document.body.append(tip);
    const prevInteractive = canvas.tokens.interactiveChildren;
    canvas.tokens.interactiveChildren = false;
    const pt = sh => { const ps = foot(sh).map(c => cellCenter(c.i, c.j)); return { x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length }; };
    const text = r => {
      const steps = `${path.length - 1} of ${N}`;
      if (!r.block) return `${MOVE_LABEL[mode]} ${r.done} (path ${steps}). Click the last square again or press Enter to move; right-click takes a square back.`;
      if (r.block.type === "loe") return `${origin.name} loses Line of Effect: it stops after ${r.done} (no damage).`;
      const what = r.block.type === "wall" ? (r.block.corner ? "A solid corner" : "A wall") : r.block.token.name;
      return repo ? `${what} is in the way: it stops after ${r.done} (no damage).` : `${what}: Collision after ${r.done}, ${r.unused} unused, ${r.damage.self} Body${r.block.type === "creature" ? " to each" : ""}.`;
    };
    // v0.0.175: the squares the path can still reach (like the area Pushed and Pulled show): within the steps left from the last square,
    // not into Hazardous Terrain (Reposition), and within the origin's Reach (Relocate).
    const reachable = () => {
      const last = path[path.length - 1], left = N - (path.length - 1), out = [];
      for (let di = -left; di <= left; di++) for (let dj = -left; dj <= left; dj++) {
        const sh = { di: last.di + di, dj: last.dj + dj };
        if ((!di && !dj) || path.some(p => p.di === sh.di && p.dj === sh.dj)) continue;
        if ((repo && hazardIn(foot(sh))) || (withinReach && !inReach(sh))) continue;
        out.push(...foot(sh));
      }
      return [...new Map(out.map(c => [`${c.i},${c.j}`, c])).values()];
    };
    const draw = () => {
      gfx.clear();
      const r = analyze(path), area = reachable();
      if (area.length) { fillCells(gfx, area, 0xffffff, 0.22); outlineCells(gfx, area, { color: 0xffffff, width: 3 }); }
      fillCells(gfx, path.slice(1).flatMap(foot), 0x66ccff, 0.25);
      const pts = path.map(pt);
      gfxLine(gfx, pts.slice(0, r.done + 1), 0x44cc77, 5, 0.95);
      if (r.block) gfxLine(gfx, pts.slice(r.done, r.done + 2), 0xdd3333, 5, 0.95);
      if (hover) { const bad = why(hover); fillCells(gfx, foot(hover), bad ? 0xdd3333 : 0xffffff, bad ? 0.25 : 0.35); }
      return r;
    };
    const posOf = ev => { const p = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage); const o = canvas.grid.getOffset(p); return { di: o.i - tl.i, dj: o.j - tl.j }; };
    const showTip = (ev, msg) => { tip.textContent = msg; tip.style.display = "block"; const n = ev?.nativeEvent ?? ev?.data?.originalEvent; if (n) { tip.style.left = `${n.clientX + 14}px`; tip.style.top = `${n.clientY + 14}px`; } };
    const move = ev => { hover = posOf(ev); const r = draw(); const bad = why(hover), last = path[path.length - 1]; showTip(ev, hover.di === last.di && hover.dj === last.dj && path.length > 1 ? text(r) : (bad ? `Not here: ${bad}.` : text(analyze([...path, hover])))); };
    const finish = v => {
      canvas.stage.off("pointermove", move); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", keys);
      canvas.tokens.interactiveChildren = prevInteractive;
      gfx.destroy(); tip.remove();
      resolve(v);
    };
    const confirm = () => (path.length > 1 ? finish({ path: [...path], result: analyze(path) }) : finish(null));
    const down = ev => {
      if (ev.button === 2) { if (path.length > 1) { path.pop(); draw(); } else finish(null); return; }
      if (ev.button !== 0) return;
      const sh = posOf(ev), last = path[path.length - 1];
      if (sh.di === last.di && sh.dj === last.dj) return confirm();
      const bad = why(sh);
      if (bad) return warn(`${MOVE_LABEL[mode]}: ${bad}.`);
      path.push(sh); move(ev);
    };
    const keys = ev => { if (ev.key === "Escape") finish(null); else if (ev.key === "Enter") confirm(); };
    canvas.stage.on("pointermove", move); canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", keys);
    ui.notifications.info(`${MOVE_LABEL[mode]} ${N}: click the squares of ${target.name}'s path one by one, then click the last one again (or Enter). Right-click takes a square back; Esc cancels.`);
    draw();
  });
}

/**
 * v0.0.175: move a token along a path in ONE movement, square after square (a path of shifts from where it stands; the first is { di: 0, dj: 0 }).
 * v0.0.174 sent one update per square without waiting for the animation, so the steps ran over each other. Foundry 13+ has TokenDocument#move
 * with waypoints (one animation along them); older Foundry gets the steps one at a time, each waiting for the last one's animation.
 */
export function pathWaypoints(home, path, size) {
  return path.slice(1).map(s => ({ x: home.x + s.dj * size, y: home.y + s.di * size }));
}
async function moveAlong(doc, path) {
  const size = canvas.grid.size, home = homePos(doc), points = pathWaypoints(home, path, size);
  if (!points.length) return;
  if (!doc.isOwner) { game.socket.emit(SOCKET, { type: "pushPath", tokenUuid: doc.uuid, points }); return; }
  await moveThrough(doc, points);
}
async function moveThrough(doc, points) {
  const opts = { twod12Forced: true, animate: true, animation: { movementSpeed: TWOD12.pushSpeed } };
  if (typeof doc.move === "function") {
    try { await doc.move(points.map(p => ({ ...p, snapped: true, explicit: true })), { ...opts, method: "api", constrainOptions: { ignoreWalls: true, ignoreCost: true } }); return; }
    catch (e) { console.warn("twod12 | TokenDocument#move failed, moving square by square", e); }
  }
  for (const p of points) {
    await doc.update({ x: p.x, y: p.y }, opts);
    try { await doc.object?.movementAnimationPromise; } catch (e) { /* no animation to wait for */ }
  }
}

async function moveToken(doc, dx, dy) {
  const size = canvas.grid.size, x = doc.x + dx * size, y = doc.y + dy * size;
  if (doc.isOwner) await doc.update({ x, y }, { twod12Forced: true, animate: true, animation: { movementSpeed: TWOD12.pushSpeed, easing: "easeOutCubic" } });
  else game.socket.emit(SOCKET, { type: "pushMove", tokenUuid: doc.uuid, x, y });
}

const bodyDamage = n => ({ B: { l: n, n: 0 }, M: { l: 0, n: 0 } });

/**
 * Steadiness (v0.0.169): the value of a Forced Movement or Reposition is reduced by the target's Steadiness. A creature can choose not to apply it
 * (a willing creature: the dialog asks when the target has Steadiness). Returns { N: the value to use, steady, applied }.
 */
/** The value of a Forced Movement or Reposition against a creature with this Steadiness (never below 0; a negative Steadiness counts as 0). */
export const reducedValue = (N, steady) => Math.max(0, num(N) - Math.max(0, num(steady)));

async function applySteadiness(target, N, label) {
  const st = steadinessOf(target.actor), steady = st.total;   // v0.0.174: with the bonuses of Features, Talents and effects
  if (!steady) return { N, steady: 0, applied: false };
  const eff = reducedValue(N, steady);
  const from = st.parts.length ? ` (${st.base} + ${st.parts.map(p => `${p.name} ${p.bonus >= 0 ? "+" : "\u2212"}${Math.abs(p.bonus)}`).join(", ")})` : "";
  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Steadiness" }, rejectClose: false,
    content: `<p><b>${esc(target.name)}</b> has Steadiness ${steady}${esc(from)}: ${label} ${N} becomes ${label} ${eff}.</p><p>A willing creature can choose not to apply its Steadiness.</p>`,
    buttons: [{ action: "apply", label: `Apply Steadiness (${label} ${eff})`, default: true }, { action: "ignore", label: `Don't apply it (${label} ${N})` }]
  });
  return choice === "ignore" ? { N, steady, applied: false } : { N: eff, steady, applied: true };
}

async function pushOne(origin, target, N0, mode = "push", opts = {}) {
  const label = MOVE_LABEL[mode];
  const st = await applySteadiness(target, N0, label), N = st.N;
  if (N <= 0) { await post(`<b>${esc(target.name)}</b> is not moved: its Steadiness ${st.steady} reduces ${label} ${N0} to 0.`); return; }
  const pathTool = mode === "slid" || mode === "reposition";
  const pick = pathTool ? await choosePath(origin, target, N, mode, opts) : await choosePush(origin, target, N, mode);
  if (!pick) return;
  const { result } = pick, f = result.final;
  if (pathTool) await moveAlong(target.document, pick.path.slice(0, result.done + 1));   // one movement along the path (v0.0.175)
  else if (f.di || f.dj) await moveToken(target.document, f.dj, f.di);
  const lines = [`<b>${esc(target.name)}</b> is ${mode === "reposition" ? "Repositioned" : label} ${N0}${st.applied ? ` (Steadiness ${st.steady}: ${N})` : ""} by <b>${esc(origin.name)}</b> and moves ${result.done} square${result.done === 1 ? "" : "s"}.`];
  if (result.block?.type === "loe") lines.push(`It stops: <b>${esc(origin.name)}</b> would lose Line of Effect to it (no damage).`);
  else if (result.block && mode === "reposition") lines.push(`It stops short: ${result.block.type === "wall" ? (result.block.corner ? "a solid corner" : "a wall") : `<b>${esc(result.block.token.name)}</b>`} is in the way.`);
  else if (result.block) {
    const d = result.damage;
    if (result.block.type === "wall") {
      lines.push(`It hits ${result.block.corner ? "a solid corner" : "a wall"} with ${result.unused} unused: <b>${d.self} Body</b> damage.`);
      if (target.actor && d.self) await applyToActor(target.actor, bodyDamage(d.self));
    } else {
      const o = result.block.token;
      lines.push(`It hits <b>${esc(o.name)}</b>${result.block.corner ? " (it can't pass diagonally between two creatures)" : ""} with ${result.unused} unused: both take <b>${d.self} Body</b> damage.`);
      if (target.actor && d.self) await applyToActor(target.actor, bodyDamage(d.self));
      if (o.actor && d.other) await applyToActor(o.actor, bodyDamage(d.other));
    }
  }
  await ChatMessage.create({ content: `<div class="twod12 chat apmsg">${lines.join(" ")}</div>` });
}

async function pushFlow(cfg, ctx, mode = "push") {
  if (!canvas.ready || !canvas.grid?.isSquare) return warn(`${MOVE_LABEL[mode]} needs a scene with a square grid.`);
  const actor0 = contextActor(ctx);
  const N = Math.max(1, moveDistance(cfg, actor0) ?? 0);
  const actor = actor0, origin = tokenOf(actor) ?? canvas.tokens.controlled[0];
  if (!origin) return warn(`Select the token that is the origin of the ${MOVE_LABEL[mode]}.`);
  const targets = targetTokens(ctx).filter(t => t.id !== origin.id);
  if (!targets.length) return warn("Target the creature to move first.");
  // Immobilized (v0.0.174): checked before Steadiness. The card says whether the Action rolled (its result, per target) or is a Save Action
  // (then the origin rolls 2d12 + its Modifier once, for every Immobilized creature it would move).
  const f = ctx?.message?.getFlag?.(F, "action") ?? null;
  let saveTotal = null;
  for (const t of targets) {
    if (t.actor?.statuses?.has?.("immobilized")) {
      const dc = immobilizedDc(t.actor), save = !!f?.traits?.includes?.("save");
      if (save && saveTotal === null) {
        const roll = await new Roll(`2d12 + ${num(f.attrVal)}`).evaluate();
        await roll.toMessage({ flavor: `${esc(origin.name)}: ${MOVE_LABEL[mode]} against an Immobilized creature (the Save Action's Modifier)` });
        saveTotal = roll.total;
      }
      const res = f?.results?.find?.(r => r.uuid === (t.document?.uuid ?? t.uuid));
      const out = immobilizedOutcome({ rolls: !!f && (Number.isFinite(f.total) || Number.isFinite(res?.total)), total: res?.total ?? f?.total, save, saveTotal, dc });
      if (!out.moved) { await post(`<b>${esc(t.name)}</b> is Immobilized and isn't moved: ${out.why}.`); continue; }
      await post(`<b>${esc(t.name)}</b> is Immobilized, but ${out.why}: it can be moved.`);
    }
    await pushOne(origin, t, N, mode, { withinReach: !!cfg.withinReach });
  }
}

/** Entry point of the @Move button. */
export async function handleMove(cfg, ctx = {}) {
  if (cfg.kind === "pushed") return pushFlow(cfg, ctx);
  if (cfg.kind === "pulled") return pushFlow(cfg, ctx, "pull");
  if (cfg.kind === "slid") return pushFlow(cfg, ctx, "slid");
  if (cfg.kind === "reposition") return pushFlow(cfg, ctx, "reposition");
  return grantFreeMove(cfg, ctx, cfg.kind === "evade" ? "evade" : (cfg.kind === "charge" ? "charge" : "walk"));
}

/* Movement tracking: charge the creature whose turn it is when its token moves. Two routes so one of them always works. */
const handled = new Map();
const keyOf = (doc, x, y) => `${doc.id}|${Math.round(x)}|${Math.round(y)}`;
const seen = k => { const t = handled.get(k); return t && Date.now() - t < 3000; };
const mark = k => { handled.set(k, Date.now()); if (handled.size > 50) for (const [kk, t] of handled) if (Date.now() - t > 3000) handled.delete(kk); };
const currentCombatantFor = doc => { const c = game.combat?.started ? game.combat.combatant : null; return c && c.tokenId === doc.id ? c : null; };
const gridUnit = () => canvas.grid?.distance || canvas.scene?.grid?.distance || 1;

/** The straight line of a Charge: from the center of the start square to the center of the end square. */
/** Creatures on another side within a creature's Reach (by its token), for the Weapon Attack (1A) after a Charge. */
export function creaturesInReach(token, reach = 1) {
  const doc = token?.document ?? token;
  return (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc?.id && t.actor && !t.document?.hidden
    && (t.document.disposition ?? 0) !== (doc?.disposition ?? 0) && tokenDistance(token, t) <= reach);
}

/** After a Charge's movement: if no creature is within Reach, its required Weapon Attack (1A) can't be made, so the Charge is disrupted. */
function chargeFollowUp(c, doc, reach) {
  const token = doc.object ?? canvas.tokens?.get?.(doc.id);
  if (!token || creaturesInReach(token, reach).length) return;
  post(`<b>${esc(c.name)}</b>'s Charge is disrupted: no creature within Reach for its Weapon Attack (1A). The AP stays spent.`).catch(() => {});
}

/** Squares of a path between two cells (Bresenham). The rules' straight line (Charge) is straightCells in corners.mjs, with its ties. */
function cellLine(a, b) {
  const out = [];
  let x = a.j, y = a.i;
  const dx = Math.abs(b.j - x), dy = -Math.abs(b.i - y), sx = x < b.j ? 1 : -1, sy = y < b.i ? 1 : -1;
  let err = dx + dy;
  for (let guard = 0; guard < 1000; guard++) {
    out.push({ i: y, j: x });
    if (x === b.j && y === b.i) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
  return out;
}

/**
 * Creatures in the way of a move along token positions (top-left x, y), following the rules for movement:
 * squares of an unwilling creature (any creature on another side) are Difficult Terrain, and no move can end
 * inside another creature's space. Returns { through: [names], endIn: name, extra: squares of extra cost }.
 * Corners (v0.0.170): solidCorner is true when a diagonal step cuts a solid corner (the move is refused), and cornerDT counts the diagonal steps
 * between two creatures (Difficult Terrain: 1 extra square each).
 */
export function creaturesOnPath(doc, points, { ignoring = false } = {}) {
  const out = { through: [], endIn: "", extra: 0, dark: 0, solidCorner: false, cornerDT: 0 };
  try {
    const pts = points.filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y));
    if (pts.length < 2) return out;
    const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
    const foot = c => { const s = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) s.push(`${c.i + di},${c.j + dj}`); return s; };
    const cellOf = p => cellAt({ x: p.x + 2, y: p.y + 2 });
    const start = new Set(foot(cellOf(pts[0]))), end = new Set(foot(cellOf(pts.at(-1))));
    const passed = new Set();
    for (let k = 0; k < pts.length - 1; k++) {
      const line = cellLine(cellOf(pts[k]), cellOf(pts[k + 1]));
      for (const c of line) for (const key of foot(c)) if (!start.has(key) && !end.has(key)) passed.add(key);
      for (let n = 1; n < line.length; n++) {
        const st = stepCorners(line[n - 1], line[n], { w, h, solidAt: ownSolid(), creatureAt: c => unwillingIn(c, doc) });
        if (st.kind === "solid") out.solidCorner = true;
        else if (st.kind === "creatures" && !ignoring) out.cornerDT++;
      }
    }
    const others = (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc.id && t.actor && !t.document?.hidden);
    const occ = others.map(t => ({ t, cells: new Set(tokenCells(t).map(c => `${c.i},${c.j}`)) }));
    const endT = occ.find(o => [...end].some(k => o.cells.has(k)));
    if (endT) out.endIn = endT.t.name;
    const enemyCells = new Set();
    for (const o of occ) {
      if ((o.t.document.disposition ?? 0) === (doc.disposition ?? 0)) continue;   // the same side: willing, no extra cost
      let hit = false;
      for (const k of passed) if (o.cells.has(k)) { enemyCells.add(k); hit = true; }
      if (hit) out.through.push(o.t.name);
    }
    // Darkness: the squares it enters (the one it ends in too) that its Sight sees as Darkness are Difficult Terrain for it (Dark Sight sees them as Bright).
    const senses = doc.actor?.system?.senses ?? {}, darkCells = new Set();
    try {
      for (const key of new Set([...passed, ...[...end].filter(k => !start.has(k))])) {   // the squares it enters: not the ones it starts in
        const [i, j] = key.split(",").map(Number);
        if (seenLight(lightAt(canvas.grid.getCenterPoint({ i, j })), senses) === "dark") darkCells.add(key);
      }
    } catch (e) { darkCells.clear(); console.warn("twod12 | darkness on the path", e); }
    out.dark = Math.ceil(darkCells.size / Math.min(w, h));
    out.extra = Math.ceil(new Set([...enemyCells, ...darkCells]).size / Math.min(w, h));   // a square that is both is Difficult Terrain once
  } catch (e) { console.warn("twod12 | creatures on the path", e); }
  return out;
}

/**
 * The squares of a Charge's straight line (book: "Straight Line"): from the center of the start square to the center of the end square, one square a step.
 * At a tie (the line passes exactly between two squares) the creature that moves chooses: the square its own drag passed through (via), else a legal one.
 * Returns { cells, ties }.
 */
export function chargeLine(doc, from, to, via = []) {
  const cellOf = p => cellAt({ x: p.x + 2, y: p.y + 2 });
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
  const raw = straightCells(cellOf(from), cellOf(to));
  const prefer = new Set();
  for (let k = 0; k < via.length + 1; k++) { const a = k ? via[k - 1] : from, b = via[k] ?? to; for (const c of cellLine(cellOf(a), cellOf(b))) prefer.add(`${c.i},${c.j}`); }
  const legal = (prev, c) => !chargeSquareProblem(doc, prev, c, w, h);
  return { cells: chooseLine(raw, { prefer, legal }), ties: raw.filter(c => c.alt).length };
}

/** Why the Charge can't go from square a into square b (the top-left squares of its space): "" when it can. */
function chargeSquareProblem(doc, a, b, w = 1, h = 1) {
  const foot = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) foot.push({ i: b.i + di, j: b.j + dj });
  const other = foot.map(c => creatureIn(c, [doc.id])).find(t => t && (t.document.disposition ?? 0) !== (doc.disposition ?? 0));
  if (other) return `the straight line passes through ${other.name} (an unwilling creature's space is Difficult Terrain)`;
  const corner = a ? stepCorners(a, b, { w, h, solidAt: ownSolid(), creatureAt: c => unwillingIn(c, doc) }) : { kind: "" };
  if (corner.kind === "solid") return "the straight line cuts a solid corner";
  if (corner.kind === "creatures") return `the straight line passes diagonally between ${corner.creatures.map(t => t.name).join(" and ")} (Difficult Terrain)`;
  try { if (foot.some(c => seenLight(lightAt(cellCenter(c.i, c.j)), doc.actor?.system?.senses ?? {}) === "dark")) return "the straight line crosses Darkness, which is Difficult Terrain for a creature that can't see in it"; } catch (e) { /* no light to read */ }
  return "";
}

function chargeProblem(doc, from, to, ch, via = []) {
  const size = canvas.grid.size, half = { x: (doc.width * size) / 2, y: (doc.height * size) / 2 };
  const a = { x: from.x + half.x, y: from.y + half.y }, b = { x: to.x + half.x, y: to.y + half.y };
  const sq = measureSquares(from, to);
  if (sq + 1e-6 < ch.min) return `a Charge moves at least ${ch.min} squares in a straight line`;
  if (sq > ch.max + 1e-6) return `a Charge moves up to ${ch.max} squares`;
  if (wallBetween(a, b)) return "a wall is in the way of the straight line";
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
  const { cells } = chargeLine(doc, from, to, via);
  for (let n = 1; n < cells.length; n++) {
    const problem = chargeSquareProblem(doc, cells[n - 1], cells[n], w, h);
    if (problem) return problem;
  }
  try {
    // Difficult Terrain anywhere along the line stops the Charge.
    const regions = (canvas.regions?.placeables ?? []).filter(r => r.document.behaviors?.some(x => x.type === "difficultTerrain" && !x.disabled));
    const steps = Math.max(8, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (size / 4)));
    for (let i = 0; i <= steps; i++) {
      const p = { x: a.x + ((b.x - a.x) * i) / steps, y: a.y + ((b.y - a.y) * i) / steps };
      if (regions.some(r => regionHasPoint(r.document, p, doc.elevation ?? 0))) return "the straight line crosses Difficult Terrain";
    }
  } catch (e) { console.warn("twod12 | could not test the Charge line against Difficult Terrain", e); }
  return "";
}

/** Squares of movement between two points (grid units divided by the scene's distance per square). */
function measureSquares(from, to) {
  try {
    const r = canvas.grid.measurePath([{ x: from.x, y: from.y }, { x: to.x, y: to.y }]);
    return num(r.cost || r.distance) / gridUnit();
  } catch (e) { return 0; }
}

export function registerMovement() {
  try { installDarknessCost(); } catch (e) { console.warn("twod12 | Darkness cost", e); }   // (this runs when Foundry is ready: the Token class is final)
  // The movement area never outlives its use: it goes when the combat ends, when the scene changes, and (outside combat) when its token moves.
  Hooks.on("deleteCombat", () => clearLooseMove());
  Hooks.on("canvasReady", () => clearLooseMove());
  Hooks.on("updateToken", (doc, changes, options) => { if (!options?.twod12Lean && looseId && doc.id === looseId && ("x" in changes || "y" in changes)) clearLooseMove(); });
  Hooks.on("preMoveToken", (doc, movement, operation) => {
    try {
      if (operation?.twod12Forced || operation?.twod12Lean || movement?.method === "undo") return;
      const c = currentCombatantFor(doc);
      if (!c) return;
      const ignoring = !!c.getFlag(F, "ignoreTerrain");   // Cut Through: through creatures, and terrain costs nothing extra
      const to = movement?.destination ?? { x: doc.x, y: doc.y };
      const origin = leanOf(doc) ? homePos(doc) : (movement?.origin ?? { x: doc.x, y: doc.y });   // a Leaning token is nudged: it moves from its own square
      let squares = num(movement?.pending?.cost) || num(movement?.pending?.distance);
      if (ignoring && num(movement?.pending?.distance)) squares = num(movement.pending.distance);
      squares = squares ? squares / gridUnit() : measureSquares(origin, to);
      if (squares <= 0) return;
      // Creatures in the way: no move ends inside another creature's space, and an unwilling creature's squares are Difficult Terrain.
      const via = (movement?.pending?.waypoints ?? []).slice(0, -1);
      const way = creaturesOnPath(doc, [origin, ...(movement?.pending?.waypoints ?? []), to], { ignoring });
      if (way.endIn) { warn(`You can't end your movement in ${way.endIn}'s space.`); return false; }
      const ch = c.getFlag(F, "charge");
      // Corners: no movement cuts a solid corner (a Charge is judged by its straight line, below).
      if (!ch && way.solidCorner) { warn("You can't cut a solid corner (a wall, a pillar or an object reaches the corner point): go around it."); return false; }
      // Evade can't enter or pass through Difficult Terrain (the path costs more than its length, or crosses an unwilling creature).
      const dist = num(movement?.pending?.distance), cost = num(movement?.pending?.cost);
      const evading = num(c.getFlag(F, "evadeMove")) > 0;
      if (evading && !ignoring && ((dist > 0 && cost > dist + 1e-6) || way.through.length || way.dark || way.cornerDT)) {
        warn(`Evade can't enter or pass through Difficult Terrain${way.through.length ? ` (${way.through.join(", ")}: an unwilling creature's space)` : ""}${way.dark ? " (Darkness: it can't see in it)" : ""}${way.cornerDT ? " (a diagonal between two creatures)" : ""}. Choose another path, or use End movement to give up the Evade.`);
        return false;
      }
      if (ch) {
        const from = origin;
        const problem = chargeProblem(doc, from, to, ch, via);
        if (problem) { warn(`Charge: ${problem}. Move again, or use End movement to give up the Charge.`); return false; }
        squares = measureSquares(from, to);   // a Charge costs the length of its straight line, whatever path the token took
        c.unsetFlag(F, "charge").catch(() => {});
        const reach = Math.max(1, num(c.actor?.system?.reach) || 1);
        setTimeout(() => chargeFollowUp(c, doc, reach), 600);
      }
      // An Advance through an unwilling creature's squares pays for Difficult Terrain (unless Foundry already counted it).
      if (!ch && !evading && !ignoring) squares += extraCost(way, cost > dist + 1e-6);
      mark(keyOf(doc, to.x, to.y));
      chargeMovement(c, squares, to).catch(e => console.error("twod12 | could not charge movement", e));
    } catch (e) { console.error("twod12 | movement tracking failed", e); }
  });
  // Fallback when preMoveToken does not report the move: the plain update of the position.
  Hooks.on("preUpdateToken", (doc, changes, options, userId) => {
    try {
      if (userId !== game.user.id || options?.twod12Forced || options?.twod12Lean || !("x" in changes || "y" in changes)) return;
      const c = currentCombatantFor(doc);
      if (!c) return;
      const from = homePos(doc), to = { x: changes.x ?? doc.x, y: changes.y ?? doc.y };
      if (from.x === to.x && from.y === to.y) return;
      const k = keyOf(doc, to.x, to.y);
      setTimeout(() => {
        if (seen(k)) return;
        const squares = measureSquares(from, to);
        if (squares <= 0) return;
        mark(k);
        chargeMovement(c, squares, to).catch(e => console.error("twod12 | could not charge movement", e));
      }, 300);
    } catch (e) { console.error("twod12 | movement tracking failed", e); }
  });
  game.socket.on(SOCKET, async data => {
    if (data?.type === "pushPath" && game.user.isActiveGM) { const d = await fromUuid(data.tokenUuid); if (d) await moveThrough(d, data.points ?? []); return; }
    if (data?.type !== "pushMove" || !game.user.isActiveGM) return;
    const doc = await fromUuid(data.tokenUuid);
    if (doc) await doc.update({ x: data.x, y: data.y }, { twod12Forced: true, animate: true, animation: { movementSpeed: TWOD12.pushSpeed, easing: "easeOutCubic" } });
  });
}


/* ------------------------------------------------------------------ */
/* The area a token can still move: shown after a @Move button, gone after the move  */
/* ------------------------------------------------------------------ */
let rangeGfx = null;
export function clearRange() { try { rangeGfx?.destroy(); } catch (e) { /* already gone */ } rangeGfx = null; }

const NEIGH = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
/** Squares within N of the token (every second diagonal costs 2), not through walls. */
export function reachableCells(cells, n, blocked = () => false) {
  const best = new Map(), key = (i, j) => `${i},${j}`;
  const queue = [];
  for (const c of cells) { best.set(`${key(c.i, c.j)}|0`, 0); queue.push({ i: c.i, j: c.j, cost: 0, par: 0 }); }
  const seen = new Map();
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const cur = queue.shift();
    const k = `${key(cur.i, cur.j)}|${cur.par}`;
    if (seen.has(k) && seen.get(k) <= cur.cost) continue;
    seen.set(k, cur.cost);
    for (const [a, b] of NEIGH) {
      const diag = a !== 0 && b !== 0, step = diag ? (cur.par === 0 ? 1 : 2) : 1;
      const nc = cur.cost + step;
      if (nc > n) continue;
      const ni = cur.i + a, nj = cur.j + b;
      if (blocked({ i: cur.i, j: cur.j }, { i: ni, j: nj })) continue;
      const nk = `${key(ni, nj)}|${diag ? 1 - cur.par : cur.par}`;
      if (seen.has(nk) && seen.get(nk) <= nc) continue;
      queue.push({ i: ni, j: nj, cost: nc, par: diag ? 1 - cur.par : cur.par });
    }
  }
  const out = new Map();
  for (const k of seen.keys()) { const [ij] = k.split("|"); const [i, j] = ij.split(",").map(Number); out.set(ij, { i, j }); }
  return [...out.values()];
}

/** Draw the area around the combatant's token (or around a position it is about to be at). */
export function showRange(c, squares, dest = null) {
  clearRange();
  try {
    const tok = c.token?.object;
    if (!tok || !canvas.grid?.isSquare || squares <= 0) return;
    const w = Math.max(1, Math.round(tok.document.width)), h = Math.max(1, Math.round(tok.document.height));
    const hp = homePos(tok.document), o = canvas.grid.getOffset({ x: dest?.x ?? hp.x, y: dest?.y ?? hp.y });
    const cells = [];
    for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) cells.push({ i: o.i + i, j: o.j + j });
    const pt = ({ i, j }) => cellCenter(i, j);
    const area = reachableCells(cells, squares, (a, b) => wallBetween(pt(a), pt(b)));
    rangeGfx = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(rangeGfx);
    fillCells(rangeGfx, area, 0x66ccff, 0.2);
    outlineCells(rangeGfx, area, { color: 0x8fdcff, width: 3 });
  } catch (e) { console.warn("twod12 | could not draw the movement area", e); }
}


/** Squares between two tokens (the closest squares they occupy; every second diagonal counts 2; elevation counts like a third axis). */
export function squaresBetween(a, b) {
  let best = Infinity;
  for (const p of tokenCells(a)) for (const q of tokenCells(b)) {
    const di = Math.abs(p.i - q.i), dj = Math.abs(p.j - q.j);
    best = Math.min(best, Math.max(di, dj) + Math.floor(Math.min(di, dj) / 2));
  }
  return Number.isFinite(best) ? withHeight(best, verticalSquares(a, b)) : best;
}

/** Range band of a weapon with ranges like "10/20/40": normal, far (1 bane), maximum (2 banes) or out of range. */
export function rangeBand(squares, rangeText) {
  const r = String(rangeText ?? "").split("/").map(Number).filter(n => n > 0);
  if (!r.length || !Number.isFinite(squares)) return null;
  const [n, far = r[0], max = r[r.length - 1]] = r;
  if (squares <= n) return { squares, band: 0, banes: 0, out: false, label: `Range ${squares}` };
  if (squares <= far) return { squares, band: 1, banes: 1, out: false, label: `Far range (${squares} sq)` };
  if (squares <= max) return { squares, band: 2, banes: 2, out: false, label: `Maximum range (${squares} sq)` };
  return { squares, band: 3, banes: 0, out: true, label: `Out of range (${squares} sq)`, max };
}
