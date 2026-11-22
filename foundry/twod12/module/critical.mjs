// The core rework, batch 2 (Lucas, 2026-11-22; book, Chapter 1, Critical): on a Critical,
//   - a Basic attack (the Weapon Attack, Fists, an NPC's Basic attack) deals 1d10! more, of one damage type the Action deals (pool and subtype),
//     chosen before it is rolled;
//   - an Action with a Critical row gets that row instead (Trip: [V] 1d6! Bl; Shove: Prone): its damage is rolled with the Tier, its conditions
//     are applied as the Tier's;
//   - a Critical is always optional: the pick bar asks ("Don't apply" keeps a plain Tier 3).
// Pure helpers first (the tests load them), then the question and the roll.
import { bookRoll, diceOfRoll } from "./explode.mjs";

export const CRIT_DIE = "1d10!";
const POOL_OF = { V: "B", R: "M", B: "B", M: "M" };
const POOL_WORD = { B: "V", M: "R" };

/** Pure: is this Action a Basic attack (the 1d10! by rule)? sys = the item's system, basicKey = its flag basic. */
export const isBasicAttack = (sys, basicKey = "") => !!sys?.basicAttack || ["basicWeaponAttack", "fists"].includes(String(basicKey ?? ""));

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

/**
 * Ask (the pick bar, never a dialog) whether to apply the Critical's extra, and for a Basic attack which type its 1d10! is. Returns
 * { apply: false } or { apply: true, kind } (kind for the die) / { apply: true, row: true }.
 */
export async function askCritical({ actor, item, comps = [], basic = false, rowText = "" }) {
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const plain = String(rowText ?? "").replace(/@\w+\[([^\]|]*)[^\]]*\](?:\{([^}]*)\})?/g, (_m, a, b) => b || (a ? a[0].toUpperCase() + a.slice(1) : "")).replace(/<[^>]+>/g, "").trim();
  let options;
  if (plain) options = [{ id: "row", label: `Apply: ${plain}` }];
  else if (basic) options = critKinds(comps).map((k, i) => ({ id: `k${i}`, label: kindText(k) }));
  else return { apply: false };
  if (!options.length) return { apply: false };
  options.push({ id: "no", label: "Don't apply" });
  let id = options[0].id;
  try {
    const { pickBar } = await import("./pickbar.mjs");
    id = await pickBar({ icon: "fa-star", text: `<b>${esc(item?.name ?? "Critical")}</b>: a Critical! ${plain ? "Apply its Critical row?" : "Its 1d10!: choose the damage type, or don't apply it."} (${esc(actor?.name ?? "")})`, options, cancel: "" });
  } catch (e) { console.warn("twod12 | the Critical's question", e); }
  if (!id || id === "no") return { apply: false };
  if (id === "row") return { apply: true, row: true };
  const k = critKinds(comps)[Number(String(id).slice(1))];
  return k ? { apply: true, kind: k } : { apply: false };
}

/** Roll one Critical die as a damage component (kind "D", crit: true). */
export async function critComponent({ pool = "B", sub = "", formula = CRIT_DIE }, rolls = [], label = "Critical") {
  const r = await bookRoll(formula).evaluate();
  rolls.push(r);
  return { pool, sub, kind: "D", formula, total: r.total, dice: diceOfRoll(r), label, crit: true };
}
