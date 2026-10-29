// The map model (pack E2, 2026-10-29): positions on a square grid for the fights of spec.mjs, so movement and the conditions that act on it
// (Hindered, Immobilized, Prone, Slowed, Pushed, Pulled, Slid, Evade, Cover, range, Engaged) change what happens and can be priced (econ.mjs).
// The book's rules it follows (Chapter 3 unless said): distances count every second diagonal as 2; Engaged = adjacent to an enemy; a [Ranged]
// Action takes 2 Banes while you are Engaged and 1 Bane against a creature Engaged with someone else; Cover: a creature on the line from center
// to center is Low cover (1 Bane), and the map's own cover is drawn per ranged attack (`cover` in fights.txt); far range 1 Bane, maximum 2;
// Flanking (1 Boon per other flanker, up to 3, minus the target's allies that threaten you); Prone (melee +1 Boon, ranged 1 Bane against it;
// standing costs 1 AP); Hindered (Speed halved); Immobilized (no movement; Interact 1 AP ends the escape kind); Slowed N (N AP less);
// Opportunity Attack (an Interrupt when a creature leaves a square of your weapon's reach during a Move Action; Evade doesn't trigger it).
// What it leaves out: walls and Line of Effect (an open field), Difficult Terrain, Collision, Large creatures, elevation.
// This file has no import from spec.mjs: spec.mjs calls it and passes what it needs (W.hooks).

/** The map's settings (fights.txt `map ...` lines can change each one). */
export const MAP = {
  on: true,
  start: 8,          // squares between the PCs' front line and the NPCs' at the start of a fight
  back: 2,           // the PCs with a ranged weapon start this many squares behind the front line (with start 8: 10 squares, a crossbow's normal range)
  spacing: 2,        // squares between two creatures of the same line
  cover: [{ p: 0.05, n: 2 }, { p: 0.15, n: 1 }],  // the map's own cover on a ranged attack: 5% Medium (2 Banes), 15% Low (1 Bane)
  npcReactions: ["elite"],                        // the roles whose NPCs have an Opportunity Attack (the Bestiary: Standards and Elites "may have")
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

/** Flanking Boons for a [Melee] Action of att against tgt. */
export function flankBoons(att, tgt, W) {
  if (!threatens(att, tgt)) return 0;
  const n = Math.min(3, friendsOf(att, W).filter(x => x !== att && threatens(x, tgt)).length);
  const cancel = friendsOf(tgt, W).filter(x => x !== tgt && threatens(x, att)).length;
  return Math.max(0, n - cancel);
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
export function rangeBanes(range, d, longDraw = false) {
  if (d <= range[0]) return 0;
  if (d <= (range[1] ?? range[0])) return longDraw ? 0 : 1;
  if (d <= (range[2] ?? range[1] ?? range[0])) return longDraw ? 1 : 2;
  return Infinity;
}

/**
 * The Boons and Banes the map gives an attack. kind: "melee" or "ranged". opts: { ignoreCover, noEngagedBanes, longDraw, range }.
 * Returns { boons, banes, coverBanes, engagedBanes, intoMelee }, or null when the target is out of range.
 */
export function mapMods(att, tgt, kind, W, opts = {}) {
  const out = { boons: 0, banes: 0, coverBanes: 0, engagedBanes: 0, intoMelee: 0, rangeBanes: 0 };
  if (kind === "ranged") {
    const d = dist(att.pos, tgt.pos), rb = rangeBanes(opts.range ?? att.range ?? [1], d, opts.longDraw);
    if (!Number.isFinite(rb)) return null;
    const off = W.M.off ?? {};
    if (!off.range) { out.banes += rb; out.rangeBanes = rb; }
    if (engaged(att, W) && !opts.noEngagedBanes && !off.engaged) { out.banes += 2; out.engagedBanes = 2; }
    if (!off.intoMelee && enemiesOf(tgt, W).some(x => x !== att && adj(x, tgt))) { out.banes += 1; out.intoMelee = 1; }
    if (!opts.ignoreCover && !off.cover) {
      let c = creatureInLine(att, tgt, W) ? 1 : 0;
      if (d > 1) { const u = (att.R ?? W.R)(); let acc = 0; for (const x of W.M.cover) { acc += x.p; if (u < acc) { c = Math.max(c, x.n); break; } } }
      out.banes += c; out.coverBanes = c;
    }
    if (tgt.cond?.prone) out.banes += 1;
  } else {
    if (cheb(att.pos, tgt.pos) > 1) return null;
    if (!W.M.off?.flank) out.boons += flankBoons(att, tgt, W);
    if (tgt.cond?.prone) out.boons += 1;
  }
  return out;
}

const free = (W, me) => { const s = new Set(); for (const c of [...W.pcs, ...W.foes]) if (c !== me && up(c)) s.add(`${c.pos.x},${c.pos.y}`); return s; };
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
/**
 * Move c square by square, each step to the free neighbour that lowers score(pos) the most, within `budget` squares (every second diagonal 2).
 * onLeave(c, next) is called before each step (an Interrupt can stop it: return false). Returns the squares moved.
 */
export function walk(c, score, budget, W, onLeave = null) {
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
export const toward = t => p => (cheb(p, t.pos) === 1 ? 0 : cheb(p, t.pos) === 0 ? 99 : dist(p, t.pos));
export const awayFrom = (list, far = 12) => p => -Math.min(far, ...list.map(e => dist(p, e.pos)));

/** The Speed of a creature now (Hindered halves it, rounded down; Immobilized: 0). */
export const speedOf = c => (c.cond?.immob ? 0 : c.cond?.hindered ? Math.floor(c.speed / 2) : c.speed);

/** Place the creatures: melee PCs on the front line (y 0), ranged PCs `back` squares behind, NPCs `start` squares away (ranged ones 3 more). */
export function place(pcs, foes, M) {
  const row = (list, y) => list.forEach((c, i) => { c.pos = { x: Math.round((i - (list.length - 1) / 2) * M.spacing), y }; });
  row(pcs.filter(p => p.melee), 0);
  const back = pcs.filter(p => !p.melee);   // the ranged PCs stand behind and beside the front line, not straight behind a melee PC
  back.forEach((c, i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); c.pos = { x: side * (Math.ceil(pcs.filter(p => p.melee).length / 2) * M.spacing + M.spacing * (k + 1)), y: -M.back }; });
  row(foes.filter(f => !f.ranged), M.start); row(foes.filter(f => f.ranged), M.start + 3);
}

/** A fresh set of conditions. EoT ones end at the end of the creature's own next turn; `move` ones at its first Move Action. */
export const noCond = () => ({ hindered: null, immob: null, prone: false, slowed: 0 });

/** A condition from an effect text ("Hindered (EoT)", "Hindered (until it moves)", "Immobilized", "Prone", "Slowed 1"...) on a creature. */
export function applyCondition(t, name) {
  const n = name.toLowerCase();
  t.cond ??= noCond();
  if (/hindered/.test(n)) { const kind = /until|move/.test(n) ? "move" : "eot"; if (t.cond.hindered !== "eot") t.cond.hindered = kind; return true; }
  if (/immobilized/.test(n)) { const kind = /eot/.test(n) ? "eot" : "escape"; if (t.cond.immob !== "escape") t.cond.immob = kind; return true; }
  if (/prone/.test(n)) { t.cond.prone = true; return true; }
  const s = n.match(/slowed\s*(\d)/); if (s) { t.cond.slowed = Math.max(t.cond.slowed, Number(s[1])); return true; }
  return false;
}

/** Forced Movement: push (away from the origin), pull (toward it), slide (away from the slider's allies). Immobilized: not moved. */
export function force(kind, origin, t, n, W) {
  if (!n || t.cond?.immob || !up(t)) return 0;
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
