// Run with: node tools/tests/run.mjs (or node tools/tests/t240.mjs)
// v0.0.352 (Lucas on v0.0.351, then playtest 4, Step 6, buttons): the flanking labels' size per zoom, the area tooltip's colors; a chip's icon uses
// it and its name opens what it names; calculated chips in their own color with the calculation on hover; Smite's Stage parenthesis off in Foundry.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("flanking labels keep their screen size:", src("module/flankoverlay.mjs").includes("box.scale.set(Math.max(0.35, Math.min(2.5, 1 / z)));") && src("module/flankoverlay.mjs").includes('Hooks.on("canvasPan", redraw);'));
const zt = src("module/zonetip.mjs"), css = src("styles/system.css");
console.log("the tooltip's sides colored, the words highlighted:", zt.includes('<span class="zt-who ${m[1].toLowerCase()}">') && zt.includes("highlightText(esc(t))") && css.includes(".twod12-zonetip .zt-who.enemies { color: #ff6a4d; }") && css.includes(".twod12-zonetip .zt-who.allies { color: #4cc3ff; }"));
const inl = src("module/inline.mjs"), main = src("module/twod12.mjs");
console.log("a chip's name is its own span:", inl.includes('<span class="ti-name">${esc(label)}</span>'), "| the name opens, the icon uses:", main.includes('!ev.target.closest?.("i, img, svg, .ti-use")') && main.includes("await openChip("));
console.log("what the name opens:", inl.includes('if (kind === "Condition" && cfg.cond) { const it = await conditionItem(cfg.cond);') && inl.includes('const ref = kind === "Move" ? MOVE_REF[cfg.kind] : RULE_REF[kind];'), "| Pushed:", /pushed: "Pushed"/.test(inl), "| Guard:", /Guard: "Guard"/.test(inl));
console.log("calculated chips:", inl.includes('el.classList.add("calc"); el.dataset.calc = `Calculated: ${label} with this creature') && inl.includes("Calculated: Stage ${stageN}:") && css.includes("a.twod12-inline.calc .ti-name, a.twod12-inline.calc { color: #1a3fb0; }"));
console.log("Smite's parenthesis off in Foundry:", !src("module/gen.mjs").includes("]{Guard ${f.replace(/\\s+/g, \" \")}}${paren ?? \"\"}"), "| Smite Diamond:", /"name": "Smite"[\s\S]*?"automation": "diamond"/.test(fs.readFileSync(ROOT + "../../book/cards/paladin.json", "utf8")));
// v0.0.353 (Lucas on v0.0.352): smaller flanking texts, the name on the ring; no dotted underline; the chips' icons aligned
const fo = src("module/flankoverlay.mjs");
console.log("v0.0.353: smaller labels:", fo.includes("size = fsz(0.18)") && fo.includes("fsz(0.16)"), "| the name on the ring:", fo.includes("nm.position.set(cc.x, cc.y - rr)"), "| no dotted underline:", !css.includes("underline dotted"), "| chips a centered row:", css.includes("a.twod12-inline { display: inline-flex; align-items: center;"));
