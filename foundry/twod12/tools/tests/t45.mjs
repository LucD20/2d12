// Run with: node tools/tests/run.mjs (or node tools/tests/t45.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { targets: new Set() }, combat: null };
const T = (...t) => new Set(t);
const cf = await import(ROOT + "module/config.mjs");
// 1. highest of the attribute traits, and the Defense
const trip = { traits: T("strike", "handle", "melee", "body", "instinct"), vs: "roll" };
console.log("Trip body 2 / instinct 1:", cf.checkAttr(trip, { body: 2, instinct: 1 }), "| body 0 / instinct 3:", cf.checkAttr(trip, { body: 0, instinct: 3 }), "| tie:", cf.checkAttr(trip, { body: 1, instinct: 1 }), "| no attrs:", cf.checkAttr(trip), "| Shove:", cf.checkAttr({ traits: T("body", "strike") }, { body: 1 }));
console.log("vsText:", cf.vsText(trip), "|", cf.vsText({ vs: "body", traits: T() }), "|", JSON.stringify(cf.vsText({ vs: "", traits: T() })));
const df = await import(ROOT + "module/defense.mjs");
const orc = { name: "Orc", system: { attributes: { body: 1, mind: 0, appeal: 0, instinct: 3 } }, itemTypes: { feature: [] } };
const item = { system: { vs: "roll", traits: trip.traits, versions: [] } };
console.log("DC vs the rolled attribute: rolled body ->", df.computeDC(item, orc, "body").dc, "| rolled instinct ->", df.computeDC(item, orc, "instinct").dc, "|", df.computeDC(item, orc, "instinct").note);
console.log("Shove vs Body:", df.computeDC({ system: { vs: "body", traits: T(), versions: [] } }, orc, "body").dc, "| no target (roll):", df.computeDC(item, null, "body").note);
console.log("meta line:", cf.metaRowHtml({ frequency: "round", targetText: "One creature", distance: "Reach", vs: "Body or Instinct" }).replace(/<i class="fa-solid fa-sparkle sep"><\/i>/g, "*").replace(/<[^>]+>/g, "|").replace(/\|+/g, "|"));
// 2. At-will banes
globalThis.game.combat = { id: "c1", started: true, round: 1, turn: 0 };
const store = {}; const actor = { type: "character", getFlag: (s, k) => store[k], setFlag: async (s, k, v) => { store[k] = v; }, isOwner: true, effects: [] };
const us = await import(ROOT + "module/usage.mjs");
const wa = { id: "wa", name: "Weapon Attack", type: "action", system: { frequency: "atwill", traits: T("strike", "weapon") } };
const out = []; for (let i = 0; i < 3; i++) { out.push(us.atWillUses(actor, wa)); await us.markUsed(actor, wa); }
console.log("banes for uses 1,2,3:", out.join(","), "| faded after 3 (Strike limit):", us.isFaded(actor, wa).faded, us.isFaded(actor, wa).why);
globalThis.game.combat.turn = 1; console.log("next turn resets:", us.atWillUses(actor, wa), "| faded:", us.isFaded(actor, wa).faded);
console.log("frequency label:", cf.TWOD12.frequencies.atwill, "| effective:", cf.effectiveFrequency(wa.system), "| round for non-weapon default:", JSON.stringify(cf.effectiveFrequency({ frequency: "", traits: T("divine") })));
// 3. two-handed weapon in one hand, free hand
const ef = await import(ROOT + "module/effects.mjs");
const w = (hands, wielded = true, extra = []) => ({ system: { wielded, hands, traits: T("twohanded", ...extra) } });
const mk = ws => ({ effects: [], system: {}, itemTypes: { weapon: ws } });
console.log("greatsword in 1 hand:", ef.derivedMods(mk([w(1)])).map(m => `${m.name} ${m.banes}b all=${m.all}`).join(","), "| in 2 hands:", ef.derivedMods(mk([w(2)])).length, "| not wielded:", ef.derivedMods(mk([w(1, false)])).length);
const ml = ef.modifierList(mk([w(1)]), T("strike", "weapon")); console.log("chip matches Strike Weapon:", ml[0].match, "| melee spell:", ef.modifierList(mk([w(1)]), T("magic", "strike"))[0].match);
// 4. basic actions
const bs = await import(ROOT + "module/basic.mjs");
const B = bs.BASIC_ACTIONS;
console.log("Weapon Attack:", B.basicWeaponAttack.frequency, "| Trip:", B.trip.traits.join(","), "vs", B.trip.vs, "check", JSON.stringify(B.trip.check), "| Shove:", B.shove.traits.join(","), "vs", B.shove.vs);
const v = B.trip.versions; console.log("Trip 1AP:", [v[0].x1, v[0].x2, v[0].x3].join(" / "), "| 2AP:", [v[1].x1, v[1].x2, `${v[1].t3[0].dice}${v[1].t3[0].subtype} + ${v[1].x3}`].join(" / "));
console.log("Interact:", B.interact.traits.join(","), B.interact.distance, B.interact.versions[0].noTiers, "| Reload buttons:", (B.reload.versions[0].x2.match(/@Reload\[weapon\]/g) || []).length + (B.reload.versions[0].x3.match(/@Reload\[weapon\]/g) || []).length);
// 5. @Reload renders
const inl = await import(ROOT + "module/inline.mjs"); inl.registerInline();
const enr = CONFIG.TextEditor.enrichers[0]; const m = [..."You Reload. @Reload[weapon]".matchAll(enr.pattern)][0]; console.log("@Reload button:", (await enr.enricher(m)).html.replace(/<[^>]+>/g, "").trim());
// 6. weapon generator gives hands
const gen = await import(ROOT + "module/gen.mjs");
console.log("hands:", gen.weaponSystemData(gen.parseWeaponText("greatsword: two-handed, melee, slash, 0/1d8/2d6")).hands, gen.weaponSystemData(gen.parseWeaponText("dagger: melee, pierce, 0/1d4/1d6")).hands);
