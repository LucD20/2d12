// Run with: node tools/tests/run.mjs (or node tools/tests/t86.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// A whole Action used against several creatures: Whirlwind around Kai with Nari, Lonny and Goblin in the area. One roll, each calculated on its own.
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
const DialogV2 = { confirm: async () => true, prompt: async o => { if (!/name="fx"|name="ap"|name="dc"/.test(o.content ?? "")) return {}; return DialogV2.wait(o); }, wait: async o => { dialogContent = o.content; const fx = [...o.content.matchAll(/name="fx" value="([^"]+)"([^>]*)>/g)].filter(m => /checked/.test(m[2])).map(m => m[1]); return { ap: (/name="ap" value="(\d+)"/.exec(o.content) ?? [0, "2"])[1], dc: String(dcInDialog(o.content)), mod: "0", boons: "0", banes: "0", fx, ...dialogExtra }; } };
let dialogExtra = {};
const dcInDialog = html => (/name="dc"[^>]*value="(\d+)"/.exec(html) ?? /value="(\d+)"[^>]*name="dc"/.exec(html))?.[1] ?? 13;
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
const strip = h => String(h).replace(/data-tooltip="[^"]*"/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
// the dice: d12 d12 for all; Lonny has cover (a bane), Nari a boon from an effect on her (Prone: Melee against her gains a boon)
const coll = arr => Object.assign(arr, { get: id => arr.find(e => e.id === id) });
nari.effects = coll([{ id: "pr", name: "Prone", statuses: new Set(["prone"]), getFlag: (s, k) => (k === "modifiers" ? [{ against: true, boons: 1, banes: 0, all: [], any: ["melee"], none: [], from: [] }] : undefined), flags: {} }]);
script = [6, 7,   2, 1,  2];   // d12 d12, then boon dice for Nari (1 die: shows 2 → 1), bane dice for Lonny (cover: 2 banes: shows 2, 1 → 1, 0)
const ev = await A.useAction(kai, whirl).catch(e => ({ error: e }));
if (ev?.error) { console.log("useAction failed:", ev.error.stack.split("\n").slice(0, 4).join(" | ")); }
console.log("targets chosen by the area:", [...game.user.targets].map(t => t.name).sort().join(", "));
console.log("notes:", notes.join(" | ") || "(none)");
console.log("chips offered in the dialog:", [...dialogContent.matchAll(/name="fx" value="([^"]+)"([^>]*)>/g)].map(m => m[1] + (/checked/.test(m[2]) ? "*" : "")).join(" "));
const card = chat.find(m => /Whirlwind/.test(m.content));
console.log("card:", card ? strip(card.content).slice(0, 700) : "(no card)");
const f = card?.flags?.twod12?.action;
console.log("flags: tier", f?.tier, "| results:", JSON.stringify((f?.results ?? []).map(r => `${r.name}: tier ${r.tier}`)), "| targets:", JSON.stringify((f?.targets ?? []).map(t => t.name)));
console.log("dice in the message:", card?.rolls?.length);
const faces = kind => [...card.content.matchAll(new RegExp(`class="die d3 ${kind}">(\\d)<`, "g"))].map(m => m[1]).join(",");
console.log("shared dice shown: boon dice", faces("boon") || "-", "| bane dice", faces("bane") || "-");
const rows = [...card.content.matchAll(/<div class="mrow t(\d)"><span class="mname">([^<]+)<\/span><span class="mcalc"[^>]*>([^<]*)<\/span>[\s\S]*?<b class="rtotal">(\d+)<\/b><small class="vsdc">DC (\d+)</g)].map(m => ({ tier: m[1], name: m[2], calc: m[3].replace(/&minus;/g, "−"), total: m[4], dc: m[5] }));
for (const r of rows) console.log(`  ${r.name.padEnd(7)} ${r.calc.padEnd(16)} = ${r.total} vs DC ${r.dc} → tier ${r.tier}`);

// ---------------------------------------------------------------------------------------------------- a second roll: three different DCs
const run = async (label, dice, extra = {}) => {
  chat.length = 0; notes.length = 0; script = [...dice]; dialogExtra = extra;
  const e = await A.useAction(kai, whirl).catch(err => ({ error: err }));
  if (e?.error) { console.log(label, "FAILED:", e.error.stack.split("\n").slice(0, 3).join(" | ")); return null; }
  const c = chat.find(m => /Whirlwind/.test(m.content));
  const fc = k => [...c.content.matchAll(new RegExp(`class="die d3 ${k}">(\\d)<`, "g"))].map(m => m[1]).join(",") || "-";
  const rr = [...c.content.matchAll(/<div class="mrow t(\d)"><span class="mname">([^<]+)<\/span><span class="mcalc"[^>]*>([^<]*)<\/span>[\s\S]*?<b class="rtotal">(\d+)<\/b><small class="vsdc">DC (\d+)</g)];
  console.log(`--- ${label}: boon dice ${fc("boon")}, bane dice ${fc("bane")}`);
  for (const m of rr) console.log(`  ${m[2].padEnd(7)} ${m[3].replace(/&minus;/g, "−").padEnd(18)} = ${m[4]} vs DC ${m[5]} → tier ${m[1]}`);
  return c;
};
whirl.system.vs = "body"; lonny.system.attributes.body = 8; goblin.system.attributes.body = 20; nari.system.attributes.body = 0;
const card2 = await run("three DCs (13, 17, 23), dice 9 and 11", [9, 11, 2, 1, 2]);
console.log("the outcome grouped by Tier, who landed where:", strip((card2.content.match(/<div class="cc-groups">[\s\S]*?<\/div><\/div><\/div>/) ?? [""])[0]));
console.log("each creature's own Defense on its row:", [...card2.content.matchAll(/class="cc-cname">([^<]*)<\/span><span class="cc-cdef">([\s\S]*?)<\/span><button/g)].map(m => `${m[1]}: ${strip(m[2])}`).join(" | "));
console.log("DC ranges in the tier column are generic when the DCs differ:", !/≤ \d+/.test(card2.content));
console.log("flags:", JSON.stringify(card2.flags.twod12.action.results.map(r => `${r.name} T${r.tier}${r.crit ? " crit" : ""}`)), "| highest tier on the card:", card2.flags.twod12.action.tier);
// Favored for everyone (the dialog's toggle): a third die, each keeps the two highest
const card3 = await run("Favored for all: 3d12 (4, 12→8, 6) keeps the two highest", [4, 12, 8, 6, 2, 1, 2], { favored: "on" });
console.log("a third die was rolled:", card3.rolls.length >= 3, "| dice line has a third group:", card3.content.includes("dgroup third"));
// ---------------------------------------------------------------------------------------------------- the dialog: a tile per target, each with its own modifiers
const tiles = [...dialogContent.matchAll(/class="ttile( on)?" data-tg="([^"]+)"/g)].map(m => m[2] + (m[1] ? "*" : ""));
console.log("dialog tiles:", tiles.join(" "), "| groups:", [...dialogContent.matchAll(/class="fxgroup( off)?" data-for="([^"]+)"/g)].map(m => m[2] + (m[1] ? "" : " (shown)")).join(", "));
const groupChips = u => [...(dialogContent.match(new RegExp(`data-for="${u.replace(/\./g, "\\.")}">([\\s\\S]*?)</div>`)) ?? ["", ""])[1].matchAll(/name="fx" value="([^"]+)"/g)].map(m => m[1]).join(" ") || "(none)";
console.log("Nari's tile holds:", groupChips("Actor.Nari"), "| Lonny's:", groupChips("Actor.Lonny"), "| Goblin's:", groupChips("Actor.Goblin"));
console.log("the chips carry their boons and banes (for the dots): Lonny's cover", /name="fx" value="syn:cover\|Actor\.Lonny" data-b="0" data-n="(\d)"/.exec(dialogContent)?.[1], "banes | Nari's Prone", /name="fx" value="Actor\.Nari\|pr:0" data-b="(\d)" data-n="0"/.exec(dialogContent)?.[1], "boon");
const CCm = await import(ROOTURL + "module/chatcards.mjs");
console.log("odds: not in the stored card:", !card2.content.includes("cc-designer"), "| in Designer mode, one line per creature:", (CCm.renderCard(card2.flags.twod12.cc, CCm.viewOf({ gm: true, designer: true })).match(/Odds \(/g) || []).length);
// ---------------------------------------------------------------------------------------------------- Roll Damage: ONE card, a row per creature with its own buttons
chat.length = 0; notes.length = 0; script = [];
for (const a of [nari, lonny, goblin]) a.system.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 };
for (const a of [nari, lonny, goblin]) a.update = async u => { for (const [k, v] of Object.entries(u)) a.system.damage[k.split(".").pop()] = v; };
globalThis.fromUuid = async u => byUuid(u) ?? sceneTokens.find(t => t.uuid === u) ?? null;
globalThis.fromUuidSync = u => byUuid(u) ?? sceneTokens.find(t => t.uuid === u) ?? null;
const msg = { getFlag: (s, k) => card2.flags[s][k], setFlag: async () => {} };
const dm = await A.rollDamage(msg).catch(e => ({ error: e }));
if (dm?.error) console.log("rollDamage FAILED:", dm.error.stack.split("\n").slice(0, 4).join(" | "));
// v0.0.283 (pack chat-cards): the new damage message: one group per Tier (rolled once), a row per creature; Apply, Half, Apply all, Undo
const dcards = chat.filter(m => m.flags?.twod12?.ccDmg);
const dc = dcards[0], st0 = dc.flags.twod12.ccDmg;
console.log("damage messages posted:", dcards.length, "| groups (Tiers):", st0.groups.map(g => `Tier ${g.tier}: ${g.comps.reduce((x, c) => x + c.total, 0)}`).join(" | "), "| rows:", st0.rows.map(r => `${r.name} (group ${r.g})`).join(", "));
console.log("Apply buttons:", (dc.content.match(/data-twod12="ccApply"[^>]*data-factor="1" data-ctx="apply">Apply/g) || []).length, "| Apply all:", dc.content.includes("ccApplyAll"), "| no Lethal selector, no Block:", !dc.content.includes('class="kind"') && !dc.content.includes("Block"));
let current = { content: dc.content, flags: JSON.parse(JSON.stringify(dc.flags)) };
const live = { id: "dm1", isAuthor: true, get content() { return current.content; }, getFlag: (s, k) => current.flags[s][k], setFlag: async () => {}, update: async d => { if (d.content) current.content = d.content; if (d["flags.twod12.ccDmg"]) current.flags.twod12.ccDmg = d["flags.twod12.ccDmg"]; } };
const CD = await import(ROOTURL + "module/ccdamage.mjs");
const btn = (row, factor) => ({ dataset: { row: String(row), factor: String(factor) } });
const hp = a => a.system.damage.bodyLethal + a.system.damage.mindLethal;
const ccRows = () => current.flags.twod12.ccDmg.rows;
const fullOf = i => current.flags.twod12.ccDmg.groups[ccRows()[i].g].comps.reduce((x, c) => x + c.total, 0);
console.log("before: Nari", hp(nari), "Lonny", hp(lonny), "Goblin", hp(goblin));
await CD.ccDamageClick("ccApply", btn(0, 1), live); console.log("Apply on Nari's row: Nari", hp(nari), "of", fullOf(0), "| the row says:", strip(current.content.match(/class="cc-took">(.*?)<\/span>/)?.[1] ?? ""));
await CD.ccDamageClick("ccApply", btn(1, 0.5), live); console.log("Half on Lonny's row: Lonny", hp(lonny), "(full would be " + fullOf(1) + ", half rounded up " + Math.ceil(fullOf(1) / 2) + ")");
await CD.ccDamageClick("ccApplyAll", btn(0, 1), live); console.log("Apply all: Goblin", hp(goblin), "of", fullOf(2), "| Nari not hit twice:", hp(nari) === fullOf(0), "| all rows applied:", ccRows().every(r => r.applied));
await CD.ccDamageClick("ccUndo", btn(2, 1), live); console.log("Undo on Goblin's row: Goblin", hp(goblin), "| the row waits again:", !ccRows()[2].applied);
await CD.ccDamageClick("ccApply", btn(2, 2), live); console.log("Double on Goblin's row: Goblin", hp(goblin), "(double " + Math.ceil(fullOf(2) * 2) + ")");
await CD.ccDamageClick("ccAdjust", btn(2, 0.5), live); console.log("Then Half on the applied row: Goblin", hp(goblin), "(half " + Math.ceil(fullOf(2) / 2) + ")");
console.log("applying a row twice does nothing:", await (async () => { const b = hp(nari); await CD.ccDamageClick("ccApply", btn(0, 1), live); return hp(nari) === b; })());
// ---------------------------------------------------------------------------------------------------- a normal Strike: one target keeps the old card, two targets use the new one
sword.system.range = "10";   // v0.0.122: a melee weapon's Range is checked; these targets stand farther than 1 square
const strike = { id: "st", name: "Strike", type: "action", img: "", getFlag() {}, system: { traits: new Set(["strike", "weapon", "melee"]), area: "", areaCfg: { size: 0 }, targets: "One creature", distance: "reach", frequency: "atwill", requirements: "", vs: "body", category: "", level: 0, reaction: false, trigger: "", flavor: "", description: "", setup: "", prerequisites: "", modifiers: [],
  versions: [{ ap: 1, noTiers: false, t1: [], t2: [inst()], t3: [inst({ dice: "1d6" })], x1: "", x2: "", x3: "", effects: "", critical: "", fx: { all: [], t1: [], t2: [], t3: [] } }] } };
kai.items = { get: id => ({ wh: whirl, gs: sword, st: strike })[id], find: f => [whirl, sword, strike].find(f), filter: f => [whirl, sword, strike].filter(f), [Symbol.iterator]: function* () { yield whirl; yield sword; yield strike; } };
const one = async (label, targets, dice) => {
  chat.length = 0; notes.length = 0; script = [...dice]; dialogExtra = {}; game.user.targets.clear(); targets.forEach(t => game.user.targets.add(t));
  const e = await A.useAction(kai, strike).catch(err => ({ error: err }));
  if (e?.error) { console.log(label, "FAILED:", e.error.stack.split("\n").slice(0, 3).join(" | ")); return null; }
  const c = chat.find(m => /Strike/.test(m.content));
  console.log(`${label}: rows per creature: ${(c.content.match(/class="cc-crow"/g) || []).length} | one stamp and one ladder (one target): ${/class="cc-stamp/.test(c.content) && (c.content.match(/class="cc-ladder"/g) || []).length === 1} | results in the flags: ${c.flags.twod12.action.results ? c.flags.twod12.action.results.length : "none"} | tier ${c.flags.twod12.action.tier}`);
  return c;
};
nari.effects = coll([]);
await one("one target (Nari)", [nariTok], [8, 9]);
await one("two targets (Nari, Lonny)", [nariTok, lonnyTok], [8, 9, 2, 1, 2]);
await one("no target", [], [8, 9]);
// ---------------------------------------------------------------------------------------------------- six identical Skeleton Captains
sceneTokens.length = 0; sceneTokens.push(kaiTok);
const caps = Array.from({ length: 6 }, (_, n) => { const a = mkActor("Skeleton Captain"); a.uuid = "Actor.cap" + (n + 1); allActors.push(a); a.system.damage = { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }; a.update = async u => { for (const [k, v] of Object.entries(u)) a.system.damage[k.split(".").pop()] = v; };
  const ring = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 1]][n]; const t = mkToken("Skeleton Captain", ring[1], -1, a); t.id = "cap" + (n + 1); t.uuid = `Scene.s.Token.cap${n + 1}`; t.document.uuid = t.uuid; t.document.id = t.id; t.document.y = ring[0] * 100; t.center = { x: t.document.x + 50, y: t.document.y + 50 }; t.setTarget = on => { on ? game.user.targets.add(t) : game.user.targets.delete(t); }; return t; });
whirl.system.vs = "body"; whirl.system.areaCfg.size = 5; whirl.system.area = "5 Emanation";
const cardC = await run("six Skeleton Captains, dice 6 and 7", [6, 7]);
console.log("dialog tiles:", [...dialogContent.matchAll(/class="ttile[^"]*" data-tg="[^"]+" data-name="([^"]+)"/g)].map(m => m[1]).join(" | "), "| numbers on the tiles:", [...dialogContent.matchAll(/class="tnum">(\d+)</g)].map(m => m[1]).join(","), "| a dots holder on each:", (dialogContent.match(/class="tdots"/g) || []).length, "| a caption:", /class="tcap"/.test(dialogContent), "| the old per-tile name and DC text is gone:", !/class="tn"/.test(dialogContent));
console.log("rows on the card (one per creature):", (cardC.content.match(/class="cc-crow"/g) || []).length, "| Tier groups:", strip((cardC.content.match(/<div class="cc-groups">[\s\S]*?<\/div><\/div>/) ?? [""])[0]).slice(0, 120));
console.log("targets line (v0.0.285, kept in v0.0.296: at the bottom, beside the buttons):", strip((cardC.content.match(/<div class="cc-foot">[\s\S]*?<\/div>/) ?? [""])[0]), "| the top keeps the area:", strip((cardC.content.match(/<div class="cc-tline meta">[\s\S]*?<\/div>/) ?? [""])[0]));
chat.length = 0; script = [];
await A.rollDamage({ getFlag: (s, k) => cardC.flags[s][k], setFlag: async () => {} });
const dcC = chat.find(m => m.flags?.twod12?.ccDmg);
console.log("damage: one card with", (dcC.content.match(/class="cc-trow"/g) || []).length, "rows, named:", dcC.flags.twod12.ccDmg.rows.map(r => r.name).join(", "), "| Apply all:", /data-twod12="ccApplyAll"/.test(dcC.content));
const sizeOf = h => String(h).length;
console.log("size of the roll card: about", sizeOf(cardC.content), "characters for 6 creatures (one row), against", sizeOf(card2.content), "for 3");
// ---------------------------------------------------------------------------------------------------- a scene where the area can't be placed: the Action is still usable
canvas.grid.isSquare = false; chat.length = 0; notes.length = 0; script = [8, 9]; dialogExtra = {}; game.user.targets.clear(); game.user.targets.add(nariTok);
whirl.system.vs = "";
const eg = await A.useAction(kai, whirl).catch(err => ({ error: err }));
console.log("gridless scene: Whirlwind still rolls:", !eg?.error && chat.some(m => /Whirlwind/.test(m.content)), eg?.error ? eg.error.message : "");

// the tile helpers
console.log("dots:", JSON.stringify(A.tileDots(0, 0)), "|", A.tileDots(2, 1).replace(/<i class="dot /g, "").replace(/"><\/i>/g, " ").trim(), "| capped at 5 each:", (A.tileDots(9, 9).match(/dot g/g) || []).length, (A.tileDots(9, 9).match(/dot r/g) || []).length, "| never negative:", JSON.stringify(A.tileDots(-1, -2)));
console.log("captions:", JSON.stringify(A.tileCaption("Skeleton Captain 2", 13, 0, 2)), JSON.stringify(A.tileCaption("Nari", 17, 1, 0)), JSON.stringify(A.tileCaption("Goblin", 20, 0, 0)), JSON.stringify(A.tileCaption("Lonny", 15, 3, 1)));
console.log("numbers:", ["Skeleton Captain 2", "Nari", "Orc 10", "7", ""].map(n => JSON.stringify(A.tileNumber(n))).join(" "));
