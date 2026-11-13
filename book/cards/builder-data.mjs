// The Action Builder's data block (2026-11-13): everything the page prices with, read from the real files, so that one command refreshes it when
// pcbudget.mjs or the Bestiary is measured again.   node book/cards/builder/build.mjs   (it calls collect() below and writes builder/data.json and the page)
// Read: book/ruler/pc-budget.md (the PC budget's tables), book/ruler/areas.md (Areas on the grid), book/cards/README.md (the rider sizes' prices),
// book/rules-src/15-gear.md (the weapon tables), book/ruler/rework/*.txt (the builds' weapon and Modifiers), the system's config.mjs through the ruler
// (npcBudget, npcStage0, npcDefense, npcRoles), book/ruler/sim/budget.mjs (the price functions, as source), and the cards themselves (load.mjs).
// A tool for Lucas and Claude, not a rule of the book: nothing here writes to a rule, a card or a report.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCards, hasVersions } from "./load.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url)), BOOK = path.join(HERE, ".."), ROOT = path.join(BOOK, "..");
const rd = (...p) => fs.readFileSync(path.join(...p), "utf8");
const num = s => { const m = String(s).replace(/[−–]/g, "-").match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : null; };
const pair = s => String(s).split("·").map(num);

/** Every table of a Markdown text under the heading that matches `re` (up to the next heading of the same or a higher level): rows of cells. */
function tables(text, re) {
  const lines = text.split(/\r?\n/), i0 = lines.findIndex(l => /^#+ /.test(l) && re.test(l));
  if (i0 < 0) throw new Error(`no heading ${re}`);
  const lvl = lines[i0].match(/^#+/)[0].length, out = []; let cur = null;
  for (let i = i0 + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#+ /.test(l) && l.match(/^#+/)[0].length <= lvl) break;
    if (/^\|/.test(l)) { if (/^\|[\s:|-]+\|$/.test(l)) continue; (cur ??= (out.push([]), out[out.length - 1])).push(l.replace(/\\\|/g, "\u0001").split("|").slice(1, -1).map(c => c.replace(/\u0001/g, "|").replace(/\*\*/g, "").trim())); }
    else cur = null;
  }
  return out.map(t => t.slice(1));   // without the header row
}

/* ---------------------------------------------------------------- the PC budget */
// A rider's size on a PC's card (book/cards/README.md, "The PC budget", the riders table) and its line for the ruler. eliteUp: against an Elite it is one
// size more (it takes AP or its aim). The measured numbers come from pc-budget.md section 3 by name; a Push is "price it as Mild" (the guide's maps paragraph).
const PC_RIDERS = [
  ["Hindered (EoT)", "mild", "debuff Hindered (EoT)"], ["Immobilized (EoT)", "mild", "debuff Immobilized (EoT)"], ["Immobilized (until it escapes)", "mild", "debuff Immobilized"],
  ["Taunted (by you)", "mild", "taunt 1"], ["Frightened (EoT)", "mild", "debuff Frightened (EoT)"], ["Vulnerable 1", "mild", "vulnerable 1"],
  ["Bleed 1d4", "mild", "debuff Bleed 1d4"], ["Bleed 1d6", "mild", "debuff Bleed 1d6"],
  ["Vulnerable 2", "moderate", "vulnerable 2"], ["Slowed 1", "moderate", "debuff Slowed 1", true], ["Prone", "moderate", "debuff Prone", true],
  ["Dazed 1", "severe", "debuff Dazed 1", true], ["Blinded (EoT)", "severe", "debuff Blinded (EoT)", true],
  ["Slowed 2", "extreme", "debuff Slowed 2", true],
  ["Pushed 1", "mild", "push 1"], ["Pushed 2", "mild", "push 2"], ["Pushed 3", "mild", "push 3"], ["Pulled 1", "mild", "pull 1"], ["Pulled 2", "mild", "pull 2"], ["Slid 1", "mild", "slide 1"], ["Slid 2", "mild", "slide 2"]
];
// The Bestiary's riders (book/rules-src/14-bestiary.md, "Riders and their price"): the size is the book's table; the prices are config.mjs npcBudget.riders.
const NPC_RIDERS = [
  ["Pushed 1", "forced"], ["Pulled 1", "forced"], ["Slid 1", "forced"],
  ["Hindered (EoT)", "mild"], ["Taunted (1 round)", "mild"], ["Staggered (EoT)", "mild"], ["Frightened (EoT)", "mild"], ["1 Pressure Bane on its next roll", "mild"], ["Doomed on its next roll", "mild"], ["Sickened 1", "mild"], ["Bright light on it", "mild"],
  ["Slowed 1", "moderate"], ["Dazed 1", "moderate"], ["Blinded (EoT)", "moderate"], ["Vulnerable 1 (EoT)", "moderate"], ["Vulnerable 2 (EoT)", "moderate"], ["Immobilized (EoT)", "moderate"], ["Immobilized (until it escapes)", "moderate"], ["Grabbed", "moderate"], ["Pushed 2", "moderate"], ["Pulled 2", "moderate"], ["Slid 2", "moderate"],
  ["Prone", "severe"], ["Bleed 1", "severe"], ["Pushed 3", "severe"],
  ["Slowed 2", "extreme"], ["Dazed 2", "extreme"], ["Bleed 2", "extreme"], ["Bleed 1d4", "extreme"],
  ["Bleed 1d6", "beyond1"], ["Bleed 2d6", "beyond2"]
];

function pcBudget() {
  const md = rd(BOOK, "ruler", "pc-budget.md"), guide = rd(HERE, "README.md");
  const [seatT, exchT] = tables(md, /^## 1\./), seats = {};
  for (const r of seatT) { const k = /^melee/.test(r[0]) ? "melee" : "ranged", [a, b] = r[1].split("/").map(num); seats[k] = { label: r[0], wa: [a, b], health100: num(r[3]), dealt: num(r[4]) }; }
  const exchange = exchT.map(r => ({ fight: r[0], key: /normal/.test(r[0]) ? "normal" : /hard/.test(r[0]) ? "hard" : "deadly", healthSaved: num(r[1]), dmgPerHealth: num(r[2]), healTurn: num(r[4]), shieldTurn: num(r[5]) }));
  const classes = tables(md, /^### What a class is worth today/)[0].map(r => ({ build: r[0], seat: r[1], levels: [num(r[2]), num(r[3]), num(r[4])] }));
  const shapes = tables(md, /^## 2\./)[0].map(r => ({ turn: r[0], used: num(r[1]), melee: num(r[2]), ranged: num(r[3]) }));
  const measured = Object.fromEntries(tables(md, /^## 3\./)[0].map(r => [r[0], { melee: num(r[1]), ranged: num(r[2]), elite: num(r[3]), lands: num(r[4]) }]));
  const price = Object.fromEntries(["Mild", "Moderate", "Severe", "Extreme"].map(s => { const m = guide.match(new RegExp(`\\| \\*\\*${s}\\*\\* \\| (\\d+) \\|`)); if (!m) throw new Error(`README: no price for ${s}`); return [s.toLowerCase(), Number(m[1])]; }));
  const riders = PC_RIDERS.map(([name, size, ruler, eliteUp]) => ({ name, size, ruler, eliteUp: !!eliteUp, measured: measured[name] ?? null }));
  for (const k of Object.keys(measured)) if (!riders.some(r => r.name === k)) console.warn(`builder-data: pc-budget.md measures "${k}", which has no size in PC_RIDERS`);
  const reactions = tables(md, /^## 4\./)[0].map(r => ({ name: r[0].replace(/ \(.*$/, ""), what: r[0], seat: r[1], fires: num(r[2]) / 100, adds: num(r[3]) }));
  const helps = tables(md, /^## 5\./)[0].map(r => ({ what: r[0], worth: num(r[1]) }));
  const ledger = tables(md, /^## 6\./)[0].map(r => ({ build: r[0], action: r[1], ap: num(r[2]), freq: r[3], points: num(r[4]), and: r[6] }));
  const areas = []; for (const r of tables(md, /^## 8\./)[0]) { const m = r[0].match(/^(\d+) (Burst|Emanation)/); if (!areas.some(a => a.label === r[0])) areas.push({ label: r[0], size: Number(m[1]), shape: m[2], from: /around you/.test(r[0]) ? "self" : "range", hit: pair(r[3]), source: "pc-budget.md section 8" }); }
  const maps = tables(md, /^## 9\./)[0].map(r => ({ what: r[0], seat: r[1], open: num(r[2]), pillars: num(r[3]), corridor: num(r[4]) }));
  // The guide's own round numbers (book/cards/README.md, "The PC budget"): read from its text so a new measure that changes them is seen here.
  const gm = guide.match(/1 Health of new healing is about (\d+) points and 1 point of Guard about (\d+)/); if (!gm) throw new Error("README: the price of Health and Guard");
  const tm = guide.match(/with about (\d+) at level 1 and (\d+) at level 2/), cm = guide.match(/A class is worth about (\d+)/);
  const rx = guide.match(/A 1R Reaction should add about (\d+) to (\d+) points/);
  const heal = helps.find(h => /heals 1d8/.test(h.what)), normal = exchange.find(e => e.key === "normal");
  const sof = reactions.find(r => /^Shield of Faith/.test(r.name)), ow = reactions.find(r => /^Overwatch/.test(r.name));
  return {
    wa: 25, turn: 100, refDefense: 13, ap: { 1: 25, 2: 50, 3: 75 }, encounter: 2, felt: 10,
    classTarget: [Number(tm[1]), Number(tm[2]), Number(cm[1])], reactionBand: [Number(rx[1]), Number(rx[2])],
    health: Number(gm[1]), guard: Number(gm[2]), defense1: helps.find(h => /\+1 Defense/.test(h.what)).worth, rallyHeal: helps.find(h => /Rally Points/.test(h.what)).worth, unusedAp: helps.find(h => /^nothing/.test(h.what)).worth,
    // A heal's price by the size of the fight: the guide's price is the normal fight's; a hard or deadly fight scales it by what the same 1 AP heal measured there (section 1).
    fights: exchange.map(e => ({ key: e.key, label: e.fight, dmgPerHealth: e.dmgPerHealth, healFactor: (e.healTurn - 75) / (normal.healTurn - 75) })),
    // A Reaction's damage counts less than the same damage on a turn (Overwatch: a Weapon Attack, 25 points, in 85% of rounds, adds 10): the measured share.
    reactionDamage: ow.adds / (25 * ow.fires),
    // A point of damage blocked by a Reaction (Shield of Faith: 2d6 + 2 = 9 in 82% of rounds adds 66).
    blockPoint: sof.adds / (9 * sof.fires),
    areaShare: { range: 0.5, self: 2 / 3 },
    riderPrice: price, riders, seats, exchange, classes, shapes, reactions, helps, ledger, areas, maps
  };
}

/* ---------------------------------------------------------------- Areas on the grid (areas.md) */
function areasGrid() {
  const md = rd(BOOK, "ruler", "areas.md"), [cards] = tables(md, /^# Areas and Zones/), by = {};
  for (const r of cards) { const m = r[1].match(/^(\d+) (Emanation|Burst)[,;]? ?(.*?);/) ?? r[1].match(/^(\d+) (Emanation|Burst), (.*)$/); by[r[0]] = { card: r[0], size: Number(m[1]), shape: m[2], from: /around you/.test(r[1]) ? "self" : "range", where: r[1], rulerLine: r[2] }; }
  const [t4, t6] = tables(md, /^## 2\./);
  for (const [t, k] of [[t4, 0], [t6, 1]]) for (const r of t) { const a = by[r[0]]; if (!a) continue; (a.hit ??= [null, null])[k] = num(r[1].split("·")[0]); }   // the open field's column: enemies in it when it is placed
  return Object.values(by).filter(a => a.hit && a.hit[0] != null).map(a => ({ ...a, source: "areas.md section 2 (open field)" }));
}

/* ---------------------------------------------------------------- weapons and the builds */
function weapons() {
  const out = [];
  for (const l of rd(BOOK, "rules-src", "15-gear.md").split(/\r?\n/)) {
    const m = l.match(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \| (\w+) \| ([^|]+) \| \[V\] ([^|]+) \| \d+ \|$/);
    if (m) out.push({ name: m[1].trim(), group: m[2].trim(), props: m[3].trim(), type: m[4], range: m[5].trim(), tiers: m[6].split(" / ").map(s => s.trim()), ranged: /Ranged/.test(m[3]) });
  }
  if (!out.length) throw new Error("15-gear.md: no weapon rows read");
  return out;
}
function builds() {
  const dir = path.join(BOOK, "ruler", "rework");
  return fs.readdirSync(dir).filter(f => f.endsWith(".txt")).sort().map(f => { const t = rd(dir, f), g = re => t.match(re)?.[1]; return { file: f.replace(/\.txt$/, ""), name: g(/^class (.+)$/m), weapon: g(/^weapon ([^(:]+)/m).trim(), wmod: Number(g(/^weapon-mod (\d+)/m)), pmod: Number(g(/^power-mod (\d+)/m)), seat: /^weapon [^:]*ranged/m.test(t) ? "ranged" : "melee" }; });
}

/* ---------------------------------------------------------------- the Bestiary's turn budget */
async function npc() {
  const B = await import(new URL("../ruler/sim/budget.mjs", import.meta.url).href), { TW } = await import(new URL("../ruler/sim/core.mjs", import.meta.url).href);
  const P = B.PRICES(), ranks = ["minion", "grunt", "standard", "elite"], ratings = ["terrible", "low", "medium", "high", "extreme"];
  const price = sev => sev === "beyond1" ? P.riders.extreme + P.riders.step : sev === "beyond2" ? 40 : P.riders[sev];   // Bleed 2d6: the book's 40
  return {
    budget: P, stage0: TW.npcStage0, defense: TW.npcDefense, ratings, ranks, rangedStep: TW.npcRangedStep, vsBase: TW.vsBase,
    rank: Object.fromEntries(ranks.map(r => [r, { label: TW.npcRoles[r].label, modBy: TW.npcRoles[r].modBy, attr: TW.npcRoles[r].attr, ap: TW.npcStage0[r].ap ?? TW.npcRoles[r].ap, reactionAp: TW.npcStage0[r].reactionAp ?? TW.reactionAp, cv: TW.npcRoles[r].cv[0], explodes: r === "standard" || r === "elite" }])),
    riders: NPC_RIDERS.map(([name, sev]) => ({ name, sev, price: price(sev) })),
    // The ruler's own price functions, as source: the page runs these, not a second version (book/ruler/sim/budget.mjs).
    fn: { expr: B.expr.toString(), pointsAvg: B.pointsAvg.toString(), riderPrice: B.riderPrice.toString(), actionPoints: B.actionPoints.toString(), turnBudget: B.turnBudget.toString() }
  };
}

/* ---------------------------------------------------------------- the cards */
const KEEP = ["name", "category", "level", "flavor", "traits", "frequency", "escalation", "target", "area", "distance", "vs", "requirements", "setup", "interrupt", "trigger", "npc"];
function cards() {
  const skip = new Set(["talents.json", "placeholders.json"]);
  return loadCards().filter(c => hasVersions(c) && !skip.has(c._file)).map(c => ({ ...Object.fromEntries(KEEP.filter(k => c[k] != null).map(k => [k, c[k]])), file: c._file,
    versions: c.versions.map(v => ({ ap: v.ap, ...(v.tiers ? { tiers: v.tiers } : {}), ...(v.effects ? { effects: v.effects } : {}), ...(v.critical ? { critical: v.critical } : {}), ...(typeof v.ruler === "string" ? { ruler: v.ruler } : {}) })) }));
}

/** The whole data block. */
export async function collect() {
  return { generated: new Date().toISOString().slice(0, 10), stage: "Stage 0 (levels 1 to 3)", pc: pcBudget(), areasGrid: areasGrid(), weapons: weapons(), builds: builds(), npc: await npc(), cards: cards() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const d = await collect();
  fs.mkdirSync(path.join(HERE, "builder"), { recursive: true });
  fs.writeFileSync(path.join(HERE, "builder", "data.json"), JSON.stringify(d, null, 1) + "\n");
  console.log(`builder/data.json: ${d.cards.length} cards, ${d.weapons.length} weapons, ${d.pc.riders.length} PC riders, ${d.npc.riders.length} NPC riders, ${d.pc.areas.length + d.areasGrid.length} measured Areas`);
}
