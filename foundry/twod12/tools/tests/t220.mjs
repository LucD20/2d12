// Run with: node tools/tests/run.mjs (or node tools/tests/t220.mjs)
// v0.0.314 PACK AU, part 1 (R-Foundry 2's list): the conditions as items (Frightened first), the Elite's Bloodied / Strained phases, Vs. WD and the
// AD / WD coloring. The pure rules (module/condrules.mjs), what the items' settings become on a creature (appliedflags.mjs), the roll's Boons and
// Banes from them (effects.mjs modifierList: Frightened, Taunted, Sickened), the card text that becomes their buttons (gen.mjs convertEffects),
// the Elite's rungs and phases (escalation.mjs) and the Vs. colors (util.mjs vsKind, chatcards.mjs badges).
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
void fileURLToPath;
const R = await import(ROOTURL + "module/condrules.mjs");
const { appliedFlags } = await import(ROOTURL + "module/appliedflags.mjs");
const E = await import(ROOTURL + "module/effects.mjs");
const ESC = await import(ROOTURL + "module/escalation.mjs");
const G = await import(ROOTURL + "module/gen.mjs");
const U = await import(ROOTURL + "module/util.mjs");
const { docs } = await import(ROOTURL + "tools/content.mjs").catch(() => ({ docs: null }));

console.log("--- the conditions pass's eight, as items (tools/content.mjs, the conditions pack)");
const conds = (docs ?? []).filter(d => d.pack === "conditions" || d.system?.isCondition);
const want = ["Bleed", "Blinded", "Dazed", "Frightened", "Grabbed", "Sickened", "Staggered", "Taunted"];
for (const n of want) {
  const d = conds.find(x => x.name === n), s = d?.system ?? {};
  const rules = ["whileSeen", "noReactions", "loseAp", "endsWithOrigin"].filter(k => s[k]);
  console.log(`${n.padEnd(11)} ${d ? "item" : "MISSING"} | valued: ${!!s.valued} | rules: ${rules.join(", ") || "-"} | linked: ${s.linked || "-"} | settings: ${(s.settings ?? []).map(x => x.type + (x.vsOrigin ? `(${x.vsOrigin})` : "") + (x.attrs?.length ? `[${x.attrs.join("/")}]` : "")).join(", ") || "-"}`);
}

console.log("--- what the settings become on the creature (appliedFlags)");
const item = n => { const d = conds.find(x => x.name === n); return { ...d.system, settings: d.system.settings.map(x => ({ attrs: [], all: [], any: [], none: [], from: [], tiers: [], ...x })), expireOn: [] }; };
const flagsOf = n => appliedFlags(item(n), {});
for (const n of ["Frightened", "Taunted", "Sickened", "Staggered", "Dazed", "Grabbed", "Bleed"]) {
  const f = flagsOf(n);
  console.log(`${n.padEnd(11)} whileSeen ${f.whileSeen} noReactions ${f.noReactions} loseAp ${f.loseAp} endsWithOrigin ${f.endsWithOrigin} | modifiers ${JSON.stringify(f.modifiers.map(m => ({ banes: m.banes, all: m.all, attrs: m.attrs, vsOrigin: m.vsOrigin, byValue: m.byValue })))} | bleeds ${JSON.stringify(f.bleeds)}`);
}

console.log("--- the Banes in a roll (effects.mjs modifierList)");
const F = "twod12";
const applied = (id, name, f, origin = "Actor.Ogre", value = null) => ({ id, name, origin, disabled: false, statuses: new Set([name.toLowerCase().replace(/\s+\d+$/, "")]), flags: { [F]: { ...f, ...(value ? { value } : {}) } }, getFlag(s, k) { return this.flags[F][k]; } });
const creature = (name, effects = []) => ({ name, uuid: `Actor.${name}`, effects, statuses: new Set(), system: {}, itemTypes: { weapon: [] }, items: [] });
const ogre = creature("Ogre"), goblin = creature("Goblin");
const banes = (me, traits, targets) => E.modifierList(me, new Set(traits), targets).filter(m => m.match).map(m => `${m.name} ${m.banes}`).join(", ") || "none";
const kai = creature("Kai", [applied("f1", "Frightened", flagsOf("Frightened"))]);
console.log("Frightened of the Ogre, an attack on the Goblin:", banes(kai, ["strike", "melee"], [goblin]), "| a Body Save:", banes(kai, ["body", "__save"], []));
ESC.setSeenGate(() => false);
console.log("the Ogre out of Kai's Sight (a wall): the Bane stops:", banes(kai, ["strike"], [goblin]));
ESC.setSeenGate(() => true);
console.log("seen again:", banes(kai, ["strike"], [goblin]));
ESC.setSeenGate(null);
const jared = creature("Jared", [applied("t1", "Taunted", flagsOf("Taunted"))]);
console.log("Taunted by the Ogre: vs the Goblin:", banes(jared, ["strike"], [goblin]), "| vs the Ogre:", banes(jared, ["strike"], [ogre]), "| vs both:", banes(jared, ["strike"], [ogre, goblin]), "| a Check (no target):", banes(jared, ["mind", "__check"], []));
const rin = creature("Rin", [applied("s1", "Sickened 2", flagsOf("Sickened"), "", 2)]);
console.log("Sickened 2: a Body Save:", banes(rin, ["body", "__save"], []), "| an Instinct Save:", banes(rin, ["instinct", "__save"], []), "| a Mind Save:", banes(rin, ["mind", "__save"], []), "| a Body Check:", banes(rin, ["body", "__check"], []), "| an attack:", banes(rin, ["strike"], [goblin]));
console.log("Challenged keeps its [Strike] and counts only against others:", JSON.stringify(((docs ?? []).find(d => d.name === "Challenged")?.system.settings ?? []).map(x => ({ all: x.all, vsOrigin: x.vsOrigin }))));

console.log("--- the pure rules (condrules.mjs)");
console.log("originOk not:", R.originOk({ vsOrigin: "not" }, "A", ["A"]), R.originOk({ vsOrigin: "not" }, "A", ["B"]), R.originOk({ vsOrigin: "not" }, "A", []), "| only:", R.originOk({ vsOrigin: "only" }, "A", ["A", "B"]), R.originOk({ vsOrigin: "only" }, "A", ["B"]), "| none:", R.originOk({}, "A", []));
console.log("Dazed 1 with 3 AP:", JSON.stringify(R.dazeSplit(3, 1)), "| Dazed 2 with 1 AP:", JSON.stringify(R.dazeSplit(1, 2)), "| Dazed 1 with 0 AP:", JSON.stringify(R.dazeSplit(0, 1)));
const stag = { effects: [applied("g1", "Staggered", flagsOf("Staggered"))] };
console.log("Staggered: Reactions off:", R.reactionsOff(stag), "| nothing on:", R.reactionsOff({ effects: [] }), "| a disabled one:", R.reactionsOff({ effects: [{ ...stag.effects[0], disabled: true }] }));
console.log("Bleed's pool: Bo/In", R.bleedPool("", ["body", "instinct"]), "| Mi/Ap", R.bleedPool("", ["mind", "appeal"]), "| [V] (Ap)", R.bleedPool("B", ["appeal"]), "| attrs 'mi/ap':", R.parseAttrs("mi/ap").join(","));
const bl = applied("b1", "Bleed", { bleeds: flagsOf("Bleed").bleeds, bleed: { dmg: "1d6", pool: "M", sub: "Ho", attrs: ["mind", "appeal"] } });
console.log("a card's Bleed over the condition's:", JSON.stringify(R.bleedOf(bl)), "->", R.bleedText(R.bleedOf(bl)), "| the bare condition:", R.bleedText(R.bleedOf(applied("b2", "Bleed", { bleeds: flagsOf("Bleed").bleeds }))), "| DC 15:", R.bleedText({ dmg: "2", attrs: ["body", "instinct"], dc: 15 }));

console.log("--- card text that becomes the buttons (gen.mjs convertEffects)");
for (const t of ["[R] 1d8 Ho; Pushed 2, and Frightened of you for 1 round.", "Frightened of the Grave Wisp (EoT).", "A Strained target also gains Bleed [R] 1d6 Ho (Mi/Ap).", "Bleed 2 (Bo/In; DC 15).",
  "they are Dazed 1 and Hindered (EoT).", "The target is Blinded (EoT).", "The target is Blinded for 1 round.", "Sickened 2.", "Taunted by you (EoT).", "Staggered (EoT).", "Grabbed.", "a Frightened creature flees; no longer Staggered."]) console.log(JSON.stringify(t), "->", G.convertEffects(t));
const parsed = (await import(ROOTURL + "module/inline.mjs")).parseInline("Condition", "bleed|dmg:1d6|pool:R|sub:Ho|attrs:mi/ap|dc:15");
console.log("@Condition[bleed|...] parsed:", JSON.stringify(parsed.bleed), "| the cond:", parsed.cond);

console.log("--- the Elite's Escalation (escalation.mjs)");
console.log("rungs:", [1, 2, 3].map(n => `${n}: ${ESC.eliteRung(n)}`).join(" | "));
console.log("phases from the state words:", JSON.stringify(ESC.elitePhases(["Bloodied"])), JSON.stringify(ESC.elitePhases(["Bloodied", "Strained"])), JSON.stringify(ESC.elitePhases(["Down"])));
const ups = [];
const elite = { type: "npc", name: "Ogre Chieftain", system: { useEscalation: true, escalation: 2 }, flags: {}, getFlag(s, k) { return this.flags[k]; }, async update(u) { ups.push(JSON.stringify(u)); if (u["system.escalation"] !== undefined) this.system.escalation = u["system.escalation"]; for (const [k, v] of Object.entries(u)) if (k.startsWith("flags.twod12.escUsed.")) (this.flags.escUsed ??= {})[k.split(".").pop()] = v; } };
globalThis.ChatMessage = { create: async m => ups.push(m.content.replace(/<[^>]+>/g, "")), getSpeaker: () => ({}) };
const cmb = { id: "c1" };
console.log("an Elite's Critical (no Critical hook):", await ESC.raiseEscalation(elite, "crit", { combat: cmb }));
console.log("it becomes Bloodied:", await ESC.raiseEscalation(elite, "bloodied", { combat: cmb, label: "Ogre Chieftain becomes Bloodied (Elite phase)" }), "| again (once):", await ESC.raiseEscalation(elite, "bloodied", { combat: cmb }));
elite.system.escalation = 2;
console.log("then Strained:", await ESC.raiseEscalation(elite, "strained", { combat: cmb, label: "Ogre Chieftain becomes Strained (Elite phase)" }), "| at 3, nothing:", await ESC.raiseEscalation(elite, "gm", { combat: cmb }));
console.log("what it posted:", ups.filter(x => !x.startsWith("{")).join(" || "));

console.log("--- the Vs. colors (util.mjs vsKind; the sheets' pills and the chat badges)");
console.log(["AD", "WD", "AD 13", "WD 14", "AD/WD", "Body Save", "App Save", "Inst", "Bo", "Mi", "DC", ""].map(x => `${JSON.stringify(x)}=${U.vsKind(x) || "-"}`).join(" "));
const CC = await import(ROOTURL + "module/chatcards.mjs");
const html = CC.breakdownHtml({ d1: [6], d2: [7], total: 15, dc: 13, dcLabel: "WD", tier: 2, base: 2, boonFaces: [], baneFaces: [], sources: [] }, { id: "x" });
console.log("the roll's badge:", (html.match(/<span class="cc-badge[^"]*">[^<]*<\/span>/) ?? ["none"])[0]);

console.log("--- v0.0.315 (Lucas on v0.0.314)");
console.log("needs an origin (the HUD asks):", want.map(n => `${n} ${R.needsOrigin(conds.find(x => x.name === n)?.system)}`).join(", "));
console.log("asks its damage (Bleed's window):", want.filter(n => R.hasBleed(conds.find(x => x.name === n)?.system)).join(", "));
const CD = await import(ROOTURL + "module/conditions.mjs");
const bm = CD.bleedModel({ dmg: "1d6", pool: "", sub: "Ho", attrs: ["mind", "appeal"], dc: 13 }, "Goblin");
console.log("Bleed's window:", bm.name, "|", bm.sub, "|", JSON.stringify(bm.stats), "| rows:", bm.sections[1].rows.map(r => `${r.label}: ${r.opts.map(o => `${o.l}${o.on ? "*" : ""}`).join("/")}`).join("; "), "| confirm:", bm.confirm, bm.complete, "| empty:", CD.bleedModel({ dmg: "", pool: "", sub: "", attrs: ["body"], dc: 13 }).complete);
const af = appliedFlags(item("Bleed"), conds.find(x => x.name === "Bleed").system);
const wb = E.withBleed(af, { dmg: "1d6", pool: "M", sub: "Ho", attrs: ["mind", "appeal"], dc: 15 });
console.log("a card's Bleed goes into the applied effect's own setting (seen and editable):", JSON.stringify(wb.source.settings.find(x => x.type === "bleed")), "| the turn reads:", JSON.stringify(wb.bleeds[0]));
const dm = CC.damageCardHtml({ name: "Bleed [V] 1 (Bo/In)", nl: false, noNl: true, note: "Ends with Interact (1 AP) and a Bo/In Save, DC 13.", groups: [{ tier: 0, comps: [{ pool: "B", total: 1, formula: "1" }], riders: [], rows: [0] }], rows: [{ uuid: "x", name: "Grave Wisp" }] });
console.log("Bleed's card: no ↳ box:", !/cc-rider/.test(dm), "| no Lethal tag:", !/cc-nl/.test(dm), "| the note:", (dm.match(/<div class="cc-dnote">([^<]*)<\/div>/) ?? [])[1]);
globalThis.fromUuidSync = u => (u.includes("AjaXvWGAPxEypR0a") ? { documentName: "Actor", name: "Grave Wisp" } : null);
console.log("an origin on the Details tab:", JSON.stringify(R.originView("Scene.s1.Token.AjaXvWGAPxEypR0a.Actor.a1")), "| none:", JSON.stringify(R.originView("")));

console.log("--- v0.0.316 (Lucas on v0.0.315)");
console.log("the origin is the Action's user (else it asks):", want.filter(n => R.needsOrigin(conds.find(x => x.name === n)?.system)).map(n => `${n} ${!!conds.find(x => x.name === n).system.originFromUser}`).join(", "));
const SG = await import(ROOTURL + "module/sightgate.mjs").catch(e => ({ err: e.message }));
const tk = (id, st = []) => ({ id, actor: { statuses: new Set(st), system: { senses: {} } } });
console.log("a Blinded observer sees no creature by sight (Hearing is another mode):", SG.canSeeByRules ? SG.canSeeByRules(tk("a", ["blinded"]), tk("b")) : SG.err);
