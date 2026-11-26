// Run with: node tools/tests/run.mjs (or node tools/tests/t302.mjs)
// v0.0.494 (Playtest 8 Pass 1 — Rules & Balance Lock-In):
// (1) [Magical] Keyword trait + [Ranged] on Drawing Light & Harrying Shot;
// (2) Shared At-will [Strike] count across different Actions (while non-Strike At-wills stay independent);
// (3) Darting Blade costs 2 AP;
// (4) Heal Basic Action T1 1 RP / T2 2 RP / T3 2 RP + Stand (Handle kept, 2 AP);
// (5) Cover Banes apply only to [Strike] and [Area] Actions; Large target Cover checks each occupied 1x1 square (least cover wins);
//     Demoralize T2 Vulnerable 1 (EoT), T3 Vulnerable 1 (1 round), EoE per-target immunity warning & tracking;
// (6) Interrupts before Triggers rule documented in Chapter 2.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(ROOTURL);
const src = f => fs.readFileSync(ROOT + f, "utf8");

let flag = null, cflag = null;
globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { Canvas: { polygonBackends: {} }, time: {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  abstract: { TypeDataModel: class { static migrateData(s) { return s; } } },
  data: { fields: { SchemaField: class {}, NumberField: class {}, StringField: class {}, BooleanField: class {}, ArrayField: class {}, SetField: class {}, HTMLField: class {} } },
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id_1" }
};
const combatant = { id: "cbt1", actor: null, isOwner: true, getFlag: () => cflag, setFlag: async (s, k, v) => { cflag = JSON.parse(JSON.stringify(v)); } };
globalThis.game = {
  system: { version: "0.0.494" },
  user: { id: "gm", isGM: true, isActiveGM: true },
  settings: { register() {}, get: () => true },
  combat: { started: true, id: "comb1", round: 1, turn: 0, turns: [combatant], combatants: [combatant] }
};

// 1. [Magical] trait + Drawing Light / Harrying Shot traits + Darting Blade 2 AP
const CF = await import(ROOTURL + "module/config.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
const dl = C.docs.find(d => d.name === "Drawing Light");
const hs = C.docs.find(d => d.name === "Harrying Shot");
const db = C.docs.find(d => d.name === "Darting Blade");
console.log("Magical trait:", CF.TWOD12.actionTraits.magical, "| group:", CF.traitGroupOf("magical"));
console.log("Drawing Light traits:", dl.system.traits.join(","));
console.log("Harrying Shot traits:", hs.system.traits.join(","));
console.log("Darting Blade AP:", db.system.versions[0].ap);

// 2. Shared At-will [Strike] count vs separate non-Strike At-will counts
game.combat = { started: true, id: "comb1", round: 1, turn: 0, turns: [combatant], combatants: [combatant] };
const U = await import(ROOTURL + "module/usage.mjs");
const actor = { type: "character", isOwner: true, getFlag: () => flag, setFlag: async (s, k, v) => { flag = JSON.parse(JSON.stringify(v)); } };
combatant.actor = actor;
const mkAct = (id, traits) => ({ id, type: "action", system: { frequency: "atwill", traits: new Set(traits) }, getFlag: () => null });
const basicAtk = mkAct("ba", ["weapon", "strike"]);
const drawLight = mkAct("dl", ["divine", "magical", "magic", "ranged", "strike"]);
const healAct = mkAct("heal", ["appeal", "handle", "mind"]);
const breakFree = mkAct("bf", ["body", "instinct", "move"]);
await U.markUsed(actor, basicAtk);
console.log("After Basic Attack -> Drawing Light Banes:", U.atWillUses(actor, drawLight), "| Basic Attack Banes:", U.atWillUses(actor, basicAtk), "| Heal Banes:", U.atWillUses(actor, healAct));
await U.markUsed(actor, drawLight);
console.log("After Drawing Light -> 3rd Strike Banes:", U.atWillUses(actor, basicAtk), "| Strikes:", U.strikesUsed(actor));
await U.unmarkUsed(actor, drawLight);
console.log("After unmarkUsed(Drawing Light) -> Banes:", U.atWillUses(actor, basicAtk), "| Strikes:", U.strikesUsed(actor));
await U.markAtWill(actor, basicAtk);
console.log("After markAtWill(Charge Basic) -> Drawing Light Banes:", U.atWillUses(actor, drawLight));
await U.markUsed(actor, healAct);
console.log("Non-Strike At-wills separate -> Heal:", U.atWillUses(actor, healAct), "| Break Free:", U.atWillUses(actor, breakFree));

// 3. Heal & Demoralize Basic Action data
const heal = BASIC_ACTIONS.heal;
const dem = BASIC_ACTIONS.demoralize;
console.log("Heal:", heal.traits.join(","), "| AP:", heal.versions[0].ap, "| T1:", heal.versions[0].x1, "| T2:", heal.versions[0].x2, "| T3:", heal.versions[0].x3);
console.log("Demoralize:", dem.traits.join(","), "| T1:", dem.versions[0].x1, "| T2:", dem.versions[0].x2, "| T3:", dem.versions[0].x3, "| Special:", dem.special);

// 4. Demoralize EoE immunity tracking & actions.mjs wiring
console.log("Demoralize EoE before:", U.demoralizedTarget(actor, "Scene.s1.Token.orc1"));
await U.markDemoralized(actor, ["Scene.s1.Token.orc1"]);
console.log("Demoralize EoE after:", U.demoralizedTarget(actor, "Scene.s1.Token.orc1"), "| other target:", U.demoralizedTarget(actor, "Scene.s1.Token.orc2"));
game.combat.id = "comb2";
console.log("Demoralize EoE new combat:", U.demoralizedTarget(actor, "Scene.s1.Token.orc1"));
const actsSrc = src("module/actions.mjs");
console.log("Demoralize dialog warning & mark wired:", actsSrc.includes("demoralizedTarget(actor, tu)") && actsSrc.includes("await markDemoralized(actor, dTargets)"));

// 5. Cover applicability ([Strike] and [Area] only)
const A = await import(ROOTURL + "module/actions.mjs");
console.log("coverBanesApply Strike/Area/Demoralize/Shove/Kneel:",
  A.coverBanesApply({}, new Set(["weapon", "strike"])),
  A.coverBanesApply({}, new Set(["power", "save", "area"])),
  A.coverBanesApply({}, new Set(["appeal"])),
  A.coverBanesApply({}, new Set(["body", "handle"])),
  A.coverBanesApply({}, new Set(["power", "save", "divine"]))
);

// 6. Large 2x2 target Cover: doorway scenario (only 1 of 4 squares exposed -> No cover!)
const S = 100;
globalThis.canvas = { grid: { size: S, isSquare: true }, tokens: { placeables: [] } };
const CV = await import(ROOTURL + "module/cover.mjs");
const tok = (id, x, y, w = 1, h = 1) => ({ id, name: id, document: { x: x * S, y: y * S, width: w, height: h, hidden: false } });
const attacker = tok("A", 1, 2);   // center (150, 250)
const ogre = tok("Ogre", 4, 1, 2, 2);   // occupies (4,1),(5,1),(4,2),(5,2): x 400..600, y 100..300
// Vertical doorway wall at x = 350 with an opening at y = 200..300 (row 2 open, rows 0..1 and 3+ walled)
const doorwayWall = (a, b) => {
  const X = 350;
  if ((a.x - X) * (b.x - X) >= 0) return false;
  const t = (X - a.x) / (b.x - a.x);
  const y = a.y + t * (b.y - a.y);
  return y < 200 || y > 300;
};
const doorCov = CV.coverBetween(attacker, ogre, { blockedFn: doorwayWall, others: [] });
const doorPointCov = CV.coverFromPoint({ x: 150, y: 250 }, ogre, { blockedFn: doorwayWall, others: [] });
console.log("Large target in doorway (coverBetween):", doorCov.label, "| blocked:", doorCov.blocked, "| banes:", doorCov.banes, "| chosen center:", JSON.stringify(doorCov.center));
console.log("Large target in doorway (coverFromPoint):", doorPointCov.label, "| blocked:", doorPointCov.blocked, "| banes:", doorPointCov.banes);
// All 4 squares behind solid wall -> Total cover (no LoE)
const solidCov = CV.coverBetween(attacker, ogre, { blockedFn: () => true, others: [] });
console.log("Large target fully walled:", solidCov.label, "| noLoE:", solidCov.noLoE);
// Creature in front of one square of Large target, another square clear -> No cover
const blocker = tok("B", 3, 2);   // blocks center line to (4,2), but not to (4,1)
const partialCrowd = CV.coverBetween(attacker, ogre, { blockedFn: () => false, others: [blocker] });
console.log("Large target with blocker on 1 square only:", partialCrowd.label, "| inWay:", partialCrowd.inWay, "| chosen center:", JSON.stringify(partialCrowd.center));

// 7. Book rules sanity check
const turnsMd = src("../../book/rules-src/02-turns.md");
const moveMd = src("../../book/rules-src/03-movement.md");
const traitsMd = src("../../book/rules-src/07-traits.md");
console.log("Book rules synced:",
  turnsMd.includes("every Interrupt resolves before any Trigger")
  && moveMd.includes("Cover Banes apply to [Strike] and [Area] Actions")
  && moveMd.includes("check each square it occupies and use the one with the least cover")
  && traitsMd.includes("### Divine, Fear, Focus and Magical")   /* v0.0.520: the cleanup audit merged the headings */
  && traitsMd.includes("All At-will [Strike] Actions share one At-will count")
);
