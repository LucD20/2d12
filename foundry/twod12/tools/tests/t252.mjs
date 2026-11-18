// Run with: node tools/tests/run.mjs (or node tools/tests/t252.mjs)
// v0.0.376 (PACK STYLE-2): the HUD (module/hudmodel.mjs draws it, module/hud.mjs runs it): an NPC's two lines, a PC's Quick row and categories,
// the list of several tokens, the empty bar, a panel; the stamps' clicks; "Skip roll dialog" (rollwindow.mjs askAction); the pick bar in the HUD.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const H = await import(ROOTURL + "module/hudmodel.mjs");
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const A = (id, name, fq, aps, x = {}) => ({ id, name, fq, versions: aps.map(ap => ({ ap, label: `${ap} AP` })), ...x });
console.log("--- an NPC");
const npc = { name: "Orc Warrior", sub: "Standard · CV 100", rankKey: "standard", groups: { basic: [A("a", "Cleaver", "#3B6D11", [1])], special: [A("b", "Brutal Swing", "#185FA5", [2])], react: [{ id: "c", name: "Hold the Line", fq: "#185FA5", versions: [{ ap: 1, label: "1R" }] }], esc: [] },
  saves: [{ key: "body", label: "Body", short: "Bo", value: 2 }, { key: "appeal", label: "Appeal", short: "Ap", value: -1 }] };
const nh = H.npcHudHtml(npc), blocks = nh.split('<div class="hud-blk ').slice(1).map(b => strip(`<x class="${b}`));
console.log("v0.0.381: beside the name (Escalation over the Saves):", blocks[0], "| in the middle:", blocks[1]);
console.log("the rank's ring:", nh.includes('class="hud-id rk-standard"'), "| a stamp opens its Version:", nh.includes('data-hud="use" data-ap="2"'), "| the name right-clicks to the card:", nh.includes('<b data-hud="card">Cleaver</b>'), "| v0.0.381: nothing hidden, the lines wrap (no +N more):", !nh.includes('data-hud="more"'));
console.log("--- a PC");
const pc = { name: "Aveline", sub: "Human Paladin · Level 1", open: "react", quick: [A("s", "Smite", "#185FA5", [1, 2], { pc: true }), { id: "r", name: "Rebuke", fq: "#0F6E6E", pc: true, versions: [{ ap: 1, label: "1R", off: true, used: true, why: "Reaction AP spent" }] }] };
const ph = H.pcHudHtml(pc);
console.log(strip(ph));
console.log("the open category:", ph.includes('class="cat on" data-hud="cat" data-cat="react" aria-pressed="true"'), "| Skills later:", ph.includes('class="cat later"'), "| a spent Version struck:", ph.includes('class="hv no used" disabled'), "| v0.0.383: slots, 2 filled and 6 empty:", (ph.match(/class="qslot full"/g) ?? []).length, (ph.match(/class="qslot" aria-label/g) ?? []).length, "| nothing pinned, 8 empty slots:", (H.pcHudHtml({ ...pc, quick: [] }).match(/class="qslot"/g) ?? []).length, "| v0.0.381: the categories first, Quick after:", ph.indexOf("hud-cats") < ph.indexOf("hud-quick"));
console.log("--- several, none, a panel");
console.log(strip(H.listHudHtml([{ id: "t1", name: "Orc Warrior 1", sub: "Standard", rankKey: "standard" }, { id: "t2", name: "Goblin Sneak", sub: "Minion" }])), "| a click selects it:", H.listHudHtml([{ id: "t1", name: "x" }]).includes('data-hud="pick" data-token="t1"'));
console.log(strip(H.emptyHudHtml()));
console.log(strip(H.hudPanelHtml("Escalation", [{ text: "Radiant Zeal", sub: "Passive, Escalation 1" }, { action: A("f", "Final Verdict", "#c9821f", [2]) }, { button: "Body Save", hud: "attr", data: { key: "body", save: "1" } }])));
console.log("--- the wiring");
const hud = src("module/hud.mjs"), rw = src("module/rollwindow.mjs"), pb = src("module/pickbar.mjs"), tw = src("module/twod12.mjs");
console.log("three client settings:", ["hudShow", "hudSkipDialog", "hudHotbar"].every(k => hud.includes(`game.settings.register(F, "${k}"`) && /scope: "client"/.test(hud)), "| Skip roll dialog, Shift the other way:", hud.includes('const skip = !!setting("hudSkipDialog", false) !== !!shift;') && hud.includes("skipDialog: skip"));
console.log("the dialog skipped unless something blocks the roll:", rw.includes("if (o.skip) { try { const st = RD.newState(o.inp, o.state); if (!RD.blockedReason(o.inp, st)) return Promise.resolve(RD.result(o.inp, st)); }"), "| the pick bar asks in the HUD:", pb.includes("slot.append(bar); hud.hudAsking(true, side);") && pb.includes("if (slot) hud.hudAsking(false);"), "| registered:", tw.includes("HUD.registerHudSettings(); HUD.registerHud();"));
console.log("follows the selection only:", hud.includes("canvas?.tokens?.controlled") && !hud.includes("combat.combatant.actor"), "| the hotbar moved in:", hud.includes('if (hb.parentElement !== slot) slot.append(hb);'), "| Quick pins on the actor:", hud.includes('actor.setFlag(F, "hudQuick"'));
console.log("--- v0.0.379: placed on the screen, between the scene controls and the sidebar");
globalThis.foundry ??= { applications: { api: {} } };
const HU = await import(ROOTURL + "module/hud.mjs");
console.log("a 1180 px window, the sidebar at 830:", JSON.stringify(HU.hudBox({ controlsRight: 92, sidebarLeft: 830, width: 1180, height: 1000 })), "| the sidebar collapsed:", JSON.stringify(HU.hudBox({ controlsRight: 92, sidebarLeft: 1140, width: 1180, height: 1000 })), "| the hotbar left outside (top at 940):", JSON.stringify(HU.hudBox({ controlsRight: 92, sidebarLeft: 830, width: 1180, hotbarTop: 940, height: 1000 })));
