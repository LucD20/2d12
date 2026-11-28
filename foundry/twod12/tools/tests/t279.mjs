// Run with: node tools/tests/run.mjs (or node tools/tests/t279.mjs)
// v0.0.441 (pack SHEETS-HUD; Lucas, 2026-11-18, the HUD mockup foundry/mockups/hud3: "All recommended"): the HUD's identity column in words (D2),
// the conditions as marks with their word up to three (D4, decision 1), the Basic tab as the four groups with what can't be used dimmed in place
// (D1, decision 3), the right column: the Situational section, the Hands, the macro bar (D3), a waiting Reaction only there (decision 2), a
// Setup's movement and End movement in it (D7), no third "Cancel" on a question with a "no" (R5).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const HV = await import(ROOTURL + "module/hudview.mjs"), PB = await import(ROOTURL + "module/pickbar.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("--- D4: the conditions");
const two = [{ id: "c1", name: "Prone", dur: "", img: "icons/svg/falling.svg" }, { id: "c2", name: "Hindered", dur: "EoT", img: "" }];
const four = [...two, { id: "c3", name: "Dazed", dur: "" }, { id: "c4", name: "Lingering", dur: "2" }];
console.log("two:", strip(HV.condsHtml(two)), "| their words:", !HV.condsHtml(two).includes("h3-conds more"), "| a click opens the Effect:", HV.condsHtml(two).includes('data-hud="effect" data-effect="c1"'), "| its picture:", HV.condsHtml(two).includes('<img src="icons/svg/falling.svg"'));
console.log("four: overflow button + popover:", HV.condsHtml(four).includes('data-hud="condpop"') && HV.condPopHtml(four).includes("Debuffs"), "|", strip(HV.condsHtml(four)), "| none: the row stays:", HV.condsHtml([]) === '<div class="h3-conds"></div>');
console.log("--- D1: the Basic tab");
const groups = [{ label: "Attack", lines: [{ id: "a", name: "Weapon Attack", fqColor: "#4c7a2e", strike: true, stamps: [{ ap: 1, label: "1 AP" }] }, { id: "b", name: "Charge", fqColor: "#2c5d9e", stamps: [{ ap: 2, label: "2 AP", off: true, why: "Prone" }] }] },
  { label: "Movement", lines: [{ id: "c", name: "Stand", fqColor: "#4c7a2e", stamps: [{ ap: 1, label: "1 AP" }] }] }];
const b = HV.basicTabHtml(groups);
console.log(strip(b), "| groups:", (b.match(/class="h3-bg"/g) ?? []).length, "| Charge dim in its place:", /class="h3-bl off"[^>]*data-item-id="b"/.test(b), "| its stamp struck, still clicked (v0.0.453):", b.includes('class="hb-st no" data-hud="use"'), "| a Strike's strip:", b.includes('class="h3-bl strike"'));
console.log("--- D3: the right column");
const empty = HV.rightHtml({ tiles: [{ name: "Hunting Bow", grip: "Main" }, { name: "Free (Fists)", grip: "Off", free: true }] });
console.log("empty:", strip(empty), "| the ask slot is in the Situational section:", /class="h3-sit"><div class="hb-ask"><\/div><div class="h3-sit-urg">/.test(empty)   /* v0.0.529 (rule A 5): the tab's first thing */, "| the macro bar's slot last:", empty.endsWith('<div class="h3-hot"></div></div></div>'));
const rx = HV.rightHtml({ rx: { name: "Snap Shot", cost: "1R", lead: "The Goblin Sneak would enter a square adjacent to you.", msg: "m1", row: 2 } });
console.log("a Reaction:", strip(rx), "| Use and Pass answer it:", rx.includes('data-hud="rx" data-msg="m1" data-row="2" data-k="rxUse"') && rx.includes('data-k="rxPass"'), "| lit:", rx.includes('class="h3-sit on urg"'));
const prone = HV.rightHtml({ prone: { lead: "Prone", text: "Your only Move Actions: Stand, Crawl, Break Free.", btns: [{ label: "Stand · 1 AP", hud: "use", data: { item: "s1", ap: 1 } }, { label: "Crawl 3 · 2 AP", hud: "use", data: { item: "c1", ap: 2 }, off: true, why: "Not enough AP" }] } });
console.log("Prone:", strip(prone), "| Stand uses it:", prone.includes('data-hud="use" data-item="s1" data-ap="1"'), "| Crawl 3 off:", prone.includes("disabled"));
// v0.0.446 (Lucas: "Make each a tab, but only show the 'Situational' tab when there is something happening. When it happens, change tabs to the situational automatically")
console.log("--- the right column's tabs");
console.log("nothing waiting: the Hands and the macro bar shown, no tabs:", empty.includes('<div class="h3-side" data-rtab="main">'), "| something waiting: Situational shown:", rx.includes('<div class="h3-side has-sit has-urg" data-rtab="sit">'), "| the Hands tab chosen while something waits:", HV.rightHtml({ view: "main", rx: { name: "Snap Shot", cost: "1R", lead: "x", msg: "m1", row: 2 }, tiles: [{ name: "Bow", grip: "Main" }] }).includes('data-rtab="main"'));
console.log("without hands the tab reads Macros:", HV.rightHtml({ rx: { name: "Snap Shot", cost: "1R", lead: "x", msg: "m1", row: 2 } }).includes('data-rtab="main" aria-selected="false">Macros</button>'), "| the HUD switches to it when something starts waiting (v0.0.539: not for a granted use alone), and back after:", src("module/hud.mjs").includes('if ((pull && !st.sitWas) || (urg && urgKey !== st.sitKey)) st.view = "sit";') && src("module/hud.mjs").includes('const pull = urg || availEls.some(el => !el.classList.contains("hb-gr"));') && src("module/hud.mjs").includes('if (!has && st.view === "sit") st.view = st.rview;'), "| a question, a Setup or a movement in the ask slot counts:", src("module/hud.mjs").includes('".h3-sit-urg > .h3-si, .hb-ask > *"') && src("module/hud.mjs").includes('".h3-sit-avail > .h3-si, .h3-sit-avail > .hb-gr"'));
console.log("--- D2: the bar");
const m = { h3: true, name: "Sylwen", sub: "Elf Archer 1", bars: [{ name: "Vigor", cls: "v", left: 11, max: 17 }], guard: 0, rally: { left: 6, max: 6 }, marks: "<span class=\"hm\"></span>", escN: 2, escMax: 6, conds: two,
  defs: [{ key: "ad", word: "AD", value: 12 }, { key: "wd", word: "WD", value: 12 }, { key: "speed", word: "Speed", value: 3, chg: true }, { key: "weapon", word: "Weapon", value: "+2" }, { key: "power", word: "Power", value: "+1" }, { gap: true },
    { word: "Body", value: "−1", hud: "attr", data: { key: "body" } }, { word: "Instinct", value: "+2", hud: "attr", data: { key: "instinct" } }],
  tabs: [{ k: "act", label: "Actions", count: 3 }, { k: "basic", label: "Basic", count: 19 }], tab: "basic", basicGroups: groups, right: {} };
const bar = HV.tokenBarHtml(m);
console.log(strip(bar.slice(bar.indexOf('<div class="h3-id">'), bar.indexOf('<div class="hb-mid">'))));
console.log("the words, not Wpn / Pow / Bo / In:", !/<small>(Wpn|Pow|Bo|In)<\/small>/.test(bar), "| Instinct rolls:", bar.includes('data-hud="attr" data-key="instinct"'), "| a changed Speed marked:", bar.includes('class="h3-p chg"'), "| the Basic tab drawn:", bar.includes('class="h3-basic"'), "| folded keeps the old line:", HV.tokenBarHtml({ ...m, folded: true }).includes("hb-bar-wrap folded"));
console.log("--- the wiring");
const hud = src("module/hud.mjs"), setup = src("module/setup.mjs"), move = src("module/move.mjs");
console.log("decision 2, no jump to the Reactions tab:", hud.includes("  const tab = st.tab;") && !hud.includes('wait && setting("rxHud", true) ? "rx" : st.tab'));
console.log("D7: a Setup's movement asks in the HUD:", setup.includes("hud?.hudAskSlot?.()") && setup.includes("Continue: the roll") && setup.includes("Cancel the Action"), "| End movement too:", /function freeMoveBar[\s\S]{0,1400}hudAskSlot/.test(move));
console.log("D3: the macro bar in the right column, parked before a redraw:", hud.includes('root?.querySelector(".hud-main .h3-hot")') && hud.includes("parkHotbar(); main.innerHTML = html;"));
console.log("R5: no Cancel with a \"no\":", !PB.pickBarHtml({ text: "Reduce by 1?", options: [{ id: "no", label: "Not now" }, { id: "yes", label: "Reduce by 1" }] }).includes("__cancel"), "| Cancel otherwise:", PB.pickBarHtml({ text: "Who?", options: [{ id: "a", label: "Orc" }] }).includes("__cancel"));
console.log("the alert's bug (taller than the side panel): the Situational section scrolls inside its row:", src("styles/system.css").includes(".twod12-hud .h3-sit { padding: 4px 9px; overflow-y: auto;"));
