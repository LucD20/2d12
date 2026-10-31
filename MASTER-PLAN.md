# 2d12: master plan (rewritten 2026-10-31, after v0.0.207)

One list of everything open, in the order I recommend, with what each step needs from you. The backlogs keep the detail.
Sizes: S = under an hour of work, M = a normal session, L = a long session, XL = several.
Finished: Phase 1 (Q, M1, M2, R, F), D0, T, E1, CH, E2, P1, LV, A1 (it was D1, the Archer design), E3, OT, C1, C2, pack C (v0.0.186 to v0.0.195), the editability sweep (v0.0.207), **D2 (2026-10-31, in the book with defaults; Lucas answers by exception: book/gear-d2.md section 7)** and **W (v0.0.208, to test)**. The full plan as it was, with every finished pack: `archive/old-notes/MASTER-PLAN-to-v0.0.207.md`.

## 1. How we work from here (to cut the back-and-forth)
1. **Decisions are asked once, in a decision sheet, with my default.** You answer by exception ("all defaults except 2 and 5"). I never stop a pack to ask a minor question: I choose, and list it under "Assumptions I made" in the report, so you can revert it.
2. **One pack = one conversation = one deliverable** (a Foundry version, or a book change set). Start a fresh conversation with: "Read HANDOFF.md and MASTER-PLAN.md and run pack N". Short conversations are cheaper and never get compacted; the backlogs and HANDOFF carry everything.
3. **Your notes go in one running file** (notes.txt, any messy format, like the last one). I merge it at the start of the next pack. Mid-pack messages only for something urgent.
4. **Design topics get a prep document first** (my proposal, with the numbers from the ruler, and 2 to 4 yes/no questions). You read it when you want, answer once, and the pack runs without interruption.
5. **Only Foundry versions need your testing**: you get a short checklist per version; bugs go into notes.txt and are fixed in the next version, not in a ping-pong.

## 2. Everything open

### Design sessions (book first; each gets a prep document with numbers and 2 to 4 questions)
| ID | What | Size | Depends on |
|---|---|---|---|
| D2 | **DONE 2026-10-31 (defaults in the book, waiting for answers by exception: book/gear-d2.md).** Weapon Mastery, Weapon Groups and Gear | L | - |
| D3 | **Skills** (16 skills, 4 per Attribute; how a skill roll works; the Skill Talents; the Talent data and picker exist since v0.0.186 / v0.0.195) | M | nothing |
| D4 | **Magic and Momentum** (Magic Talents raw and primal; Momentum and the starting Escalation; the Engaged banes of [Ranged] Power Actions) | L | D3 helps |

### Book (autonomous packs)
| ID | What | Size | Depends on |
|---|---|---|---|
| B1 | The level-by-level explanation of each class | M | D1 (done as A1) |
| B2 | Rules still to write: Hide; [HT] as notation (and the Archer's Rain of Arrows and Covering Fire); Slowed and Quickened (idea); Escalation while Unconscious; Resist and Weak; Minor enemies; falling with Forced Movement; Hooked, Grab, Pummel and Brawler | L | D4 for some |
| B3 | The 9 "to be decided" boxes, the Bestiary's level 4 and up, the example NPCs' dice | S | after B2 |
| B4 | A plain build for drafting and printing (no colors, no folding) | S | nothing |

### Foundry
| ID | What | Size | Depends on |
|---|---|---|---|
| X | After the design sessions: Mastery and Gear (D2's list for X: foundry-backlog.md), Skills, Magic in the system | XL | D2 (done), D3, D4 |
| W | **DONE: v0.0.208 (to test).** Fewer clicks for weapons: a button per hand (mockup foundry/mockups/weapon-hands-W.html) | M | - |
| K | **Shortcuts** (keyboard shortcuts for common Actions; a list to choose from first) | S | nothing |
| CL | **Code cleanup** (foundry-backlog: system messages to sysmsg.mjs, dead code; CSS only with a visual check) | S | best after X |

## 3. The order
1. ~~D2~~ (done; your answers to gear-d2.md section 7 first), then **D3 Skills**, then **D4 Magic and Momentum** (Skills before Magic: spells may use skills). Between sessions, the book packs that are ready: B1 now, B2 and B3 at the end, B4 any time; K fits between sessions too (W done: v0.0.208).
2. **X** (Mastery and Gear, Skills, Magic in the system), one version each or split by size, then **CL**.
   Why: everything in X has to be decided first, or the compendium is rewritten twice.

## 4. Standing rules (all packs)
- Concise ability text; I write every new card's Flavor line; the names list in examples; Y for you in diagrams; each Foundry version comes with a test checklist; every pack updates the backlogs, the README and HANDOFF.
- **Lucas's rule for automation (2026-10-30):** a card is automated with *general* settings he can see and edit on the item in Foundry, never with code that looks for the card's name. Cards that are very specific and need no automation (Ricochet) stay text.
- **The basic mechanics** (code, no settings) are listed in foundry/foundry-backlog.md; anything else the system automates is a setting or field on an item, and test t164 fails on a card name in module/ code.
