// Run with: node tools/tests/run.mjs (or node tools/tests/t213.mjs)
// v0.0.291 (PACK NPC-SHEET): the NPC sheet's pure pieces (module/sheetmodel.mjs) and the shared row lines.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: {} }, utils: {}, data: { fields: {} } }; globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} }; globalThis.game = { settings: { get: () => true } };
const { TWOD12 } = await import(ROOTURL + "module/config.mjs");
const M = await import(ROOTURL + "module/sheetmodel.mjs");
const R = TWOD12.npcRatings, role = k => TWOD12.npcRoles[k];

console.log("--- the role tables by Stage and rating");
console.log("Standard Medium, Stage 1:", JSON.stringify(M.npcRow(role("standard"), R, "medium", 1)), "| Stage 2 Health x:", M.npcRow(role("standard"), R, "medium", 2).hm);
console.log("Minion steps:", M.ratingKeys(role("minion"), R).join(" "), "| Elite steps:", M.ratingKeys(role("elite"), R).length, "| a Minion's Extreme reads as:", M.npcRow(role("minion"), R, "extreme", 1).rating);

console.log("--- Vigor / Resolve, Health, to Down, AD / WD, vs Attributes (the Bestiary's examples)");
const ex = {
  "Goblin Sneak": ["minion", { body: "medium", mind: "medium", appeal: "low", instinct: "high", bodyHm: "low", mindHm: "low", ad: "medium", wd: "low" }],
  "Orc Warrior": ["standard", { body: "high", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "high", mindHm: "low", ad: "medium", wd: "low" }],
  "Ogre Chieftain": ["elite", { body: "high", mind: "medium", appeal: "low", instinct: "medium", bodyHm: "medium", mindHm: "medium", ad: "medium", wd: "low" }]
};
for (const [name, [rk, rt]] of Object.entries(ex)) {
  const n = M.npcNumbers(role(rk), R, rt, 1);
  console.log(`${name}: Vigor ${n.vigor} / Resolve ${n.resolve}, Health ${n.pool}, to Down after 20: ${M.toDown(n.pool, 20)}, AD ${n.ad} / WD ${n.wd}, vs ${JSON.stringify(M.vsDefenses(n.attributes))}`);
}

console.log("--- the Attacks reference (rounded to .5), the ratings average, Down in about");
const b = M.npcRow(role("standard"), R, "medium", 1).basic;
console.log("Standard Medium:", [1, 1.4, 2.2, 3.5].map(x => M.specialAvg(b, x).join(" / ")).join(" | "));
console.log("ratings average:", M.ratingsAverage(Object.values(ex["Orc Warrior"][1]), R), "|", M.ratingsAverage(["high", "high", "extreme", "high"], R), "|", M.ratingsAverage(["low", "custom", "terrible"], R));
console.log("Orc 65 at 23.3 a turn:", M.downIn(65, 23.3), "| Ogre 132:", M.downIn(132, 23.3), "| no damage:", M.downIn(10, 0));

console.log("--- the role switch clamps the ratings");
console.log("an Elite with Extreme Body becomes a Minion:", JSON.stringify(M.clampRatings({ body: "extreme", mind: "low", ad: "custom", speed: "7" }, role("minion"), R)));

console.log("--- the row lines (Frequency color, Strike line)");
const L = o => { const r = M.rowLines(o); return `${r.cls} ${r.freq}`; };
console.log("Weapon Attack (At-will, Strike):", L({ frequency: "atwill", strike: true }), "| Charge (Round, Strike):", L({ frequency: "round", strike: true }), "| Advance:", L({ frequency: "atwill" }));
console.log("Rebuke (Reaction):", L({ reaction: true, frequency: "turn" }), "| a Daily:", L({ frequency: "daily" }), "| can't be used:", L({ frequency: "round", strike: true, off: true }));

console.log("--- the Basic Actions an NPC can't use, the Strikes pips, the Senses, the Elite ladder");
console.log("Steel Yourself:", M.basicUnavailable("rally", { npc: true, rallyLeft: 0 }), "| Stand:", M.basicUnavailable("stand", { npc: true }), "| Crawl:", JSON.stringify(M.basicUnavailable("crawl", { npc: true })));
console.log("Strikes left (0, 1, 3 used):", [0, 1, 3].map(n => M.strikePips(n).map(x => (x ? "◆" : "◇")).join("")).join(" "));
console.log("senses:", JSON.stringify(M.senseChips({}).map(c => c.label)), JSON.stringify(M.senseChips({ darksight: true, hearing: 10 }).map(c => c.label)), JSON.stringify(M.senseChips({ dimlight: true, hearing: 0, list: [{ name: "Tremorsense", range: 6 }] }).map(c => c.label)));
console.log("the Elite's ladder:", M.ELITE_RUNGS.map(r => r.label).join(" | "));

console.log("--- the template and the CSS");
const src = f => fs.readFileSync(ROOT + f, "utf8"), tpl = src("templates/actor-sheet-pc.hbs"), css = src("styles/system.css"), sh = src("module/actor-sheets.mjs");
console.log("NPC tabs:", /\["actions", "Actions"\], \["effects", "Effects", [^\]]*\], \["builder", "Builder"\], \["loot", "Loot"\], \["notes", "GM notes"\]/.test(src("module/pcsheet.mjs")), "| the Builder's steps (v0.0.308: pip and number one button):", tpl.includes('<div class="nb-steps2">') && tpl.includes('<i class="nb-pip"></i><span>{{v}}</span></button>'), "| Post stat block (GM):", tpl.includes('data-action="postStatBlock"') && sh.includes("static async postStatBlock"), "| Give to a PC:", sh.includes("static async giveLoot"));
console.log("the Strike line on rows:", css.includes(".ps-row.strike > .ps-line { box-shadow: inset 4px 0 0 var(--tw-strike); padding-left: 16px; }"), "| two lines on a Basic button:", css.includes("inset 8px 0 0 var(--tw-strike)"), "| 3px corners:", css.includes(".twod12.sheet.pcs .ps-pill, .twod12.sheet.pcs .ps-chip"), "| no row tooltips:", !/Open the (Action|card)/.test(tpl));
console.log("the Basic attack rating on the Action:", src("module/data.mjs").includes("basicRating: choice("), (src("templates/item-sheet.hbs") + src("module/actionsheet.mjs")).includes('name="system.basicRating"'));
