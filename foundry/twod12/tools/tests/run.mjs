// Runs every test in this folder: node tools/tests/run.mjs [t12 t44 ...] [--update]
// A test FAILS if it throws. A test whose printed output differs from expected/<name>.txt is reported as CHANGED:
// look at the difference; if the change is intended, accept it with --update (all) or --update <name>.
// The tests use small stand-ins for Foundry, so they check the system's logic, not what Foundry shows.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dir = fileURLToPath(new URL(".", import.meta.url));
const root = fileURLToPath(new URL("../../", import.meta.url));   // printed paths become <root>/, so outputs match on any machine
const update = process.argv.includes("--update");
const only = process.argv.slice(2).filter(a => !a.startsWith("--"));
const num = f => parseInt(f.slice(1), 10);
const files = readdirSync(dir).filter(f => /^t\d+[a-z]?\.mjs$/.test(f))
  .filter(f => !only.length || only.includes(f.replace(".mjs", "")))
  .sort((a, b) => num(a) - num(b) || a.localeCompare(b));
mkdirSync(join(dir, "expected"), { recursive: true });
let fail = 0, changed = 0;
for (const f of files) {
  const name = f.replace(".mjs", "");
  const r = spawnSync(process.execPath, [join(dir, f)], { encoding: "utf8" });
  const out = ((r.stdout ?? "") + (r.stderr ?? "")).split(root).join("<root>/");
  const exp = join(dir, "expected", `${name}.txt`);
  if (r.status !== 0) { fail++; console.log(`FAIL     ${name}\n${out.trim().split("\n").slice(0, 6).join("\n")}\n`); continue; }
  if (update) { writeFileSync(exp, out); continue; }
  if (existsSync(exp) && readFileSync(exp, "utf8") !== out) { changed++; console.log(`CHANGED  ${name}  (compare with expected/${name}.txt; accept with --update ${name})`); }
}
console.log(`${files.length} tests: ${files.length - fail - changed} ok, ${changed} changed, ${fail} failed${update ? " (expected outputs saved)" : ""}`);
process.exit(fail ? 1 : 0);
