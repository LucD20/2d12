// The sheet mockups' data: the compendium actors the page draws (Sylwen and Aveline at level 1, the Orc Warrior, the Ogre Chieftain), read from the
// built packs' source (foundry/twod12/packs/_source: build the packs first, node twod12/tools/build-packs.mjs) and written to actors.json.
// Run: node foundry/mockups/sheets/data.mjs
import fs from "node:fs";
const src = f => JSON.parse(fs.readFileSync(new URL(`../../twod12/packs/_source/${f}`, import.meta.url), "utf8"));
const pick = d => ({ name: d.name, type: d.type, img: d.img, system: d.system, flags: d.flags ?? {},
  items: d.items.map(i => ({ id: i._id, name: i.name, type: i.type, img: i.img, system: i.system, flags: i.flags ?? {} })) });
const out = { sylwen: pick(src("pcs/sylwen-elf-archer-quick-shots-level-1.pc.json")), aveline: pick(src("pcs/aveline-human-paladin-smite-level-1.pc.json")), orc: pick(src("npcs/orc-warrior.npc.json")), ogre: pick(src("npcs/ogre-chieftain.npc.json")) };
fs.writeFileSync(new URL("./actors.json", import.meta.url), JSON.stringify(out));
console.log("actors.json:", Object.values(out).map(a => `${a.name} (${a.items.length} items)`).join(", "));
