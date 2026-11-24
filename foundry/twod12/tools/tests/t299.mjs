// Run with: node tools/tests/run.mjs (or node tools/tests/t299.mjs)
// v0.0.488: Encounter Log upgrade (unified numbering, Health Pressure % table, Raw/Reduced & Prevented credit,
// Reactions offered/used/passed, Section R watchlist, voidLast fix, serialized GM archiving),
// Image-1 World Clock & Above-Chat Time Bar, dark red warning button contrast, and system-wide button/icon centering.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

let archivedStore = [];
globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o)), randomID: () => "id1" }
};
globalThis.game = {
  system: { version: "0.0.488" },
  user: { id: "gm", isGM: true, isActiveGM: true },
  time: { worldTime: 2 * 86400 + 14 * 3600 + 20 * 60 },
  i18n: { localize: s => s },
  settings: {
    register() {},
    get: (s, k) => (k === "encArchive" ? archivedStore : true),
    set: async (s, k, v) => { if (k === "encArchive") archivedStore = v; }
  }
};

const EL = await import(ROOTURL + "module/enclog.mjs");
const DL = await import(ROOTURL + "module/damagelog.mjs");
const CK = await import(ROOTURL + "module/clock.mjs");

// 1. Unified creature numbering across Encounter Log & Damage Report
const mkC = (tid, aid, name, type, disp, pool, dmg = 0) => ({
  id: `c_${tid}`, tokenId: tid, actorId: aid, name,
  token: { id: tid, name, disposition: disp },
  actor: { id: aid, uuid: `Actor.${aid}`, name, type, system: { pool, bdt: Math.ceil(pool * 0.65), mdt: Math.floor(pool * 0.35), damage: { bodyLethal: dmg, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 } } }
});
const combat = {
  id: "cmb1", started: true, round: 2, turn: 0,
  turns: [
    mkC("t_av", "av", "Aveline (Human Paladin, Smite)", "character", 1, 38, 3),
    mkC("t_du", "du", "Durgan (Dwarf Paladin, Lay On Hands)", "character", 1, 42, 0),
    mkC("t_g1", "g1", "Goblin Sneak", "npc", -1, 10, 0),
    mkC("t_g2", "g2", "Goblin Sneak", "npc", -1, 10, 0),
    mkC("t_oc", "oc", "Ogre Chieftain", "npc", -1, 110, 0)
  ],
  combatants: [],
  getFlag: () => ({})
};
combat.combatants = combat.turns;
const creatures = EL.unifiedCreatures(combat);
const dlNamed = DL.numberSameNames([{ key: "t_g1", name: "Goblin Sneak" }, { key: "t_g2", name: "Goblin Sneak" }], combat);
console.log("1. Unified numbering:", creatures.map(c => `${c.fullName}(${c.abbr})`).join(", "), "| DL matches:", dlNamed.map(r => r.name).join(", "));

// 2. Health Pressure %, Raw vs Reduced, Prevented credit, Reactions, Section R
const log = [
  { id: "l1", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "act", who: { id: "t_oc", name: "Ogre Chieftain" }, d: { name: "Overhead Smash", ap: 2, tg: [{ id: "t_av", name: "Aveline", tier: 3 }], roll: { dice: [8, 9], mod: 3, total: 20, dc: 14, def: "AD" } } },
  { id: "l2", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "rx", who: { id: "t_du", name: "Durgan" }, d: { action: "Shield of Faith", trigger: "Ally takes damage", outcome: "used", detail: "reduced 6" } },
  { id: "l3", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "dmg", who: { id: "t_av", name: "Aveline" }, d: { n: 12, v: 12, r: 0, raw: 18, reducedBy: 6, reducedSource: { id: "t_du", name: "Durgan" }, reducedNote: "Shield of Faith −6", origin: { id: "t_oc", name: "Ogre Chieftain" }, text: "12 Vigor" } },
  { id: "l4", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "push", who: { id: "t_oc", name: "Ogre Chieftain" }, d: { target: { id: "t_av", name: "Aveline" }, mode: "Pushed", n: 0, note: "hits a wall" } },
  { id: "l5", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "rx", who: { id: "t_av", name: "Aveline" }, d: { action: "Rebuke", trigger: "Collision damage", outcome: "passed", collision: true } },
  { id: "l6", r: 1, t: 0, own: { id: "t_oc", name: "Ogre Chieftain" }, k: "state", who: { id: "t_av", name: "Aveline" }, d: { state: "Bloodied", by: "[V]", cardLine: "Overhead Smash: Push 3" } },
  { id: "l7", r: 1, t: 1, own: { id: "t_av", name: "Aveline" }, k: "act", who: { id: "t_av", name: "Aveline" }, d: { name: "Smite", ap: 2, tg: [{ id: "t_oc", name: "Ogre Chieftain", tier: 3, crit: true }], roll: { dice: [11, 11], mod: 2, total: 25, dc: 14, def: "AD", crit: true, critDie: "1d10!=9", critType: "[R] Ho" } } },
  { id: "l8", r: 1, t: 1, own: { id: "t_av", name: "Aveline" }, k: "dmg", who: { id: "t_oc", name: "Ogre Chieftain" }, d: { n: 24, v: 10, r: 14, raw: 24, reducedBy: 0, origin: { id: "t_av", name: "Aveline" }, text: "10 Vigor, 14 Resolve" } },
  { id: "l9", r: 1, t: 1, own: { id: "t_av", name: "Aveline" }, k: "turn", who: { id: "t_av", name: "Aveline" }, d: { apSpent: 3, apMax: 4, apKept: 1, guard: 2, strikes: 1 } }
];
const st = EL.computeEncounterStats(log, creatures);
const av = st.rows.find(x => x.id === "t_av"), du = st.rows.find(x => x.id === "t_du");
console.log("2. Health Pressure %:", `Av raw=${av.rawTaken} red=${av.reducedTaken} net=${av.netTaken}/${av.maxHp} taken=${Math.round(av.takenPct)}% att=${Math.round(av.attemptedPct)}%`,
  "| Du prevented:", du.prevented, "| Party:", `${Math.round(st.party.takenPct)}% taken / ${Math.round(st.party.attemptedPct)}% att (${st.g9.label})`);
console.log("3. Section R watchlist:", `crits=${st.sectionR.crits.length} states=${st.sectionR.states.length} rxCol=${st.sectionR.rxCollision.length} push0=${st.sectionR.pushZero.length}`);

// 3. voidLast regression check (!x.off, no TDZ crash)
const vl = EL.logUpdate(log, { type: "voidLast", r: 1, t: 1, who: "t_av", name: "Smite", why: "Cancelled" });
console.log("4. voidLast fix:", !!vl && vl["flags.twod12.encl.l7.off"] === true);

// 4. Analysis Markdown export
const md = EL.exportAnalysis(log, creatures, { title: "Test Fight", outcome: "Overcome" });
console.log("5. Analysis export:", md.includes("Taken %") && md.includes("Attempted %") && md.includes("Party Total") && md.includes("Core Rework Watchlist (Section R)"));

// 5. Serialized archive & outcome preservation
combat.getFlag = (s, k) => (k === "encl" ? Object.fromEntries(log.map((x, i) => [x.id, { ...x, s: i }])) : {});
await Promise.all([EL.archiveCombat(combat), EL.archiveCombat(combat)]);
await EL.updateArchiveOutcome("cmb1", "Overcome");
await EL.archiveCombat(combat); // second archive must preserve Overcome
console.log("6. Archive serialized & outcome preserved:", archivedStore.length === 1 && archivedStore[0].outcome === "Overcome");

// 6. Image-1 World Clock & Time Bar HTML
const ch = CK.clockHtml(), bh = CK.barHtml();
console.log("7. World Clock & Time Bar:", ch.includes("clock-now") && ch.includes("clock-time") && ch.includes("+ 1 Min") && ch.includes("Dawn") && bh.includes("tb-readout") && bh.includes("tb-day") && bh.includes("tb-time"));

// 7. Theme CSS checks (zero undefined vars, red warning button fix, clock/timebar/enclog & global button centering)
const css = fs.readFileSync(ROOT + "styles/theme.css", "utf8");
const defined = new Set([...css.matchAll(/(--s-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const used = [...new Set([...css.matchAll(/var\((--s-[a-z0-9-]+)\)/g)].map(m => m[1]))];
const undef = used.filter(u => !defined.has(u));
console.log("8. CSS health:", `undef=${undef.length}`,
  "| darkWarnRed:", css.includes("background: #a8322a"),
  "| timebarBtn:", css.includes(".twod12-timebar button"),
  "| enclogCss:", css.includes(".twod12.enclog-app .el-pbar"),
  "| iconCenterFix:", css.includes("margin-inline-end: 0"));
