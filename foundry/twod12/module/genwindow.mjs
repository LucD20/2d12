// v0.0.357 PACK ACTION-SHEET, session 2 (Lucas's pick: mockup G2, foundry/mockups/generate-action.html): Generate Action's window.
// One text box: the card as the book prints it. Every line gets a ✓ (read, and as what) or a ? (kept out); the card it makes is drawn beside it,
// live. The system's own window (the old one was a Foundry default window). The reading is gencard.mjs (pure, tested).
import { parseCard, cardSystem, cardText } from "./gencard.mjs";
import { understood } from "./genaction.mjs";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const SAMPLE = `Grave Chill    Wisp Feature 1 · Round · 1/2 AP
[Power] [Save] [Fear]
Targets: One creature
Distance: 5 sq. · Vs. Body Save
1 AP
Tier 1: [V] 2d6 Co; Hindered (EoT)
Tier 2: [V] 1d6 Co
Tier 3: No effect.
2 AP
Tier 1: [V] 3d6 Co; Hindered (1 round)
Tier 2: [V] 2d6 Co; Hindered (EoT)
Tier 3: [V] 1d6 Co
The cold of the grave, in one breath.`;

/** The list under the box: every line with its mark and what it was read as; then what was understood of the Versions and the notes. Pure. */
export function readHtml(card, sys, notes) {
  const lines = card.lines.map(l => `<li class="${l.ok ? "ok" : "no"}"><span>${l.ok ? "✓" : "?"}</span><div><code>${esc(l.text.trim())}</code>${l.ok ? `<em>${esc(l.as)}</em>` : "<em>not read: it is left out. Start it with Targets:, Distance:, Tier 1:, Critical:, Effects:, Trigger:, Requirements:</em>"}</div></li>`).join("");
  const und = sys ? understood(sys) : "";
  return `<ul class="gc-lines">${lines || '<li class="no"><span>?</span><div><em>Write or paste a card above.</em></div></li>'}</ul>
    ${und ? `<p class="gc-und"><b>Understood:</b> ${esc(und)}</p>` : ""}${notes?.length ? `<ul class="gc-notes">${notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}`;
}
/** The window's frame. Pure. */
export function genHtml({ text, target, help }) {
  return `<div class="twod12 sheet item sk gc-win"><div class="fr-tab gc-tab${help ? " fr-helpon" : ""}"><div class="gc-cols"><div class="gc-left">
      <label class="bb-typel" for="gc-text">The card, as text <small>one line per part; a line that isn't read gets a ?</small></label>
      <textarea id="gc-text" class="fr-ta gc-text" rows="14" spellcheck="false" data-gc-text placeholder="${esc(SAMPLE)}">${esc(text)}</textarea>
      <p class="fr-help">Line 1: the name, then two spaces and <code>Category 1 · Round · 1/2/3 AP</code> (<code>1R</code>: a Reaction). Line 2: the traits, <code>[Power] [Save]</code>. Then <code>Trigger:</code> or <code>Interrupt:</code>, <code>Requirements:</code>, <code>Targets:</code>, <code>Area: 2 Emanation</code>, <code>Distance: 5 sq. · Vs. Appeal Save</code>. For each Version, <code>2 AP</code> on its own line, then <code>Tier 1:</code>, <code>Tier 2:</code>, <code>Tier 3:</code>, <code>Critical:</code>, <code>Effects:</code>. A Tier: the damage like the card (<code>[V] 1[W] + [R] 1d6 Ho</code>), then <code>;</code> and its words (<code>Pushed 2</code>, <code>Vulnerable 2 (EoT)</code>). The last line without a label is the Flavor.</p>
      <h4 class="gc-h">What was read</h4><div class="gc-read" data-gc-read aria-live="polite"></div>
    </div><aside class="gc-right"><span class="bb-cap">The card it makes</span><div class="gc-card" data-gc-card></div></aside></div></div>
    <footer class="bb-foot"><a class="fr-q${help ? " on" : ""}" data-gc="help" role="button" tabindex="0" aria-pressed="${!!help}" aria-label="Show how to write it">?</a><a class="as-link" data-gc="sample" role="button" tabindex="0">Show an example</a><span class="fr-m">Nothing is created until you click.</span><button type="button" data-gc="close">Cancel</button><button type="button" class="bb-go" data-gc="ok">${esc(target)}</button></footer></div>`;
}

const { ApplicationV2 } = foundry.applications?.api ?? {};
class CardGenerator extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { classes: ["twod12", "twod12-styled", "twod12-builder", "twod12-gencard"], window: { title: "Generate Action", resizable: true }, position: { width: 980, height: 760 } };
  constructor({ actor = null, item = null, resolve = null } = {}) {
    super({ window: { title: actor ? `Generate Action: ${actor.name}` : item ? `Generate Action: ${item.name}` : "Generate Action" } });
    this.actor = actor; this.item = item; this.resolve = resolve; this.help = false; this.made = null;
    this.old = item ? item.toObject().system : null;
    this.text = item ? cardText(item.name, { ...this.old, area: item.system.area ?? "" }) : "";
  }
  get target() { return this.item ? `Update ${this.item.name}` : this.actor ? `Create on ${this.actor.name}` : "Create in the world"; }
  async _renderHTML() { const div = document.createElement("div"); div.className = "gc-root"; div.innerHTML = genHtml({ text: this.text, target: this.target, help: this.help }); return div; }
  _replaceHTML(result, content) { content.replaceChildren(result); this._refresh(); }
  _read() { const card = parseCard(this.text), { system, notes } = cardSystem(card, this.old); return { card, system, notes }; }
  /** The list and the card follow the text (the box itself isn't redrawn: the cursor stays). */
  async _refresh() {
    const el = this.element; if (!el) return;
    const { card, system, notes } = this._read();
    const read = el.querySelector("[data-gc-read]"), box = el.querySelector("[data-gc-card]");
    if (read) read.innerHTML = readHtml(card, this.text.trim() ? system : null, notes);
    if (!box) return;
    if (!this.text.trim()) { box.innerHTML = '<p class="fr-m">The card appears here as you write.</p>'; return; }
    try {
      const { buildActionCard } = await import("./actioncard.mjs");
      const temp = new CONFIG.Item.documentClass({ name: card.name || "New Action", type: "action", system: { ...(this.old ?? {}), ...system } });
      box.innerHTML = await buildActionCard(temp, { use: false });
    } catch (e) { box.innerHTML = `<div class="warnline">No preview: ${esc(e.message ?? e)}</div>`; }
  }
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const el = this.element;
    let timer = null;
    el.addEventListener("input", ev => { if (!ev.target.matches("[data-gc-text]")) return; this.text = ev.target.value; clearTimeout(timer); timer = setTimeout(() => this._refresh(), 180); });
    el.addEventListener("click", async ev => {
      const b = ev.target.closest("[data-gc]");
      if (!b) return;
      const a = b.dataset.gc;
      if (a === "close") return this.close();
      if (a === "help") { this.help = !this.help; el.querySelector(".gc-tab")?.classList.toggle("fr-helpon", this.help); b.classList.toggle("on", this.help); return; }
      if (a === "sample") { if (this.text.trim()) return ui.notifications.info("Empty the box first: the example would replace your text."); this.text = SAMPLE; const t = el.querySelector("[data-gc-text]"); if (t) t.value = SAMPLE; return this._refresh(); }
      if (a === "ok") return this._make();
    });
    el.addEventListener("keydown", ev => { if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches?.("[data-gc][tabindex]")) { ev.preventDefault(); ev.target.click(); } });
  }
  async _make() {
    const { card, system } = this._read();
    if (!card.name) return ui.notifications.warn("The Action needs a name (the first line).");
    try {
      if (this.item) { await this.item.update({ name: card.name, system }); this.made = this.item; }
      else {
        const data = { name: card.name, type: "action", img: "icons/svg/explosion.svg", system };
        if (this.actor) { const [made] = await this.actor.createEmbeddedDocuments("Item", [data]); this.made = made; ui.notifications.info(`${card.name} added to ${this.actor.name}.`); }
        else this.made = await Item.create(data);
      }
    } catch (e) { console.warn("twod12 | Generate Action", e); return ui.notifications.error("The Action could not be saved (the console has the reason)."); }
    return this.close();
  }
  async close(options) { const r = await super.close(options); this.resolve?.(this.made); this.resolve = null; return r; }
}

/** Open the window; resolves with the Action made or filled (null when closed). */
export function openCardGenerator({ actor = null, item = null } = {}) {
  if (!ApplicationV2) return Promise.resolve(null);
  return new Promise(resolve => { new CardGenerator({ actor, item, resolve }).render(true); });
}
