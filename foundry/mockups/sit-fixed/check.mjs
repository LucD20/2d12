// Renders index.html (dark, light), saves the screenshots, and checks that every button keeps its place.
// Run from foundry/twod12 (where playwright resolves): node ../mockups/sit-fixed/check.mjs
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(process.cwd(), "x.js"));
const { chromium } = require("playwright");
const browser = await chromium.launch();
let bad = 0;
for (const theme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(join(HERE, "index.html")).href + (theme === "light" ? "?light" : ""));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  if (theme === "dark") {
    const res = await page.evaluate(() => {
      const r2 = n => Math.round(n * 100) / 100, out = [];
      const font = document.fonts.check('600 12px "Source Sans 3"') && [...document.fonts].some(f => f.family.includes("Source Sans 3") && f.status === "loaded");
      const corner = [], paneH = new Set();
      for (const g of document.querySelectorAll(".group")) {
        const id = g.dataset.group, states = [...g.querySelectorAll(".state:not(.ov)")].filter(s => !s.querySelector(".scrolled"));
        const slots = new Map(), problems = [];
        states.forEach((s, i) => {
          const sl = s.querySelector(".slice"), o = sl.getBoundingClientRect(), pane = s.querySelector(".h3-sit"), pr = pane.getBoundingClientRect();
          for (const b of s.querySelectorAll("[data-slot]")) {
            const r = b.getBoundingClientRect(), key = b.dataset.slot;
            const box = [r2(r.left - o.left), r2(r.top - o.top), r2(r.width), r2(r.height)].join(" ");
            if (!slots.has(key)) slots.set(key, []);
            slots.get(key).push({ i: i + 1, box });
            // inside the tab, and its label whole
            if (b.closest(".hb-ask") && (r.left < pr.left - .5 || r.right > pr.right + .5 || r.top < pr.top - .5 || r.bottom > pr.bottom + .5)) problems.push(`state ${i + 1}: "${key}" is outside the tab`);
            if (b.scrollWidth > b.clientWidth + 1) problems.push(`state ${i + 1}: "${key}" label is cut`);
          }
          for (const row of s.querySelectorAll(".bs, .hb-grh, .h3-hd-r, .h3-rxjump")) if (row.scrollWidth > row.clientWidth + 1) problems.push(`state ${i + 1}: a row overflows (${row.className})`);
          const q = s.querySelector(".hb-ask .sf-ask"); if (q) {
            const qr = q.getBoundingClientRect(); if (!sl.matches(".tall")) paneH.add(`${pane.clientHeight - 4}`); if (!sl.matches(".tall") && Math.abs(qr.height - pane.clientHeight + 4) > 1) problems.push(`state ${i + 1}: the question is ${r2(qr.height)} px in a tab of ${pane.clientHeight}`);
            for (const row of q.querySelectorAll(".sf-b, .sf-o, .b-r")) if (row.scrollWidth > row.clientWidth + 1 || row.scrollHeight > row.clientHeight + 1) problems.push(`state ${i + 1}: a row of buttons overflows (${row.className})`);
            for (const t of q.querySelectorAll(".sf-t, .sf-st, .sf-h, .sf-k")) if (t.scrollHeight > t.clientHeight + 2 || (t.scrollWidth > t.clientWidth + 1 && !t.matches(".sf-t"))) problems.push(`note, state ${i + 1}: text cut with an ellipsis (${t.className.split(" ")[0]}: "${t.textContent.slice(0, 38)}...")`);
            const no = q.querySelector('[data-slot="no"]'); if (no && id !== "today") { const r = no.getBoundingClientRect(); corner.push({ id, i: i + 1, right: r2(r.right - o.left), bottom: r2(r.bottom - o.top), b: g.dataset.group.startsWith("b-") }); }
          }
        });
        let moved = 0; const lines = [];
        for (const [key, list] of slots) { const set = new Set(list.map(x => x.box)); if (set.size > 1) { moved++; lines.push(`   MOVES "${key}": ${list.map(x => `[${x.i}] ${x.box}`).join(" | ")}`); } }
        out.push({ id, states: states.length, slots: slots.size, moved, lines, problems });
      }
      return { out, corner, font, paneH: [...paneH] };
    });
    console.log(`font Source Sans 3 loaded: ${res.font}; a question's height: ${res.paneH.join(" / ")} px`);
    for (const g of res.out) {
      const hard = g.problems.filter(p => !p.startsWith("note"));
      const expectMove = g.id === "today";
      const ok = expectMove ? g.moved > 0 : g.moved === 0 && !hard.length;
      if (!ok) bad++;
      console.log(`${ok ? "ok  " : "FAIL"} ${g.id.padEnd(15)} ${g.states} states, ${g.slots} buttons: ${expectMove ? `${g.moved} move (expected: this is today's layout)` : g.moved ? `${g.moved} MOVE` : "each one the same x, y, width, height in every state"}`);
      for (const l of [...g.lines, ...g.problems.map(p => `   ${p}`)]) console.log(l);
    }
    for (const fam of [false, true]) {
      const c = res.corner.filter(x => x.b === fam), set = new Set(c.map(x => `${x.right} ${x.bottom}`));
      const ok = set.size === 1; if (!ok) bad++;
      console.log(`${ok ? "ok  " : "FAIL"} the way out's corner, ${fam ? "B" : "A"}: ${c.length} questions, right and bottom edge ${[...set].join(" / ")}${ok ? " in every one" : ""}`);
      if (!ok) for (const x of c) console.log(`   ${x.id} [${x.i}] ${x.right} ${x.bottom}`);
    }
  }
  await page.screenshot({ path: join(HERE, `sit-fixed-${theme}.png`), fullPage: true });
  await page.close();
}
await browser.close();
console.log(bad ? `${bad} FAILED` : "ALL OK");
process.exit(bad ? 1 : 0);
