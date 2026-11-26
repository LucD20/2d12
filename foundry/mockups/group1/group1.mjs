// Group 1 of Lucas's notes on v0.0.442 (2026-11-19): a mockup. Each part draws the sheet AS BUILT (the system's own template and CSS on the
// sheets mockup's model, as ../sheets/built.mjs does) beside the proposal (the same HTML, with a few elements changed here and group1.css laid
// over it under a .g1-* class). Nothing in foundry/twod12 changed.   index.html?theme=dark|light
import { makeActor, sheetModel, esc } from "../sheets/model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const SM = await import("../../twod12/module/sheetmodel.mjs");
const { TWOD12 } = await import("../../twod12/module/config.mjs");
const NB = await import("../../twod12/module/npcbudget.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const data = await (await fetch("../sheets/actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");

/** The build's model (../sheets/built.mjs "built"), plus the Basic attack's subtitle as pcsheet.mjs writes it today (its line 251). */
function model(a, st) {
  const pc = sheetModel(a, { ...st, dl: DL, cd: CD }), ap = st.ap ?? 4, rap = st.rap ?? 1, s = a.system, escN = Number(s.escalation) || 0;
  for (const sec of pc.sections) for (const r of sec.rows) {
    const it = r.item.system, hb = r.handBtns;
    r.bar = { ...SM.actionBar({ aps: it.versions.map(v => v.ap), reaction: !!it.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: pc.strip.inCombat, ap, rap }), weaponId: hb?.length === 1 ? hb[0].id : "", hands: hb?.length >= 2 ? hb : null };
    if (pc.npc && it.basicAttack) {
      const rr = it.basicRating || "medium", rank = TWOD12.npcRoles[s.role] ? s.role : "standard", sug = NB.npcSuggest({ rank, rating: rr, basic: true });
      const est = (Number(s.stage) || 0) === 0 ? `${sug.t2} / ${sug.t3}` : SM.npcRow(TWOD12.npcRoles[rank], TWOD12.npcRatings, rr, s.stage).basic.join(" / ");
      const subs = [`Basic attack · ${TWOD12.npcRatings[rr]?.label ?? rr} · ~${est}`];
      if (pc.strip.elite && escN >= (SM.ELITE_RUNGS ?? [])[0]?.n) subs.push("+1 Boon on its first attack this round");
      r.sub = subs.join(" · ");
    }
  }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; });
  pc.mods.forEach(m => { m.tile = pc.npc ? `${m.label} Mod.` : m.label; });
  pc.strip.esc.pips = Array.from({ length: 6 }, (_, k) => k < escN);
  pc.strip.esc.hookList = st.hookList ?? [];
  pc.strip.esc.marks = SM.escMarks(escN, 6, [2, 4, 6]);
  for (const sec of pc.sections) if (["reaction", "granted", "apex"].includes(sec.key)) sec.rows.forEach(r => { r.showFq = true; });
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.head.round = `Round ${st.round ?? 1}`;
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true });
  return pc;
}
const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls ?? "", textContent: text ?? "" });

/* ------------------------------------------------------------------ the proposals' DOM changes (each one names what the build would do) */
/** 2. The Basic Actions' strips take the theme's Frequency color (today a fixed color written on the button, made for the light sheet). */
function strips(host) {
  for (const b of host.querySelectorAll(".ps2-bx:not(.off) .ps2-bxbtn")) {
    const round = /#2c5d9e/i.test(b.getAttribute("style") ?? "");
    b.setAttribute("style", `--lnf:var(--s-fq-${round ? "round" : "atwill"})`);
  }
}
/** 3a. Four columns: the cost without "AP"; the name marked to be fitted once it is on the page (fitNames below). */
function fourCols(host) {
  for (const b of host.querySelectorAll(".ps2-bxbtn > b")) b.textContent = b.textContent.replace(/\s*AP$/, "");
  for (const n of host.querySelectorAll(".ps2-bxn")) n.dataset.fit = "1";
}
/** 3b. Three columns: Control goes under Attack; Movement and Utility keep a column each. */
function threeCols(host) {
  const cols = [...host.querySelectorAll(".ps2-bgrid > .ps2-bcol")];
  if (cols.length < 4) return;
  const [attack, , control] = cols;
  const stack = el("div", "g1-stack"); attack.before(stack); stack.append(attack, control);
}
/** 4. An Elite's combat line laid out as a PC's: the phases where the hooks are (and the ladder's names on one line under them), then the
 *  marks cell with an Esc. row (six diamonds, the ladder's rungs ringed, the number). */
function elite(host, pc, a) {
  const line = host.querySelector(".ps2-combat.npc"), old = line?.querySelector(".ps2-esc"), marks = line?.querySelector(".ps2-marks");
  if (!old || !marks) return;
  const s = a.system, ph = [["Bloodied +1", !!s.bloodied], ["Strained +1", !!s.strained]];
  const cell = el("div", "ps2-cell g1-ph");
  cell.innerHTML = `<span class="ps2-hk">Phases</span><span class="g1-pl">${ph.map(([w, on]) => `<span class="${on ? "on" : ""}"><b>${w}</b> ${on ? "✓" : "<i>not yet</i>"}</span>`).join("")}</span>`
    + `<span class="g1-rungs">${(pc.strip.eliteRungs ?? []).map(r => { const [n, name] = String(r.label).split(" · "); return `<span class="${r.lit ? "lit" : ""}">${esc(n)} ${esc(name)}</span>`; }).join("")}</span>`;
  old.replaceWith(cell);
  const n = pc.strip.esc.n, at = new Set((SM.ELITE_RUNGS ?? []).map(r => r.n));
  marks.querySelector(".bane")?.remove();
  marks.insertAdjacentHTML("beforeend", `<span class="k">Esc.</span><span class="ps2-mrow"><span class="ps2-epips">${Array.from({ length: 6 }, (_, k) => `<a class="${k < n ? "on" : ""}${at.has(k + 1) ? " rg" : ""}" data-action="setEscalation" data-n="${k + 1}" role="button" aria-label="Elite Escalation ${k + 1}"></a>`).join("")}</span><b class="ps2-en">${n}</b></span>`);
  line.classList.add("g1-el");
}
/** 5. The NPC's tiles in the PC's grid: the Modifier tiles named as a PC's ("Weapon", "Power"). */
function tiles(host) { for (const t of host.querySelectorAll(".ps2-tile.mod > span")) t.textContent = t.textContent.replace(/\s*Mod\.$/, ""); }
/** 6. The Basic attack's subtitle from its own Tier 2 / Tier 3 damage, the flat number first: "Basic attack · 1 + 1d4! / 3 + 1d4!". */
const dmgWords = list => (list ?? []).map(d => { const m = /^(.+?)\s*([+\-−])\s*(\d+)$/.exec(String(d.dice ?? "").trim()); return !m ? String(d.dice ?? "") : m[2] === "+" ? `${m[3]} + ${m[1]}` : `${m[1]} − ${m[3]}`; }).filter(Boolean).join(" + ");
function basicSub(host, a) {
  for (const row of host.querySelectorAll(".ps2-oa.basicatk")) {
    const it = a.items.get(row.dataset.itemId), sub = row.querySelector(".ps2-sub"), v = it?.system?.versions?.[0];
    if (!sub || !v) continue;
    const rest = sub.textContent.split(" · ").slice(3);   // what follows "Basic attack · High · ~x / y" today (an Elite's Boon) is kept
    sub.textContent = [`Basic attack · ${dmgWords(v.t2)} / ${dmgWords(v.t3)}`, ...rest].join(" · ");
  }
}

/** One window, cropped to a part of the sheet (crop: "top" the plate, the tiles, the combat line; "tiles" the plate and the tiles; "basic" the
 *  Basic Actions; "acts" the Actions' bars). fix: the proposal's changes, by item. */
function draw(a, pc, { crop = "top", fix = [], cap = "" } = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "actions");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "actions");
  host.querySelectorAll("[data-tooltip]").forEach(x => x.removeAttribute("data-tooltip"));
  if (fix.includes("strips")) strips(host);
  if (fix.includes("a")) fourCols(host);
  if (fix.includes("b")) threeCols(host);
  if (fix.includes("elite")) elite(host, pc, a);
  if (fix.includes("tiles")) tiles(host);
  if (fix.includes("sub")) basicSub(host, a);
  const cls = fix.map(f => `g1-${f}`).join(" ");
  return `<div class="g1-shot"><h3>${cap}</h3><div class="g1-clip g1-crop-${crop} ${cls}"><div class="mk-win" style="width:540px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px"><header class="window-header"><span class="window-title">${esc(a.name)}</span><span class="mk-x">&times;</span></header><section class="window-content">${icons(art(host.innerHTML))}</section></div></div></div></div>`;
}

/* ------------------------------------------------------------------ the creatures and their example state */
const HANDS = { Dagger: { wielded: true, hand: "off" }, "Hunting Bow": { hand: "main" } };
const sylwen = () => { const a = makeActor(data.sylwen, { system: { escalation: 4, damage: { bodyLethal: 6, mindNonlethal: 3 } }, items: HANDS }); const st = { inCombat: true, round: 3, ap: 3, rap: 1, strikes: 1, hookList: ["Critical"] }; return [a, model(a, st)]; };
const aveline = () => { const a = makeActor(data.aveline, { system: { escalation: 2 } }); const st = { inCombat: true, round: 2, ap: 4, rap: 1, strikes: 0, hookList: ["Critical", "Kindled Wrath"] }; return [a, model(a, st)]; };
const ogre = () => { const bdt = makeActor(data.ogre).system.bdt; const a = makeActor(data.ogre, { system: { escalation: 2, damage: { bodyLethal: bdt } } }); const st = { inCombat: true, round: 1, ap: Number(a.system.apPerTurn) || 4, rap: 1, strikes: 1 }; return [a, model(a, st)]; };
const orc = () => { const a = makeActor(data.orc, { system: { damage: { bodyLethal: 5 } } }); const st = { inCombat: true, round: 2, ap: 3, rap: 0, strikes: 1 }; return [a, model(a, st)]; };
const BUILT = "As built (v0.0.442)";
const pair = (...shots) => `<div class="g1-pair">${shots.join("")}</div>`;
const sec = (n, title, quote, notes, body) => `<section class="g1-sec"><h2>${n}. ${title}</h2><p class="g1-q">Lucas: ${quote}</p><ul class="g1-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>${body}</section>`;

const out = document.getElementById("page");
const parts = [
  () => { const [a, pc] = sylwen(); return sec(1, "The sheet's marks are the HUD's marks",
    "“Sheet's AP/R/Strike pips should match the ones in the strip” · “Reaction pip on the combat strip still has old fill and hard to read”",
    ["The AP are <b>squares</b> (today circles). The Reaction AP is a <b>gold diamond</b>, the AP's own gold (today teal): its shape says what it is. The Strikes are the HUD's <b>slashes in the HUD's red</b> (today orange); a Strike already made is a faint outline.",
      "A filled mark is one you still have, as on the HUD. Here: 3 of 4 AP, the Reaction AP, 2 of 3 Strikes left, Escalation 4.",
      "The marks are a little bigger than the HUD's (AP 12 px, the diamond 10 px, a slash 13 px tall; the HUD: 9, 8 and 11). The Esc. row is as built.",
      "Nothing added, moved or removed: shapes and colors only."],
    pair(draw(a, pc, { cap: BUILT }), draw(a, pc, { cap: "Proposed", fix: ["marks"] }))); },
  () => { const [a, pc] = sylwen(); return sec(2, "The Basic Actions' vertical strips",
    "“Vertical lines of Basic actions are very hard to see”",
    ["The Frequency strip is <b>4 px wide</b> (today 3) in the theme's Frequency color at nearly full strength (today a fixed dark color at 55%, made for the light sheet: on the dark sheet it almost goes).",
      "A Strike's second strip is <b>3 px</b> (today 2) in the Strikes' red, the same red as the slashes of part 1, with a 1 px gap so the two strips read as two.",
      "An Action that can't be used now keeps its dashed, faded strip. Nothing added, moved or removed."],
    pair(draw(a, pc, { crop: "basic", cap: BUILT }), draw(a, pc, { crop: "basic", cap: "Proposed", fix: ["strips"] }))); },
  () => { const [a, pc] = sylwen(), [b, pb] = aveline(); const row = (x, px) => pair(draw(x, px, { crop: "basic", cap: `${BUILT} · ${x.name.split(" ")[0]}` }), draw(x, px, { crop: "basic", cap: "Option A: four columns, the name shrinks", fix: ["strips", "a"] }), draw(x, px, { crop: "basic", cap: "Option B: three columns", fix: ["strips", "b"] }));
    return sec(3, "Long names in the Basic Actions: pick A or B",
      "“Weapon Attack and Steel Yourself are long and dont fit”",
      ["<b>Option A, four columns kept.</b> The cost is written without “AP” (“1”, “2/3”, “1/2/3”): every number in that place is AP. With that, “Weapon Attack” and “Steel Yourself” fit at full size. A longer name (a future Basic Action, a narrower window) shrinks until it fits (down to 9.5 px, as the HUD's names do) and is never cut. Removed: the word “AP” on each Basic Action.",
        "<b>Option B, three columns.</b> Control goes under Attack; Movement and Utility keep a column each. Every name fits at full size and the cost keeps “AP”. The block is about 100 px (3 to 4 lines) taller. Moved: the Control group.",
        "Not drawn: icons in the place of names. With no hover texts, 19 icons would have to be learned by heart.",
        "Both options are drawn with the strips of part 2."],
      row(a, pc) + row(b, pb)); },
  () => { const [a, pc] = ogre(), [b, pb] = orc(); return sec(4, "An Elite's combat line laid out like a PC's",
    "“AP, Escalation etc from Elite NPCs should mimic PCs”",
    ["At the left, where a PC has its hooks: <b>Phases</b>, a small heading and each phase in bold with its state (“✓” or “not yet”).",
      "At the right, the PC's marks cell: the <b>AP</b> row (part 1's marks) and an <b>Esc.</b> row: six diamonds, the Elite ladder's rungs (2, 4, 6) ringed, the number. A click on a diamond sets the Escalation, as on a PC's sheet.",
      "<b>The ladder's names</b> (Pressing, Relentless, Second Wind) go on one small line under the phases, each with its number; the ones reached in ink, the others faint. They are no longer the buttons (the diamonds are). Why there: an NPC has no Build tab to read them on, and a ringed diamond alone doesn't say which rung it is.",
      "The line is 66 px tall, the PC's height (today about 70 px and growing with its text). Removed: the title “Elite Escalation 2” (the Esc. row says it) and the word “Phases:” in the sentence (now the heading).",
      "A Standard NPC (the Orc Warrior) has no Escalation: only the AP row, where it is today."],
    pair(draw(a, pc, { cap: `${BUILT} · an Elite` }), draw(a, pc, { cap: "Proposed · an Elite", fix: ["marks", "elite"] })) + pair(draw(b, pb, { cap: `${BUILT} · a Standard` }), draw(b, pb, { cap: "Proposed · a Standard", fix: ["marks"] }))); },
  () => { const [a, pc] = ogre(), [b, pb] = orc(), [c, pcc] = sylwen(); return sec(5, "An NPC's Attribute and Modifier tiles in the PC's layout",
    "“Attributes and modifiers as well”",
    ["The NPC's tiles take the PC's grid: four Attributes, the gap, three Modifier places, every tile the PC's width. An NPC has no Signature Modifier (and the Ogre and the Orc no Power Modifier): those places stay empty.",
      "The Modifier tiles are named as a PC's: “Weapon”, “Power” (today “Weapon Mod.”, which doesn't fit a tile of the PC's width).",
      "Nothing else changes: the same numbers, the same clicks."],
    pair(draw(c, pcc, { crop: "tiles", cap: "A PC's tiles today, for comparison" })) + pair(draw(a, pc, { crop: "tiles", cap: `${BUILT} · an Elite` }), draw(a, pc, { crop: "tiles", cap: "Proposed · an Elite", fix: ["tiles"] })) + pair(draw(b, pb, { crop: "tiles", cap: `${BUILT} · a Standard` }), draw(b, pb, { crop: "tiles", cap: "Proposed · a Standard", fix: ["tiles"] }))); },
  () => { const [a, pc] = ogre(), [b, pb] = orc(); return sec(6, "The Basic attack's subtitle: its own Tier 2 / Tier 3 damage",
    "“Remove ‘- high...’ from basic attack, just put the basic attack plus tiers like ‘Basic attack - 2 + 1d6! / 5 + 1d6!’”",
    ["The subtitle is written from the Action's own damage: Tier 2 / Tier 3, the flat number first. Removed: the rating's word (“High”, “Medium”) and the “~” estimate (the Builder's suggestion, which is not what the Action deals).",
      "An Elite's “+1 Boon on its first attack this round” (from Escalation 2) stays after it. It is long: today it squeezes the name to “C…”. In the proposal the name is never cut and the subtitle's end gives way."],
    pair(draw(b, pb, { crop: "acts", cap: `${BUILT} · a Standard` }), draw(b, pb, { crop: "acts", cap: "Proposed · a Standard", fix: ["sub"] })) + pair(draw(a, pc, { crop: "acts", cap: `${BUILT} · an Elite` }), draw(a, pc, { crop: "acts", cap: "Proposed · an Elite", fix: ["sub"] }))); }
];
out.insertAdjacentHTML("beforeend", `<h1>Group 1: the sheets' marks, Basic Actions and NPCs</h1><p class="g1-lead">A mockup: nothing in the system changed. Each part shows the sheet as built in v0.0.442 beside the proposal, cropped to the part that changes. The windows are 540 px wide, the sheets' real width.</p>`);
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
for (const hl of document.querySelectorAll(".ps2-hooks .ps2-hl")) SM.fitHooks(hl);   // actor-sheets.mjs _fitHooks, as the sheet runs it
/** Option A's fit (hud.mjs fitNames, on the sheet's Basic Actions): the name shrinks by half pixels to 9.5 px; below that, two lines. Never cut. */
for (const n of document.querySelectorAll(".ps2-bxn[data-fit]")) {
  let size = parseFloat(getComputedStyle(n).fontSize) || 13;
  while (n.scrollWidth > n.clientWidth + 0.5 && size > 9.5) { size -= 0.5; n.style.fontSize = `${size}px`; }
  if (n.scrollWidth > n.clientWidth + 0.5) n.classList.add("wrap");
}
document.body.dataset.ready = "1";
