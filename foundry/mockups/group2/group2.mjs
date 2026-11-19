// Group 2 of Lucas's notes on v0.0.442 (2026-11-19): hands and dual wielding. A MOCKUP: nothing in foundry/twod12 changed.
// Every "Today" picture is the system's own code and CSS on example data (rolldlg.mjs dialogHtml, pickwindow.mjs pickWindowHtml, the sheet's
// template on ../sheets/model.mjs, hudview.mjs tokenBarHtml, hudmodel.mjs hudPanelHtml). Every "Proposed" picture starts from that same HTML and
// changes it here (proposeDialog, the removed hand buttons, tileMenu), styled by group2.css under .g2-* classes.   index.html?theme=dark|light
import { makeActor, sheetModel, esc, enrichCard } from "../sheets/model.mjs";
import { hudState, todayModel } from "../hud3/model.mjs";
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`);
const { registerInline } = await import("../../twod12/module/inline.mjs");
registerInline();
const RD = await import("../../twod12/module/rolldlg.mjs");
const ACT = await import("../../twod12/module/actions.mjs");
const CL = await import("../../twod12/module/cardlines.mjs");
const CFG = await import("../../twod12/module/config.mjs");
const RS = await import("../../twod12/module/rollsource.mjs");
const LO = await import("../../twod12/module/loadout.mjs");
const WR = await import("../../twod12/module/weaponrange.mjs");
const PW = await import("../../twod12/module/pickwindow.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const HV = await import("../../twod12/module/hudview.mjs");
const HM = await import("../../twod12/module/hudmodel.mjs");
const DL = await import("../../twod12/module/dmglines.mjs"), CD = await import("../../twod12/module/ccdamage.mjs");
const { TWOD12 } = CFG;
const { ICONS } = await import("../npc-hud-icons.mjs");
const icons = html => html.replace(/<i class="fa-(?:solid|regular) fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="fa-x ${rest.trim()}" data-ic="${n}"${attrs}><svg class="ic" viewBox="${ICONS[n][0]}" aria-hidden="true"><path d="${ICONS[n][1]}"/></svg></i>` : m));
const art = html => html.replace(/src="systems\/twod12\//g, 'src="../../twod12/').replace(/src="icons\/svg\/[^"]*"/g, 'src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"');
const noTips = html => html.replace(/\sdata-tooltip="[^"]*"/g, "");   // the page shows no hover text
const parse = html => new DOMParser().parseFromString(`<body>${html}</body>`, "text/html").body;
const data = await (await fetch("../sheets/actors.json")).json();
const gal = await (await fetch("../../gallery/data.json")).json();
document.getElementById("nav").innerHTML = ["dark", "light"].map(t => `<a href="?theme=${t}" class="${t === theme ? "on" : ""}">${t === "dark" ? "Dark" : "Light"}</a>`).join("");

/* ------------------------------------------------------------------ the creatures (stand-ins: see the README) */
// Aveline carries her Longsword, Sylwen's Dagger and the compendium's Arming Sword. over: where each one is.
const DAGGER = data.sylwen.items.find(i => i.name === "Dagger");
const ARMING = { ...Object.values(gal.names).find(x => x.type === "weapon" && x.name === "Arming Sword"), id: "g2ArmingSword" };
const AV_DATA = { ...data.aveline, items: [...data.aveline.items, DAGGER, ARMING] };
const AV_DUAL = { Longsword: { wielded: true, hands: 1, hand: "main" }, Dagger: { wielded: true, hands: 1, hand: "off" }, "Arming Sword": { wielded: false } };
const AV_ONE = { Longsword: { wielded: true, hands: 1, hand: "main" }, Dagger: { wielded: false }, "Arming Sword": { wielded: false } };
const AV_TWO = { Longsword: { wielded: true, hands: 2, hand: "" }, Dagger: { wielded: false }, "Arming Sword": { wielded: false } };
const SY_HANDS = { Dagger: { wielded: true, hand: "off" }, "Hunting Bow": { wielded: true, hand: "main" } };
const orc = makeActor(data.orc);
const handWord = h => (h === "both" ? "both hands" : h === "off" ? "off hand" : "main hand");
const SUBTYPE = { Sl: "Slash", Pi: "Pierce", Bl: "Blunt" };

/* ------------------------------------------------------------------ 1. the roll dialog */
/** The Banes a weapon's hand gives its [Strike, Weapon] Actions, as the dialog's chips (effects.mjs derivedMods "syn:onehand", actions.mjs "syn:hand"). */
function handChips(actor, w) {
  const out = [], chip = (id, label, n) => out.push({ id, fx: id, scope: "shared", row: "banes", kind: "bane", n, label: n > 1 ? `${label} ×${n}` : label, start: "on" });
  if (LO.oneHandedTwoHander(w)) chip("syn:onehand", "Two-handed weapon in one hand", 3);
  const hb = LO.handBanes(actor.itemTypes.weapon, w);
  if (hb.banes) chip("syn:hand", hb.banes === 3 ? "Strung, the other hand full" : hb.banes === 2 ? "Off hand" : "Off hand (Light)", hb.banes);
  return out;
}
/** The roll dialog's input for one weapon (rollinput.mjs rollDialogInput's shape; the Tiers and the card's lines by the system's own code).
 *  squares: how far the target is (weaponrange.mjs decides in hand or thrown). */
async function dlgInput(actor, item, w, { squares = 1 } = {}) {
  const it = item.system, v = it.versions[0], src = RS.rollSource(actor.system, it), freq = CFG.effectiveFrequency(it);
  const use = WR.weaponUse(w, it.traits, actor.system.reach ?? 1, squares);
  const traits = new Set([...it.traits, ...(use.mode ? [use.mode] : [])]);
  const card = await CL.versionCardLines(item, v, { actor, weapon: w, enrich: enrichCard });
  const cardCtx = { item, weapon: w, isWeapon: true, attrMode: src.attrMode, attrVal: src.kind ? (Number(src.mod) || 0) : 0 };
  const mk = await ACT.attackModelParts({ it, item, version: v, weapon: w, cardCtx, fxn: { all: [], t1: [], t2: [], t3: [] }, fxNames: () => "", areaSize: 0, chip: src.chip });
  const ends = WR.rangeEnds(use.range), out = squares > ends.max;
  const dist = use.thrown ? `thrown ${String(use.range).split("/").join(" / ")}` : CFG.distanceText(it, w);
  const shared = [{ id: "syn:nl", scope: "shared", row: "banes", kind: "bane", n: 1, special: "nl", label: "Nonlethal", start: "off" }];
  const own = handChips(actor, w);
  const mine = { name: item.name, flavor: it.flavor ?? "", freqLabel: TWOD12.frequencies[freq] ?? "", freqColor: CFG.FREQ_COLORS[freq] ?? CFG.FREQ_COLORS[""], roll: { name: String(src.chip ?? "").replace(/\s*Modifier$/i, "") || "Modifier", mod: Number(src.mod) || 0 },
    canForce: false, multi: false, rollModes: [["publicroll", "Public Roll"]], rollMode: "publicroll",
    creatures: [{ uuid: "orc", name: "Orc Warrior", img: String(orc.img ?? "").replace(/^systems\/twod12\//, "../../twod12/"), def: "AD", dc: orc.system.armorDC, owned: false }],
    versions: [{ ap: v.ap, cost: `${v.ap} AP`, traits: CFG.orderTraits([...traits]).map(k => ({ key: k, label: TWOD12.traits[k] ?? k, group: CFG.traitGroupOf(k) })),
      meta: { targets: it.targets ?? "", dist, vs: CFG.vsText(it, { src, rolls: true }) }, tiers: mk.outcomes, crit: v.critical ? await enrichCard(v.critical, item) : "", effects: mk.effectsHtml, effectsFrom: 2, noTiers: false, card }] };
  return { w, hand: LO.handOf(actor.itemTypes.weapon, w.id), own, inp: { ...mine, chips: [...own, ...shared] }, shared: { ...mine, chips: shared },
    blocked: out ? `Orc Warrior is ${squares} squares away: its Range is ${use.range}` : "", thrown: use.thrown };
}
const win = (title, inner, cls = "rolldlg", w = 580) => `<div class="mk-win" style="width:${w}px"><div class="application twod12 ${cls} themed theme-${theme}"><header class="window-header"><span class="window-title">${esc(title)}</span><span class="mk-x">&times;</span></header><div class="window-content">${icons(art(noTips(inner)))}</div></div></div>`;
const dialogToday = x => RD.dialogHtml(x.inp, RD.newState(x.inp));
/** Today's "Which weapon?" window (actions.mjs pickWeapon → pickwindow.mjs pickOne). */
const whichWeapon = (actor, list) => PW.pickWindowHtml({ name: "Which weapon?", sub: actor.name, icon: "fa-hand-fist",
  sections: [{ title: "", sub: "Choose the weapon you use.", rows: [{ key: "one", label: "", opts: list.map(x => ({ k: x.w.id, l: `${LO.HAND_LABEL[x.hand]}: ${x.w.name}`, on: false })) }] }], message: "", confirm: false });

/** PROPOSED: one dialog for every held weapon that fits. Each weapon's own dialog is drawn by the system (dialogToday); what is the same in all
 *  of them is written once, what differs goes into one column a weapon (the card's lines, the roll line with the hand's Banes), and the Roll
 *  button becomes one button a weapon under its column. */
function proposeDialog(list) {
  const full = list.map(x => parse(dialogToday(x))), base = parse(RD.dialogHtml(list[0].shared, RD.newState(list[0].shared)));
  const cards = full.map(d => d.querySelector(".rd-card")), card = base.querySelector(".rd-card"), rows = [];
  // the traits: the ones every weapon gives stay on the card's line; the rest (Melee or Ranged, from the weapon) go to the columns
  const words = cards.map(c => [...c.querySelectorAll(".rdc-traits .rd-trait")].map(t => t.textContent)), common = words[0].filter(t => words.every(wd => wd.includes(t)));
  if (words.some(wd => wd.length !== common.length)) {
    for (const t of [...card.querySelectorAll(".rdc-traits .rd-trait")]) if (!common.includes(t.textContent)) { (t.previousElementSibling ?? t.nextElementSibling)?.remove(); t.remove(); }
    rows.push(["Trait", cards.map(c => [...c.querySelectorAll(".rdc-traits .rd-trait")].filter(t => !common.includes(t.textContent)).map(t => t.outerHTML).join(" · "))]);
  }
  const distOf = c => [...c.querySelectorAll(".rdc-gl > span")].find(s => /^Distance/.test(s.textContent));
  rows.push(["Distance", cards.map(c => (distOf(c)?.innerHTML ?? "").replace(/^<b>Distance:<\/b>\s*/, ""))]);
  distOf(card)?.remove();
  const lines = cards.map(c => [...c.querySelectorAll(":scope > .rdc-l")]), mine = [...card.querySelectorAll(":scope > .rdc-l")];
  const tierDiffers = mine.some((l, k) => /\b(t[123]|crit)\b/.test(l.className) && new Set(lines.map(ls => ls[k]?.innerHTML)).size > 1);
  let at = null;
  mine.forEach((l, k) => {
    const tier = /\b(t[123]|crit)\b/.test(l.className), differs = new Set(lines.map(ls => ls[k]?.innerHTML)).size > 1;
    if (!(differs || (tier && tierDiffers))) return;
    rows.push([l.querySelector(":scope > b").innerHTML, lines.map(ls => ls[k]?.querySelector(":scope > span")?.innerHTML ?? "")]);
    if (!at) { at = base.ownerDocument.createElement("div"); l.before(at); }
    l.remove();
  });
  if (!at) { at = base.ownerDocument.createElement("div"); card.append(at); }
  at.outerHTML = `<div class="g2-cmp"><div class="g2-cr g2-ch"><span></span>${list.map(x => `<span><b>${esc(x.w.name)}</b> ${handWord(x.hand)}</span>`).join("")}</div>${rows.map(([l, cells]) => `<div class="g2-cr"><b>${l}</b>${cells.map(c => `<span>${c || "&mdash;"}</span>`).join("")}</div>`).join("")}</div>`;
  // the roll line: one a weapon, with the Banes of its hand under it (the shared Modifiers keep what is true for both)
  const st = RD.newState(list[0].inp);
  base.querySelector(".rd-roll .rd-dice").outerHTML = `<div class="g2-cmp g2-rolls"><div class="g2-cr"><b>Your roll</b>${list.map((x, k) => `<span><span class="rd-dice">${full[k].querySelector(".rd-roll .rd-dice").innerHTML}</span>${x.own.length ? `<span class="rd-chips">${x.own.map(c => RD.chipHtml(c, st)).join("")}</span>` : ""}${x.blocked ? `<span class="g2-why">${esc(x.blocked)}</span>` : ""}</span>`).join("")}</div></div>`;
  // the bar: the Roll mode, then one Roll button a weapon (a weapon out of range is struck, as a Version you can't pay for: a click still rolls)
  const bar = base.querySelector(".rd-bar");
  bar.querySelector(".rd-go").remove();
  bar.classList.add("g2-bar");
  bar.insertAdjacentHTML("beforeend", list.map(x => `<button type="button" class="rd-go${x.blocked ? " g2-cant" : ""}" data-act="roll" data-weapon-id="${esc(x.w.id)}">Roll · ${esc(x.w.name)}${x.thrown ? " (thrown)" : ""}</button>`).join(""));
  return base.innerHTML;
}
/** OPTION B: today's dialog for the main hand's weapon; only the bar changes (each button says its weapon's damage and its hand's Banes). */
function optionB(list) {
  const base = parse(dialogToday(list[0])), bar = base.querySelector(".rd-bar");
  const fact = x => { const [, t2, t3] = LO.tierBoxes(x.w).map(b => b.v), n = x.own.reduce((s, c) => s + c.n, 0); return `${t2} / ${t3} ${SUBTYPE[x.w.system.subtype] ?? ""}${n ? ` · ${n} Bane${n === 1 ? "" : "s"}` : ""}`; };
  bar.querySelector(".rd-go").remove();
  bar.classList.add("g2-barb");
  bar.insertAdjacentHTML("beforeend", list.map(x => `<button type="button" class="rd-go g2-two" data-act="roll"><span>Roll · ${esc(x.w.name)}</span><small>${esc(fact(x))}</small></button>`).join(""));
  [...base.querySelectorAll(".rd-card > .rdc-l")].at(-1).insertAdjacentHTML("afterend", `<div class="g2-shows">The card and the roll line show the ${esc(list[0].w.name)} (${handWord(list[0].hand)}).</div>`);
  return base.innerHTML;
}

/* ------------------------------------------------------------------ 2. the sheet's Action bars (../group1/group1.mjs model and draw, a PC only) */
const tpl = Handlebars.compile(await (await fetch("../../twod12/templates/actor-sheet-pc.hbs")).text());
for (const [k, f] of Object.entries({ eq: (a, b) => a === b, or: (...a) => a.slice(0, -1).some(Boolean), gt: (a, b) => a > b, and: (...a) => a.slice(0, -1).every(Boolean), not: a => !a })) Handlebars.registerHelper(k, f);
Handlebars.registerHelper("formInput", () => "");
function model(a, st) {
  const pc = sheetModel(a, { ...st, dl: DL, cd: CD }), ap = st.ap ?? 4, rap = st.rap ?? 1, escN = Number(a.system.escalation) || 0;
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
  for (const sec of pc.sections) if (["reaction", "granted", "apex"].includes(sec.key)) sec.rows.forEach(r => { r.showFq = true; });
  pc.head.senseWords = pc.strip.senses.map(x => x.label).join(", ");
  pc.head.round = `Round ${st.round ?? 1}`;
  pc.dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(pc.rwLines ?? [], { gm: true }), { line: true });
  return pc;
}
function sheet(a, pc, { cap, noHands = false }) {
  const host = parse(art(tpl({ actor: a, system: a.system, pc, isGM: true, isGMUser: true, missingBasic: false, npcTags: { have: [], add: [] }, notesFields: {}, notesEnriched: {}, gear: [], startMastery: [] })));
  for (const t of host.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === "actions");
  for (const b of host.querySelectorAll(".tabbtn")) b.classList.toggle("active", b.dataset.tabTarget === "actions");
  if (noHands) host.querySelectorAll(".ps2-hb").forEach(x => x.remove());   // the proposal: the stamp opens the dialog, the dialog has the weapons
  return `<div class="g2-shot"><h3>${cap}</h3><div class="g2-clip g2-crop-acts"><div class="mk-win" style="width:540px"><div class="application sheet twod12 twod12-actor themed theme-${theme}" style="width:540px"><header class="window-header"><span class="window-title">${esc(a.name)}</span><span class="mk-x">&times;</span></header><section class="window-content">${icons(noTips(host.innerHTML))}</section></div></div></div></div>`;
}

/* ------------------------------------------------------------------ 3. the HUD's hand tiles */
/** hud.mjs barModel's v0.0.441 parts on ../hud3/model.mjs (as ../hud3/built.mjs does). */
function builtBar(h, { inCombat = true } = {}) {
  const m = todayModel(h), S = h.S;
  const words = { AD: ["ad", "AD"], WD: ["wd", "WD"], Spd: ["speed", "Speed"], Wpn: ["weapon", "Weapon"], Pow: ["power", "Power"] };
  m.defs = m.defs.map(d => (d.gap ? d : d.hud === "attr" ? { ...d, word: h.attrs.find(x => x.short === d.label)?.label } : { ...d, key: words[d.label]?.[0], word: words[d.label]?.[1] }));
  m.h3 = true; m.tab = S.tab ?? "act"; m.conds = [];
  if (!inCombat) m.marks = "";
  m.right = { rx: null, grants: [], cancels: [], prone: null, tiles: h.tiles };
  return m;
}
const hotbar = () => `<div id="hotbar"><ol id="action-bar">${Array.from({ length: 10 }, (_, k) => `<li class="slot"><span class="key">${(k + 1) % 10}</span></li>`).join("")}</ol></div>`;
/** Today's Hands panel (hud.mjs panelRows "hands" → hudmodel.mjs hudPanelHtml). */
function handsPanel(a) {
  const where = { "2h": "in both hands", "1h": "in hand", worn: "worn", stowed: "stowed", dropped: "dropped" };
  return HM.hudPanelHtml("Hands and Gear", [...a.itemTypes.weapon.map(w => ({ button: w.name, hud: "open", data: { item: w.id }, sub: where[LO.weaponWhere(w)] ?? LO.weaponWhere(w) })), { button: "The sheet's Hands", hud: "sheet", data: { tab: "items" }, cls: "out" }]);
}
/**
 * PROPOSED (not in the system: it would replace pcsheet.mjs handMenu for both the sheet's tiles and the HUD's): the menu of one hand tile.
 * { head, hand, warn, groups: [[{ label, act, cost, off, why }]] }. The costs: Regrip 1 AP, Interact 1 AP (draw, stow, or swap: stow and draw
 * in the same Action), Release 0 AP; out of combat "free". A row that can't be done now is struck and says why.
 */
function tileMenu(weapons, hand, { inCombat, ap }) {
  const slots = LO.handSlots(weapons), tile = slots.find(s => s.hand === hand) ?? slots[0], byId = id => weapons.find(x => x.id === id) ?? null;
  const w = tile.id ? byId(tile.id) : null, other = slots.find(s => s !== tile) ?? null, ow = other?.id ? byId(other.id) : null;
  const carried = weapons.filter(x => !LO.usesNoHand(x) && !x.system.wielded);
  const row = (label, act, n, why = "") => { const noAp = inCombat && n > ap ? "No AP left" : ""; return { label, act, cost: inCombat ? `${n} AP` : "free", off: !!(why || noAp), why: why || noAp }; };
  const where = x => (LO.weaponWhere(x) === "dropped" ? " (on the ground)" : "");
  const groups = [];
  if (w) {
    const grip = [];
    if (tile.both) grip.push(row("Hold with one hand", "Release", 0));
    else {
      grip.push(row("Hold with both hands", "Regrip", 1, other?.free ? "" : `Your ${other.hand} hand holds the ${ow.name}.`));
      // the two steps in one click only where both hands matter (a Two-handed weapon), as the sheet's hand button offers today (actor-sheets.mjs useWith)
      if (!other?.free && LO.oneHandedTwoHander(w)) grip.push(row(`Drop the ${ow.name}, then hold with both hands`, "Release, Regrip", 1));
      if (!other?.free) grip.push(row(`Swap hands with the ${ow.name}`, "Regrip", 1));
      else grip.push(row(`Move to your ${other.hand} hand`, "Regrip", 1));
    }
    groups.push(grip);
    if (carried.length) groups.push(carried.map(x => row(`Change to the ${x.name}${where(x)}`, "Interact", 1)));
    groups.push([row("Stow", "Interact", 1), row("Drop", "Release", 0)]);
  } else {
    groups.push(carried.length ? carried.map(x => row(`${LO.weaponWhere(x) === "dropped" ? "Pick up" : "Draw"} the ${x.name}`, "Interact", 1)) : [{ label: "Nothing to draw: no weapon carried.", note: true }]);
    if (ow) groups.push([row(`Hold the ${ow.name} with both hands`, "Regrip", 1)]);
  }
  const strung = w?.system?.traits?.has?.("strung") && ow;
  return { head: w ? w.name : "Free hand", hand: handWord(tile.hand), groups,
    warn: w && LO.oneHandedTwoHander(w) ? "Two-handed, held in one hand: 3 Banes on its Strikes." : strung ? `Strung, and your other hand holds the ${ow.name}: 3 Banes on its Strikes.` : "" };
}
const menuHtml = m => `<div class="g2-hm" role="menu"><div class="g2-hmh"><b>${esc(m.head)}</b> ${esc(m.hand)}</div>${m.warn ? `<div class="g2-hmw">${esc(m.warn)}</div>` : ""}`
  + m.groups.map(g => `<div class="g2-hmg">${g.map(r => (r.note ? `<div class="g2-hmn">${esc(r.label)}</div>` : `<button type="button" role="menuitem" class="g2-hmr${r.off ? " off" : ""}"${r.off ? ' aria-disabled="true"' : ""}><span class="l">${esc(r.label)}</span><span class="c"><small>${esc(r.act)}</small> <b>${esc(r.cost)}</b></span>${r.off ? `<span class="y">${esc(r.why)}</span>` : ""}</button>`)).join("")}</div>`).join("") + "</div>";
/** A strip of the screen's bottom with the HUD on it. menu: the hand whose tile was clicked; crop: only the HUD's right end. */
function scene(items, S, { cap, panel = false, menu = "", crop = false, inCombat = true }) {
  const h = hudState(AV_DATA, { short: "Aveline", over: { system: { escalation: 2 }, items }, rap: 1, strikes: 0, esc: 2, guard: 0, tab: "act", ...S });
  let bar = HV.tokenBarHtml(builtBar(h, { inCombat }));
  bar = bar.replace('<div class="h3-hot"></div>', `<div class="h3-hot">${hotbar()}</div>`);
  const m = menu ? tileMenu(h.a.itemTypes.weapon, menu, { inCombat, ap: S.ap }) : null;
  return `<div class="g2-shot"><h3>${cap}</h3><div class="${crop ? "g2-hcrop" : ""}"><div class="mk-scene"><div class="twod12-hud is-bar with-hot hot-in-bar"${menu ? ` data-menu="${menu}"` : ""}><div class="hud-players"></div><div class="hud-main">${icons(art(noTips(bar)))}</div>${panel ? handsPanel(h.a) : ""}${m ? menuHtml(m) : ""}<div class="hud-ask"></div><div class="hud-hot"></div></div></div></div></div>`;
}
/** Where the menu goes: just above its tile, its left edge on the tile's, moved left to stay 4 px inside the screen (the HUD is at the screen's bottom). */
function placeMenus() {
  for (const root of document.querySelectorAll(".twod12-hud[data-menu]")) {
    const tiles = [...root.querySelectorAll(".h3-hand")], menu = root.querySelector(".g2-hm");
    const tile = tiles.length === 1 ? tiles[0] : tiles[root.dataset.menu === "off" ? 1 : 0];
    if (!tile || !menu) continue;
    tile.classList.add("g2-on"); tile.setAttribute("aria-expanded", "true");
    const r = tile.getBoundingClientRect(), b = root.getBoundingClientRect();
    menu.style.minWidth = `${Math.round(r.width)}px`;
    menu.style.left = `${Math.round(Math.max(4, Math.min(r.left - b.left, b.width - menu.offsetWidth - 4)))}px`;
    menu.style.bottom = `${Math.round(b.bottom - r.top + 4)}px`;
  }
}

/* ------------------------------------------------------------------ the page */
const pair = (...shots) => `<div class="g2-pair">${shots.join("")}</div>`;
const shot = (cap, body, note = "") => `<div class="g2-shot"><h3>${cap}</h3>${body}${note ? `<p class="g2-note">${note}</p>` : ""}</div>`;
const sec = (n, title, quote, notes, body) => `<section class="g2-sec"><h2>${n}. ${title}</h2><p class="g2-q">Lucas: ${quote}</p><ul class="g2-list">${notes.map(x => `<li>${x}</li>`).join("")}</ul>${body}</section>`;
const out = document.getElementById("page");
const parts = [
  async () => {
    const av = makeActor(AV_DATA, { items: AV_DUAL }), wa = av.itemTypes.action.find(i => i.name === "Weapon Attack");
    const held = LO.handSlots(av.itemTypes.weapon).filter(s => s.id).map(s => av.items.get(s.id));
    const near = [], far = [];
    for (const w of held) { near.push(await dlgInput(av, wa, w)); far.push(await dlgInput(av, wa, w, { squares: 4 })); }
    const sy = makeActor(data.sylwen, { items: SY_HANDS }), qs = sy.itemTypes.action.find(i => i.name === "Quick Shots"), bow = sy.itemTypes.weapon.find(w => w.name === "Hunting Bow");
    const one = await dlgInput(sy, qs, bow, { squares: 6 });
    return sec(1, "The roll dialog: one Roll button for each weapon",
      "“We should make the ‘Roll’ button change to ‘Weapon A | Weapon B’ when dual wielding.” · “instead of click -> choose weapon -> roll, it becomes click -> roll”",
      ["Aveline holds her <b>Longsword in the main hand</b> (a Two-handed weapon in one hand) and a <b>Dagger in the off hand</b>, and uses Weapon Attack on an Orc Warrior beside her. Both weapons fit the Action.",
        "<b>Today:</b> the “Which weapon?” window, then the dialog for the weapon chosen. <b>Proposed:</b> the dialog opens at once. What is the same for both weapons is written once. What the weapon changes is written in <b>one column for each weapon</b>: the Distance, the Tiers, the roll line with the Banes of its hand. Under each column, <b>its Roll button</b>.",
        "The shared Modifiers (Boon, Bane, Nonlethal, the target's line) stay as today and count for both buttons. Enter rolls the main hand's weapon.",
        "A weapon that can't reach the target has its button struck and the reason written in its column (a click still rolls, as a struck Version does today).",
        "With one weapon that fits, the dialog is today's, with its single Roll."],
      pair(`<div class="g2-col">${shot("Today, step 1: “Which weapon?”", win("Which weapon?", whichWeapon(av, near), "classwin pickwin"))}${shot("Today, step 2: the dialog of the weapon chosen (the Longsword)", win("Weapon Attack", dialogToday(near[0])))}</div>`,
        shot("Proposed: one dialog, a Roll button for each weapon", win("Weapon Attack", proposeDialog(near))))
      + pair(shot("Proposed, the target 4 squares away: the Longsword can't reach, the Dagger is thrown", win("Weapon Attack", proposeDialog(far)), "The Dagger thrown takes the Ranged trait (the Longsword keeps Melee), so the trait leaves the card's line and goes to the columns."),
        shot("Option B, not the one proposed: the card stays the main hand's", win("Weapon Attack", optionB(near)), "Shorter, but the card and the roll line show one weapon while the other button rolls different numbers. Each button carries its weapon's Tier 2 / Tier 3 damage and its Banes."))
      + pair(shot("One weapon fits (Sylwen, Quick Shots: a Shot, so only the Hunting Bow): today's dialog, unchanged", win("Quick Shots", dialogToday(one)), "She holds the bow and a Dagger: the Dagger doesn't fit a Shot, so there is no second button. The 3 Banes are the Strung bow's, for the Dagger in her other hand.")));
  },
  async () => {
    const av = makeActor(AV_DATA, { system: { escalation: 2 }, items: AV_DUAL }), st = { inCombat: true, round: 2, ap: 4, rap: 1, strikes: 0, hookList: ["Critical", "Kindled Wrath"] }, pc = model(av, st);
    return sec(2, "The Actions tab loses the hand buttons",
      "“Meaning you can likely remove the 1H 1H buttons from the Actions tab.”",
      ["Aveline again, the Longsword and the Dagger in hand. Today Smite and Binding Light (both fit either weapon) end their stamps with <b>two small hand buttons</b>, each reading “1H”.",
        "<b>Removed:</b> those hand buttons, on every bar. The stamp opens the roll dialog, and the dialog has the Roll button for each weapon (part 1).",
        "Nothing else on the bar moves. Thwart Cut (the Longsword's own Technique) never had them."],
      pair(sheet(av, pc, { cap: "Today (v0.0.443)" }), sheet(av, pc, { cap: "Proposed", noHands: true })));
  },
  async () => sec(3, "The HUD's hand tile opens a menu just above itself",
    "“When clicking in the weapon in the token hud, open the window above it, like a ‘reversed dropdown’ menu, instead of all the way to the left. There it should show the weapons you can change it to or if you want to hold with 2h.”",
    ["<b>Today:</b> a click on a hand tile opens the “Hands and Gear” panel at the HUD's left end: a list of the weapons, each opening its item sheet, and a link to the sheet. Nothing in it changes a hand.",
      "<b>Proposed:</b> the tile clicked is filled and its menu opens upward from it, its left edge on the tile's (moved left when it would leave the screen). The first line names the weapon and its hand; a line under it warns when that grip costs Banes.",
      "The rows, in three groups: <b>the grip</b> (hold with both hands, hold with one hand, move to the other hand, swap hands), <b>the weapons that hand can change to</b> (every weapon carried and not in a hand), then <b>Stow</b> and <b>Drop</b>. Each row ends with its Action and its cost; out of combat the cost reads “free”.",
      "A row that can't be done now is <b>struck, with the reason under it</b>. No hover text.",
      "A free hand's menu lists what it can draw, and offers to join the other hand's weapon."],
    pair(scene(AV_DUAL, { ap: 3 }, { cap: "Today: a click on a hand tile opens this panel at the far left", panel: true }))
    + pair(scene(AV_DUAL, { ap: 3 }, { cap: "Proposed: the main hand's tile clicked (Longsword in one hand, Dagger in the other; in combat, 3 AP)", menu: "main" }))
    + `<div class="g2-pair g2-crops">${[
      scene(AV_DUAL, { ap: 3 }, { cap: "The off hand's tile, same state", menu: "off", crop: true }),
      scene(AV_ONE, { ap: 4 }, { cap: "Off hand free, out of combat: the main hand's tile", menu: "main", crop: true, inCombat: false }),
      scene(AV_ONE, { ap: 4 }, { cap: "…and the free hand's tile", menu: "off", crop: true, inCombat: false }),
      scene(AV_TWO, { ap: 0 }, { cap: "Both hands on the Longsword, no AP left", menu: "main", crop: true })].join("")}</div>`)
];
out.insertAdjacentHTML("beforeend", `<h1>Group 2: hands and dual wielding</h1><p class="g2-lead">A mockup: nothing in the system changed. Each part shows today's screen (the system's own code and CSS, v0.0.443) beside the proposal. Aveline's Dagger and Arming Sword are stand-ins put on her for these pictures.</p>`);
// v0.0.444: ?built=1 draws the dialog AS BUILT (the system's rolldlg.mjs with inp.dual, as actions.mjs fills it) at 1 and at 4 squares
if (q.get("built")) {
  parts.length = 0;
  parts.push(async () => {
    const av = makeActor(AV_DATA, { items: AV_DUAL }), wa = av.itemTypes.action.find(i => i.name === "Weapon Attack");
    const held = LO.handSlots(av.itemTypes.weapon).filter(s => s.id).map(s => av.items.get(s.id));
    let html = "";
    for (const sq of [1, 4]) {
      const xs = []; for (const w of held) xs.push(await dlgInput(av, wa, w, { squares: sq }));
      const all = av.itemTypes.weapon;
      const cols = xs.map(x => ({ id: x.w.id, name: x.w.name, hand: (LO.HAND_LABEL[x.hand] ?? "").toLowerCase(), dist: x.inp.versions[0].meta.dist.replace(/^Weapon$/, "1"), thrown: x.thrown, out: x.blocked,
        banes: x.own.map(c => ({ n: c.n, text: c.label })), tiers: { [x.inp.versions[0].ap]: x.inp.versions[0].tiers } }));
      const inp = { ...xs[0].inp, dual: { current: xs[0].w.id, weapons: cols } };
      html += `<div style="margin-bottom:24px">${win(`Roll · Weapon Attack (${sq} sq.)`, RD.dialogHtml(inp, RD.newState(inp)))}</div>`;
    }
    return `<section><h2>As built (v0.0.444)</h2>${html}</section>`;
  });
}
for (const p of parts) { try { out.insertAdjacentHTML("beforeend", await p()); } catch (e) { console.error(e); out.insertAdjacentHTML("beforeend", `<pre class="mk-err">${esc(e.stack ?? e)}</pre>`); } }
await document.fonts.ready;
for (const hl of document.querySelectorAll(".ps2-hooks .ps2-hl")) SM.fitHooks(hl);
placeMenus();
document.body.dataset.ready = "1";
