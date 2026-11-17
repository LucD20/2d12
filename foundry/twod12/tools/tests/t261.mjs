// Run with: node tools/tests/run.mjs (or node tools/tests/t261.mjs)
// Pack CARD-ONE step 3 (Lucas, 2026-11-17: the roll dialog and the chat result show the card's parts in the card's order): for every Action of the
// compendium, its first Version's card lines (cardlines.mjs, from the card model) are all in the roll dialog's card (rolldlg.mjs cardHtml) and in
// the chat card of its result (chatcards.mjs: attack, Save or no-roll), in the card's order; and the wiring (rollinput.mjs, actions.mjs) is there.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const enrichHTML = async t => String(t ?? "").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@(\w+)\[([^\]]*)\](?:\{([^}]*)\})?/g, (m, k, body, lab) => lab ?? body.split("|")[0]);
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
globalThis.foundry = deep(); globalThis.foundry.utils = { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) };
globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {}, statusEffects: [], time: {} }; globalThis.game = { settings: { get: () => false }, user: {}, combat: null }; globalThis.ui = { notifications: { warn() {}, info() {} } }; globalThis.canvas = {};
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "TextEditor", "Application", "Token", "TokenDocument", "Region", "RegionDocument"]) globalThis[n] ??= class {};
globalThis.fromUuid = async () => null;
const C = await import(ROOTURL + "tools/content.mjs");
globalThis.foundry.applications = { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML } } } };
const CL = await import(ROOTURL + "module/cardlines.mjs"), RD = await import(ROOTURL + "module/rolldlg.mjs"), CC = await import(ROOTURL + "module/chatcards.mjs");
const ACT = await import(ROOTURL + "module/actions.mjs"), CFG = await import(ROOTURL + "module/config.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const asItem = d => ({ id: d.name, name: d.name, type: d.type, getFlag: (s, k) => d.flags?.twod12?.[k], system: { ...d.system, traits: new Set(d.system.traits ?? []), versions: d.system.versions ?? [] } });
const acts = C.docs.filter(d => d.type === "action" && (d.system.versions ?? []).length).map(asItem).sort((a, b) => a.name.localeCompare(b.name));   // (Hide, a placeholder, has no Version)
const enrich = async t => enrichHTML(t);

/** The two faces of a Version, as the gallery builds them (foundry/gallery/gallery.mjs oneVersionFace). */
async function faces(item) {
  const it = item.system, v = it.versions[0], card = await CL.versionCardLines(item, v, { enrich });
  const mk = v.noTiers ? { outcomes: {}, effectsHtml: v.effects ?? "", dist: "" } : await ACT.attackModelParts({ it, item, version: v, weapon: null, cardCtx: { item, isWeapon: it.traits.has("weapon"), attrVal: 2 }, fxn: { all: [], t1: [], t2: [], t3: [] }, fxNames: () => "", areaSize: 0, chip: "Weapon" });
  const freq = CFG.effectiveFrequency(it), cost = `${v.ap} AP`;
  const roll = RD.cardHtml({ name: item.name, flavor: it.flavor ?? "", freqLabel: freq, roll: { name: "Weapon", mod: 2 }, canForce: false, chips: [], versions: [] }, { forceTier: 0, toggled: {}, manual: {} },
    { ap: v.ap, cost, traits: [], meta: { targets: it.targets ?? "", dist: "", vs: CFG.vsText(it, { rolls: true }) }, tiers: mk.outcomes, crit: v.critical ?? "", effects: mk.effectsHtml, effectsFrom: 2, noTiers: !!v.noTiers, card });
  const m = { name: item.name, freq, cost, traitsHtml: "", tline: { targets: it.targets ?? "", dist: "", names: ["Orc Warrior"] }, flavor: it.flavor ?? "", card };
  const result = v.noTiers ? CC.nonRollCardHtml({ ...m, kind: "noroll", effectHtml: mk.effectsHtml })
    : it.traits.has("save") ? CC.saveCardHtml({ ...m, kind: "save", saveName: "Instinct Save", dc: 13, tiers: mk.outcomes, creatures: [{ uuid: "t1", name: "Orc Warrior", result: null }] })
      : CC.attackCardHtml({ ...m, kind: "attack", hasDamage: true, outcomes: mk.outcomes, effectsHtml: mk.effectsHtml, effectsFrom: 2, critHtml: v.critical ?? "",
        rows: [{ name: "Orc Warrior", uuid: "t1", total: 15, dc: 15, dcLabel: "AD", d1: [6], d2: [7], boonFaces: [], baneFaces: [], sources: [], mods: [], tier: 2, base: 2, crit: false, doubles: false }] });
  return { card, roll, result };
}
const at = (html, label) => Math.max(html.indexOf(`<b>${label}</b>`), html.indexOf(`<b>${label}:</b>`));
const missing = [], order = [];
for (const item of acts) {
  const { card, roll, result } = await faces(item);
  // the roll dialog: every line; the chat result: every line but the Critical and the Effect (they show with the rolled Tier) and the roll line
  const all = [...card.top, ...card.before, ...card.after, ...(card.special ? [card.special] : [])].map(l => l.label);
  const res = [...card.top, ...card.before, ...(card.special ? [card.special] : [])].map(l => l.label);
  for (const l of all) if (at(roll, l) < 0) missing.push(`${item.name} (roll dialog): ${l}`);
  for (const l of res) if (at(result, l) < 0) missing.push(`${item.name} (chat): ${l}`);
  for (const [f, html, list] of [["roll dialog", roll, all], ["chat", result, res]]) {
    const pos = list.map(l => at(html, l)).filter(p => p >= 0);
    if (pos.some((p, i) => i && p < pos[i - 1])) order.push(`${item.name} (${f})`);
  }
}
console.log(`Actions: ${acts.length} | a card line missing from the roll dialog or the chat card: ${missing.length ? missing.join("; ") : "none"} | out of the card's order: ${order.join(", ") || "none"}`);
const sm = await faces(acts.find(a => a.name === "Smite"));
const txt = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log("Smite's roll dialog:", ["Smite dice", "Attack", "Tier 1", "Special"].map(l => `${l} ${at(sm.roll, l) >= 0}`).join(", "), "| its chat card:", ["Smite dice", "Special"].map(l => `${l} ${at(sm.result, l) >= 0}`).join(", "));
const rb = await faces(acts.find(a => a.name === "Rebuke"));
console.log("Rebuke's Save card: the Trigger above the Save:", at(rb.result, "Trigger") >= 0 && at(rb.result, "Trigger") < rb.result.indexOf("cc-savehead"), "|", txt(rb.result).slice(0, 120));
console.log("wired: the dialog's Versions carry the card's lines:", src("module/rollinput.mjs").includes("card = await versionCardLines(item, v0,"), "| the chat models:", (src("module/actions.mjs").match(/card: cardLines/g) ?? []).length, "| a card posted before keeps its old lines:", src("module/chatcards.mjs").includes("m.card ? cardLinesHtml(m.card.top) + cardLinesHtml(m.card.before) : triggerLineHtml(m)"));
