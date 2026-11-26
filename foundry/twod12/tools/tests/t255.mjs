// Run with: node tools/tests/run.mjs (or node tools/tests/t255.mjs)
// v0.0.409 (pack F2, the Paladin in Foundry): the Structure cards read for Foundry (book/cards/load.mjs fromStructure), an Art's Modes (split.mjs),
// Smite's dice and Profane (judge.mjs), the passives' hooks (hooks.mjs), Rebuke's "moves away" (moment.mjs), the new buttons (gen.mjs), Half-Blinded,
// Consecrated Ground's Guard row, and the wiring in the code (the Paladin migration: gone in v0.0.527, F-033; Judge's reduction: gone in v0.0.527).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) }, data: { fields: {} } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [] }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => false } };
const src = n => fs.readFileSync(ROOT + n, "utf8");
const L = await import(ROOTURL + "../../book/cards/load.mjs");

console.log("--- the Structure for Foundry (load.mjs)");
const body = L.readBody([{ label: "Attack", text: "Weapon vs. Armor Defense" }, { label: "Tier 1", text: "[R] 1d6 Ho." }, { label: "Tier 1 or 2", text: "Prone." }, { label: "Effect", text: "A." }, { label: "Special", text: "B." }, { label: "Judged", text: "C." }, { label: "Save", text: "Appeal" }]);
console.log("readBody:", JSON.stringify({ vs: body.vs, tiers: body.tiers, or: body.or, seq: body.seq, rules: body.rules }));
const st = L.loadStructure().__proto__ ? L.loadStructure() : {};
console.log("the Structure files:", Object.keys(st).join(", "), "| Foundry reads:", JSON.stringify(L.FOUNDRY_STRUCTURE));
const fc = L.loadFoundryCards(), old = L.loadCards();
console.log("Foundry's cards: no card of the old paladin.json:", !fc.some(c => c._file === "paladin.json"), "| the ruler still reads it:", old.some(c => c._file === "paladin.json"), "| every stage0 Paladin card:", st["paladin.json"].every(c => fc.some(x => x.name === c.name)));
const by = n => fc.find(c => c.name === n);
console.log("Judge (two blocks, Special first):", JSON.stringify(by("Judge").versions.map(v => [v.ap, v.effects.slice(0, 40)])));
console.log("Rebuke (Save, Tier 1 or 2, Effect):", JSON.stringify(by("Rebuke").versions[0]), by("Rebuke").vs, by("Rebuke").trigger);
console.log("Binding Light's Tier 1 is damage (the final period dropped):", by("Binding Light").versions[0].tiers[0]);
console.log("Lantern of Faith's Modes:", by("Lantern of Faith").versions.map(v => `${v.mode}${v.modeTraits ? `[${v.modeTraits}]` : ""}${v.modeDistance ? ` ${v.modeDistance}` : ""}${v.modeTargets ? ` (${v.modeTargets})` : ""}${v.modeVs ? ` vs ${v.modeVs}` : ""}`).join(" | "));
console.log("Smite's Foundry tiers and dice rule:", by("Smite").versions[0].tiers.join(" / "), "|", by("Smite").versions[0].foundry?.diceRule, "| no foundry.tiers left on the Version:", by("Smite").versions[0].foundry?.tiers === undefined);
console.log("a Passive is a Feature's text:", by("Armor of Faith").text, "| its rung:", by("Armor of Faith").escalation);

console.log("--- an Art's Modes (split.mjs)");
const S = await import(ROOTURL + "module/split.mjs");
const art = { name: "Lantern of Faith", system: { traits: new Set(["divine"]), distance: "self", targets: "", vs: "", versions: [{ ap: 1, mode: "Kindle" }, { ap: 1, mode: "Glare", modeTraits: ["magic", "save"], modeDistance: "5", modeTargets: "One enemy you can see", modeVs: "instinct" }] } };
console.log("the Modes:", S.artModes(art).join(", "), "| a Split Action's modes are not Modes:", S.artModes({ system: { versions: [{ mode: "weapon" }, { mode: "power" }] } }).length);
const g = S.modeView(art, "Glare");
console.log("Glare as used:", [...g.system.traits].join(","), g.system.distance, g.system.targets, g.system.vs, g.system.versions.length, g.splitMode, "| Kindle keeps the card's:", S.modeView(art, "Kindle").system.distance, [...S.modeView(art, "Kindle").system.traits].join(","));

console.log("--- Smite's dice and Profane (judge.mjs)");
const J = await import(ROOTURL + "module/judge.mjs");
console.log("Smite dice by Escalation:", [1, 2, 4, 6].map(e => J.smiteDice(e)).join(" "), "| Profane:", J.smiteDice(3, 0, true), "| Tier 3 (1d6! -> 2d6!) at 4:", J.ruledDice("2d6!", "smite", { escalation: 4 }), "| with the Reaction AP:", J.ruledDice("2d6!", "smite", { escalation: 4, more: true, profane: true }));
console.log("Word of Radiance against a Profane creature:", J.ruledDice("3d6", "profane", { profane: true }), "| not:", J.ruledDice("3d6", "profane", {}), "| another die stays:", J.ruledDice("1d4", "smite", { escalation: 3 }));
console.log("the Profane Tag:", J.hasProfaneTag({ system: { tags: new Set(["profane"]) } }), J.hasProfaneTag({ system: { tags: new Set(["undead"]) } }, { undead: "Undead" }), J.hasProfaneTag({ system: { tags: new Set(["x1"]) } }, { x1: "Profane" }), "| once each round:", J.roundKey({ started: true, id: "c", round: 2 }), JSON.stringify(J.roundKey(null)));

console.log("--- the passives' hooks (hooks.mjs)");
const H = await import(ROOTURL + "module/hooks.mjs");
console.log("works at its rung:", H.hookOn(2, 1), H.hookOn(2, 2), H.hookOn(6, 5), H.hookOn(0, 0), "| the traits:", H.hasTraits(new Set(["divine", "focus"]), ["divine"]), H.hasTraits(new Set(["focus"]), ["divine"]));

console.log("--- Rebuke: moves away (moment.mjs)");
const M = await import(ROOTURL + "module/moment.mjs");
console.log("the moment:", JSON.stringify(M.MOMENTS.enemyAway));
const path = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }], dist = (r, p) => Math.abs(p.x - 0);
console.log("the squares a Reaction could come back to (range 3, from 0):", JSON.stringify(M.backSquareIndices(path, [{ moment: "enemyAway", range: 3 }], dist)), "| closer, by contrast:", JSON.stringify(M.backSquareIndices([{ x: 4 }, { x: 3 }, { x: 2 }], [{ moment: "enemyCloser", range: 3 }], dist)));

console.log("--- the buttons (gen.mjs)");
const G = await import(ROOTURL + "module/gen.mjs");
for (const t of ["The target gains Guard equal to 2 + your Power Modifier.", "that creature gains Guard equal to your Power Modifier.", "That damage is reduced by 1 + your Power Modifier.", "@Book[Half-Blinded]{Half-Blinded} (EoT).", "Blinded (EoT).", "You Advance up to 5 squares in a straight line toward the target.", "You Advance."]) console.log(" ", G.convertEffects(t));

console.log("--- Half-Blinded, the Zone's Guard");
const R = await import(ROOTURL + "module/fxrules.mjs");
const z = R.normInside({ diff: { on: true, who: "enemies" }, guard: { on: true, who: "allies", self: true, formula: "@origin.pow" } });
console.log("the Guard row:", JSON.stringify(z.guard), "| active:", R.insideActive(z), "| its sentence:", R.insideSentences(z, { originName: "the Paladin" }).join(" "));

console.log("--- the wiring");
const ac = src("module/actions.mjs"), dm = src("module/damage.mjs"), se = src("module/senses.mjs"), tw = src("module/twod12.mjs"), cb = src("module/combat.mjs"), af = src("module/areafx.mjs"), tr = src("module/triggers.mjs"), inl = src("module/inline.mjs"), mo = src("module/moment.mjs"), eb = src("module/escblock.mjs");
console.log("an Art asks its Mode in the pick window:", ac.includes("const modes = artModes(item);") && ac.includes('await import("./pickwindow.mjs")') && ac.includes("modeView(item, mode)"));
console.log("Smite's dice at the roll, the chip and its Reaction AP:", ac.includes("ruledDice(inst.dice, ctx.diceRule") && src("module/rollinput.mjs").includes('special: "smite"') && ac.includes("C.setRAP(cb, C.getRAP(cb) - 1)"));
console.log("Judge's mark kind, no reduction (v0.0.527), Profane in the triggers:", ac.includes("it.markKind") && !dm.includes("judgeReductions") && tr.includes('tags.add("profane")'));
console.log("the hooks: Roving Judgment's cost, Hallowed Stance's Setup, Armor of Faith's Guard, Tireless Vigil's Reaction AP:", ac.includes('activeHooks(actor, "apCost")') && ac.includes('activeHooks(actor, "setupAdvance")') && ac.includes('activeHooks(actor, "reactionGuard")') && cb.includes('activeHooks(c?.actor, "rapMore")'));
console.log("Half-Blinded: the status and the Sight:", tw.includes('["half-blinded", CI("half-blinded")]') && se.includes('o?.statuses?.has?.("half-blinded")'));
console.log("Consecrated Ground's Guard at the start of a turn:", af.includes("a.rows.guard?.on"), "| Shield of Faith's Taunted on the triggering creature:", inl.includes('cfg.to === "trigger" && f?.triggerUuid') && mo.includes("triggerUuid: data.sourceUuid"));
console.log("Escalation abilities up to 6:", eb.includes("Math.min(6, rung)") && eb.includes("escalationRung"));
