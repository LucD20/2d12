// Run with: node tools/tests/run.mjs (or node tools/tests/t122.mjs)
// v0.0.140-141: loadout warnings as an icon; the "where" buttons; Fists not listed; right-click menus not clipped; Foundry's own window and title bar.
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
const L = await import(ROOT + "module/loadout.mjs");
const show = bs => bs.map(b => (b.on ? `[${b.l}]` : b.l)).join(" / ");
for (const w of ["dropped", "worn", "1h", "2h"]) console.log("weapon", w.padEnd(7), show(L.whereButtons("weapon", w)));
for (const a of ["dropped", "carried", "worn"]) console.log("armor ", a.padEnd(7), show(L.whereButtons("armor", a)));
console.log("tips:", L.whereButtons("weapon", "worn").map(b => `${b.l}=${b.tip}`).join(" | "), "| only Dropped is red:", L.whereButtons("armor", "x").filter(b => b.drop).map(b => b.v).join(","));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("slot warnings are an icon with a hover:", (tpl.match(/<i class="lo-wi fa-solid fa-triangle-exclamation" data-tooltip="/g) || []).length === 2, "| no warning lines:", !tpl.includes("lo-warn"));
console.log("rows: buttons, no dropdown:", (tpl.match(/class="lr-seg"/g) || []).length === 2 && !tpl.includes("lr-where") && !tpl.includes("lr-act"), "| Fists not listed:", sh.includes('weapons.filter(w => weaponWhere(w) !== "none")'), "| clicking the current one does nothing:", sh.includes('if (target.classList.contains("on")) return;'));
console.log("right-click menus fixed:", (sh.match(/jQuery: false, fixed: true/g) || []).length, "| any not fixed:", /jQuery: false \}/.test(sh));
console.log("window background and title bar left to Foundry:", !/\.application\.twod12\.twod12-actor \{ background:/.test(css), "| sheet dark blue:", css.includes(".twod12.sheet.ns { background: var(--np-bg); }"));
console.log("v0.0.142 see-through title bar:", css.includes("background: none !important; }") && css.includes("> .window-header { background: var(--twod12-hdr) !important; backdrop-filter: blur(var(--twod12-hdr-blur));"));
