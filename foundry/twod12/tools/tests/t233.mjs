// Run with: node tools/tests/run.mjs (or node tools/tests/t233.mjs)
// v0.0.343 (playtest 4, Step 1, bugs): durations that end on time, forced movement's targets and right-click, Mastery once per Weapon Group,
// and the other Step 1 fixes (checked in the source where they need Foundry).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const FX = await import(ROOTURL + "module/effects.mjs");

// 1. Durations. Goblin (initiative 12, combatant g) is Rebuked by Durgan in round 2, turn 1: Frightened, 1 round, anchored on the Goblin's slot.
const gob = { id: "g", initiative: 12, tokenId: "tg", actorUuid: "Scene.s.Token.tg.Actor.a" }, kae = { id: "k", initiative: 15, tokenId: "tk", actorUuid: "Actor.k" };
const me = { uuid: gob.actorUuid, tokenId: "tg", combatantId: "g" };
const fr = { duration: { type: "rounds", rounds: 1 }, remaining: 1, slotInit: 12, anchorSlot: 12, anchorCombatantId: "g", appliedRound: 2, appliedTurn: 1 };
console.log("Frightened (1 round): the Goblin's turn it was applied in:", FX.durationStep(fr, gob, { round: 2, turn: 1 }, me), "| Kaela's turn, round 3:", FX.durationStep(fr, kae, { round: 3, turn: 0 }, me), "| the Goblin's next turn:", FX.durationStep(fr, gob, { round: 3, turn: 1 }, me));
const fr2 = { ...fr, duration: { type: "rounds", rounds: 2 }, remaining: 2 };
console.log("2 rounds: round 3:", FX.durationStep(fr2, gob, { round: 3, turn: 1 }, me), "| the same round again:", FX.durationStep({ ...fr2, remaining: 1, lastTick: 3 }, gob, { round: 3, turn: 1 }, me), "| round 4:", FX.durationStep({ ...fr2, remaining: 1, lastTick: 3 }, gob, { round: 4, turn: 1 }, me));
// Vulnerable 2 (EoT) from Heartseeker on Kaela's turn: ends at the end of the Goblin's slot
const vu = { duration: { type: "eot" }, slotInit: 12, appliedRound: 2, appliedTurn: 0 };
console.log("Vulnerable (EoT): Kaela's turn:", FX.durationStep(vu, kae, { round: 2, turn: 0 }, me), "| the Goblin's turn:", FX.durationStep(vu, gob, { round: 2, turn: 1 }, me));
// no slot (the initiative was not rolled when it was applied): the creature by its combatant, its token or its uuid (not object identity)
const ns = { duration: { type: "eot" }, slotInit: null };
console.log("EoT, no slot: by combatant:", FX.durationStep(ns, gob, { round: 1, turn: 1 }, me), "| by token:", FX.durationStep(ns, { ...gob, id: "x" }, { round: 1, turn: 1 }, { ...me, combatantId: "" }), "| by uuid:", FX.durationStep(ns, { ...gob, id: "x", tokenId: "" }, { round: 1, turn: 1 }, { uuid: me.uuid }), "| someone else:", FX.durationStep(ns, kae, { round: 1, turn: 1 }, me));
console.log("no duration / no ended turn:", FX.durationStep({}, gob, { round: 1, turn: 1 }, me), FX.durationStep(vu, null, { round: 1, turn: 1 }, me));
const eff = src("module/effects.mjs");
console.log("the countdown: one actor per uuid:", eff.includes("actors.set(c.actor.uuid, c.actor)"), "| each effect in its own try:", eff.includes("twod12 | the duration of"), "| skips one already gone:", eff.includes("!actor.effects.has(e.id)) continue;"));

// 2. Forced movement (Lucas: a right-click cancelled it, then "Target the creature to move first" with a target set)
const mv = src("module/move.mjs");
console.log("a hand click: the targeted creatures when the selected one is the pusher:", mv.includes("if (!targets.length && !ctx?.targets) targets = [...game.user.targets].filter(t => t.id !== origin.id);"), "| a right-click takes a square back:", mv.includes("if (ev.button === 2) { if (path.length > 1) { path.pop(); draw(); } return; }"));

// 3. Mastery: at most 1 per Weapon Group in each encounter (book, Chapter 15)
const M = await import(ROOTURL + "module/mastery.mjs");
const w = (name, extra = {}) => ({ name, system: { masteryGroup: "", weaponGroup: "", ...extra } });
console.log("groups:", ["Greatsword", "+1 Greatsword", "Hand Crossbow", "Crossbow", "Knuckle Dagger", "Dagger", "Shortbow", "Fists", "Warhammer"].map(n => `${n}=${M.weaponGroupOf(w(n)) || "-"}`).join(", "), "| set on the weapon:", M.weaponGroupOf(w("Warhammer", { weaponGroup: "hammers" })), "| by its Mastery kind:", M.weaponGroupOf(w("Sunblade", { masteryGroup: "Longsword" })));
const used = { combatId: "c1", groups: ["blades"] };
console.log("a Longsword after a Greatsword's Tier 3:", M.canGainMastery(used, "c1", w("Longsword")), "| a Shortbow:", M.canGainMastery(used, "c1", w("Shortbow")), "| the next encounter:", M.canGainMastery(used, "c2", w("Longsword")), "| no group: its own kind:", M.masteryLimitKey(w("Warhammer")));
const ms = src("module/mastery.mjs");
console.log("the message is a sysLine:", ms.includes('content: sysLine("fa-medal"'), "| the limit is stored on the character:", ms.includes('actor.setFlag(F, "masteryEnc"'), "| the weapon sheet has the field:", src("templates/item-sheet.hbs").includes('name="system.weaponGroup"'));

// 4. Smite 3 AP: the Guard's "who:pick" with "area:2" looks around the creature hit; the creature hit never gains it
const inl = src("module/inline.mjs");
console.log("who:pick / area / near skip the card's targets as recipients:", inl.includes('if (ctx.targets?.length && cfg.who !== "self" && cfg.who !== "pick" && !(cfg.area > 0) && !(cfg.near > 0)) {'));

// 5. Double Shot: an Action that rolls nothing, aimed at two creatures, lists both in its window
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const v0 = { ap: 2, cost: "2 AP", traits: [], meta: { targets: "Two creatures" }, tiers: {}, crit: "", noTiers: true };
const inp2 = { name: "Double Shot", versions: [v0], ap: 2, chips: [], creatures: [{ uuid: "a", name: "Ogre Chieftain", def: "AD", dc: 14, owned: false, plain: true }, { uuid: "b", name: "Bandit Thug", def: "AD", dc: 13, owned: false, plain: true }] };
const html2 = RD.dialogHtml(inp2, RD.newState(inp2));
console.log("both creatures in the window:", html2.includes("Ogre Chieftain") && html2.includes("Bandit Thug"), "| the input passes every aimed token:", src("module/rollinput.mjs").includes("else if (c.rollsAtOthers && (c.aimed?.length ?? 0) > 1) creatures = c.aimed"));

// 6. Open Season: a rule's Extra damage on Rolls made against them (the allies' [Strike] Actions against the Quarry)
const R = await import(ROOTURL + "module/fxrules.mjs");
const B = await import(ROOTURL + "module/bonus.mjs");
const old = [{ type: "bonusdamage", dmg: "1d6", dmgPool: "B", dmgSub: "Pi", all: ["strike"], against: true, vsOrigin: "not", tiers: ["t1", "t2", "t3"] }];
const mig = R.migrate({ settings: old });
const rule = mig.rules[0];
console.log("the old setting becomes the rule:", rule.kind, rule.dir, rule.vs, rule.dmg.on, JSON.stringify(rule.dmg.list[0].dice));
const comp = R.compile ? R.compile([rule], {}, "effect") : null;
const st0 = comp?.settings?.find(x => x.type === "bonusdamage");
console.log("compiled back:", st0 ? `${st0.dmg} ${st0.dmgSub} against:${st0.against} vsOrigin:${st0.vsOrigin}` : "(no compile export)");
console.log("its sentence:", R.plainText ? R.plainText(R.sentence(rule, { originName: "Kaela" })) : R.sentence(rule, { originName: "Kaela" }));
const m = { all: ["strike"], tiers: ["t1", "t2", "t3"], vsOrigin: "not" };
console.log("an ally's [Strike]:", B.againstOk(m, new Set(["strike", "weapon"]), 2, "Actor.kaela", "Actor.durgan"), "| Kaela's own:", B.againstOk(m, new Set(["strike"]), 2, "Actor.kaela", "Actor.kaela"), "| not a Strike:", B.againstOk(m, new Set(["spell"]), 2, "Actor.kaela", "Actor.durgan"));
console.log("the card's chain puts it on the Quarry:", fs.readFileSync(ROOT + "../../book/cards/archer.json", "utf8").includes("@Effect[{{fx:Open Season (the Quarry)}}|who:targets]"), "| the sheet offers Extra damage for both directions:", !/if \(r\.dir === "by"\) \{\s*parts \+= part\("emp"[\s\S]*?parts \+= part\("dmg"[\s\S]*?\n  \}\n  \/\/ v0\.0\.343/.test(src("module/fxsheet.mjs")) && src("module/fxsheet.mjs").includes('  parts += part("dmg", r.dmg.on, "Extra damage"'));

// 7. The chat stays at its bottom when a card grows (only while it was there)
const CS = await import(ROOTURL + "module/chatscroll.mjs");
console.log("at the bottom:", CS.atBottom({ scrollHeight: 1000, scrollTop: 560, clientHeight: 400 }), "| scrolled up to read:", CS.atBottom({ scrollHeight: 1000, scrollTop: 200, clientHeight: 400 }), "| registered:", src("module/twod12.mjs").includes("registerChatScroll();"));

// 9. Charge: given up, its card deleted and one line; "Charge!" on the bar
console.log("its card id kept:", mv.includes('messageId: ctx?.message?.id ?? "" });'), "| deleted (through the GM if not yours):", mv.includes('game.socket.emit("system.twod12", { type: "deleteMessage", messageId: m.id })') && src("module/damage.mjs").includes('data?.type === "deleteMessage"'), "| the line:", mv.includes("gives up Charge."), "| Charge! next to Give up:", mv.includes('class="lb-go"') && mv.includes('bar.querySelector(".lb-go").addEventListener'));

// 10. No "X marks Y" line; 11. Covering Fire's text; 12. hidden tokens react and provoke
const arc = fs.readFileSync(ROOT + "../../book/cards/archer.json", "utf8");
console.log("no marks line:", !src("module/mark.mjs").includes("</b> marks <b>"), "| Covering Fire:", arc.includes('"effects": "For 3 rounds, enemies in the area take 1 Bane on [Strike] Actions, and allies in it gain +1 Defense."') && !src("tools/content.mjs").includes("the area doesn't move"));
const mo = src("module/moment.mjs");
console.log("hidden tokens react:", !mo.includes("if (!actor || tk.document?.hidden) continue;"), "| and count for 'closer':", !mo.includes("t.actor && !t.document.hidden && Number("));
