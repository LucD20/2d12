// Run with: node tools/tests/run.mjs (or node tools/tests/t215.mjs)
// v0.0.294 (the chat cards addendum, brief sections 12 and 13): the non-roll card (Opportunity Attack, Bulwark of Faith, Aim), its numbered steps
// and their gating, the granted Action's row, the Trigger above the Tier rows on a Save card. Logic only (module/noroll.mjs, chatcards.mjs, freeuse.mjs).
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), escapeHTML: s => s } };
globalThis.game = { settings: { get: () => false }, user: { id: "u1" }, messages: { contents: [] } }; globalThis.Hooks = { on() {}, once() {} };
const NR = await import(ROOTURL + "module/noroll.mjs");
const CC = await import(ROOTURL + "module/chatcards.mjs");
const FU = await import(ROOTURL + "module/freeuse.mjs");
const txt = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log("--- Bulwark of Faith: the numbered steps");
const bulwark = "@Guard[rally|who:pick|near:5] @Pause[After the damage] @Move[slid|distance:1]";
const steps = NR.stepsOf(bulwark, { guard: 9 });
console.log(steps.map((s, i) => `${i + 1} · ${s.label} · [${s.btn}]`).join(" | "), "| waits for the damage:", NR.waitsForDamage(bulwark));
console.log("buttons:", ["@Move[pushed|distance:2]", "@Condition[prone]", "@Heal[2d6]", "@Damage[1d6|type:Fi]", "@Guard[rally]"].map(c => NR.stepButton([c])).join(" | "), "| sides:", NR.stepsOf("@Heal[1d6|side:allies] @Condition[prone|side:enemies]").map(s => `${s.label} [${s.btn}]`).join(" | "));
// used from the Reactions message: step 1 ran by itself (Done); step 2 waits until the held damage lands
let m = { kind: "noroll", steps, afterDone: ["0|"], afterWait: { actor: "Actor.ally", token: "Scene.s.Token.ally" } };
console.log("while the damage is held: step 1", CC.stepState(m, 0).state, "| step 2", JSON.stringify(CC.stepState(m, 1)));
m = { ...m, afterWait: null };
console.log("after the damage landed: step 2", CC.stepState(m, 1).state);
console.log("used by hand (no held damage): step 2 before step 1:", JSON.stringify(CC.stepState({ kind: "noroll", steps, afterDone: [] }, 1)), "| then:", CC.stepState({ kind: "noroll", steps, afterDone: ["0|"] }, 1).state);
console.log("step 2 done:", CC.stepState({ ...m, afterDone: ["0|", "1|"] }, 1).state);

console.log("--- the granted Action");
const oaText = 'You can make a Weapon Attack (1A) against the triggering creature, as long as your weapon can target them. An NPC makes its Basic attack instead. <a class="twod12-inline" data-twod12-inline="Use" data-cfg="{&quot;target&quot;:&quot;Weapon Attack&quot;,&quot;label&quot;:&quot;Weapon Attack (1A)&quot;}"><i class="fa-solid fa-bolt"></i> Weapon Attack (1A)</a>';
const u = NR.splitUse(oaText);
console.log("Opportunity Attack: the text keeps:", JSON.stringify(txt(u.html)), "| the row:", u.name, "| target:", u.target, "| its button kept:", /data-twod12-inline="Use"/.test(u.anchor));
console.log("no @Use: unchanged:", NR.splitUse("Make a [Ranged] Weapon Attack (1A) with 1 Boon.").anchor === "");
console.log("the weapon reaches: Greatsword 1 sq., 1 away:", JSON.stringify(NR.reachProblem([{ name: "Greatsword", max: 1 }], 1, "Bandit Thug")), "| 3 away:", NR.reachProblem([{ name: "Greatsword", max: 1 }], 3, "Bandit Thug"), "| a Longbow too:", JSON.stringify(NR.reachProblem([{ name: "Greatsword", max: 1 }, { name: "Longbow", max: 40 }], 3, "Bandit Thug")));
// Aim: its effect grants one Weapon Attack, free, with 1 Boon; the effect's "Ignores cover: Low" goes with the grant (coverIgnored takes the grant's effect)
const g = { effect: { id: "fxAim", name: "Aim (Weapon Attack, 1 Boon)" }, index: 0, grant: { spec: "Weapon Attack", ap: 0, boons: 1, banes: 0, left: 1, count: 1 } };
const o = FU.grantOpts(g);
console.log("Aim's grant carries: free", o.free, "| AP", o.ap, "| Boons", o.boons, "| the source", o.label, "| its effect (for Ignores cover)", o.grant.effect.id);
const actorWith = left => ({ effects: { get: () => ({ getFlag: () => [{ left }] }) } });
const card = { effects: [{ id: "fxAim", index: 0, name: "Aim", actionName: "Weapon Attack", count: 1, ap: 0 }] };
console.log("the row before:", txt(FU.grantRowsHtml(actorWith(1), card)), "| a button:", /data-twod12="useGrant"/.test(FU.grantRowsHtml(actorWith(1), card)));
console.log("used once, then:", txt(FU.grantRowsHtml(actorWith(0), card)), "| no button:", !/data-twod12="useGrant"/.test(FU.grantRowsHtml(actorWith(0), card)), "| no sublines:", !/left|free|Aim:/.test(FU.grantRowsHtml(actorWith(1), card)));

console.log("--- the non-roll card");
const base = { kind: "noroll", name: "Opportunity Attack", freq: "atwill", cost: "1R", traitsHtml: "", tline: { targets: "The triggering creature", dist: "1 sq.", names: ["Bandit Thug"] },
  triggerHtml: "A creature within 1 square would leave a square during a Move Action or uses the Stand Action.", triggerLabel: "Interrupt", effectHtml: u.html, useHtml: u.anchor, useName: "Weapon Attack", flavor: "You punish anyone who moves carelessly near you." };
const h = CC.renderCard(base, CC.viewOf({ gm: true }));
const at = k => h.indexOf(k);
console.log("order: name, meta, Interrupt, diamond, text, Granted Action, Flavor:", at("cc-name") < at("cc-tline meta") && at("cc-tline meta") < at("cc-trigger plain") && at("cc-trigger plain") < at("cc-div") && at("cc-div") < at("cc-effect full") && at("cc-effect full") < at("cc-grant") && at("cc-grant") < at("cc-flavor"));
console.log("head:", txt(h.match(/<div class="cc-head">[\s\S]*?<\/div>/)?.[0]), "| meta line:", txt(h.match(/<div class="cc-tline meta">[\s\S]*?<\/div>/)?.[0]), "| the target at the bottom (v0.0.296):", txt(h.match(/<div class="cc-foot">[\s\S]*?<\/div>/)?.[0]), "| Interrupt:", txt(h.match(/<div class="cc-trigger plain">[\s\S]*?<\/div>/)?.[0]).slice(0, 40), "…");
console.log("granted row:", txt(h.match(/<div class="tline grantrow cc-grant[^"]*">[\s\S]*?<\/div><\/div>/)?.[0]), "| a sword for a Weapon Attack:", /cc-grant sword/.test(h), "| no category line, no Effects box, no stamp or ladder:", !/Basic Action|class="effects|cc-stamp|cc-ladder/.test(h));
const npc = CC.renderCard({ ...base, useName: "Basic attack" }, CC.viewOf({ gm: true }));
console.log("an NPC's:", txt(npc.match(/<span class="apside">[\s\S]*?<\/span>/)?.[0]));
const far = CC.renderCard({ ...base, useOff: "Bandit Thug is 3 sq. away: Greatsword reaches 1 sq." }, CC.viewOf({ gm: true }));
console.log("out of reach: no button, the reason:", !/data-twod12-inline="Use"/.test(far.match(/cc-grant[\s\S]*?<\/div><\/div>/)?.[0] ?? ""), "|", (far.match(/data-tooltip="([^"]*)"/) ?? [])[1]);
const bw = CC.renderCard({ kind: "noroll", name: "Bulwark of Faith", freq: "encounter", cost: "1R", tline: { targets: "The triggering creature", names: ["Nari"] }, triggerHtml: "A [Strike] Action would damage an ally within 5 squares.", triggerLabel: "Interrupt",
  effectHtml: "The target gains Guard equal to what one of their Rally Points heals, before the damage. After the damage, they are Slid 1.", steps, afterDone: ["0|"], afterWait: { actor: "Actor.ally" } }, CC.viewOf({ gm: true, author: true }));
console.log("Bulwark's steps:", [...bw.matchAll(/<div class="cc-step (\w+)">([\s\S]*?)<\/div>/g)].map(x => `${x[1]}: ${txt(x[2])}`).join(" | "), "| step 2 disabled with why:", /data-step="1"[^>]*disabled aria-disabled="true" data-tooltip="After the damage: it hasn't been applied yet"/.test(bw));
console.log("a player who isn't the author sees no buttons:", !/data-twod12="applyAfter"/.test(CC.renderCard({ kind: "noroll", name: "B", steps, afterDone: [] }, CC.viewOf({ gm: false }))));

console.log("--- the Save card: the Trigger above the Tier rows (section 12)");
const sv = CC.renderCard({ kind: "save", name: "Rebuke", freq: "turn", cost: "1R", saveName: "Appeal Save", dc: 13, tline: { targets: "The triggering creature", dist: "5 sq.", names: ["Bandit Thug"] }, creatures: [{ uuid: "t", name: "Bandit Thug" }], tiers: {}, triggerHtml: "An enemy within 5 squares makes a [Strike] Action against an ally.", triggerLabel: "Trigger" }, CC.viewOf({ gm: true }));
console.log("Save line, Trigger, diamond, Tier rows:", sv.indexOf("cc-savehead") < sv.indexOf("cc-trigger plain") && sv.indexOf("cc-trigger plain") < sv.indexOf("cc-div") && sv.indexOf("cc-div") < sv.indexOf("<b>Tier 1:</b>"));   // v0.0.431: the Tiers as quiet lines
