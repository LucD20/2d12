// Run with: node tools/tests/run.mjs (or node tools/tests/t272.mjs)
// v0.0.429 (pack CARD-ONE step 6, the differences t260 listed): Foundry's cards have the book's lines in the book's order, all 48: an Effect the
// card writes above the roll stays there (Rebuke, Reckoning, Hit and Run: load.mjs effectFirst, cardmodel.mjs), only the Tiers the card writes
// (Circling Shot, Trick Shots' Knock Back: no Tier 1 line; tiersWritten), a Basic Action's rules and notes as its Special lines (Weapon Attack,
// Steel Yourself: cardgen.mjs, basic.mjs). The attack chat card draws such an Effect once.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const all = [...C.docs, ...C.deprecatedDocs.filter(d => C.REMOVED_B5.includes(d.name)), ...C.pcs.flatMap(a => a.items ?? [])];
const card = n => all.find(x => x.name === n && x.type === "action");
const v0 = n => card(n).system.versions[0];
console.log("Effect above the roll:", ["Rebuke", "Reckoning", "Hit and Run"].map(n => `${n} ${!!v0(n).effectFirst}`).join(", "));
console.log("Tiers written:", `Circling Shot ${v0("Circling Shot").tiersWritten}`, `| Knock Back ${card("Trick Shots").system.versions.find(v => v.mode === "Knock Back")?.tiersWritten}`, `| Basic Attack ${v0("Basic Attack").tiersWritten ?? "(all)"}`);
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic.mjs");
console.log("Basic Actions' Specials:", `Basic Attack ${JSON.stringify(BASIC_ACTIONS.basicWeaponAttack.lines?.map(l => l.label))}`, `| Steel Yourself special ${!!BASIC_ACTIONS.rally.special}`);
const M = src("module/cardmodel.mjs");
console.log("the model places them:", M.includes("top.splice(effectAt, 0, ...vms[0].lines.splice(k, 1))") && M.includes("written.includes(l.slice(-1))") && M.includes('special: it.special ? L("Special", it.special, "rich") : null'));
console.log("the attack chat card draws such an Effect once:", src("module/chatcards.mjs").includes('!(m.card?.top ?? []).some(l => l.label === "Effect")'));
const t260 = fs.readFileSync(ROOT + "tools/tests/expected/t260.txt", "utf8");
console.log("t260's parity:", (t260.match(/the same lines: (\d+) of (\d+)/) ?? []).slice(1).join(" of "));
// v0.0.430 (the audit's gap: Reckoning's "Pushed 2" on its Save card pushed again): an Effect that runs by itself on use is drawn as words there
globalThis.foundry ??= { applications: { api: { ApplicationV2: class {} } } };
const CLm = await import(ROOTURL + "module/cardlines.mjs");
console.log("a self-running Effect as words on the Save card:", CLm.plainChips('is <a class="twod12-inline" data-cfg="{}"><i></i> <span class="ti-name">Pushed 2</span></a>.') === 'is <span class="ti-done">Pushed 2</span>.' && src("module/actions.mjs").includes("plainEffect: saveAct && !version.noTiers"));
