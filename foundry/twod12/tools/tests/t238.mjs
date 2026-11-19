// Run with: node tools/tests/run.mjs (or node tools/tests/t238.mjs)
// v0.0.350 (playtest 4, Step 5, the map): the center line's creature cover, the flanking overlay without noise, the area tooltip, the granted
// uses' bar movable and lower, the GM's Alt-drag Forced Movement; and Doubles' gold line in the stamp.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (o, k) => (k in o ? o[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };

// 1. Cover: a center line through a quarter of a creature's square now counts (the 12% margin let it through)
globalThis.canvas = { grid: { size: 100, isSquare: true }, tokens: { placeables: [] } };
const CV = await import(ROOTURL + "module/cover.mjs");
const tok = (id, x, y, name = id) => ({ id, name, document: { x, y, width: 1, height: 1, hidden: false }, actor: { statuses: new Set() } });
const kaela = tok("k", 0, 400, "Kaela"), orc = tok("o", 600, 0, "Orc Warrior"), durgan = tok("d", 300, 200, "Durgan (Dwarf Paladin)");
// Kaela's center (50,450) to the Orc's (650,50): at x=300..400 the line is at y=283..217, crossing Durgan's square (300..400, 200..300) near its corner
const c = CV.coverBetween(kaela, orc, { blockedFn: () => false, others: [durgan] });
console.log("a creature on the center line:", c.inWay, c.label, "| who:", c.blockers.map(b => b.name).join(", "), "| the center:", JSON.stringify(c.center));
const L = await import(ROOTURL + "module/loe.mjs");
console.log("the label:", L.loeLabel(c), "| the line drawn:", src("module/loe.mjs").includes("g.lineStyle(c.inWay ? 5 : 3.5, col, 1).moveTo(a.x, a.y).lineTo(z.x, z.y);"));

// 2. Flanking
const FO = await import(ROOTURL + "module/flankoverlay.mjs");
const f = (name, boons, cancels = []) => ({ token: { name }, boons, cancels: cancels.map(n => ({ name: n })) });
console.log("label:", FO.flankedText({ flankers: [f("Aveline (Human Paladin)", 2), f("Durgan (Dwarf Paladin)", 0, ["Ogre Chieftain"])] }), "| all cancelled:", JSON.stringify(FO.flankedText({ flankers: [f("A", 0)] })));
const placed = [];
console.log("labels never on each other:", JSON.stringify([FO.freeSpot(placed, 100, 100, 80, 20), FO.freeSpot(placed, 100, 100, 80, 20), FO.freeSpot(placed, 110, 95, 80, 20)]), "| no idle notes:", !src("module/flankoverlay.mjs").includes("threatens no one: ${x.why}"));

// 3. The area tooltip
const ZT = await import(ROOTURL + "module/zonetip.mjs");
const names = { a: { name: "Covering Fire (1 Bane)" }, b: { name: "Covering Fire (+1 Defense)" } };
console.log("Covering Fire:", ZT.zoneTipLines({ name: "Covering Fire", rules: [{ who: "enemies", fxUuid: "a" }, { who: "allies", fxUuid: "b" }], ends: { time: { on: true, mode: "rounds", rounds: 3 } } }, u => names[u]).join(" / "));

// 4. The granted uses' bar
const fu = src("module/freeuse.mjs");
console.log("the bar movable (its grip, kept in this browser):", fu.includes("makeMovable(grantBarEl);") && fu.includes('const POS_KEY = "twod12.grantBarPos";'), "| lower:", src("styles/system.css").includes(".twod12-linebar.twod12-grantbar { bottom: 74px; }"));

// 5. Alt-drag
const MV = await import(ROOTURL + "module/move.mjs");
globalThis.TWOD12 ??= undefined;
const cells = [0, 1, 2, 3, 4, 5].map(j => ({ i: 0, j }));
const free = MV.forcedDragPath(cells, { wallAt: () => false, creatureAt: () => null });
const wall = MV.forcedDragPath(cells, { wallAt: (p, q) => q.j === 4, creatureAt: () => null });
const crt = MV.forcedDragPath(cells, { wallAt: () => false, creatureAt: c => (c.j === 3 ? { name: "Goblin" } : null) });
console.log("free:", free.done, free.unused, "| a wall at 4:", wall.done, wall.unused, JSON.stringify(wall.damage), "| a Goblin at 3:", crt.done, crt.unused, JSON.stringify(crt.damage));
const mv = src("module/move.mjs");
console.log("GM only, Alt held, Foundry's move cancelled:", mv.includes('if (!game.user.isGM || operation?.twod12Forced') && mv.includes('game.keyboard?.isModifierActive?.("Alt")') && mv.includes("return false;\n    } catch (e) { return; }"), "| no Reactions (twod12Forced):", mv.includes("{ twod12Forced: true, animate: true, animation: { movementSpeed: TWOD12.pushSpeed, easing: \"easeOutCubic\" } });\n  const lines = [`<b>${esc(doc.name)}</b> is Force Moved"));

// Doubles: the gold line in the stamp, no tag above it
const C = await import(ROOTURL + "module/chatcards.mjs");
const st = C.stampHtml({ tier: 3, base: 2, doubles: true, total: 20, dc: 13 });
console.log("stamp:", /cc-stl dbl">Doubles ↑/.test(st), "| no tag:", !st.includes("cc-dbltag"));
