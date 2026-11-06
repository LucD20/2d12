// Run with: node tools/tests/run.mjs (or node tools/tests/t202.mjs)
// v0.0.263 (Lucas, after v0.0.262): a Grant's "On a Tier X, the target's next damage is halved" (X a choice: 1+, 2+, 3, a Critical, any result;
// the old halfT3 read as Tier 3), a Grant's Critical row for the granted use's card, and the Versions editor opening an effect by its name.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry ??= { utils: {} };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const H = await import(ROOTURL + "module/halfhint.mjs");
const t = (h, tier, crit = false) => (H.halfHits(h, tier, crit) ? "y" : "n");
console.log("halfHits t3:", [0, 1, 2, 3].map(n => t("t3", n)).join(""), "| t2:", [0, 1, 2, 3].map(n => t("t2", n)).join(""), "| t1:", [0, 1, 2, 3].map(n => t("t1", n)).join(""), "| crit:", t("crit", 3, false), t("crit", 2, true), "| all:", t("all", 0), "| never:", t("", 3), t(null, 3));
const af = src("module/appliedflags.mjs"), st = src("templates/parts/settings.hbs"), ve = src("module/versions.mjs"), ac = src("module/actions.mjs");
console.log("the old halfT3 reads as t3; the Critical text is kept:", af.includes('halfOn: x.halfOn || (x.halfT3 ? "t3" : "")') && af.includes('critical: String(x.grantCritical ?? "").trim()'));
console.log("the editor: a choice and the Critical text:", st.includes('data-field="halfOn"') && st.includes('data-field="grantCritical"'));
console.log("the granted use's card gets the Critical row:", ac.includes("if (opts.grant?.grant?.critical) version = { ...version, critical: [version.critical, opts.grant.grant.critical].filter(Boolean).join(\" \") };"));
console.log("the Versions editor opens an effect by its name:", ve.includes('this.element.querySelectorAll(".fxline .iname").forEach(el => el.addEventListener("click"'));
