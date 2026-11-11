// Run with: node tools/tests/run.mjs (or node tools/tests/t174.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
// v0.0.221 (Lucas, 2026-11-03): the Charge given up frees its use on the actor it was used from; movement messages and colors; Reload an ally's
// weapon; a Large creature's Charge aimed from its center; shortcuts (pack K).
globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const S = await import(ROOTURL + "module/sysmsg.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
console.log("a system line colors its words:", S.sysLine("fa-shoe-prints", "<b>Nari</b> gains 1 Boon and uses 2 Rally Points; 1 Bane, 2 AP."));
const mv = src("module/move.mjs"), us = src("module/usage.mjs"), inl = src("module/inline.mjs"), act = src("module/actions.mjs"), tw = src("module/twod12.mjs");
console.log("Charge given up: the use is taken back on the actor it was used from and on the combatant's:", mv.includes('actorUuid: f?.actorUuid ?? ""') && mv.includes("for (const a of new Set([from, c.actor].filter(Boolean)))"), "| the combatant's copy even with no actor record:", us.includes("the combatant's copy too, even when the actor had no record"));
console.log("movement messages are system lines:", mv.includes('const post = html => ChatMessage.create({ content: sysLine("fa-shoe-prints", html, "movemsg") });') && mv.includes('await postFollow(opts.msg, "fa-hand", lines.join(" "), { cls: "pushmsg" });') /* v0.0.347: into its card, else a system line */);
console.log("a larger creature's Charge is centered on the mouse:", mv.includes("a larger creature aims with the center of its space"));
console.log("Reload: yours or an ally's within Reach (the GM relays):", inl.includes("an ally's within your Reach") && inl.includes('type: "reloadWeapon"') && mv.includes('data?.type === "reloadWeapon"') && BD.reload.distance === "reach", "| Reload isn't refused for its own unloaded weapon:", act.includes('basicKey !== "reload"'));
const keys = [...tw.matchAll(/register\("twod12", "(\w+)"/g)].map(m => m[1]);
console.log("shortcuts:", ["quickAdvance", "quickAttack", "quickRally", "quickEndTurn"].every(k => keys.includes(k)) || tw.includes('quick("quickAdvance"'), "| Shift+A, W, R, Q:", ['"KeyA"', '"KeyW"', '"KeyR"', '{ key: "KeyQ", modifiers: ["Shift"] }'].every(k => tw.includes(k)), "| Favorites Alt+1..9:", tw.includes("key: `Digit${n}`, modifiers: [\"Alt\"]") && act.includes("export async function quickFavorite(n)"), "| an NPC's Weapon Attack key uses its Basic attack:", act.includes('key === "basicWeaponAttack" && actor.type === "npc"'));
const ar = src("module/actionrows.mjs");
console.log("(next version) the Fists never show Unloaded; a non-Ranged Weapon Action with a free hand isn't blocked:", ar.includes('["fists", "kick"].includes(item.system.weaponUse)') && ar.includes('!item.system.traits?.has?.("ranged") && handsUsed(actor) < 2'));
const U = await import(ROOTURL + "module/usage.mjs");
console.log("v0.0.222: a Round use recorded in round 3 when the combat is back in round 1 (turn 2, own turn 5) doesn't block:", U.turnCycleBlocked(1, 2, 5, [3, 5]), "| used this round on its turn, later turn now:", U.turnCycleBlocked(1, 6, 5, [1, 5]), "| next round before its turn:", U.turnCycleBlocked(2, 2, 5, [1, 5]), "| at its next turn:", U.turnCycleBlocked(2, 5, 5, [1, 5]));
