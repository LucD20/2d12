// The Details tab of an Effect, in words: one sentence per setting (shown when it's collapsed), the "In short" line at the top,
// and the trait chips (the traits a setting needs, with the color of their family). The sheet (sheets.mjs) builds its context from these.
import { TWOD12 } from "./config.mjs";
import { esc } from "./util.mjs";

const keys = s => (s ? [...s] : []);
/** The name of an Effect by its UUID (empty when it can't be looked up: tests, or an Effect that no longer exists). */
/** v0.0.264: a Grant's "On [a result], [what happens]" as text ("" when it has none). */
const grantOnText = x => {
  const one = (on, does, text) => (!on || (does === "text" && !text) ? "" : `; on ${TWOD12.grantOnChoices[on] ?? on}, ${does === "text" ? `the card says "${esc(text)}"` : "the target's next damage is halved"}`);
  return one(x.grantOn || x.halfOn || (x.halfT3 ? "t3" : ""), x.grantDo || "half", String(x.grantText ?? "").trim()) + one(x.grantOn2 || "", x.grantDo2 || "text", String(x.grantText2 ?? "").trim());   // v0.0.266: two lines
};
const fxNameOf = uuid => { try { return uuid && typeof fromUuidSync === "function" ? (fromUuidSync(uuid)?.name ?? "") : ""; } catch (e) { return ""; } };
const traitName = k => TWOD12.traits[k] ?? TWOD12.rollKinds?.[k] ?? (String(k).startsWith("__name:") ? `${String(k).slice(7).replace(/-/g, " ")} (by name)` : k);
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
/** "Melee", "Melee and Strike", "Body, Mind or Magic". */
export function wordList(items, joiner = "and") {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${joiner} ${items.at(-1)}`;
}
const traitList = (s, joiner) => wordList(keys(s).map(k => `<b>${esc(traitName(k))}</b>`), joiner);

/** The color of a trait's family (the same colors as the book). */
export function familyColor(key) { return String(key).startsWith("__") ? "#6b6b74" : `var(--g-${TWOD12.traitGroups.find(g => g.traits.includes(key))?.key ?? "keywords"})`; }   // v0.0.179: the trait group's color

/** The four ways a setting can choose its rolls, in the order they read. */
export const PRED_FIELDS = {
  all: { lead: "with all of", label: "All of" },
  any: { lead: "or any of", label: "Any of" },
  none: { lead: "but none of", label: "None of" },
  from: { lead: "saves against Actions with any of", label: "Saves against" }
};

/** " with Melee and Strike, but not Ranged" (empty when the setting matches every roll). */
export function predicateText(x) {
  const bits = [];
  if (keys(x.all).length) bits.push(`with ${traitList(x.all, "and")}`);
  if (keys(x.any).length) bits.push(`${keys(x.all).length ? "and " : "with "}any of ${traitList(x.any, "or")}`);
  if (keys(x.none).length) bits.push(`but not ${traitList(x.none, "or")}`);
  if (keys(x.from).length) bits.push(`(saves against ${traitList(x.from, "or")} Actions)`);
  return bits.length ? " " + bits.join(", ") : "";
}

/** v0.0.186: " (the first matching Action each round), only against the creature it marked" (empty when neither is set). */
export function limitText(x) {
  const attrs = [...(x.attrs ?? [])].map(a => TWOD12.attributes[a] ?? a);
  const bits = [x.oncePerRound ? "the first matching Action each round" : "", x.vsMarked && !x.against ? "only against the creature it marked" : "",
    // v0.0.314 (pack AU): Taunted's "only against creatures other than its origin"; Sickened's Attributes
    x.type === "boonbane" && x.vsOrigin && !x.against ? (TWOD12.vsOriginChoices?.[x.vsOrigin] ?? "") : "", x.type === "boonbane" && attrs.length ? `only ${attrs.join(" or ")} rolls` : ""].filter(Boolean);
  return bits.length ? ` <i class="fxd-lim">(${bits.join("; ")})</i>` : "";
}

/** One sentence that says what a setting does. */
export function settingSentence(x) {
  const s = settingSentenceOnly(x), lim = ["boonbane", "bonusdamage", "damagestep"].includes(x.type) ? limitText(x) : "";
  return lim ? s.replace(/\.$/, `${lim}.`) : s;
}
function settingSentenceOnly(x) {
  switch (x.type) {
    case "boonbane": {
      const gains = [x.boons ? plural(x.boons, "Boon") : "", x.banes ? plural(x.banes, "Bane") : ""].filter(Boolean).join(" and ");
      const pred = predicateText(x), every = !pred;   // no traits: every roll
      const rolls = `${every ? "every roll" : "rolls"} made ${x.against ? "<b>against</b> this creature" : "by this creature"}${pred}`;
      if (!gains) return `Nothing yet on ${rolls}.`;
      const nm = { field: "Field ", pressure: "Pressure ", support: "Support " }[x.bbName] ?? "";   // v0.0.301: "1 Pressure Bane"
      return `<b>${nm ? gains.replace(/(\d+) (Boons?|Banes?)/g, `$1 ${nm}$2`) : gains}</b>${x.byValue ? " (times the condition's value)" : ""} on ${rolls}.`;
    }
    case "damagestep": {
      const dmg = [x.empowered ? `Empowered ${x.empowered}` : "", x.enfeebled ? `Enfeebled ${x.enfeebled}` : ""].filter(Boolean).join(" and ");
      const pred = predicateText(x), every = !pred;
      const rolls = `${every ? "every roll" : "rolls"} made by this creature${pred}`;
      if (!dmg) return `Nothing yet on ${rolls}.`;
      return `${rolls.charAt(0).toUpperCase()}${rolls.slice(1)} ${every ? "deals" : "deal"} <b>${dmg}</b> damage.`;
    }
    case "bonusdamage": {
      const tiers = keys(x.tiers);
      const on = tiers.length && tiers.length < 3 ? ` on ${wordList(tiers.map(t => t.toUpperCase()), "and")}` : "";
      const pool = x.dmgPool ? ` to ${esc((TWOD12.pools[x.dmgPool] ?? "").replace(/\s*\[.*\]/, ""))}` : "";
      return `The next action${predicateText(x) || " of any kind"} deals <b>+${esc(x.dmg || "?")}${x.dmgSub && x.dmgSub !== "W" ? " " + esc(TWOD12.subtypes[x.dmgSub]) : ""}</b> damage${x.dmgSub === "W" ? " (the weapon's subtype)" : ""}${pool}${on}.`;
    }
    case "bleed": {   // v0.0.314 (pack AU)
      const attrs = [...(x.attrs ?? [])].map(a => TWOD12.attributes[a] ?? a).join(" or ") || "Body or Instinct";
      const pool = x.dmgPool === "M" ? "Resolve" : (x.dmgPool === "B" ? "Vigor" : "Vigor or Resolve by the Attributes");
      return `At the end of each of its turns, the creature takes <b>${esc(x.dmg || "?")}${x.dmgSub ? " " + esc(TWOD12.subtypes[x.dmgSub]) : ""}</b> damage (${pool}); Interact and a Save with the better of ${attrs} against DC ${Math.max(0, Number(x.bleedDc) || 13)} end it.`;
    }
    case "resist": {   // v0.0.320 (pack AU part 2)
      const sub = TWOD12.subtypes[x.dmgSub] || "?";
      return x.rwKind === "immune" ? `The creature has <b>Immune ${esc(sub)}</b>.` : `The creature has <b>${x.rwKind === "weak" ? "Weak" : "Resist"} ${Math.max(0, Number(x.rwValue) || 0)} ${esc(sub)}</b>.`;
    }
    case "freqmore":
      return `While this works, ${esc(TWOD12.freqMore[x.fmWhich] ?? TWOD12.freqMore.round)}.`;
    case "inline":
      return `Has the Action <b>${esc(fxNameOf(x.inlineAction) || x.inlineAction || "?")}</b> while this lasts.`;
    case "grant":
      return `Can use <b>${esc(x.grantAction || "?")}</b> ${x.grantCount === 1 ? "once" : `${x.grantCount} times`} for <b>${x.grantAp ? `${x.grantAp} AP` : "free"}</b>${x.boons ? `, with ${plural(x.boons, "Boon")}` : ""}${x.grantDistinct ? ", a different target each time" : ""}${grantOnText(x)}.`;
    case "cover": {   // v0.0.266 (Aim)
      const lv = [...(x.coverLevels ?? [])].map(k => TWOD12.coverLevels[k] ?? k);
      return `Its Actions${predicateText(x) || ""} ignore <b>${lv.length ? lv.join(", ") : "(pick the levels)"}</b> cover: no Banes from it.`;
    }
    case "zone": {
      const who = { allies: "Allies", enemies: "Enemies", all: "Creatures" }[x.zoneWho] ?? "Allies", fx = fxNameOf(x.fxUuid), heal = String(x.zoneHeal ?? "").trim();
      return `<b>${who}</b> in the placed area${fx ? ` gain <b>${esc(fx)}</b> while inside` : ""}${fx && heal ? " and" : ""}${heal ? ` heal <b>${esc(heal)}</b> at the start of each of their turns` : ""}${!fx && !heal ? " (drop an Effect, or write a heal)" : ""}.`;
    }
    case "aura": {
      const fx = fxNameOf(x.fxUuid), who = { allies: "allies", enemies: "enemies", all: "creatures" }[x.auraWho] ?? "allies";
      return `An <b>Aura ${Math.max(1, Number(x.auraSize) || 1)}</b> around the creature: ${who}${x.auraSelf ? " and the creature itself" : ""} inside gain <b>${esc(fx) || "(drop an Effect)"}</b>.`;
    }
    case "ondamage": {
      const sub = TWOD12.subtypes[x.trigSub] ?? "any", fx = fxNameOf(x.fxUuid);
      return `When it deals <b>${esc(sub)}</b> damage to a creature${x.trigTag ? ` with the <b>${esc(x.trigTag)}</b> Tag` : ""}, that creature gains <b>${esc(fx) || "(drop an Effect)"}</b>.`;
    }
    case "defense": {
      const n = Math.trunc(Number(x.defValue)) || 0;
      return `<b>${n >= 0 ? "+" : "\u2212"}${Math.abs(n)}</b> to ${esc(TWOD12.defenseKinds[x.defKind] ?? "every Defense")}${x.defKind === "all" ? " (Armor, Ward and every Vs. Attribute)" : ""}.`;
    }
    case "speed":
      return x.speedMode === "override" ? `The creature's Speed becomes <b>${esc(x.speedFormula || "?")}</b>.` : `Add <b>${esc(x.speedFormula || "?")}</b> to the creature's Speed.`;
    case "ignore":
      return `Its Actions${predicateText(x) || ""} don't take <b>${esc(TWOD12.ignoreRules[x.ignoreRule] ?? "?")}</b>.`;
    case "turnstart":
      return `At the start of each of its turns, the creature gains <b>${esc(fxNameOf(x.fxUuid)) || "(drop an Effect)"}</b>.`;
    case "message": {
      const when = TWOD12.messageWhen[x.msgWhen] ?? TWOD12.messageWhen.encounter;
      const btn = String(x.msgAction ?? "").trim() ? `, with a button for <b>${esc(x.msgAction)}</b> (${Math.max(0, Number(x.msgAp) || 0)}${x.msgReaction ? "R, a Reaction" : " AP"})` : "";   // v0.0.525 (B3-022)
      return `${esc(when)}, posts ${x.msgTo === "all" ? "" : "to its owners "}"${esc(x.text || "(no text)")}"${btn}.`;
    }
    case "weaponprop":
      return `Its <b>${esc(TWOD12.propWeapons[x.wpWhich] ?? "Fists")}</b> don't have the property <b>${esc(TWOD12.removableProps[x.wpProp] ?? "?")}</b>.`;
    case "mastery":
      return `Choose one <b>${esc(TWOD12.weaponTraits[x.mstTrait] ?? "?")}</b> weapon: it starts at <b>${Math.max(0, Number(x.mstValue) || 0)}</b> Mastery.`;
    case "rally":
      return `Each Rally Point heals <b>${esc(x.rallyBonus || "?")}</b> more, for this creature${Number(x.rallyRange) > 0 ? ` and its allies within <b>${Number(x.rallyRange)}</b> squares` : ""}.`;
    case "eschook":
      return `Once an encounter, when ${x.hookWhen === "markDown" ? "<b>the creature it marked goes Down</b>" : x.hookWhen === "damagedDown" ? "<b>an enemy it has damaged goes Down</b>" : `<b>an ally${Number(x.hookRange) > 0 ? ` within ${Number(x.hookRange)} squares` : ""} becomes Bloodied or goes Down</b>`}, its Escalation rises by 1 (at 3: nothing, and the once isn't used up).`;
    case "light":
      return `The token sheds bright light out to <b>${x.bright}</b> and dim light out to <b>${x.dim}</b> squares${Number.isFinite(Number(x.lightAlpha)) && Number(x.lightAlpha) !== 0.5 ? `, intensity ${Number(x.lightAlpha)}` : ""}${x.lightAnim ? `, animated (${esc(x.lightAnim)} ${x.lightSpeed ?? 5} / ${x.lightIntensity ?? 5})` : ""}.`;
    case "note": {
      const attrs = keys(x.attrs).map(k => TWOD12.attributes[k] ?? k);
      return `Shows the note <b>${esc(x.title || "(no title)")}</b> in ${attrs.length ? `${wordList(attrs, "and")} rolls` : "every roll"}.`;
    }
    default: return "";
  }
}

/** The short form of a setting for the "In short" line. */
export function settingShort(x) {
  const strip = s => s.replace(/<[^>]+>/g, "");
  switch (x.type) {
    case "boonbane": {
      const gains = [x.boons ? plural(x.boons, "Boon") : "", x.banes ? plural(x.banes, "Bane") : ""].filter(Boolean).join(" and ");
      const p = strip(predicateText(x)).trim();
      if (!gains) return "no Boons yet";
      return `${gains}${p ? (p.startsWith("(") ? ` ${p}` : ` (${x.against ? "against it, " : ""}${p})`) : (x.against ? " on every roll against it" : " on every roll")}${strip(limitText(x))}`;
    }
    case "damagestep": {
      const dmg = [x.empowered ? `Empowered ${x.empowered}` : "", x.enfeebled ? `Enfeebled ${x.enfeebled}` : ""].filter(Boolean).join(", ");
      const p = strip(predicateText(x)).trim();
      if (!dmg) return "no damage step yet";
      return `${dmg}${p ? ` (${p})` : ""}${strip(limitText(x))}`;
    }
    case "aura": return `Aura ${Math.max(1, Number(x.auraSize) || 1)}: ${fxNameOf(x.fxUuid) || "no Effect yet"}`;
    case "cover": return `ignores ${[...(x.coverLevels ?? [])].map(k => TWOD12.coverLevels[k] ?? k).join(", ") || "?"} cover`;
    case "zone": return `zone: ${x.zoneWho ?? "allies"} ${fxNameOf(x.fxUuid) || (String(x.zoneHeal ?? "").trim() ? `heal ${String(x.zoneHeal).trim()}` : "?")}`;
    case "ondamage": return `${fxNameOf(x.fxUuid) || "an Effect"} on ${TWOD12.subtypes[x.trigSub] ?? "any"} damage${x.trigTag ? ` to ${x.trigTag}` : ""}`;
    case "defense": { const n = Math.trunc(Number(x.defValue)) || 0; return `${n >= 0 ? "+" : "\u2212"}${Math.abs(n)} ${x.defKind === "all" ? "Defense" : (TWOD12.defenseKinds[x.defKind] ?? "Defense")}`; }
    case "speed": return x.speedMode === "override" ? `Speed becomes ${x.speedFormula || "?"}` : `Speed ${/^[-+]/.test(x.speedFormula ?? "") ? "" : "+"}${x.speedFormula || "?"}`;
    case "light": return `light ${x.bright}/${x.dim}`;
    case "turnstart": return `${fxNameOf(x.fxUuid) || "an Effect"} each turn`;
    case "ignore": return `ignores ${(TWOD12.ignoreRules[x.ignoreRule] ?? "a Bane").replace(/ \(.*\)$/, "")}`;
    case "rally": return `Rally Points +${x.rallyBonus || "?"}${Number(x.rallyRange) > 0 ? ` (allies within ${Number(x.rallyRange)})` : ""}`;
    case "eschook": return `Escalation +1 when ${x.hookWhen === "markDown" ? "its mark goes Down" : x.hookWhen === "damagedDown" ? "an enemy it damaged goes Down" : `an ally${Number(x.hookRange) > 0 ? ` within ${Number(x.hookRange)}` : ""} is Bloodied or Down`}`;
    case "message": return `message ${(TWOD12.messageWhen[x.msgWhen] ?? "").replace(/^At the start of an? /, "at ").replace(/^At the start of each of its turns$/, "each turn").replace(/^When the creature it marked goes Down$/, "when its mark goes Down")}${String(x.msgAction ?? "").trim() ? ` (${x.msgAction})` : ""}`;
    case "weaponprop": return `${TWOD12.propWeapons[x.wpWhich] ?? "Fists"} not ${TWOD12.removableProps[x.wpProp] ?? "?"}`;
    case "mastery": return `${TWOD12.weaponTraits[x.mstTrait] ?? "?"} weapon at ${Math.max(0, Number(x.mstValue) || 0)} Mastery`;
    case "note": return `note "${x.title || "(no title)"}"`;
    case "resist": return x.rwKind === "immune" ? `Immunity ${TWOD12.subtypes[x.dmgSub] || "?"}` : `${x.rwKind === "weak" ? "Weakness" : "Resistance"} ${TWOD12.subtypes[x.dmgSub] || "?"} ${Math.max(0, Number(x.rwValue) || 0)}`;   // the Bestiary's rebuild: the word first   // v0.0.320
    case "freqmore": return x.fmWhich === "encounter" ? "Own Encounter Actions a second time" : "Own Round Actions twice per turn-cycle";
    default: return strip(settingSentence(x)).replace(/\.$/, "").replace(/^The next action/, "next action");
  }
}

/** A condition this effect applies, in words. */
export function conditionShort(c) {
  return `applies ${c.name}${c.valued ? ` ${c.value}` : ""}`;
}

/** How the effect ends, in words (empty when it lasts until removed and no action ends it). */
export function endsShort(s) {
  const bits = [];
  if (s.duration?.type === "eot") bits.push("lasts until the end of its turn");
  else if (s.duration?.type === "rounds") bits.push(`lasts ${plural(s.duration.rounds || 1, "round")}`);
  const ex = keys(s.expireOn).map(traitName);
  if (ex.length) bits.push(`ends early after ${s.expireAll ? "an action that is " + wordList(ex, "and") : "a " + wordList(ex, "or") + " action"}`);
  return bits.join(" · ");
}

/** The "In short" line: everything the effect does and how it ends, joined by middle dots. */
export function effectSummary(s) {
  const bits = [
    ...(s.settings ?? []).map(settingShort),
    ...(s.conditions ?? []).map(conditionShort)
  ];
  if (s.linked) bits.push(`also applies ${s.linked}`);
  const ends = endsShort(s);
  if (ends) bits.push(ends);
  if (!(s.settings ?? []).length && !(s.conditions ?? []).length && !s.linked) bits.unshift("does nothing yet");
  const out = bits.join(" · ");
  return out.charAt(0).toUpperCase() + out.slice(1) + ".";
}

/** v0.0.267 (Lucas): what an effect does, in a line, for its hover card: an Effect item's settings, or the item an applied effect came from. "" when it has none. */
export function effectWhat(doc) {
  try {
    let it = doc;
    if (doc?.documentName === "ActiveEffect") { const u = doc.getFlag?.("twod12", "effectUuid"); it = u ? fromUuidSync(u) : null; }
    const s = it?.system;
    if (!s || !((s.settings ?? []).length || (s.conditions ?? []).length || s.linked)) return "";
    return effectSummary(s).replace(/\.$/, "");
  } catch (e) { return ""; }
}
/** The chip rows of one setting: the fields that have traits, plus the ones the user opened (shown is a Set of field names). */
export function predRows(x, shown = new Set(), fields = ["all", "any", "none", "from"], everyLabel = "every roll") {
  // The roll kinds first (Check, Save, Attribute Action), then the traits in order.
  const sorted = [...Object.entries(TWOD12.rollKinds ?? {}), ...Object.entries(TWOD12.traits).sort((a, b) => a[1].localeCompare(b[1]))];
  const none = fields.every(f => !keys(x[f]).length);   // nothing chooses the rolls: it is every roll, and the chip says so
  return fields.filter(f => f === "all" || keys(x[f]).length || shown.has(f)).map(f => {
    const have = new Set(keys(x[f]));
    return {
      field: f, lead: PRED_FIELDS[f].lead, label: PRED_FIELDS[f].label, every: f === "all" && none ? everyLabel : "",
      chips: keys(x[f]).map(k => ({ key: k, label: traitName(k), color: familyColor(k) })),
      options: sorted.filter(([k]) => !have.has(k)).map(([key, label]) => ({ key, label }))
    };
  });
}
/** The fields of a setting that are hidden (offered as "+ Any of…" links). */
export function hiddenPreds(x, shown = new Set(), fields = ["all", "any", "none", "from"]) {
  return fields.filter(f => f !== "all" && !keys(x[f]).length && !shown.has(f)).map(f => ({ field: f, label: PRED_FIELDS[f].label }));
}
