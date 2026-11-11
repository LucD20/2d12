// v0.0.323 PACK EFFECT-SHEET: the Details tab of the Effect window (and the Passive of a Feature or Talent), Lucas's "Prototype C"
// (foundry/mockups/effect-rules-mockups.html): the hover card preview, the rule list and the selected rule's pane, Ends, Automation, Advanced.
//   fxTabHtml(model): the HTML, pure (the tests render it).
//   wireFxTab(sheet, root): the events. Every change edits a copy of the rules and Ends, then saves them with what they compile to (fxrules.mjs compile)
//   and the built hover text, in one update (the item sheet, or the applied effect's editor, which writes it into the effect).
import { TWOD12 } from "./config.mjs";
import * as R from "./fxrules.mjs";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const get = (o, path) => String(path).split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const put = (o, path, v) => { const ks = String(path).split("."), last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ??= /^\d+$/.test(k) ? [] : {}), o); t[last] = v; };

/* ------------------------------------------------------------------ small controls */
// Every control names what it changes: data-f (a path in the rule, or "ends.…" / "@field" for the item), data-fr (the action).
const seg = (f, cur, opts, cls = "") => `<span class="fr-seg ${cls}">${opts.map(([v, l]) => `<button type="button" data-fr="set" data-f="${f}" data-v="${esc(v)}" class="${String(cur) === String(v) ? "on" : ""}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join("")}</span>`;
const step = (f, cur, min = 0, max = 5, cls = "", signed = false) => `<span class="fr-step ${cls}"><button type="button" data-fr="step" data-f="${f}" data-d="-1" data-min="${min}" data-max="${max}" aria-label="Less">−</button><span class="v">${signed && Number(cur) > 0 ? "+" : ""}${esc(cur)}</span><button type="button" data-fr="step" data-f="${f}" data-d="1" data-min="${min}" data-max="${max}" aria-label="More">+</button></span>`;
/** v0.0.324 (Lucas): the names a formula reads, always at hand (the ⓘ beside every formula field). */
export const FORMULA_HELP = "A number or a formula: + − × ÷, ( ), floor( ), ceil( ). @origin.NAME is the origin's value, @target.NAME the affected creature's. NAME: pow (Power Modifier), wpn (Weapon Modifier), sig (Signature Modifier), body, mind, appeal, instinct (Attributes), stage. Example: @origin.pow + 2, floor(@target.body / 2).";
/** v0.0.325 (Lucas: the ⓘ showed one short sentence: Foundry reads a tooltip as HTML, and "<name>" was taken for a tag): the list, one line each. */
export const FORMULA_TIP = ["<b>A number or a formula</b>", "+ − × ÷, ( ), floor( ), ceil( )", "<b>@origin.</b>… the origin's value", "<b>@target.</b>… the affected creature's value", "<b>pow</b> Power Modifier", "<b>wpn</b> Weapon Modifier", "<b>sig</b> Signature Modifier", "<b>body</b>, <b>mind</b>, <b>appeal</b>, <b>instinct</b> its Attributes", "<b>stage</b> its Stage", "Examples: @origin.pow + 2 · floor(@target.body / 2)"].join("<br>");
const fhelp = () => `<i class="fa-solid fa-circle-info fr-fi" data-tooltip="${esc(FORMULA_TIP)}" data-tooltip-direction="UP" aria-label="${esc(FORMULA_HELP)}" tabindex="0"></i>`;
/** A number or a formula, with − / + that change a plain number. */
const amount = (f, cur, min, max, ph = "1") => `<span class="fr-step fr-amt"><button type="button" data-fr="step" data-f="${f}" data-d="-1" data-min="${min}" data-max="${max}" aria-label="Less">−</button>${text(f, cur, ph, "amt")}<button type="button" data-fr="step" data-f="${f}" data-d="1" data-min="${min}" data-max="${max}" aria-label="More">+</button></span>${fhelp()}`;
const tog = (f, on, label) => `<span class="fr-tog${on ? " on" : ""}" data-fr="tog" data-f="${f}" role="switch" aria-checked="${!!on}" tabindex="0"><span class="box"></span>${label}</span>`;
const text = (f, v, ph = "", cls = "") => `<input type="text" class="fr-in ${cls}" data-fr-in="${f}" value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(ph || f)}">`;
const sel = (f, cur, opts, label = "") => `<select class="fr-sel" data-fr-in="${f}" aria-label="${esc(label || f)}">${opts.map(([v, l, dis]) => `<option value="${esc(v)}"${String(cur) === String(v) ? " selected" : ""}${dis ? " disabled" : ""}>${esc(l)}</option>`).join("")}</select>`;
const grid = rows => `<div class="fr-pgrid">${rows.filter(Boolean).map(([l, c]) => `<span class="fr-pl">${l}</span><div class="fr-pc">${c}</div>`).join("")}</div>`;
const help = t => `<p class="fr-help">${t}</p>`;
const part = (key, on, title, sum, body, path = `${key}.on`) => `<div class="fr-part${on ? "" : " off"}"><header>${tog(path, on, title)}<span class="fr-psum">${on ? esc(sum) : "off"}</span></header><div class="fr-pb">${body}</div></div>`;
const SUBS = () => Object.entries(TWOD12.subtypes ?? {}).map(([k, v]) => [k, k ? v : "None"]);
const DMG_SUBS = () => [...SUBS().slice(0, 1), ["W", "The weapon's"], ...SUBS().slice(1)];   // v0.0.345: Extra damage of the weapon's subtype (Marked Quarry)
const NAMES = [["", "n/a"], ["field", "Field"], ["pressure", "Pressure"], ["support", "Support"]];

/** The origin chip of a rule: "Origin: Ogre Chieftain [⌖ Change]" (Change only where there is a map and an applied effect). */
const originChip = (m, f = "origin", ownRef = "") => {
  const name = ownRef ? (m.names?.[ownRef] ?? m.originName) : m.originName;
  return `<span class="fr-origin">Origin: <b>${esc(name || "whoever applies it")}</b>${m.applied ? `<button type="button" data-fr="origin" data-f="${f}">⌖ Change</button>` : ""}</span>`;
};

/* ------------------------------------------------------------------ the Action filter */
function filterBox(m, f, flt, from = null) {
  const used = new Set([...flt.all, ...flt.any, ...flt.not]);
  const opts = R.filterGroups().map(g => `<optgroup label="${esc(g.label)}">${g.traits.filter(k => !used.has(k)).map(k => `<option value="${esc(k)}">${esc(R.traitLabel(k))}</option>`).join("")}</optgroup>`).join("");
  const clause = (key, label) => `<div class="fr-clause${key === "not" ? " not" : ""}"><span>${label}</span><div>${flt[key].map(k => `<span class="fr-chip g-${R.traitGroup(k)}">${esc(R.traitLabel(k))}<button type="button" data-fr="untrait" data-f="${f}.${key}" data-v="${esc(k)}" aria-label="Remove ${esc(R.traitLabel(k))}">×</button></span>`).join("")}
    <select class="fr-sel fr-tsel" data-fr-trait="${f}.${key}" aria-label="Add a trait to ${label}"><option value="">+ trait</option>${opts}</select></div></div>`;
  const fromRow = from ? `<div class="fr-clause"><span>Saves against</span><div>${from.map(k => `<span class="fr-chip g-${R.traitGroup(k)}">${esc(R.traitLabel(k))}<button type="button" data-fr="untrait" data-f="from" data-v="${esc(k)}" aria-label="Remove">×</button></span>`).join("")}
    <select class="fr-sel fr-tsel" data-fr-trait="from" aria-label="Saves against Actions with"><option value="">+ trait</option>${R.filterGroups().map(g => `<optgroup label="${esc(g.label)}">${g.traits.filter(k => !k.startsWith("__")).map(k => `<option value="${esc(k)}">${esc(R.traitLabel(k))}</option>`).join("")}</optgroup>`).join("")}</select></div></div>` : "";
  return `<div class="fr-filter"><div class="fr-reads">Actions: <b>${esc(R.filterText(flt) || "any Action")}</b></div>${clause("all", "Has all of")}${clause("any", "Has one of")}${clause("not", "But not")}${fromRow}
    ${help("A Save or a Check in the Roll group matches by roll kind (Chapter 1, Rolls): a Save matches Saves, a Check matches Checks. An Attribute matches that Attribute's Checks, Saves and Attribute Actions. Attack: an Action that rolls against another creature. Saves against: the traits of the Action that forces the Save.")}</div>`;
}

/* ------------------------------------------------------------------ drop zones */
function dropped(m, f, ref, fallbackName, label = "Drop an Effect or an Action here", small = "Effects from the Effects and Conditions compendiums, Actions from any card") {
  const info = m.items?.[ref] ?? null, name = info?.name || fallbackName || "";
  if (!ref && !name) return `<div class="fr-drop" data-fr-drop="${f}">${label}<br><small>${small}</small></div>`;
  const isA = (info?.type ?? (/^(category|trait):/.test(name) ? "action" : "")) === "action";
  return `<div class="fr-dropped${isA ? " is-a" : ""}" data-fr-drop="${f}"><span class="fr-dk">${isA ? "Action" : "Effect"}</span><b>${esc(name || "?")}</b>${isA && info?.cost ? `<span class="fr-cost">${esc(info.cost)}</span>` : ""}${isA && info?.freq ? ` <span class="fr-m">· ${esc(info.freq)}</span>` : ""}<button type="button" class="fr-x" data-fr="clr" data-f="${f}" aria-label="Remove">×</button>${isA && info?.line ? `<div class="fr-m2">${esc(info.line)}</div>` : ""}</div>`;
}

/* ------------------------------------------------------------------ the panes */
const VS = [["any", "any creature"], ["origin", "the origin"], ["marked", "the marked one"], ["notorigin", "anyone but the origin"]];
function actPane(r, m) {
  const fav = r.bb.boons - r.bb.banes >= 5 ? '<span class="fr-fav">Favored</span>' : r.bb.banes - r.bb.boons >= 5 ? '<span class="fr-doom">Doomed</span>' : "";
  const showFrom = r.from.length || r.filter.all.includes("__save");
  const rows = [
    ["On Rolls", seg("dir", r.dir, [["by", "made by them"], ["against", "made against them"]], "w")],
    ["With", filterBox(m, "filter", r.filter, showFrom ? r.from : null)],
    [r.dir === "by" ? "Against" : "Made by", seg("vs", r.vs, VS, "g")],
    ["Uses", seg("uses", r.uses, [["every", "Every time"], ["round", "First each round"], ["next", "Next one only"]], "w")],
    ["Only", tog("sees", r.sees, "While they see the origin")],
    (r.vs === "origin" || r.vs === "notorigin" || r.sees) ? ["Origin", originChip(m, "origin", r.origin)] : null
  ];
  if (r.attrs.length) rows.push(["Also", `<span class="fr-m">only ${esc(r.attrs.map(a => TWOD12.attributes[a]).join(" or "))} Rolls (kept from the old setting)</span>`]);
  let parts = part("bb", r.bb.on, "Boons and Banes", R.partSummary(r, "bb"), grid([["Boons", step("bb.boons", r.bb.boons, 0, 5, "boon") + fav], ["Banes", step("bb.banes", r.bb.banes, 0, 5, "bane")], ["Named", seg("bb.name", r.bb.name, NAMES, "w")],
    (m.valuedHost || r.bb.byValue) ? ["Value", tog("bb.byValue", r.bb.byValue, "Times the condition's value")] : null]) + help("Five or more Boons or Banes left after the limits and cancelling make the Roll Favored or Doomed (Chapter 1). A name (Field, Pressure, Support) caps that name at 2."));
  if (r.dir === "by") {
    parts += part("emp", r.emp.on, "Empowered and Enfeebled", R.partSummary(r, "emp"), grid([["Counts as", seg("emp.mode", r.emp.mode, [["set", "Set to"], ["inc", "Increase by"]], "w")], ["Empowered", step("emp.emp", r.emp.emp, 0, 5, "boon")], ["Enfeebled", step("emp.enf", r.emp.enf, 0, 5, "bane")]])
      + help("Set to: the highest of each counts (Stacking). Increase by: adds to the value they have for those Rolls (Vow of Enmity)."));
  }
  // v0.0.343: extra damage on Rolls made against them too (Open Season: the allies' [Strike] Actions against the Quarry)
  parts += part("dmg", r.dmg.on, "Extra damage", R.partSummary(r, "dmg"), r.dmg.list.map((d, i) => `<div class="fr-dent">${grid([
      ["Damage", `${text(`dmg.list.${i}.dice`, d.dice, "1d6", "dice")}${fhelp()}${seg(`dmg.list.${i}.pool`, d.pool, [["B", "[V]"], ["M", "[R]"]])}${sel(`dmg.list.${i}.sub`, d.sub, DMG_SUBS(), "Subtype")}`],
      ["On", [1, 2, 3].map(t => `<span class="fr-tog${d.tiers.includes(t) ? " on" : ""}" data-fr="tier" data-f="dmg.list.${i}.tiers" data-v="${t}" role="switch" aria-checked="${d.tiers.includes(t)}" tabindex="0"><span class="box"></span>T${t}</span>`).join("")],
      ["Then", `${dropped(m, `dmg.list.${i}.fx`, d.fx, d.fxName, "Drop an Effect the target gains (optional)", "from the Effects and Conditions compendiums")}${d.text ? `<span class="fr-m">The card adds: ${esc(d.text)}</span>` : ""}${r.dmg.list.length > 1 ? `<button type="button" class="fr-rm" data-fr="splice" data-f="dmg.list" data-i="${i}">Remove this damage</button>` : ""}`]
    ])}</div>`).join("") + `<button type="button" class="fr-addd" data-fr="push" data-f="dmg.list">+ Another damage</button>` + help("A number, dice or a formula (<code>@origin.pow</code>, <code>[Mod]</code> the Action's Modifier)."));
  if (r.dir === "by") {
    parts += part("ign", r.ign.on, "Ignores", R.partSummary(r, "ign"), grid([["Cover", ["low", "medium", "high"].map(k => tog(`ign.${k}`, r.ign[k], k[0].toUpperCase() + k.slice(1))).join("")],
      ["Range Banes", seg("ign.range", r.ign.range, [["none", "None"], ["one", "One"], ["all", "All"]], "w")], ["Also", tog("ign.engaged", r.ign.engaged, "The Engaged Bane") + tog("ign.engagedTarget", r.ign.engagedTarget, "Target Engaged with another")]]));
  }
  parts += part("note", r.note.on, "Shows a note", R.partSummary(r, "note"), grid([["Title", text("note.title", r.note.title, "Title", "wide")], ["Text", `<textarea class="fr-ta" data-fr-in="note.text" placeholder="Shown in the roll dialog of matching Rolls" aria-label="Note text">${esc(r.note.text)}</textarea>`]]));
  return `<div class="fr-addsh first">Which Rolls</div>${grid(rows)}<div class="fr-addsh">What it adds</div>${parts}`;
}

const DEF = () => [["all", "every Defense"], ["armor", "Armor (AD)"], ["ward", "Ward (WD)"], ["body", "Vs. Body"], ["mind", "Vs. Mind"], ["appeal", "Vs. Appeal"], ["instinct", "Vs. Instinct"]];
function valuePane(r, m) {
  const rows = [["Changes", seg("stat", r.stat, [["defense", "Defense"], ["speed", "Speed"], ["rally", "Rally Points"], ["resist", "Resist / Weak"]], "g")]];
  if (r.stat === "defense") rows.push(["Amount", `${amount("val", r.val, -4, 4)} ${sel("which", r.which, DEF(), "Which Defense")}`]);
  else if (r.stat === "speed") rows.push(["Amount", `${amount("val", r.val, -6, 6, "2")} ${sel("stype", r.stype, [["all", "every Speed"], ["walk", "Walk"], ["fly", "Fly (later)", true], ["climb", "Climb (later)", true], ["swim", "Swim (later)", true]], "Which Speed")}`]);
  else if (r.stat === "rally") rows.push(["Each heals", `${text("rally", r.rally, "@origin.pow + 2", "wide")} <span class="fr-m">more</span>${fhelp()}`], r.rallyRange ? ["Allies", `<span class="fr-m">and its allies within ${r.rallyRange} squares (kept from the old setting; an Aura carrying this effect is the new way)</span>`] : null);
  else rows.push(["Has", `${seg("rw", r.rw, [["resist", "Resist"], ["weak", "Weak"], ["immune", "Immune"]])}${r.rw !== "immune" ? amount("rwVal", r.rwVal, 1, 20) : ""} ${sel("rwSub", r.rwSub, SUBS().map(([k, v]) => [k, k ? v : "Choose a type"]), "Damage type")}`]);
  if (["defense", "speed"].includes(r.stat)) {
    rows.push(["Counts as", seg("mode", r.mode, r.stat === "speed" ? [["bonus", "A bonus"], ["inc", "An increase"], ["set", "Set to"]] : [["bonus", "A bonus"], ["inc", "An increase"]], "w")]);   // a Defense has no "Set to" yet
    if (r.mode === "bonus") rows.push(["Named", seg("name", r.name, NAMES, "w")]);
  }
  // (a Defense "against the origin / the marked one" needs the attacker in defense.mjs: not offered yet, PACK EFFECT-SHEET report)
  if (["defense", "speed"].includes(r.stat)) rows.push(["Only", tog("sees", r.sees, "While they see the origin")]);
  if (r.sees) rows.push(["Origin", originChip(m, "origin", r.origin)]);
  const h = r.stat === "rally" ? "<code>@origin.pow</code> is the origin's Power Modifier, <code>@target.pow</code> the affected creature's (also wpn, sig, body, mind, appeal, instinct, stage). For allies around it, put this effect on an Aura."
    : r.stat === "resist" ? "Chapter 1: once per Action or effect, on all its damage of that type, both pools together; the highest of each counts."
      : r.mode === "bonus" ? "Named bonuses work as named Boons and Banes: different names add, the same name keeps the highest, an unnamed one never adds to another." : r.mode === "inc" ? "An increase adds to everything else." : "Set to replaces the value.";
  return grid(rows) + help(h);
}

const WHEN_FX = [["lasts", "While this effect lasts"], ["turn", "Start of each of its turns"], ["enc", "Start of each encounter"], ["damage", "When it deals damage"]];
const WHEN_A = [["lasts", "While this effect lasts"], ["turn", "Start of each of its turns"], ["enc", "Start of each encounter"], ["markDown", "When its mark goes Down"]];
function grantPane(r, m) {
  const info = m.items?.[r.item] ?? null, name = info?.name || r.itemName;
  let rows = [];
  const head = dropped(m, "item", r.item, r.itemName);
  if (!name) return `${head}${r.msg.on ? grid([["Message", `${tog("msg.on", r.msg.on, "Post to chat")} ${seg("msg.to", r.msg.to, [["owners", "Owners and GM"], ["all", "Everyone"]])}`], ["", text("msg.text", r.msg.text, "What the message says", "wide")]]) : ""}`;
  const isA = r.itemType === "action";
  if (!isA) {
    if (r.valued || info?.valued) rows.push(["Value", `${step("val", r.val, 1, 20)}${r.when === "lasts" ? ` ${sel("valMode", r.valMode, [["set", "The highest counts"], ["increase", "Raise the value"], ["halfLevel", "Half its level"]], "If it has it already")}` : ""}`]);
    if (info?.src || r.src) rows.push([`${esc(name)} ${esc(info?.src || r.src)}`, originChip(m, "origin", r.origin)]);
  }
  rows.push(["When", seg("when", r.when, isA ? WHEN_A : WHEN_FX, "g")]);
  if (isA) {
    if (r.when === "lasts") rows.push(["Gives", seg("amode", r.amode, [["has", "The Action"], ["uses", "Uses of it"]], "w")]);
    if (r.amode === "uses" || r.when !== "lasts") {
      rows.push(["Uses", `${step("uses", r.uses, 1, 9)} <span class="fr-m">uses for</span> ${step("ap", r.ap, 0, 4)} <span class="fr-m">AP</span>`]);
      if (r.when === "lasts") {
        rows.push(["Roll", `${step("bbn", r.bbn, 0, 5, r.bbk === "boons" ? "boon" : "bane")} ${seg("bbk", r.bbk, [["boons", "Boons"], ["banes", "Banes"]])}`]);
        rows.push(["Against", seg("distinct", String(r.distinct), [["false", "any creature"], ["true", "a different one each time"]], "w")]);
      }
    }
  } else if (r.when === "damage") {
    rows.push(["Damage", seg("pool", r.pool, [["any", "any"], ["B", "[V]"], ["M", "[R]"]], "w")]);
    rows.push(["Type", sel("sub", r.sub, SUBS().map(([k, v]) => [k, k ? v : "any type"]), "Damage type")]);
    rows.push(["Tag", text("tag", r.tag, "any creature (or a Tag: Profane)", "wide")]);
  }
  let riders = "";
  if (isA && r.amode === "uses" && r.when === "lasts") {
    riders = `<div class="fr-addsh">On its tiers</div><div class="fr-riders">${r.riders.map((rd, i) => `<div class="fr-dent">${grid([
      ["On", [1, 2, 3].map(t => `<span class="fr-tog${rd.tiers.includes(t) ? " on" : ""}" data-fr="tier" data-f="riders.${i}.tiers" data-v="${t}" role="switch" aria-checked="${rd.tiers.includes(t)}" tabindex="0"><span class="box"></span>T${t}</span>`).join("") + tog(`riders.${i}.crit`, rd.crit, "Critical")],
      ["Then", `${seg(`riders.${i}.does`, rd.does, [["half", "Next damage halved"], ["text", "A text"]])}${rd.does === "text" ? text(`riders.${i}.text`, rd.text, "What happens", "wide") : ""}<button type="button" class="fr-rm" data-fr="splice" data-f="riders" data-i="${i}">Remove</button>`]
    ])}</div>`).join("")}${r.riders.length < 2 ? `<button type="button" class="fr-addd" data-fr="push" data-f="riders">+ On a tier</button>` : ""}</div>`;
  }
  let msg = "";
  if (r.when !== "lasts") msg = grid([["Message", `${tog("msg.on", r.msg.on, "Post to chat")}${r.msg.on ? ` ${seg("msg.to", r.msg.to, [["owners", "Owners and GM"], ["all", "Everyone"]])}` : ""}`], r.msg.on ? ["", text("msg.text", r.msg.text, isA ? "What the message says (the Action comes as a button)" : "What the message says", "wide")] : null]);
  const note = isA ? (r.amode === "has" && r.when === "lasts" ? "The creature has the Action (the sheet's Granted section) while this effect lasts." : "Granted uses don't count toward the Action's Frequency or the 3 Strikes; 0 AP is free.")
    : r.when === "lasts" ? "This creature has it; it ends with this effect." : r.when === "damage" ? "The damaged creature gains it, with its own duration." : "This creature gains it each time, with its own duration.";
  return head + grid(rows) + riders + msg + help(note);
}

const PROPS = () => Object.entries(TWOD12.removableProps ?? {});
function weapPane(r) {
  const rows = [["Changes", seg("mode", r.mode, [["prop", "A property"], ["mastery", "Starting Mastery"]], "w")]];
  if (r.mode === "prop") rows.push(["Weapon", sel("weapon", r.weapon, [["fists", "Fists"], ["all", "All its weapons"]], "Weapon")], ["Property", `<span class="fr-m">Loses</span> ${sel("prop", r.prop, PROPS(), "Property")}`]);
  else rows.push(["Weapon", `<span class="fr-m">the player chooses one with</span> ${sel("mprop", r.mprop, Object.entries(TWOD12.weaponTraits ?? {}), "Property")}`], ["Starts at", `${step("mval", r.mval, 0, 15)} <span class="fr-m">Mastery</span>`]);
  return grid(rows) + help(r.mode === "prop" ? "Only the properties listed can be taken away for now (Brawler: Non-threatening)." : "Asked once, on the Mastery tab; the choice is kept.");
}
function escPane(r) {
  const opts = Object.entries(TWOD12.escHookWhen ?? {});
  return grid([["When", sel("trig", r.trig, opts, "Trigger")], (TWOD12.escHookWhen?.[r.trig] ?? "").includes(" N ") ? ["Within", `${step("n", r.n, 0, 12)} <span class="fr-m">squares</span>`] : null]) + help("Once an encounter, +1 Escalation (the class hook in Chapter 2).");
}
const usesPane = r => grid([["Gives", seg("which", r.which, [["round", "Round Specials twice"], ["encounter", "Encounter Specials again"]], "w")]]) + help("The Elite ladder (Bestiary, Elite Escalation). Special Actions are the creature's own, not the Basic Actions.");
const ASW = [["Gold", "#e8a33a"], ["Holy", "#ffd27a"], ["Ally", "#4a8fd8"], ["Enemy", "#c0392b"], ["Arcane", "#9b6bd8"], ["Nature", "#4caf6a"]];
const colorRow = (f, v, sw) => `<span class="fr-colors"><input type="color" data-fr-in="${f}" value="${esc(/^#[0-9a-f]{6}$/i.test(v) ? v : "#e8a33a")}" aria-label="Color">${sw.map(([n, c]) => `<button type="button" class="fr-sw${v === c ? " on" : ""}" style="--c:${c}" data-fr="set" data-f="${f}" data-v="${c}" title="${n}">${n}</button>`).join("")}</span>`;
/* v0.0.327 (PACK ZONE): what an area does inside, the Aura's and the Zone's one block (foundry/mockups/zone-prototype.html): four part rows, each with
   its own Who (Allies / Enemies / Everyone) and "And the origin" (on an Aura: "And this creature itself"). p: the path of the block ("inside", "zone.inside"). */
const WHO_OPTS = [["allies", "Allies"], ["enemies", "Enemies"], ["all", "Everyone"]];
function insideHtml(p, inIn, m, selfLabel, head = true) {
  const x = R.normInside(inIn), names = m.names ?? {}, sm = k => R.insideSummary(x, k, { names });
  const who = k => [["Who", seg(`${p}.${k}.who`, x[k].who, WHO_OPTS, "w")], ["", tog(`${p}.${k}.self`, x[k].self, selfLabel)]];
  const ht = x.ht;
  const rows = [
    part(`${p}.carry`, x.carry.on, "Carries an Effect", sm("carry"), grid(who("carry")) + dropped(m, `${p}.carry.fx`, x.carry.fx, x.carry.fxName, "Drop the Effect they have while inside", "from the Effects and Conditions compendiums")
      + help("Gained on entering, lost on leaving or when the area ends. While carried, its own Ends are not used: to give something that lasts after leaving, use Hazard → Gives an Effect.")),
    part(`${p}.heal`, x.heal.on, "Heals", sm("heal"), grid([...who("heal"), ["Heal", `${text(`${p}.heal.formula`, x.heal.formula, "1d4", "dice")}${fhelp()} <span class="fr-m">at the start of each of their turns inside</span>`]])
      + help("A heal, as Heal in Chapter 4 (they choose which damage), rolled for each creature at the start of its own turn. Formulas work: 1d4 + @origin.pow.")),
    part(`${p}.ht`, ht.on, "Hazard [HT]", sm("ht"), grid([...who("ht"), ["Triggers", ["entering", "turn", "movement"].map(k => tog(`${p}.ht.${k}`, ht[k], k[0].toUpperCase() + k.slice(1))).join("")],
      ...ht.list.map((d, i) => [i ? "" : "Damage", `${text(`${p}.ht.list.${i}.dice`, d.dice, "1d6", "dice")}${seg(`${p}.ht.list.${i}.pool`, d.pool, [["B", "[V]"], ["M", "[R]"]])}${sel(`${p}.ht.list.${i}.sub`, d.sub, SUBS(), "Subtype")}${ht.list.length > 1 ? `<button type="button" class="fr-rm" data-fr="splice" data-f="${p}.ht.list" data-i="${i}">Remove</button>` : ""}`]),
      ["", `<button type="button" class="fr-addd" data-fr="push" data-f="${p}.ht.list">+ Another damage</button>`], ["Also", tog(`${p}.ht.gives.on`, ht.gives.on, "Gives an Effect")]])
      + (ht.gives.on ? dropped(m, `${p}.ht.gives.fx`, ht.gives.fx, ht.gives.fxName, "Drop the Effect a creature it affects gains (with its own Ends)", "from the Effects and Conditions compendiums") : "")
      + help("Entering: enters the area (a creature inside when it appears counts). Turn: ends its turn there. Entering and Turn share one hit per turn-cycle; Movement hits once per Movement. None ticked: Entering and Turn (Chapter 3).")),
    part(`${p}.diff`, x.diff.on, "Difficult Terrain", sm("diff"), grid(who("diff")) + help("Its squares count double for movement, for the creatures it affects (a persistent effect can hinder one side only). Forced Movement ignores it."))
  ];
  return `${head ? `<div class="fr-addsh">What it does inside</div>` : `<div class="fr-addsh first"></div>`}${rows.join("")}`;
}
/** The "Shown on the map" row (the Aura's and the Zone's). p: "" (a rule) or "zone.". */
const mapRow = (p, o, n) => part(`${p}show`, o.show, "Shown on the map", "outline and squares", grid([["Outline", colorRow(`${p}outline`, o.outline, ASW)], ["Squares", colorRow(`${p}fill`, o.fill, ASW)]])
  + `<div class="fr-aurapv" style="--o:${esc(o.outline || "#e8a33a")};--f:${esc(o.fill || "#e8a33a")};--n:${Math.min(4, Math.max(1, Number(n) || 2))}"><span class="tok">Y</span></div>`
  + help("Off: the area still works, it isn't drawn."), `${p}show`);
function auraPane(r, m) {
  return grid([["Size", `<span class="fr-m">Aura</span> ${text("size", r.size, "2 or @origin.pow", "dice")} <span class="fr-m">squares</span>${fhelp()}`]])
    + help("Counted from every square it occupies (Chapter 3, Aura). Allies and enemies are judged from this creature's side; a neutral creature counts as an enemy.")
    + insideHtml("inside", r.inside, m, "And this creature itself")
    + `<div class="fr-addsh">On the map</div>${mapRow("", r, r.size)}`;
}
const SWL = [["Torch", "#ff9b3d"], ["Holy", "#ffd27a"], ["Moon", "#b8c8ff"], ["Fire", "#ff5a1f"], ["Arcane", "#b07cff"], ["Fey", "#7dffb0"]];
function lightPane(r, m) {
  const anims = m.lightAnims ?? [["", "None"]];
  return grid([["Bright", `${step("bright", r.bright, 0, 12)} <span class="fr-m">squares</span>`], ["Dim", `${step("dim", r.dim, 0, 12)} <span class="fr-m">squares beyond the Bright light</span>`], ["Color", colorRow("color", r.color, SWL)],
    ["Intensity", `<input type="range" min="0" max="1" step="0.05" data-fr-in="alpha" value="${r.alpha}" aria-label="Intensity"> <span class="fr-m">${r.alpha}</span>`],
    ["Animation", `${sel("anim", r.anim, anims, "Animation")}${r.anim ? ` <span class="fr-m">speed</span>${step("aspeed", r.aspeed, 1, 10)}<span class="fr-m">strength</span>${step("aint", r.aint, 1, 10)}` : ""}`]])
    + help("The Bright and Dim light follow the book's Light rules (Obscured, the Hide penalty); color and animation are only the look.");   // v0.0.324: no preview (Lucas)
}
// v0.0.345 (Lucas, playtest 4: Frightened's "moving closer is Difficult Terrain"): the limit is either a refusal or Difficult Terrain
const movePane = (r, m) => grid([["Moving", seg("dirm", r.dirm, [["closer", "closer to"], ["away", "away from"]], "w")], ["the origin", seg("how", r.how, [["difficult", "is Difficult Terrain"], ["cant", "is not allowed"]], "w")], ["Only", tog("sees", r.sees, "While they see the origin")], ["Origin", originChip(m, "origin", r.origin)]])
  + help(r.how === "difficult" ? "Each square that brings them closer to (or farther from) the origin costs double (Difficult Terrain: no Evade there); Forced Movement ignores it (Frightened, Chapter 8)." : "It blocks a willing Move that ends nearer to (or farther from) the origin than it started; Forced Movement is not willing.");
function legacyPane(r, m) {
  if (r.kind === "zone") {
    const z = r.setting ?? {};
    return grid([["Affects", sel("setting.zoneWho", z.zoneWho || "allies", [["allies", "Allies"], ["enemies", "Enemies"], ["all", "Everyone"]], "Who")], ["Heals", text("setting.zoneHeal", z.zoneHeal ?? "", "at the start of their turns (optional)", "wide")],
      ["Carry", dropped(m, "setting.fxUuid", z.fxUuid, "", "Drop the Effect they carry while inside (optional)", "from the Effects and Conditions compendiums")]]) + help("The Zone keeps its old layout until its own design pass: the Action's Area, kept on the map, holds it.");
  }
  if (r.kind === "bleed") {
    const b = r.setting ?? {};
    return grid([["Damage", `${text("setting.dmg", b.dmg ?? "1", "1d6", "dice")}${sel("setting.dmgPool", b.dmgPool ?? "", [["", "by the Attributes"], ["B", "[V]"], ["M", "[R]"]], "Pool")}${sel("setting.dmgSub", b.dmgSub ?? "", SUBS(), "Subtype")}`], ["DC", step("setting.bleedDc", b.bleedDc ?? 13, 5, 30)]])
      + help("Bleed (Chapter 8) keeps its own setting: a damage card at the end of each of the creature's turns; Interact and a Save end it. A card's chip can set its own values.");
  }
  if (r.kind === "builtin") return help(r.which === "noReactions" ? "Staggered's own rule: the creature can't use Reactions (its Reaction AP waits)." : "Dazed's own rule: its value in AP is lost now, the rest from its next turn's AP; then it ends.") + `<p class="fr-m">This condition's own rule.</p>`;
  return `<p class="fr-m">An older setting (${esc(r.setting?.type ?? "?")}) kept as it was; it still works. Edit it in the JSON tab, or remove it.</p>`;
}
const PANES = { act: actPane, value: valuePane, grant: grantPane, weap: weapPane, esc: escPane, uses: usesPane, aura: auraPane, light: lightPane, move: movePane, zone: legacyPane, bleed: legacyPane, builtin: legacyPane, raw: legacyPane };

/* ------------------------------------------------------------------ Ends */
const ATTR_OPTS = [["body", "Body"], ["mind", "Mind"], ["appeal", "Appeal"], ["instinct", "Instinct"], ["bodyinstinct", "Better of Body / Instinct"], ["mindappeal", "Better of Mind / Appeal"]];
function endsHtml(e, m) {
  if (m.zoneMode) return zoneEndsHtml(e, m);
  const sm = R.endsSummaries(e, m), p = (k, on, title, body) => `<div class="fr-part${on ? "" : " off"}"><header>${tog(`ends.${k}.on`, on, title)}<span class="fr-psum">${esc(sm[k])}</span></header><div class="fr-pb">${body}</div></div>`;
  return `<div class="fr-endlist">
    ${p("time", e.time.on, "Time", grid([["Lasts", seg("ends.time.mode", e.time.mode, [["eot", "EoT"], ["rounds", "Rounds"], ["encounter", "This encounter"]], "w")], e.time.mode === "rounds" ? ["Rounds", step("ends.time.rounds", e.time.rounds, 1, 20)] : null]) + help("Rounds count down at the end of the origin's turn. EoT ends at the end of the affected creature's turn."))}
    ${p("save", e.save.on, "A Save", grid([["Save", sel("ends.save.attr", e.save.attr, ATTR_OPTS, "Save")], ["DC", `${seg("ends.save.dc", e.save.dc, [["13", "13"], ["origin", "The origin's"], ["set", "Set"]], "w")}${e.save.dc === "set" ? step("ends.save.dcValue", e.save.dcValue, 5, 30) : ""}`],
      ["Rolled", seg("ends.save.when", e.save.when, [["eot", "End of their turn"], ["interact", "With Interact (1 AP)"]], "w")], ["Tier 2", seg("ends.save.t2", e.save.t2, [["none", "Nothing"], ["eot", "Ends at EoT"], ["ends", "Ends"]], "w")]]) + help("Tier 1: nothing. Tier 3: it ends."))}
    ${p("down", e.down.on, "Origin goes Down", grid([["Origin", originChip(m, "@origin")]]) + help("Unconscious or leaving the scene count too."))}
    ${p("action", e.action.on, "They use an Action", filterBox(m, "ends.action.filter", e.action.filter))}
  </div>`;
}

/** v0.0.327 (PACK ZONE): a Zone's Ends: Time (Rounds or This encounter: no EoT), A Save and They use an Action greyed (no bearer), Origin goes Down,
 *  Someone uses an Action (the origin, or anyone within Reach of it; an Interact for its AP). */
function zoneEndsHtml(e, m) {
  const o = m.originName || "the origin", p = (k, on, title, sum, body) => `<div class="fr-part${on ? "" : " off"}"><header>${tog(`ends.${k}.on`, on, title)}<span class="fr-psum">${on ? esc(sum) : "off"}</span></header><div class="fr-pb">${body}</div></div>`;
  const dis = (title, why) => `<div class="fr-part off dis"><header><span class="fr-tog" aria-disabled="true"><span class="box"></span>${title}</span><span class="fr-psum">${why}</span></header></div>`;
  const tm = e.time.mode === "eot" ? "rounds" : e.time.mode;
  return `<div class="fr-endlist">
    ${p("time", e.time.on, "Time", tm === "encounter" ? "This encounter" : `${e.time.rounds} round${e.time.rounds === 1 ? "" : "s"}`, grid([["Lasts", seg("ends.time.mode", tm, [["rounds", "Rounds"], ["encounter", "This encounter"]], "w")], tm === "rounds" ? ["Rounds", step("ends.time.rounds", e.time.rounds, 1, 20)] : null]) + help("Counts down at the end of the slot in which it was placed (Chapter 2). No EoT: a placed area has no turn of its own. An Action that sets its own rounds (its Version) keeps them."))}
    ${dis("A Save", "not for a Zone")}
    ${p("down", e.down.on, "Origin goes Down", o, grid([["Origin", originChip(m, "@origin")]]) + help("Unconscious or leaving the scene count too."))}
    ${dis("They use an Action", "not for a Zone")}
    ${p("someone", e.someone.on, "Someone uses an Action", `${e.someone.who === "origin" ? o : "anyone in Reach"} · ${e.someone.ap} AP`, grid([["Who", seg("ends.someone.who", e.someone.who, [["origin", "The origin"], ["reach", "Anyone within Reach of it"]], "w")], ["Cost", `${step("ends.someone.ap", e.someone.ap, 0, 3)} <span class="fr-m">AP, an Interact</span>`]]) + help("Dismissing it (the origin) or putting it out (stamping on embers, anyone in Reach): the Zone's card in the chat has the button."))}
  </div>${help("A Save has no bearer to roll it: the rows stay greyed so the list keeps the same rows as on a creature.")}`;
}
/** v0.0.327 (PACK ZONE): the Zone layout (Where it is: On the map): The area, What it does inside, On the map. m.zoneAction: the Action that places it. */
function zoneHtml(zIn, m) {
  const z = R.normZone(zIn), a = m.zoneAction;
  let area = `<div class="fr-sub">Shape and size</div>${seg("zone.src", z.src, [["action", "From the Action"], ["here", "Set here"]], "w")}`;
  // v0.0.329 (Lucas: "effects can't be placed on the map"): Place on the map with either choice; no Action found: the shape set here is used
  const place = m.canPlace ? `<button type="button" class="fr-place" data-fr="placeZone"><i class="fa-solid fa-vector-square"></i> Place on the map</button>` : "";
  if (z.src === "action" && a) {
    area += `<div class="fr-dropped is-a"><span class="fr-dk">Action</span><b>${esc(a.name)}</b>${a.cost ? `<span class="fr-cost">${esc(a.cost)}</span>` : ""}${a.freq ? ` <span class="fr-m">· ${esc(a.freq)}</span>` : ""}<div class="fr-m2">Area: ${esc(a.area || "?")} · Distance: ${esc(String(a.dist || "?").replace(/\.$/, ""))}${a.more ? ` · and ${a.more} more Action${a.more === 1 ? "" : "s"}` : ""}. Its Place Area button keeps the area on the map.</div></div>` + place;
    area += help("The card's Area line is the only place the shape is written: change the card, and every Zone it places changes with it. Every area spreads from its Point of Origin (Chapter 3, Areas).");
  } else {
    const pv = R.previewCells(z.shape, z.size), N = pv.N;
    if (z.src === "action") area += `<p class="fr-m">No Action applies this effect yet, so its area is the one below. Put it in an Action's effects for the Action's own area.</p>`;
    area += grid([["Shape", seg("zone.shape", z.shape, [["emanation", "Emanation"], ["burst", "Burst"], ["line", "Line"]], "w")], ["Size", `${text("zone.size", z.size, "2 or @origin.pow", "dice")} <span class="fr-m">${z.shape === "line" ? "squares long" : "squares"}</span>${fhelp()}`]])
      + `<div class="fr-zpv" style="--o:${esc(z.outline || "#e8a33a")};--f:${esc(z.fill || "#e8a33a")};grid-template-columns:repeat(${N},12px)">${Array.from({ length: N * N }, (_, i) => `<i class="${pv.cells.has(`${i % N},${Math.floor(i / N)}`) ? "in" : ""}${i === Math.floor(N * N / 2) ? " c" : ""}"></i>`).join("")}</div>`
      + place
      + help("Placed by hand (a GM's trap): press Place on the map, or drag the Effect onto the map, and draw it where you want. An Emanation stays where it is placed; for an area that follows a creature, use an Aura rule instead.");
  }
  return `<section class="fr-sec"><h3>The area</h3>${area}</section>
    <section class="fr-sec"><h3>What it does inside <small>shared with the Aura</small></h3>${insideHtml("zone.inside", z.inside, m, `And the origin${m.originName ? ` (${esc(m.originName)})` : ""}`, false)}</section>
    <section class="fr-sec"><h3>On the map</h3>${mapRow("zone.", z, z.size)}</section>`;
}

/* ------------------------------------------------------------------ the tab */
/**
 * m: { host ("effect" | "feature" | "talent"), name, rules, ends, sel (a rule id), names { ref: name }, items { ref: { name, type, valued, src, cost, freq, line } },
 *   originName, bearerName, applied (null, or { spent: [ids] }), hover (the "Write it yourself" text), own (its field open), help (the ? on),
 *   auto { rank, note, ranks: [[key, label]] }, adv { isCondition, valued, selfApplied, originFromUser }, lightAnims, valuedHost, editable }
 */
export function fxTabHtml(m) {
  const host = m.host || "effect", rules = (m.rules ?? []).map(R.normRule), ends = R.normEnds(m.ends);
  const ctx = { originName: m.originName || (m.applied ? "" : "its origin"), names: { ...(m.names ?? {}), ...Object.fromEntries(Object.entries(m.items ?? {}).map(([k, v]) => [k, v.name])) }, host };
  const selR = rules.find(r => r.id === m.sel) ?? rules[0] ?? null, spent = new Set(m.applied?.spent ?? []);
  const onMap = host === "effect" && m.where === "map";   // v0.0.327 (PACK ZONE)
  const built = onMap ? `${R.plainText(R.zoneSentence(m.zone, { ...ctx, action: m.zoneAction }))} ${R.zoneEndsSentence(ends, ctx)}`
    : host === "effect" ? R.hoverCardText(rules, ends, ctx) : R.hoverCardText(rules, {}, ctx).replace(/\s*Lasts until removed\.$/, "");
  const own = String(m.hover ?? "").trim();
  const tip = `<div class="fr-tip" aria-live="polite"><b>${esc(m.name || "Effect")}</b> ${esc(own || built || "Does nothing yet.")}</div>
    <p class="fr-own">This is what players see on hover. <a data-fr="own" role="button" tabindex="0">${own ? "Your own text (empty it to go back)" : "Write it yourself"}</a>${m.own || own ? text("@hover", own, "Leave empty to keep the text built from the rules", "wide fr-ownin") : ""}</p>`;
  const list = rules.map(r => {
    const k = R.RULE_KINDS[r.kind];
    return `<div class="fr-it${selR?.id === r.id ? " on" : ""}${spent.has(r.id) ? " spent" : ""}" data-fr="sel" data-rid="${esc(r.id)}" role="button" tabindex="0"><span class="fr-kind k-${k.cls}">${k.tile}</span><span class="fr-itxt">${esc(R.ruleLabel(r, ctx))}${spent.has(r.id) ? ' <em class="fr-spent">spent</em>' : ""}${host !== "effect" && r.minEsc ? ` <em class="fr-m">(Escalation ${r.minEsc}+)</em>` : ""}</span><button type="button" class="fr-trash" data-fr="del" data-rid="${esc(r.id)}" aria-label="Remove this rule" title="Remove"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.7 9.5h5.6l.7-9.5M7 6.5v5M9 6.5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  }).join("");
  const add = `<select class="fr-sel fr-addsel" data-fr-add aria-label="Add a rule"><option value="">+ Add rule</option>${R.ADD_MENU.map(([g, ks]) => `<optgroup label="${esc(g)}">${ks.map(k => `<option value="${k}">${esc(R.RULE_KINDS[k].title)}</option>`).join("")}</optgroup>`).join("")}</select>`;
  let pane = `<p class="fr-m">Add a rule, or drop an Effect or an Action here.</p>`;
  if (selR) {
    const works = host !== "effect" ? `<div class="fr-works">${grid([["Works", seg("minEsc", selR.minEsc, [[0, "Always"], [1, "Escalation 1+"], [2, "2+"], [3, "3+"]], "g")]])}</div>` : "";
    pane = `<h4>${esc(R.RULE_KINDS[selR.kind].title)}</h4><div class="fr-says">${R.sentenceHtml(R.sentence(selR, ctx))}</div>${works}<div class="fr-pane-body" data-rid="${esc(selR.id)}">${PANES[selR.kind](selR, { ...m, names: ctx.names, originName: ctx.originName })}</div>`;
  }
  const what = `<section class="fr-sec"><h3>What it does <small>${rules.length} rule${rules.length === 1 ? "" : "s"}</small></h3><div class="fr-md"><div class="fr-lst">${list}<div class="fr-adds">${add}</div></div><div class="fr-pane">${pane}</div></div></section>`;
  if (host !== "effect") return `<div class="fr-tab${m.help ? " fr-helpon" : ""}" data-host="${host}">${tip}${what}</div>`;
  const endsSec = `<section class="fr-sec"><h3>Ends <small>at the first of these; none ticked: until removed</small></h3><div data-scope="ends">${endsHtml(ends, { ...m, names: ctx.names, originName: ctx.originName, zoneMode: onMap })}</div></section>`;
  const whereSec = `<section class="fr-sec"><h3>Where it is <small>an effect is worn or placed</small></h3>${seg("@where", onMap ? "map" : "creature", [["creature", "On a creature"], ["map", "On the map (a Zone)"]], "w")}
    ${help("On a creature: the rules below need a bearer. On the map: the effect has no bearer; it is the area, and what it does to creatures inside. Switching keeps both sides' settings.")}</section>`;
  const body = onMap ? zoneHtml(m.zone, { ...m, names: ctx.names, originName: m.originName }) : what;
  const a = m.auto ?? {}, dia = a.note ? "half" : "full";
  const autoSec = `<details class="fr-auto"><summary><span class="fr-dia ${dia}" aria-hidden="true"></span>${a.note ? "Partly automated" : "Automated"}</summary>
    ${grid([["Rank", sel("@automation", a.rank ?? "", a.ranks ?? [["", "(not set)"]], "Automation rank")], ["Players do", `<textarea class="fr-ta" data-fr-in="@automationNote" placeholder="What the players do themselves" aria-label="Players do">${esc(a.note ?? "")}</textarea>`]])}
    ${help("The rank is the diamond chip the cards show (Bronze to Diamond). Automated when nothing is left to the players; Players do: what Foundry doesn't do yet (the diamond's tooltip).")}</details>`;
  const d = m.adv ?? {};
  const advSec = `<details class="fr-adv"><summary>Advanced</summary>${grid([["Kind", tog("@isCondition", d.isCondition, "A condition (a named state of the book)")], d.isCondition ? ["", tog("@valued", d.valued, "It has a value (like Empowered 2)")] : null,
    ["Placed on", seg("@selfApplied", String(!!d.selfApplied), [["false", "the target"], ["true", "the creature that used the Action"]], "w")]])}
    ${help("These are the effect's own fields, as before. The JSON tab shows everything.")}</details>`;
  // v0.0.324 (Lucas): no "Origin: the creature that used the Action" switch: with an Action behind it, the origin is always its user; without one, it asks
  return `<div class="fr-tab${m.help ? " fr-helpon" : ""}" data-host="effect">${tip}${whereSec}${body}${endsSec}${autoSec}${advSec}</div>`;
}

/* ------------------------------------------------------------------ the events */
/** What the item's own fields a control may change ("@field"). */
const ITEM_FIELDS = { where: "s", hover: "s", automation: "s", automationNote: "s", isCondition: "b", valued: "b", selfApplied: "b", originFromUser: "b" };
/** The update of one save: the rules, the Ends, what they compile to, the hover text built from them. Pure. */
export function saveUpdate(rules, ends, host = "effect", names = {}, zone = null, where = "creature", action = null) {
  const c = R.compile(rules, ends, host), clean = rules.map(R.normRule);
  const upd = { "system.rules": clean, "system.rulesOn": true, "system.settings": c.settings, "system.autoHover": host === "effect" ? R.hoverCardText(clean, ends, { originName: "{origin}", names, host }) : R.hoverCardText(clean, {}, { originName: "its origin", names, host }).replace(/\s*Lasts until removed\.$/, "") };
  if (host === "effect" && zone) { upd["system.zone"] = R.normZone(zone); if (where === "map") upd["system.autoHover"] = `${R.plainText(R.zoneSentence(zone, { originName: "{origin}", names, action }))} ${R.zoneEndsSentence(ends, { originName: "{origin}" })}`; }   // v0.0.327
  if (host === "effect") Object.assign(upd, { "system.ends": R.normEnds(ends), "system.conditions": c.conditions, "system.linked": c.linked, "system.duration": c.duration, "system.expireOn": c.expireOn, "system.expireAll": c.expireAll,
    "system.endsWithOrigin": c.endsWithOrigin, "system.whileSeen": c.whileSeen, "system.noReactions": c.noReactions, "system.loseAp": c.loseAp, "system.saveEnd": c.saveEnd });
  return upd;
}
/** Read a dropped document: an Effect or an Action, its name and what the pane shows. */
export async function dropInfo(doc) {
  if (!doc) return null;
  const s = doc.system ?? {};
  if (doc.type === "action") {
    const aps = [...new Set((s.versions ?? []).map(v => Number(v.ap) || 0))].sort((a, b) => a - b);
    const strip = h => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const line = strip(s.trigger) ? `${s.reactionKind === "interrupt" ? "Interrupt" : "Trigger"}: ${strip(s.trigger)}` : (strip(s.versions?.[0]?.effects) || strip(s.description)).slice(0, 120);
    return { name: doc.name, type: "action", cost: aps.length ? `${aps.join("/")}${s.reaction ? "R" : " AP"}` : "", freq: TWOD12.frequencies?.[s.frequency] ?? "", line };
  }
  if (doc.type === "effect") {
    const src = s.isCondition && (s.whileSeen || s.endsWithOrigin || s.originFromUser) ? (/^frightened/i.test(doc.name) ? "of" : "by") : "";
    return { name: doc.name, type: "effect", valued: !!s.valued, src };
  }
  return null;
}

/**
 * Wire the tab. sheet: { item (the document, or the applied effect's temporary item), host, _fr (the view's state: sel, own), render() }.
 * The changes are saved with saveUpdate; a token is asked for an origin with the bottom bar (pickbar.mjs).
 */
export function wireFxTab(sheet, root) {
  const tab = root.querySelector(".fr-tab");
  if (!tab || tab.dataset.wired) return;
  tab.dataset.wired = "1";
  const st = (sheet._fr ??= { sel: "", own: false, names: {} });
  const host = tab.dataset.host || "effect";
  const sys = () => sheet.item.system;
  const work = () => ({ rules: foundry.utils.deepClone((sys().rules ?? []).map(r => (typeof r?.toObject === "function" ? r.toObject() : r))).map(R.normRule), ends: R.normEnds(foundry.utils.deepClone(sys().ends ?? {})), zone: R.normZone(foundry.utils.deepClone(sys().zone ?? {})) });
  const save = async (w, extra = {}) => {
    const upd = { ...saveUpdate(w.rules, w.ends, host, st.names, host === "effect" ? w.zone : null, sys().where, st.zoneAction ?? null), ...extra };
    try { await sheet.item.update(upd); } catch (e) { console.warn("twod12 | rules", e); ui.notifications.warn("This effect can't be changed here."); }
  };
  const selected = w => w.rules.find(r => r.id === (st.sel || w.rules[0]?.id));
  /** Change one path: "ends.…" in Ends, "@field" on the item, anything else in the selected rule. */
  const change = async (path, fn) => {
    if (path.startsWith("@")) { const k = path.slice(1); if (k === "origin") return pickOrigin(null); const v = fn(get(sys(), k)); return sheet.item.update({ [`system.${k}`]: ITEM_FIELDS[k] === "b" ? (v === true || v === "true") : v }); }
    const w = work();
    if (path.startsWith("ends.")) { const p = path.slice(5); put(w.ends, p, fn(get(w.ends, p))); return save(w); }
    if (path.startsWith("zone.")) { const p = path.slice(5); put(w.zone, p, fn(get(w.zone, p))); return save(w); }   // v0.0.327 (PACK ZONE)
    const r = selected(w);
    if (!r) return;
    put(r, path, fn(get(r, path)));
    if (path === "dir" && r.dir === "against") r.ign.on = false;
    return save(w);
  };
  const asType = (cur, v) => (typeof cur === "number" ? (Number(v) || 0) : typeof cur === "boolean" ? v === "true" : v);
  const pickOrigin = async path => {
    const { pickBar } = await import("./pickbar.mjs");
    const toks = (canvas?.tokens?.placeables ?? []).filter(t => t.actor);
    if (!toks.length) return ui.notifications.warn("No token on the map.");
    const id = await pickBar({ icon: "fa-crosshairs", text: "The origin? Click its token.", options: toks.map(t => ({ id: t.id, label: t.name, token: t })) });
    const t = toks.find(x => x.id === id);
    if (!t) return;
    if (!path) return sheet.changeOrigin?.(t);
    st.names[t.actor.uuid] = t.name;
    const w = work(), r = selected(w);
    if (r) { put(r, path, t.actor.uuid); await save(w); }
  };
  tab.addEventListener("click", async ev => {
    const b = ev.target.closest("[data-fr]");
    if (!b || !tab.contains(b)) return;
    const a = b.dataset.fr, f = b.dataset.f;
    if (a === "sel") { if (ev.target.closest("[data-fr='del']")) return; st.sel = b.dataset.rid; return sheet.render(); }
    ev.preventDefault();
    if (a === "del") { ev.stopPropagation(); const w = work(); w.rules = w.rules.filter(r => r.id !== b.dataset.rid); if (st.sel === b.dataset.rid) st.sel = ""; return save(w); }
    if (a === "own") { st.own = !st.own; if (!st.own && String(sys().hover ?? "").trim()) return sheet.item.update({ "system.hover": "" }); return sheet.render(); }
    if (a === "origin") return pickOrigin(f === "@origin" ? null : f);
    if (a === "set") return change(f, cur => asType(cur, b.dataset.v));
    if (a === "tog") return change(f, cur => !cur);
    if (a === "step") return change(f, cur => {
      if (typeof cur === "string" && cur.trim() && !/^\s*[+-]?\d+\s*$/.test(cur)) return cur;   // a formula: − / + leave it as it is
      const v = Math.max(Number(b.dataset.min), Math.min(Number(b.dataset.max), (Number(cur) || 0) + Number(b.dataset.d)));
      return typeof cur === "string" ? String(v) : v;
    });
    if (a === "tier") return change(f, cur => { const t = Number(b.dataset.v), l = [...(cur ?? [])]; return (l.includes(t) ? l.filter(x => x !== t) : [...l, t]).sort(); });
    if (a === "untrait") return change(f, cur => (cur ?? []).filter(k => k !== b.dataset.v));
    if (a === "push") return change(f, cur => [...(cur ?? []), f.endsWith("riders") ? { tiers: [3], does: "text", text: "", crit: false } : f.endsWith("ht.list") ? { dice: "1d4", pool: "B", sub: "" } : { dice: "1d4", pool: "B", sub: "", tiers: [1, 2, 3], fx: "", text: "" }]);
    if (a === "splice") return change(f, cur => (cur ?? []).filter((x, i) => i !== Number(b.dataset.i)));
    if (a === "clr") return change(f, () => "");
    if (a === "placeZone") return sheet.placeZone?.();   // v0.0.327 (PACK ZONE): Set here, placed by hand
  });
  tab.addEventListener("keydown", ev => { if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches?.("[data-fr][tabindex]")) { ev.preventDefault(); ev.target.click(); } });
  tab.addEventListener("change", async ev => {
    const el = ev.target;
    if (el.matches("[data-fr-add]")) {
      const kind = el.value; el.value = "";
      if (!kind) return;
      const w = work(), r = R.defaultRule(kind);
      w.rules.push(r); st.sel = r.id;
      return save(w);
    }
    if (el.matches("[data-fr-trait]")) { const v = el.value; el.value = ""; if (!v) return; return change(el.dataset.frTrait, cur => [...new Set([...(cur ?? []), v])]); }
    if (el.matches("[data-fr-in]")) {
      const f = el.dataset.frIn, v = el.type === "range" ? Number(el.value) : el.value;
      return change(f, cur => (typeof cur === "number" && el.type !== "text" ? Number(v) || 0 : v));
    }
  });
  // Drops: on a drop zone, into that field; anywhere else on the tab, a new Grants rule holding it (unless a Grants or Aura rule is selected: into it).
  tab.addEventListener("dragover", ev => ev.preventDefault());
  tab.addEventListener("drop", async ev => {
    ev.preventDefault(); ev.stopPropagation();
    let data = null;
    try { data = JSON.parse(ev.dataTransfer?.getData("text/plain") || "null"); } catch (e) { data = null; }
    const doc = data?.uuid ? await fromUuid(data.uuid) : null;
    const info = await dropInfo(doc);
    if (!info) return ui.notifications.warn("Drop an Effect or an Action.");
    st.names[doc.uuid] = doc.name;
    const zone = ev.target.closest("[data-fr-drop]")?.dataset.frDrop;
    const w = work();
    if (zone?.startsWith("zone.")) {   // v0.0.327: a Zone's drop zones (Carries, Hazard's Gives)
      if (info.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
      put(w.zone, zone.slice(5), doc.uuid); put(w.zone, `${zone.slice(5)}Name`.replace(/\.fxName$/, ".fxName"), doc.name);
      return save(w);
    }
    let r = selected(w);
    const intoGrant = r?.kind === "grant" && (!zone || zone === "item");
    if (zone && zone !== "item" && r) {
      if (info.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
      put(r, zone, doc.uuid);
      if (zone.endsWith(".fx")) put(r, zone.replace(/\.fx$/, ".fxName"), doc.name);
      return save(w);
    }
    if (!intoGrant) { r = R.defaultRule("grant"); w.rules.push(r); st.sel = r.id; }
    Object.assign(r, { item: doc.uuid, itemName: doc.name, itemType: info.type, valued: !!info.valued, src: info.src || "" });
    if (info.type === "action" && r.when === "damage") r.when = "lasts";
    return save(w);
  });
}
