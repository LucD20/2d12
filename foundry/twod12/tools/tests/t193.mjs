// Run with: node tools/tests/run.mjs (or node tools/tests/t193.mjs)
// v0.0.254 (cards session 4: Shield of Faith, Bulwark of Faith, Beacon revisited): the @Reduce chip (the next damage reduced, the Stage's dice), the
// `near:N` candidates (allies within N of you), the chain in steps (@Pause: a second Apply button), the Guard RP chip, the Beacon effect named after
// its card for 3 rounds, the inline Action written on the parent's text, the Interrupt / Trigger line first, the hover card on the token HUD.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const G = await import(ROOTURL + "tools/cardgen.mjs"), C = await import(ROOTURL + "tools/content.mjs"), A = await import(ROOTURL + "module/actions.mjs"), I = await import(ROOTURL + "module/inline.mjs");
const { convertEffects } = await import(ROOTURL + "module/gen.mjs");
console.log(convertEffects("The damage that Strike deals to the target is reduced by 2d6 + your Power Modifier (3d6 at Stage 2, 4d6 at Stage 3)."));
console.log(convertEffects("The target gains @Book[Guard]{Guard} equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1."));
const r = I.parseInline("Reduce", "2d6+pow|s2:3d6+pow|s3:4d6+pow|who:pick|near:5");
console.log("Reduce:", r.formula, JSON.stringify(r.stages), r.who, r.near, "| the Stage's:", I.stagedFormula(r, 2), "| Pause:", I.parseInline("Pause", "After the damage").label);
console.log("the steps of a chain:", JSON.stringify(A.chainSteps("@Guard[rally|who:pick|near:5] @Pause[After the damage] @Move[slid|distance:1|pick:yes|near:5]").map(s => `${s.label || "(first)"}: ${s.chips.length}`)));
const html = A.applyAfterHtml({ after: "@Guard[rally|who:pick|near:5] @Pause[After the damage] @Move[slid|distance:1|pick:yes|near:5]", noTiers: true }, [], null);
console.log("two Apply buttons, the second named by the Pause:", html.includes('data-step="0"') && html.includes('data-step="1"') && html.includes("After the damage") && html.includes("Apply Heal/Effects") && html.includes("Apply Damage/Effects"));
const cards = G.loadCards(), by = n => cards.find(c => c.name === n);
for (const n of ["Shield of Faith", "Bulwark of Faith"]) { const c = by(n), s = G.cardSystem(c); console.log(`${n}: Targets ${s.targets} | Distance ${JSON.stringify(s.distance ?? "")} | ${s.trigger} | ${s.versions[0].effects} | after: ${s.versions[0].after} | ${s.automation}`); }
const bk = C.docs.find(d => d.name === "Beacon" && d.type === "effect"), bkAct = C.docs.find(d => d.name === "Beacon" && d.type === "action");
console.log("the Beacon effect: 3 rounds, the aura, the inline Action:", bk.system.duration.type, bk.system.duration.rounds, bk.system.settings.map(x => x.type).join(","), "| the card applies it:", bkAct.system.versions[0].fx.all.map(x => C.docs.find(d => C.uuidOf("effects", d.name) === x.uuid)?.name).join(","), "| no Aura of Protection left:", !C.docs.some(d => /Aura of Protection/.test(d.name)));
console.log("the inline Action on the parent's text:", /you gain the following Action: @UUID\[Compendium\.twod12\.actions\.Item\.\w+\]\{Beacon's Step\} — 0R \| Round \| Interrupt: An ally in the Aura takes damage\. \| Effects: You @Move\[evade\|distance:1\] toward the ally\./.test(bkAct.system.versions[0].effects));
console.log("the Interrupt / Trigger line first:", src("module/config.mjs").includes("return trg + row + req;") && src("../../book/build_rules.py").includes("'Interrupt', 'Flavor'") && /<div class="arow trg"><b>Interrupt:<\/b> A \[/.test(src("../../book/paladin.html")));
const ef = src("module/effects.mjs"), dm = src("module/damage.mjs");
console.log("the HUD hover card to the left:", ef.includes('el.dataset.tooltipDirection = "LEFT"') && ef.includes("fxTipHtml({ name: valued ?"), "| the reduction waits on the creature and takes from the next damage:", src("module/data.mjs").includes("reduceNext: int(0, 0)") && dm.includes('upd["system.reduceNext"] = 0') && I.handTargetTokens !== undefined && src("module/inline.mjs").includes("async function handleReduce("));
