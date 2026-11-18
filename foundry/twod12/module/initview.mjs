// v0.0.310 (Lucas's design, the "FAB · GM window" mockup): the Initiative windows' HTML, from initmodel.mjs. Pure (the tests load it).
// The look is in system.css (block v0.0.310, classes iw-*). Every control is a button with data-act (initwindow.mjs reads the clicks).
import { ATTRS, ATTR_NAMES, ATTR_COLORS } from "./initmodel.mjs";
import { esc } from "./util.mjs";

const portrait = (img, small = false) => `<img class="iw-pic${small ? " sm" : ""}" src="${esc(img || "icons/svg/mystery-man.svg")}" alt="">`;
const pressed = on => `aria-pressed="${on ? "true" : "false"}"`;

/** One row of the GM window. */
function rowHtml(r) {
  const k = esc(r.id), ids = esc(r.ids.join(","));
  const d = `data-row="${k}" data-ids="${ids}"`;
  const chips = r.chips.map(t => `<span class="iw-fx">${esc(t)}</span>`).join("") + (r.last ? '<span class="iw-lastb">Goes last</span>' : "");
  const stackBtn = r.stack ? `<button type="button" class="iw-stackbtn" data-act="stack" data-key="${esc(r.stack)}" aria-expanded="${r.expanded}">${esc(r.stackLabel)}</button>` : "";
  // v0.0.440 (Lucas: "The GM decides who goes together when initiative is rolled"): a Minion's squad; a click moves it to the next squad
  const squadBtn = r.squad ? `<button type="button" class="iw-stackbtn iw-sqb" data-act="squad" data-v="${r.squad.next}" ${d}>Squad ${r.squad.n} of ${r.squad.of}</button>` : "";
  const side = r.moving ? `<div class="iw-side"><span class="iw-sidel">Side</span><select class="iw-sel iw-sidesel" data-act="side" ${d} aria-label="Side of ${esc(r.name)}">${[["friendly", "Heroes"], ["hostile", "Enemies"], ["neutral", "Third side"], ["fourth", "Fourth side"]].map(([v, l]) => `<option value="${v}"${v === r.side ? " selected" : ""}>${l}</option>`).join("")}</select></div>` : "";   // v0.0.313: no <label> (Foundry's label style broke the line)
  // v0.0.312 (Lucas): one row height always: while moving, the Side dropdown takes the second line's place (it no longer adds a line)
  const name = `<div class="iw-cr${r.member ? " member" : ""}">${portrait(r.img, r.member)}<div class="iw-crt"><div class="iw-nm">${esc(r.name)}</div>
    ${r.moving ? side : `<div class="iw-sub">${stackBtn}${squadBtn}<span class="iw-own">${esc(r.owner)}</span>${chips}</div>`}</div>
    <div class="iw-ico"><button type="button" class="iw-ib" data-act="move" ${d} aria-label="Move ${esc(r.name)} to another side">&#8644;</button>
    <button type="button" class="iw-ib${r.last ? " on" : ""}" data-act="last" ${d} ${pressed(r.last)} aria-label="${esc(r.name)} goes last">&#10515;</button></div></div>`;
  if (r.rolled) {
    return `<div class="iw-row quiet${r.member ? " member" : ""}">${name}
      <div><div class="iw-rr"><button type="button" class="iw-btn2" data-act="reroll" ${d}>Reroll</button><span class="iw-by">${esc(r.rolledBy)}</span></div></div>
      <div><div class="iw-rr"><span class="iw-res">${esc(r.result)}</span><span class="iw-by">${esc(r.rolledWith)}</span></div></div><div></div><div></div><div></div></div>`;
  }
  if (r.last) {
    return `<div class="iw-row quiet${r.member ? " member" : ""}">${name}<div class="iw-note">Doesn't roll: placed after everyone</div><div></div><div></div><div></div><div></div></div>`;
  }
  const who = `<div class="iw-seg"><button type="button" data-act="who" data-v="gm" ${d} ${pressed(r.who === "gm")}>GM</button><button type="button" data-act="who" data-v="wait" ${d} ${pressed(r.who === "wait")}>${esc(r.waitLabel)}</button></div>${r.liveNote ? `<div class="iw-live">${esc(r.liveNote)}</div>` : ""}`;
  const sel = `<select class="iw-sel iw-check${r.overridden ? " over" : ""}" data-act="attr" ${d} style="--ac:${r.attr ? ATTR_COLORS[r.attr] : "#2a2320"}" aria-label="Check for ${esc(r.name)}">${r.attrMixed ? '<option value="" selected disabled>· mixed</option>' : ""}${ATTRS.map(a => `<option value="${a}"${a === r.attr ? " selected" : ""}>${ATTR_NAMES[a]} ${esc(r.mods[a])}</option>`).join("")}</select>`;
  const tog = (act, label, on, fx, by) => `<button type="button" class="iw-tg ${act}${on ? " on" : ""}" data-act="${act}" ${d} ${pressed(on)}${fx ? ` disabled data-tooltip="From an effect: ${esc(by)}"` : ""}>${label}</button>`;   // v0.0.421 (the audit): the reason it is off (C)
  const roll = `<div class="iw-seg tg">${tog("fav", "Favored", r.fav, r.favFx, r.favBy)}${tog("doom", "Doomed", r.doom, r.doomFx, r.doomBy)}</div>${r.both ? '<div class="iw-live dim">both: a normal roll</div>' : ""}`;
  const step = (k, n, on, man, word) => `<div class="iw-step ${k}${on ? " on" : ""}"><button type="button" data-act="${k}-" ${d} aria-label="One ${word} less"${man ? "" : " disabled"}>&minus;</button><span>${esc(n)}</span><button type="button" data-act="${k}+" ${d} aria-label="One ${word} more">+</button></div>`;
  return `<div class="iw-row ${r.tint}${r.member ? " member" : ""}">${name}<div>${who}</div><div>${sel}</div><div>${roll}</div><div>${step("boons", r.boons, r.boonsOn, r.manB, "Boon")}</div><div>${step("banes", r.banes, r.banesOn, r.manN, "Bane")}</div></div>`;
}

/** The GM window. */
export function gmHtml(m) {
  const head = `<header class="iw-head"><div class="iw-ttl"><h1>Initiative</h1><span>${esc(m.sub)}</span></div>
    <div class="iw-hr"><span class="iw-hl">Check</span><div class="iw-attrs">${m.attrBtns.map(b => `<button type="button" data-act="call" data-v="${b.key}" ${pressed(b.on)} style="--ac:${b.color}" class="${b.on ? "on" : ""} a-${b.key}">${b.label}</button>`).join("")}</div>
    <button type="button" class="iw-gmall" data-act="gmAll">GM rolls all</button></div></header>`;
  const players = `<div class="iw-players">${esc(m.playersLine)}</div>`;
  const cols = '<div class="iw-cols"><span>Creature</span><span>Who rolls</span><span>Check</span><span>Roll</span><span>Boons</span><span>Banes</span></div>';
  const sides = m.sides.map(s => `<section class="iw-sec"><button type="button" class="iw-sh" data-act="fold" data-key="${s.key}" aria-expanded="${s.open}" style="background:${s.bg}"><b>${s.caret} ${esc(s.name)}</b><span>${esc(s.tag)}</span><span class="iw-cnt">${esc(s.count)}</span></button>${s.open ? s.rows.map(rowHtml).join("") : ""}</section>`).join("");
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
  const heroes = m.heroes.length ? `<section class="iw-sec"><div class="iw-sh static" style="background:#dfe7f1"><b>Heroes</b></div>${m.heroes.map(line).join("")}</section>` : "";
  const others = m.others.map(s => `<section class="iw-sec"><div class="iw-sh static" style="background:${s.bg}"><b>${esc(s.name)}</b></div>${s.hold ? '<p class="iw-note pad">Shown when combat starts.</p>' : s.items.length ? s.items.map(line).join("") : '<p class="iw-note pad">None in sight.</p>'}</section>`).join("");
  return `<div class="iw pl">${head}<div class="iw-body">${m.yours.map(card).join("") || '<p class="iw-empty">You have no creature in this encounter.</p>'}${heroes}${others}</div>
    <footer class="iw-foot"><span class="iw-hint">The order appears in the Combat Tracker.</span><button type="button" class="iw-btn2 big" data-act="cancel">Close</button></footer></div>`;
}
