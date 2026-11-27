// Run with: node tools/tests/run.mjs (or node tools/tests/t328.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
// v0.0.532 (Lucas, playtest 11, "yes to all"; the book first): the four rules. 1. Collision: a Prone, an Unconscious or a dead creature never causes
// one (passed through, not ended in; a dead one's space can be ended in). 2. Charge: Melee only, the stop at the Melee weapon's Range, the Basic
// Attack with the weapon chosen for the stop. 3. Taunted: no Bane when the Action's targets include the taunter. 4. Grabbed: Vulnerable 1 while held.
class F { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };

const mv = await import(ROOTURL + "module/move.mjs"), WR = await import(ROOTURL + "module/weaponrange.mjs"), CR = await import(ROOTURL + "module/condrules.mjs");
const CDOCS = (await import(ROOTURL + "tools/content.mjs")).allDocs;
console.log("--- 1. Collision");
const st = s => ({ has: k => s.includes(k) });
const tok = (name, opts = {}) => ({ name, actor: { type: opts.npc ? "npc" : "character", statuses: st(opts.st ?? []), system: { atZero: !!opts.zero } } });
for (const [label, t] of [["a standing orc", tok("Orc", { npc: true })], ["a Prone orc", tok("Orc", { npc: true, st: ["prone"] })], ["an Unconscious PC", tok("Aveline", { st: ["unconscious"] })], ["a dead orc (Dead status)", tok("Orc", { npc: true, st: ["dead"] })], ["an NPC at 0, not Unconscious", tok("Orc", { npc: true, zero: true })]]) console.log(`${label}: ${mv.collisionWay(t)}`);
// a Pushed 4 along a line of 5 squares (di 0..4); a creature lies in square 2; a wall beyond square 3 in the second case
const line = n => Array.from({ length: n + 1 }, (_, k) => ({ di: k, dj: 0 }));
const noWall = () => false, none = () => null;
const show = (label, N, o) => { const r = mv.analyzePath(line(N), N, o); console.log(label.padEnd(64), `stops after ${r.done}, block ${r.block?.type ?? "-"}, unused ${r.unused}, damage ${JSON.stringify(r.damage)}, passEnd ${r.passEnd}`); };
show("Pushed 4, a Prone creature in square 2 (passed through)", 4, { wallBetween: noWall, creatureAt: none, passAt: s => s.di === 2 });
show("Pushed 2, aimed into the Prone creature's square (stops before it)", 2, { wallBetween: noWall, creatureAt: none, passAt: s => s.di === 2 });
show("Pushed 4, a Prone creature in 2 and a wall after 3", 4, { wallBetween: (a, b) => b.di === 4, creatureAt: none, passAt: s => s.di === 2 });
show("Pushed 4, a Prone creature in 3 and a wall after 3 (last legal: 2)", 4, { wallBetween: (a, b) => b.di === 4, creatureAt: none, passAt: s => s.di === 3 });
show("Pushed 4, a standing creature in square 2 (a Collision, as before)", 4, { wallBetween: noWall, creatureAt: s => (s.di === 2 ? { name: "Orc" } : null) });
show("Reposition 3, a Prone creature in 2 (passes, no damage)", 3, { wallBetween: noWall, creatureAt: none, passAt: s => s.di === 2, damageless: true });
const dp = mv.forcedDragPath([{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }, { i: 0, j: 3 }], { wallAt: noWall, creatureAt: none, passAt: c => c.j === 2 });
console.log("the GM's Alt-drag through a lying creature, dropped beyond it:", JSON.stringify({ done: dp.done, block: dp.block, damage: dp.damage }));
const dp2 = mv.forcedDragPath([{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }], { wallAt: noWall, creatureAt: none, passAt: c => c.j === 2 });
console.log("dropped on it: stops before it:", dp2.done, JSON.stringify(dp2.damage));
const mvs = src("module/move.mjs");
console.log("the Push / Pull and Slid / Reposition tools and the Alt-drag read it:", (mvs.match(/collisionWay\(t\)/g) ?? []).length >= 3, (mvs.match(/passAt/g) ?? []).length >= 8);
console.log("--- 2. Charge: Melee only");
const w = (id, name, traits, extra = {}) => ({ id, name, system: { traits: new Set(traits), ...extra } });
const sword = w("s", "Arming Sword", ["melee"], { range: "1" }), long = w("l", "Longsword", ["melee", "long"], { range: "1" }), spear = w("p", "Spear", ["melee", "long"], { range: "2" }), bow = w("b", "Hunting Bow", ["ranged", "projectile"], { range: "12/24/48" }), axe = w("h", "Hand Axe", ["melee", "thrown"], { range: "1", thrownRange: "5/10" }), dagger = w("d", "Dagger", ["melee", "light", "thrown"], { range: "1", thrownRange: "4/8/12" });
const ways = list => list.map(x => `${x.label} ${x.normal}`).join(", ") || "none";
for (const [label, ws] of [["a bow", [bow]], ["a sword and a bow", [sword, bow]], ["a Thrown axe", [axe]], ["a sword and a dagger", [sword, dagger]], ["a sword and a spear (Range 2)", [sword, spear]]]) {
  const list = WR.chargeAttacks({ weapons: ws });
  console.log(`${label}: ${ways(list)} | ask: ${WR.chargeNeedsPick(list)} | the Basic Attack: ${JSON.stringify(WR.chargeUseWeapon(list, list[0]))}`);
}
const two = WR.chargeAttacks({ weapons: [sword, spear] });
console.log("the spear picked for the stop, its Basic Attack:", JSON.stringify(WR.chargeUseWeapon(two, two.find(x => x.label === "Spear"))));
console.log("Reach 2, the sword:", ways(WR.chargeAttacks({ weapons: [sword], reach: 2 })));
const orc = [w("a", "Hamstringing Axe", ["weapon", "melee", "strike"], { distance: "Reach (1)" }), w("j", "Barbed Javelin", ["weapon", "ranged", "strike"], { distance: "6" })];
const ogre = [w("g", "Crushing Grip", ["weapon", "melee", "strike"], { distance: "Reach (2)" }), w("r", "Roar", ["power", "ranged", "strike", "fear"], { distance: "6" })];
const goblinRanged = [w("k", "Sling", ["weapon", "ranged", "strike"], { distance: "6" })];
console.log("the Orc Warrior:", ways(WR.chargeAttacks({ weapons: [bow], npcAttacks: orc })), "| the Ogre Chieftain (Reach (2)):", ways(WR.chargeAttacks({ npcAttacks: ogre, reach: 2 })), "| a creature with only a ranged Basic attack:", ways(WR.chargeAttacks({ weapons: [sword], npcAttacks: goblinRanged })));
console.log("its Basic Attack, an NPC:", JSON.stringify(WR.chargeUseWeapon(WR.chargeAttacks({ npcAttacks: orc }), WR.chargeAttacks({ npcAttacks: orc })[0])));
console.log("refused, a PC with a bow:", WR.chargeRefusal({ name: "Sylwen", type: "character" }, WR.chargeAttacks({ weapons: [bow] })));
console.log("refused, an NPC:", WR.chargeRefusal({ name: "Archer", type: "npc" }, []), "| allowed:", JSON.stringify(WR.chargeRefusal({ name: "Durgan" }, WR.chargeAttacks({ weapons: [sword] }))));
const act = src("module/actions.mjs"), fu = src("module/freeuse.mjs");
console.log("refused before its AP:", act.includes('if (basicKey === "charge") {') && act.includes("chargeRefusal(actor, chargeAttacks("), "| the granted use takes the stop's weapon:", fu.includes("weaponId: chargeWith.weaponId") && fu.includes("chargeWith.actionId"), "| kept on chargeUse:", mvs.includes('c.setFlag(F, "chargeUse", { messageId, ...use })'));
console.log("--- 3. Taunted and several targets");
const m = { vsOrigin: "not" };
for (const [label, list] of [["the goblin only", ["goblin"]], ["the ogre (the taunter) only", ["ogre"]], ["the ogre and the goblin", ["ogre", "goblin"]], ["two goblins", ["g1", "g2"]], ["no target", []]]) console.log(`${label}: Bane ${CR.originOk(m, "ogre", list)}`);
console.log("--- 4. Grabbed: Vulnerable 1 while held");
const grabbed = CDOCS.find(d => d.name === "Grabbed" && d.type === "effect");
console.log("its riders:", JSON.stringify((grabbed?.system?.conditions ?? []).map(r => [r.name, r.value])), "| linked:", grabbed?.system?.linked, "| ends with its holder:", !!grabbed?.system?.endsWithOrigin);
console.log("its text says it:", /Immobilized and Vulnerable 1/.test(grabbed?.system?.description ?? ""));
const ef = src("module/effects.mjs");
console.log("a rider is created linked to it (it ends with Grabbed):", ef.includes("await createEffect(actor, cond, origin, { duration, ...(value !== undefined ? { value } : {}) }, { linkedTo: parent.id });"));
console.log("--- the book");
const b3 = fs.readFileSync(ROOT + "../../book/rules-src/03-movement.md", "utf8"), b8 = fs.readFileSync(ROOT + "../../book/rules-src/08-conditions.md", "utf8"), bc = fs.readFileSync(ROOT + "../../book/cards/basic-actions.json", "utf8");
console.log("Chapter 3:", b3.includes("**A creature can't collide with a Prone, an Unconscious or a dead creature.**"), "| Chapter 8, Taunted:", b8.includes("An Action whose targets include that creature takes no Bane from Taunted"), "| Grabbed:", b8.includes("you are [[Immobilized]] and [[Vulnerable]] 1"), "| Charge:", bc.includes("within the melee Range of the Melee weapon you attack with"));
