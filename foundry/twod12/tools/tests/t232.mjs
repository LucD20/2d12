// Run with: node tools/tests/run.mjs (or node tools/tests/t232.mjs)
// v0.0.340 (Lucas on v0.0.339): an area Action rolled with no creature in it (or not placed) against a typed DC (13 by default); an NPC's Rally
// Point (book, Rally Points: NPCs: 9 / 13 / 17 by Stage, nothing spent; Guard RP too); an Action sent to the chat is the new card.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const v = { ap: 2, cost: "2 AP", traits: [], meta: { targets: "All enemies in the Area" }, tiers: { 1: { parts: [] }, 2: { parts: [] }, 3: { parts: [] } }, crit: "", noTiers: false };
const inp = { name: "Word of Radiance", versions: [v], ap: 2, chips: [], creatures: [{ uuid: "none", name: "No creature in the area", def: "DC", dc: 13, owned: true, area: true }], area: { label: "2 Burst", placed: false }, canForce: true };
const st = RD.newState(inp);
console.log("an area not placed, no creature: blocked?", JSON.stringify(RD.blockedReason(inp, st)), "| the DC:", RD.liveCreatures(inp, st)[0].dc);
st.noTargetDc = "15";
console.log("a typed DC:", RD.liveCreatures(inp, st)[0].dc, "| the field in the window (once placed; v0.0.460: before, the Place button stands there):", /data-field="noTargetDc" value="15"/.test(RD.dialogHtml({ ...inp, area: { ...inp.area, placed: true } }, st)), "| not placed, the Place button:", RD.dialogHtml(inp, st).includes('class="rd-placebig"'));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("the roll's input gives an area the No target row (DC 13):", src("module/rollinput.mjs").includes('name: c.areaOutcome?.ok ? "No creature in the area" : "No target", def: "DC", dc: c.opts.noTargetDc ?? 13'));
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
// v0.0.527 (Lucas, 2026-11-26: "Lets remove this rule"): an NPC has no Rally Points and no Action lets it use one (v0.0.519 to v0.0.526: a quarter of its Health Pool)
console.log("an NPC has no Rally Point heal (v0.0.527):", src("module/data.mjs").includes("this.rallyHeal = 0; this.rallyMax = 0; this.rallyLeft = 0;"), "| the old table is gone:", TWOD12.npcRallyHeal === undefined, "| an NPC can't use one:", src("module/rally.mjs").includes('if (actor?.type === "npc" || !s?.rallyMax)'));
console.log("the book says it:", fs.readFileSync(ROOT + "../../book/rules-src/04-health.md", "utf8").includes("**NPCs** have no Rally Points.") && !fs.readFileSync(ROOT + "../../book/rules-src/04-health.md", "utf8").includes("it spends nothing"));
console.log("an Action sent to the chat is the new card:", src("module/preview.mjs").includes('item.type === "weapon" ? await buildWeaponCard(item) : await (await import("./actioncard.mjs")).buildSoloCard(item, { actor })'));
