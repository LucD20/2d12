// The chat card's tight trait chips (v0.0.180, D0 option E): a line between trait groups is hidden when the row wraps right before or after it,
// so no line is left at the start or end of a row. CSS can't know where a row breaks: this measures the chips once the card is drawn, and again
// whenever the chip row changes width (the chat sidebar resized or popped out).

/**
 * Which separators sit at the edge of a row: given each item's row (its top, in pixels) in order, the indexes of the separators whose previous or
 * next item is on another row. items: [{ sep: bool, top: number }]. Pure: the tests use it.
 */
export function edgeSeparators(items) {
  const out = [];
  items.forEach((it, n) => {
    if (!it.sep) return;
    const prev = items[n - 1], next = items[n + 1];
    if (!prev || !next || Math.abs(prev.top - it.top) > 2 || Math.abs(next.top - it.top) > 2) out.push(n);
  });
  return out;
}

/** Hide the separators at the edge of a row in one chip row (the separators are shown again first, so a row that no longer wraps gets them back). */
export function fixRow(row) {
  const kids = [...row.children];
  kids.forEach(k => k.classList.remove("edge"));
  const items = kids.map(k => ({ sep: k.classList.contains("tsep"), top: k.offsetTop }));
  for (const n of edgeSeparators(items)) kids[n].classList.add("edge");
}

const watched = new WeakSet();
const observer = typeof ResizeObserver === "function" ? new ResizeObserver(entries => { for (const e of entries) fixRow(e.target); }) : null;

/** A chat message was drawn: watch its chip rows. */
export function chatChips(msg, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  for (const row of root?.querySelectorAll?.(".tcompact") ?? []) {
    if (watched.has(row)) continue;
    watched.add(row);
    if (observer) observer.observe(row);
    requestAnimationFrame(() => fixRow(row));   // once it is in the chat log and has a width
  }
}
