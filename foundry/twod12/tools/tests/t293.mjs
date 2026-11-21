// Run with: node tools/tests/run.mjs (or node tools/tests/t293.mjs)
// v0.0.475 (pack TALENTS-PT, 2026-11-20): the four playtest Talents (book/cards/stage0/talents-pt.json; book/cards/talents-playtest.md) and the
// book's new rules in Foundry: Break Free rolls its Check against the Action DC, EoE, halving and splitting damage (Bear the Blow, Ricochet), a
// movement you must make (Ricochet's Setup), leaving your square (Take Aim), the Ice Pillar (a placed solid object), the Bound Ally (a mark).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const ROOTURL = new URL("../../", import.meta.url).href, ROOT = fileURLToPath(ROOTURL), src = f => fs.readFileSync(ROOT + f, "utf8");
const C = await import(ROOTURL + "tools/content.mjs");
const mv = await import(ROOTURL + "module/move.mjs"), SH = await import(ROOTURL + "module/share.mjs"), OB = await import(ROOTURL + "module/objects.mjs");
const BO = await import(ROOTURL + "module/bounce.mjs"), MK = await import(ROOTURL + "module/mark.mjs"), ST = await import(ROOTURL + "module/setup.mjs");
const { parseInline } = await import(ROOTURL + "module/inline.mjs"), { parseTierFull } = await import(ROOTURL + "module/gen.mjs"), { tierTokens } = await import(ROOTURL + "tools/cardgen.mjs");
const { cardModel, modelLabels } = await import(ROOTURL + "module/cardmodel.mjs"), R = await import(ROOTURL + "module/fxrules.mjs"), { MOMENTS } = await import(ROOTURL + "module/moment.mjs");
const doc = (t, n) => C.docs.find(d => d.type === t && d.name === n);

console.log("--- the cards in the compendium");
for (const [t, n] of [["talent", "Take Aim"], ["action", "Take Aim"], ["talent", "Cold Domain"], ["action", "Rime Strike"], ["talent", "Shared Burden"], ["action", "Oath of Burden"], ["action", "Bear the Blow"], ["talent", "Ricochet"], ["action", "Ricochet"], ["effect", "Take Aim"]]) {
  const d = doc(t, n);
  console.log(`  ${t.padEnd(6)} ${n.padEnd(15)} ${d ? `ok ${d.folder ?? "-"} | ${d.system.automation || "-"}` : "MISSING"}`);
}
console.log("the old Talents still set aside:", !C.docs.some(d => d.type === "talent" && !["Take Aim", "Cold Domain", "Shared Burden", "Ricochet"].includes(d.name)), "| the old Ricochet replaced:", C.deprecatedDocs.every(d => d.name !== "Ricochet" || d.type !== "talent"));
const giv = { Sylwen: "Take Aim", Aveline: "Cold Domain", Durgan: "Shared Burden", Kaela: "Ricochet" };
for (const p of C.pcs) {
  const who = p.name.split(" ")[0], tals = p.items.filter(i => i.type === "talent").map(i => i.name), acts = p.items.filter(i => i.flags?.twod12?.talentId).map(i => i.name);
  console.log(`  ${p.name.padEnd(48)} ${tals.join(", ") || "-"} | ${acts.join(", ") || "-"} | as planned: ${/level 1/.test(p.name) ? !tals.length : tals.join() === giv[who]}`);
}

console.log("--- Take Aim");
const ta = doc("effect", "Take Aim").system;
console.log("self, EoT:", ta.selfApplied, ta.duration.type, "| ends on leaving the square:", JSON.stringify(ta.expireOn), "| settings:", ta.settings.map(s => `${s.type}${s.boons ? ` ${s.boons}` : ""}${s.ignoreRule ? ` ${s.ignoreRule}` : ""} [${s.all}]`).join("; "));
console.log("its Ends read:", R.endsSentence(ta.ends ?? R.migrate(ta, "effect").ends));
console.log("the Requirement is the one Foundry checks (hooks.mjs needsStayed):", (await import(ROOTURL + "module/hooks.mjs")).needsStayed(doc("action", "Take Aim").system.requirements));
console.log("leaving the square ends it (hooks.mjs), not a still movement:", src("module/hooks.mjs").includes('if (actor.getFlag(F, "stillMove")) return;') && src("module/hooks.mjs").includes('.includes("__leave")'));

console.log("--- Rime Strike");
const rs = doc("action", "Rime Strike").system;
console.log("traits:", [...rs.traits].join(","), "| modes:", rs.versions.map(v => `${v.mode} ${v.modeDistance} T2 ${JSON.stringify(v.t2.map(i => [i.useW ? "W" : i.dice || "Mod", i.subtype]))}`).join(" | "));
console.log("the chain:", rs.versions[0].after);
console.log("[W] with a type: tokens", tierTokens("[V] 1[W] + [Mod] Co", false, 2), "| read back:", JSON.stringify(parseTierFull("1WBCo").insts.map(i => [i.useW, i.subtype])), "| plain [W] keeps none:", parseTierFull("1WB").insts[0].subtype === "");
const rm = cardModel({ name: "Rime Strike", system: { ...rs, traits: new Set(rs.traits) } });
console.log("the card's lines:", modelLabels(rm).join(" | "), "| rolls:", rm.versions.map(v => v.roll?.text).join(" / "));
const pil = C.actors.find(a => a.name === "Ice Pillar");
console.log("the Ice Pillar actor:", JSON.stringify(pil.flags.twod12.object), "| token neutral:", pil.tokenExtra.disposition === 0);
console.log("its chip:", JSON.stringify(parseInline("Place", "Compendium.twod12.npcs.Actor.x|adjacent:yes|one:yes|eoe:yes|defense:action")));
console.log("the squares around a token:", OB.ringCells([{ i: 5, j: 5 }]).length, "| around a Large one:", OB.ringCells([{ i: 5, j: 5 }, { i: 5, j: 6 }, { i: 6, j: 5 }, { i: 6, j: 6 }]).length, "| its walls:", JSON.stringify(OB.squareWalls(100, 200, 100)));
console.log("its Defense (the Action DC): Mod 3 ->", OB.actionDcOf(3), "| unknown ->", OB.actionDcOf(null), "| a hit of 5:", OB.hitOutcome(5, 5), "| of 4:", OB.hitOutcome(4, 5));
console.log("an object takes no damage, it breaks or holds (damage.mjs):", src("module/damage.mjs").includes('objectHit(actor, a.B.l + a.B.n + a.M.l + a.M.n)'), "| melts at the end of the encounter (mark.mjs):", src("module/mark.mjs").includes("endEncounterObjects(combat)"), "| its walls go with it:", src("module/objects.mjs").includes("solidOf === doc.id"));
console.log("its square blocks Line of Effect, its walls only movement; a line to it isn't blocked (cover.mjs):", src("module/cover.mjs").includes("if (inRect(a, r) || inRect(b, r)) continue;") && src("module/objects.mjs").includes("sight: W.NONE ?? 0"));

console.log("--- Shared Burden");
const ob = doc("action", "Oath of Burden").system, bb = doc("action", "Bear the Blow").system;
console.log("Oath of Burden marks:", ob.marksTarget, ob.markKind, "| words:", MK.markWords("bound"), "| ring gold:", MK.markColor("bound").toString(16), "judge red:", MK.markColor("judge").toString(16));
console.log("its own place:", MK.markOf({ getFlag: (s, k) => (k === "marks" ? { bound: { uuid: "T1" } } : k === "quarry" ? { uuid: "Q" } : null) }, "bound").uuid, "| Judge's:", MK.markOf({ getFlag: (s, k) => (k === "quarry" ? { uuid: "Q" } : null) }, "judge").uuid);
console.log("Bear the Blow:", bb.reaction, bb.reactionKind, bb.moment, bb.momentRange, bb.momentSplit, "| 0R:", bb.versions[0].ap, "| its chain:", bb.versions[0].after, "| the moment:", JSON.stringify(MOMENTS.boundDamage));
const comps = [{ pool: "B", sub: "Sl", total: 7 }, { pool: "B", sub: "Sl", total: 2 }, { pool: "M", sub: "H", total: 5 }, { pool: "B", sub: "", total: 1 }];
const sp = SH.splitComps(comps);
console.log("split by type (9 Sl, 5 Ho, 1):", JSON.stringify(sp.first.map(c => [c.pool, c.sub, c.total])), JSON.stringify(sp.rest.map(c => [c.pool, c.sub, c.total])), "| nothing made or lost:", sp.first.concat(sp.rest).reduce((x, c) => x + c.total, 0) === 15);
console.log("with Half first:", JSON.stringify(SH.splitComps(comps, 0.5).first.map(c => c.total)), "| buckets:", JSON.stringify(SH.splitBuckets({ B: { l: 5, n: 0 }, M: { l: 0, n: 3 } })), "| no Resistance or Immunity on yours:", JSON.stringify(SH.weakOnly({ resist: { Sl: 2 }, immune: ["Fi"], weak: { Co: 2 } })));
console.log("buckets keep Nonlethal:", JSON.stringify(SH.toBuckets([{ pool: "B", total: 4, nl: true }, { pool: "B", total: 4 }], { B: 8, M: 0 })));
console.log("the split is before the reduction and the Guard (damage.mjs):", src("module/damage.mjs").indexOf("applySplit(actor, a, r.split, opts)") < src("module/damage.mjs").indexOf("const red = Math.max(0, Math.floor(Number(actor.system.reduceNext)"), "| an Action's damage only:", src("module/moment.mjs").includes('...(from?.uuid && !shared ? ["boundDamage"] : [])'), "| the card's components reach it:", src("module/ccdamage.mjs").includes("report, comps, factor, nl: !!s.nl });"));

console.log("--- Ricochet");
const ri = doc("action", "Ricochet").system;
console.log("Setup:", ri.setup, "| chain:", ri.versions[0].after);
console.log("the Setup's options:", JSON.stringify((({ kind, must, still, distance }) => ({ kind, must, still, distance }))(parseInline("Move", "advance|distance:2|must:yes|still:yes"))), "| squares left:", ST.mustLeft({ cid: "c", key: "freeMove", total: 2 }, () => 1), ST.mustLeft(null));
console.log("the bounce chip:", JSON.stringify(parseInline("Bounce", "2|half")), "| half by type:", JSON.stringify(SH.halveComps([{ pool: "B", sub: "Pi", total: 9 }]).map(c => c.total)));
const tk = (id, x, extra = {}) => ({ id, x, name: id, actor: {}, document: { flags: {}, hidden: false, ...extra } });
const T0 = tk("T", 0), list = [T0, tk("A", 1), tk("B", 2), tk("C", 3), tk("K", 1), tk("P", 1, { flags: { twod12: { placed: {} } } }), tk("W", 2)];
console.log("who it can reach (2 squares, Line of Effect from the target, not the user or an object):", BO.bounceCandidates(T0, list, { range: 2, userId: "K", dist: (a, b) => Math.abs(a.x - b.x), loe: (a, b) => b.id !== "W" }).map(t => t.id).join(","));

console.log("--- the book's rules");
const hold = (dc, prior) => ({ effects: [{ statuses: new Set(["immobilized"]), getFlag: (s, k) => (k === "actionDc" ? dc : k === "immobileDc" ? prior : undefined) }], system: { attributes: { body: 2, instinct: 3 } } });
console.log("Break Free's Check:", JSON.stringify(mv.breakFreeCheck(hold(15))), "| a tie is Body:", mv.breakFreeCheck({ effects: [], system: { attributes: { body: 1, instinct: 1 } } }).attr, "| an old Immobilized (immobileDc):", mv.heldDc(hold(undefined, 14)), "| none stored:", mv.heldDc(hold(undefined)));
console.log("it rolls (actions.mjs):", src("module/actions.mjs").includes("const bf = breakFreeCheck(actor)") && src("module/actions.mjs").includes("if (Number(r?.total) >= bf.dc)"), "| Gold:", (await import(ROOTURL + "module/basic-data.mjs")).BASIC_ACTIONS.breakFree.automation, "| no Immobilized DC left in the code:", !/immobilizedDc|immobilizedOutcome/.test(["module/move.mjs", "module/actions.mjs", "module/effects.mjs"].map(src).join("")));
console.log("EoE:", R.endsSentence({ time: { on: true, mode: "encounter" } }), "|", src("module/zonetip.mjs").includes('"EoE"'), "| Kindle:", C.docs.find(d => d.name === "Kindle (Bright light 3)").system.description.includes("EoE"));
console.log("[Melee]'s text:", src("module/config.mjs").match(/melee: "(These[^"]*)"/)?.[1] ?? "not found");

console.log("--- v0.0.476 (Lucas's checklist on v0.0.475)");
const { pickBarHtml } = await import(ROOTURL + "module/pickbar.mjs");
const pbh = pickBarHtml({ text: "Ice Pillar", options: [{ id: "1,1", label: "Here", cells: [{ i: 1, j: 1 }], mapOnly: true }, { id: "2,2", label: "Here", cells: [{ i: 2, j: 2 }], mapOnly: true }], cancel: "Cancel" });
console.log("the squares are clicked on the map, no button each:", !pbh.includes(">Here<"), "| one Cancel:", (pbh.match(/lb-give/g) ?? []).length, "| Enter never picks a square:", src("module/pickbar.mjs").includes("o.options?.find?.(x => !x.mapOnly)?.id"));
console.log("Break Free in the Situational tab when Immobilized or Grabbed:", src("module/hud.mjs").includes('} else if (statuses.has?.("immobilized") || statuses.has?.("grabbed")) {') && src("module/hud.mjs").includes('list.find(x => x.bkey === "breakFree")'));
console.log("the Ends' EoE:", JSON.stringify(R.endsSummaries({ time: { on: true, mode: "encounter" } }).time), "| the Ends buttons:", src("module/fxsheet.mjs").includes('["encounter", "EoE"]'));
