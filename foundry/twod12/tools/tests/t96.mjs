// Run with: node tools/tests/run.mjs (or node tools/tests/t96.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// Flanking (the SWADE-style rule): 1 boon for each OTHER creature that threatens the enemy (up to 3), minus 1 for each ally of the enemy that threatens you, never below 0.
const GS = 100;
globalThis.canvas = { grid: { size: GS }, tokens: { placeables: [] } };
const F = await import(ROOTURL + "module/flanking.mjs");
const tokens = canvas.tokens.placeables; let n = 0;
const weapon = (extra = 0, props = ["melee"], wielded = true) => ({ system: { wielded, traits: new Set(props), reach: extra }, getFlag: () => false });
const action = (traits, damage, distance = "reach") => ({ system: { traits: new Set(traits), distance, versions: [{ t1: [], t2: damage ? [{}] : [], t3: damage ? [{}] : [] }] } });
/** side: 1 friendly, -1 hostile, 0 neutral. Positions are (row, column). */
const tok = (name, row, col, side, { reach = 1, weapons = [weapon()], actions = [], statuses = [], hidden = false, talents = [], noActor = false } = {}) => {
  const t = { id: "t" + ++n, name, document: { id: "t" + n, x: col * GS, y: row * GS, width: 1, height: 1, disposition: side, hidden }, actor: noActor ? null : { name, statuses: new Set(statuses), system: { reach }, itemTypes: { weapon: weapons, action: actions, talent: talents, feature: [] } } };
  tokens.push(t); return t;
};
const clear = () => { tokens.length = 0; };
const boons = (a, t) => F.flankingFor(a, t).boons;
const row = (label, pairs) => console.log(label.padEnd(64), pairs.map(([who, a, t]) => `${who}: ${boons(a, t)}`).join("  "));
console.log("--- the panels of the diagram");
let G, K, N, M, R, T;
G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 3, 1);
row("two flankers", [["Kai", K, G], ["Nari", N, G]]);
M = tok("Mara", 1, 2, 1); row("three flankers", [["Kai", K, G], ["Nari", N, G], ["Mara", M, G]]);
R = tok("Rin", 3, 2, 1); T = tok("Tor", 3, 3, 1); row("five flankers (2 is the limit, v0.0.301)", [["Kai", K, G], ["Nari", N, G], ["Mara", M, G], ["Rin", R, G], ["Tor", T, G]]);
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 4, 1, { weapons: [weapon(1)] });
row("a Reach 2 weapon flanks from 2 squares (Nari is 2 away)", [["Kai", K, G], ["Nari", N, G]]);
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 5, 1, { weapons: [weapon(1)] });
row("... from 3 squares: she does not reach", [["Kai", K, G], ["Nari", N, G]]);
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 4, 4, 1, { weapons: [weapon(1)] });
row("... two diagonals away counts 3: she does not reach", [["Kai", K, G], ["Nari", N, G]]);
N = tok("Nari2", 3, 4, 1, { weapons: [weapon(1)] }); row("... 2 across and 1 down is 2: she does", [["Kai", K, G], ["Nari2", N, G]]);
console.log("--- an ally of the defender that threatens you cancels a boon (the picture)");
clear(); let A, B, C, P, W; P = tok("Kai", 2, 2, 1); W = tok("Nari", 2, 4, 1); A = tok("Goblin A", 1, 1, -1); B = tok("Goblin B", 1, 3, -1); C = tok("Goblin C", 3, 3, -1);
row("Kai in the middle, Nari next to goblins B and C", [["A", A, P], ["B", B, P], ["C", C, P]]);
const fb = F.flankingFor(B, P); console.log("Goblin B: flanked with", fb.flankers.join(", "), "| cancelled by", fb.cancelledBy.join(", "), "| the whole group that threatens Kai:", fb.threatenedBy.join(", "));
row("what Kai and Nari get against goblin B (they are cancelled too)", [["Kai", P, B], ["Nari", W, B]]);
W.actor.statuses.add("unconscious"); row("Nari is Unconscious: she does not cancel anything", [["A", A, P], ["B", B, P], ["C", C, P]]); W.actor.statuses.delete("unconscious");
const bow = W.actor.itemTypes.weapon; W.actor.itemTypes.weapon = [weapon(0, ["ranged"])]; row("Nari holds only a bow: she threatens no one", [["A", A, P], ["B", B, P], ["C", C, P]]); W.actor.itemTypes.weapon = bow;
tokens.splice(tokens.indexOf(W), 1); W = tok("Nari", 2, 7, 1); row("Nari is far away", [["A", A, P], ["B", B, P], ["C", C, P]]);
clear(); P = tok("Kai", 2, 2, 1); A = tok("Goblin A", 1, 1, -1); B = tok("Goblin B", 1, 3, -1); C = tok("Goblin C", 3, 3, -1);
row("three goblins on a lone hero (no ally of his near)", [["A", A, P], ["B", B, P], ["C", C, P]]);
const g4 = tok("Goblin D", 3, 1, -1), g5 = tok("Goblin E", 2, 3, -1); row("five goblins on a lone hero (2 is the limit, v0.0.301)", [["A", A, P], ["B", B, P], ["C", C, P], ["D", g4, P], ["E", g5, P]]);
console.log("--- formations");
clear(); const a1 = tok("Ann", 1, 1, 1), a2 = tok("Ben", 1, 2, 1), e1 = tok("Orc", 2, 1, -1), e2 = tok("Imp", 2, 2, -1);
row("two against two, all next to each other", [["Ann at Orc", a1, e1], ["Ann at Imp", a1, e2], ["Ben at Orc", a2, e1], ["Orc at Ann", e1, a1], ["Imp at Ben", e2, a2]]);
for (const len of [4, 5]) {
  clear(); const allies = [], foes = []; for (let c = 1; c <= len; c++) { allies.push(tok("A" + c, 1, c, 1)); foes.push(tok("B" + c, 2, c, -1)); }
  const gains = []; for (const x of [...allies, ...foes]) for (const d of [...allies, ...foes]) if (Math.sign(x.document.disposition) !== Math.sign(d.document.disposition) && boons(x, d)) gains.push(`${x.name} at ${d.name}: ${boons(x, d)}`);
  console.log(`two lines of ${len}: every attack with a boon:`, gains.sort().join(" | "));
}
clear(); const hero = tok("Hero", 2, 2, 1), pal = tok("Pal", 2, 3, 1), s1 = tok("Gob1", 1, 1, -1), s2 = tok("Gob2", 1, 2, -1), s3 = tok("Gob3", 1, 3, -1), s4 = tok("Gob4", 3, 2, -1);
row("a hero and an ally side by side against four goblins (at the hero)", [["Gob1", s1, hero], ["Gob2", s2, hero], ["Gob3", s3, hero], ["Gob4", s4, hero]]);
row("... at the ally", [["Gob2", s2, pal], ["Gob3", s3, pal], ["Gob4", s4, pal]]);
console.log("--- who threatens");
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 3, 1);
N.actor.statuses.add("unconscious"); row("Nari is Unconscious (and threatens no one)", [["Kai", K, G], ["Nari", N, G]]); N.actor.statuses.delete("unconscious");
N.actor.statuses.add("dead"); row("Nari is dead", [["Kai", K, G]]); N.actor.statuses.delete("dead");
N.actor.statuses.add("prone"); row("Nari is Prone (other conditions work as normal)", [["Kai", K, G], ["Nari", N, G]]); N.actor.statuses.delete("prone");
N.actor.itemTypes.weapon = [weapon(0, ["ranged"])]; row("Nari holds a ranged weapon", [["Kai", K, G], ["Nari", N, G]]); N.actor.itemTypes.weapon = [weapon()];
N.actor.itemTypes.weapon = [weapon(0, ["melee"], false)]; row("Nari's Melee weapon is not wielded", [["Kai", K, G], ["Nari", N, G]]); N.actor.itemTypes.weapon = [weapon()];
const fists = { system: { wielded: false, traits: new Set(["barehanded", "melee", "nonthreatening"]), reach: 0 }, getFlag: (s, k) => k === "fists" };
N.actor.itemTypes.weapon = [fists]; row("Nari has only her Fists (Non-threatening: they don't threaten)", [["Kai", K, G], ["Nari", N, G]]);
N.actor.itemTypes.talent = [{ id: "brawler", name: "Brawler", system: { settings: [{ type: "weaponprop", wpWhich: "fists", wpProp: "nonthreatening", minEscalation: 0 }] } }]; row("... with Brawler (her Fists threaten)", [["Kai", K, G], ["Nari", N, G]]);   // v0.0.207: its Weapon property setting
N.actor.itemTypes.talent = []; N.actor.itemTypes.weapon = [weapon()];
const claw = action(["melee", "strike"], true), bite = action(["melee", "strike"], false), spit = action(["ranged"], true), swing = action(["melee", "strike", "weapon"], true), far = action(["melee"], true, "2");
N.actor.itemTypes.weapon = []; N.actor.itemTypes.action = [claw]; row("an NPC's own [Melee] Action that deals damage (a claw)", [["Kai", K, G], ["Nari", N, G]]);
N.actor.itemTypes.action = [bite]; row("... one that deals no damage", [["Kai", K, G], ["Nari", N, G]]);
N.actor.itemTypes.action = [spit]; row("... a Ranged one", [["Kai", K, G], ["Nari", N, G]]);
N.actor.itemTypes.action = [swing]; row("... a Weapon Action alone (it needs a weapon)", [["Kai", K, G], ["Nari", N, G]]);
const nFar = tok("Nari3", 2, 4, 1, { weapons: [], actions: [far] }); row("... a [Melee] Action with Distance 2, 2 squares away", [["Kai", K, G], ["Nari3", nFar, G]]);
N.actor.itemTypes.action = []; N.actor.itemTypes.weapon = [weapon()]; tokens.splice(tokens.indexOf(nFar), 1);
console.log("reach of a creature with Reach 2 and a weapon with 1 extra:", F.threatReach({ system: { reach: 2 }, itemTypes: { weapon: [weapon(1)], action: [], talent: [] }, statuses: new Set() }), "| without a weapon:", F.threatReach({ system: { reach: 2 }, itemTypes: { weapon: [], action: [], talent: [] }, statuses: new Set() }), "| no creature:", F.threatReach(null));
console.log("--- sides");
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 3, 1);
const neutral = tok("Bystander", 1, 2, 0); row("a neutral creature next to the goblin is nobody's enemy", [["Kai", K, G], ["Nari", N, G], ["Bystander", neutral, G]]);
row("an attack at a neutral creature", [["Kai", K, neutral]]);
const ghost = tok("Ghost", 3, 2, 1, { hidden: true }); row("a token the GM has hidden is ignored", [["Kai", K, G], ["Ghost", ghost, G]]);
const noA = tok("Statue", 3, 2, 1, { noActor: true }); row("a token without a creature is ignored", [["Kai", K, G]]);
clear(); const g1 = tok("Orc1", 2, 1, -1), g2 = tok("Orc2", 2, 3, -1), h1 = tok("Hero", 2, 2, 1);
row("hostile creatures flank a hero", [["Orc1", g1, h1], ["Orc2", g2, h1]]);
console.log("--- an attacker that does not threaten gets nothing");
clear(); G = tok("G", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 3, 1); const archer = tok("Archer", 4, 2, 1, { weapons: [weapon(0, ["ranged"])] });
row("two flank, an archer 2 squares away (a Melee Action it cannot make)", [["Kai", K, G], ["Archer", archer, G]]);
console.log("--- the roll modifier");
clear(); G = tok("Goblin", 2, 2, -1); K = tok("Kai", 2, 1, 1); N = tok("Nari", 2, 3, 1); M = tok("Mara", 1, 2, 1);
console.log(JSON.stringify(F.flankingMod(K, G)));
console.log(JSON.stringify(F.flankingMod(K, G, { tag: "Scene.s.Token.7" })));
clear(); P = tok("Kai", 2, 2, 1); W = tok("Nari", 2, 4, 1); A = tok("Goblin A", 1, 1, -1); B = tok("Goblin B", 1, 3, -1); C = tok("Goblin C", 3, 3, -1);
console.log("with a cancelled boon:", F.flankingMod(B, P).name, "|", F.flankingMod(B, P).predicate);
console.log("a lone attacker next to a defender gets no chip:", F.flankingMod(A, tok("Defender", 1, 0, 1)));
console.log("a boon that is fully cancelled gives no chip (Kai at goblin B):", F.flankingMod(P, B));
// ------------------------------------------------------------------ where the roll uses it
const code = fs.readFileSync(ROOT + "module/actions.mjs", "utf8");
const single = code.indexOf("flankingMod(selfToken, targetToken, { na: true })"), multiPath = code.indexOf("flankingMod(selfToken, tk, { tag: a.uuid, na: true })");   // v0.0.302: na, the n/a chip that says why
console.log("--- the roll dialog");
console.log("single target:", single > 0, "| several targets (one chip for each):", multiPath > 0, "| only for [Melee] Actions:", code.slice(single - 160, single).includes('useTraits.has("melee")') && code.slice(multiPath - 160, multiPath).includes('useTraits.has("melee")'), "| the multi path comes before the ranged Engaged chip of its target:", multiPath < code.indexOf("syn:engaged-target|"));
