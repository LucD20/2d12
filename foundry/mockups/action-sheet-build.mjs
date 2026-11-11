// PACK ACTION-SHEET (2026-11-11): builds the three mockups of the Action item sheet.
//   node foundry/mockups/action-sheet-build.mjs      -> action-sheet-A.html, -B.html, -C.html (static, self-contained)
// Real pieces: the system's CSS (styles/system.css, inlined), the rules list of EFFECT-SHEET (fxsheet.mjs fxTabHtml, fed with Marked Quarry's
// settings read as rules by fxrules.mjs migrate), the Action card (actioncard.mjs buildSoloCard) and the four cards from tools/content.mjs.
// The new pieces (Tier rows, the "After the damage" rows, the Version tabs, the by-Stage row) are drawn with the fr- classes plus a small "as-" sheet.
// Nothing here is read by Foundry.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url)), SYS = path.join(HERE, "..", "twod12");
const U = p => new URL("file://" + path.join(SYS, p)).href;

/* ---------------------------------------------------------------- Foundry stubs (as the tests do) */
const enrichHTML = async t => String(t ?? "").replace(/@Template\[(\w+)\|distance:(\d+)[^\]]*\]/g, (m, sh, n) => `<span class="as-chipbtn">${n} ${sh.charAt(0).toUpperCase()}${sh.slice(1)}</span>`).replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "<b>$1</b>").replace(/@(\w+)\[([^\]]*)\](?:\{([^}]*)\})?/g, (m, k, body, lab) => `<span class="as-chipbtn">${lab ?? body.split("|")[0]}</span>`);
const deep = () => new Proxy(class {}, { get: (t, k) => (k in t ? t[k] : k === "then" ? undefined : deep()) });
const stubFoundry = () => { globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {}, HandlebarsApplicationMixin: C => C }, sheets: { ItemSheetV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), mergeObject: (a, b) => ({ ...a, ...b }) }, abstract: deep(), data: deep() }; };
stubFoundry();
globalThis.Combat = class {}; globalThis.CONFIG = { statusEffects: [], time: {}, Canvas: {} }; globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = { settings: { get: () => false }, combat: null, user: { getFlag: () => undefined, isGM: true }, items: [], packs: [], i18n: { localize: s => s } };
globalThis.fromUuid = async () => null;
const C = await import(U("tools/content.mjs"));
stubFoundry();
globalThis.game = { settings: { get: () => false }, combat: null, user: { getFlag: () => undefined, isGM: true }, items: [], packs: [], i18n: { localize: s => s } };
const { TWOD12 } = await import(U("module/config.mjs"));
const R = await import(U("module/fxrules.mjs"));
const V = await import(U("module/fxsheet.mjs"));
const { buildSoloCard } = await import(U("module/actioncard.mjs"));
const { instanceText } = await import(U("module/actions.mjs"));

/* ---------------------------------------------------------------- Stage 0 (book/decisions-s1.md): the mockups read the Stage list, never 1 / 2 / 3 */
// config.mjs still has Stages 1-3 (levels 1-4, 5-7, 8-10); the mockups show the list Stage 0 brings. The sheet must read TWOD12.stages, whatever it holds.
const STAGES = [{ n: 0, from: 1, to: 3 }, { n: 1, from: 4, to: 7 }, { n: 2, from: 8, to: 11 }, { n: 3, from: 12, to: 15 }];
const ESC_MAX = 6;

/* ---------------------------------------------------------------- small controls (the EFFECT-SHEET markup: fxsheet.mjs) */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const seg = (cur, opts, cls = "") => `<span class="fr-seg ${cls}">${opts.map(([v, l]) => `<button type="button" class="${String(cur) === String(v) ? "on" : ""}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join("")}</span>`;
const step = (cur, cls = "") => `<span class="fr-step ${cls}"><button type="button" aria-label="Less">−</button><span class="v">${esc(cur)}</span><button type="button" aria-label="More">+</button></span>`;
const tog = (on, label) => `<span class="fr-tog${on ? " on" : ""}" role="switch" aria-checked="${!!on}" tabindex="0"><span class="box"></span>${label}</span>`;
const text = (v, ph = "", cls = "") => `<input type="text" class="fr-in ${cls}" value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(ph || "text")}">`;
const area = (v, ph = "", rows = 2) => `<textarea class="fr-ta" rows="${rows}" placeholder="${esc(ph)}" aria-label="${esc(ph || "text")}">${esc(v)}</textarea>`;
const sel = (cur, opts) => `<select class="fr-sel">${opts.map(([v, l]) => `<option${String(cur) === String(v) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
const grid = rows => `<div class="fr-pgrid">${rows.filter(Boolean).map(([l, c]) => `<span class="fr-pl">${l}</span><div class="fr-pc">${c}</div>`).join("")}</div>`;
const help = t => `<p class="fr-help">${t}</p>`;
const part = (on, title, sum, body) => `<div class="fr-part${on ? "" : " off"}"><header>${tog(on, title)}<span class="fr-psum">${on ? esc(sum) : "off"}</span></header><div class="fr-pb">${body}</div></div>`;
const drop = (label, small) => `<div class="fr-drop">${label}<br><small>${small}</small></div>`;
const dropped = (name, line = "", kind = "Effect") => `<div class="fr-dropped${kind === "Action" ? " is-a" : ""}"><span class="fr-dk">${kind}</span><b>${esc(name)}</b><button type="button" class="fr-x" aria-label="Remove">×</button>${line ? `<div class="fr-m2">${esc(line)}</div>` : ""}</div>`;
const sec = (title, small, body, cls = "") => `<section class="fr-sec ${cls}"><h3>${title}${small ? ` <small>${small}</small>` : ""}</h3>${body}</section>`;
const tchip = k => `<span class="fr-chip g-${R.traitGroup(k)}">${esc(R.traitLabel(k))}<button type="button" aria-label="Remove">×</button></span>`;
const traitsRow = t => `<div class="as-traits">${TWOD12.traitGroups.flatMap(g => g.traits.filter(k => t.includes(k))).map(tchip).join("")}<select class="fr-sel fr-tsel" aria-label="Add a trait"><option>+ trait</option></select></div>`;
const FREQ = [["none", "None"], ["atwill", "At-will"], ["turn", "Turn"], ["round", "Round"], ["encounter", "Encounter"], ["daily", "Daily"]];
const escField = (mode, n) => `${seg(mode, [["none", "None"], ["cost", "Costs"], ["needs", "Needs (an Apex)"]], "w")}${mode === "none" ? "" : step(n)}<span class="as-range">1 to ${ESC_MAX}</span>`;

/* ---------------------------------------------------------------- the four cards (tools/content.mjs), read into one view model */
const doc = (n, t = "action") => C.docs.find(d => d.name === n && d.type === t);
const nameOf = uuid => C.docs.find(d => C.uuidOf(d.pack, d.name) === uuid)?.name ?? "";
const fxDoc = uuid => C.docs.find(d => C.uuidOf(d.pack, d.name) === uuid);
const asItem = d => ({ id: "x", name: d.name, type: d.type, img: d.img, getFlag: () => undefined, system: { ...d.system, traits: new Set(d.system.traits ?? []), versions: d.system.versions ?? [] } });
const dmgText = list => (list ?? []).map(instanceText).filter(Boolean).join(" + ");

// The "After the damage" chain read as rows (the audit's default 1: one list, rows instead of chips).
const KIND = { Move: ["M", "rule"], Condition: ["C", "cond"], Guard: ["G", "wp"], Heal: ["H", "au"], Reduce: ["R", "esc"], Effect: ["E", "cond"], EndEffect: ["X", "tk"], Pause: ["P", "rule"] };
function afterRows(v, sys) {
  const save = (sys.traits ?? []).includes("save"), rows = [];
  for (const m of String(v.after ?? "").matchAll(/@(\w+)\[([^\]]*)\]/g)) {
    const [head, ...ps] = m[2].split("|"), o = Object.fromEntries(ps.map(p => { const i = p.indexOf(":"); return [p.slice(0, i), p.slice(i + 1)]; }));
    const on = o.crit === "yes" ? ["crit"] : o.tier ? (save ? [1, 2, 3].filter(n => n <= Number(o.tier)) : [1, 2, 3].filter(n => n >= Number(o.tier))).map(n => `t${n}`) : ["t1", "t2", "t3"].filter(k => !(m[1] === "Move" && (o.t1 || o.t2 || o.t3)) || o[k] || (o.distance && !save) || (save && k !== "t3"));
    const r = { kind: m[1], on, o, head, chip: m[0] };
    if (m[1] === "Move") {
      const w = { pushed: "Pushed", pulled: "Pulled", slid: "Slid" }[head] ?? head, d = k => o[k] ?? o.distance ?? "1";
      r.byTier = !!(o.t1 || o.t2 || o.t3); r.amount = o.distance ?? "1"; r.tiers = { t1: d("t1"), t2: d("t2"), t3: d("t3") };
      r.who = o.pick === "yes" ? `the other creatures in a ${o.area} Emanation around the target, one by one` : "the target";
      r.from = o.from === "target" ? "away from the target" : o.from === "area" ? "away from the area's center" : "away from you";
      r.label = `${w} ${r.byTier ? r.on.map(k => r.tiers[k]).join(" / ") : r.amount}`; r.what = w;
      r.says = `${cap(r.who)} ${r.who.startsWith("the other") ? "are" : "is"} <b>${w} ${r.byTier ? r.on.map(k => `${r.tiers[k]} (${tn(k)})`).join(", ") : r.amount}</b>, ${r.from}.`;
    } else if (m[1] === "Condition") {
      const nm = cap(head), val = o.value ? ` ${o.value}` : "", dur = o.rounds ? `${o.rounds} round${o.rounds === "1" ? "" : "s"}` : o.eot === "yes" || o.duration === "eot" ? "EoT" : "";
      r.label = `${nm}${val}${dur ? ` (${dur})` : ""}`; r.who = "the target"; r.dur = dur; r.name = nm + val;
      r.says = `The target is <b>${nm}${val}</b>${["Frightened", "Taunted", "Grabbed"].includes(nm) ? " of you" : ""}${dur ? ` for ${dur.replace("EoT", "until the end of their turn")}` : ""}.`;
    } else if (m[1] === "Guard") {
      r.amount = head.replace("mod", "[Mod]").replace(/\+/g, " + "); r.who = o.who === "pick" ? `you or one ally${o.area ? ` in a ${o.area} Emanation around the target` : o.near ? ` within ${o.near}` : ""} (a pick)` : "you";
      r.label = `Guard ${r.amount}`; r.says = `${cap(r.who.replace(" (a pick)", ""))} gain${r.who === "you" ? "" : "s"} <b>Guard ${r.amount}</b>.`; r.stage = /1d8/.test(head) && sys.category === "Divine Power";
    } else { r.label = `${m[1]} ${head}`; r.who = "the target"; r.says = `${m[1]}: ${esc(head)}.`; }
    rows.push(r);
  }
  return rows;
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const tn = k => (k === "crit" ? "Critical" : `Tier ${k[1]}`);

function model(name) {
  const d = doc(name), s = d.system, tr = [...(s.traits ?? [])];
  const versions = (s.versions ?? []).map(v => ({
    ap: v.ap, noTiers: !!v.noTiers, mode: v.mode ?? "",
    tiers: ["t1", "t2", "t3"].map((k, i) => ({ k, dmg: dmgText(v[k]), text: plain(v[`x${i + 1}`]) })),
    critical: plain(v.critical), effects: plain(v.effects), areaSize: v.areaSize || 0, areaRounds: v.areaRounds || 0,
    onUse: [...(v.fx?.all ?? []), ...(v.fx?.t1 ?? []), ...(v.fx?.t2 ?? []), ...(v.fx?.t3 ?? [])].map(x => ({ name: nameOf(x.uuid) || "(an Effect)", line: fxLine(x.uuid) })),
    after: afterRows(v, s)
  }));
  const a = s.areaCfg ?? {};
  return {
    name, img: d.img, sys: s, traits: tr, flavor: s.flavor ?? "", category: s.category ?? "", level: s.level ?? 0, freq: s.frequency || "none", esc: s.escalation || 0,
    targets: s.targets ?? "", distance: s.distance ?? "", vs: s.vs ?? "", weapon: tr.includes("weapon"), save: tr.includes("save"),
    reaction: !!s.reaction, rkind: s.reactionKind ?? "trigger", moment: s.moment ?? "", momentSelf: !!s.momentSelf, momentTarget: s.momentTarget ?? "subject", momentRange: s.momentRange || 0, trigger: plain(s.trigger),
    area: { on: (a.size || 0) > 0, size: a.size || 0, shape: a.shape || "emanation", within: a.within || 0, withinRange: a.withinRange || "", targets: a.targets || "all", center: !!a.center, keep: !!a.keep, rounds: a.rounds || 0 },
    marks: !!s.marksTarget, requirements: plain(s.requirements), auto: s.automation ?? "", autoNote: s.automationNote ?? "", versions, costs: versions.map(v => v.ap)
  };
}
const plain = t => String(t ?? "").replace(/@Template\[(\w+)\|distance:(\d+)[^\]]*\]/g, (m, sh, n) => `${n} ${sh.charAt(0).toUpperCase()}${sh.slice(1)}`).replace(/@\w+\[([^\]|]*)[^\]]*\]\{([^}]*)\}/g, "$2").replace(/@Guard\[([^\]|]*)[^\]]*\]/g, (m, a) => `Guard ${a.replace("mod", "[Mod]").replace(/\+/g, " + ")}`).replace(/@Move\[(\w+)\|distance:(\d+)[^\]]*\]/g, (m, w, n) => `${w.charAt(0).toUpperCase()}${w.slice(1)} ${n}`).replace(/@\w+\[([^\]|]*)[^\]]*\]/g, "$1").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@Book\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/<[^>]+>/g, "").trim();
function fxLine(uuid) {
  const d = fxDoc(uuid); if (!d) return "";
  const s = d.system;
  if (s.where === "map") return R.plainText(`${R.zoneSentence(s.zone, { names: zoneNames(s.zone), originName: "you" })} ${R.zoneEndsSentence(R.normEnds(s.ends), {})}`);
  return R.hoverCardText((s.rules ?? []).map(R.normRule), R.normEnds(s.ends), { originName: "you", host: "effect" });
}
const zoneNames = z => Object.fromEntries(["carry", "carry2"].map(k => z?.inside?.[k]?.fx).filter(Boolean).map(u => [u, nameOf(u)]));

/* Mark Quarry holds the mark's rules (action-props-review section 5): the Marked Quarry Feature's settings, read as rules by the real migrate. */
const MQ = doc("Marked Quarry", "feature");
const MQ_RULES = R.migrate(JSON.parse(JSON.stringify(MQ.system)), "feature").rules;
function rulesTab(rules, sel) {
  let h = V.fxTabHtml({ host: "feature", name: "Mark Quarry", rules, sel: sel ?? rules[0]?.id, names: {}, items: {}, hover: "" });
  // Stage 0: "Works" takes Escalation 1 to 6 (fxsheet.mjs has a fixed 1+ / 2+ / 3+ today: the audit's finding S1)
  h = h.replace(/<div class="fr-works">[\s\S]*?<\/div><\/div><\/div>/, `<div class="fr-works">${grid([["Works", `${seg("0", [["0", "Always"], ["n", "From Escalation"]], "w")}<span class="as-range">then 1 to ${ESC_MAX}</span>`]])}</div>`);
  return h.replace(/<div class="fr-tip"[\s\S]*?<\/p>/, "");   // the Action's card is the preview: no second hover card
}

/* ---------------------------------------------------------------- shared sections */
const VS = m => (m.weapon ? `<span class="as-auto">AD <small>from the Weapon trait</small></span>` : m.save ? seg(m.vs, [["body", "Body Save"], ["mind", "Mind Save"], ["appeal", "Appeal Save"], ["instinct", "Instinct Save"]], "w") : seg(m.vs || "", [["", "DC 13"], ["roll", "The Attribute rolled"], ["body", "Body"], ["mind", "Mind"], ["appeal", "Appeal"], ["instinct", "Instinct"]], "w"));
const cardRows = m => [
  ["Traits", traitsRow(m.traits)],
  ["Flavor", text(m.flavor, "Your weapon blazes with holy light.", "wide")],
  ["Category", `${text(m.category, "Paladin Feature")} <span class="fr-m">Level</span> ${step(m.level)}`],
  ["Frequency", seg(m.freq, FREQ, "w")],
  ["Escalation", escField(m.esc ? "cost" : "none", m.esc || 1)],
  ["Targets", text(m.targets, "One creature", "wide")],
  ["Distance", m.area.on && !m.reaction ? `<span class="as-auto">${m.area.withinRange ? `Your weapon's ${m.area.withinRange} range` : m.area.within ? `${m.area.within} sq.` : "around you"} <small>from the Area</small></span>` : text(m.distance, "reach, self, weapon, 5 sq.")],
  ["Vs.", VS(m)],
  m.requirements ? ["Requirements", text(m.requirements, "", "wide")] : null
];
const cardMore = m => `<div class="as-more">${tog(m.marks, "Marks the target")}${tog(false, "An NPC's Basic attack")}${m.weapon ? `<span class="fr-m">Weapon used</span> ${sel("", [["", "Its weapon"], ["fists", "Only the Fists"], ["kick", "A kick"]])}` : ""}<a class="as-link">+ Requirements</a><a class="as-link">+ Setup</a></div>`;
const MOMENTS = Object.entries(TWOD12.moments).map(([k, v]) => [k, v.replace(" within N", "")]);
const reactionBody = m => grid([
  ["Kind", seg(m.rkind, [["interrupt", "Interrupt (before it)"], ["trigger", "Trigger (after it)"]], "w")],
  ["Moment", sel(m.moment, MOMENTS)],
  ["Within", `<span class="as-auto">${esc(m.distance || `${m.momentRange} sq.`)} <small>the Action's Distance</small></span>`],
  ["Counts", `${tog(m.momentSelf, "You too")}`],
  ["Used on", seg(m.momentTarget, [["subject", "The creature of the moment"], ["source", "The one that caused it"]], "w")],
  ["Card line", text(m.trigger, "An enemy within 5 squares makes a [Strike] Action against an ally.", "wide")]
]) + help("When the moment comes, the Reactions message offers it (Use / Pass). An Interrupt holds the damage until answered. How far it reaches is the Action's Distance: a number, or the Aura of an Effect (Beacon's Step).");
const reactionSum = m => `${cap(m.rkind)} · ${(TWOD12.moments[m.moment] ?? "by hand").replace(" within N", "")}`;
const zoneOf = m => m.versions.flatMap(v => v.onUse).find(x => /Zone|inside|area/i.test(x.line) && m.area.keep);
const areaBody = m => grid([
  ["Shape", seg(m.area.shape, [["emanation", "Emanation"], ["burst", "Burst"], ["line", "Line"]], "w")],
  ["Placed", `${seg(m.area.withinRange ? "weapon" : m.area.within ? "sq" : "self", [["self", "Around you"], ["sq", "Within N sq."], ["weapon", "The weapon's range"]], "w")}${m.area.withinRange ? sel(m.area.withinRange, [["normal", "normal"], ["far", "far"], ["maximum", "maximum"]]) : m.area.within ? step(m.area.within) : ""}`],
  m.area.keep ? ["Who", `<span class="as-auto">set by the Zone <small>${esc(zoneOf(m)?.name ?? "its Effect")}: each row has its own Who</small></span>`] : ["Targets", `${seg(m.area.targets, [["all", "Everyone"], ["allies", "Allies"], ["enemies", "Enemies"]], "w")}${tog(m.area.center, "and the creature it is around")}`],
  ["Stays", `${tog(m.area.keep, "It stays on the map (a Zone)")}`]
]) + help("The size and the rounds are set on each Version (below). A Zone's Effect decides who it affects and what it does inside; the Version says how long it stays.");
const areaSum = m => `${m.versions.map(v => v.areaSize || m.area.size).filter((x, i, a) => a.indexOf(x) === i).join(" / ")} ${cap(m.area.shape)}${m.area.keep ? " · a Zone" : ""}`;

const stageRow = (vals) => `<div class="as-stages" role="group" aria-label="By Stage">${STAGES.map((st, i) => `<label><span>Stage ${st.n}<small>levels ${st.from}-${st.to}</small></span><input type="text" class="fr-in" value="${esc(vals[i] ?? "")}" placeholder="${i ? "as the Stage before" : "as Stage 1"}"></label>`).join("")}</div>`;
const ON = [["t1", "Tier 1"], ["t2", "Tier 2"], ["t3", "Tier 3"], ["crit", "Critical"]];
const onChips = (on, save) => `<span class="as-on">${ON.map(([k, l]) => `<button type="button" class="as-onb ${k}${on.includes(k) ? " on" : ""}" aria-pressed="${on.includes(k)}">${l}</button>`).join("")}</span>`;
const onShort = on => (on.length === 3 && !on.includes("crit") ? "any Tier" : on.map(k => (k === "crit" ? "Critical" : `T${k[1]}`)).join(" / "));
function afterPane(r, m) {
  const rows = [["On", onChips(r.on, m.save) + (m.save ? `<span class="fr-m">a Save: the Tier the target rolled</span>` : "")]];
  if (r.kind === "Move") rows.push(["Moves", seg(r.what, [["Pushed", "Pushed"], ["Pulled", "Pulled"], ["Slid", "Slid"]], "w")], ["Squares", r.byTier ? `${tog(true, "By Tier")} ${r.on.map(k => `<span class="as-bt ${k}">${tn(k)} ${step(r.tiers[k])}</span>`).join("")}` : `${step(r.amount)} ${tog(false, "By Tier")}`],
    ["Who", seg(r.who === "the target" ? "t" : "o", [["t", "The target"], ["o", "The others in an area around it"], ["a", "Everyone in the Action's area"]], "w")], r.who !== "the target" ? ["Area", `${step(r.o.area)} <span class="fr-m">Emanation around the target; you move them one by one</span>`] : null,
    ["Away from", seg(r.o.from === "target" ? "target" : r.o.from === "area" ? "area" : "you", [["you", "You"], ["target", "The target"], ["area", "The area's center"]], "w")]);
  if (r.kind === "Condition") rows.push(["Condition", dropped(r.name, "", "Effect")], ["Lasts", `${seg(r.dur === "EoT" ? "eot" : "rounds", [["eot", "EoT"], ["rounds", "Rounds"], ["fx", "As the condition says"]], "w")}${r.dur && r.dur !== "EoT" ? step(r.o.rounds) : ""}`], ["Who", seg("t", [["t", "The target"], ["y", "You"], ["p", "A creature you pick"]], "w")]);
  if (r.kind === "Guard") rows.push(["Amount", `${text(r.amount, "1d8 + [Mod]", "amt")} ${tog(!!r.stage, "By Stage")}`], r.stage ? ["", stageRow(["", "1d8 + [Mod]", "2d6 + [Mod]", "2d8 + [Mod]"])] : null,
    ["Who", seg(r.o.who === "pick" ? "p" : "y", [["y", "You"], ["p", "You or one ally (a pick)"], ["a", "Every ally found"]], "w")], r.o.area ? ["Found in", `${step(r.o.area)} <span class="fr-m">Emanation around the target</span>`] : null);
  return `<div class="fr-says">${onSays(r, m)}</div>${grid(rows)}`;
}
const onSays = (r, m) => `${r.on.length === 3 && !r.on.includes("crit") ? "After the damage" : `On ${r.on.map(k => (k === "crit" ? "a Critical" : `a ${tn(k)}`)).join(" or ")}`}: ${r.says.charAt(0).toLowerCase() + r.says.slice(1)}`;
const afterItem = (r, i, on = false) => { const [t, c] = KIND[r.kind] ?? ["?", "rule"]; return `<div class="fr-it as-step${on ? " on" : ""}" role="button" tabindex="0" data-step="${i}"><span class="as-n">${i + 1}</span><span class="fr-kind k-${c}">${t}</span><span class="fr-itxt">${esc(r.label)} <em class="fr-m">${onShort(r.on)} · ${esc(r.who.replace(/ \(a pick\)|, one by one/g, "").replace(/ in a .*| around .*/, ""))}</em></span><button type="button" class="fr-trash" aria-label="Remove">✕</button></div>`; };
const ADD_AFTER = `<select class="fr-sel fr-addsel" aria-label="Add a step"><option>+ Add a step</option><optgroup label="Moves"><option>Pushed / Pulled / Slid</option><option>Evade</option></optgroup><optgroup label="Gives"><option>A condition (value, duration)</option><option>An Effect</option><option>Guard</option><option>Heal</option><option>Reduce the next damage</option></optgroup><optgroup label="Other"><option>End an Effect</option><option>A pause (confirm)</option></optgroup></select>`;
const afterBlock = (v, m, vi) => (v.after.length
  ? `<div class="fr-md as-after"><div class="fr-lst">${v.after.map((r, i) => afterItem(r, i, i === 0)).join("")}<div class="fr-adds">${ADD_AFTER}</div></div><div class="fr-pane">${v.after.map((r, i) => `<div class="as-steppane" data-step="${i}"${i ? " hidden" : ""}><h4>${esc(r.kind === "Move" ? "Forced Movement" : r.kind)}</h4>${afterPane(r, m)}</div>`).join("")}</div></div>`
  : `<div class="as-empty">${ADD_AFTER}<button type="button" class="as-fill">Fill from the Tier text</button><span class="fr-m">reads "Pushed 2", "Vulnerable 2 (EoT)", "Frightened of you for 1 round" and proposes the steps</span></div>`)
  + (v.after.length ? `<div class="as-empty"><button type="button" class="as-fill">Fill from the Tier text</button><span class="fr-m">The steps run in this order once the damage is applied and lands. The Tier text stays the book's words.</span></div>` : "");
const useWord = v => (v.noTiers ? "On use" : "On a Tier 2 or 3");
const useSmall = v => (v.noTiers ? "Effects applied when the Action is used" : "Effects applied with the card's Effects line (Tier 2+), before the damage");
const onUseBlock = v => `${v.onUse.map(x => dropped(x.name, x.line)).join("")}${drop(v.onUse.length ? "Drop another Effect here" : "Drop an Effect here", `${v.noTiers ? "applied when the Action is used" : "applied on a Tier 2 or 3"}: on the target, on you (the Effect's own \"Placed on\"), or on the map (a Zone)`)}`;
const TIERC = ["t1", "t2", "t3"];
const tierRow = (t, i, m) => `<div class="as-tier ${TIERC[i]}"><span class="as-tl">Tier ${i + 1}</span><div class="as-tb">${text(t.dmg, i ? "[V] 1[W] + [Mod] + [R] 1d6 Ho" : "[V] 1[W]", "as-dmg")}${dmgChips(t.dmg)}${text(t.text, m.save ? "No effect." : "Text of this Tier (the book's words)", "wide as-tx")}</div></div>`;
const dmgChips = d => (d ? `<span class="as-under">${d.split(" + ").map(p => { const mm = /^\[(V|R|C)\]\s*(.*)$/.exec(p.trim()); const pool = mm?.[1] ?? "", rest = (mm?.[2] ?? p).trim(); return `<span class="as-dc ${pool === "R" ? "r" : pool === "V" ? "v" : ""}">${esc(/^\[Mod\]$/.test(rest) ? "+ Modifier" : rest.replace(/^(\d*)\[W\]/, (x, n) => `${n || 1} × weapon`).replace(/ Ho$/, " Holy").replace(/ Pi$/, " Pierce"))}${pool ? ` <small>${pool === "R" ? "Resolve" : "Vigor"}</small>` : ""}</span>`; }).join("")}</span>` : "");
const versionArea = (v, m) => (m.area.on ? grid([["Area", `<span class="fr-m">Size</span> ${step(v.areaSize || m.area.size)} ${m.area.keep ? `<span class="fr-m">Rounds</span> ${step(v.areaRounds || m.area.rounds)}` : ""}`]]) : "");
function versionBody(v, vi, m) {
  const head = grid([["Cost", `${step(v.ap)} <span class="fr-m">AP${m.reaction ? " (the Reaction AP)" : ""}</span> ${tog(!v.noTiers, "It has Tiers")}`]]);
  const tiers = v.noTiers ? "" : `<div class="as-tiers">${v.tiers.map((t, i) => tierRow(t, i, m)).join("")}<div class="as-tier crit"><span class="as-tl">Critical</span><div class="as-tb">${text(v.critical, "Only on Doubles with a Tier 3 (empty: none)", "wide as-tx")}</div></div></div>${help("Write the damage like the card: <code>[V] 1[W] + [Mod] + [R] 1d6 Ho</code>. The chips under the field show what was understood.")}`;
  return `${head}${tiers}${grid([["Effects", area(v.effects, "The card's Effects line (the book's words)", 4)]])}${versionArea(v, m)}
    <h4 class="as-h4">${useWord(v)} <small>${useSmall(v)}</small></h4>${onUseBlock(v)}
    <h4 class="as-h4">After the damage <small>${v.after.length} step${v.after.length === 1 ? "" : "s"}</small></h4>${afterBlock(v, m, vi)}`;
}
const autoSec = m => `<details class="fr-auto"${m.autoNote ? "" : ""}><summary><span class="fr-dia ${m.autoNote ? "half" : "full"}" aria-hidden="true"></span>${m.autoNote ? "Partly automated" : "Automated"} <span class="fr-m">· ${esc(TWOD12.automationRanks[m.auto] ?? "(not set)")}</span></summary>${grid([["Rank", sel(m.auto, Object.entries(TWOD12.automationRanks))], ["Players do", area(m.autoNote, "What the players do themselves", 3)]])}${help("The rank is the diamond chip the cards show. Players do: what Foundry doesn't do yet (the diamond's tooltip).")}</details>
  <details class="fr-adv"><summary>Advanced</summary>${grid([["Ruler", `<span class="fr-m">worth</span> ${text(m.sys.worth ?? "", "from book/ruler/worth.json")}`], ["Old fields", `<span class="fr-m">shown only while a card still uses them: a Split Action's Weapon / Power mode, "only a creature you threaten"</span>`]])}</details>`;
const rulesSec = (m, small = "what its owner has by itself") => (m.name === "Mark Quarry"
  ? sec("While you have this Action", `${MQ_RULES.length} rules`, `<div class="as-rules">${rulesTab(MQ_RULES)}</div>${help("The same rules list as an Effect, a Feature or a Talent. Mark Quarry holds the mark's Boon, its Tier 1 damage and its two reminders: the Foundry-only Marked Quarry Feature goes.")}`)
  : sec("While you have this Action", "0 rules", `<div class="as-empty"><select class="fr-sel fr-addsel"><option>+ Add rule</option></select><span class="fr-m">${small}: a Boon on some Actions, a value, a reminder (as on an Effect)</span></div>`));

/* ---------------------------------------------------------------- the window shell */
const head = m => `<header class="head"><img src="${ICON}" width="48" height="48" alt=""><input class="name" type="text" value="${esc(m.name)}" aria-label="Name"></header>
  <nav class="tabs"><a class="tabbtn" role="tab">Description</a><a class="tabbtn active" role="tab">Details</a><a class="fr-q" role="button" tabindex="0" title="Show the help texts">?</a></nav>`;
const ICON = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="4" fill="#26364d"/><g fill="none" stroke="#f1e6c8" stroke-width="2"><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="12" stroke-dasharray="3 4"/><circle cx="24" cy="24" r="17" stroke-dasharray="1 5"/></g></svg>`);
const win = (m, body, w) => `<div class="application twod12 twod12-styled sheet as-win" style="--w:${w}px" data-card="${esc(m.name)}"><header class="window-header"><span>Action: ${esc(m.name)}</span><span class="wh-x">⋮ &nbsp; ✕</span></header><section class="window-content"><div class="twod12 sheet item sk">${head(m)}<section class="tab active" data-tab="details">${body}</section></div></section></div>`;
const cards = {};
for (const n of ["Smite", "Rebuke", "Covering Fire", "Mark Quarry"]) cards[n] = { m: model(n), card: await buildSoloCard(asItem(doc(n))) };
const vtabs = (m, extra = "") => `<div class="as-vtabs" role="tablist">${m.versions.map((v, i) => `<button type="button" role="tab" class="as-vtab${i === m.versions.length - 1 ? " on" : ""}" data-v="${i}">${v.ap} AP${m.reaction ? " (R)" : ""}<small>${v.noTiers ? "no Tiers" : esc(v.tiers[2].dmg || "")}</small></button>`).join("")}<button type="button" class="as-vtab add">+ Version</button>${extra}</div>`;
const preview = (n, open = false) => `<details class="as-prev"${open ? " open" : ""}><summary>The card <span class="fr-m">what players read; it rebuilds as you edit</span></summary><div class="as-card">${cards[n].card}</div></details>`;

/* ================================================================ A: one page, in the card's order */
function layoutA(n) {
  const m = cards[n].m;
  const body = `<div class="fr-tab as-A">
    ${preview(n)}
    ${sec("The card", "its lines, in the order players read them", grid(cardRows(m)) + cardMore(m))}
    ${sec("When and where", "", `<div class="fr-endlist">${part(m.reaction, "A Reaction", reactionSum(m), reactionBody(m))}${part(m.area.on, "An Area", areaSum(m), areaBody(m))}</div>`)}
    ${sec("Versions", `${m.versions.length} · one tab per AP cost`, `${vtabs(m, `<span class="as-vtools"><button type="button">Duplicate</button><button type="button">Delete</button></span>`)}${m.versions.map((v, i) => `<div class="as-vbody" data-v="${i}"${i === m.versions.length - 1 ? "" : " hidden"}>${versionBody(v, i, m)}</div>`).join("")}`)}
    ${rulesSec(m)}
    ${autoSec(m)}
  </div>`;
  return win(m, body, 680);
}

/* ================================================================ B: a list and a pane (the Effect sheet's own shape) */
function layoutB(n) {
  const m = cards[n].m, items = [];
  const it = (tile, cls, label, sub, pane, o = {}) => items.push({ tile, cls, label, sub, pane, ...o });
  it("C", "rule", "The card", `${TWOD12.frequencies[m.freq] ?? "None"} · ${m.targets}`, `<h4>The card</h4><div class="fr-says">${cardSays(m)}</div>${grid(cardRows(m))}${cardMore(m)}`);
  it("R", "esc", "A Reaction", m.reaction ? reactionSum(m) : "off", `<h4>A Reaction</h4>${m.reaction ? `<div class="fr-says">${esc(m.trigger)}</div>` : ""}${grid([["", tog(m.reaction, "This Action is a Reaction")]])}${m.reaction ? reactionBody(m) : ""}`, { off: !m.reaction });
  it("A", "au", "An Area", m.area.on ? areaSum(m) : "off", `<h4>An Area</h4>${grid([["", tog(m.area.on, "This Action has an Area")]])}${m.area.on ? areaBody(m) : ""}`, { off: !m.area.on });
  m.versions.forEach((v, vi) => {
    it(String(v.ap), "ap", `${v.ap} AP${m.reaction ? " (R)" : ""}`, v.noTiers ? "no Tiers" : v.tiers.map(t => t.dmg || "—").join(" / "), `<h4>The ${v.ap} AP Version <span class="as-vtools"><button type="button">Duplicate</button><button type="button">Delete</button></span></h4>${versionHead(v, m)}`, { group: vi === 0 ? "Versions" : "", sel: vi === m.versions.length - 1 && !v.after.length && m.name !== "Mark Quarry" });
    v.onUse.forEach(x => it("E", "cond", `${v.noTiers ? "On use" : "Tier 2+"}: ${x.name}`, "", `<h4>${useWord(v)} (${v.ap} AP)</h4><div class="fr-says">${v.noTiers ? "When the Action is used" : "On a Tier 2 or 3"}: ${esc(x.line)}</div>${onUseBlock(v)}`, { child: true }));
    v.after.forEach((r, i) => { const [t, c] = KIND[r.kind] ?? ["?", "rule"]; it(t, c, `After: ${r.label}`, `${onShort(r.on)}`, `<h4>After the damage, step ${i + 1} (${v.ap} AP)</h4>${afterPane(r, m)}`, { child: true, sel: vi === m.versions.length - 1 && i === 0 }); });
  });
  if (m.name === "Mark Quarry") MQ_RULES.forEach((r, i) => { const k = R.RULE_KINDS[r.kind]; it(k.tile, k.cls, R.ruleLabel(r, { names: {}, host: "feature" }), "", `<h4>${esc(k.title)}</h4>${rulePane(r)}`, { group: i ? "" : "While you have this Action", sel: i === 0 }); });
  if (!items.some(x => x.sel)) items.find(x => x.label.endsWith("AP") || /AP/.test(x.label)).sel = true;
  const list = items.map((x, i) => `${x.group ? `<div class="as-grp">${x.group}</div>` : ""}<div class="fr-it${x.sel ? " on" : ""}${x.off ? " as-off" : ""}${x.child ? " as-child" : ""}" role="button" tabindex="0" data-i="${i}"><span class="fr-kind k-${x.cls}">${x.tile}</span><span class="fr-itxt">${esc(x.label)}${x.sub ? ` <em class="fr-m">${esc(x.sub)}</em>` : ""}</span></div>`).join("");
  const add = `<div class="fr-adds"><select class="fr-sel fr-addsel"><option>+ Add</option><option>A Version</option><option>An Effect it applies</option><option>An "After the damage" step</option><option>A rule (while you have it)</option></select><button type="button" class="as-fill">Fill from the Tier text</button></div>`;
  const body = `<div class="fr-tab as-B">
    ${preview(n)}
    <section class="fr-sec"><h3>What it is <small>${items.length} parts: the card, when it is used, each Version and what follows it</small></h3>
    <div class="fr-md as-bmd"><div class="fr-lst">${list}${add}</div><div class="fr-pane">${items.map((x, i) => `<div class="as-bpane" data-i="${i}"${x.sel ? "" : " hidden"}>${x.pane}</div>`).join("")}</div></div></section>
    ${autoSec(m)}
  </div>`;
  return win(m, body, 760);
}
const versionHead = (v, m) => { const h = grid([["Cost", `${step(v.ap)} <span class="fr-m">AP</span> ${tog(!v.noTiers, "It has Tiers")}`]]); const tiers = v.noTiers ? "" : `<div class="as-tiers">${v.tiers.map((t, i) => tierRow(t, i, m)).join("")}<div class="as-tier crit"><span class="as-tl">Critical</span><div class="as-tb">${text(v.critical, "Only on Doubles with a Tier 3 (empty: none)", "wide as-tx")}</div></div></div>`; return `${h}${tiers}${grid([["Effects", area(v.effects, "The card's Effects line", 2)]])}${versionArea(v, m)}${help("The Effects it applies and the steps after the damage are this Version's rows in the list, under it.")}`; };
const cardSays = m => `${esc(m.name)}: ${m.traits.map(k => `[${esc(R.traitLabel(k))}]`).join(" ")} · ${esc(TWOD12.frequencies[m.freq] ?? "")} · ${m.costs.join(" / ")} AP. ${esc(m.targets)}${m.distance ? `, ${esc(m.distance)}` : ""}.`;
const rulePane = r => { const h = rulesTab(MQ_RULES, r.id); const i = h.indexOf('<div class="fr-says">'), j = h.lastIndexOf("</div></div></section>"); return h.slice(i, j); };

/* ================================================================ C: the Versions side by side, the card beside them */
function layoutC(n) {
  const m = cards[n].m, vs = m.versions, same = (i, f) => i > 0 && f(vs[i]) === f(vs[i - 1]) && f(vs[i]) !== "";
  const cell = (i, f, html, cls = "") => `<td class="${cls}${same(i, f) ? " as-same" : ""}">${html(vs[i], i)}${same(i, f) ? `<span class="as-eq">= ${vs[i - 1].ap} AP</span>` : ""}</td>`;
  const row = (label, cls, f, html) => `<tr class="${cls}"><th scope="row">${label}</th>${vs.map((v, i) => cell(i, f, html)).join("")}</tr>`;
  const anyTiers = vs.some(v => !v.noTiers);
  const stepChip = (r, i) => { const [t, c] = KIND[r.kind] ?? ["?", "rule"]; return `<div class="as-cstep${i === 0 ? " on" : ""}" role="button" tabindex="0"><span class="fr-kind k-${c}">${t}</span><span><b>${esc(r.label)}</b><em class="fr-m">${onShort(r.on)} · ${esc(r.who.replace(/ \(a pick\)|, one by one/g, ""))}</em></span></div>`; };
  const matrix = `<div class="as-mwrap"><table class="as-matrix"><thead><tr><th></th>${vs.map(v => `<th scope="col"><span class="as-capv">${step(v.ap)} <b>AP${m.reaction ? " (R)" : ""}</b></span><span class="as-vtools"><button type="button" title="Duplicate">⧉</button><button type="button" title="Delete">✕</button></span></th>`).join("")}<th class="as-addcol"><button type="button">+ Version</button></th></tr></thead><tbody>
    ${anyTiers ? ["Tier 1", "Tier 2", "Tier 3"].map((l, ti) => row(l, `as-mt ${TIERC[ti]}`, v => v.tiers[ti].dmg + "|" + v.tiers[ti].text, v => (v.noTiers ? `<span class="fr-m">no Tiers</span>` : `${text(v.tiers[ti].dmg, "[V] 1[W]", "as-dmg")}${dmgChips(v.tiers[ti].dmg)}${v.tiers[ti].text || m.save ? text(v.tiers[ti].text, "text", "wide as-tx") : ""}`))).join("") : ""}
    ${anyTiers ? row("Critical", "as-mt crit", v => v.critical, v => text(v.critical, "none", "wide as-tx")) : ""}
    ${row("Effects", "", v => v.effects, v => area(v.effects, "The card's Effects line", 3))}
    ${m.area.on ? row("Area", "", v => `${v.areaSize || m.area.size}|${v.areaRounds || m.area.rounds}`, v => `<span class="fr-m">Size</span> ${step(v.areaSize || m.area.size)}${m.area.keep ? ` <span class="fr-m">Rounds</span> ${step(v.areaRounds || m.area.rounds)}` : ""}`) : ""}
    ${row(anyTiers ? "Tier 2+ Effects" : "On use", "as-flow", v => v.onUse.map(x => x.name).join(), v => `${v.onUse.map(x => dropped(x.name)).join("")}<div class="fr-drop as-sm">Drop an Effect</div>`)}
    ${row("After the damage", "as-flow", v => v.after.map(r => r.chip).join(), v => `${v.after.map(stepChip).join("")}<div class="as-cadd">${ADD_AFTER}</div>`)}
  </tbody></table></div>`;
  const last = vs.at(-1), r0 = last.after[0];
  const stepPane = r0 ? `<div class="fr-pane as-cpane"><h4>${r0.kind === "Move" ? "Forced Movement" : r0.kind} <span class="fr-m">${last.ap} AP · step 1 of ${last.after.length} · click a step above to edit it here</span></h4>${afterPane(r0, m)}</div>` : `<div class="as-empty"><button type="button" class="as-fill">Fill from the Tier text</button><span class="fr-m">proposes the "After the damage" steps from "Pushed 2", "Vulnerable 2 (EoT)"…; a cell marked "= 1 AP" follows the Version to its left until you change it</span></div>`;
  const strip = `<div class="as-strip">${traitsRow(m.traits)}<div class="as-sline"><span class="fr-m">Frequency</span>${seg(m.freq, FREQ, "w")}</div><div class="as-sline"><span class="fr-m">Escalation</span>${escField(m.esc ? "cost" : "none", m.esc || 1)}</div>
    <div class="as-sline"><span class="fr-m">Targets</span>${text(m.targets, "One creature")}<span class="fr-m">Distance</span>${m.area.on && !m.reaction ? `<span class="as-auto">from the Area</span>` : text(m.distance, "weapon")}<span class="fr-m">Vs.</span>${VS(m)}</div>
    <div class="as-sline"><span class="fr-m">Category</span>${text(m.category)}<span class="fr-m">Level</span>${step(m.level)}<span class="fr-m">Flavor</span>${text(m.flavor, "", "wide")}</div>${cardMore(m)}</div>`;
  const body = `<div class="fr-tab as-C"><div class="as-cols"><div class="as-left">
    ${sec("The card", "", strip)}
    ${sec("When and where", "", `<div class="fr-endlist">${part(m.reaction, "A Reaction", reactionSum(m), reactionBody(m))}${part(m.area.on, "An Area", areaSum(m), areaBody(m))}</div>`)}
    ${sec("Versions", `${vs.length} · each column is an AP cost; a grey cell repeats the one to its left`, matrix + stepPane)}
    ${rulesSec(m)}
    ${autoSec(m)}
  </div><aside class="as-right"><div class="as-live">The card, live</div><div class="as-card">${cards[n].card}</div><p class="fr-m as-rnote">Every field you change redraws it. It is the card of the sheet, the chat and the class window (<code>buildSoloCard</code>).</p></aside></div></div>`;
  return win(m, body, 1040);
}

/* ---------------------------------------------------------------- the page */
const SYSCSS = fs.readFileSync(path.join(SYS, "styles/system.css"), "utf8").replace(/@import[^;]+;/g, "").replace(/url\((?!["']?data:)[^)]*\)/g, "none");
const PAGECSS = `
/* The page around the window: one dark table surface, the Foundry window on it (a single committed look: the system's own). */
:root { --pg: #1b1f27; --pg2: #262c37; --pg-ink: #e9e4d6; --pg-mut: #a7a294; --pg-acc: #e09a3a; --pg-line: #3a4150; color-scheme: dark; }
body { background: var(--pg); color: var(--pg-ink); font: 14px/1.45 Signika, "Segoe UI", system-ui, sans-serif; padding-block: 18px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
*, *::before, *::after { box-sizing: border-box; }
.pg-top { max-width: 1040px; margin: 0 auto 14px; display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: baseline; }
.pg-top h1 { font: 700 20px Georgia, "Times New Roman", serif; margin: 0; color: var(--pg-ink); text-wrap: balance; }
.pg-top p { margin: 0; color: var(--pg-mut); flex: 1 1 320px; min-width: 0; }
.pg-pick { max-width: 1040px; margin: 0 auto 16px; display: flex; flex-wrap: wrap; gap: 6px; }
.pg-pick button { font: inherit; padding: 6px 12px; border-radius: 4px; border: 1px solid var(--pg-line); background: var(--pg2); color: var(--pg-ink); cursor: pointer; }
.pg-pick button.on { background: var(--pg-acc); color: #1b1f27; border-color: var(--pg-acc); font-weight: 700; }
.pg-pick button:focus-visible, .as-win [role=button]:focus-visible, .as-win button:focus-visible { outline: 2px solid var(--pg-acc); outline-offset: 1px; }
.pg-pick small { color: var(--pg-mut); align-self: center; margin-left: 6px; }
.pg-stage { overflow-x: auto; }
.pg-notes { max-width: 1040px; margin: 18px auto 0; color: var(--pg-mut); }
.pg-notes h2 { font: 700 15px Georgia, serif; color: var(--pg-ink); margin: 0 0 6px; }
.pg-notes ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; }
.pg-notes b { color: var(--pg-ink); }
/* Foundry's window chrome (Foundry's own CSS isn't here: a small stand-in) */
.as-win { width: min(var(--w), 100%); min-width: 560px; margin: 0 auto; border-radius: 6px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,.55); font: 13px/1.4 Signika, "Segoe UI", system-ui, sans-serif; display: block; position: static; }
.as-win[hidden] { display: none; }
.as-win .window-header { background: #0b0a13; color: #efe6d8; padding: 8px 12px; display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; }
.as-win .window-content { display: block; overflow: visible; }
.as-win input, .as-win select, .as-win textarea, .as-win button { font: inherit; }
.as-win .sk .head { display: flex; align-items: center; }
.as-win .sk .head .name { flex: 1; background: transparent; border: 0; border-bottom: 1px solid transparent; color: #fff; font: 700 20px Georgia, serif; }
.as-win nav.tabs { display: flex; align-items: center; }
.as-win .tab { padding: 10px 14px 16px; }
.as-win code { padding: 0 3px; border-radius: 3px; }
`;
// The new pieces. Written for the build as additions to system.css (their own block), in the fr- pieces' vocabulary.
const ASCSS = `
.as-win .fr-tab h4.as-h4 { margin: 14px 0 6px; font: 700 13px Georgia, serif; color: var(--sk-acc); display: flex; gap: 8px; align-items: baseline; border-bottom: 1px dotted var(--sk-line); padding-bottom: 3px; }
.as-win .fr-tab h4 small, .as-win .fr-tab .as-h4 small { font: 400 11px Signika, sans-serif; color: var(--sk-mut); }
.as-win .as-traits { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.as-win .as-range { font-size: 11px; color: var(--sk-mut); margin-left: 6px; }
.as-win .as-auto { display: inline-flex; gap: 6px; align-items: baseline; padding: 3px 8px; border: 1px dashed var(--sk-line); border-radius: 4px; background: rgba(30,36,48,.04); font-weight: 600; }
.as-win .as-auto small { font-weight: 400; color: var(--sk-mut); }
.as-win .as-more { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px dotted var(--sk-line); }
.as-win .as-link { color: var(--sk-acc); cursor: pointer; font-size: 12px; }
.as-win .as-prev { margin: 0 0 10px; border: 1px solid var(--sk-line); border-radius: 5px; background: var(--sk-panel); }
.as-win .as-prev > summary { cursor: pointer; padding: 6px 10px; font-weight: 700; color: var(--sk-acc); }
.as-win .as-card { padding: 0 10px 10px; }
.as-win .as-card .acard { max-width: 520px; margin: 0 auto; }
.as-win .as-chipbtn { border-bottom: 1px dotted currentColor; font-weight: 600; }
.as-win .as-vtabs { display: flex; flex-wrap: wrap; gap: 4px; align-items: stretch; border-bottom: 2px solid var(--sk-navy); margin-bottom: 10px; }
.as-win .sk .as-vtab { display: flex; flex-direction: column; align-items: flex-start; padding: 5px 12px; border: 1px solid var(--sk-line); border-bottom: 0; border-radius: 5px 5px 0 0; background: #fff; font-weight: 700; cursor: pointer; }
.as-win .sk .as-vtab small { font: 400 11px ui-monospace, Consolas, monospace; color: var(--sk-mut); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.as-win.application.twod12-styled .sk button.as-vtab.on { background: var(--sk-navy); color: #fff; border-color: var(--sk-navy); }
.as-win.application.twod12-styled .sk button.as-vtab.on small { color: #c9d2e2; }
.as-win .sk .as-vtab.add { font-weight: 400; color: var(--sk-acc); border-style: dashed; justify-content: center; }
.as-win .as-vtools { margin-left: auto; display: inline-flex; gap: 4px; align-self: center; }
.as-win .sk .as-vtools button { font-size: 11px; padding: 2px 8px; }
.as-win .as-tiers { display: grid; gap: 4px; margin: 8px 0 4px; }
.as-win .as-tier { display: grid; grid-template-columns: 64px 1fr; gap: 8px; align-items: start; padding: 6px 8px; border: 1px solid var(--sk-line); border-left: 4px solid var(--tc); border-radius: 4px; background: #fff; }
.as-win .as-tier.t1, .as-win .as-mt.t1 { --tc: #8c2f28; } .as-win .as-tier.t2, .as-win .as-mt.t2 { --tc: #8a6a14; } .as-win .as-tier.t3, .as-win .as-mt.t3 { --tc: #2f6b3a; } .as-win .as-tier.crit, .as-win .as-mt.crit { --tc: #b8891f; }
.as-win .as-tl { font: 700 13px Georgia, serif; color: var(--tc); padding-top: 4px; }
.as-win .as-tb { display: grid; gap: 4px; min-width: 0; }
.as-win .fr-tab .fr-in.as-dmg { font-family: ui-monospace, Consolas, monospace; font-weight: 600; width: 100%; }
.as-win .fr-tab .fr-in.as-tx, .as-win .fr-tab .fr-in.wide { width: 100%; }
.as-win .as-under { display: flex; flex-wrap: wrap; gap: 4px; }
.as-win .as-dc { font-size: 11px; padding: 1px 6px; border-radius: 9px; background: #eef0f4; border: 1px solid #c9ced8; white-space: nowrap; }
.as-win .as-dc.v { background: #f6e4e1; border-color: #d9aaa4; } .as-win .as-dc.r { background: #e3ebf7; border-color: #a9bbd9; }
.as-win .as-dc small { color: var(--sk-mut); }
.as-win .as-empty { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 6px; }
.as-win .sk button.as-fill { border-color: var(--sk-acc); color: var(--sk-acc); font-weight: 600; padding: 3px 10px; }
.as-win .as-n { font: 700 11px Georgia, serif; color: var(--sk-mut); width: 12px; text-align: right; }
.as-win .as-on { display: inline-flex; gap: 3px; }
.as-win .sk button.as-onb { padding: 2px 9px; border-radius: 10px; font-size: 12px; color: var(--sk-mut); }
.as-win .sk button.as-onb.on { color: #fff; font-weight: 700; border-color: transparent; }
.as-win .sk button.as-onb.t1.on { background: #8c2f28; } .as-win .sk button.as-onb.t2.on { background: #8a6a14; } .as-win .sk button.as-onb.t3.on { background: #2f6b3a; } .as-win .sk button.as-onb.crit.on { background: #b8891f; }
.as-win .as-bt { display: inline-flex; gap: 4px; align-items: center; margin-left: 8px; font-size: 12px; font-weight: 700; } .as-win .as-bt.t1 { color: #8c2f28; } .as-win .as-bt.t2 { color: #8a6a14; } .as-win .as-bt.t3 { color: #2f6b3a; }
.as-win .as-stages { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 420px; gap: 6px; }
.as-win .sk .as-stages label { display: grid; gap: 2px; font-size: 12px; font-weight: 700; color: var(--sk-ink); }
.as-win .as-stages small { font-weight: 400; color: var(--sk-mut); margin-left: 5px; }
.as-win .fr-tab .as-stages .fr-in { width: 100%; font-family: ui-monospace, Consolas, monospace; }
.as-win .as-rules .fr-tab { padding: 0; }
.as-win .fr-tab .fr-kind.k-ap { background: var(--sk-navy); color: #fff; }
.as-win .as-grp { font: 700 11px Signika, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--sk-mut); padding: 8px 8px 2px; }
.as-win .fr-tab .fr-it.as-child { margin-left: 16px; }
.as-win .fr-tab .fr-it.as-off { opacity: .55; }
.as-win .fr-tab .fr-it .fr-itxt { min-width: 0; overflow: hidden; }
.as-win .sk table.as-matrix thead th .fr-step .v { color: var(--sk-ink); }
.as-win .sk table.as-matrix .fr-in.as-dmg { font-size: 11.5px; padding-left: 4px; padding-right: 2px; }
.as-win .fr-tab .fr-it .fr-m { display: block; font-style: normal; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.as-win .as-B .fr-md.as-bmd { grid-template-columns: 250px 1fr; }
.as-win .as-B .fr-adds { display: flex; gap: 6px; flex-wrap: wrap; }
.as-win .fr-tab .fr-pane h4 { display: flex; align-items: center; gap: 8px; }
/* C */
.as-win .as-cols { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 16px; align-items: start; }
.as-win .as-right { position: sticky; top: 8px; }
.as-win .as-live { font: 700 11px Signika, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--sk-mut); margin-bottom: 4px; }
.as-win .as-right .as-card { padding: 0; }
.as-win .as-rnote { margin-top: 6px; font-size: 11px; }
.as-win .as-strip { display: grid; gap: 7px; }
.as-win .as-sline { display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; }
.as-win .as-sline .fr-in.wide { flex: 1 1 200px; }
.as-win .as-sline .fr-in { flex: 1 1 110px; min-width: 0; }
.as-win .as-mwrap { overflow-x: auto; }
.as-win .sk table.as-matrix { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; margin: 0; background: none; border: 0; }
.as-win .sk table.as-matrix th, .as-win .sk table.as-matrix td { border: 0; border-bottom: 1px solid var(--sk-line); border-left: 1px solid var(--sk-line); padding: 6px; vertical-align: top; text-align: left; background: #fff; color: var(--sk-ink); }
.as-win .sk table.as-matrix thead th { background: var(--sk-navy); color: #fff; border-color: var(--sk-navy); white-space: nowrap; }
.as-win .sk table.as-matrix thead th .as-capv { display: inline-flex; gap: 6px; align-items: center; }
.as-win .sk table.as-matrix thead th .as-vtools { float: right; }
.as-win .sk table.as-matrix thead th:first-child, .as-win .sk table.as-matrix tbody th { width: 76px; background: var(--sk-panel); color: var(--sk-ink); font: 700 12px Georgia, serif; border-left: 0; }
.as-win .sk table.as-matrix tbody tr.as-mt th { border-left: 4px solid var(--tc); color: var(--tc); }
.as-win .sk table.as-matrix th.as-addcol { width: 84px; background: transparent; border: 0; }
.as-win .sk table.as-matrix th.as-addcol button { color: var(--sk-acc); border-style: dashed; font-size: 12px; }
.as-win .sk table.as-matrix td.as-same { background: #f3f1ea; }
.as-win .sk table.as-matrix td.as-same > :not(.as-eq) { opacity: .45; }
.as-win .as-eq { display: inline-block; margin-top: 3px; font-size: 10.5px; font-weight: 700; color: var(--sk-mut); border: 1px solid var(--sk-line); border-radius: 9px; padding: 0 6px; background: #fff; }
.as-win .sk table.as-matrix td > * + * { margin-top: 4px; }
.as-win .sk table.as-matrix tr.as-flow th { color: var(--sk-acc); }
.as-win .as-cstep { display: flex; gap: 6px; align-items: center; padding: 4px 6px; border: 1px solid var(--sk-line); border-radius: 4px; cursor: pointer; background: #fff; }
.as-win .as-cstep.on { border-color: var(--sk-acc); box-shadow: inset 3px 0 0 var(--sk-acc); }
.as-win .as-cstep em { display: block; font-style: normal; font-size: 11px; }
.as-win .fr-tab .fr-drop.as-sm { padding: 4px 6px; font-size: 11px; }
.as-win .fr-tab .fr-dropped { margin-bottom: 4px; }
.as-win .as-cpane { margin-top: 10px; }
.as-win .as-cadd .fr-sel { width: 100%; }
@media (max-width: 900px) { .as-win .as-cols { grid-template-columns: 1fr; } .as-win .as-right { position: static; } }
`;
const JS = `
document.querySelectorAll(".pg-pick button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".pg-pick button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  document.querySelectorAll(".as-win").forEach(w => { w.hidden = w.dataset.card !== b.dataset.card; });
}));
document.querySelectorAll(".as-win").forEach(w => {
  const pick = (btns, panes, key) => btns.forEach(b => b.addEventListener("click", () => { const scope = b.closest(".fr-sec, .as-after, .as-bmd") ?? w; btns.forEach(x => { if (scope.contains(x)) x.classList.toggle("on", x === b); }); panes.forEach(p => { if (scope.contains(p)) p.hidden = p.dataset[key] !== b.dataset[key]; }); }));
  pick([...w.querySelectorAll(".as-vtab[data-v]")], [...w.querySelectorAll(".as-vbody")], "v");
  w.querySelectorAll(".as-vtab[data-v]").forEach(b => b.addEventListener("click", () => w.querySelectorAll(".as-rail").forEach(r => { r.hidden = r.dataset.v !== b.dataset.v; })));
  w.querySelectorAll("a.as-ev").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); const t = w.querySelector(a.getAttribute("href").replace(/^#/, "#").replace(/([^#\w-])/g, "\\$1")) ?? [...w.querySelectorAll(".as-vbody:not([hidden]) h4.as-h4, .as-vbody:not([hidden]) .as-tiers")].find(x => (a.dataset.to === "tiers" && x.classList.contains("as-tiers")) || (a.dataset.to === "after" && /After the damage/.test(x.textContent)) || (a.dataset.to === "use" && /^On /.test(x.textContent))); w.querySelectorAll("a.as-ev").forEach(x => x.classList.toggle("on", x === a)); t?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  pick([...w.querySelectorAll(".as-bmd > .fr-lst > .fr-it")], [...w.querySelectorAll(".as-bpane")], "i");
  w.querySelectorAll(".as-after").forEach(a => { const its = [...a.querySelectorAll(".as-step")], ps = [...a.querySelectorAll(".as-steppane")]; its.forEach(b => b.addEventListener("click", () => { its.forEach(x => x.classList.toggle("on", x === b)); ps.forEach(p => { p.hidden = p.dataset.step !== b.dataset.step; }); })); });
  w.querySelectorAll(".fr-q").forEach(q => q.addEventListener("click", () => { w.querySelectorAll(".fr-tab").forEach(t => t.classList.toggle("fr-helpon")); q.classList.toggle("on"); }));
  w.querySelectorAll(".fr-tog").forEach(t => t.addEventListener("click", () => { t.classList.toggle("on"); const p = t.parentElement.parentElement; if (p.classList.contains("fr-part") && t.parentElement.tagName === "HEADER") p.classList.toggle("off"); }));
  w.querySelectorAll(".fr-seg").forEach(s => s.querySelectorAll("button").forEach(b => b.addEventListener("click", () => s.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)))));
  w.querySelectorAll(".as-onb").forEach(b => b.addEventListener("click", () => b.classList.toggle("on")));
  w.querySelectorAll(".fr-step").forEach(s => { const v = s.querySelector(".v"); if (!v) return; const [a, b] = s.querySelectorAll("button"); a.addEventListener("click", () => { v.textContent = Math.max(0, (parseInt(v.textContent) || 0) - 1); }); b.addEventListener("click", () => { v.textContent = (parseInt(v.textContent) || 0) + 1; }); });
});
`;
const LAY = {
  A: { fn: layoutA, title: "Action Sheet A", name: "One page, in the card's order", blurb: "One scrolling page at the Effect window's width. The card's lines first, then when and where, then one tab per Version with its Tiers, the Effects it applies and its After-the-damage steps.",
    notes: ["<b>Read top to bottom like the card.</b> Nothing is in a second window: the Versions window and its Damage Instance dialog are gone.", "<b>One Version on screen at a time</b> (a tab per AP cost). Comparing 1, 2 and 3 AP means switching tabs.", "<b>After the damage</b> is a numbered list with the selected step's pane beside it, inside the Version.", "The page gets long on a card with a chain and rules (Smite 3 AP: about three screens)."] },
  B: { fn: layoutB, title: "Action Sheet B", name: "A list and a pane", blurb: "The Effect window's own shape: every part of the Action is a row in the list on the left (the card, the Reaction, the Area, each Version, each Effect it applies, each step, each rule); the pane on the right edits the selected row, with its sentence on top.",
    notes: ["<b>The same shape as the Effect sheet</b>: one list, one pane, kind tiles, the sentence. The code and the habit are shared.", "<b>The whole Action fits in the list</b>: you see at a glance that Smite 3 AP has a light, a Guard and a Push.", "<b>Only one part is open at a time</b>: the Tiers of a Version and its steps are never on screen together; more clicks to fill a new card.", "The list is long for a card with many Versions (Smite: 11 rows)."] },
  C: { fn: layoutC, title: "Action Sheet C", name: "Versions side by side, the card beside them", blurb: "A wide window. The Versions are the columns of one table (Tiers, Critical, Effects, Area, the Effects applied, After the damage), so what changes with the AP cost shows at once; the real card stays in view on the right and redraws as you edit.",
    notes: ["<b>1, 2 and 3 AP side by side</b>: a grey cell repeats the Version to its left, so only the differences are written.", "<b>The card is always visible</b> (the Generate Action window's live preview, kept).", "<b>Needs width</b>: 1040 px; under 900 px the card drops below. Four or five Versions scroll sideways.", "A single-Version card (Rebuke, Covering Fire) leaves the table mostly empty; the step's pane sits under the table, not next to its cell."] }
};

/* ================================================================ A2: A, with the order of events on its left (Lucas, 2026-11-11) */
function events(m, v) {
  const ev = [], add = (tile, cls, title, sub, to, o = {}) => ev.push({ tile, cls, title, sub, to, ...o });
  if (m.reaction) add("R", "esc", cap(m.rkind === "interrupt" ? "Interrupt" : "Trigger"), (TWOD12.moments[m.moment] ?? "by hand").replace(" within N", ` within ${m.distance || m.momentRange}`), "when");
  else add("T", "rule", "On your turn", m.freq === "none" ? "" : `${TWOD12.frequencies[m.freq]}: once a ${m.freq === "atwill" ? "turn or more" : m.freq}`, "card");
  add(String(v.ap), "ap", `Pay ${v.ap} AP${m.reaction ? " (R)" : ""}`, m.esc ? `and Escalation ${m.esc}` : "", "vers");
  if (m.area.on) add("A", "au", "Place the area", `${v.areaSize || m.area.size} ${cap(m.area.shape)}${m.area.withinRange ? `, the weapon's ${m.area.withinRange} range` : m.area.within ? `, within ${m.area.within} sq.` : ", around you"}`, "when");
  else add("◎", "rule", m.targets || "A target", m.marks ? "it becomes your mark" : m.distance ? `Distance: ${m.distance}` : "", "card");
  if (!v.noTiers) add("2d", "bb", m.save ? "The target's Save" : "Your roll", m.save ? `${cap(m.vs)} Save: a Tier for each target` : `Vs. ${m.weapon ? "AD" : m.vs ? cap(m.vs) : "DC 13"}: Tier 1, 2 or 3`, "tiers");
  for (const x of v.onUse) add("E", "cond", x.name, v.noTiers ? "on use" : "on a Tier 2 or 3", "use");
  if (!v.noTiers) add("D", "tk", "The damage", v.tiers.map(t => t.dmg || "none").join(" / "), "tiers", { mono: true });
  v.after.forEach((r, i) => { const [t, c] = KIND[r.kind] ?? ["?", "rule"]; add(t, c, r.label, `${onShort(r.on)} · ${r.who.replace(/ \(a pick\)|, one by one/g, "")}`, "after", { after: i === 0 }); });
  return ev;
}
function rail(m, v, vi, hidden) {
  const ev = events(m, v);
  return `<ol class="as-rail" data-v="${vi}"${hidden ? " hidden" : ""}>${ev.map((e, i) => `${e.after ? `<li class="as-evsep">after the damage lands</li>` : ""}<li><a class="as-ev" href="#${m.name.replace(/\W/g, "")}-${e.to}" data-to="${e.to}"><span class="as-evn">${i + 1}</span><span class="fr-kind k-${e.cls}">${e.tile}</span><span class="as-evt"><b>${esc(e.title)}</b>${e.sub ? `<em class="${e.mono ? "mono" : ""}">${esc(e.sub)}</em>` : ""}</span></a></li>`).join("")}<li><button type="button" class="as-evadd">+ a step after the damage</button></li></ol>`;
}
function layoutA2(n) {
  const m = cards[n].m, id = k => `${m.name.replace(/\W/g, "")}-${k}`, last = m.versions.length - 1;
  const vb = (v, i) => { let h = versionBody(v, i, m); h = h.replace('<div class="as-tiers">', `<div class="as-tiers" id="${i === last ? id("tiers") : ""}">`).replace(/<h4 class="as-h4">(On use|On a Tier 2 or 3)/, `<h4 class="as-h4" id="${i === last ? id("use") : ""}">$1`).replace('<h4 class="as-h4">After the damage', `<h4 class="as-h4" id="${i === last ? id("after") : ""}">After the damage`); return h; };
  const always = m.name === "Mark Quarry" ? `<div class="as-always"><span class="as-railh">Always, while you have it</span>${MQ_RULES.map(r => { const k = R.RULE_KINDS[r.kind]; return `<a class="as-ev" href="#${id("rules")}"><span class="fr-kind k-${k.cls}">${k.tile}</span><span class="as-evt"><b>${esc(R.ruleLabel(r, { names: {}, host: "feature" }))}</b></span></a>`; }).join("")}</div>` : "";
  const body = `<div class="fr-tab as-A as-A2"><div class="as-flowcols"><aside class="as-flow"><span class="as-railh">Order of events <small>the ${m.versions.length > 1 ? "selected " : ""}Version</small></span>${m.versions.map((v, i) => rail(m, v, i, i !== last)).join("")}${always}</aside><div class="as-page">
    ${preview(n)}
    <div id="${id("card")}">${sec("The card", "its lines, in the order players read them", grid(cardRows(m)) + cardMore(m))}</div>
    <div id="${id("when")}">${sec("When and where", "", `<div class="fr-endlist">${part(m.reaction, "A Reaction", reactionSum(m), reactionBody(m))}${part(m.area.on, "An Area", areaSum(m), areaBody(m))}</div>`)}</div>
    <div id="${id("vers")}">${sec("Versions", `${m.versions.length} · one tab per AP cost`, `${vtabs(m, `<span class="as-vtools"><button type="button">Duplicate</button><button type="button">Delete</button></span>`)}${m.versions.map((v, i) => `<div class="as-vbody" data-v="${i}"${i === last ? "" : " hidden"}>${vb(v, i)}</div>`).join("")}`)}</div>
    <div id="${id("rules")}">${rulesSec(m)}</div>
    ${autoSec(m)}
  </div></div></div>`;
  return win(m, body, 900);
}

/* ================================================================ Generate Action: three mockups (Lucas, 2026-11-11) */
const gwin = (key, title, sub, body, foot, w, hidden) => `<div ${hidden ? "hidden " : ""}class="application twod12 twod12-styled sheet as-win ga-win" style="--w:${w}px" data-card="${key}"><header class="window-header"><span>${esc(title)}</span><span class="wh-x">✕</span></header><section class="window-content"><div class="twod12 sheet item sk"><header class="head ga-head"><span class="ga-ico">✦</span><div><b>${esc(title)}</b><small>${sub}</small></div></header><section class="tab active"><div class="fr-tab ga">${body}</div></section><footer class="ga-foot">${foot}</footer></div></section></div>`;
const gfoot = (what, alt = "Create in the world") => `<span class="fr-m">Nothing is created until you click.</span><button type="button">Cancel</button><button type="button">${alt}</button><button type="button" class="ga-go">${what}</button>`;
const okLine = (t, cls = "ok") => `<li class="${cls}"><span>${cls === "ok" ? "✓" : cls === "step" ? "→" : "?"}</span><div>${t}</div></li>`;
const stepsOf = v => v.after.map(r => okLine(`<b>${esc(r.label)}</b> after the damage · ${onShort(r.on)} · ${esc(r.who.replace(/ \(a pick\)|, one by one/g, ""))}`, "step")).join("");
function genForm() {   // G1: the form, in the sheet's pieces (Smite)
  const m = cards.Smite.m, v = m.versions[2];
  const left = `${grid([["Name", text(m.name, "Grave Chill", "wide")], ["Traits", traitsRow(m.traits)], ["Frequency", seg(m.freq, FREQ, "w")], ["Used", seg("turn", [["turn", "On your turn"], ["int", "A Reaction: Interrupt"], ["trg", "A Reaction: Trigger"]], "w")], ["Target", text(m.targets, "One creature", "wide")], ["Distance", text(m.distance, "5 sq., weapon, self")]])}
    ${vtabs(m)}
    ${grid([["Cost", `${step(v.ap)} <span class="fr-m">AP</span>`]])}
    <div class="as-tiers">${v.tiers.map((t, i) => `<div class="as-tier ${TIERC[i]}"><span class="as-tl">Tier ${i + 1}</span><div class="as-tb">${text(t.dmg + (t.text ? `; ${t.text}` : ""), "[V] 2d8 Co; Hindered (EoT)", "as-dmg")}${dmgChips(t.dmg)}</div></div>`).join("")}<div class="as-tier crit"><span class="as-tl">Critical</span><div class="as-tb">${text(v.critical, "Immobilized (EoT)", "wide as-tx")}</div></div></div>
    ${grid([["Effects", area(v.effects, "Effects (Tier 2+): write them as the card does", 4)]])}
    ${help("Write it like the card: <code>[V] 1d8 Co</code> is 1d8 Cold to Vigor, <code>1[W]</code> the weapon's damage, <code>[Mod]</code> the Modifier, <code>[R] 2d6 Ho</code> Resolve, Holy; then <code>;</code> and an effect (<code>Hindered (EoT)</code>, <code>Pushed 2</code>).")}`;
  const right = `<div class="as-live">The card, live</div><div class="as-card">${cards.Smite.card}</div>
    <div class="ga-read"><h4>Understood <small>3 AP</small></h4><ul>${okLine("3 Tiers: the weapon's damage to Vigor, Holy damage to Resolve")}${okLine("Bright light in a 2 Emanation, 1 round <em>needs an Effect: drop one on the sheet, or <a class=\"as-link\">create \"Smite (Bright light 2)\"</a></em>")}${stepsOf(v)}</ul>
    <h4 class="no">Kept as plain text</h4><ul>${okLine("\"takes 1 Bane when they try to Hide\" (Hide isn't written)", "no")}</ul></div>`;
  return gwin("form", "Generate Action", "the fields, written like the card", `<div class="ga-cols"><div>${left}</div><aside>${right}</aside></div>`, gfoot("Fill Smite"), 980, false);
}
const BOOK = `Rebuke                         Divine Power 1 · Turn · 1R
[Power] [Save] [Divine]
Trigger: An enemy within 5 squares makes a [Strike] Action against an ally.
Targets: The triggering creature
Distance: 5 sq. · Vs. Appeal Save
Tier 1: [R] 1d8 Ho; Pushed 2, and Frightened of you for 1 round.
Tier 2: [R] 1d6 Ho; Pushed 1.
Tier 3: No effect.
Strike my friends, and feel why you should not have.`;
function genPaste() {   // G2: paste the card's text (Rebuke)
  const m = cards.Rebuke.m, v = m.versions[0], marks = ["ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok"];
  const left = `<div class="ga-paste" role="textbox" aria-label="The card's text" tabindex="0">${BOOK.split("\n").map((l, i) => `<div class="ga-line"><span class="ga-mark ${marks[i]}">${marks[i] === "ok" ? "✓" : "?"}</span><span>${esc(l)}</span></div>`).join("")}</div>
    ${help("Paste or type the card as the book prints it: the name line, the traits, <code>Trigger:</code>, <code>Targets:</code>, <code>Distance:</code>, a line per Tier, <code>Critical:</code>, <code>Effects:</code>, the Flavor last. A ✓ line was read; a ? line is kept as plain text.")}
    <div class="ga-read"><h4>What was read</h4><ul>
      ${okLine(`<b>Rebuke</b> · Divine Power 1 · ${traitsRow(m.traits).replace(/<select[\s\S]*?<\/select>/, "").replace(/<button[^>]*>×<\/button>/g, "")}`)}
      ${okLine("A <b>Reaction</b>, a Trigger, 1 AP (R), once a Turn · the moment: <b>a Strike is made against an ally</b>, within its Distance (5 sq.), used on the one that caused it")}
      ${okLine("The target rolls an <b>Appeal Save</b>; Tier 1: 1d8 Holy to Resolve, Tier 2: 1d6 Holy to Resolve, Tier 3: no effect")}
      ${stepsOf(v)}
    </ul></div>`;
  const right = `<div class="as-live">The card it makes</div><div class="as-card">${cards.Rebuke.card}</div>`;
  return gwin("paste", "Generate Action", "paste the card's text", `<div class="ga-cols"><div>${left}</div><aside>${right}</aside></div>`, gfoot("Create Rebuke", "Open it in the sheet first"), 980, true);
}
function genShape() {   // G3: start from a shape (Covering Fire: the Action and its Zone Effect together)
  const m = cards["Covering Fire"].m, blank = (v, w = 3) => `<input type="text" class="fr-in ga-blank" style="width:${w}em" value="${esc(v)}" aria-label="value">`;
  const shapes = [["A Strike", "a roll, damage by Tier"], ["A Save", "the target rolls"], ["A Reaction", "a moment, then one of the others"], ["An area", "everyone in it, once"], ["A Zone", "an area that stays"], ["On you", "an Effect on you"], ["A heal", "Rally or dice"]];
  const left = `<div class="ga-shapes" role="group" aria-label="Start from">${shapes.map(([t, s]) => `<button type="button" class="ga-shape${t === "A Zone" ? " on" : ""}" aria-pressed="${t === "A Zone"}"><b>${t}</b><small>${s}</small></button>`).join("")}</div>
    ${grid([["Name", text(m.name, "", "wide")], ["Traits", traitsRow(m.traits)], ["Frequency", seg(m.freq, FREQ, "w")], ["Cost", `${step(2)} <span class="fr-m">AP</span>`]])}
    <div class="ga-sent"><p>Place a ${blank(2, 2)} ${sel("emanation", [["emanation", "Emanation"], ["burst", "Burst"], ["line", "Line"]])} within ${sel("normal", [["normal", "your weapon's normal range"], ["sq", "N squares"], ["self", "around you"]])}. It stays ${blank(3, 2)} rounds.</p>
      <p>Inside it, ${sel("enemies", [["enemies", "enemies"], ["allies", "allies"], ["all", "everyone"]])} have ${blank(1, 2)} ${sel("b", [["b", "Bane"], ["o", "Boon"]])} on ${tchip("strike")} Actions <a class="as-link">change</a>,</p>
      <p>and ${sel("allies", [["allies", "allies"], ["enemies", "enemies"], ["all", "everyone"]])} have ${sel("def", [["def", "+ Defense"], ["spd", "+ Speed"], ["heal", "a heal each turn"], ["ht", "damage (a Hazard)"]])} ${blank("+1", 2)}. <a class="as-link">+ another line</a></p></div>
    ${help("A shape asks only for what it needs, as a sentence. A Zone makes the Action and its Effect together; every blank is a field on their sheets afterwards.")}
    <div class="ga-read"><h4>It will create</h4><ul>${okLine("the Action <b>Covering Fire</b>: 2 AP, Encounter, a 2 Emanation within the weapon's normal range, kept 3 rounds")}${okLine("the Effect <b>Covering Fire</b>, on the map (a Zone): enemies inside carry <b>Covering Fire (1 Bane)</b>, allies inside carry <b>Covering Fire (+1 Defense)</b>")}${okLine("the two carried Effects, each with one rule")}</ul></div>`;
  const right = `<div class="as-live">The card it makes</div><div class="as-card">${cards["Covering Fire"].card}</div>`;
  return gwin("shape", "Generate Action", "start from a shape", `<div class="ga-cols"><div>${left}</div><aside>${right}</aside></div>`, gfoot("Create Covering Fire and its 3 Effects"), 980, true);
}
const GACSS = `
.as-win .as-flowcols { display: grid; grid-template-columns: 208px minmax(0, 1fr); gap: 14px; align-items: start; }
.as-win .as-flow { position: sticky; top: 8px; background: var(--sk-panel); border: 1px solid var(--sk-line); border-radius: 5px; padding: 8px 8px 10px; }
.as-win .as-railh { display: block; font: 700 11px Signika, sans-serif; letter-spacing: .07em; text-transform: uppercase; color: var(--sk-acc); margin-bottom: 6px; }
.as-win .as-railh small { display: block; letter-spacing: 0; text-transform: none; font-weight: 400; color: var(--sk-mut); }
.as-win ol.as-rail { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; position: relative; }
.as-win ol.as-rail[hidden] { display: none; }
.as-win ol.as-rail::before { content: ""; position: absolute; left: 30px; top: 12px; bottom: 34px; width: 2px; background: var(--sk-line); }
.as-win .sk a.as-ev { position: relative; display: grid; grid-template-columns: 12px 22px minmax(0, 1fr); gap: 6px; align-items: start; padding: 4px 4px; border-radius: 4px; color: var(--sk-ink); text-decoration: none; cursor: pointer; }
.as-win .sk a.as-ev:hover, .as-win .sk a.as-ev.on { background: #fff; box-shadow: inset 3px 0 0 var(--sk-acc); }
.as-win .as-always a.as-ev { grid-template-columns: 22px minmax(0, 1fr); }
.as-win .as-evn { font: 700 10px Georgia, serif; color: var(--sk-mut); padding-top: 4px; text-align: right; }
.as-win .as-evt b { display: block; font-size: 12.5px; line-height: 1.25; }
.as-win .as-evt em { display: block; font-style: normal; font-size: 11px; color: var(--sk-mut); line-height: 1.25; overflow-wrap: anywhere; }
.as-win .as-evt em.mono { font-family: ui-monospace, Consolas, monospace; font-size: 10px; }
.as-win .as-evsep { font: 700 10px Signika, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--sk-acc); padding: 6px 0 2px 40px; background: var(--sk-panel); position: relative; }
.as-win .sk button.as-evadd { margin: 4px 0 0 40px; font-size: 11px; border-style: dashed; color: var(--sk-acc); position: relative; }
.as-win .as-always { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--sk-line); display: grid; gap: 2px; }
.as-win .as-page [id] { scroll-margin-top: 10px; }
@media (max-width: 760px) { .as-win .as-flowcols { grid-template-columns: 1fr; } .as-win .as-flow { position: static; } }
.ga-win .sk .head.ga-head { gap: 12px; color: #fff; }
.ga-win .ga-ico { width: 40px; height: 40px; border-radius: 5px; background: #26364d; display: grid; place-items: center; font-size: 20px; color: #f1e6c8; }
.ga-win .ga-head b { display: block; font: 700 19px Georgia, serif; } .ga-win .ga-head small { color: #c9d2e2; }
.ga-win .ga-cols { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 16px; align-items: start; }
.ga-win .ga-cols aside .as-card { padding: 0; }
.ga-win .ga-foot { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; align-items: center; padding: 10px 14px; border-top: 1px solid var(--sk-line); background: var(--sk-panel); }
.ga-win .ga-foot .fr-m { margin-right: auto; color: var(--sk-mut); font-size: 12px; }
.ga-win .sk .ga-foot button { padding: 5px 14px; }
.ga-win.application.twod12-styled .sk .ga-foot button.ga-go { background: var(--sk-acc); color: #fff; border-color: var(--sk-acc); font-weight: 700; }
.ga-win .ga-read { margin-top: 10px; border: 1px solid var(--sk-line); border-radius: 5px; background: #fff; padding: 8px 10px; }
.ga-win .fr-tab .ga-read h4 { margin: 0 0 4px; font: 700 12px Georgia, serif; color: #2f6b3a; display: block; } .ga-win .fr-tab .ga-read h4.no { color: #8a6a14; margin-top: 8px; }
.ga-win .ga-read ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.ga-win .ga-read li { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 6px; font-size: 12.5px; }
.ga-win .ga-read li > span { font-weight: 700; color: #2f6b3a; } .ga-win .ga-read li.no > span { color: #8a6a14; } .ga-win .ga-read li.step > span { color: var(--sk-acc); }
.ga-win .ga-read em { display: block; font-style: normal; color: var(--sk-mut); font-size: 11.5px; }
.ga-win .ga-read .as-traits { display: inline-flex; vertical-align: middle; }
.ga-win .ga-paste { background: #fff; border: 1px solid var(--sk-line); border-radius: 5px; padding: 8px 6px; font: 12.5px/1.55 ui-monospace, Consolas, monospace; min-height: 190px; overflow-x: auto; }
.ga-win .ga-line { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 6px; white-space: pre-wrap; }
.ga-win .ga-mark { font-weight: 700; color: #2f6b3a; text-align: center; } .ga-win .ga-mark.no { color: #8a6a14; }
.ga-win .ga-shapes { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; margin-bottom: 12px; }
.ga-win .sk button.ga-shape { display: grid; gap: 1px; text-align: left; padding: 6px 9px; cursor: pointer; }
.ga-win .sk button.ga-shape small { color: var(--sk-mut); font-size: 11px; }
.ga-win.application.twod12-styled .sk button.ga-shape.on { background: var(--sk-navy); color: #fff; border-color: var(--sk-navy); } .ga-win.application.twod12-styled .sk button.ga-shape.on small { color: #c9d2e2; }
.ga-win .ga-sent { margin: 12px 0 4px; padding: 10px 12px; background: #fff; border: 1px solid var(--sk-line); border-left: 4px solid var(--sk-acc); border-radius: 4px; font-size: 14px; line-height: 2.1; }
.ga-win .ga-sent p { margin: 0; }
.ga-win .fr-tab .ga-sent .fr-in.ga-blank { text-align: center; font-weight: 700; }
@media (max-width: 860px) { .ga-win .ga-cols { grid-template-columns: 1fr; } }
`;
const NAMES = Object.keys(cards);
LAY.A2 = { fn: layoutA2, title: "Action Sheet A2", name: "A, with the order of events", blurb: "Mockup A's page, and on its left the order of events of the selected Version: when it is used, what it costs, the target, the roll, the Effects it applies, the damage, each step after it. Click an event to jump to where it is edited.",
  notes: ["<b>A is unchanged on the right</b>: one page in the card's order, a tab per Version.", "<b>The order of events follows the Version's tab</b>: pick 3 AP and the rail shows its light, its damage, its Guard and its Push, in the order Foundry runs them.", "<b>Each event is a link</b> to its place on the page; a step can also be added from the rail (+ at the end).", "The window is 900 px wide (A is 680); under 760 px the rail folds to a strip above the page."] };
for (const [k, L] of Object.entries(LAY)) {
  const html = `<title>${L.title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Signika:wght@400;600;700&display=swap">
<style>${SYSCSS}</style>
<style>${PAGECSS}${ASCSS}${GACSS}</style>
<div class="pg-top"><h1>Mockup ${k}${k === "A2" ? "" : `: ${L.name}`}${k === "A2" ? `: ${L.name}` : ""}</h1><p>${L.blurb}</p></div>
<div class="pg-pick" role="group" aria-label="The card shown">${NAMES.map((n, i) => `<button type="button" id="pick-${i}" data-card="${esc(n)}" class="${i ? "" : "on"}" aria-pressed="${!i}">${esc(n)}</button>`).join("")}<small>four real cards from the compendium source · the ? on the tab bar shows the help texts · static: nothing is saved</small></div>
<div class="pg-stage">${NAMES.map((n, i) => L.fn(n).replace('class="application', `${i ? "hidden " : ""}class="application`)).join("\n")}</div>
<div class="pg-notes"><h2>What this layout does</h2><ul>${L.notes.map(x => `<li>${x}</li>`).join("")}</ul>
<h2 style="margin-top:12px">In all three</h2><ul><li><b>Stage 0 ready:</b> Escalation takes 1 to ${ESC_MAX} (a cost, or what an Apex needs); a by-Stage value has one field per Stage of the config's list (Stages ${STAGES[0].n} to ${STAGES.at(-1).n}); no Talent-only field (Prerequisites, "Modifies other Actions").</li><li><b>Built on the audit's defaults:</b> one "After the damage" list of steps (no chips to type, no second button in the Tier text), an Effect is applied on use (or with the Effects line, on a Tier 2 or 3) or is a step after the damage, the area's size and rounds on each Version, a Reaction's range = its Distance, rules on the Action (Mark Quarry), Automation at the bottom.</li></ul></div>
<script>${JS}</script>`;
  fs.writeFileSync(path.join(HERE, `action-sheet-${k}.html`), html);
  console.log(`action-sheet-${k}.html`, Math.round(html.length / 1024), "KB");
}

{
  const G = [["form", "G1: the form", "Smite"], ["paste", "G2: paste the card", "Rebuke"], ["shape", "G3: start from a shape", "Covering Fire"]];
  const html = `<title>Generate Action Mockups</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Signika:wght@400;600;700&display=swap">
<style>${SYSCSS}</style>
<style>${PAGECSS}${ASCSS}${GACSS}</style>
<div class="pg-top"><h1>Generate Action: three ways</h1><p>The Generate Action window in the system's style (no Foundry default window), next to the new Action sheet. Each one is shown filled with a real card and the card it makes.</p></div>
<div class="pg-pick" role="group" aria-label="The mockup shown">${G.map(([k, l, c], i) => `<button type="button" id="pick-${i}" data-card="${k}" class="${i ? "" : "on"}" aria-pressed="${!i}">${l} <span style="font-weight:400">(${c})</span></button>`).join("")}<small>static: nothing is saved</small></div>
<div class="pg-stage">${genForm()}${genPaste()}${genShape()}</div>
<div class="pg-notes"><h2>What each one is for</h2><ul>
<li><b>G1, the form.</b> Today's window, in the sheet's pieces: the same fields, each Tier written like the card. New: the "Understood" list also says which words become steps after the damage, and which Effect is missing. Good for an NPC's quick Action. Its fields repeat the new sheet's, so it adds the least.</li>
<li><b>G2, paste the card.</b> One text box: the card as the book prints it. Every line gets a ✓ or a ?, and the list under it says what was read (the Reaction's moment from the Trigger line, the Save, the steps). The fastest when the card is already written in <code>book/</code> or in your notes; it needs the most parsing code.</li>
<li><b>G3, start from a shape.</b> Pick what kind of Action it is and fill a sentence with blanks. A Zone or an "on you" Action also creates its Effects, which neither the form nor the sheet does in one go. Good for the shapes that need two or three items; each shape has to be written.</li>
</ul></div>
<script>${JS}</script>`;
  fs.writeFileSync(path.join(HERE, "generate-action.html"), html);
  console.log("generate-action.html", Math.round(html.length / 1024), "KB");
}
