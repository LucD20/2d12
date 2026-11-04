// Run with: node tools/tests/run.mjs (or node tools/tests/t178.mjs)
// Pack R-core (2026-11-04): the damage pools are [V] Vigor and [R] Resolve (were [B] Body and [M] Mind). Until R-Foundry's second version every
// parser reads both spellings, and Foundry keeps its B / M pool keys: the card loader, the compendium generator, the Action editor's tier text,
// the inline Save, the card colors, and the ruler. The same damage in either spelling must give the same result.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
const G = await import(ROOTURL + "tools/cardgen.mjs");
const L = await import(new URL("../../../../book/cards/load.mjs", import.meta.url).href);
const C = await import(ROOTURL + "module/config.mjs");
const R = await import(new URL("../../../../book/ruler/spec.mjs", import.meta.url).href);
void rootPath;
const pairs = [["[V] 1[W] + [Mod] + [R] 1d6 Ho", "[B] 1[W] + [Mod] + [M] 1d6 Ho"], ["[V] [Mod] Pi", "[B] [Mod] Pi"], ["[R] 2d8 Ho", "[M] 2d8 Ho"]];
console.log("tier tokens (Tier 1):", pairs.map(([n, o]) => `${G.tierTokens(n, true, 1)} ${G.tierTokens(n, true, 1) === G.tierTokens(o, true, 1) ? "=" : "!="} old`).join(" | "));
console.log("read as damage:", pairs.every(([n, o]) => L.isDamage(n) && L.isDamage(o)));
const E = await import(ROOTURL + "module/gen.mjs");
const save = p => E.convertEffects(`Appeal Save: 1d6 / 1d4 / 0 [${p}] Holy`);
console.log("inline Save:", save("R"), "| the same as [M]:", save("R") === save("M"), "| [V] as [B]:", save("V") === save("B"));
const pretty = s => C.prettyDamage(s).replace(/\s+/g, " ");
console.log("card colors the same:", pairs.every(([n, o]) => pretty(n) === pretty(o)), "| a Resolve tag is the brain:", pretty("[R] 1d6").includes("fa-brain"));
const d = s => JSON.stringify(R.parseDamage(s));
console.log("ruler the same:", pairs.every(([n, o]) => d(n) === d(o)), "| Resolve counted as Mind:", R.parseDamage("[V] 1[W] + [R] 2d8").mind.dice.length === 1);
