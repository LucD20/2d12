// v0.0.355 PACK ACTION-SHEET (Lucas's pick, 2026-11-11: mockup A2, foundry/mockups/action-sheet-A2.html; the audit foundry/mockups/action-effects-audit.md).
// The Action's Details tab: one page in the card's order (the card, when and where, a tab per Version with its Tiers, the Effects it applies and
// the steps after the damage, the rules it holds, Automation at the bottom) and, on its left, the order of events of the selected Version.
// Built with the EFFECT-SHEET pieces (fr-seg, fr-step, fr-tog, fr-part, fr-drop: system.css) plus the "as-" block (v0.0.355).
//   actionTabHtml(m)   the tab's HTML (pure: strings in, a string out; the tests render it)
//   wireActionTab(sheet, root)   the events: every click is one update of the item
// What is stored doesn't change: the steps read and write the Version's `after` chips (aftersteps.mjs), a Tier's damage is read like the card
// (genaction.mjs parseCardTier) into the same Instances.
import { TWOD12, poolIcon } from "./config.mjs";
import * as R from "./fxrules.mjs";
import * as A from "./aftersteps.mjs";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
/* ------------------------------------------------------------------ small controls (the EFFECT-SHEET markup; data-as: what a click does) */
const seg = (f, cur, opts, cls = "", type = "") => `<span class="fr-seg ${cls}">${opts.map(([v, l]) => `<button type="button" data-as="set" data-f="${f}" data-v="${esc(v)}"${type ? ` data-t="${type}"` : ""} class="${String(cur) === String(v) ? "on" : ""}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join("")}</span>`;
const step = (f, cur, min = 0, max = 9) => `<span class="fr-step"><button type="button" data-as="step" data-f="${f}" data-d="-1" data-min="${min}" data-max="${max}" aria-label="Less">−</button><span class="v">${esc(cur)}</span><button type="button" data-as="step" data-f="${f}" data-d="1" data-min="${min}" data-max="${max}" aria-label="More">+</button></span>`;
const tog = (f, on, label) => `<span class="fr-tog${on ? " on" : ""}" data-as="tog" data-f="${f}" role="switch" aria-checked="${!!on}" tabindex="0"><span class="box"></span>${label}</span>`;
const named = (name, v, ph = "", cls = "") => `<input type="text" class="fr-in ${cls}" name="${name}" value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(ph || name)}">`;
const field = (f, v, ph = "", cls = "") => `<input type="text" class="fr-in ${cls}" data-as-in="${f}" value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(ph || f)}">`;
const sel = (attr, cur, opts, label = "") => `<select class="fr-sel" ${attr} aria-label="${esc(label)}">${opts.map(([v, l]) => `<option value="${esc(v)}"${String(cur) === String(v) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
const grid = rows => `<div class="fr-pgrid">${rows.filter(Boolean).map(([l, c]) => `<span class="fr-pl">${l}</span><div class="fr-pc">${c}</div>`).join("")}</div>`;
const help = t => `<p class="fr-help">${t}</p>`;
const part = (f, on, title, sum, body) => `<div class="fr-part${on ? "" : " off"}"><header>${tog(f, on, title)}<span class="fr-psum">${on ? esc(sum) : "off"}</span></header><div class="fr-pb">${body}</div></div>`;
const sec = (id, title, small, body) => `<section class="fr-sec" data-as-sec="${id}"><h3>${title}${small ? ` <small>${small}</small>` : ""}</h3>${body}</section>`;
const kindTile = (t, c) => `<span class="fr-kind k-${c}">${esc(t)}</span>`;

const FREQ = () => [["", "Default"], ["none", "None"], ["atwill", "At-will"], ["turn", "Turn"], ["round", "Round"], ["encounter", "Encounter"], ["daily", "Daily"]].filter(([k]) => k in (TWOD12.frequencies ?? {}));
// v0.0.418 (Lucas, playtest 5, E4: "the traits are still colored in the item sheet"): the card's plain words, no group color
const traitChip = k => `<span class="fr-chip plain" data-group="${R.traitGroup(k)}">${esc(R.traitLabel(k))}<button type="button" data-as="untrait" data-v="${esc(k)}" aria-label="Remove ${esc(R.traitLabel(k))}">×</button></span>`;
function traitsRow(traits) {
  const have = new Set(traits), order = (TWOD12.traitGroups ?? []).flatMap(g => g.traits).filter(k => have.has(k));
  const rest = traits.filter(k => !order.includes(k));
  const opts = (TWOD12.traitGroups ?? []).map(g => `<optgroup label="${esc(g.label)}">${g.traits.filter(k => k in (TWOD12.actionTraits ?? {}) && !have.has(k)).map(k => `<option value="${esc(k)}">${esc(TWOD12.actionTraits[k])}</option>`).join("")}</optgroup>`).join("");
  // v0.0.358 (Lucas): the picker first, so it doesn't move as traits are added
  return `<div class="as-traits"><select class="fr-sel fr-tsel" data-as-trait aria-label="Add a trait"><option value="">+ trait</option>${opts}</select>${[...order, ...rest].map(traitChip).join("")}</div>`;
}

/* ------------------------------------------------------------------ the card's lines */
function cardSec(m) {
  const s = m.sys, weapon = m.traits.includes("weapon"), max = Number(TWOD12.escalationMax) || 3;
  const more = [];
  const rows = [
    ["Traits", traitsRow(m.traits)],
    ["Flavor", named("system.flavor", s.flavor, "Your weapon blazes with holy light.", "wide")],
    ["Category", `${named("system.category", s.category, "Paladin Feature")} <span class="fr-m">Level</span> ${step("system.level", s.level ?? 0, 0, 20)}`],
    ["Frequency", seg("system.frequency", s.frequency ?? "", FREQ(), "w")],
    ["Escalation", `${step("system.escalation", s.escalation ?? 0, 0, max)} <span class="fr-m">${Number(s.escalation) > 0 ? `an Apex: it needs Escalation ${s.escalation} (nothing is spent)` : `0: none. 1 to ${max}: an Apex, used only at that Escalation`}</span>`],
    ["Targets", named("system.targets", s.targets, "One creature", "wide")],
    ["Distance", named("system.distance", s.distance, "reach, self, weapon, 5 sq., 10/20/40")],
    ["Vs.", `${sel('name="system.vs"', s.vs ?? "", Object.entries(TWOD12.vsChoices ?? {}), "Vs.")}${weapon ? ' <span class="fr-m">a [Weapon] Action rolls the Weapon Modifier against AD</span>' : ""}`],
    s.requirements || m.show.requirements ? ["Requirements", named("system.requirements", s.requirements, "You have at least Speed 3", "wide")] : (more.push(["requirements", "+ Requirements"]), null),
    s.setup || m.show.setup ? ["Setup", named("system.setup", s.setup, "What happens before the dice are rolled (buttons allowed)", "wide")] : (more.push(["setup", "+ Setup"]), null),
    s.prerequisites ? ["Prerequisites", `${named("system.prerequisites", s.prerequisites, "", "wide")}<span class="fr-m">an old Talent field: move it to Requirements</span>`] : null
  ];
  const extra = `<div class="as-more">${tog("system.marksTarget", s.marksTarget, "Marks the target")}${s.marksTarget ? ` <span class="fr-m">mark</span> ${sel('name="system.markKind"', s.markKind ?? "", [["", "Marked"], ["judge", "Judged"], ["bound", "Bound Ally"]], "Mark")}` : ""}${tog("system.basicAttack", s.basicAttack, "Basic attack")}
    ${s.basicAttack ? `<span class="fr-m">rating</span> ${sel('name="system.basicRating"', s.basicRating ?? "medium", m.basicRatings ?? [], "Basic attack rating")}` : ""}${m.basicSuggest ? ` <span class="fr-m">suggested ${esc(m.basicSuggest)}</span>` : ""}
    ${weapon ? `<span class="fr-m">Weapon used</span> ${sel('name="system.weaponUse"', s.weaponUse ?? "", Object.entries(TWOD12.weaponUses ?? {}), "Weapon used")} <span class="fr-m">Weapon needs</span> ${sel('name="system.weaponNeeds"', s.weaponNeeds ?? "", Object.entries(TWOD12.weaponNeeds ?? {}), "Weapon needs")}` : ""}
    ${more.map(([k, l]) => `<a class="as-link" data-as="show" data-v="${k}" role="button" tabindex="0">${l}</a>`).join("")}</div>`;
  return sec("card", "The card", "its lines, in the order players read them", grid(rows) + extra
    + help("Category and Level show at the right of the card's title (Level 0 hides the number). Distance: <code>reach</code>, <code>self</code>, <code>weapon</code> or any text. Marks the target: using it marks the targeted creature; rules \"against the marked one\" read the mark."));
}

/* ------------------------------------------------------------------ when and where */
function whenSec(m) {
  const s = m.sys, a = s.areaCfg ?? {}, areaOn = (Number(a.size) || 0) > 0, zone = m.zoneName;
  const moments = Object.entries(TWOD12.moments ?? {});
  const rx = grid([
    ["Kind", seg("system.reactionKind", s.reactionKind ?? "trigger", [["interrupt", "Interrupt (before it)"], ["trigger", "Trigger (after it)"]], "w")],
    ["Moment", sel('name="system.moment"', s.moment ?? "", moments, "Moment")],
    // v0.0.359 (Lucas): a number or a formula
    ["Within", `${field("@within", s.momentRangeExpr || String(s.momentRange ?? 0), "0", "amt")} <span class="fr-m">squares to the creature of the moment; a number or a formula (<code>pow+2</code>, <code>stage</code>, <code>speed/2</code>); 0: the Action's Distance${s.distance ? ` (${esc(s.distance)})` : ""}, or anywhere</span>`],
    ["Counts", tog("system.momentSelf", s.momentSelf, "You too (\"you or an ally\")")],
    // pack TALENTS-PT (Bear the Blow): used, the held damage is split with you (share.mjs)
    ["Damage", sel('name="system.momentSplit"', s.momentSplit ?? "", [["", "As it is"], ["half", "Split: half to you (rounded up; your Resistance and Immunity don't count)"]], "Damage")],
    ["Used on", seg("system.momentTarget", s.momentTarget ?? "subject", [["subject", "The creature of the moment"], ["source", "The one that caused it"]], "w")],
    ["Card line", named("system.trigger", s.trigger, "An enemy within 5 squares makes a [Strike] Action against an ally.", "wide")],
    s.momentThreat ? ["Old", tog("system.momentThreat", true, "Only a creature you threaten (turn it off: Opportunity Attack uses Within 1)")] : null
  ]) + help("When the moment comes, the Reactions message offers it (Use / Pass). An Interrupt holds the damage until answered; a Trigger is offered after. Moment None: used by hand.");
  const where = a.withinRange ? "weapon" : Number(a.within) > 0 ? "sq" : "self";
  const ar = grid([
    ["Shape", seg("system.areaCfg.shape", a.shape ?? "emanation", [["emanation", "Emanation"], ["burst", "Burst"], ["line", "Line"]], "w")],
    a.shape === "line" ? null : ["Placed", `${seg("@placed", where, [["self", "Around you"], ["sq", "Within N sq."], ["weapon", "The weapon's range"]], "w")}${where === "weapon" ? sel('name="system.areaCfg.withinRange"', a.withinRange, [["normal", "normal"], ["far", "far"], ["maximum", "maximum"]], "Range") : where === "sq" ? step("system.areaCfg.within", a.within ?? 1, 1, 60) : ""}`],
    a.keep && zone ? ["Who", `<span class="as-auto">set by the Zone <small>${esc(zone)}: each of its rows has its own Who</small></span>`] : ["Targets", `${seg("system.areaCfg.targets", a.targets ?? "all", [["all", "Everyone"], ["allies", "Allies"], ["enemies", "Enemies"]], "w")}${a.shape === "line" ? "" : tog("system.areaCfg.center", a.center, "and the creature it is around")}`],
    ["Stays", tog("system.areaCfg.keep", a.keep, "It stays on the map (a Zone when its Effect is one)")]
  ]) + help("The size and the rounds are set on each Version. A Zone's Effect decides who it affects and what it does inside.");
  const sizes = [...new Set((s.versions ?? []).map(v => v.areaSize || a.size))];
  return sec("when", "When and where", "", `<div class="fr-endlist">${part("system.reaction", s.reaction, "A Reaction", `${cap(s.reactionKind ?? "trigger")} · ${(TWOD12.moments?.[s.moment] ?? "by hand").replace(" within N", "")}`, rx)}${part("@area", areaOn, "An Area", `${sizes.join(" / ")} ${a.shape === "line" ? "Line" : cap(a.shape ?? "emanation")}${a.keep ? " · it stays" : ""}`, ar)}</div>`);
}

/* ------------------------------------------------------------------ a Version */
const TIERC = ["t1", "t2", "t3"];
/** v0.0.358 (Lucas: "more like the book / the card"): what a Tier's damage was read as: the pool's icon, the amount (a subtype in its color), the pool's name; "|" between pools. */
export function dmgChips(list) {
  if (!list?.length) return "";
  const groups = new Map();
  for (const i of list) {
    const pool = i.pool === "M" ? "M" : i.pool === "C" ? "C" : "B", ink = TWOD12.subtypeInk?.[i.subtype], sub = i.subtype ? ` <span class="as-sub"${ink ? ` style="color:${ink};--sc-d:${TWOD12.subtypeColors?.[i.subtype] ?? ink}"` : ""}>${esc(TWOD12.subtypes?.[i.subtype] ?? i.subtype)}</span>` : "";
    const parts = groups.get(pool) ?? groups.set(pool, []).get(pool);
    if (i.useW) parts.push(`<b>${i.wCount || 1} × Weapon</b>`);
    if (i.useD) parts.push(`<b>${i.dCount || 1} × Weapon Die</b>`);
    if (i.dice) parts.push(`<b>${esc(i.dice)}</b>${sub}`);
    if (i.useAt) parts.push(`<b>Modifier</b>${i.dice ? "" : sub}`);
  }
  const NAME = { B: "Vigor", M: "Resolve", C: "Vigor or Resolve" };
  return `<span class="as-under">${[...groups].map(([pool, parts]) => `<span class="as-dmg1 ${pool === "M" ? "r" : pool === "B" ? "v" : ""}">${poolIcon(pool)} ${parts.join(" + ")} <small>${NAME[pool]}</small></span>`).join('<span class="as-bar" aria-hidden="true">|</span>')}</span>`;
}
/** v0.0.358: "On" is four switches (the Tiers it runs on, or a Critical alone); none lit can't be: it means every Tier. */
const onChips = (st, i, isSave) => { const lit = A.stepTiers(st, isSave); return `<span class="as-on">${[["t1", "Tier 1"], ["t2", "Tier 2"], ["t3", "Tier 3"], ...(isSave ? [] : [["crit", "A Critical"]])].map(([k, l]) => `<button type="button" class="as-onb ${k}${lit.includes(k) ? " on" : ""}" data-as="tiertog" data-i="${i}" data-v="${k}" aria-pressed="${lit.includes(k)}">${l}</button>`).join("")}</span><span class="fr-m">${lit.length === 3 ? "any result" : lit.includes("crit") ? "only on a Critical" : `only on ${lit.map(k => `Tier ${k[1]}`).join(" and ")}`}</span>`; };
function stepPane(st, i, m) {
  const k = A.STEP_KINDS[st.kind], isSave = m.isSave, o = key => A.optGet(st, key);
  if (st.kind === "text") return `<h4>Plain text<span class="as-ord"><button type="button" data-as="stepmove" data-i="${i}" data-d="-1">↑ Earlier</button><button type="button" data-as="stepmove" data-i="${i}" data-d="1">↓ Later</button><button type="button" data-as="stepdel" data-i="${i}">× Remove</button></span></h4>${grid([["Text", field(`step.${i}.text`, st.text, "", "wide")]])}${help("Text between chips is kept as it is; it does nothing.")}`;
  const rows = [];
  const byTier = A.moveByTier(st);
  if (!byTier) rows.push(["On", onChips(st, i, isSave)]);
  rows.push(["Only", tog(`step.${i}.@down`, /^(yes|true|1|y)$/i.test(o("down")), "when the damage puts the target Down")]);   // v0.0.360 (Deathmark; it was an Effect's mode)
  if (st.kind === "Move") {
    const lit = A.stepTiers(st, isSave);
    rows.push(["Moves", seg(`step.${i}.head`, String(st.head).toLowerCase(), [["pushed", "Pushed"], ["pulled", "Pulled"], ["slid", "Slid"], ["evade", "Evade (you)"]], "w")],
      ["Squares", byTier ? `${tog(`step.${i}.@bytier`, true, "By Tier")} ${["t1", "t2", "t3"].map(t => `<span class="as-bt ${t}">Tier ${t[1]} ${field(`step.${i}.opt.${t}`, A.optGet(st, t) || (lit.includes(t) ? o("distance") : ""), "0", "as-n2")}</span>`).join("")}<span class="fr-m">empty: no movement on that Tier</span>`
        : `${field(`step.${i}.opt.distance`, o("distance") || "1", "1", "as-n2")} ${tog(`step.${i}.@bytier`, false, "By Tier")}`],
      ["Who", seg(`step.${i}.@movewho`, /^(yes|true|1|y)$/i.test(o("pick")) ? (o("area") ? "area" : "all") : "target", [["target", "The target"], ["area", "The others around it"], ["all", "Each target"]], "w")],
      o("area") ? ["Around it", `${field(`step.${i}.opt.area`, o("area"), "2", "as-n2")} <span class="fr-m">Emanation around the target</span>`] : null,
      ["Away from", seg(`step.${i}.opt.from`, String(o("from")).toLowerCase(), [["", "You"], ["target", "The target"], ["area", "The area's center"]], "w")]);
  } else if (st.kind === "Condition") {
    const r = o("rounds") || o("duration"), bare = st.opts.find(([key, v]) => v == null && /^(eot|\d+)$/i.test(key))?.[0] ?? "";
    const dur = /^eot$/i.test(r) || /^eot$/i.test(bare) ? "eot" : Number(r || bare) ? "rounds" : "";
    rows.push(["Condition", `${field(`step.${i}.head`, st.head, "prone", "", "conds")}<span class="fr-m">its name in the Conditions compendium</span>`], ["Value", `${field(`step.${i}.opt.value`, o("value"), "none", "as-n2")} <span class="fr-m">for a valued condition (Vulnerable 2)</span>`],
      ["Lasts", `${seg(`step.${i}.@dur`, dur, [["", "As the condition says"], ["eot", "EoT"], ["rounds", "Rounds"]], "w")}${dur === "rounds" ? field(`step.${i}.@rounds`, Number(r || bare) || 1, "1", "as-n2") : ""}`],
      ["Who", seg(`step.${i}.opt.side`, String(o("side")).toLowerCase(), [["", "The target"], ["enemies", "Its enemies"], ["allies", "Its allies"]], "w")]);
  } else if (["Guard", "Heal", "Reduce"].includes(st.kind)) {
    const stages = (TWOD12.stages ?? []).map(x => x.n), by = A.hasStages(st) || m.stageOpen === i;
    rows.push(["Amount", `${field(`step.${i}.head`, st.head, "1d8+mod", "amt")} ${tog(`step.${i}.@stages`, by, "By Stage")}<span class="fr-m">mod, pow, wpn, rally, rp</span>`],
      by ? ["", `<div class="as-stages" role="group" aria-label="By Stage">${(TWOD12.stages ?? []).map((x, j) => `<label><span>Stage ${x.n}<small>levels ${x.from}-${x.to}</small></span>${j === 0 ? `<input type="text" class="fr-in" value="${esc(st.head)}" disabled aria-label="Stage ${x.n}">` : field(`step.${i}.opt.s${x.n}`, A.optGet(st, `s${x.n}`), "as the Stage before", "")}</label>`).join("")}</div>`] : null,
      ["Who", seg(`step.${i}.opt.who`, String(o("who")).toLowerCase(), st.kind === "Guard" ? [["", "You"], ["pick", "You or an ally"], ["all", "You and allies"]] : [["", "The target"], ["pick", "You or an ally"], ["all", "Every ally"], ["targets", "The targets"]], "w")],
      ["Found", `<span class="fr-m">within</span> ${field(`step.${i}.opt.near`, o("near"), "any", "as-n2")} <span class="fr-m">squares of you, or in a</span> ${field(`step.${i}.opt.area`, o("area"), "none", "as-n2")} <span class="fr-m">Emanation around the target</span>`]);
    void stages;
  } else if (st.kind === "Effect") {
    rows.push(["Effect", m.names[st.head] ? `<div class="fr-dropped"><span class="fr-dk">Effect</span><b>${esc(m.names[st.head])}</b></div>` : `<div class="fr-drop" data-as-drop="step.${i}">Drop an Effect here<br><small>from the Effects and Conditions compendiums</small></div>`],
      ["Who", seg(`step.${i}.opt.who`, String(o("who")).toLowerCase(), [["", "The target"], ["targets", "The targets"], ["self", "You"]], "w")]);
  } else if (st.kind === "EndEffect") rows.push(["Ends", seg(`step.${i}.head`, /^any$/i.test(st.head) ? "any" : "eot1", [["eot1", "One EoT / 1 round effect"], ["any", "Any one effect"]], "w")]);
  else if (st.kind === "Pause") rows.push(["Button", field(`step.${i}.head`, st.head, "After the damage", "wide")]);
  const known = new Set(["down", "on", "tier", "crit", "distance", "t1", "t2", "t3", "pick", "area", "from", "value", "rounds", "duration", "eot", "side", "who", "near", ...(TWOD12.stages ?? []).map(x => `s${x.n}`)]);
  const other = st.opts.filter(([key]) => !known.has(String(key).toLowerCase())).map(([key, v]) => (v == null ? key : `${key}:${v}`)).join("|");
  rows.push(["Other", `${field(`step.${i}.@other`, other, "option:value|option:value", "wide")}`]);
  const ordBtns = `<span class="as-ord"><button type="button" data-as="stepmove" data-i="${i}" data-d="-1">↑ Earlier</button><button type="button" data-as="stepmove" data-i="${i}" data-d="1">↓ Later</button><button type="button" data-as="stepdel" data-i="${i}">× Remove</button></span>`;
  return `<h4>${esc(k?.title ?? st.kind)}${ordBtns}</h4><div class="fr-says">${esc(A.stepSentence(st, isSave))}</div>${grid(rows)}${help("A number field also takes a formula for the creature that uses it: <code>pow</code>, <code>wpn</code>, <code>sig</code>, <code>stage</code>, <code>level</code>, <code>speed/2</code>, <code>body+1</code>. Other: options of the chip this pane has no control for, as <code>name:value</code> separated by <code>|</code>; they are kept as written.")}`;
}
const ADD_STEP = () => `<select class="fr-sel fr-addsel" data-as-addstep aria-label="Add a step"><option value="">+ Add a step</option>${A.STEP_MENU.map(([g, ks]) => `<optgroup label="${esc(g)}">${ks.map(k => `<option value="${k}">${esc(A.STEP_KINDS[k].title)}</option>`).join("")}</optgroup>`).join("")}</select>`;
function afterBlock(v, m) {
  const steps = A.parseAfter(v.after), cur = Math.min(Math.max(0, m.step), steps.length - 1);
  const item = (st, i) => { const k = A.STEP_KINDS[st.kind] ?? { tile: "…", cls: "rule" }; return `<div class="fr-it as-step${i === cur ? " on" : ""}" data-as="stepsel" data-i="${i}" role="button" tabindex="0"><span class="as-n">${i + 1}</span>${kindTile(k.tile, k.cls)}<span class="fr-itxt">${esc(st.kind === "Effect" ? (m.names[st.head] || A.stepLabel(st)) : A.stepLabel(st, m.isSave))}${st.kind === "text" ? "" : ` <em class="fr-m">${esc(A.tiersShort(A.stepTiers(st, m.isSave)))} · ${esc(A.stepWho(st))}</em>`}</span></div>`; };
  const fill = `<div class="as-empty"><button type="button" class="as-fill" data-as="fill">Fill from the Tier text</button><span class="fr-m">reads "Pushed 2", "Vulnerable 2 (EoT)", "Frightened of you for 1 round" in the Tiers and the Critical, and proposes the steps</span></div>`;
  if (!steps.length) return `<div class="as-empty">${ADD_STEP()}</div>${fill}`;
  return `<div class="fr-md as-after"><div class="fr-lst">${steps.map(item).join("")}<div class="fr-adds">${ADD_STEP()}</div></div><div class="fr-pane">${stepPane(steps[cur], cur, m)}</div></div>${fill}${help("The steps run in this order once the damage is applied and lands. The Tier text stays the book's words.")}`;
}
function fxBlock(v, m) {
  const list = (v.fx?.all ?? []).map((x, i) => `<div class="fr-dropped"><span class="fr-dk">Effect</span><b data-as="openfx" data-v="${esc(x.uuid)}" role="button" tabindex="0">${esc(m.names[x.uuid] || "(missing)")}</b>${x.mode && x.mode !== "auto" ? ` <span class="fr-m">· ${x.mode === "down" ? "only when the target goes Down" : "by hand (the Effects button)"}</span>` : ""}<button type="button" class="fr-x" data-as="fxdel" data-t="all" data-i="${i}" aria-label="Remove">×</button>${m.lines[x.uuid] ? `<div class="fr-m2">${esc(m.lines[x.uuid])}</div>` : ""}</div>`).join("");
  const old = ["t1", "t2", "t3"].flatMap(t => (v.fx?.[t] ?? []).map((x, i) => `<div class="fr-dropped"><span class="fr-dk">Tier ${t[1]}</span><b data-as="openfx" data-v="${esc(x.uuid)}" role="button" tabindex="0">${esc(m.names[x.uuid] || "(missing)")}</b> <span class="fr-m">· an older slot: with that Tier's damage</span><button type="button" class="fr-x" data-as="fxdel" data-t="${t}" data-i="${i}" aria-label="Remove">×</button></div>`)).join("");
  return `${list}${old}<div class="fr-drop" data-as-drop="fx.all">${list ? "Drop another Effect here" : "Drop an Effect here"}<br><small>${v.noTiers ? "applied when the Action is used" : "applied on a Tier 2 or 3"}: on the target, on you (the Effect's own "Placed on"), or on the map (a Zone)</small></div>`;
}
function versionBody(v, vi, m) {
  const s = m.sys, a = s.areaCfg ?? {}, areaOn = (Number(a.size) || 0) > 0, calc = m.calc?.[vi];
  const tierRow = (t, i) => `<div class="as-tier ${t}" ${i === 0 ? 'data-as-anchor="tiers"' : ""}><span class="as-tl">Tier ${i + 1}</span><div class="as-tb"><input type="text" class="fr-in as-dmg" data-as-dmg="${t}" value="${esc(m.dmgText(v[t]))}" placeholder="${i ? "[V] 1[W] + [R] 1d6 Ho" : "[V] 1[W]"}" aria-label="Tier ${i + 1} damage">${dmgChips(v[t])}${calc?.tiers?.[i] ? `<span class="as-calc">Avg ${esc(calc.tiers[i].avg)}${calc.tiers[i].exp != null ? ` · Exp ${esc(calc.tiers[i].exp)}` : ""}</span>` : ""}${field(`v.x${i + 1}`, v[`x${i + 1}`], m.isSave && i === 2 ? "No effect." : "Text of this Tier (the book's words)", "wide as-tx")}</div></div>`;
  const tiers = v.noTiers ? "" : `<div class="as-tiers">${TIERC.map(tierRow).join("")}<div class="as-tier crit"><span class="as-tl">Critical</span><div class="as-tb">${field("v.critical", v.critical, "Only on Doubles with a Tier 3 (empty: none)", "wide as-tx")}</div></div></div>${help("Write the damage like the card: <code>[V] 1[W] + [R] 1d6 Ho</code> ([V] Vigor, [R] Resolve; <code>1[W]</code> the weapon's damage; <code>[Mod]</code> the Modifier; a subtype's two letters). The chips under the field show what was understood.")}`;
  return `${grid([["Cost", `${step("v.ap", v.ap, 0, 5)} <span class="fr-m">AP${s.reaction ? " (the Reaction Point)" : ""}</span> ${tog("v.@tiers", !v.noTiers, "It has Tiers")}${calc && !v.noTiers ? ` <span class="as-calc">${calc.hasExp ? `Exp ${esc(calc.total)} · ` : ""}Avg ${esc(calc.meanAvg)}</span>` : ""}${m.hasModes ? ` <span class="fr-m">Split</span> ${sel('data-as-in="v.mode"', v.mode ?? "", [["", "(not a Split Action)"], ["weapon", "Weapon mode"], ["power", "Power mode"]], "Mode")}` : ""}`]])}
    ${tiers}
    ${grid([["Effects", `<textarea class="fr-ta" rows="3" data-as-in="v.effects" placeholder="The card's Effects line (the book's words)" aria-label="Effects">${esc(v.effects)}</textarea><a class="as-link" data-as="button" role="button" tabindex="0">+ a button in this text</a>`],
      areaOn ? ["Area", `<span class="fr-m">Size</span> ${step("v.@size", v.areaSize || a.size, 1, 30)}${a.keep ? ` <span class="fr-m">Rounds</span> ${step("v.@rounds", v.areaRounds || a.rounds || 0, 0, 20)} <span class="fr-m">0: until removed</span>` : ""}`] : null])}
    <h4 class="as-h4" data-as-anchor="use">On use <small>${v.noTiers ? "Effects applied when the Action is used" : "Effects applied with the card's Effects line (whatever the roll)"}</small></h4>${fxBlock(v, m)}
    <h4 class="as-h4" data-as-anchor="after">After the damage <small>${A.parseAfter(v.after).filter(x => x.kind !== "text").length} step(s)</small></h4>${afterBlock(v, m)}`;
}
function versionsSec(m) {
  const vs = m.sys.versions ?? [], cur = m.v;
  if (!vs.length) return sec("vers", "Versions", "none yet", `<div class="as-empty"><button type="button" class="as-fill" data-as="vadd">+ Version</button><span class="fr-m">an Action needs at least one Version (its AP cost and what it does)</span></div>`);
  const tabs = `<div class="as-vtabs" role="tablist">${vs.map((v, i) => `<button type="button" role="tab" class="as-vtab${i === cur ? " on" : ""}" data-as="vsel" data-v="${i}" aria-selected="${i === cur}">${v.mode ? `${v.mode === "weapon" ? "Weapon" : v.mode === "power" ? "Power" : esc(v.mode)}: ` : ""}${v.ap} AP${m.sys.reaction ? " (R)" : ""}<small>${v.noTiers ? "no Tiers" : esc(m.dmgText(v.t3) || "")}</small></button>`).join("")}<button type="button" class="as-vtab add" data-as="vadd">+ Version</button><span class="as-vtools"><button type="button" data-as="vmove" data-d="-1" aria-label="Earlier">←</button><button type="button" data-as="vmove" data-d="1" aria-label="Later">→</button><button type="button" data-as="vdup">Duplicate</button><button type="button" data-as="vdel">Delete</button></span></div>`;
  return sec("vers", "Versions", `${vs.length} · one tab per AP cost`, `${tabs}<div class="as-vbody">${versionBody(vs[cur], cur, m)}</div>`);
}

/* ------------------------------------------------------------------ the order of events */
function rail(m) {
  const v = (m.sys.versions ?? [])[m.v];
  if (!v) return "";
  const ev = A.versionEvents(m.sys, v, { names: m.names, moments: TWOD12.moments, frequencies: TWOD12.frequencies, dmgText: m.dmgText });
  let sep = false;
  const li = (e, i) => { const s = e.after && !sep ? ((sep = true), `<li class="as-evsep">after the damage lands</li>`) : ""; return `${s}<li><a class="as-ev" data-as="goto" data-to="${e.to}"${e.step != null ? ` data-i="${e.step}"` : ""} role="button" tabindex="0"><span class="as-evn">${i + 1}</span>${kindTile(e.tile, e.cls)}<span class="as-evt"><b>${esc(e.title)}</b>${e.sub ? `<em class="${e.mono ? "mono" : ""}">${esc(e.sub)}</em>` : ""}</span></a></li>`; };
  const always = m.ruleLabels?.length ? `<div class="as-always"><span class="as-railh">Always, while you have it</span>${m.ruleLabels.map(r => `<a class="as-ev" data-as="goto" data-to="rules" role="button" tabindex="0">${kindTile(r.tile, r.cls)}<span class="as-evt"><b>${esc(r.label)}</b></span></a>`).join("")}</div>` : "";
  return `<aside class="as-flow"><span class="as-railh">Order of events <small>the ${m.sys.versions.length > 1 ? `${v.ap} AP ` : ""}Version</small></span><ol class="as-rail">${ev.map(li).join("")}</ol>${always}</aside>`;
}

/* ------------------------------------------------------------------ the tab */
/**
 * m: { sys (plain), v, step, show: {}, names: { uuid: name }, lines: { uuid: hover text }, zoneName, card (html), rulesTab (html), ruleLabels, help,
 *      dmgText(list), isSave, hasModes, basicRatings, basicSuggest, open: Set, stageOpen }
 */
export function actionTabHtml(m0) {
  const sys = m0.sys ?? {}, traits = [...(sys.traits ?? [])];
  const m = { show: {}, names: {}, lines: {}, open: new Set(), dmgText: () => "", step: 0, ...m0, sys, traits, isSave: traits.includes("save"), hasModes: (sys.versions ?? []).some(v => v.mode) };
  m.v = Math.min(Math.max(0, Number(m.v) || 0), Math.max(0, (sys.versions ?? []).length - 1));
  const ranks = Object.entries(TWOD12.automationRanks ?? {});
  const auto = `<details class="fr-auto" data-as-open="auto"${m.open.has("auto") ? " open" : ""}><summary><span class="fr-dia ${sys.automationNote ? "half" : "full"}" aria-hidden="true"></span>${sys.automationNote ? "Partly automated" : "Automated"} <span class="fr-m">· ${esc(TWOD12.automationRanks?.[sys.automation] ?? "(not set)")}</span></summary>
    ${grid([["Rank", sel('name="system.automation"', sys.automation ?? "", ranks, "Automation rank")], ["Players do", `<textarea class="fr-ta" rows="3" name="system.automationNote" placeholder="What the players do themselves" aria-label="Players do">${esc(sys.automationNote)}</textarea>`]])}
    ${help("The rank is the diamond chip the cards show. Players do: what Foundry doesn't do yet (the diamond's tooltip).")}</details>`;
  const rules = sec("rules", "While you have this Action", `${(sys.rules ?? []).length} rule${(sys.rules ?? []).length === 1 ? "" : "s"}`, `<div class="as-rules">${m.rulesTab ?? ""}</div>${help("What its owner has by itself, as on a Feature: a Boon on some Actions, a value, a reminder. Each rule has its own \"Works\".")}`);
  const card = m.card ? `<details class="as-prev" data-as-open="card"${m.open.has("card") ? " open" : ""}><summary>The card <span class="fr-m">what players read</span></summary><div class="as-card">${m.card}</div></details>` : "";
  return `<div class="fr-tab as-tab${m.help ? " fr-helpon" : ""}" data-host="action"><div class="as-flowcols${(sys.versions ?? []).length ? "" : " as-norail"}">${rail(m)}<div class="as-page">${card}${cardSec(m)}${whenSec(m)}${versionsSec(m)}${rules}${auto}
    <div class="as-foot"><button type="button" data-action="openGenerator">Generate Action</button><span class="fr-m">fill the whole Action from one window, written like the card</span></div></div></div></div>`;
}

/* ------------------------------------------------------------------ the events */
const getP = (o, path) => String(path).split(".").reduce((a, k) => (a == null ? a : a[k]), o);
export function wireActionTab(sheet, root) {
  const tab = root.querySelector(".as-tab");
  if (!tab || tab.dataset.asWired) return;
  tab.dataset.asWired = "1";
  const st = (sheet._as ??= { v: 0, step: 0, show: {}, open: new Set(), stageOpen: -1 });
  const item = sheet.item, sys = () => item.system;
  const versions = () => foundry.utils.deepClone(item.toObject().system.versions ?? []);
  const vi = () => Math.min(Math.max(0, st.v), Math.max(0, (sys().versions?.length ?? 1) - 1));
  const isSave = () => !!sys().traits?.has?.("save");
  const upd = async data => { try { await item.update(data); } catch (e) { console.warn("twod12 | action sheet", e); ui.notifications.warn("This Action can't be changed here."); } };
  const mutV = async fn => { const vs = versions(), v = vs[vi()]; if (!v) return; const extra = (await fn(v, vs)) ?? {}; return upd({ "system.versions": vs, ...extra }); };
  const mutSteps = fn => mutV(v => { const steps = A.parseAfter(v.after); fn(steps); v.after = A.writeAfter(steps); });
  const traitsNow = () => [...(sys().traits ?? [])];
  /** The value a control gives, as the field's type. */
  const typed = (cur, v, t) => (t === "b" || typeof cur === "boolean" ? v === true || v === "true" : t === "n" || typeof cur === "number" ? Number(v) || 0 : v);
  /** Change one path: "system.…" on the item; "v.…" in the selected Version; "step.N.…" in its chain; "@…" the special ones. */
  const change = async (f, fn) => {
    if (f === "@area") { const on = (Number(sys().areaCfg?.size) || 0) > 0; return upd({ "system.areaCfg.size": on ? 0 : 1 }); }
    if (f === "@placed") { const v = fn(""); return upd(v === "weapon" ? { "system.areaCfg.withinRange": sys().areaCfg?.withinRange || "normal", "system.areaCfg.within": 0 } : v === "sq" ? { "system.areaCfg.withinRange": "", "system.areaCfg.within": Math.max(1, Number(sys().areaCfg?.within) || 5) } : { "system.areaCfg.withinRange": "", "system.areaCfg.within": 0 }); }
    if (f === "@within") { const v = String(fn("")).trim(); return /^\d*$/.test(v) ? upd({ "system.momentRange": Number(v) || 0, "system.momentRangeExpr": "" }) : upd({ "system.momentRangeExpr": v.toLowerCase().replace(/\s+/g, ""), "system.momentRange": 0 }); }
    if (f.startsWith("system.")) { const cur = getP(item, f); return upd({ [f]: fn(cur) }); }
    if (f.startsWith("v.")) {
      const k = f.slice(2);
      return mutV((v, vs) => {
        if (k === "@tiers") { v.noTiers = !v.noTiers; return; }
        if (k === "@size") { const n = fn(v.areaSize || sys().areaCfg?.size || 1); if (vs.length === 1) { v.areaSize = 0; return { "system.areaCfg.size": n }; } v.areaSize = n; return vs.indexOf(v) === 0 ? { "system.areaCfg.size": n } : {}; }
        if (k === "@rounds") { const n = fn(v.areaRounds || sys().areaCfg?.rounds || 0); if (vs.length === 1) { v.areaRounds = 0; return { "system.areaCfg.rounds": n }; } v.areaRounds = n; return vs.indexOf(v) === 0 ? { "system.areaCfg.rounds": n } : {}; }
        v[k] = fn(v[k]);
        if (k === "ap") v.ap = Math.max(0, Math.min(5, Number(v.ap) || 0));
      });
    }
    if (f.startsWith("step.")) {
      const [, n, ...rest] = f.split("."), i = Number(n), k = rest.join(".");
      return mutSteps(steps => {
        const s = steps[i]; if (!s) return;
        if (k === "text") s.text = String(fn(s.text));
        else if (k === "head") s.head = String(fn(s.head)).trim();
        else if (k === "@on") A.setStepOn(s, fn(A.stepOn(s, isSave())), isSave());
        else if (k === "@down") A.optSet(s, "down", A.optHas(s, "down") ? "" : "yes");
        else if (k === "@bytier") { if (A.moveByTier(s)) { const d = A.optGet(s, "distance") || A.optGet(s, "t1") || A.optGet(s, "t2") || A.optGet(s, "t3") || "1"; for (const t of ["t1", "t2", "t3"]) A.optSet(s, t, ""); A.optSet(s, "distance", d); } else { const d = A.optGet(s, "distance") || "1"; A.optSet(s, "tier", ""); A.optSet(s, "crit", ""); A.optSet(s, "distance", ""); for (const t of (isSave() ? ["t1", "t2"] : ["t1", "t2", "t3"])) A.optSet(s, t, d); } }
        else if (k === "@movewho") { const v = fn(""); A.optSet(s, "pick", v === "target" ? "" : "yes"); if (v === "area") { if (!A.optGet(s, "area")) A.optSet(s, "area", 2); } else A.optSet(s, "area", ""); }
        else if (k === "@dur") { const v = fn(""); s.opts = s.opts.filter(([key, val]) => !(val == null && /^(eot|\d+)$/i.test(key))); A.optSet(s, "rounds", ""); A.optSet(s, "duration", ""); if (v === "eot") s.opts.push(["eot", null]); else if (v === "rounds") A.optSet(s, "rounds", 1); }
        else if (k === "@rounds") { s.opts = s.opts.filter(([key, val]) => !(val == null && /^\d+$/.test(key))); A.optSet(s, "rounds", Math.max(1, Number(fn(1)) || 1)); }
        else if (k === "@stages") { if (A.hasStages(s)) { s.opts = s.opts.filter(([key]) => !/^s\d+$/i.test(key)); st.stageOpen = -1; } else st.stageOpen = i; }
        else if (k === "@other") { const known = new Set(["down", "on", "tier", "crit", "distance", "t1", "t2", "t3", "pick", "area", "from", "value", "rounds", "duration", "eot", "side", "who", "near", ...(TWOD12.stages ?? []).map(x => `s${x.n}`)]); const keep = s.opts.filter(([key]) => known.has(String(key).toLowerCase())); const add = String(fn("")).split("|").map(x => x.trim()).filter(Boolean).map(x => { const j = x.indexOf(":"); return j < 0 ? [x, null] : [x.slice(0, j).trim(), x.slice(j + 1).trim()]; }).filter(([key]) => !known.has(String(key).toLowerCase())); s.opts = [...keep, ...add]; }
        else if (k.startsWith("opt.")) A.optSet(s, k.slice(4), String(fn(A.optGet(s, k.slice(4))) ?? "").trim().replace(/[|\[\]]/g, ""));
      });
    }
  };
  const anchor = to => (to === "card" || to === "when" || to === "vers" || to === "rules" ? tab.querySelector(`[data-as-sec="${to}"]`) : tab.querySelector(`[data-as-anchor="${to}"]`) ?? tab.querySelector('[data-as-sec="vers"]'));
  tab.addEventListener("click", async ev => {
    const b = ev.target.closest("[data-as]");
    if (!b || !tab.contains(b)) return;
    const a = b.dataset.as, f = b.dataset.f, d = b.dataset;
    if (a === "goto") { ev.preventDefault(); if (d.i != null && Number(d.i) !== st.step) { st.step = Number(d.i); st.scrollTo = d.to; return sheet.render(); } return anchor(d.to)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (a === "vsel") { st.v = Number(d.v) || 0; st.step = 0; return sheet.render(); }
    if (a === "stepsel") { st.step = Number(d.i) || 0; return sheet.render(); }
    if (a === "tiertog") { ev.preventDefault(); return mutSteps(steps => { const s = steps[Number(d.i)]; if (!s) return; const save = isSave(); if (d.v === "crit") return void A.setStepTiers(s, [], save, !A.stepTiers(s, save).includes("crit")); const lit = new Set(A.stepTiers(s, save).filter(k => k !== "crit").map(k => Number(k[1]))), n = Number(d.v[1]); if (lit.has(n)) lit.delete(n); else lit.add(n); A.setStepTiers(s, [...lit], save); }); }
    if (a === "show") { st.show[d.v] = true; return sheet.render(); }
    if (a === "openfx") { const doc = d.v ? await fromUuid(d.v) : null; return doc?.sheet?.render(true); }
    ev.preventDefault();
    if (a === "set") return change(f, cur => typed(cur, d.v, d.t));
    if (a === "tog") return change(f, cur => !cur);
    if (a === "step") return change(f, cur => Math.max(Number(d.min), Math.min(Number(d.max), (Number(cur) || 0) + Number(d.d))));
    if (a === "untrait") return upd({ "system.traits": traitsNow().filter(k => k !== d.v) });
    if (a === "vadd") { const vs = versions(), used = vs.map(v => v.ap), ap = [1, 2, 3, 4, 5].find(n => !used.includes(n)) ?? 1; vs.push({ ap, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "", after: "", fx: { all: [], t1: [], t2: [], t3: [] } }); st.v = vs.length - 1; st.step = 0; return upd({ "system.versions": vs }); }
    if (a === "vdup") { const vs = versions(), v = foundry.utils.deepClone(vs[vi()]); if (!v) return; const free = [1, 2, 3, 4, 5].find(n => !vs.some(x => x.ap === n)); if (free) v.ap = free; vs.push(v); st.v = vs.length - 1; return upd({ "system.versions": vs }); }
    if (a === "vdel") { const vs = versions(); if (!vs.length) return; const { pickConfirm } = await import("./pickwindow.mjs"); if (!(await pickConfirm({ name: `Delete the ${vs[vi()].ap} AP Version?`, sub: item.name, icon: "fa-trash", confirm: "Delete", text: "<p>Its Tiers, Effects and steps go with it.</p>" }))) return; vs.splice(vi(), 1); st.v = Math.max(0, vi() - 1); st.step = 0; return upd({ "system.versions": vs }); }
    if (a === "vmove") { const vs = versions(), i = vi(), to = i + Number(d.d); if (to < 0 || to >= vs.length) return; [vs[i], vs[to]] = [vs[to], vs[i]]; st.v = to; return upd({ "system.versions": vs }); }
    if (a === "stepdel") { ev.stopPropagation(); st.step = Math.max(0, st.step - (Number(d.i) <= st.step ? 1 : 0)); return mutSteps(steps => steps.splice(Number(d.i), 1)); }
    if (a === "stepmove") { ev.stopPropagation(); const i = Number(d.i), to = i + Number(d.d); return mutSteps(steps => { if (to < 0 || to >= steps.length) return; [steps[i], steps[to]] = [steps[to], steps[i]]; st.step = to; }); }
    if (a === "fxdel") return mutV(v => { v.fx ??= { all: [], t1: [], t2: [], t3: [] }; (v.fx[d.t] ?? []).splice(Number(d.i), 1); });
    if (a === "fill") return fillFromText();
    // v0.0.356: Create Button, opened from the Effects text: Copy puts the button at its end
    if (a === "button") { const { openBuilder } = await import("./builder.mjs"); return openBuilder({ insert: cmd => mutV(v => { v.effects = `${String(v.effects ?? "").trim()} ${cmd}`.trim(); }) }); }
  });
  tab.addEventListener("keydown", ev => { if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches?.("[data-as][tabindex]")) { ev.preventDefault(); ev.target.click(); } });
  tab.addEventListener("change", async ev => {
    const el = ev.target;
    if (el.matches("[data-as-trait]")) { const v = el.value; el.value = ""; ev.stopPropagation(); if (!v) return; return upd({ "system.traits": [...new Set([...traitsNow(), v])] }); }
    if (el.matches("[data-as-addstep]")) { const k = el.value; el.value = ""; ev.stopPropagation(); if (!k) return; return mutSteps(steps => { steps.push(A.newStep(k)); st.step = steps.length - 1; }); }
    if (el.matches("[data-as-dmg]")) {
      ev.stopPropagation();
      const { parseCardTier } = await import("./genaction.mjs"), p = parseCardTier(el.value);
      if (p.text || p.plain.length) ui.notifications.warn(`Not read as damage: ${p.plain.join("; ") || p.text}. Write it like the card ([V] 1[W] + [R] 1d6 Ho); a Tier's words go in the field under it.`);
      return mutV(v => { v[el.dataset.asDmg] = p.insts; });
    }
    if (el.matches("[data-as-in]")) { ev.stopPropagation(); return change(el.dataset.asIn, () => el.value); }
  }, true);
  tab.querySelectorAll("details[data-as-open]").forEach(dt => dt.addEventListener("toggle", () => { if (dt.open) st.open.add(dt.dataset.asOpen); else st.open.delete(dt.dataset.asOpen); }));
  // Drops: an Effect on "On use / On a Tier 2 or 3", or into an Effect step
  tab.addEventListener("drop", async ev => {
    const zone = ev.target.closest("[data-as-drop]");
    if (!zone) return;   // the rules list handles its own drops (fxsheet.mjs)
    ev.preventDefault(); ev.stopPropagation();
    let data = null;
    try { data = JSON.parse(ev.dataTransfer?.getData("text/plain") || "null"); } catch (e) { data = null; }
    const doc = data?.uuid ? await fromUuid(data.uuid) : null;
    if (!doc || doc.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
    const z = zone.dataset.asDrop;
    if (z === "fx.all") return mutV(v => { v.fx ??= { all: [], t1: [], t2: [], t3: [] }; (v.fx.all ??= []).push({ uuid: doc.uuid, mode: "auto" }); });
    if (z.startsWith("step.")) return mutSteps(steps => { const s = steps[Number(z.split(".")[1])]; if (s) { s.head = doc.uuid; s.label = doc.name; } });
  }, true);
  tab.addEventListener("dragover", ev => { if (ev.target.closest("[data-as-drop]")) ev.preventDefault(); });
  /** "Fill from the Tier text": the steps the Tiers' and the Critical's words make; the GM confirms. */
  async function fillFromText() {
    const v = sys().versions?.[vi()];
    if (!v) return;
    const { convertEffects } = await import("./gen.mjs"), { humanize } = await import("./genaction.mjs");
    const conv = t => (String(t ?? "").includes("@") ? String(t) : convertEffects(String(t ?? "")));
    const texts = { x1: conv(v.x1), x2: conv(v.x2), x3: conv(v.x3), critical: conv(v.critical) };
    const { steps, left } = A.fillSteps(texts, isSave());
    const have = new Set(A.parseAfter(v.after).map(A.writeStep));
    const fresh = steps.filter(s => !have.has(A.writeStep(s)));
    if (!fresh.length) return ui.notifications.info(left.length ? `Nothing to add. Not said as a step: ${left.join("; ")}.` : "Nothing in the Tier text or the Critical reads as a step (or the steps are there already).");
    const { pickConfirm } = await import("./pickwindow.mjs");
    const ok = await pickConfirm({ name: "Fill from the Tier text", sub: `${item.name} · ${v.ap} AP`, icon: "fa-wand-magic-sparkles", confirm: `Add ${fresh.length} step${fresh.length === 1 ? "" : "s"}`,
      text: `<p>These run by themselves once the damage is applied and lands:</p><ul>${fresh.map(s => `<li>${esc(A.stepSentence(s, isSave()))}</li>`).join("")}</ul>${left.length ? `<p>Left as text (a chip can't say it): ${esc(left.join("; "))}.</p>` : ""}<p>The Tier text keeps the book's words (its buttons become plain words, so nothing happens twice).</p>` });
    if (!ok) return;
    return mutV(ver => { ver.after = A.writeAfter([...A.parseAfter(ver.after), ...fresh]); for (const k of ["x1", "x2", "x3", "critical"]) if (String(ver[k] ?? "").includes("@")) ver[k] = humanize(ver[k]); });
  }
  // after a render asked by the rail: go to the part
  if (st.scrollTo) { const to = st.scrollTo; st.scrollTo = ""; anchor(to)?.scrollIntoView({ block: "start" }); }
}
