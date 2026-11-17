// Removed from module/gen.mjs in v0.0.415 (pack CL): no caller since genaction.mjs replaced it. Kept for reference.
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
    <p class="hint">Damage: <code>1WB</code> = 1 [W] to Vigor (B), <code>1d4BH</code> = 1d4 Vigor Holy, <code>1d6MH</code> = 1d6 Resolve Holy (M), <code>BB</code> = Vigor Blunt, <code>ModB</code> or <code>Modifier</code> = [Mod], <code>"text"</code> = tier effect. Effects: <code>2Emanation 1/round</code> (or <code>EoT</code>), <code>2Burst</code>, <code>Appeal Save</code>, <code>DC 14 Body Check</code>, <code>Appeal Save: 1d6 / 1d4 / 0 [R] Holy</code>, <code>Prone</code>, <code>Immobilized (EoT)</code>, <code>1d6MH</code>, <code>Pushed 5</code>, <code>Pulled 3</code>, <code>Slid 2</code>, <code>Advance 5</code>, <code>Evade 1</code>, <code>Evade Speed/2</code> (references: speed, body, mind, appeal, instinct, level, weapon, hp, rally; rounded up), <code>uses 1 Rally Point</code>, <code>use up to 2 Rally Points</code>.</p></div>`;
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
