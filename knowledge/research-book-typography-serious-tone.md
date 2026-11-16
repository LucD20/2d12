# Book typography: what makes a page read as a serious book, and how reference matter is set inside one

## 2026-11-16: for "much more book feel" and "a more serious tone" (the rulebook's HTML and its Action cards)

**The question.** What does the craft of book typography and editorial / reference design say makes a page feel like a serious book, and how is structured reference matter (tables, definitions, labeled entries, boxed matter) set inside such a book without looking like software? Asked because the rulebook's Action cards (rounded box, saturated title bar, system-sans labels, a bright color per trait word, pill badges, callouts with a thick colored left border and a spaced capital label) read as a web app inside a cream Georgia page.

**How far to trust this file.** One pass, by an agent (about 60 steps); not re-checked by a second. There is no raw report: everything found is here.
- [read] = the text read in full on its page: Butterick's *Practical Typography* (12 chapters), Rutter's webtypography.net (which reproduces Bringhurst's rule headings and short passages) and the free sample chapter of his *Web Typography*, the booktabs manual, Tufte CSS, Gwern.net's design page, Merriam-Webster's Explanatory Notes, Wikipedia's "Rubric", MIL-STD-38784's pages on warnings (a mirror), MDN, the CHI 2023 abstract, Diplograph's recipe gallery.
- [quoted] = a book seen only as someone's quotation: Bringhurst (via Rutter), Tschichold (via Rutter and artequalswork.com), Tufte (via Boxes and Arrows, NN/g), the cookbooks (via Diplograph), Krebs's survey (via Gigazine).
- [checked] = an opinion read on its page, with its date (Fountain Institute, Smashing Magazine, nerdy.dev, illuminatedcomputing).
- [measured] = checked by Claude on the files: the fonts the Google Fonts API serves and the full files in the google/fonts repository were downloaded on 2026-11-16 and their OpenType tables read with fontTools.
- [lead] = a search summary or memory only, to open before quoting: Chicago and Hart's on tables, Sibley's layout, legal codes, Tufte's "1 + 1 = 3", Google's own statement on features, and lines marked so below.

---

## Q1. Classic book typography: what the craft books say

### Butterick, *Practical Typography* [read]
- **Body text first.** "The typographic quality of your document is determined largely by how the body text looks. Why? Because there's more body text than anything else." The four choices: point size ("On the web, 15–25 pixels"), line spacing ("120–145% of the point size"), line length ("an average of 45–90 characters per line"), and font ("never choose Times New Roman or Arial").
- **Bold or italic.** "think of them as mutually exclusive. That is rule #1. Rule #2: use bold and italic as little as possible." "With a serif font, use italic for gentle emphasis, or bold for heavier emphasis." "If you need another option for emphasis, consider all caps or small caps."
- **All caps.** "Fine for less than one line". "Caps are suitable for headings shorter than one line [...], headers, footers, captions, or other labels. [...] Always add letterspacing to caps". To emphasize a paragraph: "Use rules and borders. Add a heading that labels it Important. Run it in a larger point size. But don't capitalize it."
- **Letterspacing.** "Use 5–12% extra space with caps, but not with lowercase"; in CSS "0.05em to 0.12em". "avoid the common error of spreading letters too far apart. If the spaces between letters are large enough to fit more letters, you've gone overboard."
- **Small caps.** "Use real small caps; avoid fakes". Fakes "are too tall, and their vertical strokes are too light." "The rules for all caps also apply to small caps: use small caps sparingly, add letterspacing, and turn on kerning." "the CSS property font-variant: small-caps is now safe to use. By default, it will access the OpenType small caps in the font—if they exist. Otherwise, you'll get the same old inferior counterfeits."
- **Headings.** "Fewer levels, subtler emphasis". "Limit yourself to three levels of headings. Two is better." "Don't use all caps." "The best way to emphasize a heading is by putting space above and below". "Use bold, not italic." Size: "Use the smallest increment necessary to make a visible difference." "Don't center" (with exceptions: "It's rare to see text centered in a book, newspaper, or magazine, except for the occasional headline or title").
- **Rules and borders.** "In traditional printing terminology, a rule is a line; a border is a box." "best used sparingly. Ask yourself: do you really need a rule or border [...]? You can usually get equally good results by increasing the space above and below the text. Try that first." Borders "between half a point and one point [...] Thicker borders are counterproductive—they create noise that upstages the information inside. You want to see the data, not the lines around the data." "With rules, you have more latitude because they don't accumulate the way borders do." "If you attach a rule to headings, try putting it above the heading".
- **Tables.** Default tables have "two formatting defects you should always fix: cell borders and cell margins." "The text in the cells will create an implied grid. Cell borders can make the grid cluttered and difficult to read". "turning off all the cell borders to start, and then turning them back on as needed."
- **Color.** "Black is best". "body text in printed documents [...] must always be set in black type. No exceptions." "At a typical body-text point size, color isn't effective as a form of emphasis." "Multiple shades of one color are usually better than multiple contrasting colors." On the web: "less color is more effective. When everything is emphasized, nothing is emphasized." "Consider making your text dark gray rather than black." "Color remains the idiomatic way to denote clickability on the web. [...] be careful using it on non-clickable text, as it may confuse readers." And: "Liturgical rubrics are so named because they were originally printed in red. Red has been the favored second color in typography for hundreds of years. To get the most vibrant-looking red, use an old printer's trick—make it slightly orange."
- **On Georgia.** "Georgia was optimized for the screen; Miller was optimized for print." Screen-optimized system fonts have had "design details [...] sanded off"; "All system fonts are overexposed."

### Bringhurst, *The Elements of Typographic Style*, as reproduced by Rutter [quoted]
- 2.1.2 "Choose a comfortable measure": "Anything from 45 to 75 characters is widely regarded as a satisfactory length of line for a single-column page set in a serifed text face [...]. The 66-character line (counting both letters and spaces) is widely regarded as ideal." Rutter: set the box width in ems "as it ensures the measure is always set to the typographer's specification."
- 2.1.6 "Letterspace all strings of capitals and small caps, and all long strings of digits": "The normal value for letterspacing these sequences of small or full caps is 5% to 10% of the type size."
- 2.1.7 "Don't letterspace the lower case without a reason" (Goudy's "steal sheep").
- 2.2.1 "Choose a basic leading that suits the typeface, text and measure": leading is "a basic rhythmical unit"; 2.2.2 "Add and delete vertical space in measured intervals".
- 2.1.3 "Set ragged if ragged setting suits the text and page": "Narrow measures – which prevent good justification [...] Setting ragged right under these conditions will lighten the page". Rutter (older text): "So don't justify text on the web."
- 3.2.1 "Use titling figures with full caps, and text figures in all other circumstances": text figures "are a sign that dollars are not really twice as important as ideas [...]. However common it may be, the use of titling figures in running text is illiterate". Rutter: Georgia "is the sole holder of text figures" among the core web fonts.
- 3.2.2 "For abbreviations and acronyms in the midst of normal text, use spaced small caps": "Genuine small caps are not simply shrunken versions of the full caps. They differ from large caps in stroke weight, letterfit, and internal proportions [...] digital modification routines will only produce a parody." Rutter: "even fonts that support small caps and oldstyle numbers are served without them by Google Fonts" (confirmed below, Q4).
- [lead] Bringhurst's chapters on tables and on "Shaping the Page" (rules, boxes, color, the page's proportions) are not reproduced on the site.

### Tufte [quoted]
- Data-ink and chartjunk (NN/g's paraphrase, [checked]): data ink is "the elements that convey information and cannot be removed without changing the visualization's message"; chartjunk is "any visual element that isn't really necessary and in fact distracts". Butterick ties it to type: "Thick grid lines are a common kind of chartjunk."
- *Envisioning Information*, chapter "Layering and Separation", opens: "Confusion and clutter are failures of design, not attributes of information" (p. 53, quoted by Boxes and Arrows). [lead] Same chapter: "1 + 1 = 3 or more" (after Josef Albers): two lines create a third element, the space between them; every added line or box adds unintended shapes. Only student summaries were found.
- Tufte CSS [read], on headings: Tufte's own forum post, "the Feynman lectures (3 volumes) write about all of physics in 1800 pages, using only 2 levels of hierarchical headings". On sections: Tufte "starts each section with a bit of vertical space, a non-indented paragraph, and the first few words of the sentence set in small caps" (the "newthought"). On color: "#fffff8 and #111111 because they are nearly indistinguishable from their 'pure' cousins, but dial down the harsh contrast. We stick to the greyscale for text, reserving color for specific, careful use in figures". Links "match the body text in color"; "Blue text [...] is crass and distracting." The face: Bembo in print, ETBook on screen. And a warning: "The web is not print. Webpages are not books."

### Tschichold [quoted]
- *The Form of the Book* (essays 1949–74, English 1991), quoted on artequalswork.com: "Personal typography is defective typography. Only beginners and fools will insist on using it." ("Clay in a Potter's Hand", 1949). "In the strict meaning of the word there cannot be anything 'new' in the typography of books. [...] methods and rules upon which it is impossible to improve have been developed over centuries." "The book designer strives for perfection; yet every perfect thing lives somewhere in the neighborhood of dullness and is frequently mistaken for it by the insensitive." (1958). "Today more than ever before, simplicity is the mark of nobility in any piece of masterful work." "roman capital letters must always and under all circumstances be letterspaced, using a minimum of one-sixth their body size" (about 17%, more than Butterick's 5–12%). "The lines should contain from eight to twelve words". "Harmony between page size and the type area is achieved when both have the same proportions."
- *Asymmetric Typography*, quoted by Rutter (below): "Tables should not be set to look like nets with every number enclosed. Try to do without rules altogether. [...] Vertical rules are needed only when the space between columns is so narrow that mistakes will occur in reading without rules. Tables without vertical rules look better. Thin rules are better than thick ones."

### Tables: Rutter's *Web Typography* (free sample chapter) and booktabs [read]
- Rutter: "design tables to be read, not just looked at." "avoid any border or frame surrounding the table. This is a Victorian embellishment which is entirely unnecessary as text alignment will shape the table just fine." "Avoid zebra striping, tints and fills, and any other backgrounds." Rules: "use them in one direction only and employ a lighter colour [...]: you are making a distinction, not constructing a barricade." "Left-align text, right-align numbers, and align headings with data"; "don't centre-align text within tables". Full-width tables "replete with background colours and borders [give] the texture of an image, when what your reader really requires is the texture of text." "remove from your mind's eye all visions of spreadsheets [...] and think instead in terms of typography and simple gestalt grouping principles." Figures: "Use old-style numerals in running text" ("numbers set in lining numerals call undue attention to themselves"); "Use tabular lining numerals in tables of numbers" (`font-variant-numeric: lining-nums tabular-nums`).
- Simon Fear, the booktabs manual (LaTeX, the scientific-publishing standard): "You will not go far wrong if you remember two simple guidelines at all times: 1. Never, ever use vertical rules. 2. Never use double rules." A formal table has a heavier top and bottom rule and a lighter rule under the heads. It is set against the "tableau", which "will probably have icons in abundance, and no doubt use colour too". "enforced structure of presentation enforces structured thought in the first instance."
- [lead] Chicago Manual (tables chapter) and New Hart's Rules say the same (horizontal rules only); not readable free.

### Takeaways (Q1)
1. **The craft books agree on fewer means, not better ones:** two or three heading levels; bold or italic, never both; caps only for less than a line and letterspaced 5–12%; space before rules, rules before boxes, a box last. [read: Butterick; quoted: Bringhurst, Tufte]
   - *For 2d12:* a note only: each card element can be checked against "could space or a rule do this instead of a box?"
2. **Small caps and old-style figures are the classic book signals, and both must be real.** Fake small caps (scaled capitals) are the "parody" Bringhurst names; text figures in running text and lining figures only with caps or in tables. [quoted, read]
   - *For 2d12:* a note only: the current `font-variant:small-caps` on Georgia (which has no small caps) produces the fake kind.
3. **Color is not emphasis at text size; one ink, and color for one job.** Butterick: black for text, multiple shades of one color over contrasting colors; Tufte CSS: greyscale for text, color reserved. [read]
   - *For 2d12:* a note only: a different bright color per trait word is the pattern both advise against.

---

## Q2. Serious against app-like: who says it explicitly

- **The "vibe-coded" tells** [checked, Jeff Humble, Fountain Institute, 24 Apr 2026, "7 Signs a UI Has Been Vibe Coded"]: "Cards for every block of info [...] Then those cards go in a card. [...] Use whitespace, proximity, and typography to create grouping. [...] Most content does not need a box around it." On the colored left bar: "A thin vertical bar on the left edge of a card or content block. Seems harmless. But in vibe-coded interfaces, every single block gets one, and each one gets a different color [...]. What the model cannot reason about is the color budget of the whole page. Four competing accent colors don't add up to four highlights. They cancel each other out." Also: status dots "on everything", emojis as icons, purple gradients ("the Times New Roman of AI-generated design"), neon on dark. "locally it looks fine. Globally it's chaos." "It gives you the average."
- **A count of the tells** [quoted: Gigazine, 23 Apr 2026, reporting Adrian Krebs's survey of 500 "Show HN" sites; Krebs's own post not opened]: 15 "AI-like elements", among them "a dark background with gray text, and all section labels in uppercase" (20.3%), "three or six identical cards with an icon at the top" (20.1%), "a colored accent stripe to the top or left edge of the card" (13%), "all capital letters for section labels and navigation links" (10.5%), a "capsule-shaped badge above the title" (4.7%), "vibrant box shadow" (4.3%). Krebs: "before the age of AI, all websites looked like Bootstrap".
- **The older version: Bootstrap sameness** [checked, Smashing Magazine, July 2015]: "The incredible popularity of tools like Bootstrap and Foundation leads to thousands of web designers using the exact same codebase, layouts, and even aesthetic style".
- **Serif type and belief** [checked: Errol Morris's 2012 New York Times quiz (about 40–45,000 readers, six typefaces), as analysed by illuminatedcomputing.com, Aug 2012]: the same claim was agreed with slightly more often in Baskerville than in the other faces (Morris's statistician: "The p-value for Baskerville is 0.0068", only just under the corrected threshold of 0.0083), and Comic Sans least. A small effect, from a single uncontrolled quiz. [lead] Brumberger (2003) and a Wichita State study: readers rate serif faces "Stable, Practical, Mature, and Formal".
- **What the craft writers set against it** [read, Q1]: Tufte CSS's greyscale text and body-colored links; Rutter's tables with "the texture of text" instead of "the texture of an image"; Butterick's "When everything is emphasized, nothing is emphasized"; Tschichold's "neighborhood of dullness". Gwern.net [read] keeps its palette "deliberately [...] grayscale as an experiment in consistency"; "Classic typographical tools, like dropcaps and small caps are used for theming or emphasis"; "hierarchies & progressions should come in cycles of 3 (eg. bold > italics > smallcaps)".
- [lead] Not found: an essay naming rounded corners themselves as the "app" signal, or one on why government or academic design reads as authoritative (GOV.UK's guidance was not opened).

### Takeaways (Q2)
4. **The app look is named by its parts, and they are the ones on the current cards:** a box per block and boxes in boxes, a colored stripe on the left edge, uppercase micro-labels, pill badges, a different accent per item, shadows. Each "looks fine locally"; the fault is the page's color and box budget. [checked, quoted]
   - *For 2d12:* a note only: the critique is of the total, so it is judged on a whole page of cards, not one.
5. **The book look is named by what it leaves out:** one ink with shades, grouping by space and alignment, rules before boxes, labels in small caps or italic, figures that match the text. [read]
   - *For 2d12:* a note only: Lucas's "dark, serious, no AI feel" brief for Foundry (CLAUDE.md, 2026-11-12) points the same way.

---

## Q3. Reference matter inside serious books

### Dictionaries: Merriam-Webster's Explanatory Notes [read]
- Entry: "A boldface letter or a combination of such letters [...] that is set flush with the left-hand margin of each column of type is a main entry or entry word." "The material in lightface type that follows each main entry on the same line and on succeeding indented lines explains and justifies its inclusion".
- Senses: "A boldface colon is used in this dictionary to introduce a definition"; "Boldface Arabic numerals separate the senses"; "Boldface lowercase letters separate the subsenses"; "Lightface numerals in parentheses indicate a further division". "Information coming between the entry word and the first definition of a multisense word applies to all senses". Italic "sense dividers": *especially, specifically, also, broadly*.
- Labels: "An italic label indicating a part of speech or some other functional classification follows the pronunciation". Run-ons are "introduced by a lightface dash".
- Cross-references: "In each instance the cross-reference is readily recognized by the small capitals in which it is printed."
- The anatomy: **one bold word at the margin, then everything run in**, distinguished by weight (bold numerals and colons against lightface), slope (italic labels), and case (small-cap cross-references): no box, no color, no rule.

### Liturgical books: the rubric [read]
- Wikipedia: "A rubric is a word or section of text that is traditionally written or printed in red ink for emphasis. The word derives from the Latin rubrica, meaning red ochre or red chalk". "Instructions for a priest explaining what he must do during a liturgy were traditionally rubricated in missals and the other liturgical books, whereas the texts to be spoken aloud were in black." "This is the oldest recorded definition in English, found in 1375." After printing, "as printing in two colours is more expensive [...] rubrication has tended to be reserved for sacred and liturgical books or luxury editions". Morris's Kelmscott Press used "chapter titles and other accents in red, or rarely blue". The red-letter Bible (c. 1900) used red to mark one speaker's words.
- The point: the red is **one functional layer** (what to do) against the black (what to say). [lead] The liturgists' maxim "Say the black, do the red."

### Technical manuals: MIL-STD-38784 (US DoD technical manuals) [read, a mirror]
- "Warnings, cautions and notes shall be short, concise and used only to emphasize important or critical data." "Warnings shall be in all caps." Order: "warnings shall precede cautions, which in turn shall precede notes". "Warnings, cautions and notes shall not contain procedural steps nor shall the headings be numbered." "When a warning, caution or note consists of two or more paragraphs the heading WARNING, CAUTION, NOTE shall not be repeated". [lead] In the printed manuals the warning is the one boxed or bordered element.
- The point: even the most "form-like" serious genre spends its box and its capitals on one thing, danger.

### Field guides [lead]
- Sibley's second editions put "each species in a vertical column – name at the top, map at the bottom" so that the same thing is always in the same place across a spread (sibleyguides.com, via search). Peterson's pointer system: short lines from a caption to the field mark. The scannability comes from **a fixed order and fixed position**, not from boxes or color coding.

### Cookbooks [read: Diplograph's gallery, which quotes the books]
- Acton's *Modern Cookery* (1845) "was the first to split ingredients and their measurements from the procedure"; Beeton (1861): "a list of ingredients and measures, followed by the procedure". *Joy of Cooking* interleaves them, which "works really well for the compact, narrow column format". *Mastering the Art of French Cooking* (1961): "A two column format, with ingredients, measures, and cooking implements in the left column and instructions on the right. The rules between each section break up the recipe". Its introduction: "On the left are the ingredients [...]; on the right is a paragraph of instruction. Thus what to cook and how to cook it, at each step in the proceedings, are always brought together in one sweep of the eye."

### Legal codes [lead, from memory]
- A statute section opens with a bold number and catchline ("§ 101. Definitions"), then run-in subdivisions (a), (1), (A) set by indent alone; definitions put the defined term in quotation marks or bold at the start of a run-in paragraph. No boxes; hierarchy by numbering and indent.

### Takeaways (Q3)
6. **A repeated entry is made scannable by a fixed anatomy, not by a frame:** a bold head at the margin; everything else run in, in a fixed order; labels told apart by weight, slope and case (bold numerals, italic labels, small-cap cross-references); senses numbered; a rule or space between entries. [read: Merriam-Webster; lead: field guides, codes]
   - *For 2d12:* a note only: the card's parts (name, frequency, cost, flavor, traits, Tier 1–3) map onto headword, label, gloss and numbered senses.
7. **The red second color is historically a function, not a decoration:** in missals the red marks what to do, the black what to say; Kelmscott and the red-letter Bible kept it to one layer each. [read: Wikipedia]
   - *For 2d12:* a note only: a rules text has an obvious "do" layer (the mechanical lines) and a "say" layer (flavor), if a second color is wanted.
8. **Even the boxiest serious genre spends its box on danger only.** MIL-STD-38784: warnings, cautions and notes "used only to emphasize important or critical data", short, not numbered, never holding steps. [read, mirror]
   - *For 2d12:* a note only: a callout that boxes every aside spends the one signal a technical manual reserves.
9. **Two columns, "in one sweep of the eye", is the cookbook's answer to "what with what".** [quoted]
   - *For 2d12:* a note only: relevant if a Tier line ever needs its own condition and effect side by side.

---

## Q4. Typefaces: seriousness, the early-modern feel, and what the free fonts really contain

### Associations [lead unless marked]
- Garamond, Jenson, Bembo, Caslon are the old-style romans of the 15th–18th centuries; Tufte prints in Bembo [read, Tufte CSS]; Minion and Sabon are 20th-century book faces in that line. Tschichold wanted "at least one representative of old-style roman, complete with italics" in every type shop [quoted]. Blackletter and the "distressed" revivals (IM Fell, cut from 17th-century Oxford types with their irregularities) read as period costume; no source read says so in those words.
- Butterick [read] on screen fonts: Georgia is "optimized for the screen", its details "sanded off"; it is "overexposed".

### What Google Fonts actually serves [measured, 2026-11-16]
The fonts were fetched twice: the latin file the Google Fonts CSS API (`fonts.googleapis.com/css2`) serves to a desktop browser, and the full file in the google/fonts repository (the "download family" file, for self-hosting). Their OpenType substitution tables were read with fontTools.
- **The served files have no small caps (`smcp`, `c2sc`) and no old-style switch (`onum`) in any of the 24 families tried.** They keep `liga`, mostly `tnum` and `pnum`, sometimes `lnum`. This matches Rutter ("even fonts that support small caps and oldstyle numbers are served without them by Google Fonts") and Google's own guide as summarized by search [lead]: the API "does not support requesting the inclusion of optional [...] OpenType Features, such as [...] Small Caps". With the served file, `font-variant: small-caps` gives the synthesized fakes (MDN [read]: "if the font doesn't support the OpenType value, then it synthesizes the glyphs").
- **The full files** (self-hosted, which CLAUDE.md's rule on external stylesheets would need checking against):

| Family | Full file: smcp / c2sc | onum / lnum / tnum | Default figures | x-height (em) | Axes | Served file keeps |
|---|---|---|---|---|---|---|
| EB Garamond | yes / yes | yes / yes / yes | lining | 0.405 | wght 400–800 | tnum, pnum |
| Cormorant Garamond | yes / yes | yes / yes / yes | old-style | 0.386 | wght 300–700 | lnum, tnum |
| Crimson Pro | **no** | yes / yes / yes | lining | 0.420 | wght 200–900 | tnum, pnum |
| Source Serif 4 | yes / yes | yes / yes / yes | lining, tabular | 0.475 | wght, **opsz 8–60** | tnum, pnum |
| Libre Caslon Text | **no** | yes / no / yes | lining | 0.524 | wght 400–700 | tnum |
| Alegreya | yes / yes | yes / yes / yes | old-style | 0.456 | wght 400–900 | lnum, tnum, pnum |
| Spectral | yes / yes | yes / yes / yes | lining, tabular | 0.450 | none (static) | tnum, pnum |
| Literata | yes / yes | yes / yes / yes | lining | 0.507 | wght, **opsz 7–72** | tnum, pnum |
| Gentium Book Plus | yes / yes | **no** | lining, tabular | 0.454 | none | liga only |
| IM Fell English | **no** | **no** | old-style | 0.458 | none; no kerning | liga only |
| Cardo | yes / no | yes / no / no | lining, tabular | 0.439 | none; no kerning | pnum |
| Vollkorn | yes / yes | yes / yes / yes | old-style | 0.460 | wght 400–900 | lnum, tnum, pnum |
| Newsreader | **no** | **no** (tnum, pnum only) | lining, tabular | 0.426 | wght, **opsz 6–72** | tnum, pnum |
| Libre Baskerville | **no** | **no** | lining | 0.530 | wght 400–700 | liga only |
| Crimson Text | **no** | **no** | lining | 0.424 | none | liga only |

- **Separate SC families on Google** (Alegreya SC, Cormorant SC, Vollkorn SC, Spectral SC, IM Fell English SC): in the served Alegreya SC, Cormorant SC and Vollkorn SC, the lowercase keys draw small-cap glyphs (no descender on g), so they give real small caps through the plain API. **Spectral SC did not:** in both the served and the repository file, lowercase "g" is the ordinary lowercase (descender at -240) and the small caps sit in `a.sc`-named glyphs reached only through `smcp`, which the served file lacks. Surprising; to check in a browser before relying on it.
- **Screen size at 16–18 px** [measured proxy, not a rendering test]: a larger x-height reads larger at the same pixel size. Libre Caslon Text (0.524), Literata (0.507) and Source Serif 4 (0.475) are large; EB Garamond (0.405) and Cormorant (0.386) small. Cormorant is usually described as a display face [lead]. Source Serif 4, Literata and Newsreader have an optical-size axis, which thickens hairlines at text sizes automatically (`font-optical-sizing: auto`). None of the families has a grade (`GRAD`) axis (see Q5).
- **Pairings** [lead]: a family's own SC or small caps for labels; Alegreya with Alegreya SC (and Alegreya Sans, same designer); Source Serif 4 with Source Sans 3; EB Garamond alone at two sizes. Butterick [read] prefers fewer faces; Tufte CSS uses one.

### Takeaways (Q4)
10. **Real small caps on the web need a self-hosted full file (or an SC family that remaps the lowercase); the Google Fonts API alone gives fakes.** [measured, quoted]
    - *For 2d12:* a note only: CLAUDE.md allows Google Fonts stylesheets but asks for everything else inline; a self-hosted font is a file of the artifact or a `data:` URI, which counts toward the 16 MB.
11. **Of the free candidates, seven have the full set (smcp, c2sc, onum, lnum, tnum): EB Garamond, Cormorant (and Cormorant Garamond), Source Serif 4, Alegreya, Spectral, Literata, Vollkorn.** Crimson Pro, Libre Caslon Text, Newsreader, Libre Baskerville, Crimson Text and IM Fell have no small caps in the files read. [measured]
    - *For 2d12:* a note only: the shortlist above is by features only; how each looks at 17 px, light and dark, was not tried.

---

## Q5. What survives on a screen and in dark mode

- **Reading speed by polarity** [read: abstract, Palmén, Gilbert and Crossland (Google), CHI 2023, 459 participants]: "dark text on a light background (Light Mode) is read reliably faster than its polar opposite (Dark Mode)", but "Paragraph readers are not choosing, or preferring, LM over DM despite fluency benefits".
- **Irradiation: light type on dark looks heavier** [checked: Adam Argyle, nerdy.dev, 29 Nov 2025; Adobe Design on grade]: "white text on a black background looks thicker than black text on a white background, even though the weights are the same"; the fix is a negative grade or a slightly lighter weight in dark mode. Adobe: grade "exists to smooth over those differences [...] without changing spacing". [lead] Other blogs warn the opposite risk: hairlines of thin or high-contrast faces break up on dark grounds, so very light weights fail; the two advices concern different faces.
- **Not pure black or white** [read, Tufte CSS]: "#fffff8 and #111111 [...] dial down the harsh contrast". Butterick: "on screen, dark-gray text can be more comfortable to read than black text". Gwern [read] built dark mode as a second palette, not a filter, and found it "only mostly works. In particular, inline & code blocks tend to disappear", so "a small deviation from pure-monochrome" was allowed.
- **CSS that now exists** [read, MDN; all "Baseline: widely available" on their pages]: `font-variant-caps: small-caps | all-small-caps` (the real `smcp`/`c2sc`, else synthesized); `font-variant-numeric: oldstyle-nums | lining-nums | tabular-nums`; `text-wrap: balance` ("only supported for blocks [...] six or less [lines] for Chromium") for headings and `text-wrap: pretty` ("a slower algorithm that favors better layout over speed [...] for body copy"); `hyphens: auto` ("Browsers will only hyphenate if [the lang] attribute is present and the appropriate hyphenation dictionary is available").
- **Justification** [quoted]: Bringhurst's narrow-measure warning stands; Rutter's older "don't justify text on the web" predates `hyphens` support; Standard Ebooks [read] uses `text-align: initial` "instead of text-align: left; [...] This allows the reading system to opt to use text-align: justify". Sidenotes (Tufte CSS) collapse to toggles on small screens.

### Takeaways (Q5)
12. **Dark mode is slower to read but chosen anyway; type in it needs its own weight.** [read, checked]
    - *For 2d12:* a note only: the families in Q4 have no grade axis, so a dark-theme adjustment would be by weight (variable `wght`) or by color, not grade.
13. **Every classic device now has a CSS switch, and each fails silently without the font's support or a `lang`.** [read]
    - *For 2d12:* a note only: the book's HTML would need `lang="en"` for `hyphens:auto`.

---

## Q6. The two-color tradition and the single accent

- Black and red [read: Wikipedia, Butterick]: rubrication began as a separate stage in manuscript production; after printing it was "reserved for sacred and liturgical books or luxury editions"; "Red has been the favored second color in typography for hundreds of years"; Butterick's "make it slightly orange". Kelmscott used red, "rarely blue".
- What it is reserved for [read]: in missals, instructions; in the red-letter Bible, one speaker's words; in manuscripts, "initial capitals [...], section headings and names". Tufte CSS reserves color for figures; Gwern allows color only where monochrome failed in dark mode.
- Against a second hue for each category [read]: Butterick's "Multiple shades of one color are usually better than multiple contrasting colors"; Humble's "color budget".

### Takeaways (Q6)
14. **One accent, given one job, holds its meaning; an accent per category loses it.** [read, checked]
    - *For 2d12:* a note only: the trait groups (Roll, Requires, Kind, Damage, Keywords) and the class colors are the current uses competing for that one job.

---

### Sources
- **Butterick:** [Practical Typography](https://practicaltypography.com/): [Typography in ten minutes](https://practicaltypography.com/typography-in-ten-minutes.html) · [Bold or italic](https://practicaltypography.com/bold-or-italic.html) · [All caps](https://practicaltypography.com/all-caps.html) · [Letterspacing](https://practicaltypography.com/letterspacing.html) · [Small caps](https://practicaltypography.com/small-caps.html) · [Headings](https://practicaltypography.com/headings.html) · [Rules and borders](https://practicaltypography.com/rules-and-borders.html) · [Tables](https://practicaltypography.com/tables.html) · [Color](https://practicaltypography.com/color.html) · [System fonts](https://practicaltypography.com/system-fonts.html) · [Centered text](https://practicaltypography.com/centered-text.html)
- **Bringhurst via Rutter:** [webtypography.net](http://webtypography.net/toc/): rules [2.1.2](http://webtypography.net/2.1.2), [2.1.3](http://webtypography.net/2.1.3), [2.1.6](http://webtypography.net/2.1.6), [2.1.7](http://webtypography.net/2.1.7), [2.2.1](http://webtypography.net/2.2.1), [3.2.1](http://webtypography.net/3.2.1), [3.2.2](http://webtypography.net/3.2.2)
- **Tufte:** [Tufte CSS](https://edwardtufte.github.io/tufte-css/) · [NN/g: Clutter in charts](https://www.nngroup.com/articles/clutter-charts/) · [Boxes and Arrows: Three lessons from Tufte](https://boxesandarrows.com/three-lessons-from-tufte-special-deliverable-6)
- **Tschichold and tables:** [artequalswork: The Form of the Book, digested](https://www.artequalswork.com/posts/form-of-the-book/) · [Rutter, *Web Typography*, sample chapter "Numerals and tables" (PDF)](https://book.webtypography.net/Web-Typography_Numerals-and-tables.pdf) · [booktabs manual (CTAN, PDF)](https://mirrors.ctan.org/macros/latex/contrib/booktabs/booktabs.pdf)
- **App look:** [Fountain Institute: 7 Signs a UI Has Been Vibe Coded (Apr 2026)](https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui) · [Gigazine: design slop (Apr 2026)](https://www.gigazine.net/gsc_news/en/20260423-design-slop) · [Smashing Magazine: Beyond the Boring (2015)](https://smashingmagazine.com/2015/07/hunt-for-the-webs-lost-soul/) · [illuminatedcomputing: Fonts, Credibility (2012)](https://illuminatedcomputing.com/posts/2012/08/font-credibility/) · [Gwern.net: Design](https://gwern.net/design)
- **Fonts:** [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=EB+Garamond) (the served files) · [google/fonts repository, `ofl/`](https://github.com/google/fonts/tree/main/ofl) (the full files, read through raw.githubusercontent.com) · [Typst forum: Limited features of fonts from Google Fonts](https://forum.typst.app/t/limited-features-of-fonts-from-google-fonts/6761) (search summary only)
- **Screen:** [MDN: font-variant-caps](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps) · [font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric) · [text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) · [hyphens](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens) · [Readability Matters: "How bold can we be?" (CHI 2023)](https://readabilitymatters.org/articles/research-highlight-how-bold-can-we-be) · [nerdy.dev: the irradiation illusion (Nov 2025)](https://nerdy.dev/adjust-perceived-typepace-weight-for-dark-mode-without-layout-shift) · [Adobe Design: Keeping type consistent](https://adobe.design/ideas/keeping-type-consistent-in-changing-conditions) · [Standard Ebooks Manual of Style](https://standardebooks.org/manual/latest/single-page)
- **Cookbooks:** [Diplograph: A Gallery of Recipes](https://diplograph.net/notes/food/design/recipe-design-gallery)
- **Reference matter:** [Merriam-Webster: Entries](https://www.merriam-webster.com/help/explanatory-notes/dict-entries) · [Definitions](https://www.merriam-webster.com/help/explanatory-notes/dict-definitions) · [Cross-references](https://www.merriam-webster.com/help/explanatory-notes/dict-cross-references) · [Functional labels](https://www.merriam-webster.com/help/explanatory-notes/dict-functional-labels) · [Wikipedia: Rubric](https://en.wikipedia.org/wiki/Rubric) · [MIL-STD-38784, p. 30](https://technicalmanualspecsstandards.emilspec.com/MIL-STD-38784/page30.html) and [p. 31](https://technicalmanualspecsstandards.emilspec.com/MIL-STD-38784/page31.html) · [Sibley: second editions](https://sibleyguides.com/ultfaqs/whats-different-in-the-second-editions-of-the-sibley-field-guides-to-eastern-and-western-birds/) (search summary only)

- **Could not be opened:** Google Fonts' Knowledge pages and FAQ (rendered by script; only search summaries), Adrian Krebs's original survey post, the books themselves (Bringhurst, Tschichold, Tufte, Chicago, Hart's), Sibley's and Peterson's "how to use this book" pages.

### Not covered yet
- **Leads to open:** Bringhurst on tables, rules and "Shaping the Page" (chapter 8), and on the page's color; Tufte's "1 + 1 = 3" passage and his tables in *The Visual Display*; Chicago and Hart's on tables and boxed text (sidebars); Krebs's survey; Google's own statement on stripped features; GOV.UK or academic house styles on authority; Brumberger (2003) on typeface persona.
- **Not tried:** rendering the shortlisted fonts at 16–18 px in a browser, light and dark (only x-height measured); print CSS (`@page`, page breaks, `orphans`/`widows`), which was in the brief but not researched; how serious reference books set a repeated stat block or a statute-like rule (OSR and other rulebooks were left out as outside the question); drop caps and ornaments (fleurons) as section marks.
- **Unresolved:** why Spectral SC's files map lowercase to ordinary lowercase (a packaging fault, or a family meant to be used with `smcp`).
