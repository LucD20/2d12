// Run with: node tools/tests/run.mjs (or node tools/tests/t327.mjs)
// v0.0.531 (Lucas on v0.0.530, hq-lingering: Foundry's Token HUD "is showing above every window, including the sheet, the lingering etc"):
// v0.0.501 gave Foundry's #hud an inline z-index of 1000 (hudhp.mjs hpHud), over every window (z 100 up). It now sits between the system's
// HUD bar (z 60) and the windows. Fails if a z-index of 100 or more comes back on #hud, or a CSS rule lifts #hud / #token-hud / #interface.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
globalThis.foundry ??= {}; globalThis.foundry.applications ??= { api: { ApplicationV2: class {}, DialogV2: {} } };
await import(ROOTURL + "tools/content.mjs");
const H = await import(ROOTURL + "module/hudhp.mjs");

const hh = src("module/hudhp.mjs"), css = src("styles/system.css") + "\n" + src("styles/theme.css");
const bars = [...css.matchAll(/\.twod12-hud\.floating\s*\{[^}]*z-index:\s*(\d+)/g)].map(m => Number(m[1]));
console.log("--- the Token HUD's layer");
console.log("HUD_LAYER_Z:", H.HUD_LAYER_Z, "| the system's HUD bar's z:", bars.join(", "), "| above the bar:", bars.every(z => H.HUD_LAYER_Z > z), "| under the windows (100):", H.HUD_LAYER_Z < 100);
console.log("#hud's inline z is HUD_LAYER_Z:", hh.includes("layer.style.zIndex = String(HUD_LAYER_Z);"), "| no other z on it:", (hh.match(/style\.zIndex\s*=/g) ?? []).length === 1, "| the old 1000 gone:", !/zIndex\s*=\s*["']?\d{3,}/.test(hh));

// a CSS rule that would lift Foundry's HUD layer or the interface over the windows
const lifted = [];
for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
  const sel = m[1].trim(), body = m[2];
  const z = body.match(/z-index:\s*(-?\d+)/);
  if (!z) continue;
  for (const s of sel.split(",").map(x => x.trim())) if (/^(body\s*>\s*)?(#hud|#token-hud|\.placeable-hud|#interface|#ui-middle)$/.test(s) && Number(z[1]) >= 100) lifted.push(`${s} z ${z[1]}`);
}
console.log("CSS rules lifting #hud / #token-hud / #interface to 100+:", lifted.length ? lifted.join("; ") : "none");
console.log("no module sets a z-index on #interface or #ui-middle:", !fs.readdirSync(ROOT + "module").some(f => /getElementById\("(interface|ui-middle|hud)"\)[^;\n]*zIndex/.test(src("module/" + f))));
if (!(H.HUD_LAYER_Z < 100 && bars.every(z => H.HUD_LAYER_Z > z) && !/zIndex\s*=\s*["']?\d{3,}/.test(hh) && !lifted.length)) throw new Error("the Token HUD's layer is lifted over Foundry's windows again (v0.0.531)");
