// Run with: node tools/tests/run.mjs (or node tools/tests/t311.mjs)
// v0.0.508 (Lucas on v0.0.507, tumble-pass failed: "Tumble didnt send the message to the chat, just asked to move the token, so no check happened"):
// a movement that passes enemies is not a movement-only Action (actions.mjs pureMove), so Tumble posts its card; "A or B Check" makes a button for
// each (gen.mjs convertEffects: Tumble, Aid, Break Free's Body or Instinct).
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.foundry ??= { utils: {} };
await import(ROOTURL + "tools/content.mjs");
const A = await import(ROOTURL + "module/actions.mjs"), G = await import(ROOTURL + "module/gen.mjs");
const { BASIC_ACTIONS: B } = await import(ROOTURL + "module/basic-data.mjs");
const mv = new Set(["move"]);
console.log("Advance is movement-only:", !!A.pureMove({ traits: mv }, B.advance.versions[0], "advance"), "| Tumble 1 AP:", A.pureMove({ traits: new Set(B.tumble.traits) }, B.tumble.versions[0], "tumble"), "| Tumble 2 AP:", A.pureMove({ traits: new Set(B.tumble.traits) }, B.tumble.versions[1], "tumble"));
console.log("A or B Check:", G.convertEffects("make an Appeal or Instinct Check against"));
console.log("one Check still one button:", G.convertEffects("an Instinct Check against the DC"), "|", G.convertEffects("DC 14 Body Check"));
console.log("Tumble's card line:", B.tumble.lines.map(l => l.text).join(" ").match(/an @Check\[appeal(\|dc:targets)?\]\{Appeal Check\} or @Check\[instinct(\|dc:targets)?\]\{Instinct Check\}/) ? "both buttons" : "missing");
console.log("Aid's card:", JSON.stringify(B.aid).includes("@Check[appeal]{Appeal Check} or @Check[instinct]{Instinct Check}") ? "both buttons" : "missing");
