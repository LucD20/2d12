// The NPC Builder tab (v0.0.163): the Bestiary's calculations for one NPC (book: bestiary.html).
//   Every number is a row: its rating chips (each showing the table's value), the result, and how it was found. A row can be Custom (the typed number).
//   The Basic attack and Special Actions are a reference only: the damage a rating gives, with dice that come close; the Actions are written by hand.
//   The check at the bottom only informs (the ratings are guidance).
import { TWOD12, npcHm, npcDamage, npcTableLevel } from "./config.mjs";
import { npcBuild } from "./data.mjs";

const sg = v => (v >= 0 ? `+${v}` : `\u2212${Math.abs(v)}`);
const fmt = n => String(Math.round(n * 100) / 100);

/** Dice (and flat numbers) that come close to an average, the Modifier taken out: 2.5 -> "1d4". "" when the Modifier alone is enough. */
const DICE = [["", 0], ["1", 1], ["2", 2], ["1d4", 2.5], ["1d6", 3.5], ["1d8", 4.5], ["1d10", 5.5], ["1d12", 6.5], ["2d6", 7], ["2d8", 9], ["2d10", 11], ["2d12", 13], ["3d8", 13.5], ["3d10", 16.5], ["3d12", 19.5], ["4d10", 22], ["4d12", 26], ["5d10", 27.5], ["5d12", 32.5], ["6d12", 39], ["7d12", 45.5]];
export function diceFor(avg) {
  let best = DICE[0];
  for (const d of DICE) if (Math.abs(d[1] - avg) < Math.abs(best[1] - avg) - 1e-9) best = d;
  return best[0];
}
const withMod = d => (d ? `${d} + [Mod]` : "[Mod]");

export function npcBuilderContext(actor) {
  const s = actor.system, nb = npcBuild(s), role = nb.role, R = TWOD12.npcRatings;
  const keys = Object.keys(R).filter(k => role.extreme || k !== "extreme");
  // The chips: clicking one selects it; clicking the selected one clears the selection, and the row takes a typed (Custom) number.
  const chips = (key, valOf, cur) => keys.map(r => ({ key, r, label: R[r].label, value: valOf(r), on: cur === r, click: cur === r ? "custom" : r,
    tip: cur === r ? "Click again to clear it and type your own number" : "" }));
  // A Custom number outside what the table gives (Terrible..Extreme) gets a warning; nothing is prevented.
  const outside = (v, lo, hi, show = x => x) => (v < lo - 1e-9 ? `Below Terrible (${show(lo)})` : v > hi + 1e-9 ? `Above ${role.extreme ? "Extreme" : "High"} (${show(hi)})` : "");
  const row = (key, label, sub, valOf, value, how, input, range) => {
    const custom = nb.rating(key) === "custom";
    return { key, label, sub, chips: chips(key, valOf, nb.rating(key)), value, how, custom, input: custom ? input : null, warn: custom && range ? outside(...range) : "" };
  };
  const lo = keys[0], hi = keys[keys.length - 1];

  // Attributes
  const attrRows = Object.entries(TWOD12.attributes).map(([k, label]) => {
    const r = nb.rating(k), v = nb.attributes[k];
    const sub = [k === s.weaponAttribute ? "Weapon Attribute" : "", k === s.powerAttribute ? "Power Attribute" : ""].filter(Boolean).join(" \u00b7 ");
    const how = r === "custom" ? "Your number. Click a rating to use the table again" : `${R[r].label}, ${role.label}: ${sg(v)}`;
    return row(k, label, sub, x => sg(role.attr + R[x].off), sg(v), how, { name: `system.custom.${k}`, value: Number(s.custom?.[k]) || 0 },
      [v, role.attr + R[lo].off, role.attr + R[hi].off, sg]);
  });
  // Health
  const hmOf = x => npcHm(s.role, x, s.level);   // v0.0.176: the Bestiary's row for the NPC's level (1 to 3)
  const healthOf = (attr, x) => Math.ceil((attr + 2) * hmOf(x) + role.hb - 1e-9);
  const healthRow = (pool, attrKey, label) => {
    const key = `${pool}Hm`, r = nb.rating(key), attr = nb.attributes[attrKey], value = pool === "body" ? nb.bdt : nb.mdt;
    let how = "Your number. Click a rating to use the table again";
    if (r !== "custom") { const hm = hmOf(r), exact = (attr + 2) * hm + role.hb; how = `(${TWOD12.attributes[attrKey]} ${sg(attr)} + 2) \u00d7 ${fmt(hm)} + ${role.hb} = ${fmt(exact)}${Math.abs(exact - value) > 1e-9 ? `, rounded up to ${value}` : ""}`; }
    return row(key, label, `Multiplier, base ${role.hb}`, x => `\u00d7${fmt(hmOf(x))}`, String(value), how, { name: `system.custom.${pool}Health`, value },
      [value, healthOf(attr, lo), healthOf(attr, hi)]);
  };
  // Defenses
  const defOf = x => Math.max(TWOD12.defenseBase, role.defense + R[x].off);
  const defRow = (key, label, sub, value, field) => {
    const r = nb.rating(key);
    return row(key, label, sub, x => String(defOf(x)), String(value), r === "custom" ? "Your number. Click a rating to use the table again" : `${R[r].label}, ${role.label}: ${value}`,
      { name: field, value }, [value, defOf(lo), defOf(hi)]);
  };
  // Speed: 3 to 7 (5 by default); any other Speed is typed.
  const sp = TWOD12.npcSpeeds, spCur = nb.speedCustom ? "custom" : String(nb.speed);
  const speedRow = { key: "speed", label: "Speed", sub: "Squares per Move", value: String(nb.speed), custom: nb.speedCustom,
    chips: sp.map(v => ({ key: "speed", r: String(v), label: String(v), value: v === 5 ? "default" : v > 5 ? "fast" : "slow", on: spCur === String(v), click: spCur === String(v) ? "custom" : String(v),
      tip: spCur === String(v) ? "Click again to clear it and type your own Speed" : "" })),
    how: nb.speedCustom ? "Your number. Click a Speed to use one of these again" : nb.speed > 5 ? "Fast: give it a downside (Low Health, Low AD or a Low Basic attack)" : nb.speed < 5 ? "Slow: give it an upside (High Health, a High Basic attack or Reach)" : "Every NPC has Speed 5 unless it says otherwise",
    input: nb.speedCustom ? { name: "system.speed", value: nb.speed } : null,
    warn: nb.speedCustom && nb.speed < sp[0] ? `Slower than ${sp[0]}` : nb.speedCustom && nb.speed > sp[sp.length - 1] ? `Faster than ${sp[sp.length - 1]}` : "" };

  // Steadiness (v0.0.169): 0 unless the NPC's description says otherwise; buttons 0 to 4, or Custom (v0.0.172): click the button that is on, then type any number.
  const st = Math.max(0, Number(s.steadiness) || 0), stCustom = !!actor?.getFlag?.("twod12", "steadyCustom") || st > 4;
  const steadyRow = { key: "steadiness", label: "Steadiness", sub: "Resistance to being moved", value: String(st), custom: stCustom,
    input: stCustom ? { name: "system.steadiness", value: st } : null, warn: stCustom && st > 4 ? "Above 4" : "",
    chips: [0, 1, 2, 3, 4].map(v => { const on = !stCustom && st === v;
      return { key: "steadiness", r: String(v), label: String(v), value: v === 0 ? "default" : "", on, click: on ? "custom" : String(v), act: "setSteadiness", tip: on ? "Click again to clear it and type your own Steadiness" : "" }; }),
    how: stCustom ? "Your number. Click a button to use one of these again" : st ? `Forced Movement and Reposition against it are reduced by ${st}` : "Forced Movement and Reposition move it fully (a big or heavy creature can have 1 or more)" };
  const groups = [
    { title: "Attributes", note: `Default: one High, two Medium, one Low. Weapon Modifier ${sg(s.weaponMod ?? 0)}, Power Modifier ${sg(s.powerMod ?? 0)}`, rows: attrRows },
    { title: "Health", note: "(Attribute + 2) \u00d7 Multiplier + Base, each threshold rounded up", rows: [healthRow("body", "body", "Body Health"), healthRow("mind", "mind", "Mind Health")] },
    { title: "Defenses", note: "Picked independently", rows: [defRow("ad", "Armor Defense", "AD, against Weapon Actions", nb.armorDef, "system.armorDef"), defRow("wd", "Ward Defense", "WD, against Power Actions", nb.wardDef, "system.wardDef")] },
    { title: "Speed", note: "Speed is free, but strong: balance a fast or slow creature with the rest", rows: [speedRow] },
    { title: "Steadiness", note: "Reduces the value of Forced Movement and Reposition against it", rows: [steadyRow] }
  ];
  const warnings = groups.flatMap(g => g.rows).filter(r => r.warn).map(r => `${r.label}: ${r.warn}`);

  // Attacks: a reference (the Actions are written by hand). Dice use the Weapon Modifier; a Power attack uses the Power Modifier instead.
  const wm = Number(s.weaponMod) || 0;
  const attacks = TWOD12.npcSpecial.filter(x => !(s.role === "minion" && x.key === "s3")).map(x => ({ label: x.label, sub: x.sub, x: x.x,
    cells: keys.map(r => { const t2 = npcDamage(role.basic[0], r, s.level, x.x), t3 = npcDamage(role.basic[1], r, s.level, x.x);
      return { label: R[r].label, avg: `${fmt(t2)} / ${fmt(t3)}`, dice: `${withMod(diceFor(t2 - wm))} / ${withMod(diceFor(t3 - wm))}` }; }) }));

  // The check (informs only).
  const pcAt = d => TWOD12.pcDamageVsDefense[Math.min(16, Math.max(11, d))];
  const pool = Math.max(0, nb.bdt) + Math.max(0, nb.mdt), pcDmg = (pcAt(nb.armorDef) + pcAt(nb.wardDef)) / 2;
  const rated = Object.keys(R).length && ["body", "mind", "appeal", "instinct", "bodyHm", "mindHm", "ad", "wd"].map(k => nb.rating(k));
  const customs = rated.filter(r => r === "custom").length + (nb.speedCustom ? 1 : 0), scored = rated.filter(r => r !== "custom");
  const avgScore = scored.length ? scored.reduce((t, r) => t + R[r].score, 0) / scored.length : 0;
  const avgLabel = Object.values(R).reduce((b, x) => (Math.abs(x.score - avgScore) < Math.abs(b.score - avgScore) ? x : b)).label;
  const check = [
    { k: "Health", v: String(pool), s: `Body ${nb.bdt} + Mind ${nb.mdt}` },
    { k: "Down in about", v: `${fmt(Math.round(pool / pcDmg * 10) / 10)} PC turns`, s: `A level 1 PC deals about ${fmt(pcDmg)} a turn against AD ${nb.armorDef} and WD ${nb.wardDef}. Target for a ${role.label}: ${role.takes}` },
    { k: "Should deal", v: `about ${role.deals}`, s: "a turn to an average PC: the book's target, to check its Actions against" },
    { k: "Ratings average", v: avgLabel, s: customs ? `${customs} Custom number${customs > 1 ? "s" : ""} not counted` : "No Custom numbers" }
  ];
  return {
    roles: Object.entries(TWOD12.npcRoles).map(([k, v]) => ({ key: k, label: v.label, cv: fmt(v.cv), on: (s.role || "standard") === k })),
    role, cv: fmt(role.cv), groups, attacks, check, warnings, ratingHeads: keys.map(r => R[r].label),
    levelNote: Number(s.level) > TWOD12.npcMaxLevel ? `The Bestiary has rows for levels 1 to ${TWOD12.npcMaxLevel}: level ${s.level} uses the level ${npcTableLevel(s.level)} numbers.` : (Number(s.level) < 1 ? `Level ${s.level} uses the level 1 numbers.` : ""),
    minionNote: s.role === "minion" ? "Minions: 3 AP a turn, no Extreme, at most 2 AP Special Actions, no Dying (at 0 they die, or fall Unconscious if the GM prefers)." : ""
  };
}

/** What a rating switch writes: the rating, and when it becomes Custom, the number it showed (so nothing jumps). */
export function ratingUpdate(actor, key, rating) {
  const s = actor.system, upd = { [`system.ratings.${key}`]: rating };
  if (rating !== "custom") return upd;
  if (key in TWOD12.attributes) upd[`system.custom.${key}`] = s.attributes?.[key] ?? 0;
  else if (key === "bodyHm") upd["system.custom.bodyHealth"] = s.bdt ?? 0;
  else if (key === "mindHm") upd["system.custom.mindHealth"] = s.mdt ?? 0;
  else if (key === "ad") upd["system.armorDef"] = s.armorDC ?? 13;
  else if (key === "wd") upd["system.wardDef"] = s.wardDC ?? 13;
  else if (key === "speed") upd["system.speed"] = s.speed ?? 5;
  return upd;
}
