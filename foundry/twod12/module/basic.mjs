// Basic Actions every creature has. They live on the actor as Action items flagged "basic" (the Actions tab groups them in "Basic").
import { TWOD12 } from "./config.mjs";
import { fistsItemData, fistsOf, FISTS_TRAITS } from "./fists.mjs";
import { BASIC_ACTIONS } from "./basic-data.mjs";   // v0.0.227 (pack CS): generated from book/cards/basic-actions.json (node tools/gen-basic.mjs)
export { BASIC_ACTIONS };
const F = "twod12";

// v0.0.334 (Lucas: "Opportunity Attack is triggering from non-threatened squares"): momentThreat was left out, so every creature's Opportunity Attack
// had no limit (any enemy moving anywhere); staleBasics compares it, so the creatures' copies are replaced by the refresh.
const toItem = (key, d) => ({
  name: d.name, type: "action", img: d.img,
  system: { category: TWOD12.basicCategory, level: 0, flavor: d.flavor ?? "", frequency: d.frequency ?? "", distance: d.distance ?? "", requirements: d.requirements ?? "", ...(d.description ? { description: d.description } : {}), traits: d.traits, targets: d.targets, vs: d.vs, ...(d.weaponUse ? { weaponUse: d.weaponUse } : {}), ...(d.reaction ? { reaction: true, reactionKind: d.reactionKind, trigger: d.trigger } : {}), ...(d.moment ? { moment: d.moment, momentRange: d.momentRange ?? 0, momentSelf: !!d.momentSelf, momentTarget: d.momentTarget ?? "subject", momentThreat: !!d.momentThreat } : {}), versions: foundry.utils.deepClone(d.versions) },
  flags: { [F]: { basic: key } }
});

/** The data of a Basic Action as an embedded Item (used to build the NPC compendium). */
export const basicItemData = key => toItem(key, BASIC_ACTIONS[key]);

/**
 * The Basic Actions an NPC doesn't get: Rally (NPCs have no Rally Points) and, v0.0.214 (Lucas, playtest 2), Weapon Attack and the Fists Action:
 * NPCs have no weapons of their own, their Basic attack is their weapon attack (with both they made two Bane-free attacks a turn).
 */
export const NPC_NO_BASIC = ["rally", "basicWeaponAttack", "fists"];
export const wanted = (actor, key) => !(actor?.type === "npc" && NPC_NO_BASIC.includes(key));
/** v0.0.228 (pack CS): a Basic Action on the actor whose texts or fields differ from the generated data (a card edited in book/cards): it is replaced.
 *  Compared: the texts of each Version, the requirements, the description, the targets, the traits, the distance and the Frequency (strings and numbers, not the tier shapes the data model normalizes). */
const basicPrint = sys => JSON.stringify({ d: sys.description ?? "", r: sys.requirements ?? "", t: sys.targets ?? "", tr: [...(sys.traits ?? [])].sort(), di: sys.distance ?? "", f: sys.frequency ?? "", ...(sys.moment ? { m: [sys.moment, Number(sys.momentRange) || 0, !!sys.momentSelf, sys.momentTarget ?? "subject", !!sys.momentThreat] } : {}), tg: sys.trigger ?? "", v: (sys.versions ?? []).map(v => [v.ap, v.effects ?? "", v.x1 ?? "", v.x2 ?? "", v.x3 ?? ""]) });
export const staleBasics = actor => actor.items.filter(i => { const k = i.type === "action" && i.getFlag(F, "basic"); return k && BASIC_ACTIONS[k] && basicPrint(i.system) !== basicPrint(toItem(k, BASIC_ACTIONS[k]).system); });
/** The Basic Actions a creature has but shouldn't (an NPC made before v0.0.214 with Weapon Attack; v0.0.407: one that is no longer a Basic Action, Opportunity Attack). */
export const unwantedBasics = actor => actor.items.filter(i => i.type === "action" && i.getFlag(F, "basic") && (!wanted(actor, i.getFlag(F, "basic")) || !BASIC_ACTIONS[i.getFlag(F, "basic")]));

/** Add (or replace) the Basic Actions on an actor; an NPC loses the ones it doesn't get (v0.0.214: Weapon Attack, Fists). */
export async function addBasicActions(actor, { replace = false } = {}) {
  const have = actor.items.filter(i => i.type === "action" && i.getFlag(F, "basic"));
  const drop = replace ? have : unwantedBasics(actor);
  if (drop.length) await actor.deleteEmbeddedDocuments("Item", drop.map(i => i.id));
  const keep = new Set(replace ? [] : have.map(i => i.getFlag(F, "basic")));
  const data = Object.entries(BASIC_ACTIONS).filter(([k]) => !keep.has(k) && wanted(actor, k)).map(([k, d]) => toItem(k, d));
  if (data.length) await actor.createEmbeddedDocuments("Item", data);
  await ensureFists(actor);
  return data.length;
}

/** Every creature has Fists, an ordinary weapon (Barehanded, Melee, Non-threatening, Range 1): created, or an older Fists item brought up to date (v0.0.169). */
export async function ensureFists(actor) {
  const fi = fistsOf(actor);
  if (!fi) { await actor.createEmbeddedDocuments("Item", [fistsItemData()]); return true; }
  const have = [...(fi.system.traits ?? [])];
  if (FISTS_TRAITS.every(t => have.includes(t)) && fi.system.range) return false;
  await fi.update({ "system.traits": [...new Set([...have, ...FISTS_TRAITS])], "system.range": fi.system.range || "1" });
  return true;
}

/** Refresh the Basic Actions of every character and NPC in the world (adds Crawl, new texts). Returns how many actors were refreshed. */
export async function refreshAllBasics() {
  let n = 0;
  for (const actor of game.actors ?? []) {
    if (!["character", "npc"].includes(actor.type) || !actor.isOwner) continue;
    try { await addBasicActions(actor, { replace: true }); n++; } catch (e) { console.warn("twod12 | could not refresh the Basic Actions of", actor.name, e); }
  }
  ui.notifications.info(`Basic Actions refreshed on ${n} creature${n === 1 ? "" : "s"}.`);
  return n;
}

export const missingBasic = actor => {
  const have = new Set(actor.items.filter(i => i.type === "action").map(i => i.getFlag(F, "basic")).filter(Boolean));
  return Object.keys(BASIC_ACTIONS).some(k => wanted(actor, k) && !have.has(k));
};

export function registerBasicHooks() {
  Hooks.on("createActor", async (actor, options, userId) => {
    if (userId !== game.user.id || !["character", "npc"].includes(actor.type)) return;
    try { await addBasicActions(actor); } catch (e) { console.warn("twod12 | could not add the Basic Actions", e); }
  });
  // Once, for the GM: a Release made when a Version couldn't cost 0 was saved at 1 AP; it costs 0 AP (v0.0.118).
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM) return;
    // v0.0.361 (PACK PERF, D37): once per world (it walked every item of every actor at each load)
    try {
      if (!game.settings.get(F, "releaseV118")) {
        const fixed = await fixReleaseCost(game.actors ?? []);
        await game.settings.set(F, "releaseV118", true);
        if (fixed) ui.notifications.info(`Release now costs 0 AP on ${fixed} creature${fixed === 1 ? "" : "s"}.`);
      }
    } catch (e) { console.warn("twod12 | Release cost", e); }
    // v0.0.176, once per world: the new Rally values of the Paladin and the Archer (the Rally Points formula changed with them).
    try {
      if (!game.settings.get(F, "rallyV176")) {
        const r = await fixClassRally(game.items ?? [], game.actors ?? []);
        await game.settings.set(F, "rallyV176", true);
        if (r) ui.notifications.info(`2d12: the Rally value of ${r} Paladin or Archer class item${r === 1 ? "" : "s"} follows the book now (Paladin 6, Archer 5).`);
      }
    } catch (e) { console.warn("twod12 | Rally values", e); }
    // v0.0.191 (Lucas): the system compendiums are unlocked while the world setting says so (on by default); only the GM and Assistants can
    // edit them (their ownership). Written straight into Foundry's compendium configuration (v0.0.190's one-time call didn't take).
    try { await unlockSystemPacks(); } catch (e) { console.warn("twod12 | unlocking the compendiums", e); }
    // v0.0.186, once per world: the cards automated by code that tested their name get their settings (automation.mjs).
    try {
      if (!game.settings.get(F, "settingsV186")) {
        const { giveSettingsV186 } = await import("./automation.mjs");
        const r = await giveSettingsV186(game.items ?? [], game.actors ?? []);
        await game.settings.set(F, "settingsV186", true);
        if (r) ui.notifications.info(`2d12: ${r} Feature${r === 1 ? "" : "s"} or Effect${r === 1 ? "" : "s"} got their automation as settings you can edit (Killer's Focus, Radiant Zeal, Elusive...).`);
      }
    } catch (e) { console.warn("twod12 | settings v0.0.186", e); }
    try {
      if (!game.settings.get(F, "settingsV187")) {
        const { giveSettingsV187 } = await import("./automation.mjs");
        const r = await giveSettingsV187(game.items ?? [], game.actors ?? []);
        await game.settings.set(F, "settingsV187", true);
        if (r) ui.notifications.info(`2d12: Killer's Focus and Radiant Zeal now give an Effect each turn (${r} item${r === 1 ? "" : "s"} updated).`);
      }
    } catch (e) { console.warn("twod12 | settings v0.0.187", e); }
    // v0.0.207, once per world (editability sweep): Marked Quarry's messages, the Starting Mastery, Brawler's Weapon property, the Actions' Weapon used.
    try {
      if (!game.settings.get(F, "settingsV207")) {
        const { giveSettingsV207 } = await import("./automation.mjs");
        const r = await giveSettingsV207(game.items ?? [], game.actors ?? []);
        await game.settings.set(F, "settingsV207", true);
        if (r) ui.notifications.info(`2d12: ${r} item${r === 1 ? "" : "s"} or character${r === 1 ? "" : "s"} updated: the last hidden card rules are settings you can see and edit (Marked Quarry's messages, Sharpshooter's Starting Mastery, Brawler, Pummel, Leg Sweep).`);
      }
    } catch (e) { console.warn("twod12 | settings v0.0.207", e); }
    // v0.0.169 and v0.0.170, once per creature that needs it: the new Basic Actions (Relocate, the 3 AP Shove, Fists as a Weapon Action, Haul) and Fists as an ordinary weapon.
    let n = 0;
    for (const actor of game.actors ?? []) {
      if (!["character", "npc"].includes(actor.type) || !actor.isOwner) continue;
      try {
        // v0.0.174: Relocate keeps the target within your Reach (its buttons say reach:yes): an older copy is replaced.
        const oldRelocate = actor.items.some(i => i.type === "action" && i.getFlag(F, "basic") === "relocate" && !JSON.stringify(i.system.versions ?? []).includes("reach:yes"));
        const old = actor.items.some(i => i.type === "action" && i.getFlag(F, "basic") === "reposition") || missingBasic(actor) || oldRelocate || unwantedBasics(actor).length > 0 || staleBasics(actor).length > 0;   // v0.0.214: an NPC with Weapon Attack; v0.0.228: a card changed in book/cards
        if (old) { await addBasicActions(actor, { replace: true }); n++; } else await ensureFists(actor);
      } catch (e) { console.warn("twod12 | could not update the Basic Actions of", actor.name, e); }
    }
    if (n) ui.notifications.info(`2d12: the Basic Actions were updated on ${n} creature${n === 1 ? "" : "s"} (their cards changed; NPCs have no Weapon Attack).`);
  });
}

/**
 * v0.0.176: the class Rally values of the book (Paladin 6, Archer 5) with the new Rally Points formula. A Paladin or Archer class item that still has
 * the old value (4 or 3, which went with ceil(Pool / 4) + Rally) gets the new one: world items and the ones on actors. Returns how many were changed.
 */
export const RALLY_VALUES = { paladin: [4, 6], archer: [3, 5] };
export async function fixClassRally(worldItems, actors) {
  let n = 0;
  const fix = async it => {
    const v = RALLY_VALUES[String(it?.name ?? "").trim().toLowerCase()];
    if (it?.type !== "class" || !v || Number(it.system?.rallyMod) !== v[0]) return;
    try { await it.update({ "system.rallyMod": v[1] }); n++; } catch (e) { console.warn("twod12 | could not update the Rally value of", it.name, e); }
  };
  for (const it of worldItems ?? []) await fix(it);
  for (const a of actors ?? []) for (const it of a.items ?? []) await fix(it);
  return n;
}

/** Set the Release Basic Action of these actors to 0 AP where it was saved at more. Returns how many were changed. */
export async function fixReleaseCost(actors) {
  let n = 0;
  for (const actor of actors) {
    for (const it of actor.items ?? []) {
      if (it.type !== "action" || it.getFlag?.(F, "basic") !== "release") continue;
      const vs = it.system.versions ?? [];
      if (!vs.length || vs.every(v => v.ap === 0)) continue;
      try { await it.update({ "system.versions": vs.map(v => ({ ...(v.toObject?.() ?? v), ap: 0 })) }); n++; } catch (e) { console.warn("twod12 | could not fix Release on", actor.name, e); }
    }
  }
  return n;
}

/** v0.0.191: unlock the system's compendiums (world setting "unlockPacks", on by default). Returns how many were unlocked. */
export async function unlockSystemPacks() {
  if (!game.user.isGM || !game.settings.get(F, "unlockPacks")) return 0;
  const cfg = foundry.utils.deepClone(game.settings.get("core", "compendiumConfiguration") ?? {});
  let n = 0;
  for (const p of game.packs ?? []) {
    if (p.metadata?.packageName !== F || p.metadata?.packageType !== "system") continue;
    if (cfg[p.collection]?.locked === false) continue;
    cfg[p.collection] = { ...(cfg[p.collection] ?? {}), locked: false };
    n++;
  }
  if (n) { await game.settings.set("core", "compendiumConfiguration", cfg); console.log(`twod12 | ${n} system compendium(s) unlocked`); }
  return n;
}
