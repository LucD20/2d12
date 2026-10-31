// Run with: node tools/tests/run.mjs (or node tools/tests/t134.mjs)
// v0.0.161 (Archer pass 3): Marked Quarry, Hunter's Focus, Long Draw, Steady Nerves, Killer's Focus; no odds for Save Actions; Empowered on Save damage.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.186: the Archer cards are settings now (automation.mjs, tested in t151); this test keeps the wiring checks.
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), main = src("module/twod12.mjs"), content = src("tools/content.mjs");
console.log("wired: marked-target steps", act.includes("const steps = damageSteps(actor, rollTraits(rollUse, src, item.name), rollsAtOthers ? (aimed[0]?.actor ?? null) : null);"), "| range Bane", act.includes('ignoredBy(actor, "rangeBane", useTraits)'), "| Engaged Banes", act.includes('isEngaged(selfToken) && !ignoredBy(actor, "engagedSelf", useTraits).length'), "| once-per-round bonuses", act.includes("await markOnce(actor, used)"), "| marking Action", act.includes("if (it.marksTarget) { try { await setQuarry(actor, [...game.user.targets][0] ?? null);"), "| hooks", main.includes("registerMarkHooks();"));
console.log("content: Mark Quarry (0 or 1 AP, granted by Marked Quarry)", content.includes('add("actions", "action", "Mark Quarry"') && content.includes('actions: [uuidOf("actions", "Mark Quarry")] }, "Archer")'), "| Hunter's Focus applies its effect", content.includes('[uuidOf("effects", "Hunter\'s Focus")])'));
console.log("Save Actions: no odds", act.includes("if (saveAct) preview.noOdds = true;") && act.includes("if (!preview?.noOdds) updateOdds("), "| Empowered/Enfeebled per die on the Save's damage", inl.includes("step = emp - enf;") && inl.includes("c.total = Math.max(0, c.total + step * k)"));
