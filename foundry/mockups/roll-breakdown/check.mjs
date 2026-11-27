// Renders today.html and index.html (dark, light; 1280 px and a phone), checks them, measures the heights (measured.json) and saves the pictures.
// Run from foundry/twod12 (where playwright resolves): node ../mockups/roll-breakdown/check.mjs   Then build.mjs again (the table of heights).
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(process.cwd(), "x.js"));
const { chromium } = require("playwright");
const browser = await chromium.launch();
const url = (f, theme) => pathToFileURL(join(HERE, f)).href + (theme === "light" ? "?light" : "");
const measured = {};
let bad = 0;

/* today: the system's own panel, its height, and its pictures (the page shows them) */
for (const theme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(url("today.html", theme));
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  for (const [id, w, name] of [["1", 300, "today-1"], ["1", 232, "today-1-232"], ["5", 300, "today-5"]]) {
    const el = page.locator(`[data-today="${id}"][data-w="${w}"]`);
    if (theme === "dark" && w === 300) measured[`today${id}`] = await el.locator(".cc-break").evaluate(e => e.getBoundingClientRect().height);
    await el.screenshot({ path: join(HERE, `${name}-${theme}.png`) });
  }
  if (theme === "dark") {
    const torn = await page.evaluate(() => [...document.querySelectorAll(".cc-bbl")].filter(l => l.getBoundingClientRect().height > 22).map(l => `${l.closest("[data-w]").dataset.w} px, case ${l.closest("[data-today]").dataset.today}: "${l.textContent.trim()}"`));
    console.log(`today: ${torn.length} Boon or Bane lines wrap (a number torn from its name):`); for (const t of torn) console.log(`   ${t}`);
  }
  await page.close();
}

/* the three designs */
for (const theme of ["dark", "light"]) for (const vw of [1280, 390]) {
  const page = await browser.newPage({ viewport: { width: vw, height: 900 }, deviceScaleFactor: vw === 1280 ? 2 : 1 });
  await page.goto(url("index.html", theme));
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  const res = await page.evaluate(() => {
    const problems = [], heights = {};
    const font = [...document.fonts].some(f => f.family.includes("Source Sans 3") && f.status === "loaded");
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push(`the page scrolls sideways (${document.documentElement.scrollWidth} in ${document.documentElement.clientWidth})`);
    let cards = 0, wholes = 0, entries = 0;
    for (const f of document.querySelectorAll("figure.case[data-design]")) {
      const card = f.querySelector(".card"), where = `${f.dataset.design} case ${f.dataset.case} (${Math.round(card.getBoundingClientRect().width)} px)`;
      const cr = card.getBoundingClientRect(), right = cr.right - 8 + .6, left = cr.left + 8 - .6;
      cards++;
      // nothing leaves the card
      for (const e of card.querySelectorAll("*")) { if (e.closest("[hidden]") || e.matches(".sr") || e.closest("svg")) continue; const r = e.getBoundingClientRect(); if (!r.width && !r.height) continue; if (r.right > right || r.left < left) { problems.push(`${where}: <${e.tagName.toLowerCase()} class="${e.className}"> leaves the card ("${e.textContent.trim().slice(0, 30)}")`); break; } }
      // a term of the sentence, a glued number, a Tier, the Defense: each on one line
      for (const e of card.querySelectorAll(".a-line .t, .g, .tier, .tog, .c-n, .c-sub .n, .b-h")) { if (e.closest("[hidden]")) continue; wholes++; const r = e.getBoundingClientRect(); if (r.height > 30 || e.getClientRects().length > 1) problems.push(`${where}: "${e.textContent.trim().slice(0, 30)}" is broken over two lines`); }
      // the written sum: a number is on the first line of its name
      for (const e of card.querySelectorAll(".c-sub .e")) { if (e.closest("[hidden]")) continue; entries++; const n = e.querySelector(".n").getBoundingClientRect(), nm = e.querySelector(".nm"), first = nm.firstChild.nodeType === 3 ? (() => { const g = document.createRange(); g.selectNodeContents(nm); return g.getClientRects()[0]; })() : nm.firstChild.getClientRects()[0]; if (Math.abs(first.top - n.top) > 4 || n.right > first.left + .5) problems.push(`${where}: the number of "${nm.textContent.trim()}" is not beside its first line`); }
      // the ledger: a struck name keeps "(2 at most)" in its own cell
      if (f.dataset.m && cr.width === 300) heights[f.dataset.m] = f.querySelector(".rb").getBoundingClientRect().height;
    }
    return { problems, heights, font, cards, wholes, entries };
  });
  if (theme === "dark" && vw === 1280) Object.assign(measured, res.heights);
  const ok = !res.problems.length && res.font; if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${theme} ${vw} px: font loaded ${res.font}; ${res.cards} cards, ${res.wholes} unbreakable pieces on one line, ${res.entries} numbers beside their names, nothing outside a card`);
  for (const p of res.problems) console.log(`   ${p}`);
  if (vw === 1280) {
    for (const d of ["A", "B", "C"]) await page.locator(`#d-${d}`).screenshot({ path: join(HERE, `design-${d}-${theme}.png`) });
    if (theme === "dark") {
      // the click works, and a click (not a hover) is all it takes
      const t = page.locator('figure[data-m="A1closed"] .tog'); const before = await page.locator('figure[data-m="A1closed"] .names').isHidden(); await t.click(); const after = await page.locator('figure[data-m="A1closed"] .names').isVisible(); await t.click();
      const hov = await page.evaluate(() => document.querySelectorAll("[title], [data-tooltip]").length);
      const okc = before && after && hov === 0; if (!okc) bad++;
      console.log(`${okc ? "ok  " : "FAIL"} a click opens the names (closed ${before}, open ${after}); hover texts on the page: ${hov}`);
    }
  } else await page.screenshot({ path: join(HERE, `page-phone-${theme}.png`), fullPage: true });
  await page.close();
}
await browser.close();
writeFileSync(join(HERE, "measured.json"), JSON.stringify(measured, null, 1) + "\n");
console.log("heights (300 px card):", JSON.stringify(Object.fromEntries(Object.entries(measured).map(([k, v]) => [k, Math.round(v)]))));
console.log(bad ? `${bad} FAILED` : "ALL OK");
process.exit(bad ? 1 : 0);
