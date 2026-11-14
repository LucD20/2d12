// v0.0.323 PACK EFFECT-SHEET (Lucas's design: foundry/mockups/effect-sheet-brief.md, the approved look effect-rules-mockups.html, "Prototype C").
// The pure model of the Details tab's rules: no Foundry here, the tests load it.
//   - the rule kinds, their defaults and a normalizer (numbers clamped, unknown traits dropped);
//   - the Action filter ("Has all of / Has one of / But not") in the book's notation;
//   - migrate: the old settings (and the effect's own fields) -> rules and Ends (every effect, Feature and Talent, on load);
//   - compile: rules and Ends -> the old settings and fields every module already reads (appliedflags.mjs, passives, auras, zones, mastery,
//     Bleed, the Escalation blocks...), so nothing that worked stops working; the new behaviors are new fields on those settings;
//   - the sentences (the pane's colored one and the hover card's plain one), the list labels, the part summaries, the Ends sentence;
//   - formulas: numbers, + - * / x ÷, ( ), floor( ), ceil( ), dice, @origin.<name> and @target.<name>.
// A rule: { id, kind, ...its fields }. The view (fxsheet.mjs) draws them; the item sheet saves { rules, ends } and the compiled fields together.
import { TWOD12 } from "./config.mjs";
import { SUBS as SUB_INK } from "./chatcards.mjs";
import { turnCycleBlocked } from "./usage.mjs";

const T = () => TWOD12;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.trunc(Number(n)) || 0));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const andJoin = a => (a.length < 2 ? (a[0] ?? "") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const orJoin = a => (a.length < 2 ? (a[0] ?? "") : `${a.slice(0, -1).join(", ")} or ${a.at(-1)}`);
const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const plural = (n, w) => `${n} ${w}${Number(n) === 1 ? "" : "s"}`;
let seq = 0;
export const newRuleId = () => `r${Date.now().toString(36)}${(seq++).toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;

/* ------------------------------------------------------------------ the kinds */
/** Each kind: its title, its tile (a letter and a color class) and its menu group. Legacy kinds are not offered by "+ Add rule". */
export const RULE_KINDS = {
  act: { title: "On matching Actions", tile: "±", cls: "bb", group: "Rolls and values" },
  value: { title: "Changes a value", tile: "V", cls: "rule", group: "Rolls and values" },
  grant: { title: "Grants an Effect or Action", tile: "G", cls: "cond", group: "Gives" },
  weap: { title: "Weapons (properties, Mastery)", tile: "W", cls: "wp", group: "Gives" },
  esc: { title: "Escalation hook", tile: "E", cls: "esc", group: "Gives" },
  uses: { title: "More uses of a Frequency", tile: "U", cls: "esc", group: "Gives" },
  aura: { title: "Aura", tile: "A", cls: "au", group: "Areas" },
  light: { title: "Light", tile: "L", cls: "lt", group: "Areas" },
  zone: { title: "Zone (old layout)", tile: "Z", cls: "au", legacy: true },   // v0.0.327: an Effect's Zone is "Where it is: On the map"; an old rule left on a Feature still reads
  move: { title: "Movement limit", tile: "M", cls: "rule", group: "Limits" },
  bleed: { title: "Lingering (condition)", tile: "L", cls: "tk", legacy: true },
  builtin: { title: "Condition rule", tile: "C", cls: "cond", legacy: true },
  raw: { title: "Old setting", tile: "?", cls: "rule", legacy: true }
};
export const ADD_MENU = [["Rolls and values", ["act", "value"]], ["Gives", ["grant", "weap", "esc", "uses"]], ["Areas", ["aura", "light"]], ["Limits", ["move"]]];

/* ------------------------------------------------------------------ the Action filter */
/** The filter picker's groups: the trait groups (TWOD12.traitGroups), the Roll group with the roll kinds Save, Check and Attack (by roll kind, Chapter 1). */
export function filterGroups() {
  const tg = T().traitGroups ?? [];
  return tg.map(g => {
    let keys = g.traits.filter(k => k !== "save");
    if (g.key === "roll") keys = [...keys, "__save", "__check", "__attack", "__attr"];
    if (g.key === "requires") keys = [...keys, "__twohanded"];
    return { key: g.key, label: g.label, traits: keys.sort((a, b) => traitLabel(a).localeCompare(traitLabel(b))) };
  });
}
/** A filter trait's name: "Strike", "Save" (the roll kind), "Smite" (an Action by name). */
export function traitLabel(k) {
  const s = String(k ?? "");
  if (s.startsWith("__name:")) return cap(s.slice(7).replace(/-/g, " "));
  if (s === "save") return "Save";
  return T().traits?.[s] ?? T().rollKinds?.[s] ?? s;
}
/** The group of a trait (its color): roll, requires, kind, damage, keywords. */
export function traitGroup(k) {
  const s = String(k ?? "");
  if (["__save", "__check", "__attack", "__attr"].includes(s)) return "roll";
  if (s === "__twohanded") return "requires";
  return (T().traitGroups ?? []).find(g => g.traits.includes(s))?.key ?? "keywords";
}
const known = k => typeof k === "string" && k && (k in (T().traits ?? {}) || k in (T().rollKinds ?? {}) || k.startsWith("__name:"));
/** A filter with known traits only, each in one line (all wins over any, any over not). */
export function normFilter(f = {}) {
  const all = [...new Set((f.all ?? []).filter(known))], any = [...new Set((f.any ?? []).filter(known))].filter(k => !all.includes(k));
  const not = [...new Set((f.not ?? f.none ?? []).filter(known))].filter(k => !all.includes(k) && !any.includes(k));
  return { all, any, not };
}
/** The book's notation: "[Melee, Strike] Actions, not [Divine]"; "[Strike] Actions that are [Melee] or [Ranged]"; "" = any Action. */
export function filterText(f) {
  const { all, any, not } = normFilter(f), br = a => a.map(k => `[${traitLabel(k)}]`);
  let s = all.length ? `[${all.map(traitLabel).join(", ")}] Actions` : "";
  if (any.length) s = `${s ? `${s} that are ` : "Actions that are "}${orJoin(br(any))}`;
  if (not.length) s = `${s || "Actions"}, not ${orJoin(br(not))}`;
  return s;
}
/** Does a roll with these traits match the filter? (the same test as effects.mjs matches). */
export const filterMatches = (f, traits) => { const { all, any, not } = normFilter(f), has = k => traits?.has?.(k) ?? false; return all.every(has) && (!any.length || any.some(has)) && !not.some(has); };

/* ------------------------------------------------------------------ formulas */
const REF_NAMES = { pow: "Power Modifier", wpn: "Weapon Modifier", sig: "Signature Modifier", body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct", stage: "Stage" };
/** "@origin.pow + 2" -> "the origin's Power Modifier + 2" (sentences). */
export const formulaWords = t => String(t ?? "").replace(/@(origin|target)\.(\w+)/g, (m, w, k) => `the ${w}'s ${REF_NAMES[k] ?? k}`).replace(/\*/g, "×").replace(/\//g, "÷");
/** The old formula names (power, weapon...: the creature's own) -> the new syntax. */
export function migrateFormula(t) {
  const map = { power: "pow", magic: "pow", weapon: "wpn", signature: "sig", body: "body", mind: "mind", appeal: "appeal", instinct: "instinct" };
  return String(t ?? "").replace(/(?<![@.\w])(power|magic|weapon|signature|body|mind|appeal|instinct)\b/g, (m, k) => `@target.${map[k]}`);
}
/** The new syntax -> the old names the readers know (rally.mjs). The origin's values are read as the creature's own there (a passive's origin is its owner). */
export const oldFormula = t => String(t ?? "").replace(/@(?:origin|target)\.(pow|wpn|sig|body|mind|appeal|instinct)\b/g, (m, k) => ({ pow: "power", wpn: "weapon", sig: "signature" }[k] ?? k));
/**
 * Check and evaluate a formula. vals: { origin: { pow, ... }, target: { ... } }. dice: true keeps dice ("1d6 + 3" after the refs are numbers).
 * Returns { ok, value (a number, or the text with numbers when dice), error }. An invalid formula counts as 0.
 */
export function evalFormula(text, vals = {}, { dice = false } = {}) {
  const src = String(text ?? "").trim();
  if (!src) return { ok: true, value: dice ? "" : 0, error: "" };
  let bad = "";
  const subst = src.replace(/@(origin|target)\.(\w+)/g, (m, w, k) => { if (!(k in REF_NAMES)) { bad = `unknown name ${k}`; return "0"; } const v = Number(vals?.[w]?.[k]); return String(Number.isFinite(v) ? v : 0); });
  if (bad) return { ok: false, value: dice ? "0" : 0, error: bad };
  const norm = subst.replace(/[×x](?=\s*[\d(@])/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (dice) {
    if (!/^[\d\s+\-*/().d]*$/i.test(norm.replace(/floor|ceil/g, "")) || /d\s*d/i.test(norm)) return { ok: false, value: "0", error: "not a damage formula" };
    return { ok: true, value: norm.replace(/\s+/g, " "), error: "" };
  }
  if (/\d\s*d\s*\d/i.test(norm)) return { ok: false, value: 0, error: "dice are only for damage" };
  if (!/^[\d\s+\-*/().]*$/.test(norm.replace(/\b(floor|ceil)\b/g, ""))) return { ok: false, value: 0, error: "only numbers, + − × ÷, ( ), floor( ), ceil( ), @origin and @target" };
  try {
    const v = Function("floor", "ceil", `"use strict"; return (${norm.replace(/\bfloor\b/g, "floor").replace(/\bceil\b/g, "ceil") || 0});`)(Math.floor, Math.ceil);
    return Number.isFinite(v) ? { ok: true, value: v, error: "" } : { ok: false, value: 0, error: "not a number" };
  } catch (e) { return { ok: false, value: 0, error: "it doesn't read as a formula" }; }
}
const isNum = t => /^\s*[+-]?\d+\s*$/.test(String(t ?? ""));
/** The values a formula reads from a creature (@origin.x, @target.x): its Modifiers, Attributes and Stage. */
export function refValues(actor) {
  const s = actor?.system ?? {}, a = s.attributes ?? {};
  return { pow: Number(s.powerMod ?? s.magicMod) || 0, wpn: Number(s.weaponMod) || 0, sig: Number(s.signatureMod) || 0, body: Number(a.body) || 0, mind: Number(a.mind) || 0,
    appeal: Number(a.appeal) || 0, instinct: Number(a.instinct) || 0, stage: Number(s.stage) || Math.max(1, Math.ceil((Number(s.level) || 1) / 3)) };
}

/* ------------------------------------------------------------------ defaults and the normalizer */
const dmgEntry = (o = {}) => ({ dice: "1d4", pool: "B", sub: "", tiers: [1, 2, 3], fx: "", fxName: "", text: "", ...o });
const DEFAULTS = {
  act: () => ({ dir: "by", filter: { all: [], any: [], not: [] }, attrs: [], from: [], vs: "any", uses: "every", sees: false, origin: "",
    bb: { on: false, boons: 0, banes: 0, name: "", byValue: false }, emp: { on: false, mode: "set", emp: 0, enf: 0 },
    dmg: { on: false, list: [dmgEntry()] }, ign: { on: false, low: false, medium: false, high: false, range: "none", engaged: false, engagedTarget: false },
    note: { on: false, title: "", text: "" } }),
  value: () => ({ stat: "defense", which: "all", val: "1", stype: "all", mode: "bonus", name: "", vs: "any", sees: false, origin: "", rally: "@origin.pow + 2", rallyRange: 0, rw: "resist", rwSub: "", rwVal: 1 }),
  grant: () => ({ item: "", itemName: "", itemType: "", valued: false, src: "", val: 1, valMode: "set", origin: "", when: "lasts", amode: "has", uses: 1, ap: 0, bbn: 0, bbk: "boons", distinct: false,
    riders: [], pool: "any", sub: "", tag: "", msg: { on: false, to: "owners", text: "" } }),
  weap: () => ({ mode: "prop", weapon: "fists", wprop: "thrown", gl: "loses", prop: "nonthreatening", mprop: "projectile", mval: 3 }),
  esc: () => ({ trig: "allyState", n: 5 }),
  uses: () => ({ which: "round" }),
  aura: () => ({ size: "2", inside: insideDefault({ carry: { on: true, self: true } }), show: true, outline: "", fill: "" }),   // v0.0.327 (PACK ZONE): per-row Who
  light: () => ({ bright: 1, dim: 2, color: "#ffd27a", alpha: 0.5, anim: "", aspeed: 5, aint: 5 }),
  move: () => ({ dirm: "closer", how: "cant", sees: false, origin: "" }),   // v0.0.345: how "cant" (can't willingly move) or "difficult" (those squares are Difficult Terrain)
  zone: () => ({ setting: { type: "zone", zoneWho: "allies", zoneHeal: "", fxUuid: "" } }),
  bleed: () => ({ setting: { type: "bleed", dmg: "1", dmgPool: "", dmgSub: "", attrs: ["body", "instinct"], bleedDc: 13 } }),
  builtin: () => ({ which: "noReactions" }),
  raw: () => ({ setting: { type: "note" } })
};
const deepMerge = (base, o) => { const out = { ...base }; for (const [k, v] of Object.entries(o ?? {})) out[k] = v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) ? deepMerge(base[k], v) : v; return out; };
/** A new rule of a kind, with its defaults. */
export const defaultRule = (kind, o = {}) => normRule({ id: newRuleId(), kind, ...o });
const tiersOf = t => [...new Set((Array.isArray(t) ? t : []).map(Number).filter(n => [1, 2, 3].includes(n)))].sort();
const subOk = s => (s && s in (T().subtypes ?? {}) ? s : "");
/** The rule with every field, numbers clamped, unknown traits dropped. */
export function normRule(r) {
  const kind = RULE_KINDS[r?.kind] ? r.kind : "raw";
  const x = deepMerge(DEFAULTS[kind](), r ?? {});
  x.kind = kind; x.id = String(r?.id || newRuleId()); x.minEsc = clamp(r?.minEsc ?? 0, 0, Number(T().escalationMax) || 3);
  if (kind === "act") {
    x.dir = x.dir === "against" ? "against" : "by"; x.filter = normFilter(x.filter); x.from = [...new Set((x.from ?? []).filter(known))]; x.attrs = (x.attrs ?? []).filter(a => a in T().attributes);
    x.vs = ["any", "origin", "marked", "notorigin"].includes(x.vs) ? x.vs : "any"; x.uses = ["every", "round", "next"].includes(x.uses) ? x.uses : "every";
    x.bb.boons = clamp(x.bb.boons, 0, 5); x.bb.banes = clamp(x.bb.banes, 0, 5); x.bb.name = ["field", "pressure", "support"].includes(x.bb.name) ? x.bb.name : "";
    x.emp.mode = x.emp.mode === "inc" ? "inc" : "set"; x.emp.emp = clamp(x.emp.emp, 0, 5); x.emp.enf = clamp(x.emp.enf, 0, 5);
    x.dmg.list = (x.dmg.list?.length ? x.dmg.list : [dmgEntry()]).map(d => ({ ...dmgEntry(d), pool: d.pool === "M" ? "M" : "B", sub: d.sub === "W" ? "W" : subOk(d.sub), tiers: tiersOf(d.tiers ?? [1, 2, 3]) }));   // v0.0.345: "W" = the weapon's subtype
    x.ign.range = ["none", "one", "all"].includes(x.ign.range) ? x.ign.range : "none";
  } else if (kind === "value") {
    x.stat = ["defense", "speed", "rally", "resist"].includes(x.stat) ? x.stat : "defense"; x.mode = ["bonus", "inc", "set"].includes(x.mode) ? x.mode : "bonus";
    x.name = ["field", "pressure", "support"].includes(x.name) ? x.name : ""; x.which = x.which in T().defenseKinds ? x.which : "all";
    x.vs = ["any", "origin", "marked"].includes(x.vs) ? x.vs : "any"; x.val = String(x.val ?? "0"); x.rwVal = isNum(x.rwVal) ? clamp(x.rwVal, 0, 99) : String(x.rwVal ?? "1").trim() || 1; x.rwSub = subOk(x.rwSub);   // v0.0.324: a number or a formula
    x.rw = ["resist", "weak", "immune"].includes(x.rw) ? x.rw : "resist"; x.rallyRange = clamp(x.rallyRange, 0, 99);
  } else if (kind === "grant") {
    x.val = clamp(x.val, 0, 20); x.uses = clamp(x.uses, 1, 20); x.ap = clamp(x.ap, 0, 4); x.bbn = clamp(x.bbn, 0, 5); x.bbk = x.bbk === "banes" ? "banes" : "boons";
    x.valMode = ["set", "increase", "halfLevel"].includes(x.valMode) ? x.valMode : "set";
    const okWhen = x.itemType === "action" ? ["lasts", "turn", "enc", "markDown"] : ["lasts", "turn", "enc", "damage", "markDown"];
    if (!okWhen.includes(x.when)) x.when = "lasts";
    x.amode = x.amode === "uses" ? "uses" : "has"; x.pool = ["any", "B", "M"].includes(x.pool) ? x.pool : "any"; x.sub = subOk(x.sub);
    x.riders = (x.riders ?? []).slice(0, 2).map(rd => ({ tiers: tiersOf(rd.tiers ?? [3]), does: rd.does === "half" ? "half" : "text", text: String(rd.text ?? ""), crit: !!rd.crit }));
    x.msg.to = ["owners", "all"].includes(x.msg.to) ? x.msg.to : "owners";
  } else if (kind === "weap") {
    x.mode = x.mode === "mastery" ? "mastery" : "prop"; x.weapon = ["fists", "all"].includes(x.weapon) ? x.weapon : "fists"; x.gl = "loses";
    x.prop = x.prop in (T().removableProps ?? {}) ? x.prop : "nonthreatening"; x.mprop = x.mprop in (T().weaponTraits ?? {}) ? x.mprop : "projectile"; x.mval = clamp(x.mval, 0, 15);
  } else if (kind === "esc") { x.trig = x.trig in (T().escHookWhen ?? {}) ? x.trig : "allyState"; x.n = clamp(x.n, 0, 30); }
  else if (kind === "uses") x.which = x.which === "encounter" ? "encounter" : "round";
  else if (kind === "aura") {
    x.size = String(x.size ?? "1") || "1";
    // v0.0.327 (PACK ZONE): the Aura's one Affects and "And this creature itself" became each row's Who (an older rule: its Carries row gets them)
    if (!r?.inside) x.inside = insideDefault({ carry: { on: r?.carry?.on ?? true, who: ["allies", "enemies", "all"].includes(r?.aff) ? r.aff : "allies", self: r?.self ?? true, fx: r?.carry?.fx ?? "", fxName: r?.carry?.fxName ?? "" } });
    x.inside = normInside(x.inside); delete x.aff; delete x.self; delete x.carry;
  }
  else if (kind === "light") { x.bright = clamp(x.bright, 0, 30); x.dim = clamp(x.dim, 0, 30); x.alpha = Math.min(1, Math.max(0, Number(x.alpha) || 0)); x.aspeed = clamp(x.aspeed, 0, 10); x.aint = clamp(x.aint, 0, 10); }
  else if (kind === "move") { x.dirm = x.dirm === "away" ? "away" : "closer"; x.how = x.how === "difficult" ? "difficult" : "cant"; }
  else if (kind === "builtin") x.which = ["noReactions", "loseAp"].includes(x.which) ? x.which : "noReactions";
  return x;
}
/** Ends with every field. */
export function normEnds(e = {}) {
  const x = deepMerge({ time: { on: false, mode: "rounds", rounds: 1 }, save: { on: false, attr: "body", dc: "13", dcValue: 15, when: "eot", t2: "eot" }, down: { on: false }, action: { on: false, filter: { all: [], any: [], not: [] } }, someone: { on: false, who: "origin", ap: 1 } }, e);   // someone: a Zone's "Someone uses an Action" (v0.0.327)
  x.time.mode = ["eot", "rounds", "encounter"].includes(x.time.mode) ? x.time.mode : "rounds"; x.time.rounds = clamp(x.time.rounds, 1, 99);
  x.save.attr = ["body", "mind", "appeal", "instinct", "bodyinstinct", "mindappeal"].includes(x.save.attr) ? x.save.attr : "body";
  x.save.dc = ["13", "origin", "set"].includes(String(x.save.dc)) ? String(x.save.dc) : "13"; x.save.dcValue = clamp(x.save.dcValue, 1, 40);
  x.save.when = x.save.when === "interact" ? "interact" : "eot"; x.save.t2 = ["none", "eot", "ends"].includes(x.save.t2) ? x.save.t2 : "eot";
  x.action.filter = normFilter(x.action.filter);
  x.someone = { on: !!x.someone.on, who: x.someone.who === "reach" ? "reach" : "origin", ap: clamp(x.someone.ap, 0, 3) };
  return x;
}

/* ------------------------------------------------------------------ migrate: old settings -> rules */
const tierNums = t => tiersOf([...(t ?? [])].map(k => Number(String(k).replace(/^t/, ""))));
const filterOf = x => normFilter({ all: [...(x.all ?? []), ...(x.predicate ? [x.predicate] : [])], any: [...(x.any ?? [])], not: [...(x.none ?? [])] });
const IGN = { rangeBane: { range: "one" }, engagedSelf: { engaged: true }, engagedTarget: { engagedTarget: true } };
/** Old "On [t3]" choices -> tiers. */
const onTiers = on => ({ t1: [1, 2, 3], t2: [2, 3], t3: [3], all: [1, 2, 3], crit: [] }[on] ?? []);
/**
 * The rules of an item from its old settings and fields. sys: the item's system (plain data). host: "effect", "feature", "talent".
 * Returns { rules, ends, notes: [what could not be converted cleanly] }.
 */
export function migrate(sys, host = "effect") {
  const out = [], notes = [];
  let k = 0;   // stable ids: the same old settings give the same rules on every load
  const add = (kind, o) => out.push(normRule({ id: `m${k++}`, kind, ...o }));
  const seen = !!sys?.whileSeen;
  for (const raw of sys?.settings ?? []) {
    const x = raw ?? {}, minEsc = Math.max(0, Number(x.minEscalation) || 0), base = { minEsc };
    const vs = x.vsMarked ? "marked" : x.vsOrigin === "only" ? "origin" : x.vsOrigin === "not" ? "notorigin" : "any";
    switch (x.type) {
      case "boonbane": {
        const f = filterOf(x), attrs = [...(x.attrs ?? [])];
        let extraAttrs = [];
        if (attrs.length) { if (!f.any.length) f.any = attrs.length === 1 ? [] : attrs; if (attrs.length === 1 && !f.any.length) f.all = [...new Set([...f.all, attrs[0]])]; else if (f.any.join() !== attrs.join()) extraAttrs = attrs; }
        add("act", { ...base, dir: x.against ? "against" : "by", filter: f, attrs: extraAttrs, from: [...(x.from ?? [])], vs, uses: x.oncePerRound ? "round" : "every", sees: seen, bb: { on: true, boons: x.boons || 0, banes: x.banes || 0, name: x.bbName || "", byValue: !!x.byValue } });
        if (extraAttrs.length) notes.push(`${x.type}: its Attributes and its "any of" traits both kept (the filter has one "one of" line)`);
        break;
      }
      case "damagestep": add("act", { ...base, filter: filterOf(x), vs, sees: seen, emp: { on: true, mode: "set", emp: x.empowered || 0, enf: x.enfeebled || 0 } }); break;
      case "bonusdamage":
        add("act", { ...base, dir: x.against ? "against" : "by", filter: filterOf(x), vs, uses: x.oncePerRound ? "round" : "every", sees: seen, dmg: { on: true, list: [dmgEntry({ dice: x.dmg ?? "", pool: x.dmgPool === "M" ? "M" : "B", sub: x.dmgSub || "", tiers: tierNums(x.tiers).length ? tierNums(x.tiers) : [1, 2, 3], fx: x.fxUuid || "", text: x.text || "" })] } });
        break;
      case "ignore": add("act", { ...base, filter: filterOf(x), ign: { on: true, ...(IGN[x.ignoreRule] ?? { range: "one" }) } }); break;
      case "cover": { const lv = new Set(x.coverLevels ?? []); add("act", { ...base, filter: filterOf(x), ign: { on: true, low: lv.has("low"), medium: lv.has("medium"), high: lv.has("high") } }); break; }
      case "note": { const a = [...(x.attrs ?? [])]; add("act", { ...base, filter: { all: a.length === 1 ? a : [], any: a.length > 1 ? a : [], not: [] }, note: { on: true, title: x.title || "", text: x.text || "" } }); break; }
      case "defense": add("value", { ...base, stat: "defense", which: x.defKind || "all", val: x.valFormula || String(Math.trunc(Number(x.defValue)) || 0), mode: "bonus", name: x.defName || "", sees: seen }); break;
      case "speed": add("value", { ...base, stat: "speed", val: String(x.speedFormula ?? "0"), mode: x.speedMode === "override" ? "set" : "inc", sees: seen }); break;
      case "rally": add("value", { ...base, stat: "rally", rally: migrateFormula(x.rallyBonus || "0"), rallyRange: x.rallyRange || 0 });
        if (Number(x.rallyRange) > 0) notes.push(`Rally Points for allies within ${x.rallyRange}: kept as before (not turned into an Aura)`); break;
      case "resist": add("value", { ...base, stat: "resist", rw: x.rwKind || "resist", rwSub: x.dmgSub || "", rwVal: x.valFormula || (x.rwValue ?? 1) }); break;
      case "inline": add("grant", { ...base, item: x.inlineAction || "", itemName: /^(Compendium|Item|Actor)\./.test(x.inlineAction ?? "") ? "" : (x.inlineAction || ""), itemType: "action", when: "lasts", amode: "has" }); break;
      case "grant": {
        const riders = [];
        const on1 = x.grantOn || x.halfOn || (x.halfT3 ? "t3" : "");
        if (on1) riders.push({ tiers: onTiers(on1), crit: on1 === "crit", does: (x.grantDo || "half") === "half" ? "half" : "text", text: x.grantText || "" });
        if (x.grantOn2) riders.push({ tiers: onTiers(x.grantOn2), crit: x.grantOn2 === "crit", does: x.grantDo2 === "half" ? "half" : "text", text: x.grantText2 || "" });
        add("grant", { ...base, item: "", itemName: x.grantAction || "", itemType: "action", when: "lasts", amode: "uses", uses: x.grantCount || 1, ap: x.grantAp || 0, bbn: x.boons || x.banes || 0, bbk: x.banes && !x.boons ? "banes" : "boons", distinct: !!x.grantDistinct, riders });
        break;
      }
      case "ondamage": add("grant", { ...base, item: x.fxUuid || "", itemType: "effect", when: "damage", sub: x.trigSub || "", tag: x.trigTag || "" }); break;
      case "turnstart": add("grant", { ...base, item: x.fxUuid || "", itemType: "effect", when: "turn" }); break;
      case "encstart": add("grant", { ...base, item: x.fxUuid || "", itemType: "effect", when: "enc" }); break;
      case "move": add("move", { ...base, dirm: x.text === "away" ? "away" : "closer", how: x.moveHow === "difficult" ? "difficult" : "cant", sees: !!x.seen || seen }); break;
      case "message": add("grant", { ...base, item: "", itemName: x.msgAction || "", itemType: x.msgAction ? "action" : "", when: x.msgWhen === "turn" ? "turn" : x.msgWhen === "markDown" ? "markDown" : "enc", amode: "uses", uses: 1, ap: x.msgAp || 0, msg: { on: true, to: x.msgTo || "owners", text: x.text || "" } }); break;
      case "weaponprop": add("weap", { ...base, mode: "prop", weapon: x.wpWhich || "fists", gl: "loses", prop: x.wpProp || "nonthreatening" }); break;
      case "mastery": add("weap", { ...base, mode: "mastery", mprop: x.mstTrait || "projectile", mval: x.mstValue ?? 3 }); break;
      case "eschook": add("esc", { ...base, trig: x.hookWhen || "allyState", n: x.hookRange ?? 5 }); break;
      case "freqmore": add("uses", { ...base, which: x.fmWhich || "round" }); break;
      case "aura": add("aura", { ...base, size: x.sizeFormula || String(x.auraSize || 1), inside: x.areaRows?.carry ? x.areaRows : insideDefault({ carry: { on: !!x.fxUuid, who: x.auraWho || "allies", self: !!x.auraSelf, fx: x.fxUuid || "" } }), show: x.auraShow !== false, outline: x.auraOutline || "", fill: x.auraFill || "" }); break;
      case "light": add("light", { ...base, bright: x.bright || 0, dim: Math.max(0, (Number(x.dim) || 0) - (Number(x.bright) || 0)), color: x.color || "#ffd27a", alpha: x.lightAlpha ?? 0.5, anim: x.lightAnim || "", aspeed: x.lightSpeed ?? 5, aint: x.lightIntensity ?? 5 }); break;
      case "zone": add("zone", { ...base, setting: { ...x } }); break;
      case "bleed": add("bleed", { ...base, setting: { ...x } }); break;
      default: add("raw", { ...base, setting: { ...x } }); notes.push(`a "${x.type}" setting kept as it was`);
    }
  }
  // the effect's own fields
  if (sys?.noReactions) add("builtin", { which: "noReactions" });
  if (sys?.loseAp) add("builtin", { which: "loseAp" });
  for (const c of sys?.conditions ?? []) add("grant", { item: c.uuid || "", itemName: c.name || "", itemType: "effect", valued: !!c.valued, val: c.value ?? 1, valMode: c.mode || "set", when: "lasts" });
  for (const nm of String(sys?.linked ?? "").split(",").map(s => s.trim()).filter(Boolean)) add("grant", { item: "", itemName: nm, itemType: "effect", when: "lasts" });
  // Frightened's "can't willingly move closer" was only its hover text: no rule from it (the content update writes it)
  const d = sys?.duration ?? {}, ex = [...(sys?.expireOn ?? [])];
  const ends = normEnds({ time: { on: !!d.type, mode: d.type || "rounds", rounds: d.rounds || 1 }, down: { on: !!sys?.endsWithOrigin }, save: sys?.saveEnd ?? {},
    action: { on: ex.length > 0, filter: sys?.expireAll ? { all: ex } : (ex.length === 1 ? { all: ex } : { any: ex }) } });
  return { rules: out, ends, notes };
}

/* ------------------------------------------------------------------ compile: rules -> the old settings and fields */
export const blankSetting = type => ({ type, attrs: [], title: "", text: "", bright: 0, dim: 0, color: "", lightAlpha: 0.5, lightAnim: "", lightSpeed: 5, lightIntensity: 5, boons: 0, banes: 0, bbName: "",
  empowered: 0, enfeebled: 0, byValue: false, predicate: "", all: [], any: [], none: [], from: [], dmg: "", dmgPool: "B", dmgSub: "", tiers: ["t1", "t2", "t3"], fxUuid: "", against: false,
  speedMode: "add", speedFormula: "", grantAction: "", grantCount: 1, grantAp: 0, grantDistinct: false, halfT3: false, grantOn: "", grantDo: "half", grantText: "", halfOn: "", grantOn2: "", grantDo2: "text", grantText2: "",
  coverLevels: [], zoneWho: "allies", zoneHeal: "", inlineAction: "", defKind: "all", defValue: 1, minEscalation: 0, auraSize: 1, auraWho: "allies", auraSelf: false, auraOutline: "", auraFill: "",
  valFormula: "", trigSub: "", trigTag: "", oncePerRound: false, vsMarked: false, ignoreRule: "rangeBane", rallyBonus: "", rallyRange: 0, msgWhen: "encounter", msgTo: "owners", msgAction: "", msgAp: 0,
  moveHow: "cant", wpWhich: "fists", wpProp: "nonthreatening", mstTrait: "projectile", mstValue: 3, hookWhen: "allyState", hookRange: 5, vsOrigin: "", bleedDc: 13, rwKind: "resist", rwValue: 1, fmWhich: "round",
  // v0.0.323: the new fields the readers learn (see each module)
  ruleId: "", spend: false, seen: false, empMode: "set", defMode: "bonus", defName: "", sizeFormula: "", trigPool: "", auraShow: true, rangeAll: false });
const RIDER_ON = rd => (rd.crit ? "crit" : rd.tiers.length === 3 ? "all" : rd.tiers.join() === "2,3" ? "t2" : rd.tiers.join() === "3" ? "t3" : rd.tiers.join() === "1,2,3" ? "t1" : rd.tiers.length ? `t${Math.min(...rd.tiers)}` : "");
/**
 * What the rules and Ends become: { settings, conditions, linked, duration, expireOn, expireAll, endsWithOrigin, whileSeen, noReactions, loseAp, saveEnd }.
 * whileSeen: on when every rule that can have "While they see the origin" has it (the old effect-wide rule, Frightened); otherwise each setting carries its own
 * `seen` (the readers check it). host: "effect", "feature", "talent" (a passive keeps each rule's Escalation minimum).
 */
export function compile(rulesIn, endsIn, host = "effect") {
  const rules = (rulesIn ?? []).map(normRule), ends = normEnds(endsIn);
  const settings = [], conditions = [], linked = [];
  let noReactions = false, loseAp = false;
  const seeable = rules.filter(r => ["act", "value", "move"].includes(r.kind) && !(r.kind === "value" && ["rally", "resist"].includes(r.stat)));
  const whileSeen = seeable.length > 0 && seeable.every(r => r.sees);
  const S = (r, type, o) => settings.push({ ...blankSetting(type), ruleId: r.id, minEscalation: host === "effect" ? 0 : r.minEsc, seen: !whileSeen && !!r.sees, ...o });
  for (const r of rules) {
    switch (r.kind) {
      case "act": {
        const f = { all: [...r.filter.all], any: [...r.filter.any], none: [...r.filter.not], attrs: [...r.attrs], from: [...r.from] };
        const lim = { vsMarked: r.vs === "marked", vsOrigin: r.vs === "origin" ? "only" : r.vs === "notorigin" ? "not" : "", oncePerRound: r.uses === "round", spend: r.uses === "next" };
        if (r.bb.on && (r.bb.boons || r.bb.banes)) S(r, "boonbane", { ...f, ...lim, boons: r.bb.boons, banes: r.bb.banes, bbName: r.bb.name, byValue: r.bb.byValue, against: r.dir === "against" });
        // v0.0.343 (Open Season: "[Strike] Actions your allies make against them deal an extra [V] 1d6 Pi"): extra damage on Rolls made against them too
        if (r.dmg.on) for (const d of r.dmg.list) if (String(d.dice).trim() || d.fx || d.text) S(r, "bonusdamage", { ...f, vsMarked: lim.vsMarked, vsOrigin: lim.vsOrigin, oncePerRound: lim.oncePerRound, spend: lim.spend, dmg: oldFormula(d.dice), dmgPool: d.pool, dmgSub: d.sub, tiers: d.tiers.map(t => `t${t}`), fxUuid: d.fx, text: d.text, against: r.dir === "against" });
        if (r.dir === "by") {
          if (r.emp.on && (r.emp.emp || r.emp.enf)) S(r, "damagestep", { ...f, vsMarked: lim.vsMarked, spend: lim.spend, empowered: r.emp.emp, enfeebled: r.emp.enf, empMode: r.emp.mode });
          if (r.ign.on) {
            const lv = ["low", "medium", "high"].filter(k => r.ign[k]);
            if (lv.length) S(r, "cover", { ...f, coverLevels: lv });
            if (r.ign.range !== "none") S(r, "ignore", { ...f, ignoreRule: "rangeBane", rangeAll: r.ign.range === "all" });
            if (r.ign.engaged) S(r, "ignore", { ...f, ignoreRule: "engagedSelf" });
            if (r.ign.engagedTarget) S(r, "ignore", { ...f, ignoreRule: "engagedTarget" });
          }
        }
        if (r.note.on && (r.note.title || r.note.text)) S(r, "note", { attrs: [...new Set([...r.filter.all, ...r.filter.any, ...r.attrs].filter(k => k in T().attributes))], all: f.all, any: f.any, none: f.none, title: r.note.title, text: r.note.text });
        break;
      }
      case "value":
        if (r.stat === "defense") S(r, "defense", { defKind: r.which, defValue: isNum(r.val) ? Math.trunc(Number(r.val)) : 0, valFormula: isNum(r.val) ? "" : r.val, defMode: r.mode, defName: r.mode === "bonus" ? r.name : "", vsMarked: r.vs === "marked", vsOrigin: r.vs === "origin" ? "only" : "" });
        else if (r.stat === "speed") S(r, "speed", { speedMode: r.mode === "set" ? "override" : "add", speedFormula: oldFormula(r.val), defMode: r.mode, defName: r.mode === "bonus" ? r.name : "" });
        else if (r.stat === "rally") S(r, "rally", { rallyBonus: oldFormula(r.rally), rallyRange: r.rallyRange });
        else if (r.stat === "resist" && r.rwSub) S(r, "resist", { rwKind: r.rw, dmgSub: r.rwSub, rwValue: r.rw === "immune" ? 0 : (isNum(r.rwVal) ? Number(r.rwVal) : 0), valFormula: r.rw !== "immune" && !isNum(r.rwVal) ? String(r.rwVal) : "" });
        break;
      case "grant": {
        const name = r.itemName || "", ref = r.item || "";
        if (r.itemType === "effect") {
          if (r.when === "lasts") { if (ref) conditions.push({ uuid: ref, name, value: r.val || 1, valued: !!r.valued, mode: r.valMode }); else if (name) linked.push(name); }
          else if (r.when === "turn") S(r, "turnstart", { fxUuid: ref });
          else if (r.when === "damage") S(r, "ondamage", { fxUuid: ref, trigSub: r.sub, trigTag: r.tag, trigPool: r.pool === "any" ? "" : r.pool });
          else if (r.when === "enc") S(r, "encstart", { fxUuid: ref });
          if (r.when !== "lasts" && r.msg.on) S(r, "message", { msgWhen: r.when === "turn" ? "turn" : r.when === "markDown" ? "markDown" : "encounter", msgTo: r.msg.to, text: r.msg.text });
        } else {
          const spec = name || ref;
          if (r.when === "lasts" && r.amode === "has") S(r, "inline", { inlineAction: ref || name });
          else if (r.when === "lasts") {
            const [a, b] = r.riders;
            S(r, "grant", { grantAction: spec, grantCount: r.uses, grantAp: r.ap, boons: r.bbk === "boons" ? r.bbn : 0, banes: r.bbk === "banes" ? r.bbn : 0, grantDistinct: r.distinct,
              grantOn: a ? RIDER_ON(a) : "", grantDo: a?.does ?? "half", grantText: a?.text ?? "", grantOn2: b ? RIDER_ON(b) : "", grantDo2: b?.does ?? "text", grantText2: b?.text ?? "" });
          } else S(r, "message", { msgWhen: r.when === "turn" ? "turn" : r.when === "markDown" ? "markDown" : "encounter", msgTo: r.msg.to, text: r.msg.on ? r.msg.text : "", msgAction: spec, msgAp: r.ap });
        }
        break;
      }
      case "weap": if (r.mode === "mastery") S(r, "mastery", { mstTrait: r.mprop, mstValue: r.mval }); else S(r, "weaponprop", { wpWhich: r.weapon, wpProp: r.prop }); break;
      case "esc": S(r, "eschook", { hookWhen: r.trig, hookRange: r.n }); break;
      case "uses": S(r, "freqmore", { fmWhich: r.which }); break;
      case "aura": { const c = r.inside.carry;   // the Carries row is the Aura setting the readers know (aura.mjs); every row goes along (areaRows: Heals, Hazard, Difficult Terrain)
        S(r, "aura", { auraSize: isNum(r.size) ? Math.max(1, Math.trunc(Number(r.size))) : 1, sizeFormula: isNum(r.size) ? "" : r.size, auraWho: c.who, auraSelf: c.self, fxUuid: c.on ? c.fx : "", auraOutline: r.outline, auraFill: r.fill, auraShow: r.show, areaRows: r.inside }); break; }
      case "light": S(r, "light", { bright: r.bright, dim: r.bright + r.dim, color: r.color, lightAlpha: r.alpha, lightAnim: r.anim, lightSpeed: r.aspeed, lightIntensity: r.aint }); break;
      case "move": settings.push({ ...blankSetting("move"), ruleId: r.id, seen: !!r.sees, text: r.dirm, moveHow: r.how }); break;
      case "zone": case "bleed": case "raw": settings.push({ ...blankSetting(r.setting?.type || "note"), ...r.setting, ruleId: r.id, minEscalation: host === "effect" ? 0 : r.minEsc }); break;
      case "builtin": if (r.which === "noReactions") noReactions = true; else loseAp = true; break;
    }
  }
  const ex = [...ends.action.filter.all, ...ends.action.filter.any];
  return {
    settings, conditions, linked: linked.join(", "), noReactions, loseAp, whileSeen,
    duration: ends.time.on ? { type: ends.time.mode, rounds: ends.time.rounds } : { type: "", rounds: ends.time.rounds },
    expireOn: ends.action.on ? ex : [], expireAll: ends.action.on && ends.action.filter.all.length > 1 && !ends.action.filter.any.length,
    endsWithOrigin: ends.down.on, saveEnd: ends.save.on ? { ...ends.save, on: true } : { on: false }
  };
}

/* ------------------------------------------------------------------ the sentences */
// The sentence is built with marks the pane colors and the hover card strips: ⟦b:1 Bane⟧ ⟦o:2 Boons⟧ ⟦e:Empowered 1⟧ ⟦n:Enfeebled 1⟧ ⟦t:Strike⟧ ⟦x:Divine⟧ (a "not"
// trait) ⟦d:V:1d6 [V]⟧ ⟦s:Ho⟧ ⟦a:a name⟧ ⟦h:HT: Entering, Turn⟧.
const SUB = s => (s === "W" ? "(the weapon's subtype)" : T().subtypes?.[s] ?? s);
const POOL = p => (p === "M" ? "R" : "V");
const tiersT = t => (t.length === 3 || !t.length ? "" : ` on ${t.map(x => `T${x}`).join("/")}`);
const bbWord = (n, name, w) => `${n} ${name ? `${cap(name)} ` : ""}${w}${n === 1 ? "" : "s"}`;
const trChips = (keys, not = false) => keys.map(k => `⟦${not ? "x" : "t"}:${traitLabel(k)}⟧`);
function filterMarked(f) {
  const { all, any, not } = normFilter(f);
  const br = (keys, n) => trChips(keys, n).map(c => `[${c}]`);
  let s = all.length ? `[${trChips(all).join(", ")}] Actions` : "";
  if (any.length) s = `${s ? `${s} that are ` : "Actions that are "}${orJoin(br(any))}`;
  if (not.length) s = `${s || "Actions"}, not ${orJoin(br(not, true))}`;
  return s;
}
const dmgPhrase = d => (!String(d.dice).trim() ? "" : `⟦d:${POOL(d.pool)}:${formulaWords(d.dice)} [${POOL(d.pool)}]⟧${d.sub && d.sub !== "W" ? ` ⟦s:${d.sub}⟧` : ""} damage${d.sub === "W" ? " (the same subtype as the weapon)" : ""}${tiersT(d.tiers)}`);
/** The payload of an "On matching Actions" rule: ["1 Boon", "Empowered +1", "ignore Low cover", ...]. */
function payload(r, withDmg = true) {
  const p = [];
  if (r.bb.on) {
    if (r.bb.boons) p.push(`⟦o:${bbWord(r.bb.boons, r.bb.name, "Boon")}⟧`);
    if (r.bb.banes) p.push(`⟦b:${bbWord(r.bb.banes, r.bb.name, "Bane")}⟧`);
    if (r.bb.byValue) p.push("(times its value)");
    if (r.bb.boons - r.bb.banes >= 5) p.push("(⟦o:Favored⟧)");
    if (r.bb.banes - r.bb.boons >= 5) p.push("(⟦b:Doomed⟧)");
  }
  if (r.dir === "by" && r.emp.on) {
    const pl = r.emp.mode === "inc" ? "+" : "";
    if (r.emp.emp) p.push(`⟦e:Empowered ${pl}${r.emp.emp}⟧`);
    if (r.emp.enf) p.push(`⟦n:Enfeebled ${pl}${r.emp.enf}⟧`);
  }
  if (r.dir === "by" && r.ign.on) {
    const c = ["low", "medium", "high"].filter(k => r.ign[k]).map(cap), x = [];
    if (c.length) x.push(`${andJoin(c)} cover`);
    if (r.ign.range !== "none") x.push(r.ign.range === "one" ? "one range Bane" : "all range Banes");
    if (r.ign.engaged) x.push("the Engaged Bane");
    if (r.ign.engagedTarget) x.push("the Bane for a target Engaged with someone else");
    if (x.length) p.push(`ignore ${andJoin(x)}`);
  }
  if (r.note.on && r.note.title) p.push(`show the note ⟦a:${r.note.title}⟧`);
  if (withDmg && r.dmg.on && r.dmg.list.some(d => String(d.dice).trim())) p.push(`an extra ${andJoin(r.dmg.list.map(dmgPhrase).filter(Boolean))}`);
  return p.filter(x => !/^\(/.test(x)).length ? p.reduce((a, x) => (/^\(/.test(x) && a.length ? [...a.slice(0, -1), `${a.at(-1)} ${x}`] : [...a, x]), []) : [];
}
const VS_WORD = (vs, who) => (vs === "origin" ? `⟦a:${who}⟧` : vs === "notorigin" ? `anyone but ⟦a:${who}⟧` : "the creature it marked");
const actScope = (r, lower = false) => {
  let sc = r.dir === "by" ? (r.uses === "next" ? "Their next Roll" : "Their Rolls") : (r.uses === "next" ? "The next Roll against them" : "Rolls against them");
  if (lower) sc = sc.charAt(0).toLowerCase() + sc.slice(1);
  const f = filterMarked(r.filter);
  if (f) sc += ` with ${f}`;
  if (r.from.length) sc += ` against ${orJoin(r.from.map(k => `[⟦t:${traitLabel(k)}⟧]`))} Actions`;
  if (r.attrs.length) sc += ` (${orJoin(r.attrs.map(a => T().attributes[a]))} Rolls only)`;
  return sc;
};
const ORIGIN = o => o?.originName || "the origin";
/**
 * One rule's sentence, with the marks (⟦…⟧). ctx: { originName (the rule's or the effect's origin), names: { uuid: name } (dropped items),
 * host }. The pane colors it (sentenceHtml), the hover card strips it (plainText).
 */
export function sentence(rIn, ctx = {}) {
  const r = normRule(rIn), who = r.origin ? (ctx.names?.[r.origin] ?? ORIGIN(ctx)) : ORIGIN(ctx);
  const nm = u => ctx.names?.[u] || "";
  const esc0 = r.minEsc && ctx.host && ctx.host !== "effect" ? ` (while its Escalation is ${r.minEsc} or more)` : "";
  switch (r.kind) {
    case "act": {
      const p = payload(r);
      if (!p.length) return "Does nothing yet: switch on a part below.";
      let sc = actScope(r);
      if (r.vs !== "any") sc += `${r.dir === "by" ? " against " : " made by "}${VS_WORD(r.vs, who)}`;
      if (r.uses === "round") sc += ", the first each round";
      if (r.sees) sc += `, while they see ⟦a:${who}⟧`;
      let s = `${sc}${esc0}: ${andJoin(p)}`;
      if (r.dmg.on) for (const d of r.dmg.list) { if (d.fx) s += `; the target gains ⟦a:${nm(d.fx) || d.fxName || "an Effect"}⟧${tiersT(d.tiers)}`; if (d.text) s += `; ${tiersT(d.tiers).trim() || "on any tier"}: ${d.text}`; }
      return `${s}.`;
    }
    case "move": return `${moveWords(r, `⟦a:${who}⟧`)}${r.sees ? `, while they see ⟦a:${who}⟧` : ""}.`;
    case "value": {
      if (r.stat === "rally") return `Each Rally Point heals ${formulaWords(r.rally)} more${r.rallyRange ? `, for this creature and its allies within ${r.rallyRange} squares` : ""}${esc0}.`;
      if (r.stat === "resist") {   // v0.0.325: a formula reads "Resist N Fire, N equal to the origin's Power Modifier"
        if (!r.rwSub) return "Choose a damage type below.";
        if (r.rw === "immune") return `Has ⟦a:Immune ${SUB(r.rwSub)}⟧${esc0}.`;
        const w = r.rw === "weak" ? "Weak" : "Resist";
        return isNum(r.rwVal) ? `Has ⟦a:${w} ${r.rwVal} ${SUB(r.rwSub)}⟧${esc0}.` : `Has ⟦a:${w} N ${SUB(r.rwSub)}⟧, N equal to ${formulaWords(r.rwVal)}${esc0}.`;
      }
      const what = r.stat === "defense" ? (r.which === "all" ? "every Defense" : ({ armor: "Armor Defense", ward: "Ward Defense" }[r.which] ?? `Defense ${T().defenseKinds[r.which]}`)) : (r.stype === "all" ? "every Speed" : `${cap(r.stype)} Speed`);
      const amt = formulaWords(r.val), n = Number(r.val), sign = !isNum(r.val) || n >= 0 ? "+" : "";
      let s = r.mode === "set" ? `${cap(what)} becomes ${amt}` : r.mode === "inc" ? `${isNum(r.val) && n < 0 ? `Decrease ${what} by ${Math.abs(n)}` : `Increase ${what} by ${amt}`}`
        : isNum(r.val) ? `⟦o:${sign}${amt} ${r.name ? `${cap(r.name)} ` : ""}bonus⟧ to ${what}` : `⟦o:A ${r.name ? `${cap(r.name)} ` : ""}bonus⟧ to ${what} equal to ${formulaWords(r.val)}`;   // v0.0.325: a formula reads in words
      if (r.mode === "bonus" && isNum(r.val) && n < 0) s = `⟦b:${amt} ${r.name ? `${cap(r.name)} ` : ""}penalty⟧ to ${what}`;
      if (r.stat === "defense" && r.vs !== "any") s += ` against ${VS_WORD(r.vs, who)}`;
      if (r.sees) s += `, while they see ⟦a:${who}⟧`;
      return `${s}${esc0}.`;
    }
    case "grant": {
      const name = nm(r.item) || r.itemName || (r.item ? (r.itemType === "action" ? "an Action" : "an Effect") : "");
      if (!name && !r.msg.on) return "Drop an Effect or an Action below.";
      const W = { lasts: "", turn: "At the start of each of its turns, ", enc: "At the start of each encounter, ", markDown: "When the creature it marked goes Down, ", damage: "" }[r.when] ?? "";
      let s = "";
      if (!name) s = `${W}it posts a message`;
      else if (r.itemType === "action") {
        if (r.amode === "has" && r.when === "lasts") s = `Has the Action ⟦a:${name}⟧ while this effect lasts`;
        else {
          s = `${W}${W ? "it can" : "Can"} use ⟦a:${name}⟧ ${r.uses === 1 ? "once" : `${r.uses} times`} for ${r.ap ? `${r.ap} AP` : "0 AP"}`;
          if (r.bbn) s += `, with ${r.bbk === "boons" ? `⟦o:${plural(r.bbn, "Boon")}⟧` : `⟦b:${plural(r.bbn, "Bane")}⟧`}`;
          if (r.distinct) s += ", a different creature each time";
          for (const rd of r.riders) s += `; ${rd.crit ? "on a Critical" : (tiersT(rd.tiers).trim() || "on any tier")}, ${rd.does === "half" ? "the target's next damage is halved" : (rd.text || "…")}`;
        }
      } else {
        const label = `⟦a:${name}${r.valued ? ` ${r.val}` : ""}${r.src ? ` ${r.src} ${who}` : ""}⟧`;
        if (r.when === "damage") s = `When it deals ${r.pool === "any" ? "" : `⟦d:${POOL(r.pool)}:[${POOL(r.pool)}]⟧ `}${r.sub ? `⟦s:${r.sub}⟧ ` : ""}damage to ${r.tag ? `a creature with the Tag ${r.tag}` : "a creature"}, that creature gains ${label}`;
        else if (W) s = `${W}it gains ${label}`;
        else s = `Is ${label}`;
        if (r.valMode === "increase" && r.when === "lasts") s += " (raising the value it has)";
        if (r.valMode === "halfLevel") s += " (half its level, rounded up)";
      }
      if (r.msg.on && r.when !== "lasts") s += `; posts “${r.msg.text || "…"}” to ${r.msg.to === "all" ? "everyone" : "its owners and the GM"}`;
      return `${s}${esc0}.`;
    }
    case "weap":
      if (r.mode === "prop") return `${r.weapon === "fists" ? "Its Fists don't" : "Its weapons don't"} have the property ⟦a:${T().removableProps?.[r.prop] ?? r.prop}⟧${esc0}.`;
      return `Choose one weapon with the property ⟦a:${T().weaponTraits?.[r.mprop] ?? r.mprop}⟧: it starts at ${r.mval} Mastery${esc0}.`;
    case "esc": return `Once an encounter, when ${(T().escHookWhen?.[r.trig] ?? "").replace(/^An /, "an ").replace(/^The /, "the ").replace(" N ", ` ${r.n} `)}: its Escalation rises by 1${esc0}.`;
    case "uses": return `${cap(T().freqMore?.[r.which] ?? "")}${esc0}.`;
    case "aura": {
      const sz = isNum(r.size) ? r.size.trim() : `(equal to ${formulaWords(r.size)})`;
      const x = insideSentences(r.inside, { ...ctx, selfName: "this creature", names: ctx.names });
      return `Aura ${sz}: ${x.join(" ") || "…"}${esc0}`.replace(/\.?$/, ".");
    }
    case "light": return `Sheds Bright light in a ${r.bright} Emanation and Dim light ${r.dim} squares further${esc0}.`;
    case "zone": return `A Zone (the placed area) for ${r.setting?.zoneWho === "enemies" ? "enemies" : r.setting?.zoneWho === "all" ? "everyone" : "allies"} inside it${r.setting?.fxUuid ? `: they carry ⟦a:${nm(r.setting.fxUuid) || "an Effect"}⟧` : ""}${String(r.setting?.zoneHeal ?? "").trim() ? `; they heal ${r.setting.zoneHeal} at the start of their turns` : ""}.`;
    case "bleed": { const b = r.setting ?? {}; return `At the end of each of its turns, it takes ⟦d:${b.dmgPool === "M" ? "R" : "V"}:${b.dmg || "1"}⟧${b.dmgSub ? ` ⟦s:${b.dmgSub}⟧` : ""} damage; Shake Off (1 AP) and a Save (DC ${b.bleedDc || 13}) end it.`; }
    case "builtin": return r.which === "noReactions" ? "Can't use Reactions." : "Loses its value in AP, now (the rest from its next turn's AP); then it ends.";
    case "raw": return `An older setting (${r.setting?.type ?? "?"}), kept as it was.`;
  }
  return "";
}
/** The plain text (the hover card, the list labels): the marks stripped. */
export const plainText = t => String(t ?? "").replace(/⟦h:([^⟧]+)⟧/g, "[$1]").replace(/⟦d:[VR]:([^⟧]+)⟧/g, "$1").replace(/⟦s:([^⟧]+)⟧/g, (m, s) => SUB(s)).replace(/⟦[a-z]:([^⟧]+)⟧/g, "$1").replace(/\s+/g, " ").trim();
/** The pane's colored sentence (HTML): Boons blue, Banes red, traits as chips, damage in its pool's color, the subtype in full in its color, names bold. */
export function sentenceHtml(t) {
  // the chips stand for the book's brackets: "[⟦t:Melee⟧, ⟦t:Strike⟧]" is two chips
  let h = esc(String(t ?? "").replace(/\[((?:⟦[tx]:[^⟧]+⟧(?:, )?)+)\]/g, (m, inner) => inner.replace(/⟧, ⟦/g, "⟧⟦")));
  h = h.replace(/⟦d:([VR]):([^⟧]+)⟧/g, (m, p, x) => `<span class="fr-d${p.toLowerCase()}">${x}</span>`)
    .replace(/⟦s:([^⟧]+)⟧/g, (m, s) => `<span class="fr-sub" style="color:${esc(SUB_INK[s]?.[1] ?? "inherit")}">${esc(SUB(s))}</span>`)
    .replace(/⟦o:([^⟧]+)⟧/g, '<span class="fr-bo">$1</span>').replace(/⟦b:([^⟧]+)⟧/g, '<span class="fr-bn">$1</span>')
    .replace(/⟦e:([^⟧]+)⟧/g, '<span class="fr-bo">$1</span>').replace(/⟦n:([^⟧]+)⟧/g, '<span class="fr-bn">$1</span>')
    .replace(/⟦t:([^⟧]+)⟧/g, (m, x) => `<span class="fr-chip g-${traitGroupByLabel(x)}">${x}</span>`).replace(/⟦x:([^⟧]+)⟧/g, '<span class="fr-chip no">$1</span>')
    .replace(/⟦h:([^⟧]+)⟧/g, '<span class="fr-bn">[$1]</span>').replace(/⟦a:([^⟧]+)⟧/g, "<b>$1</b>");
  return h;
}
const traitGroupByLabel = label => { for (const g of filterGroups()) for (const k of g.traits) if (traitLabel(k) === label) return g.key; return "keywords"; };

/** The list's short label: "1 Bane", "1 Boon, Empowered +1", "+1d6 Holy, +1d4 Psychic", "Has Beacon's Step", "Aura 2: Beacon's Ward". */
export function ruleLabel(rIn, ctx = {}) {
  const r = normRule(rIn), nm = u => ctx.names?.[u] || "";
  let t = "";
  switch (r.kind) {
    case "act": { const p = payload(r, false).map(plainText); if (r.dmg.on) p.push(...r.dmg.list.map(d => `+${formulaWords(d.dice).replace(/the origin's /g, "")}${d.sub ? ` ${SUB(d.sub)}` : ""}`)); t = p.join(", ") || "(empty)"; break; }
    case "grant": {
      const name = nm(r.item) || r.itemName;
      if (!name) { t = r.msg.on ? "Message" : "Grants (empty)"; break; }
      const w = { lasts: "", turn: "Each turn: ", enc: "Each encounter: ", damage: "On damage: ", markDown: "Mark Down: " }[r.when] ?? "";
      t = r.itemType === "action" ? `${w}${r.amode === "has" && r.when === "lasts" ? "Has " : "use of "}${name}` : `${w}${name}${r.valued ? ` ${r.val}` : ""}`;
      break;
    }
    case "value": t = r.stat === "rally" ? "Rally Points heal more" : plainText(sentence(r, ctx)).replace(/\.$/, "").replace(/, while.*/, "").replace(/^Has /, ""); break;
    case "esc": t = `Escalation +1: ${r.trig === "markDown" ? "mark Down" : "ally Bloodied / Down"}`; break;
    case "uses": t = r.which === "encounter" ? "Encounter Specials a second time" : "Round Specials twice a round"; break;
    case "aura": { const c = r.inside.carry, bits = [c.on ? (nm(c.fx) || c.fxName || "(empty)") : "", r.inside.heal.on ? `heal ${r.inside.heal.formula}` : "", r.inside.ht.on ? `HT ${r.inside.ht.list.map(d => `${d.dice}${d.sub ? ` ${SUB(d.sub)}` : ""}`).join(" + ")}` : "", r.inside.diff.on ? "Difficult" : ""].filter(Boolean);
      t = `Aura ${String(r.size).replace(/@origin\./g, "")}: ${bits.join(" + ") || "(empty)"}`; break; }
    case "weap": t = r.mode === "prop" ? `${r.weapon === "fists" ? "Fists" : "Weapons"} lose ${T().removableProps?.[r.prop] ?? r.prop}` : `Starting Mastery ${r.mval}`; break;
    case "light": t = `Light ${r.bright} / ${r.dim}`; break;
    case "move": t = r.how === "difficult" ? (r.dirm === "closer" ? "Closer: Difficult Terrain" : "Away: Difficult Terrain") : r.dirm === "closer" ? "Can't move closer" : "Can't move away"; break;
    case "zone": t = "Zone (old layout)"; break;
    case "bleed": t = `Lingering ${r.setting?.dmg ?? ""}`.trim(); break;
    case "builtin": t = r.which === "noReactions" ? "No Reactions" : "Loses its value in AP"; break;
    default: t = `Old setting: ${r.setting?.type ?? "?"}`;
  }
  return cap(t);
}
/** A part row's summary (On matching Actions): "1 Boon", "Empowered +1", "+1d6 Holy, +1d4 Psychic", "Low cover and one range Bane", the note's title. */
export function partSummary(rIn, key) {
  const r = normRule(rIn);
  if (!r[key]?.on) return "off";
  const only = { ...r, bb: { ...r.bb, on: key === "bb" }, emp: { ...r.emp, on: key === "emp" }, ign: { ...r.ign, on: key === "ign" }, note: { ...r.note, on: key === "note" }, dmg: { ...r.dmg, on: false } };
  if (key === "dmg") return r.dmg.list.map(d => `+${formulaWords(d.dice).replace(/the origin's /g, "")}${d.sub ? ` ${SUB(d.sub)}` : ""}`).join(", ");
  if (key === "note") return r.note.title || "(no title)";
  const t = andJoin(payload(only, false).map(plainText));
  return (key === "ign" ? t.replace(/^ignore /, "") : t) || "(nothing yet)";
}

/* ------------------------------------------------------------------ Ends */
const SAVE_ATTR = { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct", bodyinstinct: "Body / Instinct", mindappeal: "Mind / Appeal" };
const an = w => (/^[AEIOU]/i.test(String(w).replace(/^\[/, "")) ? "an" : "a");
/** "a [Strike] Action", "an [Area] Action that is ...", "any Action". */
const actionOne = f => { const t = filterText(f); return t ? `${an(t)} ${t.replace(/ Actions\b/, " Action").replace(/^Actions that are/, "Action that is").replace(/^Actions, not/, "Action, not")}` : "any Action"; };
/** Each Ends row's summary: "1 round" / "EoT" / "This encounter"; "Appeal, DC 13, end of turn"; the origin's name; "a [Strike] Action". */
export function endsSummaries(eIn, ctx = {}) {
  const e = normEnds(eIn);
  const dc = e.save.dc === "13" ? "DC 13" : e.save.dc === "origin" ? "the origin's DC" : `DC ${e.save.dcValue}`;
  return {
    time: e.time.on ? (e.time.mode === "eot" ? "EoT" : e.time.mode === "encounter" ? "This encounter" : plural(e.time.rounds, "round")) : "off",
    save: e.save.on ? `${SAVE_ATTR[e.save.attr]}, ${dc}, ${e.save.when === "eot" ? "end of turn" : "Interact"}` : "off",
    down: e.down.on ? ORIGIN(ctx) : "off",
    action: e.action.on ? actionOne(e.action.filter) : "off"
  };
}
/** "Lasts 1 round, or until an Appeal Save (DC 13) at the end of their turn ends it, or until Ogre Chieftain goes Down." Nothing ticked: "Lasts until removed." */
export function endsSentence(eIn, ctx = {}) {
  const e = normEnds(eIn), x = [];
  if (e.time.on) x.push(e.time.mode === "eot" ? "until the end of their turn" : e.time.mode === "encounter" ? "until the encounter ends" : plural(e.time.rounds, "round"));
  if (e.save.on) {
    const dc = e.save.dc === "13" ? "DC 13" : e.save.dc === "origin" ? "the origin's DC" : `DC ${e.save.dcValue}`;
    const save = e.save.attr.length > 8 ? `a Save with the better of ${SAVE_ATTR[e.save.attr]}` : `${an(SAVE_ATTR[e.save.attr])} ${SAVE_ATTR[e.save.attr]} Save`;
    x.push(`until ${save} (${dc}) ${e.save.when === "eot" ? "at the end of their turn" : "with Interact (1 AP)"} ends it`);
  }
  if (e.down.on) x.push(`until ${ORIGIN(ctx)} goes Down`);
  if (e.action.on) x.push(`until they use ${actionOne(e.action.filter)}`);
  if (!x.length) return "Lasts until removed.";
  return `Lasts ${x.join(", or ")}.`;
}

/* ------------------------------------------------------------------ v0.0.327 PACK ZONE: what an area does inside (Aura and Zone share it) */
// Four rows, each with its own Who (allies / enemies / everyone, judged from the origin's side: a neutral counts as an enemy) and "self" (the origin,
// or the Aura's creature: never its own ally, only through this switch). foundry/mockups/zone-prototype.html, option A.
export const WHO = { allies: "Allies", enemies: "Enemies", all: "Everyone" };
const whoOk = w => (["allies", "enemies", "all"].includes(w) ? w : "allies");
export const insideDefault = (o = {}) => normInside(deepMerge({
  carry: { on: false, who: "allies", self: false, fx: "", fxName: "" },
  carry2: { on: false, who: "enemies", self: false, fx: "", fxName: "" },   // v0.0.351: a second Effect (Covering Fire: the enemies' Bane and the allies' Defense)
  heal: { on: false, who: "allies", self: true, formula: "1d4" },
  ht: { on: false, who: "all", self: false, entering: true, turn: true, movement: false, list: [{ dice: "1d6", pool: "B", sub: "" }], gives: { on: false, fx: "", fxName: "" } },
  diff: { on: false, who: "all", self: false }
}, o));
export function normInside(x0) {
  const x = deepMerge({ carry: {}, carry2: { who: "enemies" }, heal: {}, ht: { gives: {} }, diff: {} }, x0 ?? {});
  for (const k of ["carry", "carry2", "heal", "ht", "diff"]) { x[k].on = !!x[k].on; x[k].self = !!x[k].self; }
  x.carry2.who = whoOk(x.carry2.who); x.carry2.fx = String(x.carry2.fx ?? ""); x.carry2.fxName = String(x.carry2.fxName ?? "");
  x.carry.who = whoOk(x.carry.who); x.heal.who = whoOk(x.heal.who); x.ht.who = ["allies", "enemies", "all"].includes(x.ht.who) ? x.ht.who : "all"; x.diff.who = ["allies", "enemies", "all"].includes(x.diff.who) ? x.diff.who : "all";
  x.carry.fx = String(x.carry.fx ?? ""); x.heal.formula = String(x.heal.formula ?? "1d4");
  x.ht.list = (x.ht.list?.length ? x.ht.list : [{ dice: "1d6", pool: "B", sub: "" }]).map(d => ({ dice: String(d.dice ?? "1"), pool: d.pool === "M" ? "M" : "B", sub: subOk(d.sub) }));
  x.ht.gives = { on: !!x.ht.gives?.on, fx: String(x.ht.gives?.fx ?? ""), fxName: String(x.ht.gives?.fxName ?? "") };
  for (const k of ["entering", "turn", "movement"]) x.ht[k] = !!x.ht[k];
  return x;
}
export const insideActive = i => !!(i && ((i.carry?.on && i.carry.fx) || (i.carry2?.on && i.carry2.fx) || i.heal?.on || i.ht?.on || i.diff?.on));
/** The patterns of a Hazard row: none ticked = Entering and Turn (Chapter 3). */
export const htPatterns = ht => { const l = ["entering", "turn", "movement"].filter(k => ht?.[k]); return l.length ? l : ["entering", "turn"]; };
const PAT = { entering: "Entering", turn: "Turn", movement: "Movement" };
/** The plain average of a dice formula ("1d4" 2.5, "2d6 + 1" 8), or null for anything else (a formula with names). */
export function diceAvg(f) {
  const s = String(f ?? "").replace(/\s+/g, "");
  if (!/^(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/i.test(s)) return null;
  let t = 0;
  for (const m of s.matchAll(/([+-]?)(\d*)d(\d+)|([+-]?)(\d+)(?!d)/gi)) {
    if (m[3]) t += (m[1] === "-" ? -1 : 1) * (Number(m[2]) || 1) * (Number(m[3]) + 1) / 2;
    else if (m[5]) t += (m[4] === "-" ? -1 : 1) * Number(m[5]);
  }
  return Math.round(t * 10) / 10;
}
/** "Allies inside, and Nari," / "Creatures inside" (selfName: the origin's name, or "this creature" on an Aura). */
const whoInside = (row, selfName) => `${{ allies: "Allies", enemies: "Enemies", all: "Creatures" }[row.who]} inside${row.self ? `, and ${selfName},` : ""}`;
/** The rows' sentences (Aura and Zone). */
export function insideSentences(insideIn, ctx = {}) {
  const x = normInside(insideIn), me = ctx.selfName || ctx.originName || "the origin", nm = u => ctx.names?.[u] || "";
  const out = [];
  if (x.carry.on) out.push(`${whoInside(x.carry, me)} gain ⟦a:${nm(x.carry.fx) || x.carry.fxName || "…"}⟧.`);
  if (x.carry2.on) out.push(`${whoInside(x.carry2, me)} gain ⟦a:${nm(x.carry2.fx) || x.carry2.fxName || "…"}⟧.`);
  if (x.heal.on) out.push(`${whoInside(x.heal, me)} heal ${formulaWords(x.heal.formula)} at the start of each of their turns.`);
  if (x.ht.on) {
    const d = x.ht.list.filter(e => String(e.dice).trim()).map(e => `⟦d:${POOL(e.pool)}:${formulaWords(e.dice)} [${POOL(e.pool)}]⟧${e.sub ? ` ⟦s:${e.sub}⟧` : ""}`);
    const gives = x.ht.gives.on ? (nm(x.ht.gives.fx) || x.ht.gives.fxName) : "";
    const what = [d.length ? `take ${andJoin(d)} damage` : "", gives ? `gain ⟦a:${gives}⟧` : ""].filter(Boolean);
    out.push(`⟦h:HT: ${htPatterns(x.ht).map(k => PAT[k]).join(", ")}⟧ ${whoInside(x.ht, me)} ${andJoin(what) || "…"}.`);
  }
  if (x.diff.on) {
    const w = x.diff.who === "all" ? (x.diff.self ? "every creature" : `every creature but ${me}`) : `${x.diff.who}${x.diff.self ? ` and ${me}` : ""}`;
    out.push(`Its squares are Difficult Terrain for ${w}.`);
  }
  return out;
}
/** A part row's summary: "Enemies · Consecrated", "Allies · 1d4 (avg 2.5) a turn", "Everyone · Entering, Turn · 1d8 Fire", "Enemies". */
export function insideSummary(insideIn, key, ctx = {}) {
  const x = normInside(insideIn), r = x[key];
  if (!r?.on) return "off";
  const w = WHO[r.who];
  if (key === "carry" || key === "carry2") return `${w} · ${ctx.names?.[r.fx] || r.fxName || "(none dropped)"}`;
  if (key === "heal") { const a = diceAvg(r.formula); return `${w} · ${r.formula}${a !== null ? ` (avg ${a})` : ""} a turn`; }
  if (key === "ht") return `${w} · ${htPatterns(r).map(k => PAT[k]).join(", ")} · ${r.list.map(d => `${d.dice}${d.sub ? ` ${SUB(d.sub)}` : ""}`).join(" + ")}`;
  return w;
}
/** Pure: does a row reach this creature? side: the origin's disposition; me: is it the origin (the Aura's creature) itself. A neutral counts as an enemy. */
export function rowReaches(row, { originDisposition = 1, disposition = 0, isOrigin = false } = {}) {
  if (!row?.on) return false;
  if (isOrigin) return !!row.self;
  const ally = Number(disposition) === Number(originDisposition);
  return row.who === "all" || (row.who === "allies" && ally) || (row.who === "enemies" && !ally);
}

/** A placed Zone's rows: its own (rows), or a v0.0.261 Zone's rules ([{ who, fxUuid, heal }]) read as rows. */
export function zoneRows(zone) {
  if (zone?.rows) return normInside(zone.rows);
  const carries = (zone?.rules ?? []).filter(r => r.fxUuid), carry = carries[0], carry2 = carries[1], heal = (zone?.rules ?? []).find(r => String(r.heal ?? "").trim());
  return normInside({ carry: carry ? { on: true, who: carry.who, self: false, fx: carry.fxUuid } : {}, carry2: carry2 ? { on: true, who: carry2.who, self: false, fx: carry2.fxUuid } : {}, heal: heal ? { on: true, who: heal.who, self: false, formula: heal.heal } : {} });
}
/** Hazard (Chapter 3): may this pattern hit now? Entering and Turn share the creature's turn-cycle limit (at: the last such hit [round, turn]); Movement has none. */
export const htMayHit = (pattern, at, { round, turn, own }) => pattern === "movement" || !turnCycleBlocked(round, turn, own, at);
/** The areas a creature enters (now in, not before). */
export const entered = (before, now) => [...now].filter(k => !before.has(k));

/* ------------------------------------------------------------------ v0.0.327 PACK ZONE: the Zone (an effect placed on the map) */
export const zoneDefault = () => ({ src: "action", shape: "emanation", size: "2", inside: insideDefault({ carry: { on: true, who: "enemies" } }), show: true, outline: "", fill: "" });
export function normZone(z0) {
  const z = deepMerge(zoneDefault(), z0 ?? {});
  z.src = z.src === "here" ? "here" : "action"; z.shape = ["emanation", "burst", "line"].includes(z.shape) ? z.shape : "emanation"; z.size = String(z.size ?? "2") || "2";
  z.inside = normInside(z.inside); z.show = z.show !== false;
  return z;
}
const SHAPE = { emanation: "Emanation", burst: "Burst", line: "Line" };
/** "2 Emanation", "2 / 3 Emanation" (the card's), "Line 4", "(equal to the origin's Power Modifier) Burst". action: { area } when "From the Action". */
export function zoneAreaText(zIn, action = null) {
  const z = normZone(zIn);
  if (z.src === "action" && action?.area) return action.area;
  const n = isNum(z.size) ? z.size.trim() : `(equal to ${formulaWords(z.size)})`;
  return z.shape === "line" ? `Line ${n}` : `${n} ${SHAPE[z.shape]}`;
}
/** The Zone's own sentences (the tip, the hover card on the map, the chips): "2 / 3 Emanation. Enemies inside gain Consecrated. Allies inside heal 1d4..." */
export function zoneSentence(zIn, ctx = {}) {
  const z = normZone(zIn);
  return [`${zoneAreaText(z, ctx.action)}.`, ...insideSentences(z.inside, ctx)].join(" ");
}
/** A Zone's Ends: Time (Rounds or This encounter, no EoT), Origin goes Down, Someone uses an Action ({ on, who: "origin" | "reach", ap }); no Save, no bearer's Action. */
export function zoneEndsSentence(eIn, ctx = {}) {
  const e = normEnds(eIn), x = [], o = ORIGIN(ctx);
  if (e.time.on) x.push(e.time.mode === "encounter" ? "until the encounter ends" : plural(e.time.rounds, "round"));
  if (e.down.on) x.push(`until ${o} goes Down`);
  if (e.someone.on) x.push(`until ${o}${e.someone.who === "reach" ? " (or a creature within Reach of it)" : ""} ends it with an Action (${e.someone.ap} AP)`);
  return x.length ? `Lasts ${x.join(", or ")}.` : "Lasts until removed.";
}
/** The squares of the preview (Set here): a grid of N x N around the center; Emanation N = (2N+1)² around a square; Burst N = squares whose center is within
 *  N of a corner (1 -> 4, 2 -> 12); Line N from the center to the right. Returns { n, cells: Set("x,y") } on a (2·k+1)² grid (k = 5). */
export function previewCells(shape, size, k = 5) {
  const n = Math.max(1, Math.min(k, Math.trunc(Number(size)) || 2)), cells = new Set(), N = 2 * k + 1;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on = false;
    if (shape === "burst") { const dx = x + 0.5 - k, dy = y + 0.5 - k; on = Math.hypot(dx, dy) <= n + 1e-9; }
    else if (shape === "line") on = y === k && x > k && x <= k + n;
    else on = Math.max(Math.abs(x - k), Math.abs(y - k)) <= n;
    if (on) cells.add(`${x},${y}`);
  }
  return { n, cells, N };
}
/**
 * v0.0.327: lift the old Zone (the "zone" settings, or the legacy "Zone (old layout)" rules) into the effect's Zone: where "map", each setting's
 * who to its rows (a dropped Effect -> Carries an Effect; a heal -> Heals, "self" off as the old block); the rest of the rules stay. Idempotent.
 * sys: { rules, where, zone }. Returns { where, zone, rules, lifted }.
 */
export function liftZone(sys) {
  const rules = (sys?.rules ?? []).map(r => (typeof r?.toObject === "function" ? r.toObject() : r));
  const old = rules.filter(r => r?.kind === "zone");
  if (!old.length) return { where: sys?.where === "map" ? "map" : "creature", zone: normZone(sys?.zone), rules, lifted: false };
  const z = normZone(sys?.where === "map" ? sys.zone : { src: "action", inside: insideDefault() });
  for (const r of old) {
    const st = r.setting ?? {}, who = whoOk(st.zoneWho);
    if (st.fxUuid && !z.inside.carry.fx) z.inside.carry = { ...z.inside.carry, on: true, who, self: false, fx: st.fxUuid };
    else if (st.fxUuid && !z.inside.carry2?.fx && st.fxUuid !== z.inside.carry.fx) z.inside.carry2 = { ...(z.inside.carry2 ?? {}), on: true, who, self: false, fx: st.fxUuid };   // v0.0.351: the second one was dropped
    if (String(st.zoneHeal ?? "").trim() && !(sys?.where === "map" && z.inside.heal.on)) z.inside.heal = { ...z.inside.heal, on: true, who, self: false, formula: String(st.zoneHeal).trim() };
  }
  return { where: "map", zone: normZone(z), rules: rules.filter(r => r?.kind !== "zone"), lifted: true };
}

/* ------------------------------------------------------------------ the hover card */
/**
 * The hover card's text, built from the rules and Ends (plain, no colors). NEW: rules that share "While they see {origin}" with the same origin are
 * written once: "While they see Ogre Chieftain: 1 Bane on their Rolls and they can't willingly move closer to it."
 */
/** A rule that does nothing yet (a new one): left out of the hover card. */
export function isEmptyRule(rIn) {
  const r = normRule(rIn);
  if (r.kind === "act") return !payload(r).length;
  if (r.kind === "grant") return !(r.item || r.itemName || r.msg.on);
  if (r.kind === "value") return r.stat === "resist" && !r.rwSub;
  if (r.kind === "aura") return !insideActive(r.inside);
  return r.kind === "raw";
}
export function hoverCardText(rulesIn, endsIn, ctx = {}) {
  const rules = (rulesIn ?? []).map(normRule).filter(r => !isEmptyRule(r));
  const groups = new Map(), out = [];
  for (const r of rules) {
    if (r.sees && (r.kind === "act" || r.kind === "move")) { const k = r.origin || ""; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
    else out.push(plainText(sentence(r, ctx)));
  }
  const g = [...groups.entries()].map(([k, rs]) => {
    const who = k ? (ctx.names?.[k] ?? ORIGIN(ctx)) : ORIGIN(ctx);
    if (rs.length === 1) return plainText(sentence(rs[0], ctx));
    const lite = rs.map(r => (r.kind === "move" ? (r.how === "difficult" ? `${lowFirst(moveWords(r, "it"))} for them` : `they ${lowFirst(moveWords(r, "it"))}`) : `${andJoin(payload(r).map(plainText))} on ${actScope(r, true)}${r.vs !== "any" ? `${r.dir === "by" ? " against " : " made by "}${plainText(VS_WORD(r.vs, who))}` : ""}${r.uses === "round" ? ", the first each round" : ""}`));
    return `While they see ${who}: ${andJoin(lite)}.`;
  });
  const body = [...g, ...out].filter(Boolean).join(" ");
  return `${body}${body ? " " : ""}${endsSentence(endsIn, ctx)}`.trim();
}

/* ------------------------------------------------------------------ spent rules (NEW: "Next one only") */
/** Rules that can be spent ("Next one only"); the others are passive. */
export const spendable = r => normRule(r).kind === "act" && normRule(r).uses === "next";
/** NEW: the effect ends when every spendable rule is spent (an effect with no spendable rule never ends this way). */
export const allSpent = (rules, spent = []) => { const s = (rules ?? []).filter(spendable); return s.length > 0 && s.every(r => (spent ?? []).includes(normRule(r).id)); };

/** NEW, the Movement limit (move.mjs): does a willing move from `before` to `after` squares away from the origin break it? */
/** v0.0.345: a Movement limit in words: "Can't willingly move closer to X" or "Moving closer to X is Difficult Terrain". */
const moveWords = (r, who) => (r.how === "difficult" ? `Moving ${r.dirm === "closer" ? "closer to" : "away from"} ${who} is Difficult Terrain` : `Can't willingly move ${r.dirm === "closer" ? "closer to" : "away from"} ${who}`);
const lowFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
export const moveLimitBreaks = (dir, before, after) => (dir === "away" ? after > before : after < before);

/* ------------------------------------------------------------------ named bonuses (NEW, the book's Stacking) */
/**
 * The total of a value's bonuses: { name, n } each ("" = unnamed). Different names add; the same name keeps the highest; an unnamed bonus never adds to
 * another bonus, so the unnamed highest counts only when it beats the named ones together. Penalties (n < 0): the worst one counts, as before.
 */
export function bonusTotal(list = []) {
  const pos = list.filter(b => Number(b.n) > 0), neg = list.filter(b => Number(b.n) < 0);
  const named = new Map();
  let unnamed = 0;
  for (const b of pos) { const n = Math.trunc(Number(b.n)); if (b.name) named.set(b.name, Math.max(named.get(b.name) ?? 0, n)); else unnamed = Math.max(unnamed, n); }
  const namedSum = [...named.values()].reduce((a, n) => a + n, 0);
  return Math.max(unnamed, namedSum) + Math.min(0, ...neg.map(b => Math.trunc(Number(b.n))));
}
