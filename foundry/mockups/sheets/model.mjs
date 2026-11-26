// The sheet mockups: the creatures and the sheet's model. The numbers are the system's own (data.mjs prepareDerivedData, run on the compendium
// actor); the Action rows, the strip and the side panel are built here with the sheet's pure pieces (sheetmodel.mjs, config.mjs, loadout.mjs,
// pcsheet.mjs handTiles), in the shape pcsheet.mjs pcModel gives the template (pcModel itself needs a live Foundry actor and combat).
import { asItem, enrichHTML } from "./stubs.mjs";
import { statSym } from "../../twod12/module/statsyms.mjs";   // v0.0.454 (D3): as pcsheet.mjs

const CFG = await import("../../twod12/module/config.mjs");
const SM = await import("../../twod12/module/sheetmodel.mjs");
const DATA = await import("../../twod12/module/data.mjs");
const PCS = await import("../../twod12/module/pcsheet.mjs");
const UTIL = await import("../../twod12/module/util.mjs");
const { TWOD12 } = CFG;
const F = "twod12";
const sg = v => (v >= 0 ? `+${v}` : `−${Math.abs(v)}`);
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const enrichCard = async (t, doc) => CFG.highlightText(await enrichHTML(t ?? "", doc ? { relativeTo: doc } : {}));

const PC_DEFAULTS = () => ({ level: 1, damage: { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, bodyWounds: 0, mindWounds: 0, rallyUsed: 0, size: 3, exhausted: 0, coins: 0,
  armor: "unarmored", ward: 0, guard: 0, dmgMods: "", reduceNext: 0, apGuard: 0, escalation: 1, healthHigh: "vigor", speciesHigh: "", tags: new Set(),
  senses: { dimlight: false, darksight: false, noHeat: false, hearing: 10, list: [] } });
const NPC_DEFAULTS = () => ({ ...PC_DEFAULTS(), attributes: { body: 0, mind: 0, appeal: 0, instinct: 0 }, speed: 5, weaponAttribute: "body", powerAttribute: "mind", modLead: "", role: "standard", npcRole: "",
  ratings: { body: "high", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "medium", damage: "medium", speed: "5", wmod: "", pmod: "" },
  custom: {}, armor: "medium", armorDef: 13, wardDef: 13, useEscalation: false, eliteLadder: true, reachBase: 1, steadiness: 0 });

/** A compendium actor as the modules read one: its items (with itemTypes), no effects, and its system prepared by the system's own data model.
 *  over: example state laid on the compendium data (damage taken, Escalation, a weapon drawn...): each page says what it set. */
export function makeActor(d, over = {}) {
  const npc = d.type === "npc";
  const a = { id: d.name, uuid: d.name, name: d.name, type: d.type, img: d.img, flags: d.flags ?? {}, effects: Object.assign([], { get: () => null }), statuses: new Set(), getFlag: (sc, k) => d.flags?.[sc]?.[k] };
  const items = d.items.map(i => asItem({ ...i, system: { ...i.system, ...(over.items?.[i.name] ?? {}) } }, a));
  a.items = Object.assign(items, { get: id => items.find(i => i.id === id) ?? null, has: id => items.some(i => i.id === id) });
  a.itemTypes = new Proxy({}, { get: (_, t) => items.filter(i => i.type === t) });
  const sys = new (npc ? DATA.NpcData : DATA.CharacterData)();
  const base = npc ? NPC_DEFAULTS() : PC_DEFAULTS();
  Object.assign(sys, base, d.system, over.system ?? {}, { ratings: { ...base.ratings, ...(d.system.ratings ?? {}) }, damage: { ...base.damage, ...(over.system?.damage ?? {}) } });
  if (!npc) delete sys.ratings;
  sys.parent = a; a.system = sys;
  sys.prepareDerivedData();
  return a;
}

/** The sheet's model (pcsheet.mjs pcModel's shape, the parts the page shows). st: the example state { inCombat, ap, rap, strikes, open: [names], round }. */
export function sheetModel(a, st = {}) {
  const s = a.system, d = s.damage, npc = a.type === "npc";
  const role = npc ? (TWOD12.npcRoles[s.role] ?? TWOD12.npcRoles.standard) : null, elite = npc && (s.role === "elite" || !!s.useEscalation);
  const inCombat = !!st.inCombat, escNow = Number(s.escalation) || 0;
  const cls = a.itemTypes.class[0] ?? null, sp = a.itemTypes.species[0] ?? null;
  const weapons = a.itemTypes.weapon;
  const open = new Set(st.open ?? []);
  const head = { npc, role: role?.label ?? "", roleKey: s.role ?? "", cv: npc ? (s.cv ?? role.cv?.[0] ?? "") : "", isGM: true,
    species: sp ? { id: sp.id, name: sp.name } : null, cls: cls ? { id: cls.id, name: cls.name } : null, size: CFG.SIZE_NAMES[s.size ?? 3] ?? "",
    combat: inCombat ? { mode: "status", text: `In combat · Round ${st.round ?? 1}` } : { mode: "none" } };
  const apMax = Number(s.apPerTurn) || 4, ap = st.ap ?? apMax, rap = st.rap ?? 1, strikes = st.strikes ?? 0;
  const passives = a.itemTypes.feature.filter(f => f.system?.escalationPassive);
  const rungNames = {};
  for (const p of passives) { const r = Number(p.system.escalationRung) || 0; if (r > 0) (rungNames[r] ??= []).push(p.name); }
  const apexAt = Math.max(0, ...a.itemTypes.action.map(i => Number(i.system?.escalation) || 0)), apex = apexAt > 0;
  const strip = {
    inCombat, ap: { pips: SM.apPips(ap, apMax, 0).map((p, k) => ({ ...p, n: k + 1 })), rap: !!rap, tip: "" },
    guard: { total: (Number(s.guard) || 0) + (Number(s.apGuard) || 0) },
    esc: { n: escNow, rungs: SM.escRungs(escNow, rungNames, apex, apexAt), hooks: SM.hooksLeft(st.hooks ?? [], {}).join(" · "), momentum: 0 },
    senses: SM.senseChips(s.senses ?? {}), strikePips: SM.strikePips(strikes), strikesLeft: Math.max(0, 3 - strikes), nextBane: "",
    elite, eliteRungs: (SM.ELITE_RUNGS ?? []).map(r => ({ ...r, lit: escNow >= r.n })),
    phases: `Phases: Bloodied +1 ${s.bloodied ? "✓" : "not yet"} · Strained +1 ${s.strained ? "✓" : "not yet"}`
  };
  const hands = { tiles: PCS.handTiles(weapons, inCombat) };
  const tags = SM.healthTags(s), dom = SM.dominantPool(s.bodyDamage, s.mindDamage);
  const health = { pool: s.pool, toDown: SM.toDown(s.pool, s.totalDamage), damage: s.totalDamage, down: { down: false }, dominant: dom, domColor: dom === "Resolve" ? "#8fb3ee" : dom === "Vigor" ? "#ef8a80" : "#c9cfda",
    bars: [
      { name: "Vigor", label: "#ef8a80", pool: "body", value: s.bodyDamage, max: s.bdt, tag: tags.bloodied ? "BLOODIED" : "", bg: "#c4453c", solid: "#c4453c", dark: "#7f2a24", seg: SM.barSegments(d.bodyLethal, d.bodyNonlethal, s.bdt) },
      { name: "Resolve", label: "#8fb3ee", pool: "mind", value: s.mindDamage, max: s.mdt, tag: tags.strained ? "STRAINED" : "", bg: "#3a6fc4", solid: "#5b8ad6", dark: "#3a5f99", seg: SM.barSegments(d.mindLethal, d.mindNonlethal, s.mdt) }
    ] };
  const rally = { left: s.rallyLeft, max: s.rallyMax, heal: s.rallyHeal, pips: Array.from({ length: s.rallyMax }, (_, k) => k < s.rallyLeft) };
  const vs = SM.vsDefenses(s.attributes, {});
  const defs = { main: [{ label: "AD", sym: npc ? statSym("ad") : "", value: s.armorDC, cls: "" }, { label: "WD", sym: npc ? statSym("wd") : "", value: s.wardDC, cls: "" }],
    vs: [["body", "vs Body"], ["mind", "vs Mind"], ["appeal", "vs Appeal"], ["instinct", "vs Inst."]].map(([k, l]) => ({ label: l, value: vs[k] })) };
  const attrs = Object.entries(TWOD12.attributes).map(([key, label]) => ({ key, label, value: sg(s.attributes?.[key] ?? 0) }));
  const move = [{ label: "Speed", sym: npc ? statSym("speed") : "", value: s.moveSpeed ?? s.speed, cls: "" }, { label: "Reach", sym: npc ? statSym("reach") : "", value: s.reach ?? 1 }, { label: "Size", sym: npc ? statSym("size") : "", value: `${["", "Tiny", "Small", "Med.", "Large", "Huge", "Garg.", "Titanic"][s.size ?? 3]} (${s.size ?? 3})` }, { label: "Steady", sym: npc ? statSym("steady") : "", value: s.steadiness ?? 0 }];
  const dcs = SM.saveDCs({ weapon: s.weaponMod, power: s.powerMod, signature: s.signatureMod });
  const usesPower = a.itemTypes.action.some(i => ["magic", "power"].some(t => i.system?.traits?.has?.(t)));
  const from = npc ? "Role" : "Class";
  const mods = npc ? [{ label: "Weapon", attr: from, value: sg(s.weaponMod), dc: `DC ${dcs.weapon}` }, ...(usesPower ? [{ label: "Power", attr: from, value: sg(s.powerMod), dc: `DC ${dcs.power}` }] : [])]
    : [{ label: "Weapon", attr: from, value: sg(s.weaponMod), dc: `DC ${dcs.weapon}` }, { label: "Power", attr: from, value: sg(s.powerMod), dc: `DC ${dcs.power}` },
      { label: "Signature", attr: s.signatureFrom === "power" ? "Power" : "Weapon", value: sg(s.signatureMod), dc: `DC ${dcs.signature}` }];
  const wounds = [{ key: "body", label: "Body Wounds", count: 0, named: [], table: "dying", tableName: "Dying", check: "Body" }, { key: "mind", label: "Mind Wounds", count: 0, named: [], table: "shattered", tableName: "Shattered", check: "Mind" }];

  // ---- the Action rows (pcsheet.mjs rowOf, without the live checks: every row can be used)
  const held = weapons.filter(w => w.system.wielded && !w.system.traits.has("barehanded"));
  const fits = (it, w) => (it.traits.has("ranged") ? w.system.traits.has("ranged") : it.traits.has("melee") ? w.system.traits.has("melee") : true);
  const rowOf = i => {
    const it = i.system, reaction = !!it.reaction, fq = CFG.effectiveFrequency(it), basicKey = i.getFlag(F, "basic");
    const own = a.items.get(i.getFlag(F, "weaponId")), weapon = own ?? held.find(w => fits(it, w)) ?? null;
    const isWeapon = it.traits.has("weapon") && !npc;
    const usable = isWeapon ? (own ? [own] : held.filter(w => fits(it, w))) : [];
    const grip = w => ((Number(w.system.hands) || 1) >= 2 ? "2H" : "1H");
    const area = CFG.areaText(it), dist = CFG.distanceText(it, weapon) || (reaction && Number(it.momentRange) > 0 ? String(it.momentRange) : "");
    const sec = SM.actionSection({ basic: !!basicKey, basicKey, reaction, escalation: Number(it.escalation) || 0, frequency: fq });
    const fists = it.weaponUse === "fists" || basicKey === "fists";
    const strike = !!it.traits.has("strike") || basicKey === "opportunityAttack";
    const subs = [];
    if (npc && it.basicAttack) subs.push(`Basic attack · ${TWOD12.npcRatings[it.basicRating || "medium"]?.label ?? ""}`);
    if (area) subs.push(`Area: ${area}`);
    const aps = (it.versions ?? []).map(v => v.ap), fqWord = reaction ? ({ atwill: "At-will", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily" }[fq] ?? "") : "";
    const vsT = SM.vsShort(CFG.vsText(it, { fists }));
    const esc2 = Number(it.escalation) || 0, lock = esc2 > 0 && escNow < esc2;
    return { id: i.id, name: i.name, item: i, sub: subs.join(" · "), fav: false, section: sec, lines: SM.rowLines({ frequency: fq, reaction, strike }), frequency: fq, aps, reaction,
      cost: [fqWord, SM.costPill(aps, reaction)].filter(Boolean).join(" · "), fc: (SM.SHEET_FREQ[reaction ? "reaction" : sec] ?? SM.SHEET_FREQ[fq] ?? SM.SHEET_FREQ.atwill).color,
      dist: area ? (String(it.areaDistance ?? "").trim() ? SM.distanceShort(dist) : "—") : SM.distanceShort(dist), vs: vsT, vsKind: UTIL.vsKind(vsT),
      off: lock, offWhy: lock ? `Needs Escalation ${esc2} (now ${escNow})` : "", weapon: isWeapon, grip: usable[0] ? grip(usable[0]) : "", unloaded: false,
      grant: null, handBtns: lock || npc || !usable.length ? null : usable.map(w => ({ id: w.id, name: w.name, grip: grip(w), tip: `Use with ${w.name}` })),
      open: open.has(i.name), basicAtk: !!(npc && it.basicAttack), auto: CFG.autoChip(it.automation, it.automationNote), freqLine: SM.rowLines({ frequency: fq, strike }), escalation: esc2 };
  };
  const actions = a.itemTypes.action;
  const secRows = Object.fromEntries(SM.SECTION_ORDER.map(k => [k, []]));
  for (const i of actions) {
    const b = i.getFlag(F, "basic");
    if (b && b !== "opportunityAttack") continue;
    const row = rowOf(i);
    secRows[row.section]?.push(row);
  }
  const SEC_META = {
    apex: { title: `Escalation ${apexAt || 1}`, sub: "in combat only", dot: "#c9821f", cls: "escal" },
    round: { title: SM.SHEET_FREQ.round.label, dot: SM.SHEET_FREQ.round.color }, turn: { title: SM.SHEET_FREQ.turn.label, dot: SM.SHEET_FREQ.turn.color },
    encounter: { title: SM.SHEET_FREQ.encounter.label, dot: SM.SHEET_FREQ.encounter.color }, daily: { title: SM.SHEET_FREQ.daily.label, dot: SM.SHEET_FREQ.daily.color },
    atwill: { title: SM.SHEET_FREQ.atwill.label, dot: SM.SHEET_FREQ.atwill.color }, reaction: { title: SM.SHEET_FREQ.reaction.label, dot: SM.SHEET_FREQ.reaction.color }, granted: { title: "Granted", dot: "#4a5a78" }
  };
  const sections = SM.SECTION_ORDER.filter(k => secRows[k].length && (inCombat || npc || k !== "apex")).map(k => ({ key: k, ...SEC_META[k], rows: secRows[k] }));
  const NPC_HIDE = new Set(["basicWeaponAttack", "fists", "reload", "regrip", "release"]);
  const basics = actions.filter(i => i.getFlag(F, "basic") && i.getFlag(F, "basic") !== "opportunityAttack" && !(npc && NPC_HIDE.has(i.getFlag(F, "basic"))));
  const bRow = i => {
    const f = CFG.effectiveFrequency(i.system), key = i.getFlag(F, "basic");
    const why = SM.basicUnavailable(key, { freeHand: PCS.handTiles(weapons, inCombat).some(t => t.free), reloadWeapon: held.some(w => w.system.traits.has("reload")), prone: false, immobilized: false, speed: s.moveSpeed ?? s.speed, reach: s.reach ?? 1, down: false, rallyLeft: s.rallyLeft, npc }) || "";
    return { id: i.id, name: i.name, item: i, cost: SM.costPill((i.system.versions ?? []).map(v => v.ap)), fc: f === "round" ? SM.SHEET_FREQ.round.color : SM.SHEET_FREQ.atwill.color,
      lines: SM.rowLines({ frequency: f, strike: !!i.system.traits.has("strike"), off: !!why }), off: !!why, offWhy: why, next: "", open: open.has(i.name), weaponId: "" };
  };
  const basic = TWOD12.basicGroups.map(g => ({ key: g.key, label: g.label, rows: g.names.map(n => basics.find(i => i.name === n)).filter(Boolean).map(bRow) })).filter(g => g.rows.length);
  const tabs = (npc ? [["actions", "Actions"], ["effects", "Effects", 0], ["builder", "Builder"], ["loot", "Loot"], ["notes", "GM notes"]]
    : [["actions", "Actions"], ["effects", "Effects", 0], ["items", "Items"], ["build", "Build", 0], ["mastery", "Mastery"], ["upkeep", "Upkeep"], ["notes", "Notes"]]).map(([k, l, n]) => ({ k, l, n: n || 0 }));
  let dmgHtml = "", rwLines = [];
  try {
    const DL = st.dl, CD = st.cd;
    rwLines = CD.creatureDamageLines(a);
    dmgHtml = DL.damageBlockHtml(DL.damageBlockModel(rwLines, { gm: true }), { line: true, syms: npc ? { Immune: statSym("immune"), Resist: statSym("resist"), Weak: statSym("weak") } : null });
  } catch (e) { console.warn("damage block", e); }
  let builder = null;
  if (npc) { try { builder = PCS.npcBuilderModel(a); } catch (e) { console.warn("builder", e); } }
  return { npc, guardSym: npc ? statSym("guard") : "", builder, loot: npc ? [] : null, head, strip, hands, chips: [], health, rally, defs, attrs, move, mods, wounds, sections, basic, favRows: [], tabs, untrained: "",
    effects: { conditions: [], effects: [] }, weapons: [], armor: [], build: { cards: [], levels: [], esc: [], other: [], next: [], emptySlots: [] }, mastery: [], upkeep: { cards: [] }, down: { down: false }, dmgHtml, rwLines, modConflict: "" };
}
