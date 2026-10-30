// Run with: node tools/tests/run.mjs (or node tools/tests/t130.mjs)
// v0.0.154: Mastery. A Tier 3 on a Weapon Action with a weapon: +1 with that kind of weapon. 3 unlocks its Weapon Technique (locked before).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.ChatMessage = { create: async d => posted.push(d.content.replace(/<[^>]+>/g, "")), getSpeaker: () => ({}) };
const posted = [];
const M = await import(ROOTURL + "module/mastery.mjs");
// a character with flags in memory
const flags = {};
const actor = (items = []) => ({
  type: "character", name: "Drak", items: { get: id => items.find(i => i.id === id) }, itemTypes: { weapon: items.filter(i => i.type === "weapon") },
  getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = { ...(flags[k] ?? {}), ...v }; }, unsetFlag: async (s, k) => { const [a, b] = k.split("."); delete flags[a]?.[b]; }
});
const gs = { id: "w1", type: "weapon", name: "Greatsword", system: { masteryGroup: "" } };
const gs1 = { id: "w2", type: "weapon", name: "+1 Greatsword", system: { masteryGroup: "Greatsword" } };
const tech = { id: "t1", type: "action", name: "Reaping Sweep", system: { category: "Weapon Technique" }, getFlag: (s, k) => (k === "weaponId" ? "w1" : undefined) };
const A = actor([gs, gs1, tech]);
console.log("groups:", M.groupOf(gs), "|", M.groupOf(gs1), "| keys:", M.masteryKey("Great Sword"), M.masteryKey("+1 Long-bow!"));
await M.ensureEntry(A, gs);
console.log("entry on getting the weapon:", JSON.stringify(flags.mastery), "| Technique:", JSON.stringify(M.techniqueLock(A, tech)));
globalThis.game = { ...(globalThis.game ?? {}), combat: null };
await M.masteryAfterRoll(A, gs, true, [3]);
console.log("v0.0.189: a Tier 3 out of combat gives nothing:", M.masteryValue(A, "Greatsword"));
globalThis.game.combat = { started: true, combatants: [{ actor: A }] };
await M.masteryAfterRoll(A, gs, true, [2]);
await M.masteryAfterRoll(A, gs, false, [3]);
console.log("Tier 2, or not a Weapon roll: nothing:", M.masteryValue(A, "Greatsword"));
await M.masteryAfterRoll(A, gs, true, [3, 3, 1]);
console.log("several targets with two Tier 3: +1 once:", M.masteryValue(A, "Greatsword"));
await M.masteryAfterRoll(A, gs1, true, [3]);
console.log("the +1 Greatsword counts for the Greatsword:", M.masteryValue(A, "Greatsword"));
await M.masteryAfterRoll(A, gs, true, [3]);
console.log("at 3:", JSON.stringify(M.techniqueLock(A, tech)), "| posted:", posted.at(-1));
console.log("rows:", JSON.stringify(M.masteryRows(A).map(r => ({ name: r.name, value: r.value, owned: r.owned, next: r.next, nextText: r.nextText, pct: r.pct, steps: r.steps.map(s => (s.on ? "*" : "") + s.s).join(" ") }))));
console.log("NPCs have no Mastery:", JSON.stringify(M.techniqueLock({ ...A, type: "npc" }, tech)), "| other Actions are never locked:", M.techniqueLock(A, { ...tech, system: { category: "Divine Power" } }).locked);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), use = src("module/usage.mjs"), tpl = src("templates/actor-sheet.hbs"), data = src("module/data.mjs"), isheet = src("templates/item-sheet.hbs");
console.log("locked Techniques: faded on the sheet", use.includes("techniqueLock(actor, item)"), "| refused when used", act.includes("is locked: ${TECHNIQUE_AT}"), "| gained after the roll", act.includes("masteryAfterRoll(actor, weapon, src.kind === \"weapon\""));
console.log("Mastery tab", tpl.includes('data-tab="mastery"'), "| weapon's Mastery group field", data.includes("masteryGroup: str()") && isheet.includes('name="system.masteryGroup"'));
// a weapon carried from before Mastery existed shows at 0, and +1 by hand creates its entry
const flags2 = {};
const B = { type: "character", itemTypes: { weapon: [{ id: "x", type: "weapon", name: "Crossbow", system: {} }] }, getFlag: (s, k) => flags2[k], setFlag: async (s, k, v) => { flags2[k] = { ...(flags2[k] ?? {}), ...v }; } };
console.log("old weapon shows:", JSON.stringify(M.masteryRows(B).map(r => [r.name, r.value])));
await M.setMastery(B, "crossbow", 1, "Crossbow");
console.log("after +1 by hand:", JSON.stringify(flags2.mastery));
// v0.0.155: a Technique is hidden before 3 Mastery, greyed when its weapon isn't in hand (or hidden by the toggle); rows shrink and open
const flags3 = { mastery: { greatsword: { name: "Greatsword", value: 2 } } };
const gw = { id: "w1", type: "weapon", name: "Greatsword", system: { wielded: false } };
const tk = { id: "t1", type: "action", name: "Reaping Sweep", system: { category: "Weapon Technique" }, getFlag: (s, k) => (k === "weaponId" ? "w1" : undefined) };
const C3 = { type: "character", items: { get: id => [gw, tk].find(i => i.id === id) }, itemTypes: { weapon: [gw], action: [tk] }, getFlag: (s, k) => flags3[k], setFlag: async (s, k, v) => { flags3[k] = { ...(flags3[k] ?? {}), ...v }; } };
const st = () => M.techniqueState(C3, tk);
console.log("Mastery 2:", st()); flags3.mastery.greatsword.value = 3;
console.log("Mastery 3, not in hand:", st()); gw.system.wielded = true;
console.log("Mastery 3, in hand:", st(), "| an NPC:", M.techniqueState({ ...C3, type: "npc" }, tk));
await M.setCollapsed(C3, "greatsword", true);
const row = M.masteryRows(C3)[0];
console.log("shrunk:", row.collapsed, "| what each step grants:", row.steps.map(s => `${s.s}: ${s.grants}`).join(" | "));
const sh = fs.readFileSync(ROOT + "module/actor-sheets.mjs", "utf8"), tp = fs.readFileSync(ROOT + "templates/actor-sheet.hbs", "utf8"), us = fs.readFileSync(ROOT + "module/usage.mjs", "utf8");
console.log("only the GM changes Mastery by hand:", sh.includes('if (!game.user.isGM) return ui.notifications.warn("Only the GM can change Mastery by hand.")') && tp.includes("{{#if @root.isGMUser}}"), "| no trash: shrink instead", !tp.includes("masteryRemove") && tp.includes('data-action="masteryCollapse"'));
console.log("Actions tab: locked hidden, toggle hides the ones not in hand:", sh.includes('return st !== "locked" && !(hideTech && st === "unwielded");') && tp.includes('class="at-hidetech"'), "| greyed with why:", us.includes("to use it` };"));
