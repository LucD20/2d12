// Run with: node tools/tests/run.mjs (or node tools/tests/t288.mjs)
// v0.0.459 (the backlog audit, 2026-11-19; book, Blinded: "Every square is Difficult Terrain for you, as Darkness is for a creature that can't see
// in it"): a Blinded creature sees Darkness everywhere (light.mjs seenLight / sightSenses), so every movement cost check counts its squares double.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const L = await import(ROOTURL + "module/light.mjs");
const blind = { system: { senses: { darksight: true } }, statuses: new Set(["blinded"]) }, seeing = { system: { senses: { darksight: true } }, statuses: new Set() };
console.log("bright light, Blinded:", L.seenLight("bright", L.sightSenses(blind)), "| Dark Sight, not Blinded, in darkness:", L.seenLight("dark", L.sightSenses(seeing)), "| no senses:", L.seenLight("dim", {}));
const mv = src("module/move.mjs");
console.log("every movement check reads sightSenses:", (mv.match(/sightSenses\((?:doc|tok)\.actor\)/g) ?? []).length, "| none left on raw senses:", !/seenLight\([^)]*\)[^)]*system\?\.senses/.test(mv) && !/const senses = (?:doc|tok)\.actor\??\.system\?\.senses/.test(mv));
