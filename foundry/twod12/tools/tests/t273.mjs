// Run with: node tools/tests/run.mjs (or node tools/tests/t273.mjs)
// v0.0.431 (Lucas, 2026-11-18: "Yes to card mockup"; playtest 5, C10; foundry/mockups/save-card): the Save card in the attack card's parts. Before
// the roll: the Tiers as the card writes them (the card model's labels, "Tier 1 or 2", an empty Tier 3 not written), quiet and inline (no band, no
// rider box; a Tier with damage keeps its damage line), the card's Effect line, the Roll button. One creature rolled: the attack card's stamp and
// ladder (a click opens the breakdown) and only the rolled Tier's words. Several: a row each (its Tier pill and total, or its Roll button), the
// Tiers rolled as the attack card's groups, and the quiet lines under them while one still has to roll. Rendered through cardContent.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => false } };
const CC = await import(ROOTURL + "module/chatcards.mjs");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const GM = CC.viewOf({ gm: true }), PLAYER = CC.viewOf({ gm: false, owns: () => false });
const quietOf = h => [...h.matchAll(/<div class="cc-trigger plain cc-line"><b>(Tiers? [^:]*):<\/b>([\s\S]*?)<\/div>/g)].map(m => `${m[1]}: ${txt(m[2])}`);

// Rebuke as the card writes it: its Trigger and its Effect above the Save, "Tier 1 or 2" (Tier 3 has nothing: not written)
const rebuke = {
  kind: "save", name: "Rebuke", freq: "turn", cost: "1R", tline: { targets: "One enemy", dist: "3 sq.", names: ["Orc Warrior"], retargetKind: "retargetSave" },
  saveName: "Appeal Save", dc: 13, flavor: "You call out in your god's name.",
  card: { top: [{ label: "Trigger", html: "The target moves away from you." }, { label: "Effect", html: "The target is Hindered (EoT)." }], before: [], tiers: ["Tier 1 or 2"], after: [], special: null },
  tiers: { 1: { parts: [], riders: ["Its Move Action is disrupted."] }, 2: { parts: [], riders: ["Its Move Action is disrupted."] }, 3: { parts: [], riders: [] } },
  creatures: [{ uuid: "orc", name: "Orc Warrior", result: null }]
};
console.log("--- before the roll");
const b = CC.cardContent(rebuke, GM);
console.log("the Tiers as the card writes them:", quietOf(b).join(" | "), "| no Tier 3 line:", !/<b>Tier 3:<\/b>/.test(b), "| no band, no rider box, no ranges:", !/cc-srow|cc-rider|cc-rchip|≤12/.test(b));
console.log("in the card's order (Trigger, Effect, the Save, the Tiers, the Roll button, the Flavor, the target row):", ["<b>Trigger:</b>", "<b>Effect:</b>", "cc-savehead", "<b>Tier 1 or 2:</b>", 'data-twod12="saveRoll" data-idx="0"', "cc-flavor", "cc-foot"].map(k => b.indexOf(k)).every((p, i, a) => p >= 0 && (!i || p > a[i - 1])));
console.log("its owner's Roll button:", txt(b.match(/<button[^>]*data-twod12="saveRoll"[^>]*>[^<]*<\/button>/)?.[0]), "| the others wait:", txt(CC.cardContent(rebuke, PLAYER).match(/<div class="cc-muted cc-wait">[^<]*/)?.[0]), "| no stamp yet:", !b.includes("cc-stamp"), "| the retarget:", b.includes('data-twod12="retargetSave"'));
// a Tier with damage keeps its damage line, then its rider as words (the book: "[R] 3d6 Ho; Pushed 3.")
const wor = { ...rebuke, name: "Word of Radiance", card: { top: [], before: [], tiers: ["Tier 1", "Tier 2", "Tier 3"], after: [], special: { label: "Special", html: "Against a Profane creature, the damage dice are d8s." } },
  tiers: { 1: { parts: [{ pool: "M", t: "3d6", sub: "Ho" }], riders: ["Pushed 3"] }, 2: { parts: [{ pool: "M", t: "2d6", sub: "Ho" }], riders: ["Pushed 2"] }, 3: { parts: [{ pool: "M", t: "1d6", sub: "Ho" }], riders: ["Pushed 1"] } } };
const w = CC.cardContent(wor, GM);
console.log("a Tier with damage:", quietOf(w).join(" | "), "| its damage line:", (w.match(/<span class="cc-dmgline">/g) ?? []).length, "| two riders read as words:", txt(CC.cardContent({ ...rebuke, tiers: { 1: { parts: [], riders: ["Pushed 2", "Frightened of you (1 round)"] } } }, GM).match(/<b>Tier 1 or 2:<\/b>[^<]*/)?.[0]));
console.log("no target yet:", txt(CC.cardContent({ ...rebuke, creatures: [] }, GM).match(/<div class="cc-muted cc-wait">[^<]*/)?.[0]));

console.log("--- one creature rolled");
const roll = (name, uuid, total, extra = {}) => ({ uuid, name, hasDamage: false, result: { name, uuid, total, dc: 13, dcLabel: "DC", tier: total < 13 ? 1 : total < 20 ? 2 : 3, base: total < 13 ? 1 : total < 20 ? 2 : 3, crit: false, doubles: false, d1: [Math.min(11, total - 6)], d2: [6], boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 0, label: "Appeal" }], ...extra } });
const one = CC.cardContent({ ...rebuke, creatures: [roll("Orc Warrior", "orc", 14)] }, GM);
console.log("the attack card's stamp:", txt(one.match(/<div class="cc-stamp[\s\S]*?<\/div>/)?.[0]), "| its ladder:", [...one.matchAll(/<span class="cc-seg s(\d)( lit)?">[\s\S]*?<span class="cc-sl">([^<]*)/g)].map(m => `${m[3]}${m[2] ? " (lit)" : ""}`).join(" · "), "| the total:", txt(one.match(/<span class="cc-arrow[^"]*"[^>]*><b>[^<]*/)?.[0]));
console.log("the ladder opens the breakdown:", /<button type="button" class="cc-ladder" data-cc-toggle="s0"/.test(one) && one.includes('data-cc-panel="s0"'), "| its chip:", txt(one.match(/Their Tier \d/)?.[0]), "| only the rolled Tier's words:", txt(one.match(/<div class="cc-outcome">[\s\S]*?<\/div><\/div>/)?.[0]), "| no quiet lines, no Roll button:", !one.includes("<b>Tier 1 or 2:</b>") && !one.includes("saveRoll"));
const t3 = CC.cardContent({ ...rebuke, creatures: [roll("Orc Warrior", "orc", 22, { doubles: true, crit: true, d1: [8], d2: [8], base: 3 })] }, GM);
console.log("a Tier 3 with Doubles: no Critical on a Save (the book, Chapter 1):", !/CRIT/.test(t3.match(/<div class="cc-stamp[\s\S]*?<\/div>/)?.[0] ?? "CRIT") && !t3.includes("cc-czone"), "| an empty Tier says so:", txt(t3.match(/<div class="cc-outcome">[\s\S]*?<\/div><\/div>/)?.[0]));
const dmg = CC.cardContent({ ...wor, creatures: [{ ...roll("Orc Warrior", "orc", 9), hasDamage: true }] }, GM);
console.log("with damage: its Damage button at the bottom:", /class="cc-foot">[\s\S]*data-twod12="ccSaveDamage"/.test(dmg), "| no retarget once rolled:", !dmg.includes('data-twod12="retargetSave"'), "| the rolled Tier:", txt(dmg.match(/<div class="cc-outcome">[\s\S]*?<\/div><\/div>/)?.[0]));

console.log("--- several creatures, one still to roll");
const reck = { ...rebuke, name: "Reckoning", tiers: { 1: { parts: [], riders: ["Frightened of you (1 round)."] }, 2: { parts: [], riders: ["Frightened of you (1 round)."] }, 3: { parts: [], riders: [] } },
  creatures: [roll("Orc Warrior", "orc", 9), roll("Goblin Sneak", "gob", 21), { uuid: "wisp", name: "Grave Wisp", result: null }] };
const many = CC.cardContent(reck, CC.viewOf({ gm: false, owns: u => u === "wisp" }));
console.log("a row each:", [...many.matchAll(/<div class="cc-crow">(<span class="cc-pill[^"]*">[^<]*<\/span>)<span class="cc-cname">([^<]*)<\/span><span class="cc-cdef">([\s\S]*?)<\/span>(?=<div class="cc-break|<\/div>)/g)].map(m => `${txt(m[1]) || "-"} ${m[2]}: ${txt(m[3])}`).join(" | "));
console.log("each rolled total opens its roll:", ["s0", "s1"].every(id => many.includes(`data-cc-toggle="${id}"`) && many.includes(`data-cc-panel="${id}"`)), "| the Roll button on the third row:", many.includes('data-twod12="saveRoll" data-idx="2"'), "| another player waits:", (CC.cardContent(reck, PLAYER).match(/Waiting/g) ?? []).length);
console.log("the Tiers rolled as the attack card's groups:", [...many.matchAll(/<div class="cc-tgroup"><div class="cc-ghd">([\s\S]*?)<\/div>([\s\S]*?)<\/div>(?=<div class="cc-tgroup"|<\/div>)/g)].map(m => `${txt(m[1])}: ${txt(m[2])}`).join(" | "));
console.log("the quiet lines under them while one still has to roll:", many.indexOf("cc-groups") < many.indexOf("<b>Tier 1 or 2:</b>"), "| all rolled: only the Tiers rolled:", !CC.cardContent({ ...reck, creatures: [...reck.creatures.slice(0, 2), roll("Grave Wisp", "wisp", 15)] }, GM).includes("<b>Tier 1 or 2:</b>"));

console.log("--- no new look");
const css = fs.readFileSync(ROOT + "styles/system.css", "utf8");
const classesOf = h => [...new Set(h.match(/class="[^"]*"/g).flatMap(c => c.slice(7, -1).split(/\s+/)).filter(c => /^cc-/.test(c)))].sort();
const classes = classesOf([b, w, one, t3, dmg, many].join(""));
// the attack card's own parts, one target and several (its classes have their look, with a rule of their own or as a wrapper)
const arow = (name, uuid, total) => ({ name, uuid, total, dc: 13, dcLabel: "AD", tier: total < 13 ? 1 : total < 20 ? 2 : 3, base: total < 13 ? 1 : total < 20 ? 2 : 3, crit: false, doubles: false, d1: [7], d2: [5], boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Weapon" }] });
const atk = { kind: "attack", name: "Smite", freq: "encounter", cost: "2 AP", tline: { targets: "One creature", dist: "Weapon", names: ["Orc Warrior"] }, hasDamage: true, flavor: "Holy light.",
  card: { top: [{ label: "Trigger", html: "An ally is hit." }], before: [], tiers: ["Tier 1", "Tier 2", "Tier 3"], after: [], special: null },
  outcomes: { 1: { parts: [], riders: [] }, 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }], riders: ["Pushed 1"] }, 3: { parts: [{ pool: "M", t: "2d8", sub: "Ho" }], riders: ["Prone"] } } };
const attackClasses = new Set(classesOf(CC.cardContent({ ...atk, rows: [{ ...arow("Orc Warrior", "o", 15), d1: [6], d2: [6], doubles: true, tier: 3 }] }, GM) + CC.cardContent({ ...atk, rows: [arow("Orc Warrior", "o", 9), arow("Goblin Sneak", "g", 21)], shared: { d: [[7], [5]], mod: 2 } }, GM)));
const oldSave = ["cc-save", "cc-savehead", "cc-rule", "cc-sres", "cc-stotal", "cc-wait", "cc-btns", "cc-none"];   // the Save card's own parts before v0.0.431 (its Save line, its total, its waiting line, "No effect.")
console.log("the card's classes:", classes.length, "| not the attack card's or the Save card's before:", classes.filter(c => !attackClasses.has(c) && !oldSave.includes(c)).join(", ") || "none",
  "| without CSS and not the attack card's:", classes.filter(c => !attackClasses.has(c) && !new RegExp(`\\.${c}(?![\\w-])`).test(css)).join(", ") || "none");
console.log("the old Tier band is gone from the Save card:", !/cc-srow|cc-scell|cc-sbody/.test(fs.readFileSync(ROOT + "module/chatcards.mjs", "utf8").match(/export function saveCardHtml[\s\S]*?\n}\n/)[0]));
