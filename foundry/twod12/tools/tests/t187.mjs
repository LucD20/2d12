// Run with: node tools/tests/run.mjs (or node tools/tests/t187.mjs)
// v0.0.248 (Lucas's test of v0.0.247): a bar's option with a token can be picked by clicking the token on the map (the candidates outlined); the Push
// list never offers yourself (Smite 3 AP: "the other creatures in the light, you excepted"); every chip is inline-flex, so its icon lines up in the
// chat card and the item card as in the Actions tab's preview.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
globalThis.foundry = { applications: { api: { DialogV2: {}, ApplicationV2: class {} }, ux: { TextEditor: { implementation: {} } } }, utils: { deepClone: o => JSON.parse(JSON.stringify(o)) } }; globalThis.Hooks = { on() {} }; globalThis.CONFIG = {}; globalThis.Combat = class {}; globalThis.game = { settings: { get: () => true } };
const src = f => fs.readFileSync(ROOT + f, "utf8");
const pb = src("module/pickbar.mjs"), mv = src("module/move.mjs"), inl = src("module/inline.mjs"), css = src("styles/system.css");
console.log("the bar picks a clicked token (the candidates outlined, the tokens not selectable meanwhile, everything put back):", pb.includes('canvas.stage.on("pointerdown", down)') && pb.includes("T.outlineCells(gfx, cells, { color: on ? 0xffffff : 0xc9a24a") && pb.includes("canvas.tokens.interactiveChildren = false") && pb.includes("canvas.tokens.interactiveChildren = prevInteractive") && pb.includes('canvas.stage.off("pointerdown", down)'));
console.log("the Push list and the Guard list give the bar their tokens:", mv.includes("token: t, img: t.document?.texture?.src"), inl.includes("token: tokenOfActor(a) }"));
console.log("the Push list leaves you out unless self:yes:", mv.includes("(self || t.id !== meId)") && mv.includes("pushCandidates(list, origin.id, me?.id, !!cfg.self)"));
console.log("every chip is inline-flex (icon and words aligned everywhere):", /a\.twod12-inline \{ display: inline-flex; align-items: center; gap: 0\.3em;/.test(css));
const G = await import(ROOTURL + "tools/cardgen.mjs");
// v0.0.409 (pack F2): the old Smite 3 AP left with pack R's Paladin; Word of Radiance's Pushes are picked one by one from the Area (you never in its list)
const wor = G.loadCards().find(c => c.name === "Word of Radiance");
console.log("Word of Radiance: the Pushes one by one from the Area:", G.cardSystem(wor).versions[0].after.includes("pick:yes|from:area"), "| the book's tiers:", wor.versions[0].tiers.join(" / "));
