// Run with: node tools/tests/run.mjs (or node tools/tests/t146.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.179 (pack F, the format): Foundry looks like the book. Trait groups (book/build_rules.py GROUPS), tinted chips, weapon properties without
// color, the text colors (CLASS_TOKEN), damage expressions in their pool's color.
globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
const cf = await import(ROOTURL + "module/config.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const book = fs.readFileSync(ROOT + "../../book/build_rules.py", "utf8");
console.log("--- the groups are the book's");
const bookGroups = [...book.match(/GROUPS = \[([\s\S]*?\])\)\]/)[1].matchAll(/\("(\w+)", "(\w+)", \[([^\]]*)\]/g)].map(m => `${m[2]}: ${m[3].replace(/"/g, "").split(", ").join(" ")}`);
const ours = cf.TWOD12.traitGroups.map(g => `${g.label}: ${g.traits.map(k => (k === "magic" ? "power" : k)).sort().join(" ")}`);
console.log(ours.join(" | "));
console.log("the same as the book's GROUPS:", JSON.stringify(ours) === JSON.stringify(bookGroups.map(x => { const [l, ks] = x.split(": "); return `${l}: ${ks.split(" ").sort().join(" ")}`; })));
console.log("a trait with no group is a Keyword:", cf.traitGroupOf("somethingnew"), "| Move is Kind:", cf.traitGroupOf("move"), "| Shot:", cf.traitGroupOf("shot"), "| Save:", cf.traitGroupOf("save"));
console.log("--- chips in the book's order");
const strip = h => h.replace(/ data-tooltip="[^"]*"/g, "");
const relocate = new Set(["strike", "handle", "body", "instinct"]);
console.log("Relocate:", cf.orderTraits(relocate).map(k => cf.TWOD12.traits[k]).join(", "));
console.log(strip(cf.traitChevrons(relocate)));
console.log("a weapon's properties:", strip(cf.traitChevrons(new Set(["thrown", "melee"]), { properties: true })));
const picker = cf.traitPicker();
console.log("the picker's groups:", picker.groups.join(", "), "| first options:", picker.options.slice(0, 4).map(o => `${o.label} (${o.group})`).join(", "));
console.log("--- the text colors");
console.log(cf.highlightText("Make a Body Check with 2 Boons and 1 Bane: Pushed 2, then Evade 1 (1A). The target is Vulnerable 1, you are Favored. Your Weapon Modifier, 1 Rally Point, 2 AP, 1R, Doomed, [HT: Entering, Turn], 1d6 / 1d4 / 0 [M]."));
console.log("not inside links, chips or headings:", cf.highlightText('<a>Body</a> <span class="tchip">Mind</span> <h3>Appeal</h3> Instinct'));
console.log("--- damage in its pool's color, the type in its own");
console.log(cf.prettyDamage("[B] 1[W] + [Mod] + [M] 1d4 Ho").replace(/ data-tooltip="[^"]*"/g, ""));
console.log("--- the CSS");
const css = src("styles/system.css");
console.log("the book's variables, light and dark:", css.includes("--g-roll: #1f7a73;") && css.includes("--g-roll: #5fd3c8;") && css.includes("--c-body: #7a1626;") && css.includes("--c-body: #ef8a96;"), "| the chips tinted (16% fill, 50% outline):", css.includes("background: color-mix(in srgb, var(--tg) 16%, transparent); border: 1px solid color-mix(in srgb, var(--tg) 50%, transparent);"), "| properties neutral:", css.includes(".twod12 .tprops .tchip.prop"), "| Body and Mind icons in their colors:", css.includes(".twod12 i.dt-body { color: var(--c-body); }"));
console.log("the trait picker is grouped on Action and Talent sheets:", ((src("templates/item-sheet.hbs").match(/options=traitPicker\.options groups=traitPicker\.groups/g) ?? []).length === 1 && /TWOD12\.traitGroups \?\? \[\]\)\.map\(g => `<optgroup/.test(src("module/actionsheet.mjs"))), "| the generator:", src("module/genaction.mjs").includes("<optgroup label="), "| the builder:", src("module/builder.mjs").includes('class="tpick-g"'));
