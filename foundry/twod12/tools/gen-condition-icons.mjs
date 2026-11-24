// Generates the 2d12 custom condition SVG icons (BG3 / Tactical Polarity palette)
// into foundry/twod12/icons/conditions/<id>.svg.
// Run: node foundry/twod12/tools/gen-condition-icons.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const OUT = fileURLToPath(new URL("../icons/conditions", import.meta.url));
mkdirSync(OUT, { recursive: true });

const t = (bg1, bg2, rim, hi, mid, lo) => ({ bg1, bg2, rim, hi, mid, lo });

const PALETTE = {
  // Health & Down
  bloodied:     t("#3d1218", "#240d14", "#e04850", "#ffebe8", "#ed5860", "#8f1d24"),
  strained:     t("#121e3d", "#0e1529", "#5288eb", "#e6f0ff", "#6399f7", "#23468f"),
  desperate:    t("#4f2344", "#2e1a3d", "#d978c4", "#fff0fc", "#eb8ad6", "#8c3d7a"),
  dying:        t("#1f080a", "#120608", "#96242a", "#f2c2c4", "#b52d34", "#571014"),
  shattered:    t("#0a1026", "#080b1a", "#3d66bf", "#ccdcff", "#4d78d6", "#1c336e"),
  unconscious:  t("#2a2d33", "#181a1f", "#88909e", "#e6e9f0", "#9da5b5", "#505663"),
  dead:         t("#202022", "#111113", "#75736e", "#cfcdc8", "#8f8d88", "#474643"),
  // Actions & Speed
  quickened:    t("#0d2e26", "#0b1f21", "#38c49b", "#dbfff4", "#47d9ad", "#1a755b"),
  slowed:       t("#381d1d", "#261f21", "#c7524c", "#ffe6e3", "#d9645e", "#782b27"),
  dazed:        t("#38211b", "#261e1d", "#cf6448", "#ffebe3", "#e07558", "#7d3826"),
  staggered:    t("#292529", "#1e1f24", "#91626c", "#efe6ea", "#a37882", "#573d44"),
  // Positioning & Move
  leaning:      t("#0e2b33", "#0b1d26", "#3eb0cc", "#dcf9ff", "#4fc4e0", "#1d6478"),
  prone:        t("#3d1313", "#240c0c", "#e0483d", "#ffeae6", "#ed5a4f", "#8f2119"),
  immobilized:  t("#3d1313", "#240c0c", "#e0483d", "#ffeae6", "#ed5a4f", "#8f2119"),
  grabbed:      t("#3d1313", "#240c0c", "#e0483d", "#ffeae6", "#ed5a4f", "#8f2119"),
  hindered:     t("#302122", "#222124", "#ad6363", "#f5e6e6", "#bf7575", "#693b3b"),
  squeezing:    t("#302122", "#222124", "#ad6363", "#f5e6e6", "#bf7575", "#693b3b"),
  // Senses & Sight (5-step luminance gradient)
  obscured:     t("#244c57", "#18333d", "#7cd0e0", "#ebfdff", "#8ee0f0", "#3a7a8a"),
  "half-blinded": t("#1a3a47", "#112530", "#5ca8c4", "#dcf6ff", "#6dbbd6", "#2b5e73"),
  blinded:      t("#132536", "#0b1421", "#4b7fa8", "#d4e8ff", "#5c92bd", "#24435e"),
  hidden:       t("#173036", "#0e1c21", "#529ca8", "#daf5fa", "#63aebd", "#285861"),
  unsensed:     t("#121821", "#090c12", "#45586b", "#b8c7d6", "#586d82", "#263240"),
  // Combat & Magic
  empowered:    t("#453108", "#241804", "#ffca3a", "#fff7cc", "#f5b82e", "#a8720c"),
  daunted:      t("#2b1540", "#180d26", "#a363e6", "#f2e6ff", "#b578f5", "#5e2f94"),
  taunted:      t("#3b200c", "#241308", "#eb7f2d", "#ffeedc", "#fa9240", "#994812"),
  sickened:     t("#2e3609", "#1a2005", "#c8e02b", "#f8ffc2", "#cde62e", "#6d8210"),
  vulnerable:   t("#3b200c", "#241308", "#eb7f2d", "#ffeedc", "#fa9240", "#994812"),
  pressed:      t("#381a14", "#24100d", "#db5d42", "#ffeae6", "#ed6f53", "#8a2f1d"),
  enfeebled:    t("#2b1540", "#180d26", "#a363e6", "#f2e6ff", "#b578f5", "#5e2f94"),
  bleed:        t("#3d1215", "#240b0d", "#e3464b", "#ffe6e8", "#f2575c", "#911c21"),
  exhausted:    t("#2b241d", "#1a1714", "#a3886c", "#f5ece0", "#b89d80", "#614e3c"),
  imperiled:    t("#540c0c", "#290505", "#ffbe2e", "#fff7d6", "#ff3b2f", "#9e1414")
};

const SHAPES = {
  bloodied: f => `<path d="M32 6 C32 6 11 27 11 40 a21 21 0 0 0 42 0 C53 27 32 6 32 6Z" fill="${f.mid}"/><path d="M14 23 L50 51" stroke="${f.bg2}" stroke-width="10" stroke-linecap="round"/><path d="M16 25 L48 49" stroke="${f.hi}" stroke-width="4" stroke-linecap="round"/>`,
  strained: f => `<polygon points="32,5 56,32 32,59 8,32" fill="${f.mid}"/><path d="M34 6 L24 27 L38 33 L26 58" fill="none" stroke="${f.bg2}" stroke-width="10" stroke-linejoin="round"/><path d="M34 6 L24 27 L38 33 L26 58" fill="none" stroke="${f.hi}" stroke-width="4.5" stroke-linejoin="round"/>`,
  desperate: f => `<path d="M27 8 C27 8 10 24 10 38 C10 49 18 56 27 56 Z" fill="#e05a62"/><path d="M37 8 L54 32 L37 56 Z" fill="#6399f7"/><path d="M32 5 L35 28 L42 32 L35 36 L32 59 L29 36 L22 32 L29 28 Z" fill="${f.hi}"/>`,
  dying: f => `<path d="M8 29 C8 16 17 9 32 9 C47 9 56 16 56 29 C56 41 47 47 41 47 V56 H23 V47 C17 47 8 41 8 29Z" fill="${f.hi}"/><circle cx="22" cy="29" r="6" fill="${f.bg2}"/><circle cx="42" cy="29" r="6" fill="${f.bg2}"/><path d="M32 36 L27 44 H37 Z" fill="${f.mid}"/>`,
  shattered: f => `<polygon points="29,7 10,27 25,31" fill="${f.hi}"/><polygon points="35,7 54,27 39,31" fill="${f.mid}"/><polygon points="10,35 29,57 25,36" fill="${f.mid}"/><polygon points="54,35 35,57 39,36" fill="${f.hi}"/><circle cx="32" cy="32" r="5" fill="${f.bg2}"/>`,
  unconscious: f => `<path d="M8 26 Q32 45 56 26" fill="none" stroke="${f.hi}" stroke-width="7" stroke-linecap="round"/><path d="M16 37 L12 48 M32 41 L32 53 M48 37 L52 48" stroke="${f.mid}" stroke-width="5.5" stroke-linecap="round"/><path d="M38 11 H54 L38 22 H54" fill="none" stroke="${f.hi}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
  dead: f => `<path d="M16 16 L48 48 M48 16 L16 48" stroke="${f.mid}" stroke-width="7" stroke-linecap="round"/><rect x="8" y="25" width="48" height="14" rx="3" fill="${f.bg2}" stroke="${f.rim}" stroke-width="2.5"/><text x="32" y="35.5" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="10.5" letter-spacing="1.4" fill="${f.hi}">DEAD</text>`,
  quickened: f => `<path d="M9 12 L29 32 L9 52" fill="none" stroke="${f.mid}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 12 L51 32 L31 52" fill="none" stroke="${f.hi}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  slowed: f => `<path d="M14 9 H50 L36 32 L50 55 H14 L28 32 Z" fill="${f.mid}" stroke="${f.hi}" stroke-width="3.5" stroke-linejoin="round"/><path d="M10 9 H54 M10 55 H54" stroke="${f.hi}" stroke-width="5.5" stroke-linecap="round"/><polygon points="21,49 43,49 32,37" fill="${f.hi}"/>`,
  dazed: f => `<path d="M32 6 L39 25 L58 32 L39 39 L32 58 L25 39 L6 32 L25 25 Z" fill="${f.hi}"/><circle cx="32" cy="32" r="9" fill="${f.bg2}"/><circle cx="32" cy="32" r="4" fill="${f.mid}"/>`,
  staggered: f => `<path d="M12 10 L44 54" stroke="${f.hi}" stroke-width="7.5" stroke-linecap="round"/><path d="M34 10 L54 10 L54 30" fill="none" stroke="${f.mid}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 11 L37 27" stroke="${f.mid}" stroke-width="6.5" stroke-linecap="round"/><path d="M10 47 L27 56 L19 36 Z" fill="${f.mid}"/>`,
  leaning: f => `<rect x="7" y="9" width="13" height="46" rx="2.5" fill="${f.lo}" stroke="${f.mid}" stroke-width="2.5"/><path d="M24 32 H51" stroke="${f.hi}" stroke-width="7.5" stroke-linecap="round"/><path d="M39 16 L55 32 L39 48" fill="none" stroke="${f.hi}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  prone: f => `<path d="M32 6 V22 M22 15 L32 25 L42 15" fill="none" stroke="${f.mid}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="38" r="7.5" fill="${f.hi}"/><rect x="9" y="34" width="30" height="11" rx="5.5" fill="${f.hi}"/><rect x="7" y="49" width="50" height="6.5" rx="2.5" fill="${f.mid}"/>`,
  immobilized: f => `<rect x="8" y="47" width="48" height="9" rx="2.5" fill="${f.mid}"/><rect x="17" y="8" width="30" height="18" rx="9" fill="none" stroke="${f.hi}" stroke-width="6.5"/><rect x="17" y="28" width="30" height="18" rx="9" fill="none" stroke="${f.hi}" stroke-width="6.5"/>`,
  grabbed: f => `<path d="M13 36 V18 a5 5 0 0 1 10 0 v11 M23 29 V11 a5 5 0 0 1 10 0 v18 M33 29 V13 a5 5 0 0 1 10 0 v16 M43 29 V19 a5 5 0 0 1 10 0 v18 C53 49 45 57 33 57 C20 57 13 49 13 36Z" fill="${f.hi}"/><path d="M14 34 H52" stroke="${f.bg2}" stroke-width="5" stroke-linecap="round"/><path d="M23 18 V32 M33 16 V32 M43 18 V32" stroke="${f.bg2}" stroke-width="3.2" stroke-linecap="round"/>`,
  hindered: f => `<path d="M20 8 H37 V30 L52 36 V43 H17 Z" fill="${f.hi}"/><path d="M7 48 L15 39 L24 48 L32 39 L40 48 L49 39 L57 48" fill="none" stroke="${f.mid}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="7" y="52" width="50" height="5" rx="2" fill="${f.lo}"/>`,
  squeezing: f => `<rect x="6" y="8" width="12" height="48" rx="2" fill="${f.mid}"/><rect x="46" y="8" width="12" height="48" rx="2" fill="${f.mid}"/><polygon points="29,32 19,21 19,43" fill="${f.hi}"/><polygon points="35,32 45,21 45,43" fill="${f.hi}"/><rect x="30" y="10" width="4" height="44" rx="2" fill="${f.hi}"/>`,
  obscured: f => `<circle cx="32" cy="18" r="10" fill="${f.hi}"/><path d="M14 54 C15 39 21 32 32 32 C43 32 49 39 50 54 Z" fill="${f.mid}"/><path d="M7 30 H57 M7 41 H57 M7 52 H57" stroke="${f.bg2}" stroke-width="6.5" stroke-linecap="round"/><path d="M9 30 H55 M11 41 H53 M9 52 H55" stroke="${f.hi}" stroke-width="3" stroke-linecap="round" opacity="0.82"/>`,
  "half-blinded": f => `<path d="M6 32 Q32 10 58 32 Q32 54 6 32Z" fill="${f.hi}"/><circle cx="32" cy="32" r="10" fill="${f.bg2}"/><rect x="32" y="10" width="28" height="44" fill="${f.bg2}" opacity="0.88"/><path d="M32 13 V51 M39 20 H54 M39 32 H56 M39 44 H52" stroke="${f.mid}" stroke-width="4.5" stroke-linecap="round"/>`,
  blinded: f => `<path d="M6 32 Q32 10 58 32 Q32 54 6 32Z" fill="${f.hi}"/><circle cx="32" cy="32" r="10" fill="${f.bg2}"/><path d="M10 54 L54 10" stroke="${f.bg2}" stroke-width="11" stroke-linecap="round"/><path d="M10 54 L54 10" stroke="#e86258" stroke-width="6" stroke-linecap="round"/>`,
  hidden: f => `<circle cx="22" cy="22" r="9" fill="none" stroke="${f.hi}" stroke-width="4.5" stroke-dasharray="6 4"/><path d="M9 54 C10 41 15 35 22 35 C29 35 34 41 35 54" fill="none" stroke="${f.hi}" stroke-width="4.5" stroke-dasharray="6 4"/><path d="M40 20 A12 12 0 0 1 40 44 M49 12 A21 21 0 0 1 49 52" fill="none" stroke="#f2c95e" stroke-width="5.5" stroke-linecap="round"/>`,
  unsensed: f => `<circle cx="32" cy="32" r="21" fill="none" stroke="${f.mid}" stroke-width="5" stroke-dasharray="9 6" opacity="0.9"/><path d="M16 48 L48 16" stroke="${f.hi}" stroke-width="5.5" stroke-linecap="round"/>`,
  empowered: f => `<path d="M32 4 L41 24 L60 32 L41 40 L32 60 L23 40 L4 32 L23 24 Z" fill="${f.mid}" opacity="0.62"/><polygon points="32,7 40,40 24,40" fill="${f.hi}"/><rect x="17" y="40" width="30" height="6.5" rx="2" fill="${f.mid}" stroke="${f.bg2}" stroke-width="1.5"/><rect x="28.5" y="46.5" width="7" height="11" rx="2" fill="${f.hi}"/>`,
  daunted: f => `<path d="M14 9 H50 V31 L32 44 L14 31 Z" fill="${f.mid}"/><path d="M23 22 H41" stroke="${f.bg2}" stroke-width="5" stroke-linecap="round"/><path d="M14 41 L32 57 L50 41" fill="none" stroke="${f.hi}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  taunted: f => `<circle cx="32" cy="32" r="18" fill="none" stroke="${f.hi}" stroke-width="5.5"/><circle cx="32" cy="32" r="7.5" fill="${f.mid}"/><path d="M32 5 V18 M32 46 V59 M5 32 H18 M46 32 H59" stroke="${f.mid}" stroke-width="5.5" stroke-linecap="round"/>`,
  sickened: f => `<path d="M24 8 H40 M27 8 V21 L12 46 C10 51 13 56 19 56 H45 C51 56 54 51 52 46 L37 21 V8" fill="${f.lo}" stroke="${f.hi}" stroke-width="4" stroke-linejoin="round"/><path d="M15 38 H49 L52 47 C53 51 50 54 45 54 H19 C14 54 11 51 12 47 Z" fill="${f.mid}"/><circle cx="27" cy="46" r="3" fill="${f.hi}"/><circle cx="38" cy="43" r="2.2" fill="${f.hi}"/><path d="M12 52 L52 12" stroke="${f.bg2}" stroke-width="10" stroke-linecap="round"/><path d="M12 52 L52 12" stroke="#f05a3c" stroke-width="5.5" stroke-linecap="round"/>`,
  vulnerable: f => `<path d="M11 9 H53 V30 C53 45 32 57 32 57 C32 57 11 45 11 30 Z" fill="${f.mid}"/><path d="M36 8 L26 28 L38 33 L28 57" fill="none" stroke="${f.bg2}" stroke-width="10" stroke-linejoin="round"/><path d="M36 8 L26 28 L38 33 L28 57" fill="none" stroke="${f.hi}" stroke-width="4.5" stroke-linejoin="round"/>`,
  pressed: f => `<path d="M9 11 L43 45 M55 11 L21 45" stroke="${f.hi}" stroke-width="5.5" stroke-linecap="round"/><polygon points="48,50 32,46 44,34" fill="${f.hi}"/><polygon points="16,50 32,46 20,34" fill="${f.hi}"/><path d="M19 55 L32 43 L45 55" fill="none" stroke="${f.mid}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  enfeebled: f => `<polygon points="39,8 51,18 36,34 26,24" fill="${f.hi}"/><polygon points="21,31 31,41 19,53 9,43" fill="${f.mid}"/><path d="M7 44 L20 57" stroke="${f.hi}" stroke-width="5.5" stroke-linecap="round"/><path d="M17 17 L47 47" stroke="${f.bg2}" stroke-width="8"/><path d="M22 22 L42 42" stroke="#ffe599" stroke-width="3.5" stroke-dasharray="5 4"/>`,
  bleed: f => `<path d="M49 20 A21 21 0 1 0 52 40" fill="none" stroke="${f.hi}" stroke-width="5.5" stroke-linecap="round"/><polygon points="55,11 55,27 39,23" fill="${f.hi}"/><path d="M32 20 C32 20 21 33 21 40 a11 11 0 0 0 22 0 C43 33 32 20 32 20Z" fill="${f.mid}"/>`,
  exhausted: f => `<rect x="7" y="10" width="50" height="12" rx="3" fill="${f.mid}"/><circle cx="32" cy="34" r="8" fill="${f.hi}"/><path d="M13 56 C15 44 23 41 32 41 C41 41 49 44 51 56" fill="none" stroke="${f.hi}" stroke-width="7" stroke-linecap="round"/>`,
  imperiled: f => `<polygon points="32,6 59,53 5,53" fill="${f.mid}" stroke="${f.rim}" stroke-width="4.5" stroke-linejoin="round"/><rect x="28.5" y="19" width="7" height="18" rx="3" fill="${f.hi}"/><circle cx="32" cy="45" r="4.2" fill="${f.hi}"/>`
};

let count = 0;
for (const [id, draw] of Object.entries(SHAPES)) {
  const f = PALETTE[id];
  const strokeW = id === "imperiled" ? "4" : "3.2";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${f.bg1}"/><stop offset="100%" stop-color="${f.bg2}"/></linearGradient></defs>
  <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill="url(#bg)" stroke="${f.rim}" stroke-width="${strokeW}"/>
  <g transform="translate(2.5,2.5) scale(0.92)">${draw(f)}</g>
</svg>\n`;
  writeFileSync(join(OUT, `${id}.svg`), svg, "utf8");
  count++;
}
console.log(`Generated ${count} condition icons in ${OUT}`);
