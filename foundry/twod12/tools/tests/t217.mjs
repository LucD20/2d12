// Run with: node tools/tests/run.mjs (or node tools/tests/t217.mjs)
// v0.0.301 PACK BB (book Ch. 1, the new Boons and Banes; book/boons-banes.md): a Boon is +1 and a Bane -1, they cancel; Field, Pressure and Support
// count up to 2 of each name and side (before cancelling); 5 or more left make the roll Favored / Doomed instead; Favored keeps the two highest, any
// pair of the three is Doubles, three of a kind a Critical; High cover is Doomed (no Field Banes) and makes a Save Favored; Flanking up to 2.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {}, once() {} };
globalThis.game = { settings: { get: () => false }, user: { id: "u", isActiveGM: true } };
globalThis.fromUuidSync = () => null;
const src = n => fs.readFileSync(ROOT + n, "utf8");
const C = await import(ROOTURL + "module/calc.mjs");
const pc = r => r.map(x => (x * 100).toFixed(1)).join(" / ");

console.log("--- the count (calc.mjs bbCount): the limit of 2 per name and side, before cancelling");
const cnt = list => { const n = C.bbCount(list); return `${n.boons} Boons, ${n.banes} Banes (raw ${n.rawBoons} / ${n.rawBanes})`; };
console.log("3 Field Banes + 1 Field Boon (the book's example):", cnt([{ banes: 3, bb: "field" }, { boons: 1, bb: "field" }]), "| net", C.bbFive(1, 2).net);
console.log("Flanking 2 + Prone 1 (both Field) + 1 unnamed Boon:", cnt([{ boons: 2, bb: "field" }, { boons: 1, bb: "field" }, { boons: 1 }]));
console.log("2 Pressure + 2 Support + 2 Field Banes + Engaged 2 (unnamed):", cnt([{ banes: 2, bb: "pressure" }, { banes: 2, bb: "support" }, { banes: 2, bb: "field" }, { banes: 2 }]));
console.log("a name nobody knows counts as none:", cnt([{ boons: 3, bb: "magic" }]), "| Vulnerable 3 (unnamed) stays 3:", cnt([{ boons: 3 }]));

console.log("--- five b/b (calc.mjs bbFive, rollState)");
console.log("8 Boons, 3 Banes:", JSON.stringify(C.bbFive(8, 3)), "| 6 Boons, 2 Banes:", JSON.stringify(C.bbFive(6, 2)), "| 1 Boon, 6 Banes:", JSON.stringify(C.bbFive(1, 6)));
console.log("five Boons and High cover's Doomed: normal:", JSON.stringify(C.rollState(false, true, "favored")), "| Favored twice is Favored:", C.rollState(true, false, "favored"), "| Favored and Doomed:", JSON.stringify(C.rollState(true, true, "")));
console.log("a Favored + Doomed roll with 5 Boons is still normal (never Favored twice):", JSON.stringify(C.rollState(true, true, "favored")));

console.log("--- the odds (calc.mjs tierProbs; the ruler shares it)");
console.log("+0 vs 13 with 1 Boon = +1 with none:", pc(C.tierProbs(0, 13, 1, 0)) === pc(C.tierProbs(1, 13, 0, 0)), "| 3 Boons 1 Bane = +2:", pc(C.tierProbs(0, 13, 3, 1)) === pc(C.tierProbs(2, 13, 0, 0)));
console.log("5 Boons = Favored:", pc(C.tierProbs(0, 13, 5, 0)) === pc(C.tierProbs(0, 13, 0, 0, "favored")), "| 4 Boons = +4:", pc(C.tierProbs(0, 13, 4, 0)) === pc(C.tierProbs(4, 13, 0, 0)), "| 5 Banes = Doomed:", pc(C.tierProbs(0, 13, 0, 5)) === pc(C.tierProbs(0, 13, 0, 0, "doomed")));
console.log("5 Boons on a Doomed roll = normal:", pc(C.tierProbs(0, 13, 5, 0, "doomed")) === pc(C.tierProbs(0, 13, 0, 0)));
for (const m of [0, 2, 4]) console.log(`Favored +${m} vs 13: T1 / T2 / T3 ${pc(C.tierProbs(m, 13, 0, 0, "favored"))} | Critical ${(C.critProb(m, 13, 0, 0, "favored") * 100).toFixed(1)} (the book's ruler run: T3 39.2 / 52.5 / 66.6, Crit 9.3 / 13.1 / 17.7)`);

console.log("--- the dice kept (roll.mjs keepDice)");
globalThis.Roll = class { constructor(f) { this.f = f; } async evaluate() { const v = SEQ.shift(); this.dice = [{ results: [{ result: v }] }]; this.total = v; return this; } };
let SEQ = [];
const R = await import(ROOTURL + "module/roll.mjs");
const d = (f, t = f) => ({ first: f, total: t });
const show = k => `keeps ${k.i.join("+")} total ${k.total} tier ${k.tier}${k.doubles ? " Doubles" : ""}${k.triple ? " three of a kind" : ""}${k.crit ? " Critical" : ""}`;
console.log("Favored 1, 1, 5 (+0): ", show(R.keepDice([d(1), d(1), d(5)], "favored", 0, 13)), "| the 1s are Doubles even with one dropped");
console.log("Favored 3, 3, 3 (+0): ", show(R.keepDice([d(3), d(3), d(3)], "favored", 0, 13)), "| three of a kind is a Critical whatever the total");
console.log("Favored 2, 9, 10 (+2):", show(R.keepDice([d(2), d(9), d(10)], "favored", 2, 13)), "| no pair");
console.log("Doomed 5, 5, 7 (+2):  ", show(R.keepDice([d(5), d(5), d(7)], "doomed", 2, 13)), "| no Doubles");
console.log("normal 4, 4 (+0):     ", show(R.keepDice([d(4), d(4)], "", 0, 13)));
console.log("Favored for initiative (no Doubles) 5, 5, 7:", show(R.keepDice([d(5), d(5), d(7)], "favored", 0, 13, true)));

console.log("--- a roll (roll.mjs performCheck, resolveShared)");
SEQ = [6, 7];
let r = await R.performCheck({ mod: 2, boons: 3, banes: 1, dc: 13 });
console.log("6 + 7 + 2, 3 Boons 1 Bane:", r.total, "| bo / ba", r.bo, r.ba, "| faces", JSON.stringify(r.boonFaces), JSON.stringify(r.baneFaces), "| state", JSON.stringify(r.state), "| d12 rolled", r.rolls.length);
SEQ = [6, 7, 2];
r = await R.performCheck({ mod: 2, boons: 6, banes: 1, dc: 13 });
console.log("6 Boons 1 Bane: five left, Favored, 3 d12:", r.state, r.five, "| bo", r.bo, "| total", r.total, "(6 + 7 + 2) | d12 rolled", r.rolls.length);
SEQ = [6, 7];
r = await R.performCheck({ mod: 2, boons: 5, banes: 0, dc: 13, doomed: true });
console.log("5 Boons on a Doomed roll: normal, 2 d12:", JSON.stringify(r.state), r.five, "| total", r.total);
const shared = { d: [d(4), d(4), d(9)].map(x => ({ ...x, faces: [x.first] })), boonFaces: [], baneFaces: [] };
const one = R.resolveShared(shared, { mod: 0, dc: 13, boons: 0, banes: 0, favored: true }), two = R.resolveShared(shared, { mod: 0, dc: 13, boons: 1, banes: 0 }), three = R.resolveShared(shared, { mod: 0, dc: 13, boons: 5, banes: 0 });
console.log("several targets, dice 4 4 9: Favored", one.total, `tier ${one.tier}`, one.doubles ? "Doubles" : "", "| 1 Boon (first two)", two.total, `tier ${two.tier}`, two.doubles ? "Doubles" : "", "| 5 Boons: Favored", three.state, three.total, `tier ${three.tier}`);
const html = R.checkHtml("Weapon Attack", { d1: [6], d2: [7], total: 15, dc: 13, mod: 2, adj: 0, boonFaces: [1, 1, 1], baneFaces: [1], bo: 3, ba: 1, five: "", sources: [], state: "", tier: 2, base: 2 });
console.log("the old card shows counts, not dice:", !html.includes("die d3"), html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 60));

console.log("--- the sources' names (effects.mjs resolveModifiers)");
const ef = await import(ROOTURL + "module/effects.mjs");
const mkEffects = list => { list.get = id => list.find(e => e.id === id); return list; };
const proneOld = { modifiers: [{ against: true, boons: 1, banes: 0, all: [], any: ["melee"], none: [] }] };   // an applied Prone from before v0.0.301 (no name)
const fxFlags = { modifiers: [{ against: false, boons: 0, banes: 3, bb: "pressure", all: [], any: [], none: [] }, { against: false, boons: 1, banes: 0, all: [], any: [], none: [] }] };
const target = { uuid: "Actor.t", name: "Orc", effects: mkEffects([{ id: "p", name: "Prone", statuses: new Set(["prone"]), getFlag: (s, k) => proneOld[k] }]) };
const me = { uuid: "Actor.me", name: "Kai", effects: mkEffects([{ id: "z", name: "Effect: Zone", getFlag: (s, k) => fxFlags[k] }]), itemTypes: {} };
globalThis.fromUuidSync = u => (u === "Actor.t" ? target : null);
const list = ef.modifierList(me, new Set(["strike", "melee"]), [target]);
console.log("chips:", list.map(m => `${m.name} +${m.boons}/-${m.banes} ${m.bb || "(no name)"}`).join(" | "));
const flank = { id: "syn:flanking", name: "Flanking (2 Field Boons)", boons: 2, banes: 0, bb: "field", match: true };
const hi = { id: "syn:cover", name: "High cover (Doomed)", boons: 0, banes: 0, doomed: true, bb: "field", match: true };
const res = ef.resolveModifiers(me, [...list.map(m => m.id), "syn:flanking", "syn:cover"], [flank, hi]);
console.log("resolved: Boons", res.boons, "(Prone 1 + Flanking 2 Field: 2, + 1 unnamed) | Banes", res.banes, "(3 Pressure: 2) | Doomed", res.doomed, res.doomBy.join(", "));

console.log("--- the roll dialog (rolldlg.mjs)");
const D = await import(ROOTURL + "module/rolldlg.mjs");
const chip = (id, kind, n, bb, scope = "shared") => ({ id, fx: id, scope, row: kind === "boon" ? "boons" : "banes", kind, n, bb, label: id, start: "on" });
const inp = { name: "Shot", versions: [{ ap: 1, traits: [], meta: {}, tiers: {} }], ap: 1, roll: { mod: 2, name: "Weapon" }, multi: false,
  chips: [chip("Low cover", "bane", 1, "field", "orc"), chip("Obscured", "bane", 1, "field", "orc"), chip("Long", "bane", 1, "field", "orc"), chip("Far range", "bane", 1, "", "orc"), chip("Frightened", "bane", 1, "")],
  creatures: [{ uuid: "orc", name: "Orc", def: "AD", dc: 13 }] };
const st = D.newState(inp);
let dl = D.diceLine(inp, st), calc = D.creatureCalc(inp, st, "orc");
console.log("3 Field Banes + range + Frightened: ▼", dl.banes, "| notes:", dl.bbNotes.join(" · "), "| odds = +2 - 4:", D.oddsOf(calc).join("/") === [0, 1, 2].map(i => Math.round(C.tierProbs(-2, 13, 0, 0)[i] * 100)).join("/"));
D.addManual(st, "shared", "bane"); D.addManual(st, "shared", "bane");
dl = D.diceLine(inp, st); calc = D.creatureCalc(inp, st, "orc");
console.log("two more by hand (5 left): ", dl.dice, "| state", calc.state, "| notes:", dl.bbNotes.join(" · "), "| odds = Doomed +2:", D.oddsOf(calc).join("/") === [0, 1, 2].map(i => Math.round(C.tierProbs(2, 13, 0, 0, "doomed")[i] * 100)).join("/"));
console.log("the chip carries its name:", D.chipHtml(inp.chips[0], st).includes('<small class="rd-bbn">Field</small>'), "| an unnamed one doesn't:", !D.chipHtml(inp.chips[3], st).includes("rd-bbn"));
console.log("the ladder's tip:", D.LADDER_TIP);

console.log("--- the chat card's lines (chatcards.mjs)");
const CC = await import(ROOTURL + "module/chatcards.mjs");
const lines = CC.boonBaneLines({ boonFaces: [1], baneFaces: [1, 1], sources: [{ name: "Low cover (Orc)", banes: 1, bb: "field" }, { name: "Obscured (Orc)", banes: 1, bb: "field" }, { name: "Long weapon", banes: 1, bb: "field" }, { name: "Situational", boons: 1 }] });
console.log(lines.map(x => `${x.kind} ${x.val} ${x.name}${x.bb ? ` [${x.bb}]` : ""}${x.over ? " over" : ""}`).join(" | "));
const br = CC.breakdownHtml({ d1: [6], d2: [7], total: 9, dc: 13, tier: 1, base: 1, boonFaces: [], baneFaces: [], five: "doomed", sources: [{ name: "Engaged", banes: 2 }, { name: "Far", banes: 2 }, { name: "Frightened", banes: 1 }], mods: [] });
console.log("five Banes on the card:", br.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").includes("5 or more Banes left: Doomed instead"));
console.log("retarget: no Boon dice any more, a third d12 for a target that reaches 5:", JSON.stringify(CC.missingDice({ dice: { d: [d(3), d(4)], boonFaces: [], baneFaces: [] } }, [{ boons: 5, banes: 0 }])));

console.log("--- the sources in the code");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), fl = src("module/flanking.mjs"), cont = src("tools/content.mjs");
console.log("High cover: Doomed, no Field Banes:", act.includes('else if (cov.banes >= 3) extraMods.push({ id: "syn:cover", name: "High cover (Doomed)", boons: 0, banes: 0, doomed: true'), "| several targets:", act.includes('else if (cov?.banes >= 3) { row.doomed = true; row.note.push({ text: "High cover", cls: "bane" }); }'));
console.log("Low / Medium cover, Obscured, Long, the Engaged target are Field:", (act.match(/bb: "field"/g) ?? []).length >= 10, "| range and Engaged (you) unnamed:", /id: "syn:engaged", name: "You are Engaged \(2 Banes\)", boons: 0, banes: 2, match/.test(act));
console.log("Saves: Cover gives Field Boons up to 2, High cover Favored:", inl.includes("const n = Math.min(2, c.level)") && inl.includes('favoredLabel: "High cover (Favored)"'));
console.log("Flanking: the cancels first, then 2:", fl.includes("const raw = Math.max(0, others.length - cancelledBy.length)") && fl.includes("boons: Math.min(2, raw)"));
console.log("Prone's are Field in the compendium:", cont.includes('against(1, 0, ["melee"], "field"), against(0, 1, ["ranged"], "field")'));
const I = await import(ROOTURL + "module/inline.mjs");
console.log("@Boon[-1|traits:strike|bb:pressure]:", JSON.stringify(I.parseInline("Boon", "-1|traits:strike|bb:pressure")).match(/"n":-1|"bb":"pressure"/g)?.join(" "));
const AF = await import(ROOTURL + "module/appliedflags.mjs");
const af = AF.appliedFlags({ settings: [{ type: "boonbane", boons: 0, banes: 1, bbName: "pressure", all: [], any: [], none: [], from: [] }], duration: {}, expireOn: [], description: "" }, { conditions: [] });
console.log("an Effect's setting keeps its name on the creature:", af.modifiers[0].bb);

console.log("--- v0.0.302 (Lucas tested v0.0.301: \"Flank is not showing up at all\"): why there is no Flanking, and the Show flanking overlay's model");
const FL = await import(ROOTURL + "module/flanking.mjs");
globalThis.canvas = { grid: { size: 100, isSquare: true, distance: 1 }, tokens: { placeables: [] }, scene: { grid: { distance: 1 } } };
const wpn = (name, traits) => ({ id: name, name, system: { traits: new Set(traits), wielded: true, hands: 1 }, getFlag() {} });
const cr = (name, weapons) => ({ name, system: { reach: 1 }, statuses: new Set(), itemTypes: { weapon: weapons, action: [], talent: [], feature: [] }, items: { get: () => null, filter: () => [] }, effects: [] });
const tk = (name, row, col, disp, actor) => ({ id: name, name, actor, document: { x: col * 100, y: row * 100, width: 1, height: 1, disposition: disp, hidden: false, elevation: 0 } });
const paladin = tk("Paladin", 0, 0, 1, cr("Paladin", [wpn("Greatsword", ["melee", "twohanded"])])), archer = tk("Archer", 2, 1, 1, cr("Archer", [wpn("Crossbow", ["ranged", "twohanded"])]));
const goblin = tk("Goblin", 1, 1, -1, cr("Goblin", [wpn("Rusty Knife", ["melee"])])), fighter = tk("Fighter", 1, 2, 1, cr("Fighter", [wpn("Sword", ["melee"])])), orc = tk("Orc", 0, 1, -1, cr("Orc", [wpn("Cleaver", ["melee"])]));
let toks = [paladin, archer, goblin];
console.log("Paladin and an Archer around the Goblin:", FL.flankingFor(paladin, goblin, toks).boons, "Boons |", FL.flankingWhyNot(paladin, goblin, toks));
toks = [paladin, archer, goblin, fighter];
console.log("a Fighter joins:", FL.flankingFor(paladin, goblin, toks).boons, "Boon, from", FL.flankingFor(paladin, goblin, toks).flankers.join(", "));
toks = [paladin, goblin, fighter, orc];
console.log("an Orc (the Goblin's side) threatens the Paladin:", FL.flankingFor(paladin, goblin, toks).boons, "|", FL.flankingWhyNot(paladin, goblin, toks));
const pic = FL.flankPicture([paladin, archer, goblin, fighter, orc]);
console.log("overlay: flanked", pic.flanked.map(r => `${r.target.name} by ${r.flankers.map(f => `${f.token.name} +${f.boons} (raw ${f.raw}${f.cancels.length ? `, cancelled by ${f.cancels.map(c => c.name).join("+")}` : ""})`).join(", ")}`).join(" | "), "| idle:", pic.idle.map(x => `${x.token.name}: ${x.why}`).join(" | "));
const FO = await import(ROOTURL + "module/flankoverlay.mjs");
console.log("its label:", pic.flanked.map(r => FO.flankedText(r)).join(" | "));
const loeSrc = src("module/loe.mjs");
console.log("the token controls: Line of Effect, Cover height, Show flanking:", ["twod12-loe", "twod12-height", "twod12-flank"].every(n => loeSrc.includes(`name: "${n}"`)), "| no HUD buttons any more:", !loeSrc.includes("renderTokenHUD"));
const pcs = src("module/pcsheet.mjs");
console.log("the sheet's rows have their color again (v0.0.298 had it in a comment):", /\n\s+fc: \(SHEET_FREQ\[reaction \? "reaction" : sec\]/.test(pcs), "| Use's tooltip and the open card:", /\n\s+useTip: r\.useTip \|\| `Use \$\{i\.name\}`, open: r\.open,/.test(pcs), "| a Reaction's Frequency line:", pcs.includes("freqLine: reaction ? rowLines("));

console.log("--- v0.0.303 (Lucas tested v0.0.302)");
const CV = await import(ROOTURL + "module/cardview.mjs");
console.log("chip names, the tag says the rest:", ["Flanking 2", "Target is Engaged (1 Field Bane)", "Obscured by Orc (1 Field Boon)", "Medium cover (2 Banes)"].map(n => CV.cleanLabel(n)).join(" | "));
const BD = await import(ROOTURL + "module/basic-data.mjs"), oa = BD.BASIC_ACTIONS.opportunityAttack;
console.log("Opportunity Attack:", JSON.stringify(oa.traits), "|", oa.trigger, "| only a creature you threaten:", oa.momentThreat === true, "range", oa.momentRange);
const MO = src("module/moment.mjs");
console.log("the Reactions message checks the threat (a Long weapon's min too):", MO.includes("const thr = item.system.momentThreat ? threatProfile(actor) : null;") && MO.includes("d >= thr.min && d <= thr.max"));
const { backSquareIndices } = await import(ROOTURL + "module/moment.mjs").catch(() => ({}));
if (backSquareIndices) console.log("Move back with a Long weapon (threatens 2 only): squares", JSON.stringify(backSquareIndices([0, 1, 2, 3], [{ moment: "enemyMoves", range: 2, min: 2 }], (r, sq) => [1, 2, 3, 4][sq])));
const pcs2 = src("module/pcsheet.mjs"), tpl = src("templates/actor-sheet-pc.hbs");
console.log("NPC rows: no \"back once at Escalation 3\":", !pcs2.includes('subs.push("back once at Escalation 3")'), "| the Basic attack strip:", pcs2.includes("basicAtk: !!(npc && it.basicAttack)") && tpl.includes("{{#if basicAtk}} basicatk{{/if}}"), "| an NPC's Escalation Actions listed out of combat:", pcs2.includes('(inCombat || npc || k !== "apex")'));
console.log("the automation diamond: rows", tpl.includes("{{name}}</a>{{{auto}}}"), "| the open card", src("module/actioncard.mjs").includes("autoChip(it.automation, it.automationNote)"), "| the chat card", CC.headHtml({ name: "Smite", auto: '<i class="autodia auto-mithril"></i>' }).includes('Smite<i class="autodia auto-mithril"></i>'));
