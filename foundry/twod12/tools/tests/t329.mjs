// Run with: node tools/tests/run.mjs (or node tools/tests/t329.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
// v0.0.532 (Lucas, playtest 11): the bugs. 1. Charge asked for the weapon twice (t328: the stop's weapon is the Basic Attack's). 2. The Advance's
// area: an ally's space is crossed, not stopped in; a Crawl's "ignores Difficult Terrain" ended with it. 3. The second diagonal carries over between
// drags. 4. Judge's card named the first target. 5. "1[D] + [Mod]" in its pool's color. 6. (v0.0.533: the token's icons are as before v0.0.532; Lucas meant the Token HUD's status palette) the palette keeps its size on screen when zoomed out. 7. The
// Encounter Log: a Collision's damage in Raw, the Save lines, Weak's extra in Raw, every enemy in the title.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };

globalThis.Hooks = { on() {} };
const mv = await import(ROOTURL + "module/move.mjs"), CF = await import(ROOTURL + "module/config.mjs"), A = await import(ROOTURL + "module/actions.mjs");
const FS = await import(ROOTURL + "module/statuspal.mjs"), L = await import(ROOTURL + "module/enclog.mjs");
console.log("--- 2. The Advance's area with an ally in the path");
// a Medium creature at (0,0), Speed 3, an ally at (0,1): its square costs 2 to enter (Difficult Terrain) and can't be ended in
const ally = new Set(["0,1"]), kindAt = c => (ally.has(`${c.i},${c.j}`) ? "dt" : "");
const enterCost = c => (kindAt(c) === "dt" ? 1 : 0);
const area = mv.reachableCells([{ i: 0, j: 0 }], 3, () => false, 0, enterCost);
const { stops, through } = mv.rangeStops(area, kindAt, new Set(["0,0"]));
const has = (l, k) => l.some(c => `${c.i},${c.j}` === k);
console.log(`the ally's square: reachable ${has(area, "0,1")}, a stop ${has(stops, "0,1")}, crossed ${has(through, "0,1")}`);
console.log(`along the row: (0,2) ${has(stops, "0,2")} (2 + 1), (0,3) ${has(stops, "0,3")} (it would cost 4)`);
console.log(`stops ${stops.length}, crossed ${through.length}, the area ${area.length}`);
const ms = src("module/move.mjs");
console.log("drawn from rangeStops, the crossed squares hatched:", ms.includes("const { stops: area, through } = rangeStops(area0, whoAt, own);") && ms.includes("for (const x of through) hatch(x, MK.INK, 0.35);"));
console.log("a Crawl's 'dt' ends with its squares:", ms.includes('const crawlEnded = !evadeEnded && useFree > 0 && free <= 0 && c.getFlag(F, "ignoreTerrain") === "dt";'));
console.log("--- 3. The second diagonal across drags");
for (const [p, d] of [[0, 1], [1, 1], [1, 2], [1, 3], [0, 2], [0, 0], [1, 0]]) console.log(`after a count of ${p}, a drag with ${d} diagonal${d === 1 ? "" : "s"}: ${JSON.stringify(mv.diagonalStep(p, d))}`);
// one movement of 2 diagonals in two drags: the second costs 2, as in one drag (1 + 2 = 3)
const s1 = mv.diagonalStep(0, 1), s2 = mv.diagonalStep(s1.par, 1);
console.log(`two drags of 1 diagonal each: ${1 + s1.extra} + ${1 + s2.extra} = ${2 + s1.extra + s2.extra} squares (one drag of 2: 3)`);
console.log("every drag of the creature's own movement:", ms.includes("const p = num(c.getFlag(F, \"diagPar\")) % 2, step = diagonalStep(p,") && !ms.includes("if (evading && !ch) {\n        const p = num"), "| kept on each drag:", ms.includes("...(par !== null && par !== undefined ? { [`flags.${F}.diagPar`]: num(par) % 2 } : {})"));
console.log("from 0 at the start of a turn:", (src("module/combat.mjs").match(/\[`flags\.\$\{F\}\.diagPar`\]: 0/g) ?? []).length, "| off its turn:", ms.includes('if (combat?.combatant?.id !== c.id) await c.setFlag(F, "diagPar", 0);'));
console.log("--- 4. The card names the creature the Action was resolved against");
const t = id => ({ id });
console.log("same:", A.targetsChanged([t("gw")], [t("gw")]), "| changed:", A.targetsChanged([t("gw")], [t("ogre")]), "| one more:", A.targetsChanged([t("gw")], [t("gw"), t("ogre")]), "| none to one:", A.targetsChanged([], [t("ogre")]));
const as = src("module/actions.mjs");
console.log("run again on the new targets when Roll is pressed:", as.includes("if (!rdData.restart && rollsAtOthers && !isAreaAction && !senseFree && targetsChanged(aimed, [...(game.user?.targets ?? [])])) return useAction("));
console.log("--- 5. [D] in its pool's color");
for (const x of ["[V] 1[W] + 1[D] + [Mod]", "[V] 1[D] + [Mod]", "[V] 1[W] + [Mod]", "2[D] Pi"]) console.log(`${x} -> ${CF.prettyDamage(x).replace(/<i class="[^"]*"><\/i>/g, "(pool)")}`);
console.log("--- 6. (v0.0.533) The status palette's size on screen (statuspal.mjs paletteScale, clampShift); fxscale.mjs gone:", !fs.existsSync(ROOT + "module/fxscale.mjs") && !src("module/twod12.mjs").includes("fxscale"));
for (const z of [1, 0.6, 0.4, 0.25, 0.1, 2, 0, NaN]) console.log(`zoom ${z}: the palette (430 px) is ${(430 * z * FS.paletteScale(z)).toFixed(0)} px on screen; scale ${FS.paletteScale(z).toFixed(2)}`);
console.log("inside the window (1280 x 720):", JSON.stringify(FS.clampShift({ left: 900, top: 100, right: 1330, bottom: 500 }, 1280, 720)), JSON.stringify(FS.clampShift({ left: 100, top: -40, right: 530, bottom: 400 }, 1280, 720)), JSON.stringify(FS.clampShift({ left: 100, top: 100, right: 530, bottom: 900 }, 1280, 720)), "| taller than the window:", JSON.stringify(FS.clampShift({ left: 100, top: 50, right: 530, bottom: 900 }, 1280, 600)), "| inside: none:", JSON.stringify(FS.clampShift({ left: 100, top: 100, right: 530, bottom: 500 }, 1280, 720)));
console.log("the CSS: scale and translate from its top-left corner:", src("styles/system.css").includes("#token-hud .status-effects.twod12-statuspal { scale: var(--twod12-palk, 1); translate: var(--twod12-paldx, 0px) var(--twod12-paldy, 0px); transform-origin: 0 0; }"), "| on canvasPan and when it opens:", src("module/statuspal.mjs").includes('Hooks.on("canvasPan", queueFit)') && src("module/statuspal.mjs").includes('attributeFilter: ["class"]'));
console.log("the token's icons as before v0.0.532 (no registerFxScale):", !src("module/twod12.mjs").includes("registerFxScale"));
console.log("--- 7. The Encounter Log");
console.log("a card's line replaces the by-hand one:", L.sameAsManual({ n: 2, at: 1000 }, 2, 2500), L.sameAsManual({ n: 2, at: 1000 }, 3, 1500), L.sameAsManual({ n: 2, at: 1000 }, 2, 4000));
console.log("the title:", L.foeTitle(["Ogre Chieftain", "Orc Warrior", "Grave Wisp", "Goblin Sneak 1", "Goblin Sneak 2"]));
console.log("a Save line:", L.lineText({ k: "save", who: { name: "Aveline" }, d: { label: "Instinct Save", total: 16, dc: 14, tier: 2, action: "Crack the Ground" } }));
const log = [
  { r: 1, t: 0, own: { id: "oc", name: "Ogre Chieftain" }, k: "act", who: { id: "oc", name: "Ogre Chieftain" }, d: { name: "Crack the Ground", save: "Instinct", tg: [{ id: "av", name: "Aveline" }, { id: "ka", name: "Kaela" }] } },
  { r: 1, t: 0, own: { id: "oc", name: "Ogre Chieftain" }, k: "save", who: { id: "av", name: "Aveline" }, d: { label: "Instinct Save", total: 19, dc: 14, tier: 3, action: "Crack the Ground" } },
  { r: 1, t: 0, own: { id: "oc", name: "Ogre Chieftain" }, k: "save", who: { id: "ka", name: "Kaela" }, d: { label: "Instinct Save", total: 21, dc: 14, tier: 3, action: "Crack the Ground" } },
  { r: 1, t: 0, own: { id: "oc", name: "Ogre Chieftain" }, k: "dmg", who: { id: "ka", name: "Kaela" }, d: { n: 2, v: 2, r: 0, text: "2 Vigor", raw: 2, reducedBy: 0, collision: true, note: "Collision", origin: { id: "oc", name: "Ogre Chieftain" } } },
  { r: 1, t: 0, own: { id: "oc", name: "Ogre Chieftain" }, k: "dmg", who: { id: "gw", name: "Grave Wisp" }, d: { n: 9, v: 0, r: 9, pool: "R", text: "9 Resolve", raw: 9, reducedBy: 0, origin: { id: "du", name: "Durgan" } } }
];
const cast = [{ id: "oc", name: "Ogre Chieftain", side: "npc", maxHp: 90 }, { id: "av", name: "Aveline", side: "pc", maxHp: 50 }, { id: "ka", name: "Kaela", side: "pc", maxHp: 41 }, { id: "gw", name: "Grave Wisp", side: "npc", maxHp: 22 }, { id: "du", name: "Durgan", side: "pc", maxHp: 50 }];
const stt = L.computeEncounterStats(log, cast), row = n => stt.rows.find(x => x.name === n);
console.log(`Kaela: Raw ${row("Kaela").rawTaken}, Adjust ${row("Kaela").adjust}, Net ${row("Kaela").netTaken} | the Wisp: Raw ${row("Grave Wisp").rawTaken}, Net ${row("Grave Wisp").netTaken}`);
console.log(L.exportAnalysis(log, cast, { title: "vs " + L.foeTitle(["Ogre Chieftain", "Grave Wisp"]) }).split("\n").filter(x => /^- |^# /.test(x)).join("\n"));
const cc = src("module/ccdamage.mjs"), inl = src("module/inline.mjs");
console.log("Weak's extra in Raw:", cc.includes("const rawLog = Math.max(rawPre, a.B + a.M);") && cc.includes("raw: rawLog,"), "| a Collision's damage logged as a card's:", ms.includes("collision: true, note: \"Collision\"") && !ms.includes("await applyToActor(target.actor, bodyDamage(d.self));"), "| each Save logged:", inl.includes("logSave(actor, { label: `${TWOD12.attributes[key]} Save`, total: chk.total, dc, tier: chk.tier"));
