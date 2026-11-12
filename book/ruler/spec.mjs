// The spec-driven ruler (2026-10-29; adventuring days added the same day): describe a class build in a plain file and the fights in book/ruler/fights.txt;
// this script writes book/ruler/report.md: each turn's damage against Defense 12 to 14, the build's numbers, duels against each NPC role
// (rounds to kill it, rounds to go Down), a Monte Carlo fight of the party against each encounter (rounds, Health lost, who goes Down), what the
// Reactions do, and adventuring days. It uses the system's own rules, one copy of each (foundry/twod12/module: calc.mjs the dice, config.mjs the
// Bestiary and the AP, data.mjs the NPC Modifier ratings, guard.mjs the unused AP's Guard). Random numbers are seeded: the same files give the same report.
// Since the catch-up (2026-11-12) the default is the book's rules today (pack R: RULES below) and the classes of today (book/ruler/rework/*.txt).
//   node book/ruler/spec.mjs            writes report.md and prints it
//   node book/ruler/spec.mjs --quiet    writes report.md only
//   node book/ruler/spec.mjs --check    checks the simulation against the exact dice math (calc.mjs) and the map's rules; prints only "ok"
//   node book/ruler/spec.mjs --pre-r    the classes before pack R (classes/*.txt, fights-pre-r.txt) under RULES_PRE_R; writes report-pre-r.md
// The file format is described in book/ruler/README.md ("The spec files").
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const HERE = fileURLToPath(new URL(".", import.meta.url));
// SIM-1 (2026-11-12): the engine lives in sim/ (core.mjs: rules, dice, damage, NPCs; turn.mjs: one PC turn; engine.mjs: the fight and the day;
// policy.mjs: the decisions). This file reads the class and fight files, writes the reports, and exports the engine again for the other scripts.
export * from "./sim/core.mjs"; export * from "./sim/turn.mjs"; export * from "./sim/engine.mjs"; export * from "./sim/policy.mjs";
import { RULES, RULES_R, RULES_PRE_R, C, CF, TW, MP, rng, rollDice, mapChecks, parseDamage, weaponTier, npcOf } from "./sim/core.mjs";
import { runTurn, turnDamage, turnFor, stepOf, group } from "./sim/turn.mjs";
import { fight, day, roleCv, npcStrike, npcSeq, npcTurn } from "./sim/engine.mjs";

/* ------------------------------------------------------------------ the cards (book/cards/*.json; pack CS, 2026-11-03) */
// Every build starts with one action line per Version of every card that has tiers or a ruler modeling string (and a passive line per
// Passive with one): the same line a class file would write, generated from the card. A class file's own line for the same name overrides it
// (experiments, options; catalogue/paladin.txt keeps the old cards). `[PMod]` in a card's ruler string is the build's power-mod.
const CARDS = await import(new URL("../cards/load.mjs", import.meta.url).href);
const RFREQ = { "at-will": "at-will", turn: "turn", round: "round", encounter: "encounter", daily: "daily" };
const rulerVs = vs => { const t = String(vs ?? "").trim(); if (/^AD$/i.test(t)) return "vs ad"; if (/^WD$/i.test(t)) return "vs wd"; const m = t.match(/^(\w+) Save$/); return m ? `vs save ${m[1].toLowerCase()}` : ""; };
/** A card's Area line as a ruler field: "shape emanation 2 dist 10 who all" (kind: emanation, burst, aura; dist: squares, "weapon" (its normal range), "max", or "self"; who: enemies, allies, all). "2 / 3 Burst": one value a Version. */
function shapeOf(c, vi) {
  const m = String(c.area ?? "").match(/(Emanation|Burst|Aura)/i); if (!m) return "";
  const ns = String(c.area).match(/\d+/g) ?? [], n = Number(ns[Math.min(vi, ns.length - 1)] ?? 1), d = String(c.distance ?? ""), sq = d.match(/(\d+)\s*sq/);
  const dist = /aura/i.test(m[1]) ? "self" : sq ? sq[1] : /maximum/i.test(d) ? "max" : /weapon|range/i.test(d) ? "weapon" : "self", t = String(c.target ?? "");
  return `shape ${m[1].toLowerCase()} ${n} dist ${dist} who ${/enem/i.test(t) ? "enemies" : /all(y|ies)/i.test(t) && !/creatures/i.test(t) ? "allies" : "all"}`;
}
export function cardLines(cards = CARDS.loadCards()) {
  const out = [];
  for (const c of cards) {
    if (c.ruler === false || c.ruler?.skip) continue;
    const multi = (c.versions ?? []).length > 1;
    for (const v of c.versions ?? []) {
      const tiers = v.tiers ? v.tiers.map(t => CARDS.splitTier(t)[0]) : null;
      const damage = tiers && tiers.some(CARDS.isDamage);
      if (!damage && !v.ruler) continue;   // nothing the ruler models (Advance, Interact...)
      const f = [`action ${c.name}${multi ? " " + v.ap : ""}`, `ap ${v.ap}`, RFREQ[String(c.frequency).toLowerCase()] ?? "none"];
      if (c.traits?.length) f.push(`traits ${c.traits.join(" ")}`);
      if (CARDS.isReaction(c)) f.push("reaction");
      if (c.escalation) f.push(`escalation ${c.escalation}`);
      const vs = rulerVs(c.vs); if (vs) f.push(vs);
      if (damage) f.push(`tiers ${tiers.map(t => (CARDS.isDamage(t) ? t : "0")).join(" / ")}`);
      const sh = shapeOf(c, c.versions.indexOf(v)); if (sh) f.push(sh);   // SIM-2 (areas): the card's Area and Distance, for the grid
      if (v.ruler) f.push(v.ruler);
      out.push(f.join(" | "));
    }
    if (c.ruler?.passive) out.push(`passive ${c.name}: ${c.ruler.passive}`);
  }
  return out;
}
let CARD_LINES = null;
const cardLinesFor = () => (CARD_LINES ??= cardLines().filter(l => l.startsWith("action ")));   // every build has every card's Actions (its turns name the ones it uses)
let CARD_PASSIVES = null;   // a Passive is a build's choice: a class file names it ("passive Hallowed Stance") and the card's ruler string fills the line
const cardPassive = name => { CARD_PASSIVES ??= Object.fromEntries(cardLines().filter(l => l.startsWith("passive ")).map(l => { const m = l.match(/^passive (.+?):\s*(.+)$/); return [m[1].toLowerCase(), m[2]]; })); return CARD_PASSIVES[name.toLowerCase()]; };

/* ------------------------------------------------------------------ the spec files */
const clean = l => l.replace(/#.*$/, "").trim();
const words = s => String(s ?? "").toLowerCase().split(/[\s,+]+/).filter(Boolean);
const FREQ = new Set(["at-will", "turn", "round", "encounter", "daily", "none"]);

/** A damage expression written without pool markers: all Mind when the effect says "mind" (pack R prep: Radiant Zeal, Divine Surge, Lay On Hands' Holy rider). */
const poolOf = (dmg, rest) => (/\bmind\b/.test(rest) ? { ...dmg, mind: { w: dmg.w, mod: dmg.mod, dice: [...dmg.dice], flat: dmg.flat } } : dmg);
/** One effect: "boon 1 next shot strike", "empowered 1 turn", "extra 1d8 next @Smite", "heal 1 rally", "defense 1 ally", "taunt 1", "vulnerable 2", "area 2", "reload", "favored next ...". */
function parseEffect(text) {
  const t = text.trim(), w = t.split(/\s+/), what = w[0].toLowerCase(), n = Number(w[1]);
  const rest = w.slice(2).join(" ");
  const filter = s => { const at = s.match(/@([^,;]+)/), ws = words(s.replace(/@[^,;]+/, "")); return { name: at ? at[1].trim().toLowerCase() : "", quarry: ws.includes("quarry"), traits: ws.filter(x => !["next", "turn", "first", "first-hit", "each", "bloodied", "strained", "quarry", "on"].includes(x)) }; };   // first: the first matching Action each round; first-hit: the first that deals damage (Radiant Zeal)
  if (what === "boon" || what === "bane" || what === "empowered") return { kind: what, n, scope: /\bturn\b/.test(rest) ? "turn" : /\bencounter\b/.test(rest) ? "encounter" : "next", ...filter(rest.replace(/\bencounter\b/, "")) };   // encounter: until the fight ends (Hunter's Focus)
  if (what === "favored") return { kind: "favored", scope: "next", ...filter(w.slice(1).join(" ")) };
  if (what === "extra") return { kind: "extra", dmg: poolOf(parseDamage(w[1]), rest), scope: /\bfirst-hit\b/.test(rest) ? "first-hit" : /\bfirst\b/.test(rest) ? "first" : /\beach\b/.test(rest) ? "each" : "next", anyTier: /\bany-tier\b/.test(rest), bloodied: /\bbloodied\b/.test(rest), strained: /\bstrained\b/.test(rest), ...filter(rest.replace(/\bany-tier\b/, "").replace(/\bmind\b/, "")) };   // any-tier: a single-value Buff, which applies on Tier 1 too (the book, Buffs); "mind": Mind damage (Holy), else Body
  if (what === "heal") return { kind: "heal", n, who: /\bself\b/.test(rest) ? "self" : "ally" };
  if (what === "debuff") return { kind: "debuff", name: w.slice(1).join(" ") };   // counted for the day's report (Prone, Hindered...); no effect in the fight
  if (what === "defense") return { kind: "defense", n, who: /allies/.test(rest) ? "allies" : /self/.test(rest) ? "self" : "ally" };
  if (what === "taunt") return { kind: "taunt", n };
  if (what === "vulnerable") return { kind: "vulnerable", n, keep: /\bround\b/.test(rest) };   // round (pack R-classes): until the giver's next turn, not EoT (Open Season)
  if (what === "area") return { kind: "area", n };
  if (what === "reload") return { kind: "reload" };
  if (what === "reduce") return { kind: "reduce", n, adjacent: Number(rest.match(/adjacent\s+(\d+)/)?.[1] ?? 0), always: /\balways\b/.test(rest) };   // always (pack R-classes): no "haven't left your square" clause   // a passive: Body damage you (and N adjacent allies) take is reduced by n (each NPC Strike)
  if (what === "mend") return { kind: "mend", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // new Health (not a Rally Point): ally = the most hurt ally, any = you or an ally
  if (what === "guard") return { kind: "guard", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // Guard (proposed): a buffer that takes damage first and ends with the encounter; the highest one counts
  if (what === "surge") return { kind: "surge", dmg: poolOf(parseDamage(w[1]), rest) };   // the next ally (not you) who deals damage to the target before your next turn deals this extra ("mind": Mind damage)
  if (what === "bonus") return { kind: "bonus", n, ...filter(rest) };       // a passive: +n damage on matching Actions that deal damage
  if (what === "rally-bonus") return { kind: "rallybonus", n };
  if (what === "floor") return { kind: "floor", dmg: parseDamage(w[1]), ...filter(rest) };   // a passive (pack A1): matching Actions deal this on a Tier 1 (Marked Quarry: [Mod])
  if (what === "elusive") return { kind: "elusive", n };                                     // a passive (pack A1): the first NPC Strike against you each round takes N Banes              // a passive: you and your allies heal n more for each Rally Point used
  if (what === "block") return { kind: "block", dmg: parseDamage(w[1]) };    // price list: a Reaction that reduces one hit on an ally by this
  // Effects the price list (econ.mjs) reads; the fight ignores them.
  if (what === "banes") return { kind: "banes", n, others: /\bothers\b/.test(rest), text: rest };   // the target's (or the area's) Strikes take N Banes
  if (what === "heal-dice") return { kind: "healdice", dmg: parseDamage(w[1]) };                     // each ally in it heals that at the start of its turns
  if (what === "reduce-from") return { kind: "reducefrom", n };                                        // damage you take from the target's Actions is reduced by N
  if (["revive", "prevent-down", "evade", "push", "pull", "slide", "cover", "remove-effect", "save-boon", "range", "note", "steady-nerves", "long-draw", "clear-shot"].includes(what)) return { kind: what, n: Number.isFinite(n) ? n : 0, text: w.slice(1).join(" ") };
  throw new Error(`unknown effect "${t}"`);
}
/** "on 2+: boon 1 next divine; on 3: vulnerable 2" -> [{ min, max, effect }]. "always:" is every tier (and actions with no roll). */
function parseEffects(text) {
  const out = [];
  for (const part of String(text ?? "").split(";").map(s => s.trim()).filter(Boolean)) {
    const m = part.match(/^(on\s+(\d)(\+)?|always)\s*:\s*(.*)$/i);
    if (!m) { out.push({ min: 1, max: 3, effect: parseEffect(part) }); continue; }
    const min = m[2] ? Number(m[2]) : 1, max = m[2] ? (m[3] ? 3 : Number(m[2])) : 3;
    out.push({ min, max, effect: parseEffect(m[4]) });
  }
  return out;
}

/** A class build file -> the build. Errors say the line. */
export function parseSpec(text, file = "spec") {
  const b = { file, name: "", role: "", level: 1, attributes: {}, weaponMod: 2, powerMod: 2, health: null, armor: 0, wdBonus: 0, rally: 0, targeted: 1,
    weapon: null, actions: {}, passives: [], turns: {}, plan: [], when: [], speed: 5, reactions: [], dmgScale: 1, keepBest: null, overcastFloor: 0, healthFactor: null };
  const pmod = (text.match(/^power-mod\s+(\d+)/m) ?? [])[1] ?? "2";
  const pm = l => l.replace(/\[PMod(?:x(\d+))?([+-]\d+)?\]/g, (m, k, n) => String(Number(pmod) * Number(k ?? 1) + Number(n ?? 0)));   // [PMod+2], [PModx2], [PModx2+1]: the build's power-mod   // [PMod], [PMod+2]: the build's power-mod (card lines, and a file's own lines since pack R-classes)
  const lines = [...cardLinesFor().map(l => [pm(l), "book/cards"]), ...text.split(/\r?\n/).map(l => [pm(l), file])];
  lines.forEach(([rawLine, where], i) => {
    const line = clean(rawLine);
    if (!line) return;
    const fail = msg => { throw new Error(`${where}, line ${where === file ? i + 1 - cardLinesFor().length : i + 1}: ${msg}\n  ${rawLine.trim()}`); };
    const [head] = line.split(/\s+/), rest = line.slice(head.length).trim(), key = head.toLowerCase();
    try {
      if (key === "class") b.name = rest;
      else if (key === "role") b.role = rest;
      else if (key === "level") b.level = Number(rest);
      else if (key === "attributes") for (const p of rest.split(",")) { const [k, v] = p.trim().split(/\s+/); b.attributes[k.toLowerCase()] = Number(v); }
      else if (key === "weapon-mod") b.weaponMod = Number(rest);
      else if (key === "power-mod") b.powerMod = Number(rest);
      else if (key === "health") {   // health body x4 +3, mind x3 +4  (the book: (Attribute + 2) x multiplier + species, x (level / 10 + 1), rounded up)
        b.health = {};
        for (const p of rest.split(",")) { const m = p.trim().match(/^(body|mind)\s+x([\d.]+)\s*([+-]\s*\d+)?$/i); if (!m) fail("write health like: body x4 +3, mind x3 +4"); b.health[m[1].toLowerCase()] = { mult: Number(m[2]), sp: Number((m[3] ?? "0").replace(/\s/g, "")) }; }
      } else if (key === "armor") b.armor = Number(rest);
      else if (key === "ward") b.wdBonus = Number(rest);
      else if (key === "rally") b.rally = Number(rest);
      else if (key === "targeted") b.targeted = Number(rest);
      else if (key === "weapon") {   // weapon Crossbow (ranged, reload): 0 / 1d4+2 / 1d10+2
        const m = rest.match(/^(.+?)(?:\s*\(([^)]*)\))?:\s*(.+)$/); if (!m) fail("write weapon like: Greatsword (melee): 0 / 1d8 / 2d6");
        b.weapon = { name: m[1].trim(), traits: words((m[2] ?? "melee").replace(/range\s+[\d/]+/i, "")), tiers: m[3].split("/").map(s => s.trim()) };
        const rg = (m[2] ?? "").match(/range\s+([\d/]+)/i);   // its Range: normal / far / maximum (the map model); melee 1, ranged 10 / 20 / 40 by default
        b.weapon.range = rg ? rg[1].split("/").map(Number) : b.weapon.traits.includes("ranged") ? [10, 20, 40] : [1];
      }
      else if (key === "speed") b.speed = Number(rest);
      // The catch-up (pack R's sheet): `vigor 23` / `resolve 12` are the Health thresholds as the sheet shows them (Chapter 4: the class's Stage line + the species);
      // with them Rally Points = the Rally value + the Stage. `hook ally` / `hook quarry`: the class's Escalation hook. `no-opportunity`: it never makes an Opportunity Attack.
      else if (key === "vigor") b.vigor = Number(rest);
      else if (key === "resolve") b.resolve = Number(rest);
      else if (key === "hook") b.escHook = rest.toLowerCase();
      else if (key === "no-opportunity") b.noOa = true;
      // Progression models (pack LV, progression.mjs): none of these is a rule of the book yet.
      else if (key === "damage-scale") b.dmgScale = Number(rest);   // every damage it deals x this (the charter's "+10% a level", growth not on any card)
      else if (key === "keep-best") { const m = rest.match(/^(\d+)\s+(.+)$/); if (!m) fail("write keep-best like: keep-best 1 power"); b.keepBest = { n: Number(m[1]), traits: words(m[2]) }; }   // its Actions with these traits roll N extra dice and drop the lowest
      else if (key === "overcast-floor") b.overcastFloor = Number(rest);   // once a fight, an Action that costs up to N Escalation costs N less (the round-1 floor)
      else if (key === "health-factor") b.healthFactor = Number(rest);   // the level factor of Health (the book: (level + 10) / 10)
      else if (key === "reaction") {   // reaction Opportunity Attack: opportunity  ·  reaction Quick Draw: quick-draw  (the map model uses them)
        const m = rest.match(/^(.+?):\s*(opportunity|quick-draw(?:\s+\d+)?|overwatch|callshot|cover|ready|rebuke(?:\s+\d+)?(?:\s+turn)?|block\s+\S+(?:\s+(?:spill|round|ally))*)(?:\s+with\s+(.+))?$/i); if (!m) fail("write reaction like: Opportunity Attack: opportunity (or quick-draw; or block 1d8+[Mod]: a Reaction that takes that much off one NPC hit on you or an ally within 5 squares)");
        const kind = m[2].toLowerCase().split(/\s+/)[0];
        b.reactions.push({ name: m[1].trim(), kind, action: (m[3] ?? "Weapon Attack").trim(), ...(kind === "block" ? { dmg: parseDamage(m[2].split(/\s+/)[1]), spill: /\sspill\b/i.test(m[2]), round: /\sround\b/i.test(m[2]), ally: /\sally\b/i.test(m[2]) } : {}), ...(kind === "rebuke" ? { range: Number(m[2].split(/\s+/)[1] ?? 0), turn: /\bturn\b/i.test(m[2]) } : {}), ...(kind === "quick-draw" ? { range: Number(m[2].split(/\s+/)[1] ?? 5) } : {}) });   // spill: what the hit doesn't use becomes Guard on the target
      }
      else if (key === "action") {
        const f = rest.split("|").map(s => s.trim());
        const a = { name: f[0], ap: 0, freq: "none", traits: [], vs: "none", tiers: null, does: [], then: [], each: [], effects: [], escalation: 0, area: 1 };
        for (const field of f.slice(1)) {
          const fw = field.split(/\s+/), fk = fw[0].toLowerCase(), fv = field.slice(fw[0].length).trim();
          if (fk === "ap") a.ap = Number(fv);
          else if (FREQ.has(fk)) a.freq = fk;
          else if (fk === "traits") a.traits = words(fv);
          else if (fk === "vs") a.vs = fv.toLowerCase();
          else if (fk === "tiers") { const t = fv.split("/").map(s => s.trim()); if (t.length !== 3) fail("tiers needs three values: Tier 1 / Tier 2 / Tier 3"); a.tiers = t.map(parseDamage); a.tierText = t; }
          else if (fk === "does") a.does = fv.split(",").map(s => s.trim()).filter(Boolean).flatMap(s => { const m = s.match(/^(.+?)\s+x(\d+)$/); return m ? Array(Number(m[2])).fill(m[1].trim()) : [s]; });
          else if (fk === "each") a.each = fv.split(",").map(s => parseEffect(s));
          else if (fk === "escalation") a.escalation = Number(fv);
          else if (fk === "shape") { const w = fv.split(/\s+/); a.shape = { kind: w[0], n: Number(w[1]), dist: w[3] ?? "self", who: w[5] ?? "all" }; }   // the card's Area on the grid (SIM-2)
          else if (fk === "different") a.different = true;
          else if (fk === "favored") a.favored = true;      // the Action's own roll is Favored
          else if (fk === "allies") a.allies = Number(fv);   // price list: how many allies a buff or heal reaches (default 1)
          else if (fk === "rounds") a.rounds = Number(fv);   // price list: how many rounds its effects last (default 1)
          else if (fk === "reaction") a.reaction = true;     // price list: a Reaction (its AP come from the AP kept after your turn)
          else if (fk === "then") a.then = fv.split(",").map(s => s.trim()).filter(Boolean);   // Linked Actions made after its own roll (Smite 3's light)   // its Linked Actions each target a different creature
          else if (fk === "gives") a.gives = words(fv.replace(/^traits\s+/i, ""));   // its Linked Actions also count as having these traits (the book: they keep only their own)
          else a.effects.push(...parseEffects(field));
        }
        for (const e of a.effects) if (e.effect.kind === "area") a.area = e.effect.n;
        if (where !== file) a.fromCard = true;   // pack CS: a card's line (dropped below unless the build names it)
        b.actions[a.name.toLowerCase()] = a;
      } else if (key === "passive") {
        let full = rest;
        if (!rest.includes(":")) { const cp = cardPassive(rest.trim()); if (!cp) fail(`"${rest.trim()}" is not a card with a ruler passive (book/cards); write the passive in full`); full = `${rest.trim()}: ${pm(cp)}`; }   // pack CS: the card's line
        const m = full.match(/^(.+?):\s*(?:escalation\s+(\d)\s*:\s*)?(.+)$/i); if (!m) fail("write passive like: Marked Quarry: boon 1 shot strike");
        b.passives = b.passives.filter(x => x.name.toLowerCase() !== m[1].trim().toLowerCase());   // a file's passive line replaces the card's (pack CS)
        b.passives.push({ name: m[1].trim(), escalation: Number(m[2] ?? 0), effect: parseEffect(m[3]) });
      } else if (key === "turn") {
        const m = rest.match(/^(.+?):\s*(.+)$/); if (!m) fail("write turn like: Main: Smite 2, Weapon Attack, move 1");
        b.turns[m[1].trim().toLowerCase()] = { name: m[1].trim(), steps: m[2].split(",").map(s => s.trim()).filter(Boolean) };
      } else if (key === "plan") b.plan = rest.replace(/^:\s*/, "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);   // "A | B": A while its Encounter and Daily Actions are unused, else B
      else if (key === "when") {
        const m = rest.match(/^ally below (\d+)%\s*:\s*(.+)$/i), u = rest.match(/^unloaded\s*:\s*(.+)$/i), me = rest.match(/^self below (\d+)%\s*:\s*(.+)$/i), en = rest.match(/^engaged\s*:\s*(.+)$/i), es = rest.match(/^escalation (\d)\s*:\s*(.+)$/i), rd = rest.match(/^ready\s*:\s*(.+)$/i);
        if (m) b.when.push({ below: Number(m[1]) / 100, turn: m[2].trim().toLowerCase() });
        else if (es) b.whenEsc = { esc: Number(es[1]), turn: es[2].trim().toLowerCase() };
        else if (rd) b.whenReady = rd[1].trim().toLowerCase();   // pack R-classes: the turn it takes with the AP its "ready" Reaction gave it (Ready Shot: a 5 AP turn)   // pack R-classes: the turn it takes at that Escalation or more (the Apex turn), while its Encounter Actions are unused
        else if (me) b.whenSelf = { below: Number(me[1]) / 100, turn: me[2].trim().toLowerCase() };
        else if (u) b.unloadedTurn = u[1].trim().toLowerCase();
        else if (en) b.whenEngaged = en[1].trim().toLowerCase();   // the map model: the turn it takes when it starts its turn Engaged
        else fail("write when like: when ally below 50%: Heal, when self below 30%: Steel, when escalation 3: Apex, or when unloaded: Reload turn");
      }
      else fail(`unknown line "${head}"`);
    } catch (e) { if (/line \d+:/.test(e.message)) throw e; fail(e.message); }
  });
  // The derived numbers (the book's formulas).
  const lvf = b.healthFactor ?? (b.level + 10) / 10, at = k => Number(b.attributes[k] ?? 0);
  const thr = (k, h) => Math.max(0, Math.ceil(((at(k) + 2) * h.mult + h.sp) * lvf));
  b.bodyHealth = b.health ? thr("body", b.health.body) : 0; b.mindHealth = b.health ? thr("mind", b.health.mind) : 0;
  b.pool = b.bodyHealth + b.mindHealth;
  b.ad = 11 + b.armor; b.wd = 11 + b.powerMod + b.wdBonus;
  b.rallyPoints = b.rally + Math.ceil((at("body") + at("mind") + b.level) / 2);
  if (b.vigor != null || b.resolve != null) { b.bodyHealth = b.vigor ?? b.bodyHealth; b.mindHealth = b.resolve ?? b.mindHealth; b.pool = b.bodyHealth + b.mindHealth; b.rallyPoints = b.rally + CF.stageOf(b.level); }
  b.rallyHeal = Math.ceil(b.pool / 4);
  // The catch-up: every creature has the Opportunity Attack Reaction (Chapter 2, Reactions; the Basic Action's card): a build gets it without a line
  // (`basic`: used only while RULES.oaAll; a file's own `reaction ...: opportunity` line is the pre-R Talent and always counts).
  if (!b.noOa && !b.reactions.some(r => r.kind === "opportunity") && b.weapon) b.reactions.push({ name: "Opportunity Attack", kind: "opportunity", action: "Weapon Attack", basic: true });
  // Pack CS: a build keeps the card Actions its turns, reactions and Linked Actions name (with their other Versions, for the lower-Version fallback) and drops the rest,
  // so a build has only its own cards (the day model and the fallbacks look at a build's whole action list).
  const named = new Set();
  for (const t of Object.values(b.turns)) for (const s of t.steps) { const st = stepOf(s); if (st.kind === "action") { named.add(st.name); if (st.alt) named.add(st.alt); } }
  for (const r of b.reactions) { named.add(r.name.toLowerCase()); named.add(stepOf(r.action).name); }   // "with Quick Shot (+1 boon)": the Action the Reaction makes
  const grp = n => n.replace(/ \d$/, "");
  for (let more = true; more;) { more = false; for (const a of Object.values(b.actions)) if (!a.fromCard || named.has(a.name.toLowerCase()) || [...named].some(n => grp(n) === grp(a.name.toLowerCase()))) for (const d of [...a.does, ...a.then]) if (!named.has(d.toLowerCase())) { named.add(d.toLowerCase()); more = true; } }
  const groups = new Set([...named].map(grp));
  for (const [k, a] of Object.entries(b.actions)) if (a.fromCard && !named.has(k) && !groups.has(grp(k))) delete b.actions[k];
  // Every turn and plan entry must name things that exist.
  for (const t of Object.values(b.turns)) for (const s of t.steps) { const st = stepOf(s); if (st.kind === "action" && (!b.actions[st.name] || (st.alt && !b.actions[st.alt]))) throw new Error(`${file}: turn "${t.name}" uses "${s}", which is not an action of the file`); }
  for (const p of [...b.plan.flatMap(x => x.split("|").map(y => y.trim())), ...b.when.map(w => w.turn), ...(b.unloadedTurn ? [b.unloadedTurn] : []), ...(b.whenSelf ? [b.whenSelf.turn] : []), ...(b.whenEsc ? [b.whenEsc.turn] : []), ...(b.whenReady ? [b.whenReady] : []), ...(b.whenEngaged ? [b.whenEngaged] : [])]) if (!b.turns[p]) throw new Error(`${file}: the plan names "${p}", which is not a turn of the file`);
  for (const a of Object.values(b.actions)) for (const d of [...a.does, ...a.then]) if (!b.actions[d.toLowerCase()]) throw new Error(`${file}: "${a.name}" does "${d}", which is not an action of the file`);
  return b;
}
/** The encounters file: "party Paladin, Paladin, Archer, Archer", "encounter 4 Standards: 4 standard", "runs 2000", "level 1". */
export function parseFights(text) {
  const f = { party: [], encounters: [], days: [], dayParties: [], dayRuns: 1000, runs: 2000, level: 1, defenses: [12, 13, 14] };
  const RATINGS = ["terrible", "low", "medium", "high", "extreme"];
  const npcOne = s => { const mm = s.trim().match(/^(\d+)\s+(\w+)((?:\s+[\w-]+)*)$/); if (!mm) throw new Error(`fights.txt: can't read "${s.trim()}" (write: 2 standard, 1 elite high, 2 standard ranged)`);
    const tags = mm[3].trim().toLowerCase().split(/\s+/).filter(Boolean), sp = tags.find(t => /^speed-\d+$/.test(t));
    const md = k => { const t = tags.find(x => x.startsWith(k + "-") && RATINGS.includes(x.slice(k.length + 1))); return t ? { [k]: t.slice(k.length + 1) } : {}; };   // wmod-high, pmod-low: a Modifier's rating
    return Array(Number(mm[1])).fill({ role: mm[2].toLowerCase().replace(/s$/, ""), rating: tags.find(t => RATINGS.includes(t)) ?? "medium", ranged: tags.includes("ranged"), power: tags.includes("power"), ...md("wmod"), ...md("pmod"), ...(sp ? { speed: Number(sp.slice(6)) } : {}) }); };
  const npcList = txt => txt.split(",").flatMap(npcOne);
  for (const raw of text.split(/\r?\n/)) {
    const line = clean(raw); if (!line) continue;
    const [head] = line.split(/\s+/), rest = line.slice(head.length).trim();
    if (head === "party") f.party = rest.split(",").map(s => s.trim()).filter(Boolean);
    else if (head === "runs") f.runs = Number(rest);
    else if (head === "day-runs") f.dayRuns = Number(rest);
    else if (head === "day") { const m = rest.match(/^(.+?):\s*(.+)$/); f.days.push({ name: m[1].trim(), fights: m[2].split("|").map(x => npcList(x)), text: m[2].split("|").map(x => x.trim()) }); }
    else if (head === "day-party") { const m = rest.match(/^(.+?):\s*(.+)$/); f.dayParties.push({ name: m[1].trim(), files: m[2].split(",").map(x => x.trim()) }); }
    else if (head === "level") f.level = Number(rest);
    else if (head === "defenses") f.defenses = rest.split(/[\s,]+/).map(Number);
    else if (head === "encounter") {
      const m = rest.match(/^(.+?):\s*(.+)$/);
      f.encounters.push({ name: m[1].trim(), npcs: npcList(m[2]) });
    } else if (head === "map") {   // the map model's settings (map.mjs MAP): map on | off · map start 8 · map back 3 · map cover 10% 2, 20% 1 · map npc-reactions elite, standard
      const [k, ...v] = rest.split(/\s+/), val = v.join(" ");
      if (k === "on" || k === "off") MP.MAP.on = k === "on";
      else if (k === "start" || k === "back" || k === "spacing") MP.MAP[k] = Number(val);
      else if (k === "cover") MP.MAP.cover = val.split(",").map(x => x.trim()).filter(Boolean).map(x => { const mm = x.match(/^(\d+)%\s+(\d)$/); if (!mm) throw new Error(`fights.txt: write map cover like: 10% 2, 20% 1`); return { p: Number(mm[1]) / 100, n: Number(mm[2]) }; }).sort((x, y) => y.n - x.n);
      else if (k === "npc-reactions") MP.MAP.npcReactions = val.split(/[\s,]+/).filter(Boolean).map(x => x.toLowerCase().replace(/s$/, "")).filter(x => x !== "none");
      else throw new Error(`fights.txt: unknown map setting "${k}"`);
      f.map = { ...MP.MAP };
    } else throw new Error(`fights.txt: unknown line "${line}"`);
  }
  return f;
}

/* ------------------------------------------------------------------ the tables */
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : "-");
const pct = x => `${Math.round(x * 100)}%`;
const median = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/* ------------------------------------------------------------------ the Reactions in the 4 + 1 AP economy (the catch-up, 2026-11-12) */
/**
 * What each Reaction and the unused AP's Guard do in the party fights: the first encounter of fights.txt (the normal fight) and its hardest one, each
 * variant with the same seed and each creature rolling its own dice (streams), so a change to one piece leaves the other rolls alone.
 */
function reactionsSection(party, fights, lv) {
  const L = [], keep = { ...RULES }, n = fights.runs;
  const cvOf = e => e.npcs.reduce((s2, x) => s2 + roleCv(x.role), 0), hardest = [...fights.encounters].sort((x, y) => cvOf(y) - cvOf(x))[0];
  const encs = [...new Set([fights.encounters[0], hardest])];
  const noBasic = b => ({ ...b, reactions: b.reactions.filter(r => !r.basic) }), onlyBasic = b => ({ ...b, reactions: b.reactions.filter(r => r.basic) }), none = b => ({ ...b, reactions: [] });
  const VARIANTS = [
    ["The rules as they are", {}, x => x],
    ["The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP)", { oaPolicy: "first" }, x => x],
    ["No Opportunity Attack for the PCs", {}, noBasic],
    ["No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1)", { npcOa: false }, x => x],
    ["No class Reaction (the PCs keep the Opportunity Attack)", {}, onlyBasic],
    ["No Reactions for the PCs", {}, none],
    ["No Reaction AP for the PCs (a Reaction needs an AP kept from the turn)", { reactionAp: 0 }, x => x],
    ["A Reaction AP from the first moment of the encounter (before the first turn too)", { reactFromStart: true }, x => x],
    ["No Guard from unused AP", { apGuard: 0 }, x => x],
  ];
  L.push("## Reactions in the 4 + 1 AP economy", "",
    `Each row is the same ${n} fights (the same seed, every creature rolling its own dice) with one piece changed or taken away. "The rules as they are" keeps a PC's Reaction AP for its class Reaction (an Opportunity Attack only with an AP to spare). **Per PC, a fight:** the Reactions it used, the Opportunity Attacks among them and their damage, the Opportunity Attacks it took and their damage, the turn AP it left unspent and the Guard they gave / the Guard that stopped damage. The class Reactions: ${[...new Set(party.flatMap(b => b.reactions.filter(r => !r.basic).map(r => `${r.name} (${b.name})`)))].join(", ") || "none"}.`, "");
  for (const e of encs) {
    const npcsOf = () => e.npcs.map(x => npcOf(x.role, x.rating, lv, x));
    L.push(`**${e.name}** (CV ${cvOf(e)})`, "", "| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
    for (const [name, rules, edit] of VARIANTS) {
      Object.assign(RULES, keep, rules);
      const R = rng(53), res = [], pcsB = party.map(edit), npcs = npcsOf();
      for (let k = 0; k < n; k++) res.push(fight(pcsB, npcs, R, { streams: true }));
      const per = key => mean(res.map(r => mean(r.pcs.map(p => p.st[key] ?? 0))));
      L.push(`| ${name} | ${fmt(mean(res.map(r => r.rounds)))} | ${pct(mean(res.map(r => (r.won ? 1 : 0))))} | ${pct(mean(res.map(r => r.lost)))} | ${pct(mean(res.map(r => (r.downs ? 1 : 0))))} | ${fmt(mean(res.map(r => r.pcs.reduce((s2, p) => s2 + p.st.taken, 0))))} | ${fmt(per("reactions"), 2)} | ${fmt(per("oaReal"), 2)} · ${fmt(per("oaDealt"))} | ${fmt(per("oaTaken"), 2)} · ${fmt(per("oaTakenDmg"))} | ${fmt(per("apLeft"), 2)} · ${fmt(per("apGuardGiven"))} · ${fmt(per("apGuardUsed"))} |`);
    }
    Object.assign(RULES, keep);
    // Per build, the rules as they are.
    const R = rng(53), res = [], npcs = npcsOf(); for (let k = 0; k < n; k++) res.push(fight(party, npcs, R, { streams: true }));
    L.push("", `| Per PC, a fight (the rules as they are) | ${party.map(b => b.name).join(" | ")} |`, `|---|${party.map(() => "---:").join("|")}|`);
    const row = (label, fn, dg = 2) => L.push(`| ${label} | ${party.map((b, i) => fmt(mean(res.map(r => fn(r.pcs[i].st))), dg)).join(" | ")} |`);
    row("Turns", st => st.rounds, 1);
    row("Reactions used", st => st.reactions);
    row("... Opportunity Attacks", st => st.oaReal);
    row("Damage its Reactions dealt", st => st.reactionDealt, 1);
    row("... its Opportunity Attacks", st => st.oaDealt, 1);
    row("Damage its Reactions blocked", st => st.blockCredit, 1);
    row("Opportunity Attacks it took", st => st.oaTaken);
    row("... their damage", st => st.oaTakenDmg, 1);
    row("Turn AP left unspent", st => st.apLeft);
    row("Guard from them: given", st => st.apGuardGiven, 1);
    row("... used", st => st.apGuardUsed, 1);
    row("Its Reactions' damage as a share of its damage (%)", st => (st.dealt ? (100 * st.reactionDealt) / st.dealt : 0), 0);
    L.push("");
  }
  return L;
}

/* ------------------------------------------------------------------ the report */
export function report({ builds, fights }) {
  const L = [];
  const lv = fights.level;
  const LEVEL = RULES.escalation === "level", src = fights.source ?? { dir: "classes", fights: "fights.txt", cmd: "node book/ruler/spec.mjs" };
  L.push(`# The ruler: class builds and fights (level ${lv})`, "", `Written by \`${src.cmd}\` from \`book/ruler/${src.dir}/*.txt\` and \`book/ruler/${src.fights}\`. Don't edit this file: edit those and run the script again.`, "",
    LEVEL ? `**The rules: the book today (pack R; the ruler's default since the catch-up of 2026-11-12).** ${RULES.ap} AP + ${RULES.reactionAp} Reaction AP (NPCs ${RULES.npcAp} + ${RULES.npcReactionAp}, Minions ${RULES.minionAp}); Escalation is a level from ${RULES.startEsc} (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard ${TW.guardPerAp.join(" / ")} (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); every creature has the Opportunity Attack Reaction (an adjacent enemy that leaves a square with a Move Action or stands up); NPCs use their Specials (Round: ${TW.npcSpecial.filter(x => x.key !== "basic").map(x => `${x.label.replace("Special, ", "")} × ${x.x}`).join(", ")} for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs).`
      : `**The rules: the book before pack R** (\`--pre-r\`: ${RULES.ap} AP, no Reaction AP, Escalation spent, the pre-R Bestiary, Opportunity Attack as a Talent), with today's dice and map rules (flat Boons and Banes, the new Favored, the Field limit, Flanking up to 2). The builds are the classes as they were before pack R-classes: this report is kept for the pre-R studies (prices.md, positions.json, bestiary.md, progression.md, rework.md).`, "");
  for (const b of builds) {
    L.push(`## ${b.name} (${b.role || "no role"}), \`${b.file}\``, "");
    L.push(`Health ${b.pool} (Body ${b.bodyHealth} + Mind ${b.mindHealth}) · AD ${b.ad} · WD ${b.wd} · Weapon Modifier +${b.weaponMod} · Power Modifier +${b.powerMod} · Rally Points ${b.rallyPoints} (each heals ${b.rallyHeal}) · targeted ×${b.targeted}`, "");
    L.push(`**Damage a turn** (Monte Carlo, 20,000 turns each; measured ${LEVEL ? `at the Escalation the turn needs ("Esc": ${RULES.startEsc}, or its Action's Escalation; the Passives of that level and below work)` : `with the Escalation the turn spends ("Esc"; its passives see what is left after spending)`}, and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]} among the valid turns):`, "");
    L.push(`| Turn | Esc | ${fights.defenses.map(d => `Def ${d}`).join(" | ")} | Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]}, Esc 3 | AP | Strikes | Steps | Problems |`, `|---|---:|${fights.defenses.map(() => "---:").join("|")}|---:|---:|---:|---|---|`);
    const mid = Math.floor(fights.defenses.length / 2);
    const rows = Object.entries(b.turns).map(([k, t]) => {
      const acts = t.steps.map(stepOf).filter(x => x.kind === "action").map(x => b.actions[x.name].escalation);
      const esc = LEVEL ? Math.max(RULES.startEsc, ...acts) : Math.min(3, acts.reduce((s2, x) => s2 + x, 0));   // the Escalation the turn needs (a level), or spends (before pack R)
      return { k, t, esc, r: fights.defenses.map(d => turnDamage(b, k, d, { escalation: esc })), e3: turnDamage(b, k, fights.defenses[mid], { escalation: 3 }) };
    });
    const ok = rows.filter(x => !x.r[mid].problems.length && !(b.unloadedTurn === x.k));
    const best = ok.reduce((m, x) => (!m || x.r[mid].avg > m.r[mid].avg ? x : m), null);
    for (const { k, t, r } of rows) {
      const tags = [b.plan.includes(k) ? "plan" : "", b.unloadedTurn === k ? "when unloaded" : "", b.when.some(w => w.turn === k) ? "when an ally is hurt" : "", best?.k === k ? "**best**" : ""].filter(Boolean);
      L.push(`| ${t.name}${tags.length ? ` (${tags.join(", ")})` : ""} | ${rows.find(x => x.k === k).esc} | ${r.map(x => fmt(x.avg)).join(" | ")} | ${fmt(rows.find(x => x.k === k).e3.avg)} | ${r[0].ap} | ${r[0].strikes} | ${t.steps.join(", ")} | ${r[0].problems.join("; ") || ""} |`);
    }
    L.push("", `Plan: ${b.plan.map((p, i) => `round ${i + 1}${i === b.plan.length - 1 ? "+" : ""}: ${p.split("|").map(x => b.turns[x.trim()].name).join(" (once used: ")}${p.includes("|") ? ")" : ""}`).join(" · ")}${b.when.map(w => ` · when an ally is below ${pct(w.below)} Health: ${b.turns[w.turn].name}`).join("")}${b.whenSelf ? ` · when itself below ${pct(b.whenSelf.below)} Health: ${b.turns[b.whenSelf.turn].name}` : ""}${b.unloadedTurn ? ` · when unloaded: ${b.turns[b.unloadedTurn].name}` : ""}`, "");
    // Duels: the build alone against one NPC of each role (Medium), and that NPC alone against the build.
    L.push(`**Duels** (one of each, Medium NPCs; rounds counted with this build's plan${RULES.npcSpecials ? "; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard" : ""}):`, "", "| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |", "|---|---:|---:|---:|---:|---:|---:|");
    for (const role of ["minion", "grunt", "standard", "elite"]) {
      const npc = npcOf(role, "medium", lv), R = rng(11), kill = [], down = [];
      for (let k = 0; k < 2000; k++) {
        const f = { ...npc, damage: 0 }, pc = { build: b, quarry: f }; let r = 0;
        pc.esc = RULES.startEsc;
        while (f.damage < f.pool && r < 30) { r++; if (r > 1) pc.esc = Math.min(3, pc.esc + 1); pc.firstThisRound = new Set(); runTurn(pc, b.turns[turnFor(pc, r)], { R, escalation: pc.esc, target: () => f, others: () => [] }); f.vulnerable = 0; }
        kill.push(r);
        const me = { build: b }; let dmg = 0, rr = 0;
        const g = { ...npc, encUsed: false, firstAtk: false };
        while (dmg < b.pool && rr < 60) { rr++; g.roundSpecialN = 0; for (const a of npcSeq(g)) { g.curMult = a.mult; dmg += npcStrike(R, g, me, a.k, Math.min(3, RULES.startEsc + rr - 1), [], a.boons); } }
        down.push(rr);
      }
      const cap = (a, max) => (median(a) >= max ? `${max}+ / -` : `${median(a)} / ${fmt(mean(a))}`);
      L.push(`| ${npc.name} | ${npc.pool} | ${npc.ad} | ${npc.mod} | ${fmt(npcTurn(npc, b))} | ${cap(kill, 30)} | ${cap(down, 60)} |`);
    }
    L.push("");
  }
  // Party fights.
  const fileOf = b => b.file.replace(/^[\w-]+\//, "").replace(/\.txt$/, "");
  const party = fights.party.map(n => builds.find(b => fileOf(b) === n) ?? builds.find(b => b.name.toLowerCase() === n.toLowerCase() && b.level === lv) ?? (() => { throw new Error(`fights.txt: the party names "${n}", and no class file has that name, or that class at level ${lv}`); })());
  L.push(`## Party fights (${party.map(b => b.name).join(", ")}; ${fights.runs} runs each)`, "");
  L.push(LEVEL ? "The Bestiary's target for a normal fight (CV 100 a PC: 4 Standards against 4 PCs): about **3.5 rounds**, about **a fifth of the party's Health** with the Rally Points it spends, a PC Down in about **1 fight of 5** (pack R-bestiary: rbestiary.md)." : "The book's target for a typical fight before pack R (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.", "");
  L.push(`| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | ${party.map(b => `${b.name} Down`).join(" | ")} | no positions: rounds / Health lost |`, `|---|---:|---:|---:|---:|---:|---:|${party.map(() => "---:").join("|")}|---:|`);
  for (const e of fights.encounters) {
    const R = rng(29), npcs = e.npcs.map(n => npcOf(n.role, n.rating, lv, n)), res = [];
    for (let k = 0; k < fights.runs; k++) res.push(fight(party, npcs, R));
    const rounds = res.map(r => r.rounds), sorted = [...rounds].sort((x, y) => x - y), firsts = res.filter(r => r.firstDown).map(r => r.firstDown);
    const cv = e.npcs.reduce((s, n) => s + (roleCv(n.role)), 0);
    const R0 = rng(29), flat = []; for (let k = 0; k < fights.runs; k++) flat.push(fight(party, npcs, R0, { map: { ...MP.MAP, on: false } }));
    L.push(`| ${e.name} | ${cv} | ${median(rounds)} / ${fmt(mean(rounds))} / ${sorted[Math.floor(sorted.length * 0.9)]} | ${pct(mean(res.map(r => (r.won ? 1 : 0))))} | ${pct(mean(res.map(r => r.lost)))} | ${pct(mean(res.map(r => (r.downs ? 1 : 0))))} | ${firsts.length ? median(firsts) : "-"} | ${party.map((b, i) => pct(mean(res.map(r => (r.downBy[i] ? 1 : 0))))).join(" | ")} | ${fmt(mean(flat.map(r => r.rounds)))} / ${pct(mean(flat.map(r => r.lost)))} |`);
  }
  L.push("", `How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its \`when\` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); ${RULES.npcSpecials ? "each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane" : "each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd)"}, choosing a PC at random weighted by \`targeted\` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; \`map on\` in fights.txt):** the melee PCs start on a line, the ranged PCs ${MP.MAP.back} squares behind and to the sides, the NPCs ${MP.MAP.start} squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its \`when engaged\` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving ${RULES.npcSpecials ? "(each Advance is an AP its attacks don't get)" : "(its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike)"}, stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover ${MP.MAP.cover.map(c => `${Math.round(c.p * 100)}% ${c.n === 1 ? "Low" : c.n === 2 ? "Medium" : "High"}`).join(", ")}); Flanking for both sides (Field Boons: the cancels, then 2 at most); ${RULES.oaAll ? `every creature's Opportunity Attack (1R: its Reaction AP, or an AP kept from its turn; ${RULES.oaPolicy === "spare" ? "a PC with a class Reaction keeps its Reaction AP for it and makes an Opportunity Attack only with an AP to spare: the better choice, see the Reactions section" : "a PC reacts to the first trigger"}; a ranged PC's is a shot with Engaged's 2 Banes; ranged NPCs make none)` : `Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: ${MP.MAP.npcReactions.join(", ") || "none"})`}; Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (\`map off\`) every PC reaches every NPC at once and NPCs choose a PC weighted by \`targeted\`. ${LEVEL ? `Escalation is ${RULES.startEsc} in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).` : "Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off)."}`, "");
  if (RULES.oaAll && MP.MAP.on && fights.encounters.length) L.push(...reactionsSection(party, fights, lv));
  // Adventuring days: the fights between two Rests, one after another.
  if (fights.days.length && fights.dayParties.length) {
    const byFile = n => builds.find(b => fileOf(b) === n) ?? (() => { throw new Error(`${src.fights}: day-party names "${n}", which is not a file in ${src.dir}/`); })();
    L.push(`## Adventuring days (${fights.dayRuns} days each)`, "",
      "The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.", "",
      "Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.", "");
    for (const d of fights.days) {
      const cv = d.fights.map(f => f.reduce((s, n) => s + (roleCv(n.role)), 0));
      L.push(`### ${d.name}`, "", d.text.map((t, i) => `Fight ${i + 1}: ${t} (CV ${cv[i]})`).join(" · "), "");
      for (const dp of fights.dayParties) {
        const party = dp.files.map(byFile), R = rng(41), days = [], encs = d.fights.map(f => f.map(n => npcOf(n.role, n.rating, party[0].level, n)));   // the NPCs of the party's level
        for (let k = 0; k < fights.dayRuns; k++) days.push(day(party, encs, R));
        const pool = party.reduce((s, b) => s + b.pool, 0), rp = party.reduce((s, b) => s + b.rallyPoints, 0);
        L.push(`**${dp.name}** (${dp.files.join(", ")}; NPCs of level ${party[0].level}): the day cleared ${pct(mean(days.map(x => (x.cleared ? 1 : 0))))} · a PC Down during the day ${pct(mean(days.map(x => (x.pcs.some(p => p.st.downs) ? 1 : 0))))} · Downs a day ${fmt(mean(days.map(x => x.pcs.reduce((s, p) => s + p.st.downs, 0))), 2)} · Rally Points left at the end ${pct(mean(days.map(x => x.pcs.reduce((s, p) => s + p.rallyLeft, 0) / rp)))} · Health at the end ${pct(mean(days.map(x => 1 - x.pcs.reduce((s, p) => s + Math.min(p.damage, p.build.pool), 0) / pool)))}`, "");
        L.push("| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |", "|---|---:|---:|---:|---:|");
        d.fights.forEach((f, i) => { const r = days.map(x => x.fights[i]).filter(Boolean); L.push(`| ${i + 1}: ${d.text[i]} | ${pct(mean(r.map(x => (x.won ? 1 : 0))))} | ${fmt(mean(r.map(x => x.rounds)))} | ${pct(mean(r.map(x => x.lost)))} | ${pct(mean(r.map(x => (x.firstDown ? 1 : 0))))} |`); });
        L.push("");
        // One row per build (the PCs of the same file averaged), each number for one PC over the whole day.
        const files = [...new Set(dp.files)];
        L.push(`| Per PC, over the day | ${files.map(f => `${byFile(f).name} \`${f}\``).join(" | ")} |`, `|---|${files.map(() => "---:").join("|")}|`);
        const col = (fn, dg = 1) => files.map(f => { const idx = dp.files.map((x, i) => (x === f ? i : -1)).filter(i => i >= 0), v = days.flatMap(x => idx.map(i => fn(x.pcs[i], x)));
          if (typeof v[0] === "string") { const parts = v.map(x => x.split(" / ").map(Number)); return parts[0].map((_, j) => fmt(mean(parts.map(p => p[j])), dg)).join(" / "); }
          return fmt(mean(v), dg); });
        const row = (label, fn, dg) => L.push(`| ${label} | ${col(fn, dg).join(" | ")} |`);
        const partyDealt = x => x.pcs.reduce((s, p) => s + p.st.dealt, 0) || 1;
        row("Damage dealt", p => p.st.dealt);
        row("Damage a turn (its own turns)", p => p.st.dealt / Math.max(1, p.st.rounds));
        row("Damage a turn without its Nova turns (no Encounter or Daily Action)", p => (p.st.dealt - p.st.novaDealt) / Math.max(1, p.st.rounds - p.st.novaTurns));
        row("Damage a Nova turn (with an Encounter or Daily Action)", p => (p.st.novaTurns ? p.st.novaDealt / p.st.novaTurns : NaN));
        row("Share of the party's damage (%)", (p, x) => (100 * p.st.dealt) / partyDealt(x), 0);
        row("Turns taken", p => p.st.rounds);
        row("Health Pool", p => p.build.pool, 0);
        row("Damage aimed at it (before reduction)", p => p.st.incoming);
        row("Reduced (Hallowed Stance, its own or an adjacent ally's)", p => p.st.reduced);
        row("Reduced for adjacent allies (its Hallowed Stance)", p => p.st.reducedGiven);
        row("Damage taken", p => p.st.taken);
        row("Damage taken a round of combat", (p, x) => p.st.taken / Math.max(1, x.fights.reduce((s, f) => s + f.rounds, 0)));
        row("Times Down", p => p.st.downs, 2);
        row(`Rally Points (of ${files.map(f => byFile(f).rallyPoints).join(" / ")}): used in combat (Steel Yourself)`, p => p.st.rpSelf, 2);
        row("Rally Points used through an ally's Lay On Hands", p => p.st.rpByAlly, 2);
        row("Rally Points used between fights", p => p.st.rpBetween, 2);
        row("Rally Points left", p => p.rallyLeft, 2);
        row("**Buffs:** healed allies (Lay On Hands)", p => p.st.healGiven);
        row("Defense given (damage it stopped)", p => p.st.defCredit);
        row("Vulnerable given (extra damage dealt by the party)", p => p.st.vulnCredit);
        row("Divine Surge given (extra damage dealt by allies)", p => p.st.surgeCredit);
        row("Banes given (damage its areas stopped)", p => p.st.baneCredit);
        row("Healed with new Health (Smite, Consecrated Ground)", p => p.st.mendGiven);
        row("Guard given (damage it took instead of Health)", p => p.st.guardCredit);
        row("Extra healing on Rally Points (Font of Mercy)", p => p.st.mercyGiven);
        if (MP.MAP.on) {
          row("**Map:** AP spent moving", p => p.st.moveAP);
          row("AP lost to moving (Actions dropped or made smaller)", p => p.st.lostAP);
          row("Turns that start Engaged", p => p.st.turnsEngaged);
          row("Shots ([Ranged] Actions)", p => p.st.shots);
          row("... into melee (1 Bane)", p => p.st.intoMelee);
          row("... with Cover", p => p.st.covered);
          row("... while Engaged (2 Banes)", p => p.st.engagedShots);
          row("Flanking Boons on its melee Actions", p => p.st.flankBoons);
          row("Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken", p => `${fmt(p.st.oaMade, 2)} / ${fmt(p.st.oaTaken, 2)}`);
          row("Opportunity Attacks made (the basic Reaction): how many / their damage", p => `${fmt(p.st.oaReal, 2)} / ${fmt(p.st.oaDealt, 2)}`);
          row("Reactions used (all kinds) / the damage they dealt", p => `${fmt(p.st.reactions, 2)} / ${fmt(p.st.reactionDealt, 2)}`);
          if (RULES.apGuard) row("AP left unspent / Guard they gave / Guard used", p => `${fmt(p.st.apLeft, 2)} / ${fmt(p.st.apGuardGiven, 2)} / ${fmt(p.st.apGuardUsed, 2)}`);
          row("Conditions it put on NPCs (Hindered, Immobilized, Prone...)", p => p.st.condApplied, 2);
        }
        const names = [...new Set(days.flatMap(x => x.pcs.flatMap(p => Object.keys(p.st.debuffs))))].sort();
        for (const n of names) row(`**Debuff:** ${n} (times)`, p => p.st.debuffs[n] ?? 0, 2);
        L.push("");
      }
    }
  }
  return L.join("\n");
}

/* ------------------------------------------------------------------ run */
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  // The catch-up (2026-11-12): the default is the book today: the R builds of rework/ and fights.txt, into report.md. `--pre-r`: the classes as they
  // were before pack R (classes/, fights-pre-r.txt) under RULES_PRE_R, into report-pre-r.md (the pre-R studies read those builds).
  const PRE = process.argv.includes("--pre-r"), SRC = PRE ? { dir: "classes", fights: "fights-pre-r.txt", out: "report-pre-r.md", cmd: "node book/ruler/spec.mjs --pre-r" } : { dir: "rework", fights: "fights.txt", out: "report.md", cmd: "node book/ruler/spec.mjs" };
  Object.assign(RULES, PRE ? RULES_PRE_R : RULES_R);
  const dir = `${HERE}${SRC.dir}/`;
  const builds = fs.readdirSync(dir).filter(f => f.endsWith(".txt")).sort().map(f => parseSpec(fs.readFileSync(dir + f, "utf8"), `${SRC.dir}/${f}`));
  const fights = parseFights(fs.readFileSync(HERE + SRC.fights, "utf8")); fights.source = SRC;
  if (process.argv.includes("--check")) {   // the simulation against the exact dice math (calc.mjs); prints only "ok" when everything agrees
    let bad = 0;
    // 1. The dice themselves: 2d12 (3d12 Favored / Doomed) rolled die by die with the system's keepThree / tierOf / bbFive, against tierProbs and critProb.
    for (const [mod, dc, boons, banes, state] of [[2, 13, 0, 0, ""], [2, 13, 2, 0, ""], [2, 13, 1, 3, ""], [2, 14, 0, 0, "favored"], [3, 13, 0, 2, "doomed"], [2, 13, 6, 1, ""], [2, 12, 0, 5, ""], [1, 13, 5, 0, "doomed"], [2, 13, 3, 0, "favored"]]) {
      const R = rng(101), n = 400000, got = [0, 0, 0]; let crit = 0;
      for (let k = 0; k < n; k++) { const r = rollDice(R, mod, dc, boons, banes, state); got[r.tier - 1]++; if (r.crit) crit++; }
      const want = C.tierProbs(mod, dc, boons, banes, state), wc = C.critProb(mod, dc, boons, banes, state);
      const ok = want.every((w, i) => Math.abs(w - got[i] / n) < 0.004) && Math.abs(wc - crit / n) < 0.002; if (!ok) { bad++; console.log(`FAIL dice +${mod} vs ${dc}, ${boons} Boons, ${banes} Banes${state ? ", " + state : ""}: exact ${want.map(x => x.toFixed(3)).join(" / ")} crit ${wc.toFixed(3)}, rolled ${got.map(x => (x / n).toFixed(3)).join(" / ")} crit ${(crit / n).toFixed(3)}`); }
    }
    // 2. The map's Boons and Banes: the Field limit, High cover, Flanking (map.mjs against the book's examples).
    for (const [name, got, want] of mapChecks()) if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log(`FAIL map ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }
    // 3. A turn: one Weapon Attack of each build (no passives) against every Defense, both rule sets' builds.
    const all = [...builds, ...fs.readdirSync(`${HERE}${PRE ? "rework" : "classes"}/`).filter(f => f.endsWith(".txt")).sort().map(f => parseSpec(fs.readFileSync(`${HERE}${PRE ? "rework" : "classes"}/${f}`, "utf8"), `${PRE ? "rework" : "classes"}/${f}`))];
    for (const b of all) for (const d of fights.defenses) {
      const p = C.tierProbs(b.weaponMod, d), w = [0, 1, 2].map(t => weaponTier(b.weapon, t + 1)), avg = x => x.flat + x.dice.reduce((s, [c, n]) => s + c * (n + 1) / 2, 0);
      const exact = p[1] * (avg(w[1]) + b.weaponMod) + p[2] * (avg(w[2]) + b.weaponMod);
      const sim = turnDamage({ ...b, passives: [], turns: { one: { name: "one", steps: ["Weapon Attack"] } } }, "one", d, { n: 200000 }).avg;
      const ok = Math.abs(sim - exact) < 0.1; if (!ok) { bad++; console.log(`FAIL ${b.file} Weapon Attack vs ${d}: exact ${exact.toFixed(2)}, simulated ${sim.toFixed(2)}`); }
    }
    if (!bad) console.log("ok");
    process.exit(bad ? 1 : 0);
  }
  const text = report({ builds, fights });
  fs.writeFileSync(HERE + SRC.out, text);
  if (!process.argv.includes("--quiet")) console.log(text);
}
