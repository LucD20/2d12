# Book typography: what makes a page read as a serious book, and how reference matter is set inside one

## 2026-11-16: for "much more book feel" and "a more serious tone" (the rulebook's HTML and its Action cards)

**The question.** What does the craft of book typography and editorial / reference design say makes a page feel like a serious book, and how is structured reference matter (tables, definitions, labeled entries, boxed matter) set inside such a book without looking like software? Asked because the rulebook's Action cards (rounded box, saturated title bar, system-sans labels, a bright color per trait word, pill badges, callouts with a thick colored left border and a spaced capital label) read as a web app inside a cream Georgia page.

**How far to trust this file.** One pass, by an agent (about 55 steps); not re-checked by a second.
- [read] = the text read in full on its page: Butterick's *Practical Typography* (12 chapters), Rutter's *Elements of Typographic Style Applied to the Web* (webtypography.net, which reproduces Bringhurst's rule headings and short passages), Tufte CSS, Gwern.net's design page, Merriam-Webster's Explanatory Notes, Wikipedia's "Rubric", the MIL-STD-38784 pages on warnings (a mirror), two 2026 essays on the "vibe-coded" look.
- [quoted] = Bringhurst and Tufte as quoted by a page that reproduces them (webtypography.net; Boxes and Arrows); never the books themselves.
- [measured] = checked by Claude on the files themselves: the fonts Google Fonts serves and the full files in the google/fonts repository were downloaded and their OpenType feature tables read with fontTools (2026-11-16).
- [lead] = a search summary or memory only, to open before quoting: Tschichold, Chicago and Hart's Rules on tables, Sibley's layout, Tufte's "1 + 1 = 3", and lines marked so below.
- Not opened: the books (Bringhurst, Tschichold, Tufte, Chicago, Hart's) are not free online.

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

### Tschichold, Chicago, Hart's [lead]
- Tschichold, *The Form of the Book* (essays 1975, English 1991): the book as a servant ("perfect typography" is invisible), the classical page canon (text block in fixed proportion to the page, wide outer and bottom margins), and his rejection of decoration and of the sans serif for books after his own modernist period. None of it was found reproduced; do not quote.
- Chicago Manual (chapter 3, tables) and New Hart's Rules: horizontal rules only (above and below the column heads and at the foot), no vertical rules, figures aligned on the decimal. From memory; the texts are behind paywalls.

### Takeaways (Q1)
1. **The craft books agree on fewer means, not better ones:** two or three heading levels; bold or italic, never both; caps only for less than a line and letterspaced 5–12%; space before rules, rules before boxes, a box last. [read: Butterick; quoted: Bringhurst, Tufte]
   - *For 2d12:* a note only: each card element can be checked against "could space or a rule do this instead of a box?"
2. **Small caps and old-style figures are the classic book signals, and both must be real.** Fake small caps (scaled capitals) are the "parody" Bringhurst names; text figures in running text and lining figures only with caps or in tables. [quoted, read]
   - *For 2d12:* a note only: the current `font-variant:small-caps` on Georgia (which has no small caps) produces the fake kind.
3. **Color is not emphasis at text size; one ink, and color for one job.** Butterick: black for text, multiple shades of one color over contrasting colors; Tufte CSS: greyscale for text, color reserved. [read]
   - *For 2d12:* a note only: a different bright color per trait word is the pattern both advise against.

---

## Q2. Serious against app-like: who says it explicitly

(next)

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

(more to come)

---

### Sources
- **Butterick:** [Practical Typography](https://practicaltypography.com/): [Typography in ten minutes](https://practicaltypography.com/typography-in-ten-minutes.html) · [Bold or italic](https://practicaltypography.com/bold-or-italic.html) · [All caps](https://practicaltypography.com/all-caps.html) · [Letterspacing](https://practicaltypography.com/letterspacing.html) · [Small caps](https://practicaltypography.com/small-caps.html) · [Headings](https://practicaltypography.com/headings.html) · [Rules and borders](https://practicaltypography.com/rules-and-borders.html) · [Tables](https://practicaltypography.com/tables.html) · [Color](https://practicaltypography.com/color.html) · [System fonts](https://practicaltypography.com/system-fonts.html) · [Centered text](https://practicaltypography.com/centered-text.html)
- **Bringhurst via Rutter:** [webtypography.net](http://webtypography.net/toc/): rules [2.1.2](http://webtypography.net/2.1.2), [2.1.3](http://webtypography.net/2.1.3), [2.1.6](http://webtypography.net/2.1.6), [2.1.7](http://webtypography.net/2.1.7), [2.2.1](http://webtypography.net/2.2.1), [3.2.1](http://webtypography.net/3.2.1), [3.2.2](http://webtypography.net/3.2.2)
- **Tufte:** [Tufte CSS](https://edwardtufte.github.io/tufte-css/) · [NN/g: Clutter in charts](https://www.nngroup.com/articles/clutter-charts/) · [Boxes and Arrows: Three lessons from Tufte](https://boxesandarrows.com/three-lessons-from-tufte-special-deliverable-6)
- **Reference matter:** [Merriam-Webster: Entries](https://www.merriam-webster.com/help/explanatory-notes/dict-entries) · [Definitions](https://www.merriam-webster.com/help/explanatory-notes/dict-definitions) · [Cross-references](https://www.merriam-webster.com/help/explanatory-notes/dict-cross-references) · [Functional labels](https://www.merriam-webster.com/help/explanatory-notes/dict-functional-labels) · [Wikipedia: Rubric](https://en.wikipedia.org/wiki/Rubric) · [MIL-STD-38784, p. 30](https://technicalmanualspecsstandards.emilspec.com/MIL-STD-38784/page30.html) and [p. 31](https://technicalmanualspecsstandards.emilspec.com/MIL-STD-38784/page31.html) · [Sibley: second editions](https://sibleyguides.com/ultfaqs/whats-different-in-the-second-editions-of-the-sibley-field-guides-to-eastern-and-western-birds/) (search summary only)

### Not covered yet
