// The HUD mockup's data: the compendium characters the page draws (Sylwen, Kaela and Durgan at level 1), read from the built packs' source
// (foundry/twod12/packs/_source: build the packs first, node twod12/tools/build-packs.mjs) and written to actors.json.
// Run: node foundry/mockups/hud3/data.mjs
import fs from "node:fs";
const src = f => JSON.parse(fs.readFileSync(new URL(`../../twod12/packs/_source/${f}`, import.meta.url), "utf8"));
const pick = d => ({ name: d.name, type: d.type, img: d.img, system: d.system, flags: d.flags ?? {},
  items: d.items.map(i => ({ id: i._id, name: i.name, type: i.type, img: i.img, system: i.system, flags: i.flags ?? {} })) });
const out = { sylwen: pick(src("pcs/sylwen-elf-archer-quick-shots-level-1.pc.json")), kaela: pick(src("pcs/kaela-human-archer-strafe-level-1.pc.json")), durgan: pick(src("pcs/durgan-dwarf-paladin-lay-on-hands-level-1.pc.json")) };
fs.writeFileSync(new URL("./actors.json", import.meta.url), JSON.stringify(out));
console.log("actors.json:", Object.values(out).map(a => `${a.name} (${a.items.length} items)`).join(", "));
