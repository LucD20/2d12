// Run with: node tools/tests/run.mjs (or node tools/tests/t168.mjs)
// v0.0.207, once per world (giveSettingsV207, automation.mjs): world copies made before the editability sweep get what the compendium has now:
// Marked Quarry's two Chat messages, Sharpshooter's / Bow Mastery's Starting Mastery, Brawler's Weapon property (settings they lack are added,
// the others kept); the hidden flags become fields and settings (and are removed); a character's Bow Mastery choice moves to its Starting Mastery.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {};
const stub = () => { globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } }; globalThis.Hooks = { on() {} }; };
stub(); globalThis.game = { settings: { get: () => true } };
const { docs } = await import(ROOTURL + "tools/content.mjs");
stub(); globalThis.game = { settings: { get: () => true }, packs: new Map() };
const AU = await import(ROOTURL + "module/automation.mjs");
const clone = o => JSON.parse(JSON.stringify(o));

/** A stand-in document: update() applies "a.b.c" paths and "-=key" removals, and remembers each update. */
function doc(d) {
  const o = clone(d);
  o.flags ??= {}; o.updates = 0;
  o.update = async u => {
    o.updates++;
    for (const [k, v] of Object.entries(u)) {
      const p = k.split("."), last = p.at(-1);
      let t = o;
      for (const x of p.slice(0, -1)) t = (t[x] ??= {});
      if (last.startsWith("-=")) delete t[last.slice(2)]; else t[last] = clone(v);
    }
  };
  return o;
}
const fromPack = new Map(["Marked Quarry", "Sharpshooter", "Bow Mastery", "Brawler"].map(n => [n, docs.find(d => d.name === n && ["feature", "talent"].includes(d.type)).system.settings.filter(x => ["message", "mastery", "weaponprop"].includes(x.type))]));
const types = it => (it.system.settings ?? []).map(x => x.type === "message" ? `message/${x.msgWhen}` : x.type).join(", ") || "none";

console.log("--- world items");
const items = [
  doc({ name: "Marked Quarry", type: "feature", system: { settings: [{ type: "boonbane", boons: 2 }] } }),   // edited by the GM: kept
  doc({ name: "Sharpshooter", type: "feature", system: { settings: [{ type: "ignore", ignoreRule: "engagedTarget" }] } }),
  doc({ name: "Brawler", type: "talent", system: { settings: [] }, flags: { twod12: { fistsThreaten: true } } }),
  doc({ name: "Iron Fist", type: "talent", system: { settings: [] }, flags: { twod12: { fistsWeapon: true } } }),   // the older flag, another name
  doc({ name: "Pummel", type: "action", system: { weaponUse: "" }, flags: { twod12: { fistsOnly: true } } }),
  doc({ name: "Low Kick", type: "action", system: { weaponUse: "" }, flags: { twod12: { kick: true } } }),
  doc({ name: "Weapon Attack", type: "action", system: { weaponUse: "" }, flags: { twod12: { basic: "attack" } } }),
  doc({ name: "Elusive", type: "feature", system: { settings: [{ type: "boonbane" }] } })
];
const lana = doc({ name: "Lana", type: "character", isOwner: true, flags: { twod12: { bowMastery: "Longbow" } } });
lana.items = [doc({ id: "sh", name: "Sharpshooter", type: "feature", system: { settings: [] } }), doc({ id: "fi", name: "Fists", type: "action", system: { weaponUse: "" }, flags: { twod12: { basic: "fists" } } })];
lana.itemTypes = { feature: lana.items.filter(i => i.type === "feature"), talent: [] };
lana.getFlag = (s, k) => lana.flags.twod12?.[k];
const npc = doc({ name: "Thug", type: "npc", isOwner: false });
npc.items = [doc({ name: "Pummel", type: "action", system: { weaponUse: "" }, flags: { twod12: { fistsOnly: true } } })];

const n = await AU.giveSettingsV207(items, [lana, npc], fromPack);
console.log("updated:", n);
for (const it of items) console.log(`  ${it.name.padEnd(14)} settings: ${types(it).padEnd(54)} weaponUse: ${it.system.weaponUse ?? "-"} | flags: ${JSON.stringify(it.flags.twod12 ?? {})}`);
console.log("Marked Quarry kept the GM's 2 Boons:", items[0].system.settings[0].boons === 2, "| its messages offer:", items[0].system.settings.filter(x => x.type === "message").map(x => `${x.msgAction} ${x.msgAp} AP`).join(", "));
console.log("--- a character");
console.log("Sharpshooter:", types(lana.items[0]), "| the Fists Basic Action:", lana.items[1].system.weaponUse, "| Bow Mastery choice moved:", JSON.stringify(lana.flags.twod12));
console.log("a creature this user doesn't own is left alone:", npc.items[0].system.weaponUse === "" && npc.items[0].updates === 0);
console.log("--- twice changes nothing");
console.log("updated the second time:", await AU.giveSettingsV207(items, [lana], fromPack));
