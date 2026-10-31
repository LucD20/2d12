// Run with: node tools/tests/run.mjs (or node tools/tests/t121.mjs)
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href, ROOT = rootPath(ROOTURL);
import fs from "node:fs";
// v0.0.139: the Items tab's loadout: where weapons and armor are (Dropped / Worn / One hand / Both hands; Dropped / Carried / Worn), the slots, the moves.
const L = await import(ROOTURL + "module/loadout.mjs");
const T = (...t) => new Set(t);
const w = (id, name, sys, traits = []) => ({ id, name, system: { wielded: false, hands: 1, dropped: false, traits: T(...traits), damage: { t1: { count: 0, die: "", mod: 0 }, t2: { count: 1, die: "d8", mod: 0 }, t3: { count: 2, die: "d6", mod: 0 } }, ...sys } });
const gs = w("gs", "Greatsword", { wielded: true, hands: 2 }, ["melee", "twohanded"]), dg = w("dg", "Dagger", {}, ["melee", "thrown"]), xb = w("xb", "Crossbow", { dropped: true }, ["ranged", "reload", "twohanded"]), fi = w("fi", "Fists", {}, ["barehanded"]);
for (const x of [gs, dg, xb, fi]) console.log(x.name.padEnd(11), "where:", L.weaponWhere(x), "| button:", JSON.stringify(L.weaponAction(x)), "| tiers:", L.tierBoxes(x).map(b => `${b.l} ${b.v}`).join(" "));
console.log("slots, greatsword in both hands:", JSON.stringify(L.handSlots([gs, dg, xb, fi])));
gs.system.wielded = false; dg.system.wielded = true;
console.log("slots, dagger in one hand:", JSON.stringify(L.handSlots([gs, dg, xb, fi])), "| other hands than the greatsword:", L.otherHands([gs, dg, xb, fi], "gs"));
console.log("moves:", Object.keys(L.WEAPON_WHERE).map(k => `${k} ${JSON.stringify(L.weaponMove(k))}`).join(" | "));
const ar = (id, sys) => ({ id, system: { worn: false, dropped: false, ...sys } });
for (const [label, a] of [["worn", ar("a", { worn: true })], ["carried", ar("b")], ["dropped", ar("c", { dropped: true })]]) console.log(`armor ${label}:`, L.armorWhere(a), "| button:", JSON.stringify(L.armorAction(a)), "| move there:", JSON.stringify(L.armorMove(label)));
const src = n => fs.readFileSync(ROOT + n, "utf8");
const data = src("module/data.mjs"), armor = src("module/armor.mjs"), hands = src("module/hands.mjs"), inline = src("module/inline.mjs"), tpl = src("templates/actor-sheet.hbs"), sh = src("module/actor-sheets.mjs"), css = src("styles/system.css");
console.log("data: dropped on weapons and armor", (data.match(/dropped: bool\(\)/g) || []).length === 2, "| taking it in hand or putting it on picks it up", armor.includes('foundry.utils.setProperty(changes, "system.dropped", false)'), "| Release drops it on the ground", hands.includes('"system.wielded": false, "system.dropped": true') && inline.includes('"system.wielded": false, "system.dropped": true'));
console.log("hands checked when drawing", sh.includes("if (need && !(await ensureHandsFor(this.actor, item, need))) return this.render();"), "| free hand slot takes a dropped-in weapon", tpl.includes('<div class="lo-slot free" data-slot="hand" data-hand="{{hand}}">') && sh.includes('this._moveItem(w, "1h", slot.dataset.hand ?? "")'), "| folds per user", sh.includes('game.user.getFlag("twod12", "itemFold")'));
console.log("the look: no Technique on the slots", !/lo-slot[\s\S]{0,600}Technique/.test(tpl), "| Dropped: red button and outline, no strikethrough", css.includes(".lr-seg button.on.drop") && css.includes(".twod12.sheet.ns .lrow.dropped {") && !/lrow\.dropped[^}]*line-through/.test(css), "| untrained armor: red outline and warning", css.includes(".twod12.sheet.ns .lo-slot.untrained { border-color: #d0544b; }") && tpl.includes("Untrained</span>"), "| see-through title bar (v0.0.142)", css.includes("> .window-header { background: var(--twod12-hdr)"));
