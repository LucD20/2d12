// Run with: node tools/tests/run.mjs (or node tools/tests/t325.mjs)
// v0.0.529 (Lucas, 2026-11-27: "use mockup A"; foundry/mockups/sit-fixed, rule A): the Situational tab's buttons never move. Every question is one
// frame (sitframe.mjs askHtml: title, text, what changes, options, keys, then the buttons with the way out last); a button that can only sometimes
// be used is shown off, never hidden (the Line's and the Charge's Ties, Undo move, Take back a step, Charge, Hiding's Add, a creature already
// pushed); the question is the tab's first thing; a list entry's quiet button is last; Granted has one line a source, each with its Cancel.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const SF = await import(ROOTURL + "module/sitframe.mjs"), HV = await import(ROOTURL + "module/hudview.mjs"), PB = await import(ROOTURL + "module/pickbar.mjs");
const bands = h => [...h.matchAll(/<(?:span|i) class="(lb-[a-z]+|fa-solid [^"]*)/g)].map(m => m[1].startsWith("fa-") ? "icon" : m[1]).filter(c => ["icon", "lb-head", "lb-text", "lb-stat", "lb-side", "lb-keys", "lb-acts"].includes(c));
const top = h => { const out = []; let d = 0; for (const m of h.matchAll(/<(\/?)(span|i|b|button|kbd|small)\b([^>]*)>/g)) { if (m[1]) { d--; continue; } if (d === 0) { const c = /class="([^"]*)"/.exec(m[3])?.[1] ?? m[2]; out.push(c.startsWith("fa-") ? "icon" : c.split(" ").find(x => x.startsWith("lb-")) ?? c); } d++; } return out; };

console.log("--- 1. the frame: its bands in one order, the way out last");
const all = SF.askHtml({ icon: "fa-burst", head: "Place Line 3", tag: "within 10 sq.", text: "Click to place.", lines: 1, stat: "2 enemies", statCls: "two", opts: "<button>x</button>", keys: "<kbd>Esc</kbd> Cancel", left: SF.tiesHtml(false), give: '<button type="button" class="lb-give">Cancel</button>' });
console.log("every band:", top(all).join(" > "));
console.log("the text's lines:", /class="lb-text" style="--n:1"/.test(all), "| the way out after the spacer, the last thing:", /<span class="lb-sp"><\/span><button type="button" class="lb-give">Cancel<\/button><\/span>$/.test(all));
const bare = SF.askHtml({ text: "Who gains <b>Guard</b>?", give: "" });
console.log("no title, no status, no options, no keys:", top(bare).join(" > "), "| the row of buttons kept:", bare.endsWith('<span class="lb-acts"><span class="lb-sp"></span></span>'));
console.log("--- 2. the lead");
for (const t of ["<b>Judge</b>: which creature? Click its token.", '<b>Minions</b> <span class="lb-tag">3 of the squad left</span><span class="lb-q">Which one goes?</span>', "Who gains <b>Guard 1d8+3</b>?", "<b>Push 2</b> away from <b>Durgan</b>: click a creature."]) console.log(JSON.stringify(SF.splitLead(t)));
console.log("--- 3. the Ties: always drawn, off with no tie");
console.log("no tie:", SF.tiesHtml(false));
console.log("a tie, right chosen:", SF.tiesHtml(true, "right"));
const el = { hidden: true, style: { display: "none", visibility: "hidden" }, cls: new Set(), classList: { toggle(c, on) { if (on) el.cls.add(c); else el.cls.delete(c); } }, btns: [{ dataset: { side: "left" }, disabled: false, c: new Set() }, { dataset: { side: "right" }, disabled: false, c: new Set() }] };
el.btns.forEach(b => { b.classList = { toggle(c, on) { if (on) b.c.add(c); else b.c.delete(c); } }; });
el.querySelectorAll = () => el.btns;
SF.setTies(el, false, "left"); console.log("setTies, no tie:", JSON.stringify({ hidden: el.hidden, display: el.style.display, vis: el.style.visibility, off: el.cls.has("off"), disabled: el.btns.map(b => b.disabled), on: el.btns.map(b => b.c.has("on")) }));
SF.setTies(el, true, "left"); console.log("setTies, a tie:", JSON.stringify({ off: el.cls.has("off"), disabled: el.btns.map(b => b.disabled), on: el.btns.map(b => b.c.has("on")) }));
console.log("--- 4. the area's status line and the Charge's buttons");
for (const o of [{}, { placed: true, count: "2 enemies, 1 ally", cut: true }, { placed: true, far: true, dist: 12, within: 10 }]) console.log(JSON.stringify(o), "->", JSON.stringify(SF.areaStat(o)));
for (const o of [{}, { target: true }, { target: true, blocked: true }, { target: true, short: true }]) console.log(JSON.stringify(o), "->", JSON.stringify(SF.chargeButtons(o)));
console.log("--- 5. the pick bar in the frame");
const pb = PB.pickBarHtml({ icon: "fa-hand", text: "<b>Push 2</b> away from <b>Durgan</b>: click a creature.", done: "Done: the rest stay", cancel: false, options: [{ id: "0", label: "Goblin Sneak", img: "g.png", off: true }, { id: "1", label: "Warg", img: "w.png" }] });
console.log("bands:", top(pb).join(" > "), "| the moved one in its place, off:", /data-id="0"[^>]*disabled/.test(pb) && !/data-id="1"[^>]*disabled/.test(pb), "| Done at the left:", pb.includes('<span class="lb-acts"><button type="button" class="lb-go" data-id="__done">'));
const pc = PB.pickBarHtml({ text: "<b>Kaela</b>: the [C] damage goes to", options: [{ id: "v", label: "Vigor" }, { id: "r", label: "Resolve" }] });
console.log("a question with Cancel:", top(pc).join(" > "), "| the title:", pc.includes('<span class="lb-head"><b>Kaela</b></span>'), "| Cancel at the right end:", pc.endsWith('<span class="lb-sp"></span><button type="button" class="lb-give" data-id="__cancel">Cancel</button></span>'));
console.log("--- 6. the right column: the question first, the quiet button last, Granted a line a source, Hiding's Add first");
const r = HV.rightHtml({ rxs: [{ name: "Opportunity Attack", cost: "1R", lead: "Goblin Sneak leaves your reach.", msg: "m1", row: 0 }],
  grants: [{ name: "Smite", stamps: [{ ap: 1, label: "1A" }], grant: { effect: "e1", index: 0 } }, { name: "Advance", stamps: [{ ap: 1, label: "1A" }], grant: { effect: "e2", index: 0 } }],
  cancels: [{ effect: "e1", source: "Judge" }, { effect: "e2", source: "Battle Cry" }], prone: { lead: "Prone", tag: "Move", btns: [{ label: "Stand · 1 AP" }, { label: "Crawl 2 · 1 AP" }] } });
console.log("the ask slot is the tab's first thing:", /<div class="h3-sit on urg"><div class="hb-ask"><\/div><div class="h3-sit-urg">/.test(r));
console.log("the Reaction: Use, then Pass after the spacer:", r.includes('data-k="rxUse">Use · 1R</button><span class="h3-sp"></span><button type="button" class="hb-btn q" data-hud="rx" data-msg="m1" data-row="0" data-k="rxPass">Pass</button>'));
console.log("Granted, one line a source:", (r.match(/class="hb-gr"/g) ?? []).length, [...r.matchAll(/<span class="src">([^<]*)<\/span><button[^>]*data-effect="([^"]*)">Cancel/g)].map(m => `${m[1]} -> ${m[2]}`).join(" | "));
const cb = HV.sitItemHtml({ lead: "Charge", tag: "Strike", btns: [{ label: "Cancel", q: true, hud: "chargecancel" }, { label: "Basic Attack (1A)", hud: "chargeuse" }] });
console.log("the Charge's Basic Attack: Cancel at the right end:", /Basic Attack \(1A\)<\/button><span class="h3-sp"><\/span><button[^>]*>Cancel<\/button><\/div><\/div>$/.test(cb), "| Prone has no spacer:", !/Prone[\s\S]*h3-sp/.test(r.slice(r.indexOf(">Prone<"))));
const hd = (rows, add) => HV.hidingHtml({ rows, add });
const h0 = hd([{ id: "a", name: "Goblin Sneak", state: "unsensed" }], null), h1 = hd([{ id: "a", name: "Goblin Sneak", state: "unsensed" }], { ids: ["o"], label: "Ogre" });
console.log("Hiding, no target: the Add line first, its buttons off:", h0.indexOf("h3-hd-add") < h0.indexOf("h3-hd-r") && (h0.match(/data-hud="hideadd" disabled/g) ?? []).length === 2, "|", h0.match(/<div class="t">([^<]*)<\/div>/)?.[1]);
console.log("Hiding, the Ogre targeted: the same two buttons, on:", (h1.match(/data-hud="hideadd" data-ids="o"/g) ?? []).length === 2 && !h1.includes("disabled"), "| the same place:", h1.indexOf("h3-hd-add") < h1.indexOf("h3-hd-r"));
console.log("--- 7. the sources: what rule A shows off is no longer hidden");
const tpl = src("module/template.mjs"), mv = src("module/move.mjs"), st = src("module/setup.mjs");
console.log("the area's Ties:", !tpl.includes("b.hidden = !tie") && tpl.includes('setTies(bar.querySelector(".lb-ties"), tie, side)'));
console.log("Undo move:", !mv.includes('ub.style.display = canUndoMove') && mv.includes("ub.disabled = !canUndoMove(c.tokenId)") && mv.includes('class="lb-go lb-undo" disabled'));
console.log("Take back a step:", mv.includes('class="lb-go lb-back" disabled') && mv.includes("fbar?.canBack?.(path.length > 1)"));
console.log("the Charge:", !mv.includes("go.hidden = ") && !mv.includes('sb.style.visibility') && mv.includes("pickEl.innerHTML = cands.filter(x => x.ok)") && mv.includes('target?.id === x.t.id ? " on" : ""'));
console.log("the Push of several keeps the moved ones:", mv.includes("off: movedIds.has(t.id)") && !mv.includes("list = list.filter(x => x.id !== t.id)"));
console.log("every bar in the frame:", ["module/template.mjs", "module/move.mjs", "module/setup.mjs", "module/pickbar.mjs"].map(f => `${f.slice(7)} ${(src(f).match(/askHtml\(\{/g) ?? []).length}`).join(", "), "| the Setup's squares their own line:", st.includes('stat: sq ? leftHtml() : null, statCls: "cnt"'));
const css = src("styles/system.css"), blk = css.slice(css.indexOf("/* ==== v0.0.529"));
console.log("the CSS block: the tab a size container with its gutter:", blk.includes("container-type: size") && blk.includes("scrollbar-gutter: stable"), "| a question the tab's height:", blk.includes("height: 100cqh"), "| one row of buttons, the way out at its right end:", blk.includes(".lb-acts > .lb-give { margin-left: auto !important; }"), "| colors only from the theme's tokens (dark and light; a hex only as a fallback):", (blk.match(/#[0-9a-f]{3,6}\b/gi) ?? []).length === (blk.match(/var\(--[a-z0-9-]+, #[0-9a-f]{3,6}\)/gi) ?? []).length);
