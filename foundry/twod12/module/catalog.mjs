// game.twod12.catalog(): every option of the world and of the system compendiums, by category, as links: Classes, Features, Weapons, Weapon Techniques, Talents, Actions and more.
//   game.twod12.catalog()                    posts it in the chat (only you see it)
//   game.twod12.catalog("talents")           only one category
//   game.twod12.catalog({ journal: true })   writes it to a Journal Entry "2d12 Catalog" (one page per category) instead
import { TWOD12, categoryText } from "./config.mjs";

const dmg = d => { const dice = d.die ? `${d.count}${d.die}` : ""; return (dice + (d.mod ? `${dice && d.mod > 0 ? "+" : ""}${d.mod}` : "")) || "0"; };
const link = i => `@UUID[${i.uuid}]{${i.name}}`;
const traits = i => [...(i.system.traits ?? [])].map(t => TWOD12.traits[t] ?? TWOD12.weaponTraits?.[t] ?? t).join(", ");

const CATEGORIES = [
  ["species", "Species", i => i.type === "species", i => `Speed ${i.system.speed}, Reach ${i.system.reach}`],
  ["classes", "Classes", i => i.type === "class", i => `Body \u00d7${i.system.bodyMult}, Mind \u00d7${i.system.mindMult}, Rally +${i.system.rallyMod}`],
  ["features", "Features", i => i.type === "feature", i => [categoryText(i.system), i.system.talents ? `${i.system.talents} Talent${i.system.talents === 1 ? "" : "s"}` : ""].filter(Boolean).join(" \u00b7 ")],
  ["weapons", "Weapons", i => i.type === "weapon", i => [TWOD12.subtypes[i.system.subtype] ?? "", traits(i), `${dmg(i.system.damage.t1)} / ${dmg(i.system.damage.t2)} / ${dmg(i.system.damage.t3)}`, i.system.range ? `range ${i.system.range}` : ""].filter(Boolean).join(" \u00b7 ")],
  ["techniques", "Weapon Techniques", i => i.type === "action" && /weapon technique/i.test(i.system.category), i => [traits(i), i.system.versions.map(v => `${v.ap} AP`).join(" / ")].filter(Boolean).join(" \u00b7 ")],
  ["talents", "Talents", i => i.type === "talent", i => [categoryText(i.system), traits(i), i.system.requirements ? `requires ${i.system.requirements}` : ""].filter(Boolean).join(" \u00b7 ")],
  ["actions", "Other Actions", i => i.type === "action" && !/weapon technique/i.test(i.system.category), i => [categoryText(i.system), traits(i), i.system.versions.map(v => `${v.ap} AP`).join(" / ")].filter(Boolean).join(" \u00b7 ")],
  ["effects", "Effects and Conditions", i => i.type === "effect", i => `${TWOD12.durationTypes?.[i.system.duration?.type] ?? ""}${i.system.settings.length ? ` \u00b7 ${i.system.settings.map(s => TWOD12.effectSettings[s.type]).join(", ")}` : ""}`]
];

export async function catalog(opts = {}) {
  const only = typeof opts === "string" ? opts.toLowerCase() : (opts.category ?? "").toLowerCase();
  const journal = typeof opts === "object" && opts.journal;
  const rows = [];
  // The system's compendiums (index entries: name, type and category) next to the world's items.
  const fromPacks = [];
  for (const pack of game.packs ?? []) {
    if (pack.metadata?.packageName !== "twod12" || pack.documentName !== "Item") continue;
    const index = await pack.getIndex({ fields: ["system.category"] });
    for (const e of index) fromPacks.push({ type: e.type, name: e.name, uuid: e.uuid, system: { category: e.system?.category ?? "" }, pack: pack.metadata.label });
  }
  for (const [key, label, test, info] of CATEGORIES) {
    if (only && key !== only && label.toLowerCase() !== only) continue;
    const world = game.items.filter(test).map(i => ({ i, html: `${link(i)}${info(i) ? ` <small>${foundry.utils.escapeHTML?.(info(i)) ?? info(i)}</small>` : ""}` }));
    const packs = fromPacks.filter(test).map(i => ({ i, html: `${link(i)} <small>compendium: ${i.pack}</small>` }));
    const items = [...world, ...packs].sort((a, b) => a.i.name.localeCompare(b.i.name));
    rows.push({ label, items: items.map(x => ({ html: x.html })) });
  }
  if (journal) {
    const pages = rows.map(r => ({ name: r.label, type: "text", text: { format: 1, content: `<ul>${r.items.map(x => `<li>${x.html}</li>`).join("")}</ul>` || "<p>Nothing yet.</p>" } }));
    let entry = game.journal.find(j => j.name === "2d12 Catalog");
    if (entry) { await entry.deleteEmbeddedDocuments("JournalEntryPage", entry.pages.map(p => p.id)); await entry.createEmbeddedDocuments("JournalEntryPage", pages); }
    else entry = await JournalEntry.create({ name: "2d12 Catalog", pages });
    ui.notifications.info("The catalog is in the Journal Entry \"2d12 Catalog\".");
    entry.sheet.render(true);
    return entry;
  }
  const content = `<div class="twod12 chat catalog"><div class="ahead"><b>Catalog</b><span>${rows.reduce((n, r) => n + r.items.length, 0)} options</span></div>${rows.map(r => `<details ${r.items.length ? "open" : ""}><summary><b>${r.label}</b> (${r.items.length})</summary>${r.items.length ? `<ul>${r.items.map(x => `<li>${x.html}</li>`).join("")}</ul>` : "<p><i>Nothing yet.</i></p>"}</details>`).join("")}</div>`;
  await ChatMessage.create({ content, whisper: [game.user.id], speaker: { alias: "2d12" } });
  return rows;
}
