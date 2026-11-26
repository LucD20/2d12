// Run with: node tools/tests/run.mjs (or node tools/tests/t315.mjs)
// v0.0.513 (the Hide package; Lucas, decided 2026-11-24, "Do the Hide package" 2026-11-25; book, Chapter 3 Hiding, Chapter 6, Chapter 7 Subtle):
// Hide, Sneak, Seek and Point Out as Basic Actions (basic-data.mjs from the book's cards); Hidden or Unsensed from Hide kept per creature (hide.mjs, the
// actor flag twod12.hide; senses.mjs perceive uses the worse of it and the senses); Hide's Tiers; Seek and Point Out one step better; Hide ends after an
// Action that isn't [Subtle], or when a creature gains Sight of you without High Cover; Sneak's movement (the flag sneaking; no Reactions from those it is
// Hidden to: moment.mjs); Seek targets by itself and ignores Senses, Hide and Seek need no Line of Effect (actions.mjs).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= { utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
const C = await import(ROOTURL + "tools/content.mjs");
const H = await import(ROOTURL + "module/hide.mjs");
const { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
for (const k of ["hide", "sneak", "seek", "pointOut"]) { const b = B[k]; console.log(`${b.name}: ${b.frequency} · ${b.versions.map(v => v.ap + " AP").join(" / ")} · [${b.traits.join(", ")}] · vs ${b.vs || "-"} · ${b.automation}`); }
console.log("Lean is Subtle:", B.leaning.traits.includes("subtle"), "| Interact isn't, with its note:", !B.interact.traits.includes("subtle"), JSON.stringify(B.interact).includes("is Subtle if the GM agrees")   /* v0.0.520: the cleanup audit's wording */, "| Sneak keeps Hide:", B.sneak.versions[0].effects.includes("sneak:yes"));
console.log("hideResult: T1", JSON.stringify(H.hideResult(1, { seesYou: false })), "| T2 unseen", H.hideResult(2, { seesYou: false }), "| T2 High Cover", H.hideResult(2, { seesYou: true, highCover: true }), "| T3 seen, no cover", JSON.stringify(H.hideResult(3, { seesYou: true, highCover: false })));
console.log("stepBetter:", H.stepBetter("unsensed"), JSON.stringify(H.stepBetter("hidden")), "| hideStateOf:", H.hideStateOf({ a: "unsensed", b: "x" }, "a"), JSON.stringify(H.hideStateOf({ b: "x" }, "b")));
const v = (st, o) => JSON.stringify(H.afterView(st, o));
console.log("afterView: unseen keeps", v("unsensed", { sees: false }), "| Unsensed, seen, High Cover", v("unsensed", { sees: true, highCover: true }), "| Unsensed, seen, none", v("unsensed", { sees: true }), "| Hidden, seen, High Cover", v("hidden", { sees: true, highCover: true }), "| Hidden, seen, none", v("hidden", { sees: true }));
console.log("Sneak: Unsensed seen during it", v("unsensed", { sees: true, sneaking: true }), "| Hidden seen during it", v("hidden", { sees: true, sneaking: true }), "| at the turn's end, no cover", v("hidden", { sees: true, sneaking: true, turnEnd: true }));
console.log("endsHide: Basic Attack", H.endsHide(new Set(["strike", "weapon"])), "| Sneak", H.endsHide(new Set(["move", "self", "subtle"])), "| an array", H.endsHide(["subtle"]));
console.log("the placeholder Hide gone:", !C.docs.some(d => d.name === "Hide" && d.system?.placeholder), "| Subtle is a Keyword:", src("module/config.mjs").includes('"magical", "subtle", "unfailing"'));
console.log("wired: perceive reads Hide", src("module/senses.mjs").includes('getFlag?.("twod12", "hide")'), "| Seek targets by itself", src("module/actions.mjs").includes("seekCandidates(selfToken, sq)"), "| no LoE needed", src("module/actions.mjs").includes("cov0?.noLoE && !noLoENeeded"), "| Seek ignores Senses", src("module/actions.mjs").includes("!it.area && !senseFree && selfToken"),
  "| Tiers applied", src("module/actions.mjs").includes('["hide", "seek", "pointOut"].includes(basicKey)'), "| ends after a non-Subtle Action", src("module/actions.mjs").includes("endHideAfterAction(actor, item)"), "| Sneak's flag", src("module/move.mjs").includes('c.setFlag(F, "sneaking", true)'), "| no Reactions", src("module/moment.mjs").includes("sneakHidden(sj, tk)"), "| registered", src("module/twod12.mjs").includes("m.registerHide()"));
