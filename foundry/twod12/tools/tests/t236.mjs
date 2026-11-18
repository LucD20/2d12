// Run with: node tools/tests/run.mjs (or node tools/tests/t236.mjs)
// v0.0.347 (playtest 4, Step 3, "a quieter chat"): follow-ups inside their card, the granted Action before Apply, no uses-left card, the Reactions'
// lines, the granted uses as a list per target, the roll card's Boons and Banes, the Applied line, the Damage button used, the Save condensed, Rally.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const src = n => fs.readFileSync(ROOT + n, "utf8");
const deep = () => new Proxy(function () {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()), construct: () => deep(), apply: () => deep() });
globalThis.foundry = deep(); Object.assign(globalThis.foundry, { utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) } });
for (const n of ["Combat", "Combatant", "Actor", "Item", "ChatMessage", "TokenDocument", "Token", "Roll", "ActiveEffect", "Region", "JournalEntry", "Scene", "Application", "TextEditor"]) globalThis[n] ??= class { static create() {} };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {} }; globalThis.game = { settings: { get: () => false }, user: { isGM: true } };
const txt = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// 1. Follow-ups
const FU = await import(ROOTURL + "module/followup.mjs");
console.log("the block:", txt(FU.followHtml([{ icon: "fa-shield-heart", html: "<b>Ogre Chieftain</b> gains <b>Guard 6</b>." }, { icon: "fa-hand", html: "<b>Orc Warrior</b> is Pushed 1." }])), "| none:", JSON.stringify(FU.followHtml([])));
console.log("Guard and forced movement go through it:", src("module/inline.mjs").includes('await postFollow(ctx.message, "fa-shield-heart"'), (src("module/move.mjs").match(/postFollow\(opts\.msg/g) ?? []).length === 3, "| the GM writes another user's card:", src("module/damage.mjs").includes('data?.type === "followUp"'));

// 2-3. The granted Action before the steps; no uses-left card
const cc = src("module/chatcards.mjs");
console.log("granted first:", cc.includes('return `<div class="cc-slot">${grant}</div>${steps ?'), "| no uses-left card:", !src("module/freeuse.mjs").includes("use\" : \"uses\";"));

// 4. Reactions
const M = await import(ROOTURL + "module/moment.mjs");
console.log("No Reactions line:", txt(M.nobodyLine([{ actor: { name: "Sylwen (Elf Archer, Quick Shots, level 1)" }, item: { name: "Overwatch" }, why: "no AP left (it costs 1R)" }])));
console.log("used line:", txt(M.usedLine({ rows: [{ state: "use", order: 1, name: "Aveline (Human Paladin)", itemName: "Rebuke", targetName: "Orc Warrior" }, { state: "pass", name: "x" }] })), "|", M.usedLine({ rows: [] }));
const mo = src("module/moment.mjs");
console.log("the triggering card reprinted after a Trigger's chain:", mo.includes('["against", "landed"].includes(st.base?.kind) && st.base?.msgId && !st.base?.never'), "| settings:", mo.includes('"rxNobodyLine"') && mo.includes('"rxNobodySeconds"') && mo.includes("default: 5"));

// 5. Granted uses: one small button per target
const FR = await import(ROOTURL + "module/freeuse.mjs");
const actor = { effects: { get: () => ({ getFlag: () => [{ left: 2 }] }) } };
const rows = FR.grantRowsHtml(actor, { effects: [{ id: "e", index: 0, count: 2, actionName: "Weapon Attack" }], targets: [{ uuid: "T.ogre", name: "Ogre Chieftain" }, { uuid: "T.thug", name: "Bandit Thug" }] });
console.log("Double Shot's list:", txt(rows), "| each targets its creature:", rows.includes('data-target="T.ogre"') && rows.includes('data-target="T.thug"'), "| no label:", !rows.includes("Granted Action"));

// 6. The roll card
const C = await import(ROOTURL + "module/chatcards.mjs");
const r = { d1: [6], d2: [7], total: 15, tier: 2, dc: 13, dcLabel: "AD", boons: [{ name: "Marked Quarry", n: 1 }], banes: [{ name: "Situational", n: 1 }], mods: [{ v: 2, label: "Weapon" }] };
const bd = C.breakdownHtml({ ...r, bb: [{ kind: "boon", val: 1, name: "Marked Quarry" }, { kind: "bane", val: -1, name: "Situational" }] }, { applied: [{ name: "Killer's Focus", uuid: "Item.kf" }] });
console.log("breakdown:", txt(bd).slice(0, 160), "| Applied is a link:", bd.includes('data-uuid="Item.kf"'));
console.log("the Damage button used:", src("module/followup.mjs").includes('b.classList.add("dmg-used")'), "| the Save condensed once rolled:", cc.includes("${rolled.length < cs.length ? quiet : \"\"}"));   // v0.0.431: once every creature rolled, only the Tiers rolled

// 8. Rally
const ra = src("module/rally.mjs");
console.log("Rally's lines:", ra.includes("} healing`].filter(Boolean)") && ra.includes("rallyCard(`${sub}<br>${result}`)"), "| a Heal button where Damage would be:", src("module/followup.mjs").includes("export function addHealButton(msg, html)"));

// v0.0.348 (Lucas on v0.0.347)
const mk = src("module/mark.mjs");
console.log("several marks on one token:", mk.includes("out.set(q.uuid, [...(out.get(q.uuid) ?? []), src])") && mk.includes('(marks.get(token.document?.uuid) ?? [""]).forEach((src, k) =>'));
console.log("Doubles in gold:", C.stampHtml({ tier: 3, base: 2, doubles: true, total: 20, dc: 13 }).includes('class="cc-stamp t3 dbl"') && C.tierPill(2, false, false, true).includes(" dbl"), "| none without:", !C.stampHtml({ tier: 2, total: 15, dc: 13 }).includes("dbl"));
console.log("grant order:", FR.grantTargetOrder([{ uuid: "a", name: "Ogre" }, { uuid: "b", name: "Thug" }], ["b"], 1).map(t => t?.name).join(", "), "| the bar targets:", src("module/freeuse.mjs").includes('await useGrantOf(t.actor, b.dataset.effectId, Number(b.dataset.index) || 0, b.dataset.target ?? "")'));
console.log("reprint after the Reaction's damage:", M.dealsDamage({ system: { versions: [{ t1: [{ dice: "1d6" }] }] } }), M.dealsDamage({ system: { versions: [{ t1: [] }] } }), "| waits for the damage card applied:", mo.includes("if (!s?.rows?.length || !s.rows.every(r => r.applied)) return;") || src("module/moment.mjs").includes("if (!s?.rows?.length || !s.rows.every(r => r.applied)) return;"));
console.log("the used line as a title bar:", txt(M.usedBarHtml({ rows: [{ state: "use", order: 1, name: "Aveline", itemName: "Rebuke", targetName: "Ogre Chieftain" }] })), M.usedBarHtml({ rows: [] }).includes('class="twod12 chat rx2 rxused"'));
