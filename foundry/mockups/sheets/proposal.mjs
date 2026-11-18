// The sheet mockups: the proposals. One family for the three sheets, the settled "printed stat block" (the one-page NPC sheet's look, its own
// CSS: .twod12-sb in system.css): a name plate, the stats as ruled lines, an Action under a header bar in its Frequency's color.
//   the PC sheet and the full NPC sheet, SMALL: the Actions as their header bars only (a click opens the SHORT CARD under the bar), tabs kept;
//   the one-page NPC sheet, LONG: no tabs, every Action written out (statblock.mjs as it is), then Effects, Notes and Build down the page.
// An Action's bar and body are the system's own stat-block face (statblock.mjs sbActionModel + sbActionHtml); what is new is the layout (sheets.css, .mk-*).
import { esc, enrichCard } from "./model.mjs";
const SB = await import("../../twod12/module/statblock.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const { TWOD12 } = await import("../../twod12/module/config.mjs");

const pct = (v, mx) => Math.max(0, Math.min(100, Math.round((100 * (Number(v) || 0)) / (Number(mx) || 1))));
const FQ = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };

/** The short card's model from the stat-block face's. Option 1 (the proposal): what the row's bar already says is not written again (the Attack /
 *  Save line and the Distance: the bar's "Distance · Vs."). Option 2: the stat-block face as the one-page sheet writes it. */
export function shortModel(m, option = 1) {
  if (option === 2) return m;
  return { ...m, meta: (m.meta ?? []).filter(([l]) => !/^(Attack|Save|Distance)$/.test(l) && !/: (Attack|Save)$/.test(l)) };
}

/** One Action of a small sheet: the stat-block face's header bar (the Version stamps are the Use buttons), with the row's Distance and Vs.; open:
 *  its body under it (the short card). row: the sheet's row (model.mjs). */
export async function actionBar(row, { open = false, option = 1, escNow = 0, tools = false } = {}) {
  const m = await SB.sbActionModel(row.item, { enrich: enrichCard, row, escNow });
  const host = new DOMParser().parseFromString(SB.sbActionHtml(shortModel(m, option)), "text/html").body;   // an inert document: nothing loads
  const oa = host.firstElementChild, h = oa.querySelector(".sb-oa-h");
  oa.classList.add("mk-oa"); if (open) oa.classList.add("open");
  if (!tools) h.querySelector(".sb-tools")?.remove();
  h.querySelector(".n").insertAdjacentHTML("afterend", row.auto ?? "");
  const seen = new Set();   // Versions of one cost (an Art's Modes: Spotter) show one stamp; the Mode is chosen as today, after the click
  for (const b of h.querySelectorAll(".sb-vb")) { if (seen.has(b.textContent)) b.remove(); else seen.add(b.textContent); }
  const tr = h.querySelector(".tr");
  if (!open) { if (tr) tr.remove(); if (row.sub) h.querySelector(".fq").insertAdjacentHTML("beforebegin", `<span class="tr">${esc(row.sub)}</span>`); }
  const dv = [row.dist && row.dist !== "—" ? row.dist : "", row.vs ? `<b class="mk-vs">${esc(row.vs)}</b>` : ""].filter(Boolean).join(" · ");
  h.querySelector(".fq").insertAdjacentHTML("beforebegin", `<span class="mk-dv">${dv}</span>`);
  if (!open) for (const el of [...oa.children]) if (el !== h) el.remove();
  return oa.outerHTML;
}

/** The stat lines of a small sheet (the one-page's .sb-stats, with the full sheets' own reading: the damage taken, Lethal and Nonlethal). */
export function statLines(a, pc) {
  const s = a.system, npc = a.type === "npc";
  const gauge = b => `<span class="sb-gauge ${b.pool === "body" ? "v" : "r"}"><span class="k">${b.name}</span> <a class="mk-num"><b>${b.value}</b> / ${b.max}</a>${b.tag ? ` <span class="sb-state mk-tag">${esc(b.tag.charAt(0) + b.tag.slice(1).toLowerCase())}</span>` : ""}<span class="sb-track mk-track"><i class="l" style="width:${b.seg.lethal}%"></i><i class="n" style="width:${b.seg.nonlethal}%"></i></span></span>`;
  const mv = Object.fromEntries(pc.move.map(x => [x.label, x.value]));
  const stats = [["AD", pc.defs.main[0].value], ["WD", pc.defs.main[1].value], ["Speed", mv.Speed], ["Reach", mv.Reach], ["Steady", mv.Steady], ["Size", `${{ Medium: "Med.", Gargantuan: "Garg." }[pc.head.size] ?? pc.head.size} (${mv.Size})`]];
  const rwRows = SM.damageLineRows(pc.rwLines ?? []);
  const rw = ["Immune", "Resist", "Weak"].map(k => { const r = rwRows.find(x => x.label === k); return `<span class="s2"><span class="k">${k}</span> ${(r?.lines ?? []).map(l => `<span class="rw-chip sb-rw" style="--sc-l:${TWOD12.subtypeInk?.[l.code] ?? "#5d5446"};--sc-d:${TWOD12.subtypeColors?.[l.code] ?? "#b3a68e"}"><i class="${TWOD12.subtypeIcons?.[l.code] ?? ""}" aria-hidden="true"></i>${esc(SM.damageLineChip(l))}</span>`).join(" ") || "—"}</span>`; }).join("");
  const rally = npc ? "" : `<div class="sbl mk-split"><span><span class="k">Rally</span> <span class="mk-rpips">${pc.rally.pips.map(on => `<i class="${on ? "on" : ""}"></i>`).join("")}</span> <b>${pc.rally.left}</b> / ${pc.rally.max} <span class="mk-q">· each heals ${pc.rally.heal}</span></span><span><span class="k">Wounds</span> Body <span class="mk-in">${pc.wounds[0].count}</span> Mind <span class="mk-in">${pc.wounds[1].count}</span></span></div>`;
  return `<div class="sb-stats">
    <div class="sbl mk-split"><span><span class="k">Health</span> <b class="big">${pc.health.pool}</b> <span class="mk-q">·</span> <b class="big mk-gold">${pc.health.toDown}</b> to Down <a class="mk-guard"><span class="k">Guard</span> <b>${pc.strip.guard.total}</b></a></span>${npc ? "" : `<span class="mk-q">Dominant Damage: <b style="color:${pc.health.dominant === "Resolve" ? "var(--s-res)" : pc.health.dominant === "Vigor" ? "var(--s-vig)" : "inherit"}">${pc.health.dominant}</b></span>`}</div>
    <div class="sbl two">${pc.health.bars.map(gauge).join("")}</div>
    <div class="sbl grid">${stats.map(([k, v]) => `<span><span class="k">${k}</span> <b class="big">${esc(v)}</b></span>`).join("")}</div>
    <div class="sbl grid">${rw}</div>
    ${rally}
  </div>`;
}

/** The Attributes and the Modifiers: the stat block's tiles (a click rolls the Attribute). */
export function attrTiles(pc) {
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  const key = l => (l === "Power" ? "power" : l === "Signature" ? "signature" : "weapon");
  return `<div class="sb-attrs mk-attrs m${pc.mods.length}">${pc.attrs.map(x => `<a class="sb-attr at-${x.key}"><span>${x.label}</span><b>${x.value}</b><small>Vs. ${vs[x.key]}</small></a>`).join("")}${pc.mods.map((x, i) => `<div class="sb-attr mod-${key(x.label)}${i === 0 ? " gap" : ""}"><span>${x.label}${pc.mods.length > 2 ? "" : " Mod."}</span><b>${x.value}</b><small>${x.dc}</small></div>`).join("")}</div>`;
}

/** The combat line: Escalation, the Hands (E3: no word "Hands", one hand above the other, the tiles' size kept) and the Action Points. */
export function combatLine(a, pc) {
  const npc = a.type === "npc", st = pc.strip;
  const hands = npc ? "" : `<div class="mk-hands" aria-label="Hands">${pc.hands.tiles.map(t => `<button type="button" class="mk-hand${t.free ? " free" : ""}${t.warn ? " warn" : ""}"><span>${esc(t.name)}</span><b>${t.grip}</b></button>`).join("")}</div>`;
  if (!st.inCombat) return `<div class="mk-combat out"><div class="mk-cell"><span class="mk-q">Out of combat: AP, Guard and Escalation appear when ${npc ? "it joins a combat" : "Initiative is rolled"}</span></div>${hands}</div>`;
  const apC = `<div class="mk-cell mk-ap"><span><span class="k">AP</span> <span class="mk-pips">${st.ap.pips.map(p => `<i class="${p.k}"></i>`).join("")}<i class="sep"></i><i class="rap${st.ap.rap ? " on" : ""}"></i></span></span><span class="mk-strk" aria-label="Strikes left this turn">${st.strikePips.map(on => `<i class="${on ? "on" : ""}"></i>`).join("")}</span></div>`;
  const pips = (n, max) => `<span class="sb-pips">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`;
  let escC = "";
  if (!npc) escC = `<div class="mk-cell mk-esc"><span class="mk-l"><span class="k">Escalation ${st.esc.n}</span> ${pips(st.esc.n, 6)}</span><span class="mk-rungs">${st.esc.rungs.map(r => `<a class="${r.lit ? "lit" : ""}">${esc(r.label)}</a>`).join("")}</span><span class="mk-q">${st.esc.hooks ? `Hooks still available: ${esc(st.esc.hooks)}` : "No hooks left this encounter"}</span></div>`;
  else if (st.elite) escC = `<div class="mk-cell mk-esc"><span class="mk-l"><span class="k">Elite Escalation ${st.esc.n}</span> ${pips(st.esc.n, 6)}</span><span class="mk-rungs">${st.eliteRungs.map(r => `<a class="${r.lit ? "lit" : ""}">${esc(r.label)}</a>`).join("")}</span><span class="mk-q">${esc(st.phases)}</span></div>`;
  else escC = "";
  return `<div class="mk-combat${npc && !st.elite ? " one" : ""}${npc ? " npc" : ""}">${escC}${hands}${apC}</div>`;
}

/** The name plate of a small sheet: the one-page's plate with the full sheets' portrait and their line under the name. */
export function plate(a, pc) {
  const npc = a.type === "npc", s = a.system;
  const senses = pc.strip.senses.map(x => x.label).join(", ");
  const line = npc ? [`Level ${s.level}`, `Stage ${s.stage}`, pc.head.size, `CV ${pc.head.cv}`, senses] : [`Level ${s.level}`, `Stage ${s.stage}`, [pc.head.species?.name, pc.head.cls?.name].filter(Boolean).join(" "), pc.head.size, senses];
  const tools = `${npc ? `<a aria-label="Post stat block"><i class="fa-solid fa-scroll"></i></a>` : ""}${pc.head.combat.mode === "status" ? "" : `<a aria-label="Roll Initiative"><i class="fa-solid fa-dice-d20"></i></a>`}<a aria-label="Senses"><i class="fa-solid fa-eye"></i></a>`;
  return `<div class="sb-plate mk-plate"><img class="mk-port" src="${esc(a.img)}" alt=""><div class="mk-id"><div class="nm">${esc(a.name)}</div><div class="mk-l1">${line.filter(Boolean).map(esc).join(" · ")}</div></div><div class="who">${npc ? `<b>${esc(pc.head.role)}</b>` : ""}${pc.head.combat.mode === "status" ? `<span>${esc(String(pc.head.combat.text).replace(/^In combat · /, ""))}</span>` : ""}</div><span class="sb-ptools">${tools}</span></div>`;
}

const tabsNav = (pc, active = "actions") => `<nav class="mk-tabs"><a aria-label="Favorites"><i class="fa-solid fa-star"></i></a>${pc.tabs.map(t => `<a class="${t.k === active ? "on" : ""}">${esc(t.l)}${t.n ? ` <small>${t.n}</small>` : ""}</a>`).join("")}</nav>`;

/** The Basic Actions: the four columns kept, each Action one line (its Frequency's edge, its cost; its reason when it can't be used). */
const basicGrid = pc => `<div class="sb-band">Basic Actions<a class="add">${pc.npc ? "" : "Update Basic Actions"}</a></div><div class="mk-basic">${pc.basic.map(g => `<div><span class="mk-bh">${esc(g.label)}</span>${g.rows.map(r => `<button type="button" class="mk-bx${r.off ? " off" : ""}${r.lines.strike ? " strike" : ""}" style="${r.lines.style}"><span>${esc(r.name)}${r.off ? `<small>${esc(r.offWhy)}</small>` : ""}</span>${r.off ? "" : `<b>${esc(r.cost.replace(" AP", ""))}</b>`}</button>`).join("")}</div>`).join("")}</div>`;

/** A small sheet (the PC's and the full NPC sheet's): plate, stat lines, tiles, the combat line, the tabs, the Actions as bars. */
export async function smallSheet(a, pc, { option = 1 } = {}) {
  const npc = a.type === "npc", escNow = Number(a.system.escalation) || 0;
  let list = "";
  if (npc) list += `<div class="mk-tools"><a><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Action</a><a><i class="fa-solid fa-book-open"></i> Browse compendium</a><a><i class="fa-solid fa-plus"></i> New Action</a></div>`;
  for (const sec of pc.sections) {
    list += `<div class="sb-band">${esc(sec.title)}${sec.sub ? `<span class="r">${esc(sec.sub)}</span>` : ""}</div>`;
    for (const r of sec.rows) list += await actionBar(r, { open: r.open, option, escNow });
  }
  return `<div class="twod12-sb mk-sheet rk-${npc ? esc(a.system.role) : "pc"}${npc ? "" : " mk-pc"}">${plate(a, pc)}${statLines(a, pc)}<div class="mk-pad">${attrTiles(pc)}</div>${combatLine(a, pc)}${tabsNav(pc)}<div class="mk-scroll"><div class="sb-body">${list}${basicGrid(pc)}</div></div></div>`;
}

/** The short card's two options and today's card, for one Action (under the pair). */
export async function shortCompare(a, pc, name, fullCard, frame = h => h) {
  const row = pc.sections.flatMap(s => s.rows).find(r => r.name === name), escNow = Number(a.system.escalation) || 0;
  const col = (t, note, h) => `<div class="mk-opt"><h4>${t}</h4><p>${note}</p>${h}</div>`;
  const wrap = h => frame(`<div class="twod12-sb mk-sheet mk-loose"><div class="sb-body">${h}</div></div>`);
  return `<div class="mk-opts">${col("Short card, option 1 (drawn in the sheet)", "The bar: cost (the Use button), name, traits, Distance · Vs., Frequency. Under it only what the bar doesn't say: Trigger or Requirement, Target, the Tiers, the Critical, the Effect, a Special.", wrap(await actionBar(row, { open: true, option: 1, escNow })))}${col("Short card, option 2", "The Action exactly as the one-page sheet writes it: the Attack line and the Distance are written again under the bar.", wrap(await actionBar(row, { open: true, option: 2, escNow })))}${col("Today's card on the sheet (the full card)", "No head bar; the Flavor, the rank's word, the Attack line and Your roll are what the short card leaves out.", fullCard)}</div>`;
}

/** The long one-page NPC sheet: the stat block as statblock.mjs draws it, then Effects, Notes and Build down the page (no tabs). */
export function longPage(m, pc, { notes = "", gmNotes = "" } = {}) {
  const fx = [...pc.effects.conditions.map(c => ({ ...c, kind: "Condition" })), ...pc.effects.effects.map(c => ({ ...c, kind: "Effect" }))];
  const fxRows = fx.map(e => `<div class="mk-fx"><b>${esc(e.name)}</b><span class="tx">${e.text}</span><span class="du">${esc(e.pill ?? "")}</span><a aria-label="Remove ${esc(e.name)}">&times;</a></div>`).join("") || `<div class="mk-fx none">No conditions or effects on it.</div>`;
  const b = pc.builder ?? {};
  const sum = (b.summary ?? []).map(x => `<span><span class="k">${esc(x.k)}</span> ${esc(x.v)}</span>`).join("");
  const tail = `<div class="twod12-sb mk-tail rk-${esc(m.rankKey)}"><div class="sb-body">
    <div class="sb-band">Effects<span class="r">${fx.length ? `${fx.length} · ` : ""}drop an effect or a condition on the sheet to apply it</span></div>${fxRows}
    <div class="sb-band">Notes<a class="add"><i class="fa-solid fa-pen-to-square"></i> Edit</a></div><div class="mk-notes">${notes}</div>
    <div class="sb-band">GM notes<span class="r"><i class="fa-solid fa-eye-slash"></i> only the GM sees them</span><a class="add"><i class="fa-solid fa-pen-to-square"></i> Edit</a></div><div class="mk-notes">${gmNotes}</div>
    <div class="sb-band mk-fold">Build<span class="r">${esc([m.rank, `Level ${m.level}`, `Stage ${m.stage}`, `CV ${m.cv}`].join(" · "))}</span><a class="add"><i class="fa-solid fa-chevron-right"></i> Open</a></div>
    <div class="mk-bsum">${sum}</div>
  </div></div>`;
  return `<div class="mk-long">${SB.sbPlateHtml(m)}<div class="mk-scroll">${SB.statBlockHtml(m)}${tail}</div></div>`;
}
