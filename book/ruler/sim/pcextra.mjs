// Extra PC-budget measures for the Card Workbench (2026-11-14; pcbudget.mjs's method, fewer fights): Evade 1/2/3 as a free step each round,
// a Rally Point spent against one given. node book/ruler/sim/pcextra.mjs [fights a level, default 700] [melee,ranged]. Prices used: book/cards/manual/budget.js.
import fs from "node:fs";
const L = new URL("./", import.meta.url).pathname;
const { S, party, fights, mean } = await import(L + "stage0lib.mjs");
const B = await import(L + "budget.mjs"); const { STANDARDS } = await import(L + "designs.mjs");
const RULER = new URL("../", import.meta.url).pathname, N = Number(process.argv[2] ?? 700);
const SEAT = { melee: { i: 0, file: "paladin-smite-r1" }, ranged: { i: 2, file: "archer-double-r1" } };
const ENC = () => Array.from({ length: 4 }, (_, i) => B.npcBuilt("standard", STANDARDS[i % 4]));
const rd = f => fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8");
function plain(seat, level, o = {}) {
  const keep = rd(SEAT[seat].file).split(/\r?\n/).filter(l => !/^(reaction|passive|turn|plan|when|hook)\b/.test(l)).join("\n").replace(/^level .*$/m, `level ${level}`).replace(/^class .*$/m, `class Plain (${seat})`);
  const t = [keep, ...(o.actions ?? []), `turn Plain: ${o.turn ?? "Weapon Attack, Weapon Attack, Weapon Attack"}`, "plan Plain", o.scale ? `damage-scale ${o.scale}` : ""].filter(Boolean).join("\n");
  return S.parseSpec(t, `plain ${seat}`);
}
const run = (seat, mk) => mean([1, 2, 3].map(lv => { const P = party(lv); P[SEAT[seat].i] = mk(lv); return fights(P, ENC, { n: N, seed: 53, map: "open", mom: 0 }).cost; }));
for (const seat of (process.argv[3] ?? "melee,ranged").split(",")) {
  const zero = run(seat, lv => plain(seat, lv, { scale: 0.001 })), one = run(seat, lv => plain(seat, lv)), w = c => (100 * (zero - c) / (zero - one)).toFixed(1);
  const t = (name, o) => console.log(seat, name, w(run(seat, lv => plain(seat, lv, o))));
  for (const n of [1, 2, 3]) t(`Evade ${n}, free each round (0 AP)`, { actions: [`action Step | ap 0 | round | traits self | evade ${n}`], turn: "Step, Weapon Attack, Weapon Attack, Weapon Attack" });
  if (seat === "melee") {
    t("1 AP: an ally spends 1 Rally Point (in place of the 3rd attack)", { actions: ["action Rally | ap 1 | round | traits focus | heal 1"], turn: "Weapon Attack, Weapon Attack, Rally" });
    t("1 AP: an ally heals 9 new Health (a Rally Point's heal, not spent)", { actions: ["action Mend | ap 1 | round | traits focus | always: mend 9 any"], turn: "Weapon Attack, Weapon Attack, Mend" });
    t("1 AP: nothing (2 attacks only)", { turn: "Weapon Attack, Weapon Attack" });
  }
}
