// Run with: node tools/tests/run.mjs (or node tools/tests/t49.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { tierProbs } = await import(ROOTURL + "module/calc.mjs");
const pc = r => r.map(x => Math.round(x * 100)).join("/"), succ = r => Math.round((r[1] + r[2]) * 100);
console.log("exact odds +0 vs 13: none", pc(tierProbs(0, 13, 0, 0)), succ(tierProbs(0, 13, 0, 0)) + "%", "| 1 boon", pc(tierProbs(0, 13, 1, 0)), succ(tierProbs(0, 13, 1, 0)) + "%", "| 2 boons", succ(tierProbs(0, 13, 2, 0)) + "%", "| 3 boons", succ(tierProbs(0, 13, 3, 0)) + "%", "(v0.0.301: flat, a Boon is +1 Modifier)");
console.log("+2: none", succ(tierProbs(2, 13, 0, 0)) + "%", "| 1 boon", succ(tierProbs(2, 13, 1, 0)) + "%", "| 3 boons", succ(tierProbs(2, 13, 3, 0)) + "%", "| 1 bane", succ(tierProbs(2, 13, 0, 1)) + "%", "| boon+bane", pc(tierProbs(2, 13, 1, 1)), "vs none", pc(tierProbs(2, 13, 0, 0)));
// the roll: v0.0.301, a Boon is +1 and a Bane -1 (no dice); Critical is Doubles on a result that is already Tier 3
let seq = [];
globalThis.Roll = class { constructor(f) { this.f = String(f).replace(/xs/g, ""); } async evaluate() { const n = Number(this.f.match(/^(\d+)d3/)?.[1] ?? 0); const faces = seq.shift?.() ?? Array(n).fill(2); this.dice = [{ results: faces.map(result => ({ result })) }]; this.total = faces.reduce((a, b) => a + b, 0) - n; this.formula = this.f; return this; } };
const rl = await import(ROOTURL + "module/roll.mjs");
const rd = vals => { let i = 0; globalThis.Roll = class { constructor(f) { this.f = String(f).replace(/xs/g, ""); } async evaluate() { const n = Number(this.f.match(/^(\d+)d(\d+)/)?.[1] ?? 0), d = Number(this.f.match(/^\d+d(\d+)/)?.[1]); if (d === 3) { const faces = [3, 1, 2].slice(0, n); this.dice = [{ results: faces.map(result => ({ result })) }]; this.total = faces.reduce((a, b) => a + b, 0) - n; } else { const v = vals[i++]; this.dice = [{ results: [{ result: v }] }]; this.total = v; } return this; } }; };
rd([9, 9]);  let r = await rl.performCheck({ mod: 3, boons: 2, banes: 0, dc: 13 });
console.log("9+9+3 = 21 with doubles (Tier 3 already): crit", r.crit, "tier", r.tier, "| boons", r.boonFaces, "bonus", r.bo, "total", r.total, "(2 Boons: +1 each)");
rd([5, 5]);  r = await rl.performCheck({ mod: 0, boons: 0, banes: 0, dc: 13 });
console.log("5+5+0 = 10, doubles on a Tier 1: crit", r.crit, "tier", r.tier);
rd([8, 8]);  r = await rl.performCheck({ mod: 0, boons: 0, banes: 0, dc: 13 });
console.log("8+8 = 16, doubles on a Tier 2: crit", r.crit, "tier", r.tier, "(Tier 2 -> 3 is not a Critical)");
rd([9, 4]);  r = await rl.performCheck({ mod: 8, boons: 0, banes: 1, dc: 13 });
console.log("no doubles, 9+4+8, 1 bane: crit", r.crit, "| bane faces", r.baneFaces, "| ba", r.ba);
// the Evade button: who moves
globalThis.canvas = { tokens: { controlled: [] } };
const T = (id, owner = true) => ({ id, actor: { isOwner: owner, name: id }, document: { uuid: "T." + id } });
const paladin = T("paladin"), ally = T("ally"), skel = T("skel");
globalThis.fromUuidSync = u => ({ object: { paladin, ally, skel }[u.replace("T.", "")] });
const msg = targets => ({ getFlag: (s, k) => ({ targets: targets.map(t => ({ uuid: "T." + t })), actorUuid: "Actor.paladin" }) });
const mv = await import(ROOTURL + "module/move.mjs");
const who = (sel, targets) => { globalThis.canvas.tokens.controlled = sel; return mv.moverToken({ message: msg(targets) })?.id; };
console.log("Lay On Hands on the ally; Paladin selected:", who([paladin], ["ally"]), "| ally selected:", who([ally], ["ally"]), "| nothing selected:", who([], ["ally"]), "| no target, skeleton selected:", who([skel], []), "| two targets, one selected:", who([ally], ["ally", "skel"]));
