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
console.log("an NPC's Rally Point is a quarter of its Health Pool, rounded up (v0.0.519):", src("module/data.mjs").includes("this.rallyHeal = Math.ceil((this.bdt + this.mdt) / 4); this.rallyMax = 0;"), "| the old table is gone:", TWOD12.npcRallyHeal === undefined, "| it spends nothing:", src("module/rally.mjs").includes('const upd = npc ? {} : { "system.rallyUsed": s.rallyUsed + used };'));
console.log("the book says it:", fs.readFileSync(ROOT + "../../book/rules-src/04-health.md", "utf8").includes("one of its Rally Points removes **⌈its Health Pool ÷ 4⌉** damage, as a PC's does, and it spends nothing"));   // Lucas, 2026-11-25: a quarter of its Health, as for a PC (the old tables' 9 at Stage 0 is gone)
console.log("an Action sent to the chat is the new card:", src("module/preview.mjs").includes('item.type === "weapon" ? await buildWeaponCard(item) : await (await import("./actioncard.mjs")).buildSoloCard(item, { actor })'));
