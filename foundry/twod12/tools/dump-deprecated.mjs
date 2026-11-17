// v0.0.413: writes what left the packs (tools/content.mjs DEPRECATED) to foundry/deprecated/, one JSON file per pack, Foundry's own item and actor
// data (a name, a type, an img, a system), so any of it can come back: paste it into content.mjs, or create it in a world from the console
// (Item.create(data) / Actor.create(data)). Run: node tools/dump-deprecated.mjs (from foundry/twod12).
import fs from "node:fs";
globalThis.foundry ??= { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks ??= { on() {}, once() {} }; globalThis.CONFIG ??= { statusEffects: [] }; globalThis.Combat ??= class {}; globalThis.game ??= { settings: { get: () => true } };
const C = await import(new URL("./content.mjs", import.meta.url).href);
const out = new URL("../../deprecated/compendium/", import.meta.url);
fs.mkdirSync(out, { recursive: true });
const byPack = {};
for (const d of C.deprecatedDocs) (byPack[d.pack] ??= []).push({ name: d.name, type: d.type, img: d.img, folder: d.folder ?? "", system: d.system, flags: d.flags ?? {} });
if (C.deprecatedActors.length) byPack.npcs = C.deprecatedActors.map(a => ({ name: a.name, type: "npc", img: a.img, system: a.system, items: a.items }));
for (const f of fs.readdirSync(out)) if (f.endsWith(".json")) fs.unlinkSync(new URL(f, out));
for (const [pack, list] of Object.entries(byPack)) fs.writeFileSync(new URL(`${pack}.json`, out), JSON.stringify(list, null, 1) + "\n");
console.log(Object.entries(byPack).map(([p, l]) => `${p}: ${l.length}`).join(" | "));
