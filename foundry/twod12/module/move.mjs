import { homePos, leanOf } from "./lean.mjs";
import { tokenDistance, lightAt, seenLight, sightSenses, regionHasPoint, verticalSquares, withHeight } from "./light.mjs";
// Movement: AP tracking for the creature whose turn it is (v0.0.414: an Advance is one piece, combat.mjs advanceAfterAction; free movement from @Move[walk]),
// and Pushed and Pulled with collision: @Move[pushed|distance:N] (@Move[pulled|distance:N]) lets the clicking player drag the target away from (toward) the origin.
import { esc } from "./roll.mjs";
import { sysCard, sysLine, apText } from "./sysmsg.mjs";
import { logMove, logPush, voidLastAction, patchLine, logBlocked } from "./enclog.mjs";   // v0.0.223: the Encounter Log
import { tokenCells, fillCells, outlineCells, cellCenter, cellAt, emanationCells, tokensInEmanation } from "./template.mjs";
import * as MK from "./mapmark.mjs";   // v0.0.461 (the map notes' redesign)
import { tierDistance } from "./inline.mjs";
import { TWOD12 } from "./config.mjs";
import { applyToActor } from "./damage.mjs";
import { getAP, setAP, combatantOf, apMax } from "./combat.mjs";
import { expireOnUse } from "./bonus.mjs";
import { evalExpr } from "./refs.mjs";
import { stepCorners, solidCorner, creatureIn, straightCells } from "./corners.mjs";
import { lineSteps } from "./linearea.mjs";
import { coverFromPoint } from "./cover.mjs";
import { hazardIn } from "./hazard.mjs";
import { steadinessOf } from "./defense.mjs";
import { newMoveAction } from "./moveseq.mjs";   // v0.0.274
import { unset } from "./util.mjs";   // v0.0.277: removing a key without the legacy "-=" syntax
import { effectOff, seesOrigin } from "./escalation.mjs";
import { allEffects } from "./passives.mjs";

import { moveLimitBreaks } from "./fxrules.mjs";
import { areaDifficult } from "./areafx.mjs";
import { ignoredBy } from "./automation.mjs";
/** The Movement limits of a creature that work now, each with its origin's token: [{ dir, name, token }] (Frightened: can't move closer to its source). */
// v0.0.361 (PACK PERF, D34): a drag measures many steps in a row, each asking for the mover's limits (8 of its 8.4 µs a step went to allEffects):
// they are read once and kept 200 ms. The source's token is kept, not its square, so a source that moves is still measured where it stands.
const limitCache = new Map();   // token id -> { t, out }
function moveLimitsOf(doc) {
  const id = doc?.id ?? "", now = Date.now(), hit = id ? limitCache.get(id) : null;
  if (hit && now - hit.t < 200 && hit.actor === doc?.actor) return hit.out;
  const out = readMoveLimits(doc);
  if (id) { if (limitCache.size > 50) limitCache.clear(); limitCache.set(id, { t: now, actor: doc?.actor, out }); }
  return out;
}
function readMoveLimits(doc) {
  const actor = doc?.actor, out = [];
  if (!actor) return out;
  const ignDaunted = ignoredBy(actor, "daunted", new Set()).length > 0;
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    if (ignDaunted && (e.statuses?.has?.("daunted") || /^daunted\b/i.test(String(e.name ?? "")))) continue;
    for (const l of e.getFlag?.("twod12", "moveLimits") ?? []) {
      if (l.seen && !seesOrigin(actor, e)) continue;
      const o = e.origin ?? "", tok = (canvas?.tokens?.placeables ?? []).find(t => t.document?.uuid === o || (t.actor && t.actor.uuid === o));
      if (tok && tok.document?.id !== doc.id) out.push({ dir: l.dir, how: l.how === "difficult" ? "difficult" : "cant", name: String(e.name ?? "").replace(/\s*\(.*\)\s*$/, ""), token: tok });
    }
  }
  return out;
}
const F = "twod12", SOCKET = "system.twod12";
const warn = m => ui.notifications.warn(m);
const refuse = m => { warn(m); return false; };   // a refusal that says no
// v0.0.221 (Lucas: every chat message in the system's design): the movement messages are system lines (sysmsg.mjs), not plain text.
const post = html => ChatMessage.create({ content: sysLine("fa-shoe-prints", html, "movemsg") });
// v0.0.220 (Lucas: every new chat message follows the system's design): the Charge's messages are system cards (sysmsg.mjs).
const postCard = (title, lead, text = "", cls = "") => ChatMessage.create({ content: sysCard({ title, lead, text, cls }) });
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
/**
 * Pure (v0.0.470, Lucas, 2026-11-20; book, Chapter 3, Forced Movement: "A creature as the origin is measured from its square nearest the creature it
 * moves"): the origin's square a push or a pull is measured from: the nearest to the moved creature's squares; a tie, the one whose center is
 * nearest the creature's center. A one-square origin is itself.
 */
export function nearestOriginCell(originCells, cells) {
  if ((originCells ?? []).length <= 1) return originCells ?? [];
  const t = centerOfCells(cells), cheb = q => Math.min(...cells.map(c => Math.max(Math.abs(c.i - q.i), Math.abs(c.j - q.j))));
  const best = [...originCells].sort((a, b) => cheb(a) - cheb(b) || Math.hypot(a.j + 0.5 - t.x, a.i + 0.5 - t.y) - Math.hypot(b.j + 0.5 - t.x, b.i + 0.5 - t.y))[0];
  return [best];
}
/**
 * Pure (v0.0.501, Lucas, 2026-11-25: "Pushing a large creature I think should allow to push to the sides of the cone"; book, Chapter 3, Forced
 * Movement: "A larger creature being moved is measured from its squares nearest the origin"): the moved creature's squares nearest the origin
 * (center to center); a one-square creature is itself. Each gives its own straight line and cone; "farther" and "closer" are the distance of
 * the creature's nearest square (movedDist).
 */
export function nearestMovedCells(cells, originCells) {
  if ((cells ?? []).length <= 1) return cells ?? [];
  const o = centerOfCells(originCells), d = c => Math.hypot(c.j + 0.5 - o.x, c.i + 0.5 - o.y), m = Math.min(...cells.map(d));
  return cells.filter(c => d(c) <= m + 1e-9);
}
/** Pure (v0.0.501): the distance from the origin's square to the moved creature's nearest square, after a shift s. */
const movedDist = (cells, o) => s => Math.min(...cells.map(c => Math.hypot(c.j + 0.5 + s.dj - o.x, c.i + 0.5 + s.di - o.y)));
export function pushShifts(cells, originCells, N, coneDeg = TWOD12.pushCone) {
  originCells = nearestOriginCell(originCells, cells);   // v0.0.470: measured from the origin's nearest square
  const o = centerOfCells(originCells);
  const dist = movedDist(cells, o);   // v0.0.501: from the creature's nearest square (a one-square creature: as before)
  const seen = new Set(), dirs = [];   // v0.0.501: every cone through the creature's nearest squares
  for (const n of nearestMovedCells(cells, originCells)) for (const d of awayDirs([n], originCells, coneDeg)) { const k = d.join(","); if (!seen.has(k)) { seen.add(k); dirs.push(d); } }
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
  const oc = nearestOriginCell(originCells, cells), o = centerOfCells(oc);   // v0.0.470: measured from the origin's nearest square
  const dist = movedDist(cells, o);   // v0.0.501: from the creature's nearest square (a one-square creature: as before)
  // v0.0.501: a cone through each of the creature's nearest squares (book, Chapter 3); a square is in when it is inside one of them
  const bearings = nearestMovedCells(cells, oc).map(n => Math.atan2(o.y - (n.i + 0.5), o.x - (n.j + 0.5))), lim = Math.PI / 4 - 1e-9;
  const inCone = s => bearings.some(bearing => { let d = Math.atan2(s.di, s.dj) - bearing; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d) < lim; });
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

/** v0.0.214 (book: Straight Line): the squares of a straight line from the creature's square to the shift, one tie side for the whole line. */
export const sideShifts = (di, dj, side = "left") => [{ di: 0, dj: 0 }, ...lineSteps({ x: 0, y: 0 }, { x: dj, y: di }, side).map(c => ({ di: c.y, dj: c.x }))];

/** The straight line (one square per step) from the creature's square to the shift. Reposition moves along this line. */
export function lineShifts(node) {
  const n = node.steps || 1, line = sideShifts(node.di, node.dj);
  if (line.length === n + 1) return line;
  return Array.from({ length: n + 1 }, (_, k) => ({ di: Math.round((node.di * k) / n) || 0, dj: Math.round((node.dj * k) / n) || 0 }));   // a node whose steps are not its straight length
}

/** The straight line to the square when it is a valid push path, otherwise the first shortest path found. */
export function pathTo(map, key) {
  const node = map.get(key);
  if (!node) return [];
  const n = node.steps;
  // v0.0.214 (book: Straight Line): the straight line's squares, one tie side for the whole movement (the origin chooses: left, else right).
  const okLine = line => line.length === n + 1 && line.every((s, k) => map.has(shiftKey(s)) && (k === 0 || (map.dist ? map.dist(s) > map.dist(line[k - 1]) : true)));
  const line = [sideShifts(node.di, node.dj, "left"), sideShifts(node.di, node.dj, "right")].find(okLine);
  if (line) return line.map(s => map.get(shiftKey(s)));
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
 * Action DC of what holds it (Chapter 1, Action DC; pack TALENTS-PT: was the Immobilized DC); a Save Action has the origin roll 2d12 + its Modifier once (saveTotal). Returns { moved, why }.
 */
export function heldMoveOutcome({ rolls = false, total = null, save = false, saveTotal = null, dc = 13 } = {}) {
  if (save) return Number.isFinite(saveTotal) && saveTotal >= dc ? { moved: true, why: `the origin's roll ${saveTotal} beats the Action DC ${dc}` } : { moved: false, why: `the origin's roll ${saveTotal ?? "?"} is below the Action DC ${dc}` };
  if (!rolls || !Number.isFinite(total)) return { moved: false, why: "it is Immobilized, and this movement doesn't come from a roll" };
  return total >= dc ? { moved: true, why: `the roll ${total} beats the Action DC ${dc}` } : { moved: false, why: `the roll ${total} is below the Action DC ${dc}` };
}

/**
 * The Action DC of what holds a creature (book, Chapter 1, Action DC: 11 + the Modifier the Action used; 13 with no Action behind it): the highest
 * stored on its Immobilized conditions. pack TALENTS-PT: the flag is actionDc (an Immobilized of an older version stored immobileDc: still read).
 */
export function heldDc(actor) {
  const read = e => e.getFlag?.(F, "actionDc") ?? e.flags?.[F]?.actionDc ?? e.getFlag?.(F, "immobileDc") ?? e.flags?.[F]?.immobileDc;
  const dcs = (actor?.effects ?? []).filter(e => e.statuses?.has?.("immobilized")).map(e => Number(read(e))).filter(Number.isFinite);
  return dcs.length ? Math.max(...dcs) : TWOD12.baseDC;
}
/**
 * Pure (pack TALENTS-PT; book, Break Free): the Check Break Free rolls: Body or Instinct, the higher (Body on a tie), against the Action DC of what
 * holds the creature. Returns { attr, mod, dc }.
 */
export function breakFreeCheck(actor) {
  const at = actor?.system?.attributes ?? {}, b = Number(at.body) || 0, i = Number(at.instinct) || 0;
  return i > b ? { attr: "instinct", mod: i, dc: heldDc(actor) } : { attr: "body", mod: b, dc: heldDc(actor) };
}

/* ------------------------------------------------------------------ */
/* Movement tracking                                                   */
/* ------------------------------------------------------------------ */
/** v0.0.418 (playtest 5): while a Setup's movement is made, the Action it belongs to (the Encounter Log writes it inside that Action). */
let setupLogName = "";
export const setSetupLog = name => { setupLogName = String(name ?? ""); };
/** Charge a move of `cost` squares: free movement first, then Walk allotments (1 AP each: a drag that pays AP is an Advance Action, v0.0.414). */
export async function chargeMovement(c, cost, dest = null, { par = 0, logMode = "", undoCtx = null } = {}) {
  const snap = undoCtx ? snapshotMoveUndo(c, undoCtx, cost) : null;
  const walk = num(c.actor?.system?.moveSpeed ?? c.actor?.system?.speed);
  let evade = num(c.getFlag(F, "evadeMove")), free = num(c.getFlag(F, "freeMove")), left = num(c.getFlag(F, "moveLeft"));
  let need = cost;
  // v0.0.182: an Evade goes on square by square (its area stays shown) until the creature uses another Action or ends the movement:
  // it can't be split around other Actions (spendAP in combat.mjs clears what is left), but one Evade can take several drags.
  const useEvade = Math.min(evade, need); need -= useEvade; evade -= useEvade;
  let enclogId = "";
  try { enclogId = logMove(c.token?.object ?? c.actor, logMode || (useEvade ? "Evade" : "Advance"), cost, setupLogName) || ""; } catch (e) { /* no log */ }   // v0.0.223: the Encounter Log
  if (snap) snap.enclogId = enclogId;
  const useFree = Math.min(free, need); free -= useFree; need -= useFree;
  let spent = 0;
  if (need > 0) {
    if (walk <= 0) warn(`${c.name} has no Speed.`);
    else { while (need > left + 1e-9) { left += walk; spent++; } left -= need; }
  }
  if (spent && !useEvade) newMoveAction(c.id);   // v0.0.274: a drag that spends AP is a new Advance (a new Move Action for the Reactions); before any await
  const evadeEnded = useEvade > 0 && evade <= 0;
  await c.update({ [`flags.${F}.evadeMove`]: evade, [`flags.${F}.freeMove`]: free, [`flags.${F}.moveLeft`]: Math.round(left * 100) / 100, ...(spent && !useEvade ? { [`flags.${F}.advOwn`]: true, [`flags.${F}.advInteract`]: false } : {}), ...(evadeEnded ? { ...unset(`flags.${F}.ignoreTerrain`), ...unset(`flags.${F}.passEnemies`), ...unset(`flags.${F}.noFarther`) } : {}), ...(useEvade > 0 ? { [`flags.${F}.diagPar`]: evade > 0 ? par : 0 } : {}) });
  if (evadeEnded) promptStowAfter(c).catch(e => console.warn("twod12 | stow after Evade", e));
  if (evadeEnded) runThenMove(c).catch(e => console.warn("twod12 | the next movement", e));   // v0.0.512: Slip Away's Advance 2 after its Evade 1
  clearRange();
  // "Until it uses a Move Action": the effect lasts through this move and ends once it is resolved (an Evade is not a Move Action).
  if (!useEvade) await expireOnUse(c.actor, new Set(["move"])).catch(() => {});
  const rem = free + evade + Math.round(left * 100) / 100;
  if (rem > 0 && dest) showRange(c, rem, dest, evade > 0 ? par : 0);
  const ap = getAP(c);
  const sq = Math.round(cost * 100) / 100;
  const what = useEvade ? `Evade ${sq} sq, no reactions` : `Advance ${sq} sq`;
  if (spent) await setAP(c, Math.max(0, ap - spent), what, { quiet: !useEvade && walk > 0 });   // v0.0.197: the movement's own line says it
  // v0.0.196 (Lucas): while the movement banner is up it says what is left, so the drags post nothing; a drag that spends AP (moving the
  // token without using Advance first) is an Advance: it opens the banner, and its Speed left counts there.
  if (spent && !useEvade && walk > 0) { if (bannerOn(c) && moveBar && !moveBar.logged()) moveBar.add(walk * spent, spent); else moveBanner(c, "walk", walk * spent, "Advance", { drag: true, ap: spent }); }
  if (snap) {
    snap.spentAp = spent;
    snap.openedBanner = !snap.bannerBefore && spent > 0 && !useEvade && walk > 0;
    recordMoveUndo(snap);
  }
  // v0.0.418 (Lucas, playtest 5, C6): no chat line for a drag of free movement ("Advance 2 sq. 4 sq left"): the movement bar and the strip say it
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
  // v0.0.226 (Lucas: Rolling Shot's Evade moved the targeted ally): an Evade and a Charge are always made by the creature that used the Action.
  if (["evade", "charge"].includes(cfg.kind)) return ctx?.token ?? tokenOf(contextActor(ctx)) ?? (selected.length === 1 ? selected[0] : null);
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
/** v0.0.345: how many squares a grid square (its top left {i, j}) is from a token's square, as the Movement limits measure (top left to top left). */
const limitSquares = (cell, tok) => { const sq = squareOf(cell), p = canvas.grid.getTopLeftPoint({ i: sq.i, j: sq.j }); return measureSquares(p, { x: tok.document.x, y: tok.document.y }); };

/**
 * A step into a square that is Difficult Terrain for the token (Darkness its Sight can't see in, or an unwilling creature's square) costs double.
 * Difficult Terrain does not stack: a square that already costs double stays at double.
 */
const bigMode = new Map();   // v0.0.468: a token id -> how Foundry gives a big token's steps ("tl" or "center"), read from a drag's first step
function hardStep(doc, to, step, cost, from = null) {
  try {
    if (!doc?.actor || !to) return cost;
    if (ignoresTerrain(doc)) return Number.isFinite(step) && step > 0 ? step : cost;   // (Cut Through) the terrain costs nothing extra
    // v0.0.453 assumed Foundry gives the square of the token's CENTER; v0.0.468 (Lucas, checklist v0.0.467: a Large token still paid nothing on the
    // ruler) reads it from the drag itself: its first step starts where the token stands, at its top-left square or at its center square, and that
    // tells how every step of this drag is given (remembered for the token; until then, the center)
    const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1)), c0 = squareOf(to);
    let mode = "center";
    if (w > 1 || h > 1) {
      const tl0 = cellAt({ x: (doc.x ?? 0) + 2, y: (doc.y ?? 0) + 2 }), ce0 = { i: tl0.i + Math.floor(h / 2), j: tl0.j + Math.floor(w / 2) }, f = from ? squareOf(from) : null;
      if (f && f.i === tl0.i && f.j === tl0.j) bigMode.set(doc.id, "tl");
      else if (f && f.i === ce0.i && f.j === ce0.j) bigMode.set(doc.id, "center");
      mode = bigMode.get(doc.id) ?? "center";
    }
    const shift = sq => (mode === "tl" ? { i: sq.i, j: sq.j } : { i: sq.i - Math.floor(h / 2), j: sq.j - Math.floor(w / 2) });
    const at = shift(c0);
    const cells = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) cells.push({ i: at.i + di, j: at.j + dj });
    const senses = sightSenses(doc.actor);   // v0.0.459: Blinded too
    let hard = cells.some(c => seenLight(lightAt(canvas.grid.getCenterPoint(c)), senses) === "dark");
    if (!hard) {
      // the core rework batch 4: an ally's or a Down creature's square is Difficult Terrain; an enemy's blocks (the move hook refuses it; Tumble passes at no extra cost)
      const others = (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc.id && t.actor && !t.document?.hidden && wayKind(t, doc) === "dt");
      hard = others.some(t => tokenCells(t).some(c => cells.some(m => m.i === c.i && m.j === c.j)));
    }
    // (v0.0.171 made the diagonal between two creatures Difficult Terrain; batch 4 blocks it: the move hook refuses it)
    const f0 = from ? squareOf(from) : null, fromTl = f0 ? shift(f0) : null;
    // v0.0.345 (book, Frightened): a step that brings it closer to the source of a "Difficult Terrain" Movement limit costs double
    if (!hard && from) hard = moveLimitsOf(doc).some(l => l.how === "difficult" && moveLimitBreaks(l.dir, limitSquares(fromTl, l.token), limitSquares(at, l.token)));
    if (!hard) hard = areaDifficult(doc, cells);   // v0.0.327 (PACK ZONE): a Zone's or an Aura's Difficult Terrain, for the creatures its row reaches only
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
/**
 * The core rework batch 4 (Lucas, 2026-11-25; book, Chapter 3, Creatures in your way): an unwilling creature's space blocks your own movement; an ally's
 * (a willing creature's) space and a Down or dead creature's are Difficult Terrain. Pure on a token: "block" or "dt".
 */
export const downTok = t => { const a = t?.actor; return !!(a?.system?.atZero || ["dead", "dying", "shattered", "unconscious", "desperate"].some(s => a?.statuses?.has?.(s))); };
export const wayKind = (t, doc) => (!downTok(t) && (t?.document?.disposition ?? 0) !== (doc?.disposition ?? 0) ? "block" : "dt");
/** An enemy that blocks (unwilling and not Down) in a square, for the diagonal between two of them (book: blocked). */
const blockerIn = (cell, doc) => { const t = unwillingIn(cell, doc); return t && !downTok(t) ? t : null; };

/** The system setting that lets the movement buttons work when there is no combat. */
export const movesOutsideCombat = () => { try { return !!game.settings.get(F, "moveOutsideCombat"); } catch (e) { return false; } };

let looseId = null;   // the token whose movement area (outside combat) is on the canvas
/** Outside combat: show the area the token can reach. Nothing is tracked or charged; the area goes away when the token moves, or with the Clear button. */
async function looseMove(token, n, kind, cfg) {
  const sq = `${n} square${n === 1 ? "" : "s"}`;
  const what = kind === "evade" ? `Evade up to ${sq}: no reactions, and not into or through Difficult Terrain`
    : kind === "charge" ? `Charge in a straight line, at least ${cfg.min || 3} and up to ${sq}, not through Difficult Terrain` : `Advance up to ${sq}`;
  showRange({ token: { object: token }, kind }, n);   // v0.0.224: kind, for the Evade area (no Difficult Terrain)
  looseId = token.document?.id ?? token.id;
  await post(`<b>${esc(token.name)}</b> can ${what}. Outside combat the movement is not tracked. <button type="button" class="endmove" data-twod12="clearMove"><i class="fa-solid fa-eraser"></i> Clear</button>`);
}

/** Take the movement area off the canvas. */
export function clearLooseMove() { clearRange(); looseId = null; }

/** Offer to stow the weapon drawn by the Action's Setup once its Evade finishes (or End movement is clicked). */
async function promptStowAfter(c) {
  const stow = c?.getFlag?.(F, "stowAfter");
  if (!stow?.weaponId || !c?.actor) return;
  try { await c.unsetFlag(F, "stowAfter"); } catch (e) { /* already gone */ }
  const w = c.actor.items?.get?.(stow.weaponId);
  if (!w || !w.system?.wielded) return;
  const { pickBar } = await import("./pickbar.mjs");
  const pick = await pickBar({ icon: "fa-hand", text: `Stow <b>${esc(w.name)}</b> (drawn with Setup)?`, options: [{ id: "stow", label: `Stow ${w.name}` }, { id: "keep", label: "Keep in hand" }], cancel: "" });
  if (pick !== "stow") return;
  const { weaponMove } = await import("./loadout.mjs");
  await w.update(weaponMove("worn"));
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: c.actor }), content: sysLine("fa-hand", `<b>${esc(c.actor.name)}</b> stows ${esc(w.name)}.`) });
}

async function grantFreeMove(cfg, ctx, kind = "walk") {
  const token = moverToken(ctx, cfg);
  const actor = token?.actor ?? contextActor(ctx), combat = game.combat;
  const c = token ? (combat?.combatants.find(x => x.tokenId === token.id) ?? combatantOf(actor, combat)) : combatantOf(actor, combat);
  const inCombat = !!c && !!combat?.started;
  if (!inCombat && !movesOutsideCombat()) return refuse(`${token?.name ?? actor?.name ?? "That creature"} is not in a combat that has started, so its free movement can't be tracked. (The GM can allow it outside combat in the system settings.)`);
  if (!inCombat && !token) return refuse("Select a token to show where it can move.");
  if (actor?.statuses?.has?.("immobilized")) return refuse(`${actor.name} is Immobilized and can't move.`);
  if (kind === "evade" && actor?.statuses?.has?.("prone")) return refuse(`${actor.name} is Prone and can't Evade.`);
  // v0.0.411 (pack F3, Fleet: hooks.mjs evadeMore): each Evade of the creature moves it 1 more square (beyond its Speed: the ability says so)
  let fleet = 0;
  if (kind === "evade") { try { const { activeHooks } = await import("./hooks.mjs"); fleet = activeHooks(actor, "evadeMore").reduce((t, h) => t + Math.max(0, Number(h.hook.n) || 1), 0); } catch (e) { fleet = 0; } }
  const n = moveDistance(cfg, actor) + (fleet && moveDistance(cfg, actor) > 0 ? fleet : 0);
  if (!n && moveDistance({ ...cfg, uncapped: true }, actor) > 0) return refuse(`${actor.name} has Speed 0 and can't move.`);   // the distance is fine, but the cap (your Speed) leaves nothing
  if (!n) return refuse(`Could not work out the distance "${cfg.distanceExpr}".`);
  if (!inCombat) { await looseMove(token, n, kind, cfg); return true; }
  const key = kind === "evade" ? "evadeMove" : "freeMove";
  if (kind !== "evade") newMoveAction(c.id);   // v0.0.274: a Move Action's movement (Advance, Charge, Crawl): a new one for the Reactions
  await c.setFlag(F, key, num(c.getFlag(F, key)) + n);
  if (combat?.combatant?.id !== c.id) await c.setFlag(F, "offTurnAt", turnStamp(combat));   // v0.0.421: granted off its turn (a Reaction): tracked during this turn only
  if (kind === "evade") await c.setFlag(F, "diagPar", 0);   // v0.0.183: a new Evade starts its diagonals from 0
  if (cfg.ignoreTerrain) await c.setFlag(F, "ignoreTerrain", true);
  if (cfg.passEnemies) await c.setFlag(F, "passEnemies", true);   // batch 4: Tumble
  const fAct = ctx?.message?.getFlag?.(F, "action");
  if (cfg.stow && fAct?.drawnWeaponId) await c.setFlag(F, "stowAfter", { weaponId: fAct.drawnWeaponId });
  let nfNote = "";
  if (cfg.noFarther === "target" && token) {
    const tRef = (ctx?.targets ?? fAct?.targets ?? [])[0];
    let tgtTok = null;
    try { const d = tRef?.uuid ? fromUuidSync(tRef.uuid) : null; tgtTok = d?.object ?? d?.getActiveTokens?.()[0] ?? null; } catch (e) { tgtTok = null; }
    tgtTok ??= [...(game.user.targets ?? [])].find(t => t.id !== token.id) ?? null;
    if (tgtTok) {
      const maxDist = Math.round(tokenDistance(token, tgtTok));
      await c.setFlag(F, "noFarther", { targetId: tgtTok.id, targetName: tgtTok.name, maxDist });
      nfNote = `; ending no farther from ${tgtTok.name} (${maxDist} sq.)`;
    }
  }
  if (kind === "charge") {
    // v0.0.219 (Lucas): giving up a Charge before it moves refunds the AP its Action cost (from its card).
    const f = fAct;
    // v0.0.224 (Lucas, playtest 3): a Charge targets a creature (the card's target, else the one targeted now): its line goes toward it.
    const tUuid = f?.targets?.[0]?.uuid ?? "", targetId = String(tUuid).split(".").pop() || ([...game.user.targets].find(t => t.id !== token?.id)?.id ?? "");
    await c.setFlag(F, "charge", { min: cfg.min || 3, max: n, refund: Math.max(0, num(f?.apPaid ?? f?.ap)), itemId: f?.itemId ?? "", actorUuid: f?.actorUuid ?? "", targetId, messageId: ctx?.message?.id ?? "" });   // v0.0.343: its card (deleted when given up)
  }
  const sq = `${n} square${n === 1 ? "" : "s"}`;
  if (cfg.quiet && kind !== "charge") { showRange(c, n); return true; }   // v0.0.224: a Setup's movement (its bar says it), no chat line
  // v0.0.195 (Lucas): from a movement-only Action, the banner instead of a chat line; one short line is posted when the movement ends.
  if (cfg.banner && kind !== "charge") { showRange(c, n); moveBanner(c, kind, n, cfg.banner, { ap: cfg.bannerAp ?? 0 }); return true; }
  if (kind === "charge") {
    // v0.0.218 (Lucas): aimed like a Line (the Charge picker), not dragged. v0.0.219: no chat line (the picker's bar says it all).
    if (!openChargePicker(c, token)) { await post(`<b>${esc(c.name)}</b> can Charge: in a straight line, at least ${cfg.min || 3} and up to ${sq}. ${endBtn(c)}`); showRange(c, n); }
    return true;
  }
  // v0.0.225 (Lucas: "End movement" and "Advance instead" were still chat buttons): a bottom bar, as a Setup's movement (Cut Through).
  const what = kind === "evade"
    ? `Evade up to ${sq}: no reactions; ${cfg.ignoreTerrain ? "through any creature's space (not ending in one), ignoring Difficult Terrain" : "not into or through Difficult Terrain"}${nfNote}. Drag your token.`
    : `Advance up to ${sq} without spending AP${nfNote}. Drag your token.`;
  freeMoveBar(c, kind, what);
  showRange(c, n);
  return true;   // granted: the area is on the map
}

/** v0.0.225: the bar of free movement granted by a card (an Evade or an Advance inside an Action): End movement, and Advance instead for an Evade.
 *  It goes away when the squares are used up or dropped, or the turn changes. */
let freeBar = null;
function freeMoveBar(c, kind, text) {
  if (typeof document === "undefined") return;   // the tests
  const barOpts = arguments[3] ?? {};
  freeBar?.remove();
  const bar = document.createElement("div");
  bar.className = "twod12-linebar twod12-setupbar twod12-freebar";
  bar.innerHTML = `<i class="fa-solid ${kind === "evade" ? "fa-wind" : "fa-person-running"} lb-ic"></i><span class="lb-text"><b>${esc(c.name)}</b>: ${esc(text)}</span>${kind === "evade" ? '<button type="button" class="lb-go lb-adv"><i class="fa-solid fa-person-running"></i> Advance instead</button>' : ""}<button type="button" class="lb-go lb-undo" style="display:none"><i class="fa-solid fa-rotate-left"></i> Undo move</button><button type="button" class="lb-give lb-end">End movement</button><span class="lb-count"></span><span class="lb-keys"><kbd>Ctrl+Z</kbd> Undo · <kbd>Esc</kbd> End movement</span>`;
  // v0.0.441 (D7): End movement asks in the HUD's Situational section too (the floating bar only with no HUD)
  const hud = globalThis.__twod12Hud ?? null, slot = hud?.hudAskSlot?.() ?? null, side = !!slot?.classList?.contains("hb-ask");
  if (slot) { bar.classList.add("in-hud"); bar.classList.toggle("in-side", side); slot.append(bar); hud.hudAsking(true, side); } else document.body.append(bar);
  // v0.0.461 (the map notes' redesign, b / c / h): the squares left, big, kept up to date; Escape ends the movement (it did nothing)
  const leftOf = cb => num(cb?.getFlag(F, "freeMove")) + num(cb?.getFlag(F, "evadeMove")) + (barOpts.drag ? num(cb?.getFlag(F, "moveLeft")) : 0);
  const refreshUndo = () => { const ub = bar.querySelector(".lb-undo"); if (ub) ub.style.display = canUndoMove(c.tokenId) ? "" : "none"; };
  const count = () => { const cb = game.combat?.combatants.get(c.id), left = leftOf(cb), el = bar.querySelector(".lb-count"); if (el) el.innerHTML = `<b>${left}</b> square${left === 1 ? "" : "s"} left`; refreshUndo(); };
  count();
  const turn = `${game.combat?.round}:${game.combat?.turn}`;
  const close = () => { bar.remove(); try { (globalThis.__twod12Hud ?? hud)?.hudAsking?.(false); } catch (e) { /* gone */ } if (freeBar === bar) freeBar = null; Hooks.off("updateCombatant", watch); Hooks.off("updateCombat", watchTurn); window.removeEventListener("keydown", esc_, true); };
  const doEnd = () => { close(); (barOpts.onEnd ? barOpts.onEnd() : endMovement(c.id)).catch?.(() => {}); };
  const watch = cb => { if (cb.id !== c.id) return; if (leftOf(cb) <= 0) close(); else count(); };
  const esc_ = ev => { if (ev.key !== "Escape" || !bar.isConnected || /input|textarea|select/i.test(ev.target?.tagName ?? "")) return; ev.preventDefault(); ev.stopImmediatePropagation(); doEnd(); };
  window.addEventListener("keydown", esc_, true);
  const watchTurn = cb => { if (`${cb.round}:${cb.turn}` !== turn) close(); };
  Hooks.on("updateCombatant", watch); Hooks.on("updateCombat", watchTurn);
  bar.querySelector(".lb-end").addEventListener("click", ev => { ev.preventDefault(); doEnd(); });
  bar.querySelector(".lb-undo")?.addEventListener("click", ev => { ev.preventDefault(); undoLastMove(c.tokenId).catch?.(e => console.warn("twod12 | undo move", e)); });
  // v0.0.226 (Lucas): after Advance instead, Evade instead turns it back (only for a movement that was an Evade).
  const swap = toAdvance => {
    const b = bar.querySelector(".lb-adv"), t = bar.querySelector(".lb-text");
    if (toAdvance) {
      bar.dataset.evadeN = String(num(game.combat?.combatants.get(c.id)?.getFlag(F, "evadeMove")));
      (barOpts.onSwap ? barOpts.onSwap(true) : evadeAsAdvance(c.id)).catch?.(() => {});
      if (b) b.innerHTML = '<i class="fa-solid fa-wind"></i> Evade instead';
      if (t) t.innerHTML = `<b>${esc(c.name)}</b>: the movement is an Advance now (it triggers reactions). Drag your token.`;
    } else {
      const n = num(bar.dataset.evadeN);
      (barOpts.onSwap ? barOpts.onSwap(false, n) : advanceAsEvade(c.id, n)).catch?.(() => {});
      if (b) b.innerHTML = '<i class="fa-solid fa-person-running"></i> Advance instead';
      if (t) t.innerHTML = `<b>${esc(c.name)}</b>: ${esc(text)}`;
    }
    bar.dataset.mode = toAdvance ? "advance" : "evade";
  };
  bar.querySelector(".lb-adv")?.addEventListener("click", ev => { ev.preventDefault(); swap(bar.dataset.mode !== "advance"); });
  bar._closeFreeBar = close;
  bar._refreshUndo = refreshUndo;
  freeBar = bar;
  return close;
}

/** The Evade becomes an Advance: it can then be used on a move that does trigger reactions (or by a creature that can not Evade). */
export async function evadeAsAdvance(combatantId, { quiet = false } = {}) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c?.isOwner) return warn("Only the owner can change this movement.");
  const n = num(c.getFlag(F, "evadeMove"));
  if (!n) return warn("There is no Evade movement left.");
  await c.update({ [`flags.${F}.evadeMove`]: 0, [`flags.${F}.freeMove`]: num(c.getFlag(F, "freeMove")) + n, ...unset(`flags.${F}.ignoreTerrain`), ...unset(`flags.${F}.passEnemies`) });
  if (!quiet) await post(`<b>${esc(c.name)}</b> uses the movement as an Advance of up to ${n} square${n === 1 ? "" : "s"} instead of an Evade.`);
  showRange(c, n);
}

/** v0.0.226: an Evade turned into an Advance goes back to an Evade (the free squares left, up to what the Evade was). */
export async function advanceAsEvade(combatantId, max = 0) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c?.isOwner) return warn("Only the owner can change this movement.");
  const free = num(c.getFlag(F, "freeMove")), n = max > 0 ? Math.min(free, max) : free;
  if (!n) return warn("There is no movement left to Evade with.");
  await c.update({ [`flags.${F}.evadeMove`]: num(c.getFlag(F, "evadeMove")) + n, [`flags.${F}.freeMove`]: free - n, [`flags.${F}.diagPar`]: 0 });
  showRange(c, n);
}

/* ------------------------------------------------------------------ v0.0.197-v0.0.198: a movement's line and its squares left (on the strip) */
const VERB = { walk: "Advanced", evade: "Evaded" }, NOUN = { walk: "Advance", evade: "Evade" };
let moveBar = null, lastBar = { id: "", until: 0 };
/** Is a movement tag up for this combatant (or did one just close: its last drag's update comes after)? */
const bannerOn = c => !!c?.id && ((!!moveBar && moveBar.c?.id === c.id) || (lastBar.id === c.id && Date.now() < lastBar.until));
/** Pure: the chat line of a movement, while it goes on (moved null) and when it ends. */
export const moveLine = (who, mode, name, ap, granted, moved = null) => {
  const sq = n => `${n} square${n === 1 ? "" : "s"}`;
  if (moved === null) return `<b>${esc(who)}</b> uses <b>${esc(name)}</b> <small>(${ap ? `${ap} AP: ` : ""}up to ${sq(granted)})</small>`;
  const tag = [name !== NOUN[mode] ? name : "", ap ? `${ap} AP` : ""].filter(Boolean).join(", ");
  return `<b>${esc(who)}</b> ${VERB[mode] ?? "moved"} <b>${moved}</b> of ${sq(granted)}${tag ? ` <small>(${esc(tag)})</small>` : ""}`;
};

/**
 * v0.0.198 (Lucas): a movement-only Action (Advance, Evade, Crawl) or a drag that pays an Advance: the squares left show on the combat strip
 * under the creature's AP dots, with End (and Advance instead, for an Evade) next to Next turn (carousel.mjs); nothing covers the map.
 * ONE chat line: "Kai uses Advance (1 AP: up to 7 squares)", changed to "Kai Advanced 4 of 7 squares (1 AP)" when it ends (used up, End,
 * or the turn changes). This keeps that line and the end of the movement, on the client of whoever moved.
 */
export function moveBanner(c, kind, granted, name, { drag = false, ap = 0, skipLive = false } = {}) {
  moveBar?.finish(false);
  // drag: started by moving the token (an Advance paid by the drag): the Speed left of that Advance (moveLeft) counts too.
  const left = () => num(c.getFlag(F, "freeMove")) + num(c.getFlag(F, "evadeMove")) + (drag ? num(c.getFlag(F, "moveLeft")) : 0);
  let after = getAP(c), logged = false, closeSit = null;
  // v0.0.200 (Lucas): the movement's line goes to the Turn Log ONCE, when it ends (or when another Action comes first): its name and cost.
  const writeLine = async () => {
    if (logged) return;
    logged = true;
    // v0.0.362 (Lucas: Advance didn't show until the whole movement was used): its live line becomes the finished one, with the squares moved
    const { logMoveDone, makeLine } = await import("./ticker.mjs");
    await logMoveDone(c, { ...makeLine("move", name, after + ap, after, Math.max(apMax(c), after + ap)), sq: Math.round(Math.max(0, granted - left()) * 100) / 100 });
  };
  const hooks = [];
  const on = (h, fn) => hooks.push([h, Hooks.on(h, fn)]);
  const teardown = () => {
    if (!moveBar || moveBar.c !== c) return false;
    moveBar = null;
    for (const [h, id] of hooks) Hooks.off(h, id);
    try { closeSit?.(); } catch (e) { /* gone */ }
    closeSit = null;
    return true;
  };
  const finish = async (drop = true) => {
    if (!teardown()) return;
    lastBar = { id: c.id, until: Date.now() + 2500 };
    const l = left();
    if (drop && l > 0 && c.isOwner && game.combat?.combatants?.has?.(c.id)) await c.update({ [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, ...(drag ? { [`flags.${F}.moveLeft`]: 0 } : {}), ...unset(`flags.${F}.ignoreTerrain`), ...unset(`flags.${F}.passEnemies`) });
    clearRange();
    await writeLine();
    if (drop) runThenMove(c).catch(e => console.warn("twod12 | the next movement", e));   // v0.0.512: End movement on a chained movement starts the next one
  };
  const cancel = () => { if (!teardown()) return; lastBar = { id: "", until: 0 }; clearRange(); };
  moveBar = {
    c, finish, cancel, writeLine, logged: () => logged,
    toAdvance: () => { name = name === "Evade" ? "Advance" : name; },
    add: (n, moreAp = 0) => { granted += n; ap += moreAp; after = getAP(c); },
    info: () => ({ kind, granted, name, drag, ap, after }),
    restore: st => { if (!st) return; granted = st.granted; ap = st.ap; name = st.name; after = st.after; }
  };
  // v0.0.495 (Lucas): Basic Actions Advance / Evade / Crawl also surface "End movement" (and "Advance instead") in the HUD Situational tab
  if (left() > 0) {
    const sq = `${granted} square${granted === 1 ? "" : "s"}`;
    const what = kind === "evade"
      ? `${name} up to ${sq}: no reactions; not into or through Difficult Terrain. Drag your token.`
      : `${name} up to ${sq}. Drag your token.`;
    closeSit = freeMoveBar(c, kind, what, { drag, onEnd: () => finish(true), onSwap: (toAdv, n) => (toAdv ? evadeToAdvance(c.id) : advanceAsEvade(c.id, n)) }) ?? null;
  }
  on("updateCombatant", cb => { if (cb.id !== c.id || moveBar?.c !== c) return; if (left() <= 0) finish(false); });
  // v0.0.362: the movement shows in the Turn Breakdown as soon as it starts (live: the dock counts its squares)
  if (!skipLive) import("./ticker.mjs").then(T => T.logLive(c, T.makeLine("move", name, after + ap, after, Math.max(apMax(c), after + ap)), granted)).catch(() => {});
  on("combatTurnChange", () => finish(false));
  on("deleteCombat", () => finish(false));
}

/** v0.0.200: another Action is about to be used: a movement under way writes its Turn Log line first (it goes on tracking its squares). */
export async function closeMoveLine(c) {
  if (c?.tokenId) clearMoveUndo(c.tokenId);
  if (moveBar?.c?.id === c?.id) await moveBar.writeLine();
}

/** v0.0.198: the strip's End button: the movement this client tracks ends (its line is completed), or the free squares are dropped. */
export async function endMoveFor(combatantId) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c) return;
  if (moveBar?.c?.id === combatantId) return moveBar.finish(true);
  if (c.getFlag(F, "charge")) return endMovement(combatantId);
  if (!c.isOwner) return warn("Only the owner can end this movement.");
  const hadStow = !!c.getFlag(F, "stowAfter");
  await c.update({ [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, [`flags.${F}.moveLeft`]: 0, ...unset(`flags.${F}.ignoreTerrain`), ...unset(`flags.${F}.passEnemies`), ...unset(`flags.${F}.noFarther`) });
  clearRange();
  if (hadStow) promptStowAfter(c).catch(e => console.warn("twod12 | stow after Evade", e));
  runThenMove(c).catch(e => console.warn("twod12 | the next movement", e));   // v0.0.512: ending a chained movement starts the next one
}
/** v0.0.512 (playtest 7, Slip Away): the movements left of a Reaction's chain (actions.mjs autoMoveChain): the next one starts when this one ends. */
async function runThenMove(c) {
  const rest = c?.getFlag?.(F, "thenMove");
  if (!Array.isArray(rest) || !rest.length || !c.isOwner) return;
  await c.setFlag(F, "thenMove", rest.slice(1));
  await new Promise(r => setTimeout(r, 400));   // the ending movement's bar closes first
  const token = c.token?.object ?? c.actor?.getActiveTokens?.()[0] ?? null;
  if (!token) return;
  const { parseInline } = await import("./inline.mjs");
  const cfg = parseInline("Move", rest[0]); cfg.traits = [...new Set([...(cfg.traits ?? []), "self"])];
  await handleMove(cfg, { actor: c.actor, token });
}
/** v0.0.198: the strip's Advance instead (an Evade becomes an Advance; the movement's line says Advanced). */
export async function evadeToAdvance(combatantId) {
  if (moveBar?.c?.id === combatantId) moveBar.toAdvance();
  return evadeAsAdvance(combatantId, { quiet: true });
}
/** Pure: what the strip shows under a creature's AP dots: { n, evade } (n 0: nothing). */
export const stripMove = c => { const ev = num(c?.getFlag?.(F, "evadeMove")), n = ev + num(c?.getFlag?.(F, "freeMove")) + num(c?.getFlag?.(F, "moveLeft")); return { n: Math.round(n * 100) / 100, evade: ev > 0 }; };

/** The creature is done moving: the free squares it did not use are dropped. */
export async function endMovement(combatantId) {
  const c = game.combat?.combatants.get(combatantId);
  if (!c) return warn("That combatant is no longer in the combat.");
  if (!c.isOwner) return warn("Only the owner can end this movement.");
  const charging = c.getFlag(F, "charge"), hadStow = !!c.getFlag(F, "stowAfter");
  await c.update({ [`flags.${F}.freeMove`]: 0, [`flags.${F}.evadeMove`]: 0, ...unset(`flags.${F}.charge`), ...unset(`flags.${F}.ignoreTerrain`), ...unset(`flags.${F}.passEnemies`), ...unset(`flags.${F}.noFarther`) });
  clearRange();
  if (hadStow) promptStowAfter(c).catch(e => console.warn("twod12 | stow after Evade", e));
  // v0.0.219 (Lucas): giving up a Charge before it moves takes it back: its AP are refunded.
  if (charging) {
    const back = num(charging.refund);
    if (back > 0) await setAP(c, getAP(c) + back, "Charge given up", { quiet: true });
    // v0.0.221 (Lucas: still greyed): the use is taken back on the actor it was used from (an NPC's sheet opened from the sidebar is not its token's
    // actor) and on the combatant's actor.
    try {
      const { unmarkUsed } = await import("./usage.mjs");
      let from = null; try { from = charging.actorUuid ? await fromUuid(charging.actorUuid) : null; } catch (e) { /* gone */ }
      for (const a of new Set([from, c.actor].filter(Boolean))) { const it = charging.itemId ? a.items?.get(charging.itemId) : null; if (it) await unmarkUsed(a, it); }
    } catch (e) { console.warn("twod12 | Charge given up: its use", e); }
    try { voidLastAction(c.token?.object ?? c.actor, c.actor?.items?.get(charging.itemId)?.name ?? "Charge", "Charge given up"); } catch (e) { /* no log */ }   // v0.0.223
    // v0.0.343 (Lucas, playtest 4): the Charge's card is deleted for everyone (through the GM when it isn't yours) and one short line says it
    if (charging.messageId) {
      const m = game.messages?.get(charging.messageId);
      try { if (m?.canUserModify?.(game.user, "delete") ?? m?.isOwner) await m.delete(); else if (m) game.socket.emit("system.twod12", { type: "deleteMessage", messageId: m.id }); } catch (e) { console.warn("twod12 | Charge card", e); }
    }
    const { sysLine } = await import("./sysmsg.mjs");
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: c.actor }), content: sysLine("fa-person-running-fast", `<b>${esc(c.name)}</b> gives up Charge.${back > 0 ? ` ${apText(back)} back.` : ""}`, "chargemsg") });
  }
  // v0.0.418 (Lucas, playtest 5, C6): no "ends the movement. N free squares unused." line
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
  if (!ctx?.targets) {   // v0.0.252 (Lucas): a chip clicked by hand goes to the selected tokens, else the targeted, else the card's
    const sel = (canvas.tokens?.controlled ?? []).filter(t => t.actor);
    if (sel.length) return sel;
    if (game.user.targets.size) return [...game.user.targets];
  }
  const list = ctx?.targets ?? f?.targets ?? [];   // v0.0.246: the after-damage chain names the targets itself
  const fromCard = list.map(t => { try { return fromUuidSync(t.uuid)?.object; } catch (e) { return null; } }).filter(Boolean);
  return fromCard.length ? fromCard : [...game.user.targets];
}

function wallBetween(a, b) {
  try {
    const back = CONFIG.Canvas?.polygonBackends?.move;
    if (back?.testCollision) return !!back.testCollision(a, b, { type: "move", mode: "any" });
  } catch (e) { /* fall through */ }
  try { return !!canvas.walls.checkCollision(new foundry.canvas.geometry.Ray(a, b), { type: "move", mode: "any" }); } catch (e) { return false; }
}

/**
 * v0.0.500 (Lucas on v0.0.479: "Foundry allows part of the token to go inside of the walls"): Foundry tests a drag's walls along the token's
 * center only, so a Large token could end with a column of its squares behind a wall. A space (its top-left square c, w x h squares) is in a
 * wall when a wall stands between the space's center and the center of one of its squares. v0.0.502 (Lucas on v0.0.501: "I dont think this is
 * necessary. The alt-drag correction is enough"): only the GM's Alt-drag uses it (a willing drag is no longer checked).
 */
/** The points of a square a space's walls are tested to: its center and its corners, 15% in from its sides. */
function squareProbes(i, j, size) {
  const t = canvas.grid.getTopLeftPoint({ i, j }), k = 0.15 * size, f = size - k;
  return [canvas.grid.getCenterPoint({ i, j }), { x: t.x + k, y: t.y + k }, { x: t.x + f, y: t.y + k }, { x: t.x + k, y: t.y + f }, { x: t.x + f, y: t.y + f }];
}
export function spaceInWall(c, w = 1, h = 1) {
  if (w <= 1 && h <= 1) return false;
  try {
    const size = canvas.grid.size, t = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j }), mid = { x: t.x + (w * size) / 2, y: t.y + (h * size) / 2 };
    // v0.0.501 (Lucas on v0.0.500: "Still ends inside it"): a wall can cut a square without passing between the space's center and the square's
    // center (a rock over the outer part of a column), so each square's inset corners are tested too (15% in from its sides: a wall on the
    // space's edge still lets it stand flush against it)
    for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) for (const p of squareProbes(c.i + di, c.j + dj, size)) if (wallBetween(mid, p)) return true;
  } catch (e) { return false; }
  return false;
}

function gfxLine(g, pts, color, width, alpha = 1) {
  if (pts.length < 2) return;
  if (typeof g.lineStyle === "function") { g.lineStyle(width, color, alpha); g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); }
  else { g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); g.stroke({ width, color, alpha }); }
}

const MOVE_LABEL = { push: "Pushed", pull: "Pulled", slid: "Slid", reposition: "Reposition" };

/**
 * v0.0.335 (Lucas: "Push needs a more detailed HUD like Evade / Advance: the movement, an End forced movement, maybe a link to the book"): the bottom
 * bar of a Forced Movement being chosen, in the Line bar's look: who moves, how far and from whom, the hovered square's result (updated as the
 * pointer moves), the book's rule, and End forced movement (it moves 0: a Forced Movement's value is a maximum). Returns { set(text), close() }.
 */
function forcedBar(mode, target, origin, N, onEnd) {
  if (typeof document === "undefined") return { set() {}, close() {} };
  document.querySelector(".twod12-forcedbar")?.remove();
  const label = mode === "reposition" ? "Repositioned" : MOVE_LABEL[mode];
  const how = { push: `away from <b>${esc(origin.name)}</b>: click the square where it ends`, pull: `toward <b>${esc(origin.name)}</b>: click the square where it ends (its own square: a Collision)`,
    slid: "in any direction: click the squares of its path one by one, then the last one again (Enter)", reposition: "within the area: click its new square" }[mode] ?? "";
  const bar = document.createElement("div");
  bar.className = "twod12-linebar twod12-setupbar twod12-forcedbar";
  bar.innerHTML = `<i class="fa-solid ${mode === "pull" ? "fa-hand-back-fist" : "fa-hand"} lb-ic"></i><span class="lb-text"><b>${esc(target.name)}</b> is ${label} up to ${N} square${N === 1 ? "" : "s"} ${how}. <small>Forced Movement ignores Difficult Terrain and triggers no Reactions; a wall or a creature in the way stops it (a Collision).</small><span class="lb-now"></span></span>`
    + '<button type="button" class="lb-go lb-book"><i class="fa-solid fa-book-open"></i> Rules</button>'
    + (mode === "slid" || mode === "reposition" ? '<button type="button" class="lb-go lb-back"><i class="fa-solid fa-rotate-left"></i> Take back a step</button>' : "")
    + '<button type="button" class="lb-give lb-end">Don\'t move it</button>'
    + `<span class="lb-keys">${mode === "slid" || mode === "reposition" ? "<kbd>Enter</kbd> Move \u00b7 <kbd>Backspace</kbd> Take back \u00b7 " : ""}<kbd>Esc</kbd> Don't move it</span>`;   // v0.0.461 (the map notes, f / h)
  // v0.0.404 (Lucas: "Put this in the HUD area as well, that area will become the area for stuff like this"): in the HUD's side panel when a
  // creature's bar is shown (else its middle), as the pick bar; at the bottom with no HUD
  let hud = null, side = false;
  try { hud = globalThis.__twod12Hud ?? null; } catch (e) { hud = null; }
  const slot = hud?.hudAskSlot?.() ?? null;
  if (slot) { side = !!slot.classList?.contains("hb-ask"); bar.classList.add("in-hud"); bar.classList.toggle("in-side", side); slot.append(bar); hud.hudAsking(true, side); } else document.body.append(bar);
  bar.querySelector(".lb-book").addEventListener("click", ev => { ev.preventDefault(); import("./inline.mjs").then(m => m.openBook({ ref: mode === "pull" ? "Pulled" : mode === "slid" ? "Slid" : mode === "push" ? "Pushed" : "Forced Movement", doc: "Chapter 3, Forced Movement" })).catch(() => {}); });
  bar.querySelector(".lb-end").addEventListener("click", ev => { ev.preventDefault(); onEnd?.(); });
  const now = bar.querySelector(".lb-now");
  return { set: t => { if (now) now.innerHTML = t ? ` <b class="lb-res">${esc(t)}</b>` : ""; }, close: () => { bar.remove(); try { (globalThis.__twod12Hud ?? hud)?.hudAsking?.(false); } catch (e) { /* gone */ } }, onBack: f => bar.querySelector(".lb-back")?.addEventListener("click", ev => { ev.preventDefault(); f(); }) };
}

/**
 * Pure (v0.0.498, Pass 3): map a hovered grid cell to a Push/Pull/Reposition shift node.
 * For 1x1 targets, uses exact top-left offset. For Large+ (2x2, 3x3) targets, measures directional
 * offset from the target's nearest outer edge so hovering any side/diagonal square aims cleanly,
 * with a footprint-coverage fallback for edge cells.
 */
export function pushNodeForCell(map, cells, hovered) {
  if (!map || !cells?.length || !hovered) return null;
  if (cells.length === 1) return map.get(shiftKey({ di: hovered.i - cells[0].i, dj: hovered.j - cells[0].j })) ?? null;
  let minI = Infinity, maxI = -Infinity, minJ = Infinity, maxJ = -Infinity;
  for (const c of cells) {
    if (c.i < minI) minI = c.i;
    if (c.i > maxI) maxI = c.i;
    if (c.j < minJ) minJ = c.j;
    if (c.j > maxJ) maxJ = c.j;
  }
  const di = hovered.i < minI ? hovered.i - minI : hovered.i > maxI ? hovered.i - maxI : 0;
  const dj = hovered.j < minJ ? hovered.j - minJ : hovered.j > maxJ ? hovered.j - maxJ : 0;
  if (di === 0 && dj === 0) return null;
  const direct = map.get(shiftKey({ di, dj }));
  if (direct && direct.steps) return direct;
  const ci = (minI + maxI) / 2, cj = (minJ + maxJ) / 2;
  let best = null, bestDist = Infinity;
  for (const n of map.values()) {
    if (!n.steps) continue;
    if (!cells.some(c => c.i + n.di === hovered.i && c.j + n.dj === hovered.j)) continue;
    const d = Math.hypot(ci + n.di - hovered.i, cj + n.dj - hovered.j);
    if (d < bestDist - 1e-6 || (Math.abs(d - bestDist) <= 1e-6 && n.steps > (best?.steps ?? 0))) { best = n; bestDist = d; }
  }
  return best;
}

/**
 * Pure (v0.0.498, Pass 3): when a Push/Pull hits a wall or creature (not LoE, not Reposition) along a shorter
 * aimed path (e.g. hovering 1 square into an adjacent wall or at map edge), extend the collision budget to full N
 * so unused squares deal full collision damage; open-space short pushes keep their aimed distance.
 */
export function pushCollisionResult(r0, path, N, opts, repo = false) {
  if (!repo && r0?.block && r0.block.type !== "loe" && path.length - 1 < N) return analyzePath(path, N, opts);
  return r0;
}

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
    MK.addOnTop(gfx);
    const prevInteractive = canvas.tokens.interactiveChildren;
    canvas.tokens.interactiveChildren = false;
    let current = null;
    const fbar = forcedBar(mode, target, origin, N, () => done({ ended: true }));   // v0.0.335: the bottom bar
    // v0.0.250 (Lucas): an origin that is not a creature on the map (an area's center) is shown while the Push is chosen: its squares in gold and a diamond on the point
    const ghostOrigin = !canvas.tokens.get(origin.id);
    const originMark = () => {
      if (!ghostOrigin) return;
      fillCells(gfx, oCells, 0xf1c84b, 0.25); outlineCells(gfx, oCells, { color: 0xf1c84b, width: 2 });
      const pts = oCells.map(c => cellCenter(c.i, c.j)), cx = pts.reduce((a, p) => a + p.x, 0) / pts.length, cy = pts.reduce((a, p) => a + p.y, 0) / pts.length, r = canvas.grid.size * 0.22;
      gfxLine(gfx, [{ x: cx, y: cy - r }, { x: cx + r, y: cy }, { x: cx, y: cy + r }, { x: cx - r, y: cy }, { x: cx, y: cy - r }], 0xf1c84b, 4, 0.95);
    };
    // v0.0.461 (the map notes' redesign, f; Lucas: one set of colors for every kind): the squares to click are gold (a choice for you), the
    // origin's pale ring, the path in pale ink with an arrow pointing away (Pushed) or toward (Pulled), red where it stops; the result on a plate
    const plates = new PIXI.Container(); plates.eventMode = "none"; MK.addOnTop(plates);
    const draw = () => {
      gfx.clear();
      for (const k of plates.removeChildren()) k.destroy?.({ children: true });
      originMark();
      // v0.0.468 (Lucas: "Push from large creature looks weird"): no ring around a creature that pushes (its token shows where it comes from); an area's center keeps its mark (originMark)
      fillCells(gfx, covered, MK.GOLD, 0.16);
      outlineCells(gfx, covered, { color: MK.GOLD, width: 2 });
      if (pull) fillCells(gfx, oCells, 0xdd3333, 0.18);   // aiming at the origin's own square: a Collision
      if (!current) return;
      const gs = canvas.grid.size, pts = current.path.map(s => pt(s)), good = pts.slice(0, current.result.done + 1);
      gfxLine(gfx, good, MK.INK, 4, 0.95);
      if (good.length > 1) { const a = good[good.length - 2], z = good[good.length - 1], ang = Math.atan2(z.y - a.y, z.x - a.x), k = gs * 0.2; gfxLine(gfx, [{ x: z.x - k * Math.cos(ang - 0.5), y: z.y - k * Math.sin(ang - 0.5) }, z, { x: z.x - k * Math.cos(ang + 0.5), y: z.y - k * Math.sin(ang + 0.5) }], MK.INK, 4, 0.95); }
      const endSh = current.path[current.result.done] ?? current.path[0], endP = pts[current.result.done] ?? pts[0];
      // Ghost token preview + gold landing border (matching Charge) so Large creatures' exact landing footprint is obvious
      if (current.result.done > 0) {
        const landTl = canvas.grid.getTopLeftPoint({ i: tl.i + endSh.di, j: tl.j + endSh.dj });
        try { const src = target.document?.texture?.src; if (src) { const sp = PIXI.Sprite.from(src); sp.alpha = 0.35; sp.width = w * gs; sp.height = h * gs; sp.position.set(landTl.x, landTl.y); plates.addChildAt(sp, 0); } } catch (e) { /* no picture */ }
        gfx.lineStyle(3, MK.GOLD, 1).drawRect(landTl.x + 2, landTl.y + 2, w * gs - 4, h * gs - 4);
      }
      // v0.0.468: the plate short (the HUD says the rest): "Pushed 2", or the Collision and its damage
      const R = current.result, short = !R.block ? `${repo ? "Repositioned" : MOVE_LABEL[mode]} ${R.done}` : R.block.type === "loe" ? `Stops after ${R.done}: no Line of Effect` : repo ? `Stops after ${R.done}` : `Collision after ${R.done}: ${R.damage.self} Vigor${R.block.type === "creature" ? " each" : ""}`;
      const pl = MK.plate([short], { fs: Math.max(13, Math.round(gs * 0.17)), warn: !!R.block }); pl.position.set(endP.x, endP.y - (h * gs) / 2 - 4); plates.addChild(pl);
      if (current.result.block) {
        const bad = pts.slice(current.result.done, current.result.done + 2);
        gfxLine(gfx, bad, 0xdd3333, 5, 0.95);
        const e = bad[bad.length - 1], r = gs * 0.18;
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
        ? `${r.block.corner ? "Solid corner" : "Wall"}: ${r.unused} unused, ${d.self} Vigor damage (${steps})`
        : `${r.block.token.name}${r.block.corner ? " (between two creatures)" : ""}: ${r.unused} unused, ${d.self} Vigor to each (${steps})`;   // v0.0.461: Vigor (Body was the pool's old name)
    };
    const hover = ev => {
      const p = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage);
      const o = canvas.grid.getOffset(p);
      const node = pushNodeForCell(map, cells, o) ?? (pull ? pullIntoOrigin(cells, oCells, { i: o.i, j: o.j }, N) : null);
      if (!node || !node.steps) { current = null; fbar.set(""); try { canvas.app.view.style.cursor = ""; } catch (e) { /* no view */ } return draw(); }
      const path = repo || node.intoOrigin ? lineShifts(node) : pathTo(map, shiftKey(node));
      const r0 = analyzePath(path, path.length - 1, { wallBetween: wallsOn, creatureAt, cornerAt });
      const result = pushCollisionResult(r0, path, N, { wallBetween: wallsOn, creatureAt, cornerAt }, repo);
      current = { path, result };
      fbar.set(text(result));   // v0.0.461: no pointer tip (the plate and the HUD say it)
      try { canvas.app.view.style.cursor = "pointer"; } catch (e) { /* no view */ }
      draw();
    };
    const done = v => {
      canvas.stage.off("pointermove", hover); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", esc_);
      canvas.tokens.interactiveChildren = prevInteractive;
      try { canvas.app.view.style.cursor = ""; } catch (e) { /* no view */ }
      gfx.destroy(); plates.destroy({ children: true }); fbar.close();
      resolve(v);
    };
    const down = ev => {
      if (ev.button !== 0) return;   // v0.0.343 (Lucas: a right-click by mistake cancelled the Push): only Esc or End forced movement cancel
      hover(ev);
      if (current) done(current);
    };
    const esc_ = ev => { if (ev.key === "Escape") done({ ended: true }); };   // v0.0.461 (choice 5A): Escape is "Don't move it": it moves 0, and the line says so
    canvas.stage.on("pointermove", hover); canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", esc_);
    // v0.0.335: the bottom bar says it (no notification)
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
  // v0.0.464 (Lucas, 2026-11-20: "it should limit by reach, its like you are moving the person"; book, Chapter 3, Reposition): every Reposition
  // stays within the mover's Reach the whole way (it was Relocate's own rule); an origin that isn't a creature on the map (an area) keeps no limit
  if (repo && globalThis.canvas?.tokens?.get?.(origin?.id)) withinReach = true;
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
    const reachOutline = withinReach ? emanationCells(oCells, reach) : [];
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
    MK.addOnTop(gfx);
    const nums = new PIXI.Container(); nums.eventMode = "none"; MK.addOnTop(nums);
    const prevInteractive = canvas.tokens.interactiveChildren;
    canvas.tokens.interactiveChildren = false;
    const pt = sh => { const ps = foot(sh).map(c => cellCenter(c.i, c.j)); return { x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length }; };
    const text = r => {
      const steps = `${path.length - 1} of ${N}`;
      if (!r.block) return `${MOVE_LABEL[mode]} ${r.done} (path ${steps}). Click the last square again or press Enter to move.`;
      if (r.block.type === "loe") return `${origin.name} loses Line of Effect: it stops after ${r.done} (no damage).`;
      const what = r.block.type === "wall" ? (r.block.corner ? "A solid corner" : "A wall") : r.block.token.name;
      return repo ? `${what} is in the way: it stops after ${r.done} (no damage).` : `${what}: Collision after ${r.done}, ${r.unused} unused, ${r.damage.self} Vigor${r.block.type === "creature" ? " to each" : ""}.`;
    };
    const shortPlate = (r, stepsCount) => {
      if (!r.block) return `${repo ? "Reposition" : MOVE_LABEL[mode]} ${r.done}${stepsCount > 0 ? " · Click again / Enter" : ""}`;
      if (r.block.type === "loe") return `Stops after ${r.done}: no Line of Effect`;
      return repo ? `Stops after ${r.done}` : `Collision after ${r.done}: ${r.damage.self} Vigor${r.block.type === "creature" ? " each" : ""}`;
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
      const gs = canvas.grid.size;
      const r = analyze(path), area = reachable();
      // Reposition: faint pale dashed Reach boundary so the limit is visible before hovering invalid squares
      if (reachOutline.length) {
        const rset = new Set(reachOutline.map(x => `${x.i},${x.j}`));
        for (const x of reachOutline) {
          const t = canvas.grid.getTopLeftPoint({ i: x.i, j: x.j });
          if (!rset.has(`${x.i - 1},${x.j}`)) MK.dashLine(gfx, { x: t.x, y: t.y }, { x: t.x + gs, y: t.y }, { color: MK.INK, alpha: 0.45, width: 1.5 });
          if (!rset.has(`${x.i + 1},${x.j}`)) MK.dashLine(gfx, { x: t.x, y: t.y + gs }, { x: t.x + gs, y: t.y + gs }, { color: MK.INK, alpha: 0.45, width: 1.5 });
          if (!rset.has(`${x.i},${x.j - 1}`)) MK.dashLine(gfx, { x: t.x, y: t.y }, { x: t.x, y: t.y + gs }, { color: MK.INK, alpha: 0.45, width: 1.5 });
          if (!rset.has(`${x.i},${x.j + 1}`)) MK.dashLine(gfx, { x: t.x + gs, y: t.y }, { x: t.x + gs, y: t.y + gs }, { color: MK.INK, alpha: 0.45, width: 1.5 });
        }
      }
      // v0.0.461 (the map notes, f): the squares it can go to in gold (a choice), the path in pale ink with its steps numbered, red where it stops
      if (area.length) { fillCells(gfx, area, MK.GOLD, 0.16); outlineCells(gfx, area, { color: MK.GOLD, width: 2 }); }
      fillCells(gfx, path.slice(1).flatMap(foot), MK.INK, 0.12);
      const pts = path.map(pt);
      gfxLine(gfx, pts.slice(0, r.done + 1), MK.INK, 4, 0.95);
      for (const k of nums.removeChildren()) k.destroy?.({ children: true });
      pts.slice(1).forEach((p, k) => { const t = new PIXI.Text(String(k + 1), { fontFamily: MK.FONT, fontSize: Math.max(12, Math.round(gs * 0.2)), fontWeight: "700", fill: MK.INK, stroke: 0x1f1c18, strokeThickness: 3 }); t.anchor?.set?.(0.5, 0.5); t.position.set(p.x, p.y); nums.addChild(t); });
      if (r.block) {
        const bad = pts.slice(r.done, r.done + 2);
        gfxLine(gfx, bad, 0xdd3333, 5, 0.95);
        const e = bad[bad.length - 1], xr = gs * 0.18;
        gfxLine(gfx, [{ x: e.x - xr, y: e.y - xr }, { x: e.x + xr, y: e.y + xr }], 0xdd3333, 6);
        gfxLine(gfx, [{ x: e.x - xr, y: e.y + xr }, { x: e.x + xr, y: e.y - xr }], 0xdd3333, 6);
      }
      const endSh = path[r.done] ?? path[0];
      const showGhost = sh => {
        const landTl = canvas.grid.getTopLeftPoint({ i: tl.i + sh.di, j: tl.j + sh.dj });
        try { const src = target.document?.texture?.src; if (src) { const sp = PIXI.Sprite.from(src); sp.alpha = 0.35; sp.width = w * gs; sp.height = h * gs; sp.position.set(landTl.x, landTl.y); nums.addChildAt(sp, 0); } } catch (e) { /* no picture */ }
        gfx.lineStyle(3, MK.GOLD, 1).drawRect(landTl.x + 2, landTl.y + 2, w * gs - 4, h * gs - 4);
      };
      const fs = Math.max(12, Math.round(gs * 0.16));
      if (hover) {
        const last = path[path.length - 1], sameLast = hover.di === last.di && hover.dj === last.dj && path.length > 1;
        const bad = sameLast ? "" : why(hover);
        fillCells(gfx, foot(hover), bad ? 0xdd3333 : 0xffffff, bad ? 0.25 : 0.3);
        const hp = pt(hover);
        if (sameLast) {
          showGhost(endSh);
          const pl = MK.plate([shortPlate(r, path.length - 1)], { fs, warn: !!r.block });
          pl.position.set(hp.x, hp.y - (h * gs) / 2 - 4); nums.addChild(pl);
        } else if (bad) {
          const pl = MK.plate([bad], { fs, warn: true });
          pl.position.set(hp.x, hp.y - (h * gs) / 2 - 4); nums.addChild(pl);
        } else {
          const rNext = analyze([...path, hover]);
          showGhost(rNext.block ? path[rNext.done] ?? hover : hover);
          if (rNext.block) { const xr = gs * 0.18; gfxLine(gfx, [{ x: hp.x - xr, y: hp.y - xr }, { x: hp.x + xr, y: hp.y + xr }], 0xdd3333, 6); gfxLine(gfx, [{ x: hp.x - xr, y: hp.y + xr }, { x: hp.x + xr, y: hp.y - xr }], 0xdd3333, 6); }
          const pl = MK.plate([rNext.block ? shortPlate(rNext, path.length) : `Step ${path.length} · Click to add`], { fs, warn: !!rNext.block });
          pl.position.set(hp.x, hp.y - (h * gs) / 2 - 4); nums.addChild(pl);
        }
      } else if (path.length > 1) {
        showGhost(endSh);
        const ep = pt(endSh), pl = MK.plate([shortPlate(r, path.length - 1)], { fs, warn: !!r.block });
        pl.position.set(ep.x, ep.y - (h * gs) / 2 - 4); nums.addChild(pl);
      }
      return r;
    };
    const posOf = ev => { const p = ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage); const o = canvas.grid.getOffset(p); return { di: o.i - tl.i, dj: o.j - tl.j }; };
    const showTip = (ev, msg) => { fbar?.set(msg); };   // v0.0.461 (choice 8A): no pointer tip: the HUD's readout says it
    const move = ev => {
      hover = posOf(ev); const r = draw(); const last = path[path.length - 1], sameLast = hover.di === last.di && hover.dj === last.dj && path.length > 1, bad = sameLast ? "" : why(hover);
      try { canvas.app.view.style.cursor = bad ? "not-allowed" : "pointer"; } catch (e) { /* no view */ }
      showTip(ev, sameLast ? text(r) : (bad ? `Not here: ${bad}.` : text(analyze([...path, hover]))));
    };
    const fbar = forcedBar(mode, target, origin, N, () => finish({ ended: true }));   // v0.0.335: the bottom bar
    const finish = v => {
      canvas.stage.off("pointermove", move); canvas.stage.off("pointerdown", down);
      window.removeEventListener("keydown", keys);
      canvas.tokens.interactiveChildren = prevInteractive;
      try { canvas.app.view.style.cursor = ""; } catch (e) { /* no view */ }
      gfx.destroy(); nums.destroy({ children: true }); fbar.close();
      resolve(v);
    };
    const confirm = () => (path.length > 1 ? finish({ path: [...path], result: analyze(path) }) : finish({ ended: true }));
    const takeBack = () => { if (path.length > 1) { path.pop(); draw(); fbar?.set(text(analyze(path))); } };   // v0.0.461 (choice 6A): Backspace and the button
    const down = ev => {
      if (ev.button !== 0) return;   // v0.0.461 (choice 6A): a right-click is Foundry's (it pans the map); Backspace takes a square back
      const sh = posOf(ev), last = path[path.length - 1];
      if (sh.di === last.di && sh.dj === last.dj) return confirm();
      const bad = why(sh);
      if (bad) return fbar?.set(`Not here: ${bad}.`);   // v0.0.461: in the HUD, not a notification
      path.push(sh); move(ev);
    };
    const keys = ev => { if (/input|textarea|select/i.test(ev.target?.tagName ?? "")) return; if (ev.key === "Escape") finish({ ended: true }); else if (ev.key === "Enter") confirm(); else if (ev.key === "Backspace") { ev.preventDefault(); takeBack(); } };   // v0.0.461: Escape is "Don't move it" (5A)
    fbar.onBack?.(takeBack);
    canvas.stage.on("pointermove", move); canvas.stage.on("pointerdown", down);
    window.addEventListener("keydown", keys);
    // v0.0.461: no notification (the HUD's bar and its key line say it)
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
/** Pure (the core rework batch 2; book, Chapter 3, Steadiness, "Below 0"): the value after Steadiness for a movement of this mode: a positive one
 *  reduces it (Forced Movement and Reposition); a negative one adds to a Forced Movement only (never a Reposition) and always applies. */
export const steadyValue = (N, steady, mode = "push") => (num(steady) < 0 ? (mode === "reposition" ? num(N) : num(N) - num(steady)) : reducedValue(N, steady));

/** Pure (v0.0.418, playtest 5, H1): is the Steadiness question asked? Only when the creature moving it is its ally (a willing creature can choose
 *  not to apply it); against an enemy it simply applies. */
export const asksSteadiness = (origin, target) => {
  const d = t => t?.document?.disposition ?? t?.disposition;
  return !!origin && !!target && origin !== target && d(origin) !== undefined && d(origin) !== 0 && d(origin) === d(target);   // v0.0.421: a neutral is nobody's ally
};
async function applySteadiness(target, N, label, origin = null, mode = "push") {
  const st = steadinessOf(target.actor), steady = st.total;   // v0.0.174: with the bonuses of Features, Talents and effects
  if (!steady) return { N, steady: 0, applied: false };
  // the core rework batch 2: a negative Steadiness (Bloodied) adds to a Forced Movement, never to a Reposition, and is never asked
  if (steady < 0) return { N: steadyValue(N, steady, mode), steady, applied: mode !== "reposition" };
  const eff = reducedValue(N, steady);
  if (!asksSteadiness(origin, target)) return { N: eff, steady, applied: true };
  const from = st.parts.length ? ` (${st.base} + ${st.parts.map(p => `${p.name} ${p.bonus >= 0 ? "+" : "\u2212"}${Math.abs(p.bonus)}`).join(", ")})` : "";
  // v0.0.421 (the audit): the moved creature's player chooses (on their own screen, the bottom bar; ccdamage.mjs askOwner), not the mover; no
  // answer in time: it applies (the default)
  const { askOwner } = await import("./ccdamage.mjs");
  const choice = await askOwner(target.actor, `<b>${esc(target.name)}</b> has Steadiness ${steady}${esc(from)}: ${label} ${N} becomes ${label} ${eff}. A willing creature can choose not to apply its Steadiness.`,
    [{ id: "apply", label: `Apply Steadiness (${label} ${eff})` }, { id: "ignore", label: `Don't apply it (${label} ${N})` }]);
  return choice === "ignore" ? { N, steady, applied: false } : { N: eff, steady, applied: true };
}

async function pushOne(origin, target, N0, mode = "push", opts = {}) {
  const label = MOVE_LABEL[mode];
  const st = await applySteadiness(target, N0, label, opts.by?.document ? opts.by : origin, mode), N = st.N;
  const { postFollow } = await import("./followup.mjs");   // v0.0.347 (Step 3): the lines go into the card that moved it (opts.msg)
  // v0.0.404 (Lucas: "just say 'X was Pushed Y by Z', one line, done, and merge with the Action that caused it"): one line into the card (opts.msg)
  const byName = esc((opts.by ?? origin)?.name ?? "");
  if (N <= 0) { await postFollow(opts.msg, "fa-hand", `<b>${esc(target.name)}</b> was not ${mode === "reposition" ? "Repositioned" : label} (Steadiness ${st.steady}).`, { cls: "pushmsg" }); return; }
  const pathTool = mode === "slid" || mode === "reposition";
  const pick = pathTool ? await choosePath(origin, target, N, mode, opts) : await choosePush(origin, target, N, mode);
  // v0.0.461 (choice 5A): Escape or "Don't move it": it moves 0 and the line says so (Escape was silent)
  if (!pick || pick.ended) { await postFollow(opts.msg, "fa-hand", `<b>${esc(target.name)}</b> was ${mode === "reposition" ? "Repositioned" : label} 0 by <b>${byName}</b>.`, { cls: "pushmsg" }); return; }
  const { result } = pick, f = result.final;
  if (pathTool) await moveAlong(target.document, pick.path.slice(0, result.done + 1));   // one movement along the path (v0.0.175)
  else if (f.di || f.dj) await moveToken(target.document, f.dj, f.di);
  // v0.0.247 (Lucas): when the origin is another creature (a Push away from the target), the line names who pushes and whom it is away from
  // the core rework D7 (Lucas, 2026-11-21; book, Chapter 3, Collision, "Stopped at once"): aimed farther but stopped before its first square (a wall or
  // a creature right behind it), it moves 0 squares, takes the Collision for every square, and still counts as moved and as leaving its square
  const stoppedAtOnce = mode !== "reposition" && result.done === 0 && result.block && result.block.type !== "loe";
  if (stoppedAtOnce && target.actor && (game.user.isGM || target.actor.isOwner)) { try { const { endLeaveEffects } = await import("./hooks.mjs"); await endLeaveEffects(target.actor); } catch (e) { console.warn("twod12 | stopped at once", e); } }
  const lines = [stoppedAtOnce ? `<b>${esc(target.name)}</b> was ${label} by <b>${byName}</b> but stopped at once (0 squares; it still counts as moved).` : `<b>${esc(target.name)}</b> was ${mode === "reposition" ? "Repositioned" : label} ${result.done} by <b>${byName}</b>.`];
  if (result.block?.type === "loe") lines.push(`It stops: <b>${esc(origin.name)}</b> would lose Line of Effect to it (no damage).`);
  else if (result.block && mode === "reposition") lines.push(`It stops short: ${result.block.type === "wall" ? (result.block.corner ? "a solid corner" : "a wall") : `<b>${esc(result.block.token.name)}</b>`} is in the way.`);
  else if (result.block) {
    const d = result.damage;
    if (result.block.type === "wall") {
      lines.push(`It hits ${result.block.corner ? "a solid corner" : "a wall"} with ${result.unused} unused: <b>${d.self} Vigor</b> damage.`);
      if (target.actor && d.self) await applyToActor(target.actor, bodyDamage(d.self));
    } else {
      const o = result.block.token;
      lines.push(`It hits <b>${esc(o.name)}</b>${result.block.corner ? " (it can't pass diagonally between two creatures)" : ""} with ${result.unused} unused: both take <b>${d.self} Vigor</b> damage.`);
      if (target.actor && d.self) await applyToActor(target.actor, bodyDamage(d.self));
      if (o.actor && d.other) await applyToActor(o.actor, bodyDamage(d.other));
    }
  }
  await postFollow(opts.msg, "fa-hand", lines.join(" "), { cls: "pushmsg" });
  try { logPush(origin, target, mode === "reposition" ? "Repositioned" : label, result.done, result.block ? (result.block.type === "wall" ? "hits a wall" : result.block.type === "loe" ? "stops" : `hits ${result.block.token?.name ?? "a creature"}`) : ""); } catch (e) { /* no log */ }
}

async function pushFlow(cfg, ctx, mode = "push") {
  if (!canvas.ready || !canvas.grid?.isSquare) return warn(`${MOVE_LABEL[mode]} needs a scene with a square grid.`);
  const actor0 = contextActor(ctx);
  const N = Math.max(1, moveDistance(cfg, actor0) ?? 0);
  const actor = actor0;
  // v0.0.246: from:target: the card's (first) target is the origin of the movement (a Push away from the creature that was hit)
  const origin = (cfg.from === "target" ? targetTokens(ctx)[0] : cfg.from === "area" ? areaOrigin(ctx) : null) ?? tokenOf(actor) ?? canvas.tokens.controlled[0];
  if (!origin) return warn(`Select the token that is the origin of the ${MOVE_LABEL[mode]}.`);
  if (cfg.pick) return pushPicker(cfg, ctx, mode, origin, N);
  const by = cfg.from === "target" || cfg.from === "area" ? tokenOf(actor) : null;
  // v0.0.343 (Lucas: "Target the creature to move first" with the creature targeted): a chip clicked by hand took the selected tokens first, and the
  // selected one is usually the pusher (the origin, left out): then the targeted creatures, then the card's
  let targets = targetTokens(ctx).filter(t => t.id !== origin.id);
  if (!targets.length && !ctx?.targets) targets = [...game.user.targets].filter(t => t.id !== origin.id);
  if (!targets.length && !ctx?.targets) targets = targetTokens({ ...ctx, targets: ctx?.message?.getFlag?.(F, "action")?.targets ?? [] }).filter(t => t.id !== origin.id);
  if (!targets.length) return warn("Target the creature to move first.");
  // Immobilized (v0.0.174): checked before Steadiness. The card says whether the Action rolled (its result, per target) or is a Save Action
  // (then the origin rolls 2d12 + its Modifier once, for every Immobilized creature it would move).
  const f = ctx?.message?.getFlag?.(F, "action") ?? null;
  let saveTotal = null;
  for (const t of targets) {
    if (t.actor?.statuses?.has?.("immobilized")) {
      const dc = heldDc(t.actor), save = !!f?.traits?.includes?.("save");
      if (save && saveTotal === null) {
        const roll = await new Roll(`2d12 + ${num(f.attrVal)}`).evaluate();
        await roll.toMessage({ flavor: `${esc(origin.name)}: ${MOVE_LABEL[mode]} against an Immobilized creature (the Save Action's Modifier)` });
        saveTotal = roll.total;
      }
      const res = f?.results?.find?.(r => r.uuid === (t.document?.uuid ?? t.uuid));
      const out = heldMoveOutcome({ rolls: !!f && (Number.isFinite(f.total) || Number.isFinite(res?.total)), total: res?.total ?? f?.total, save, saveTotal, dc });
      if (!out.moved) { await post(`<b>${esc(t.name)}</b> is Immobilized and isn't moved: ${out.why}.`); continue; }
      await post(`<b>${esc(t.name)}</b> is Immobilized, but ${out.why}: it can be moved.`);
    }
    await pushOne(origin, t, distanceFor(cfg, ctx, t, N), mode, { withinReach: !!cfg.withinReach, by, msg: ctx?.message ?? null });
  }
}

/** v0.0.249: the chip's distance for this creature: its Tier's (t2:1|t3:2 on the chip, read from the damage card's rows) or the chip's. */
function distanceFor(cfg, ctx, token, N) {
  const row = (ctx?.targets ?? []).find(t => { try { return fromUuidSync(t.uuid)?.object?.id === token.id; } catch (e) { return false; } });
  const d = row?.tier ? tierDistance(cfg, row.tier) : null;
  return d ?? N;
}
/** v0.0.249 (Word of Radiance): the placed area's Point of Origin as the origin of a Forced Movement: a stand-in token on the squares around the point (a Burst sits on a corner). */
function areaOrigin(ctx) {
  const p = ctx?.areaPoint ?? ctx?.message?.getFlag?.(F, "action")?.areaPoint ?? ctx?.message?.getFlag?.(F, "dmgCard")?.areaPoint ?? ctx?.message?.getFlag?.(F, "dmgMulti")?.areaPoint;
  if (!p || !canvas?.grid) return null;
  const s = canvas.grid.size, tl = canvas.grid.getTopLeftPoint({ x: p.x - 1, y: p.y - 1 });
  const onCorner = Math.abs(p.x - Math.round(p.x / s) * s) < 2 && Math.abs(p.y - Math.round(p.y / s) * s) < 2;
  return onCorner ? { id: "__area", name: "the area's center", actor: null, document: { id: "__area", x: p.x - s, y: p.y - s, width: 2, height: 2, disposition: 0, flags: {} } }
    : { id: "__area", name: "the area's center", actor: null, document: { id: "__area", x: tl.x, y: tl.y, width: 1, height: 1, disposition: 0, flags: {} } };
}

/**
 * v0.0.246 (cards 1, Smite 3 AP: "the other creatures in the light are Pushed 1, away from the target"): pick:yes lists the creatures the movement
 * can reach (area:N: those in an N Emanation around the card's target, the target left out; else the card's targets) and moves them one at a time:
 * click a name, place it, and the list comes back without it, until Done. from:target makes the card's target the origin (the Push goes away from it).
 */
async function pushPicker(cfg, ctx, mode, origin, N) {
  const label = MOVE_LABEL[mode];
  const cardTargets = targetTokens(ctx);
  const meTok = tokenOf(contextActor(ctx));
  let list = cfg.area > 0 ? tokensInEmanation(cardTargets, cfg.area) : cfg.near > 0 && meTok ? tokensInEmanation([meTok], cfg.near).filter(t => t.document.disposition === meTok.document.disposition) : cardTargets;   // v0.0.254: near:N: the allies within N of you
  const me = tokenOf(contextActor(ctx));
  list = list.filter(t => t.id !== origin.id && (cfg.self || t.id !== me?.id));   // v0.0.248 (Lucas): never yourself, unless self:yes
  if (!list.length) return warn(`${label} ${N}: no creature ${cfg.area > 0 ? `within ${cfg.area} of the target` : "among the targets"} to move.`);
  const moved = [], by = cfg.from === "target" || cfg.from === "area" ? tokenOf(contextActor(ctx)) : null;
  const { pickBar } = await import("./pickbar.mjs");   // v0.0.247 (Lucas): the list is a bar at the bottom, in the Line bar's look, not a Foundry window
  // v0.0.402 (Lucas: "Not even after the last push"): the tokens selected when the push started are selected again when it ends
  const heldIds = (canvas.tokens?.controlled ?? []).map(t => t.id);
  const giveBack = () => { for (const id of heldIds) { const t = canvas.tokens?.get?.(id); if (t && !t.destroyed && !t.controlled) t.control?.({ releaseOthers: false }); } };
  try {
  while (list.length) {
    // v0.0.461 (the map notes, g): one end button ("Done: the rest stay"; Done and Stop did the same); how many are moved
    const pick = await pickBar({ icon: "fa-hand", done: "Done: the rest stay", cancel: false,
      text: `<b>${label} ${N}</b>${by ? ` away from <b>${esc(origin.name)}</b>` : ""}: click a creature (here or its token) to move it.${moved.length ? ` <small>${moved.length} of ${moved.length + list.length} moved: ${moved.map(esc).join(", ")}.</small>` : ""}`,
      options: list.map((t, n) => { const d = distanceFor(cfg, ctx, t, N); return { id: String(n), label: d === N ? t.name : `${t.name} (${label} ${d})`, token: t, img: t.document?.texture?.src || t.actor?.img || "" }; }) });   // v0.0.397: a square with its picture   // v0.0.248: its token on the map can be clicked too; v0.0.249: its own distance by Tier
    if (pick == null || pick === "done") break;
    const t = list[Number(pick)];
    if (!t) break;
    await pushOne(origin, t, distanceFor(cfg, ctx, t, N), mode, { withinReach: !!cfg.withinReach, by, msg: ctx?.message ?? null });
    moved.push(t.name);
    list = list.filter(x => x.id !== t.id);
    giveBack();
  }
  } finally { try { giveBack(); setTimeout(giveBack, 300); } catch (e) { /* gone */ } }
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
/** The combatant whose movement a drag of this token is: the one whose turn it is, or (v0.0.418, playtest 5, G6: Slip Away's Evade 1 wasn't
 *  counted) a creature off its turn that a Reaction gave free squares (an Evade, an Advance). */
export function currentCombatantFor(doc) {
  if (!game.combat?.started) return null;
  const c = game.combat.combatant;
  if (c && c.tokenId === doc.id) return c;
  const off = game.combat.combatants?.find?.(x => x.tokenId === doc.id);
  // v0.0.421 (the audit): only squares a Reaction gave during this very turn (stamped by grantFreeMove); what is left from the creature's own turn
  // doesn't let it move on someone else's
  return off && offTurnFree(off) > 0 && off.getFlag?.(F, "offTurnAt") === turnStamp(game.combat) ? off : null;
}
/** Pure (v0.0.421): the key of the combat's current turn ("round:turn"). */
export const turnStamp = combat => (combat ? `${combat.round}:${combat.turn}` : "");
/** Pure: the free squares a combatant has off its turn (a Reaction's Evade or Advance); it has no Walk of its own then. */
export const offTurnFree = c => num(c?.getFlag?.(F, "evadeMove")) + num(c?.getFlag?.(F, "freeMove"));
const gridUnit = () => canvas.grid?.distance || canvas.scene?.grid?.distance || 1;

/** The straight line of a Charge: from the center of the start square to the center of the end square. */
/** Creatures on another side within a creature's Reach (by its token), for the Weapon Attack (1A) after a Charge. */
export function creaturesInReach(token, reach = 1) {
  const doc = token?.document ?? token;
  return (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc?.id && t.actor && !t.document?.hidden
    && (t.document.disposition ?? 0) !== (doc?.disposition ?? 0) && tokenDistance(token, t) <= reach);
}

/** After a Charge's movement: if no creature is within Reach, its required Weapon Attack (1A) can't be made, so the Charge is disrupted. */
function chargeFollowUp(c, doc, reach, to = null, messageId = "") {
  const token = doc.object ?? canvas.tokens?.get?.(doc.id);
  if (!token) return;
  // v0.0.215 (Lucas, playtest 2: "disrupted" when it wasn't): measured from the Charge's end square, not from where the token is drawn
  // 600 ms later (a long Charge was still moving, so nobody seemed to be within Reach).
  const at = to ? { id: doc.id, document: { id: doc.id, x: to.x, y: to.y, width: doc.width, height: doc.height, elevation: doc.elevation, disposition: doc.disposition } } : token;
  // v0.0.512 (playtest 7: "Charge's Weapon Attack isn't in the HUD's Situational tab"): its Basic Attack (1A) waits there, from the Charge's card
  if (creaturesInReach(at, reach).length) { if (messageId && c.isOwner) c.setFlag(F, "chargeUse", { messageId }).catch(() => {}); return; }
  postCard("Charge", `${esc(c.name)}'s Charge is disrupted`, "No creature within Reach for its Basic Attack (1A). The AP stay spent.", "chargemsg").catch(() => {});
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
  // batch 4: through = the enemies whose spaces it passes (blocked), allies = the allies' and Down creatures' (Difficult Terrain), allyExtra = the steps
  // those cost more, cornerBlock / cornerBy = the diagonals between two enemies (blocked); cornerDT stays 0 (no Difficult Terrain from creatures' corners)
  const out = { through: [], allies: [], endIn: "", extra: 0, allyExtra: 0, dark: 0, solidCorner: false, cornerDT: 0, cornerBlock: 0, cornerBy: [] };
  try {
    const pts = points.filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y));
    if (pts.length < 2) return out;
    const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
    const foot = c => { const s = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) s.push(`${c.i + di},${c.j + dj}`); return s; };
    const cellOf = p => cellAt({ x: p.x + 2, y: p.y + 2 });
    const start = new Set(foot(cellOf(pts[0]))), end = new Set(foot(cellOf(pts.at(-1))));
    const passed = new Set(), steps = [];   // v0.0.460: steps, each step's footprint after it (a Large token's every step counts, not each square once)
    for (let k = 0; k < pts.length - 1; k++) {
      const line = cellLine(cellOf(pts[k]), cellOf(pts[k + 1]));
      for (const c of line) for (const key of foot(c)) if (!start.has(key) && !end.has(key)) passed.add(key);
      for (let n = 1; n < line.length; n++) steps.push(foot(line[n]));
      for (let n = 1; n < line.length; n++) {
        const st = stepCorners(line[n - 1], line[n], { w, h, solidAt: ownSolid(), creatureAt: c => blockerIn(c, doc) });
        if (st.kind === "solid") out.solidCorner = true;
        else if (st.kind === "creatures" && !ignoring) { out.cornerBlock++; for (const t of st.creatures ?? []) if (!out.cornerBy.includes(t.name)) out.cornerBy.push(t.name); }   // batch 4: blocked
      }
    }
    const others = (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc.id && t.actor && !t.document?.hidden);
    const occ = others.map(t => ({ t, cells: new Set(tokenCells(t).map(c => `${c.i},${c.j}`)) }));
    const endT = occ.find(o => [...end].some(k => o.cells.has(k)));
    if (endT) out.endIn = endT.t.name;
    for (const o of occ) {
      let hit = false;
      for (const k of passed) if (o.cells.has(k)) { hit = true; break; }
      if (hit) out[wayKind(o.t, doc) === "block" ? "through" : "allies"].push(o.t.name);   // batch 4: an enemy blocks, an ally or a Down creature is Difficult Terrain
    }
    // Darkness: the squares it enters (the one it ends in too) that its Sight sees as Darkness are Difficult Terrain for it (Dark Sight sees them as Bright).
    const senses = sightSenses(doc.actor), darkCells = new Set();   // v0.0.459: Blinded too
    try {
      for (const key of new Set([...passed, ...[...end].filter(k => !start.has(k))])) {   // the squares it enters: not the ones it starts in
        const [i, j] = key.split(",").map(Number);
        if (seenLight(lightAt(canvas.grid.getCenterPoint({ i, j })), senses) === "dark") darkCells.add(key);
      }
    } catch (e) { darkCells.clear(); console.warn("twod12 | darkness on the path", e); }
    // v0.0.460 (Lucas, checklist v0.0.459, large-difficult: "a 2x2 token moving through a 1x1 token ... should take two movements to completely
    // move around them and this would be 4 squares ... Instead of 2"): a step costs 1 more when the squares the token covers after it hold an
    // unwilling creature's square or Darkness it can't see in (not one it started in): two steps alongside the creature cost 2 more, not 1
    const enemyAll = new Set(); for (const o of occ) if (wayKind(o.t, doc) === "dt") for (const k of o.cells) if (!start.has(k)) enemyAll.add(k);   // batch 4: the Difficult Terrain creatures (allies, Down); an enemy's space blocks
    const isDark = k => darkCells.has(k);
    try { for (const st of steps) for (const k of st) if (!start.has(k) && !darkCells.has(k)) { const [i, j] = k.split(",").map(Number); if (seenLight(lightAt(canvas.grid.getCenterPoint({ i, j })), senses) === "dark") darkCells.add(k); } } catch (e) { /* no light on the path */ }
    const hardSteps = steps.filter(st => st.some(k => !start.has(k) && ((enemyAll.has(k) && !end.has(k)) || isDark(k))));   // ending on a creature is endIn, not a cost (as before)
    out.dark = steps.filter(st => st.some(k => !start.has(k) && isDark(k))).length;
    out.extra = hardSteps.length;   // (Cut Through: the caller ignores it, as before)
    out.allyExtra = steps.filter(st => st.some(k => !start.has(k) && enemyAll.has(k) && !end.has(k)) && !st.some(k => !start.has(k) && isDark(k))).length;   // batch 4: the steps only an ally made cost more
  } catch (e) { console.warn("twod12 | creatures on the path", e); }
  return out;
}

/**
 * The squares of a Charge's straight line (book: "Straight Line"): from the center of the start square to the center of the end square, one square a step.
 * v0.0.214: at a tie (the line passes exactly between two squares) the creature that moves chooses ONE side for the whole line: the side that goes
 * farther before a square that isn't legal; equal, the side its own drag passed through more (via); equal, left. Returns { cells, ties, side }.
 */
export function chargeLine(doc, from, to, via = []) {
  const cellOf = p => cellAt({ x: p.x + 2, y: p.y + 2 });
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
  const a = cellOf(from), b = cellOf(to);
  const raw = straightCells(a, b);
  const prefer = new Set();
  for (let k = 0; k < via.length + 1; k++) { const p = k ? via[k - 1] : from, q = via[k] ?? to; for (const c of cellLine(cellOf(p), cellOf(q))) prefer.add(`${c.i},${c.j}`); }
  const legal = (prev, c) => !chargeSquareProblem(doc, prev, c, w, h);
  const sides = ["left", "right"].map(side => {
    const cells = [{ i: a.i, j: a.j }, ...lineSteps({ x: a.j, y: a.i }, { x: b.j, y: b.i }, side).map(c => ({ i: c.y, j: c.x }))];
    let reach = 1; while (reach < cells.length && legal(cells[reach - 1], cells[reach])) reach++;
    return { side, cells, reach, liked: cells.filter(c => prefer.has(`${c.i},${c.j}`)).length };
  });
  const best = sides.reduce((x, y) => (y.reach > x.reach || (y.reach === x.reach && y.liked > x.liked) ? y : x));
  return { cells: best.cells, ties: raw.filter(c => c.alt).length, side: best.side };
}

/** Why the Charge can't go from square a into square b (the top-left squares of its space): "" when it can. */
function chargeSquareProblem(doc, a, b, w = 1, h = 1) {
  const foot = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) foot.push({ i: b.i + di, j: b.j + dj });
  // the core rework batch 4 (book, Chapter 3): an enemy's space blocks; an ally's or a Down creature's is Difficult Terrain, which a Charge can't cross either
  const other = foot.map(c => creatureIn(c, [doc.id])).find(Boolean);
  if (other) return wayKind(other, doc) === "block" ? `the straight line passes through ${other.name} (an unwilling creature's space blocks movement)` : `the straight line passes through ${other.name} (an ally's or a Down creature's space is Difficult Terrain)`;
  const corner = a ? stepCorners(a, b, { w, h, solidAt: ownSolid(), creatureAt: c => blockerIn(c, doc) }) : { kind: "" };
  if (corner.kind === "solid") return "the straight line cuts a solid corner";
  if (corner.kind === "creatures") return `the straight line passes diagonally between ${corner.creatures.map(t => t.name).join(" and ")} (two enemies corner to corner block it)`;
  try { if (foot.some(c => seenLight(lightAt(cellCenter(c.i, c.j)), sightSenses(doc.actor)) === "dark")) return "the straight line crosses Darkness, which is Difficult Terrain for a creature that can't see in it"; } catch (e) { /* no light to read */ }
  return "";
}


/** Squares of movement between two points (grid units divided by the scene's distance per square). */
function measureSquares(from, to) {
  try {
    const r = canvas.grid.measurePath([{ x: from.x, y: from.y }, { x: to.x, y: to.y }]);
    return num(r.cost || r.distance) / gridUnit();
  } catch (e) { return 0; }
}

/**
 * v0.0.350 (Lucas, playtest 4: "hold Alt while moving and it is Forced Movement, as Codex (Draw Steel) does; moving against something causes a
 * Collision"; GM only): the token goes in a straight line toward the square it was dropped on, any distance, no Reactions, no movement spent,
 * Difficult Terrain ignored; it stops before the first wall or creature and the squares left are a Collision (book: Forced Movement).
 */
export function forcedDragPath(cells, { wallAt, creatureAt }) {
  let done = 0, block = null;
  for (let n = 1; n < cells.length; n++) {
    if (wallAt(cells[n - 1], cells[n])) { block = { type: "wall" }; break; }
    const t = creatureAt(cells[n]);
    if (t) { block = { type: "creature", token: t }; break; }
    done = n;
  }
  const total = cells.length - 1, unused = block ? total - done : 0, k = TWOD12.collision;
  const damage = !block ? { self: 0, other: 0 } : block.type === "wall" ? { self: unused * k.wall, other: 0 } : { self: unused * k.creature, other: unused * k.creature };
  return { done, block, unused, damage, total };
}
/** The Alt-drag's plan: { r (forcedDragPath), cells, end (the top-left point it stops on), w, h }. */
function forcedDragPlan(doc, dest) {
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1)), size = canvas.grid.size;
  const a = cellAt({ x: homePos(doc).x + 2, y: homePos(doc).y + 2 }), b = cellAt({ x: dest.x + 2, y: dest.y + 2 });
  const cells = [a, ...lineSteps({ x: a.j, y: a.i }, { x: b.j, y: b.i }, "left").map(c => ({ i: c.y, j: c.x }))];
  const mid = c => { const t = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j }); return { x: t.x + (w * size) / 2, y: t.y + (h * size) / 2 }; };
  const others = (canvas.tokens?.placeables ?? []).filter(t => t.document?.id !== doc.id && t.actor).map(t => ({ t, set: new Set(tokenCells(t).map(c => `${c.i},${c.j}`)) }));
  const foot = c => { const out = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) out.push(`${c.i + di},${c.j + dj}`); return out; };
  const r = forcedDragPath(cells, { wallAt: (p, q) => wallBetween(mid(p), mid(q)) || spaceInWall(q, w, h), creatureAt: c => others.find(o => foot(c).some(k => o.set.has(k)))?.t ?? null });
  const end = canvas.grid.getTopLeftPoint({ i: cells[r.done].i, j: cells[r.done].j });
  return { r, cells, end, w, h };
}
async function forcedDrag(doc, dest) {
  const { r, end } = forcedDragPlan(doc, dest);
  clearDragPreview();
  if (r.done > 0) await doc.update({ x: end.x, y: end.y }, { twod12Forced: true, animate: true, animation: { movementSpeed: TWOD12.pushSpeed, easing: "easeOutCubic" } });
  const lines = [`<b>${esc(doc.name)}</b> is Force Moved ${r.done} square${r.done === 1 ? "" : "s"} (GM, Alt-drag).`];
  if (r.block?.type === "wall") { lines.push(`It hits a wall with ${r.unused} unused: <b>${r.damage.self} Vigor</b> damage.`); if (doc.actor && r.damage.self) await applyToActor(doc.actor, bodyDamage(r.damage.self)); }
  else if (r.block) { lines.push(`It hits <b>${esc(r.block.token.name)}</b> with ${r.unused} unused: both take <b>${r.damage.self} Vigor</b> damage.`); if (doc.actor && r.damage.self) await applyToActor(doc.actor, bodyDamage(r.damage.self)); if (r.block.token.actor && r.damage.other) await applyToActor(r.block.token.actor, bodyDamage(r.damage.other)); }
  await ChatMessage.create({ content: sysLine("fa-hand", lines.join(" "), "pushmsg") });
}

/**
 * v0.0.351 (Lucas: "show the preview of where the token will stop plus the damage it will take while holding Alt"): while the GM drags a token
 * with Alt held, its path to the drop square is drawn in STYLE-3 (ink path, 35% ghost + gold landing border, red X on collision, dark plate).
 */
let dragGfx = null;
function clearDragPreview() { try { dragGfx?.destroy({ children: true }); } catch (e) { /* gone */ } dragGfx = null; }
function drawDragPreview(preview) {
  const orig = canvas.tokens?.get(preview.document?.id);
  if (!orig) return clearDragPreview();
  const { r, cells, w, h } = forcedDragPlan(orig.document, { x: preview.document.x, y: preview.document.y });
  clearDragPreview();
  dragGfx = new PIXI.Container(); dragGfx.eventMode = "none";
  const g = new PIXI.Graphics(), gs = canvas.grid.size;
  const foot = c => { const out = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) out.push({ i: c.i + di, j: c.j + dj }); return out; };
  const ctr = c => { const t = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j }); return { x: t.x + (w * gs) / 2, y: t.y + (h * gs) / 2 }; };
  // Path squares in subtle pale ink + centerline dots
  if (r.done > 1) fillCells(g, cells.slice(1, r.done).flatMap(foot), MK.INK, 0.14);
  if (r.done > 0) {
    g.lineStyle(4, MK.INK, 0.9);
    for (let k = 0; k <= r.done; k++) { const p = ctr(cells[k]); if (k) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }
    g.lineStyle(0);
    for (let k = 1; k <= r.done; k++) { const p = ctr(cells[k]); g.beginFill(MK.INK, 0.9).drawCircle(p.x, p.y, Math.max(4, gs * 0.06)).endFill(); }
  }
  const at = canvas.grid.getTopLeftPoint({ i: cells[r.done].i, j: cells[r.done].j });
  if (r.done > 0) {
    fillCells(g, foot(cells[r.done]), MK.GOLD, 0.22);
    g.lineStyle(3, MK.GOLD, 1).drawRect(at.x + 2, at.y + 2, w * gs - 4, h * gs - 4);
  }
  if (r.block && cells[r.done + 1]) {
    fillCells(g, foot(cells[r.done + 1]), MK.RED, 0.35);
    const x0 = ctr(cells[r.done + 1]), k = gs * 0.2;
    g.lineStyle(4, MK.RED, 1).moveTo(x0.x - k, x0.y - k).lineTo(x0.x + k, x0.y + k).moveTo(x0.x + k, x0.y - k).lineTo(x0.x - k, x0.y + k);
  }
  dragGfx.addChild(g);
  if (r.done > 0) {
    try {
      const src = orig.document?.texture?.src;
      if (src) { const sp = PIXI.Sprite.from(src); sp.alpha = 0.35; sp.width = w * gs; sp.height = h * gs; sp.position.set(at.x, at.y); dragGfx.addChild(sp); }
    } catch (e) { /* no picture */ }
  }
  const txt = `Forced: ${r.done} sq.${r.block ? ` · hits ${r.block.type === "wall" ? "a wall" : r.block.token?.name ?? "a creature"}: ${r.damage.self} Vigor${r.block.type === "creature" ? " each" : ""}` : ""}`;
  const pl = MK.plate([txt], { fs: Math.max(13, Math.round(gs * 0.19)), warn: !!r.block });
  pl.position.set(at.x + (w * gs) / 2, at.y - 6);
  dragGfx.addChild(pl);
  MK.addOnTop(dragGfx, 9000);
}

/** Pure check: given an origin token's threat profile and distance to target, does it still threaten? */
export const stillThreatens = (profile, dist, originDown = false) => !originDown && (profile?.max ?? 0) > 0 && dist >= (profile?.min ?? 1) && dist <= profile.max;

const endingUnthreatened = new Set();
/** Active GM: end any effect flagged endWhenUnthreatened whose origin no longer threatens its bearer (e.g., Pressed that ends if you stop threatening). */
async function checkUnthreatenedEffects(overrides = null, removedIds = null) {
  if (!game.user?.isActiveGM || !canvas?.tokens) return;
  const { threatProfile } = await import("./flanking.mjs");
  const toks = (canvas.tokens.placeables ?? []).filter(t => !removedIds?.has?.(t.document?.id ?? t.id));
  const at = t => {
    const id = t?.document?.id ?? t?.id, ov = id ? overrides?.get?.(id) : null;
    if (!ov) return t;
    const d = t.document ?? t;
    return { document: { x: ov.x ?? d.x, y: ov.y ?? d.y, width: d.width ?? 1, height: d.height ?? 1, elevation: ov.elevation ?? d.elevation ?? 0 } };
  };
  const byActor = new Map();
  for (const t of toks) if (t.actor) { byActor.set(t.actor.uuid, t); if (t.actor.id && !byActor.has(`Actor.${t.actor.id}`)) byActor.set(`Actor.${t.actor.id}`, t); }
  for (const t of toks) {
    const a = t.actor;
    if (!a) continue;
    for (const e of [...(a.effects ?? [])]) {
      if (e.disabled || !e.getFlag?.(F, "endWhenUnthreatened")) continue;
      const origUuid = String(e.origin ?? "");
      if (!origUuid) continue;
      const ot = byActor.get(origUuid) ?? toks.find(x => x.document?.uuid === origUuid) ?? null;
      const oa = ot?.actor ?? null;
      const down = !oa || !!oa.system?.atZero || oa.statuses?.has?.("unconscious") || oa.statuses?.has?.("dead");
      const ok = ot && stillThreatens(threatProfile(oa), tokenDistance(at(ot), at(t)), down);
      if (!ok) {
        const key = e.uuid || `${a.uuid}|${e.id}`;
        if (endingUnthreatened.has(key) || !a.effects?.has?.(e.id)) continue;
        endingUnthreatened.add(key);
        try {
          const ename = String(e.name ?? "Effect"), oname = ot?.name ?? oa?.name ?? "its source";
          await e.delete();
          await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: a }), content: sysLine("fa-shield-halved", `<b>${esc(ename)}</b> ends on <b>${esc(t.name)}</b> (${esc(oname)} no longer threatens it).`, "fxm") });
        } catch (err) {
          if (!/does not exist/i.test(String(err?.message ?? err))) console.warn("twod12 | unthreatened check", err);
        } finally { endingUnthreatened.delete(key); }
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* v0.0.496 (Lucas): Drag-to-Advance range preview & Undo Movement (Ctrl+Z) */
/* ------------------------------------------------------------------ */
let dragRangeId = "";
const clearDragRange = () => { if (!dragRangeId) return; dragRangeId = ""; clearRange(); };

/** Pure (v0.0.496): how many squares a token can move on a drag right now (for the live drag movement-limit preview). */
export function dragRangeSquares(c, combat = globalThis.game?.combat) {
  if (!c || !combat?.started) return { squares: 0, par: 0, kind: "walk" };
  if (c.actor?.statuses?.has?.("immobilized")) return { squares: 0, par: 0, kind: "walk" };
  const ev = num(c.getFlag?.(F, "evadeMove"));
  if (ev > 0) return { squares: ev, par: num(c.getFlag?.(F, "diagPar")) % 2, kind: "evade" };
  const fr = num(c.getFlag?.(F, "freeMove")), ml = num(c.getFlag?.(F, "moveLeft"));
  if (fr + ml > 0) return { squares: Math.round((fr + ml) * 100) / 100, par: 0, kind: "walk" };
  if (combat.combatant?.id !== c.id) return { squares: 0, par: 0, kind: "walk" };
  const walk = num(c.actor?.system?.moveSpeed ?? c.actor?.system?.speed);
  if (getAP(c) >= 1 && walk > 0) return { squares: walk, par: 0, kind: "walk" };
  return { squares: 0, par: 0, kind: "walk" };
}

const moveUndoStack = [];
const undoingTokens = new Set();
const cloneVal = v => { try { return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(v) : JSON.parse(JSON.stringify(v ?? null)); } catch (e) { return v; } };

/** Snapshot a combatant's movement state immediately before chargeMovement mutates it. */
export function snapshotMoveUndo(c, undoCtx, cost) {
  const combat = globalThis.game?.combat;
  return {
    combatId: combat?.id ?? "",
    turnKey: turnStamp(combat),
    tokenId: undoCtx.doc?.id ?? c?.tokenId ?? "",
    tokenUuid: undoCtx.doc?.uuid ?? c?.token?.uuid ?? "",
    combatantId: c?.id ?? "",
    name: c?.name ?? undoCtx.doc?.name ?? "Creature",
    from: { x: Number(undoCtx.from?.x) || 0, y: Number(undoCtx.from?.y) || 0, elevation: Number.isFinite(undoCtx.from?.elevation) ? undoCtx.from.elevation : (undoCtx.doc?.elevation ?? 0) },
    to: { x: Number(undoCtx.to?.x) || 0, y: Number(undoCtx.to?.y) || 0, elevation: Number.isFinite(undoCtx.to?.elevation) ? undoCtx.to.elevation : (undoCtx.doc?.elevation ?? 0) },
    histLen: Number(undoCtx.histLen) || 0,
    movementId: String(undoCtx.movementId ?? ""),
    squares: Math.round((Number(cost) || 0) * 100) / 100,
    spentAp: 0,
    enclogId: "",
    openedBanner: false,
    bannerBefore: moveBar?.c?.id === c?.id ? moveBar.info() : null,
    flags: {
      ap: getAP(c),
      evadeMove: num(c?.getFlag?.(F, "evadeMove")),
      freeMove: num(c?.getFlag?.(F, "freeMove")),
      moveLeft: num(c?.getFlag?.(F, "moveLeft")),
      diagPar: num(c?.getFlag?.(F, "diagPar")),
      advOwn: !!c?.getFlag?.(F, "advOwn"),
      advInteract: !!c?.getFlag?.(F, "advInteract"),
      ignoreTerrain: c?.getFlag?.(F, "ignoreTerrain") ?? null,
      passEnemies: c?.getFlag?.(F, "passEnemies") ?? null,
      noFarther: cloneVal(c?.getFlag?.(F, "noFarther") ?? null)
    },
    turnLog: cloneVal(c?.getFlag?.(F, "turnLog") ?? [])
  };
}

const isUndoCurrent = e => !!e && e.combatId === (globalThis.game?.combat?.id ?? "") && e.turnKey === turnStamp(globalThis.game?.combat);
const pruneMoveUndo = () => { for (let i = moveUndoStack.length - 1; i >= 0; i--) if (!isUndoCurrent(moveUndoStack[i])) moveUndoStack.splice(i, 1); };
export function recordMoveUndo(entry) {
  if (!entry?.tokenId) return;
  pruneMoveUndo();
  moveUndoStack.push(entry);
  if (moveUndoStack.length > 30) moveUndoStack.shift();
  try { freeBar?._refreshUndo?.(); } catch (e) { /* ignore */ }
}
export function clearMoveUndo(tokenId = null) {
  if (!tokenId) moveUndoStack.length = 0;
  else for (let i = moveUndoStack.length - 1; i >= 0; i--) if (moveUndoStack[i].tokenId === tokenId) moveUndoStack.splice(i, 1);
  try { freeBar?._refreshUndo?.(); } catch (e) { /* ignore */ }
}
export function peekMoveUndo(tokenId = null) {
  pruneMoveUndo();
  for (let i = moveUndoStack.length - 1; i >= 0; i--) if (!tokenId || moveUndoStack[i].tokenId === tokenId) return moveUndoStack[i];
  return null;
}
export const canUndoMove = (tokenId = null) => !!peekMoveUndo(tokenId);

function popMoveUndo(tokenId = null) {
  pruneMoveUndo();
  for (let i = moveUndoStack.length - 1; i >= 0; i--) {
    if (!tokenId || moveUndoStack[i].tokenId === tokenId) return moveUndoStack.splice(i, 1)[0];
  }
  return null;
}

/** Pick which token's combat movement Ctrl+Z should undo (selected token, or active combatant if none selected). */
export function pickUndoTokenId() {
  pruneMoveUndo();
  if (!moveUndoStack.length || !globalThis.game?.combat?.started) return "";
  const controlled = (globalThis.canvas?.tokens?.controlled ?? []).filter(t => t?.isOwner || globalThis.game?.user?.isGM);
  if (controlled.length === 1) return canUndoMove(controlled[0].id) ? controlled[0].id : "";
  if (controlled.length > 1) {
    const ids = new Set(controlled.map(t => t.id));
    for (let i = moveUndoStack.length - 1; i >= 0; i--) if (ids.has(moveUndoStack[i].tokenId)) return moveUndoStack[i].tokenId;
    return "";
  }
  const active = globalThis.game.combat.combatant;
  if (active?.tokenId && (active.isOwner || globalThis.game.user?.isGM) && canUndoMove(active.tokenId)) return active.tokenId;
  return "";
}

/**
 * v0.0.496 (Lucas): Undo the last combat movement for `target` (Token, TokenDocument, tokenId, or auto-picked).
 * Reverts both 2d12 movement/AP/banner/range/logs AND Foundry V14's built-in movementHistory/ruler via revertRecordedMovement(movementId).
 */
export async function undoLastMove(target = null, { alreadyMoved = false } = {}) {
  const tokenId = typeof target === "string"
    ? target
    : (target?.document?.id ?? target?.id ?? pickUndoTokenId());
  if (!tokenId) return false;
  const entry = popMoveUndo(tokenId);
  if (!entry) return false;
  const c = globalThis.game?.combat?.combatants?.get?.(entry.combatantId) ?? null;
  const doc = (typeof target === "object" && target ? (target.document ?? (target.x !== undefined ? target : null)) : null)
    ?? globalThis.canvas?.tokens?.get?.(entry.tokenId)?.document
    ?? c?.token
    ?? null;
  if ((doc && !doc.isOwner && !globalThis.game?.user?.isGM) || (c && !c.isOwner && !globalThis.game?.user?.isGM)) return false;

  undoingTokens.add(entry.tokenId);
  try {
    clearDragRange();
    if (!alreadyMoved && doc) {
      mark(keyOf(doc, entry.from.x, entry.from.y));
      let reverted = false;
      const hist = Array.isArray(doc.movementHistory) ? doc.movementHistory : [];
      const lastW = hist.length ? hist[hist.length - 1] : null;
      const moveId = String(lastW?.movementId || entry.movementId || "");
      // v0.0.497 (Lucas): pass the exact movementId to Foundry V14 revertRecordedMovement(movementId) so ONLY this drag is undone
      // directly to entry.from via displace (omitting movementId reverts the entire turn's history back to the start square!).
      if (typeof doc.revertRecordedMovement === "function" && hist.length > entry.histLen && (moveId || entry.histLen === 0)) {
        try {
          const res = await doc.revertRecordedMovement(moveId || undefined);
          const atFrom = Math.hypot((Number(doc.x) || 0) - entry.from.x, (Number(doc.y) || 0) - entry.from.y) <= 2;
          const stillAtTo = Math.hypot((Number(doc.x) || 0) - entry.to.x, (Number(doc.y) || 0) - entry.to.y) <= 2;
          reverted = atFrom || (res === true && stillAtTo);
        } catch (e) { reverted = false; }
      }
      if (!reverted) {
        const pos = { x: entry.from.x, y: entry.from.y, ...(Number.isFinite(entry.from.elevation) ? { elevation: entry.from.elevation } : {}) };
        await doc.update(pos, { twod12Forced: true, twod12Undo: true, animate: false });
        if (entry.histLen === 0 && typeof doc.clearMovementHistory === "function") {
          try { await doc.clearMovementHistory(); } catch (e) { /* ignore */ }
        }
      }
    }

    if (entry.openedBanner && moveBar?.c?.id === c?.id) moveBar.cancel();
    if (c && globalThis.game?.combat?.combatants?.has?.(c.id)) {
      const f = entry.flags;
      const patch = {
        [`flags.${F}.ap`]: f.ap,
        [`flags.${F}.evadeMove`]: f.evadeMove,
        [`flags.${F}.freeMove`]: f.freeMove,
        [`flags.${F}.moveLeft`]: f.moveLeft,
        [`flags.${F}.diagPar`]: f.diagPar,
        [`flags.${F}.advOwn`]: f.advOwn,
        [`flags.${F}.advInteract`]: f.advInteract,
        [`flags.${F}.turnLog`]: entry.turnLog,
        ...(f.ignoreTerrain ? { [`flags.${F}.ignoreTerrain`]: f.ignoreTerrain } : unset(`flags.${F}.ignoreTerrain`)),
        ...(f.noFarther ? { [`flags.${F}.noFarther`]: f.noFarther } : unset(`flags.${F}.noFarther`))
      };
      await c.update(patch);
      if (entry.bannerBefore) {
        if (moveBar?.c?.id === c.id) moveBar.restore(entry.bannerBefore);
        else {
          const bLeft = f.evadeMove + f.freeMove + (entry.bannerBefore.drag ? f.moveLeft : 0);
          if (bLeft > 0) moveBanner(c, entry.bannerBefore.kind, entry.bannerBefore.granted, entry.bannerBefore.name, { drag: entry.bannerBefore.drag, ap: entry.bannerBefore.ap, skipLive: true });
        }
      }
      const rem = f.evadeMove + f.freeMove + f.moveLeft;
      if (rem > 0) showRange(c, rem, entry.from, f.evadeMove > 0 ? (f.diagPar % 2) : 0);
      else clearRange();
    }
    if (entry.enclogId) { try { patchLine(entry.enclogId, { off: true, why: "Undone" }); } catch (e) { /* no log */ } }
    try { freeBar?._refreshUndo?.(); } catch (e) { /* ignore */ }
    const apNote = entry.spentAp > 0 ? `, +${entry.spentAp} AP` : "";
    globalThis.ui?.notifications?.info?.(`Undid ${entry.name}'s movement (${entry.squares} sq${apNote}).`);
    return true;
  } finally {
    undoingTokens.delete(entry.tokenId);
  }
}

/** Synchronous keybinding entry point for Ctrl+Z: returns true ONLY when a 2d12 combat move is undone (otherwise lets Foundry's default Ctrl+Z run). */
export function undoMoveShortcut() {
  const el = globalThis.document?.activeElement;
  if (el && (/^(INPUT|TEXTAREA|SELECT)$/i.test(el.tagName) || el.isContentEditable)) return false;
  if (globalThis.canvas?.activeLayer && globalThis.canvas?.tokens && canvas.activeLayer !== canvas.tokens) return false;
  const tid = pickUndoTokenId();
  if (!tid) return false;
  undoLastMove(tid).catch(e => console.warn("twod12 | undo movement", e));
  return true;
}

export function registerMovement() {
  // v0.0.351: the Alt-drag preview follows the dragged token's preview; it goes when Alt is released or the drag ends
  Hooks.on("refreshToken", token => {
    try {
      if (!game.user.isGM || !canvas?.grid?.isSquare) return;
      if (token.isPreview) { if (game.keyboard?.isModifierActive?.("Alt")) drawDragPreview(token); else clearDragPreview(); }
      else if (dragGfx && !(canvas.tokens?.preview?.children ?? []).length) clearDragPreview();
    } catch (e) { clearDragPreview(); }
  });
  // v0.0.496 (Lucas): dragging a token in combat shows its movement limit on the map (just like clicking Advance), for both GM and players.
  Hooks.on("refreshToken", token => {
    try {
      if (!canvas?.grid?.isSquare || !game.combat?.started) { clearDragRange(); return; }
      if (token.isPreview) {
        if (game.user?.isGM && game.keyboard?.isModifierActive?.("Alt")) { clearDragRange(); return; }
        const orig = token._original?.document ?? canvas.tokens?.get?.(token.id)?.document ?? token.document;
        const c = orig ? currentCombatantFor(orig) : null;
        if (!c || !c.isOwner) { clearDragRange(); return; }
        if (rangeGfx && !dragRangeId) return;
        if (dragRangeId !== orig.id) {
          const info = dragRangeSquares(c, game.combat);
          if (info.squares > 0) { showRange(c, info.squares, homePos(orig), info.par); dragRangeId = orig.id; }
          else clearDragRange();
        }
      } else if (dragRangeId && !(canvas.tokens?.preview?.children ?? []).length) {
        clearDragRange();
      }
    } catch (e) { clearDragRange(); }
  });
  const checkDragRangeGone = () => setTimeout(() => { if (dragRangeId && !(canvas?.tokens?.preview?.children ?? []).length) clearDragRange(); }, 80);
  globalThis.window?.addEventListener?.("pointerup", checkDragRangeGone);
  globalThis.window?.addEventListener?.("keydown", ev => { if (ev.key === "Escape") checkDragRangeGone(); });
  globalThis.window?.addEventListener?.("keyup", ev => { if (ev.key === "Alt") clearDragPreview(); });
  try { installDarknessCost(); } catch (e) { console.warn("twod12 | Darkness cost", e); }   // (this runs when Foundry is ready: the Token class is final)
  // v0.0.350: the GM's Alt-drag is Forced Movement (forcedDrag); Foundry's own move is cancelled
  Hooks.on("preMoveToken", (doc, movement, operation) => {
    try {
      if (!game.user.isGM || operation?.twod12Forced || operation?.twod12Lean || movement?.method === "undo") return;
      if (!game.keyboard?.isModifierActive?.("Alt") || !canvas?.grid?.isSquare || !movement?.destination) return;
      forcedDrag(doc, movement.destination).catch(e => console.warn("twod12 | Alt-drag Forced Movement", e));
      return false;
    } catch (e) { return; }
  });
  // The movement area never outlives its use: it goes when the combat ends, when the scene changes, and (outside combat) when its token moves.
  Hooks.on("combatTurnChange", () => { clearDragRange(); clearMoveUndo(); });
  Hooks.on("deleteCombat", () => { clearLooseMove(); clearMoveUndo(); });
  Hooks.on("canvasReady", () => { clearLooseMove(); clearMoveUndo(); });
  // Foundry V13+/V14: token drags come through moveToken with movement.destination before doc.x/y settle; hook both moveToken and updateToken
  Hooks.on("moveToken", (doc, movement, operation) => {
    if (operation?.twod12Lean) return;
    if (movement?.id && movement?.method !== "undo") {
      const top = peekMoveUndo(doc.id);
      if (top && !top.movementId) top.movementId = String(movement.id);
    }
    const d = movement?.destination;
    const ov = d && Number.isFinite(d.x) && Number.isFinite(d.y) ? new Map([[doc.id, d]]) : null;
    checkUnthreatenedEffects(ov).catch(e => console.warn("twod12 | unthreatened check", e));
  });
  Hooks.on("updateToken", (doc, changes, options) => {
    if (!options?.twod12Lean && looseId && doc.id === looseId && ("x" in changes || "y" in changes)) clearLooseMove();
    if (!options?.twod12Lean && ("x" in changes || "y" in changes || "elevation" in changes)) {
      const ov = new Map([[doc.id, { x: changes.x ?? doc.x, y: changes.y ?? doc.y, elevation: changes.elevation ?? doc.elevation ?? 0 }]]);
      checkUnthreatenedEffects(ov).catch(e => console.warn("twod12 | unthreatened check", e));
    }
  });
  Hooks.on("deleteToken", doc => { checkUnthreatenedEffects(null, new Set([doc.id])).catch(e => console.warn("twod12 | unthreatened check", e)); });
  Hooks.on("createActiveEffect", fx => {
    if (fx?.statuses?.has?.("unconscious") || fx?.statuses?.has?.("dead")) checkUnthreatenedEffects().catch(e => console.warn("twod12 | unthreatened check", e));
  });
  Hooks.on("preMoveToken", (doc, movement, operation) => {
    try {
      if (movement?.method === "undo") {
        // Never let the 300ms preUpdateToken fallback charge an undo as new movement; and if Foundry's own undo triggered it, refund 2d12 state too.
        if (movement?.destination) mark(keyOf(doc, movement.destination.x, movement.destination.y));
        if (!undoingTokens.has(doc.id)) {
          const top = peekMoveUndo(doc.id);
          if (top && movement?.destination && Math.hypot(movement.destination.x - top.from.x, movement.destination.y - top.from.y) <= 2) {
            undoLastMove(doc, { alreadyMoved: true }).catch(e => console.warn("twod12 | undo movement refund", e));
          }
        }
        return;
      }
      if (operation?.twod12Forced || operation?.twod12Lean || operation?.twod12Undo) return;
      // the core rework I2 (Lucas, 2026-11-21: "some, not all"; playtest 7: the Immobilized Ogre Advanced): an Immobilized creature can't move by
      // itself, so its token isn't dragged during a combat, on its turn or not (v0.0.478: v0.0.477 checked only on its turn); Forced Movement and
      // the GM's Alt-drag still move it; Break Free first
      if (game.combat?.started && doc.actor?.statuses?.has?.("immobilized") && game.combat.combatants.some(x => x.tokenId === doc.id)) {
        warn(`${doc.name} is Immobilized and can't move: Break Free (1 AP) first. (Alt-drag moves it as Forced Movement.)`); return false;
      }
      const c = currentCombatantFor(doc);
      if (!c) return;
      const ignoring = !!c.getFlag(F, "ignoreTerrain");   // Cut Through: through creatures, and terrain costs nothing extra
      const passing = ignoring || !!c.getFlag(F, "passEnemies");   // batch 4: Tumble passes enemies' spaces (its Check by hand)
      const to = movement?.destination ?? { x: doc.x, y: doc.y };
      const origin = leanOf(doc) ? homePos(doc) : (movement?.origin ?? { x: doc.x, y: doc.y });   // a Leaning token is nudged: it moves from its own square
      let squares = num(movement?.pending?.cost) || num(movement?.pending?.distance);
      if (ignoring && num(movement?.pending?.distance)) squares = num(movement.pending.distance);
      squares = squares ? squares / gridUnit() : measureSquares(origin, to);
      if (squares <= 0) return;
      // v0.0.323 (PACK EFFECT-SHEET): a Movement limit refuses a willing move that ends nearer to (or farther from) its origin (Forced Movement is not willing)
      for (const l of readMoveLimits(doc)) {   // v0.0.361: read fresh (the cache is for the drag's measuring)
        if (l.how === "difficult") continue;   // v0.0.345: Difficult Terrain instead (hardStep)
        const op = { x: l.token.document.x, y: l.token.document.y };
        if (moveLimitBreaks(l.dir, measureSquares(origin, op), measureSquares(to, op))) { warn(`${l.name}: ${doc.name} can't willingly move ${l.dir === "away" ? "away from" : "closer to"} ${l.token.name}.`); return false; }
      }
      // noFarther: an Evade/move that must end no farther from its target
      const nf = c.getFlag(F, "noFarther");
      if (nf?.targetId && (num(c.getFlag(F, "evadeMove")) > 0 || num(c.getFlag(F, "freeMove")) > 0)) {
        const tgt = canvas.tokens?.get?.(nf.targetId);
        if (tgt) {
          const virt = { document: { x: to.x, y: to.y, width: doc.width, height: doc.height, elevation: doc.elevation ?? 0 } };
          const nextD = Math.round(tokenDistance(virt, tgt));
          if (nextD > Number(nf.maxDist) + 1e-6) { warn(`${doc.name} must end no farther from ${nf.targetName} (${nf.maxDist} sq.; that square is ${nextD} sq. away).`); return false; }
        }
      }
      // Creatures in the way: no move ends inside another creature's space, and an unwilling creature's squares are Difficult Terrain.
      const way = creaturesOnPath(doc, [origin, ...(movement?.pending?.waypoints ?? []), to], { ignoring });
      if (way.endIn) { warn(`You can't end your movement in ${way.endIn}'s space.`); return false; }
      const ch = c.getFlag(F, "charge");
      // Corners: no movement cuts a solid corner (a Charge is judged by its straight line, below).
      if (!ch && way.solidCorner) { warn("You can't cut a solid corner (a wall, a pillar or an object reaches the corner point): go around it."); return false; }
      // the core rework batch 4 (book, Chapter 3, Creatures in your way): an enemy's space and the diagonal between two enemies block your movement;
      // Tumble (or Cut Through, Weave) passes them
      // v0.0.511 (core rework section R, batch 4): each refusal goes to the Encounter Log (moves refused by blocking)
      const blockMode = () => (num(c.getFlag(F, "evadeMove")) > 0 ? "Evade" : ch ? "Charge" : "Advance");
      if (!passing && way.through.length) { warn(`${way.through.join(", ")}'s space blocks your movement (an unwilling creature's space). Tumble to pass through, or go around.`); try { logBlocked(doc, way.through.join(", "), blockMode()); } catch (e) { /* no log */ } return false; }
      if (!passing && way.cornerBlock) { warn(`You can't slip diagonally between ${way.cornerBy.join(" and ")}: two enemies corner to corner block it. Tumble to pass, or go around.`); try { logBlocked(doc, `the diagonal between ${way.cornerBy.join(" and ")}`, blockMode()); } catch (e) { /* no log */ } return false; }
      // Evade can't enter or pass through Difficult Terrain (the path costs more than its length, or crosses Darkness); batch 4: an ally's space is the one
      // Difficult Terrain it can cross (at double cost)
      const dist = num(movement?.pending?.distance), cost = num(movement?.pending?.cost);
      const evading = num(c.getFlag(F, "evadeMove")) > 0;
      if (evading && !ignoring && ((dist > 0 && cost - (way.allyExtra ?? 0) > dist + 1e-6) || way.dark)) {
        warn(`Evade can't enter or pass through Difficult Terrain${way.dark ? " (Darkness: it can't see in it)" : ""}${way.cornerDT ? " (a diagonal between two creatures)" : ""}. Choose another path, or use End movement to give up the Evade.`);
        return false;
      }
      if (ch) {
        // v0.0.218 (Lucas): a Charge is aimed with the picker, not dragged: the drag is refused and the picker opens again.
        warn("Charge: click the destination with the Charge picker (it is open), or give up the Charge.");
        try { if (!chargePick) openChargePicker(c, doc.object); } catch (e) { /* no canvas */ }
        return false;
      }
      // v0.0.183: an Evade over several drags counts its diagonals as one movement: after an odd number, the next diagonal costs 2
      // (Foundry measures each drag from 0). It can't go beyond the Evade's squares.
      let par = 0;
      if (evading && !ch) {
        const p = num(c.getFlag(F, "diagPar")) % 2, d = diagonalsOn([origin, ...(movement?.pending?.waypoints ?? []), to]);
        if (p === 1 && d % 2 === 1) squares += 1;
        const left = num(c.getFlag(F, "evadeMove"));
        if (squares > left + 1e-6) { warn(`Evade has ${left} square${left === 1 ? "" : "s"} left${p === 1 && d % 2 === 1 ? " (this diagonal is the second one: it costs 2)" : ""}. Choose a shorter path, or use End movement.`); return false; }
        par = (p + d) % 2;
      }
      // An Advance through an unwilling creature's squares pays for Difficult Terrain (unless Foundry already counted it).
      if (!ch && !evading && !ignoring) squares += extraCost(way, cost > dist + 1e-6);   // v0.0.468: a Large token's too, through Foundry's cost (hardStep reads how its steps come)
      // v0.0.418 (G6): off its turn a creature moves only the squares a Reaction gave it (no AP spent for more)
      if (game.combat?.combatant?.id !== c.id && squares > offTurnFree(c) + 1e-6) { warn(`${c.name} has ${offTurnFree(c)} free square${offTurnFree(c) === 1 ? "" : "s"} left (it isn't its turn). Choose a shorter path, or use End movement.`); return false; }
      mark(keyOf(doc, to.x, to.y));
      const undoCtx = { doc, from: { x: origin.x, y: origin.y, elevation: doc.elevation ?? 0 }, to: { x: to.x, y: to.y, elevation: to.elevation ?? doc.elevation ?? 0 }, histLen: Array.isArray(doc.movementHistory) ? doc.movementHistory.length : 0, movementId: movement?.id ?? "" };
      chargeMovement(c, squares, to, { par, undoCtx }).catch(e => console.error("twod12 | could not charge movement", e));
    } catch (e) { console.error("twod12 | movement tracking failed", e); }
  });
  // Fallback when preMoveToken does not report the move: the plain update of the position.
  Hooks.on("preUpdateToken", (doc, changes, options, userId) => {
    try {
      if (userId !== game.user.id || options?.twod12Forced || options?.twod12Lean || options?.twod12Undo || undoingTokens.has(doc.id) || !("x" in changes || "y" in changes)) return;
      const c = currentCombatantFor(doc);
      if (!c) return;
      const from = homePos(doc), to = { x: changes.x ?? doc.x, y: changes.y ?? doc.y };
      if (from.x === to.x && from.y === to.y) return;
      const k = keyOf(doc, to.x, to.y);
      const histLen = Array.isArray(doc.movementHistory) ? doc.movementHistory.length : 0;
      setTimeout(() => {
        if (seen(k) || undoingTokens.has(doc.id)) return;
        const squares = measureSquares(from, to);
        if (squares <= 0) return;
        mark(k);
        const undoCtx = { doc, from: { x: from.x, y: from.y, elevation: doc.elevation ?? 0 }, to: { x: to.x, y: to.y, elevation: changes.elevation ?? doc.elevation ?? 0 }, histLen };
        chargeMovement(c, squares, to, { undoCtx }).catch(e => console.error("twod12 | could not charge movement", e));
      }, 300);
    } catch (e) { console.error("twod12 | movement tracking failed", e); }
  });
  game.socket.on(SOCKET, async data => {
    if (data?.type === "reloadWeapon" && game.user.isActiveGM) { const w = await fromUuid(data.uuid); if (w) await w.update({ "system.unloaded": false }); return; }   // v0.0.221: an ally's weapon
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
export function clearRange() { dragRangeId = ""; try { rangeGfx?.destroy(); } catch (e) { /* already gone */ } rangeGfx = null; }

const NEIGH = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
/** The diagonal steps of a path of positions (token top-left points): each leg moves min(|di|, |dj|) squares diagonally (v0.0.183). */
export function diagonalsOn(points, offsetOf = p => canvas.grid.getOffset(p)) {
  let d = 0;
  for (let k = 1; k < points.length; k++) { const a = offsetOf(points[k - 1]), b = offsetOf(points[k]); d += Math.min(Math.abs(b.i - a.i), Math.abs(b.j - a.j)); }
  return d;
}

/** Squares within N of the token (every second diagonal costs 2), not through walls. */
export function reachableCells(cells, n, blocked = () => false, par0 = 0, enterCost = () => 0) {
  const best = new Map(), key = (i, j) => `${i},${j}`;
  const queue = [];
  for (const c of cells) { best.set(`${key(c.i, c.j)}|${par0}`, 0); queue.push({ i: c.i, j: c.j, cost: 0, par: par0 ? 1 : 0 }); }   // par0 1: the next diagonal costs 2 (v0.0.183)
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
      // v0.0.224 (Lucas: the area ignored Darkness): entering a square can cost more (Difficult Terrain: +1) or be impossible (Infinity: an Evade).
      const more = enterCost({ i: ni, j: nj }), tc = nc + (Number.isFinite(more) ? more : Infinity);
      if (tc > n) continue;
      const nk = `${key(ni, nj)}|${diag ? 1 - cur.par : cur.par}`;
      if (seen.has(nk) && seen.get(nk) <= tc) continue;
      queue.push({ i: ni, j: nj, cost: tc, par: diag ? 1 - cur.par : cur.par });
    }
  }
  const out = new Map();
  for (const k of seen.keys()) { const [ij] = k.split("|"); const [i, j] = ij.split(",").map(Number); out.set(ij, { i, j }); }
  return [...out.values()];
}

/** Draw the area around the combatant's token (or around a position it is about to be at). */
export function showRange(c, squares, dest = null, par = 0) {
  clearRange();
  try {
    const tok = c.token?.object;
    if (!tok || !canvas.grid?.isSquare || squares <= 0) return;
    const w = Math.max(1, Math.round(tok.document.width)), h = Math.max(1, Math.round(tok.document.height));
    const hp = homePos(tok.document), o = canvas.grid.getOffset({ x: dest?.x ?? hp.x, y: dest?.y ?? hp.y });
    const cells = [];
    for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) cells.push({ i: o.i + i, j: o.j + j });
    const pt = ({ i, j }) => cellCenter(i, j);
    // v0.0.224: Difficult Terrain for this creature (Darkness it can't see in, a Difficult Terrain area, an unwilling creature's space): an Advance
    // pays 1 more to enter it, an Evade can't enter it (unless it ignores terrain, Cut Through).
    const evading = num(c.getFlag?.(F, "evadeMove")) > 0 || c.kind === "evade", ignoring = !!c.getFlag?.(F, "ignoreTerrain");
    const passing = ignoring || !!c.getFlag?.(F, "passEnemies");   // batch 4: Tumble passes enemies' spaces
    const senses = sightSenses(tok.actor), memo = new Map();
    // the core rework batch 4: a creature's square: an enemy's blocks (unless it passes), an ally's or a Down creature's is Difficult Terrain (an Evade can cross it)
    const whoAt = cell => { const o2 = creatureIn(cell, [tok.id]); return o2 ? wayKind(o2, tok.document) : ""; };
    let regions = [];
    try { regions = (canvas.regions?.placeables ?? []).filter(r => r.document.behaviors?.some(x => ["difficultTerrain", "modifyMovementCost"].includes(x.type) && !x.disabled)); } catch (e) { /* none */ }
    const own = new Set(cells.map(x => `${x.i},${x.j}`));
    const limits = readMoveLimits(tok.document).map(l => ({ ...l, d0: limitSquares(o, l.token) }));
    const cantLimits = limits.filter(l => l.how !== "difficult");
    const diffLimits = limits.filter(l => l.how === "difficult");
    const cantCell = cell => cantLimits.some(l => moveLimitBreaks(l.dir, l.d0, limitSquares(cell, l.token)));
    const difficult = cell => {
      const k = `${cell.i},${cell.j}`;
      if (memo.has(k)) return memo.get(k);
      let d = false;
      try {
        const p = pt(cell);
        d = seenLight(lightAt(p), senses) === "dark" || regions.some(r => regionHasPoint(r.document, p, tok.document.elevation ?? 0))
          || areaDifficult(tok.document, [cell])
          || diffLimits.some(l => moveLimitBreaks(l.dir, l.d0, limitSquares(cell, l.token)));
      } catch (e) { d = false; }
      memo.set(k, d);
      return d;
    };
    const enterCost = cell => (ignoring ? 0 : difficult(cell) ? (evading ? Infinity : 1) : (!own.has(`${cell.i},${cell.j}`) && whoAt(cell) === "dt" ? 1 : 0));
    const betweenTwo = (a, b) => a.i !== b.i && a.j !== b.j && whoAt({ i: a.i, j: b.j }) === "block" && whoAt({ i: b.i, j: a.j }) === "block";   // batch 4: two enemies corner to corner
    const blocked = (a, b) => wallBetween(pt(a), pt(b)) || (!own.has(`${b.i},${b.j}`) && (cantCell(b) || (!passing && (whoAt(b) === "block" || betweenTwo(a, b)))));
    const area = reachableCells(cells, squares, blocked, par, enterCost);
    rangeGfx = new PIXI.Graphics();
    (canvas.interface ?? canvas.stage).addChild(rangeGfx);   // the movement area stays under the tokens (a large pale area)
    // v0.0.461 (the map notes' redesign, b and c): where it can stop in pale ink (blue had no meaning); an Evade's edge dashed (only an Evade is);
    // its Difficult Terrain hatched: inside an Advance's area (it costs 1 more), and for an Evade (or Movement limit), adjacent blocked squares in red
    fillCells(rangeGfx, area, MK.INK, 0.08);
    const set = new Set(area.map(x => `${x.i},${x.j}`)), gs = canvas.grid.size, segs = [];
    for (const x of area) { const t = canvas.grid.getTopLeftPoint({ i: x.i, j: x.j });
      if (!set.has(`${x.i - 1},${x.j}`)) segs.push([t.x, t.y, t.x + gs, t.y]); if (!set.has(`${x.i + 1},${x.j}`)) segs.push([t.x, t.y + gs, t.x + gs, t.y + gs]);
      if (!set.has(`${x.i},${x.j - 1}`)) segs.push([t.x, t.y, t.x, t.y + gs]); if (!set.has(`${x.i},${x.j + 1}`)) segs.push([t.x + gs, t.y, t.x + gs, t.y + gs]); }
    for (const [x0, y0, x1, y1] of segs) { if (evading) MK.dashLine(rangeGfx, { x: x0, y: y0 }, { x: x1, y: y1 }, { color: MK.INK, alpha: 0.85, width: 2 }); else { rangeGfx.lineStyle(2, MK.INK, 0.75); rangeGfx.moveTo(x0, y0); rangeGfx.lineTo(x1, y1); } }
    const hatch = (cell, color, alpha) => { const t = canvas.grid.getTopLeftPoint({ i: cell.i, j: cell.j }), n = 4; rangeGfx.lineStyle(1.5, color, alpha); for (let k = 1; k <= n * 2 - 1; k++) { const d = (k / (n * 2)) * 2 * gs; const ax = t.x + Math.max(0, d - gs), ay = t.y + Math.min(d, gs), bx = t.x + Math.min(d, gs), by = t.y + Math.max(0, d - gs); rangeGfx.moveTo(ax, ay); rangeGfx.lineTo(bx, by); } };
    const nearBlocked = () => {
      const near = new Set();
      for (const x of area) for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const k = `${x.i + di},${x.j + dj}`; if (!set.has(k) && !own.has(k)) near.add(k); }
      return near;
    };
    if (!ignoring) {
      if (!evading) { for (const x of area) if (!own.has(`${x.i},${x.j}`) && difficult(x)) hatch(x, MK.INK, 0.35); }
      else { for (const k of nearBlocked()) { const [i, j] = k.split(",").map(Number); if (difficult({ i, j })) hatch({ i, j }, MK.RED, 0.55); } }
    }
    if (cantLimits.length) {
      for (const k of nearBlocked()) { const [i, j] = k.split(",").map(Number); if (cantCell({ i, j })) hatch({ i, j }, MK.RED, 0.55); }
    }
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

/* ------------------------------------------------------------------ */
/* v0.0.218 (Lucas): the Charge picker. Charge is Straight Line movement, so it is aimed like a Line: from the creature's square to the     */
/* square clicked (the destination), with the Line's squares and one tie side; it moves the token there itself (no dragging).            */

/** The Charge's squares from cell a to cell b (top-left cells of the space), side: { cells (a first), ties, bad (first illegal index or -1), problem, sq }. */
export function chargePath(doc, a, b, side = "left") {
  const w = Math.max(1, Math.round(doc.width ?? 1)), h = Math.max(1, Math.round(doc.height ?? 1));
  const steps = lineSteps({ x: a.j, y: a.i }, { x: b.j, y: b.i }, side);
  const cells = [{ i: a.i, j: a.j }, ...steps.map(c => ({ i: c.y, j: c.x }))];
  const size = canvas.grid.size, mid = c => { const t = canvas.grid.getTopLeftPoint({ i: c.i, j: c.j }); return { x: t.x + (w * size) / 2, y: t.y + (h * size) / 2 }; };
  let regions = [];
  try { regions = (canvas.regions?.placeables ?? []).filter(r => r.document.behaviors?.some(x => ["difficultTerrain", "modifyMovementCost"].includes(x.type) && !x.disabled)); } catch (e) { /* no regions */ }
  const foot = c => { const out = []; for (let di = 0; di < h; di++) for (let dj = 0; dj < w; dj++) out.push({ i: c.i + di, j: c.j + dj }); return out; };
  let bad = -1, problem = "";
  for (let n = 1; n < cells.length && bad < 0; n++) {
    const prev = cells[n - 1], cur = cells[n];
    let p = wallBetween(mid(prev), mid(cur)) ? "a wall is in the way" : chargeSquareProblem(doc, prev, cur, w, h);
    if (!p && regions.some(r => foot(cur).some(f => regionHasPoint(r.document, cellCenter(f.i, f.j), doc.elevation ?? 0)))) p = "Difficult Terrain";
    if (p) { bad = n; problem = p; }
  }
  const tl = c => canvas.grid.getTopLeftPoint({ i: c.i, j: c.j });
  return { cells, ties: steps.filter(s => s.tie).length, bad, problem, sq: measureSquares(tl(a), tl(b)), tl };
}

let chargePick = null;
/** Opens the picker for a combatant that has a Charge to make (its "charge" flag: { min, max }). */
export function openChargePicker(c, token) {
  const doc = token?.document ?? token;
  const ch = c?.getFlag?.(F, "charge");
  if (!doc || !ch || !canvas?.ready) return false;
  if (chargePick) chargePick.close(false);
  const gfx = new PIXI.Graphics();
  MK.addOnTop(gfx);
  const prevInteractive = canvas.tokens.interactiveChildren;
  canvas.tokens.interactiveChildren = false;
  const a = cellAt({ x: homePos(doc).x + 2, y: homePos(doc).y + 2 });
  const reach = Math.max(1, num(c.actor?.system?.reach) || 1);
  // v0.0.219 (Lucas): the limit is outlined (every square within its maximum, counted from your space), so nobody has to guess how far it goes.
  const limit = emanationCells(tokenCells(doc), Math.max(0, Math.floor(num(ch.max))));
  let side = "left", pos = null, cur = null;
  const bar = document.createElement("div");
  bar.className = "twod12-linebar twod12-chargebar";
  // v0.0.461 (the map notes' redesign, e): before a target the bar lists the enemies it can Charge as pictures (as the map marks them); with one,
  // the two real choices; a last line names the keys. Give up says what it gives back.
  const back = Math.max(0, num(ch.refund));
  bar.innerHTML = `<i class="fa-solid fa-person-running-fast lb-ic"></i><span class="lb-text"></span><span class="lb-opts lb-cands"></span><span class="lb-side"><span class="lb-lbl">Ties</span><button type="button" data-side="left">Left</button><button type="button" data-side="right">Right</button><kbd>Tab</kbd></span><button type="button" class="lb-go">Charge</button><button type="button" class="lb-give">Give up${back ? ` \u00b7 ${back} AP back` : ""}</button><span class="lb-keys"></span>`;
  // v0.0.453 (Lucas, playtest 6: "Charge should show in the situational section of the hud"): it asks there, as End movement and a Setup do
  let hud = globalThis.__twod12Hud ?? null, slot = hud?.hudAskSlot?.() ?? null;
  const inSide = !!slot?.classList?.contains("hb-ask");
  if (slot) { bar.classList.add("in-hud"); bar.classList.toggle("in-side", inSide); slot.append(bar); hud.hudAsking(true, inSide); } else document.body.append(bar);
  // v0.0.512 (playtest 7: "Charge, then deselecting and reselecting the token, loses the HUD"): the bar follows the HUD's redraw, as the pick bar
  // does (pickbar.mjs place, v0.0.473): a new selection puts it back in the HUD's ask slot
  const placeBar = (n = 0) => {
    if (!bar.isConnected && chargePick?.bar !== bar) return;
    const h = globalThis.__twod12Hud ?? null, sl = h?.hudAskSlot?.() ?? null, sideNow = !!sl?.classList?.contains("hb-ask");
    if (sl && sl.contains(bar)) return;
    if (!sl) { if (n < 6) return setTimeout(() => placeBar(n + 1), 250); if (!bar.isConnected) { bar.classList.remove("in-hud", "in-side"); document.body.append(bar); } return; }
    if (!sideNow && n < 6) return setTimeout(() => placeBar(n + 1), 250);
    if (slot && hud && slot !== sl) { try { hud.hudAsking(false); } catch (e) { /* gone */ } }
    hud = h; slot = sl;
    bar.classList.add("in-hud"); bar.classList.toggle("in-side", sideNow); sl.append(bar); h.hudAsking(true, sideNow);
  };
  let dockHook = null;
  try { dockHook = Hooks.on("controlToken", () => setTimeout(() => placeBar(0), 150)); } catch (e) { dockHook = null; }
  // v0.0.461 (e, choices 3A and 4A): a Charge always picks an enemy first (the book's Charge); only the Charge button, Enter or a click on the target confirms
  const text = () => {
    if (!target) return `<b>Pick the enemy to Charge</b>, on the map or here. You run straight at it (at least ${ch.min}, up to ${ch.max} squares), then make a Basic Attack (1A).${cands.filter(x => !x.ok).length ? ` <span class="lb-tag">${cands.filter(x => !x.ok).map(x => `${esc(x.t.name)}: ${esc(x.why)}`).join(" \u00b7 ")}</span>` : ""}`;
    const r = cur?.path; if (!r) return "";
    const who = cur.inReach.some(t => t.id === target.id);
    if (cur.tooFar) return `<b>Charge \u2192 ${esc(target.name)}</b> <span class="lb-tag">too far</span> A Charge goes up to ${ch.max} squares: you stop after ${cur.stopSq}, out of Reach, and the Charge is disrupted.`;
    if (r.bad < 0 && r.sq + 1e-6 < ch.min) return `<b>Charge \u2192 ${esc(target.name)}</b> <span class="lb-tag">too close</span> A Charge moves at least ${ch.min} squares (in Reach after ${r.sq}). Pick another enemy, or give up.`;
    if (r.bad >= 0) return `<b>Charge \u2192 ${esc(target.name)}</b> <span class="lb-tag">blocked</span> <span class="lb-warn">${esc(r.problem[0].toUpperCase() + r.problem.slice(1))}.</span> You stop after ${cur.stopSq} squares${who ? `, ${esc(target.name)} in Reach` : `, out of Reach: the Charge is disrupted (its AP stay spent)`}.`;
    return `<b>Charge \u2192 ${esc(target.name)}</b> <span class="lb-tag">${r.sq} squares</span> In Reach at the end. Then: Basic Attack (1A). Another enemy: click it.`;
  };
  // v0.0.224 (Lucas, playtest 3): with a target, the line goes toward it (to the square of its space nearest to you) and stops on the first
  // square from which it is within Reach; the mouse only confirms. A blocked line stops earlier (a second click confirms it).
  let target = ch.targetId ? canvas.tokens?.get?.(ch.targetId) : null;   // v0.0.453 (playtest 6): a click on another creature changes it
  // v0.0.453 (Lucas, playtest 6: "Charge is allowing to end movement on an ally's space"): no movement ends in another creature's space, so the
  // Charge stops on the last free square before it (its path is cut there)
  const footOf = cell => { const out = []; for (let di = 0; di < Math.max(1, Math.round(doc.height)); di++) for (let dj = 0; dj < Math.max(1, Math.round(doc.width)); dj++) out.push(`${cell.i + di},${cell.j + dj}`); return out; };
  const taken = () => { const set = new Set(); for (const t of canvas.tokens?.placeables ?? []) { if (t.id === doc.id || t.document?.hidden) continue; for (const x of tokenCells(t)) set.add(`${x.i},${x.j}`); } return set; };
  const freeBack = (cells, idx) => { const occ = taken(); let n = idx; while (n > 0 && footOf(cells[n]).some(k => occ.has(k))) n--; return n; };
  const tokenAtPoint = p => (canvas.tokens?.placeables ?? []).find(t => t.id !== doc.id && !t.document?.hidden && t.visible !== false && Number(t.document?.disposition) !== Number(doc.disposition) && t.bounds?.contains?.(p.x, p.y)) ?? null;   // a creature of another side
  const tl0 = cell => canvas.grid.getTopLeftPoint({ i: cell.i, j: cell.j });
  const virtAt = cell => { const t = tl0(cell); return { id: doc.id, document: { id: doc.id, x: t.x, y: t.y, width: doc.width, height: doc.height, elevation: doc.elevation, disposition: doc.disposition } }; };
  const computeTarget = () => {
    const tc = tokenCells(target).reduce((best, x) => { const d = Math.max(Math.abs(x.i - a.i), Math.abs(x.j - a.j)); return !best || d < best.d ? { ...x, d } : best; }, null);
    const full = chargePath(doc, a, { i: tc.i, j: tc.j }, side);
    let reachAt = -1;
    for (let n = 1; n < full.cells.length; n++) { if (tokenDistance(virtAt(full.cells[n]), target) <= reach) { reachAt = n; break; } }
    const blockedFirst = full.bad >= 0 && (reachAt < 0 || full.bad <= reachAt);
    let end = blockedFirst ? full.bad : (reachAt >= 0 ? reachAt : full.cells.length - 1), tooFar = false;
    // Beyond its maximum (Speed): it goes as far as it can and the target is not in Reach (disrupted).
    const lim = blockedFirst ? end - 1 : end;
    if (measureSquares(tl0(a), tl0(full.cells[lim])) > ch.max + 1e-6) { let n = lim; while (n > 0 && measureSquares(tl0(a), tl0(full.cells[n])) > ch.max + 1e-6) n--; end = n; tooFar = true; }
    const blocked = blockedFirst && !tooFar;
    if (!blocked) { const n = freeBack(full.cells, end); if (n !== end) { end = n; } }
    const cells = full.cells.slice(0, end + 1);
    const stop = blocked ? cells[end - 1] : cells[end], stopTl = tl0(stop), stopSq = measureSquares(tl0(a), stopTl);
    const path = { cells, ties: full.ties, bad: blocked ? end : -1, problem: blocked ? full.problem : "", sq: stopSq, tl: tl0 };
    return { key: `T|${side}|${target.id}`, path, stop, stopTl, stopSq, inReach: creaturesInReach(virtAt(stop), reach), target: true, reachAt, tooFar };
  };
  // v0.0.461 (choice 3A): no destination square any more (compute(p) went): a Charge always has a target
  // v0.0.461 (e): the enemies it can Charge (in Reach after at least min and at most max squares) and the others, with their reason
  const me = doc.object ?? token;
  const cands = (canvas.tokens?.placeables ?? []).filter(t => t.id !== doc.id && t.actor && !t.document?.hidden && t.visible !== false && Number(t.document?.disposition) !== Number(doc.disposition)).map((t, n) => {
    let d = 0; try { d = Math.round(tokenDistance(me, t)); } catch (e) { d = 0; }
    const need = Math.max(0, d - reach);
    return { t, n: n + 1, ok: need >= ch.min && need <= ch.max, why: need < ch.min ? `too close (needs ${ch.min})` : need > ch.max ? `too far (${need})` : "" };
  });
  cands.filter(x => x.ok).forEach((x, k) => { x.n = k + 1; });
  const marks = new PIXI.Container(); marks.eventMode = "none"; MK.addOnTop(marks);
  const gsz = () => canvas.grid?.size ?? 100;
  const boxOf = t => { const cs = tokenCells(t), gs = gsz(), i0 = Math.min(...cs.map(c => c.i)), j0 = Math.min(...cs.map(c => c.j)), i1 = Math.max(...cs.map(c => c.i)), j1 = Math.max(...cs.map(c => c.j)); const w = (j1 - j0 + 1) * gs, h = (i1 - i0 + 1) * gs; return { x: j0 * gs, y: i0 * gs, w, h, c: { x: j0 * gs + w / 2, y: i0 * gs + h / 2 } }; };
  const pickEl = bar.querySelector(".lb-cands");
  const drawCands = () => {
    pickEl.innerHTML = target ? "" : cands.filter(x => x.ok).map(x => `<button type="button" class="lb-opt sq" data-cand="${esc(x.t.id)}" aria-label="${esc(x.t.name)}"><img src="${esc(x.t.document?.texture?.src ?? "")}" alt=""><b class="lb-num">${x.n}</b></button>`).join("");
  };
  pickEl.addEventListener("click", async ev => { const b = ev.target.closest("[data-cand]"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); const t = canvas.tokens?.get?.(b.dataset.cand); if (t) await setTarget(t); });
  const draw = () => {
    gfx.clear();
    for (const ch2 of marks.removeChildren()) ch2.destroy?.({ children: true });
    const gs = gsz(), fs = Math.max(13, Math.round(gs * 0.18));
    // the limit: a faint pale edge (gold is for a choice)
    outlineCells(gfx, limit, { color: MK.INK, width: 2, alpha: 0.7 });   // v0.0.466 (Lucas: "very very faint"): stronger
    bar.querySelector(".lb-text").innerHTML = text();   // v0.0.421 (the audit): no title (the tooltip review)
    drawCands();
    const keys = bar.querySelector(".lb-keys");
    // v0.0.219 (Lucas): the bar keeps one size; the Ties buttons keep their place (hidden, not removed) so Give up never moves.
    const sb = bar.querySelector(".lb-side"), tie = !!cur?.path?.ties;
    sb.hidden = false; sb.style.visibility = tie ? "visible" : "hidden";
    sb.querySelectorAll("button").forEach(x => x.classList.toggle("on", x.dataset.side === side));
    const go = bar.querySelector(".lb-go"), give = bar.querySelector(".lb-give");
    if (!target) {
      for (const x of cands) {
        const b = boxOf(x.t);
        if (x.ok) { fillCells(gfx, tokenCells(x.t), MK.GOLD, 0.22); MK.attentionRing(marks, b.c, Math.max(b.w, b.h) * 0.62); const pin = MK.numberPin(x.n, { fs: Math.max(12, Math.round(gs * 0.16)) }); pin.position.set(b.c.x + Math.max(b.w, b.h) * 0.46, b.c.y - Math.max(b.w, b.h) * 0.46); marks.addChild(pin); }
        else { const pl = MK.plate([x.why], { fs: Math.round(fs * 0.85), color: 0xb3a68e }); pl.position.set(b.c.x, b.y - 4); marks.addChild(pl); }
      }
      go.hidden = true; give.classList.add("fill"); go.classList.remove("fill");
      keys.innerHTML = "<kbd>Esc</kbd> Give up";
      return;
    }
    const tb = boxOf(target);
    MK.attentionRing(marks, tb.c, Math.max(tb.w, tb.h) * 0.62, { hot: true });
    if (!cur) return;
    const r = cur.path, blocked = r.bad >= 0 || cur.tooFar, short = r.bad < 0 && !cur.tooFar && r.sq + 1e-6 < ch.min;
    const ctr = c => { const t = r.tl(c); return { x: t.x + (Math.max(1, Math.round(doc.width)) * gs) / 2, y: t.y + (Math.max(1, Math.round(doc.height)) * gs) / 2 }; };
    const legal = r.bad >= 0 ? r.cells.slice(0, r.bad) : r.cells, illegal = r.bad >= 0 ? r.cells.slice(r.bad) : [];
    // the straight line in pale ink, a dot a square; past the stop, faint red; a red cross where it is blocked
    gfx.lineStyle(5, MK.INK, short ? 0.45 : 1);
    legal.forEach((c, k) => { const p = ctr(c); if (k) gfx.lineTo(p.x, p.y); else gfx.moveTo(p.x, p.y); });
    gfx.lineStyle(0); legal.slice(1).forEach(c => { const p = ctr(c); gfx.beginFill(MK.INK, short ? 0.45 : 1).drawCircle(p.x, p.y, Math.max(4, gs * 0.07)).endFill(); });
    if (illegal.length) {
      gfx.lineStyle(2, MK.RED, 0.45); const p0 = ctr(legal.at(-1) ?? r.cells[0]); gfx.moveTo(p0.x, p0.y); for (const c of illegal) { const p = ctr(c); gfx.lineTo(p.x, p.y); }
      const x0 = ctr(illegal[0]), k = gs * 0.18; gfx.lineStyle(4, MK.RED, 1).moveTo(x0.x - k, x0.y - k).lineTo(x0.x + k, x0.y + k).moveTo(x0.x + k, x0.y - k).lineTo(x0.x - k, x0.y + k);
    }
    // the faint portrait where it stops
    try { const src = doc.texture?.src; if (src && cur.stop && !short) { const sp = PIXI.Sprite.from(src), t = r.tl(cur.stop); sp.alpha = 0.35; sp.width = Math.max(1, Math.round(doc.width)) * gs; sp.height = Math.max(1, Math.round(doc.height)) * gs; sp.position.set(t.x, t.y); marks.addChildAt(sp, 0); } } catch (e) { /* no picture */ }
    if (cur.stop && !short) { const t = r.tl(cur.stop); gfx.lineStyle(3, MK.GOLD, 1); gfx.drawRect(t.x + 2, t.y + 2, Math.max(1, Math.round(doc.width)) * gs - 4, Math.max(1, Math.round(doc.height)) * gs - 4); }   // v0.0.466: where it stops, outlined in gold
    if (cur.stop) {
      const p = ctr(cur.stop), who = cur.inReach.some(t => t.id === target.id);
      const lines = short ? ["Too close", `a Charge moves at least ${ch.min}`] : blocked ? [`Stops after ${cur.stopSq}`, who ? `${target.name} in Reach` : `${target.name} not in Reach: disrupted`] : [`${r.sq} squares \u00b7 in Reach`, `then Basic Attack (1A) on ${target.name}`];
      const pl = MK.plate(lines, { fs, warn: blocked || short }); pl.position.set(p.x, p.y - (Math.max(1, Math.round(doc.height)) * gs) / 2 - 4); marks.addChild(pl);
    }
    go.hidden = short; go.textContent = blocked ? "Charge anyway" : "Charge";
    go.classList.toggle("fill", !blocked); give.classList.toggle("fill", blocked);
    keys.innerHTML = short ? "<kbd>Esc</kbd> Give up \u00b7 another enemy: click it" : `<kbd>Enter</kbd> ${blocked ? "Charge anyway" : "Charge"} \u00b7 <kbd>Esc</kbd> Give up`;
  };
  const setTarget = async t => { target = t; try { await c.setFlag(F, "charge", { ...ch, targetId: t.id }); ch.targetId = t.id; } catch (e) { /* the flag is only a record */ } cur = computeTarget(); draw(); };
  const flip = () => { side = side === "left" ? "right" : "left"; if (target) cur = computeTarget(); draw(); };
  bar.querySelectorAll(".lb-side button").forEach(b => b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); if (b.dataset.side !== side) flip(); }));
  bar.querySelector(".lb-give").addEventListener("click", ev => { ev.preventDefault(); close(true); });
  // v0.0.343 (Lucas, playtest 4): "Charge!" next to Give up: the line shown (toward the target, or the last square pointed at) goes, as a confirmed click
  bar.querySelector(".lb-go").addEventListener("click", async ev => { ev.preventDefault(); ev.stopPropagation(); await confirm(); });   // v0.0.461: Charge (or Charge anyway)
  const local = ev => (ev.getLocalPosition ? ev.getLocalPosition(canvas.stage) : ev.data.getLocalPosition(canvas.stage));
  // v0.0.461 (choice 3A): no destination square: the pointer only shows which enemy a click would pick
  const move = ev => { pos = local(ev); const hit = tokenAtPoint(pos); canvas.app.view.style.cursor = hit && (target ? true : cands.some(x => x.ok && x.t.id === hit.id)) ? "pointer" : ""; };
  const down = async ev => {
    if (ev.button !== 0) return;   // v0.0.460 (Lucas, checklist v0.0.459: "right clicking cancels it"): a right-click is Foundry's (panning the map); Escape or Cancel ends it
    pos = local(ev);
    // v0.0.453 (Lucas, playtest 6): a click on another enemy makes it the target; v0.0.461 (choice 4A): a click on the target confirms; a click
    // anywhere else does nothing (it launched the Charge)
    const other = tokenAtPoint(pos);
    if (!other) return;
    if (other.id !== target?.id) { if (target || cands.some(x => x.ok && x.t.id === other.id)) await setTarget(other); return; }
    await confirm();
  };
  const confirm = async () => {
    if (!target || !cur) return;
    const r = cur.path;
    if (r.cells.length < 2 || (r.bad < 0 && !cur.tooFar && r.sq + 1e-6 < ch.min)) return;
    const go = cur;
    close(false);
    await runCharge(c, doc, go, reach);
  };
  const key_ = ev => {
    if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); close(true); }
    if (ev.key === "Enter" && !/input|textarea/i.test(ev.target?.tagName ?? "")) { ev.preventDefault(); ev.stopImmediatePropagation(); confirm(); }   // v0.0.461: Enter confirms
    if (ev.key === "Tab") { ev.preventDefault(); ev.stopImmediatePropagation(); if (cur?.path.ties) flip(); }
  };
  const close = giveUp => {
    canvas.stage.off("pointermove", move); canvas.stage.off("pointerdown", down);
    window.removeEventListener("keydown", key_, true);
    canvas.tokens.interactiveChildren = prevInteractive;
    try { gfx.destroy(); marks.destroy({ children: true }); } catch (e) { /* gone */ }
    try { canvas.app.view.style.cursor = ""; } catch (e) { /* gone */ }
    bar.remove();
    if (dockHook !== null) { try { Hooks.off("controlToken", dockHook); } catch (e) { /* gone */ } dockHook = null; }   // v0.0.512
    try { (globalThis.__twod12Hud ?? hud)?.hudAsking?.(false); } catch (e) { /* gone */ }
    chargePick = null;
    if (giveUp) endMovement(c.id).catch(() => {});
  };
  canvas.stage.on("pointermove", move);
  canvas.stage.on("pointerdown", down);
  window.addEventListener("keydown", key_, true);
  chargePick = { c, close, bar };
  if (target) { cur = computeTarget(); }
  draw();
  return true;
}

/** Moves the token along the Charge's squares (to its last legal one), spends the movement, and checks Reach for the Weapon Attack (1A). */
async function runCharge(c, doc, go, reach) {
  const r = go.path, end = r.bad >= 0 ? r.bad - 1 : r.cells.length - 1;
  const points = r.cells.slice(1, end + 1).map(cell => r.tl(cell));
  if (!points.length) return endMovement(c.id);
  const chargeMsgId = c.getFlag(F, "charge")?.messageId ?? "";   // v0.0.512: its card, for the HUD's Basic Attack (1A)
  await c.unsetFlag(F, "charge").catch(() => {});
  if (r.bad >= 0) await postCard("Charge", `${esc(c.name)}'s Charge stops early`, `${esc(r.problem[0].toUpperCase() + r.problem.slice(1))}: it ends on the last legal square (${go.stopSq} squares).`, "chargemsg");
  await moveThrough(doc, points);
  // The Charge is one movement: its free squares are spent (the rest is dropped).
  await chargeMovement(c, go.stopSq, null, { logMode: "Charge" });
  await c.update({ [`flags.${F}.freeMove`]: 0 });
  clearRange();
  chargeFollowUp(c, doc, reach, go.stopTl, chargeMsgId);
}
