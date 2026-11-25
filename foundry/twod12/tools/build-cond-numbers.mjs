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
  // v0.0.502 (Lucas on v0.0.501: "on the token itself, is way too small"): the badge takes most of the icon's lower right (a token draws its
  // effect icons at about a fifth of its width)
  const badge = `<g class="twod12-num"><circle cx="40" cy="40" r="22.5" fill="#0b0b0d" fill-opacity="0.92" stroke="#e2bd52" stroke-width="3.5"/>`
    + `<text x="40" y="53.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" fill="#ffffff">${n}</text></g>`;
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
