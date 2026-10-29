// Run with: node tools/tests/run.mjs (or node tools/tests/t147.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.180 (D0, option E): the chat card's trait chips are tight (no group labels, a line between groups, the group's name in the tooltip);
// the sheets, the pickers and the roll dialog keep the labeled groups of v0.0.179.
globalThis.CONFIG = {}; globalThis.Hooks = { on() {} }; globalThis.game = { settings: { get: () => true } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
const cf = await import(ROOTURL + "module/config.mjs"), cc = await import(ROOTURL + "module/chatchips.mjs");
const src = f => fs.readFileSync(ROOT + f, "utf8");
const row = traits => {   // the compact row in words: chips (group) and | for a line
  const h = cf.traitChevrons(new Set(traits), { compact: true });
  return h.replace(/<span class="tsep"[^>]*><\/span>/g, " | ").replace(/<span class="tchip tc tg-(\w+)" style="[^"]*" data-tooltip="([^"]*)">([^<]+)<\/span>/g, (m, g, tip, l) => `${l}(${g}: "${tip.split(" · ")[0]}")`).replace(/<\/?span[^>]*>/g, "").replace(/\)(?=\w)/g, ") ");
};
console.log("--- the chat card's tight chips");
console.log("Smite (4 groups):    ", row(["weapon", "strike", "divine", "melee"]));
console.log("Relocate (4 traits): ", row(["strike", "handle", "body", "instinct"]));
console.log("5 groups:            ", row(["nonlethal", "focus", "area", "ranged", "magic"]));
console.log("one group:           ", row(["body"]), "| no traits:", JSON.stringify(cf.traitChevrons(new Set(), { compact: true })));
const smite = cf.traitChevrons(new Set(["weapon", "strike", "divine"]), { compact: true });
console.log("no group labels:", !smite.includes('class="tgl"'), "| the tooltip is the group, then the rule:", smite.match(/data-tooltip="([^"]*)"/)[1]);
console.log("the sheets keep the labeled groups:", cf.traitChevrons(new Set(["weapon", "strike"])).includes('<span class="tgl">Roll</span>'), "| weapon properties stay neutral:", cf.traitChevrons(new Set(["melee"]), { properties: true }).includes("tchip prop"));
console.log("--- who uses which");
const act = src("module/actions.mjs"), inl = src("module/inline.mjs");
console.log("the Action chat card:", act.includes("const traitsHtml = t => traitChevrons(t, { compact: true });"), "| the Save card:", inl.includes("traitChevrons(cfg.traits, { compact: true })"),
  "| the item sheet card, the roll dialog's preview and the weapon card stay labeled:", !src("module/actioncard.mjs").includes("compact: true") && !src("module/preview.mjs").includes("compact: true"));
console.log("--- a line is never left at the start or end of a wrapped row");
const show = (label, list) => console.log(label.padEnd(44), JSON.stringify(cc.edgeSeparators(list)));
show("one row (chip chip | chip | chip)", [{ top: 0 }, { top: 0 }, { sep: true, top: 0 }, { top: 0 }, { sep: true, top: 0 }, { top: 0 }]);
show("the row breaks right after a line", [{ top: 0 }, { sep: true, top: 0 }, { top: 19 }, { sep: true, top: 19 }, { top: 19 }]);
show("the row breaks right before a line", [{ top: 0 }, { top: 0 }, { sep: true, top: 19 }, { top: 19 }]);
show("the row breaks inside a group", [{ top: 0 }, { sep: true, top: 0 }, { top: 0 }, { top: 19 }]);
const css = src("styles/system.css");
console.log("--- the CSS");
console.log("16px high, 10.5px text, 4px padding, 3px radius:", /\.tcompact \.tchip\.tc \{[^}]*height: 16px;[^}]*padding: 0 4px; border-radius: 3px;[^}]*font-size: 10\.5px;/.test(css),
  "| the 16% tint, no visible outline:", /\.tcompact \.tchip\.tc \{[^}]*background: color-mix\(in srgb, var\(--tg\) 16%, transparent\); border: 1px solid transparent;/.test(css),
  "| 2px between chips, 3px between rows:", css.includes(".twod12 .tcompact { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 3px 2px;"),
  "| a 1px x 10px line, 3px each side:", css.includes("width: 1px; height: 10px; margin: 0 1px;"), "| hidden at a row's edge:", css.includes(".twod12 .tcompact .tsep.edge { display: none; }"));
console.log("measured when a chat message is drawn:", src("module/twod12.mjs").includes('Hooks.on("renderChatMessageHTML", chatChips);'));
