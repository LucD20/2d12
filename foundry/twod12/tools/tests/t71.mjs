// Run with: node tools/tests/run.mjs (or node tools/tests/t71.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
globalThis.Combat = class {}; globalThis.CONFIG = {};
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
const { checkHtml } = await import(ROOT + "module/roll.mjs");
const { prettyDamage, poolIcon, dtypeHtml } = await import(ROOT + "module/config.mjs");
const strip = h => h.replace(/data-tooltip="[^"]*"/g, "").replace(/<i class="fa-solid fa-link dlink"><\/i>/g, " ⛓ ").replace(/<span class="die d12([^"]*)"\s*>(\d+)<\/span>/g, (m, c, f) => `[${f}${c.trim() ? ":" + c.trim().replace(/ /g, ",") : ""}]`).replace(/<span class="die d3 (boon|bane)">(\d+)<\/span>/g, (m, k, f) => `{${k} ${f}}`).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const ex = { d1: [12, 8], d2: [4], doubles: false, base: 3, tier: 3, crit: false, total: 26, dc: 13, mod: 2, adj: 0, boonFaces: [1], baneFaces: [], sources: [{ name: "Aim", boons: 1 }], state: "", dropped: null };
console.log("explosion:", strip(checkHtml("Weapon Modifier · Body", ex, [], { status: false })));
const fail = { d1: [9], d2: [3], dropped: [11], state: "doomed", doubles: false, base: 1, tier: 1, crit: false, total: 11, dc: 13, mod: 1, adj: 0, boonFaces: [], baneFaces: [2], sources: [{ name: "Target is Hidden (Doomed)", banes: 0 }] };
console.log("failure:  ", strip(checkHtml("Weapon Modifier · Body", fail, [], { status: false })));
const dbl = { d1: [6], d2: [6], doubles: true, base: 2, tier: 3, crit: false, total: 15, dc: 13, mod: 2, adj: 0, boonFaces: [2], baneFaces: [1], sources: [] };
console.log("doubles:  ", strip(checkHtml("Weapon Modifier · Body", dbl, [], { status: false })));
const h = checkHtml("x", ex, []); console.log("shield classes:", (h.match(/class="shield[^"]*"/) || [])[0], "| fail shield:", (checkHtml("x", fail, []).match(/class="shield[^"]*"/) || [])[0]);
console.log("damage line:", prettyDamage("[B] 1[W] Sl").replace(/data-tooltip="[^"]*"/g, ""));
console.log("Mind Holy:  ", prettyDamage("[M] 1d4 Ho").replace(/data-tooltip="[^"]*"/g, ""));
console.log("choose:", poolIcon("C").includes("fa-heart") && poolIcon("C").includes("fa-brain"), "| Electricity:", dtypeHtml("El"), "| unknown:", JSON.stringify(dtypeHtml("Zz")));
