# The Action sheet: three mockups compared (PACK ACTION-SHEET, part 2)

2026-11-11. The mockups: `archive/mockups/action-sheet-A.html`, `archive/mockups/action-sheet-B.html`, `archive/mockups/action-sheet-C.html` (open them in a browser; the buttons at the top switch between Smite, Rebuke, Covering Fire and Mark Quarry). They are built by `action-sheet-build.mjs` from the system's CSS, the real rules list (`fxsheet.mjs`), the real Action card (`buildSoloCard`) and the four cards in `tools/content.mjs`. All three sit on the audit's defaults (`action-effects-audit.md`) and are ready for Stage 0.

| | A: one page, in the card's order | B: a list and a pane | C: Versions side by side, the card beside them |
|---|---|---|---|
| The idea | One scrolling page, 680 px. The card's lines, then Reaction and Area as part rows, then a tab per Version. | The Effect window's shape, 760 px: every part of the Action is a row on the left; the pane edits the selected one. | A wide window, 1040 px: the Versions are the columns of one table; the real card stays on the right. |
| Good at | Reading and writing a card top to bottom, as the book prints it. A Version's Tiers, its Effects and its steps are on one screen. Fits the width the Effect window opens at. | The same shape, pieces and habits as the Effect sheet (the most shared code). The whole Action at a glance in the list: "3 AP: a light, a Guard, a Push". | Seeing what changes between 1, 2 and 3 AP (a grey cell repeats the Version to its left). The card always in view while you edit. |
| Bad at | Comparing Versions (one tab at a time). Long on a card with a chain and rules (Smite: about three screens). | Filling a new card: one part open at a time, so many clicks; the Tiers and the steps are never together. The list is long (Smite: 11 rows). | Needs a wide window; under 900 px the card drops below. A one-Version card leaves the table nearly empty. The step's editor is under the table, away from its cell. |
| Smite (3 Versions, a chain) | Good: 3 tabs, the chain inside the 3 AP tab | Fair: 11 rows | Best: the three Versions in one view |
| Rebuke (a Reaction, a chain) | Best: the Reaction row, then the Tiers and the two steps | Good | Fair: one column |
| Covering Fire (a Zone) | Good | Good | Fair: one column, mostly empty |
| Mark Quarry (holds rules) | Good: the rules list is the Effect sheet's, as it is | Best: the rules are rows of the same list | Good |
| Shares with the Effect sheet | Segmented buttons, part rows, switches, drop zones, the ?, Automation at the bottom, the rules list | All of those, and the list-and-pane itself | The same pieces; the table is new |
| Work to build | M-L | L (every part needs its pane and its sentence) | L (the table, the "repeats" logic, the two-column window) |

## Recommendation: A

A is the fastest to write a card in, it reads in the book's order, it fits the window width you already use for Effects, and it is the smallest build. Two things I would take from the others:
- **from C, the card:** A already has it as a fold at the top; it could stay open on a wide window (the card on the right when the window is 1000 px or more).
- **from B, nothing now.** If the sheet later feels long, the Version tabs can become B's list without changing the data.

C is the one to pick instead if most of your cards will have three Versions (as Smite does): its table is the only layout that shows them together.

## After Lucas's answers (2026-11-11)

**A, with the order of events: `archive/mockups/action-sheet-A2.html`.** Lucas: "I like A but the side panel of B is good because it looks like an order of events." A2 is A's page with a rail on its left for the selected Version: 1 when it is used (your turn, or the Reaction's moment), 2 the cost, 3 the target or the area, 4 the roll, 5 the Effects applied (on use, or on a Tier 2 or 3), 6 the damage, then, under "after the damage lands", each step. An event jumps to where it is edited; the rail follows the Version's tab; rules the Action holds are listed under "Always, while you have it". The window is 900 px (A is 680).

**Generate Action: `generate-action.html`, three ways.**

| | G1: the form | G2: paste the card | G3: start from a shape |
|---|---|---|---|
| The idea | Today's window in the sheet's pieces | One text box: the card as the book prints it; each line gets a tick or a question mark | Pick the kind of Action, fill a sentence with blanks |
| Good at | An NPC's quick Action; nothing new to learn | A card already written (book/, your notes): the fastest; reads the Reaction's moment and the steps | Shapes that need two or three items (a Zone and its Effects) |
| Bad at | Repeats the new sheet's fields | The most parsing code; a line it can't read stays plain text | Each shape has to be written; no help outside the shapes |
| Build | S | M | M, per shape |

**Recommendation:** G2 as the Generate Action window (the new sheet already is G1), and G3's Zone shape later, when more Zones are written.

## Second round (2026-11-11)

Lucas: A2 yes, "the order of events should follow the scroll, like a fixed element" (done: the window scrolls as a Foundry window does, the rail stays and lights the event you are at); **G2 now, G3's Zone later**; the audit's defaults as they are.

**The button builder: `button-builder.html`, three ways** (the audit's section 7 has what is wrong with today's window). In all three: every kind of button, a live look at it, and two ways out (Lucas): **Copy the text** and **Send to chat**.

| | B1: kinds and fields | B2: a list and a sentence | B3: write it |
|---|---|---|---|
| The idea | Today's window, the missing kinds added, in the sheet's pieces | The kinds in a list; one sentence with blanks for the picked kind | One box: "Pushed 2; Vulnerable 2 (EoT)"; each piece becomes a button |
| Good at | Every option of every kind; a Save with its three Tiers | The least to read; the same shape as the Effect sheet | Speed at the table; several buttons at once; Recent |
| Bad at | The most to look at | A Save or Damage with several parts doesn't fit one sentence | Options the words don't cover (a Push away from the target) |
| Build | M | M | S (the reader exists: `convertEffects`) |

**Recommendation:** B3's box at the top of B1's window: write it when the words are enough, pick a kind when they aren't.
