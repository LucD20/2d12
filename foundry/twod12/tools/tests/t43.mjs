// Run with: node tools/tests/run.mjs (or node tools/tests/t43.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [{ id: "prone" }, { id: "hindered" }, { id: "immobilized" }] };
const warns = [], infos = [];
globalThis.ui = { notifications: { warn: m => warns.push(m), info: m => infos.push(m) } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Hooks = { on() {} };
const created = [];
globalThis.game = { settings: { get: (s, k) => ({ "group_friendly": "#4caf50", "group_hostile": "#d9534f" }[k] ?? true) }, items: [], user: { targets: new Set(), id: "u" }, socket: { emit() {} }, combat: null };
globalThis.fromUuid = async u => globalThis.__d?.[u]; globalThis.fromUuidSync = u => globalThis.__d?.[u];
// 1. Empowered
const { perDieDelta, tierProbs } = await import(ROOTURL + "module/calc.mjs");
// Empowered 1 adds 1 to every die of the damage (the dice rolled 3 | 2 and 5 | 6, 6 and 1 | none: a flat number)
console.log([[3], [2, 5], [6, 6, 1], []].map(r => `${r.length ? r.join("+") : "flat"} -> +${perDieDelta(r, 1)}`).join(" | "));
// 2. range bands
const mv = await import(ROOTURL + "module/move.mjs");
console.log([5, 10, 11, 20, 21, 40, 41].map(n => { const b = mv.rangeBand(n, "10/20/40"); return `${n}:${b.out ? "OUT" : b.banes + "b"}`; }).join(" "), "|", mv.rangeBand(3, "8/16/32").label, "|", mv.rangeBand(9, "8/16/32").label, "|", mv.rangeBand(3, ""));
// 3. condition button parse and render
const inl = await import(ROOTURL + "module/inline.mjs"); inl.registerInline();
const enr = CONFIG.TextEditor.enrichers[0];
const run = async t => { const o = []; for (const m of t.matchAll(enr.pattern)) o.push((await enr.enricher(m)).html); return o; };
console.log(await run("@Condition[immobilized|rounds:eot] @Condition[prone] @Condition[hindered|eot] @Condition[hindered|rounds:2] @Condition[prone|2]"));
console.log(JSON.stringify(inl.parseInline("Condition", "immobilized|rounds:eot")), JSON.stringify(inl.parseInline("Condition", "hindered|rounds:3")));
// 4. generator
const gen = await import(ROOTURL + "module/gen.mjs");
console.log(gen.convertEffects("Prone. Immobilized (EoT). Hindered (2 rounds). Next Move is Hindered (EoT). Advance 2."));
// 5. apply a condition by Effect item name, with the duration of the button
const ef = await import(ROOTURL + "module/effects.mjs");
const made = [];
const actor = { documentName: "Actor", uuid: "Actor.a", name: "Orc", isOwner: true, effects: [], statuses: new Set(), items: [], getFlag() {}, createEmbeddedDocuments: async (t, d) => made.push(...d), deleteEmbeddedDocuments: async () => {}, toggleStatusEffect: async (id, o) => made.push({ status: id, ...o }) };
const item = { type: "effect", name: "Effect: Immobilized", uuid: "Item.imm", img: "i.svg", system: { selfApplied: false, duration: { type: "", rounds: 1 }, settings: [{ type: "speed", speedMode: "override", speedFormula: "0", attrs: new Set(), all: new Set(), any: new Set(), none: new Set(), tiers: new Set() }], expireOn: new Set(), expireAll: false, description: "" }, toObject() { return { system: {} }; } };
globalThis.__d = { "Item.imm": item, "Actor.a": actor }; game.items.push(item);
const found = await ef.applyCondition("immobilized", [actor], { type: "eot" }, { actorUuid: "Actor.src" });
console.log("found item:", found, "| AE:", made[0]?.name, "| statuses:", JSON.stringify(made[0]?.statuses), "| duration:", JSON.stringify(made[0]?.flags?.twod12?.duration), "| speedMods:", JSON.stringify(made[0]?.flags?.twod12?.speedMods));
made.length = 0; const f2 = await ef.applyCondition("prone", [actor], null, null); console.log("no Effect item named Prone:", f2, JSON.stringify(made));
// 6. derived Bloodied / Strained banes
const bl = { effects: [], system: { bloodied: true, strained: false } };
const ml = ef.modifierList(bl, new Set(["strike", "weapon"])); console.log("Bloodied chip:", ml.map(m => `${m.name} banes ${m.banes} match ${m.match}`).join(","), "| mind action:", ef.modifierList(bl, new Set(["mind"]))[0].match, "| resolved:", JSON.stringify(ef.resolveModifiers(bl, ["syn:bloodied"])));
const st = { effects: [], system: { bloodied: false, strained: true } }; console.log("Strained magic:", ef.modifierList(st, new Set(["magic"]))[0].match, "| body:", ef.modifierList(st, new Set(["body"]))[0].match);
console.log("range extra resolves:", JSON.stringify(ef.resolveModifiers(bl, ["syn:range"], [{ id: "syn:range", name: "Far range (14 sq)", banes: 1 }])));
// 7. group colors
const cf = await import(ROOTURL + "module/config.mjs");
console.log("group colors:", cf.groupColor({ token: { disposition: 1 } }), cf.groupColor({ token: { disposition: -1 } }), cf.groupColor({ actor: { type: "character" } }), cf.groupColor({ token: { disposition: 0 } }), cf.groupColor({ token: { disposition: -2 } }));
console.log("card colors:", cf.cardColorFor({ traits: new Set(["weapon"]) }), cf.cardColorFor({ traits: new Set(["self", "focus"]) }), cf.cardColorFor({ traits: new Set(["divine"]) }));
console.log("distance with a ranged weapon:", cf.distanceText({ distance: "reach", traits: new Set(["weapon"]) }, { system: { range: "10/20/40", traits: new Set(["ranged"]) } }), "| melee weapon:", cf.distanceText({ distance: "reach", traits: new Set(["weapon"]) }, { system: { range: "", traits: new Set(["melee"]) } }), "| non weapon:", cf.distanceText({ distance: "reach", traits: new Set(["divine"]) }, { system: { range: "10/20/40", traits: new Set(["ranged"]) } }));
// 8. catalog
globalThis.ChatMessage = { create: async d => { created.push(d.content); } };
const { catalog } = await import(ROOTURL + "module/catalog.mjs");
game.items.push({ type: "class", name: "Archer", uuid: "Item.c", system: { bodyMult: 3, mindMult: 2.5, rallyMod: 3 } }, { type: "weapon", name: "Shortbow", uuid: "Item.w", system: { subtype: "P", traits: new Set(["ranged"]), range: "8/16/32", damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d6", mod: 0 }, t3: { count: 1, die: "d10", mod: 0 } } } }, { type: "action", name: "Reaping Sweep", uuid: "Item.r", system: { category: "Weapon Technique", level: 0, traits: new Set(["strike"]), versions: [{ ap: 1 }] } }, { type: "talent", name: "Lesser Blessing", uuid: "Item.t", system: { category: "Talent", level: 1, traits: new Set(["divine"]), requirements: "" } }, { type: "feature", name: "Divine Connection", uuid: "Item.f", system: { category: "Paladin Feature", level: 1, talents: 2 } });
game.user.id = "u"; await catalog(); const txt = created[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
console.log("catalog:", txt.slice(0, 520));
