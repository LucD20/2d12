// Run with: node tools/tests/run.mjs (or node tools/tests/t305.mjs)
// v0.0.498 (Pass 3 — Combat Automation & Tactile Map UX):
// (1) Auto-Evade on Quick Shots / Darting Blade / Volley (autoEffectEvadeTag);
// (2) Feint Gold automation: T2 (+1 Boon vs target since v0.0.527; +2 before), T3 (+2 Boons since v0.0.527; Favored before), target-scoped expireOnUse, Critical (noReactionsVs + moment.mjs blocking);
// (3) Save Roll Dialog named modifier chips (saveExtraMods) + live Modifier Breakdown in checkRollHtml;
// (4) "Modifiers before Setup" reminder (.rd-setup-note) in Roll Dialog (dialogHtml);
// (5) Reaction "Move back" resets Foundry V14 movement ruler (revertRecordedMovement(movementId)) and clears Ctrl+Z moveUndoStack;
// (6) Push UX overhaul: Large 2x2 outer-edge aiming (pushNodeForCell) + full wall/creature collision damage (pushCollisionResult) preserving open-space short push.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(ROOTURL);
const src = f => fs.readFileSync(ROOT + f, "utf8");

globalThis.Hooks = { on() {}, off() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { time: {}, Canvas: { detectionModes: {} } };
globalThis.CONST = { KEYBINDING_PRECEDENCE: { PRIORITY: 1 } };
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { deepClone: o => JSON.parse(JSON.stringify(o ?? null)), randomID: () => "id_1" }
};
globalThis.game = {
  system: { version: "0.0.498" },
  user: { id: "gm", isGM: true, isActiveGM: true },
  settings: { register() {}, get: () => false },
  combat: null
};
globalThis.canvas = {
  grid: { size: 100, distance: 1, isSquare: true },
  tokens: { controlled: [], placeables: [], get: () => null },
  regions: { placeables: [] }
};

// 1. Auto-Evade tag matching (Quick Shots, Darting Blade, Volley)
const ACT = await import(ROOTURL + "module/actions.mjs");
console.log("autoEffectEvadeTag:",
  ACT.autoEffectEvadeTag({ noTiers: false, effects: "You @Move[evade|distance:2]." }),
  "|", ACT.autoEffectEvadeTag({ noTiers: false, effects: "You @Move[evade|distance:2|stow:drawn], then can stow the Light weapon you've drawn." }),
  "|", ACT.autoEffectEvadeTag({ noTiers: true, effects: "You @Move[evade|distance:2]." }) || "none",
  "|", ACT.autoEffectEvadeTag({ noTiers: false, effects: "You @Move[advance|distance:2]." }) || "none");

// 2. Feint automation (T2 1 Boon, T3 2 Boons since v0.0.527, target-scoped expiry, Critical noReactionsVs)
const { BASIC_ACTIONS } = await import(ROOTURL + "module/basic-data.mjs");
const feintCard = BASIC_ACTIONS.feint;
console.log("Feint basic-data automation:", feintCard?.automation);

const FX = await import(ROOTURL + "module/effects.mjs");
const BN = await import(ROOTURL + "module/bonus.mjs");
const CR = await import(ROOTURL + "module/condrules.mjs");
const MM = await import(ROOTURL + "module/moment.mjs");

let effSeq = 0;
function makeActor(uuid, name, items = []) {
  const list = [];
  const effects = Object.assign(list, {
    get: id => list.find(e => e.id === id) ?? null
  });
  return {
    uuid, name, isOwner: true, statuses: new Set(), system: { pool: 20, totalDamage: 0, attributes: { body: 2, mind: 1, appeal: 0, instinct: 2 } },
    items, itemTypes: { action: items },
    effects,
    createEmbeddedDocuments: async (type, arr) => {
      const created = arr.map(d => {
        const id = `ef_${++effSeq}`;
        const f = d.flags?.twod12 ?? {};
        const e = { id, name: d.name, disabled: false, origin: d.origin ?? "", statuses: new Set(d.statuses ?? []), getFlag: (ns, k) => (ns === "twod12" ? f[k] : undefined) };
        list.push(e);
        return e;
      });
      return created;
    },
    deleteEmbeddedDocuments: async (type, ids) => {
      for (const id of ids) {
        const idx = list.findIndex(e => e.id === id);
        if (idx >= 0) list.splice(idx, 1);
      }
    }
  };
}

const syl = makeActor("Actor.syl", "Sylwen");
const orcA = makeActor("Actor.orcA", "Orc A");
const orcB = makeActor("Actor.orcB", "Orc B");
const actorMap = new Map([[syl.uuid, syl], [orcA.uuid, orcA], [orcB.uuid, orcB]]);
globalThis.fromUuidSync = u => actorMap.get(u) ?? null;

// Feint Tier 2 -> +2 Boons on next Strike vs Orc A only
await FX.applyFeintEffect(syl, orcA, 2);
const mVsA = FX.modifierList(syl, new Set(["strike"]), [orcA]);
const mVsB = FX.modifierList(syl, new Set(["strike"]), [orcB]);
console.log("Feint T2 mods vs Orc A / vs Orc B:",
  mVsA.map(m => `${m.name}:+${m.boons}:match=${m.match}`).join(","),
  "|", mVsB.length);

// Strike against Orc B does NOT consume Feint against Orc A; Strike against Orc A DOES
await BN.expireOnUse(syl, new Set(["strike"]), new Set(), { rolled: true, targetUuids: [orcB.uuid] });
const leftAfterB = syl.effects.length;
await BN.expireOnUse(syl, new Set(["strike"]), new Set(), { rolled: true, targetUuids: [orcA.uuid] });
const leftAfterA = syl.effects.length;
console.log("Feint target-scoped expireOnUse (after Orc B / after Orc A):", leftAfterB, "/", leftAfterA);

// Feint Tier 3 -> 2 Boons on next Strike vs Orc A (v0.0.527; Favored before)
await FX.applyFeintEffect(syl, orcA, 3);
const mT3 = FX.modifierList(syl, new Set(["strike"]), [orcA]);
const rT3 = FX.resolveModifiers(syl, mT3.map(m => m.id));
console.log("Feint T3 (v0.0.527: 2 Boons, not Favored):", `${mT3[0]?.name}:+${mT3[0]?.boons}`, "| favored:", !!mT3[0]?.favored, "| resolveModifiers favored:", rT3.favored);

// Feint Critical -> Orc A can't use Reactions against Sylwen, CAN still use Reactions against other PC
await FX.applyFeintNoReactions(orcA, syl);
console.log("reactionsOffVs (vs Sylwen / vs Orc B):", CR.reactionsOffVs(orcA, syl.uuid), "/", CR.reactionsOffVs(orcA, orcB.uuid));

const oa = { id: "oa1", name: "Opportunity Attack", system: { reaction: true, reactionKind: "interrupt", moment: "enemyAway", momentRange: 1, versions: [{ ap: 1 }] } };
const orcWithRx = makeActor("Actor.orcRx", "Orc Warrior", [oa]);
await FX.applyFeintNoReactions(orcWithRx, syl);
const kaela = makeActor("Actor.kaela", "Kaela");
const mkTok = (id, actor, x, y, disp) => ({ id, name: actor.name, actor, document: { id, uuid: `Scene.s.Token.${id}`, x, y, width: 1, height: 1, disposition: disp } });
const tkOrc = mkTok("tOrc", orcWithRx, 100, 100, -1);
const tkSyl = mkTok("tSyl", syl, 200, 100, 1);
const tkKae = mkTok("tKae", kaela, 200, 100, 1);
globalThis.canvas.tokens.placeables = [tkOrc, tkSyl, tkKae];
const rxVsSyl = await MM.collectReactions({ kinds: ["enemyAway"], subjects: [{ actor: syl, token: tkSyl, at: tkSyl }] });
const rxVsKae = await MM.collectReactions({ kinds: ["enemyAway"], subjects: [{ actor: kaela, token: tkKae, at: tkKae }] });
console.log("collectReactions Feint Critical (vs Sylwen open/blocked | vs Kaela open/blocked):",
  `${rxVsSyl.rows.length}/${rxVsSyl.blocked.length} (${rxVsSyl.blocked[0]?.why ?? ""})`,
  "|", `${rxVsKae.rows.length}/${rxVsKae.blocked.length}`);

// 3. Save Roll Dialog named chips + live Modifier Breakdown
const INL = await import(ROOTURL + "module/inline.mjs");
const CW = await import(ROOTURL + "module/checkwindow.mjs");
const saveMods = INL.saveExtraMods(
  { boon: 3, bane: 0, nlSwitched: true, nonlethal: true, userBanes: 2, source: "Word of Radiance" },
  { mods: [{ id: "syn:save:vul", name: "Vulnerable 1", boons: 0, banes: 1, match: true }, { id: "syn:save:cover", name: "Low cover", boons: 1, banes: 0, bb: "field", match: true }] }
);
console.log("saveExtraMods:", saveMods.map(m => `${m.name}:${m.boons}/${m.banes}${m.favored ? ":fav" : ""}`).join(" | "));
const htmlSave = CW.checkRollHtml({
  title: "Body Save: Orc A", actorName: "Orc A", actorImg: "", attrKey: "body", baseMod: 2, dc: 14, adj: 0,
  boons: 0, banes: 0, favored: false, doomed: false, mods: saveMods, fxOn: new Set(saveMods.map(m => m.id)), notices: [], notes: []
});
const bdMatch = htmlSave.match(/<div class="ck-breakdown">([^<]+)<\/div>/);
console.log("checkRollHtml breakdown:", bdMatch?.[1] ?? "MISSING");
const favSaveMods = INL.saveExtraMods({ boon: 0, bane: 0 }, { mods: [{ id: "syn:save:cover", name: "High cover", boons: 0, banes: 0, favored: true, match: true }] });
const htmlFavSave = CW.checkRollHtml({
  title: "Body Save: Orc A", actorName: "Orc A", actorImg: "", attrKey: "body", baseMod: 2, dc: 14, adj: 0,
  boons: 0, banes: 0, favored: false, doomed: false, mods: favSaveMods, fxOn: new Set(favSaveMods.map(m => m.id)), notices: [], notes: []
});
console.log("High cover favored chip in checkRollHtml:", htmlFavSave.includes("3d12kh2") && htmlFavSave.includes("High cover (Favored)"));

// 4. "Modifiers before Setup" reminder in Roll Dialog
const RD = await import(ROOTURL + "module/rolldlg.mjs");
const baseInp = {
  name: "Strafe", versions: [{ ap: 2, cost: "2 AP", noTiers: false, tiers: { 1: {}, 2: {}, 3: {} } }],
  ap: 2, roll: { mod: 3, name: "Weapon" }, chips: [], creatures: [{ uuid: "Actor.orcA", name: "Orc A", def: "AD", dc: 13, owned: true }],
  rollModes: [], blocked: [], notices: []
};
const st0 = RD.newState(baseInp);
const dlgWithSetup = RD.dialogHtml({ ...baseInp, setupPending: true }, st0);
const dlgNoSetup = RD.dialogHtml({ ...baseInp, setupPending: false }, st0);
console.log("rd-setup-note (setupPending true / false):", dlgWithSetup.includes("rd-setup-note"), "/", dlgNoSetup.includes("rd-setup-note"));

// 5. Reaction "Move back" Foundry ruler reset wiring
const mmSrc = src("module/moment.mjs");
console.log("moment.mjs Move back ruler reset:",
  mmSrc.includes("movementId: before?.movementId")
  && mmSrc.includes("histLen: Number(before?.histLen) || 0")
  && mmSrc.includes("clearMoveUndo(doc.id)")
  && mmSrc.includes("doc.revertRecordedMovement(moveId || undefined)"));

// 6. Push UX overhaul: Large 2x2 outer-edge aiming + full wall/creature collision damage
const MV = await import(ROOTURL + "module/move.mjs");
const largeCells = [{ i: 2, j: 2 }, { i: 2, j: 3 }, { i: 3, j: 2 }, { i: 3, j: 3 }];
const pushMap = MV.pushShifts(largeCells, [{ i: 2, j: 1 }], 3);
const nInside = MV.pushNodeForCell(pushMap, largeCells, { i: 2, j: 3 });
const nRight1 = MV.pushNodeForCell(pushMap, largeCells, { i: 2, j: 4 });
const nRight3 = MV.pushNodeForCell(pushMap, largeCells, { i: 2, j: 6 });
const nDiag1 = MV.pushNodeForCell(pushMap, largeCells, { i: 4, j: 4 });
const nDiag3 = MV.pushNodeForCell(pushMap, largeCells, { i: 6, j: 6 });
console.log("Large 2x2 pushNodeForCell (inside / right1 / right3 / diag1 / diag3):",
  nInside ? `${nInside.di},${nInside.dj}` : "null",
  "|", nRight1 ? `${nRight1.di},${nRight1.dj}` : "null",
  "|", nRight3 ? `${nRight3.di},${nRight3.dj}` : "null",
  "|", nDiag1 ? `${nDiag1.di},${nDiag1.dj}` : "null",
  "|", nDiag3 ? `${nDiag3.di},${nDiag3.dj}` : "null");

// Collision damage: Push 4 aimed 1 square into an adjacent wall -> full 4 unused (8 Vigor)
const wallPath = [{ di: 0, dj: 0 }, { di: 0, dj: 1 }];
const wallOpts = { wallBetween: () => true, creatureAt: () => null, cornerAt: () => null };
const r0Wall = MV.analyzePath(wallPath, wallPath.length - 1, wallOpts);
const rFullWall = MV.pushCollisionResult(r0Wall, wallPath, 4, wallOpts, false);
const rRepoWall = MV.pushCollisionResult(r0Wall, wallPath, 4, wallOpts, true);
// Open space short push: Push 4 aimed 2 squares in open space -> moves 2, unused 0
const openPath = [{ di: 0, dj: 0 }, { di: 0, dj: 1 }, { di: 0, dj: 2 }];
const openOpts = { wallBetween: () => false, creatureAt: () => null, cornerAt: () => null };
const r0Open = MV.analyzePath(openPath, openPath.length - 1, openOpts);
const rShortOpen = MV.pushCollisionResult(r0Open, openPath, 4, openOpts, false);
console.log("pushCollisionResult (wall Push 4 / wall Repo / open short Push 2 of 4):",
  `done=${rFullWall.done},unused=${rFullWall.unused},dmg=${rFullWall.damage?.self}`,
  "|", `done=${rRepoWall.done},unused=${rRepoWall.unused}`,
  "|", `done=${rShortOpen.done},unused=${rShortOpen.unused},block=${!!rShortOpen.block}`);
