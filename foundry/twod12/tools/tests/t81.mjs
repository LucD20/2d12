// Run with: node tools/tests/run.mjs (or node tools/tests/t81.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
// JRPG numbers: the motion (jump, fall, bounce, fade; healing floats up), the glyphs and layout, the choice of style, and
// switching Foundry's own "+(Name)" text off while ours is on.
const hooks = {}, settings = { floatText: true, floatStyle: "jrpg" };
globalThis.Hooks = { on: (h, f) => (hooks[h] = f), once() {} };
globalThis.CONST = { TEXT_ANCHOR_POINTS: { TOP: 2, BOTTOM: 0 } };
let coreCalls = 0;
class FakeEffect { _displayScrollingStatus(enabled) { coreCalls++; } }
globalThis.CONFIG = { ActiveEffect: { documentClass: FakeEffect } };
globalThis.foundry = { utils: { deepClone: o => JSON.parse(JSON.stringify(o)), hasProperty: () => false } };
globalThis.game = { settings: { get: (s, k) => settings[k], register() {} }, user: { isGM: false } };
const log = [];
globalThis.canvas = { interface: { createScrollingText: (o, text, opts) => log.push(`plain ${text} ${opts.direction === 0 ? "down" : "up"}`) }, app: { ticker: {} }, grid: { size: 100 } };
globalThis.PIXI = {};
const F = await import(ROOT + "module/floattext.mjs");
F.timing.stagger = 0; F.timing.jrpgStagger = 0;
// how a number is thrown: up, a change of direction at the top, falling to a side, fading before the ground
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const P = F.throwParams(100, 40, 0, 1, rnd);
const fr = t => F.throwFrame(t, P);
const tUpMs = P.tUp * 1000, endMs = fr(0).tEnd * 1000, landMs = fr(0).tLand * 1000;
console.log(`a throw: starts ${P.dirUp > 0 ? "right" : "left"}, falls to the ${P.dirDown > 0 ? "right" : "left"}; apex ${Math.round(P.apex)} px, ground ${Math.round(P.ground)} px below the start, top at ${Math.round(tUpMs)} ms, gone at ${Math.round(endMs)} ms, would land at ${Math.round(landMs)} ms`);
console.log([0, tUpMs / 2, tUpMs, tUpMs + 120, (tUpMs + endMs) / 2, endMs].map(t => { const x = fr(t); return `${Math.round(t)}ms: dx ${Math.round(x.dx)} dy ${Math.round(x.dy)} alpha ${x.alpha.toFixed(2)}`; }).join("\n"));
const pts = Array.from({ length: 300 }, (_, i) => fr(i * 8));
console.log("goes up to about the apex:", Math.abs(Math.min(...pts.map(p => p.dy)) + P.apex) < P.apex * 0.1, "| fully faded before it lands:", fr(endMs).alpha === 0 && endMs < landMs && fr(endMs).dy < P.ground, "| still solid at the top:", fr(tUpMs * 0.8).alpha === 1);
const vUp = fr(tUpMs - 20).dx - fr(tUpMs - 40).dx, vDown = fr(tUpMs + 60).dx - fr(tUpMs + 40).dx;
console.log("direction of travel changes at the top:", Math.sign(vUp) !== Math.sign(vDown) || P.dirUp === P.dirDown, "(up: " + Math.sign(vUp) + ", down: " + Math.sign(vDown) + ")", "| the fall is faster sideways than the rise:", Math.abs(vDown) > Math.abs(vUp));
const rise = Array.from({ length: 30 }, (_, n) => fr(n * (tUpMs / 30))), fall = Array.from({ length: 40 }, (_, n) => fr(tUpMs + n * ((endMs - tUpMs) / 40)));
const steps = (arr, dir) => arr.slice(1).every((p, n) => (p.dx - arr[n].dx) * dir >= -1e-9);
console.log("on the way up it only drifts toward its first side:", steps(rise, P.dirUp), "| on the way down it only moves toward its second side:", steps(fall, P.dirDown), "| it never rises again after the top:", fall.slice(1).every((p, n) => p.dy >= fall[n].dy));
let changed = 0, same = 0; for (let i = 0; i < 400; i++) { const q = F.throwParams(100, 40, 0, 1, Math.random); q.dirUp !== q.dirDown ? changed++ : same++; } console.log("most throws change direction, some keep going:", changed > same && same > 40);
console.log("before it starts it is hidden:", JSON.stringify({ alpha: fr(-5).alpha, scale: fr(-5).scale }), "| pops in big and settles:", fr(0).scale.toFixed(2), "→", fr(300).scale.toFixed(2));
const sides = Array.from({ length: 6 }, (_, k) => F.throwParams(100, 40, k, 6, () => 0.9).dirUp); console.log("a burst of 6 starts toward alternate sides:", sides.join(" "));
// a hit as a burst that adds up
seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (const n of [3, 6, 7, 12, 20, 35, 100, 1000]) { const p = F.splitDamage(n, rand); console.log(`${n} damage → ${p.length} number${p.length > 1 ? "s" : ""}: ${p.join(" + ")} | adds up: ${p.reduce((a, b) => a + b, 0) === n} | none below 1: ${p.every(x => x >= 1)}`); }
let ok = true; for (let n = 0; n <= 300; n++) { const p = F.splitDamage(n); if (p.reduce((a, b) => a + b, 0) !== n || (n > 0 && p.some(x => x < 1))) ok = false; } console.log("every total from 0 to 300 adds up exactly:", ok);
// glyphs and layout
console.log("glyphs of '\u221212':", F.glyphs("\u221212").map(g => g.ch).join(""), "| '+6':", F.glyphs("+6").map(g => g.ch).join(""), "| '5 NL':", F.glyphs("5 NL").map(g => g.ch + (g.small ? "(small)" : "")).join(" "));
console.log("size grows with the number:", [1, 4, 9, 25, 60, 5000].map(n => `${n}:${F.sizeFor(n)}`).join(" "));
const lay = F.layout(F.glyphs("125"), 40); console.log("3 digits centered:", lay.map(x => x.toFixed(1)).join(" "), "| symmetric:", Math.abs(lay[0] + lay[2]) < 1e-9);
// which style is used
const mkActor = id => ({ getActiveTokens: () => [{ id, center: { x: 1, y: 2 }, visible: true, document: {} }] });
const wait = ms => new Promise(r => setTimeout(r, ms));
F.timing.jrpgStagger = 5; F.timing.stagger = 5;
F.renderers.jrpg = (tok, t, k, n) => log.push(`jrpg ${t.text} ${k + 1}/${n}`);
F.renderers.plain = (tok, t) => log.push(`plain ${t.text} (${t.kind}${t.down ? ", down" : ""})`);
F.floatOver(mkActor("a"), [{ text: "\u221220", color: "#f00", kind: "damage" }]); await wait(80);
const burst = log.splice(0); console.log("20 damage in JRPG style:", burst.length, "numbers, all jrpg:", burst.every(x => x.startsWith("jrpg")), "| they add up:", burst.map(x => parseInt(x.split(" ")[1])).reduce((a, b) => a + b, 0) === 20);
F.floatOver(mkActor("b"), [{ text: "\u22123 NL", color: "#00f", kind: "damage" }]); await wait(40); console.log("a small hit stays one number:", log.splice(0).join(" | "));
F.floatOver(mkActor("c"), [{ text: "+6", color: "#0f0", kind: "heal" }, { text: "\u2212 Exhausted", color: "#fff", kind: "fx", down: true }, { text: "+ Exhausted 2", color: "#fff", kind: "fx" }]); await wait(80);
console.log("healing and effects use Foundry's text:", log.splice(0).join(" | "));
settings.floatStyle = "plain"; F.floatOver(mkActor("d"), [{ text: "\u221220", color: "#f00", kind: "damage" }]); await wait(40); console.log("Non-JRPG:", log.splice(0).join(" | "));
settings.floatStyle = "jrpg"; globalThis.PIXI = undefined; F.floatOver(mkActor("e"), [{ text: "\u221220", color: "#f00", kind: "damage" }]); await wait(40); console.log("JRPG without a drawing engine falls back:", log.splice(0).join(" | "));
globalThis.PIXI = {};
const warn = console.warn; console.warn = () => {};
F.renderers.jrpg = () => { throw new Error("boom"); }; F.floatOver(mkActor("f"), [{ text: "\u22125", color: "#f00", kind: "damage" }]); await wait(40); console.warn = warn; console.log("if the animation fails, the plain text is shown:", log.splice(0).join(" | "));
// the same text over the same token within a moment is shown once
F.renderers.plain = (tok, t) => log.push(`plain ${t.text}`);
const g = mkActor("g"); F.floatOver(g, [{ text: "\u2212 Exhausted", color: "#fff", kind: "fx", down: true }]); F.floatOver(g, [{ text: "\u2212 Exhausted", color: "#fff", kind: "fx", down: true }]); F.floatOver(g, [{ text: "\u2212 Exhausted", color: "#fff", kind: "fx", down: true }]); await wait(40);
console.log("three identical texts at once on one token:", log.splice(0).length, "shown | on another token:", (F.floatOver(mkActor("h"), [{ text: "\u2212 Exhausted", color: "#fff", kind: "fx", down: true }]), await wait(40), log.splice(0).length));
// Foundry's own text
console.log("silenced:", F.silenceCoreText().join(",") || "(already)", "| twice is safe:", F.silenceCoreText().length === 0);
F.registerFloatText();
const e = new FakeEffect(); e._displayScrollingStatus(true); console.log("with ours on, Foundry's text is skipped:", coreCalls === 0);
settings.floatText = false; e._displayScrollingStatus(true); console.log("with ours off, Foundry's text is back:", coreCalls === 1);
