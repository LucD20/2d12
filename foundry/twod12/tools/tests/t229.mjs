// Run with: node tools/tests/run.mjs (or node tools/tests/t229.mjs)
// v0.0.334 (Lucas's notes on v0.0.333): "Your weapon's normal range" read as the weapon's number (with an ⓘ), the GM forcing a Tier or Critical from
// the roll window's table, a Save Action's per-Tier Effects and "After the damage" chain (Rebuke: Push and Frightened after the damage lands; the
// chain's tier:N on a Save means that Tier or worse), Skirmish Shot's Evade after a Tier 3, the Basic Actions in the compendium, Marked Quarry's text.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const K = await import(ROOTURL + "module/config.mjs");
const bow = { system: { traits: new Set(["projectile", "ranged", "twohanded"]), range: "8/16/32" }, parent: { system: { reach: 1 } } };
const volley = { area: "2 Emanation", areaDistance: "Your weapon's normal range", distance: "", traits: new Set(["area", "ranged"]) };
console.log("--- the weapon's range");
for (const band of ["normal", "far", "maximum"]) { const it = { ...volley, areaDistance: `Your weapon's ${band} range` }; console.log(band, "->", K.distanceText(it, bow), "| ⓘ:", K.distanceNote(it, bow)); }
console.log("no weapon: the words stay:", K.distanceText(volley), "| no ⓘ:", JSON.stringify(K.distanceNote(volley)), "| a plain Distance:", K.distanceText({ distance: "5" }, bow), JSON.stringify(K.distanceNote({ distance: "5" }, bow)));
console.log("the meta line:", /Distance:<\/b> 8 sq\. <i class="fa-solid fa-circle-info dist-i" data-tooltip="Your weapon's normal range"/.test(K.metaRowHtml({ distance: K.distanceText(volley, bow), distanceTip: K.distanceNote(volley, bow) })));

console.log("--- the roll window: the GM forces a Tier or the Critical");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const rd = src("module/rolldlg.mjs"), ac = src("module/actions.mjs");
console.log("Tier and Critical names are buttons for the GM:", rd.includes('data-act="force" data-t="${n}"') && rd.includes('th(4, "Critical")') && src("module/rollinput.mjs").includes("canForce: !!game.user?.isGM"), "| 4 = a Critical (Tier 3 and its line):", ac.includes("const ft = forcedTier === 4 ? 3 : forcedTier, fcrit = forcedTier === 4;"));

console.log("--- Save Actions: Effects by Tier and the chain after the damage");
const il = src("module/inline.mjs"), cd = src("module/ccdamage.mjs");
console.log("the Save card carries the Version's Effects and chain:", il.includes("fx: Object.fromEntries([1, 2, 3].map(n => [`t${n}`,") && il.includes("after: String(version.after ?? \"\").trim() };"), "| its damage message runs them:", il.includes("after: cfg.after ?? \"\", save: true });") && cd.includes("(s.save || (r.tier ?? 0) >= 2)"));
const C = await import(ROOTURL + "tools/content.mjs");
const ALLDOCS = [...C.docs, ...C.OLD_CLASS_DOCS];   // v0.0.411 (pack F3): pack R's class cards (OLD_CLASS_DOCS) after the compendium's
for (const n of ["Rebuke", "Skirmish Shot"]) { const d = ALLDOCS.find(x => x.type === "action" && x.name === n), v = d.system.versions[0]; console.log(`${n} (${d.system.automation || "no rank"}):`, JSON.stringify([v.x1, v.x2, v.x3]), "| after:", v.after); }

console.log("--- the compendium");
const basics = ALLDOCS.filter(d => d.folder === "Basic Actions");
console.log("Basic Actions:", basics.length, basics.every(d => d.type === "action" && d.pack === "actions" && d.flags?.twod12?.basic || d.name === "Hide"), "| Opportunity Attack (v0.0.335, Lucas: adjacent, not the squares you threaten):", (o => `range ${o.momentRange}, threat check ${!!o.momentThreat}`)((await import("./oa-card.mjs")).OA), "| set aside (v0.0.407), not in the compendium's Basic Actions:", !basics.some(d => d.name === "Opportunity Attack"));
const mk = ALLDOCS.find(d => d.name === "Mark Quarry"), mq = mk;   // v0.0.360: the Feature is gone, the Action holds the rules
console.log("Marked Quarry:", mq.system.description.replace(/<[^>]+>/g, ""));
console.log("Mark Quarry:", mk.system.versions.map(v => v.effects.replace(/@UUID\[[^\]]+\]\{([^}]+)\}/g, "[$1 link]")).join(" / "));
