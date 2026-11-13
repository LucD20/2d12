// v0.0.376 (PACK STYLE-2; the brief foundry/mockups/npc-hud-brief.md): the HUD across the bottom of the screen. It follows the selection only
// (one token: its HUD; several: the list; none: the player's character, or the GM's empty bar), in the dark table look (module/hudmodel.mjs draws
// it). A Version's stamp opens the roll dialog on that Version ("Skip roll dialog", a per-player setting, rolls at once; Shift does the other);
// right-click opens the Action card (a PC's menu also pins the Version to the Quick row). The hotbar becomes a row inside it (a setting), and the
// pick bar (pickbar.mjs) asks its question in the HUD's middle while a choice waits. Client settings: Show the HUD, Skip roll dialog, Hotbar in the HUD.
import { esc } from "./util.mjs";
import { npcHudHtml, pcHudHtml, listHudHtml, emptyHudHtml, hudPanelHtml, HUD_SAVES } from "./hudmodel.mjs";

const F = "twod12";
const st = { open: "", actorUuid: "", pop: null, card: null };
let root = null, timer = null;
const setting = (k, d) => { try { return game.settings.get(F, k); } catch (e) { return d; } };

export function registerHudSettings() {
  const redraw = () => renderHud();
  game.settings.register(F, "hudShow", { name: "The HUD", hint: "The bar across the bottom of the screen for the selected token: its Actions, one click to the roll dialog. Only for you.", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
  game.settings.register(F, "hudSkipDialog", { name: "HUD: Skip roll dialog", hint: "A Version clicked in the HUD rolls at once with the roll dialog's defaults (it still shows when something stops the roll). Shift-click does the other.", scope: "client", config: true, type: Boolean, default: false });
  game.settings.register(F, "hudHotbar", { name: "HUD: the hotbar inside it", hint: "The macro hotbar becomes a small row at the HUD's right end. Off: Foundry keeps it where it was (reload to see it move back).", scope: "client", config: true, type: Boolean, default: true, onChange: redraw });
}

/* ------------------------------------------------------------------ the model */
const quickKeys = actor => new Set(actor?.getFlag?.(F, "hudQuick") ?? []);
async function apNow(actor) {
  try {
    if (!game.combat?.started) return null;
    const { combatantOf, getAP, getRAP } = await import("./combat.mjs");
    const c = combatantOf(actor, game.combat);
    return c ? { ap: getAP(c), rap: getRAP(c) } : null;
  } catch (e) { return null; }
}
async function actionsOf(actor) {
  const { FREQ_COLORS, effectiveFrequency } = await import("./config.mjs");
  const { versionButtons } = await import("./cardview.mjs");
  let pc = null;
  try { const { pcModel } = await import("./pcsheet.mjs"); pc = await pcModel(actor.sheet, {}); } catch (e) { console.warn("twod12 | HUD: the sheet's model", e); }
  const rows = new Map([...(pc?.sections ?? []).flatMap(s => s.rows ?? []), ...(pc?.basic ?? []).flatMap(c => c.rows ?? [])].map(r => [r.id, r]));
  const now = await apNow(actor), quick = quickKeys(actor), escNow = Number(actor.system?.escalation) || 0;
  const one = (i, onlyAps = null) => {
    const it = i.system, freq = effectiveFrequency(it), row = rows.get(i.id), vs = it.versions ?? [];
    const lock = Number(it.escalation) > 0 && escNow < Number(it.escalation);
    const btns = versionButtons(vs.map(v => v.ap), { reaction: !!it.reaction, inCombat: !!now, ap: now?.ap ?? 0, rap: now?.rap ?? 0 });
    const why = lock ? `Needs Escalation ${it.escalation}` : row?.offWhy ?? "";
    const list = vs.map((v, k) => ({ ap: v.ap, label: it.reaction ? `${v.ap}R` : `${v.ap} AP`, off: lock || !!row?.off || !!btns[k]?.off, used: /used|spent/i.test(why), why: why || btns[k]?.why || "", fav: quick.has(`${i.id}:${v.ap}`) }))
      .filter(v => !onlyAps || onlyAps.includes(Number(v.ap)));
    return { id: i.id, name: i.name, fq: FREQ_COLORS[freq] ?? FREQ_COLORS.none, dim: lock || (!!row?.off && list.every(v => v.off)), versions: list, pc: actor.type !== "npc",
      basic: !!i.getFlag(F, "basic"), basicAttack: !!it.basicAttack, reaction: !!it.reaction, escalation: Number(it.escalation) || 0, minAp: Math.min(99, ...vs.map(v => Number(v.ap) || 0)) };
  };
  return { pc, list: actor.itemTypes.action.map(i => one(i)), one };
}
async function npcModel(actor) {
  const { TWOD12 } = await import("./config.mjs");
  const { list } = await actionsOf(actor);
  const own = list.filter(a => !a.basic);
  const s = actor.system, rankKey = String(s.role ?? "standard");
  const n = Number(s.escalation) || 0;
  return {
    name: actor.name, img: actor.prototypeToken?.texture?.src || actor.img, rankKey, sub: `${TWOD12.npcRoles?.[rankKey]?.label ?? ""}${s.cv ? ` · CV ${s.cv}` : ""}`,
    groups: { basic: own.filter(a => a.basicAttack && !a.escalation), special: own.filter(a => !a.basicAttack && !a.reaction && !a.escalation).sort((a, b) => a.minAp - b.minAp), react: own.filter(a => a.reaction && !a.escalation), esc: own.filter(a => a.escalation) },
    escPips: (s.role === "elite" || s.useEscalation) ? "◆".repeat(n) + "◇".repeat(Math.max(0, (TWOD12.escalation?.max ?? 3) - n)) : "",
    saves: HUD_SAVES.map(([key, label, short]) => ({ key, label, short, value: s.attributes?.[key] ?? 0 }))
  };
}
async function pcHudModel(actor) {
  const { one } = await actionsOf(actor);
  const cls = actor.itemTypes.class[0], sp = actor.itemTypes.species[0];
  const keys = [...quickKeys(actor)], byItem = new Map();
  for (const k of keys) { const [id, ap] = k.split(":"); if (!actor.items.get(id)) continue; (byItem.get(id) ?? byItem.set(id, []).get(id)).push(Number(ap)); }
  return { name: actor.name, img: actor.prototypeToken?.texture?.src || actor.img, sub: [sp?.name, cls?.name, `Level ${actor.system?.level ?? 1}`].filter(Boolean).join(" ").replace(/ Level/, " · Level"), quick: [...byItem].map(([id, aps]) => one(actor.items.get(id), aps)), open: st.open };
}

/** A PC's category panel (or an NPC's "Checks"): the rows. */
async function panelRows(actor, cat) {
  const { list } = await actionsOf(actor);
  const act = a => ({ action: a });
  if (cat === "actions") return list.filter(a => !a.basic && !a.reaction && !a.escalation).sort((a, b) => a.minAp - b.minAp).map(act);
  if (cat === "basic") return list.filter(a => a.basic && !a.reaction).map(act);
  if (cat === "react") return list.filter(a => a.reaction && !a.escalation).map(act);
  if (cat === "esc") {
    const passives = actor.itemTypes.feature.filter(f => Number(f.system?.escalation) > 0).map(f => ({ text: f.name, sub: `Passive, Escalation ${f.system.escalation}${(Number(actor.system?.escalation) || 0) >= Number(f.system.escalation) ? "" : " (not yet)"}` }));
    return [...passives, ...list.filter(a => a.escalation).map(act)];
  }
  if (cat === "checks") return HUD_SAVES.flatMap(([key, label]) => [{ button: `${label} Check`, hud: "attr", data: { key }, sub: "" }, { button: `${label} Save`, hud: "attr", data: { key, save: "1" } }]);
  if (cat === "hands") {
    const { weaponWhere } = await import("./loadout.mjs");
    const where = { "2h": "in both hands", "1h": "in hand", worn: "worn", stowed: "stowed", dropped: "dropped" };
    return [...actor.itemTypes.weapon.map(w => { let at = ""; try { at = where[weaponWhere(w)] ?? weaponWhere(w); } catch (e) { /* unknown */ } return { button: w.name, hud: "open", data: { item: w.id }, sub: at }; }),
      ...actor.itemTypes.gear.map(g => ({ button: g.name, hud: "open", data: { item: g.id }, sub: "gear" })), { button: "The sheet's Hands", hud: "sheet", data: { tab: "items" }, cls: "out" }];
  }
  if (cat === "fx") return [...actor.effects].filter(e => !e.disabled).map(e => ({ button: e.name, hud: "effect", data: { effect: e.id } })).concat([{ button: "The Effects tab", hud: "sheet", data: { tab: "effects" }, cls: "out" }]);
  if (cat === "utility") return [{ button: "Breather", hud: "rest", data: { k: "breather" }, sub: "10 minutes" }, { button: "Sleep", hud: "rest", data: { k: "sleep" }, sub: "8 hours" }, { button: "Rest", hud: "rest", data: { k: "rest" }, sub: "24 h, safe place" }, { button: "Guard, Rally and the rest: the sheet", hud: "sheet", data: { tab: "actions" }, cls: "out" }];
  return [];
}
const CAT_TITLE = { actions: "Actions", basic: "Basic Actions", react: "Reactions", esc: "Escalation", hands: "Hands and Gear", checks: "Checks and Saves", fx: "Conditions and Effects", utility: "Utility" };

/* ------------------------------------------------------------------ drawing */
/** An NPC's rank as the book writes it ("Elite", not the key "elite"). */
const rankLabel = a => { const k = String(a?.system?.role ?? ""); try { return globalThis.CONFIG?.TWOD12?.npcRoles?.[k]?.label ?? (k.charAt(0).toUpperCase() + k.slice(1)); } catch (e) { return k; } };
function current() {
  const ctrl = globalThis.canvas?.tokens?.controlled ?? [];
  if (ctrl.length > 1) return { list: ctrl };
  if (ctrl.length === 1 && ctrl[0].actor) return { token: ctrl[0], actor: ctrl[0].actor };
  if (!game.user.isGM && game.user.character) return { actor: game.user.character };
  return {};
}
function ensureRoot() {
  if (root?.isConnected) return root;
  root = document.createElement("div");
  root.id = "twod12-hud";
  root.className = "twod12-hud";
  root.innerHTML = '<div class="hud-players"></div><div class="hud-main"></div><div class="hud-ask"></div><div class="hud-hot"></div>';
  // v0.0.379 (Lucas: "still not right placed"): the HUD is placed on the screen itself, from the scene controls' right edge to the sidebar's left
  // edge, not inside Foundry's middle column (whose width Foundry sets); measured again when the window, the sidebar or the controls change
  root.classList.add("floating");
  (document.getElementById("interface") ?? document.body).append(root);
  root.addEventListener("click", onClick);
  root.addEventListener("contextmenu", onContext);
  window.addEventListener("resize", placeRoot);
  try { const ro = new ResizeObserver(() => placeRoot()); for (const id of ["ui-right", "sidebar", "sidebar-content", "chat-notifications", "scene-controls", "ui-left"]) { const el = document.getElementById(id); if (el) ro.observe(el); } } catch (e) { /* no observer */ }
  return root;
}
/** Pure: the HUD's left, right and bottom offsets (px) from the edges it sits between. */
export function hudBox({ controlsRight = 0, sidebarLeft = 0, width = 0, hotbarTop = null, height = 0 } = {}) {
  const left = Math.round(Math.max(8, controlsRight + 10)), right = Math.round(Math.max(8, width - (sidebarLeft || width) + 10));
  const bottom = hotbarTop === null ? 6 : Math.round(Math.max(6, height - hotbarTop + 6));
  return { left, right, bottom };
}
function placeRoot() {
  if (!root?.isConnected) return;
  // v0.0.380 (Lucas: "the left corner still not full, when opening the chat the right moves"): only what really sits in the bottom band of the
  // screen counts. Left: the scene controls only when their buttons reach down to the HUD (they stop high up, so the HUD starts at the left edge).
  // Right: the leftmost of the sidebar, its tabs and the chat's floating input when they reach the bottom band (Foundry's #ui-right box is not
  // where they are drawn).
  const W = window.innerWidth, H = window.innerHeight, band = H - 90;
  const vis = el => { const r = el?.getBoundingClientRect?.(); return r && r.width > 0 && r.height > 0 ? r : null; };
  const ctlBottom = Math.max(0, ...[...document.querySelectorAll("#scene-controls button, #scene-controls li")].map(vis).filter(Boolean).map(r => r.bottom));
  const ctl = vis(document.getElementById("scene-controls"));
  const rightEls = ["sidebar", "sidebar-tabs", "sidebar-content", "chat-notifications", "chat-controls", "chat-message", "chat-form"].map(id => document.getElementById(id)).concat([...document.querySelectorAll(".chat-form")]);
  const lefts = rightEls.map(vis).filter(r => r && r.bottom > band && r.top < H && r.left > W * 0.35).map(r => r.left);
  const hb = document.getElementById("hotbar"), hbOut = hb && !root.contains(hb) && hb.offsetParent ? hb.getBoundingClientRect() : null;
  const b = hudBox({ controlsRight: ctl && ctlBottom > band - 20 ? ctl.right : 0, sidebarLeft: lefts.length ? Math.min(...lefts) : W, width: W, hotbarTop: hbOut ? hbOut.top : null, height: H });
  Object.assign(root.style, { left: `${b.left}px`, right: `${b.right}px`, bottom: `${b.bottom}px` });
}
/** The hotbar into the HUD's right end (a setting), and back out when the setting is off (a reload puts it back exactly). */
function placeHotbar() {
  const hb = document.getElementById("hotbar"), slot = root?.querySelector(".hud-hot");
  if (!hb || !slot) return;
  if (setting("hudHotbar", true)) { if (hb.parentElement !== slot) slot.append(hb); root.classList.add("with-hot"); }
  else root.classList.remove("with-hot");
}
/** v0.0.378 (Lucas: "the collapsed pill over the HUD"): Foundry's players list sits above the HUD's left end (collapsed as Foundry keeps it, its own
 *  arrow opens it), which also frees the left column, so the HUD gets that width. Off with the HUD. */
function placePlayers() {
  const pl = document.getElementById("players"), slot = root?.querySelector(".hud-players");
  if (!pl || !slot) return;
  if (pl.parentElement !== slot) slot.append(pl);
}
export function renderHud() {
  if (typeof document === "undefined") return;
  clearTimeout(timer);
  timer = setTimeout(() => drawHud().catch(e => console.warn("twod12 | HUD", e)), 60);
}
async function drawHud() {
  const show = setting("hudShow", true);
  if (!show) { if (root) root.hidden = true; return; }
  ensureRoot(); root.hidden = false; placeHotbar(); placePlayers(); placeRoot();
  const main = root.querySelector(".hud-main"), cur = current();
  closePop();
  if (cur.list) {
    st.actorUuid = "";
    main.innerHTML = listHudHtml(cur.list.map(t => ({ id: t.id, name: t.name, img: t.document?.texture?.src ?? t.actor?.img, rankKey: t.actor?.type === "npc" ? t.actor.system?.role : "", sub: t.actor?.type === "npc" ? rankLabel(t.actor) : (t.actor?.itemTypes?.class?.[0]?.name ?? "") })));
    return;
  }
  if (!cur.actor) { st.actorUuid = ""; main.innerHTML = emptyHudHtml(game.user.isGM ? "No token selected." : "No character: select your token."); return; }
  if (cur.actor.uuid !== st.actorUuid) { st.open = ""; st.actorUuid = cur.actor.uuid; }
  const npc = cur.actor.type === "npc";
  const m = npc ? await npcModel(cur.actor) : await pcHudModel(cur.actor);
  if (cur.token?.document?.texture?.src) m.img = cur.token.document.texture.src;
  if (cur.token?.name) m.name = cur.token.name;   // v0.0.377: the token's name (an actor's name can be long)
  main.innerHTML = npc ? npcHudHtml(m) : pcHudHtml(m);
  root.classList.toggle("is-npc", npc);
  if (npc) fitLines(main);
  if (!npc && st.open) openPanel(st.open);
}
/** An NPC's two lines never grow: a line too full folds its four Check / Save buttons into one, then its last Actions into "+N more". */
function fitLines(main) {
  for (const line of main.querySelectorAll(".hud-l")) {
    const over = () => line.scrollWidth > line.clientWidth + 1;
    if (!over()) continue;
    line.classList.add("fold-saves");
    if (!over()) continue;
    const acts = [...line.querySelectorAll(".ha")], more = line.querySelector(".hud-more"), hidden = [];
    while (over() && acts.length) { const a = acts.pop(); a.hidden = true; hidden.unshift(a.dataset.itemId); more.hidden = false; more.textContent = `+${hidden.length} more`; }
    more.dataset.items = hidden.join(",");
  }
}

/* ------------------------------------------------------------------ panels, the card, the menu */
function closePop() { root?.querySelectorAll(".hud-pop, .hud-menu").forEach(x => x.remove()); st.card?.remove(); st.card = null; }
async function openPanel(cat, ids = null) {
  const cur = current(); if (!cur.actor) return;
  closePop();
  let rows;
  if (ids) { const { list } = await actionsOf(cur.actor); rows = list.filter(a => ids.includes(a.id)).map(a => ({ action: a })); }
  else rows = await panelRows(cur.actor, cat);
  const wrap = document.createElement("div");
  wrap.innerHTML = hudPanelHtml(ids ? "More" : CAT_TITLE[cat] ?? cat, rows);
  const pop = wrap.firstElementChild;
  root.append(pop);
  const anchor = root.querySelector(ids ? ".hud-more:not([hidden])" : `[data-cat="${cat}"]`);
  if (anchor) { const r = anchor.getBoundingClientRect(), h = root.getBoundingClientRect(); pop.style.left = `${Math.max(0, Math.min(r.left - h.left, h.width - 320))}px`; }
}
async function showCard(actor, item, at) {
  closePop();
  const { buildActionCard } = await import("./actioncard.mjs");
  const div = document.createElement("div");
  div.className = "twod12-hudcard";
  div.innerHTML = await buildActionCard(item, { actor });
  document.body.append(div);
  const r = at.getBoundingClientRect();
  div.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - div.offsetWidth - 8))}px`;
  div.style.bottom = `${Math.max(8, window.innerHeight - r.top + 8)}px`;
  st.card = div;
  div.addEventListener("click", ev => {
    const b = ev.target.closest("[data-action='useVersion'][data-ap]");
    if (b && !b.disabled) { ev.preventDefault(); closePop(); use(actor, item, Number(b.dataset.ap), ev.shiftKey); }
  });
  setTimeout(() => document.addEventListener("pointerdown", function away(ev) { if (!div.contains(ev.target)) { div.remove(); if (st.card === div) st.card = null; document.removeEventListener("pointerdown", away, true); } }, true), 0);
}
function showMenu(actor, item, ap, at) {
  closePop();
  const quick = quickKeys(actor);
  const aps = ap === null ? (item.system.versions ?? []).map(v => v.ap) : [ap];
  const pinned = aps.every(a => quick.has(`${item.id}:${a}`));
  const m = document.createElement("div");
  m.className = "hud-menu";
  m.innerHTML = `<button type="button" data-m="card">The Action card</button><button type="button" data-m="quick">${pinned ? "Remove from Quick" : "Add to Quick"}${ap === null ? "" : ` (${esc(item.system.reaction ? `${ap}R` : `${ap} AP`)})`}</button>`;
  root.append(m);
  const r = at.getBoundingClientRect(), h = root.getBoundingClientRect();
  m.style.left = `${Math.max(0, r.left - h.left)}px`;
  m.addEventListener("click", async ev => {
    const b = ev.target.closest("[data-m]"); if (!b) return;
    if (b.dataset.m === "card") return showCard(actor, item, at);
    const next = new Set(quick);
    for (const a of aps) { const k = `${item.id}:${a}`; if (pinned) next.delete(k); else next.add(k); }
    m.remove();
    await actor.setFlag(F, "hudQuick", [...next]);
  });
}

/* ------------------------------------------------------------------ clicks */
async function use(actor, item, ap, shift) {
  const { useAction } = await import("./actions.mjs");
  const skip = !!setting("hudSkipDialog", false) !== !!shift;
  return useAction(actor, item, { rdState: { ap }, skipDialog: skip });
}
async function onClick(ev) {
  const b = ev.target.closest("[data-hud]");
  if (!b || b.disabled) return;
  const cur = current(), actor = cur.actor, kind = b.dataset.hud;
  if (kind === "pick") { const t = canvas.tokens.get(b.dataset.token); t?.control({ releaseOthers: true }); return; }
  if (kind === "close") return closePop();
  if (!actor) return;
  const item = actor.items.get(b.closest("[data-item-id]")?.dataset.itemId ?? b.dataset.item ?? "");
  if (kind === "use" && item) { closePop(); return use(actor, item, Number(b.dataset.ap) || 0, ev.shiftKey); }
  if (kind === "card" && item) return showCard(actor, item, b);
  if (kind === "cat") { const c = b.dataset.cat; if (actor.type !== "npc") { st.open = st.open === c ? "" : c; root.querySelectorAll(".cat").forEach(x => { x.classList.toggle("on", x.dataset.cat === st.open); x.setAttribute("aria-pressed", String(x.dataset.cat === st.open)); }); } return st.open || actor.type === "npc" ? openPanel(c) : closePop(); }
  if (kind === "more") return openPanel("more", (b.dataset.items ?? "").split(",").filter(Boolean));
  if (kind === "attr") { const { CharacterSheet } = await import("./actor-sheets.mjs"); return CharacterSheet.rollAttr.call({ actor }, { shiftKey: ev.shiftKey || b.dataset.save === "1" }, { dataset: { key: b.dataset.key } }); }
  if (kind === "open" && item) return item.sheet.render(true);
  if (kind === "effect") return actor.effects.get(b.dataset.effect)?.sheet?.render(true);
  if (kind === "sheet") { const sh = actor.sheet; sh._activeTab = b.dataset.tab; return sh.render(true); }
  if (kind === "rest") {
    const { takeBreather, completeRest } = await import("./rest.mjs"), { completeSleep } = await import("./sleep.mjs");
    if (b.dataset.k === "breather") return takeBreather(actor, { ask: true });
    if (b.dataset.k === "sleep") return completeSleep(actor, { ask: true });
    if (b.dataset.k === "rest") return completeRest(actor);
  }
}
function onContext(ev) {
  const ha = ev.target.closest(".ha[data-item-id]");
  if (!ha) return;
  ev.preventDefault();
  const actor = current().actor, item = actor?.items.get(ha.dataset.itemId);
  if (!item) return;
  const v = ev.target.closest(".hv");
  if (actor.type === "npc") return showCard(actor, item, ha);
  return showMenu(actor, item, v ? Number(v.dataset.ap ?? item.system.versions?.[0]?.ap) : null, v ?? ha);
}

/** The pick bar asks in the HUD's middle while a choice waits (pickbar.mjs calls it): the slot, or null when there is no HUD on screen. */
export function hudAskSlot() {
  if (!root?.isConnected || root.hidden || !root.offsetParent) return null;
  return root.querySelector(".hud-ask");
}
export const hudAsking = on => root?.classList.toggle("asking", !!on);

export function registerHud() {
  Hooks.once("ready", () => renderHud());
  for (const h of ["controlToken", "canvasReady", "updateCombat", "combatTurn", "combatRound", "deleteCombat", "createActiveEffect", "deleteActiveEffect", "updateActiveEffect"]) Hooks.on(h, () => renderHud());
  const mine = a => a && (a.uuid === st.actorUuid || (globalThis.canvas?.tokens?.controlled ?? []).some(t => t.actor === a));
  Hooks.on("updateActor", a => { if (mine(a)) renderHud(); });
  for (const h of ["createItem", "updateItem", "deleteItem"]) Hooks.on(h, i => { if (mine(i.parent)) renderHud(); });
  Hooks.on("renderHotbar", () => { if (root) placeHotbar(); });
  for (const h of ["collapseSidebar", "changeSidebarTab", "renderSceneControls", "renderChatLog", "renderSidebar"]) Hooks.on(h, () => { placeRoot(); setTimeout(placeRoot, 450); });
  for (const h of ["renderPlayers", "renderPlayerList"]) Hooks.on(h, () => { if (root && !root.hidden) placePlayers(); });
  Hooks.on("updateUser", (u, ch) => { if (u.isSelf && "character" in (ch ?? {})) renderHud(); });
}
