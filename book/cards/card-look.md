# The look of the book and of its cards: the draft

**Started 2026-11-16 (Lucas: "Card look it is. Lets draft it first before mockups."), on branch `pack-card-look` from main.** A draft in words first; mockups only after he has chosen a direction; nothing in `rules.css`, `build_rules.py` or the built documents changes until he says so. What is on a card was settled in `card-structure.md` (the Structure): this is how it is **drawn**, and with it how the page around it reads.

## The brief (Lucas, 2026-11-16)

> Card look it is. Lets draft it first before mockups. So, the Foundry's look is a more "VTT" look, the books look needs to have much more book feel to it. I also want a more serious tone than the one we currently have in the books. Search about it, extensively, as this is very important for the system.

| His words | What it asks |
|---|---|
| "draft it first before mockups" | a written direction and its decisions, one at a time; no drawing yet |
| "the Foundry's look is a more 'VTT' look" | two looks on purpose: the screen tool keeps its dark table look; the book stops borrowing from it |
| "the books look needs to have much more book feel" | the card is part of a printed page, not a widget set into one |
| "a more serious tone than the one we currently have in the books" | less color, less ornament of the interface kind; the whole page, not only the card |
| "search about it, extensively" | research before any proposal: published RPG books, book typography, layout craft |

**What already binds it (his earlier words):** "dark by default, serious, no 'AI feel'"; he dislikes "rounded pills everywhere, boxes inside boxes, spaced-out capital micro-labels" (2026-11-12, for Foundry); "a sheet is a printed stat block" (a name plate, ruled lines of text, the Tiers as three lines). The system's purpose: the least ambiguity, and a card is re-read at the table far more often than it is read for the first time.

## Today's book, looked at (2026-11-16; `book/rules.css`, screenshots of `paladin.html` and `core-rules.html`)

**The page.** A cream ground; body text in Georgia with Times behind it, 16 px, a measure of about 780 px; headings in a rust-red serif; in the class documents, small-cap section headings with a small ornament and a drop cap. This part already reads as a book.

**What reads as an app, on the card:**

| # | Today | Why it reads as software |
|---|---|---|
| 1 | A box with rounded corners (8 px) and a hairline border, every line of the card a ruled row | a widget set into the page; a table grid where a book would have lines of text |
| 2 | A solid, saturated title bar in the frequency's color (blue Round, teal Turn...), white text on it | the loudest thing on the page is a colored button-like bar; 4e's power-card device |
| 3 | A chevron on the bar (the card opens and closes) | a control, on a page |
| 4 | The card's text in a sans-serif while the page is in a serif | two voices: the card is not set in the book's own type |
| 5 | Game words in their own colors inside the card (Guard blue, Power Modifier purple, Rally Point teal, Appeal olive, Power and Save teal) and a tinted chip around a [Strike] | a color for every kind of thing; a legend the reader never learned |
| 6 | A grey band for each Version or Mode | boxes inside the box |
| 7 | Labels in a bold sans at the left of each row | a form |

**And on the page around it:**

| # | Today | Why |
|---|---|---|
| 8 | Game terms colored wherever they appear in running text (AP indigo, Guard blue, Down red, Boon and Bane) | a paragraph with five colors in it |
| 9 | The example box: a tinted panel with a thick colored bar at its left and a spaced-out capital label ("EXAMPLE") | the callout of documentation sites; the micro-label he named |
| 10 | The contents column in a system sans-serif with buttons ("Expand all", "Open all cards") | an application's sidebar |
| 11 | Pill badges for AP and Reaction costs in a few places | pills |

## Research

Three passes were asked for on what `book/research/` lacks (`card-layout.md` covers where a block's facts sit, not how it is drawn):
- `book/research/card-look-published-books.md`: how published RPG books draw their ability and stat blocks, and what is said of them (serious, bookish, gamey).
- `book/research/book-typography-serious-tone.md`: book typography and reference design: what makes a page read as a serious book, how repeated labeled entries are set without boxes, typefaces.
- `book/research/rpg-layout-craft.md`: RPG layout designers on beauty against speed at the table, emphasis, color, icons, accessibility.
