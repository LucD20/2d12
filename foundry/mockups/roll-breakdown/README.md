# The roll's breakdown: three designs (a mockup)

**Why (Lucas, 2026-11-27):** "The chat card to read bonuses and penalties really needs a redesign, we have done it a couple of times and hasnt worked." His picture: `lucas-2026-11-27.png`. **Nothing here is in the system.**

The page: `index.html` (dark; the button at the top, or `?light`, shows the light theme). It draws three designs for the same ten rolls in a card 300 px wide, then each at 232 px and 420 px.

## The picture's arithmetic

It adds up. 3 + 11 = 14 on the dice, +2 Weapon = 16. Boons: Shifting Aim (Field) and Vulnerable 1 (no name) = 2. Banes: Low cover and Engaged with Aveline, both Field = 2 (the limit of a name is 2 a side, so both count). 2 Boons and 2 Banes cancel: nothing is added. 16 against AD 14 is Tier 2 (14 to 20). The card is right; it does not say any of this.

One more thing in the picture: it is about 220 px wide, so the panel there is narrower than a 300 px card. Today's panel does not tear at 300 px in my rendering (`today-1-dark.png`); it tears at 232 px (`today-1-232-dark.png`, the same break as his picture). So the designs were checked at 232 px too.

## What was tried before (the changelog, `foundry/twod12/docs/reference.md`)

| Version | What it did | Why it did not hold |
|---|---|---|
| v0.0.283 (pack chat-cards) | The Tier ladder opens the breakdown: a left column of labels (2d12, Boon · Bane, Modifiers), one line for each Boon or Bane die with its source, a triangle and the word; the total against a framed Defense badge; result chips | The labels' column takes 62 px of every line; Boons and Banes were still dice (1d3 − 1) |
| v0.0.301 (pack BB) | Boons and Banes became +1 / −1: one line each, "Boon · Flanking · Field", "+0, over the limit" for one past its name's limit, a tag when 5 are left | Each line says its own +1, so the reader adds line by line; the rule (count, limit, cancel, five) is not shown |
| v0.0.347 (playtest 4) | Lucas: "smaller, on the right, no Boon / Bane words, no triangle": "+1 Marked Quarry", right-aligned, 11 px; the name as a small capital tag | Right-aligned in the narrow column: a long name wraps and leaves its number and its tag behind (today's picture) |
| v0.0.387 (STYLE-3) | Fonts and colors only | The layout stayed |
| v0.0.485 | The opened box spans the card's full width | Width helped; the labels' column and the right alignment stayed |

What the three have in common, and what this mockup changes: the labels' column, the right alignment, a number on every entry with no sum, and the kind as a tag. None of the three designs below has any of the four.

## The three designs

Shared by all three: the d12 marks are the system's (pentagons; an exploded 12 and Doubles in the accent, the dropped die dashed and struck); the Tier is the one filled thing (palette A); Boon and Bane are in ink; the Defense is words ("against AD 14"); no hover text; a kind is a word beside the name ("(Field)") or a row's heading; an entry that does not count is struck with its reason ("Field: 2 at most"); a count that is not 1 is glued to the name's last word ("around ×2").

**A. The sentence.** One line the way the book writes a sum: `3 + 11  +2 Weapon  +2 Boons −2 Banes  = 16  against AD 14  Tier 2`. Each term is one piece that never breaks. A click on "+2 Boons −2 Banes" opens the names as two short paragraphs (Boons …, Banes …) and a line that says the cancelling.
- Good at: the shortest by far (42 px closed), so it can be on every card with no click; it answers "how did 3 and 11 become 16" in one pass; a long name only makes a paragraph longer.
- Bad at: with many entries the names are a paragraph, not a list (harder to scan for one name); the names have no number of their own (the counts are in the sentence).

**B. The ledger.** Boons in the left column, Banes in the right, a row for each kind (Field, Pressure, Support, No name); under them the cancelling in words ("4 Boons, 3 Banes: 1 Boon left: +1"); then the sentence of the sum. With Boons only or Banes only it is one column.
- Good at: the two rules that decide the number are shapes (a third Field is struck in its own row; the two columns face each other); the kind is a heading, never repeated.
- Bad at: the tallest; two columns of about 135 px wrap most long names (at 232 px nearly all); a kind with entries on one side leaves a hole on the other.

**C. The written sum** (my own, in the place of the plain collapsed form). A sum as written on paper: every line starts with its number in one column (14 the dice, +2 Weapon, +0 Boons and Banes), a line, the total. The Boons and Banes have their own short column under their line (+1, +1, −1, −1). A click on "Boons and Banes" folds that list.
- Good at: numbers align; the number is the first thing on its line, so no name can tear it away (a long name wraps under itself); top to bottom is literally the sum; Favored and Doomed fit ("+0, Favored: 5 Boons left").
- Bad at: as tall as today when open; one line an entry.
- Why it replaces the collapsed form: collapsing is not a design of its own. Today's breakdown is already behind a click (the ladder opens it), and both A and C fold. So the page shows the folded state of A and C and asks where the fold should be.

## Heights (the breakdown alone, 300 px card, measured by `check.mjs`)

| | 1. The picture's roll | 5. Five Boons, three Banes |
|---|---|---|
| Today | 160 | 223 |
| A, closed | 42 | 42 |
| A, open | 102 | 154 |
| B | 178 | 230 |
| C, folded | 86 | 86 |
| C, open | 155 | 221 |

## Recommended

**A on the card, C behind its click.** A's sentence is the only form short enough to be shown without a click, and it answers the question asked most. When the names are wanted, C is the form a long name cannot hurt. If only one is built: C. B is the truest picture of the rule, and the worst fit for a 300 px chat.

## Questions for Lucas

1. A, B or C, or A with C behind its click?
2. Always on the card, or behind a click? Today the whole breakdown opens on a click on the Tier ladder; A's sentence (42 px) could be on the card all the time.
3. The names: open or closed at first?
4. An entry that does not count (a third Field): struck with "2 at most", as drawn, or left out?
5. Cancelling: the rule cancels counts, not pairs, so no design says "this Boon cancelled that Bane"; they say "4 Boons, 3 Banes: 1 Boon left". Enough?
6. The Defense as words in ink ("against AD 14"); today it is a colored, framed badge. Keep the badge's color?
7. Several targets: drawn as one breakdown (the shared dice once, then each target). Today each target's row opens its own, with the dice repeated. Which?

## Assumptions

- Case 5's list is made to stress the layout (Flanking and Far range on one roll), not a real situation. "Prone target", "War cry", "Far range", "Hidden to the target", "Ranged while Engaged" and "Durgan's Banes, turned around" are my labels for sources the rules give; the system's own labels would be used.
- In the Save, the user's 2 Banes left are one entry worth 2 Boons with no name (Chapter 1, Save Actions).
- Not drawn: the "Applied" line (the effects the damage takes from; it would stay a line of its own) and "Hide enemy Defenses" (the number after AD left out, as today).
- The card is 300 px with 8 px of padding; Foundry's real width was not measured (Foundry was not run).

## Files

- `build.mjs`: the cases as data; counts with the system's `calc.mjs` (`bbCount`, `bbResolve`), throws if an entry list and the rule disagree; writes `index.html` and `today.html`. `roll-breakdown.css`: the styles (put into the page).
- `today.html`: today's panel, drawn by the system's `breakdownHtml` with the system's `system.css` and `theme.css` (read, not changed). The page shows pictures of it (`today-*.png`).
- `check.mjs` (run from `foundry/twod12`, then `build.mjs` again): dark and light, 1280 px and 390 px: nothing leaves a card, every unbreakable piece is on one line, every number in C is beside the first line of its name, the click opens the names, no hover text; writes `measured.json` and the pictures (`design-A/B/C-dark/light.png`, `page-phone-*.png`).
