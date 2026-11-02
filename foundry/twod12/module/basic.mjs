// Basic Actions every creature has. They live on the actor as Action items flagged "basic" (the Actions tab groups them in "Basic").
import { TWOD12 } from "./config.mjs";
import { fistsItemData, fistsOf, FISTS_TRAITS } from "./fists.mjs";
const F = "twod12";
const I = (o = {}) => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", ...o });
const fx = () => ({ all: [], t1: [], t2: [], t3: [] });
const V = (ap, t1, t2, t3, effects = "", extra = {}) => ({ ap, noTiers: false, t1, t2, t3, x1: "", x2: "", x3: "", effects, fx: fx(), ...extra });

export const BASIC_ACTIONS = {
  basicWeaponAttack: {
    frequency: "atwill",
    name: "Weapon Attack",
    img: "icons/svg/sword.svg",
    traits: ["strike", "weapon"],
    targets: "One creature",
    vs: "",
    distance: "weapon",
    versions: [V(1, [], [I({ useW: true })], [I({ useW: true })], "")]   // 0 / 1[W] + [Mod] / 1[W] + [Mod]: the Weapon Modifier is added on Tiers 2 and 3
  },
  advance: {
    name: "Advance",
    frequency: "atwill",
    img: "icons/svg/wing.svg",
    traits: ["move", "self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [V(1, [], [], [], "When you use this Action, you move up to your Speed in squares. @Move[advance|distance:speed]", { noTiers: true })]
  },
  safeMovement: {
    name: "Evade",
    frequency: "atwill",
    img: "icons/svg/shield.svg",
    traits: ["self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(1, [], [], [], "@Move[evade|distance:1]", { noTiers: true }),
      V(2, [], [], [], "Evade half your Speed (rounded down): @Move[evade|distance:floor(speed/2)]", { noTiers: true })
    ]
  },
  reload: {
    name: "Reload",
    frequency: "atwill",
    img: "icons/svg/upgrade.svg",
    traits: ["handle", "weapon"],   // a Weapon Action (the Weapon Modifier) against DC 13; reloading an ally's weapon isn't automated yet
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(1, [], [], [], "", {
        x1: "Your next Reload attempt gains 2 Boons.",
        x2: "You Reload your weapon. @Reload[weapon] Then you can Regrip (1A) to hold your weapon with two hands: @Regrip[weapon|label:Regrip (1A)]",
        x3: "You Reload your weapon and @Move[evade|distance:1]. @Reload[weapon] Then you can Regrip (1A) to hold your weapon with two hands: @Regrip[weapon|label:Regrip (1A)]"
      })
    ]
  },
  interact: {
    name: "Interact",
    frequency: "atwill",
    img: "icons/svg/book.svg",
    traits: ["handle"],
    targets: "",
    vs: "",
    distance: "reach",
    versions: [
      V(
        1,
        [],
        [],
        [],
        "You do one of the following: draw an object you carry into a free hand; stow an object you hold (put it away on your person, such as sheathing a sword); swap two objects (stow the one you hold and draw another, in the same Action); grab objects within Reach, as many as you have free hands; help a Prone creature within Reach stand up; help an Imperiled creature within Reach get to safety; wake an Unconscious creature within Reach; open a door, chest or something similar. This Action is broader than most: it can be used for similar things in the world.",
        { noTiers: true }
      )
    ]
  },
  rally: {
    name: "Steel Yourself",
    frequency: "round",
    img: "icons/svg/regen.svg",
    traits: ["self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [V(2, [], [], [], "You use @Rally[1].", { noTiers: true }), V(3, [], [], [], "You use @Rally[2].", { noTiers: true })]
  },
  crawl: {
    name: "Crawl",
    frequency: "atwill",
    img: "icons/svg/falling.svg",
    traits: ["move", "self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(1, [], [], [], "You move 1 square. @Move[advance|distance:1|label:Crawl 1]", { noTiers: true }),
      V(2, [], [], [], "Requirements: Your Speed is 5 or higher. You move 3 squares. @Move[advance|distance:3|label:Crawl 3]", { noTiers: true })
    ]
  },
  // v0.0.211 (Lucas): Regrip, the hands' own Action (no Handle: it needs no free hand).
  regrip: {
    name: "Regrip",
    frequency: "atwill",
    img: "icons/svg/sword.svg",
    traits: ["self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(1, [], [], [], "You do one of the following: hold a weapon you hold in one hand with both hands (your other hand must be free); move a weapon from one hand to the other; or swap the weapons in your two hands. Regrip doesn't have the Handle trait: it doesn't need a free hand. @Regrip[weapon]", { noTiers: true })
    ]
  },
  release: {
    name: "Release",
    frequency: "atwill",
    img: "icons/svg/downgrade.svg",
    traits: ["self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(
        0,
        [],
        [],
        [],
        "You drop an object in your square, or let go of an object you hold with one hand (a two-handed weapon is then held with one hand). @Release[weapon]",
        { noTiers: true }
      )
    ]
  },
  stand: {
    name: "Stand",
    frequency: "atwill",
    img: "icons/svg/up.svg",
    traits: ["move", "self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [V(1, [], [], [], "You stand up: you are no longer Prone.", { noTiers: true })]
  },
  charge: {
    name: "Charge",
    frequency: "round",
    img: "icons/svg/thrust.svg",
    traits: ["move", "self"],
    targets: "",
    vs: "",
    distance: "",
    requirements: "You have at least Speed 3",
    versions: [
      V(
        2,
        [],
        [],
        [],
        "Advance at least 3 squares and up to your Speed in a straight line: @Move[charge|distance:speed+2*has(Battering Charge)|min:3|uncapped:yes|label:Charge]. You can't Charge through Difficult Terrain. At the end of your movement, make a Weapon Attack (1A) with 1 Boon: @Use[Weapon Attack|boons:1|empowered:has(Battering Charge)|label:Weapon Attack (1A, 1 Boon)]",
        { noTiers: true }
      )
    ]
  },
  leaning: {
    name: "Leaning",
    frequency: "atwill",
    img: "icons/svg/eye.svg",
    traits: ["self"],
    targets: "",
    vs: "",
    distance: "self",
    versions: [
      V(
        1,
        [],
        [],
        [],
        "Until the end of your turn, you calculate cover from one of your corners instead of the center of your square, and your own cover against other creatures' Actions is reduced by 1 level. You can stop Leaning at any time on your turn, at no cost. Click a corner of your square on the map to choose which one you lean toward: your token peeks out a little past it (so you can see around a wall that ends there, and you are more exposed too), unless a wall is in the way. Click it again to go back to the center. @Condition[leaning|eot]",
        { noTiers: true }
      )
    ]
  },
  fists: {
    frequency: "atwill",
    name: "Fists",
    requirements: "You have a free hand.",
    img: "icons/svg/combat.svg",
    weaponUse: "fists",   // v0.0.207: shown as its "Weapon used"
    traits: ["strike", "weapon"],   // a Weapon Action that uses only the Fists (fists.mjs weaponsFor): 0 / 1[W] + [Mod] / 1[W] + [Mod], [W] being 0 / 1 / 1d4 Bl
    targets: "One creature",
    vs: "",
    distance: "weapon",
    versions: [V(1, [], [I({ useW: true })], [I({ useW: true })], "")]
  },
  relocate: {
    frequency: "round",
    name: "Relocate",
    img: "icons/svg/up.svg",
    traits: ["strike", "handle", "body", "instinct"],
    targets: "One creature",
    vs: "roll",
    distance: "reach",
    requirements: "The target's SR is at most 1 higher than yours. The target must remain within your Reach throughout the whole movement.",
    versions: [
      V(1, [], [], [], "", { x1: "No effect.", x2: "@Move[reposition|distance:1|reach:yes]", x3: "@Move[reposition|distance:2|reach:yes]" }),
      V(2, [], [], [], "", { x1: "No effect.", x2: "@Move[reposition|distance:2|reach:yes]", x3: "@Move[reposition|distance:4|reach:yes]" }),
      V(3, [], [], [], "", { x1: "@Move[reposition|distance:1|reach:yes]", x2: "@Move[reposition|distance:3|reach:yes]", x3: "@Move[reposition|distance:5|reach:yes]" })
    ]
  },
  trip: {
    frequency: "round",
    name: "Trip",
    img: "icons/svg/falling.svg",
    traits: ["strike", "handle", "body", "instinct"],
    targets: "One creature",
    vs: "roll",
    distance: "reach",
    requirements: "The target's SR is at most 1 higher than yours.",
    versions: [
      V(1, [], [], [], "", { x1: "No effect.", x2: "No effect.", x3: "@Condition[prone]" }),
      V(2, [], [], [I({ dice: "1d8", subtype: "Bl" })], "", { x1: "No effect.", x2: "@Condition[prone]", x3: "@Condition[prone]" })
    ]
  },
  shove: {
    frequency: "round",
    name: "Shove",
    img: "icons/svg/up.svg",
    traits: ["strike", "handle", "body"],
    targets: "One creature",
    vs: "body",
    distance: "reach",
    requirements: "The target's SR is at most 1 higher than yours.",
    versions: [
      V(1, [], [], [], "", { x1: "No effect.", x2: "@Move[pushed|distance:1]", x3: "@Move[pushed|distance:2]" }),
      V(2, [], [], [], "", { x1: "No effect.", x2: "@Move[pushed|distance:2]", x3: "@Move[pushed|distance:4]" }),
      V(3, [], [], [], "", { x1: "@Move[pushed|distance:1]", x2: "@Move[pushed|distance:3]", x3: "@Move[pushed|distance:5]" })
    ]
  },
  haul: {
    frequency: "round",
    name: "Haul",
    img: "icons/svg/down.svg",
    traits: ["strike", "handle", "appeal", "body"],
    targets: "One creature",
    vs: "roll",
    distance: "reach",
    requirements: "Your Reach is 2 or more. The target's SR is at most 1 higher than yours and is at least 2 squares away. The target must remain within your Reach throughout the whole movement.",
    versions: [
      V(1, [], [], [], "", { x1: "No effect.", x2: "@Move[pulled|distance:1]", x3: "@Move[pulled|distance:2]" }),
      V(2, [], [], [], "", { x1: "No effect.", x2: "@Move[pulled|distance:2]", x3: "@Move[pulled|distance:4]" }),
      V(3, [], [], [], "", { x1: "@Move[pulled|distance:1]", x2: "@Move[pulled|distance:3]", x3: "@Move[pulled|distance:5]" })
    ]
  }
};

/** One flavor line per Basic Action, shown under the title of its cards. */
const BASIC_FLAVOR = {
 "Weapon Attack": "You strike with the weapon in your hands.",
 "Fists": "When there is nothing else in your hands, there are always your hands.",
 "Relocate": "You take them by the arm and put them where you want them.",
 "Steel Yourself": "You grit your teeth and find a little more to give.",
 "Charge": "You close the distance in one straight, reckless line.",
 "Shove": "You put your weight behind it and drive them back.",
 "Haul": "You snag them and drag them in.",
 "Trip": "A hooked foot, a twist, and they hit the ground.",
 "Advance": "You press forward, one deliberate step at a time.",
 "Crawl": "You drag yourself along the ground.",
 "Release": "You let it go.",
 "Regrip": "You shift your hands on the grip, and the weapon sits where you want it.",
 "Evade": "You slip through the fray without giving anyone an opening.",
 "Stand": "You get your feet back under you.",
 "Leaning": "You lean out from cover, just enough to see.",
 "Interact": "You pull the lever, open the door, grab what you need.",
 "Reload": "You work the mechanism and seat a fresh bolt."
};

const toItem = (key, d) => ({
  name: d.name, type: "action", img: d.img,
  system: { category: TWOD12.basicCategory, level: 0, flavor: BASIC_FLAVOR[d.name] ?? "", frequency: d.frequency ?? "", distance: d.distance ?? "", requirements: d.requirements ?? "", traits: d.traits, targets: d.targets, vs: d.vs, ...(d.weaponUse ? { weaponUse: d.weaponUse } : {}), versions: foundry.utils.deepClone(d.versions) },
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
/** The Basic Actions a creature has but shouldn't (an NPC made before v0.0.214 with Weapon Attack). */
export const unwantedBasics = actor => actor.items.filter(i => i.type === "action" && i.getFlag(F, "basic") && !wanted(actor, i.getFlag(F, "basic")));

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
    const fixed = await fixReleaseCost(game.actors ?? []);
    if (fixed) ui.notifications.info(`Release now costs 0 AP on ${fixed} creature${fixed === 1 ? "" : "s"}.`);
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
        const old = actor.items.some(i => i.type === "action" && i.getFlag(F, "basic") === "reposition") || missingBasic(actor) || oldRelocate || unwantedBasics(actor).length > 0;   // v0.0.214: an NPC with Weapon Attack
        if (old) { await addBasicActions(actor, { replace: true }); n++; } else await ensureFists(actor);
      } catch (e) { console.warn("twod12 | could not update the Basic Actions of", actor.name, e); }
    }
    if (n) ui.notifications.info(`2d12: the Basic Actions were updated on ${n} creature${n === 1 ? "" : "s"} (Relocate, Shove, Haul, Fists; NPCs have no Weapon Attack).`);
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
