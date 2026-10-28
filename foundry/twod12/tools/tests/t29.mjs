// Run with: node tools/tests/run.mjs (or node tools/tests/t29.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.Combat = class {}; globalThis.foundry = { applications: { api: { DialogV2: {} }, ux: {} } }; globalThis.Hooks = { on() {} };
const g = await import(ROOTURL + "module/gen.mjs");
for (const t of ["Pushed 5", "Walk 5", "Evade 1", "Evade Walk/2", "Evade Move/2", "Evade half your Walk", "You move up to your Walk.", "Next Move is Hindered (EoT).", "An ally uses 1 Rally Point", "Pushed Body", "Walk 5 then Pushed 2"]) console.log(JSON.stringify(t).padEnd(34), "->", g.convertEffects(t));
console.log(g.convertEffects(g.convertEffects("Evade Walk/2")));
