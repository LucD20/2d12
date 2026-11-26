// Run with: node tools/tests/run.mjs (or node tools/tests/t269.mjs)
// v0.0.426: the audit of v0.0.407 to v0.0.417 (three independent reviewers; Lucas, 2026-11-18: "Go"), the fixes. Each line names the finding.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
const C = await import(ROOTURL + "tools/content.mjs");
const all = [...C.docs, ...C.deprecatedDocs.filter(d => C.REMOVED_B5.includes(d.name)), ...C.actors.flatMap(a => a.items ?? []), ...C.pcs.flatMap(a => a.items ?? [])];
const card = n => all.find(x => x.name === n && x.type === "action");
const tiers = (n, k = 0) => { const v = card(n).system.versions[k]; return [1, 2, 3].map(t => (v[`t${t}`] ?? []).map(i => (i.useW ? `${i.wCount}W` : "") + (i.useD ? `${i.dCount}D` : "") + (i.dice || "") + (i.useAt ? "Mod" : "") + (i.subtype ? ` ${i.subtype}` : "")).join(" + ") || "-").join(" / "); };

console.log("--- [Mod] as the card writes it (a Structure card), none added by the roll; none shown for an NPC");
console.log("Smite:", tiers("Smite"), "| Trick Shots (Pin):", tiers("Trick Shots"), "| Seizing Cut:", tiers("Seizing Cut"), "| Quick Shots:", tiers("Quick Shots"));
console.log("the Basic Attack writes its own [Mod] on all three Tiers (core rework batch 3):", tiers("Basic Attack"));
const { rollSource } = await import(ROOTURL + "module/rollsource.mjs");
const pc = { weaponMod: 2, signatureMod: 3, attributes: {} }, npc = { ...pc, modSource: "role" };
const st = new Set(["weapon", "strike"]);
console.log("attrMode: a Structure card", rollSource(pc, { traits: st, structure: true }).attrMode, "| an old card", rollSource(pc, { traits: st }).attrMode, "| an NPC's", rollSource(npc, { traits: st }).attrMode);
const { tierTokens } = await import(ROOTURL + "tools/cardgen.mjs");
console.log("a subtype is its pool's ([V] 1[W] + [Mod] + [R] 1d6! Ho):", tierTokens("[V] 1[W] + [Mod] + [R] 1d6! Ho", false, 2));
console.log("a written [Mod] takes the weapon's type:", src("module/actions.mjs").includes("(inst.useW || inst.useD || (inst.useAt && !inst.dice) ? (ctx.weapon?.system?.subtype"));

console.log("--- the card's own \"Tier 2 or 3\" / \"Tier 1 or 2\"");
const { tierLines } = await import(ROOTURL + "module/cardmodel.mjs");
console.log("written 23, damage:", JSON.stringify(tierLines(["&mdash;", "Mod | Hindered", "Mod | Hindered"], false, false, "23")), "| written 12, a Save:", JSON.stringify(tierLines(["a", "a", "No effect."], true, true, "12")));
console.log("Trick Shots' Pin carries it:", card("Trick Shots").system.versions[0].orTiers, "| not written: three lines:", tierLines(["&mdash;", "x", "x"], false, false).length);

console.log("--- Lingering, Shake Off, Empowered");
const { endsWithEncounter } = await import(ROOTURL + "module/automation.mjs");
const fx = (flags, statuses) => ({ statuses: new Set(statuses), getFlag: (_s, k) => flags[k] });
console.log("ends with the encounter: a Lingering with no duration", endsWithEncounter(fx({ effectUuid: "x", duration: { type: "" } }, ["bleed"])), "| an encounter one", endsWithEncounter(fx({ duration: { type: "encounter" } }, [])),
  "| not: Dying", endsWithEncounter(fx({ effectUuid: "x", duration: { type: "" } }, ["dying"])), "| not: a Save ends it", endsWithEncounter(fx({ effectUuid: "x", saveEnd: { on: true } }, ["frightened"])), "| not: 2 rounds", endsWithEncounter(fx({ effectUuid: "x", duration: { type: "rounds" } }, ["prone"])));
console.log("Lingering keeps the higher average:", src("module/effects.mjs").includes("if (next !== null && now >= next) return;"));
console.log("Shake Off on another player's creature goes through the GM:", src("module/inline.mjs").includes('game.socket.emit("system.twod12", { type: "shakeOff"') && src("module/damage.mjs").includes('data?.type === "shakeOff"'));
const A = src("module/actions.mjs"), I = src("module/inline.mjs");
console.log("Empowered: one die for one creature (attack, Save):", A.includes("if (empOn && (!again || hadEmp) && !empLater && !empUsed)") && A.includes("groups.splice(at, 0, { ...g0, comps: [...g0.comps, ec] })") && I.includes("if (st.tierDmg?.emp && !st.empDone)"));

console.log("--- the Archer");
console.log("Shifting Aim's / Blade and Bow's Boons are rolled:", src("module/rollinput.mjs").includes("fx: `syn:hook:${k}`") && A.includes("resolveModifiers(actor, data.fx, [...extraMods, ...hookMods])"));
console.log("a retarget keeps the hands' Banes, the At-will Bane and the hooks:", A.includes('"syn:hand", "syn:atwill", "syn:onehand"].includes(id) || id.startsWith("syn:hook:")'));
console.log("the weapon settled before the dialog (a Shot from a bow):", A.includes('const fit = it.traits.has("shot") ? candidates.filter(w => hasProp(w, "projectile"))'));
console.log("One More Arrow only on a rolled [W] Tier:", A.includes("rolledTiers.some(t => (version[`t${t}`] ?? []).some(i => i.useW))"));
console.log("Call Out helps the caller's allies, not the caller:", src("module/senses.mjs").includes("const isCaller = !!callerActor && observer.actor?.uuid === callerActor.uuid;"));
console.log("Thrill of the Kill: the author noted before the damage, enemies only:", src("module/damage.mjs").indexOf("noteHurtBy(actor, by)") < src("module/damage.mjs").indexOf("if (Object.keys(upd).length) await writeDamage(actor, upd);") && src("module/mark.mjs").includes("!(dw * da < 0)"));
console.log("Volley's Burst within the weapon's range:", card("Volley").system.areaCfg?.withinRange);

console.log("--- the Paladin");
console.log("Rebuke measured on the squares the enemy left; Shield of Faith not against an ally's Strike:", src("module/moment.mjs").includes("const tDist = def.move && target === hit.sj ? hit.dist") && src("module/moment.mjs").includes('k === "strikeDamage" && ev.source?.actor && !sideOk("enemy"'));
const S = src("module/states.mjs");
console.log("Kindled Wrath: Bloodied or Down, the ally's name:", S.includes('words.filter(w => w === "Bloodied" || w === "Down")') && S.includes("(${actor.name} is ${ally.join"));
const rescue = JSON.stringify(card("Hold the Line").system.versions), relocate = JSON.stringify(card("Relocate")?.system?.versions ?? []);
// v0.0.520 (the cleanup audit, B2-021; book, Chapter 3, Reposition: every Reposition stays within your Reach): move.mjs holds every one (choosePath)
console.log("every Reposition held within Reach (move.mjs), Relocate's card writes nothing more:", src("module/move.mjs").includes("if (repo && globalThis.canvas?.tokens?.get?.(origin?.id)) withinReach = true;") && !relocate.includes("reach:yes") && !rescue.includes("reach:yes"));
console.log("Hallowed Stance's Setup line on a card without one; the range waits only for a Setup movement to come:", src("module/cardlines.mjs").includes('top.splice(at, 0, { label: "Setup", html: setupHtml })') && A.includes('(String(it.setup ?? "").includes("@Move") && !setupDone)'));

console.log("--- the rest");
console.log("Mastery's +/- from the shown value:", src("module/actor-sheets.mjs").includes("masteryValue(this.actor, masteryOf(this.actor)[k]?.name || nm || k)"));
console.log("a damage-free Save card's chain on a retarget; a Special inside a block refused:", I.includes("st.chain.done = [...(st.chain.done ?? []), ...fresh.map(r => r.uuid)]") && fs.readFileSync(ROOT + "../../book/cards/load.mjs", "utf8").includes("inside a block isn't read by Foundry yet"));
