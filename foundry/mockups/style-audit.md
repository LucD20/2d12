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

## Where the mockups stand
All generated by `style-build.mjs` (the dark sets come from the system's own rules, color by color; `style-dark.css` is the result, `style-tokens.css` the shared colors; the system loads neither).

| Step | Mockup | State |
|---|---|---|
| 1. Shared colors and type | `style-tokens.html` | **Approved** (the yellower Tier 2 kept) |
| 2. Action card | `action-card-dark.html` | **Approved** (dark, the type, the yellowish Tier 2); the light stamp added |
| 3. Chat cards | `chat-cards-dark.html` | The attack, Save and damage cards and the system messages made (drawn by the system's own functions), **approved** (three reviews applied; the word Guard colored) |
| 3b. The other chat messages | `chat-older-dark.html` | **Approved** |
| 4. Pick bar and Turn dock | `bars-dark.html` | **Approved** (the pick bar in the HUD's frame; the Turn dock redone) |
| 5. Pick window, roll dialog | `windows-dark.html` | Made; to review (the class window not drawn) |
| 6. The sheets | `npc-hud-sheet.html` (the one-page NPC sheet, done) | The PC sheet and the full NPC sheet not started |
| 7. The rest | | Not started |

## The order (accepted)

1. **Shared tokens, dark and light** (a block of variables at the top of system.css, no visual change yet): everything after it is cheaper. With it, **how dark is switched** (Foundry's theme setting or a system setting).
2. **Action card, dark** (the mockup is made).
3. **Chat cards, dark** (attack, Save, damage), then the older chat messages brought to the chat card's look (the biggest visible mismatch in play, since the chat is always open).
4. **Pick bar and Turn dock** to the HUD's dark look (small, and they sit beside the HUD).
5. **Pick window** (every prompt goes through it), then the roll dialog.
6. **The sheets** (the one-page NPC sheet first, as mocked; the PC sheet and the full NPC sheet when Lucas asks).
7. The rest: carousel, item windows, effect editor, Builder, Generate, encounter log.
