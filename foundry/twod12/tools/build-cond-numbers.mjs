// v0.0.501 (Lucas on v0.0.500: "Numbers of conditions dont show in the token ... Nothing changed"): Foundry draws an effect's picture on the
// token, so a condition with a value gets a picture that carries its number. This writes icons/conditions/numbered/<id>-<n>.svg (n 1 to 9)
// from each valued condition's icon: the icon, and a badge in its lower right corner (dark disc, gold ring, the number in white).
// Run: node tools/build-cond-numbers.mjs (t308 checks that the files are up to date).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VALUED_CONDITIONS, NUMBER_MAX } from "../module/condnum.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, "icons/conditions"), OUT = path.join(SRC, "numbered");

export function numberedSvg(svg, n) {
  const badge = `<g class="twod12-num"><circle cx="49" cy="49" r="14" fill="#0b0b0d" stroke="#d8b24a" stroke-width="3"/>`
    + `<text x="49" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="#ffffff">${n}</text></g>`;
  return String(svg).replace(/<\/svg>\s*$/, `${badge}</svg>\n`);
}

export function buildAll({ write = true } = {}) {
  const out = {};
  for (const id of VALUED_CONDITIONS) {
    const svg = fs.readFileSync(path.join(SRC, `${id}.svg`), "utf8");
    for (let n = 1; n <= NUMBER_MAX; n++) out[`${id}-${n}.svg`] = numberedSvg(svg, n);
  }
  if (write) { fs.mkdirSync(OUT, { recursive: true }); for (const [f, s] of Object.entries(out)) fs.writeFileSync(path.join(OUT, f), s); }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const n = Object.keys(buildAll()).length;
  console.log(`icons/conditions/numbered: ${n} icons`);
}
