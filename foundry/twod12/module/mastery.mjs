// Mastery (weapons; Lucas's design, v0.0.154). Anyone can use any weapon; you get better at the ones you use.
//   A Tier 3 on a Weapon Action with a weapon: +1 Mastery with that kind of weapon (once per Action, even with several targets).
//   3 Mastery unlocks the weapon's Weapon Technique (before that, it is locked); 8 and 15 will unlock more (later).
//   Mastery belongs to the character, by kind of weapon (the weapon's "Mastery group", or its name): a +1 Greatsword shares the Greatsword's,
//   and the entry stays when the weapon goes. Characters only (NPCs' items are flavor and loot).
// Stored as the actor flag twod12.mastery = { key: { name, value } }.
import { TWOD12 } from "./config.mjs";
const F = "twod12";
export const MASTERY_STEPS = [3, 8, 15];
export const TECHNIQUE_AT = 3;

/** The kind of weapon a weapon's Mastery counts for: its Mastery group, or its name. */
export const groupOf = w => String(w?.system?.masteryGroup || w?.name || "").trim();
/**
 * v0.0.343 (book, Chapter 15: at most 1 Mastery per Weapon Group in each encounter): a weapon's Weapon Group key (TWOD12.weaponGroups): the one set
 * on the weapon, else the book's table by its kind or its name ("+1 Greatsword" is a Greatsword: Blades), else its kind (a group of its own).
 */
export function weaponGroupOf(w) {
  const set = String(w?.system?.weaponGroup ?? "").trim();
  if (set) return set;
  const table = TWOD12.weaponGroupOf ?? {}, names = Object.keys(table).sort((a, b) => b.length - a.length);
  for (const raw of [w?.system?.masteryGroup, w?.name]) {
    const low = String(raw ?? "").toLowerCase();
    const hit = names.find(n => new RegExp(`(^|[^a-z])${n.replace(/ /g, "\\s+")}($|[^a-z])`).test(low));
    if (hit) return table[hit];
  }
  return "";
}
/** Pure: the group a Tier 3 counts against this encounter ("kind:<key>" for a weapon outside the eight groups). */
export const masteryLimitKey = w => weaponGroupOf(w) || `kind:${masteryKey(groupOf(w))}`;
/** Pure: can this weapon still gain Mastery in this encounter? used: the actor's flag { combatId, groups: [] }. */
export const canGainMastery = (used, combatId, w) => !(!!used && used.combatId === combatId && (used.groups ?? []).includes(masteryLimitKey(w)));

/** A flag key for a group ("Great Sword" -> "great-sword"). */
export const masteryKey = name => String(name ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "weapon";
export const masteryOf = actor => actor?.getFlag?.(F, "mastery") ?? {};
export const masteryValue = (actor, group) => Number(masteryOf(actor)[masteryKey(group)]?.value) || 0;
/** The next step a value is working toward ("" past the last). */
export const nextStep = v => MASTERY_STEPS.find(s => s > v) ?? null;
/** What a step unlocks (only the first is decided). */
export const STEP_TEXT = { 3: "Weapon Technique", 8: "(to be decided)", 15: "(to be decided)" };

/** Is this Action a Weapon Technique that is still locked for this character? -> { locked, group, value } */
export function techniqueLock(actor, item) {
  if (actor?.type !== "character" || item?.type !== "action" || item.system?.category !== "Weapon Technique") return { locked: false };
  const w = actor.items?.get?.(item.getFlag?.(F, "weaponId"));
  if (!w) return { locked: false };
  const group = groupOf(w), value = masteryValue(actor, group);
  return { locked: value < TECHNIQUE_AT, group, value };
}

/** A Weapon Technique for the Actions tab: "locked" (under 3 Mastery: not shown), "unwielded" (its weapon is carried but not in hand:
 *  greyed, or hidden with the "only usable Techniques" toggle), or "ok". NPCs: always "ok". */
export function techniqueState(actor, item) {
  if (actor?.type !== "character" || item?.system?.category !== "Weapon Technique") return "ok";
  if (techniqueLock(actor, item).locked) return "locked";
  const w = actor.items?.get?.(item.getFlag?.(F, "weaponId"));
  return w && !w.system?.wielded ? "unwielded" : "ok";
}
export async function setCollapsed(actor, key, collapsed, name = "") {
  const cur = masteryOf(actor)[key] ?? { name: name || key, value: 0 };
  await actor.setFlag(F, "mastery", { [key]: { ...cur, collapsed: !!collapsed } });
}

/** Make sure the character has an entry for this weapon's kind (at 0). */
export async function ensureEntry(actor, weapon) {
  if (actor?.type !== "character" || weapon?.type !== "weapon") return;
  const group = groupOf(weapon), k = masteryKey(group);
  if (masteryOf(actor)[k]) return;
  await actor.setFlag(F, "mastery", { [k]: { name: group, value: 0 } });
}

/** +n Mastery with this weapon's kind. Returns { group, before, after, reached } (reached: the steps crossed). */
export async function addMastery(actor, weapon, n = 1) {
  if (actor?.type !== "character" || !weapon || typeof actor.setFlag !== "function") return null;
  const group = groupOf(weapon), k = masteryKey(group), before = masteryValue(actor, group), after = Math.max(0, before + n);
  await actor.setFlag(F, "mastery", { [k]: { name: masteryOf(actor)[k]?.name || group, value: after } });
  return { group, before, after, reached: MASTERY_STEPS.filter(s => before < s && after >= s) };
}
export async function setMastery(actor, key, value, name = "") {
  const cur = masteryOf(actor)[key] ?? { name: name || key, value: 0 };
  await actor.setFlag(F, "mastery", { [key]: { ...cur, value: Math.max(0, Math.trunc(Number(value)) || 0) } });
}

/** The rows of the Mastery tab: every entry, with the weapons the character has of that kind, and where it stands. */
export function masteryRows(actor) {
  const owned = new Map();
  const techs = new Map();   // the Weapon Techniques the weapons of each kind give (what 3 Mastery unlocks)
  for (const w of actor?.itemTypes?.weapon ?? []) {
    const k = masteryKey(groupOf(w));
    (owned.get(k) ?? owned.set(k, []).get(k)).push(w.name);
    for (const t of actor.itemTypes?.action ?? []) if (t.system?.category === "Weapon Technique" && t.getFlag?.(F, "weaponId") === w.id) (techs.get(k) ?? techs.set(k, new Set()).get(k)).add(t.name);
  }
  // Weapons carried from before Mastery existed (or added another way) show at 0 too.
  const entries = { ...masteryOf(actor) };
  for (const w of actor?.itemTypes?.weapon ?? []) { const k = masteryKey(groupOf(w)); entries[k] ??= { name: groupOf(w), value: 0 }; }
  return Object.entries(entries).map(([key, e]) => {
    const value = Number(e.value) || 0, next = nextStep(value), prev = [...MASTERY_STEPS].reverse().find(s => s <= value) ?? 0;
    return {
      key, name: e.name || key, value, owned: owned.get(key) ?? [], next, nextText: next ? STEP_TEXT[next] : "", collapsed: !!e.collapsed,
      technique: value >= TECHNIQUE_AT, pct: next ? Math.round(((value - prev) / (next - prev)) * 100) : 100,
      steps: MASTERY_STEPS.map(s => ({ s, on: value >= s, text: STEP_TEXT[s], grants: s === TECHNIQUE_AT ? ([...(techs.get(key) ?? [])].join(", ") || "its Weapon Technique") : "to be decided" }))
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

/** After an Action: a Tier 3 on a Weapon Action with a weapon gives +1 Mastery (posted when a step is reached). */
export async function masteryAfterRoll(actor, weapon, isWeaponRoll, tiers) {
  if (actor?.type !== "character" || !weapon || !isWeaponRoll || !tiers.some(t => t === 3)) return;
  // v0.0.189 (Lucas): only in combat (an encounter that has started, with this creature in it).
  const c = game.combat;
  if (!c?.started || !c.combatants?.some?.(x => x.actor === actor || x.actor?.id === actor.id)) return;
  // v0.0.343 (Lucas, playtest 4; book, Chapter 15): at most 1 Mastery per Weapon Group in each encounter (stored on the character: { combatId, groups })
  const used = actor.getFlag(F, "masteryEnc"), lim = masteryLimitKey(weapon);
  if (!canGainMastery(used, c.id, weapon)) return;
  const r = await addMastery(actor, weapon, 1);
  if (!r) return;
  await actor.setFlag(F, "masteryEnc", { combatId: c.id, groups: [...(used && used.combatId === c.id ? used.groups ?? [] : []), lim] });
  const what = r.reached.map(s => `<b>${STEP_TEXT[s]}</b> unlocked`).join(", ");
  const grp = TWOD12.weaponGroups?.[weaponGroupOf(weapon)];
  const { sysLine } = await import("./sysmsg.mjs");
  const { esc } = await import("./util.mjs");
  // v0.0.343: the system's line (was a plain line)
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: sysLine("fa-medal", `<b>${esc(actor.name)}</b> gains 1 ${esc(r.group)} Mastery (${r.after})${what ? `: ${what}!` : "."}${grp ? ` No more ${esc(grp)} Mastery this encounter.` : ""}`, "mastery") });
}

export function registerMasteryHooks() {
  // A weapon given to a character opens its Mastery entry (once, by the user who added it).
  Hooks.on("createItem", async (item, options, userId) => {
    if (userId !== game.user.id || item.type !== "weapon" || item.parent?.type !== "character") return;
    try { await ensureEntry(item.parent, item); } catch (e) { console.warn("twod12 | Mastery entry", e); }
  });
}

/**
 * v0.0.207: the "Starting Mastery" settings of a character's Features and Talents (Sharpshooter, Bow Mastery: "Choose one Projectile weapon:
 * you start with 3 Mastery with it"), each with the weapon chosen ("" until chosen; the actor flag twod12.startMastery, by item id).
 * [{ itemId, from, trait, traitName, value, chosen }]; [] for an NPC or a character without one.
 */
export function startMasteryOf(actor) {
  if (actor?.type !== "character") return [];
  const picks = actor.getFlag?.(F, "startMastery") ?? {};
  const out = [];
  for (const it of [...(actor.itemTypes?.feature ?? []), ...(actor.itemTypes?.talent ?? [])])
    for (const st of it.system?.settings ?? []) {
      if (st.type !== "mastery") continue;
      const trait = st.mstTrait || "projectile", value = Math.max(0, Math.trunc(Number(st.mstValue)) || 0);
      out.push({ itemId: it.id, from: it.name, trait, traitName: TWOD12.weaponTraits?.[trait] ?? trait, value, chosen: picks[it.id] ?? "" });
    }
  return out;
}
/** Choose the weapon of a Starting Mastery: a weapon with its trait the character carries or one from the system's weapons; it starts at that Mastery. */
export async function chooseStartMastery(actor, itemId) {
  const sm = startMasteryOf(actor).find(x => x.itemId === itemId);
  if (!sm) return;
  const kinds = new Map();
  for (const w of actor.itemTypes?.weapon ?? []) if (w.system?.traits?.has?.(sm.trait)) kinds.set(masteryKey(groupOf(w)), groupOf(w));
  try {
    const pack = game.packs.get("twod12.weapons");
    for (const e of (await pack?.getDocuments?.()) ?? []) if (e.type === "weapon" && e.system?.traits?.has?.(sm.trait)) kinds.set(masteryKey(groupOf(e)), groupOf(e));
  } catch (e) { console.warn("twod12 | Starting Mastery: weapons", e); }
  if (!kinds.size) return ui.notifications.warn(`No ${sm.traitName} weapon found.`);
  const opts = [...kinds].map(([k, n]) => `<option value="${k}">${n}</option>`).join("");
  const key = await foundry.applications.api.DialogV2.prompt({ window: { title: sm.from }, content: `<p>Choose your ${sm.traitName} weapon: you start with ${sm.value} Mastery with it.</p><select name="k" style="width:100%">${opts}</select>`, ok: { label: "Choose", callback: (ev, btn) => btn.form.elements.k.value }, rejectClose: false });
  if (!key) return;
  const name = kinds.get(key), cur = Number(masteryOf(actor)[key]?.value) || 0;
  await setMastery(actor, key, Math.max(sm.value, cur), name);
  await actor.update({ [`flags.${F}.startMastery.${itemId}`]: name });
}
