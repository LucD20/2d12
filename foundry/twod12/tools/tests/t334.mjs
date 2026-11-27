// Run with: node tools/tests/run.mjs (or node tools/tests/t334.mjs)
// v0.0.535 (pack "the action economy and the rebuilt Reactions", Lucas 2026-11-27; book, Chapters 2, 4, 7, 8 and 14; book/reactions-design.md):
// 4 AP regained at the END of the turn (the ones left lost; Slowed takes from the regain, Quickened gives AP when the turn starts); every creature
// starts an encounter with its AP; no Reaction Point (a Reaction is paid with AP; what is left of the mechanism is Tireless Vigil's AP only for
// [Divine] Reactions); no Guard from unspent AP; a repeated At-will [Strike] is Doomed (a Reaction's counts only on your own turn); Strained is
// Speed -2 and Bloodied opens its space; the moments "moves within N" (no standing up), "ends its turn", the Judged creature's Strike (Shield of
// Faith: the ally takes half), "your damage reaches your Health Pool" (Dying Flare); the rebuilt level 1 Reactions; Hit and Run removed.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const R = await import(ROOTURL + "module/roundrules.mjs"), { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const M = await import(ROOTURL + "module/moment.mjs"), U = await import(ROOTURL + "module/usage.mjs");
const C = await import(ROOTURL + "tools/content.mjs");

console.log("--- (1) the AP (Chapter 2, Action Points)");
console.log("regained at the end of the turn: healthy", R.regainAP(4), "| Slowed 1", R.regainAP(4, 1), "| a Minion", R.regainAP(3), "| Slowed 5", R.regainAP(4, 5));
console.log("the encounter's first AP: a PC", R.encounterStartAP(4), "| a Minion", R.encounterStartAP(3), "| the Reaction Point (config):", TWOD12.reactionAp);
console.log("the most AP with Quickened 1 and Slowed 1 (turnAP):", R.turnAP(4, { quickened: 1, slowed: 1 }), "| Quickened 2:", R.turnAP(4, { quickened: 2 }));
const cb = src("module/combat.mjs");
console.log("the regain is the end of the turn's (combatTurnChange: the prior combatant), once a turn (apRegained), never for one that swapped away:",
  cb.includes("regained = await regainAtTurnEnd(combat, ended, prior)") && cb.includes('if (!key || c.getFlag(F, "apRegained") === key) return false;') && cb.includes('if (c.getFlag(F, "frozen")) return false;'));
console.log("a card's Slowed ends once it has cost its AP (the Down rider's stays):", cb.includes('e.statuses?.has?.("slowed") && e.getFlag?.(F, "rider") !== "down"'),
  "| the rest of a Dazed is taken from the regain:", /await setAP\(c, apPerTurn\(c\), "end of turn"[\s\S]{0,400}dazeAtTurnStart\(c\)/.test(cb));
console.log("the turn's start: only Quickened's AP, the Divine-only AP lost:", cb.includes('await setAP(c, have + q, "start of turn", { rap: { b: getRAP(c), a: 0 }, patch: { ...fresh, [`flags.${F}.rap`]: 0 } });'),
  "| no Guard from unspent AP:", cb.includes("  const guard = 0;") && !cb.includes("unusedApGuard(hadTurn, apLeft"));
console.log("the end-of-turn line reads 'AP regained':", cb.includes('/^end of turn/i.test(why) ? "AP regained"'));

console.log("--- (2) the repeated At-will [Strike] (Chapter 7, Strike)");
console.log("1st / 2nd / 3rd At-will Strike:", [0, 1, 2].map(n => JSON.stringify(R.atWillRepeat(n, true))).join(" "), "| another At-will Action's 2nd:", JSON.stringify(R.atWillRepeat(1, false)));
const ac = src("module/actions.mjs");
console.log("the roll dialog's chip is Doomed (5 Banes: Boons still meet it):", ac.includes('doomed: true, match: true, predicate: "An At-will [Strike] Action used again in the same turn is Doomed'));
const me = { uuid: "Actor.me" }, other = { uuid: "Actor.other" }, rx = { system: { reaction: true } }, act = { system: { reaction: false } };
const combat = mine => ({ combatant: { actor: mine ? me : other } });
console.log("a Reaction in another creature's turn counts toward no repeats:", U.offTurnReaction(me, rx, combat(false)), "| on your own turn it counts:", !U.offTurnReaction(me, rx, combat(true)), "| an Action that isn't a Reaction:", !U.offTurnReaction(me, act, combat(false)));

console.log("--- (3) the moments (moment.mjs)");
console.log("new moments:", ["enemyEndsTurn", "selfDowned"].map(k => `${k} ${JSON.stringify(M.MOMENTS[k])} "${TWOD12.moments[k]}"`).join(" | "));
const mo = src("module/moment.mjs");
console.log("standing up is not moving:", mo.includes('kinds: stand ? [] : ["enemyCloser", "enemyMoves"'), "| 'moves within N' is measured on the squares it left:", mo.includes("at: { enemyMoves: left,"));
console.log("the triggering creature must be the one you marked (momentMarked):", mo.includes("const MK = String(item.system.momentMarked ?? \"\").trim();"), "| momentSplit halve halves the held damage:", mo.includes('if (it?.system?.momentSplit === "halve" && !halveBy) halveBy = it.name;'));
console.log("a Down creature is offered only its own 'reaches its Health Pool':", mo.includes("if (downNow && !ev.kinds.some(k => MOMENTS[k]?.downOk)) continue;"), "| the end of a turn opens 'ends its turn':", mo.includes('await openMoment({ kinds: ["enemyEndsTurn"]'));
const held = { B: { l: 15, n: 0 }, M: { l: 0, n: 1 } };
console.log("halving 15 Vigor and 1 Resolve (the half taken rounded up):", M.halveHeld(held), "off ->", JSON.stringify(held));

console.log("--- (4) Strained, Bloodied (Chapter 4)");
console.log("a Bloodied enemy's space: passable as Difficult Terrain:", R.creatureWay({ unwilling: true, bloodied: true }), "| a healthy enemy's:", R.creatureWay({ unwilling: true }), "| an ally's:", R.creatureWay({}));
const dm = src("module/data.mjs");
console.log("Speed -2 from Strained (not Bloodied), PC and NPC:", dm.includes("(this.strained ? 2 : 0) });") && dm.includes("minus: this.strained ? 2 : 0") && !dm.includes("this.bloodied ? 2 : 0"));

console.log("--- (5) the cards");
const all = [...C.docs, ...C.pcs.flatMap(a => a.items ?? []), ...C.actors.flatMap(a => a.items ?? [])];
const card = n => all.find(x => x.name === n && x.type === "action");
const show = n => { const s = card(n)?.system; return s ? `${n}: ${s.frequency} ${s.reaction ? s.reactionKind : "action"} ${s.moment || "(by hand)"} ${s.momentRange ?? ""}${s.momentMarked ? ` marked:${s.momentMarked}` : ""}${s.momentSplit ? ` ${s.momentSplit}` : ""}${s.momentTarget && s.momentTarget !== "subject" ? ` on:${s.momentTarget}` : ""} | ${s.versions.map(v => v.ap).join("/")}R | ${s.trigger}` : `${n}: missing`; };
for (const n of ["Shield of Faith", "Rebuke", "Snap Shot", "Slip Away", "Backhand", "Blood for Blood", "Dying Flare", "Goblin Shriek"]) console.log(show(n));
console.log("Rebuke's chain:", card("Rebuke").system.versions[0].after, "| Shield of Faith's:", card("Shield of Faith").system.versions[0].after);
console.log("Hit and Run is gone from the compendium and the pregens:", !all.some(x => x.name === "Hit and Run"), "| Shriek and Scatter renamed:", !all.some(x => x.name === "Shriek and Scatter"));
console.log("Smite's and Steady Draw's chips cost 1 AP:", src("module/rollinput.mjs").includes('label: "1 AP: 1 more Smite die"') && src("module/rollinput.mjs").includes("label: `1 AP: ${n}dE more on a Tier 2 or 3`"));
