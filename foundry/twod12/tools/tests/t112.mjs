// Run with: node tools/tests/run.mjs (or node tools/tests/t112.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
import path from "node:path";
// v0.0.126: the Paladin of Rounds 11 and 12 (v0.0.181: the P1 Paladin of the book) in the compendiums: every reference between the documents resolves, the class has its choices,
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
// v0.0.181 (P1): the book's Paladin: the level list in today's structure, the Hallmark Action, the new cards, Guard and the old cards' folder.
const featLv = n => byName("features", n).system.level;
for (const n of ["Hallmark Action", "Encounter Pick", "Escalation Passive", "Escalation Active", "Daily Pick", "Escalation Passive (Level 3)"]) { const f = byName("features", n).system; console.log(`${n} (level ${f.level}): choose ${f.choiceCount} of ${f.choiceOptions.length}: ${f.choiceOptions.map(nameOf).join(", ")}`); }
console.log("Talent slots:", ["Talent (Level 1)", "Talent (Level 2)"].map(n => `${n}: ${byName("features", n).system.talents} at level ${featLv(n)}`).join(" | "), "| Mind Health x" + paladin.mindMult);
console.log("--- the cards");
const act = n => byName("actions", n).system;
const tiersOf = (n, i) => ["t1", "t2", "t3"].map(t => act(n).versions[i][t].map(x => (x.useW ? "1[W]" : "") + (x.dice ? `${x.useW ? "+" : ""}${x.dice}${x.subtype ? " " + x.subtype : ""}` : "")).join("+") || "-").join(" / ");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
console.log("Smite:", act("Smite").traits.join(","), "|", act("Smite").versions.map((v, i) => `${v.ap} AP ${tiersOf("Smite", i)}`).join(" || "));
console.log("Smite 3 AP effects:", txt(act("Smite").versions[2].effects));
console.log("Lay On Hands:", act("Lay On Hands").targets, "|", act("Lay On Hands").versions.map(v => `${v.ap} AP: ${txt(v.effects)}${v.fx.all.length ? ` [${v.fx.all.map(x => nameOf(x.uuid)).join(", ")}]` : ""}`).join(" || "));
console.log("Holy Wrath:", act("Holy Wrath").frequency, "|", act("Holy Wrath").versions.map((v, i) => `${v.ap} AP ${tiersOf("Holy Wrath", i)}`).join(" || "));
for (const n of ["Shield of Faith", "Bulwark of Faith"]) console.log(`${n}:`, act(n).frequency, act(n).reactionKind, `| ${act(n).versions.map(v => v.ap + "R").join("/")} | ${act(n).trigger} | ${act(n).versions.map(v => txt(v.effects)).join(" || ")}`);
console.log("Aura of Protection:", `Escalation ${act("Aura of Protection").escalation}`, act("Aura of Protection").frequency, `${act("Aura of Protection").versions[0].ap} AP`, "->", act("Aura of Protection").versions[0].fx.all.map(x => nameOf(x.uuid)).join(", "));
console.log("Divine Surge:", `Escalation ${act("Divine Surge").escalation}`, act("Divine Surge").targets, "|", txt(act("Divine Surge").versions[0].effects));
console.log("Consecrated Ground:", txt(act("Consecrated Ground").versions[0].effects));
console.log("--- the passives and effects");
const feat = n => byName("features", n).system, fx = n => byName("effects", n).system;
const pj = feat("Divine Power").settings[0];
console.log("Divine Power:", pj.type, pj.trigSub, pj.trigTag, "->", nameOf(pj.fxUuid), "| that effect:", fx("Divine Power (Enfeebled)").settings[0].type, "Enfeebled", fx("Divine Power (Enfeebled)").settings[0].enfeebled, fx("Divine Power (Enfeebled)").duration.type, "| Profane Judgment gone:", !byName("features", "Profane Judgment"));
for (const n of ["Font of Mercy", "Radiant Zeal", "Hallowed Stance"]) console.log(`${n}: ${feat(n).category} | ${txt(feat(n).description)}`);
const ap = fx("Aura of Protection").settings[0];
console.log("the Aura:", ap.type, `Aura ${ap.auraSize}`, ap.auraWho, "->", nameOf(ap.fxUuid), "| lasts:", fx("Aura of Protection").duration.type || "until the encounter ends (an Escalation effect)");
const lh = fx("Lay On Hands (Holy Strike)").settings[0];
console.log("Lay On Hands' strike:", lh.type, lh.dmg, lh.dmgPool, lh.dmgSub, lh.tiers.join(","), "| ends after:", fx("Lay On Hands (Holy Strike)").expireOn.join(","));
console.log("old cards:", docs.filter(d => d.name === "Vow of Enmity" || d.name === "Word of Radiance").map(d => d.name).join(", "), "kept | in no pick:", !["Hallmark Action", "Encounter Pick", "Escalation Passive", "Escalation Active", "Daily Pick"].some(n => byName("features", n).system.choiceOptions.map(nameOf).some(x => ["Vow of Enmity", "Word of Radiance", "Call to Arms"].includes(x))));
const pal = JSON.parse(fs.readFileSync(path.join(SRC, "pcs/human-paladin.pc.json"), "utf8"));
console.log("pregen Paladin items:", pal.items.filter(i => ["feature", "action"].includes(i.type) && !/^(Fists|Weapon Attack|Interact|Reposition|Relocate|Haul|Trip|Shove|Reload|Leaning|Steel Yourself|Evade|Crawl|Stand|Advance|Release)/.test(i.name)).map(i => i.name).join(", "));
const ids = pal.items.map(i => i._id); console.log("pregen ids unique:", new Set(ids).size === ids.length);
