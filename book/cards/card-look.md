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

## Research (2026-11-16: three passes, one each, not re-checked by a second)

- `book/research/card-look-published-books.md`: how published RPG books draw their blocks.
- `book/research/book-typography-serious-tone.md`: book typography and reference design; fonts checked in their files.
- `book/research/rpg-layout-craft.md`: RPG layout designers, emphasis, color, icons, accessibility.

**What the three agree on, for this decision:**
1. **"Gamey" comes from the look more than the rules.** A 4e designer (Schwalb, 2011, quoted) said the format told readers the game "must not match the play experience". The look called "like cards" is 4e's: a full-width colored bar over every power, its color the frequency ("light-on-dark headers", "color carded"). That is the book's card today.
2. **The bookish blocks share four habits** (5e, 13th Age, Old-School Essentials): no rounded box (no box at all, or one flat tinted panel); thin rules or a pale band instead of filled bars; the name and the labels in the body's own bold or italic, run into the line; small caps for tags and heads.
3. **The app look is named part by part in two 2026 design pieces, and the parts are the book's:** "cards for every block of info", "a thin vertical bar on the left edge... each one gets a different color", "capsule-shaped badge", uppercase section labels.
4. **One ink and one accent, the accent given one job.** Missals print in red what to do and in black what to say (the "rubric"); the praised RPG books use one accent for structure; Butterick: "Black is best", "When everything is emphasized, nothing is emphasized". No praised book colors each keyword. Paizo's publisher (2018): "skeptical that color is a useful way to delineate information"; WCAG: color never the only cue; red against green fails for about 1 man in 12.
5. **Space first, then a rule, then a box** (Butterick: "Thicker borders... upstage the information inside"). Tables "should not be set to look like nets" (Tschichold); no vertical rules, no fills (booktabs, Rutter).
6. **A repeated entry is made scannable by a fixed anatomy, not by a frame:** a bold head at the margin, the rest run in, in a fixed order, labels told apart by weight, slope and case (Merriam-Webster's own notes; field guides).
7. **Speed at the table comes from structure and space:** the same anatomy every time ("repetition, predictable rhythms... create stability, trust, and confidence", Notestine), one entry never split by a page turn (Norman, McCoy), labels at the start of a line.
8. **Mood comes from the text type, not from costume:** a classic serif with real small caps; "no fake parchment or genre fonts". "In fantasy the most common UI theme is illuminated manuscripts and tomes" (McCoy).
9. **Real small caps need the full font file.** Georgia has none (the book's small caps today are shrunk capitals). Of the free faces, EB Garamond, Cormorant, Source Serif 4, Alegreya, Spectral, Literata and Vollkorn have real small caps and old-style figures in their full files; Google Fonts' served files strip them, so the book would carry the files (`book/rules-assets/`).
10. **Measured facts:** serif or sans makes no difference to reading speed at reading sizes; italics slowed readers with dyslexia (so flavor in italic is fine, rules text is not); dark text on light reads faster, though many prefer dark (so dark stays a choice).

## Decision 1: the direction for the book (PROPOSED 2026-11-16, three ways, waiting for Lucas)

**What is shared by all three** (what the research rules out): no rounded corners; no solid colored title bar; no chevron on the card in print (it stays a screen control, drawn small and grey); the card set in the book's own text face; no color for each kind of game word, in the card or in running text; no pill badges; no colored left bars; frequency and cost written as words; real small caps.

### A, the rubricated book (Claude's pick): black and one red, no frame

The card is a passage of the page, set the way a dictionary sets an entry. A thin rule above it; the **name** in bold small caps at the left, **frequency and cost** in small caps at the right of the same line; the Flavor in italic; the traits in small caps; then the lines of the body with their labels as a hanging column (**Tier 1**, **Setup**) in the text's bold, values beside them; a Version or a Mode as a small-caps subhead with a hairline; a thin rule below. **One accent, a dark red (the rubric), with one job: the parts you act on** (the name and the labels), the way a missal prints the instructions in red. Black for everything you read. In running text, game terms are not colored; a defined term is bold where it is defined, as a dictionary does. The example becomes an indented passage headed "*Example.*" in italic, with no panel. The contents column is set in the text face, with no buttons in print.
- **For:** the most serious of the three, and the closest to the research's agreement (four habits, one ink and one accent with a function, space before rules). Nothing on the page says "software". It prints in black and one color, or in black alone with no loss (the red carries no meaning that the label's position and bold don't already).
- **Against:** a card is found by its rule and its name, not by a block of color: on a dense page it stands out less. And the frequency loses its color (it is still a word in the same place on every card).

### B, the stat block: one flat panel, square, pale

5e's and Old-School Essentials' way. Each card is one flat pale panel (a light tint of the page, no border or a hairline, square corners), a thin accent rule under the name line; inside, the same anatomy as A. The frequency can be a short colored rule at the panel's top (one of three dark hues, never the only cue: the word is beside it).
- **For:** the card is found at a glance on a dense page; the research's bookish blocks include this one (a flat tinted box for a whole creature). The closest to his settled Foundry look ("a sheet is a printed stat block").
- **Against:** a box, so "boxes inside boxes" returns when a Mode or a Version sits inside it; a tint is the first thing a printer turns off; less of a book, more of a manual.

### C, the tome: the old book, worn openly

The illuminated-manuscript idiom McCoy calls fantasy's default: a display face for names (Cinzel, which the book already uses for some titles), ornamental rules with a centered mark between cards, a parchment-toned ground, drop caps, red rubrics, a framed card with a double hairline.
- **For:** the strongest mood; players read it instantly as fantasy.
- **Against:** the research's warning: it is costume ("no fake parchment or genre fonts"), and it is the opposite of "serious" as the typography sources define it. Ornament competes with the card for the eye. It dates fast.

**Why A:** his two words were "book" and "serious", and A is what both bodies of research describe under those words: one text face with real small caps, black and one red with a job, entries made findable by their anatomy and the space around them. It also separates the book from Foundry most clearly, which is what he asked: the screen keeps its dark table look with bars and buttons; the book becomes a book. B is the safe middle and can be reached from A later by adding a tint, if a playtest shows cards are hard to find.

**Decided later, one at a time, after the direction:** the text face (the candidates with real small caps, tried side by side on the screen), the accent's exact color and its dark-mode twin, the card's anatomy in detail (the label column's width, rules, spacing), Versions and Modes, the frequency mark, the page around it (examples, open boxes, tables, the contents column, colored terms), and dark mode. Then mockups.

**For Lucas:** A, B or C.

**Lucas (2026-11-17):** "Give me an example of each." Done: `book/cards/look-desk/examples.html`, the artifact "Book Look Examples" (the same Paladin slice: today, A, B, C). Then: "If we remove my words, book and serious, what would they look like, taking into consideration only the research."

**Answered: the research alone points between A and B, nearer B, and not to C** (added to the examples as D).
- **What the research supports with no word of his:** a fixed anatomy for every block; the block made findable by a light structure, and the praised books do it with a pale band or flat tint (Old-School Essentials' bands, 5e's panel), not with no frame at all; bold labels at the start of a line; one accent with a structural job; color never the only cue; the frequency as a word; no rounded corners, pills, colored left bars or a color per keyword (the "app look" parts); real small caps or none; tables without nets; light ground by default.
- **What only his words add (A over D):** dropping the tint and the band, the serif inside the block, red reserved for what you act on. The research has no finding that a frameless block is faster; it has the opposite hint (a tint helps finding).
- **Where the research is neutral, so D takes the plainer way:** serif or sans inside the block (no reading-speed difference; 5e sets its blocks in a sans, Scala Sans, and that is not what reads as an app); so D sets the card in a plain sans against the serif page, which also helps finding.
- **What the research weighs against:** C (costume; "no fake parchment or genre fonts"), and today's look on four counts (a saturated bar coding the frequency by color, a color per keyword, rounded boxes in boxes, the system interface font). It does **not** condemn a header bar as such: Justin Alexander praised 4e's format for clarity; the complaint was tone ("gamey"), which is a word of his.

**D, the research alone:** a pale band behind the name line with a dark rule on top; the name in the block's bold; frequency and cost in the accent; the card's text in a plain sans (Source Sans 3 as a stand-in); bold labels in a column; a rule under the block; Versions as accent subheads with a hairline.

**Lucas (2026-11-17):** "Let me see B without my book and serious instructions, only research." Added to the examples as "B, with the research only": the flat pale panel kept (the findable block); the card's text in a plain sans against the serif page (5e's way); the name in the accent and bold, not small caps; an accent rule above and below the panel and one under the traits (5e carries structure in one color); frequency and cost as plain bold words; Distance and Target with bold labels; Versions as accent subheads with a rule.

**Lucas's answer (2026-11-17): "B with research only is looking best so far. But Trait's 'labels', was that removed on purpose? And removal of color is preferred?"** Read as: the direction is B with the research only, unless the two answers change it.

**1. The traits' colors: removed on purpose.** Today each trait is colored by its group (five colors: Roll teal, Requires blue, Kind rust, Damage gold, Keywords grey), and a [Strike] in running text sits in a tinted chip. The research's reasons to drop them: a color for each category is the most criticised use of color (a legend the reader never learned; Paizo's publisher "skeptical that color is a useful way to delineate information"; four competing accents "cancel each other out"); the group is already shown by **order** (Roll, Requires, Kind, Damage, Keywords: fixed by `GROUPS`), which costs nothing. The example sets them in bold, in that order, separated by a middle dot. (There was never a "Traits:" label; if that was the question: a label could be added, but the traits sit on their own line under the Flavor on every card, which the research counts as the cue.)

**2. Color: the research does not ask for none. It asks for few, each with one job, never the only cue.** What each color of today's book is, against that:

| Today's color | Its job | Never alone? | Research verdict |
|---|---|---|---|
| The accent (rules, the name, Version heads) | structure: where a card starts and its parts | yes (rules and bold carry it too) | **keep: one accent** |
| [V] Vigor red, [R] Resolve blue on damage | which Health pool a damage hits: the distinction tracked on every hit | yes (the letter says it) | **keep, Claude's pick:** a second job the reader needs at a glance; two colors that also differ in lightness |
| The frequency's color (title bar) | Round / Turn / Encounter | no (in 4e's way, the bar *was* the cue) | drop: the word does it |
| Trait groups (five colors) | the group | the order does it | drop |
| Game terms in running text (AP, Guard, Rally Point, Down, Boon, Bane) | "this is a game word" | yes | drop: a color per keyword is the "app" sign; a defined term is bold where it is defined |
| Attributes (Body, Mind, Instinct, Appeal), the Modifiers | which one | yes | drop |
| Damage subtypes (Ho, Pi...) | the subtype | the two letters do it | drop |
| Links | "you can click this" | an underline does it | keep, in the text's color with an underline (Tufte CSS, Butterick) |

So the proposal for B with the research only: **black, one accent for structure, and the two pool colors on damage**; everything else black.

**For Lucas:** the traits without colors (yes or no); the pool colors (keep or drop); then B with the research only is the direction.

**Lucas's answer (2026-11-17): "Yes to all, but try one thing: A colored, thin, underline on the traits, by group. Do on B just so I see how it would look like." DECIDED: the direction is B with the research only; traits without colors; the pool colors on damage kept.** The trial is on the examples page ("B, with the research only: traits underlined by group": a 2 px underline in the group's color, the trait in black; the decided pool colors on [V] and [R]; Rebuke and Darting Blade added to show two Roll traits and a Requires trait).

**Against the research, for his decision** (it is a group color again, but carried by a line and not by the word): it keeps the word black and legible and the color secondary (the order still says the group), so it passes "never the only cue"; it brings back five colors on every card, the "competing accents" the research warns about, and an underline is the web's sign for a link (the book's own links are underlined). Claude's view: try it on the mockups if he likes it here; drop it if it reads as links.

**Lucas's answer:**
