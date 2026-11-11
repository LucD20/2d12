// Run with: node tools/tests/run.mjs (or node tools/tests/t123.mjs)
// v0.0.143 (Pass A of the core rules update): Favored keeps the best Tier, Doomed has no Doubles; [Mod]; Save DCs; Vs. entries; Rimebrand on every Tier.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry ??= { utils: {}, data: { fields: {} } };
const R = await import(ROOTURL + "module/roll.mjs");
const C = await import(ROOTURL + "module/calc.mjs");
const S = await import(ROOTURL + "module/rollsource.mjs");
const G = await import(ROOTURL + "module/config.mjs");
const d = (first, total = first) => ({ first, total });
const show = k => `keep ${k.i.join("+")} total ${k.total} tier ${k.tier}${k.doubles ? " doubles" : ""}${k.crit ? " crit" : ""}`;
console.log("Favored 1,1,5 (+0 vs 13):", show(R.keepDice([d(1), d(1), d(5)], "favored", 0, 13)), "| v0.0.301: the two highest (1 + 5 = 6, Tier 1), the two 1s are Doubles: Tier 2");
console.log("Favored 4,4,10 (+2 vs 13):", show(R.keepDice([d(4), d(4), d(10)], "favored", 2, 13)), "| v0.0.301: the two highest 4 + 10 + 2 = 16, Tier 2, and the 4s are Doubles: Tier 3");
console.log("Favored 7,7,9 (+2 vs 13):", show(R.keepDice([d(7), d(7), d(9)], "favored", 2, 13)), "| v0.0.301: 7 + 9 + 2 = 18, Tier 2, and the 7s are Doubles: Tier 3");
console.log("Favored 12-chain 23, 3, 2:", show(R.keepDice([d(12, 23), d(3), d(2)], "favored", 0, 13)));
console.log("Doomed 5,5,7 (+2 vs 13):", show(R.keepDice([d(5), d(5), d(7)], "doomed", 2, 13)), "| no Doubles");
console.log("Doomed 10, 12->21, 12->16 (the rules' example):", show(R.keepDice([d(10), d(12, 21), d(12, 16)], "doomed", 0, 13)), "| 10 + 16 = 26");
console.log("normal 6,6 (+0 vs 13):", show(R.keepDice([d(6), d(6)], "", 0, 13)));
const p = st => C.tierProbs(2, 13, 0, 0, st).map(x => (x * 100).toFixed(1) + "%").join(" / ");
console.log("odds +2 vs 13 | normal", p(""), "| Favored", p("favored"), "| Doomed", p("doomed"));
const sys = { attributes: { body: 3, mind: 1, appeal: 2, instinct: 0 }, weaponAttribute: "body", weaponMod: 3, powerAttribute: "appeal", powerMod: 2, signatureAttribute: "body", signatureMod: 3, signatureFrom: "weapon" };
const it = t => ({ traits: new Set(t) });
for (const [name, t] of [["Weapon", ["weapon"]], ["Power", ["magic"]], ["Signature", ["signature"]], ["Body Action", ["body"]], ["no roll", []]]) {
  const src = S.rollSource(sys, it(t));
  console.log(`${name.padEnd(11)} | ${src.kind ?? "-"} mod ${src.mod ?? "-"} | [Mod] added from Tier ${S.attrFromTier(src)} | Save DC ${S.saveDcOf(src, sys.attributes)}`);
}
const vs = (t, o = {}) => G.vsText({ traits: new Set(t), versions: [{ noTiers: false }], ...o.d }, o) || "(none)";
console.log("Vs.:", ["weapon", "magic", "signature", "body", "split"].map(k => `${k} ${vs([k])}`).join(" | "), "| Fists", vs(["body"], { fists: true }), "| Trip", vs(["body", "instinct"], { d: { vs: "roll" } }), "| no roll", G.vsText({ traits: new Set(["weapon"]), versions: [{ noTiers: true }] }) || "(none)");
const content = fs.readFileSync(ROOT + "tools/content.mjs", "utf8");
console.log("Rimebrand (v0.0.188, OT: a turn buff, no roll): [M] 1d4 Co on every Tier:", content.includes('coldSetting("1d4", ["t1", "t2", "t3"])'), "| Hindered on a Tier 3:", content.includes('coldSetting("", ["t3"], "Hindered (EoT)"'));
console.log("species have no Ward value (v0.0.162):", /true, 3, 2, 5, 0, true\);/.test(content) && /false, 4, 1, 4, 1\);/.test(content) && /false, 1, 4, 6\);/.test(content) && !/reach: 1, ward/.test(content));
const src = fs.readFileSync(ROOT + "module/actions.mjs", "utf8") + fs.readFileSync(ROOT + "module/inline.mjs", "utf8");
console.log("damage rolled once per Tier (actions, Save cards):", src.includes("byTier.set(r.tier, d)") && src.includes("st.tierDmg?.[`t${chk.tier}`]"));
const css = fs.readFileSync(ROOT + "styles/system.css", "utf8");
console.log("shorter title bar:", css.includes(".application.twod12.twod12-actor { --header-height: 28px; }"));
