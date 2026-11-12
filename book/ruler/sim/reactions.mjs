// 2026-11-12 (Lucas: "Run a sim" on Opportunity Attack out of the Basic Actions; "I want a sim of this as well" on how easily Reactions trigger).
// Two measurements of today's game, nothing in the book. Writes book/ruler/reactions.md.   node book/ruler/sim/reactions.mjs   (--quick for a draft)
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
const S = await import(new URL("../spec.mjs", import.meta.url).href);
const RULER = fileURLToPath(new URL("../", import.meta.url)), QUICK = process.argv.includes("--quick"), RUNS = QUICK ? 120 : 400;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), pc = x => `${Math.round(x * 100)}%`;
const t0 = Date.now(), log = s => process.stderr.write(`${s} (${Math.round((Date.now() - t0) / 1000)} s)\n`);
Object.assign(S.RULES, S.RULES_R);
const fights = S.parseFights(fs.readFileSync(RULER + "fights.txt", "utf8"));
const party = fights.party.map(f => S.parseSpec(fs.readFileSync(`${RULER}rework/${f}.txt`, "utf8"), `rework/${f}`));
const enc = n => fights.encounters.find(e => e.name.startsWith(n));
const npcs = e => e.npcs.map(n => S.npcOf(n.role, n.rating, fights.level, n));
const P = S.POLICIES, N = S.NPC_POLICIES;
/** who: which PCs keep the Opportunity Attack ("all", "melee", "none"); npcOa: whether the enemies have it. */
const run = (e, { map = "open", policy = P.plan, npcPolicy = N.plan, who = "all", npcOa = true, logs = true, n = RUNS } = {}) => {
  const M = { ...S.MAP, grid: S.MP.loadMap(map) }, R = S.rng(41), res = [], keep = S.RULES.npcOa; S.RULES.npcOa = npcOa;
  for (let k = 0; k < n; k++) { const pcs = party.map(S.pcState); for (const p of pcs) p.noOa = who === "none" || (who === "melee" && (p.build.weapon?.traits ?? []).includes("ranged")) || p.noOa; res.push(S.fight(pcs, npcs(e), R, { map: M, policy, npcPolicy, log: logs })); }
  S.RULES.npcOa = keep; return res;
};
const cell = r => `${f1(mean(r.map(x => x.rounds)))} · ${pc(mean(r.map(x => x.lost)))} · ${pc(mean(r.map(x => (x.downs ? 1 : 0))))} · ${pc(mean(r.map(x => (x.won ? 1 : 0))))}`;
const shares = r => { const t = party.map((_, i) => mean(r.map(x => x.pcs[i].st.taken))), tot = t.reduce((s, x) => s + x, 0) || 1; return t.map(x => pc(x / tot)).join(" / "); };
const downs = r => party.map((_, i) => pc(mean(r.map(x => (x.pcs[i].down ? 1 : 0))))).join(" / ");
const oas = r => { const n = side => mean(r.map(x => x.log.filter(ev => ev.type === "reaction" && ev.reaction === "Opportunity Attack" && /^(Paladin|Archer)/.test(ev.who) === side).length)); return `${f2(n(true))} / ${f2(n(false))}`; };
const names = party.map(b => b.name);
const VAR = [["Today: everyone has it", { who: "all", npcOa: true }], ["Nobody has it", { who: "none", npcOa: false }], ["Only the Paladins have it (a class Reaction); the enemies don't", { who: "melee", npcOa: false }], ["The Paladins and the enemies have it; the Archers don't", { who: "melee", npcOa: true }]];

const L = ["# Reactions: how often they trigger, and the game without the basic Opportunity Attack", "", "Written by `node book/ruler/sim/reactions.mjs`; don't edit, run it again. **Nothing here is in the book**: two measurements for Lucas (2026-11-12).", "",
  `Runs: ${RUNS} fights a cell${QUICK ? " (--quick: a draft)" : ""}; two cells differ for real when they are more than about ${QUICK ? 7 : 4} points apart. The party: fights.txt's four R builds, level 1, today's rules and Bestiary. The PCs in order: ${names.join(" / ")}.`, ""];

// 1. How often each Reaction fires.
L.push("## 1. How often each Reaction fires (today's rules)", "", "A PC has 1 Reaction AP a round. **Fires a round:** the Reaction's uses over the rounds its owner was up. **Rounds with a Reaction:** the share of the owner's rounds in which it used its Reaction AP on anything. The plan policy keeps the Reaction AP for the class Reaction; \"react to the first trigger\" spends it on whatever comes first.", "");
for (const [pn, pol] of [["the plan", P.plan], ["react to the first trigger", P.reactFirst]]) {
  L.push(`**The party plays: ${pn}**`, "", "| Fight | PC | Reaction | Fires a round | Rounds with a Reaction | NPC Opportunity Attacks on it a fight |", "|---|---|---|---:|---:|---:|");
  for (const en of ["4 Standards", "6 Standards", "Elite + 2 Standards"]) { const e = enc(en); if (!e) continue; const r = run(e, { policy: pol, logs: true });
    party.forEach((b, i) => { const by = {}, rounds = r.reduce((s, x) => s + x.pcs[i].st.rounds, 0); let any = 0;
      for (const x of r) { const seen = new Set(), nm = `${b.name} ${i + 1}`;
        for (const ev of x.log) if (ev.type === "reaction" && ev.who === nm) { by[ev.reaction] = (by[ev.reaction] ?? 0) + 1; seen.add(ev.round); }
        any += seen.size; }
      const list = Object.entries(by).sort((a, c) => c[1] - a[1]);
      L.push(`| ${e.name} | ${b.name} | ${list.map(([k, v]) => `${k}: ${f2(v / rounds)}`).join("; ") || "none"} | ${f2(list.reduce((s, [, v]) => s + v, 0) / rounds)} | ${pc(any / rounds)} | ${f2(mean(r.map(x => x.pcs[i].st.oaTaken ?? 0)))} |`); });
    log(`1. ${pn}, ${en}`); }
  L.push("");
}

// 2. Without the basic Opportunity Attack.
L.push("## 2. Without the basic Opportunity Attack", "", "Each fight cell: rounds · Health lost · a PC Down · won. **Damage taken:** each PC's share of the damage the party took (even = 25% each). **Down:** how often each PC went Down. **OAs:** Opportunity Attacks a fight, the PCs' / the enemies'.", "");
for (const map of ["open", "pillars"]) for (const en of ["4 Standards", "6 Standards"]) { const e = enc(en);
  L.push(`**${e.name}, ${map === "open" ? "the open field" : "the pillars"}; the party plays the plan**`, "", "| Rule | The enemies | The fight | Damage taken | Down | OAs |", "|---|---|---|---|---|---|");
  for (const [vn, v] of VAR) for (const [nn, np] of [["spread their attacks (the plan)", N.plan], ["go for the nearest PC", N.nearest], ["go for the back line", N.back]]) { const r = run(e, { map, npcPolicy: np, ...v }); L.push(`| ${vn} | ${nn} | ${cell(r)} | ${shares(r)} | ${downs(r)} | ${oas(r)} |`); }
  L.push(""); log(`2. ${en}, ${map}`); }
L.push("**How the party plays** (6 Standards, the open field):", "", "| Rule | The party | The enemies | The fight | Damage taken | Down | OAs |", "|---|---|---|---|---|---|---|");
for (const [vn, v] of VAR.slice(0, 3)) for (const [pn, pol] of [["holds the line", P.hold], ["kites", P.kite], ["tactical (hold + kite + protect)", P.tactical]]) for (const [nn, np] of [["the plan", N.plan], ["the back line", N.back]]) { const r = run(e6(), { policy: pol, npcPolicy: np, ...v }); L.push(`| ${vn} | ${pn} | ${nn} | ${cell(r)} | ${shares(r)} | ${downs(r)} | ${oas(r)} |`); }
function e6() { return enc("6 Standards"); }
log("2. policies");
L.push("", `(${f1((Date.now() - t0) / 60000)} minutes.)`, "");
fs.writeFileSync(RULER + "reactions.md", L.join("\n"));
