// Playtest 6, section 6 (D1-D5): the PROPOSALS' markup (the page's own: nothing here is the system's code; pt6.css styles it under .p6-*).
// Each function gets the page's helpers (x) and returns the HTML of its pictures and the lists of what changed.
const list = (head, items) => `<div class="p6-list"><b>${head}</b><ul>${items.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
const lists = (...l) => `<div class="p6-lists">${l.join("")}</div>`;

/* ------------------------------------------------------------------ D3's symbols (drawn here; also used by the other parts) */
// One drawing each: viewBox 24 x 24, a line of 1.7 units in the text's color (about 1 px at the sheet's 14 px), a few small filled parts.
const S = (d, fill = "") => `${d ? `<path d="${d}"/>` : ""}${fill ? `<path class="f" d="${fill}"/>` : ""}`;
export const SYM = {
  ad: S("M6 9.5a6 6 0 0 1 12 0V20.5H6zM6 12.5h12M12 12.5v4.5M9 3.6 12 2l3 1.6"),                                             // a great helm
  wd: S("M7 2.5 12 8.5l5-6M12 8.5a6.2 6.2 0 1 0 .01 0z", "M12 12.2a2.5 2.5 0 1 0 .01 0z"),                                  // a talisman on its cord
  speed: S("M7.5 3h6.5v8.2l4.8 2.7c.9.5 1.4 1.3 1.4 2.3V20H7.5zM7.5 16.6h12.7M7.5 6h6.5"),                                             // a boot
  reach: S("M3.5 20.5 14 10M10.6 9.4l4 4", "M21 3c-.6 3.6-2.6 6.6-7 8 1.4-4.4 4.4-6.4 7-8z"),                                                           // a spear
  size: S("M4.5 3.5v17M2.5 3.5h4M2.5 20.5h4M14.5 9.5v6.5M10.5 12h8M14.5 16l-3 4.5M14.5 16l3 4.5", "M14.5 3.6a2.5 2.5 0 1 0 .01 0z"),   // a figure against a measure
  steady: S("M12 3a2 2 0 1 0 .01 0zM12 7v13.5M8 10.5h8M4.5 13.5c.4 4.2 3.6 7 7.5 7s7.1-2.8 7.5-7M4.5 13.5l-1.6 2.6M4.5 13.5l2.7 1.3M19.5 13.5l1.6 2.6M19.5 13.5l-2.7 1.3"),   // an anchor
  guard: S("M12 3.5a8.5 8.5 0 1 0 .01 0z", "M12 9.3a2.7 2.7 0 1 0 .01 0z"),                                                 // a buckler
  immune: S("M12 3.5a8.5 8.5 0 1 0 .01 0zM6 18 18 6"),                                                                       // a closed ring, barred
  resist: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11z", "M4.5 4H12v16.5C7.7 19 4.5 15.8 4.5 11z"),            // a shield, half of it filled
  weak: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11zM13 4l-3 5.5 4 2.5-3 4.5 1 4"),                            // a shield, cracked
  body: S("M6 10.5a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 18 10.5V16a4.5 4.5 0 0 1-4.5 4.5h-3A4.5 4.5 0 0 1 6 16zM10 8v4.5M14 8v4.5M6 13.5h6.2a1.9 1.9 0 0 1 0 3.8H11"),   // a fist
  mind: S("M12 6.5C9.8 5 7 4.6 3.5 5v13.5c3.5-.4 6.3 0 8.5 1.5 2.2-1.5 5-1.9 8.5-1.5V5c-3.5-.4-6.3 0-8.5 1.5zM12 6.5V20"),   // an open book
  appeal: S("M4.5 18.5 3.5 7.5l5 4.5L12 5.5l3.5 6.5 5-4.5-1 11zM4.5 21.5h15"),                                               // a crown
  instinct: S("M2.5 12C6 6.3 18 6.3 21.5 12 18 17.7 6 17.7 2.5 12z", "M12 9.2a2.8 2.8 0 1 0 .01 0z"),                        // an eye
  weapon: S("M12 2.5 14 5.5V14h-4V5.5zM7 14h10M12 14v5", "M12 19a1.5 1.5 0 1 0 .01 0z"),                                     // a sword
  power: S("M12 3.5a6.5 6.5 0 1 0 .01 0zM8.6 9.3a3.7 3.7 0 0 1 3-2.6M7.5 21l1.6-4.6h5.8l1.6 4.6z"),                          // an orb on its stand
  // the alternative for the two Defenses: one shield, plain and charged
  adB: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11z"),
  wdB: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11z", "M12 8a3 3 0 1 0 .01 0z"),
  eq: S("M5 9h14M5 15h14")
};
export const sym = (k, cls = "") => `<svg class="p6-g${cls ? ` ${cls}` : ""}" viewBox="0 0 24 24" aria-hidden="true">${SYM[k] ?? ""}</svg>`;
const SYM_NAMES = [["ad", "AD", "a great helm"], ["wd", "WD", "a talisman on its cord"], ["speed", "Speed", "a boot"], ["reach", "Reach", "a spear"], ["size", "Size", "a figure against a measure"], ["steady", "Steady", "an anchor"],
  ["guard", "Guard", "a buckler"], ["immune", "Immune", "a barred ring"], ["resist", "Resist", "a shield, half filled"], ["weak", "Weak", "a shield, cracked"],
  ["body", "Body", "a fist"], ["mind", "Mind", "an open book"], ["appeal", "Appeal", "a crown"], ["instinct", "Instinct", "an eye"], ["weapon", "Weapon", "a sword"], ["power", "Power", "an orb"]];

/* ================================================================== D1 */
export function rally(x) {
  const { esc, win, chatMsg, chatLog, MSG, durgan, hurt, heal, HW, ICONS } = x;
  const ic = n => `<svg class="p6-fa" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg>`;
  const short = a => a.name.replace(/\s*\(.*$/, "");
  const NAMES = { bodyLethal: ["Vigor", "v"], bodyNonlethal: ["Vigor Nonlethal", "v"], mindLethal: ["Resolve", "r"], mindNonlethal: ["Resolve Nonlethal", "r"] };
  const ORDER = ["bodyLethal", "bodyNonlethal", "mindLethal", "mindNonlethal"];
  const pips = (left, max, spend) => `<span class="p6-rp" role="img" aria-label="${left} of ${max} Rally Points left after">${Array.from({ length: max }, (_, k) => `<i class="${k < left ? "on" : k < left + spend ? "go" : ""}"></i>`).join("")}</span>`;
  // the window. o: { a, n (Rally Points), top (0: no choice of how many), parts: [[n, source]], steppers: "show" | "none" | "link", bars }
  const body = o => {
    const a = o.a, s = a.system, d = s.damage, thr = HW.thresholdsOf(a), total = o.parts.reduce((t, p) => t + p[0], 0);
    const plan = HW.symmetricHealing(d, thr, total), given = Object.values(plan).reduce((t, v) => t + v, 0), all = ORDER.reduce((t, k) => t + (d[k] ?? 0), 0);
    const keys = ORDER.filter(k => (d[k] ?? 0) > 0), choice = keys.length > 1 && total < all;
    const left = s.rallyLeft - o.n;
    const head = `<div class="p6-rh"><div class="p6-rwho"><b>${esc(short(a))}</b> heals <b class="n">${total}</b>${o.parts.length > 1 ? `<span class="p6-rsum">${o.parts.map(p => `${p[0]}${p[1] ? ` ${esc(p[1])}` : ""}`).join(" + ")}</span>` : ""}</div>`
      + `<div class="p6-rpts"><span class="k">Rally Points</span>${pips(left, s.rallyMax, o.n)}<span><b>${left}</b> of ${s.rallyMax} left</span></div></div>`;
    const count = o.top ? `<div class="p6-rcount"><span class="k">Rally Points to use</span><span class="p6-seg">${Array.from({ length: o.top }, (_, i) => `<button type="button" class="${i + 1 === o.n ? "on" : ""}">${i + 1}</button>`).join("")}</span><span class="q">each heals ${heal}</span></div>` : "";
    const step = (k, n) => `<span class="p6-st"><button type="button" aria-label="Less"${n <= 0 ? " disabled" : ""}>&minus;</button><b>${n}</b><button type="button" aria-label="More"${n >= d[k] || given >= total ? " disabled" : ""}>+</button></span>`;
    const rowsA = keys.map(k => { const n = plan[k] ?? 0, of = k === "bodyLethal" ? thr.vigor : k === "mindLethal" ? thr.resolve : 0; return `<div class="p6-rr"><span class="nm ${NAMES[k][1]}">${NAMES[k][0]}</span><span class="was">${d[k]}</span><span class="ar">&rarr;</span><b class="${n ? "chg" : ""}">${d[k] - n}</b><span class="of">${of ? `of ${of}` : ""}</span>${choice && o.steppers === "show" ? step(k, n) : `<span class="hl">${n ? `&minus;${n}` : ""}</span>`}</div>`; }).join("");
    // option B: the pools as the HUD draws them (what is left of each), the part healed marked
    const bar = (pool, cls) => { const max = pool === "body" ? thr.vigor : thr.resolve, dmg = (d[`${pool}Lethal`] ?? 0) + (d[`${pool}Nonlethal`] ?? 0), h = (plan[`${pool}Lethal`] ?? 0) + (plan[`${pool}Nonlethal`] ?? 0); if (!dmg) return "";
      return `<div class="p6-rb ${cls}"><span class="nm ${cls}">${pool === "body" ? "Vigor" : "Resolve"}</span><span class="tr"><i class="l" style="width:${((max - dmg) / max) * 100}%"></i><i class="h" style="width:${(h / max) * 100}%"></i></span><span class="nn">${max - dmg} &rarr; <b>${max - dmg + h}</b> / ${max}</span></div>`; };
    const rows = o.bars ? `${bar("body", "v")}${bar("mind", "r")}${choice ? `<div class="p6-rlink"><span>Split evenly between the two.</span><button type="button" class="p6-link">Change the split</button></div>` : ""}` : rowsA;
    const msg = all === 0 ? "No damage to remove." : given < total && choice ? `${total - given} left to give` : choice && o.steppers === "show" ? "Split evenly by default." : "";
    return `<div class="p6-rw">${count}${head}<div class="p6-rrows${o.bars ? " bars" : ""}">${rows}</div><div class="p6-rf"><span class="m">${msg}</span><button type="button" class="p6-b">Cancel</button><button type="button" class="p6-b go">Use ${o.n} Rally Point${o.n === 1 ? "" : "s"}</button></div></div>`;
  };
  const W = (a, o) => win(`Rally: ${short(a)}`, 400, "twod12 p6-app", body({ a, ...o }));
  const winSimple = W(durgan, { n: 1, parts: [[heal, ""]], steppers: "show" });
  const winA = W(hurt, { n: 1, parts: [[heal, ""]], steppers: "show" });
  const winB = W(hurt, { n: 1, parts: [[heal, ""]], steppers: "link", bars: true });
  const winMany = `<div class="p6-stack">${W(hurt, { n: 2, top: 3, parts: [[heal * 2, ""]], steppers: "show" })}${W(hurt, { n: 1, parts: [[heal, ""], [3, "Font of Mercy"], [5, "Lay On Hands (1d6 + Pow)"]], steppers: "show" })}</div>`;
  const manyNote = "Above: the count is the window's first line; a click on 1, 2 or 3 redraws the rest. Below: a heal with bonuses (Font of Mercy, Lay On Hands' roll) names each part once, after the total; everything is removed here, so there are no steppers.";

  // the chat message
  const line = html => MSG.sysLine("fa-heart-pulse", html, "healmsg");
  const d = short(durgan), left = durgan.system.rallyMax - durgan.system.rallyUsed - 1, hleft = hurt.system.rallyMax - hurt.system.rallyUsed - 1;
  const msgA = chatLog(
    chatMsg("", line(`<b>${d}</b> uses 1 Rally Point: heals <b>9</b> Vigor. <b>${left}</b> left.`), { bare: true }),
    chatMsg("", line(`<b>${d}</b> uses 1 Rally Point (Lay On Hands): heals <b>9</b> Vigor, <b>5</b> Resolve, <b>1</b> Vigor Nonlethal. <b>${hleft}</b> left. <small>${heal} + 3 Font of Mercy + 4 Lay On Hands</small>`), { bare: true }),
    chatMsg("", line(`<b>Orc Warrior</b> rallies: heals <b>8</b> Vigor. <small>An NPC spends no Rally Point.</small>`), { bare: true }));
  const msgANote = "One line, no sender's header (a system line never has one). Nothing is posted while the window is open, and nothing when it is cancelled. The line is the HUD's and the Heal window's (“Durgan heals 9”), so every heal reads the same.";
  const cardB = (lead, text) => MSG.sysCard({ title: "Rally", lead, text, cls: "rallymsg" });
  const msgB = chatLog(
    chatMsg(durgan.name, cardB(`${d} heals 9 Vigor`, `1 Rally Point &middot; <b>${left}</b> of ${durgan.system.rallyMax} left`)),
    chatMsg(durgan.name, cardB(`${d} heals 15`, `9 Vigor, 5 Resolve, 1 Vigor Nonlethal<br>${heal} + 3 Font of Mercy + 4 Lay On Hands<br>1 Rally Point &middot; <b>${hleft}</b> of ${hurt.system.rallyMax} left`)),
    chatMsg(durgan.name, cardB(`${d}: no Rally Point used`, "Cancelled.")));
  const msgBNote = "The card's three parts kept: the name once (short), the healing once, in the lead; the cost and what is left in the text. The sender's header above it is Foundry's.";
  return { winSimple, winA, winB, winMany, manyNote, msgA, msgANote, msgB, msgBNote,
    lists: lists(
      list("The window: what changed", [
        "640 px wide becomes 400 px. The system's table look (flat, thin lines, one filled button), no navy header, no icon tile.",
        "<b>One sentence at the top says it all:</b> “Durgan heals 9”. Today the 9 is written five times (the Heal stat, “Remove up to 9 damage”, the 9 / 9 pill, “All of it given”, “Removes 9 damage.”).",
        "<b>Merged:</b> the stats Vigor 9 / 23 and Resolve 6 / 12 go into their rows (“9 &rarr; 3 of 23”); the Rally Points become the sheet's marks with “5 of 7 left” (the ones this use spends are outlined in the accent).",
        "<b>The steppers show only when there is something to choose</b> (two kinds of damage, and less healing than damage). Otherwise the rows only say what happens.",
        "<b>Removed:</b> the column headings (Damage, Now, After, Heal), the pill, the sentence about the symmetrical split (now three words beside Cancel, only when there is a choice), the footer's “Removes 9 damage.”",
        "<b>Kept, all of it:</b> who, the heal and each part of it with its source, the Rally Points left after and their maximum, each kind of damage now and after, its threshold, the &minus; and + of each row, “N left to give”, Cancel, “Use N Rally Points”.",
        "<b>Added (to merge two windows):</b> when an Action lets you use up to N Rally Points, the count is this window's first line (today a window before this one). Leave it out and the first window stays as it is."
      ]),
      list("Options, and the one recommended", [
        "<b>Window, A (recommended): rows of numbers, the steppers in sight.</b> The split is the window's only decision, so its controls should not need a click; the numbers are exact (a bar can't show 3 of 65).",
        "<b>Window, B: the two pools as the HUD's bars</b> (what is left, the healed part lighter), the split behind “Change the split”, which opens A's rows. The shortest window, but Nonlethal is folded into its pool until you open the split, and it hides the one control.",
        "<b>Message, A (recommended): one line</b> (sysLine). A Rally Point is one fact; a card with a title bar and a sender's header costs about 90 px of chat for it.",
        "<b>Message, B: the card kept</b> (sysCard), each thing said once. Better if you want Rally to stand out in the log.",
        "The Heal window (an Action's @Heal) is the same window without the Rally Points: it would take the same look (not drawn)."
      ]))
  };
}

/* ================================================================== D2 */
export function breakdown(x) {
  const { chatMsg, chatLog, cards, ICONS, CC } = x;
  const pool = p => `<svg class="p6-fa p6-pool ${p === "M" ? "r" : "v"}" viewBox="${ICONS[p === "M" ? "brain" : "heart"][0]}" aria-hidden="true"><path d="${ICONS[p === "M" ? "brain" : "heart"][1]}"/></svg>`;
  const sub = (n, code) => `<b>${n}</b> ${CC.subCode(code)}`;
  // a card with the row's sliders button turned into the breakdown button and the panel under the row
  const card = (html, panel, { open = true, menu = "", hint = "" } = {}) => {
    const b = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html").body, row = b.querySelector(".cc-trow"), more = row.querySelector("[data-cc-more]");
    row.querySelector(".cc-adjrow")?.remove();
    more.setAttribute("aria-label", "Damage breakdown"); more.setAttribute("aria-expanded", String(open)); more.classList.add("p6-eq"); if (open) more.classList.add("on");
    more.innerHTML = sym("eq");
    if (open && panel) row.insertAdjacentHTML("beforeend", panel);
    if (hint) { const ap = row.querySelector(".cc-rbtn"); ap.textContent = "Apply half"; ap.classList.add("p6-hint"); row.insertAdjacentHTML("beforeend", hint); }
    if (menu) { row.classList.add("p6-menurow"); row.insertAdjacentHTML("beforeend", menu); }
    return b.innerHTML;
  };
  // A: one line a pool, the sum written out. terms: [html], result: [n, word]
  const lineA = (p, terms, n, word) => `<div class="l">${pool(p)}<span class="s">${terms.join(" ")}</span><span class="e">= <b>${n}</b> ${word}</span></div>`;
  const m = (sign, n, label) => `<span class="t ${sign === "+" ? "plus" : "minus"}">${sign === "+" ? "+" : "&minus;"} ${n} ${label}</span>`;
  const panelA = (lines, foot) => `<div class="p6-bd a">${lines.join("")}<div class="f">${foot}</div></div>`;
  // B: a ledger. steps: [[label, value, cls]]
  const led = (p, word, steps, n) => `<div class="g"><span class="p">${pool(p)} ${word}</span>${steps.map(([l, v, c]) => `<span class="k">${l}</span><span class="v ${c ?? ""}">${v}</span>`).join("")}<span class="k tot">Takes</span><span class="v tot">${n}</span></div>`;
  const panelB = (groups, foot) => `<div class="p6-bd b">${groups.join("")}<div class="f">${foot}</div></div>`;
  const kA = panelA([lineA("B", [sub(2, "Pi"), m("-", 3, "Shield of Faith")], 0, "Vigor")], "<b>No damage</b> &middot; Lethal &middot; Full");
  const kB = panelB([led("B", "Vigor", [["Pierce (1d4: 2)", "2"], ["Shield of Faith, 1 + Pow", "&minus;3", "minus"]], 0)], "<b>No damage</b> &middot; Lethal &middot; Full");
  const sA = panelA([lineA("B", [sub(7, "Sl"), m("-", 2, "Resist"), m("-", 2, "Guard")], 3, "Vigor"), lineA("M", [sub(7, "Ho"), m("+", 2, "Weak")], 9, "Resolve")], "Lethal &middot; Full");
  const sB = panelB([led("B", "Vigor", [["Slash (1d8: 6, Weapon +1)", "7"], ["Resist 2 Slash", "&minus;2", "minus"], ["Guard 2", "&minus;2", "minus"]], 3), led("M", "Resolve", [["Holy (2d6: 3, 4)", "7"], ["Weak 2 Holy", "+2", "plus"]], 9)], "Lethal &middot; Full");
  const sDone = panelA([lineA("B", [sub(7, "Sl"), m("-", 2, "Resist"), m("-", 2, "Guard")], 3, "Vigor"), lineA("M", [sub(7, "Ho"), m("+", 2, "Weak")], 9, "Resolve")], "Applied in full &middot; Lethal &middot; the Orc Warrior's Guard 2 is spent");
  const menu = (on, applied) => `<div class="p6-menu" role="menu">${[["1", applied ? "Full" : "Apply full"], ["0.5", applied ? "Half" : "Apply half"], ["2", applied ? "Double" : "Apply double"]].map(([k, l]) => `<button type="button" role="menuitemradio" aria-checked="${k === on}" class="${k === on ? "on" : ""}"><i>${k === on ? "&#10003;" : ""}</i>${l}<small>${k === "1" ? "" : k === "0.5" ? "rounded up" : ""}</small></button>`).join("")}</div>`;
  const wrap = (who, html) => chatLog(chatMsg(who, html));
  const D = "Durgan (Dwarf Paladin, Lay On Hands, level 1)";
  return {
    a1: wrap("Goblin Sneak 2", card(cards.knife, kA)), b1: wrap("Goblin Sneak 2", card(cards.knife, kB)),
    a2: wrap(D, card(cards.smite, sA)), b2: wrap(D, card(cards.smite, sB)),
    a3: wrap(D, card(cards.smiteDone, sDone)),
    menu: `<div class="p6-stack">${wrap(D, card(cards.smite, "", { open: false, menu: menu("1", false) }))}${wrap(D, card(cards.smite, "", { open: false, hint: '<div class="p6-hintl">Covering Shot, Tier 3: the ally takes half.</div>' }))}</div>`,
    menuNote: "Above: the menu a right-click on Apply opens; a click on a line applies the damage that way (as the three buttons do today). On an applied row the same right-click on Undo re-applies it as Full, Half or Double. Below: when a Reaction said “half” (today it lights the Half button), Apply itself reads “Apply half” with the reason under it; the right-click still offers Full.",
    lists: lists(
      list("What changed", [
        "<b>The button's job:</b> the sliders button becomes the breakdown button (an equals sign; its label for screen readers “Damage breakdown”). A click opens the panel under that target's row; a second click closes it.",
        "<b>The panel, for that target:</b> each pool on its own: the damage by type, then Resist, Weak and Immune, then a reduction with the name of what gave it (Shield of Faith), then Guard, then what that pool takes. Under it: Lethal or Nonlethal, and Full, Half or Double.",
        "<b>Before Apply</b> it is what will happen; <b>after Apply</b> the same button shows what happened (today the Resist and Weak icons after “Took” hide it in a hover text, which the tooltip review removed).",
        "<b>Moved:</b> Full / Half / Double to a right-click on Apply (decided); the Lethal tag and “&minus;3 Guard” into the panel.",
        "<b>Removed:</b> the three big buttons. Nothing else: Apply, Undo, Card and the damage's dice (a click on the pools line) are as today."
      ]),
      list("Options, and the one recommended", [
        "<b>A (recommended): one line a pool, written as the sum</b> (“2 Pi &minus; 3 Shield of Faith = 0 Vigor”). It is the sentence Lucas wrote, it is one or two lines in the chat, and it reads left to right as the rule applies. A long sum wraps under itself.",
        "<b>B: a ledger</b>, one step a line with the numbers in a column. Easier when a hit has five or six steps, and it has room for the dice; three times the height for the common hit.",
        "<b>For the build:</b> a reduction is stored today as a number (<code>reduceNext</code>) and counted with Guard, which is why the card said “&minus;3 Guard”. To name Shield of Faith the reduction must remember its source; until then the line would read “&minus; 3 reduction”.",
        "<b>The order is the system's</b> (chatcards.mjs <code>afterResist</code>, <code>guardSplit</code>): Half or Double first (rounded up), Immune, Resist, Weak, then the reduction and the Guard."
      ]))
  };
}

/* ================================================================== D3 */
export function symbols(x) {
  const WORDS = { AD: "ad", WD: "wd", Speed: "speed", Reach: "reach", Size: "size", Steady: "steady", Guard: "guard", Immune: "immune", Resist: "resist", Weak: "weak", Body: "body", Mind: "mind", Appeal: "appeal", Instinct: "instinct", Weapon: "weapon", Power: "power" };
  const apply = (html, alt = false) => {
    const b = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html").body;
    for (const k of b.querySelectorAll(".ps2-stats .k, .ps2-tiles .ps2-tile > span")) { let key = WORDS[k.textContent.trim()]; if (!key) continue; if (alt && (key === "ad" || key === "wd")) key += "B"; k.insertAdjacentHTML("afterbegin", sym(key)); k.classList.add("p6-k"); }
    return b.innerHTML;
  };
  const cell = ([k, word, what]) => `<div class="c"><span class="big">${sym(k)}</span><span class="at"><span class="ln">${sym(k)}<b>${word}</b></span><small>${what}</small></span></div>`;
  const plate = `<div class="p6-plate"><h3>The set: each symbol large, then at the sheet's size beside its word</h3><div class="grid">${SYM_NAMES.map(cell).join("")}</div></div>`;
  const altRow = (a, b, label) => `<div class="c"><span class="ln">${sym(a)}<b>AD 13</b></span><span class="ln">${sym(b)}<b>WD 11</b></span><small>${label}</small></div>`;
  const alt = `<div class="p6-plate alt"><h3>The one real choice: the two Defenses</h3><div class="grid two">${altRow("ad", "wd", "<b>A (recommended): a helm and a talisman.</b> Two different outlines, found at a glance; no third shield on a sheet that already has the Escalation rungs' shields and Resist's.")}${altRow("adB", "wdB", "<b>B: one shield, plain for AD, charged with a roundel for WD.</b> Says “both are Defenses”, but the two differ by a dot at 14 px, and the Escalation rungs are shields too.")}</div></div>`;
  return { apply, plate, alt,
    lists: lists(
      list("What changed", [
        "<b>Added:</b> one small symbol before each word of the stat lines and of the tiles: AD, WD, Speed, Reach, Size, Steady, Guard, Immune, Resist, Weak, Body, Mind, Appeal, Instinct, Weapon, Power. The words stay; nothing moves; the sheet is the same height.",
        "<b>One drawing each</b>, a line in the text's own color (no color of its own: a color only for a meaning), 14 px beside 14 px text. The register is the Escalation rungs' shields (group 1, round 3): plain heraldic objects, no gradients, no emoji.",
        "<b>Left as they are:</b> Health (it is the two pools' sum, a heading more than a stat), Vigor and Resolve (their color and their bar are their mark; the heart and the brain stay the pools' icons in damage lines), the damage types' own icons on Resist and Weak's chips."
      ]),
      list("Choices and what to check", [
        "<b>Weak is a cracked shield, Resist a half-filled one, Immune a barred ring.</b> The chat's small icons after “Took” (a flame, a half shield, a ban) would follow, so Weak stops looking like Fire damage.",
        "<b>Power is an orb, not a flame</b> (the flame is Fire); <b>Mind is a book, not a brain</b> (the brain is Resolve); <b>Guard is a round buckler</b>, so it is not a third heater shield.",
        "<b>The same symbols could go on the PC sheet and the HUD's two stat lines</b> (same template, same words). Drawn on the NPC sheet only, as asked: say if they should spread.",
        "No hover text on a symbol (the tooltip rule): the word is beside it."
      ]))
  };
}

/* ================================================================== D4 */
export function arts(x) {
  const { esc, win, theme, cmd, spot, cmdCard, spotCard } = x;
  const fq = "Once per round";
  const head = (it, sub) => `<div class="p6-ah"><b>${esc(it.name)}</b><span>${esc(it.system.category)} &middot; ${fq}</span><em>${sub}</em></div>`;
  const A = (it, card, offMode = "") => {
    const b = new DOMParser().parseFromString(`<body>${card}</body>`, "text/html").body;
    for (const u of b.querySelectorAll(".st-use")) { if (u.dataset.mode === offMode) { u.classList.add("no"); u.textContent = "1 AP"; u.insertAdjacentHTML("afterend", '<span class="p6-why">no AP left</span>'); } }
    return `<div class="twod12-hudcard p6-hudcard p6-art themed theme-${theme}"><button type="button" class="hc-x" aria-label="Close the card">&times;</button>${head(it, "Choose a Mode")}${b.innerHTML}</div>`;
  };
  // B: a window; the Modes are rows to pick, one Use button in the footer
  const B = (it, card) => {
    const b = new DOMParser().parseFromString(`<body>${card}</body>`, "text/html").body;
    b.querySelectorAll(".st-b").forEach((blk, i) => { blk.classList.add("p6-pick"); if (i === 0) blk.classList.add("on"); const u = blk.querySelector(".st-use"); u.outerHTML = `<span class="p6-radio" role="radio" aria-checked="${i === 0}"><i></i>1 AP</span>`; });
    return win(it.name, 400, "twod12 p6-app", `<div class="p6-artwin">${b.innerHTML}<div class="p6-rf"><span class="m">Challenge, 1 AP</span><button type="button" class="p6-b">Cancel</button><button type="button" class="p6-b go">Use Challenge</button></div></div>`);
  };
  return { cmdA: A(cmd, cmdCard), spotA: A(spot, spotCard, "Find the Gap"), cmdB: B(cmd, cmdCard),
    noteA: "The card is the system's own (the HUD's right-click draws it today, with these buttons); the proposal adds the three lines at its top. From the HUD it opens above the Art's line; from the sheet beside the row clicked. Escape, the &times; or a click elsewhere closes it and spends nothing.",
    noteB: "The same card inside a window with Cancel and one Use button; a click on a Mode picks it. One click more than A, and a second way to draw the card.",
    lists: lists(
      list("What changed", [
        "<b>A click on an Art's cost</b> (the sheet's “1 AP” stamp, the HUD's) <b>opens the Art's card</b>: every Mode with its Distance, Target, Save and Effect, and its own Use button. Today it opens a window with the three names and nothing else.",
        "<b>The right-click in the HUD is unchanged</b>: it now shows the same thing as the click. On an Art the two are one card.",
        "<b>Added to the card, for the click:</b> a top line with the Art's name, its kind and Frequency, and “Choose a Mode” (the HUD's card has no name: it sits on its line; from the sheet it needs one).",
        "<b>Removed:</b> the pick window “choose a Mode” and its sentence “Each time you use an Art, you choose one of its Modes.”",
        "A Mode that can't be used shows its cost struck, dashed, with the reason beside it (the Action card's rule)."
      ]),
      list("Options, and the one recommended", [
        "<b>A (recommended): the card itself, floating, a Use button a Mode.</b> One card everywhere (the card model draws it, so a card change reaches it), one click to read and one to use, nothing new to learn after the right-click.",
        "<b>B: a window around the card</b>, pick a Mode and then Use. It has a Cancel button in sight and can be dragged, but it is a click more each time and the Modes become rows of a form.",
        "Only Arts change: an Action with one or two Versions still rolls at the click of its cost, as today."
      ]))
  };
}

/* ================================================================== D5 */
export function minions(x) {
  const { IMG, squad } = x;
  const opt = (o, { num = true, hover = false, img = IMG.goblin } = {}) => `<button type="button" class="p6-tk${hover ? " hover" : ""}" aria-label="${o.label}"><img src="${img}" alt="">${num ? `<b>${o.n}</b>` : ""}${hover ? `<span class="p6-tip">${o.label}</span>` : ""}</button>`;
  const bar = (list, o = {}) => `<div class="h3-si p6-mp"><div class="h"><b>${o.lead ?? "Goblin Sneak"}</b><span class="tg">${list.length} of the squad left</span></div><div class="t">Which one goes now?</div><div class="ts">${list.map(s => opt(s, { ...o, hover: o.hover === s.id, img: s.img ?? IMG.goblin })).join("")}</div><div class="bs"><button type="button" class="hb-btn q">Cancel</button></div></div>`;
  const six = Array.from({ length: 6 }, (_, k) => ({ id: `g${k + 1}`, label: `Goblin Sneak ${k + 1}`, n: k + 1 }));
  const mixed = [{ id: "g1", label: "Goblin Sneak 1", n: 1 }, { id: "g2", label: "Goblin Sneak 2", n: 2 }, { id: "o1", label: "Orc Whelp 1", n: 1, img: IMG.orc }, { id: "o2", label: "Orc Whelp 2", n: 2, img: IMG.orc }];
  // a piece of the map above the HUD: the three tokens, the candidates outlined in gold (pickbar.mjs draws that today), the hovered one lit
  const map = hover => `<div class="p6-map">${squad.map((s, i) => `<span class="tok${hover === s.id ? " lit" : ""}" style="left:${1130 + i * 100 + (i === 1 ? 0 : 0)}px;top:${i === 1 ? 20 : 70}px"><img src="${IMG.goblin}" alt=""><em>${s.label}</em></span>`).join("")}</div>`;
  return { map, barA: bar(squad), barAHover: bar(squad, { hover: "g2" }), barB: bar(squad, { num: false }), barSix: bar(six), barMixed: bar(mixed, { lead: "Minions" }),
    lists: lists(
      list("What changed", [
        "<b>Each Minion still to act is its token's picture</b> in a 40 px square, in the order of their turns; a click picks it. Today: one button a name (“Goblin Sneak 1”, “Goblin Sneak 2”, “Goblin Sneak 3”), wrapping onto two rows.",
        "<b>The name on a hover</b> (a new hover text, asked for by Lucas: test t264's list takes it). The hovered Minion's token lights up on the map, and a click on a token on the map picks it too: both as today.",
        "<b>The question in the Situational section's own format</b> (the lead in bold, a quiet tag, a line, the buttons), as Judge's question and a Reaction's: “Goblin Sneak”, “3 of the squad left”, “Which one goes now?”.",
        "<b>Kept:</b> Cancel (the first in the order goes), Escape, Enter for the first."
      ]),
      list("Options, and the one recommended", [
        "<b>A (recommended): each picture carries its token's number</b> (the number at the end of the token's name). A squad is three copies of one picture: without it the squares can't be told apart until the pointer is on them.",
        "<b>B: the pictures alone</b>, as written. Clean, and enough when a squad mixes different Minions; with three Goblin Sneaks it is three identical squares.",
        "Six fit on one row (40 px squares in the 312 px column); a seventh would wrap to a second row.",
        "<b>For the build:</b> <code>pickbar.mjs</code> already draws an option that has a picture as a square (v0.0.397); the squad's question only has to pass each token's picture. The number badge and the hover name are the new parts."
      ]))
  };
}
