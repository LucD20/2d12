// Run with: node tools/tests/run.mjs (or node tools/tests/t321.mjs)
// v0.0.522 (Lucas, 2026-11-26: "We will be adding Paladin trait to all Paladin Actions, and Archer to all Archer's Actions, so we can just call them
// their trait if necessary, like Paladin Actions."; the book, Chapter 7, Archer and Paladin): the class traits [Paladin] and [Archer], Keywords with no
// rule of their own. Every Action the class gives carries its class's trait (the packs and the pregens' copies), no Feature and no other Action does,
// and an effect's trait filter matches what it matched before (the trait only adds).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const C = await import(ROOTURL + "tools/content.mjs");   // first: it sets up what the modules need outside Foundry
const K = await import(ROOTURL + "module/config.mjs"), E = await import(ROOTURL + "module/effects.mjs");
const tr = d => new Set(d?.system?.traits ?? []);
console.log("labels:", K.TWOD12.actionTraits.paladin, K.TWOD12.actionTraits.archer, "| group:", K.traitGroupOf("paladin"), K.traitGroupOf("archer"), "| help:", !!K.TWOD12.traitHelp.paladin, !!K.TWOD12.traitHelp.archer);
console.log("the book's GROUPS has them as Keywords:", /\("keywords", "Keywords", \[[^\]]*"archer"[^\]]*"paladin"/.test(fs.readFileSync(ROOT + "../../book/build_rules.py", "utf8")), "| Chapter 7's rule:", fs.readFileSync(ROOT + "../../book/rules-src/07-traits.md", "utf8").includes("### Archer and Paladin"));
for (const cls of ["Paladin", "Archer"]) {
  const k = cls.toLowerCase(), mine = C.docs.filter(d => String(d.system?.category ?? "").startsWith(cls + " "));
  const acts = mine.filter(d => d.type === "action"), feats = mine.filter(d => d.type !== "action");
  console.log(`${cls} Actions (${acts.length}), each with [${cls}]:`, acts.every(d => tr(d).has(k)), "|", acts.map(d => d.name).join(", "));
  console.log(`${cls} Features without it:`, feats.every(d => !tr(d).has(k)), "|", feats.map(d => d.name).join(", "));
}
const others = C.docs.filter(d => d.type === "action" && !/^(Paladin|Archer) /.test(String(d.system?.category ?? "")) && (tr(d).has("paladin") || tr(d).has("archer")));
console.log("no other Action carries a class trait:", others.length === 0, others.map(d => d.name).join(", "));
const bad = [];
for (const p of C.pcs) for (const i of (p.items ?? []).filter(i => i.type === "action")) {
  const cat = String(i.system?.category ?? ""), t = new Set(i.system?.traits ?? []);
  if (cat.startsWith("Paladin ") && !t.has("paladin")) bad.push(`${p.name}: ${i.name}`);
  if (cat.startsWith("Archer ") && !t.has("archer")) bad.push(`${p.name}: ${i.name}`);
}
console.log("the pregens' copies carry it:", bad.length === 0, bad.join(", "));
const smite = tr(C.docs.find(d => d.name === "Smite")), quick = tr(C.docs.find(d => d.name === "Quick Shots"));
console.log("filters: all divine matches Smite:", E.matches({ all: ["divine"] }, smite), "| all paladin:", E.matches({ all: ["paladin"] }, smite), "| none ranged keeps Smite:", E.matches({ none: ["ranged"] }, smite), "| [Ranged, Strike] matches Quick Shots:", E.matches({ all: ["ranged", "strike"] }, quick), "| all archer misses Smite:", !E.matches({ all: ["archer"] }, smite));
console.log("[Paladin] in a text is a trait:", K.highlightText("Your [Paladin] Actions").includes('class="trhl" style="--tc:var(--g-keywords)">Paladin<'), "| the plain word is not colored:", !K.highlightText("The Paladin class").includes("<span"));
console.log("no code names a card for it:", !/paladin: ".*(Smite|Judge)/.test(src("module/config.mjs")));
