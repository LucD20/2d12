// Run with: node tools/tests/run.mjs (or node tools/tests/t124.mjs)
// v0.0.144: fixes after Pass A: real weapon dice on chat cards, Weapon Attack 0 on Tier 1, "DC N Attribute Save" labels and @weapon.dc,
// no Defense calculation row on chat cards, automatic effects applied when the Action is used.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
const BD = (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS;   // v0.0.227 (pack CS): the Basic Actions are data generated from book/cards
import fs from "node:fs";
const src = n => fs.readFileSync(ROOT + n, "utf8");
const actions = src("module/actions.mjs"), inline = src("module/inline.mjs"), basic = src("module/basic.mjs"), data = src("module/data.mjs"), sheets = src("module/actor-sheets.mjs");
console.log("chat card tiers use tierLines (weapon dice + Modifier):", actions.includes("await tierLines(version[k], n, cardCtx, expandAsText(version[`x${n}`], item.system.versions, version, n))"), "| no Defense calculation row:", !actions.includes('<div class="vsrow">'));
console.log("Weapon Attack: 0 / 1[W] / 1[W] (+ Weapon Modifier on 2 and 3):", (() => { const v = BD.basicWeaponAttack.versions[0], w = JSON.stringify([{ pool: "B", useW: true, wCount: 1, dice: "", useAt: false, subtype: "" }]); return v.t1.length === 0 && JSON.stringify(v.t2) === w && JSON.stringify(v.t3) === w; })());
const m = inline.match(/if \(key === "dc"\) \{([^\n]+)/);
const ref = /@(weapon|power|signature|body|mind|appeal|instinct)(?:\.dc)?$/i;
console.log("dc:@weapon.dc reads:", ["@weapon.dc", "@power", "@body.dc", "@Signature.DC", "14", "@foo.dc"].map(v => `${v} ${ref.test(v) ? "ref" : "number"}`).join(" | "), "| parser in place:", !!m && m[1].includes("cfg.dcRef"));
console.log("Save label always has its DC:", inline.includes('kind === "Save" || cfg.dc !== 13 ? dcText : ""'), "| from the creature's saveDC:", inline.includes("system?.saveDC?.[cfg.dcRef]"));
console.log("creatures have saveDC (Weapon, Power, Signature, each Attribute):", data.includes("m.saveDC = { weapon: 11 + (Number(m.weaponMod) || 0), power: 11 + (Number(m.powerMod) || 0), signature: 11 + (Number(m.signatureMod) || 0),"), "| shown on the sheet's hover:", sheets.includes("(@weapon.dc)") && sheets.includes("(@${k}.dc)"));
console.log("automatic effects on use:", actions.includes("fxOnUse: true") && actions.includes("const autoFor = (t, bon) =>"), "| not again on the damage card:", actions.includes('.filter(x => !f.fxOnUse || x.mode !== "auto")'), "| no Damage button for effects only:", actions.includes('].filter(x => x.mode !== "auto")   // automatic effects are applied'));
// The book is outside the system folder: checked only when it is there (the bundle), so a fresh unzip of the system still passes.
const bookPath = ROOT + "../../book/rules-src/07-basic-actions.md";
if (fs.existsSync(bookPath)) {
  const book = fs.readFileSync(bookPath, "utf8");
  const wa = book.slice(book.indexOf("<span>Weapon Attack</span>"), book.indexOf("\n</div>", book.indexOf("<span>Weapon Attack</span>")));
  const ok = (wa.match(/\| \*\*Tier \d\*\* \|[^|]+\|/g) || []).map(x => x.replace(/\*\*/g, "").replace(/\s*\|\s*/g, " ").trim()).join(" / ") === "Tier 1 0 / Tier 2 1[W] + [Mod] / Tier 3 1[W] + [Mod]";
  if (!ok) console.log("book Weapon Attack: NOT 0 / 1[W] + [Mod] / 1[W] + [Mod]");
}
