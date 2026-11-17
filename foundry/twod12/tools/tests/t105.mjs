// Run with: node tools/tests/run.mjs (or node tools/tests/t105.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.117 (Round 10 of the rules): the Modifiers from the higher Attribute, Power and Signature, the roll kinds, 0 AP and 0R, the Turn Frequency.
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
const { classModifiers, modOf } = await import(ROOTURL + "module/modifiers.mjs");
console.log("--- Modifier = Attribute ÷ 2 + 1, rounded up:", [-1, 0, 1, 2, 3, 4, 5].map(v => `${v}→${modOf(v)}`).join(" "));
const show = r => `Weapon ${r.weapon.key || "-"} ${r.weapon.mod} | Power ${r.power.key || "-"} ${r.power.mod} | Signature ${r.signature.key || "-"} ${r.signature.mod} (${r.signature.from})${r.conflict ? " | both wanted the same" : ""}`;
const PAL = [["body", "appeal"], ["mind", "appeal"]], ARC = [["instinct", "body"], ["mind", "appeal"]];
console.log("Paladin Body 2, Mind 1, Appeal 1:", show(classModifiers({ body: 2, mind: 1, appeal: 1 }, ...PAL)));
console.log("Paladin Body 1, Mind 2, Appeal 3, Weapon keeps it:", show(classModifiers({ body: 1, mind: 2, appeal: 3 }, ...PAL, "weapon")));
console.log("Paladin Body 1, Mind 2, Appeal 3, Power keeps it: ", show(classModifiers({ body: 1, mind: 2, appeal: 3 }, ...PAL, "power")));
console.log("Paladin Appeal 3 and Body 3 (no real conflict):    ", show(classModifiers({ body: 3, mind: 0, appeal: 3 }, ...PAL)));
console.log("Archer Instinct 2, Body 0, Mind 1, Appeal 2:       ", show(classModifiers({ instinct: 2, body: 0, mind: 1, appeal: 2 }, ...ARC)));
console.log("a class from before (one Attribute each):          ", show(classModifiers({ body: 2, appeal: 3 }, ["body"], ["appeal"])));
console.log("both lists only Appeal (must share):               ", show(classModifiers({ appeal: 3 }, ["appeal"], ["appeal"])));
console.log("no class:                                          ", show(classModifiers({ body: 2 }, [], [])));

console.log("--- what an Action rolls (rollsource.mjs)");
const { rollSource, rollTraits, attrFromTier } = await import(ROOTURL + "module/rollsource.mjs");
const S = a => new Set(a);
const sys = { attributes: { body: 2, mind: 1, appeal: 3, instinct: 0 }, weaponAttribute: "body", weaponMod: 2, powerAttribute: "appeal", powerMod: 3, signatureAttribute: "appeal", signatureMod: 3 };
for (const [name, it] of [["Smite", { traits: S(["divine", "strike", "weapon"]) }], ["Judgment", { traits: S(["divine", "magic"]) }], ["a Signature Action", { traits: S(["signature", "strike"]) }], ["Trip", { traits: S(["body", "instinct", "strike"]) }], ["Interact", { traits: S(["handle"]) }]]) {
  const r = rollSource(sys, it);
  console.log(name.padEnd(20), "|", r.kind, r.attrKey, r.mod, "|", r.label, "| Attribute on the damage from Tier", attrFromTier(r), "| effects see:", [...rollTraits(it.traits, r)].filter(t => !it.traits.has(t)).join(", "));
}
console.log("an old card (isWeapon only): from Tier", attrFromTier({ isWeapon: true }), "| an old Power card:", attrFromTier({ isWeapon: false }));
console.log("--- damage previews (calc.tierAvg): a 1d8 Action with Attribute 3");
const { tierAvg } = await import(ROOTURL + "module/calc.mjs");
const inst = [{ dice: "1d8" }];
for (const m of ["t2", "all", "none"]) console.log(m.padEnd(5), [1, 2, 3].map(t => tierAvg(inst, t, { attrVal: 3, attrMode: m })).join(" / "));
console.log("old isWeapon:", [1, 2, 3].map(t => tierAvg(inst, t, { attrVal: 3, isWeapon: true })).join(" / "), "| no damage on a tier adds nothing:", tierAvg([], 1, { attrVal: 3, attrMode: "all" }));

console.log("--- costs and the Turn Frequency");
const C = await import(ROOTURL + "module/config.mjs");
const strip = h => h.replace(/<[^>]+>/g, "");
console.log("0 AP:", strip(C.apLabel([0])), "| 0R:", strip(C.apLabel([0], true)), "| 1/2R:", strip(C.apLabel([1, 2], true)), "| Turn:", C.TWOD12.frequencies.turn, C.FREQ_COLORS.turn, "| Power is the label of the magic key:", C.TWOD12.traits.magic, "| Signature:", C.TWOD12.traits.signature);
console.log("roll kinds:", JSON.stringify(C.TWOD12.rollKinds));
globalThis.game = { combat: { started: true, id: "c1", round: 2, turn: 1 } };
const U = await import(ROOTURL + "module/usage.mjs");
const flags = {}; const actor = { type: "character", isOwner: true, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; } };
const rebuke = { id: "rb", type: "action", system: { frequency: "turn", traits: S(["divine", "magic"]) } };
console.log("before:", JSON.stringify(U.isFaded(actor, rebuke)));
await U.markUsed(actor, rebuke); console.log("used on turn 1:", JSON.stringify(U.isFaded(actor, rebuke)));
game.combat.turn = 2; console.log("the next creature's turn:", JSON.stringify(U.isFaded(actor, rebuke)));
await U.markUsed(actor, rebuke); game.combat.round = 3; game.combat.turn = 2; console.log("a new round, same turn number:", JSON.stringify(U.isFaded(actor, rebuke)));
console.log("--- the data and the sheets");
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("a Version can cost 0:", src("module/data.mjs").includes("ap: int(1, 0)"), "| the class has modPriority:", src("module/data.mjs").includes("modPriority: choice("), "| effect settings accept roll kinds:", src("module/data.mjs").includes("all: predSet()"));
console.log("class dialog (v0.0.415: gone; a class without levels asks for its levels):", src("module/grants.mjs").includes("has no levels yet: open the class and use Edit levels first"), "| no Weapon/Magic pick:", !src("module/grants.mjs").includes('"Magic Modifier", s.magicAttrs'), "| sheet shows Power and Signature:", src("module/actor-sheets.mjs").includes('modTile("Signature"'));
{ const pal = JSON.parse(src("packs/_source/classes/paladin.class.json")).system, arc = JSON.parse(src("packs/_source/classes/archer.class.json")).system;   // pack MOD (v0.0.305): class values, no Attribute lists
  console.log("compendium Paladin Modifiers:", pal.modHigh, pal.modLow, pal.modOrder, "| Archer:", arc.modHigh, arc.modLow, arc.modOrder); }
