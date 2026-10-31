// Run with: node tools/tests/run.mjs (or node tools/tests/t163.mjs)
// v0.0.206 (Lucas, layout B4): the Initiative card's data: the tracker's turn order (zipper, ties), bands, repeated names, "(...)" notes,
// mixed Attributes, a chained explosion, Boon and Bane, Favored with a dropped die; and Favored keeps the highest pair when Doubles do nothing.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
class FakeCombat { setupTurns() { this.turns = this._c.slice(); this.current = {}; return this.turns; } }
globalThis.Combat = FakeCombat;
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1, HOSTILE: -1 } };
globalThis.foundry = { applications: { api: { DialogV2: {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => null } };
const { TwoD12Combat } = await import(ROOTURL + "module/combat.mjs");
const { initCardData, initCardHtml, splitName } = await import(ROOTURL + "module/initcard.mjs");
const { keepDice } = await import(ROOTURL + "module/roll.mjs");
const mk = (id, name, init, disp, attrMod) => ({ id, name, initiative: init, token: { disposition: disp }, actor: { type: disp === 1 ? "character" : "npc" }, getFlag: (s, k) => (k === "initAttr" ? attrMod : undefined) });
const all = [
  mk("g1", "Goblin Sneak", 7, -1, 1), mk("g2", "Goblin Sneak", 34, -1, 1), mk("g3", "Goblin Sneak", 6, -1, 1), mk("g4", "Goblin Sneak", 13, -1, 0),
  mk("a3", "Archer 3 (Rolling Shot, Kickboxer)", 22, 1, 1), mk("a1", "Archer 1 (Double Shot, Marksman)", 7, 1, 2),
  mk("lana", "Lana", 13, 1, 0), mk("zack", "Zack", 13, 1, 2), mk("nari", "Nari", 13, 0, 3)
];
const combat = new TwoD12Combat(); combat._c = all; combat.turn = 0;
const order = combat.setupTurns().map(c => c.id);
console.log("turn order (zipper):", order.join(", "));
console.log("tie inside a side (Zack and Lana at 13): the higher Modifier first:", order.indexOf("zack") < order.indexOf("lana"));
const heads = new TwoD12Combat(); heads._c = [mk("f", "Goblin Sneak", 20, -1, 1), mk("p", "Drak", 20, 1, 1), mk("f2", "Goblin Sneak", 20, -1, 2)];
console.log("tie between sides at 20: the higher Modifier leads:", heads.setupTurns().map(c => c.id).join(", "));
const heads2 = new TwoD12Combat(); heads2._c = [mk("f", "Goblin Sneak", 20, -1, 1), mk("p", "Drak", 20, 1, 1)];
console.log("same total and Modifier: Friendly first:", heads2.setupTurns().map(c => c.id).join(", "));
const R = (d1, d2, mod, total, o = {}) => ({ d1, d2, total, mod, dropped: null, state: "", bo: 0, ba: 0, manualBoons: 0, manualBanes: 0, boonFaces: [], baneFaces: [], ...o });
const rows = [
  { id: "g1", name: "Goblin Sneak", side: -1, attr: "instinct", mod: 1, r: R([3], [3], 1, 7) },
  { id: "g2", name: "Goblin Sneak", side: -1, attr: "instinct", mod: 1, r: R([12, 12, 5], [6], 1, 34) },   // 11 + 11 + 5 + 6 + 1
  { id: "g3", name: "Goblin Sneak", side: -1, attr: "instinct", mod: 1, r: R([3], [2], 1, 6) },
  { id: "g4", name: "Goblin Sneak", side: -1, attr: "body", mod: 0, r: R([5], [9], 0, 13, { ba: 1, manualBanes: 1, baneFaces: [1] }) },
  { id: "a3", name: "Archer 3 (Rolling Shot, Kickboxer)", side: 1, attr: "instinct", mod: 1, r: R([11], [8], 1, 22, { bo: 2, manualBoons: 1, boonFaces: [2] }) },
  { id: "a1", name: "Archer 1 (Double Shot, Marksman)", side: 1, attr: "instinct", mod: 2, r: R([3], [2], 2, 7, { state: "favored", dropped: [1] }) },
  { id: "lana", name: "Lana", side: 1, attr: "mind", mod: 0, r: R([6], [7], 0, 13) },
  { id: "zack", name: "Zack", side: 1, attr: "instinct", mod: 2, r: R([5], [6], 2, 13) },
  { id: "nari", name: "Nari", side: 0, attr: "appeal", mod: 3, r: R([4], [6], 3, 13, { state: "doomed", dropped: [12, 4] }) }
];
const data = initCardData(rows, order);
for (const b of data.bands) console.log(`${b.label} (best ${b.best}):`, b.rows.map(x => `${x.pos}. ${x.base}${x.num ? ` #${x.num}` : ""}${x.note ? ` (${x.note})` : ""} [${x.attr}] ${x.total}`).join(" | "));
const html = initCardHtml(data);
const txt = s => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const rowOf = id => { const i = data.bands.flatMap(b => b.rows).findIndex(x => x.id === id); return html.split('<div class="ic-exp">')[i + 1].split("</div></div>")[0]; };
console.log("Goblin 2, a chained explosion:", txt(rowOf("g2")), "| two links:", (rowOf("g2").match(/fa-link/g) ?? []).length === 2, "| orange dice (a 12 or a reroll):", (rowOf("g2").match(/die d12 (boom|chain)/g) ?? []).length);
console.log("Goblin 4, Body with a Bane:", txt(rowOf("g4")));
console.log("Archer 3, a Boon:", txt(rowOf("a3")));
console.log("Archer 1, Favored, the dropped die:", txt(rowOf("a1")), "| dropped marked:", rowOf("a1").includes("ic-drop"));
console.log("Nari, Doomed, a dropped exploded die:", txt(rowOf("nari")));
console.log("no Doubles mark:", !html.includes(" dbl"), "| no Attribute in the header:", !/class="ahead"[^]*?(Instinct|Body)[^]*?<\/div><\/div><div class="orn"/.test(html.split('<div class="orn"')[0] + '<div class="orn"'), "| letter chips:", [...html.matchAll(/class="ic-attr (\w+)"[^>]*>(\w)</g)].map(m => m[2]).join(""));
console.log("parentheses muted:", html.includes('<i class="ic-note">(Rolling Shot, Kickboxer)</i>'), "| names escaped:", initCardHtml(initCardData([{ id: "x", name: "<b>Zack</b>", side: 1, attr: "instinct", mod: 0, r: R([1], [1], 0, 2) }], ["x"])).includes("&lt;b&gt;Zack"));
console.log("splitName:", JSON.stringify(splitName("Archer 1 (Double Shot, Marksman)")), JSON.stringify(splitName("(Odd)")));
// Favored, 3d12 = 5, 5, 7: with Doubles the pair 5+5 (Tier up) would win; for initiative the highest pair 5+7.
const d = [{ total: 5, first: 5 }, { total: 5, first: 5 }, { total: 7, first: 7 }];
console.log("Favored with Doubles counting keeps:", keepDice(d, "favored", 0, 13).i.join("+"), "| initiative (noDoubles) keeps:", keepDice(d, "favored", 0, 13, true).i.join("+"));
