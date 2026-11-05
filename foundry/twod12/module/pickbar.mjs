// v0.0.247 (Lucas, after v0.0.246): a choice made on the map is a bar at the bottom, in the Line bar's look (the Charge and Setup bars), never a Foundry
// window: an icon, a text, one button per option, and Done / Cancel. "Who gains the Guard?" and the Push picker use it; any map picker can.
import { esc } from "./util.mjs";

/** Pure: the bar's HTML. o: { icon, text, options: [{ id, label, tip, cls }], done (the label of the Done button, or "" for none), cancel (label, default "Cancel") }. */
export function pickBarHtml(o) {
  const opts = (o.options ?? []).map(x => `<button type="button" class="lb-opt${x.cls ? ` ${esc(x.cls)}` : ""}" data-id="${esc(x.id)}"${x.tip ? ` data-tooltip="${esc(x.tip)}"` : ""}>${esc(x.label)}</button>`).join("");
  return `<i class="fa-solid ${esc(o.icon ?? "fa-hand-pointer")} lb-ic"></i><span class="lb-text">${o.text ?? ""}</span><span class="lb-side lb-opts">${opts}</span>${o.done ? `<button type="button" class="lb-go" data-id="__done"><i class="fa-solid fa-check"></i> ${esc(o.done)}</button>` : ""}<button type="button" class="lb-give" data-id="__cancel">${esc(o.cancel ?? "Cancel")}</button>`;
}

/**
 * Show the bar and wait for a click: resolves to the option's id, "done" (the Done button), or null (Cancel, Escape). Enter picks the first option
 * when there is one and no Done button, else Done. The open windows step aside while the bar is up (template.mjs stepAside), as for an area.
 */
export async function pickBar(o) {
  let back = async () => {};
  if (o.aside !== false) { try { back = await (await import("./template.mjs")).stepAside(); } catch (e) { /* nothing to minimize */ } }
  const res = await new Promise(resolve => {
    const bar = document.createElement("div");
    bar.className = `twod12-linebar twod12-pickbar${o.cls ? ` ${o.cls}` : ""}`;
    bar.innerHTML = pickBarHtml(o);
    document.body.append(bar);
    const finish = v => { bar.remove(); window.removeEventListener("keydown", key, true); resolve(v); };
    const key = ev => {
      if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); finish(null); }
      if (ev.key === "Enter" && !/input|textarea/i.test(ev.target?.tagName ?? "")) { ev.preventDefault(); finish(o.done ? "done" : (o.options?.[0]?.id ?? null)); }
    };
    bar.addEventListener("click", ev => {
      const b = ev.target.closest("button[data-id]");
      if (!b) return;
      ev.preventDefault();
      finish(b.dataset.id === "__cancel" ? null : b.dataset.id === "__done" ? "done" : b.dataset.id);
    });
    window.addEventListener("keydown", key, true);
  });
  await back();
  return res;
}
