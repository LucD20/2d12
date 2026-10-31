// The Actions tab of the new sheet (v0.0.131), kept pure so the tests can check it:
//   what changes an Action right now (green and red chips), whether its weapon is Unloaded, its cost / range / Frequency labels,
//   and the groups (Cost, Source, Frequency, None) and orders (Custom, Usage, Name, Cost) of the table.
import { allEffects, isBaseSource } from "./passives.mjs";
import { effectOff } from "./escalation.mjs";
import { matches, derivedMods, shortName } from "./effects.mjs";
import { rollSource, rollTraits } from "./rollsource.mjs";
import { TWOD12, effectiveFrequency } from "./config.mjs";
const F = "twod12";

const flagOf = (e, k) => e?.getFlag?.(F, k) ?? e?.flags?.[F]?.[k];
const valueOf = e => Math.max(1, Math.trunc(Number(flagOf(e, "value"))) || 1);
const tiersText = list => (list?.length && list.length < 3 ? ` (Tier ${list.map(t => String(t).replace("t", "")).join(", ")})` : "");
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

/** The traits effects see when this creature uses this Action (as the roll does). */
export const traitsFor = (actor, item) => rollTraits(item.system.traits ?? new Set(), rollSource(actor?.system ?? {}, item.system), item.name);

/**
 * What changes this Action right now, against the creature's base (gear and always-on passives are the base and never show):
 * applied effects, conditions and Escalation passives, and the banes of the creature's own state (Bloodied, Strained...).
 * { chips: [{ text, cls: "up"|"down", why }], empowered, enfeebled, bonuses: { 1: [...], 2: [...], 3: [...] } }
 */
export function actionChanges(actor, item) {
  const traits = traitsFor(actor, item);
  const byName = new Map();   // one chip per source: its parts are listed in the hover
  const add = (name, part, good) => {
    const c = byName.get(name) ?? { text: name, up: 0, down: 0, parts: [] };
    c.parts.push(part); if (good) c.up++; else c.down++;
    byName.set(name, c);
  };
  for (const m of derivedMods(actor)) if (matches(m, traits)) { if (m.banes) add(m.name, plural(m.banes, "Bane"), false); if (m.boons) add(m.name, plural(m.boons, "Boon"), true); }
  let emp = 0, enf = 0;
  const bonuses = { 1: [], 2: [], 3: [] };
  for (const e of allEffects(actor)) {
    if (effectOff(actor, e) || isBaseSource(e)) continue;
    const name = shortName(e.name);
    const k = m => (m.byValue ? valueOf(e) : 1);
    for (const m of flagOf(e, "modifiers") ?? []) {
      if (m.against || !matches(m, traits)) continue;
      if (m.boons) add(name, plural(m.boons * k(m), "Boon"), true);
      if (m.banes) add(name, plural(m.banes * k(m), "Bane"), false);
      const up = m.empowered === true ? 1 : Math.trunc(Number(m.empowered)) || 0, down = Math.trunc(Number(m.enfeebled)) || 0;
      if (up > 0) { emp = Math.max(emp, up); add(name, `Empowered ${up}: +${up} per damage die`, true); }
      if (down > 0) { enf = Math.max(enf, down); add(name, `Enfeebled ${down}: \u2212${down} per damage die`, false); }
    }
    for (const b of flagOf(e, "bonuses") ?? []) {
      if (!matches(b, traits)) continue;
      const tiers = b.tiers?.length ? b.tiers : ["t1", "t2", "t3"];
      const dmg = [b.dmg ? `[${b.dmgPool || "B"}] ${b.dmg}${b.dmgSub ? ` ${b.dmgSub}` : ""}` : "", b.text || ""].filter(Boolean).join("; ");
      if (!dmg) continue;
      for (const t of tiers) bonuses[Number(String(t).replace("t", ""))]?.push({ text: `+ ${dmg}`, source: name });
      add(name, `+ ${dmg}${tiersText(tiers)}`, true);
    }
    for (const id of ["empowered", "enfeebled"]) {   // the conditions Empowered N and Enfeebled N
      if (!e.statuses?.has?.(id)) continue;
      const n = valueOf(e);
      if (id === "empowered") { emp = Math.max(emp, n); add(name, `+${n} per damage die`, true); }
      else { enf = Math.max(enf, n); add(name, `\u2212${n} per damage die`, false); }
    }
  }
  const chips = [...byName.values()].map(c => ({ text: c.text, cls: c.up >= c.down ? "up" : "down", why: c.parts.join("; ") }));
  return { chips, empowered: emp, enfeebled: enf, net: emp - enf, bonuses };
}

/** The Reload weapon this Action can't use because it is Unloaded (its own weapon; or a Weapon Action whose wielded weapons are all unloaded). */
export function unloadedWeapon(actor, item) {
  const linked = item.getFlag?.(F, "weaponId");
  const weapons = actor?.itemTypes?.weapon ?? [];
  const isOut = w => !!w && w.system.traits?.has?.("reload") && !!w.system.unloaded;
  if (linked) { const w = weapons.find(x => x.id === linked); return isOut(w) ? w : null; }
  if (!item.system.traits?.has?.("weapon") || flagOf(item, "basic") === "reload") return null;
  // The weapons in hand this Action could use: a Melee Action a melee (or Thrown) weapon, a Ranged Action a ranged or Thrown one.
  const t = item.system.traits, wt = w => w.system.traits;
  const fits = w => (t.has("melee") ? wt(w)?.has?.("melee") || wt(w)?.has?.("thrown") : true) && (t.has("ranged") ? wt(w)?.has?.("ranged") || wt(w)?.has?.("thrown") : true);
  const held = weapons.filter(w => w.system.wielded && !wt(w)?.has?.("barehanded") && fits(w));
  return held.length && held.every(isOut) ? held[0] : null;
}

/** The cost as the table shows it: "1AP", "1/2/3", "0AP", "1R", "2/3R". */
export function costText(item) {
  const aps = [...new Set((item.system.versions ?? []).map(v => Number(v.ap) || 0))].sort((a, b) => a - b);
  if (!aps.length) return "\u2014";
  if (item.system.reaction) return `${aps.join("/")}R`;
  return aps.length > 1 ? aps.join("/") : `${aps[0]}AP`;
}

export const FREQ_KEYS = ["atwill", "turn", "round", "encounter", "daily", ""];
/** The Frequency column: "Round"; a Daily one says how many uses are left ("Daily 0/1"). */
export function frequencyText(item, usedToday = false) {
  const f = effectiveFrequency(item.system);
  if (!f) return "\u2014";
  return f === "daily" ? `Daily ${usedToday ? 0 : 1}/1` : TWOD12.frequencies[f];
}

/** Which Cost group a row is in. */
export function costGroup(item) {
  if (item.system.reaction) return "Reactions";
  const aps = (item.system.versions ?? []).map(v => Number(v.ap) || 0);
  return aps.length && aps.every(n => n === 0) ? "0 AP" : "On your turn";
}

export const GROUP_BY = { cost: "Cost", source: "Source", frequency: "Frequency", none: "None" };
export const SORT_BY = { custom: "Custom (drag to reorder)", usage: "Usage", name: "Name", cost: "Cost" };
/** Older saved sort choices of v0.0.130 and before. */
export const sortKeyOf = k => ({ frequency: "usage", source: "custom" }[k] ?? (k in SORT_BY ? k : "custom"));

/**
 * Rows into groups. rows: { id, name, minAp, freq, cost, source }. order: the saved custom order (ids).
 * The custom order holds inside each group; Group by None gives one list.
 */
export function groupRows(rows, { groupBy = "cost", sort = "custom", order = [], sourceLabels = [] } = {}) {
  const idx = id => { const k = order.indexOf(id); return k < 0 ? 9999 : k; };
  const fq = r => { const k = FREQ_KEYS.indexOf(r.freq ?? ""); return k < 0 ? 9 : k; };
  const cmp = {
    custom: (x, y) => idx(x.id) - idx(y.id) || x.name.localeCompare(y.name),
    usage: (x, y) => fq(x) - fq(y) || x.name.localeCompare(y.name),
    name: (x, y) => x.name.localeCompare(y.name),
    cost: (x, y) => x.minAp - y.minAp || x.name.localeCompare(y.name)
  }[sort] ?? ((x, y) => idx(x.id) - idx(y.id));
  const sorted = [...rows].sort(cmp);
  if (groupBy === "none") return [{ key: "", label: "", rows: sorted }];
  const labels = groupBy === "cost" ? ["On your turn", "Reactions", "0 AP"]
    : groupBy === "frequency" ? FREQ_KEYS.map(k => (k ? TWOD12.frequencies[k] : "No limit"))
      : sourceLabels;
  const keyOf = r => (groupBy === "cost" ? r.cost : groupBy === "frequency" ? (r.freq ? TWOD12.frequencies[r.freq] : "No limit") : r.source);
  return labels.map(label => ({ key: label, label, rows: sorted.filter(r => keyOf(r) === label) })).filter(g => g.rows.length);
}
