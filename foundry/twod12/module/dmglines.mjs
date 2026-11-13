// v0.0.333 (PACK RWI; book, Chapter 1, Resist, Weak and Immune): the sheets' "Damage" block, its chips and the window that adds, edits or removes
// a lasting line. The lines themselves come from ccdamage.mjs creatureDamageLines (every source, the highest kept), which the damage message reads too.
// A lasting line is stored as text on its document's system.dmgMods ("Resist 3 Blunt, Immune Psychic"): the actor (an NPC's stat block, a GM's
// line on a PC), a worn armor, a wielded weapon. Features, Talents and Effects give theirs with the rule "Changes a value: Resist, Weak or Immune".
import { esc } from "./util.mjs";
import { TWOD12 } from "./config.mjs";
import { parseDmgMods, SUBS } from "./chatcards.mjs";
import { dmgModsEdit, dmgModsText, damageLinesFrom, damageLineRows, damageLineChip, damageLineTip, DMG_KINDS } from "./sheetmodel.mjs";

/** The 12 subtypes, code -> name, from the config (the book's table). */
export const subNames = () => Object.fromEntries(Object.entries(TWOD12.subtypes ?? {}).filter(([k]) => k));
const KIND = { immune: "Immune", resist: "Resist", weak: "Weak" };

/** Pure: the Damage block's model. lines: creatureDamageLines; gm: the user is a GM. Hidden with no line, except for a GM (an empty block with + Add). */
export function damageBlockModel(lines, { gm = false } = {}) {
  const rows = damageLineRows(lines).map(r => ({
    ...r,
    chips: r.lines.map(l => {
      const tip = damageLineTip(l);
      return { text: damageLineChip(l), tip, aria: tip.split(": ")[0], kind: l.kind, code: l.code, dashed: l.temporary, uuid: l.source.uuid, src: l.source.type, own: l.source.type === "actor" };
    })
  }));
  return { show: rows.length > 0 || gm, rows, add: gm, empty: !rows.length };
}

/** Pure: the block's HTML (the sidebar section under Defenses). */
export function damageBlockHtml(m) {
  if (!m?.show) return "";
  // v0.0.373 (STYLE-2, Lucas): each chip in its subtype's icon and color, as the Builder's (--sc-l on parchment, --sc-d on the dark page)
  const look = c => { const T = TWOD12; return { icon: T.subtypeIcons?.[c] ?? "", style: `--sc-l:${T.subtypeInk?.[c] ?? "#5d5446"};--sc-d:${T.subtypeColors?.[c] ?? "#b3a68e"}` }; };
  const chip = c => { const l = look(c.code); return `<button type="button" class="ps-dl ${c.kind}${c.dashed ? " tmp" : ""} rw-chip" style="${l.style}" data-action="dmgLineOpen" data-kind="${c.kind}" data-sub="${esc(c.code)}" data-uuid="${esc(c.uuid)}" data-src="${c.src}" data-tooltip="${esc(c.tip)}" aria-label="${esc(c.aria)}">${l.icon ? `<i class="${l.icon}" aria-hidden="true"></i>` : ""}${esc(c.text)}</button>`; };
  const rows = m.rows.map(r => `<div class="ps-dlrow"><span class="ps-dll">${r.label}</span><span class="ps-dlc">${r.chips.map(chip).join("")}</span></div>`).join("");
  const add = m.add ? `<button type="button" class="ps-dladd" data-action="dmgLineAdd" data-tooltip="Add a lasting Immune, Resist or Weak line (GM)">+ Add</button>` : "";
  return `<section class="ps-sec line ps-rwi"><span class="ps-k">Damage Immune/Resist/Weak</span>${rows}${add}</section>`;
}

/**
 * The pick window (the system's style, pickwindow.mjs): kind, subtype, value (none for Immune); editing a line also offers Remove.
 * line: { kind, code, value } or null. Resolves { kind, sub, n, remove } or null.
 */
export async function pickDamageLine({ name, line = null }) {
  const { pickWith, pwStepHtml } = await import("./pickwindow.mjs");
  const names = subNames(), codes = Object.keys(names), T = TWOD12;
  const st = { kind: line?.kind ?? "resist", sub: line?.code ?? "", n: line?.value ?? 2, act: "save" };
  // v0.0.377 (Lucas: "the buttons like the Add section"): the twelve damage types as buttons with their icon in their color, the kinds side by side,
  // the value as a − / + stepper
  const subOpts = codes.map(c => ({ k: c, l: names[c], on: st.sub === c, icon: T.subtypeIcons?.[c] ?? "", bcls: "pw-sub", style: `--sc-l:${T.subtypeInk?.[c] ?? "#5d5446"};--sc-d:${T.subtypeColors?.[c] ?? "#b3a68e"}` }));
  return pickWith({
    title: line ? "Edit a damage line" : "Add a damage line",
    model: () => ({
      name, sub: "Immune, Resist or Weak (Chapter 1)", icon: "fa-shield-halved",
      sections: [
        { title: "Kind", rows: [{ key: "kind", label: "", opts: DMG_KINDS.map(k => ({ k, l: KIND[k], on: st.kind === k, bcls: `pw-kind ${k}` })) }] },
        { title: "Damage type", rows: [{ key: "sub", label: "", opts: subOpts.map(o => ({ ...o, on: st.sub === o.k })) }] },
        ...(st.kind === "immune" ? [] : [{ title: "Value", html: pwStepHtml("n", Number(st.n) || 1, KIND[st.kind]) }]),
        ...(line ? [{ title: "This line", rows: [{ key: "act", label: "", opts: [{ k: "save", l: "Keep (with the changes)", on: st.act === "save" }, { k: "remove", l: "Remove", on: st.act === "remove" }] }] }] : [])
      ],
      complete: st.act === "remove" || (!!st.sub && (st.kind === "immune" || Number(st.n) > 0)),
      message: st.act === "remove" ? "The line will be removed." : st.sub ? `${KIND[st.kind]}${st.kind === "immune" ? "" : ` ${Number(st.n) || 0}`} ${names[st.sub]}` : "Choose a damage type.",
      confirm: st.act === "remove" ? "Remove" : line ? "Save" : "Add"
    }),
    pick: (row, k) => { st[row] = k; },
    step: (f, d) => { if (f === "n") st.n = Math.min(30, Math.max(1, (Number(st.n) || 1) + d)); },
    input: (f, v) => { if (f === "n") st.n = Math.max(1, Math.trunc(Number(v)) || 1); },
    result: () => ({ kind: st.kind, sub: st.sub, n: st.kind === "immune" ? null : Number(st.n) || 1, remove: st.act === "remove" })
  });
}

/** Add, edit or remove one lasting line on a document with system.dmgMods (an actor, an armor, a weapon). line: the one clicked (to edit), or null (to add). */
export async function editDamageLine(doc, line = null) {
  if (!doc) return;
  const r = await pickDamageLine({ name: doc.name, line });
  if (!r) return;
  let parsed = parseDmgMods(doc.system?.dmgMods ?? "");
  if (line) parsed = dmgModsEdit(parsed, line.kind, line.code, null);
  if (!r.remove) parsed = dmgModsEdit(parsed, r.kind, r.sub, r.kind === "immune" ? 1 : r.n);
  await doc.update({ "system.dmgMods": dmgModsText(parsed, SUBS) });
}

/** Pure: a document's own stored lines (an item sheet's "Damage lines" list), as effective lines. */
export const ownLines = doc => damageLinesFrom([{ name: doc?.name ?? "", type: "item", uuid: doc?.uuid ?? "", lines: (() => { const p = parseDmgMods(doc?.system?.dmgMods ?? ""); return [...Object.entries(p.resist).map(([sub, n]) => ({ kind: "resist", sub, n })), ...Object.entries(p.weak).map(([sub, n]) => ({ kind: "weak", sub, n })), ...p.immune.map(sub => ({ kind: "immune", sub }))]; })() }], subNames());

/** Pure: the item sheet's "Damage lines" list (armor: while worn; weapon: while wielded). */
export function itemDamageHtml(doc, { editable = true } = {}) {
  const lines = ownLines(doc), when = doc?.type === "armor" ? "while worn" : "while wielded";
  const chips = lines.map(l => `<button type="button" class="ps-dl ${l.kind}" data-dl-edit data-kind="${l.kind}" data-sub="${esc(l.code)}" data-value="${l.value ?? ""}" aria-label="${esc(damageLineTip(l).split(": ")[0])}" data-tooltip="${esc(damageLineTip(l).replace(/, from [^:]*:/, ` (${when}):`))}"${editable ? "" : " disabled"}>${esc(l.kind === "immune" ? `Immune ${l.subtype}` : `${KIND[l.kind]} ${l.value} ${l.subtype}`)}</button>`).join("");
  return `<div class="it-dmg"><span class="it-dmgl">Damage lines <small>${when}</small></span><span class="ps-dlc">${chips || '<span class="ps-mut">None.</span>'}${editable ? '<button type="button" class="ps-dladd" data-dl-add>+ Add</button>' : ""}</span></div>`;
}
