// Run with: node tools/tests/run.mjs (or node tools/tests/t250.mjs)
// v0.0.373 (STYLE-2, Lucas, 2026-11-13): dice of the same type merge where damage is written (module/dicemerge.mjs; display only), and the
// turn-start Effects run one after the other per creature (the double Radiant Zeal; util.mjs oneAtATime).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
const D = await import(ROOTURL + "module/dicemerge.mjs"), U = await import(ROOTURL + "module/util.mjs");
console.log("--- a line");
for (const t of ["[R] 2d6 Ho + 1d6 Ho + 1d6 Ho", "[R] 1d8 Ho + 2d6 Ho", "[V] 1[W] + [Mod] + [R] 2d6 Ho + [R] 1d6 Ho", "[V] 1d6! Sl + 1d6 Sl + 1d6! Sl", "[R] 1d6 Ho + 1d6 Fi", "[V] 3 + 1d4", "2d6 Sl + 1d6 Ho + 1d6 Ho"]) console.log(`${t}  ->  ${D.mergeDiceLine(t)}`);
console.log("--- the breakdown");
const ins = [{ pool: "M", sub: "Ho", src: "Smite", dice: [{ faces: 6, results: [3, 4] }], mods: [], total: 7 }, { pool: "M", sub: "Ho", src: "Radiant Zeal", dice: [{ faces: 6, results: [5] }], mods: [], total: 5 }, { pool: "M", sub: "Ho", src: "Radiant Zeal", dice: [{ faces: 6, results: [2] }], mods: [], total: 2 }, { pool: "B", sub: "Sl", src: "Greatsword", dice: [{ faces: 6, results: [6, 1] }], mods: [{ v: 2, label: "Weapon" }], total: 9 }];
for (const x of D.mergeInstances(ins)) console.log(`${x.pool} ${x.sub} (${x.src}): dice ${x.dice.flatMap(d => d.results).join(" ")}; mods ${x.mods.map(m => `${m.v} ${m.label}`).join(", ") || "-"}; total ${x.total}`);
console.log("--- one at a time");
const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
await Promise.all([U.oneAtATime({ uuid: "A" }, async () => { log.push("A1 start"); await sleep(15); log.push("A1 end"); }), U.oneAtATime({ uuid: "A" }, async () => log.push("A2")), U.oneAtATime({ uuid: "B" }, async () => log.push("B"))]);
console.log(log.join(", "), "| an error doesn't stop the next:", await U.oneAtATime({ uuid: "C" }, async () => { throw new Error("x"); }).catch(() => "caught") , await U.oneAtATime({ uuid: "C" }, async () => "ran"));
