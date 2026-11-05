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
// v0.0.185 (pack C2): the level list is the class's levels (sections), no more pick Features.
const secLine = x => `${x.title} (${x.kind}${x.kind === "items" ? `, ${x.mode}` : ""}${x.kind === "repertoire" ? `, ${x.freq}` : ""}${x.kind === "attr" ? `: ${x.pairs.map(p => `${p.a} or ${p.b}`).join(", ")}` : x.mode === "granted" ? "" : `, pick ${x.pick}`})${x.items.length ? `: ${x.items.map(nameOf).join(", ")}` : ""}`;
paladin.levels.forEach((l, i) => console.log(`Level ${i + 1}:`, l.sections.map(secLine).join(" | ")));
console.log("Repertoire:", paladin.repertoire.map(nameOf).join(", "), "| Escalation:", paladin.escPassives.map(nameOf).join(", "), "/", paladin.escActives.map(nameOf).join(", "));
console.log("pick Features gone:", !["Hallmark Action", "Encounter Pick", "Talent (Level 1)", "Talent (Level 2)"].some(n => docs.some(d => d.name === n)), "| Health high " + paladin.healthHigh + " / low " + paladin.healthLow + " (Stage 2 +" + paladin.stepHigh2 + " / +" + paladin.stepLow2 + ")");
console.log("--- the cards");
const act = n => byName("actions", n).system;
const tiersOf = (n, i) => ["t1", "t2", "t3"].map(t => act(n).versions[i][t].map(x => (x.useW ? "1[W]" : "") + (x.dice ? `${x.useW ? "+" : ""}${x.dice}${x.subtype ? " " + x.subtype : ""}` : "")).join("+") || "-").join(" / ");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
console.log("Smite:", act("Smite").traits.join(","), "|", act("Smite").versions.map((v, i) => `${v.ap} AP ${tiersOf("Smite", i)}`).join(" || "));
console.log("Smite 3 AP effects:", txt(act("Smite").versions[2].effects));
console.log("Lay On Hands:", act("Lay On Hands").targets, "|", act("Lay On Hands").versions.map(v => `${v.ap} AP: ${txt(v.effects)}${v.fx.all.length ? ` [${v.fx.all.map(x => nameOf(x.uuid)).join(", ")}]` : ""}`).join(" || "));
console.log("Holy Wrath:", act("Holy Wrath").frequency, "|", act("Holy Wrath").versions.map((v, i) => `${v.ap} AP ${tiersOf("Holy Wrath", i)}`).join(" || "));
for (const n of ["Shield of Faith", "Bulwark of Faith"]) console.log(`${n}:`, act(n).frequency, act(n).reactionKind, `| ${act(n).versions.map(v => v.ap + "R").join("/")} | ${act(n).trigger} | ${act(n).versions.map(v => txt(v.effects)).join(" || ")}`);
console.log("Beacon (was Aura of Protection):", `Escalation ${act("Beacon").escalation}`, act("Beacon").frequency, `${act("Beacon").versions[0].ap} AP`, "->", act("Beacon").versions[0].fx.all.map(x => nameOf(x.uuid)).join(", "));
// Pack R-classes (v0.0.235): Divine Surge is an Escalation 1 Passive (a Feature), the Apexes are Encounter Actions that need Escalation 3.
for (const n of ["Final Verdict", "Hallowed Dawn"]) console.log(`${n}:`, `Escalation ${act(n).escalation}`, act(n).frequency, `${act(n).versions[0].ap} AP`, act(n).targets, "|", act(n).areaCfg ? `${act(n).areaCfg.size} ${act(n).areaCfg.shape} (${act(n).areaCfg.targets})` : "no area", "|", txt(act(n).versions[0].effects).slice(0, 90));
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
console.log("old cards:", docs.filter(d => d.name === "Vow of Enmity" || d.name === "Word of Radiance").map(d => d.name).join(", "), "kept | in no level:", !paladin.levels.some(l => l.sections.some(x => x.items.map(nameOf).some(n => ["Vow of Enmity", "Word of Radiance", "Call to Arms"].includes(n)))) && !paladin.repertoire.map(nameOf).some(n => ["Word of Radiance", "Call to Arms"].includes(n)));
// v0.0.183: the four builds of the ruler, and one NPC per role (the Bestiary's examples)
for (const f of ["paladin-1-smite-heavy-blows", "paladin-3-lay-on-hands-protector", "archer-1-double-shot-marksman", "archer-3-rolling-shot-kickboxer"]) {
  const pc = JSON.parse(fs.readFileSync(path.join(SRC, `pcs/${f}.pc.json`), "utf8")), ids = pc.items.map(i => i._id);
  console.log(`${pc.name}:`, pc.items.filter(i => ["feature", "action", "talent"].includes(i.type) && !i.flags?.twod12?.basic && !/^(Fists|Lock & Loose|Reaping Sweep)$/.test(i.name)).map(i => i.name).join(", "), "| ids unique:", new Set(ids).size === ids.length);
}
for (const f of fs.readdirSync(path.join(SRC, "npcs")).filter(f => f.endsWith(".json") && !f.startsWith("_")).sort()) {
  const n = JSON.parse(fs.readFileSync(path.join(SRC, "npcs", f), "utf8"));
  console.log(`${n.name} (${n.system.role}, speed ${n.system.speed}):`, n.items.filter(i => i.type === "action" && !i.flags?.twod12?.basic).map(i => `${i.name} ${i.system.frequency}${i.system.reaction ? " reaction" : ""}`).join(", "));
}
// v0.0.184: a duplicate key stops the Foundry CLI's build of the pack (and of every pack after it): every key is unique, embedded Items too.
const dupes = [...new Set(docs.map(d => d.pack))].flatMap(p => { const keys = docs.filter(d => d.pack === p).flatMap(d => [d._key, ...(d.items ?? []).map(i => `!actors.items!${d._id}.${i._id}`)]); return keys.filter((k, i) => keys.indexOf(k) !== i).map(k => `${p} ${k}`); });
console.log("keys unique in each pack (embedded Items too):", dupes.length ? dupes.join(", ") : "yes");
console.log("NPC Speed as a rating:", fs.readdirSync(path.join(SRC, "npcs")).filter(f => f.endsWith(".json") && !f.startsWith("_")).map(f => { const n = JSON.parse(fs.readFileSync(path.join(SRC, "npcs", f), "utf8")); return `${n.name} ${n.system.ratings.speed}`; }).join(", "));
