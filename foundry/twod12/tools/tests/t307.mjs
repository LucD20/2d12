// Run with: node tools/tests/run.mjs (or node tools/tests/t307.mjs)
// v0.0.500 (Lucas's v0.0.499 notes): the Token HUD's Vigor and Resolve boxes (hudhp.mjs hudHpChange), the status palette's groups and the map's
// condition numbers (statuspal.mjs), the Save dialog's Tier words (checkwindow.mjs saveTierWords), the sheet's bars (a click raises), the Large
// token in a wall (move.mjs spaceInWall), the retired names out of what Foundry shows.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= {}; globalThis.foundry.applications ??= { api: { ApplicationV2: class {}, DialogV2: {} } };
await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const H = await import(ROOTURL + "module/hudhp.mjs"), S = await import(ROOTURL + "module/statuspal.mjs"), CW = await import(ROOTURL + "module/checkwindow.mjs");

console.log("--- the HUD's Health boxes (left 12: 8 Lethal, 2 Nonlethal)");
const now = { left: 12, lethal: 8, nonlethal: 2 };
for (const t of ["-5", "+5", "+12", "10", "=15", "12", "abc", ""]) console.log(JSON.stringify(t), "->", JSON.stringify(H.hudHpChange(t, now)));
const html = H.hudHpHtml({ vigorLeft: 9, bdt: 14, resolveLeft: 4, mdt: 10 });
console.log("two boxes, Vigor then Resolve:", (html.match(/data-twod12-pool="(\w+)"/g) ?? []).join(" "), "| values:", (html.match(/value="(-?\d+)"/g) ?? []).join(" "), "| no hover text:", !/data-tooltip|title=/.test(html));

console.log("--- the status palette's groups");
const ids = ["bloodied", "prone", "vulnerable", "empowered", "blinded", "dead", "mystery"];
console.log(JSON.stringify(S.groupStatuses(ids)));
const all = S.STATUS_GROUPS.flatMap(g => g.ids), cfg = src("module/twod12.mjs").match(/CONFIG\.statusEffects = \[([\s\S]*?)\]\.map/)[1].match(/\["([a-z-]+)"/g).map(x => x.slice(2, -1));
console.log("every status in one group:", cfg.length, "statuses,", cfg.every(id => all.filter(x => x === id).length === 1), "| no group names a status that isn't one:", all.every(id => cfg.includes(id)));
console.log("the map's numbers:", [{ name: "Vulnerable 1" }, { name: "Slowed", flags: { twod12: { value: 2 } } }, { name: "Prone" }, { name: "Exhausted 3" }].map(S.effectNumber).join(" "));

console.log("--- the Save dialog's Tier words");
for (const t of ["3d6[mind,holy]", '2d6+3[body,slash], "Pushed 1."', '"No effect (Lingering continues)."', "0", "1d6![body]"]) console.log(JSON.stringify(t), "->", CW.saveTierWords(t));
console.log("used by the dialog:", src("module/checkwindow.mjs").includes("highlightText(esc(saveTierWords(tiers["));

console.log("--- the sheet's bars: a click raises, a right-click lowers");
const sh = src("module/actor-sheets.mjs");
console.log(sh.includes('t.addEventListener("click", ev => { if (ev.target.closest(".hpnum")) return; change(ev, t.dataset.pool, -1); });'), sh.includes('donut.addEventListener("contextmenu", ev => change(ev, poolAt(ev), 1));'));

console.log("--- a Large token in a wall (move.mjs spaceInWall)");
const mv = src("module/move.mjs");
console.log("the Alt-drag stops before:", mv.includes("wallBetween(mid(p), mid(q)) || spaceInWall(q, w, h)"), "| a willing drag isn't checked (v0.0.502, Lucas: \"The alt-drag correction is enough\"):", !mv.includes("doesn't fit there: part of its space would be inside a wall"));

console.log("--- the retired names, out of what Foundry shows (templates, the Basic Actions' groups, labels)");
const shown = [src("templates/parts/settings.hbs"), src("templates/item-sheet.hbs"), src("module/actionsheet.mjs"), sh.match(/const list = \[[^\n]*/)[0], src("module/builder.mjs"), src("module/twod12.mjs").match(/quick\("quickAttack"[^\n]*/)[0]].join("\n");
for (const n of ["Mark Quarry", "Marked Quarry", "Opportunity Attack", "Sharpshooter", "Brawler", "Long Draw", "Beacon's Step", "Weapon Attack"]) console.log(n, shown.includes(n) ? "STILL SHOWN" : "gone");
