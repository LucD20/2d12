// The Card Workbench's budget (Lucas, 2026-11-14): the card's text is read for the things Lucas listed, one at a time, and each adds its price.
// No DOM: the page and test.mjs both run it. Prices are in points of a PC's turn (a Weapon Attack 25, a plain turn 100; book/cards/README.md "The PC budget").
// To add a thing: one entry in READERS (what to look for, how it is priced, the note shown), its price in PRICES with where it was measured.
function makeBudget() {
  "use strict";
  /** Lucas's rates (2026-11-14: "I will rate those myself; keep your rate × my rate"). Where he has set one, the budget uses it; the SIM's stays beside it,
   *  shown on the page and kept here, so a big gap can be looked at later. null = not set yet (the SIM's is used). One entry per thing. */
  const RATES = {
    rallySpent: { lucas: null, sim: 0, simNote: "the target spends its own Rally Point: it moves Health it already had (the bare 1 AP measured −10 to −11, below an unused AP's +12 to +15)" },
    evadeMelee: { lucas: null, sim: [0, 0, 0], simNote: "a melee build: the SIM only steps away, and a melee PC never wants to (a step toward someone or out of a bad spot isn't measured)" },
    evadeRanged: { lucas: null, sim: [30, 30, 34], simNote: "a free Evade 1 / 2 / 3 once a round, 700 fights a level (book/ruler/sim/pcextra.mjs): the first square matters most (out of Engaged, no Doomed shot)" },
  };
  const rate = k => (RATES[k].lucas ?? RATES[k].sim), rateNote = (k, i) => { const r = RATES[k], pick = v => (Array.isArray(v) ? v[i] : v); return r.lucas == null ? `SIM: ${r.simNote} (your rate: not set)` : `your rate ${pick(r.lucas)} · the SIM's ${pick(r.sim)}`; };
  /** The prices, with where each number comes from. */
  const PRICES = {
    ap: 25,                 // an AP of a Round or At-will Action (a Weapon Attack)
    frequencyFactor: { "At-will": 1, Turn: 1, Round: 1, Encounter: 2, Daily: 2, "": 1 },   // pc-budget.md section 2: an Encounter Action is worth double its AP
    reaction: [10, 15],
    fires: 0.5,             // a Reaction fires in about half the rounds (the target, MASTER-PLAN item 5)     // a 1R Reaction adds 10 to 15 points a turn (README, "Reactions"); twice that for 2R
    passive: [5, 15],       // a Passive: the audit's guess (+10 a level), not measured
    band: 0.1,              // within limits: 10% either side (each 10 points over is felt)
    health: 12,             // 1 Health of new healing (pc-budget.md section 5; measured again 2026-11-14: 11, 700 fights)
    rallyHeal: 9,           // a Rally Point heals ⌈Health Pool ÷ 4⌉: 9 for the Paladin (35), 8 for the Archer (29); an NPC's is 9 at Stage 0
  };
  const BUILDS = [
    { name: "Paladin (Smite)", seat: "melee", wea: 2, pow: 1, body: 2, mind: 1, instinct: 0, appeal: 0 },
    { name: "Paladin (Lay On Hands)", seat: "melee", wea: 1, pow: 2, body: 2, mind: 1, instinct: 0, appeal: 0 },
    { name: "Archer (Double Shot)", seat: "ranged", wea: 2, pow: 1, body: 1, mind: 1, instinct: 2, appeal: 0 },
    { name: "Archer (Rolling Shot)", seat: "ranged", wea: 2, pow: 1, body: 1, mind: 1, instinct: 2, appeal: 0 },
  ];
  const NUM = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, twice: 2 }, num = s => NUM[String(s).toLowerCase()] ?? Number(s);
  const MODS = { pow: "pow", power: "pow", wea: "wea", weapon: "wea", body: "body", mind: "mind", appeal: "appeal", instinct: "instinct", mod: "pow" };

  /** "1d6 + pow", "2d8+3", "1d4", "9": its average with the build's Modifiers, and how it was read. null when it isn't one. */
  function amount(expr, b) {
    let total = 0, parts = [], ok = false;
    for (const raw of String(expr).split("+").map(x => x.trim()).filter(Boolean)) {
      let m;
      if ((m = raw.match(/^(\d*)d(\d+)!?$/i))) { const n = Number(m[1] || 1), y = Number(m[2]); total += n * (y + 1) / 2; parts.push(`${n}d${y} (${n * (y + 1) / 2})`); ok = true; }
      else if ((m = raw.match(/^\d+$/))) { total += Number(raw); parts.push(raw); ok = true; }
      else if ((m = raw.toLowerCase().replace(/^your\s+/, "").replace(/\s*modifier$/, "").replace(/^\[|\]$/g, "")) in MODS) { const k = MODS[m]; total += b[k]; parts.push(`${k} (${b[k] >= 0 ? "+" : ""}${b[k]})`); ok = true; }
      else return ok ? { avg: total, how: parts.join(" + ") } : null;   // stop at the first piece that isn't part of the amount
    }
    return ok ? { avg: total, how: parts.join(" + ") } : null;
  }
  // "your Power Modifier" and the like become one word, so "1d6 + your Power Modifier" reads as "1d6 + pow"
  const tidy = t => String(t ?? "").replace(/'/g, " ").replace(/your (Power|Weapon|Signature) Modifier/gi, (_, k) => (k.toLowerCase() === "weapon" ? "wea" : "pow")).replace(/\[Mod\]/g, "mod");

  /** The things read from the text. Each: a regex over the text, and a price for one match. */
  const READERS = [
    { key: "rally-free", re: /heals? (?:twice |three times )?what (\w+) Rally Points? (?:would )?heals?|(\w+) free Rally Points?/gi,
      read: (m, b, t) => { const mult = /twice/i.test(m[0]) ? 2 : /three times/i.test(m[0]) ? 3 : 1, n = num(m[1] ?? m[2]) * mult; return { what: `${n} Rally Point${n > 1 ? "s" : ""}' heal, not spent (${n * PRICES.rallyHeal} new Health)`, pts: n * PRICES.rallyHeal * PRICES.health, note: `${PRICES.rallyHeal} Health a Rally Point × ${PRICES.health} points a Health` }; } },
    { key: "rally", re: /(\w+) Rally Points?/gi, skipIf: /heals? (?:twice |three times )?what \w+ Rally Points?|\w+ free Rally Points?/i,
      read: (m) => { const n = num(m[1]); if (!Number.isFinite(n)) return null; return { what: `${n} Rally Point${n > 1 ? "s" : ""} the target spends`, pts: n * rate("rallySpent"), note: `${rateNote("rallySpent")}. For new Health write "heals what 1 Rally Point heals" or "1 free Rally Point".` }; } },
    { key: "evade", re: /Evade (\d+)/gi,
      read: (m, b) => { const n = Math.max(1, Number(m[1])), i = Math.min(3, n) - 1, k = b.seat === "melee" ? "evadeMelee" : "evadeRanged"; return { what: `Evade ${n} (${b.seat})`, pts: rate(k)[i], note: rateNote(k, i) }; } },
    { key: "heal", re: /heal(?:s|ing)?\s+(?:more\s+)?(\d*d\d+!?(?:\s*\+\s*(?:\d*d\d+!?|\d+|pow|wea|mod|body|mind|appeal|instinct)\b)*|\d+(?:\s*\+\s*(?:pow|wea|mod|body|mind|appeal|instinct)\b)*)/gi,
      read: (m, b) => { const a = amount(m[1], b); if (!a) return null; return { what: `healing ${m[1].trim()} = ${+a.avg.toFixed(1)} Health`, pts: a.avg * PRICES.health, note: `${a.how}; × ${PRICES.health} points a Health (new Health)` }; } },
  ];

  /** Every text of a Version (its Tiers, Critical, Effects) with where it is; a Passive's text when it has no Version. */
  function places(card, v) {
    if (!v) return [["Text", card.text]];
    return [["Tier 1", v.tiers[0]], ["Tier 2", v.tiers[1]], ["Tier 3", v.tiers[2]], ["Critical", v.critical], ["Effects", v.effects]];
  }
  /** What a Version is worth by the things read, and what it should cost. */
  function price(card, v, buildName) {
    const b = BUILDS.find(x => x.name === buildName) ?? BUILDS[0], items = [];
    for (const [where, raw] of places(card, v)) {
      const text = tidy(raw); if (!text.trim()) continue;
      for (const r of READERS) for (const m of text.matchAll(r.re)) {
        if (r.skipIf) { const around = text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 12); if (r.skipIf.test(around)) continue; }
        const it = r.read(m, b, text); if (it) items.push({ ...it, where, key: r.key });
      }
    }
    let total = items.reduce((s, x) => s + x.pts, 0), fires = null;
    if (card.rx && v) { fires = PRICES.fires; total *= fires; }   // a Reaction's items count each time it fires: about half the rounds (the target)
    let budget, band, label;
    if (!v) { band = PRICES.passive; budget = (band[0] + band[1]) / 2; label = "a Passive (a guess: about +10 a level)"; }
    else if (card.rx) { const k = (Number(v.ap) || 1) * (card.frequency === "Encounter" || card.frequency === "Daily" ? 2 : 1); band = PRICES.reaction.map(x => x * k); budget = (band[0] + band[1]) / 2; label = `a ${v.ap || 1}R Reaction, ${card.frequency || "no Frequency"}: what it adds a turn`; }
    else { const ap = Number(v.ap) || 0, f = PRICES.frequencyFactor[card.frequency] ?? 1; budget = ap * PRICES.ap * f; band = [budget * (1 - PRICES.band), budget * (1 + PRICES.band)]; label = `${ap} AP, ${card.frequency || "no Frequency"}${f > 1 ? ` (worth ×${f})` : ""}`; }
    const verdict = total > band[1] + 1e-9 ? "over" : total < band[0] - 1e-9 ? "under" : "on";
    return { items, total, budget, band, label, verdict, build: b, fires };
  }
  return { PRICES, RATES, BUILDS, READERS, amount, price, tidy };
}
if (typeof module !== "undefined") module.exports = { makeBudget };
