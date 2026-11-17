// Hazardous Terrain [HT] (Chapter 3): a lasting area that does something to the creatures in it. Its patterns:
//   Entering: when a creature enters it (a creature in it when it appears counts as entering);
//   Turn:     when a creature ends its turn in it;
//   Movement: when a creature moves within it (once per movement that crosses it).
// No pattern written: Entering and Turn. Entering and Turn share a per-creature turn-cycle limit (at most once from the start of the
// creature's turn to the start of its next turn); Movement has no limit. What happens is the area's text (a Save button, damage, a note),
// posted to the chat with the creature targeted for the GM. The area is a Region with flags.twod12.ht = { patterns, text, originUuid, name, cells, hits }.
import { tokenCells } from "./template.mjs";
import { turnCycleBlocked } from "./usage.mjs";
import { isLeanMove } from "./lean.mjs";
const F = "twod12";
export const HT_PATTERNS = { entering: "Entering", turn: "Turn", movement: "Movement" };

/** "entering+turn", "Entering, Turn", "yes"... -> ["entering", "turn"]. Empty or "yes": the default, Entering and Turn. */
export function parsePatterns(v) {
  const s = String(v ?? "").toLowerCase();
  const list = Object.keys(HT_PATTERNS).filter(k => s.includes(k));
  return list.length ? list : (/^(no|false|0|off)$/.test(s.trim()) ? [] : ["entering", "turn"]);
}
export const patternText = list => (list?.length ? list : ["entering", "turn"]).map(k => HT_PATTERNS[k]).join(", ");

const key = c => `${c.i},${c.j}`;
/** The Hazardous Terrain behavior of a Region (its Behaviors tab), if it has one: what it does and its patterns can be edited there. */
const behaviorOf = region => (region?.behaviors ?? []).find(b => b.type === "hazard") ?? null;
/** The patterns and the text of an area: the behavior when there is one (switched off: nothing), else the flags. */
function hazardData(region) {
  const ht = region.getFlag(F, "ht") ?? {}, b = behaviorOf(region);
  if (b?.disabled) return null;
  return { ...ht, patterns: b ? [...(b.system?.patterns ?? [])] : (ht.patterns ?? ["entering", "turn"]), text: b ? (b.system?.text ?? "") : (ht.text ?? "") };
}
const inside = (region, cells) => { const set = new Set(region.getFlag(F, "ht")?.cells ?? []); return cells.some(c => set.has(key(c))); };
const hazards = scene => (scene?.regions ?? []).filter(r => r.getFlag(F, "ht"));

/** v0.0.174: is any of these squares inside a Hazardous Terrain area of the scene (one that is switched on)? A Reposition can't move a creature into one. */
export function hazardIn(cells, scene = globalThis.canvas?.scene) {
  try { return hazards(scene).some(r => hazardData(r) && inside(r, cells)); } catch (e) { return false; }
}

/** Post what the area does to this creature, with the creature targeted on the GM's screen. Entering and Turn check the turn-cycle limit. */
async function trigger(region, tokenDoc, how) {
  const ht = hazardData(region);
  if (!ht || !(ht.patterns?.length ? ht.patterns : ["entering", "turn"]).includes(how)) return;
  const combat = game.combat;
  if (how !== "movement" && combat?.started) {
    const own = combat.turns.findIndex(c => c.tokenId === tokenDoc.id);
    if (turnCycleBlocked(combat.round, combat.turn, own, ht.hits?.[tokenDoc.id])) { console.log(`twod12 | [HT] ${tokenDoc.name}: already affected by ${ht.name || region.name} this turn-cycle (since round ${ht.hits[tokenDoc.id][0]}, turn ${ht.hits[tokenDoc.id][1] + 1}); again from the start of its next turn.`); return; }
    await region.setFlag(F, "ht", { ...ht, hits: { ...(ht.hits ?? {}), [tokenDoc.id]: [combat.round, combat.turn] } });
  }
  const origin = ht.originUuid ? await fromUuid(ht.originUuid).catch(() => null) : null;
  const what = { entering: "enters it", turn: "ends its turn in it", movement: "moves within it" }[how];
  const text = ht.text ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(ht.text, origin ? { relativeTo: origin } : {}) : "<i>(no effect written for this area)</i>";
  tokenDoc.object?.setTarget?.(true, { releaseOthers: true, groupSelection: false });
  // An area left by a Save Action (Rain of Arrows): the creature rolls that Save again (its player rolls it: v0.0.159).
  if (ht.save) {
    const { postSaveFor } = await import("./inline.mjs");
    await postSaveFor(ht.save, [{ uuid: tokenDoc.uuid, name: tokenDoc.name }], { point: ht.point ?? null, source: ht.name || region.name, note: `${tokenDoc.name} ${what} [HT: ${patternText(ht.patterns)}].` });
    return;
  }
  // v0.0.415 (pack CL): a system card (was a plain block); the area's text keeps its buttons
  const { sysCard } = await import("./sysmsg.mjs"), { esc } = await import("./util.mjs");
  await ChatMessage.create({ content: sysCard({ title: `Hazardous Terrain [HT: ${patternText(ht.patterns)}]`, lead: `${esc(tokenDoc.name)} ${what}${ht.name ? ` (${esc(ht.name)})` : ""}`, text: text, cls: "ht" }) });
}

export function registerHazardHooks() {
  // Where a token was, before it moved (the hooks after the update only see the new place).
  Hooks.on("preUpdateToken", (doc, changes, options) => {
    if ("x" in changes || "y" in changes) options.twod12From = { x: doc.x, y: doc.y, width: doc.width, height: doc.height };
  });
  const moved = async (doc, from, to) => {
    const before = tokenCells(from), after = tokenCells(to);
    for (const r of hazards(doc.parent)) {
      const was = inside(r, before), is = inside(r, after);
      if (is && !was) await trigger(r, doc, "entering");
      if (was || is) await trigger(r, doc, "movement");
    }
  };
  // Foundry V13+: every movement comes through moveToken, with where it started and where it ended (v0.0.149: updateToken alone missed it).
  Hooks.on("moveToken", async (doc, movement, operation) => {
    if (!game.user.isActiveGM || !movement?.origin || !movement?.destination || isLeanMove(operation, movement)) return;   // Leaning nudges are not moves
    const size = { width: doc.width, height: doc.height };
    try { await moved(doc, { ...size, ...movement.origin }, { ...size, ...movement.destination }); } catch (e) { console.warn("twod12 | [HT] movement", e); }
  });
  // Older cores (no moveToken): the position before the update.
  Hooks.on("updateToken", async (doc, changes, options) => {
    if (!game.user.isActiveGM || !options.twod12From || options.twod12Lean || options.movement || CONFIG.Token?.documentClass?.prototype?.move) return;
    await moved(doc, options.twod12From, doc);
  });
  // A creature in the area when it appears counts as entering it.
  Hooks.on("createRegion", async region => {
    if (!game.user.isActiveGM || !region.getFlag(F, "ht") || region.getFlag(F, "ht").appearHandled) return;   // a Save Action already made them save
    for (const td of region.parent?.tokens ?? []) if (inside(region, tokenCells(td))) await trigger(region, td, "entering");
  });
  // The creature whose turn just ended, if it is in the area.
  Hooks.on("combatTurnChange", async (combat, prior) => {
    if (!game.user.isActiveGM) return;
    const c = combat.combatants.get(prior?.combatantId), td = c?.token;
    if (!td) return;
    for (const r of hazards(td.parent)) if (inside(r, tokenCells(td))) await trigger(r, td, "turn");
  });
}

/**
 * The "Hazardous Terrain" Region behavior (v0.0.159): shown and edited in the Region's Behaviors tab: its patterns, what it does, where it came from.
 * The triggers themselves are this module's hooks (they read these fields); switching the behavior off stops them.
 */
export function registerHazardBehavior() {
  const Base = foundry.data?.regionBehaviors?.RegionBehaviorType;
  if (!Base || !CONFIG.RegionBehavior) return;
  const f = foundry.data.fields;
  class HazardBehavior extends Base {
    static defineSchema() {
      return {
        patterns: new f.SetField(new f.StringField({ choices: HT_PATTERNS }), { initial: ["entering", "turn"], label: "Patterns", hint: "Entering: a creature enters it (or is in it when it appears). Turn: it ends its turn in it. Movement: it moves within it. Entering and Turn: at most once per turn-cycle." }),
        text: new f.StringField({ initial: "", label: "It does", hint: "Posted to the chat when it triggers: a Save button, damage, a note." }),
        source: new f.StringField({ initial: "", label: "From", hint: "The Action that made the area." })
      };
    }
  }
  CONFIG.RegionBehavior.dataModels.hazard = HazardBehavior;
  if (CONFIG.RegionBehavior.typeIcons) CONFIG.RegionBehavior.typeIcons.hazard = "fa-solid fa-triangle-exclamation";
}
