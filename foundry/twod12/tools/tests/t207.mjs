// Run with: node tools/tests/run.mjs (or node tools/tests/t207.mjs)
// v0.0.269 (Lucas's test of v0.0.268: Overwatch's line from the sheet's ticket didn't apply): a ticket's button and a card's granted-use button name
// their own grant (opts.grantKey), so with two grants waiting (Aim's and Overwatch's) each uses its own; the Action's plain use button keeps the first.
import { fileURLToPath as rootPath } from "node:url"; const ROOT = rootPath(new URL("../../", import.meta.url).href);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const ac = src("module/actions.mjs"), fu = src("module/freeuse.mjs"), sh = src("module/actor-sheets.mjs"), tpl = src("templates/actor-sheet.hbs");
console.log("useAction takes the named grant, else the first:", ac.includes("const all = activeGrants(actor, item), g = opts.grantKey ? (all.find(x => x.effect.id === opts.grantKey.effectId && x.index === Number(opts.grantKey.index)) ?? all[0]) : all[0];"));
console.log("the card's button names its grant:", fu.includes("useAction(actor, item, { grantKey: { effectId: g.id, index: g.index } })"));
console.log("the ticket names its grant:", sh.includes("effectId: e.id, grantIndex: gi,") && sh.includes("const gk = target?.dataset?.grantEffect ? { grantKey: { effectId: target.dataset.grantEffect, index: Number(target.dataset.grantIndex) || 0 } } : {};") && tpl.includes('data-grant-effect="{{effectId}}" data-grant-index="{{grantIndex}}"'));
