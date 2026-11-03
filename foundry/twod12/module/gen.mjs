// Action Generator: turns short text such as "1WB,1d4BH,1d6MH" into Instances, and converts parts of the Effects text.
//   1WB      1 [W] to Body            1d4BH    1d4 Body Holy        1d6MH   1d6 Mind Holy
//   BB       Body Blunt (the first letter is the pool: B Body, M Mind, C Choice; the second the subtype: B H M P S)
//   ModB     [Mod] to Body (AtB still reads)             "Prone"  plain text (tier effect)
import { TWOD12, subtypeCode } from "./config.mjs";
import { instanceText } from "./actions.mjs";
import { esc } from "./util.mjs";
const { DialogV2 } = foundry.applications.api;

const POOL = { B: "body", M: "mind", C: "choice" };
const SUBCODES = "Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un";
const SUB_WORDS = { acid: "acid", blunt: "blunt", cold: "cold", electricity: "electricity", fire: "fire", force: "force", holy: "holy", pierce: "pierce", psychic: "psychic", mental: "psychic", slash: "slash", thunder: "thunder", unholy: "unholy" };
const blank = () => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "" });

function splitComma(str) {
  const out = []; let cur = "", q = false, depth = 0;
  for (const ch of str) {
    if (ch === '"') q = !q;
    if (!q) { if ("[({".includes(ch)) depth++; else if ("])}".includes(ch)) depth--; }
    if (ch === "," && !q && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}

const DICE = new RegExp(`^([0-9]+(?:d[0-9]+)?(?:\\s*[+-]\\s*[0-9]+(?:d[0-9]+)?)*)\\s*([BMC])?\\s*(${SUBCODES}|[BCHMPS])?$`, "i");

/** One token to an Instance, or to the tier's effect text (quoted text, or anything that is not damage). */
function parseToken(tok) {
  let s = tok.trim();
  if (!s || s === "0" || s === "-") return null;
  if (s.startsWith('"')) return { text: convertEffects(s.replace(/^"|"$/g, "")) };
  const i = blank();
  let m;
  if ((m = s.match(/^(\d*)\s*W\s*([BMC])?$/i))) { Object.assign(i, { useW: true, wCount: Math.max(1, Number(m[1]) || 1), pool: (m[2] || "B").toUpperCase() }); return { inst: i }; }
  if ((m = s.match(new RegExp(`^(?:1\\s*)?(?:Mod|At|Attribute|Modifier)\\s*([BMC])?\\s*(${SUBCODES}|[BCHMPS])?$`, "i")))) { Object.assign(i, { useAt: true, pool: (m[1] || "B").toUpperCase(), subtype: subtypeCode(m[2] || "") }); return { inst: i }; }
  if ((m = s.match(DICE))) {
    const pool = (m[2] || "").toUpperCase(), sub = subtypeCode(m[3] || "");
    Object.assign(i, { dice: m[1].replace(/\s+/g, ""), pool: pool || "B", subtype: sub });
    return { inst: i };
  }
  return { text: convertEffects(s) };
}

/** A tier field: the Instances and the tier's effect text. */
export function parseTierFull(text) {
  const insts = [], texts = [];
  for (const tok of splitComma(text ?? "")) { const r = parseToken(tok); if (r?.inst) insts.push(r.inst); else if (r?.text) texts.push(r.text); }
  return { insts, text: texts.join("; ") };
}

/** Instances (and the tier text) back to the short text (a combined [W] + dice Instance becomes two tokens). */
export function tierToText(insts, text = "") {
  const out = [];
  for (const i of insts) {
    const p = i.pool || "B", sub = i.subtype || "";
    if (i.useW) out.push(`${i.wCount}W${p}`);
    if (i.dice) out.push(`${i.dice}${p}${sub}`);
    if (i.useAt) out.push(`Mod${p}${sub}`);
  }
  if (text) out.push(`"${text}"`);
  return out.join(",");
}

/** Effects text: "Appeal Save: 1d6 / 1d4 / 0 Holy" becomes a save with its damage, "Body Check" and "Appeal Save" buttons, "uses 1 Rally Point" a Rally button, "Pushed 2", "Advance 3" and "Evade Speed/2" move buttons, "2Emanation 1/round" a template that lasts, and "1d6MH" a damage button. */
const ATTRS = "Body|Mind|Appeal|Instinct";
const tierDmg = (val, pool, sub) => (val === "0" || (!pool && !sub) ? val : `${val}[${[pool, sub].filter(Boolean).join(",")}]`);
export function convertEffects(text) {
  let s = String(text ?? "");
  s = s.replace(/\b(uses?)\s+up\s+to\s+(\d+)\s+Rally\s+Points?\b/gi, "$1 up to @Rally[$2|upto:yes]");
  s = s.replace(/\b(uses?)\s+(\d+)\s+Rally\s+Points?\b/gi, "$1 @Rally[$2]");
  // "Appeal Save: 1d6 / 1d4 / 0 [M] Holy damage" (the pool in brackets and the type are optional)
  const V = "(\\d+d\\d+(?:[+-]\\d+)?|\\d+)";
  s = s.replace(new RegExp(`(?:\\bDC\\s*(\\d+)\\s+)?\\b(${ATTRS})\\s+Save\\s*:\\s*${V}\\s*\\/\\s*${V}\\s*\\/\\s*${V}(?:\\s*\\[([BMC])\\])?(?:\\s+(Acid|Blunt|Cold|Electricity|Fire|Force|Holy|Pierce|Psychic|Slash|Thunder|Unholy))?(?:\\s+damage)?`, "gi"),
    (m, dc, a, t1, t2, t3, pool, sub) => {
      const p = pool ? POOL[pool.toUpperCase()] : "", st = sub ? SUB_WORDS[sub.toLowerCase()] : "";
      return `@Save[${a.toLowerCase()}${dc ? `|dc:${dc}` : ""}|t1:${tierDmg(t1, p, st)}|t2:${tierDmg(t2, p, st)}|t3:${tierDmg(t3, p, st)}]`;
    });
  s = s.replace(new RegExp(`\\bDC\\s*(\\d+)\\s*(${ATTRS})\\s*Save\\b`, "gi"), (m, dc, a) => `@Save[${a.toLowerCase()}|dc:${dc}]`);
  s = s.replace(new RegExp(`\\b(${ATTRS})\\s+Save\\b(?![\\w\\[])`, "g"), (m, a) => `@Save[${a.toLowerCase()}]`);
  s = s.replace(new RegExp(`\\bDC\\s*(\\d+)\\s*(${ATTRS})\\s*Check\\b`, "gi"), (m, dc, a) => `@Check[${a.toLowerCase()}|dc:${dc}]`);
  s = s.replace(new RegExp(`\\b(${ATTRS})\\s+Check\\b(?![\\w\\[])`, "g"), (m, a) => `@Check[${a.toLowerCase()}]`);
  const REF = "(?:\\d+|speed|walk|move|body|mind|appeal|instinct|level|weapon|hp|rally)";
  const EXPR = `${REF}(?:\\s*[/*+\\-]\\s*${REF})*`;
  s = s.replace(/\b(pushed|pulled|slid|advance|walk|evade|reposition)\s+half\s+(?:your\s+)?(speed|walk)\b(\s*\(rounded down\))?/gi, (m, k, r, down) => `@Move[${k.toLowerCase() === "walk" ? "advance" : k.toLowerCase()}|distance:${down ? `floor(${r.toLowerCase()}/2)` : `${r.toLowerCase()}/2`}${k.toLowerCase() === "reposition" ? "|reach:yes" : ""}]`);   // v0.0.227: "(rounded down)" floors (the evaluator rounds up)
  s = s.replace(new RegExp(`\\b(pushed|pulled|slid|advance|walk|evade|reposition)\\s+(${EXPR})(?![\\w/])`, "gi"), (m, k, e) => `@Move[${k.toLowerCase() === "walk" ? "advance" : k.toLowerCase()}|distance:${e.replace(/\s+/g, "").toLowerCase()}${k.toLowerCase() === "reposition" ? "|reach:yes" : ""}]`);   // v0.0.227: "Reposition N" (Relocate) is a move button too, kept within Reach
  // "Reposition 3": a free-direction Forced Movement within an Emanation of that many squares
  s = s.replace(/\bReposition\s+(\d+)\b/g, "@Move[reposition|distance:$1]");
  // "Cleave 2": a button that deals Attribute damage to the creatures next to the target
  s = s.replace(/\bCleave\s+(\d+)\b/g, "@Cleave[$1]");
  // "Prone", "Immobilized (EoT)", "Hindered (2 rounds)": a condition button (with the duration)
  // v0.0.227: only a condition that ends its clause ("Prone.", "Hindered (EoT);") is a button: "a Prone creature" and "no longer Prone" are words.
  s = s.replace(/(?<!\b(?:no longer|not|a|an|the|any|every|while|being)\s)\b(Hindered|Immobilized|Prone)\b(?:\s*\((EoT|\d+\s*rounds?)\))?(?=\s*(?:[.;,()]|$))/g, (m, c, d) => `@Condition[${c.toLowerCase()}${d ? (/eot/i.test(d) ? "|eot" : `|rounds:${parseInt(d, 10)}`) : ""}]`);
  // "2Emanation 1/round" and "[2Burst EoT]": the area, and how long it stays
  s = s.replace(/\[?\b(\d+)\s*(emanation|burst)\b(?:\s+(?:(\d+)\s*\/\s*rounds?|(EoT)))?\]?/gi, (m, n, shape, rounds, eot) =>
    `@Template[${shape.toLowerCase()}|distance:${n}${rounds ? `|rounds:${rounds}` : (eot ? "|expire:eot" : "")}]`);
  s = s.replace(new RegExp(`\\b(\\d+d\\d+(?:[+-]\\d+)?)([BMC])(${SUBCODES}|[BCHMPS])?\\b`, "g"), (m, dice, p, sub) => `@Damage[${dice}[${POOL[p]}${sub ? "," + TWOD12.subtypes[subtypeCode(sub)].toLowerCase() : ""}]]`);
  // v0.0.230 (pack CS): "...in a 2 Emanation ..., for 1 round." -> the template lasts that long (the book writes the duration in the sentence)
  s = s.replace(/(@Template\[emanation\|distance:\d+)(\])([^.]*?\bfor (\d+) rounds?\b)/g, (m, a, b, rest, n) => `${a}|rounds:${n}${b}${rest}`);
  // v0.0.232 (pack CS): a movement in a text that says "you ignore Difficult Terrain" ignores it (Cut Through's Setup).
  if (/ignores? Difficult Terrain/i.test(s)) s = s.replace(/@Move\[(advance|evade|charge)\|([^\]]*)\]/g, (m, k, rest) => (rest.includes("terrain:") ? m : `@Move[${k}|${rest}|terrain:ignore]`));
  return s;
}


/** Dialog: AP, three tiers and Effects. Creates the Version (or replaces the one with the same AP; its dropped Effects are kept). */
export async function openGenerator(item) {
  const versions = foundry.utils.deepClone(item.toObject().system.versions);
  const find = ap => versions.find(v => v.ap === ap);
  // It opens blank, on the lowest AP that has no Version yet. Picking an AP that already has one fills the fields so it can be edited.
  const used = new Set(versions.map(v => v.ap));
  const start = [1, 2, 3, 4, 5].find(n => !used.has(n)) ?? 1;
  const val = (v, k) => tierToText(v?.[k] ?? [], v?.[`x${k.slice(1)}`] ?? "");
  const content = `<div class="twod12 gen">
    <div class="form-group"><label>AP</label><input type="number" name="ap" min="1" max="5" value="${start}"></div>
    ${[1, 2, 3].map(n => `<div class="form-group"><label>Tier ${n}</label><input type="text" name="t${n}" value="${esc(val(find(start), `t${n}`))}" placeholder="1WB,1d4BH,1d6MH"></div>`).join("")}
    <div class="form-group"><label>Effects</label><input type="text" name="effects" value="${esc(find(start)?.effects ?? "")}" placeholder="Bright light 2Emanation 1/round"></div>
    <div class="genprev"></div>
    <p class="hint">Damage: <code>1WB</code> = 1 [W] to Body, <code>1d4BH</code> = 1d4 Body Holy, <code>1d6MH</code> = 1d6 Mind Holy, <code>BB</code> = Body Blunt, <code>ModB</code> or <code>Modifier</code> = [Mod], <code>"text"</code> = tier effect. Effects: <code>2Emanation 1/round</code> (or <code>EoT</code>), <code>2Burst</code>, <code>Appeal Save</code>, <code>DC 14 Body Check</code>, <code>Appeal Save: 1d6 / 1d4 / 0 [M] Holy</code>, <code>Prone</code>, <code>Immobilized (EoT)</code>, <code>1d6MH</code>, <code>Pushed 5</code>, <code>Pulled 3</code>, <code>Slid 2</code>, <code>Advance 5</code>, <code>Evade 1</code>, <code>Evade Speed/2</code> (references: speed, body, mind, appeal, instinct, level, weapon, hp, rally; rounded up), <code>uses 1 Rally Point</code>, <code>use up to 2 Rally Points</code>.</p></div>`;
  const preview = el => {
    const get = n => el.querySelector(`[name=${n}]`).value;
    const rows = [1, 2, 3].map(n => {
      const pf = parseTierFull(get(`t${n}`));
      const txt = [...pf.insts.map(instanceText), pf.text].filter(Boolean).join(" &amp; ") || "&mdash;";
      return `<div><b>Tier ${n}</b> ${esc(txt).replace(/&amp;amp;/g, "&amp;")}</div>`;
    });
    const eff = convertEffects(get("effects"));
    el.querySelector(".genprev").innerHTML = rows.join("") + (eff ? `<div><b>Effects</b> ${esc(eff)}</div>` : "");
  };
  const res = await DialogV2.prompt({
    window: { title: `Generate Action: ${item.name}` }, position: { width: 520 }, content,
    render: (event, dialog) => {
      const el = dialog.element;
      el.querySelectorAll("input").forEach(i => i.addEventListener("input", () => preview(el)));
      let filled = !!find(start);
      el.querySelector("[name=ap]").addEventListener("change", ev => {
        const v = find(Number(ev.target.value));
        if (v) { for (const n of [1, 2, 3]) el.querySelector(`[name=t${n}]`).value = val(v, `t${n}`); el.querySelector("[name=effects]").value = v.effects ?? ""; filled = true; }
        else if (filled) { for (const n of [1, 2, 3]) el.querySelector(`[name=t${n}]`).value = ""; el.querySelector("[name=effects]").value = ""; filled = false; }
        preview(el);
      });
      preview(el);
    },
    ok: { label: "Generate", callback: (ev, btn) => Object.fromEntries(new FormData(btn.form)) },
    rejectClose: false
  });
  if (!res) return;
  const ap = Math.min(5, Math.max(1, parseInt(res.ap) || 1));
  const idx = versions.findIndex(v => v.ap === ap);
  const v = idx >= 0 ? versions[idx] : { ap, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", effects: "", fx: { all: [], t1: [], t2: [], t3: [] } };
  for (const n of [1, 2, 3]) { const pf = parseTierFull(res[`t${n}`]); v[`t${n}`] = pf.insts; v[`x${n}`] = pf.text; }
  v.effects = convertEffects(res.effects);
  if (idx >= 0) versions[idx] = v; else versions.push(v);
  await item.update({ "system.versions": versions });
}

/* ------------------------------------------------------------------ */
/* Weapon generator: "greatsword: two-handed, slash, 0/1d8/2d6"        */
/* ------------------------------------------------------------------ */
const WEAPON_SUBTYPES = { acid: "Ac", blunt: "Bl", cold: "Co", electricity: "El", fire: "Fi", force: "Fo", holy: "Ho", pierce: "Pi", psychic: "Ps", slash: "Sl", thunder: "Th", unholy: "Un" };
const DAMAGE_TIER = /^(?:(\d*)d(\d+)\s*([+-]\s*\d+)?|([+-]?\s*\d+))$/i;
const titleCase = s => s.replace(/\b([a-z])/g, c => c.toUpperCase());

/** One tier of weapon damage: "0", "1d8", "2d6", "1d4+2", "3". */
function weaponTier(text) {
  const m = String(text).trim().match(DAMAGE_TIER);
  if (!m) return null;
  if (m[2]) {
    const die = `d${m[2]}`;
    if (!(die in TWOD12.dice)) return null;
    return { count: Number(m[1] || 1), die, mod: Number((m[3] ?? "0").replace(/\s+/g, "")) };
  }
  return { count: 0, die: "", mod: Number(String(m[4]).replace(/\s+/g, "")) || 0 };
}

/**
 * "crossbow, reload, two-handed pierce, ranges 10/20/40, 0/1d4+2/1d10+2" ->
 * { name, traits, subtype, range, damage: { t1, t2, t3 }, problems }. The first part (or the text before a colon) is the name.
 */
export function parseWeaponText(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return null;
  let name = "", rest = raw;
  const colon = raw.indexOf(":");
  if (colon >= 0) { name = raw.slice(0, colon).trim(); rest = raw.slice(colon + 1); }
  const parts = rest.split(",").map(s => s.trim()).filter(Boolean);
  if (colon < 0 && parts.length) name = parts.shift();
  const out = { name: titleCase(name), traits: new Set(), subtype: "", range: "", damage: null, problems: [] };
  for (const part of parts) {
    let m = part.match(/^ranges?\s+(\d+(?:\s*\/\s*\d+)*)$/i);
    // "ranges 10/20/40" (a ranged weapon); "range 1/2" on a melee weapon is its melee Range; "thrown 4/8/12" a Thrown Range
    if (m) { out.range = m[1].replace(/\s+/g, ""); if (/^ranges/i.test(part) || !out.traits.has("melee")) out.traits.add("ranged"); continue; }
    m = part.match(/^thrown\s+(\d+(?:\s*\/\s*\d+)*)$/i);
    if (m) { out.thrownRange = m[1].replace(/\s+/g, ""); out.traits.add("thrown"); continue; }
    m = part.match(/^(\S+?)\s*\/\s*(\S+?)\s*\/\s*(\S+)$/);
    if (m) {
      const tiers = [m[1], m[2], m[3]].map(weaponTier);
      if (tiers.every(Boolean)) { out.damage = { t1: tiers[0], t2: tiers[1], t3: tiers[2] }; continue; }
    }
    for (const word of part.toLowerCase().replace(/two[\s-]*handed/g, "twohanded").split(/\s+/)) {
      if (word in TWOD12.weaponTraits) out.traits.add(word);
      else if (word in WEAPON_SUBTYPES) out.subtype = WEAPON_SUBTYPES[word];
      else out.problems.push(`"${word}" is not a weapon property or a damage type`);
    }
  }
  if (!out.name) out.problems.push("The weapon needs a name");
  if (!out.damage) out.problems.push("Damage looks like 0/1d8/2d6 (Tier 1 / 2 / 3)");
  return out;
}

const dmgText = d => { const dice = d.die ? `${d.count}${d.die}` : ""; return (dice + (d.mod ? `${dice && d.mod > 0 ? "+" : ""}${d.mod}` : "")) || "0"; };

/** The data a parsed weapon puts on a Weapon item. */
export function weaponSystemData(w) {
  const dmg = t => ({ pool: "B", count: t.count, die: t.die, mod: t.mod });
  return { traits: [...w.traits], hands: w.traits.has("twohanded") ? 2 : 1, subtype: w.subtype, range: w.range || (w.traits.has("melee") ? "1" : ""), thrownRange: w.thrownRange ?? "", damage: { t1: dmg(w.damage.t1), t2: dmg(w.damage.t2), t3: dmg(w.damage.t3) } };
}

/** What the generator understood, for its green chips, and the weapon card it would make (v0.0.136). */
export function weaponSummary(w) {
  const t = w.traits, sub = w.subtype ? Object.entries(WEAPON_SUBTYPES).find(([, v]) => v === w.subtype)?.[0] : "";
  const sp = r => String(r).split("/").join(" / ");
  const melee = t.has("melee") ? `Melee ${sp(t.has("ranged") ? "1" : (w.range || "1"))}` : "";   // "range 1/2" on a melee weapon is its melee Range
  const use = [melee, t.has("ranged") ? `Ranged ${sp(w.range || "")}`.trim() : "", t.has("thrown") ? `Thrown ${sp(w.thrownRange || "")}`.trim() : "", t.has("long") ? "Long" : "", t.has("projectile") ? "Projectile" : "", t.has("reload") ? "Reload" : "",
    t.has("twohanded") ? "Two-handed" : "", t.has("barehanded") ? "Barehanded" : "", t.has("nonthreatening") ? "Non-threatening" : ""].filter(Boolean);
  const chips = [w.name ? `Name: ${w.name}` : "", ...[...t].map(k => TWOD12.weaponTraits[k] ?? k), sub ? titleCase(sub) : "", w.range ? `Range ${sp(w.range)}` : "", w.thrownRange ? `Thrown ${sp(w.thrownRange)}` : "",
    w.damage ? `Damage ${[1, 2, 3].map(n => dmgText(w.damage[`t${n}`])).join(" / ")}` : ""].filter(Boolean);
  const unknown = w.problems.map(p => p.match(/^"([^"]+)"/)?.[1]).filter(Boolean);
  const missing = w.problems.filter(p => !/^"/.test(p));
  const damage = w.damage ? `${sub ? `${titleCase(sub)} \u00b7 ` : ""}[B] ${[1, 2, 3].map(n => dmgText(w.damage[`t${n}`])).join(" / ")}` : "\u2014";
  return { chips, unknown, missing, use: use.join(" \u00b7 ") || "\u2014", damage };
}

const WORDS = "melee · ranges 10/20/40 · range 1/2 · thrown 4/8/12 · long · reload · two-handed · barehanded · non-threatening · blunt, slash, pierce, cold, fire, holy, mental… · three damages for Tiers 1 / 2 / 3 (0/1d8/2d6)";

/** Dialog: one line of text. Buttons: Cancel, Create in the world, and Give to <the creature> (from a sheet) or Update <the weapon> (from its sheet). */
export async function openWeaponGenerator({ item = null, actor = null } = {}) {
  const content = `<div class="twod12 gen genw">
    <label class="gw-line">Describe the weapon in one line <input type="text" name="w" value="${item ? "" : ""}" placeholder="rusty greatsword: two-handed, melee, slash, range 1, 0/1d8/2d6" autofocus></label>
    <div class="gw-ok"></div>
    <div class="gw-no"></div>
    <div class="gw-ph">Preview</div>
    <div class="gw-card"></div>
    <p class="hint">Words it knows: ${esc(WORDS)}.</p></div>`;
  const preview = el => {
    const w = parseWeaponText(el.querySelector("[name=w]").value);
    if (!w) { el.querySelector(".gw-ok").innerHTML = ""; el.querySelector(".gw-no").innerHTML = ""; el.querySelector(".gw-card").innerHTML = '<div class="gw-empty">Type a weapon above.</div>'; return; }
    const sm = weaponSummary(w);
    el.querySelector(".gw-ok").innerHTML = `<b>Understood</b> ${sm.chips.map(c => `<span class="gw-chip">${esc(c)}</span>`).join("")}`;
    el.querySelector(".gw-no").innerHTML = `<b>Not understood</b> ${sm.unknown.length ? sm.unknown.map(u => `<span class="gw-chip bad">${esc(u)}</span>`).join("") : "<span>nothing</span>"}${sm.missing.map(m => `<div class="warnline">${esc(m)}</div>`).join("")}`;
    const two = w.traits.has("twohanded");
    el.querySelector(".gw-card").innerHTML = `<div class="gw-wcard"><div class="gw-head"><b>${esc(w.name) || "?"}</b><span class="gw-seg"><span>Off</span><span class="${two ? "" : "on"}">1H</span><span class="${two ? "on" : ""}">2H</span></span></div>
      <div class="gw-kv"><span>Use</span><span>${esc(sm.use)}</span><span>Damage</span><span>${esc(sm.damage)}</span><span>Technique</span><span>none (drop one on it)</span></div></div>`;
  };
  const read = el => el.querySelector("[name=w]").value;
  const buttons = [{ action: "cancel", label: "Cancel" }];
  if (item) buttons.push({ action: "update", label: `Update ${item.name}`, default: true, callback: (ev, btn, dlg) => ({ how: "update", text: read(dlg.element ?? btn.form) }) });
  else {
    buttons.push({ action: "world", label: "Create in the world", default: !actor, callback: (ev, btn, dlg) => ({ how: "world", text: read(dlg.element ?? btn.form) }) });
    if (actor) buttons.push({ action: "give", label: `Give to ${actor.name}`, default: true, callback: (ev, btn, dlg) => ({ how: "give", text: read(dlg.element ?? btn.form) }) });
  }
  const res = await foundry.applications.api.DialogV2.wait({
    window: { title: actor ? `Generate Weapon: ${actor.name}` : item ? `Generate Weapon: ${item.name}` : "Generate Weapon" }, classes: ["twod12-gen"], position: { width: 580 }, content, rejectClose: false, buttons,
    render: (ev, dialog) => { const el = dialog.element; el.querySelector("[name=w]").addEventListener("input", () => preview(el)); preview(el); }
  });
  if (!res || typeof res !== "object" || !res.text) return null;
  const w = parseWeaponText(res.text);
  if (!w?.damage || !w.name) { ui.notifications.warn(w?.problems?.join(". ") || "Could not read the weapon."); return null; }
  const system = weaponSystemData(w);
  if (res.how === "update" && item) { await item.update({ name: w.name, system }); return item; }
  const data = { name: w.name, type: "weapon", img: "icons/svg/sword.svg", system: { ...system, wielded: res.how === "give" } };
  if (res.how === "give" && actor) { const [created] = await actor.createEmbeddedDocuments("Item", [data]); ui.notifications.info(`${w.name} given to ${actor.name}.`); return created; }
  const made = await Item.create(data);
  ui.notifications.info(`${w.name} created in the Items directory.`);
  return made;
}
