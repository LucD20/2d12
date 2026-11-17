// Run with: node tools/tests/run.mjs (or node tools/tests/t258.mjs)
// v0.0.412 (pack F3 part 2, the bows and the swords in Foundry): the book's weapon table (Arming Sword, Longsword, Hunting Bow, Recurve Bow), the
// traits Light and Strung, the Banes of the hands (off hand, Light, Strung, Fists), the Weapon Groups, the four redesigned Weapon Techniques from
// book/cards/stage0/gear.json (the old ones dropped), Pressed, "at least one hand free", "you haven't left your square this turn", the book's links
// unwrapped into buttons.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [] }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = n => fs.readFileSync(ROOT + n, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const L = await import(ROOTURL + "module/loadout.mjs");
const K = await import(ROOTURL + "module/config.mjs");
const M = await import(ROOTURL + "module/mastery.mjs");
const H = await import(ROOTURL + "module/hooks.mjs");
const HA = await import(ROOTURL + "module/hands.mjs");
const G = await import(ROOTURL + "module/gen.mjs");
const doc = (n, t) => C.docs.find(d => d.name === n && (!t || d.type === t));
const dmg = d => ["t1", "t2", "t3"].map(t => { const x = d.system.damage?.[t] ?? {}; return `${x.count || ""}${x.die || ""}${x.mod ? "+" + x.mod : ""}` || "0"; }).join("/");
const tr = d => [...(d?.system?.traits ?? [])].sort().join(",");

// the weapons, by the book's table
for (const n of ["Arming Sword", "Longsword", "Hunting Bow", "Recurve Bow", "Dagger"]) {
  const w = doc(n, "weapon");
  console.log(n, "|", w ? `${dmg(w)} | traits ${tr(w)} | hands ${w.system.hands ?? 1}` : "missing");
}
console.log("gone (replaced):", ["Greatsword", "Shortbow", "Longbow"].filter(n => doc(n, "weapon")).join(", ") || "none");
console.log("traits:", K.TWOD12.weaponTraits.light, "/", K.TWOD12.weaponTraits.strung, "| help:", !!K.TWOD12.traitHelp?.light, !!K.TWOD12.traitHelp?.strung);
console.log("groups:", ["Arming Sword", "Longsword", "+1 Longsword", "Hunting Bow", "Recurve Bow", "Dagger", "Odd Stick"].map(n => `${n}: ${M.weaponGroupOf({ name: n, system: {} }) || "-"}`).join(" | "));

// the hands' Banes
const w = (id, o = {}) => ({ id, name: o.name ?? id, system: { wielded: true, hands: o.hands ?? 1, hand: o.hand ?? "", traits: new Set(o.traits ?? []) } });
const sword = w("sword", { name: "Arming Sword", hand: "main" }), knife = w("knife", { name: "Dagger", hand: "off", traits: ["light"] }), axe = w("axe", { name: "Handaxe", hand: "off" });
const bow = w("bow", { name: "Hunting Bow", hand: "main", traits: ["strung", "projectile"] }), long = w("long", { name: "Longsword", hands: 2, traits: ["twohanded"] });
console.log("main hand:", JSON.stringify(L.handBanes([sword, knife], sword)));
console.log("off hand, Light:", JSON.stringify(L.handBanes([sword, knife], knife)));
console.log("off hand:", JSON.stringify(L.handBanes([sword, axe], axe)));
console.log("both hands:", JSON.stringify(L.handBanes([long], long)));
console.log("Strung, other hand free:", JSON.stringify(L.handBanes([bow], bow)), "| other hand full:", JSON.stringify(L.handBanes([bow, knife], bow)));
console.log("Strung in the off hand, the other free:", JSON.stringify(L.handBanes([{ ...bow, system: { ...bow.system, hand: "off" } }], { ...bow, system: { ...bow.system, hand: "off" } })));
console.log("Fists, main hand free:", JSON.stringify(L.handBanes([knife], null, true)), "| only the off hand free:", JSON.stringify(L.handBanes([sword], null, true)));
const act = src("module/actions.mjs");
console.log("used on every [Strike, Weapon] roll:", act.includes("handBanes(") && act.includes("[...handMods]"));

// the four redesigned Weapon Techniques (stage0/gear.json), the old ones dropped
for (const n of ["Wounding Shot", "Circling Shot", "Seizing Cut", "Thwart Cut"]) {
  const d = doc(n, "action");
  console.log(n, "|", d ? `${d.system.category} | ${d.system.automation} | requires: ${d.system.requirements || "-"}` : "missing");
}
console.log("dropped:", ["Skirmish Shot", "Heartseeker", "Guarded Cut", "Reaping Sweep"].filter(n => doc(n, "action")).join(", ") || "none");
const byUuid = u => C.docs.find(d => d.type === "action" && C.uuidOf("actions", d.name) === u)?.name ?? u;
console.log("weapons point to them:", ["Arming Sword", "Longsword", "Hunting Bow", "Recurve Bow"].map(n => `${n}: ${(doc(n, "weapon")?.system?.actions ?? []).map(byUuid).join(", ")}`).join(" | "));

// Pressed, a free hand, a square not left
const pr = doc("Pressed");
console.log("Pressed:", pr ? `${pr.type} | valued ${!!pr.system.valued} | ${JSON.stringify(pr.system.settings)}` : "missing");
console.log("a hand free:", HA.needsFreeHand({ system: { requirements: "You have at least one hand free" } }), HA.needsFreeHand({ system: { requirements: "A free hand" } }), HA.needsFreeHand({ system: { requirements: "A Light weapon" } }));
console.log("square not left:", H.needsStayed("You haven't left your square this turn"), H.needsStayed("You moved this turn"), "| stateNow keeps it:", JSON.stringify(H.stateNow(null, "k")));

// the book's links become buttons
const out = G.convertEffects("The target is @Book[Pressed]{Pressed} 1 and @Book[Bleed]{Bleed} 2; it is @Book[Prone]{Prone}.");
console.log("links unwrapped:", !out.includes("@Book[Pressed]"), !out.includes("@Book[Bleed]"), !out.includes("@Book[Prone]"));

// Shifting Aim's Starting Mastery, the pregens' bows
const sa = doc("Shifting Aim");
console.log("Shifting Aim's Starting Mastery:", JSON.stringify((sa?.system?.settings ?? []).filter(s => s.type === "mastery").map(s => [s.mstTrait, s.mstValue])));
for (const n of ["Aveline", "Sylwen", "Kaela"]) {
  const p = C.pcs.find(d => d.name.startsWith(n + " ("));
  console.log(n, "carries:", (p?.items ?? []).filter(i => i.type === "weapon").map(i => i.name).join(", "));
}

// the weapons migration: the old weapons on characters become the book's (asked once; their Mastery moves with them)
globalThis.foundry.applications.api.DialogV2 ??= {};
const MG = await import(ROOTURL + "module/migrater.mjs");
console.log("old weapons:", [["Shortbow"], ["Longbow"], ["Greatsword"], ["Longsword", []], ["Longsword", ["twohanded", "melee"]], ["Dagger"]].map(([n, t]) => `${n}${t?.includes("twohanded") ? " (2H)" : ""} -> ${MG.oldWeaponSwap(n, t) || "stays"}`).join(" | "));
const mg = src("module/migrater.mjs"), gr = src("module/grants.mjs"), tw = src("module/twod12.mjs");
console.log("asked in the pick window, after the Archer's:", mg.includes('confirm: "Replace"') && mg.includes("get(F, \"migratedF3\") !== DONE_F3) return; } catch (e) { return; }\n    await migrateWeapons()"), "| the new weapon in the old one's place, its Technique, the old one's gone:", gr.includes("export async function replaceWeapon") && gr.includes('await grantActions(actor, fresh.system.actions'), "| registered:", tw.includes("registerMigrationWeapons();") && tw.includes("migrateWeapons: ()"));
