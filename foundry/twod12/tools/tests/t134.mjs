// Run with: node tools/tests/run.mjs (or node tools/tests/t134.mjs)
// v0.0.161 (Archer pass 3): Marked Quarry, Hunter's Focus, Long Draw, Steady Nerves, Killer's Focus; no odds for Save Actions; Empowered on Save damage.
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
globalThis.Hooks = { on() {} }; globalThis.game = { combat: null };
const A = await import(ROOT + "module/archer.mjs");
const flags = {};
const archer = (features, extra = {}) => ({ itemTypes: { feature: features.map(name => ({ name })) }, effects: [], system: { escalation: 0 }, getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; }, unsetFlag: async (s, k) => { delete flags[k]; }, ...extra });
const orc = { name: "Orc", document: { uuid: "Scene.s.Token.orc" } }, gob = { name: "Goblin", document: { uuid: "Scene.s.Token.gob" } };
const shot = new Set(["ranged", "shot", "strike", "weapon"]);
const a = archer(["Marked Quarry", "Long Draw", "Steady Nerves", "Killer's Focus"]);
flags.quarry = { uuid: "Scene.s.Token.orc", name: "Orc" };
console.log("quarry boon: Orc", JSON.stringify(A.archerMods(a, shot, orc).map(m => [m.name, m.boons])), "| Goblin", JSON.stringify(A.archerMods(a, shot, gob)), "| a Power Action against the Orc", JSON.stringify(A.archerMods(a, new Set(["magic", "strike"]), orc)));
a.effects = [{ name: "Hunter's Focus", disabled: false }];
console.log("Hunter's Focus: boons", JSON.stringify(A.archerMods(a, new Set(["magic"]), orc).map(m => m.name)), "| Empowered vs Orc", JSON.stringify(A.hunterEmpowered(a, orc)), "| vs Goblin", A.hunterEmpowered(a, gob));
console.log("Long Draw: crossbow", A.longDraw(a, { system: { traits: new Set(["projectile", "ranged"]) } }), "| thrown dagger", A.longDraw(a, { system: { traits: new Set(["thrown", "melee"]) } }));
console.log("Steady Nerves: Escalation 1", A.steadyNerves(a), "| Escalation 2", A.steadyNerves({ ...a, system: { escalation: 2 } }));
const b = { ...a, system: { escalation: 2 } };
console.log("Killer's Focus: Escalation 2, a Shot", JSON.stringify(A.killersFocusBonus(b, shot)), "| Escalation 1", A.killersFocusBonus(a, shot), "| not a Shot", A.killersFocusBonus(b, new Set(["melee", "strike", "weapon"])));
game.combat = { started: true, round: 2, turn: 1, turns: [{ actor: {} }, { actor: b }] };
await A.useKillersFocus(b);
console.log("used this turn-cycle:", A.killersFocusBonus(b, shot), "| its next turn:", (game.combat.round = 3, !!A.killersFocusBonus(b, shot)));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), main = src("module/twod12.mjs"), content = src("tools/content.mjs");
console.log("wired: boons", act.includes("extraMods.push(...archerMods(actor, useTraits, targetToken))"), "| Empowered", act.includes("hunterEmpowered(actor,"), "| Long Draw", act.includes("longDraw(actor, previewWeapon)"), "| Steady Nerves", act.includes("isEngaged(selfToken) && !steadyNerves(actor)"), "| Killer's Focus", act.includes("killersFocusBonus(actor, rollTraits(useTraits, src, item.name))"), "| Mark Quarry", act.includes("await setQuarry(actor, [...game.user.targets][0] ?? null)"), "| hooks", main.includes("registerArcherHooks();"));
console.log("content: Mark Quarry (0 or 1 AP, granted by Marked Quarry)", content.includes('add("actions", "action", "Mark Quarry"') && content.includes('actions: [uuidOf("actions", "Mark Quarry")] }, "Archer")'), "| Hunter's Focus applies its effect", content.includes('[uuidOf("effects", "Hunter\'s Focus")])'));
console.log("Save Actions: no odds", act.includes("if (saveAct) preview.noOdds = true;") && act.includes("if (!preview?.noOdds) updateOdds("), "| Empowered/Enfeebled per die on the Save's damage", inl.includes("step = emp - enf;") && inl.includes("c.total = Math.max(0, c.total + step * k)"));
