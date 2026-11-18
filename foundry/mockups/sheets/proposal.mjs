// The sheet mockups: the proposals, in STYLE-3's look (style-book.md, built v0.0.387): Source Serif 4 for the one big title and Source Sans 3
// for everything read, color only for a meaning (the Frequency a small square beside its word, the tiles and game words in ink), no Tier color
// on a card, the bronze accent, the stamp, the pools', ranks' and subtypes' colors kept.
//   the PC sheet and the full NPC sheet, SMALL: a name plate, the stats as ruled lines, each Action as one bar (a click opens the SHORT CARD).
// The short card is the system's own Action card (actioncard.mjs buildActionCard, the approved card of style-book step 5) with lines left out.
import { esc } from "./model.mjs";
const AC = await import("../../twod12/module/actioncard.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const { TWOD12 } = await import("../../twod12/module/config.mjs");

const pct = (v, mx) => Math.max(0, Math.min(100, Math.round((100 * (Number(v) || 0)) / (Number(mx) || 1))));
const FQ = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };

/** The short card: the system's Action card with lines left out. Option 1 (the proposal): the Flavor, the rank's word, the Distance and the
 *  Attack / Save line (the bar says both) and Your roll. Option 2: only the Flavor and Your roll. */
export async function shortCard(item, actor, option = 1) {
  const doc = new DOMParser().parseFromString(await AC.buildActionCard(item, { actor, use: false }), "text/html").body;   // an inert document
  const card = doc.firstElementChild;
  for (const el of card.querySelectorAll(".st-flavor, .st-live, .st-ruler")) el.remove();
  if (option === 1) {
    for (const el of card.querySelectorAll(".st-auto")) el.remove();
    for (const el of card.querySelectorAll(".st-grid > span")) if (/^Distance:/.test(el.textContent.trim())) el.remove();
    for (const el of card.querySelectorAll(".st-grid")) if (!el.children.length) el.remove();
    for (const el of card.querySelectorAll(".st-l")) if (/^(Attack|Save)$/.test(el.querySelector("b")?.textContent.trim() ?? "")) el.remove();
  }
  card.classList.add("mk-short");
  return card.outerHTML;
}

/** One Action of a small sheet: its bar (the cost stamps are the Use buttons; the name; Distance · Vs.; the Frequency as a small square and
 *  its word) and, open, the short card under it. row: the sheet's row (model.mjs). */
export async function actionBar(row, { open = false, option = 1, actor = null } = {}) {
  const it = row.item.system, costs = [...new Set((it.versions ?? []).map(v => (it.reaction ? `${v.ap}R` : `${v.ap} AP`)))];   // Versions of one cost (an Art's Modes) show one stamp
  const stamps = costs.map(c => `<button type="button" class="sb-vb${row.off ? " no" : ""}"${row.off ? " disabled" : ""}>${esc(c)}</button>`).join("");
  const dv = [row.dist && row.dist !== "—" ? esc(row.dist) : "", row.vs ? `<b>${esc(row.vs)}</b>` : ""].filter(Boolean).join(" · ");
  const fq = `<span class="mk-fq"><i style="background:var(--s-fq-${esc(row.frequency || "atwill")})"></i>${row.escalation ? `Escalation ${row.escalation}, ` : ""}${FQ[row.frequency] ?? "At-will"}</span>`;
  return `<div class="mk-oa${open ? " open" : ""}${row.off ? " dim" : ""}"><div class="mk-bar">${stamps}<a class="n">${esc(row.name)}</a>${row.auto ?? ""}${row.sub ? `<span class="tr">${esc(row.sub)}</span>` : ""}<span class="mk-dv">${dv}</span>${fq}</div>${open ? await shortCard(row.item, actor, option) : ""}</div>`;
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
    <div class="sbl mk-split"><span><span class="k">Health</span> <b class="big">${pc.health.pool}</b> <span class="mk-q">·</span> <b class="big">${pc.health.toDown}</b> to Down <a class="mk-guard"><span class="k">Guard</span> <b>${pc.strip.guard.total}</b></a></span>${npc ? "" : `<span class="mk-q">Dominant Damage: <b style="color:${pc.health.dominant === "Resolve" ? "var(--s-res)" : pc.health.dominant === "Vigor" ? "var(--s-vig)" : "inherit"}">${pc.health.dominant}</b></span>`}</div>
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
    list += `<div class="sb-band"><i class="mk-sq" style="background:${esc(sec.dot ?? "#888")}"></i>${esc(sec.title)}${sec.sub ? `<span class="r">${esc(sec.sub)}</span>` : ""}</div>`;
    for (const r of sec.rows) list += await actionBar(r, { open: r.open, option, actor: a });
  }
  return `<div class="twod12-sb mk-sheet rk-${npc ? esc(a.system.role) : "pc"}${npc ? "" : " mk-pc"}">${plate(a, pc)}${statLines(a, pc)}<div class="mk-pad">${attrTiles(pc)}</div>${combatLine(a, pc)}${tabsNav(pc)}<div class="mk-scroll"><div class="sb-body">${list}${basicGrid(pc)}</div></div></div>`;
}

/** The short card's two options and today's card, for one Action (under the pair). */
export async function shortCompare(a, pc, name, fullCard, frame = h => h) {
  const row = pc.sections.flatMap(s => s.rows).find(r => r.name === name);
  const col = (t, note, h) => `<div class="mk-opt"><h4>${t}</h4><p>${note}</p>${h}</div>`;
  const wrap = h => frame(`<div class="twod12-sb mk-sheet mk-loose"><div class="sb-body">${h}</div></div>`);
  return `<div class="mk-opts">${col("Short card, option 1 (drawn in the sheet)", "The bar: the cost (the Use button), the name, Distance · Vs., the Frequency. Under it the card without what the bar says: no Flavor, no rank word, no Distance, no Attack line, no Your roll.", wrap(await actionBar(row, { open: true, option: 1, actor: a })))}${col("Short card, option 2", "The same bar; the card loses only the Flavor and Your roll (the Distance and the Attack line are written again, the rank's word stays).", wrap(await actionBar(row, { open: true, option: 2, actor: a })))}${col("Today's card on the sheet (the full card)", "No head bar: a Reaction's Frequency is only in its row's pill.", fullCard)}</div>`;
}
