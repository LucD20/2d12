// PACK SHEET (v0.0.289, Lucas's approved design: foundry/mockups/sheet-prototype.html): the pure pieces of the character sheet.
// Everything here takes plain data (no Foundry), so the tests (t212) load it; actor-sheets.mjs gathers the data and renders the template.

/** The frequency colors of the sheet (Round blue, Encounter red, Turn and Reactions teal, At-will green, Daily the book's purple). */
export const SHEET_FREQ = {
  round: { color: "#2c5d9e", label: "Once per round" },
  turn: { color: "#1f7a72", label: "Once per turn" },
  encounter: { color: "#a8322d", label: "Once per encounter" },
  daily: { color: "#5B3FA6", label: "Once per day" },
  atwill: { color: "#4c7a2e", label: "At will" },
  reaction: { color: "#1f7a72", label: "Reactions" }
};
/** The order of the Actions tab's sections (only the ones with rows are shown). */
export const SECTION_ORDER = ["granted", "apex", "round", "turn", "encounter", "daily", "atwill", "reaction"];

/**
 * The Actions tab's section of an Action. a: { granted, basic, basicKey, reaction, escalation, frequency }.
 * "granted" (a granted use or an inline Action of an effect), "reaction" (any Reaction, and the Opportunity Attack Basic Action), "basic"
 * (the Basic Actions grid), "apex" (an Action that needs an Escalation level), else its Frequency ("round", "turn", "encounter", "daily",
 * "atwill"; no Frequency counts as At will).
 */
export function actionSection(a = {}) {
  if (a.granted) return "granted";
  if (a.basicKey === "opportunityAttack") return "reaction";
  if (a.basicKey === "basicWeaponAttack") return "atwill";
  if (a.basic) return "basic";
  if (a.reaction) return "reaction";
  if (Number(a.escalation) > 0) return "apex";
  const f = String(a.frequency ?? "");
  return ["round", "turn", "encounter", "daily"].includes(f) ? f : "atwill";
}

/** Book, Chapter 1, Attribute DCs: a creature's Body DC (Mind, Appeal, Instinct) is 11 + the Attribute (+ the creature's bonus for that Defense). */
export const vsAttribute = (value, bonus = 0) => 11 + (Math.trunc(Number(value)) || 0) + (Number(bonus) || 0);   // the core rework A7 (Lucas, 2026-11-21): 11 + the Attribute (v0.0.307: 12 +)
export function vsDefenses(attrs = {}, bonus = {}) {
  return Object.fromEntries(["body", "mind", "appeal", "instinct"].map(k => [k, vsAttribute(attrs[k], bonus[k])]));
}

/** Book, Chapter 1: a Save's DC is 11 + the Modifier that sets it. mods: { weapon, power, signature }. */
export const saveDC = mod => 11 + (Math.trunc(Number(mod)) || 0);
export function saveDCs(mods = {}) {
  return { weapon: saveDC(mods.weapon), power: saveDC(mods.power), signature: saveDC(mods.signature) };
}

/** The Strikes counter of the combat strip: every [Strike] Action used this turn (usage.mjs counts them), at most 3. */
export const strikesLine = n => `Strikes this turn ${Math.max(0, Math.trunc(Number(n)) || 0)} / 3`;

/** The cost pill: "1/2/3", "2/3", "1R", "0" (no "AP": the column says Cost). */
export function costPill(aps = [], reaction = false) {
  const list = [...new Set((aps ?? []).map(v => Math.max(0, Math.trunc(Number(v)) || 0)))].sort((x, y) => x - y);
  if (!list.length) return "";
  return `${list.join("/")}${reaction ? "R" : " AP"}`;   // v0.0.294 (Lucas): "1/2/3 AP" (a Reaction keeps "1R")
}

/** The Vs. column: a Defense or a Save in short form ("AD", "WD", "Body", "App Save"); nothing for DC 13 or no roll. */
const SHORT = { Body: "Body", Mind: "Mind", Appeal: "App", Instinct: "Inst" };
export function vsShort(text) {
  const t = String(text ?? "").trim();
  if (!t || /^DC\b/i.test(t) || /attribute rolled/i.test(t)) return "";
  const save = t.match(/^(Body|Mind|Appeal|Instinct) Save$/i);
  if (save) return `${SHORT[save[1][0].toUpperCase() + save[1].slice(1).toLowerCase()]} Save`;
  if (/^AD or WD$/i.test(t)) return "AD/WD";
  if (/^AD \(Weapon mode\) or WD/i.test(t)) return "AD/WD";
  return t.replace(/\b(Appeal|Instinct)\b/g, m => SHORT[m]);
}

/** A distance as the sheet shows it: a number reads as squares ("5 sq."); words stay; nothing is "—". */
export const distanceShort = d => { const t = String(d ?? "").trim(); return !t ? "—" : /^\d+$/.test(t) ? `${t} sq.` : t; };

/**
 * Why a Basic Action can't be used now ("" when it can). key: the Basic Action's key (its basic flag). c: { freeHand, reloadWeapon, prone,
 * immobilized, speed, reach, down, rallyLeft }. Only what the card's Requirements say and the system can check.
 */
export function basicUnavailable(key, c = {}) {
  switch (key) {
    case "fists": return c.freeHand ? "" : "No free hand";
    case "reload": return c.reloadWeapon ? "" : "No Reload weapon";
    case "stand": return c.prone ? "" : "Not Prone";
    case "breakFree": return c.immobilized ? "" : "Not Immobilized";
    case "charge": return (Number(c.speed) || 0) >= 3 ? "" : "Speed under 3";
    case "haul": return (Number(c.reach) || 0) >= 2 ? "" : "Reach under 2";
    case "rally": return c.npc ? "No Rally Points" : c.down ? "Not while Down" : ((Number(c.rallyLeft) || 0) > 0 ? "" : "No Rally Points left");
    default: return "";
  }
}

/** "next: 1 Bane", "next: 2 Banes" (an At-will Action's next use this turn), or "". */
export const nextBanes = uses => { const n = Math.max(0, Math.trunc(Number(uses)) || 0); return n ? `next: ${n} Bane${n === 1 ? "" : "s"}` : ""; };

/** Book, Chapter 4: Bloodied while Vigor damage >= Vigor; Strained while Resolve damage >= Resolve. s: { bodyDamage, mindDamage, bdt, mdt }. */
export function healthTags(s = {}) {
  const n = v => Math.max(0, Number(v) || 0);
  if (s.isMinion) return { bloodied: !!s.bloodied, strained: !!s.strained };   // the Bestiary's rebuild: a Minion at 1 tick (roundrules.mjs minionState)
  return { bloodied: n(s.bdt) > 0 && n(s.bodyDamage) >= n(s.bdt), strained: n(s.mdt) > 0 && n(s.mindDamage) >= n(s.mdt) };
}

/** The "to Down" number: the damage left before the Health Pool is reached (0 once Down). */
export const toDown = (pool, damage) => Math.max(0, (Number(pool) || 0) - (Number(damage) || 0));

/**
 * Book, Chapter 4, Going Down: the Down state from the damage, or the condition the creature already has. s: { pool, totalDamage, nonlethal,
 * bodyDamage, mindDamage }; statuses: a Set of status ids. Returns { down, state, kind, check, note } or { down: false }.
 *   kind: "dying" | "shattered" | "" (the Table and the end-of-turn Check go with it); check: "Body" | "Mind" | "".
 */
export function downState(s = {}, statuses = new Set()) {
  const pool = Number(s.pool) || 0, dmg = Number(s.totalDamage) || 0;
  if (!(pool > 0 && dmg >= pool)) return { down: false };
  const has = k => !!statuses?.has?.(k);
  const out = (state, kind = "", note = "") => ({ down: true, state, kind, check: kind === "dying" ? "Body" : kind === "shattered" ? "Mind" : "", note });
  const hit = "Damage while fighting: a Body Check (Vigor damage) or a Mind Check (Resolve damage).";
  if (has("dying")) return out("Dying", "dying", has("unconscious") ? "Collapsed (Unconscious). End of turn: a Body Check." : `Keep fighting, or collapse (Unconscious). ${hit}`);
  if (has("shattered")) return out("Shattered", "shattered", has("unconscious") ? "Gave up (Unconscious). End of turn: a Mind Check." : `Keep fighting, or give up (Unconscious). ${hit}`);
  if (has("desperate")) return out("Desperate", "", "Fighting on. Nonlethal damage at half your Health Pool: Unconscious. Any Lethal damage: Dying or Shattered.");
  if (has("unconscious")) return out("Unconscious", "", "Down and Unconscious.");
  const nl = Number(s.nonlethal) || 0, body = Number(s.bodyDamage) || 0, mind = Number(s.mindDamage) || 0;
  if (nl >= pool / 2) return out("Unconscious", "", "Nonlethal damage at half your Health Pool or more.");
  if (nl > 0) return out("Desperate or Unconscious", "", "Some Nonlethal damage: fall Unconscious, or keep fighting as Desperate.");
  if (body > mind) return out("Dying", "dying", `Keep fighting, or collapse (Unconscious). ${hit}`);
  if (mind > body) return out("Shattered", "shattered", `Keep fighting, or give up (Unconscious). ${hit}`);
  return out("Dying or Shattered", "", "Vigor and Resolve damage are tied: you choose.");
}

/** The Dominant Damage's pool name: "Vigor", "Resolve" or "Tie". */
export const dominantPool = (body, mind) => ((Number(body) || 0) > (Number(mind) || 0) ? "Vigor" : (Number(mind) || 0) > (Number(body) || 0) ? "Resolve" : "Tie");

/** A health bar: lethal (solid) and nonlethal (striped) as widths in % of the threshold, stacked, never past 100. */
export function barSegments(lethal, nonlethal, max) {
  const m = Math.max(1, Number(max) || 0), l = Math.max(0, Number(lethal) || 0), n = Math.max(0, Number(nonlethal) || 0);
  const lw = Math.min(100, (l / m) * 100), nw = Math.min(100 - lw, (n / m) * 100);
  return { lethal: Math.round(lw * 10) / 10, nonlethal: Math.round(nw * 10) / 10 };
}

/** Count-down sheet health bar: remaining solid fill + recoverable Nonlethal hatch beside it (% of max threshold). */
export function barRemainingSegments(lethal, nonlethal, max) {
  const m = Math.max(1, Number(max) || 0), l = Math.max(0, Number(lethal) || 0), n = Math.max(0, Number(nonlethal) || 0);
  const rem = Math.max(0, m - (l + n));
  const nl = Math.min(m - rem, n);
  return {
    lethal: Math.round((rem / m) * 1000) / 10,
    nonlethal: Math.round((nl / m) * 1000) / 10,
    left: (Number(max) || 0) - (l + n)
  };
}

/**
 * The AP pips of the combat strip. ap: AP now; regained: the AP this turn gave (4 + Quickened - Slowed); slowed: the Slowed value.
 * [{ k: "on" | "spent" | "slowed" }]: the available ones, then the spent ones, then one crossed pip per AP Slowed took this turn.
 */
export function apPips(ap, regained, slowed = 0) {
  const a = Math.max(0, Math.trunc(Number(ap)) || 0), r = Math.max(a, Math.trunc(Number(regained)) || 0), s = Math.max(0, Math.trunc(Number(slowed)) || 0);
  return [...Array.from({ length: a }, () => ({ k: "on" })), ...Array.from({ length: r - a }, () => ({ k: "spent" })), ...Array.from({ length: s }, () => ({ k: "slowed" }))];
}

/** How a Reaction's cost is paid: the Reaction Point first, the rest from the AP (moved here from combat.mjs in v0.0.297; combat.mjs re-exports it). */
import { payReaction } from "./roundrules.mjs";   // v0.0.365 (SIM-1): the rule itself is in roundrules.mjs (pure, shared with the automated playtest environment)
export { payReaction };
/**
 * v0.0.297 (PACK ACTION-PREVIEW): why a cost can't be paid now ("" = it can): the one AP check of the sheet's rows, the card's Version buttons
 * and the roll dialog. ap: the AP left; rap: the Reaction Point (a Reaction only).
 */
export function versionCant(cost, ap, rap = 0, reaction = false) {
  const have = Math.max(0, Number(ap) || 0), r = reaction ? Math.max(0, Number(rap) || 0) : 0;
  return payReaction(Math.max(0, Number(cost) || 0), have, r).fromAp > have ? `Not enough AP: ${have} left${reaction ? ` and ${r} Reaction Point` : ""}` : "";
}

/** The Escalation rungs: "1 · <passive>","2 · <passive>", "3 · <passive> + Apex"; lit up to the level. names: { 1: [...], 2: [...], 3: [...] }. */
export function escRungs(level, names = {}, apex = false, apexAt = 6) {
  // v0.0.407 (Stage 0 in Foundry; book, Chapter 2): the Passives at Escalation 2, 4 and 6 and the Apex at 6; a card still written on pack R's
  // ladder (Escalation 1 / 2 / 3, until the class card sessions) shows at its own number. apex: the creature has an Action with an Escalation line
  // (apexAt: the highest such line).
  const now = Math.max(0, Math.trunc(Number(level)) || 0), at = Math.max(1, Math.trunc(Number(apexAt)) || 6);
  const rungs = [...new Set([2, 4, 6, ...Object.keys(names).map(Number).filter(n => n > 0 && (names[n] ?? []).some(Boolean)), ...(apex ? [at] : [])])].sort((a, b) => a - b);
  return rungs.map(n => {
    const list = (names[n] ?? []).filter(Boolean);
    const text = [list.join(" / ") || (n === at && apex ? "" : "—"), n === at && apex ? "Apex" : ""].filter(Boolean).join(" + ");
    return { n, lit: now >= n, label: `${n} · ${text}` };
  });
}

/** The hooks not used this encounter: the Critical and the class hook(s). used: { crit, hook } (true when used). */
export function hooksLeft(hookNames = [], used = {}) {
  return [...(used.crit ? [] : ["Critical"]), ...(used.hook ? [] : hookNames)];
}

/** Slots on the Build tab: the section titles shortened ("Features" is "Feature"); the Escalation sections go in their own block. */
export function slotLabel(title) {
  const t = String(title ?? "").trim();
  if (/^features?$/i.test(t)) return "Feature";
  return t;
}
/** An Escalation section of the class table: "Escalation N Passive" (N) or "Apex" (4); 0: not one. */
export const ESC_APEX = 7;
export function escSectionRank(title) {
  const t = String(title ?? "");
  const m = t.match(/^Escalation\s+(\d)/i);
  // v0.0.455 (the group 3 mockup found it): Escalation runs 1 to 6 since Stage 0 (it was capped at 3, from the old scale): "Escalation 4" is 4;
  // the Apex sorts after them (ESC_APEX)
  if (m) return Math.min(6, Number(m[1]));
  return /\bapex\b/i.test(t) ? ESC_APEX : 0;
}

/**
 * The Build validator (pure): the cards that fill no slot. cards: [{ id, name, kind: "action" | "feature" | "talent", flags, category,
 * createdTime }]; sections: { secId: { level, title, pick } } (the class levels reached); hasItem(id): the item exists (a parent).
 * A card fills a slot when it was given by something (its Feature, Talent, weapon, effect), is a Basic Action or a Weapon Technique, was given by
 * the class or the species, fills a Talent slot (a slot key, or the GM's extra drop: no key), or was picked in a class section of a level reached
 * and that section is not over its pick count (then the newest ones fill it and the older ones don't).
 */
export function slotless(cards = [], sections = {}, hasItem = () => true) {
  const out = [], bySection = new Map();
  for (const c of cards) {
    const f = c.flags ?? {};
    const parent = f.featureId || f.talentId || f.weaponId || f.inlineOf;
    if (parent) { if (!hasItem(parent)) out.push(c); continue; }
    if (f.basic || /weapon technique/i.test(String(c.category ?? ""))) continue;
    if (["class", "choice", "species"].includes(f.grantedBy) && !f.classSection) continue;
    if (c.kind === "talent" || f.slot !== undefined || c.talentAction) continue;   // a Talent: a slot, or an extra (the GM's drop)
    const sec = f.classSection ? sections[f.classSection] : null;
    if (!sec) { out.push(c); continue; }
    (bySection.get(f.classSection) ?? bySection.set(f.classSection, []).get(f.classSection)).push(c);
  }
  for (const [id, list] of bySection) {
    const pick = Math.max(1, Number(sections[id]?.pick) || 1);
    if (sections[id]?.granted || list.length <= pick) continue;
    const newest = [...list].sort((x, y) => (Number(y.createdTime) || 0) - (Number(x.createdTime) || 0));
    out.push(...newest.slice(pick));
  }
  return out;
}

/**
 * The "Next levels" lines, from the class table (the levels after this one, up to the next Stage's first level). levels: [{ sections: [{ kind,
 * title, pick }] }]; stage: { at, n, health: [high, low], guard, rally: 1 } for the level that starts the next Stage.
 * [{ level, text }]: "1 Talent · 1 Daily Pick"; the Stage level: "Stage 2: Stage Talent · Health +14 / +7 · Guard 3 per AP · Rally +1" (no Attribute since v0.0.407).
 */
export function nextLevels(level, levels = [], stage = null) {
  const lv = Math.max(1, Math.trunc(Number(level)) || 1), end = stage?.at ?? lv + 1, out = [];
  for (let L = lv + 1; L <= end; L++) {
    const secs = (levels[L - 1]?.sections ?? []).filter(s => s.kind !== "attr" || L === stage?.at);
    const parts = secs.filter(s => s.kind !== "attr").map(s => `${Math.max(1, Number(s.pick) || 1)} ${slotLabel(s.title)}`);
    if (stage && L === stage.at) {
      // v0.0.407 (Stage 0 in Foundry; book, Chapter 5): no Attribute increase at a Stage; +1 to one Modifier at Stage 1, to both at Stage 3
      const st = [`Stage ${stage.n}:`, "Stage Talent"];
      if (stage.health && (stage.health[0] || stage.health[1])) st.push(`Health +${stage.health[0]} / +${stage.health[1]}`);
      if (stage.guard) st.push(`Guard ${stage.guard} per AP`);
      st.push(`Rally +${stage.rally ?? 1}`);
      if (stage.modifiers === "one") st.push("+1 to one Modifier"); else if (stage.modifiers) st.push("Modifiers +1");
      out.push({ level: L, text: `${st[0]} ${st.slice(1).join(" · ")}` });
      continue;
    }
    out.push({ level: L, text: parts.join(" · ") || "—" });
  }
  return out;
}

/** Strips the system's enrichers from a text for a hover line: "@Book[Tags]{Tag}" is "Tag", "@Check[mind|label:Mind Save]" is "Mind Save". */
export function plainEnrichers(text) {
  return String(text ?? "")
    .replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1")
    .replace(/@\w+\[[^\]]*\|label:([^\]|]*)[^\]]*\]/g, "$1")
    .replace(/@\w+\[([^\]|]*)[^\]]*\]/g, "$1");
}

/* ---------------------------------------------------------------- PACK NPC-SHEET (v0.0.291): the NPC sheet and the shared row lines */

/** The rating keys a role uses, in order (a Minion has no Extreme). R: TWOD12.npcRatings. */
export const ratingKeys = (role, R) => Object.keys(R).filter(k => role?.extreme !== false || k !== "extreme");
/** A rating kept within the role's steps (a Minion's Extreme becomes High); "custom" stays. */
export const clampRating = (r, role, R) => { if (r === "custom") return r; const keys = ratingKeys(role, R); return keys.includes(r) ? r : keys[keys.length - 1]; };
/** Every rating of an NPC clamped to a role (the role switch writes these). */
export function clampRatings(ratings = {}, role, R) {
  return Object.fromEntries(Object.entries(ratings).map(([k, v]) => [k, k === "speed" ? v : clampRating(v, role, R)]));
}
/** The table values of a role at a Stage (0..3; pack R's three rows: Stages 0 and 1 read the first, config.mjs npcRoleRow) for a rating. */
export function npcRow(role, R, rating, stage = 0) {
  const st = Math.max(0, Math.min(2, (Math.trunc(Number(stage)) || 0) - 1)), keys = ratingKeys(role, R), r = clampRating(rating, role, R), col = Math.min(role.hm[st].length - 1, R[r]?.i ?? 2);
  return { attr: role.attr + (R[r]?.off ?? 0), hm: role.hm[st][col], def: Math.max(11, role.defense + (R[r]?.off ?? 0)), basic: role.basic[st][col], keys, rating: r };
}
/** A threshold from the Bestiary: (Attribute + 2) x multiplier + Health Base, rounded up. */
export const npcThreshold = (attr, hm, hb) => Math.max(0, Math.ceil((Number(attr) + 2) * Number(hm) + Number(hb) - 1e-9));
/** An NPC's numbers from its ratings (one source of truth). ratings: { body, mind, appeal, instinct, bodyHm, mindHm, ad, wd }. */
export function npcNumbers(role, R, ratings = {}, stage = 0) {
  const at = k => npcRow(role, R, ratings[k] ?? "medium", stage).attr;
  const attributes = { body: at("body"), mind: at("mind"), appeal: at("appeal"), instinct: at("instinct") };
  const vigor = npcThreshold(attributes.body, npcRow(role, R, ratings.bodyHm ?? "medium", stage).hm, role.hb);
  const resolve = npcThreshold(attributes.mind, npcRow(role, R, ratings.mindHm ?? "medium", stage).hm, role.hb);
  return { attributes, vigor, resolve, pool: vigor + resolve, ad: npcRow(role, R, ratings.ad ?? "medium", stage).def, wd: npcRow(role, R, ratings.wd ?? "medium", stage).def };
}
/** The Attacks reference: a Basic attack average [T2, T3] times the Special's multiplier, rounded to the nearest .5. */
export const specialAvg = (basic, x = 1) => (basic ?? [0, 0]).map(v => Math.round(Number(v) * x * 2) / 2);
/** The ratings average as a rating name (the eight choices; Custom ones are left out). */
export function ratingsAverage(list = [], R) {
  const scored = list.filter(r => r && r !== "custom" && R[r]);
  const avg = scored.length ? scored.reduce((t, r) => t + R[r].score, 0) / scored.length : 0;
  return Object.values(R).reduce((b, x) => (Math.abs(x.score - avg) < Math.abs(b.score - avg) ? x : b)).label;
}
/** "Down in about": Health / the PC damage a turn, to one decimal. */
export const downIn = (pool, pcDamage) => (pcDamage > 0 ? Math.round((Number(pool) / pcDamage) * 10) / 10 : 0);

/** The left-edge lines of an Action row or button: its Frequency color and the [Strike] line. { freq, strike, cls, style }. */
export function rowLines({ frequency = "", reaction = false, strike = false, off = false } = {}) {
  const f = reaction ? "reaction" : (["round", "turn", "encounter", "daily", "atwill"].includes(frequency) ? frequency : "atwill");
  const freq = off ? "#b5ad9c" : SHEET_FREQ[f].color, st = !!strike && !off;
  return { freq, strike: st, cls: `ln${st ? " ln-strike" : ""}`, style: `--lnf:${freq}` };
}

/** Book, Chapter 3: the Senses chips. senses: the actor's system.senses ({ hearing, dimlight, darksight, list: [{ name, range }] }). */
export const SENSE_RULES = {
  sight: "Sight: creatures in Bright light are Clear, in Dim light Obscured; none in Darkness or without Line of Effect.",
  dimlight: "Dim-light Sight: for your Sight, Dim light counts as Bright.",
  darksight: "Dark Sight: for your Sight, Dim light and Darkness count as Bright.",
  hearing: n => `Hearing: creatures that make noise within ${n} squares are Hidden to you, even through walls.`,
  heatsight: "Heatsight: creatures within range that give off heat (or are much colder) are Clear to you.",
  "lesser heatsight": "Lesser Heatsight: creatures within range that give off heat (or are much colder) are Obscured to you.",
  tremorsense: "Tremorsense: creatures within range that touch the same ground, with no thick wall between, are Clear to you."
};
export function senseChips(senses = {}) {
  const out = [];
  if (senses.darksight) out.push({ label: "Dark Sight", tip: SENSE_RULES.darksight });
  else if (senses.dimlight) out.push({ label: "Dim-light Sight", tip: SENSE_RULES.dimlight });
  else out.push({ label: "Sight", tip: SENSE_RULES.sight });
  const h = Number.isFinite(Number(senses.hearing)) && senses.hearing !== "" && senses.hearing !== null && senses.hearing !== undefined ? Math.max(0, Number(senses.hearing)) : 10;
  out.push(h ? { label: `Hearing ${h}`, tip: SENSE_RULES.hearing(h) } : { label: "Deaf", tip: "No Hearing." });
  for (const x of senses.list ?? []) if (x?.name) out.push({ label: `${x.name}${Number(x.range) ? ` ${x.range}` : ""}`, tip: SENSE_RULES[String(x.name).toLowerCase()] ?? `${x.name}: within ${x.range} squares.` });
  return out;
}

/** The Strikes pips of the NPC strip: three diamonds, filled = Strikes left this turn. */
export const strikePips = used => Array.from({ length: 3 }, (_, k) => k < Math.max(0, 3 - (Math.trunc(Number(used)) || 0)));

/** The Elite's default Escalation effects (Bestiary, Elite Escalation; v0.0.407: at Escalation 2, 4 and 6 on the 1-to-6 ladder, ELITE_RUNGS_LADDER). */
export const ELITE_RUNGS = [
  { n: 2, label: "2 · Pressing", tip: "Escalation 2, Pressing: 1 Boon on its first [Strike] Action each turn-cycle." },
  { n: 4, label: "4 · Relentless", tip: "Escalation 4, Relentless: it can use each of its Round Special Actions twice per turn-cycle." },
  { n: 6, label: "6 · Second Wind", tip: "Escalation 6, Second Wind: it gets its Encounter Special Actions back, once." }
];

/** Dice (and flat numbers) that come close to an average, the Modifier taken out: 2.5 -> "1d4". "" when the Modifier alone is enough. */
const DICE = [["", 0], ["1", 1], ["2", 2], ["1d4", 2.5], ["1d6", 3.5], ["1d8", 4.5], ["1d10", 5.5], ["1d12", 6.5], ["2d6", 7], ["2d8", 9], ["2d10", 11], ["2d12", 13], ["3d8", 13.5], ["3d10", 16.5], ["3d12", 19.5], ["4d10", 22], ["4d12", 26], ["5d10", 27.5], ["5d12", 32.5], ["6d12", 39], ["7d12", 45.5]];
export function diceFor(avg) {
  let best = DICE[0];
  for (const d of DICE) if (Math.abs(d[1] - avg) < Math.abs(best[1] - avg) - 1e-9) best = d;
  return best[0];
}

/* v0.0.308 (Lucas): Resist and Weak on the Builder tab as chips. The text field stays the source ("Resist 5 Fire, Weak 2 Holy, Immune Cold";
 * chatcards.mjs parseDmgMods reads it). parsed: parseDmgMods' { resist, weak, immune }; subs: chatcards SUBS (code -> [name, ink]). */
export function dmgModsText(parsed, subs) {
  const nm = c => subs?.[c]?.[0] ?? c;
  // the Bestiary's rebuild (2026-11-25; book, Chapter 1): the word first, then the subtype and its number ("Resistance Fire 5, Weakness Holy 2, Immunity Cold")
  return [...Object.entries(parsed?.resist ?? {}).map(([c, n]) => `Resistance ${nm(c)} ${n}`), ...Object.entries(parsed?.weak ?? {}).map(([c, n]) => `Weakness ${nm(c)} ${n}`),
    ...(parsed?.immune ?? []).map(c => `Immunity ${nm(c)}`)].join(", ");
}
export function dmgModChips(parsed, subs) {
  const nm = c => subs?.[c]?.[0] ?? c;
  return [...Object.entries(parsed?.resist ?? {}).map(([c, n]) => ({ kind: "resist", sub: c, label: `Resistance ${nm(c)} ${n}` })),
    ...Object.entries(parsed?.weak ?? {}).map(([c, n]) => ({ kind: "weak", sub: c, label: `Weakness ${nm(c)} ${n}` })),
    ...(parsed?.immune ?? []).map(c => ({ kind: "immune", sub: c, label: `Immunity ${nm(c)}` }))];
}
/**
 * v0.0.373 (STYLE-2, Lucas: version A of style-audit's Immune / Resist / Weak block): the Builder's three lines, each entry a chip with its
 * subtype's icon and color (--sc-l on parchment, --sc-d on the dark page). look: { colors, inks, icons } (config.mjs subtypeColors / subtypeInk /
 * subtypeIcons). Every line is shown, an empty one with a dash.
 */
export function dmgModLines(parsed, subs, look = {}) {
  const chip = (kind, c, n) => ({ kind, sub: c, name: subs?.[c]?.[0] ?? c, n: n ?? "", icon: look.icons?.[c] ?? "", style: `--sc-l:${look.inks?.[c] ?? "#5d5446"};--sc-d:${look.colors?.[c] ?? "#b3a68e"}` });
  return [
    { kind: "immune", label: "Immunity", chips: (parsed?.immune ?? []).map(c => chip("immune", c)) },
    { kind: "resist", label: "Resistance", chips: Object.entries(parsed?.resist ?? {}).map(([c, n]) => chip("resist", c, n)) },
    { kind: "weak", label: "Weakness", chips: Object.entries(parsed?.weak ?? {}).map(([c, n]) => chip("weak", c, n)) }
  ];
}
/** The Builder's list of the twelve subtypes to pick from (the first one picked). */
export const dmgModPalette = (subs, look = {}, picked = "") => Object.keys(subs ?? {}).map((c, i) => ({ sub: c, name: subs[c][0], icon: look.icons?.[c] ?? "", style: `--sc-l:${look.inks?.[c] ?? "#5d5446"};--sc-d:${look.colors?.[c] ?? "#b3a68e"}`, on: picked ? picked === c : i === 0 }));
/** Adds (n > 0) or removes (n = null) one entry; a new Resist or Weak of a type replaces the old one. Returns a new parsed object. */
export function dmgModsEdit(parsed, kind, sub, n = null) {
  const out = { resist: { ...(parsed?.resist ?? {}) }, weak: { ...(parsed?.weak ?? {}) }, immune: [...(parsed?.immune ?? [])] };
  if (kind === "immune") { out.immune = out.immune.filter(c => c !== sub); if (n !== null) out.immune.push(sub); }
  else if (kind === "resist" || kind === "weak") { delete out[kind][sub]; if (n !== null && Number(n) > 0) out[kind][sub] = Math.trunc(Number(n)); }
  return out;
}

/* ------------------------------------------------------------------ v0.0.333 (PACK RWI): Immune / Resist / Weak lines (book, Chapter 1) */
export const DMG_KINDS = ["immune", "resist", "weak"];
const KIND_WORD = { immune: "Immunity", resist: "Resistance", weak: "Weakness" };   // the Bestiary's rebuild (2026-11-25): the book's words, the word first
/**
 * The creature's effective Immune / Resist / Weak lines, from its sources: [{ name, type ("actor" | "item" | "talent" | "feature" | "effect"),
 * uuid, temporary, remaining (rounds, "eot" or null), lines: [{ kind, sub (a code), n }] }]. names: code -> the subtype's name (TWOD12.subtypes).
 * Two of the same kind and subtype don't add up: the highest is kept (a tie keeps a lasting one first), the others are listed in its overridden.
 * Immune and a Resist / Weak of the same subtype are both kept (Immune wins when damage is applied). Ordered Immune, Resist, Weak, then by subtype.
 * Each: { kind, subtype, code, value (null for Immune), source { name, type, uuid }, temporary, remaining, overridden: [same, without overridden] }.
 */
export function damageLinesFrom(sources, names) {
  const all = [];
  for (const s of sources ?? []) for (const l of s?.lines ?? []) {
    const kind = DMG_KINDS.includes(l?.kind) ? l.kind : "", code = l?.sub;
    if (!kind || !code || !(code in (names ?? {}))) continue;
    const value = kind === "immune" ? null : Math.max(0, Math.trunc(Number(l.n)) || 0);
    if (kind !== "immune" && !(value > 0)) continue;
    all.push({ kind, subtype: names[code], code, value, source: { name: s.name ?? "", type: s.type ?? "actor", uuid: s.uuid ?? "" }, temporary: !!s.temporary, remaining: s.remaining ?? null });
  }
  const better = (a, b) => (a.kind === "immune" ? 0 : (a.value - b.value)) || ((b.temporary ? 1 : 0) - (a.temporary ? 1 : 0));
  const kept = new Map();
  for (const l of all) {
    const k = `${l.kind}|${l.code}`, cur = kept.get(k);
    if (!cur) { kept.set(k, { ...l, overridden: [] }); continue; }
    if (better(l, cur) > 0) { const { overridden, ...old } = cur; kept.set(k, { ...l, overridden: [old, ...overridden] }); }
    else cur.overridden.push(l);
  }
  const codes = Object.keys(names ?? {});
  return [...kept.values()].sort((a, b) => DMG_KINDS.indexOf(a.kind) - DMG_KINDS.indexOf(b.kind) || codes.indexOf(a.code) - codes.indexOf(b.code));
}
/** "Immune Psychic", "Resist 3 Blunt". */
export const damageLineName = l => (l.kind === "immune" ? `Immunity ${l.subtype}` : `${KIND_WORD[l.kind]} ${l.subtype} ${l.value}`);
/** The chip's text: "Psychic", "3 Blunt", "2 Fire · 3 rd" (a temporary line's time left: rounds, EoT, or nothing until removed). */
export const damageLineChip = l => `${l.kind === "immune" ? l.subtype : `${l.subtype} ${l.value}`}${l.temporary && l.remaining ? ` · ${l.remaining === "eot" ? "EoT" : `${l.remaining} rd`}` : ""}`;
const SRC_TYPE = { actor: "its stat block", item: "item", talent: "Talent", feature: "Feature", effect: "effect" };
/** The tooltip: the line, its source (and time left), the rule in one sentence; and what it overrode. */
export function damageLineTip(l) {
  const from = l.source.type === "actor" ? "its own line" : `${l.source.name} (${SRC_TYPE[l.source.type] ?? l.source.type})`;
  const left = l.temporary ? (l.remaining === "eot" ? " · until the end of the turn" : l.remaining ? ` · ${l.remaining} round${l.remaining === 1 ? "" : "s"} left` : " · until removed") : "";
  const rule = l.kind === "immune" ? `its ${l.subtype} damage is 0.` : `each Action's ${l.subtype} damage, both pools together, is ${l.kind === "weak" ? "increased" : "reduced"} by ${l.value} once.`;
  const also = (l.overridden ?? []).map(o => `${damageLineName(o)} from ${o.source.type === "actor" ? "its own line" : o.source.name}`);
  return `${damageLineName(l)}, from ${from}${left}: ${rule}${also.length ? ` Also: ${also.join("; ")} (the highest applies).` : ""}`;
}
/** The lines as the damage message reads them: { resist: { code: n }, weak: { code: n }, immune: [codes] }. */
export function damageLinesMods(lines) {
  const out = { resist: {}, weak: {}, immune: [] };
  for (const l of lines ?? []) {
    if (l.kind === "immune") { if (!out.immune.includes(l.code)) out.immune.push(l.code); }
    else out[l.kind][l.code] = Math.max(out[l.kind][l.code] ?? 0, l.value);
  }
  return out;
}
/** The Damage block's rows: one per kind that has a line, in the order Immune, Resist, Weak. */
export const damageLineRows = lines => DMG_KINDS.map(k => ({ kind: k, label: KIND_WORD[k], lines: (lines ?? []).filter(l => l.kind === k) })).filter(r => r.lines.length);
/** One Immune / Resist / Weak written as text ("Resist 3 Blunt"), and a whole line list as the stored text ("Resist 3 Blunt, Immune Psychic"), for dmgMods fields. */
export const dmgModsFromLines = (list, names) => list.map(l => (l.kind === "immune" ? `Immunity ${names[l.sub] ?? l.sub}` : `${KIND_WORD[l.kind]} ${names[l.sub] ?? l.sub} ${l.n}`)).join(", ");

/** Pure (v0.0.418, E7): the Rally Points left after a click on pip k (0-based): that pip and the ones before it; the last lit pip clicked: one fewer. */
export const rallyAfterClick = (k, left) => (k + 1 === left ? k : k + 1);
/** v0.0.418 (E5): a window with no "theme-light" / "theme-dark" class takes Foundry's Applications scheme (when one is set). */
export function ensureWindowTheme(el, scheme = (() => { try { return game.settings.get("core", "uiConfig")?.colorScheme?.applications ?? ""; } catch (e) { return ""; } })()) {
  if (!el?.classList || el.classList.contains("theme-light") || el.classList.contains("theme-dark")) return false;
  if (scheme !== "light" && scheme !== "dark") return false;
  el.classList.add("themed", `theme-${scheme}`);
  return true;
}
/** Pure (v0.0.418, E8): a Level field's value as a number, or null (left unchanged): "" and NaN are null; two fields of that name, the first number. */
export function cleanLevel(v) {
  const list = Array.isArray(v) ? v : [v];
  for (const x of list) { if (x === "" || x === null || x === undefined) continue; const n = Number(x); if (Number.isFinite(n)) return Math.max(0, Math.trunc(n)); }
  return null;
}

/* ------------------------------------------------------------------ v0.0.441 (pack SHEETS-HUD): an Action's bar on the small sheets */
// The approved sheets (foundry/mockups/sheets, "Option 1", Lucas 2026-11-18): each Action is one bar: its cost stamps (each the Use button),
// the name, "Distance · Vs." in words, and the Frequency as a small square beside its word. A click on the bar opens the short card under it.
const BAR_FREQ = { atwill: "At-will", round: "Round", encounter: "Encounter", turn: "Turn", daily: "Daily" };
/**
 * Pure: the bar of a row. o = { aps (each Version's AP), reaction, frequency, escalation, dist (the row's short Distance, "—" for none),
 * vs (the row's short Vs.), inCombat, ap, rap }. Returns { stamps: [{ ap, label, off, why }] (one per cost: Versions of one cost, an Art's
 * Modes, show one), dist, vs, fq (the Frequency key), fqWord ("Round", "Escalation 3, Encounter") }.
 */
export function actionBar({ aps = [], reaction = false, frequency = "", escalation = 0, dist = "", vs = "", inCombat = false, ap = 0, rap = 0 } = {}) {
  const costs = [...new Set((aps ?? []).map(v => Math.max(0, Math.trunc(Number(v)) || 0)))];
  const stamps = costs.map(n => {
    const why = inCombat ? versionCant(n, ap, reaction ? rap : 0, reaction) : "";   // the one rule the card's Use buttons and the HUD read
    return { ap: n, label: reaction ? `${n}R` : `${n} AP`, off: !!why, why };
  });
  const fq = BAR_FREQ[frequency] ? frequency : "atwill", esc = Math.max(0, Math.trunc(Number(escalation)) || 0);
  return { stamps, dist: dist && dist !== "—" ? String(dist) : "", vs: String(vs ?? ""), fq, fqWord: `${esc ? `Escalation ${esc}, ` : ""}${BAR_FREQ[fq]}` };
}

/** v0.0.442 (Lucas, the fixes mockup round 4): the Escalation pips of the sheet's marks cell: [{ n, on, rung }], a rung (a Passive or the Apex
 *  comes there) ringed. A click on pip n sets the Escalation to n (as the rungs' words did). */
export function escMarks(level, max = 6, rungs = []) {
  const at = new Set((rungs ?? []).map(Number).filter(n => n > 0)), lv = Math.max(0, Math.trunc(Number(level)) || 0);
  return Array.from({ length: Math.max(1, Math.trunc(Number(max)) || 6) }, (_, k) => ({ n: k + 1, on: k < lv, rung: at.has(k + 1) }));
}


/* ------------------------------------------------------------------ v0.0.443 (group 1; Lucas, 2026-11-19, the mockup foundry/mockups/group1, rounds 1 to 3) */
/** The rungs' heraldic symbols (round 3, family A, the escutcheon): one shield, the same outline on every rung, gaining a charge: the plain
 *  shield (the 1st rung), with a chevron (the 2nd), with a chevron under a chief (the 3rd, the Apex). One color (currentColor): ink when reached. */
const RS = 'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="miter" stroke-linecap="butt"';
const SHIELD = `<path ${RS} d="M3.25 3.25H20.75V14C20.75 19.6 17 23.6 12 26.2C7 23.6 3.25 19.6 3.25 14Z"/>`;
export const RUNG_SYMBOLS = [SHIELD, `${SHIELD}<path ${RS} d="M6.6 17.6L12 11.6L17.4 17.6"/>`,
  `${SHIELD}<path fill="currentColor" d="M3.25 3.25H20.75V10H3.25Z"/><path ${RS} d="M7 20.4L12 14.8L17 20.4"/>`];
export const rungSymbol = k => `<svg class="ps2-sym" viewBox="0 0 24 28" aria-hidden="true">${RUNG_SYMBOLS[Math.max(0, Math.min(2, k))]}</svg>`;

/**
 * Pure: the combat line's left part (rounds 2 and 3): the hooks and the Escalation ladder, side by side. A PC: its hooks (Critical, then its
 * other hooks; a used one stays, faint, with a check) and its Passives' rungs; an Elite: its phases as its hooks (Bloodied +1, Strained +1, a
 * triggered one checked) and the Elite ladder; a Standard NPC: none (its line holds only the marks). rungs: escRungs' or ELITE_RUNGS' { n, label, lit }.
 */
export function combatLists({ npc = false, elite = false, hookNames = [], used = {}, rungs = [], bloodied = false, strained = false, info = {} } = {}) {
  if (npc && !elite) return null;
  // v0.0.447 (Lucas: "Click in a hook shows what it does. Same with escalation"): each carries what a click opens (sheet showInfo): a rule of the
  // book ("rule:critical") or the cards that give it ("item:id,id")
  const hooks = npc ? [{ name: "Bloodied +1", used: !!bloodied, info: "rule:bloodied" }, { name: "Strained +1", used: !!strained, info: "rule:strained" }]
    : [{ name: "Critical", used: !!used.crit, info: "rule:critical" }, ...[...new Set(hookNames)].map(n => ({ name: n, used: !!used.hook, info: info.hooks?.[n] || "rule:hook" }))];
  const ladder = (rungs ?? []).slice(0, 3).map((r, k) => { const [n, ...rest] = String(r.label ?? "").split(" · "); const name = rest.join(" · ").replace(/^—$/, ""), num = Number(n) || r.n;
    return { n: num, name: name || "—", lit: !!r.lit, sym: rungSymbol(k), info: npc ? `rule:elite:${num}` : (info.rungs?.[num] || "rule:escalation") }; });
  return { hooks, ladder };
}
/** v0.0.447: the book's words a hook or a rung click shows when no card gives it (Chapter 2, Escalation; Chapter 14, Elite Escalation). */
export const ESC_RULES = {
  critical: ["Critical", "Once an encounter, when you score a Critical on one of your Actions, your Escalation increases by 1. At Escalation 6 it does nothing, and it isn't used up for the encounter."],
  hook: ["Your class's hook", "Your class names one more event that, once an encounter, increases your Escalation by 1 (the Paladin: an ally becomes Bloodied or goes Down; the Archer: an enemy you have damaged goes Down). You gain it at level 2."],
  escalation: ["Escalation", "At each rung, 2, 4 and 6, your class gives you a Passive (and the Apex at 6), which works while your Escalation is that high or higher."],
  bloodied: ["Bloodied +1", "When an Elite becomes Bloodied, its Escalation increases by 1 (once). The GM says so when it happens."],
  strained: ["Strained +1", "When an Elite becomes Strained, its Escalation increases by 1 (once). The GM says so when it happens."]
};
/** Pure: the Basic attack's subtitle from its own Tier 2 / Tier 3 damage, the flat number first (Lucas: "the basic attack plus tiers like
 *  'Basic attack - 2 + 1d6! / 5 + 1d6!'"): "Basic attack · 1 + 1d4! / 3 + 1d6!". v: the Action's Version. */
export function basicAttackLine(v) {
  const words = list => (list ?? []).map(d => {
    const w = d.useW ? `${Math.max(1, Number(d.wCount) || 1)}[W]` : "", dice = String(d.dice ?? "").trim();
    const m = /^(.+?)\s*([+\-−])\s*(\d+)$/.exec(dice), part = !dice ? "" : !m ? dice : m[2] === "+" ? `${m[3]} + ${m[1]}` : `${m[1]} − ${m[3]}`;
    return [w, part].filter(Boolean).join(" + ");
  }).filter(Boolean).join(" + ");
  const t2 = words(v?.t2), t3 = words(v?.t3);
  return t2 || t3 ? `Basic attack · ${t2 || "—"} / ${t3 || "—"}` : "Basic attack";
}
/**
 * Needs a DOM: a list shrinks its text by half pixels until no line is wider than its column and it is no taller than its place (the combat
 * line never grows: Lucas, 2026-11-18/19). Never cut, never taller; 7 px at the least. v0.0.447 (Lucas: "many elements of the sheet jumped"):
 * it never resets to the full size first (it grows back step by step only while that still fits) and leaves a hidden element alone.
 */
export function fitList(l, min = 7) { fitBy(l, () => l.scrollWidth > l.clientWidth + 0.5 || l.scrollHeight > l.clientHeight + 0.5, min); }
/** Needs a DOM: a Basic Action's name shrinks by half pixels to 9.5 px until it fits its box; below that, two lines. Never cut (option A). */
export function fitName(n, min = 9.5) {
  if (!n || !n.clientWidth) return;
  const over = () => n.scrollWidth > n.clientWidth + 0.5;
  if (n.classList.contains("wrap")) { n.classList.remove("wrap"); if (over()) { n.classList.add("wrap"); return; } }
  fitBy(n, over, min);
  if (over()) n.classList.add("wrap");
}
function fitBy(el, over, min) {
  if (!el || !el.clientWidth) return;   // hidden (another tab): nothing to measure
  const full = parseFloat(el.dataset.fitFull || "") || parseFloat(globalThis.getComputedStyle?.(el)?.fontSize) || 14;
  el.dataset.fitFull = String(full);
  let size = parseFloat(el.style.fontSize) || full;
  while (over() && size > min) { size -= 0.5; el.style.fontSize = `${size}px`; }
  // grow back (a wider window) only while it still fits
  while (!over() && size < full) { const next = Math.min(full, size + 0.5); el.style.fontSize = `${next}px`; if (over()) { el.style.fontSize = `${size}px`; break; } size = next; }
  if (size >= full) el.style.fontSize = "";
}
