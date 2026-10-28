// Small helpers shared by every module (no Foundry needed, so the tests can load them).

/** Escape text for HTML (text and double-quoted attributes). */
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** The hover text of an effect or ability: its own "Hover text" if it has one, else the start of its description (plain text). */
export const hoverOf = (hover, description) => {
  const h = String(hover ?? "").trim();
  if (h) return h;
  return String(description ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
};
