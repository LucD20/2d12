// Run with: node tools/tests/run.mjs (or node tools/tests/t48.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const cf = await import(ROOTURL + "module/config.mjs");
console.log("codes:", ["S", "c", "Sl", "holy", "Psychic", "Fire", "fo", "X"].map(x => `${x}->${cf.subtypeCode(x) || "?"}`).join(" "));
console.log("requirements:", JSON.stringify(cf.requirementProblem({ requirements: "You have at least Speed 3" }, { system: { moveSpeed: 2 } })), JSON.stringify(cf.requirementProblem({ requirements: "You have at least Speed 3" }, { system: { moveSpeed: 5 } })), JSON.stringify(cf.requirementProblem({ requirements: "" }, {})));
console.log(cf.metaRowHtml({ frequency: "atwill", targetText: "The triggering creature", trigger: "A creature within 3 squares uses a Move Action", requirements: "You have at least Speed 3" }).replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "*").replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"));
const df = await import(ROOTURL + "module/defense.mjs");
const t = a => ({ name: "Orc", system: { attributes: { body: a } }, itemTypes: { feature: [] } });
console.log("Vs. Body DC for Body -1..3:", [-1, 0, 1, 2, 3].map(a => df.computeDC({ system: { vs: "body", traits: new Set(), versions: [] } }, t(a), "").dc).join(", "), "(13,13,14,14,15)");
const g = await import(ROOTURL + "module/gen.mjs");
const parseTier = text => g.parseTierFull(text).insts;   // (the module keeps parseTierFull only)
const L = x => parseTier(x).map(i => `${i.pool}:${i.dice || (i.useW ? "W" : "At")}:${i.subtype}`).join(" ");
console.log("tokens:", L("1d4BHo"), "|", L("1d4MH"), "|", L("AtSl"), "|", L("AtS"), "|", L("1d6Co"), "|", L("1d6C"), "|", L("2d6BFi"));
console.log(g.convertEffects("1d6MHo and 2d4BFi and Appeal Save: 1d6 / 1d4 / 0 [M] Psychic"));
const w = g.parseWeaponText("wand: ranged, fire, ranges 6/12/24, 0/1d6/2d6"); console.log("weapon:", w.subtype, [...w.traits].join(","), w.problems.length);
class F { constructor(o) { this.o = o; } }
globalThis.foundry.abstract = { TypeDataModel: class {} }; globalThis.foundry.data = { fields: Object.fromEntries(['SchemaField','NumberField','StringField','BooleanField','ArrayField','SetField','HTMLField'].map(n => [n, class {}])) };
const { ActionData, WeaponData, EffectData } = await import(ROOTURL + "module/data.mjs");
const dl = await import(ROOTURL + "module/damagelog.mjs");
const combat = { round: 2, turn: 1, turns: [{ id: "a" }, { id: "b" }], combatants: { find: f => [{ id: "a", actor: { uuid: "A" } }, { id: "b", actor: { uuid: "B" } }].find(f) }, getFlag: (s, k) => k !== "dmglog" ? undefined : [{ o: "A", on: "Paladin", a: 10, r: 1, t: 0 }, { o: "B", on: "Skeleton", a: 4, r: 1, t: 1 }, { o: "A", on: "Paladin", a: 7, r: 2, t: 0 }, { o: "B", on: "Skeleton", a: 3, r: 2, t: 1 }] };
console.log("report:", dl.reportRows(combat).map(r => `${r.name}: turn ${r.turn}, round ${r.round}, total ${r.total}, per turn ${r.perTurn}, per round ${r.perRound}`).join(" | "));
const bs = await import(ROOTURL + "module/basic.mjs");
console.log("basic:", Object.values(bs.BASIC_ACTIONS).map(b => b.name).join(", "), "| Charge req:", bs.BASIC_ACTIONS.charge.requirements, "| Weapon Attack effects:", JSON.stringify(bs.BASIC_ACTIONS.basicWeaponAttack.versions[0].effects));
