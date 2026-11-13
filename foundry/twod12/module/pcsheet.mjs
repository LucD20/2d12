// PACK SHEET (v0.0.289, Lucas's approved design: foundry/mockups/sheet-prototype.html): the data of the character sheet's new layout.
// pcModel(sheet, ctx) reads the actor and the context the sheet already built (_sheetModel: granted tickets, conditions, effects, gear) and returns
// the template's `pc` object. The pure rules (sections, Defenses, Save DCs, Down state...) are in sheetmodel.mjs (tests t212).
import { TWOD12, SIZE_NAMES, effectiveFrequency, distanceText, distanceNote, areaText, vsText, isTalentAction, autoChip } from "./config.mjs";
import { combatantOf, getAP, getRAP, slowedOf, apPerTurn, quickenedOf, baseAP } from "./combat.mjs";
import { guardPerAP } from "./guard.mjs";
import { defenseBonus, steadinessOf } from "./defense.mjs";
import { applySpeedMods } from "./speedmods.mjs";
import { atWillUses, strikesUsed } from "./usage.mjs";
import { isEscPassive, passiveThreshold } from "./escblock.mjs";
import { escHooksOf } from "./states.mjs";
import { handSlots, oneHandedTwoHander, weaponWhere, weaponMove } from "./loadout.mjs";
import { masteryRows, masteryValue, groupOf, TECHNIQUE_AT, techniqueState } from "./mastery.mjs";
import { hoverOf, fxTipHtml, tipAttrs, esc, vsKind } from "./util.mjs";
import { durationText } from "./sheet-common.mjs";
import { firstTimeThisEncounter } from "./down.mjs";
import { hoursText } from "./sleep.mjs";
import {
  SHEET_FREQ, SECTION_ORDER, actionSection, vsDefenses, saveDCs, strikesLine, costPill, vsShort, distanceShort, basicUnavailable, nextBanes,
  healthTags, toDown, downState, dominantPool, barSegments, apPips, escRungs, hooksLeft, slotLabel, escSectionRank, slotless, nextLevels, plainEnrichers,
  rowLines, senseChips, strikePips, ELITE_RUNGS, ratingKeys, npcRow, specialAvg, ratingsAverage, downIn, diceFor, dmgModChips
} from "./sheetmodel.mjs";
import { parseDmgMods, SUBS } from "./chatcards.mjs";
import { creatureDamageLines } from "./ccdamage.mjs";
import { damageBlockModel, damageBlockHtml } from "./dmglines.mjs";
import { damageLineName } from "./sheetmodel.mjs";
const F = "twod12";
const sg = v => (v >= 0 ? `+${v}` : `−${Math.abs(v)}`);
const clean = n => String(n ?? "").replace(/\s*\(.*\)\s*$/, "");
const HARM_OK = new Set(["quickened", "hidden", "invisible"]);
const TE = () => foundry.applications.ux.TextEditor.implementation;
const enrich = async (html, doc) => { try { return await TE().enrichHTML(String(html ?? ""), { relativeTo: doc }); } catch (e) { return esc(plainEnrichers(html)); } };

/** The conditions compendium's descriptions by name (a status toggled from the token HUD has none of its own): read once, then cached. */
let condTexts = null;
async function conditionTexts() {
  if (condTexts) return condTexts;
  condTexts = {};
  try {
    const pack = game.packs?.get?.("twod12.conditions");
    const idx = pack ? await pack.getIndex({ fields: ["system.description"] }) : [];
    for (const e of idx) condTexts[String(e.name).toLowerCase()] = e.system?.description ?? "";
  } catch (e) { console.warn("twod12 | the conditions' texts", e); }
  return condTexts;
}


/** The Escalation rung of a Passive: the class section it was picked in ("Escalation 2 Passive"), else its settings / text (escblock.mjs). */
export const passiveRung = (it, cls) => passiveThreshold(it, cls);

/** The model of the hands' tiles and what clicking one can do (Regrip, Release, Interact; the costs on each line). */
export function handTiles(weapons, inCombat) {
  const slots = handSlots(weapons), byId = id => weapons.find(w => w.id === id);
  return slots.map(sl => {
    const w = sl.id ? byId(sl.id) : null, warn = w ? oneHandedTwoHander(w) : false;
    const grip = sl.both ? "2H" : sl.hand === "main" ? "Main" : "Off";
    const name = w ? w.name : "Free (Fists)";
    return { hand: sl.hand, id: sl.id ?? "", name, grip, wide: !!sl.both, free: !!sl.free, warn,
      tip: `${sl.both ? "Both hands" : sl.hand === "main" ? "Main hand" : "Off hand"}: ${name}${warn ? " (a Two-handed weapon in one hand: 3 Banes)" : ""}. Click: Regrip, Release, Draw or Stow${inCombat ? "" : " (free out of combat)"}.` };
  });
}
/** The menu of a hand tile: [{ key, label, cost }]. Out of combat every cost reads "free". */
export function handMenu(weapons, hand, inCombat) {
  const slots = handSlots(weapons), tile = slots.find(s => s.hand === hand), w = tile?.id ? weapons.find(x => x.id === tile.id) : null;
  const cost = n => (inCombat ? `${n} AP` : "free"), out = [];
  if (w) {
    const other = slots.find(s => s !== tile);
    if (tile.both) out.push({ key: `one:${w.id}`, label: `Hold ${w.name} with one hand (Release)`, cost: cost(0) });
    else if (other?.free) {
      out.push({ key: `two:${w.id}`, label: `Hold ${w.name} with both hands (Regrip)`, cost: cost(1) });
      out.push({ key: `move:${w.id}`, label: `Move ${w.name} to the ${other.hand} hand (Regrip)`, cost: cost(1) });
    } else if (other && !other.free) out.push({ key: "swap", label: "Swap hands (Regrip)", cost: cost(1) });
    out.push({ key: `stow:${w.id}`, label: `Stow ${w.name} (Interact)`, cost: cost(1) });
    out.push({ key: `drop:${w.id}`, label: `Drop ${w.name} (Release)`, cost: cost(0) });
  } else {
    for (const x of weapons.filter(v => !v.system?.traits?.has?.("barehanded") && !v.system?.wielded)) {
      const where = weaponWhere(x);
      if (where === "none") continue;
      out.push({ key: `draw:${x.id}:${hand}`, label: `${where === "dropped" ? "Pick up" : "Draw"} ${x.name} (Interact)`, cost: cost(1) });
    }
    if (!out.length) out.push({ key: "", label: "Nothing to draw: no weapon carried", cost: "" });
  }
  return out;
}

export async function pcModel(sheet, ctx) {
  const a = sheet.actor, s = a.system, d = s.damage ?? {}, npc = a.type === "npc";   // v0.0.291 (PACK NPC-SHEET): the NPC sheet uses this model too
  const role = npc ? (TWOD12.npcRoles[s.role] ?? TWOD12.npcRoles.standard) : null, elite = npc && (s.role === "elite" || !!s.useEscalation);
  const basicAtk = npc ? (a.itemTypes.action.find(i => i.system?.basicAttack) ?? null) : null;
  const combat = game.combat, cbt = combatantOf(a, combat), inCombat = !!cbt;
  const statuses = a.statuses ?? new Set(), unconscious = statuses.has("unconscious");
  const cls = a.itemTypes.class[0] ?? null, sp = a.itemTypes.species[0] ?? null;
  const weapons = sheet._weaponsInOrder();
  const favs = a.getFlag(F, "favorites") ?? [], order = a.getFlag(F, "order") ?? [];
  const idx = id => { const k = order.indexOf(id); return k < 0 ? 9999 : k; };
  const none = new Set();

  // ---- header
  const head = {
    npc, role: role?.label ?? "", roleKey: s.role ?? "", cv: npc ? (s.cv ?? role.cv[0]) : "", isGM: !!game.user?.isGM,
    species: sp ? { id: sp.id, name: sp.name } : null, cls: cls ? { id: cls.id, name: cls.name } : null, size: SIZE_NAMES[s.size ?? 3] ?? "",
    combat: !combat ? { mode: "none" } : (!cbt || cbt.initiative === null || cbt.initiative === undefined) ? { mode: "roll" } : { mode: "status", text: combat.started ? `In combat · Round ${combat.round}` : "In combat · not started" }
  };

  // ---- combat strip
  const ap = cbt ? getAP(cbt) : 0, rap = cbt ? getRAP(cbt) : 0, slowed = slowedOf(a), regained = cbt ? apPerTurn(cbt) : 0;
  const pips = apPips(ap, regained, slowed).map((p, k) => ({ ...p, n: k + 1 }));
  const escNow = Number(s.escalation) || 0;
  const passives = a.itemTypes.feature.filter(f => isEscPassive(f, cls));
  const rungNames = { 1: [], 2: [], 3: [] };
  for (const p of passives) rungNames[passiveRung(p, cls)]?.push(p.name);
  const apex = a.itemTypes.action.some(i => Number(i.system?.escalation) > 0);
  const used = a.getFlag(F, "escUsed") ?? {};
  const hookNames = [...new Set(escHooksOf(a).map(h => h.source))];
  const strip = {
    inCombat,
    ap: { pips, rap: !!rap, text: `${ap} of ${regained} · Reaction ${rap ? "ready" : "used"}`, slowedTip: `Lost to Slowed ${slowed} this turn`,
      tip: `${ap} AP left of the ${regained} this turn gave (${baseAP(a)}${quickenedOf(a) ? ` + Quickened ${quickenedOf(a)}` : ""}${slowed ? ` − Slowed ${slowed}` : ""}). Click a pip to correct the AP (the chat says so).` },
    guard: { total: (Number(s.guard) || 0) + (Number(s.apGuard) || 0), per: guardPerAP(s.stage),
      tip: `Guard ${Number(s.guard) || 0}${s.apGuard ? ` + ${s.apGuard} from the AP your last turn kept (taken first, 1 round)` : ""}. It takes damage before your Health, can't be healed and ends with the encounter. Click +1, right-click −1, Ctrl: 5.` },
    esc: { n: escNow, rungs: escRungs(escNow, rungNames, apex), hooks: hooksLeft(hookNames, { crit: !!combat && used.crit === combat.id, hook: !!combat && used.hook === combat.id }).join(" · "),
      momentum: !!combat?.getFlag?.(F, "momentumStart") },
    strikes: strikesLine(strikesUsed(a)),
    // v0.0.291: the Senses cell (both sheets), the NPC's Strikes diamonds and next Bane, the Elite's ladder
    senses: senseChips(s.senses ?? {}), strikePips: strikePips(strikesUsed(a)), strikesLeft: Math.max(0, 3 - strikesUsed(a)),
    nextBane: basicAtk && combat?.started ? nextBanes(atWillUses(a, basicAtk)).replace(/^next: /, "Basic attack: next +") : "",
    elite, eliteRungs: ELITE_RUNGS.map(r => ({ ...r, lit: escNow >= r.n, tip: `${r.tip}${s.eliteLadder !== false ? " Automated (the Builder's Default ladder)." : " By hand: the Builder's Default ladder is off (its entry says otherwise)."}` })),   // v0.0.320
    phases: `Phases: Bloodied +1 ${s.bloodied ? "\u2713" : "not yet"} \u00b7 Strained +1 ${s.strained ? "\u2713" : "not yet"}`
  };
  const hands = { tiles: handTiles(weapons, inCombat) };

  // ---- health
  const down = downState(s, statuses), tags = healthTags(s);
  if (down.down && npc) Object.assign(down, { kind: "", check: "", state: s.lethal > s.nonlethal ? "Dead" : s.nonlethal > s.lethal ? "Unconscious" : "Dead or Unconscious", note: s.zeroState || "" });
  if (down.down) {
    const kind = down.kind, choice = a.getFlag(F, "downChoice");
    down.title = down.state.toUpperCase();
    down.tableRolled = kind && !firstTimeThisEncounter(a.getFlag(F, "downTableCombat"), combat?.id ?? "none", kind) ? `${kind === "dying" ? "Dying" : "Shattered"} Table rolled` : "";
    down.collapseWord = kind === "shattered" ? "Give up" : "Collapse";
    down.keepOff = unconscious ? `Unconscious: you can't wake up while ${down.state}` : (choice === "fighting" ? "You are already fighting on" : "");
    down.collapseOff = unconscious ? "Already Unconscious" : "";
  }
  const dom = dominantPool(s.bodyDamage, s.mindDamage);
  // v0.0.334 (Lucas): the bar's tooltip as a list: Lethal, Nonlethal, then the clicks
  const barTip = (name, l, n, max, note) => `<b>${name}</b> ${l + n} / ${max} · ${note}<br>Lethal: ${l}<br>Nonlethal: ${n}<br>Left click: +1 damage; Ctrl + click: +5 damage<br>Shift + click: nonlethal<br>Right click: remove damage`;
  const health = {
    pool: s.pool, toDown: toDown(s.pool, s.totalDamage), damage: s.totalDamage, down, dominant: dom, domColor: dom === "Resolve" ? "#8fb3ee" : dom === "Vigor" ? "#ef8a80" : "#c9cfda",
    bars: [
      { name: "Vigor", label: "#ef8a80", pool: "body", value: s.bodyDamage, max: s.bdt, tag: tags.bloodied ? "BLOODIED" : "", bg: "#c4453c", solid: "#c4453c", dark: "#7f2a24",
        seg: barSegments(d.bodyLethal, d.bodyNonlethal, s.bdt), tip: barTip("Vigor", d.bodyLethal, d.bodyNonlethal, s.bdt, "Bloodied when full") },
      { name: "Resolve", label: "#8fb3ee", pool: "mind", value: s.mindDamage, max: s.mdt, tag: tags.strained ? "STRAINED" : "", bg: "#3a6fc4", solid: "#5b8ad6", dark: "#3a5f99",
        seg: barSegments(d.mindLethal, d.mindNonlethal, s.mdt), tip: barTip("Resolve", d.mindLethal, d.mindNonlethal, s.mdt, `Strained when full${s.exhausted ? ` (Exhausted ${s.exhausted}: −${4 * s.exhausted})` : ""}`) }
    ]
  };
  const rally = { left: s.rallyLeft, max: s.rallyMax, heal: s.rallyHeal, pips: Array.from({ length: s.rallyMax }, (_, k) => k < s.rallyLeft) };

  // ---- Defenses, Attributes, Movement, Modifiers
  const adNow = (s.armorDC ?? 11) + defenseBonus(a, "armor", none).total, adRef = (s.armorDC ?? 11) + defenseBonus(a, "armor", none, { baseOnly: true }).total;
  const wdNow = (s.wardDC ?? 11) + defenseBonus(a, "ward", none).total, wdRef = (s.wardDC ?? 11) + defenseBonus(a, "ward", none, { baseOnly: true }).total;
  const cmp = (now, ref) => (now > ref ? "up" : now < ref ? "down" : "");
  const vsB = Object.fromEntries(["body", "mind", "appeal", "instinct"].map(k => [k, defenseBonus(a, k, none).total]));
  const vs = vsDefenses(s.attributes, vsB);
  const defs = {
    main: [
      { label: "AD", value: adNow, cls: cmp(adNow, adRef), tip: `Armor Defense: ${(s.armorParts ?? []).join(" ")}${adNow !== s.armorDC ? ` and bonuses (${adNow})` : ""}. Against Weapon Actions and Fists.` },
      { label: "WD", value: wdNow, cls: cmp(wdNow, wdRef), tip: `Ward Defense: ${(s.wardParts ?? []).join(" ")}${wdNow !== s.wardDC ? ` and bonuses (${wdNow})` : ""}. Against Power Actions.` }
    ],
    vs: [["body", "vs Body"], ["mind", "vs Mind"], ["appeal", "vs Appeal"], ["instinct", "vs Inst."]].map(([k, l]) => ({ label: l, value: vs[k], tip: `Vs. ${TWOD12.attributes[k]}: 12 + your ${TWOD12.attributes[k]} (${sg(s.attributes?.[k] ?? 0)})${vsB[k] ? ` ${sg(vsB[k])} bonus` : ""}.` }))
  };
  const attrs = Object.entries(TWOD12.attributes).map(([key, label]) => ({ key, label, value: sg(s.attributes?.[key] ?? 0) }));
  const speedNow = s.moveSpeed ?? s.speed ?? 0, speedRef = s.speed === undefined ? speedNow : applySpeedMods(a, s.speed, { baseOnly: true });
  const steady = steadinessOf(a).total;
  const move = [
    { label: "Speed", value: speedNow, cls: cmp(speedNow, speedRef), tip: `Speed ${speedNow} (from your species and class${speedNow !== speedRef ? `; base ${speedRef}` : ""}${s.exhausted ? `; Exhausted −${s.exhausted}` : ""})` },
    { label: "Reach", value: s.reach ?? 1, tip: "Reach: from your species" },
    { label: "Size", value: s.size ?? 3, tip: `Size ${s.size ?? 3}: ${SIZE_NAMES[s.size ?? 3] ?? ""}` },
    { label: "Steady", value: steady, tip: `Steadiness ${steady}: reduces Forced Movement and Reposition against you (you can choose not to apply it)` }
  ];
  const dcs = saveDCs({ weapon: s.weaponMod, power: s.powerMod, signature: s.signatureMod });
  const L = TWOD12.attributes;
  const usesPower = a.itemTypes.action.some(i => ["magic", "power"].some(t => i.system?.traits?.has?.(t)));
  // v0.0.305 (pack MOD): the Modifiers are class values (a PC) or the role's (an NPC); a class copy from before keeps the Attribute it reads.
  const vals = s.modSource === "class" || s.modSource === "role", whence = npc ? "its role" : "your class";
  const from = k => (vals ? (npc ? "Role" : "Class") : (L[k] ?? "—"));
  const fromTip = k => (vals ? `from ${whence}` : `from ${L[k] ?? "—"}`);
  const has = k => vals || !!k;
  const mods = npc ? [
    { label: "Weapon", attr: from(s.weaponAttribute), value: sg(s.weaponMod), dc: `DC ${dcs.weapon}`, tip: `Weapon Modifier, ${fromTip(s.weaponAttribute)}. Save DC 11 + it (@weapon.dc)` },
    ...(usesPower ? [{ label: "Power", attr: from(s.powerAttribute), value: sg(s.powerMod), dc: `DC ${dcs.power}`, tip: `Power Modifier, ${fromTip(s.powerAttribute)}. Save DC 11 + it (@power.dc)` }] : [])
  ] : [
    { label: "Weapon", attr: from(s.weaponAttribute), value: has(s.weaponAttribute) ? sg(s.weaponMod) : "—", dc: `DC ${dcs.weapon}`, tip: `Weapon Modifier, ${fromTip(s.weaponAttribute)}. Save DC 11 + it (@weapon.dc)` },
    { label: "Power", attr: from(s.powerAttribute), value: has(s.powerAttribute) ? sg(s.powerMod) : "—", dc: `DC ${dcs.power}`, tip: `Power Modifier, ${fromTip(s.powerAttribute)}; Ward Defense adds it. Save DC 11 + it (@power.dc)` },
    { label: "Signature", attr: s.signatureFrom === "power" ? "Power" : "Weapon", value: has(s.signatureAttribute) ? sg(s.signatureMod) : "—", dc: `DC ${dcs.signature}`, tip: `Signature Modifier: the higher of your Weapon and Power Modifiers (${s.signatureFrom === "power" ? "Power" : "Weapon"}). Save DC 11 + it (@signature.dc)` }
  ];

  // ---- Wounds (a named Wound is an effect with the flag twod12.wound: "body" or "mind")
  const namedW = k => [...a.effects].filter(e => e.getFlag?.(F, "wound") === k).map(e => ({ id: e.id, name: clean(e.name) }));
  const wounds = [
    { key: "body", label: "Body Wounds", count: s.bodyWounds ?? 0, named: namedW("body"), table: "dying", tableName: "Dying", check: "Body" },
    { key: "mind", label: "Mind Wounds", count: s.mindWounds ?? 0, named: namedW("mind"), table: "shattered", tableName: "Shattered", check: "Mind" }
  ];

  // ---- the conditions row
  const chips = [];
  if (down.down) chips.push({ label: down.state, cls: "downc", tab: "effects", tipAttrs: tipAttrs(fxTipHtml({ name: down.state, text: down.note })) });
  let slowDone = false;
  for (const e of a.effects) {
    if (e.disabled || e.getFlag?.(F, "wound")) continue;
    const isStatus = !!e.statuses?.size;
    if (e.statuses?.has?.("slowed")) {
      if (slowDone) continue;
      slowDone = true;
      const top = [...a.effects].filter(x => !x.disabled && x.statuses?.has?.("slowed")).sort((x, y) => (Number(y.getFlag(F, "value")) || 1) - (Number(x.getFlag(F, "value")) || 1))[0] ?? e;
      chips.push({ label: `Slowed ${slowed} · regain ${Math.max(0, baseAP(a) + quickenedOf(a) - slowed)} AP`, cls: "harm", effectId: top.id, tipAttrs: tipAttrs(fxTipHtml({ name: `Slowed ${slowed}`, dur: durationText(top), text: "When you regain AP at the start of your turn, you regain that many fewer (Down states add 1, to at most 3).", controls: "Click: open the effect" })) });
      continue;
    }
    if (["dying", "shattered", "desperate"].some(k => e.statuses?.has?.(k)) && down.down) continue;   // the Down chip says it
    const harm = isStatus ? ![...e.statuses].some(k => HARM_OK.has(k)) : !!e.getFlag?.(F, "harmful");
    const dur = durationText(e);
    const val = e.getFlag?.(F, "value");
    const label = isStatus && /exhausted/i.test(e.name) ? `Exhausted ${s.exhausted ?? val ?? 1}` : `${clean(e.name)}${dur ? ` · ${dur}` : ""}`;
    chips.push({ label, cls: harm ? "harm" : "good", effectId: e.id, tipAttrs: tipAttrs(fxTipHtml({ name: e.name, dur: dur || "until removed", text: plainEnrichers(hoverOf(e.getFlag?.(F, "hover"), e.getFlag?.(F, "description") ?? e.description)), controls: "Click: open the effect" })) });
  }
  for (const w of wounds) for (const n of w.named) chips.push({ label: `${n.name} (Wound)`, cls: "harm", effectId: n.id, tipAttrs: tipAttrs(fxTipHtml({ name: n.name, dur: `${w.check} Wound`, controls: "Click: open the effect" })) });
  if (s.armorUntrained) chips.push({ label: "Untrained armor", cls: "harm", tab: "items", tipAttrs: tipAttrs(fxTipHtml({ name: "Untrained armor", text: "All your Rolls are Doomed, and Actions against your AD and WD are Favored." })) });

  // ---- Actions
  const atk = cbt && combat?.started;
  const rowOf = (i, extra = {}) => {
    const r = sheet._actionRow(i), it = i.system, reaction = !!it.reaction;
    const esc = Number(it.escalation) || 0, escLock = esc > 0 && escNow < esc;
    const handsOff = !!r.hands?.length && r.hands.every(h => h.off) && !(it.weaponUse === "fists" || i.getFlag(F, "basic") === "fists");
    const why = unconscious ? "Unconscious: you can't take Actions" : (r.unloaded ? "" : (r.fadedWhy || (escLock ? `Needs Escalation ${esc} (now ${escNow})` : "") || r.noApWhy || (r.strikeCap ? r.strikeWhy : "") || (handsOff ? "No hand holds a weapon this Action can use" : "")));
    const gripOf = h => (h === "both" ? "2H" : "1H"), handWord = h => (h === "both" ? "two hands" : h === "main" ? "main hand" : "off hand");
    let handBtns = r.hands?.map(h => ({ ...h, grip: gripOf(h.hand), tip: h.off ? h.tip : `Use with ${h.name} (${handWord(h.hand)})${h.warn ? ": a Two-handed weapon in one hand, 3 Banes" : ""}` })) ?? null;
    if (!handBtns && r.solo) handBtns = [{ id: r.solo.id, name: r.solo.name, hand: r.solo.hand, grip: gripOf(r.solo.hand), tip: `Use with ${r.solo.name}${r.solo.hand ? ` (${handWord(r.solo.hand)})` : ""}` }];
    const area = areaText(it), dist = distanceText(it, r.weapon) || (reaction && Number(it.momentRange) > 0 ? String(it.momentRange) : "");   // a Reaction with no Distance: its moment's range (Opportunity Attack: 1)
    const sec = extra.section ?? actionSection({ basic: !!i.getFlag(F, "basic"), basicKey: i.getFlag(F, "basic"), reaction, escalation: esc, frequency: effectiveFrequency(it) });
    const fists = it.weaponUse === "fists" || i.getFlag(F, "basic") === "fists";
    const subs = [];
    if (npc && it.basicAttack) { const rr = it.basicRating || "medium"; subs.push(`Basic attack \u00b7 ${TWOD12.npcRatings[rr]?.label ?? rr} \u00b7 ~${npcRow(role, TWOD12.npcRatings, rr, s.stage).basic.join(" / ")}`); if (elite && atk && escNow >= 1) subs.push("+1 Boon on its first attack this round"); }
    if (npc && i.getFlag(F, "basic") === "opportunityAttack" && basicAtk) subs.push(`with ${basicAtk.name}`);
    // v0.0.303 (Lucas): no "back once at Escalation 3" on the row (the Elite Escalation strip says it)
    if (area) subs.push(`Area: ${area}`);
    const aps = (it.versions ?? []).map(v => v.ap), pillTxt = costPill(aps, reaction);
    return {
      id: i.id, name: i.name, sub: subs.join(" \u00b7 "), fav: favs.includes(i.id), section: sec, lines: rowLines({ frequency: effectiveFrequency(it), reaction, strike: !!it.traits?.has?.("strike") || i.getFlag(F, "basic") === "opportunityAttack" }),   // Opportunity Attack makes a Weapon Attack: a Strike
      cost: pillTxt,   // v0.0.298: costPill already writes "AP" (an NPC's read "2 AP AP")
      fc: (SHEET_FREQ[reaction ? "reaction" : sec] ?? SHEET_FREQ[effectiveFrequency(it)] ?? SHEET_FREQ.atwill).color,   // v0.0.302: this line had been joined into the comment above (v0.0.298), so the pills had no color
      dist: area ? (String(it.areaDistance ?? "").trim() ? distanceShort(dist) : "—") : distanceShort(dist), distTip: distanceNote(it, r.weapon), vs: vsShort(vsText(it, { fists })), vsKind: vsKind(vsShort(vsText(it, { fists }))),   // v0.0.314: its color
      off: !!why, offWhy: why, weapon: r.isWeapon && !npc, grip: handBtns?.[0]?.grip ?? "", unloaded: r.unloaded, reaction,
      grant: r.grant ? { tip: r.grant.tip } : null, handBtns: why || npc ? null : handBtns,   // v0.0.291: no Hands for NPCs (a plain Use)
      useTip: r.useTip || `Use ${i.name}`, open: r.open,   // v0.0.302: back out of the comment (lost in v0.0.291)
      // v0.0.302 (Lucas): a Reaction's row carries its Frequency line (Round, Encounter...), as the Basic Actions' buttons do
      basicAtk: !!(npc && it.basicAttack),
      auto: autoChip(it.automation, it.automationNote),   // v0.0.303 (Lucas): the automation diamond beside the name
      // v0.0.370 (Lucas): every row carries its Frequency line (and a dim tint of it), also inside "Once per round"
      freqLine: rowLines({ frequency: effectiveFrequency(it), strike: !!it.traits?.has?.("strike") || i.getFlag(F, "basic") === "opportunityAttack" })
    };
  };
  const actions = a.itemTypes.action.filter(i => techniqueState(a, i) !== "locked");
  const secRows = Object.fromEntries(SECTION_ORDER.map(k => [k, []]));
  for (const i of actions) {
    if (i.getFlag(F, "inlineOf")) continue;   // in the Granted section
    if (i.getFlag(F, "basic") && i.getFlag(F, "basic") !== "opportunityAttack") continue;
    const row = rowOf(i);
    secRows[row.section]?.push(row);
  }
  for (const k of SECTION_ORDER) secRows[k].sort((x, y) => idx(x.id) - idx(y.id) || x.name.localeCompare(y.name));
  // Granted (in combat): the tickets of _sheetModel (grants.mjs and the inline Actions of effects).
  for (const g of ctx.granted ?? []) {
    const it = a.items.get(g.actionId);
    const base = it ? rowOf(it, { section: "granted" }) : { id: "", name: g.name, dist: "—", vs: "" };
    secRows.granted.push({ ...base, sub: `from ${g.source || "an effect"}${g.dur ? ` · ${g.dur}` : ""}${g.inline ? "" : ` · ${g.left} of ${g.count} left`}`,
      cost: g.inline ? String(g.cost ?? "").replace(/\s*AP$/, "") : (g.free ? "0" : String(g.cost).replace(/\s*AP$/, "")), outline: true, fc: "#1b2433",
      off: base.off && !/used|Round|turn/i.test(base.offWhy ?? "") ? base.off : false, handBtns: null,
      grant: { tip: g.tip, effectId: g.effectId ?? "", index: g.grantIndex ?? 0 } });
  }
  const SEC_META = {
    granted: { title: "Granted", sub: "from other effects · gone when spent or expired", dot: "#4a5a78", cls: "granted" },
    apex: { title: "Escalation 3", sub: "in combat only", dot: "#c9821f", cls: "escal" },
    round: { title: SHEET_FREQ.round.label, dot: SHEET_FREQ.round.color }, turn: { title: SHEET_FREQ.turn.label, dot: SHEET_FREQ.turn.color },
    encounter: { title: SHEET_FREQ.encounter.label, dot: SHEET_FREQ.encounter.color }, daily: { title: SHEET_FREQ.daily.label, dot: SHEET_FREQ.daily.color },
    atwill: { title: SHEET_FREQ.atwill.label, dot: SHEET_FREQ.atwill.color }, reaction: { title: SHEET_FREQ.reaction.label, dot: SHEET_FREQ.reaction.color }
  };
  if (npc) { const lv = Math.max(0, ...secRows.apex.map(r => Number(a.items.get(r.id)?.system?.escalation) || 0)); SEC_META.apex = { ...SEC_META.apex, title: `Escalation ${lv || 1}` }; }
  // v0.0.303 (Lucas: "I can't edit the Escalation things from NPCs"): an NPC's Escalation Actions are always listed (out of combat too, and on a non-Elite),
  // so they can be built and edited; a PC's stay in combat only (its Build tab lists them)
  // v0.0.336 (Lucas: "nothing showing the granted actions"): Granted shows out of combat too (v0.0.337: this comment had cut the line's .map off)
  const sections = SECTION_ORDER.filter(k => secRows[k].length && (inCombat || npc || k !== "apex")).map(k => ({ key: k, ...SEC_META[k], rows: secRows[k] }));

  // Basic Actions: the four columns (config basicGroups), each button with its reason when it can't be used.
  const held = weapons.filter(w => w.system?.wielded && !w.system?.traits?.has?.("barehanded"));
  const bctx = {
    freeHand: handSlots(weapons).some(x => x.free), reloadWeapon: held.some(w => w.system?.traits?.has?.("reload")), prone: statuses.has("prone"), immobilized: statuses.has("immobilized"),
    speed: speedNow, reach: s.reach ?? 1, down: down.down || unconscious, rallyLeft: s.rallyLeft, npc
  };
  const basics = actions.filter(i => i.getFlag(F, "basic") && i.getFlag(F, "basic") !== "opportunityAttack");
  const bRow = i => {
    const r = sheet._actionRow(i), key = i.getFlag(F, "basic"), f = effectiveFrequency(i.system);
    const why = basicUnavailable(key, bctx) || (unconscious ? "Unconscious" : "") || r.fadedWhy || r.noApWhy || (r.strikeCap ? "Three Strikes this turn" : "");
    const one = r.hands?.filter(h => !h.off) ?? [];
    const c = costPill((i.system.versions ?? []).map(v => v.ap));
    return { id: i.id, name: i.name, cost: c, fc: f === "round" ? SHEET_FREQ.round.color : SHEET_FREQ.atwill.color, lines: rowLines({ frequency: f, strike: !!i.system?.traits?.has?.("strike"), off: !!why }),
      off: !!why, offWhy: why, next: key === "basicWeaponAttack" && atk ? nextBanes(atWillUses(a, i)) : "", open: r.open,
      weaponId: one.length === 1 ? one[0].id : (r.solo?.id ?? ""), tip: `${i.name}: ${r.useTip || "use it"}` };
  };
  const used2 = new Set();
  // v0.0.291: an NPC has no Weapon Attack, Fists, Reload, Regrip or Release (its Basic attack is its weapon); Charge alone under Attack
  const NPC_HIDE = new Set(["basicWeaponAttack", "fists", "reload", "regrip", "release"]);
  if (npc) for (let k = basics.length - 1; k >= 0; k--) if (NPC_HIDE.has(basics[k].getFlag(F, "basic"))) basics.splice(k, 1);
  const basic = TWOD12.basicGroups.map(g => ({ key: g.key, label: g.label, rows: g.names.map(n => basics.find(i => i.name === n)).filter(Boolean).map(i => { used2.add(i.id); return bRow(i); }) })).filter(g => g.rows.length);
  const restB = basics.filter(i => !used2.has(i.id)).map(bRow);
  if (restB.length) basic.push({ key: "other", label: "Other", rows: restB });

  const favRows = favs.map(id => a.items.get(id)).filter(i => i?.type === "action").map(i => rowOf(i));

  // ---- Effects tab
  const conditions = [], ctexts = await conditionTexts();
  for (const c of ctx.conditions ?? []) {
    const e = c.id ? a.effects.get(c.id) : null;
    if (e?.getFlag?.(F, "wound")) continue;
    const base = String(c.name ?? "").replace(/\s+\d+$/, "").toLowerCase();
    const raw = e ? (e.getFlag?.(F, "description") || e.description || e.getFlag?.(F, "hover") || ctexts[base] || "") : "";
    const text = e ? (await enrich(raw, a)) || esc(plainEnrichers(hoverOf(e.getFlag?.(F, "hover"), ""))) : esc(c.name === "Bloodied" ? "Your Vigor damage is at or past your Vigor. No effect by itself: Actions and features use it." : c.name === "Strained" ? "Your Resolve damage is at or past your Resolve. No effect by itself: Actions and features use it." : "");
    conditions.push({ id: c.id ?? "", name: c.name, img: c.img, initial: c.name[0], text, pill: c.dur || "until removed", tone: "harm", counter: !!c.counter });
  }
  for (const w of wounds) for (const n of w.named) {
    const e = a.effects.get(n.id);
    conditions.push({ id: n.id, name: n.name, img: e?.img, initial: "W", text: await enrich(e?.getFlag?.(F, "description") || e?.description || "", a), pill: `${w.check} Wound`, tone: "harm" });
  }
  const effects = [];
  for (const x of ctx.fx?.effects ?? []) {
    const e = a.effects.get(x.id);
    effects.push({ id: x.id, name: x.name, img: x.img, off: x.off, source: x.source, pill: x.dur, text: await enrich(e?.getFlag?.(F, "description") || e?.description || e?.getFlag?.(F, "hover") || "", a) });
  }

  // ---- Items tab
  const PROPS = ["melee", "ranged", "thrown", "long", "reload", "twohanded", "nonthreatening", "projectile"];
  const weaponRows = (ctx.weaponRows ?? []).map(r => {
    const w = a.items.get(r.id), t = w.system.traits, where = r.where, mv = masteryValue(a, groupOf(w));
    const props = PROPS.filter(p => t.has(p)).map(p => TWOD12.weaponTraits?.[p] ?? p);
    const inHand = where === "1h" || where === "2h";
    return { ...r, sub: [w.system.masteryGroup, props.join(", "), TWOD12.subtypes[w.system.subtype] ?? "", w.system.range ? `Range ${w.system.range}` : ""].filter(Boolean).join(" · "),
      mastery: `${mv} / ${TECHNIQUE_AT}`, techOn: mv >= TECHNIQUE_AT,
      seg: [{ v: "dropped", l: "Dropped", tip: "On the ground", on: where === "dropped" }, { v: "worn", l: "On you", tip: "On you, ready to draw", on: where === "worn" },
        { v: t.has("twohanded") ? "2h" : "1h", l: inHand ? `In hand ${where === "2h" ? "2H" : "1H"}` : "In hand", tip: "In hand (the Hands tiles change the grip)", on: inHand }] };
  });
  const training = TWOD12.armors[s.armorTraining]?.rank ?? 3;
  const armorRows = (ctx.armorRows ?? []).map(r => {
    const ar = a.items.get(r.id), cat = TWOD12.armors[ar.system.category] ?? { value: 0, rank: 0 }, value = (cat.value ?? 0) + (Number(ar.system.bonus) || 0);
    const trained = (cat.rank ?? 0) <= training;
    return { ...r, value, ad: TWOD12.defenseBase + value, ward: `+${Number(ar.system.ward) || 0}`, trained,
      trainText: trained ? `Trained (${TWOD12.armorTrainings[s.armorTraining] ?? ""})` : `Untrained: beyond your ${TWOD12.armorTrainings[s.armorTraining] ?? ""} training` };
  });
  const untrained = s.armorUntrained ? "Untrained: all your Rolls Doomed; Actions against your AD and WD Favored." : "";

  // ---- Build tab
  const levels = cls?.system?.levels ?? [], lv = Math.max(1, Number(s.level) || 1);
  const secInfo = {};
  levels.forEach((l, k) => { if (k + 1 <= lv) for (const x of l.sections ?? []) secInfo[x.id] = { level: k + 1, title: x.title, pick: x.pick, kind: x.kind, granted: x.kind === "items" && x.mode === "granted", order: (l.sections ?? []).indexOf(x) }; });
  const cardsList = [...a.itemTypes.action, ...a.itemTypes.feature, ...a.itemTypes.talent].map(i => ({ id: i.id, name: i.name, kind: i.type, flags: i.flags?.twod12 ?? {}, category: i.system?.category, createdTime: i._stats?.createdTime ?? 0, talentAction: isTalentAction(i) }));
  const bad = slotless(cardsList, secInfo, id => a.items.has(id));
  const badIds = new Set(bad.map(c => c.id));
  const brow = async (it, slot) => {
    const isA = it.type === "action", f = effectiveFrequency(it.system ?? {});
    return { id: it.id, slot, name: it.name, cost: isA ? costPill((it.system.versions ?? []).map(v => v.ap), !!it.system.reaction) : "", fc: (SHEET_FREQ[it.system?.reaction ? "reaction" : f] ?? SHEET_FREQ.atwill).color,
      freq: isA && f ? TWOD12.frequencies[f] : "—", open: !!sheet._open?.has(it.id) };   // v0.0.290 (Lucas): the row opens its card in place (no hover card)
  };
  const placed = new Set(), levelBlocks = [], escRows = [];
  for (let L2 = 1; L2 <= lv; L2++) {
    const rows = [];
    const mine = a.items.filter(i => Number(i.getFlag(F, "classLevel")) === L2 && !badIds.has(i.id) && i.type !== "class")
      .sort((x, y) => (secInfo[x.getFlag(F, "classSection")]?.order ?? 99) - (secInfo[y.getFlag(F, "classSection")]?.order ?? 99));
    for (const it of mine) {
      const sec = secInfo[it.getFlag(F, "classSection")], rank = escSectionRank(sec?.title);
      placed.add(it.id);
      if (rank) escRows.push({ rank, row: await brow(it, rank === 4 ? "Apex" : `Escalation ${rank}`) });
      else rows.push(await brow(it, slotLabel(sec?.title ?? (it.type === "talent" ? "Talent" : "Feature"))));
    }
    if (rows.length) levelBlocks.push({ title: `Level ${L2}`, rows });
  }
  escRows.sort((x, y) => x.rank - y.rank);
  const other = [];
  for (const it of [...a.itemTypes.feature, ...a.itemTypes.talent, ...a.itemTypes.action.filter(isTalentAction)]) {
    if (placed.has(it.id) || badIds.has(it.id)) continue;
    const fl = it.flags?.twod12 ?? {};
    if (fl.featureId || fl.talentId || fl.weaponId || fl.inlineOf || fl.basic) continue;
    if (fl.grantedBy === "class" && fl.classLevel) continue;
    other.push(await brow(it, it.type === "talent" || isTalentAction(it) ? (fl.slot ? "Talent" : "Extra Talent") : fl.grantedBy === "species" ? "Species" : "Feature"));
  }
  for (const c of bad) { const it = a.items.get(c.id); if (it) other.push({ ...(await brow(it, "No slot")), bad: true }); }
  const ssys = sp?.system, hl = s.healthLine ?? {};
  const spChips = sp ? [
    ...(ssys.pickTwo ? [...(ssys.chosen ?? [])].map(k => ({ t: `${L[k]} +1` })) : Object.entries(ssys.attributes ?? {}).filter(([, v]) => v).map(([k, v]) => ({ t: `${L[k]} ${sg(v)}` }))),
    { t: `Vigor ${sg(hl.bonusVigor ?? ssys.bodyMod ?? 0)}`, cls: "v" }, { t: `Resolve ${sg(hl.bonusResolve ?? ssys.mindMod ?? 0)}`, cls: "r" }
  ] : [];
  const csys = cls?.system;
  const chosen = csys ? (csys.chosenAttrs?.length ? csys.chosenAttrs : [csys.chosenA, csys.chosenB]).filter(Boolean) : [];
  const buildCards = [
    ...(sp ? [{ kind: "SPECIES", name: sp.name, choices: "openSpecies", choicesTip: "The Species window: its choices and what it grants", chips: spChips,
      stats: [{ v: ssys.speed, l: "Speed" }, { v: ssys.reach, l: "Reach" }, { v: SIZE_NAMES[ssys.size ?? s.size ?? 3] ?? "", l: "Size" }, { v: Number(ssys.steadiness) || 0, l: "Steady" }] }] : []),
    ...(cls ? [{ kind: "CLASS", name: `${cls.name} ${lv}`, choices: "openClass", choicesTip: "Open the class (its levels, choices and lists)",
      chips: [...chosen.map(k => ({ t: `${L[k]} +1` })), { t: `Vigor ${hl.classVigor ?? 0}`, cls: "v" }, { t: `Resolve ${hl.classResolve ?? 0}`, cls: "r" }],
      stats: [{ v: vals ? sg(s.weaponMod) : (L[s.weaponAttribute] ?? "—"), l: "Weapon" }, { v: vals ? sg(s.powerMod) : (L[s.powerAttribute] ?? "—"), l: "Power" }, { v: csys.rallyMod ?? 0, l: "Rally" }, { v: TWOD12.armorTrainings[s.armorTraining] ?? "—", l: "Armor" }] }] : [])
  ];
  const stNext = TWOD12.stages.find(x => x.n === (Number(s.stage) || 1) + 1);
  const next = cls ? nextLevels(lv, levels, stNext ? { at: stNext.from, n: stNext.n, health: [csys[`stepHigh${stNext.n}`] ?? 0, csys[`stepLow${stNext.n}`] ?? 0], guard: TWOD12.guardPerAp[stNext.n - 1], modifiers: (TWOD12.stageModStep[stNext.n - 1] ?? 0) > 0 } : null) : [];
  const build = {
    banner: bad.length ? { count: bad.length, one: bad.length === 1, names: bad.map(c => c.name).join(" · ") } : null,
    cards: buildCards, levels: levelBlocks, esc: escRows.map(x => x.row), other, next,
    emptySlots: (ctx.talentSlots ?? []).filter(x => !x.talent)
  };

  // ---- Mastery tab
  const mastery = (masteryRows(a) ?? []).map(m => {
    const owned = a.itemTypes.weapon.filter(w => !w.system?.traits?.has?.("barehanded") && groupOf(w).toLowerCase() === m.name.toLowerCase());
    const marks = [[TECHNIQUE_AT, "Technique"], [8, "Expert"], [15, "Master"]].map(([v, t]) => ({ at: Math.round((v / 15) * 1000) / 10, l: `${v} ${t}`, t: `${v}: ${t}` }));
    const nextV = [TECHNIQUE_AT, 8, 15].find(v => v > m.value) ?? 15;
    const one = name => ({ name, value: m.value, next: nextV, pct: Math.min(100, Math.round((m.value / 15) * 1000) / 10), marks, muted: false });
    return { key: m.key, name: m.name, note: "floor: a third of your best Mastery in its Weapon Group (book; by hand for now)", rows: owned.length ? owned.map(w => one(w.name)) : [{ ...one(m.name), muted: true }] };
  });

  // ---- Upkeep tab
  const last = a.getFlag(F, "lastSleep"), now = Number(game.time?.worldTime ?? 0), since = last == null ? null : now - last;
  const lockLeft = since === null ? 0 : Math.max(0, 16 * 3600 - since);
  const nlV = d.bodyNonlethal ?? 0, nlR = d.mindNonlethal ?? 0;
  const upkeep = {
    exhausted: s.exhausted ?? 0, lastSleep: since === null ? "not recorded" : `${hoursText(since)} ago`,
    cards: [
      { k: "breather", name: "Breather", time: "10 minutes", color: "#2c5d9e", text: "Removes all your Nonlethal damage. Not a Rest.", button: "Take a Breather",
        now: `Now: removes ${nlV + nlR}${nlV + nlR ? ` (${[nlV ? "Vigor" : "", nlR ? "Resolve" : ""].filter(Boolean).join(", ")})` : ""}` },
      { k: "sleep", name: "Sleep", time: "8 hours", color: "#5B3FA6", text: "Daily Actions return. Exhausted −2. Once every 16 hours.", button: "Sleep",
        now: lockLeft ? `Available in ${Math.ceil(lockLeft / 3600)} h` : "", nowCls: lockLeft ? "bad" : "", off: lockLeft && !game.user.isGM ? `Available in ${Math.ceil(lockLeft / 3600)} h (once every 16 hours; the GM can still confirm one)` : "" },
      { k: "rest", name: "Rest", time: "24 h, safe place", color: "#4c7a2e", text: "Removes all damage, restores all Rally Points, includes a Sleep, then a Body Check and a Mind Check for Wounds.", button: "Rest" }
    ]
  };

  const tabs = (npc ? [["actions", "Actions"], ["effects", "Effects", conditions.length + effects.length], ["builder", "Builder"], ["loot", "Loot"], ["notes", "GM notes"]]
    : [["actions", "Actions"], ["effects", "Effects", conditions.length + effects.length], ["items", "Items"], ["build", "Build", bad.length], ["mastery", "Mastery"], ["upkeep", "Upkeep"], ["notes", "Notes"]])
    .map(([k, l, n]) => ({ k, l, n: n || 0 }));
  return {
    npc, builder: npc ? npcBuilderModel(a) : null, loot: npc ? lootRows(a) : null,
    head, strip, hands, chips, health, rally, defs, attrs, move, mods, wounds, sections, basic, favRows, tabs, untrained,
    effects: { conditions, effects }, weapons: weaponRows, armor: armorRows, build, mastery, upkeep, down,
    // v0.0.333 (PACK RWI): the Damage block under Defenses (Immune / Resist / Weak, every source; hidden with none, but a GM sees + Add)
    dmgHtml: (() => { try { return damageBlockHtml(damageBlockModel(creatureDamageLines(a), { gm: !!game.user?.isGM })); } catch (e) { console.warn("twod12 | Damage block", e); return ""; } })(),
    modConflict: s.modConflict ? `Both Modifiers wanted the same Attribute: the ${csys?.modPriority === "power" ? "Power" : "Weapon"} Modifier kept it.` : ""
  };
}

/** The hand tiles' menu applied: Regrip (1 AP), Release (0 AP), Interact (1 AP: draw, pick up, stow). Says it in the chat (sysLine). */
export async function applyHandPick(actor, weapons, key, { spendAP, applyRegrip, applyRelease, sysLine }) {
  const [kind, id, hand] = String(key).split(":"), w = id ? actor.items.get(id) : null;
  const say = (icon, html) => ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine(icon, html) });
  if (kind === "one" || kind === "drop") return applyRelease(actor, key);
  if (kind === "two" || kind === "move" || kind === "swap") {
    if (!(await spendAP(actor, 1, "Regrip"))) return false;
    const text = await applyRegrip(actor, weapons, key);
    if (text) await say("fa-hands", `<b>Regrip</b> (1 AP): ${esc(actor.name)} ${text}.`);
    return !!text;
  }
  if ((kind === "stow" || kind === "draw") && w) {
    if (!(await spendAP(actor, 1, "Interact"))) return false;
    if (kind === "stow") { await w.update(weaponMove("worn")); await say("fa-hand", `<b>Interact</b> (1 AP): ${esc(actor.name)} stows <b>${esc(w.name)}</b>.`); return true; }
    const two = w.system?.traits?.has?.("twohanded") && handSlots(weapons).every(x => x.free), was = weaponWhere(w);
    await w.update(weaponMove(two ? "2h" : "1h", two ? "" : (hand === "off" ? "off" : "main")));
    await say("fa-hand", `<b>Interact</b> (1 AP): ${esc(actor.name)} ${was === "dropped" ? "picks up" : "draws"} <b>${esc(w.name)}</b>${two ? " with both hands" : ""}.`);
    return true;
  }
  return false;
}

/* ---------------------------------------------------------------- v0.0.291 (PACK NPC-SHEET): the Builder tab (Lucas's layout F2) and the Loot tab */
/** The book's feature colors (book/rules.css, light page): Body, Mind, Appeal, Instinct; Vigor and Resolve as Body and Mind; AD the Weapon Modifier's, WD the Power Modifier's. */
export const FEATURE_COLORS = { body: "#7a1626", mind: "#17327a", appeal: "#6b4e00", instinct: "#14532d", ad: "#9a4a00", wd: "#5b3a9e", move: "#1b2433" };
export const RATING_COLORS = { terrible: "#6b665a", low: "#8a7a5a", medium: "#1b2433", high: "#8a5a12", extreme: "#a8322d" };
const fmtN = n => String(Math.round(n * 100) / 100);

export function npcBuilderModel(a) {
  const vsWd = a?.getFlag?.("twod12", "nbVs") === "wd";   // v0.0.314: the Attack damage table's Vs. switch (the Builder's own view, nothing else reads it)
  const s = a.system, R = TWOD12.npcRatings, role = TWOD12.npcRoles[s.role] ?? TWOD12.npcRoles.standard, stage = Number(s.stage) || 1;
  const keys = ratingKeys(role, R), rating = k => { const r = s.ratings?.[k] || "medium"; return r === "custom" || keys.includes(r) ? r : keys[keys.length - 1]; };
  const row = (key, name, color, valOf, value) => {
    const cur = rating(key), at = keys.indexOf(cur);
    return { key, name, color, act: "setRating", ratingName: cur === "custom" ? "Custom" : R[cur].label, value,
      steps: keys.map((k, i) => ({ r: k, on: at >= 0 && i <= at, sel: i === at, v: valOf(k), tip: `${R[k].label}: ${valOf(k)}` })) };
  };
  const sg2 = v => (v >= 0 ? `+${v}` : `\u2212${Math.abs(v)}`);
  const attrs = [["body", "Body"], ["mind", "Mind"], ["appeal", "Appeal"], ["instinct", "Instinct"]].map(([k, n]) => row(k, n, FEATURE_COLORS[k], x => sg2(npcRow(role, R, x, stage).attr), sg2(s.attributes?.[k] ?? 0)));
  const health = [["bodyHm", "Vigor", "body", s.bdt], ["mindHm", "Resolve", "mind", s.mdt]].map(([k, n, c, v]) => row(k, n, FEATURE_COLORS[c], x => `\u00d7${fmtN(npcRow(role, R, x, stage).hm)}`, v));
  const defs = [["ad", "Armor Defense", s.armorDC], ["wd", "Ward Defense", s.wardDC]].map(([k, n, v]) => row(k, n, FEATURE_COLORS[k], x => npcRow(role, R, x, stage).def, v));
  // v0.0.307 (Lucas): the Weapon and Power Modifiers as rated rows (the role's table; a rating left at its default shows it).
  const mr = s.modRatings ?? { weapon: "medium", power: "low" };
  const modRow = (key, name, color, cur, value) => {
    const at = keys.indexOf(cur), mv = k => sg2(Math.min(TWOD12.modCap, role.modBy[Math.min(R[k].i, role.modBy.length - 1)]));
    return { key, name, color, act: "setRating", ratingName: R[cur]?.label ?? "", value: sg2(value),
      steps: keys.map((k, i) => ({ r: k, on: at >= 0 && i <= at, sel: i === at, v: mv(k), tip: `${R[k].label}: ${mv(k)}` })) };
  };
  const wmod = modRow("wmod", "Weapon Modifier", FEATURE_COLORS.ad, mr.weapon, Number(s.weaponMod) || 0);
  const pmod = modRow("pmod", "Power Modifier", FEATURE_COLORS.wd, mr.power, Number(s.powerMod) || 0);
  const SPD = ["Slow", "Slow", "Default", "Fast", "Fast"], spNow = Number(s.speed) || 5, stNow = Math.max(0, Number(s.steadiness) || 0);
  const speed = { key: "speed", name: "Speed", color: FEATURE_COLORS.move, act: "setRating", ratingName: SPD[[3, 4, 5, 6, 7].indexOf(spNow)] ?? "Custom", value: spNow,
    steps: [3, 4, 5, 6, 7].map((v, i) => ({ r: String(v), on: v <= spNow, sel: v === spNow, v, tip: `${SPD[i]}: ${v}` })) };
  const steady = { key: "steadiness", name: "Steadiness", color: FEATURE_COLORS.move, act: "setSteadiness", ratingName: stNow === 0 ? "Default" : "", value: stNow,
    steps: [0, 1, 2, 3, 4].map(v => ({ r: String(v), dv: v, on: v <= stNow, sel: v === stNow, v, tip: v === 0 ? "Default: 0" : `${v}` })) };
  // v0.0.308 (Lucas): the Frame (the old Stat block) as rows like the others: Armor type, Reach, Size.
  const ARM = Object.entries(TWOD12.armors), armNow = s.armor || "medium", reachNow = Math.max(1, Number(s.reachBase) || 1), sizeNow = Number(s.size) || 3;
  const frameRow = (key, name, list, now, ratingName, value) => ({ key, name, color: FEATURE_COLORS.move, ratingName, value,
    steps: list.map(([v, lab, tip], i) => ({ r: String(v), on: list.findIndex(x => String(x[0]) === String(now)) >= i, sel: String(v) === String(now), v: lab, tip, small: String(lab).length > 7 })) });   // v0.0.309: "Unarmored" in a smaller font
  const frame = [
    frameRow("armor", "Armor type", ARM.map(([k, a]) => [k, a.label, `${a.label} armor`]), armNow, "", TWOD12.armors[armNow]?.label ?? ""),
    frameRow("reachBase", "Reach", [1, 2, 3, 4].map(v => [v, String(v), `Reach ${v}`]), reachNow, reachNow === 1 ? "Default" : "", reachNow),
    frameRow("size", "Size", [1, 2, 3, 4, 5, 6, 7].map(v => [v, String(v), `${SIZE_NAMES[v]} (${v})`]), sizeNow, SIZE_NAMES[sizeNow] ?? "", sizeNow)
  ];
  // v0.0.308 (Lucas): Resist and Weak as chips; added by damage type and number
  const rw = { chips: dmgModChips(parseDmgMods(s.dmgMods ?? ""), SUBS), types: Object.entries(SUBS).map(([key, v]) => ({ key, label: v[0] })) };
  // the summary: "Down in about" uses the PC damage a turn against a Medium Defense (13) at this Stage (the ruler's numbers, config pcDamageVsDefense)
  const sh = TWOD12.npcRoles.standard.hm, pcDmg = TWOD12.pcDamageVsDefense[13] * (sh[stage - 1][2] / sh[0][2]);
  const pool = (Number(s.bdt) || 0) + (Number(s.mdt) || 0);
  const avg = ratingsAverage(["body", "mind", "appeal", "instinct", "bodyHm", "mindHm", "ad", "wd"].map(rating), R);
  const specials = [["Basic attack", "1 AP \u00b7 At-will", 1], ["Special, 1 AP", "Round \u00b7 \u00d71.4", 1.4], ["Special, 2 AP", "Round \u00b7 \u00d72.2", 2.2], ...(s.role === "minion" ? [] : [["Special, 3 AP", "Encounter \u00b7 \u00d73.5", 3.5]])];
  return {
    roles: Object.entries(TWOD12.npcRoles).map(([k, v]) => ({ key: k, label: v.label, on: (s.role || "standard") === k })),
    level: s.level, stage, cv: s.cv ?? role.cv[0], ap: role.ap, elite: s.role === "elite", escOn: !!s.useEscalation, ladderOn: s.eliteLadder !== false, escAny: true,   // v0.0.303: any role can switch Escalation on (it was the Elite's only)
    summary: [{ k: "Health", v: pool }, { k: "Down in about", v: `${downIn(pool, pcDmg)} PC turns` }, { k: "Should deal", v: `about ${role.deals}` }, { k: "Ratings average", v: avg }],
    cols: [[{ title: "Attributes", rows: attrs, grow: 4 }, { title: "Movement", rows: [speed, steady], grow: 2 }, { title: "Weapon Mod", rows: [wmod], grow: 1 }],
      [{ title: "Health", rows: health, grow: 3 }, { title: "Defenses", rows: defs, grow: 3 }, { title: "Power Mod", rows: [pmod], grow: 1 }]],   // v0.0.307 (Lucas): Weapon under Movement, Power under Defenses
    heads: keys.map(k => ({ label: R[k].label, color: RATING_COLORS[k], med: k === "medium" })),
    // v0.0.308 (Lucas: "more intuitive"): each cell gives the average and the dice to write with this creature's Weapon Modifier ([Mod] taken out),
    // the tooltip the Power Modifier's for a Vs. WD attack
    frame, rw, roleLabel: role.label, modLabel: vsWd ? `Power Modifier (${sg2(Number(s.powerMod) || 0)}), to [R] Resolve` : `Weapon Modifier (${sg2(Number(s.weaponMod) || 0)})`, powerMod: sg2(Number(s.powerMod) || 0),
    // v0.0.314 (pack AU, Vs. WD): the table for a Vs. AD attack (the Weapon Modifier, [V]) or a Vs. WD one (the Power Modifier, [R] by default: the Grave Wisp's)
    vsWd, vsToggle: [{ key: "ad", label: "Vs. AD", sub: "Weapon Mod · [V]", on: !vsWd }, { key: "wd", label: "Vs. WD", sub: "Power Mod · [R]", on: vsWd }],
    attacks: specials.map(([label, sub, x], n) => ({ label, sub, alt: n % 2 === 1, cells: keys.map(k => {
      const avg = specialAvg(npcRow(role, R, k, stage).basic, x), wm = Number(s.weaponMod) || 0, pm = Number(s.powerMod) || 0;
      const dice = m => avg.map(v => { const d = diceFor(v - m); return !d ? `${m}` : /^\d+$/.test(d) ? `${Number(d) + m}` : `${d}+${m}`; }).join(" / ");
      const mine = vsWd ? `[R] ${dice(pm)}` : dice(wm);
      return { v: avg.join(" / "), dice: mine, med: k === "medium", color: RATING_COLORS[k], tip: `${R[k].label} ${label}: average ${avg.join(" / ")} (Tier 2 / Tier 3). Vs. AD, with the Weapon Modifier: [V] ${dice(wm)}. Vs. WD, with the Power Modifier: [R] ${dice(pm)}.` };
    }) }))
  };
}

/** The Loot tab: the NPC's items (flavor and loot). */
export function lootRows(a) {
  return [...(a.itemTypes.weapon ?? []), ...(a.itemTypes.armor ?? []), ...(a.itemTypes.gear ?? [])].filter(i => !i.system?.traits?.has?.("barehanded"))
    .map(i => ({ id: i.id, name: i.name, qty: i.type === "gear" ? (Number(i.system.quantity) || 1) : 1, note: i.type === "gear" ? (i.system.cost ? `${i.system.cost} each` : "") : "flavor" }));
}

/** The "Post stat block" card (GM): name, role, CV, Stage, Health, Defenses, Speed, Senses, each Action in one line. */
export function statBlockHtml(a, sysCard) {
  const s = a.system, chips = senseChips(s.senses ?? {}).map(c => c.label).join(", ");
  let dl = []; try { dl = creatureDamageLines(a); } catch (e) { dl = []; }   // v0.0.333: "Immune Psychic · Resist 3 Blunt · Weak 5 Fire"
  const acts = a.itemTypes.action.filter(i => !i.getFlag(F, "basic") || i.getFlag(F, "basic") === "opportunityAttack").map(i => {
    const f = effectiveFrequency(i.system), cost = costPill((i.system.versions ?? []).map(v => v.ap), !!i.system.reaction);
    const line = plainEnrichers(hoverOf(i.system.hover, i.system.description ?? i.system.versions?.[0]?.effects ?? "")).slice(0, 110);
    return `<b>${esc(i.name)}</b> (${esc(cost)}${f ? `, ${esc(TWOD12.frequencies[f])}` : ""})${line ? `: ${esc(line)}` : ""}`;
  });
  return sysCard({ title: a.name, lead: `${esc(s.roleLabel ?? "")} \u00b7 CV ${esc(s.cv ?? "")} \u00b7 Stage ${esc(s.stage ?? 1)}`,
    text: [`Health ${s.pool} (Vigor ${s.bdt}, Resolve ${s.mdt}) \u00b7 AD ${s.armorDC} \u00b7 WD ${s.wardDC} \u00b7 Speed ${s.moveSpeed ?? s.speed}`, ...(dl.length ? [esc(dl.map(damageLineName).join(" \u00b7 "))] : []), `Senses: ${esc(chips)}`, ...acts].join("<br>") });
}
