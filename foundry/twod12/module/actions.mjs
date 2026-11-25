import { triggerNotices } from "./triggers.mjs";
import { techniqueLock, TECHNIQUE_AT, masteryAfterRoll, techniqueState } from "./mastery.mjs";
import { setQuarry, markWords } from "./mark.mjs";
import { ignoredBy, markOnce, markSpent, coverIgnored, adjustCover } from "./automation.mjs";
import { splitModes, splitView, SPLIT_LABEL, artModes, modeView } from "./split.mjs";
import { ruledDice, isProfaneFor } from "./judge.mjs";   // v0.0.409 (pack F2): Smite's dice, Profane
import { activeHooks, hasTraits, effectiveAp } from "./hooks.mjs";   // v0.0.409 (pack F2): the Paladin's passives
import { sysLine } from "./sysmsg.mjs";
import { canPayEscalation, raiseEscalation } from "./escalation.mjs";
import { weaponUse, weaponRanges } from "./weaponrange.mjs";
import { rollSource, rollTraits, saveDcOf } from "./rollsource.mjs";
import { perceptionOf, perceive, youGain } from "./senses.mjs";
import { parseArea, TWOD12, poolTag, expandAsText, areaButton, isTalentAction, areaConfigOf, autoChip } from "./config.mjs";
import { weaponsFor, hasProp, heldFirst } from "./fists.mjs";
import { handOf, HAND_LABEL, handBanes, weaponWhere, weaponMove } from "./loadout.mjs";
import { isFists } from "./fists.mjs";   // v0.0.412: the hands' Banes
import { isEngaged, engagedWith, engagedWithOther } from "./engaged.mjs";
import { flankingMod } from "./flanking.mjs";
import { offerWake } from "./down.mjs";
import { performCheck, performMultiCheck, multiCheckHtml, collapseNames, uniqueLabels, checkHtml, esc, sgn } from "./roll.mjs";
import { fxTipHtml, hoverOf, tipAttrs } from "./util.mjs";   // v0.0.253: the effects' hover cards
import { effectWhat } from "./fxdetails.mjs";   // v0.0.267: the hover card says what the effect does (its settings)
import { cardVars, cardHead, flavorHtml, apIcon, traitChevrons, categoryText, highlightText, metaRowHtml, effectiveFrequency, distanceText, distanceNote, areaText, cardColorFor, vsText, targetsRowHtml, targetEntries, requirementProblem, doomStatus } from "./config.mjs";
import { collectBonuses, expireOnUse } from "./bonus.mjs";
import { notesFor, useOnceModifiers, resolveModifiers, applyEffects, originInfo, damageSteps, modifierList, applyFeintEffect, applyFeintNoReactions } from "./effects.mjs";
import { spendAP, combatantOf } from "./combat.mjs";
import { computeDC } from "./defense.mjs";
import { markUsed, activeGrants, atWillUses, grantMatches, demoralizedTarget, markDemoralized } from "./usage.mjs";   // (markAtWill: imported where used)
import { tierProbs, topStep, bbCount, bbResolve } from "./calc.mjs";
import { ENGAGED_RANGED_DOOMED, ENGAGED_RANGED_BANES, THROWN_LESS, escalationDie } from "./roundrules.mjs";   // v0.0.407: the Doomed shot while Engaged; v0.0.510: escalationDie (Steady Draw's dE)
import { weaponDiceFormula, weaponDieOnlyFormula, bookRoll, diceOfRoll, empoweredNow, markEmpoweredUsed, empoweredComponent, minorNpc } from "./explode.mjs";   // v0.0.407: exploding dice, the Empowered die; core rework batch 3: [D]
import { squaresBetween, rangeBand } from "./move.mjs";
import { setupFor } from "./setup.mjs";
import { coverBetween, coverWhy } from "./cover.mjs";
import { reactionsOff } from "./condrules.mjs";   // v0.0.314 (pack AU): Staggered
import { consumeGrant, attachGrantCard, withGrantLine } from "./freeuse.mjs";
import { zoneOf } from "./zone.mjs";   // v0.0.261 (Consecrated Ground): the zone a Version's effects describe goes on the placed area
import { setHalfHint, halfHits } from "./halfhint.mjs";   // v0.0.261 (Covering Shot): on a Tier 3, the target's next damage card lights its Half button
import { updateOdds, applyTalentMods, tierLines, liveAvg } from "./preview.mjs";
const { DialogV2 } = foundry.applications.api;
import { ensureFreeHand } from "./hands.mjs";
import * as CC from "./chatcards.mjs";   // v0.0.283 (pack chat-cards)
import { attrFromTier } from "./rollsource.mjs";

/** v0.0.181 (P1, Smite): a Weapon Action adds the Modifier it rolls to its damage on Tier 2 or 3: a Weapon roll, or a [Signature, Weapon] Action's Signature roll. */
const modOnWeapon = (src, traits) => src?.kind === "weapon" || (src?.kind === "signature" && !!traits?.has?.("weapon"));

/** Pure (v0.0.494, Playtest 8 Pass 1; book, Chapter 3 Cover): Cover Banes / High Cover Doomed apply to [Strike] and [Area] Actions only (Line of Effect still applies to every Action). */
export function coverBanesApply(item, useTraits = new Set()) {
  const has = t => !!(useTraits?.has?.(t) || (Array.isArray(useTraits) && useTraits.includes(t)) || item?.system?.traits?.has?.(t) || (Array.isArray(item?.system?.traits) && item.system.traits.includes(t)));
  return has("strike") || has("area");
}

/** Pure (v0.0.498, Pass 3): when an Attack Action's Effects line grants you an Evade (`You @Move[evade|...]`, e.g. Quick Shots, Darting Blade, Volley), return the tag payload to start it automatically right after the roll. */
export function autoEffectEvadeTag(version) {
  if (!version || version.noTiers) return "";
  const m = String(version.effects ?? "").match(/(?:^|[.;,]\s*)You\s+@Move\[(evade\|[^\]]*)\]/i);
  return m ? m[1] : "";
}

/** Pure (v0.0.512, playtest 7: "Slip Away's Evade 1 then Advance 2 should run by themselves"): a no-roll Reaction whose Effect is only your own movements
 *  ("You @Move[evade|...], then @Move[advance|...]."): their tags in order, [] for anything else (a roll, another button, someone else moved). */
export function autoMoveChain(version, reaction = false) {
  if (!reaction || !version?.noTiers) return [];
  const txt = String(version.effects ?? "").trim();
  if (!/^You\s+@Move\[/i.test(txt) || /@(?!Move\[)\w+\[/.test(txt)) return [];
  const tags = [...txt.matchAll(/@Move\[([^\]]+)\]/g)].map(m => m[1]);
  return tags.every(t => ["evade", "advance"].includes(t.split("|")[0].trim().toLowerCase())) ? tags : [];
}
/** Text form of a damage instance, e.g. "[V] 1[W] + 1d4 H" (v0.0.234: the pool B / M written [V] / [R]). */
export function instanceText(i) {
  const parts = [];
  if (i.useW) parts.push(`${i.wCount}[W]${i.subtype && !i.dice && !i.useAt ? ` ${i.subtype}` : ""}`);   // pack TALENTS-PT: a [W] with its own type (Rime Strike: "1[W] Co")
  if (i.useD) parts.push(`${i.dCount}[D]${i.subtype && !i.dice && !i.useAt ? ` ${i.subtype}` : ""}`);   // core rework batch 3: [D]
  const rest = [];
  if (i.dice) rest.push(i.dice);
  if (i.useAt) rest.push("[Mod]");
  if (rest.length) parts.push(rest.join(" + ") + (i.subtype ? ` ${i.subtype}` : ""));
  let t = parts.join(" + ");
  if (t && i.pool) t = `[${poolTag(i.pool)}] ${t}`;
  return t;
}

export const enrich = async (txt, doc = null) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));

export function versionRow(v) {
  return { ap: v.ap, effects: v.effects, tiers: ["t1", "t2", "t3"].map((k, i) => [...v[k].map(instanceText), v[`x${i + 1}`]].filter(Boolean).join(" & ") || "-") };
}
export const targetLine = ts => `<div class="tline">${ts.length ? `<i class="fa-solid fa-crosshairs"></i> ${esc(ts.map(t => t.name).join(", "))}` : ""}</div>`;
const traitsHtml = t => traitChevrons(t, { compact: true });   // v0.0.180: the chat card shows tight chips (D0, option E)

// v0.0.407 (Stage 0 in Foundry; book, Chapter 15): a weapon's die explodes (explode.mjs: written with !); 2[W] is two instances, the flat part twice
const weaponFormula = (d, n) => weaponDiceFormula(d, n);

/** The step of a stored flag: Empowered N (positive) or Enfeebled N (negative). Older cards stored true for Empowered. */
export const stepOf = v => (v === true ? 1 : Math.trunc(Number(v)) || 0);

// v0.0.407 (Stage 0 in Foundry): a die written with ! explodes (explode.mjs); Empowered no longer adds to every die (the step is ignored here: rollDamage adds its 1d6!)
async function evalFormula(formula, rolls) {
  if (!formula) return { total: 0, dice: [], shown: "0" };
  const r = await bookRoll(formula).evaluate();
  rolls.push(r);
  return { total: r.total, dice: diceOfRoll(r), emp: 0, shown: formula };
}

export async function resolveInstance(inst, ctx) {
  const comps = [];
  if (inst.useW && ctx.weapon) {
    const d0 = ctx.weapon.system.damage[`t${ctx.tier}`];
    const d = d0 && ctx.thrown && ctx.tier >= 2 ? { ...d0, mod: (Number(d0.mod) || 0) - THROWN_LESS } : d0;   // v0.0.407: a Thrown weapon thrown, 1 less a [W]
    const f = d ? weaponFormula(d, inst.wCount) : null;
    const res = await evalFormula(f, ctx.rolls, ctx.empowered);
    comps.push({ kind: "W", formula: f ? res.shown : "0", total: res.total, dice: res.dice, emp: res.emp ?? 0, src: ctx.weapon.name, sub: ctx.weapon.system.subtype ?? "" });
  }
  if (inst.useD && ctx.weapon) {
    const d0 = ctx.weapon.system.damage[`t${ctx.tier}`];
    const f = d0 ? weaponDieOnlyFormula(d0, inst.dCount) : null;
    const res = await evalFormula(f, ctx.rolls, ctx.empowered);
    comps.push({ kind: "D", formula: f ? res.shown : "0", total: res.total, dice: res.dice, emp: res.emp ?? 0, src: ctx.weapon.name, sub: ctx.weapon.system.subtype ?? "" });
  }
  if (inst.dice || inst.useAt) {
    // v0.0.409 (pack F2): a Version's dice rule (Smite's dice by Escalation, d8s against a Profane creature: judge.mjs ruledDice); not a bonus's dice
    const dice = ctx.diceRule && inst.dice && !inst.source ? ruledDice(inst.dice, ctx.diceRule, ctx.ruleCtx ?? {}) : inst.dice;
    const f = [dice, inst.useAt ? String(ctx.attrVal) : ""].filter(Boolean).join(" + ");
    const res = await evalFormula(f, ctx.rolls, ctx.empowered);
    // v0.0.321 (Lucas: Smite's "[W] + 2 Sl" didn't count as Slash): a written [Mod] (or untyped Vigor dice on a Weapon Action like Basic Attack T1) takes the weapon's subtype
    const bareWeaponDie = !inst.subtype && !inst.useW && !inst.useD && !inst.useAt && (inst.pool || "B") !== "M";
    comps.push({ kind: "D", formula: res.shown, total: res.total, dice: res.dice, emp: res.emp ?? 0, sub: inst.subtype || (inst.useW || inst.useD || (inst.useAt && !inst.dice) ? (ctx.weapon?.system?.subtype ?? "") : bareWeaponDie ? (ctx.weapon?.system?.subtype ?? "") : ""), ...(bareWeaponDie && ctx.weapon ? { src: ctx.weapon.name } : {}), ...(!inst.dice && inst.useAt ? { label: "Modifier" } : {}) });   // v0.0.326: a written [Mod] is named on the card
  }
  return { inst, comps };
}

/** Is it another creature's turn in a combat that has started? */
export function isOutOfTurn(actor) {
  const combat = game.combat;
  if (!combat?.started) return false;
  const me = combatantOf(actor);
  return !!me && combat.combatant?.id !== me.id;
}

/** Talents that modify this Action right now (see "Modifies other Actions" on the Talent). */
export function talentModsFor(actor, item) {
  const out = isOutOfTurn(actor);
  return [...(actor.itemTypes?.talent ?? []), ...(actor.itemTypes?.action ?? []).filter(isTalentAction)].flatMap(t => (t.system.modifiers ?? []).filter(m => m.spec && grantMatches(m.spec, item) && (m.when === "always" || out)).map(m => ({ ...m, talent: t.name })));
}

async function pickWeapon(actor, item, candidates = null, chosenId = "") {
  const linked = item.getFlag("twod12", "weaponId");
  if (linked) return actor.items.get(linked) ?? null;
  // v0.0.208 (W): a hand button of the sheet chose the weapon; a held weapon comes before the Fists (the Fists Action uses them).
  const wielded = heldFirst(candidates ?? weaponsFor(actor, item));
  const chosen = chosenId ? wielded.find(w => w.id === chosenId) : null;
  if (chosen) return chosen;
  if (wielded.length === 1) return wielded[0];
  if (!wielded.length) { ui.notifications.warn("No wielded weapon: [W] damage will be 0."); return null; }
  const all = actor.itemTypes?.weapon ?? [];
  // v0.0.415 (pack CL): the pick window (was a DialogV2)
  const { pickOne } = await import("./pickwindow.mjs");
  const id = await pickOne({ title: "Which weapon?", name: "Which weapon?", sub: actor.name, icon: "fa-hand-fist", text: "Choose the weapon you use.",
    options: wielded.map(w => { const h = HAND_LABEL[handOf(all, w.id)]; return { k: w.id, l: `${h ? `${h}: ` : ""}${w.name}` }; }) });
  return id ? actor.items.get(id) : null;
}

const showOdds = () => { try { return game.settings.get("twod12", "designerMode") === true; } catch (e) { return false; } };   // v0.0.283: the odds only in Designer mode
/** For testing: the chances of each tier for the roll that was just made (with its boons, banes and Favored / Doomed). */
const oddsText = chk => {
  // v0.0.301 (PACK BB): the roll's own count (after the limits and the five) and its state
  const p = tierProbs(chk.mod + chk.adj + (chk.bo ?? 0) - (chk.ba ?? 0), chk.dc, 0, 0, chk.state ?? "");
  const pct = x => `${Math.round(x * 100)}%`;
  return { p, text: `T1 ${pct(p[0])} \u00b7 T2 ${pct(p[1])} \u00b7 T3 ${pct(p[2])}`, html: `T1 ${pct(p[0])} &middot; T2 ${pct(p[1])} &middot; <b>T3 ${pct(p[2])}</b>` };
};
const oddsRow = chk => `<div class="oddsrow">Odds: ${oddsText(chk).html}</div>`;
/**
 * v0.0.195: the @Move inside a movement-only Action's text (Advance, Evade, Crawl): a version with no roll and no effect to apply, one @Move of
 * the creature's own movement (advance or evade) and no other button, on a [Move] Action or Evade. null for anything else (Charge, Vanish...).
 */
export function pureMove(it, version, basicKey = "") {
  if (!version?.noTiers || (version.fx?.all ?? []).length) return null;
  const txt = String(version.effects ?? ""), moves = [...txt.matchAll(/@Move\[([^\]]+)\]/g)];
  if (moves.length !== 1 || /@(?!Move\[)\w+\[/.test(txt)) return null;
  if (!["advance", "walk", "move", "evade"].includes(moves[0][1].split("|")[0].trim().toLowerCase())) return null;
  // v0.0.508 (Lucas on v0.0.507: "Tumble didnt send the message to the chat, just asked to move the token, so no check happened"): a movement that
  // passes enemies (Tumble) needs its Check first, so it posts its card (the Check buttons, then the Move button) like any other Action
  if (/\|\s*pass\s*:/.test(moves[0][1])) return null;
  const traits = it?.traits;
  if (!(traits?.has?.("move") || (Array.isArray(traits) && traits.includes("move")) || basicKey === "safeMovement")) return null;
  return moves[0][1];
}
/** v0.0.189: the name of what a bonus comes from, as a link that opens it (Foundry's content links); plain text when it has no item. */
export const srcLink = (name, uuid) => (uuid ? `<a class="content-link" draggable="true" data-link data-uuid="${esc(uuid)}">${esc(name)}</a>` : esc(name));
/** Does this tier need a Damage button? attrFrom: the lowest Tier on which the Attribute is added (0: never; true: Weapon, from Tier 2). */
const needsDamage = (attrFrom, tier, insts, fx) => { const from = attrFrom === true ? 2 : Number(attrFrom) || 0; return tier > 0 && (insts.some(i => i.useW || i.useD || i.dice || i.useAt) || (from > 0 && tier >= from) || fx.length > 0); };

/* ---- v0.0.283 (pack chat-cards): the pieces of the new attack card's model (chatcards.mjs draws it) ---- */
/** The modifiers kept for a retarget (the same for every target): the dialog's own effects, the Engaged banes on you, a granted use's. */
// v0.0.426 (the audit: a retarget dropped them): the hands' Banes, the At-will Bane, a two-handed weapon in one hand and the Strike hooks' Boons are yours too
const CC_GENERAL = id => !id.includes("|") && (!id.startsWith("syn:") || ["syn:engaged", "syn:granted", "syn:nlswitch", "syn:hand", "syn:atwill", "syn:onehand"].includes(id) || id.startsWith("syn:hook:"));
/** A distance on the card: a number of squares has "sq." (brief 4.1). */
export const sqText = d => (/^\d+$/.test(String(d ?? "").trim()) ? `${String(d).trim()} sq.` : String(d ?? "").replace(/(\d+)\s*(?:squares?|sq\.?)?$/i, (m, n) => `${n} sq.`));
/** One creature's row of the card from a check. */
export function ccRowOf(c, name, uuid, chip = "") {
  return {
    name, uuid, total: c.total, dc: c.dc, dcLabel: c.dcLabel ?? "DC", tier: c.tier, base: c.base ?? c.tier, crit: !!c.crit, doubles: !!c.doubles, state: c.state ?? "", forced: !!c.forced, triple: !!c.triple, five: c.five ?? "",
    d1: c.d1, d2: c.d2, dropped: c.dropped ?? null, boonFaces: c.boonFaces ?? [], baneFaces: c.baneFaces ?? [], sources: (c.sources ?? []).map(x => ({ name: x.name, boons: x.boons ?? 0, banes: x.banes ?? 0, bb: x.bb ?? "" })),
    boons: (c.boonFaces ?? []).length, banes: (c.baneFaces ?? []).length,
    mods: [{ v: Number(c.mod) || 0, label: String(chip ?? "").replace(/\s*Modifier$/i, "") || "Modifier" }, { v: Number(c.adj) || 0, label: c.adjLabel || "Situational" }]
  };
}
/** The outcome lines of each Tier, the effect text, the target line's distance and area. */
export async function attackModelParts({ it, item, version, weapon, cardCtx, fxn, fxNames, areaSize, chip, ruleCtx = null, extraT3 = [] }) {
  const { weaponText, weaponDieText } = await import("./preview.mjs");
  const wsub = weapon?.system?.subtype ?? "";
  const outcomeFor = (n, bon = []) => {
    const insts = [...(version[`t${n}`] ?? []), ...(n === 3 ? (extraT3 ?? []) : [])], parts = [];
    for (const i of insts) {
      if (i.useW) parts.push({ pool: i.pool || "B", t: weapon ? weaponText(weapon, n, i.wCount) : `${i.wCount}[W]`, sub: wsub, _w: true });
      if (i.useD) parts.push({ pool: i.pool || "B", t: weapon ? weaponDieText(weapon, n, i.dCount) : `${i.dCount}[D]`, sub: wsub, _w: true });
      // v0.0.440 (Lucas, checklist: Smite's roll dialog "only shows 1d6 / 2d6"): the dice under the Version's dice rule, as the roll will make them
      if (i.dice) parts.push({ pool: i.pool || "B", t: ruleCtx && version.diceRule && !i.source ? ruledDice(i.dice, version.diceRule, ruleCtx) : i.dice, sub: i.subtype || (weapon && (i.pool || "B") !== "M" ? wsub : "") });
      if (i.useAt) parts.push({ pool: i.pool || "B", t: String(cardCtx.attrVal), sub: i.subtype || (weapon && (i.pool || "B") !== "M" ? wsub : "") });
    }
    // [Mod] on the Tiers that add it (a Weapon Action from Tier 2), with the weapon's damage and subtype (Ch. 1)
    if (n >= attrFromTier(cardCtx) && insts.length && !insts.some(i => i.useAt)) {
      const w = insts.find(i => i.useW || i.useD) ?? insts[0], wp = w.pool || "B";
      const lastW = parts.reduce((acc, p, idx) => (p._w && p.pool === wp ? idx + 1 : acc), 0);
      const at = lastW || (parts.findIndex(p => p.pool === wp) + 1);
      parts.splice(at > 0 ? at : parts.length, 0, { pool: wp, t: String(cardCtx.attrVal), sub: w.useW || w.useD ? wsub : (w.subtype ?? "") });
    }
    for (const p of parts) delete p._w;
    for (const b of bon) if (b.dmg) parts.push({ pool: b.pool || "B", t: b.dmg, sub: b.sub === "W" ? wsub : (b.sub ?? "") });   // v0.0.345: "W" = the weapon's subtype (Marked Quarry)
    const riders = [];
    const x = expandAsText(version[`x${n}`], item.system.versions, version, n);
    if (String(x ?? "").trim()) riders.push(String(x).trim());
    for (const b of bon) if (b.text) riders.push(esc(b.text));
    if (fxn[`t${n}`]?.length) riders.push(fxNames(fxn[`t${n}`]));
    return { parts, riders };
  };
  const outcomes = {};
  for (const n of [1, 2, 3]) {
    const o = outcomeFor(n);
    o.riders = await Promise.all(o.riders.map(async r => (/^<span class="fxname/.test(r) ? r : await enrich(r, item))));
    outcomes[n] = o;
  }
  const effectsHtml = [version.effects ? await enrich(version.effects, item) : "", fxn.all?.length ? fxNames(fxn.all) : ""].filter(Boolean).join(" ");
  let areaHtml = "";
  const ab = areaButton(it);
  if (ab) areaHtml = await enrich(ab.replace(/distance:\d+/, `distance:${Number(areaSize) || parseArea(areaText(it))?.size || 1}`).replace(/\|label:[^|\]]*/, ""), item);   // a used Version: its own size only ("3 Burst")
  return {
    outcomes, effectsHtml, areaHtml, dist: sqText(distanceText(it, weapon)),
    outcomeFor: (n, bon) => { const o = outcomeFor(n, bon); return { parts: o.parts, riders: [...(outcomes[n]?.riders ?? []), ...bon.filter(b => b.text).map(b => esc(b.text))] }; }
  };
}

/** Roll dialog: optional AP buttons, DC, boons, banes (pre-filled from effects), and the Notes of matching effects on the right. */
/**
 * The dialog's modifier choices that apply to one target: everything that applies to all (your own effects), and that target's own
 * ("<actor uuid>|<effect>:<index>" for effects on it, "syn:<kind>|<actor uuid>" for cover, perception and range against it).
 */
export const modifiersForTarget = (ids, actorUuid) => (ids ?? []).filter(id => {
  const s = String(id);
  const owner = s.startsWith("syn:") ? (s.split("|")[1] ?? null) : (s.includes("|") ? s.split("|")[0] : null);
  return owner == null || owner === actorUuid;
});

/** The dots over a target tile: a green dot for each boon and a red dot for each bane (at most 5 of each). */
export const tileDots = (boons, banes) => `${'<i class="dot g"></i>'.repeat(Math.min(5, Math.max(0, boons)))}${'<i class="dot r"></i>'.repeat(Math.min(5, Math.max(0, banes)))}`;
/** The caption under the tiles for the selected creature: { name, detail }. */
export const tileCaption = (name, dc, boons, banes) => ({ name, detail: [`DC ${dc}`, boons ? `${boons} Boon${boons > 1 ? "s" : ""}` : "", banes ? `${banes} Bane${banes > 1 ? "s" : ""}` : ""].filter(Boolean).join(" \u00b7 ") });
/** The number a duplicate name ends with ("Skeleton Captain 2" → "2"). */
export const tileNumber = name => (/(\d+)\s*$/.exec(String(name ?? "")) ?? [])[1] ?? "";

/** The Modifier's name for the card: "Exhausted 2" when it still has the value Exhausted put there. */
export const adjLabelOf = data => (data?.adjLabel && Number(data.mod) === Number(data.adjDefault) ? data.adjLabel : "");

export async function askRoll(actor, { title, attrKey, traits = new Set(), from = null, versions = null, defaults = {}, preview = null, dcNote = "", targetActors = [], targetTiles = [], extraMods = [], withDamage = false, withReload = false, notices = [], bonusChips = [], tiers = null }) {
  // Armor beyond the creature's training: all its Rolls are Doomed (unless something else already made them Doomed, which keeps its label).
  if (actor?.system?.armorUntrained && !defaults.doomed) defaults = { ...defaults, doomed: true, doomedLabel: "Untrained armor (Doomed)", doomedWhy: "Your armor is beyond your Armor Training: all your Rolls are Doomed" };
  // the core rework A5: Exhausted is N Banes on all Rolls, a modifier of its own (effects.mjs derivedMods "syn:exh"), no longer a penalty in the Modifier
  const notes = attrKey ? notesFor(actor, attrKey) : [];
  // Notices for one creature (a trigger on that target) go in its tile when several are targeted; the others stay in the Use row.
  const perCreature = targetTiles.length > 1;
  const infoMods = notices.filter(n => n.for && perCreature).map((n, k) => ({ id: `syn:info|${n.for}|${k}`, info: true, ...n }));
  const generalNotices = notices.filter(n => !(n.for && perCreature));
  const mods = [...modifierList(actor, traits, targetActors, from), ...extraMods, ...infoMods];
  if (typeof document !== "undefined" && !versions && !targetTiles.length && !preview && !withDamage && !withReload && globalThis.foundry?.applications?.api?.ApplicationV2?.prototype?.render) {
    const { openCheckRoll } = await import("./checkwindow.mjs");
    return openCheckRoll({
      title,
      actorName: actor?.name ?? "",
      actorImg: actor?.img ?? "",
      attrKey,
      baseMod: Number(actor?.system?.attributes?.[attrKey]) || 0,
      dc: Number(defaults.dc) || 13,
      adj: Number(defaults.mod) || 0,
      adjLabel: defaults.adjLabel ?? "",
      adjDefault: defaults.adjDefault ?? 0,
      dcNote,
      boons: Number(defaults.boons) || 0,
      banes: Number(defaults.banes) || 0,
      favored: !!defaults.favored,
      favoredLabel: defaults.favoredLabel ?? "",
      doomed: !!defaults.doomed,
      doomedLabel: defaults.doomedLabel ?? "",
      mods,
      fxOn: new Set(mods.filter(m => !m.info && m.match).map(m => m.id)),
      notices: generalNotices,
      notes,
      tiers
    });
  }
  const notesHtml = notes.length ? `<aside class="usenotes"><div class="unhead">Effects</div><ul>${notes.map(n => `<li><b>${esc(n.title)}</b>${n.title !== n.name ? ` <small>(${esc(n.name)})</small>` : ""}${n.text ? `<div>${esc(n.text)}</div>` : ""}</li>`).join("")}</ul></aside>` : "";
  const ap = versions ? `<div class="apbtns">${versions.map((v, i) => `<label class="apbtn"><input type="radio" name="ap" value="${v.ap}" ${i === 0 ? "checked" : ""}><span>${apIcon(v.ap, defaults.reaction)}</span></label>`).join("")}</div>` : "";
  const chipOf = m => m.info ? `<span class="rnotice" data-tooltip="${esc(m.why ?? "")}"><i class="fa-solid ${esc(m.icon ?? "fa-circle-info")}"></i> ${esc(m.text)}</span>` :
    `<label class="fxchip ${m.banes && !m.boons ? "bane" : "boon"}"><input type="checkbox" name="fx" value="${m.id}" data-b="${m.boons ?? 0}" data-n="${m.banes ?? 0}" ${m.match ? "checked" : ""}><i class="fa-solid fa-chevron-${m.banes && !m.boons ? "down" : "up"}"></i><span>${esc(m.name)}</span><small${m.full ? " hidden" : ""}>${m.boons ? `+${m.boons}` : ""}${m.boons && m.banes ? "/" : ""}${m.banes ? `\u2212${m.banes}` : ""}</small></label>`;
  const chips = mods.map(chipOf).join("");
  // Several targets: a tile for each creature; clicking one shows the modifiers that affect that creature (the first tile: yours, for all).
  const ownerOf = id => { const t = String(id); return t.startsWith("syn:") ? (t.split("|")[1] ?? null) : (t.includes("|") ? t.split("|")[0] : null); };
  let effectsRows;
  if (targetTiles.length > 1) {
    const shared = mods.filter(m => !ownerOf(m.id)), own = u => mods.filter(m => ownerOf(m.id) === u);
    const first = shared.length ? "all" : (targetTiles.find(t => own(t.uuid).length)?.uuid ?? "all");
    const group = (id, list) => `<div class="fxgroup${id === first ? "" : " off"}" data-for="${esc(id)}">${list.length ? list.map(chipOf).join("") : '<span class="hint">Nothing changes this roll for this creature.</span>'}</div>`;
    effectsRows = `<div class="rf-row tilesrow"><span class="rf-label">Targets</span><div class="ttiles${targetTiles.length >= 10 ? " compact" : ""}"><button type="button" class="ttile${first === "all" ? " on" : ""}" data-tg="all" data-name="Yours" aria-label="Your own effects, for every target"><span class="tdots"></span><i class="fa-solid fa-user"></i></button>${targetTiles.map((t, k) => `<button type="button" class="ttile${first === t.uuid ? " on" : ""}" data-tg="${esc(t.uuid)}" data-name="${esc(t.name)}" data-dc="${t.dc}" aria-label="${esc(t.name)}: DC ${t.dc}. Right-click to remove it from the targets"><span class="tdots"></span>${targetTiles.length >= 10 ? `<b class="tabnum">${k + 1}</b>` : `<img src="${esc(t.img)}" alt="">${tileNumber(t.name) ? `<span class="tnum">${tileNumber(t.name)}</span>` : ""}`}<span class="ttx" data-rm="${esc(t.uuid)}" aria-label="Remove ${esc(t.name)} from the targets"><i class="fa-solid fa-xmark"></i></span></button>`).join("")}</div></div><div class="tremoved"></div><div class="tcap"></div><div class="fxgroups">${group("all", shared)}${targetTiles.map(t => group(t.uuid, own(t.uuid))).join("")}</div>`;
  } else effectsRows = chips ? `<div class="rf-row"><span class="rf-label">Effects</span>${chips}</div>` : "";
  // Notices: how the roll is made, shown as labels (a Thrown weapon thrown, for example).
  if (generalNotices.length) effectsRows = `<div class="rf-row"><span class="rf-label">Use</span>${generalNotices.map(n => `<span class="rnotice" data-tooltip="${esc(n.why ?? "")}"><i class="fa-solid ${esc(n.icon ?? "fa-circle-info")}"></i> ${esc(n.text)}</span>`).join("")}</div>` + effectsRows;
  const bb = (kind, label, icon, n) =>
    `<button type="button" class="bbchip ${kind === "boons" ? "boon" : "bane"} ${n ? "on" : ""}" data-bb="${kind}"><i class="fa-solid fa-chevron-${icon}"></i><span>${label}</span><b>${n}</b></button><input type="hidden" name="${kind}" value="${n}">`;
  const state = (name, label, cls, icon) =>
    `<label class="fxchip ${cls}"><input type="checkbox" name="${name}" ${(name === "doomed" && defaults.doomed) || (name === "favored" && defaults.favored) ? "checked" : ""}><i class="fa-solid fa-chevron-${icon}"></i><span>${label}</span></label>`;
  const stepChip = (name, label, icon, cls, n) =>
    `<button type="button" class="bbchip ${cls} ${n ? "on" : ""}" data-bb="${name}"><i class="fa-solid fa-chevron-${icon}"></i><span>${label}</span><b>${n}</b></button><input type="hidden" name="${name}" value="${n}">`;
  // v0.0.187: Bonus Damage from effects and passives (Killer's Focus) is a chip: unticked, it isn't added and its effect isn't used up.
  const bonusRow = bonusChips.length ? `<div class="rf-row"><span class="rf-label">Bonus</span>${bonusChips.map(b => `<label class="fxchip boon"><input type="checkbox" name="bonusOn" value="${esc(b.key)}" checked><i class="fa-solid fa-sparkles"></i><span>${esc(b.text)}</span></label>`).join("")}</div>` : "";
  const special = [
    withReload
      ? `<label class="fxchip boon"><input type="checkbox" name="reloadshot"><i class="fa-solid fa-bullseye"></i><span>Reload shot</span></label>`
      : "",
    withDamage
      ? `<span class="bbgroup">${stepChip("empowered", "Empowered", "up", "boon", defaults.empowerN ? 1 : 0)}</span>`
      : "",
    // v0.0.283 (pack chat-cards; book Ch. 4): switching a Lethal Action to Nonlethal (or back) costs a Bane on the roll; the damage message shows the tag
    // v0.0.458 (Lucas, 2026-11-19; book Ch. 4): a Save Action doesn't roll, so its switch gives every creature 1 Boon on its Save instead
    withDamage && defaults.nlKnown
      ? `<label class="fxchip ${defaults.nlSave ? "boon" : "bane"}"><input type="checkbox" name="switchNl"><i class="fa-solid fa-hand-fist"></i><span>${defaults.nonlethal ? "Lethal" : "Nonlethal"} (${defaults.nlSave ? "+1 Boon on each Save" : "1 Bane"})</span></label>`
      : ""
  ]
    .filter(Boolean)
    .join("");
  const chipRow =
    `<div class="rf-row"><span class="rf-label">Roll</span>${state("favored", defaults.favored && defaults.favoredLabel ? defaults.favoredLabel : "Favored", "boon", "up")}${state("doomed", defaults.doomed && defaults.doomedLabel ? defaults.doomedLabel : "Doomed", "bane", "down")}<span class="bbgroup">${bb("boons", "Boons", "up", defaults.boons ?? 0)}${bb("banes", "Banes", "down", defaults.banes ?? 0)}</span></div>` +
    effectsRows + bonusRow +
    (special ? `<div class="rf-row special"><span class="rf-label">Damage</span>${special}</div>` : "") +
    `<input type="hidden" name="forceTier" value="">${withDamage ? `<p class="hint forcehint">For testing: click a Tier in the preview to force that result.</p>` : ""}`;
  return DialogV2.prompt({
    window: { title },
    position: { width: notes.length || preview ? 580 : 380 },
    content: `<div class="twod12 usedlg">${ap}<div class="usepreview"></div><div class="usewrap"><div class="useleft">
      <div class="rollfields"><div class="rf-row"><label class="mini">DC <input class="num" type="number" name="dc" value="${defaults.dc ?? 13}"></label><label class="mini">Modifier <input class="num" type="number" name="mod" value="${defaults.mod ?? 0}">${defaults.adjLabel ? `<input type="hidden" name="adjLabel" value="${esc(defaults.adjLabel)}"><input type="hidden" name="adjDefault" value="${defaults.adjDefault}">` : ""}</label>${dcNote ? `<span class="dcnote">${esc(dcNote)}</span>` : ""}</div>
      ${chipRow}</div></div>${notesHtml}</div></div>`,
    render: (event, dialog) => {
      const root = dialog.element,
        pv = root.querySelector(".usepreview");
      // The target tiles: click one to see (and change) the modifiers that affect that creature.
      const boxesOf = u => [...(root.querySelector(`.fxgroup[data-for="${CSS.escape(u)}"]`)?.querySelectorAll("[name=fx]") ?? [])];
      const sum = list => list.reduce((t, c) => (c.checked ? [t[0] + (Number(c.dataset.b) || 0), t[1] + (Number(c.dataset.n) || 0)] : t), [0, 0]);
      const refreshTiles = () => {
        const [sb, sn] = sum(boxesOf("all"));
        root.querySelectorAll(".ttile").forEach(t => {
          const own = t.dataset.tg === "all" ? [0, 0] : sum(boxesOf(t.dataset.tg));
          t._eff = [sb + own[0], sn + own[1]];
          const d = t.querySelector(".tdots");
          if (d) d.innerHTML = tileDots(...t._eff);
        });
        const on = root.querySelector(".ttile.on"),
          cap = root.querySelector(".tcap");
        if (on && cap) {
          const c =
            on.dataset.tg === "all"
              ? { name: "Yours", detail: "your effects, for every target" }
              : tileCaption(on.dataset.name, on.dataset.dc, ...(on._eff ?? [0, 0]));
          const b = document.createElement("b"),
            sp = document.createElement("span");
          b.textContent = c.name;
          sp.textContent = ` \u00b7 ${c.detail}`;
          cap.replaceChildren(b, sp);
        }
      };
      // v0.0.215 (Lucas, playtest 2): a target can be removed here (the x on its tile): it is not rolled against and is untargeted.
      // v0.0.217 (Lucas: the x still did nothing): one listener on the dialog, in the capture phase, for the x and for a right-click on a tile.
      const removeTile = tile => {
        if (!tile || tile.dataset.tg === "all" || tile.classList.contains("gone")) return;
        const u0 = tile.dataset.tg;
          const left = root.querySelectorAll('.ttile:not([data-tg="all"]):not(.gone)').length;
          if (left <= 1) return ui.notifications.warn("At least one target stays: cancel the Action to use it on nobody.");
          // v0.0.216 (Lucas: "the X does nothing"): the tile's own display beat the hidden attribute; it is now display:none, with an undo chip.
          tile.classList.add("gone"); tile.style.display = "none";
          const box = root.querySelector(".tremoved"), u = u0, group = root.querySelector(`.fxgroup[data-for="${CSS.escape(u)}"]`);
          const chip = document.createElement("span"); chip.className = "trm-chip"; chip.setAttribute("aria-label", "Removed from the targets: click to put it back");
          chip.innerHTML = `<input type="hidden" name="removed" value="${esc(u)}"><i class="fa-solid fa-rotate-left"></i> ${esc(tile.dataset.name ?? "")}`;
          const was = [...(group?.querySelectorAll("[name=fx]") ?? [])].map(c => c.checked);
          group?.querySelectorAll("[name=fx]").forEach(c => { c.checked = false; c.disabled = true; });
          chip.addEventListener("click", e2 => {
            e2.preventDefault(); chip.remove(); tile.classList.remove("gone"); tile.style.display = "";
            group?.querySelectorAll("[name=fx]").forEach((c, k) => { c.disabled = false; c.checked = was[k]; });
            refreshTiles(); root.dispatchEvent(new Event("change", { bubbles: true }));
          });
          if (box) { if (!box.querySelector(".trm-h")) box.insertAdjacentHTML("afterbegin", '<span class="trm-h">Removed:</span>'); box.append(chip); }
          if (tile.classList.contains("on")) root.querySelector('.ttile[data-tg="all"]')?.click();
          refreshTiles(); root.dispatchEvent(new Event("change", { bubbles: true }));
      };
      root.addEventListener("click", ev => { const x = ev.target.closest?.(".ttx"); if (!x) return; ev.preventDefault(); ev.stopPropagation(); removeTile(x.closest(".ttile")); }, true);
      root.addEventListener("contextmenu", ev => { const t = ev.target.closest?.(".ttile"); if (!t || t.dataset.tg === "all") return; ev.preventDefault(); ev.stopPropagation(); removeTile(t); }, true);
      root.querySelectorAll(".ttile").forEach(t =>
        t.addEventListener("click", ev => {
          ev.preventDefault();
          root.querySelectorAll(".ttile").forEach(x => x.classList.toggle("on", x === t));
          root.querySelectorAll(".fxgroup").forEach(g => g.classList.toggle("off", g.dataset.for !== t.dataset.tg));
          refreshTiles();
        })
      );
      root.addEventListener("change", refreshTiles);
      refreshTiles();
      const refresh = () => {
        if (!preview || !pv) return;
        const apNow = root.querySelector("[name=ap]:checked")?.value;
        const html = preview.byAp?.[apNow] ?? preview.byAp?.[Object.keys(preview.byAp ?? {})[0]] ?? "";
        if (pv.dataset.ap !== String(apNow)) {
          pv.innerHTML = html;
          pv.dataset.ap = String(apNow);
        }
        const rf = root.querySelector(".rollfields");
        if (rf) rf.style.display = preview.noTiers?.[apNow] ? "none" : "";
        let boons = Number(root.querySelector("[name=boons]").value) || 0,
          banes = Number(root.querySelector("[name=banes]").value) || 0;
        root.querySelectorAll("[name=fx]:checked").forEach(c => {
          const m = (preview.mods ?? {})[c.value];
          if (m) {
            boons += m.boons;
            banes += m.banes;
          }
        });
        // v0.0.194: each Tier's Avg follows the Bonus chips ticked and the Empowered / Enfeebled chips.
        const on = new Set([...root.querySelectorAll("[name=bonusOn]:checked")].map(c => c.value));
        const step = (Number(root.querySelector("[name=empowered]")?.value) || 0) - (Number(root.querySelector("[name=enfeebled]")?.value) || 0);
        pv.querySelectorAll(".calc[data-avg]").forEach(el => {
          let d = null;
          try { d = JSON.parse(el.dataset.avg); } catch (e) { return; }
          const r = liveAvg(d, on, step);
          el.innerHTML = `Avg ${Math.round(r.avg * 10) / 10}${r.why.length ? ` <small>(with ${esc(r.why.join(", "))})</small>` : ""}`;
        });
        const forced = root.querySelector("[name=forceTier]")?.value ?? "";
        pv.querySelectorAll("tr[data-t]").forEach(tr => tr.classList.toggle("forced", tr.dataset.t === forced));
        const fav = root.querySelector("[name=favored]")?.checked || root.querySelector("[name=reloadshot]")?.checked,
          doo = root.querySelector("[name=doomed]")?.checked;
        if (!preview?.noOdds) updateOdds(
          pv,
          (preview.mod ?? 0) + (Number(root.querySelector("[name=mod]").value) || 0),
          Number(root.querySelector("[name=dc]").value) || 13,
          boons,
          banes,
          fav && doo ? "" : fav ? "favored" : doo ? "doomed" : ""
        );
      };
      if (preview) {
        preview.mods = Object.fromEntries(mods.map(m => [m.id, { boons: m.boons, banes: m.banes }]));
        root.addEventListener("input", refresh);
        root.addEventListener("click", () => setTimeout(refresh, 0));
        root.addEventListener("contextmenu", () => setTimeout(refresh, 0));
        refresh();
      }
      dialog.element.addEventListener("click", ev => {
        const tr = ev.target.closest(".usepreview tr[data-t]");
        const inp = dialog.element.querySelector("[name=forceTier]");
        if (!tr || !inp) return;
        inp.value = inp.value === tr.dataset.t ? "" : tr.dataset.t;
        dialog.element.querySelectorAll(".usepreview tr[data-t]").forEach(r => r.classList.toggle("forced", r.dataset.t === inp.value));
      });
      dialog.element.querySelectorAll("[data-bb]").forEach(btn => {
        const input = dialog.element.querySelector(`[name=${btn.dataset.bb}]`);
        const set = n => {
          input.value = Math.max(0, n);
          btn.querySelector("b").textContent = input.value;
          btn.classList.toggle("on", Number(input.value) > 0);
        };
        btn.addEventListener("click", ev => {
          ev.preventDefault();
          set(Number(input.value) + 1);
        });
        btn.addEventListener("contextmenu", ev => {
          ev.preventDefault();
          set(Number(input.value) - 1);
        });
      });
    },
    ok: {
      label: "Roll",
      callback: (ev, btn) => {
        const fd = new FormData(btn.form);
        return { ...Object.fromEntries(fd), fx: fd.getAll("fx"), bonusOn: fd.getAll("bonusOn"), removed: fd.getAll("removed") };
      }
    },
    rejectClose: false
  });
}

/** Ask for AP / DC / boons / banes, roll the check and post the action card (damage is rolled from a button). */
export async function useAction(actor, item, opts = {}) {
  // A Weapon Technique stays locked until 3 Mastery with its weapon (mastery.mjs).
  const lock = techniqueLock(actor, item);
  // v0.0.293 (Lucas: "allow use of actions even if they aren't normally allowed"): from a faded row of the sheet (opts.override) a rule
  // that would refuse the Action is only a warning; true = stop here
  const refuse = msg => { ui.notifications.warn(opts.override ? `${msg} Used anyway.` : msg); return !opts.override; };
  // v0.0.440 (Lucas, checklist: Wounding Shot "only warning, never prevent these unless very necessary"): a Requirement, a Frequency-like rule or a
  // locked Technique warns and the Action goes on; only what can't happen at all (a movement while Immobilized or Prone, a Technique without its
  // weapon in hand) still stops it
  // v0.0.460 (Lucas, checklist v0.0.459, warn-only: "remember we are adding them to the Roll Dialog now"): written in the roll dialog's
  // warnings (dlgWarns), not a Foundry notification; a use that skips the dialog still gets the notification (below)
  const earlyWarns = opts._earlyWarns ?? [];
  const warnOnly = msg => { earlyWarns.push(`${msg} Used anyway.`); return false; };
  // v0.0.314 (pack AU; book, Ch. 8): a Staggered creature can't use Reactions (its Reaction Point waits until Staggered ends)
  if (item.system?.reaction && reactionsOff(actor) && warnOnly(`${actor.name} is Staggered: no Reactions until it ends.`)) return;
  // v0.0.412 (book, Wounding Shot): "You haven't left your square this turn": its Requirement, checked on its turn in a combat (hooks.mjs leftThisTurn)
  const H0 = await import("./hooks.mjs");
  if (H0.needsStayed(item.system?.requirements)) { const H = H0; if ((await H.leftThisTurn(actor)) === true && warnOnly(`${item.name}: ${actor.name} has left its square this turn (its Requirement).`)) return; }
  if (lock.locked && warnOnly(`${item.name} is locked: ${TECHNIQUE_AT} ${lock.group} Mastery unlocks it (${actor.name} has ${lock.value}).`)) return;
  // v0.0.213 (Lucas): a Weapon Technique is used only with its own weapon, in hand (a Favorite or a macro can still call it).
  if (techniqueState(actor, item) === "unwielded" && refuse(`${item.name} is ${actor.items.get(item.getFlag("twod12", "weaponId"))?.name ?? "its weapon"}'s Weapon Technique: wield it first.`)) return;
  // A Split Action has two modes: choose one (Weapon needs a weapon, Power doesn't), then it is used as an Action of that mode (split.mjs).
  if (item.system.traits?.has?.("split") && !opts.splitMode) {
    const modes = splitModes(item);
    if (modes.length) {
      let mode = modes.includes(opts.mode) ? opts.mode : modes[0];
      if (modes.length > 1 && !modes.includes(opts.mode)) {
        const { pickTwo } = await import("./pickwindow.mjs");   // v0.0.415 (pack CL): was a DialogV2
        const pick = await pickTwo({ title: `${item.name}: choose a mode`, name: item.name, sub: "a Split Action", icon: "fa-code-branch",
          text: "Choose how you use it this time. Weapon mode needs a weapon and rolls your Weapon Modifier; Power mode needs no weapon and rolls your Power Modifier.",
          yes: "Weapon mode", no: "Power mode" });
        if (pick !== true && pick !== false) return;
        mode = pick ? "weapon" : "power";
      }
      return useAction(actor, splitView(item, mode), { ...opts, splitMode: mode, _earlyWarns: earlyWarns });
    }
  }
  // v0.0.409 (pack F2; book, Reading an Action): an Art has three Modes: the player picks one each time (the pick window), then it is used as that Mode
  if (!opts.splitMode) {
    const modes = artModes(item);
    if (modes.length) {
      let mode = modes.includes(opts.mode) ? opts.mode : null;
      if (!mode) {
        // v0.0.454 (Lucas, playtest 6, D4): the Art's card opens by what was clicked (artcard.mjs); a Mode's Use button uses it (was a pick window)
        const { openArtCard } = await import("./artcard.mjs");
        await openArtCard(actor, item, (m, ap, o = {}) => { if (modes.includes(m)) useAction(actor, item, { ...opts, mode: m, skipDialog: !o.dialog }); });   // v0.0.460: straight to the chat; Shift, the roll dialog
        return;
      }
      return useAction(actor, modeView(item, mode), { ...opts, splitMode: mode, _earlyWarns: earlyWarns });
    }
  }
  const s = actor.system, it = item.system;
  // v0.0.189 asked for the targets on the map (targeting.mjs) here; v0.0.392 (Lucas) opens the roll dialog instead (its Target button and its DC).
  // v0.0.392 (Lucas: "Remove the target | no target: DC prompt. If you dont have a target, simply open the roll dialog"): the dialog shows
  // "No target" with its DC and a Target button; it is live, so targeting creatures on the map fills it (the chat card keeps its retarget button)
  // An Action that marks the target needs it (targeted).
  // v0.0.393 (Lucas: "can't use them without targets"): no refusal; with nothing targeted the Action marks nobody (the dialog's Target button marks one)
  // A Save Action (the Save trait): you don't roll; each target rolls the Save named on its Vs. line against 11 + your Modifier (Save Actions in the rules).
  const saveAct = !!it.traits?.has?.("save");
  // A Weapon Action needs its weapon before anything else happens (no area to place first, then refused). The same checks run again below.
  if (it.traits?.has?.("weapon") && !item.getFlag("twod12", "weaponId")) {
    const need = ["melee", "ranged"].find(p => it.traits.has(p));
    const ws = weaponsFor(actor, item).filter(w => (!need || hasProp(w, need) || (need === "ranged" && hasProp(w, "thrown"))) && (!it.traits.has("shot") || hasProp(w, "projectile")));
    if (need && !ws.length) return ui.notifications.warn(it.traits.has("shot") ? `${item.name} is a Shot: it needs a wielded Projectile weapon (a bow or a crossbow).` : `${item.name} needs a wielded ${need === "melee" ? "Melee" : "Ranged"} weapon.`);
  }
  let versions = [...it.versions].sort((a, b) => a.ap - b.ap);
  if (!versions.length) return ui.notifications.warn(`${item.name} has no versions yet.`);
  // What the Action rolls (Signature, Weapon, Power or an Attribute) and what its damage adds: rollsource.mjs.
  const src = rollSource(s, it);
  const preAttr = src.attrKey;
  // A granted use (from an Effect such as Double Shot) is free and does not count. v0.0.182: it is used without asking (the roll dialog says so
  // at the top); a normal use with one waiting: Shift-click the use button (opts.noGrant).
  if (!opts.free && !opts.noGrant) {
    // v0.0.269 (Lucas): a ticket or a card's button names its own grant (opts.grantKey); the Action's plain use button takes the first waiting
    const all = activeGrants(actor, item), g = opts.grantKey ? (all.find(x => x.effect.id === opts.grantKey.effectId && x.index === Number(opts.grantKey.index)) ?? all[0]) : all[0];
    if (g) { const { grantOpts } = await import("./freeuse.mjs"); opts = { ...opts, ...grantOpts(g) }; }   // v0.0.294: one pure source (tested)
  }
  // An Action that needs a free hand (Handle, "free hand" in its Requirements, such as Reload): with both hands full, offer Release first (v0.0.138).
  if (!opts.noHandle && !(await ensureFreeHand(actor, item))) return;
  const basicKey = item.getFlag?.("twod12", "basic");
  if (!it.reaction && !opts.free && !opts.restart && isOutOfTurn(actor)) {
    const { pickConfirm } = await import("./pickwindow.mjs");   // v0.0.415 (pack CL): was a DialogV2
    const ok = await pickConfirm({ title: item.name, name: item.name, sub: "not your turn", icon: "fa-hourglass-half", confirm: "Use it anyway", text: `It is not <b>${esc(actor.name)}</b>'s turn. Only Reactions can be used outside your turn.` });
    if (!ok) return;
  }
  const reqTarget = [...game.user.targets][0] ?? null, reqUser = actor.token?.object ?? actor.getActiveTokens?.()[0] ?? null;
  const reqOpts = { skipHands: true };   // hands: checked above
  if (reqTarget && reqUser) reqOpts.distance = squaresBetween(reqUser, reqTarget);   // Haul: "at least 2 squares away"
  const reqProblem = requirementProblem(it, actor, reqTarget?.actor ?? null, reqOpts);
  if ((reqProblem) && warnOnly(`${actor.name} can't use ${item.name}: it ${reqProblem}.`)) return;
  // An Action that needs several different creatures (Double Shot: "Two creatures") can't be made against fewer: its Linked Actions would be disrupted.
  // v0.0.393 (Lucas: "Actions are still asking for Targets, and can't use them without targets"): no refusal; the roll dialog shows the creatures
  // targeted (or "No target" with its DC and a Target button)
  // v0.0.224: Break Free is the one Move Action an Immobilized creature can use (and only then).
  if ((basicKey === "breakFree" && !actor.statuses?.has?.("immobilized")) && refuse(`${actor.name} is not Immobilized.`)) return;
  if (((it.traits.has("move") || basicKey === "safeMovement") && basicKey !== "breakFree" && actor.statuses?.has?.("immobilized")) && refuse(`${actor.name} is Immobilized and can't move: Break Free (1 AP) first.`)) return;
  // Prone: you can't Evade, and the only Move Actions you can use are Crawl and Stand.
  if (actor.statuses?.has?.("prone")) {
    if ((basicKey === "safeMovement") && refuse(`${actor.name} is Prone and can't Evade.`)) return;
    // playtest 7 (Prone + Break Free; book, Chapter 8, Prone since v0.0.431): Break Free is allowed too
    if ((it.traits.has("move") && !["crawl", "stand", "breakFree"].includes(basicKey)) && refuse(`${actor.name} is Prone: the only Move Actions it can use are Crawl, Stand and Break Free.`)) return;
  }
  if ((basicKey === "rally" && (s.atZero || actor.statuses?.has?.("unconscious"))) && refuse(`${actor.name} can't use Steel Yourself while Down or Unconscious.`)) return;
  if (basicKey === "interact") await offerWake(actor, [...game.user.targets]);   // v0.0.176: waking an Unconscious creature (not one that is Down)
  // Setup: what happens before the dice are rolled. Its movement is made first, so the range, cover and Engaged of the roll come from where the creature ends.
  // v0.0.440 (Lucas, checklist: "Setup for Smite triggered before the roll dialog, it needs to be as soon as the message is sent"): with the roll
  // dialog, the Setup runs when Roll is pressed (before the dice); the Action then runs again from where the creature stands, with the dialog's
  // choices and without the dialog (its range, cover and Engaged come from there). Without the dialog (Skip roll dialog, a shortcut) it runs first.
  let setupDone = !!opts.setupDone, stanceRan = !!opts.stanceRan;
  const runSetups = async () => {
    if (String(it.setup ?? "").includes("@Move")) {
      const { runSetup } = await import("./setup.mjs");
      const st = await runSetup(actor, item, actor.token?.object ?? actor.getActiveTokens?.()[0] ?? null);
      return { ok: st.ok, done: st.done, stance: false };
    }
    if (!it.reaction && game.combat?.started && game.combat.combatant?.tokenId === (actor.token?.id ?? actor.getActiveTokens?.()[0]?.document?.id)) {   // on your own turn
      // v0.0.428 (the audit; book, Hallowed Stance: a [Divine] Action you use gains "Setup: You Advance 3"): the Setup comes before the roll, as any
      // Setup (move 0 and Continue to skip it), when the card has no movement Setup of its own (Lay On Hands keeps its "Or, instead" on the card)
      const stance = activeHooks(actor, "setupAdvance").find(h => hasTraits(it.traits, h.hook.traits));
      if (stance) {
        const n = Math.max(1, Number(stance.hook.n) || 3), { runSetup } = await import("./setup.mjs");
        const st = await runSetup(actor, { name: item.name, system: { setup: `You @Move[advance|distance:${n}]{Advance ${n}} (${stance.item.name}).` } }, actor.token?.object ?? actor.getActiveTokens?.()[0] ?? null);
        return { ok: st.ok, done: st.done, stance: st.done };
      }
    }
    return { ok: true, done: false, stance: false };
  };
  const dialogWillShow = opts.quickAp == null && !(opts.skipDialog && !opts.restart) && !opts.rollAfterPlace
    && (typeof globalThis.__twod12RollDialog === "function" || typeof foundry.applications?.api?.ApplicationV2?.prototype?.render === "function");
  const hasSetupMove = String(it.setup ?? "").includes("@Move")
    || (!it.reaction && !!game.combat?.started && game.combat.combatant?.tokenId === (actor.token?.id ?? actor.getActiveTokens?.()[0]?.document?.id)
      && !!activeHooks(actor, "setupAdvance").find(h => hasTraits(it.traits, h.hook.traits)));
  const setupLater = !opts.noSetup && !opts.setupRan && dialogWillShow;
  if (!opts.noSetup && !opts.setupRan && !setupLater) {
    const st = await runSetups();
    if (!st.ok) return;
    setupDone = st.done; stanceRan = st.stance;
  }
  const isSelf = it.traits.has("self");
  const selfToken = actor.token?.object ?? actor.getActiveTokens?.()[0] ?? null;
  // An Action with an Area and a roll: the area is placed first, so the roll is made once for the creatures in it.
  let areaOutcome = null;
  const areaSet = String(it.area ?? "").trim() ? areaConfigOf(it) : null;
  // v0.0.215: versions with their own Area size (Word of Radiance: 2 / 3 Emanation): the version is chosen before the area is placed, and the roll keeps it.
  // v0.0.251 (Lucas): the area is shown and placed for an Action with no roll too (Hallowed Dawn), and the version is picked on a bar
  // v0.0.261 (Consecrated Ground): the rounds of a kept area can be the version's too (3 rounds at 2 AP, 5 at 3 AP)
  // v0.0.397 (Lucas: "When using an area action, only ask to place the area after the action has been confirmed in the roll dialog"; the roll dialog
  // brief of 2026-11-07: the Version buttons and the Place Area button are the dialog's): the dialog opens first, its Version buttons choose the
  // size; Roll places the area, then rolls with the dialog's choices (rollwindow.mjs). The HUD's "Skip roll dialog" and a shortcut keep the old order.
  // v0.0.460 (Lucas, checklist v0.0.459: "Clicking on word of radiance on the token hud places it, then opens the roll dialog"): the HUD passes its
  // Version as rdState ({ ap }), which turned this off; only a run again after the dialog (restart: the area placed) skips it now
  const deferArea = !!areaSet && !opts.restart && !opts.skipDialog && opts.quickAp == null && typeof globalThis.__twod12RollDialog !== "function"
    && typeof foundry.applications?.api?.ApplicationV2?.prototype?.render === "function";
  if (!deferArea && areaSet && canvas.ready && canvas.grid?.isSquare && new Set(versions.map(v => `${v.areaSize || areaSet.distance}|${v.areaRounds || areaSet.rounds}`)).size > 1) {
    const { pickBar } = await import("./pickbar.mjs");
    const keep = versions.find(v => v.ap === Number(opts.rdState?.ap));   // v0.0.292: the roll dialog's Place Area keeps its Version
    if (keep) { versions = [keep]; areaSet.distance = keep.areaSize || areaSet.distance; areaSet.rounds = keep.areaRounds || areaSet.rounds; } else {
    const roundsOf = v => (v.areaRounds || areaSet.rounds ? ` · ${v.areaRounds || areaSet.rounds} round${(v.areaRounds || areaSet.rounds) === 1 ? "" : "s"}` : "");
    const pickAp = await pickBar({ icon: "fa-vector-square", text: `<b>${esc(item.name)}</b>: which version? The Area depends on it.`, options: versions.map(v => ({ id: String(v.ap), label: `${v.ap} AP: ${v.areaSize || areaSet.distance} ${areaSet.shape === "burst" ? "Burst" : areaSet.shape === "line" ? "Line" : "Emanation"}${roundsOf(v)}` })) });
    if (pickAp == null) return;
    versions = versions.filter(v => v.ap === Number(pickAp));
    areaSet.distance = versions[0].areaSize || areaSet.distance;
    areaSet.rounds = versions[0].areaRounds || areaSet.rounds;
    }
  }
  // v0.0.261 (Consecrated Ground): the Zone settings of the Version's effects go on the placed area (its region); those effects are not applied to creatures
  let zoneSkip = new Set();
  if (areaSet) { const zn = await zoneOf(versions); if (zn) { areaSet.zone = { ...zn.zone, area: String(it.area ?? "").trim() }; areaSet.keep = true; zoneSkip = zn.uuids;
    // v0.0.327 (PACK ZONE): the Version's own rounds win; else the Zone's Ends: Time
    const t = zn.zone.ends?.time; if (!areaSet.rounds && t?.on && t.mode !== "encounter") areaSet.rounds = t.rounds; } }
  if (!deferArea && areaSet && canvas.ready && canvas.grid?.isSquare) {   // no square grid: no placing, rolled as before
    const { startTemplate } = await import("./template.mjs");
    const outcome = {}; areaOutcome = outcome;
    // "within your weapon's maximum range": the range of the weapon it will be used with (v0.0.159).
    let within = Number(areaSet.within ?? it.areaCfg?.within) || 0;
    if (areaSet.withinRange) {
      const w = weaponsFor(actor, item).find(x => hasProp(x, "ranged") && (!it.traits.has("shot") || hasProp(x, "projectile"))) ?? weaponsFor(actor, item)[0];
      const nums = String(weaponRanges(w, s.reach ?? 1).ranged || "").split("/").map(Number).filter(n => n > 0);
      within = (areaSet.withinRange === "normal" ? nums[0] : areaSet.withinRange === "far" ? nums[1] ?? nums.at(-1) : nums.at(-1)) || within;
    }
    // v0.0.216 (Lucas): a damaging Action doesn't tick "Affect the creature it is around" by default (Ground Slam); the window still asks.
    const damaging = versions.some(v => ["t1", "t2", "t3"].some(t => (v[t] ?? []).length));
    await startTemplate({ ...areaSet, self: areaSet.self && !damaging, quick: true, within, htSave: saveAct }, { token: selfToken, outcome });
    // v0.0.399 (Lucas: "Placing a burst is unselecting the token"): back on the token layer with the creature's token selected (the HUD follows it)
    try { if (selfToken && !selfToken.controlled) { if (canvas.tokens && canvas.tokens.active === false) canvas.tokens.activate?.(); selfToken.control?.({ releaseOthers: true }); } } catch (e) { console.warn("twod12 | reselect", e); }
    if (!outcome.ok) return;
    if (!outcome.count) ui.notifications.info("No creature is in the area.");
  }
  const rollsAtOthers = !isSelf || !!String(it.area ?? "").trim();
  const aimed = rollsAtOthers ? [...game.user.targets] : [];
  const targetToken = rollsAtOthers ? (aimed[0] ?? null) : selfToken;
  let dcInfo = computeDC(item, rollsAtOthers ? (targetToken?.actor ?? null) : actor, preAttr, src);
  // the core rework B11 (book, Chapter 6, Break Free): its Check rolls against the Action DC of what holds the creature (the highest; 13 with none)
  if (basicKey === "breakFree") { const { breakFreeCheck } = await import("./move.mjs"); const bf = breakFreeCheck(actor); dcInfo = { dc: bf.dc, vs: "", defense: "", note: `Action DC of what holds you: ${bf.dc}` }; }
  const previewMod = src.mod;
  // Several targets: one roll for all of them, each calculated on its own (see "Several Targets" in the rules).
  const multi = aimed.length > 1 && previewMod !== null;
  const linkedW = item.getFlag("twod12", "weaponId");
  // A Weapon Action with the Melee or Ranged trait needs a weapon with that property.
  const needProp = it.traits.has("weapon") ? ["melee", "ranged"].find(p => it.traits.has(p)) : null;
  const fitting = weaponsFor(actor, item).filter(w => !needProp || hasProp(w, needProp) || (needProp === "ranged" && hasProp(w, "thrown")));   // a Thrown weapon can be thrown for a [Ranged] Action
  // v0.0.444 (Lucas, group 2): the card's own requirement (Darting Blade: a Light weapon). v0.0.453 (Lucas, playtest 6: "dont prevent it. Shows a
  // warning on the Roll dialog"): with no such weapon in hand, the weapons that fit otherwise stay, and the dialog warns
  let needsOk = fitting.filter(w => !it.weaponNeeds || !it.traits.has("weapon") || hasProp(w, it.weaponNeeds));
  // v0.0.460 (Lucas, checklist v0.0.459, g2-darting: "makes the attack with fists"; Darting Blade, Setup: "You draw a Light weapon"): with none
  // in hand, a fitting one carried on you is the Strike's weapon, drawn when Roll is pressed (setupDraw, below)
  let setupDraw = null;
  if (it.weaponNeeds && it.traits.has("weapon") && !linkedW && !needsOk.length) {
    setupDraw = (actor.itemTypes?.weapon ?? []).find(w => weaponWhere(w) === "worn" && hasProp(w, it.weaponNeeds) && (!needProp || hasProp(w, needProp) || (needProp === "ranged" && hasProp(w, "thrown")))) ?? null;
    if (setupDraw) needsOk = [setupDraw];
  }
  const dlgWarns = [...earlyWarns];   // v0.0.460: the Requirement, Staggered and locked-Technique warnings too
  if (it.weaponNeeds && it.traits.has("weapon") && !linkedW && !needsOk.length && fitting.length) dlgWarns.push(`${item.name} needs ${(TWOD12.weaponNeeds?.[it.weaponNeeds] ?? it.weaponNeeds).toLowerCase()} in hand`);
  const candidates = needsOk.length ? needsOk : fitting;
  if (needProp && !linkedW && !candidates.length) return ui.notifications.warn(`${item.name} needs a wielded ${needProp === "melee" ? "Melee" : "Ranged"} weapon.`);
  // A Shot Action needs a Projectile weapon (a bow, a crossbow).
  if (it.traits.has("shot") && it.traits.has("weapon")) { const shooters = candidates.filter(w => hasProp(w, "projectile")); if (!linkedW && !shooters.length) return ui.notifications.warn(`${item.name} is a Shot: it needs a wielded Projectile weapon (a bow or a crossbow).`); candidates.splice(0, candidates.length, ...shooters); }
  // v0.0.208 (D2): a Gun Action needs a Firearm (a pistol, a musket); a Firearm is not a Projectile weapon.
  if (it.traits.has("gun") && it.traits.has("weapon")) { const guns = candidates.filter(w => hasProp(w, "firearm")); if (!linkedW && !guns.length) return ui.notifications.warn(`${item.name} is a Gun Action: it needs a wielded Firearm (a pistol or a musket).`); candidates.splice(0, candidates.length, ...guns); }
  // v0.0.426 (the audit: from the HUD, with a Dagger and a bow held, the dialog's hands' Banes and range were the Dagger's, then the roll used the
  // bow): the weapon is settled before the dialog: a Shot only from a Projectile weapon, a Gun Action from a Firearm; asked first when several fit
  if (!linkedW && !opts.weaponId && it.traits.has("weapon")) {
    const fit = it.traits.has("shot") ? candidates.filter(w => hasProp(w, "projectile")) : it.traits.has("gun") ? candidates.filter(w => hasProp(w, "firearm")) : candidates;
    const held = heldFirst(fit).filter(w => w.system?.wielded);
    if (held.length === 1) opts.weaponId = held[0].id;
    // v0.0.444 (Lucas, group 2: "instead of click -> choose weapon -> roll, it becomes click -> roll"): no "Which weapon?" window; the dialog
    // opens on the main hand's weapon and shows a Roll button for each held weapon that fits (opts.dual; rolldlg.mjs dualHtml)
    else if (held.length > 1) { const all = actor.itemTypes?.weapon ?? [], rank = w => ({ main: 0, both: 0, off: 1 }[handOf(all, w.id)] ?? 2); const ord = [...held].sort((a, b) => rank(a) - rank(b)); opts.weaponId = ord[0].id; opts.dual = ord.map(w => w.id); }
  }
  const previewWeapon = linkedW ? actor.items.get(linkedW) : (candidates.find(w => w.id === opts.weaponId) ?? heldFirst(candidates)[0] ?? null);   // v0.0.208: the hand button's weapon
  // A Weapon Action takes Melee or Ranged from its weapon and how it is used (a Thrown weapon thrown is Ranged), and the weapon's Range
  // for that use, with Reach above 1 added to a melee Range (weaponrange.mjs). Prone, Precise Aim and other effects use the trait.
  const wpnSquares = selfToken && targetToken && targetToken !== selfToken ? squaresBetween(selfToken, targetToken) : null;
  const isAreaAction = !!(String(it.area ?? "").trim() || Number(it.areaCfg?.size) > 0);   // an Area decides who is affected: no weapon Range check
  const wUse = it.traits.has("weapon") && previewWeapon ? weaponUse(previewWeapon, it.traits, s.reach ?? 1, wpnSquares) : null;
  const useTraits = new Set([...it.traits, ...(wUse?.mode ? [wUse.mode] : []), ...(wUse?.mode === "ranged" && !wUse.thrown && hasProp(previewWeapon, "projectile") ? ["shot"] : []), ...(wUse?.mode === "ranged" && !wUse.thrown && hasProp(previewWeapon, "firearm") ? ["gun"] : [])]);   // v0.0.208: with a Firearm, a Gun Action   // a Weapon Action with a Projectile weapon is a Shot
  // v0.0.188: a Weapon Action with a Two-handed weapon also matches "Two-handed weapon" in settings (Heavy Blows); not shown as a trait.
  // v0.0.320 (pack AU part 2): "Attack" in settings = an Action that rolls against another creature (the Elite ladder's 1 Boon on its first attack each round)
  // v0.0.410 (pack F2; book, Setup): with a Setup (its own, or Hallowed Stance's), the Distance and the targets are checked after it: out of range now is a note
  const handMods = [];   // v0.0.412: the hands' Banes (before extraMods is made)
  // v0.0.426 (the audit: any Setup skipped the range check, even after its movement ran or with no movement at all: Darting Blade stabbed 8 squares
  // away): the Distance waits only for a Setup movement still to come (one not run before the dialog, or Hallowed Stance's Advance)
  const withSetup = (String(it.setup ?? "").includes("@Move") && !setupDone) || (!stanceRan && !setupDone && !it.reaction && activeHooks(actor, "setupAdvance").some(h => hasTraits(useTraits, h.hook.traits))), setupNotices = [];
  // v0.0.412 (pack F3 part 2; book, Hands, Strung): the Banes of the hand the weapon is in (loadout.mjs handBanes)
  if (useTraits.has("strike") && it.traits.has("weapon") && previewWeapon) {
    try { const hb = handBanes(actor.itemTypes?.weapon ?? [], previewWeapon, isFists(previewWeapon)); if (hb.banes) handMods.push({ id: "syn:hand", name: hb.banes === 3 ? "Strung, the other hand full" : hb.banes === 2 ? "Off hand" : hb.why.startsWith("Fists") ? "Fists, off hand" : "Off hand (Light)", boons: 0, banes: hb.banes, match: true, predicate: hb.why }); } catch (e) { console.warn("twod12 | hands", e); }
  }
  const rollUse = new Set([...useTraits, ...(it.traits.has("weapon") && hasProp(previewWeapon, "twohanded") ? ["__twohanded"] : []), ...(rollsAtOthers && src.kind ? ["__attack"] : [])]);
  // A ranged weapon: the distance to the target decides the banes (far range 1, maximum range 2).
  let extraMods = [...handMods];
  const coverNotices = [];   // v0.0.267 (Lucas): a cover level the Action ignores is a notice (the small chip), not a chip to untick
  // v0.0.186, the "Ignore a Bane" settings of the creature's effects and passives (Long Draw, Steady Nerves, Sharpshooter): the names of what ignores each rule.
  // v0.0.411 (pack F3, Clear Lines): no Field Bane for a target Engaged with one of your allies (its name in the list that waives it)
  const lessRange = ignoredBy(actor, "rangeBane", useTraits), noEngagedTarget = [...ignoredBy(actor, "engagedTarget", useTraits), ...(useTraits.has("ranged") ? activeHooks(actor, "clearLines").map(h => h.item.name) : [])];
  const rw = previewWeapon?.system;
  const usesReload = it.traits.has("weapon") && rw?.traits?.has?.("reload") && basicKey !== "reload";   // Reload itself is what loads it (v0.0.221)
  // v0.0.453 (Lucas, playtest 6: "dont prevent it. Shows a warning on the Roll dialog"; the warning audit, R3): a rule broken is a warning there
  if (usesReload && rw.unloaded) dlgWarns.push(`${previewWeapon.name} is unloaded: Reload it before using it again`);
  // At-will: each use after the first in a turn has 1 more bane (uses from another Action don't count).
  const atWill = opts.free && !opts.countAtWill ? 0 : atWillUses(actor, item);   // v0.0.224: a Charge's Weapon Attack counts; v0.0.494: At-will [Strike] Actions share one count
  if (atWill > 0) extraMods.push({ id: "syn:atwill", name: `${atWill + 1}x At-will use`, boons: 0, banes: atWill, match: true, predicate: "Each use of an At-will Action after the first in a turn adds 1 bane (At-will [Strike] Actions share one count)" });
  // Helper: Roll Dialog notices for Cover-changing effects on attacker (coverLower, buff) and target (coverHigher, debuff) — active when Cover changes, muted/explained when it can't (e.g., no Cover to raise/lower).
  const pushCoverChanges = (cov0, cov, covLow, covHi, tkName = "", forUuid = "") => {
    const tag = tkName ? ` (${tkName})` : "", extra = forUuid ? { for: forUuid, showInDialog: true } : {};
    if (covLow.length) {
      const who = covLow.join(", ");
      if (cov0?.banes && cov.banes < cov0.banes) coverNotices.push({ text: `${who}: ${cov0.label} \u2192 ${cov.label}${tag}`, icon: "fa-shield-halved", active: true, tone: "boon", why: `${who}: ${tkName ? `${tkName}'s ` : ""}Cover counts one level lower`, ...extra });
      else if (cov0?.banes && covHi.length) coverNotices.push({ text: `${who}: \u22121 Cover level${tag}`, icon: "fa-shield-halved", active: true, tone: "boon", why: `${who} lowers Cover by 1 level (offset by ${covHi.join(", ")})`, ...extra });
      else if (!cov0?.banes) coverNotices.push({ text: `${who}: no Cover to lower${tag}`, icon: "fa-shield-halved", active: false, tone: "boon", why: `${who} lowers each target's Cover by 1 level, but ${tkName || "the target"} has no Cover`, ...extra });
    }
    if (covHi.length) {
      const who = covHi.join(", ");
      if (cov0?.banes && cov.banes > cov0.banes) coverNotices.push({ text: `${who}${tag}: ${cov0.label} \u2192 ${cov.label}`, icon: "fa-shield-halved", active: true, tone: "bane", why: `${who}: ${tkName || "the target"}'s Cover counts one level higher, up to High`, ...extra });
      else if (cov0?.banes && cov0.banes < 3 && covLow.length) coverNotices.push({ text: `${who}${tag}: +1 Cover level`, icon: "fa-shield-halved", active: true, tone: "bane", why: `${who} raises ${tkName || "the target"}'s Cover by 1 level (offset by ${covLow.join(", ")})`, ...extra });
      else if (!cov0?.banes) coverNotices.push({ text: `${who}${tag}: no Cover to raise`, icon: "fa-shield-halved", active: false, tone: "bane", why: `${who} raises ${tkName || "the target"}'s Cover by 1 level only when ${tkName || "it"} already has Cover`, ...extra });
      else if (cov0?.banes >= 3) coverNotices.push({ text: `${who}${tag}: already High cover`, icon: "fa-shield-halved", active: false, tone: "bane", why: `${who} raises Cover up to High`, ...extra });
    }
  };
  // v0.0.493 (Lucas playtest): Demoralize and pure sensory/social Actions ("can see or hear you", no Strike/Weapon/Area/Ranged/Melee/Handle) do not take Cover Banes.
  const covBanesOn = coverBanesApply(item, useTraits);
  // Several targets: for each creature, its DC, its cover, how you perceive it and it perceives you, and the range to it.
  const perT = [];
  if (multi) {
    const skipped = [];
    for (const tk of aimed) {
      const a = tk.actor;
      if (!a || tk.id === selfToken?.id && !areaSet?.self) continue;
      const row = { token: tk, uuid: tk.document?.uuid ?? tk.uuid, name: tk.name, actor: a, actorUuid: a.uuid, dcInfo: computeDC(item, a, preAttr, src), favored: false, doomed: false, note: [] };
      if (row.dcInfo.untrained) { row.favored = true; row.note.push({ text: "Untrained armor", cls: "boon" }); }   // its armor is beyond its training: Actions against its Armor or Ward are Favored
      const cov0 = areaOutcome?.cover?.[tk.id] ?? (selfToken && String(it.targets ?? "").trim() ? coverBetween(selfToken, tk) : null);   // an area: cover from its Point of Origin
      if (cov0?.noLoE) { skipped.push(`${tk.name}: no Line of Effect`); continue; }
      const covLow = ignoredBy(actor, "coverLower", useTraits), covHi = ignoredBy(a, "coverHigher", new Set());
      const cov = covBanesOn ? adjustCover(cov0, { lower: covLow.length, higher: covHi.length }) : { ...(cov0 ?? {}), banes: 0 };
      if (covBanesOn) pushCoverChanges(cov0, cov, covLow, covHi, tk.name, a.uuid);
      const covIgn = cov?.banes ? coverIgnored(actor, ["", "low", "medium", "high"][cov.banes] ?? "", useTraits, opts.grant?.effect?.id ?? null) : [];   // v0.0.266 (Aim): a cover level the Action ignores; v0.0.270: a grant's own use only
      if (cov?.banes && covIgn.length) coverNotices.push({ text: `${cov.label} ignored`, icon: "fa-shield-halved", active: true, tone: "boon", why: `${covIgn.join(", ")}: ${cov.label} gives no Bane against ${tk.name}`, for: a.uuid, showInDialog: true });
      // v0.0.301 (PACK BB; Ch. 3 Cover): Low 1 and Medium 2 Field Banes; High cover makes the roll Doomed (and gives no Field Banes)
      else if (cov?.banes >= 3) { row.doomed = true; row.note.push({ text: "High cover", cls: "bane" }); }
      else if (cov?.banes) extraMods.push({ id: `syn:cover|${a.uuid}`, name: `${cov.label} (${tk.name})`, boons: 0, banes: cov.banes, bb: "field", match: true, predicate: `Against ${tk.name}: ${coverWhy(cov)}${covHi.length && cov.banes > (cov0?.banes ?? 0) ? ` (${covHi.join(", ")})` : ""}` });
      if (it.area && selfToken) {   // v0.0.292 (PACK ROLL-DIALOG): an Area ignores Senses (Ch. 7): Hidden and Obscured show as n/a
        const pv = perceive(selfToken, tk, { loe: !cov?.noLoE }), lv = pv.level === "clear" ? "" : pv.level;
        if (lv === "hidden" || lv === "unsensed") extraMods.push({ id: `syn:hidden-na|${a.uuid}`, name: lv === "hidden" ? "Hidden" : "Unsensed", boons: 0, banes: 1, match: false, naWhy: "an Area ignores Senses", predicate: `You perceive ${tk.name} as ${lv === "hidden" ? "Hidden" : "Unsensed"}` });
        else if (lv === "obscured") extraMods.push({ id: `syn:obscured-na|${a.uuid}`, name: "Obscured", boons: 0, banes: 1, bb: "field", match: false, naWhy: "an Area ignores Senses", predicate: `You perceive ${tk.name} as Obscured` });
      }
      if (!it.area && selfToken) {
        const pv = perceive(selfToken, tk, { loe: !cov?.noLoE }), seenT = pv.level === "clear" ? "" : pv.level;
        if (seenT === "unsensed") { skipped.push(`${tk.name}: Unsensed`); continue; }
        if (seenT === "obscured") extraMods.push({ id: `syn:obscured|${a.uuid}`, name: `Obscured (${tk.name})`, boons: 0, banes: 1, bb: "field", match: true, predicate: `You perceive ${tk.name} as Obscured: ${pv.why}` });
        if (seenT === "hidden") { row.doomed = true; row.note.push({ text: "Hidden", cls: "bane" }); }
        const pm = perceive(tk, selfToken, { loe: !coverBetween(tk, selfToken)?.noLoE }), mineT = pm.level === "clear" ? "" : pm.level;
        const gain = youGain(seenT, mineT);   // v0.0.410 (book, Senses): only when it perceives you worse than you perceive it
        if (gain === "boon") extraMods.push({ id: `syn:obscured-you|${a.uuid}`, name: `Obscured by ${tk.name} (1 Field Boon)`, boons: 1, banes: 0, bb: "field", match: true, predicate: `${tk.name} perceives you as Obscured: ${pm.why}` });
        if (gain === "favored") { row.favored = true; row.note.push({ text: `${mineT === "hidden" ? "Hidden" : "Unsensed"} to it`, cls: "boon" }); }
      }
      if (wUse?.range && selfToken && !isAreaAction) {
        const band = rangeBand(squaresBetween(selfToken, tk), wUse.range);
        if (band?.out && !withSetup) { skipped.push(`${tk.name}: out of range (${band.squares} squares, maximum ${band.max})`); continue; }
        const rb = band?.banes ? Math.max(0, band.banes - (lessRange.all ? band.banes : lessRange.length ? 1 : 0)) : 0;   // "Ignore a Bane: one range Bane less" (Long Draw): far range 0, maximum range 1
        if (rb) extraMods.push({ id: `syn:range|${a.uuid}`, name: `${band.label} (${tk.name})${rb < band.banes ? `, ${lessRange[0]}` : ""}`, boons: 0, banes: rb, match: true, predicate: `${previewWeapon.name}: Range ${wUse.range}` });
        if (wUse.long && band?.squares <= 1) extraMods.push({ id: `syn:long|${a.uuid}`, name: `Long weapon, adjacent (${tk.name})`, boons: 0, banes: 1, bb: "field", match: true, predicate: `${previewWeapon.name} is Long: 1 Field Bane against adjacent creatures` });
      }
      if (useTraits.has("melee") && selfToken) { const fm = flankingMod(selfToken, tk, { tag: a.uuid, na: true }); if (fm) extraMods.push(fm); }   // v0.0.302: no Flanking shows why (n/a)
      if (useTraits.has("weapon") && useTraits.has("ranged") && !noEngagedTarget.length && engagedWithOther(tk, selfToken))
        extraMods.push({
          id: `syn:engaged-target|${a.uuid}`,
          name: `Engaged with ${engagedWith(tk).filter(t => (t.document?.id ?? t.id) !== (selfToken.document?.id ?? selfToken.id)).map(t => t.name).join(", ") || "another"} (${tk.name}, 1 Field Bane)`,
          boons: 0,
          banes: 1,
          bb: "field",
          match: true,
          predicate: `${tk.name} is Engaged with a creature other than you: shooting at it is harder`
        });
      perT.push(row);
    }
    const labels = uniqueLabels(perT.map(p => p.name));
    perT.forEach((p, n) => { p.label = labels[n]; });
    if (skipped.length) ui.notifications.warn(`Not affected: ${skipped.join("; ")}.`);
    if (!perT.length) return ui.notifications.warn(`${item.name} has no creature it can affect.`);
  }
  // Line of Effect and Cover: lines from the center of your square to the four corners of the target's space.
  let seen = "", seenWhy = "", outOfRange = "";   // how you perceive the target (the GM's Obscured / Hidden / Unsensed statuses); [Area] Actions ignore Senses
  if (!multi && rollsAtOthers && targetToken && selfToken && String(it.targets ?? "").trim()) {
    const cov0 = areaOutcome?.cover?.[targetToken?.id] ?? coverBetween(selfToken, targetToken);
    const covLow = ignoredBy(actor, "coverLower", useTraits), covHi = targetToken.actor ? ignoredBy(targetToken.actor, "coverHigher", new Set()) : [];
    const cov = covBanesOn ? adjustCover(cov0, { lower: covLow.length, higher: covHi.length }) : { ...(cov0 ?? {}), banes: 0 };
    if (cov?.noLoE) {
      dlgWarns.push(`No Line of Effect to ${targetToken.name}: all four corners are blocked`);   // v0.0.453 (R3): a warning in the dialog (it was a stop, or the GM's window)
    } else if (covBanesOn) {
      pushCoverChanges(cov0, cov, covLow, covHi, targetToken.name);
      if (cov?.banes) {
        const covIgn = coverIgnored(actor, ["", "low", "medium", "high"][cov.banes] ?? "", useTraits, opts.grant?.effect?.id ?? null);   // v0.0.266 (Aim); v0.0.270: a grant's own use only
        if (covIgn.length) coverNotices.push({ text: `${cov.label} ignored`, icon: "fa-shield-halved", active: true, tone: "boon", why: `${covIgn.join(", ")}: ${cov.label} gives no Bane` });
        // v0.0.301 (PACK BB): High cover is Doomed and no Field Banes; Low 1, Medium 2 Field Banes
        else if (cov.banes >= 3) extraMods.push({ id: "syn:cover", name: "High cover (Doomed)", boons: 0, banes: 0, doomed: true, bb: "field", match: true, predicate: `${coverWhy(cov)}${covHi.length && cov.banes > (cov0?.banes ?? 0) ? ` (${covHi.join(", ")})` : ""}: High cover makes the roll Doomed (and gives no Field Banes)` });
        else extraMods.push({ id: "syn:cover", name: cov.label, boons: 0, banes: cov.banes, bb: "field", match: true, predicate: `${coverWhy(cov)}${covHi.length && cov.banes > (cov0?.banes ?? 0) ? ` (${covHi.join(", ")})` : ""}` });
      }
    }
    if (!it.area) { const pv = perceive(selfToken, targetToken, { loe: !cov?.noLoE }); seen = pv.level === "clear" ? "" : pv.level; seenWhy = pv.why; }
    else { const pv = perceive(selfToken, targetToken, { loe: !cov?.noLoE }), lv = pv.level === "clear" ? "" : pv.level;   // v0.0.292: an Area ignores Senses (n/a)
      if (lv && lv !== "clear") extraMods.push({ id: `syn:${lv === "obscured" ? "obscured" : "hidden"}-na`, name: lv === "hidden" ? "Hidden" : lv === "unsensed" ? "Unsensed" : "Obscured", boons: 0, banes: 1, ...(lv === "obscured" ? { bb: "field" } : {}), match: false, naWhy: "an Area ignores Senses", predicate: `You perceive ${targetToken.name} as ${lv}` }); }
    if (seen === "unsensed") dlgWarns.push(`${targetToken.name} is Unsensed: it can't be targeted (the roll is Doomed)`);   // v0.0.453 (R3)
    if (seen === "obscured") extraMods.push({ id: "syn:obscured", name: "Target is Obscured (1 Field Bane)", full: true, boons: 0, banes: 1, bb: "field", match: true, predicate: `You perceive the target as Obscured: ${seenWhy}` });
  }
  // How your target perceives you: Obscured gives 1 boon; Hidden or Unsensed make the Action Empowered.
  let mine = "", mineWhy = "";
  if (!multi && rollsAtOthers && !it.area && targetToken) {
    if (selfToken) { const pv = perceive(targetToken, selfToken, { loe: !coverBetween(targetToken, selfToken)?.noLoE }); mine = pv.level === "clear" ? "" : pv.level; mineWhy = pv.why; }
    else mine = perceptionOf(actor);
  }
  if (youGain(seen, mine) === "boon") extraMods.push({ id: "syn:obscured-you", name: "Obscured (1 Field Boon)", full: true, boons: 1, banes: 0, bb: "field", match: true, predicate: `Your target perceives you as Obscured: ${mineWhy || "status"}` });
  const unseenYou = youGain(seen, mine) === "favored";   // v0.0.410 (book, Senses): only when it perceives you worse than you perceive it, never against a creature Hidden to you
  const untrainedTarget = !multi && rollsAtOthers && !!dcInfo.untrained;   // the target wears armor beyond its training: Favored
  if (wUse?.range && selfToken && targetToken && !multi && rollsAtOthers && !isAreaAction) {
    const band = rangeBand(squaresBetween(selfToken, targetToken), wUse.range);
    if (band?.out && withSetup) setupNotices.push({ text: `Out of range now: the Setup first`, icon: "fa-person-walking-arrow-right", why: `${targetToken.name} is ${band.squares} squares away (the maximum is ${band.max}). The Distance is checked after the Setup: if no valid target is in range then, the rest of the Action doesn't happen and its cost is still paid.` });
    else if (band?.out) { outOfRange = `out of range (${band.squares} sq., the maximum is ${band.max}${wUse.thrown ? ", thrown" : ""})`; ui.notifications.warn(`${targetToken.name} is out of range: ${band.squares} squares away, the maximum is ${band.max}${wUse.thrown ? " (thrown)" : ""}.`); }
    else if (band?.banes) { const rb = Math.max(0, band.banes - (lessRange.all ? band.banes : lessRange.length ? 1 : 0)); if (rb) extraMods.push({ id: "syn:range", name: `${band.label}${rb < band.banes ? `, ${lessRange[0]}` : ""}`, boons: 0, banes: rb, match: true, predicate: `${previewWeapon.name}: Range ${wUse.range}` }); }
    if (wUse.long && band && band.squares <= 1) extraMods.push({ id: "syn:long", name: "Long weapon, adjacent", boons: 0, banes: 1, bb: "field", match: true, predicate: `${previewWeapon.name} is Long: 1 Field Bane against adjacent creatures` });
  }
  // Ranged Combat While Engaged: a [Ranged] Action (a ranged Weapon Action, or any Action with the Ranged trait) while you are Engaged has 2 banes; against an Engaged creature, 1 bane (v0.0.169).
  // v0.0.407 (Stage 0 in Foundry; book, Chapter 3): while you are Engaged it is Doomed (roundrules.mjs ENGAGED_RANGED_DOOMED); "Ignore a Bane" (the Engaged Banes) still takes it away.
  const rangedWeapon = useTraits.has("ranged");
  // Flanking: [Melee] Actions gain a Field Boon for each other ally that flanks the target (the cancels first, then up to 2).
  if (useTraits.has("melee") && !multi && rollsAtOthers && selfToken && targetToken) { const fm = flankingMod(selfToken, targetToken, { na: true }); if (fm) extraMods.push(fm); }   // v0.0.302: no Flanking shows why (n/a)
  if (rangedWeapon && selfToken) {
    // v0.0.428: an Interrupt on "would enter a square adjacent to you" (Snap Shot) is rolled before the mover enters: it doesn't Engage you
    const engagedNow = opts.notEngagedBy ? engagedWith(selfToken).some(t => (t.document?.uuid ?? t.uuid) !== opts.notEngagedBy) : isEngaged(selfToken);
    if (engagedNow && !ignoredBy(actor, "engagedSelf", useTraits).length) extraMods.push(ENGAGED_RANGED_DOOMED
      ? { id: "syn:engaged", name: "You are Engaged (Doomed)", boons: 0, banes: 0, doomed: true, match: true, predicate: "A [Ranged] Action while you are Engaged is Doomed" }
      : { id: "syn:engaged", name: `You are Engaged (${ENGAGED_RANGED_BANES} Banes)`, boons: 0, banes: ENGAGED_RANGED_BANES, match: true, predicate: "Using a [Ranged] Action while you are Engaged is hard" });
    if (!multi && rollsAtOthers && targetToken && !noEngagedTarget.length && engagedWithOther(targetToken, selfToken))   // "Ignore a Bane" (Sharpshooter: [Shot] Actions)
      extraMods.push({
        id: "syn:engaged-target",
        // v0.0.478 (Lucas's checklist, doomed-counts-five: it read as a second "Engaged" beside "You are Engaged"): it names whom the target is Engaged with
        name: `Engaged with ${engagedWith(targetToken).filter(t => (t.document?.id ?? t.id) !== (selfToken.document?.id ?? selfToken.id)).map(t => t.name).join(", ") || "another"} (1 Field Bane)`,
        boons: 0,
        banes: 1,
        bb: "field",
        match: true,
        predicate: `${targetToken.name} is Engaged with a creature other than you: shooting at it is harder`
      });
  }
  if (opts.boons || opts.banes) extraMods.push({ id: "syn:granted", name: opts.label ?? "Granted use", boons: opts.boons ?? 0, banes: opts.banes ?? 0, match: true, predicate: "From the Action that allowed this use" });
  if (opts.excludeTargets?.length && targetToken && opts.excludeTargets.includes(targetToken.document?.uuid)) dlgWarns.push(`${targetToken.name} was already a target: the card asks for a different creature`);   // v0.0.453 (R3)
  // v0.0.494 (Playtest 8 Pass 1): Demoralize makes the target immune to your Demoralize until the end of the encounter (EoE).
  if (basicKey === "demoralize") {
    for (const tk of aimed) {
      const tu = tk?.document?.uuid ?? tk?.uuid ?? "";
      if (tu && demoralizedTarget(actor, tu)) dlgWarns.push(`${tk.name} is already immune to your Demoralize this encounter (EoE)`);
    }
  }
  // What makes the roll Doomed or Empowered, shown on the option itself ("Target is Hidden (Doomed)") (the tests' old dialog)
  const doomReason = doomStatus(actor) || (seen === "hidden" ? "Target is Hidden" : seen === "unsensed" ? "Target is Unsensed" : "");
  // Empowered and Enfeebled: what gives them, and the one value that counts (the highest of each; the Enfeebled value is taken from the Empowered one).
  const steps = damageSteps(actor, rollTraits(rollUse, src, item.name), rollsAtOthers ? (aimed[0]?.actor ?? null) : null);   // v0.0.186: the target, for "only against my marked target"
  if (opts.empowered) steps.empowered.push({ name: opts.label ?? "this Action", n: stepOf(opts.empowered) });
  const stepSources = [...steps.empowered.map(x => `${x.name}: Empowered ${x.n}`), ...steps.enfeebled.map(x => `${x.name}: Enfeebled ${x.n}`)];
  // What will add to this roll's damage or trigger when it lands, shown in the dialog so the player knows: effects with bonus damage ("Divine Surge: +1d8 Holy") and abilities that trigger ("Profane Judgment").
  const dlgTraits = rollTraits(rollUse, src, item.name), bonusSeen = new Map();
  for (const t of [1, 2, 3]) for (const b of collectBonuses(actor, dlgTraits, t, { target: rollsAtOthers ? (aimed[0]?.actor ?? null) : null, mod: src.mod })) { const bk = `${b.effect}|${b.dmg}|${b.sub}|${b.text}`; if (!bonusSeen.has(bk)) bonusSeen.set(bk, { b, tiers: [] }); bonusSeen.get(bk).tiers.push(t); }
  const dmgSubs = new Set();
  for (const v of versions) for (const tk of ["t1", "t2", "t3"]) for (const inst of v[tk] ?? []) { if ((inst.useW || inst.useD) && previewWeapon?.system?.subtype) dmgSubs.add(previewWeapon.system.subtype); if (inst.subtype) dmgSubs.add(inst.subtype); }
  for (const { b } of bonusSeen.values()) if (b.sub && b.sub !== "W") dmgSubs.add(b.sub);
  const bonusChips = [...bonusSeen.entries()].map(([key, { b, tiers }]) => ({ key, text: `${b.effect}: ${b.dmg ? `+${b.dmg}${b.sub ? ` ${TWOD12.subtypes[b.sub === "W" ? previewWeapon?.system?.subtype ?? "" : b.sub] ?? ""}` : ""}` : b.text}${tiers.length < 3 ? ` (Tier ${tiers.join(", ")})` : ""}`, why: `${b.hover || "This effect adds to the damage of this roll."} Untick it to leave it out (its effect isn't used up).` }));
  // v0.0.440 (Lucas, checklist: "the roll dialog doesn't show where the die comes from"): One More Arrow's 1[W] more, when this Strike would take it
  try {
    const mw = useTraits.has("strike") && versions.some(v => [1, 2, 3].some(t => (v[`t${t}`] ?? []).some(i => i.useW))) ? activeHooks(actor, "moreW")[0] : null;
    if (mw && await (await import("./hooks.mjs")).moreWReady(actor)) setupNotices.push({ text: `${mw.item?.name ?? "1[W] more"}: +${Math.max(1, Number(mw.hook.n) || 1)}[W] on a Tier that deals [W]`, icon: "fa-plus", active: true, tone: "boon", why: "Once on each of your turns, your first [Strike] that deals [W] deals 1[W] more (it is spent when this damage is rolled)." });
  } catch (e) { console.warn("twod12 | One More Arrow note", e); }
  // core rework batch 3: class lines on Basic Attack (Sworn Blade, Steady Draw)
  const basicLineHooks = item.getFlag?.("twod12", "basic") === "basicWeaponAttack" ? activeHooks(actor, "basicLine") : [];
  const aimedStrained = aimed.some(t => t.actor?.system?.strained);
  const steadyPreview = aimedStrained ? basicLineHooks.filter(h => Number(h.hook?.strainedBeforeD) > 0).map(h => ({ pool: "B", useW: false, wCount: 1, useD: true, dCount: Math.max(1, Number(h.hook.strainedBeforeD) || 1), dice: "", useAt: false, subtype: "", source: h.item?.name || "1[D] more" })) : [];
  for (const h of basicLineHooks) {
    if (h.hook.strainedBeforeD && aimedStrained) {
      setupNotices.push({ text: `${h.item.name}: +${Math.max(1, Number(h.hook.strainedBeforeD) || 1)}[D] on a Tier 3 (target is Strained)`, icon: "fa-bullseye", active: true, tone: "boon", why: "Against a target already Strained when you roll, your Basic Attack deals extra [D] on a Tier 3." });
    }
    if (h.hook.strained) {
      setupNotices.push({ text: `${h.item.name}: Strained — you can Slide the target 1`, icon: "fa-arrows-left-right", active: aimedStrained, tone: "boon", why: "When your Basic Attack damages a Strained target, you can Slide it 1." });
    }
  }
  const extraNotices = [...setupNotices,
    ...triggerNotices(actor, multi ? perT.map(p => p.actor) : rollsAtOthers && targetToken?.actor ? [targetToken.actor] : [], dmgSubs),
    ...coverNotices
  ];
  // v0.0.196: a shortcut (the Evade key) uses a no-roll version at once, without the dialog.
  const quick = opts.quickAp != null && versions.find(v => v.ap === Number(opts.quickAp))?.noTiers;
  // v0.0.292 (PACK ROLL-DIALOG; brief foundry/mockups/roll-dialog-brief.md): an Action that rolls against a Defense opens the new roll dialog
  // (rollwindow.mjs); a Save Action and an Action with no roll keep the old one (known gap: Checks, Saves, Linked Actions).
  // v0.0.293 (Lucas: Reactions and Opportunity Attack still had the old window): every Action used here opens it, Save Actions and Versions with no roll too
  const rdUse = !quick
    && (typeof globalThis.__twod12RollDialog === "function" || typeof foundry.applications?.api?.ApplicationV2?.prototype?.render === "function");   // (the tests answer it through __twod12RollDialog)
  let rdData = null;
  // v0.0.460: with no dialog to show them (a quick 0-cost use, the HUD's Skip roll dialog), the warnings are Foundry's notifications as before
  if ((!rdUse || (!!opts.skipDialog && !opts.restart)) && dlgWarns.length && !opts.restart) for (const w of dlgWarns) ui.notifications.warn(w);
  if (rdUse) {
    const { rollDialogInput } = await import("./rollinput.mjs"), { askAction } = await import("./rollwindow.mjs");
    const partsFor = async (v, pw = previewWeapon) => {   // v0.0.444: pw, a weapon of the dual columns
      const fxNameOf = async k => Promise.all((v.fx?.[k] ?? []).map(async x => ({ name: (await fromUuid(x.uuid))?.name ?? "?" })));
      const fxn = { all: await fxNameOf("all"), t1: await fxNameOf("t1"), t2: await fxNameOf("t2"), t3: await fxNameOf("t3") };
      const fxNames = list => list.map(x => `<span class="fxname">${esc(x.name)}</span>`).join(", ");
      const cardCtx = { item, weapon: pw, isWeapon: modOnWeapon(src, useTraits), attrMode: src.attrMode, attrVal: src.kind ? (Number(src.mod) || 0) : 0 };
      const ruleCtx = v.diceRule ? { escalation: Number(actor.system?.escalation) || 0, profane: !!(rollsAtOthers && targetToken && isProfaneFor(actor, targetToken)), more: false } : null;   // v0.0.440
      const mk = await attackModelParts({ it, item, version: v, weapon: pw, cardCtx, fxn, fxNames, areaSize: v.areaSize || areaSet?.distance, chip: src.chip, ruleCtx, extraT3: steadyPreview });
      return { tiers: mk.outcomes, crit: v.critical ? await enrich(v.critical, item) : "", effects: mk.effectsHtml, setup: it.setup ? await enrich(setupFor(it.setup, setupDone), item) : "" };
    };
    const inp = await rollDialogInput({ actor, item, versions, src, useTraits, dlgTraits, previewWeapon, multi, perT, aimed, targetToken, rollsAtOthers, isSelf, areaSet, areaOutcome, extraMods, steps, bonusSeen, usesReload,
      saveAct, setupPending: setupLater && hasSetupMove, notices: [...extraNotices], warns: dlgWarns, opts, dcInfo, seen, seenWhy, mine, unseenYou, untrainedTarget, outOfRange, talentMods: talentModsFor(actor, item), partsFor });
    // v0.0.444 (group 2; Lucas: "it shows buttons for each weapon to use"): two held weapons fit: a column for each (its Distance, its Tiers, its
    // hand's Banes) and a Roll button for each; the dialog is the main hand's, the other's Roll runs the Action again with that weapon at once
    if ((opts.dual ?? []).length > 1 && it.traits.has("weapon") && !linkedW) {
      try {
        const all = actor.itemTypes?.weapon ?? [], ws = opts.dual.map(id => actor.items.get(id)).filter(Boolean);
        const { weaponUse: wu, rangeEnds } = await import("./weaponrange.mjs");
        const strike = useTraits.has("strike") || it.traits.has("strike");
        const cols = [];
        for (const w of ws) {
          const u = wu(w, it.traits, s.reach ?? 1, wpnSquares), max = u.range ? rangeEnds(String(u.range)).max : 0;
          const out = !u.mode ? `${w.name} can't make this Action` : Number.isFinite(wpnSquares) && rollsAtOthers && !isAreaAction && max && wpnSquares > max ? `${targetToken?.name ?? "The target"} is ${wpnSquares} squares away: its Range is ${u.range}` : "";
          const banes = [];
          if (strike) {
            const hb = handBanes(all, w, isFists(w));
            if (hb.banes) banes.push({ id: "syn:hand", n: hb.banes, text: hb.banes === 3 ? "Strung, the other hand full" : hb.banes === 2 ? "Off hand" : "Off hand (Light)" });
            if (hasProp(w, "twohanded") && (Number(w.system?.hands) || 1) < 2) banes.push({ id: "syn:onehand", n: 3, text: "Two-handed weapon in one hand" });
          }
          const tiers = {};
          for (const v of versions) if (!v.noTiers) tiers[v.ap] = (await partsFor(v, w)).tiers;
          cols.push({ id: w.id, name: w.name, hand: (HAND_LABEL[handOf(all, w.id)] ?? "").toLowerCase(), mode: u.mode, thrown: !!u.thrown, dist: u.range ? `${u.thrown ? "thrown " : ""}${u.range}` : "", out, banes, tiers });
        }
        if (cols.length > 1) inp.dual = { current: previewWeapon?.id ?? cols[0].id, weapons: cols };
      } catch (e) { console.warn("twod12 | the dual columns", e); }
    }
    // v0.0.398 (Lucas): live: false: the targets change only with the dialog's Target button
    rdData = await askAction({ inp, state: opts.rdState ?? null, live: false, card: () => item.sheet?.render(true), skip: (!!opts.skipDialog && !opts.restart) || !!opts.rollAfterPlace });   // v0.0.376: the HUD's Skip roll dialog; v0.0.397: Roll placed the area: roll at once
    if (!rdData) return;
    // v0.0.440: Roll was pressed (or Roll placing the area): the Setup now; after its movement the Action runs again from the new square
    if (setupLater && (!rdData.restart || rdData.rollAfter)) {
      const st = await runSetups();
      if (!st.ok) return;
      if (st.done) return useAction(actor, item, { ...opts, rdState: rdData.state, restart: true, noSetup: true, setupRan: true, setupDone: true, stanceRan: st.stance, noHandle: true, weaponId: rdData.weaponId ?? previewWeapon?.id ?? opts.weaponId, rollAfterPlace: true });
    }
    // the targets changed on the map, or the area is placed again: the Action runs again with the same choices (no hands or turn question again;
    // v0.0.440: a Setup not made yet still comes when Roll is pressed)
    if (rdData.restart) return useAction(actor, item, { ...opts, rdState: rdData.state, restart: true, noSetup: opts.noSetup || opts.setupRan, setupRan: !!opts.setupRan || (setupLater && !!rdData.rollAfter), noHandle: true, weaponId: rdData.weaponId ?? previewWeapon?.id ?? opts.weaponId, rollAfterPlace: !!rdData.rollAfter });
  }
  const data = quick ? { ap: String(opts.quickAp), fx: [], bonusOn: [], boons: 0, banes: 0, mod: 0, dc: 13, empowered: 0, enfeebled: 0 } : rdData ? rdData : await askRoll(actor, {   // v0.0.439: only the tests reach this (no ApplicationV2.render): the old dialog, now without its preview
    title: item.name,
    attrKey: preAttr,
    traits: rollTraits(rollUse, src, item.name),
    versions,
    defaults: {
      doomedLabel: doomReason ? `${doomReason} (Doomed)` : undefined,
      empowerN: topStep(steps.empowered),
      enfeebleN: topStep(steps.enfeebled),
      dc: opts.noTargetDc ?? dcInfo.dc,
      reaction: it.reaction,
      nlKnown: true, nlSave: saveAct, nonlethal: it.traits.has("nonlethal"),   // v0.0.458: a Save Action has the switch too
      favored: unseenYou || untrainedTarget,
      favoredLabel: unseenYou ? `${mine === "hidden" ? "Hidden" : "Unsensed"} (Favored)` : (untrainedTarget ? "Target's untrained armor (Favored)" : undefined),
      empowerWhy: stepSources.join(", "),
      doomed: seen === "hidden" || seen === "unsensed" || !!doomStatus(actor),
      doomedWhy: doomStatus(actor)
        ? `${doomStatus(actor)}: all your Rolls are Doomed`
        : seen === "hidden"
            ? `Hidden: you only perceive the target by ${seenWhy}`
            : seen === "unsensed"
              ? "Unsensed: you don't perceive the target"
              : undefined
    },
    dcNote: multi ? perT.map(p => `${p.name} DC ${p.dcInfo.dc}`).join(" \u00b7 ") : dcInfo.note,
    targetActors: multi ? perT.map(p => p.actor) : rollsAtOthers && targetToken?.actor ? [targetToken.actor] : [],
    targetTiles: multi ? perT.map(p => ({ uuid: p.actorUuid, name: p.label, img: p.token.document?.texture?.src ?? p.actor.img ?? "", dc: p.dcInfo.dc })) : [],
    extraMods,
    notices: [...(opts.grant ? [{ text: `Granted use: ${String(opts.grant.effect?.name ?? opts.label ?? "").replace(/\s*\(.*\)\s*$/, "")}, ${opts.grant.grant?.ap ? `${opts.grant.grant.ap} AP` : "free"}${opts.grant.grant?.boons ? `, ${opts.grant.grant.boons} Boon${opts.grant.grant.boons === 1 ? "" : "s"}` : ""}${opts.grant.grant?.banes ? `, ${opts.grant.grant.banes} Bane${opts.grant.grant.banes === 1 ? "" : "s"}` : ""} (${Math.max(0, (opts.grant.grant?.left ?? 1) - 1)} left after this)`, icon: "fa-gift", why: "A use another Action gave you: it doesn't count toward this Action's Frequency or the 3 Strikes of your turn. For a normal use, close this and Shift-click the use button." }] : []), ...extraNotices, ...(opts.splitMode ? [SPLIT_LABEL[opts.splitMode] ? { text: `Split: ${SPLIT_LABEL[opts.splitMode]}`, icon: "fa-code-branch", why: "A Split Action is used as an Action of the mode you chose (Weapon or Power)." } : { text: `Mode: ${opts.splitMode}`, icon: "fa-shapes", why: "An Art is used in the Mode you chose." }] : []), ...(wUse?.thrown && wUse.mode === "ranged" ? [{ text: `Thrown: Ranged, Range ${wUse.range.split("/").join(" / ")}`, icon: "fa-person-rifle", why: `${previewWeapon?.name} is thrown: a Ranged Action with its Thrown Range (the target is beyond its melee Range, or the Action is Ranged). It leaves your hand.` }] : [])],
    withDamage: true,
    withReload: usesReload,
    bonusChips
  });
  const bonusKey = b => `${b.effect}|${b.dmg}|${b.sub}|${b.text}`;
  const bonusOff = new Set(bonusChips.map(c => c.key).filter(k => !(data?.bonusOn ?? []).includes(k)));
  if (!data) return;
  // v0.0.215: targets removed in the dialog are left out (and untargeted).
  if (multi && data.removed?.length) {
    const gone = new Set(data.removed);
    for (const p of perT.filter(x => gone.has(x.actorUuid))) { try { p.token.setTarget(false, { releaseOthers: false, groupSelection: true }); } catch (e) { /* gone */ } }
    perT.splice(0, perT.length, ...perT.filter(x => !gone.has(x.actorUuid)));
    if (!perT.length) return ui.notifications.warn(`${item.name} has no target left.`);
  }
  // The step the damage uses: the two chips (Empowered and Enfeebled; the player can change them, they start at the highest value that effects and conditions give), and a Reload shot adds the 1d6! by itself (v0.0.431: as Empowered does, even after this turn's first damage; you don't become Empowered).
  const reloadShot = data.reloadshot === "on";
  // v0.0.407 (book, Chapter 8; Lucas, 2026-11-13): Empowered has no value (on: 1) and Enfeebled is gone (its old values are ignored)
  const damageStep = (Math.trunc(Number(data.empowered)) || 0) > 0 || reloadShot ? 1 : 0;
  const talentMods = talentModsFor(actor, item);
  let version = applyTalentMods(versions.find(v => v.ap === Number(data.ap)), talentMods);
  // v0.0.264 (Lucas): a Grant's "On [a result], the card says [line]" goes on the granted use's card rows (freeuse.mjs withGrantLine)
  if (opts.grant?.grant) version = withGrantLine(version, opts.grant.grant);
  if (basicKey === "crawl" && version.ap >= 2 && Number(s.moveSpeed ?? s.speed ?? 0) < 5) ui.notifications.warn(`${actor.name}'s Speed is under 5: Crawl moves 3 squares only with Speed 5 or higher (use the 1 AP version).`);
  // v0.0.409 (pack F2, Roving Judgment: hooks.mjs apCost): an Action of a mark kind at this AP costs less while the passive works
  // v0.0.411 (Lean and Loose): or a Basic Action by its key (Leaning)
  const costHook = opts.free ? null : activeHooks(actor, "apCost").find(h => (h.hook.markKind || h.hook.basic) && (!h.hook.markKind || h.hook.markKind === it.markKind) && (!h.hook.basic || h.hook.basic === item.getFlag?.("twod12", "basic")) && Number(h.hook.ap) === Number(version.ap));
  const apCost = opts.free ? (opts.ap ?? 0) : costHook ? effectiveAp(actor, item, version) : version.ap;   // v0.0.428: the shared rule
  // An Escalation Action (the Apex): its Escalation is a requirement, checked before the AP is spent; nothing is spent (pack R, v0.0.243).
  const escCost = opts.free ? 0 : Math.max(0, Number(it.escalation) || 0);
  if (escCost) { const pay = canPayEscalation(actor, escCost); if (!pay.ok) return ui.notifications.warn(pay.why); }
  // v0.0.197: a movement-only Action in combat says its AP in its own chat line (the movement tag's), not in an AP line.
  const moveQuiet = !!pureMove(it, version, basicKey) && !!game.combat?.started && !!canvas?.ready;
  // v0.0.225 (Lucas): a fourth Strike in a turn asks first, as too few AP does (Linked uses don't count).
  if (it.traits.has("strike") && !opts.free && game.combat?.started) {
    const { strikesUsed } = await import("./usage.mjs");
    if (strikesUsed(actor) >= 3) {
      const { pickConfirm } = await import("./pickwindow.mjs");   // v0.0.415 (pack CL): was a DialogV2
      const ok = await pickConfirm({ title: "3 Strikes made", name: "3 Strikes made", sub: item.name, icon: "fa-hand-fist", confirm: "Use it anyway", text: `<b>${esc(actor.name)}</b> already made 3 Strikes this turn (the most a creature can make in a turn).` });
      if (!ok) return;
    }
  }
  if (apCost > 0 && !(await spendAP(actor, apCost, item.name, { quiet: moveQuiet, reaction: !!it.reaction, force: !!rdData, kind: basicKey ?? "" }))) return;   // v0.0.293: the roll dialog already warned about the AP
  // v0.0.409 (pack F2; book, Smite): the Reaction Point spent for 1 more Smite die (the roll dialog's chip); without one, no extra die
  let smiteMore = false;
  if (data.smiteMore === "on") {
    try { const C = await import("./combat.mjs"); const cb = C.combatantOf(actor); if (!cb || !game.combat?.started) smiteMore = true; else if (C.getRAP(cb) > 0) { await C.setRAP(cb, C.getRAP(cb) - 1); smiteMore = true; } else ui.notifications.warn(`${actor.name} has no Reaction Point left: no extra Smite die.`); } catch (e) { console.warn("twod12 | Smite", e); }
  }
  const isWeapon = it.traits.has("weapon");

  let attrKey = null, mod = null, weapon = null, title = "", chip = "", drawnWeaponId = "";
  if (isWeapon) weapon = await pickWeapon(actor, item, candidates, opts.weaponId);
  // v0.0.460: the Setup's draw (Darting Blade): the carried Light weapon goes to a free hand; a two-handed grip shifts to one hand to free it
  if (isWeapon && setupDraw && weapon?.id === setupDraw.id && !setupDraw.system.wielded) {
    try {
      const held = (actor.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !isFists(w) && w.id !== setupDraw.id);
      const used = held.reduce((n, w) => n + ((Number(w.system.hands) || 1) >= 2 ? 2 : 1), 0);
      const both = held.find(w => (Number(w.system.hands) || 1) >= 2);
      if (used >= 2 && both) await both.update(weaponMove("1h", "main"));
      if (used < 2 || both) {
        const mainTaken = held.some(w => (w.system.hand || "main") === "main");
        await setupDraw.update(weaponMove("1h", mainTaken || both ? "off" : "main"));
        drawnWeaponId = setupDraw.id;
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-hand", `<b>${esc(actor.name)}</b> draws ${esc(setupDraw.name)}${both && used >= 2 ? `, ${esc(both.name)} in one hand` : ""} (${esc(item.name)}'s Setup).`) });
      }
    } catch (e) { console.warn("twod12 | Setup draw", e); }
  }
  if (src.kind) {
    attrKey = src.attrKey; mod = src.mod; title = src.label; chip = `${src.chip} ${sgn(mod)}`;
    if (!attrKey && src.kind !== "attribute" && !["class", "role"].includes(actor.system?.modSource)) ui.notifications.warn(`No ${src.chip}: add a Class to this character.`);
  }

  if (title && it.vs) title += ` vs. ${it.vs === "roll" ? (TWOD12.attributes[attrKey] ?? "") : TWOD12.attributes[it.vs]}`;
  // v0.0.283: Lethal switched to Nonlethal (or back) in the dialog: a Bane on the roll, and the damage follows the choice
  const nlSwitched = data.switchNl === "on", dealsNl = it.traits.has("nonlethal") !== nlSwitched;
  if (nlSwitched && !saveAct) { extraMods.push({ id: "syn:nlswitch", name: dealsNl ? "Nonlethal instead" : "Lethal instead", boons: 0, banes: 1, match: true, predicate: "Book, Chapter 4: changing Lethal and Nonlethal costs a Bane" }); data.fx = [...(data.fx ?? []), "syn:nlswitch"]; }
  let chk = null;
  // v0.0.426 (the audit: Shifting Aim's and Blade and Bow's Boons were shown but never rolled): their chips carry the id syn:hook:N, read here from
  // the same hook data the dialog drew them from (rollinput.mjs)
  let hookMods = [];
  try { const { strikeHookChipsFor } = await import("./hooks.mjs"); hookMods = (await strikeHookChipsFor(actor, useTraits)).map((h, k) => ({ id: `syn:hook:${k}`, name: h.name, boons: h.boons, banes: 0, bb: h.field ? "field" : "" })); } catch (e) { console.warn("twod12 | hook Boons", e); }
  const fxm = resolveModifiers(actor, data.fx, [...extraMods, ...hookMods]);
  const manB = Number(data.boons) || 0, manN = Number(data.banes) || 0;
  // v0.0.292 (brief section 7): the Boons and Banes added by hand are named "Situational" on the chat card's breakdown
  const situational = (b, n) => (data.rd && (b || n) ? [{ name: "Situational", boons: b, banes: n }] : []);
  let multiRoll = null, mres = null;
  if (mod !== null && !version.noTiers && !saveAct && multi) {
    // One roll: the DC, boons, banes, Favored and Doomed are each target's own; the dice are shared.
    // v0.0.283 (brief section 6, Ch. 1 Several Targets): the dialog's one DC never overrides each target's own Defense
    const dcOverride = null;
    const globalFavored = data.favored === "on" || data.reloadshot === "on",
      globalDoomed = data.doomed === "on";
    const specs = perT.map(p => {
      const fxm = resolveModifiers(actor, modifiersForTarget(data.fx, p.actorUuid), [...extraMods, ...hookMods]);
      // v0.0.292: the roll dialog decides each creature's own Favored / Doomed (auto or by hand), Boons, Banes and Flat (perTarget)
      const pt = data.perTarget?.[p.actorUuid] ?? null, ownB = Number(pt?.boons) || 0, ownN = Number(pt?.banes) || 0, ownFlat = Number(pt?.flat) || 0;
      return {
        key: p.uuid,
        mod,
        adj: (Number(data.mod) || 0) + ownFlat,
        adjLabel: adjLabelOf(data),
        dc: dcOverride ?? p.dcInfo.dc,
        boons: fxm.boons + manB + ownB,
        banes: fxm.banes + manN + ownN,
        favored: globalFavored || (pt ? !!pt.favored : p.favored) || fxm.favored,   // v0.0.301: a source that makes the roll Favored / Doomed (High cover)
        doomed: globalDoomed || (pt ? !!pt.doomed : p.doomed) || fxm.doomed,
        sources: [...fxm.sources, ...situational(manB + ownB, manN + ownN)],
        manualBoons: manB + ownB,
        manualBanes: manN + ownN
      };
    });
    multiRoll = await performMultiCheck(specs);
    mres = multiRoll.results.map((r, i) => ({
      ...perT[i],
      chk: r.chk,
      chips: [...perT[i].note, ...r.chk.sources.map(x => ({ text: x.name.replace(/\s*\([^)]*\)\s*$/, ""), cls: x.boons ? "boon" : "bane" }))]
    }));
  } else if (mod !== null && !version.noTiers && !saveAct)
    chk = await performCheck({
      mod,
      boons: fxm.boons + manB,
      banes: fxm.banes + manN,
      dc: Number(data.dc) || 13,
      adj: Number(data.mod) || 0,
      adjLabel: adjLabelOf(data),
      favored: data.favored === "on" || data.reloadshot === "on" || fxm.favored,
      doomed: data.doomed === "on" || fxm.doomed,   // v0.0.301 (PACK BB): High cover (an old-dialog chip; the roll dialog sends it as Doomed)
      sources: [...fxm.sources, ...situational(manB, manN)],
      manualBoons: manB,
      manualBanes: manN
    });
  // For testing: a Tier picked in the dialog replaces the result of the roll.
  const forcedTier = Number(data.forceTier) || 0;
  // v0.0.334: 4 = a Critical (Tier 3 and its Critical line)
  const ft = forcedTier === 4 ? 3 : forcedTier, fcrit = forcedTier === 4;
  if (chk && ft >= 1 && ft <= 3) { chk.base = ft; chk.tier = ft; chk.doubles = fcrit; chk.crit = fcrit; chk.forced = true; }
  if (mres && ft >= 1 && ft <= 3) for (const r of mres) { r.chk.base = ft; r.chk.tier = ft; r.chk.doubles = fcrit; r.chk.crit = fcrit; r.chk.forced = true; }
  // The shield shows the Defense it rolled against: "AD 13", "WD 12" (v0.0.164) or a Vs. Attribute in two letters, "Bo 14" (Bo, Mi, Ap, In; v0.0.165);
  // "DC" when there is no target or the DC was typed in the dialog.
  const VS2 = { body: "Bo", mind: "Mi", appeal: "Ap", instinct: "In" };
  const dcWord = (info, typed) => (typed ? "DC" : info?.defense === "armor" ? "AD" : info?.defense === "ward" ? "WD" : info?.defense === "vs" && VS2[info.vs] ? VS2[info.vs] : "DC");
  if (chk) chk.dcLabel = dcWord(dcInfo, Number(data.dc) !== Number(dcInfo?.dc) || !rollsAtOthers || !targetToken);
  if (mres) for (const r of mres) r.chk.dcLabel = dcWord(r.dcInfo, false);
  const tier = chk?.tier ?? (mres ? Math.max(...mres.map(r => r.chk.tier)) : 0);
  // Effects waiting for this kind of action (bonus damage, added text); then the ones that end when it is used.
  // v0.0.186: effects' and passives' Bonus Damage, each with its own target (only against my marked target) and the Action's Modifier ([Mod]).
  // A "once per round" bonus (Killer's Focus, Radiant Zeal) only lands on a Tier that deals damage, and is then used for this turn-cycle.
  const rt = rollTraits(rollUse, src, item.name);
  const dealsAt = t => t > 0 && !version.noTiers && (version[`t${t}`] ?? []).length > 0;
  const keepOnce = (list, t) => list.filter(b => (!b.once || dealsAt(t)) && !bonusOff.has(bonusKey(b)));   // v0.0.187: and not unticked in the dialog
  if (mres) for (const r of mres) r.bonuses = keepOnce(collectBonuses(actor, rt, r.chk.tier, { target: r.token?.actor ?? null, mod: src.mod }), r.chk.tier);
  const bonuses = mres ? [...new Map(mres.flatMap(r => r.bonuses).map(b => [`${b.effect}|${b.dmg}|${b.text}`, b])).values()] : (tier && !version.noTiers ? keepOnce(collectBonuses(actor, rt, tier, { target: rollsAtOthers ? (aimed[0]?.actor ?? null) : null, mod: src.mod }), tier) : []);
  { const used = bonuses.filter(b => b.once).map(b => b.once); if (used.length && (chk || mres)) await markOnce(actor, used); }
  // v0.0.323 (PACK EFFECT-SHEET, "Next one only"): the bonus damage and the Empowered / Enfeebled it used are spent
  if (chk || mres) { const sp = [...bonuses.filter(b => b.spend).map(b => b.spend), ...[...steps.empowered, ...steps.enfeebled].filter(x => x.spend).map(x => x.spend)]; if (sp.length) { try { await markSpent(actor, sp); } catch (e) { console.warn("twod12 | spent", e); } } }
  // The "once per round" Boons and Banes that were in the roll (Elusive on the target) are used too.
  if (chk || mres) { try { await useOnceModifiers(actor, rt, multi ? perT.map(p => p.actor) : rollsAtOthers && targetToken?.actor ? [targetToken.actor] : [], null, data.fx); } catch (e) { console.warn("twod12 | once per round", e); } }
  const targetObjs = multi ? perT.map(p => p.token) : (!rollsAtOthers ? (selfToken ? [selfToken] : []) : aimed);
  const targetActorUuids = targetObjs.map(t => t?.actor?.uuid ?? t?.document?.actor?.uuid ?? "").filter(Boolean);
  // An effect whose Bonus Damage was unticked stays (it wasn't used).
  { const kept = new Set(); for (const t of [1, 2, 3]) for (const b of collectBonuses(actor, rt, t, { target: rollsAtOthers ? (aimed[0]?.actor ?? null) : null, mod: src.mod })) if (bonusOff.has(bonusKey(b))) kept.add(b.effectId);
    await expireOnUse(actor, rollTraits(rollUse, src, item.name), kept, { rolled: !!(chk || mres), targetUuids: targetActorUuids }); }
  const targets = targetObjs.map(t => ({ uuid: t.document?.uuid ?? t.uuid, name: t.name, disposition: t.document?.disposition ?? t.disposition }));   // v0.0.250: the side, for the Apply buttons
  const preStrained = targetObjs.filter(t => { if (t?.actor?.system?.strained) return true; try { const d = fromUuidSync(t.document?.uuid ?? t.uuid); return !!(d?.actor ?? d)?.system?.strained; } catch (e) { return false; } }).map(t => t.document?.uuid ?? t.uuid);   // core rework batch 3 (Steady Draw): targets already Strained when rolled
  // v0.0.243 (pack R; book, Chapter 1): once an encounter, a Critical on one of the creature's Actions raises its Escalation by 1 (at 3: nothing, not used up).
  if (game.combat?.started && (chk?.crit || mres?.some(r => r.chk?.crit))) { try { await raiseEscalation(actor, "crit"); } catch (e) { console.warn("twod12 | Escalation on a Critical", e); } }

  const dcSet = mres ? new Set(mres.map(r => r.chk.dc)) : null;
  const dc = mres ? (dcSet.size === 1 ? [...dcSet][0] : undefined) : chk?.dc;
  const ranges = dc ? [`\u2264 ${dc - 1}`, `${dc}\u2013${dc + 6}`, `\u2265 ${dc + 7}`] : ["", "", ""];
  // The tier rolled is green ("Rolled"); a better tier reached with Doubles is blue ("Doubles") and the rolled tier keeps its green.
  const dbl = !!chk?.doubles && !chk?.crit;
  const rolledTier = chk ? (chk.forced ? tier : chk.base) : 0;
  // v0.0.253 (Lucas): each effect's name on the card carries its hover card (the description, the duration, how it is applied)
  const fxName = async k => Promise.all((version.fx?.[k] ?? []).map(async x => { const it = await fromUuid(x.uuid); const d = it?.system?.duration; return { name: it?.name ?? "?", tip: it ? fxTipHtml({ name: it.name, dur: d?.type === "eot" ? "EoT" : d?.type === "rounds" ? `${d.rounds} round${d.rounds === 1 ? "" : "s"}` : "until removed", text: hoverOf(it.system?.hover, it.system?.description), what: effectWhat(it), controls: x.mode === "auto" ? "Applied with the damage." : "Applied with the Effects button." }) : "" }; }));
  const fxn = { all: await fxName("all"), t1: await fxName("t1"), t2: await fxName("t2"), t3: await fxName("t3") };
  const fxNames = list => list.map(x => `<span class="fxname"${x.tip ? ` ${tipAttrs(x.tip)}` : ""}>${esc(x.name)}</span>`).join(", ");
  const cardCtx = { item, weapon: weapon ?? previewWeapon ?? null, isWeapon: modOnWeapon(src, useTraits) && !saveAct, attrMode: saveAct ? "none" : src.attrMode, attrVal: src.kind ? (Number(src.mod) || 0) : 0,
    attrLabel: src.kind === "attribute" ? (TWOD12.attributes[src.attrKey] ?? "") : (src.chip ?? "") };
  const rowParts = [];
  for (const [i, k] of (version.noTiers ? [] : ["t1", "t2", "t3"]).entries()) {
    const n = i + 1;
    const isUp = dbl && n === tier && tier !== rolledTier, isRolled = !!chk && n === rolledTier;
    const movedUp = dbl && tier !== rolledTier;   // Doubles moved the result up: the rolled row keeps a dashed line and a small "Rolled"
    let cls = (isUp ? "up" : (isRolled ? (movedUp ? "hit base" : (n === 1 ? "hit fail" : "hit")) : "")) + (chk?.forced && n === tier ? " forced" : "");
    let tag =
      chk?.forced && n === tier
        ? `<span class="rtag forced">Forced</span>`
        : isUp
          ? `<span class="rtag dbl">Tier ${n}</span>`
          : isRolled
            ? movedUp
              ? `<span class="rtag rolled small">Rolled</span>`
              : `<span class="rtag rolled${n === 1 ? " fail" : ""}">Tier ${n}</span>`
            : "";
    if (mres) {
      const landed = mres.filter(r => r.chk.tier === n);
      cls = landed.length ? (n === 1 ? "hit fail" : "hit") : "";
      tag = landed.length ? `<span class="rtag rolled${n === 1 ? " fail" : ""}">${esc(collapseNames(landed.map(r => r.name)))}</span>` : "";
    }
    // The weapon's real dice and the Modifier, like the roll dialog's preview (the sheet keeps the book's 1[W]).
    const lines = await tierLines(version[k], n, cardCtx, expandAsText(version[`x${n}`], item.system.versions, version, n));   // "As 1 AP" written out
    const txt = lines.length ? lines.join("<br>") : "&mdash;";
    rowParts.push(`<tr class="${cls}"><th>${ranges[i] || `Tier ${n}`}</th><td><div class="tcell"><div class="ttxt">${txt}${fxn[k].length ? `<div class="fxrow">&#10022; ${fxNames(fxn[k])}</div>` : ""}</div>${tag}</div></td></tr>`);
  }
  // Critical: a row under Tier 3, gold when it happened (Doubles on a Tier 3, or 20 above the DC), dimmed otherwise.
  if (!version.noTiers && version.critical) {
    const critNames = mres ? mres.filter(r => r.chk.crit).map(r => r.name) : [];
    const happened = mres ? critNames.length > 0 : !!chk?.crit;
    const why = mres ? (critNames.length ? "Critical" : "") : (chk?.crit ? (chk.doubles && chk.base === 3 ? "Doubles" : "20 above") : "");
    const tagText = mres ? esc(collapseNames(critNames)) : "Critical";
    rowParts.push(
      `<tr class="crit${happened ? " up" : ""}"><th>Critical</th><td><div class="tcell"><div class="ttxt">${await enrich(version.critical, item)}</div>${why ? `<span class="rtag critt">${tagText}</span>` : ""}</div></td></tr>`
    );
  }
  const rows = rowParts.join("");
  const critHtml = "";
  // v0.0.453 (playtest 6, Darting Blade: the book's Effect Timing): an Effect line happens whatever the roll (it waited for a Tier 2 or 3)
  const effectsOff = false;
  const effLabel = "Effects";
  const effectsHtml = version.effects ? `<div class="effects${effectsOff ? " off" : ""}${rowParts.length || bonuses.length ? " sep" : ""}"><div class="eh">${effLabel}</div><div class="et">${await enrich(version.effects, item)}</div></div>` : "";
  // v0.0.189: the name opens the item it comes from (a Talent, a Feature, an Effect), for everyone who reads the card.
  const bonusRows = bonuses.map(b => `<div class="bonusrow"><i class="fa-solid fa-sparkle"></i> <b>${srcLink(b.effect, b.srcUuid)}</b>: ${b.dmg ? `+${esc(b.dmg)}${b.sub ? ` ${esc(TWOD12.subtypes[b.sub === "W" ? previewWeapon?.system?.subtype ?? "" : b.sub] ?? "")}` : ""}` : ""}${b.text ? ` ${esc(b.text)}` : ""}</div>`).join("");
  const dmgNeeded = (t, bon) =>
    needsDamage(
      src.attrMode !== "none" ? (src.attrMode === "all" ? 1 : 2) : 0,
      t,
      [...(t ? version[`t${t}`] : []), ...bon.filter(b => b.dmg).map(b => ({ dice: b.dmg }))],
      t
        ? [
            ...(t >= 2 ? (version.fx?.all ?? []) : []),
            ...(version.fx?.[`t${t}`] ?? []),
            ...bon.filter(b => b.fxUuid).map(b => ({ uuid: b.fxUuid, mode: "auto" }))
          ].filter(x => x.mode !== "auto")   // automatic effects are applied when the Action is used (below)
        : []
    );
  const btn = (mres ? mres.some(r => dmgNeeded(r.chk.tier, r.bonuses)) : dmgNeeded(tier, bonuses))
    ? `<div class="dmgbtn"><button type="button" data-twod12="rollDamage"><i class="fa-solid fa-dice"></i> Roll Damage${mres ? " (per Tier)" : ""}</button></div>` : "";
  const color = cardColorFor(it);
  const trow = metaRowHtml({ escalation: it.escalation ?? 0, frequency: effectiveFrequency(it), targetText: it.targets, distance: distanceText(it, weapon), distanceTip: distanceNote(it, weapon), area: areaText(it), vs: vsText(it, { src, fists: item.getFlag?.("twod12", "basic") === "fists", rolls: !version.noTiers }), requirements: it.requirements, trigger: it.trigger, reactionKind: it.reactionKind, self: isSelf });
  const areaRow = areaButton(it) ? `<div class="trow arearow">${await enrich(areaButton(it), item)}</div>` : "";   // v0.0.249 (Lucas): on the chat card even once placed, to place it again and retarget
  // v0.0.409 (pack F2, Hallowed Stance: hooks.mjs setupAdvance): once on your turn, an Action with the hook's traits gains "Setup: You Advance N" (once: by hand)
  // v0.0.410 (book, Setup: Setups don't stack): with a Setup of its own, the card offers both and you choose one
  const stance = !it.reaction ? activeHooks(actor, "setupAdvance").find(h => hasTraits(useTraits, h.hook.traits)) : null;
  const stanceN = stance ? Math.max(1, Number(stance.hook.n) || 3) : 0, stanceText = stance ? `You @Move[advance|distance:${stanceN}]{Advance ${stanceN}} (${stance.item.name}: once on your turn).` : "";
  const setupText = it.setup && stance ? `${it.setup} <i>Or, instead:</i> ${stanceText}` : (it.setup || stanceText);
  const setupInner = setupText ? await enrich(setupFor(setupText, setupDone), item) : "";
  const setupRow = setupText ? `<div class="trow setuprow"><b>Setup:</b> ${setupInner}</div>` : "";
  // Pack CARD-ONE step 3: the card's lines of this Version (cardlines.mjs, from the card model), for the chat cards: in the card's order
  let cardLines = null;
  try { const { versionCardLines } = await import("./cardlines.mjs"); cardLines = await versionCardLines(item, version, { actor, weapon: weapon ?? previewWeapon ?? null, setupHtml: setupInner || null, enrich: (t, d) => enrich(t, d), plainEffect: saveAct && !version.noTiers && !["t1", "t2", "t3"].some(t => (version[t] ?? []).length) && !!String(version.after ?? "").trim() });   /* v0.0.429: its chain ran on use */ } catch (e) { console.warn("twod12 | the card's lines", e); }
  // v0.0.283 (pack chat-cards): an Action that rolls gets the new card (chatcards.mjs); the rest (no roll, Save Actions) keep the card below.
  let ccModel = null, ccRoll = null;
  if ((chk || mres) && !version.noTiers && !saveAct) {
    const steadyCardExtra = preStrained.length ? basicLineHooks.filter(h => Number(h.hook?.strainedBeforeD) > 0).map(h => ({ pool: "B", useW: false, wCount: 1, useD: true, dCount: Math.max(1, Number(h.hook.strainedBeforeD) || 1), dice: "", useAt: false, subtype: "", source: h.item?.name || "1[D] more" })) : [];
    const mk = await attackModelParts({ it, item, version, weapon: weapon ?? previewWeapon ?? null, cardCtx, fxn, fxNames, bonuses, mres, areaSize: areaSet?.distance, chip: src.chip, ruleCtx: version.diceRule ? { escalation: Number(actor.system?.escalation) || 0, profane: !!(rollsAtOthers && targetToken && isProfaneFor(actor, targetToken)), more: smiteMore } : null, extraT3: steadyCardExtra });   // v0.0.440
    const stateOfUuid = u => { if (!u) return null; try { const d = fromUuidSync(u), a = d?.actor ?? d; return a?.system ? { preB: !!a.system.bloodied, preS: !!a.system.strained } : null; } catch (e) { return null; } };
    const rowOf = (c, name, uuid) => ({ ...ccRowOf(c, name, uuid, src.chip), ...(stateOfUuid(uuid) ?? {}) });
    const rowsM = mres ? mres.map(r => rowOf(r.chk, r.label ?? r.name, r.uuid)) : [rowOf(chk, targets[0]?.name ?? (isSelf ? actor.name : ""), targets[0]?.uuid ?? "")];
    if (mres) for (const r of mres) mk.outcomes[r.chk.tier] = mk.outcomeFor(r.chk.tier, r.bonuses ?? []);
    else if (tier) mk.outcomes[tier] = mk.outcomeFor(tier, bonuses);
    const steadyApplied = rowsM.some(r => r.tier === 3 && preStrained.includes(r.uuid)) ? basicLineHooks.filter(h => Number(h.hook?.strainedBeforeD) > 0).map(h => ({ name: h.item.name, uuid: h.item.uuid ?? "" })) : [];
    ccModel = {
      v: 1, kind: "attack", name: item.name, auto: autoChip(it.automation, it.automationNote), freq: effectiveFrequency(it), cost: it.reaction ? `${version.ap}R` : `${version.ap} AP`, traitsHtml: useTraits.size ? traitsHtml(useTraits) : "",
      tline: { targets: it.targets ?? "", dist: mk.dist, area: mk.areaHtml, names: targets.map(t => t.name) },
      rows: rowsM, outcomes: mk.outcomes, effectsHtml: mk.effectsHtml, effectsFrom: 1, critHtml: version.critical ? await enrich(version.critical, item) : "", flavor: it.flavor ?? "",
      setupHtml: setupRow, hasDamage: !!btn, card: cardLines,
      shared: mres ? { d: multiRoll.dice.d.map(x => x.faces), mod: mod + (Number(data.mod) || 0) } : null,
      designer: { odds: (mres ? mres.map(r => ({ name: r.label ?? r.name, text: oddsText(r.chk).text })) : [{ name: "", text: oddsText(chk).text }]), ruler: it.worth ?? "", mithril: it.automation ? `${TWOD12.automationRanks[it.automation] ?? it.automation}${it.automationNote ? ` (by hand: ${it.automationNote})` : ""}` : "" },
      sources: bonuses.map(b => `${b.effect}: ${b.dmg ? `+${b.dmg}${b.sub ? ` ${b.sub}` : ""}` : ""}${b.text ? ` ${b.text}` : ""}`),
      // v0.0.347 (Lucas, playtest 4: "Killer's Focus applied but there is no way of seeing it"): what this roll's damage takes from effects, by name and link
      applied: [...new Map([...bonuses.map(b => [b.effect, { name: b.effect, uuid: b.srcUuid ?? "" }]), ...steadyApplied.map(x => [x.name, x])]).values()]
    };
    // What the retarget needs to check the Tiers again with the same dice (brief 4.2)
    const dice = mres ? multiRoll.dice : { d: [{ faces: chk.d1 }, { faces: chk.d2 }, ...(chk.dropped ? [{ faces: chk.dropped }] : [])].map(x => ({ faces: x.faces, total: CC.dieValue(x.faces), first: x.faces[0] })), boonFaces: chk.boonFaces, baneFaces: chk.baneFaces };
    ccRoll = { dice: { d: dice.d.map(x => ({ faces: x.faces, total: x.total ?? CC.dieValue(x.faces), first: x.first ?? x.faces[0] })), boonFaces: dice.boonFaces ?? [], baneFaces: dice.baneFaces ?? [] },
      mod, adj: Number(data.mod) || 0, adjLabel: adjLabelOf(data), manualBoons: manB, manualBanes: manN, favored: data.favored === "on" || data.reloadshot === "on", doomed: data.doomed === "on",
      general: resolveModifiers(actor, (data.fx ?? []).filter(id => CC_GENERAL(String(id))), [...extraMods, ...hookMods]).sources, attrKey, srcKind: src.kind, forced: forcedTier || 0, chip: src.chip };
  }
  // v0.0.294 (chat cards addendum, brief section 13): an Action that makes no roll gets the new card too: no category line, no Effects box,
  // the Trigger under the meta lines, the granted Action's row, the numbered steps of its chain, the Flavor at the foot
  if (!ccModel && version.noTiers && !saveAct) {
    const NR = await import("./noroll.mjs"), { halfCtx } = await import("./halfhint.mjs");
    // v0.0.411: a Structure block's Special (Judge's 0 AP); Pack CARD-ONE step 3: it is a card line now (cardLines.before), drawn in its place
    const vText = [version.special && !cardLines ? `<b>Special:</b> ${version.special}` : "", version.effects ?? ""].filter(Boolean).join(" ");
    const use = NR.splitUse(vText ? await enrich(vText, item) : "");
    const tActor = u => { try { const d = fromUuidSync(u); return d?.documentName === "Actor" ? d : d?.actor ?? null; } catch (e) { return null; } };
    const first = targets[0] ? tActor(targets[0].uuid) : null;
    const after = String(version.after ?? "").trim(), from = it.moment && after && targets.length ? 1 : 0;
    const steps = after ? NR.stepsOf(after, { guard: /@Guard\[rally/i.test(after) && first ? (Number(first.system?.rallyHeal) || null) : null }) : [];
    // the granted Action: a PC's weapon must reach the triggering creature (Opportunity Attack); an NPC makes its Basic attack
    let useOff = "", useName = use.name;
    if (use.anchor && actor.type === "npc" && /^weapon attack$/i.test(use.name)) useName = "Basic attack";
    else if (use.anchor && /^weapon attack$/i.test(use.name) && selfToken && targets.length === 1) {
      const tok = (() => { try { return fromUuidSync(targets[0].uuid)?.object ?? null; } catch (e) { return null; } })();
      const reaches = (actor.itemTypes?.weapon ?? []).filter(w => w.system.wielded).map(w => { const r = weaponRanges(w, s.reach ?? 1); return { name: w.name, max: Math.max(0, ...`${r.melee ?? ""}/${r.ranged ?? ""}`.split("/").map(Number).filter(n => n > 0)) }; });
      if (tok && tok !== selfToken) useOff = NR.reachProblem(reaches, squaresBetween(selfToken, tok), tok.name);
    }
    ccModel = {
      v: 1, kind: "noroll", name: item.name, auto: autoChip(it.automation, it.automationNote), freq: effectiveFrequency(it), cost: it.reaction ? `${version.ap}R` : `${version.ap} AP`, traitsHtml: useTraits.size ? traitsHtml(useTraits) : "",
      tline: { distTip: distanceNote(it, weapon ?? previewWeapon ?? null), targets: it.targets ?? "", dist: sqText(distanceText(it, weapon ?? previewWeapon ?? null)) || (it.reaction && Number(it.momentRange) > 0 ? `${Number(it.momentRange)} sq.` : ""), area: "", names: targets.map(t => t.name) },
      triggerHtml: it.trigger ? await enrich(esc(it.trigger), item) : "", triggerLabel: it.reactionKind === "interrupt" ? "Interrupt" : "Trigger",
      effectHtml: use.html, useHtml: use.anchor, useName, useOff, card: cardLines,
      steps, afterDone: from ? steps.filter(x => x.k === 0).map(x => `0|${x.side}`) : [],
      // used while a Strike's damage is held (the Reactions message): its "After the damage" step waits for that damage to land
      afterWait: halfCtx.held && NR.waitsForDamage(after) && first ? { actor: first.uuid, token: targets[0].uuid } : null,
      flavor: it.flavor ?? "", designer: { ruler: it.worth ?? "", mithril: it.automation ? `${TWOD12.automationRanks[it.automation] ?? it.automation}${it.automationNote ? ` (by hand: ${it.automationNote})` : ""}` : "" }
    };
  }
  const html = ccModel ? CC.cardContent(ccModel) : `<div class="twod12 chat action" style="${cardVars(color)}">
    ${cardHead(item.name, categoryText(it), apIcon(version.ap, it.reaction), effectiveFrequency(it), it.automation, it.automationNote)}
    ${flavorHtml(it)}
    ${useTraits.size ? `<div class="traits">${traitsHtml(useTraits)}</div>` : ""}
    ${trow}${areaRow}${setupRow}
    ${(useTraits.size || trow) && (chk || mres || rows || effectsHtml || bonusRows) ? `<div class="orn">&#10022; &#10022; &#10022;</div>` : ""}
    ${chk ? checkHtml(title, chk, [chip, chk.forced ? "Tier forced" : ""].filter(Boolean), { status: version.noTiers }) : ""}
    ${mres ? multiCheckHtml(title, multiRoll.dice, mres.map(r => ({ name: r.name, label: r.label, chk: r.chk, chips: r.chips, odds: showOdds() ? oddsText(r.chk).text : "" })), [chip, forcedTier ? "Tier forced" : ""].filter(Boolean)) : ""}
    ${(chk || mres) && rows ? `<div class="orn">&#10022;</div>` : ""}
    ${rows ? `<table class="tiers">${rows}</table>` : ""}
    ${rows && (chk || mres) ? `<div class="orn">&#10022;</div>` : ""}
    ${chk && rows && showOdds() ? oddsRow(chk) : (chk && showOdds() && !rows ? oddsRow(chk) : "")}
    ${bonusRows}
    ${critHtml}${effectsHtml}
    ${fxn.all.length && !effectsOff ? `<div class="fxrow">&#10022; ${fxNames(fxn.all)}</div>` : ""}
    ${btn}${isSelf && !String(it.area ?? "").trim() ? "" : targetsRowHtml(targetEntries(targets, selfToken?.document?.disposition ?? 1), { retarget: true })}${applyAfterHtml(version, targets, selfToken, it.moment ? 1 : 0)}${it.worth ? `<div class="ac-worth">${esc(it.worth)}</div>` : ""}</div>`;
  // v0.0.195 (Lucas): a movement-only Action (Advance, Evade, Crawl) in combat starts its movement with the banner (squares left, Done) and
  // posts one short line when it ends, instead of a card whose button then posted the movement (two messages for one step).
  const mvInner = pureMove(it, version, basicKey);
  let bannerMove = false;
  if (mvInner && game.combat?.started && canvas?.ready) {
    const { parseInline } = await import("./inline.mjs"), { handleMove } = await import("./move.mjs");
    const cfg = parseInline("Move", mvInner);
    bannerMove = (await handleMove({ ...cfg, traits: [...new Set([...(cfg.traits ?? []), "self"])], banner: item.name, bannerAp: apCost }, { actor, token: selfToken })) === true;
  }
  // v0.0.292: the roll dialog's roll mode, for this roll only (the chat's own mode stays as it is)
  const rdMode = (() => { const d = {}, m = data.rollMode, CM = ChatMessage.implementation ?? ChatMessage; if (m) try { if (typeof CM.applyRollMode === "function") CM.applyRollMode(d, m); else d.rollMode = m; } catch (e) { console.warn("twod12 | roll mode", e); } return d; })();
  // v0.0.510 (Steady Draw): the roll dialog's 2dE chip, paid only when the roll got a Tier 2 or 3: the Reaction Point (in combat), once an encounter
  let steadyDE = 0;
  if (data.steadyDE === "on") {
    try {
      const h = activeHooks(actor, "basicLine").find(x => Number(x.hook?.deMore) > 0), key = h?.item?.name ?? "deMore";
      const tiers = mres ? mres.map(r => Number(r.chk?.tier) || 0) : [Number(chk?.tier) || 0];
      if (h && steadyPays(tiers)) {
        const C = await import("./combat.mjs"), cb = game.combat?.started ? C.combatantOf(actor) : null;
        if (cb && !(C.getRAP(cb) > 0)) ui.notifications.warn(`${actor.name} has no Reaction Point left: no ${key} dice.`);
        else {
          if (cb) await C.setRAP(cb, C.getRAP(cb) - 1);
          if (game.combat?.started) await actor.setFlag("twod12", "onceUsed", { ...(actor.getFlag("twod12", "onceUsed") ?? {}), [key]: game.combat.id });
          steadyDE = Number(h.hook.deMore) || 2;
        }
      }
    } catch (e) { console.warn("twod12 | Steady Draw", e); }
  }
  const cmsg = bannerMove ? null : await ChatMessage.create({
    ...rdMode,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls: mres ? multiRoll.rolls : (chk?.rolls ?? []),
    flags: {
      twod12: {
        ...(ccModel ? { cc: ccModel, ccRoll } : {}),   // v0.0.283: the new card's model (drawn for each viewer) and the dice, for the retarget
        ...(data.rd ? { rd: data.rd } : {}),   // v0.0.292 (PACK ROLL-DIALOG): the roll dialog's named sources (on chips only), per creature and shared
        action: {
          self: isSelf,
          traits: [...useTraits],
          color,
          bonuses,
          weaponSub: weapon?.system?.subtype ?? "",
          empowered: damageStep,
          reloadShot,   // v0.0.431 (the book audit Q37): its 1d6! even after this turn's first damage, and it doesn't spend Empowered
          actorUuid: actor.uuid,
          itemId: item.id,
          ap: version.ap,
          apPaid: apCost,   // v0.0.219: what was really spent (a granted use: its own cost), for a Charge given up
          tier,
          total: chk?.total ?? null,   // v0.0.174: the roll's result (Forced Movement against an Immobilized creature compares it with the Action DC of what holds it)
          results: mres ? mres.map(r => ({ uuid: r.uuid, name: r.label, tier: r.chk.tier, crit: r.chk.crit, bonuses: r.bonuses, total: r.chk.total })) : undefined,
          crit: !!chk?.crit, areaPoint: areaOutcome?.point ?? null,   // v0.0.249: the chain after the damage reads them (Prone on a Critical, a Push from the area's center)
          after: version.after ?? "", noTiers: !!version.noTiers,   // v0.0.250: a no-damage Version's chain runs from the card's Apply buttons
          weaponId: weapon?.id ?? "",
          drawnWeaponId,
          thrown: !!wUse?.thrown,   // v0.0.407 (book, Chapter 15, Thrown): thrown, its [W] deals 1 less on Tiers 2 and 3
          mode: opts.splitMode ?? "",
          triggerUuid: opts.triggerUuid ?? "",   // v0.0.409: a Reaction's triggering creature (@Condition[...|to:trigger])
          smiteMore,   // v0.0.409 (Smite): the Reaction Point spent for 1 more Smite die
          steadyDE,   // v0.0.510 (Steady Draw): n dE on Tiers 2 and 3 (the Reaction Point spent)
          attrVal: src.kind ? (Number(src.mod) || 0) : 0,   // [Mod]: the Modifier used on the roll (also Cleave's damage)
          isWeapon: modOnWeapon(src, useTraits),
          escalation: escCost > 0,   // the effects it applies end with the encounter (escalation.mjs)
          fxOnUse: true,   // its automatic effects were applied on use: the damage card doesn't apply them again
          ridersOnDamage: true,   // v0.0.283: except a damaging Tier's own effects (riders): the damage message applies them when the damage lands
          attrMode: src.attrMode,
          nl: dealsNl,
          targets,
          preStrained,
          attrLabel: src.kind === "attribute" ? (TWOD12.attributes[attrKey] ?? "") : (src.chip ?? ""),
          saveDc: saveDcOf(src, s.attributes)
        }
      }
    }
  });
  // A version with no roll has no Damage button: its automatic effects are applied now (to the targets, or to you for Self Actions).
  // A map Zone Effect on a non-Area Version (e.g. a Mode that creates fixed Difficult Terrain around you) is placed automatically on the map.
  if (version.noTiers && (version.fx?.all ?? []).length) {
    if (!areaSet) {
      const zn = await zoneOf([version]);
      if (zn) {
        for (const u of zn.uuids) zoneSkip.add(u);
        if (selfToken && canvas?.ready && canvas.grid?.isSquare) {
          try {
            const { startTemplate } = await import("./template.mjs");
            const t = zn.zone.ends?.time, rounds = t?.on && t.mode === "rounds" ? t.rounds : 0;
            await startTemplate({ shape: zn.zone.shape || "emanation", distance: Math.max(1, Number(zn.zone.size) || 1), at: "self", quick: true, auto: true, ring: !!zn.zone.ring, places: true, rounds, zone: zn.zone, source: item.name }, { token: selfToken });
          } catch (e) { console.warn("twod12 | self Zone", e); }
        }
      }
    }
    const auto = version.fx.all.filter(x => x.mode === "auto" && !zoneSkip.has(x.uuid)).map(x => x.uuid);
    if (auto.length) await applyEffects(auto, isSelf ? [actor.uuid] : targets.map(t => t.uuid), { ...originInfo(actor.uuid), escalation: escCost > 0, ...(src.kind ? { mod: Number(src.mod) || 0 } : {}) });
    // v0.0.260 (Lucas, Double Shot): the granted uses an applied effect brings are buttons on the card, one per use (freeuse.mjs)
    if (auto.length && cmsg) await attachGrantCard(cmsg, actor, auto);
  }
  // v0.0.261 (Lucas, Divine Intervention): a Reaction with a moment runs its chain by itself on the creature it answered for (no Apply button)
  // v0.0.418 (playtest 5, G8: Rebuke's Hindered never landed): a Save Action that deals no damage has no Damage button either, so its chain (its
  // Effect line: "The target is Hindered (EoT)") runs now on its targets, whatever they roll; a damaging one's chain waits for its damage
  const saveNoDamage = saveAct && !version.noTiers && !["t1", "t2", "t3"].some(t => (version[t] ?? []).length);
  // v0.0.426 (the audit's gap): the chain a damage-free Save Action runs on use, kept on its Save card so that a retarget runs it for the new creatures
  const useChain = saveNoDamage && String(version.after ?? "").trim()
    ? (chainSteps(version.after)[0]?.chips ?? []).filter(c => { const key = String(c).replace(/\{[^}]*\}$/, ""); return ![1, 2, 3].some(n => String(version[`x${n}`] ?? "").includes(key)); }).join(" ") : "";
  // A Save Action: a Save card for the creatures in the area (each player rolls their own), and the area remembers it for [HT] (v0.0.159).
  if (saveAct && !version.noTiers) {
    try {
      const { postSaveFor, saveActionCfg } = await import("./inline.mjs");
      const cfg = saveActionCfg(actor, item, version, src);
      cfg.empOn = stepOf(data.empowered) > 0;   // v0.0.468 (Lucas, checklist v0.0.467: "if I click on empowered on the roll dialog, it doesnt ask"): the dialog's Empowered (the condition's chip or one added by hand)
      cfg.nonlethal = dealsNl;   // v0.0.458: its damage Nonlethal when it has the trait or was switched to it
      if (nlSwitched) { cfg.boon = (Number(cfg.boon) || 0) + 1; cfg.nlSwitched = true; }   // the switch: every creature gains 1 Boon on its Save (book, Chapter 4)
      // the core rework A4 (Lucas, 2026-11-21; book, Chapter 1, Save Actions): the user's own Boons don't apply, its Banes do, turned around: after
      // cancelling the user's Boons and Banes, each Bane left gives every target 1 Boon on its Save (Doomed: 5, their Saves Favored)
      { const own = bbResolve(fxm.boons + manB, fxm.banes + manN, !!fxm.favored, !!fxm.doomed), ub = own.state === "doomed" ? 5 : Math.max(0, -own.net);
        if (ub) { cfg.boon = (Number(cfg.boon) || 0) + ub; cfg.userBanes = ub; } }
      const point = areaOutcome?.point ?? null;
      // v0.0.283 (pack chat-cards): this card becomes the Save card (v0.0.286: several targets too, a row each; an [HT] area's repeat keeps the old card)
      // v0.0.317 (Lucas: "without a target (setting the DC) it uses the old card"): no target is the new card too, empty, with its target button
      if (cmsg) {
        const { ccSaveOnCard } = await import("./inline.mjs");
        const model = { name: item.name, auto: autoChip(it.automation, it.automationNote), freq: effectiveFrequency(it), cost: it.reaction ? `${version.ap}R` : `${version.ap} AP`, traitsHtml: useTraits.size ? traitsHtml(useTraits) : "",
          tline: { targets: it.targets ?? "", dist: sqText(distanceText(it, weapon ?? previewWeapon ?? null)), area: "", names: targets.length ? [targets[0].name] : [] },
          triggerHtml: it.trigger ? await enrich(esc(it.trigger), item) : "", triggerLabel: it.reactionKind === "interrupt" ? "Interrupt" : "Trigger", flavor: it.flavor ?? "", card: cardLines,
          designer: { ruler: it.worth ?? "", mithril: it.automation ? `${TWOD12.automationRanks[it.automation] ?? it.automation}` : "" } };
        await ccSaveOnCard(cmsg, cfg, targets, { model, point, chain: useChain ? { chips: useChain, attrVal: src.kind ? (Number(src.mod) || 0) : null, source: item.name, done: targets.map(t => t.uuid) } : null });
      } else await postSaveFor(cfg, targets, { point, source: item.name });
      const region = areaOutcome?.region;
      if (region?.getFlag?.("twod12", "ht")) {
        const hits = Object.fromEntries(targets.map(t => [String(t.uuid).split(".").pop(), game.combat?.started ? [game.combat.round, game.combat.turn] : [0, 0]]));
        await region.setFlag("twod12", "ht", { ...region.getFlag("twod12", "ht"), save: cfg, point, hits });
      }
    } catch (e) { console.warn("twod12 | Save Action", e); }
  }
  // v0.0.440 (Lucas, checklist: Reckoning "sends a very old chat version of it, asks creatures to be pushed" before its Save card): the chain run
  // on use comes after the card has become the Save card
  if ((it.moment && version.noTiers || saveNoDamage) && String(version.after ?? "").trim() && targets.length) {
    const { runAfter } = await import("./inline.mjs");
    // v0.0.272 (pack RX): only its first step: the steps after a @Pause ("After the damage") stay buttons on the card (applyAfterHtml from step 1)
    // v0.0.421 (the audit: Reckoning gave every target Frightened before the Save): a chip that is also written in a Tier is that Tier's (it applies
    // with the Tier, to the creatures that get it), so the chain run on use leaves it out
    const inTier = c => { const key = String(c).replace(/\{[^}]*\}$/, ""); return saveNoDamage && [1, 2, 3].some(n => String(version[`x${n}`] ?? "").includes(key)); };
    try { await runAfter((chainSteps(version.after)[0]?.chips ?? []).filter(c => !inTier(c)).join(" "), { actor, targets: targets.map(t => ({ uuid: t.uuid, name: t.name })), attrVal: src.kind ? (Number(src.mod) || 0) : null, message: cmsg, source: item.name }); } catch (e) { console.warn("twod12 | moment chain", e); }
  }
  // An Action that marks (Mark Quarry; v0.0.186 the Action's "Marks the target" box): the targeted creature becomes the marked one (mark.mjs).
  // v0.0.411 (pack F3): the turn's Strike state (Shifting Aim, Blade and Bow: hooks.mjs)
  if (useTraits.has("strike")) { try { await (await import("./hooks.mjs")).noteStrike(actor, useTraits); } catch (e) { console.warn("twod12 | strike state", e); } }
  // v0.0.409 (pack F2, Armor of Faith: hooks.mjs reactionGuard): a Reaction with the hook's traits gives its user Guard (N + Pow; the higher kept)
  if (it.reaction && it.markKind !== "judge") {   // v0.0.431 (the book audit Q29): Judge's 0R is not a [Divine] Reaction for Armor of Faith
    for (const h of activeHooks(actor, "reactionGuard").filter(x => hasTraits(useTraits, x.hook.traits))) {
      try {
        const f = String(h.hook.formula ?? "1+pow").replace(/\bpow\b/g, `(${Number(actor.system?.powerMod) || 0})`), r = await bookRoll(f).evaluate(), now = Number(actor.system?.guard) || 0, next = Math.max(now, r.total);
        if (next !== now) await actor.update({ "system.guard": next });
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-shield-heart", `<b>${srcLink(h.item.name, h.item.uuid)}</b> (${esc(actor.name)}'s Passive, for using ${srcLink(item.name, item.uuid)}): <b>${esc(actor.name)}</b> ${next > now ? `gains <b>Guard ${next}</b>` : `keeps Guard ${now} (the higher; the new Guard was ${r.total})`}.`, "fxm") });   // v0.0.453 (playtest 6): the Passive named as a link, and what it answered
      } catch (e) { console.warn("twod12 | Armor of Faith", e); }
    }
  }
  // v0.0.411 (pack F3, Opening Shot: hooks.mjs openingShot): once a round, a Tier 3 with a [Ranged, Strike] Action: a line names the allies who
  // threaten the creature (each can spend 1R to make a Weapon Attack (1A) against it: by hand)
  const openHook = useTraits.has("ranged") && useTraits.has("strike") ? activeHooks(actor, "openingShot")[0] : null;
  if (openHook) {
    try {
      const hits = (mres ? mres.filter(r => r.chk?.tier === 3).map(r => r.uuid) : (tier === 3 && targets[0] ? [targets[0].uuid] : []));
      const { roundKey, usedThisCycle } = await import("./judge.mjs"), key = roundKey(game.combat);
      if (hits.length && (!key || !usedThisCycle(game.combat, actor, actor.getFlag("twod12", "openingRound")))) {   // once a round = per turn-cycle (v0.0.431)
        const { threatProfile } = await import("./flanking.mjs"), { tokenDistance } = await import("./light.mjs");
        const me = selfToken, lines = [];
        for (const u of hits) {
          const d = await fromUuid(u), tt = d?.object ?? d?.getActiveTokens?.()[0]; if (!tt || !me) continue;
          const allies = (canvas.tokens?.placeables ?? []).filter(t => t.actor && t.id !== me.id && Number(t.document.disposition) === Number(me.document.disposition) && (() => { const p = threatProfile(t.actor); return p.max > 0 && tokenDistance(t, tt) <= p.max && tokenDistance(t, tt) >= p.min; })());
          if (allies.length) lines.push(`<b>${esc(tt.name)}</b>: ${allies.map(t => esc(t.name)).join(", ")}`);
        }
        if (lines.length) {
          if (key && actor.isOwner) await actor.setFlag("twod12", "openingRound", key);
          await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-crosshairs", `<b>${esc(openHook.item.name)}</b>: one ally who threatens the creature can spend 1R to make a Basic Attack (1A) against it. ${lines.join("; ")}.`, "fxm") });
        }
      }
    } catch (e) { console.warn("twod12 | Opening Shot", e); }
  }
  if (it.marksTarget && game.user.targets.size) { try { await setQuarry(actor, [...game.user.targets][0], it.markKind ?? ""); } catch (e) { console.warn("twod12 | marking", e); } }
  // v0.0.418 (playtest 5, G4: Judge with no target did nothing): used with no target, it asks on the map (click the creature's token); skipped,
  // the card keeps an Apply Effect button that marks the creature targeted when it is clicked
  else if (it.marksTarget) {
    try {
      const { pickBar } = await import("./pickbar.mjs"), mine = new Set(actor.getActiveTokens?.().map(t => t.id) ?? []);
      const toks = (canvas?.tokens?.placeables ?? []).filter(t => t.actor && !mine.has(t.id) && t.visible !== false && !t.document?.hidden);
      const id = toks.length ? await pickBar({ icon: "fa-crosshairs", text: `<b>${esc(item.name)}</b>: which creature? Click its token.`, options: toks.map(t => ({ id: t.id, label: t.name, token: t })), cancel: "Later" }) : null;
      const tok = id && id !== "done" ? toks.find(t => t.id === id) : null;
      const { postFollow } = await import("./followup.mjs");
      if (tok) { await setQuarry(actor, tok, it.markKind ?? ""); if (cmsg) await postFollow(cmsg, "fa-crosshairs", `<b>${esc(tok.name)}</b> ${markWords(it.markKind)} <b>${esc(actor.name)}</b>.`); }
      else if (cmsg) await postFollow(cmsg, "fa-crosshairs", `No target: ${await enrich(`@Mark[${it.markKind ?? ""}]{Apply Effect}`, item)} (target the creature, then click).`);
    } catch (e) { console.warn("twod12 | marking with no target", e); }
  }
  // v0.0.412 (book, Mastery): the weapon a Strike was made with is noted for the encounter's end (no Mastery on a Tier 3 any more)
  if (!version.noTiers) { try { await masteryAfterRoll(actor, weapon, useTraits.has("strike")); } catch (e) { console.warn("twod12 | Mastery", e); } }
  // A version that rolls applies its automatic effects on use too, for the Tier each creature got: the tier's effects, the Effects row
  // on Tier 2 or 3, and the effects your bonuses add (Rimebrand's Hindered). Conditional ones stay on the damage card's Effects button.
  if (!version.noTiers) {
    // v0.0.283 (Ch. 1 Riders): a Tier's own effects ride on its damage: on a Tier that deals damage they wait for the damage message (applied if it lands)
    const ridesOn = t => (version[`t${t}`] ?? []).some(i => i.useW || i.useD || i.dice || i.useAt);
    const autoFor = (t, bon) => [...(t >= 2 ? (version.fx?.all ?? []) : []), ...(ridesOn(t) ? [] : (version.fx?.[`t${t}`] ?? [])), ...(bon ?? []).filter(b => b.fxUuid).map(b => ({ uuid: b.fxUuid, mode: "auto" }))]
      .filter(x => x.mode === "auto").map(x => x.uuid);
    const how = { ...originInfo(actor.uuid), escalation: escCost > 0, ...(src.kind ? { mod: Number(src.mod) || 0 } : {}) };   // mod: the Action DC (11 + mod) of what it applies
    if (mres) {
      for (const r of mres) { const u = autoFor(r.chk.tier, r.bonuses); if (u.length && r.chk.tier >= 1) await applyEffects(u, [isSelf ? actor.uuid : r.uuid], how); }
    } else if (tier >= 1) {
      const u = autoFor(tier, bonuses);
      if (u.length) await applyEffects(u, isSelf ? [actor.uuid] : targets.map(t => t.uuid), how);
    }
    // v0.0.421 (the audit: Trip's Prone, Thwart Cut's Tier 1 Pressed, Trick Shots' Pin and Startle never applied): a condition written in a Tier
    // that deals no damage applies now, to each creature that got that Tier (a damaging Tier's conditions wait for its damage to land: ccdamage.mjs)
    const { tierConditionChips } = await import("./inline.mjs");
    const tierConds = t => (ridesOn(t) ? [] : tierConditionChips(expandAsText(version[`x${t}`], item.system.versions, version, t)));
    const giveConds = async (t, uuids, crit) => {
      const chips = t >= 1 ? [...tierConds(t)] : [];
      // the core rework batch 2: a Critical on a Tier with no damage (Shove's Prone, Trip's 1 AP [V] 1d6! Bl): its row is asked here (optional); its
      // conditions apply with the Tier's, its dice come as a damage card of their own
      if (crit && t === 3 && !ridesOn(t) && String(version.critical ?? "").trim() && uuids.length) {
        try {
          const C = await import("./critical.mjs"), rowText = String(version.critical).trim();
          const ans = await C.askCritical({ actor, item, basic: false, rowText });
          if (ans.apply) {
            chips.push(...tierConditionChips(rowText));
            const gainAp = C.critRowAp(rowText);
            if (gainAp > 0 && game.combat?.started) {
              try {
                const CB = await import("./combat.mjs"), cb = CB.combatantOf(actor);
                if (cb) {
                  await CB.setAP(cb, CB.getAP(cb) + gainAp, `${item.name} (Critical)`, { quiet: true });
                  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-star", `<b>${esc(item.name)}</b> (Critical): <b>${esc(actor.name)}</b> gains <b>${gainAp} AP</b>.`, "fxm") });
                }
              } catch (e) { console.warn("twod12 | Critical AP", e); }
            }
            const dice = C.critRowDice(rowText);
            if (dice.length) {
              const rolls = [], comps = [];
              for (const d of dice) comps.push(await C.critComponent(d, rolls));
              const { postCcDamage } = await import("./ccdamage.mjs");
              await postCcDamage({ actor, title: `${item.name}: Critical`, groups: [{ tier: 3, crit: true, comps, fx: [], riders: [] }], targets: uuids.map(u => ({ uuid: u, name: targets.find(x => x.uuid === u)?.name ?? "", tier: 3, g: 0 })), rolls, originUuid: actor.uuid, strike: !!item.system.traits?.has?.("strike"), note: "The Critical row's damage." });
            }
            if (basicKey === "feint") {
              for (const u of uuids) {
                try {
                  const d = await fromUuid(u), ta = d?.actor ?? (d?.documentName === "Actor" ? d : null);
                  if (ta) await applyFeintNoReactions(ta, actor, how);
                } catch (e) { console.warn("twod12 | Feint Critical", e); }
              }
              const names = uuids.map(u => targets.find(x => x.uuid === u)?.name ?? "").filter(Boolean).join(", ");
              if (names) await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-star", `<b>Feint</b> (Critical): <b>${esc(names)}</b> can't use Reactions against <b>${esc(actor.name)}</b> until the end of your turn.`, "fxm") });
            }
          }
        } catch (e) { console.warn("twod12 | the Critical row", e); }
      }
      if (!chips.length || !uuids.length) return;
      const { applyConditionChip } = await import("./inline.mjs");
      for (const chip of chips) { try { await applyConditionChip(chip, { targets: uuids.map(u => ({ uuid: u, crit: !!crit })), actor, message: cmsg }); } catch (e) { console.warn("twod12 | a Tier's condition", chip, e); } }
    };
    if (mres) { for (const r of mres) await giveConds(r.chk.tier, [isSelf ? actor.uuid : r.uuid], r.chk.crit); }
    else await giveConds(tier, isSelf ? [actor.uuid] : targets.map(t => t.uuid), chk?.crit);
    // v0.0.440 (Lucas, checklist: Seizing Cut): a no-damage Tier's forced movement runs now too (Reposition 1 the target), then what follows it
    const moveNow = async (t, list) => {
      if (!(t >= 1) || ridesOn(t) || isSelf || !list.length) return;
      const { runTierMove } = await import("./inline.mjs");
      try { await runTierMove(expandAsText(version[`x${t}`], item.system.versions, version, t), { targets: list, actor, message: cmsg, attrVal: src.kind ? (Number(src.mod) || 0) : null }); } catch (e) { console.warn("twod12 | a Tier's movement", e); }
    };
    if (mres) { for (const r of mres) await moveNow(r.chk.tier, [{ uuid: r.uuid, name: r.name }]); }
    else await moveNow(tier, targets.map(t => ({ uuid: t.uuid, name: t.name })));
  }
  // Actions used because of another Action do not count toward Frequency or the Strike limit.
  // v0.0.453 (playtest 6; the book, Chapter 7): an Unfailing Action that gets a Tier 1 (every target) keeps its Frequency; its Strike still counts
  const unfailed = useTraits.has("unfailing") && !!(mres ? mres.length && mres.every(r => r.chk.tier === 1) : chk && tier === 1);
  if (!opts.free) await markUsed(actor, item, { keepFrequency: unfailed });
  if (unfailed && !opts.free) { try { await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-rotate-left", `<b>Unfailing</b>: a Tier 1, so ${srcLink(item.name, item.uuid)} isn't spent. ${esc(actor.name)} can use it again.`, "fxm") }); } catch (e) { console.warn("twod12 | Unfailing", e); } }
  else if (opts.countAtWill) { const { markAtWill } = await import("./usage.mjs"); await markAtWill(actor, item); }
  // v0.0.494 (Playtest 8 Pass 1): target becomes immune to your Demoralize (EoE)
  if (basicKey === "demoralize" && !opts.free) {
    const dTargets = (mres ? mres.map(r => r.uuid) : targets.map(t => t.uuid)).filter(Boolean);
    if (dTargets.length) await markDemoralized(actor, dTargets);
  }
  // v0.0.498 (Pass 3): Feint T2 (+2 Boons on next Strike vs target this turn) / T3 (next Strike vs target this turn is Favored)
  if (basicKey === "feint" && !version.noTiers) {
    const hits = mres ? mres.filter(r => r.chk.tier >= 2).map(r => ({ uuid: r.uuid, name: r.name, tier: r.chk.tier })) : (tier >= 2 ? targets.map(t => ({ uuid: t.uuid, name: t.name, tier })) : []);
    for (const h of hits) {
      try {
        const d = await fromUuid(h.uuid), ta = d?.actor ?? (d?.documentName === "Actor" ? d : null);
        if (!ta) continue;
        await applyFeintEffect(actor, ta, h.tier, originInfo(actor.uuid));
        const what = h.tier >= 3 ? `next <b>[Strike]</b> against <b>${esc(h.name)}</b> this turn is <b>Favored</b>` : `<b>+2 Boons</b> on next <b>[Strike]</b> against <b>${esc(h.name)}</b> this turn`;
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-masks-theater", `<b>Feint</b> (Tier ${h.tier}): <b>${esc(actor.name)}</b> — ${what}.`, "fxm") });
      } catch (e) { console.warn("twod12 | Feint", e); }
    }
  }
  // v0.0.223: the Encounter Log (enclog.mjs): the Action, its AP, each target with its tier (a Save: who saves). A movement-only Action logs its movement instead.
  if (!bannerMove) {
    try {
      const { logAction } = await import("./enclog.mjs");
      const tgs = isSelf && !String(it.area ?? "").trim() ? [] : mres ? mres.map(r => ({ uuid: r.uuid, name: r.label ?? r.name, tier: r.chk.tier, crit: !!r.chk.crit })) : targets.map(t => ({ ...t, tier: version.noTiers ? null : tier, crit: !!chk?.crit }));
      const r0 = mres?.[0]?.chk ?? chk ?? null;
      const roll = r0 ? {
        dice: [...(r0.d1 ?? []), ...(r0.d2 ?? [])].slice(0, 3),
        mod: Number(r0.mod) || 0,
        boons: Number(r0.bo) || 0,
        banes: Number(r0.ba) || 0,
        netBB: r0.state ? r0.state[0].toUpperCase() + r0.state.slice(1) : ((Number(r0.bo) || 0) - (Number(r0.ba) || 0) ? `${(Number(r0.bo) || 0) - (Number(r0.ba) || 0) > 0 ? "+" : ""}${(Number(r0.bo) || 0) - (Number(r0.ba) || 0)} B/B` : ""),
        state: r0.state ?? "",
        total: Number(r0.total) || 0,
        dc: Number(r0.dc) || 0,
        def: it.vs === "armor" ? "AD" : it.vs === "ward" ? "WD" : (TWOD12.attributes[it.vs] ?? ""),
        doubles: !!r0.doubles,
        crit: !!r0.crit
      } : null;
      // v0.0.511 (core rework section R, batch 4): Flanking on each target of a [Melee] Action (flanking.mjs, the rule the roll dialog used)
      if (it.traits.has("melee") && selfToken && canvas?.ready) {
        try {
          const { flankingFor } = await import("./flanking.mjs");
          for (const t of tgs) { const tok = canvas.tokens?.placeables?.find(x => x.document?.uuid === t.uuid || x.actor?.uuid === t.uuid); if (!tok) continue; const fl = flankingFor(selfToken, tok); if (fl.boons > 0) t.flank = fl.boons; else if (fl.raw > 0) t.flankCancel = true; }
        } catch (e) { /* no flanking info */ }
      }
      logAction(selfToken ?? actor, item, { ap: version.ap, targets: tgs, save: saveAct ? (TWOD12.attributes[it.vs] ?? it.vs ?? "") : "", free: !!opts.free, roll });
    } catch (e) { console.warn("twod12 | encounter log", e); }
  }
  // v0.0.224: Break Free. Pack TALENTS-PT (book, Break Free, 2026-11-20): it rolls a Body or Instinct Check (the higher) against the Action DC of
  // what holds you; meeting it ends Immobilized (and Grabbed, linked to it: conditions.mjs); below it, you stay Immobilized
  if (basicKey === "breakFree") {
    // the core rework B11: the card rolls its Check (the roll dialog: Doubles, Boons and Banes, Exhausted); a Tier 2 or 3 frees the creature.
    // Without a roll of the card (a shortcut that skipped it), the Check is rolled here as before.
    const { breakFreeCheck } = await import("./move.mjs"), { rollCheck } = await import("./roll.mjs");
    const bf = breakFreeCheck(actor), name = TWOD12.attributes[bf.attr];
    const r = chk ?? await rollCheck({ actor, label: `Break Free: ${name} Check`, mod: bf.mod, dc: bf.dc, chips: [`${name} ${sgn(bf.mod)}`] });
    if ((Number(r?.tier) || 0) >= 2) {
      const held = [...actor.effects].filter(e => e.statuses?.has?.("immobilized")).map(e => e.id);
      if (held.length) await actor.deleteEmbeddedDocuments("ActiveEffect", held);
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-link-slash", `<b>${esc(actor.name)}</b> breaks free: Tier ${r.tier}${r.doubles ? " (Doubles)" : ""} against the Action DC ${bf.dc}. No longer Immobilized (nor Grabbed).`, "fxm") });
    } else await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-link", `<b>${esc(actor.name)}</b> stays Immobilized: Tier 1 (${r?.total ?? "?"} against the Action DC ${bf.dc}).`, "fxm") });
  }
  // Stand: no longer Prone.
  if (item.getFlag?.("twod12", "basic") === "stand") {
    const prone = [...actor.effects].filter(e => e.statuses?.has?.("prone")).map(e => e.id);
    if (prone.length) await actor.deleteEmbeddedDocuments("ActiveEffect", prone);
  }
  if (data.reloadshot === "on") { const w = weapon ?? previewWeapon; if (w) await w.update({ "system.unloaded": true }); }
  if (opts.grant) await consumeGrant(actor, opts.grant, targets[0]?.uuid ?? "");
  // v0.0.261 (Lucas, Covering Shot): a granted use that halves the target's next damage on a Tier 3: the target's next damage card lights its Half button
  const gg = opts.grant?.grant, halves = gg && ((gg.does === "half" && halfHits(gg.on, tier ?? 0, !!chk?.crit)) || (gg.does2 === "half" && halfHits(gg.on2, tier ?? 0, !!chk?.crit)));   // v0.0.266: either line
  if (halves && targets[0]?.uuid) { try { await setHalfHint(targets[0].uuid, { source: String(opts.grant.effect?.name ?? item.name).replace(/\s*\(.*\)\s*$/, ""), by: actor.name }); } catch (e) { console.warn("twod12 | half hint", e); } }
  opts.onUsed?.({ targets });
  // v0.0.272 (pack RX): the moments an Action brings: "a Strike is made against an ally" (a Trigger: offered after its card), "an enemy stands up"
  try {
    const M = await import("./moment.mjs");
    if (useTraits.has("strike") && targets.length && rollsAtOthers) M.strikeMoment(actor, targets);
    if (basicKey === "stand" && selfToken?.document) M.moveMoment(selfToken.document, null, null, { stand: true });
  } catch (e) { console.warn("twod12 | Reactions", e); }
  // v0.0.512 (playtest 7): a Reaction that only moves you (Slip Away: Evade 1, then Advance 2) runs its movements by itself, one after the other
  const chain = autoMoveChain(version, !!it.reaction);
  if (chain.length && selfToken && game.combat?.started && !actor.statuses?.has?.("prone")) {
    try {
      const { parseInline } = await import("./inline.mjs"), { handleMove } = await import("./move.mjs"), cb = (await import("./combat.mjs")).combatantOf(actor);
      if (cb && chain.length > 1) await cb.setFlag("twod12", "thenMove", chain.slice(1));
      const mcfg = parseInline("Move", chain[0]); mcfg.traits = [...new Set([...(mcfg.traits ?? []), "self"])];
      handleMove(mcfg, { actor, token: selfToken, message: cmsg }).catch(e => console.warn("twod12 | Reaction movement", e));
    } catch (e) { console.warn("twod12 | Reaction movement", e); }
  }
  // v0.0.498 (Pass 3): Quick Shots / Darting Blade / Volley — start the Effects row's Evade automatically after rolling
  const autoEvade = autoEffectEvadeTag(version);
  if (autoEvade && !saveAct && !bannerMove && selfToken && game.combat?.started && !actor.statuses?.has?.("prone")) {
    try {
      const { parseInline } = await import("./inline.mjs"), { handleMove } = await import("./move.mjs");
      const mcfg = parseInline("Move", autoEvade);
      mcfg.traits = [...new Set([...(mcfg.traits ?? []), "self"])];
      handleMove(mcfg, { actor, token: selfToken, message: cmsg }).catch(e => console.warn("twod12 | auto-Evade", e));
    } catch (e) { console.warn("twod12 | auto-Evade", e); }
  }
  return true;
}

/**
 * v0.0.250 (cards 3, Lucas): a Version with no damage and a chain after it (Hallowed Dawn, Miraculous Recovery) gets Apply buttons on its card:
 * one per side when its chips name sides ("Allies: Apply Heal/Effects", "Enemies: Apply Damage/Effects"), else one; each runs its chips in order.
 */
/** v0.0.254: a chain's steps: the chips split at every @Pause[label] (the label names the next step: "After the damage"). */
/** v0.0.268 (Lucas: Overwatch's Hindered didn't land): the chain of a card is the one its flags carry (a Grant's line adds to it at use time, which the item's Version doesn't have); the item's is the fallback. */
export const chainOf = (f, version) => String(f?.after ?? version?.after ?? "").trim();
export function chainSteps(after) {
  const steps = [{ label: "", chips: [] }];
  for (const c of String(after ?? "").trim().split(/\s+(?=@)/).filter(Boolean)) {
    const m = c.match(/^@Pause\[([^\]]*)\]/);
    if (m) steps.push({ label: m[1].trim() || "Then", chips: [] }); else steps[steps.length - 1].chips.push(c);
  }
  return steps.filter(s => s.chips.length);
}
export function applyAfterHtml(version, targets, selfToken, from = 0) {   // v0.0.272: from: the first step that gets a button (a moment's Reaction ran step 0 by itself)
  const after = String(version?.after ?? "").trim();
  if (!after || !version?.noTiers) return "";
  const label = chips => (/@Heal\[|@Rally\[|@Guard\[|@Reduce\[/.test(chips) ? "Apply Heal/Effects" : /@Move\[|@Condition\[|@Damage\[/.test(chips) ? "Apply Damage/Effects" : "Apply Effects");
  const mine = selfToken?.document?.disposition ?? 1;
  const names = side => (targets ?? []).filter(t => { const d = t.disposition; if (d === undefined) return side === "allies"; return side === "allies" ? d === mine : d !== mine && d !== 0; }).map(t => esc(t.name));
  const btn = (chips, side, step, prefix = "") => `<button type="button" data-twod12="applyAfter" data-side="${side}" data-step="${step}"><i class="fa-solid ${side === "enemies" ? "fa-burst" : side === "allies" ? "fa-hand-holding-medical" : "fa-wand-magic-sparkles"}"></i> ${prefix}${label(chips)}</button>`;
  return chainSteps(after).map((st, k) => {
    if (k < from) return "";
    const text = st.chips.join(" "), sides = [...new Set([...text.matchAll(/\|side:(allies|enemies)\b/g)].map(m => m[1]))], prefix = st.label ? `${esc(st.label)}: ` : "";
    if (!sides.length) return `<div class="tline applyrow">${st.label ? `<span class="apside">${esc(st.label)}</span>` : ""}${btn(text, "", k, st.label ? "" : prefix)}</div>`;
    // v0.0.252 (Lucas): just "Allies" / "Enemies", a click opens the list of the creatures (a bullet each)
    // v0.0.259 (Lucas): the side and its button on one line; one creature's name beside the side, several as a small list under it (the whole width)
    return sides.map(side => { const ns = names(side), chips = st.chips.filter(c => !/\|side:/.test(c) || c.includes(`|side:${side}`)).join(" "), word = side === "allies" ? "Allies" : "Enemies";
      const head = ns.length === 1 ? `${prefix}${word}: <b>${ns[0]}</b>` : `${prefix}${word} <small>(${ns.length || "none"})</small>`;
      return `<div class="tline applyrow${ns.length > 1 ? " many" : ""}"><span class="apside">${head}</span>${btn(chips, side, k)}${ns.length > 1 ? `<ul class="aplist ${side}">${ns.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}</div>`; }).join("");
  }).join("");
}
/** The Apply button of a no-damage card: the chain's chips of that side, for that side's creatures among the card's targets. */
export async function applyAfter(msg, side = "", step = 0) {
  const f = msg.getFlag("twod12", "action");
  if (!f?.after) return;
  const steps = chainSteps(f.after), chips = steps[Number(step) || 0]?.chips.join(" ") ?? "";   // v0.0.254: one step of the chain (@Pause splits them)
  if (!chips) return;
  let actor = null;
  try { actor = f.actorUuid ? await fromUuid(f.actorUuid) : null; } catch (e) { actor = null; }
  if (actor && !actor.isOwner && !game.user.isGM) return ui.notifications.warn(`Only ${actor.name}'s owner can apply it.`);
  const { runAfter, sideTargets } = await import("./inline.mjs");
  const ctx = { actor, targets: (f.targets ?? []).map(t => ({ uuid: t.uuid, name: t.name })), attrVal: Number.isFinite(Number(f.attrVal)) && f.attrVal !== undefined ? Number(f.attrVal) : null, areaPoint: f.areaPoint ?? null, message: msg, source: actor?.items?.get(f.itemId)?.name ?? "" };
  if (side) ctx.targets = sideTargets(ctx, side);
  if (!ctx.targets.length && !/\|(?:near|who):/.test(chips)) return ui.notifications.info(`No ${side || "target"} on the card.`);
  // v0.0.294 (brief section 13): a step not possible yet is refused (the button is disabled too): the one before first, "After the damage" once it landed
  const cc = msg.getFlag("twod12", "cc");
  if (cc?.kind === "noroll") {
    const i = (cc.steps ?? []).findIndex(x => x.k === (Number(step) || 0) && (x.side ?? "") === (side ?? ""));
    const st = i >= 0 ? CC.stepState(cc, i) : { state: "ready" };
    if (st.state === "wait") return ui.notifications.warn(`${cc.steps[i].label}: ${st.why}.`);
    if (st.state === "done") return ui.notifications.info(`${cc.steps[i].label}: already done.`);
  }
  await runAfter(chips, ctx, { side });
  if (cc?.kind === "noroll") { const { markStepDone } = await import("./noroll.mjs"); await markStepDone(msg, step, side); }
}

/** v0.0.411: a Tier's instances with n more [W] on its first [W] (One More Arrow).
 *  v0.0.440 (Lucas, checklist: "where is the die coming from?"): the n [W] are a part of their own, named after the card that gives them. */
export const withMoreW = (insts, n, name = "1[W] more") => { const first = (insts ?? []).find(i => i.useW); return first ? [...insts, { ...first, wCount: n, useAt: false, dice: "", source: name }] : (insts ?? []); };
/** Pure (core rework batch 3): merge a Basic Attack's own stateLines with active basicLine hooks (Sworn Blade: Strained Slide 1). */
export function mergeBasicStateLines(base, hooks = []) {
  const out = base ? { ...base } : {};
  for (const h of hooks ?? []) {
    for (const k of ["bloodied", "strained", "bloodiedBefore", "strainedBefore"]) {
      if (h?.hook?.[k]) out[k] = out[k] ? `${out[k]} ${h.hook[k]}` : h.hook[k];
    }
  }
  return Object.values(out).some(v => String(v ?? "").trim()) ? out : null;
}
/** Pure (v0.0.510, Steady Draw): does a roll with these Tiers (one per target) pay for the 2dE? Any Tier 2 or 3. */
export const steadyPays = (tiers = []) => (tiers ?? []).some(t => Number(t) >= 2);
/** Pure (v0.0.510, Steady Draw): the n dE on a Tier 2 or 3 as a damage instance (the weapon's subtype; dE: roundrules.mjs escalationDie). */
export function steadyDice(n, tier, escalation, source = "") {
  if (!(Number(n) > 0) || tier < 2) return [];
  return [{ pool: "B", useW: false, wCount: 1, useD: false, dCount: 1, dice: `${Number(n)}d${escalationDie(escalation)}`, useAt: false, subtype: "", source: source || `${Number(n)}dE` }];
}
/** Pure (core rework batch 3, Steady Draw): extra [D] instances on Tier 3 when a target was already Strained before the roll. */
export function strainedExtraD(hooks = [], tier = 0, targets = [], preStrained = []) {
  if (tier !== 3 || !(hooks ?? []).length) return [];
  const pre = preStrained instanceof Set ? preStrained : new Set(preStrained ?? []);
  if (!(targets ?? []).some(t => pre.has(t?.uuid ?? t))) return [];
  return hooks.filter(h => Number(h?.hook?.strainedBeforeD) > 0).map(h => ({ pool: "B", useW: false, wCount: 1, useD: true, dCount: Math.max(1, Number(h.hook.strainedBeforeD) || 1), dice: "", useAt: false, subtype: "", source: h.item?.name || "1[D] more" }));
}

/** Roll the damage for the tier rolled on an action card; v0.0.388 (pack ONE): written into that card (again: the GM's "Roll the damage again"). */
export async function rollDamage(message, { again = false } = {}) {
  const f = message.getFlag("twod12", "action");
  if (!f || !f.tier) return;
  const actor = await fromUuid(f.actorUuid);
  if (!actor?.isOwner) return ui.notifications.warn("Only the owner of this character can roll its damage.");
  const item = actor.items.get(f.itemId);
  const version = item?.system.versions.find(v => v.ap === f.ap && (!f.mode || v.mode === f.mode));
  if (!version) return ui.notifications.warn("The action or version no longer exists.");
  const weapon = f.weaponId ? actor.items.get(f.weaponId) : null;
  // v0.0.428 (the audit: the GM's "Roll the damage again" dropped the Empowered die): a re-roll keeps it when the first roll had it (not spent again)
  const hadEmp = again && (message.getFlag("twod12", "ccDmg")?.groups ?? []).some(g => (g.comps ?? []).some(c => c.kind === "E"));
  const empOn = hadEmp || !!f.reloadShot || (stepOf(f.empowered) > 0 && empoweredNow(actor));   // v0.0.407: Empowered's 1d6!, once a turn (explode.mjs)
  // v0.0.411 (pack F3, One More Arrow: hooks.mjs moreW): once on each of its turns, a [Strike] that deals [W] deals 1[W] more
  let moreW = 0, moreWName = "1[W] more";
  // v0.0.426 (the audit: a Tier 1 Quick Shots, "[V] [Mod]", used it up): only a Tier that was rolled and deals [W] takes it
  const rolledTiers = f.results?.length ? f.results.map(r => r.tier).filter(t => t >= 1) : [f.tier];
  if (!again && (item.system.traits?.has?.("strike")) && rolledTiers.some(t => (version[`t${t}`] ?? []).some(i => i.useW))) {
    const mw = activeHooks(actor, "moreW");
    if (mw.length && await (await import("./hooks.mjs")).takeMoreW(actor)) { moreW = Math.max(1, Number(mw[0].hook.n) || 1); moreWName = mw[0].item?.name || "1[W] more"; }
  }
  // core rework batch 3: class lines on Basic Attack (Sworn Blade: Strained Slide 1; Steady Draw: pre-roll Strained +1[D] on Tier 3)
  const basicLines = item.getFlag?.("twod12", "basic") === "basicWeaponAttack" ? activeHooks(actor, "basicLine") : [];
  const mergedStateLines = mergeBasicStateLines(item.system.stateLines, basicLines);
  const preStrained = new Set(f.preStrained ?? []);
  let empUsed = false, empLater = false;   // v0.0.426: with several targets the Empowered die is rolled once, after the Tiers, for one creature
  // One creature's damage: its tier, its bonuses, and only that creature as the target of the damage and its effects.
  const rollFor = async (tier, bonus, targets, who, crit = false) => {
    const extraD = [...strainedExtraD(basicLines, tier, targets, preStrained), ...steadyDice(f.steadyDE, tier, actor.system?.escalation, basicLines.find(h => Number(h.hook?.deMore) > 0)?.item?.name ?? "")];
    const insts = [...(moreW ? withMoreW(version[`t${tier}`], moreW, moreWName) : version[`t${tier}`]), ...extraD, ...bonus.filter(b => b.dmg).map(b => ({ pool: b.pool, useW: false, wCount: 1, dice: b.dmg, useAt: false, subtype: b.sub === "W" ? (weapon?.system?.subtype ?? "") : b.sub, source: b.effect, srcUuid: b.srcUuid ?? "" }))];
    const riders = f.ridersOnDamage && version[`t${tier}`]?.some(i => i.useW || i.useD || i.dice || i.useAt) ? (version.fx?.[`t${tier}`] ?? []).filter(x => x.mode === "auto").map(x => ({ ...x, rider: true })) : [];
    const fx = [...[...(version.fx?.all ?? []), ...(version.fx?.[`t${tier}`] ?? []), ...bonus.filter(b => b.fxUuid).map(b => ({ uuid: b.fxUuid, mode: "auto" }))]
      .filter(x => !f.fxOnUse || x.mode !== "auto"), ...riders];   // cards from v0.0.144 on applied their automatic effects when the Action was used (v0.0.283: riders wait for the damage)
    const rolls = [];
    const ctx = { weapon, tier: tier, attrVal: f.attrVal, rolls, empowered: stepOf(f.empowered), thrown: !!f.thrown };
    // v0.0.409 (pack F2): Smite's dice (the Escalation, 1 more with the Reaction Point spent) and d8s against a Profane creature (Judged, or the Tag)
    if (version.diceRule) {
      let tDoc = null; try { tDoc = targets?.[0]?.uuid ? await fromUuid(targets[0].uuid) : null; } catch (e) { tDoc = null; }
      ctx.diceRule = version.diceRule;
      ctx.ruleCtx = { escalation: Number(actor.system?.escalation) || 0, profane: !!(tDoc && isProfaneFor(actor, tDoc?.object ?? tDoc)), more: !!f.smiteMore };
    }
    const resolved = [];
    for (const inst of insts) resolved.push(await resolveInstance(inst, ctx));
    const comps = [];
    for (const r of resolved) for (const c of r.comps) comps.push({ pool: r.inst.pool || "B", sub: c.sub, kind: c.kind, formula: c.formula, total: c.total, dice: c.dice, emp: c.emp ?? 0, ...(c.label ? { label: c.label } : {}), ...(c.src ? { src: c.src } : {}), ...(r.inst.source ? { src: r.inst.source, srcUuid: r.inst.srcUuid, label: r.inst.source } : {}) });   // v0.0.189: bonus damage names its source
    let chip = "";
    const dmgRes = resolved;
    // [Mod]: the Weapon Modifier on Tiers 2 and 3 (to the weapon's damage), the Signature Modifier for a [Signature, Weapon] Action (v0.0.181); nothing for Power, Signature and Attribute Actions. Old cards: isWeapon / attrMode "all".
    // v0.0.407 (the Bestiary, Attributes and Modifiers): an NPC's damage is written whole: its Modifier is for its rolls only (nothing added; a [Mod] written in a Tier still counts)
    const attrFrom = actor.type === "npc" && item.getFlag?.("twod12", "basic") !== "fists" ? Infinity : f.attrMode === "all" ? 1 : f.attrMode === "t2" ? 2 : f.attrMode === "none" ? Infinity : (f.isWeapon ? 2 : Infinity);
    if (tier >= attrFrom && !insts.some(i => i.useAt) && dmgRes.length) {
      const wInst = (f.attrMode === "all" ? null : dmgRes.find(r => r.inst.useW || r.inst.useD)) ?? dmgRes.find(r => r.comps.length) ?? dmgRes[0];
      const pool = wInst.inst.pool || "B";
      const sub = wInst.inst.useW || wInst.inst.useD ? (weapon?.system?.subtype ?? "") : (wInst.inst.subtype ?? "");   // v0.0.284: the Modifier keeps the damage's subtype (Ch. 1), whatever its attrMode
      comps.push({ pool, sub, kind: "A", formula: "", total: f.attrVal, dice: [], hidden: true, label: String(f.attrLabel || "Modifier").replace(/\s*Modifier$/i, "") || "Modifier" });   // v0.0.283: a visible line of the damage breakdown
      chip = `<div class="chips"><span class="chip">${esc(f.attrLabel || "Modifier")} +${f.attrVal}</span></div>`;
    }
    // v0.0.407 (Stage 0 in Foundry; book, Chapter 8, Empowered): the first damage the creature deals on each of its turns adds 1d6! of the Action's pool and type
    if (empOn && (!again || hadEmp) && !empLater && !empUsed) { const first = comps.find(c => c.kind === "W" || c.kind === "D"); const ec = first ? await empoweredComponent(first, rolls, { explode: !minorNpc(actor) }) : null; if (ec) { comps.push(ec); empUsed = true; } }
    // the core rework batch 2 (book, Chapter 1, Critical; critical.mjs): a Basic attack's 1d10! of a type it deals, or the card's own Critical row
    // (its dice rolled here, its conditions applied with the Tier's); always optional: the pick bar asks before the die is rolled
    let critConds = [], critApplied = false;
    if (crit && !again) {
      try {
        const C = await import("./critical.mjs"), rowText = String(version.critical ?? "").trim();
        const ans = await C.askCritical({ actor, item, comps, basic: C.isBasicAttack(item.system, item.getFlag?.("twod12", "basic")), rowText });
        if (ans.apply && ans.kind) comps.push(await C.critComponent({ ...ans.kind }, rolls));
        if (ans.apply && ans.row) {
          for (const d of C.critRowDice(rowText)) comps.push(await C.critComponent(d, rolls));
          critConds = (await import("./inline.mjs")).tierConditionChips(rowText);
          const gainAp = C.critRowAp(rowText);
          if (gainAp > 0 && game.combat?.started) {
            try {
              const CB = await import("./combat.mjs"), cb = CB.combatantOf(actor);
              if (cb) {
                await CB.setAP(cb, CB.getAP(cb) + gainAp, `${item.name} (Critical)`, { quiet: true });
                await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-star", `<b>${esc(item.name)}</b> (Critical): <b>${esc(actor.name)}</b> gains <b>${gainAp} AP</b>.`, "fxm") });
              }
            } catch (e) { console.warn("twod12 | Critical AP", e); }
          }
        }
        critApplied = !!ans.apply;
      } catch (e) { console.warn("twod12 | the Critical", e); }
    }
    // v0.0.283: the Tier's riders as the card shows them (its text after the damage, its effects' names)
    const riderHtml = [];
    const xt = expandAsText(version[`x${tier}`], item.system.versions, version, tier);
    if (String(xt ?? "").trim()) riderHtml.push(await enrich(String(xt).trim(), item));
    for (const b of bonus) if (b.text) riderHtml.push(esc(b.text));
    for (const x of version.fx?.[`t${tier}`] ?? []) { try { const e = await fromUuid(x.uuid); if (e) riderHtml.push(`<span class="fxname">${esc(e.name)}</span>`); } catch (e) { /* gone */ } }
    // v0.0.338 (Lucas: "the Critical should show on the damage chat card too"): a Critical's line under the Tier's
    if (crit && critApplied && String(version.critical ?? "").trim()) riderHtml.push(`<b class="cc-critl">Critical:</b> ${await enrich(String(version.critical).trim(), item)}`);
    // v0.0.418 (Lucas, playtest 5, G1-G3): the conditions written in the Tier's text are applied when its damage lands (a rule of the system,
    // read from the card's text, so a homebrew card gets it too): the chips, kept for the damage card (ccdamage.mjs applyRow)
    const conds = [...(await import("./inline.mjs")).tierConditionChips(xt), ...critConds];   // v0.0.421: not one written after a movement; the core rework: a Critical row's
    // v0.0.440 (Seizing Cut): a forced movement in the Tier runs when its damage lands, then the conditions written after it (ccdamage.mjs)
    const move = (await import("./inline.mjs")).tierMoveThen(xt) ? String(xt) : "";
    return { comps, fx, chip, rolls, riders: riderHtml, conds, move };
  };
  if (f.results?.length) {
    // Several targets: the damage is rolled once per Tier and dealt to every creature on that Tier (Several Targets), posted in one card.
    const rows = [], all = [], byTier = new Map(), byExtra = new Map();
    empLater = true;
    for (const r of f.results) {
      if (!(r.tier >= 1)) continue;
      const hasExtra = strainedExtraD(basicLines, r.tier, [r], preStrained).length > 0;
      const map = hasExtra ? byExtra : byTier;
      if (!map.has(r.tier)) { const d = await rollFor(r.tier, r.bonuses ?? [], [{ uuid: r.uuid, name: r.name }], r.name, r.tier === 3 && f.results.filter(x => x.tier === 3).every(x => x.crit)); if (hasExtra) byExtra.set(r.tier, d); else byTier.set(r.tier, d); all.push(...d.rolls); }
      const d = map.get(r.tier);
      rows.push({ uuid: r.uuid, name: r.name, tier: r.tier, crit: !!r.crit, comps: d.comps.map(c => ({ ...c })), fx: d.fx, tk: hasExtra ? `${r.tier}:s` : String(r.tier) });
    }
    if (rows.length) {
      const { postCcDamage } = await import("./ccdamage.mjs");   // v0.0.283: one group per Tier (damage rolled once per Tier), the rider written once under it
      const entries = [...[...byTier.entries()].map(([t, d]) => [String(t), t, d]), ...[...byExtra.entries()].map(([t, d]) => [`${t}:s`, t, d])].sort((a, b) => b[1] - a[1]);
      const keys = entries.map(e => e[0]);
      const groups = entries.map(([, t, d]) => ({ tier: t, crit: false, comps: d.comps, fx: d.fx, riders: d.riders, conds: d.conds, move: d.move }));
      const gOf = rows.map(r => keys.indexOf(r.tk));
      // v0.0.426 (the audit; book, Chapter 8, Empowered: "If the Action damages several creatures, you choose which one takes it"): one die, for one
      // creature: the first one hit (its own group, so the others on its Tier don't take it)
      if (empOn && (!again || hadEmp)) {
        // v0.0.460 (Lucas, checklist v0.0.459: "the creature should be allowed to choose who it applies to"): with two or more creatures hit, a
        // pick window asks which one takes it (closed: the first hit, as before)
        const can = rows.map((r, i) => i).filter(i => groups[gOf[i]].comps.some(c => c.kind === "W" || c.kind === "D"));
        let k = can[0] ?? -1;
        if (can.length > 1) {
          try {
            // v0.0.465 (Lucas, checklist v0.0.464: "allow selecting on the map"): the map bar (its token or its picture), in the HUD
            const { pickBar } = await import("./pickbar.mjs");
            const tokOf = u => { try { const d = fromUuidSync(u); return d?.object ?? d?.getActiveTokens?.()[0] ?? null; } catch (e) { return null; } };
            const pick = await pickBar({ icon: "fa-burst", cancel: false, text: `<b>Empowered</b>: ${esc(item.name)} damages several creatures. Which one takes the 1d6! (Chapter 8)? Click its token or its picture.`,
              options: can.map(i => { const t = tokOf(rows[i].uuid); return { id: String(i), label: `${rows[i].name} (Tier ${rows[i].tier})`, token: t ?? undefined, img: t?.document?.texture?.src || "" }; }) });
            if (pick !== null && pick !== undefined && can.includes(Number(pick))) k = Number(pick);
          } catch (e) { console.warn("twod12 | Empowered pick", e); }
        }
        const g0 = k >= 0 ? groups[gOf[k]] : null, ec = g0 ? await empoweredComponent(g0.comps.find(c => c.kind === "W" || c.kind === "D"), all, { explode: !minorNpc(actor) }) : null;
        if (ec) {
          if (rows.filter(r => r.tier === rows[k].tier).length === 1) g0.comps = [...g0.comps, ec];
          else { const at = gOf[k] + 1; groups.splice(at, 0, { ...g0, comps: [...g0.comps, ec] }); for (let j = 0; j < gOf.length; j++) gOf[j] = j === k ? at : gOf[j] >= at ? gOf[j] + 1 : gOf[j]; }
          empUsed = true;
        }
      }
      await postCcDamage({ actor, title: item.name, lines: mergedStateLines, groups, targets: rows.map((r, i) => ({ uuid: r.uuid, name: r.name, tier: r.tier, crit: r.crit, g: gOf[i] })), rolls: all, nl: !!f.nl, originUuid: f.actorUuid, originMod: f.attrVal, after: rows.some(r => r.tier >= 2) ? chainOf(f, version) : "", areaPoint: f.areaPoint ?? null, strike: (f.traits ?? []).includes("strike"), srcId: message.id, into: message, replace: again, escalation: !!f.escalation });
    }
  } else {
    const d = await rollFor(f.tier, f.bonuses ?? [], f.targets ?? [], "", !!f.crit);
    // v0.0.246: the Version's "After the damage" chips run once the damage is applied (an Effects row: on Tier 2 or 3)
    const { postCcDamage } = await import("./ccdamage.mjs");   // v0.0.283 (pack chat-cards): the new damage message
    await postCcDamage({ actor, title: item.name, lines: mergedStateLines, groups: [{ tier: f.tier, crit: !!f.crit, comps: d.comps, fx: d.fx, riders: d.riders, conds: d.conds, move: d.move }], targets: (f.targets ?? []).map(t => ({ ...t, tier: f.tier, crit: !!f.crit, g: 0 })), rolls: d.rolls, nl: !!f.nl, originUuid: f.actorUuid, originMod: f.attrVal, after: f.tier >= 2 ? chainOf(f, version) : "",   /* the after-chain holds Tier 2-3 riders (Club's Push): it keeps its gate */ areaPoint: f.areaPoint ?? null, strike: (f.traits ?? []).includes("strike"), srcId: message.id, into: message, replace: again, escalation: !!f.escalation });   // v0.0.272: a Strike's damage (the "would damage an ally" moment)
  }
  if (empUsed && !hadEmp && !f.reloadShot) await markEmpoweredUsed(actor);
  // (the card is no longer collapsed: v0.0.388, the damage is on it)
}

/** The bullseye on an Action card: its targets become the tokens targeted now (or selected), for the damage, Saves and Cleave that follow. */
export async function retargetAction(msg) {
  const toks = game.user.targets.size ? [...game.user.targets] : (canvas.tokens?.controlled ?? []);
  if (!toks.length) return ui.notifications.warn("Target or select a token first.");
  if (msg.getFlag("twod12", "cc")?.kind === "attack") return retargetCc(msg, toks);
  if (msg.getFlag("twod12", "cc")?.kind === "noroll") {   // v0.0.294: the non-roll card: its target line and the targets its steps apply to
    const m = foundry.utils.deepClone(msg.getFlag("twod12", "cc")), targets = toks.map(t => ({ uuid: t.document.uuid, name: t.name, disposition: t.document.disposition }));
    m.tline = { ...(m.tline ?? {}), names: targets.map(t => t.name) };
    // v0.0.351 (Lucas: "retargeting should retarget the buttons' targets as well"): a card with granted uses (Double Shot) keeps its list, now paired
    // with the new targets
    let content = CC.cardContent(m);
    const upd = { "flags.twod12.cc": m, "flags.twod12.action.targets": targets };
    const gc = msg.getFlag("twod12", "grantCard");
    if (gc) {
      const card = { ...gc, targets: targets.map(t => ({ uuid: t.uuid, name: t.name })) };
      let actor = null; try { actor = gc.actorUuid ? await fromUuid(gc.actorUuid) : null; } catch (e) { actor = null; }
      const { grantRowsHtml } = await import("./freeuse.mjs");
      content = content.replace(/<\/div>\s*$/, `${grantRowsHtml(actor, card)}</div>`);
      upd["flags.twod12.grantCard"] = card;
    }
    try { await msg.update({ content, ...upd }); } catch (e) { ui.notifications.warn("Only the author of this card or the GM can change its targets."); }
    return;
  }
  const targets = toks.map(t => ({ uuid: t.document.uuid, name: t.name, disposition: t.document.disposition }));
  const mine = canvas.tokens?.get(msg.speaker?.token)?.document.disposition ?? game.actors.get(msg.speaker?.actor)?.getActiveTokens?.()[0]?.document.disposition ?? 1;
  // v0.0.260 (Lucas): a card with several targets has the class "many" on its row (v0.0.259): the pattern takes it, or the retarget changed nothing
  let content = msg.content.replace(/<div class="tline cardtargets(?: many)?">[\s\S]*?<\/div>/, targetsRowHtml(targetEntries(targets, mine), { retarget: true }));
  // v0.0.251 (Lucas): the Apply rows of a no-damage card follow the new targets
  const f = msg.getFlag("twod12", "action");
  if (f?.after && f.noTiers) {
    let me = null; try { const a = f.actorUuid ? fromUuidSync(f.actorUuid) : null; me = a?.token?.object ?? a?.getActiveTokens?.()[0] ?? null; } catch (e) { me = null; }
    const rows = applyAfterHtml({ after: f.after, noTiers: true }, targets, me);
    content = content.replace(/(?:<div class="tline applyrow(?: many)?">[\s\S]*?<\/div>)+/, rows);
    if (!content.includes('class="tline applyrow') && rows) content = content.replace(/(<div class="tline cardtargets(?: many)?">[\s\S]*?<\/div>)/, `$1${rows}`);
  }
  try { await msg.update({ content, "flags.twod12.action.targets": targets }); }
  catch (e) { ui.notifications.warn("Only the author of this card or the GM can change its targets."); }
}

/**
 * v0.0.283 (pack chat-cards, brief 4.2): the retarget of a new card keeps the dice and checks each new target's Tier again against its own Defense,
 * Boons, Banes, Favored and Doomed (its own effects and Flanking; the dialog's general choices are kept). Refused once damage from the card was applied.
 */
async function retargetCc(msg, toks) {
  if (msg.getFlag("twod12", "ccApplied")) return ui.notifications.warn("Damage from this card was applied: its targets can't change now.");
  if (!msg.isAuthor && !game.user.isGM) return ui.notifications.warn("Only the author of this card or the GM can change its targets.");
  const f = msg.getFlag("twod12", "action"), model = foundry.utils.deepClone(msg.getFlag("twod12", "cc")), roll = foundry.utils.deepClone(msg.getFlag("twod12", "ccRoll"));
  const actor = f?.actorUuid ? await fromUuid(f.actorUuid) : null, item = actor?.items?.get?.(f.itemId);
  if (!actor || !item || !roll) return ui.notifications.warn("The Action of this card no longer exists.");
  const src = rollSource(actor.system, item.system), traits = new Set(f.traits ?? []), selfToken = actor.getActiveTokens?.()[0] ?? null;
  const VS2 = { body: "Bo", mind: "Mi", appeal: "Ap", instinct: "In" };
  const label = info => (info?.defense === "armor" ? "AD" : info?.defense === "ward" ? "WD" : info?.defense === "vs" && VS2[info.vs] ? VS2[info.vs] : "DC");
  const specs = toks.map(t => {
    const info = computeDC(item, t.actor, roll.attrKey, src), own = [];
    for (const m of modifierList(actor, traits, [t.actor])) { const id = String(m.id), owner = id.startsWith("syn:") ? (id.split("|")[1] ?? null) : (id.includes("|") ? id.split("|")[0] : null); if (m.match && owner === t.actor?.uuid) own.push(m); }
    if (traits.has("melee") && selfToken) { const fm = flankingMod(selfToken, t); if (fm) own.push(fm); }
    const sources = [...(roll.general ?? []), ...own.map(m => ({ name: m.name, boons: m.boons ?? 0, banes: m.banes ?? 0, bb: m.bb ?? "" }))];
    const n = bbCount(sources);   // v0.0.301 (PACK BB): the limit of 2 per name; the ones added by hand have no name
    return { name: t.name, uuid: t.document.uuid, dc: info.dc, dcLabel: label(info), boons: n.boons + (roll.manualBoons || 0), banes: n.banes + (roll.manualBanes || 0), sources, favored: !!info.untrained, doomed: false };
  });
  const need = CC.missingDice(roll, specs), more = [];
  if (need.d12) { const faces = []; for (let i = 0; i < 15; i++) { const r = await new Roll("1d12").evaluate(); more.push(r); faces.push(r.total); if (r.total !== 12) break; } roll.dice.d.push({ faces, total: CC.dieValue(faces), first: faces[0] }); }
  if (more.length) { try { const { showDice } = await import("./roll.mjs"); await showDice(more); } catch (e) { /* no dice to show */ } }
  const { resolveShared } = await import("./roll.mjs");
  const res = CC.recheckRows(roll, specs, resolveShared);
  const old = foundry.utils.deepClone(model);
  const tokState = new Map(toks.map(t => [t.document.uuid, { preB: !!t.actor?.system?.bloodied, preS: !!t.actor?.system?.strained }]));
  model.rows = res.map(r => ({ ...ccRowOf(r.chk, r.name, r.uuid, roll.chip), ...(tokState.get(r.uuid) ?? {}) }));
  model.tline.names = res.map(r => r.name);
  model.shared = res.length > 1 ? { d: roll.dice.d.map(x => x.faces), mod: roll.mod + roll.adj } : null;
  const targets = toks.map(t => ({ uuid: t.document.uuid, name: t.name, disposition: t.document.disposition }));
  const preStrained = toks.filter(t => !!t.actor?.system?.strained).map(t => t.document.uuid);
  const tier = Math.max(...res.map(r => r.chk.tier));
  const upd = { content: CC.replaceCard(msg.content, old, model), "flags.twod12.cc": model, "flags.twod12.ccRoll": roll, "flags.twod12.action.targets": targets, "flags.twod12.action.preStrained": preStrained, "flags.twod12.action.tier": tier, "flags.twod12.action.crit": res.length === 1 && !!res[0].chk.crit, "flags.twod12.action.total": res.length === 1 ? res[0].chk.total : null,
    "flags.twod12.action.results": res.length > 1 ? res.map(r => ({ uuid: r.uuid, name: r.name, tier: r.chk.tier, crit: r.chk.crit, bonuses: f.bonuses ?? [], total: r.chk.total })) : null };
  try { await msg.update(upd); } catch (e) { ui.notifications.warn("Only the author of this card or the GM can change its targets."); }
}

/**
 * v0.0.196 (Lucas): a shortcut for a Basic Action of the selected token (the Evade key: Evade, 1 AP, straight to the movement banner).
 * Returns false when there is no single selected token of yours, or it has no such Action.
 */
/** v0.0.221 (Lucas): Favorite number n (1-9) of the selected token, by the Favorites' order on the sheet. */
export async function quickFavorite(n) {
  const tokens = canvas?.tokens?.controlled?.filter(t => t.actor?.isOwner) ?? [];
  if (tokens.length !== 1) { ui.notifications.warn("Select your token first."); return false; }
  const actor = tokens[0].actor, id = (actor.getFlag("twod12", "favorites") ?? [])[n - 1], item = id ? actor.items.get(id) : null;
  if (!item) { ui.notifications.warn(`${actor.name} has no Favorite ${n} (star Actions on the sheet: their order is their number).`); return false; }
  await useAction(actor, item);
  return true;
}

export async function quickBasic(key, ap = null) {
  const tokens = canvas?.tokens?.controlled?.filter(t => t.actor?.isOwner) ?? [];
  if (tokens.length !== 1) { ui.notifications.warn("Select your token first."); return false; }
  const actor = tokens[0].actor;
  let item = actor.items.find(i => i.type === "action" && i.getFlag("twod12", "basic") === key);
  // v0.0.221: Weapon Attack's key on an NPC uses its Basic attack (NPCs have no Weapon Attack).
  if (!item && key === "basicWeaponAttack" && actor.type === "npc") item = actor.itemTypes.action.find(i => i.system?.basicAttack) ?? actor.itemTypes.action.find(i => /^basic attack$/i.test(String(i.system?.category ?? "")));
  if (!item) { ui.notifications.warn(`${actor.name} has no ${{ safeMovement: "Evade", basicWeaponAttack: "Basic Attack", rally: "Steel Yourself", advance: "Advance" }[key] ?? key} Action.`); return false; }
  // v0.0.197 (Lucas): which version, when there are several (Evade: 1 AP, Evade 1; 2 AP, Evade half your Speed).
  const vs = [...item.system.versions].sort((a, b) => a.ap - b.ap);
  if (ap === null && vs.length > 1) {
    const speed = Number(actor.system?.moveSpeed ?? actor.system?.speed) || 0;
    const label = v => (key === "safeMovement" ? `Evade ${v.ap >= 2 ? Math.floor(speed / 2) : 1} (${v.ap} AP)` : `${item.name} (${v.ap} AP)`);
    const { pickOne } = await import("./pickwindow.mjs");   // v0.0.415 (pack CL): was a DialogV2
    const k = await pickOne({ title: `${actor.name}: ${item.name}`, name: item.name, sub: actor.name, icon: "fa-person-running", text: `Which ${item.name}?`, options: vs.map(v => ({ k: String(v.ap), l: label(v) })) });
    ap = k === null ? null : Number(k);
    if (ap === null || ap === undefined) return false;
  }
  await useAction(actor, item, { quickAp: ap ?? vs[0]?.ap ?? 1 });
  return true;
}
