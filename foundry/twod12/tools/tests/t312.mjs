// Run with: node tools/tests/run.mjs (or node tools/tests/t312.mjs)
// v0.0.509 (Lucas, 2026-11-25: "No explosion", dE at least a d4 ("A"), "apply it to Steady Draw"; book, Chapter 2, Escalation Die): dE in the
// rules of the round (roundrules.mjs escalationDie, withEscalationDie), the priced @Damage button (inline.mjs pricedDamagePlan: to:card, on:2,3,
// pay:r, once:encounter), Steady Draw's Special line on Basic Attack (its hook's specialLine; cardmodel.mjs).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const R = await import(ROOTURL + "module/roundrules.mjs"), I = await import(ROOTURL + "module/inline.mjs");
console.log("dE by Escalation 1 to 6:", [1, 2, 3, 4, 5, 6].map(e => `d${R.escalationDie(e)}`).join(" "), "| out of range:", R.escalationDie(0), R.escalationDie(9));
console.log("2dE at 3:", R.withEscalationDie("2dE", 3), "| dE at 6:", R.withEscalationDie("dE", 6), "| no explosion:", !R.withEscalationDie("2dE", 4).includes("!"), "| other dice untouched:", R.withEscalationDie("1d6! + 2", 4));
const cfg = I.parseInline("Damage", "2dE|to:card|on:2,3|pay:r|once:encounter|key:Steady Draw");
console.log("parsed:", JSON.stringify({ to: cfg.to, on: cfg.onTiers, pay: cfg.pay, once: cfg.once, key: cfg.key, formula: cfg.parts.damage[0]?.formula }));
const flag = t => ({ results: [{ uuid: "A", name: "Goblin", tier: t }] });
const plan = I.pricedDamagePlan(cfg, { flag: flag(2), escalation: 3, inCombat: true, used: {}, combatId: "c1" });
console.log("Tier 2 at Escalation 3:", JSON.stringify({ f: plan.parts?.[0]?.formula, targets: plan.targets?.map(t => t.name), sub: plan.subtitle }));
console.log("Tier 1:", I.pricedDamagePlan(cfg, { flag: flag(1), escalation: 3 }).why, "| no card:", I.pricedDamagePlan(cfg, { escalation: 3 }).why);
console.log("used this encounter:", I.pricedDamagePlan(cfg, { flag: flag(3), escalation: 2, inCombat: true, used: { "Steady Draw": "c1" }, combatId: "c1" }).why, "| a new encounter:", !I.pricedDamagePlan(cfg, { flag: flag(3), escalation: 2, inCombat: true, used: { "Steady Draw": "c0" }, combatId: "c1" }).why);
const sd = C.docs.find(d => d.name === "Steady Draw" && d.type === "feature");
console.log("Steady Draw's hook:", (sd?.system?.hooks ?? []).map(h => `${h.kind}: strainedBeforeD ${h.strainedBeforeD}, specialLine ${/@Damage\[2dE\|to:card\|on:2,3\|pay:r\|once:encounter\|key:Steady Draw\]/.test(h.specialLine ?? "")}`).join("; "));
console.log("the card model draws it:", src("module/cardmodel.mjs").includes("h.hook.specialLine"), "| the book: dE in Chapter 2:", src("../../book/rules-src/02-turns.md").includes("#### Escalation Die"), "| Steady Draw's text:", src("../../book/cards/stage0/archer.json").includes("you can spend your Reaction Point to deal [[Escalation die|2dE]] more"));
