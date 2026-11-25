// Hide indicator mockup: draws the same small scene for every option (a mockup; the system loads none of this).
const C = 64, W = 9 * C, H = 6 * C, R = 25;
const INK = "#f0ece4";
const TOK = {
  kaela:  { n: "Kaela",         l: "K", x: 2, y: 4, fill: "#3d5568" },
  sylwen: { n: "Sylwen",        l: "S", x: 5, y: 5, fill: "#3f5c48" },
  sneak:  { n: "Goblin Sneak",  l: "G", x: 2, y: 1, fill: "#4b5a26" },
  orc:    { n: "Orc Warrior",   l: "O", x: 6, y: 1, fill: "#6e2318" },
  archer: { n: "Goblin Archer", l: "G", x: 7, y: 4, fill: "#4b5a26" },
};
const HIDE = { sneak: "unsensed", orc: "hidden" };   // the flag on Kaela: { observerTokenId: "hidden" | "unsensed" }
const WORD = { hidden: "Hidden", unsensed: "Unsensed" };
const cx = t => t.x * C + C / 2, cy = t => t.y * C + C / 2;

/** The two marks: Hidden a half-filled disc, Unsensed an empty dashed ring (a shape each, never the color alone). */
function markSvg(kind, x, y, r, back = true) {
  const b = back ? `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="#0b0b0d" fill-opacity=".9"/>` : "";
  if (kind === "hidden") return `${b}<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${x} ${y - r}A${r} ${r} 0 0 0 ${x} ${y + r}Z" fill="${INK}"/>`;
  return `${b}<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="2.6 2.6"/>`;
}
const mk = kind => `<svg class="mk" viewBox="0 0 16 16" aria-hidden="true">${markSvg(kind, 8, 8, 6, false)}</svg>`;

function floor() {
  let g = `<rect width="${W}" height="${H}" fill="#23201b"/>`;
  for (let i = 1; i < 9; i++) g += `<line x1="${i * C}" y1="0" x2="${i * C}" y2="${H}" stroke="#fff" stroke-opacity=".055"/>`;
  for (let j = 1; j < 6; j++) g += `<line x1="0" y1="${j * C}" x2="${W}" y2="${j * C}" stroke="#fff" stroke-opacity=".055"/>`;
  // the wall Kaela hides behind (north of her) and a low crate toward the Orc
  g += `<rect x="${1 * C - 5}" y="${4 * C - 18}" width="${3 * C + 10}" height="16" fill="#7a7060" stroke="#0d0c0a" stroke-width="1.5"/>`;
  g += `<rect x="${3 * C + 9}" y="${3 * C + 60}" width="46" height="46" fill="#4a3a26" stroke="#0d0c0a" stroke-width="1.5"/><path d="M${3 * C + 9} ${3 * C + 60}l46 46m0-46l-46 46" stroke="#0d0c0a" stroke-opacity=".5"/>`;
  return g;
}
function token(id, o = {}) {
  const t = TOK[id], x = cx(t), y = cy(t);
  let g = "";
  if (o.sel) g += `<circle cx="${x}" cy="${y}" r="${R + 5}" fill="none" stroke="#ff9829" stroke-width="2.5"/>`;
  if (o.ghost === "unsensed") return g + `<circle cx="${x}" cy="${y}" r="${R}" fill="#0b0b0d" fill-opacity=".25" stroke="${INK}" stroke-opacity=".8" stroke-width="1.6" stroke-dasharray="3 4"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}" fill-opacity=".35">${t.l}</text>`;
  const op = o.ghost === "hidden" ? ".45" : "1";
  g += `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${R}" fill="${t.fill}" stroke="#0d0c0a" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${R - 3}" fill="none" stroke="#fff" stroke-opacity=".22"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}">${t.l}</text></g>`;
  if (o.ghost === "hidden") g += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${INK}" stroke-opacity=".8" stroke-width="1.6"/>`;
  return g;
}
/** A sight line from Kaela to an observer, token edge to token edge: dashed for Hidden, dotted for Unsensed. */
function line(obs, kind) {
  const a = TOK.kaela, b = TOK[obs], dx = cx(b) - cx(a), dy = cy(b) - cy(a), d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  const dash = kind === "hidden" ? `stroke-dasharray="9 5"` : `stroke-dasharray="1 7" stroke-linecap="round"`;
  return `<line x1="${cx(a) + ux * (R + 4)}" y1="${cy(a) + uy * (R + 4)}" x2="${cx(b) - ux * (R + 4)}" y2="${cy(b) - uy * (R + 4)}" stroke="#0b0b0d" stroke-opacity=".7" stroke-width="5"/>`
       + `<line x1="${cx(a) + ux * (R + 4)}" y1="${cy(a) + uy * (R + 4)}" x2="${cx(b) - ux * (R + 4)}" y2="${cy(b) - uy * (R + 4)}" stroke="${INK}" stroke-opacity=".85" stroke-width="2" ${dash}/>`;
}
const name = (id, cls = "") => `<div class="name ${cls}" style="left:${cx(TOK[id])}px;top:${cy(TOK[id]) + R + 6}px">${TOK[id].n}</div>`;
const plate = (id, html, o = {}) => `<div class="plate ${o.cls ?? ""}" style="left:${cx(TOK[id]) + (o.dx ?? 0)}px;top:${cy(TOK[id]) + R + (o.dy ?? 22)}px">${html}</div>`;

const SCENES = {
  // A, at rest: one small seal per observer on the hider's left edge
  "a-rest": () => ({
    svg: Object.keys(TOK).map(id => token(id)).join("") + markSvg("unsensed", cx(TOK.kaela) - R - 2, cy(TOK.kaela) - 9, 5.5) + markSvg("hidden", cx(TOK.kaela) - R - 2, cy(TOK.kaela) + 9, 5.5),
    html: Object.keys(TOK).map(id => name(id)).join(""),
  }),
  // A, Kaela selected or hovered: a line to each observer and its word under that observer
  "a-on": () => ({
    svg: line("sneak", "unsensed") + line("orc", "hidden") + Object.keys(TOK).map(id => token(id, { sel: id === "kaela" })).join("")
       + markSvg("unsensed", cx(TOK.kaela) - R - 2, cy(TOK.kaela) - 9, 5.5) + markSvg("hidden", cx(TOK.kaela) - R - 2, cy(TOK.kaela) + 9, 5.5),
    html: Object.keys(TOK).map(id => name(id)).join("") + plate("sneak", `${mk("unsensed")}Unsensed`) + plate("orc", `${mk("hidden")}Hidden`),
  }),
  // B, Alt held: the condition line, with Hide's entry on the hider
  "b-alt": () => ({
    svg: Object.keys(TOK).map(id => token(id)).join(""),
    html: `<div class="key">Alt held</div>` + Object.keys(TOK).map(id => name(id)).join("")
        + plate("kaela", `<span class="w">Unsensed to Goblin Sneak ·</span><span class="w">Hidden to Orc Warrior</span>`, { cls: "two" })
        + plate("orc", "Vulnerable 1") + plate("archer", "Slowed 2", { dx: -8 }),
  }),
  // C, an observer selected: the creatures hiding from it are drawn as it perceives them
  "c-sneak": () => ({
    svg: Object.keys(TOK).map(id => token(id, { sel: id === "sneak", ghost: id === "kaela" ? "unsensed" : "" })).join(""),
    html: Object.keys(TOK).map(id => name(id, id === "kaela" ? "dim" : "")).join("") + plate("kaela", `${mk("unsensed")}Unsensed to Goblin Sneak`, { cls: "quiet" }),
  }),
  "c-orc": () => ({
    svg: Object.keys(TOK).map(id => token(id, { sel: id === "orc", ghost: id === "kaela" ? "hidden" : "" })).join(""),
    html: Object.keys(TOK).map(id => name(id)).join("") + plate("kaela", `${mk("hidden")}Hidden to Orc Warrior`, { cls: "quiet" }),
  }),
  "c-archer": () => ({
    svg: Object.keys(TOK).map(id => token(id, { sel: id === "archer" })).join(""),
    html: Object.keys(TOK).map(id => name(id)).join(""),
  }),
};
for (const el of document.querySelectorAll("[data-scene]")) {
  const s = SCENES[el.dataset.scene]();
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${el.dataset.label ?? "The map"}">${floor()}${s.svg}</svg>${s.html}`;
}
for (const el of document.querySelectorAll("[data-mk]")) el.outerHTML = mk(el.dataset.mk);
