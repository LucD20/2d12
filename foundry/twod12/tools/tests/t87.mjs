// Run with: node tools/tests/run.mjs (or node tools/tests/t87.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Engaged and Ranged Combat, Prone (no Evade; only Crawl and Stand), Crawl, and Evade rounded down.
let script = [];
class FakeRoll {
  constructor(formula) { this.formula = String(formula); }
  async evaluate() {
    const m = /^(\d+)d(\d+)(?:-(\d+))?/.exec(this.formula);
    if (!m) { this.dice = []; this.terms = []; this.total = Number(this.formula.replace(/[^0-9.+-]/g, "")) || 0; return this; }
    const n = Number(m[1]);
    const results = Array.from({ length: n }, () => ({ result: script.shift() ?? 3 }));
    this.dice = [{ results }]; this.terms = []; this.total = results.reduce((a, r) => a + r.result, 0) - (m[3] ? Number(m[3]) : 0);
    return this;
  }
}
const chat = [], notes = [];
globalThis.Roll = FakeRoll; globalThis.Combat = class {};
globalThis.CONFIG = { time: {}, Canvas: { polygonBackends: { sight: { testCollision: (a, b) => { if ((a.x - 300) * (b.x - 300) >= 0) return false; const y = a.y + ((300 - a.x) / (b.x - a.x)) * (b.y - a.y); return y >= 0 && y <= 60; } } } }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ChatMessage = { create: async m => { chat.push(m); return { getFlag: (s, k) => m.flags?.[s]?.[k], setFlag: async () => {} }; }, getSpeaker: () => ({}) };
globalThis.ui = { notifications: { info: m => notes.push("info: " + m), warn: m => notes.push("warn: " + m), error: m => notes.push("error: " + m) } };
let dialogContent = "";
const DialogV2 = { confirm: async () => true, prompt: async o => { if (!/name="fx"|name="ap"|name="dc"/.test(o.content ?? "")) return {}; return DialogV2.wait(o); }, wait: async o => { dialogContent = o.content; const fx = [...o.content.matchAll(/name="fx" value="([^"]+)"([^>]*)>/g)].filter(m => /checked/.test(m[2])).map(m => m[1]); return { ap: (/name="ap" value="(\d+)"/.exec(o.content) ?? [0, "2"])[1], dc: String(dcInDialog(o.content)), mod: "0", boons: "0", banes: "0", fx, ...Object.fromEntries(["empowered", "enfeebled"].map(n => [n, (new RegExp(`name="${n}" value="(\\d+)"`).exec(o.content) ?? [0, "0"])[1]])), ...dialogExtra }; } };
let dialogExtra = {};
const dcInDialog = html => (/name="dc"[^>]*value="(\d+)"/.exec(html) ?? /value="(\d+)"[^>]*name="dc"/.exec(html))?.[1] ?? 13;
globalThis.__twod12Pick = () => true;   // v0.0.415: the pick windows answer as DialogV2.confirm did
globalThis.foundry = { applications: { api: { DialogV2, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } }, dice: { terms: { OperatorTerm: class {} } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), hasProperty: () => false } };
globalThis.Roll.fromTerms = () => ({});
// tokens and creatures
const sceneTokens = [];
const mkActor = (name, attrs = {}) => ({ name, uuid: `Actor.${name}`, type: "character", isOwner: true, system: { attributes: { body: 0, mind: 0, appeal: 0, instinct: 0, ...attrs } }, effects: [], statuses: new Set(), flags: {}, getFlag() {}, items: [], itemTypes: {}, getActiveTokens() { return []; } });
const mkToken = (name, col, disp, actor) => { const t = { id: "t" + name, name, actor, uuid: `Scene.s.Token.${name}`, document: { id: "t" + name, uuid: `Scene.s.Token.${name}`, x: col * 100, y: 0, width: 1, height: 1, disposition: disp, hidden: false, elevation: 0 }, center: { x: col * 100 + 50, y: 50 }, visible: true, setTarget() {} }; actor.getActiveTokens = () => [t]; sceneTokens.push(t); return t; };
const kai = mkActor("Kai", { body: 2 });
const kaiTok = mkToken("Kai", 0, 1, kai); kai.token = { object: kaiTok };
const nari = mkActor("Nari"), lonny = mkActor("Lonny"), goblin = mkActor("Goblin");
const nariTok = mkToken("Nari", 2, -1, nari), lonnyTok = mkToken("Lonny", 5, -1, lonny), goblinTok = mkToken("Goblin", 0, -1, goblin);
goblinTok.document.y = 100; goblinTok.center = { x: 50, y: 150 };   // next to Kai, in the open
// a wall between Kai and Lonny that blocks two of his four corners: Medium cover
lonny.system.attributes.body = 1;
globalThis.canvas = { grid: { size: 100, isSquare: true, getOffset: ({ x, y }) => ({ i: Math.floor(y / 100), j: Math.floor(x / 100) }), getTopLeftPoint: ({ i, j }) => ({ x: j * 100, y: i * 100 }), getCenterPoint: ({ i, j }) => ({ x: j * 100 + 50, y: i * 100 + 50 }) }, tokens: { placeables: sceneTokens, controlled: [] }, scene: {}, ready: true };
globalThis.game = { settings: { get: () => true }, time: { worldTime: 0 }, user: { isGM: true, isActiveGM: true, id: "u1", targets: new Set(), character: kai }, combat: null, items: [], packs: new Map(), socket: { emit() {}, on() {} }, actors: [kai, nari, lonny, goblin] };
const allActors = [kai, nari, lonny, goblin];
const byUuid = u => allActors.find(a => a.uuid === u) ?? null;
globalThis.fromUuid = async u => byUuid(u); globalThis.fromUuidSync = u => byUuid(u);
// Kai's Greatsword and Whirlwind
const sword = { id: "gs", name: "Greatsword", type: "weapon", img: "", getFlag() {}, system: { traits: new Set(["melee", "twohanded"]), wielded: true, hands: 2, subtype: "Sl", damage: { t2: "1d8", t3: "2d8" }, range: "" } };
kai.itemTypes = { weapon: [sword], talent: [], action: [] };
kai.system = { ...kai.system, weaponAttribute: "body", weaponMod: 2, magicAttribute: "", magicMod: 0, ap: 5, exhausted: 0, size: 3 };
const inst = (o = {}) => ({ pool: "B", useW: true, wCount: 1, dice: "", useAt: false, subtype: "", ...o });
const whirl = { id: "wh", name: "Whirlwind", type: "action", img: "", getFlag() {}, system: {
  traits: new Set(["area", "melee", "self", "strike", "weapon"]), area: "1 Emanation", areaCfg: { size: 1, shape: "emanation", within: 0, targets: "all", center: false, keep: false, rounds: 0 }, targets: "All creatures in the Area", frequency: "encounter",
  requirements: "", vs: "", category: "Talent", level: 1, reaction: false, trigger: "", flavor: "", description: "", setup: "", prerequisites: "", modifiers: [],
  versions: [{ ap: 2, noTiers: false, t1: [inst({ useW: false, useAt: true })], t2: [inst({ dice: "", wCount: 1 })], t3: [inst({ dice: "1d6" })], x1: "", x2: "", x3: "", effects: "", critical: "", fx: { all: [], t1: [], t2: [], t3: [] } }] } };
kai.items = { get: id => ({ wh: whirl, gs: sword })[id], find: f => [whirl, sword].find(f), filter: f => [whirl, sword].filter(f), [Symbol.iterator]: function* () { yield whirl; yield sword; } };
// the area: placing it targets everyone around
const gfx = () => new Proxy({}, { get: (t, k) => (k === "destroy" ? () => {} : () => gfx()) });
globalThis.PIXI = { Graphics: class { constructor() { return gfx(); } } };
canvas.interface = { addChild() {}, sortableChildren: false };
for (const t of sceneTokens) t.setTarget = on => { on ? game.user.targets.add(t) : game.user.targets.delete(t); };
whirl.system.areaCfg.size = 5; whirl.system.area = "5 Emanation";
const A = await import(ROOTURL + "module/actions.mjs");

const E = await import(ROOTURL + "module/engaged.mjs");
const strip = h => String(h).replace(/data-tooltip="[^"]*"/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
// ------------------------------------------------------------------------------------------------ the world: who stands where
// Kai (friendly) at (0,0); Goblin (hostile) diagonally next to Kai (on the other side from the targets, so it gives no cover); Nari (hostile) 4 squares down with an Ally (friendly) next to her; Lonny (hostile) alone further down.
const place = (tok, row, col) => { tok.document.x = col * 100; tok.document.y = row * 100; tok.center = { x: col * 100 + 50, y: row * 100 + 50 }; };
sceneTokens.length = 0;
const ally = mkActor("Ally"); allActors.push(ally); const allyTok = mkToken("Ally", 3, 1, ally);
sceneTokens.push(kaiTok, goblinTok, nariTok, lonnyTok);   // (the Ally was registered when it was made)
place(kaiTok, 0, 0); place(goblinTok, 1, -1); place(nariTok, 4, 2); place(allyTok, 4, 3); place(lonnyTok, 6, 0);
for (const t of sceneTokens) t.setTarget = on => { on ? game.user.targets.add(t) : game.user.targets.delete(t); };
console.log("--- who is Engaged");
const who = () => sceneTokens.map(t => `${t.name}${E.isEngaged(t) ? " ENGAGED with " + E.engagedWith(t).map(x => x.name).join("+") : ""}`).join(" | ");
console.log("start:", who());
goblin.statuses = new Set(["unsensed"]); console.log("the Goblin is Unsensed (still Engaged: what you perceive does not matter): ", who());
goblin.statuses = new Set(); kai.statuses = new Set(["unconscious"]); console.log("Kai is Unconscious (every creature is Unsensed to him): ", who());
{ const { perceive } = await import(ROOTURL + "module/senses.mjs"); console.log("an Unconscious creature perceives:", perceive(kaiTok, goblinTok).level, "|", perceive(kaiTok, nariTok).level, "| the others perceive Kai:", perceive(goblinTok, kaiTok).level, "(Favored for them: Unsensed to Kai)"); }
kai.statuses = new Set();
goblin.statuses = new Set(["unconscious"]); console.log("the Goblin is Unconscious:", who());
goblin.statuses = new Set(); ally.statuses = new Set(["dead"]); console.log("the Ally is dead:", who());
ally.statuses = new Set(); allyTok.document.disposition = 0; console.log("the Ally is neutral:", who());
allyTok.document.disposition = 1; allyTok.document.hidden = true; console.log("a hidden token doesn't count:", who());
allyTok.document.hidden = false; place(allyTok, 4, 4); console.log("the Ally is 2 squares from Nari:", who());
place(allyTok, 3, 1); console.log("the Ally diagonal to Nari (row 3, col 1; Nari row 4, col 2):", who());
place(allyTok, 4, 3); nari.statuses = new Set(["unconscious"]); console.log("Nari is Unconscious (the Ally next to her is not Engaged either):", who());
nari.statuses = new Set(); place(nariTok, 4, 2);
const ogre = mkActor("Ogre"); allActors.push(ogre); const ogreTok = mkToken("Ogre", 0, -1, ogre); ogreTok.document.width = 2; ogreTok.document.height = 2; place(ogreTok, 2, 0); ogreTok.setTarget = () => {};
console.log("a 2x2 Ogre at rows 2-3, cols 0-1 touches Kai? (Kai at row 0: one square gap)", E.isEngaged(kaiTok) && E.engagedWith(kaiTok).some(t => t.name === "Ogre"));
place(ogreTok, 1, 0); console.log("the Ogre moved to rows 1-2, next to Kai:", E.engagedWith(kaiTok).map(t => t.name).join(", "));
sceneTokens.pop(); console.log("friendly and friendly never engage:", E.areEnemies(kaiTok, allyTok), "| hostile and hostile:", E.areEnemies(goblinTok, nariTok), "| friendly and hostile:", E.areEnemies(kaiTok, nariTok), "| neutral:", E.areEnemies({ document: { disposition: 0 } }, kaiTok));
// ------------------------------------------------------------------------------------------------ Ranged Combat: banes in a roll
const bow = { id: "bow", name: "Bow", type: "weapon", img: "", getFlag() {}, system: { traits: new Set(["ranged", "twohanded"]), wielded: true, hands: 2, subtype: "Pi", damage: { t2: "1d6", t3: "1d8" }, range: "10 / 20 / 40", unloaded: false } };
kai.itemTypes = { weapon: [sword, bow], talent: [], action: [] };
const mkAct = (id, name, traits, extra = {}, v = {}) => ({ id, name, type: "action", img: "", getFlag() {}, system: { traits: new Set(traits), area: "", areaCfg: { size: 0 }, targets: "One creature", distance: "", frequency: "atwill", requirements: "", vs: "", category: "", level: 0, reaction: false, trigger: "", flavor: "", description: "", setup: "", prerequisites: "", modifiers: [],
  versions: [{ ap: 1, noTiers: false, t1: [], t2: [inst()], t3: [inst({ dice: "1d6" })], x1: "", x2: "", x3: "", effects: "", critical: "", fx: { all: [], t1: [], t2: [], t3: [] }, ...v }], ...extra } });
const shoot = mkAct("sh", "Shoot", ["strike", "weapon", "ranged"]), stab = mkAct("st", "Strike", ["strike", "weapon", "melee"]);
const allItems = [whirl, sword, bow, shoot, stab];
kai.items = { get: id => allItems.find(i => i.id === id), find: f => allItems.find(f), filter: f => allItems.filter(f), [Symbol.iterator]: function* () { yield* allItems; } };
const act = async (label, item, targets, dice, extra = {}) => {
  chat.length = 0; notes.length = 0; script = [...dice]; dialogExtra = extra; dialogContent = ""; game.user.targets.clear(); targets.forEach(t => game.user.targets.add(t));
  const e = await A.useAction(kai, item).catch(err => ({ error: err }));
  if (e?.error) { console.log(label, "FAILED:", e.error.stack.split("\n").slice(0, 3).join(" | ")); return null; }
  const chips = [...dialogContent.matchAll(/name="fx" value="([^"]+)" data-b="(\d)" data-n="(\d)"([^>]*)>/g)].map(m => `${m[1]}${/checked/.test(m[4]) ? "*" : ""}(${m[2]}b/${m[3]}n)`).join(" ");
  const c = chat.find(m => m.content.includes(item.name));
  const rows = c ? [...c.content.matchAll(/<div class="cc-crow">[\s\S]*?class="cc-cname">([^<]+)<\/span>[\s\S]*?<b class="cc-total">(\d+)</g)].map(m => `${m[1]} ${m[2]}`) : [];
  const single = c ? /class="shield (win|lose)"/.exec(c.content) : null;
  const total = c ? (c.content.match(/<b class="cc-total">(\d+)<\/b>/) ?? [])[1] : null;
  const banes = c ? [...(c.content.match(/<div class="cc-break[\s\S]*?<\/div>/)?.[0] ?? "").matchAll(/class="cc-d3 bane"[^>]*><b>(\d)</g)].map(m => Number(m[1]) - 1).join(",") : "";
  console.log(`${label.padEnd(48)} ${c ? "card" : "no card"} | chips: ${chips || "(none)"} | bane dice ${banes || "-"} | ${rows.length ? "rows " + rows.join("; ") : "total " + total}${notes.length ? " | " + notes.join("; ") : ""}`);
  return c;
};
console.log("\n--- Ranged Combat");
// Kai is Engaged (the Goblin next to him) and Nari is Engaged (the Ally next to her): 2 banes + 1 bane
await act("Shoot Nari: Kai and Nari both Engaged", shoot, [nariTok], [6, 7, 1, 2, 3]);
goblin.statuses = new Set(["unconscious"]);
ally.statuses = new Set(["unsensed"]); goblin.statuses = new Set();
await act("Shoot Nari: her Ally is Unsensed (to everyone)", shoot, [nariTok], [6, 7, 1, 2, 3]);
goblin.statuses = new Set(["unsensed"]); ally.statuses = new Set();
await act("Shoot Nari: the Goblin next to us is Unsensed", shoot, [nariTok], [6, 7, 1, 2, 3]);
goblin.statuses = new Set(["unconscious"]);
await act("Shoot Nari: the Goblin is Unconscious", shoot, [nariTok], [6, 7, 2]);
ally.statuses = new Set(["dead"]);
await act("Shoot Nari: nobody is Engaged", shoot, [nariTok], [6, 7]);
goblin.statuses = new Set(); ally.statuses = new Set();
await act("Strike (melee) while Engaged: no banes", stab, [goblinTok], [6, 7]);
await act("Shoot the Goblin: Engaged only with you", shoot, [goblinTok], [6, 7, 1, 2]);
place(allyTok, 2, -2);
await act("Shoot the Goblin: an Ally is next to it too", shoot, [goblinTok], [6, 7, 1, 2, 3]);
place(allyTok, 4, 3);
await act("Shoot Lonny (alone) while Kai is Engaged", shoot, [lonnyTok], [6, 7, 1, 2]);
console.log("\n--- Ranged Combat against several creatures");
await act("Shoot Nari (Engaged) and Lonny (not)", shoot, [nariTok, lonnyTok], [6, 7, 1, 2, 3]);
// ------------------------------------------------------------------------------------------------ Flanking: boons in a roll
console.log("\n--- Flanking: a Melee Action gains a boon for each other ally that flanks its target");
const spear = { system: { traits: new Set(["melee"]), wielded: true, reach: 0 }, getFlag() {} };
ally.itemTypes = { weapon: [spear], action: [], talent: [], feature: [] };
allyTok.document.disposition = 1; allyTok.document.hidden = false; ally.statuses = new Set();
place(goblinTok, 1, -1); place(allyTok, 2, -1);   // the Goblin is next to Kai (diagonally) and next to the Ally
await act("Strike the Goblin: the Ally and Kai both threaten it", stab, [goblinTok], [6, 7]);
ally.statuses = new Set(["unconscious"]);
await act("... the Ally is Unconscious: nobody flanks", stab, [goblinTok], [6, 7]);
ally.statuses = new Set(); ally.itemTypes.weapon = [{ system: { traits: new Set(["ranged"]), wielded: true, reach: 0 }, getFlag() {} }];
await act("... the Ally holds a bow: it does not threaten", stab, [goblinTok], [6, 7]);
ally.itemTypes.weapon = [spear];
await act("Shoot the Goblin: a Ranged Action gets no Flanking", shoot, [goblinTok], [6, 7, 1, 2]);
place(allyTok, 4, 3);
await act("Strike the Goblin: the Ally is far away", stab, [goblinTok], [6, 7]);
place(allyTok, 2, -1);
await act("Strike the Goblin and Nari (several targets): the chip is the Goblin's", stab, [goblinTok, nariTok], [6, 7]);
place(allyTok, 3, 1); ally.itemTypes = { weapon: [], action: [], talent: [], feature: [] };
// ------------------------------------------------------------------------------------------------ Empowered N and Enfeebled N in a roll
for (const w of [sword, bow]) w.update ??= async () => {};   // a Reload shot marks the weapon as unloaded
console.log("\n--- Empowered and Enfeebled: the two chips in the dialog (the player can change them) and the step the damage will use");
const fxOf = (name, o) => ({ name, statuses: new Set(), getFlag: (sc, k) => (k === "modifiers" ? [{ against: false, boons: 0, banes: 0, empowered: 0, enfeebled: 0, all: [], any: [], none: [], from: [], ...o }] : undefined) });
const condFx = (name, id, value) => ({ name, statuses: new Set([id]), getFlag: (sc, k) => (k === "value" ? value : undefined) });   // a condition on the token: Empowered 2
const stepRow = async (label, effects, extra = {}, opts = null) => {
  kai.effects = effects; chat.length = 0; notes.length = 0; script = [6, 7]; dialogExtra = extra; dialogContent = ""; game.user.targets.clear(); game.user.targets.add(goblinTok);
  await A.useAction(kai, stab, opts ?? {}).catch(err => console.log("FAILED", err.stack.split("\n").slice(0, 3).join(" | ")));
  const chip = n => { const m = new RegExp(`class="bbchip (boon|bane) ?(on)?" data-bb="${n}"[^>]*>.*?<b>(\\d+)</b>`).exec(dialogContent); return m ? m[3] : "-"; };
  const msg = chat.find(m => m.content.includes("Strike")), step = msg?.flags?.twod12?.action?.empowered;
  console.log(label.padEnd(60), `chips: Empowered ${chip("empowered")}, Enfeebled ${chip("enfeebled")} | the damage uses step ${step}`);
};
await stepRow("no effects, the chips left alone", [], {});
await stepRow("no effects, the player raises Empowered to 1", [], { empowered: "1" });
await stepRow("no effects, the player raises Enfeebled to 2", [], { enfeebled: "2" });
await stepRow("Bloodlust (Empowered 1)", [fxOf("Bloodlust", { empowered: 1, all: ["melee", "weapon"] })]);
await stepRow("Bloodlust and Rage (Empowered 2): the highest, no stacking", [fxOf("Bloodlust", { empowered: 1 }), fxOf("Rage", { empowered: 2 })]);
await stepRow("Bloodlust and another Empowered 1: still 1", [fxOf("Bloodlust", { empowered: 1 }), fxOf("War Cry", { empowered: 1 })]);
await stepRow("Empowered 1 and Enfeebled 1 cancel", [fxOf("Bloodlust", { empowered: 1 }), fxOf("Dread", { enfeebled: 1 })]);
await stepRow("Empowered 3 and Enfeebled 1: net 2", [fxOf("Rage", { empowered: 3 }), fxOf("Dread", { enfeebled: 1 })]);
await stepRow("Enfeebled 2 alone", [fxOf("Dread", { enfeebled: 2 })]);
await stepRow("two Enfeebled 1 from different effects: 1, not 2", [fxOf("Dread", { enfeebled: 1 }), fxOf("Dismay", { enfeebled: 1 })]);
await stepRow("Enfeebled 2, the player lowers it to 0", [fxOf("Dread", { enfeebled: 2 })], { enfeebled: "0" });
await stepRow("Enfeebled 2, the player raises it to 3", [fxOf("Dread", { enfeebled: 2 })], { enfeebled: "3" });
await stepRow("Bloodlust, the player lowers Empowered to 0", [fxOf("Bloodlust", { empowered: 1 })], { empowered: "0" });
await stepRow("an effect that only matches [Ranged] Actions", [fxOf("Eagle Eye", { empowered: 2, all: ["ranged"] })]);
await stepRow("a Reload shot by itself (Empowered 2)", [], { reloadshot: "on" });
await stepRow("a Reload shot with Bloodlust: the highest, 2", [fxOf("Bloodlust", { empowered: 1 })], { reloadshot: "on" });
await stepRow("a Reload shot with Enfeebled 1: 2 - 1", [fxOf("Dread", { enfeebled: 1 })], { reloadshot: "on" });
await stepRow("a Reload shot, the player lowers Enfeebled to 0", [fxOf("Dread", { enfeebled: 1 })], { reloadshot: "on", enfeebled: "0" });
await stepRow("granted by an Action (@Use ...|empowered:1)", [], {}, { empowered: 1, label: "Battering Charge" });
await stepRow("granted Empowered 1 and Enfeebled 2", [fxOf("Dread", { enfeebled: 2 })], {}, { empowered: 1, label: "Battering Charge" });
await stepRow("an older effect that stored true", [fxOf("Old Bloodlust", { empowered: true })]);
console.log("--- the conditions Empowered N and Enfeebled N on the token");
await stepRow("the condition Empowered 2", [condFx("Empowered", "empowered", 2)]);
await stepRow("the condition Enfeebled 3", [condFx("Enfeebled", "enfeebled", 3)]);
await stepRow("Empowered 2 (condition) and Enfeebled 1 (an effect)", [condFx("Empowered", "empowered", 2), fxOf("Dread", { enfeebled: 1 })]);
await stepRow("Empowered 1 (condition) and Rage (Empowered 2): the highest", [condFx("Empowered", "empowered", 1), fxOf("Rage", { empowered: 2 })]);
await stepRow("a condition without a value counts as 1", [condFx("Empowered", "empowered", undefined)]);
kai.effects = [];
// ------------------------------------------------------------------------------------------------ dark fights
console.log("\n--- Fighting in the dark: you gain nothing from a creature's poor perception of you if you perceive it as Hidden");
const stateRow = async (label, kaiStatuses, goblinStatuses) => {
  kai.statuses = new Set(kaiStatuses); goblin.statuses = new Set(goblinStatuses); kai.effects = [];
  chat.length = 0; notes.length = 0; script = [6, 7]; dialogExtra = {}; dialogContent = ""; game.user.targets.clear(); game.user.targets.add(goblinTok);
  await A.useAction(kai, stab, {}).catch(err => console.log("FAILED", err.stack.split("\n").slice(0, 3).join(" | ")));
  const on = n => new RegExp(`name="${n}" checked`).test(dialogContent) ? "on" : "off";
  const chips = [...dialogContent.matchAll(/name="fx" value="(syn:[^"]+)" data-b="(\d)" data-n="(\d)"/g)].map(m => `${m[1].replace("syn:", "")}(${m[2]}b/${m[3]}n)`).join(" ");
  console.log(label.padEnd(60), `Doomed ${on("doomed")}, Favored ${on("favored")} | ${chips || "no chips"}`);
};
await stateRow("Kai and the Goblin both see each other", [], []);
await stateRow("only the Goblin is Hidden to Kai (he hears it)", [], ["hidden"]);
await stateRow("only Kai is Hidden to the Goblin", ["hidden"], []);
await stateRow("each is Hidden to the other (both in the dark)", ["hidden"], ["hidden"]);
await stateRow("Kai Hidden to the Goblin, the Goblin Obscured to Kai", ["hidden"], ["obscured"]);
await stateRow("Kai Obscured to the Goblin, the Goblin Hidden to Kai", ["obscured"], ["hidden"]);
await stateRow("each is Obscured to the other (dim light)", ["obscured"], ["obscured"]);
kai.statuses = new Set(); goblin.statuses = new Set();
// ------------------------------------------------------------------------------------------------ target tiles for large groups
console.log("\n--- the target tiles of the roll dialog: numbered tabs from 10 creatures");
const mkTiles = n => Array.from({ length: n }, (_, k) => ({ uuid: `Actor.t${k}`, name: k % 2 ? `Skeleton ${k + 1}` : "Goblin", img: "i.png", dc: 13 + (k % 3) }));
for (const n of [1, 2, 9, 10, 12, 20]) {
  dialogContent = ""; await A.askRoll(kai, { title: "Whirl", attrKey: "body", targetActors: [], targetTiles: mkTiles(n), extraMods: [] });
  const compact = /class="ttiles compact"/.test(dialogContent), tabs = [...dialogContent.matchAll(/<b class="tabnum">(\d+)<\/b>/g)].map(m => m[1]), imgs = (dialogContent.match(/<img src="i\.png"/g) ?? []).length, tiles = (dialogContent.match(/class="ttile/g) ?? []).length;
  console.log(`${n} target${n === 1 ? "" : "s"}:`.padEnd(14), n < 2 ? "no tiles" : `${compact ? "compact" : "with pictures"} | tiles ${tiles} (one is yours) | numbered tabs ${tabs.length ? tabs[0] + ".." + tabs.at(-1) + " (" + tabs.length + ")" : "none"} | pictures ${imgs}`);
}
dialogContent = ""; await A.askRoll(kai, { title: "Whirl", attrKey: "body", targetActors: [], targetTiles: mkTiles(10), extraMods: [] });
console.log("a compact tab keeps the creature's name and DC for the caption:", /data-name="Skeleton 10" data-dc="13"|data-name="Goblin"/.test(dialogContent), "| its name for screen readers, no hover (v0.0.420):", /aria-label="Skeleton 2: DC 14\. Right-click to remove it from the targets"/.test(dialogContent) && !/data-tooltip="Skeleton 2/.test(dialogContent));
// ------------------------------------------------------------------------------------------------ Prone
console.log("\n--- Prone");
const { BASIC_ACTIONS, basicItemData } = await import(ROOTURL + "module/basic.mjs");
const mkBasic = key => { const d = basicItemData(key); return { id: "b_" + key, name: d.name, type: "action", img: "", getFlag: (s, k) => (s === "twod12" && k === "basic" ? key : undefined), system: { ...d.system, traits: new Set(d.system.traits), areaCfg: { size: 0 }, area: "", modifiers: d.system.modifiers ?? [] } }; };
const basics = ["advance", "safeMovement", "charge", "crawl", "stand", "basicWeaponAttack"].map(mkBasic);
kai.items = { get: id => [...allItems, ...basics].find(i => i.id === id), find: f => [...allItems, ...basics].find(f), filter: f => [...allItems, ...basics].filter(f), [Symbol.iterator]: function* () { yield* allItems; yield* basics; } };
kai.statuses = new Set(["prone"]); kai.system.moveSpeed = 5; kai.system.speed = 5;
for (const b of basics) { const c = await act(`Prone uses ${b.name}`, b, [], b.name === "Basic Attack" ? [6, 7] : []); if (b.name !== "Basic Attack" && !c && !notes.length) console.log("   (nothing posted and no warning)"); }
kai.statuses = new Set();
for (const b of ["advance", "safeMovement", "charge"]) { const it = basics.find(x => x.getFlag("twod12", "basic") === b); chat.length = 0; notes.length = 0; await A.useAction(kai, it).catch(() => {}); console.log(`not Prone, ${it.name}: no Prone warning:`, !notes.some(n => /Prone/.test(n))); }
// ------------------------------------------------------------------------------------------------ Crawl
console.log("\n--- Crawl");
const crawl = basics.find(b => b.name === "Crawl");
console.log("the card:", crawl.system.versions.map(v => `${v.ap} AP: ${v.effects}`).join(" || "), "| traits:", [...crawl.system.traits].join("/"));
kai.system.moveSpeed = 3; kai.system.speed = 3; chat.length = 0; notes.length = 0; script = [];
dialogExtra = { ap: "2" };
await A.useAction(kai, crawl).catch(() => {}); console.log("Speed 3, 2 AP version:", notes.join(" | ") || "(allowed)", "| card posted:", chat.some(m => m.content.includes("Crawl")));
kai.system.moveSpeed = 5; kai.system.speed = 5; chat.length = 0; notes.length = 0;
await A.useAction(kai, crawl).catch(() => {}); console.log("Speed 5, 2 AP version:", notes.join(" | ") || "(allowed)", "| card posted:", chat.some(m => m.content.includes("Crawl")));
dialogExtra = {};
// ------------------------------------------------------------------------------------------------ Evade rounded down
console.log("\n--- Evade");
const { evalExpr } = await import(ROOTURL + "module/refs.mjs"); const { moveDistance } = await import(ROOTURL + "module/move.mjs");
const sp = n => ({ system: { moveSpeed: n, speed: n, walk: n }, items: [], effects: [] });
const ev = (expr, n = 5) => evalExpr(expr, sp(n));
console.log("floor(speed/2): Speed 5 →", ev("floor(speed/2)"), "| 6 →", ev("floor(speed/2)", 6), "| 1 →", ev("floor(speed/2)", 1), "| 7 →", ev("floor(Speed/2)", 7), "(capitals and spaces are fine: ", ev("floor( Speed / 2 )", 7), ")");
console.log("speed/2 still rounds up: Speed 5 →", ev("speed/2"), "| other functions: ceil", ev("ceil(speed/2)"), "round", ev("round(speed/2)"), "min", ev("min(speed, 3)"), "max", ev("max(speed, 8)"), "abs", ev("abs(speed-9)"), "| nested", ev("floor(min(speed, 8)/2)"));
console.log("Charge's expression:", moveDistance({ distanceExpr: "speed+2" }, sp(5)), "| the Evade button:", moveDistance({ distanceExpr: "floor(speed/2)" }, sp(5)));
console.log("things it must refuse:", [ev("process"), ev("floor(speedy/2)"), ev("constructor"), ev("floor(speed/2"), ev("speed;1"), ev("alert(1)"), ev("floor.call")].map(v => String(v)).join(" "));
console.log("Evade in the Basic Actions:", BASIC_ACTIONS.safeMovement.versions.map(v => v.effects).join(" || "), "| traits:", BASIC_ACTIONS.safeMovement.traits.join("/"));
// ------------------------------------------------------------------------------------------------ the compendium's Prone
const fs = await import("node:fs");
const prone = JSON.parse(fs.readFileSync(ROOT + "packs/_source/conditions/" + fs.readdirSync(ROOT + "packs/_source/conditions").find(f => /Prone/i.test(f) && /\.json$/.test(f)), "utf8"));
console.log("\nthe Prone effect:", strip(prone.system.description), "| Hindered linked:", JSON.stringify(prone.system.linked ?? ""), "| settings:", prone.system.settings.map(x => `${x.type} ${x.boons ?? 0}b ${x.banes ?? 0}n`).join(", "));
// ------------------------------------------------------------------------------------------------ v0.0.292 (PACK ROLL-DIALOG): the new roll dialog
console.log("\n--- the new roll dialog (v0.0.292): the same rolls through it, and its named sources on the card");
{
  // the test answers the dialog: its default choices, plus what `tweak` clicks (rolldlg.mjs), and remembers what it showed
  let seenInp = null, tweak = null;
  globalThis.__twod12RollDialog = (inp, RD) => { seenInp = inp; const st = RD.newState(inp); tweak?.(st, RD, inp); return RD.result(inp, st); };
  const show = () => seenInp.chips.map(c => `${c.label}[${c.scope === "shared" ? "you" : (seenInp.creatures.find(x => x.uuid === c.scope)?.name ?? c.scope)}${c.start === "on" ? "" : `, ${c.start}`}]`).join(" ");
  goblin.statuses = new Set(); ally.statuses = new Set();
  const hook = globalThis.__twod12RollDialog; delete globalThis.__twod12RollDialog;
  await act("OLD Shoot Nari (the same world, the old dialog)", shoot, [nariTok], [6, 7, 1, 2, 3, 1]);
  globalThis.__twod12RollDialog = hook;
  let c = await act("NEW Shoot Nari (the new dialog)", shoot, [nariTok], [6, 7, 1, 2, 3, 1]);
  console.log("   chips:", show(), "| creatures:", seenInp.creatures.map(x => `${x.name} ${x.def} ${x.dc}`).join(", "), "| dice line:", JSON.stringify(RD_line(seenInp)));
  tweak = (st, RD) => { RD.addManual(st, "shared", "bane"); RD.addManual(st, "shared", "plus"); RD.toggleChip(st, seenInp.chips.find(x => x.id === "syn:engaged")); };
  c = await act("NEW Shoot Nari: +1 Bane, +1, Engaged off", shoot, [nariTok], [6, 7, 2, 3]);
  const br = c ? strip((c.content.match(/<div class="cc-break[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? "")) : "";
  console.log("   breakdown:", br.slice(0, 260), "| flags rd banes:", JSON.stringify(c?.flags?.twod12?.rd?.shared?.banes), "| flat:", JSON.stringify(c?.flags?.twod12?.rd?.shared?.flat));
  tweak = null;
  // v0.0.293: a Version with no roll opens the new dialog too (Lucas: Opportunity Attack and the Reactions had the old window)
  chat.length = 0; notes.length = 0; seenInp = null;
  await A.useAction(kai, crawl).catch(e => console.log("Crawl FAILED", e.message));
  console.log("NEW Crawl: the dialog:", !!seenInp, "| no roll:", seenInp?.versions.map(v => `${v.cost} ${v.noTiers ? "no roll" : "roll"}`).join(", "), "| card posted:", chat.some(m => m.content.includes("Crawl")), "|", notes.join(" | ") || "no warning");
}
{
  // v0.0.302 (Lucas tested v0.0.301: "Flank is not showing up at all in the roll dialog"): the same Strike as above, through the new dialog
  let seenInp = null;
  globalThis.__twod12RollDialog = (inp, RD) => { seenInp = inp; const st = RD.newState(inp); globalThis.__rdHtml = RD.dialogHtml(inp, st); return RD.result(inp, st); };
  ally.statuses = new Set(); ally.itemTypes.weapon = [spear]; goblin.statuses = new Set();
  place(goblinTok, 1, -1); place(allyTok, 2, -1);
  const c = await act("NEW Strike the Goblin: the Ally flanks it", stab, [goblinTok], [6, 7]);
  console.log("   chips:", (seenInp?.chips ?? []).filter(x => /flank/i.test(x.id)).map(x => `${x.id} ${x.label} [${x.scope}] ${x.start}`).join(" | ") || "NO FLANKING CHIP", "| in the dialog:", /Flanking/.test(globalThis.__rdHtml ?? ""), "| card total", c ? "" : "(no card)");
  place(allyTok, 4, 3);
  delete globalThis.__twod12RollDialog;
}
function RD_line(inp) { return { versions: inp.versions.map(v => v.cost).join("/"), roll: inp.roll, multi: inp.multi }; }
delete globalThis.__twod12RollDialog;
