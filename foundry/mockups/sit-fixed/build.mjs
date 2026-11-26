// Builds index.html (a static page: no script is needed to read it). Run: node build.mjs
// A mockup: nothing here is in the system. The words and the buttons are the system's (hudview.mjs, template.mjs, pickbar.mjs, move.mjs, setup.mjs).
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));

/* ---------- small pieces ---------- */
const bt = (slot, label, cls = "", attr = "") => `<button type="button" class="bt${cls ? ` ${cls}` : ""}" data-slot="${slot}"${attr ? ` ${attr}` : ""}>${label}</button>`;
const off = 'disabled aria-disabled="true"';
const kbd = (k, w) => `<kbd>${k}</kbd> ${w}`;
const keys = (...p) => p.join(" · ");
// a creature's picture (no art in a mockup: its first letter), with its number as on the map
const sq = (slot, name, num, cls = "", attr = "") => `<button type="button" class="sq${cls ? ` ${cls}` : ""}" data-slot="${slot}" aria-label="${name}"${attr ? ` ${attr}` : ""}><span aria-hidden="true">${name[0]}</span><b class="num">${num}</b></button>`;
const ties = (state) => `<span class="ties"><span class="lbl">Ties</span>${bt("ties-left", "Left", state === "left" ? "on" : "", state ? "" : off)}${bt("ties-right", "Right", state === "right" ? "on" : "", state ? "" : off)}</span>`;

/** A question (today a .twod12-linebar.in-hud): the frame. Bands, top to bottom: head, text, status, options, keys, buttons. */
function ask({ cls = "", head, tag = "", text = "", lines = 2, stat = null, statCls = "", opts = null, keysLine = null, left = "", no = "" }) {
  return `<div class="sf-ask${cls ? ` ${cls}` : ""}">`
    + `<div class="sf-h"><b>${head}</b>${tag ? `<span class="tg">${tag}</span>` : ""}</div>`
    + `<div class="sf-t" style="--n:${lines}">${text}</div>`
    + (stat === null ? "" : `<div class="sf-st${statCls ? ` ${statCls}` : ""}">${stat}</div>`)
    + (opts === null ? "" : `<div class="sf-o">${opts}</div>`)
    + (keysLine === null ? "" : `<div class="sf-k">${keysLine}</div>`)
    + `<div class="sf-b">${left}${no ? `<span class="sp"></span>${no}` : ""}</div></div>`;
}
/** A list entry (today .h3-si): head, reserved text lines, one row of buttons. */
function entry({ cls = "", lead, tag = "", text = null, lines = 2, left = "", no = "" }) {
  return `<div class="h3-si${cls ? ` ${cls}` : ""}"><div class="h"><b>${lead}</b>${tag ? `<span class="tg">${tag}</span>` : ""}</div>`
    + (text === null ? "" : `<div class="t" style="--n:${lines}">${text}</div>`)
    + `<div class="bs">${left}${no ? `<span class="sp"></span>${no}` : ""}</div></div>`;
}
/** The HUD's right column (the Situational tab selected), 312 px wide, in the 150 px bar. */
function side({ count = 1, urg = true, asks = "", urgent = "", avail = "", cls = "" }) {
  return `<div class="h3-side has-sit${urg ? " has-urg" : ""}${cls ? ` ${cls}` : ""}"><div class="h3-rtabs" role="tablist"><span class="h3-rt h3-rt-sit" role="tab" aria-selected="true">Situational<span class="h3-rcnt">${count}</span></span><span class="h3-rt" role="tab" aria-selected="false">Hands</span></div>`
    + `<div class="h3-sit on${urg ? " urg" : ""}">${asks ? `<div class="hb-ask">${asks}</div>` : ""}${urgent ? `<div class="h3-sit-urg">${urgent}</div>` : ""}${avail ? `<div class="h3-sit-avail">${avail}</div>` : ""}</div></div>`;
}
const strip = h => h.replace(/ data-slot="[^"]*"/g, "");
/** One kind in its states, side by side, then every state drawn on top of each other. */
function group(id, title, note, states, { overlay = true, tall = false } = {}) {
  const cells = states.map((s, i) => { const t = s.tall ?? tall; return `<figure class="state" data-state="${i + 1}"><figcaption><b>${i + 1}.</b> ${s.label}</figcaption><div class="slice${t ? " tall" : ""}">${s.html}${t ? `<i class="fold"></i>` : ""}</div></figure>`; }).join("");
  const ov = overlay && states.length > 1 ? `<figure class="state ov"><figcaption><b>All ${states.length} on top of each other.</b> The words blur, the buttons do not.</figcaption><div class="slice${tall ? " tall" : ""}" aria-hidden="true" inert>${states.map(s => `<div class="layer">${strip(s.html)}</div>`).join("")}</div></figure>` : "";
  return `<div class="group" data-group="${id}"><h3>${title}</h3>${note ? `<p class="mute">${note}</p>` : ""}<div class="row">${cells}${ov}</div></div>`;
}

/* ---------- 0. today: the Line's bar as system.css lays it out (a wrapping row, the text first, Ties before Cancel, hidden with no tie) ---------- */
const today = (text, tie) => side({ asks: `<div class="twod12-linebar in-hud old"><span class="lb-text">${text}</span>${tie ? `<span class="lb-side"><span class="lb-lbl">Ties</span><button type="button" class="${tie === "left" ? "on" : ""}">Left</button><button type="button" class="${tie === "right" ? "on" : ""}">Right</button><kbd>Tab</kbd></span>` : ""}<button type="button" class="lb-give" data-slot="cancel">Cancel</button><span class="lb-keys">${keys(kbd("Tab", "Flip ties"), kbd("Esc", "Cancel"))}</span></div>` });
const G_TODAY = group("today", "Today: the Line's bar (for contrast)", "The same four moments of one placement, as the system draws them now. The dashed box is where Cancel was in the first one.", [
  { label: "Nothing under the mouse yet", html: today(`<b>Place Line 3</b> <span class="lb-tag">within 10 sq.</span> Click on the map to place.`, "") },
  { label: "A straight line, no tie", html: today(`<b>Place Line 3</b> <span class="lb-tag">2 enemies, 1 ally, 1 blocked (No LoE) · cut by wall</span> Click to place.`, "") },
  { label: "The mouse moves: a tie", html: today(`<b>Place Line 3</b> <span class="lb-tag">2 enemies</span> Click to place.`, "left") },
  { label: "Too far", html: today(`<b>Place Line 3</b> <span class="lb-warn">Too far (12 sq., max 10).</span>`, "") },
], { overlay: false });

/* ---------- 1. the area ---------- */
const area = (shape, st) => {
  const line = shape === "Line 3";
  const t = { none: "Click on the map to place.", some: "Click to place.", tie: "Click to place.", tieR: "Click to place.", far: "" }[st];
  const s = { none: "", some: "2 enemies, 1 ally, 1 blocked (No LoE) · cut by wall", tie: "2 enemies", tieR: "1 enemy, 1 ally", far: "Too far (12 sq., max 10)." }[st];
  return side({ asks: ask({ head: `Place ${shape}`, tag: "within 10 sq.", text: t, lines: 1, stat: s, statCls: `two${st === "far" ? " warn" : ""}`,
    keysLine: line ? keys(kbd("Tab", "Flip ties"), kbd("Esc", "Cancel")) : kbd("Esc", "Cancel"),
    left: line ? ties(st === "tie" ? "left" : st === "tieR" ? "right" : "") : "", no: bt("no", "Cancel", "q") }) });
};
const G_AREA = group("area", "Area: an Emanation or a Burst", "Cancel only. The count has two lines of its own, kept free while it is empty.", [
  { label: "Nothing placed yet", html: area("2 Emanation", "none") },
  { label: "2 enemies, 1 ally, 1 blocked, cut by a wall", html: area("2 Emanation", "some") },
  { label: "Too far", html: area("2 Emanation", "far") },
]);
const G_LINE = group("line", "Area: a Line", "Ties Left / Right keep their place: with no tie they are shown off, never taken away. This is the case Lucas hit.", [
  { label: "Nothing placed yet", html: area("Line 3", "none") },
  { label: "No tie: Left and Right are off", html: area("Line 3", "some") },
  { label: "A tie, Left chosen", html: area("Line 3", "tie") },
  { label: "A tie, Right chosen", html: area("Line 3", "tieR") },
  { label: "Too far", html: area("Line 3", "far") },
]);

/* ---------- 2. the pick bar ---------- */
const G_PICKW = group("pick-words", "Pick bar: options as words", "The options are set when the bar opens and do not change while it is up; they have their own row above the last one, so a long question cannot push them. Two different questions are shown: Cancel is in the same corner in both.", [
  { label: "A short question", html: side({ asks: ask({ head: "Kaela", text: "the [C] damage goes to", lines: 3, opts: bt("o1", "Vigor") + bt("o2", "Resolve"), no: bt("no", "Cancel", "q") }) }) },
  { label: "A long one (the same frame)", html: side({ asks: ask({ head: "Fireball", text: "apply the area shown on the map? Targets: <b>Goblin Sneak, Goblin Archer, Orc Warrior, Orc Shieldbearer</b>. No Line of Effect: Ogre, Warg.", lines: 3, opts: bt("p1", "Apply, not Sylwen") + bt("p2", "Apply, Sylwen too"), no: bt("no", "Cancel", "q") }) }) },
], { overlay: false });
const G_PICKP = group("pick-pictures", "Pick bar: options as pictures", "Judge's target pick, the Minions' squad, Empowered: squares in one row, from the left. A bar with no Cancel (Empowered) keeps the last row empty.", [
  { label: "Which creature? (Cancel is “Later” here)", html: side({ asks: ask({ head: "Judge", text: "which creature? Click its token.", lines: 3, opts: sq("c1", "Goblin Sneak", 1) + sq("c2", "Orc Warrior", 2) + sq("c3", "Warg", 3), no: bt("no", "Later", "q") }) }) },
  { label: "The same, one hovered on the map", html: side({ asks: ask({ head: "Judge", text: "which creature? Click its token.", lines: 3, opts: sq("c1", "Goblin Sneak", 1) + sq("c2", "Orc Warrior", 2, "hover") + sq("c3", "Warg", 3), no: bt("no", "Later", "q") }) }) },
]);
const pushSeq = (moved) => {
  const all = ["Goblin Sneak", "Goblin Archer", "Orc Warrior", "Warg"];
  return side({ asks: ask({ head: "Push 2", tag: moved.length ? `${moved.length} of 4 moved` : "", text: `away from <b>Durgan</b>: click a creature (here or its token) to move it.${moved.length ? ` <small>${moved.length} of 4 moved: ${moved.join(", ")}.</small>` : ""}`, lines: 3,
    opts: all.map((n, i) => sq(`m${i + 1}`, n, i + 1, moved.includes(n) ? "done" : "", moved.includes(n) ? off : "")).join(""), left: bt("done", "Done: the rest stay", moved.length ? "fill" : "") }) });
};
const G_PICKD = group("pick-done", "Pick bar: several creatures, one after the other (a Push of an area)", "Today a creature that was moved leaves the row and the others slide left, under the mouse. Here its square stays, shown off. Done is the filled button once something was moved.", [
  { label: "None moved", html: pushSeq([]) },
  { label: "One moved", html: pushSeq(["Goblin Sneak"]) },
  { label: "Three moved", html: pushSeq(["Goblin Sneak", "Goblin Archer", "Warg"]) },
]);

/* ---------- 3. Forced Movement ---------- */
const forced = (mode, st) => {
  const slid = mode === "Slid";
  const how = slid ? "in any direction: click the squares of its path one by one, then the last one again (Enter)." : "away from <b>Durgan</b>: click the square where it ends.";
  const s = slid ? { a: "", b: "Slid 2 (2 of 3 squares aimed (maximum 3))", c: "Slid 3 (3 of 3 squares aimed (maximum 3))" }[st]
    : { a: "", b: "Pushed 3 (3 of 3 squares aimed (maximum 3))", c: "Wall: 2 unused, 2 Vigor damage (1 of 3 squares aimed (maximum 3))" }[st];
  return side({ asks: ask({ head: `Goblin Sneak <span class="pl">is ${mode} up to 3 squares</span>`, text: how, lines: 2, stat: s, statCls: "res",
    keysLine: slid ? keys(kbd("Enter", "Move"), kbd("Backspace", "Take back"), kbd("Esc", "Don't move it")) : kbd("Esc", "Don't move it"),
    left: bt("rules", "Rules") + (slid ? bt("back", "Take back a step", "", st === "a" ? off : "") : ""), no: bt("no", "Don't move it", "q") }) });
};
const G_PUSH = group("forced-push", "Forced Movement: a Push or a Pull", "The result under the mouse has two lines of its own (it is also on the map, on the plate).", [
  { label: "Asked", html: forced("Pushed", "a") },
  { label: "A free square under the mouse", html: forced("Pushed", "b") },
  { label: "A wall in the way: a Collision", html: forced("Pushed", "c") },
]);
const G_SLIDE = group("forced-slide", "Forced Movement: a Slide (or a Reposition)", "Take back a step keeps its place; it is off until a step was clicked.", [
  { label: "Asked: nothing to take back", html: forced("Slid", "a") },
  { label: "Two steps clicked", html: forced("Slid", "b") },
  { label: "Three steps clicked", html: forced("Slid", "c") },
]);

/* ---------- 4. End movement (an Evade, an Advance) ---------- */
const freeMove = (st) => {
  const adv = st === "swapped";
  const n = { full: 3, moved: 1, swapped: 1 }[st];
  return side({ asks: ask({ head: "Kaela", text: adv ? "the movement is an Advance now (it triggers reactions). Drag your token." : "Evade up to 3 squares: no reactions; not into or through Difficult Terrain. Drag your token.", lines: 2,
    stat: `<b>${n}</b> square${n === 1 ? "" : "s"} left`, statCls: "cnt", keysLine: keys(kbd("Ctrl+Z", "Undo"), kbd("Esc", "End movement")),
    left: bt("swap", adv ? "Evade instead" : "Advance instead", "w-swap") + bt("undo", "Undo move", "", st === "full" ? off : ""), no: bt("no", "End movement", "q") }) });
};
const G_EVADE = group("evade", "End movement: an Evade", "Undo move is off until the token has moved (today it is hidden and End movement shifts when it comes). Advance instead and Evade instead share one slot of one width.", [
  { label: "Nothing moved yet", html: freeMove("full") },
  { label: "Two squares moved", html: freeMove("moved") },
  { label: "Advance instead was clicked", html: freeMove("swapped") },
]);
const advMove = (n, moved) => side({ asks: ask({ head: "Durgan", text: "Advance up to 4 squares. Drag your token.", lines: 2, stat: `<b>${n}</b> square${n === 1 ? "" : "s"} left`, statCls: "cnt",
  keysLine: keys(kbd("Ctrl+Z", "Undo"), kbd("Esc", "End movement")), left: bt("undo", "Undo move", "", moved ? "" : off), no: bt("no", "End movement", "q") }) });
const G_ADV = group("advance", "End movement: an Advance", "No Advance instead here; the rest as for an Evade.", [
  { label: "Nothing moved yet", html: advMove(4, false) },
  { label: "Three squares moved", html: advMove(1, true) },
]);

/* ---------- 5. a Setup's movement ---------- */
const setup = (n) => side({ asks: ask({ head: "Strafe", text: "Advance up to 3 squares before the Strike. Move your token, then Continue.", lines: 2, stat: `<b>${n}</b> of 3 squares left.`, statCls: "cnt",
  keysLine: keys(kbd("Enter", "Continue"), kbd("Esc", "Cancel the Action")), left: bt("go", "Continue: the roll", "fill"), no: bt("no", "Cancel the Action", "q") }) });
const G_SETUP = group("setup", "A Setup's movement", "The squares left have their own line; the number changes, nothing else.", [
  { label: "3 of 3 squares left", html: setup(3) }, { label: "1 of 3", html: setup(1) }, { label: "0 of 3", html: setup(0) },
]);

/* ---------- 6. Charge ---------- */
const charge = (st) => {
  const cands = ["Goblin Sneak", "Orc Warrior", "Warg"];
  const T = "Goblin Sneak";
  const d = {
    none: { head: "Target the enemy to Charge", tag: "", text: "(on the map, or pick it here). You run straight at it (at least 2, up to 6 squares), then make a Basic Attack (1A). <span class=\"tgm\">Ogre: too far (9)</span>", tie: "", go: ["Charge", off], giveFill: true },
    ok: { head: `Charge → ${T}`, tag: "4 squares", text: "In Reach at the end. Then: Basic Attack (1A). Another enemy: click it.", tie: "", go: ["Charge", ""] },
    tie: { head: `Charge → ${T}`, tag: "4 squares", text: "In Reach at the end. Then: Basic Attack (1A). Another enemy: click it.", tie: "left", go: ["Charge", ""] },
    blocked: { head: `Charge → ${T}`, tag: "blocked", text: "<span class=\"warn\">Difficult Terrain in the way.</span> You stop after 3 squares, out of Reach: the Charge is disrupted (its AP stay spent).", tie: "right", go: ["Charge anyway", ""] },
    close: { head: `Charge → Orc Warrior`, tag: "too close", text: "A Charge moves at least 2 squares (in Reach after 1). Pick another enemy, or give up.", tie: "", go: ["Charge", off], pick: "Orc Warrior" },
  }[st];
  const picked = st === "none" ? "" : (d.pick ?? T);
  return side({ asks: ask({ cls: "chg", head: d.head, tag: d.tag, text: d.text, lines: 3,
    opts: cands.map((n, i) => sq(`e${i + 1}`, n, i + 1, n === picked ? "on" : "")).join("") + `<span class="sp"></span>` + ties(d.tie),
    left: bt("go", d.go[0], `w-go${d.go[1] ? "" : " fill"}`, d.go[1]), no: bt("no", "Give up · 2 AP back", d.giveFill ? "fill" : "q") }) });
};
const G_CHARGE = group("charge", "Charge", "The enemies it can Charge stay in the row after one is picked (today they go, and Ties and Charge come in their place); the one picked is marked. Charge is off until it can be used; Charge and Charge anyway share one slot. Ties sit at the right end of the pictures' row.", [
  { label: "No target yet", html: charge("none") },
  { label: "A target, no tie", html: charge("ok") },
  { label: "A tie, Left chosen", html: charge("tie") },
  { label: "Blocked: Charge anyway", html: charge("blocked") },
  { label: "Too close: Charge is off", html: charge("close") },
]);
const chargeBA = (pulse) => side({ urgent: entry({ cls: pulse ? "pulse" : "", lead: "Charge", tag: "Strike", left: bt("ba", "Basic Attack (1A)"), no: bt("no", "Cancel", "q") }) });
const G_CHARGEBA = group("charge-ba", "Charge: its Basic Attack (1A)", "Nothing in it changes; Cancel goes to the right end, as in every entry. (It pulses, as today: the second picture is the pulse's other half.)", [
  { label: "Waiting", html: chargeBA(false) }, { label: "Waiting (the pulse)", html: chargeBA(true) },
]);

/* ---------- 7. Reactions ---------- */
const rx = (lead, name = "Opportunity Attack", n = 1) => entry({ lead: name, tag: "Reaction", text: lead, lines: 2, left: bt(`use${n}`, "Use · 1R"), no: bt(`pass${n}`, "Pass", "q") });
const G_RX = group("reaction", "A Reaction waiting", "Its sentence has two lines kept for it, whatever its length; Use at the left, Pass at the right end. A second Reaction goes under the first. (The tab is drawn unrolled; the dashed line is the bar's lower edge.)", [
  { label: "A short sentence", html: side({ urgent: rx("Goblin Sneak leaves your reach.") }) },
  { label: "A long one", html: side({ urgent: rx("Orc Shieldbearer makes a Strike against Sylwen, an ally within your Reach, while you hold a shield.", "Shield Ally") }) },
  { label: "A second Reaction arrives", html: side({ count: 2, urgent: rx("Goblin Sneak leaves your reach.") + rx("Goblin Sneak makes a Strike against you.", "Riposte", 2) }) },
], { overlay: false, tall: true });
const jump = (who, name) => `<div class="h3-rxjump"><span class="rj-txt"><b>${who}</b> · ${name} (1R)</span>${bt("select", "Select")}</div>`;
const G_RXO = group("reaction-other", "Another creature's Reaction", "Already one line with Select at its right end; a long name is cut with an ellipsis. Unchanged.", [
  { label: "A short name", html: side({ urgent: jump("Kaela", "Riposte") }) },
  { label: "A long name", html: side({ urgent: jump("Orc Shieldbearer 2", "Opportunity Attack with a Reach weapon") }) },
]);

/* ---------- 8. Granted, Hiding, Prone, Break Free, Reload ---------- */
const st = (slot, l) => `<button type="button" class="hb-st" data-slot="${slot}">${l}</button>`;
const grant = (source, lines, k = 1) => `<div class="hb-gr"><div class="hb-grh"><span class="src">Granted by ${source}</span>${bt(`gcancel${k}`, "Cancel", "q")}</div>${lines.map(([n, s], i) => `<div class="hb-ln"><b>${n}</b><span class="hb-sts">${st(`g${k}-${i + 1}`, s)}</span></div>`).join("")}</div>`;
const G_GRANT = group("granted", "Granted Actions", "The source's name is cut with an ellipsis, so Cancel stays at the right end. With two sources, each has its own line and its own Cancel (today: one line, “Granted by A, B”, then two Cancel buttons that do not say which).", [
  { label: "One source", html: side({ urg: false, avail: grant("Judge", [["Smite", "1A"]]) }) },
  { label: "A long source name", html: side({ urg: false, avail: grant("Commander's Rallying Standard of the North", [["Basic Attack: Goblin Sneak", "1A"]]) }) },
  { label: "A second source arrives", html: side({ urg: false, count: 2, avail: grant("Judge", [["Smite", "1A"]]) + grant("Battle Cry", [["Advance", "1A"]], 2) }) },
], { overlay: false });

const MARK = { unsensed: '<svg class="hm" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 2.4"/></svg>',
  hidden: '<svg class="hm" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 2.5A5.5 5.5 0 0 0 8 13.5Z" fill="currentColor"/></svg>' };
const W = { hidden: "Hidden", unsensed: "Unsensed" };
const hiding = (rows, target, folded = false) => {
  const head = `<button type="button" class="h h3-hd-fold" data-slot="fold" aria-expanded="${!folded}"><b>Hiding</b><span class="tg">from Hide${rows.length ? ` · ${rows.length}` : ""}</span><i class="chev" aria-hidden="true">${folded ? "›" : "⌄"}</i></button>`;
  const add = `<div class="h3-hd-add"><div class="t1">${target ? `Add against <b>${target}</b>:` : (rows.length ? "To add a creature, target one that isn't listed." : "Not hiding from anyone. To add a creature, target it.")}</div>`
    + `<div class="bs">${["unsensed", "hidden"].map(s => bt(`add-${s}`, `${MARK[s]}${W[s]}`, "q", target ? "" : off)).join("")}</div></div>`;
  const list = rows.map(([n, s], i) => `<div class="h3-hd-r">${MARK[s]}<span class="nm">${n}</span>${bt(`flip${i + 1}`, W[s], "q h3-hd-st", `aria-label="${W[s]} to ${n}: switch to ${W[s === "hidden" ? "unsensed" : "hidden"]}"`)}<button type="button" class="h3-hd-x" data-slot="rm${i + 1}" aria-label="Remove ${n}">✕</button></div>`).join("");
  return `<div class="h3-si h3-hd">${head}${folded ? "" : add + list}</div>`;
};
const G_HIDE = group("hiding", "Hiding", "The Add line moves to the top, under the title, and is always two lines: its sentence, then Unsensed and Hidden (off while no creature that is not listed is targeted; today the two buttons come and go under the list). The creatures follow, one line each, the state's button one width. The list grows downward only. (The tab is drawn unrolled; the dashed line is the bar's lower edge.)", [
  { label: "Two creatures, no target", html: side({ urg: false, avail: hiding([["Goblin Sneak", "unsensed"], ["Orc Warrior", "hidden"]], "") }) },
  { label: "The Ogre is targeted", html: side({ urg: false, avail: hiding([["Goblin Sneak", "unsensed"], ["Orc Warrior", "hidden"]], "Ogre") }) },
  { label: "Added; the first one flipped", html: side({ urg: false, avail: hiding([["Goblin Sneak", "hidden"], ["Orc Warrior", "hidden"], ["Ogre", "unsensed"]], "") }) },
  { label: "Folded (a click on the title)", html: side({ urg: false, avail: hiding([["Goblin Sneak", "hidden"], ["Orc Warrior", "hidden"], ["Ogre", "unsensed"]], "", true) }) },
], { overlay: false, tall: true });

const G_PRONE = group("prone", "Prone", "One row, a fixed order; Break Free (when also Grabbed or Immobilized) is added at the end, never before. A button that cannot be used is off, in its place.", [
  { label: "Prone", html: side({ urg: false, avail: entry({ lead: "Prone", tag: "Move", left: bt("stand", "Stand · 1 AP") + bt("crawl", "Crawl 2 · 1 AP") }) }) },
  { label: "No AP left", html: side({ urg: false, avail: entry({ lead: "Prone", tag: "Move", left: bt("stand", "Stand · 1 AP", "", off) + bt("crawl", "Crawl 2 · 1 AP", "", off) }) }) },
  { label: "Prone and Grabbed", html: side({ urg: false, avail: entry({ lead: "Prone", tag: "Move", left: bt("stand", "Stand · 1 AP") + bt("crawl", "Crawl 2 · 1 AP") + bt("bf", "Break Free · 1 AP") }) }) },
], { overlay: false });
const G_BF = group("break-free", "Break Free (Grabbed or Immobilized)", "Only the word changes.", [
  { label: "Grabbed", html: side({ urg: false, avail: entry({ lead: "Grabbed", tag: "Move", left: bt("bf", "Break Free · 1 AP") }) }) },
  { label: "Immobilized", html: side({ urg: false, avail: entry({ lead: "Immobilized", tag: "Move", left: bt("bf", "Break Free · 1 AP") }) }) },
  { label: "No AP left", html: side({ urg: false, avail: entry({ lead: "Grabbed", tag: "Move", left: bt("bf", "Break Free · 1 AP", "", off) }) }) },
]);
const G_RELOAD = group("reload", "Reload (an unloaded weapon in hand)", "The weapons' names are cut with an ellipsis; the tag keeps its place at the right of the title.", [
  { label: "One weapon", html: side({ urg: false, avail: entry({ lead: "Unloaded · Hunting Bow", tag: "Weapon", left: bt("reload", "Reload · 1 AP") }) }) },
  { label: "Two, long names", html: side({ urg: false, avail: entry({ lead: "Unloaded · Heavy Repeating Crossbow, Hand Crossbow", tag: "Weapon", left: bt("reload", "Reload · 1 AP") }) }) },
]);

/* ---------- 9. the stack ---------- */
const lineAsk = ask({ head: "Place Line 3", tag: "within 10 sq.", text: "Click to place.", lines: 1, stat: "2 enemies", statCls: "two", keysLine: keys(kbd("Tab", "Flip ties"), kbd("Esc", "Cancel")), left: ties("left"), no: bt("no", "Cancel", "q") });
const proneE = entry({ lead: "Prone", tag: "Move", left: `<button type="button" class="bt">Stand \u00b7 1 AP</button><button type="button" class="bt">Crawl 2 \u00b7 1 AP</button>` });
const G_STACK = group("stack", "The stack: something else arrives while a question is up", "The question being answered is the first thing in the tab and takes the tab's whole height; everything else is under it. A Reaction that arrives is added below, the count on the tab goes up, and the question does not move. The third picture is the second one unrolled (the dashed line is the bar's lower edge): Prone, under the Reaction, is pushed down by it; see the questions at the end.", [
  { label: "The Line, and Prone under it (count 2)", html: side({ count: 2, asks: lineAsk, avail: proneE }) },
  { label: "A Reaction arrives (count 3)", html: side({ count: 3, asks: lineAsk, urgent: rx("Goblin Sneak leaves your reach."), avail: proneE }) },
  { label: "The second one, unrolled", tall: true, html: strip(side({ count: 3, asks: lineAsk, urgent: rx("Goblin Sneak leaves your reach."), avail: proneE })) },
], { overlay: false });

/* ---------- 10. B: the buttons in a column at the right ---------- */
function askB({ head, tag = "", text = "", stat = "", statCls = "", opts = "", keysLine = "", slots = [], no = "" }) {
  return `<div class="sf-ask b"><div class="sf-h"><b>${head}</b>${tag ? `<span class="tg">${tag}</span>` : ""}</div>`
    + `<div class="b-l"><div class="sf-t" style="--n:9">${text}</div>${stat ? `<div class="sf-st b-st${statCls ? ` ${statCls}` : ""}">${stat}</div>` : ""}${opts ? `<div class="sf-o">${opts}</div>` : ""}${keysLine ? `<div class="sf-k">${keysLine}</div>` : ""}</div>`
    + `<div class="b-r">${slots.map(s => `<div class="b-slot">${s}</div>`).join("")}<div class="b-slot last">${no}</div></div></div>`;
}
const lineB = (stt) => {
  const t = { none: "Click on the map to place.", some: "Click to place.", tie: "Click to place.", far: "" }[stt];
  const s = { none: "", some: "2 enemies, 1 ally, 1 blocked (No LoE) · cut by wall", tie: "2 enemies", far: "Too far (12 sq., max 10)." }[stt];
  return side({ asks: askB({ head: "Place Line 3", tag: "within 10 sq.", text: t, stat: s, statCls: stt === "far" ? "warn" : "", keysLine: keys(kbd("Tab", "Flip ties"), kbd("Esc", "Cancel")), slots: [ties(stt === "tie" ? "left" : "")], no: bt("no", "Cancel", "q") }) });
};
const G_B_LINE = group("b-line", "B, the Line", "", [
  { label: "Nothing placed yet", html: lineB("none") }, { label: "No tie", html: lineB("some") }, { label: "A tie, Left chosen", html: lineB("tie") }, { label: "Too far", html: lineB("far") },
]);
const chargeB = (stt) => {
  const cands = ["Goblin Sneak", "Orc Warrior", "Warg"], T = "Goblin Sneak";
  const d = {
    none: { head: "Target the enemy to Charge", tag: "", text: "(on the map, or pick it here). You run straight at it (at least 2, up to 6 squares), then make a Basic Attack (1A).", tie: "", go: ["Charge", off], fill: true },
    tie: { head: `Charge → ${T}`, tag: "4 squares", text: "In Reach at the end. Then: Basic Attack (1A). Another enemy: click it.", tie: "left", go: ["Charge", ""] },
    blocked: { head: `Charge → ${T}`, tag: "blocked", text: "<span class=\"warn\">Difficult Terrain in the way.</span> You stop after 3 squares, out of Reach: the Charge is disrupted (its AP stay spent).", tie: "", go: ["Charge anyway", ""] },
  }[stt];
  return side({ asks: askB({ head: d.head, tag: d.tag, text: d.text, opts: cands.map((n, i) => sq(`e${i + 1}`, n, i + 1, stt !== "none" && n === T ? "on" : "")).join(""),
    slots: [bt("go", d.go[0], d.go[1] ? "" : "fill", d.go[1]), ties(d.tie)], no: bt("no", "Give up · 2 AP back", d.fill ? "fill" : "q") }) });
};
const G_B_CHARGE = group("b-charge", "B, the Charge", "", [
  { label: "No target yet", html: chargeB("none") }, { label: "A tie, Left chosen", html: chargeB("tie") }, { label: "Blocked: Charge anyway", html: chargeB("blocked") },
]);

/* ---------- the page ---------- */
const css = readFileSync(join(HERE, "sit-fixed.css"), "utf8");
const sec = (id, title, intro, groups) => `<section id="${id}"><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ""}${groups.join("")}</section>`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Situational tab · fixed buttons · HUD mockup</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:wght@600&display=swap" rel="stylesheet">
<style>
${css}
</style>
</head>
<body>
<main>
<h1>The Situational tab: buttons that stay put</h1>
<p class="mute">A mockup: nothing here is in the system. Each picture is the right end of the HUD bar at its real size (the right column, 312 px wide, in the 150 px bar), with the system's own words and buttons. <button type="button" class="reset" id="theme">Show the light theme</button></p>

<div class="rec">
<p><b>The problem.</b> A question in the Situational tab is a row that wraps: its sentence first, then its buttons after it. The area's sentence is rewritten on every mouse move, and the Line's Ties pair comes and goes in front of Cancel, so Cancel moves while the mouse is on its way to it.</p>
<p><b>The rule (A, recommended).</b> Every entry is a frame whose parts have a fixed place: one title line, a text box of a fixed number of lines, then one row of buttons. In that row the main button starts at the left and <b>the way out (Cancel, Pass, End movement, Give up, Don't move it) is always at the right end</b>. Whatever changes (a count, a warning, the squares left) has lines of its own that are kept free while they are empty and cut with an ellipsis if they run over; a button that can only sometimes be used (Ties, Undo move, Take back a step, Charge) keeps its place and is shown off, never taken away; two wordings of one button (Advance instead / Evade instead) share one slot of one width.</p>
<p><b>A question asked on the map</b> (an area, a pick, a movement, a Charge) takes the tab's whole height and is the first thing in it, so its row of buttons is the HUD's bottom edge and <b>the way out is the HUD's bottom right corner, for every question</b>. Anything else that arrives goes under it and cannot push it.</p>
<p class="mute">Every picture below was measured: within a kind, each button has the same position and size in every state (the dashed outlines are the first state's buttons, drawn on all of them).</p>
</div>

${sec("s-today", "0. Today", "", [G_TODAY])}
${sec("s-area", "1. Placing an area", "<code>template.mjs</code> writes this bar; its sentence changes on every mouse move.", [G_AREA, G_LINE])}
${sec("s-pick", "2. The pick bar", "<code>pickbar.mjs</code>: one bar for some thirty questions (which creature, which version, apply the area, the Critical's type, who uses a Rally Point).", [G_PICKW, G_PICKP, G_PICKD])}
${sec("s-forced", "3. Forced Movement", "<code>move.mjs</code>, forcedBar. The small reminder of the rule (“Forced Movement ignores Difficult Terrain and triggers no Reactions; a wall or a creature in the way stops it (a Collision).”) is left to the Rules button in the HUD: with it the sentence is six lines and the buttons are out of sight today.", [G_PUSH, G_SLIDE])}
${sec("s-move", "4. End movement", "<code>move.mjs</code>, freeMoveBar: an Evade or an Advance, from a Basic Action or from a card.", [G_EVADE, G_ADV])}
${sec("s-setup", "5. A Setup's movement", "<code>setup.mjs</code>, setupBar.", [G_SETUP])}
${sec("s-charge", "6. Charge", "<code>move.mjs</code> (the Charge's bar) and <code>hud.mjs</code> (its Basic Attack). The tightest one: three lines of text, the pictures and the buttons fill the tab exactly, so it has no line for the keys.", [G_CHARGE, G_CHARGEBA])}
${sec("s-rx", "7. Reactions", "<code>hudview.mjs</code>, rightHtml.", [G_RX, G_RXO])}
${sec("s-avail", "8. Granted, Hiding, Prone, Break Free, Reload", "<code>hudview.mjs</code> (rightHtml, hidingHtml, sitItemHtml) and <code>hud.mjs</code>.", [G_GRANT, G_HIDE, G_PRONE, G_BF, G_RELOAD])}
${sec("s-stack", "9. The stack", "", [G_STACK])}

<section id="s-b"><h2>10. The other way, B: the buttons in a column</h2>
<p>The buttons stand in a column of a fixed width at the right, one slot a line from the top, the way out in the last slot (the same bottom right corner). The text has the left column and can be any length: nothing in it can reach the buttons, and no height has to be kept free.</p>
${G_B_LINE}${G_B_CHARGE}
<div class="rec"><p><b>Recommended: A.</b> It keeps the order every question has today (the sentence, the buttons, the way out last) and the full width for the sentence; the list entries (a Reaction, Prone) already look like it. Its cost is the Charge, which fills the tab to the pixel. B has room to spare for the Charge and never cuts a sentence, but the text is a narrow column beside a mostly empty one (a Line has two buttons, an Emanation one), and the stacked buttons look like nothing else in the HUD.</p></div>
</section>

<section id="s-q"><h2>What the rule changes in what is shown</h2>
<ul>
<li><b>Shown off, no longer hidden:</b> Ties Left / Right (the Line with no tie; the Charge already keeps their place), Undo move (before a move), Take back a step (before a step), Charge (no target, or too close), Hiding's Unsensed / Hidden (no new target), a creature already moved in a Push of several.</li>
<li><b>Kept, no longer removed:</b> the Charge's pictures after a target is picked (the one picked is marked).</li>
<li><b>Moved:</b> the line naming the keys goes above the buttons (so the buttons are the last row in every question); Hiding's Add line goes above its list; a Reaction's Pass and the Charge's Cancel go to the right end; Granted has one line a source.</li>
<li><b>Left out in the HUD:</b> Forced Movement's small reminder of the rule (the Rules button opens it); the Charge's line of keys.</li>
<li><b>No new control, no new word.</b></li>
</ul>
<h2>Questions for Lucas</h2>
<ul>
<li><b>A or B?</b></li>
<li><b>A waiting Reaction under a question.</b> With the question first, a Reaction that arrives meanwhile is one turn of the wheel away (the count on the tab goes up and turns gold). Today it would go above the question and push it down. Is under it right, or must a Reaction always be in sight?</li>
<li><b>The list under it keeps your order</b> (urgent first, then Granted, Hiding, Prone). So a Reaction that arrives still pushes Prone or Hiding down. Should a new entry go under the ones already shown instead, so that nothing ever moves down?</li>
<li><b>Forced Movement's reminder</b> of the rule: left to the Rules button in the HUD, as drawn?</li>
<li><b>The Charge</b> has no room for its line of keys (Enter, Tab, Esc) and its pictures are 27 px (34 today). Fine, or should the bar be taller while a Charge is asked?</li>
</ul>
</section>
</main>
<script>
// not needed to read the page: the theme switch, and the dashed outlines (the first state's buttons, drawn on every state of the kind)
document.getElementById("theme").addEventListener("click", e => { const on = document.documentElement.classList.toggle("twod12-light"); e.currentTarget.textContent = on ? "Show the dark theme" : "Show the light theme"; });
if (new URLSearchParams(location.search).has("light")) document.getElementById("theme").click();
function ghosts() {
  document.querySelectorAll(".ghost").forEach(g => g.remove());
  document.querySelectorAll(".group").forEach(g => {
    const states = [...g.querySelectorAll(".state:not(.ov)")], first = states[0]?.querySelector(".slice"); if (!first) return;
    const o = first.getBoundingClientRect();
    const keysOf = [...first.querySelectorAll("[data-slot]")].map(b => b.dataset.slot);
    const boxes = [...first.querySelectorAll("[data-slot]")].map(b => { const r = b.getBoundingClientRect(); return [r.left - o.left - 1, r.top - o.top - 1, r.width, r.height]; });
    g.querySelectorAll(".slice").forEach(s => { if (s.matches(".tall") && g.dataset.group === "stack") return; boxes.forEach(([x, y, w, h], k) => { if (!s.closest(".ov") && !s.querySelector('[data-slot="' + keysOf[k] + '"]')) return; const d = document.createElement("i"); d.className = "ghost"; d.style.cssText = "left:" + (x - 2) + "px;top:" + (y - 2) + "px;width:" + (w + 4) + "px;height:" + (h + 4) + "px"; s.append(d); }); });
  });
}
document.querySelectorAll(".scrolled .h3-sit").forEach(s => { s.scrollTop = s.scrollHeight; });
(document.fonts?.ready ?? Promise.resolve()).then(ghosts); addEventListener("load", ghosts);
</script>
</body>
</html>
`;
writeFileSync(join(HERE, "index.html"), html);
console.log("index.html", html.length, "bytes");
