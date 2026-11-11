// Run with: node tools/tests/run.mjs (or node tools/tests/t201.mjs)
// v0.0.262 (Lucas's test of v0.0.261: "I see no way to edit Zone (the placed area)"): the Zone setting's fields on the Effect sheet (who, the heal,
// the carried Effect by drop), the Grant's "half on a Tier 3" box, the Version's "Area rounds" in the Versions editor.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const st = src("templates/parts/settings.hbs"), sheet = src("module/item-sheet.mjs"), ve = src("templates/versions-editor.hbs"), vm = src("module/versions.mjs");
console.log("the Zone block:", st.includes("{{#if isZone}}") && st.includes('data-field="zoneWho"') && st.includes('data-field="zoneHeal"') && /isZone[\s\S]*?fx-drop[\s\S]*?Drop the Effect they carry while inside/.test(st));
console.log("the sheet gives it its fields:", sheet.includes('isZone: x.type === "zone", zoneWho: x.zoneWho ?? "allies", zoneHeal: x.zoneHeal ?? ""') && sheet.includes('grantOn: x.grantOn || x.halfOn || (x.halfT3 ? "t3" : "")'));
console.log("the Grant's Tier 3 box:", st.includes('data-field="grantOn"') && st.includes('data-field="grantDo"') && st.includes('data-field="grantText"'));   // v0.0.264: "On [a result], [what happens]"
console.log("the Version's Area rounds:", ve.includes('data-field="areaRounds"') && vm.includes("areaRounds: v.areaRounds ?? 0") && vm.includes('f === "areaSize" || f === "areaRounds"'));
console.log("the setting is offered:", src("module/config.mjs").includes('zone: "Zone (the placed area)"'));
