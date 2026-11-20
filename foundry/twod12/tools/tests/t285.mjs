// Run with: node tools/tests/run.mjs (or node tools/tests/t285.mjs)
// v0.0.455 (Lucas's answers to the mockups foundry/mockups/group3 and group4): the Build tab (the Stage band A, Change level B, Species and Class
// A; the Escalation 4 and 6 rows' label) and the Inventory and Loot tabs (inventory.mjs: Where A, the links A, the Loot tab).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: {} };
globalThis.foundry = { applications: { api: {}, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => o } };
globalThis.CONFIG = { statusEffects: [], TextEditor: { enrichers: [] }, time: {} }; globalThis.game = { settings: { get: () => false }, user: {} };
const P = await import(ROOTURL + "module/pcsheet.mjs"), SM = await import(ROOTURL + "module/sheetmodel.mjs"), INV = await import(ROOTURL + "module/inventory.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- the Build tab");
const sb = P.stageBandModel(5);
console.log("level 5:", sb.n, sb.levels, "|", sb.next, "| ladder:", sb.ladder.map(g => `${g.label}${g.on ? "*" : ""}: ${g.cells.map(c => `${c.n}${c.cls ? `(${c.cls})` : ""}`).join(" ")}`).join(" | "));
console.log("level 15:", P.stageBandModel(15).next, "| ranks: Escalation 4 and 6, the Apex:", ["Escalation 4 Passive", "Escalation 6 Passive", "Apex"].map(SM.escSectionRank).join(" "), "=", SM.ESC_APEX);
const tpl = src("templates/actor-sheet-pc.hbs");
console.log("no Level field; Change level:", !tpl.includes('<label class="ps-lvl">Level <input') && tpl.includes('data-action="changeLevel"'), "| the window:", src("module/actor-sheets.mjs").includes("static async changeLevel()") && src("module/actor-sheets.mjs").includes('pwStepHtml("level"'));
console.log("Species and Class entries, no dark header:", tpl.includes('class="bt-ent"') && !tpl.includes('class="ps-bcard"'), "| Swap on a Rest on the Class entry:", tpl.includes('{{#if swap}}<button type="button" class="bt-btn quiet" data-action="swapRest"'));
const fake = { items: [{ name: "Reckoning", getFlag: (s, k) => (k === "classLevel" ? 3 : 0) }], itemTypes: { class: [{ system: { levels: [] } }] } };
console.log("going down from 3 to 2:", strip(P.levelChangeText(fake, 3, 2)));
console.log("--- the Inventory");
const w = (id, name, sys) => ({ id, name, type: "weapon", getFlag: () => undefined, system: { traits: new Set(sys.traits), wielded: !!sys.wielded, hands: sys.hands ?? 1, hand: sys.hand ?? "", worn: sys.worn ?? true, dropped: false, range: sys.range ?? "1", subtype: "Pi", damage: { t1: "0", t2: "2+1d4!", t3: "4+1d4!" } } });
const bow = w("b", "Hunting Bow", { traits: ["ranged", "projectile", "twohanded", "strung"], wielded: true, hands: 2, range: "8/16/24" }), dag = w("d", "Dagger", { traits: ["melee", "light", "thrown"] });
const a = { system: { coins: 34, armorTraining: "light" }, getFlag: () => ({}), itemTypes: { weapon: [dag, bow], armor: [], gear: [{ id: "g", name: "Rope", type: "gear", system: { quantity: 1, weight: 2, cost: 1, description: "Fifteen meters." } }], action: [] } };
const inv = INV.inventoryHtml(a, { open: new Set(["g"]) });
console.log(strip(inv).slice(0, 400));
console.log("the Where words:", [dag, bow].map(x => INV.whereWord([dag, bow], x)).join(", "), "| the links:", inv.includes('data-action="generateWeapon"') && inv.includes('data-action="browseItems"') && inv.includes('data-action="newGear"'), "| the open detail:", inv.includes('class="inv-r open" data-item-id="g"'));
const pm = INV.placeMenuModel([dag, bow], dag, { inCombat: true, ap: 0 });
console.log("the Dagger's menu (on you, no AP):", pm.groups.map(g => g.map(r => `${r.label} [${r.cost}${r.off ? " struck" : ""}]`).join("; ")).join(" || "));
console.log("--- the Loot tab");
const npc = { itemTypes: { weapon: [], armor: [], gear: [{ id: "c", name: "Coins", type: "gear", getFlag: () => undefined, system: { quantity: 14, cost: 1, description: "" } }] } };
console.log(strip(INV.lootHtml(npc)), "| Give asks How many:", src("module/actor-sheets.mjs").includes('<span>How many</span>${pwStepHtml("n", String(st.n))}'));
