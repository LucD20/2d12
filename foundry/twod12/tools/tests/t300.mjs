// Run with: node tools/tests/run.mjs (or node tools/tests/t300.mjs)
// v0.0.489: Redesigned Initiative Squads (visual Squad Cards, + Squad / + Add popovers, multi-select bulk bar,
// Auto-Squad Minions / Ungroup All, drag-and-drop), conditional Bloodied/Strained chat card lines,
// polyhedral SVG dice shapes (d4-d12), and Encounter Log fixes (ccUndo damage voiding, off-turn actor prefix,
// Reaction dedup, cleanEffectName, HP Bar header).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "dmg_id_1" }
};
globalThis.game = { system: { version: "0.0.489" }, user: { id: "gm", isGM: true, isActiveGM: true }, settings: { register() {}, get: () => true } };

const IM = await import(ROOTURL + "module/initmodel.mjs");
const IV = await import(ROOTURL + "module/initview.mjs");
const CC = await import(ROOTURL + "module/chatcards.mjs");
const EL = await import(ROOTURL + "module/enclog.mjs");

// 1. Initiative Squads (auto-squad, roll unit count, join/warn/remove/dissolve/ungroup)
const call = { attr: "instinct" };
const fx0 = { boons: 0, banes: 0, fav: false, doom: false, favBy: [], doomBy: [], exh: 0, chips: [] };
const mk = o => ({ img: "", hidden: false, rolled: null, fx: { ...fx0 }, set: {}, pc: false, npc: true, disp: -1, mods: { body: 0, mind: 0, appeal: 0, instinct: 1 }, ...o });
const enc = () => [
  mk({ id: "pc1", name: "Durgan", pc: true, npc: false, owner: "Lucas", disp: 1 }),
  mk({ id: "oc", name: "Ogre Chieftain", role: "elite", actorId: "O" }),
  mk({ id: "ow", name: "Orc Warrior", role: "standard", actorId: "W" }),
  ...[1, 2, 3, 4].map(i => mk({ id: `g${i}`, name: `Goblin Sneak ${i}`, base: "Goblin Sneak", role: "minion", minion: "G|Goblin Sneak", actorId: "G" }))
];

const list0 = enc();
const m0 = IM.gmModel(list0, call);
const enemies0 = m0.sides.find(s => s.key === "hostile");
const sqRows0 = enemies0.rows.filter(r => r.isSquad);
console.log("1. Auto-squad 4 Minions:", sqRows0.map(r => `${r.name}(×${r.sqMembers.length})`).join(" + "), "| rollN:", m0.rollN, "| rollLabel:", m0.rollLabel);

// Join Orc Warrior + g2 (from Squad 2) into Squad 1 -> 4 members (mixed + non-Minion + >3 warnings) and g4 dissolves to solo!
const applySets = (xs, upd) => xs.map(c => (upd[c.id] ? { ...c, set: upd[c.id] } : c));
const sq2Ids = sqRows0[1].ids;
const listMixed = applySets(list0, IM.squadJoin(list0, ["ow", sq2Ids[0]], sqRows0[0].sqKey));
const mMixed = IM.gmModel(listMixed, call);
const sqMixed = mMixed.sides.find(s => s.key === "hostile").rows.find(r => r.isSquad);
console.log("2. Mixed/over-cap squad:", sqMixed.name, "| warns:", sqMixed.sqWarns.join(", "), "| leftover dissolved to solo:", !IM.resolveSquads(listMixed).ofId.has(sq2Ids[1]));

// Remove a member from a 2-member squad -> both become solo; squadGroupsForRoll respects solo
const listRem = applySets(list0, IM.squadRemove(list0, [sqRows0[0].ids[0]]));
const rollGroupsRem = IM.squadGroupsForRoll(listRem);
console.log("3. Remove Sq1 member dissolves Sq1:", Object.keys(rollGroupsRem).length === 1 && !rollGroupsRem[sqRows0[0].ids[0]] && rollGroupsRem[sq2Ids[0]]?.join(",") === sq2Ids.join(","));

// Ungroup all -> 0 squads, rollN = 6; then Auto-Squad -> back to 2 squads, rollN = 4
const listSolo = applySets(list0, IM.squadUngroupSide(list0, "hostile"));
const listAuto = applySets(listSolo, IM.squadAutoMinions(listSolo, "hostile"));
console.log("4. Ungroup & Auto-Squad:", IM.gmModel(listSolo, call).rollN, "->", IM.gmModel(listAuto, call).rollN);

// Custom squad via checkboxes + Squad Card HTML check
const listCustom = applySets(listSolo, IM.squadCreate(listSolo, ["oc", "ow"]));
const htmlPop = IV.gmHtml(IM.gmModel(listCustom, call, { sel: { g1: true, g2: true }, pop: `solo:g1` }));
console.log("5. Squad HTML pieces:", htmlPop.includes("iw-sqbox") && htmlPop.includes("iw-mpill") && htmlPop.includes("iw-bulkbar") && htmlPop.includes("iw-pop") && htmlPop.includes("Auto-Squad Minions"));

// 2. Conditional Bloodied / Strained on chat damage cards
const baseAtk = {
  kind: "attack", name: "Sworn Blade", outcomes: { 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }], riders: [] } },
  card: { top: [], before: [{ label: "Bloodied", html: "Deal +2 damage." }], after: [{ label: "Strained", html: "Slide target 1." }] }
};
const hHealthy = CC.attackCardHtml({ ...baseAtk, rows: [{ name: "Orc", uuid: "Tok.1", tier: 2, total: 15, dc: 13, d1: [7], d2: [8], preB: false, preS: false }] });
const hPreB = CC.attackCardHtml({ ...baseAtk, rows: [{ name: "Orc", uuid: "Tok.1", tier: 2, total: 15, dc: 13, d1: [7], d2: [8], preB: true, preS: false }] });
const hPostS = CC.attackCardHtml({
  ...baseAtk,
  rows: [{ name: "Orc", uuid: "Tok.1", tier: 2, total: 15, dc: 13, d1: [7], d2: [8], preB: false, preS: false }],
  dmg: { kind: "dmg", groups: [{ tier: 2, comps: [{ pool: "M", total: 6, dice: [{ faces: 8, results: [6], ex: [false] }] }], rows: [0] }], rows: [{ uuid: "Tok.1", name: "Orc", g: 0, pre: { b: false, s: false }, applied: { took: { B: 0, M: 6 }, state: "strained", post: { b: false, s: true }, mods: [] } }] }
});
console.log("6. Conditional S/B lines:",
  "healthyHidesBoth=" + (!hHealthy.includes("Deal +2 damage.") && !hHealthy.includes("Slide target 1.")),
  "| preBloodiedShowsBOnly=" + (hPreB.includes("Deal +2 damage.") && !hPreB.includes("Slide target 1.")),
  "| postStrainedShowsSOnly=" + (!hPostS.includes("Deal +2 damage.") && hPostS.includes("Slide target 1.")));

// 3. Polyhedral SVG dice shapes (d4, d6, d8, d10, d12)
const d4 = CC.polyDieHtml(4, 3), d6 = CC.polyDieHtml(6, 6, { ex: true }), d8 = CC.polyDieHtml(8, 7), d10 = CC.polyDieHtml(10, 9), d12 = CC.polyDieHtml(12, 12, { cls: "cc-die", boom: true });
console.log("7. Polyhedral SVG dice:",
  "d4Tri=" + (d4.includes("d4") && d4.includes('points="14,2 26,24 2,24"')),
  "| d6SqEx=" + (d6.includes("d6 ex") && d6.includes("<rect") && d6.includes(">6!<")),
  "| d8Dia=" + (d8.includes("d8") && d8.includes('points="14,1.5 26.5,14 14,26.5 1.5,14"')),
  "| d10Kite=" + (d10.includes("d10") && d10.includes('points="14,1.5 25,11.5 14,26.5 3,11.5"')),
  "| d12Pent=" + (d12.includes("cc-die d12 boom") && d12.includes('points="14,1.5 26,10.2 21.4,24.5 6.6,24.5 2,10.2"')));
console.log("8. Card breakdowns use SVG dice:", hPostS.includes("cc-die d12") && hPostS.includes("cc-ddie d8"));

// 4. Encounter Log fixes (cleanEffectName, off-turn prefix, Rx dedup, HP Bar header, ccUndo voiding wiring)
console.log("9. cleanEffectName:", EL.cleanEffectName("Taunted (Durgan (Dwarf Paladin, Lay On Hands))"), "| with EoT:", EL.cleanEffectName("Taunted (Durgan (Dwarf Paladin, Lay On Hands)) (EoT)"));
const crs = [
  { id: "t_du", fullName: "Durgan", abbr: "Durgan", side: "pc", maxHp: 35, startHp: 35, currentHp: 35 },
  { id: "t_sy", fullName: "Sylwen", abbr: "Sylwen", side: "pc", maxHp: 29, startHp: 29, currentHp: 29 },
  { id: "t_ow", fullName: "Orc Warrior", abbr: "OW", side: "npc", maxHp: 60, startHp: 60, currentHp: 60 }
];
const log = [
  { id: "e1", r: 1, t: 0, own: { id: "t_ow", name: "Orc Warrior" }, k: "act", who: { id: "t_du", name: "Durgan" }, d: { name: "Judge", ap: 0, multiAp: true, tg: [{ id: "t_ow", name: "Orc Warrior" }] } },
  { id: "e2", r: 1, t: 0, own: { id: "t_ow", name: "Orc Warrior" }, k: "cond", who: { id: "t_ow", name: "Orc Warrior" }, d: { name: "Taunted (Durgan (Dwarf Paladin, Lay On Hands))" } },
  { id: "e3", r: 1, t: 0, own: { id: "t_ow", name: "Orc Warrior" }, k: "act", who: { id: "t_du", name: "Durgan" }, d: { name: "Shield of Faith", ap: 1, react: true, tg: [{ id: "t_sy", name: "Sylwen" }] } },
  { id: "e4", r: 1, t: 0, own: { id: "t_ow", name: "Orc Warrior" }, k: "rx", who: { id: "t_du", name: "Durgan" }, d: { action: "Shield of Faith", outcome: "used" } },
  { id: "e5", r: 1, t: 0, own: { id: "t_ow", name: "Orc Warrior" }, k: "rx", who: { id: "t_du", name: "Durgan" }, d: { action: "Bulwark of Faith", outcome: "passed" } }
];
const md = EL.exportAnalysis(log, crs, { title: "Test" });
const turnLine = md.split("\n").find(l => l.startsWith("- OW:")) || "";
console.log("10. Export turn line:", turnLine);
console.log("11. EncLog HP Bar & ccUndo void:",
  fs.readFileSync(ROOT + "module/enclog.mjs", "utf8").includes("<th>HP Bar</th>") &&
  !fs.readFileSync(ROOT + "module/enclog.mjs", "utf8").includes("<th>Pressure</th>") &&
  fs.readFileSync(ROOT + "module/ccdamage.mjs", "utf8").includes('patchLine(r.applied.logId, { off: true, why: kind === "ccUndo" ? "undone" : "adjusted" })'));

// 5. CSS health (zero undefined vars, overflow visible on .iw-sec, Squad & SVG rules)
const css = fs.readFileSync(ROOT + "styles/theme.css", "utf8");
const defined = new Set([...css.matchAll(/(--s-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const undef = [...new Set([...css.matchAll(/var\((--s-[a-z0-9-]+)\)/g)].map(m => m[1]))].filter(u => !defined.has(u));
console.log("12. CSS health:", `undef=${undef.length}`,
  "| squadCss=" + (css.includes(".iw-sqbox") && css.includes(".iw-pop") && css.includes(".iw-sec { overflow: visible")),
  "| diceCss=" + css.includes(":is(.cc-die, .cc-ddie) :is(polygon, rect)"));
