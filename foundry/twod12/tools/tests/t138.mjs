// Run with: node tools/tests/run.mjs (or node tools/tests/t138.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.168: the polish pass. Item sheets and Edit Versions in the sheet's look; the Action Details in Lucas's order (Reaction's Kind and the
// Interrupt/Trigger greyed out until Reaction is on); a numeric Range on the Actions tab reads "5 sq."; the Tiers in their colored boxes.
const src = f => fs.readFileSync(ROOT + f, "utf8");
const tpl = (src("templates/item-sheet.hbs") + src("module/actionsheet.mjs")), ver = src("templates/versions-editor.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), isj = src("module/item-sheet.mjs");
// v0.0.355 (PACK ACTION-SHEET): the Action's tab is actionsheet.mjs (mockup A2): the card's lines in the book's order, then Reaction and Area as part rows
const asrc = src("module/actionsheet.mjs"), a = asrc.indexOf("function cardSec"), b = asrc.indexOf("function versionsSec"), act = asrc.slice(a, b);
const order = ['["Traits"', '["Flavor"', '["Category"', "Level", '["Frequency"', '["Escalation"', '["Targets"', '["Distance"', '["Vs."', "Requirements", "Setup", '["Kind"', '["Moment"', '["Card line"', '"A Reaction"', '"An Area"'];
const at = order.map(k => act.indexOf(k));
console.log("Action Details order:", order.map((k, i) => `${k.replace(/[\["]/g, "")}@${at[i] > -1 ? "ok" : "MISSING"}`).join(" "), "| in Lucas's order:", at.every((x, i) => x > -1 && (i === 0 || x > at[i - 1])));
console.log("\"Shown as\" gone:", !act.includes("Shown as"), "| \"costs written as 1R\" gone:", !act.includes("costs written as 1R"),
  "| Kind and the Trigger line folded until Reaction (a part row):", /part\("system\.reaction", s\.reaction, "A Reaction"/.test(act) && act.indexOf('seg("system.reactionKind"') < act.indexOf('part("system.reaction"') && act.includes('named("system.trigger"'));
console.log("item sheets styled (not Species; Class since v0.0.185):", isj.includes('styled: t !== "species"') && isj.includes('classList.toggle("twod12-styled"') && tpl.includes('<div class="twod12 sheet item{{#if styled}} sk{{/if}}">'),
  "| Versions window styled:", src("module/versions.mjs").includes('classes: ["twod12", "twod12-styled"]') && ver.includes('class="twod12 sheet versions sk"'));
console.log("Tiers in their own colored boxes:", ver.includes('class="tierbox tier-{{key}}"') && ver.includes('class="tierbox whole"') && ["tier-t1", "tier-t2", "tier-t3"].every(k => css.includes(`.tierbox.${k}`)));
console.log("dark text on parchment whatever the theme:", css.includes(".application.twod12-styled .window-content { background: var(--sk-par); color: var(--sk-ink); color-scheme: light;") && css.includes("--input-background-color: #fff;"));
// the Range text: the same expression as the sheet's row
const m = sh.match(/range: \(\(r => \((.*?)\)\)\(/); const fmt = r => (/^\d+$/.test(r) ? `${r} sq.` : r);
console.log("Range expression on the row:", !!m, "|", ["5", "10", "Weapon", "Reach", "Self", "10/20/40", "\u2014"].map(r => `${r} -> ${fmt(r)}`).join(", "));
console.log("the row still has its Escalation text and chips:", /\n\s+escText: Number\(it\.escalation\)/.test(sh) && /"" , chips,|"", chips,/.test(sh));
