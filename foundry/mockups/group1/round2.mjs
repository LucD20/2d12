// Group 1, ROUND 2 (Lucas's answers to round 1, 2026-11-19): the combat line only. A mockup: each part draws the sheet AS BUILT (v0.0.442: the
// system's own template and CSS on the sheets mockup's model, as group1.mjs does) beside the proposal (the same HTML, its combat line rebuilt
// here, round2.css laid over it under .r2-* classes; round 1's approved marks and tiles come from group1.css). Nothing in foundry/twod12 changed.
//   round2.html?theme=dark|light
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

/* ------------------------------------------------------------------ the proposal's DOM changes */
/** Round 1, part 5 (approved): the NPC's Modifier tiles named as a PC's. */
function tiles(host) { for (const t of host.querySelectorAll(".ps2-tile.mod > span")) t.textContent = t.textContent.replace(/\s*Mod\.$/, ""); }
/** Round 1, part 6 (approved), without an Elite's "+1 Boon on its first attack this round" (Lucas, round 2): "Basic attack · 1 + 1d4! / 3 + 1d6!". */
const dmgWords = list => (list ?? []).map(d => { const m = /^(.+?)\s*([+\-−])\s*(\d+)$/.exec(String(d.dice ?? "").trim()); return !m ? String(d.dice ?? "") : m[2] === "+" ? `${m[3]} + ${m[1]}` : `${m[1]} − ${m[3]}`; }).filter(Boolean).join(" + ");
function basicSub(host, a) {
  for (const row of host.querySelectorAll(".ps2-oa.basicatk")) {
    const it = a.items.get(row.dataset.itemId), sub = row.querySelector(".ps2-sub"), v = it?.system?.versions?.[0];
    if (sub && v) sub.textContent = `Basic attack · ${dmgWords(v.t2)} / ${dmgWords(v.t3)}`;
  }
}
/** The Escalation row's marks: the HUD's upright ticks (hudview.mjs escHtml), filled up to the level; a rung's tick is taller (a ruler's long mark). */
const ticks = (n, rungs, word) => `<span class="r2-esc">${Array.from({ length: 6 }, (_, k) => `<a class="${k < n ? "on" : ""}${rungs.includes(k + 1) ? " rg" : ""}" data-action="setEscalation" data-n="${k + 1}" role="button" aria-label="${word} ${k + 1}"></a>`).join("")}</span><b class="ps2-en">${n}</b>`;
/** The two lists of the left cell, side by side: Hooks (one a line; one that gave its Escalation stays, faint, with a check) and the ladder. */
function lists(hooks, ladder, idle) {
  const hk = hooks.length ? `<span class="r2-l r2-hl">${hooks.map(h => `<b class="${h.used ? "used" : ""}">${esc(h.name)}${h.used ? "<i>✓</i>" : ""}</b>`).join("")}</span>` : '<span class="r2-l r2-none">None</span>';
  const ld = `<span class="r2-l r2-ld">${ladder.map(r => `<span class="${r.lit ? "lit" : ""}"><b>${r.n}</b>${esc(r.name)}</span>`).join("")}</span>`;
  return `<div class="ps2-cell r2-lists${idle ? " idle" : ""}"><div class="r2-col"><span class="ps2-hk">Hooks</span>${hk}</div><div class="r2-col"><span class="ps2-hk">Escalation</span>${ld}</div></div>`;
}
/** The combat line, round 2. A PC and an Elite: the two lists, then the marks cell (AP row; Esc. row of ticks). The Hands are gone (the HUD's
 *  tiles and the Inventory tab hold them). A Standard NPC: an empty left, its AP marks at the right. Out of combat: the lists, quiet, and the
 *  words "Out of combat" where the marks are. */
function line(host, pc, a) {
  const row = host.querySelector(".ps2-combat"), x = pc.r2 ?? {};
  if (!row) return;
  const elite = !!pc.strip.elite, n = Number(pc.strip.esc?.n) || 0;
  row.classList.add("r2");
  if (pc.npc && !elite) {                       // a Standard: no hooks, no Escalation
    const marks = row.querySelector(".ps2-marks");
    row.classList.add("r2-std");
    if (marks) marks.before(el("div", "ps2-cell r2-empty")); else row.innerHTML = '<div class="ps2-cell r2-empty"></div><div class="ps2-cell r2-out"><span>Out of combat</span></div>';
    return;
  }
  const hooks = elite ? [{ name: "Bloodied +1", used: !!a.system.bloodied }, { name: "Strained +1", used: !!a.system.strained }] : (x.hooks ?? []);
  const ladder = elite ? (pc.strip.eliteRungs ?? []).map(r => { const [k, name] = String(r.label).split(" · "); return { n: k, name, lit: r.lit }; }) : (x.ladder ?? []).map(([k, name]) => ({ n: k, name, lit: n >= k }));
  const marks = row.querySelector(".ps2-marks");
  if (!marks) { row.innerHTML = `${lists(hooks.map(h => ({ name: h.name })), ladder.map(r => ({ ...r, lit: false })), true)}<div class="ps2-cell r2-out"><span>Out of combat</span></div>`; return; }
  for (const c of [...row.children]) if (c !== marks) c.remove();
  marks.insertAdjacentHTML("beforebegin", lists(hooks, ladder, false));
  const rungs = elite ? (SM.ELITE_RUNGS ?? []).map(r => r.n) : [2, 4, 6], word = elite ? "Elite Escalation" : "Escalation";
  const old = marks.querySelector(".ps2-epips")?.closest(".ps2-mrow");
  if (old) { const mom = old.querySelector(".ps2-q"); old.innerHTML = ticks(n, rungs, word); if (mom) old.append(" ", mom); }
  else { marks.querySelector(".bane")?.remove(); marks.insertAdjacentHTML("beforeend", `<span class="k">Esc.</span><span class="ps2-mrow">${ticks(n, rungs, word)}</span>`); }
}

/** One window, cropped ("top": the plate, the tiles, the combat line; "acts": the Actions' bars). fix: the proposal's changes. */
function draw(a, pc, { crop = "top", fix = [], cap = "" } = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "actions");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "actions");
  host.querySelectorAll("[data-tooltip]").forEach(x => x.removeAttribute("data-tooltip"));
  host.querySelectorAll("[title]").forEach(x => x.removeAttribute("title"));
  if (fix.includes("line")) line(host, pc, a);
  if (fix.includes("tiles")) tiles(host);
  if (fix.includes("sub")) basicSub(host, a);
  const cls = fix.map(f => (f === "line" ? "r2-line" : `g1-${f}`)).join(" ");
  return `<div class="g1-shot"><h3>${cap}</h3><div class="g1-clip g1-crop-${crop} ${cls}"><div class="mk-win" style="width:540px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px"><header class="window-header"><span class="window-title">${esc(a.name)}</span><span class="mk-x">&times;</span></header><section class="window-content">${icons(art(host.innerHTML))}</section></div></div></div></div>`;
}

/* ------------------------------------------------------------------ the creatures and their example state */
const HANDS = { Dagger: { wielded: true, hand: "off" }, "Hunting Bow": { hand: "main" } };
// The ladders' names are stand-ins (the Passives' names as the brief gave them); in the build they come from the class's Passives.
const LADDER = { sylwen: [[2, "Lean and Loose"], [4, "Steady Draw"], [6, "Apex"]], aveline: [[2, "Roving Judgment"], [4, "Weight of Judgment"], [6, "Apex"]] };
/** A PC. hooks: [[name, used]] (as built shows only the ones left: "Hooks left"). */
function pcOf(key, { escalation = 0, hooks = [], inCombat = true, ap = 4, rap = 1, strikes = 0, round = 2, items, ladder } = {}) {
  const a = makeActor(data[key], { system: { escalation, ...(key === "sylwen" ? { damage: { bodyLethal: 6, mindNonlethal: 3 } } : {}) }, ...(items ? { items } : {}) });
  const pc = model(a, { inCombat, round, ap, rap, strikes, hookList: hooks.filter(h => !h[1]).map(h => h[0]) });
  pc.r2 = { hooks: hooks.map(([name, used]) => ({ name, used: !!used })), ladder: ladder ?? LADDER[key] };
  return [a, pc];
}
const ogre = () => { const bdt = makeActor(data.ogre).system.bdt; const a = makeActor(data.ogre, { system: { escalation: 2, damage: { bodyLethal: bdt } } }); return [a, model(a, { inCombat: true, round: 1, ap: Number(a.system.apPerTurn) || 4, rap: 1, strikes: 1 })]; };
const orc = () => { const a = makeActor(data.orc, { system: { damage: { bodyLethal: 5 } } }); return [a, model(a, { inCombat: true, round: 2, ap: 3, rap: 0, strikes: 1 })]; };
const BUILT = "As built (v0.0.442)", PROP = ["marks", "line"], NPROP = ["marks", "tiles", "line"];
const pair = (...shots) => `<div class="g1-pair">${shots.join("")}</div>`;
const sec = (n, title, notes, body) => `<section class="g1-sec"><h2>${n}. ${title}</h2><ul class="g1-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>${body}</section>`;
const both = (a, pc, tag = "", fix = PROP) => pair(draw(a, pc, { cap: BUILT + tag }), draw(a, pc, { cap: `Proposed${tag}`, fix }));

const out = document.getElementById("page");
const parts = [
  () => { const [a, pc] = pcOf("sylwen", { escalation: 4, hooks: [["Critical"]], ap: 3, strikes: 1, round: 3, items: HANDS }); return sec(1, "Sylwen in combat",
    ["<b>Removed:</b> the two Hands (Hunting Bow, Dagger). The HUD's tiles hold them, and the Inventory tab will.",
      "<b>Changed, the left of the line:</b> two short lists side by side. <b>Hooks</b>, one a line (today “Hooks left”, in a row, each after a gold diamond). <b>Escalation</b>, the ladder: 2, 4 and 6, each with its Passive's name; a rung reached in ink, the others faint. Here Escalation 4: two rungs reached.",
      "<b>Changed, the Esc. row:</b> the HUD's upright ticks, filled up to the level, then the number (today gold diamonds). The gold diamond now means the Reaction AP and nothing else. A rung's tick (2, 4, 6) is taller, as the long marks of a ruler. A click on a tick sets the Escalation.",
      "The AP row is round 1's (squares, the gold diamond, the red slashes). The line is 72 px tall and never grows (today 66 px)."],
    both(a, pc)); },
  () => { const [a, pc] = pcOf("aveline", { escalation: 6, hooks: [["Critical"], ["Kindled Wrath"]] }), [b, pb] = pcOf("aveline", { escalation: 6, hooks: [["Critical", true], ["Kindled Wrath"]] }); return sec(2, "Aveline in combat, and a hook used",
    ["Escalation 6: every tick filled, the three rungs in ink.",
      "<b>A used hook stays in its place</b>, faint, with a check (today it leaves the list). The list is then the same from the first round to the last, a player sees what is spent and what is left, and it is the same mark as an Elite's phase that has happened (part 3)."],
    both(a, pc, " · both hooks left") + both(b, pb, " · Critical used")); },
  () => { const [a, pc] = ogre(); return sec(3, "The Ogre Chieftain (an Elite) in combat",
    ["The same line as a PC's. <b>Hooks:</b> its phases, “Bloodied +1” and “Strained +1”; the one that has happened is faint with a check (the Ogre is Bloodied). <b>Removed:</b> the heading “Phases” and the words “not yet”.",
      "<b>Escalation:</b> the Elite ladder (2 Pressing, 4 Relentless, 6 Second Wind) as a list beside the hooks; and the Esc. row of ticks under the AP row (today the title “Elite Escalation 2” with small diamonds, and the three names as buttons). A click on a tick sets the Escalation.",
      "Its tiles are round 1's (the PC's grid, “Weapon”).",
      "<b>The Basic attack's bar</b> (below): round 1's subtitle, and <b>removed:</b> “+1 Boon on its first attack this round”. The ladder's “2 Pressing” still says the Elite has it."],
    both(a, pc, "", NPROP) + pair(draw(a, pc, { crop: "acts", cap: `${BUILT} · its Basic attack` }), draw(a, pc, { crop: "acts", cap: "Proposed · its Basic attack", fix: ["sub"] }))); },
  () => { const [a, pc] = orc(); return sec(4, "The Orc Warrior (a Standard) in combat",
    ["<b>Moved:</b> the AP marks go to the right, where every other sheet has them. The left stays empty: a Standard has no hooks and no Escalation, and a word there (“None”) would say it could have.",
      "One row of marks, so the line is 44 px tall, fixed (today 44 px or more)."],
    both(a, pc, "", NPROP)); },
  () => { const [a, pc] = pcOf("sylwen", { inCombat: false, hooks: [["Critical"]], items: HANDS }); return sec(5, "Sylwen out of combat",
    ["The same height (72 px) and the same left: the two lists stay where they are, quiet (no hook is bold, no rung reached), so nothing jumps when combat begins and the ladder can be read at any time.",
      "“Out of combat” is written where the marks will be (today centered in the left cell, beside the Hands)."],
    both(a, pc)); },
  () => { const [a, pc] = pcOf("aveline", { escalation: 3, hooks: [["Critical"], ["Kindled Wrath", true], ["An Oath Sworn Before the Dawn"], ["Bloodied Ally"]], ladder: [[2, "Roving Judgment"], [4, "The Weight of Final Judgment"], [6, "Apex"]] }); return sec(6, "The line never grows: long names and four hooks",
    ["Not Aveline's real hooks: a test of the fit. Each list shrinks its text until every name fits its column and every line fits the 72 px (from 14 px for the hooks and 13 px for the ladder, by half pixels). Nothing is cut and the line is not taller. Here four hooks with a 29-letter name land near 9.5 px: small, the price of a fourth hook; up to three hooks of a usual length stay at 14 px."],
    pair(draw(a, pc, { cap: "Proposed · the fit", fix: PROP }))); }
];
out.insertAdjacentHTML("beforeend", `<h1>Group 1, round 2: the combat line</h1><p class="g1-lead">A mockup: nothing in the system changed. Lucas approved round 1's marks, strips, four columns, tiles and subtitle; this round redraws only the combat line with his answers: the Hands leave it, the hooks and the Escalation ladder become two lists side by side, the Esc. row takes the HUD's ticks. Each part shows the sheet as built in v0.0.442 beside the proposal. The windows are 540 px wide.</p>`);
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
for (const hl of document.querySelectorAll(".ps2-hooks .ps2-hl")) SM.fitHooks(hl);   // as built: actor-sheets.mjs _fitHooks
/** The proposal's fit (the build: sheetmodel.mjs fitHooks rewritten for a list): the text shrinks by half pixels until no line is wider than
 *  its column and the list is no taller than its place. Never cut, never taller. */
for (const l of document.querySelectorAll(".r2-l")) {
  let size = parseFloat(getComputedStyle(l).fontSize) || 14;
  const over = () => l.scrollWidth > l.clientWidth + 0.5 || l.scrollHeight > l.clientHeight + 0.5;
  while (over() && size > 7) { size -= 0.5; l.style.fontSize = `${size}px`; }
}
document.body.dataset.ready = "1";
