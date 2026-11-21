// Run with: node tools/tests/run.mjs (or node tools/tests/t267.mjs)
// v0.0.424 (Lucas, 2026-11-18: "Stack: Good, add that"; book/research/condition-sources.md): a condition with a source (Daunted of, Taunted by,
// Grabbed by) comes from one source at a time: from a different source the new one replaces the old one with its own duration (Chapter 8's
// intro; Chapter 2's Stacking points to it). The same source again keeps the longer duration. Foundry: effects.mjs sameSourceKeeps, used by
// createEffect (the duration and the value), createRiders and createLinked.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [{ id: "daunted" }] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
const E = await import(ROOTURL + "module/effects.mjs");
const book = f => fs.readFileSync(ROOT + "../../book/" + f, "utf8");

console.log("--- the book");
console.log("Chapter 8:", book("rules-src/08-conditions.md").includes("**A condition with a source**, such as Daunted of a creature, Taunted by one or Grabbed by one, comes from one source at a time: if you gain it from a different source, the new one replaces the old one, with its own duration."),
  "| Chapter 2 points to it:", book("rules-src/02-turns.md").includes("A condition with a source, such as Daunted of a creature, comes from one source at a time (see [[Chapter 8: Conditions]])."));

console.log("--- sameSourceKeeps (pure)");
const fright = { whileSeen: true, settings: [] }, slowed = { settings: [] };
console.log("Daunted of the Ogre, then of the Ogre again: kept (the longer duration):", E.sameSourceKeeps(fright, { origin: "Actor.ogre" }, "Actor.ogre"));
console.log("Daunted of the Ogre, then of the Paladin: replaced:", !E.sameSourceKeeps(fright, { origin: "Actor.ogre" }, "Actor.paladin"));
console.log("a condition with no source (Slowed) from two creatures: kept as one (Stacking):", E.sameSourceKeeps(slowed, { origin: "Actor.ogre" }, "Actor.paladin"));

console.log("--- createEffect on a creature that is Daunted of the Ogre for 3 rounds");
const C = await import(ROOTURL + "tools/content.mjs");
const FRIGHT = { expireOn: [], conditions: [], linked: "", ...C.docs.find(d => d.name === "Daunted" && d.type === "effect")?.system };   // the data model's defaults Foundry fills in
console.log("the compendium's Daunted has a source:", !!FRIGHT && E.sameSourceKeeps(FRIGHT, { origin: "A" }, "A") && !E.sameSourceKeeps(FRIGHT, { origin: "A" }, "B"));
const run = async (originUuid, rounds) => {
  const made = [], deleted = [];
  const old = { id: "e1", origin: "Actor.ogre", getFlag: (_s, k) => ({ effectUuid: "Item.fright", duration: { type: "rounds", rounds: 3 }, remaining: 3 })[k], name: "Daunted (Ogre)", statuses: new Set(["daunted"]) };
  const actor = { uuid: "Actor.hero", effects: [old], items: [], system: {},
    deleteEmbeddedDocuments: async (_t, ids) => { deleted.push(...ids); }, createEmbeddedDocuments: async (_t, data) => { made.push(...data); return []; } };
  const item = { uuid: "Item.fright", name: "Daunted", img: "", system: FRIGHT, toObject() { return { system: JSON.parse(JSON.stringify(this.system)) }; } };
  await E.createEffect(actor, item, { actorUuid: originUuid }, { duration: { type: "rounds", rounds } });
  return { rounds: made[0]?.flags?.twod12?.duration?.rounds, origin: made[0]?.origin, deleted: deleted.join(",") };
};
const a = await run("Actor.paladin", 1), b = await run("Actor.ogre", 1);
console.log("of the Paladin for 1 round: the Paladin's, 1 round, the old one deleted:", a.origin === "Actor.paladin" && a.rounds === 1 && a.deleted === "e1", JSON.stringify(a));
console.log("of the Ogre again for 1 round: the longer duration kept (3):", b.origin === "Actor.ogre" && b.rounds === 3, JSON.stringify(b));
