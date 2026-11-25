// Run with: node tools/tests/run.mjs (or node tools/tests/t243.mjs)
// v0.0.357 PACK ACTION-SHEET, session 2 (Lucas's pick: mockup G2, foundry/mockups/generate-action.html): Generate Action reads a card written as text
// (gencard.mjs): the name line, the traits, Trigger, Targets, Distance and Vs., a line per Tier, Critical, Effects, the Flavor; every line is
// marked read or not. An Action written back as that text reads back the same (every Action of the compendium); filling an Action keeps its
// Versions' Effects, steps and buttons (the old window dropped the Effects and the steps).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(new URL("../../", import.meta.url));
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
const stub = () => { globalThis.foundry = deep(); globalThis.foundry.utils = { deepClone: o => JSON.parse(JSON.stringify(o ?? null)) }; };
stub(); globalThis.Hooks = { on() {}, once() {} }; globalThis.CONFIG = { Canvas: {}, statusEffects: [] }; globalThis.game = { settings: { get: () => false }, user: {} }; globalThis.ui = {}; globalThis.canvas = {};
for (const n of ["Combat", "Roll", "ChatMessage", "Actor", "Item", "TextEditor", "Application", "Token", "TokenDocument", "Region", "RegionDocument"]) globalThis[n] ??= class {};
const C = await import(ROOTURL + "tools/content.mjs"); stub();
const G = await import(ROOTURL + "module/gencard.mjs");
const W = await import(ROOTURL + "module/genwindow.mjs");
const src = n => fs.readFileSync(ROOT + n, "utf8");
const dmg = l => (l ?? []).map(i => `${i.pool}${i.useW ? ` ${i.wCount}W` : ""}${i.dice ? ` ${i.dice}` : ""}${i.useAt ? " Mod" : ""}${i.subtype ? ` ${i.subtype}` : ""}`).join(" + ");

console.log("--- a pasted card (Rebuke, as the mockup writes it)");
const REBUKE = `Rebuke                         Divine Power 1 · Turn · 1R
[Power] [Save] [Divine]
Trigger: An enemy within 5 squares makes a [Strike] Action against an ally.
Targets: The triggering creature
Distance: 5 sq. · Vs. Appeal Save
Tier 1: [R] 1d8 Ho; Pushed 2, and Frightened of you for 1 round.
Tier 2: [R] 1d6 Ho; Pushed 1.
Tier 3: No effect.
Strike my friends, and feel why you should not have.`;
const rb = G.parseCard(REBUKE), rs = G.cardSystem(rb);
console.log("every line read:", rb.lines.every(l => l.ok), rb.lines.length, "|", rb.lines.map(l => l.as).join(" / "));
console.log("name:", rb.name, "| category:", rb.category, rb.level, "| frequency:", rb.frequency, "| traits:", rb.traits.join(","), "| a Reaction:", rb.reaction, rb.reactionKind, "| moment:", rb.moment);
console.log("system: vs", rs.system.vs, "| distance", rs.system.distance, "| used on", rs.system.momentTarget, "| flavor:", rs.system.flavor);
const v = rs.system.versions[0];
console.log("its Version:", v.ap, "AP | tiers:", dmg(v.t1), "/", dmg(v.t2), "/", dmg(v.t3) || "none", "| the steps:", v.after);
console.log("the Tier text stays words (no button twice):", v.x1, "|", v.x2, "|", v.x3);

console.log("--- several Versions, and a line that isn't read");
const sm = G.parseCard(`Smite    Divine Power 1 · Round · 1/2/3 AP\n[Signature] [Weapon] [Strike] [Divine]\nTargets: One creature\nDistance: weapon\nTier 1: [V] 1[W] | [V] 1[W] + [R] 1d6 Ho | [V] 1[W] + [R] 1d8 Ho\nTier 2: [V] 1[W] + [R] 1d6 Ho | [V] 1[W] + [R] 2d6 Ho | [V] 1[W] + [R] 2d8 Ho\nTier 3: [V] 1[W] + [R] 1d8 Ho | [V] 1[W] + [R] 2d10 Ho | [V] 1[W] + [R] 3d8 Ho\nEffects (3 AP): You or one ally in the light gain Guard 1d8.\nsomething the reader doesn't know\nYour weapon blazes with holy light.`);
const ss = G.cardSystem(sm).system;
console.log("3 Versions from 1/2/3 AP:", ss.versions.map(x => x.ap).join(","), "| a row across them:", ss.versions.map(x => dmg(x.t3)).join(" / "), "| Effects (3 AP):", ss.versions.map(x => (x.effects ? "yes" : "-")).join(""));
console.log("the unread line:", sm.lines.filter(l => !l.ok).map(l => l.text).join(" / "), "| the Flavor:", sm.flavor);
const blocks = G.parseCard(`Cut\n1 AP\nTier 1: [V] 1d4 Sl\nTier 3: [V] 1d8 Sl; Prone\n2 AP\nTier 3: [V] 2d8 Sl\nCritical: Immobilized (EoT)`), bs = G.cardSystem(blocks).system;
console.log("a block per Version:", bs.versions.map(x => `${x.ap}: ${dmg(x.t1) || "-"} / ${dmg(x.t3)}${x.critical ? " crit" : ""} [${x.after}]`).join(" | "));
console.log("an Area line:", JSON.stringify(G.areaOf("2 Emanation")), JSON.stringify(G.areaOf("Line 10")), JSON.stringify(G.areaOf("Aura 2")), "| moments:", ["An ally within 5 squares would go Down.", "A Strike would damage an ally within 5 squares.", "An enemy within 10 squares moves closer to you.", "An ally takes damage."].map(G.momentOf).join(", "));

console.log("--- every Action of the compendium, written as text and read back");
const acts = [...C.docs, ...C.deprecatedDocs.filter(d => C.REMOVED_B5.includes(d.name))].filter(d => d.type === "action"), norm = l => JSON.stringify((l ?? []).map(i => [i.pool || "B", !!i.useW, i.useW ? i.wCount || 1 : 1, i.dice || "", !!i.useAt, i.subtype || ""]));
let same = 0; const diff = [];
for (const d of acts) {
  const s = d.system, card = G.parseCard(G.cardText(d.name, s)), o = G.cardSystem(card, s).system, bad = [];
  if (card.name !== d.name) bad.push("name");
  if (JSON.stringify([...o.traits].sort()) !== JSON.stringify([...(s.traits ?? [])].sort())) bad.push("traits");
  if ((o.frequency || "") !== (s.frequency || "") || !!o.reaction !== !!s.reaction || (o.distance || "") !== (s.distance || "")) bad.push("head");
  if (o.versions.length !== (s.versions ?? []).length) bad.push("versions");
  else (s.versions ?? []).forEach((x, i) => { const w = o.versions[i]; if (["t1", "t2", "t3"].some(k => norm(x[k]) !== norm(w[k])) || !!x.noTiers !== !!w.noTiers) bad.push(`${x.ap} AP tiers`); if ((x.after || "") !== (w.after || "")) bad.push(`${x.ap} AP steps`); if (JSON.stringify(x.fx ?? {}) !== JSON.stringify(w.fx ?? {}) && (x.fx?.all?.length || x.fx?.t2?.length)) bad.push(`${x.ap} AP Effects`); });
  if (card.lines.some(l => !l.ok)) bad.push("a line not read");
  if (bad.length) diff.push(`${d.name} (${bad.join(", ")})`); else same++;
}
console.log(`${same} of ${acts.length} the same | not: ${diff.join("; ")}`);
console.log("  (Divine Retribution is a Split Action: two Versions per cost; Hide has no Version and gets one; v0.0.409: an Art's Modes are not in the text format yet)");

console.log("--- filling an Action keeps what the text doesn't hold");
// v0.0.409 (pack F2): the old Smite (Effects on each Version, 3 AP steps) left with pack R's Paladin; Lantern of Faith's Effects and Bulwark of Faith's steps
const lan = acts.find(d => d.name === "Lantern of Faith").system, back = G.cardSystem(G.parseCard(G.cardText("Lantern of Faith", lan)), lan).system;
const bw = acts.find(d => d.name === "Bulwark of Faith").system, bwb = G.cardSystem(G.parseCard(G.cardText("Bulwark of Faith", bw)), bw).system;
console.log("Lantern of Faith: its Effects kept:", back.versions.map(x => x.fx.all.length).join(","), "| Bulwark of Faith's steps kept:", bwb.versions[0].after === bw.versions[0].after);
const shove = acts.find(d => d.name === "Shove").system, sb = G.cardSystem(G.parseCard(G.cardText("Shove", shove)), shove).system;
console.log("Shove (not written with Lucas yet): its buttons stay buttons, no steps added:", sb.versions.every(x => !x.after) && sb.versions.some(x => /@Move\[/.test(`${x.x2}${x.x3}`)));

const ex = G.cardSystem(G.parseCard(W.SAMPLE));
console.log("v0.0.358: the example makes no warning (a Tier 2 alone is a step now):", ex.notes.length, ex.notes.join(" / "), "|", ex.system.versions.map(x => x.after).join(" || "));
console.log("--- the window");
const h = W.genHtml({ text: "", target: "Create in the world", help: false }), r = W.readHtml(rb, rs.system, rs.notes);
console.log("one text box, the list, the card:", h.includes("data-gc-text") && h.includes("data-gc-read") && h.includes("data-gc-card"), "| a ✓ per read line:", (r.match(/<li class="ok">/g) ?? []).length, "| the example reads whole:", G.parseCard(W.SAMPLE).lines.every(l => l.ok));
const gw = src("module/genwindow.mjs"), ga = src("module/genaction.mjs");
console.log("the system's window, not a Foundry default one:", !/DialogV2/.test(gw) && !/DialogV2/.test(ga) && gw.includes("extends (ApplicationV2"), "| opened as before:", ga.includes("export async function openActionGenerator({ actor = null, item = null } = {})"), "| the box isn't redrawn while typing:", gw.includes('el.addEventListener("input"') && gw.includes("this._refresh()"));
