// Run with: node tools/tests/run.mjs (or node tools/tests/t262.mjs)
// v0.0.418 (playtest 5, Version 1: the fixes; book/playtest-5.md section 3). V1.1: a click uses an action button, a right-click opens its rule.
// V1.2: a condition written in a Tier applies when its Tier lands (G1-G3), a condition or effect chip dragged onto a token (G1), Rebuke's Hindered
// (G8: a Save Action with no damage runs its chain on use), Slip Away's Evade off its turn (G6), Judge with no target (G4: asks, else Apply Effect),
// Steadiness asked only when an ally moves you (H1), the HUD without the Techniques not unlocked (D6).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
class Fd { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.game = { settings: { get: () => true }, user: { id: "u", targets: new Set() }, combat: null };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fd, NumberField: Fd, StringField: Fd, BooleanField: Fd, ArrayField: Fd, SetField: Fd, HTMLField: Fd } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const tw = src("module/twod12.mjs"), inl = src("module/inline.mjs"), act = src("module/actions.mjs"), ccd = src("module/ccdamage.mjs"), mvs = src("module/move.mjs"), hud = src("module/hud.mjs");

console.log("--- V1.1 a click uses the button, a right-click opens its rule (C12, G5)");
console.log("only a chip naming an item opens it on its name:", tw.includes('const NAMES_ITEM = new Set(["Effect", "Use"]);'), "| the right-click opens the rule or the item:", tw.includes('document.addEventListener("contextmenu"') && tw.includes("openChip(inl.dataset.twod12Inline"));

console.log("--- V1.2 a Tier's condition applies when the Tier lands (G1-G3)");
const IN = await import(ROOTURL + "module/inline.mjs");
console.log("the chip read from the Tier's text:", JSON.stringify(IN.parseInline("Condition", "hindered|eot")), "| the Tier's group carries them:", act.includes('const conds = (await import("./inline.mjs")).tierConditionChips(xt);'),
  "| both damage cards pass them:", (act.match(/conds: byTier\.get\(t\)\.conds|conds: d\.conds/g) ?? []).length === 2);
console.log("an attack's row applies them when its damage landed:", ccd.includes("if (landed && (g.conds ?? []).length)") && ccd.includes("applyConditionChip(chip, { targets: [{ uuid: r.uuid, name: r.name, crit: !!r.crit }], actor: user, attrVal: Number.isFinite(s.originMod) ? s.originMod : null })"),
  "| a Save's Tier (the old card, the new card's Damage button, a Tier with no damage):", inl.includes("if (!dealt || dealt.landed) for (const chip of tierConditionChips(cfg.tiers[`t${tier}`]))") && inl.includes("conds: tierConditionChips(cfg.tiers[`t${t}`])") && inl.includes("if (!comps.length) for (const chip of tierConditionChips(cfg.tiers[`t${chk.tier}`]))"));
const C = await import(ROOTURL + "tools/content.mjs");
const ss = C.docs.find(d => d.name === "Snap Shot").system.versions[0];
console.log("Snap Shot's Tiers 2 and 3 hold the chips:", JSON.stringify([ss.x2, ss.x3]));
console.log("dragged onto a token (G1):", inl.includes('if (kind === "Condition" || kind === "Effect") a.draggable = true;') && tw.includes('type: "twod12Chip"') && tw.includes("m.dropChip(data.kind, data.cfg, token.document"));

console.log("--- G8 Rebuke's Hindered: a Save Action with no damage runs its chain on use");
const rb = C.docs.find(d => d.name === "Rebuke").system;
console.log("Rebuke:", rb.traits.includes("save"), JSON.stringify(rb.versions[0].after), "| no damage in its Tiers:", !["t1", "t2", "t3"].some(t => rb.versions[0][t].length),
  "| wired:", act.includes("const saveNoDamage = saveAct && !version.noTiers && !") && act.includes("if ((it.moment && version.noTiers || saveNoDamage) &&"));

console.log("--- G6 a Reaction's movement off its turn is tracked");
const MV = await import(ROOTURL + "module/move.mjs");
const cb = (id, tok, f) => ({ id, tokenId: tok, getFlag: (s, k) => f[k] });
const kaela = cb("c2", "tK", { evadeMove: 1, offTurnAt: "1:0" }), orc = cb("c1", "tO", {}), still = cb("c3", "tD", {}), left = cb("c4", "tL", { freeMove: 3 });
game.combat = { started: true, round: 1, turn: 0, combatant: orc, combatants: [orc, kaela, still, left] };
console.log("the creature whose turn it is:", MV.currentCombatantFor({ id: "tO" })?.id, "| Kaela, not on the turn, with Evade 1:", MV.currentCombatantFor({ id: "tK" })?.id, "(free squares", MV.offTurnFree(kaela) + ")",
  "| a creature off its turn with none:", MV.currentCombatantFor({ id: "tD" }) ?? "not tracked",
  "| v0.0.421: squares left from its own turn (no Reaction this turn):", MV.currentCombatantFor({ id: "tL" }) ?? "not tracked");
game.combat = null;
console.log("beyond its free squares off its turn: refused:", mvs.includes("if (game.combat?.combatant?.id !== c.id && squares > offTurnFree(c) + 1e-6)"));

console.log("--- G4 Judge with no target");
console.log("the chip:", JSON.stringify(IN.parseInline("Mark", "judge")), "| it marks the targeted creature:", inl.includes('if (kind === "Mark") return handleMark(cfg, ctx);') && inl.includes("await setQuarry(user, tok, cfg.kind ?? \"\");"),
  "| used with no target: asks on the map, else the button:", act.includes("text: `<b>${esc(item.name)}</b>: which creature? Click its token.`") && act.includes("@Mark[${it.markKind ?? \"\"}]{Apply Effect}"));

console.log("--- H1 Steadiness asked only when an ally moves you");
const tok = d => ({ document: { disposition: d } });
const ally = tok(1), me = tok(1), foe = tok(-1);
console.log("an enemy pushes you: applies, no question:", MV.asksSteadiness(foe, me), "| an ally:", MV.asksSteadiness(ally, me), "| yourself:", MV.asksSteadiness(me, me), "| no origin:", MV.asksSteadiness(null, me));

console.log("--- D6 the HUD leaves out the Techniques not unlocked");
console.log(hud.includes('actor.itemTypes.action.filter(i => techniqueState(actor, i) !== "locked").map(i => one(i))'));

console.log("--- V1.3 the chat");
const CS = await import(ROOTURL + "module/chatscroll.mjs");
console.log("C1 pinned after a scroll: at the bottom", CS.scrollPinned(false, true, false), "| moved by a card redrawn (not the user)", CS.scrollPinned(true, false, false), "| scrolled up by the user", CS.scrollPinned(true, false, true));
const theme = src("styles/theme.css"), css = src("styles/system.css"), CCm = await import(ROOTURL + "module/chatcards.mjs");
console.log("C2 a follow-up line in the system line's look:", css.includes(".twod12.chat.follow .fl-line { display: flex; align-items: baseline; gap: 7px; padding: 4px 9px; border: 1px solid #c8b48a;"));
console.log("C3-C6 removed: Bloodied / Strained / Down:", !src("module/states.mjs").includes("(No effect by itself: a hook for cards.)"), "| the Reactions' used line:", !src("module/moment.mjs").includes("content: usedBarHtml(st)"),
  "| next damage reduced:", !inl.includes("The next damage <b>"), "| the movement lines:", !mvs.includes("free square${left === 1") && mvs.includes("no chat line for a drag of free movement"));
console.log("C7 the stamp stretches to its row (with a target):", css.includes(".cc-attack.withdmg.notgt .cc-body { align-items: start; }"));
const crit = CCm.ladderModel({ total: 22, dc: 14, base: 3, tier: 3, crit: true, doubles: true }), plain3 = CCm.ladderModel({ total: 26, dc: 14, base: 3, tier: 3, crit: false });
console.log("C8 a Critical from Doubles: the ↑ over CRIT", crit.up, "(the total's arrow faded:", crit.arrow.faded + ") | C9 a Tier 3 with no Critical: no CRIT zone:", plain3.critZone === "", "| a Critical's zone:", crit.critZone);
console.log("C11 Bloodied in the Vigor red on the dark card:", theme.includes(":scope .twod12.chat.cc .cc-state.bloodied, :is(.twod12.chat.cc):scope .cc-state.bloodied { background: #d0564f; }"), "| B4 the calculated blue's dark variant:", theme.includes("a.twod12-inline.calc .ti-name { color: #8db8f0; }"));

console.log("--- V1.4-5 the roll dialog, the sheets, the HUD");
const rd = src("module/rolldlg.mjs"), pcs = src("module/pcsheet.mjs"), as = src("module/actor-sheets.mjs"), hv = src("module/hudview.mjs");
console.log("B1 the roll line only where the card has one:", rd.includes("if (m.vs && C.roll) {"), "| A2:", act.includes("name: `${atWill + 1}x At-will use`"));
console.log("E2 a Reaction's pill writes its Frequency (\"Turn · 1R\"):", pcs.includes("fqWord = reaction && FREQ_WORD[fq] ? FREQ_WORD[fq] : \"\""), "| E4 the Action sheet's traits plain:", src("module/actionsheet.mjs").includes('class="fr-chip plain"'));
const AS = await import(ROOTURL + "module/sheetmodel.mjs").catch(e => ({ err: e.message }));
if (AS.cleanLevel) {
  console.log("E8 an empty Level is left unchanged:", JSON.stringify(["", null, "3", ["", "4"], "x", -2].map(AS.cleanLevel)));
  console.log("E7 a Rally pip clicked (3 left): the 2nd →", AS.rallyAfterClick(1, 3), "| the 3rd (the last lit) →", AS.rallyAfterClick(2, 3), "| the 4th →", AS.rallyAfterClick(3, 3), "| the line:", as.includes("sets the Rally Points to <b>${n}</b> of ${max}."));
  const cl = new Set(), el = { classList: { contains: k => cl.has(k), add: (...k) => k.forEach(x => cl.add(x)) } };
  console.log("E5 a window with no scheme takes the Applications one:", AS.ensureWindowTheme(el, "light"), [...cl].join(" "), "| one with its own is left:", AS.ensureWindowTheme(el, "dark"));
} else console.log("(actor-sheets.mjs:", AS.err, ")");
console.log("D2 both Modifiers, no Vigor / Resolve words on the bars:", hud.includes('{ label: "Pow", value: sg(s.powerMod ?? 0), tip: "Power Modifier" }') && !hv.includes("<span><b>${esc(b.name)}</b>"),
  "| D5 no jump (v0.0.421: the classes switch with the new content, after the data):", hud.includes('shape("is-bar", ...(m.npc ? ["is-npc"] : []), ...(m.folded ? ["is-folded"] : []));') && !hud.includes("minHeight"), "| F2 Bloodied / Strained off the strip:", hud.includes('tag: h.tag?.cls === "hurt" ? null : h.tag'));
console.log("F1 a full AP pip solid gold, an empty one dark:", theme.includes(".twod12-type.twod12-type .twod12-hud .hm-ap i.on, .twod12-type.twod12-type #twod12-carousel .tp-marks .hm-ap i.on { background: #d2a75a; border-color: #d2a75a; }"), "| D8 the HUD's icons centered:", css.includes(".twod12-hud .hud-hot #hotbar .slot, .twod12-hud .hud-hot #hotbar button { display: inline-flex; align-items: center; justify-content: center;"));

console.log("--- V1.6 the Encounter Log");
const DL = await import(ROOTURL + "module/damagelog.mjs");
console.log("same side:", DL.sameSide(-1, -1), "| foes:", DL.sameSide(-1, 1), "| a neutral is nobody's ally:", DL.sameSide(0, 0), "| unknown:", DL.sameSide(undefined, 1));
const log = [{ o: "OG", on: "Ogre Chieftain", a: 20, r: 1, t: 0, al: true }, { o: "OG", on: "Ogre Chieftain", a: 9, r: 1, t: 0 }, { o: "G1", on: "Goblin Sneak", a: 8, r: 1, t: 1 }, { o: "G2", on: "Goblin Sneak", a: 3, r: 1, t: 2 }];
const cmb = { round: 1, turn: 2, turns: [{ id: "a", actor: { uuid: "OG" } }, { id: "b", actor: { uuid: "G1" } }, { id: "c", actor: { uuid: "G2" } }], combatants: { find: () => null }, getFlag: (s, k) => (k === "dmglog" ? log : undefined) };
console.log("the report:", DL.reportRows(cmb).map(r => `${r.name} ${r.total} (to allies ${r.allies})`).join("; "));
const EL = await import(ROOTURL + "module/enclog.mjs");
const turn = { r: 1, t: 0, own: { id: "k", name: "Kaela" }, items: [{ k: "move", who: { id: "k" }, d: { mode: "Advance", n: 2, setup: "Strafe" } }, { k: "act", who: { id: "k" }, d: { name: "Strafe", tg: [{ id: "o", name: "Orc Warrior", tier: 2 }] } }, { k: "move", who: { id: "k" }, d: { mode: "Advance", n: 3 } }] };
console.log("a Setup's movement inside its Action:", EL.turnText(turn, r => r?.name ?? "?", n => n));
console.log("an area skips a creature out of the fight:", src("module/template.mjs").includes("let tokens = tokensIn(placed.cells).filter(t => !outOfFight(t));"), "| the Setup's name reaches the log:", src("module/setup.mjs").includes("setLog(item.name);") && mvs.includes("cost, setupLogName)"));
