# Class selection rework (pack C2): the brief, corrected to the book (2026-10-30)

The design chat wrote `class-selection-brief-original.md` without reading the repo. This file is that brief with the book's current rules
folded in (P1, A1, E3). **Where the two disagree, this file wins.** The mockups (`class-details.html`, `class-levels.html`,
`class-picker.html`) stay the visual and behavioral spec; their sample content (cards, stats) is old and only illustrative.

**When:** pack C2, after C1 (C1 brings the Paladin and Archer cards in Foundry up to the book; this pack then builds on them).

## What changes from the original brief

1. **The level lists** (12-paladin.md and 13-archer.md, "by Level"; the migration uses these, not the original's):

   | Level | Paladin | Archer |
   |---|---|---|
   | 1 | Attributes (Body or Appeal +1, Mind or Instinct +1); Core Features **granted**: Divine Power, Font of Mercy; **Hallmark Action: choice, pick 1**: Smite or Lay On Hands; **1 Talent**; Encounter Pick 1; Passive Escalation Pick 1; Active Escalation Pick 1 | Attributes (Body or Instinct +1, Mind or Appeal +1); Core Features **granted**: Sharpshooter, Marked Quarry; **Hallmark Action: choice, pick 1**: Double Shot or Rolling Shot; **1 Talent**; Passive Escalation Pick 1; Active Escalation Pick 1 (**no Encounter Pick at level 1**) |
   | 2 | **1 Talent** (nothing else) | **1 Talent**; Encounter Pick 1 |
   | 3 | Daily Pick 1 (Repertoire, Daily); Passive Escalation Pick 1 | Daily Pick 1; Passive Escalation Pick 1 |

   There is **no "Pick from any list"** and **no Passive Escalation Pick at level 2** in the book today. The "From the Repertoire" type with
   Frequency "Any" stays in the model (future levels may use it).
2. **"Class Actions" is now the Hallmark Action** (Chapter 5, "Class Actions, Picks and the Repertoire", already updated in pack A1): a choice
   of two, you take one. Model it as an "Items I drop" section, Mode Choice, Pick 1. **No HANDOFF note about outdated Chapter 5 text is needed.**
   Precise Aim is no longer an Archer card (the Talent Aim).
3. **A fourth section type: "Talent"** (Pick N, from the Talents compendium; optional filter by Talent category: Combat, Mobility, Magic,
   Skill). Talents are not class items, so neither "Items I drop" nor "From the Repertoire" covers them. Player sees: "Choose N Talents".
   It counts in "choices to make" like a Repertoire pick, and the same exclusion applies (a Talent the character owns is not offered again).
4. **Choices to make, Paladin level 1 = 7** (2 Attribute pairs + Hallmark 1 + Talent 1 + Encounter 1 + Passive 1 + Active 1), not 5.
   Archer level 1 = 6.
5. **Font of Mercy** is an Escalation Passive every Paladin has (it doesn't use the Passive Escalation Pick): it goes in the granted Core Features
   section, and the availability rule then keeps it out of the Passive Escalation Pick's choices. Test this case.
6. **Sharpshooter contains a choice** (one Projectile weapon starts at 3 Mastery). Weapon Mastery is out of scope: grant the Feature and leave the
   weapon choice to the player / D2. Say so in the version's checklist.
7. **Sample content in the mockups is old:** the Paladin's Mind Health Multiplier is ×4 (not ×3); Aegis, Vow of Enmity, Divine Vigil, Avenger's
   Oath, Call to Arms, Judgment, Profane Judgment and others are in `archive/book-drafts/paladin-old-cards.md`. The migration fills the Repertoire and Escalation
   lists from the compendium **as C1 left it** (the book's cards).
8. **Stages (E3):** levels 1-4 / 5-7 / 8-10. A level-up into a new Stage (5 or 8) can show a line in the window's header: "Stage 2: your Weapon
   and Power Modifiers +1 (never above +4)" (Chapter 5). The Modifier step itself is C1's work (actor data); this window only tells the player.

## Unchanged from the original brief

Everything else stands: Step 0 (read the Class data model, sheet, drop handler and level-up code; report; wait for Lucas's OK), the three pieces
(Details tab, the Levels window, the player's class window), Granted or Choice with no mixed sections, the availability algorithm
(candidates − owned before − granted at this level − chosen in other sections; need = min(pick, available)), Pick 1 replaces and Pick N drops the
oldest, nothing applied before confirm, Cancel changes nothing, Attribute pairs follow Distinct Choices and lock on confirm, the suggested data
model (add `kind: "talent"` with `pick` and an optional `category`), out of scope (Species sheet, Mastery, Rally formula, the book's class page),
foundry-backlog.md updates, and delivery (a new version, tests for the section logic **including the Talent type and Font of Mercy's
exclusion**, a test checklist for Lucas).
