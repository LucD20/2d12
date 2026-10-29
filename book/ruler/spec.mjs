// The spec-driven ruler (2026-10-29; adventuring days added the same day): describe a class build in a plain file (book/ruler/classes/*.txt) and the fights in book/ruler/fights.txt;
// this script writes book/ruler/report.md: each turn's damage against Defense 12 to 14, the build's numbers, duels against each NPC role
// (rounds to kill it, rounds to go Down) and a Monte Carlo fight of the party against each encounter (rounds, Health lost, who goes Down).
// It uses the system's own dice math (foundry/twod12/module/calc.mjs: exploding d12s, Doubles, Boons and Banes) and the Bestiary's tables
// (foundry/twod12/module/config.mjs: npcHm, npcDamage). Random numbers are seeded: the same files give the same report.
//   node book/ruler/spec.mjs            writes report.md and prints it
//   node book/ruler/spec.mjs --quiet    writes report.md only
//   node book/ruler/spec.mjs --check    checks the simulation against the exact dice math (calc.mjs) and stops
// The file format is described in book/ruler/README.md ("The spec files").
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
globalThis.foundry ??= { utils: {}, applications: { api: {} } }; globalThis.game ??= { settings: { get: () => true } }; globalThis.CONFIG ??= {}; globalThis.Hooks ??= { on() {} };
const HERE = fileURLToPath(new URL(".", import.meta.url));
const C = await import(new URL("../../foundry/twod12/module/calc.mjs", import.meta.url).href);
const CF = await import(new URL("../../foundry/twod12/module/config.mjs", import.meta.url).href);
const TW = CF.TWOD12;

/* ------------------------------------------------------------------ random numbers (seeded) */
export function rng(seed = 2026) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const die = (R, s) => 1 + Math.floor(R() * s);
const pickU = (x, probs) => (x < probs[0] ? 1 : x < probs[0] + probs[1] ? 2 : 3);
const pick = (R, probs) => pickU(R(), probs);

/* ------------------------------------------------------------------ damage expressions */
/**
 * "[B] 1[W] + [Mod] + [M] 2d6 Ho" -> { w: 1, mod: 1, dice: [[2, 6]], flat: 0 }. Pools ([B] [M]) and damage types (Ho, Pi...) are read and left out
 * (the fight counts one Health Pool). "0", "-" and "" are no damage.
 */
export function parseDamage(text) {
  const out = { w: 0, mod: 0, dice: [], flat: 0 };
  const t = String(text ?? "").replace(/\[(B|M|C)\]/g, " ").replace(/\b(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, " ").trim();
  if (!t || t === "-" || t === "0") return out;
  for (const raw of t.split("+")) {
    const p = raw.trim();
    let m;
    if (!p) continue;
    if ((m = p.match(/^(\d*)\[W\]$/))) out.w += Number(m[1] || 1);
    else if (p === "[Mod]") out.mod += 1;
    else if ((m = p.match(/^(\d+)d(\d+)$/))) out.dice.push([Number(m[1]), Number(m[2])]);
    else if ((m = p.match(/^-?\d+$/))) out.flat += Number(p);
    else throw new Error(`can't read the damage "${text}" (the part "${p}")`);
  }
  return out;
}
/** The weapon's damage of a tier ("1d8", "1d10+2"), as parsed parts. */
const weaponTier = (weapon, tier) => parseDamage(weapon?.tiers?.[tier - 1] ?? "0");
/** Roll a damage expression: { total, dice: how many dice were rolled } (Empowered adds per die; a die never goes below 1 with Enfeebled). */
export function rollDamage(R, dmg, { weapon = null, tier = 2, mod = 0, empowered = 0 } = {}) {
  let total = dmg.flat + dmg.mod * mod, n = 0;
  const roll = (count, sides) => { for (let k = 0; k < count; k++) { total += Math.max(1, die(R, sides) + empowered); n++; } };
  for (const [c, s] of dmg.dice) roll(c, s);
  for (let k = 0; k < dmg.w; k++) { const wt = weaponTier(weapon, tier); total += wt.flat; for (const [c, s] of wt.dice) roll(c, s); }
  return { total, dice: n };
}

/** The average of a damage expression on a tier (Empowered per die; the extras only when the tier deals damage). */
export function avgDamage(dmg, weapon, tier, mod, emp = 0, extra = []) {
  const wt = weaponTier(weapon, tier), dice = d => d.reduce((s, [c, n]) => s + c * ((n + 1) / 2 + emp), 0);
  const deals = dmg.dice.length || dmg.flat || dmg.mod || (dmg.w && (wt.dice.length || wt.flat));
  if (!deals) return 0;
  return dmg.flat + dmg.mod * mod + dice(dmg.dice) + dmg.w * (wt.flat + dice(wt.dice)) + extra.reduce((s, x) => s + x.flat + x.mod * mod + dice(x.dice), 0);
}

/* ------------------------------------------------------------------ the spec files */
const clean = l => l.replace(/#.*$/, "").trim();
const words = s => String(s ?? "").toLowerCase().split(/[\s,+]+/).filter(Boolean);
const FREQ = new Set(["at-will", "turn", "round", "encounter", "daily", "none"]);

/** One effect: "boon 1 next shot strike", "empowered 1 turn", "extra 1d8 next @Smite", "heal 1 rally", "defense 1 ally", "taunt 1", "vulnerable 2", "area 2", "reload", "favored next ...". */
function parseEffect(text) {
  const t = text.trim(), w = t.split(/\s+/), what = w[0].toLowerCase(), n = Number(w[1]);
  const rest = w.slice(2).join(" ");
  const filter = s => { const at = s.match(/@([^,;]+)/), ws = words(s.replace(/@[^,;]+/, "")); return { name: at ? at[1].trim().toLowerCase() : "", quarry: ws.includes("quarry"), traits: ws.filter(x => !["next", "turn", "first", "quarry", "on"].includes(x)) }; };
  if (what === "boon" || what === "bane" || what === "empowered") return { kind: what, n, scope: /\bturn\b/.test(rest) ? "turn" : "next", ...filter(rest) };
  if (what === "favored") return { kind: "favored", scope: "next", ...filter(w.slice(1).join(" ")) };
  if (what === "extra") return { kind: "extra", dmg: parseDamage(w[1]), scope: /\bfirst\b/.test(rest) ? "first" : "next", anyTier: /\bany-tier\b/.test(rest), ...filter(rest.replace(/\bany-tier\b/, "")) };   // any-tier: a single-value Buff, which applies on Tier 1 too (the book, Buffs)
  if (what === "heal") return { kind: "heal", n, who: /\bself\b/.test(rest) ? "self" : "ally" };
  if (what === "debuff") return { kind: "debuff", name: w.slice(1).join(" ") };   // counted for the day's report (Prone, Hindered...); no effect in the fight
  if (what === "defense") return { kind: "defense", n, who: /allies/.test(rest) ? "allies" : /self/.test(rest) ? "self" : "ally" };
  if (what === "taunt") return { kind: "taunt", n };
  if (what === "vulnerable") return { kind: "vulnerable", n };
  if (what === "area") return { kind: "area", n };
  if (what === "reload") return { kind: "reload" };
  if (what === "reduce") return { kind: "reduce", n, adjacent: Number(rest.match(/adjacent\s+(\d+)/)?.[1] ?? 0) };   // a passive: Body damage you (and N adjacent allies) take is reduced by n (each NPC Strike)
  if (what === "mend") return { kind: "mend", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // new Health (not a Rally Point): ally = the most hurt ally, any = you or an ally
  if (what === "guard") return { kind: "guard", dmg: parseDamage(w[1]), who: /\bself\b/.test(rest) ? "self" : /\bany\b/.test(rest) ? "any" : "ally" };   // Guard (proposed): a buffer that takes damage first and ends with the encounter; the highest one counts
  if (what === "surge") return { kind: "surge", dmg: parseDamage(w[1]) };   // the next ally (not you) who deals damage to the target before your next turn deals this extra
  if (what === "bonus") return { kind: "bonus", n, ...filter(rest) };       // a passive: +n damage on matching Actions that deal damage
  if (what === "rally-bonus") return { kind: "rallybonus", n };              // a passive: you and your allies heal n more for each Rally Point used
  if (what === "block") return { kind: "block", dmg: parseDamage(w[1]) };    // price list: a Reaction that reduces one hit on an ally by this
  // Effects the price list (econ.mjs) reads; the fight ignores them.
  if (what === "banes") return { kind: "banes", n, others: /\bothers\b/.test(rest), text: rest };   // the target's (or the area's) Strikes take N Banes
  if (what === "heal-dice") return { kind: "healdice", dmg: parseDamage(w[1]) };                     // each ally in it heals that at the start of its turns
  if (what === "reduce-from") return { kind: "reducefrom", n };                                        // damage you take from the target's Actions is reduced by N
  if (["revive", "prevent-down", "evade", "push", "cover", "remove-effect", "save-boon", "range", "note"].includes(what)) return { kind: what, n: Number.isFinite(n) ? n : 0, text: w.slice(1).join(" ") };
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
    weapon: null, actions: {}, passives: [], turns: {}, plan: [], when: [] };
  text.split(/\r?\n/).forEach((rawLine, i) => {
    const line = clean(rawLine);
    if (!line) return;
    const fail = msg => { throw new Error(`${file}, line ${i + 1}: ${msg}\n  ${rawLine.trim()}`); };
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
        b.weapon = { name: m[1].trim(), traits: words(m[2] ?? "melee"), tiers: m[3].split("/").map(s => s.trim()) };
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
        b.actions[a.name.toLowerCase()] = a;
      } else if (key === "passive") {
        const m = rest.match(/^(.+?):\s*(?:escalation\s+(\d)\s*:\s*)?(.+)$/i); if (!m) fail("write passive like: Marked Quarry: boon 1 shot strike");
        b.passives.push({ name: m[1].trim(), escalation: Number(m[2] ?? 0), effect: parseEffect(m[3]) });
      } else if (key === "turn") {
        const m = rest.match(/^(.+?):\s*(.+)$/); if (!m) fail("write turn like: Main: Smite 2, Weapon Attack, move 1");
        b.turns[m[1].trim().toLowerCase()] = { name: m[1].trim(), steps: m[2].split(",").map(s => s.trim()).filter(Boolean) };
      } else if (key === "plan") b.plan = rest.replace(/^:\s*/, "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);   // "A | B": A while its Encounter and Daily Actions are unused, else B
      else if (key === "when") {
        const m = rest.match(/^ally below (\d+)%\s*:\s*(.+)$/i), u = rest.match(/^unloaded\s*:\s*(.+)$/i), me = rest.match(/^self below (\d+)%\s*:\s*(.+)$/i);
        if (m) b.when.push({ below: Number(m[1]) / 100, turn: m[2].trim().toLowerCase() });
        else if (me) b.whenSelf = { below: Number(me[1]) / 100, turn: me[2].trim().toLowerCase() };
        else if (u) b.unloadedTurn = u[1].trim().toLowerCase();
        else fail("write when like: when ally below 50%: Heal, when self below 30%: Steel, or when unloaded: Reload turn");
      }
      else fail(`unknown line "${head}"`);
    } catch (e) { if (/line \d+:/.test(e.message)) throw e; fail(e.message); }
  });
  // The derived numbers (the book's formulas).
  const lvf = (b.level + 10) / 10, at = k => Number(b.attributes[k] ?? 0);
  const thr = (k, h) => Math.max(0, Math.ceil(((at(k) + 2) * h.mult + h.sp) * lvf));
  b.bodyHealth = b.health ? thr("body", b.health.body) : 0; b.mindHealth = b.health ? thr("mind", b.health.mind) : 0;
  b.pool = b.bodyHealth + b.mindHealth;
  b.ad = 11 + b.armor; b.wd = 11 + b.powerMod + b.wdBonus;
  b.rallyPoints = b.rally + Math.ceil((at("body") + at("mind") + b.level) / 2);
  b.rallyHeal = Math.ceil(b.pool / 4);
  // Every turn and plan entry must name things that exist.
  for (const t of Object.values(b.turns)) for (const s of t.steps) { const st = stepOf(s); if (st.kind === "action" && !b.actions[st.name]) throw new Error(`${file}: turn "${t.name}" uses "${s}", which is not an action of the file`); }
  for (const p of [...b.plan.flatMap(x => x.split("|").map(y => y.trim())), ...b.when.map(w => w.turn), ...(b.unloadedTurn ? [b.unloadedTurn] : []), ...(b.whenSelf ? [b.whenSelf.turn] : [])]) if (!b.turns[p]) throw new Error(`${file}: the plan names "${p}", which is not a turn of the file`);
  for (const a of Object.values(b.actions)) for (const d of [...a.does, ...a.then]) if (!b.actions[d.toLowerCase()]) throw new Error(`${file}: "${a.name}" does "${d}", which is not an action of the file`);
  return b;
}
/** A turn's step: "move 1", "Weapon Attack", "Weapon Attack (reload shot)", "Weapon Attack (+1 boon)". */
function stepOf(s) {
  const mv = s.match(/^move\s+(\d+)$/i);
  if (mv) return { kind: "move", ap: Number(mv[1]) };
  const m = s.match(/^(.+?)\s*(?:\((.+)\))?$/), opts = (m[2] ?? "").toLowerCase();
  return { kind: "action", name: m[1].trim().toLowerCase(), reloadShot: /reload shot/.test(opts), keep: Number(opts.match(/keep (\d+)/)?.[1] ?? 0), boons: Number(opts.match(/\+(\d+) boon/)?.[1] ?? 0), banes: Number(opts.match(/\+(\d+) bane/)?.[1] ?? 0) };
}

/** The encounters file: "party Paladin, Paladin, Archer, Archer", "encounter 4 Standards: 4 standard", "runs 2000", "level 1". */
export function parseFights(text) {
  const f = { party: [], encounters: [], days: [], dayParties: [], dayRuns: 1000, runs: 2000, level: 1, defenses: [12, 13, 14] };
  const npcList = txt => txt.split(",").flatMap(s => { const mm = s.trim().match(/^(\d+)\s+(\w+)(?:\s+(\w+))?$/); if (!mm) throw new Error(`fights.txt: can't read "${s.trim()}" (write: 2 standard, 1 elite high)`); return Array(Number(mm[1])).fill({ role: mm[2].toLowerCase().replace(/s$/, ""), rating: (mm[3] ?? "medium").toLowerCase() }); });
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
      f.encounters.push({ name: m[1].trim(), npcs: m[2].split(",").flatMap(s => { const mm = s.trim().match(/^(\d+)\s+(\w+)(?:\s+(\w+))?$/); return Array(Number(mm[1])).fill({ role: mm[2].toLowerCase().replace(/s$/, ""), rating: (mm[3] ?? "medium").toLowerCase() }); }) });
    } else throw new Error(`fights.txt: unknown line "${line}"`);
  }
  return f;
}

/* ------------------------------------------------------------------ NPCs from the Bestiary */
/** A Bestiary NPC (every rating Medium but the Weapon Attribute, High as in the Builder): Health, Defenses, Modifier, damage, Strikes a turn. */
export function npcOf(role, rating = "medium", level = 1) {
  const r = TW.npcRoles[role] ?? TW.npcRoles.standard, R = TW.npcRatings, attr = k => r.attr + R[k].off;
  const body = attr("high"), mind = attr("medium");
  const hm = CF.npcHm(role, rating, level), hp = a => Math.max(0, Math.ceil((a + 2) * hm + r.hb - 1e-9));
  const mod = Math.ceil(body / 2 + 1);
  return { role, rating, name: r.label, pool: hp(body) + hp(mind), ad: Math.max(TW.defenseBase, r.defense), wd: Math.max(TW.defenseBase, r.defense), mod,
    save: { body, mind, instinct: attr("medium"), appeal: attr("medium") }, t2: CF.npcDamage(r.basic[0], rating, level), t3: CF.npcDamage(r.basic[1], rating, level),
    strikes: { minion: 1, grunt: 2, standard: 2, elite: 3 }[role] ?? 2 };
}
/** An NPC's attack damage on a tier: the Builder's dice for the average, the Modifier added (Tier 1 deals nothing). */
const DICE = [[0, 0, 0], [1, 1, 1], [1, 2, 2], [1, 4, 2.5], [1, 6, 3.5], [1, 8, 4.5], [1, 10, 5.5], [1, 12, 6.5], [2, 6, 7], [2, 8, 9], [2, 10, 11], [2, 12, 13], [3, 8, 13.5], [3, 10, 16.5], [3, 12, 19.5], [4, 10, 22], [4, 12, 26]];
const diceFor = avg => DICE.reduce((b, d) => (Math.abs(d[2] - avg) < Math.abs(b[2] - avg) ? d : b));
function npcDamage(R, npc, tier) {
  if (tier < 2) return 0;
  const avg = tier === 2 ? npc.t2 : npc.t3, d = diceFor(avg - npc.mod);
  let t = npc.mod;
  if (d[1] <= 2 && d[0] === 1) t += d[1]; else for (let k = 0; k < d[0]; k++) t += die(R, d[1]);
  return Math.max(0, t);
}

/* ------------------------------------------------------------------ one PC's turn */
const matches = (eff, a, traits, target, pc) => (!eff.name || a.name.toLowerCase().startsWith(eff.name)) && (eff.traits ?? []).every(t => traits.includes(t)) && (!eff.quarry || (target && target === pc.quarry));
const group = name => name.toLowerCase().replace(/\s+\d+$/, "");   // "Smite 2" and "Smite 3" share their Frequency
const hasDamage = d => d.dice.length + d.w + d.flat + d.mod > 0;

/**
 * Run one turn. pc: { build, unloaded, spent, quarry, firstThisRound }; turn: { steps }; ctx: { R, escalation, target(): the enemy to hit,
 * others(n): other enemies (an area, a different target), heal(pc, n), defend(pc, n, who) }. Returns { damage, ap, strikes, problems }.
 */
export function runTurn(pc, turn, ctx) {
  const b = pc.build, R = ctx.R, st = { next: [], turnFx: [], atWill: {}, used: new Set() }, res = { damage: 0, ap: 0, strikes: 0, problems: [], missed: [] };
  // Escalation is a resource (the book, Escalation): an Active spends what it costs; a passive works while you have at least its number.
  pc.esc ??= ctx.escalation ?? 3;
  const passives = () => b.passives.filter(p => pc.esc >= p.escalation);
  pc.firstThisRound ??= new Set();
  // A Weapon Action takes Ranged or Melee from the weapon, and Shot when the weapon is Projectile (the book, Traits: Shot).
  const weaponGives = () => [...(b.weapon?.traits ?? []).filter(x => x === "ranged" || x === "melee"), ...((b.weapon?.traits ?? []).includes("projectile") ? ["shot"] : [])];
  const traitsOf = (a, extra = []) => [...new Set([...a.traits, ...extra, ...(a.traits.includes("weapon") ? weaponGives() : [])])];
  const apply = (e, target, a = null) => {
    if (["boon", "bane", "empowered", "favored", "extra"].includes(e.kind)) (e.scope === "turn" ? st.turnFx : st.next).push(e);
    else if (e.kind === "heal") ctx.heal?.(pc, e.n, e.who);
    else if (e.kind === "mend") ctx.mend?.(pc, rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who);
    else if (e.kind === "guard") ctx.guard?.(pc, rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who);
    else if (e.kind === "surge" && target) target.surge = { dmg: e.dmg, by: pc };
    else if (e.kind === "banes") ctx.zone?.(pc, e, a, target);
    else if (e.kind === "healdice") ctx.zoneHeal?.(pc, e, a);
    else if (e.kind === "debuff") { if (pc.st) pc.st.debuffs[e.name] = (pc.st.debuffs[e.name] ?? 0) + 1; }
    else if (e.kind === "defense") ctx.defend?.(pc, e.n, e.who, a);
    else if (e.kind === "taunt" && target) target.taunt = { by: pc, n: e.n };
    else if (e.kind === "vulnerable" && target) { if (e.n >= (target.vulnerable ?? 0)) target.vulnBy = pc; target.vulnerable = Math.max(target.vulnerable ?? 0, e.n); if (pc.st) pc.st.debuffs[`Vulnerable ${e.n}`] = (pc.st.debuffs[`Vulnerable ${e.n}`] ?? 0) + 1; }
    else if (e.kind === "reload") pc.unloaded = false;
  };
  const doAction = (a, opts = {}, extraTraits = [], linked = false, forced = null) => {
    const traits = traitsOf(a, extraTraits);
    if (traits.includes("weapon") && pc.unloaded && !a.effects.some(e => e.effect.kind === "reload")) { res.missed.push(`${a.name}: the weapon is unloaded`); return; }   // a failed Reload roll: bad luck, not a rule problem
    if (a.does.length) {   // Linked Actions (1A): no AP, no Frequency, no Strike, no At-will Bane
      const each = { boons: a.each.filter(e => e.kind === "boon").reduce((s, e) => s + e.n, 0), empowered: a.each.filter(e => e.kind === "empowered").reduce((s, e) => s + e.n, 0), extra: a.each.filter(e => e.kind === "extra").map(e => e.dmg) };
      const first = ctx.target(), others = a.different ? (ctx.others(a.does.length - 1) ?? []) : [];
      a.does.forEach((d, k) => doAction(b.actions[d.toLowerCase()], { ...each, reloadShot: opts.reloadShot && k === a.does.length - 1 }, a.gives ?? [], true, k === 0 || !a.different ? first : (others[k - 1] ?? first)));
      for (const e of a.effects) apply(e.effect, first, a);
      return;
    }
    if (a.vs === "none") { for (const e of a.effects) apply(e.effect, ctx.target(), a); return; }
    const reloadShot = opts.reloadShot && traits.includes("weapon") && (b.weapon?.traits ?? []).includes("reload");
    if (opts.reloadShot && !reloadShot) res.problems.push(`${a.name}: a Reload Shot needs a Weapon Action with a Reload weapon`);
    let boons = opts.boons ?? 0, banes = opts.banes ?? 0, favored = reloadShot || !!a.favored, emp = (opts.empowered ?? 0) + (reloadShot ? 2 : 0), bonus = 0;
    const extra = [...(opts.extra ?? [])], anyTier = [], dc = a.vs.match(/^dc\s+(\d+)/)?.[1];
    const target = dc ? null : (forced ?? ctx.target());
    if (!dc && !target) return;
    for (const p of passives()) {
      if (!matches(p.effect, a, traits, target, pc)) continue;
      if (p.effect.kind === "boon") boons += p.effect.n;
      if (p.effect.kind === "empowered") emp += p.effect.n;
      if (p.effect.kind === "bonus") bonus += p.effect.n;
      if (p.effect.kind === "extra" && p.effect.scope === "first" && !pc.firstThisRound.has(p.name)) { extra.push(p.effect.dmg); pc.firstThisRound.add(p.name); }
    }
    for (const x of st.turnFx) if (matches(x, a, traits, target, pc)) { if (x.kind === "empowered") emp += x.n; if (x.kind === "boon") boons += x.n; }
    st.next = st.next.filter(x => {
      if (!matches(x, a, traits, target, pc)) return true;
      if (x.kind === "boon") boons += x.n; else if (x.kind === "bane") banes += x.n; else if (x.kind === "empowered") emp += x.n; else if (x.kind === "favored") favored = true; else if (x.kind === "extra") (x.anyTier ? anyTier : extra).push(x.dmg);
      return false;
    });
    if (a.freq === "at-will" && !linked) { const k = group(a.name); banes += st.atWill[k] ?? 0; st.atWill[k] = (st.atWill[k] ?? 0) + 1; }
    const mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
    if (dc) {   // a roll against a DC (Reload): no target, no damage
      const tier = pick(R, C.tierProbs(mod, Number(dc), boons, banes, favored ? "favored" : ""));
      for (const e of a.effects) if (tier >= e.min && tier <= e.max) apply(e.effect, null);
      return;
    }
    const targets = [target, ...(a.area > 1 ? ctx.others(a.area - 1) : [])];
    let mainTier = 1;
    for (const t of targets) {
      let tier;
      if (a.vs.startsWith("save")) {   // a Save Action: the target rolls against your DC (11 + Modifier); its Tier 1 is the worst for it
        const attr = a.vs.split(/\s+/)[1] ?? "instinct";
        tier = pick(R, C.tierProbs(t.save?.[attr] ?? 0, 11 + mod, 0, 0, ""));
      } else {
        // One random number for the roll with and without the target's Vulnerable: the difference is credited to whoever made it Vulnerable.
        const u = R(), def = a.vs === "wd" ? t.wd : t.ad, st = favored ? "favored" : "";
        tier = pickU(u, C.tierProbs(mod, def, boons + (t.vulnerable ?? 0), banes, st));
        if (t.vulnerable && t.vulnBy?.st && a.tiers) {
          const without = pickU(u, C.tierProbs(mod, def, boons, banes, st)), av = k => avgDamage(a.tiers[k - 1], b.weapon, k, mod, emp, extra);
          t.vulnBy.st.vulnCredit += av(tier) - av(without);
        }
      }
      const dmg = a.tiers?.[tier - 1];
      if (t === target) for (const x of anyTier) { const v = rollDamage(R, x, { mod, empowered: emp }).total; t.damage = (t.damage ?? 0) + v; res.damage += v; }   // on every Tier, whatever the Action deals
      if (dmg && (dmg.dice.length || dmg.flat || dmg.mod || (dmg.w && hasDamage(weaponTier(b.weapon, tier))))) {   // 1[W] of a weapon that deals 0 on this tier is no damage (and no extra)
        let total = rollDamage(R, dmg, { weapon: b.weapon, tier, mod, empowered: emp }).total;
        for (const x of extra) total += rollDamage(R, x, { mod, empowered: emp }).total;
        total += bonus;
        t.damage = (t.damage ?? 0) + total; res.damage += total;
        if (t.surge && t.surge.by !== pc) {   // Divine Surge: an ally's extra damage, credited to the Paladin who gave it (not in anyone's own damage)
          const x = rollDamage(R, t.surge.dmg, { mod }).total; t.damage += x; if (t.surge.by.st) t.surge.by.st.surgeCredit += x; t.surge = null;
        }
      }
      if (t === target) mainTier = tier;
    }
    if (reloadShot) pc.unloaded = true;
    for (const e of a.effects) if (mainTier >= e.min && mainTier <= e.max) apply(e.effect, target, a);
    for (const t of a.then) doAction(b.actions[t.toLowerCase()], {}, [], true, target);
  };
  for (const s of turn.steps) {
    const step = stepOf(s);
    if (step.kind === "move") { res.ap += step.ap; continue; }
    const a = b.actions[step.name], g = group(a.name);
    if (a.escalation > pc.esc) { res.missed.push(`${a.name}: costs ${a.escalation} Escalation (you have ${pc.esc})`); continue; }   // not a rule problem: the plan tries it when it can
    if (step.keep && pc.esc - a.escalation < step.keep) { res.missed.push(`${a.name}: kept ${step.keep} Escalation for a passive`); continue; }   // "(keep 2)": spend only what is above 2
    if (a.freq === "daily" && pc.dailyOK === false) { res.missed.push(`${a.name}: the Daily is kept for a hard fight`); continue; }
    if ((a.freq === "encounter" || a.freq === "daily") && pc.spent?.has(g)) { res.problems.push(`${a.name}: already used this ${a.freq === "encounter" ? "encounter" : "day"}`); continue; }
    if (a.freq === "round" || a.freq === "turn") { if (st.used.has(g)) res.problems.push(`${a.name}: once a ${a.freq}`); st.used.add(g); }
    if (a.freq === "encounter" || a.freq === "daily") { (pc.spent ??= new Set()).add(g); res.nova = true; }
    res.ap += a.ap;
    if (a.traits.includes("strike")) res.strikes++;
    pc.esc -= a.escalation;
    doAction(a, step);
  }
  if (res.ap > 5) res.problems.push(`${res.ap} AP (5 a turn)`);
  if (res.strikes > 3) res.problems.push(`${res.strikes} Strikes (3 a turn)`);
  return res;
}

/* ------------------------------------------------------------------ the tables */
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : "-");
const pct = x => `${Math.round(x * 100)}%`;
const median = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/** Expected damage of a turn against one creature with this Defense (AD and WD the same): Monte Carlo, n runs. A turn that starts with a Reload starts unloaded. */
export function turnDamage(build, turnName, defense, { n = 20000, seed = 7, escalation = 3 } = {}) {
  const R = rng(seed), turn = build.turns[turnName], first = build.actions[stepOf(turn.steps[0]).name];
  const startsUnloaded = !!first?.effects.some(e => e.effect.kind === "reload");
  let sum = 0, last = null;
  for (let k = 0; k < n; k++) {
    const target = { ad: defense, wd: defense, save: { body: 2, mind: 1, instinct: 1, appeal: 1 } }, pc = { build, quarry: target, unloaded: startsUnloaded, esc: escalation };
    last = runTurn(pc, turn, { R, escalation, target: () => target, others: () => [] });
    sum += last.damage;
  }
  return { avg: sum / n, problems: last.problems, ap: last.ap, strikes: last.strikes };
}

/** The turn a PC takes: its "when unloaded" turn, its "when ally below" turn, else the plan's turn for the round (the last one repeats). */
export function turnFor(pc, round, allies = []) {
  const b = pc.build;
  if (pc.unloaded && b.unloadedTurn) return b.unloadedTurn;
  if (b.whenSelf && pc.rallyLeft > 0 && (pc.damage ?? 0) >= (1 - b.whenSelf.below) * b.pool) return b.whenSelf.turn;
  for (const w of b.when) if (allies.some(x => x !== pc && !x.down && x.damage >= (1 - w.below) * x.build.pool)) return w.turn;
  const entry = b.plan[Math.min(round - 1, b.plan.length - 1)];
  if (!entry) return Object.keys(b.turns)[0];
  const opts = entry.split("|").map(x => x.trim());   // "A | B": the first whose Encounter and Daily Actions are still unused (a Daily only where it may be used)
  const ready = k => b.turns[k].steps.map(stepOf).filter(x => x.kind === "action").every(x => { const a = b.actions[x.name], g = group(a.name);
    return !(a.freq === "encounter" || a.freq === "daily") || (!pc.spent?.has(g) && !(a.freq === "daily" && pc.dailyOK === false)); });
  return opts.find(ready) ?? opts.at(-1);
}

const npcAvg = (f, tier) => (tier < 2 ? 0 : tier === 2 ? f.t2 : f.t3);
/**
 * One NPC Strike against a PC. One random number decides the tier with and without the PC's Defense bonus (the difference, in average damage,
 * is credited to the bonus's giver), then damage reduction (Hallowed Stance) is applied and credited to the PC. Returns the damage taken.
 */
const npcStrike = (R, f, t, banes, escalation = 3, pcs = []) => {
  // Damage reduction: its own passive, or an adjacent ally's (Hallowed Stance: "you and your adjacent allies"; the sim makes N allies adjacent for the fight).
  let reduce = t.build.passives.filter(p => p.effect.kind === "reduce" && escalation >= p.escalation).reduce((s, p) => Math.max(s, p.effect.n), 0), reducer = null;
  for (const g of pcs) if (g !== t && !g.down && g.adjacent?.includes(t)) for (const p of g.build.passives) if (p.effect.kind === "reduce" && p.effect.adjacent && (g.esc ?? 0) >= p.escalation && p.effect.n > reduce) { reduce = p.effect.n; reducer = g; }
  const zb = f.zone && f.zone.left > 0 ? f.zone.n : 0;   // Consecrated Ground: Banes on its Strikes while it stands in the area
  const def = t.build.ad + (t.defBonus ?? 0) + (t.passiveDef ?? 0);
  const u = R(), tier = pickU(u, C.tierProbs(f.mod, def, 0, banes + zb, ""));
  if (t.defBonus && t.defBy?.st) t.defBy.st.defCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def - t.defBonus, 0, banes + zb, ""))) - npcAvg(f, tier);
  if (zb && f.zone.by?.st) f.zone.by.st.baneCredit += npcAvg(f, pickU(u, C.tierProbs(f.mod, def, 0, banes, ""))) - npcAvg(f, tier);
  const d = npcDamage(R, f, tier), afterReduce = d > 0 ? Math.max(0, d - reduce) : 0;
  const absorbed = Math.min(t.guard ?? 0, afterReduce), taken = afterReduce - absorbed;   // Guard takes the damage first
  if (absorbed) { t.guard -= absorbed; if (t.guardBy?.st) t.guardBy.st.guardCredit += absorbed; }
  if (t.st) { t.st.incoming += d; t.st.reduced += d - afterReduce; t.st.taken += taken; }
  if (reducer?.st) reducer.st.reducedGiven += d - taken;
  return taken;
};

/** An NPC's average damage a turn to this PC (its Strikes, At-will Banes, the PC's AD; no damage reduction: Escalation 0). */
export function npcTurn(npc, build, n = 20000) { const R = rng(5), me = { build }; let sum = 0; for (let k = 0; k < n; k++) for (let s = 0; s < npc.strikes; s++) sum += npcStrike(R, npc, me, s, 0); return sum / n; }

/** A PC's state across a day: its damage, Rally Points, and what it did (st). */
export const pcState = b => ({ build: b, damage: 0, down: false, rallyLeft: b.rallyPoints, defBonus: 0, defBy: null,
  st: { dealt: 0, rounds: 0, novaDealt: 0, novaTurns: 0, incoming: 0, reduced: 0, reducedGiven: 0, taken: 0, defCredit: 0, vulnCredit: 0, surgeCredit: 0, guardCredit: 0, baneCredit: 0, healGiven: 0, mendGiven: 0, mercyGiven: 0, rpSelf: 0, rpByAlly: 0, rpBetween: 0, downs: 0, debuffs: {} } });
/** The most a PC heals more per Rally Point from a party member's passive (Font of Mercy; the best one, they don't stack), and who gives it. */
const rallyBonus = (pcs, t, inCombat = true) => { let n = 0, by = null; for (const g of pcs) if (!g.down || g === t) for (const p of g.build.passives) if (p.effect.kind === "rallybonus" && p.effect.n > n && (inCombat ? (g.esc ?? 0) : 0) >= p.escalation) { n = p.effect.n; by = g; } return { n, by }; };   // an Escalation passive works only in a fight (Escalation is 0 between fights)

/**
 * A fight: the party (builds, or PC states carried through a day) against NPCs. A PC already at its Health Pool starts Down and stays out.
 * Returns { rounds, won, lost: share of the party's Health lost in this fight, downs, firstDown, wipe, downBy, pcs }.
 */
export function fight(party, npcs, R, { maxRounds = 12 } = {}) {
  const pcs = party.map(p => (p.build ? p : pcState(p)));
  for (const p of pcs) { p.zoneHeal = null; p.guard = 0; p.guardBy = null; p.down = p.damage >= p.build.pool; p.defBonus = 0; p.defBy = null; p.spent = new Set([...(p.spent ?? [])].filter(g => p.build.actions[Object.keys(p.build.actions).find(k => group(k) === g)]?.freq === "daily")); p.quarry = null; p.unloaded = false; p.startDamage = p.damage; p.esc = p.startEsc ?? 0; }
  const foes = npcs.map(n => ({ ...n, damage: 0, dead: false, vulnerable: 0, surge: null, zone: null }));
  // Adjacent allies (Hallowed Stance): the N allies most often in front (highest "targeted"), fixed for the fight.
  for (const p of pcs) { const k = Math.max(0, ...p.build.passives.filter(x => x.effect.kind === "reduce").map(x => x.effect.adjacent)); p.adjacent = pcs.filter(x => x !== p).sort((x, y) => y.build.targeted - x.build.targeted).slice(0, k); }
  const order = [...pcs.map(p => ({ pc: p })), ...foes.map(f => ({ npc: f }))];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }   // initiative
  let round = 0, firstDown = 0;
  const alive = () => foes.filter(f => !f.dead), up = () => pcs.filter(p => !p.down);
  const focus = () => alive().sort((x, y) => (x.pool - x.damage) - (y.pool - y.damage))[0];   // the enemy closest to dying
  const mostHurt = list => list.sort((x, y) => y.damage / y.build.pool - x.damage / x.build.pool)[0];
  const useRally = (t, n, by) => {   // t uses n Rally Points (Steel Yourself, or an ally's Lay On Hands)
    for (let k = 0; k < n && t && t.rallyLeft > 0 && t.damage > 0; k++) {
      const rb = rallyBonus(pcs, t), h0 = Math.min(t.damage, t.build.rallyHeal), h = Math.min(t.damage, t.build.rallyHeal + rb.n);
      t.damage -= h; t.rallyLeft--; if (rb.by) rb.by.st.mercyGiven += h - h0;
      if (by === t) t.st.rpSelf++; else { t.st.rpByAlly++; by.st.healGiven += h0; }
    }
  };
  const mendOne = (t, amount, by) => { if (!t) return; const h = Math.min(t.damage, amount); t.damage -= h; by.st.mendGiven += h; };   // new Health
  while (alive().length && up().length && round < maxRounds) {
    round++;
    for (const p of pcs) { p.firstThisRound = new Set(); if (round > 1 && !p.down) p.esc = Math.min(3, p.esc + 1); }   // +1 Escalation at the start of every round after the first
    for (const o of order) {
      if (!alive().length || !up().length) break;
      if (o.pc) {
        const pc = o.pc; if (pc.down) continue;
        pc.st.rounds++;
        for (const x of pcs) if (x.defBy === pc) { x.defBonus = 0; x.defBy = null; }   // a Defense bonus lasts 1 round: until its giver's next turn
        for (const f of foes) { if (f.surge?.by === pc) f.surge = null; if (f.zone?.by === pc) f.zone.left--; }   // Divine Surge lasts until your next turn; an area counts its rounds down on its maker's turn
        for (const x of pcs) if (x.zoneHeal?.by === pc) x.zoneHeal.left--;
        if (pc.zoneHeal?.left > 0 && pc.damage > 0) mendOne(pc, rollDamage(R, pc.zoneHeal.dmg).total, pc.zoneHeal.by);   // healing at the start of its turn (Consecrated Ground)
        if (!pc.quarry || pc.quarry.dead) pc.quarry = focus();   // Marked Quarry: the first target; a new one when it dies
        const r = runTurn(pc, pc.build.turns[turnFor(pc, round, pcs)], {
          R, escalation: pc.esc,
          target: () => (pc.quarry && !pc.quarry.dead && pc.build.passives.some(p => p.effect.quarry) ? pc.quarry : focus()),
          others: n => alive().filter(f => f !== pc.quarry && f !== focus()).concat(alive().filter(f => f !== pc.quarry)).filter((f, i, a) => a.indexOf(f) === i).slice(0, n),
          heal: (who, n, kind) => useRally(kind === "self" ? who : mostHurt(up().filter(x => x.damage >= 0.75 * x.build.rallyHeal && x.rallyLeft > 0)), n, who),   // an ally's Rally Point only when it heals at least 3/4 of its value
          defend: (who, n, kind, a) => { const near = [who, ...up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 99));
            const list = kind === "allies" ? near : kind === "self" ? [who] : [mostHurt(up().filter(x => x !== who)) ?? who]; for (const t of list) if (n >= t.defBonus) { t.defBonus = n; t.defBy = who; } },
          mend: (who, amount, kind) => mendOne(kind === "self" ? who : kind === "any" ? mostHurt(up().filter(x => x.damage > 0)) : mostHurt(up().filter(x => x !== who && x.damage > 0)), amount, who),
          guard: (who, amount, kind) => { const t = kind === "self" ? who : kind === "any" ? mostHurt(up()) : mostHurt(up().filter(x => x !== who)) ?? who; if (t && amount > (t.guard ?? 0)) { t.guard = amount; t.guardBy = who; } },
          zone: (who, e, a, target) => { for (const f of [target, ...alive().filter(x => x !== target)].filter(Boolean).slice(0, Math.round(a?.area ?? 1))) f.zone = { n: e.n, left: a?.rounds ?? 1, by: who }; },
          zoneHeal: (who, e, a) => { for (const t of [who, ...up().filter(x => x !== who).sort((x, y) => y.build.targeted - x.build.targeted)].slice(0, Math.round(a?.allies ?? 1))) t.zoneHeal = { dmg: e.dmg, left: a?.rounds ?? 1, by: who }; }
        });
        pc.st.dealt += r.damage;
        if (r.nova) { pc.st.novaDealt += r.damage; pc.st.novaTurns++; }
        for (const f of foes) if (!f.dead && f.damage >= f.pool) f.dead = true;
      } else {
        const f = o.npc; if (f.dead) continue;
        for (let s = 0; s < f.strikes; s++) {
          const targets = up(); if (!targets.length) break;
          const w = targets.map(p => p.build.targeted), sum = w.reduce((a, x) => a + x, 0); let x = R() * sum;
          const t = targets.find((p, k) => (x -= w[k]) < 0) ?? targets[0];
          const taunted = f.taunt && !f.taunt.by.down && t !== f.taunt.by ? f.taunt.n : 0;   // Champion's Challenge: Banes against anyone else
          t.damage += npcStrike(R, f, t, s + taunted, t.esc, pcs);   // At-will Banes on the 2nd and 3rd Strike
          if (t.damage >= t.build.pool && !t.down) { t.down = true; t.st.downs++; if (!firstDown) firstDown = round; }
        }
        f.taunt = null; f.vulnerable = 0;   // EoT effects end with its turn
        if (f.zone && f.zone.left <= 0) f.zone = null;
      }
    }
  }
  const health = pcs.reduce((s, p) => s + p.build.pool, 0), lost = pcs.reduce((s, p) => s + Math.max(0, Math.min(p.damage, p.build.pool) - p.startDamage), 0);
  return { rounds: round, won: !alive().length, lost: lost / health, downs: pcs.filter(p => p.down).length, firstDown, wipe: !up().length, downBy: pcs.map(p => p.down), pcs };
}

/**
 * Between two fights (minutes, not a Rest): a PC that is Down is brought back (it uses a Rally Point through an ally's Lay On Hands when an
 * ally has it, or heals what one Rally Point heals after an hour Unconscious); then every PC uses Rally Points (Steel Yourself, no AP limit
 * out of combat) while its damage is at least 3/4 of what one heals. Rally Points come back only with a Rest.
 */
export function between(pcs) {
  const healer = pcs.some(p => p.damage < p.build.pool && Object.values(p.build.actions).some(a => a.effects.some(e => e.effect.kind === "heal" && e.effect.who !== "self")));
  const use = p => { const rb = rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false), h0 = Math.min(p.damage, p.build.rallyHeal), h = Math.min(p.damage, p.build.rallyHeal + rb.n);
    p.damage -= h; p.rallyLeft--; p.st.rpBetween++; if (rb.by) pcs.find(x => x.build === rb.by.build && x.st === rb.by.st).st.mercyGiven += h - h0; };
  for (const p of pcs) {
    if (p.damage >= p.build.pool) {
      if (healer && p.rallyLeft > 0) use(p);
      else p.damage -= Math.min(p.damage, p.build.rallyHeal);
    }
    while (p.rallyLeft > 0 && p.damage >= 0.75 * (p.build.rallyHeal + rallyBonus(pcs.map(x => ({ ...x, down: false })), p, false).n)) use(p);
  }
}

/**
 * A day: the party (builds) through its fights, in order, with no Rest. Momentum (Lucas, 2026-10-29): +1 after each fight harder than easy
 * (more than CV 3/4 per PC); with Momentum a PC starts a fight with half its level in Escalation (rounded up), up to 2; a Rest resets it.
 * Returns { fights: [fight results], pcs, cleared }.
 */
export const MOMENTUM = { on: true, minCvPerPc: 0.75, startEsc: lv => Math.min(2, Math.ceil(lv / 2)) };
export function day(party, encounters, R, { momentum = MOMENTUM.on } = {}) {
  const pcs = party.map(pcState), out = [];
  let mom = 0;
  const cvOf = e => e.reduce((s, n) => s + (n.cv ?? TW.npcRoles[n.role]?.cv ?? 1), 0) / pcs.length;
  for (const [i, e] of encounters.entries()) {
    if (!pcs.some(p => p.damage < p.build.pool)) break;
    for (const p of pcs) { p.startEsc = momentum && mom > 0 ? MOMENTUM.startEsc(p.build.level) : 0; p.dailyOK = cvOf(e) >= 1.25 || i === encounters.length - 1; }   // a Daily is kept for a hard fight (or the last one)
    out.push(fight(pcs, e, R));
    out.at(-1).momentum = mom; out.at(-1).startEsc = pcs[0].startEsc;
    if (!out.at(-1).won) break;
    if (e.reduce((s, n) => s + (n.cv ?? TW.npcRoles[n.role]?.cv ?? 1), 0) / pcs.length > MOMENTUM.minCvPerPc) mom++;
    between(pcs);
  }
  return { fights: out, pcs, cleared: out.length === encounters.length && out.every(f => f.won) };
}

/* ------------------------------------------------------------------ the report */
export function report({ builds, fights }) {
  const L = [];
  const lv = fights.level;
  L.push(`# The ruler: class builds and fights (level ${lv})`, "", "Written by `node book/ruler/spec.mjs` from `book/ruler/classes/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.", "");
  for (const b of builds) {
    L.push(`## ${b.name} (${b.role || "no role"}), \`${b.file}\``, "");
    L.push(`Health ${b.pool} (Body ${b.bodyHealth} + Mind ${b.mindHealth}) · AD ${b.ad} · WD ${b.wd} · Weapon Modifier +${b.weaponMod} · Power Modifier +${b.powerMod} · Rally Points ${b.rallyPoints} (each heals ${b.rallyHeal}) · targeted ×${b.targeted}`, "");
    L.push(`**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]} among the valid turns):`, "");
    L.push(`| Turn | Esc | ${fights.defenses.map(d => `Def ${d}`).join(" | ")} | Def ${fights.defenses[Math.floor(fights.defenses.length / 2)]}, Esc 3 | AP | Strikes | Steps | Problems |`, `|---|---:|${fights.defenses.map(() => "---:").join("|")}|---:|---:|---:|---|---|`);
    const mid = Math.floor(fights.defenses.length / 2);
    const rows = Object.entries(b.turns).map(([k, t]) => {
      const esc = Math.min(3, t.steps.map(stepOf).filter(x => x.kind === "action").reduce((s2, x) => s2 + b.actions[x.name].escalation, 0));   // the Escalation the turn spends
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
    L.push("**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):", "", "| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |", "|---|---:|---:|---:|---:|---:|---:|");
    for (const role of ["minion", "grunt", "standard", "elite"]) {
      const npc = npcOf(role, "medium", lv), R = rng(11), kill = [], down = [];
      for (let k = 0; k < 2000; k++) {
        const f = { ...npc, damage: 0 }, pc = { build: b, quarry: f }; let r = 0;
        pc.esc = 0;
        while (f.damage < f.pool && r < 30) { r++; if (r > 1) pc.esc = Math.min(3, pc.esc + 1); pc.firstThisRound = new Set(); runTurn(pc, b.turns[turnFor(pc, r)], { R, escalation: pc.esc, target: () => f, others: () => [] }); f.vulnerable = 0; }
        kill.push(r);
        const me = { build: b }; let dmg = 0, rr = 0;
        while (dmg < b.pool && rr < 60) { rr++; for (let s = 0; s < npc.strikes; s++) dmg += npcStrike(R, npc, me, s, Math.min(3, rr - 1)); }
        down.push(rr);
      }
      const cap = (a, max) => (median(a) >= max ? `${max}+ / -` : `${median(a)} / ${fmt(mean(a))}`);
      L.push(`| ${npc.name} | ${npc.pool} | ${npc.ad} | ${npc.mod} | ${fmt(npcTurn(npc, b))} | ${cap(kill, 30)} | ${cap(down, 60)} |`);
    }
    L.push("");
  }
  // Party fights.
  const fileOf = b => b.file.replace(/^classes\//, "").replace(/\.txt$/, "");
  const party = fights.party.map(n => builds.find(b => fileOf(b) === n) ?? builds.find(b => b.name.toLowerCase() === n.toLowerCase() && b.level === lv) ?? (() => { throw new Error(`fights.txt: the party names "${n}", and no class file has that name, or that class at level ${lv}`); })());
  L.push(`## Party fights (${party.map(b => b.name).join(", ")}; ${fights.runs} runs each)`, "");
  L.push("The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.", "");
  L.push(`| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | ${party.map(b => `${b.name} Down`).join(" | ")} |`, `|---|---:|---:|---:|---:|---:|---:|${party.map(() => "---:").join("|")}|`);
  for (const e of fights.encounters) {
    const R = rng(29), npcs = e.npcs.map(n => npcOf(n.role, n.rating, lv)), res = [];
    for (let k = 0; k < fights.runs; k++) res.push(fight(party, npcs, R));
    const rounds = res.map(r => r.rounds), sorted = [...rounds].sort((x, y) => x - y), firsts = res.filter(r => r.firstDown).map(r => r.firstDown);
    const cv = e.npcs.reduce((s, n) => s + (TW.npcRoles[n.role]?.cv ?? 1), 0);
    L.push(`| ${e.name} | ${cv} | ${median(rounds)} / ${fmt(mean(rounds))} / ${sorted[Math.floor(sorted.length * 0.9)]} | ${pct(mean(res.map(r => (r.won ? 1 : 0))))} | ${pct(mean(res.map(r => r.lost)))} | ${pct(mean(res.map(r => (r.downs ? 1 : 0))))} | ${firsts.length ? median(firsts) : "-"} | ${party.map((b, i) => pct(mean(res.map(r => (r.downBy[i] ? 1 : 0))))).join(" | ")} |`);
  }
  L.push("", "How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody moves, uses Rally Points on their own or uses Reactions. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).", "");
  // Adventuring days: the fights between two Rests, one after another.
  if (fights.days.length && fights.dayParties.length) {
    const byFile = n => builds.find(b => b.file.replace(/^classes\//, "").replace(/\.txt$/, "") === n) ?? (() => { throw new Error(`fights.txt: day-party names "${n}", which is not a file in classes/`); })();
    L.push(`## Adventuring days (${fights.dayRuns} days each)`, "",
      "The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.", "",
      "Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.", "");
    for (const d of fights.days) {
      const cv = d.fights.map(f => f.reduce((s, n) => s + (TW.npcRoles[n.role]?.cv ?? 1), 0));
      L.push(`### ${d.name}`, "", d.text.map((t, i) => `Fight ${i + 1}: ${t} (CV ${cv[i]})`).join(" · "), "");
      for (const dp of fights.dayParties) {
        const party = dp.files.map(byFile), R = rng(41), days = [], encs = d.fights.map(f => f.map(n => npcOf(n.role, n.rating, party[0].level)));   // the NPCs of the party's level
        for (let k = 0; k < fights.dayRuns; k++) days.push(day(party, encs, R));
        const pool = party.reduce((s, b) => s + b.pool, 0), rp = party.reduce((s, b) => s + b.rallyPoints, 0);
        L.push(`**${dp.name}** (${dp.files.join(", ")}; NPCs of level ${party[0].level}): the day cleared ${pct(mean(days.map(x => (x.cleared ? 1 : 0))))} · a PC Down during the day ${pct(mean(days.map(x => (x.pcs.some(p => p.st.downs) ? 1 : 0))))} · Downs a day ${fmt(mean(days.map(x => x.pcs.reduce((s, p) => s + p.st.downs, 0))), 2)} · Rally Points left at the end ${pct(mean(days.map(x => x.pcs.reduce((s, p) => s + p.rallyLeft, 0) / rp)))} · Health at the end ${pct(mean(days.map(x => 1 - x.pcs.reduce((s, p) => s + Math.min(p.damage, p.build.pool), 0) / pool)))}`, "");
        L.push("| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |", "|---|---:|---:|---:|---:|");
        d.fights.forEach((f, i) => { const r = days.map(x => x.fights[i]).filter(Boolean); L.push(`| ${i + 1}: ${d.text[i]} | ${pct(mean(r.map(x => (x.won ? 1 : 0))))} | ${fmt(mean(r.map(x => x.rounds)))} | ${pct(mean(r.map(x => x.lost)))} | ${pct(mean(r.map(x => (x.firstDown ? 1 : 0))))} |`); });
        L.push("");
        // One row per build (the PCs of the same file averaged), each number for one PC over the whole day.
        const files = [...new Set(dp.files)];
        L.push(`| Per PC, over the day | ${files.map(f => `${byFile(f).name} \`${f}\``).join(" | ")} |`, `|---|${files.map(() => "---:").join("|")}|`);
        const col = (fn, dg = 1) => files.map(f => { const idx = dp.files.map((x, i) => (x === f ? i : -1)).filter(i => i >= 0); return fmt(mean(days.flatMap(x => idx.map(i => fn(x.pcs[i], x)))), dg); });
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
  const dir = HERE + "classes/";
  const builds = fs.readdirSync(dir).filter(f => f.endsWith(".txt")).sort().map(f => parseSpec(fs.readFileSync(dir + f, "utf8"), `classes/${f}`));
  const fights = parseFights(fs.readFileSync(HERE + "fights.txt", "utf8"));
  if (process.argv.includes("--check")) {   // the Monte Carlo against the exact dice math (calc.mjs): one Weapon Attack of each build (no passives), every Defense
    let bad = 0;
    for (const b of builds) for (const d of fights.defenses) {
      const p = C.tierProbs(b.weaponMod, d), w = [0, 1, 2].map(t => weaponTier(b.weapon, t + 1)), avg = x => x.flat + x.dice.reduce((s, [c, n]) => s + c * (n + 1) / 2, 0);
      const exact = p[1] * (avg(w[1]) + b.weaponMod) + p[2] * (avg(w[2]) + b.weaponMod);
      const sim = turnDamage({ ...b, passives: [], turns: { one: { name: "one", steps: ["Weapon Attack"] } } }, "one", d, { n: 200000 }).avg;
      const ok = Math.abs(sim - exact) < 0.1; if (!ok) bad++;
      console.log(`${ok ? "ok  " : "FAIL"} ${b.file} Weapon Attack vs ${d}: exact ${exact.toFixed(2)}, simulated ${sim.toFixed(2)}`);
    }
    process.exit(bad ? 1 : 0);
  }
  const text = report({ builds, fights });
  fs.writeFileSync(HERE + "report.md", text);
  if (!process.argv.includes("--quiet")) console.log(text);
}
