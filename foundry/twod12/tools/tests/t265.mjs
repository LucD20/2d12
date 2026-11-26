// Run with: node tools/tests/run.mjs (or node tools/tests/t265.mjs)
// v0.0.421: the audit of the playtest 5 passes (v0.0.418 to v0.0.420; Lucas, 2026-11-18: "Make one in-depth audit of everything in these passes").
// What it found and fixed, one line each; the pure parts run, the wiring is read from the source.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
class Fd { constructor(o) { this.o = o; } }
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [] }; globalThis.Hooks = { on() {}, once() {} }; globalThis.ui = { notifications: { warn() {}, info() {} } };
globalThis.game = { settings: { get: () => true }, user: { id: "u", targets: new Set() }, combat: null };
globalThis.foundry = { abstract: { TypeDataModel: class { static migrateData(s) { return s; } } }, data: { fields: { SchemaField: Fd, NumberField: Fd, StringField: Fd, BooleanField: Fd, ArrayField: Fd, SetField: Fd, HTMLField: Fd } },
  applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const act = src("module/actions.mjs"), inl = src("module/inline.mjs"), mv = src("module/move.mjs"), tw = src("module/twod12.mjs");

console.log("--- the automation");
const IN = await import(ROOTURL + "module/inline.mjs");
console.log("a Tier's conditions, not one written after a movement:", JSON.stringify(IN.tierConditionChips("@Move[slid|distance:1], then @Condition[grabbed]{Grabbed}.")),
  "| Snap Shot's:", JSON.stringify(IN.tierConditionChips("@Condition[hindered|eot]")), "| Trip's:", JSON.stringify(IN.tierConditionChips("@Condition[prone]")));
console.log("Reckoning: a chain chip that is also in a Tier waits for the Tier:", act.includes("const inTier = c => {") && act.includes("(chainSteps(version.after)[0]?.chips ?? []).filter(c => !inTier(c))"));
console.log("a no-damage Tier's conditions apply on use (Trip, Thwart Cut, Trick Shots):", act.includes("const tierConds = t => (ridesOn(t) ? [] : tierConditionChips(") && act.includes("else await giveConds(tier, isSelf ? [actor.uuid] : targets.map(t => t.uuid), chk?.crit);"));
console.log("Immobilized from a Tier: the user's Modifier (its DC):", inl.includes("Number.isFinite(ctx.attrVal) ? { mod: ctx.attrVal }") && src("module/ccdamage.mjs").includes("attrVal: Number.isFinite(s.originMod) ? s.originMod : null"),
  "| formula options worked out (through handleInline):", inl.includes('return handleInline("Condition", parseInline("Condition", m[1]), ctx);'));
console.log("Judge asks nothing (v0.0.527: no reduction, so no question):", !src("module/judge.mjs").includes("askJudge"),
  "| Apply Effect checks the owner:", inl.includes("if (!user.isOwner) return ui.notifications.warn("));

console.log("--- movement");
const MV = await import(ROOTURL + "module/move.mjs");
const tok = d => ({ document: { disposition: d } });
console.log("Steadiness: two neutral creatures aren't allies:", MV.asksSteadiness(tok(0), tok(0)), "| asked on the moved creature's player's screen:", mv.includes("const choice = await askOwner(target.actor,"));
console.log("off its turn only a Reaction's squares of this turn:", MV.turnStamp({ round: 2, turn: 3 }), mv.includes('if (combat?.combatant?.id !== c.id) await c.setFlag(F, "offTurnAt", turnStamp(combat));'),
  "| the Setup's name never left set:", src("module/setup.mjs").includes('} finally { setLog(""); if (cfg.still)'));

console.log("--- the chat and the sheets");
console.log("the right-click caught first, Foundry's menu stopped:", tw.includes("ev.preventDefault(); ev.stopPropagation();") && /addEventListener\("contextmenu"[\s\S]*?\}, true\);/.test(tw),
  "| a chip dragged from the chat only:", tw.includes('if (!inl.closest?.(".chat-message, .message, #chat-log")) return;'));
const CS = src("module/chatscroll.mjs");
console.log("a scroll the system makes unpins the chat:", CS.includes("export function releaseChatLogs()") && src("module/ccdamage.mjs").includes("m.releaseChatLogs()"));
console.log("the Class Levels Editor's section titles save again:", src("module/classeditor.mjs").includes('class="ce-title" value="${esc(x.title)}" data-title="${x.id}"'));
const PB = await import(ROOTURL + "module/pickbar.mjs");
console.log("pick bar: a hover only on an option that is off:", PB.pickBarHtml({ options: [{ id: "a", label: "A", tip: "why" }] }).includes("data-tooltip"), PB.pickBarHtml({ options: [{ id: "a", label: "A", tip: "why", off: true }] }).includes('data-tooltip="why"'));
const EL = await import(ROOTURL + "module/enclog.mjs");
console.log("Encounter Log, full names numbered:", JSON.stringify(EL.fullNames([{ id: "a", name: "Goblin Sneak" }, { id: "b", name: "Orc Warrior" }, { id: "c", name: "Goblin Sneak" }])),
  "| a struck line's reason (why it is off):", src("module/enclog.mjs").includes('${e.why ? ` data-tooltip="${esc(e.why)}"` : ""}'));
console.log("damage to itself counts with its side:", src("module/damagelog.mjs").includes("actorUuidOf(targetUuid) === actorUuidOf(originUuid) || sameSide("), "| the table's 7 columns:", src("module/damagelog.mjs").includes('colspan="7"'));
console.log("a Basic Action's new rating updated in place (not replaced):", src("module/basic.mjs").includes("export const ratingUpdates") && !src("module/basic.mjs").includes("au: sys.automation"));
console.log("the HUD's classes switch with its content (the jump):", src("module/hud.mjs").includes("const shape = (...on) =>") && !src("module/hud.mjs").includes("minHeight"));
console.log("Reach (X) on NPCs only:", src("module/config.mjs").includes('return a?.type === "npc" && n > 0 ? `Reach (${n})` : "Reach";'), "| the Frequency word on Reactions only:", src("module/pcsheet.mjs").includes('fqWord = reaction && FREQ_WORD[fq] ? FREQ_WORD[fq] : ""'));
console.log("a Slowed AP pip keeps its look on dark:", src("tools/build-theme.mjs").includes(".hm-ap i:not(.x)"));
console.log("--- the book");
const b = fs.readFileSync(ROOT + "../../book/rules-src/02-turns.md", "utf8");
// v0.0.422 (Lucas, the audit's question): no general per-giver rule; a card says when it stacks (Judge), Chapters 2 and 8 say "Unless a card says otherwise".
console.log("Stacking: Judge-type effects per giver; conditions keep Chapter 8's rule:", b.includes("**A card can say otherwise.** [[Judge]] does") && fs.readFileSync(ROOT + "../../book/rules-src/08-conditions.md", "utf8").includes("Unless a card says otherwise, a creature can't have the same condition twice"));
