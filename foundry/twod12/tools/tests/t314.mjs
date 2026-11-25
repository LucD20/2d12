// Run with: node tools/tests/run.mjs (or node tools/tests/t314.mjs)
// v0.0.512 (Lucas, 2026-11-25: "Do 1, then 2"; foundry-backlog.md, PLAYTEST 7's leftovers): Slip Away's Evade 1 then Advance 2 run by themselves
// (actions.mjs autoMoveChain; move.mjs runThenMove, the flag thenMove, given up by another Action); a Charge that reached a creature waits in the HUD's
// Situational tab with its Basic Attack (1A) (move.mjs chargeFollowUp sets chargeUse; hud.mjs; freeuse.mjs chargeUseFromCard, firstUseTag); the Charge bar
// follows the HUD's redraw after a new selection (move.mjs placeBar, as pickbar.mjs place).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const A = await import(ROOTURL + "module/actions.mjs"), FU = await import(ROOTURL + "module/freeuse.mjs");
const act = n => [...C.docs, ...C.pcs.flatMap(p => p.items ?? [])].find(d => d.name === n && d.type === "action")?.system;
console.log("Slip Away's chain:", JSON.stringify(A.autoMoveChain(act("Slip Away").versions[0], true)), "| not a Reaction:", A.autoMoveChain(act("Slip Away").versions[0], false).length,
  "| Quick Shots (a roll):", A.autoMoveChain(act("Quick Shots").versions[0], true).length, "| Rebuke:", A.autoMoveChain(act("Rebuke").versions[0], true).length);
console.log("chain wired:", src("module/actions.mjs").includes('cb.setFlag("twod12", "thenMove"'), "| next at the Evade's end and at End movement:", (src("module/move.mjs").match(/runThenMove\(c\)/g) ?? []).length, "| given up by another Action:", src("module/combat.mjs").includes("unset(`flags.${F}.thenMove`)"));
console.log("Charge's @Use:", FU.firstUseTag(act("Charge").versions[0].effects).split("|")[0], "| none:", JSON.stringify(FU.firstUseTag("no button")));
console.log("Charge wired: chargeUse set", src("module/move.mjs").includes('c.setFlag(F, "chargeUse"'), "| HUD Situational", src("module/hud.mjs").includes('hud: "chargeuse"'), "| cleared by another Action", src("module/combat.mjs").includes("unset(`flags.${F}.chargeUse`)"), "| HUD redraws on it", src("module/hud.mjs").includes('includes("chargeUse")'));
console.log("Charge bar follows the selection:", src("module/move.mjs").includes('dockHook = Hooks.on("controlToken", () => setTimeout(() => placeBar(0), 150))'), "| unhooked on close:", src("module/move.mjs").includes('Hooks.off("controlToken", dockHook); } catch (e) { /* gone */ } dockHook = null;'));
