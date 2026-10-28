// Run with: node tools/tests/run.mjs (or node tools/tests/t103.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
import fs from "node:fs";
// The Details tab of an Effect as sentences (v0.0.112): the sentence of each setting, the "In short" line, the chip rows, and the template hooks.
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
const F = await import(ROOT + "module/fxdetails.mjs");
const S = a => new Set(a), blank = { attrs: S(), all: S(), any: S(), none: S(), from: S(), tiers: S() };
const plain = h => h.replace(/<[^>]+>/g, "");
console.log("--- sentences");
const cases = [
  { type: "boonbane", boons: 1, banes: 0, all: S(["melee", "strike"]), none: S(["ranged"]) },
  { type: "boonbane", boons: 0, banes: 2, against: true, any: S(["body", "mind"]), byValue: true },
  { type: "damagestep", empowered: 2, all: S(["weapon"]) },
  { type: "boonbane", boons: 1, banes: 1, from: S(["magic"]) },
  { type: "damagestep", empowered: 1, enfeebled: 2 },
  { type: "damagestep" },
  { type: "boonbane", boons: 0, banes: 0 },
  { type: "bonusdamage", dmg: "1d4", dmgPool: "B", dmgSub: "Fi", tiers: S(["t2", "t3"]), all: S(["weapon"]) },
  { type: "bonusdamage", dmg: "", dmgPool: "", dmgSub: "", tiers: S(["t1", "t2", "t3"]) },
  { type: "grant", grantAction: "Weapon Attack", grantCount: 1, grantAp: 0, boons: 0 },
  { type: "grant", grantAction: "trait:strike", grantCount: 2, grantAp: 1, boons: 1, grantDistinct: true },
  { type: "speed", speedMode: "add", speedFormula: "2" },
  { type: "speed", speedMode: "override", speedFormula: "floor(speed/2)" },
  { type: "light", bright: 2, dim: 4 },
  { type: "note", title: "Watch the flank", attrs: S(["body", "instinct"]) },
  { type: "note", title: "" }
];
for (const c of cases) { const x = { ...blank, ...c }; console.log(x.type.padEnd(12), "|", plain(F.settingSentence(x)), "|", F.settingShort(x)); }
console.log("escapes names:", F.settingSentence({ ...blank, type: "grant", grantAction: "<b>x</b>", grantCount: 1, grantAp: 0 }).includes("&lt;b&gt;"));
console.log("--- the In short line");
const fx = { settings: [{ ...blank, ...cases[0] }, { ...blank, ...cases[9] }], conditions: [{ name: "Empowered", value: 1, valued: true }, { name: "Prone", value: 1, valued: false }], linked: "", duration: { type: "rounds", rounds: 2 }, expireOn: S(["magic"]), expireAll: false };
console.log(F.effectSummary(fx));
console.log(F.effectSummary({ settings: [], conditions: [], linked: "Hindered", duration: { type: "eot", rounds: 1 }, expireOn: S(["ranged", "strike"]), expireAll: true }));
console.log(F.effectSummary({ settings: [], conditions: [], linked: "", duration: { type: "", rounds: 1 }, expireOn: S(), expireAll: false }));
console.log("--- chip rows");
const x = { ...blank, ...cases[0] };
const rows = F.predRows(x);
console.log(rows.map(r => `${r.lead}: ${r.chips.map(c => `${c.label} ${c.color}`).join(", ") || "(empty)"} [${r.options.length} to add]`).join(" | "));
console.log("hidden:", F.hiddenPreds(x).map(h => h.label).join(", "), "| once Any of is opened:", F.predRows(x, S(["any"])).map(r => r.field).join(","), "/", F.hiddenPreds(x, S(["any"])).map(h => h.field).join(","));
console.log("bonus damage has no Saves against:", F.hiddenPreds({ ...blank }, S(), ["all", "any", "none"]).map(h => h.field).join(","));
console.log("--- the template");
const t = (fs.readFileSync(ROOT + "templates/item-sheet.hbs", "utf8") + fs.readFileSync(ROOT + "templates/parts/settings.hbs", "utf8") + fs.readFileSync(ROOT + "templates/parts/preds.hbs", "utf8")), sh = fs.readFileSync(ROOT + "module/item-sheet.mjs", "utf8");
for (const k of ["data-fxhelp", "data-fxkind", "data-fxself", "data-fxadd", "data-padd", "data-prem", "data-pshow", "data-eadd", "data-erem", "data-expireall", 'data-list="conditions"', 'name="system.duration.type"', 'name="system.linked"', 'name="system.valued"', "fxd-help"])
  console.log(k.padEnd(26), "template:", t.includes(k), "| sheet listens:", k.startsWith("data-") && !k.includes("=") ? sh.includes(`[${k}]`) : "-");
console.log("no old 88-checkbox predicate grid:", !t.includes("Predicate: applies to rolls whose traits match"), "| no old Add setting button:", !t.includes('id="add-setting"'));
console.log("help setting registered:", fs.readFileSync(ROOT + "module/twod12.mjs", "utf8").includes('"effectHelp"'));
console.log("--- v0.0.115: every roll");
const ev = { ...blank, type: "boonbane", boons: 1 };
console.log(plain(F.settingSentence(ev)), "|", F.settingShort(ev), "|", plain(F.settingSentence({ ...ev, against: true })), "|", F.settingShort({ ...ev, against: true }));
console.log(plain(F.settingSentence({ ...blank, type: "damagestep", empowered: 1 })), "|", plain(F.settingSentence({ ...blank, type: "damagestep", enfeebled: 2, all: S(["melee"]) })));
const er = F.predRows(ev); console.log("the chip:", JSON.stringify(er[0].every), "| goes once a trait is there:", JSON.stringify(F.predRows({ ...ev, none: S(["ranged"]) })[0].every), "| bonus damage:", JSON.stringify(F.predRows({ ...blank, type: "bonusdamage" }, S(), ["all", "any", "none"], "any action")[0].every));
console.log("template shows it:", t.includes("{{#if every}}"), "| no boons, no damage:", F.settingShort({ ...blank, type: "boonbane" }));

console.log("--- v0.0.126: Empowered and Enfeebled are their own setting; migration of old settings");
const M = await import(ROOT + "module/settingsmigrate.mjs");
const old = { settings: [
  { type: "boonbane", boons: 1, banes: 0, empowered: 1, enfeebled: 0, all: ["melee", "weapon"], any: [], none: [] },
  { type: "boonbane", boons: 0, banes: 0, empowered: 0, enfeebled: 2, all: [], any: [], none: [] },
  { type: "boonbane", boons: 2, banes: 0, empowered: 0, enfeebled: 0, against: true, all: ["melee"], any: [], none: [] },
  { type: "boonbane", boons: 0, banes: 1, empowered: 3, against: true, all: [], any: [], none: [] },
  { type: "speed", speedFormula: "2" }], passiveEscalation: 2 };
const mig = M.migrateSettings(JSON.parse(JSON.stringify(old)));
console.log(mig.settings.map(x => `${x.type}${x.type === "boonbane" ? ` ${x.boons}b/${x.banes}n E${x.empowered}${x.against ? " against" : ""}` : x.type === "damagestep" ? ` E${x.empowered}/F${x.enfeebled} all=${x.all}` : ""} min=${x.minEscalation}`).join(" | "));
console.log("running it again changes nothing:", JSON.stringify(M.migrateSettings(JSON.parse(JSON.stringify(mig)))) === JSON.stringify(mig), "| a setting already saved \"always\" keeps it:", M.migrateSettings({ settings: [{ type: "note", minEscalation: 0 }], passiveEscalation: 2 }).settings[0].minEscalation);
const AF = await import(ROOT + "module/appliedflags.mjs");
const fl = AF.appliedFlags({ settings: mig.settings.slice(0, 2).map(x => ({ ...blank, ...x, all: S(x.all), any: S(x.any), none: S(x.none) })), description: "", expireOn: S([]), expireAll: false }, {});
console.log("applied (the same flags the rolls read):", JSON.stringify(fl.modifiers.map(m => [m.boons, m.banes, m.empowered, m.enfeebled, m.all.join("+")])));
const sheet = fs.readFileSync(ROOT + "module/item-sheet.mjs", "utf8");
const stl = fs.readFileSync(ROOT + "templates/parts/settings.hbs", "utf8");
console.log("the editor: its own setting type:", stl.includes("{{#if isDamageStep}}") && sheet.includes("isDamageStep:"), "| no Empowered inputs under Boons and Banes:", stl.indexOf('data-field="empowered"') > stl.indexOf("{{#if isDamageStep}}"));
