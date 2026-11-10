// Run with: node tools/tests/run.mjs (or node tools/tests/t211.mjs)
// v0.0.283 (pack chat-cards, brief foundry/mockups/chat-cards-brief.md): the attack card, the Save card and the damage message (chatcards.mjs):
// per-target Tiers on one roll, Favored / Doomed on several targets, Doubles and the Critical, Resist / Weak / Immunity once per subtype per Action,
// Enfeebled per die, Apply all skipping the rows with a choice, riders, the three settings, the retarget.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => false } };
const CC = await import(ROOTURL + "module/chatcards.mjs");
const R = await import(ROOTURL + "module/roll.mjs");
const { perDieDelta } = await import(ROOTURL + "module/calc.mjs");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const src = f => fs.readFileSync(ROOT + f, "utf8");
const D = f => ({ faces: f, total: CC.dieValue(f), first: f[0] });

console.log("--- the ladder: ranges, the arrow (21 steps, DC−7 to DC+13, 4%–95%)");
console.log("ranges DC 11:", CC.ranges(11).join(" · "), "| arrow at 11:", CC.arrowPos(11, 11).toFixed(1), "| at 18:", CC.arrowPos(18, 11).toFixed(1), "| far below / above clamp:", CC.arrowPos(-20, 11), CC.arrowPos(60, 11));
const lm = CC.ladderModel({ total: 14, dc: 11, base: 2, tier: 3, crit: false, doubles: true });
console.log("Doubles raise: faded arrow:", lm.arrow.faded, "| the ↑ in the middle of Tier 3:", lm.up?.toFixed(1), "| lit:", lm.segs.filter(s => s.lit).map(s => s.tier).join(), "| CRIT zone:", lm.critZone);
const hid = CC.ladderModel({ total: 14, dc: 11, base: 2, tier: 2 }, true);
console.log("hidden Defenses: labels", hid.segs.map(s => s.label).join(" · "), "| the arrow in the middle of its Tier:", hid.arrow.pos.toFixed(1));

console.log("--- Doubles and the Critical (keepDice)");
const k = (a, b, flat, dc) => R.keepDice([{ total: CC.dieValue(a), first: a[0] }, { total: CC.dieValue(b), first: b[0] }], "", flat, dc);
const show = x => `total ${x.total} base ${x.base} tier ${x.tier} crit ${x.crit}`;
console.log("3 + 6 + 2 vs 11:", show(k([3], [6], 2, 11)));
console.log("6 + 6 + 2 vs 11 (Doubles: Tier 2 raised to Tier 3, not a Critical):", show(k([6], [6], 2, 11)));
console.log("9 + 9 + 2 vs 11 (Doubles on a Tier 3: a Critical):", show(k([9], [9], 2, 11)));
console.log("12→12→7 and 5 + 2 vs 13 = 36 (DC + 20: a Critical):", show(k([12, 12, 7], [5], 2 + 2 - 1 - 0 + 2 - 1 - 2, 13)));

console.log("--- several targets, one roll: each its own Defense, Boons, Banes, Favored, Doomed");
const roll = { dice: { d: [D([9]), D([7]), D([7])], boonFaces: [2], baneFaces: [1] }, mod: 2, adj: 0, adjLabel: "", manualBoons: 0, manualBanes: 0, favored: false, doomed: false, forced: 0 };
const specs = [
  { name: "Bandit Thug", uuid: "t1", dc: 13, dcLabel: "WD", boons: 0, banes: 0, sources: [] },
  { name: "Grave Wisp", uuid: "t2", dc: 13, dcLabel: "WD", boons: 0, banes: 0, sources: [], favored: true },
  { name: "Ogre Chieftain", uuid: "t3", dc: 14, dcLabel: "WD", boons: 0, banes: 0, sources: [], doomed: true }];
const rows = CC.recheckRows(roll, specs, R.resolveShared);
for (const r of rows) console.log(`${r.name.padEnd(15)} ${show(r.chk)} | kept ${CC.dieValue(r.chk.d1)} · ${CC.dieValue(r.chk.d2)} | ${CC.keptNote(r.chk)}`);
const boons = CC.recheckRows(roll, [{ ...specs[0], boons: 1, sources: [{ name: "Flanking", boons: 1 }] }, { ...specs[0], name: "Other", dc: 17, banes: 1, sources: [{ name: "Frightened", banes: 1 }] }], R.resolveShared);
console.log("a Boon on one, a Bane and another DC on the other:", boons.map(r => `${r.name} ${r.chk.total} vs ${r.chk.dc}: Tier ${r.chk.tier}`).join(" | "));
console.log("Boon · Bane lines name their source:", CC.boonBaneLines(boons[0].chk).map(x => `${x.kind} ${x.val} ${x.name}`).join(", "), "|", CC.boonBaneLines(boons[1].chk).map(x => `${x.kind} ${x.val} ${x.name}`).join(", "));
console.log("dice still needed: a Favored target on a 2d12 roll:", JSON.stringify(CC.missingDice({ ...roll, dice: { ...roll.dice, d: roll.dice.d.slice(0, 2) } }, [specs[1]])), "| 3 Boons with 1 rolled:", JSON.stringify(CC.missingDice(roll, [{ boons: 3 }])));
console.log("the dialog's DC doesn't override each target's Defense (useAction keeps each dcInfo):", src("module/actions.mjs").includes("const dcOverride = null;"));

console.log("--- the attack card");
const smite = { kind: "attack", name: "Smite", freq: "round", cost: "2 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Weapon", names: ["Bandit Thug"] }, hasDamage: true,
  outcomes: { 1: { parts: [{ pool: "B", t: "0", sub: "Sl" }, { pool: "M", t: "1d6", sub: "Ho" }], riders: [] }, 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }, { pool: "M", t: "2d6", sub: "Ho" }, { pool: "M", t: "1d6", sub: "Ho" }], riders: [] }, 3: { parts: [{ pool: "B", t: "2d6", sub: "Sl" }, { pool: "B", t: "2", sub: "Sl" }, { pool: "M", t: "2d10", sub: "Ho" }], riders: ["Pushed 2"] } },
  effectsHtml: "Bright light 2 around the target.", effectsFrom: 2, critHtml: "the target is Prone.", flavor: "Your weapon blazes with holy light.", designer: { odds: [{ name: "", text: "T1 20% · T2 50% · T3 30%" }], ruler: "worth 2.1 AP", mithril: "Mithril" } };
const row = (d1, d2, total, dc, extra = {}) => ({ name: "Bandit Thug", uuid: "t1", total, dc, dcLabel: "AD", d1, d2, boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Signature" }], ...extra, ...(() => { const x = R.keepDice([D(d1), D(d2)], "", total - CC.dieValue(d1) - CC.dieValue(d2), dc); return { tier: x.tier, base: x.base, crit: x.crit, doubles: x.doubles }; })() });
const t2 = CC.attackCardHtml({ ...smite, rows: [row([3], [6], 11, 11)] });
console.log("Tier 2: stamp", txt(t2.match(/<div class="cc-stamp[\s\S]*?<\/div>/)[0]), "| outcome:", txt(t2.match(/<div class="cc-outcome">[\s\S]*?<\/div><\/div>/)[0]), "| the effect (no label):", t2.includes("Bright light 2") && !t2.includes("Effects:"), "| no Critical row on a Tier 2:", !t2.includes("cc-crit"));
const t1 = CC.attackCardHtml({ ...smite, rows: [row([2], [3], 7, 11)] });
console.log("Tier 1: a pool with 0 is left out:", txt(t1.match(/<div class="cc-outcome">[\s\S]*?<\/div><\/div>/)[0]), "| no effect text, and no \"No Effects\" line:", !t1.includes("Bright light") && !/No Effects/i.test(t1));
const t3 = CC.attackCardHtml({ ...smite, rows: [row([6], [6], 14, 11)] });
console.log("Doubles raise: stamp", txt(t3.match(/<div class="cc-stamp[\s\S]*?<\/div>/)[0]), "| chip:", txt(t3.match(/<span class="cc-chips">[\s\S]*?<\/span><\/span>/)[0]), "| the Critical row muted:", txt(t3.match(/<div class="cc-critline">[\s\S]*?<\/div>/)?.[0]), "| a rider:", txt(t3.match(/<div class="cc-rider">[\s\S]*?<\/div>/)?.[0]));
const cr = CC.attackCardHtml({ ...smite, rows: [row([12, 12, 7], [5], 36, 13, { boonFaces: [2], baneFaces: [1, 0], sources: [{ name: "Flanking", boons: 1 }, { name: "Frightened", banes: 1 }, { name: "Dim light", banes: 1 }], mods: [{ v: 2, label: "Signature" }, { v: -1, label: "Situational" }] })] });
console.log("a Critical by total: stamp", txt(cr.match(/<div class="cc-stamp[\s\S]*?<\/div>/)[0]), "| the box:", txt(cr.match(/<div class="cc-critbox">[\s\S]*?<\/div>/)?.[0]), "| explosion chain:", txt(cr.match(/<span class="cc-muted">[^<]*<\/span>/)?.[0]), "| total row:", txt(cr.match(/<span class="cc-btot">[\s\S]*?<\/span><\/span><\/span>/)?.[0]));
console.log("Boon / Bane lines:", txt(cr.match(/<span class="cc-bl">Boon · Bane<\/span>[\s\S]*?<span class="cc-bl">Modifiers/)?.[0]).replace(/Modifiers$/, ""), "| the modifiers colored:", (cr.match(/cc-plus">\+2 Signature/) ?? []).length, (cr.match(/cc-minus">−1 Situational/) ?? []).length);
console.log("every clickable thing is a button with aria-expanded where it toggles:", /<button type="button" class="cc-ladder" data-cc-toggle="r0" aria-expanded="false"/.test(cr), "| the retarget has a label:", /aria-label="Target the selected tokens"/.test(cr), "| decorative icons hidden:", !/<i class="fa-solid [^"]*"(?! aria-hidden)/.test(cr));

console.log("--- settings: Designer mode, hidden Defenses (players), the GM always sees everything");
const des = CC.attackCardHtml({ ...smite, rows: [row([3], [6], 11, 11)] }, CC.viewOf({ gm: true, designer: true }));
console.log("Designer mode off: no odds, Ruler or automation anywhere:", !/Odds|Ruler|Mithril/.test(t2), "| on:", txt(des.match(/<div class="cc-designer">[\s\S]*?<\/div>/)?.[0]));
const pv = CC.attackCardHtml({ ...smite, rows: [row([9], [9], 20, 11)] }, CC.viewOf({ gm: false, hideDef: true }));
console.log("player, Defenses hidden: no AD number:", !/AD 11|vs AD/.test(pv), "| no ranges:", !/≤10|11–17|18\+/.test(pv), "| no threshold:", !/31\+|33\+|Doubles, or/.test(pv), "| the badge:", txt(pv.match(/<span class="cc-badge(?: vsk-\w+)?">[^<]*<\/span>/)?.[0]), "| the footer:", txt(pv.match(/<div class="cc-pfoot">[\s\S]*?<\/div>/)?.[0]));
const gmv = CC.attackCardHtml({ ...smite, rows: [row([9], [9], 20, 11)] }, CC.viewOf({ gm: true, hideDef: true }));
console.log("the GM with the same setting sees the Defense:", /AD 11/.test(gmv) && !gmv.includes("cc-pfoot"));
console.log("retarget: only for the author and the GM, gone once locked:", CC.attackCardHtml({ ...smite, rows: [row([3], [6], 11, 11)] }, CC.viewOf({ gm: false })).includes("retargetAction"), CC.attackCardHtml({ ...smite, rows: [row([3], [6], 11, 11)] }, CC.viewOf({ gm: false, author: true })).includes("retargetAction"), CC.attackCardHtml({ ...smite, locked: true, rows: [row([3], [6], 11, 11)] }).includes("retargetAction"));
console.log("the retarget is refused after damage was applied (actions.mjs):", src("module/actions.mjs").includes('if (msg.getFlag("twod12", "ccApplied")) return ui.notifications.warn'), "| the damage message locks its roll card:", src("module/ccdamage.mjs").includes('src.setFlag(F, "ccApplied", true)'));

console.log("--- several targets on the card");
const many = CC.attackCardHtml({ ...smite, name: "Word of Radiance", shared: { d: [[9], [7], [7]], mod: 2 }, rows: rows.map(r => CC.FULL_VIEW && { ...r.chk, name: r.name, uuid: r.uuid, boons: 0, banes: 0, mods: [{ v: 2, label: "Power" }] }) });
console.log("shared roll:", txt(many.match(/<div class="cc-shared">[\s\S]*?<\/div>/)[0]), "| a row per creature:", (many.match(/class="cc-crow"/g) ?? []).length, "| defenses:", [...many.matchAll(/cc-cdef">([\s\S]*?)<\/span><button/g)].map(m => txt(m[1])).join(" | "));
console.log("grouped by Tier:", txt(many.match(/<div class="cc-groups">[\s\S]*$/)[0]).slice(0, 140));
const pmany = CC.attackCardHtml({ ...smite, shared: { d: [[9], [7], [7]], mod: 2 }, rows: rows.map(r => ({ ...r.chk, name: r.name, uuid: r.uuid, mods: [] })) }, CC.viewOf({ hideDef: true }));
console.log("player view: no WD labels:", !/WD 1\d/.test(pmany));

console.log("--- the Save card");
const save = { kind: "save", name: "Rebuke", freq: "turn", cost: "1R", tline: { targets: "The triggering creature", dist: "5 sq.", names: ["Ogre Chieftain"], retargetKind: "retargetSave" }, saveName: "Appeal Save", dc: 13,
  tiers: { 1: { parts: [{ pool: "M", t: "1d8", sub: "Ho" }], riders: ["Pushed 2", "Frightened of you for 1 round"] }, 2: { parts: [{ pool: "M", t: "1d6", sub: "Ho" }], riders: ["Pushed 1"] }, 3: { parts: [], riders: [] } },
  target: { uuid: "ogre", name: "Ogre Chieftain" }, result: null, triggerHtml: "An enemy within 5 squares makes a [Strike] Action against an ally.", triggerLabel: "Trigger", flavor: "You answer for them." };
const before = CC.saveCardHtml(save, CC.viewOf({ gm: true })), other = CC.saveCardHtml(save, CC.viewOf({ gm: false, owns: () => false })), owner = CC.saveCardHtml(save, CC.viewOf({ gm: false, owns: u => u === "ogre" }));
console.log("Tier 1 on top (v0.0.335, the Action preview's order):", [...before.matchAll(/<b>Tier (\d)<\/b><small>([^<]*)/g)].map(m => `T${m[1]} ${m[2]}`).join(" | "), "| the DC:", txt(before.match(/<div class="cc-savehead">[\s\S]*?<\/div>/)[0]), "| no effect on Tier 3:", before.includes("No effect."));
console.log("before the roll: the owner rolls:", owner.includes("Roll Appeal Save"), "| the others wait:", txt(other.match(/<div class="cc-muted cc-wait">[^<]*/)?.[0]), "| no row lit:", !/cc-srow t\d hit/.test(before));
const chk = { name: "Ogre Chieftain", uuid: "ogre", total: 8, dc: 13, dcLabel: "DC", tier: 1, base: 1, crit: false, doubles: false, d1: [4], d2: [5], boonFaces: [], baneFaces: [1, 1], sources: [{ name: "Vulnerable 1", banes: 2 }], mods: [{ v: 1, label: "Appeal" }] };
const after = CC.saveCardHtml({ ...save, result: chk, hasDamage: true }, CC.viewOf({ gm: true }));
console.log("after: the result row is a button:", /<button type="button" class="cc-srow t1 hit"/.test(after), "| its total:", txt(after.match(/<span class="cc-stotal">[^<]*/)?.[0]), "| the others dim:", (after.match(/cc-srow t\d dim/g) ?? []).length, "| Their Tier:", txt(after.match(/Their Tier \d/)?.[0]), "| Damage at the bottom:", after.includes("ccSaveDamage"));
console.log("v0.0.294 (brief section 12): the Trigger under the Save line, above the Tier rows, then one diamond:", after.indexOf("cc-savehead") < after.indexOf("cc-trigger") && after.indexOf("cc-trigger") < after.indexOf("cc-div") && after.indexOf("cc-div") < after.indexOf("cc-srows") && after.indexOf("cc-srows") < after.indexOf("cc-flavor"), "|", txt(after.match(/<div class="cc-trigger plain">[\s\S]*?<\/div>/)?.[0]));

console.log("--- Resist / Weak / Immunity: once per subtype per Action, across both pools; Resist capped at what that subtype dealt");
const mods = CC.parseDmgMods("Resist 5 Fire, Weak 2 Holy, Immunity Cold, Resist Fire 3");
console.log("parsed:", JSON.stringify(mods));
const imp = [{ pool: "B", sub: "Sl", total: 6 }, { pool: "B", sub: "Fi", total: 4 }, { pool: "M", sub: "Ho", total: 10 }];
console.log("Fire Imp: ♥ 6 Sl + 4 Fi, 🧠 10 Ho:", CC.dmgModsFor(imp, mods).map(x => `${x.v > 0 ? "+" : ""}${x.v} ${x.label}`).join(", "), "→", JSON.stringify(CC.afterResist(imp, mods)));
const two = [{ pool: "B", sub: "Fi", total: 3 }, { pool: "M", sub: "Fi", total: 5 }];
console.log("[V] 3 Fi + [R] 5 Fi vs Resist 5 Fire: one reduction:", JSON.stringify(CC.afterResist(two, CC.parseDmgMods("Resist 5 Fire"))), "| the creature chooses Vigor first:", JSON.stringify(CC.afterResist(two, CC.parseDmgMods("Resist 5 Fire"), { choices: { Fi: "B" } })), "| a choice:", CC.choiceOf(two, CC.parseDmgMods("Resist 5 Fire")));
console.log("Holy from two sources is one subtype (Weak once):", JSON.stringify(CC.afterResist([{ pool: "M", sub: "Ho", total: 7 }, { pool: "M", sub: "Ho", total: 3 }], CC.parseDmgMods("Weak 2 Holy"))), "| Immunity Cold:", JSON.stringify(CC.afterResist([{ pool: "B", sub: "Co", total: 9 }], mods)));
console.log("Half first, then Resist:", JSON.stringify(CC.afterResist([{ pool: "B", sub: "Fi", total: 9 }], CC.parseDmgMods("Resist 2 Fire"), { factor: 0.5 })));

console.log("--- Guard, the choices, Apply all");
console.log("Guard 8 over ♥ 13 and 🧠 3: a choice:", CC.choiceOf([{ pool: "B", sub: "Sl", total: 13 }, { pool: "M", sub: "Ho", total: 3 }], CC.parseDmgMods(""), 8), "| Vigor first:", JSON.stringify(CC.guardSplit({ B: 13, M: 3 }, 8, "B")), "| Resolve first:", JSON.stringify(CC.guardSplit({ B: 13, M: 3 }, 8, "M")));
console.log("no choice: one pool, or a Guard that takes it all:", CC.choiceOf([{ pool: "B", total: 13 }], {}, 8) === "" && CC.choiceOf([{ pool: "B", total: 3 }, { pool: "M", total: 3 }], {}, 8) === "");
console.log("Apply all applies:", JSON.stringify(CC.applyAllRows([{ choice: "" }, { choice: "guard" }, { choice: "", applied: {} }, { choice: "resist" }, { choice: "" }])), "(skips the rows with a choice and the applied ones)");

console.log("--- riders, Enfeebled, Empowered");
console.log("a rider lands with damage over 0 after Resist:", CC.riderLands(CC.afterResist([{ pool: "B", sub: "Fi", total: 4 }], CC.parseDmgMods("Resist 5 Fire")).B), CC.riderLands(3), "| the damage message gates them:", src("module/ccdamage.mjs").includes("(!x.rider || landed)"));
console.log("Enfeebled 2 on 1, 3, 6: each die at least 1:", perDieDelta([1, 3, 6], -2), "| Empowered 1 on 2d6:", perDieDelta([3, 4], 1));
console.log("the Save's damage per die too (inline.mjs no longer adds the step to the total):", !src("module/inline.mjs").includes("c.total = Math.max(0, c.total + step * k)"));

console.log("--- the damage message");
const dm = { kind: "dmg", name: "Weapon Attack", nl: false, groups: [{ tier: 3, comps: [{ pool: "B", sub: "Sl", total: 9, formula: "2d6", dice: [{ faces: 6, results: [4, 5] }], src: "Greatsword" }, { pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }, { pool: "B", sub: "Sl", total: 2, dice: [], label: "Heavy Blows" }, { pool: "M", sub: "Ho", total: 3, formula: "1d6", dice: [{ faces: 6, results: [3] }], src: "Radiant Zeal" }], riders: ["Pushed 2"], rows: [0, 1] }],
  rows: [{ name: "Bandit Thug", mods: [{ v: -8, label: "Guard", kind: "guard" }], choice: "guard", applied: null }, { name: "Fire Imp", mods: [{ v: 2, label: "Weak Holy" }], applied: { took: { B: 5, M: 3 }, state: "bloodied", factor: 1 } }], designer: { avg: 14.5, atLeast: 38 } };
const dh = CC.damageCardHtml(dm, CC.viewOf({ gm: true }));
console.log("stamp:", txt(dh.match(/<button type="button" class="cc-stamp[\s\S]*?<\/button>/)[0]), "| the tag:", txt(dh.match(/class="cc-nl[^"]*">[^<]*/)[0].replace(/^class="[^"]*">/, "")), "| pools:", txt(dh.match(/<button type="button" class="cc-pools"[\s\S]*?<\/button>/)[0]));
console.log("the instance with its Weapon Modifier as a line:", txt(dh.match(/<div class="cc-inst">[\s\S]*?Total[\s\S]*?<\/b>/)[0]));
console.log("rows:", [...dh.matchAll(/<div class="cc-trow[^"]*">[\s\S]*?(?=<div class="cc-trow|<\/div><\/div><\/div>)/g)].map(m => txt(m[0])).join(" || "));
console.log("v0.0.288: the header is the title alone:", txt(dh.match(/<div class="cc-dhead">[\s\S]*?<\/div>/)[0]), "| the bottom row (one row left: no Apply all, the tag alone):", txt(dh.match(/<div class="cc-applyall">[\s\S]*?<\/div>/)?.[0]));
console.log("removed: no Avg line, Lethal selector, Block, None:", !/Avg|class="kind"|Block|>None</.test(dh), "| Designer mode adds the average:", txt(CC.damageCardHtml(dm, CC.viewOf({ gm: true, designer: true })).match(/<div class="cc-designer">[\s\S]*?<\/div>/)?.[0]));
const hp = CC.damageCardHtml(dm, CC.viewOf({ gm: false, hideTgt: true }));
console.log("target details hidden: no Guard / Weak / Took:", !/Guard|Weak|Took/.test(hp), "| names and state kept:", txt(hp.match(/<div class="cc-trows">[\s\S]*?<\/div><\/div>/)?.[0]), "| Bloodied stays:", hp.includes("Bloodied"), "| footer:", txt(hp.match(/<div class="cc-pfoot">[\s\S]*?<\/div>/)?.[0]));
console.log("the roller's own pools stay:", hp.includes("cc-pools"), "| a player who isn't the author has no Apply:", !CC.damageCardHtml(dm, CC.viewOf({ gm: false })).includes("ccApply"));

console.log("--- v0.0.284 (Lucas tested v0.0.283)");
const flat = CC.damageCardHtml({ kind: "dmg", name: "Cudgel", groups: [{ tier: 2, comps: [{ pool: "B", sub: "Bl", total: 1, formula: "1d4", dice: [{ faces: 4, results: [1] }] }, { pool: "B", sub: "Bl", total: 2, kind: "A", dice: [], label: "Weapon" }], rows: [] }], rows: [] });
console.log("a Modifier with the damage's subtype folds in: one block:", (flat.match(/class="cc-inst"/g) ?? []).length, "|", txt(flat.match(/<div class="cc-inst">[\s\S]*?<\/div><\/div>/)?.[0] ?? flat.match(/<div class="cc-inst">[\s\S]*$/)[0]).slice(0, 80));
const only = CC.instancesOf([{ pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }]), onlyH = CC.damageCardHtml({ kind: "dmg", name: "Cleave", groups: [{ tier: 2, comps: [{ pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }], rows: [] }], rows: [] });
console.log("a flat amount alone: its label:", only[0].mods.map(m => `${m.v} ${m.label}`).join(), "| no \"Dice: none\", no Total:", !/>Dice<|none<|>Total</.test(onlyH.match(/<div class="cc-break dmg"[\s\S]*$/)[0]));
console.log("an untyped bonus folds into its pool's first instance:", JSON.stringify(CC.instancesOf([{ pool: "B", sub: "Sl", total: 8, dice: [{ faces: 6, results: [3, 5] }] }, { pool: "B", sub: "", total: 2, dice: [], label: "Heavy Blows" }]).map(x => [x.sub, x.total, x.mods.map(m => m.label).join()])));
console.log("the pool total in its own column:", /class="cc-ptot">3</.test(flat), "| the Tier group names as chips:", (many.match(/class="cc-nchip"/g) ?? []).length);
console.log("no \"targeting x, y\" chat line after placing an area:", !src("module/template.mjs").includes('"targeting " + tokens.map'));

console.log("--- v0.0.286 (Lucas tested v0.0.285)");
console.log("each creature's Defense as a framed badge:", [...many.matchAll(/class="cc-cdef"><span class="cc-badge(?: vsk-\w+)?">([^<]*)<\/span>/g)].map(m => m[1]).join(" | "), "| hidden for players:", !/cc-cdef"><span class="cc-badge/.test(pmany));
const ms = { ...save, target: undefined, creatures: [{ uuid: "a", name: "Bandit Thug", result: chk, hasDamage: true }, { uuid: "b", name: "Grave Wisp", result: { ...chk, total: 15, tier: 2, base: 2 }, hasDamage: true }, { uuid: "c", name: "Ogre Chieftain", result: null }] };
const msGM = CC.saveCardHtml(ms, CC.viewOf({ gm: true })), msP = CC.saveCardHtml(ms, CC.viewOf({ gm: false, owns: () => false }));
console.log("a Save on three creatures: a row each:", (msGM.match(/class="cc-crow save"/g) ?? []).length, "| who got each Tier:", [...msGM.matchAll(/<b>Tier (\d)<\/b>[\s\S]*?<span class="cc-sbody">(<span class="cc-who">[\s\S]*?<\/span><\/span>)?/g)].map(m => `T${m[1]}: ${txt(m[2] ?? "") || "-"}`).join(" | "));
console.log("the owner rolls on their row, the others wait:", (msGM.match(/data-twod12="saveRoll" data-idx="2"/g) ?? []).length, (msP.match(/Waiting/g) ?? []).length, "| Damage once someone rolled:", msGM.includes("ccSaveDamage"), "| a one-target card of v0.0.283 still reads:", CC.saveCreatures({ target: { uuid: "x", name: "X" }, result: null }).length);
console.log("Save Actions use the new card with several targets (actions.mjs):", src("module/actions.mjs").includes("if (cmsg) {"), "| and with none (v0.0.317):", !src("module/actions.mjs").includes("if (targets.length >= 1 && cmsg) {"));

console.log("--- v0.0.287 (Lucas tested v0.0.286)");
const twoT = CC.damageCardHtml({ kind: "dmg", name: "Word of Radiance", groups: [{ tier: 2, comps: [{ pool: "M", sub: "Ho", total: 16, formula: "2d10", dice: [{ faces: 10, results: [7, 9] }] }], rows: [0] }, { tier: 1, comps: [{ pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }] }], rows: [1] }], rows: [{ name: "Grave Wisp", mods: [] }, { name: "Bandit Thug", mods: [] }] });
console.log("the stamp holds every Tier:", [...twoT.matchAll(/class="cc-sband (t\d)"><b>(\d+)/g)].map(m => `${m[1]} ${m[2]}`).join(" | "));
console.log("the Save card's target row at the bottom:", /cc-flavor[\s\S]*class="cc-foot"/.test(after) && !/cc-savehead[\s\S]*class="cc-tline">/.test(after), "| its Damage there:", /class="cc-foot">[\s\S]*ccSaveDamage/.test(after), "| the pills read T1:", /class="cc-pill t1">T1</.test(CC.tierPill(1)));
