// v0.0.454 (Lucas, playtest 6, D3: "The icons of each feature in the NPC's sheet (AD, WD, Speed...) could get a small, 'serious' symbol next to
// each"; the mockup foundry/mockups/pt6, his answer: "all proposed, but the attributes dont need the icons. Change the helm for the shield with the
// dot in the middle, leave ward as the talisman"): one line drawing a stat, 24 x 24, in the text's color, drawn 14 px before its word.
const S = (d, fill = "") => `${d ? `<path d="${d}"/>` : ""}${fill ? `<path class="f" d="${fill}"/>` : ""}`;
export const STAT_SYM = {
  ad: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11z", "M12 8a3 3 0 1 0 .01 0z"),                                    // a shield with a roundel
  wd: S("M7 2.5 12 8.5l5-6M12 8.5a6.2 6.2 0 1 0 .01 0z", "M12 12.2a2.5 2.5 0 1 0 .01 0z"),                                   // a talisman on its cord
  speed: S("M7.5 3h6.5v8.2l4.8 2.7c.9.5 1.4 1.3 1.4 2.3V20H7.5zM7.5 16.6h12.7M7.5 6h6.5"),                                     // a boot
  reach: S("M3.5 20.5 14 10M10.6 9.4l4 4", "M21 3c-.6 3.6-2.6 6.6-7 8 1.4-4.4 4.4-6.4 7-8z"),                                  // a spear
  size: S("M4.5 3.5v17M2.5 3.5h4M2.5 20.5h4M14.5 9.5v6.5M10.5 12h8M14.5 16l-3 4.5M14.5 16l3 4.5", "M14.5 3.6a2.5 2.5 0 1 0 .01 0z"),   // a figure against a measure
  steady: S("M12 3a2 2 0 1 0 .01 0zM12 7v13.5M8 10.5h8M4.5 13.5c.4 4.2 3.6 7 7.5 7s7.1-2.8 7.5-7M4.5 13.5l-1.6 2.6M4.5 13.5l2.7 1.3M19.5 13.5l1.6 2.6M19.5 13.5l-2.7 1.3"),   // an anchor
  guard: S("M12 3.5a8.5 8.5 0 1 0 .01 0z", "M12 9.3a2.7 2.7 0 1 0 .01 0z"),                                                   // a buckler
  immune: S("M12 3.5a8.5 8.5 0 1 0 .01 0zM6 18 18 6"),                                                                         // a ring, barred
  resist: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11z", "M4.5 4H12v16.5C7.7 19 4.5 15.8 4.5 11z"),              // a shield, half filled
  weak: S("M4.5 4h15v7c0 4.8-3.2 8-7.5 9.5C7.7 19 4.5 15.8 4.5 11zM13 4l-3 5.5 4 2.5-3 4.5 1 4")                               // a shield, cracked
};
/** The symbol's SVG ("" for a stat without one). */
export const statSym = k => (STAT_SYM[k] ? `<svg class="stat-sym" viewBox="0 0 24 24" aria-hidden="true">${STAT_SYM[k]}</svg>` : "");
