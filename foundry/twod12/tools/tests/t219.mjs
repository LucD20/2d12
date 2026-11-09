// Run with: node tools/tests/run.mjs (or node tools/tests/t219.mjs)
// v0.0.310 (Lucas's design, the "FAB · GM window" mockup): the Initiative windows. The pure model (initmodel.mjs) and HTML (initview.mjs) with the
// mockup's two encounters (9 enemies: stacks; 5 enemies: none), the GM's clicks, the players' window, the roll's pieces, Goes last's order,
// and the wiring (combat.mjs, the socket, the settings, the old window gone).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL);
const M = await import(ROOTURL + "module/initmodel.mjs"), V = await import(ROOTURL + "module/initview.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const call = { attr: "instinct" };
const fx0 = { boons: 0, banes: 0, fav: false, doom: false, favBy: [], doomBy: [], exh: 0, chips: [] };
const mk = o => ({ img: "", hidden: false, rolled: null, fx: { ...fx0 }, set: {}, pc: false, npc: true, disp: -1, ...o });
const gob = { body: 1, mind: 0, appeal: 0, instinct: 2 }, thug = { body: 2, mind: 0, appeal: 0, instinct: 1 };
const heroes = () => [
  mk({ id: "pal", name: "Paladin", pc: true, npc: false, owner: "Krysta", disp: 1, mods: { body: 1, mind: 2, appeal: 3, instinct: 0 }, set: { boons: 1 } }),
  mk({ id: "arc", name: "Archer", pc: true, npc: false, owner: "Dave", disp: 1, mods: { body: 0, mind: 1, appeal: 0, instinct: 3 }, set: { fav: true, who: "gm" } }),
  mk({ id: "grd", name: "Town Guard", ally: true, disp: 1, actorId: "G", mods: { body: 2, mind: 0, appeal: 1, instinct: 1 }, dying: "Dying", set: { last: true } })
];
const big = () => [...heroes(),
  mk({ id: "thg", name: "Bandit Thug", actorId: "T", mods: thug, fx: { ...fx0, exh: 1, chips: ["Exhausted 1: −1"] } }),
  ...[1, 2, 3, 4, 5, 6].map(i => mk({ id: `gob${i}`, name: `Goblin Minion ${i}`, base: "Goblin Minion", actorId: "GOB", mods: gob, fx: i === 4 ? { ...fx0, exh: 1, chips: ["Exhausted 1: −1"] } : { ...fx0 } })),
  mk({ id: "wsp", name: "Grave Wisp", actorId: "W", mods: { body: 0, mind: 3, appeal: 0, instinct: 2 }, set: { attr: "mind" } }),
  mk({ id: "ogr", name: "Ogre Chieftain", actorId: "O", mods: { body: 4, mind: 0, appeal: 1, instinct: 1 }, rolled: 15, rolledAttr: "instinct", rolledBy: "GM" }),
  mk({ id: "hid", name: "Lurking Shade", actorId: "H", disp: -2, hidden: true, mods: gob })
];
const small = () => [...heroes(), ...[1, 2, 3].map(i => mk({ id: `gob${i}`, name: `Goblin Minion ${i}`, base: "Goblin Minion", actorId: "GOB", mods: gob })), ...[1, 2].map(i => mk({ id: `thg${i}`, name: `Bandit Thug ${i}`, base: "Bandit Thug", actorId: "T", mods: thug }))];
const rowLine = r => `${r.member ? "  └ " : ""}${r.name}${r.stack ? ` [${r.stackLabel}]` : ""} | ${r.owner}${r.chips.length ? ` | ${r.chips.join(", ")}` : ""}${r.last ? " | Goes last" : ""} | who ${r.who}${r.liveNote ? ` (${r.liveNote})` : ""} | ${r.rolled ? `rolled ${r.result} ${r.rolledWith} ${r.rolledBy}` : `${r.attr || "·"}${r.overridden ? "*" : ""} fav ${r.fav} doom ${r.doom}${r.both ? " (both: a normal roll)" : ""} boons ${r.boons} banes ${r.banes}`} | ${r.tint}`;
const show = m => { console.log(m.sub); console.log(m.playersLine); for (const s of m.sides) { console.log(`== ${s.caret} ${s.name} (${s.tag}) ${s.count}`); for (const r of s.rows) console.log(rowLine(r)); }
  console.log(`GM rolls now: ${m.sumRoll}\nTheir player rolls: ${m.sumPlayer} · Wait: ${m.sumWait}\nKept: ${m.sumKept} · Goes last: ${m.sumLast}\n[${m.rollLabel}]`); };

console.log("--- 9 enemies (one hidden, Secret): stacks on");
let list = big();
show(M.gmModel(list, call));
console.log("--- the Goblin stack expanded, the Bandit Thug's side folded? (Enemies stays open), Heroes folded");
show(M.gmModel(list, call, { open: { "hostile|GOB": true }, closed: { friendly: true } }));
console.log("--- exactly 5 enemies: no stacks");
show(M.gmModel(small(), call));
console.log("6 enemies stack, 5 don't:", M.stacking([...small(), mk({ id: "x", name: "Extra", actorId: "X", mods: gob })]), M.stacking(small()), "| Secret is Hostile:", M.sideOf({ disp: -2 }), "| Neutral:", M.sideOf({ disp: 0 }));

console.log("--- the GM's clicks (the combatant flags they write)");
const goblins = list.filter(c => c.actorId === "GOB");
console.log("stack Boons +:", JSON.stringify(M.applyClick(goblins, call, "boons+")));
const g2 = goblins.map(c => (c.id === "gob2" ? { ...c, set: { boons: 2 } } : c));
console.log("a member differs: the stack shows ·:", M.rowView(g2, call, { stack: "hostile|GOB" }).boons, "| its Check is mixed when one member changes it:", M.rowView(goblins.map(c => (c.id === "gob1" ? { ...c, set: { attr: "body" } } : c)), call, { stack: "hostile|GOB" }).attrMixed);
console.log("the Check back to the called one clears it:", JSON.stringify(M.applyClick([list[0]], call, "attr", "instinct")), "| another one is kept:", JSON.stringify(M.applyClick([list[0]], call, "attr", "body")));
console.log("Favored and Doomed toggle:", JSON.stringify(M.applyClick([list[0]], call, "fav")), JSON.stringify(M.applyClick([{ ...list[0], set: { fav: true } }], call, "fav")));
console.log("to a Fourth side:", JSON.stringify(M.applyClick([list[3]], call, "side", "fourth")), "| Goes last:", JSON.stringify(M.applyClick([list[3]], call, "last")), "| GM rolls all (the rolled Ogre untouched):", Object.keys(M.applyClick(list, call, "gmAll")).length, "of", list.length);
const moved = list.map(c => (c.id === "thg" ? { ...c, set: { side: "fourth" } } : c));
console.log("a Fourth side appears:", M.gmModel(moved, call).sides.map(s => `${s.name} (${s.tag})`).join(" | "));
console.log("Boons can't go under the GM's own (an effect's stay):", JSON.stringify(M.applyClick([{ ...list[0], set: {} }], call, "boons-")));

console.log("--- the roll's pieces (performCheck)");
const both = { ...list[0], set: { fav: true, doom: true } };
console.log("Favored and Doomed:", JSON.stringify(M.rollOf(both, call)), "| the row says:", M.rowView([both], call).both);
console.log("Exhausted 1 and an effect's Boon with the GM's:", JSON.stringify(M.rollOf({ ...list[3], fx: { ...fx0, exh: 1, boons: 1 }, set: { boons: 1 } }, call)));
console.log("an effect's Favored lights the toggle (locked):", JSON.stringify((({ fav, favFx, favBy }) => ({ fav, favFx, favBy }))(M.rowView([{ ...list[3], fx: { ...fx0, fav: true, favBy: ["Bless"] } }], call))));
console.log("the Wisp rolls Mind:", JSON.stringify(M.rollOf(list.find(c => c.id === "wsp"), call)));
console.log("the header changes: rows without their own follow it:", M.attrOf(list[0], { attr: "body" }), "| the Wisp keeps Mind:", M.attrOf(list.find(c => c.id === "wsp"), { attr: "body" }));

console.log("--- Goes last: no roll, after everyone, by the tie rule");
const lasts = [mk({ id: "a", mods: { instinct: 1 }, disp: -1 }), mk({ id: "b", mods: { instinct: 3 }, disp: -1 }), mk({ id: "c", mods: { instinct: 1 }, disp: 1 })];
console.log(M.lastOrder(lasts, call).map(x => x.id).join(" > "), "| not in the GM's roll:", !M.gmModel(list, call).rollIds.includes("grd"));

console.log("--- the players' window (Krysta)");
const pm = M.playerModel(big().map(c => ({ ...c, mine: c.id === "pal" })), call, "Krysta");
console.log(pm.sub);
for (const y of pm.yours) console.log(`YOUR ROLL: ${y.name} | ${y.check} | ${[...y.gmChips, ...y.fxChips].join(", ")} | ${y.canRoll ? "Roll" : y.gmRolls ? "The GM rolls for you" : "-"} | ${y.note}`);
console.log("Heroes:", pm.heroes.map(h => `${h.name} (${h.status})`).join(", "));
for (const s of pm.others) console.log(`${s.name}:`, s.hold ? "Shown when combat starts" : s.items.map(i => `${i.name} (${i.status})`).join(", "));
const pm2 = M.playerModel(big(), call, "Krysta", { npcMode: "afterStart", started: false }), pm3 = M.playerModel(big(), call, "Krysta", { npcMode: "afterStart", started: true });
console.log("NPCs until combat starts:", pm2.others.map(s => `${s.name}: ${s.hold ? "Shown when combat starts" : s.items.length}`).join(" | "), "| after:", pm3.others.map(s => `${s.name}: ${s.items.length} lines`).join(" | "));
console.log("no number for NPCs, the hidden Shade never listed:", !JSON.stringify(pm.others).includes("15"), !JSON.stringify(pm).includes("Lurking"));
const gmSet = M.playerModel(big().map(c => (c.id === "pal" ? { ...c, mine: true, set: { who: "gm" } } : c)), call, "Krysta");
console.log("the GM rolls this one:", gmSet.yours[0].gmRolls, gmSet.yours[0].canRoll);

console.log("--- the HTML (pure)");
const gh = V.gmHtml(M.gmModel(list, call, { open: { "hostile|GOB": true } }));
console.log("header Check buttons:", (gh.match(/data-act="call"/g) ?? []).length, "| Instinct pressed:", /data-v="instinct" aria-pressed="true"/.test(gh), "| GM rolls all:", gh.includes('data-act="gmAll"'), "| column labels:", gh.includes("<span>Who rolls</span><span>Check</span><span>Roll</span><span>Boons</span><span>Banes</span>"));
console.log("the stack button and 6 member rows:", gh.includes("×6 ▴ hide each"), (gh.match(/iw-row [a-z]+ member/g) ?? []).length, "| ⇄ and ⤓ buttons:", (gh.match(/data-act="move"/g) ?? []).length, (gh.match(/data-act="last"/g) ?? []).length);
console.log("the orange row (Paladin: 1 Boon) and the overridden Check border:", gh.includes('class="iw-row changed"'), gh.includes("iw-check over"), "| Reroll on the Ogre:", gh.includes('data-act="reroll"'), "| Roll is the only iw-go:", (gh.match(/class="iw-go"/g) ?? []).length);
console.log("no old pieces (This roll, Same, Rolls/Skips):", !/This roll|>Same<|Skips/.test(gh), "| footer hint:", gh.includes("Enter rolls · Esc cancels"));
const ph = V.playerHtml(pm);
console.log("player window: Roll button, the GM's chip, the tracker line:", ph.includes('data-act="proll" data-id="pal"'), ph.includes("1 Boon · from the GM"), ph.includes("The order appears in the Combat Tracker."), "| no setting controls:", !/data-act="(fav|doom|attr|boons\+|who)"/.test(ph));
console.log("text:", strip(ph).slice(0, 260));

console.log("--- wiring");
const cb = src("module/combat.mjs"), iw = src("module/initwindow.mjs"), sj = JSON.parse(src("system.json"));
console.log("the GM's roll opens the window, a player's rolls at once:", cb.includes("if (game.user.isGM && !options.direct) { await W.openInitiative(this); return this; }") && cb.includes("else await W.playerRoll(this, ids);"));
console.log("Goes last after the zipper, by the tie rule:", cb.includes("const ordered = [...zipper([...base]), ...lastIds.map(id => lastC.find(c => c.id === id))];"), "| the side flag and Secret as Hostile in the order:", cb.includes("if (own) return sideDisp(own);") && cb.includes("return d < -1 ? -1 : d;"));
console.log("the roll: performCheck with the effects and Exhausted:", iw.includes("adj: ro.adj, adjLabel: ro.adjLabel, sources: cr.fx.sources, noDoubles: true") && iw.includes("out.exh = Math.max(0, Number(actor.system?.exhausted) || 0);") && iw.includes('modifierList(actor, new Set([attr, "__check"]))'));
console.log("the socket and the settings:", sj.socket === true && iw.includes('type: "initOpen"') && iw.includes('"initPlayersOpen"') && iw.includes('"initNpcsForPlayers"') && src("module/twod12.mjs").includes("registerInitiativeSettings();") && src("module/twod12.mjs").includes("registerInitiativeSocket();"));
console.log("Dying or Shattered: Goes last on when the window opens (once):", iw.includes('(st("dying") || st("shattered")) && set.last === undefined'), "| live updates:", iw.includes('"updateCombatant", "createCombatant"'), "| Enter and Esc:", iw.includes('ev.key === "Enter"') && iw.includes('ev.key === "Escape"'));
console.log("no DialogV2 in the Initiative windows:", !/DialogV2/.test(iw) && !/DialogV2/.test(src("module/initview.mjs")), "| the old window's model gone:", !iw.includes("initiativeModel") && !cb.includes("askInitiative") && !cb.includes("initSkipped"));
console.log("Known limits: initiative no longer skips Exhausted:", !/initiative and other rolls that don't open the roll dialog skip the Exhausted penalty/.test(src("../foundry-backlog.md")));
