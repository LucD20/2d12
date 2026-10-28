// Run with: node tools/tests/run.mjs (or node tools/tests/t44.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.HTMLElement = class { querySelectorAll() { return globalThis.__btns; } };
globalThis.document = { createElement: () => ({ classList: { add() {} }, dataset: {}, append() {}, set innerHTML(v) { this.html = v; } }) };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] }, statusEffects: [] };
const warns = [], infos = [], posted = [];
globalThis.ui = { notifications: { warn: m => warns.push(m), info: m => infos.push(m) } };
globalThis.foundry = { applications: { api: { DialogV2: { wait: async () => "b", confirm: async () => true, prompt: async () => null } }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p, escapeHTML: s => s } };
globalThis.Hooks = { on() {} };
globalThis.game = { settings: { get: () => true }, user: { targets: new Set(), id: "u" }, socket: { emit() {} }, combat: null, items: [], packs: [] };
globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => posted.push(d) };
// ---- 1. the wrong token: three skeleton tokens share one actor id
const { combatantOf } = await import(ROOT + "module/combat.mjs");
const base = { id: "A1" };
const tokActor = n => ({ id: "A1", isToken: true, token: { id: "T" + n }, name: "Skeleton " + n });
const combat = { combatants: [1, 2, 3].map(n => ({ id: "c" + n, tokenId: "T" + n, actorId: "A1", actor: tokActor(n) })) };
console.log("token 3 finds:", combatantOf(tokActor(3), combat).id, "| token 2:", combatantOf(tokActor(2), combat).id, "| linked actor, one combatant:", combatantOf({ id: "P1" }, { combatants: [{ id: "cp", actorId: "P1", actor: null }] }).id, "| ambiguous base actor:", combatantOf({ id: "A1" }, combat));
// ---- 2. generator + inline
const gen = await import(ROOT + "module/gen.mjs");
console.log(gen.parseTierFull('1d10S,"Cleave 1"').text, "|", gen.convertEffects("Cleave 2 and Prone"));
const inl = await import(ROOT + "module/inline.mjs"); inl.registerInline();
const enr = CONFIG.TextEditor.enrichers[0];
const run = async t => { const o = []; for (const m of t.matchAll(enr.pattern)) o.push((await enr.enricher(m)).html.replace(/<i[^>]*><\/i> /, "")); return o; };
console.log(await run("@Use[Weapon Attack|count:2|distinct:yes] @Use[category:Weapon Technique|count:2|boons:1|ap:1] @Use[trait:strike] @Cleave[2]"));
console.log(JSON.stringify(inl.parseInline("Use", "Weapon Attack|count:2|boons:1|distinct:yes|ap:1")), JSON.stringify(inl.parseInline("Cleave", "3")));
// ---- 3. grants
const us = await import(ROOT + "module/usage.mjs");
const T = (...t) => new Set(t);
const wa = { id: "wa", name: "Weapon Attack", type: "action", system: { category: "Basic Action", frequency: "", traits: T("strike", "weapon") } };
const rs = { id: "rs", name: "Reaping Sweep", type: "action", system: { category: "Weapon Technique", frequency: "", traits: T("strike", "melee", "weapon") } };
const flags = { grants: [{ spec: "Weapon Attack", left: 2, ap: 0, boons: 1, distinct: true, used: [] }, { spec: "category:Weapon Technique", left: 1, ap: 1, boons: 0, used: [] }] };
const eff = { id: "e1", name: "Double Shot", disabled: false, getFlag: (s, k) => flags[k] };
const actor = { type: "character", effects: [eff], getFlag: () => undefined, isOwner: true };
console.log("grants for Weapon Attack:", us.activeGrants(actor, wa).map(g => g.grant.left + "/" + g.grant.boons).join(","), "| for Reaping Sweep:", us.activeGrants(actor, rs).map(g => g.grant.ap).join(","), "| trait spec:", us.grantMatches("trait:strike", rs), us.grantMatches("trait:divine", rs));
// round-used Weapon Attack is not faded while a granted use exists
globalThis.game.combat = { id: "c1", started: true, round: 1, turn: 0 };
const store = { usage: { combatId: "c1", round: 1, roundUsed: ["wa"], encounter: [], turnKey: "1:0", strikes: 3 } };
actor.getFlag = (s, k) => store[k];
console.log("with a granted use, after 3 Strikes and Round used: faded =", us.isFaded(actor, wa).faded, "| Reaping Sweep (grant 1):", us.isFaded(actor, rs).faded);
flags.grants = []; console.log("no grants: faded =", us.isFaded(actor, wa).faded, us.isFaded(actor, wa).why);
// consume a grant
const fu = await import(ROOT + "module/freeuse.mjs");
flags.grants = [{ spec: "Weapon Attack", left: 2, ap: 0, boons: 0, distinct: true, used: [] }];
const deleted = []; const act2 = { effects: [eff], deleteEmbeddedDocuments: async (t, ids) => deleted.push(...ids) };
eff.setFlag = async (s, k, v) => { flags[k] = v; };
await fu.consumeGrant(act2, { effect: eff, index: 0 }, "Token.t1"); console.log("after 1 use:", flags.grants[0].left, JSON.stringify(flags.grants[0].used), "deleted:", deleted.length);
await fu.consumeGrant(act2, { effect: eff, index: 0 }, "Token.t2"); console.log("after 2 uses: deleted", deleted.join(","));
// the @Use label count
const msg = { getFlag: (s, k) => ({ uses: { "Weapon Attack": 1 } }[k]) };
const btn = { dataset: { cfg: JSON.stringify({ target: "Weapon Attack", count: 2 }) }, classList: { toggle(c, v) { this.t = [c, v]; } }, set innerHTML(v) { this.html = v; } };
globalThis.__btns = [btn]; fu.updateUseButtons(msg, new HTMLElement()); console.log("button after 1 of 2 used:", btn.html.replace(/<[^>]+>/g, "").trim(), JSON.stringify(btn.t));
// ---- 4. Cleave
globalThis.fromUuidSync = u => ({ object: { document: { uuid: u }, name: u, __pos: u } });
const mv = await import(ROOT + "module/move.mjs");
console.log("squaresBetween exported:", typeof mv.squaresBetween);
