// Run with: node tools/tests/run.mjs (or node tools/tests/t224.mjs)
// v0.0.323 PACK EFFECT-SHEET (Lucas's design, foundry/mockups/effect-sheet-brief.md, section 9): the rules model (module/fxrules.mjs), the view
// (module/fxsheet.mjs), and what the readers learned. The brief's sentences word for word; every old setting of the packs migrated, compiled
// back, and read the same by appliedFlags; the Action filter (Chapter 1's roll kinds); formulas; "Next one only"; named bonuses; "Increase by";
// the Movement limit; the hover card's merged limits and the Ends sentence.
import fs from "node:fs";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = new URL("../../", import.meta.url).pathname;
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {}, once() {} };
const R = await import(ROOTURL + "module/fxrules.mjs");
const V = await import(ROOTURL + "module/fxsheet.mjs");
const { appliedFlags } = await import(ROOTURL + "module/appliedflags.mjs");
const { topStep } = await import(ROOTURL + "module/calc.mjs");
const { tally } = await import(ROOTURL + "module/rolldlg.mjs");
const say = (r, ctx = {}) => R.plainText(R.sentence(r, { originName: "Ogre Chieftain", ...ctx }));
const D = R.defaultRule;

console.log("--- 5.1 On matching Actions (the brief's examples)");
console.log(say(D("act", { sees: true, bb: { on: true, banes: 1 } })));
console.log(say(D("act", { vs: "marked", filter: { all: ["strike"] }, uses: "next", bb: { on: true, boons: 1 }, emp: { on: true, mode: "inc", emp: 1 } })));
console.log(say(D("act", { filter: { all: ["strike"] }, uses: "round", dmg: { on: true, list: [{ dice: "1d6", pool: "B", sub: "Ho", tiers: [2, 3] }, { dice: "1d4", pool: "M", sub: "Ps", tiers: [3], fx: "F" }] } }), { names: { F: "Frightened" } }));
console.log(say(D("act", { filter: { all: ["shot"] }, ign: { on: true, low: true, range: "one" } })));
console.log(say(D("act", { filter: { all: ["body"] }, note: { on: true, title: "Brute Force", text: "x" } })));
console.log(say(D("act", { dir: "against", vs: "notorigin", bb: { on: true, banes: 1 } })), "|", say(D("act", { bb: { on: true, boons: 5 } })), "|", say(D("act")));
console.log("filter in the book's notation:", [{ all: ["melee", "strike"], not: ["divine"] }, { all: ["strike"], any: ["melee", "ranged"], not: ["fear"] }, {}].map(f => R.filterText(f) || "any Action").join(" | "));
console.log("list labels:", ["act", "grant", "aura", "light", "move", "weap", "esc", "uses"].map(k => R.ruleLabel(D(k))).join(" | "));
console.log("part summaries:", R.partSummary(D("act", { bb: { on: true, boons: 1 } }), "bb"), "|", R.partSummary(D("act", { bb: { on: false } }), "bb"), "|", R.partSummary(D("act", { ign: { on: true, low: true, range: "one" } }), "ign"));

console.log("--- 5.2 to 5.8");
const val = o => say(D("value", o));
console.log([val({ name: "support" }), val({ which: "ward", mode: "inc" }), val({ stat: "speed", mode: "set", val: "4" }), val({ stat: "speed", val: "2" }), val({ stat: "rally" }), val({ stat: "resist", rw: "immune", rwSub: "Fi" })].join("\n"));
const names = { S: "Sickened", Z: "Radiant Zeal", B: "Beacon's Step", W: "Weapon Attack", M: "Mark Quarry", BW: "Beacon's Ward" };
const g = o => say(D("grant", o), { names });
console.log([g({ item: "S", itemType: "effect", valued: true, val: 1 }), g({ item: "Z", itemType: "effect", when: "turn" }), g({ item: "S", itemType: "effect", valued: true, when: "damage", pool: "B" }),
  g({ item: "B", itemType: "action" }), g({ item: "W", itemType: "action", amode: "uses", riders: [{ tiers: [3], does: "half" }] }), g({ item: "M", itemType: "action", when: "enc", amode: "uses", msg: { on: true, text: "Choose a creature to mark." } })].join("\n"));
console.log([say(D("weap")), say(D("weap", { mode: "mastery" })), say(D("esc")), say(D("uses", { which: "encounter" })), say(D("aura", { carry: { on: true, fx: "BW" } }), { names }), say(D("aura", { size: "@origin.pow", carry: { on: true, fx: "BW" } }), { names }), say(D("light")), say(D("move", { sees: true }))].join("\n"));

console.log("--- the hover card: shared limits merged, then the rest; Ends");
const fr = [D("act", { sees: true, bb: { on: true, banes: 1 } }), D("move", { sees: true })];
console.log(R.hoverCardText(fr, { time: { on: true, mode: "rounds", rounds: 1 }, save: { on: true, attr: "appeal" }, down: { on: true } }, { originName: "Ogre Chieftain" }));
console.log(R.hoverCardText([...fr, D("act"), D("light")], {}, { originName: "Ogre Chieftain" }), "(the empty rule is left out)");
for (const e of [{}, { time: { on: true, mode: "eot" } }, { time: { on: true, mode: "encounter" } }, { save: { on: true, attr: "instinct", when: "interact", dc: "set", dcValue: 15 } }, { save: { on: true, attr: "mindappeal", dc: "origin" } }, { action: { on: true, filter: { all: ["strike"] } } }, { down: { on: true }, action: { on: true, filter: {} } }])
  console.log(R.endsSentence(e, { originName: "Ogre Chieftain" }), "|", JSON.stringify(R.endsSummaries(e, { originName: "Ogre Chieftain" })));

console.log("--- migration: every Effect, Feature and Talent of the packs, old settings -> rules -> settings, read the same (appliedFlags)");
const items = [];
const walk = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (f.isDirectory()) walk(`${d}/${f.name}`); else if (f.name.endsWith(".json")) { const j = JSON.parse(fs.readFileSync(`${d}/${f.name}`, "utf8")); items.push(j); for (const it of j.items ?? []) items.push(it); } } };
walk(ROOT + "packs/_source");
const NEW = ["ruleId", "spend", "seen", "empMode", "defMode", "defName", "sizeFormula", "trigPool", "auraShow", "rangeAll", "mode", "name", "formula", "show", "pool", "rows", "areaRows"];
const sortK = v => (Array.isArray(v) ? v.map(sortK) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().filter(k => !NEW.includes(k) && v[k] !== "" && v[k] !== undefined && v[k] !== false && !(Array.isArray(v[k]) && !v[k].length)).map(k => [k, sortK(v[k])])) : v);
const asSys = s => ({ ...s, expireOn: new Set(s.expireOn ?? []), settings: (s.settings ?? []).map(x => ({ ...R.blankSetting(x.type), ...x })) });
const SAME = new Set(["Sickened"]);   // its Attributes move to "Has one of": the same Rolls
let n = 0; const differ = [], seen = new Set(), notes = [];
for (const it of items) {
  if (!["effect", "feature", "talent"].includes(it.type) || !it.system) continue;
  const key = `${it.type}|${it.name}`; if (seen.has(key)) continue; seen.add(key);
  const s = { ...it.system, rules: undefined, rulesOn: false };
  if (!(s.settings?.length || s.conditions?.length || s.linked || s.whileSeen || s.noReactions || s.loseAp || s.endsWithOrigin || s.duration?.type || s.expireOn?.length)) continue;
  n++;
  const m = R.migrate(s, it.type), c = R.compile(m.rules, m.ends, it.type);
  notes.push(...m.notes.map(x => `${it.name}: ${x}`));
  const a = sortK(appliedFlags(asSys(s), {})), b = sortK(appliedFlags(asSys({ ...s, ...c }), {}));
  for (const k of ["source", "hover", "spendable", "spent", "moveLimits"]) { delete a[k]; delete b[k]; }
  const same = JSON.stringify(a) === JSON.stringify(b) && ["whileSeen", "noReactions", "loseAp", "endsWithOrigin"].every(k => !!s[k] === !!c[k])
    && JSON.stringify((s.conditions ?? []).map(x => [x.uuid, x.value, x.mode || "set"])) === JSON.stringify(c.conditions.map(x => [x.uuid, x.value, x.mode]))
    && (s.duration?.type || "") === c.duration.type && String(s.linked ?? "") === c.linked;
  if (!same && !SAME.has(it.name)) differ.push(it.name);
}
console.log(`${n} items migrated; differ: ${differ.join(", ") || "none"}; notes: ${notes.join(" / ") || "none"}`);
const old = s => R.migrate(s, "effect").rules.map(r => `${r.kind}${r.kind === "act" ? `[${["bb", "emp", "dmg", "ign", "note"].filter(k => r[k].on).join("+")}]` : ""}`).join(", ");
console.log("one per old block:", [
  ["Boons and Banes vs marked, first each round", { settings: [{ type: "boonbane", boons: 1, all: ["strike"], vsMarked: true, oncePerRound: true }] }],
  ["Empowered and Enfeebled", { settings: [{ type: "damagestep", empowered: 1, all: ["melee"] }] }],
  ["Bonus damage + effect", { settings: [{ type: "bonusdamage", dmg: "1d6", dmgSub: "Ho", tiers: ["t2", "t3"], fxUuid: "X" }] }],
  ["Ignore a Bane, cover", { settings: [{ type: "ignore", ignoreRule: "engagedSelf" }, { type: "cover", coverLevels: ["low"] }] }],
  ["Note", { settings: [{ type: "note", title: "T", attrs: ["body"] }] }],
  ["Defense, Speed, Rally", { settings: [{ type: "defense", defKind: "ward", defValue: 1 }, { type: "speed", speedMode: "add", speedFormula: "2" }, { type: "rally", rallyBonus: "power + 2", rallyRange: 0 }] }],
  ["Conditions, linked", { conditions: [{ uuid: "U", name: "Hindered", value: 1 }], linked: "Immobilized" }],
  ["Grants: inline, use, on damage, each turn, message", { settings: [{ type: "inline", inlineAction: "Beacon's Step" }, { type: "grant", grantAction: "Weapon Attack", grantOn: "t3", grantDo: "half" }, { type: "ondamage", trigSub: "Ho", fxUuid: "E" }, { type: "turnstart", fxUuid: "E" }, { type: "message", msgWhen: "encounter", msgAction: "Mark Quarry", text: "t" }] }],
  ["Weapons, Escalation, Aura, Light, Zone, Bleed, Resist, More uses", { settings: [{ type: "weaponprop" }, { type: "mastery" }, { type: "eschook" }, { type: "aura", auraSize: 2, fxUuid: "E" }, { type: "light", bright: 1, dim: 3 }, { type: "zone" }, { type: "bleed", dmg: "1" }, { type: "resist", dmgSub: "Fi", rwValue: 2 }, { type: "freqmore" }] }],
  ["Rules: No Reactions, Loses AP", { noReactions: true, loseAp: true }]
].map(([l, s]) => `\n  ${l}: ${old(s)}`).join(""));
const lightM = R.migrate({ settings: [{ type: "light", bright: 1, dim: 3 }] }).rules[0];
console.log("Light: old dim 3 (from the token) is 2 squares beyond the Bright light:", lightM.dim, "| compiled back:", R.compile([lightM], {}).settings[0].dim);
const ends = R.migrate({ duration: { type: "rounds", rounds: 2 }, expireOn: ["strike"], endsWithOrigin: true }).ends;
console.log("Ends from the old fields:", JSON.stringify({ time: ends.time, down: ends.down.on, action: ends.action }), "->", JSON.stringify(R.compile([], ends)));

console.log("--- the Action filter (Chapter 1: an Attribute's Rolls are its Checks, Saves and Attribute Actions; Save and Check by roll kind)");
const roll = (...k) => new Set(k);
const rolls = { "Body Check": roll("body", "__check"), "Body Save": roll("body", "__save"), "Body Action (Shove)": roll("body", "handle", "strike", "__action", "__attr", "__attack"), "Weapon Strike (no Attribute: pack MOD)": roll("weapon", "strike", "melee", "__action", "__attack"), "Mind Save": roll("mind", "__save") };
for (const [label, f] of [["[Body]", { all: ["body"] }], ["[Save]", { all: ["__save"] }], ["[Check]", { all: ["__check"] }], ["[Body, Save]", { all: ["body", "__save"] }], ["one of [Body] or [Mind], not [Strike]", { any: ["body", "mind"], not: ["strike"] }], ["[Attack]", { all: ["__attack"] }]])
  console.log(label.padEnd(36), Object.entries(rolls).map(([k, t]) => `${k}: ${R.filterMatches(f, t) ? "yes" : "no"}`).join(" | "));
console.log("the picker's Roll group:", R.filterGroups().find(x => x.key === "roll").traits.map(R.traitLabel).join(", "));

console.log("--- formulas");
const vals = { origin: { pow: 3, body: 2 }, target: { pow: 1, body: 5 } };
for (const f of ["@origin.pow + 2", "floor(@target.body / 2)", "ceil(@target.body ÷ 2) × 2", "2", "", "@origin.pow + banana", "@origin.luck", "1d6 + 2"]) console.log(JSON.stringify(f).padEnd(30), JSON.stringify(R.evalFormula(f, vals)));
console.log("dice in damage:", JSON.stringify(R.evalFormula("1d6 + @origin.pow", vals, { dice: true })), "| words:", R.formulaWords("@origin.pow + 2"), "| old names:", R.migrateFormula("power + 2"), "->", R.oldFormula("@target.pow + 2"));

console.log("--- Next one only: spent rules; the effect ends when every spendable rule is spent");
const r1 = D("act", { id: "a", uses: "next", bb: { on: true, boons: 1 } }), r2 = D("act", { id: "b", uses: "next", emp: { on: true, emp: 1 } }), r3 = D("move", { id: "c" });
console.log("none spent:", R.allSpent([r1, r2, r3], []), "| a:", R.allSpent([r1, r2, r3], ["a"]), "| a and b (the Movement limit is passive):", R.allSpent([r1, r2, r3], ["a", "b"]), "| only passive rules:", R.allSpent([r3], []));
console.log("compiled: spend on the settings:", R.compile([r1, r2], {}).settings.map(x => `${x.type} spend ${x.spend} ${x.ruleId}`).join(", "), "| flags spendable:", JSON.stringify(appliedFlags(asSys({ settings: R.compile([r1, r2], {}).settings }), {}).spendable));

console.log("--- named bonuses (the book's Stacking): different names add, the same name the highest, an unnamed one never adds to another");
const b = (...l) => R.bonusTotal(l.map(([name, n]) => ({ name, n })));
console.log("Support 1 + Field 1:", b(["support", 1], ["field", 1]), "| Support 1 + Support 2:", b(["support", 1], ["support", 2]), "| unnamed 2 + unnamed 1:", b(["", 2], ["", 1]), "| unnamed 2 + Support 1:", b(["", 2], ["support", 1]), "| unnamed 1 + Support 1 + Field 1:", b(["", 1], ["support", 1], ["field", 1]), "| with a -1 penalty:", b(["support", 1], ["", -1]));

console.log("--- Increase by (Empowered and Enfeebled)");
console.log("Set 2 + Set 1:", topStep([{ n: 2 }, { n: 1 }]), "| Set 2 + Increase 1:", topStep([{ n: 2 }, { n: 1, inc: true }]), "| Increase 1 alone:", topStep([{ n: 1, inc: true }]));
const t = tally([{ kind: "emp", n: 2, label: "A", start: "on" }, { kind: "emp", n: 1, inc: true, label: "Vow", start: "on" }], {});
console.log("the roll dialog's tally: Empowered", t.emp);

console.log("--- the Movement limit (move.mjs moveLimitBreaks)");
const MLB = R.moveLimitBreaks;
console.log("move.mjs uses it:", fs.readFileSync(ROOT + "module/move.mjs", "utf8").includes("moveLimitBreaks(l.dir"));
console.log("closer 4 -> 3:", MLB("closer", 4, 3), "| closer 4 -> 4:", MLB("closer", 4, 4), "| closer 4 -> 5:", MLB("closer", 4, 5), "| away 4 -> 5:", MLB("away", 4, 5));
console.log("Frightened compiles to its Bane and a Movement limit, both while seen:", JSON.stringify(R.compile(fr, {}).settings.map(x => x.type)), "whileSeen", R.compile(fr, {}).whileSeen);

console.log("--- the view (fxsheet.mjs)");
const all = Object.keys(R.RULE_KINDS).map(k => D(k));
const html = V.fxTabHtml({ host: "effect", name: "Frightened", rules: [...fr, ...all], ends: { save: { on: true } }, originName: "Ogre Chieftain", applied: { spent: [] } });
console.log("one row per rule:", (html.match(/class="fr-it[ "]/g) ?? []).length === fr.length + all.length, "| a trash bin on each:", (html.match(/data-fr="del"/g) ?? []).length === fr.length + all.length, "| + Add rule with 4 groups:", (html.match(/<optgroup label="(Rolls and values|Gives|Areas|Limits)"/g) ?? []).length === 4);
console.log("each kind has a pane:", all.every(r => V.fxTabHtml({ host: "talent", rules: all, sel: r.id }).includes(`data-rid="${r.id}"`)), "| Ends rows:", (html.match(/data-f="ends\.(time|save|down|action)\.on"/g) ?? []).length, "| a Passive has Works and no Ends:", V.fxTabHtml({ host: "feature", rules: fr }).includes("Escalation 1+") && !V.fxTabHtml({ host: "feature", rules: fr }).includes("fr-endlist"));
console.log("the hover card is plain:", /<div class="fr-tip"[^>]*><b>Frightened<\/b> While they see Ogre Chieftain: 1 Bane/.test(html), "| the pane's sentence is colored:", /class="fr-bn">1 Bane/.test(html));
const up = V.saveUpdate(fr, { save: { on: true } }, "effect");
console.log("one save writes:", Object.keys(up).join(", "));
console.log("the built hover text keeps {origin} for the applied copy:", up["system.autoHover"]);

console.log("--- v0.0.324 (Lucas on v0.0.323): Defense and Resist / Weak as formulas; no origin switch; the formula names at hand");
const dF = D("value", { val: "@origin.pow" }), rF = D("value", { stat: "resist", rwSub: "Fi", rwVal: "@target.body + 1" });
console.log(say(dF), "|", say(rF));
console.log("compiled:", JSON.stringify(R.compile([dF, rF], {}).settings.map(x => [x.type, x.type === "resist" ? x.rwValue : x.defValue, x.valFormula])));
console.log("read back:", JSON.stringify(R.migrate({ settings: R.compile([dF, rF], {}).settings }).rules.map(r => (r.stat === "resist" ? r.rwVal : r.val))), "| a number stays a number:", R.normRule(D("value", { stat: "resist", rwVal: "3" })).rwVal);
const html2 = V.fxTabHtml({ host: "effect", name: "X", rules: [dF], ends: {} });
console.log("no origin switch:", !html2.includes("@originFromUser"), "| the names list beside the formula:", html2.includes("fr-fi") && V.FORMULA_TIP.includes("Power Modifier") && !/<name>/.test(V.FORMULA_TIP), "| no light preview:", !V.fxTabHtml({ host: "effect", rules: [D("light")] }).includes("fr-lightpv"));
