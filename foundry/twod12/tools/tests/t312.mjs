// Run with: node tools/tests/run.mjs (or node tools/tests/t312.mjs)
// v0.0.509 (Lucas, 2026-11-25: "No explosion", dE at least a d4 ("A"), "apply it to Steady Draw"; book, Chapter 2, Escalation Die): dE in the
// rules of the round (roundrules.mjs escalationDie, withEscalationDie), the priced @Damage button (inline.mjs pricedDamagePlan: to:card, on:2,3,
// pay:r, once:encounter; replaced in v0.0.510 by the roll dialog's chip), Steady Draw's Special line on Basic Attack (its hook's specialLine; cardmodel.mjs).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const R = await import(ROOTURL + "module/roundrules.mjs"), I = await import(ROOTURL + "module/inline.mjs");
console.log("dE by Escalation 1 to 6:", [1, 2, 3, 4, 5, 6].map(e => `d${R.escalationDie(e)}`).join(" "), "| out of range:", R.escalationDie(0), R.escalationDie(9));
console.log("2dE at 3:", R.withEscalationDie("2dE", 3), "| dE at 6:", R.withEscalationDie("dE", 6), "| no explosion:", !R.withEscalationDie("2dE", 4).includes("!"), "| other dice untouched:", R.withEscalationDie("1d6! + 2", 4));
// v0.0.510 (Lucas on v0.0.509: "the roll dialog should likely have a button like the Smite"): the chip, paid on a Tier 2 or 3 only (actions.mjs steadyPays, steadyDice)
const A = await import(ROOTURL + "module/actions.mjs");
console.log("pays on:", JSON.stringify([[1], [2], [3], [1, 1], [1, 2]].map(t => A.steadyPays(t))), "| the dice: Tier 2 at Escalation 3:", JSON.stringify(A.steadyDice(2, 2, 3)), "| Tier 1:", A.steadyDice(2, 1, 3).length, "| off:", A.steadyDice(0, 3, 3).length);
console.log("the roll dialog's chip:", /special: "steadyde"/.test(src("module/rollinput.mjs")), "| on the Tiers:", src("module/rolldlg.mjs").includes('c.special === "steadyde"'), "| paid after the roll, once an encounter:", /steadyPays\(tiers\)[\s\S]*setAP\(cb, C\.getAP\(cb\) - 1[\s\S]*onceUsed/.test(src("module/actions.mjs")), "| no chat button any more:", !src("module/inline.mjs").includes("pricedDamagePlan"));
// v0.0.510 (Lucas on v0.0.508: Tumble's Check "should roll against their attribute"): dc:targets (inline.mjs targetsCheckDc)
console.log("targetsCheckDc:", JSON.stringify(I.targetsCheckDc("appeal", [{ name: "Goblin", system: { attributes: { appeal: 1 } } }, { name: "Orc", system: { attributes: { appeal: 3 } } }])), "| none:", I.targetsCheckDc("appeal", []));
console.log("parsed dc:targets:", JSON.stringify((({ dcTargets, dc }) => ({ dcTargets, dc }))(I.parseInline("Check", "instinct|dc:targets"))));
const { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
console.log("Tumble's line:", B.tumble.lines.map(l => l.text).join(" ").includes("@Check[appeal|dc:targets]{Appeal Check} or @Check[instinct|dc:targets]{Instinct Check}"), "| Aid keeps its own DC:", !JSON.stringify(B.aid).includes("dc:targets"));
const sd = C.docs.find(d => d.name === "Steady Draw" && d.type === "feature");
console.log("Steady Draw's hook:", (sd?.system?.hooks ?? []).map(h => `${h.kind}: strainedBeforeD ${h.strainedBeforeD}, deMore ${h.deMore}, specialLine: ${h.specialLine}`).join("; "));
console.log("the card model draws it:", src("module/cardmodel.mjs").includes("h.hook.specialLine"), "| the book: dE in Chapter 2:", src("../../book/rules-src/02-turns.md").includes("#### Escalation Die"), "| Steady Draw's text:", src("../../book/cards/stage0/archer.json").includes("you can spend 1 AP to deal [[Escalation die|2dE]] more"));
