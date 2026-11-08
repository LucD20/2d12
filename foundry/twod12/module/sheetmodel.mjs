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
  if (a.basic) return "basic";
  if (a.reaction) return "reaction";
  if (Number(a.escalation) > 0) return "apex";
  const f = String(a.frequency ?? "");
  return ["round", "turn", "encounter", "daily"].includes(f) ? f : "atwill";
}

/** Book, Chapter 2: the Vs. an Attribute Defenses: 13 + half the Attribute, rounded up (+ the creature's bonus for that Defense). */
export const vsAttribute = (value, bonus = 0) => 13 + Math.ceil((Math.trunc(Number(value)) || 0) / 2 - 1e-9) + (Number(bonus) || 0);
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
  return `${list.join("/")}${reaction ? "R" : ""}`;
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
    case "rally": return c.down ? "Not while Down" : ((Number(c.rallyLeft) || 0) > 0 ? "" : "No Rally Points left");
    default: return "";
  }
}

/** "next: 1 Bane", "next: 2 Banes" (an At-will Action's next use this turn), or "". */
export const nextBanes = uses => { const n = Math.max(0, Math.trunc(Number(uses)) || 0); return n ? `next: ${n} Bane${n === 1 ? "" : "s"}` : ""; };

/** Book, Chapter 4: Bloodied while Vigor damage >= Vigor; Strained while Resolve damage >= Resolve. s: { bodyDamage, mindDamage, bdt, mdt }. */
export function healthTags(s = {}) {
  const n = v => Math.max(0, Number(v) || 0);
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

/**
 * The AP pips of the combat strip. ap: AP now; regained: the AP this turn gave (4 + Quickened - Slowed); slowed: the Slowed value.
 * [{ k: "on" | "spent" | "slowed" }]: the available ones, then the spent ones, then one crossed pip per AP Slowed took this turn.
 */
export function apPips(ap, regained, slowed = 0) {
  const a = Math.max(0, Math.trunc(Number(ap)) || 0), r = Math.max(a, Math.trunc(Number(regained)) || 0), s = Math.max(0, Math.trunc(Number(slowed)) || 0);
  return [...Array.from({ length: a }, () => ({ k: "on" })), ...Array.from({ length: r - a }, () => ({ k: "spent" })), ...Array.from({ length: s }, () => ({ k: "slowed" }))];
}

/** The Escalation rungs: "1 · <passive>", "2 · <passive>", "3 · <passive> + Apex"; lit up to the level. names: { 1: [...], 2: [...], 3: [...] }. */
export function escRungs(level, names = {}, apex = false) {
  const now = Math.max(0, Math.trunc(Number(level)) || 0);
  return [1, 2, 3].map(n => {
    const list = (names[n] ?? []).filter(Boolean);
    const text = [list.join(" / ") || "—", n === 3 && apex ? "Apex" : ""].filter(Boolean).join(" + ");
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
export function escSectionRank(title) {
  const t = String(title ?? "");
  const m = t.match(/^Escalation\s+(\d)/i);
  if (m) return Math.min(3, Number(m[1]));
  return /\bapex\b/i.test(t) ? 4 : 0;
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
 * [{ level, text }]: "1 Talent · 1 Daily Pick"; the Stage level: "Stage 2: Stage Talent · +1 Attribute · Health +12 / +6 · Guard 3 per AP · Rally +1".
 */
export function nextLevels(level, levels = [], stage = null) {
  const lv = Math.max(1, Math.trunc(Number(level)) || 1), end = stage?.at ?? lv + 1, out = [];
  for (let L = lv + 1; L <= end; L++) {
    const secs = (levels[L - 1]?.sections ?? []).filter(s => s.kind !== "attr" || L === stage?.at);
    const parts = secs.filter(s => s.kind !== "attr").map(s => `${Math.max(1, Number(s.pick) || 1)} ${slotLabel(s.title)}`);
    if (stage && L === stage.at) {
      const st = [`Stage ${stage.n}:`, "Stage Talent", "+1 Attribute"];
      if (stage.health) st.push(`Health +${stage.health[0]} / +${stage.health[1]}`);
      if (stage.guard) st.push(`Guard ${stage.guard} per AP`);
      st.push("Rally +1");
      if (stage.modifiers) st.push("Modifiers +1");
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
