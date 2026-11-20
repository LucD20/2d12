// v0.0.454: playtest 6's D1 and D2 AS BUILT (the system's own healwin.mjs healWinHtml, healLinesHtml through sysmsg.mjs sysLine, chatcards.mjs
// ledgerModel / ledgerHtml) on example data. built.html?theme=dark|light
const q = new URLSearchParams(location.search), theme = q.get("theme") === "light" ? "light" : "dark";
document.body.classList.add(`theme-${theme}`, "themed");
globalThis.game = { settings: { get: () => true }, user: { isGM: true } };
const HW = await import("../../twod12/module/healwin.mjs"), MSG = await import("../../twod12/module/sysmsg.mjs"), CC = await import("../../twod12/module/chatcards.mjs");
const dmg = { bodyLethal: 9, bodyNonlethal: 2, mindLethal: 6, mindNonlethal: 0 }, thr = { vigor: 23, resolve: 12 };
const o = (top, parts) => ({ name: "Durgan", damage: dmg, thresholds: thr, partsFor: n => parts(n), rally: { max: 7, left: 6, top } });
const win = (title, html) => `<div class="application twod12 twod12-healwin frame"><header>${title}</header><div class="window-content">${html}</div></div>`;
const def = n => ({ ...HW.symmetricHealing(dmg, thr, 9 * n) });
const out = [];
out.push(`<h2>D1: the Rally window (B)</h2><div class="row">${win("Rally: Durgan", HW.healWinHtml(o(1, n => [[9 * n, ""]]), { n: 1, values: def(1), split: false }))}${win("Rally: Durgan", HW.healWinHtml(o(1, n => [[9 * n, ""]]), { n: 1, values: def(1), split: true }))}${win("Rally: Durgan", HW.healWinHtml(o(3, n => [[9 * n, ""], [3, "Font of Mercy"], [4, "Lay On Hands"]]), { n: 2, values: def(2), split: false }))}</div>`);
const line = (plan, parts, rally) => `<div class="msg">${MSG.sysLine("fa-heart-pulse", HW.healLinesHtml("Durgan", plan, parts, { rally }), "healmsg rallymsg")}</div>`;
out.push(`<h2>D1: the message</h2><div class="row">${line({ bodyLethal: 9 }, [[9, ""]], { n: 1, left: 6 })}${line({ bodyLethal: 9, mindLethal: 5, bodyNonlethal: 1 }, [[9, ""], [3, "Font of Mercy"], [4, "Lay On Hands"]], { n: 1, left: 5 })}</div>`);
const comps = [{ pool: "B", sub: "Sl", total: 7, formula: "1d8", dice: [{ faces: 8, results: [6] }] }, { pool: "B", sub: "Sl", total: 1, kind: "A", dice: [], label: "Weapon" }, { pool: "M", sub: "Ho", total: 7, formula: "2d6", dice: [{ faces: 6, results: [3, 4] }] }];
const mods = [{ v: -2, label: "Resist Slash", sub: "Sl", kind: "resist" }, { v: 2, label: "Weak Holy", sub: "Ho", kind: "weak" }, { v: -3, label: "Shield of Faith", kind: "reduce" }, { v: -2, label: "Guard", kind: "guard" }];
const card = CC.damageCardHtml({ name: "Smite", nl: false, groups: [{ tier: 2, comps, rows: [0] }], rows: [{ name: "Orc Warrior", mods, applied: null }] }, CC.viewOf({ gm: true }));
out.push(`<h2>D2: the breakdown (opened)</h2><div class="row"><div class="twod12 chat cc" style="width:300px">${card.replace('class="cc-adjrow ondemand"', 'class="cc-adjrow ondemand open"')}</div></div>`);
document.getElementById("page").innerHTML = out.join("");
document.body.dataset.ready = "1";
