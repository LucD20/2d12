// Pack CARD-ONE step 1: the card gallery's data. Writes foundry/gallery/data.json: every Action and Feature of the compendium (tools/content.mjs) as
// plain item data, in the order the gallery draws them, with the names of the compendium uuids (a Feature's granted Actions, an effect chip).
// Run: node tools/gallery/data.mjs (tools/gallery/shoot.mjs runs it first).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { statusEffects: [] }; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const C = await import(new URL("../content.mjs", import.meta.url).href);
const plain = v => JSON.parse(JSON.stringify(v, (k, x) => (x instanceof Set ? [...x] : x)));
const pick = d => ({ id: C.idOf("Item", d.name), name: d.name, type: d.type, img: d.img, folder: d.folder ?? "", pack: d.pack, flags: plain(d.flags ?? {}), system: plain(d.system) });
const order = (a, b) => (a.folder || "").localeCompare(b.folder || "") || a.name.localeCompare(b.name);
const cards = C.docs.filter(d => ["action", "feature", "species", "class"].includes(d.type)).map(pick).sort(order);   // v0.0.439 (CARD-ONE step 7): the Species and the Classes on the Feature card too
const names = Object.fromEntries(C.docs.map(d => [C.uuidOf(d.pack, d.name), { name: d.name, type: d.type, pack: d.pack, system: plain(d.system) }]));
const out = new URL("../../../gallery/data.json", import.meta.url);
fs.mkdirSync(new URL(".", out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ cards, names }));
console.log(`gallery data: ${cards.length} cards (${cards.filter(c => c.type === "action").length} Actions, ${cards.filter(c => c.type === "feature").length} Features)`);
