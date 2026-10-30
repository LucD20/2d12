# 2d12: master plan (2026-10-25)

One list of everything open, in the order I recommend, with what each step needs from you. It replaces the scattered "next" lines in the backlogs (they stay as the detail).
Sizes: S = under an hour of work, M = a normal session, L = a long session, XL = several.

## 1. How we work from here (to cut the back-and-forth)
1. **Decisions are asked once, in a decision sheet, with my default.** You answer by exception ("all defaults except 2 and 5"). I never stop a pack to ask a minor question: I choose, and list it under "Assumptions I made" in the report, so you can revert it.
2. **One pack = one conversation = one deliverable** (a Foundry version, or a book change set). Start a fresh conversation with: "Read HANDOFF.md and MASTER-PLAN.md and run pack N". Short conversations are cheaper and never get compacted; the backlogs and HANDOFF carry everything.
3. **Your notes go in one running file** (notes.txt, any messy format, like the last one). I merge it at the start of the next pack. Mid-pack messages only for something urgent.
4. **Design topics get a prep document first** (my proposal, with the numbers from the ruler, and 2 to 4 yes/no questions). You read it when you want, answer once, and the pack runs without interruption.
5. **Only Foundry versions need your testing**: you get a short checklist per version; bugs go into notes.txt and are fixed in the next version, not in a ping-pong.

## 2. Everything open, by area

### Foundry (the system is at v0.0.170; your tests of v0.0.169 and v0.0.170 are pending)
| ID | What | Size | Depends on |
|---|---|---|---|
| Q | **DONE 2026-10-28 (v0.0.172).** Quick UI: Steadiness tile always visible (4 small squares), custom Steadiness in the Builder, the dark tier editor (`instanceDialog` and the weapon's), a Snapshot button on Cover height, the Talent Traits dropdown, a toggle to hide the help tips | S | nothing |
| M1 | **DONE 2026-10-28 (v0.0.170 and v0.0.171, run before Q, merged).** Movement A: Pulled (strict cone, stops next to the origin), Haul, Corners (anything solid at the point), Squeezing, the straight-line tie (the player chooses) | L | the book (done) |
| M2 | **DONE 2026-10-28 (v0.0.174).** Movement B: the path tool (Slid, Relocate / Reposition), Immobilized's DC, the Steadiness checkbox | L | M1 |
| R | **DONE 2026-10-28 (v0.0.176).** Rules sync: Rally Points (Paladin 6, Archer 5, the new formula), the NPC tables and the Builder's level scaling (levels 1 to 3), Light (only the target's light, N + 0.5 radius), Burst corner-only, Area and Distance as two fields, Dying and Shattered from the second time, Unconscious wake rule | M | the book (done) |
| F | **DONE 2026-10-28 (v0.0.179).** FORMAT: trait groups (picker, chips, order), tinted chips, weapon properties without color, the text colors | L | the traits (done) |
| C1 | **DONE 2026-10-30 (v0.0.181).** Foundry follows the book: E3 (the Bestiary by Stage, CV ×100, CV by Stage gap), the Core Rules (Health × (Level + 17) ÷ 16, Modifier steps at 5 and 8), P1 and A1 cards and level lists in today's class structure, Guard, Lock & Loose with Shot, Sharpshooter's into-melee Bane | L | E3, P1, A1 (done) |
| C2 | **DONE 2026-10-30 (v0.0.185).** The new class selection: levels as sections, the Class Details tab, the Levels window, the player's class window on drop and on level up (foundry/mockups/: the brief, the Step 0 report, the three mockups) | L | C1 |
| OT | **DONE 2026-10-30, IN THE BOOK (Lucas: all defaults; Leg Sweep without a free hand; book/options-talents.md).** Options (sidegrades) for every Pick slot and the Talents (structure, budget, overlap); then the approved cards go into the book | M | P1, A1, E3 |
| C | **IN PROGRESS (section 6): C-a DONE (v0.0.186, fixes v0.0.187), C-b DONE (v0.0.188), fixes and the PCs (v0.0.189); fixes (v0.0.190); fixes (v0.0.191); fixes (v0.0.192); fixes (v0.0.193); the Granted area and Escalation block (v0.0.194); C-c DONE (v0.0.195: the Talent picker's filter bar, Move Actions through the banner). **Pack C is complete** once Lucas tests v0.0.195 picker, Escalation on Actions, Move Actions through the banner.** Content (what C1, C2 and OT leave): class items in the C2 structure with the OT Repertoires and Escalation lists, every Talent card with Category / Level / Prerequisites / theme as data, the old cards to "(old cards)", the compendium text sync, the Talent picker's filter bar, the Features tab fixes, Escalation on the Actions tab, general (editable) automation instead of per-card code, the compendium PCs from the ruler's builds | XL | OT (done) |
| X | After the design sessions: Mastery and Gear, Skills, Magic in the system | XL | D2, D3, D4 |

### Book
| ID | What | Size | Depends on |
|---|---|---|---|
| D0 | **DONE 2026-10-29 (v0.0.180): Lucas picked option E, tight chips, on the chat card only.** **Chat card traits (Lucas, 2026-10-28, after v0.0.179):** the trait groups on the chat card make the cards too long. Keep the grouped chips on the previews and the details (sheets, the roll dialog), but the chat card needs a condensed form that still gives the information (ideas for the prep: one line of small chips with no group labels, the group colors only; or the trait words as colored text on the meta line; or the groups on hover). Mockups first, then Lucas picks | S | nothing |
| T | **DONE 2026-10-29 (no version: book/ruler only).** The spec-driven ruler: class builds in plain files (book/ruler/classes/*.txt), one script (spec.mjs) writes report.md: damage a turn, best turns, duels (rounds to kill, rounds to go Down) and a Monte Carlo party fight | M | nothing |
| E1 | **DONE 2026-10-29 (book/ruler/econ.mjs -> prices.md, catalogue/*.txt).** **The system's price list (Lucas 2026-10-29: "classes are written after the system").** Damage-equivalents at levels 1 to 3 for everything an Action can do: 1 AP, a Boon or Bane (about 9-10% of a roll each, the same as +1 Defense or +1 Modifier), Favored (+35%) and Doomed (-44%), Empowered N, Vulnerable N, a Defense bonus for a round, Heal N and a Rally Point, a Reaction, Frequency (At-will, Round, Encounter, Daily over a day of 3-4 fights), Escalation timing; then every Paladin and Archer Action priced against it (over / under tuned), with role budgets for Lucas to confirm | L | nothing |
| CH | **DONE 2026-10-29: the class charter** (book/class-charter.md): class and Talent, the Signature choice, levels 1 to 3, the role budgets, Escalation spent and Momentum, the order below | S | E1 |
| E2 | **DONE 2026-10-29 (book/ruler/map.mjs, positions.mjs; prices.md section 5; no rule changed).** **Positions in the ruler:** a map model (range, Speed, Engaged, closing in, kiting) so conditions and movement get a price: Hindered, Immobilized, Prone, Slowed, Pushed and Pulled, Evade, Cover, the [Ranged] Engaged Banes; the Archer's mobility and Distance | L | E1 |
| P1 | **DONE 2026-10-29 as a PROPOSAL (book/paladin-p1.md; the ruler only): Lucas answered (2026-10-29); IN THE BOOK 2026-10-29: Lucas approved; the Paladin document, Talents (Heavy Blows) and the Core Rules (Guard, Willing and Unwilling, [Weapon] Actions by trait, the Signature Class Action) are updated; Foundry in pack C.** The Paladin main build (2 Features, both Signatures: Smite and Lay On Hands; one default per Pick; an Encounter Pick at level 1) written to the charter's budgets and checked in the simulated days | M | CH, E1 |
| LV | **DONE 2026-10-29 as a PROPOSAL (book/progression-lv.md; book/ruler/progression.mjs -> progression.md; no rule changed): Lucas decided 2026-10-29: all defaults (model A); the book changes land with E3, D2, D4.** **Progression prep (decided in the brainstorm of 2026-10-29: rules-backlog top).** A prep document with 2-3 progression models (bounded with Mastery 2[W] and keep the best; Escalation-heavy; today's +10% to compare) run through the ruler at levels 1 / 5 / 10: fight length by difficulty (targets 2.5 / 3.5 / 4-4.5 / 5), Health lost, the CV of a lower-level NPC (the level-gap factor), weapon build against caster build by round (Overcast limits 1 / 2 / 3, the round-1 floor). Lucas picks one; it sets the budgets A1 is written to | M | E2 |
| A1 | **DONE 2026-10-29, IN THE BOOK (13-archer.md; book/archer-a1.md has the numbers): Lucas approved the defaults; Foundry in pack C.** **The Archer main build**, the same way | M | CH, E2, LV |
| E3 | **DONE 2026-10-30, IN THE BOOK (book/bestiary-e3.md; Lucas answered; CV ×100, Stages; Foundry follows in pack C or its own version).** **Bestiary refit** to the new PC baseline (and the level 2 problem: NPC Health +14% while the PCs' real damage grows 2-6%) | M | E1, E2 |
| D1 | **Archer design:** Marked Quarry (worth 6 to 8% of every Archer turn: the spec ruler, 2026-10-29), Sharpshooter, Hunter's Focus; then the final Level 1 text. Prep: edit classes/archer-1.txt per option and run spec.mjs | M | nothing |
| D2 | **Weapon Mastery, Weapon Groups and Gear** (firearms as their own property, Firearm, not Projectile, with the trait [Gun]: decided 2026-10-29, book/archer-a1.md section 8; per-weapon Mastery, groups with a 1/3 head start, 1 Mastery per group per combat; the open points of the Mastery note) | L | D1 not needed |
| D3 | **Skills** (16 skills, 4 per Attribute; how a skill roll works; Talents: their types and Prerequisites as data, which the filterable Talent picker needs: foundry-backlog top) | M | nothing |
| D4 | **Magic and Momentum** (Magic Talents raw and primal; Momentum and the starting Escalation; the Engaged banes of [Ranged] Power Actions) | L | D3 helps |
| B1 | The level-by-level explanation of each class | M | D1 |
| B2 | Rules still to write: Hide; [HT] as notation (and the Archer's Rain of Arrows and Covering Fire); Slowed and Quickened (idea); Escalation while Unconscious; Resist and Weak; Minor enemies; falling with Forced Movement; Hooked, Grab, Pummel and Brawler | L | D4 for some |
| B3 | The 9 "to be decided" boxes, the Bestiary's level 4 and up, the example NPCs' dice | S | after B2 |
| B4 | A plain build for drafting and printing (no colors, no folding) | S | nothing |

## 3. The order, and why

**Phase 1: Foundry catches up with the book (no design needed; I run each pack alone, you test each version).**
1. **Pack 1: Q** (DONE: v0.0.172, 2026-10-28). Small, visible, independent. You also send the results of testing v0.0.169 in notes.txt.
2. **Pack 2: M1** (DONE: v0.0.170 and v0.0.171, merged 2026-10-28).
3. **Pack 3: M2** (DONE: v0.0.174, 2026-10-28).
4. **Pack 4: R** (DONE: v0.0.176, 2026-10-28).
5. **Pack 5: F** (DONE: v0.0.179, 2026-10-28). **Phase 1 is complete.** Last of the phase, because it touches every card and sheet once.
   Why first: these rules are final in the book (nothing in them is still being designed), you have been waiting for them since 2026-10-23, and the book work below does not change them.

**Phase 2: design sessions (the only place where back-and-forth is wanted; each is prepared).**
6. **D0 Chat card traits** (DONE: v0.0.180, option E).
6. **T The spec-driven ruler** (DONE 2026-10-29: book/ruler/spec.mjs; the D1 prep numbers come from it).
6. **THE ORDER NOW (Lucas, 2026-10-29; book/class-charter.md section 7):** charter (done) -> P1 Paladin main build (done) -> E2 positions (done) -> LV progression prep (done, decided: model A) -> A1 (done, in the book) -> Archer rewrite and main build -> E3 Bestiary refit (done, in the book) -> options (sidegrades) and Talents (**done 2026-10-30, in the book**) -> the book, then Foundry. It replaces D1 (the Archer design) and the Momentum half of D4.
6. **E1 DONE (2026-10-29: book/ruler/prices.md).** **E1, E2, E3: the price list, positions, the Bestiary refit** (Lucas 2026-10-29): the classes are rewritten against them, so they come before D1. D1 becomes the Archer rewrite, plus a Paladin rewrite.
6. **D1 Archer** first: it unblocks B1 and the Foundry content. Prep: three options (keep, remove with compensation, rework) with ruler numbers.
7. **D2 Mastery, Groups and Gear**, then **D3 Skills**, then **D4 Magic and Momentum** (Skills before Magic: spells may use skills).
   Between sessions I run the autonomous book packs that are ready: B1 after D1, B2 and B3 at the end, B4 any time.

**Phase 3: build from a frozen spec.**
8. **C** (class items, levels, compendium, Archer changes), then **X** (Mastery and Gear, Skills, Magic), one version each or split by size.
   Why last: everything above has to be decided first, or the compendium is rewritten twice.

*Alternative:* if you would rather design first (the part you enjoy) and build later, do Phase 2 before Phase 1. The cost: Foundry stays behind the book on movement for longer.

## 4. What I need from you before Pack 1 (the decision sheet; defaults in brackets)
1. Approve the order, or move a pack. [as above]
2. Test v0.0.169 when you can and put the bugs in notes.txt. [before Pack 2 starts; Pack 1 does not depend on it]
3. Phase 2 prep documents: one conversation that writes all four (D1 to D4) in a row so you can read them together. [yes, right after Phase 1 starts; they do not block it]
4. Marked Quarry and Sharpshooter stay as they are until D1. [yes, you said so]

## 5. Standing rules (all packs)
Concise ability text; I write every new card's Flavor line; the names list in examples; Y for you in diagrams; each Foundry version comes with a test checklist; every pack updates the backlogs, the README and HANDOFF.

## 6. Pack C, the order (planned 2026-10-30; Lucas: "add all of this in the best order, then we start")

C is XL: three versions, each with its own test checklist, all on the branch `pack-c-content` (Update Foundry.cmd finds it). The order follows the dependencies: the engine before the cards that use it, the data fields before the cards that fill them, the cards before the UI that lists them, the PCs last because they are built from everything.

**Lucas's rule for automation (2026-10-30):** a card is automated with *general* effect settings that he can see and edit on the item in Foundry, never with code that looks for the card's name. Cards that are very specific and need no automation (Ricochet) stay text. Today `archer.mjs` and `paladin.mjs` test names (`hasFeature(actor, "Killer's Focus")`, Radiant Zeal, Elusive, Long Draw, Steady Nerves, Marked Quarry, Sharpshooter, Font of Mercy): those are what C-a replaces.

### C-a: v0.0.186, the engine and the data (L) — DONE 2026-10-30 (waiting for Lucas's test)
1. **General effect settings** (the effect editor, fxeditor.mjs; bonus.mjs, effects.mjs), each a field anyone can set on any effect:
   - *Once per round* on a Bonus Damage or a Boon/Bane modifier: "only the first matching Action each turn-cycle" (the `turnCycleBlocked` logic of usage.mjs, stored on the effect, not on the actor under a card's name).
   - *Minimum Escalation* already exists (`minEscalation`): shown plainly in the editor with its own label.
   - *Against me*: a modifier on Actions made against the creature (Elusive's Bane), with the same once-per-round option.
   - *Aura*: the effect also applies to allies within N squares (Font of Mercy's Rally bonus, the Paladin's Aura line), the healing bonus of a Rally Point as a modifier kind.
   - *Against the marked target* (Marked Quarry's Tier 1 [Mod]): a condition "only against a target marked by me", the mark being a status any card can put on.
   - Anything that still needs code after this (Sharpshooter's into-melee Bane: a property of the Feature, "[Shot] Actions skip the into-melee Bane", as a checkbox) is a named setting, never a name test.
   Then Killer's Focus, Radiant Zeal, Elusive, Font of Mercy, Long Draw, Steady Nerves, Marked Quarry move to effects on their items; the name tests are removed; the tests are moved to the settings. Old characters: their copies get the new effects at the next drop (or a once-per-world update, as for Rally).
2. **The Talent data** (data.mjs, the Talent sheet): Category (Combat / Mobility / Magic / Skill), Level, Prerequisites as a list of typed rows (Talent [name], Level [N], Action with a trait [trait], Attribute [name N], Other [text]), a theme tag (free text, e.g. Divine, Brawler). A function `canTake(actor, talent)` returns met / not met with the reasons (the picker uses it in C-c).
3. **The Features tab fixes** (actor-sheets.mjs, actor-sheet.hbs):
   - Features of higher levels are **not shown** until reached (no greyed "Level N" cards).
   - **Escalation** gets its own section, like Class, Species and Talents (the Passive and Active Escalation picks and what they gave).
   - **Talents are grouped by Category** (subsections Combat, Mobility, Magic, Skill; the slot cards stay where they are filled).

### C-b: v0.0.188, the content (L) — DONE 2026-10-30 (v0.0.187 went to the fixes from the test of v0.0.186)
1. **The class items** in the C2 structure (levels as sections): the Paladin and Archer Repertoires and Escalation lists as the book has them now (12-paladin.md, 13-archer.md), the OT options included (Paladin: Word of Radiance, Miraculous Recovery, Divine Intervention, Mending Light, Shield of Faith as a 0R Escalation Active, Hand of Mercy; Archer: Volley, Covering Fire, Deadeye, Rain of Arrows, Harrying Shots, Twin Shot, Vanish). Each card automated with C-a's settings where it can be.
2. **The cards that left the book** (book/options-talents.md section 4) go to "Paladin (old cards)" / "Archer (old cards)"; the ones that became Talents (Sacred Weapon, Challenge, Long Draw, Steady Nerves) are rebuilt as Talents.
3. **Every Talent card** as in 16-talents.md, with C-a's fields filled (Leg Sweep without a free hand; Kickboxer grants it as its own Action; Class Expertise).
4. **The text sync, done while each card is rewritten** (cheaper than a separate pass over the same cards): [B] explicit on every Body damage, "[Strike] Action", Rally Point numerals, Bane and Boon capitalized; then the same for the chat cards and the UI strings; a test that scans content.mjs for "bane"/"boon" in lower case and damage with no pool.

### C-c: v0.0.195, the picker — DONE 2026-10-30 (waiting for Lucas's test) (the Granted area and Escalation block were built in v0.0.194) (v0.0.189 and v0.0.190 went to the fixes from the tests; the PCs below were done in v0.0.189; Move Actions through the banner added, foundry-backlog top), Escalation in the Actions tab, the PCs (M)
1. **The Talent picker's filter bar** in the class window: search, Category, "only what I can take" (Level and Prerequisites through `canTake`; the reasons as a tooltip on the ones that can't be taken); a compact list option.
2. **Escalation on the Actions tab:** the Escalation Actives show among the Actions when they can be used (Escalation at or above the cost, not Unconscious), with their Escalation cost on the row; the Escalation passives show as an "active" line at the top of the tab while their minimum is met.
3. **The compendium PCs rebuilt from the ruler's builds** (book/ruler/classes/*.txt), last because they use every card above.

**Why this order and not the scope's 1-2-3-4:** the scope listed the class items first, but writing the cards before the general settings would mean automating Twin Shot, Harrying Shots and the new Talents by name and redoing them; and the text sync costs nothing extra while the cards are being rewritten, so it moves into C-b. The picker comes after the cards because it needs real Talents with data to test.
