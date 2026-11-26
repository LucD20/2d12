// The core rework, batch 2 (Lucas, 2026-11-22; book, Chapter 1, Critical); v0.0.521 (the cleanup audit, B1-003, Lucas 2026-11-26: "Yes"): on a Critical,
//   - an Action with a Critical row gets that row (the Basic Attack: [V] 1d10!; Trip: [V] 1d6! Bl; Shove: Prone): its damage is rolled with the Tier,
//     its conditions are applied as the Tier's. No rule gives a Basic attack the 1d10! any more: every Basic attack card writes its own row;
//   - a row whose dice write no subtype ("[V] 1d10!") deals one of the damage types the Action deals (pool and subtype), chosen before it is rolled;
//   - a Critical is always optional: the pick bar asks ("Don't apply" keeps a plain Tier 3).
// Pure helpers first (the tests load them), then the question and the roll.
import { bookRoll, diceOfRoll } from "./explode.mjs";

export const CRIT_DIE = "1d10!";   // the die an open Critical row is read with when it names none (askCritical, critComponent)
const POOL_OF = { V: "B", R: "M", B: "B", M: "M" };
const POOL_WORD = { B: "V", M: "R" };

/** Pure: the damage types (pool and subtype) the Action's damage components deal, each once, in order. comps = [{ pool, sub, kind, total }] */
export function critKinds(comps = []) {
  const out = [], seen = new Set();
  for (const c of comps) {
    if (!c || c.kind === "E" || c.crit) continue;   // Empowered's die and a Critical's own add no type of their own
    const k = `${c.pool || "B"}|${c.sub ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k); out.push({ pool: c.pool || "B", sub: c.sub ?? "" });
  }
  return out;
}
/** Pure: "[V] 1d10! Pi" for a kind. */
export const kindText = (k, die = CRIT_DIE) => `[${POOL_WORD[k.pool] ?? "V"}] ${die}${k.sub ? ` ${k.sub}` : ""}`;

/** Pure: the dice a Critical row deals: "[V] 1d6! Bl." -> [{ pool: "B", formula: "1d6!", sub: "Bl" }]. Anything else in the row is its conditions. */
export function critRowDice(text) {
  const out = [], re = /\[(V|R|B|M)\]\s*(\d+d\d+!?)(?:\s+([A-Z][a-z]))?/g;
  let m;
  while ((m = re.exec(String(text ?? "")))) out.push({ pool: POOL_OF[m[1]] ?? "B", formula: m[2], sub: m[3] ?? "" });
  return out;
}

/** Pure: AP gained from a Critical row ("You gain 1 AP." -> 1, else 0). */
export function critRowAp(text) {
  const m = String(text ?? "").match(/\b(?:re)?gain\s+(\d+)\s*AP\b/i);
  return m ? Math.max(0, Number(m[1]) || 0) : 0;
}

/** Pure: does the row write dice with no subtype (its type is one of the Action's, chosen)? */
export const critRowOpen = text => critRowDice(text).some(d => !d.sub);

/** Pure: the pick bar's options for a row: one a damage type for an open row (when the Action deals any), else the row as it is. */
export function critOptions(rowText, plain, comps = []) {
  const dice = critRowDice(rowText), open = dice.find(d => !d.sub), kinds = open ? critKinds(comps) : [];
  if (open && kinds.length) {
    const rest = String(plain ?? "").replace(/\[(?:V|R|B|M)\]\s*\d+d\d+!?(?:\s+[A-Z][a-z])?\.?/g, "").replace(/^[\s;,.]+|[\s;,]+$/g, "");
    return kinds.map((k, i) => ({ id: `k${i}`, label: `${kindText(k, open.formula)}${rest ? `; ${rest}` : ""}` }));
  }
  return plain ? [{ id: "row", label: `Apply: ${plain}` }] : [];
}

/**
 * Ask (the pick bar, never a dialog) whether to apply the Critical row, and for a row whose dice write no subtype which of the Action's damage
 * types they deal. Returns { apply: false } or { apply: true, row: true, kind? } (kind: the pool and subtype for the row's open dice).
 */
export async function askCritical({ actor, item, comps = [], rowText = "" }) {
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const plain = String(rowText ?? "").replace(/@\w+\[([^\]|]*)[^\]]*\](?:\{([^}]*)\})?/g, (_m, a, b) => b || (a ? a[0].toUpperCase() + a.slice(1) : "")).replace(/<[^>]+>/g, "").trim();
  const options = critOptions(rowText, plain, comps);
  if (!options.length) return { apply: false };
  const typed = options[0].id !== "row", die = critRowDice(rowText).find(d => !d.sub)?.formula ?? CRIT_DIE;
  options.push({ id: "no", label: "Don't apply" });
  let id = options[0].id;
  try {
    const { pickBar } = await import("./pickbar.mjs");
    id = await pickBar({ icon: "fa-star", text: `<b>${esc(item?.name ?? "Critical")}</b>: a Critical! ${typed ? `Its ${esc(die)}: choose the damage type, or don't apply it.` : "Apply its Critical row?"} (${esc(actor?.name ?? "")})`, options, cancel: "" });
  } catch (e) { console.warn("twod12 | the Critical's question", e); }
  if (!id || id === "no") return { apply: false };
  if (id === "row") return { apply: true, row: true };
  const k = critKinds(comps)[Number(String(id).slice(1))];
  return k ? { apply: true, row: true, kind: k } : { apply: false };
}

/** Pure: a row's die as the component to roll: an open die (no subtype) takes the chosen kind's pool and subtype. */
export const critDieFor = (d, kind) => (d.sub || !kind ? d : { ...d, pool: kind.pool, sub: kind.sub });

/** Roll one Critical die as a damage component (kind "D", crit: true). */
export async function critComponent({ pool = "B", sub = "", formula = CRIT_DIE }, rolls = [], label = "Critical") {
  const r = await bookRoll(formula).evaluate();
  rolls.push(r);
  return { pool, sub, kind: "D", formula, total: r.total, dice: diceOfRoll(r), label, crit: true };
}
// v0.0.523 (Lucas, 2026-11-26: "Remove the default critical again"): v0.0.521's default row is gone (ticking "Basic attack" no longer fills
// "[V] 1d10!"): a Critical comes only from the card's own row.
