// Run with: node tools/tests/run.mjs (or node tools/tests/t227.mjs)
// v0.0.331 (Lucas: four PCs "as different as you can", optimized, with his portraits; "revise the sheets"): the compendium PCs' sheets as the
// character's data model computes them (Foundry stubbed): Attributes, Health (the third floor), Rally, Speed, Modifiers, Defenses, the armor
// trained, the Mastery of the Archers' bows (their Techniques open), the Talent choice (Rimebrand), the portrait and the token's name; and
// what differs between the two builds of each class.
const ROOT = new URL("../../", import.meta.url).href;
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)), mergeObject: (a, b) => ({ ...a, ...b }) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} };
const C = await import(ROOT + "tools/content.mjs");
globalThis.game = { settings: { get: () => false }, combat: null, user: { isGM: true } }; globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)), mergeObject: (a, b) => ({ ...a, ...b }) } });
const D = await import(ROOT + "module/data.mjs");
const Char = Object.values(D).find(c => typeof c === "function" && /Character/.test(c.name) && c.prototype?.prepareDerivedData);
for (const a of C.pcs) {
  const items = a.items.map(i => ({ ...i, id: i._id, system: { ...i.system, traits: new Set(i.system.traits ?? []) }, getFlag: (s, k) => i.flags?.[s]?.[k] }));
  items.find = Array.prototype.find; 
  const actor = { items, itemTypes: Object.groupBy(items, i => i.type), effects: [], appliedEffects: [], getFlag: (s, k) => a.flags?.[s]?.[k], type: "character" };
  const sys = { ...a.system, parent: actor, rallyUsed: 0, bodyWounds: 0, mindWounds: 0, exhausted: 0, bodyDamage: 0, mindDamage: 0, damage: {}, guard: 0 };
  try { Char.prototype.prepareDerivedData.call(sys); } catch (e) { console.log(a.name, "ERROR", e.message, e.stack.split("\n")[1]); }
  const s = sys;
  console.log(`${a.token}: ${s.speciesName} ${s.className} L${s.level} stage ${s.stage} | attrs ${JSON.stringify(s.attributes)} | Vigor ${s.bdt} Resolve ${s.mdt} Health ${s.healthLine?.pool} | Rally ${s.rallyMax} (heal ${s.rallyHeal}) | Speed ${s.speed} move ${s.moveSpeed} | Weapon +${s.weaponMod} Power +${s.powerMod} Sig +${s.signatureMod} | AD ${s.armorDC} (${s.armorLabel}${s.armorUntrained ? ", UNTRAINED" : ""}) WD ${s.wardDC} | armor ${s.armorTraining} | steadiness ${s.steadiness} reach ${s.reach}`);
}
for (const a of C.pcs) {
  const names = t => a.items.filter(i => i.type === t).map(i => i.name);
  const m = Object.values(a.flags?.twod12?.mastery ?? {})[0];
  const lb = a.items.find(i => i.name === "Lesser Blessing");
  console.log(`${a.token}: ${a.img} | ${names("weapon")[0]} (Mastery ${m?.value}: ${m?.value >= 3 ? "Technique open" : "Technique locked"}) | Talents: ${names("talent").join(", ")}${lb ? ` | Lesser Blessing chose ${a.items.find(i => i.flags?.twod12?.talentId === lb._id && i.flags.twod12.choice)?.name}` : ""}`);
}
const picks = a => new Set(a.items.filter(i => ["action", "feature", "talent", "weapon"].includes(i.type) && !i.flags?.twod12?.basic && !/^(Fists|Weapon Attack|Mark Quarry)$/.test(i.name) && !["Divine Power", "Kindled Wrath", "Sharpshooter", "Marked Quarry", "Thrill of the Kill"].includes(i.name)).map(i => i.name));
for (const [x, y] of [[0, 1], [2, 3]]) { const A = picks(C.pcs[x]), B = picks(C.pcs[y]); console.log(`${C.pcs[x].token} and ${C.pcs[y].token} share:`, [...A].filter(n => B.has(n)).join(", ") || "nothing"); }
