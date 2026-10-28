// Run with: node tools/tests/run.mjs (or node tools/tests/t23.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.foundry = { applications: { api: { DialogV2: {} } } }; globalThis.Hooks = { on() {} };
globalThis.CONFIG = {}; globalThis.ui = { notifications: { warn: console.log } }; globalThis.canvas = {};
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
// move.mjs imports template/damage (need foundry); test the pure parts by re-importing with stubs
const m = await import(ROOTURL + "module/move.mjs").catch(e => (console.log("import failed:", e.message.slice(0, 120)), null));
if (m) {
  const cells = [{ i: 3, j: 2 }];                    // target at row 3, col 2
  const origin = [{ i: 2, j: 2 }];                    // pusher directly above (row 2, col 2)
  const map = m.pushShifts(cells, origin, 5);
  const keys = [...map.keys()].filter(k => k !== "0,0");
  console.log("reachable squares for Pushed 5:", keys.length, "| straight line down (5,0):", map.has("5,0") && map.get("5,0").steps, "| sideways (0,3) blocked:", !map.has("0,3"), "| diagonal (3,3):", map.get("3,3")?.steps, "| (2,1):", map.has("2,1"), "| (1,1) not farther:", !map.has("1,1"));
  console.log("cannot move back toward origin (-1,0):", !map.has("-1,0"), "| (0,1) not farther:", !map.has("0,1"));
  const path = m.pathTo(map, "4,0"); console.log("path to (4,0):", path.map(p => `${p.di},${p.dj}`).join(" -> "));
  // collisions: wall after 2 steps, N=5
  const wall = (a, b) => b.di === 3;                  // wall blocks entering shift row 3
  const none = () => null;
  let r = m.analyzePath(m.pathTo(map, "5,0"), 5, { wallBetween: wall, creatureAt: none });
  console.log("wall at step 3:", r.done, "squares done,", r.unused, "unused, damage", JSON.stringify(r.damage), "final", JSON.stringify([r.final.di, r.final.dj]));
  r = m.analyzePath(m.pathTo(map, "5,0"), 5, { wallBetween: () => false, creatureAt: b => (b.di === 3 ? { name: "Goblin" } : null) });
  console.log("creature at step 3:", r.done, "done,", r.unused, "unused, damage", JSON.stringify(r.damage), r.block.type);
  r = m.analyzePath(m.pathTo(map, "5,0"), 5, { wallBetween: () => false, creatureAt: none }); console.log("free:", r.done, JSON.stringify(r.damage), r.block);
  r = m.analyzePath(m.pathTo(map, "2,0"), 5, { wallBetween: wall, creatureAt: none }); console.log("aim short (2 squares) no obstacle on the way:", r.done, JSON.stringify(r.damage));
  r = m.analyzePath(m.pathTo(map, "1,0"), 5, { wallBetween: b => true, creatureAt: none }); console.log("wall right next to it, Pushed 5:", r.done, "done,", JSON.stringify(r.damage));
}
// picture of the wedge for Pushed 3 from an origin directly above, target directly below
if (m) {
  const show = (cells, origin, N, cone) => { const mp = m.pushShifts(cells, origin, N, cone); const rows = []; for (let di = -1; di <= N; di++) rows.push([-N, -N+1, -N+2, -N+3, -N+4, -N+5, -N+6, -N+7, -N+8, -N+9, -N+10].filter(x => x <= N).map(dj => (di === 0 && dj === 0 ? "T" : (mp.has(`${di},${dj}`) ? "#" : "."))).join(" ")); console.log(rows.join("\n")); return mp; };
  console.log("Pushed 4, target directly below the origin, cone 45:"); show([{ i: 1, j: 0 }], [{ i: 0, j: 0 }], 4, 45);
  console.log("Same, cone 0 (straight line only):"); show([{ i: 1, j: 0 }], [{ i: 0, j: 0 }], 4, 0);
  const dg = m.pushShifts([{ i: 1, j: 1 }], [{ i: 0, j: 0 }], 4, 45); console.log("target on a diagonal: reaches (4,4):", dg.has("4,4"), "| (4,0) sideways:", dg.has("4,0"), "| (0,4):", dg.has("0,4"), "| path to (3,3):", m.pathTo(dg, "3,3").map(p => `${p.di},${p.dj}`).join(" -> "));
  const kn = m.pushShifts([{ i: 2, j: 1 }], [{ i: 0, j: 0 }], 3, 45); console.log("off-axis target (2,1): dirs lean down-right; (3,0):", kn.has("3,0"), "(3,1):", kn.has("3,1"), "(3,3):", kn.has("3,3"), "(0,3) side:", kn.has("0,3"));
}
