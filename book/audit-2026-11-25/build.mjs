// The cleanup audit (2026-11-25): checks every finding's quotes against its file and writes findings.json, the answer page's data.
// Run: node book/audit-2026-11-25/build.mjs   (from the repo's root). A finding whose quote isn't in its file is listed and left out.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "../..");
const read = f => { try { return JSON.parse(fs.readFileSync(path.join(HERE, f), "utf8")); } catch { return null; } };
const lines = new Map(), linesOf = f => { if (!lines.has(f)) { try { lines.set(f, fs.readFileSync(path.join(ROOT, f), "utf8").split("\n")); } catch { lines.set(f, null); } } return lines.get(f); };

/** Where a quote stands: its own line, a line within 3 of it, or anywhere in the file (the line is then corrected). null: not in the file. */
function place(q) {
  const L = linesOf(q.file); if (!L || !q.quote) return null;
  const at = n => n >= 1 && n <= L.length && L[n - 1].includes(q.quote);
  if (at(q.line)) return q.line;
  for (let d = 1; d <= 3; d++) { if (at(q.line - d)) return q.line - d; if (at(q.line + d)) return q.line + d; }
  const i = L.findIndex(l => l.includes(q.quote)); return i < 0 ? null : i + 1;
}
const CHAPTER = f => {
  const m = /rules-src\/(\d+)-([a-z-]+)\.md$/.exec(f || ""); if (m) return `Chapter ${Number(m[1])} (${m[2].replace(/-/g, " ")})`;
  const c = /cards\/(?:stage0\/)?([a-z-]+)\.json$/.exec(f || ""); if (c) return `The ${c[1].replace(/-/g, " ")} cards`;
  return f || "";
};
const ORDER = f => { const m = /rules-src\/(\d+)-/.exec(f || ""); return m ? Number(m[1]) : 50; };

const out = [], bad = [];
for (const file of ["findings-book-1.json", "findings-book-2.json", "findings-book-3.json"]) {
  const list = read(file); if (!list) { console.log(`(no ${file} yet)`); continue; }
  for (const f of list) {
    const n = place(f); if (n == null) { bad.push(`${f.id}: quote not found in ${f.file}:${f.line}`); continue; }
    const other = [];
    for (const o of f.other ?? []) { const k = place(o); if (k == null) bad.push(`${f.id}: the other quote not found in ${o.file}:${o.line} (kept without it)`); else other.push({ ...o, line: k }); }
    out.push({ id: f.id, section: "book", group: CHAPTER(f.file), order: ORDER(f.file), kind: f.kind, where: f.where, file: f.file, line: n, quote: f.quote, other, problem: f.problem, options: f.options, pick: f.pick, confidence: f.confidence });
  }
}
out.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file) || a.line - b.line);
const GROUP = { "dropped-rule": "Rules the book dropped that the system still carries", "two-sources": "Two sources for the same thing", tool: "Tools that are frozen, failing or stale", dead: "Dead code and dead files", records: "Files that are history, not current" };
for (const f of read("findings-foundry.json") ?? []) {
  const sec = f.group === "records" ? "records" : "foundry";
  out.push({ id: f.id, section: sec, group: GROUP[f.group] ?? f.group, kind: f.group, what: f.what, paths: f.where, evidence: f.evidence, size: f.size, risk: f.risk, options: f.options, pick: f.pick, confidence: f.confidence });
}
for (const f of read("findings-records.json") ?? []) out.push({ section: "records", group: "Files that are history, not current", kind: "records", ...f });
const rank = { book: 0, foundry: 1, records: 2 };
out.sort((a, b) => rank[a.section] - rank[b.section]);
for (const f of out) delete f.order;
fs.writeFileSync(path.join(HERE, "findings.json"), JSON.stringify(out, null, 1).replace(/</g, "\\u003c"));
const by = {}; for (const f of out) by[f.section] = (by[f.section] ?? 0) + 1;
console.log(`findings.json: ${out.length} questions`, JSON.stringify(by));
if (bad.length) console.log("NOT FOUND:\n" + bad.join("\n")); else console.log("every quote is in its file");
