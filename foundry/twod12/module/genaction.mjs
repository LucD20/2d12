// Generate Action (v0.0.136): a whole Action from a dialog. Name, Traits, Frequency, Target, Distance; per version its cost, Tiers 1-3,
// Critical and Effects. The tiers are written like the card ("[B] 1d8 Co; Hindered (EoT)", "1[W]", "[Mod]", "[M] 2d6 Ho"); the short
// codes of the old generator still work ("1WB, 1d8MCo"). A live preview of the card and an "Understood" line.
// From the NPC sheet it creates the Action on the NPC; with an Action (its sheet) it fills that Action; otherwise a world item.
import { TWOD12, subtypeCode, orderTraits, traitGroupOf } from "./config.mjs";
import { parseTierFull, convertEffects } from "./gen.mjs";
import { rawTierLine } from "./preview.mjs";
import { esc } from "./util.mjs";

const blank = () => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "" });

/** Split at a separator outside brackets, parentheses and quotes. */
function splitTop(str, sep) {
  const out = []; let cur = "", depth = 0, q = false;
  for (const ch of String(str ?? "")) {
    if (ch === '"') q = !q;
    if (!q) { if ("[({".includes(ch)) depth++; else if ("])}".includes(ch)) depth = Math.max(0, depth - 1); }
    if (ch === sep && !q && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}

const PART = /^(?:\[([BMC])\]\s*)?(?:(\d*)\s*\[W\]|\[(?:At|Mod)\]|(\d+d\d+(?:[+-]\d+)?|\d+))(?:\s+([A-Za-z]+))?$/i;

/** One damage piece written like the card ("[B] 1[W] Sl + [M] 1d6 Ho"): its Instances, or null if it isn't damage. */
function cardDamage(piece) {
  const insts = [];
  let pool = "B";
  for (const raw of piece.split(/\s\+\s/)) {
    const m = raw.trim().match(PART);
    if (!m) return null;
    if (m[1]) pool = m[1].toUpperCase();
    const sub = m[4] ? subtypeCode(m[4]) : "";
    if (m[4] && !sub) return null;   // a word that is no damage type: not damage
    const i = { ...blank(), pool, subtype: sub };
    if (m[2] !== undefined && /\[W\]/i.test(raw)) Object.assign(i, { useW: true, wCount: Math.max(1, Number(m[2]) || 1) });
    else if (/\[(?:At|Mod)\]/i.test(raw)) i.useAt = true;
    else i.dice = m[3].replace(/\s+/g, "");
    insts.push(i);
  }
  return insts;
}

/** A tier written like the card or with the short codes: { insts, text, plain } (plain: the pieces it kept as written, not understood). */
export function parseCardTier(text) {
  const insts = [], texts = [], plain = [];
  for (const piece of splitTop(text, ";")) {
    const dmg = cardDamage(piece);
    if (dmg) { insts.push(...dmg); continue; }
    const old = parseTierFull(piece);   // short codes, commas, quoted text
    insts.push(...old.insts);
    if (old.text) texts.push(old.text);
    if (!old.insts.length && old.text && !old.text.includes("@") && !/^".*"$/.test(piece.trim())) plain.push(piece.trim());
  }
  return { insts, text: texts.join("; "), plain };
}

/** What the generator did not understand: tier pieces and Criticals that are neither damage nor a known effect (kept as plain text; "quoted" text is on purpose). */
export function notUnderstood(f) {
  const out = [];
  for (const v of f.versions ?? []) {
    for (const n of [1, 2, 3]) out.push(...parseCardTier(v[`t${n}`]).plain);
    const c = String(v.critical ?? "").trim();
    if (c && !convertEffects(c).includes("@")) out.push(c);
  }
  return [...new Set(out)];
}

const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
/** The simple buttons back to words, as they are typed: @Condition[hindered|eot] -> Hindered (EoT), @Move[pushed|distance:2] -> Pushed 2, @Save[appeal] -> Appeal Save. */
export function humanize(text) {
  return String(text ?? "")
    .replace(/@Condition\[(\w+)(?:\|(eot|rounds:(\d+)))?\]/g, (m, c, d, r) => `${cap(c)}${d ? ` (${r ? `${r} round${r === "1" ? "" : "s"}` : "EoT"})` : ""}`)
    .replace(/@Move\[(pushed|pulled|slid|advance|evade|reposition)\|distance:([^\]|]+)\]/g, (m, k, d) => `${cap(k)} ${d}`)
    .replace(/@Save\[(\w+)\]/g, (m, a) => `${cap(a)} Save`)
    .replace(/@Check\[(\w+)\]/g, (m, a) => `${cap(a)} Check`);
}

/** A version's tier back to the card's way of writing it. */
export function tierCardText(v, n) {
  const { dmg, effects } = rawTierLine(v?.[`t${n}`] ?? [], v?.[`x${n}`] ?? "");
  return [dmg, ...effects.map(humanize)].filter(Boolean).join("; ");
}

/** The form's values to the Action's system data. */
export function actionFromForm(f) {
  const versions = (f.versions ?? []).map(v => {
    const t = [1, 2, 3].map(n => parseCardTier(v[`t${n}`]));
    const noTiers = t.every(x => !x.insts.length && !x.text) && !String(v.critical ?? "").trim();
    return { ap: Math.max(0, Math.min(5, Math.trunc(Number(v.ap)) || 0)), mode: "", noTiers, t1: t[0].insts, t2: t[1].insts, t3: t[2].insts, x1: t[0].text, x2: t[1].text, x3: t[2].text,
      critical: convertEffects(v.critical ?? ""), effects: convertEffects(v.effects ?? ""), fx: { all: [], t1: [], t2: [], t3: [] } };
  });
  return { traits: [...(f.traits ?? [])], frequency: f.frequency ?? "", reaction: !!f.reaction, targets: f.targets ?? "", distance: f.distance ?? "", versions };
}

/** "Understood: 3 tiers, Cold damage to Body, Hindered (EoT) on Tiers 2 and 3." */
export function understood(sys) {
  const bits = [];
  sys.versions.forEach((v, k) => {
    const tiers = [1, 2, 3].filter(n => v[`t${n}`].length || v[`x${n}`]);
    const kinds = new Set(), texts = new Map();
    for (const n of [1, 2, 3]) {
      for (const i of v[`t${n}`]) kinds.add(`${i.useW ? "weapon " : i.useAt ? "Attribute " : ""}${i.subtype ? `${TWOD12.subtypes[i.subtype] ?? i.subtype} ` : ""}damage to ${{ B: "Body", M: "Mind", C: "Body or Mind" }[i.pool] ?? "Body"}`);
      if (v[`x${n}`]) texts.set(v[`x${n}`], [...(texts.get(v[`x${n}`]) ?? []), n]);
    }
    const tierWord = ns => (ns.length === 3 ? "every Tier" : `Tier${ns.length > 1 ? "s" : ""} ${ns.join(" and ")}`);
    const parts = [tiers.length ? `${tiers.length} tier${tiers.length === 1 ? "" : "s"}` : "no tiers", ...kinds, ...[...texts].map(([t, ns]) => `${humanize(t)} on ${tierWord(ns)}`)];
    if (v.critical) parts.push("a Critical");
    if (v.effects) parts.push("Effects");
    bits.push(`${sys.versions.length > 1 ? `${v.ap}AP: ` : ""}${parts.join(", ")}`);
  });
  return bits.join(" | ");
}

const versionHtml = (v, k) => `<fieldset class="ga-ver" data-v="${k}" ${k ? "hidden" : ""}>
  <label>Cost (AP) <input type="number" name="ap" min="0" max="5" value="${esc(v.ap)}"></label>
  ${[1, 2, 3].map(n => `<label>Tier ${n} <input type="text" name="t${n}" value="${esc(v[`t${n}`])}" placeholder="${n === 1 ? "[B] 1d8 Co" : n === 2 ? "[B] 2d8 Co; Hindered (EoT)" : "[B] 3d8 Co; Hindered (EoT)"}"></label>`).join("")}
  <label>Critical <input type="text" name="critical" value="${esc(v.critical)}" placeholder="Immobilized (EoT)"></label>
  <label>Effects (Tier 2+) <input type="text" name="effects" value="${esc(v.effects)}" placeholder="Appeal Save, Pushed 2, Pulled 1, 2Emanation 1/round"></label>
</fieldset>`;

/** The dialog. actor: create on it; item: fill that Action; neither: a world item. */
export async function openActionGenerator({ actor = null, item = null } = {}) {
  const { DialogV2 } = foundry.applications.api;
  const it = item?.system;
  const start = {
    name: item?.name ?? "", traits: [...(it?.traits ?? [])], frequency: it?.frequency ?? "", reaction: !!it?.reaction, targets: it?.targets ?? "", distance: it?.distance ?? "",
    versions: it?.versions?.length ? it.versions.map(v => ({ ap: v.ap, t1: tierCardText(v, 1), t2: tierCardText(v, 2), t3: tierCardText(v, 3), critical: humanize(v.critical ?? ""), effects: humanize(v.effects ?? "") }))
      : [{ ap: 1, t1: "", t2: "", t3: "", critical: "", effects: "" }]
  };
  // v0.0.179: grouped like the book (Roll, Requires, Kind, Damage, Keywords).
  const traitOpts = TWOD12.traitGroups.map(g => `<optgroup label="${g.label}">${orderTraits(Object.keys(TWOD12.actionTraits)).filter(k => traitGroupOf(k) === g.key).map(k => `<option value="${k}" ${start.traits.includes(k) ? "selected" : ""}>${esc(TWOD12.actionTraits[k])}</option>`).join("")}</optgroup>`).join("");
  const freqOpts = Object.entries(TWOD12.frequencies).map(([k, l]) => `<option value="${k}" ${k === start.frequency ? "selected" : ""}>${esc(l)}</option>`).join("");
  const content = `<div class="twod12 genact">
    <div class="ga-top">
      <label class="wide">Name <input type="text" name="name" value="${esc(start.name)}" placeholder="Grave Chill" autofocus></label>
      <label class="wide">Traits <multi-select name="traits">${traitOpts}</multi-select></label>
      <label>Frequency <select name="frequency">${freqOpts}</select></label>
      <label class="chk"><input type="checkbox" name="reaction" ${start.reaction ? "checked" : ""}> Reaction</label>
      <label>Target <input type="text" name="targets" value="${esc(start.targets)}" placeholder="One creature"></label>
      <label>Distance <input type="text" name="distance" value="${esc(start.distance)}" placeholder="5 squares, Weapon, Self"></label>
    </div>
    <div class="ga-tabs"><span class="ga-vtabs"></span><a class="ga-add"><i class="fa-solid fa-plus"></i> add a version</a></div>
    <div class="ga-vers">${start.versions.map(versionHtml).join("")}</div>
    <p class="hint">Write it like the card: <code>[B] 1d8 Co</code> = 1d8 Cold to Body · <code>1[W]</code> = the weapon's damage · <code>[Mod]</code> = the Modifier used on the roll · <code>[M] 2d6 Ho</code> = Mind, Holy · <code>;</code> then an effect (<code>Hindered (EoT)</code>, <code>Prone</code>, <code>Pushed 2</code>, <code>Appeal Save</code>). The short codes (<code>1WB</code>, <code>1d8MCo</code>) work too.</p>
    <div class="ga-ok"></div>
    <div class="ga-no"></div>
    <div class="ga-prev"><div class="ga-ph">Live preview</div><div class="ga-card"></div></div>
  </div>`;
  const read = el => ({
    name: el.querySelector("[name=name]").value.trim(),
    traits: [...(el.querySelector("multi-select[name=traits]")?.value ?? [])],
    frequency: el.querySelector("[name=frequency]").value, reaction: el.querySelector("[name=reaction]").checked,
    targets: el.querySelector("[name=targets]").value, distance: el.querySelector("[name=distance]").value,
    versions: [...el.querySelectorAll(".ga-ver")].map(fs => Object.fromEntries(["ap", "t1", "t2", "t3", "critical", "effects"].map(k => [k, fs.querySelector(`[name=${k}]`).value])))
  });
  let timer = null;
  const refresh = el => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const f = read(el), sys = actionFromForm(f);
      el.querySelector(".ga-ok").innerHTML = `<b>Understood:</b> ${esc(understood(sys))}`;
      const no = notUnderstood(f);
      el.querySelector(".ga-no").innerHTML = `<b>Not understood</b> (kept as plain text) ${no.length ? no.map(x => `<span class="gw-chip bad">${esc(x)}</span>`).join("") : "<span>nothing</span>"}`;
      try {
        const { buildActionCard } = await import("./actioncard.mjs");
        const temp = new CONFIG.Item.documentClass({ name: f.name || "New Action", type: "action", system: sys });
        el.querySelector(".ga-card").innerHTML = await buildActionCard(temp);
      } catch (e) { el.querySelector(".ga-card").innerHTML = `<div class="warnline">No preview: ${esc(e.message ?? e)}</div>`; }
    }, 150);
  };
  const tabs = el => {
    const vs = [...el.querySelectorAll(".ga-ver")];
    const on = vs.findIndex(x => !x.hidden);
    el.querySelector(".ga-vtabs").innerHTML = vs.map((x, k) => `<a class="ga-vt${k === on ? " on" : ""}" data-k="${k}">Version ${esc(x.querySelector("[name=ap]").value)} AP${vs.length > 1 ? ` <i class="fa-solid fa-xmark ga-del" data-k="${k}" data-tooltip="Remove this version"></i>` : ""}</a>`).join("");
  };
  const show = (el, k) => { el.querySelectorAll(".ga-ver").forEach((x, i) => { x.hidden = i !== k; }); tabs(el); };
  const target = item ? `Update ${item.name}` : actor ? `Create on ${actor.name}` : "Create in the world";
  const res = await DialogV2.wait({
    window: { title: actor ? `Generate Action: ${actor.name}` : item ? `Generate Action: ${item.name}` : "Generate Action", resizable: true }, classes: ["twod12-gen"],
    // A fixed height: the fields and the preview scroll, the buttons stay at the bottom (v0.0.137).
    position: { width: 660, height: Math.max(420, Math.min(window.innerHeight - 60, 900)) }, content, rejectClose: false,
    render: (event, dialog) => {
      const el = dialog.element;
      tabs(el);
      el.addEventListener("input", () => { tabs(el); refresh(el); });
      el.addEventListener("change", () => refresh(el));
      el.querySelector(".ga-vtabs").addEventListener("click", ev => {
        const del = ev.target.closest(".ga-del");
        if (del) { el.querySelectorAll(".ga-ver")[Number(del.dataset.k)]?.remove(); show(el, 0); refresh(el); return; }
        const t = ev.target.closest(".ga-vt");
        if (t) show(el, Number(t.dataset.k));
      });
      el.querySelector(".ga-add").addEventListener("click", () => {
        const vs = el.querySelectorAll(".ga-ver"), ap = Math.min(5, Math.max(0, ...[...vs].map(x => Number(x.querySelector("[name=ap]").value) || 0)) + 1);
        el.querySelector(".ga-vers").insertAdjacentHTML("beforeend", versionHtml({ ap, t1: "", t2: "", t3: "", critical: "", effects: "" }, vs.length));
        show(el, vs.length); refresh(el);
      });
      refresh(el);
    },
    buttons: [{ action: "cancel", label: "Cancel" }, { action: "ok", label: target, default: true, callback: (ev, btn, dialog) => read(dialog.element ?? btn.form) }]
  });
  if (!res || res === "cancel" || typeof res !== "object") return null;
  if (!res.name) { ui.notifications.warn("The Action needs a name."); return null; }
  const system = actionFromForm(res);
  if (item) { await item.update({ name: res.name, system }); return item; }
  const data = { name: res.name, type: "action", img: "icons/svg/explosion.svg", system };
  if (actor) { const [made] = await actor.createEmbeddedDocuments("Item", [data]); ui.notifications.info(`${res.name} added to ${actor.name}.`); return made; }
  return Item.create(data);
}
