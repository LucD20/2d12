// v0.0.455 (Lucas, group 4, the mockup foundry/mockups/group4: "Where A, links A, the Loot tab proposed"; book/research/inventory-ui.md): the
// PC's Inventory tab (was Items) and the NPC's Loot tab in one look. Three sections (Weapons, Armor, Gear), each a heading on a rule with its column
// words; every item one ruled line (a second only for a warning); a click on a name opens its detail under the line (the rest of what it is, Send to
// chat · Edit · Remove); where a weapon or an armor is: one word on a button that opens the HUD hand tile's menu (pcsheet.mjs handMenuModel) or the
// place menu below; the top line: Coins and Weight, then Generate Weapon · Browse compendium · New Item (the NPC sheet's links). Pure HTML from the
// actor (the sheet wires the clicks: actor-sheets.mjs).
import { esc } from "./util.mjs";
import { TWOD12 } from "./config.mjs";
import { weaponWhere, armorWhere, handSlots, handOf, HAND_LABEL, ARMOR_WHERE, oneHandedTwoHander } from "./loadout.mjs";
import { masteryValue, groupOf, weaponGroupOf, TECHNIQUE_AT } from "./mastery.mjs";
import { weaponTierText } from "./explode.mjs";

const fmtN = n => String(Math.round(n * 100) / 100);
const plain = h => String(h ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const hw = h => (h === "main" ? "main hand" : h === "off" ? "off hand" : "both hands");

/** The word a weapon's Where button shows. */
export function whereWord(weapons, w) {
  const wh = weaponWhere(w);
  if (wh === "dropped") return "Dropped";
  if (wh === "worn") return "On you";
  return HAND_LABEL[handOf(weapons, w.id)] ?? "In hand";
}
/**
 * The Where menu of a weapon that isn't in hand (pure; the same shape as handMenuModel: { title, sub, warn, groups: [[{ key, label, act, cost,
 * off, why }]] }): draw it into a free hand, or stow the held one and draw it (Interact, 1 AP: applyHandPick's "draw" and "chg"); Drop or Pick up
 * (no AP, as the Items tab's segment did). A weapon in hand uses its hand's menu (handMenuModel).
 */
export function placeMenuModel(weapons, w, { inCombat = false, ap = 99 } = {}) {
  const where = weaponWhere(w);
  const price = n => (inCombat ? `${n} AP` : "free"), lack = n => (inCombat && ap < n ? (ap > 0 ? `Needs ${n} AP (${ap} left)` : "No AP left") : "");
  const row = (key, label, act, n) => { const why = lack(n); return { key, label, act, cost: n ? price(n) : "", off: !!why, why }; };
  const slots = handSlots(weapons), free = slots.filter(s => s.free), two = !!w.system?.traits?.has?.("twohanded"), verb = where === "dropped" ? "Pick up" : "Draw";
  const g1 = [];
  if (two && free.length === 2) g1.push(row(`draw:${w.id}:main`, `${verb} with both hands`, "Interact", 1));
  else for (const s of free) g1.push(row(`draw:${w.id}:${s.hand}`, `${verb} into your ${hw(s.hand)}`, "Interact", 1));
  for (const s of slots.filter(x => !x.free)) { const x = weapons.find(v => v.id === s.id); if (x) g1.push(row(`chg:${x.id}:${w.id}:${s.hand}`, `Stow the ${x.name}, draw this`, "Interact", 1)); }
  const g2 = where === "dropped" ? [row(`place:${w.id}:worn`, "Pick up, keep it on you", "", 0)] : [row(`place:${w.id}:dropped`, "Drop", "", 0)];
  return { title: w.name, sub: where === "dropped" ? "dropped" : "on you", warn: "", groups: [g1, g2].filter(g => g.length) };
}
/** An armor's Where menu: its two other places (no AP, as the segment did). */
export function armorMenuModel(ar) {
  const where = armorWhere(ar), all = [["worn", "Wear it"], ["carried", "Take it off, carry it"], ["dropped", "Drop"]];
  return { title: ar.name, sub: String(ARMOR_WHERE[where] ?? "").toLowerCase(), warn: "", groups: [all.filter(([k]) => k !== where).map(([k, l]) => ({ key: `place:${ar.id}:${k}`, label: l, act: "", cost: "", off: false, why: "" }))] };
}
/** A Where menu's HTML (the HUD hand menu's rows). */
export const whereMenuHtml = m => {
  const rowHtml = r => `<button type="button" role="menuitem" class="hm-row${r.off ? " off" : ""}"${r.key && !r.off ? ` data-k="${esc(r.key)}"` : " disabled"}><span class="hm-l">${esc(r.label)}${r.off && r.why ? `<small>${esc(r.why)}</small>` : ""}</span><span class="hm-c">${esc(r.act ?? "")} <b>${esc(r.cost ?? "")}</b></span></button>`;
  return `<div class="hm-h"><b>${esc(m.title)}</b> <small>${esc(m.sub ?? "")}</small>${m.warn ? `<span class="hm-w">${esc(m.warn)}</span>` : ""}</div>${(m.groups ?? []).map(g => `<div class="hm-g">${g.map(rowHtml).join("")}</div>`).join("")}`;
};

const dmgLine = w => [1, 2, 3].map(n => weaponTierText(w.system?.damage?.[`t${n}`]) || "0").join(" / ");
const rangeShort = w => { const t = w.system.traits, r = String(w.system.range ?? "").split("/").map(x => x.trim()).join(" / "); return t.has("ranged") ? r : [t.has("melee") ? (Number(w.system.range) > 1 ? `Melee ${w.system.range}` : "Melee") : "", t.has("thrown") ? "Thrown" : ""].filter(Boolean).join(", "); };
const subtypeWord = w => { const k = w.system?.subtype; return k ? `<span class="inv-dt" style="--sc-d:${TWOD12.subtypeColors?.[k] ?? "inherit"}">${esc(TWOD12.subtypes?.[k] ?? k)}</span>` : ""; };
const links = `<a data-action="sendItem" role="button">Send to chat</a><a data-action="openItem" role="button">Edit</a><a data-action="confirmDelete" role="button">Remove</a>`;
const nameLink = (i, open) => `<a class="inv-nm" data-action="toggleItem" role="button" aria-expanded="${open}">${esc(i.name)}</a>`;
const qtyHtml = (i, n) => `<span class="inv-qty"><button type="button" data-action="qtyStep" data-d="-1" aria-label="One less ${esc(i.name)}">&minus;</button><input class="gq inv-qn" type="number" min="0" value="${n}" data-item-id="${i.id}" aria-label="Quantity of ${esc(i.name)}"><button type="button" data-action="qtyStep" data-d="1" aria-label="One more ${esc(i.name)}">+</button></span>`;

function weaponRow(a, weapons, w, open) {
  const where = weaponWhere(w), t = w.system.traits, mv = masteryValue(a, groupOf(w));
  const unloaded = t.has("reload") && !!w.system.unloaded, warn = oneHandedTwoHander(w);
  const flags = [unloaded ? `<span class="inv-warn">Unloaded.</span> <a class="inv-lnk" data-action="reloadWeapon" role="button">Reload</a> (1 AP)` : "", warn ? `<span class="inv-warn">Two-handed, held in one hand: 3 Banes on its Strikes.</span>` : ""].filter(Boolean).join(" ");
  const tech = (a.itemTypes?.action ?? []).find(x => x.system?.category === "Weapon Technique" && x.getFlag?.("twod12", "weaponId") === w.id);
  const group = TWOD12.weaponGroups?.[weaponGroupOf(w)] ?? "";
  const tier = n => esc(weaponTierText(w.system.damage?.[`t${n}`]) || "0");
  const detail = `<div class="inv-detail">
    <div class="inv-traits">${[...t].filter(p => TWOD12.weaponTraits?.[p]).map(p => `<b>${esc(TWOD12.weaponTraits[p])}</b>`).join(" <i>·</i> ")}</div>
    <div class="inv-dl"><b>Range</b> ${esc(t.has("ranged") ? rangeShort(w) : `${w.system.range || 1}${t.has("thrown") && w.system.thrownRange ? `, Thrown ${String(w.system.thrownRange).split("/").join(" / ")}` : ""}`)} <i>·</i> ${subtypeWord(w)} damage${group ? ` <i>·</i> <b>Group</b> ${esc(group)}` : ""}</div>
    <div class="inv-dl inv-tiers"><b>Weapon damage [W]</b><span>Tier 1 <b>${tier(1)}</b></span><span>Tier 2 <b>${tier(2)}</b></span><span>Tier 3 <b>${tier(3)}</b></span></div>
    <div class="inv-dl"><b>Mastery</b> ${mv} of ${TECHNIQUE_AT}: ${tech ? `its Weapon Technique, <b>${esc(tech.name)}</b>, ${mv >= TECHNIQUE_AT ? "is unlocked" : `unlocks at ${TECHNIQUE_AT}`}.` : "no Weapon Technique on this weapon yet."}</div>
    <div class="inv-dlinks">${links}</div></div>`;
  return `<div class="inv-r${open ? " open" : ""}${where === "dropped" ? " dropped" : ""}" data-item-id="${w.id}"><div class="inv-row w lrow" data-item-id="${w.id}">
    <span class="inv-n">${nameLink(w, open)}<span class="inv-sub">${[subtypeWord(w), esc(rangeShort(w))].filter(Boolean).join(" · ")}</span></span>
    <span class="inv-dmg">${esc(dmgLine(w))}</span><span class="inv-mst">${mv}<small> / ${TECHNIQUE_AT}</small></span>
    <span class="inv-wc"><button type="button" class="inv-where${warn ? " warn" : ""}" data-action="whereMenu" aria-haspopup="menu" aria-expanded="false">${esc(whereWord(weapons, w))}<i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></span></div>
    ${flags ? `<div class="inv-flagl">${flags}</div>` : ""}${detail}</div>`;
}
function armorRow(a, ar, open) {
  const s = a.system, training = TWOD12.armors?.[s.armorTraining]?.rank ?? 3, cat = TWOD12.armors?.[ar.system.category] ?? { value: 0, rank: 0, label: "" };
  const value = (cat.value ?? 0) + (Number(ar.system.bonus) || 0), where = armorWhere(ar), trained = (cat.rank ?? 0) <= training;
  const tr = TWOD12.armorTrainings?.[s.armorTraining] ?? "", ad = (TWOD12.defenseBase ?? 11) + value, ward = Number(ar.system.ward) || 0;
  const detail = `<div class="inv-detail"><div class="inv-dl"><b>${esc(cat.label)} armor</b> <i>·</i> Armor value ${value} &rarr; AD ${ad} <i>·</i> Ward +${ward}</div>
    <div class="inv-dl">${trained ? `Trained (${esc(tr)} Armor Training).` : `<span class="inv-warn">Untrained: beyond your ${esc(tr)} training.</span>`}</div>${plain(ar.system.description) ? `<div class="inv-dl inv-desc">${esc(plain(ar.system.description))}</div>` : ""}
    <div class="inv-dlinks">${links}</div></div>`;
  return `<div class="inv-r${open ? " open" : ""}${where === "dropped" ? " dropped" : ""}" data-item-id="${ar.id}"><div class="inv-row a lrow" data-item-id="${ar.id}">
    <span class="inv-n">${nameLink(ar, open)}<span class="inv-sub${trained ? "" : " bad"}">${esc(cat.label)}${trained ? "" : " · Untrained"}</span></span>
    <span class="inv-dmg">AD ${ad} · Ward +${ward}</span><span class="inv-mst"></span>
    <span class="inv-wc"><button type="button" class="inv-where" data-action="whereMenu" aria-haspopup="menu" aria-expanded="false">${esc(ARMOR_WHERE[where] ?? "")}<i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></span></div>${detail}</div>`;
}
function gearRow(g, open) {
  const qn = Number(g.system?.quantity) || 0, w = Number(g.system?.weight) || 0, c = Number(g.system?.cost) || 0;
  const detail = `<div class="inv-detail">${plain(g.system?.description) ? `<div class="inv-dl inv-desc">${esc(plain(g.system.description))}</div>` : ""}
    <div class="inv-dl"><b>Each</b> weight ${w ? fmtN(w) : "—"}, cost ${c ? fmtN(c) : "—"} <i>·</i> <b>All ${qn}</b> weight ${w ? fmtN(w * qn) : "—"}, cost ${c ? fmtN(c * qn) : "—"}</div>
    <div class="inv-dlinks">${links}</div></div>`;
  return `<div class="inv-r${open ? " open" : ""}" data-item-id="${g.id}"><div class="inv-row g lrow" data-item-id="${g.id}">
    <span class="inv-n">${nameLink(g, open)}<span class="inv-sub">${esc(plain(g.system?.description))}</span></span>
    ${qtyHtml(g, qn)}<span class="inv-wt">${w ? fmtN(w * qn) : "—"}</span></div>${detail}</div>`;
}
const band = (title, cols, cls) => `<div class="ps2-band inv-band ${cls}"><b>${title}</b>${cols.map(c => `<span class="inv-c">${c}</span>`).join("")}</div>`;
const LINK = {
  gen: `<a data-action="generateWeapon" role="button"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Generate Weapon</a>`,
  browse: `<a data-action="browseItems" role="button"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Browse compendium</a>`,
  add: `<a data-action="newGear" role="button"><i class="fa-solid fa-plus" aria-hidden="true"></i> New Item</a>`
};

/** The PC's Inventory tab. weapons: in the tab's order; open: the ids whose detail is open. */
export function inventoryHtml(a, { weapons = null, open = new Set() } = {}) {
  const s = a.system ?? {}, ws = (weapons ?? a.itemTypes?.weapon ?? []).filter(w => weaponWhere(w) !== "none" && !w.system?.traits?.has?.("barehanded"));
  const all = weapons ?? a.itemTypes?.weapon ?? [], armor = a.itemTypes?.armor ?? [], gear = a.itemTypes?.gear ?? [];
  const weight = fmtN(gear.reduce((n, x) => n + (Number(x.system?.weight) || 0) * (Number(x.system?.quantity) || 0), 0));
  const training = TWOD12.armors?.[s.armorTraining]?.rank ?? 3;
  const untrained = armor.some(ar => armorWhere(ar) === "worn" && (TWOD12.armors?.[ar.system.category]?.rank ?? 0) > training);
  const top = `<div class="inv-top"><span class="inv-coins"><label>Coins <input type="number" min="0" name="system.coins" value="${Number(s.coins) || 0}" aria-label="Coins"></label> <i>·</i> Weight <b>${weight}</b></span><span class="ps2-links">${LINK.gen}${LINK.browse}${LINK.add}</span></div>`;
  return `<div class="inv">${top}
    <div class="ps2-sec inv-sec">${band("Weapons", ["Damage", "Mastery", "Where"], "w")}<div class="olist" data-order-flag="itemOrder">${ws.map(w => weaponRow(a, all, w, open.has(w.id))).join("") || '<div class="inv-empty">No weapons. Drag one onto the sheet, or Generate Weapon.</div>'}</div></div>
    <div class="ps2-sec inv-sec">${band("Armor", ["Defense", "", "Where"], "a")}<div class="olist" data-order-flag="itemOrder">${armor.map(ar => armorRow(a, ar, open.has(ar.id))).join("") || '<div class="inv-empty">No armor: you are Unarmored (Armor 11). Drag an armor onto the sheet.</div>'}</div>${untrained ? '<div class="inv-warnl">Untrained: all your Rolls Doomed; Actions against your AD and WD Favored.</div>' : ""}</div>
    <div class="ps2-sec inv-sec">${band("Gear", ["Qty", "Weight"], "g")}<div class="olist" data-order-flag="itemOrder">${gear.map(g => gearRow(g, open.has(g.id))).join("") || '<div class="inv-empty">No gear. Drag items onto the sheet, or New Item.</div>'}</div></div>
  </div>`;
}

/** The NPC's Loot tab: the same lines, a quantity on gear, one Give… a line. */
export function lootHtml(a, { open = new Set() } = {}) {
  const rows = [...(a.itemTypes?.weapon ?? []), ...(a.itemTypes?.armor ?? []), ...(a.itemTypes?.gear ?? [])].filter(i => !i.system?.traits?.has?.("barehanded") && i.getFlag?.("twod12", "basic") !== "fists");
  const note = i => (i.type === "gear" ? (Number(i.system?.cost) ? `${fmtN(Number(i.system.cost))} each` : "") : `${i.type}, flavor`);
  const row = i => {
    const qn = i.type === "gear" ? (Number(i.system?.quantity) || 1) : 1, op = open.has(i.id);
    const detail = `<div class="inv-detail">${plain(i.system?.description) ? `<div class="inv-dl inv-desc">${esc(plain(i.system.description))}</div>` : ""}<div class="inv-dlinks">${links}</div></div>`;
    return `<div class="inv-r${op ? " open" : ""}" data-item-id="${i.id}"><div class="inv-row l lrow" data-item-id="${i.id}"><span class="inv-n">${nameLink(i, op)}<span class="inv-sub">${esc(note(i))}</span></span>
      <span class="inv-lq">${i.type === "gear" ? qtyHtml(i, qn) : '<span class="inv-q1">1</span>'}</span><button type="button" class="inv-give" data-action="giveLoot">Give…</button></div>${detail}</div>`;
  };
  return `<div class="inv inv-loot"><div class="inv-top"><span></span><span class="ps2-links">${LINK.browse}${LINK.add}</span></div>
    <div class="inv-note">An NPC's items are flavor and loot: they never change its Health, Defenses or damage.</div>
    <div class="ps2-sec inv-sec">${band("Loot", ["Qty", ""], "l")}<div class="olist" data-order-flag="itemOrder">${rows.map(row).join("") || '<div class="inv-empty">No loot. Drag items onto the sheet, or New Item.</div>'}</div></div></div>`;
}
