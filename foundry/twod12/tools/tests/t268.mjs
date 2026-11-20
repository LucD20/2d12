// Run with: node tools/tests/run.mjs (or node tools/tests/t268.mjs)
// v0.0.425 (Lucas, 2026-11-18: "I think I will go with 3"): the Test checklist inside Foundry (module/checklist.mjs). The running list
// foundry/to-test.md is built into checklist.json (tools/build-checklist.mjs; this test fails when they differ); the pure parts: the parser, a
// test's state by its revision, the next open test, the bar's HTML (no hover texts; icon buttons named), the List window's model, the report.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "module/checklist.mjs");

console.log("--- the list");
let check = "";
try { check = execFileSync(process.execPath, [ROOT + "tools/build-checklist.mjs", "--check"], { encoding: "utf8" }).trim(); } catch (e) { check = String(e.stdout ?? e.message).trim(); }
console.log("checklist.json follows foundry/to-test.md:", check.startsWith("checklist.json is up to date"));
const list = JSON.parse(src("checklist.json")), all = C.flatItems(list);
console.log("the first group is the bar's own test:", list.groups[0]?.name === "The test bar" && all[0]?.id === "bar-works");
console.log("every test has an id, a version, Do and Expect:", /* v0.0.463 to v0.0.474: the list shrinks as Lucas passes tests, and can be empty */ all.every(x => /^[a-z0-9-]+$/.test(x.id) && /^v0\.0\.\d+$/.test(x.v) && x.do && x.expect));
console.log("the release ships it (the zip takes the system folder but tools/tests):", src("../../.github/workflows/release.yml").includes("--exclude 'tools/tests'") && fs.existsSync(ROOT + "checklist.json"));

console.log("--- the parser");
const md = "intro\n## G1\n### a-1 · v0.0.425 · First\nDo: one\n  two\nExpect: three\n### b-2 · v0.0.424 · Second\nDo: x\nExpect: y\nRev: 3\n<!-- ### c · v0.0.1 · hidden -->\n## Empty\n";
const p = C.parseChecklist(md);
console.log(JSON.stringify(p));
console.log("a field goes on over lines; Rev read; a comment and an empty group dropped:", p.groups.length === 1 && p.groups[0].items[0].do === "one two" && p.groups[0].items[1].rev === 3);

console.log("--- the answers");
const res = { "a-1": { r: "pass", rev: 1 }, "b-2": { r: "fail", rev: 2, note: "old" } };
console.log("a-1 passed; b-2's answer was for Rev 2, the test is Rev 3: open:", C.stateOf(p.groups[0].items[0], res), C.stateOf(p.groups[0].items[1], res));
console.log("counts:", JSON.stringify(C.counts(p, res)), "| next open after a-1:", C.nextOpen(p, res, "a-1"), "| none open:", C.nextOpen(p, { ...res, "b-2": { r: "skip", rev: 3 } }, "a-1"));
console.log("previous of a-1 wraps to b-2:", C.stepItem(p, "a-1", -1), "| current with no cursor = the first open:", C.currentItem(p, res, "")?.id);

console.log("--- the bar");
const h = C.stripHtml({ list: p, res, cursor: "b-2", folded: false, version: "0.0.425" });
console.log("Test 2 of 2, Do / Expect, Pass Fail Skip, previous / next named, List:", h.includes("Test 2 of 2") && h.includes("<b>Do:</b> x") && ['data-tc="pass"', 'data-tc="fail"', 'data-tc="skip"', 'aria-label="Previous test"', 'aria-label="Next test"', 'data-tc="list"'].every(x => h.includes(x)));
console.log("no hover text:", !/data-tooltip|title=/.test(h + C.stripHtml({ list: p, res, cursor: "a-1", folded: true })));
console.log("the answer given is filled:", C.stripHtml({ list: p, res, cursor: "a-1" }).includes('class="tc-btn on" aria-pressed="true">Pass'));
const done = C.stripHtml({ list: p, res: { "a-1": { r: "pass", rev: 1 }, "b-2": { r: "skip", rev: 3 } }, cursor: "a-1" });
console.log("all answered: Copy report offered:", done.includes('data-tc="copy"'));
console.log("**bold** in a test's text, the rest escaped:", C.testText("a **b** <c>") === "a <b>b</b> &lt;c&gt;");

console.log("--- the List window and the report");
const lm = C.listModel(p, res, "0.0.425");
console.log("stats, a section per group plus Clear, Close and Copy report:", JSON.stringify(lm.stats), lm.sections.length, lm.cancel, lm.confirm, lm.sections[0].html.includes('data-row="b-2" data-k="show"'));
const rep = C.reportText(p, { ...res, "b-2": { r: "fail", rev: 3, note: "the Orc wasn't Prone", ver: "0.0.425", errors: [{ t: "[12:00] TypeError: x" }] } }, { version: "0.0.425", date: "D", loose: [{ t: "[12:01] other" }] });
console.log(rep);
console.log("the pick window's Cancel takes a word:", src("module/pickwindow.mjs").includes('${esc(m.cancel ?? "Cancel")}'));

console.log("--- wired");
const T = src("module/twod12.mjs");
console.log("registered at init, started at ready:", T.includes("registerChecklist();") && T.includes("startChecklist().catch"));
const M = src("module/checklist.mjs");
console.log("GM only, behind the world setting; answers in a world setting; Shift+K:", M.includes("game.user?.isGM && !!game.settings.get(F, \"testChecklist\")") && M.includes('register(F, "testResults", { scope: "world"') && M.includes('key: "KeyK", modifiers: ["Shift"]'));
console.log("a Fail asks in a pick window and keeps the errors since the test was shown:", M.includes("pickInput({ title: \"Test failed\"") && M.includes("errs.filter(e => e.at >= shownAt)"));
