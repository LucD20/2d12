// v0.0.355 PACK ACTION-SHEET (Lucas's pick: mockup A2, foundry/mockups/action-sheet-A2.html; the audit: foundry/mockups/action-effects-audit.md).
// The pure model of a Version's "After the damage" chain as steps, and of the order of events. No Foundry here: the tests load it.
//   - the chain is still the Version's `after` text (chips run one after the other once the damage is applied and lands): the steps read it and
//     write it back, so nothing is migrated and the runtime (inline.mjs runChain) doesn't change. An option a step has no control for is kept.
//   - "On which result" (the audit's D13): a chip's tier:N means "that Tier or better" on a roll and "that Tier or worse" on a Save; the sheet shows
//     the Tiers a step runs on, and writes the chip from the choice.
//   - the order of events (Lucas, 2026-11-11): when it is used, the cost, the target, the roll, the Effects applied, the damage, each step.

/** Split at a separator outside brackets, braces and quotes. */
function splitTop(str, sep) {
  const out = []; let cur = "", depth = 0, q = false;
  for (const ch of String(str ?? "")) {
    if (ch === '"') q = !q;
    if (!q) { if ("[({".includes(ch)) depth++; else if ("])}".includes(ch)) depth = Math.max(0, depth - 1); }
    if (ch === sep && !q && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
const CHIP = /@(\w+)\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\](?:\{([^}]*)\})?/g;
export const STEP_KINDS = {
  Move: { title: "Forced Movement", tile: "M", cls: "rule", group: "Moves", head: "pushed", opts: [["distance", "1"]] },
  Condition: { title: "A condition", tile: "C", cls: "cond", group: "Gives", head: "prone", opts: [] },
  Effect: { title: "An Effect", tile: "E", cls: "cond", group: "Gives", head: "", opts: [] },
  Guard: { title: "Guard", tile: "G", cls: "wp", group: "Gives", head: "1d6", opts: [] },
  Heal: { title: "A heal", tile: "H", cls: "au", group: "Gives", head: "1d6", opts: [] },
  Reduce: { title: "Reduce the next damage", tile: "R", cls: "esc", group: "Gives", head: "1d6", opts: [] },
  EndEffect: { title: "End an Effect", tile: "X", cls: "tk", group: "Other", head: "eot1", opts: [] },
  Pause: { title: "A pause", tile: "P", cls: "rule", group: "Other", head: "After the damage", opts: [] }
};
export const STEP_MENU = [["Moves", ["Move"]], ["Gives", ["Condition", "Effect", "Guard", "Heal", "Reduce"]], ["Other", ["EndEffect", "Pause"]]];

/** The chain as steps: [{ kind, head, opts: [[key, value | null]], label }]; text between chips is kept as { kind: "text", text }. A bare option ("eot") has a null value. */
export function parseAfter(str) {
  const s = String(str ?? ""), out = [];
  let last = 0;
  for (const m of s.matchAll(CHIP)) {
    const between = s.slice(last, m.index).trim();
    if (between) out.push({ kind: "text", text: between });
    const segs = splitTop(m[2], "|").map(x => x.trim());
    out.push({ kind: m[1], head: segs[0] ?? "", label: m[3] ?? "", opts: segs.slice(1).filter(Boolean).map(x => { const i = x.indexOf(":"); return i < 0 ? [x, null] : [x.slice(0, i).trim(), x.slice(i + 1).trim()]; }) });
    last = m.index + m[0].length;
  }
  const tail = s.slice(last).trim();
  if (tail) out.push({ kind: "text", text: tail });
  return out;
}
export const writeStep = st => (st.kind === "text" ? st.text : `@${st.kind}[${[st.head, ...st.opts.map(([k, v]) => (v == null ? k : `${k}:${v}`))].join("|")}]${st.label ? `{${st.label}}` : ""}`);
export const writeAfter = steps => (steps ?? []).map(writeStep).filter(Boolean).join(" ");
export const newStep = kind => { const k = STEP_KINDS[kind] ?? STEP_KINDS.Pause; return { kind: STEP_KINDS[kind] ? kind : "Pause", head: k.head, label: "", opts: k.opts.map(o => [...o]) }; };

const low = k => String(k).toLowerCase();
export const optGet = (st, key) => { const o = (st?.opts ?? []).find(([k]) => low(k) === low(key)); return o ? (o[1] ?? "yes") : ""; };
export const optHas = (st, key) => (st?.opts ?? []).some(([k]) => low(k) === low(key));
/** Set, or remove with "" / null / false. In place; the option keeps its position. */
export function optSet(st, key, value) {
  const i = st.opts.findIndex(([k]) => low(k) === low(key)), off = value === "" || value == null || value === false;
  if (off) { if (i >= 0) st.opts.splice(i, 1); return st; }
  const v = value === true ? "yes" : String(value);
  if (i >= 0) st.opts[i] = [st.opts[i][0], v]; else st.opts.push([key, v]);
  return st;
}
const yes = v => /^(yes|true|1|y)$/i.test(String(v));

/* ------------------------------------------------------------------ on which result */
const TIERS = ["t1", "t2", "t3"];
/** A Forced Movement whose distance is written per Tier (t1:2|t2:1). */
export const moveByTier = st => st?.kind === "Move" && TIERS.some(k => optHas(st, k));
/** The choices of "On" for this Action: a roll (that Tier or better) or a Save (that Tier or worse). */
export const onChoices = isSave => (isSave
  ? [["any", "Any result", TIERS], ["t12", "Tier 1 or 2", ["t1", "t2"]], ["t1", "Tier 1", ["t1"]]]
  : [["any", "Any result", TIERS], ["t23", "Tier 2 or 3", ["t2", "t3"]], ["t3", "Tier 3", ["t3"]], ["crit", "A Critical", ["crit"]]]);
/** The choice a step has now. */
export function stepOn(st, isSave = false) {
  if (yes(optGet(st, "crit")) && optHas(st, "crit")) return "crit";
  const t = Number(optGet(st, "tier")) || 0;
  if (isSave) return t === 1 ? "t1" : t === 2 ? "t12" : "any";
  return t === 2 ? "t23" : t === 3 ? "t3" : "any";
}
export function setStepOn(st, on, isSave = false) {
  optSet(st, "crit", ""); optSet(st, "tier", "");
  if (on === "crit") optSet(st, "crit", "yes");
  else if (isSave) { if (on === "t1") optSet(st, "tier", 1); else if (on === "t12") optSet(st, "tier", 2); }
  else if (on === "t23") optSet(st, "tier", 2); else if (on === "t3") optSet(st, "tier", 3);
  return st;
}
/** v0.0.358 (Lucas: a Tier 2 alone couldn't be said): on:2 / on:1,3 are the exact Tiers a step runs on. */
const onList = st => String(optGet(st, "on")).split(",").map(x => Number(x.trim())).filter(n => [1, 2, 3].includes(n));
/**
 * Set the Tiers a step runs on (any set of 1, 2, 3; none = all) or a Critical. The older chips are written where they say the same (tier:2 on a
 * roll is Tier 2 or 3; on a Save, Tier 1 or 2), so the cards' chains don't change; any other set is on:N,N.
 */
export function setStepTiers(st, tiers, isSave = false, crit = false) {
  optSet(st, "crit", ""); optSet(st, "tier", ""); optSet(st, "on", "");
  if (crit) return optSet(st, "crit", "yes");
  const set = [...new Set((tiers ?? []).map(Number).filter(n => [1, 2, 3].includes(n)))].sort(), key = set.join("");
  if (!set.length || key === "123") return st;
  const old = isSave ? { 1: 1, 12: 2 }[key] : { 3: 3, 23: 2 }[key];
  return old ? optSet(st, "tier", old) : optSet(st, "on", set.join(","));
}
/** The results a step runs on, for the lit chips: ["t1", "t2"], ["crit"]... A by-Tier move: the Tiers with a distance. */
export function stepTiers(st, isSave = false) {
  if (optHas(st, "on") && onList(st).length && !(yes(optGet(st, "crit")) && optHas(st, "crit"))) return onList(st).map(n => `t${n}`);
  if (moveByTier(st)) return TIERS.filter(k => optHas(st, k) || (optHas(st, "distance") && (isSave ? k !== "t3" : true)));
  const on = stepOn(st, isSave);
  return (onChoices(isSave).find(c => c[0] === on) ?? onChoices(isSave)[0])[2];
}
export const tiersShort = tiers => (tiers.length === 3 ? "any result" : tiers.map(k => (k === "crit" ? "Critical" : `T${k[1]}`)).join(" / "));

/* ------------------------------------------------------------------ words */
const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const MOVES = { pushed: "Pushed", pulled: "Pulled", slid: "Slid", evade: "Evade", advance: "Advance", reposition: "Reposition" };
export const formulaWords = f => String(f ?? "").replace(/\s+/g, "").replace(/\bmod\b/gi, "[Mod]").replace(/\bpow\b/gi, "[Power]").replace(/\bwpn\b/gi, "[Weapon]").replace(/([+*/-])/g, " $1 ");
/** Whom a step is for, in words. */
export function stepWho(st) {
  const area = optGet(st, "area"), near = optGet(st, "near"), who = low(optGet(st, "who")), side = low(optGet(st, "side"));
  if (st.kind === "Move") return yes(optGet(st, "pick")) ? `the others in ${area ? `a ${area} Emanation around the target` : "the area"}, one by one` : side ? `the ${side} among the targets` : "the target";
  if (["Guard", "Heal", "Reduce"].includes(st.kind)) {
    const where = area ? ` in a ${area} Emanation around the target` : near ? ` within ${near} squares` : "";
    if (who === "pick") return `you or one ally${where}`;
    if (who === "all") return `you and every ally${where}`;
    if (who === "targets") return "the targets";
    if (who === "self" || yes(optGet(st, "self"))) return "you";
    return st.kind === "Guard" ? (where ? `the allies${where}` : "you") : "the target";
  }
  if (who === "targets") return "the targets";
  return side ? `the ${side} among the targets` : "the target";
}
/** A by-Tier move's distance on a Tier: its own (t1:2), else the chip's distance. */
export const tierDistance = (st, k) => optGet(st, k) || optGet(st, "distance") || "";
export function stepLabel(st, isSave = false) {
  if (st.kind === "text") return st.text;
  if (st.kind === "Move") { const w = MOVES[low(st.head)] ?? cap(st.head); return moveByTier(st) ? `${w} ${stepTiers(st, isSave).map(k => tierDistance(st, k)).join(" / ")}` : `${w} ${optGet(st, "distance") || 1}`; }
  if (st.kind === "Condition") {
    const r = optGet(st, "rounds") || optGet(st, "duration"), bare = st.opts.find(([k, v]) => v == null && /^(eot|\d+)$/i.test(k))?.[0] ?? "";
    const dur = /^eot$/i.test(r) || /^eot$/i.test(bare) ? "EoT" : Number(r || bare) ? `${Number(r || bare)} round${Number(r || bare) === 1 ? "" : "s"}` : "";
    return `${cap(st.head)}${optGet(st, "value") ? ` ${optGet(st, "value")}` : ""}${dur ? ` (${dur})` : ""}`;
  }
  if (st.kind === "Guard") return `Guard ${formulaWords(st.head)}`;
  if (st.kind === "Heal") return `Heal ${formulaWords(st.head)}`;
  if (st.kind === "Reduce") return `Reduce ${formulaWords(st.head)}`;
  if (st.kind === "Effect") return st.label || "An Effect";
  if (st.kind === "EndEffect") return low(st.head) === "any" ? "End an Effect" : "End an Effect (EoT or 1 round)";
  if (st.kind === "Pause") return `Pause: ${st.head}`;
  return `${st.kind} ${st.head}`;
}
/** "On a Tier 1: the target is Frightened for 1 round." */
export function stepSentence(st, isSave = false) {
  if (st.kind === "text") return st.text;
  const tiers = stepTiers(st, isSave), who = stepWho(st), plural = /^the (others|allies|targets)|every|among/.test(who);
  const down = yes(optGet(st, "down")) && optHas(st, "down");   // v0.0.360
  const when = `${tiers.length === 3 ? "After the damage" : `On ${tiers.map(k => (k === "crit" ? "a Critical" : `a Tier ${k[1]}`)).join(" or ")}`}${down ? ", if the target goes Down" : ""}`;
  let what;
  if (st.kind === "Move") {
    const from = { target: "the target", area: "the area's center" }[low(optGet(st, "from"))] ?? "you";
    const w = MOVES[low(st.head)] ?? cap(st.head), d = moveByTier(st) ? tiers.map(k => `${tierDistance(st, k)} (Tier ${k[1]})`).join(", ") : (optGet(st, "distance") || 1);
    if (["evade", "advance", "reposition"].includes(low(st.head))) what = `you can ${w} ${d}`;
    else what = `${who} ${plural ? "are" : "is"} ${w} ${d}${["pushed", "pulled"].includes(low(st.head)) ? `, ${low(st.head) === "pulled" ? "toward" : "away from"} ${from}` : ""}`;
  } else if (st.kind === "Condition") what = `${who} ${plural ? "are" : "is"} ${stepLabel(st, isSave).replace(/ \(EoT\)$/, " until the end of their turn").replace(/ \((\d+ rounds?)\)$/, " for $1")}`;
  else if (st.kind === "Guard") what = `${who} gain${plural || who.startsWith("you") ? "" : "s"} Guard ${formulaWords(st.head)}`;
  else if (st.kind === "Heal") what = `${who} heal${plural || who.startsWith("you") ? "" : "s"} ${formulaWords(st.head)}`;
  else if (st.kind === "Reduce") what = `the next damage ${who} take${plural || who.startsWith("you") ? "" : "s"} is reduced by ${formulaWords(st.head)}`;
  else if (st.kind === "Effect") what = `${who} gain${plural ? "" : "s"} ${st.label || "the Effect"}`;
  else if (st.kind === "EndEffect") what = `${who} end${plural ? "" : "s"} ${low(st.head) === "any" ? "one effect on them" : "one effect that lasts until the end of a turn or 1 round"}`;
  else if (st.kind === "Pause") what = `the chain stops; the rest waits for the "${st.head}" button`;
  else what = `${st.kind} ${st.head}`;
  return `${when}: ${what}.`;
}

/* ------------------------------------------------------------------ by Stage (the audit's D15, D23, D51) */
/** The formulas a chip has by Stage: { 0: "", 1: "1d8+mod", ... } for the Stage numbers given (sN: on the chip; the chip's own formula is the lowest Stage's). */
export function stageValues(st, stages) {
  const out = {};
  for (const n of stages) out[n] = optGet(st, `s${n}`);
  return out;
}
export const hasStages = st => (st?.opts ?? []).some(([k]) => /^s\d+$/i.test(k));

/* ------------------------------------------------------------------ fill from the Tier text */
/**
 * The steps the Tier text and the Critical line would make (the audit's D14). texts: { x1, x2, x3, critical } already converted to chips
 * (gen.mjs convertEffects). Returns { steps, left }: left lists what could not be said as a step (a condition on a Tier 2 only, on a roll).
 * Forced Movement merges into one step with a distance per Tier; a condition takes the Tiers it is written on when a chip can say them.
 */
export function fillSteps(texts, isSave = false) {
  const per = [1, 2, 3].map(n => parseAfter(texts?.[`x${n}`]).filter(s => s.kind !== "text"));
  const steps = [], left = [];
  // Forced Movement
  const moves = new Map();
  per.forEach((list, i) => { for (const s of list) if (s.kind === "Move" && ["pushed", "pulled", "slid"].includes(low(s.head))) { const m = moves.get(low(s.head)) ?? {}; m[`t${i + 1}`] = optGet(s, "distance") || "1"; moves.set(low(s.head), m); } });
  for (const [kind, d] of moves) {
    const st = newStep("Move"); st.head = kind;
    const vals = TIERS.map(k => d[k]).filter(Boolean), same = vals.every(v => v === vals[0]);
    const all = isSave ? (d.t1 && d.t2) : vals.length === 3;
    if (same && all && (isSave ? !d.t3 : true)) optSet(st, "distance", vals[0]);
    else { st.opts = []; for (const k of TIERS) if (d[k]) optSet(st, k, d[k]); }
    steps.push(st);
  }
  // conditions and the rest
  const seen = new Set();
  per.forEach((list, i) => {
    for (const s of list) {
      if (s.kind === "Move" && moves.has(low(s.head))) continue;
      const key = writeStep({ ...s, label: "" });
      if (seen.has(key)) continue;
      const on = [0, 1, 2].filter(j => per[j].some(x => writeStep({ ...x, label: "" }) === key)).map(j => j + 1);
      seen.add(key);
      const st = { kind: s.kind, head: s.head, label: s.kind === "Effect" ? s.label : "", opts: s.opts.map(o => [...o]) };
      steps.push(setStepTiers(st, on, isSave));   // v0.0.358: any set of Tiers can be said (on:2)
    }
  });
  for (const s of parseAfter(texts?.critical).filter(x => x.kind !== "text")) steps.push(setStepTiers({ kind: s.kind, head: s.head, label: s.kind === "Effect" ? s.label : "", opts: s.opts.map(o => [...o]) }, [], isSave, true));
  return { steps, left };
}

/* ------------------------------------------------------------------ the order of events */
/**
 * The events of one Version, in the order they happen. sys: the Action's system (plain); v: the Version; names: { uuid: name } of its Effects;
 * labels: { moments, frequencies } (config). Each: { key, tile, cls, title, sub, to } (to: the part of the sheet it is edited in).
 */
export function versionEvents(sys, v, { names = {}, moments = {}, frequencies = {}, dmgText = () => "" } = {}) {
  const ev = [], add = (tile, cls, title, sub, to, o = {}) => ev.push({ tile, cls, title, sub, to, ...o });
  const traits = [...(sys.traits ?? [])], isSave = traits.includes("save"), a = sys.areaCfg ?? {}, hasArea = (Number(a.size) || 0) > 0;
  if (sys.reaction) add("R", "esc", sys.reactionKind === "interrupt" ? "Interrupt" : "Trigger", String(moments[sys.moment] ?? "used by hand").replace(" within N", sys.momentRangeExpr ? ` within ${sys.momentRangeExpr}` : sys.momentRange ? ` within ${sys.momentRange}` : ""), "when");
  else add("T", "rule", "On your turn", sys.frequency && sys.frequency !== "none" && frequencies[sys.frequency] ? `Frequency: ${frequencies[sys.frequency]}` : "", "card");
  add(String(v.ap), "ap", `Pay ${v.ap} AP${sys.reaction ? " (R)" : ""}`, Number(sys.escalation) > 0 ? `needs Escalation ${sys.escalation}` : "", "vers");
  if (hasArea) add("A", "au", "Place the area", `${v.areaSize || a.size} ${a.shape === "line" ? "Line" : cap(a.shape || "emanation")}${a.shape === "line" ? "" : a.withinRange ? `, the weapon's ${a.withinRange} range` : Number(a.within) > 0 ? `, within ${a.within} sq.` : ", around you"}`, "when");
  else add("◎", "rule", sys.targets || "A target", sys.marksTarget ? "it becomes your mark" : sys.distance ? `Distance: ${sys.distance}` : "", "card");
  if (!v.noTiers) add("2d", "bb", isSave ? "The target's Save" : "Your roll", isSave ? "a Tier for each target" : "Tier 1, 2 or 3", "tiers");
  for (const x of v.fx?.all ?? []) add("E", "cond", names[x.uuid] || "An Effect", v.noTiers ? "on use" : "on a Tier 2 or 3", "use");
  if (!v.noTiers) add("D", "tk", "The damage", ["t1", "t2", "t3"].map(k => dmgText(v[k]) || "none").join(" / "), "tiers", { mono: true });
  parseAfter(v.after).forEach((st, i) => { if (st.kind === "text") return; const k = STEP_KINDS[st.kind] ?? { tile: "?", cls: "rule" }; add(k.tile, k.cls, st.kind === "Effect" ? (names[st.head] || stepLabel(st)) : stepLabel(st, isSave), `${tiersShort(stepTiers(st, isSave))} · ${stepWho(st)}`, "after", { after: true, step: i }); });
  return ev;
}
