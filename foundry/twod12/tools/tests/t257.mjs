// Run with: node tools/tests/run.mjs (or node tools/tests/t257.mjs)
// v0.0.411 (pack F3 part 1, the Archer in Foundry): the redesigned Archer's cards and class from book/cards/stage0/archer.json, the turn's Strike
// state (Shifting Aim, Blade and Bow, One More Arrow), Fleet, Clear Lines, Opening Shot, Thrill of the Kill, the moment "would enter a square
// adjacent to you" (Slip Away, Snap Shot), Spotter's Call Out, the traits Projectile and Firearm, the migration's list.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [] }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = n => fs.readFileSync(ROOT + n, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const doc = (n, t) => C.docs.find(d => d.name === n && (!t || d.type === t));
const nameOf = u => C.docs.find(d => [C.uuidOf("actions", d.name), C.uuidOf("features", d.name)].includes(u))?.name ?? "?";

console.log("--- the class and the cards");
const arc = doc("Archer", "class").system;
arc.levels.forEach((l, i) => console.log(`Level ${i + 1}:`, l.sections.filter(x => x.kind !== "attr").map(x => `${x.title}${x.items.length ? `: ${x.items.map(nameOf).join(", ")}` : ""}`).join(" | ")));
console.log("Light armor, Weapon +2 / Power +1, Speed +1:", arc.armorTraining, arc.modHigh, arc.modLow, arc.modOrder, arc.speedMod);
const s = n => doc(n, "action").system;
console.log("Quick Shots' Tiers:", ["t1", "t2", "t3"].map(t => s("Quick Shots").versions[0][t].map(i => (i.useW ? `${i.wCount}[W]` : "") + (i.useAt ? "Mod" : "")).join("+")).join(" / "), "| traits:", s("Quick Shots").traits.join(","), "| Critical:", s("Quick Shots").versions[0].critical);
console.log("Snap Shot and Slip Away:", ["Snap Shot", "Slip Away"].map(n => `${n} ${s(n).reactionKind} ${s(n).moment}`).join(" | "), "| Volley:", s("Volley").areaCfg.shape, s("Volley").areaCfg.size, s("Volley").versions[0].after);
console.log("the Arts' Modes:", ["Footwork", "Trick Shots", "Spotter"].map(n => `${n}: ${s(n).versions.map(v => v.mode).join("/")}`).join(" | "), "| Weave ignores terrain:", s("Footwork").versions[1].effects.includes("terrain:ignore"));
console.log("the hooks:", ["Shifting Aim", "Lean and Loose", "Blade and Bow", "Clear Lines", "Opening Shot", "One More Arrow", "Fleet"].map(n => `${n} ${(doc(n, "feature").system.hooks ?? []).map(h => h.kind).join(",")}`).join(" | "), "| Thrill of the Kill:", JSON.stringify(doc("Thrill of the Kill", "feature").system.settings.map(x => [x.type, x.hookWhen])));
console.log("Covering Fire's Zone:", JSON.stringify(doc("Covering Fire", "effect").system.zone.inside.ht.list), doc("Covering Fire", "effect").system.ends.time.rounds, "rounds | Spotter's effects:", ["Called-Out", "Find the Gap", "Keep Low"].every(n => doc(n, "effect")));
console.log("no quarry in the compendium (but the old cards' folder):", !C.docs.some(d => /Quarry/.test(d.name) && !/old cards/.test(d.folder ?? "")), "| the pregens:", C.pcs.filter(p => /Archer/.test(p.name) && !/level 1/.test(p.name)).map(p => `${p.name.split(" ")[0]}: ${p.items.filter(i => ["action", "feature"].includes(i.type) && !i.flags?.twod12?.basic).map(i => i.name).join(", ")}`).join(" || "));
console.log("Projectile and Firearm (the keys stay shot and gun):", (await import(ROOTURL + "module/config.mjs")).TWOD12.traits.shot, (await import(ROOTURL + "module/config.mjs")).TWOD12.traits.gun);

console.log("--- the turn's Strike state (hooks.mjs)");
const H = await import(ROOTURL + "module/hooks.mjs");
const moved = [{ hook: { kind: "movedBoon", traits: ["ranged", "strike"], boons: 1, bb: "field" }, item: { name: "Shifting Aim" } }], alt = [{ hook: { kind: "alternateBoon", boons: 1 }, item: { name: "Blade and Bow" } }];
const T = (...t) => new Set(t);
console.log("a fresh turn:", JSON.stringify(H.stateNow(null, "k")), "| another turn's state is fresh:", H.stateNow({ key: "j", moved: true }, "k").moved === false);
console.log("moved, a ranged Strike:", JSON.stringify(H.strikeChips(moved, alt, T("ranged", "strike", "weapon"), { moved: true, last: "" })), "| not moved:", H.strikeChips(moved, alt, T("ranged", "strike"), { moved: false, last: "" }).length);
console.log("a melee Strike after a ranged one:", JSON.stringify(H.strikeChips([], alt, T("melee", "strike"), { last: "ranged", altUsed: false })), "| spent:", H.strikeChips([], alt, T("melee", "strike"), { last: "ranged", altUsed: true }).length, "| the same kind:", H.strikeChips([], alt, T("ranged", "strike"), { last: "ranged" }).length);
console.log("strikeKind:", H.strikeKind(T("melee", "strike")), H.strikeKind(T("ranged", "strike")), JSON.stringify(H.strikeKind(T("ranged"))));

console.log("--- Slip Away and Snap Shot (moment.mjs), Spotter (senses.mjs), the migration");
const M = await import(ROOTURL + "module/moment.mjs");
const path = [{ x: 5 }, { x: 4 }, { x: 3 }, { x: 2 }, { x: 1 }], dist = (r, p) => p.x;
console.log("the moment:", JSON.stringify(M.MOMENTS.enemyAdjacent), "| it comes back to the square before the first adjacent one:", JSON.stringify(M.backSquareIndices(path, [{ moment: "enemyAdjacent", range: 5 }], dist)));
const SE = await import(ROOTURL + "module/senses.mjs");
console.log("Called Out:", ["hidden", "obscured", "clear", "unsensed"].map(l => `${l}→${SE.calledOut([l, "x"])[0]}`).join(" "));
const MG = await import(ROOTURL + "module/migrater.mjs");
console.log("the Archer migration's list:", MG.archerLeftovers([{ name: "Mark Quarry", type: "action" }, { name: "Volley", type: "action" }, { name: "Killer's Focus", type: "feature" }, { name: "Overwatch", type: "action" }]).join(", "));

console.log("--- the wiring");
const ac = src("module/actions.mjs"), cv = src("module/cover.mjs"), mv = src("module/move.mjs"), mk = src("module/mark.mjs"), dm = src("module/damage.mjs"), ri = src("module/rollinput.mjs");
console.log("the roll dialog's chips, the Strike noted:", ri.includes("strikeHookChipsFor(actor, c.useTraits)") && ac.includes("noteStrike(actor, useTraits)"), "| One More Arrow:", ac.includes("takeMoreW(actor)") && ac.includes("withMoreW("), "| Fleet:", mv.includes('activeHooks(actor, "evadeMore")'));
console.log("Clear Lines (Cover, the Engaged Bane):", cv.includes("clearLinesOf(attacker)") && ac.includes('activeHooks(actor, "clearLines")'), "| Opening Shot:", ac.includes('activeHooks(actor, "openingShot")'), "| Thrill of the Kill (who damaged it):", dm.includes("noteHurtBy(actor, by)") && mk.includes('x.when === "damagedDown"'), "| Lean and Loose:", ac.includes('h.hook.basic === item.getFlag?.("twod12", "basic")'));
