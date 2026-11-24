import { allEffects } from "./passives.mjs";
import { seesOrigin, isSpent } from "./escalation.mjs";
import { appliedFlags } from "./appliedflags.mjs";
import { effectOff } from "./escalation.mjs";
import { openEffectSheet } from "./fxopen.mjs";
import { bumpExhausted, isExhaustedFx, exhaustedClick, heldModifiers } from "./sleep.mjs";
import { fxTipHtml, hoverOf, perFrame } from "./util.mjs";   // v0.0.254: the HUD's hover cards; v0.0.361: perFrame
import { effectWhat } from "./fxdetails.mjs";   // v0.0.267
import { TWOD12 } from "./config.mjs";
import { combatantOf } from "./combat.mjs";
import { onceKey, onceBlocked, isMarked, ignoredBy } from "./automation.mjs";
import { bbCount, bbKey } from "./calc.mjs";
import { originOk, attrsOk, bleedOf, bleedText, needsOrigin, hasBleed } from "./condrules.mjs";   // v0.0.314 (pack AU)
import { diceAvg } from "./fxrules.mjs";   // v0.0.426: Lingering keeps the higher average
const SOCKET = "system.twod12";
const F = "twod12";

export const durationText = d => (d?.type === "eot" ? "EoT" : (d?.type === "rounds" ? `${d.rounds} round${d.rounds === 1 ? "" : "s"}` : ""));

/** Who applied the effect and when (used for Rounds expiry). */
export function originInfo(actorUuid) {
  const c = game.combat;
  const comb = c?.combatants.find(x => x.actor?.uuid === actorUuid);
  // v0.0.252 (Lucas; book, Chapter 2): a duration in rounds counts down at the end of the slot in which the effect was applied (the current combatant's), not the origin's
  const cur = c?.combatant ?? null;
  return { actorUuid, combatantId: comb?.id ?? "", slot: comb?.initiative ?? null, anchorCombatantId: cur?.id ?? comb?.id ?? "", anchorSlot: cur?.initiative ?? comb?.initiative ?? null, round: c?.round ?? null, turn: c?.turn ?? null };
}

/** Notes of the actor's effects that apply to rolls with this attribute. */
export function notesFor(actor, attrKey) {
  const out = [];
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    for (const n of e.getFlag(F, "notes") ?? []) if (n.attrs?.includes(attrKey)) out.push({ name: e.name.replace(/^\s*Effect:\s*/i, ""), title: n.title || e.name.replace(/^\s*Effect:\s*/i, ""), text: n.text });
  }
  return out;
}

/** Predicate: all listed traits present, at least one of "any" (if given), none of "none". */
export const matches = (m, traits, from = null) => (m.all ?? []).every(t => traits.has(t))
  && (!(m.any?.length) || m.any.some(t => traits.has(t)))
  && !(m.none ?? []).some(t => traits.has(t))
  && (!(m.from?.length) || (!!from && m.from.some(t => from.has(t))))   // "from": traits of the Action that caused a Save
  && attrsOk(m, traits);   // v0.0.314 (pack AU): only rolls with one of its Attributes (Sickened: Body and Instinct Saves)

// __action marks every Action and stays hidden; the roll kinds a player can pick (Check, Save, Attribute Action) are shown by name.
const vis = list => (list ?? []).filter(t => !String(t).startsWith("__") || t in TWOD12.rollKinds);
const tname = t => TWOD12.traits[t] ?? TWOD12.rollKinds[t] ?? t;
const predText = m0 => { const m = { ...m0, all: vis(m0.all), any: vis(m0.any), none: vis(m0.none) }; return [
  m.all?.length ? m.all.map(tname).join(" and ") : "",
  m.any?.length ? `any of ${m.any.map(tname).join(", ")}` : "",
  m.none?.length ? `not ${m.none.map(tname).join(", ")}` : "",
  m.from?.length ? `Saves against ${m.from.map(tname).join(" or ")} Actions` : "",
  m.attrs?.length ? `${m.attrs.map(a => TWOD12.attributes[a] ?? a).join(" or ")} rolls` : "",
  m.vsOrigin === "not" ? "Actions against a creature other than its origin" : (m.vsOrigin === "only" ? "Actions against its origin" : "")
].filter(Boolean).join("; ") || "Any roll"; };

/** The Empowered and Enfeebled values that a creature's effects give to the damage of an Action with these traits: { empowered: [{ name, n }], enfeebled: [{ name, n }] } (Bloodlust: Empowered 1). */
export function damageSteps(actor, traits, target = null) {
  const out = { empowered: [], enfeebled: [] };
  for (const e of allEffects(actor)) for (const m of (effectOff(actor, e) ? [] : e.getFlag(F, "modifiers") ?? [])) {
    if (m.against || !matches(m, traits)) continue;
    if (m.vsMarked && !isMarked(actor, target)) continue;   // v0.0.186: only against the creature it marked (Hunter's Focus)
    if ((m.seen && !seesOrigin(actor, e)) || isSpent(e, m)) continue;   // v0.0.323: its own "While they see the origin"; "Next one only" already used
    const emp = m.empowered === true ? 1 : Math.trunc(Number(m.empowered)) || 0, enf = Math.trunc(Number(m.enfeebled)) || 0;   // (older effects stored true for Empowered)
    const inc = m.empMode === "inc", sp = m.spend && m.ruleId ? { spend: `${e.id}|${m.ruleId}` } : {};   // v0.0.323: "Increase by" adds to the value they have
    // v0.0.407 (book, Chapter 8; Lucas, 2026-11-13): Empowered has no value (any value is "on") and Enfeebled is gone: an old effect's Enfeebled counts for nothing
    if (emp > 0 || inc && emp) out.empowered.push({ name: shortName(e.name), n: 1, inc: false, ...sp });
    void enf;
  }
  for (const e of actor?.effects ?? []) if (e.statuses?.has?.("empowered")) out.empowered.push({ name: baseNameOf(e), n: 1 });   // the condition Empowered (no value)
  return out;
}

/** A one-off effect from a @Boon button: N boons (banes when negative) on the creature's next matching roll, ending at the end of its turn or after some rounds. */
export async function applyBoonEffect(actor, cfg, origin) {
  if (!actor.isOwner) return game.socket.emit(SOCKET, { type: "applyBoon", actorUuid: actor.uuid, cfg, origin });
  const n = Number(cfg.n) || 0;
  if (!n) return;
  const traits = cfg.traits ?? [];
  const what = traits.length ? traits.map(t => TWOD12.traits[t] ?? t).join(" ") : "Roll";
  const bb = bbKey(cfg.bb), nm = bb ? `${BBW[bb]} ` : "";   // v0.0.301 (PACK BB): a named one ("1 Pressure Bane")
  const name = cfg.name || `${Math.abs(n)} ${nm}${n < 0 ? "Bane" : "Boon"}${Math.abs(n) === 1 ? "" : "s"} on the next ${what}`;
  const d = Number(cfg.rounds) > 0 ? { type: "rounds", rounds: Number(cfg.rounds) } : { type: "eot", rounds: 1 };
  const own = combatantOf(actor);
  await actor.createEmbeddedDocuments("ActiveEffect", [{
    name, img: n < 0 ? "icons/svg/downgrade.svg" : "icons/svg/upgrade.svg", origin: origin?.actorUuid ?? null, showIcon: 2,
    flags: { [F]: {
      duration: d, remaining: d.rounds, slotInit: own?.initiative ?? null, originSlot: origin?.slot ?? null,
      originCombatantId: origin?.combatantId ?? "", anchorSlot: origin?.anchorSlot ?? null, anchorCombatantId: origin?.anchorCombatantId ?? "", appliedRound: origin?.round ?? null, appliedTurn: origin?.turn ?? null,
      description: "", notes: [], bonuses: [], grants: [],
      modifiers: [{ against: false, boons: n > 0 ? n : 0, banes: n < 0 ? -n : 0, bb, empowered: 0, enfeebled: 0, all: traits, any: [], none: [], from: [] }],
      // "the next ...": it is used up by the next roll with all those traits (with no traits it lasts its duration)
      expireOn: cfg.next === "roll" && !traits.length ? ["__roll"] : traits, expireAll: true   // v0.0.458: "on its next roll": any roll spends it (bonus.mjs expireOnUse)
    } }
  }]);
}

/**
 * v0.0.498 (Pass 3): Feint Tier 2 / Tier 3 automation — grants 2 Boons (T2) or Favored (T3) on the caster's next [Strike] Action
 * against `targetActor` this turn (expires on that Strike or at EoT).
 */
export async function applyFeintEffect(actor, targetActor, tier, origin = null) {
  if (!actor || !targetActor || tier < 2) return false;
  if (!actor.isOwner) return false;
  const fav = tier >= 3;
  const own = combatantOf(actor);
  const o = origin ?? originInfo(actor.uuid);
  const name = `Feint (${targetActor.name})`;
  await actor.createEmbeddedDocuments("ActiveEffect", [{
    name, img: "icons/svg/daze.svg", origin: o?.actorUuid ?? actor.uuid, showIcon: 2,
    flags: { [F]: {
      duration: { type: "eot", rounds: 1 }, remaining: 1, slotInit: own?.initiative ?? null,
      originSlot: o?.slot ?? null, originCombatantId: o?.combatantId ?? "",
      anchorSlot: o?.anchorSlot ?? own?.initiative ?? null, anchorCombatantId: o?.anchorCombatantId ?? own?.id ?? "",
      appliedRound: o?.round ?? null, appliedTurn: o?.turn ?? null,
      description: fav ? `Your next [Strike] Action against ${targetActor.name} this turn is Favored.` : `You gain 2 Boons on your next [Strike] Action against ${targetActor.name} this turn.`,
      notes: [], bonuses: [], grants: [],
      modifiers: [{ against: false, boons: fav ? 0 : 2, banes: 0, ...(fav ? { favored: true } : {}), bb: "", empowered: 0, enfeebled: 0, all: ["strike"], any: [], none: [], from: [], targetUuid: targetActor.uuid }],
      expireOn: ["strike"], expireAll: true, expireTargetUuid: targetActor.uuid
    } }
  }]);
  return true;
}

/**
 * v0.0.498 (Pass 3): Feint Critical automation — prevents `targetActor` from using Reactions against `feinter` until the end of `feinter`'s turn.
 */
export async function applyFeintNoReactions(targetActor, feinter, origin = null) {
  if (!targetActor || !feinter) return false;
  const o = origin ?? originInfo(feinter.uuid);
  if (!targetActor.isOwner) {
    game.socket?.emit?.(SOCKET, { type: "applyFeintNoRx", targetUuid: targetActor.uuid, feinterUuid: feinter.uuid, feinterName: feinter.name, origin: o });
    return true;
  }
  const own = combatantOf(feinter);
  await targetActor.createEmbeddedDocuments("ActiveEffect", [{
    name: `Feinted (no Reactions vs. ${feinter.name})`, img: "icons/svg/daze.svg", origin: feinter.uuid, showIcon: 2,
    flags: { [F]: {
      duration: { type: "eot", rounds: 1 }, remaining: 1, slotInit: own?.initiative ?? null,
      originSlot: o?.slot ?? null, originCombatantId: o?.combatantId ?? own?.id ?? "",
      anchorSlot: o?.anchorSlot ?? own?.initiative ?? null, anchorCombatantId: o?.anchorCombatantId ?? own?.id ?? "",
      appliedRound: o?.round ?? null, appliedTurn: o?.turn ?? null,
      description: `Can't use Reactions against ${feinter.name} until the end of ${feinter.name}'s turn.`,
      notes: [], bonuses: [], grants: [], modifiers: [],
      noReactionsVs: feinter.uuid
    } }
  }]);
  return true;
}

/** Every boon/bane modifier on the actor's effects, with whether it matches these traits. */
/** Effects are often named "Effect: Name" in the world; cards and dialogs show just "Name". */
export const shortName = n => String(n ?? "").replace(/^\s*Effect:\s*/i, "");

/**
 * Banes from the creature's own state. v0.0.243 (pack R; book, Health States): Bloodied and Strained have no effect by themselves any more (they are
 * hooks other cards use: "when an ally becomes Bloodied", "against a Strained target"); their Banes are gone.
 */
export function derivedMods(actor) {
  const out = [];
  // A two-handed weapon held with one hand: 3 banes on [Strike, Weapon] Actions with that weapon (v0.0.212, Lucas: not the other hand's weapon or Fists).
  if ((actor?.itemTypes?.weapon ?? []).some(w => w.system.wielded && w.system.traits?.has?.("twohanded") && (w.system.hands ?? 1) < 2)) out.push({ id: "syn:onehand", name: "Two-handed weapon in one hand", boons: 0, banes: 3, all: ["strike", "weapon", "__twohanded"], any: [], none: [] });
  // the core rework A5 (Lucas, 2026-11-21; book, Chapter 8, Exhausted): Exhausted N gives N Banes (no name) on all your Rolls (it was a penalty of N)
  const exh = Math.max(0, Math.trunc(Number(actor?.system?.exhausted ?? 0)) || 0);
  if (exh) out.push({ id: "syn:exh", name: `Exhausted ${exh}`, boons: 0, banes: exh, all: [], any: [], none: [] });
  return out;
}

const onceText = m => (m.oncePerRound ? " (the first one each round)" : "");
/**
 * v0.0.301 (PACK BB): the name of a modifier's Boons and Banes ("field", "pressure", "support" or ""): the setting's own; an applied Prone made before
 * v0.0.301 has none, and Prone's are Field (book, Ch. 8).
 */
export const bbOf = (m, e) => bbKey(m?.bb) || (e?.statuses?.has?.("prone") || /^prone$/i.test(shortName(e?.getFlag?.(F, "baseName") ?? e?.name ?? "").trim()) ? "field" : "");
const BBW = { field: "Field", pressure: "Pressure", support: "Support" };
const bbText = (m, e) => { const k = bbOf(m, e); return k ? ` (${BBW[k]})` : ""; };
/** How many times a modifier counts: one that is "by value" (a condition with a value) counts as many times as the value (Vulnerable 2: 2 boons). */
const kOf = (m, e) => (m.byValue ? Math.max(1, Number(e.getFlag(F, "value")) || 1) : 1);
/** The value of a Vulnerable effect: the condition with a value, or an older effect named "Vulnerable 2". 0 for anything else. */
const vulnerableOf = e => {
  if (/^Vulnerable\b/i.test(e.getFlag?.(F, "baseName") ?? "")) return Math.max(1, Number(e.getFlag(F, "value")) || 1);
  const m = String(e.name ?? "").match(/^Vulnerable\s+(\d+)/i);
  return m ? Number(m[1]) : 0;
};

export function modifierList(actor, traits, targetActors = [], from = null) {
  const out = [];
  for (const m of derivedMods(actor)) out.push({ id: m.id, name: m.name, boons: m.boons, banes: m.banes, bb: bbKey(m.bb), match: matches(m, traits, from), predicate: predText(m) });
  const ignoreDaunted = ignoredBy(actor, "daunted", traits).length > 0;
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e)) continue;
    if (ignoreDaunted && (e.statuses?.has?.("daunted") || /^daunted\b/i.test(shortName(e.getFlag?.(F, "baseName") ?? e.name)))) continue;
    (e.getFlag(F, "modifiers") ?? []).forEach((m, i) => {
      if (m.against || !(m.boons || m.banes || m.favored || m.doomed)) return;
      // v0.0.186: once per round (used: not offered) and only against the marked target (one chip for that target).
      const once = m.oncePerRound ? onceKey(e, "m", i) : "";
      if (once && onceBlocked(actor, once)) return;
      if (m.vsOrigin && !originOk(m, e.origin ?? "", targetActors.map(t => t?.uuid))) return;   // v0.0.314 (pack AU): Taunted, against a creature other than its origin
      if ((m.seen && !seesOrigin(actor, e)) || isSpent(e, m)) return;   // v0.0.323 (PACK EFFECT-SHEET): its own "While they see the origin"; "Next one only" used
      const base = { name: shortName(e.name), boons: (Number(m.boons) || 0) * kOf(m, e), banes: (Number(m.banes) || 0) * kOf(m, e), ...(m.favored ? { favored: true } : {}), ...(m.doomed ? { doomed: true } : {}), bb: bbOf(m, e), match: matches(m, traits, from), predicate: predText(m) + onceText(m) + bbText(m, e), ...(once ? { once, onceActor: actor.uuid } : {}), ...(m.spend && m.ruleId ? { spend: `${e.id}|${m.ruleId}`, spendActor: actor.uuid } : {}) };
      if (m.targetUuid) {
        for (const t of targetActors) if (t?.uuid === m.targetUuid) out.push({ ...base, id: `${t.uuid}|${e.id}:${i}`, name: base.name.includes(`(${t.name})`) ? base.name : `${base.name} (${t.name})`, predicate: `Against ${t.name}: ${base.predicate}` });
        return;
      }
      if (!m.vsMarked) return out.push({ id: `${e.id}:${i}`, ...base });
      for (const t of targetActors) if (isMarked(actor, t)) out.push({ ...base, id: `${t.uuid}|${e.id}:${i}`, name: `${base.name} (${t.name})`, predicate: `Against your marked target, ${t.name}: ${base.predicate}` });
    });
  }
  // Effects on the target that change rolls made against it (Prone: Melee Actions against you gain 1 boon).
  for (const t of targetActors) {
    // Vulnerable N: only the highest value applies (and a second one with the same value counts once).
    const vul = Math.max(0, ...[...(t?.effects ?? [])].map(vulnerableOf));
    let vulSeen = false;
    for (const e of allEffects(t)) {
      if (effectOff(t, e)) continue;
      const vo = vulnerableOf(e);
      if (vo) { if (vo < vul || vulSeen) continue; vulSeen = true; }
      (e.getFlag(F, "modifiers") ?? []).forEach((m, i) => {
        if (!m.against || !(m.boons || m.banes || m.favored || m.doomed)) return;
        const once = m.oncePerRound ? onceKey(e, "m", i) : "";   // v0.0.186: the first matching Action against it each round (Elusive)
        if (once && onceBlocked(t, once)) return;
        if ((m.seen && !seesOrigin(t, e)) || isSpent(e, m)) return;   // v0.0.323
        out.push({ ...(m.spend && m.ruleId ? { spend: `${e.id}|${m.ruleId}`, spendActor: t.uuid } : {}), id: `${t.uuid}|${e.id}:${i}`, name: `${shortName(e.name)} (${t.name})`, boons: (Number(m.boons) || 0) * kOf(m, e), banes: (Number(m.banes) || 0) * kOf(m, e), ...(m.favored ? { favored: true } : {}), ...(m.doomed ? { doomed: true } : {}), bb: bbOf(m, e), match: matches(m, traits), predicate: `Against ${t.name}: ${predText(m)}${onceText(m)}${bbText(m, e)}`, ...(once ? { once, onceActor: t.uuid } : {}) });
      });
    }
  }
  return out;
}

/** v0.0.186: the "once per round" modifiers that were in this roll (selected in the dialog) are used: remembered on the creature that has them. */
export async function useOnceModifiers(actor, traits, targetActors = [], from = null, selected = []) {
  const ids = new Set((Array.isArray(selected) ? selected : [selected]).filter(Boolean).map(String));
  const byActor = new Map([actor, ...targetActors].filter(Boolean).map(a => [a.uuid, a]));
  const keys = new Map();
  for (const m of modifierList(actor, traits, targetActors, from)) if (m.once && ids.has(String(m.id))) {
    if (!keys.has(m.onceActor)) keys.set(m.onceActor, []);
    keys.get(m.onceActor).push(m.once);
  }
  const { markOnce, markSpent } = await import("./automation.mjs");
  for (const [uuid, list] of keys) { const a = byActor.get(uuid); if (a) await markOnce(a, list); }
  // v0.0.323 (PACK EFFECT-SHEET): the "Next one only" Boons and Banes that were in the roll are spent
  const spends = new Map();
  for (const m of modifierList(actor, traits, targetActors, from)) if (m.spend && ids.has(String(m.id))) { if (!spends.has(m.spendActor)) spends.set(m.spendActor, []); spends.get(m.spendActor).push(m.spend); }
  for (const [uuid, list] of spends) { const a = byActor.get(uuid); if (a) await markSpent(a, list); }
}

/** Sum of the chosen modifiers ("effectId:index" ids). */
export function resolveModifiers(actor, ids, extra = []) {
  // v0.0.301 (PACK BB): each source keeps its name (Field, Pressure, Support); the totals have the limit of 2 per name (calc.mjs bbCount).
  // A source can also make the roll Favored or Doomed (High cover: Doomed, and no Field Banes).
  const sources = [];
  let favored = false, doomed = false;
  const favBy = [], doomBy = [];
  for (const id of ids ?? []) {
    if (String(id).startsWith("syn:")) {
      const m = [...derivedMods(actor), ...extra].find(x => x.id === id);
      if (m) {
        sources.push({ name: m.name, boons: m.boons ?? 0, banes: m.banes ?? 0, bb: bbKey(m.bb) });
        if (m.favored) { favored = true; favBy.push(m.name); }
        if (m.doomed) { doomed = true; doomBy.push(m.name); }
      }
      continue;
    }
    const [owner, rest] = id.includes("|") ? id.split("|") : [null, id];
    const [eid, idx] = rest.split(":");
    const holder = owner ? (typeof fromUuidSync === "function" ? fromUuidSync(owner) : null) : actor;
    // v0.0.320 (two fixes): a Feature's or Talent's passive (id "passive-...") is not in the creature's effects: look among its passives too; and a
    // modifier "only against the creature it marked" is the roller's own, with the target's uuid in front of its id: look in the roller's own too.
    const findIn = a => a?.effects?.get?.(eid) ?? (String(eid).startsWith("passive-") ? allEffects(a).find(x => x.id === eid) : null);
    const e = findIn(holder) ?? (owner ? findIn(actor) : null);
    const m = e?.getFlag(F, "modifiers")?.[Number(idx)];
    if (!m) continue;
    const k = kOf(m, e);
    sources.push({ name: shortName(e.name), boons: (Number(m.boons) || 0) * k, banes: (Number(m.banes) || 0) * k, bb: bbOf(m, e) });
    if (m.favored) { favored = true; favBy.push(shortName(e.name)); }
    if (m.doomed) { doomed = true; doomBy.push(shortName(e.name)); }
  }
  const n = bbCount(sources);
  return { boons: n.boons, banes: n.banes, sources, groups: n.groups, favored, doomed, favBy, doomBy };
}

/** The radius (in squares, from the token's center) of a light of size N around a creature whose token is `half` squares wide from its center (lightradius.mjs draws it so). */
export const lightRadius = (n, half = 0.5) => (Number(n) > 0 ? Number(n) + half : 0);

async function applyLight(actor, light) {
  const dist = canvas.scene?.grid?.distance ?? 1;
  const backup = [];
  for (const td of actor.getActiveTokens(false, true)) {
    backup.push({ uuid: td.uuid, bright: td.light.bright, dim: td.light.dim, color: td.light.color ?? null, alpha: td.light.alpha, animation: { type: td.light.animation?.type ?? null, speed: td.light.animation?.speed ?? 5, intensity: td.light.animation?.intensity ?? 5 } });
    // v0.0.177: the token's light gets the book's size (N); lightradius.mjs adds half the token's width when the light is drawn (v0.0.176 wrote N + 0.5 here).
    // v0.0.247: its intensity (alpha) and animation come from the setting too (Lucas: v0.0.246's light was far too bright).
    const alpha = Number.isFinite(Number(light.lightAlpha)) ? Math.min(1, Math.max(0, Number(light.lightAlpha))) : 0.5;
    await td.update({ "light.bright": light.bright * dist, "light.dim": light.dim * dist, "light.color": light.color || null, "light.alpha": alpha, "light.animation.type": light.lightAnim || null, "light.animation.speed": Number(light.lightSpeed) || 5, "light.animation.intensity": Number(light.lightIntensity) || 5 });
  }
  return backup;
}

export { appliedFlags };

/** v0.0.323 (PACK EFFECT-SHEET): the hover text built from the rules says "{origin}": the applied effect names its origin there. */
function withOriginHover(flags, originUuid) {
  if (!String(flags?.hover ?? "").includes("{origin}")) return flags;
  let who = ""; try { who = originUuid ? globalThis.fromUuidSync?.(originUuid)?.name ?? "" : ""; } catch (e) { who = ""; }
  return { ...flags, hover: flags.hover.replace(/\{origin\}/g, who || "its origin") };
}
/** v0.0.317 (Lucas): an effect that needs an origin is named with it, "Frightened (Ogre)": the HUD's card, the sheet and the chips say of whom. */
export function withOriginName(name, sys, originUuid, actor = null) {
  if (!needsOrigin(sys) || !originUuid || originUuid === actor?.uuid) return name;
  let who = ""; try { who = globalThis.fromUuidSync?.(originUuid)?.name ?? ""; } catch (e) { who = ""; }
  return who ? `${name} (${who})` : name;
}
/**
 * v0.0.315 (Lucas: "all effects need to be editable / seen"): a card's own Bleed (its dice, pool, type, Attributes, DC) goes INTO the applied effect's
 * Bleed setting (its copy of the settings and the flags the turn reads), so the effect's Details tab shows it and can change it.
 */
export function withBleed(af, b) {
  if (!b) return af;
  const set = { ...(b.dmg ? { dmg: String(b.dmg) } : {}), ...(b.pool ? { dmgPool: b.pool } : {}), ...(b.sub ? { dmgSub: b.sub } : {}), ...(b.attrs?.length ? { attrs: [...b.attrs] } : {}), ...(Number(b.dc) ? { bleedDc: Number(b.dc) } : {}) };
  const settings = (af.source?.settings ?? []).map(x => (x.type === "bleed" ? { ...x, ...set } : x));
  const bleeds = (af.bleeds?.length ? af.bleeds : [{ dmg: "1", pool: "", sub: "", attrs: ["body", "instinct"], dc: 13 }]).map((x, i) => (i ? x : { ...x, ...(set.dmg ? { dmg: set.dmg } : {}), ...(set.dmgPool ? { pool: set.dmgPool } : {}), ...(set.dmgSub ? { sub: set.dmgSub } : {}), ...(set.attrs ? { attrs: set.attrs } : {}), ...(set.bleedDc ? { dc: set.bleedDc } : {}) }));
  return { ...af, bleeds, ...(af.source ? { source: { ...af.source, settings } } : {}) };
}
/** v0.0.424 (Lucas, Chapter 8): does the effect the creature has count as "the same one again" (its duration and value kept)? Always, but for a
 *  condition with a source given by a different creature: then the new one replaces it. Pure. */
export const sameSourceKeeps = (sys, have, originUuid) => !needsOrigin(sys) || String(have?.origin ?? "") === String(originUuid ?? "");
export async function createEffect(actor, item, origin, over = null, extra = {}) {
  const s = item.system;
  const olds = actor.effects.filter(e => e.getFlag(F, "effectUuid") === item.uuid), old = olds.map(e => e.id);
  const d = over?.duration ? { type: over.duration.type, rounds: over.duration.rounds ?? 1 } : { type: s.duration.type, rounds: s.duration.rounds };
  // The same effect again doesn't stack: it keeps the longer duration (the value is the same: it is the same effect).
  // v0.0.424 (Lucas, Chapter 8): a condition with a source (Frightened of, Taunted by, Grabbed by) comes from one source at a time: from a
  // different source the new one replaces the old one with its own duration; only the same source again keeps the longer duration.
  const keeps = e => sameSourceKeeps(s, e, origin?.actorUuid);
  if (d.type === "rounds") for (const e of olds) if (keeps(e) && e.getFlag(F, "duration")?.type === "rounds") d.rounds = Math.max(d.rounds, Number(e.getFlag(F, "remaining")) || 0);
  // A condition with a value: the same condition again doesn't stack, it keeps the higher value.
  let value = s.valued ? Math.max(1, Math.trunc(Number(over?.value)) || 1) : undefined;
  if (s.valued) for (const e of olds) if (keeps(e)) value = Math.max(value, Number(e.getFlag(F, "value")) || 0);
  // v0.0.426 (the audit; book, Chapter 8, Lingering: "If you would gain Lingering again, keep the one with the higher average"): a weaker or equal new
  // Lingering leaves the one the creature has
  if (olds.length && hasBleed(s)) {
    const avg = b => diceAvg(String(b?.dmg ?? "").replace(/!/g, ""));
    const now = Math.max(...olds.map(e => avg(bleedOf(e)) ?? -1)), next = avg(bleedOf({ flags: { [F]: { bleeds: appliedFlags(s, {}).bleeds, bleed: over?.bleed ?? null } } }));
    if (next !== null && now >= next) return;
  }
  if (old.length) await actor.deleteEmbeddedDocuments("ActiveEffect", old);
  const sid0 = shortName(item.name).trim().toLowerCase(), sid = Object.keys(COND_NAME).find(k => COND_NAME[k] === sid0) ?? sid0;   // v0.0.414: Lingering is the status bleed
  const baseId = sid.replace(/\s*\(.*\)\s*$/, "");   // "Hindered (until Move)" is the Hindered status
  const statuses = (CONFIG.statusEffects ?? []).some(e => e.id === sid) ? [sid] : ((CONFIG.statusEffects ?? []).some(e => e.id === baseId) ? [baseId] : []);
  const statusIcon = statuses.length ? (CONFIG.statusEffects ?? []).find(e => e.id === statuses[0])?.img : "";
  const effectImg = (statusIcon?.startsWith("systems/twod12/icons/conditions/") && (!item.img || String(item.img).startsWith("icons/svg/"))) ? statusIcon : item.img;
  const light = s.settings.find(x => x.type === "light");
  const lightBackup = light ? await applyLight(actor, light) : null;
  // The "slot" is the initiative count: EoT and Rounds end at the end of that count even if the creature swaps initiative later.
  const own = combatantOf(actor);
  const slotInit = own?.initiative ?? null;
  const made = (await actor.createEmbeddedDocuments("ActiveEffect", [{
    name: value !== undefined ? `${item.name} ${value}` : (over?.bleed ? bleedText(bleedOf({ flags: { [F]: { bleeds: appliedFlags(s, {}).bleeds, bleed: over.bleed } } })) : withOriginName(item.name, s, origin?.actorUuid, actor)), img: effectImg, origin: origin?.actorUuid ?? null, showIcon: 2, statuses,
    flags: { [F]: {
      ...extra, effectUuid: item.uuid, duration: d, remaining: d.rounds, ...(value !== undefined ? { value, baseName: item.name } : {}),
      slotInit, originSlot: origin?.slot ?? null,
      originCombatantId: origin?.combatantId ?? "", anchorSlot: origin?.anchorSlot ?? null, anchorCombatantId: origin?.anchorCombatantId ?? "", appliedRound: origin?.round ?? null, appliedTurn: origin?.turn ?? null,
      ...withOriginHover(withBleed(appliedFlags(s, item.toObject().system), over?.bleed), origin?.actorUuid), lightBackup, fromEscalation: !!origin?.escalation,
      ...(over?.endWhenUnthreatened ? { endWhenUnthreatened: true } : {}),
      // Immobilized (v0.0.174): its DC, 11 + the Modifier its origin used (13 without an origin or a Modifier). Forced Movement and Reposition read it.
      ...(statuses.includes("immobilized") ? { actionDc: origin?.actorUuid && Number.isFinite(origin?.mod) ? 11 + origin.mod : TWOD12.baseDC } : {})   // pack TALENTS-PT: the Action DC (was immobileDc)
    } }
  }]))?.[0];
  if (made) await createLinked(actor, item, made, origin, d);
  if (made) await createRiders(actor, item, made, origin, d);
  if (made) await createInlineActions(actor, item, made);
}

/** v0.0.249 (Lucas, inline Actions): an Action by uuid or by name: the creature's own, the world's, then the compendium's. */
export async function findAction(spec, actor = null) {
  const s = String(spec ?? "").trim();
  if (!s) return null;
  if (/^(Item|Actor|Compendium)\./.test(s)) { try { const d = await fromUuid(s); return d?.type === "action" ? d : null; } catch (e) { return null; } }
  const low = s.toLowerCase();
  const own = actor?.items?.find(i => i.type === "action" && i.name.toLowerCase() === low && !i.getFlag(F, "inlineOf"));
  if (own) return own;
  const world = game.items?.find(i => i.type === "action" && i.name.toLowerCase() === low);
  if (world) return world;
  for (const pack of game.packs ?? []) {
    if (pack.documentName !== "Item") continue;
    const hit = pack.index.find(e => e.type === "action" && String(e.name).toLowerCase() === low);
    if (hit) { try { return await pack.getDocument(hit._id); } catch (e) { /* next pack */ } }
  }
  return null;
}
/** The effect's inline Actions go on the creature (flagged with the effect's id), and leave with it (registerEffectHooks). */
async function createInlineActions(actor, item, effect) {
  const specs = (item.system.settings ?? []).filter(x => x.type === "inline" && String(x.inlineAction ?? "").trim()).map(x => String(x.inlineAction).trim());
  if (!specs.length) return;
  const data = [];
  for (const spec of specs) {
    const act = await findAction(spec, actor);
    if (!act) { ui.notifications?.warn?.(`${item.name}: no Action called ${spec}.`); continue; }
    const d = act.toObject(); delete d._id;
    foundry.utils.setProperty(d, `flags.${F}.inlineOf`, effect.id);
    foundry.utils.setProperty(d, `flags.${F}.sourceName`, item.name);
    foundry.utils.setProperty(d, `flags.${F}.sourceUuid`, act.uuid);
    data.push(d);
  }
  if (data.length) await actor.createEmbeddedDocuments("Item", data);
}

/** The conditions an Effect applies with it (its Conditions list, each with a value): they end with it. One the creature already has keeps the higher value. */
export async function createRiders(actor, item, parent, origin, duration) {
  for (const r of item.system.conditions ?? []) {
    const cond = r.uuid ? await fromUuid(r.uuid).catch(() => null) : null;
    if (!cond || cond.uuid === item.uuid) continue;
    // halfLevel (Squeezing, v0.0.170): the value is half the creature's level, rounded up, when the condition is applied.
    const value = r.valued ? (r.mode === "halfLevel" ? Math.max(1, Math.ceil((Number(actor.system?.level) || 1) / 2)) : Math.max(1, Number(r.value) || 1)) : undefined;
    const have = actor.effects.find(x => x.getFlag(F, "effectUuid") === cond.uuid);
    if (have && sameSourceKeeps(cond.system, have, origin?.actorUuid)) {   // v0.0.424: from a different source, createEffect replaces it
      const now = Number(have.getFlag(F, "value")) || 0;
      if (value !== undefined && r.mode === "increase") await setValued(have, now + value);   // "increase your value by N": this one does stack
      else if (value !== undefined && value > now) await setValued(have, value);                // the same condition again doesn't stack: the higher value
      continue;                                                                                // already there: no second copy
    }
    await createEffect(actor, cond, origin, { duration, ...(value !== undefined ? { value } : {}) }, { linkedTo: parent.id });
  }
}


/** The conditions an Effect brings with it (its "Also applies" list): created with it, flagged with its id, and ended with it. */
async function createLinked(actor, item, parent, origin, duration) {
  const names = String(item.system.linked ?? "").split(",").map(x => x.trim()).filter(Boolean);
  for (const name of names) {
    const linked = await conditionItem(name);
    if (!linked || linked.uuid === item.uuid) continue;
    const id = shortName(linked.name).trim().toLowerCase();
    const had = actor.effects.find(x => shortName(x.name).trim().toLowerCase() === id || x.statuses?.has?.(id));
    if (had && sameSourceKeeps(linked.system, had, origin?.actorUuid)) continue;   // already has it from somewhere else: don't double it (v0.0.424: a condition with a source from a different creature is replaced)
    await createEffect(actor, linked, origin, { duration }, { linkedTo: parent.id });
  }
}

/** Apply effect items to target tokens (through the GM when the user does not own the target). */
export async function applyEffects(effectUuids, targetUuids, origin, over = null) {
  const toActor = async uuid => { const d = await fromUuid(uuid); return d?.documentName === "Actor" ? d : d?.actor; };
  for (const eu of effectUuids) {
    const item = await fromUuid(eu);
    if (!item) continue;
    const targets = item.system.selfApplied ? (origin?.actorUuid ? [origin.actorUuid] : []) : targetUuids;
    for (const tu of targets) {
      const actor = await toActor(tu);
      if (!actor) continue;
      if (actor.isOwner) await createEffect(actor, item, origin, over);
      else game.socket.emit(SOCKET, { type: "applyEffects", effectUuids: [eu], targetUuids: [tu], origin, over });
    }
  }
}

const restored = new Set();
export const forgetRestored = id => restored.delete(id);
async function restoreLight(effect) {
  const b = effect.getFlag(F, "lightBackup");
  if (!Array.isArray(b) || restored.has(effect.id)) return;
  restored.add(effect.id);
  for (const v of b) {
    try {
      const td = await fromUuid(v.uuid);
      if (td) await td.update({ "light.bright": v.bright, "light.dim": v.dim, "light.color": v.color, ...(v.alpha !== undefined ? { "light.alpha": v.alpha } : {}), ...(v.animation ? { "light.animation.type": v.animation.type, "light.animation.speed": v.animation.speed, "light.animation.intensity": v.animation.intensity } : {}) });
    } catch (err) { console.warn("twod12 | could not restore token light", v.uuid, err); }
  }
}

/**
 * Pure (v0.0.343): what the end of a turn does to one effect's duration. flags: the effect's twod12 flags; ended: the combatant whose turn ended
 * { id, initiative, tokenId, actorUuid } (null: none); prior: { round, turn }; me: the affected creature { uuid, tokenId, combatantId }.
 * EoT: ends at the end of the slot the creature was in when it was applied (no slot: the creature's own turn). Rounds: counts down at the end of
 * the slot in which it was applied (older effects: the origin's), skipping that first turn. Returns "end", "tick" or null.
 */
const DUR_KEYS = ["duration", "remaining", "slotInit", "originSlot", "originCombatantId", "anchorSlot", "anchorCombatantId", "appliedRound", "appliedTurn", "lastTick"];
export function durationStep(flags, ended, prior, me) {
  const dur = flags?.duration;
  if (!dur?.type || !ended) return null;
  const has = v => v !== null && v !== undefined && v !== "";
  if (dur.type === "eot") {
    const mine = (me?.combatantId && ended.id === me.combatantId) || (me?.tokenId && ended.tokenId === me.tokenId) || (me?.uuid && ended.actorUuid === me.uuid) || (!!me?.ref && ended.ref === me.ref);
    // v0.0.433 (the Bestiary: "A Minion's EoT effects end at the end of its own turn"): in a slot several creatures share (a squad, a tie), its own turn
    if (has(flags.slotInit)) {
      if (ended.initiative !== null && Number(ended.initiative) === Number(flags.slotInit) && (!ended.shared || mine)) return "end";
      // v0.0.493: if the creature's own non-frozen turn ended (e.g. initiative changed or slot shifted), never orphan its EoT effect
      if (mine && !ended.frozen) return "end";
      return null;
    }
    return mine ? "end" : null;
  }
  if (dur.type !== "rounds") return null;
  const oslot = has(flags.anchorSlot) ? flags.anchorSlot : flags.originSlot;
  // v0.0.433: a slot several creatures share counts down once, at the end of its last creature's turn ("after the last of them")
  const mine = has(oslot) ? ended.initiative !== null && Number(ended.initiative) === Number(oslot) && ended.lastOfSlot !== false : (flags.anchorCombatantId || flags.originCombatantId || "") === ended.id;
  if (!mine) return null;
  if (flags.appliedRound === prior?.round && (flags.appliedTurn === prior?.turn || ended.shared)) return null;   // the slot it was applied in (a shared one: the whole slot, v0.0.433)
  if (flags.lastTick === prior?.round) return null;
  const rem = (flags.remaining ?? dur.rounds) - 1;
  return rem <= 0 ? "end" : "tick";
}

export function registerEffectHooks() {
  Hooks.on("renderTokenHUD", (app, html) => { try { valuedHud(app, html); } catch (e) { console.warn("twod12 | token HUD", e); } });
  // An effect that brought other conditions with it takes them away when it goes (removed by hand, from the HUD, or ended).
  Hooks.on("deleteActiveEffect", (fx, options, userId) => {
    try {
      if (userId !== game.user?.id || !fx.parent?.effects) return;
      const ids = fx.parent.effects.filter(x => x.getFlag?.(F, "linkedTo") === fx.id).map(x => x.id);
      if (ids.length) fx.parent.deleteEmbeddedDocuments("ActiveEffect", ids, { twod12Cascade: true }).catch(() => {});
      // v0.0.249: its inline Actions leave with it
      const acts = (fx.parent.items ?? []).filter(i => i.getFlag?.(F, "inlineOf") === fx.id).map(i => i.id);
      if (acts.length) fx.parent.deleteEmbeddedDocuments("Item", acts).catch(() => {});
    } catch (err) { console.warn("twod12 | linked conditions", err); }
  });
  // Drag an Effect item from the sidebar onto a token to apply it.
  Hooks.on("dropCanvasData", (cv, data) => {
    if (data?.type !== "Item" || !data.uuid) return;
    const item = fromUuidSync(data.uuid);
    if (item?.type !== "effect") return;
    // v0.0.329 (Lucas: "effects can't be placed on the map"): an Effect whose Where is "On the map" is placed as a Zone where it is dropped
    if (item.system?.where === "map") { import("./zone.mjs").then(m => m.placeZoneItem(item)); return false; }
    const hits = canvas.tokens.placeables.filter(t => t.visible && t.bounds.contains(data.x, data.y));
    const token = hits[hits.length - 1];
    if (!token) return;
    const src = canvas.tokens.controlled[0]?.actor ?? game.user.character ?? token.actor;
    applyEffects([item.uuid], [token.document.uuid], originInfo(src.uuid)).then(() => ui.notifications.info(`${item.name} applied to ${token.name}.`));
    return false;
  });
  // Restore on the client that removes the effect; the GM also restores as a fallback.
  Hooks.on("preDeleteActiveEffect", effect => { restoreLight(effect); });
  Hooks.on("deleteActiveEffect", effect => { if (game.user.isActiveGM) restoreLight(effect); });
  // EoT ends with the affected creature's turn; Rounds count down at the end of the origin's turn.
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const ended = combat.combatants.get(prior?.combatantId)
      ?? (prior?.tokenId ? combat.combatants.find(c => c.tokenId === prior.tokenId) : null)
      ?? (Number.isInteger(prior?.turn) ? combat.turns?.[prior.turn] : null);
    const done = [];
    // v0.0.343 (Lucas, playtest 4: Frightened (1 round) and Vulnerable (EoT) didn't end): each effect is done on its own (one error no longer stops
    // the others), and the creature is matched by its combatant, token or uuid, not by object identity (durationStep, tested in t233)
    for (const x of pendingSteps(combat, ended, prior)) {
      try {
        if (x.step === "end") await x.doc.delete();
        // v0.0.361 (PACK PERF, D31): one write with both flags (it was two, each firing every effect hook and a sheet redraw)
        else await x.doc.update({ [`flags.${F}.remaining`]: x.rem, [`flags.${F}.lastTick`]: prior.round });
        done.push(x);
      } catch (err) { console.warn(`twod12 | the duration of ${x.doc?.name} on ${x.on}`, err); }
    }
    // v0.0.362 (Lucas: the Turn Breakdown): one line "End of X's Turn" in the chat, unfolding into that turn's breakdown with what ticked and ended
    try { if (ended) { const { postTurnEnd } = await import("./turndock.mjs"); await postTurnEnd(combat, ended, done.map(x => ({ name: x.name, on: x.on, step: x.step, rem: x.rem })), prior); } } catch (err) { console.warn("twod12 | End of turn", err); }
  });
}

/**
 * v0.0.362: what ticks or ends when this combatant's turn ends: [{ doc, name, on, step: "tick" | "end", rem }] (effects on every creature of the
 * combat and the scene, then the kept areas with a duration). Read only: the durations hook applies them; the Turn Breakdown shows them before.
 * prior: { round, turn, combatantId } of the turn that ends.
 */
export function pendingSteps(combat, ended, prior) {
  const out = [];
  if (!combat || !ended) return out;
  // v0.0.343: one actor per uuid (an unlinked token's combatant and its scene token can be two objects for the same creature: the second one
  // deleted an effect the first had already ended, and that error stopped the loop)
  const actors = new Map();
  for (const c of combat.combatants) if (c.actor) actors.set(c.actor.uuid, c.actor);
  for (const td of canvas?.scene?.tokens ?? []) if (td.actor && !actors.has(td.actor.uuid)) actors.set(td.actor.uuid, td.actor);
  // v0.0.433 (the Bestiary audit: a Minions' squad shares one Initiative): shared = another combatant has the same Initiative; lastOfSlot = no
  // combatant after this one in the turn order has it (the slot ends with its last creature)
  const turns = combat.turns ?? [], at = turns.findIndex(c => c.id === ended.id), same = c => c.initiative !== null && c.initiative !== undefined && c.initiative === ended.initiative;
  const endInfo = { id: ended.id, initiative: ended.initiative ?? null, tokenId: ended.tokenId ?? "", actorUuid: ended.actor?.uuid ?? "", ref: ended.actor ?? null,
    shared: turns.some(c => c.id !== ended.id && same(c)), lastOfSlot: at < 0 || !turns.slice(at + 1).some(same), frozen: !!ended.getFlag?.(F, "frozen") };
  const short = n => String(n ?? "").replace(/\s*\(.*\)\s*$/, "");
  for (const actor of actors.values()) {
    for (const e of [...actor.effects]) {
      if (typeof actor.effects.has === "function" && !actor.effects.has(e.id)) continue;   // gone with its parent (a linked condition)
      try {
        const fl = Object.fromEntries(DUR_KEYS.map(k => [k, e.getFlag(F, k)]));
        let cid = ""; try { cid = combatantOf(actor, combat)?.id ?? ""; } catch (err) { /* no combatant */ }
        const step = durationStep(fl, endInfo, prior, { uuid: actor.uuid ?? "", tokenId: actor.isToken ? actor.token?.id ?? "" : "", combatantId: cid, ref: actor });
        if (step) out.push({ doc: e, name: e.name, on: short(actor.name), step, rem: step === "tick" ? (e.getFlag(F, "remaining") ?? e.getFlag(F, "duration")?.rounds) - 1 : 0 });
      } catch (err) { console.warn(`twod12 | the duration of ${e?.name} on ${actor?.name}`, err); }
    }
  }
  // Kept template areas with a duration. They start when placed (reactions included):
  // "expire:eot" ends at the end of the origin's turn; otherwise the rounds count down at the end of the
  // turn that was current when the area was placed, skipping that first turn.
  for (const reg of [...(canvas?.scene?.regions ?? [])]) {
    const dur = reg.getFlag(F, "duration");
    if (!dur?.type) continue;
    const isSlot = (slotKey, idKey) => { const sl = reg.getFlag(F, slotKey); return sl !== null && sl !== undefined ? ended.initiative === sl : reg.getFlag(F, idKey) === ended.id; };
    const name = short(reg.name || reg.getFlag(F, "zone")?.name || "Area");
    if (dur.expire === "eot") { if (isSlot("originSlot", "originCombatantId")) out.push({ doc: reg, name, on: "", step: "end", rem: 0 }); continue; }
    if (!isSlot("anchorSlot", "anchorCombatantId")) continue;
    if (reg.getFlag(F, "appliedRound") === prior?.round && reg.getFlag(F, "appliedTurn") === prior?.turn) continue;
    if (reg.getFlag(F, "lastTick") === prior?.round) continue;
    const rem = (reg.getFlag(F, "remaining") ?? dur.rounds) - 1;
    out.push({ doc: reg, name, on: "", step: rem <= 0 ? "end" : "tick", rem: Math.max(0, rem) });
  }
  return out;
}

/* Effects panel next to the sidebar: hover for info, click for details, right-click to remove. */
let panel;
function currentActor() {
  const t = canvas.tokens?.controlled ?? [];
  return t.length === 1 ? t[0].actor : (game.user.character ?? null);
}
function positionPanel() {
  const sb = document.getElementById("sidebar");
  if (!panel || !sb) return;
  const r = sb.getBoundingClientRect();
  panel.style.right = `${Math.max(8, window.innerWidth - r.left + 8)}px`;
  panel.style.top = `${Math.max(8, r.top + 8)}px`;
}
/** v0.0.257 (Lucas): the hover card of an icon of the panel beside the chat (the sheet's and the HUD's card, with the panel's own controls). */
export function panelCardHtml(e, actor, { dur = "", note = "" } = {}) {
  const counter = isExhaustedFx(e) && actor?.type === "character", valued = isValued(e);
  const name = valued ? `${baseNameOf(e)} ${Number(e.getFlag(F, "value")) || 1}` : counter && actor.system.exhausted > 0 ? `${e.name} ${actor.system.exhausted}` : e.name;
  const text = hoverOf(e.getFlag(F, "hover"), e.getFlag(F, "description") ?? e.description);
  const by = e.origin && e.origin !== actor?.uuid ? (fromUuidSync(e.origin)?.name ?? "") : "";
  return fxTipHtml({ name, dur: dur || "until removed", text: [text, note].filter(Boolean).join(" "), what: effectWhat(e), source: by ? `From ${by}` : "",
    controls: valued || counter ? "Click: +1 · Right-click: −1 · Shift+click: settings · Ctrl+click: remove" : "Click: open · Right-click: remove" });
}
/** Is this effect on the creature the panel shows (an effect on one of its items counts)? */
function panelShows(effect) {
  const shown = currentActor();
  if (!shown) return false;
  const p = effect?.parent, a = p?.documentName === "Actor" ? p : p?.parent;
  return !a || a === shown || (!!a.uuid && a.uuid === shown.uuid);
}
function renderPanel() {
  if (!panel) return;
  const actor = currentActor();
  panel.innerHTML = "";
  if (actor) {
    // v0.0.258 (Lucas): a condition another effect brought (linkedTo) sits right under that effect, a chain between the two icons
    const shown = actor.effects.filter(e => !e.disabled), order = [];
    for (const e of shown) if (!e.getFlag(F, "linkedTo") || !shown.some(p => p.id === e.getFlag(F, "linkedTo"))) order.push(e, ...shown.filter(c => c.getFlag(F, "linkedTo") === e.id));
    for (const e of order) {
      if (e.getFlag(F, "linkedTo") && shown.some(p => p.id === e.getFlag(F, "linkedTo"))) {
        const link = document.createElement("div");
        link.className = "fx-chain";
        link.innerHTML = `<span class="fx-chainline"></span><i class="fa-solid fa-link"></i>`;
        link.setAttribute("aria-label", `Brought by ${shown.find(p => p.id === e.getFlag(F, "linkedTo")).name}: it leaves with it`);
        panel.appendChild(link);
      }
      const el = document.createElement("div");
      el.className = `fx-icon${e.getFlag(F, "linkedTo") && shown.some(p => p.id === e.getFlag(F, "linkedTo")) ? " fx-linked" : ""}`;
      el.dataset.effectId = e.id;
      el.innerHTML = `<img src="${e.img}" alt="">${isExhaustedFx(e) && actor.type === "character" && actor.system.exhausted > 0 ? `<span class="fx-val">${actor.system.exhausted}</span>` : ""}`;
      if (isValued(e)) el.innerHTML = `<img src="${e.img}" alt=""><span class="fx-val">${Number(e.getFlag(F, "value")) || 1}</span>`;
      el.setAttribute("aria-label", e.name);   // v0.0.421 (the audit): a picture only: its name for screen readers (the hover card went in v0.0.420)
      panel.appendChild(el);
    }
  }
  positionPanel();
}
export function setupPanel() {
  panel = document.createElement("div");
  panel.id = "twod12-effects";
  document.body.appendChild(panel);
  // v0.0.361 (PACK PERF, D32): drawn at most once a frame, and an effect's change only when it is on the creature shown (it was any actor's)
  const draw = perFrame(renderPanel);
  for (const h of ["controlToken", "canvasReady", "collapseSidebar", "renderSidebar"]) Hooks.on(h, draw);
  for (const h of ["createActiveEffect", "deleteActiveEffect", "updateActiveEffect"]) Hooks.on(h, effect => { if (panelShows(effect)) draw(); });
  window.addEventListener("resize", positionPanel);
  const sb = document.getElementById("sidebar");
  if (sb && window.ResizeObserver) new ResizeObserver(positionPanel).observe(sb);
  // (v0.0.421: the hover card on pointerover went with the tooltip review)
  panel.addEventListener("contextmenu", async ev => {
    const el = ev.target.closest("[data-effect-id]");
    if (!el) return;
    ev.preventDefault();
    const actor = currentActor();
    if (!actor?.isOwner) return ui.notifications.warn("You can't remove effects from this character.");
    const fx = actor.effects.get(el.dataset.effectId);
    if (isExhaustedFx(fx) && actor.type === "character") return void (await bumpExhausted(actor, -1));   // a condition with a value: right-click is -1
    if (isValued(fx)) return void (await bumpValued(fx, -1));
    await fx?.delete();
  });
  panel.addEventListener("click", ev => {
    const el = ev.target.closest("[data-effect-id]");
    const actor = currentActor(), fx = el ? actor?.effects.get(el.dataset.effectId) : null;
    if (isExhaustedFx(fx) && actor.type === "character") { exhaustedClick(actor, fx, { shift: ev.shiftKey, ctrl: ev.ctrlKey || ev.metaKey }); return; }   // click: +1; Shift: settings; Ctrl: remove
    if (isValued(fx)) { valuedClick(fx, { shift: ev.shiftKey, ctrl: ev.ctrlKey || ev.metaKey }); return; }   // click: +1; Shift: settings; Ctrl: remove
    if (el) openEffectSheet(fx);
  });
  renderPanel();
  setTimeout(positionPanel, 500);
}


/**
 * A condition by name (hindered, immobilized, prone...): the Effect item with that name is applied (with the given duration instead of its own),
 * or, when there is no such item, just the status. dur: { type: "eot" } or { type: "rounds", rounds: N } or null.
 */
/** The Effect item (the world's, or the system's compendium) with a condition's name, or null. */
export async function conditionItem(cond) {
  const id00 = String(cond).trim().toLowerCase(), id0 = COND_ALIAS[id00] ?? id00, id = COND_NAME[id0] ?? id0;   // v0.0.414: the status bleed is the condition Lingering
  let item = game.items.find(i => i.type === "effect" && shortName(i.name).trim().toLowerCase() === id);
  if (!item) {   // the system's Conditions compendium, then its Effects
    for (const key of ["twod12.conditions", "twod12.effects"]) {
      const pack = game.packs?.get(key);
      const entry = pack ? (await pack.getIndex()).find(x => shortName(x.name).trim().toLowerCase() === id) : null;
      item = entry ? await pack.getDocument(entry._id) : null;
      if (item) break;
    }
  }
  return item;
}

/** v0.0.414: a status id whose condition item has another name (Bleed is Lingering in the book). */
export const COND_NAME = { bleed: "lingering" };
/** The core rework E1 (2026-11-21): an old card's or chip's Frightened finds Daunted. */
export const COND_ALIAS = { frightened: "daunted" };

/** A condition with a value on a creature (Empowered 2): the value is kept on its effect. */
export const isValued = fx => !!fx && fx.getFlag?.(F, "value") != null && !isExhaustedFx(fx);
/** The condition's own name, without its value ("Enfeebled" for the effect "Enfeebled 2"). */
export const baseNameOf = fx => fx.getFlag?.(F, "baseName") ?? shortName(fx.name).replace(/\s+\d+\s*$/, "");
/**
 * Set the value of a condition: the effect is renamed with it ("Enfeebled 2"), which is what makes the floating text on the token work like Exhausted's
 * ("+ Enfeebled 2" floating up when it is raised, "\u2212 Enfeebled 1" sliding down when it is lowered, "\u2212 Enfeebled" when it goes).
 */
export async function setValued(fx, v) { await fx.update({ name: `${baseNameOf(fx)} ${v}`, [`flags.${F}.value`]: v }); }
/** Raise or lower the value; at 0 the condition goes. */
export async function bumpValued(fx, delta) {
  const v = (Number(fx.getFlag(F, "value")) || 0) + delta;
  if (v <= 0) await fx.delete(); else await setValued(fx, v);
}
function valuedClick(fx, { shift, ctrl }) {
  if (ctrl) return fx.delete();
  if (shift) return openEffectSheet(fx);
  return bumpValued(fx, 1);
}

/** The token HUD's condition grid: the tooltip of a condition with a value says its value and the clicks. (The clicks go through the status toggle, wrapped below.) */
export function valuedHud(app, html) {
  const root = typeof HTMLElement !== "undefined" && html instanceof HTMLElement ? html : (html?.[0] ?? html ?? app?.element);
  const actor = (app?.document ?? app?.object)?.actor;
  if (!root?.querySelectorAll || !actor) return 0;
  let n = 0;
  // v0.0.421 (the audit): the hover cards went in v0.0.420 (the tooltip review); this counts the statuses the creature has (no card is built)
  for (const el of root.querySelectorAll("[data-status-id]")) if (actor.effects.some(x => x.statuses?.has?.(el.dataset.statusId))) n++;
  return n;
}

export async function applyCondition(cond, actors, dur, origin, value = null, extra = {}) {   // extra (v0.0.314): { bleed } (a card's Bleed values), { endWhenUnthreatened }
  const id = String(cond).trim().toLowerCase();
  const item = await conditionItem(id);
  for (const actor of actors) {
    if (item) {
      await applyEffects([item.uuid], [actor.uuid], origin, dur || value || extra?.bleed || extra?.endWhenUnthreatened ? { ...(dur ? { duration: dur } : {}), ...(value ? { value } : {}), ...(extra?.bleed ? { bleed: extra.bleed } : {}), ...(extra?.endWhenUnthreatened ? { endWhenUnthreatened: true } : {}) } : null);   // v0.0.250: a value (Enfeebled 1)
    } else if (actor.isOwner) {
      await actor.toggleStatusEffect(id, { active: true });
    } else {
      game.socket.emit(SOCKET, { type: "applyCondition", cond: id, actorUuid: actor.uuid, dur, origin });
    }
  }
  return !!item;
}


/**
 * Foundry's condition grid (the Token HUD) makes a bare status: an icon with none of the system's rules. For a condition that has an Effect in the
 * system's compendium (Prone, Hindered, Immobilized, Leaning, Imperiled...), switching it ON from the HUD applies that Effect instead, so Prone brings
 * its Hindered and its boons and Hindered halves the Speed, like the buttons on cards do. Switching OFF, and every other status, is Foundry's own.
 */
export function wrapConditions(proto, deps = {}) {
  const inner = proto?.toggleStatusEffect;
  if (typeof inner !== "function" || inner.twod12Conditions) return false;
  const find = deps.find ?? conditionItem, apply = deps.apply ?? applyEffects;
  const wrapped = async function (statusId, options = {}) {
    if (statusId === "exhausted" || options?.twod12Raw) return inner.call(this, statusId, options);
    if (statusId === "dead" && options?.overlay) return inner.call(this, statusId, { ...options, overlay: false });
    // A condition with a value that is already on (Empowered 2): a click is +1 (Shift: settings, Ctrl: remove) and a right-click (Foundry passes overlay: true) is -1, whatever `active` says.
    const valued = this.effects?.find?.(x => x.statuses?.has?.(statusId) && isValued(x));
    if (valued) {
      if (this.isOwner) { if (options?.overlay) await bumpValued(valued, -1); else await valuedClick(valued, heldModifiers()); }
      try { globalThis.canvas?.hud?.token?.render?.(); } catch (e) { /* no HUD open */ }
      return this.effects.find(x => x.statuses?.has?.(statusId)) ?? false;
    }
    const has = !!this.statuses?.has?.(statusId);
    const want = options?.active ?? !has;
    if (!want || has) return inner.call(this, statusId, options);          // switching off, or already on: Foundry's own
    const item = await find(statusId);
    if (!item) return inner.call(this, statusId, options);                 // no Effect with that name: just the status
    if (item.system?.valued && options?.overlay) return false;             // a right-click on a condition it doesn't have: nothing to lower
    // v0.0.315 (Lucas): Frightened, Taunted, Grabbed ask their origin (a token on the map); Bleed asks its damage (a window). Cancel: nothing.
    const ask = deps.ask ?? (async (it, a) => (await import("./conditions.mjs")).askApply(it, a));
    const asked = (needsOrigin(item.system) || hasBleed(item.system)) ? await ask(item, this) : { origin: null, over: {} };
    if (!asked) return false;
    const over = { ...(item.system?.valued ? { value: 1 } : {}), ...(asked.over ?? {}) };
    await apply([item.uuid], [this.uuid], originInfo(asked.origin ?? this.uuid), Object.keys(over).length ? over : null);   // a condition with a value starts at 1
    return this.effects.find(x => x.statuses?.has?.(statusId)) ?? false;
  };
  wrapped.twod12Conditions = true;
  proto.toggleStatusEffect = wrapped;
  return true;
}

/**
 * World Effects with the same name as an Effect of the system's compendium. A condition applied from a card or the HUD uses the world's Effect first,
 * so an old copy keeps its old rules after the system is updated. Returns [{ name, uuid, differs: [fields that are not the same] }] and tells you.
 */
export async function shadowedEffects() {
  const packs = ["twod12.conditions", "twod12.effects"].map(k => game.packs?.get(k)).filter(Boolean);
  if (!packs.length) return [];
  const indexes = await Promise.all(packs.map(async p => [p, await p.getIndex()])), norm = v => JSON.stringify(v ?? ""), out = [];
  for (const w of game.items.filter(i => i.type === "effect")) {
    const same = x => shortName(x.name).trim().toLowerCase() === shortName(w.name).trim().toLowerCase();
    const hit = indexes.map(([p, idx]) => [p, idx.find(same)]).find(([p, entry]) => entry);
    if (!hit) continue;
    const c = await hit[0].getDocument(hit[1]._id);
    out.push({ name: w.name, uuid: w.uuid, differs: ["linked", "description", "duration", "settings", "selfApplied", "expireOn", "valued", "conditions", "isCondition"].filter(k => norm(w.system[k]) !== norm(c.system[k])) });
  }
  console.table(out.map(o => ({ name: o.name, uuid: o.uuid, differs: o.differs.join(", ") || "(same)" })));
  const old = out.filter(o => o.differs.length);
  ui.notifications.info(
    old.length
      ? `${old.length} world Effect${old.length === 1 ? " differs" : "s differ"} from the compendium and ${old.length === 1 ? "is" : "are"} used instead of it: ${old.map(o => `${o.name} (${o.differs.join(", ")})`).join("; ")}. Delete them, or edit them, to use the system's.`
      : out.length
        ? "The world's Effects with a compendium name are the same as the compendium's."
        : "No world Effect shadows the compendium."
  );
  return out;
}
