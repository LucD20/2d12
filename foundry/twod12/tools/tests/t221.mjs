// Run with: node tools/tests/run.mjs (or node tools/tests/t221.mjs)
// v0.0.320 PACK AU, part 2: Resist / Weak / Immunity from effects, Features and Talents (the "Resist, Weak or Immunity" setting, merged with the
// creature's own line: the highest counts), Weak's extra where the origin chooses, the old Save card path (dealDamageEx: Resist, and the riders only
// when the damage landed), the Elite ladder as settings (1 Boon on its first attack, Round Specials twice, Encounter Specials a second time), and two
// fixes in resolveModifiers (a passive's Boons, a modifier "only against the creature it marked").
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s, getRoute: p => "/" + p } };
globalThis.game = { settings: { get: () => false }, time: { worldTime: 0 }, user: { id: "u", isGM: true }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit() {} } };
globalThis.fromUuidSync = () => null;
const F = "twod12";
const CC = await import(ROOTURL + "module/chatcards.mjs");
const { appliedFlags } = await import(ROOTURL + "module/appliedflags.mjs");
const CD = await import(ROOTURL + "module/ccdamage.mjs");
const E = await import(ROOTURL + "module/effects.mjs");
const P = await import(ROOTURL + "module/passives.mjs");
const U = await import(ROOTURL + "module/usage.mjs");
const FD = await import(ROOTURL + "module/fxdetails.mjs");
const D = await import(ROOTURL + "module/damage.mjs");
const { effectOff } = await import(ROOTURL + "module/escalation.mjs");

const blank = { attrs: [], all: [], any: [], none: [], from: [], tiers: [], predicate: "", boons: 0, banes: 0, bbName: "", empowered: 0, enfeebled: 0, byValue: false, against: false, oncePerRound: false, vsMarked: false, vsOrigin: "", minEscalation: 0 };
const coll = list => Object.assign(list, { get: id => list.find(e => e.id === id) });
const fx = (id, name, flags, extra = {}) => ({ id, name, disabled: false, statuses: new Set(), flags: { [F]: flags }, getFlag: (s, k) => (s === F ? flags[k] : undefined), ...extra });

console.log("--- the setting: what it becomes on the creature (appliedFlags)");
const rw = (rwKind, dmgSub, rwValue = 1) => ({ ...blank, type: "resist", rwKind, dmgSub, rwValue });
const fl = appliedFlags({ settings: [rw("resist", "Fi", 3), rw("weak", "Ho", 2), rw("immune", "Co", 0), rw("resist", "", 5), rw("resist", "Ac", 0), { ...blank, type: "freqmore", fmWhich: "encounter" }], expireOn: new Set(), expireAll: false }, null);
console.log("dmgMods", JSON.stringify(fl.dmgMods), "| freqMore", JSON.stringify(fl.freqMore), "(no subtype or a 0 Resist: nothing)");
for (const x of [rw("resist", "Fi", 3), rw("weak", "Ho", 2), rw("immune", "Co"), { ...blank, type: "freqmore", fmWhich: "round" }, { ...blank, type: "freqmore", fmWhich: "encounter" }])
  console.log(FD.settingSentence(x).replace(/<[^>]+>/g, ""), "|", FD.settingShort?.(x) ?? "");

console.log("--- merged with the creature's own line: the highest of each counts (Ch. 1, Stacking)");
const base = CC.parseDmgMods("Resist 2 Fire, Weak 1 Holy");
console.log(JSON.stringify(CC.mergeDmgMods(base, [{ kind: "resist", sub: "Fi", n: 5 }, { kind: "resist", sub: "Fi", n: 3 }, { kind: "weak", sub: "Ho", n: 1 }, { kind: "immune", sub: "Ps" }, { kind: "resist", sub: "Zz", n: 9 }])));
console.log("a lower one doesn't replace a higher one:", JSON.stringify(CC.mergeDmgMods(CC.parseDmgMods("Resist 5 Fire"), [{ kind: "resist", sub: "Fi", n: 2 }])));

console.log("--- dmgModsOf: the line, an applied effect, a Talent, an effect that is off");
const talent = { id: "T1", name: "Fire Ward", uuid: "Item.T1", system: { settings: [rw("resist", "Fi", 4)], description: "" }, getFlag: () => undefined };
const escTalent = { id: "T2", name: "Late Ward", uuid: "Item.T2", system: { settings: [{ ...rw("immune", "Co"), minEscalation: 3 }], description: "" }, getFlag: () => undefined };
const kai = { name: "Kai", uuid: "Actor.Kai", type: "character", system: { dmgMods: "Resist 1 Fire", escalation: 1 }, statuses: new Set(),
  effects: coll([fx("e1", "Blessing", { dmgMods: [{ kind: "resist", sub: "Ho", n: 2 }] }), fx("e2", "Old curse", { dmgMods: [{ kind: "weak", sub: "Ho", n: 3 }] }, { disabled: true })]),
  itemTypes: { feature: [], talent: [talent, escTalent], weapon: [] }, items: [] };
console.log("Escalation 1:", JSON.stringify(CD.dmgModsOf(kai)));
kai.system.escalation = 3; console.log("Escalation 3 (the Talent's Immunity works):", JSON.stringify(CD.dmgModsOf(kai))); kai.system.escalation = 1;

console.log("--- the damage after it");
const c = (pool, sub, total) => ({ pool, sub, total });
const show = (label, comps, mods, opts) => console.log(label.padEnd(54), JSON.stringify(CC.afterResist(comps, mods, opts)), "| mods", CC.dmgModsFor(comps, mods).map(x => x.label + " " + x.v).join(", "));
const dm = CD.dmgModsOf(kai);   // Resist 4 Fire, Resist 2 Holy
show("6 Fire [V] (Resist 4):", [c("B", "Fi", 6)], dm);
show("3 Fire [V] + 3 Fire [R] (one Resist for both pools):", [c("B", "Fi", 3), c("M", "Fi", 3)], dm);
show("2 Holy + 5 untyped:", [c("B", "Ho", 2), c("B", "", 5)], dm);
const weak = { resist: {}, weak: { Ho: 3 }, immune: [] };
console.log("Weak over both pools needs the origin's choice:", JSON.stringify(CC.weakSplits([c("B", "Ho", 2), c("M", "Ho", 2)], weak)), "| one pool only:", JSON.stringify(CC.weakSplits([c("B", "Ho", 2)], weak)));
show("Weak 3 Holy, 2 [V] + 4 [R] (default: more of it):", [c("B", "Ho", 2), c("M", "Ho", 4)], weak);
show("the same, the origin chose Vigor:", [c("B", "Ho", 2), c("M", "Ho", 4)], weak, { weakTo: { Ho: "B" } });

console.log("--- the old Save card path (an Area Save): dealDamageEx");
const gob = { name: "Gob", uuid: "Actor.Gob", type: "npc", system: { dmgMods: "Immunity Fire", useEscalation: false, damage: {} }, statuses: new Set(), effects: coll([]), itemTypes: { feature: [], talent: [] }, items: [], update: async () => { throw new Error("no update expected"); } };
const r1 = await D.dealDamageEx(gob, [{ pool: "B", sub: "Fi", total: 7, nl: false }]);
console.log("Immunity Fire, 7 Fire:", JSON.stringify(r1), "(landed false: the Tier's effects don't happen)");

console.log("--- the Elite ladder (passives.mjs)");
const elite = (esc, ladder = true) => ({ name: "Ogre Chieftain", uuid: "Actor.Ogre", type: "npc", system: { useEscalation: true, eliteLadder: ladder, escalation: esc, role: "elite" }, statuses: new Set(), effects: coll([]), itemTypes: { feature: [], talent: [], weapon: [] }, items: [] });
for (const n of [1, 2, 4, 6]) {   // v0.0.407: the Elite ladder at Escalation 2, 4 and 6
  const a = elite(n), on = P.allEffects(a).filter(e => !effectOff(a, e)).map(e => e.id);
  console.log(`Escalation ${n}: working ${on.join(", ")} | more uses ${JSON.stringify([...U.freqMoreOf(a)])}`);
}
console.log("Default ladder off:", P.allEffects(elite(3, false)).length, "sources | a Standard (no Escalation):", P.allEffects({ ...elite(3), system: { useEscalation: false, escalation: 3 } }).length);
const ogre = elite(2);
const attack = E.modifierList(ogre, new Set(["strike", "__attack", "__action"]), []), check = E.modifierList(ogre, new Set(["body", "__check"]), []);
console.log("an attack:", attack.map(m => `${m.name} ${m.boons} Boon, match ${m.match}, once ${!!m.once}`).join("; "), "| a Check:", check.map(m => `match ${m.match}`).join("; "));
console.log("it counts on the roll:", JSON.stringify(E.resolveModifiers(ogre, attack.filter(m => m.match).map(m => m.id)).boons));
console.log("uses allowed: Round Special with 'round'", U.usesAllowed("round", new Set(["round"]), true), "| a Basic Action", U.usesAllowed("round", new Set(["round"]), false), "| Encounter without 'encounter'", U.usesAllowed("encounter", new Set(["round"]), true), "| with", U.usesAllowed("encounter", new Set(["encounter"]), true));

console.log("--- the uses in a combat (usage.mjs isFaded / markUsed)");
const mk = esc => { const a = elite(esc); let flag = {}; a.isOwner = true; a.getFlag = (s, k) => (k === "usage" ? flag[k] : undefined); a.setFlag = async (s, k, v) => { flag[k] = JSON.parse(JSON.stringify(v)); }; return a; };
const item = (id, frequency, basic = false) => ({ id, name: id, type: "action", system: { frequency, traits: new Set() }, getFlag: (s, k) => (k === "basic" ? (basic ? "charge" : undefined) : undefined) });
const runUses = async (esc, it, n) => {
  const a = mk(esc);
  game.combat = { id: "c1", started: true, round: 2, turn: 0, turns: [{ actor: a }], combatants: [] };
  const out = [];
  for (let i = 0; i < n; i++) { const f = U.isFaded(a, it); out.push(f.faded ? `faded (${f.why})` : "free"); if (!f.faded) await U.markUsed(a, it); }
  return out.join(" -> ");
};
console.log("Escalation 2, a Round Special:", await runUses(2, item("Slam", "round"), 3));
console.log("Escalation 4, a Round Special:", await runUses(4, item("Slam", "round"), 3));
console.log("Escalation 4, Charge (a Basic Action):", await runUses(4, item("Charge", "round", true), 2));
console.log("Escalation 4, an Encounter Special:", await runUses(4, item("Roar", "encounter"), 2));
console.log("Escalation 6, an Encounter Special:", await runUses(6, item("Roar", "encounter"), 3));
game.combat = null;

console.log("--- resolveModifiers: a Feature's passive Boon, and one only against the marked creature (both were left out before v0.0.320)");
const st = { ...blank, type: "boonbane", boons: 1 };
const feat = { id: "F1", name: "Steady Hand", uuid: "Item.F1", system: { settings: [st, { ...st, boons: 2, vsMarked: true }], description: "" }, getFlag: () => undefined };
const tgt = { name: "Gob", uuid: "Actor.Gob", type: "npc", effects: coll([]), statuses: new Set(), system: {}, itemTypes: { weapon: [] }, getActiveTokens: () => [{ document: { uuid: "Scene.s.Token.g" } }] };
const lia = { name: "Lia", uuid: "Actor.Lia", type: "character", effects: coll([fx("m1", "Vow", { modifiers: [{ against: false, boons: 1, banes: 0, bb: "", all: [], any: [], none: [], from: [], attrs: [], vsMarked: true }] })]), statuses: new Set(), system: {}, itemTypes: { weapon: [], feature: [feat], talent: [] }, items: [], getFlag: (s, k) => (k === "quarry" ? { uuid: "Scene.s.Token.g" } : undefined) };
globalThis.fromUuidSync = u => (u === "Actor.Gob" ? tgt : null);
const list = E.modifierList(lia, new Set(["melee"]), [tgt]);
console.log(list.map(m => `${m.id}: ${m.boons}`).join(" | "));
const res = E.resolveModifiers(lia, list.map(m => m.id));
console.log("Boons on the roll:", res.boons, "from", res.sources.map(x => `${x.name} ${x.boons}`).join(", "));
