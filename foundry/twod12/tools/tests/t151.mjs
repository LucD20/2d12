// Run with: node tools/tests/run.mjs (or node tools/tests/t151.mjs)
// v0.0.186 (pack C-a): general automation. The cards that were automated by code testing their name are settings on their items now:
// once per round (Killer's Focus, Radiant Zeal, Elusive), only against the marked target (Marked Quarry, Hunter's Focus), Ignore a Bane
// (Long Draw, Steady Nerves, Sharpshooter), Rally Points (Font of Mercy). This test reads the compendium's own settings (tools/content.mjs).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = { time: {}, TextEditor: { enrichers: [] }, statusEffects: [] };
globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const emitted = [];
globalThis.game = { settings: { get: () => true }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit: (n, d) => emitted.push(d) } };
const { docs, uuidOf } = await import(ROOTURL + "tools/content.mjs");
globalThis.game = { settings: { get: () => true }, time: { worldTime: 0 }, user: { id: "u" }, combat: null, items: [], packs: new Map(), actors: [], socket: { emit: (n, d) => emitted.push(d) } };   // (content.mjs puts its own stand-in)
const E = await import(ROOTURL + "module/effects.mjs"), B = await import(ROOTURL + "module/bonus.mjs"), AU = await import(ROOTURL + "module/automation.mjs");
const FD = await import(ROOTURL + "module/fxdetails.mjs");
const F = "twod12";
const card = name => docs.find(d => d.name === name && ["feature", "talent"].includes(d.type)) ?? docs.find(d => d.name === name && d.type === "effect");
const settingsOf = name => (card(name)?.system.settings ?? []).map(x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], ...x }));

/** A creature with these Features (their compendium settings) and applied effects; its flags are kept in memory. */
let nid = 0;
function creature(name, features = [], { escalation = 0, effects = [], owner = true, system = {} } = {}) {
  const flags = {};
  const items = features.map(n => ({ id: `it${++nid}`, name: n, type: "feature", system: { settings: settingsOf(n), description: "" } }));
  const a = {
    name, uuid: `Actor.${name}`, isOwner: owner, statuses: new Set(), items,
    itemTypes: { feature: items, talent: [], weapon: [], action: [] },
    system: { escalation, powerMod: 3, weaponMod: 2, signatureMod: 3, attributes: {}, level: 1, ...system },
    getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = JSON.parse(JSON.stringify(v)); }, unsetFlag: async (s, k) => { delete flags[k]; },
    getActiveTokens: () => [{ document: { uuid: `Scene.s.Token.${name}` } }], type: "character"
  };
  a.effects = effects.map(n => { const st = settingsOf(n); const { appliedFlags } = AP; const fl = appliedFlags({ settings: st, description: "", hover: "", expireOn: new Set(), expireAll: false }, null); return { id: `fx${++nid}`, name: n, disabled: false, statuses: new Set(), flags: { [F]: fl }, getFlag: (s, k) => fl[k] }; });
  return a;
}
const AP = await import(ROOTURL + "module/appliedflags.mjs");
const T = (...t) => new Set(t);
const shot = T("ranged", "shot", "strike", "weapon");
const show = list => list.map(b => `${b.effect} +${b.dmg}${b.sub ? " " + b.sub : ""} [${b.pool}]${b.once ? " (once)" : ""}`).join(", ") || "none";

console.log("--- the cards carry settings (no code tests their names)");
for (const n of ["Font of Mercy", "Radiant Zeal", "Killer's Focus", "Long Draw", "Steady Nerves", "Sharpshooter", "Marked Quarry", "Hunter's Focus"])
  console.log(n.padEnd(15), (card(n)?.system.settings ?? []).map(x => FD.settingShort({ all: new Set(x.all ?? []), any: new Set(x.any ?? []), none: new Set(x.none ?? []), from: new Set(), tiers: new Set(x.tiers ?? []), ...x, ...(x.all ? { all: new Set(x.all) } : {}) })).join(" | "));
const src = f => fs.readFileSync(ROOT + f, "utf8");
const code = ["module/actions.mjs", "module/mark.mjs", "module/rally.mjs", "module/effects.mjs", "module/bonus.mjs"].map(src).join("\n");
console.log("no hasFeature(name) left:", !/hasFeature\(/.test(code), "| paladin.mjs gone:", !fs.existsSync(ROOT + "module/paladin.mjs"), "| Mark Quarry marks by its box:", docs.find(d => d.name === "Mark Quarry").system.marksTarget === true);

console.log("--- once per round (the engine; no compendium card uses it on its own bonus now)");
const onceFx = { id: "fxonce", name: "Test Focus", disabled: false, statuses: new Set(), flags: {}, getFlag: (s, k) => ({ bonuses: [{ dmg: "1d6", dmgPool: "B", dmgSub: "Pi", tiers: [], all: ["shot"], any: [], none: [], oncePerRound: true }] })[k] };
const arc = creature("Lana", [], { escalation: 2 }); arc.effects = [onceFx];
game.combat = { started: true, round: 2, turn: 1, turns: [{ actor: {} }, { actor: arc }] };
const kf = B.collectBonuses(arc, shot, 2)[0];
console.log("first:", show(B.collectBonuses(arc, shot, 2)));
await AU.markOnce(arc, [kf.once]);
console.log("used this turn-cycle:", show(B.collectBonuses(arc, shot, 2)), "| next round, before its turn:", (game.combat.round = 3, game.combat.turn = 0, show(B.collectBonuses(arc, shot, 2))), "| at its turn:", (game.combat.turn = 1, show(B.collectBonuses(arc, shot, 2))));
game.combat = null;

console.log("--- v0.0.187: Killer's Focus and Radiant Zeal give an Effect at the start of each turn, used up by the Action");
const effectDoc = name => docs.find(d => d.name === name && d.type === "effect");
globalThis.fromUuid = async u => { const d = docs.find(x => x.type === "effect" && uuidOf("effects", x.name) === u); return d ? { uuid: u, name: d.name, img: d.img, type: "effect", system: { duration: { type: "", rounds: 1 }, conditions: [], linked: "", minEscalation: 0, expireOn: [], expireAll: false, ...d.system, settings: (d.system.settings ?? []).map(x => ({ all: [], any: [], none: [], from: [], tiers: ["t1", "t2", "t3"], ...x })), expireOn: new Set(d.system.expireOn ?? []) }, toObject: () => ({ system: d.system }) } : null; };
const live = a => {   // applied effects that behave like Foundry's (created, read, deleted)
  a.effects = [];
  a.createEmbeddedDocuments = async (k, list) => list.map(d => { const fx = { id: `ae${++nid}`, name: d.name, disabled: false, statuses: new Set(d.statuses ?? []), flags: d.flags, getFlag: (s, key) => d.flags?.[F]?.[key] }; a.effects.push(fx); return fx; });
  a.deleteEmbeddedDocuments = async (k, ids) => { a.effects = a.effects.filter(e => !ids.includes(e.id)); };
  return a;
};
console.log("the Features:", ["Killer's Focus", "Radiant Zeal"].map(n => `${n}: ${(card(n)?.system.settings ?? []).map(x => `${x.type} Escalation ${x.minEscalation}`).join(", ")} | Escalation Passive ${card(n)?.system.escalationPassive}`).join(" ; "));
console.log("the Effects:", ["Killer's Focus", "Radiant Zeal"].map(n => { const d = effectDoc(n).system; return `${n}: ends after ${d.expireOn.join(" + ")}, works at Escalation ${d.minEscalation}`; }).join(" ; "));
const kfa = live(creature("Lonny", ["Killer's Focus"], { escalation: 1 }));
console.log("its turn at Escalation 1:", await AU.applyTurnStartEffects(kfa), "Effect(s)", kfa.effects.map(e => e.name));
kfa.system.escalation = 2;
console.log("at Escalation 2:", await AU.applyTurnStartEffects(kfa), "| again next turn (replaced, not stacked):", await AU.applyTurnStartEffects(kfa), kfa.effects.map(e => e.name), "| from Escalation (ends with the encounter):", kfa.effects[0]?.getFlag(F, "fromEscalation"));
console.log("its bonus:", show(B.collectBonuses(kfa, shot, 2)), "| Escalation spent to 1:", (kfa.system.escalation = 1, show(B.collectBonuses(kfa, shot, 2))), (kfa.system.escalation = 2, ""));
console.log("unticked in the dialog: the effect stays:", await B.expireOnUse(kfa, shot, new Set([kfa.effects[0].id])), kfa.effects.length, "| used: it ends:", await B.expireOnUse(kfa, shot), kfa.effects.length);
const rza = live(creature("Abe", ["Radiant Zeal"], { escalation: 1 }));
await AU.applyTurnStartEffects(rza);
console.log("Radiant Zeal: a Strike:", show(B.collectBonuses(rza, T("strike", "weapon", "melee"), 1)), "| not a Strike:", show(B.collectBonuses(rza, T("self"), 1)));
const pal = creature("Ivo2", ["Radiant Zeal"], { escalation: 1 });
const dlg = src("module/actions.mjs");
console.log("roll dialog: Bonus chips", dlg.includes('name="bonusOn"'), "| unticked ones left out", dlg.includes("!bonusOff.has(bonusKey(b))"), "| their effect kept", dlg.includes("await expireOnUse(actor, rollTraits(useTraits, src, item.name), kept);"), "| turn start wired", src("module/combat.mjs").includes("await applyTurnStartEffects(c.actor);"));
console.log("--- Marked Quarry and Hunter's Focus: only against the marked creature");
const lana = creature("Krysta", ["Marked Quarry"], { effects: ["Hunter's Focus"] });
const orc = creature("Orc"), gob = creature("Goblin");
await lana.setFlag(F, "quarry", { uuid: "Scene.s.Token.Orc", name: "Orc" });
const boonsVs = t => E.modifierList(lana, shot, [t]).filter(m => m.boons).map(m => `${m.name} ${m.boons}`).join(", ") || "none";
console.log("boons vs the Orc:", boonsVs(orc), "| vs the Goblin:", boonsVs(gob));
console.log("Tier 1 vs the Orc (Modifier +2):", show(B.collectBonuses(lana, shot, 1, { target: orc, mod: 2 })), "| Tier 2:", show(B.collectBonuses(lana, shot, 2, { target: orc, mod: 2 })), "| vs the Goblin:", show(B.collectBonuses(lana, shot, 1, { target: gob, mod: 2 })), "| Modifier 0:", show(B.collectBonuses(lana, shot, 1, { target: orc, mod: 0 })));
console.log("Empowered vs the Orc:", JSON.stringify(E.damageSteps(lana, shot, orc).empowered), "| vs the Goblin:", JSON.stringify(E.damageSteps(lana, shot, gob).empowered));
console.log("the mark matches a token too:", AU.isMarked(lana, { document: { uuid: "Scene.s.Token.Orc" } }), "| v0.0.207 its reminders are settings:", AU.messagesFor(lana, "encounter").map(m => m.action).join(","), "| the Orc has none:", AU.messagesFor(orc, "encounter").length);
console.log("[Mod] in a Bonus Damage:", ["[Mod]", "1d6 + [Mod]", "1d4"].map(d => `${d} -> ${JSON.stringify(B.modDamage(d, 3))}`).join(" | "), "| [Mod] with -1:", JSON.stringify(B.modDamage("[Mod]", -1)), JSON.stringify(B.modDamage("1d6 + [Mod]", -1)));

// Pack R-classes (v0.0.235): Elusive is gone from the Archer (its "once per round" Bane on the attacker was tested here); the once-per-round mechanic stays tested by Killer's Focus above.

console.log("--- Ignore a Bane: Long Draw, Steady Nerves (now a Talent: no Escalation), Sharpshooter");
const ign = creature("Lonny", ["Long Draw", "Steady Nerves", "Sharpshooter"], { escalation: 0 });
console.log("range Bane less, a Shot:", JSON.stringify(AU.ignoredBy(ign, "rangeBane", shot)), "| a thrown dagger:", JSON.stringify(AU.ignoredBy(ign, "rangeBane", T("ranged", "strike", "weapon"))));
console.log("Engaged (you), Escalation 0:", JSON.stringify(AU.ignoredBy(ign, "engagedSelf", shot)), "| Escalation 2:", (ign.system.escalation = 2, JSON.stringify(AU.ignoredBy(ign, "engagedSelf", shot))));
console.log("Engaged target, a Shot:", JSON.stringify(AU.ignoredBy(ign, "engagedTarget", shot)), "| a Power Action:", JSON.stringify(AU.ignoredBy(ign, "engagedTarget", T("power", "ranged", "strike"))));

console.log("--- Rally Points: Font of Mercy (power + 2, allies within 5, Escalation 1)");
console.log("formulas:", ["power + 2", "signature", "ceil(level/2)", "3", "alert(1)"].map(f => `${f} = ${AU.evalStat(f, pal)}`).join(" | "));
console.log("a Paladin without Font of Mercy, Escalation 1:", JSON.stringify(await AU.rallyBonusFor(pal)), "| Escalation 0:", (pal.system.escalation = 0, JSON.stringify(await AU.rallyBonusFor(pal))));
const fom = creature("Ivo", ["Font of Mercy"], { escalation: 1 });
console.log("Font of Mercy, Escalation 1:", JSON.stringify(await AU.rallyBonusFor(fom)));

console.log("--- the editor's sentences");
const S = x => FD.settingSentence({ all: new Set(), any: new Set(), none: new Set(), from: new Set(), tiers: new Set(), ...x });
console.log(S({ type: "bonusdamage", dmg: "1d6", dmgPool: "B", dmgSub: "Pi", all: new Set(["shot", "strike"]), oncePerRound: true, vsMarked: true }));
console.log(S({ type: "boonbane", against: true, banes: 1, all: new Set(["strike"]), oncePerRound: true }));
console.log(S({ type: "ignore", ignoreRule: "engagedTarget", all: new Set(["shot"]) }));
console.log(S({ type: "rally", rallyBonus: "power + 2", rallyRange: 5 }));
const sheet = src("templates/parts/settings.hbs"), ihbs = src("templates/item-sheet.hbs");
console.log("editor: once", sheet.includes('data-field="oncePerRound"'), "| marked", sheet.includes('data-field="vsMarked"'), "| ignore", sheet.includes('data-field="ignoreRule"'), "| rally", sheet.includes('data-field="rallyBonus"'), "| Action: Marks the target", ihbs.includes('name="system.marksTarget"'));
