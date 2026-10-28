// Run with: node tools/tests/run.mjs (or node tools/tests/t38.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: {} } }; globalThis.Hooks = { on() {} };
const g = await import(ROOTURL + "module/gen.mjs");
const show = t => { const w = g.parseWeaponText(t); console.log(JSON.stringify(t)); console.log("  ->", w.name, "|", [...w.traits].join(","), "|", w.subtype, "|", w.range, "|", w.damage ? [1, 2, 3].map(n => JSON.stringify(w.damage["t" + n])).join(" ") : "-", "|", w.problems.join("; ")); };
show("greatsword: two-handed, slash, 0/1d8/2d6");
show("crossbow, reload, two-handed pierce, ranges 10/20/40, 0/1d4+2/1d10+2");
show("short sword, slash, 0/1d6/2d4");
show("Tusks: pierce, 0 / 1d6 / 2d6");
show("club: blunt, melee, 0/2/1d6-1");
show("bow, ranged, pierce, range 6/12/24, 0/1d6/1d8+1");
show("greatsword: two-handed slash"); show("spear: sharp, 0/1d6/1d10"); show("flail: blunt, 0/1d7/2d6");
console.log(JSON.stringify(g.weaponSystemData(g.parseWeaponText("crossbow, reload, two-handed pierce, ranges 10/20/40, 0/1d4+2/1d10+2"))));
// tier text round trip
const t = g.parseTierFull('1WB,1d4BH,"Prone. Pushed 2"'); console.log(JSON.stringify(t.text), t.insts.length, "|", g.tierToText(t.insts, t.text));
