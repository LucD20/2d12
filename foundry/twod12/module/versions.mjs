// The versions editor of an Action (its tiers of damage and effects at each AP cost), opened from the item sheet.
import { TWOD12 } from "./config.mjs";
import { esc } from "./roll.mjs";
import { instanceText, versionRow } from "./actions.mjs";
import { enableDragging } from "./drag.mjs";
import { dragData } from "./sheet-common.mjs";
const { HandlebarsApplicationMixin, ApplicationV2, DialogV2 } = foundry.applications.api;

async function instanceDialog(inst = {}) {
  const sel = (obj, cur) => Object.entries(obj).map(([k, l]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${l}</option>`).join("");
  // v0.0.172: in the item sheets' look (parchment, dark text), whatever Foundry's theme is.
  const content = `<div class="sk tierdlg">
    <div class="form-group"><label>Damage to</label><select name="pool">${sel(TWOD12.pools, inst.pool ?? "B")}</select></div>
    <div class="form-group"><label>Weapon dice [W]</label><input type="checkbox" name="useW" ${inst.useW ? "checked" : ""}><input type="number" name="wCount" min="1" value="${inst.wCount ?? 1}"></div>
    <div class="form-group"><label>Dice expression</label><input type="text" name="dice" value="${esc(inst.dice ?? "")}" placeholder="1d4"></div>
    <div class="form-group"><label>Modifier [Mod]</label><input type="checkbox" name="useAt" ${inst.useAt ? "checked" : ""}></div>
    <div class="form-group"><label>Subtype</label><select name="subtype">${sel(TWOD12.subtypes, inst.subtype ?? "")}</select></div></div>`;
  return DialogV2.prompt({
    window: { title: "Damage Instance" }, content, classes: ["twod12-styled", "twod12-tierdlg"],
    render: (event, dialog) => {
      const el = dialog.element, cb = el.querySelector("[name=useW]"), n = el.querySelector("[name=wCount]");
      const upd = () => { n.disabled = !cb.checked; };
      cb.addEventListener("change", upd); upd();
    },
    ok: {
      label: "Save",
      callback: (ev, btn) => {
        const fd = new FormData(btn.form);
        return {
          pool: fd.get("pool") ?? "", useW: fd.get("useW") === "on", wCount: Math.max(1, parseInt(fd.get("wCount")) || 1),
          dice: (fd.get("dice") || "").trim(), useAt: fd.get("useAt") === "on", subtype: fd.get("subtype") ?? ""
        };
      }
    },
    rejectClose: false
  });
}

export class VersionsEditor extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(item, options = {}) {
    super(options);
    this.item = item;
    this.collapsed = new Set();
  }
  static DEFAULT_OPTIONS = {
    classes: ["twod12", "twod12-styled"],   // v0.0.168: the sheet's look
    position: { width: 620, height: 640 },
    window: { title: "Action Versions", resizable: true },
    actions: {
      addVersion: VersionsEditor.addVersion,
      delVersion: VersionsEditor.delVersion,
      addInstance: VersionsEditor.addInstance,
      editInstance: VersionsEditor.editInstance,
      delInstance: VersionsEditor.delInstance,
      dupVersion: VersionsEditor.dupVersion,
      moveVersion: VersionsEditor.moveVersion,
      delFx: VersionsEditor.delFx
    }
  };
  static PARTS = { main: { template: "systems/twod12/templates/versions-editor.hbs" } };
  get title() {
    return `${this.item.name}: Versions`;
  }

  async _prepareContext() {
    const vs = [];
    for (const [vi, v] of this.item.system.versions.entries()) {
      const tiers = [];
      for (const [ti, t] of ["t1", "t2", "t3"].entries()) {
        const fx = [];
        for (const [i, x] of (v.fx?.[t] ?? []).entries())
          fx.push({ i, uuid: x.uuid, name: (await fromUuid(x.uuid))?.name ?? "(missing)", auto: x.mode === "auto" });
        tiers.push({
          key: t,
          xkey: `x${ti + 1}`,
          text: v[`x${ti + 1}`] ?? "",
          label: `Tier ${ti + 1}`,
          fx,
          instances: v[t].map((inst, ii) => ({ ii, text: instanceText(inst) || "(empty)" }))
        });
      }
      const allFx = [];
      for (const [i, x] of (v.fx?.all ?? []).entries())
        allFx.push({ i, uuid: x.uuid, name: (await fromUuid(x.uuid))?.name ?? "(missing)", auto: x.mode === "auto" });
      vs.push({
        vi,
        ap: v.ap,
        mode: v.mode ?? "",
        modeLabel: v.mode === "weapon" ? "Weapon mode" : v.mode === "power" ? "Power mode" : "",
        noTiers: !!v.noTiers,
        areaSize: v.areaSize ?? 0,
        areaRounds: v.areaRounds ?? 0,   // v0.0.262 (Lucas: every setting editable)
        critical: v.critical,
        effects: v.effects,
        after: v.after ?? "",
        collapsed: this.collapsed.has(vi),
        summary: v.noTiers ? "No tiers" : versionRow(v).tiers.join(" / "),
        tiers,
        allFx
      });
    }
    return { versions: vs, modeChoices: { weapon: "Weapon mode", power: "Power mode" } };
  }
  _onRender() {
    enableDragging(this);
    this.element.querySelectorAll("details.version").forEach(d =>
      d.addEventListener("toggle", () => {
        const i = Number(d.dataset.v);
        if (d.open) this.collapsed.delete(i);
        else this.collapsed.add(i);
      })
    );
    this.element.querySelectorAll(".fx-drop").forEach(z => {
      z.addEventListener("dragover", ev => ev.preventDefault());
      z.addEventListener("drop", async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const data = dragData(ev);
        const doc = data?.uuid ? await fromUuid(data.uuid) : null;
        if (!doc || doc.type !== "effect") return ui.notifications.warn("Drop an Effect here.");
        await this._mutate(vs => {
          const v = vs[Number(z.dataset.v)];
          v.fx ??= { t1: [], t2: [], t3: [] };
          (v.fx[z.dataset.t] ??= []).push({ uuid: doc.uuid, mode: "auto" });
        });
      });
    });
    this.element.querySelectorAll("[data-fx-mode]").forEach(el =>
      el.addEventListener("change", () => {
        this._mutate(vs => {
          vs[Number(el.dataset.v)].fx[el.dataset.t][Number(el.dataset.i)].mode = el.value;
        });
      })
    );
    this.element.querySelectorAll("[data-field]").forEach(el =>
      el.addEventListener("change", () => {
        const vi = Number(el.dataset.v),
          f = el.dataset.field;
        const val = el.type === "checkbox" ? el.checked : f === "ap" ? Math.min(5, Math.max(0, Number.isFinite(parseInt(el.value)) ? parseInt(el.value) : 1)) : f === "areaSize" || f === "areaRounds" ? Math.max(0, parseInt(el.value) || 0) : el.value;
        this._mutate(vs => {
          vs[vi][f] = val;
        });
      })
    );
  }
  async _mutate(fn) {
    const vs = foundry.utils.deepClone(this.item.toObject().system.versions);
    fn(vs);
    await this.item.update({ "system.versions": vs });
    this.render();
  }
  static async addVersion() {
    const used = this.item.system.versions.map(v => v.ap);
    const ap = [1, 2, 3, 4, 5].find(n => !used.includes(n)) ?? 1;
    await this._mutate(vs => vs.push({ ap, noTiers: false, t1: [], t2: [], t3: [], x1: "", x2: "", x3: "", critical: "", effects: "" }));
  }
  static async delFx(event, target) {
    const { v, t, i } = target.dataset;
    await this._mutate(vs => vs[Number(v)].fx[t].splice(Number(i), 1));
  }
  static async dupVersion(event, target) {
    await this._mutate(vs => {
      const v = foundry.utils.deepClone(vs[Number(target.dataset.v)]);
      const free = [1, 2, 3, 4, 5].find(n => !vs.some(x => x.ap === n));
      if (!free) return ui.notifications.warn("Every AP cost from 1 to 5 already has a version.");
      v.ap = free;
      vs.push(v);
    });
  }
  static async delVersion(event, target) {
    const v = Number(target.dataset.v);
    this.collapsed = new Set([...this.collapsed].filter(i => i !== v).map(i => (i > v ? i - 1 : i)));
    await this._mutate(vs => vs.splice(v, 1));
  }
  static async moveVersion(event, target) {
    const v = Number(target.dataset.v),
      to = v + Number(target.dataset.dir);
    if (to < 0 || to >= this.item.system.versions.length) return;
    const a = this.collapsed.has(v),
      b = this.collapsed.has(to);
    this.collapsed.delete(v);
    this.collapsed.delete(to);
    if (a) this.collapsed.add(to);
    if (b) this.collapsed.add(v);
    await this._mutate(vs => {
      [vs[v], vs[to]] = [vs[to], vs[v]];
    });
  }
  static async addInstance(event, target) {
    const inst = await instanceDialog();
    if (inst) await this._mutate(vs => vs[Number(target.dataset.v)][target.dataset.t].push(inst));
  }
  static async editInstance(event, target) {
    const { v, t, i } = target.dataset;
    const cur = this.item.system.versions[v][t][i];
    const inst = await instanceDialog(cur);
    if (inst)
      await this._mutate(vs => {
        vs[Number(v)][t][Number(i)] = inst;
      });
  }
  static async delInstance(event, target) {
    const { v, t, i } = target.dataset;
    await this._mutate(vs => vs[Number(v)][t].splice(Number(i), 1));
  }
}
