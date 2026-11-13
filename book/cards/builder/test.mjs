// Checks the Action Builder's numbers: node book/cards/builder/test.mjs   (prints "ok" lines; exits 1 on a failure)
// 1. the page's Tier chances are the system's calc.mjs (the same source, and the same numbers as the module itself);
// 2. a Weapon Attack prices at 25; Smite and Double Shot land where book/ruler/pc-budget.md's ledger puts them;
// 3. the Bestiary's prices are budget.mjs's (a Medium Standard: 25 / 28 / 55 / 110, its table's damage about its points).
import { engine } from "./build.mjs";
const { E, data } = await engine(), calc = await import(new URL("../../../foundry/twod12/module/calc.mjs", import.meta.url).href);
let bad = 0; const ok = (cond, text) => { console.log(`${cond ? "ok  " : "FAIL"} ${text}`); if (!cond) bad++; }, near = (a, b, tol) => Math.abs(a - b) <= tol, f1 = x => x.toFixed(1);

// 1. the dice
let worst = 0;
for (const mod of [0, 1, 2, 3, 4]) for (const dc of [10, 12, 13, 14, 16, 18]) for (const [b, n, st] of [[0, 0, ""], [1, 0, ""], [0, 2, ""], [0, 0, "favored"], [0, 0, "doomed"]]) {
  const a = E.probs({ mod, dc, boons: b, banes: n, state: st }), c = calc.tierProbs(mod, dc, b, n, st), k = calc.critProb(mod, dc, b, n, st);
  worst = Math.max(worst, ...a.p.map((x, i) => Math.abs(x - c[i])), Math.abs(a.crit - k));
}
ok(worst < 1e-12, `Tier and Critical chances equal calc.mjs's on 150 rolls (largest difference ${worst})`);
const p13 = E.probs({ mod: 2, dc: 13 }).p; ok(near(p13[0] + p13[1] + p13[2], 1, 1e-9), `2d12 + 2 against 13: ${p13.map(x => (x * 100).toFixed(1) + "%").join(" / ")}`);

// 2. the PC budget
const smiter = data.builds.find(b => /Smite/.test(b.name)), archer = data.builds.find(b => /Double/.test(b.name));
const pc = (b, card) => { const d = E.fromCard(data.cards.find(c => c.name === card), "pc"); Object.assign(d, { cls: b.name, weapon: b.weapon, wmod: b.wmod, pmod: b.pmod }); return d; };
const pts = (d, ap) => E.pricePc(d, d.versions.find(v => v.ap === ap)), led = (a) => data.pc.ledger.find(l => l.action === a).points;
const wa = pts(pc(smiter, "Weapon Attack"), 1); ok(near(wa.total, 25, 0.01), `a Weapon Attack (Greatsword): ${f1(wa.total)} points (25)`);
ok(near(wa.wa.avgs[1], data.pc.seats.melee.wa[0], 0.05) && near(wa.wa.avgs[2], data.pc.seats.melee.wa[1], 0.05), `its Tier 2 / Tier 3 averages ${wa.wa.avgs.slice(1).map(f1).join(" / ")} are pc-budget.md's ${data.pc.seats.melee.wa.join(" / ")}`);
const wx = pts(pc(archer, "Weapon Attack"), 1); ok(near(wx.total, 25, 0.01) && near(wx.wa.avgs[1], data.pc.seats.ranged.wa[0], 0.05), `a Weapon Attack (Crossbow): ${f1(wx.total)} points, ${wx.wa.avgs.slice(1).map(f1).join(" / ")}`);
for (const [ap, tol] of [[2, 2], [3, 3]]) { const s = pts(pc(smiter, "Smite"), ap), want = led(`Smite ${ap}`), dmg = s.lines.filter(l => !l.help).reduce((q, l) => q + l.pts, 0); ok(near(dmg, want, tol), `Smite ${ap}: ${f1(dmg)} damage points (pc-budget.md: ${want}); against ${s.budget}: ${s.verdict}`); }
for (const ap of [2, 3]) { const s = pts(pc(archer, "Double Shot"), ap), want = led(`Double Shot ${ap}`); ok(near(s.total, want, 1), `Double Shot ${ap}: ${f1(s.total)} points (pc-budget.md: ${want}) against ${s.budget}: ${s.verdict}`); }
for (const name of ["Smite", "Double Shot", "Holy Wrath"]) { const c = data.cards.find(x => x.name === name), b = name === "Double Shot" ? archer : smiter, st = E.cardStats(c, pc(b, "Weapon Attack")); for (const v of st) if (v.ledger.length) ok(v.ledger.some(x => near(v.points, x, 4)), `the comparison row prices ${name} ${v.ap} at ${f1(v.points)} (pc-budget.md: ${v.ledger.join(" or ")})`); }
const card = E.toCard(pc(smiter, "Smite")); ok(card.versions[1].tiers[1] === "[V] 1[W] + [Mod] + [R] 2d6 Ho", `Smite goes into the form and comes out as the card wrote it: ${card.versions[1].tiers[1]}`);

// 3. the Bestiary's turn budget
const B = await import(new URL("../../ruler/sim/budget.mjs", import.meta.url).href);
let same = true; for (const rank of data.npc.ranks) for (const rating of data.npc.ratings) for (const ap of [1, 2, 3]) for (const f of ["atwill", "round", "enc"]) if (E.actionPoints(rank, ap, f, rating) !== B.actionPoints(rank, ap, f, rating)) same = false;
ok(same, "an NPC Action's price equals budget.mjs's for every rank, rating, AP and Frequency");
ok([["atwill", 1, 25], ["round", 1, 27.5], ["round", 2, 55], ["enc", 2, 110], ["atwill", 3, 78.75]].every(([f, ap, w]) => near(E.actionPoints("standard", ap, f, "medium"), w, 1e-9)) && E.turnBudget("standard", "medium") === 100, "a Medium Standard: 25 / 28 / 55 / 110 / 79, turn budget 100");
ok(E.pointsExpr(25).join(" / ") === B.pointsExpr(25).join(" / ") && E.pointsExpr(55).join(" / ") === "4 + 1d6 / 8 + 1d8", `points into damage: 25 = ${E.pointsExpr(25).join(" / ")}, 55 = ${E.pointsExpr(55).join(" / ")}`);
const nd = E.blankDraft("npc"); Object.assign(nd, { basic: true, frequency: "At-will" }); const row = E.plainRow(nd); ok(near(row.points, 25, 3), `a Medium Standard's table Basic attack prices at ${f1(row.points)} points (25)`);
const orc = E.fromCard(data.cards.find(c => c.name === "Brutal Swing"), "npc"), o = E.priceNpc(orc, orc.versions.find(v => v.on)); ok(Math.abs(o.budget - 55) < 1e-9, `Brutal Swing (2 AP Round, a Medium Standard) should cost ${f1(o.budget)}; its written damage is ${f1(o.total)} points: ${o.verdict}`);
ok(E.npcRiderPrice("Prone", "hit").used === 12 && E.npcRiderPrice("Prone", "t3").used === 8 && E.npcRiderPrice("Hindered (EoT)", "setup").used === 8 && E.npcRiderPrice("Staggered (EoT)", "setup").used === 12 && E.npcRiderPrice("Pushed 1", "hit").used === 2, "riders: Prone 12 (Tier 3 only 8), a Mild one in the Setup 8, Staggered in the Setup 12, Forced Movement 1 2");
const txt = E.exportText(pc(smiter, "Smite")); ok(/"tiers"/.test(txt) && /within/.test(txt), `Copy for Claude writes the card and the numbers (${txt.length} characters)`);
console.log(bad ? `\n${bad} failed` : "\nall ok"); process.exit(bad ? 1 : 0);
