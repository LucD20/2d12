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

## A proposed order (each is a pack of its own; Lucas decides)

1. **Shared tokens, dark and light** (a block of variables at the top of system.css, no visual change yet): everything after it is cheaper. With it, **how dark is switched** (Foundry's theme setting or a system setting).
2. **Action card, dark** (the mockup is made).
3. **Chat cards, dark** (attack, Save, damage), then the older chat messages brought to the chat card's look (the biggest visible mismatch in play, since the chat is always open).
4. **Pick bar and Turn dock** to the HUD's dark look (small, and they sit beside the HUD).
5. **Pick window** (every prompt goes through it), then the roll dialog.
6. **The sheets** (the one-page NPC sheet first, as mocked; the PC sheet and the full NPC sheet when Lucas asks).
7. The rest: carousel, item windows, effect editor, Builder, Generate, encounter log.
