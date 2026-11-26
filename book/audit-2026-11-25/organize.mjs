// The cleanup audit: Lucas's answers (answers.json, read back from the answer page's database on 2026-11-26) joined with the findings,
// sorted into what is applied, what stays, and what waits for him. Run: node book/audit-2026-11-25/organize.mjs  -> work-order.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const F = JSON.parse(fs.readFileSync(path.join(HERE, "findings.json"), "utf8")), A = JSON.parse(fs.readFileSync(path.join(HERE, "answers.json"), "utf8"));

// Claude's reading of the answers that carry a note or no pick. do: apply | nothing | hold. ask: a question for Lucas (topic: bestiary | rules | later).
const READ = {
  "B1-003": { do: "hold", topic: "rules", ask: "Lucas's idea: give every Basic attack card its own Critical row (then each can be tuned) and drop Chapter 1's general Basic attack rule. B3-004 and B3-052 wait on the same answer." },
  "B3-004": { do: "hold", topic: "rules", ask: "With B1-003 (a Critical row on each Basic attack card)." },
  "B3-052": { do: "hold", topic: "bestiary", ask: "With B1-003: if every Basic attack card writes its own Critical row, a Minor enemy's card says whether its Critical die explodes." },
  "B1-084": { do: "nothing", why: "Kept; Lucas: taking a Breather will be changed." },
  "B2-004": { do: "nothing", why: "Kept. His question (is \"Class Actions\" used anywhere?) is answered in the report: Chapter 5's heading, paragraph and level-list sentence, and four Glossary rows.", ask: "\"Class Actions\" is used in Chapter 5 (the heading, its paragraph, the level list's sentence) and in the Glossary. Drop the defined term and say \"the Actions your class gives you at level 1\"?", topic: "rules" },
  "B2-008": { do: "apply", ask: "Is every class's Apex at level 4, or can some classes get theirs earlier?", topic: "later" },
  "B2-060": { do: "apply", why: "Lucas: keep an eye on Empowered building up, since it is reliable damage (noted in the rules log)." },
  "B2-066": { do: "apply", extra: "Apply the rewording, but leave the paragraph's rule about gaining Lingering again exactly as the book has it now (Lucas asks whether it should be per subtype: a question, not decided).", ask: "Lingering gained twice: keep only the higher, or can Lingerings of different subtypes run together (burning and bleeding)? If they can, does one end another (Cold on Fire)?", topic: "rules" },
  "B2-071": { do: "apply", why: "His question (a weapon with two types later?) is answered in the report: its table row writes both, as a card does (\"[V] ... Sl + [R] ... Fi\")." },
  "B2-080": { do: "apply", ask: "Give Fists a Weapon Technique and a Mastery progression like any weapon?", topic: "later" },
  "B2-009": { do: "apply", extra: "Lucas: remove \"up to\" here too, since Chapter 3 already says a movement's distance is a maximum. Write the card: \"You Advance your Speed. Once during it you can use Interact (see [[Advance]]).\" Do NOT change other cards; list in your report every other card line in your files that writes \"up to\" before a movement's distance.", ask: "\"Up to\" before a movement's distance is on other cards too (listed in the report): remove it everywhere, as on Advance and Pass Through?", topic: "rules" },
  "B2-016": { do: "apply", extra: "Lucas: add an example under the new sentence (a `> [!example]` box, a name from the README's list that the chapter hasn't used yet): a Prone creature Crawling 1 square into rubble, and a Speed 1 creature Advancing into Difficult Terrain." },
  "B2-034": { do: "apply", extra: "Lucas: dropping also covers an object held with both hands. Write: \"You drop an object you hold, in your square, or take one hand off an object you hold with both hands (a Two-handed weapon is then held in one hand).\"" },
  "B2-010": { do: "apply", why: "His question (does \"Attribute Action\" exist?) is answered in the report: Chapter 1's table of rolls and two Glossary rows define it." },
  "B2-031": { do: "apply", why: "Lucas's ruling, noted in the rules log: Point Out needs no Line of Effect, and its roll takes Doomed and Banes from Senses as usual (the card adds no line: the general rule already says so)." },
  "B3-030": { do: "apply", why: "His question (wasn't this changed?) is answered in the report: the card's last change was v0.0.419 (its split in two, the Doomed rule on the bow's hit); the audit's wording is on that text." },
  "B3-024": { do: "apply", why: "His question is answered in the report: the book's form is \"Slide the target 1\" (Seizing Cut writes it so), so the line keeps it." },
  "B3-036": { do: "apply" }, "B3-041": { do: "apply" }, "B3-043": { do: "apply" }, "B3-055": { do: "apply" }, "B3-056": { do: "apply" },
  "B3-069": { do: "apply", extra: "The open box reads: \"Disarming and breaking weapons are not written yet.\" and the section's rules stay under it as they are." },
  "B3-070": { do: "hold", topic: "bestiary", ask: "\"Special Action\" is also the name of a card line (Special:). Lucas: \"likely can just say 'its other Actions, more thematic and complex than the NPC's basic attacks'\". The rank table and the stat blocks use the word (\"Special; Round, 2 AP\"): drop the defined term and call them its other Actions, or rename it (Signature is taken; \"Feature Action\", \"Maneuver\")?" },
  "B3-074": { do: "hold", topic: "bestiary", ask: "Hurled Goblin. Lucas: \"Isn't it easier to just say 'the ogre places it... This is a forced movement effect, causing no collision.'\" As Forced Movement it would be reduced by the goblin's Steadiness, need a path with Line of Effect at every square, and count for \"left your square\"; as a plain placement none of that applies. Which?" },
  "B3-033": { do: "hold", topic: "bestiary", ask: "An NPC's items: \"flavor\" against \"its [Weapon] Actions need its weapon in hand\". Lucas: neither answer is good (the first stops disarm builds, the second is finicky); to work on. B3-065 and B3-069 wait on it." },
  "B3-065": { do: "hold", topic: "bestiary", ask: "With B3-033 (which weapon an NPC's [Weapon] Actions need: the Ogre's grab and thrown goblin without its club)." },
  "B3-035": { do: "hold", topic: "bestiary", ask: "The bands leave holes (1¾ to 2 is in none, 1¼ is in two, under ¾ in none): close the table (Easy up to 1¼; Normal above 1¼ up to 2; Hard above 2 up to 3; Deadly above 3)?" },
  "B3-037": { do: "hold", topic: "bestiary", ask: "\"Momentum doesn't change the budget\" beside \"late in a good expedition a party can take a band more\": keep only the first?" },
  "B3-038": { do: "hold", topic: "bestiary", ask: "The paragraph \"No number in this chapter assumes a class\": cut it to one sentence for the GM (with their class cards, the PCs find a fight cheaper or shorter than its band)?" },
  "B3-039": { do: "hold", topic: "bestiary", ask: "\"A Minion's CV assumes it is mixed with other enemies, about three a PC\": reword so it can't be read as three Minions for each PC?" },
  "B3-040": { do: "hold", topic: "bestiary", ask: "\"what makes an Elite stronger is never the PCs' cards working less often\": remove the clause (a reason, not a rule)?" },
  "B3-053": { do: "hold", topic: "bestiary", ask: "\"A Standard is one PC\" beside \"not an even match\": say \"A Standard is the unit: CV 100, one for each PC in a normal fight\"?" },
  "B2-050": { do: "hold", topic: "later", ask: "REMINDER (Lucas: \"Remind me about this one later\"): the Self trait is on nine Basic Actions that affect only you, but not on Break Free or Tumble, and no rule depends on it." },
  "B3-011": { do: "hold", topic: "later", ask: "Lucas's idea: a Reload Shot raises the weapon's [D] instead of adding 1d6! like Empowered. (The Glossary calls the shot Empowered; Chapter 15 says it only borrows the die.)" },
  "B3-015": { do: "hold", topic: "later", ask: "FOR REVIEW LATER (Lucas: \"a big question\"): a thrown weapon. Chapter 15 says it leaves your hand; the Glossary and the 2026-11-19 decision say it stays in your hand for the rules." },
  "B2-029": { do: "apply", extra: "Lucas: \"it should lose the Chapter 3 section and be just the action.\" The Lean card holds the whole rule (with B2-028's wording: \"you count Line of Effect and Cover from one of your corners instead of the center of your square\"); Chapter 3's Leaning section is removed; every [[Leaning]] link points to the Lean card; the Glossary's row keeps one line and its link goes to the card. Whatever rule the section has that the card lacks moves onto the card." },
  "F-007": { do: "nothing", why: "Lucas: Mithril and Diamond will be used again: the ranks and their CSS stay (CLAUDE.md's \"retired\" line corrected)." },
  "F-005": { do: "nothing", why: "Kept until the Escalation abilities are redesigned." }, "F-006": { do: "nothing", why: "Kept until the Escalation abilities are redesigned." },
  "F-011": { do: "nothing", why: "Kept as test and ruler fixtures." }, "F-014": { do: "nothing", why: "Kept (fixtures and history)." },
  "F-025": { do: "apply", why: "Lucas confirmed the manifest updates work: the four files go." },
  "F-033": { do: "hold", topic: "later", ask: "Which is the oldest world you still play (its system version)? The one-time migrations older than it can go." },
};
const out = [];
for (const f of F) {
  const a = A[f.id] ?? {}, chosen = a.choice == null ? null : f.options[a.choice], r = READ[f.id];
  let todo = r?.do ?? (chosen == null ? "hold" : /^(keep (it|everything|them) (all )?(as it is|as they are|in place)|keep it as it is|leave them where they are)/i.test(chosen) ? "nothing" : "apply");
  if (!r && /^keep/i.test(chosen ?? "") && !/[,;:]| and |move|cut|remove|reword/i.test(chosen.slice(4))) todo = "nothing";
  out.push({ id: f.id, section: f.section, group: f.group, do: todo, chosen, note: a.note || undefined, extra: r?.extra, why: r?.why, ask: r?.ask, topic: r?.topic,
    where: f.where, file: f.file, line: f.line, quote: f.quote, other: f.other, problem: f.problem, what: f.what, paths: f.paths, evidence: f.evidence });
}
fs.writeFileSync(path.join(HERE, "work-order.json"), JSON.stringify(out, null, 1));
const n = k => out.filter(x => x.do === k).length;
console.log(`work-order.json: ${out.length} | apply ${n("apply")} | nothing to do ${n("nothing")} | hold ${n("hold")}`);
for (const s of ["book", "foundry", "records"]) console.log(s, ["apply", "nothing", "hold"].map(k => `${k} ${out.filter(x => x.section === s && x.do === k).length}`).join(", "));
console.log("nothing:", out.filter(x => x.do === "nothing").map(x => x.id).join(" "));
console.log("hold:", out.filter(x => x.do === "hold").map(x => `${x.id}(${x.topic})`).join(" "));
