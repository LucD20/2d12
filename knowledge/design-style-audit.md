# Style audit: what in the system is not on par with the settled look (2026-11-12)

**Why:** Lucas, after the NPC-HUD mockups: "the chat card looks one way, the sheet another, the tooltips another". This lists every surface the system draws, what it looks like today, and how far it is from the settled direction. **Nothing here is applied.** The order at the end is a proposal.

**The settled direction** (`CLAUDE.md`; `npc-hud-brief.md` section 5; the tokens in `npc-hud.css`):
- Dark by default; the chat card's parchment is the light theme.
- A sheet is a printed stat block: a name plate in the rank's color, ruled lines of text, an Action under a header bar, the Tiers as three lines, Effects under a line.
- A bar of controls is the dark table look: a flat surface, a thin line, one filled square stamp for the thing clicked, outlined buttons for the rest.
- Cinzel only for a big title; Signika for everything read. No rounded pills, no boxes inside boxes, no spaced-out capital micro-labels.

**How this was made:** from `foundry/twod12/styles/system.css` (each surface's rules, backgrounds, corner radii, fonts) and the modules that draw them. I can't run Foundry, so nothing here was seen in the real interface; a surface may look different there than its rules suggest.

## The surfaces

| Surface (where) | Today | Gap | Size |
|---|---|---|---|
| **Action card** (opens under a row; `.twod12.acard.d2`, 129 rules) | Parchment, a navy frame with an inner gold line, amber Version buttons with a shadow | No dark set. The buttons are not the stamp. Structure is already close to the book look. **Mockup made: `action-card-dark.html`.** | S |
| **Chat cards: attack, Save, damage** (`.twod12.chat.cc`, 329 rules) | Parchment, the look Lucas likes; frequency pills with a 10 px radius in the first block, 3 px after | No dark set. Otherwise the reference. | M |
| **Older chat messages** (`.twod12.chat.action`, `.dmg`, `.rxmsg`, `.rx2`, `.savecard`, `.ticker`, `.initcard`, `.sysmsg`, `.sysline`; about 300 rules together) | Several generations: `#faeeda` cream with an amber line, a navy title bar (`sysCard`), `#5b6fd0` blue in `sysmsg`, green and red tints | Five or six palettes in the chat alone. No dark set. Radii from 3 to 14 px. | L |
| **Turn dock** (`.twod12-dock`) | Parchment card, a navy bar | No dark set; matches the Reactions card, not the chat card. | S |
| **NPC sheet, the current one** (`.twod12.sheet.ns`, 466 rules) | Navy and amber (`--np-*`), white tiles, 8 px and 6 px radii, round portrait | The farthest from the stat block. The one-page sheet replaces its Main view for those who pick it; this one stays as the full view. | L |
| **PC sheet** (`.twod12.sheet.pcs`, 493 rules) | Navy head, white and parchment cards, amber and teal accents, Cinzel on the open row | Its own palette (`--ps-*`). Light body, so no dark at all. | L |
| **Roll dialog** (`.twod12.rolldlg`, 176 rules) | The chat card's tokens (parchment) | Close to the reference; no dark set. | M |
| **Pick window and class window** (`.classwin`, `--cw-*`, 146 rules) | Navy, paper, an orange accent (`#e07a2f`), Alegreya-style caps in the mockup | Its own palette and accent color. The pick window is the system's standard prompt, so it sets the look of every choice. | M |
| **Pick bar, Line bar, Charge bar, targeting bar** (`.twod12-linebar`, `#twod12-targeting`) | Blue-black `rgba(20,24,32,.92)`, a gold line, 8 px radius, blue-grey buttons | Dark already, but cold blue where the HUD is warm brown; rounded. Inside the HUD (5c) it is redrawn; floating, it is not. | S |
| **Carousel** (the combat tracker; `#twod12-carousel`, 114 rules) | Navy and parchment cards, round portraits, `#6fa8ff` and `#ef9f27` accents | Its own palette (`--tp-*`), defined twice in the file. | M |
| **Item windows** (`.twod12.iwin`, 126 rules; `.application.twod12-styled`, 117) | Cream `#fffaf0`, navy `#1d2a44` | Light only; a third navy. | M |
| **Effect editor** (`.fr-tab`) | Parchment, navy, gold, plus purple, green and brown bands by rule kind | Light only; many band colors. | M |
| **NPC Builder tab** (`.nb`, `.twod12-builder`) | Light background, fixed dark text (CLAUDE.md warns about it) | Light only by construction. | M |
| **Generate window and card** (`.genw`, `.genact`, `.twod12-gencard`) | White and navy, 9 and 10 px radii | The roundest surfaces in the system. | S |
| **Encounter log** (`.enclog`) | `#ece0c6` parchment, Cinzel | Light only. | S |
| **Effects panel on the canvas** (`#twod12-effects`) | Dark `#1e1b16` with tan lines | Already close to the dark page. | S |
| **Tooltips, zone tips, light labels** (`.twod12-zonetip` and others) | Dark, with the light-on-dark Attribute colors | Close; the Health tooltip still says Body / Mind (pack HP). | S |
| **Foundry default windows still in use** (`DialogV2` in 20 modules) | Foundry's own look | Against the "no Foundry default windows" rule; the list is in `foundry-backlog.md`. | L |

## What repeats (the real causes)

1. **No shared tokens.** There are at least nine palettes with their own variable sets: `--np-*` (NPC sheet), `--ps-*` (PC sheet), `--cc-*` (chat cards, defined twice), `--cw-*` (class window), `--tp-*` (carousel, defined twice), `--sk-*` (styled windows), `--nb-*` (Builder), `--fr-*` (effect editor), `--rd-*` (roll dialog). Navy alone is written as `#1e2a3a`, `#1b2433`, `#1d2738`, `#1d2a44`, `#1b2a41` and `#1e2a3b`.
2. **No dark set anywhere on a light surface.** The file has no theme rules at all: the dark surfaces (the bars, the effects panel, the tooltips) are dark always, the light ones light always.
3. **Three ideas of "the button you click to use an Action":** the amber button with a shadow (Action card), the navy round-cornered dice button (sheets), the dark brown button (chat card). The mockups settle on the square stamp.
4. **Corner radii from 0 to 14 px**, and round portraits on the sheets against square ones in the stat block.
5. **Cinzel in running interface text** (card names in the chat, Tier labels at 12 px, the dock) where the direction keeps it for a big title.

## Lucas's decisions (2026-11-12)
- **The order below is accepted.** **Mockups first, all of them: nothing is applied to the system until every step is mocked and approved.**
- **Dark or light is a setting of the system** (not Foundry's theme setting). In the mockups the class `.twod12-dark` stands for it.
- **The dark Action card is approved**, with the cost stamps. **The sheet's type goes on the cards too** (Signika for names and labels, Cinzel only for a big title), on both themes.
- **Tier 2 is more yellow** (still a green, toward yellow), everywhere: `#cbd86e` on dark, `#5d6e10` on light.

- **A STYLE CHANGE ONLY (Lucas, 2026-11-12, "very important"): no element is added, moved or removed on any existing surface.** Colors, type, lines, corners and the shape of a button change; what a card or a window holds does not. The one new thing is the HUD (and the one-page NPC sheet planned with it).
- **Second review of steps 2 and 3:** the dark Action card is good. On the chat cards: Tier 2 on light made a fuller yellow-green (it was washed out); on dark, Tier 1's red and the frequency pills (Encounter, At-will, Round) made deeper; the Save row's Tier and range text made white on its band; the damage card's pool lines were black on dark (a button's default text color), fixed. **The system messages (sysCard, sysLine) take the chat card's look on both themes:** no navy header, no orange line, no Cinzel. **The light theme takes the cost stamp too** ("if it is helpful").

- **Third review of step 3 (the chat cards):** on dark, the ladder's unlit ranges were unreadable (Tier 3 most): every segment now has its own light ink, lit or not. **AP is the AP blue wherever it is written** (it was plain inside a system card's text), and the system card's AP mark is the same blue (it was grey in the first redraw, periwinkle today). **A Guard line's shield is the Guard blue** (`#2f6fb3`, the color the Turn dock already gives Guard). The "Guard" card on the page was a sample I had invented: the system's real Guard messages are lines that already carry a shield, and the page shows those now.
- **Open, Lucas's call: the word "Guard" in its color.** Not colored in the book or the chat today (only in the Turn dock). It needs the text highlighter to learn the word (as it knows Boon, Bane and AP), and the book could take the same color. Mocked at the end of `chat-cards-dark.html`.

- **The chat cards page is approved, and the word "Guard" takes its color** (Lucas, 2026-11-12: "I like the proposed"): the Guard blue (`#2f6fb3`; `#7fb4ee` on dark). In the build: the text highlighter (`config.mjs highlightText`, the one that colors Boon, Bane and AP) learns the word; **the book taking the same color is a book change, to confirm with him** (text colors come from `CLASS_TOKEN` in build_rules.py).
- **Step 3b made (`chat-older-dark.html`):** the Reactions card (waiting, resolved, the "used" bar), the initiative card, the follow-up lines, the area damage card and the End of Turn line, all drawn by the system's own functions, in the chat card's look on both themes: bands in the place of the navy bars, no orange line, Signika in the place of Cinzel, "Damage" as the stamp and the other buttons outlined. Not drawn (only Foundry can): an Action or item sent to the chat, the old single-target damage card, the Save prompt; their rules are in the dark set.

- **Review of 3b, the tokens and the bars (Lucas, 2026-11-12):** the Reactions card, the End of Turn line and the tokens page are **good**.
  - **Initiative card:** the ornament line under the title is hidden; "Initiative" is centered on a band, like the Reactions card's header.
  - **Area damage:** he found the card bare. **The card I had drawn (`dmgcard.mjs multiDamageHtml`, four buttons under each name) is no longer posted by anything in the system** (`postMultiDamageCard` has no caller; only old messages still update through it). The real area damage is the damage message of `chatcards.mjs` with a group per Tier and a row per creature; the page shows that one now. **For the build: the old card's code and rules can be retired** (after checking no world still holds such messages).
  - **Pick bar:** yes, with the HUD it never floats: the HUD asks (5c). The bars page shows it in the HUD's frame; the Line, Charge and Setup bars follow. The floating bar stays only as "today".
  - **Turn dock:** neither version fitted. Redone as the same piece as the Reactions card and the End of Turn line (the header band, the type, the frame), dark and light.
  - **Tier 2, a test: more yellow again** (`#e0d65a` on dark, `#6f6800` on light; the ladder's lit segment `#7d7414` / `#e4dd80`). To confirm or pull back.

- **Steps 3b and 4 approved** (Lucas, 2026-11-13: "all seems good now"): the initiative header, the real area damage message, the pick bar inside the HUD, the Turn dock, and the yellower Tier 2 (it stays).
- **Step 5 made (`windows-dark.html`):** the pick window (a choice, a confirmation, a review) and the roll dialog (Smite, 2 AP, one target), drawn by the system's own functions. The header is a band in the place of navy, the accent gold in the place of the class window's orange, the titles Signika, the confirming button the stamp, on both themes. The class window itself (the level-up picker) is not drawn: it needs an actor and its class; it shares these rules.

- **Review of step 5 (Lucas, 2026-11-13):** the pick window's options are separate outlined buttons that never wrap their words (they were a joined strip that broke "Regrip to two hands (1 AP)" over two lines); **the chosen option has no check mark** (the fill says it; the button keeps its width). **Two small code changes come with it, both in `pickwindow.mjs`:** the window's text goes through the highlighter (`highlightText`: Banes, Boons, AP, the traits in their group's color; today `sub` is escaped plain text), and a section with no title draws no heading (today the empty `<h2>` leaves a bar and a line at the top: the "weird bar"). They are the two exceptions to "style only" on this page, both asked by him.

- **A single choice is click and done (Lucas, 2026-11-13):** the pick window's one-of-several choice (`pickwindow.mjs pickOne`) is a list of full-width options; a click picks and closes. No Confirm, only Cancel. A behavior change he asked for, the third exception to "style only" on this page. Windows with several things to set (`pickKeepRemove`, `pickWith`) and confirmations (`pickConfirm`) keep their Confirm.

- **Step 5 approved (Lucas, 2026-11-13).** **Step 6, the sheets, waits for the sheets' real HTML from his Foundry** (the PC sheet and the full NPC sheet are drawn by Foundry from templates of about 500 lines each and a model that needs a live actor; a hand copy would not be exact, and this is a style change only). Asked for: each sheet's HTML copied from the browser's tools, and a screenshot. Meanwhile: the Start of the Encounter card added to `chat-older-dark.html`.
- **Can only be judged in Foundry (no card of their own, or Foundry draws them):** a plain Check or Save in the chat, an Action or item sent to the chat, the old single-target damage card, the Save prompt, the class window.

- **Step 6, the PC sheet, made from its real HTML (2026-11-13).** Lucas copied the sheet's HTML from Foundry (Durgan, level 1, out of combat, every tab): `foundry/mockups/samples/pc-sheet-durgan.html` (tooltips, aria labels and ids left out). `pc-sheet-dark.html` draws it with the system's own rules at the sheet's size (900 px), three times with live tabs: dark (one warm dark page; the navy family converted by the generator; "Use" the stamp), light (today's layout with the stamp's warm dark brown in the place of navy, gold for amber, square corners, Signika headings; Cinzel stays on the name), and today. His window was 629 px wide: at that width the Action rows' columns don't fit (Use is cut off), today too; noted, not changed.
- **Still needed from Lucas for step 6:** the same copy of the full NPC sheet, and of the PC sheet in combat (the AP, Guard and Escalation strip) if he wants that part judged.

- **The PC sheet's groups are not boxed tables (Lucas, 2026-11-13):** "Once per round", "Reactions", "Level 1" and the others were each a framed card with a filled header and a gap to the next, which read as tables and cost height. Now a heading on a rule (its dot a small diamond in the group's color), rows on hairlines, 4 px to the next group. Same elements.

- **The light PC sheet had leftover blue (Lucas, 2026-11-13):** I had changed only the sheet's main variables; its tiles, tracks, chips, borders and blue-grey text had their navy written directly in the rules. The light set now turns every navy-family color warm (generated, like the dark set). **Kept blue on purpose, because it is a meaning and not chrome:** Resolve, the "Once per round" frequency, the Mind Wounds box.

- **PC sheet, three fixes (Lucas, 2026-11-13):** "+ Add" on the side panel is an outlined button (it was a white bar); the Species and Class chips wrap to a second line (the sixth was cut off at the card's edge, today too: `.ps-chips` is `nowrap` with `overflow: hidden`); the grey group diamonds (Level 1, Next levels) take the gold.

- **Step 6b, the full NPC sheet, made from its real HTML (2026-11-13):** `samples/npc-sheet-standard.html` (a Standard NPC, out of combat), `npc-sheet-dark.html` (dark, light, today; live tabs). **The NPC sheet is the PC sheet's markup** (`twod12 sheet pcs npcs`, one template since v0.0.291), so the PC sheet's sets apply as they are; its own parts are the Builder tab and the Loot tab. On dark, a Builder row's color (written dark, for parchment) is lightened so the bars and names read.
- **A correction to this audit's table:** the "NPC sheet, the current one (`.twod12.sheet.ns`, 466 rules), navy and amber" row describes a sheet that no longer exists. `templates/actor-sheet.hbs` and the `.sheet.ns` rules (about 460) are not used by any sheet now (both sheets use `actor-sheet-pc.hbs`). **For the build: they can be retired**, after a check that nothing else uses those classes.
- **The generator keeps the system's cascade now:** each generated rule is written with `:where(.twod12-dark)`, so it has the weight of the rule it comes from. Before, the scope class made every generated rule heavier than the system's rules that color with a variable (the Builder's lit pips went grey). All the approved pages were rebuilt and checked: unchanged.
- **Open, Lucas's call:** the rank's color on the full NPC sheet's head (as the one-page sheet's name plate). Not drawn: it is a new decision.

- **The Builder's "Damage: Immune, Resist and Weak" block (Lucas, 2026-11-13: the line was broken, the add buttons poor; he wants the subtypes' colors and icons).** Two parts on `npc-sheet-dark.html`: (1) style only, in the sheets: the block's head in order (the title, its note, "+ Add" at the right). (2) **A proposal that changes elements, shown apart:** three lines (Immune, Resist, Weak), each entry a chip in its subtype's color with its icon (`config.mjs subtypeIcons`, `subtypeColors` on dark, `subtypeInk` on light); to add, a selector of twelve tiles in the place of the drop-down (second version, after his word that it could look better: each tile in its subtype's color with its icon above its name, the picked one filled; Slash, Blunt and Pierce get steel, bronze and grey-green in the place of one grey, which is new and his to accept), a stepper for the amount, and Resist / Weak / Immune buttons. If approved, the same chips would suit the side panel's "Damage Immune/Resist/Weak" and the one-page sheet's line.

- **The Immune / Resist / Weak block: version A picked (Lucas, 2026-11-13)**, the compact list (the icon in the subtype's color, the name in ink, the picked one underlined), over B (colored tiles). It changes the block's elements: an approved exception to "style only". Slash, Blunt and Pierce have their own tones in it (steel, bronze, grey-green; one grey in the system today): not objected to, to confirm.

- **Decided (Lucas, 2026-11-13):** the subtype chips (icon and color) go wherever Immune, Resist and Weak are written: the Builder, the side panel of both sheets, the one-page sheet's line. Slash, Blunt and Pierce keep their own tones (steel `#c3c9d1`, bronze `#b9a58c`, grey-green `#a9b8a4` on dark; `#4a5058`, `#5a4a36`, `#44513f` on light) in the place of one grey: **in the build this changes `config.mjs subtypeColors` / `subtypeInk` for those three, so the chat cards and Action cards follow.** **The rank's color stays off the full NPC sheet** (only the one-page sheet has it).

- **Step 6 approved (Lucas, 2026-11-13):** the PC sheet and the full NPC sheet, dark and light.
- **Step 7 (the rest) waits for each surface's real HTML from his Foundry**, as the sheets did: the carousel (the combat tracker at the top, with an encounter running), an Action's sheet (its Details tab), a weapon's or an item's sheet, an Effect's sheet, the Generate Action window, the encounter log, the class window, and the PC sheet in combat (the AP, Guard and Escalation strip).

- **Step 7 begun (2026-11-13), from Lucas's copies:** `samples/carousel-preparing.html` and `samples/action-sheet-smite.html`; the page `rest-dark.html` shows the carousel (an encounter being prepared) and an Action's sheet on its Details tab (the Action editor), dark, light and today. Carousel: Signika in the place of Cinzel, square corners, the bar's buttons outlined; dark cards on the dark page, light keeps the parchment cards with a warm dark bar. Item sheet: the warm dark head, headings on a rule in the place of the Cinzel gradient bars, gold for amber and maroon, the chosen option as the stamp, the yellower Tier 2. The same editor draws an Effect's and a Feature's sheet.
- **Lucas, 2026-11-13: "the trait color text in dark mode isn't great"** (white on the bright fills). In dark a trait chip of the editor is now outlined: the trait group's color as text and line, no fill (as the dark Action card writes traits). Light keeps the filled chips.
- **An Effect's sheet added** (`samples/effect-sheet-frightened.html`, an applied Frightened): same editor look. The hover-text panel: its name in bold Signika gold (was Cinzel), a band in dark; the head's "On ... from ..." line made readable on the dark head (today it is a dim grey there).
- **Lucas, 2026-11-13: "All good so far, but the carousel can use a better style; the Class details will need a big change."** He sent the rest of step 7's HTML (samples/: `carousel-round`, `generate-action`, `encounter-log`, `class-sheet-paladin`, `pc-sheet-aveline-combat`, `npc-sheet-ogre-combat`). Step 7 is now five pages:
  - `carousel-dark.html`: the carousel in a round and preparing, **two new looks to pick from**, beside the earlier one (C) and today's. **A, one table**: the HUD's table look, bar and creatures one flat strip, a round portrait at the left with the text beside it, the acting creature a lit column under a gold line. **B, medallions**: no card, the portrait stands on the map over a small dark plate (side under a line of its color, name, pips), the acting one larger in a gold ring. One dark look for both themes (it sits on the map with the HUD). The portraits stay round: the art is round token art.
  - `rest-dark.html`: the Action's, the Effect's and the **Class's** sheet. The Class's Details tab is a ruled form: small muted label over each value, fields on an under-line in one aligned grid, sections as headings on a rule, a level as a ruled line, a list as its Frequency's name in that Frequency's color with its Actions as plain links. **Build note:** the Frequency's color needs a class or `--fq` on each `.cls-grp` (the mockup adds it); the form's rules are scoped with `:has(.cls-h)`, a class on the tab would be cleaner.
  - `tools-dark.html`: the encounter log (a turn is a ruled block, no grey box; the round's heading in Signika) and the Generate Action window ("Create" is the stamp).
  - `combat-pc-dark.html`, `combat-npc-dark.html`: the two sheets during a round, from the rules of step 6, nothing new by hand.
- **Step 7 has every surface asked for except a weapon's or item's sheet.** Waiting: Lucas's pick of the carousel (A, B or C) and his word on the Class sheet.

## Where the mockups stand
All generated by `style-build.mjs` (the dark sets come from the system's own rules, color by color; `style-dark.css` is the result, `style-tokens.css` the shared colors; the system loads neither).

| Step | Mockup | State |
|---|---|---|
| 1. Shared colors and type | `style-tokens.html` | **Approved** (the yellower Tier 2 kept) |
| 2. Action card | `action-card-dark.html` | **Approved** (dark, the type, the yellowish Tier 2); the light stamp added |
| 3. Chat cards | `chat-cards-dark.html` | The attack, Save and damage cards and the system messages made (drawn by the system's own functions), **approved** (three reviews applied; the word Guard colored) |
| 3b. The other chat messages | `chat-older-dark.html` | **Approved** |
| 4. Pick bar and Turn dock | `bars-dark.html` | **Approved** (the pick bar in the HUD's frame; the Turn dock redone) |
| 5. Pick window, roll dialog | `windows-dark.html` | **Approved** (the class window not drawn) |
| 6. The sheets | `npc-hud-sheet.html` (the one-page NPC sheet, done) | The PC sheet (`pc-sheet-dark.html`) and the full NPC sheet (`npc-sheet-dark.html`) made from their real HTML; **approved** |
| 7. The rest | `carousel-dark.html`, `rest-dark.html`, `tools-dark.html`, `combat-pc-dark.html`, `combat-npc-dark.html` | All made, to review: the carousel has two looks to pick from; a weapon's sheet not yet sent |

## The order (accepted)

1. **Shared tokens, dark and light** (a block of variables at the top of system.css, no visual change yet): everything after it is cheaper. With it, **how dark is switched** (Foundry's theme setting or a system setting).
2. **Action card, dark** (the mockup is made).
3. **Chat cards, dark** (attack, Save, damage), then the older chat messages brought to the chat card's look (the biggest visible mismatch in play, since the chat is always open).
4. **Pick bar and Turn dock** to the HUD's dark look (small, and they sit beside the HUD).
5. **Pick window** (every prompt goes through it), then the roll dialog.
6. **The sheets** (the one-page NPC sheet first, as mocked; the PC sheet and the full NPC sheet when Lucas asks).
7. The rest: carousel, item windows, effect editor, Builder, Generate, encounter log.
