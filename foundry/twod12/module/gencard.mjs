// v0.0.357 PACK ACTION-SHEET, session 2 (Lucas's pick: mockup G2 "paste the card", foundry/mockups/generate-action.html).
// Generate Action reads a card written as text: the name line, the traits, "Trigger:", "Targets:", "Distance:", a line per Tier, "Critical:",
// "Effects:", the Flavor last. Pure (no Foundry): the tests load it.
//   parseCard(text)      -> { name, ..., versions, lines: [{ text, ok, as }] }   every line says whether it was read, and as what
//   cardSystem(card, old) -> the Action's system data (old: the Action being filled: its Versions keep their Effects and their steps)
//   cardText(name, sys)  -> an Action written back as that text (what the window shows when it is opened on an Action)
import { TWOD12 } from "./config.mjs";
import { convertEffects } from "./gen.mjs";
import { parseCardTier, humanize, tierCardText } from "./genaction.mjs";
import * as A from "./aftersteps.mjs";

const norm = s => String(s ?? "").trim().toLowerCase();
const traitKey = word => { const w = norm(word).replace(/[\[\]]/g, ""); return Object.entries(TWOD12.actionTraits ?? {}).find(([k, l]) => norm(l) === w || k === w)?.[0] ?? ""; };
const FREQ = { "at-will": "atwill", atwill: "atwill", turn: "turn", round: "round", encounter: "encounter", daily: "daily", none: "none" };
const ATTRS = ["body", "mind", "appeal", "instinct"];
/** The moment a Trigger's words name (config.mjs moments), or "". */
export function momentOf(text) {
  const t = norm(text);
  if (/would (go|be reduced to) down|would go unconscious/.test(t)) return "wouldDown";
  if (/strike\]? action against|makes? a .*strike.* against|attacks? (you or )?an ally/.test(t)) return /would (deal )?damage|damage(s)? (you or )?an ally/.test(t) ? "strikeDamage" : "strikeAgainst";
  if (/would (deal )?damage|would be damaged|strike would damage/.test(t)) return "strikeDamage";
  if (/takes? damage/.test(t)) return "allyDamage";
  if (/moves? closer/.test(t)) return "enemyCloser";
  if (/moves?|stands? up|leaves? a square/.test(t)) return "enemyMoves";
  return "";
}
const blankV = ap => ({ ap, t1: "", t2: "", t3: "", critical: "", effects: "" });

/** Read a card's text. Every line is kept in `lines` with ok (read or not) and what it was read as. */
export function parseCard(text) {
  const card = { name: "", category: "", level: 0, frequency: "", reaction: false, reactionKind: "trigger", trigger: "", moment: "", traits: [], targets: "", distance: "", vs: "", area: "", requirements: "", flavor: "", versions: [], lines: [] };
  const raw = String(text ?? "").split(/\r?\n/).map(l => l.replace(/\s+$/, "")), rows = raw.filter(l => l.trim());
  let cur = null;   // the Version the next Tier lines go to
  const version = ap => { let v = card.versions.find(x => x.ap === ap); if (!v) { v = blankV(ap); card.versions.push(v); } return v; };
  const costs = str => { const m = String(str).match(/(\d(?:\s*\/\s*\d)*)\s*(AP|R|A)\b/i); if (!m) return null; return { aps: m[1].split("/").map(x => Number(x.trim())), reaction: /^r$/i.test(m[2]) }; };
  const head = bits => {   // "Divine Power 1 · Round · 1/2/3 AP"
    for (const b0 of bits) {
      const b = b0.trim(); if (!b) continue;
      const c = costs(b);
      if (c && /^\d(?:\s*\/\s*\d)*\s*(AP|R|A)$/i.test(b)) { for (const ap of c.aps) version(ap); if (c.reaction) card.reaction = true; continue; }
      if (FREQ[norm(b)]) { card.frequency = FREQ[norm(b)]; continue; }
      const m = b.match(/^(.*?)(?:\s+(\d+))?$/); card.category = m[1].trim(); card.level = Number(m[2]) || 0;
    }
  };
  const flavorAt = (() => { for (let i = rows.length - 1; i > 0; i--) if (!/^([A-Za-z .()\d/]+:|\[|\d\s*(AP|R)\b)/i.test(rows[i].trim()) && !/^(tier|critical|effects?)\b/i.test(rows[i].trim())) return i; return -1; })();
  rows.forEach((line0, i) => {
    const line = line0.trim(), mark = (ok, as) => card.lines.push({ text: line0, ok, as });
    if (i === 0) {
      const parts = line.split(/\s{2,}|\t+|\s+[—–]\s+/), rest = parts.slice(1).join(" · ");
      card.name = parts[0].trim();
      if (rest) head(rest.split(/\s*[·•|]\s*/));
      return mark(!!card.name, "the name");
    }
    // the traits: "[Power] [Save] [Divine]" or "Power, Save, Divine"
    const br = [...line.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
    if (br.length && !line.replace(/\[[^\]]+\]/g, "").replace(/[\s,·|]/g, "") && !card.traits.length) { const keys = br.flatMap(x => x.split(",")).map(traitKey); card.traits = [...new Set(keys.filter(Boolean))]; return mark(keys.every(Boolean), keys.every(Boolean) ? "the traits" : `traits (not a trait: ${br.flatMap(x => x.split(",")).filter(x => !traitKey(x)).join(", ")})`); }
    // a Version's header: "2 AP", "1R", "2 AP:" alone on its line
    const vh = line.match(/^(\d)\s*(AP|R|A)\s*:?$/i);
    if (vh) { cur = version(Number(vh[1])); if (/^r$/i.test(vh[2])) card.reaction = true; return mark(true, `the ${vh[1]} AP Version`); }
    const m = line.match(/^([A-Za-z][A-Za-z .\d]*?)\s*(?:\(([^)]*)\))?\s*:\s*(.*)$/);
    if (m) {
      const key = norm(m[1]), paren = m[2] ?? "", val = m[3].trim();
      const pv = paren.match(/(\d)\s*(AP|R)/i), target = pv ? version(Number(pv[1])) : null;
      const each = (field, as) => {   // one value, or "a | b | c" across the Versions in the order of their costs
        const cells = val.split(/\s+\|\s+/);
        if (target) target[field] = val;
        else if (cells.length > 1 && card.versions.length >= cells.length) card.versions.slice().sort((a, b) => a.ap - b.ap).forEach((v, k) => { if (cells[k] != null) v[field] = cells[k].trim(); });
        else { cur ??= card.versions[0] ?? version(1); cur[field] = val; }
        mark(true, as);
      };
      const tier = key.match(/^tier\s*([123])$/);
      if (tier) return each(`t${tier[1]}`, `Tier ${tier[1]}${pv ? ` of the ${pv[1]} AP Version` : ""}`);
      if (key === "critical" || key === "crit") return each("critical", "the Critical");
      if (key === "effects" || key === "effect") return each("effects", `the Effects${pv ? ` of the ${pv[1]} AP Version` : ""}`);
      if (key === "trigger" || key === "interrupt") { card.reaction = true; card.reactionKind = key; card.trigger = val; card.moment = momentOf(val); const w = val.match(/within\s+(\d+)\s+squares?/i); card.within = w ? Number(w[1]) : 0; return mark(true, `a Reaction (${key === "interrupt" ? "an Interrupt" : "a Trigger"})${card.moment ? `, the moment: ${String(TWOD12.moments?.[card.moment] ?? card.moment).replace(" within N", "")}` : ", used by hand (the moment wasn't recognized)"}`); }
      if (key === "targets" || key === "target") { card.targets = val; return mark(true, "the Targets"); }
      if (key === "distance" || key === "range") {
        const [d, vs] = val.split(/\s*[·•✦|]\s*(?=vs\.?)/i);
        card.distance = d.trim(); if (vs) card.vs = vs.replace(/^vs\.?\s*/i, "").trim();
        return mark(true, `the Distance${vs ? " and Vs." : ""}`);
      }
      if (key === "vs" || key === "vs.") { card.vs = val; return mark(true, "Vs."); }
      if (key === "area") { card.area = val; return mark(true, /^(\d+)[\d\s/]*\s+(emanation|burst)|^line\s+\d+/i.test(val) ? "the Area" : "the Area line (as text: set the area on the sheet)"); }
      if (key === "requirements" || key === "requires") { card.requirements = val; return mark(true, "the Requirements"); }
      if (key === "frequency") { card.frequency = FREQ[norm(val)] ?? ""; return mark(!!card.frequency, "the Frequency"); }
      if (key === "cost") { const c = costs(val); if (c) { for (const ap of c.aps) version(ap); if (c.reaction) card.reaction = true; } return mark(!!c, "the cost"); }
      if (key === "flavor") { card.flavor = val; return mark(true, "the Flavor"); }
      if (key === "category") { head([val]); return mark(true, "the Category"); }
      if (i === rows.length - 1 && !card.flavor) { card.flavor = line; return mark(true, "the Flavor"); }   // a Flavor with a colon in it
      return mark(false, "");
    }
    if (i === flavorAt && !card.flavor) { card.flavor = line; return mark(true, "the Flavor"); }
    // "Power, Save, Divine" without brackets, on the second line
    if (i === 1 && !card.traits.length) { const keys = line.split(/[,·|]/).map(traitKey); if (keys.length && keys.every(Boolean)) { card.traits = [...new Set(keys)]; return mark(true, "the traits"); } }
    return mark(false, "");
  });
  if (!card.versions.length) card.versions.push(blankV(card.reaction ? 1 : 1));
  card.versions.sort((a, b) => a.ap - b.ap);
  // Vs.: "Appeal Save" makes it a Save; "AD" / "WD" come from the traits
  const vs = norm(card.vs);
  card.vsKey = ATTRS.find(a => vs.startsWith(a)) ?? "";
  if (/save/.test(vs) && !card.traits.includes("save") && "save" in (TWOD12.actionTraits ?? {})) card.traits.push("save");
  return card;
}

/** The Area line's settings: "2 Emanation", "3 Burst", "Line 10" (null: none). */
export function areaOf(text) {
  const m = String(text ?? "").match(/^\s*(\d+)(?:\s*\/\s*\d+)*\s+(emanation|burst)/i), l = String(text ?? "").match(/^\s*line\s+(\d+)/i);
  return m ? { size: Number(m[1]), shape: m[2].toLowerCase() } : l ? { size: Number(l[1]), shape: "line" } : null;
}

/**
 * The Action's system data from a read card. old: the system of the Action being filled (its Versions, by AP cost, keep their Effects, their
 * area and the steps they already have; the old window dropped them). The Tiers' words that read as steps become steps (aftersteps.mjs fillSteps)
 * and stay plain words in the Tier text. Returns { system, notes: [..what was kept as plain text or left..] }.
 */
export function cardSystem(card, old = null) {
  const isSave = card.traits.includes("save"), notes = [];
  const oldV = ap => (old?.versions ?? []).find(v => v.ap === ap) ?? null;
  const versions = card.versions.map(v => {
    const t = [1, 2, 3].map(n => parseCardTier(v[`t${n}`]));
    const noTiers = t.every(x => !x.insts.length && !x.text) && !String(v.critical ?? "").trim();
    const conv = { x1: t[0].text, x2: t[1].text, x3: t[2].text, critical: convertEffects(v.critical ?? "") };
    // A Version the Action already has keeps its steps and its Tier text's buttons as they are (a card not yet written with Lucas works by its
    // buttons: the audit's D16); only a new Version's words become steps.
    const keep = oldV(v.ap);
    const fill = keep ? { steps: [], left: [] } : A.fillSteps(conv, isSave), fresh = fill.steps;
    for (const l of fill.left) notes.push(`${v.ap} AP: "${l}" stays text (a chip can't say that Tier alone).`);
    // v0.0.358 (Lucas: "a weird warning"): words are words; only say so when they look like damage that wasn't read ("2d6 Cold dmg")
    for (const x of t) for (const p of x.plain) if (/\d+d\d+|\[[VRBMCW]\]/i.test(p)) notes.push(`${v.ap} AP: "${p}" looks like damage but wasn't read as it: it is kept as words. Write it like [V] 2d6 Co.`);
    const steps = [...A.parseAfter(keep?.after), ...fresh];
    // With steps, the Tier text is the words as they were written (nothing happens twice); without, its buttons as before.
    const written = { x1: tierWords(v.t1), x2: tierWords(v.t2), x3: tierWords(v.t3), critical: String(v.critical ?? "").trim() };
    const words = k => (!keep && steps.length ? written[k] : conv[k]);   // with steps, the text is the book's words: nothing happens twice
    return { ap: Math.max(0, Math.min(5, Math.trunc(Number(v.ap)) || 0)), mode: keep?.mode ?? "", noTiers, t1: t[0].insts, t2: t[1].insts, t3: t[2].insts, x1: words("x1"), x2: words("x2"), x3: words("x3"),
      critical: words("critical"), effects: convertEffects(v.effects ?? ""), after: A.writeAfter(steps), areaSize: keep?.areaSize ?? 0, areaRounds: keep?.areaRounds ?? 0,
      fx: keep?.fx ? JSON.parse(JSON.stringify(keep.fx)) : { all: [], t1: [], t2: [], t3: [] } };
  });
  const system = { traits: [...card.traits], frequency: card.frequency || (old?.frequency ?? ""), reaction: !!card.reaction, reactionKind: card.reactionKind === "interrupt" ? "interrupt" : "trigger", trigger: card.trigger,
    targets: card.targets, distance: card.distance, vs: card.vsKey, flavor: card.flavor, requirements: card.requirements, versions };
  if (card.category) { system.category = card.category; system.level = card.level; }
  if (card.reaction && card.moment) { system.moment = card.moment; if (card.within && !/\d/.test(card.distance)) system.momentRange = card.within; system.momentTarget = /triggering creature|the attacker|that enemy/i.test(card.targets) && ["strikeAgainst", "strikeDamage"].includes(card.moment) ? "source" : (old?.momentTarget ?? "subject"); }
  const area = areaOf(card.area);
  if (area) { system.areaCfg = { ...(old?.areaCfg ?? {}), size: area.size, shape: area.shape }; if (!system.traits.includes("area") && "area" in (TWOD12.actionTraits ?? {})) system.traits.push("area"); }
  return { system, notes };
}

/** A Tier's words as they were written: what follows its damage ("[R] 1d8 Ho; Pushed 2, and Frightened" -> "Pushed 2, and Frightened"). */
export function tierWords(raw) {
  return String(raw ?? "").split(";").map(x => x.trim()).filter(Boolean).filter(piece => { const p = parseCardTier(piece); return !(p.insts.length && !p.text && !p.plain.length); }).join("; ");
}

/** An Action as the text the window reads (so it opens filled, and what it shows reads back). */
export function cardText(name, sys) {
  const s = sys ?? {}, vs = [...(s.versions ?? [])], traits = [...(s.traits ?? [])];
  const order = (TWOD12.traitGroups ?? []).flatMap(g => g.traits).filter(k => traits.includes(k)), lab = k => TWOD12.actionTraits?.[k] ?? k;
  const cost = vs.length ? `${vs.map(v => v.ap).join("/")}${s.reaction ? "R" : " AP"}` : "";
  const freq = s.frequency && s.frequency !== "none" && TWOD12.frequencies?.[s.frequency] && s.frequency !== "" ? TWOD12.frequencies[s.frequency] : "";
  const headBits = [[s.category, Number(s.level) > 0 ? s.level : ""].filter(Boolean).join(" "), freq === "Default" ? "" : freq, cost].filter(Boolean);
  const out = [`${name}${headBits.length ? `    ${headBits.join(" · ")}` : ""}`];
  if (traits.length) out.push([...order, ...traits.filter(k => !order.includes(k))].map(k => `[${lab(k)}]`).join(" "));
  if (s.reaction && s.trigger) out.push(`${s.reactionKind === "interrupt" ? "Interrupt" : "Trigger"}: ${plain(s.trigger)}`);
  if (s.requirements) out.push(`Requirements: ${plain(s.requirements)}`);
  if (s.targets) out.push(`Targets: ${plain(s.targets)}`);
  if (s.area) out.push(`Area: ${s.area}`);
  if (s.distance || s.vs) out.push(`Distance: ${plain(s.distance || "")}${s.vs && s.vs !== "roll" ? ` · Vs. ${s.vs[0].toUpperCase()}${s.vs.slice(1)}${traits.includes("save") ? " Save" : ""}` : ""}`);
  for (const v of vs) {
    if (vs.length > 1) out.push(`${v.ap}${s.reaction ? "R" : " AP"}`);
    if (!v.noTiers) for (const n of [1, 2, 3]) { const t = tierCardText(v, n); out.push(`Tier ${n}: ${t || (traits.includes("save") && n === 3 ? "No effect." : "")}`.trimEnd()); }
    if (v.critical) out.push(`Critical: ${humanize(plain(v.critical))}`);
    if (v.effects) out.push(`Effects: ${humanize(plain(v.effects))}`);
  }
  if (s.flavor) out.push(plain(s.flavor));
  return out.join("\n");
}
const plain = t => String(t ?? "").replace(/<[^>]+>/g, "").replace(/\s*\n\s*/g, " ").trim();
