// Run with: node tools/tests/run.mjs (or node tools/tests/t112.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
import path from "node:path";
// v0.0.126: the Paladin of Rounds 11 and 12 in the compendiums: every reference between the documents resolves, the class has its choices,
// the cards have the numbers of the book (Escalation costs, Split modes, scaling meta-line values), and Divine Connection is gone.
const SRC = path.join(ROOT, "packs/_source");
const docs = [];
const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".json") && !f.startsWith("_folder")) docs.push({ pack: path.basename(path.dirname(p)), ...JSON.parse(fs.readFileSync(p, "utf8")) }); } };
walk(SRC);
const byId = new Map(docs.map(d => [`${d.pack}:${d._id}`, d])), byName = (pack, name) => docs.find(d => d.pack === pack && d.name === name);
console.log("documents:", docs.length);
// every Compendium.twod12.<pack>.Item.<id> found anywhere in the Items resolves
let refs = 0; const broken = [];
for (const d of docs) for (const m of JSON.stringify(d.system ?? {}).matchAll(/Compendium\.twod12\.(\w+)\.Item\.(\w{16})/g)) { refs++; if (!byId.has(`${m[1]}:${m[2]}`)) broken.push(`${d.name} -> ${m[1]}:${m[2]}`); }
console.log("references:", refs, "| broken:", broken.length ? broken.join("; ") : "none");
const nameOf = u => { const m = u.match(/Compendium\.twod12\.(\w+)\.Item\.(\w{16})/); return byId.get(`${m[1]}:${m[2]}`)?.name; };
const paladin = byName("classes", "Paladin").system;
console.log("Paladin features:", paladin.features.map(f => nameOf(f.uuid)).join(", "), "| Divine Connection kept for testing (not in the class):", !!byName("features", "Divine Connection") && !paladin.features.some(f => nameOf(f.uuid) === "Divine Connection"), "| its id is the old one:", byName("features", "Divine Connection")?._id);
for (const n of ["Encounter Pick", "Daily Pick", "Free Picks", "Escalation Passive", "Escalation Actives"]) { const f = byName("features", n).system; console.log(`${n}: choose ${f.choiceCount} of ${f.choiceOptions.length}: ${f.choiceOptions.map(nameOf).join(", ")}`); }
console.log("--- the cards");
const act = n => byName("actions", n).system;
for (const n of ["Call to Arms", "Divine Surge", "Hand of Mercy", "Judgment", "Sanctified Ground"]) console.log(n.padEnd(18), `Escalation ${act(n).escalation}`, `| AP ${act(n).versions.map(v => v.ap).join("/")}`, `| ${act(n).frequency}`);
const dr = act("Divine Retribution");
console.log("Divine Retribution: split:", dr.traits.includes("split"), "| versions:", dr.versions.map(v => `${v.ap}R ${v.mode}`).join(", "), "| reaction:", dr.reaction);
console.log("Rebuke: Turn:", act("Rebuke").frequency, "| 1R / 2R:", act("Rebuke").versions.map(v => v.ap).join("/"), "| trigger:", act("Rebuke").trigger);
console.log("Smite 2 AP Holy dice:", act("Smite").versions.map(v => v.t2.find(i => i.dice)?.dice ?? "-").join(" / "), "(1 / 2 / 3 AP, Tier 2)");
console.log("Judgment tiers:", ["t1", "t2", "t3"].map(t => act("Judgment").versions[0][t].map(i => i.dice).join("+") || "-").join(" / "), "| Vow of Enmity targets:", act("Vow of Enmity").targets, "| distance:", act("Vow of Enmity").distance);
console.log("--- the passives and effects");
const feat = n => byName("features", n).system, fx = n => byName("effects", n).system;
const pj = feat("Profane Judgment").settings[0];
console.log("Profane Judgment:", pj.type, pj.trigSub, pj.trigTag, "->", nameOf(pj.fxUuid), "| that effect:", fx("Profane Judgment (Enfeebled)").settings[0].type, "Enfeebled", fx("Profane Judgment (Enfeebled)").settings[0].enfeebled, fx("Profane Judgment (Enfeebled)").duration.type);
const dv = feat("Divine Vigil").settings[0];
console.log("Divine Vigil:", dv.type, `Aura ${dv.auraSize}`, dv.auraWho, "self", dv.auraSelf, "from Escalation", dv.minEscalation, "->", nameOf(dv.fxUuid), "| boon on Saves against", fx("Divine Vigil (Boon against Fear)").settings[0].from.join(","));
const ds = fx("Divine Surge"), b = ds.settings[0];
console.log("Divine Surge:", b.type, b.dmg, b.dmgPool, b.dmgSub, "| by name:", b.predicate, "| ends after:", ds.expireOn.join(","));
console.log("auras: Shield of Faith 3 AP:", nameOf(fx("Shield of Faith (Aura)").settings[0].fxUuid), "| Aura of Protection:", ["1 AP", "2 AP", "3 AP"].map(a => `${fx(`Aura of Protection (${a})`).settings[0].auraSize}: ${nameOf(fx(`Aura of Protection (${a})`).settings[0].fxUuid)}`).join(" | "));
const pal = JSON.parse(fs.readFileSync(path.join(SRC, "pcs/human-paladin.pc.json"), "utf8"));
console.log("pregen Paladin items:", pal.items.filter(i => ["feature", "action"].includes(i.type) && !/^(Fists|Weapon Attack|Interact|Reposition|Relocate|Haul|Trip|Shove|Reload|Leaning|Steel Yourself|Evade|Crawl|Stand|Advance|Release)/.test(i.name)).map(i => i.name).join(", "));
const ids = pal.items.map(i => i._id); console.log("pregen ids unique:", new Set(ids).size === ids.length);
