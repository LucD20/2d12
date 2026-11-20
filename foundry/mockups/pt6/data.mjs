// Playtest 6's mockups (D1-D5): the compendium creatures the page draws, read from the packs' source (foundry/twod12/packs/_source) and
// written to actors.json.   Run: node foundry/mockups/pt6/data.mjs
import fs from "node:fs";
const src = f => JSON.parse(fs.readFileSync(new URL(`../../twod12/packs/_source/${f}`, import.meta.url), "utf8"));
const pick = d => ({ name: d.name, type: d.type, img: d.img, system: d.system, flags: d.flags ?? {},
  items: d.items.map(i => ({ id: i._id, name: i.name, type: i.type, img: i.img, system: i.system, flags: i.flags ?? {} })) });
const out = {
  durgan: pick(src("pcs/durgan-dwarf-paladin-lay-on-hands-level-1.pc.json")), aveline: pick(src("pcs/aveline-human-paladin-smite-level-1.pc.json")),
  sylwen: pick(src("pcs/sylwen-elf-archer-quick-shots-level-1.pc.json")), kaela: pick(src("pcs/kaela-human-archer-strafe-level-1.pc.json")),
  goblin: pick(src("npcs/goblin-sneak.npc.json")), orc: pick(src("npcs/orc-warrior.npc.json")), ogre: pick(src("npcs/ogre-chieftain.npc.json"))
};
fs.writeFileSync(new URL("./actors.json", import.meta.url), JSON.stringify(out));
console.log("actors.json:", Object.values(out).map(a => `${a.name} (${a.items.length} items)`).join(", "));
