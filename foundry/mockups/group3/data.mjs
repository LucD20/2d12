// Group 3's mockup (the PC sheet's Build tab): the compendium PCs the page draws, read from the packs' source
// (foundry/twod12/packs/_source/pcs) and written to actors.json.   Run: node foundry/mockups/group3/data.mjs
// aveline4 is the compendium's level 4 Aveline (Stage 1); the page also lowers a copy of it to level 3 (example data, said on the page).
import fs from "node:fs";
const src = f => JSON.parse(fs.readFileSync(new URL(`../../twod12/packs/_source/pcs/${f}`, import.meta.url), "utf8"));
const pick = d => ({ name: d.name, type: d.type, img: d.img, system: d.system, flags: d.flags ?? {},
  items: d.items.map(i => ({ id: i._id, name: i.name, type: i.type, img: i.img, system: i.system, flags: i.flags ?? {} })) });
const out = {
  aveline: pick(src("aveline-human-paladin-smite-level-1.pc.json")), durgan: pick(src("durgan-dwarf-paladin-lay-on-hands-level-1.pc.json")),
  sylwen: pick(src("sylwen-elf-archer-quick-shots-level-1.pc.json")), kaela: pick(src("kaela-human-archer-strafe-level-1.pc.json")),
  aveline4: pick(src("aveline-human-paladin-smite.pc.json"))
};
fs.writeFileSync(new URL("./actors.json", import.meta.url), JSON.stringify(out));
console.log("actors.json:", Object.values(out).map(a => `${a.name} (${a.items.length} items)`).join(", "));
