// Run with: node tools/tests/run.mjs (or node tools/tests/t230.mjs)
// v0.0.336 (Lucas on v0.0.335): the granted uses' bottom bar (Double Shot: a button per use left), the Granted section shown out of combat,
// Heartseeker's and Marksman's Shot's Vulnerable after a Tier 3's damage lands, "Blinded (EoT)" in one button, Brawler Mithril.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const FU = await import(ROOTURL + "module/freeuse.mjs");
const fx = (id, name, grants) => ({ id, name, flags: { twod12: { grants } } });
const model = FU.grantBarModel([fx("a", "Double Shot (2 Attacks)", [{ spec: "Weapon Attack", left: 2, count: 2 }]), fx("b", "Spent", [{ spec: "Charge", left: 0 }]), fx("c", "Aim", [])]);
console.log("the bar: a button per use left:", JSON.stringify(model), "| buttons:", model.reduce((n, x) => n + x.left, 0));
const src = n => fs.readFileSync(ROOT + n, "utf8");
console.log("it follows the controlled token and its effects:", src("module/freeuse.mjs").includes('["controlToken", "createActiveEffect", "updateActiveEffect", "deleteActiveEffect", "canvasReady"]'), "| the Granted section out of combat:", !src("module/pcsheet.mjs").includes('(inCombat || k !== "granted")'));
const C = await import(ROOTURL + "tools/content.mjs");
for (const n of ["Heartseeker", "Marksman's Shot"]) { const v = C.docs.find(d => d.type === "action" && d.name === n).system.versions[0]; console.log(`${n}: Tier 3 "${v.x3}" | after: ${v.after} | Critical: ${v.critical ?? "-"}`); }
console.log("Brawler:", C.docs.find(d => d.name === "Brawler").system.automation);
// v0.0.337 (Lucas: "the Actions tab completely broke"): a comment had been inserted mid-line in pcsheet.mjs and cut off the sections' .map (they
// rendered as empty boxes). The sections are objects again, and no module has code left after a // comment on the same line.
console.log("the Actions tab's sections are built:", /const sections = SECTION_ORDER\.filter\([^\n]*\)\.map\(k => \(\{ key: k, \.\.\.SEC_META\[k\], rows: secRows\[k\] \}\)\);/.test(src("module/pcsheet.mjs")));
const cut = fs.readdirSync(ROOT + "module").filter(f => f.endsWith(".mjs")).flatMap(f => src(`module/${f}`).split("\n").map((l, i) => ({ f, i: i + 1, l })))
  .filter(x => /\/\/[^\n]*[a-zA-Z)]\.(map|filter|find|reduce)\((\w+|\([^)]*\)) =>/.test(x.l));
console.log("code cut off by a comment on the same line:", cut.length ? cut.map(x => `${x.f}:${x.i}`).join(", ") : "none");
