// Run with: node tools/tests/run.mjs (or node tools/tests/t128.mjs)
// v0.0.150: Leaning automation: the corners of the space, the nudge, cover from the chosen corner, and a nudged token counts as in its own square.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.canvas = { grid: { size: 40, isSquare: true, getOffset: p => ({ i: Math.floor(p.y / 40), j: Math.floor(p.x / 40) }) }, tokens: { placeables: [] } };
const L = await import(ROOTURL + "module/lean.mjs");
const cv = await import(ROOTURL + "module/cover.mjs");
const sq = { x: 80, y: 120, w: 40, h: 40 };
console.log("corners of a square:", Object.keys(L.CORNERS).map(k => { const p = L.cornerPoint(sq, k); return `${k} (${p.x},${p.y})`; }).join(" | "));
console.log("nudge from home (80,120), 40 px squares:", Object.keys(L.CORNERS).map(k => { const p = L.nudgeTarget({ x: 80, y: 120 }, k, 40); return `${k} -> (${p.x},${p.y})`; }).join(" | "));
const inside = k => { const p = L.nudgeTarget({ x: 80, y: 120 }, k, 40), cx = p.x + 20, cy = p.y + 20; return cx > 80 && cx < 120 && cy > 120 && cy < 160; };
console.log("the nudged center stays inside the home square:", Object.keys(L.CORNERS).every(inside), "| cell of the top-left with +half a square (the system's reads):", Object.keys(L.CORNERS).map(k => { const p = L.nudgeTarget({ x: 80, y: 120 }, k, 40); return `${k} ${Math.floor((p.y + 20) / 40)},${Math.floor((p.x + 20) / 40)}`; }).join(" | "), "(home is 3,2)");
// the flag and homePos
const doc = (x, y, lean) => ({ x, y, width: 1, height: 1, hidden: false, getFlag: (s, k) => (k === "lean" ? lean : undefined) });
console.log("homePos: not leaning", JSON.stringify(L.homePos(doc(80, 120))), "| nudged", JSON.stringify(L.homePos(doc(112, 88, { corner: "tr", home: { x: 80, y: 120 } }))), "| a plain object", JSON.stringify(L.homePos({ x: 5, y: 6 })));
console.log("lean moves:", [{ twod12Lean: true }, { options: { twod12Lean: true } }, { operation: { twod12Lean: true } }, {}, undefined].map(a => L.isLeanMove(a)).join(" "), "(true true true false false)");
// cover from the corner picked on the map
const tok = (id, x, y, status, lean) => ({ id, document: doc(x * 40, y * 40, lean), actor: { statuses: new Set(status ? [status] : []) } });
const wall = (a, b) => { const X = 45; if ((a.x - X) * (b.x - X) >= 0) return false; const t = (X - a.x) / (b.x - a.x); const y = a.y + t * (b.y - a.y); return y >= 125 && y <= 200; };
const T = tok("T", 4, 4);
const best = cv.coverBetween(tok("A", 0, 3, "leaning"), T, { blockedFn: wall, others: [] });
const right = cv.coverBetween(tok("A", 0, 3, "leaning", { corner: "tr", home: { x: 0, y: 120 } }), T, { blockedFn: wall, others: [] });
const left = cv.coverBetween(tok("A", 0, 3, "leaning", { corner: "tl", home: { x: 0, y: 120 } }), T, { blockedFn: wall, others: [] });
console.log("Leaning, no corner (best of 4):", best.blocked, "blocked,", best.label, "| corner top-right:", right.blocked, right.label, "|", cv.coverWhy(right).split(".")[0], "| corner top-left:", left.blocked, left.label, "|", cv.coverWhy(left).split(".")[0]);
// a nudged token is measured from its own square: the attacker's rect is the home rect, not the nudged position
const nudged = tok("A", 0, 3, "leaning", { corner: "tr", home: { x: 0, y: 120 } }); nudged.document.x = 16; nudged.document.y = 104;
const viaNudge = cv.coverBetween(nudged, T, { blockedFn: wall, others: [] });
console.log("a nudged token gives the same cover as its home square:", viaNudge.blocked === right.blocked && viaNudge.label === right.label);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("module/template.mjs"), mv = src("module/move.mjs"), hz = src("module/hazard.mjs"), main = src("module/twod12.mjs"), lean = src("module/lean.mjs"), light = src("module/light.mjs"), aura = src("module/aura.mjs");
console.log("areas, light and auras read the home square:", tpl.includes("homePos(doc)") && tpl.includes("homePos(d)") && light.includes("homePos(doc)") && aura.includes("homePos(d)"), "| movement tracking and [HT] ignore the nudge:", mv.includes("operation?.twod12Lean") && mv.includes("options?.twod12Lean") && hz.includes("isLeanMove(operation, movement)"));
console.log("hooks: registered", main.includes("registerLeanHooks();"), "| the nudge is an update with twod12Lean", lean.includes("{ twod12Lean: true, animate: i === steps.length - 1 }"), "| back home when Leaning ends", lean.includes('Hooks.on("deleteActiveEffect", async effect =>'), "| a real move drops the nudge", lean.includes('(changes.flags[F] ??= {})["-=lean"] = null;'), "| the corners are drawn for the owner of a controlled Leaning token", lean.includes("!t.actor?.statuses?.has?.(\"leaning\") || !d?.isOwner"));

// v0.0.151: the viewpoint goes PAST the corner so a wall that ends there no longer hides what is around it; walls along the edge still hold.
const R = { x: 80, y: 120, w: 40, h: 40 };   // the home square: x 80..120, y 120..160 (the east edge is x = 120)
const seg = (x1, y1, x2, y2) => (a, b) => { const d = (b.x - a.x) * (y2 - y1) - (b.y - a.y) * (x2 - x1); if (Math.abs(d) < 1e-9) return false; const t = ((x1 - a.x) * (y2 - y1) - (y1 - a.y) * (x2 - x1)) / d, u = ((x1 - a.x) * (b.y - a.y) - (y1 - a.y) * (b.x - a.x)) / d; return t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6; };
const any = (...f) => (a, b) => f.some(g => g(a, b));
const ctr = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const show = (label, k) => { const p = L.pickPeek(R, k, 40, label.fn), c = { x: p.x + 20, y: p.y + 20 }; return `${label.name}: ${k} -> ${p.mode} (center ${c.x},${c.y})`; };
const none = { name: "open ground", fn: () => false };
const endsAtCorner = { name: "a wall ending at the SE corner", fn: seg(120, 0, 120, 160) };          // along the east edge, ends at y = 160
const longWall = { name: "a long wall along the east edge", fn: seg(120, 0, 120, 400) };
const room = { name: "an inside corner (walls east and south)", fn: any(seg(120, 0, 120, 400), seg(0, 160, 400, 160)) };
console.log(show(none, "br"), "|", show(endsAtCorner, "br"), "|", show(longWall, "br"));
console.log(show(room, "br"), "|", show(endsAtCorner, "tr"), "|", show(longWall, "tl"));
const past = L.pickPeek(R, "br", 40, endsAtCorner.fn);
console.log("past the corner by", Math.round((past.x + 20 - 120) * 100) / 100, "px of 40 (0.1 square = 4), the center is outside its own square:", past.x + 20 > 120 && past.y + 20 > 160, "| a long wall keeps it inside:", L.pickPeek(R, "br", 40, longWall.fn).mode === "inside");
const big = L.pickPeek({ x: 0, y: 0, w: 80, h: 80 }, "br", 40, () => false);
console.log("a 2x2 token moves at most 0.6 squares:", big.x <= 24 && big.y <= 24 && big.x > 0, JSON.stringify(big));
const leanSrc = src("module/lean.mjs"), mvSrc = src("module/move.mjs");
console.log("leanTo uses pickPeek with the walls:", leanSrc.includes("pickPeek({ x: home.x, y: home.y, w: doc.width * s, h: doc.height * s }, corner, s, blocked)"), "| movement starts from the home square:", mvSrc.includes("const origin = leanOf(doc) ? homePos(doc)") && mvSrc.includes("const from = homePos(doc), to ="));

// v0.0.152: the token never moves in a straight line between two peeks: back to the center along its old L, then out along the new one.
const H = { x: 80, y: 120 }, P = (label, pts) => `${label}: ${pts.map(p => `(${p.x},${p.y})`).join(" -> ")}`;
const br = L.pickPeek(R, "br", 40, endsAtCorner.fn), tr = L.pickPeek(R, "tr", 40, endsAtCorner.fn), bl = L.pickPeek(R, "bl", 40, endsAtCorner.fn);
console.log("with the wall on the east edge ending at the SE corner, br goes down first:", JSON.stringify(br.via), "(x stays 80: down to just below the square, then across)");
console.log(P("start leaning toward br", L.leanRoute(null, H, br)));
console.log(P("br, then tr (inside: the wall continues up)", L.leanRoute({ corner: "br", home: H, via: br.via }, H, tr)));
console.log(P("br, then bl", L.leanRoute({ corner: "br", home: H, via: br.via }, H, bl)));
console.log(P("br, back home", L.leanRoute({ corner: "br", home: H, via: br.via }, H, null)));
// every step of these routes is free of the wall (the bug: center -> br in one diagonal grazed the end of the wall)
const steps = pts => pts.slice(1).map((p, i) => [pts[i], p]);
const cen = p => ({ x: p.x + 20, y: p.y + 20 });
const allFree = pts => steps([{ x: 80, y: 120 }, ...pts]).every(([a, b]) => !endsAtCorner.fn(cen(a), cen(b)));
console.log("every step clear of the wall:", allFree(L.leanRoute(null, H, br)), allFree(L.leanRoute({ corner: "br", home: H, via: br.via }, H, tr)) , "| the old straight line center -> br touched the end of the wall:", (() => { const a = cen(H), b = cen(br); const t = (120 - a.x) / (b.x - a.x); return Math.abs(a.y + t * (b.y - a.y) - 160) < 1e-9; })());
