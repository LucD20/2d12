// Run with: node tools/tests/run.mjs (or node tools/tests/t214.mjs)
// v0.0.292 (PACK ROLL-DIALOG): the roll dialog's pure model (module/rolldlg.mjs), with the brief's examples (section 13): Smite at 2 AP on one
// target, Word of Radiance at 3 AP on three creatures, the player view. Also writes the examples' HTML for a visual check (tools/tests/out/).
import fs from "node:fs";
const ROOTURL = new URL("../../", import.meta.url).href;
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const tr = (key, group, label = key) => ({ key, label, group, groupLabel: { roll: "Roll", requires: "Requires", kind: "Kind", keywords: "Keywords" }[group] });

const smiteV = (ap, t) => ({ ap, cost: `${ap} AP`, disabled: ap === 3, why: ap === 3 ? "You have 2 AP left" : "", noTiers: false,
  traits: [tr("signature", "roll", "Signature"), tr("weapon", "roll", "Weapon"), tr("melee", "requires", "Melee"), tr("strike", "kind", "Strike"), tr("divine", "keywords", "Divine")],
  meta: { targets: "One creature", dist: "Weapon", vs: "AD" }, tiers: t, crit: "", effects: ap >= 2 ? "The target sheds Bright light in a 2 Emanation and takes 1 Bane when they try to Hide, for 1 round." : "" });
const smite = {
  name: "Smite", flavor: "Your weapon blazes with holy light.", freqLabel: "Round", freqColor: "#185FA5", ap: 2,
  versions: [
    smiteV(1, { 1: { parts: [{ pool: "M", t: "1d4", sub: "Ho" }] }, 2: { parts: [{ pool: "M", t: "1d6", sub: "Ho" }] }, 3: { parts: [{ pool: "M", t: "2d6", sub: "Ho" }] } }),
    smiteV(2, { 1: { parts: [{ pool: "M", t: "1d6", sub: "Ho" }, { pool: "B", t: "0", sub: "Sl" }] }, 2: { parts: [{ pool: "B", t: "1d8", sub: "Sl" }, { pool: "M", t: "2d6", sub: "Ho" }] }, 3: { parts: [{ pool: "B", t: "2d6", sub: "Sl" }, { pool: "M", t: "2d10", sub: "Ho" }] } }),
    smiteV(3, { 1: { parts: [{ pool: "M", t: "2d6", sub: "Ho" }] }, 2: { parts: [{ pool: "M", t: "3d6", sub: "Ho" }] }, 3: { parts: [{ pool: "M", t: "3d10", sub: "Ho" }] } })
  ],
  roll: { mod: 2, name: "Signature" }, multi: false,
  chips: [
    { id: "pass:rz", bonusKey: "rz", scope: "shared", row: "passives", kind: "pass", label: "Radiant Zeal", tag: "+1d6 Ho", tiers: [1, 2, 3], pool: "M", start: "on", tip: "The first Strike each round that deals damage: +1d6 Holy" },
    { id: "pass:hb", bonusKey: "hb", scope: "shared", row: "passives", kind: "pass", label: "Heavy Blows", tag: "+2", tiers: [3], pool: "B", start: "on", tip: "+2 damage on a Tier 3 with a Two-handed weapon" },
    { id: "fr:0", fx: "fr:0", scope: "shared", row: "banes", kind: "bane", n: 1, label: "Frightened", start: "on", tip: "Frightened of the Ogre: 1 Bane on all your rolls" },
    { id: "syn:nl", scope: "shared", row: "banes", kind: "bane", n: 1, special: "nl", label: "Nonlethal", start: "off" },
    { id: "syn:exh", scope: "shared", row: "flat", kind: "minus", n: 1, label: "Exhausted 1 −1", srcName: "Exhausted 1", start: "on" },
    { id: "syn:emp:0", scope: "shared", row: "damage", kind: "emp", n: 1, label: "Empowered 1", srcName: "Bloodlust", start: "on" },
    { id: "syn:enf:0", scope: "shared", row: "damage", kind: "enf", n: 1, label: "Enfeebled 1", srcName: "Weakened", start: "on" },
    { id: "syn:flanking", fx: "syn:flanking", scope: "thug", row: "boons", kind: "boon", n: 1, label: "Flanking", start: "on", tip: "Jared flanks it with you: 1 Boon on [Melee] Actions" }
  ],
  creatures: [{ uuid: "thug", name: "Bandit Thug", def: "AD", dc: 11 }],
  rollModes: [["publicroll", "Public roll"], ["gmroll", "Private GM roll"], ["blindroll", "Blind GM roll"], ["selfroll", "Self roll"]], rollMode: "publicroll"
};

console.log("--- Smite, 2 AP, one target (brief 13)");
let st = RD.newState(smite);
const dl = RD.diceLine(smite, st);
console.log("dice line:", `${dl.dice} ${dl.mod >= 0 ? "+" : "-"} ${Math.abs(dl.mod)} ${dl.names.join(", ")} ▲${dl.boons} ▼${dl.banes}`);
console.log("Empowered 1 + Enfeebled 1:", JSON.stringify(RD.stepNet(smite, st)));
console.log("T3 pools:", JSON.stringify(RD.poolLines(smite.versions[1].tiers[3], RD.tierTags(smite, st, 3).map(c => ({ pool: c.pool, tag: c.tag })))));
console.log("T1 pools (no 0 line):", JSON.stringify(RD.poolLines(smite.versions[1].tiers[1], RD.tierTags(smite, st, 1).map(c => ({ pool: c.pool, tag: c.tag })))));
console.log("Heavy Blows only on T3:", [1, 2, 3].map(n => RD.tierTags(smite, st, n).map(c => c.label).join("+")).join(" | "));
console.log("ladder DC 11:", RD.ladder(11).map(s => s.label).join(" | "));
console.log("3 AP disabled:", smite.versions[2].disabled, smite.versions[2].why, "| v0.0.293: not blocked at 3 AP:", JSON.stringify(RD.blockedReason(smite, { ...st, ap: 3 })), "| a warning:", RD.warnings(smite, { ...st, ap: 3 }).join(" / "));
const odds = RD.oddsOf({ mod: 2, dc: 11, boons: 1, banes: 1, state: "" }, false), oddsC = RD.oddsOf({ mod: 2, dc: 11, boons: 1, banes: 1, state: "" }, true);
console.log("odds (2d12 + 2, 1 Boon, 1 Bane vs 11):", RD.oddsLine(odds), "| with a Crit row:", RD.oddsLine(oddsC));
let r = RD.result(smite, st);
console.log("result:", JSON.stringify({ ap: r.ap, fx: r.fx, bonusOn: r.bonusOn, boons: r.boons, banes: r.banes, mod: r.mod, adjLabel: r.adjLabel, dc: r.dc, favored: r.favored, doomed: r.doomed, empowered: r.empowered, enfeebled: r.enfeebled, switchNl: r.switchNl }));
console.log("flags (shared):", JSON.stringify(r.rd.shared));
console.log("flags (creature):", JSON.stringify(r.rd.creatures));

console.log("--- chip states: auto chips toggle, a chip switched off stays visible, start-off folds, n/a can't toggle");
let f = RD.foldRow(RD.chipsOf(smite, st, "shared"), st, "shared", "banes");
console.log("Banes row:", f.shown.map(c => c.label).join(", "), "| folded off:", f.off.length);
RD.toggleChip(st, smite.chips[2]);
f = RD.foldRow(RD.chipsOf(smite, st, "shared"), st, "shared", "banes");
console.log("Frightened off:", RD.chipOn(smite.chips[2], st), "| still shown:", f.shown.map(c => c.label).join(", "), "| dice line:", RD.diceLine(smite, st).banes, "Banes");
RD.toggleChip(st, smite.chips[2]);
st.fold["shared|banes|off"] = true;
f = RD.foldRow(RD.chipsOf(smite, st, "shared"), st, "shared", "banes");
console.log("+1 off opened:", f.shown.map(c => `${c.label}${RD.chipOn(c, st) ? "" : " (off)"}`).join(", "), "| button:", f.offOpen ? "hide off" : "");
RD.toggleChip(st, smite.chips[3]);
r = RD.result(smite, st);
console.log("Nonlethal on: switchNl", r.switchNl, "| Banes", RD.diceLine(smite, st).banes, "| flags lethal:", r.rd.shared.lethal);
RD.toggleChip(st, smite.chips[0]);
console.log("Radiant Zeal off: T1 tags", RD.tierTags(smite, st, 1).length, "| bonusOn", RD.result(smite, st).bonusOn.join(","));
const na = { id: "x", start: "na", why: "Word of Radiance is not a Strike" };
RD.toggleChip(st, na);
console.log("n/a toggled:", RD.chipOn(na, st), "| 'x' in toggled:", "x" in st.toggled);

console.log("--- quick buttons, repeat clicks and ×");
st = RD.newState(smite);
RD.addManual(st, "shared", "boon"); RD.addManual(st, "shared", "boon");
RD.addManual(st, "shared", "plus");
RD.addManual(st, "shared", "emp"); RD.addManual(st, "shared", "emp");
RD.addManual(st, "shared", "fav"); RD.addManual(st, "shared", "fav");
console.log("manual chips:", RD.manualChips(st, "shared").map(c => c.label).join(" | "));
console.log("Exhausted 1 + Situational +1 = flat", RD.tally(RD.chipsOf(smite, st, "shared"), st).flat, "| dice line mod:", RD.diceLine(smite, st).mod, "| Empowered 2 manual + Empowered 1 auto:", RD.stepNet(smite, st).net === 2 - 1 ? "net 1 (2 - 1)" : RD.stepNet(smite, st).net);
console.log("Favored:", RD.diceLine(smite, st).dice);
RD.addManual(st, "shared", "doom");
console.log("Favored + Doomed:", RD.diceLine(smite, st).dice);
RD.stepManual(st, "shared", "boon");
console.log("right-click on Situational \u00d72:", RD.manualChips(st, "shared").find(c => c.kind === "boon").label);
r = RD.result(smite, st);
console.log("result: boons", r.boons, "| favored", r.favored, "| doomed", r.doomed, "| flags Situational:", JSON.stringify(r.rd.shared.boons));
RD.removeManual(st, "shared", "doom"); RD.removeManual(st, "shared", "emp");
{ const s3 = RD.newState(smite); RD.addManual(s3, "shared", "bane"); RD.addManual(s3, "shared", "bane"); RD.addManual(s3, "shared", "bane"); RD.removeManual(s3, "shared", "bane"); console.log("\u00d7 on Situational \u00d73 removes it all:", RD.manualChips(s3, "shared").length === 0); }
console.log("net 0 shows no line:", JSON.stringify(RD.stepNet(smite, RD.newState(smite)).line));
console.log("Doomed alone:", RD.diceLine(smite, (() => { const s = RD.newState(smite); RD.addManual(s, "shared", "doom"); return s; })()).dice);

console.log("--- Word of Radiance, 3 AP, three creatures (brief 13)");
const wor = {
  name: "Word of Radiance", freqLabel: "Encounter", freqColor: "#A32D2D", ap: 3, multi: true, area: { label: "3 Burst", placed: true },
  flavor: "You speak a word, and light pours from your hands across everything that stands against you.",
  versions: [{ ap: 3, cost: "3 AP", traits: [tr("power", "roll", "Power"), tr("area", "kind", "Area"), tr("divine", "keywords", "Divine")], meta: { targets: "All enemies", dist: "10 sq.", vs: "WD" },
    tiers: { 1: { parts: [{ pool: "M", t: "2d6", sub: "Ho" }] }, 2: { parts: [{ pool: "M", t: "2d10", sub: "Ho" }], riders: ["Pushed 1"] }, 3: { parts: [{ pool: "M", t: "3d8", sub: "Ho" }], riders: ["Pushed 2"] } }, crit: "The target is also Prone." }],
  roll: { mod: 2, name: "Power" },
  chips: [
    { id: "passna:Radiant Zeal", scope: "shared", row: "passives", kind: "pass", label: "Radiant Zeal", start: "na", why: "Word of Radiance is not a Strike" },
    { id: "fr:0", fx: "fr:0", scope: "shared", row: "banes", kind: "bane", n: 1, label: "Frightened", start: "on" },
    { id: "syn:nl", scope: "shared", row: "banes", kind: "bane", n: 1, special: "nl", label: "Nonlethal", start: "off" },
    { id: "wisp|vul:0", fx: "wisp|vul:0", scope: "wisp", row: "boons", kind: "boon", n: 1, label: "Vulnerable 1", start: "on" },
    { id: "syn:cover|ogre", fx: "syn:cover|ogre", scope: "ogre", row: "banes", kind: "bane", n: 1, label: "Cover (Low)", start: "on", tip: "From the Point of Origin" },
    { id: "syn:hidden-na|ogre", fx: "syn:hidden-na|ogre", scope: "ogre", row: "banes", kind: "bane", n: 1, label: "Hidden", start: "na", why: "an Area ignores Senses" }
  ],
  creatures: [{ uuid: "thug", name: "Bandit Thug", def: "WD", dc: 13 }, { uuid: "wisp", name: "Grave Wisp", def: "WD", dc: 13 }, { uuid: "ogre", name: "Ogre Chieftain", size: "Large", def: "WD", dc: 14 }]
};
st = RD.newState(wor);
console.log("quick buttons:", RD.quickKinds(true).map(k => RD.QUICK_LABEL[k]).join(" "), "| one target:", RD.quickKinds(false).length);
console.log("before Favored / Doomed:", JSON.stringify(RD.diceText(wor, st)));
RD.addManual(st, "wisp", "fav"); RD.addManual(st, "ogre", "doom");
const three = RD.anyThree(wor, st);
console.log("dice line:", JSON.stringify(RD.diceLine(wor, st)));
for (const c of wor.creatures) { const k = RD.creatureCalc(wor, st, c.uuid); console.log(`${c.name.padEnd(15)} ${RD.creatureDice(k, three).padEnd(16)} ${k.mod >= 0 ? "+" : ""}${k.mod} ▲${k.boons} ▼${k.banes}  ${c.def} ${k.dc}  odds ${RD.oddsLine(RD.oddsOf(k, true))}`); }
console.log("Ogre's ladder:", RD.ladder(14, true).map(s => s.label).join(" | "));
console.log("ladder DC 13 with a Critical row:", RD.ladder(13, true).map(s => s.label).join(" | "));
const of = RD.foldRow(RD.chipsOf(wor, st, "ogre"), st, "ogre", "banes");
console.log("Ogre's Banes:", of.shown.map(c => c.label).join(", "), "| n/a folded:", of.na.map(c => c.label).join(", "));
console.log("Passives:", JSON.stringify(RD.foldRow(RD.chipsOf(wor, st, "shared"), st, "shared", "passives").na.map(c => c.label)));
RD.addManual(st, "thug", "fav"); RD.addManual(st, "thug", "doom");
console.log("Thug Favored + Doomed:", RD.creatureDice(RD.creatureCalc(wor, st, "thug"), RD.anyThree(wor, st)));
r = RD.result(wor, st);
console.log("perTarget:", JSON.stringify(r.perTarget));
console.log("fx sent (no n/a, no off):", JSON.stringify(r.fx), "| shared favored:", r.favored);
console.log("flags creatures:", JSON.stringify(r.rd.creatures.map(c => ({ name: c.name, banes: c.banes, favored: c.favored, doomed: c.doomed, dice: c.dice }))));
console.log("only Favored on one, Doomed on another, Thug cancels: anyThree", RD.anyThree(wor, st));
const st2 = RD.newState(wor); RD.addManual(st2, "thug", "fav"); RD.addManual(st2, "thug", "doom");
console.log("a lone cancelling pair is not 3d12:", JSON.stringify(RD.diceText(wor, st2)));

console.log("--- blocked Roll, and (v0.0.293) what is only a warning");
console.log("no target:", RD.blockedReason({ ...smite, creatures: [] }, RD.newState(smite)));
const spent = { ...smite, blocked: ["Used: available again at the start of your next turn"] }, far = { ...smite, creatures: [{ ...smite.creatures[0], blocked: "out of range (12 sq., the maximum is 10)" }] };
console.log("Frequency spent (warning):", JSON.stringify(RD.blockedReason(spent, RD.newState(smite))), RD.warnings(spent, RD.newState(smite)).join(""), "| no yellow warning (v0.0.370, Lucas):", !RD.dialogHtml(spent, RD.newState(smite)).includes('class="rd-warn"'));
console.log("out of range (warning):", JSON.stringify(RD.blockedReason(far, RD.newState(smite))), RD.warnings(far, RD.newState(smite)).join(""));
console.log("area not placed:", RD.blockedReason({ ...wor, area: { label: "3 Burst", placed: false } }, RD.newState(wor)));
console.log("can roll:", JSON.stringify(RD.blockedReason(smite, RD.newState(smite))));
st = RD.newState(smite); st.removed = ["thug"];
console.log("the last target removed:", RD.blockedReason(smite, st));

console.log("--- Versions: switching updates the Tier table and the meta line");
st = RD.newState(smite);
const h2 = RD.dialogHtml(smite, st); st.ap = 1; const h1 = RD.dialogHtml(smite, st);
console.log("2 AP has 2d10:", h2.includes("2d10"), "| 1 AP has 2d10:", h1.includes("2d10"), "| 1 AP has 1d4:", h1.includes("1d4"), "| Effects row only at 2 AP:", h2.includes("rd-tiers") && h2.includes("Bright light"), !h1.includes("Bright light"));
console.log("3 AP button struck through, can be chosen, its reason on hover:", /data-ap="3"[^>]*data-tooltip="You have 2 AP left" class="cant"/.test(h2) && !/data-ap="3"[^>]*disabled/.test(h2), "| aria-pressed on 2 AP:", /data-ap="2" aria-pressed="true"/.test(h2));
console.log("meta lines (v0.0.294: the book's format):", [...h2.matchAll(/<div class="rd-meta">(.*?)<\/div>/g)].map(m => m[1].replace(/<[^>]+>/g, "")).join(" / "));
{ const r = { name: "R", versions: [{ ap: 1, cost: "1R", traits: [], meta: { escalation: 2, targets: "The triggering creature", dist: "5 sq.", vs: "Appeal Save", requirements: "A free hand", trigger: "An enemy attacks", triggerKind: "trigger" }, tiers: {} }], roll: { mod: 0 }, chips: [], creatures: [] };
  console.log("the order: Escalation, Targets, Distance ✦ Vs., Requirements, Trigger:", [...RD.dialogHtml(r, RD.newState(r)).matchAll(/<div class="rd-meta">(.*?)<\/div>/g)].map(m => m[1].replace(/<[^>]+>/g, "")).join(" / ")); }
console.log("no Tier prefix in Effects, no T1 \"0\" line:", !/T2, T3/.test(h2), !/>0 <b class="rd-sub"/.test(h2));

console.log("--- the player view (Hide enemy Defenses on) and Designer mode");
const hv = RD.dialogHtml({ ...smite, hideDef: true }, RD.newState(smite));
console.log("badge 'AD' only:", /<span class="rd-def"[^>]*>AD<\/span>/.test(hv), "| ladder:", hv.includes("rd-ladder"), "| footer:", hv.includes("Player view · enemy Defenses hidden by the GM"), "| Tier table stays:", hv.includes("rd-tiers"), "| counts stay:", hv.includes("▲1"));
const dv = RD.dialogHtml({ ...smite, designer: true }, RD.newState(smite)), nd = RD.dialogHtml(smite, RD.newState(smite));
console.log("Designer: odds and force a Tier:", dv.includes("T1 ") && dv.includes("Force a Tier"), "| off:", nd.includes("Force a Tier"));
st = RD.newState(smite); st.forceTier = 3;
console.log("forced Tier 3 sent:", RD.result(smite, st).forceTier);

console.log("--- accessibility: real buttons, aria");
console.log("chip body aria-pressed:", /class="rd-cbody" data-act="chip" data-id="fr:0" aria-pressed="true"/.test(nd), "| fold aria-expanded:", /data-act="fold"[^>]*aria-expanded="false">\+1 off/.test(nd), "| no div with data-act:", !/<(div|span)[^>]*data-act=/.test(nd));
const wst = RD.newState(wor); wst.fold["shared|passives|na"] = true;
const wv = RD.dialogHtml(wor, wst);
console.log("creature lines aria-expanded:", (wv.match(/data-act="open"[^>]*aria-expanded="false"/g) ?? []).length, "| remove labels:", /aria-label="Remove Bandit Thug"/.test(wv), "| n/a body disabled:", /data-id="passna:Radiant Zeal" aria-disabled="true"/.test(wv));
console.log("no radius above 6px in the block:", (() => { const css = fs.readFileSync(new URL("../../styles/system.css", import.meta.url), "utf8"); const blk = css.slice(css.indexOf("v0.0.292 PACK ROLL-DIALOG")); return !/border-radius:\s*(?:[7-9]|\d{2,})px/.test(blk); })());
console.log("one tooltip only (no title attributes):", !/ title="/.test(nd + wv + dv + hv));

console.log("--- v0.0.293: averages and chances under each Tier (the setting: everyone / GM only / hidden)");
console.log("die averages: d6", RD.dieAvg(6), "| d6 Empowered 1", RD.dieAvg(6, 1), "| d4 Enfeebled 1 (at least 1):", RD.dieAvg(4, -1), "| d4 Enfeebled 3:", RD.dieAvg(4, -3));
console.log("expressions: 2d6 + 2 =", RD.exprAvg("2d6 + 2"), "| 1d10+2 Enfeebled 1 =", RD.exprAvg("1d10+2", -1));
st = RD.newState(smite);
const sOn = { ...smite, showAvg: true, showOdds: true };
console.log("Smite 2 AP averages (Radiant Zeal and Heavy Blows on, net 0):", [1, 2, 3].map(n => RD.tierStats(sOn, st, sOn.versions[1])[n].avg).join(" | "));
RD.toggleChip(st, smite.chips[0]);
console.log("Radiant Zeal off:", [1, 2, 3].map(n => RD.tierStats(sOn, st, sOn.versions[1])[n].avg).join(" | "));
RD.toggleChip(st, smite.chips[0]); RD.addManual(st, "shared", "emp"); RD.addManual(st, "shared", "emp");
console.log("Empowered 2 by hand (net 1):", [1, 2, 3].map(n => RD.tierStats(sOn, st, sOn.versions[1])[n].avg).join(" | "));
st = RD.newState(smite);
const hs = RD.dialogHtml(sOn, st);
console.log("lines under the Tiers:", (hs.match(/<div class="rd-stat">[^<]*<\/div>/g) ?? []).map(x => x.replace(/<[^>]+>/g, "")).join(" | "));
console.log("setting off: no lines:", !RD.dialogHtml(smite, st).includes("rd-stat"), "| player with hidden Defenses: averages only:", (RD.dialogHtml({ ...sOn, hideDef: true }, st).match(/<div class="rd-stat">[^<]*<\/div>/g) ?? []).map(x => x.replace(/<[^>]+>/g, "")).join(" | "));
console.log("Smite's ladder with its chances:", (hs.match(/<div class="rd-ladder[\s\S]*?<\/div>/) ?? [""])[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), "| the ≤ in its own span:", hs.includes('<span class="rd-le">≤</span>'));
console.log("no chances in the ladder when the setting hides them:", !RD.dialogHtml(smite, st).includes("rd-lpct"));
const w2 = RD.newState(wor); RD.addManual(w2, "wisp", "fav"); RD.addManual(w2, "ogre", "doom");
w2.open.ogre = true; w2.open.wisp = true;
console.log("Word of Radiance, the expanded creatures' ladders:", [...RD.dialogHtml({ ...wor, showAvg: true, showOdds: true }, w2).matchAll(/<div class="rd-ladder[\s\S]*?<\/div>/g)].map(m => m[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).join(" || "));
console.log("Word of Radiance, under each Tier:", (RD.dialogHtml({ ...wor, showAvg: true, showOdds: true }, w2).match(/<div class="rd-stat">[^<]*<\/div>/g) ?? []).map(x => x.replace(/<[^>]+>/g, "")).join(" | "));

console.log("--- v0.0.293: Favored / Doomed as a d12, right-click a hand-added chip");
st = RD.newState(smite); RD.addManual(st, "shared", "fav"); RD.addManual(st, "shared", "doom"); RD.addManual(st, "shared", "boon");
const hp = RD.dialogHtml(smite, st);
console.log("Favored chip: d12 F:", /data-id="man:shared:fav"[^>]*><svg class="rd-pip d12 fav"[\s\S]*?>F<\/text>/.test(hp), "| Doomed: d12 D:", /data-id="man:shared:doom"[^>]*><svg class="rd-pip d12 doom"/.test(hp), "| Boon keeps the triangle:", /data-id="man:shared:boon"[^>]*><span class="rd-pip up"/.test(hp), "| quick buttons too:", /data-k="fav"><svg/.test(hp));
console.log("hand-added chips carry data-manual (right-click):", (hp.match(/data-manual="/g) ?? []).length, "| an auto chip doesn't:", !/data-manual="fr:0"/.test(hp));

console.log("--- v0.0.293: a Save Action (Rebuke) and a Version with no roll (Opportunity Attack) in the new dialog");
const rebuke = { name: "Rebuke", freqLabel: "Turn", ap: 1, reaction: true, save: { label: "Appeal Save", dc: 13 }, showAvg: true, showOdds: true,
  versions: [{ ap: 1, cost: "1R", traits: [tr("power", "roll", "Power"), tr("save", "roll", "Save"), tr("divine", "keywords", "Divine")], meta: { targets: "The triggering creature", dist: "5 sq.", vs: "Appeal Save", trigger: "An enemy within 5 squares makes a [Strike] Action against an ally." },
    tiers: { 1: { parts: [{ pool: "M", t: "1d8", sub: "Ho" }], riders: ["Pushed 2, and Frightened of you for 1 round"] }, 2: { parts: [{ pool: "M", t: "1d6", sub: "Ho" }], riders: ["Pushed 1"] }, 3: { parts: [] } } }],
  roll: { mod: 2, name: "Power" }, chips: [{ id: "syn:emp:0", scope: "shared", row: "damage", kind: "emp", n: 1, label: "Empowered 1", start: "on" }], creatures: [{ uuid: "thug", name: "Bandit Thug", def: "DC", dc: 13 }] };
const hr = RD.dialogHtml(rebuke, RD.newState(rebuke));
console.log("Rebuke: their roll line:", (hr.match(/<div class="rd-dice">([\s\S]*?)<\/div>/) ?? [])[1].replace(/<[^>]+>/g, ""), "| quick buttons:", (hr.match(/data-act="quick"[^>]*data-k="\w+"/g) ?? []).map(x => x.match(/data-k="(\w+)"/)[1]).join(","), "| creature badge:", /<span class="rd-def">Appeal Save 13<\/span>/.test(hr), "| no ladder:", !hr.includes("rd-ladder"), "| button:", (hr.match(/data-act="roll"[^>]*>(\w+)</) ?? [])[1], "| averages:", (hr.match(/<div class="rd-stat">[^<]*<\/div>/g) ?? []).map(x => x.replace(/<[^>]+>/g, "")).join(" | "));
const oa = { name: "Opportunity Attack", freqLabel: "At-will", ap: 1, reaction: true, versions: [{ ap: 1, cost: "1R", noTiers: true, traits: [], meta: { targets: "The triggering creature", trigger: "A creature within 1 square would leave a square during a Move Action.", triggerKind: "interrupt" }, effects: "You can make a Weapon Attack (1A) against the triggering creature." }],
  roll: { mod: 0, name: "" }, chips: [], creatures: [{ uuid: "thug", name: "Bandit Thug", def: "AD", dc: 11 }] };
const ho = RD.dialogHtml(oa, RD.newState(oa));
console.log("Opportunity Attack: Effects row:", /<tr class="rd-eff"><th scope="row">Effects<\/th><td>You can make/.test(ho), "| no roll panel:", !ho.includes("rd-roll"), "| target line:", (ho.match(/<div class="rd-tline">([^<]*)<\/div>/) ?? [])[1], "| button:", (ho.match(/data-act="roll"[^>]*>(\w+)</) ?? [])[1], "| can use:", JSON.stringify(RD.blockedReason(oa, RD.newState(oa))), "| no target needed:", JSON.stringify(RD.blockedReason({ ...oa, creatures: [] }, RD.newState(oa))));

// contrast of the muted texts on the parchment (WCAG: 4.5:1)
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100; };
console.log("contrast #7a6f5f on #f4ede0:", ratio("#7a6f5f", "#f4ede0"), "| #6b6152 (used):", ratio("#6b6152", "#f4ede0"), "| #5d5446 on #e8dec8:", ratio("#5d5446", "#e8dec8"), "| #625a4e n/a on #e8dec8:", ratio("#625a4e", "#e8dec8"), "| #7a5400 on #f4ede0:", ratio("#7a5400", "#f4ede0"), "| #8a1c13 on #f4ede0:", ratio("#8a1c13", "#f4ede0"));

// the examples' HTML, for a look in a browser (not compared): only with RD_OUT=<folder>
if (process.env.RD_OUT) try {
  const out = new URL(`file://${process.env.RD_OUT.replace(/\/?$/, "/")}`); fs.mkdirSync(out, { recursive: true });
  const s1 = RD.newState(smite); s1.fold["shared|banes|off"] = false;
  const s2 = RD.newState(wor); RD.addManual(s2, "wisp", "fav"); RD.addManual(s2, "ogre", "doom"); s2.open.ogre = true;
  fs.writeFileSync(new URL("rolldlg-examples.json", out), JSON.stringify({ smite: RD.dialogHtml(smite, s1), area: RD.dialogHtml(wor, s2), hidden: RD.dialogHtml({ ...smite, hideDef: true }, RD.newState(smite)), designer: RD.dialogHtml({ ...wor, designer: true }, s2) }));
} catch (e) { /* no write access: fine */ }

console.log("--- v0.0.295: the Vs. value in its color, \"Vs.\" bold");
const U = await import(ROOTURL + "module/util.mjs");
for (const v of ["AD", "WD", "Appeal Save", "Body or Instinct", "AD (Weapon mode) or WD (Power mode)", "DC 13"]) console.log(JSON.stringify(v), "→", U.vsColored(v).replace(/ style="color:(#\w+);font-weight:700"/g, "[$1]"));
console.log("the dialog's meta line:", (RD.dialogHtml(smite, RD.newState(smite)).match(/<b>Vs\.<\/b> <span class="vsv" style="color:#9a4a00/) ?? []).length === 1);
