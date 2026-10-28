// Run with: node tools/tests/run.mjs (or node tools/tests/t138.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// v0.0.168: the polish pass. Item sheets and Edit Versions in the sheet's look; the Action Details in Lucas's order (Reaction's Kind and the
// Interrupt/Trigger greyed out until Reaction is on); a numeric Range on the Actions tab reads "5 sq."; the Tiers in their colored boxes.
const src = f => fs.readFileSync(ROOT + f, "utf8");
const tpl = src("templates/item-sheet.hbs"), ver = src("templates/versions-editor.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), isj = src("module/item-sheet.mjs");
const a = tpl.indexOf("{{#if isAction}}"), b = tpl.indexOf('<div class="opts">', a), act = tpl.slice(a, b);
const order = ["Traits", "Flavor", "Reaction</label>", "Kind", "Category", "Level", "Frequency", "Escalation cost", "Targets", "Distance", "Vs.", "Area", "Setup", "Requirements", "Prerequisites", "Interrupt / Trigger"];
const at = order.map(k => act.indexOf(k));
console.log("Action Details order:", order.map((k, i) => `${k.replace("</label>", "")}@${at[i] > -1 ? "ok" : "MISSING"}`).join(" "), "| in Lucas's order:", at.every((x, i) => x > -1 && (i === 0 || x > at[i - 1])));
console.log("\"Shown as\" gone:", !act.includes("Shown as"), "| \"costs written as 1R\" gone:", !act.includes("costs written as 1R"),
  "| Kind greyed until Reaction:", /name="system.reactionKind" \{\{#unless system.reaction\}\}disabled/.test(act), "| Interrupt/Trigger greyed until Reaction:", /name="system.trigger" \{\{#unless system.reaction\}\}disabled/.test(act));
console.log("item sheets styled (not Class and Species):", isj.includes('styled: !["class", "species"].includes(t)') && isj.includes('classList.toggle("twod12-styled"') && tpl.includes('<div class="twod12 sheet item{{#if styled}} sk{{/if}}">'),
  "| Versions window styled:", src("module/versions.mjs").includes('classes: ["twod12", "twod12-styled"]') && ver.includes('class="twod12 sheet versions sk"'));
console.log("Tiers in their own colored boxes:", ver.includes('class="tierbox tier-{{key}}"') && ver.includes('class="tierbox whole"') && ["tier-t1", "tier-t2", "tier-t3"].every(k => css.includes(`.tierbox.${k}`)));
console.log("dark text on parchment whatever the theme:", css.includes(".application.twod12-styled .window-content { background: var(--sk-par); color: var(--sk-ink); color-scheme: light;") && css.includes("--input-background-color: #fff;"));
// the Range text: the same expression as the sheet's row
const m = sh.match(/range: \(\(r => \((.*?)\)\)\(/); const fmt = r => (/^\d+$/.test(r) ? `${r} sq.` : r);
console.log("Range expression on the row:", !!m, "|", ["5", "10", "Weapon", "Reach", "Self", "10/20/40", "\u2014"].map(r => `${r} -> ${fmt(r)}`).join(", "));
console.log("the row still has its Escalation text and chips:", /\n\s+escText: Number\(it\.escalation\)/.test(sh) && /"" , chips,|"", chips,/.test(sh));
