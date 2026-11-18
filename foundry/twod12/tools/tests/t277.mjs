// Run with: node tools/tests/run.mjs (or node tools/tests/t277.mjs)
// v0.0.438 (pack CARD-ONE step 5; Lucas, 2026-11-18: "Start CARD-ONE step 5"): a card carries its own color tokens wherever it is drawn, and its
// root resets what a surface around it can set. tools/gallery/surfaces.mjs measures it (each card element's computed style in the sheet, the
// chat, a tooltip and the HUD, dark and light): 72 kinds of difference before, 27 after, all one inline button's two close blues.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url)), src = f => fs.readFileSync(ROOT + f, "utf8");
const css = src("styles/system.css"), theme = src("styles/theme.css");
console.log("the card's tokens on every card, not only one in the actor sheet:", css.includes(".twod12.acard, .application.twod12.twod12-actor .acard, .application.twod12.twod12-actor .twod12.chat, .twod12.acard .twod12,"));
console.log("their dark values reach every card (the theme, generated):", theme.includes(":where(:scope) .twod12.acard, :is(.twod12.acard):where(:scope)"));
console.log("the inline calc button's color on every card:", css.includes(".twod12.acard a.twod12-inline.calc .ti-name, .twod12.acard a.twod12-inline.calc,"));
console.log("the keyword color kept in the light sheet:", theme.includes(":where(.twod12-type) .application.twod12.twod12-actor .acard, :where(.twod12-type) .application.twod12.twod12-actor .acard .twod12 { --g-keywords: #5c5a55; }"));
console.log("the card's root reset:", /\.twod12\.acard \{ text-align: left; line-height: normal; letter-spacing: normal;/.test(css));
console.log("the surfaces tool:", fs.existsSync(ROOT + "tools/gallery/surfaces.mjs"));
