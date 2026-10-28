// "Create Button" dialog: builds an inline roll command (@Check / @Damage / @Save / @Template / @Move / @Rally) and posts it to chat.
import { TWOD12 } from "./config.mjs";
const { DialogV2 } = foundry.applications.api;
const sel = (obj, cur = "") => Object.entries(obj).map(([k, l]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${l}</option>`).join("");

export function buildCommand(d) {
  const num = (k, def = 0) => Number(d[k]) || def;
  const common = () => {
    const p = [];
    if (num("dc", 13) !== 13) p.push(`dc:${num("dc", 13)}`);
    if (num("adj")) p.push(`adj:${num("adj")}`);
    if (num("boon")) p.push(`boon:${num("boon")}`);
    if (num("bane")) p.push(`bane:${num("bane")}`);
    if (d.traits?.length) p.push(`traits:${d.traits.join(",")}`);
    return p;
  };
  const lab = d.label ? [`label:${d.label}`] : [];
  if (d.type === "check") return `@Check[${[d.attr, ...common(), ...lab].join("|")}]`;
  if (d.type === "save") {
    const p = [d.attr, ...common()];
    for (const n of [1, 2, 3]) if ((d[`t${n}`] ?? "").trim()) p.push(`t${n}:${d[`t${n}`].trim()}`);
    return `@Save[${[...p, ...lab].join("|")}]`;
  }
  if (d.type === "damage") {
    const inst = [];
    for (let i = 1; i <= 4; i++) {
      const f = (d[`f${i}`] ?? "").trim();
      if (!f) continue;
      const tags = [d[`p${i}`], d[`s${i}`], d[`n${i}`] ? "nonlethal" : ""].filter(Boolean);
      inst.push(f.includes(",") || /[+\-*/ ]/.test(f) ? `(${f})${tags.length ? `[${tags.join(",")}]` : ""}` : `${f}${tags.length ? `[${tags.join(",")}]` : ""}`);
    }
    return `@Damage[${[inst.join(","), ...(d.nlAll ? ["nonlethal"] : []), ...lab].join("|")}]`;
  }
  if (d.type === "rally") return `@Rally[${[Math.max(1, num("rn", 1)), ...lab].join("|")}]`;
  if (d.type === "move") return `@Move[${[d.mkind || "pushed", `distance:${String(d.mdistance || "1").replace(/\s+/g, "")}`, ...lab].join("|")}]`;
  const p = [d.shape, `distance:${num("distance", 1)}`];
  if (d.targets && d.targets !== "all") p.push(`targets:${d.targets}`);
  if (d.self) p.push("self:yes");
  if (d.places) p.push("places:yes");
  if (d.expire === "eot") p.push("expire:eot");
  else if (num("rounds")) p.push(`rounds:${num("rounds")}`);
  if (d.difficult) p.push(`difficult:${(d.dtypes?.length ? d.dtypes : ["walk"]).join(",")}`);
  if (d.difficult && d.dfor && d.dfor !== "all") p.push(`difficultFor:${d.dfor}`);
  return `@Template[${[...p, ...lab].join("|")}]`;
}

let builderOpen = false;
export async function openBuilder() {
  if (builderOpen) return;   // the scene control can fire twice; one Create Button window at a time
  builderOpen = true;
  try { await openBuilderDialog(); } finally { builderOpen = false; }
}

async function openBuilderDialog() {
  const traitBoxes = Object.entries(TWOD12.traits).sort((a, b) => a[1].localeCompare(b[1])).map(([k, l]) => `<label class="inline"><input type="checkbox" name="traits" value="${k}"> ${l}</label>`).join("");
  const rows = [1, 2, 3, 4]
    .map(
      i =>
        `<div class="brow"><input type="text" name="f${i}" placeholder="1d6+2"><select name="p${i}">${sel({ "": "Body (default)", body: "Body", mind: "Mind", choice: "Choice" })}</select><select name="s${i}">${sel(
          {
            "": "No subtype",
            ...Object.fromEntries(
              Object.entries(TWOD12.subtypes)
                .filter(([k]) => k)
                .map(([k, v]) => [v.toLowerCase(), v])
            )
          }
        )}</select><label class="inline"><input type="checkbox" name="n${i}"> NL</label></div>`
    )
    .join("");
  const attrRadios = Object.entries(TWOD12.attributes).map(([k, l], i) => `<label class="apbtn"><input type="radio" name="attr" value="${k}" ${i === 0 ? "checked" : ""}><span>${l}</span></label>`).join("");
  const types = ["check", "damage", "save", "template", "move", "rally"].map((t, i) => `<label class="apbtn"><input type="radio" name="type" value="${t}" ${i === 0 ? "checked" : ""}><span>${t[0].toUpperCase() + t.slice(1)}</span></label>`).join("");
  const content = `<div class="twod12 builder">
    <div class="apbtns">${types}</div>
    <div class="bsec" data-types="check save"><div class="apbtns">${attrRadios}</div>
      <div class="grid4"><label>DC <input type="number" name="dc" value="13"></label><label>Modifier <input type="number" name="adj" value="0"></label><label>Boons <input type="number" name="boon" value="0" min="0"></label><label>Banes <input type="number" name="bane" value="0" min="0"></label></div>
      <div class="setbox"><b>Traits</b>${traitBoxes}</div></div>
    <div class="bsec" data-types="save"><label>Tier 1 (\u2264 DC-1) <input type="text" name="t1" placeholder='1d6[mind,holy], "text", Item.id'></label><label>Tier 2 <input type="text" name="t2"></label><label>Tier 3 <input type="text" name="t3" placeholder="0"></label></div>
    <div class="bsec" data-types="rally"><label>Rally Points <input type="number" name="rn" value="1" min="1"></label></div>
    <div class="bsec" data-types="move"><div class="grid4"><label>Kind <select name="mkind">${sel({ pushed: "Pushed (forced movement)", advance: "Advance (up to N squares)", evade: "Evade (no reactions)" })}</select></label><label>Distance <input type="text" name="mdistance" value="2" placeholder="2 or walk/2"></label></div></div>
    <div class="bsec" data-types="damage">${rows}<label class="inline"><input type="checkbox" name="nlAll"> All instances nonlethal</label></div>
    <div class="bsec" data-types="template">
      <div class="grid4"><label>Shape <select name="shape">${sel({ emanation: "Emanation", burst: "Burst" })}</select></label><label>Distance <input type="number" name="distance" value="2" min="1"></label>
      <label>Targets <select name="targets">${sel({ all: "All", allies: "Allies", enemies: "Enemies" })}</select></label></div>
      <label class="inline"><input type="checkbox" name="self"> Target self</label> <label class="inline"><input type="checkbox" name="places"> Keep the area on the map</label>
      <div class="grid4"><label>Rounds (0 = until removed) <input type="number" name="rounds" value="0" min="0"></label>
      <label>Expires <select name="expire">${sel({ "": "After the rounds", eot: "End of the origin's turn" })}</select></label>
      <label class="inline"><input type="checkbox" name="difficult"> Difficult terrain</label>
      <label>Difficult for <select name="dfor">${sel({ all: "All", allies: "Allies", enemies: "Enemies" })}</select></label></div>
      <div class="setbox"><b>Movement</b>${Object.entries(TWOD12.movementActions)
        .map(([k, l]) => `<label class="inline"><input type="checkbox" name="dtypes" value="${k}" ${k === "walk" ? "checked" : ""}> ${l}</label>`)
        .join("")}</div></div>
    <label>Button label (optional) <input type="text" name="label"></label></div>`;
  const cmd = await DialogV2.prompt({
    window: { title: "Create Button" }, position: { width: 520 }, content,
    render: (event, dialog) => {
      const el = dialog.element;
      const upd = () => {
        const t = el.querySelector("[name=type]:checked").value;
        el.querySelectorAll(".bsec").forEach(s => { s.style.display = s.dataset.types.split(" ").includes(t) ? "" : "none"; });
      };
      el.querySelectorAll("[name=type]").forEach(r => r.addEventListener("change", upd));
      upd();
    },
    ok: {
      label: "Put in chat box",
      callback: (ev, btn) => { const fd = new FormData(btn.form); const d = Object.fromEntries(fd); d.traits = fd.getAll("traits"); d.dtypes = fd.getAll("dtypes"); return buildCommand(d); }
    },
    rejectClose: false
  });
  if (!cmd) return;
  try { await navigator.clipboard.writeText(cmd); } catch (e) { /* clipboard unavailable */ }
  // The text goes into the chat box, ready to send (or to copy somewhere else). It is also on the clipboard.
  try { ui.sidebar?.changeTab?.("chat", "primary"); } catch (e) { /* older layout */ }
  const box = ui.chat?.element?.querySelector?.("textarea");
  if (box) { box.value = cmd; box.dispatchEvent(new Event("input", { bubbles: true })); box.focus(); }
  else ui.notifications.info("Copied to the clipboard.");
}
