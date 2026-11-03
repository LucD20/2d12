// Pack CS proof (2026-11-03): from cards.json (the proposed one-source format) generate, for each card,
//   1. the book's card block (the Markdown the builder's card() reads) and diff it against the block in book/rules-src;
//   2. the Foundry item data and compare it with what tools/content.mjs (or module/basic.mjs for a Basic Action) builds today;
//   3. the ruler's action line(s) and compare them with the lines of book/ruler/classes/*.txt (text diff, then the parsed damage).
// Throwaway: nothing in the real builds reads this. Run: node book/card-source-proof/proof.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "../..");
const src = JSON.parse(fs.readFileSync(path.join(here, "cards.json"), "utf8")).cards;

// content.mjs installs the Foundry stand-ins the generators need, so it is imported first.
const content = await import(path.join(ROOT, "foundry/twod12/tools/content.mjs"));
const gen = await import(path.join(ROOT, "foundry/twod12/module/gen.mjs"));
const basic = await import(path.join(ROOT, "foundry/twod12/module/basic.mjs"));
const ruler = await import(path.join(ROOT, "book/ruler/spec.mjs"));

/* ------------------------------------------------------------------ shared helpers */
const cap = s => s[0].toUpperCase() + s.slice(1);
const isReaction = c => /^(Interrupt|Trigger)$/.test(c.reactionKind ?? "") || c.interrupt || c.trigger;
const reactionKind = c => (c.interrupt ? "interrupt" : c.trigger ? "trigger" : "");
const multi = c => c.versions.length > 1;
/** "damage; effect text" -> [damage, effect] (the first ";" splits). */
const splitTier = t => { const i = t.indexOf(";"); return i < 0 ? [t.trim(), ""] : [t.slice(0, i).trim(), t.slice(i + 1).trim()]; };
const stripLinks = s => s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");

/* ------------------------------------------------------------------ 1. the book's card block */
function costText(c) {
  if (!c.versions?.length) return "";
  const aps = c.versions.map(v => v.ap);
  return isReaction(c) ? `${aps.join(" / ")}R` : `${aps.join(" / ")} AP`;
}
function bookBlock(c) {
  const L = ['<div class="action" markdown="1">'];
  const cost = costText(c);
  L.push(`<div class="action-head"><span>${c.name}</span>${cost ? `<span>${cost}</span>` : ""}<span class="cat">${c.category}${c.level ? " " + c.level : ""}</span></div>`, "");
  if (c.flavor) L.push(`**Flavor:** ${c.flavor}`, "");
  if (c.traits?.length) L.push(`*${c.traits.map(cap).join(" • ")}*`, "");
  const field = (k, v) => { if (v) L.push(`**${k}:** ${v}`, ""); };
  field("Escalation", c.escalation); field("Frequency", c.frequency); field("Target", c.target); field("Area", c.area);
  field("Distance", c.distance); field("Vs", c.vs); field("Requirements", c.requirements); field("Interrupt", c.interrupt); field("Trigger", c.trigger);
  if (c.rules) L.push(c.rules, "");
  if (c.versions?.length) {
    const head = c.versions.map(v => (isReaction(c) ? `${v.ap}R` : `${v.ap} AP`));
    const tiered = c.versions.some(v => v.tiers);
    if (tiered) {
      L.push(`| | ${head.join(" | ")} |`, `|---|${head.map(() => "---").join("|")}|`);
      for (const t of [0, 1, 2]) L.push(`| **Tier ${t + 1}** | ${c.versions.map(v => v.tiers[t]).join(" | ")} |`);
      if (c.versions.some(v => v.critical)) L.push(`| **Critical** | ${c.versions.map(v => v.critical ?? "").join(" | ")} |`);
      if (c.versions.some(v => v.effects)) L.push(`| **Effects** | ${c.versions.map(v => v.effects ?? "").join(" | ")} |`);
    } else {
      L.push(`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, `| ${c.versions.map(v => v.effects ?? "").join(" | ")} |`);
    }
    L.push("");
  }
  if (c.notes) L.push(c.notes, "");
  L.push("</div>");
  return L.join("\n");
}
/** The block of a card as it is written in rules-src today. */
function rulesSrcBlock(name) {
  for (const f of fs.readdirSync(path.join(ROOT, "book/rules-src")).filter(f => /^\d\d-.*\.md$/.test(f))) {
    const text = fs.readFileSync(path.join(ROOT, "book/rules-src", f), "utf8");
    const re = /<div class="action" markdown="1">[\s\S]*?\n<\/div>/g;
    let m;
    while ((m = re.exec(text))) if (m[0].includes(`<div class="action-head"><span>${name}</span>`)) return { file: f, block: m[0] };
  }
  return null;
}

/* ------------------------------------------------------------------ 2. the Foundry item data */
const FREQ = { "at-will": "atwill", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const DIST = s => { const t = (s ?? "").trim(); if (!t) return ""; if (/^weapon$/i.test(t)) return "weapon"; if (/^reach$/i.test(t)) return "reach"; if (/^self$/i.test(t)) return "self"; const m = t.match(/^(\d+) sq\.?$/i); return m ? m[1] : t; };
const SUB = { Ac: "Ac", Bl: "Bl", Co: "Co", El: "El", Fi: "Fi", Fo: "Fo", Ho: "H", Pi: "Pi", Ps: "Ps", Sl: "S", Th: "Th", Un: "Un" };   // the codes gen.mjs reads (Ho -> H, Sl -> S as content.mjs writes them; both parse the same)
/** The book's damage text of one tier ("[B] 1[W] + [Mod] + [M] 1d6 Ho") to the Foundry tier tokens ("1WB,1d6MH").
 *  A [Weapon] Action adds the Weapon Modifier on Tiers 2 and 3 by itself (basic.mjs), so [Mod] is left out there. */
function tierTokens(dmg, weaponAction, tier) {
  if (!dmg || dmg === "0" || dmg === "-") return "";
  const out = []; let pool = "B", sub = "";
  const parts = dmg.split("+").map(s => s.trim()).filter(Boolean);
  // a trailing damage type code applies to every dice token of its pool ("[B] 1d4+2+[Mod] Pi": the "Pi" sits on the last part)
  const tokens = [];
  for (let p of parts) {
    let m;
    if ((m = p.match(/^\[(B|M)\]\s*(.*)$/))) { pool = m[1]; p = m[2].trim(); }
    if ((m = p.match(/^(.*?)\s+(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)$/))) { sub = SUB[m[2]]; p = m[1].trim(); }
    if (p) tokens.push({ p, pool });
  }
  let flat = null;
  for (const { p, pool: pl } of tokens) {
    let m;
    if ((m = p.match(/^(\d*)\[W\]$/))) out.push({ k: "w", t: `${m[1] || 1}W${pl}` });
    else if (p === "[Mod]") { if (!(weaponAction && tier >= 2)) out.push({ k: "at", t: `Mod${pl}${sub}` }); }
    else if (/^\d+d\d+$/.test(p)) out.push({ k: "dice", t: `${p}${pl}${sub}`, pool: pl });
    else if (/^\d+$/.test(p)) flat = p;
    else throw new Error(`can't read "${dmg}" (the part "${p}")`);
  }
  if (flat !== null) { const d = out.find(x => x.k === "dice"); if (!d) throw new Error(`a flat number with no dice in "${dmg}"`); d.t = d.t.replace(/^(\d+d\d+)/, `$1+${flat}`); }
  return out.map(x => x.t).join(",");
}
const fxUuid = s => s.replace(/\{\{fx:([^}]+)\}\}/g, (m, n) => content.uuidOf("effects", n));
function foundryItem(c) {
  const weaponAction = c.traits.includes("weapon");
  const versions = c.versions.map(v => {
    const tiers = (v.tiers ?? ["", "", ""]).map((t, i) => { const [d, x] = splitTier(t); const tok = tierTokens(d, weaponAction, i + 1); return x ? `${tok}${tok ? "," : ""}"${x}"` : tok; });
    const effText = fxUuid(v.foundry?.effects ?? stripLinks(v.effects ?? ""));
    let out;
    if (v.tiers) { const p = tiers.map(gen.parseTierFull); out = { ap: v.ap, noTiers: false, t1: p[0].insts, t2: p[1].insts, t3: p[2].insts, x1: p[0].text, x2: p[1].text, x3: p[2].text, effects: gen.convertEffects(effText), fx: { all: [], t1: [], t2: [], t3: [] } }; }
    else out = { ap: v.ap, noTiers: true, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", effects: gen.convertEffects(effText), fx: { all: [], t1: [], t2: [], t3: [] } };
    for (const k of ["x1", "x2", "x3"]) if (v.foundry?.[k] !== undefined) out[k] = v.foundry[k];   // plain text where the Effect applies the Condition (no button)
    for (const [k, list] of Object.entries(v.foundry?.fx ?? {})) out.fx[k] = list.map(u => ({ uuid: fxUuid(u), mode: "auto" }));
    return out;
  });
  const sys = { category: c.category, level: c.level ?? 0, traits: c.traits, targets: c.target ?? "", distance: DIST(c.distance), frequency: FREQ[c.frequency.toLowerCase()] };
  if (c.vs && c.vs !== "AD") sys.vs = c.vs.toLowerCase();
  if (c.escalation) sys.escalation = c.escalation;
  if (isReaction(c)) { sys.reaction = true; sys.reactionKind = reactionKind(c); sys.trigger = c.interrupt ?? c.trigger; }
  if (c.requirements) sys.requirements = c.requirements;
  sys.versions = versions;
  if (c.flavor) sys.flavor = c.flavor;
  if (c.foundry?.automation) { sys.automation = c.foundry.automation; if (c.foundry.automationNote) sys.automationNote = c.foundry.automationNote; }   // the rank chip (Gold / Silver / Bronze): Foundry-only
  return sys;
}
/** What Foundry has today: the compendium doc (content.mjs) or the Basic Action (basic.mjs, the shape basic.mjs keeps). */
function foundryToday(c) {
  if (c.foundry?.basic) { const d = basic.basicItemData(c.foundry.basic); return { category: "(basic)", level: 0, traits: d.system.traits, targets: d.system.targets, distance: d.system.distance, frequency: d.system.frequency, versions: d.system.versions, flavor: d.system.flavor }; }
  const d = content.docs.find(x => x.type === "action" && x.name === c.name);
  return d?.system ?? null;
}

/* ------------------------------------------------------------------ 3. the ruler's action lines */
const RFREQ = { "at-will": "at-will", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const RVS = s => { if (!s) return ""; const t = s.trim(); if (/^AD$/i.test(t)) return "vs ad"; if (/^WD$/i.test(t)) return "vs wd"; const m = t.match(/^(\w+) Save$/); return m ? `vs save ${m[1].toLowerCase()}` : ""; };
function rulerLines(c) {
  return c.versions.map(v => {
    const f = [`action ${c.name}${multi(c) ? " " + v.ap : ""}`, `ap ${v.ap}`, RFREQ[c.frequency.toLowerCase()]];
    if (c.traits.length) f.push(`traits ${c.traits.join(" ")}`);
    if (isReaction(c)) f.push("reaction");
    if (c.escalation) f.push(`escalation ${c.escalation}`);
    const vs = RVS(c.vs); if (vs) f.push(vs);
    if (v.tiers) f.push(`tiers ${v.tiers.map(t => splitTier(t)[0]).join(" / ")}`);
    if (v.ruler) f.push(v.ruler);
    return f.join(" | ");
  });
}
/** The lines of the class files that name this card (the P1 Paladin and the A1 Archer builds; the catalogue's old cards are not the book's). */
function rulerToday(c) {
  const out = [];
  for (const f of ["classes/paladin-smite-1.txt", "classes/archer-double-1.txt"]) {
    for (const line of fs.readFileSync(path.join(ROOT, "book/ruler", f), "utf8").split("\n")) {
      const t = line.replace(/#.*$/, "").trim();
      if (new RegExp(`^action ${c.name.replace(/[&]/g, "\\$&")}( \\d)? \\|`).test(t) && !out.some(o => o.line === t)) out.push({ file: f, line: t });
    }
  }
  return out;
}
/** The ruler's view of a line: parseSpec reads it as a one-action file; the damage parts are what the numbers come from. */
function parsedRuler(line) {
  const b = ruler.parseSpec(`class X\n${line}\n`, "proof");
  const a = Object.values(b.actions)[0];
  return { name: a.name, ap: a.ap, freq: a.freq, traits: a.traits, vs: a.vs, tiers: a.tiers, escalation: a.escalation, effects: a.effects, reaction: !!a.reaction };
}

/* ------------------------------------------------------------------ the diffs */
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function lineDiff(label, a, b) {
  const A = a.split("\n"), B = b.split("\n");
  if (a === b) { console.log(`  ${label}: IDENTICAL (${A.length} lines)`); return true; }
  console.log(`  ${label}: DIFFERENT`);
  for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) { console.log(`    - ${A[i] ?? "(none)"}`); console.log(`    + ${B[i] ?? "(none)"}`); }
  return false;
}
function keyDiff(label, today, mine) {
  const keys = [...new Set([...Object.keys(today), ...Object.keys(mine)])].filter(k => k !== "category" || today.category !== "(basic)");
  const bad = keys.filter(k => !same(today[k], mine[k]));
  if (!bad.length) { console.log(`  ${label}: IDENTICAL (${keys.length} fields: ${keys.join(", ")})`); return true; }
  console.log(`  ${label}: DIFFERENT in ${bad.join(", ")}`);
  for (const k of bad) { console.log(`    today ${k}: ${JSON.stringify(today[k])}`); console.log(`    mine  ${k}: ${JSON.stringify(mine[k])}`); }
  return false;
}

let ok = true;
for (const c of src) {
  console.log(`\n=== ${c.name}`);
  // 1. the book
  const today = rulesSrcBlock(c.name);
  ok = lineDiff(`book block (rules-src/${today?.file})`, today?.block ?? "(not found)", bookBlock(c)) && ok;
  // 2. Foundry
  const fToday = foundryToday(c), mine = foundryItem(c);
  if (fToday.category === "(basic)") mine.category = "(basic)";
  ok = keyDiff(`Foundry item (${c.foundry?.basic ? "module/basic.mjs" : "tools/content.mjs"})`, fToday, mine) && ok;
  // 3. the ruler
  const lines = rulerLines(c), have = rulerToday(c);
  for (const [i, line] of lines.entries()) {
    const t = have.find(h => h.line.startsWith(`action ${c.name}${multi(c) ? " " + c.versions[i].ap : ""} |`));
    if (!t) { console.log(`  ruler line ${i + 1}: today's files have no line for this Version`); continue; }
    const textSame = lineDiff(`ruler line (${t.file})`, t.line, line);
    const p1 = parsedRuler(t.line), p2 = parsedRuler(line);
    const parsedSame = same(p1, p2);
    console.log(`    parsed by spec.mjs (what the numbers use): ${parsedSame ? "IDENTICAL" : "DIFFERENT"}${!textSame && parsedSame ? " (the text differs only in spacing or in the pool / type tags the ruler ignores)" : ""}`);
    if (!parsedSame) { console.log(`    today: ${JSON.stringify(p1)}`); console.log(`    mine:  ${JSON.stringify(p2)}`); ok = false; }
  }
}
console.log(`\n${ok ? "ALL MATCH" : "SOMETHING DIFFERS"}: the book blocks, the Foundry items and the ruler's numbers${ok ? " are the same as today's" : ""}.`);
process.exit(ok ? 0 : 1);
