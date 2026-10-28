// Run with: node tools/tests/run.mjs (or node tools/tests/t85.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// One roll for several targets: shared dice, each target calculated on its own (DC, boons, banes, Favored, Doomed).
let script = [];   // the faces the next dice show, in order (d12 faces, then d3 faces)
class FakeRoll {
  constructor(formula) { this.formula = formula; }
  async evaluate() {
    const m = /^(\d+)d(\d+)(?:-(\d+))?$/.exec(this.formula);
    const n = Number(m[1]), sides = Number(m[2]);
    const results = Array.from({ length: n }, () => ({ result: script.shift() ?? 1 }));
    this.dice = [{ results }];
    this.total = results.reduce((a, r) => a + r.result, 0) - (m[3] ? Number(m[3]) : 0);
    return this;
  }
}
globalThis.Roll = FakeRoll; globalThis.CONFIG = {}; globalThis.foundry = { dice: { terms: {} }, utils: {} }; globalThis.game = { settings: { get: () => true } };
const R = await import(ROOTURL + "module/roll.mjs");
const sp = (over = {}) => ({ key: "x", mod: 2, adj: 0, dc: 13, boons: 0, banes: 0, favored: false, doomed: false, sources: [], ...over });
const show = (label, out) => console.log(label.padEnd(54), out.results.map(r => `${r.key}: ${r.chk.d1.join("+")}|${r.chk.d2.join("+")}${r.chk.state ? ` (${r.chk.state}, dropped ${r.chk.dropped})` : ""} boons ${r.chk.boonFaces.join("")} banes ${r.chk.baneFaces.join("")} → ${r.chk.total} vs DC ${r.chk.dc}: tier ${r.chk.tier}${r.chk.doubles ? " doubles" : ""}${r.chk.crit ? " CRIT" : ""}`).join(" || "));
// the rule's example: a boon against Lonny but not Nari; 2d12 and 1 boon rolled
script = [5, 7, 2]; // d12, d12, one boon die (shows 2, counts 1)
let out = await R.performMultiCheck([sp({ key: "Nari" }), sp({ key: "Lonny", boons: 1 })]);
show("2d12 and 1 boon: the boon only for Lonny", out);
console.log("  dice rolled:", out.dice.d.length, "d12 and", out.dice.boonFaces.length, "boon dice | Nari's total uses no boon:", out.results[0].chk.total === 5 + 7 + 2, "| Lonny's does:", out.results[1].chk.total === 5 + 7 + 2 + 1);
// different DCs for the same total
script = [6, 8];
out = await R.performMultiCheck([sp({ key: "a", dc: 13 }), sp({ key: "b", dc: 17 }), sp({ key: "c", dc: 24 })]); show("same dice, three DCs (16 total)", out);
// a third die: Favored keeps the two highest, Doomed the two lowest, nobody else is touched
script = [3, 9, 11];
out = await R.performMultiCheck([sp({ key: "plain" }), sp({ key: "favored", favored: true }), sp({ key: "doomed", doomed: true }), sp({ key: "both", favored: true, doomed: true })]); show("3d12 because two targets need it (3, 9, 11)", out);
console.log("  dice rolled:", out.dice.d.length, "| plain used the first two:", out.results[0].chk.total === 3 + 9 + 2, "| favored kept 9+11:", out.results[1].chk.total === 9 + 11 + 2, "| doomed kept 3+9:", out.results[2].chk.total === 3 + 9 + 2, "| both cancel out:", out.results[3].chk.state === "");
script = [4, 6];
out = await R.performMultiCheck([sp({ key: "a" }), sp({ key: "b" })]); console.log("nobody needs a third die: dice rolled", out.dice.d.length);
// boons and banes: as many dice as the most any target needs; each target takes the first ones it needs
script = [6, 7, 3, 2, 1, 3, 2];  // d12, d12, then 3 boon dice (show 3,2,1 → 2,1,0), then 2 bane dice (show 3,2 → 2,1)
out = await R.performMultiCheck([sp({ key: "one boon", boons: 1 }), sp({ key: "three boons, one bane", boons: 3, banes: 1 }), sp({ key: "two banes", banes: 2 }), sp({ key: "none" })]); show("boon and bane dice shared", out);
console.log("  rolled", out.dice.boonFaces.length, "boon dice and", out.dice.baneFaces.length, "bane dice:", out.dice.boonFaces.join(","), "|", out.dice.baneFaces.join(","));
// Doubles per target use the first faces of the dice it kept
script = [5, 5, 9];
out = await R.performMultiCheck([sp({ key: "plain" }), sp({ key: "favored", favored: true })]); show("Doubles: 5 and 5 with a third die 9", out);
// a 12 explodes (counts 11, rolled again)
script = [12, 4, 5, 6];
out = await R.performMultiCheck([sp({ key: "a", dc: 13 }), sp({ key: "b", dc: 33 })]); show("an exploding 12 (12 → 4)", out);
// the card
const rows = out.results.map(r => ({ name: r.key, chk: r.chk, chips: r.key === "b" ? [{ text: "Cover (1 Bane)", cls: "bane" }] : [] }));
const html = R.multiCheckHtml("Weapon Modifier · Body", out.dice, rows, ["Weapon Modifier +2"]);
console.log("card: one dice line, a row per target:", (html.match(/class="mrow/g) || []).length, "rows,", (html.match(/class="die d12/g) || []).length, "d12 faces shown | has the chain for the exploded 12:", html.includes("dlink"), "| a target's chip:", html.includes("Cover (1 Bane)"), "| names escaped:", R.multiCheckHtml("t", out.dice, [{ name: "<b>x</b>", chk: out.results[0].chk }]).includes("&lt;b&gt;"));
// names: collapsing and numbering
console.log("collapseNames:", R.collapseNames(["Skeleton Captain", "Skeleton Captain", "Nari", "Skeleton Captain", "Nari", "Lonny"]), "|", JSON.stringify(R.collapseNames([])), "|", R.collapseNames(["A"]));
console.log("uniqueLabels:", R.uniqueLabels(["Orc", "Nari", "Orc", "Orc", "Lonny"]).join(", "), "|", R.uniqueLabels(["A", "B"]).join(", "));
// rows with the same name and result share one row, different results don't
const same = { d1: [4], d2: [5], total: 11, dc: 13, tier: 1, base: 1, doubles: false, crit: false, mod: 2, adj: 0, bo: 0, ba: 0, state: "", dropped: null };
const diff = { ...same, total: 16, tier: 2, base: 2 };
const html2 = R.multiCheckHtml("Strike", { d: [{ faces: [4] }, { faces: [5] }], boonFaces: [], baneFaces: [] }, [
  { name: "Orc", label: "Orc 1", chk: same, chips: [], odds: "T1 28%" }, { name: "Orc", label: "Orc 2", chk: same, chips: [], odds: "T1 28%" }, { name: "Orc", label: "Orc 3", chk: diff, chips: [{ text: "Cover", cls: "bane" }] }, { name: "Nari", label: "Nari", chk: same, chips: [] }]);
console.log("four creatures, three rows:", (html2.match(/class="mrow t/g) || []).length, "| the shared row says ×2:", html2.includes("Orc \u00d72"), "| the third Orc is its own row with its number:", html2.includes(">Orc 3<"), "| odds shown:", (html2.match(/class="modds"/g) || []).length, "| the calculation is in a tooltip:", html2.includes("4 + 5 + 2 = 11 vs DC 13"));
