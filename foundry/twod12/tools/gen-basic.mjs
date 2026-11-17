// Writes module/basic-data.mjs (the Basic Actions as basic.mjs keeps them) from book/cards/basic-actions.json (pack CS, 2026-11-03).
//   node tools/gen-basic.mjs           writes the file
//   node tools/gen-basic.mjs --check   exits 1 when the file is stale (test t177 runs this)
// The sheet builds the Basic Actions on every actor from module code, which cannot read the book's folder: this is the one generated file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCards, basicEntry } from "./cardgen.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// The order of the entries (the Actions tab groups and the NPC compendium keep it): today's, new keys after.
const ORDER = ["basicWeaponAttack", "advance", "safeMovement", "reload", "interact", "rally", "crawl", "regrip", "release", "stand", "breakFree", "charge", "leaning", "fists", "relocate", "trip", "shove", "haul"];

// v0.0.407 (Stage 0 in Foundry; book, Chapter 6): a Basic Action listed in book/cards/set-aside.txt (Opportunity Attack) is no longer a Basic Action:
// its card stays in basic-actions.json, but no creature gets it (a Talent brings it back later).
const SET_ASIDE = new Set(fs.readFileSync(path.resolve(root, "../../book/cards/set-aside.txt"), "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")));
export function basicDataSource() {
  const cards = loadCards().filter(c => c.foundry?.basic && !SET_ASIDE.has(c.name));
  const byKey = new Map(cards.map(c => [c.foundry.basic, c]));
  const keys = [...ORDER.filter(k => byKey.has(k)), ...cards.map(c => c.foundry.basic).filter(k => !ORDER.includes(k))];
  const entries = keys.map(k => `  ${k}: ${JSON.stringify(basicEntry(byKey.get(k)))}`);
  return `// GENERATED from book/cards/basic-actions.json by tools/gen-basic.mjs: do not edit (edit the card, then run node tools/gen-basic.mjs).\n// The Basic Actions every creature has, as basic.mjs builds them on an actor. Test t177 fails when this file is stale.\nexport const BASIC_ACTIONS = {\n${entries.join(",\n")}\n};\n`;
}

const file = path.join(root, "module", "basic-data.mjs");
const src = basicDataSource();
if (process.argv.includes("--check")) {
  const now = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (now !== src) { console.error("module/basic-data.mjs is stale: run node tools/gen-basic.mjs"); process.exit(1); }
  console.log("module/basic-data.mjs is up to date");
} else if (import.meta.url === new URL(`file://${process.argv[1]}`).href || process.argv[1]?.endsWith("gen-basic.mjs")) {
  fs.writeFileSync(file, src);
  console.log(`wrote module/basic-data.mjs (${(src.match(/^  \w+: /gm) ?? []).length} Basic Actions)`);
}
