// v0.0.372 (Lucas, 2026-11-13: "B for the chat frame, with images a bit bigger"; foundry/mockups/chat-frame.html): the system's chat messages
// lose Foundry's own box; the speaker's token image and name, the time and the trash bin move into the card's top line. Foundry's header is
// hidden, its time and delete control are moved (not copied), so they keep working: the chat log updates the time and handles the delete by
// what is clicked inside the message. A one-line message stays bare (v0.0.358: no name, no time, no trash; the right-click menu deletes it).
import { esc } from "./util.mjs";

/** The speaker's picture: its token on the scene, else its actor's token or portrait, else the author's avatar. */
export function speakerImg(msg, g = globalThis.game) {
  try {
    const sp = msg?.speaker ?? {};
    const tok = sp.scene && sp.token ? g?.scenes?.get(sp.scene)?.tokens?.get(sp.token) : null;
    const actor = sp.actor ? g?.actors?.get(sp.actor) : null;
    return tok?.texture?.src || actor?.prototypeToken?.texture?.src || actor?.img || msg?.author?.avatar || "";
  } catch (e) { return ""; }
}

/** Pure: the top line's HTML (the image and the name; the time and the trash are moved in after it). */
export const topLineHtml = (name, img) => `<span class="tw-who">${img ? `<img src="${esc(img)}" alt="">` : ""}<b>${esc(name)}</b></span>`;

/** renderChatMessageHTML: frame one of the system's messages (its content is one .twod12.chat element). */
export function frameMessage(msg, html) {
  try {
    const el = html instanceof HTMLElement ? html : html?.[0];
    if (!el || el.classList.contains("tw-framed")) return;
    const root = el.querySelector(".message-content")?.firstElementChild;
    if (!root?.classList.contains("twod12") || !root.classList.contains("chat")) return;
    el.classList.add("tw-framed");
    if (el.classList.contains("twod12-bare")) return;
    const header = el.querySelector(".message-header");
    if (!header) return;
    const top = document.createElement("div");
    top.className = "tw-top";
    top.innerHTML = topLineHtml(msg?.alias ?? header.querySelector(".message-sender")?.textContent?.trim() ?? "", speakerImg(msg));
    const who = top.querySelector(".tw-who");
    header.querySelectorAll(".whisper-to").forEach(x => who.append(x));   // "To: ..." stays beside the name
    const meta = header.querySelector(".message-metadata");
    if (meta) top.append(meta);
    const flavor = header.querySelector(".flavor-text");
    (root.querySelector(".cc-card") ?? root).prepend(top);
    if (flavor?.textContent.trim()) top.after(flavor);
  } catch (e) { console.warn("twod12 | chat frame", e); }
}
