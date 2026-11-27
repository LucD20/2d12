import { firstName } from "./util.mjs";   // v0.0.530: Shake Off's result card
// v0.0.314 (pack AU, the conditions as items; book, Chapter 8): the pure rules of the conditions the conditions pass added.
//   Frightened: its Bane only while the creature sees its origin (the effect's "whileSeen" rule; conditions.mjs gives effectOff the sight check).
//   Taunted: its Bane only on Actions against a creature other than its origin (a Boons and Banes setting's "vsOrigin").
//   Sickened N: N Banes on Body and Instinct Saves (a Boons and Banes setting's Attributes, by value).
//   Staggered: no Reactions (the "noReactions" rule); Dazed N: N AP lost now, the rest from the next regain (the "loseAp" rule);
//   Grabbed: Immobilized, and it ends when the holder goes Down (the "endsWithOrigin" rule); Bleed: damage at the end of each turn (a Bleed setting).
// No Foundry here: the tests read it.
const F = "twod12";
const flagOf = (e, k) => e?.getFlag?.(F, k) ?? e?.flags?.[F]?.[k];

/** Does a Boons and Banes modifier with "vsOrigin" count against these targets? "not": one target other than the origin; "only": the origin among them. */
export function originOk(m, originUuid, targetUuids = []) {
  const v = m?.vsOrigin || "";
  if (!v) return true;
  const list = (targetUuids ?? []).filter(Boolean);
  if (!list.length) return false;   // no target (a Check, a Save): Taunted's Bane is on Actions against a creature
  if (!originUuid) return v === "not";
  return v === "not" ? list.some(u => u !== originUuid) : list.includes(originUuid);
}

/** Does a roll with these traits match a modifier's Attributes (none listed: every roll)? A Save or Check carries its Attribute as a trait. */
export const attrsOk = (m, traits) => !(m?.attrs?.length) || m.attrs.some(a => traits?.has?.(a));

/** Dazed N: how many AP are lost now (at most what the creature has) and how many from the AP it regains next. */
export function dazeSplit(have, value) {
  const v = Math.max(0, Math.trunc(Number(value)) || 0), h = Math.max(0, Math.trunc(Number(have)) || 0);
  const now = Math.min(h, v);
  return { now, rest: v - now };
}

/** Can this creature use Reactions? false while an effect with the "noReactions" rule is on it (Staggered). */
export function reactionsOff(actor) {
  const list = typeof actor?.effects?.filter === "function" ? actor.effects.filter(() => true) : [];
  return list.some(e => !e?.disabled && (flagOf(e, "noReactions") || e?.statuses?.has?.("staggered")));
}
/** v0.0.498 (Pass 3, Feint Critical): is this creature blocked from using Reactions against `targetUuid` (until EoT)? */
export function reactionsOffVs(actor, targetUuid) {
  if (!targetUuid) return false;
  const list = typeof actor?.effects?.filter === "function" ? actor.effects.filter(() => true) : [...(actor?.effects ?? [])];
  return list.some(e => !e?.disabled && flagOf(e, "noReactionsVs") === targetUuid);
}

/** Bleed's pool: the one it writes, else Vigor for Body / Instinct and Resolve for Mind / Appeal (both kinds: Vigor). */
export function bleedPool(pool, attrs = []) {
  if (pool === "B" || pool === "M") return pool;
  const a = new Set(attrs ?? []);
  return (a.has("mind") || a.has("appeal")) && !a.has("body") && !a.has("instinct") ? "M" : "B";
}
const AB = { body: "Bo", mind: "Mi", appeal: "Ap", instinct: "In" };
/** "Lingering [R] 1d6 Ho (Mi/Ap)", "Lingering [V] 2 (Bo/In; DC 15)": the book's notation (v0.0.414: Bleed is renamed Lingering; the key stays bleed). */
export function bleedText(b) {
  const pool = bleedPool(b?.pool, b?.attrs), attrs = (b?.attrs ?? []).map(a => AB[a] ?? a).join("/") || "Bo/In";
  const dc = Number(b?.dc) && Number(b.dc) !== 13 ? `; DC ${b.dc}` : "";
  return `Lingering [${pool === "M" ? "R" : "V"}] ${b?.dmg ?? ""}${b?.sub ? ` ${b.sub}` : ""} (${attrs}${dc})`;
}
/** The Bleed of an applied effect: the card's own values (the flag "bleed", from @Condition[bleed|dmg:...]) over the condition's setting. */
export function bleedOf(e) {
  const base = (flagOf(e, "bleeds") ?? [])[0] ?? null, over = flagOf(e, "bleed") ?? null;
  if (!base && !over) return null;
  const b = { dmg: "1", pool: "", sub: "", attrs: ["body", "instinct"], dc: 13, ...(base ?? {}) };
  for (const [k, v] of Object.entries(over ?? {})) if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length)) b[k] = v;
  return b;
}
/** Pure (v0.0.521; the cleanup audit, B2-066; book, Chapter 8, Several Lingerings): two Lingerings are the same kind when their subtype is (none and
 *  none too): then the higher average stays; of different subtypes they run together. */
export const sameLingeringKind = (a, b) => String(a?.sub ?? "").trim().toLowerCase() === String(b?.sub ?? "").trim().toLowerCase();
/** Parse "mi/ap", "Bo/In", "body" into Attribute keys. */
export function parseAttrs(s) {
  const map = { bo: "body", mi: "mind", ap: "appeal", in: "instinct", body: "body", mind: "mind", appeal: "appeal", instinct: "instinct" };
  return String(s ?? "").toLowerCase().split(/[\/,\s]+/).map(x => map[x]).filter(Boolean);
}

/** v0.0.315 (Lucas): does an Effect need an origin to work (Frightened, Taunted, Grabbed: "of", "by", "held by")? Its rules or a setting say so. */
export const needsOrigin = sys => !!(sys?.whileSeen || sys?.endsWithOrigin || (sys?.settings ?? []).some(x => x?.vsOrigin));
/** v0.0.315: does an Effect have a Bleed setting (the HUD asks its damage)? */
export const hasBleed = sys => (sys?.settings ?? []).some(x => x?.type === "bleed");

/** v0.0.315: an effect's origin as the Details tab shows it: the creature's name and its token's id (an unlinked token's actor names its token). */
export function originView(uuid) {
  const u = String(uuid ?? "");
  if (!u) return { name: "", token: "", uuid: "" };
  let doc = null; try { doc = globalThis.fromUuidSync?.(u) ?? null; } catch (e) { doc = null; }
  const actor = doc?.documentName === "Actor" ? doc : doc?.actor ?? null;
  const tok = /Token\.([A-Za-z0-9]+)/.exec(u)?.[1] ?? actor?.getActiveTokens?.()[0]?.id ?? "";
  return { name: actor?.name ?? doc?.name ?? "(not found)", token: tok, uuid: u };
}

const escH = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/**
 * Pure (v0.0.530; Lucas on v0.0.529, ox-shakeoff, his picture: the message showed the full name twice, "Durgan (Dwarf Paladin, Lay On Hands,
 * level 1)", each on a line of its own, the rest of the line after it): the Save's result card names the creature by its first name, once, in the
 * lead ("Durgan: Body Save 7 vs. DC 13: Tier 1"); the text says what happens to the Lingering. The lead's flow is system.css's (v0.0.530 block).
 */
export function shakeOffCardParts({ name = "", attr = "", total = 0, dc = 13, tier = 1, lingering = "Lingering", what = "none" } = {}) {
  const tierWord = ["", "Tier 1", "Tier 2", "Tier 3"][tier] ?? "";
  const L = String(lingering ?? "Lingering"), lt = L ? L[0].toUpperCase() + L.slice(1) : "The Lingering";
  return {
    lead: `${escH(firstName(name))}: ${escH(attr)} Save <b>${total}</b> vs. DC ${dc}: <b>${tierWord}</b>`,
    text: `${escH(lt)} ${what === "ends" ? "ends." : what === "half" ? "takes half its damage at the end of the current turn, then it ends." : "goes on (no effect)."}`
  };
}
