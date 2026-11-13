// Run with: node tools/tests/run.mjs (or node tools/tests/t249.mjs)
// v0.0.372 (Lucas, 2026-11-13): the chat frame, B (foundry/mockups/chat-frame.html): the system's messages without Foundry's box, the speaker's
// image and name, the time and the trash in the card's top line (module/chatframe.mjs); and the [Strike] marks in the terracotta.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
const src = f => fs.readFileSync(ROOT + f, "utf8");
const CF = await import(ROOTURL + "module/chatframe.mjs");
const map = o => ({ get: k => o[k] });
const g = { scenes: map({ s1: { tokens: map({ t1: { texture: { src: "tokens/aveline.webp" } } }) } }), actors: map({ a1: { img: "portraits/aveline.png", prototypeToken: { texture: { src: "tokens/aveline-proto.webp" } } }, a2: { img: "portraits/orc.png" } }) };
console.log("--- the speaker's image");
console.log("its token on the scene:", CF.speakerImg({ speaker: { scene: "s1", token: "t1", actor: "a1" } }, g), "| no token: the actor's token", CF.speakerImg({ speaker: { actor: "a1" } }, g), "| its portrait", CF.speakerImg({ speaker: { actor: "a2" } }, g), "| a player's avatar", CF.speakerImg({ speaker: {}, author: { avatar: "u.png" } }, g), "| nothing:", JSON.stringify(CF.speakerImg({}, g)));
console.log("the top line:", CF.topLineHtml("Aveline <b>", "a.png"), "| no image:", CF.topLineHtml("GM", ""));
console.log("--- the wiring");
const tw = src("module/twod12.mjs"), css = src("styles/system.css"), cf = src("module/chatframe.mjs");
console.log("registered after the cards are drawn:", tw.indexOf('Hooks.on("renderChatMessageHTML", frameMessage);') > tw.indexOf('Hooks.on("renderChatMessageHTML", ccRender);'), "| the time and the trash moved, not copied:", cf.includes("if (meta) top.append(meta);"), "| one-liners stay bare:", cf.includes('if (el.classList.contains("twod12-bare")) return;'));
console.log("no Foundry box, its header hidden:", css.includes(".chat-message.tw-framed { padding: 0 !important; border: 0 !important; background: none !important;") && css.includes(".chat-message.tw-framed > .message-header { display: none; }"), "| the image 30 px:", css.includes(".twod12 .tw-who img { flex: none; width: 30px; height: 30px;"));
console.log("--- Strike's terracotta");
console.log("no old red left:", !/#d14b3f/i.test(css + src("templates/actor-sheet-pc.hbs")), "| light / dark:", css.includes(":root { --tw-strike: #c25a28; }"), src("styles/theme.css").includes(".twod12-dark { --tw-strike: #ec8a55; }"), "| the carousel's Strike pips:", css.includes("#twod12-carousel .tp-strikes i.on { background: var(--tw-strike); }"));
