// Run with: node tools/tests/run.mjs (or node tools/tests/t99.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// The Interrupt/Trigger line of a Reaction, the Fear trait, and the new fields (Tags, the reaction kind, Empowered and Enfeebled on effects).
globalThis.foundry = { utils: { deepClone: o => o, getRoute: p => "/" + p, escapeHTML: s => s } };
const C = await import(ROOTURL + "module/config.mjs");
console.log("--- the line on a Reaction's card");
const row = (kind) => C.metaRowHtml({ trigger: "A creature within 3 squares leaves a square during a Move Action", reactionKind: kind }).match(/<b>([^<]*)<\/b> ([^<]*)</);
for (const kind of ["interrupt", "trigger", "", undefined]) console.log(`kind ${JSON.stringify(kind)}`.padEnd(20), "->", row(kind)?.slice(1).join(" "));
console.log("no trigger, no line:", JSON.stringify(C.metaRowHtml({ reactionKind: "interrupt" }).includes("trgrow")));
console.log("--- the Fear trait");
const T = C.TWOD12;
console.log("in the trait list:", T.traits.fear, "| sorted among the others:", Object.values(T.traits).slice(0, 7).join(", "), "| help:", T.traitHelp.fear);
console.log("--- the fields and the sheets");
const read = p => fs.readFileSync(ROOT + p, "utf8");
const data = read("module/data.mjs"), item = read("templates/item-sheet.hbs") + read("templates/parts/settings.hbs"), actor = read("templates/actor-sheet.hbs");
const has = (s, t) => s.includes(t);
console.log("reaction kind (data):", has(data, 'reactionKind: choice({ interrupt: "Interrupt", trigger: "Trigger" }, "trigger")'), "| Tags (data):", has(data, "tags: str()"), "| Empowered and Enfeebled as numbers (effect settings):", has(data, "empowered: int(0), enfeebled: int(0)"));
console.log("reaction kind select (item sheet):", has(item, 'name="system.reactionKind"'), "| Empowered and Enfeebled inputs:", has(item, 'data-field="empowered" value="{{empowered}}"') && has(item, 'data-field="enfeebled" value="{{enfeebled}}"'), "| no old checkbox:", !has(item, 'type="checkbox" data-sfield="{{i}}" data-field="empowered"'));
console.log("Tags input (NPC sheet):", has(actor, 'data-action="removeTag"') && has(actor, 'class="tagadd"'));
console.log("--- the compendium");
const pack = name => JSON.parse(fs.readFileSync(ROOT + `packs/_source/actions/${name}.action.json`, "utf8")).system;
// v0.0.234: Opportunity Attack is a Basic Action (pack R-core), read from the generated data, not the compendium.
const oa = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS.opportunityAttack, cut = pack("cut-through");
console.log("Opportunity Attack:", oa.reactionKind, "|", oa.trigger, "| reaction:", oa.reaction);
console.log("Cut Through's Setup:", cut.setup.slice(0, 48));
const bl = JSON.parse(fs.readFileSync(ROOT + "packs/_source/effects/bloodlust.effect.json", "utf8")).system.settings, fx = { ...bl.find(st => st.type === "boonbane"), empowered: bl.find(st => st.type === "damagestep")?.empowered };   // Empowered is its own setting since v0.0.126
console.log("Bloodlust (effect): Empowered", fx.empowered, "| Enfeebled", fx.enfeebled ?? "(none)", "| boons", fx.boons, "| for", JSON.stringify(fx.all));
