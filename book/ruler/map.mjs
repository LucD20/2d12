// The map model (pack E2, 2026-10-29): positions on a square grid for the fights of spec.mjs, so movement and the conditions that act on it
// (Hindered, Immobilized, Prone, Slowed, Pushed, Pulled, Slid, Evade, Cover, range, Engaged) change what happens and can be priced (econ.mjs).
// The book's rules it follows (Chapter 3 unless said): distances count every second diagonal as 2; Engaged = adjacent to an enemy; a [Ranged]
// Action takes 2 Banes while you are Engaged and 1 Field Bane against a creature Engaged with someone else; Cover: a creature on the line from
// center to center is Low cover, and the map's own cover is drawn per ranged attack (`cover` in fights.txt); far range 1 Bane, maximum 2;
// Flanking; Prone (melee 1 Field Boon, ranged 1 Field Bane against it; standing costs 1 AP); Hindered (Speed halved); Immobilized (no movement;
// Interact 1 AP ends the escape kind); Slowed N (N AP less); Opportunity Attack (an Interrupt when an adjacent enemy leaves a square during a
// Move Action or stands up; Evade doesn't trigger it).
// The ruler catch-up (2026-11-12; the book since 2026-11-08, Foundry since v0.0.301): Boons and Banes are flat and cancel (calc.mjs); the ones of
// position are **Field** ones, which add up to 2 on each side (calc.mjs bbCount: Cover, shooting into a melee, Prone, Flanking; the range Banes and
// Engaged's 2 Banes have no name, so they add on top); **Cover** is Low 1 / Medium 2 Field Banes and **High cover makes the roll Doomed** with no
// Field Banes from the Cover (`map cover 2% 3, ...` draws it; the open field's default draws none); **Flanking** is 1 Field Boon per other flanker,
// the cancels first (each ally of the target that threatens the flanker), then the limit of 2.
// What it leaves out: walls and Line of Effect (an open field), Difficult Terrain, Collision, Large creatures, elevation (SIM-2: book/sim-brief.md).
// This file has no import from spec.mjs: spec.mjs calls it and passes what it needs (W.hooks). The rules of the dice come from the system's calc.mjs.
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const GR = await import(new URL("../../foundry/twod12/module/gridrules.mjs", import.meta.url).href);   // SIM-2: Line of Effect and Cover by corners, a step's cost, Collision
const CO = await import(new URL("../../foundry/twod12/module/corners.mjs", import.meta.url).href);     // SIM-2: solid corners, the straight line of a Push
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const RR = await import(new URL("../../foundry/twod12/module/roundrules.mjs", import.meta.url).href);   // SIM-1: Flanking's count, Cover's effect, the range Banes, Prone and Engaged: the system's own functions

/** The map's settings (fights.txt `map ...` lines can change each one). */
export const MAP = {
  on: true,
  start: 8,          // squares between the PCs' front line and the NPCs' at the start of a fight
  back: 2,           // the PCs with a ranged weapon start this many squares behind the front line (with start 8: 10 squares, a crossbow's normal range)
  spacing: 2,        // squares between two creatures of the same line
  cover: [{ p: 0.05, n: 2 }, { p: 0.15, n: 1 }],  // the map's own cover on a ranged attack: 5% Medium (2 Field Banes), 15% Low (1); `n: 3` is High cover (Doomed)
  npcReactions: ["elite"],                        // before pack R (RULES.oaAll off): the roles whose NPCs have an Opportunity Attack; since pack R every creature has it
  npcRange: [10, 20, 40],                         // a ranged NPC's Range
  off: {},           // rules turned off to price them (econ.mjs): { engaged, intoMelee, cover, flank, range }
};

export const cheb = (p, q) => Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y));
/** Squares between two points: every second diagonal counts as 2. */
export const dist = (p, q) => { const dx = Math.abs(p.x - q.x), dy = Math.abs(p.y - q.y); return Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2); };
export const up = c => !(c.dead || c.down);
export const adj = (a, b) => a !== b && cheb(a.pos, b.pos) === 1;
const enemiesOf = (c, W) => (c.side === "pc" ? W.foes : W.pcs).filter(up);
const friendsOf = (c, W) => (c.side === "pc" ? W.pcs : W.foes).filter(up);
export const engaged = (c, W) => enemiesOf(c, W).some(e => adj(c, e));
/** A creature threatens an enemy in the normal range of a melee weapon (Range 1 here: adjacent). */
export const threatens = (c, e) => up(c) && c.melee && adj(c, e);

/** Flanking's Field Boons for a [Melee] Action of att against tgt (Chapter 3): 1 per other flanker, minus 1 per ally of the target that threatens att, then the limit of 2. */
export function flankBoons(att, tgt, W) {
  if (!threatens(att, tgt)) return 0;
  const n = friendsOf(att, W).filter(x => x !== att && threatens(x, tgt)).length;
  const cancel = friendsOf(tgt, W).filter(x => x !== tgt && threatens(x, att)).length;
  return RR.flankBoons(n, cancel).boons;
}

/** Low cover from a creature on the line from the center of a's square to the center of b's (sampled along the line). */
export function creatureInLine(a, b, W) {
  const occ = new Set([...W.pcs, ...W.foes].filter(c => up(c) && c !== a && c !== b).map(c => `${c.pos.x},${c.pos.y}`));
  if (!occ.size) return false;
  const n = 8 * Math.max(1, cheb(a.pos, b.pos));
  for (let i = 1; i < n; i++) {
    const t = i / n, x = a.pos.x + (b.pos.x - a.pos.x) * t, y = a.pos.y + (b.pos.y - a.pos.y) * t;
    if (Math.abs(x - Math.round(x)) > 0.499 || Math.abs(y - Math.round(y)) > 0.499) continue;   // on a square's edge: not through it
    if (occ.has(`${Math.round(x)},${Math.round(y)}`)) return true;
  }
  return false;
}

/** Banes for the range: normal 0, far 1, maximum 2 (Long Draw: far 0, maximum 1); beyond the maximum: can't. */
export const rangeBanes = (range, d, longDraw = false) => RR.rangeBanes(range, d, { longDraw });

/**
 * The Boons and Banes the map gives an attack. kind: "melee" or "ranged". opts: { ignoreCover, noEngagedBanes, longDraw, range }.
 * Returns { boons, banes (after the Field limit of 2 on each side; not cancelled: the caller adds its own and calc.mjs cancels), doomed (High cover),
 * coverBanes, engagedBanes, intoMelee, rangeBanes, fieldBoons, fieldBanes (before the limit), fieldLost (what the limit took off) }, or null when the target is out of range.
 */
export function mapMods(att, tgt, kind, W, opts = {}) {
  const out = { boons: 0, banes: 0, doomed: false, coverBanes: 0, engagedBanes: 0, intoMelee: 0, rangeBanes: 0, fieldBoons: 0, fieldBanes: 0, fieldLost: 0 };
  const src = [];   // the sources, as calc.mjs bbCount reads them: { boons, banes, bb }
  const done = () => { const n = C.bbCount(src); out.boons = n.boons; out.banes = n.banes; out.fieldBoons = n.groups.field?.boons ?? 0; out.fieldBanes = n.groups.field?.banes ?? 0; out.fieldLost = n.rawBoons - n.boons + n.rawBanes - n.banes; return out; };
  if (kind === "ranged") {
    const d = dist(att.pos, tgt.pos), rb = rangeBanes(opts.range ?? att.range ?? [1], d, opts.longDraw);
    if (!Number.isFinite(rb)) return null;
    const off = W.M.off ?? {};
    if (!off.range) { src.push({ banes: rb }); out.rangeBanes = rb; }                                                          // no name: it adds to Cover
    if (engaged(att, W) && !opts.noEngagedBanes && !off.engaged) { src.push({ banes: RR.ENGAGED_RANGED_BANES }); out.engagedBanes = RR.ENGAGED_RANGED_BANES; }           // no name (one rule)
    if (!off.intoMelee && !opts.noIntoMelee && enemiesOf(tgt, W).some(x => x !== att && adj(x, tgt))) { src.push({ banes: RR.INTO_MELEE_FIELD_BANES, bb: "field" }); out.intoMelee = RR.INTO_MELEE_FIELD_BANES; }
    const lvl = W.M.grid ? coverOf(att, tgt, W) : 0;   // SIM-2: on a map, Cover is the corners the walls block; 4 = no Line of Effect
    if (lvl >= 4) return null;
    if (!opts.ignoreCover && !off.cover) {
      let c = creatureInLine(att, tgt, W) ? 1 : 0;
      if (W.M.grid) c = Math.max(c, lvl);
      else if (d > 1) { const u = (att.R ?? W.R)(); let acc = 0; for (const x of W.M.cover) { acc += x.p; if (u < acc) { c = Math.max(c, x.n); break; } } }
      const cm = RR.coverMods(c); if (cm.doomed) out.doomed = true; else if (cm.banes) src.push({ banes: cm.banes, bb: cm.bb });   // High cover: Doomed, and no Field Banes from the Cover
      out.coverBanes = c >= 3 ? 0 : c; out.cover = c;
    }
    if (tgt.cond?.prone) src.push(RR.proneMods(true));
  } else {
    if (cheb(att.pos, tgt.pos) > 1) return null;
    if (W.M.grid) { const lvl = coverOf(att, tgt, W); if (lvl >= 4) return null; const cm = RR.coverMods(lvl); if (cm.doomed) out.doomed = true; else if (cm.banes) src.push({ banes: cm.banes, bb: cm.bb }); out.cover = lvl; }   // Cover applies to melee too (around a corner)
    if (!W.M.off?.flank) src.push({ boons: flankBoons(att, tgt, W), bb: "field" });
    if (tgt.cond?.prone) src.push(RR.proneMods(false));
  }
  return done();
}

const free = (W, me) => { const s = new Set(); for (const c of [...W.pcs, ...W.foes]) if (c !== me && up(c)) s.add(`${c.pos.x},${c.pos.y}`); return s; };
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
/**
 * Move c square by square, each step to the free neighbour that lowers score(pos) the most, within `budget` squares (every second diagonal 2).
 * onLeave(c, next) is called before each step (an Interrupt can stop it: return false). Returns the squares moved.
 */
export function walk(c, score, budget, W, onLeave = null) {
  if (W.M?.grid) return walkGrid(c, score, budget, W, onLeave);   // SIM-2: on a map, a path around walls and through terrain
  const occ = free(W, c);
  let used = 0, diag = 0, moved = 0;
  for (;;) {
    let best = null, bestS = score(c.pos) - 1e-9;
    for (const [dx, dy] of NB) {
      const np = { x: c.pos.x + dx, y: c.pos.y + dy }, isD = dx && dy, cost = isD ? (diag % 2 ? 2 : 1) : 1;
      if (occ.has(`${np.x},${np.y}`) || used + cost > budget) continue;
      const s = score(np) + (isD ? 1e-4 : 0);
      if (s < bestS) { bestS = s; best = { np, cost, isD }; }
    }
    if (!best) break;
    if (onLeave && onLeave(c, best.np) === false) break;
    c.pos = best.np; used += best.cost; if (best.isD) diag++; moved++;
  }
  return moved;
}
/** Score functions: to a square next to t; away from enemies (up to `far` squares from the nearest); toward / away from a point. */
export const toward = t => { const f = p => (cheb(p, t.pos) === 1 ? 0 : cheb(p, t.pos) === 0 ? 99 : dist(p, t.pos)); f.goal = t; return f; };   // goal: on a map the walk finds a path to a square next to it
export const awayFrom = (list, far = 12) => p => -Math.min(far, ...list.map(e => dist(p, e.pos)));

/** The Speed of a creature now (Hindered halves it, rounded down; Immobilized: 0). */
export const speedOf = c => (c.cond?.immob ? 0 : c.cond?.hindered ? Math.floor(c.speed / 2) : c.speed);

/** Place the creatures: melee PCs on the front line (y 0), ranged PCs `back` squares behind, NPCs `start` squares away (ranged ones 3 more). */
export function place(pcs, foes, M) {
  if (M.grid) return placeGrid(pcs, foes, M.grid);
  const row = (list, y) => list.forEach((c, i) => { c.pos = { x: Math.round((i - (list.length - 1) / 2) * M.spacing), y }; });
  row(pcs.filter(p => p.melee), 0);
  const back = pcs.filter(p => !p.melee);   // the ranged PCs stand behind and beside the front line, not straight behind a melee PC
  back.forEach((c, i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); c.pos = { x: side * (Math.ceil(pcs.filter(p => p.melee).length / 2) * M.spacing + M.spacing * (k + 1)), y: -M.back }; });
  row(foes.filter(f => !f.ranged), M.start); row(foes.filter(f => f.ranged), M.start + 3);
}

/** A fresh set of conditions. EoT ones end at the end of the creature's own next turn; `move` ones at its first Move Action. */
export const noCond = () => ({ hindered: null, immob: null, prone: false, slowed: 0, dazed: 0, staggered: null, blinded: null, frightened: null, bleed: null });   // pack R-classes (the conditions pass): Dazed, Staggered, Blinded, Frightened (its Bane only), Bleed

/** A condition from an effect text ("Hindered (EoT)", "Hindered (until it moves)", "Immobilized", "Prone", "Slowed 1"...) on a creature. */
const bleedAvg = d => { const m = String(d).match(/^(\d+)d(\d+)([+-]\d+)?$/); return m ? Number(m[1]) * (Number(m[2]) + 1) / 2 + Number(m[3] ?? 0) : Number(d) || 0; };
export function applyCondition(t, name, by = null) {
  const n = name.toLowerCase();
  t.cond ??= noCond();
  // Pack R-classes (the conditions pass, 2026-11-04): Dazed N (AP lost now; an NPC has none outside its turn, so from its next turn), Staggered (no Reactions, EoT),
  // Blinded (its Strikes are Doomed, EoT), Frightened (1 Bane on its rolls, EoT; the "can't move closer" is not modeled), Taunted (Banes against anyone but `by`, until its turn ends), Bleed X (the higher average kept).
  const dz = n.match(/dazed\s*(\d)/); if (dz) { t.cond.dazed += Number(dz[1]); return true; }
  if (/staggered/.test(n)) { t.cond.staggered = "eot"; return true; }
  if (/blinded/.test(n)) { t.cond.blinded = "eot"; return true; }
  if (/frightened/.test(n)) { t.cond.frightened = "eot"; return true; }
  if (/taunted/.test(n)) { if (by) t.taunt = { by, n: 1 }; return !!by; }
  const bl = n.match(/bleed\s+([\dd+-]+)(?:\s*\(([^)]*)\))?/); if (bl) { const nb = { dmg: bl[1], mind: /\[r\]|mi|ap/.test(bl[2] ?? ""), by }; if (!t.cond.bleed || bleedAvg(nb.dmg) > bleedAvg(t.cond.bleed.dmg)) t.cond.bleed = nb; return true; }
  if (/hindered/.test(n)) { const kind = /until|move/.test(n) ? "move" : "eot"; if (t.cond.hindered !== "eot") t.cond.hindered = kind; return true; }
  if (/immobilized/.test(n)) { const kind = /eot/.test(n) ? "eot" : "escape"; if (t.cond.immob !== "escape") t.cond.immob = kind; return true; }
  if (/prone/.test(n)) { t.cond.prone = true; return true; }
  const s = n.match(/slowed\s*(\d)/); if (s) { t.cond.slowed = Math.max(t.cond.slowed, Number(s[1])); return true; }
  return false;
}

/** Forced Movement: push (away from the origin), pull (toward it), slide (away from the slider's allies). Immobilized: not moved. */
export function force(kind, origin, t, n, W) {
  if (!n || t.cond?.immob || !up(t)) return 0;
  if (W.M?.grid && kind !== "slide") return forceGrid(kind, origin, t, n, W);
  const score = kind === "pull" ? (p => dist(p, origin.pos)) : kind === "slide" ? awayFrom(friendsOf(origin, W), 99) : (p => -dist(p, origin.pos));
  // Forced Movement counts each square as 1 (diagonals too): a budget with no diagonal surcharge.
  const occ = free(W, t);
  let moved = 0;
  for (let k = 0; k < n; k++) {
    let best = null, bs = score(t.pos) - 1e-9;
    for (const [dx, dy] of NB) { const np = { x: t.pos.x + dx, y: t.pos.y + dy }; if (occ.has(`${np.x},${np.y}`) || (kind === "pull" && cheb(np, origin.pos) === 0)) continue; const s = score(np); if (s < bs) { bs = s; best = np; } }
    if (!best) break;
    t.pos = best; moved++;
  }
  return moved;
}

/* ------------------------------------------------------------------ SIM-2 (2026-11-12): maps. A map is a text file of book/ruler/maps/: one character a square.
   `#` a wall or anything solid that fills its square (it blocks lines and movement, and its corners are solid), `~` Difficult Terrain, `P` where the
   party can start, `N` where the enemies can start, `.` open ground. The file's top row is the far side: the party is usually at the bottom.
   With no map (`open`), the fight is on the open field above, exactly as before SIM-2. */
const MAPS = fileURLToPath(new URL("./maps/", import.meta.url));
export const mapNames = () => ["open", ...fs.readdirSync(MAPS).filter(f => f.endsWith(".txt")).map(f => f.slice(0, -4)).sort()];
export function parseMap(text, name = "map") {
  const rows = text.split(/\r?\n/).filter(l => l.trim() && !l.startsWith(";")), h = rows.length, w = Math.max(...rows.map(r => r.length));
  const G = { name, w, h, wall: new Set(), rough: new Set(), walls: [], roughs: [], pcStart: [], npcStart: [], title: (text.match(/^;\s*(.+)$/m) ?? [])[1] ?? name };
  rows.forEach((r, i) => { const y = h - 1 - i; for (let x = 0; x < w; x++) { const ch = r[x] ?? "#";
    if (ch === "#") { G.wall.add(`${x},${y}`); G.walls.push([x, y]); } else if (ch === "~") { G.rough.add(`${x},${y}`); G.roughs.push([x, y]); } else if (ch === "P") G.pcStart.push({ x, y }); else if (ch === "N") G.npcStart.push({ x, y }); } });
  if (!G.pcStart.length || !G.npcStart.length) throw new Error(`maps/${name}.txt needs P squares (the party's start) and N squares (the enemies')`);
  return G;
}
const LOADED = new Map();
/** A map by its name (maps/<name>.txt); "open" or nothing: no map (the open field). */
export function loadMap(name) { if (!name || name === "open") return null; if (!LOADED.has(name)) LOADED.set(name, parseMap(fs.readFileSync(`${MAPS}${name}.txt`, "utf8"), name)); return LOADED.get(name); }
const solid = (G, x, y) => x < 0 || y < 0 || x >= G.w || y >= G.h || G.wall.has(`${x},${y}`);
const blocker = G => (G.blocks ??= (ax, ay, bx, by) => { for (const k of G.walls) if (GR.segmentHitsSquare(ax, ay, bx, by, k[0], k[1])) return true; return false; });
const COVER = new WeakMap();   // per map: "ax,ay>bx,by" -> level (walls don't move)
/** Cover of b against a on the map: the corners of b's square that the walls block from the center of a's (0 to 4; 4 = no Line of Effect). No map: 0. */
export function coverOf(a, b, W) {
  const G = W.M?.grid; if (!G) return 0;
  let c = COVER.get(G); if (!c) COVER.set(G, (c = new Map()));
  const k = `${a.pos.x},${a.pos.y}>${b.pos.x},${b.pos.y}`; let v = c.get(k);
  if (v === undefined) c.set(k, (v = GR.coverLevel(a.pos, b.pos, blocker(G))));
  return v;
}
export const coverAt = (pos, b, W) => coverOf({ pos }, b, W);
/** Can a target b with an Action? On a map it needs Line of Effect. */
export const canTarget = (a, b, W) => coverOf(a, b, W) < 4;

/** Every square c can reach and what it costs (Ch. 3: the second diagonal 2, Difficult Terrain double, no solid corner, no square with a creature in it). from: Map "x,y" -> { cost, prev }. */
function reach(c, W, budget = Infinity, { through = false, start = c.pos } = {}) {
  const G = W.M.grid;
  if (through && budget === Infinity) { const f = (G.fields ??= new Map()), k = `${start.x},${start.y}`; if (!f.has(k)) f.set(k, search(G, start, Infinity, null)); return f.get(k); }   // walls don't move: one search per square of a map
  return search(G, start, budget, through ? null : free(W, c));
}
function search(G, start, budget, occ) {
  const best = new Map(), seen = new Set(), buckets = [[{ x: start.x, y: start.y, cost: 0, diag: 0, prev: null }]];   // costs are small whole numbers: a bucket per cost
  for (let cst = 0; cst < buckets.length; cst++) {
    const b = buckets[cst]; if (!b) continue;
    for (let q = 0; q < b.length; q++) {
      const n = b[q], sk = (n.x + 1) * 4096 + (n.y + 1) * 2 + (n.diag % 2);
      if (seen.has(sk)) continue; seen.add(sk);
      const k = `${n.x},${n.y}`; if (!best.has(k)) best.set(k, n);
      for (const [dx, dy] of NB) {
        const x = n.x + dx, y = n.y + dy, isD = dx && dy;
        if (solid(G, x, y) || (occ && occ.has(`${x},${y}`))) continue;
        if (isD && CO.stepCorners({ i: n.y, j: n.x }, { i: y, j: x }, { solidAt: () => solid(G, n.x, y) || solid(G, x, n.y) }).kind === "solid") continue;
        const cost = n.cost + GR.stepCost(!!isD, n.diag, G.rough.has(`${x},${y}`));
        if (cost > budget) continue;
        (buckets[cost] ??= []).push({ x, y, cost, diag: n.diag + (isD ? 1 : 0), prev: n });
      }
    }
  }
  return best;
}
const pathTo = n => { const p = []; for (let k = n; k?.prev; k = k.prev) p.unshift({ x: k.x, y: k.y }); return p; };
/** The squares to walk (as a movement cost) from c to a square next to t, around walls; Infinity when there is no way. No map: the straight distance - 1. */
export function gap(c, t, W) {
  if (!W.M?.grid) return cheb(c.pos, t.pos) <= 1 ? 0 : dist(c.pos, t.pos) - 1;
  if (adj(c, t)) return 0;
  const f = reach(c, W, Infinity, { through: true }); let b = Infinity;
  for (const [dx, dy] of NB) { const n = f.get(`${t.pos.x + dx},${t.pos.y + dy}`); if (n && n.cost < b) b = n.cost; }
  return b;
}
/** The nearest of a list to c: by the way there on a map, by the straight distance on the open field. */
export function nearest(c, list, W) {
  if (!W.M?.grid) return list.sort((x, y) => dist(c.pos, x.pos) - dist(c.pos, y.pos))[0];
  const g = new Map(list.map(t => [t, gap(c, t, W)]));
  return list.sort((x, y) => g.get(x) - g.get(y) || dist(c.pos, x.pos) - dist(c.pos, y.pos))[0];
}
/** A score for a creature that shoots: on a map, a square with no Line of Effect to its target is far worse, and Cover a little worse. */
export const sightScore = (score, tg, W) => (!W.M?.grid || !tg ? score : p => { const l = coverAt(p, tg, W); return score(p) + (l >= 4 ? 40 : l >= 3 ? 6 : l); });
/** The walk on a map: to a square next to the goal by the shortest way (score.goal), or to the reachable square with the best score. */
function walkGrid(c, score, budget, W, onLeave) {
  let path = null;
  if (score.goal) {
    const t = score.goal; if (adj(c, t)) return 0;
    for (const through of [false, true]) {   // a way around the creatures; if they block every way, the way through them, as far as it goes
      const f = reach(c, W, Infinity, { through }), occ = through ? free(W, c) : null; let b = null;
      for (const [dx, dy] of NB) { const k = `${t.pos.x + dx},${t.pos.y + dy}`, n = f.get(k); if (n && (!b || n.cost < b.cost) && !(occ && occ.has(k))) b = n; }
      if (b) { path = pathTo(b); break; }
    }
  } else {
    let b = null, bs = score(c.pos) - 1e-9;
    for (const n of reach(c, W, budget).values()) { const s = score({ x: n.x, y: n.y }) + n.cost * 1e-3; if (s < bs) { bs = s; b = n; } }
    if (b) path = pathTo(b);
  }
  if (!path) return 0;
  const G = W.M.grid, occ = free(W, c); let used = 0, diag = 0, moved = 0;
  for (const np of path) {
    const isD = np.x !== c.pos.x && np.y !== c.pos.y, cost = GR.stepCost(isD, diag, G.rough.has(`${np.x},${np.y}`));
    if (used + cost > budget || occ.has(`${np.x},${np.y}`)) break;
    if (onLeave && onLeave(c, np) === false) break;
    c.pos = np; used += cost; if (isD) diag++; moved++;
  }
  return moved;
}
/** Pushed and Pulled on a map (Ch. 3, Collision): a straight line to the destination; the creature stops in the last legal square and takes damage for its unused squares (W.onCollision tells the engine). */
function forceGrid(kind, origin, t, n, W) {
  const G = W.M.grid, d = { x: t.pos.x - origin.pos.x, y: t.pos.y - origin.pos.y }, m = Math.max(Math.abs(d.x), Math.abs(d.y)) || 1, sgn = kind === "pull" ? -1 : 1;
  const want = kind === "pull" ? Math.min(n, Math.max(0, cheb(t.pos, origin.pos) - 1)) : n;   // a Pull is aimed at the square next to the origin: no Collision with it
  if (!want) return 0;
  const dest = { x: t.pos.x + Math.round(sgn * want * d.x / m), y: t.pos.y + Math.round(sgn * want * d.y / m) };
  const line = CO.straightCells({ i: t.pos.y, j: t.pos.x }, { i: dest.y, j: dest.x }).slice(1), occ = new Map([...W.pcs, ...W.foes].filter(c => c !== t && up(c)).map(c => [`${c.pos.x},${c.pos.y}`, c]));
  let moved = 0, hit = null;
  for (const cell of line) {
    const np = { x: cell.j, y: cell.i }, isD = np.x !== t.pos.x && np.y !== t.pos.y;
    if (solid(G, np.x, np.y) || (isD && (solid(G, t.pos.x, np.y) || solid(G, np.x, t.pos.y)))) { hit = "wall"; break; }
    const other = occ.get(`${np.x},${np.y}`) ?? (isD && occ.get(`${t.pos.x},${np.y}`) && occ.get(`${np.x},${t.pos.y}`) ? occ.get(`${t.pos.x},${np.y}`) : null);
    if (other) { hit = other; break; }
    t.pos = np; moved++;
  }
  const unused = line.length - moved;
  if (hit && unused > 0) {
    const dmg = GR.collisionDamage(unused, hit === "wall" ? "wall" : "creature");
    t.damage = (t.damage ?? 0) + dmg; if (t.st) t.st.taken += dmg;
    if (hit !== "wall") { hit.damage = (hit.damage ?? 0) + dmg; if (hit.st) hit.st.taken += dmg; }
    W.onCollision?.(origin, t, dmg, hit === "wall" ? null : hit);
  }
  return moved;
}
/** The start on a map: each side in its zone, the melee creatures in the squares nearest the other side, the ranged ones farthest. */
function placeGrid(pcs, foes, G) {
  const mid = list => ({ x: list.reduce((s2, p) => s2 + p.x, 0) / list.length, y: list.reduce((s2, p) => s2 + p.y, 0) / list.length });
  const put = (list, zone, other) => { const o = mid(other), z = [...zone].sort((a, b) => Math.hypot(a.x - o.x, a.y - o.y) - Math.hypot(b.x - o.x, b.y - o.y) || a.x - b.x);
    if (z.length < list.length) throw new Error(`maps/${G.name}.txt: ${list.length} creatures need more start squares (${z.length})`);
    const front = list.filter(c => c.melee), back = list.filter(c => !c.melee), spread = (cs, sq) => cs.forEach((c, i) => { c.pos = { ...sq[Math.min(sq.length - 1, Math.floor(i * sq.length / cs.length))] }; });
    const nf = Math.min(z.length - back.length, Math.max(front.length, Math.ceil(z.length / 2)));
    spread(front, z.slice(0, nf).sort((a, b) => a.x - b.x || a.y - b.y)); spread(back, z.slice(z.length - Math.max(back.length, Math.min(z.length - nf, back.length * 2))).sort((a, b) => a.x - b.x || a.y - b.y)); };
  put(pcs, G.pcStart, G.npcStart); put(foes, G.npcStart, G.pcStart);
  // Two creatures never share a square: the later one takes the nearest free start square.
  const used = new Set(); for (const [list, zone] of [[pcs, G.pcStart], [foes, G.npcStart]]) for (const c of list) { let k = `${c.pos.x},${c.pos.y}`; if (used.has(k)) { const f = zone.filter(q => !used.has(`${q.x},${q.y}`)).sort((a, b) => dist(a, c.pos) - dist(b, c.pos))[0]; c.pos = { ...f }; k = `${f.x},${f.y}`; } used.add(k); }
}
