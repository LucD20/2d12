// Run with: node tools/tests/run.mjs (or node tools/tests/t298.mjs)
// v0.0.487 (Lucas tested v0.0.486): PickWindow height overflow & Encounter End leadHtml order,
// Initiative dark theme (no undefined --s-pg2, iw-s-* classes instead of inline pastels),
// Area Height excluding dead/defeated tokens, and consolidated 2d12 Tools drawer (toolbox.mjs).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href;
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

globalThis.Hooks = { on() {}, once() {} };
globalThis.Combat = class {};
globalThis.CONFIG = { Canvas: { polygonBackends: {} } };
globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = {
  applications: { api: { ApplicationV2: class {}, DialogV2: {} }, ux: { TextEditor: { implementation: { enrichHTML: async h => h } } } },
  utils: { debounce: f => f, deepClone: o => JSON.parse(JSON.stringify(o)) }
};
globalThis.game = {
  user: { isGM: true },
  settings: { get: () => true, register() {} },
  combat: null
};

const css = fs.readFileSync(ROOT + "styles/theme.css", "utf8");
const defined = new Set([...css.matchAll(/(--s-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const used = [...new Set([...css.matchAll(/var\((--s-[a-z0-9-]+)\)/g)].map(m => m[1]))];
const undef = used.filter(u => !defined.has(u));
console.log("1. CSS tokens: zero undefined --s-* vars:", undef.length === 0, "| no --s-pg2:", !css.includes("--s-pg2"));

const hasAutoHeight = cls => new RegExp(`\\.${cls}[^{]*\\{[^}]*height:\\s*auto`).test(css);
console.log("2. Button auto height:", ["pw-opt", "ck-bb", "ck-chip", "tbx-btn"].map(c => `${c}=${hasAutoHeight(c)}`).join(" "));

const PW = await import(ROOTURL + "module/pickwindow.mjs");
const escSrc = fs.readFileSync(ROOT + "module/escalation.mjs", "utf8");
const html = PW.pickWindowHtml({
  name: "The encounter ends",
  sections: [{
    leadHtml: '<div class="esc-end-mom">Party Momentum: 2</div>',
    sub: "How did the encounter end for the party?",
    choices: [{ k: "overcome", l: "Overcome", sub: "+1 Momentum" }, { k: "retreat", l: "Retreat", sub: "-1 Momentum" }]
  }]
});
const iLead = html.indexOf("Party Momentum: 2");
const iSub = html.indexOf("How did the encounter end");
const iOpts = html.indexOf("pw-choices");
console.log("3. PickWindow leadHtml order: lead < sub < choices:", iLead > 0 && iLead < iSub && iSub < iOpts, "| askEncounterEnd uses leadHtml:", escSrc.includes("leadHtml: `<div class=\"pw-mombar\""));

const IV = await import(ROOTURL + "module/initview.mjs");
const ivHtml = IV.gmHtml({
  sub: "Encounter",
  playersLine: "Waiting on players",
  attrBtns: [{ key: "instinct", label: "Instinct", color: "#2d7344", on: true }],
  sides: [
    { key: "friendly", name: "Heroes", tag: "Allies", count: "1", caret: "▾", open: true, rows: [] },
    { key: "hostile", name: "Enemies", tag: "Hostile", count: "1", caret: "▾", open: true, rows: [] }
  ],
  sumRoll: "1", sumPlayer: "1", sumWait: "0", sumKept: "0", sumLast: "0",
  rollN: 1, rollLabel: "Roll Initiative"
});
console.log("4. Initiative theme: iw-s-friendly & iw-s-hostile:", ivHtml.includes("iw-sh iw-s-friendly") && ivHtml.includes("iw-sh iw-s-hostile"),
  "| no inline pastel bg on iw-sh:", !/class="iw-sh"[^>]*style="background:/.test(ivHtml),
  "| dark iwin rules in theme.css:", css.includes(".twod12.iwin .iw-sh.iw-s-friendly") && css.includes(".twod12.iwin .iw-lastb"));

const AH = await import(ROOTURL + "module/areaheight.mjs");
const mkTok = (id, name, { deadStatus = false, docDead = false, defeated = false, isDefeated = false, hidden = false, x = 0, y = 0, elev = 0 } = {}) => ({
  id, name,
  actor: { statuses: new Set(deadStatus ? ["dead"] : []), system: { size: "medium" } },
  combatant: { defeated, isDefeated },
  document: { x: x * 100, y: y * 100, width: 1, height: 1, elevation: elev, hidden, disposition: 1, hasStatusEffect: s => s === "dead" && docDead }
});
globalThis.canvas = {
  scene: { grid: { distance: 1 } },
  grid: { size: 100, getOffset: ({ x, y }) => ({ i: Math.floor(y / 100), j: Math.floor(x / 100) }) },
  tokens: {
    controlled: [],
    placeables: [
      mkTok("t1", "Aveline", { x: 1, y: 1 }),
      mkTok("t2", "Dead Orc", { deadStatus: true, x: 2, y: 1 }),
      mkTok("t3", "DocDead Goblin", { docDead: true, x: 3, y: 1 }),
      mkTok("t4", "Defeated Ogre", { defeated: true, x: 4, y: 1 }),
      mkTok("t4b", "IsDefeated Wisp", { isDefeated: true, x: 5, y: 1 }),
      mkTok("t6", "Live Goblin", { x: 2, y: 2, elev: 2 })
    ]
  }
};
const seeded = AH.seedFromScene();
console.log("5. Area Height live tokens only:", seeded.creatures.map(c => `${c.name}@z${c.z}`).join(", "));

const TB = await import(ROOTURL + "module/toolbox.mjs");
const gmGroups = TB.toolboxGroups({ isGM: true, active: { loe: true, range: true } });
const plGroups = TB.toolboxGroups({ isGM: false, active: {} });
const tbHtml = TB.toolboxHtml({ isGM: true, active: { loe: true, flank: true } });
const v12 = [{ name: "token", tools: [] }];
const v14 = { tokens: { tools: { select: {} } } };
TB.addToolboxControl(v12);
TB.addToolboxControl(v14);
console.log("6. 2d12 Tools drawer: GM groups:", gmGroups.map(g => `${g.title}(${g.items.length})`).join(", "),
  "| player groups:", plGroups.map(g => g.title).join(", "),
  "| active count badge:", tbHtml.includes("2 on"),
  "| single V12/V14 control:", v12[0].tools.length === 1 && Object.keys(v14.tokens.tools).length === 2 && !!v14.tokens.tools["twod12-tools"]);
