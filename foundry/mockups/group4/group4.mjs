// Group 4 (Lucas, 2026-11-19): "the Items tab renamed Inventory and turned into a compact inventory, like PF2e / 5e; Generate Weapon and New Item
// become links, like the NPC's 'Generate Action · Browse compendium'; then the NPC Loot tab in the same look." A mockup: nothing in foundry/twod12
// changed. TODAY is the system's own template (templates/actor-sheet-pc.hbs, its Items and Loot tabs) and CSS on the compendium creatures, with
// the tab's model built as actor-sheets.mjs (_prepareContext) and pcsheet.mjs (pcModel, lootRows) build it. The PROPOSAL is the same sheet with
// the tab's HTML replaced (drawn here, in the sheet's own classes, plus group4.css under .g4-*). The menus are the system's own models
// (pcsheet.mjs handMenuModel; pickwindow.mjs pickWindowHtml; sysmsg.mjs sysLine).   index.html?theme=dark|light
import { makeActor, sheetModel, esc } from "../sheets/model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const SM = await import("../../twod12/module/sheetmodel.mjs");
const { TWOD12, effectiveFrequency } = await import("../../twod12/module/config.mjs");
const LO = await import("../../twod12/module/loadout.mjs");
const MA = await import("../../twod12/module/mastery.mjs");
const PCS = await import("../../twod12/module/pcsheet.mjs");
const PW = await import("../../twod12/module/pickwindow.mjs");
const MSG = await import("../../twod12/module/sysmsg.mjs");
const { weaponTierText } = await import("../../twod12/module/explode.mjs");
const SS = await import("../../twod12/module/statsyms.mjs");
const INV = await import("../../twod12/module/inventory.mjs");   // v0.0.455
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { ICONS } = await import("../npc-hud-icons.mjs");
const ALIAS = { "hand-holding": "hand", "hands": "hand" };
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n0, rest, attrs) => { const n = ICONS[n0] ? n0 : ALIAS[n0]; return n && ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m; });
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const noTips = html => html.replace(/\sdata-tooltip="[^"]*"/g, "");
const data = await (await fetch("../sheets/actors.json")).json();
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");

/* ================================================================== the creatures (example state: each line says what it sets) */
const clone = o => JSON.parse(JSON.stringify(o));
const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, "");
const gear = (name, quantity, weight, cost, description) => ({ id: `g4g${slug(name)}`, name, type: "gear", img: "icons/svg/item-bag.svg", flags: {}, system: { quantity, weight, cost, description: `<p>${description}</p>` } });
const armorItem = (name, category, extra = {}) => ({ id: `g4a${slug(name)}`, name, type: "armor", img: "icons/svg/shield.svg", flags: {}, system: { description: "", category, bonus: 0, ward: 0, properties: "", worn: false, ...extra } });
const weaponItem = (name, traits, sys = {}) => ({ id: `g4w${slug(name)}`, name, type: "weapon", img: "icons/svg/sword.svg", flags: {}, system: { traits, hands: 1, subtype: "Sl", range: "1", thrownRange: "", actions: [], damage: { t1: { pool: "B", count: 0, die: "", mod: 0 }, t2: { pool: "B", count: 1, die: "d6", mod: 0 }, t3: { pool: "B", count: 2, die: "d6", mod: 0 } }, ...sys } });
/** Sylwen: in combat, round 2, 3 AP left; the Hunting Bow in her main hand, the Dagger on her (sheathed); 34 coins; five gear items (example data). */
function sylwen() {
  const d = clone(data.sylwen);
  d.items.push(gear("Rope", 1, 2, 1, "Fifteen meters of hemp rope."), gear("Torch", 3, 0.5, 0.1, "A pitch-soaked torch."), gear("Rations", 4, 0.5, 0.5, "One day of dried food: hard bread, cheese and smoked meat."),
    gear("Waterskin", 1, 1, 0.2, "A leather skin; holds a day of water."), gear("Spare bowstring", 2, 0, 0.5, "Waxed linen, coiled in a small tin."));
  return makeActor(d, { system: { coins: 34, escalation: 4, damage: { bodyLethal: 6, mindNonlethal: 3 } }, items: { "Hunting Bow": { wielded: true, hand: "main", hands: 1 }, Dagger: { wielded: false } } });
}
/** Aveline as the compendium has her (the Longsword in both hands, Heavy Armor worn, no gear, no coins): out of combat. */
const aveline = () => makeActor(clone(data.aveline));
/** Example rows only (not a compendium PC): Aveline's sheet with the states a row can be in (a Two-handed weapon in one hand, an Unloaded crossbow,
 *  a dropped weapon, an armor beyond her training, carried). */
function states() {
  const d = clone(data.aveline);
  d.items = d.items.filter(i => i.type !== "armor" && i.type !== "weapon" || i.name === "Fists" || i.name === "Longsword");
  d.items.push(weaponItem("Hand Crossbow", ["projectile", "ranged", "reload"], { subtype: "Pi", range: "6/12/24", wielded: true, hand: "off", unloaded: true, damage: { t1: { pool: "B", count: 0, die: "", mod: 0 }, t2: { pool: "B", count: 1, die: "d4", mod: 0 }, t3: { pool: "B", count: 1, die: "d4", mod: 1 } } }),
    weaponItem("Spear", ["melee", "thrown"], { subtype: "Pi", range: "1", thrownRange: "4/8/12", dropped: true }),
    armorItem("Plate of the Order", "heavy", { worn: true }), armorItem("Leather Jerkin", "light"));
  return makeActor(d, { system: { armorTraining: "medium" }, items: { Longsword: { wielded: true, hands: 1, hand: "main" } } });
}
/** The Orc Warrior with example loot: its Cleaver (in hand, flavor) and four items added for the mockup. */
function orc(empty = false) {
  const d = clone(data.orc);
  if (empty) d.items = d.items.filter(i => i.type !== "weapon" || i.name === "Fists");
  else d.items.push(armorItem("Hide Armor", "light", { worn: true }), gear("Coins", 14, 0, 1, "Dented silver, in a greasy pouch."), gear("Bone Charm", 1, 0, 5, "A finger bone on a cord, carved with a tusked face."), gear("Rations", 2, 0.5, 0.5, "Smoked meat of an animal best left unnamed."));
  return makeActor(d, { system: { damage: { bodyLethal: 5 } } });
}

/* ================================================================== the sheet (../sheets/built.mjs "built", the build's added fields) */
function built(a, pc, st) {
  const ap = st.ap ?? 4, rap = st.rap ?? 1, escN = Number(a.system.escalation) || 0;
  for (const sec of pc.sections) for (const r of sec.rows) {
    const it = r.item.system, hb = r.handBtns;
    r.bar = { ...SM.actionBar({ aps: it.versions.map(v => v.ap), reaction: !!it.reaction, frequency: r.frequency, escalation: r.escalation, dist: r.dist === "—" ? "" : r.dist, vs: r.vs, inCombat: pc.strip.inCombat, ap, rap }), weaponId: hb?.length === 1 ? hb[0].id : "", hands: hb?.length >= 2 ? hb : null };
  }
  const vs = Object.fromEntries(pc.defs.vs.map((x, k) => [["body", "mind", "appeal", "instinct"][k], x.value]));
  pc.attrs.forEach(x => { x.vs = vs[x.key]; });
  pc.mods.forEach(m => { m.tile = m.label; });
  pc.strip.esc.pips = Array.from({ length: 6 }, (_, k) => k < escN);
  pc.strip.esc.hookList = st.hookList ?? [];
  pc.strip.esc.marks = SM.escMarks(escN, 6, [2, 4, 6]);
  pc.strip.lists = SM.combatLists({ npc: pc.npc, elite: pc.strip.elite, hookNames: st.hookNames ?? [], used: {}, rungs: pc.npc ? (SM.ELITE_RUNGS ?? []).map(r => ({ ...r, lit: escN >= r.n })) : SM.escRungs(escN, st.rungs ?? {}, true, 6), bloodied: a.system.bloodied, strained: a.system.strained });
  for (const g of pc.basic) for (const r of g.rows) { r.fq = effectiveFrequency(r.item.system) === "round" ? "round" : "atwill"; r.cost = String(r.cost).replace(/\s*AP$/, ""); }
  for (const sec of pc.sections) if (["reaction", "granted", "apex"].includes(sec.key)) sec.rows.forEach(r => { r.showFq = true; });
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.head.round = `Round ${st.round ?? 1}`;
  pc.inventoryHtml = pc.npc ? "" : INV.inventoryHtml(a, { open: new Set(st.open ?? []) });   // v0.0.455: the build's tabs (inventory.mjs)
  pc.lootHtml = pc.npc ? INV.lootHtml(a, { open: new Set(st.open ?? []) }) : "";
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true, syms: pc.npc ? { Immune: SS.statSym("immune"), Resist: SS.statSym("resist"), Weak: SS.statSym("weak") } : null });
  return pc;
}

/* ================================================================== TODAY's Items tab model (actor-sheets.mjs _prepareContext + pcsheet.mjs pcModel "Items tab") */
const fmtN = n => String(Math.round(n * 100) / 100);
function todayItems(a, pc) {
  const s = a.system, PROPS = ["melee", "ranged", "thrown", "long", "reload", "twohanded", "nonthreatening", "projectile"];
  pc.weapons = a.itemTypes.weapon.filter(w => LO.weaponWhere(w) !== "none").map(w => {
    const where = LO.weaponWhere(w), t = w.system.traits, mv = MA.masteryValue(a, MA.groupOf(w)), inHand = where === "1h" || where === "2h";
    return { id: w.id, name: w.name, tiers: LO.tierBoxes(w), where, dropped: where === "dropped", unloaded: t.has("reload") && !!w.system.unloaded, warn: where === "1h" && t.has("twohanded"),
      sub: [w.system.masteryGroup, PROPS.filter(p => t.has(p)).map(p => TWOD12.weaponTraits?.[p] ?? p).join(", "), TWOD12.subtypes[w.system.subtype] ?? "", w.system.range ? `Range ${w.system.range}` : ""].filter(Boolean).join(" · "),
      mastery: `${mv} / ${MA.TECHNIQUE_AT}`, techOn: mv >= MA.TECHNIQUE_AT,
      seg: [{ v: "dropped", l: "Dropped", on: where === "dropped" }, { v: "worn", l: "On you", on: where === "worn" }, { v: t.has("twohanded") ? "2h" : "1h", l: inHand ? `In hand ${where === "2h" ? "2H" : "1H"}` : "In hand", on: inHand }] };
  });
  const training = TWOD12.armors[s.armorTraining]?.rank ?? 3;
  pc.armor = (a.itemTypes.armor ?? []).map(ar => {
    const cat = TWOD12.armors[ar.system.category] ?? { value: 0, rank: 0 }, value = (cat.value ?? 0) + (Number(ar.system.bonus) || 0), where = LO.armorWhere(ar), trained = (cat.rank ?? 0) <= training;
    return { id: ar.id, name: ar.name, where, dropped: where === "dropped", value, ad: TWOD12.defenseBase + value, ward: `+${Number(ar.system.ward) || 0}`, trained, seg: LO.whereButtons("armor", where),
      trainText: trained ? `Trained (${TWOD12.armorTrainings[s.armorTraining] ?? ""})` : `Untrained: beyond your ${TWOD12.armorTrainings[s.armorTraining] ?? ""} training` };
  });
  const untrainedWorn = pc.armor.some(r => r.where === "worn" && !r.trained);
  pc.untrained = untrainedWorn ? "Untrained: all your Rolls Doomed; Actions against your AD and WD Favored." : "";
  const g = (a.itemTypes.gear ?? []).map(x => { const qn = Number(x.system.quantity) || 0, w = Number(x.system.weight) || 0, c = Number(x.system.cost) || 0; return { id: x.id, name: x.name, img: x.img, qty: qn, weight: w ? fmtN(w * qn) : "—", cost: c ? fmtN(c * qn) : "—" }; });
  return { gear: g, gearWeight: fmtN((a.itemTypes.gear ?? []).reduce((n, x) => n + (Number(x.system.weight) || 0) * (Number(x.system.quantity) || 0), 0)) };
}

/** The whole sheet through the system's template; tab: the tab shown; swap(host): the proposal's changes to the DOM. */
function sheetHtml(a, st, { tab = "items", swap = null } = {}) {
  const pc = built(a, sheetModel(a, { ...st, dl: DL, cd: CD }), st);
  const extra = pc.npc ? {} : todayItems(a, pc);
  if (pc.npc) pc.loot = PCS.lootRows(a);
  const host = new DOMParser().parseFromString("<body></body>", "text/html").body;
  host.innerHTML = tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: extra.gear ?? [], gearWeight: extra.gearWeight ?? "0", startMastery: [] });
  swap?.(host, pc);
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === tab);
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === tab);
  return icons(art(noTips(host.innerHTML)));
}
const win = (title, w, h, inner, cls = "") => `<div class="mk-win ${cls}" style="width:${w}px${h ? `;height:${h}px` : ""}"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:${w}px${h ? `;height:${h}px` : ""}"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><section class="window-content">${inner}</section></div></div>`;

/* ================================================================== THE PROPOSAL: the Inventory tab */
const COMBAT = { inCombat: true, ap: 3 };
const hw = h => (h === "main" ? "main hand" : h === "off" ? "off hand" : "both hands");
/** The word a weapon's Where button shows. */
function whereWord(weapons, w) {
  const wh = LO.weaponWhere(w);
  if (wh === "dropped") return "Dropped";
  if (wh === "worn") return "On you";
  return LO.HAND_LABEL[LO.handOf(weapons, w.id)] ?? "In hand";
}
/**
 * PROPOSED (a new pure function beside pcsheet.mjs handMenuModel): the Where menu of a weapon row. A weapon in hand: its hand's menu, the HUD's
 * (handMenuModel, unchanged). A weapon on you or dropped: draw it into a free hand, or put the held one away and draw it (applyHandPick's
 * "draw" and "chg" keys, Interact 1 AP); Drop / Pick up as the segment does today (no AP). Same shape: { title, sub, warn, groups }.
 */
function placeMenuModel(weapons, w, { inCombat = false, ap = 99 } = {}) {
  const where = LO.weaponWhere(w);
  if (where === "1h" || where === "2h") return PCS.handMenuModel(weapons, LO.handOf(weapons, w.id), { inCombat, ap });
  const price = n => (inCombat ? `${n} AP` : "free"), lack = n => (inCombat && ap < n ? (ap > 0 ? `Needs ${n} AP (${ap} left)` : "No AP left") : "");
  const row = (key, label, act, n) => { const why = lack(n); return { key, label, act, cost: price(n), off: !!why, why }; };
  const slots = LO.handSlots(weapons), free = slots.filter(s => s.free), two = w.system.traits.has("twohanded"), verb = where === "dropped" ? "Pick up" : "Draw";
  const g1 = [];
  if (two && free.length === 2) g1.push(row(`draw:${w.id}:main`, `${verb} with both hands`, "Interact", 1));
  else for (const s of free) g1.push(row(`draw:${w.id}:${s.hand}`, `${verb} into your ${hw(s.hand)}`, "Interact", 1));
  for (const s of slots.filter(x => !x.free)) { const x = weapons.find(v => v.id === s.id); g1.push(row(`chg:${x.id}:${w.id}:${s.hand}`, `Stow the ${x.name}, draw this`, "Interact", 1)); }
  const g2 = where === "dropped" ? [row(`place:${w.id}:worn`, "Pick up, keep it on you", "", 0)] : [row(`place:${w.id}:dropped`, "Drop", "", 0)];
  return { title: w.name, sub: where === "dropped" ? "dropped" : "on you", warn: "", groups: [g1, g2].filter(g => g.length) };
}
/** PROPOSED: an armor's Where menu (the three places of today's segment; no AP, as today). */
function armorMenuModel(ar) {
  const where = LO.armorWhere(ar), all = [["worn", "Wear it"], ["carried", "Take it off, carry it"], ["dropped", "Drop"]];
  return { title: ar.name, sub: LO.ARMOR_WHERE[where].toLowerCase(), warn: "", groups: [all.filter(([k]) => k !== where).map(([k, l]) => ({ key: `place:${ar.id}:${k}`, label: l, act: "", cost: "", off: false, why: "" }))] };
}
/** The menu's HTML: hud.mjs handMenu's rows, opening under the button. */
const menuHtml = m => {
  const rowHtml = r => `<button type="button" class="hm-row${r.off ? " off" : ""}"${r.key && !r.off ? ` data-k="${esc(r.key)}"` : " disabled"}><span class="hm-l">${esc(r.label)}${r.off && r.why ? `<small>${esc(r.why)}</small>` : ""}</span><span class="hm-c">${esc(r.act)} <b>${esc(r.cost)}</b></span></button>`;
  return `<div class="g4-menu" role="menu"><div class="hm-h"><b>${esc(m.title)}</b> <small>${esc(m.sub)}</small>${m.warn ? `<span class="hm-w">${esc(m.warn)}</span>` : ""}</div>${m.groups.map(g => `<div class="hm-g">${g.map(rowHtml).join("")}</div>`).join("")}</div>`;
};
/** Foundry's context menu on a row (as the weapon and armor rows have it today; the gear rows get it too). */
const ctxHtml = items => `<div class="g4-menu g4-ctx" role="menu"><div class="hm-g">${items.map(([ic, l]) => `<button type="button" class="hm-row"><span class="hm-l"><i class="fa-solid fa-${ic}"></i> ${esc(l)}</span><span class="hm-c"></span></button>`).join("")}</div></div>`;

const dmgLine = w => [1, 2, 3].map(n => weaponTierText(w.system.damage?.[`t${n}`]) || "0").join(" / ");
const rangeShort = w => { const t = w.system.traits, r = String(w.system.range ?? "").split("/").map(x => x.trim()).join(" / "); return t.has("ranged") ? r : [t.has("melee") ? (Number(w.system.range) > 1 ? `Melee ${w.system.range}` : "Melee") : "", t.has("thrown") ? "Thrown" : ""].filter(Boolean).join(", "); };
const subtypeWord = w => { const k = w.system.subtype, c = TWOD12.subtypeColors?.[k]; return k ? `<span class="g4-dt" style="--sc-d:${c ?? "inherit"}">${esc(TWOD12.subtypes[k])}</span>` : ""; };
const isOpen = (o, id) => [].concat(o.open ?? []).includes(id);
const plain = h => String(h ?? "").replace(/<[^>]*>/g, "").trim();

/** The weapon row (and its detail when open). o: { where: "A" | "B", open, menu, ctx } */
function weaponRow(a, w, o) {
  const weapons = a.itemTypes.weapon, where = LO.weaponWhere(w), t = w.system.traits, mv = MA.masteryValue(a, MA.groupOf(w));
  const unloaded = t.has("reload") && !!w.system.unloaded, warn = LO.oneHandedTwoHander(w);
  const flags = [unloaded ? `<span class="g4-warn">Unloaded.</span> <a class="g4-lnk" data-action="reloadWeapon">Reload</a> (1 AP)` : "", warn ? `<span class="g4-warn">Two-handed, held in one hand: 3 Banes on its Strikes.</span>` : ""].filter(Boolean).join(" ");
  const ctl = o.where === "B" ? whereWords("weapon", where, t) : `<button type="button" class="g4-where${o.menu === w.id ? " on" : ""}${warn ? " warn" : ""}" data-action="whereMenu" aria-haspopup="menu" aria-expanded="${o.menu === w.id}">${whereWord(weapons, w)}<i class="fa-solid fa-chevron-down"></i></button>`;
  const open = isOpen(o, w.id);
  const tech = a.itemTypes.action.find(x => x.system?.category === "Weapon Technique" && x.getFlag("twod12", "weaponId") === w.id);
  const group = TWOD12.weaponGroups[MA.weaponGroupOf(w)] ?? "";
  const detail = open ? `<div class="g4-detail">
    <div class="g4-traits">${[...t].filter(p => TWOD12.weaponTraits[p]).map(p => `<b>${esc(TWOD12.weaponTraits[p])}</b>`).join(" <i>·</i> ")}</div>
    <div class="g4-dl"><b>Range</b> ${esc(t.has("ranged") ? rangeShort(w) : `${w.system.range || 1}${t.has("thrown") && w.system.thrownRange ? `, Thrown ${w.system.thrownRange.split("/").join(" / ")}` : ""}`)} <i>·</i> ${subtypeWord(w)} damage${group ? ` <i>·</i> <b>Group</b> ${esc(group)}` : ""}</div>
    <div class="g4-dl g4-tiers"><b>Weapon damage [W]</b><span>Tier 1 <b>${esc(weaponTierText(w.system.damage?.t1) || "0")}</b></span><span>Tier 2 <b>${esc(weaponTierText(w.system.damage?.t2) || "0")}</b></span><span>Tier 3 <b>${esc(weaponTierText(w.system.damage?.t3) || "0")}</b></span></div>
    <div class="g4-dl"><b>Mastery</b> ${mv} of ${MA.TECHNIQUE_AT}: ${tech ? `its Weapon Technique, <b>${esc(tech.name)}</b>, ${mv >= MA.TECHNIQUE_AT ? "is unlocked" : `unlocks at ${MA.TECHNIQUE_AT}`}.` : "no Weapon Technique on this weapon yet."}</div>
    <div class="g4-dlinks"><a data-action="sendItem">Send to chat</a><a data-action="openItem">Edit</a><a data-action="confirmDelete">Remove</a></div></div>` : "";
  return `<div class="g4-r${open ? " open" : ""}${where === "dropped" ? " dropped" : ""}" data-item-id="${w.id}"><div class="g4-row w lrow">
    <span class="g4-n"><a class="g4-nm" data-action="toggleItem" role="button" aria-expanded="${open}">${esc(w.name)}</a><span class="g4-sub">${[subtypeWord(w), esc(rangeShort(w))].filter(Boolean).join(" · ")}</span></span>
    ${o.where === "B" ? "" : `<span class="g4-dmg">${esc(dmgLine(w))}</span><span class="g4-mst">${mv}<small> / ${MA.TECHNIQUE_AT}</small></span>`}
    <span class="g4-wc">${ctl}${o.menu === w.id ? menuHtml(placeMenuModel(weapons, w, o.combat ?? COMBAT)) : ""}</span></div>
    ${flags ? `<div class="g4-flagl">${flags}</div>` : ""}${o.where === "B" ? `<div class="g4-row2"><span>${esc(dmgLine(w))}</span><span>Mastery ${mv} / ${MA.TECHNIQUE_AT}</span></div>` : ""}${detail}${o.ctx === w.id ? ctxHtml([["pen-to-square", "Edit"], ["scroll", "Send to chat"], ["chevron-down", "Drop"], ["trash", "Remove"]]) : ""}</div>`;
}
/** Option B's control: today's three places as words, the current one underlined (setWhere, as today). */
function whereWords(kind, where, t) {
  const opts = kind === "weapon" ? [["dropped", "Dropped"], ["worn", "On you"], [where === "2h" ? "2h" : "1h", where === "2h" ? "In hand 2H" : where === "1h" ? "In hand 1H" : "In hand"]] : [["dropped", "Dropped"], ["carried", "Carried"], ["worn", "Worn"]];
  const on = v => v === where || (kind === "weapon" && /h$/.test(v) && /h$/.test(where));
  return `<span class="g4-ww" role="group">${opts.map(([v, l]) => `<button type="button" class="${on(v) ? "on" : ""}" data-action="setWhere" data-where="${v}" aria-pressed="${on(v)}">${esc(l)}</button>`).join("")}</span>`;
}
function armorRow(a, ar, o) {
  const s = a.system, training = TWOD12.armors[s.armorTraining]?.rank ?? 3, cat = TWOD12.armors[ar.system.category] ?? { value: 0, rank: 0, label: "" };
  const value = (cat.value ?? 0) + (Number(ar.system.bonus) || 0), where = LO.armorWhere(ar), trained = (cat.rank ?? 0) <= training, open = isOpen(o, ar.id);
  const tr = TWOD12.armorTrainings[s.armorTraining] ?? "";
  const ctl = o.where === "B" ? whereWords("armor", where) : `<button type="button" class="g4-where${o.menu === ar.id ? " on" : ""}" data-action="whereMenu" aria-haspopup="menu" aria-expanded="${o.menu === ar.id}">${LO.ARMOR_WHERE[where]}<i class="fa-solid fa-chevron-down"></i></button>`;
  const detail = open ? `<div class="g4-detail"><div class="g4-dl"><b>${esc(cat.label)} armor</b> <i>·</i> Armor value ${value} &rarr; AD ${TWOD12.defenseBase + value} <i>·</i> Ward +${Number(ar.system.ward) || 0}</div>
    <div class="g4-dl">${trained ? `Trained (${esc(tr)} Armor Training).` : `<span class="g4-warn">Untrained: beyond your ${esc(tr)} training.</span>`}</div>${plain(ar.system.description) ? `<div class="g4-dl g4-desc">${esc(plain(ar.system.description))}</div>` : ""}
    <div class="g4-dlinks"><a data-action="sendItem">Send to chat</a><a data-action="openItem">Edit</a><a data-action="confirmDelete">Remove</a></div></div>` : "";
  return `<div class="g4-r${open ? " open" : ""}${where === "dropped" ? " dropped" : ""}" data-item-id="${ar.id}"><div class="g4-row a lrow">
    <span class="g4-n"><a class="g4-nm" data-action="toggleItem" role="button" aria-expanded="${open}">${esc(ar.name)}</a><span class="g4-sub${trained ? "" : " bad"}">${esc(cat.label)}${trained ? "" : " · Untrained"}</span></span>
    ${o.where === "B" ? "" : `<span class="g4-dmg">AD ${TWOD12.defenseBase + value} · Ward +${Number(ar.system.ward) || 0}</span><span class="g4-mst"></span>`}
    <span class="g4-wc">${ctl}${o.menu === ar.id ? menuHtml(armorMenuModel(ar)) : ""}</span></div>
    ${o.where === "B" ? `<div class="g4-row2"><span>AD ${TWOD12.defenseBase + value} · Ward +${Number(ar.system.ward) || 0}</span></div>` : ""}${detail}</div>`;
}
const qtyHtml = (n, name) => `<span class="g4-qty"><button type="button" data-action="qtyStep" data-d="-1" aria-label="One less ${esc(name)}">&minus;</button><b data-action="qtyType">${n}</b><button type="button" data-action="qtyStep" data-d="1" aria-label="One more ${esc(name)}">+</button></span>`;
function gearRow(g, o) {
  const qn = Number(g.system.quantity) || 0, w = Number(g.system.weight) || 0, c = Number(g.system.cost) || 0, open = isOpen(o, g.id);
  const detail = open ? `<div class="g4-detail"><div class="g4-dl g4-desc">${esc(plain(g.system.description))}</div>
    <div class="g4-dl"><b>Each</b> weight ${w ? fmtN(w) : "—"}, cost ${c ? fmtN(c) : "—"} <i>·</i> <b>All ${qn}</b> weight ${w ? fmtN(w * qn) : "—"}, cost ${c ? fmtN(c * qn) : "—"}</div>
    <div class="g4-dlinks"><a data-action="sendItem">Send to chat</a><a data-action="openItem">Edit</a><a data-action="confirmDelete">Remove</a></div></div>` : "";
  return `<div class="g4-r${open ? " open" : ""}" data-item-id="${g.id}"><div class="g4-row g grow">
    <span class="g4-n"><a class="g4-nm" data-action="toggleItem" role="button" aria-expanded="${open}">${esc(g.name)}</a><span class="g4-sub">${esc(plain(g.system.description))}</span></span>
    ${qtyHtml(qn, g.name)}<span class="g4-wt">${w ? fmtN(w * qn) : "—"}</span></div>${detail}${o.ctx === g.id ? ctxHtml([["pen-to-square", "Edit"], ["scroll", "Send to chat"], ["trash", "Remove"]]) : ""}</div>`;
}
const band = (title, cols, cls, add = "") => `<div class="ps2-band g4-band ${cls}"><b>${title}</b>${cols.map(c => `<span class="g4-c">${c}</span>`).join("")}${add}</div>`;
/** The Inventory tab. o: { where: "A" | "B", links: "A" | "B", open, menu, ctx, combat } */
function inventoryHtml(a, o = {}) {
  const s = a.system, weapons = a.itemTypes.weapon.filter(w => LO.weaponWhere(w) !== "none"), armor = a.itemTypes.armor ?? [], gearItems = a.itemTypes.gear ?? [];
  const weight = fmtN(gearItems.reduce((n, x) => n + (Number(x.system.weight) || 0) * (Number(x.system.quantity) || 0), 0));
  const L = { gen: `<a data-action="generateWeapon" role="button"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Weapon</a>`, browse: `<a data-action="browseItems" role="button"><i class="fa-solid fa-book-open"></i> Browse compendium</a>`, add: `<a data-action="newGear" role="button"><i class="fa-solid fa-plus"></i> New Item</a>` };
  const B = o.where === "B", training = TWOD12.armors[s.armorTraining]?.rank ?? 3;
  const untrained = armor.some(ar => LO.armorWhere(ar) === "worn" && (TWOD12.armors[ar.system.category]?.rank ?? 0) > training);
  const addLine = links => (o.links === "B" ? `<div class="ps2-links g4-addl">${links.join("")}</div>` : "");
  const cols = B ? [["Where"], ["Where"]] : [["Damage", "Mastery", "Where"], ["Defense", "", "Where"]];
  const top = `<div class="g4-top"><span class="g4-coins"><label>Coins <input type="number" min="0" value="${s.coins ?? 0}" aria-label="Coins" data-g4="coins"></label> <i>·</i> Weight <b>${weight}</b></span>${o.links === "B" ? "" : `<span class="ps2-links">${L.gen}${L.browse}${L.add}</span>`}</div>`;
  return `<div class="g4-inv${B ? " optB" : ""}">${top}
    <div class="ps2-sec g4-sec">${band("Weapons", cols[0], "w")}<div class="olist" data-order-flag="itemOrder">${weapons.map(w => weaponRow(a, w, o)).join("") || `<div class="g4-empty">No weapons. Drag one onto the sheet${o.links === "B" ? "" : ", or Generate Weapon"}.</div>`}</div>${addLine([L.gen, L.browse])}</div>
    <div class="ps2-sec g4-sec">${band("Armor", cols[1], "a")}<div class="olist" data-order-flag="itemOrder">${armor.map(ar => armorRow(a, ar, o)).join("") || `<div class="g4-empty">No armor: you are Unarmored (Armor 11). Drag an armor onto the sheet.</div>`}</div>${untrained ? `<div class="g4-warnl">Untrained: all your Rolls Doomed; Actions against your AD and WD Favored.</div>` : ""}${addLine([L.browse])}</div>
    <div class="ps2-sec g4-sec">${band("Gear", ["Qty", "Weight"], "g")}<div class="olist" data-order-flag="itemOrder">${gearItems.map(g => gearRow(g, o)).join("") || `<div class="g4-empty">No gear. Drag items onto the sheet${o.links === "B" ? "" : ", or New Item"}.</div>`}</div>${addLine([L.add, L.browse])}</div>
  </div>`;
}
/** The proposal laid on the sheet: the tab renamed, its content replaced. */
const propose = (a, o) => host => {
  for (const b of host.querySelectorAll(".tabbtn")) if (b.dataset.tabTarget === "items") { b.textContent = "Inventory"; b.dataset.tabTarget = "inventory"; }
  const tab = host.querySelector('.tab[data-tab="items"]');
  if (tab) { tab.dataset.tab = "inventory"; tab.innerHTML = inventoryHtml(a, o); }
};

/* ================================================================== THE PROPOSAL: the NPC's Loot tab */
function lootHtml(a, o = {}) {
  const rows = [...(a.itemTypes.weapon ?? []), ...(a.itemTypes.armor ?? []), ...(a.itemTypes.gear ?? [])].filter(i => !i.system?.traits?.has?.("barehanded"));
  const note = i => (i.type === "gear" ? (Number(i.system.cost) ? `${fmtN(Number(i.system.cost))} each` : "") : `${i.type}, flavor`);
  const row = i => {
    const qn = i.type === "gear" ? (Number(i.system.quantity) || 1) : 1, open = isOpen(o, i.id);
    const detail = open ? `<div class="g4-detail">${plain(i.system.description) ? `<div class="g4-dl g4-desc">${esc(plain(i.system.description))}</div>` : ""}<div class="g4-dlinks"><a data-action="sendItem">Send to chat</a><a data-action="openItem">Edit</a><a data-action="confirmDelete">Remove</a></div></div>` : "";
    return `<div class="g4-r${open ? " open" : ""}" data-item-id="${i.id}"><div class="g4-row l lrow"><span class="g4-n"><a class="g4-nm" data-action="toggleItem" role="button" aria-expanded="${open}">${esc(i.name)}</a><span class="g4-sub">${esc(note(i))}</span></span>
      <span class="g4-lq">${i.type === "gear" ? qtyHtml(qn, i.name) : `<span class="g4-q1">1</span>`}</span><button type="button" class="g4-give${o.give === i.id ? " on" : ""}" data-action="giveLoot">Give…</button></div>${detail}</div>`;
  };
  return `<div class="g4-inv g4-loot"><div class="g4-top"><span></span><span class="ps2-links"><a data-action="browseItems" role="button"><i class="fa-solid fa-book-open"></i> Browse compendium</a><a data-action="newGear" role="button"><i class="fa-solid fa-plus"></i> New Item</a></span></div>
    <div class="g4-note">An NPC's items are flavor and loot: they never change its Health, Defenses or damage.</div>
    <div class="ps2-sec g4-sec">${band("Loot", ["Qty", ""], "l")}<div class="olist" data-order-flag="itemOrder">${rows.map(row).join("") || `<div class="g4-empty">No loot. Drag items onto the sheet, or New Item.</div>`}</div></div></div>`;
}
const proposeLoot = (a, o) => host => { const tab = host.querySelector('.tab[data-tab="loot"]'); if (tab) tab.innerHTML = lootHtml(a, o); };

/* ================================================================== the Give windows and the chat lines */
const pcs = [aveline(), sylwen()];
const pwin = (title, inner, w = 640) => `<div class="mk-win g4-pw" style="width:${w}px"><div class="application twod12 classwin pickwin themed theme-${theme}" style="width:${w}px"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><div class="window-content"><div class="cw">${icons(noTips(inner))}</div></div></div></div>`;
/** Today: NpcSheet.giveLoot → pickwindow.mjs pickOne (a click on a PC gives the whole stack). */
const giveToday = item => pwin(`Give ${item.name}`, PW.pickWindowHtml({ name: `Give ${item.name}`, sub: "to a PC", icon: "fa-hand-holding", sections: [{ title: "", sub: "", rows: [{ key: "one", label: "", opts: pcs.map(x => ({ k: x.id, l: x.name, on: false })) }] }], message: "", confirm: false }));
/** PROPOSED: the same window with How many first (only when the stack is more than 1): pickwindow.mjs pwStepHtml; a click on a PC gives that many. */
const givePropose = (item, n) => pwin(`Give ${item.name}`, PW.pickWindowHtml({ name: `Give ${item.name}`, sub: "to a PC", icon: "fa-hand-holding", sections: [{ title: "", html: `<div class="g4-pwn">${PW.pwStepHtml("n", n, "How many")}<span>of ${Number(item.system.quantity) || 1}</span></div>` }, { title: "", sub: "", rows: [{ key: "one", label: "", opts: pcs.map(x => ({ k: x.id, l: x.name, on: false })) }] }], message: "", confirm: false }));
const chat = html => `<div class="g4-chat themed theme-${theme}">${icons(html)}</div>`;

/* ================================================================== the page */
const shot = (cap, html) => `<div class="g4-shot"><h3>${cap}</h3>${html}</div>`;
const pair = (...s) => `<div class="g4-pair">${s.join("")}</div>`;
const sec = (id, title, notes, body) => `<section class="g4-sec-page" id="${id}"><h2>${title}</h2>${notes.length ? `<ul class="g4-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}${body}</section>`;
const crop = (a, o, h = null, cls = "") => win(a.name, 540, h, sheetHtml(a, { inCombat: true, round: 2, ap: 3 }, { tab: "inventory", swap: propose(a, o) }), `g4-crop ${cls}`);
const SYL_ST = { inCombat: true, round: 2, ap: 3, rap: 1, strikes: 1, hookList: ["Critical"], rungs: { 2: ["Lean and Loose"], 4: ["Steady Draw"] } };

const parts = [
  () => { const a = sylwen(); return sec("p1", "1. Sylwen's Inventory: today and proposed",
    ["<b>Today</b> (left) is the system's own Items tab, as built, with Sylwen's compendium weapons and armor and five gear items and 34 coins added for the mockup. <b>Proposed</b> (right): the same sheet, the same 540 × 840 window.",
      "<b>The tab is named Inventory.</b> Three sections, each a heading on a rule (the Actions tab's headings) with its column words at the right in plain small text: <b>Weapons</b> (Damage · Mastery · Where), <b>Armor</b> (Defense · Where), <b>Gear</b> (Qty · Weight). Every item is one ruled line.",
      "<b>The first line:</b> Coins (typed, as today) and the gear's total Weight on the left; on the right the links, in the NPC's style: <b>Generate Weapon · Browse compendium · New Item</b>. Browse compendium is new (it opens the system's weapon pack, as the NPC's opens its Actions).",
      "<b>A weapon's line:</b> the name, then its damage type and range in muted italics; its three Tiers' damage (Tier 1 / 2 / 3); its Mastery (5 / 10: the Weapon Technique unlocks at 10); <b>where it is</b>, one word on a button (Main hand, Off hand, Both hands, On you, Dropped) that opens a menu (part 3).",
      "<b>A gear line:</b> the name, the start of its description in muted italics, the quantity with − and + (a click on the number types it), the line's weight. Cost, the full description and the item's commands are in the line's detail (part 2).",
      "A click on a name opens the line's detail under it (today it opens the item's window: that is the detail's Edit link now). Rows still drag to reorder; a right-click still opens the menu (Edit, Send to chat, Drop, Remove), now on gear lines too.",
      "<b>What fits:</b> today the window shows the two weapons, the armor and two and a half gear rows; the rest scrolls. Proposed: everything (two weapons, one armor, five gear items) with about 90 px to spare."],
    pair(shot("Today (as built, v0.0.454): the Items tab", win(a.name, 540, 840, sheetHtml(a, SYL_ST))), shot("Proposed: the Inventory tab (Where: A · links: A)", win(a.name, 540, 840, sheetHtml(sylwen(), SYL_ST, { tab: "inventory", swap: propose(a, { where: "A", links: "A" }) }))))); },
  () => { const a = sylwen(), w = a.itemTypes.weapon.find(x => x.name === "Hunting Bow"), r = a.itemTypes.gear.find(x => x.name === "Rations"); return sec("p2", "2. A line opened",
    ["A click on the name opens the item under its line, in the Action card's place on the Actions tab (a tinted panel ending on the bronze rule), and closes it again. Several can be open.",
      "<b>A weapon:</b> its properties as the card's trait words; Range, the damage's pool and type, its Weapon Group; the three Tiers written out; its Mastery and its Weapon Technique (locked or unlocked, by name). Today's sub line and Technique line move here.",
      "<b>Gear:</b> the whole description; weight and cost, each and for the stack. Today's Cost column moves here.",
      "<b>Every opened line ends with three links:</b> Send to chat (today the gear's picture), Edit (today the name, and the pencil), Remove (today the trash icon; it still asks first, in the pick window). None of them is on the line itself: a Remove can't be hit by mistake in play."],
    pair(shot("Proposed: the Hunting Bow and the Rations opened", crop(a, { where: "A", links: "A", open: [w.id, r.id] }, null, "g4-c-tab")))); },
  () => { const a = sylwen(), bow = a.itemTypes.weapon.find(x => x.name === "Hunting Bow"), dag = a.itemTypes.weapon.find(x => x.name === "Dagger"), ar = a.itemTypes.armor[0], st = states(); return sec("p3", "3. Where it is: the menu (option A)",
    ["The Where button opens a small menu under it. <b>A weapon in hand gets the HUD hand tile's own menu</b> (pcsheet.mjs handMenuModel, unchanged): its grip, the weapons it can change to, Stow, Drop, each with its Basic Action and its cost (\"free\" out of combat; struck with its reason when the AP are short). The sheet and the HUD set the hands the same way.",
      "<b>A weapon on you or dropped</b> gets the same menu turned around: draw it into each free hand, or put away the one held and draw it (Interact, 1 AP), then Drop (or Pick up) as today's segment does, at no cost. This needs one small new pure function beside handMenuModel; every row is a key applyHandPick already runs.",
      "<b>Armor:</b> the two other places (Wear it, Take it off, Drop), no cost, as today.",
      "Here: Sylwen in round 2 with 3 AP. The Hunting Bow is in her main hand; the Dagger is on her."],
    pair(shot("The Hunting Bow (in her main hand)", crop(a, { where: "A", links: "A", menu: bow.id }, 560, "g4-c-tab")), shot("The Dagger (on her)", crop(sylwen(), { where: "A", links: "A", menu: sylwen().itemTypes.weapon.find(x => x.name === "Dagger").id }, 560, "g4-c-tab")), shot("The armor", crop(sylwen(), { where: "A", links: "A", menu: sylwen().itemTypes.armor[0].id }, 560, "g4-c-tab")))
    + `<h3 class="g4-h3">Every state a line shows (example rows, not a compendium PC)</h3><ul class="g4-list"><li>A Two-handed weapon held in one hand: the Where button and the warning in the warning ink (today an amber “1H” chip). An Unloaded weapon: “Unloaded” and a <b>Reload</b> link (today a red chip that reloads). A dropped item: its line faded and “Dropped”. An armor beyond the training: “Untrained” on its line and the rule's sentence under the section (today a box).</li><li>The right-click menu, here on a gear line (today only weapon and armor lines have it; the gear lines had the pencil and the trash).</li></ul>`
    + pair(shot("Proposed: the states", crop(st, { where: "A", links: "A" }, null, "g4-c-tab")), shot("Proposed: an empty Gear section (Aveline) and the right-click menu", crop(aveline(), { where: "A", links: "A" }, null, "g4-c-tab") + crop(sylwen(), { where: "A", links: "A", ctx: sylwen().itemTypes.gear.find(x => x.name === "Torch").id }, 330, "g4-c-gear")))); },
  () => { const a = sylwen(); return sec("p4", "4. Choice 1: Where it is, a menu (A) or three words (B)",
    ["<b>A, a word and a menu (recommended).</b> One button a line (pf2e's carry state). It shows where the item is in one word, and the menu says what each move costs and which hand it goes to. It leaves room on the line for the damage and the Mastery. One click more than today to move an item, but every move is the HUD's, with its cost.",
      "<b>B, three words (today's segment, restyled).</b> Dropped · On you · In hand, the current one underlined; one click moves the item, as today, with no cost shown and no choice of hand (the HUD's hand tiles still do grips). The words take about 190 px: the damage and the Mastery go to a second line, so every weapon and armor takes two lines.",
      "Why A: it is shorter (one line an item), it is the HUD's own menu (one way to set the hands, learned once), and it says the cost before the click. B's only gain is the one click."],
    pair(shot("A: a word and a menu", crop(a, { where: "A", links: "A" }, null, "g4-c-tab")), shot("B: three words", crop(sylwen(), { where: "B", links: "A" }, null, "g4-c-tab")))); },
  () => { const a = sylwen(); return sec("p5", "5. Choice 2: the add links, one line (A) or under each section (B)",
    ["<b>A, one line at the top (recommended; the request).</b> Generate Weapon · Browse compendium · New Item, right-aligned as the NPC's Actions tab has them, on the same line as the Coins: no height added.",
      "<b>B, each section its own links</b> (dnd5e and pf2e: an add per section): Weapons ends with Generate Weapon · Browse compendium, Armor with Browse compendium, Gear with New Item · Browse compendium. Clearer about what goes where, but three lines more and three Browse links.",
      "Why A: what Lucas asked for, the NPC's line, and no height. Dragging onto the sheet stays the main way in, and the empty sections say so."],
    pair(shot("A: one line", crop(a, { where: "A", links: "A" }, null, "g4-c-tab")), shot("B: under each section", crop(sylwen(), { where: "A", links: "B" }, null, "g4-c-tab")))); },
  () => { const a = orc(), coins = a.itemTypes.gear.find(x => x.name === "Coins"), ST = { inCombat: true, round: 2, ap: 4 }; return sec("p6", "6. The NPC's Loot tab in the same look",
    ["<b>Today</b> (left): the system's Loot tab, with the Orc Warrior's Cleaver and four items added for the mockup (Hide Armor, 14 Coins, a Bone Charm, 2 Rations). <b>Proposed</b> (right): the same 540 × 760 window.",
      "The Inventory's lines: the name and a muted note (a weapon or armor is “flavor”; gear its cost each), the quantity with − and + (gear only), and one verb, <b>Give…</b>, an outlined button. The note on top is kept, in muted italics under the links. The column heading is the Inventory's (a heading on a rule) in the place of today's grey band of spaced capitals.",
      "<b>Added</b> (each can be dropped): the links <b>Browse compendium · New Item</b> (today the tab has none: items come only by dragging); the line's detail (a click on the name), as on the PC's Inventory.",
      "<b>Removed:</b> the dashed “Drag items here” box (dropping works anywhere on the sheet: the empty list says so in one line)."],
    pair(shot("Today (as built): the Loot tab", win(a.name, 540, 760, sheetHtml(a, ST, { tab: "loot" }))), shot("Proposed: the Loot tab", win(a.name, 540, 760, sheetHtml(orc(), ST, { tab: "loot", swap: proposeLoot(orc(), { give: coins.id }) }))))
    + `<h3 class="g4-h3">Give…: today and proposed</h3><ul class="g4-list"><li><b>Today</b> Give to a PC opens the pick window with the PCs; a click gives the <b>whole stack</b> and posts a line in the chat.</li><li><b>Proposed:</b> the same window and the same click, with <b>How many</b> first when the stack is more than one (the pick window's own − / + stepper, the whole stack by default). The chat line says how many. A weapon or armor given is put away on the PC (on you, carried), as today.</li></ul>`
    + pair(shot("Today: Give Coins", giveToday(coins)), shot("Proposed: Give Coins, 5 of 14", givePropose(coins, 5)))
    + pair(shot("Today: the chat line", chat(MSG.sysLine("fa-hand-holding", `<b>Sylwen</b> takes <b>Coins</b> from Orc Warrior.`))), shot("Proposed: the chat line", chat(MSG.sysLine("fa-hand-holding", `<b>Sylwen</b> takes <b>5 Coins</b> from Orc Warrior (9 left).`))))
    + pair(shot("Proposed: an NPC with no items (example)", win("Orc Warrior", 540, null, sheetHtml(orc(true), ST, { tab: "loot", swap: proposeLoot(orc(true), {}) }), "g4-crop g4-c-tab")), shot("Proposed: a Loot line opened", win("Orc Warrior", 540, null, sheetHtml(orc(), ST, { tab: "loot", swap: proposeLoot(orc(), { open: orc().itemTypes.gear.find(x => x.name === "Bone Charm").id }) }), "g4-crop g4-c-tab")))); }
];
const out = document.getElementById("page");
out.insertAdjacentHTML("beforeend", `<h1>Group 4: the Inventory tab and the NPC's Loot tab</h1><p class="g4-lead">A mockup: nothing in the system changed. Each part shows the sheet <b>as built</b> (v0.0.454: the system's own template and CSS) beside the <b>proposal</b>, at the sheets' real width (540 px). The PCs and NPC are the compendium's; their gear, coins and loot are example data. Where a choice is real there are two options, A and B, the recommended one first.</p>`);
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
document.querySelectorAll(".ps2-combat .ps2-ls").forEach(l => SM.fitList?.(l)); document.querySelectorAll(".ps2-bxn[data-fit]").forEach(n => SM.fitName?.(n));
document.body.dataset.ready = "1";
