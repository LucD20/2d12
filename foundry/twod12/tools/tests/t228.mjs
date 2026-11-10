// Run with: node tools/tests/run.mjs (or node tools/tests/t228.mjs)
// v0.0.333 (PACK RWI; book, Chapter 1, Resist, Weak and Immune): creatureDamageLines gathers a creature's Immune / Resist / Weak lines from every
// source (its own line, a worn armor, a wielded weapon, a Talent's rule, an applied effect) and keeps the highest of each kind and subtype; the
// sheet's Damage block (chips, tooltips, the GM's + Add), the pick window's model, the damage message reading the same lines, the stat block line.
const ROOT = new URL("../../", import.meta.url).href;
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, combat: null, user: { isGM: true } };
globalThis.fromUuidSync = () => null;
const SM = await import(ROOT + "module/sheetmodel.mjs");
const { creatureDamageLines, dmgModsOf } = await import(ROOT + "module/ccdamage.mjs");
const DL = await import(ROOT + "module/dmglines.mjs");
const { appliedFlags } = await import(ROOT + "module/appliedflags.mjs");

const setting = (kind, sub, n) => ({ type: "resist", rwKind: kind, dmgSub: sub, rwValue: n, attrs: [], all: [], any: [], none: [], tiers: [], from: [] });
const item = (id, type, name, system) => ({ id, type, name, uuid: `Actor.a.Item.${id}`, system, getFlag: () => undefined });
const effect = (id, name, settings, duration, remaining) => {
  const flags = { ...appliedFlags({ settings, description: "", hover: "", expireOn: new Set(), expireAll: false }, null), duration, remaining };
  return { id, name, uuid: `Actor.a.ActiveEffect.${id}`, disabled: false, statuses: new Set(), flags: { twod12: flags }, getFlag: (s, k) => (s === "twod12" ? flags[k] : undefined) };
};
const actor = (o = {}) => {
  const items = o.items ?? [];
  return { name: "Krag", uuid: "Actor.a", type: "npc", system: { dmgMods: o.own ?? "", escalation: 3 }, effects: o.effects ?? [], items: Object.assign(items, { get: id => items.find(i => i.id === id) }),
    itemTypes: { armor: items.filter(i => i.type === "armor"), weapon: items.filter(i => i.type === "weapon"), feature: items.filter(i => i.type === "feature"), talent: items.filter(i => i.type === "talent") }, getFlag: () => undefined };
};
const show = lines => lines.map(l => `${SM.damageLineName(l)} [${l.code}] from ${l.source.type}:${l.source.name}${l.temporary ? ` (temporary, ${l.remaining ?? "until removed"})` : ""}${l.overridden.length ? ` over ${l.overridden.map(o => `${SM.damageLineName(o)} (${o.source.name})`).join(", ")}` : ""}`).join(" | ");

console.log("--- every source");
const krag = actor({
  own: "Resist 1 Fire, Immune Psychic, Weak 5 Fire",
  items: [item("ar", "armor", "Dragonhide", { worn: true, dmgMods: "Resist 2 Fire" }), item("ar2", "armor", "Spare Plate", { worn: false, dmgMods: "Resist 9 Blunt" }),
    item("sh", "weapon", "Warded Blade", { wielded: true, dmgMods: "Resist 3 Blunt" }), item("w2", "weapon", "Sheathed Axe", { wielded: false, dmgMods: "Resist 8 Slash" }),
    item("tl", "talent", "Thick Skin", { settings: [setting("resist", "Bl", 1)] })],
  effects: [effect("fx", "Fire Ward", [setting("resist", "Fi", 3)], { type: "rounds", rounds: 3 }, 2), effect("hx", "Hex", [setting("weak", "Ho", 2)], { type: "eot" }), effect("cx", "Cursed", [setting("weak", "Co", 1)], {})]
});
const lines = creatureDamageLines(krag);
console.log(show(lines));
console.log("an unworn armor and a sheathed weapon are left out:", !lines.some(l => ["Spare Plate", "Sheathed Axe"].includes(l.source.name)), "| Immune has no value:", lines.find(l => l.kind === "immune").value,
  "| order Immune, Resist, Weak:", [...new Set(lines.map(l => l.kind))].join(", "), "| the codes:", lines.map(l => l.code).join(" "));
console.log("the damage message reads the same lines:", JSON.stringify(dmgModsOf(krag)));
console.log("empty:", JSON.stringify(creatureDamageLines(actor())), "| Immune and Resist of the same subtype are both kept:", show(creatureDamageLines(actor({ own: "Immune Fire, Resist 2 Fire" }))));
console.log("a tie keeps the lasting one:", show(creatureDamageLines(actor({ own: "Resist 3 Fire", effects: [effect("t", "Ward", [setting("resist", "Fi", 3)], { type: "rounds", rounds: 1 }, 1)] }))));

console.log("--- the chips and tooltips");
for (const l of lines) console.log(`${SM.damageLineChip(l)}  ⟶  ${SM.damageLineTip(l)}`);
const m = DL.damageBlockModel(lines, { gm: false }), html = DL.damageBlockHtml(m);
console.log("rows:", m.rows.map(r => `${r.label}: ${r.chips.map(c => c.text).join(", ")}`).join(" | "), "| dashed:", m.rows.flatMap(r => r.chips).filter(c => c.dashed).length, "| no + Add for a player:", !html.includes("dmgLineAdd"));
console.log("chips are buttons with an aria-label:", (html.match(/<button type="button" class="ps-dl /g) ?? []).length === lines.length && /aria-label="Resist 3 Fire, from Fire Ward \(effect\) · 2 rounds left"/.test(html), "| under the Damage label:", html.startsWith('<section class="ps-sec line ps-dmg"><span class="ps-k">Damage</span>'));
console.log("no line: hidden for a player:", DL.damageBlockHtml(DL.damageBlockModel([], { gm: false })) === "", "| a GM sees the empty block with + Add:", /Damage<\/span><button[^>]*dmgLineAdd[^>]*>\+ Add/.test(DL.damageBlockHtml(DL.damageBlockModel([], { gm: true }))));
console.log("an item's Damage lines:", DL.itemDamageHtml({ type: "armor", name: "Dragonhide", system: { dmgMods: "Resist 2 Fire, Immune Cold" } }).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
