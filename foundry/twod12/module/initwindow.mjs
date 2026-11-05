// v0.0.244 (Lucas): the Initiative window in the class window's format (pickwindow.mjs): the Attribute everyone rolls (Instinct unless the GM
// calls another), another Attribute for some creatures (v0.0.206), and this roll's Boons, Banes, Favored and Doomed. Returns what the old
// dialog returned: { attr, per: { combatantId: attr }, boons, banes, favored, doomed }, or null.
import { TWOD12 } from "./config.mjs";
import { pickWith } from "./pickwindow.mjs";
import { esc } from "./util.mjs";
const AN = TWOD12.attributes;

/** Pure: the model from the creatures rolling ([{ id, name }]) and the state { attr, per, boons, banes, favored, doomed, perOpen }. */
export function initiativeModel(list, st) {
  const attrOpts = (on, extra = []) => [...extra, ...Object.entries(AN).map(([k, l]) => ({ k, l, on: on === k, cls: `cw-a-${k}` }))];
  const sections = [
    { title: "Roll with", pill: AN[st.attr] ?? "", done: true, sub: "Initiative is an Attribute Check: everyone rolls the same Attribute (Instinct unless the GM calls another).", rows: [{ key: "attr", label: "Attribute", opts: attrOpts(st.attr) }] },
    { title: "This roll", pill: [st.boons ? `${st.boons} Boon${st.boons === 1 ? "" : "s"}` : "", st.banes ? `${st.banes} Bane${st.banes === 1 ? "" : "s"}` : "", st.favored ? "Favored" : "", st.doomed ? "Doomed" : ""].filter(Boolean).join(" · ") || "Plain", done: !!(st.boons || st.banes || st.favored || st.doomed),
      rows: [{ key: "fav", label: "The roll is", opts: [{ k: "favored", l: "Favored", on: !!st.favored }, { k: "doomed", l: "Doomed", on: !!st.doomed }] }],
      html: `<div class="cw-attr"><span>Boons and Banes</span><label class="cw-num">Boons <input type="number" min="0" step="1" data-field="boons" value="${Number(st.boons) || 0}"></label><label class="cw-num">Banes <input type="number" min="0" step="1" data-field="banes" value="${Number(st.banes) || 0}"></label></div>` }
  ];
  if (list.length > 1) {
    const per = st.per ?? {}, n = Object.keys(per).length;
    sections.push({ title: "Another Attribute for some creatures", pill: n ? `${n} changed` : "Same for all", done: n > 0, sub: "A creature that rolls another Attribute than the one above.",
      rows: list.map(c => ({ key: `per:${c.id}`, label: c.name, opts: attrOpts(per[c.id] ?? "", [{ k: "", l: "Same", on: !per[c.id] }]) })) });
  }
  return { name: "Initiative", sub: `${list.length} creature${list.length === 1 ? "" : "s"}`, icon: "fa-dice-d20", stats: [["Attribute", AN[st.attr] ?? ""], ["Rolling", list.map(c => c.name).join(", ")]], sections, complete: !!st.attr, message: `${list.map(c => esc(c.name)).join(", ")} roll${list.length === 1 ? "s" : ""} ${AN[st.attr] ?? ""}${Object.keys(st.per ?? {}).length ? " (some another Attribute)" : ""}.`, confirm: "Roll" };
}

/** Pure: a click on a row. */
export function initiativePick(st, row, k) {
  if (row === "attr") return { ...st, attr: k };
  if (row === "fav") return { ...st, [k]: !st[k] };
  if (row.startsWith("per:")) { const id = row.slice(4), per = { ...(st.per ?? {}) }; if (k) per[id] = k; else delete per[id]; return { ...st, per }; }
  return st;
}
/** Pure: a typed Boons / Banes value. */
export const initiativeInput = (st, field, value) => (["boons", "banes"].includes(field) ? { ...st, [field]: Math.max(0, Math.trunc(Number(value)) || 0) } : st);

/** Ask (the window), for these combatants: { attr, per, boons, banes, favored, doomed } or null. */
export async function askInitiative(list = []) {
  let st = { attr: "instinct", per: {}, boons: 0, banes: 0, favored: false, doomed: false };
  const rows = list.map(c => ({ id: c.id, name: c.name }));
  return pickWith({ title: "Initiative", model: () => initiativeModel(rows, st), pick: (row, k) => { st = initiativePick(st, row, k); }, input: (f, v) => { st = initiativeInput(st, f, v); },
    result: () => ({ attr: st.attr, per: st.per, boons: st.boons, banes: st.banes, favored: !!st.favored, doomed: !!st.doomed }) });
}
