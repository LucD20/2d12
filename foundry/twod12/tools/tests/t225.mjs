// Run with: node tools/tests/run.mjs (or node tools/tests/t225.mjs)
// v0.0.327 PACK ZONE (Lucas's design: foundry/mockups/zone-prototype.html, option A; the brief's "Zone (placed on the map)" section): the shared
// "what it does inside" rows (Aura and Zone), the Zone's sentence and Ends, Who resolution, the old Zone and the old Aura migrated, the Hazard's
// turn-cycle limit, the preview's footprints, the view, and Consecrated Ground (its real card) after the migration.
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} };
const R = await import(ROOTURL + "module/fxrules.mjs");
const V = await import(ROOTURL + "module/fxsheet.mjs");
const { migrateZone } = await import(ROOTURL + "module/settingsmigrate.mjs");
const say = (z, ctx = {}) => R.plainText(R.zoneSentence(z, { originName: "Nari", ...ctx }));
const row = o => R.insideDefault(o);

console.log("--- each row alone, every Who and self");
for (const who of ["allies", "enemies", "all"]) for (const self of [false, true]) {
  console.log(`${who}${self ? " + self" : ""}:`, R.insideSentences(row({ carry: { on: true, who, self, fx: "X" } }), { originName: "Nari", names: { X: "Consecrated" } }).map(R.plainText).join(" "),
    "|", R.insideSentences(row({ heal: { on: true, who, self, formula: "1d4" } }), { originName: "Nari" }).map(R.plainText).join(" "),
    "|", R.insideSentences(row({ diff: { on: true, who, self } }), { originName: "Nari" }).map(R.plainText).join(" "));
}
console.log(R.insideSentences(row({ ht: { on: true, who: "all", list: [{ dice: "1d8", pool: "B", sub: "Fi" }, { dice: "1d4", pool: "M", sub: "Ps" }], gives: { on: true, fx: "B" } } }), { originName: "Nari", names: { B: "Burning" } }).map(R.plainText).join(" "));
console.log(R.insideSentences(row({ ht: { on: true, who: "enemies", self: true, movement: true, entering: false, turn: false } }), { originName: "Nari" }).map(R.plainText).join(" "));
console.log("summaries:", ["carry", "heal", "ht", "diff"].map(k => R.insideSummary(row({ carry: { on: true, who: "enemies", fx: "X" }, heal: { on: true }, ht: { on: true, list: [{ dice: "1d8", sub: "Fi" }] }, diff: { on: true, who: "enemies" } }), k, { names: { X: "Consecrated" } })).join(" | "), "| off:", R.insideSummary(row(), "carry"));
console.log("averages: 1d4", R.diceAvg("1d4"), "| 2d6 + 1", R.diceAvg("2d6 + 1"), "| 1d4 + @origin.pow", R.diceAvg("1d4 + @origin.pow"));

console.log("--- the Zone's sentence and Ends (the book's Chapter 3 fire example; Consecrated Ground's real card)");
const fire = { src: "here", shape: "emanation", size: "2", inside: row({ ht: { on: true, who: "all", self: true, list: [{ dice: "1d8", pool: "B", sub: "Fi" }] } }) };
console.log(say(fire), R.zoneEndsSentence({ time: { on: true, rounds: 2 } }, { originName: "Drak" }));
const cg = { src: "action", inside: row({ carry: { on: true, who: "enemies", fx: "C" }, heal: { on: true, who: "allies", self: false, formula: "1d4" } }) };   // as migrated: "And the origin" off
console.log(say(cg, { names: { C: "Consecrated Ground (1 Bane)" }, action: { area: "2 / 3 Emanation" } }), R.zoneEndsSentence({ time: { on: true, rounds: 3 } }, { originName: "Nari" }));
console.log([["burst", "2"], ["line", "4"], ["emanation", "@origin.pow"]].map(([shape, size]) => R.zoneAreaText({ src: "here", shape, size })).join(" | "));
for (const e of [{}, { time: { on: true, mode: "encounter" } }, { down: { on: true } }, { someone: { on: true } }, { someone: { on: true, who: "reach", ap: 2 } }, { time: { on: true, rounds: 1 }, down: { on: true }, someone: { on: true } }])
  console.log(R.zoneEndsSentence(e, { originName: "Nari" }));

console.log("--- Who resolution (a neutral counts as an enemy; the origin only through self)");
const r0 = { on: true, who: "allies", self: false };
console.log(["ally", "enemy", "neutral", "origin"].map(k => `${k}: ${["allies", "enemies", "all"].map(who => `${who} ${R.rowReaches({ ...r0, who }, { originDisposition: 1, disposition: { ally: 1, enemy: -1, neutral: 0, origin: 1 }[k], isOrigin: k === "origin" })}`).join(", ")}`).join(" | "));
console.log("the origin with self:", R.rowReaches({ ...r0, self: true }, { isOrigin: true }), "| a row that is off:", R.rowReaches({ ...r0, on: false }, { disposition: 1 }));

console.log("--- migration: the old Zone, the old Aura; twice");
const oldZone = { rules: [{ id: "a", kind: "zone", setting: { type: "zone", zoneWho: "enemies", fxUuid: "C" } }, { id: "b", kind: "zone", setting: { type: "zone", zoneWho: "allies", zoneHeal: "1d4" } }, { id: "c", kind: "light" }] };
const once = migrateZone(JSON.parse(JSON.stringify(oldZone))), twice = migrateZone(JSON.parse(JSON.stringify(once)));
console.log("where:", once.where, "| carry:", JSON.stringify(once.zone.inside.carry), "| heal:", JSON.stringify(once.zone.inside.heal), "| rules left:", once.rules.map(r => r.kind).join(","), "| idempotent:", JSON.stringify(once) === JSON.stringify(twice));
const fromSettings = R.liftZone({ rules: R.migrate({ settings: [{ type: "zone", zoneWho: "allies", zoneHeal: "1d4 + 1" }] }).rules });
console.log("from the old settings:", fromSettings.where, JSON.stringify(fromSettings.zone.inside.heal));
const oldAura = R.normRule({ kind: "aura", size: "2", aff: "allies", self: true, carry: { on: true, fx: "W" } });
console.log("an old Aura's Affects -> its Carries row:", JSON.stringify(oldAura.inside.carry), "| no old fields:", !("aff" in oldAura) && !("carry" in oldAura), "| twice:", JSON.stringify(R.normRule(oldAura)) === JSON.stringify(oldAura));
const compiled = R.compile([oldAura], {}).settings[0];
console.log("the Aura compiles to its Carries (auraWho, auraSelf, fxUuid) and its rows:", compiled.auraWho, compiled.auraSelf, compiled.fxUuid, !!compiled.areaRows, "| read back:", JSON.stringify(R.migrate({ settings: [compiled] }).rules[0].inside.carry));
const { zoneRows } = R;
console.log("a placed Zone of v0.0.261 (flags rules) read as rows:", zoneRows ? JSON.stringify(zoneRows({ rules: [{ who: "enemies", fxUuid: "C", heal: "" }, { who: "allies", fxUuid: "", heal: "1d4" }] }).heal) : "(areafx.mjs needs Foundry)");

console.log("--- Hazard: Entering and Turn share one hit per turn-cycle; Movement each time");
const { htMayHit, entered } = R;
if (htMayHit) {
  console.log("entering, hit this cycle:", htMayHit("entering", [2, 1], { round: 2, turn: 3, own: 1 }), "| turn after an entering hit this cycle:", htMayHit("turn", [2, 1], { round: 2, turn: 1, own: 1 }), "| next cycle:", htMayHit("turn", [2, 1], { round: 3, turn: 1, own: 1 }), "| movement:", htMayHit("movement", [2, 1], { round: 2, turn: 1, own: 1 }));
  console.log("entered:", JSON.stringify(entered(new Set(["a"]), new Set(["a", "b"]))));
} else console.log("(areafx.mjs needs Foundry)");
console.log("patterns: none ticked", R.htPatterns({}).join("+"), "| movement only", R.htPatterns({ movement: true }).join("+"));

console.log("--- the preview's footprints (Set here)");
console.log("Emanation 1, 2:", R.previewCells("emanation", 1).cells.size, R.previewCells("emanation", 2).cells.size, "| Burst 1, 2:", R.previewCells("burst", 1).cells.size, R.previewCells("burst", 2).cells.size, "| Line 4:", R.previewCells("line", 4).cells.size);

console.log("--- the view");
const m = { host: "effect", name: "Consecrated Ground", rules: [R.defaultRule("light")], where: "map", originName: "Nari", canPlace: true, zone: cg, ends: { time: { on: true, rounds: 3 } },
  zoneAction: { name: "Consecrated Ground", cost: "2/3 AP", freq: "Daily", area: "2 / 3 Emanation", dist: "10 sq." }, items: { C: { name: "Consecrated Ground (1 Bane)", type: "effect" } } };
const h = V.fxTabHtml(m), hc = V.fxTabHtml({ ...m, where: "creature" });
console.log("on the map: the sections:", ["Where it is", "The area", "What it does inside", "On the map", "Ends"].every(t => h.includes(`<h3>${t}`)), "| no rule list:", !h.includes("fr-md"), "| the Action's card:", /Area: 2 \/ 3 Emanation · Distance: 10 sq\./.test(h));
console.log("the Zone's Ends: A Save and They use an Action greyed:", (h.match(/fr-part off dis/g) ?? []).length === 2, "| Someone uses an Action:", h.includes('data-f="ends.someone.on"'), "| no EoT:", !h.includes('data-v="eot"'));
console.log("the tip:", /<b>Consecrated Ground<\/b> 2 \/ 3 Emanation\. Enemies inside gain Consecrated Ground \(1 Bane\)\. Allies inside heal 1d4 at the start of each of their turns\. Lasts 3 rounds\./.test(h));
console.log("on a creature: the rule list, and the Zone's settings kept:", hc.includes("fr-md") && !hc.includes("<h3>The area"), "| Set here has the preview and Place on the map:", /fr-zpv/.test(V.fxTabHtml({ ...m, zone: { ...cg, src: "here" } })) && /data-fr="placeZone"/.test(V.fxTabHtml({ ...m, zone: { ...cg, src: "here" } })));
const aura = V.fxTabHtml({ host: "effect", name: "Beacon", rules: [oldAura], sel: oldAura.id });
console.log("the Aura pane: the four rows, each with its Who and 'And this creature itself':", ["carry", "heal", "ht", "diff"].every(k => aura.includes(`data-f="inside.${k}.who"`)), aura.includes("And this creature itself"));
const up = V.saveUpdate([], { time: { on: true, rounds: 3 } }, "effect", { C: "Consecrated Ground (1 Bane)" }, cg, "map", { area: "2 / 3 Emanation" });
console.log("a save writes the Zone and its hover text:", !!up["system.zone"], "|", up["system.autoHover"]);
