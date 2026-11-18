// Run with: node tools/tests/run.mjs (or node tools/tests/t222.mjs)
// v0.0.321 (Lucas on v0.0.320): the damage message's rows (Resist / Weak / Immune only once applied, as small icons after "Took"; Apply and Undo in
// the same place; the Lethal tag in the on-demand row) and a written [Mod] in a [W] term with the weapon's subtype (Smite's "[W] + 2 Sl").
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u", isGM: true }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
// a Roll stand-in: every die rolls 3
globalThis.Roll = class { constructor(f) { this.f = String(f).replace(/xs/g, ""); } async evaluate() { let total = 0; this.dice = []; for (const t of this.f.split("+").map(x => x.trim())) { const m = t.match(/^(\d+)d(\d+)$/); if (m) { const r = Array.from({ length: +m[1] }, () => ({ result: 3 })); this.dice.push({ faces: +m[2], results: r }); total += 3 * +m[1]; } else total += Number(t) || 0; } this.total = total; return this; } };
const CC = await import(ROOTURL + "module/chatcards.mjs");
const A = await import(ROOTURL + "module/actions.mjs");
const text = h => h.replace(/<i [^>]*aria-label="([^"]*)"[^>]*><\/i>/g, "[icon: $1]").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log("--- the icons after \"Took\" (one per kind, the numbers in the tooltip)");
console.log(text(CC.rwIcons([{ kind: "resist", label: "Resist Fire", v: -3 }, { kind: "weak", label: "Weak Holy", v: 2 }, { kind: "immune", label: "Immune Cold", v: -6 }, { kind: "guard", label: "Guard", v: -2 }])));
console.log("none:", JSON.stringify(CC.rwIcons([])));

console.log("--- a damage message: one row waiting, one applied");
const comps = [{ pool: "B", sub: "Fi", total: 5, formula: "1d6+2", dice: [], kind: "W" }];
const m = { kind: "dmg", name: "Smite", nl: false, groups: [{ tier: 2, comps, riders: [], rows: [0, 1] }],
  rows: [{ uuid: "a", name: "Ogre", tier: 2, mods: [{ kind: "resist", label: "Resist Fire", v: -3 }, { kind: "guard", label: "Guard", v: -2 }], applied: null },
    { uuid: "b", name: "Imp", tier: 2, mods: [], applied: { took: { B: 2, M: 0 }, mods: [{ kind: "resist", label: "Resist Fire", v: -3 }], state: "", factor: 1 } }] };
const html = CC.damageCardHtml(m, { author: true });
const rows = html.split(/<div class="cc-trow(?: done)?">/).slice(1).map(r => text(r));
console.log("waiting:", rows[0]);
console.log("applied:", rows[1]);
console.log("Apply and Undo share the class cc-rbtn:", (html.match(/cc-rbtn/g) ?? []).length === 2, "| the Lethal tag only in the rows:", (html.match(/cc-nl/g) ?? []).length === 2 && !/cc-applyall/.test(html));
const noTgt = CC.damageCardHtml({ ...m, rows: [], groups: [{ ...m.groups[0], rows: [] }] }, { author: true });
console.log("a card with no target keeps the tag at the bottom:", /cc-applyall[^]*Lethal/.test(noTgt));

console.log("--- a written [Mod] in a [W] term takes the weapon's subtype (Smite: [V] 1[W] + [Mod])");
const sword = { name: "Longsword", system: { subtype: "Sl", damage: { t2: { count: 1, die: "d8", mod: 0 } } } };
const ctx = { weapon: sword, tier: 2, attrVal: 2, rolls: [], empowered: 0 };
const r1 = await A.resolveInstance({ pool: "B", useW: true, wCount: 1, useAt: true, dice: "", subtype: "" }, ctx);
console.log(r1.comps.map(c => `${c.kind} ${c.total} ${c.sub || "(none)"}`).join(" + "));
const r2 = await A.resolveInstance({ pool: "M", useW: false, wCount: 1, useAt: false, dice: "1d6", subtype: "Ho" }, ctx);
console.log("[R] 1d6 Ho keeps its own:", r2.comps.map(c => `${c.kind} ${c.total} ${c.sub}`).join(" + "));
const r3 = await A.resolveInstance({ pool: "B", useW: true, wCount: 1, useAt: true, dice: "", subtype: "Fi" }, ctx);
console.log("a [W] term with its own subtype (Fi) keeps it on the [Mod]:", r3.comps.map(c => `${c.kind} ${c.sub}`).join(" + "));
const res = CC.afterResist([...r1.comps.map(c => ({ ...c, pool: "B" }))], CC.parseDmgMods("Resist 4 Slash"));
console.log("Resist 4 Slash on 3 + 2 Slash:", JSON.stringify(res));
