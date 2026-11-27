// Run with: node tools/tests/run.mjs (or node tools/tests/t330.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
// v0.0.532 (Lucas, playtest 11: "A target that is 'marked', like by Judge and similar, should have it on the situational tab [...] so we can remove it
// manually. And the chat card of these marks should have a 'Apply effect'"): the HUD's Marks entry (marks.mjs) and the card's Apply effect button.
globalThis.game = { settings: { get: () => undefined } };
const MK = await import(ROOTURL + "module/marks.mjs");
console.log("labels:", ["judge", "bound", "", "quarry"].map(MK.markLabel).join(", "));
const flags = { quarry: { uuid: "Scene.s.Token.gw", name: "Grave Wisp", kind: "judge" }, marks: { bound: { uuid: "Scene.s.Token.ka", name: "Kaela", kind: "bound" } } };
const durgan = { uuid: "Actor.du", getFlag: (s, k) => flags[k] };
const fx = (id, name, origin, f = {}) => ({ id, name, origin, disabled: false, getFlag: (s, k) => f[k] });
globalThis.canvas = { tokens: { placeables: [
  { name: "Ogre Chieftain", actor: { uuid: "Scene.s.Token.oc.Actor.oc", effects: [fx("e1", "Taunted (Durgan)", "Actor.du", { endsWithOrigin: true }), fx("e2", "Vulnerable 1", "Actor.du", {}), fx("e3", "Daunted", "Actor.sy", { endsWithOrigin: true })] } },
  { name: "Orc Warrior", actor: { uuid: "Scene.s.Token.ow.Actor.ow", effects: [fx("e4", "Grabbed", "Actor.du", { endsWithOrigin: true }), fx("e5", "Immobilized", "Actor.du", { endsWithOrigin: true, linkedTo: "e4" })] } },
  { name: "Durgan", actor: { uuid: "Actor.du", effects: [] } }
] } };
const inp = MK.placedOf(durgan);
console.log("read:", JSON.stringify(inp));
const m = MK.placedModel(inp);
console.log("rows:", m.rows.map(r => `${r.name}: ${r.what} (${r.key})`).join(" | "));
console.log("none:", MK.placedModel({ marks: [], conds: [] }));
const html = MK.placedHtml(m);
console.log("the entry: a title,", (html.match(/class="h3-hd-r h3-mk-r"/g) ?? []).length, "rows, a remove each:", (html.match(/data-hud="markrm"/g) ?? []).length, "| aria-label, no tooltip:", /aria-label="Remove Judged from Grave Wisp"/.test(html) && !/data-tooltip|title=/.test(html));
console.log("folded:", (MK.placedHtml({ ...m, folded: true }).match(/h3-mk-r/g) ?? []).length, "rows");
const hv = src("module/hudview.mjs"), hud = src("module/hud.mjs"), act = src("module/actions.mjs"), inl = src("module/inline.mjs"), mk = src("module/marks.mjs");
console.log("in the Situational tab after Hiding:", hv.includes("if (s.placed) avail.push(placedHtml(s.placed));"), "| the HUD builds it:", hud.includes("placed: placedMarks"), "| remove and fold:", hud.includes('kind === "markrm"') && hud.includes('kind === "markfold"'));
console.log("a remove posts a system line:", (mk.match(/sysLine\("fa-crosshairs"/g) ?? []).length === 2, "| through the GM when needed:", mk.includes('type: "deleteEffect"'), "| the owner or the GM:", mk.includes("if (!actor?.isOwner) return ui.notifications.warn("));
console.log("the card's Apply effect, also after a mark lands:", act.includes("{Apply effect}`, item)} places the mark again by hand"), "| on the targeted creature, else the card's:", inl.includes("(cardTok && !mine.has(cardTok.id) ? cardTok : null)"));
// v0.0.534 (Lucas on v0.0.533, pt-marks: "add the situational on the target of the mark as well 'Marked by'"): the mirror on the creature that
// carries them (carriedOf, the same model with dir "on"), both entries on a creature that does both, and one removal from either side.
{
  const store = {};   // flags by actor uuid
  const mkActor = (uuid, name, tokUuid, effects = []) => {
    const a = { uuid, name, documentName: "Actor", isOwner: true, effects, getActiveTokens: () => [{ document: { uuid: tokUuid } }],
      getFlag: (s, k) => store[uuid]?.[k], setFlag: async (s, k, v) => { const [h, t] = k.split("."); store[uuid] ??= {}; if (t) (store[uuid][h] ??= {})[t] = v; else store[uuid][h] = v; },
      unsetFlag: async (s, k) => { const [h, t] = k.split("."); if (t) delete store[uuid]?.[h]?.[t]; else delete store[uuid]?.[h]; } };
    effects.get = id => effects.find(e => e.id === id);
    return a;
  };
  const fx2 = (id, name, origin, f, owner) => ({ id, name, origin, disabled: false, getFlag: (s, k) => f[k], delete: async () => { const i = owner().effects.findIndex(e => e.id === id); if (i >= 0) owner().effects.splice(i, 1); } });
  let orc, durg, ogre;
  const ave = mkActor("Actor.av", "Aveline", "Scene.s.Token.av");
  orc = mkActor("Scene.s.Token.ow.Actor.ow", "Orc Warrior", "Scene.s.Token.ow", [fx2("t1", "Taunted (Durgan)", "Actor.du", { endsWithOrigin: true }, () => orc), fx2("v1", "Vulnerable 1", "Actor.du", {}, () => orc)]);
  durg = mkActor("Actor.du", "Durgan", "Scene.s.Token.du", [fx2("d1", "Daunted", "Scene.s.Token.oc.Actor.oc", { endsWithOrigin: true }, () => durg)]);
  ogre = mkActor("Scene.s.Token.oc.Actor.oc", "Ogre Chieftain", "Scene.s.Token.oc");
  store["Actor.av"] = { quarry: { uuid: "Scene.s.Token.ow", name: "Orc Warrior", kind: "judge" } };
  const all = [ave, orc, durg, ogre];
  globalThis.canvas = { tokens: { placeables: [{ name: "Aveline", actor: ave }, { name: "Orc Warrior", actor: orc }, { name: "Durgan", actor: durg }, { name: "Ogre Chieftain", actor: ogre }] } };
  globalThis.game = { settings: { get: () => undefined }, actors: { contents: [ave, durg] }, socket: { emit: (c, d) => console.log("socket:", JSON.stringify(d)) } };
  globalThis.fromUuid = async u => all.find(a => a.uuid === u) ?? null;
  const posted = []; globalThis.ChatMessage = { create: async d => posted.push(d.content), getSpeaker: () => ({}) };
  globalThis.Combat = class {}; globalThis.CONFIG = {}; globalThis.Hooks = { on() {}, once() {} };
  globalThis.foundry = { utils: { escapeHTML: s => s } }; globalThis.ui = { notifications: { warn: m => console.log("warn:", m) } };
  const on = a => MK.placedModel({ ...MK.carriedOf(a), dir: "on" }), by = a => MK.placedModel(MK.placedOf(a));
  const rows = m => (m ? m.rows.map(r => `${r.name}: ${r.what} (${r.key})`).join(" | ") : "none");
  const om = on(orc);
  console.log("Marked by, on the Orc Warrior:", rows(om));
  const oh = MK.placedHtml(om);
  console.log("its entry: the title", /<b>Marked by<\/b><span class="tg">others · 2<\/span>/.test(oh), "| rows:", (oh.match(/h3-mk-r/g) ?? []).length, "| a remove each:", (oh.match(/data-hud="markrm"/g) ?? []).length, "| aria-label:", /aria-label="Remove Judged by Aveline"/.test(oh), "| its own fold:", oh.includes('data-dir="on"'), "| no tooltip:", !/data-tooltip|title=/.test(oh));
  console.log("Durgan does both: by you:", rows(by(durg)), "|| Marked by:", rows(on(durg)));
  console.log("the Ogre carries nothing:", on(ogre), "| keys read back:", JSON.stringify(["m:judge:Actor.av", "m:bound", "c:Scene.s.Token.ow.Actor.ow:t1", "x"].map(MK.parseMarkKey)));
  // removal from the carrier's side: the Orc Warrior's ✕ on Judged clears Aveline's flag (she leaves her "by you" too)
  await MK.removeMark(orc, om.rows.find(r => r.what === "Judged").key);
  console.log("removed Judged from the orc's side: Aveline's by you:", rows(by(ave)), "| the orc's Marked by:", rows(on(orc)));
  // removal from the placer's side: Durgan's ✕ on Taunted (the orc's Marked by empties)
  await MK.removeMark(durg, by(durg).rows.find(r => r.what === "Taunted").key);
  console.log("removed Taunted from Durgan's side: the orc's Marked by:", rows(on(orc)), "| Durgan's by you:", rows(by(durg)));
  // a mark held by a creature the user doesn't own goes through the GM (the socket "clearMark")
  store["Actor.av"] = { quarry: { uuid: "Scene.s.Token.ow", name: "Orc Warrior", kind: "judge" } }; ave.isOwner = false;
  await MK.removeMark(orc, "m:judge:Actor.av");
  console.log("through the GM: Aveline's flag kept until the GM clears it:", !!store["Actor.av"].quarry);
  await MK.clearMarkAsGM({ markerUuid: "Actor.av", kind: "judge", markUuid: "Scene.s.Token.ow" });
  console.log("the GM clears it:", !store["Actor.av"].quarry);
  console.log("the lines:", posted.map(p => p.replace(/<[^>]+>/g, "")).map(t => t.replace(/\s+/g, " ").trim()).join(" || "));
  const dm = src("module/damage.mjs");
  console.log("the GM's socket:", dm.includes('data?.type === "clearMark"'), "| next to the by you entry:", hv.includes("if (s.carried) avail.push(placedHtml(s.carried));"), "| the HUD builds it:", hud.includes('carried: carriedMarks') && hud.includes('dir: "on"'));
}
