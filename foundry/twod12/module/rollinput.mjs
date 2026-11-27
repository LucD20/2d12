// v0.0.292 (PACK ROLL-DIALOG): what the roll dialog shows, built from what useAction (actions.mjs) already computed: the Versions (traits, meta line,
// Tier table), the Modifier chips (each source by name, its scope: shared, or one creature's), the creatures and their Defenses, the blocked states.
// The dialog itself is rolldlg.mjs (pure) and rollwindow.mjs (the window).
import { TWOD12, traitGroupOf, orderTraits, effectiveFrequency, FREQ_COLORS, distanceText, vsText, doomStatus, highlightText } from "./config.mjs";
import { modifierList } from "./effects.mjs";
import { bonusesNotNow } from "./bonus.mjs";
import { isFaded } from "./usage.mjs";
import { combatantOf, getAP, getRAP } from "./combat.mjs";
import { applyTalentMods } from "./preview.mjs";
import { esc } from "./util.mjs";
import { saveDcOf } from "./rollsource.mjs";
import { cleanLabel, versionButtons } from "./cardview.mjs";
import { versionCardLines } from "./cardlines.mjs";   // Pack CARD-ONE step 3
export { cleanLabel };

/** The kinds of synthetic modifiers that are about one target (the creature's box), not about you (the shared panel). */
const TARGET_SYN = new Set(["cover", "obscured", "obscured-you", "range", "long", "engaged-target", "flanking", "hidden-na", "obscured-na"]);
// v0.0.297: cleanLabel moved to cardview.mjs (pure: the sheet card's "Your roll" strip uses it too); re-exported here
const dcWord = info => (info?.defense === "armor" ? "AD" : info?.defense === "ward" ? "WD" : info?.defense === "vs" ? ({ body: "Bo", mind: "Mi", appeal: "Ap", instinct: "In" })[info.vs] ?? "DC" : "DC");

/** The roll modes Foundry offers, [[key, label]], and the chat's current one. */
function rollModes() {
  try {
    const list = Object.entries(CONFIG.Dice?.rollModes ?? {}).map(([k, v]) => [k, game.i18n.localize(typeof v === "string" ? v : v?.label ?? k)]);
    let cur = "publicroll"; try { cur = game.settings.get("core", "rollMode") ?? cur; } catch (e) { /* V14 may name it otherwise */ }
    return { list, cur };
  } catch (e) { return { list: [], cur: "publicroll" }; }
}

/**
 * c: { actor, item, versions, src, useTraits, dlgTraits, previewWeapon, multi, perT, targetToken, rollsAtOthers, isSelf, areaSet, areaOutcome, extraMods, steps,
 *   bonusSeen (Map), usesReload, notices, opts, dcInfo, seen, seenWhy, mine, unseenYou, untrainedTarget, outOfRange, partsFor(version) → { tiers, crit, effects } }
 */
export async function rollDialogInput(c) {
  const { actor, item, src } = c, it = item.system;
  const tname = k => TWOD12.traits[k] ?? k;
  const traits = orderTraits([...c.useTraits].filter(k => !String(k).startsWith("__"))).map(k => { const g = traitGroupOf(k); return { key: k, label: tname(k), group: g, groupLabel: TWOD12.traitGroups.find(x => x.key === g)?.label ?? "Keywords", tip: TWOD12.traitHelp?.[k] ?? "" }; });
  // The AP the character has (in a started combat, on any turn): a Version that costs more is disabled
  const cbt = game.combat?.started ? combatantOf(actor) : null, have = cbt ? getAP(cbt) : null, rap = cbt && it.reaction ? getRAP(cbt) : 0;
  const freq = effectiveFrequency(it);
  const meta = { escalation: Number(it.escalation) || 0, targets: String(it.targets ?? "").trim(), dist: (() => { const d = distanceText(it); return /^\d+$/.test(d) ? `${d} sq.` : d.replace(/(\d+)\s*(?:squares?|sq\.?)$/i, "$1 sq."); })(),
    vs: vsText(it, { src, fists: item.getFlag?.("twod12", "basic") === "fists", rolls: true }), requirements: String(it.requirements ?? "").trim(), trigger: String(it.trigger ?? "").trim(), triggerHtml: (() => { const t = String(it.trigger ?? "").trim(); try { return t ? highlightText(esc(t)) : ""; } catch (e) { return ""; } })(), triggerKind: it.reactionKind ?? "" };
  const versions = [];
  for (const v0 of c.versions) {
    const v = c.talentMods ? applyTalentMods(v0, c.talentMods) : v0;
    const parts = await c.partsFor(v);
    const vb = versionButtons([v.ap], { reaction: !!it.reaction, inCombat: !!cbt, ap: have, rap, free: !!c.opts.free })[0];   // v0.0.297: the sheet card's check
    // Pack CARD-ONE step 3: the card's lines of this Version, from the card model, in its order (the dialog places its Tier rows among them)
    let card = null;
    try { card = await versionCardLines(item, v0, { actor, weapon: c.previewWeapon ?? null, fists: item.getFlag?.("twod12", "weaponUse") === "fists", setupHtml: parts.setup || null }); } catch (e) { console.warn("twod12 | the card's lines", e); }
    versions.push({ ap: v.ap, cost: vb.cost, disabled: vb.off, why: vb.why, traits, meta: { ...meta, setup: parts.setup ?? "" }, tiers: parts.tiers, crit: parts.crit, effects: parts.effects, effectsFrom: 1, noTiers: !!v.noTiers, card });
  }
  // the creatures (several: each its own Defense; one: the target, or the DC of an Action with no target)
  let creatures;
  // v0.0.370 (Lucas): the target's token image beside its name
  const img = (tk, a) => tk?.document?.texture?.src ?? tk?.texture?.src ?? a?.img ?? "";
  const size = a => { const n = Number(a?.system?.size); return n > 3 ? (["", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"][n] ?? "") : ""; };
  if (c.multi && (c.perT?.length ?? 0) > 0) creatures = c.perT.map(p => ({ uuid: p.actorUuid, name: p.label ?? p.name, img: img(p.token, p.actor), size: size(p.actor), def: dcWord(p.dcInfo), dc: p.dcInfo.dc, owned: !!p.actor?.isOwner }));
  // v0.0.343 (Lucas, playtest 4: Double Shot's window showed one of its two targets): an Action that rolls nothing (no Modifier) aimed at several
  // creatures lists them all (it rolls nothing, so no Defense of theirs is used)
  else if (c.rollsAtOthers && (c.aimed?.length ?? 0) > 1) creatures = c.aimed.filter(tk => tk.actor).map(tk => ({ uuid: tk.actor.uuid, name: tk.name, img: img(tk, tk.actor), size: size(tk.actor), def: dcWord(c.dcInfo), dc: c.dcInfo.dc, owned: !!tk.actor.isOwner, plain: true }));
  else if (c.rollsAtOthers && c.targetToken?.actor) creatures = [{ uuid: c.targetToken.actor.uuid, name: c.targetToken.name, img: img(c.targetToken, c.targetToken.actor), size: size(c.targetToken.actor), def: dcWord(c.dcInfo), dc: c.dcInfo.dc, owned: !!c.targetToken.actor.isOwner, blocked: c.outOfRange || "" }];
  // v0.0.340 (Lucas: "allow to roll even without target for area effects, choosing a DC (default 13)"): an area with no creature in it (or not placed) rolls against a DC
  else if (c.rollsAtOthers && c.areaSet) creatures = [{ uuid: "none", name: c.areaOutcome?.ok ? "No creature in the area" : "No target", def: "DC", dc: c.opts.noTargetDc ?? 13, owned: true, area: true }];
  else creatures = [{ uuid: c.rollsAtOthers ? "none" : "self", name: c.rollsAtOthers ? "No target" : (c.isSelf ? "Your roll" : "No target"), def: "DC", dc: c.opts.noTargetDc ?? c.dcInfo.dc, owned: true }];
  const tgtName = uuid => creatures.find(x => x.uuid === uuid)?.name ?? "";
  const single = !c.multi ? creatures[0]?.uuid : null;
  const scopeOf = id => {
    const s = String(id);
    if (s.includes("|")) { const own = s.startsWith("syn:") ? s.split("|")[1] : s.split("|")[0]; return creatures.some(x => x.uuid === own) ? own : (single && own ? single : "shared"); }
    if (s.startsWith("syn:") && TARGET_SYN.has(s.slice(4)) && single) return single;
    return "shared";
  };
  const chips = [];
  const targetActors = c.multi ? c.perT.map(p => p.actor) : c.rollsAtOthers && c.targetToken?.actor ? [c.targetToken.actor] : [];
  // Boons and Banes: your effects, the effects on the targets, and what the map gives (Flanking, Cover, range, Engaged, Obscured...)
  // the core rework A4: a Save Action shows the user's Boons and Banes too: its Banes left after cancelling give every target 1 Boon on its Save
  for (const m of [...modifierList(actor, c.dlgTraits, targetActors, null), ...c.extraMods]) {
    // v0.0.301 (PACK BB): a source that makes the roll Doomed or Favored (High cover: Doomed, and no Field Banes)
    if (!m.info && (m.doomed || m.favored) && !(m.boons || m.banes)) {
      const scope = scopeOf(m.id), label = cleanLabel(m.name, scope !== "shared" ? tgtName(scope) : "");
      chips.push({ id: m.id, fx: m.id, scope, row: m.doomed ? "banes" : "boons", kind: m.doomed ? "doom" : "fav", n: 1, label, start: m.match ? "on" : "na", why: m.naWhy || m.predicate || "", tip: m.predicate ?? "", rule: m.rule ?? null });
      continue;
    }
    if (m.info || !(m.boons || m.banes)) continue;
    const scope = scopeOf(m.id), boon = (m.boons ?? 0) >= (m.banes ?? 0) && m.boons > 0, n = boon ? m.boons : m.banes;
    const label0 = cleanLabel(m.name, scope !== "shared" ? tgtName(scope) : "");
    const label = n > 1 && !/\d/.test(label0) ? `${label0} ×${n}` : label0;
    chips.push({ id: m.id, fx: m.id, scope, row: boon ? "boons" : "banes", kind: boon ? "boon" : "bane", n, bb: m.bb ?? "", label, start: m.match ? "on" : "na", why: m.naWhy || m.predicate || "", tip: m.predicate ?? "", rule: m.rule ?? null });
  }
  // Favored and Doomed the roll already knows: your own (armor beyond your training, Unconscious) and the target's (Hidden, Hidden to it, untrained armor)
  const doom = doomStatus(actor) || (actor?.system?.armorUntrained ? "Untrained armor" : "");
  if (doom && !c.saveAct) chips.push({ id: "syn:doom", scope: "shared", row: "banes", kind: "doom", n: 1, label: doom, start: "on", tip: `${doom}: all your Rolls are Doomed` });
  if (!c.multi && single && c.rollsAtOthers && !c.saveAct) {
    const hidden = c.seen === "hidden" || c.seen === "unsensed";
    if (hidden) chips.push({ id: "syn:tdoom", scope: single, row: "banes", kind: "doom", n: 1, label: c.seen === "hidden" ? "Hidden" : "Unsensed", start: "on", tip: c.seen === "hidden" ? `Hidden: you only perceive the target by ${c.seenWhy}` : "Unsensed: you don't perceive the target" });
    if (c.unseenYou) chips.push({ id: "syn:tfav", scope: single, row: "boons", kind: "fav", n: 1, label: c.mine === "hidden" ? "Hidden to it" : "Unsensed to it", start: "on", tip: "Your target doesn't perceive you: Favored" });
    if (c.untrainedTarget) chips.push({ id: "syn:tfav2", scope: single, row: "boons", kind: "fav", n: 1, label: "Untrained armor", start: "on", tip: "The target's armor is beyond its training: Favored" });
  }
  if (c.multi && !c.saveAct) for (const p of c.perT) (p.note ?? []).forEach((nt, k) => chips.push({ id: `syn:pnote|${p.actorUuid}|${k}`, scope: p.actorUuid, row: nt.cls === "boon" ? "boons" : "banes", kind: nt.cls === "boon" ? "fav" : "doom", n: 1, label: nt.text, start: "on",
    tip: nt.cls === "boon" ? `${nt.text}: Favored against ${p.name}` : `${nt.text}: Doomed against ${p.name}` }));
  // the core rework A5: Exhausted N is N Banes on all your Rolls (Ch. 8): a modifier of its own (effects.mjs derivedMods), drawn with the others above
  // Damage: each Empowered source by name. v0.0.407 (book, Chapter 8; Lucas, 2026-11-13): Empowered has no value (the first damage on each of your
  // turns adds 1d6!), and Enfeebled is gone (an old effect's Enfeebled is no longer offered)
  c.steps.empowered.forEach((x, k) => chips.push({ id: `syn:emp:${k}`, scope: "shared", row: "damage", kind: "emp", n: 1, inc: false, ...(x.spend ? { spend: x.spend } : {}), label: "Empowered", srcName: x.name, start: "on", tip: `${x.name}: Empowered, the first damage you deal on each of your turns adds 1d6! of the Action's pool and type (Ch. 8)` }));
  // Nonlethal (Ch. 4): switching costs 1 Bane; an Action with the Nonlethal trait switches to Lethal
  if (!c.saveAct) { const nl = it.traits.has("nonlethal"); chips.push({ id: "syn:nl", scope: "shared", row: "banes", kind: "bane", n: 1, special: "nl", label: nl ? "Lethal" : "Nonlethal", start: "off", tip: `Deal ${nl ? "Lethal" : "Nonlethal"} damage instead: 1 Bane on this roll (Ch. 4)` }); }
  // v0.0.458 (Lucas, 2026-11-19; book Ch. 4): a Save Action doesn't roll, so switching it gives every creature 1 Boon on its Save (actions.mjs adds it to the Save card)
  else { const nl = it.traits.has("nonlethal"); chips.push({ id: "syn:nl", scope: "shared", row: "damage", kind: "boon", n: 1, special: "nl", label: `${nl ? "Lethal" : "Nonlethal"}: +1 Boon on each Save`, start: "off", tip: `Deal ${nl ? "Lethal" : "Nonlethal"} damage instead: every creature gains 1 Boon on its Save (Ch. 4)` }); }
  // v0.0.411 (pack F3): Shifting Aim's Field Boon, Blade and Bow's Boon (hooks.mjs: what the creature did this turn)
  try { const { strikeHookChipsFor } = await import("./hooks.mjs"); for (const [k, h] of (await strikeHookChipsFor(actor, c.useTraits)).entries()) chips.push({ id: `syn:hook:${k}`, fx: `syn:hook:${k}`, scope: "shared", row: "boons", kind: "boon", n: h.boons, bb: h.field ? "field" : "", label: h.name, start: "on", tip: `${h.name}: ${h.why}` }); } catch (e) { console.warn("twod12 | hook chips", e); }
  // the Bestiary's rebuild (2026-11-25): a Boon on this Action while the creature is in a state (Cornered: Shove while Bloodied; hooks.mjs stateBoon)
  try { const { stateBoonChips } = await import("./hooks.mjs"); for (const [k, h] of stateBoonChips(actor, item).entries()) chips.push({ id: `syn:shook:${k}`, fx: `syn:shook:${k}`, scope: "shared", row: "boons", kind: "boon", n: h.boons, bb: "", label: h.name, start: "on", tip: `${h.name}: ${h.why}` }); } catch (e) { console.warn("twod12 | state Boon chips", e); }
  // v0.0.409 (pack F2; book, Smite): "you can spend your Reaction Point to roll 1 more Smite die" (off until ticked; paid when the Action is used)
  // v0.0.440 (Lucas, checklist: "the Reaction Point toggle is hidden"; the dice "need to grow"): always shown (pinned), and on, its die joins the Tiers
  if ([...(it.versions ?? [])].some(v => v.diceRule === "smite")) {
    let prof = false; try { const { isProfaneFor } = await import("./judge.mjs"); prof = !!(c.rollsAtOthers && c.targetToken && isProfaneFor(actor, c.targetToken)); } catch (e) { prof = false; }
    chips.push({ id: "syn:smite", scope: "shared", row: "damage", kind: "pass", n: 0, special: "smite", pinned: true, label: "1 AP: 1 more Smite die", tag: `+1d${prof ? 8 : 6}! Ho`, pool: "M", tiers: [1, 2, 3], start: "off", tip: "Spend your Reaction Point to roll 1 more Smite die (it doesn't count toward the 4)." });
  }
  // v0.0.510 (Lucas on v0.0.509: "the roll dialog should likely have a button like the Smite"): Steady Draw's 2dE, off until ticked, once an encounter;
  // paid (the Reaction Point) only when the roll gets a Tier 2 or 3 (actions.mjs useAction), its dice on those Tiers (actions.mjs rollDamage)
  if (item.getFlag?.("twod12", "basic") === "basicWeaponAttack") {
    const { activeHooks } = await import("./hooks.mjs"), { escalationDie } = await import("./roundrules.mjs");
    const de = activeHooks(actor, "basicLine").find(h => Number(h.hook?.deMore) > 0);
    const used = de && game.combat?.started && (actor.getFlag?.("twod12", "onceUsed") ?? {})[de.item?.name ?? "deMore"] === game.combat.id;
    if (de && !used) { const n = Number(de.hook.deMore) || 2, die = escalationDie(actor.system?.escalation); chips.push({ id: "syn:steadyde", scope: "shared", row: "damage", kind: "pass", n: 0, special: "steadyde", pinned: true, label: `1 AP: ${n}dE more on a Tier 2 or 3`, tag: `+${n}d${die}`, pool: "B", tiers: [2, 3], start: "off", tip: `${de.item?.name ?? "Your class line"}: once an encounter, spend your Reaction Point on a Tier 2 or 3 to deal ${n}dE (d${die} now) more.` }); }
  }
  if (c.usesReload) chips.push({ id: "syn:reload", scope: "shared", row: "boons", kind: "fav", n: 1, special: "reload", pinned: true, label: "Reload shot", start: "off", tip: "A powerful shot: Favored and Empowered. Afterwards the weapon must be reloaded before it is used again." });
  // Passives: the Bonus Damage of your Features, Talents and effects, shown in the Tiers they add to (Radiant Zeal "+1d6 Ho" on T1-T3, Heavy Blows "+2" on T3)
  for (const [key, { b, tiers }] of c.bonusSeen.entries()) chips.push({ id: `pass:${key}`, bonusKey: key, scope: "shared", row: "passives", kind: "pass", n: 0, label: b.effect, tag: b.dmg ? `+${b.dmg}${b.sub ? ` ${b.sub}` : ""}` : "", tiers, pool: b.pool, start: "on",
    tip: b.hover ? String(b.hover).replace(/<[^>]+>/g, "").slice(0, 200) : (b.dmg ? `+${b.dmg}${b.sub ? ` ${TWOD12.subtypes[b.sub === "W" ? c.previewWeapon?.system?.subtype ?? "" : b.sub] ?? ""}` : ""} damage` : b.text ?? ""), rule: b.srcUuid ? { uuid: b.srcUuid, label: b.effect } : null });
  const seenNames = new Set([...c.bonusSeen.values()].map(x => x.b.effect));
  for (const b of bonusesNotNow(actor, c.dlgTraits, { label: tname, name: item.name })) {
    if (seenNames.has(b.effect)) continue;
    seenNames.add(b.effect);
    chips.push({ id: `passna:${b.effect}`, scope: "shared", row: "passives", kind: "pass", n: 0, label: b.effect, tag: b.dmg ? `+${b.dmg}${b.sub ? ` ${b.sub}` : ""}` : "", tiers: b.tiers, pool: b.pool, start: "na", why: b.why, tip: "", rule: b.srcUuid ? { uuid: b.srcUuid, label: b.effect } : null });
  }
  // what blocks the Roll: a spent Frequency (a granted use is free), a target out of range
  const blocked = [];
  const fd = c.opts.free ? null : isFaded(actor, item);
  if (fd?.faded) blocked.push(fd.why);
  blocked.push(...(c.warns ?? []));   // v0.0.453: what the Action breaks but may still do (a weapon the card doesn't name): a warning, never a stop
  let hideDef = false, designer = false, stats = "all";
  try { hideDef = !game.user.isGM && game.settings.get("twod12", "hideEnemyDefenses") === true; designer = game.settings.get("twod12", "designerMode") === true; stats = game.settings.get("twod12", "rollDialogStats") ?? "all"; } catch (e) { /* settings not ready */ }
  const showStats = stats === "all" || (stats === "gm" && !!game.user?.isGM);
  if (hideDef && creatures.every(x => x.owned)) hideDef = false;   // your own creatures' Defenses are yours to see
  const rm = rollModes();
  const fl = TWOD12.frequencies?.[freq] ?? "";
  return {
    name: item.name, flavor: it.flavor ?? "", reaction: !!it.reaction, freq, freqLabel: freq && !["none", ""].includes(freq) ? fl : "", freqColor: FREQ_COLORS[freq] ?? FREQ_COLORS[""],
    versions, ap: c.opts.rdState?.ap ?? versions.find(v => !v.disabled)?.ap ?? versions[0]?.ap,
    roll: { mod: Number(src.mod) || 0, name: String(src.chip ?? "").replace(/\s*Modifier$/i, "") || "Modifier" },
    multi: !!c.multi, self: !c.rollsAtOthers, area: c.areaSet ? { label: `${c.areaSet.distance} ${c.areaSet.shape === "burst" ? "Burst" : c.areaSet.shape === "line" ? "Line" : "Emanation"}`, placed: !!c.areaOutcome?.ok,
      // v0.0.397: the size of each Version (the dialog's Version buttons choose it before the area is placed); no square grid: nothing to place
      labels: Object.fromEntries(versions.map(v => [v.ap, `${v.areaSize || c.areaSet.distance} ${c.areaSet.shape === "burst" ? "Burst" : c.areaSet.shape === "line" ? "Line" : "Emanation"}`])),
      noPlace: !(globalThis.canvas?.ready && globalThis.canvas?.grid?.isSquare) } : null,
    nonlethalAction: it.traits.has("nonlethal"), chips, creatures, hideDef, designer, canForce: !!game.user?.isGM, blocked, rollMode: rm.cur, rollModes: rm.list, showAvg: showStats, showOdds: showStats,
    // v0.0.293: a Save Action: the targets roll the Save named on its Vs. line against your DC (11 + your Modifier)
    save: c.saveAct ? { label: vsText(it, { src, rolls: true }) || "Save", dc: saveDcOf(src, actor.system?.attributes) } : null,
    setupPending: !!c.setupPending,
    notices: (c.notices ?? []).filter(n => !n.for || n.showInDialog).map(n => ({ text: n.text, why: n.why ?? "", active: !!n.active, tone: n.tone ?? "" }))
  };
}
export { esc };
