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

**Lucas (2026-11-17): "I meant as a full line, so it would go from power to save all the way."** Redone: one continuous 2 px line under each group's run of traits (the traits are already printed by group, so a group is always together), with a gap at the dot between two groups.

**Lucas's answer (2026-11-17): "Keep the lines, next is the text face. Just give to me again: What the research said about frequency colors?"** DECIDED: the trait lines (one continuous line in the group's color under each group's run of traits) are kept. The frequency colors, again (in the message): 4e's green / red / black bars are the precedent; readers named the color coding and the light-on-dark bars as what made it look like cards; color as a code alone is the most criticised use (Paizo's publisher; the Pathfinder playtest's rarity colors replaced; red against green fails for 1 man in 12; WCAG 1.4.1); it passes only with the word printed beside it and colors that differ in lightness; no praised book does it; the praised books print the frequency as a word.

## Decision 2: the text face (PROPOSED 2026-11-17, five candidates, waiting for Lucas)

The page: `book/cards/look-desk/faces.html`, the artifact "Book Text Faces": the same Paladin slice (a small-caps heading, rules text, an example, a card, a subheading, a table) in each face, the faces embedded as subsets of their full files so their small caps and old-style figures are real (the files Google Fonts serves strip them; the book would carry the files in `rules-assets/`). The cards stay in Source Sans 3; their Flavor is in the text face's italic.

| Face | What it is | For | Against |
|---|---|---|---|
| EB Garamond | Duffner's revival of Garamont's 16th-century romans | the most classical: an old book | small x-height (set a size larger), thin strokes on screen, weaker in dark mode |
| Alegreya | del Peral, 2011, calligraphic, for literature | the most character without costume; a matching sans (Alegreya Sans) and real small caps | its liveliness is a taste |
| **Source Serif 4 (Claude's pick)** | Grießhammer for Adobe, after Fournier's 18th-century types | large x-height and optical sizes, made for screens; the same family as the cards' sans (Source Sans 3), so page and card agree | the plainest; less "old" |
| Literata | TypeTogether, for Google Play Books | made for long reading on screens | reads as a modern novel more than an old book |
| Vollkorn | Althausen, "bread and butter" type | dark and sturdy, holds up in dark mode | heavy; italic without small caps |

**Why Source Serif 4:** the direction he chose is the research-only one, which weighs reading at the table first; Source Serif 4 is the clearest on screen at 16 to 18 px, in both themes, and pairs by design with the card's sans. The book feel comes from the small caps, old-style figures, rules and restraint, which all five give. Second choice: Alegreya with Alegreya Sans for the cards, if he wants more character.

**For Lucas:** one face (by eye, on the page).

**Lucas (2026-11-17), before choosing the face:** "Drop my book and serious instructions for good, lets go only by the research from now on. Then check if the current still fit the research." **DECIDED: from now on the look is decided by the research only; "book" and "serious" are no longer criteria.**

## The decisions so far, checked against the research only (2026-11-17)

| Decided | Fits? | Why |
|---|---|---|
| B with the research only: a flat pale square panel, accent rules, the card in a plain sans against the serif page, bold labels | yes | it was built from the research alone |
| Frequency and cost as words, no frequency color | yes | color alone as a code is the most criticised use; the praised books print a word |
| No colored game terms, Attributes, Modifiers or subtypes; a defined term bold where it is defined | yes | "no praised book colors each keyword"; one of bold or italic |
| Traits without group colors, in group order | yes | the order is the cue |
| [V] and [R] in their pool colors | yes, with a note | the letter is the cue, so color is not alone (WCAG 1.4.1); red and blue are not the red-green trap; but the two have the same lightness (contrast 1.07), so the color helps only readers who see hue |
| **The trait lines by group (kept 2026-11-17)** | **no** | the research's weight is against five accent colors on a card ("four competing accent colors... cancel each other out"; "one accent, given one job"); measured, they collide with the other colors: Requires blue against Resolve blue (contrast 1.5), Kind rust against Vigor red and the accent (1.7); the grey Keywords line barely shows on the tint (3.0) |
| **The accent's red** | **no** | it is the same color as Vigor damage (contrast 1.01): one color with two jobs, which the research rejects ("one accent, given one job holds its meaning") |
| The example as an indented passage, no panel; examples and boxes without colored left bars | yes | space first, then a rule, then a box; the colored left bar is an "app" sign |
| Light ground by default, dark as a choice | yes | dark text on light reads faster; dark mode is chosen anyway |
| Real small caps, old-style figures in text and lining tabular figures in tables | yes | fake small caps are "a parody"; figures that match their place |
| Text face candidates (Source Serif 4 the pick) | yes | the pick already rested on reading on screen (x-height, optical sizes, a matching sans); "classic serif for mood" no longer counts, which helps Source Serif 4 and Literata over EB Garamond |

**Two fixes proposed:**
1. **The accent changes hue**, so red is Vigor's alone: a dark bronze (Claude's pick: no pool, trait or rule uses it, it is not on the red-green axis, and it keeps 7:1 on the tint), or a dark ink (structure by weight and rules only, no hue at all).
2. **The trait lines go** (back to traits in black, by group order), as the research weighs; or, if he keeps them, they are redrawn in hues and lightnesses no other color uses, which five groups make hard.

**For Lucas:** 1 (bronze or ink); 2 (drop the lines, or keep and redraw); then the face.

**Lucas's answer (2026-11-17): "1. Bronze. 2. Yeah, lets drop it for now. Source Serif 4 yea, I like Alegreya but it is a bit hard to read. If there is a mid-way point, I'd like to see, otherwise, proceed."** **DECIDED: the accent is a dark bronze** (light #7a5418, 5.7:1 on the card's tint; dark #d2a75a, 7.1:1; red is Vigor's alone); **the trait lines are dropped "for now"** (traits in black, by group order). The face: Source Serif 4 unless a mid-way between it and Alegreya is better.

**The mid-way faces, checked in their files** (real small caps and old-style figures needed; x-height as a share of the em, larger reads bigger): Piazzolla (Huerta Tipográfica, 2020; 0.478, optical sizes; full set), Brygada 1918 (0.46; full set), Spectral (0.45; full set); and a mix (the text in Source Serif 4, the small-caps headings in Alegreya). Rejected for lacking small caps: Lora, Gelasio, Besley, Fraunces (and Gentium Book Plus has small caps but no figure styles). The faces page now shows Source Serif 4, the four mid-way options and Alegreya for reference, in the decided look (bronze, traits in black). **Claude's pick for a mid-way: Piazzolla** (the same calligraphic school as Alegreya, with Source Serif 4's x-height).

**Lucas (2026-11-17): "Piazzolla is good but the '2' looks bad, Tier 2 for example doesnt read well right? It is the only bad thing, the numbers readability. Spectral is good with numbers for example."** Checked in the font file: Piazzolla's default "2" is already a lining figure (its old-style "2" is a separate glyph), and it is short by design; switching the text to lining figures changes nothing visible (tried on the page, then removed). So the figures can't be fixed without mixing faces. **Piazzolla is out.** Left: Source Serif 4 (Claude's pick: the clearest figures and text, a matching sans) or Spectral (his note: good figures; the lightest of the faces, thin strokes, x-height 0.45, so it would be set at 18 px and in a slightly heavier weight on screen).

**Lucas's answer (2026-11-17): "Source Serif 4." DECIDED: the text face is Source Serif 4** (the book carries its full files for real small caps and figures); the cards' text is Source Sans 3 (its family).

## Decision 3: the card's anatomy (PROPOSED 2026-11-17, waiting for Lucas)

Every kind of card drawn in the decided look: `book/cards/look-desk/anatomy.html`, the artifact "Card Anatomy" (a Strike with Tiers, Versions, Modes, two Reactions, a Passive, two Weapon Techniques), from the card files as they stand.

1. **The panel:** a flat tint of the page, square corners, a 2 px bronze rule above and below; never split across a printed page.
2. **The name line:** the name in bold bronze at the left; at the right, in bold black, the Escalation it needs, the frequency and the cost.
3. **The Flavor:** one line in Source Serif 4's italic, a shade lighter.
4. **The traits:** bold, black, in group order, joined by a middle dot; a thin bronze rule under them (kept on a card with no traits).
5. **The grid:** Distance and Area at the left, Target at the right, bold labels.
6. **The body:** one line each, the label bold in a fixed column (the same width on every card, wide enough for "Tier 1 or 2" and "Requirement").
7. **A Version or a Mode:** its heading in bold bronze over a thin grey rule; a Mode's own traits after its name in black; its own Distance and Target under it.
8. **Inside the text:** game terms in the text's color; links underlined thinly; [V] and [R] damage in their pool colors; brackets plain.
9. **The card's text** in Source Sans 3; the page in Source Serif 4.

Why (the research): the same anatomy every time is the findability rule cited most; labels at the start of the line in bold; space and rules, no boxes inside the box (a Version is a heading and a rule, not a band); one accent with one job (bronze marks where a card and its parts begin); never split by a page turn.

**For Lucas:** yes, or the lines to change.

**Lucas's answer (2026-11-17): "Modes: It has an horizontal extra line I think, on top of the 'Kindle'. Other than that, all look good." DECIDED: the anatomy as proposed, with one fix:** a Version's or Mode's heading has no grey rule when it comes right after the traits' line (Lantern of Faith showed the traits' bronze rule and Kindle's grey rule stacked).

## Decision 4: the page around the card (PROPOSED 2026-11-17, waiting for Lucas)

A sample of Chapter 2 in the decided look: `book/cards/look-desk/page.html`, the artifact "Book Page Sample". Proposed, each from the research:

1. **Text:** Source Serif 4, 17 px, line height 1.55, a measure of about 40 rem (65 to 75 characters), left-aligned (browser justification is "rudimentary": Butterick), hyphenated (needs `lang="en"` on the page), old-style figures in running text.
2. **Headings: three levels, all in the ink color** (the bronze keeps its one job, the cards): a chapter title; a section in semibold; a subsection in real small caps. The Part line above a chapter in small caps over a thin rule (today a tinted rounded band). No rust-red headings.
3. **Game terms in running text are not colored** (AP, Guard, Rally Point, Down, Boon, Bane, Attributes, Modifiers). A term is bold where it is defined; elsewhere a link to its definition is a thin underline in the text's color.
4. **An example** is an indented passage opened by "*Example.*" in italic: no panel, no colored bar, no capital label.
5. **An open box** ("to be decided") is the same, opened by "*To be decided.*", in the lighter ink. (The book's Open Items appendix keeps listing them.)
6. **Tables:** no vertical rules, no fills, no frame; a rule above and below the header row, hairlines between rows; the header in small caps; lining tabular figures.
7. **Lists:** plain bullets, the text's spacing.
8. **The contents column:** in the text face, chapters in ink and sections indented in the lighter ink, the Part names in small caps; on a narrow screen it is hidden behind the page's menu as today. Its buttons ("Expand all", "Open all cards") become plain underlined words; they are not printed.
9. **Opening and closing cards** (the class documents): stays on screen, as a small grey mark at the left of the name line; every card is open in print.
10. **Not decided here:** the class documents' ornament and drop cap (the research gives no reason to keep or drop them: neutral; Claude's default: drop the ornament, keep no drop cap, so the class documents look like the rest), the stat box and the level list of a class (the same rules: no panel colors, small-caps labels), the diagrams (unchanged), dark mode (the next decision).

**For Lucas:** yes, or the numbers to change; and the ornament and drop cap (drop, or keep).

**Lucas's answer (2026-11-17): "Looks good." DECIDED: the page as proposed (1 to 9), and Claude's default for the open point: the class documents' ornament and drop cap are dropped.**

## Decision 5: dark mode (PROPOSED 2026-11-17, waiting for Lucas)

Today the book follows the reader's system setting (light or dark) and has no switch of its own. The research: dark text on light reads faster for normal vision, more so at small sizes, but many readers choose dark anyway (a Google study, 2023: light "read reliably faster", not preferred); designers advise light by default and a switch; light text on dark looks heavier, so dark wants a slightly lighter weight; pure white on pure black glares.

1. **Light by default; dark when the reader's system asks for it,** and a plain switch ("Light · Dark") in the contents column that overrides it, remembered in the browser.
2. **Dark colors:** a warm near-black page (#1c1a17), not pure black; text off-white (#e9e3d6), not pure white; the card's panel a step lighter (#25221d); rules and hairlines dimmer; the bronze lighter (#d2a75a, 7.1:1 on the panel); the pool colors' light twins ([V] #ef8a96, [R] #8db3ff).
3. **Text a little lighter in dark:** Source Serif 4 is variable, so the body goes from weight 400 to about 360 in dark (the cards' sans, which is static from Google, stays).
4. **Print is always light,** whatever the screen shows, and prints every card open.

The sample page follows the reader's setting: switch the device to dark to see it.

**For Lucas:** yes, or changes.

**Lucas's answer (2026-11-17): "I dont see the light mode, but that sounds correct from my knowledge as well, proceed." DECIDED: dark mode as proposed (1 to 4).** Every decision of the look is made; next, mockups of the real documents.

## The mockups (2026-11-17)

Made without touching `rules.css`, `build_rules.py` or the built documents: `book/look/book-look.css` holds the decided look as an override stylesheet, and `book/look/mockup.py` copies the built documents into a mockup folder with that stylesheet, the fonts and the "Light · Dark" switch injected. Applying the look for real (later, on his word) means moving these rules into `rules.css` and the builder (the card HTML, the colored terms, the callouts), and carrying the font files in `rules-assets/`.

**Made (2026-11-17):** the six documents built with the look (`python3 look/mockup.py OUTDIR FONTDIR` from `book/`; the mockups themselves are not committed). Published for Lucas: the Paladin, the Core Rules and Gear. What they show that the samples didn't: the class document's stat box and level list without the double frame or the ornament; every Core Rules example and open box as an indented passage; the contents column with the "Theme: System · Light · Dark" switch; the document bar as plain words; the cards with the chevron as a small grey mark. Known gaps of a mockup (fixed when the look is applied in the builder): the diagrams keep their own colors; a few inline-colored words the builder writes with a style attribute may still show color; the contents column's two button rows sit around the theme switch.

**For Lucas:** yes to apply the look to the book (`rules.css`, `build_rules.py`, the fonts in `rules-assets/`), or the things to change first.

**Lucas (2026-11-17): "I think the Class layout could change. Research and see about it."** Applying the look waits for this.

## Decision 6: the class document's layout (research running, 2026-11-17)

**Today's Paladin document, in order** (`rules-src/12-paladin.md`; the Archer's is the same):
1. The class name and an intro paragraph.
2. A stat box, "The Paladin at a glance": Attributes, Health, Rally, Speed Modifier, Modifiers, Armor Training, Escalation hook.
3. "The Paladin by Level": levels 1 to 3, each a list of what you gain (Features, Hallmark Action, Hallmark Reaction, Art, Picks, Escalation, Talents).
4. "Level 1": the two Features (cards), "Hallmark Action Selection" (two cards), "Hallmark Reaction Selection" (two cards).
5. "Paladin Arts": three cards (one at level 1, a second at level 3).
6. "Paladin Repertoire": "Encounter", three cards (the level 2 pick).
7. "Paladin Escalation": the hook (a card), then Escalation 2, 4 and 6, two cards each ("Choose one at level N").

**What a reader does with it:** builds a character (reads the stat box, then makes four choices at level 1: a Hallmark Action of two, a Hallmark Reaction of two, an Art of three, an Escalation 2 ability of two); levels up (finds what level 2 and 3 add, which sits in three different sections); and at the table, finds his own cards among nineteen. Already visible: the level 2 gains are split across three sections (Repertoire, Escalation, the hook inside Escalation); the options of a choice are full cards one under the other, with no line saying how they differ; the order of the sections is neither by level nor by kind throughout (Level 1 is by level, the rest by kind).

The research note will be `book/research/class-layout.md` (how published RPGs lay out a class chapter; presenting choices; finding abilities at the table).

**The research** (`book/research/class-layout.md`; one pass, not re-checked; 2024 D&D, Pathfinder 2e, Draw Steel and OSE read on their pages or seen as images; the 2014 PHB and 4e from memory):
1. **The order recurs:** an identity paragraph, a summary block, the level table, then the features **in level order with the choices inside them**, then subclasses (2024 D&D, Pathfinder 2e, Draw Steel, OSE).
2. **The newest books print the level in every heading:** 2024 "Level 1: Lay On Hands"; Draw Steel "1st-Level Features", "7-Wrath Ability: Choose one..."; Pathfinder 2e the level beside each feature.
3. **Summary blocks:** label left, value right, one fact a line; a choice marked by a word ("Choose 2", "Choose A or B", "(Quick Build: ...)").
4. **The best-liked books point at a default pick and summarize before the detail:** Draw Steel's "(Quick Build: X)" on every level 1 choice; 2024's "X is recommended" and its overview tables; Daggerheart's suggested picks; Blades' starting templates. No source argued against marking a default.
5. **The most repeated complaint is going elsewhere to finish a choice** (Pathfinder 2e's feats at the end of the class and in another chapter; 2024's Fighting Style moved to Feats; 4e's powers with no index; Draw Steel's "marathon of decision making"). OSE's one class a spread is praised in the opposite words.
6. **Repeating text is the accepted price of not flipping;** reviewers name its cost in pages.
7. **At the table, players take their abilities out of the book** (sleeved cards, a binder, page numbers on the sheet, apps). The book's job is building and levelling up.

**The three ways** (a mockup of A, built from the real Paladin text: `paladin-by-level.html`, published as "Paladin by Level"):

- **A, by level (Claude's pick; 2024 D&D, Draw Steel).** After the at-a-glance box and the level list: "Level 1" with, in order, its Features, then each of its choices under a heading that carries the level ("Level 1: Hallmark Action", "Level 1: Hallmark Reaction", "Level 1: Art", "Level 1: Escalation 2 Ability"); "Level 2" (the hook, the Encounter Pick, the Escalation 4 ability); "Level 3" (the second Art, a pointer back to Level 1's Arts; the Escalation 6 ability). **Each choice opens with "Choose one." and a list of its options in one line each** (name, frequency and cost, what it does), **and a "Quick build" pick**, then the cards. Everything a level gives is in one place; levelling up is reading one section.
- **B, by kind, made consistent (today's, cleaned).** Features, Hallmark Actions, Hallmark Reactions, Arts, Encounter Picks, Escalation abilities, each section saying at which level it is chosen; the level list on top is the map. Finds a kind of card fast; levelling up still reads three sections.
- **C, the build on one page, the cards after (OSE, playbooks).** The class's first page holds everything to build and level: the box, then each level's choices as one-line lists with the quick build marked; all nineteen cards follow in one alphabetical section. Fastest to choose; a card is found by its name.

**Why A:** it answers the complaint the research found most (going elsewhere to finish a choice) and matches the order the newest books converged on; the one-line lists give C's quick choosing without moving the cards away from their choice; the quick build answers the one thing no source argued against. The cards stay closed until opened on screen, so a level reads as a short list.

**To decide with A:** the quick-build picks themselves (the mockup's are Claude's placeholders: Binding Light, Shield of Faith, Hold the Line, Armor of Faith, Bulwark of Faith, Weight of Judgment, Reckoning); the one-line summaries are Claude's wording, to check; the Archer gets the same shape.

**For Lucas:** A, B or C.

**Lucas's answer:**
