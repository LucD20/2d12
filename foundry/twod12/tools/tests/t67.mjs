// Run with: node tools/tests/run.mjs (or node tools/tests/t67.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const GS = 100;
const inCombat = new Set();   // the book's examples are fights: every creature here is in the combat, so it makes noise
globalThis.game = { settings: { get: (s, k) => ({ lightDimBelow: 0.7, lightDarkBelow: 0.4 }[k]) }, combat: { started: true, combatants: { find: f => [...inCombat].map(tokenId => ({ tokenId })).find(f) } } };
globalThis.CONFIG = { specialStatusEffects: { BLIND: "blind" } };
globalThis.foundry = {};
const torch = { active: true, data: { x: 150, y: 150, bright: 400, dim: 800 }, shape: { contains: () => true } };   // centered on square (1,1): Bright 4, Dim 8
globalThis.canvas = { grid: { size: GS }, environment: { darknessLevel: 1 }, effects: { lightSources: [torch], darknessSources: [] } };
const L = await import(ROOTURL + "module/light.mjs");
const { perceive } = await import(ROOTURL + "module/senses.mjs");
const tok = (name, i, j, { w = 1, senses = {}, statuses = [], elev = 0 } = {}) => (inCombat.add(name), { name, document: { id: name, x: i * GS, y: j * GS, width: w, height: w, elevation: elev }, actor: { name, statuses: new Set(statuses), system: { senses } } });
const show = (label, o, t, opt) => { const p = perceive(o, t, opt); console.log(label.padEnd(58), `${p.name} (${p.why})`); };
console.log("scene light by Darkness level: 0 →", L.levelFromDarkness(0), "| 0.3 →", L.levelFromDarkness(0.3), "| 0.45 →", L.levelFromDarkness(0.45), "| 0.6 →", L.levelFromDarkness(0.6), "| 1 →", L.levelFromDarkness(1));
console.log("light at squares from the torch: 2 away", L.lightAt({ x: 350, y: 150 }), "| 6 away", L.lightAt({ x: 750, y: 150 }), "| 10 away", L.lightAt({ x: 1150, y: 150 }));
const nari = tok("Nari", 2, 1), goblin = tok("Goblin", 12, 1, { senses: { darksight: true } });
show("1. Nari (torchlight) looks at the Goblin (Darkness)", nari, goblin);
show("   the Goblin (Dark Sight) looks at Nari", goblin, nari);
const gob2 = tok("Goblin", 7, 1, { senses: { darksight: true } });
show("2. the Goblin steps into the torch's Dim light", nari, gob2);
show("3. as 2, Nari has Dim-light Sight", tok("Nari", 2, 1, { senses: { dimlight: true } }), gob2);
const snake = tok("Snake", 14, 1, { senses: { list: [{ name: "Lesser Heatsight", range: 6, gives: "obscured", needs: "heat" }] } });
const nariDark = tok("Nari", 12, 1);
show("5. Snake (Lesser Heatsight) attacks Nari in Darkness", snake, nariDark);
show("   ...a Skeleton that gives off no heat instead", snake, tok("Skeleton", 12, 1, { senses: { noHeat: true } }));
const worm = tok("Cave Worm", 15, 1, { senses: { list: [{ name: "Tremorsense", range: 6, gives: "clear", needs: "ground" }] } });
show("6. Cave Worm (Tremorsense) and Nari on the same ground", worm, nariDark);
show("6b. Nari climbs a rope (elevation 1)", worm, tok("Nari", 12, 1, { elev: 1 }));
show("    ...and she Hides (the GM puts Unsensed on her)", worm, tok("Nari", 12, 1, { elev: 1, statuses: ["unsensed"] }));
show("7. an invisible thief (GM status Hidden) in Bright light", nari, tok("Thief", 3, 1, { statuses: ["hidden"] }));
show("   a wall between them (no Line of Effect)", nari, tok("Orc", 3, 1), { loe: false });
const ogre = tok("Ogre", 8, 0, { w: 2 });   // squares (8..9, 0..1): (8,y) is 7 from the torch → Dim
show("large creature half in the torch's Dim light, half beyond", nari, ogre);
console.log("distance: adjacent", L.tokenDistance(tok("a", 0, 0), tok("b", 1, 0)), "| 5 squares apart", L.tokenDistance(tok("a", 0, 0), tok("b", 5, 0)), "| a 2x2 creature 1 square away", L.tokenDistance(tok("a", 0, 0), tok("b", 2, 0, { w: 2 })));
