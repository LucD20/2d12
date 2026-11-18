// The sheet fixes mockup (Lucas on v0.0.441, 2026-11-18: "Dont remake it yet... Make the mockup of these changes"). Each part: the sheet AS
// BUILT (the system's template and CSS, as built.html draws it) beside the proposal (the same HTML with the mockup's changes: fixes.css under
// .fx-new, and a few elements changed here). Nothing in foundry/twod12 changed.  fixes.html?theme=dark|light
import { makeActor, sheetModel, esc } from "./model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const AC = await import("../../twod12/module/actioncard.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const CFG = await import("../../twod12/module/config.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const data = await (await fetch("actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");

/** The build's model (built.mjs), with the state of each part. */
function model(a, st) {
  const pc = sheetModel(a, st), ap = st.ap ?? 4, rap = st.rap ?? 1;
  for (const sec of pc.sections) for (const r of sec.rows) { const hb = r.handBtns; r.bar = { ...SM.actionBar({ aps: r.item.system.versions.map(v => v.ap), reaction: !!r.item.system.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: pc.strip.inCombat, ap, rap }), weaponId: hb?.length === 1 ? hb[0].id : "", hands: hb?.length >= 2 ? hb : null }; }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; }); pc.mods.forEach(m => { m.tile = m.label; });
  const escN = Number(a.system.escalation) || 0;
  pc.strip.esc.pips = Array.from({ length: 6 }, (_, k) => k < escN);
  if (st.rungs) { pc.strip.esc.rungs = SM.escRungs(escN, st.rungs, true, 6); pc.strip.esc.hooks = st.hooks; }
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", "); pc.head.round = `Round ${st.round ?? 1}`;
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true });
  // the Build tab's Level 1 (pcsheet.mjs build.levels' rows: slot, name, cost, the frequency's color and word)
  const FW = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };
  const own = a.itemTypes.action.filter(i => !i.getFlag("twod12", "basic")).concat(a.itemTypes.feature);
  pc.build.levels = [{ title: "Level 1", rows: own.map(i => { const s = i.system, f = CFG.effectiveFrequency(s), isA = i.type === "action";
    return { id: i.id, slot: isA ? (s.reaction ? "Reaction" : "Action") : "Escalation 2 Passive", name: i.name, cost: isA ? SM.costPill((s.versions ?? []).map(v => v.ap), !!s.reaction) : "", fc: (SM.SHEET_FREQ[s.reaction ? "reaction" : f] ?? SM.SHEET_FREQ.atwill).color, freq: isA ? FW[f] ?? "" : "" }; }) }];
  return pc;
}
const win = (title, w, h, inner, cls = "") => `<div class="fx-clip ${cls}" style="--h:${h}px"><div class="mk-win" style="width:${w}px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:${w}px;height:${h}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div></div>`;
async function render(a, pc, { tab = "actions", fix = false } = {}) {
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] }));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === tab);
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === tab);
  for (const row of host.querySelectorAll(".ar.open")) { const it = a.items.get(row.dataset.itemId); if (it) row.querySelector(".ar-card").innerHTML = await AC.buildActionCard(it, { actor: a, short: true }); }
  if (fix) {
    // 1. no Frequency at a bar's end under a Frequency's heading
    for (const sec of host.querySelectorAll(".ps2-sec")) if (!/\b(reaction|granted|escal)\b/.test(sec.className) && !sec.querySelector(".fq-reaction, .fq-granted, .fq-apex")) sec.querySelectorAll(".ps2-fq").forEach(x => x.remove());
    // 2. out of combat: the words alone
    host.querySelectorAll(".ps2-combat.out .ps2-cell").forEach(c => { c.innerHTML = '<span class="fx-out">Out of combat</span>'; });
    // 5. AP and Strikes: their words as a column
    host.querySelectorAll(".ps2-ap").forEach(c => { const pips = c.querySelector(".ps2-pips"), st = c.querySelector(".ps2-strk"), bane = c.querySelector(".bane"); c.innerHTML = ""; c.append(Object.assign(document.createElement("span"), { className: "fx-k", textContent: "AP" }), pips, Object.assign(document.createElement("span"), { className: "fx-k", textContent: "Strikes" }), st); if (bane) c.append(bane); });
    // 6. the rungs: the number and the name as two columns
    host.querySelectorAll(".ps2-rungs .rung").forEach(r => { const m = /^(\d+)\s*·\s*(.*)$/.exec(r.textContent.trim()); if (m) r.innerHTML = `<b>${esc(m[1])}</b><span>${esc(m[2])}</span>`; });
    host.querySelectorAll(".ps2-esc > .ps2-q").forEach(x => { x.textContent = x.textContent.replace(/^Hooks still available: /, "Hooks left: "); });
  }
  return icons(art(host.innerHTML));
}
const ave = () => makeActor(data.aveline, { system: { escalation: 6, damage: { bodyLethal: 4, mindNonlethal: 2 } }, items: { Longsword: { wielded: true, hand: "main", grip: "two" } } });
const aveSt = { inCombat: true, round: 3, ap: 4, strikes: 1, rungs: { 2: ["Roving Judgment"], 4: ["Weight of Judgment"] }, hooks: "Critical · Kindled Wrath", dl: DL, cd: CD };
const syl = () => makeActor(data.sylwen, { system: { escalation: 0 } });
const sylSt = { inCombat: false, dl: DL, cd: CD };
const pair = async (title, note, items, mk, st, opts, h, extra = "") => {
  const a1 = mk(), a2 = mk();
  return `<section class="fx-sec"><h2>${title}</h2>${note}<div class="fx-pair"><div><h3>As built (v0.0.441)</h3>${win(a1.name, 540, h, await render(a1, model(a1, st), opts))}</div><div><h3><b>Proposed</b></h3><div class="fx-new">${win(a2.name, 540, h, await render(a2, model(a2, st), { ...opts, fix: true }))}</div></div>${extra}</div></section>`;
};
const out = document.getElementById("page");
const ul = xs => `<ul class="fx-list">${xs.map(x => `<li>${x}</li>`).join("")}</ul>`;
out.insertAdjacentHTML("beforeend", await pair("Aveline in combat: the bars, the gauges, the combat line",
  ul(["<b>1. The Frequency at a bar's right end</b> goes where its section's heading already says it (Once per round, At will, Once per encounter...). Under <b>Reactions</b> (and Granted, Escalation), whose heading is not a Frequency, the word stays, muted, with no square: a Reaction's Frequency was E2's ask.",
    "<b>3. The Vigor and Resolve gauges:</b> the whole gauge is the click area (the word, the track and a little room above and below it; the numbers still open the edit); the track is 18 px tall to the pointer and still drawn 6 px. The dashed lines in the picture at the right show the area.",
    "<b>5. AP and Strikes:</b> two aligned rows, each with its word, the Strikes the same size as the AP pips (diamonds in their orange); one line each, no wrapping.",
    "<b>6. Escalation:</b> the title and its six pips on the first line; the rungs one under the other, the number a column of its own (lit ones in ink, the rest faint); the hooks one line (\"Hooks left: Critical · Kindled Wrath\"). The Hands column 168 px (was 176) for the room."]),
  null, ave, aveSt, {}, 840,
  await (async () => { const a = ave(); return `<div><h3>The click area (dashed)</h3><div class="fx-new fx-hit">${win(a.name, 540, 180, await render(a, model(a, aveSt), { fix: true }))}</div></div>`; })()));
out.insertAdjacentHTML("beforeend", await pair("Sylwen out of combat", ul(["<b>2.</b> The combat line says only \"Out of combat\", centered and faded (it said \"Out of combat: AP, Guard and Escalation appear when Initiative is rolled\" on two lines); the Hands stay at its right."]), null, syl, sylSt, {}, 330));
out.insertAdjacentHTML("beforeend", await pair("Aveline's Build tab", ul(["<b>4.</b> A card's cost in ink, an outlined stamp (not filled: it isn't a button there), and its Frequency as a muted word: no colored pill."]), null, ave, aveSt, { tab: "build" }, 640));
await document.fonts.ready;
document.body.dataset.ready = "1";
