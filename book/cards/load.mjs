// The cards (book/cards/*.json) for Node: the Foundry build (tools/content.mjs, tools/gen-basic.mjs) and the ruler (book/ruler/spec.mjs).
// One source per card; the format: book/cards/README.md. No dependency.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CARDS_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Every card of every file, in file order (each knows its `_file`). Throws on a card with no name or a name written twice. */
export function loadCards(dir = CARDS_DIR) {
  const out = [], seen = new Map();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
    catch (e) { throw new Error(`${f}: ${e.message}`); }
    for (const c of data.cards ?? []) {
      if (!c.name) throw new Error(`${f}: a card has no name`);
      if (seen.has(c.name)) throw new Error(`${f}: the card "${c.name}" is also in ${seen.get(c.name)}`);
      seen.set(c.name, f);
      out.push({ ...c, _file: f });
    }
  }
  return out;
}

export const isReaction = c => Boolean(c.interrupt || c.trigger);
export const hasVersions = c => Array.isArray(c.versions) && c.versions.length > 0;
/** "damage; effect text" -> [damage, text] (the first ";" splits; a cell with no damage is all text). */
export const splitTier = t => { const i = t.indexOf(";"); return i < 0 ? [t.trim(), ""] : [t.slice(0, i).trim(), t.slice(i + 1).trim()]; };
/** Does this text read as damage the book writes ("0", "[B] 1[W] + [Mod] + [M] 1d6 Ho", "[B] [Mod] Pi")? */
export const isDamage = t => /^(0|-|(\[(B|M|V|R)\]\s*)?(\d*\[W\]|\[Mod\]|\d+d\d+|\d+)(\s*\+\s*((\[(B|M|V|R)\]\s*)?(\d*\[W\]|\[Mod\]|\d+d\d+|\d+)))*(\s+(Ac|Bl|Co|El|Fi|Fo|Ho|Pi|Ps|Sl|Th|Un))?)$/.test(t.trim());
/** The book's [[links]] to their label (Foundry and the ruler have no links). */
export const stripLinks = s => String(s ?? "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
/** The book's **bold** to plain text. */
export const stripBold = s => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "$1");
