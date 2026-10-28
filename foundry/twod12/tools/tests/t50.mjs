// Run with: node tools/tests/run.mjs (or node tools/tests/t50.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, combat: null };
const { critProb, tierProbs } = await import(ROOT + "module/calc.mjs");
const pc = x => (x * 100).toFixed(1) + "%";
console.log("Critical chance: +0", pc(critProb(0)), "| +2", pc(critProb(2)), "| +3", pc(critProb(3)), "(simulation: 3.0 / 4.5 / 5.0)  | tier probs still sum to 1:", tierProbs(2).reduce((a, b) => a + b, 0).toFixed(3));
// 20 above the DC and Doubles on a Tier 3
let i = 0; globalThis.Roll = class { constructor(f) { this.f = f; } async evaluate() { const v = this._vals?.[i++]; this.dice = [{ results: [{ result: 1 }] }]; this.total = 0; return this; } };
const rd = vals => { let k = 0; globalThis.Roll = class { constructor(f) { this.f = f; } async evaluate() { const n = Number(this.f.match(/^(\d+)d3/)?.[1] ?? 0); if (this.f.includes("d3")) { this.dice = [{ results: Array(n).fill({ result: 1 }) }]; this.total = 0; } else { const v = vals[k++]; this.dice = [{ results: [{ result: v }] }]; this.total = v; } return this; } }; };
const rl = await import(ROOT + "module/roll.mjs");
rd([11, 11]); let r = await rl.performCheck({ mod: 3, dc: 13, boons: 0, banes: 0 }); console.log("11+11+3 = 25 (Tier 3, doubles): crit", r.crit);
rd([11, 10]); r = await rl.performCheck({ mod: 12, dc: 13, boons: 0, banes: 0 }); console.log("11+10+12 = 33, no doubles (20 above the DC): crit", r.crit, "tier", r.tier);
rd([11, 10]); r = await rl.performCheck({ mod: 11, dc: 13, boons: 0, banes: 0 }); console.log("11+10+11 = 32: crit", r.crit);
// Unconscious
const cf = await import(ROOT + "module/config.mjs");
const st = (...s) => ({ statuses: new Set(s) });
console.log("Unconscious Doom: plain", cf.unconsciousDoom(st("unconscious"), "appeal"), "| Dying Body Check", cf.unconsciousDoom(st("unconscious", "dying"), "body"), "| Dying Mind Save", cf.unconsciousDoom(st("unconscious", "dying"), "mind"), "| Shattered Mind Check", cf.unconsciousDoom(st("unconscious", "shattered"), "mind"), "| awake", cf.unconsciousDoom(st(), "body"));
// matches with "from"
const ef = await import(ROOT + "module/effects.mjs");
const T = (...t) => new Set(t);
const m = { all: [], any: [], none: [], from: ["divine"] };
console.log("from-trait Save bonus: Save from a Divine Action", ef.matches(m, T("appeal"), T("strike", "divine")), "| from a non-divine Action", ef.matches(m, T("appeal"), T("strike")), "| a roll with no source", ef.matches(m, T("appeal")), "| setting without from", ef.matches({ all: [], any: [], none: [] }, T("appeal")));
// movement: who moves
globalThis.canvas = { tokens: { controlled: [] } };
const tk = id => ({ id, actor: { isOwner: true, name: id }, document: { uuid: "T." + id } });
const pal = tk("paladin"), ally = tk("ally"), skel = tk("skel");
globalThis.fromUuidSync = u => ({ object: { paladin: pal, ally, skel }[u.replace("T.", "")], ...{} });
const msg = (targets, self) => ({ getFlag: () => ({ targets: targets.map(t => ({ uuid: "T." + t })), actorUuid: "Actor.paladin", self }) });
const mv = await import(ROOT + "module/move.mjs");
const who = (sel, targets, self, cfg = {}) => { globalThis.canvas.tokens.controlled = sel; return mv.moverToken({ message: msg(targets, self) }, cfg)?.id; };
console.log("Self Action (Reload), paladin selected:", who([pal], [], true), "| Self + skeleton selected:", who([skel], [], true), "| Lay On Hands on ally, paladin selected:", who([pal], ["ally"], false), "| ally selected:", who([ally], ["ally"], false), "| |traits:self on a non-Self card:", who([pal], ["ally"], false, { traits: ["self"] }));
// basic actions and generator
const bs = await import(ROOT + "module/basic.mjs");
console.log("Charge:", bs.BASIC_ACTIONS.charge.traits.join(","), "| targets:", JSON.stringify(bs.BASIC_ACTIONS.charge.targets), "|", bs.BASIC_ACTIONS.charge.versions[0].effects.match(/@Move\[[^\]]+\]/)?.[0]);
