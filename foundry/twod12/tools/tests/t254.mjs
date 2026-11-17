// Run with: node tools/tests/run.mjs (or node tools/tests/t254.mjs)
// v0.0.390 PACK HUD2 (Lucas, 2026-11-17: "All your picks. Remember, things can grant you actions, so make sure to allow increasing APs and keeping the
// style correctly"; the draft foundry/mockups/hud2/index.html): the HUD remade (module/hudview.mjs pure, module/hud.mjs the models and clicks), the
// marks (the same shapes on every turn; AP above the maximum and a second Reaction AP add marks), the carousel's marks, tags and Momentum, the
// Reaction alert (a chime, the name on the map, the HUD's tab).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const V = await import(ROOTURL + "module/hudview.mjs");

console.log("--- the marks");
console.log("4 AP, 2 left:", V.apSquares({ ap: 2, max: 4 }).join(","), "| Slowed 1 (3 regained), 3 left:", V.apSquares({ ap: 3, max: 3, slowed: 1 }).join(","),
  "| Quickened 1 (5):", V.apSquares({ ap: 5, max: 5 }).join(","), "| granted above the maximum (6 of 4):", V.apSquares({ ap: 6, max: 4 }).join(","));
const mk = V.marksHtml({ ap: 2, max: 4, rap: 1, rapMax: 1, strikes: 1 });
console.log("the order, a hairline between:", /hm-ap.*hm-sep.*hm-r.*hm-sep.*hm-sk/.test(mk), "| squares, a diamond, slashes:", (mk.match(/<i( class="(on|x)")?><\/i>/g) ?? []).length === 8,
  "| a Strike left is filled (2 of 3):", (mk.split('class="hm-sk"')[1].match(/class="on"/g) ?? []).length === 2, "| the words on hover:", mk.includes('title="AP 2 of 4"') && mk.includes("Reaction AP 1 of 1") && mk.includes("2 of 3 Strikes left this turn"));
const two = V.marksHtml({ ap: 0, max: 4, rap: 2, rapMax: 2, showStrikes: false });
console.log("a second Reaction AP: two diamonds:", (two.split('class="hm-r"')[1].split("</span>")[0].match(/<i/g) ?? []).length === 2, "| no Strikes when asked:", !two.includes("hm-sk"));
console.log("Escalation ticks (the system's maximum):", (V.escHtml(2, 3).match(/<i/g) ?? []).length, (V.escHtml(2, 6).match(/class="on"/g) ?? []).length);

console.log("--- the bars and the party strip");
const b = V.barHtml({ name: "Resolve", cls: "r", left: 9, max: 12, nl: 2 });
console.log("what is left:", b.includes('style="width:75%"') && b.includes("<b>9/12</b>"), "| Nonlethal hatched beside it:", b.includes('<u style="left:75%;width:16.7%"></u>'), "| its words:", b.includes("2 Nonlethal damage"));
const card = V.partyCardHtml({ key: "a:1", name: "Durgan", ini: "DU", sub: "Dwarf Paladin 1", ad: 16, wd: 12, speed: 4, speedTip: "Speed 4 (base 5; Exhausted 1)", rally: "1/3", marks: mk, esc: V.escHtml(2, 3), tag: { cls: "hurt", text: "Bloodied" }, bars: [{ name: "Vigor", cls: "v", left: 0, max: 24 }], cond: "Slowed 1 · Hindered (EoT)" });
console.log("a card:", card.includes('data-hud="party" data-key="a:1"') && card.includes("<b>16</b><small>AD</small>") && card.includes('class="chg"') && card.includes(">Bloodied<") && card.includes("Slowed 1 · Hindered (EoT)"));
console.log("Momentum at the strip's left:", V.partyStripHtml({ cards: [], momentum: "on" }).includes('<div class="hb-mom">Momentum <b>on</b></div>'), "| none without it:", !V.partyStripHtml({ cards: [] }).includes("hb-mom"));

console.log("--- the bar");
const line = { id: "i1", name: "Judge", freq: "atwill", stamps: [{ ap: 0, label: "0 AP" }, { ap: 1, label: "1 AP", off: true, why: "Not enough AP" }], sub: "10 sq. · next: +1 Bane" };
const ln = V.lineHtml(line);
console.log("a line: a stamp a Version, the off one struck with its reason:", ln.includes('data-hud="use" data-ap="0"') && ln.includes('class="hb-st no" disabled title="Not enough AP"'), "| its roll under it:", ln.includes('<span class="r">10 sq. · next: +1 Bane</span>'));
const gr = V.lineHtml({ name: "Weapon Attack ×2", freq: "granted", grant: { effect: "e1", index: 0 }, stamps: [{ ap: 0, label: "0 AP" }] });
console.log("a granted use (Lucas: things can grant you actions):", gr.includes('data-hud="grant" data-ap="0" data-effect="e1" data-index="0"'));
console.log("columns by Frequency, the word with its square:", V.colsHtml([{ key: "atwill", label: "At-will", fq: "#6aa82e", lines: [line] }]).includes('<div class="hb-col" style="--fq:#6aa82e"><div class="hb-ch">At-will</div>'), "| the order:", V.FREQ_ORDER.join(" "));
const m = { name: "Aveline", sub: "Human Paladin 1", bars: [{ name: "Vigor", cls: "v", left: 18, max: 23 }], guard: 4, rally: { left: 3, max: 3 }, marks: mk, escN: 2, escMax: 3,
  defs: [{ label: "AD", value: 15 }, { gap: true }, { label: "Bo", value: "+2", hud: "attr", data: { key: "body" } }], tabs: [{ k: "act", label: "Actions", count: 3 }, { k: "rx", label: "Reactions", count: 1 }], tab: "act", cols: [], side: { hands: { text: "Longsword", note: "(both hands)", btn: "Regrip" }, conds: [{ id: "e1", name: "Hindered", dur: "EoT" }] } };
const bar = V.tokenBarHtml(m);
console.log("the bar: Guard, Rally with Steel Yourself, AP, Escalation:", bar.includes("<span class=\"k\">Guard</span><b>4</b>") && bar.includes('data-hud="steel"') && bar.includes('data-res="ap"') && bar.includes('data-res="esc"'),
  "| an Attribute rolls:", bar.includes('data-hud="attr" data-key="body"'), "| the tabs:", bar.includes('aria-selected="true" data-hud="tab" data-tab="act"'), "| hands and conditions:", bar.includes("<b>Longsword</b><span class=\"m\">(both hands)</span>") && bar.includes('data-effect="e1" role="button" tabindex="0">Hindered <small>EoT</small>'), "| the fold:", bar.includes('data-hud="fold"'));
const al = V.tokenBarHtml({ ...m, rxAlert: true, side: { rx: { name: "Shield of Faith", cost: "1R", lead: "The Orc Warrior's Cleaver would damage Durgan.", msg: "m1", row: 0 } } });
console.log("a waiting Reaction: the tab pulses, Use and Pass:", al.includes('class="hb-tab alert"') && al.includes('data-hud="rx" data-msg="m1" data-row="0" data-k="rxUse">Use · 1R') && al.includes('data-k="rxPass">Pass'));
const fo = V.tokenBarHtml({ ...m, folded: true, cond: "Hindered (EoT)" });
console.log("folded: one line (the name, Vigor, Guard, AP, Escalation, the conditions):", fo.includes("hb-bar-wrap folded") && fo.includes("Hindered (EoT)") && !fo.includes("hb-tabs"));

console.log("--- the wiring");
const hud = src("module/hud.mjs"), car = src("module/carousel.mjs"), ov = src("module/rxoverlay.mjs"), css = src("styles/system.css");
const H = await import(ROOTURL + "module/hud.mjs").catch(() => null);
console.log("waiting rows this user answers:", JSON.stringify(H?.waitingFor?.({ lead: "<b>Cleaver</b> on Durgan", rows: [{ i: 0, state: "wait", answerer: "u1", actorUuid: "A", itemId: "x", itemName: "Shield of Faith", ap: 1 }, { i: 1, state: "wait", answerer: "u2" }, { i: 2, state: "use", answerer: "u1" }] }, "u1")));
console.log("the settings:", ["hudParty", "hudFolded", "rxChime", "rxFloat", "rxHud"].every(k => hud.includes(`"${k}"`)), "| the chime made by the browser at Foundry's interface volume:", hud.includes("createOscillator") && hud.includes('"globalInterfaceVolume"'),
  "| the name on the map, only for the one who answers:", ov.includes('if (showName && r.answerer === game.user.id)'), "| resources by right-click:", hud.includes("async function adjust(actor, res, d)"));
console.log("the carousel: the HUD's marks, the health tag, Momentum, plain words:", car.includes("marksHtml(") && car.includes('<div class="tp-tag') && car.includes("tc-mom") && css.includes("#twod12-carousel .tp-band { font-variant: normal !important;"),
  "| the styles in rem:", css.includes(".twod12-hud .hb-ln > b { font-size: .81rem;"), "| the bar 150 px, folded 40:", css.includes(".twod12-hud.is-bar { height: 150px;") && css.includes(".twod12-hud.is-bar.is-folded { height: 40px;"));
console.log("--- v0.0.392 (Lucas, testing v0.0.391)");
const g2 = V.tokenBarHtml({ ...m, side: { grants: [{ name: "Weapon Attack → Ogre Chieftain", freq: "granted", grant: { effect: "e1", index: 0, target: "t1" }, stamps: [{ ap: 0, label: "0 AP" }], sub: "from Double Shot" }], cancels: [{ effect: "e1", source: "Double Shot" }] } });
console.log("the granted uses top right, in the accent:", g2.includes('<div class="hb-side"><div class="hb-gr"><div class="hb-grh">Granted by Double Shot') && g2.includes('data-hud="grant" data-ap="0" data-effect="e1" data-index="0" data-target="t1"') && g2.includes('data-hud="grantcancel"'),
  "| the side panel kept in a small window while they wait:", g2.includes('class="hb-bar-wrap rx"'));
const mo = src("module/moment.mjs");
console.log("no Reaction taken: the message removed:", mo.includes('if (!st.rows.some(r => r.state === "use")) {') && mo.includes("await L.msg?.delete();"), "| a bronze bell, not a beep:", hud.includes("[0.5, 0.35, 2.4], [1, 0.6, 1.8]") && !hud.includes("[[880, 0], [1320, 0.12]]"),
  "| the card's x, a second right-click closes it:", hud.includes('class="hc-x"') && hud.includes('.hb-ln[data-item-id="${item.id}"]'), "| the HUD see-through:", css.includes(".twod12-hud.is-bar { background: color-mix(in srgb, var(--hud-bg) 80%, transparent);"));
console.log("--- v0.0.393 (Lucas, testing v0.0.392)");
const act = src("module/actions.mjs"), ri = src("module/rollinput.mjs"), th = src("styles/theme.css");
console.log("no refusal for too few targets:", !act.includes("different creatures as targets"), "| a marking Action rolls with none:", !act.includes("marks first."), "| the multi roll with no creature falls to the DC row:", ri.includes("if (c.multi && (c.perT?.length ?? 0) > 0) creatures = c.perT.map("));
console.log("a used Action says so:", V.lineHtml({ id: "i1", name: "Judge", used: true, stamps: [{ ap: 1, label: "1 AP" }] }).includes('<span class="hb-pv used">used</span>'),
  "| the roll dialog's Tiers in palette A (above the dark set):", th.includes(".twod12-type.twod12-type .twod12.rolldlg .rd-tiers tr.t2 th { background: var(--s-ta-2p) !important;"),
  "| the granted uses on the chat card outlined:", th.includes(".twod12-type .twod12.chat .tline.grantrow .cc-gbtn { flex: 1 1 100% !important;"));
console.log("--- v0.0.394 (Lucas, on the chat leftovers mockup)");
const th4 = src("styles/theme.css"), dock = src("module/turndock.mjs");
console.log("the chat card's traits as words:", th4.includes(".twod12-type.twod12-type .twod12 .tcompact .tchip.tc { background: none !important;"), "| the trait words in ink:", th4.includes(".twod12-type.twod12-type .twod12.chat .trhl { background: none !important;"),
  "| a line under an open header:", th4.includes(".twod12-type.twod12-type .twod12.chat.turnend[open] > summary, .twod12-type.twod12-type .twod12-dock.open .td-hd { border-bottom: 1px solid var(--s-hair) !important; }"),
  "| the HUD's marks on the turn lines:", dock.includes('<b class="hsep"></b><i class="r'), "| Swap without its cost:", src("module/carousel.mjs").includes('<i class="fa-solid fa-right-left"></i> Swap</button>'));
console.log("--- v0.0.395 (Lucas, testing v0.0.394)");
const th5 = src("styles/theme.css"), cc5 = src("module/chatcards.mjs");
console.log("the HUD's cost buttons on hover only:", th5.includes(".twod12-hud .hb-ln:not(.pass):is(:hover, :focus-within) > .hb-sts { display: inline-flex; }"), "| the names fitted:", hud.includes("export function fitNames(") && hud.includes("fitNames(main);"),
  "| the card's facts named:", cc5.includes('<b class="cc-ml">Distance:</b>') && cc5.includes('<b class="cc-ml">Target:</b>'), "| bigger marks, the Strikes on the acting plate only:", th5.includes("#twod12-carousel .tp-marks .hm-ap i { width: 10px !important;") && th5.includes("#twod12-carousel .tp:not(.act) .tp-marks .hm-sk"));
