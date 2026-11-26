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
  system: { category: TWOD12.basicCategory, level: 0, flavor: d.flavor ?? "", frequency: d.frequency ?? "", distance: d.distance ?? "", requirements: d.requirements ?? "", ...(d.description ? { description: d.description } : {}), ...(d.lines ? { lines: foundry.utils.deepClone(d.lines) } : {}), ...(d.special ? { special: d.special } : {}), traits: d.traits, targets: d.targets, vs: d.vs, ...(d.weaponUse ? { weaponUse: d.weaponUse } : {}), ...(d.reaction ? { reaction: true, reactionKind: d.reactionKind, trigger: d.trigger } : {}), ...(d.moment ? { moment: d.moment, momentRange: d.momentRange ?? 0, momentSelf: !!d.momentSelf, momentTarget: d.momentTarget ?? "subject", momentThreat: !!d.momentThreat } : {}), versions: foundry.utils.deepClone(d.versions), ...(d.automation ? { automation: d.automation } : {}) },   // v0.0.418: its rating
  flags: { [F]: { basic: key } }
});

/** The data of a Basic Action as an embedded Item (used to build the NPC compendium). */
export const basicItemData = key => toItem(key, BASIC_ACTIONS[key]);

/**
 * The Basic Actions an NPC doesn't get: Rally (NPCs have no Rally Points) and, v0.0.214 (Lucas, playtest 2), Weapon Attack and the Fists Action:
 * NPCs have no weapons of their own, their Basic attack is their weapon attack (with both they made two Bane-free attacks a turn).
 */
// v0.0.435 (Lucas, 2026-11-18, the Bestiary audit's question 7: "NPCs have Fist ... if the NPC loses their weapon, they make fists strikes"): Fists is
//   back; the GM uses it only when the NPC has no weapon that fits its Basic attack (by hand).
export const NPC_NO_BASIC = ["rally", "basicWeaponAttack"];
export const wanted = (actor, key) => !(actor?.type === "npc" && NPC_NO_BASIC.includes(key));
/** v0.0.228 (pack CS): a Basic Action on the actor whose texts or fields differ from the generated data (a card edited in book/cards): it is replaced.
 *  Compared: the texts of each Version, the requirements, the description, the targets, the traits, the distance and the Frequency (strings and numbers, not the tier shapes the data model normalizes). */
const basicPrint = sys => JSON.stringify({ d: sys.description ?? "", r: sys.requirements ?? "", t: sys.targets ?? "", tr: [...(sys.traits ?? [])].sort(), di: sys.distance ?? "", f: sys.frequency ?? "", ...(sys.moment ? { m: [sys.moment, Number(sys.momentRange) || 0, !!sys.momentSelf, sys.momentTarget ?? "subject", !!sys.momentThreat] } : {}), tg: sys.trigger ?? "", v: (sys.versions ?? []).map(v => [v.ap, v.effects ?? "", v.x1 ?? "", v.x2 ?? "", v.x3 ?? "", v.critical ?? ""]) });
/** v0.0.421: the in-place updates of the Basic Actions whose automation rating differs from the compendium's ([{ _id, "system.automation" }]). */
export const ratingUpdates = actor => actor.items.filter(i => i.type === "action" && BASIC_ACTIONS[i.getFlag(F, "basic")] && (i.system.automation ?? "") !== (BASIC_ACTIONS[i.getFlag(F, "basic")].automation ?? ""))
  .map(i => ({ _id: i.id, "system.automation": BASIC_ACTIONS[i.getFlag(F, "basic")].automation ?? "" }));
export const staleBasics = actor => actor.items.filter(i => { const k = i.type === "action" && i.getFlag(F, "basic"); return k && BASIC_ACTIONS[k] && (i.name !== BASIC_ACTIONS[k].name || basicPrint(i.system) !== basicPrint(toItem(k, BASIC_ACTIONS[k]).system)); });
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
  const have = [...(fi.system.traits ?? [])], t3 = fi.system.damage?.t3;
  const oldDmg = t3 && t3.die === "d4" && Number(t3.count) === 1 && Number(t3.mod) === 1;
  if (FISTS_TRAITS.every(t => have.includes(t)) && fi.system.range && !oldDmg) return false;
  await fi.update({ "system.traits": [...new Set([...have, ...FISTS_TRAITS])], "system.range": fi.system.range || "1", ...(oldDmg ? { "system.damage.t3": { count: 1, die: "d6", mod: 0 } } : {}) });
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
  // v0.0.527 (Lucas, 2026-11-26: "I dont run any old world"; F-033): the one-time world passes of v0.0.118 (Release at 0 AP) and v0.0.176 (the
  // Rally values) are gone, with those of v0.0.186, v0.0.187 and v0.0.207 (the cards' settings, automation.mjs)
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM) return;
    // v0.0.191 (Lucas): the system compendiums are unlocked while the world setting says so (on by default); only the GM and Assistants can
    // edit them (their ownership). Written straight into Foundry's compendium configuration (v0.0.190's one-time call didn't take).
    try { await unlockSystemPacks(); } catch (e) { console.warn("twod12 | unlocking the compendiums", e); }
    // v0.0.169 and v0.0.170, once per creature that needs it: the new Basic Actions (Relocate, the 3 AP Shove, Fists as a Weapon Action, Haul) and Fists as an ordinary weapon.
    let n = 0;
    for (const actor of game.actors ?? []) {
      if (!["character", "npc"].includes(actor.type) || !actor.isOwner) continue;
      try {
        // v0.0.174: Relocate keeps the target within your Reach (its buttons say reach:yes): an older copy is replaced.
        const oldRelocate = actor.items.some(i => i.type === "action" && i.getFlag(F, "basic") === "relocate" && !JSON.stringify(i.system.versions ?? []).includes("reach:yes"));
        const old = actor.items.some(i => i.type === "action" && i.getFlag(F, "basic") === "reposition") || missingBasic(actor) || oldRelocate || unwantedBasics(actor).length > 0 || staleBasics(actor).length > 0;   // v0.0.214: an NPC with Weapon Attack; v0.0.228: a card changed in book/cards
        if (old) { await addBasicActions(actor, { replace: true }); n++; } else await ensureFists(actor);
        // v0.0.421 (the audit): a Basic Action whose only change is its automation rating is updated in place (replacing it would lose the
        // favorites, the uses tracked by its id and the macros that point at it)
        if (!old) { const upd = ratingUpdates(actor); if (upd.length) await actor.updateEmbeddedDocuments("Item", upd); }
      } catch (e) { console.warn("twod12 | could not update the Basic Actions of", actor.name, e); }
    }
    if (n) ui.notifications.info(`2d12: the Basic Actions were updated on ${n} creature${n === 1 ? "" : "s"} (their cards changed; NPCs have no Basic Attack: their own Basic attack takes its place).`);
  });
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
