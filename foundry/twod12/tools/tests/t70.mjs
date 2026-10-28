// Run with: node tools/tests/run.mjs (or node tools/tests/t70.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { areaButton, metaRowHtml, distanceText } = await import(ROOT + "module/config.mjs");
const T = (...t) => new Set(t);
const whirl = { traits: T("area", "melee", "self", "strike", "weapon"), areaCfg: { size: 1, shape: "emanation", within: 0, targets: "all", center: false, keep: false, rounds: 0 }, area: "1 Emanation" };
console.log("Whirlwind (Self, around you):", areaButton(whirl));
const fire = { traits: T("area", "magic"), areaCfg: { size: 2, shape: "emanation", within: 10, targets: "enemies", center: true, keep: true, rounds: 3 }, area: "2 Emanation within 10 sq." };
console.log("Fire within 10 sq.:           ", areaButton(fire));
console.log("old text only (no settings):  ", areaButton({ traits: T(), area: "1 Emanation" }));
const row = metaRowHtml({ frequency: "encounter", targetText: "All creatures in the Area", distance: distanceText(whirl), self: true });
console.log("meta row:", row.replace(/<i [^>]+><\/i>/g, " · ").replace(/<(?!\/?b>)[^>]+>/g, "").trim());
