// Run with: node tools/tests/run.mjs (or node tools/tests/t17.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// v0.0163 (was: archetype and weight Health): the Bestiary NPC model. A role and a rating for each number (npcBuild), Custom values,
// the derived NPC (AP a turn, Weapon and Power Modifiers), the Builder tab's rows, attack reference and check, and the dice that come close.
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } } };
const { NpcData, npcBuild } = await import(ROOTURL + "module/data.mjs");
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const { npcBuilderContext, diceFor, ratingUpdate } = await import(ROOTURL + "module/npcbuilder.mjs");
const all = r => ({ body: r, mind: r, appeal: r, instinct: r, bodyHm: r, mindHm: r, ad: r, wd: r });
console.log("--- every rating Medium, level 1 (the Bestiary: 6 / 26 / 50 / 108 Health)");
for (const role of Object.keys(TWOD12.npcRoles)) { const b = npcBuild({ role, ratings: all("medium") }); console.log(role.padEnd(9), `Health ${b.bdt + b.mdt} (${b.bdt} + ${b.mdt})  Attributes ${Object.values(b.attributes).join("/")}  AD ${b.armorDef} WD ${b.wardDef}  AP ${b.role.ap}`); }
console.log("--- every Defense rating (Terrible..Extreme; never below 11)");
for (const role of Object.keys(TWOD12.npcRoles)) console.log(role.padEnd(9), Object.keys(TWOD12.npcRatings).map(r => npcBuild({ role, ratings: { ...all("medium"), ad: r } }).armorDef).join(" "));
console.log("--- the Orc Warrior (Bestiary example): Body High, Mind Medium, Appeal Low, Instinct Medium; Body Health High, Mind Health Low; AD Medium, WD Low");
const orc = { role: "standard", ratings: { body: "high", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "high", mindHm: "low", ad: "medium", wd: "low" } };
{ const b = npcBuild(orc); console.log(`Health ${b.bdt + b.mdt} (Body ${b.bdt}, Mind ${b.mdt})  Attributes ${JSON.stringify(b.attributes)}  AD ${b.armorDef} WD ${b.wardDef}`); }
console.log("--- a Minion can't be Extreme (it counts as High); Terrible Health is x0");
{ const b = npcBuild({ role: "minion", ratings: { ...all("medium"), body: "extreme", bodyHm: "terrible" } }); console.log(`Body ${b.attributes.body}  Body Health ${b.bdt} (x${b.bodyHm})  Mind Health ${b.mdt}`); }
console.log("--- Custom values (typed numbers); a typed Defense under 11 is 11");
{ const b = npcBuild({ role: "standard", ratings: { ...all("medium"), appeal: "custom", bodyHm: "custom", ad: "custom", wd: "custom" }, custom: { appeal: 3, bodyHealth: 44 }, armorDef: 17, wardDef: 9 });
  console.log(`Appeal ${b.attributes.appeal}  Body Health ${b.bdt} (hm ${b.bodyHm})  AD ${b.armorDef} WD ${b.wardDef}`); }
console.log("--- the derived NPC");
const mk = (sys) => { const m = Object.create(NpcData.prototype); Object.assign(m, { level: 1, damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, custom: { body: 0, mind: 0, appeal: 0, instinct: 0, bodyHealth: 10, mindHealth: 10 }, armorDef: 13, wardDef: 13,
  weaponAttribute: "body", powerAttribute: "mind", speed: 5, reachBase: 1, armor: "medium", bodyWounds: 0, mindWounds: 0, parent: { type: "npc", items: [], itemTypes: { armor: [] } }, ...sys }); m.prepareDerivedData(); return m; };
for (const [label, sys] of [["Orc Warrior", { ...orc, powerAttribute: "instinct" }], ["a Minion", { role: "minion", ratings: all("medium") }], ["Elite, Power Attribute higher", { role: "elite", ratings: { ...all("medium"), mind: "extreme" } }]]) {
  const m = mk(sys); console.log(label.padEnd(30), `pool ${m.pool}  AP ${m.apPerTurn}  Weapon ${m.weaponMod} (${m.weaponAttribute})  Power ${m.powerMod} (${m.powerAttribute})  Signature ${m.signatureMod} from ${m.signatureFrom}  AD ${m.armorDC} WD ${m.wardDC}  ${m.roleLabel} CV ${m.cv}`);
}
console.log("--- dice that come close (the Modifier taken out)");
console.log([0, 0.4, 1, 2.5, 3, 4, 5.5, 7, 8, 10, 12.5].map(x => `${x}->${diceFor(x) || "[Mod]"}`).join("  "));
console.log("--- the Builder tab (Orc Warrior)");
const orcM = mk({ ...orc, powerAttribute: "instinct" });
const ctx = npcBuilderContext({ system: orcM });
for (const g of ctx.groups) console.log(`${g.title}: ` + g.rows.map(r => `${r.label} ${r.value} [${r.chips.filter(c => c.on).map(c => c.label).join("")}] (${r.how})`).join(" | "));
console.log("chips of Body:", ctx.groups[0].rows[0].chips.map(c => `${c.label}${c.value ? " " + c.value : ""}`).join(", "));
for (const a of ctx.attacks) console.log(`${a.label.padEnd(15)} ` + a.cells.map(c => `${c.label} ${c.avg} [${c.dice}]`).join(" | "));
for (const c of ctx.check) console.log(`check: ${c.k}: ${c.v} (${c.s})`);
console.log("roles:", ctx.roles.map(r => `${r.label} CV ${r.cv}${r.on ? " (on)" : ""}`).join(", "), "| CV:", ctx.cv, "| level note:", JSON.stringify(ctx.levelNote));
console.log("a Minion's tab:", npcBuilderContext({ system: mk({ role: "minion", ratings: all("medium"), level: 3 }) }).attacks.map(a => a.label).join(", "), "|", npcBuilderContext({ system: mk({ role: "minion", ratings: all("medium"), level: 3 }) }).levelNote);
console.log("--- v0.0.164: no Custom chip; clicking the selected chip clears it (Custom), any other chip selects it");
console.log("Body chips (label -> what a click writes):", ctx.groups[0].rows[0].chips.map(c => `${c.label}->${c.click}`).join(", "));
console.log("--- Custom numbers outside the tables: a warning, never prevented");
{ const m = mk({ role: "standard", ratings: { ...all("medium"), ad: "custom", wd: "custom", appeal: "custom", bodyHm: "custom", speed: "custom" }, armorDef: 1, wardDef: 18, custom: { body: 0, mind: 0, appeal: 3, instinct: 0, bodyHealth: 80, mindHealth: 10 }, speed: 9 });
  const c = npcBuilderContext({ system: m });
  console.log(`AD ${m.armorDC} WD ${m.wardDC} Speed ${m.speed} moveSpeed ${m.moveSpeed}`); for (const w of c.warnings) console.log("warning:", w); }
console.log("--- Speed: 3 to 7 (5 by default)");
{ const c = npcBuilderContext({ system: mk({ role: "standard", ratings: { ...all("medium"), speed: "7" } }) }), r = c.groups[3].rows[0];
  console.log(`Speed ${r.value}: ${r.chips.map(x => `${x.label}${x.on ? "*" : ""} (${x.value})`).join(", ")} | ${r.how}`); }
console.log("--- switching a rating to Custom keeps the number it showed");
console.log(JSON.stringify(ratingUpdate({ system: orcM }, "speed", "custom")), JSON.stringify(ratingUpdate({ system: orcM }, "appeal", "custom")), JSON.stringify(ratingUpdate({ system: orcM }, "bodyHm", "custom")), JSON.stringify(ratingUpdate({ system: orcM }, "wd", "custom")), JSON.stringify(ratingUpdate({ system: orcM }, "ad", "high")));
