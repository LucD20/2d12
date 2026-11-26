// Run with: node tools/tests/run.mjs (or node tools/tests/t271.mjs)
// v0.0.428 (Lucas, 2026-11-18: "still have usage keep going"): the ten items the audit of v0.0.407-417 had left (foundry-backlog "THE AUDIT OF
// v0.0.407-417"), fixed.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const A = src("module/actions.mjs"), I = src("module/inline.mjs"), M = src("module/moment.mjs");

console.log("Snap Shot (an Interrupt on 'would enter a square adjacent to you') isn't Doomed by the mover:", M.includes('notEngagedBy: r.moment === "enemyAdjacent" ? r.targetUuid : ""') && A.includes("engagedWith(selfToken).some(t => (t.document?.uuid ?? t.uuid) !== opts.notEngagedBy)"));
console.log("Word of Radiance's d8s: a Profane creature's own roll on the Save card:", I.includes('diceRule: version.diceRule ?? ""') && I.includes('if (cfg.diceRule === "profane")') && I.includes('replace(/(\\d+)d6(!?)/g, "$1d8$2")'));
console.log("Hallowed Stance's Advance before the roll, on your own turn:", A.includes("return { ok: st.ok, done: st.done, stance: st.done };") && A.includes("game.combat.combatant?.tokenId === (actor.token?.id"));
const { EMPOWERED_AVG } = await import(ROOTURL + "module/preview.mjs");
console.log("the roll dialog's Avg: Empowered's 1d6! once (avg", EMPOWERED_AVG, "), no Enfeebled:", !src("module/preview.mjs").includes("Enfeebled ${-step}") && !src("module/preview.mjs").includes("Enfeebled ${-k}"));
console.log("the GM's re-roll keeps the Empowered die:", A.includes('const hadEmp = again && (message.getFlag("twod12", "ccDmg")?.groups ?? []).some(g => (g.comps ?? []).some(c => c.kind === "E"));'));
console.log("Sleep's −1 Momentum: a Sleep after an encounter ended is another night's:", src("module/escalation.mjs").includes('game.settings.set(F, "momentumSleepAt", -1e12)'));
const C = src("module/combat.mjs");
console.log("a split Advance logs the squares moved (the line is written before they are cleared):", C.indexOf("await closeMoveLine(c)") < C.indexOf("if (upd) await c.update(") && C.includes("const goesOn = !!upd?.advInteract"));
console.log("the HUD and the sheet use the cost a passive lowers:", src("module/hooks.mjs").includes("export function effectiveAp(actor, item, v)") && src("module/hud.mjs").includes("vs.map(v => effectiveAp(actor, i, v))") && src("module/actor-sheets.mjs").includes("map(v => effectiveAp(a, i, v))"));
console.log("Update from the compendium waits for no migration (v0.0.527: the weapons migration is gone, F-033):", !src("module/refresh.mjs").includes("weaponsMigrationPending"));
