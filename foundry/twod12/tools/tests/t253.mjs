// Run with: node tools/tests/run.mjs (or node tools/tests/t253.mjs)
// v0.0.388 PACK ONE (Lucas, 2026-11-17: "C"; drawn: foundry/mockups/chatone): one message per Action. The Damage button writes the damage into the
// attack card (or the Save card) it sits on: "Damage N" and the pools beside the stamp, the target's damage row in the footer (one target, one
// Tier), or a "Damage" part under the card; a Save card's later damage is merged in; the GM's "Roll the damage again" in the message's menu.
const ROOTURL = new URL("../../", import.meta.url).href;
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => String(s) } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u", isGM: true }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
const CC = await import(ROOTURL + "module/chatcards.mjs");
const CD = await import(ROOTURL + "module/ccdamage.mjs");

const comps = [{ pool: "B", sub: "Sl", total: 9, formula: "2d6", dice: [{ faces: 6, results: [4, 5] }], src: "Greatsword" }, { pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }, { pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }], src: "Smite" }];
const dmg = rows => ({ kind: "dmg", name: "Smite", nl: false, groups: [{ tier: 2, comps, riders: ["The target is Pushed 1."], rows: rows.map((r, i) => i) }], rows });
const row = { uuid: "t1", name: "Orc Warrior", total: 15, dc: 13, dcLabel: "AD", d1: [4], d2: [9], boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Weapon" }], tier: 2, base: 2, crit: false, doubles: false };
const atk = { kind: "attack", name: "Smite", freq: "round", cost: "2 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Weapon", names: ["Orc Warrior"] }, hasDamage: true, rows: [row] };
const V = CC.viewOf({ gm: true });

console.log("--- one target, one Tier: the damage beside the stamp, Apply in the footer");
const before = CC.attackCardHtml(atk, V);
console.log("before the damage: the Damage button:", before.includes('data-twod12="rollDamage"'), "| no damage part:", !before.includes("cc-dlab"));
const pend = CC.attackCardHtml({ ...atk, dmg: dmg([{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: null }]) }, V);
const main = pend.slice(pend.indexOf('<div class="cc-main">'), pend.indexOf('<hr class="cc-hr">'));
console.log("the Damage button gone:", !pend.includes('data-twod12="rollDamage"'), "| 'Damage 18' and the pools in the stamp's column:", main.includes('<div class="cc-dlab"><span>Damage</span><b>18</b></div>') && main.includes('class="cc-pools" data-cc-toggle="d0"'),
  "| the dice behind it:", main.includes('data-cc-panel="d0"'), "| before the Tier's outcome:", main.indexOf("cc-dlab") < main.indexOf("cc-outcome"));
const foot = pend.slice(pend.indexOf('<hr class="cc-hr">'));
console.log("the footer holds the target's row:", foot.includes('<div class="cc-foot cc-dfoot"><div class="cc-trow"><span class="cc-cname">Orc Warrior</span>'), "| Apply:", foot.includes('data-twod12="ccApply" data-row="0" data-factor="1" data-ctx="apply">Apply</button>'),
  "| the breakdown behind the equals button (v0.0.454; Full / Half / Double a right-click):", foot.includes('data-cc-more="0"') && foot.includes('class="cc-ledger"'), "| Card:", foot.includes('data-twod12="ccCard"'), "| no retarget once rolled:", !foot.includes("retargetAction"),
  "| the rider not repeated:", !pend.includes("The target is Pushed 1."), "| one card, no damage stamp:", !pend.includes("ccOpenSrc"), "| the card marked:", pend.includes('class="cc-card cc-attack withdmg"'));
const done = CC.attackCardHtml({ ...atk, dmg: dmg([{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: { took: { B: 11, M: 7 }, state: "", factor: 1, mods: [] } }]) }, V);
console.log("applied: Took under the name, Undo:", done.includes('<div class="cc-trow done"><span class="cc-nblk"><span class="cc-cname">Orc Warrior</span><span class="cc-took">Took') && done.includes('data-twod12="ccUndo" data-row="0" data-ctx="adjust">✓ Undo</button>'));
const noTgt = CC.attackCardHtml({ ...atk, dmg: dmg([]) }, V);
console.log("no target: the damage's own target button:", noTgt.includes('data-twod12="ccDmgTarget"'));
const player = CC.attackCardHtml({ ...atk, dmg: dmg([{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: null }]) }, CC.viewOf({ gm: false, hideTgt: true }));
console.log("a player with target details hidden: 'Waiting for the GM', no Apply:", player.includes("Waiting for the GM") && !player.includes('data-twod12="ccApply"'));

console.log("--- several targets or Tiers: a Damage part under the card");
const two = { ...row, uuid: "t2", name: "Goblin", total: 10, tier: 1, base: 1 };
const many = CC.attackCardHtml({ ...atk, rows: [row, two], shared: { d: [[4], [9]], mod: 2 }, outcomes: {}, dmg: { kind: "dmg", name: "Smite", nl: false, groups: [{ tier: 2, comps, riders: [], rows: [0] }, { tier: 1, comps: comps.slice(2), riders: [], rows: [1] }], rows: [{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: null }, { uuid: "t2", name: "Goblin", mods: [], choice: "", applied: null }] } }, V);
console.log("a Damage part with both Tiers:", (many.match(/class="cc-tg2"/g) ?? []).length === 2 && !many.includes('class="cc-crows"'), "| a row each, Apply all:", (many.match(/data-twod12="ccApply" data-row="\d" data-factor="1" data-ctx="apply">Apply/g) ?? []).length === 2 && many.includes('data-twod12="ccApplyAll"'), "| no Damage button:", !many.includes('data-twod12="rollDamage"'));
const sv = { kind: "save", name: "Ground Slam", freq: "encounter", cost: "3 AP", tline: { targets: "All creatures in the Area", dist: "1 Emanation", names: ["Aveline"] }, saveName: "Body Save", dc: 14, tiers: {},
  creatures: [{ uuid: "av", name: "Aveline", result: { total: 10, dc: 14, tier: 1, d1: [4], d2: [4], mods: [] }, damageDone: true, hasDamage: true }] };
const saveCard = CC.saveCardHtml({ ...sv, dmg: dmg([{ uuid: "av", name: "Aveline", mods: [], choice: "", applied: null }]) }, V);
console.log("a Save card: its damage as a part, above the footer:", saveCard.includes('<div class="cc-dpart">') && saveCard.indexOf("cc-dpart") < saveCard.indexOf('<hr class="cc-hr">'), "| Apply:", saveCard.includes('data-twod12="ccApply"'));
console.log("the damage message unchanged (still drawn for Bleed, hazards, inline damage):", CC.damageCardHtml(dmg([{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: null }]), V).startsWith('<div class="cc-card cc-dmg"><div class="cc-body"><button type="button" class="cc-stamp dmg t2" data-twod12="ccOpenSrc"'));

console.log("--- a Save card's later damage is merged in");
const a1 = { groups: [{ tier: 2, crit: false, comps, rows: [0] }], rows: [{ name: "Aveline", g: 0 }] };
const a2 = { groups: [{ tier: 2, crit: false, comps, rows: [0] }, { tier: 1, crit: false, comps, rows: [1] }], rows: [{ name: "Durgan", g: 0 }, { name: "Sylwen", g: 1 }] };
const mg = CD.mergeDamage(a1, a2);
console.log("rows:", mg.rows.map(r => `${r.name}:g${r.g}`).join(" "), "| groups:", JSON.stringify(mg.groups.map(g => [g.tier, g.rows])), "| nothing before: the new one:", CD.mergeDamage(null, a2) === a2);

console.log("--- written into the message");
const updates = [];
const msg = { id: "m1", content: CC.cardContent(atk), rolls: [], flags: { twod12: { cc: atk, action: { tier: 2 } } }, getFlag(s, k) { return this.flags[s]?.[k]; }, async update(u) { updates.push(u); } };
await CD.postCcDamage({ title: "Smite", groups: [{ tier: 2, crit: false, comps, fx: [], riders: [] }], targets: [{ uuid: "t1", name: "Orc Warrior", tier: 2, g: 0 }], srcId: "m1", into: msg, rolls: [] });
const u = updates[0] ?? {};
console.log("one update, no new message:", updates.length === 1, "| the state on the card:", u["flags.twod12.ccDmg"]?.srcId === "m1" && u["flags.twod12.ccDmg"].rows.length === 1, "| the card's model keeps it:", u["flags.twod12.cc"]?.dmg?.kind === "dmg" && u["flags.twod12.cc"].name === "Smite",
  "| the content redrawn:", String(u.content).includes("cc-dlab"), "| the old flag for modules:", Array.isArray(u["flags.twod12.damage"]));
console.log("--- the wiring");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), tw = src("module/twod12.mjs"), cd = src("module/ccdamage.mjs"), css = src("styles/system.css");
console.log("rollDamage writes into its card:", (act.match(/srcId: message\.id, into: message, replace: again/g) ?? []).length === 2, "| the Save card too:", inl.includes("srcId: msg.id, into: msg,"), "| Apply and Undo save into the card:", cd.includes("if (holdsDamage(msg)) {"),
  "| the GM's menu item:", tw.includes('name: "Roll the damage again"') && tw.includes('Hooks.on("getChatMessageContextOptions"'), "| the styles:", css.includes(".twod12.chat.cc .cc-foot.cc-dfoot > .cc-trow {"));
console.log("--- v0.0.389 (Lucas: \"without a target looks weird\"; \"my foundry interface is dark but the system is light\")");
const nt = CC.attackCardHtml({ ...atk, dmg: dmg([]) }, V), ntFoot = nt.slice(nt.indexOf('<hr class="cc-hr">'));
console.log("no target: '→ No target' and the crosshair in the footer:", ntFoot.includes('<div class="cc-foot cc-dfoot"><button type="button" class="cc-icon" data-twod12="ccDmgTarget"') && ntFoot.includes('<span class="cc-muted">No target</span>'),
  "| no Lethal tag or wide button under it:", !nt.includes('class="cc-nl') && !nt.includes("Target the selected tokens</button>"));
const withOut = CC.attackCardHtml({ ...atk, outcomes: { 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }], riders: ["The target sheds Bright light."] } }, dmg: dmg([{ uuid: "t1", name: "Orc Warrior", mods: [], choice: "", applied: null }]) }, V);
console.log("the Tier's dice line not repeated under the rolled damage:", !withOut.includes("cc-dmgline") && withOut.includes("The target sheds Bright light."), "| before the damage it is there:", CC.attackCardHtml({ ...atk, outcomes: { 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }], riders: [] } } }, V).includes("cc-dmgline"),
  "| the stamp keeps its height with no target (v0.0.418: with one it stretches):", src("styles/system.css").includes(".twod12.chat.cc .cc-attack.withdmg.notgt .cc-body { align-items: start; }"));
const TH = await import(ROOTURL + "module/theme.mjs");
const cls = (...c) => ({ set: new Set(c), contains(x) { return this.set.has(x); }, add(...a) { a.forEach(x => this.set.add(x)); }, toggle(x, on) { if (on) this.set.add(x); else this.set.delete(x); } });
console.log("the Interface's theme: body dark", TH.interfaceTheme({ classList: cls("theme-dark") }), "| body light", TH.interfaceTheme({ classList: cls("theme-light") }), "| none: the browser's", TH.interfaceTheme({ classList: cls() }, () => true), TH.interfaceTheme({ classList: cls() }, () => false));
const card = { classList: cls("twod12", "chat", "cc"), matches: s => s === ".twod12.chat", closest: s => (s === ".chat-message" ? {} : null) };
TH.themeChatCards(card, "dark");
const pop = { classList: cls("twod12", "chat", "cc"), matches: s => s === ".twod12.chat", closest: s => ({}) };
TH.themeChatCards(pop, "dark");
console.log("a chat card takes it:", [...card.classList.set].sort().join(" "), "| a popped-out one stays as Foundry draws it:", [...pop.classList.set].sort().join(" "), "| hooked:", src("module/theme.mjs").includes('Hooks.on("renderChatMessageHTML", (_msg, html) => themeChatCards('));
