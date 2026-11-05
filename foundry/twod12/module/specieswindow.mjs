// v0.0.244 (Lucas: "Species on a sheet should look just like the class one, with the selections and what it grants, and a click to confirm"):
// the Species window (pickwindow.mjs), opened when a species is dropped on a character and from the sheet (the Species section's "Choices" link,
// the Health line's species button). Its selections: the two Attributes of a species that lets you choose (Human), and the side of the bigger
// Health bonus (Human +3 / +2: with the class's high value, Vigor or Resolve). What it grants is listed: Attributes, Health bonuses, Speed,
// Reach, Size, Steadiness. Nothing is applied before Confirm.
import { TWOD12 } from "./config.mjs";
import { pickWith } from "./pickwindow.mjs";
const AN = TWOD12.attributes, SIZE = { 1: "Tiny", 2: "Small", 3: "Medium", 4: "Large", 5: "Huge", 6: "Gargantuan", 7: "Colossal" };
const sgn = n => `${n >= 0 ? "+" : "−"}${Math.abs(n)}`;

/**
 * Pure: the window's model for a species (its system data, name and img) and the state { chosen: [attribute keys], side: "" | "vigor" | "resolve" }.
 * adding: the species is being added (the confirm label); className: the class's name when the character has one (the Health row's words).
 */
export function speciesModel(sp, state, { adding = true, className = "" } = {}) {
  const s = sp.system ?? sp, chosen = state.chosen ?? [], side = state.side ?? "";
  const fixed = Object.entries(s.attributes ?? {}).filter(([, v]) => v);
  const sections = [];
  if (s.pickTwo) {
    sections.push({ title: "Attributes", pill: `${chosen.length} / 2`, done: chosen.length === 2, sub: "Choose two different Attributes to gain +1.",
      rows: [{ key: "attr", label: "+1 to", opts: Object.entries(AN).map(([k, l]) => ({ k, l, on: chosen.includes(k), off: chosen.length >= 2 && !chosen.includes(k), cls: `cw-a-${k}` })) }] });
  } else sections.push({ title: "Attributes", pill: "Granted", done: true, html: `<div class="cw-grant">${fixed.length ? fixed.map(([k, v]) => `<span class="cw-a-${k}"><b>${AN[k]}</b> ${sgn(v)}</span>`).join("") : "<em>No Attribute changes.</em>"}</div>` });
  const big = Math.max(s.bodyMod ?? 0, s.mindMod ?? 0), small = Math.min(s.bodyMod ?? 0, s.mindMod ?? 0);
  if (s.pickHealth) {
    sections.push({ title: "Health", pill: "Chosen", done: true, sub: `${sgn(big)} to one threshold and ${sgn(small)} to the other: you choose. "With the high value" follows where the class's high Health value goes.`,
      rows: [{ key: "side", label: `${sgn(big)} on`, opts: [{ k: "", l: className ? `the ${className}'s high value` : "the class's high value", on: side === "" }, { k: "vigor", l: "Vigor", on: side === "vigor" }, { k: "resolve", l: "Resolve", on: side === "resolve" }] }] });
  } else sections.push({ title: "Health", pill: "Granted", done: true, html: `<div class="cw-grant"><span><b>Vigor</b> ${sgn(s.bodyMod ?? 0)}</span><span><b>Resolve</b> ${sgn(s.mindMod ?? 0)}</span></div>` });
  sections.push({ title: "What it grants", pill: "Granted", done: true, html: `<div class="cw-grant"><span><b>Speed</b> ${s.speed ?? 5}</span><span><b>Reach</b> ${s.reach ?? 1}</span><span><b>Size</b> ${SIZE[s.size ?? 3] ?? ""} (${s.size ?? 3})</span><span><b>Steadiness</b> ${s.steadiness ?? 0}</span></div>` });
  const complete = !s.pickTwo || chosen.length === 2;
  const stats = [["Speed", String(s.speed ?? 5)], ["Reach", String(s.reach ?? 1)], ["Size", `${SIZE[s.size ?? 3] ?? ""} (${s.size ?? 3})`], ["Steadiness", String(s.steadiness ?? 0)], ["Health", s.pickHealth ? `${sgn(big)} / ${sgn(small)}, your choice` : `Vigor ${sgn(s.bodyMod ?? 0)}, Resolve ${sgn(s.mindMod ?? 0)}`]];
  const message = !complete ? `${2 - chosen.length} Attribute${2 - chosen.length === 1 ? "" : "s"} left to choose.` : (s.pickTwo || s.pickHealth ? "Everything is chosen. You can change it from the sheet (Species: Choices)." : "Nothing to choose: this species grants everything.");
  return { name: sp.name ?? "Species", sub: "Species", img: sp.img ?? "", stats, sections, complete, message, confirm: adding ? `Add ${sp.name ?? "the species"} to sheet` : "Save choices" };
}

/** Pure: a click on a row. */
export function speciesPick(state, row, k) {
  if (row === "attr") { const c = state.chosen ?? []; return { ...state, chosen: c.includes(k) ? c.filter(x => x !== k) : [...c, k].slice(-2) }; }
  if (row === "side") return { ...state, side: k === "vigor" || k === "resolve" ? k : "" };
  return state;
}

/** Open the window for a species item (the compendium's, or the character's copy) and wait: { chosen, side } or null. */
export async function chooseSpecies({ item, actor = null, adding = true }) {
  // v0.0.245 (Lucas): a dropped species starts fresh (no Attributes chosen, the bigger bonus with the high value); editing from the sheet keeps the current choices.
  let state = adding ? { chosen: [], side: "" } : { chosen: [...(item.system?.chosen ?? [])], side: actor?.system?.speciesHigh ?? "" };
  const className = actor?.itemTypes?.class?.[0]?.name ?? "";
  return pickWith({ title: `Species: ${item.name}`, model: () => speciesModel(item, state, { adding, className }), pick: (row, k) => { state = speciesPick(state, row, k); }, result: () => ({ chosen: state.chosen, side: state.side }) });
}

/** From the sheet: the character's species copy, its choices changed in place. */
export async function editSpecies(actor) {
  const sp = actor?.itemTypes?.species?.[0];
  if (!sp) return ui.notifications.warn(`${actor?.name ?? "This character"} has no species.`);
  const res = await chooseSpecies({ item: sp, actor, adding: false });
  if (!res) return;
  if (JSON.stringify([...(sp.system.chosen ?? [])]) !== JSON.stringify(res.chosen)) await sp.update({ "system.chosen": res.chosen });
  if ((actor.system.speciesHigh ?? "") !== res.side) await actor.update({ "system.speciesHigh": res.side });
}
