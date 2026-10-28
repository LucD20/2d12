// Run with: node tools/tests/run.mjs (or node tools/tests/t28.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const { evalExpr, REFERENCES } = await import(ROOTURL + "module/refs.mjs");
const a = { system: { walk: 5, level: 3, attributes: { body: 2, mind: -1, appeal: 1, instinct: 0 }, weaponMod: 2, pool: 36, rallyHeal: 9 } };
for (const e of ["walk/2", "move/2", "walk", "5", "body+1", "mind", "walk*2", "level+walk/2", "hp/4", "banana", "walk/0", "2/3", "(walk+1)/2"]) console.log(e.padEnd(14), evalExpr(e, a));
