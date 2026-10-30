// Run with: node tools/tests/run.mjs (or node tools/tests/t131.mjs)
// v0.0.156 (the Archer, pass 1; v0.0.181: the A1 Archer of the book): Projectile and Shot, the class and its cards from the book, Bow Mastery, the Techniques option in the Mastery tab.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry ??= { utils: {} };
const G = await import(ROOTURL + "module/config.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const get = n => C.docs.find(d => d.name === n);
console.log("Projectile is a weapon property:", G.TWOD12.weaponTraits.projectile, "| Shot and Save are Action traits:", G.TWOD12.traits.shot, G.TWOD12.traits.save, "| Crossbow:", [...get("Crossbow").system.traits].sort().join(", "));
const cls = get("Archer").system;
console.log("Archer:", `Body x${cls.bodyMult}, Mind x${cls.mindMult}, Rally +${cls.rallyMod}, Speed +${cls.speedMod}, ${cls.armorTraining} armor`, "| features:", cls.features.map(f => C.docs.find(d => d.type === "feature" && C.uuidOf("features", d.name) === f.uuid)?.name ?? "?").join(", "));
// v0.0.181 (A1): the book's Archer: the A1 cards, the level list in today's structure, the old cards kept in a folder of their own.
const cards = ["Double Shot", "Rolling Shot", "Marksman's Shot", "Hunter's Focus", "Pinning Shot", "Precise Aim", "Quick Draw", "Wing Clip", "True Shot", "Suppressing Fire", "Volley", "Covering Fire", "Rain of Arrows", "Deadeye", "Steady Aim", "Vanish", "Twin Shot", "Perfect Shot"];
console.log("cards:", cards.filter(n => !get(n)).length ? "MISSING " + cards.filter(n => !get(n)).join(", ") : `all ${cards.length}`, "| features:", ["Sharpshooter", "Marked Quarry", "Elusive", "Killer's Focus", "Bow Mastery", "Long Draw", "Patient Hunter", "Steady Nerves"].every(n => get(n)?.type === "feature"), "| Field Training gone:", !get("Field Training"));
console.log("old cards' folder:", cards.slice(5).every(n => get(n).folder === "Archer (old cards)") && ["Bow Mastery", "Long Draw", "Patient Hunter", "Steady Nerves"].every(n => get(n).folder === "Archer (old cards)"), "| A1 cards in it:", cards.slice(0, 5).filter(n => get(n).folder === "Archer (old cards)").join(", ") || "none");
const row = n => { const s = get(n).system; return `${n}: ${s.frequency} | ${[...s.traits].join(",")} | ${G.vsText({ ...s, traits: new Set(s.traits) }) || "-"}${s.escalation ? ` | ${s.escalation} Esc.` : ""}${s.reaction ? ` | ${s.reactionKind}` : ""}`; };
for (const n of ["Double Shot", "Rolling Shot", "Marksman's Shot", "Pinning Shot", "Lock & Loose"]) console.log("  " + row(n));
const tiers = n => get(n).system.versions.map(v => v.noTiers ? `${v.ap}AP: ${v.effects.replace(/<[^>]+>/g, "").slice(0, 120)}${v.fx.all.length ? ` [${v.fx.all.length} effect]` : ""}` : `${v.ap}AP: ` + [1, 2, 3].map(k => v["t" + k].map(i => (i.useW ? "1[W]" : "") + (i.dice ? `${i.dice}${i.subtype ? " " + i.subtype : ""}` : "")).join("+") + (v["x" + k] ? ` "${v["x" + k].replace(/<[^>]+>/g, "")}"` : "")).join(" / ")).join(" || ");
for (const n of ["Double Shot", "Rolling Shot", "Marksman's Shot"]) console.log("  " + n + " -> " + tiers(n));
const rs = get("Rolling Shot (+2d6 Pi)").system.settings[0];
console.log("Rolling Shot 3 AP's extra:", rs.type, rs.dmg, rs.dmgPool, rs.dmgSub, rs.tiers.join(","), "| ends after:", get("Rolling Shot (+2d6 Pi)").system.expireOn.join(","));
const strip = h => String(h).replace(/<[^>]+>/g, "");
console.log("Sharpshooter:", strip(get("Sharpshooter").system.description), "| no Actions:", !(get("Sharpshooter").system.actions ?? []).length);
console.log("Marked Quarry:", strip(get("Marked Quarry").system.description));
console.log("Elusive:", get("Elusive").system.category, "|", strip(get("Elusive").system.description));
const nm = u => C.docs.find(d => C.uuidOf(d.type === "action" ? "actions" : "features", d.name) === u)?.name ?? "?";
// v0.0.185 (pack C2): the Archer's levels as sections.
const archer = get("Archer").system;
archer.levels.forEach((l, i) => console.log(`Level ${i + 1}:`, l.sections.map(x => `${x.title} (${x.kind}${x.kind === "repertoire" ? ` ${x.freq}` : ""}${x.mode === "granted" && x.kind === "items" ? " granted" : ""})${x.items.length ? `: ${x.items.map(nm).join(", ")}` : ""}`).join(" | ")));
console.log("Repertoire:", archer.repertoire.map(nm).join(", "), "| Escalation:", archer.escPassives.map(nm).join(", "), "/", archer.escActives.map(nm).join(", "));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), main = src("module/twod12.mjs"), tpl = src("templates/actor-sheet.hbs"), m = src("module/mastery.mjs");
console.log("Shot needs a Projectile weapon:", act.includes('is a Shot: it needs a wielded Projectile weapon'), "| a Weapon Action with one is a Shot:", act.includes('hasProp(previewWeapon, "projectile") ? ["shot"] : []'), "| old ranged weapons get Projectile once:", main.includes('"projectileApplied"'));
console.log("Mastery tab: Techniques option", tpl.includes("Only show usable Techniques in the Actions table") && !tpl.includes("Only usable Techniques</label>"), "| Bow Mastery choice (Sharpshooter gives it)", tpl.includes('data-action="chooseBowMastery"') && m.includes("export async function chooseBowMastery") && m.includes('["Sharpshooter", "Bow Mastery"].includes(x.name)'), "| tab for every character", tpl.includes("{{#if showMastery}}<a class=\"tabbtn\""));
