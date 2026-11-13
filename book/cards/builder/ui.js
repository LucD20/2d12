// The Action Builder's page: the form on the left, the live numbers on the right. Every number comes from engine.js (makeEngine); nothing is priced here.
(function () {
  "use strict";
  const E = makeEngine(DATA, CALC), PC = DATA.pc, NPC = DATA.npc, $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const n1 = x => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, ""), pct = x => `${(x * 100).toFixed(1)}%`, cap = s => s[0].toUpperCase() + s.slice(1);
  const LS = "action-builder-work", LSD = "action-builder-drafts";
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* no storage here */ } };

  /* ------------------------------------------------------------ state */
  const example = (name, tab) => { const d = E.fromCard(DATA.cards.find(c => c.name === name), tab); d.source = `an example: ${name}, as book/cards writes it today`; d.compare = tab === "pc" ? "Holy Wrath" : "Cleaver"; return d; };
  const S = { tab: "pc", ver: { pc: 1, npc: 1 }, drafts: { pc: example("Smite", "pc"), npc: example("Brutal Swing", "npc") }, saved: [], store: "wait", copyText: "", confirm: "" };
  { const w = lsGet(LS); if (w?.drafts?.pc && w?.drafts?.npc) { S.tab = w.tab === "npc" ? "npc" : "pc"; S.ver = w.ver ?? S.ver; S.drafts = { pc: E.normalize(w.drafts.pc), npc: E.normalize(w.drafts.npc) }; } }
  const D = () => S.drafts[S.tab], V = () => D().versions[S.ver[S.tab]] ?? D().versions[0];
  const fixVer = () => { const d = D(); if (!d.versions[S.ver[S.tab]]?.on) S.ver[S.tab] = Math.max(0, d.versions.findIndex(v => v.on)); };

  /* ------------------------------------------------------------ form pieces */
  const fid = k => `f-${k.replace(/\./g, "-")}`;
  const opts = (list, cur) => list.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}"${String(v) === String(cur) ? " selected" : ""}>${esc(l)}</option>`; }).join("");
  const get = k => k.split(".").reduce((o, p) => o?.[p], D());
  const F = (label, k, html, cls = "") => `<label class="f ${cls}" for="${fid(k)}"><span>${esc(label)}</span>${html}</label>`;
  const text = (label, k, cls = "", ph = "") => F(label, k, `<input type="text" id="${fid(k)}" data-k="${k}" value="${esc(get(k))}" placeholder="${esc(ph)}">`, cls);
  const numb = (label, k, cls = "w2", min = 0, max = 9, re = false) => F(label, k, `<input type="number" id="${fid(k)}" data-k="${k}" data-t="n" min="${min}" max="${max}" step="1" value="${esc(get(k))}"${re ? " data-re" : ""}>`, cls);
  const sel = (label, k, list, cls = "", re = false, t = "") => F(label, k, `<select id="${fid(k)}" data-k="${k}"${re ? " data-re" : ""}${t ? ` data-t="${t}"` : ""}>${opts(list, get(k))}</select>`, cls);
  const chk = (label, k, cls = "", re = false) => `<label class="f chk ${cls}" for="${fid(k)}"><input type="checkbox" id="${fid(k)}" data-k="${k}" data-t="b"${get(k) ? " checked" : ""}${re ? " data-re" : ""}><span>${esc(label)}</span></label>`;
  // the card's own lines: a label on the left, its controls on the right (no label above each box)
  const row = (label, html, cls = "") => `<div class="mk-row ${cls}"><span class="mk-l">${esc(label)}</span><div class="mk-c">${html}</div></div>`;
  const tin = (k, aria, ph = "", cls = "") => `<input type="text" class="${cls}" id="${fid(k)}" data-k="${k}" value="${esc(get(k))}" placeholder="${esc(ph)}" aria-label="${esc(aria)}">`;
  const nin = (k, aria, min, max, re = false) => `<input type="number" class="n" id="${fid(k)}" data-k="${k}" data-t="n" min="${min}" max="${max}" step="1" value="${esc(get(k))}" aria-label="${esc(aria)}"${re ? " data-re" : ""}>`;
  const sin = (k, list, aria, re = false, t = "") => `<select id="${fid(k)}" data-k="${k}" aria-label="${esc(aria)}"${re ? " data-re" : ""}${t ? ` data-t="${t}"` : ""}>${opts(list, get(k))}</select>`;
  const cin = (label, k, re = false) => `<label class="ck" for="${fid(k)}"><input type="checkbox" id="${fid(k)}" data-k="${k}" data-t="b"${get(k) ? " checked" : ""}${re ? " data-re" : ""}>${esc(label)}</label>`;
  /** One choice out of a few, all visible: the pressed button is the value. list: [value, label, class]. */
  const seg = (k, list, cur, aria, t = "") => `<span class="seg" role="group" aria-label="${esc(aria)}">${list.map(([v, l, c]) => `<button type="button" class="${c ?? ""}" data-act="set" data-k="${k}" data-v="${esc(v)}"${t ? ` data-t="${t}"` : ""} aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join("")}</span>`;
  const FREQ = ["At-will", "Round", "Turn", "Encounter", "Daily"], ATTR = ["Body", "Mind", "Appeal", "Instinct"], fqClass = f => `fq-${String(f).toLowerCase().replace("-", "")}`;
  const cardOptions = cur => { const by = {}; for (const c of DATA.cards) (by[c.file] ??= []).push(c.name); return `<option value="">Pick a card…</option>` + Object.entries(by).map(([f, names]) => `<optgroup label="${esc(f)}">${opts(names, cur)}</optgroup>`).join(""); };
  function riderOptions(d, first) {
    const groups = {};
    if (d.tab === "npc") for (const r of NPC.riders) (groups[`${cap(r.sev.replace(/beyond\d/, "beyond"))} (${r.price})`] ??= []).push(r.name);
    else for (const r of PC.riders) (groups[`${cap(r.size)} (${PC.riderPrice[r.size]})`] ??= []).push(r.name);
    return `<option value="">${esc(first)}</option>` + Object.entries(groups).map(([g, names]) => `<optgroup label="${esc(g)}">${opts(names, "")}</optgroup>`).join("");
  }
  /* traits: the book's groups in the book's colors; a click puts one on the card or takes it off */
  const traitList = d => String(d.traits).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const KNOWN = new Set(DATA.groups.flatMap(g => g.traits)), ROLL_TRAIT = { weapon: ["weapon"], power: ["power"], save: ["save"] };
  function traitsHtml(d) {
    const have = traitList(d), other = have.filter(t => !KNOWN.has(t));
    return DATA.groups.map(g => `<span class="tgrp" style="--tg:var(--g-${g.key})"><i>${esc(g.title)}</i>${[...g.traits, ...(g.key === "keywords" ? other : [])].map(t => `<button type="button" class="tc" data-act="trait" data-v="${esc(t)}" aria-pressed="${have.includes(t)}">${esc(cap(t))}</button>`).join("")}${g.key === "keywords" ? `<input type="text" class="tc-new" id="f-trait-new" placeholder="another…" aria-label="Another keyword">` : ""}</span>`).join("");
  }
  /* damage as it will print: the pool's color on its terms, the type by its name in its color */
  const DT = Object.fromEntries(DATA.dtypes.map(t => [t.code, t]));
  function dmgHtml(canon) {
    let pool = "V";
    return canon.split(" + ").map(term => { const pm = term.match(/^\[(V|R|B|M)\] /); if (pm) pool = pm[1] === "R" || pm[1] === "M" ? "R" : "V"; const ty = term.match(/ ([A-Z][a-z])$/), t = ty && DT[ty[1]] ? term.slice(0, -3) : term;
      return `<span class="pool-${pool.toLowerCase()}">${esc(t)}</span>${ty && DT[ty[1]] ? ` <span class="dty" style="--dc:${DT[ty[1]].color}">${esc(DT[ty[1]].name)}</span>` : ""}`; }).join(`<span class="plus"> + </span>`);
  }
  function previewHtml(t, i) {
    const canon = E.shortDmg(t.dmg), d = D();
    if (canon === null) return `<span class="pv-bad">Not damage yet. Like: 1w + mod + r 1d8 ho</span>`;
    if (canon === "0") return `<span class="pv-none">No damage on this Tier</span>`;
    return `${dmgHtml(canon)}<span class="pv-avg">average ${n1(E.avgDmg(E.parseDmg(canon), d.tab === "npc" ? E.npcCtx(d) : E.pcCtx(d), i + 1))}</span>`;
  }
  const refreshPreviews = () => V().tiers.forEach((t, i) => { const el = $(`pv-${i}`); if (el) el.innerHTML = previewHtml(t, i); });

  function renderForm() {
    const d = D(), npc = d.tab === "npc", vi = S.ver[S.tab], v = V(), save = E.isSave(d), none = E.noRoll(d), p = `versions.${vi}`, fq = fqClass(d.frequency);
    const best = save ? "Tier 1 only (the worst Save)" : "Tier 3 only";
    const helpKinds = npc ? [["boon", "1 Boon on the next attack"], ["heal", "Heals"], ["basic", "Makes its Basic attack"]] : [["heal", "Heals (new Health)"], ["rally", "Uses a Rally Point (+ more)"], ["guard", "Guard"], ["defense", "+1 Defense (1 round)"], ["block", "Reduces the damage"]];
    const h = [], rows = [];
    /* the card, in the order it is written: Name, Traits, Frequency, Kind, the Defense, the Modifier, Targets */
    if (npc) rows.push(row("Creature", `${tin("npc", "The NPC it belongs to", "Orc Warrior", "grow")}${sin("rank", NPC.ranks.map(r => [r, NPC.rank[r].label]), "Rank", true)}${cin("Its Basic attack", "basic")}`));
    rows.push(row("Traits", traitsHtml(d), "traits"));
    rows.push(row("Frequency", seg("frequency", FREQ.map(f => [f, f, fqClass(f)]), d.frequency, "Frequency")));
    rows.push(row("Kind", seg("kind", [["weapon", "Weapon"], ["power", "Power"], ["save", "Save"], ["none", "No roll"]], d.kind, "Kind") + `<span class="say">${none ? "it always happens" : save ? `the target rolls against DC 11 + ${npc ? "its" : "your"} Modifier` : `2d12 + ${npc ? "its" : "your"} Modifier`}</span>`));
    if (!none) rows.push(row(save ? "Save" : "Vs.", seg("vs", (save ? ATTR : ["AD", "WD", ...ATTR]).map(x => [x, x, `vs-${x.toLowerCase()}`]), save && !ATTR.includes(d.vs) ? "Body" : d.vs, save ? "The Save it asks for" : "The Defense it targets")));
    if (npc) rows.push(row("Modifier", `${sin("modRating", NPC.ratings.map(r => [r, `${cap(r)} (+${NPC.rank[d.rank].modBy[Math.min(NPC.ratings.indexOf(r), NPC.rank[d.rank].modBy.length - 1)]})`]), "Modifier rating")}<span class="say">damage</span>${sin("rating", NPC.ratings.map(r => [r, cap(r)]), "Damage rating")}${cin("Ranged (more than 2 squares)", "ranged")}${cin("Four or more carry its riders", "four")}`));
    else if (!none) rows.push(row("Modifier", seg("rollMod", [0, 1, 2, 3, 4].map(x => [x, `+${x}`]), E.pcCtx(d).rollMod, "The Modifier it rolls with", "n") + `<span class="say">the roll's, and the [Mod] of its damage</span>`));
    const tg = [seg("target", [["one", "One creature"], ["several", "Several"], ["area", "An Area"]], d.target, "Targets")];
    if (d.target === "several") tg.push(nin("targetsN", "How many creatures", 2, 6));
    if (d.target === "area") tg.push(nin("areaSize", "The Area's size", 1, 6), sin("areaShape", ["Emanation", "Burst", "Aura"], "The Area's shape", true), d.areaShape === "Aura" ? "" : sin("areaFrom", [["self", "around you"], ["range", "at range"]], "Where the Area is placed"));
    tg.push(`<span class="say">distance</span>`, tin("distance", "Distance", "Weapon, Reach, 5 sq.", "grow"));
    rows.push(row("Targets", tg.join("")));
    rows.push(row("", tin("targetText", "Targets line, if not the usual", `Targets line, if not "${E.targetLine({ ...d, targetText: "" })}"`, "grow"), "cont"));
    const rx = [sin("reaction", [["", "Not a Reaction"], ["interrupt", "An Interrupt"], ["trigger", "A Trigger"]], "Is it a Reaction?", true)];
    if (d.reaction) rx.push(seg("reactionCost", [[1, "1R"], [2, "2R"]], d.reactionCost, "The Reaction's cost", "n"), tin("reactionText", d.reaction === "interrupt" ? "Interrupt" : "Trigger", "An enemy within 5 squares makes a Strike against an ally.", "grow"));
    rows.push(row("Reaction", rx.join("")));
    if (d.reaction) rows.push(row("", npc ? `<span class="say">it answers</span>${sin("rxKind", [["self", "its own being hit or targeted"], ["other", "an ally or a movement"]], "What it answers")}` : `<span class="say">it fires in</span>${sin("fires", [[0.5, "half the rounds (the target)"], ...PC.reactions.map(r => [r.fires, `${Math.round(r.fires * 100)}% (${r.name}, measured)`]), [0.25, "a quarter"], [1, "every round"]], "How often it fires", false, "n")}`, "cont"));
    h.push(`<div class="mk ${fq}${npc ? ` rk-${d.rank}` : ""}"><div class="mk-plate"><input type="text" class="mk-name" id="f-name" data-k="name" value="${esc(d.name)}" placeholder="Name" aria-label="Name"><span class="mk-cost" id="mk-cost">${esc(E.costLine(d))} · ${esc(d.frequency)}</span></div>${rows.join("")}</div>`);

    /* Versions: the Tiers in their colors; the damage is typed, the riders are picked on their Tier */
    const vt = d.versions.map((x, i) => `<span class="vtab"><input type="checkbox" id="f-on-${i}" data-k="versions.${i}.on" data-t="b" data-re aria-label="${x.ap} AP Version exists"${x.on ? " checked" : ""}><button type="button" data-act="ver" data-i="${i}" aria-pressed="${i === vi}"${x.on ? "" : " disabled"}>${d.reaction ? `${d.reactionCost}R${i ? ` (${i + 1})` : ""}` : `${x.ap} AP`}</button></span>`).join("");
    const chips = (names, w) => names.map(nm => `<button type="button" class="rc" data-act="unrider" data-w="${w}" data-n="${esc(nm)}" aria-label="Remove ${esc(nm)}">${esc(nm)}<b aria-hidden="true">×</b></button>`).join("");
    const adder = (w, first, aria) => `<select class="radd" data-add="${w}" aria-label="${esc(aria)}">${riderOptions(d, first)}</select>`;
    const tierRow = (t, i) => { const k = `${p}.tiers.${i}`;
      return `<div class="tr t${i + 1}"><span class="tn">Tier ${i + 1}</span>
        <div class="tr-d"><input type="text" class="dmg" id="${fid(`${k}.dmg`)}" data-k="${k}.dmg" data-pv value="${esc(t.dmg)}" placeholder="${npc ? "4 + 1d6 bl" : i ? "1w + mod + r 1d8 ho" : "1w"}" aria-label="Tier ${i + 1}: damage" autocomplete="off" spellcheck="false"><div class="pv" id="pv-${i}">${previewHtml(t, i)}</div></div>
        <div class="tr-t"><div class="then"><span class="say">then</span>${chips(t.riders, i)}${adder(i, "+ rider", `Tier ${i + 1}: add a rider`)}</div><input type="text" id="${fid(`${k}.text`)}" data-k="${k}.text" value="${esc(t.text)}" placeholder="other text on this Tier" aria-label="Tier ${i + 1}: other text"></div></div>`; };
    const fxRow = (at, label, sub) => `<div class="tr fx"><span class="tn">${label}</span><div class="tr-w"><div class="then">${chips(v.riders.filter(r => r.name && r.at === at).map(r => r.name), at)}${adder(at, "+ rider", `${label}: add a rider`)}<span class="say">${sub}</span></div></div></div>`;
    const helps = v.helps.map((x, i) => { const k = `${p}.helps.${i}`; return `<div class="row help"><select id="${fid(`${k}.kind`)}" data-k="${k}.kind" data-re aria-label="Help ${i + 1}">${opts(helpKinds, x.kind)}</select>
      <input type="text" id="${fid(`${k}.amount`)}" data-k="${k}.amount" value="${esc(x.amount)}" placeholder="${x.kind === "defense" || x.kind === "boon" || x.kind === "basic" ? "–" : "1d8 + [Mod]"}" aria-label="Help ${i + 1}: how much"${x.kind === "defense" || x.kind === "boon" || x.kind === "basic" ? " disabled" : ""}>
      <select id="${fid(`${k}.who`)}" data-k="${k}.who" aria-label="Help ${i + 1}: who">${opts([["self", npc ? "itself" : "you"], ["ally", "an ally"], ["allies", "several allies"]], x.who)}</select>
      <input type="number" min="1" max="6" id="${fid(`${k}.n`)}" data-k="${k}.n" data-t="n" value="${esc(x.n)}" aria-label="Help ${i + 1}: how many allies">
      <select id="${fid(`${k}.at`)}" data-k="${k}.at" aria-label="Help ${i + 1}: when">${opts(none ? [["always", "Always"]] : [["always", "Always"], ["hit", "On a hit"], ["t3", best]], x.at)}</select>
      <button type="button" class="btn plain" data-act="del" data-list="helps" data-i="${i}" aria-label="Remove help ${i + 1}">Remove</button></div>`; }).join("");
    h.push(`<div class="vr ${fq}"><div class="vr-head"><h2>Versions <small>tick the ones the card has, click one to write it</small></h2><div class="vtabs">${vt}</div></div>
      <div class="vr-bar"><span>${d.reaction ? `${d.reactionCost}R` : `${v.ap} AP`}</span><span>${esc(d.frequency)}</span></div>
      <div class="vr-body">${none ? "" : v.tiers.map(tierRow).join("")}
      ${none ? "" : fxRow("hit", "Hit", save ? "on Tier 1 and Tier 2 (the Effects line)" : "on Tier 2 and Tier 3 (the Effects line)")}${fxRow("always", npc && !none ? "Setup" : "Always", none ? "it has no roll" : npc ? "before the roll, whatever the result" : "whatever the result")}
      <div class="tr fx"><span class="tn">Effects</span><div class="tr-w"><textarea id="${fid(`${p}.effects`)}" data-k="${p}.effects" placeholder="What the rows above don't say." aria-label="Effects text">${esc(v.effects)}</textarea></div></div>
      <div class="tr cr"><span class="tn">Critical</span><div class="tr-w">${tin(`${p}.critical`, "Critical")}</div></div></div>
      ${none ? "" : `<p class="hint"><b>Damage:</b> <code>w</code> = [W], <code>mod</code> = [Mod], <code>v</code> or <code>r</code> before a piece = its pool (Vigor, Resolve; none = the one before it), then the type (${DATA.dtypes.map(t => t.code.toLowerCase()).join(", ")}, or its name). <code>d6!</code> explodes. ${npc ? "An NPC's damage is written whole: no w, no mod." : "<code>1w + mod + r 1d8 ho</code> prints as [V] 1[W] + [Mod] + [R] 1d8 Holy."}</p>`}
      ${npc ? "" : `<div class="more"><span class="say">It makes</span>${sin(`${p}.linked`, [[0, "no Weapon Attack"], [1, "1 Weapon Attack (1A)"], [2, "2 Weapon Attacks (1A)"], [3, "3 Weapon Attacks (1A)"]], "Weapon Attacks it makes", false, "n")}<span class="say">each dealing</span>${tin(`${p}.linkedExtra`, "Each Weapon Attack deals this much more", "1d6")}<span class="say">more</span></div>`}
      <p class="sub">${npc ? "Helps" : "Heal, Guard and helps"} <small>${npc ? "a Boon 3 points, a Health 1" : `a Health ${PC.health} points, a point of Guard ${PC.guard}`}</small><button type="button" class="btn small" data-act="add" data-list="helps">Add one</button></p><div class="rows">${helps}</div></div>`);
    h.push(`<div><h2>Drafts <small id="store-note"></small></h2><ul class="drafts" id="drafts"></ul></div>`);
    const act = document.activeElement?.id; $("form").innerHTML = h.join(""); if (act && $(act)) $(act).focus();
    renderDrafts();
  }
  /* what the numbers assume and the card doesn't say: out of the way of the card (Lucas, 2026-11-13) */
  function renderTest() {
    const d = D(), npc = d.tab === "npc", none = E.noRoll(d), f = [];
    if (!npc) f.push(sel("Build", "cls", [...DATA.builds.map(b => b.name), "Other"], "w4", true), sel("Weapon", "weapon", DATA.weapons.map(w => [w.name, `${w.name} (${w.tiers.slice(1).join(" / ")})`]), "w4", true),
      sel("Weapon Modifier", "wmod", [0, 1, 2, 3, 4].map(x => [x, `+${x}`]), "w2", true, "n"), sel("Power Modifier", "pmod", [0, 1, 2, 3, 4].map(x => [x, `+${x}`]), "w2", true, "n"));
    if (!none) f.push(numb("Boons", "boons"), numb("Banes", "banes"), sel("The roll is", "state", [["", "normal"], ["favored", "Favored"], ["doomed", "Doomed"]], ""));
    if (!npc) f.push(sel("Priced for", "fight", PC.fights.map(x => [x.key, x.label])), chk("Against an Elite", "elite"));
    $("o-test").innerHTML = f.length ? `<h2>Tested with <small>not on the card: what the numbers assume</small></h2><div class="grid">${f.join("")}</div>` : "";
  }

  /* ------------------------------------------------------------ the right side */
  const rich = s => esc(E.stripLinks(s));
  const cellHtml = cell => { const c = E.parseCell(cell), canon = c.raw === "0" ? null : E.shortDmg(c.raw); return canon && canon !== "0" ? `${dmgHtml(canon)}${c.text ? `; ${rich(c.text)}` : ""}` : rich(c.text || cell); };
  function cardHtml(d) {
    const c = E.toCard(d), fq = `fq-${d.frequency.toLowerCase().replace("-", "")}`, line = (k, val) => (val ? `<p class="sb-line"><b>${k}:</b> ${rich(val)}</p>` : "");
    const vers = d.versions.filter(v => v.on).map((v, i) => { const cv = c.versions[i], tiers = cv.tiers ? cv.tiers.map((t, k) => `<p class="sb-tier t${k + 1}"><b>Tier ${k + 1}</b><span>${cellHtml(t)}</span></p>`).join("") : "";
      return `<div class="sb-ver"><div class="sb-bar"><span>${d.reaction ? `${d.reactionCost}R` : `${v.ap} AP`}</span><span>${esc(d.frequency)}</span></div><div class="sb-tint">${tiers}${cv.critical ? `<p class="sb-tier cr"><b>Critical</b><span>${rich(cv.critical)}</span></p>` : ""}${cv.effects ? `<p class="sb-fx"><b>Effects</b> ${rich(cv.effects)}</p>` : ""}</div></div>`; }).join("");
    return `<article class="sb ${fq}"><header class="sb-plate${d.tab === "npc" ? ` rk-${d.rank}` : ""}"><span class="sb-name">${esc(c.name)}</span><span class="sb-cat">${esc([[c.category, c.level].filter(x => x != null && x !== "").join(" "), E.costLine(d)].filter(Boolean).join(" · "))}</span></header>
      <div class="sb-body">${c.flavor ? `<p class="sb-flavor">${esc(c.flavor)}</p>` : ""}${c.traits.length ? `<p class="sb-line sb-traits">${DATA.groups.map(g => { const ts = c.traits.filter(t => g.traits.includes(t) || (g.key === "keywords" && !KNOWN.has(t))); return ts.length ? `<span style="--tg:var(--g-${g.key})">${ts.map(t => esc(cap(t))).join(" · ")}</span>` : ""; }).join("")}</p>` : ""}${line(d.reaction === "interrupt" ? "Interrupt" : "Trigger", d.reaction ? c[d.reaction] || "…" : "")}${line("Targets", c.target)}${line("Area", c.area)}${line("Distance", c.distance)}${line("Vs.", c.vs)}${line("Setup", c.setup)}${vers}</div></article>`;
  }
  function budgetHtml(d, v, r) {
    const max = Math.max(r.band[1] * 1.5, r.total * 1.12, 1), w = x => `${Math.max(0, Math.min(100, 100 * x / max)).toFixed(2)}%`, word = { on: "within limits", over: "over budget", under: "under budget" }[r.verdict];
    const diff = r.total - r.budget;
    return `<div class="bud"><div class="bud-head"><span class="bud-ap">${d.reaction ? `${d.reactionCost}R Reaction` : `${v.ap} AP`} · ${esc(d.frequency)}</span><span class="bud-num">${n1(r.total)} <small>of ${n1(r.budget)} points${r.rx ? " a turn" : ""}</small></span><span class="verdict v-${r.verdict}">${word}${r.verdict === "on" ? "" : ` by ${n1(Math.abs(r.total - (r.verdict === "over" ? r.band[1] : r.band[0])))}`}</span></div>
      <div class="bar" role="img" aria-label="${n1(r.total)} points against ${n1(r.budget)}: ${word}"><i class="band" style="left:${w(r.band[0])};width:${w(r.band[1] - r.band[0])}"></i><i class="fill v-${r.verdict}" style="width:${w(r.total)}"></i><i class="tick" style="left:${w(r.budget)}"></i></div>
      <p class="cap">${r.rx ? `A ${d.reactionCost}R Reaction should add ${n1(r.band[0])} to ${n1(r.band[1])} points a turn. It fires in ${Math.round(r.rx.fires * 100)}% of rounds; each time, ${n1(r.rx.raw)} points (its damage counts ${Math.round(r.rx.damageShare * 100)}% off-turn, measured on Overwatch).` : d.tab === "npc" ? `Should cost ${n1(r.budget)} (${n1(r.perAp)} an AP; the turn budget is ${n1(r.turnBudget)}); within limits from ${n1(r.band[0])} to ${n1(r.band[1])}.` : `Should cost ${n1(r.budget)}; within limits from ${n1(r.band[0])} to ${n1(r.band[1])}. ${diff > 0 ? `${n1(diff)} over: each 10 points over is felt.` : diff < -0.05 ? `${n1(-diff)} left to spend.` : ""}`}</p>
      <ul class="lines">${r.lines.map(l => `<li><span>${esc(l.what)}</span><span>${n1(l.pts)}</span>${l.note ? `<em>${esc(l.note)}</em>` : ""}</li>`).join("") || `<li><span>Nothing priced yet</span><span>0</span></li>`}</ul>
      ${r.buys ? `<p class="note">The points left for damage (${n1(r.left)}) buy <b>${esc(r.buys[0])} / ${esc(r.buys[1])}</b> on Tier 2 / Tier 3${r.table ? `. The rank's table for this ${r.tableKey === "basic" ? "Basic attack" : "Special"}: ${esc(r.table.join(" / "))}` : ""}.</p>` : ""}
      ${r.targets?.area ? `<p class="note">It catches about <b>${n1(r.targets.area.hit[0])}</b> of 4 Standards and <b>${n1(r.targets.area.hit[1])}</b> of 6 (${esc(r.targets.area.rows.map(a => `${a.card}: ${a.hit.join(" · ")}`).join("; "))}): about ${n1(r.exp13 * r.targets.area.hit[0])} to ${n1(r.exp13 * r.targets.area.hit[1])} damage a use.</p>` : ""}
      ${r.flags.map(f => `<p class="flag ${f.level}">${esc(f.text)}</p>`).join("")}</div>`;
  }
  function rollHtml(d, v, r) {
    const save = E.isSave(d);
    if (E.noRoll(d)) return `<p class="note">No roll: it always happens.</p>`;
    return `<p class="cap">${save ? `The target's Save against DC ${11 + r.ctx.rollMod}` : `2d12 + ${r.ctx.rollMod}`}${d.boons || d.banes ? `, ${d.boons || 0} Boon${d.boons === 1 ? "" : "s"} and ${d.banes || 0} Bane${d.banes === 1 ? "" : "s"}` : ""}${d.state ? `, ${cap(d.state)}` : ""}. Average damage on Tier 1 / 2 / 3: <b>${r.avgs.map(n1).join(" / ")}</b>${r.linkAvg ? `, and its Weapon Attacks ${n1(r.linkAvg)} more at Defense 13` : ""}.</p>
      <div class="scroll"><table class="nums"><thead><tr><th>${save ? "Its Save Modifier" : "Defense"}</th><th class="t1">Tier 1</th><th class="t2">Tier 2</th><th class="t3">Tier 3</th>${save ? "" : `<th class="cr">Critical</th>`}<th>Average damage</th><th>Deals 0</th></tr></thead><tbody>
      ${r.perDef.map(x => `<tr><td>${save ? `+${x.dc}` : x.dc}</td><td>${pct(x.p[0])}</td><td>${pct(x.p[1])}</td><td>${pct(x.p[2])}</td>${save ? "" : `<td>${pct(x.crit)}</td>`}<td>${n1(x.exp)}</td><td>${pct(x.zero)}</td></tr>`).join("")}</tbody></table></div>`;
  }
  function compareHtml(d) {
    const rows = [], plain = E.plainRow(d), tr = (name, ap, x, extra = "", cls = "") => `<tr class="${cls}"><td>${esc(name)}</td><td>${ap}</td><td>${x.avgs.map(n1).join(" / ")}</td><td>${n1(x.exp)}</td><td>${pct(x.zero)}</td><td>${n1(x.points)}${extra}</td></tr>`;
    for (const v of d.versions.filter(x => x.on)) { const r = E.price(d, v); rows.push(tr(d.name || "This Action", d.reaction ? `${d.reactionCost}R` : v.ap, { avgs: r.avgs, exp: r.exp13, zero: r.zero13, points: d.tab === "npc" ? r.dmgPts : r.dmgPts + r.linkedPts })); }
    rows.push(tr(plain.name, 1, plain, "", "sep"));
    const card = DATA.cards.find(c => c.name === d.compare);
    if (card) E.cardStats(card, d).forEach((x, i) => rows.push(tr(`${card.name}${card.versions.length > 1 ? ` ${x.ap}` : ""}`, card.interrupt || card.trigger ? `${x.ap}R` : x.ap, x, x.ledger.length ? ` <span class="cap">(pc-budget.md: ${x.ledger.join(" or ")})</span>` : "", i ? "dim" : "sep dim")));
    return `<div class="grid" style="margin-bottom:6px">${F("Compare with", "compare", `<select id="f-compare" data-k="compare" data-re>${cardOptions(d.compare)}</select>`, "w6")}</div>
      <div class="scroll"><table class="nums"><thead><tr><th>Action</th><th>AP</th><th>Tier 1 / 2 / 3</th><th>Average at Defense 13</th><th>Deals 0</th><th>Damage points</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
      <p class="cap">Damage only, on one creature, with ${d.tab === "npc" ? "this NPC's Modifier" : "this PC's weapon and Modifiers"}; a card's riders, heals and areas are not in its row.${card ? ` ${esc(card.name)}: ${esc(card.versions.map(cv => E.stripLinks(cv.effects ?? "")).filter(Boolean)[0] ?? "no Effects text")}` : ""}</p>`;
  }
  function sheetHtml(d, r) {
    if (d.tab === "npc") return `<dl class="facts"><div><dt>${esc(NPC.rank[d.rank].label)}, ${esc(d.rating)}</dt><dd>${n1(r.perAp)} points an AP</dd></div><div><dt>Turn budget</dt><dd>${n1(r.turnBudget)}</dd></div><div><dt>Modifier</dt><dd>+${r.sheet.mod}</dd></div><div><dt>Defense at that rating</dt><dd>${r.sheet.defense}</dd></div><div><dt>Vigor or Resolve</dt><dd>${r.sheet.health}</dd></div><div><dt>AP a turn</dt><dd>${r.sheet.ap}</dd></div><div><dt>CV</dt><dd>${r.sheet.cv}</dd></div></dl>`;
    const seat = PC.seats[r.ctx.seat];
    return `<dl class="facts"><div><dt>A Weapon Attack</dt><dd>25 points = ${r.wa.avgs.slice(1).map(n1).join(" / ")} (${n1(r.wa.exp)} at Defense 13)</dd></div><div><dt>A plain turn of three</dt><dd>100</dd></div><div><dt>A class by level</dt><dd>${PC.classTarget.join(" / ")}</dd></div><div><dt>100 points in the ${r.ctx.seat} seat</dt><dd>${seat.health100} Health saved a fight</dd></div></dl>`;
  }
  function renderOut() {
    const d = D(), v = V(), on = d.versions.filter(x => x.on), res = on.map(x => E.price(d, x)), cur = res[on.indexOf(v)] ?? res[0];
    $("o-card").innerHTML = `<h2>The card <small>as the book would print it${d.source ? ` · ${esc(d.source)}` : ""}</small></h2>${cardHtml(d)}`;
    $("o-budget").innerHTML = `<h2>${d.tab === "npc" ? "The Bestiary's turn budget" : "The PC budget"} <small>${esc(DATA.stage)}; a guide, not perfect balance</small></h2>${sheetHtml(d, cur)}<div style="margin-top:8px">${on.map((x, i) => budgetHtml(d, x, res[i])).join("")}</div>`;
    $("o-roll").innerHTML = `<h2>The roll <small>the ${d.reaction ? "Reaction" : `${v.ap} AP Version`}; the system's own dice (calc.mjs)</small></h2>${rollHtml(d, v, cur)}`;
    $("o-compare").innerHTML = `<h2>Beside other Actions</h2>${compareHtml(d)}`;
    $("o-copy").innerHTML = S.copyText ? `<h2>Copy for Claude <small>select all and copy if the button couldn't</small></h2><textarea class="copybox" id="copybox" readonly aria-label="The text for Claude">${esc(S.copyText)}</textarea>` : "";
    const mc = $("mk-cost"); if (mc) mc.textContent = `${E.costLine(d)} · ${d.frequency}`;
    lsSet(LS, { tab: S.tab, ver: S.ver, drafts: S.drafts });
  }
  function renderTop() {
    $("stage").innerHTML = `<b>${esc(DATA.stage)}</b> only · the budgets as measured on ${esc(DATA.generated)}`;
    for (const t of ["pc", "npc"]) $(`tab-${t}`).setAttribute("aria-selected", String(S.tab === t));
    $("import").innerHTML = cardOptions(""); $("blank").textContent = `Blank ${S.tab === "npc" ? "NPC" : "PC"} Action`;
  }
  const all = () => { fixVer(); renderTop(); renderForm(); renderTest(); renderOut(); };

  /* ------------------------------------------------------------ drafts: the artifact's own store, the browser's when there is none */
  let db = null;
  function renderDrafts() {
    const ul = $("drafts"); if (!ul) return;
    $("store-note").textContent = S.store === "db" ? "kept with this page, for you and Claude" : S.store === "wait" ? "looking for the page's store…" : "kept in this browser only (the page's store didn't answer)";
    ul.innerHTML = S.saved.length ? S.saved.slice().sort((a, b) => String(b.updated).localeCompare(String(a.updated))).map(x => `<li><b>${esc(x.name || "Unnamed Action")}</b><span>${x.tab === "npc" ? "NPC" : "PC"} · ${esc(String(x.updated ?? "").slice(0, 16).replace("T", " "))}</span><span class="sp"><button type="button" class="btn small" data-act="load" data-id="${esc(x.id)}">Open</button><button type="button" class="btn small plain" data-act="drop" data-id="${esc(x.id)}">${S.confirm === x.id ? "Delete it for good?" : "Delete"}</button></span></li>`).join("") : `<li><span>No draft saved yet. "Save draft" keeps the Action on the left; the last thing you were editing is always kept in this browser.</span></li>`;
  }
  const localDrafts = () => { S.saved = lsGet(LSD) ?? []; renderDrafts(); };
  async function initStore() {
    try { db = (await window.claude?.use?.("db")) ?? null; } catch { db = null; }
    if (!db) { S.store = "browser"; localDrafts(); return; }
    const late = setTimeout(() => { if (S.store === "wait") { S.store = "browser"; localDrafts(); } }, 10000);
    db.collection("drafts").onSnapshot(snap => { clearTimeout(late); S.store = "db"; S.saved = snap.docs.map(x => ({ id: x.id, ...x.data() })); renderDrafts(); }, () => { clearTimeout(late); db = null; S.store = "browser"; localDrafts(); });
  }
  const say = t => { $("status").textContent = t; clearTimeout(say.t); say.t = setTimeout(() => { $("status").textContent = ""; }, 4000); };
  async function saveDraft() {
    const d = D(); d.id ||= `d${Date.now().toString(36)}`;
    const doc = { name: d.name || "Unnamed Action", tab: d.tab, updated: new Date().toISOString(), draft: E.clone(d), card: E.toCard(d) };
    if (db && S.store === "db") { try { await db.collection("drafts").doc(d.id).set(doc); say("Draft saved"); } catch (e) { say(e?.code === "quota_exceeded" ? "The store is full: delete a draft" : "Not saved: the page's store refused it"); } }
    else { const list = (lsGet(LSD) ?? []).filter(x => x.id !== d.id); list.push({ id: d.id, ...doc }); lsSet(LSD, list); localDrafts(); say("Draft saved in this browser"); }
    renderOut();
  }
  async function dropDraft(id) {
    if (S.confirm !== id) { S.confirm = id; renderDrafts(); return; }
    S.confirm = "";
    if (db && S.store === "db") { try { await db.collection("drafts").doc(id).delete(); say("Draft deleted"); } catch { say("Not deleted"); } }
    else { lsSet(LSD, (lsGet(LSD) ?? []).filter(x => x.id !== id)); localDrafts(); }
  }

  /* ------------------------------------------------------------ events */
  function setPath(k, val) { const parts = k.split("."), last = parts.pop(), o = parts.reduce((x, p) => x[p], D()); o[last] = val; }
  /** A value into the draft, with what follows from it (a build's weapon, a Kind's Defense and trait, a Reaction's one Version). */
  function apply(k, val) {
    const d = D(); setPath(k, val);
    if (k === "cls") { const b = DATA.builds.find(x => x.name === val); if (b) Object.assign(d, { weapon: b.weapon, wmod: b.wmod, pmod: b.pmod }); }
    if (k === "kind") {
      d.vs = val === "save" ? (ATTR.includes(d.vs) ? d.vs : "Body") : val === "power" ? (d.vs === "AD" ? "WD" : d.vs) : d.vs;
      const keep = traitList(d).filter(t => !(val === "weapon" && (t === "power" || t === "save")) && !(val === "power" && (t === "weapon" || t === "save")) && !(val === "none" && t === "save"));
      for (const t of ROLL_TRAIT[val] ?? []) if (!keep.includes(t)) keep.push(t); d.traits = keep.join(", ");
      if (val === "none") for (const v of d.versions) { for (const r of v.riders) r.at = "always"; for (const h of v.helps) h.at = "always"; }
    }
    if (k === "rank" && d.rank === "minion") { if (d.rating === "extreme") d.rating = "high"; if (d.modRating === "extreme") d.modRating = "high"; }
    if (/\.on$/.test(k) && !d.versions.some(v => v.on)) setPath(k, true);
    if (k === "reaction" && val) { d.versions.forEach((v, i) => { v.on = i === 0; }); if (d.frequency !== "Turn" && d.frequency !== "Round") d.frequency = "Turn"; }
  }
  const typed = (el, raw) => (el.dataset.t === "b" ? el.checked : el.dataset.t === "n" ? (raw === "" ? 0 : Number(raw)) : raw);
  function onEdit(e) {
    const el = e.target, k = el.dataset?.k; if (!k || el.tagName === "BUTTON") return;
    if (e.type === "input" && (el.tagName === "SELECT" || el.type === "checkbox")) return;   // those report on "change"
    if (e.type === "change" && !(el.tagName === "SELECT" || el.type === "checkbox")) return;
    apply(k, typed(el, el.value));
    if (el.dataset.re != null) all(); else { if (el.dataset.pv != null) refreshPreviews(); renderOut(); }
  }
  const cols = $("cols"); cols.addEventListener("input", onEdit); cols.addEventListener("change", onEdit);
  function addTrait(t) { const d = D(), have = traitList(d), i = have.indexOf(t); if (!t) return; if (i < 0) have.push(t); else have.splice(i, 1); d.traits = have.join(", "); all(); }
  $("form").addEventListener("change", e => {
    const el = e.target, d = D(), v = V();
    if (el.id === "f-trait-new") { const t = el.value.trim().toLowerCase(); if (t && !traitList(d).includes(t)) addTrait(t); else { el.value = ""; } return; }
    if (el.dataset?.add == null || !el.value) return;
    const w = el.dataset.add;
    if (w === "hit" || w === "always") { if (!v.riders.some(r => r.name === el.value && r.at === w)) v.riders.push({ name: el.value, at: w }); }
    else if (!v.tiers[Number(w)].riders.includes(el.value)) v.tiers[Number(w)].riders.push(el.value);
    all(); document.querySelector(`[data-add="${w}"]`)?.focus();
  });
  $("import").addEventListener("change", e => {
    if (!e.target.value) return;
    const card = DATA.cards.find(c => c.name === e.target.value), old = D(), d = E.fromCard(card, S.tab);
    for (const k of ["cls", "weapon", "wmod", "pmod", "rank", "rating", "modRating", "fight", "elite", "compare"]) d[k] = old[k];
    d.source = `filled from ${card.name} (${card.file})`; S.drafts[S.tab] = d; S.ver[S.tab] = Math.max(0, d.versions.findIndex(v => v.on)); S.copyText = ""; e.target.value = ""; all();
  });
  $("blank").addEventListener("click", () => { const old = D(), n = E.blankDraft(S.tab); for (const k of ["cls", "weapon", "wmod", "pmod", "rank", "rating", "modRating"]) n[k] = old[k]; n.source = ""; S.drafts[S.tab] = n; S.ver[S.tab] = 0; S.copyText = ""; all(); $("f-name")?.focus(); });
  $("form").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return; const a = b.dataset.act, d = D(), v = V();
    if (a === "ver") { S.ver[S.tab] = Number(b.dataset.i); all(); }
    else if (a === "set") { apply(b.dataset.k, typed(b, b.dataset.v)); all(); document.querySelector(`[data-act="set"][data-k="${b.dataset.k}"][aria-pressed="true"]`)?.focus(); }
    else if (a === "trait") { addTrait(b.dataset.v); document.querySelector(`[data-act="trait"][data-v="${b.dataset.v}"]`)?.focus(); }
    else if (a === "unrider") { const w = b.dataset.w, nm = b.dataset.n; if (w === "hit" || w === "always") v.riders = v.riders.filter(r => !(r.name === nm && r.at === w)); else v.tiers[Number(w)].riders = v.tiers[Number(w)].riders.filter(x => x !== nm); all(); }
    else if (a === "add") { v.helps.push({ kind: d.tab === "npc" ? "boon" : "heal", amount: "", who: "ally", n: 2, at: "always" }); all(); }
    else if (a === "del") { v[b.dataset.list].splice(Number(b.dataset.i), 1); all(); }
    else if (a === "load") { const x = S.saved.find(s => s.id === b.dataset.id); if (x?.draft) { const n = E.normalize(E.clone(x.draft)); n.id = x.id; n.source = `draft: ${x.name}`; S.tab = n.tab; S.drafts[S.tab] = n; S.ver[S.tab] = Math.max(0, n.versions.findIndex(q => q.on)); S.copyText = ""; all(); say("Draft opened"); } }
    else if (a === "drop") dropDraft(b.dataset.id);
  });
  for (const t of ["pc", "npc"]) $(`tab-${t}`).addEventListener("click", () => { S.tab = t; S.copyText = ""; all(); });
  $("save-draft").addEventListener("click", saveDraft);
  $("copy").addEventListener("click", () => {
    const text = E.exportText(D()); S.copyText = text; renderOut();
    const fallback = () => { const box = $("copybox"); if (box) { box.focus(); box.select(); } say("Select the text below and copy it"); };
    try { navigator.clipboard.writeText(text).then(() => say("Copied: paste it to Claude"), fallback); } catch { fallback(); }
  });

  all(); initStore();
})();
