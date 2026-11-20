// Group 1, ROUND 3 (Lucas's answer to round 2, 2026-11-19): a heraldic symbol beside each rung of the Escalation ladder. A mockup: round 2's
// approved combat line (its code copied from round2.mjs: the model, line(), draw(); round2.css and group1.css loaded as they are), with the
// ladder's rows redrawn here under .r3-* classes (round3.css). Three families of symbols, each a 2 / 4 / 6 triple. Nothing in foundry/twod12 changed.
//   round3.html?theme=dark|light
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
      if (pc.strip.elite && escN >= SM.ELITE_RUNGS[0].n) subs.push("+1 Boon on its first attack this round");
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
/* ------------------------------------------------------------------ the symbols: three families, each a 2 / 4 / 6 triple
   One drawing each (viewBox 24 x 28), in currentColor: ink on a rung reached, faint on the others, as the rung's name. No fill has a meaning of
   its own: a filled part (the chief, the tower) is part of the drawing, not a state. */
const S = 'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="miter" stroke-linecap="butt"';
const SHIELD = `<path ${S} d="M3.25 3.25H20.75V14C20.75 19.6 17 23.6 12 26.2C7 23.6 3.25 19.6 3.25 14Z"/>`;
const TOWER = "M5 27V13H3V5H7V8.5H10V5H14V8.5H17V5H21V13H19V27H14V22a2 2 0 0 0-4 0V27Z";
const FAMILIES = {
  A: { name: "The escutcheon", idea: "One shield, the same outline on every rung, that gains a charge each time: the plain shield; the shield with a chevron; the shield with a chevron under a chief (the filled band across its top). It is how arms were really augmented, so 4 is 2 with more on it and 6 is 4 with more on it.",
    2: SHIELD,
    4: `${SHIELD}<path ${S} d="M6.6 17.6L12 11.6L17.4 17.6"/>`,
    6: `${SHIELD}<path fill="currentColor" d="M3.25 3.25H20.75V10H3.25Z"/><path ${S} d="M7 20.4L12 14.8L17 20.4"/>` },
  B: { name: "Marks of rank", idea: "Chevrons counted as a sergeant's stripes (heraldry's chevronels): one; two; three under a bar. The plainest to read small, but a count of 1, 2, 3 beside the numbers 2, 4, 6, and an upward chevron is also an interface's “collapse” arrow.",
    2: `<path ${S} stroke-width="3" d="M4 19L12 11L20 19"/>`,
    4: `<path ${S} stroke-width="3" d="M4 15.5L12 7.5L20 15.5M4 23L12 15L20 23"/>`,
    6: `<path ${S} stroke-width="2.6" d="M4 3.5H20M4 15L12 8L20 15M4 20.8L12 13.8L20 20.8M4 26.6L12 19.6L20 26.6"/>` },
  C: { name: "The keep", idea: "A fortification that grows: a low embattled wall; a tower with its gate; the tower flying a banner. Drawn solid, because its battlements are too fine for a line at this size; the most pictorial of the three, and the closest to a game's stock icon (a chess rook).",
    2: `<path fill="currentColor" d="M3 27V17H7V20.5H10V17H14V20.5H17V17H21V27Z"/>`,
    4: `<path fill="currentColor" d="${TOWER}"/>`,
    6: `<path fill="currentColor" d="M5 27V17.5H3V11H7V13.8H10V11H11V1H12.6L19.5 3.8L12.6 6.6V11H14V13.8H17V11H21V17.5H19V27H14V23a2 2 0 0 0-4 0V27Z"/>` }
};
const sym = (fam, n, cls = "r3-sym") => `<svg class="${cls}" viewBox="0 0 24 28" aria-hidden="true">${FAMILIES[fam][n]}</svg>`;
/** The hooks' mark (part 4's variant): a roundel, heraldry's plainest charge. Solid while the hook is left, a ring once it gave its Escalation. */
const roundel = used => `<svg class="r3-hm" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="${used ? 3.9 : 4.6}" ${used ? 'fill="none" stroke="currentColor" stroke-width="1.5"' : 'fill="currentColor"'}/></svg>`;

/** The Escalation row's marks (round 2's): the HUD's upright ticks, filled up to the level; a rung's tick is taller. */
const ticks = (n, rungs, word) => `<span class="r2-esc">${Array.from({ length: 6 }, (_, k) => `<a class="${k < n ? "on" : ""}${rungs.includes(k + 1) ? " rg" : ""}" data-action="setEscalation" data-n="${k + 1}" role="button" aria-label="${word} ${k + 1}"></a>`).join("")}</span><b class="ps2-en">${n}</b>`;
/** Round 2's two lists; round 3: a rung's symbol before its number (o.fam: the family, or none; o.num false: no number; o.hooks: the hooks' mark).
 *  A rung's symbol is its 1st, 2nd or 3rd of the family, whatever the rung's number (a ladder has three rungs). */
function lists(hooks, ladder, idle, o = {}) {
  const hk = hooks.length ? `<span class="r2-l r2-hl">${hooks.map(h => `<b class="${h.used ? "used" : ""}">${o.hooks ? roundel(h.used) : ""}${esc(h.name)}${h.used ? "<i>✓</i>" : ""}</b>`).join("")}</span>` : '<span class="r2-l r2-none">None</span>';
  const ld = `<span class="r2-l r2-ld">${ladder.map((r, k) => `<span class="${r.lit ? "lit" : ""}">${o.fam ? sym(o.fam, [2, 4, 6][k]) : ""}${o.num === false ? "" : `<b>${r.n}</b>`}${esc(r.name)}</span>`).join("")}</span>`;
  return `<div class="ps2-cell r2-lists${idle ? " idle" : ""}${o.fam ? " r3" : ""}${o.hooks ? " r3-hooks" : ""}"><div class="r2-col"><span class="ps2-hk">Hooks</span>${hk}</div><div class="r2-col"><span class="ps2-hk">Escalation</span>${ld}</div></div>`;
}
/** The combat line, round 2's (a PC and an Elite: the two lists, then the marks cell), with round 3's options for the lists. */
function line(host, pc, a, o) {
  const row = host.querySelector(".ps2-combat"), x = pc.r2 ?? {};
  if (!row) return;
  const elite = !!pc.strip.elite, n = Number(pc.strip.esc?.n) || 0;
  row.classList.add("r2");
  const hooks = elite ? [{ name: "Bloodied +1", used: !!a.system.bloodied }, { name: "Strained +1", used: !!a.system.strained }] : (x.hooks ?? []);
  const ladder = elite ? pc.strip.eliteRungs.map(r => { const [k, name] = String(r.label).split(" · "); return { n: k, name, lit: r.lit }; }) : (x.ladder ?? []).map(([k, name]) => ({ n: k, name, lit: n >= k }));
  const marks = row.querySelector(".ps2-marks");
  if (!marks) return;
  for (const c of [...row.children]) if (c !== marks) c.remove();
  marks.insertAdjacentHTML("beforebegin", lists(hooks, ladder, false, o));
  const rungs = elite ? SM.ELITE_RUNGS.map(r => r.n) : [2, 4, 6], word = elite ? "Elite Escalation" : "Escalation";
  const old = marks.querySelector(".ps2-epips")?.closest(".ps2-mrow");
  if (old) { const mom = old.querySelector(".ps2-q"); old.innerHTML = ticks(n, rungs, word); if (mom) old.append(" ", mom); }
  else { marks.querySelector(".bane")?.remove(); marks.insertAdjacentHTML("beforeend", `<span class="k">Esc.</span><span class="ps2-mrow">${ticks(n, rungs, word)}</span>`); }
}

/** One window, always the proposal (round 2's line with round 1's marks and tiles). crop "top": the plate, the tiles, the combat line;
 *  "line": the combat line alone, drawn twice its size. o: round 3's options (fam, num, hooks). */
function draw(a, pc, { crop = "top", cap = "", o = {} } = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "actions");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "actions");
  host.querySelectorAll("[data-tooltip]").forEach(x => x.removeAttribute("data-tooltip"));
  host.querySelectorAll("[title]").forEach(x => x.removeAttribute("title"));
  line(host, pc, a, o);
  if (pc.npc) tiles(host);
  return `<div class="g1-shot"><h3>${cap}</h3><div class="g1-clip g1-crop-top ${crop === "line" ? "r3-crop-line" : ""} g1-marks r2-line ${pc.npc ? "g1-tiles" : ""}"><div class="mk-win" style="width:540px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px"><header class="window-header"><span class="window-title">${esc(a.name)}</span><span class="mk-x">&times;</span></header><section class="window-content">${icons(art(host.innerHTML))}</section></div></div></div></div>`;
}

/* ------------------------------------------------------------------ the creatures and their example state */
// The ladder's names are stand-ins, as in round 2 (the build reads them from the class's Passives).
const AV_LADDER = [[2, "Roving Judgment"], [4, "Weight of Judgment"], [6, "Apex"]];
/** Aveline at Escalation 4 (2 and 4 reached, 6 not). hooks: [[name, used]]. */
function aveline(hooks = [["Critical"], ["Kindled Wrath"]]) {
  const a = makeActor(data.aveline, { system: { escalation: 4 } });
  const pc = model(a, { inCombat: true, round: 2, ap: 4, rap: 1, strikes: 0, hookList: hooks.filter(h => !h[1]).map(h => h[0]) });
  pc.r2 = { hooks: hooks.map(([name, used]) => ({ name, used: !!used })), ladder: AV_LADDER };
  return [a, pc];
}
/** The Ogre Chieftain at Elite Escalation 2, Bloodied (round 2's state). */
const ogre = () => { const bdt = makeActor(data.ogre).system.bdt; const a = makeActor(data.ogre, { system: { escalation: 2, damage: { bodyLethal: bdt } } }); return [a, model(a, { inCombat: true, round: 1, ap: Number(a.system.apPerTurn) || 4, rap: 1, strikes: 1 })]; };
const row = (...shots) => `<div class="g1-pair">${shots.join("")}</div>`;
const sec = (n, title, notes, body) => `<section class="g1-sec"><h2>${n}. ${title}</h2><ul class="g1-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>${body}</section>`;
const REC = "A";

/** Part 1: a family's plate. The triple large, then at the line's size as the ladder writes it (reached, not reached), on the dark and the light sheet. */
function plate(f) {
  const F = FAMILIES[f], names = { 2: "Roving Judgment", 4: "Weight of Judgment", 6: "Apex" };
  const lines = cls => `<span class="r3-spec ${cls}">${[2, 4, 6].map(n => `<span>${sym(f, n)}<b>${n}</b>${names[n]}</span>`).join("")}</span>`;
  const panel = t => `<div class="r3-panel theme-${t}"><span class="r3-pk">${t === "dark" ? "Dark" : "Light"}</span><div class="r3-big">${[2, 4, 6].map(n => `<figure>${sym(f, n, "r3-big-s")}<figcaption>${n}</figcaption></figure>`).join("")}</div>
    <div class="r3-small"><div><span class="r3-pk">Reached</span>${lines("lit")}</div><div><span class="r3-pk">Not reached</span>${lines("")}</div></div></div>`;
  return `<div class="r3-fam"><h3><b>${f}. ${F.name}</b>${f === REC ? " · recommended" : ""}</h3><p class="r3-idea">${F.idea}</p><div class="r3-panels">${panel("dark")}${panel("light")}</div></div>`;
}

const out = document.getElementById("page");
const parts = [
  () => sec(1, "Three families of symbols",
    ["Each family is three drawings, one a rung: <b>2</b> the plain one, <b>4</b> the same with more on it, <b>6</b> richer again (the Apex). One color: ink on a rung reached, faint on the others, the rule the rung's name already follows. No gold, no glow, nothing borrowed from an icon set.",
      "Each is shown large (48 px tall), then as the ladder writes it (14 px tall beside 13 px text), on the dark sheet and on the light one."],
    `<div class="r3-fams">${["A", "B", "C"].map(plate).join("")}</div>`),
  () => { const [a, pc] = aveline(), [b, pb] = ogre(); return sec(2, "The combat line with each family",
    ["Round 2's line, unchanged but for the ladder: each rung's symbol stands before its number. <b>Added:</b> the three symbols. Moved, removed: nothing. The line is still 72 px tall, fixed; a symbol is 14 px in a 16 px row.",
      "<b>Aveline</b> at Escalation 4 with both hooks left: rungs 2 and 4 in ink, 6 faint. <b>The Ogre Chieftain</b> (an Elite) at Elite Escalation 2, Bloodied: its ladder is 2 Pressing, 4 Relentless, 6 Second Wind, and takes the same three symbols.",
      "The symbol is the rung's place on the ladder (first, second, third), never its number: a ladder always has three rungs."],
    row(...["A", "B", "C"].map(f => draw(a, pc, { cap: `<b>${f}. ${FAMILIES[f].name}</b> · Aveline, Escalation 4`, o: { fam: f } })))
    + row(...["A", "B", "C"].map(f => draw(b, pb, { cap: `<b>${f}. ${FAMILIES[f].name}</b> · the Ogre Chieftain, Elite Escalation 2`, o: { fam: f } })))); },
  () => { const [a, pc] = aveline(); return sec(3, "Does the number stay beside the symbol? Yes",
    ["<b>Kept (recommended, the middle picture):</b> the symbol, the number, the name. The symbol says which rung it is; only the number says at which Escalation it is reached. The ticks at the right count, but a reader would have to count them and match a tall tick to a row; and with no hover texts there is nowhere else to learn that the shield with a chevron means 4. The number costs about 14 px of width and no height.",
      "<b>Without the number (the right picture):</b> cleaner, but the rung's Escalation is then read only by counting ticks. Drawn so it can be compared, not recommended."],
    row(draw(a, pc, { cap: "Round 2 (approved): the number alone" }), draw(a, pc, { cap: `<b>The symbol and the number</b> · recommended`, o: { fam: REC } }), draw(a, pc, { cap: "The symbol alone", o: { fam: REC, num: false } }))); },
  () => { const [a, pc] = aveline([["Critical", true], ["Kindled Wrath"]]), [b, pb] = ogre(); return sec(4, "One variant: a mark on each hook too",
    ["Lucas wrote “the hooks/critical”, so here is the hooks' list with a mark as well: a <b>roundel</b>, heraldry's plainest charge (a disc). Solid while the hook is left; a ring once it gave its Escalation (the name still turns faint and takes its check, so the state never depends on the mark alone).",
      "Why a roundel and not the family's plain shield: a shield beside a hook would say “this is a rung”. Why not a diamond: the diamond is the Reaction AP's (round 2 took it off the hooks for that reason).",
      "<b>Not recommended.</b> The roundel says nothing the bold name, the faint name and the check don't already say; it is a bullet, and it puts a fifth kind of mark on a line that already has squares, a diamond, slashes and ticks. The ladder's symbols earn their place because they show a growth; a hook has nothing to grow."],
    row(draw(a, pc, { cap: "<b>No mark on a hook</b> · recommended · Aveline, Critical used", o: { fam: REC } }), draw(a, pc, { cap: "A roundel on each hook · Aveline, Critical used", o: { fam: REC, hooks: true } }), draw(b, pb, { cap: "A roundel on each hook · the Ogre Chieftain", o: { fam: REC, hooks: true } }))); },
  () => { const [a, pc] = aveline(), [b, pb] = ogre(); return sec(5, "Recommended: A, the escutcheon, with the number, no mark on the hooks",
    ["<b>It is the only family where 4 is literally 2 with more on it.</b> The outline never changes, so the three rows line up as one column of the same shape and the eye reads only what was added: nothing, a chevron, a chevron under a chief. B and C change their whole silhouette from rung to rung.",
      "<b>It is heraldry, not an interface.</b> A shield outline is no control's icon. B's upward chevrons are also the arrows an interface uses to collapse or scroll up, and its count of 1, 2, 3 sits beside the numbers 2, 4, 6. C's tower is a chess rook to most eyes, and has to be drawn solid to survive 14 px, which makes it the heaviest thing on the line.",
      "<b>It stays quiet.</b> Line work the weight of the text's own strokes; the one filled part (the chief) marks the Apex and is small.",
      "Its weak spot: at 14 px the chevron is about 5 px wide, so 2 and 4 differ by a small detail. They are never read alone (the number and the name are beside them), and below the line's two pictures are drawn at twice their size to judge it.",
      "The same three symbols serve every ladder (a PC's Passives, the Elite's), so nothing new is learned per class."],
    row(draw(a, pc, { crop: "line", cap: "Aveline's line, twice its size", o: { fam: REC } })) + row(draw(b, pb, { crop: "line", cap: "The Ogre Chieftain's line, twice its size", o: { fam: REC } }))); }
];
out.insertAdjacentHTML("beforeend", `<h1>Group 1, round 3: a heraldic symbol on each Escalation rung</h1><p class="g1-lead">A mockup: nothing in the system changed. Round 2's combat line is approved; Lucas asked for a simple, serious symbol “like a Heraldry symbol” beside each Escalation rung, where 4 is 2 made richer and 6 follows suit. This page draws three families, puts each on the line, and recommends one. The windows are 540 px wide.</p>`);
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
/** Round 2's fit: the text (and, sized in em, its symbols) shrinks by half pixels until no line is wider than its column or the list taller than its place. */
for (const l of document.querySelectorAll(".r2-l")) {
  let size = parseFloat(getComputedStyle(l).fontSize) || 14;
  const over = () => l.scrollWidth > l.clientWidth + 0.5 || l.scrollHeight > l.clientHeight + 0.5;
  while (over() && size > 7) { size -= 0.5; l.style.fontSize = `${size}px`; l.dataset.fit = size; }
}
document.body.dataset.ready = "1";
