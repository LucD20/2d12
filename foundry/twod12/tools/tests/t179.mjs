// Run with: node tools/tests/run.mjs (or node tools/tests/t179.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.242 (Lucas: the worth lines "still not showing"): a field the compendium build writes on an item (system.worth, v0.0.239) must be in the
// data model of every item type that carries it, or Foundry drops it on load. The schema is read from data.mjs's source, the types from content.mjs.
globalThis.foundry ??= { utils: {} };
const C = await import(ROOTURL + "tools/content.mjs");
const src = fs.readFileSync(ROOT + "module/data.mjs", "utf8"), models = fs.readFileSync(ROOT + "module/twod12.mjs", "utf8").match(/CONFIG\.Item\.dataModels = \{([^}]*)\}/)[1];
const classOf = Object.fromEntries([...models.matchAll(/(\w+): (\w+)/g)].map(m => [m[1], m[2]]));
const block = cls => { const i = src.indexOf(`export class ${cls} `), j = src.indexOf("\nexport class ", i + 1); return src.slice(i, j < 0 ? undefined : j); };
const fields = ["worth"];
for (const f of fields) {
  const types = [...new Set(C.docs.filter(d => d.system?.[f] !== undefined && d.system?.[f] !== "").map(d => d.type))].sort();
  console.log(`system.${f} written on compendium types: ${types.join(", ")} | in each type's schema: ${types.map(t => `${t} ${block(classOf[t]).includes(`${f}: str()`)}`).join(", ")}`);
}
