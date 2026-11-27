// Run with: node tools/tests/run.mjs (or node tools/tests/t331.mjs)
// v0.0.533 (Lucas, 2026-11-27: foundry/mockups/roll-breakdown, design C, "the written sum"): the roll card's breakdown (chatcards.mjs rollSumModel,
// rollSumCancel, breakdownHtml): the count, the cancelling's words, an entry over its name's limit, Favored and Doomed, a Save's turned-around Banes,
// the total line (Doubles, a Critical, hidden Defenses), the Applied line, a card posted before v0.0.533; actions.mjs stateSources.
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
void fileURLToPath;
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const CC = await import(ROOTURL + "module/chatcards.mjs");
const A = await import(ROOTURL + "module/actions.mjs");
const txt = h => String(h).replace(/<span class="cc-sr">[^<]*<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const ent = m => m.entries.map(e => `${e.counted === 0 ? "0" : (e.side === "boon" ? "+" : "−") + e.counted} ${e.name || "(no name)"}${e.kind ? ` [${e.kind}]` : ""}${e.special ? ` <${e.special}>` : ""}`).join(" | ");
const show = (label, r, o = {}) => { const m = CC.rollSumModel(r, o); console.log(`${label}: dice ${m.diceSum}${m.note ? ` (${m.note})` : ""} | mods ${m.mods.map(x => `${x.v} ${x.label}`).join(", ")} | ${ent(m) || "no Boon or Bane"} | B ${m.B} N ${m.N} adds ${m.add}${m.state ? ` ${m.state}` : ""} | words: ${txt(CC.rollSumCancel(m)) || "-"} | total ${m.total}`); return m; };
const W = [{ v: 2, label: "Weapon" }, { v: 0, label: "Situational" }];

console.log("--- the count and the cancelling (Lucas's picture: 3 + 11 + 2, two Boons, two Banes)");
const pic = { d1: [3], d2: [11], total: 16, dc: 14, dcLabel: "AD", tier: 2, base: 2, boonFaces: [1, 1], baneFaces: [1, 1], mods: W,
  sources: [{ name: "Shifting Aim", boons: 1, bb: "field" }, { name: "Vulnerable 1 (Goblin Sneak)", boons: 1, bb: "" }, { name: "Low cover (Goblin Sneak)", banes: 1, bb: "field" }, { name: "Engaged with Aveline", banes: 1, bb: "field" }] };
show("the picture", pic);
const html = CC.breakdownHtml(pic, { id: "r0" });
console.log("its lines:", txt(html));
console.log("closed at first, opened by the ladder's id:", html.startsWith('<div class="cc-break cc-rb" data-cc-panel="r0">'), "| open:", CC.breakdownHtml(pic, { open: true }).startsWith('<div class="cc-break cc-rb open"'), "| no hover text:", !/title=|data-tooltip/.test(html), "| no button inside:", !html.includes("<button"));
console.log("every line starts with its number:", [...html.matchAll(/<span class="cc-rb-n(?: [^"]*)?">(?:<b class="cc-total">)?([^<]*)/g)].map(m => m[1]).join(" "), "| each entry too:", [...html.matchAll(/<span class="cc-rb-en">([^<]*)<\/span><span class="cc-rb-nm">([^<]*)/g)].map(m => `${m[1]} ${m[2].trim()}`).join(", "));
show("no Boon, no Bane", { d1: [9], d2: [10], total: 22, dc: 15, tier: 3, base: 3, boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 3, label: "Weapon" }] });
show("one side only", { d1: [6], d2: [6], total: 15, dc: 14, tier: 3, base: 2, doubles: true, boonFaces: [1], baneFaces: [], sources: [{ name: "Flanking with Durgan", boons: 1, bb: "field" }], mods: W });

console.log("--- over a name's limit: struck through, its number 0, its reason");
const many = { d1: [5], d2: [8], total: 16, dc: 14, tier: 2, base: 2, boonFaces: [1, 1, 1, 1], baneFaces: [1, 1, 1], mods: W,
  sources: [{ name: "Flanking with Durgan", boons: 1, bb: "field" }, { name: "Prone (Goblin Sneak)", boons: 1, bb: "field" }, { name: "Shifting Aim", boons: 1, bb: "field" }, { name: "War cry", boons: 1, bb: "support" }, { name: "Vulnerable 1", boons: 1 },
    { name: "Engaged with Ogre Chieftain", banes: 1, bb: "field" }, { name: "Low cover", banes: 1, bb: "field" }, { name: "Far range", banes: 1 }] };
show("five Boons, three Banes", many);
console.log("the third Field:", (CC.breakdownHtml(many).match(/<span class="cc-rb-e off">[\s\S]*?<\/span><\/span>/) ?? [""])[0].replace(/<span class="cc-sr">[^<]*<\/span>/g, ""));
show("a Field source of 3 (2 of 3 count)", { d1: [5], d2: [5], total: 14, dc: 13, tier: 3, base: 2, doubles: true, boonFaces: [1, 1], baneFaces: [], sources: [{ name: "Wall of spears", boons: 3, bb: "field" }], mods: [{ v: 2, label: "Weapon" }] });
console.log("its words:", txt(CC.breakdownHtml({ d1: [5], d2: [5], total: 14, dc: 13, tier: 3, base: 2, doubles: true, boonFaces: [1, 1], baneFaces: [], sources: [{ name: "Wall of spears", boons: 3, bb: "field" }], mods: [{ v: 2, label: "Weapon" }] }).match(/<div class="cc-rb-sub">[\s\S]*?<\/div>/)[0]));

console.log("--- Favored and Doomed (3d12, one dropped; a source counts 5 once; 5 or more left)");
const fav = show("Favored by a source", { d1: [9], d2: [10], dropped: [4], state: "favored", five: "", total: 21, dc: 14, tier: 3, base: 3, boonFaces: [], baneFaces: [], mods: W,
  sources: [{ name: "Hidden", boons: 0, banes: 0, bb: "", fav: true }, { name: "Flanking with Durgan", boons: 1, bb: "field" }, { name: "Low cover", banes: 1, bb: "field" }] });
console.log("its dice:", fav.dice.map(d => `${d.faces.join("→")}${d.off ? " dropped" : ""}${d.dbl ? " dbl" : ""}`).join(", "), "| the Favored line:", txt(CC.breakdownHtml({ d1: [9], d2: [10], dropped: [4], state: "favored", total: 21, dc: 14, tier: 3, base: 3, sources: [{ name: "Hidden", fav: true }], mods: W }).match(/<div class="cc-rb-sub">[\s\S]*?<\/div>/)[0]));
show("Doomed by a source", { d1: [8], d2: [3], dropped: [11], state: "doomed", total: 13, dc: 14, tier: 1, base: 1, boonFaces: [], baneFaces: [], mods: W,
  sources: [{ name: "Shifting Aim", boons: 1, bb: "field" }, { name: "You are Engaged (Doomed)", doom: true }, { name: "Far range", banes: 1 }] });
show("five Banes left (no source)", { d1: [6], d2: [7], dropped: [12, 3], state: "doomed", five: "doomed", total: 15, dc: 13, tier: 2, base: 2, boonFaces: [], baneFaces: [], mods: W,
  sources: [{ name: "Engaged", banes: 2 }, { name: "Far", banes: 2 }, { name: "Frightened", banes: 1 }] });
show("Favored and Doomed cancel", { d1: [6], d2: [7], total: 15, dc: 13, tier: 2, base: 2, boonFaces: [], baneFaces: [], mods: W, sources: [{ name: "Hidden", fav: true }, { name: "High cover (Doomed)", doom: true }] });
show("two Favored sources (5 once)", { d1: [9], d2: [10], dropped: [4], state: "favored", total: 21, dc: 14, tier: 3, base: 3, boonFaces: [], baneFaces: [], mods: W, sources: [{ name: "Hidden", fav: true }, { name: "Situational", fav: true }] });
show("Favored, posted before v0.0.533 (no source named)", { d1: [9], d2: [10], dropped: [4], state: "favored", five: "", total: 21, dc: 14, tier: 3, base: 3, boonFaces: [], baneFaces: [], mods: W, sources: [{ name: "Hidden", boons: 0, banes: 0, bb: "" }] });
show("three of a kind, Favored", { d1: [7], d2: [7], dropped: [7], state: "favored", total: 16, dc: 14, tier: 3, base: 2, crit: true, triple: true, doubles: true, boonFaces: [], baneFaces: [], mods: W, sources: [{ name: "Hidden", fav: true }] });

console.log("--- a Save: the target rolls; the user's Banes turned into the target's Boons (inline.mjs saveExtraMods: \"Caster's Banes\")");
const sv = { name: "Goblin Archer", d1: [7], d2: [5], total: 15, dc: 14, dcLabel: "DC", tier: 2, base: 2, boonFaces: [1, 1, 1], baneFaces: [1], mods: [{ v: 1, label: "Instinct" }, { v: 0, label: "Situational" }],
  sources: [{ name: "Caster's Banes", boons: 2 }, { name: "Low cover", boons: 1, bb: "field" }, { name: "Vulnerable 1", banes: 1 }] };
show("Instinct Save", sv, { save: true });
console.log("its lines:", txt(CC.breakdownHtml(sv, { save: true, lead: "Goblin Archer rolls" })), "| a Tier 3 with Doubles: no Critical:", txt(CC.breakdownHtml({ ...sv, d1: [9], d2: [9], total: 22, tier: 3, base: 3, doubles: true, crit: true }, { save: true }).match(/<span class="cc-rb-res">[\s\S]*?<\/span><\/span>/)[0]));
show("the caster Doomed: 5 Boons on the Save", { d1: [7], d2: [5], dropped: [9], state: "favored", five: "favored", total: 17, dc: 14, tier: 2, base: 2, boonFaces: [], baneFaces: [], mods: [{ v: 1, label: "Instinct" }], sources: [{ name: "Caster Doomed", boons: 5 }] }, { save: true });

console.log("--- the total line: Doubles, a Critical, hidden Defenses, forced, the Applied line");
const end = (r, o = {}) => txt(CC.breakdownHtml(r, o).match(/<span class="cc-rb-n cc-rb-tot">[\s\S]*$/)[0]);
console.log("Doubles raise:", end({ d1: [6], d2: [6], total: 15, dc: 14, dcLabel: "AD", tier: 3, base: 2, doubles: true, sources: [], mods: W }));
console.log("a Critical (Doubles on a Tier 3):", end({ d1: [10], d2: [10], total: 23, dc: 15, dcLabel: "AD", tier: 3, base: 3, doubles: true, crit: true, sources: [], mods: [{ v: 3, label: "Weapon" }] }));
console.log("a Critical by 20 over:", end({ d1: [12, 12, 7], d2: [5], total: 36, dc: 13, dcLabel: "AD", tier: 3, base: 3, crit: true, sources: [], mods: W }), "| hidden:", end({ d1: [12, 12, 7], d2: [5], total: 36, dc: 13, dcLabel: "AD", tier: 3, base: 3, crit: true, sources: [], mods: W }, { hide: true }));
console.log("hidden Defense: the badge keeps its word:", (CC.breakdownHtml(pic, { hide: true }).match(/<span class="cc-badge[^"]*">[^<]*<\/span>/) ?? [""])[0], "| a Save's DC is never hidden:", (CC.breakdownHtml(sv, { hide: true, save: true }).match(/<span class="cc-badge[^"]*">[^<]*<\/span>/) ?? [""])[0]);
console.log("no target: DC 13:", end({ d1: [4], d2: [5], total: 11, dc: 13, dcLabel: "DC", tier: 1, base: 1, sources: [], mods: [{ v: 2, label: "Signature" }] }), "| forced:", end({ d1: [4], d2: [5], total: 11, dc: 13, dcLabel: "DC", tier: 2, base: 2, forced: true, sources: [], mods: [] }));
console.log("an exploded die:", txt(CC.breakdownHtml({ d1: [12, 6], d2: [4], total: 24, dc: 15, tier: 3, base: 3, sources: [], mods: [{ v: 3, label: "Weapon" }] }).match(/<div class="cc-rb-t">[\s\S]*?<\/div>/)[0]), "| the Flat as its own line:", txt(CC.breakdownHtml({ ...pic, total: 17, mods: [{ v: 2, label: "Weapon" }, { v: 1, label: "Situational" }] }).match(/<span class="cc-rb-n">\+1<\/span><div class="cc-rb-t">[^<]*/)[0]));
const ap = CC.breakdownHtml(pic, { applied: [{ name: "Killer's Focus", uuid: "Item.kf" }] });
console.log("Applied, under the total:", txt(ap.match(/<div class="cc-rb-app">[\s\S]*?<\/div>/)[0]), "| a link:", ap.includes('data-uuid="Item.kf"'), "| after the sum:", ap.indexOf("cc-rb-app") > ap.indexOf("cc-rb-tot"));
console.log("an unnamed Boon counted by hand before v0.0.292:", ent(CC.rollSumModel({ d1: [6], d2: [7], total: 17, dc: 13, tier: 2, base: 2, boonFaces: [1, 1], baneFaces: [], sources: [{ name: "Flanking", boons: 1 }], mods: W })));
console.log("the parts reach the roll's total:", [pic, many, sv].every(r => { const m = CC.rollSumModel(r); return m.diceSum + m.mods.reduce((s, x) => s + x.v, 0) + m.add === r.total; }));

console.log("--- actions.mjs stateSources: the sources that made a roll Favored or Doomed, by name, stored with the roll");
console.log(JSON.stringify(A.stateSources(["Hidden (Favored)", "Hidden", "Situational", ""], ["High cover (Doomed)"])));
console.log("ccRowOf keeps them:", JSON.stringify(A.ccRowOf({ total: 21, dc: 14, tier: 3, d1: [9], d2: [10], sources: [{ name: "Hidden", boons: 0, banes: 0, bb: "", fav: true }] }, "Goblin Sneak", "").sources));
