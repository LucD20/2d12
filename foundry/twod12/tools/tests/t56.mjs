// Run with: node tools/tests/run.mjs (or node tools/tests/t56.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const cf = await import(ROOT + "module/config.mjs");
const chips = cf.traitChevrons(new Set(["weapon", "strike", "divine", "self", "body"]));
console.log("chips:", (chips.match(/class="tchip[^"]*"/g) || []).length, "| order:", chips.replace(/<[^>]+>/g, " ").trim().split(/\s+/).join(", "), "| rule underline on Strike/Weapon:", (chips.match(/tchip rule/g) || []).length);
const rl = await import(ROOT + "module/roll.mjs");
const html = rl.checkHtml("Weapon Modifier (Body)", { d1: [8], d2: [8], total: 18, dc: 13, doubles: true, base: 2, tier: 3, crit: false, boonFaces: [], baneFaces: [], sources: [], state: "" });
console.log("roll line:", html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), "| chips line present:", html.includes('class="chips"'));
const html2 = rl.checkHtml("Body Save", { d1: [3], d2: [5], total: 10, dc: 13, boonFaces: [2], baneFaces: [], sources: [{ name: "Bloodied", banes: 1 }], state: "doomed", dropped: [9], manualBoons: 0, manualBanes: 0 });
console.log("with chips:", html2.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
