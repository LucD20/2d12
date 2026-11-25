// "Create Button": builds an inline button (@Check / @Save / @Damage / @Move / @Template / @Condition / @Effect / @Guard / @Heal / @Reduce /
// @Rally / @Use) and copies its text or sends it to the chat.
// v0.0.356 (PACK ACTION-SHEET, session 2; Lucas's pick: mockup "B3 on top of B1", foundry/mockups/button-builder.html; the audit's section 7,
// D41 to D55): the system's own window (it was a Foundry default window), a box to write the buttons as a card would ("Pushed 2; Vulnerable 2
// (EoT)") on top of the kinds and their fields, a live look at the button and its text, and two ways out (Lucas): Copy the text, Send to chat.
// The window stays open for the next button. buildCommand, wordsToButtons, tierFromCard, commandProblem and cleanLabel are pure (the tests load them).
import { TWOD12 } from "./config.mjs";
import { convertEffects } from "./gen.mjs";
import { parseCardTier, humanize } from "./genaction.mjs";
import * as R from "./fxrules.mjs";
import { SYS_COLOR } from "./sysmsg.mjs";
import { cardHead, cardVars } from "./config.mjs";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/** v0.0.356 (D41): a label can't hold the chip's own marks: | cut it short and ] broke the button. */
export const cleanLabel = s => String(s ?? "").replace(/[|\[\]{}]/g, " ").replace(/\s+/g, " ").trim();
const POOLTAG = { B: "vigor", M: "resolve", C: "choice" };
const subWord = code => String(TWOD12.subtypes?.[code] ?? "").toLowerCase();
/** Damage Instances as a chip's damage list: "1d8[resolve,holy]". Returns { text, skipped } (the weapon's dice and [Mod] can't be on a loose button). */
function instsToChip(insts) {
  const out = [], skipped = [];
  for (const i of insts ?? []) {
    if (i.useW) skipped.push(`${i.wCount || 1}[W]`);
    if (i.useD) skipped.push(`${i.dCount || 1}[D]`);
    if (i.useAt && !i.dice) skipped.push("[Mod]");
    if (!i.dice) continue;
    const tags = [POOLTAG[i.pool] ?? "vigor", subWord(i.subtype)].filter(Boolean);
    out.push(`${/[+\-*/ ]/.test(i.dice) ? `(${i.dice})` : i.dice}[${tags.join(",")}]`);
  }
  return { text: out.join(","), skipped };
}
/** v0.0.356 (D42): a Save button's Tier written like the card ("[R] 1d8 Ho; Pushed 2") as the chip writes it ('1d8[resolve,holy], "Pushed 2"'). */
export function tierFromCard(text) {
  const t = String(text ?? "").trim();
  if (!t || /^(0|no effect\.?|none|-)$/i.test(t)) return { text: t ? "0" : "", skipped: [] };
  const p = parseCardTier(t), d = instsToChip(p.insts);
  const words = [p.text ? humanize(p.text) : "", ...p.plain.filter(x => !p.text?.includes(x))].filter(Boolean).join("; ");
  return { text: [d.text, words ? `"${words.replace(/"/g, "'")}"` : ""].filter(Boolean).join(", "), skipped: d.skipped };
}

export function buildCommand(d) {
  const num = (k, def = 0) => Number(d[k]) || def;
  const common = () => {
    const p = [];
    // v0.0.356 (D45): the DC as a choice: the card's (nothing written), 13 written, the user's Power / Weapon DC, a number. Without dcMode: as before.
    if (d.dcMode === "13") p.push("dc:13");
    else if (d.dcMode === "power" || d.dcMode === "weapon" || d.dcMode === "signature") p.push(`dc:@${d.dcMode}`);
    else if (d.dcMode === "set") p.push(`dc:${num("dc", 13)}`);
    else if (!d.dcMode && num("dc", 13) !== 13) p.push(`dc:${num("dc", 13)}`);
    if (num("adj")) p.push(`adj:${num("adj")}`);
    if (num("boon")) p.push(`boon:${num("boon")}`);
    if (num("bane")) p.push(`bane:${num("bane")}`);
    if (d.traits?.length) p.push(`traits:${d.traits.join(",")}`);
    return p;
  };
  const label = cleanLabel(d.label), lab = label ? [`label:${label}`] : [];
  if (d.type === "check") return `@Check[${[d.attr, ...common(), ...lab].join("|")}]`;
  if (d.type === "save") {
    const p = [d.attr, ...common()];
    for (const n of [1, 2, 3]) { const raw = (d[`t${n}`] ?? "").trim(), t = d.cardTiers ? tierFromCard(raw).text : raw; if (t) p.push(`t${n}:${t}`); }
    return `@Save[${[...p, ...lab].join("|")}]`;
  }
  if (d.type === "damage") {
    const inst = [];
    for (let i = 1; i <= Math.min(4, Number(d.drows) || 4); i++) {
      const f = (d[`f${i}`] ?? "").trim();
      if (!f) continue;
      const tags = [d[`p${i}`], d[`s${i}`], d[`n${i}`] ? "nonlethal" : ""].filter(Boolean);
      inst.push(f.includes(",") || /[+\-*/ ]/.test(f) ? `(${f})${tags.length ? `[${tags.join(",")}]` : ""}` : `${f}${tags.length ? `[${tags.join(",")}]` : ""}`);
    }
    return `@Damage[${[inst.join(","), ...(d.nlAll ? ["nonlethal"] : []), ...lab].join("|")}]`;
  }
  if (d.type === "rally") return `@Rally[${[Math.max(1, num("rn", 1)), ...lab].join("|")}]`;
  if (d.type === "move") {
    const p = [d.mkind || "pushed", `distance:${String(d.mdistance || "1").replace(/\s+/g, "")}`];
    if (d.mfrom) p.push(`from:${d.mfrom}`);   // v0.0.356 (D55): the options a Move has and the window didn't offer
    if (d.mpick) { p.push("pick:yes"); if (num("marea")) p.push(`area:${num("marea")}`); }
    if (d.mterrain) p.push("terrain:ignore");
    return `@Move[${[...p, ...lab].join("|")}]`;
  }
  if (d.type === "condition") {
    const p = [String(d.cname || "prone").trim().toLowerCase()];
    if (num("cvalue")) p.push(`value:${num("cvalue")}`);
    if (d.cdur === "eot") p.push("eot"); else if (d.cdur === "rounds") p.push(`rounds:${Math.max(1, num("crounds", 1))}`);
    return `@Condition[${[...p, ...lab].join("|")}]`;
  }
  if (d.type === "effect") return `@Effect[${d.fxUuid || ""}]${cleanLabel(d.label || d.fxName) ? `{${cleanLabel(d.label || d.fxName)}}` : ""}`;
  if (["guard", "heal", "reduce"].includes(d.type)) {
    const p = [String(d.aformula || "1d6").replace(/\s+/g, "").toLowerCase()];
    if (d.awho) p.push(`who:${d.awho}`);
    if (num("anear")) p.push(`near:${num("anear")}`);
    return `@${d.type[0].toUpperCase()}${d.type.slice(1)}[${[...p, ...lab].join("|")}]`;
  }
  if (d.type === "use") { const p = [cleanLabel(d.uname) || "Basic Attack"]; if (d.uap !== "" && d.uap != null) p.push(`ap:${Math.max(0, num("uap"))}`); return `@Use[${[...p, ...lab].join("|")}]`; }
  const p = [d.shape, `distance:${num("distance", 1)}`];
  if (d.targets && d.targets !== "all") p.push(`targets:${d.targets}`);
  if (d.self && d.shape !== "line") p.push("self:yes");   // v0.0.356 (D44): a Line has no creature it is around
  if (d.places) p.push("places:yes");
  if (d.expire === "eot") p.push("expire:eot");
  else if (num("rounds")) p.push(`rounds:${num("rounds")}`);
  if (d.difficult) p.push(`difficult:${(d.dtypes?.length ? d.dtypes : ["walk"]).join(",")}`);
  if (d.difficult && d.dfor && d.dfor !== "all") p.push(`difficultFor:${d.dfor}`);
  return `@Template[${[...p, ...lab].join("|")}]`;
}

/** v0.0.356 (D43): what a kind still needs before it can be a button ("" when it is ready). */
export function commandProblem(d) {
  const blank = v => !String(v ?? "").trim();
  if (d.type === "damage") return [1, 2, 3, 4].every(i => blank(d[`f${i}`])) ? "Write at least one damage (1d6+2)." : "";
  if (d.type === "move") return blank(d.mdistance) ? "Write the distance (2, or speed/2)." : "";
  if (d.type === "rally") return (Number(d.rn) || 0) < 1 ? "At least 1 Rally Point." : "";
  if (d.type === "template") return (Number(d.distance) || 0) < 1 ? "The area's size is at least 1." : "";
  if (d.type === "condition") return blank(d.cname) ? "Write the condition's name (prone, hindered, vulnerable)." : "";
  if (d.type === "effect") return blank(d.fxUuid) ? "Drop an Effect on the box." : "";
  if (["guard", "heal", "reduce"].includes(d.type)) return blank(d.aformula) ? "Write the amount (1d8+mod)." : "";
  if (d.type === "use") return blank(d.uname) ? "Write the Action's name." : "";
  return "";
}

/** Split at ; outside brackets and quotes. */
function pieces(text) {
  const out = []; let cur = "", depth = 0, q = false;
  for (const ch of String(text ?? "")) {
    if (ch === '"') q = !q;
    if (!q) { if ("[({".includes(ch)) depth++; else if ("])}".includes(ch)) depth = Math.max(0, depth - 1); }
    if ((ch === ";" || ch === "\n") && !q && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}
/**
 * v0.0.356 (D53, mockup B3): what was written, as buttons. Each piece (separated by ;): { words, cmd, ok }. Read: a Check or a Save with its DC
 * ("Appeal Save, DC 15", "Body Check"), damage written like the card ("[R] 2d6 Ho", "1d8 Fire"), and everything convertEffects knows ("Pushed 2",
 * "Vulnerable 2 (EoT)", "Evade 1", "uses 1 Rally Point", "2Emanation 1/round"). A piece that isn't read stays words (ok: false).
 */
export function wordsToButtons(text) {
  return pieces(text).map(words => {
    const roll = words.match(/^(body|mind|appeal|instinct)\s+(save|check)(?:\s*,?\s*(?:vs\.?\s*)?dc\s*(\d+))?$/i);
    if (roll) return { words, ok: true, cmd: `@${roll[2][0].toUpperCase()}${roll[2].slice(1).toLowerCase()}[${[roll[1].toLowerCase(), ...(roll[3] ? [`dc:${roll[3]}`] : [])].join("|")}]` };
    const rally = words.match(/^rally\s+(\d+)$/i);
    if (rally) return { words, ok: true, cmd: `@Rally[${Math.max(1, Number(rally[1]))}]` };
    const area = words.match(/^(\d+)\s+(emanation|burst)$|^(line)\s+(\d+)$/i);
    if (area) return { words, ok: true, cmd: `@Template[${(area[2] ?? area[3]).toLowerCase()}|distance:${area[1] ?? area[4]}]` };
    const p = parseCardTier(words);
    if (p.insts.length && !p.text && !p.plain.length) { const d = instsToChip(p.insts); if (d.text && !d.skipped.length) return { words, ok: true, cmd: `@Damage[${d.text}]` }; }
    const c = words.includes("@") ? words : convertEffects(words);
    const left = c.replace(/@\w+\[(?:[^\[\]]|\[[^\[\]]*\])*\](?:\{[^}]*\})?/g, "").replace(/[\s.,]+/g, " ").trim();
    if (c.includes("@") && left.split(" ").filter(Boolean).length <= 6) return { words, ok: true, cmd: c };
    return { words, ok: false, cmd: "" };
  });
}

/* ------------------------------------------------------------------ the window */
// v0.0.358 (Lucas: "the buttons need some organization"): four columns, three kinds a row, so no kind sits alone on a line
const KINDS = [["Rolls", [["check", "2d", "bb", "Check"], ["save", "S", "bb", "Save"], ["damage", "D", "tk", "Damage"]]], ["On the map", [["move", "M", "rule", "Move"], ["template", "A", "au", "Area"], ["use", "U", "rule", "Use an Action"]]],
  ["Gives", [["condition", "C", "cond", "Condition"], ["effect", "E", "cond", "Effect"], ["guard", "G", "wp", "Guard"]]], ["Heals", [["heal", "H", "au", "Heal"], ["reduce", "R", "esc", "Reduce"], ["rally", "RP", "esc", "Rally"]]]];
const QUICK = ["Body Check", "Instinct Save", "Pushed 1", "Evade 1", "Prone", "Hindered (EoT)", "Rally 1", "2 Emanation"];
const seg = (f, cur, opts, cls = "") => `<span class="fr-seg ${cls}">${opts.map(([v, l]) => `<button type="button" data-bb="set" data-f="${f}" data-v="${esc(v)}" class="${String(cur) === String(v) ? "on" : ""}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join("")}</span>`;
const step = (f, cur, min = 0, max = 9, cls = "") => `<span class="fr-step ${cls}"><button type="button" data-bb="step" data-f="${f}" data-d="-1" data-min="${min}" data-max="${max}" aria-label="Less">−</button><span class="v">${esc(cur)}</span><button type="button" data-bb="step" data-f="${f}" data-d="1" data-min="${min}" data-max="${max}" aria-label="More">+</button></span>`;
const tog = (f, on, label) => `<span class="fr-tog${on ? " on" : ""}" data-bb="tog" data-f="${f}" role="switch" aria-checked="${!!on}" tabindex="0"><span class="box"></span>${label}</span>`;
const text = (f, v, ph = "", cls = "") => `<input type="text" class="fr-in ${cls}" data-bb-in="${f}" value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(ph || f)}">`;
const sel = (f, cur, opts) => `<select class="fr-sel" data-bb-in="${f}" aria-label="${esc(f)}">${opts.map(([v, l]) => `<option value="${esc(v)}"${String(cur) === String(v) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
const grid = rows => `<div class="fr-pgrid">${rows.filter(Boolean).map(([l, c]) => `<span class="fr-pl">${l}</span><div class="fr-pc">${c}</div>`).join("")}</div>`;
const help = t => `<p class="fr-help">${t}</p>`;
const ATTR = () => Object.entries(TWOD12.attributes ?? {});
const SUBS = () => [["", "No subtype"], ...Object.entries(TWOD12.subtypes ?? {}).filter(([k]) => k).map(([k, v]) => [v.toLowerCase(), v])];
export const newBuilderState = () => ({ words: "", src: "fields", type: "check", attr: "body", dcMode: "card", dc: 13, adj: 0, boon: 0, bane: 0, traits: [], t1: "", t2: "", t3: "", cardTiers: true, label: "",
  f1: "", p1: "vigor", s1: "", n1: false, f2: "", p2: "vigor", s2: "", n2: false, f3: "", p3: "vigor", s3: "", n3: false, f4: "", p4: "vigor", s4: "", n4: false, nlAll: false,
  drows: 1, mkind: "pushed", mdistance: "2", mfrom: "", mpick: false, marea: 2, mterrain: false, more: false, shape: "emanation", distance: 2, targets: "all", self: false, rounds: 0,
  cname: "prone", cvalue: 0, cdur: "", crounds: 1, fxUuid: "", fxName: "", aformula: "1d8+mod", awho: "", anear: 0, rn: 1, uname: "Basic Attack", uap: 0, help: false });

function traitsRow(traits) {
  const have = new Set(traits);
  const chips = traits.map(k => `<span class="fr-chip g-${R.traitGroup(k)}">${esc(R.traitLabel(k))}<button type="button" data-bb="untrait" data-v="${esc(k)}" aria-label="Remove">×</button></span>`).join("");
  const opts = (TWOD12.traitGroups ?? []).map(g => `<optgroup label="${esc(g.label)}">${g.traits.filter(k => k in (TWOD12.actionTraits ?? {}) && !have.has(k)).map(k => `<option value="${esc(k)}">${esc(TWOD12.actionTraits[k])}</option>`).join("")}</optgroup>`).join("");
  return `<select class="fr-sel fr-tsel" data-bb-trait aria-label="Add a trait"><option value="">+ trait</option>${opts}</select>${chips} <span class="fr-m">so Effects on those rolls count ("a Boon on [Fear] Saves")</span>`;
}
function fieldsHtml(s) {
  const roll = [["", seg("attr", s.attr, ATTR(), "w")],
    ["DC", `${seg("dcMode", s.dcMode, [["card", "The card's"], ["13", "13"], ["power", "The user's Power DC"], ["weapon", "Weapon DC"], ["set", "A number"]], "w")}${s.dcMode === "set" ? step("dc", s.dc, 5, 30) : ""}`],
    ["Modifier", `${step("adj", s.adj, -9, 9)} <span class="fr-m">Boons</span> ${step("boon", s.boon, 0, 5, "boon")} <span class="fr-m">Banes</span> ${step("bane", s.bane, 0, 5, "bane")}`],
    ["Matches", traitsRow(s.traits)]];
  if (s.type === "check") return grid(roll) + help("DC \"The card's\": the DC of the Action the button sits on (13 anywhere else).");
  if (s.type === "save") {
    const tier = n => { const r = tierFromCard(s[`t${n}`]); return `<div class="as-tier t${n}"><span class="as-tl">Tier ${n}</span><div class="as-tb">${text(`t${n}`, s[`t${n}`], n === 3 ? "No effect." : "[R] 1d8 Ho; Pushed 2", "as-dmg")}${r.text && r.text !== "0" ? `<span class="as-under"><span class="as-dc">${esc(r.text)}</span>${r.skipped.length ? `<span class="as-dc bb-warn">not on a loose button: ${esc(r.skipped.join(", "))}</span>` : ""}</span>` : ""}</div></div>`; };
    return `${grid(roll)}<div class="as-tiers">${[1, 2, 3].map(tier).join("")}</div>${help("Each Tier is written like the card: the damage, then <code>;</code> and its words. Tier 1 is the worst Save. The chip under a Tier shows what was understood.")}`;
  }
  if (s.type === "damage") { const n = Math.max(1, Math.min(4, Number(s.drows) || 1, 4)); return `${Array.from({ length: n }, (x, k) => k + 1).map(i => `<div class="bb-drow">${text(`f${i}`, s[`f${i}`], "1d6+2", "amt")}${seg(`p${i}`, s[`p${i}`], [["vigor", "Vigor"], ["resolve", "Resolve"], ["choice", "Choice"]])}${sel(`s${i}`, s[`s${i}`], SUBS())}${tog(`n${i}`, s[`n${i}`], "Nonlethal")}${i > 1 && i === n ? `<button type="button" class="fr-x" data-bb="deldmg" aria-label="Remove this damage">×</button>` : ""}</div>`).join("")}<div class="bb-drow">${n < 4 ? `<button type="button" class="as-fill" data-bb="adddmg">+ Another damage</button>` : ""}${tog("nlAll", s.nlAll, "All of it Nonlethal")}</div>`; }
  if (s.type === "move") return grid([["Kind", seg("mkind", s.mkind, [["pushed", "Pushed"], ["pulled", "Pulled"], ["slid", "Slid"], ["reposition", "Reposition"], ["advance", "Advance"], ["evade", "Evade"]], "w")], ["Distance", `${text("mdistance", s.mdistance, "2, or speed/2", "amt")} <span class="fr-m">squares</span> ${tog("more", s.more, "More")}`],
    s.more ? ["Away from", seg("mfrom", s.mfrom, [["", "You"], ["target", "The target"], ["area", "The area's center"]], "w")] : null,
    s.more ? ["Who", `${tog("mpick", s.mpick, "The others around the target, one by one")}${s.mpick ? ` ${step("marea", s.marea, 1, 9)} <span class="fr-m">Emanation</span>` : ""}`] : null,
    s.more ? ["Terrain", tog("mterrain", s.mterrain, "Through creatures and Difficult Terrain")] : null]);
  if (s.type === "template") return grid([["Shape", seg("shape", s.shape, [["emanation", "Emanation"], ["burst", "Burst"], ["line", "Line (from you)"]], "w")], ["Size", step("distance", s.distance, 1, 30)],
    ["Targets", `${seg("targets", s.targets, [["all", "Everyone"], ["allies", "Allies"], ["enemies", "Enemies"]], "w")}${s.shape === "line" ? "" : tog("self", s.self, "and the creature it is around")}`], ["Rounds", `${step("rounds", s.rounds, 0, 20)} <span class="fr-m">0: placed and removed by hand</span>`]])
    + help("An area that stays and does something inside is a Zone: drop its Effect (the Effect kind). The old \"Keep the area\" and Difficult terrain options are still read on old buttons.");
  if (s.type === "condition") return grid([["Condition", `${text("cname", s.cname, "prone")} <span class="fr-m">its name in the Conditions compendium</span>`], ["Value", `${step("cvalue", s.cvalue, 0, 9)} <span class="fr-m">0: none (Vulnerable 2, Empowered 1)</span>`],
    ["Lasts", `${seg("cdur", s.cdur, [["", "As the condition says"], ["eot", "EoT"], ["rounds", "Rounds"]], "w")}${s.cdur === "rounds" ? step("crounds", s.crounds, 1, 20) : ""}`]]);
  if (s.type === "effect") return `${s.fxUuid ? `<div class="fr-dropped"><span class="fr-dk">Effect</span><b>${esc(s.fxName)}</b><button type="button" class="fr-x" data-bb="clrfx" aria-label="Remove">×</button></div>` : `<div class="fr-drop" data-bb-drop>Drop an Effect here<br><small>from the Effects and Conditions compendiums, or a Zone</small></div>`}`;
  if (["guard", "heal", "reduce"].includes(s.type)) return grid([["Amount", `${text("aformula", s.aformula, "1d8+mod", "amt")} <span class="fr-m">mod, pow, wpn, rally, rp</span>`],
    ["Who", seg("awho", s.awho, s.type === "guard" ? [["", "You"], ["pick", "You or one ally (a pick)"], ["all", "You and every ally"]] : [["", "The target"], ["pick", "You or one ally (a pick)"], ["all", "Every ally"]], "w")],
    s.awho ? ["Within", `${step("anear", s.anear, 0, 30)} <span class="fr-m">squares of you (0: anywhere)</span>`] : null]);
  if (s.type === "rally") return grid([["Rally Points", step("rn", s.rn, 1, 9)]]);
  if (s.type === "use") return grid([["Action", `${text("uname", s.uname, "Basic Attack", "wide")}`], ["For", `${step("uap", s.uap, 0, 5)} <span class="fr-m">AP (a free use: no Frequency)</span>`]]);
  return "";
}
/** The window's HTML. s: the state; read: wordsToButtons(s.words); look: { cmd, html (the button enriched), problem }; recent: [cmd]. */
export function builderHtml(s, read, look, recent = []) {
  const kinds = `<div class="bb-kinds">${KINDS.map(([g, ks]) => `<div class="bb-kg"><span>${g}</span>${ks.map(([k, t, c, l]) => `<button type="button" class="bb-kind${k === s.type ? " on" : ""}" data-bb="set" data-f="type" data-v="${k}" aria-pressed="${k === s.type}"><span class="fr-kind k-${c}">${t}</span>${l}</button>`).join("")}</div>`).join("")}</div>`;
  const table = read.length ? `<table class="bb-read"><thead><tr><th>You wrote</th><th>Its text</th></tr></thead><tbody>${read.map(r => `<tr class="${r.ok ? "" : "no"}"><td><span class="bb-tick">${r.ok ? "✓" : "?"}</span>${esc(r.words)}</td><td>${r.ok ? `<code>${esc(r.cmd)}</code>` : `<span class="fr-m">not understood: left out. Pick its kind below.</span>`}</td></tr>`).join("")}</tbody></table>` : "";
  const top = `<section class="bb-words${s.src === "words" ? " on" : ""}"><label class="bb-typel" for="bb-words">Write it, as a card would <small>several at once: separate them with <code>;</code></small></label>
    <textarea id="bb-words" class="fr-ta bb-type" rows="2" data-bb-in="words" placeholder="Pushed 2; Vulnerable 2 (EoT); Appeal Save, DC 15; [R] 2d6 Ho">${esc(s.words)}</textarea>
    <div class="bb-quick"><span class="fr-m">Common</span>${QUICK.map(q => `<button type="button" data-bb="quick" data-v="${esc(q)}">${esc(q)}</button>`).join("")}</div>${table}</section>`;
  const fields = `<section class="bb-fields${s.src === "fields" ? " on" : ""}"><h3>Or pick a kind <small>for what the words don't cover</small></h3>${kinds}<div class="bb-kindbody">${fieldsHtml(s)}${["effect", "use"].includes(s.type) ? "" : grid([["Label", text("label", s.label, "optional: the button's own words", "wide")]])}</div></section>`;
  const out = `<section class="bb-out"><div><span class="bb-cap">${s.src === "words" ? "The buttons you wrote" : "The button"}</span><div class="bb-chips">${look.problem ? `<span class="fr-m">${esc(look.problem)}</span>` : look.html}</div></div><div><span class="bb-cap">Its text</span><code class="bb-cmd" data-bb-cmd>${esc(look.cmd)}</code></div></section>`;
  const rec = recent.length ? `<details class="bb-recent" open><summary>Recent <span class="fr-m">click one to make it the text</span></summary><div class="bb-chips">${recent.map((c, i) => `<button type="button" class="bb-rec" data-bb="recent" data-i="${i}">${esc(c.length > 46 ? `${c.slice(0, 44)}…` : c)}</button>`).join("")}</div></details>` : "";
  return `<div class="twod12 sheet item sk bb-win"><div class="fr-tab as-tab${s.help ? " fr-helpon" : ""} bb-tab">${top}${fields}${out}${rec}</div>
    <footer class="bb-foot"><a class="fr-q${s.help ? " on" : ""}" data-bb="help" role="button" tabindex="0" aria-pressed="${!!s.help}" aria-label="Show the help texts">?</a><span class="fr-m">The window stays open for the next one.</span><button type="button" data-bb="close">Close</button><button type="button" class="bb-copy" data-bb="copy"${look.cmd && !look.problem ? "" : " disabled"}>Copy the text</button><button type="button" class="bb-go" data-bb="send"${look.cmd && !look.problem ? "" : " disabled"}>Send to chat</button></footer></div>`;
}
const KIND_TITLE = { Check: "Check", Save: "Save", Damage: "Damage", Move: "Movement", Template: "Area", Condition: "Condition", Effect: "Effect", Guard: "Guard", Heal: "Heal", Reduce: "Reduce", Rally: "Rally Point", Use: "Action" };
/** v0.0.358: the chat card of the buttons sent: titled by what they are (one kind: its name; several: "Buttons"). Pure. */
export function buttonCard(cmd) {
  const kinds = [...new Set([...String(cmd ?? "").matchAll(/@(\w+)\[/g)].map(m => m[1]))];
  // the system card's own markup (sysmsg.mjs sysCard), without its text coloring: that would write inside the buttons' text
  return `<div class="twod12 chat action sysmsg btnmsg" style="${cardVars(SYS_COLOR)}">${cardHead(kinds.length === 1 ? (KIND_TITLE[kinds[0]] ?? "Button") : "Buttons", "", "")}<div class="sm-lead bb-sent">${cmd}</div></div>`;
}
/** What the window would copy or send now: the written buttons (those read), or the picked kind's. */
export function builderOutput(s, read = wordsToButtons(s.words)) {
  if (s.src === "words") { const ok = read.filter(r => r.ok); return { cmd: ok.map(r => r.cmd).join(" "), problem: ok.length ? "" : (read.length ? "Nothing of what you wrote was understood." : "Write something above, or pick a kind.") }; }
  const d = { ...s, uap: s.uap, dc: s.dc };
  return { cmd: buildCommand(d), problem: commandProblem(d) };
}

const { ApplicationV2 } = foundry.applications?.api ?? {};
let open = null;
class ButtonBuilder extends (ApplicationV2 ?? class {}) {
  static DEFAULT_OPTIONS = { id: "twod12-button-builder", classes: ["twod12", "twod12-styled", "twod12-builder"], window: { title: "Create Button", resizable: true }, position: { width: 640, height: "auto" } };
  constructor(o = {}) { super(); this.s = newBuilderState(); this.insert = o.insert ?? null; }
  _recent() { try { return [...(game.user.getFlag("twod12", "recentButtons") ?? [])]; } catch (e) { return []; } }
  async _remember(cmd) { try { await game.user.setFlag("twod12", "recentButtons", [cmd, ...this._recent().filter(c => c !== cmd)].slice(0, 8)); } catch (e) { /* a flag is a convenience */ } }
  async _renderHTML() {
    const read = wordsToButtons(this.s.words), o = builderOutput(this.s, read);
    let html = "";
    try { html = o.cmd && !o.problem ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(o.cmd) : ""; } catch (e) { html = esc(o.cmd); }
    this._out = o;
    const div = document.createElement("div");
    div.className = "bb-root";
    div.innerHTML = builderHtml(this.s, read, { ...o, html }, this._recent());
    return div;
  }
  _replaceHTML(result, content) {
    const f = content.querySelector(":focus"), key = f?.dataset?.bbIn, scroll = content.scrollTop;
    content.replaceChildren(result);
    content.scrollTop = scroll;
    if (key) content.querySelector(`[data-bb-in="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const el = this.element, s = this.s;
    el.addEventListener("click", async ev => {
      const b = ev.target.closest("[data-bb]");
      if (!b || b.disabled) return;
      const a = b.dataset.bb, f = b.dataset.f;
      if (a === "close") return this.close();
      if (a === "copy") return this._copy();
      if (a === "send") return this._send();
      if (a === "help") { s.help = !s.help; return this.render(); }
      if (a === "quick") { s.words = [s.words.trim(), b.dataset.v].filter(Boolean).join("; "); s.src = "words"; return this.render(); }
      if (a === "recent") { s.words = this._recent()[Number(b.dataset.i)] ?? ""; s.src = "words"; return this.render(); }
      if (a === "clrfx") { s.fxUuid = ""; s.fxName = ""; return this.render(); }
      if (a === "adddmg") { s.drows = Math.min(4, (Number(s.drows) || 1) + 1); s.src = "fields"; return this.render(); }
      if (a === "deldmg") { const n = Number(s.drows) || 1; s[`f${n}`] = ""; s[`s${n}`] = ""; s[`n${n}`] = false; s.drows = Math.max(1, n - 1); s.src = "fields"; return this.render(); }
      if (a === "untrait") { s.traits = s.traits.filter(k => k !== b.dataset.v); s.src = "fields"; return this.render(); }
      s.src = "fields";
      if (a === "set") s[f] = typeof s[f] === "number" ? Number(b.dataset.v) || 0 : b.dataset.v;
      else if (a === "tog") s[f] = !s[f];
      else if (a === "step") s[f] = Math.max(Number(b.dataset.min), Math.min(Number(b.dataset.max), (Number(s[f]) || 0) + Number(b.dataset.d)));
      return this.render();
    });
    el.addEventListener("keydown", ev => { if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches?.("[data-bb][tabindex]")) { ev.preventDefault(); ev.target.click(); } if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); ev.target.blur?.(); this._send(); } });
    el.addEventListener("change", ev => {
      const t = ev.target;
      if (t.matches("[data-bb-trait]")) { if (t.value) s.traits = [...new Set([...s.traits, t.value])]; s.src = "fields"; return this.render(); }
      if (!t.matches("[data-bb-in]")) return;
      const f = t.dataset.bbIn;
      s[f] = t.value; s.src = f === "words" ? (t.value.trim() ? "words" : "fields") : "fields";
      return this.render();
    });
    el.addEventListener("dragover", ev => { if (ev.target.closest("[data-bb-drop]")) ev.preventDefault(); });
    el.addEventListener("drop", async ev => {
      if (!ev.target.closest("[data-bb-drop]")) return;
      ev.preventDefault();
      let data = null;
      try { data = JSON.parse(ev.dataTransfer?.getData("text/plain") || "null"); } catch (e) { data = null; }
      const doc = data?.uuid ? await fromUuid(data.uuid) : null;
      if (!doc || doc.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
      s.fxUuid = doc.uuid; s.fxName = doc.name; s.src = "fields";
      return this.render();
    });
  }
  /** Copy the text; into the field it was opened from, when there is one (the Action sheet's text fields). */
  async _copy() {
    const cmd = this._out?.cmd;
    if (!cmd || this._out.problem) return;
    await this._remember(cmd);
    if (this.insert) { try { this.insert(cmd); ui.notifications.info("Inserted in the text."); return; } catch (e) { /* fall back to the clipboard */ } }
    try { await navigator.clipboard.writeText(cmd); ui.notifications.info("Copied: paste it into a card's text, a journal or the chat."); }
    catch (e) {   // v0.0.356 (D48): a failed copy says so, with the text selected to copy by hand
      const code = this.element.querySelector("[data-bb-cmd]");
      if (code) { const r = document.createRange(); r.selectNodeContents(code); const sel0 = window.getSelection(); sel0.removeAllRanges(); sel0.addRange(r); }
      ui.notifications.warn("The clipboard isn't available: the text is selected, copy it with Ctrl+C.");
    }
    this.render();
  }
  /** Send it to the chat at once (as if typed and sent). */
  async _send() {
    const cmd = this._out?.cmd;
    if (!cmd || this._out.problem) return;
    await this._remember(cmd);
    // v0.0.358 (Lucas: "they should follow the chat card format"): a system card (sysmsg.mjs): a title bar, the buttons on its lead line
    try { await ChatMessage.create({ content: buttonCard(cmd), speaker: ChatMessage.getSpeaker?.() }); }
    catch (e) { console.warn("twod12 | Create Button", e); return ui.notifications.error("The button could not be sent to the chat."); }
    this.render();
  }
  async close(options) { open = null; return super.close(options); }
}

/** Open the window (one at a time). insert: a function that puts the text where the window was opened from. */
export async function openBuilder({ insert = null } = {}) {
  if (!ApplicationV2) return;
  if (open) { open.insert = insert; if (open.rendered) open.bringToFront?.(); return open; }   // the scene control can fire twice: one window
  open = new ButtonBuilder({ insert });
  try { await open.render(true); } catch (e) { open = null; throw e; }
  return open;
}
