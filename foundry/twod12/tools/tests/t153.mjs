// Run with: node tools/tests/run.mjs (or node tools/tests/t153.mjs)
// v0.0.188 (pack C-b): the compendium follows the book after OT: the Paladin and Archer Repertoire and Escalation lists, every Talent of
// 16-talents.md as a Talent item with its data, the old cards in their folders, and the text sync (Bane and Boon capitalized, numerals).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const C = await import(ROOTURL + "tools/content.mjs");
const { BASIC_ACTIONS, basicItemData } = await import(ROOTURL + "module/basic.mjs");
const byUuid = u => C.allDocs.find(d => ["features", "actions"].some(p => C.uuidOf(p, d.name) === u) && ["feature", "action", "talent"].includes(d.type));
const names = list => (list ?? []).map(u => byUuid(u)?.name ?? "?").join(", ");
for (const cls of ["Paladin", "Archer"]) {
  const s = C.allDocs.find(d => d.type === "class" && d.name === cls).system;
  console.log(`${cls}: Repertoire ${names(s.repertoire)} | Passives ${names(s.escPassives)} | Actives ${names(s.escActives)}`);
}
// the book's Talents, in its order
const { loadCards } = await import(ROOTURL + "tools/cardgen.mjs");   // v0.0.232 (pack CS): the book's Talents are the cards of book/cards/talents.json (the chapter places them; book/cards/set-aside/talents.json since the cleanup audit)
const heads = loadCards(undefined, { setAside: true }).filter(c => c._file === "set-aside/talents.json" && /^(Combat|Mobility|Magic|Skill) Talent$/.test(c.category)).map(c => ({ name: c.name, group: c.category.split(" ")[0].toLowerCase(), level: c.level ?? 1 }));
console.log(`the book's Talents: ${heads.length}`);
for (const h of heads) {
  const t = C.allDocs.find(d => d.type === "talent" && d.name === h.name);
  if (!t) { console.log(`  ${h.name}: MISSING`); continue; }
  const s = t.system, ok = s.group === h.group && (s.level ?? 1) === h.level;
  const pre = (s.prereqs ?? []).map(p => `${p.kind}:${p.name || p.value}`).join(s.prereqMode === "any" ? " or " : ", ");
  console.log(`  ${h.name.padEnd(18)} ${ok ? "ok" : `WRONG (${s.group} ${s.level})`} ${h.group} ${h.level}${pre ? ` | needs ${pre}` : ""}${s.theme ? ` | ${s.theme}` : ""}${(s.actions ?? []).length ? ` | grants ${names(s.actions)}` : ""}${(s.settings ?? []).length ? ` | settings ${s.settings.map(x => x.type).join(", ")}` : ""}`);
}
console.log("no Talent Action offered twice (an Action's category is not \"Talent...\"):", !C.allDocs.some(d => d.type === "action" && /^talent/i.test(d.system.category ?? "")));
const leg = C.allDocs.find(d => d.type === "action" && d.name === "Leg Sweep");
console.log("Leg Sweep: a kick", leg.system.weaponUse === "kick", "| no free hand needed", !leg.system.requirements, "| Kickboxer grants it", names(C.allDocs.find(d => d.type === "talent" && d.name === "Kickboxer").system.actions));
console.log("old cards: Paladin", C.allDocs.filter(d => d.folder === "Paladin (old cards)").map(d => d.name).join(", "));
console.log("old cards: Archer", C.allDocs.filter(d => d.folder === "Archer (old cards)").map(d => d.name).join(", "));
// the text sync: every compendium and Basic Action text
const texts = [];
const walk = (w, o) => { if (typeof o === "string") texts.push([w, o]); else if (Array.isArray(o)) o.forEach(x => walk(w, x)); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!["img", "uuid", "fxUuid", "choiceOptions", "actions", "traits", "all", "any", "none", "from", "type", "kind", "rules", "ends", "autoHover"].includes(k)) walk(w, v); };   // v0.0.323: the rules (and the hover text built from them) repeat the settings' words
for (const d of C.allDocs) walk(d.name, d.system);
for (const k of Object.keys(BASIC_ACTIONS)) { const d = basicItemData(k); walk(d.name, d.system); }
const strip = t => t.replace(/@\w+\[[^\]]*\]/g, "");
const low = texts.filter(([, t]) => /\b(banes?|boons?)\b/.test(strip(t)));
console.log("lowercase Bane / Boon in the texts:", low.length ? low.map(([w]) => w).join(", ") : "none");
const words = texts.filter(([, t]) => /\b(can use|uses?) (one|two|three) Rally Points?\b/i.test(t));
console.log("Rally Points written in words:", words.length ? words.map(([w]) => w).join(", ") : "none");
