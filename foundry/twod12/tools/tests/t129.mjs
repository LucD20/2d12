// Run with: node tools/tests/run.mjs (or node tools/tests/t129.mjs)
// v0.0.153 (the Paladin against the book): reworded Versions, Hallowed Stance's Power Modifier, and every card's Vs. entry as the book writes it.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
globalThis.foundry ??= { utils: {} };
const G = await import(ROOTURL + "module/config.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const get = n => C.allDocs.find(d => d.name === n);
const tiers = (n, ap) => { const v = get(n).system.versions.find(x => x.ap === ap); return [1, 2, 3].map(k => (v["x" + k] ?? "").replace(/<[^>]+>/g, "")).join(" / "); };
console.log("Vow of Enmity 2 AP:", tiers("Vow of Enmity", 2), "|| 3 AP:", tiers("Vow of Enmity", 3));
console.log("Champion's Challenge 2 AP:", tiers("Champion's Challenge", 2));
console.log("Hallowed Stance:", get("Hallowed Stance").system.description.replace(/<[^>]+>/g, ""));   // v0.0.409 (pack F2): the redesigned card
const vs = n => { const d = get(n); return G.vsText({ ...d.system, traits: new Set(d.system.traits) }) || "(none)"; };
// v0.0.409 (pack F2): the redesigned Rebuke and Word of Radiance are Appeal Saves; Binding Light AD
const book = { "Smite": "AD", "Vow of Enmity": "WD", "Rebuke": "Appeal Save", "Binding Light": "AD", "Champion's Challenge": "WD", "Word of Radiance": "Appeal Save", "Divine Retribution": "AD (Weapon mode) or WD (Power mode)", "Judgment": "WD", "Whirlwind": "AD", "Cut Through": "AD", "Pummel": "AD", "Leg Sweep": "AD" };
const bad = Object.entries(book).filter(([n, v]) => vs(n) !== v).map(([n, v]) => `${n}: ${vs(n)} (book ${v})`);
console.log("Vs. entries as in the book:", bad.length ? bad.join(" | ") : "all " + Object.keys(book).length + " match");
console.log("no-roll cards have no Vs.:", ["Lay On Hands", "Shield of Faith", "Sacred Weapon", "Bulwark of Faith", "Judge", "Consecrated Ground", "Hold the Line", "Precise Aim"].every(n => vs(n) === "(none)"));
// "As 1 AP" written out on chat cards and in the roll dialog (they show one Version)
const x = (n, ap, t) => { const it = get(n).system; const v = it.versions.find(y => y.ap === ap); return G.expandAsText(v["x" + t], it.versions, v, t).replace(/<[^>]+>/g, ""); };
console.log("Vow of Enmity 2 AP T2:", x("Vow of Enmity", 2, 2));
console.log("Vow of Enmity 3 AP T3:", x("Vow of Enmity", 3, 3));
console.log("Vow of Enmity 1 AP T3:", x("Vow of Enmity", 1, 3));
console.log("Champion's Challenge 2 AP T3:", x("Champion's Challenge", 2, 3));
console.log("kept as is: 'No effect.'", x("Vow of Enmity", 2, 1), "| text with no 'As':", x("Judgment", 1, 2) || "(empty)");
const vv = [{ ap: 1, x2: "As 2 AP." }, { ap: 2, x2: "As 1 AP." }];
console.log("a loop stops:", G.expandAsText("As 2 AP.", vv, vv[0], 2));
