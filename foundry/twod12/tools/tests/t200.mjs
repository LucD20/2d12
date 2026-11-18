// Run with: node tools/tests/run.mjs (or node tools/tests/t200.mjs)
// v0.0.261 (cards session 5, Lucas): Zones (Consecrated Ground: the placed area's rules, who is inside, the side), the "would go Down" moment
// (Divine Intervention: the damage that would reach the Pool, the cut to 1 under it), a bare "heal 1d4" as a Heal chip, the cards' new fields.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id1" } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u1" } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const Z = await import(ROOTURL + "module/zone.mjs");
const M = await import(ROOTURL + "module/moment.mjs");
const G = await import(ROOTURL + "module/gen.mjs");
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const zone = { name: "Consecrated Ground", originDisposition: 1, cells: ["3,3", "3,4", "4,3", "4,4"], rules: [{ who: "enemies", fxUuid: "Item.bane", heal: "" }, { who: "allies", fxUuid: "", heal: "1d4" }] };
const toks = [{ id: "nari", disposition: 1, cells: [{ i: 3, j: 3 }] }, { id: "orc", disposition: -1, cells: [{ i: 4, j: 4 }] }, { id: "wolf", disposition: 0, cells: [{ i: 3, j: 4 }] }, { id: "far", disposition: -1, cells: [{ i: 9, j: 9 }] }];
const plan = Z.zonePlan([{ id: "r1", zone }], toks);
console.log("zone plan:", JSON.stringify([...plan.entries()].map(([id, m]) => [id, [...m.keys()]])), "| sides:", Z.zoneSide(zone, 1), Z.zoneSide(zone, -1), Z.zoneSide(zone, 0), "| inside:", Z.inZone(zone, [{ i: 3, j: 3 }]), Z.inZone(zone, [{ i: 9, j: 9 }]));
console.log("the heal rule is for allies only:", Z.ruleWants(zone.rules[1], "allies") && !Z.ruleWants(zone.rules[1], "enemies"), "| everyone:", Z.ruleWants({ who: "all" }, "enemies"));
const actor = { system: { pool: 35, totalDamage: 30 } };
console.log("would go Down:", M.wouldGoDown(actor, { B: { l: 5, n: 0 }, M: { l: 0, n: 0 } }), M.wouldGoDown(actor, { B: { l: 4, n: 0 }, M: { l: 0, n: 0 } }), M.wouldGoDown({ system: { pool: 35, totalDamage: 35 } }, { B: { l: 1, n: 0 }, M: { l: 0, n: 0 } }), "| no pool:", M.wouldGoDown({ system: {} }, { B: { l: 9, n: 0 }, M: { l: 0, n: 0 } }));
const a = { B: { l: 6, n: 2 }, M: { l: 3, n: 0 } };
console.log("cut to 1 under the Pool:", M.capAtPool(actor, a), JSON.stringify(a), "| total after:", 30 + a.B.l + a.B.n + a.M.l + a.M.n);
console.log("heal 1d4 is a chip:", G.convertEffects("allies in it heal 1d4 at the start of each of their turns"), "| a Stage heal stays:", G.convertEffects("heal 3d6 + your Power Modifier (4d6 at Stage 2, 6d6 at Stage 3)").includes("@Heal[3d6+pow|s2:4d6+pow|s3:6d6+pow]"));
const cards = f => JSON.parse(fs.readFileSync(ROOT + "../../book/cards/" + f, "utf8")).cards;
const di = CG.cardSystem(cards("paladin.json").find(c => c.name === "Divine Intervention"), x => x), cg = CG.cardSystem(cards("paladin.json").find(c => c.name === "Consecrated Ground"), x => x);
console.log("Divine Intervention:", di.moment, di.momentRange, "| distance:", JSON.stringify(di.distance ?? ""), "| targets:", di.targets, "| after:", di.versions[0].after, "| no button in the text:", !di.versions[0].effects.includes("@Guard"));
console.log("Consecrated Ground: rounds", cg.areaCfg.rounds, "/", cg.versions[1].areaRounds, "| the zone effect on both:", cg.versions.every(v => v.fx.all[0]?.uuid === "{{fx:Consecrated Ground}}"));
const rs = CG.cardSystem(cards("archer.json").find(c => c.name === "Rolling Shot"), x => x), cs = CG.cardSystem(cards("archer.json").find(c => c.name === "Covering Shot"), x => x);
console.log("Rolling Shot: no Use button, an effect per version:", rs.versions.every(v => !v.effects.includes("@Use") && v.fx.all.length === 1), "| Covering Shot:", !cs.versions[0].effects.includes("@Use"), cs.versions[0].fx.all[0]?.uuid);
const act = src("module/actions.mjs"), dmg = src("module/damage.mjs"), cf = src("module/config.mjs");
console.log("wired: the moment asked before the damage lands", dmg.includes("downing = !!M?.wouldGoDown(actor, a);") && dmg.includes("const dm = downing ? await M.downMoment(actor, a, from) : null;"), "| the zone on the area", act.includes("areaSet.zone = { ...zn.zone, area: String(it.area ?? \"\").trim() }; areaSet.keep = true; zoneSkip = zn.uuids;"), "| the moment's chain by itself", act.includes("if ((it.moment && version.noTiers || saveNoDamage) && String(version.after ?? \"\").trim() && targets.length)"), "| the Tier 3 half", act.includes('(gg.does === "half" && halfHits(gg.on, tier ?? 0, !!chk?.crit)) || (gg.does2 === "half" && halfHits(gg.on2, tier ?? 0, !!chk?.crit))'), "| no hover on a trait word (v0.0.420)", cf.includes("const traitTip = () => \"\";"));
