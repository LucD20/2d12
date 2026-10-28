// Run with: node tools/tests/run.mjs (or node tools/tests/t35.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)), getRoute: p => "/" + p } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const msgs = []; globalThis.ChatMessage = { getSpeaker: () => ({}), create: async d => msgs.push(d.content) };
globalThis.fromUuid = async u => ({ name: u === "Item.a" ? "Reaping Sweep" : "Other" });
const pv = await import(ROOT + "module/preview.mjs");
const I = o => ({ pool: "B", useW: false, wCount: 1, dice: "", useAt: false, subtype: "", effect: "", ...o });
const V = (ap, t1, t2, t3, effects = "", ex = {}) => ({ ap, noTiers: false, t1, t2, t3, effects, ...ex });
const smite = { name: "Smite", system: { category: "Divine Power", level: 1, frequency: "round", traits: new Set(["strike", "divine", "melee", "weapon"]), targets: "One creature", check: "", vs: "body", versions: [
  V(1, [I({ useW: true })], [I({ useW: true }), I({ dice: "1d4", subtype: "H" })], [I({ useW: true }), I({ dice: "1d8", subtype: "H" }), I({ pool: "M", dice: "1d6", subtype: "H" })], "Bright light"),
  V(2, [I({ dice: "1d10", subtype: "B", effect: "Prone." })], [I({ pool: "", effect: "No effect." })], [I({ useAt: true, subtype: "S" }), I({ useW: true })]) ] } };
const html = await pv.buildRawCard(smite);
const cells = [...html.matchAll(/<th>Tier (\d)<\/th><td>(.*?)<\/td>/g)].map(m => `T${m[1]}: ${m[2]}`);
console.log(cells.join("\n"));
console.log("category:", /Divine Power 1/.test(html), "| freq+target:", /Round<\/span>.*One creature/s.test(html), "| 'Target:' label gone:", !/Target:/.test(html));
const weapon = { name: "Greatsword", system: { traits: new Set(["twohanded", "melee"]), subtype: "S", wielded: true, actions: ["Item.a"], damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } } } };
const wc = await pv.buildWeaponCard(weapon);
console.log("weapon card:", /Greatsword/.test(wc), /Slash/.test(wc), (wc.match(/<th>Tier \d<\/th><td>[^<]*/g) || []).map(x => x.replace(/<[^>]+>/g, " ")).join(" |"), "| actions:", /Reaping Sweep/.test(wc), "| wielded:", /Wielded/.test(wc));
const feat = { name: "Divine Power", type: "feature", system: { category: "Paladin Feature", level: 1, description: "<p>You gain Smite and Lay On Hands.</p>", traits: undefined } };
const ic = await pv.buildInfoCard(feat); console.log("info card:", /Paladin Feature 1/.test(ic), /You gain Smite/.test(ic));
const tal = { name: "Lesser Blessing", type: "talent", system: { category: "Talent", level: 1, frequency: "round", requirements: "Divine trait", traits: new Set(["divine", "magic"]), description: "<p>Pick one type of damage.</p>" } };
const tc = await pv.buildInfoCard(tal); console.log("talent card:", /Round/.test(tc), /Prerequisites:<\/b> Divine trait/.test(tc), /chev/.test(tc));
await pv.sendItemToChat({ ...smite, type: "action" }); await pv.sendItemToChat({ ...weapon, type: "weapon" }); console.log("sent:", msgs.length, "messages");
const eff = await import(ROOT + "module/effects.mjs");
console.log("shortName:", JSON.stringify(eff.shortName("Effect: Smite (3)")), JSON.stringify(eff.shortName("effect:Bless")), JSON.stringify(eff.shortName("Smite")));
const fl = { modifiers: [{ boons: 1, banes: 0, all: [], any: [], none: [] }] };
const list = [{ id: "e1", name: "Effect: Smite (3)", getFlag: (s, k) => fl[k] }]; list.get = id => list.find(e => e.id === id); const actor = { effects: list };
console.log("dialog chip name:", eff.modifierList(actor, new Set(["strike"]))[0]?.name, "| check card source:", eff.resolveModifiers(actor, ["e1:0"]).sources[0].name);
