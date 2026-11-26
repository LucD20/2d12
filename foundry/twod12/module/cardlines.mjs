// Pack CARD-ONE step 3 (Lucas, 2026-11-17: "the roll dialog and the chat result show the card's parts in the card's order, in a tighter layout"):
// the lines of one Version of an Action card, from the card model (cardmodel.mjs), enriched, for the faces that show one Version: the roll dialog
// (rolldlg.mjs cardHtml) and the chat cards (chatcards.mjs: the attack, Save and no-roll cards). Each face keeps its own Tier rows (the dialog's
// forcible Tiers, the chat's rolled result) and places them where the model has them, so the order is the card's everywhere.
import { cardModel, rollLine as modelRollLine } from "./cardmodel.mjs";
import { highlightText } from "./config.mjs";
import { esc } from "./util.mjs";

const richText = async (txt, doc) => highlightText(await foundry.applications.ux.TextEditor.implementation.enrichHTML(txt ?? "", doc ? { relativeTo: doc } : {}));
/** One model line's HTML by its fmt (the model keeps the text as written). */
export async function lineHtml(l, item, enrich = richText) {
  return l.fmt === "hl" ? highlightText(esc(l.text)) : l.fmt === "esc" ? esc(l.text) : l.fmt === "rich-esc" ? await enrich(esc(l.text), item) : await enrich(l.text, item);
}

/**
 * The card lines of the Version `version` of `item` (the Version object itself, or its AP), enriched. opts: { actor, weapon, fists (the model's
 * options), enrich (async (text, doc) => html; the tests give their own), setupHtml (the Setup line as the face writes it: the chat card marks
 * what is done) }. Returns { top: [{ label, html }] (Requirement, Prerequisite, Interrupt / Trigger, Setup, the card's own lines, in order; not the
 * roll line), roll: { label, text } | null (the face writes its own, at this place), heading (a Mode's or a Version's name, when the card has
 * several), before: [{ label, html }] (the Version's lines before its Tiers: Special), tiers: [labels] (where the face's Tier rows go; none for a
 * Version with no roll), after: [{ label, html }] (after the Tiers: Critical, Effect), special: { label, html } | null (the card's Special) }.
 */
/** v0.0.429 (the audit's gap: Reckoning's "Pushed 2" on its Save card pushed again): a chip drawn as its plain words (what it does already ran). */
export const plainChips = html => String(html ?? "").replace(/<a\b[^>]*class="[^"]*twod12-inline[^"]*"[^>]*>[\s\S]*?<span class="ti-name">([\s\S]*?)<\/span>[\s\S]*?<\/a>/g, '<span class="ti-done">$1</span>');
export async function versionCardLines(item, version, { actor = null, weapon = null, fists = false, enrich = richText, setupHtml = null, plainEffect = false } = {}) {
  const M = cardModel(item, { actor, weapon, fists });
  const vs = M.versions;
  const vm = vs.find(v => v.source === version) ?? vs.find(v => v.ap === Number(version?.ap ?? version) && (!version?.mode || v.mode === version.mode)) ?? vs[0] ?? { lines: [], roll: null, heading: "" };
  const top = [];
  let roll = null;
  for (const l of M.top) {
    if (["Attack", "Save", "Check"].includes(l.label) && l.fmt === "esc" && l === M.top.at(-1)) { roll = { label: l.label, text: l.text }; continue; }   // v0.0.525: a roll line a button makes (rich) stays a card line
    top.push({ label: l.label, html: l.label === "Setup" && setupHtml != null ? setupHtml : await lineHtml(l, item, enrich) });
  }
  // v0.0.426 (the audit: Hallowed Stance's "Setup: You Advance 3" vanished from a [Divine] card that has no Setup of its own, since v0.0.417): a
  // Setup given by the caller that the card doesn't write gets its own line, after the Requirement and the Trigger
  if (setupHtml != null && !top.some(l => l.label === "Setup")) {
    const at = top.reduce((n, l, i) => (["Requirement", "Trigger", "Interrupt"].includes(l.label) ? i + 1 : n), 0);
    top.splice(at, 0, { label: "Setup", html: setupHtml });
  }
  if (!roll && vm.roll) roll = { label: vm.roll.label, text: vm.roll.text };
  const first = vm.lines.findIndex(l => l.kind === "tier"), last = vm.lines.findLastIndex(l => l.kind === "tier");
  const part = async list => Promise.all(list.filter(l => l.kind !== "tier").map(async l => ({ label: l.label, html: await lineHtml(l, item, enrich) })));
  // v0.0.429: an Effect that runs by itself on use (a damage-free Save Action's chain) is drawn as words on the chat card, not buttons to press again
  const fx = list => (plainEffect ? list.map(l => (l.label === "Effect" ? { ...l, html: plainChips(l.html) } : l)) : list);
  return {
    top: fx(top), roll, heading: vs.length > 1 ? vm.heading : "",
    before: await part(first < 0 ? vm.lines.filter(l => l.label === "Special") : vm.lines.slice(0, first)),
    tiers: vm.lines.filter(l => l.kind === "tier").map(l => l.label),
    after: fx(await part(first < 0 ? vm.lines.filter(l => l.label !== "Special") : vm.lines.slice(last + 1))),
    special: M.special ? { label: M.special.label, html: await lineHtml(M.special, item, enrich) } : null
  };
}
export { modelRollLine as rollLine };
