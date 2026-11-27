// Run with: node tools/tests/run.mjs (or node tools/tests/t332.mjs)
// v0.0.533 (Lucas, 2026-11-27: "actions that you deal damage and push, you can deal damage, kill it, and then push the body onto another creature";
// book, Chapter 3, Forced Movement: "A creature the Action just killed is still moved" and Collision: "A Prone, an Unconscious or a dead creature
// that is itself moved collides with a wall or a standing creature as anyone does"): the moved creature is never an obstacle (move.mjs forcedWays),
// a dead or Down one stays among those a movement offers (pushCandidates), and its path collides as anyone's (analyzePath).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
const mv = await import(ROOTURL + "module/move.mjs");

// Durgan's Shove kills a Goblin Sneak (an NPC at 0, no Unconscious: dead); the Orc Warrior stands one square behind it
const tok = (id, name, o = {}) => ({ id, name, actor: { type: o.type ?? "npc", system: { atZero: !!o.atZero }, statuses: new Set(o.st ?? []) }, document: { id, disposition: o.disp ?? -1 } });
const durgan = tok("du", "Durgan", { type: "character", disp: 1 }), gob = tok("gs", "Goblin Sneak", { atZero: true }), orc = tok("ow", "Orc Warrior"), aveline = tok("av", "Aveline", { type: "character", disp: 1, st: ["unconscious"] }), wisp = tok("gw", "Grave Wisp", { st: ["dead"] });
console.log("the goblin is dead:", mv.deadTok(gob), "| as an obstacle it would be passed (collisionWay):", mv.collisionWay(gob));
const ways = (list, moved, o) => mv.forcedWays(list, moved, o).map(x => `${x.t.name} ${x.way}`).join(", ");
console.log("Pushed, the dead goblin moved: what it can meet:", ways([durgan, gob, orc, wisp, aveline], "gs", { originId: "du", originIn: false }));
console.log("Pulled into the origin's square: the origin blocks:", ways([durgan, gob, orc], "gs", { originId: "du" }), "| an Alt-drag (no origin):", ways([durgan, gob, orc], "gs"));
console.log("the moved one is never asked collisionWay, dead or Down:", ["gs", "gw", "av"].every(id => !mv.forcedWays([gob, wisp, aveline, orc], id).some(x => x.t.id === id)));
console.log("a pick:yes movement offers the dead and the Down (never its origin, never yourself):", mv.pushCandidates([durgan, gob, orc, wisp, aveline], "du", "du").map(t => t.name).join(", "), "| self:yes:", mv.pushCandidates([durgan, gob], "orc", "du", true).map(t => t.name).join(", "));

// Pushed 3 east: the orc is in the 2nd square, so the goblin's body moves 1 and hits it with 2 unused: both take 2 (1 a square, Chapter 3)
const path = [{ di: 0, dj: 0 }, { di: 0, dj: 1 }, { di: 0, dj: 2 }, { di: 0, dj: 3 }];
const occ = mv.forcedWays([durgan, orc, wisp], "gs", { originId: "du", originIn: false }).map(x => ({ ...x, at: x.t.id === "ow" ? 2 : x.t.id === "gw" ? 1 : -9 }));
const creatureAt = sh => occ.find(o => o.way === "block" && o.at === sh.dj)?.t ?? null, passAt = sh => occ.some(o => o.way === "pass" && o.at === sh.dj);
const r = mv.analyzePath(path, 3, { wallBetween: () => false, creatureAt, passAt });
console.log("the body pushed into the orc (a dead Grave Wisp in the first square, passed):", `moved ${r.done}, hits ${r.block?.token?.name}, ${r.unused} unused, damage to it ${r.damage.self} and to the orc ${r.damage.other}`);
console.log("into a wall:", JSON.stringify(mv.analyzePath(path, 3, { wallBetween: (a, b) => b.dj === 2, creatureAt: () => null }).damage));
const m = src("module/move.mjs");
console.log("the three ways in use (choosePush, choosePath, the Alt-drag):", (m.match(/forcedWays\(/g) ?? []).length === 4, "| pushOne has no dead check, the Collision's damage goes to both:", !/async function pushOne[\s\S]*?deadTok[\s\S]*?\n}\n/.test(m) && m.includes("if (target.actor && d.self) await collisionDamage(target.actor, d.self, origin);") && m.includes("if (o.actor && d.other) await collisionDamage(o.actor, d.other, origin);"));
console.log("the Tier's movement runs after a kill (ccdamage.mjs: no Down or dead check before runTierMove):", !/landed && g\.move[^\n]*(atZero|dead|down)/.test(src("module/ccdamage.mjs")));
