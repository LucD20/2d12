// Run with: node tools/tests/run.mjs (or node tools/tests/t148.mjs)
// v0.0.415 (pack CL): templates/actor-sheet.hbs (unused since v0.0.291) is retired to foundry/deprecated/; this test's template checks read actor-sheet-pc.hbs, and a check that prints false was a piece of the old sheet's markup that the redesigned sheet (v0.0.289, v0.0.291) does its own way.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.181 (pack C1, Foundry follows the book): E3's Stages and CV x100, the PC Health factor and Modifier steps, Guard, and the A1/P1 rules in code
// (Marked Quarry's Tier 1, Sharpshooter's into-melee Bane, a [Signature, Weapon] Action against AD).
class F { constructor(o) { this.o = o; } }
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: F, NumberField: F, StringField: F, BooleanField: F, ArrayField: F, SetField: F, HTMLField: F } }, utils: {} };
globalThis.game = { combat: null };
const cf = await import(ROOTURL + "module/config.mjs"), { TWOD12 } = cf;
const { CharacterData, npcBuild } = await import(ROOTURL + "module/data.mjs");
const { npcBuilderContext, cvTip, stageLabel } = await import(ROOTURL + "module/npcbuilder.mjs");
const G = await import(ROOTURL + "module/guard.mjs"), D = await import(ROOTURL + "module/defense.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");

console.log("--- Stages (v0.0.407: levels 1-3, 4-7, 8-11, 12-15)");
console.log([0, 1, 3, 4, 7, 8, 11, 12, 15, 16].map(l => `${l}:${cf.stageOf(l)}`).join(" "), "|", [0, 1, 2, 3].map(stageLabel).join(" | "));
console.log("--- every rating Medium, by Stage (the book since pack R-bestiary: Minion 6/8/10, Grunt 24/26/38, Standard 56/62/98, Elite 118/136/216)");
const all = r => ({ body: r, mind: r, appeal: r, instinct: r, bodyHm: r, mindHm: r, ad: r, wd: r });
for (const role of Object.keys(TWOD12.npcRoles)) console.log(role.padEnd(9), [1, 4, 8, 12].map(level => { const b = npcBuild({ role, level, ratings: all("medium") }); return b.bdt + b.mdt; }).join(" / "));
console.log("the same at every level of a Stage:", [1, 2, 3].every(level => npcBuild({ role: "standard", level, ratings: all("medium") }).bdt === 30), "(Stage 0: 30, a ready number) | above level 15: Stage 3:", npcBuild({ role: "elite", level: 16, ratings: all("medium") }).bdt === npcBuild({ role: "elite", level: 12, ratings: all("medium") }).bdt);
console.log("--- every row of the book's tables (Health Multiplier; Basic attack Tier 2 / Tier 3)");
for (const [role, r] of Object.entries(TWOD12.npcRoles)) for (const st of [1, 2, 3]) {
  const lv = [4, 8, 12][st - 1], ks = r.extreme ? ["terrible", "low", "medium", "high", "extreme"] : ["terrible", "low", "medium", "high"];
  console.log(`${role.padEnd(9)} Stage ${st}:`, ks.map(k => `x${cf.npcHm(role, k, lv)} ${cf.npcDamage(role, k, lv).join("/")}`).join(" | "));
}
console.log("a Special Action (x2.2, Stage 1 Standard Medium; the book: about 13 / 24):", cf.npcDamage("standard", "medium", 1, 2.2).join(" / "));
console.log("old level factors gone:", !("npcBump" in TWOD12) && !("npcMeasured" in TWOD12) && !("npcMaxLevel" in TWOD12) && !("npcTableLevel" in cf));
console.log("--- CV x100, lower for an NPC of an earlier Stage than the party");
for (const role of Object.keys(TWOD12.npcRoles)) console.log(role.padEnd(9), `its Stage ${cf.npcCv(role, 1, 1)} | one Stage below ${cf.npcCv(role, 1, 4)} | two below ${cf.npcCv(role, 2, 9)} | above the party ${cf.npcCv(role, 8, 1)}`);
console.log("tooltip:", cvTip(TWOD12.npcRoles.standard));
const actor = lv => ({ system: { ...{ role: "grunt", level: lv, ratings: all("medium"), custom: {}, weaponMod: 1 } }, getFlag: () => undefined });
const ctx = npcBuilderContext(actor(6));
console.log("Builder at level 6:", ctx.stageLabel, "| CV", ctx.cv, "| basic:", ctx.attacks[0].cells.map(c => c.avg).join(" | "), "| check:", ctx.check[1].s.split(".")[0], "| note:", JSON.stringify(ctx.levelNote), "| level 11:", JSON.stringify(npcBuilderContext(actor(11)).levelNote));
const tpl = src("templates/actor-sheet-pc.hbs");
console.log("sheet: CV tooltips from the role:", (tpl.match(/\{\{(head|builder)\.cvTip\}\}/g) ?? []).length, "| the Stage under the Level:", tpl.includes("{{builder.stageLabel}}"));

console.log("--- PCs (pack R): the Health line by Stage (the book: a Human Paladin, high on Vigor: 23 / 12 = 35; Stage 2: 35 / 18 = 53); the Modifiers +1 at Stage 3 only");
const mk = (type, system, name = "x") => ({ type, system, name });
const pcAt = (lv, mods = {}) => {
  const s = Object.create(CharacterData.prototype);
  s.level = lv; s.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }; s.rallyUsed = 0; s.exhausted = 0; s.bodyWounds = 0; s.mindWounds = 0;
  s.parent = { items: [mk("species", { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, pickTwo: true, chosen: ["body", "appeal"], bodyMod: 3, mindMod: 2, pickHealth: true, speed: 5 }, "Human"),
    mk("class", { chosenA: "body", chosenB: "mind", healthHigh: 20, healthLow: 10, stepHigh2: 12, stepLow2: 6, stepHigh3: 14, stepLow3: 7, rallyMod: 6, weaponAttrs: new Set(["body", "appeal"]), magicAttrs: new Set(["mind", "appeal"]), ...mods }, "Paladin")] };   // pack R: the Health line
  s.parent.itemTypes = { species: [s.parent.items[0]], class: [s.parent.items[1]], feature: [], weapon: [], armor: [] };
  s.prepareDerivedData(); return s;
};
for (const lv of [1, 3, 4, 8, 12]) { const s = pcAt(lv); console.log(`level ${String(lv).padStart(2)}: BDT ${s.bdt} MDT ${s.mdt} Pool ${s.pool} | Weapon ${s.weaponMod} Power ${s.powerMod} Signature ${s.signatureMod} (${s.signatureFrom}) | Stage ${s.stage}`); }
console.log("never above +4:", [[3, 1], [3, 5], [3, 8], [4, 8], [5, 8], [1, 8]].map(([m, l]) => `${m} at ${l} -> ${cf.stageMod(m, l)}`).join(", "));
console.log("NPCs: no step (pack MOD: the role's values, no Stage):", src("module/data.mjs").includes("this.weaponMod = npcModValue(this.role, mr.weapon);"));

console.log("--- Guard (Chapter 4: Zack has Guard 6 and takes 8 Body damage: 6 to the Guard, 2 Body)");
const dm = (bl, bn, ml, mn) => ({ B: { l: bl, n: bn }, M: { l: ml, n: mn } });
for (const [g, a] of [[6, dm(8, 0, 0, 0)], [10, dm(4, 0, 3, 0)], [5, dm(0, 2, 6, 1)], [0, dm(3, 0, 0, 0)]]) { const r = G.absorbGuard(g, a); console.log(`Guard ${g} vs ${JSON.stringify(a)} -> takes ${r.taken}, Guard ${r.guard} left, Health gets ${JSON.stringify(r.a)}`); }
console.log("keep the higher:", G.gainGuard(6, 4), G.gainGuard(3, 7.6), G.gainGuard(0, -2));
const dmg = src("module/damage.mjs"), esc = src("module/escalation.mjs"), inl = src("module/inline.mjs");
console.log("damage goes through the Guard first:", dmg.includes("const g = absorbGuard(actor.system.guard, a, actor.system.apGuard"), "| each target its own:", dmg.includes("const mine = { B: { ...a.B }, M: { ...a.M } };"), "| ends with the encounter:", esc.includes('if (a.system?.guard > 0) g["system.guard"] = 0;'), "| @Guard and @Effect buttons:", inl.includes("|Guard|Effect|"), "| on the sheet:", tpl.includes('class="np-guardbtn'));

console.log("--- the Archer (A1) and the Paladin (P1) in code");
// v0.0.186: Marked Quarry's Tier 1 and Sharpshooter are settings on their cards now (automation.mjs; tested in t151).
console.log("Engaged Banes read the Ignore a Bane settings:", (src("module/actions.mjs").match(/!noEngagedTarget\.length/g) ?? []).length);
const item = traits => ({ system: { vs: "", traits: new Set(traits) } });
console.log("Defense: [Signature, Weapon] (Smite) from power:", D.defenseOf(item(["signature", "weapon", "strike"]), { kind: "signature", from: "power" }).type, "| [Power, Signature]:", D.defenseOf(item(["signature", "power"]), { kind: "signature", from: "weapon" }).type, "| Signature alone:", D.defenseOf(item(["signature"]), { kind: "signature", from: "power" }).type);
console.log("card: Smite Vs.", cf.vsText({ traits: new Set(["divine", "signature", "strike", "weapon"]), versions: [{ noTiers: false }] }));
const ral = src("module/rally.mjs");
console.log("Rally Points read the Rally settings (Font of Mercy):", ral.includes("const fm = await rallyBonusFor(actor);"), ral.includes("const total = (s.rallyHeal + (fm?.bonus ?? 0)) * n + (extraRoll?.total ?? 0);"));
console.log("a [Signature, Weapon] Action adds its [Mod] on Tier 2-3 (card, damage; v0.0.439: the old preview retired):", (src("module/actions.mjs").match(/isWeapon: modOnWeapon\(src, useTraits\)/g) ?? []).length);
console.log("--- v0.0.182: Evade, the damage line with the Guard, the Guard display, granted uses");
const mv = src("module/move.mjs"), cb = src("module/combat.mjs");
console.log("an Evade keeps its unused squares until another Action:", mv.includes("need -= useEvade; evade -= useEvade;") && cb.includes('const evading = Number(c.getFlag(F, "evadeMove")) > 0') && cb.includes('if (evading) await c.update(')   /* v0.0.428: the line written first */);
console.log("one damage line:", [G.guardBefore(12, 5) + "7 Body" + G.guardAfter(5, 0), G.guardBefore(4, 4) + "no damage" + G.guardAfter(4, 3), JSON.stringify(G.guardBefore(6, 0))].join(" | "));
console.log("Guard on the donut and on the token bar:", tpl.includes('class="np-donutwrap{{#if system.guard}} guarded{{/if}}"') && !tpl.includes('hb-meter guard'), src("module/healthbar.mjs").includes("COLORS.guard, 0.95"));
console.log("granted use without asking, Shift for a normal one, blue button, the dialog's first line:", !src("module/actions.mjs").includes('yes: { label: "Granted use" }'), src("module/actor-sheets.mjs").includes("event?.shiftKey ? { noGrant: true } : {}"), tpl.includes('class="ar-use granted"'), src("module/actions.mjs").includes("notices: [...(opts.grant ? [{ text: `Granted use:"));
console.log("v0.0.183: the damage card shows its result under the target line (no new message):", src("module/damage.mjs").includes('const block = `<div class="applied dres">') && src("styles/system.css").includes(":not(.dres):not(.dtexts) { display: none; }"), "| the Guard button (click +1, right-click -1, Ctrl 5):", src("module/actor-sheets.mjs").includes('for (const gb of this.element.querySelectorAll(".np-guardbtn")) for'));
