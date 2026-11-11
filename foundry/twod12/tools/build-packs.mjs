// Writes packs/_source/<pack>/*.json from tools/content.mjs and compiles packs/<pack> (LevelDB) with the Foundry CLI.
//   npm install @foundryvtt/foundryvtt-cli        (once, outside of the system folder)
//   node tools/build-packs.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { docs, actors, pcs, PACKS, SYSTEM, idOf } from "./content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = JSON.parse(fs.readFileSync(path.join(root, "system.json"), "utf8")).version;
const stats = { systemId: SYSTEM, systemVersion: version, coreVersion: "14", createdTime: null, modifiedTime: null, lastModifiedBy: null };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

fs.rmSync(path.join(root, "packs"), { recursive: true, force: true });
const counts = {};
for (const [pack, def] of Object.entries(PACKS)) {
  const dir = path.join(root, "packs", "_source", pack);
  fs.mkdirSync(dir, { recursive: true });
  const mine = (pack === "npcs" || pack === "pcs") ? [] : docs.filter(d => d.pack === pack);
  const folderNames = [...new Set(mine.map(d => d.folder).filter(Boolean))];
  folderNames.forEach((name, i) => {
    const _id = idOf("Folder", `${pack}:${name}`);
    fs.writeFileSync(path.join(dir, `_folder-${slug(name)}.json`), JSON.stringify({ _id, _key: `!folders!${_id}`, name, type: "Item", folder: null, sorting: "a", sort: (i + 1) * 100000, color: null, description: "", flags: {}, _stats: stats }, null, 2));
  });
  mine.forEach((d, i) => {
    const _id = idOf("Item", d.name);
    const folder = d.folder ? idOf("Folder", `${pack}:${d.folder}`) : null;
    const doc = { _id, _key: `!items!${_id}`, name: d.name, type: d.type, img: d.img, folder, sort: (i + 1) * 100000, system: d.system, effects: [], flags: d.flags ?? {}, ownership: { default: 0 }, _stats: stats };
    fs.writeFileSync(path.join(dir, `${slug(d.name)}.${d.type}.json`), JSON.stringify(doc, null, 2));
  });
  counts[pack] = mine.length;
  const people = pack === "npcs" ? actors : (pack === "pcs" ? pcs : null);
  if (people) {
    people.forEach((a, i) => {
      const _id = idOf("Actor", a.name);
      const items = a.items.map((it, k) => ({ ...it, _key: `!actors.items!${_id}.${it._id}`, sort: (k + 1) * 100000, _stats: stats }));
      const isPc = pack === "pcs";
      const token = isPc
        ? { name: a.token || a.name, texture: { src: a.img }, disposition: 1, actorLink: true, sight: { enabled: true }, detectionModes: [{ id: "hearing", enabled: true, range: null }], displayBars: 50, lockRotation: true }
        : { name: a.name, texture: { src: a.img }, disposition: -1, actorLink: false, displayBars: 50, lockRotation: true };   // v0.0.346 (Lucas): bars always shown, to everyone
      const doc = { _id, _key: `!actors!${_id}`, name: a.name, type: isPc ? "character" : "npc", img: a.img, folder: null, sort: (i + 1) * 100000, system: a.system, items, effects: [], flags: a.flags ?? {}, ownership: { default: 0 }, prototypeToken: token, _stats: stats };
      fs.writeFileSync(path.join(dir, `${slug(a.name)}.${isPc ? "pc" : "npc"}.json`), JSON.stringify(doc, null, 2));
    });
    counts[pack] = people.length;
  }
}

let compilePack;
try { ({ compilePack } = await import("@foundryvtt/foundryvtt-cli")); }
catch (e) { console.error("Install the Foundry CLI first: npm install @foundryvtt/foundryvtt-cli"); process.exit(1); }
for (const pack of Object.keys(PACKS)) {
  await compilePack(path.join(root, "packs", "_source", pack), path.join(root, "packs", pack), { log: false });
  console.log(`packs/${pack}: ${counts[pack]} items`);
}
