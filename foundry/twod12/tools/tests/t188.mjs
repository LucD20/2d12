// Run with: node tools/tests/run.mjs (or node tools/tests/t188.mjs)
// v0.0.249 (cards session 2: Rebuke, Word of Radiance, Beacon and Lucas's general asks): the labeled and colored meta lines, the ";" on a tier's
// effect, the area button kept on the chat card and the placement outline, the merged damage card open with its selector gone, the Save card's
// text line, a rung's effect as soon as the Escalation reaches it, inline Actions (Beacon's Step), an Aura as the Area line, and the chain's
// per-Tier distances, area origin and Critical-only condition (Word of Radiance).
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const G = await import(ROOTURL + "tools/cardgen.mjs"), C = await import(ROOTURL + "tools/content.mjs"), I = await import(ROOTURL + "module/inline.mjs");
const strip = h => String(h).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
console.log("--- the meta lines, the tier text, the cards");
const cfg = src("module/config.mjs"), pv = src("module/preview.mjs"), ac = src("module/actions.mjs"), dc = src("module/dmgcard.mjs"), dm = src("module/damage.mjs"), tp = src("module/template.mjs"), inl = src("module/inline.mjs");
console.log("Targets labeled and the meta texts colored:", cfg.includes('<b>Targets:</b> ${hl(targetText)}') && cfg.includes("${hl(trigger)}") && cfg.includes("${vsColored(vs)}"), "| the book labels it too:", src("../../book/build_rules.py").includes("<b>Targets:</b> {inline(target.group(1))}"));
console.log("a tier's effect after its damage with '; ':", pv.includes("lines[lines.length - 1] += `; ${e}`"), "| the area button stays on the chat card:", ac.includes("const areaRow = areaButton(it) ? ") && !ac.includes("areaPlaced"), "| the placement outline:", tp.includes("const limit = within && user ? emanationCells(tokenCells(user), within) : []"));
console.log("the merged card: no collapse, the selector gone when done:", !dm.includes('rows.every(r => r.applied || r.blocked)) await msg.setFlag("twod12", "collapsed", true)') && dc.includes("(pending ? `<div class=\"dtotal\"><select"), "| the Save card's text line:", inl.includes('<div class="sextraline">'));
console.log("--- a rung's effect when the Escalation reaches it");
const au = src("module/automation.mjs"), es = src("module/escalation.mjs"), tw = src("module/twod12.mjs");
console.log("applyReachedEffects (only in an encounter, only once per Effect):", au.includes("export async function applyReachedEffects(") && au.includes("if (!actor || !globalThis.game?.combat?.started) return 0") && au.includes("if (has(t.fxUuid)) continue"), "| the hook on a rise and at the start:", (es.match(/twod12\.escalationChanged/g) ?? []).length === 2 && tw.includes('Hooks.on("twod12.escalationChanged"'));
console.log("--- inline Actions");
const ef = src("module/effects.mjs");
console.log("the setting and its lifecycle:", src("module/data.mjs").includes("inlineAction: str()"), cfg.includes('inline: "Grants an Action while active"'), ef.includes("async function createInlineActions(") && ef.includes("export async function findAction(") && ef.includes('i.getFlag?.(F, "inlineOf") === fx.id'), "| in the Class group:", src("module/actor-sheets.mjs").includes('i.getFlag("twod12", "inlineOf") ? "Class"'));
const beacon = G.loadCards().find(c => c.name === "Beacon"), step = G.inlineCards(beacon)[0], sys = G.cardSystem(step);
console.log("Beacon's Step from the card:", `${step.name} | ${step.category} | ${step.cost} ${step.frequency} | ${step.interrupt} | ${step.text}`, "| as an item:", `${sys.reactionKind} ${sys.frequency} ${sys.versions[0].ap} AP, ${sys.versions[0].effects}`, "| flavor:", sys.flavor);
const item = C.docs.find(d => d.name === "Beacon's Step"), aura = C.docs.find(d => d.name === "Beacon" && d.type === "effect");
console.log("in the compendium:", item ? `${item.pack}/${item.type} in ${item.folder}` : "missing", "| the Beacon effect carries it:", aura.system.settings.some(x => x.type === "inline" && x.inlineAction === C.uuidOf("actions", "Beacon's Step")), "| the aura setting still first:", aura.system.settings[0].type);
const bk = C.docs.find(d => d.name === "Beacon" && d.type === "action");
console.log("Beacon: Area", JSON.stringify(bk.system.area), "| distance", JSON.stringify(bk.system.distance ?? ""), "| text:", bk.system.versions[0].effects);
console.log("the book: a nested card with its own Frequency color, the Interrupt and the Effects:", /<div class="acard inl" style="--fq:#185FA5[^"]*"><div class="ahead"><b>Beacon's Step<\/b><span class="afreq">Round<\/span><span class="aps"><span class="rmark">0R<\/span>/.test(src("../../book/paladin.html")), src("../../book/paladin.html").includes("<b>Interrupt:</b> An ally in the Aura takes damage."));
console.log("--- Word of Radiance's chain");
const w = C.docs.find(d => d.name === "Word of Radiance");
console.log("after:", w.system.versions.map(v => `${v.ap} AP: ${v.after}`).join(" | "), "| no notes line:", !w.system.description);
const mv = I.parseInline("Move", "pushed|distance:1|t3:2|pick:yes|from:area"), cd = I.parseInline("Condition", "prone|crit:yes");
console.log("the chip options:", JSON.stringify({ from: mv.from, pick: mv.pick, t3: mv.tiers.t3 }), "| the distance by Tier:", I.tierDistance(mv, 2), I.tierDistance(mv, 3), "| Prone on the Criticals only:", cd.crit === true);
const mvs = src("module/move.mjs");
console.log("move.mjs: the area's center as the origin, the distance per creature, the pusher named:", mvs.includes("function areaOrigin(ctx)") && mvs.includes('cfg.from === "area" ? areaOrigin(ctx)') && mvs.includes("function distanceFor(cfg, ctx, token, N)"), "| the cards keep the point and the Critical:", ac.includes("crit: !!chk?.crit, areaPoint: areaOutcome?.point ?? null") && dc.includes("crit: !!r.crit") && dm.includes("areaPoint: f.areaPoint ?? null"));
console.log("Rebuke's note:", G.loadCards().find(c => c.name === "Rebuke").foundry.automationNote);
