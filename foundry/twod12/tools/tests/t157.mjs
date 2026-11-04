// Run with: node tools/tests/run.mjs (or node tools/tests/t157.mjs)
// v0.0.194 (Lucas, mockup granted-C2-ladder): the Escalation block's data (rungs, passive tags, Actives greyed or usable) and the Granted
// tickets' badges, from the compendium's real cards.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const { docs, uuidOf } = await import(ROOTURL + "tools/content.mjs");
globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null, socket: { emit() {} } };
const X = await import(ROOTURL + "module/escblock.mjs");
const F = "twod12";
const doc = (name, type) => docs.find(d => d.name === name && d.type === type);
let nid = 0;
const item = (name, type) => { const d = doc(name, type), flags = { sourceUuid: uuidOf(type === "action" ? "actions" : "features", name) }; return { id: `i${++nid}`, name, type, system: { ...d.system, settings: (d.system.settings ?? []).map(x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], ...x })), traits: new Set(d.system.traits ?? []) }, getFlag: (s, k) => flags[k] }; };
function archer(esc) {
  const flags = {}, feats = ["Killer's Focus", "Vanish", "Hallowed Stance"].map(n => item(n, "feature")), acts = ["Pinning Shot", "Twin Shot", "Deathmark", "Aim"].map(n => item(n, "action"));   // pack R-classes (v0.0.235): Vanish is a Passive, Elusive is gone, the Apex needs Escalation 3
  return { name: "Lana", uuid: "Actor.Lana", type: "character", isOwner: true, statuses: new Set(), effects: [], items: [...feats, ...acts],
    itemTypes: { feature: feats, action: acts, talent: [], class: [] }, system: { escalation: esc },
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = JSON.parse(JSON.stringify(v)); } };
}
const show = m => m.rungs.map(r => `${r.n}${r.lit ? "*" : ""}: ${[...r.passives.map(p => `${p.name}[${p.tag || "grey"}]`), ...r.actives.map(a => `${a.name}{${a.useOff ? "off" : "use"} ${a.freqText}}`)].join(", ")}`).join(" | ");
const row = i => ({ id: i.id, name: i.name, freq: i.system.frequency, freqText: { round: "Round", turn: "Turn" }[i.system.frequency] ?? "" });
const opts = (used = []) => ({ actionRow: row, isFaded: (a, i) => (used.includes(i.name) ? { faded: true, why: "Used: available again at the start of your next turn" } : { faded: false, why: "" }) });
console.log("thresholds:", ["Killer's Focus", "Vanish", "Hallowed Stance", "Radiant Zeal", "Mending Light"].map(n => `${n} ${X.passiveThreshold(item(n, "feature"))}`).join(", "));
console.log("out of combat, Escalation 0 (collapsed):", show(X.escalationModel(archer(0), opts())), "| open:", X.escalationModel(archer(0), opts()).open, "| shown:", X.escalationModel(archer(0), opts()).show);
const a3 = archer(3);
game.combat = { started: true, round: 3, turn: 1, turns: [{ actor: {} }, { actor: a3 }] };
console.log("Escalation 3, its turn, nothing given yet:", show(X.escalationModel(a3, opts())));
a3.effects = [{ disabled: false, getFlag: (s, k) => (k === "effectUuid" ? uuidOf("effects", "Killer's Focus") : undefined) }];
await a3.setFlag(F, "tsGiven", { [uuidOf("effects", "Killer's Focus").replace(/\./g, "_")]: [3, 1] });
console.log("Killer's Focus given (Ready):", show(X.escalationModel(a3, opts())));
a3.effects = [];
console.log("then used, Pinning Shot used this round:", show(X.escalationModel(a3, opts(["Pinning Shot"]))));
a3.system.escalation = 1;
console.log("Escalation spent to 1:", show(X.escalationModel(a3, opts())));
const elu = a3.items.find(i => i.name === "Vanish"), key = `passive-${elu.id}-1~m0`;
await a3.setFlag(F, "fxOnce", { [key]: [3, 1] });
console.log("Vanish used this round:", X.passiveState(a3, elu, 1), "| next round after its turn:", (game.combat.round = 4, game.combat.turn = 1, X.passiveState(a3, elu, 1)));
game.combat = null;
console.log("--- Granted ticket badges");
const fx = name => { const d = doc(name, "effect"); const fl = { bonuses: (d.system.settings ?? []).filter(x => x.type === "bonusdamage").map(x => ({ dmg: x.dmg, dmgPool: x.dmgPool, dmgSub: x.dmgSub, tiers: x.tiers ?? [], text: x.text ?? "" })) }; return { getFlag: (s, k) => fl[k] }; };
for (const [n, g] of [["Pinning Shot", { distinct: false, boons: 0 }], ["Double Shot (2 Attacks)", { distinct: true, boons: 0 }], ["Twin Shot", { distinct: false, boons: 0 }]]) { const b = X.grantBadges(g, fx(n)); console.log(`${n}: ${JSON.stringify(b.short)} | ${JSON.stringify(b.long)}`); }
const src = f => fs.readFileSync(ROOT + f, "utf8"), tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs");
console.log("on both tabs:", (tpl.match(/\{\{> escblock\}\}/g) ?? []).length, "| Escalation Actions out of the list and the Favorites:", sh.includes('!i.getFlag("twod12", "basic") && !isEscAct(i)') && sh.includes('!(Number(i.system?.escalation) > 0)).map(actRow), esc,'), "| collapse remembered per sheet:", sh.includes('game.user.setFlag("twod12", "escOpen", all)'), "| narrow sheet rules:", src("styles/system.css").includes("@container (max-width: 440px)"));
