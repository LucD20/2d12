// Token vision follows the Senses (see Senses in the rules): a creature can't see in Darkness unless it has Dark Sight. So a character's token has no vision range of its own
// (it sees what is lit), and a character with Dark Sight gets Foundry's darkvision. (Foundry's Global Illumination would make every scene lit for the players, whatever its Darkness.)

import { modeList } from "./modes.mjs";

/** The vision a token should have for its creature's Senses. */
export const visionFor = senses => (senses?.darksight ? { range: 1000, visionMode: "darkvision" } : { range: 0, visionMode: "basic" });
const same = (sight, v) => Number(sight?.range ?? 0) === v.range && (sight?.visionMode ?? "basic") === v.visionMode;
const data = (v, prefix = "") => ({ [`${prefix}sight.range`]: v.range, [`${prefix}sight.visionMode`]: v.visionMode });

/** A new character: its prototype token gets the vision of its Senses (called while it is being created). */
export function giveVision(actor) {
  try { actor.updateSource(data(visionFor(actor.system?.senses), "prototypeToken.")); } catch (e) { console.warn("twod12 | could not set the vision", e); }
}

/** One character: its prototype token and its tokens on every scene get the vision of its Senses. Returns how many were changed. */
export async function syncVisionOf(actor) {
  const v = visionFor(actor?.system?.senses);
  let n = 0;
  if (actor?.prototypeToken && !same(actor.prototypeToken.sight, v)) { await actor.update(data(v, "prototypeToken.")); n++; }
  for (const scene of game.scenes ?? []) {
    const ups = [];
    for (const t of scene.tokens) if (t.actorId === actor.id && !same(t.sight, v)) ups.push({ _id: t.id, ...data(v) });
    if (ups.length) { await scene.updateEmbeddedDocuments("Token", ups); n += ups.length; }
  }
  return n;
}

/** game.twod12.syncVision(): every character's tokens get the vision of their Senses. */
export async function syncVision() {
  let n = 0, who = 0;
  for (const actor of game.actors.filter(a => a.type === "character")) { const k = await syncVisionOf(actor); if (k) who++; n += k; }
  ui.notifications.info(n ? `Token vision updated for ${who} character${who === 1 ? "" : "s"} (${n} token setting${n === 1 ? "" : "s"}: their prototype tokens and the tokens on the scenes).` : "Every character's token vision already follows its Senses.");
  return n;
}

/** game.twod12.globalLight(false): turn Global Illumination off (or on) for this scene, or for every scene with { all: true }. */
export async function globalLight(enabled = false, { all = false } = {}) {
  const scenes = all ? [...game.scenes] : [canvas.scene].filter(Boolean);
  let n = 0;
  for (const sc of scenes) {
    const now = sc.environment?.globalLight?.enabled ?? sc.globalLight;
    if (!!now === !!enabled) continue;
    await sc.update({ "environment.globalLight.enabled": !!enabled }); n++;
  }
  ui.notifications.info(`Global Illumination ${enabled ? "on" : "off"} in ${n} scene${n === 1 ? "" : "s"}.`);
  return n;
}

/** game.twod12.visionInfo(): why a token sees what it sees (a line of text to copy). */
export function visionInfo() {
  const sc = canvas.scene, env = sc?.environment ?? {};
  const info = {
    scene: { name: sc?.name, darkness: env.darknessLevel ?? sc?.darkness ?? null, globalLight: env.globalLight?.enabled ?? sc?.globalLight ?? null, globalLightDarkness: env.globalLight?.darkness ?? null, tokenVision: sc?.tokenVision ?? null },
    tokens: (canvas.tokens?.placeables ?? []).filter(t => t.actor?.type === "character" || t.controlled).map(t => ({
      name: t.name, controlled: !!t.controlled, darkSight: !!t.actor?.system?.senses?.darksight,
      sight: { enabled: t.document.sight?.enabled ?? null, range: t.document.sight?.range ?? null, visionMode: t.document.sight?.visionMode ?? null },
      detection: modeList(t.document.detectionModes).map(m => `${m.id}:${m.range ?? "-"}`)
    }))
  };
  console.log("twod12 | vision " + JSON.stringify(info));
  ui.notifications.info(info.scene.globalLight
    ? "Global Illumination is ON in this scene (new scenes start with it, v0.0.164): the map is lit, and the rules of Light still hide creatures in Darkness (the sight gate). game.twod12.globalLight(false) turns it off."
    : "Global Illumination is off. Copy the console line that starts with \"twod12 | vision\" to see the vision of each token.");
  return info;
}
