import { weaponRanges } from "./weaponrange.mjs";
const sortObj = o => Object.fromEntries(Object.entries(o).sort((a, b) => a[1].localeCompare(b[1])));
const actionTraits = sortObj({
  area: "Area",
  appeal: "Appeal",
  body: "Body",
  divine: "Divine",
  fear: "Fear",
  focus: "Focus",
  handle: "Handle",
  instinct: "Instinct",
  magic: "Power",   // the key stays "magic" (saved worlds and content use it); the trait is called Power since v0.0.117
  melee: "Melee",
  mind: "Mind",
  move: "Move",
  nonlethal: "Nonlethal",
  ranged: "Ranged",
  save: "Save",
  self: "Self",
  shot: "Shot",
  signature: "Signature",
  split: "Split",
  strike: "Strike",
  weapon: "Weapon"
});
const weaponTraits = sortObj({ barehanded: "Barehanded", long: "Long", melee: "Melee", nonthreatening: "Non-threatening", projectile: "Projectile", ranged: "Ranged", reload: "Reload", thrown: "Thrown", twohanded: "Two-handed" });

export const TWOD12 = {
  attributes: { body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" },
  actionTraits,
  weaponTraits,
  traits: { ...actionTraits, ...weaponTraits },
  dice: { "": "None", d4: "d4", d6: "d6", d8: "d8", d10: "d10", d12: "d12", d20: "d20" },
  // Damage subtypes use two letters, so they never look like the pools [B] [M] [C].
  /** The one-letter shorthand of the Action Generator ("1d6MH" = 1d6, Mind, Holy): B Blunt, C Cold, H Holy, M Psychic, P Pierce, S Slash. */
  subtypeLetters: { B: "Bl", C: "Co", H: "Ho", M: "Ps", P: "Pi", S: "Sl" },
  subtypes: {
    "": "None",
    ...sortObj({
      Ac: "Acid",
      Bl: "Blunt",
      Co: "Cold",
      El: "Electricity",
      Fi: "Fire",
      Fo: "Force",
      Ho: "Holy",
      Pi: "Pierce",
      Ps: "Psychic",
      Sl: "Slash",
      Th: "Thunder",
      Un: "Unholy"
    })
  },
  subtypeColors: {
    Ac: "#7cb342",
    Bl: "#8a8a8a",
    Co: "#4fc3e8",
    El: "#3d8bfd",
    Fi: "#e8622a",
    Fo: "#b06ad8",
    Ho: "#d9b52e",
    Pi: "#8a8a8a",
    Ps: "#8c68d6",
    Sl: "#8a8a8a",
    Th: "#5c7fa3",
    Un: "#7a3b52"
  },
  frequencies: { "": "Default", none: "None", atwill: "At-will", turn: "Turn", round: "Round", encounter: "Encounter", daily: "Daily" },
  // The kind of a roll, for effects (Round 10): checks and saves are marked when they are rolled, and an Action that rolls an Attribute
  // directly (not a Weapon, Power or Signature roll) is an Attribute Action. Weapon, Power and Signature rolls are their traits.
  rollKinds: { __check: "Check", __save: "Save", __attr: "Attribute Action" },
  pools: { "": "None", B: "Body [B]", M: "Mind [M]", C: "Choice [C]" },
  // Damage types: one icon each (Slash also has Foundry's sword image on cards), bright colors for dark backgrounds,
  // and dark "ink" colors for the parchment cards.
  subtypeIcons: {
    Ac: "fa-solid fa-droplet",
    Bl: "fa-solid fa-hammer",
    Co: "fa-solid fa-snowflake",
    El: "fa-solid fa-bolt",
    Fi: "fa-solid fa-fire",
    Fo: "fa-solid fa-atom",
    Ho: "fa-solid fa-sun",
    Pi: "fa-solid fa-arrow-right",
    Ps: "fa-solid fa-hurricane",
    Sl: "fa-solid fa-slash",
    Th: "fa-solid fa-volume-high",
    Un: "fa-solid fa-skull"
  },
  subtypeInk: {
    Ac: "#3B6D11",
    Bl: "#5F5E5A",
    Co: "#185FA5",
    El: "#9A7400",
    Fi: "#993C1D",
    Fo: "#8A2BD4",
    Ho: "#854F0B",
    Pi: "#5F5E5A",
    Ps: "#993556",
    Sl: "#5F5E5A",
    Th: "#0C447C",
    Un: "#4A1D63"
  },
  defaultTags: [
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Holy",
    "Humanoid",
    "Ooze",
    "Plant",
    "Profane",
    "Undead",
    "Unholy"
  ], // the starting list of the world setting "Tags"
  poolNames: { B: "Body [B]", M: "Mind [M]", C: "Choice [C]", "": "Damage" },
  traitHelp: {
    area: "These Actions target every creature in their area that they affect, ignoring Senses (no penalty against Obscured, Hidden or Unsensed creatures, and light doesn't change the roll). You need Line of Effect to the Point of Origin to place the area; Line of Effect and Cover are checked from the Point of Origin to each creature.",
    strike: "Extra rules: you can make at most three Strikes per turn.",
    nonlethal: "Deals Nonlethal damage by default. Taking a bane makes it deal Lethal damage instead.",
    body: "Rolls Body.",
    mind: "Rolls Mind.",
    appeal: "Rolls Appeal.",
    instinct: "Rolls Instinct.",
    magic: "Power: rolls your Power Modifier. Its damage is the dice on the card: no Attribute is added, on any Tier. Needs no weapon.",
    signature: "Rolls your Signature Modifier (the higher of Weapon and Power). On every Tier, Tier 1 included, your Signature Attribute is added to the first damage instance. Never needs a weapon.",
    split: "Two modes, Weapon and Power: choose one each time you use it. In that mode it takes the mode's trait and is an Action of that mode for every rule (a Weapon Action needs a weapon; a Power Action doesn't). Frequency, target, trigger and Critical are shared; the damage and traits are the mode's.",
    fear: "No rules of its own: other features refer to it.",
    focus: "Requires concentration. This is not a mechanic by itself, but some features affect your ability to concentrate.",
    weapon:
      "Requires a weapon. Rolls your Weapon Modifier. On a Tier 2 or 3, your Weapon Attribute is added to the weapon's damage.",
    handle: "You must be able to use your hands and have a hand free. Releasing an object costs no AP (Release).",
    melee: "Requires a Melee weapon. Normally uses your Reach as the Distance.",
    ranged: "Requires a Ranged weapon. The weapon defines the Distance.",
    barehanded: "Can't be disarmed and uses no hand, but you need a free hand to use it.",
    nonthreatening: "Doesn't threaten: you can't flank with it, unless a feature says otherwise (Fists have it; Brawler removes it).",
    move: "You must have a Speed of at least 1."
  },
  effectSettings: { boonbane: "Boons and Banes", damagestep: "Empowered and Enfeebled", bonusdamage: "Bonus Damage", defense: "Defense", aura: "Aura", ondamage: "On damage", grant: "Grant Action Use", speed: "Speed", light: "Token Light", note: "Note" },
  durationTypes: { "": "None", eot: "End of Turn (EoT)", rounds: "Rounds" },
  traitFamilies: [
    // By rules role (the same colors as the book): what you roll, what you need, who it hits, what it deals, no rule of its own, weapon properties.
    { key: "roll", color: "#3f8f8a", traits: ["appeal", "body", "instinct", "magic", "mind", "save", "signature", "split", "weapon"] },
    { key: "need", color: "#4b7aa6", traits: ["handle", "melee", "move", "ranged", "shot"] },
    { key: "hits", color: "#c0603f", traits: ["area", "self", "strike"] },
    { key: "deals", color: "#a8862c", traits: ["nonlethal"] },
    { key: "none", color: "#888780", traits: ["divine", "focus"] },
    { key: "item", color: "#5b8a5a", traits: ["barehanded", "nonthreatening", "projectile", "reload", "twohanded"] }
  ],
  // The Bestiary (book: bestiary.html; v0.0.163): an NPC is a role plus a rating for each number. Level 1 tables only (later levels are not written yet).
  //   attr: the Medium Attribute; hm, hb: the Medium Health Multiplier and the Health Base; defense: the Medium Defense; basic: Medium Basic attack averages (Tier 2, Tier 3, [Mod] included);
  //   deals: what it should deal a turn to an average PC (the book's targets).
  npcRoles: {
    minion: { label: "Minion", cv: 0.25, ap: 3, attr: 0, hm: 1, hb: 1, defense: 12, basic: [2, 4], extreme: false, deals: "3 to 4", takes: "one PC hit" },
    grunt: { label: "Grunt", cv: 0.5, ap: 5, attr: 0, hm: 5, hb: 3, defense: 13, basic: [3, 4.5], extreme: true, deals: "5", takes: "1 PC turn" },
    standard: { label: "Standard", cv: 1, ap: 5, attr: 1, hm: 7, hb: 4, defense: 13, basic: [4.5, 7.5], extreme: true, deals: "7 to 8", takes: "2 PC turns" },
    elite: { label: "Elite", cv: 2, ap: 5, attr: 2, hm: 12, hb: 6, defense: 14, basic: [6.5, 10], extreme: true, deals: "15", takes: "4 to 5 PC turns" }
  },
  //   off: Attribute and Defense steps; step: damage; hstep: Health Multiplier; score: for "the ratings average" (-2 to +2).
  npcRatings: {
    terrible: { label: "Terrible", off: -2, step: 0.6, hstep: 0.5, score: -2 },
    low: { label: "Low", off: -1, step: 0.8, hstep: 0.75, score: -1 },
    medium: { label: "Medium", off: 0, step: 1, hstep: 1, score: 0 },
    high: { label: "High", off: 1, step: 1.2, hstep: 1.25, score: 1 },
    extreme: { label: "Extreme", off: 2, step: 1.4, hstep: 1.5, score: 2 }
  },
  npcMinionHm: { terrible: 0, low: 0.75, medium: 1, high: 1.25 },
  npcSpeeds: [3, 4, 5, 6, 7],   // the Builder's Speed choices (5 by default); any other Speed is Custom   // a Minion's Health Multipliers (no Extreme)
  npcSpecial: [{ key: "basic", label: "Basic attack", sub: "1 AP, At-will", x: 1 }, { key: "s1", label: "Special, 1 AP", sub: "Round", x: 1.4 }, { key: "s2", label: "Special, 2 AP", sub: "Round", x: 2.2 }, { key: "s3", label: "Special, 3 AP", sub: "Encounter (not Minions)", x: 3.5 }],
  // A level 1 PC's damage a turn against a Defense (ruler: book/ruler/defense.mjs, mean of the Paladin's and the Archer's turn), for the Builder's check.
  pcDamageVsDefense: { 11: 27.0, 12: 25.2, 13: 23.3, 14: 21.3, 15: 19.2, 16: 17.3 },
  cardColors: { weapon: "#d6b53f", self: "Always targets you, the origin of the Action. An [Area] Action with Self is centered on you.", default: "#9c9c9c" },
  movementActions: { walk: "Walk", fly: "Fly", swim: "Swim", climb: "Climb", crawl: "Crawl", burrow: "Burrow" },
  vsChoices: { "": "None (DC 13)", roll: "The attribute rolled (Body or Instinct...)", body: "Body", mind: "Mind", appeal: "Appeal", instinct: "Instinct" },
  // Collision when Pushed: unused squares of the push x damage per square (Body). A wall hurts the pushed creature; a creature hurts both.
  collision: { wall: 2, creature: 1 },
  baseDC: 13,
  // Defenses (Round 11/12): Armor and Ward are 11 + their value; Vs. an Attribute is baseDC + half the Attribute.
  defenseBase: 11,
  // The default colors of an Aura on the map by who it affects (each Aura can set its own outline and squares colors).
  auraColors: { allies: "#4a90d9", enemies: "#d94a4a", all: "#9b59b6" },
  armors: { unarmored: { label: "Unarmored", value: 0, rank: 0 }, light: { label: "Light", value: 1, rank: 1 }, medium: { label: "Medium", value: 2, rank: 2 }, heavy: { label: "Heavy", value: 3, rank: 3 } },
  armorTrainings: { light: "Light", medium: "Medium", heavy: "Heavy" },
  // What a Defense bonus (a Feature's or an effect's) raises: every Defense, Armor, Ward, or one Vs. Attribute.
  defenseKinds: { all: "every Defense", armor: "Armor Defense (AD)", ward: "Ward Defense (WD)", body: "Vs. Body", mind: "Vs. Mind", appeal: "Vs. Appeal", instinct: "Vs. Instinct" },
  basicCategory: "Basic Action",
  pushSpeed: 20, // squares per second when a token is pushed (normal movement is slower)
  // Pushed: the creature can only end in a cone (degrees either side of the line straight away from the origin).
  pushCone: 45
};

/** CSS variables for a card color (title color and a soft gradient). */
export const cardVars = hex => {
  const n = parseInt(hex.slice(1), 16);
  return `--card-color:${hex};--card-text:#f4f4f0;--card-grad:rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},.30);--card-head:rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},.50);`;
};

/** The title bar of an Action card: name on the left, category and cost on the right. */
export const cardHead = (name, cat, costHtml, freq = "") => `<div class="ahead"><b>${escAttr(name)}</b><div class="aright"><span class="atop">${freq && TWOD12.frequencies[freq] ? `<span class="afreq">${escAttr(TWOD12.frequencies[freq])}</span>` : ""}${costHtml ? `<span class="aps">${costHtml}</span>` : ""}</span>${cat ? `<span class="acat">${escAttr(cat)}</span>` : ""}</div></div>`;
/** Damage on cards: a filled heart for Body, a filled brain for Mind, and each damage type in its own color with its icon. */
export const poolIcon = pool => pool === "M" ? '<i class="fa-solid fa-brain dt-mind" data-tooltip="Mind damage"></i>'
  : pool === "C" ? '<span class="dt-choose" data-tooltip="Body or Mind: the origin chooses"><i class="fa-solid fa-heart dt-body"></i><i class="fa-solid fa-brain dt-mind"></i></span>'
  : '<i class="fa-solid fa-heart dt-body" data-tooltip="Body damage"></i>';
/** A damage type's icon (on parchment cards, Slash uses Foundry's sword image). */
export const dtypeIcon = k => (k === "Sl" ? '<img class="dt-img" src="icons/svg/sword.svg" alt="">' : `<i class="${TWOD12.subtypeIcons[k] ?? ""}"></i>`);
export const dtypeHtml = code => {
  const k = Object.keys(TWOD12.subtypeInk).find(x => x.toLowerCase() === String(code ?? "").toLowerCase());
  return k ? `<span class="dtype dt-${k.toLowerCase()}" style="color:${TWOD12.subtypeInk[k]}">${dtypeIcon(k)} ${TWOD12.subtypes[k]}</span>` : "";
};
/** Turn "[B] 1[W] Sl" (already escaped) into the card's look: icons for [B]/[M]/[C], the damage type as a colored name. */
/** The ink of a damage type ("Co" -> its color), for the amount written before it (v0.0.137: "1d8 Cold" is all in Cold's color). */
export const inkOf = code => { const k = Object.keys(TWOD12.subtypeInk ?? {}).find(x => x.toLowerCase() === String(code ?? "").toLowerCase()); return k ? TWOD12.subtypeInk[k] : ""; };
export const prettyDamage = html => String(html ?? "")
  .replace(/(\d*\[W\]|\[At\]|\d+d\d+(?:[+-]\d+)?|\b\d+)(\s+)(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, (m, amt, sp, code) => (inkOf(code) ? `<span class="dtamt" style="color:${inkOf(code)}">${amt}</span>${sp}${code}` : m))
  .replace(/\[(B|M|C)\]/g, (m, p) => poolIcon(p))
  .replace(/\b(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un)\b/g, m => dtypeHtml(m));

/** The optional flavor line, under the title bar. */
export const flavorHtml = d => (d?.flavor ? `<div class="flavor">${escAttr(d.flavor)}</div>` : "");

/** AP cost as one of the five Action Icons (falls back to text above 5). Colored by the surrounding text color. */
/** The cost of an Action as one badge: "2AP", "1/2/3AP" when it has several Versions, or "1R" for a Reaction. */
export const apLabel = (aps, reaction = false) => {
  const list = [...new Set([].concat(aps))].sort((a, b) => a - b), txt = list.join("/");
  return reaction
    ? `<span class="rmark" data-tooltip="Reaction: ${txt} Action Point${list.length === 1 && list[0] === 1 ? "" : "s"}, used as a response to its Trigger">${txt}R</span>`
    : (list.length === 1 && list[0] === 0 ? `<span class="apmark" data-tooltip="0 AP: it costs no Action Points, and can be used only on your turn">0AP</span>` : `<span class="apmark" data-tooltip="${txt} Action Point${list.length === 1 && list[0] === 1 ? "" : "s"}">${txt}AP</span>`);
};
export const apIcon = (n, reaction = false) => apLabel([n], reaction);

const escAttr = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/** Traits as chevron tags, grouped by family: inside a group the back of each chevron is indented to nest with the previous one. */
/** Trait chips: a flat tag per trait, tinted by its family (Strike red, Melee and Self blue, Divine and Weapon gold...). */
const CHIP_COLORS = { roll: ["#9FE1CB", "#085041"], need: ["#B5D4F4", "#0C447C"], hits: ["#F5C4B3", "#712B13"], deals: ["#FAC775", "#633806"], none: ["#B4B2A9", "#2C2C2A"], item: ["#C0DD97", "#27500A"] };
export function traitChevrons(traits) {
  // Alphabetical, each chip tinted by its rules role.
  const label = k => String(TWOD12.traits[k] ?? k);
  const out = [...traits].sort((a, b) => label(a).localeCompare(label(b))).map(k => {
    const f = TWOD12.traitFamilies.find(x => x.traits.includes(k));
    const [bg, fg] = CHIP_COLORS[f?.key] ?? ["#D3D1C7", "#444441"];
    return { k, bg, fg };
  });
  return out.map(({ k, bg, fg }) => `<span class="tchip" style="--tb:${bg};--tt:${fg}" data-tooltip="${escAttr(TWOD12.traitHelp[k] ?? "TBD")}">${escAttr(TWOD12.traits[k] ?? k)}</span>`).join("");
}

/** The category shown at the far right of an Action title: "Paladin Feature 1" (the number is the level it is gained). */
export const categoryText = d => {
  const c = String(d?.category ?? "").trim(), l = Number(d?.level) || 0;
  return c ? (l > 0 ? `${c} ${l}` : c) : (l > 0 ? `Level ${l}` : "");
};

/** The card color of an Action: gold for Weapon actions, blue for Self actions. */
/** The title bar of a card is colored by its Frequency: At-will green, Round blue, Encounter red, no limit grey. */
export const FREQ_COLORS = { atwill: "#3B6D11", turn: "#0F6E6E", round: "#185FA5", encounter: "#A32D2D", daily: "#5B3FA6", "": "#5F5E5A", none: "#5F5E5A" };
export const cardColorFor = d => FREQ_COLORS[effectiveFrequency(d ?? {})] ?? FREQ_COLORS[""];

const TRAIT_WORDS = { Strike: "strike", Nonlethal: "nonlethal", Divine: "divine", Focus: "focus", Handle: "handle", Power: "magic", Signature: "signature", Melee: "melee", Ranged: "ranged", Self: "self", Weapon: "weapon", Reload: "reload", "Two-handed": "twohanded" };
const DAMAGE_WORDS = { Acid: "Ac", Blunt: "Bl", Cold: "Co", Electricity: "El", Fire: "Fi", Force: "Fo", Holy: "Ho", Pierce: "Pi", Psychic: "Ps", Slash: "Sl", Thunder: "Th", Unholy: "Un" };
const famColor = key => (TWOD12.traitFamilies.find(f => f.traits.includes(key)) ?? { color: "#888780" }).color;

/**
 * Low-contrast backgrounds behind trait names and colored damage types written in rules text ("Next Strike +1d6 Cold").
 * Only whole capitalized words outside of tags and buttons are touched. Can be turned off in the client settings.
 */
export function highlightText(html) {
  try { if (game.settings.get("twod12", "highlightTraits") === false) return html; } catch (e) { /* setting not registered yet */ }
  const re = new RegExp(`\\b(${[...Object.keys(TRAIT_WORDS), ...Object.keys(DAMAGE_WORDS)].sort((a, b) => b.length - a.length).join("|")})\\b`, "g");
  let skip = 0;
  return String(html).split(/(<[^>]+>)/).map(part => {
    if (part.startsWith("<")) {
      if (/^<(a|button)\b/i.test(part)) skip++;
      else if (/^<\/(a|button)>/i.test(part)) skip = Math.max(0, skip - 1);
      return part;
    }
    if (skip) return part;
    return part.replace(re, w => TRAIT_WORDS[w]
      ? `<span class="trhl" style="--tc:${famColor(TRAIT_WORDS[w])}">${w}</span>`
      : `<span class="dmgword" style="--dc:${TWOD12.subtypeColors[DAMAGE_WORDS[w]]}">${w}</span>`);
  }).join("");
}

/**
 * The line under the traits: the Frequency (only when it matters) and the Target text, separated by a sparkle.
 * Then, on its own line, the tokens that are targeted.
 */
export function metaRowHtml({ frequency = "", targetText = "", distance = "", vs = "", requirements = "", trigger = "", reactionKind = "", self = false, escalation = 0 } = {}) {
  const sep = ' <i class="fa-solid fa-sparkle sep"></i> ';
  // Three lines, always in the same place (v0.0.157): 1 Escalation; 2 Targets ✦ Area; 3 Distance ✦ Vs. (a Save: "Instinct Save").
  // The Frequency is in the title bar (cardHead). The Self trait already says it targets you, so Self is left out.
  const area = /^Area: /.test(distance);
  const l1 = Number(escalation) > 0 ? [`<span class="esc">${Number(escalation)} Escalation</span>`] : [];
  const l2 = [(!self || area) && targetText ? `<span class="tgt">${escAttr(targetText)}</span>` : "", area ? `<span class="dist"><b>Area:</b> ${escAttr(distance.slice(6))}</span>` : ""].filter(Boolean);
  const l3 = [distance && !area && distance.toLowerCase() !== "self" ? `<span class="dist"><b>Distance:</b> ${escAttr(distance)}</span>` : "", vs ? `<span class="vs">${/save$/i.test(String(vs).trim()) ? "" : "Vs. "}${escAttr(vs)}</span>` : ""].filter(Boolean);
  const row = [l1, l2, l3].filter(l => l.length).map(l => `<div class="trow"><span>${l.join(sep)}</span></div>`).join("");
  const req = requirements ? `<div class="trow reqrow"><span><b>Requirements:</b> ${escAttr(requirements)}</span></div>` : "";
  const trg = trigger ? `<div class="trow trgrow"><span><b>${reactionKind === "interrupt" ? "Interrupt" : "Trigger"}:</b> ${escAttr(trigger)}</span></div>` : "";
  return row + req + trg;
}

/** The targeted tokens, shown at the bottom of an Action card (like the damage card). */
export const targetsRowHtml = (tokens, { retarget = false } = {}) =>
  tokens?.length || retarget
    ? `<div class="tline cardtargets">${retarget ? `<button type="button" class="tgt" data-twod12="retargetAction" data-tooltip="Target the selected tokens"><i class="fa-solid fa-bullseye"></i></button>` : `<i class="fa-solid fa-crosshairs"></i>`}<span>${tokens?.length ? tokens.map(escAttr).join(", ") : "No target"}</span></div>`
    : "";

/** "Speed 3" in Requirements: the creature needs at least that Speed. Returns a reason it can't, or "". */
/** Hands in use: every wielded weapon uses its hands, except Barehanded weapons (they use no hand). */
export const handsUsed = actor => (actor?.itemTypes?.weapon ?? []).filter(w => w.system.wielded && !w.system.traits?.has?.("barehanded")).reduce((n, w) => n + (w.system.hands ?? 1), 0);

/** Requirements are checked before the Action is used. Understood: "Speed 3", "free hand", "SR is at most N higher than yours" (and the old "Size is at most N higher"). */
export function requirementProblem(d, actor, target = null, opts = {}) {
  const req = String(d?.requirements ?? "");
  const m = req.match(/Speed\s*(?:of\s*)?(\d+)/i);
  if (m && (actor?.system?.moveSpeed ?? actor?.system?.speed ?? 0) < Number(m[1])) return `needs a Speed of at least ${m[1]}`;
  const sz = req.match(/(?:SR|Size) is at most (\d+) higher than yours/i);
  if (sz && target && (target.system?.size ?? 3) > (actor?.system?.size ?? 3) + Number(sz[1])) return `needs a target whose SR is at most ${sz[1]} higher than yours`;
  // Haul (v0.0.170): "Your Reach is 2 or more", "is at least 2 squares away" (opts.distance: the squares between the two creatures, when both are on the map).
  const rc = req.match(/Your Reach is (\d+) or more/i);
  if (rc && Math.max(1, Number(actor?.system?.reach) || 1) < Number(rc[1])) return `needs a Reach of ${rc[1]} or more`;
  const far = req.match(/at least (\d+) squares away/i);
  if (far && target && Number.isFinite(opts.distance) && opts.distance < Number(far[1])) return `needs a target at least ${far[1]} squares away (it is ${opts.distance})`;
  if (!opts.skipHands && /free hand/i.test(req) && handsUsed(actor) >= 2) return "needs a free hand";
  return "";
}

/** "1 Emanation within 10 sq." -> { shape, size, within }. */
export function parseArea(text) {
  const m = String(text ?? "").trim().match(/^(\d+)\s*(emanation|burst)(?:\s+within\s+(\d+)\s*sq\.?)?$/i);
  return m ? { size: Number(m[1]), shape: m[2].toLowerCase(), within: m[3] ? Number(m[3]) : 0 } : null;
}
/** The inline button that places the Area of an Action ("" when it has none). */
/** An Action's Area as the settings for placing it: { shape, distance, targets, self, keep, rounds, at }, or null without an Area. */
export function areaConfigOf(d) {
  const c = d?.areaCfg, set = c?.size > 0;
  const a = set ? { size: c.size, shape: c.shape || "emanation", within: c.within || 0 } : parseArea(d?.area);
  if (!a) return null;
  const onSelf = a.shape === "emanation" && !a.within && !!d?.traits?.has?.("self");
  return { shape: a.shape, distance: a.size, targets: c?.targets || "all", self: !!c?.center, keep: !!c?.keep, rounds: c?.rounds || 0, at: onSelf ? "self" : "", withinRange: c?.withinRange || "", ht: c?.ht || "" };
}

export const areaButton = d => {
  const c = d?.areaCfg, set = c?.size > 0;
  const a = set ? { size: c.size, shape: c.shape || "emanation", within: c.within || 0 } : parseArea(d?.area);
  if (!a) return "";
  // A Self Action whose Emanation has no "within" is centered on you: no placing needed.
  const onSelf = a.shape === "emanation" && !a.within && !!d?.traits?.has?.("self");
  const opts = [a.shape, `distance:${a.size}`, `targets:${c?.targets || "all"}`, `self:${c?.center ? "yes" : "no"}`, c?.keep ? "keep:yes" : "", c?.rounds ? `rounds:${c.rounds}` : "", c?.ht ? `ht:${c.ht}` : "", onSelf ? "at:self" : "", set ? "quick:yes" : "", `label:${onSelf ? "Apply Area" : "Place Area"}`];
  return `@Template[${opts.filter(Boolean).join("|")}]`;
};
/** An Action that is a Talent: its category starts with "Talent" (Aim, Cut Through...). It goes in the Talents and Features tab, not only in Actions. */
export const isTalentAction = i => i?.type === "action" && /^talent/i.test(String(i.system?.category ?? "")) && !i.getFlag?.("twod12", "talentId") && !i.getFlag?.("twod12", "basic");
/** How many different creatures an Action's Target names ("Two creatures" → 2; "One creature", "All creatures in the Area" → 1). */
export function targetsNeeded(text) {
  const words = { two: 2, three: 3, four: 4, five: 5, six: 6 };
  const m = String(text ?? "").trim().match(/^(two|three|four|five|six|\d+)\s+(?:different\s+)?creatures?\b/i);
  if (!m) return 1;
  return words[m[1].toLowerCase()] ?? Math.max(1, parseInt(m[1], 10) || 1);
}

/** Size names by rank. */
export const SIZE_NAMES = ["", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];

/** The Frequency that counts: Default is Round for Weapon actions and none for the rest; "None" turns it off. */
/** The line on the left of a row: an Action, Talent or Feature with a Frequency has its color; the others a color of their kind. */
export const KIND_LINE = { talent: "#BA7517", feature: "#8a7650" };
export const lineColorFor = item => (effectiveFrequency(item?.system) ? cardColorFor(item.system) : (KIND_LINE[item?.type] ?? KIND_LINE.feature));

export const effectiveFrequency = d => {
  const f = d?.frequency ?? "";
  if (f === "none") return "";
  return f;   // the Weapon trait no longer means Round (each Action names its Frequency)
};

export const ATTR_KEYS = ["body", "mind", "appeal", "instinct"];
/** The attribute an Action rolls: its Body, Mind, Appeal or Instinct trait (the traits decide the roll). */
export const checkAttr = (d, attrs = null) => {
  const have = ATTR_KEYS.filter(k => d?.traits?.has?.(k));
  if (have.length <= 1 || !attrs) return have[0] ?? "";
  // More than one of the traits (Trip: Body and Instinct): the highest value is used.
  return have.reduce((best, k) => ((attrs[k] ?? 0) > (attrs[best] ?? 0) ? k : best), have[0]);
};

/** The Defense of an Action as text: "Body", or "Body or Instinct" when it is the attribute that was rolled. */
export function vsText(d, { src = null, fists = false, rolls = null } = {}) {
  if (d?.traits?.has?.("save") && d?.vs && d.vs !== "roll") return `${TWOD12.attributes[d.vs] ?? d.vs} Save`;   // a Save Action: "Instinct Save"
  if (d?.vs === "roll") return ATTR_KEYS.filter(k => d.traits?.has?.(k)).map(k => TWOD12.attributes[k]).join(" or ") || "the attribute rolled";
  if (d?.vs) return TWOD12.attributes[d.vs] ?? "";
  // Every Action that rolls has a Vs. entry (Versus): AD for Weapon Actions and Fists, WD for Power Actions,
  // the Defense of its Modifier for a Signature Action, and DC 13 for an Action that faces none of these.
  const rolled = rolls ?? (d?.versions ?? []).some(v => !v.noTiers);
  if (!d || !rolled) return "";
  const has = k => d.traits?.has?.(k) ?? false;
  if (has("split") && !has("weapon") && !has("magic")) return "AD (Weapon mode) or WD (Power mode)";
  if (has("handle") && !has("strike")) return "DC 13";   // handling things (Reload, Interact): no Defense to roll against
  if (String(d.distance ?? "").toLowerCase() === "self" && !has("area")) return "DC 13";   // an Action on yourself that rolls (Rimebrand): no Defense either (Whirlwind's area rolls against each creature)
  if (src?.kind === "signature") return src.from === "power" ? "WD" : "AD";
  if (has("signature")) return "AD or WD";
  if (has("weapon") || fists || src?.kind === "weapon") return "AD";
  if (has("magic") || src?.kind === "power") return "WD";
  return "DC 13";
}

/** "Body Check", "Weapon Modifier", "Power Modifier" (+ " vs. Body" when there is a Defense). */

/** Where an Action reaches: Reach, Self, the weapon's range, or any text such as "10/20/40". */
export function distanceText(d, weapon = null) {
  const area = String(d?.area ?? "").trim();
  if (area) return `Area: ${area}`;   // an Action has an Area or a Distance, shown in the same place
  const v = String(d?.distance ?? "").trim();
  if (!v) return "";
  // A Weapon Action shows the Range of the weapon it is made with (Distance: Weapon, or Reach on older cards): melee with Reach above 1 added,
  // ranged, or both for a Thrown weapon.
  const low = v.toLowerCase(), sp = t => String(t).split("/").join(" / ");
  if (weapon?.system && (low === "weapon" || (d?.traits?.has?.("weapon") && low === "reach"))) {
    const r = weaponRanges(weapon, weapon.parent?.system?.reach ?? 1);
    const wants = d?.traits?.has?.("melee") ? "melee" : d?.traits?.has?.("ranged") ? "ranged" : "";
    if (wants === "melee" && r.melee) return sp(r.melee);
    if (wants === "ranged" && r.ranged) return `${sp(r.ranged)}${r.thrown ? " (thrown)" : ""}`;
    if (r.melee && r.ranged) return `${sp(r.melee)}, thrown ${sp(r.ranged)}`;
    if (r.melee || r.ranged) return sp(r.melee || r.ranged);
    if (weapon.system.range) return sp(weapon.system.range);   // a weapon with a Range but no Melee or Ranged property
  }
  if (low === "reach") return "Reach";
  if (low === "self") return "Self";
  if (low === "weapon") return "Weapon";
  return v;
}

/** Colors of the initiative groups. They follow the token disposition (Friendly PCs, Hostile NPCs, Neutral, Secret) and can be changed in the settings. */
export const GROUPS = [
  { disposition: 1, key: "friendly", label: "Friendly (PCs)", color: "#4caf50" },
  { disposition: -1, key: "hostile", label: "Hostile (NPCs)", color: "#d9534f" },
  { disposition: 0, key: "neutral", label: "Neutral (a third group)", color: "#e0b030" },
  { disposition: -2, key: "secret", label: "Secret (a fourth group)", color: "#9b6bd6" }
];
export function groupColor(combatant) {
  const d = combatant?.token?.disposition;
  const disp = d === undefined || d === null ? (combatant?.actor?.type === "character" ? 1 : -1) : d;
  const g = GROUPS.find(x => x.disposition === disp) ?? GROUPS[1];
  try { return game.settings.get("twod12", `group_${g.key}`) || g.color; } catch (e) { return g.color; }
}

/** A subtype code from a two-letter code ("Sl"), the generator's one-letter shorthand ("S") or a name ("slash"). */
export function subtypeCode(x) {
  const s = String(x ?? "").trim();
  if (!s) return "";
  const two = Object.keys(TWOD12.subtypes).find(k => k && k.toLowerCase() === s.toLowerCase());
  if (two) return two;
  if (s.length === 1) return TWOD12.subtypeLetters[s.toUpperCase()] ?? "";
  const byName = Object.entries(TWOD12.subtypes).find(([k, v]) => k && v.toLowerCase() === s.toLowerCase());
  return byName ? byName[0] : "";
}

/** The condition that makes all of a creature's Rolls Doomed ("Imperiled", "Squeezing", "Unconscious"), or "". */
export function doomStatus(actor) {
  const st = k => !!actor?.statuses?.has?.(k);
  return st("imperiled") ? "Imperiled" : st("squeezing") ? "Squeezing" : st("unconscious") ? "Unconscious" : "";
}

/** While Unconscious, Saves and Checks are Doomed, except the Body Check of a Dying creature and the Mind Check of a Shattered one. */
export function unconsciousDoom(actor, attrKey, kind = "Check") {
  if (actor?.statuses?.has?.("imperiled")) return true;   // Imperiled: all your Checks and Saves are Doomed
  if (actor?.statuses?.has?.("squeezing")) return true;   // Squeezing (v0.0.170): all your Rolls are Doomed
  if (!actor?.statuses?.has?.("unconscious")) return false;
  if (kind === "Check" && attrKey === "body" && actor.statuses.has("dying")) return false;
  if (kind === "Check" && attrKey === "mind" && actor.statuses.has("shattered")) return false;
  return true;
}

/* ------------------------------------------------------------------ Tags of a creature (a selection; the list is a world setting) */
export const tagSlug = s => String(s ?? "").trim().toLowerCase().replace(/\s+/g, "-");
/** An older creature stored its tags as text ("Undead, Beast"): the slugs of the names. */
export const migrateTags = v => [...new Set((Array.isArray(v) ? v : String(v ?? "").split(",")).map(tagSlug).filter(Boolean))];
/** The tags a creature can have, { slug: Label }, from the world setting (the starting list when it is not there). */
export function tagChoices() {
  let text = "";
  try { text = game.settings.get("twod12", "tagList"); } catch (e) { /* not registered */ }
  const names = String(text || TWOD12.defaultTags.join(", ")).split(",").map(x => x.trim()).filter(Boolean);
  return Object.fromEntries(names.map(n => [tagSlug(n), n]));
}
/** Does the creature have this tag? ("Unholy", case and spaces don't matter.) For abilities like "If the target has the Unholy tag...". */
export const hasTag = (actor, tag) => { const t = actor?.system?.tags; return !!t && (t.has ? t.has(tagSlug(tag)) : [...t].includes(tagSlug(tag))); };

/**
 * "As 1 AP", "As 2 AP, T3", "As Tier 2" at the start of a tier's text, written out: the text of the cell it points to (itself expanded),
 * then the rest ("As Tier 2, and the target is Vulnerable 1" -> "<Tier 2's text>, and the target is Vulnerable 1"). Chat cards and the roll dialog
 * show one Version, so a bare "As 1 AP." would point at a column they don't show. The sheet keeps the book's wording. Pure (the tests load it).
 */
export function expandAsText(text, versions, version, tier, depth = 0) {
  const t = String(text ?? "");
  const m = /^\s*As (?:(\d+)\s?AP(?:,\s?T(\d))?|Tier (\d))\b\s*[,.]?\s*(.*)$/is.exec(t);
  if (!m || depth > 4) return t;
  const ap = m[1] ? Number(m[1]) : version?.ap, n = m[3] ? Number(m[3]) : (m[2] ? Number(m[2]) : tier);
  const ref = (versions ?? []).find(v => v.ap === ap && (!version?.mode || !v.mode || v.mode === version.mode));
  if (!ref || (ref === version && n === tier)) return t;
  const target = expandAsText(ref[`x${n}`] ?? "", versions, ref, n, depth + 1).trim();
  if (!target || /^no effect\.?$/i.test(target)) return t;
  const rest = m[4].trim();
  if (!rest) return target;
  return `${target.replace(/[.\s]+$/, "")}, ${rest.replace(/^and\b/i, "and")}`;
}
