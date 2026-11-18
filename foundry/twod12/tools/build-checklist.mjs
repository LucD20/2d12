// v0.0.425: builds the system's checklist.json (what the Test checklist shows in Foundry) from the running list foundry/to-test.md.
// node tools/build-checklist.mjs          writes checklist.json
// node tools/build-checklist.mjs --check  only says whether checklist.json is up to date (t268 runs it); exits 1 if not
// It also refuses a list with a repeated id or a test without Do or Expect.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../", import.meta.url));
globalThis.foundry ??= {};
const { parseChecklist, flatItems } = await import(new URL("../module/checklist.mjs", import.meta.url).href);
const SRC = ROOT + "../to-test.md", OUT = ROOT + "checklist.json";
const list = parseChecklist(fs.readFileSync(SRC, "utf8"));
const problems = [], seen = new Set();
for (const it of flatItems(list)) {
  if (seen.has(it.id)) problems.push(`repeated id: ${it.id}`); seen.add(it.id);
  if (!it.do.trim()) problems.push(`${it.id}: no Do`);
  if (!it.expect.trim()) problems.push(`${it.id}: no Expect`);
}
if (problems.length) { console.log(`to-test.md has problems:\n  ${problems.join("\n  ")}`); process.exit(1); }
const json = `${JSON.stringify(list, null, 1)}\n`;
const n = flatItems(list).length;
if (process.argv.includes("--check")) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (now === json) console.log(`checklist.json is up to date (${n} tests in ${list.groups.length} groups)`);
  else { console.log("checklist.json is out of date: run node tools/build-checklist.mjs"); process.exit(1); }
} else { fs.writeFileSync(OUT, json); console.log(`checklist.json written: ${n} tests in ${list.groups.length} groups`); }
