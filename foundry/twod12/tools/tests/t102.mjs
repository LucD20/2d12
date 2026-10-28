// Run with: node tools/tests/run.mjs (or node tools/tests/t102.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
// Areas: "within N sq." from the user, Line of Effect and cover from the Point of Origin; and the scene's light level label.
const GS = 100, settings = { lightDimBelow: 0.7, lightDarkBelow: 0.4 };
globalThis.Combat = class {}; globalThis.CONFIG = { TextEditor: { enrichers: [] } }; globalThis.Hooks = { on: (h, f) => (hooks[h] ??= []).push(f), once() {} };
const hooks = {};
globalThis.ui = { notifications: { info() {}, warn() {} } };
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: { enrichHTML: async t => t } } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } };
globalThis.game = { settings: { get: (s, k) => settings[k] }, user: { id: "u" }, combat: null };
const tokens = [];
globalThis.canvas = { ready: true, grid: { size: GS, isSquare: true, getOffset: ({ x, y }) => ({ i: Math.floor(y / GS), j: Math.floor(x / GS) }), getTopLeftPoint: ({ i, j }) => ({ x: j * GS, y: i * GS }), getCenterPoint: ({ i, j }) => ({ x: j * GS + GS / 2, y: i * GS + GS / 2 }) }, tokens: { placeables: tokens, controlled: [] }, environment: { darknessLevel: 0.2 }, lighting: { active: false }, scene: {} };
let n = 0;
const tok = (name, col, row, w = 1) => { const t = { id: "t" + ++n, name, document: { id: "t" + n, x: col * GS, y: row * GS, width: w, height: w, hidden: false }, actor: { statuses: new Set() } }; tokens.push(t); return t; };
const T = await import(ROOTURL + "module/template.mjs"), CV = await import(ROOTURL + "module/cover.mjs");
const spaceCenter = t => ({ x: t.document.x + t.document.width * GS / 2, y: t.document.y + t.document.height * GS / 2 });
console.log("--- how far the Point of Origin is from the creature using the Action");
const user = tok("Kai", 0, 5), far = tok("Far", 12, 5), near = tok("Near", 1, 5), diag = tok("Diag", 4, 9), big = tok("Big", 3, 4, 2);
const dist = (label, placed, within = 10) => { const d = T.placementDistance(user, placed); console.log(label.padEnd(58), String(d).padStart(2), "squares |", d <= within ? `within ${within}` : `too far for within ${within}`); };
dist("an Emanation around a creature next to Kai", { origin: near });
dist("around a creature 12 squares away", { origin: far });
dist("around a creature 4 across and 4 down (2 diagonals: 4 + 2)", { origin: diag });
dist("around a Large creature (2x2) 2 squares away", { origin: big });
dist("an empty square 7 squares away", { origin: null, point: { x: 7 * GS + 50, y: 5 * GS + 50 } });
dist("an empty square exactly 10 away (allowed by within 10)", { origin: null, point: { x: 10 * GS + 50, y: 5 * GS + 50 } });
dist("an empty square 11 away (too far)", { origin: null, point: { x: 11 * GS + 50, y: 5 * GS + 50 } });
dist("a grid corner between the squares at 6 and 7", { origin: null, point: { x: 7 * GS, y: 5 * GS } });
dist("a corner touching Kai's own square", { origin: null, point: { x: 1 * GS, y: 5 * GS } });
console.log("no user or nothing placed:", T.placementDistance(null, { origin: near }), T.placementDistance(user, null), T.placementDistance(user, { origin: null }));
tokens.length = 0; n = 0;
console.log("--- Line of Effect and cover from the Point of Origin");
const wallAt = x => (a, b) => (a.x < x) !== (b.x < x);                       // a long wall between two columns
const o = tok("Nari", 2, 5), a1 = tok("Ally", 3, 5), behind = tok("Behind the wall", 6, 5), edge = tok("At the wall", 4, 5);
const reach = (label, placed, list, blockedFn) => { const r = T.areaReach(placed, list, { blockedFn }); console.log(label.padEnd(54), "affected:", r.affected.map(t => t.name).join(", ") || "-", "| no Line of Effect:", r.blocked.map(t => t.name).join(", ") || "-", "| cover:", Object.entries(r.cover).map(([id, c]) => `${tokens.find(t => t.id === id).name} ${c.label}`).join(", ")); return r; };
const around = { origin: o, point: spaceCenter(o) };
reach("no walls, around Nari", around, [a1, edge, behind]);
reach("a wall between columns 4 and 5", around, [a1, edge, behind], wallAt(500));
reach("the wall right behind the Ally (between 3 and 4)", around, [a1, edge, behind], wallAt(400));
reach("only the top corners blocked (a low wall)", around, [a1], (p, c) => c.y < 5 * GS + 50);
reach("only one corner blocked", around, [a1], (p, c) => c.x < 3 * GS + 10 && c.y < 5 * GS + 10);
for (const t of [a1, edge, behind]) tokens.splice(tokens.indexOf(t), 1);   // the others leave, so each case is on its own
const mid = tok("In the way", 3, 5), tgt = tok("Behind it", 5, 5);
reach("a creature on the line gives Low cover", around, [tgt]);
reach("... Nari herself never stands in the way (she is the origin)", { origin: o, point: spaceCenter(o) }, [mid]);
reach("an empty square as the origin: the creature there counts", { origin: null, point: { x: 2 * GS + 50, y: 5 * GS + 50 } }, [tgt]);
reach("a Burst at a corner", { origin: null, point: { x: 5 * GS, y: 5 * GS } }, [tgt, mid]);
const onIt = tok("On the origin", 8, 8); reach("the origin is inside the creature's own space", { origin: null, point: spaceCenter(onIt) }, [onIt], wallAt(850));
const between = tok("Between", 8, 5), lean = tok("Leaning", 9, 5);
const plain = T.areaReach({ origin: null, point: { x: 7 * GS + 50, y: 5 * GS + 50 } }, [lean]).cover[lean.id];
lean.actor.statuses.add("leaning"); const exposed = T.areaReach({ origin: null, point: { x: 7 * GS + 50, y: 5 * GS + 50 } }, [lean]).cover[lean.id];
console.log("a creature behind another, then Leaning (exposed: cover reduced by 1):", plain.label, "->", exposed.label, "| exposed:", exposed.exposed);
canvas.grid.isSquare = false; const ns = T.areaReach(around, [mid]); canvas.grid.isSquare = true;
console.log("on a grid that isn't square nobody is excluded and no cover is worked out:", ns.affected.length, "affected,", Object.keys(ns.cover).length, "covers");
console.log("without a Point of Origin everyone is affected:", T.areaReach({ origin: o }, [a1, behind], { blockedFn: () => true }).affected.map(t => t.name).join(", "));
const c = CV.coverFromPoint({ x: 250, y: 550 }, a1, { blockedFn: () => false, exclude: [], others: [] });
console.log("the result of coverFromPoint:", JSON.stringify({ blocked: c.blocked, level: c.level, banes: c.banes, noLoE: c.noLoE, label: c.label }), "| null without a target:", CV.coverFromPoint({ x: 0, y: 0 }, null));
// ------------------------------------------------------------------ the light level under the Darkness slider
console.log("--- the scene's light level, under the Darkness slider");
const L = await import(ROOTURL + "module/lightlabel.mjs");
for (const d of [0, 0.3, 0.31, 0.5, 0.6, 0.61, 1]) console.log(`Darkness ${d}:`.padEnd(16), L.lightLabelText(d));
canvas.environment.darknessLevel = 0.75; console.log("the scene's own level:", L.lightLabelText());
const band = (a, b) => L.lightBands(a, b).map(x => `${x.level} ${x.from.toFixed(2)}-${x.to.toFixed(2)}`).join(" | ");
console.log("the zones (default thresholds 0.7 / 0.4):", band(0.7, 0.4));
console.log("the zones with your own thresholds (0.5 / 0.2):", band(0.5, 0.2));
console.log("thresholds that cross each other or leave 0 to 1:", band(0.2, 0.6), "|", band(1.4, -0.3));
console.log("the zones follow the world settings:", L.lightBands().map(x => x.level + " " + x.to.toFixed(2)).join(" | "), "(settings 0.7 / 0.4)"); settings.lightDimBelow = 0.5; settings.lightDarkBelow = 0.1; console.log("... changed to 0.5 / 0.1:", L.lightBands().map(x => x.level + " " + x.to.toFixed(2)).join(" | ")); settings.lightDimBelow = 0.7; settings.lightDarkBelow = 0.4;
const html = L.barHtml(0.55);
console.log("the bar for Darkness 0.55: widths", [...html.matchAll(/class="lb-(bright|dim|dark)" style="width:([\d.]+)%">([^<]*)</g)].map(m => `${m[1]} ${m[2]}% "${m[3]}"`).join(" | "), "| marker at", /lb-mark" style="left:([\d.]+)%/.exec(html)[1] + "%", "| text:", /lb-text">([^<]*)</.exec(html)[1]);
console.log("the marker at the ends:", /left:([\d.]+)%/.exec(L.barHtml(0))[1], /left:([\d.]+)%/.exec(L.barHtml(1))[1], "| beyond them:", /left:([\d.]+)%/.exec(L.barHtml(-2))[1], /left:([\d.]+)%/.exec(L.barHtml(7))[1], "| a narrow zone has no name:", L.barHtml(0.5, L.lightBands(0.95, 0.9)).match(/lb-bright" style="width:[\d.]+%">([^<]*)</)[1] === "");
// finding the slider among the other controls
const el = (tag, o) => ({ tagName: tag, id: o.id ?? "", className: o.cls ?? "", getBoundingClientRect: () => ({ left: o.l ?? 0, top: o.t ?? 20, width: o.w, height: o.h ?? 16, right: (o.l ?? 0) + o.w, bottom: (o.t ?? 20) + (o.h ?? 16) }), getAttribute: k => (o.attrs ?? {})[k] ?? null, addEventListener: (ev, f) => (o.listeners ??= {})[ev] = f, _o: o });
const doc = list => ({ querySelectorAll: () => list });
const named = el("input", { w: 300, attrs: { name: "environment.darknessLevel" }, l: 60 }), wide = el("input", { w: 420, l: 50 }), narrow = el("input", { w: 90 }), low = el("input", { w: 500, t: 700 }), hidden = el("input", { w: 400, h: 0 });
const pick = (label, list) => { const f = L.findDarknessSlider(doc(list)); console.log(label.padEnd(60), f ? `${f.tagName} ${f.id || f.className || (f.getAttribute("name") ?? "")} width ${f.getBoundingClientRect().width}` : "none"); return f; };
pick("a wide slider near the top", [narrow, wide, low]);
pick("one that names darkness comes first, even if narrower", [wide, named]);
pick("a slider by its class", [el("div", { cls: "scene-darkness-slider", w: 380 }), wide]);
pick("only narrow, low or hidden ones", [narrow, low, hidden]);
pick("nothing on the page", []);
console.log("no document:", L.findDarknessSlider(undefined));
// where the bar goes
console.log("under the slider:", JSON.stringify(L.barPlacement({ left: 50, bottom: 36, width: 420 })), "| no slider: no bar:", L.barPlacement(null), L.barPlacement(undefined));
// the whole thing on a screen
console.log("--- on the screen");
const made = [], shown = new Map(); const sliderEl = el("input", { w: 400, l: 56, t: 14, h: 18, attrs: { name: "darkness" } }); let dom = [];
const mkEl = () => { const e = { style: {}, id: "", _html: "", listeners: {}, parts: { ".lb-mark": { style: {} }, ".lb-text": { textContent: "" } }, addEventListener: (ev, f) => { e.listeners[ev] = f; }, querySelector: sel => e.parts[sel] }; Object.defineProperty(e, "innerHTML", { get: () => e._html, set: v => { e._html = v; } }); return e; };
globalThis.document = { createElement: () => { const e = mkEl(); made.push(e); return e; }, body: { appendChild: e => shown.set(e.id, e) }, getElementById: id => (id === "scene-controls" ? { getBoundingClientRect: () => ({ left: 6, bottom: 260, right: 52 }) } : null), querySelector: () => null, querySelectorAll: () => dom };
canvas.environment.darknessLevel = 0.5;
const upd = L.registerLightLabel();
console.log("the lighting layer is not active:", made.length, "elements made");
canvas.lighting.active = true; dom = [sliderEl]; upd(); const bar = shown.get("twod12-lightlevel");
console.log("active, slider found:", JSON.stringify({ display: bar.style.display, left: bar.style.left, top: bar.style.top, width: bar.style.width }), "|", /lb-text">([^<]*)</.exec(bar.innerHTML)[1]);
console.log("it listens to the slider:", Object.keys(sliderEl._o.listeners ?? {}).sort().join(", "));
canvas.environment.darknessLevel = 0.9; sliderEl._o.listeners.input(); console.log("the slider is dragged:", /lb-text">([^<]*)</.exec(bar.innerHTML)[1], "| marker", /left:([\d.]+)%/.exec(bar.innerHTML)[1] + "%");
dom = []; upd(); console.log("the slider is not found: no bar (the button has the same):", bar.style.display);
await new Promise(r => setTimeout(r, 450)); console.log("the hooks redraw a moment later (a slider drawn late is found):", (hooks.renderSceneControls.forEach(f => f()), dom = [sliderEl], await new Promise(r => setTimeout(r, 500)), bar.style.top));
canvas.lighting.active = false; upd(); console.log("another layer is active:", bar.style.display);
canvas.ready = false; canvas.lighting.active = true; upd(); console.log("no canvas yet:", bar.style.display, "| hooks:", Object.keys(hooks).sort().join(", "));
// the diagnostic
canvas.ready = true; dom = [sliderEl, el("input", { w: 80, cls: "other" })];
const logs = []; const lg = console.log; console.log = (...a) => logs.push(a.join(" ")); const notes = []; ui.notifications.info = m => notes.push(m); const info = L.sliderInfo(); console.log = lg;
console.log("sliderInfo, found:", JSON.stringify(info.found), "| ranges listed:", info.ranges.length, "| the line to copy:", logs[0].slice(0, 26) + "...", "|", notes.pop().slice(0, 52) + "...");
dom = []; console.log = (...a) => logs.push(a.join(" ")); const none = L.sliderInfo(); console.log = lg; console.log("sliderInfo, nothing found:", none.found, "|", notes.pop().slice(0, 40) + "...");

// ------------------------------------------------------------------ the light level button of the lighting controls, and its panel
console.log("--- the button in the lighting controls");
console.log("the icon:", [0, 0.2, 0.3, 0.31, 0.5, 0.6, 0.61, 0.95].map(d => `${d}: ${L.lightIcon(d).replace("fa-solid ", "")}`).join(" | "));
console.log("the panel for the GM (Darkness 0.55):", JSON.stringify({ range: /class="lb-range" min="0" max="1" step="0.01" value="([\d.]+)"/.exec(L.popoverHtml(0.55, true))?.[1], disabled: /disabled/.test(L.popoverHtml(0.55, true)), zones: (L.popoverHtml(0.55, true).match(/class="lb-(bright|dim|dark)"/g) ?? []).length, hint: /lb-hint">([^<]*)</.exec(L.popoverHtml(0.55, true))[1] }));
console.log("for a player:", JSON.stringify({ disabled: /disabled/.test(L.popoverHtml(0.4, false)), hint: /lb-hint">([^<]*)</.exec(L.popoverHtml(0.4, false))[1] }), "| a value out of range:", /value="([\d.]+)"/.exec(L.popoverHtml(7, true))[1], /value="([\d.]+)"/.exec(L.popoverHtml(-1, true))[1]);
console.log("where the panel goes:", JSON.stringify(L.popoverPlacement({ right: 56, top: 140 })), "| the button isn't there:", JSON.stringify(L.popoverPlacement(null)));
// the controls
const tool = c => { const t = L.addLightTool(c, () => {}, "fa-solid fa-sun"); return t; };
const objControls = { tokens: { tools: {} }, lighting: { tools: { light: {} } } }; console.log("controls as an object:", tool(objControls), "| the tool:", JSON.stringify((({ name, title, icon, toggle, active, order }) => ({ name, title, icon, toggle, active, order }))(objControls.lighting.tools.twod12LightLevel)), "| the others stay:", Object.keys(objControls.lighting.tools).join(", "));
const arrControls = [{ name: "tokens", tools: [] }, { name: "lighting", tools: [{ name: "light" }] }]; console.log("controls as a list:", tool(arrControls), "| tools:", arrControls[1].tools.map(t => t.name).join(", "), "| again (no duplicate):", tool(arrControls), arrControls[1].tools.length);
console.log("no lighting controls:", tool({ tokens: { tools: {} } }), tool([{ name: "tokens", tools: [] }]), tool({}), tool(null), tool(undefined), tool({ lighting: {} }));
// the slider
const updates = []; const scene = { update: async u => updates.push(JSON.stringify(u)) };
game.user.isGM = true;
for (const v of [0.5473, "0.72", 1.7, -2, 0, 1]) { updates.length = 0; const ok = await L.setSceneDarkness(v, scene); console.log(`set ${JSON.stringify(v)}:`.padEnd(16), ok, updates.join(" "));
}
for (const v of ["x", NaN, undefined, null]) { updates.length = 0; console.log(`set ${String(v)}:`.padEnd(16), await L.setSceneDarkness(v, scene), updates.length, "updates"); }
game.user.isGM = false; updates.length = 0; console.log("a player:", await L.setSceneDarkness(0.5, scene), updates.length, "updates"); game.user.isGM = true;
console.log("no scene:", await L.setSceneDarkness(0.5, null));
// the button switched on and off, and the panel
console.log("--- the panel");
globalThis.canvas.scene = scene; canvas.environment.darknessLevel = 0.5; canvas.ready = true; canvas.lighting.active = true; dom = [];
const added = {}; hooks.getSceneControlButtons = undefined; L.registerLightTool();
const ctl = { lighting: { tools: {} } }; hooks.getSceneControlButtons.forEach(f => f(ctl)); const toolDef = ctl.lighting.tools.twod12LightLevel;
console.log("the hook adds the button:", !!toolDef, "| it has an onChange:", typeof toolDef.onChange);
const popsBefore = made.filter(e => e.id === "twod12-lightpop").length;
toolDef.onChange(null, true); const pop = made.find(e => e.id === "twod12-lightpop");
console.log("switched on:", JSON.stringify({ made: made.filter(e => e.id === "twod12-lightpop").length - popsBefore, display: pop.style.display, left: pop.style.left, top: pop.style.top }), "| the text:", /lb-text">([^<]*)</.exec(pop.innerHTML)[1], "| the slider at", /class="lb-range"[^>]*value="([\d.]+)"/.exec(pop.innerHTML)[1]);
updates.length = 0; pop.listeners.input({ target: { classList: { contains: c => c === "lb-range" }, value: "0.72" } });
console.log("the slider is dragged to 0.72: marker", pop.parts[".lb-mark"].style.left, "| text:", pop.parts[".lb-text"].textContent, "| the scene is not updated yet:", updates.length);
pop.listeners.input({ target: { classList: { contains: c => c === "lb-range" }, value: "0.8" } }); pop.listeners.input({ target: { classList: { contains: c => c === "lb-range" }, value: "0.85" } });
await new Promise(r => setTimeout(r, 260)); console.log("after a moment, one update with the last value:", updates.join(" | "));
updates.length = 0; pop.listeners.input({ target: { classList: { contains: () => false }, value: "0.1" } }); await new Promise(r => setTimeout(r, 220)); console.log("something that isn't the slider is ignored:", updates.length, "updates");
canvas.environment.darknessLevel = 0.9; hooks.updateScene.forEach(f => f()); await new Promise(r => setTimeout(r, 50)); console.log("the Darkness changes elsewhere: the panel shows", /lb-text">([^<]*)</.exec(pop.innerHTML)[1]);
document.activeElement = { classList: { contains: c => c === "lb-range" } }; const heldBefore = pop.innerHTML; canvas.environment.darknessLevel = 0.1; hooks.updateScene.forEach(f => f()); await new Promise(r => setTimeout(r, 50)); console.log("while the slider is held it is not redrawn:", pop.innerHTML === heldBefore); document.activeElement = null;
canvas.lighting.active = false; hooks.renderSceneControls.forEach(f => f()); await new Promise(r => setTimeout(r, 50)); console.log("another layer is active: the panel hides:", pop.style.display); canvas.lighting.active = true;
toolDef.onChange(null, false); console.log("switched off:", pop.style.display);
toolDef.onChange(null, true); console.log("on again:", pop.style.display);
game.user.isGM = false; pop.innerHTML = ""; toolDef.onChange(null, true); console.log("a player sees the panel but the slider is disabled:", /disabled/.test(pop.innerHTML), "|", /lb-hint">([^<]*)</.exec(pop.innerHTML)[1]);
