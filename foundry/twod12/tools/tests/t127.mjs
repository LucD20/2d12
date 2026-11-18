// Run with: node tools/tests/run.mjs (or node tools/tests/t127.mjs)
// v0.0.148: fixes before the Paladin: book damage notation in Saves, Slowed lowers the most AP, Down states add Slowed as a rider,
// going Down asks the player, one Version at a time on description cards, Split Effects once, Reload always listed.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.CONST = { TOKEN_DISPOSITIONS: {} }; globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u" }, combat: null };
const I = await import(ROOTURL + "module/inline.mjs");
console.log("Save damage:", ["1d8 Fi", "[B] 1d8 Fi", "[M] 2d6 Ho", "1d4 Fire", "1d8[body,fire]", "2d6"].map(t => { const d = I.parseParts(t).damage[0]; return `${t} -> ${d.formula}${d.pool ? " " + d.pool : ""}${d.sub ? " " + d.sub : ""}`; }).join(" | "));
const cb = await import(ROOTURL + "module/combat.mjs");
const fx = (id, value, rider) => ({ statuses: new Set([id]), getFlag: (s, k) => (k === "value" ? value : k === "rider" ? rider : undefined) });
const a = (effects, statuses = []) => ({ effects, statuses: new Set(statuses) });
console.log("Quickened 1 + Slowed 2: regain", cb.apPerTurn({ actor: a([fx("quickened", 1), fx("slowed", 2)]) }), "most", cb.apMax({ actor: a([fx("quickened", 1), fx("slowed", 2)]) }), "| Desperate rider Slowed 1: regain", cb.apPerTurn({ actor: a([fx("slowed", 1, "down")], ["desperate"]) }));
// The rider: Slowed 1, or 1 more than the other Slowed (to at most 3).
const D = await import(ROOTURL + "module/down.mjs");
const made = [];
const actor = (statuses, others) => ({ statuses: new Set(statuses), effects: others.map(v => ({ statuses: new Set(["slowed"]), disabled: false, getFlag: (s, k) => (k === "value" ? v : undefined) })), createEmbeddedDocuments: async (t, d) => made.push(d[0].name) });
for (const [st, o] of [[["desperate"], []], [["dying"], [1]], [["shattered"], [2]], [["dying"], [3]], [[], [2]]]) { made.length = 0; await D.syncDownSlowed(actor(st, o)); console.log(`${st.join("") || "not Down"} + other Slowed ${o.join(",") || "none"} -> ${made[0] ?? "no rider"}`); }
const src = n => fs.readFileSync(ROOT + n, "utf8");
const down = src("module/down.mjs"), main = src("module/twod12.mjs"), pv = src("module/preview.mjs"), ac = src("module/actioncard.mjs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css"), content = src("tools/content.mjs");
console.log("going Down: >= 50% Nonlethal Unconscious", down.includes('if (s.nonlethal >= pool / 2) return setStatus(actor, "unconscious", true);'), "| some Nonlethal: ask", down.includes("Keep fighting (Desperate)"), "| none: Dying/Shattered, Table once per encounter, then ask", down.includes('downTableCombat') && down.includes("await chooseFight(actor, kind);"));
console.log("taking damage while fighting: Check, Tier 1-2 Table", down.includes("if (tier <= 2) await rollTable(actor, kind);"), "| end of turn: Tier 1 Table, collapsed Tier 3 stabilizes", down.includes("if (tier === 1) await rollTable(actor, kind);") && down.includes("stabilizes: no longer"), "| asked to the player who owns it:", down.includes("game.users.find(u => u.active && !u.isGM && actor.testUserPermission?.(u, \"OWNER\"))"), "| registered", main.includes("registerDownHooks();"));
console.log("description cards: an old chat card's Versions still switch (v0.0.439: its builder retired)", pv.includes("export function registerVersionTabs()") && css.includes(".rawcard .rawv.off, .twod12.rawcard .rawv.off { display: none !important; }"), "| Split Effects once", src("module/cardview.mjs").includes("all.findIndex(w => w.ap === v.ap && w.effects === v.effects) === i")   /* v0.0.297: effectLines in cardview.mjs */, "| Reload always listed", !sh.includes("reloadInHand"));
console.log("Slowed text: lowers the most AP, Desperate/Dying/Shattered", content.includes("your most AP is lowered by the value too") && content.includes("Desperate, Dying and Shattered make you Slowed 1"));
