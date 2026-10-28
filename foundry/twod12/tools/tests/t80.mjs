// Run with: node tools/tests/run.mjs (or node tools/tests/t80.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Floating text on tokens: damage (red Body, blue Mind, green healing) and effects (+ Exhausted 2, - Exhausted).
const hooks = {}, shown = [], settings = { floatText: true, floatStyle: "plain" };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once() {} };
globalThis.CONST = { TEXT_ANCHOR_POINTS: { TOP: 2, BOTTOM: 0 } };
globalThis.CONFIG = {};
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)), hasProperty: (o, path) => path.split(".").reduce((x, k) => (x && k in x ? x[k] : undefined), o) !== undefined } };
globalThis.game = { settings: { get: (s, k) => settings[k], register() {} }, user: { isGM: false } };
globalThis.canvas = { interface: { createScrollingText: (origin, text, opts) => shown.push({ at: origin.x + "," + origin.y, text, fill: opts.fill, anchor: opts.anchor, direction: opts.direction }) } };
const F = await import(ROOTURL + "module/floattext.mjs");
F.timing.stagger = 0;
F.registerFloatText();
const token = (visible = true) => ({ center: { x: 100, y: 200 }, visible, document: { hidden: false } });
const mkActor = (damage, tokens = [token()]) => ({ system: { damage }, getActiveTokens: () => tokens });
const wait = () => new Promise(r => setTimeout(r, 15));
const show = label => console.log(label.padEnd(44), shown.splice(0).map(s => `${s.text} ${s.fill}${s.direction === 0 ? " (slides down)" : ""}`).join(" | ") || "(nothing)");
// damage: the real flow, preUpdate (the client that changes it) then update (every client)
const hit = async (actor, before, after) => { const options = {}; const changes = { system: { damage: after } }; actor.system.damage = before; hooks.preUpdateActor(actor, changes, options); actor.system.damage = { ...before, ...after }; hooks.updateActor(actor, changes, options); await wait(); };
const A = mkActor({ bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 });
await hit(A, { bodyLethal: 4, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, { bodyLethal: 9 }); show("5 Body damage");
await hit(A, { bodyLethal: 9, bodyNonlethal: 0, mindLethal: 2, mindNonlethal: 0 }, { mindLethal: 6 }); show("4 Mind damage");
await hit(A, { bodyLethal: 9, bodyNonlethal: 0, mindLethal: 6, mindNonlethal: 0 }, { bodyLethal: 3 }); show("6 Body healed (a Rally)");
await hit(A, { bodyLethal: 3, bodyNonlethal: 1, mindLethal: 6, mindNonlethal: 0 }, { bodyNonlethal: 4 }); show("3 nonlethal Body damage");
await hit(A, { bodyLethal: 3, bodyNonlethal: 4, mindLethal: 6, mindNonlethal: 2 }, { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }); show("a Rest: everything removed");
await hit(A, { bodyLethal: 0, bodyNonlethal: 0, mindLethal: 0, mindNonlethal: 0 }, { bodyLethal: 5, mindLethal: 3 }); show("Body and Mind in one hit");
// no values before the update (made by something that skipped preUpdate): nothing
const C = mkActor({ bodyLethal: 5 }); hooks.updateActor(C, { system: { damage: { bodyLethal: 5 } } }, {}); await wait(); show("no previous values");
// effects
const fx = (name, parent) => ({ name, parent, disabled: false });
hooks.createActiveEffect(fx("Exhausted 1", A)); await wait(); show("effect added");
const up = fx("Exhausted 2", A); const o1 = {}; hooks.preUpdateActiveEffect(up, { name: "Exhausted 3" }, o1); up.name = "Exhausted 3"; hooks.updateActiveEffect(up, { name: "Exhausted 3" }, o1); await wait(); show("raised: 2 → 3");
const dn = fx("Exhausted 2", A); const o2 = {}; dn.name = "Exhausted 3"; hooks.preUpdateActiveEffect(dn, { name: "Exhausted 2" }, o2); dn.name = "Exhausted 2"; hooks.updateActiveEffect(dn, { name: "Exhausted 2" }, o2); await wait(); show("lowered: 3 → 2");
hooks.deleteActiveEffect(fx("Exhausted 4", A)); await wait(); show("removed");
hooks.createActiveEffect(fx("Effect: Aim (1 Boon)", A)); await wait(); show("an effect from the compendium");
const o3 = {}; const ticking = fx("Aim", A); hooks.preUpdateActiveEffect(ticking, { flags: { twod12: { remaining: 2 } } }, o3); hooks.updateActiveEffect(ticking, { flags: { twod12: { remaining: 2 } } }, o3); await wait(); show("a duration ticking down");
// tokens a player can't see, the GM, and the setting
const hidden = mkActor({}, [token(false)]); hooks.createActiveEffect(fx("Hidden thing", hidden)); await wait(); show("a token the player can't see");
game.user.isGM = true; hooks.createActiveEffect(fx("Seen by the GM", hidden)); await wait(); show("the same token, as GM");
settings.floatText = false; hooks.createActiveEffect(fx("Nope", A)); await wait(); show("with the setting off");
