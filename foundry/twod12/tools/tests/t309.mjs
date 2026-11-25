// Run with: node tools/tests/run.mjs (or node tools/tests/t309.mjs)
// The core rework batch 4, the front line (Lucas, 2026-11-25; book, Chapter 3): flanking from opposite sides, a flat 1 (roundrules.mjs oppositeSides,
// flankBoon); an unwilling creature's space blocks, an ally's or a Down creature's is Difficult Terrain (move.mjs wayKind, downTok), an Evade crosses an
// ally, the diagonal between two enemies blocks; Tumble passes them (@Move[...|pass:enemies]); Charge; the protection floor rejected.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
await import(ROOTURL + "tools/content.mjs");
const RR = await import(ROOTURL + "module/roundrules.mjs"), MV = await import(ROOTURL + "module/move.mjs"), IN = await import(ROOTURL + "module/inline.mjs");
const { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");

console.log("--- opposite sides (within 45° of the line through the enemy's center, the edge counts)");
const T = [{ i: 0, j: 0 }], at = (i, j) => [{ i, j }];
const ring = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
console.log("from the west (0,-1), opposite squares:", ring.filter(([i, j]) => RR.oppositeSides(at(0, -1), at(i, j), T)).map(([i, j]) => `${i},${j}`).join(" "));
console.log("from the north-west (-1,-1):", ring.filter(([i, j]) => RR.oppositeSides(at(-1, -1), at(i, j), T)).map(([i, j]) => `${i},${j}`).join(" "));
console.log("Range 2 from the west (0,-2) with a partner diagonal (-1,1):", RR.oppositeSides(at(0, -2), at(-1, 1), T), "| beside (-1,0):", RR.oppositeSides(at(0, -2), at(-1, 0), T));
const big = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 1, j: 1 }];
console.log("a Large enemy, west of its top row and east of its bottom row:", RR.oppositeSides(at(0, -1), at(1, 2), big), "| west and south:", RR.oppositeSides(at(0, -1), at(2, 0), big));
console.log("a flat 1:", JSON.stringify(RR.flankBoon(true, 0)), "| cancelled:", JSON.stringify(RR.flankBoon(true, 2)), "| no partner:", JSON.stringify(RR.flankBoon(false, 0)), "| the frozen SIM's rule kept:", JSON.stringify(RR.flankBoons(3, 0)));

console.log("--- who is in your way");
const tk = (disp, statuses = [], atZero = false) => ({ document: { disposition: disp }, actor: { statuses: new Set(statuses), system: { atZero } } });
const me = { disposition: 1 };
for (const [label, t] of [["an enemy", tk(-1)], ["an ally", tk(1)], ["a neutral", tk(0)], ["a Dying enemy", tk(-1, ["dying"])], ["an Unconscious enemy", tk(-1, ["unconscious"])], ["a dead enemy", tk(-1, ["dead"])], ["an enemy at 0", tk(-1, [], true)], ["a Prone enemy", tk(-1, ["prone"])]])
  console.log(`${label}:`, MV.wayKind(t, me));
const mv = src("module/move.mjs");
console.log("refused: an enemy's space and the diagonal between two:", mv.includes("'s space blocks your movement (an unwilling creature's space). Tumble to pass through, or go around."), mv.includes("You can't slip diagonally between"));
console.log("an Evade crosses an ally (its extra cost left out):", mv.includes("cost - (way.allyExtra ?? 0) > dist + 1e-6"), "| the range preview blocks enemies, the diagonal too:", mv.includes('whoAt(b) === "block" || betweenTwo(a, b)'));
console.log("Charge: an ally's space stops it, an enemy's blocks it:", mv.includes("(an ally's or a Down creature's space is Difficult Terrain)"), mv.includes("(an unwilling creature's space blocks movement)"));

console.log("--- Tumble passes them");
console.log(JSON.stringify(IN.parseInline("Move", "advance|distance:floor(speed/2)|pass:enemies")).includes('"passEnemies":true'), "|", B.tumble.versions.map(v => v.effects).join(" || "), "|", B.tumble.automation);
console.log("its rule:", B.tumble.description?.includes?.("counts as crossing one creature") || JSON.stringify(B.tumble).includes("counts as crossing one creature"));
console.log("Evade's card:", B.safeMovement.versions[0].effects.includes("an ally's space you can cross"), "| Charge's:", B.charge.versions[0].effects.includes("an ally's space is Difficult Terrain) or an enemy's space"));

console.log("--- the book");
const ch3 = fs.readFileSync(`${ROOT}../../book/rules-src/03-movement.md`, "utf8"), cr = fs.readFileSync(`${ROOT}../../book/core-rework.md`, "utf8");
console.log(ch3.includes("**Creatures in your way.**"), ch3.includes("**opposite sides**"), ch3.includes("two unwilling creatures corner to corner block the diagonal"), "| no floor:", cr.includes("**Rejected (Lucas, 2026-11-25: \"No floor\""));
