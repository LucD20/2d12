// Editing an effect that is already on a creature with the same Details tab as an Effect item (v0.0.113).
// The applied effect keeps a copy of its item's settings (flags.twod12.source); the editor opens a temporary Effect item made from it,
// and every change is written back to the applied effect: its rolls, damage, Speed, uses, duration and the conditions it applies.
// The Effect item it came from is never changed.
import { TwoD12ItemSheet } from "./sheets.mjs";
import { createRiders, isValued, setValued, baseNameOf } from "./effects.mjs";
import { appliedUpdate, sourceFromFlags } from "./fxsync.mjs";
import { isExhaustedFx, setExhausted } from "./sleep.mjs";
import { setEffectOpener } from "./fxopen.mjs";

const F = "twod12";
const open = new Map();   // applied effect uuid -> its editor

async function syncApplied(fx, tmp) {
  const { update, added, removed, duration } = appliedUpdate(fx, tmp.system, tmp.toObject().system, tmp.name, tmp.img);
  await fx.update(update);
  const actor = fx.parent;
  if (!actor) return;
  const gone = actor.effects.filter(e => e.getFlag(F, "linkedTo") === fx.id && removed.some(r => r.uuid === e.getFlag(F, "effectUuid"))).map(e => e.id);
  if (gone.length) await actor.deleteEmbeddedDocuments("ActiveEffect", gone);
  if (added.length) await createRiders(actor, { uuid: "", system: { conditions: added } }, fx, { actorUuid: fx.origin ?? null }, duration);
}

export class AppliedEffectSheet extends TwoD12ItemSheet {
  _activeTab = "details";
  static DEFAULT_OPTIONS = { classes: ["twod12-applied"], actions: { openRaw: AppliedEffectSheet.openRaw } };
  constructor(options = {}) { super(options); this.fx = options.fx; }
  get title() { return `${this.fx?.name ?? "Effect"} (on ${this.fx?.parent?.name ?? "?"})`; }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const fx = this.fx, d = fx.getFlag(F, "duration") ?? {}, left = Number(fx.getFlag(F, "remaining")) || 0;
    const exh = isExhaustedFx(fx) && fx.parent?.type === "character";
    ctx.applied = { actor: fx.parent?.name ?? "?", exhausted: exh, valued: exh || isValued(fx), value: exh ? Number(fx.parent.system.exhausted) || 0 : Number(fx.getFlag(F, "value")) || 1, isRounds: d.type === "rounds", left, leftWord: left === 1 ? "round" : "rounds" };
    return ctx;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    this.element.querySelector("[data-apvalue]")?.addEventListener("change", async ev => {
      if (isExhaustedFx(this.fx) && this.fx.parent?.type === "character") { await setExhausted(this.fx.parent, Math.max(0, Math.trunc(Number(ev.target.value)) || 0)); if (this.fx.parent?.effects.get(this.fx.id)) this.render(); return; }   // 0 removes it (and closes this)
      const v = Math.max(1, Math.trunc(Number(ev.target.value)) || 1);
      await setValued(this.fx, v); this.render();
    });
    this.element.querySelector("[data-apleft]")?.addEventListener("change", async ev => {
      await this.fx.setFlag(F, "remaining", Math.max(0, Math.trunc(Number(ev.target.value)) || 0)); this.render();
    });
  }

  /** The form's own fields (name, picture, description, duration...): the temporary item has no collection, so Foundry's submit would try to create it. */
  async _processSubmitData(event, form, submitData, options = {}) { await this.document.update(submitData, options); }

  _onClose(options) { super._onClose?.(options); open.delete(this.fx?.uuid); }
  static openRaw() { this.fx?.sheet?.render(true); }
}

/** Open the 2d12 editor for an applied effect. False when it can't (no copy of its settings, or Exhausted): Foundry's window opens then. */
export function openApplied(fx) {
  if (!fx || fx.parent?.documentName !== "Actor") return false;   // an effect on an item keeps Foundry's window
  let src = fx.getFlag(F, "source");
  // No copy of its settings (an old effect, one made by hand in Foundry, Exhausted): rebuilt from what it stores.
  if (!src || typeof src !== "object") src = sourceFromFlags(fx);
  const have = open.get(fx.uuid);
  if (have?.rendered) { have.bringToFront?.(); return true; }
  const name = isExhaustedFx(fx) ? "Exhausted" : (isValued(fx) ? baseNameOf(fx) : fx.name);
  const tmp = new Item.implementation({ _id: fx.id, name, type: "effect", img: fx.img, system: foundry.utils.deepClone(src), ownership: { default: fx.isOwner ? 3 : 0 } });
  let sheet;
  tmp.update = async changes => {   // a temporary item: change it in place and write the result to the applied effect
    tmp.updateSource(foundry.utils.expandObject(changes ?? {}));
    await syncApplied(fx, tmp);
    sheet?.render();
    return tmp;
  };
  sheet = new AppliedEffectSheet({ document: tmp, fx, id: `twod12-applied-${fx.parent?.id ?? "x"}-${fx.id}` });
  open.set(fx.uuid, sheet);
  sheet.render(true);
  return true;
}

export function registerAppliedEditor() {
  setEffectOpener(openApplied);
  Hooks.on("deleteActiveEffect", fx => { const s = open.get(fx.uuid); if (s) s.close(); });
}
