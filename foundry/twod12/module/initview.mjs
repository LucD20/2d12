// v0.0.310 (Lucas's design, the "FAB · GM window" mockup): the Initiative windows' HTML, from initmodel.mjs. Pure (the tests load it).
// The look is in system.css (block v0.0.310, classes iw-*). Every control is a button with data-act (initwindow.mjs reads the clicks).
import { ATTRS, ATTR_NAMES, ATTR_COLORS } from "./initmodel.mjs";
import { esc } from "./util.mjs";

const portrait = (img, small = false) => `<img class="iw-pic${small ? " sm" : ""}" src="${esc(img || "icons/svg/mystery-man.svg")}" alt="">`;
const pressed = on => `aria-pressed="${on ? "true" : "false"}"`;

/** Roll columns shared by solo rows, stacks, and Squad Cards. */
function controlsHtml(r, d) {
  if (r.rolled) {
    const note = r.isSquad ? '<div class="iw-sqnote">Shared roll · each member keeps its own turn</div>' : "";
    return `<div><div class="iw-rr"><button type="button" class="iw-btn2" data-act="reroll" ${d}>Reroll</button><span class="iw-by">${esc(r.rolledBy)}</span></div></div>
      <div><div class="iw-rr"><span class="iw-res">${esc(r.result)}</span><span class="iw-by">${esc(r.rolledWith)}</span></div></div>
      ${note ? `<div class="iw-sqspan">${note}</div>` : "<div></div><div></div><div></div>"}`;
  }
  if (r.last) {
    return `<div class="iw-note">Doesn't roll: placed after everyone</div><div></div><div></div><div></div><div></div>`;
  }
  const who = `<div class="iw-seg"><button type="button" data-act="who" data-v="gm" ${d} ${pressed(r.who === "gm")}>GM</button><button type="button" data-act="who" data-v="wait" ${d} ${pressed(r.who === "wait")}>${esc(r.waitLabel)}</button></div>${r.liveNote ? `<div class="iw-live">${esc(r.liveNote)}</div>` : ""}`;
  const sel = `<select class="iw-sel iw-check${r.overridden ? " over" : ""}" data-act="attr" ${d} style="--ac:${r.attr ? ATTR_COLORS[r.attr] : "#2a2320"}" aria-label="Check for ${esc(r.name)}">${r.attrMixed ? '<option value="" selected disabled>· mixed</option>' : ""}${ATTRS.map(a => `<option value="${a}"${a === r.attr ? " selected" : ""}>${ATTR_NAMES[a]} ${esc(r.mods[a])}</option>`).join("")}</select>`;
  const tog = (act, label, on, fx, by) => `<button type="button" class="iw-tg ${act}${on ? " on" : ""}" data-act="${act}" ${d} ${pressed(on)}${fx ? ` disabled data-tooltip="From an effect: ${esc(by)}"` : ""}>${label}</button>`;   // v0.0.421 (the audit): the reason it is off (C)
  const roll = `<div class="iw-seg tg">${tog("fav", "Favored", r.fav, r.favFx, r.favBy)}${tog("doom", "Doomed", r.doom, r.doomFx, r.doomBy)}</div>${r.both ? '<div class="iw-live dim">both: a normal roll</div>' : ""}`;
  const step = (k, n, on, man, word) => `<div class="iw-step ${k}${on ? " on" : ""}"><button type="button" data-act="${k}-" ${d} aria-label="One ${word} less"${man ? "" : " disabled"}>&minus;</button><span>${esc(n)}</span><button type="button" data-act="${k}+" ${d} aria-label="One ${word} more">+</button></div>`;
  return `<div>${who}</div><div>${sel}</div><div>${roll}</div><div>${step("boons", r.boons, r.boonsOn, r.manB, "Boon")}</div><div>${step("banes", r.banes, r.banesOn, r.manN, "Bane")}</div>`;
}

/** v0.0.489: Visual Squad Card grouping squadmates under one shared Initiative roll row. */
function squadCardHtml(r) {
  const k = esc(r.id), ids = esc(r.ids.join(",")), sk = esc(r.sqKey);
  const d = `data-row="${k}" data-ids="${ids}"`;
  const chips = r.chips.map(t => `<span class="iw-fx">${esc(t)}</span>`).join("") + (r.last ? '<span class="iw-lastb">Goes last</span>' : "");
  const warns = (r.sqWarns ?? []).map(w => `<span class="iw-sqwarn">${esc(w)}</span>`).join("");
  const pics = `<div class="iw-sqpics">${(r.sqMembers ?? []).slice(0, 3).map(m => portrait(m.img, true)).join("")}</div>`;
  const pills = (r.sqMembers ?? []).map(m => `<span class="iw-mpill" ${r.rolled ? "" : `draggable="true" data-drag-id="${esc(m.id)}"`}><span>${esc(m.shortName)}</span>${r.rolled ? "" : `<button type="button" class="iw-mx" data-act="sqRemove" data-id="${esc(m.id)}" aria-label="Remove ${esc(m.name)} from squad">&times;</button>`}</span>`).join("");
  const addPop = !r.rolled && (r.sqAddable ?? []).length ? `<div class="iw-popwrap"><button type="button" class="iw-sqbtn acc" data-act="sqPop" data-v="add:${sk}" aria-expanded="${r.sqPopOpen}"><i class="fa-solid fa-plus" aria-hidden="true"></i><span>Add</span></button>${r.sqPopOpen ? `<div class="iw-pop"><div class="iw-pop-ttl">Add to Squad ${r.sqIndex}</div>${r.sqAddable.map(c => `<button type="button" class="iw-pop-it" data-act="sqJoin" data-id="${esc(c.id)}" data-sq="${sk}"><span>${esc(c.name)}</span>${c.roleLabel ? `<small>${esc(c.roleLabel)}</small>` : ""}</button>`).join("")}</div>` : ""}</div>` : "";
  const detBtn = `<button type="button" class="iw-sqbtn sub" data-act="sqExpand" data-sq="${sk}" aria-expanded="${r.sqExpanded}">${r.sqExpanded ? "▴ Hide" : "▾ Details"}</button>`;
  const ungrpBtn = !r.rolled ? `<button type="button" class="iw-sqbtn sub" data-act="sqDissolve" data-sq="${sk}">Ungroup</button>` : "";
  const side = r.moving ? `<div class="iw-side"><span class="iw-sidel">Side</span><select class="iw-sel iw-sidesel" data-act="side" ${d} aria-label="Side of ${esc(r.name)}">${[["friendly", "Heroes"], ["hostile", "Enemies"], ["neutral", "Third side"], ["fourth", "Fourth side"]].map(([v, l]) => `<option value="${v}"${v === r.side ? " selected" : ""}>${l}</option>`).join("")}</select></div>` : "";
  const name = `<div class="iw-cr iw-sqcr">${pics}<div class="iw-crt"><div class="iw-sqhd"><span class="iw-nm">${esc(r.name)}</span><span class="iw-sqbadge">×${r.sqMembers.length} · 1 roll</span>${warns}</div>
    ${r.moving ? side : `<div class="iw-sub">${pills}${addPop}${detBtn}${ungrpBtn}${chips}</div>`}</div>
    <div class="iw-ico"><button type="button" class="iw-ib" data-act="move" ${d} aria-label="Move ${esc(r.name)} to another side">&#8644;</button>
    <button type="button" class="iw-ib${r.last ? " on" : ""}" data-act="last" ${d} ${pressed(r.last)} aria-label="${esc(r.name)} goes last">&#10515;</button></div></div>`;
  const membersHtml = r.sqExpanded ? `<div class="iw-sqmem">${(r.sqMembers ?? []).map(m => `<div class="iw-sqmr" ${r.rolled ? "" : `draggable="true" data-drag-id="${esc(m.id)}"`}>
    <div class="iw-sqml">${r.rolled ? "" : '<span class="iw-grip" aria-hidden="true">&#8942;&#8942;</span>'}${portrait(m.img, true)}<span class="iw-sqmn">${esc(m.name)}</span>
    <span class="iw-sqtag${m.leader ? " lead" : ""}">${m.leader ? "Roll Leader" : "Shares roll"}</span>${m.roleLabel ? `<span class="iw-role">${esc(m.roleLabel)}</span>` : ""}${(m.chips ?? []).map(t => `<span class="iw-fx">${esc(t)}</span>`).join("")}</div>
    ${r.rolled ? "" : `<button type="button" class="iw-sqbtn sub" data-act="sqRemove" data-id="${esc(m.id)}">Make Solo</button>`}</div>`).join("")}</div>` : "";
  const rowCls = r.rolled || r.last ? "quiet" : r.tint;
  return `<div class="iw-sqbox${r.sqPopOpen ? " has-pop" : ""}" ${r.rolled ? "" : `data-drop-squad="${sk}"`}><div class="iw-row ${rowCls} iw-sqrow">${name}${controlsHtml(r, d)}</div>${membersHtml}</div>`;
}

/** One row of the GM window. */
function rowHtml(r) {
  if (r.isSquad) return squadCardHtml(r);
  const k = esc(r.id), ids = esc(r.ids.join(","));
  const d = `data-row="${k}" data-ids="${ids}"`;
  const chips = r.chips.map(t => `<span class="iw-fx">${esc(t)}</span>`).join("") + (r.last ? '<span class="iw-lastb">Goes last</span>' : "");
  const stackBtn = r.stack ? `<button type="button" class="iw-stackbtn" data-act="stack" data-key="${esc(r.stack)}" aria-expanded="${r.expanded}">${esc(r.stackLabel)}</button>` : "";
  const squadBtn = r.squad ? `<button type="button" class="iw-stackbtn iw-sqb" data-act="squad" data-v="${r.squad.next}" ${d}>Squad ${r.squad.n} of ${r.squad.of}</button>` : "";
  const roleTag = r.roleLabel ? `<span class="iw-role">${esc(r.roleLabel)}</span>` : "";
  const canPop = r.canSquad && ((r.sqJoinTargets?.length ?? 0) > 0 || (r.sqPairTargets?.length ?? 0) > 0);
  const soloPop = canPop ? `<div class="iw-popwrap"><button type="button" class="iw-sqbtn acc" data-act="sqPop" data-v="solo:${k}" aria-expanded="${r.sqPopOpen}"><i class="fa-solid fa-plus" aria-hidden="true"></i><span>Squad</span></button>${r.sqPopOpen ? `<div class="iw-pop">
    ${(r.sqJoinTargets ?? []).length ? `<div class="iw-pop-ttl">Join Squad</div>${r.sqJoinTargets.map(sq => `<button type="button" class="iw-pop-it" data-act="sqJoin" data-id="${k}" data-sq="${esc(sq.sk)}"><span>${esc(sq.label)}</span><small>${sq.n} in squad</small></button>`).join("")}` : ""}
    ${(r.sqPairTargets ?? []).length ? `<div class="iw-pop-ttl">Start New Squad With…</div>${r.sqPairTargets.map(o => `<button type="button" class="iw-pop-it" data-act="sqNew" data-a="${k}" data-b="${esc(o.id)}"><span>+ ${esc(o.name)}</span><small>new</small></button>`).join("")}` : ""}
  </div>` : ""}</div>` : "";
  const chk = r.canSquad ? `<button type="button" class="iw-sqchk${r.checked ? " on" : ""}" role="checkbox" aria-checked="${r.checked ? "true" : "false"}" data-act="sqSel" data-id="${k}" aria-label="Select ${esc(r.name)} for squad">${r.checked ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : ""}</button>` : "";
  const ownHtml = r.roleLabel ? "" : `<span class="iw-own">${esc(r.owner)}</span>`;
  const side = r.moving ? `<div class="iw-side"><span class="iw-sidel">Side</span><select class="iw-sel iw-sidesel" data-act="side" ${d} aria-label="Side of ${esc(r.name)}">${[["friendly", "Heroes"], ["hostile", "Enemies"], ["neutral", "Third side"], ["fourth", "Fourth side"]].map(([v, l]) => `<option value="${v}"${v === r.side ? " selected" : ""}>${l}</option>`).join("")}</select></div>` : "";   // v0.0.313: no <label> (Foundry's label style broke the line)
  // v0.0.312 (Lucas): one row height always: while moving, the Side dropdown takes the second line's place (it no longer adds a line)
  const name = `<div class="iw-cr${r.member ? " member" : ""}">${chk}${portrait(r.img, r.member)}<div class="iw-crt"><div class="iw-nm">${esc(r.name)}</div>
    ${r.moving ? side : `<div class="iw-sub">${stackBtn}${squadBtn}${roleTag}${soloPop}${ownHtml}${chips}</div>`}</div>
    <div class="iw-ico"><button type="button" class="iw-ib" data-act="move" ${d} aria-label="Move ${esc(r.name)} to another side">&#8644;</button>
    <button type="button" class="iw-ib${r.last ? " on" : ""}" data-act="last" ${d} ${pressed(r.last)} aria-label="${esc(r.name)} goes last">&#10515;</button></div></div>`;
  const drag = r.canSquad ? ` draggable="true" data-drag-id="${k}" data-drop-solo="${k}"` : "";
  const rowCls = r.rolled || r.last ? "quiet" : r.tint;
  return `<div class="iw-row ${rowCls}${r.member ? " member" : ""}${r.sqPopOpen ? " has-pop" : ""}"${drag}>${name}${controlsHtml(r, d)}</div>`;
}

/** The GM window. */
export function gmHtml(m) {
  const head = `<header class="iw-head"><div class="iw-ttl"><h1>Initiative</h1><span>${esc(m.sub)}</span></div>
    <div class="iw-hr"><span class="iw-hl">Check</span><div class="iw-attrs">${m.attrBtns.map(b => `<button type="button" data-act="call" data-v="${b.key}" ${pressed(b.on)} style="--ac:${b.color}" class="${b.on ? "on" : ""} a-${b.key}">${b.label}</button>`).join("")}</div>
    <button type="button" class="iw-gmall" data-act="gmAll">GM rolls all</button></div></header>`;
  const players = `<div class="iw-players">${esc(m.playersLine)}</div>`;
  const cols = '<div class="iw-cols"><span>Creature</span><span>Who rolls</span><span>Check</span><span>Roll</span><span>Boons</span><span>Banes</span></div>';
  const sides = m.sides.map(s => {
    const selN = s.selectedIds?.length ?? 0;
    const tools = s.hasSquadTools
      ? (selN > 0
        ? `<div class="iw-sqtools"><span class="iw-selnote">${selN} selected</span><button type="button" class="iw-sqbtn acc" data-act="sqGroupSel" data-key="${esc(s.key)}"${selN < 2 ? " disabled" : ""}><i class="fa-solid fa-users" aria-hidden="true"></i><span>Group Selected (${selN})</span></button><button type="button" class="iw-sqbtn sub" data-act="sqClearSel" data-key="${esc(s.key)}">Clear</button></div>`
        : `<div class="iw-sqtools">${s.hasMinions ? `<button type="button" class="iw-sqbtn acc" data-act="sqAuto" data-key="${esc(s.key)}"><i class="fa-solid fa-users" aria-hidden="true"></i><span>Auto-Squad Minions</span></button>` : ""}<button type="button" class="iw-sqbtn" data-act="sqUngroup" data-key="${esc(s.key)}"${s.squadCount ? "" : " disabled"}>Ungroup All</button></div>`)
      : "";
    const hdr = s.hasSquadTools
      ? `<div class="iw-sh iw-shbar iw-s-${esc(s.key)}"><button type="button" class="iw-shfold" data-act="fold" data-key="${esc(s.key)}" aria-expanded="${s.open}"><b>${s.caret} ${esc(s.name)}</b><span>${esc(s.tag)}</span><span class="iw-cnt">${esc(s.count)}</span></button>${tools}</div>`
      : `<button type="button" class="iw-sh iw-s-${esc(s.key)}" data-act="fold" data-key="${esc(s.key)}" aria-expanded="${s.open}"><b>${s.caret} ${esc(s.name)}</b><span>${esc(s.tag)}</span><span class="iw-cnt">${esc(s.count)}</span></button>`;
    const body = s.open ? `<div class="iw-sbody"${s.key !== "friendly" ? ` data-drop-zone="${esc(s.key)}"` : ""}>${s.rows.map(rowHtml).join("")}</div>` : "";
    return `<section class="iw-sec">${hdr}${body}</section>`;
  }).join("");
  const foot = `<footer class="iw-foot"><div class="iw-sum"><div><b>GM rolls now:</b> ${esc(m.sumRoll)}</div><div><b>Their player rolls:</b> ${esc(m.sumPlayer)} · <b>Wait:</b> ${esc(m.sumWait)}</div><div><b>Kept:</b> ${esc(m.sumKept)} · <b>Goes last:</b> ${esc(m.sumLast)}</div></div>
    <div class="iw-fr"><div class="iw-fb"><button type="button" class="iw-btn2 big" data-act="cancel">Cancel</button><button type="button" class="iw-go" data-act="roll"${m.rollN ? "" : " disabled"}>${esc(m.rollLabel)}</button></div><span class="iw-hint">Enter rolls · Esc cancels</span></div></footer>`;
  return `<div class="iw">${head}${players}<div class="iw-body">${cols}${sides || '<p class="iw-empty">No creature in this encounter.</p>'}</div>${foot}</div>`;
}

/** The players' window. */
export function playerHtml(m) {
  const head = `<header class="iw-head"><div class="iw-ttl"><h1>Initiative</h1><span>${esc(m.sub)}</span></div></header>`;
  const card = y => `<div class="iw-you"><div class="iw-yh">${portrait(y.img)}<b>${esc(y.name)}</b>${y.rolled ? `<span class="iw-res">${esc(y.result)}</span>` : ""}</div>
    <div class="iw-yc"><span class="iw-chk" style="--ac:${ATTR_COLORS[y.attr]}">${esc(y.check)}</span>${y.gmChips.map(t => `<span class="iw-gmc">${esc(t)}</span>`).join("")}${y.fxChips.map(t => `<span class="iw-fx">${esc(t)}</span>`).join("")}</div>
    <div class="iw-yr">${y.rolled ? '<span class="iw-note">Rolled.</span>' : y.last ? '<span class="iw-note">Goes last: no roll.</span>' : y.gmRolls ? '<span class="iw-note">The GM rolls for you.</span>' : `<button type="button" class="iw-go" data-act="proll" data-id="${esc(y.id)}">Roll</button>`}</div>
    ${!y.rolled && !y.gmRolls && !y.last ? `<p class="iw-yn">${esc(y.note)}</p>` : ""}</div>`;
  const line = x => `<div class="iw-pl">${portrait(x.img, true)}<span class="iw-nm">${esc(x.name)}</span><span class="iw-st">${esc(x.status)}</span></div>`;
  const heroes = m.heroes.length ? `<section class="iw-sec"><div class="iw-sh iw-s-friendly static"><b>Heroes</b></div>${m.heroes.map(line).join("")}</section>` : "";
  const others = m.others.map(s => `<section class="iw-sec"><div class="iw-sh iw-s-${esc(s.key ?? "hostile")} static"><b>${esc(s.name)}</b></div>${s.hold ? '<p class="iw-note pad">Shown when combat starts.</p>' : s.items.length ? s.items.map(line).join("") : '<p class="iw-note pad">None in sight.</p>'}</section>`).join("");
  return `<div class="iw pl">${head}<div class="iw-body">${m.yours.map(card).join("") || '<p class="iw-empty">You have no creature in this encounter.</p>'}${heroes}${others}</div>
    <footer class="iw-foot"><span class="iw-hint">The order appears in the Combat Tracker.</span><button type="button" class="iw-btn2 big" data-act="cancel">Close</button></footer></div>`;
}
