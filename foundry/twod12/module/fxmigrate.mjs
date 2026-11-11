// v0.0.323 PACK EFFECT-SHEET: the effects' rules stored, once per world (the GM, after a backup reminder), or by hand: game.twod12.migrateEffects().
// Every Effect, Feature and Talent already reads its old settings as rules in memory on each load (settingsmigrate.mjs migrateRules), so nothing
// depends on this pass: it stores the rules, Ends and the built hover text (rulesOn) and leaves the old settings as they are (they stay what the
// rolls read until the item is next edited in the new Details tab, which writes them again from the rules). Covered: the world's items, the items
// of every actor, and the applied effects' copies (flags.twod12.source). The console lists what could not be converted cleanly.
import { migrate, hoverCardText } from "./fxrules.mjs";
import { esc } from "./util.mjs";
const F = "twod12", DONE = "FX1";
const HOSTS = ["effect", "feature", "talent"];

/** Pure: the update of one item's system (or null when it has its rules already or nothing to convert). */
export function rulesUpdate(sys, host) {
  if (!sys || sys.rulesOn || !HOSTS.includes(host)) return null;
  const m = migrate(sys, host);
  const upd = { rules: m.rules, rulesOn: true, autoHover: host === "effect" ? hoverCardText(m.rules, m.ends, { originName: "{origin}", host }) : hoverCardText(m.rules, {}, { originName: "its origin", host }).replace(/\s*Lasts until removed\.$/, "") };
  if (host === "effect") upd.ends = m.ends;
  return { upd, notes: m.notes };
}

/** Store the rules everywhere. write: false only reports. Returns { items, effects, notes: [[where, note]] }. */
export async function migrateEffects({ write = true } = {}) {
  const out = { items: 0, effects: 0, notes: [] };
  const doItem = async (it, where) => {
    const sys = it.system?.toObject?.() ?? it.system;
    const r = rulesUpdate({ ...sys, rulesOn: it._source?.system?.rulesOn ?? sys?.rulesOn }, it.type);
    if (!r) return;
    for (const n of r.notes) out.notes.push([where, n]);
    if (write) { try { await it.update(Object.fromEntries(Object.entries(r.upd).map(([k, v]) => [`system.${k}`, v])), { twod12Migrate: true }); out.items++; } catch (e) { out.notes.push([where, `not stored: ${e.message}`]); } }
  };
  for (const it of game.items ?? []) await doItem(it, it.name);
  for (const a of game.actors ?? []) {
    for (const it of a.items ?? []) await doItem(it, `${a.name}: ${it.name}`);
    for (const e of a.effects ?? []) {
      const src = e.getFlag(F, "source");
      if (!src || typeof src !== "object" || src.rulesOn) continue;
      const r = rulesUpdate(src, "effect");
      if (!r) continue;
      for (const n of r.notes) out.notes.push([`${a.name}: ${e.name}`, n]);
      if (write) { try { await e.setFlag(F, "source", { ...src, ...r.upd }); out.effects++; } catch (err) { out.notes.push([`${a.name}: ${e.name}`, `not stored: ${err.message}`]); } }
    }
  }
  if (out.notes.length) console.warn(`twod12 | effects not migrated cleanly (they keep working on their old settings):\n${out.notes.map(([w, n]) => `  ${w}: ${n}`).join("\n")}`);
  console.log(`twod12 | effect rules stored: ${out.items} items, ${out.effects} applied effects`);
  return out;
}

/** Once per world: the GM is asked (a backup first), in the pick window's style; Later asks again at the next load. */
export function registerMigrationFx() {
  game.settings.register(F, "migratedFx", { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", async () => {
    if (!game.user.isActiveGM || game.settings.get(F, "migratedFx") === DONE) return;
    const report = await migrateEffects({ write: false });
    const has = [...(game.items ?? [])].some(i => HOSTS.includes(i.type)) || [...(game.actors ?? [])].some(a => a.items.some(i => HOSTS.includes(i.type)));
    if (!has) { await game.settings.set(F, "migratedFx", DONE); return; }
    const { pickConfirm } = await import("./pickwindow.mjs");
    const ok = await pickConfirm({ name: "The effects' new Details tab", sub: "PACK EFFECT-SHEET", icon: "fa-wand-magic-sparkles", confirm: "Store the rules",
      text: `<p><b>Back up your world first</b> (Foundry: Game Worlds, Backup).</p><p>Effects, Features and Talents now have rules (the new Details tab). They already work from their old settings; this stores the rules in the world, once. Nothing else changes.${report.notes.length ? ` ${report.notes.length} setting(s) can't be converted cleanly and keep working as before (the console lists them).` : ""}</p><p>Cancel: asked again next time. By hand: <code>game.twod12.migrateEffects()</code>.</p>` });
    if (!ok) return;
    const r = await migrateEffects({ write: true });
    await game.settings.set(F, "migratedFx", DONE);
    const { sysCard } = await import("./sysmsg.mjs");
    await ChatMessage.create({ whisper: [game.user.id], content: sysCard({ title: "Effects: rules stored", lead: `${r.items} items, ${r.effects} applied effects`, text: r.notes.length ? `${esc(String(r.notes.length))} kept their old settings (see the console).` : "Every effect was converted." }) });
  });
}
