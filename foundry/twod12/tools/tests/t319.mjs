// Run with: node tools/tests/run.mjs (or node tools/tests/t319.mjs)
// v0.0.520 (the cleanup audit, 2026-11-26; book/audit-2026-11-25/foundry-needs.md): what Foundry follows of the book's 223 decided edits. The card
// model mirrors book/cards.py (a Version's own Requirement, Versions with the same lines printed once); "Reach (N)" read as the Reach; Heal is Tend;
// the rules built in general code: a Save's DC 13 by default (B1-006), the Table rolled before an encounter (B1-026), stabilizing with no roll
// (B1-089), damage while Unconscious and Down (B1-091), moving closer square by square (B1-038), who is in your way (B1-063), Break Free's Check
// (B2-010), Feint's Critical (B2-019), the Basic Attack without the Fists (B2-020), the Attribute you choose (B2-046), Drawing Light not Doomed for
// being Engaged (B3-025).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const enrichHTML = async t => String(t ?? "");
const Base = class {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: Base, HandlebarsApplicationMixin: B => class extends B {} }, sheets: { ActorSheetV2: Base, ItemSheetV2: Base }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [], time: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, user: { getFlag: () => undefined }, combat: null };
globalThis.fromUuid = async () => null;
const C = await import(ROOTURL + "tools/content.mjs");
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const CM = await import(ROOTURL + "module/cardmodel.mjs");
const { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
const CFG = await import(ROOTURL + "module/config.mjs"), RS = await import(ROOTURL + "module/rollsource.mjs");
const asItem = (name, d, basic = "") => ({ id: name, name, type: "action", getFlag: (s, k) => (k === "basic" ? basic : undefined), system: { ...d, traits: new Set(d.traits ?? []), versions: d.versions ?? [] } });

console.log("--- 1. the card model mirrors book/cards.py (t260)");
const crawl = CM.cardModel(asItem("Crawl", B.crawl, "crawl")), seek = CM.cardModel(asItem("Seek", B.seek, "seek"));
console.log("Crawl:", CM.modelLabels(crawl).join(" | "), "| the 2 AP Requirement:", crawl.versions[1].lines[0].text);
console.log("Seek, its two Versions printed once:", CM.modelLabels(seek).join(" | "), "| merged:", seek.merged, "| heading:", seek.versions[0].heading, "| both kept:", seek.allVersions.length);
console.log("Relocate's three Versions stay three blocks:", CM.cardModel(asItem("Relocate", B.relocate, "relocate")).versions.length);
console.log("the sheet's card keeps a Use button for each:", src("module/actioncard.mjs").includes('const oneBtn = M0.versions.length === 1 ? versions.map(useBtn).join("") : "";'));

console.log("--- 2. the cards' fields");
console.log("Reach (1) / Reach (2) / Reach:", CG.distanceKey({ distance: "Reach (1)" }), CG.distanceKey({ distance: "Reach (2)" }), CG.distanceKey({ distance: "Reach" }));
console.log("Heal is Tend:", B.heal.name, "| its group on the sheet and the HUD:", CFG.TWOD12.basicGroups.find(g => g.key === "utility").names.includes("Tend"), CFG.TWOD12.hudBasicGroups.find(g => g.key === "utility").names.includes("Tend"));
console.log("Relocate is no Strike:", !B.relocate.traits.includes("strike"), "| Advance's Move button:", B.advance.versions[0].effects.includes("@Move[advance|distance:speed]{Advance your Speed}"), "| Shake Off keeps its Save button, no Vs.:", B.shakeOff.versions[0].effects.includes("@ShakeOff[save]") && B.shakeOff.vs === "" && B.shakeOff.versions[0].noTiers);
const A = await import(ROOTURL + "module/actions.mjs");
console.log("Advance still moves at once (a book link is no button):", A.pureMove({ traits: new Set(B.advance.traits) }, B.advance.versions[0], "advance"));
const card = n => [...C.docs, ...(C.actors ?? []).flatMap(a => a.items ?? [])].find(d => d.name === n && d.type === "action")?.system ?? {};
console.log("Drawing Light: engagedOk", card("Drawing Light").engagedOk, "| Slip Away: no Distance", JSON.stringify(card("Slip Away").distance), "| War Howl's Tier 2:", card("War Howl").versions?.[0]?.t2?.[0]?.dice, "| Goblin Shriek:", card("Goblin Shriek").distance, "/", card("Goblin Shriek").targets);

console.log("--- 3. rolls");
const trip = { traits: new Set(["body", "handle", "instinct"]) }, attrs = { body: 1, instinct: 3 };
console.log("B2-046, the Attribute you choose: the higher first", CFG.checkAttr(trip, attrs), "| chosen", CFG.checkAttr(trip, attrs, "body"), "| a choice it doesn't have", CFG.checkAttr(trip, attrs, "mind"));
console.log("rollSource with the choice:", RS.rollSource({ attributes: attrs }, trip, "body").attrKey, "| the dialog's buttons:", src("module/rolldlg.mjs").includes('data-attr="${esc(x.key)}"'), src("module/rollwindow.mjs").includes("return this._finish({ restart: true, rollAfter: true, attrKey, state: this.st });"));
const bf = { traits: new Set(B.breakFree.traits), vs: B.breakFree.vs };
console.log("B2-010, Break Free's roll is a Check:", [...RS.rollTraits(new Set(), RS.rollSource({ attributes: attrs }, bf), "Break Free")].filter(t => ["__check", "__attr"].includes(t)).join(","), "| Tend's is an Attribute Action:", [...RS.rollTraits(new Set(), RS.rollSource({ attributes: { mind: 1, appeal: 2 } }, { traits: new Set(B.heal.traits), vs: B.heal.vs }), "Tend")].filter(t => ["__check", "__attr"].includes(t)).join(","));
console.log("B1-006, a Save a card asks for outside a Save Action: DC 13", src("module/inline.mjs").includes('if (!doc.system.traits?.has?.("save")) return TWOD12.baseDC ?? 13;'), src("module/actions.mjs").includes('saveDc: it.traits.has("save") ? saveDcOf(src, s.attributes) : TWOD12.baseDC'));
console.log("B3-025, engagedOk skips the Engaged Doomed:", src("module/actions.mjs").includes("if (engagedNow && !it.engagedOk && !ignoredBy("));

console.log("--- 4. going Down");
const DN = await import(ROOTURL + "module/down.mjs");
console.log("B1-026, a Table rolled before the encounter counts:", DN.carriedTable({ combat: "none", kinds: ["dying"] }, "C1", "dying"), "| not the other Table:", DN.carriedTable({ combat: "none", kinds: ["dying"] }, "C1", "shattered"), "| not out of combat:", DN.carriedTable({ combat: "none", kinds: ["dying"] }, "none", "dying"), "| an encounter's own:", DN.carriedTable({ combat: "C0", kinds: ["dying"] }, "C1", "dying"));
const dn = src("module/down.mjs");
console.log("B1-089, stabilizing rolls nothing:", !/collapsed && tier === 3\) \{\s*await rollTable/.test(dn), "| B1-091, damage while Unconscious and Down rolls the Table:", dn.includes('if (has(actor, "unconscious")) {') && dn.includes("if (!k) { k = await dyingKind(actor); await setStatus(actor, k, true);"));

console.log("--- 5. movement and Reactions");
const MV = await import(ROOTURL + "module/move.mjs"), MO = await import(ROOTURL + "module/moment.mjs");
const tk = (disp, statuses = [], atZero = false, type = "character") => ({ document: { disposition: disp }, actor: { type, statuses: new Set(statuses), system: { atZero } } });
const me = { disposition: 1 };
console.log("B1-063, in your way: a Dying enemy fighting", MV.wayKind(tk(-1, ["dying"], true), me), "| a Desperate one", MV.wayKind(tk(-1, ["desperate"], true), me), "| an Unconscious one", MV.wayKind(tk(-1, ["unconscious"], true), me), "| a dead one", MV.wayKind(tk(-1, ["dead"]), me), "| an NPC at 0", MV.wayKind(tk(-1, [], true, "npc"), me));
const d = s => Math.abs(s - 5);   // squares on a line, the creature at 5
console.log("B1-038, closer square by square: 0,1,2", MO.closerStep([0, 1, 2], d), "| 9,8 (nearer than the square before)", MO.closerStep([9, 8], d), "| 2,1,0 (away)", MO.closerStep([2, 1, 0], d), "| still", MO.closerStep([3], d));
console.log("B2-019, Feint's Critical: the triggering creature only:", src("module/moment.mjs").includes("const trig = def.move || !ev.source?.actor ? hit.sj?.actor : ev.source.actor;"));

console.log("--- 6. the Fists");
const F = await import(ROOTURL + "module/fists.mjs");
const fists = { id: "f", name: "Fists", type: "weapon", getFlag: (s, k) => k === "fists", system: { wielded: false, traits: new Set(), hands: 1 } };
const sword = { id: "s", name: "Arming Sword", type: "weapon", getFlag: () => false, system: { wielded: true, traits: new Set(["melee"]), hands: 1 } };
const pc = weapons => ({ itemTypes: { weapon: weapons }, items: weapons, effects: [], statuses: new Set() });
const ba = { getFlag: (s, k) => (k === "basic" ? "basicWeaponAttack" : undefined), system: {} }, fa = { getFlag: (s, k) => (k === "basic" ? "fists" : undefined), system: {} }, other = { getFlag: () => undefined, system: {} };
console.log("B2-020, the Basic Attack with a sword and a free hand:", F.weaponsFor(pc([sword, fists]), ba).map(w => w.name).join(","), "| with nothing:", F.weaponsFor(pc([fists]), ba).length, "| the Fists Action:", F.weaponsFor(pc([sword, fists]), fa).map(w => w.name).join(","), "| another Weapon Action:", F.weaponsFor(pc([sword, fists]), other).map(w => w.name).join(","));
