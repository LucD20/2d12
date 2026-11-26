// Run with: node tools/tests/run.mjs (or node tools/tests/t310.mjs)
// The core rework batch 5, first step (Lucas, 2026-11-25: "Remove arts, remove escalation passives. Make sure the PCs sheets are correct"; book,
// Chapters 2, 5, 12, 13): the six Arts, the Escalation Passives and Reckoning leave the classes, the packs and the pregens (tools/content.mjs
// REMOVED_B5, kept in deprecatedDocs for the machinery tests); the class windows lose the Art and Escalation sections; an existing world's
// characters lost them once (migrater.mjs migrateB5; gone in v0.0.527, F-033).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= { utils: {} };
const C = await import(ROOTURL + "tools/content.mjs");
const B5_SECTIONS = ["pal1art", "pal1esc2", "pal2esc4", "pal3art", "pal3esc6", "arc1art", "arc1esc2", "arc2esc4", "arc3art", "arc3esc6"];   // the removed sections (the old migration's list)

console.log("--- the packs");
console.log("removed names:", C.REMOVED_B5.length, "| none left in the packs:", !C.docs.some(d => C.REMOVED_B5.includes(d.name)), "| all kept as deprecated:", C.REMOVED_B5.every(n => C.deprecatedDocs.some(d => d.name === n)));
console.log("--- the classes");
for (const n of ["Paladin", "Archer"]) {
  const c = C.docs.find(d => d.type === "class" && d.name === n).system;
  console.log(`${n}: no Escalation lists: ${!c.escPassives.length && !c.escActives.length} | sections: ${c.levels.map((l, i) => `${i + 1}: ${l.sections.map(s => s.title).join(", ")}`).join(" | ")}`);
  console.log(`  no removed section id: ${!c.levels.some(l => l.sections.some(s => B5_SECTIONS.includes(s.id)))}`);
}
console.log("--- the pregens (the sheets)");
for (const p of C.pcs) {
  const names = (p.items ?? []).filter(i => ["action", "feature"].includes(i.type) && !i.flags?.twod12?.basic).map(i => i.name);
  const cls = (p.items ?? []).find(i => i.type === "class"), picks = cls?.flags?.twod12?.classPicks ?? {};
  console.log(`${p.name}: level ${p.system.level} | nothing removed: ${!names.some(n => C.REMOVED_B5.includes(n))} | picks: ${Object.entries(picks).map(([l, s]) => `${l}: ${Object.keys(s).join(",")}`).join(" / ")} | ${names.join(", ")}`);
}
