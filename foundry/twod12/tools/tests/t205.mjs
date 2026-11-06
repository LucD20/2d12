// Run with: node tools/tests/run.mjs (or node tools/tests/t205.mjs)
// v0.0.266 (Lucas's test of v0.0.265): a Grant's second "and on [a result], ..." line (Overwatch: Hindered on a Tier 2+, Pushed on a Critical), the
// ticket badge short, the uses "to a different creature each time" as a choice; a Version's effect "when the target is Down" (Deathmark); the
// "Ignores cover" setting with its levels (Aim); the Marked Quarry and Cover links.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true }, user: { id: "u1" } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const F = await import(ROOTURL + "module/freeuse.mjs");
const E = await import(ROOTURL + "module/escblock.mjs");
const CG = await import(ROOTURL + "tools/cardgen.mjs");
const v = { ap: 1, noTiers: false, x1: "", x2: "", x3: "", critical: "", effects: "A shot." };
const g = { on: "t2", does: "text", text: "The target is @Condition[hindered|rounds:eot]{Hindered (EoT)}.", on2: "crit", does2: "text", text2: "The target is also @Move[pushed|distance:2]{Pushed 2}." };
const out = F.withGrantLine(v, g);
console.log("two lines:", JSON.stringify({ x1: out.x1, x2: out.x2, x3: out.x3, critical: out.critical }));
const b = E.grantBadges(g, null);
console.log("badges short:", JSON.stringify(b.short), "| long:", JSON.stringify(b.long));
console.log("a half line as the second:", E.grantBadges({ on: "", does: "text", text: "", on2: "t3", does2: "half" }, null).short.join("|"));
const cards = f => JSON.parse(fs.readFileSync(ROOT + "../../book/cards/" + f, "utf8")).cards;
const dm = CG.cardSystem(cards("archer.json").find(c => c.name === "Deathmark"), x => x), aim = CG.cardSystem(cards("talents.json").find(c => c.name === "Aim"), x => x);
console.log("Deathmark: mode", dm.versions[0].fx.all[0].mode, "| the Quarry link:", dm.versions[0].effects.includes("{{link:Marked Quarry|Marked Quarry}}"), "| Aim's Cover link:", aim.versions[0].effects.includes("@Book[Cover]{Low cover}"));
const dmg = src("module/damage.mjs"), dc = src("module/dmgcard.mjs"), ac = src("module/actions.mjs"), st = src("templates/parts/settings.hbs"), af = src("module/appliedflags.mjs");
console.log("down effects come by themselves, the Effects button stays:", dmg.includes("async function applyDownEffects(f, actor, targetUuid)") && dmg.includes('const isConditional = x => x.mode === "conditional" || x.mode === "down"') && dc.includes('x.mode === "conditional" || x.mode === "down"'));
console.log("cover ignored on the roll:", ac.includes('coverIgnored(actor, ["", "low", "medium", "high"][cov.banes] ?? "", useTraits)') && af.includes('x.type === "cover"'));
console.log("the editor: the uses' choice, the second line, the cover chips:", st.includes('data-field="grantDistinct" data-bool') && st.includes('data-field="grantOn2"') && st.includes('data-field="coverLevels" data-key="{{key}}"'));
