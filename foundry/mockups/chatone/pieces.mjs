// Step 6, option C (Lucas, 2026-11-17: "C, proceed"): one message per Action. Draws the pieces with the system's own functions
// (chatcards.mjs, as style-build.mjs does) and writes pieces.json for build.py:  node foundry/mockups/chatone/pieces.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ICONS } from "../npc-hud-icons.mjs";

const here = f => fileURLToPath(new URL(f, import.meta.url));
const ic = n => { const [vb, d] = ICONS[n]; return `<svg class="ic" viewBox="${vb}" aria-hidden="true"><path d="${d}"/></svg>`; };
const FA = html => html.replace(/<i class="fa-solid fa-([a-z0-9-]+)([^"]*)"([^>]*)><\/i>/g, (m, n, rest, attrs) => (ICONS[n] ? `<i class="${rest.trim()}" data-ic="${n}"${attrs}>${ic(n)}</i>` : m));

globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {} };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: () => false } };
const CC = await import("../../twod12/module/chatcards.mjs"), RL = await import("../../twod12/module/roll.mjs");

const D = f => ({ faces: f, total: CC.dieValue(f), first: f[0] });
const row = (d1, d2, total, dc, extra = {}) => ({ name: "Orc Warrior", uuid: "t1", total, dc, dcLabel: "AD", d1, d2, boonFaces: [], baneFaces: [], sources: [], mods: [{ v: 2, label: "Weapon" }], ...extra, ...(() => { const x = RL.keepDice([D(d1), D(d2)], "", total - CC.dieValue(d1) - CC.dieValue(d2), dc); return { tier: x.tier, base: x.base, crit: x.crit, doubles: x.doubles }; })() });
const atk = { kind: "attack", name: "Smite", freq: "round", cost: "2 AP", traitsHtml: "", tline: { targets: "One creature", dist: "Weapon", names: ["Orc Warrior"] }, hasDamage: true };
const comps = [{ pool: "B", sub: "Sl", total: 9, formula: "2d6", dice: [{ faces: 6, results: [4, 5] }], src: "Greatsword" }, { pool: "B", sub: "Sl", total: 2, kind: "A", dice: [], label: "Weapon" }, { pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }], src: "Smite" }];
const dm = rows => ({ kind: "dmg", name: "Smite", nl: false, groups: [{ tier: 2, comps, riders: [], rows: rows.map((r, i) => i) }], rows });
const view = CC.viewOf({ gm: true });

const out = {
  attack: FA(CC.attackCardHtml({ ...atk, rows: [row([4], [9], 15, 13)] })),
  dmgPending: FA(CC.damageCardHtml(dm([{ name: "Orc Warrior", mods: [], choice: "", applied: null }]), view)),
  dmgApplied: FA(CC.damageCardHtml(dm([{ name: "Orc Warrior", mods: [], choice: "", applied: { took: { B: 11, M: 7 }, state: "", factor: 1, mods: [] } }]), view))
};
writeFileSync(here("pieces.json"), JSON.stringify(out));
console.log("ok", Object.keys(out).map(k => `${k} ${out[k].length}`).join(", "));
