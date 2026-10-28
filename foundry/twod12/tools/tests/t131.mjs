// Run with: node tools/tests/run.mjs (or node tools/tests/t131.mjs)
// v0.0.156 (the Archer, pass 1): Projectile and Shot, the class and its cards from the book, Bow Mastery, the Techniques option in the Mastery tab.
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
globalThis.foundry ??= { utils: {} };
const G = await import(ROOT + "module/config.mjs");
const C = await import(ROOT + "tools/content.mjs");
const get = n => C.docs.find(d => d.name === n);
console.log("Projectile is a weapon property:", G.TWOD12.weaponTraits.projectile, "| Shot and Save are Action traits:", G.TWOD12.traits.shot, G.TWOD12.traits.save, "| Crossbow:", [...get("Crossbow").system.traits].sort().join(", "));
const cls = get("Archer").system;
console.log("Archer:", `Body x${cls.bodyMult}, Mind x${cls.mindMult}, Rally +${cls.rallyMod}, Speed +${cls.speedMod}, ${cls.armorTraining} armor`, "| features:", cls.features.map(f => C.docs.find(d => d.type === "feature" && C.uuidOf("features", d.name) === f.uuid)?.name ?? "?").join(", "));
const cards = ["Double Shot", "Precise Aim", "Quick Draw", "Rolling Shot", "Wing Clip", "True Shot", "Suppressing Fire", "Volley", "Marksman's Shot", "Covering Fire", "Rain of Arrows", "Hunter's Focus", "Deadeye", "Steady Aim", "Vanish", "Pinning Shot", "Twin Shot", "Perfect Shot"];
console.log("cards:", cards.filter(n => !get(n)).length ? "MISSING " + cards.filter(n => !get(n)).join(", ") : `all ${cards.length}`, "| features:", ["Sharpshooter", "Marked Quarry", "Bow Mastery", "Long Draw", "Patient Hunter", "Steady Nerves", "Killer's Focus"].every(n => get(n)?.type === "feature"), "| Field Training gone:", !get("Field Training"));
const row = n => { const s = get(n).system; return `${n}: ${s.frequency} | ${[...s.traits].join(",")} | ${G.vsText({ ...s, traits: new Set(s.traits) }) || "-"}${s.escalation ? ` | ${s.escalation} Esc.` : ""}${s.reaction ? ` | ${s.reactionKind}` : ""}`; };
for (const n of ["Wing Clip", "Deadeye", "Quick Draw", "Volley", "Covering Fire", "Rain of Arrows", "Twin Shot"]) console.log("  " + row(n));
const tiers = n => get(n).system.versions.map(v => v.noTiers ? `${v.ap}AP: ${v.effects.replace(/<[^>]+>/g, "").slice(0, 90)}` : `${v.ap}AP: ` + [1, 2, 3].map(k => v["t" + k].map(i => (i.useW ? "1[W]" : "") + (i.dice ? `${i.dice}${i.subtype ? " " + i.subtype : ""}` : "")).join("+") + (v["x" + k] ? ` "${v["x" + k].replace(/<[^>]+>/g, "")}"` : "")).join(" / ")).join(" || ");
for (const n of ["Wing Clip", "Marksman's Shot", "Deadeye", "Rolling Shot", "Volley"]) console.log("  " + n + " -> " + tiers(n));
console.log("areas: Covering Fire", JSON.stringify(get("Covering Fire").system.areaCfg), "| Rain of Arrows ht:", get("Rain of Arrows").system.areaCfg.ht);
console.log("picks:", ["Archer Encounter Pick", "Archer Daily Pick", "Archer Free Picks", "Archer Escalation Passive", "Archer Escalation Actives"].map(n => `${n.replace("Archer ", "")} ${get(n).system.choiceCount} of ${get(n).system.choiceOptions.length}`).join(" | "));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const act = src("module/actions.mjs"), main = src("module/twod12.mjs"), tpl = src("templates/actor-sheet.hbs"), m = src("module/mastery.mjs");
console.log("Shot needs a Projectile weapon:", act.includes('is a Shot: it needs a wielded Projectile weapon'), "| a Weapon Action with one is a Shot:", act.includes('hasProp(previewWeapon, "projectile") ? ["shot"] : []'), "| old ranged weapons get Projectile once:", main.includes('"projectileApplied"'));
console.log("Mastery tab: Techniques option", tpl.includes("Only show usable Techniques in the Actions table") && !tpl.includes("Only usable Techniques</label>"), "| Bow Mastery choice", tpl.includes('data-action="chooseBowMastery"') && m.includes("export async function chooseBowMastery"), "| tab for every character", tpl.includes("{{#if showMastery}}<a class=\"tabbtn\""));
