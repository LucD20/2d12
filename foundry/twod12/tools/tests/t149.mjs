// Run with: node tools/tests/run.mjs (or node tools/tests/t149.mjs)
// v0.0.185 (pack C2): the section logic of the class window (module/classlevels.mjs), on the compendium's Paladin and Archer:
// Pick 1 replaces, Pick N drops the oldest, an item leaves the other sections once taken, the Repertoire filter and its exclusions,
// "Complete" when nothing is left, Distinct Choices, confirm only when complete, each level shows only its own sections, Font of Mercy.
import { fileURLToPath as rootPath } from "node:url"; const ROOTURL = new URL("../../", import.meta.url).href;
globalThis.foundry ??= { utils: {} };
const L = await import(ROOTURL + "module/classlevels.mjs");
const C = await import(ROOTURL + "tools/content.mjs");
const PACK = { feature: "features", talent: "features", action: "actions" };
const byUuid = new Map(C.docs.filter(d => PACK[d.type]).map(d => [C.uuidOf(PACK[d.type], d.name), d]));
const info = u => { const d = byUuid.get(u); return d ? { uuid: u, name: d.name, type: d.type, frequency: d.system.frequency ?? "", escalation: d.system.escalation ?? 0, category: d.system.category ?? "" } : null; };
const U = n => [...byUuid].find(([, d]) => d.name === n && PACK[d.type])?.[0];
const N = u => info(u)?.name ?? u;
const pal = C.docs.find(d => d.type === "class" && d.name === "Paladin").system, arc = C.docs.find(d => d.type === "class" && d.name === "Archer").system;
const talents = C.docs.filter(d => d.type === "talent" || (d.type === "action" && /^talent/i.test(d.system.category ?? ""))).map(d => C.uuidOf(PACK[d.type], d.name));
const show = (m, label) => console.log(`${label}: ${m.made} of ${m.total} made, complete ${m.complete} |`, m.sections.map(x => `${x.s.title} [${x.pill}]${x.kind === "choice" ? ` ${x.list.map(N).join("/") || "-"}` : ""}`).join(" | "));

console.log("--- choices to make (a new character)");
console.log("Paladin:", [1, 2, 3].map(l => `level ${l} ${L.choicesToMake(pal, l, info)}`).join(", "), "| Archer:", [1, 2, 3].map(l => `level ${l} ${L.choicesToMake(arc, l, info)}`).join(", "));
console.log("Attribute increases (Details tab):", L.attrLine(pal), "|", L.attrLine(arc));

console.log("--- the Paladin's level 1");
let picks = {}, attrs = {};
const m0 = L.levelModel(pal, 1, { info, talents });
show(m0, "nothing chosen");
const pass = m0.sections.find(x => x.s.id === "pal1pass1");   // pack R-classes (v0.0.235): one Passive per Escalation level; Font of Mercy is an Escalation 1 pick, not a granted Feature
console.log("Font of Mercy is an Escalation 1 Passive pick:", pass.list.includes(U("Font of Mercy")), "| offers:", pass.list.map(N).join(", "), "| Apex:", m0.sections.find(x => x.s.id === "pal1apex").list.map(N).join(", "));
const hall = pal.levels[0].sections.find(s => s.id === "pal1hall");
picks = L.togglePick(picks, hall, U("Smite"));
picks = L.togglePick(picks, hall, U("Lay On Hands"));
console.log("Pick 1: choosing Lay On Hands after Smite replaces it:", picks.pal1hall.map(N).join(", "));
picks = L.togglePick(picks, hall, U("Lay On Hands"));
console.log("choosing it again puts it back:", JSON.stringify(picks.pal1hall));
const p3 = { ...hall, id: "x", pick: 2 };
let pp = {};
for (const n of ["Smite", "Lay On Hands", "Holy Wrath"]) pp = L.togglePick(pp, p3, U(n));
console.log("Pick 2: a third choice drops the oldest:", pp.x.map(N).join(", "));
attrs = L.setAttr(attrs, pal.levels[0].sections, "pal1attr", 0, "appeal");
console.log("Distinct Choices: Appeal for pair 1:", JSON.stringify(attrs.pal1attr));
attrs = L.setAttr(attrs, pal.levels[0].sections, "pal1attr", 0, "body");
attrs = L.setAttr(attrs, pal.levels[0].sections, "pal1attr", 1, "mind");
console.log("Body, then Mind:", JSON.stringify(attrs.pal1attr), "| list:", L.attrList(pal, 1, attrs).join(", "));
const dist = [{ id: "d", kind: "attr", pairs: [{ a: "body", b: "appeal" }, { a: "appeal", b: "instinct" }] }];
let da = L.setAttr({}, dist, "d", 0, "appeal");
da = L.setAttr(da, dist, "d", 1, "appeal");
console.log("the book's example (Body or Appeal, Appeal or Instinct): Appeal moves to the second pair and the first must be chosen again:", JSON.stringify(da.d));
console.log("an Attribute chosen at an earlier level can't be chosen:", JSON.stringify(L.setAttr({}, dist, "d", 0, "appeal", ["appeal"])));
for (const [id, n] of [["pal1hall", "Smite"], ["pal1react", "Shield of Faith"], ["pal1enc", "Holy Wrath"], ["pal1pass1", "Radiant Zeal"], ["pal1pass2", "Searing Blows"], ["pal1pass3", "Hallowed Stance"], ["pal1apex", "Final Verdict"]]) picks = L.togglePick(picks, pal.levels[0].sections.find(s => s.id === id), U(n));
show(L.levelModel(pal, 1, { info, talents, picks, attrs }), "all but the Talent");
picks = L.togglePick(picks, pal.levels[0].sections.find(s => s.id === "pal1tal"), U("Heavy Blows"));
const m1 = L.levelModel(pal, 1, { info, talents, picks, attrs });
console.log("with the Talent: complete", m1.complete, `(${m1.made} of ${m1.total})`);
console.log("what confirm gives:", L.levelPlan(pal, 1, m1).map(g => `${N(g.uuid)} (${g.title})`).join(", "));

console.log("--- the same item in two sections");
const two = { levels: [{ sections: [
  { id: "a", title: "First", kind: "items", mode: "choice", pick: 1, items: [U("Hallowed Stance"), U("Radiant Zeal")] },
  { id: "b", title: "Second", kind: "items", mode: "choice", pick: 1, items: [U("Hallowed Stance"), U("Radiant Zeal")] }] }] };
let tp = L.togglePick({}, two.levels[0].sections[0], U("Hallowed Stance"));
show(L.levelModel(two, 1, { info, picks: tp }), "Hallowed Stance chosen in First");
console.log("also in (Levels window):", L.alsoIn(two, 1, two.levels[0].sections[0], U("Radiant Zeal")).join(", "));
tp = L.togglePick(tp, two.levels[0].sections[1], U("Radiant Zeal"));
show(L.levelModel(two, 1, { info, picks: tp }), "Radiant Zeal chosen in Second");
show(L.levelModel(two, 1, { info, owned: [U("Hallowed Stance"), U("Radiant Zeal")] }), "both owned from before");

console.log("--- level up: only that level's sections; what the character owns leaves the choices");
const owned = [U("Divine Power"), U("Font of Mercy"), U("Smite"), U("Holy Wrath"), U("Hallowed Stance"), U("Divine Surge"), U("Heavy Blows")];
show(L.levelModel(pal, 2, { info, talents, owned }), "Paladin level 2");
const t2 = L.levelModel(pal, 2, { info, talents, owned }).sections[0];
console.log("the level 2 Talent doesn't offer Heavy Blows (owned):", !t2.list.includes(U("Heavy Blows")), `| ${t2.list.length} Talents offered`);
show(L.levelModel(pal, 3, { info, owned }), "Paladin level 3");
show(L.levelModel(arc, 2, { info, talents, owned: [U("Sharpshooter"), U("Marked Quarry"), U("Double Shot"), U("Aim"), U("Killer's Focus"), U("Pinning Shot")] }), "Archer level 2");
console.log("Repertoire filter: Any", L.candidates({ kind: "repertoire", freq: "any" }, pal, info).map(N).join(", "), "| Turn", L.candidates({ kind: "repertoire", freq: "turn" }, pal, info).map(N).join(", "), "| Passive", L.candidates({ kind: "repertoire", freq: "passive" }, pal, info).length);
const withPassive = { ...pal, repertoire: [...pal.repertoire, U("Radiant Zeal")] };
console.log("a Feature in the Repertoire is Passive:", L.candidates({ kind: "repertoire", freq: "passive" }, withPassive, info).map(N).join(", "), "| and in Any:", L.candidates({ kind: "repertoire", freq: "any" }, withPassive, info).includes(U("Radiant Zeal")));
const grantedRep = { levels: [{ sections: [{ id: "g", title: "Core", kind: "items", mode: "granted", items: [U("Holy Wrath")] }, { id: "r", title: "Encounter Pick", kind: "repertoire", pick: 1, freq: "encounter" }] }], repertoire: pal.repertoire };
show(L.levelModel(grantedRep, 1, { info }), "a Repertoire pick excludes what this level grants");
show(L.levelModel(grantedRep, 1, { info, owned: [U("Bulwark of Faith")] }), "and what the character owns");

console.log("--- the Levels window's lines");
for (const s of pal.levels[0].sections) console.log(`${s.title}:`, JSON.stringify(L.playerSees(pal, 1, s, info)));
console.log("an empty section:", JSON.stringify(L.playerSees(pal, 1, { kind: "items", mode: "choice", pick: 1, items: [] }, info)), "| too few:", JSON.stringify(L.playerSees(pal, 1, { kind: "items", mode: "choice", pick: 3, items: [U("Smite")] }, info)));
console.log("the Stage line:", [1, 4, 5, 8].map(l => `${l}: ${L.stageLine(l) || "-"}`).join(" | "));
