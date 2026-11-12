# Brief: the one-page NPC sheet and the HUD (planning done with Lucas, 2026-11-12; the mockups are made, section 5; nothing built)

**Why:** for playtesting, to make play faster. Running an NPC today means opening the sheet and moving between tabs. Lucas's references: the 4e alternate NPC sheet (a compact stat block), pf2e-hud (a persistent bar at the bottom) and Token Action HUD (categories, one click to use). **They are examples of what to do, not designs to copy.** pf2e-hud does a lot Lucas doesn't use.

**Next step: Lucas picks (section 5), then the build.** The mockups (listed in section 4) are made, drawn from the book's Stage 0 numbers (the Bestiary's example NPCs) and pack HP's Health model, since those are the targets. Build after "Stage 0 in Foundry" (MASTER-PLAN section 3, item 6). The Bestiary's turn budget pack changes what an NPC Action carries (riders, forced movement, Reactions, Setup), so the Action line's format is checked against it before building.

## 1. Decisions (Lucas, 2026-11-12)

### The one-page NPC sheet
- **A second NPC sheet, for experienced GMs. The current NPC sheet stays** (it's the full view). Both are registered: each NPC can switch between them in Foundry's sheet settings, and a world setting picks which one new NPCs get (default: the current sheet).
- **One page** means the Main view has no tabs and holds the whole stat block. It scrolls if needed. It isn't for printing.
- **Tabs for the rest:** Main / Build (the Builder) / Effects / Notes.
- **Layout, like the 4e alternate sheet:**
  - a short header: name; rank, role, CV and level on the right
  - one dense block: Health, Defenses, Speed, Resist / Weak
  - the Actions, grouped by when they happen: Basic, Special (by AP), Reactions, Escalation
  - empty groups hidden; each group has a colored band in the system's AP / Kind colors
  - Attributes and Modifiers at the bottom
  - small edit and delete icons on each row
- **How an Action is written: two mockups to pick from.**
  - (a) Full text with the Tier table.
  - (b) The Bestiary's one line ("*Cleaver* (Basic attack): 1 + 1d4 / 2 + 1d6 Sl"), with the Action card on right-click.

### The HUD
- **One HUD for PCs and NPCs, in one look.**
  - **NPC:** a "temporary sheet". No categories: its Actions, Reactions and Escalation abilities are all visible at once as rows of Version buttons.
  - **PC:** categories, opened with a click; hover is a later option to test.
  - **Elites:** they may need categories; the mockups decide.
- **Categories (PC):**
  - Actions (Basic, Special)
  - Reactions
  - Escalation
  - Hands and Gear (draw, switch, drop)
  - Checks and Saves
  - Conditions and Effects
  - Utility (Rally, Rest, Breather, Guard)
  - No toggles row for now.
- **What it shows:**
  - the name, on both
  - a portrait: the same for PC and NPC, with or without it; both are mocked up
  - **No Health, AP, Guard or uses.** The Turn dock and the token bars show those.
- **Clicks:**
  - **A Version button opens the roll dialog on that Version** (modifiers matter in this system).
  - A per-player setting, **"Skip roll dialog"**, rolls straight away with the defaults. Shift-click does the opposite for one roll.
  - **Right-click opens the Action card.**
  - No hover cards and no Damage buttons: the damage comes from the chat card. Watch for clutter.
- **Which creature:** the HUD follows the **selection only**, not the combat.
  - One token selected: its HUD.
  - **Several selected:** a list of the selected tokens in the HUD's space; a click selects that token alone and opens its HUD.
  - **Nothing selected:** a player sees their assigned character; the GM sees an empty, slim bar (so the layout doesn't jump).
  - Minions get no special case.
- **Placement: across the bottom of the screen, pf2e-hud style, with Foundry's elements moved around it.**
  - **The hotbar** becomes a short row inside the HUD (macros one click away).
  - **The players list** moves above the HUD's left end, **collapsed by default**, so it doesn't cover Foundry's own controls.
  - **The pick bar** (pickbar.mjs: the bottom bar for choices on the map, such as who gets the Guard, the Push picker, the Line and Charge bars): opens over the HUD while a choice is waiting and gives the space back when done. *Default, to confirm with Lucas.*
- **Out of scope:**
  - token hover tooltips (Lucas uses Token Tooltip Alt; later, maybe)
  - pf2e-hud's other parts (party, dice, time, tracker)
  - radial menus near the token

### Rules that apply
The system's look for everything (sysCard / sysLine, pick windows, the pick bar's look); no Foundry default windows (CLAUDE.md).

## 2. Architecture
**One display model, three outputs.** A single pure, testable NPC model would feed the one-page sheet, "Post stat block" in the chat, and the HUD's NPC layout. It would hold:
- rank, role, CV, AP
- ratings, Health, Defenses, Speed, Resist / Weak
- the Actions by group with their Versions, the Escalation abilities, uses left

That way an Action line looks the same everywhere.

## 3. Open points (for the mockups, not blocking)
- The pick bar over the HUD (section 1, default above).
- Elites: flat like an NPC, or with categories like a PC.
- The HUD's height, and how many Version buttons fit a row before it wraps.

## 4. Mockups to make
1. The one-page sheet, (a) full text and (b) one line, with the Orc Warrior and the Ogre Chieftain (Elite).
2. The HUD for an NPC (the Goblin Sneak, the Ogre Chieftain), with and without a portrait.
3. The HUD for a PC (the Paladin), the categories opened by click, with and without a portrait.
4. The HUD with several tokens selected (the list), and the GM's empty bar.
5. The bottom of the screen: the HUD with the hotbar row, the players list collapsed and open, and the pick bar over it.

## 5. The mockups (pack-npc-hud-mockups, 2026-11-12): what they settle and what Lucas still picks

**The files** (static HTML, open them in a browser; nothing is built in the system):
- `npc-hud-sheet.html`: mockup 1 (the one-page sheet, the Orc Warrior and the Ogre Chieftain, (a) and (b) side by side, the right-click Action card).
- `npc-hud-hud.html`: mockups 2 to 4 (the NPC's HUD, the Elite flat and with categories, the width test, the Paladin's categories, the list, the empty bar). The first Paladin bar is live: click a category.
- `npc-hud-screen.html`: mockup 5 (the whole screen: the HUD with the hotbar, the players list closed and open, the pick bar over the HUD and floating above it).
- They are generated: `node foundry/mockups/npc-hud-build.mjs` (the data and the drawing), `npc-hud.css` (the new look), `npc-hud-icons.mjs` and `npc-hud-signika.mjs` (Font Awesome paths and the Signika font, embedded). **Each page is self-contained** (the system's `system.css`, the fonts and small copies of the art are embedded at build time), so it opens anywhere, outside the repo too; run the build again after a change to the system's CSS. The Action card, the Turn dock and the pick bar are the system's real markup (`pickBarHtml`, `dockHtml`).
- **The build script's `NPCS` objects are a first draft of section 2's display model**: the sheet's rows, the HUD's buttons and the card are all drawn from them.

### What the mockups propose (each is marked "Proposed" on the pages; the other option is beside it)
1. **The Action line: (b) one line**, as the Bestiary writes it, with the amber Version button in front; the full text is the right-click Action card. (a) is about a third taller for the same creature (the Orc Warrior's whole sheet: about 700 px in (a), 530 in (b)).
2. **The Elite: flat**, like any NPC. The book's Elite has 3 Actions and uses a third of the row. Categories would hide three Actions behind three clicks.
3. **The HUD's height: 60 px, two lines** (a small group name over the buttons), the same for an NPC, a PC, the list and the empty bar, so nothing ever jumps. **It wraps upward when it must.** Measured: on a 1600 px screen (1276 px for the HUD) one row holds 7 one-Version Actions plus the Saves; on a 1366 px laptop (1042 px), about 5. A made-up Elite with 9 Actions takes two rows at 1600 and three at 1366. No creature in the book wraps.
4. **The portrait: shown.** It costs 53 px of width and no height, and it says which token is selected. (A per-user setting to hide it is cheap, if wanted.)
5. **The pick bar takes the HUD's place** while a choice waits (the brief's default), and gives it back when done. The alternative (floating above a dimmed HUD) covers a strip of the map.
6. **The hotbar: two rows of five** at the HUD's right end, with the page arrows (one row of ten in the slim variant).
7. **The players list:** a closed pill above the HUD's left end (colored dots for who is online); it opens upward.

### Added by the mockups (not in the brief; each can be dropped)
- **Used and locked Actions are dimmed** (a used Encounter Action's button is struck, an Action above the creature's Escalation is dashed with a lock). It shows no counters, so it keeps "no uses".
- **An NPC's HUD ends with four small Check / Save buttons** (Body, Mind, Appeal, Instinct), since an NPC rolls Saves often and has no categories to find them in.
- **An Elite's Escalation pips** sit on the Escalation group's name, in the HUD and on the sheet's band (the sheet also lists the ladder: 2, 4, 6).
- **The sheet's stat block shows pack HP's model:** one HP bar, the Vigor and Resolve gauges (below 0 in red), Bloodied / Strained as a tag.
- **The PC's Actions panel has three columns:** Special, Basic, Movement (the brief said Basic, Special).
- **The sheet's "Special (by AP)" is one band sorted by AP**, not one band per AP.
- **(a) turns a one-Version Action's Tier table on its side** (three cells in a row); an Action with several Versions would use the card's real table.

### Lucas's review (2026-11-12), applied to the mockups
- **The sheet: (a) full text, with the Tier table. Decided.**
- **The HUD: the proposals are liked** (the pick bar's look, the Elite flat, the portrait, two lines), with three changes, all redrawn:
  1. **No free wrap** (the 1366 px test was chaotic and counter-intuitive). A bar that doesn't fit one row becomes **one row per group**, in the sheet's order, the group names in a column and the Check / Save buttons kept on the right. The made-up 9-Action Elite is 4 rows (173 px) at 1366.
  2. **The PC's bar:** a **Quick row** on top (the Actions the player pins; right-click an Action to pin or unpin, as the sheet's Favorites), the categories under it. **Actions, Basic Actions and Reactions are three buttons** (no single Actions button). **A place is kept for Skills** (dashed, "later"). The nine buttons fit one line at 1600 px; they have no counts.
  3. **5c (the pick bar in the HUD's place) looked bugged:** redrawn. The HUD keeps its frame (who is asking on the left, the hotbar on the right); only its middle becomes the pick bar's question and buttons, with a gold glow.
- **The height is now 70 px for every HUD** (the PC's two lines set it; it was 60).

### Lucas's second review (2026-11-12), applied to the mockups
- **The PC's bar looks good.**
- **The NPC's bar was too big: it takes exactly what the PC's takes.** Redrawn in the PC's frame: two lines, 70 px, always. Line 1 is its attacks (Basic, Special); line 2 the rest (Reactions, Escalation, Checks and Saves). It never grows: on a line that is too full, the four Check / Save buttons first become one button, then the last Actions fold into a "+N more" button (a panel, as a PC's category). **This replaces "one row per group" above and the slim variant (both dropped).** Measured: the made-up 9-Action Elite shows all 9 at 1600 px, and 7 with "+2 more" at 1366 px; every creature of the book shows everything at both.
- **Favorites: right-click -> Favorite, on an Action or on a single Version.** The Quick row shows only the favorited Versions (Smite 1 AP / 2 AP, not 1 / 2 / 3).
- **5c was not what Lucas saw:** his viewer showed the page cut off (two carousel portraits, no tokens, no sidebar, no HUD). The likely cause is the page's weight (1.2 MB with the whole system CSS and every picture repeated); the pages now embed only the rules they use and each picture once (about 320 to 420 KB). Not confirmed on his side yet.

### Lucas's third review (2026-11-12): the chat card is the design's base
- **"Much better."** The NPC's bar in the PC's frame stays.
- **The design had diverged** (the chat card one way, the sheets another, the tooltips another). **Lucas prefers the chat card's style** ("serious", "grounded", a table feel) **and it is the base from here on.** The full sheets don't change yet; the HUD and the one-page sheet start it.
- **Applied to the mockups** (npc-hud.css, "THE TABLE LOOK"; the tokens are the chat card's, `.twod12.chat.cc` in system.css): parchment #f4ede0, a thin tan line #bfae8c, ink #2a241d, Cinzel for names and numbers, gold #b07a12 for stars, diamonds and the active tab, **a Version is the card's dark brown primary button (#3b3128)**, everything else an outlined button, small square frequency pills.
- **Group names are all one color** (his note: Basic green and Special blue read as frequencies). On the sheet they are the card's divider (a gold diamond, small capitals, a gold line); in the HUD, small grey capitals. **A frequency's color is only on a row's left edge and on its pill.** This answers pick 7 (the band colors).
- The dark pick bar (pickbar.mjs) is still today's in 5d; inside the HUD (5c) its buttons are drawn as the card's.

### Lucas's fourth review (2026-11-12): dark by default, easier type; 5c and the dimming decided
- **Dark is the default theme** (the most common, and the one Lucas uses). The mockups are remade dark: a warm near-black surface (#211d18), a thin line, light ink (#efe6d3), gold accents; **the primary button inverts** (a light parchment fill with dark text, since a dark fill disappears on a dark surface); the frequency and Attribute colors are lightened to read on dark. The light set is the chat card's own parchment tokens. Both sets are the `--t-*` variables in npc-hud.css; each page has a Dark / Light switch at the top.
- **The font wasn't easy to read.** Lucas didn't say which; I read it as Cinzel (small capitals for names, numbers, tabs and group names). **Cinzel is now only the sheet's big name**; everything else is Signika, a little larger. To confirm with him.
- **The PC's categories are words only** (the icons cost 150 px and the larger type no longer fitted one line).
- **5c is decided:** the HUD asks the question (it keeps its frame; its middle becomes the pick bar's question and buttons). 5d is not picked.
- **The dimming of used and locked Actions is decided: keep.**
- Not redrawn dark: the right-click Action card and the chat cards (the system's real ones, parchment today). A dark set for them comes with the build, if Lucas wants it.

### Lucas's fifth review (2026-11-12): a book feel, not an "AI feel"
- **The font is fine now** (Cinzel only on the sheet's name). **A dark set for the chat cards and the Action card: likely yes, later** (foundry-backlog).
- **The look had an "AI feel"** (Lucas): an interface kit of rounded chips, boxes inside boxes, colored side stripes and spaced-out capitals. **He wants a book feel**, like the 4e sheet he showed in the planning session. `npc-hud.css` is rewritten whole as **THE BOOK LOOK**; the mockups are a printed stat block now, dark by default (a page at night), with the parchment page behind the Light switch.
- **What it takes from the books** (from what I know of them; no web search, and I never saw his 4e screenshot, which was not in this session):
  - **D&D 4e:** a colored header bar with the name on the left and the rank and level on the right; group names as bands across the page; every other row shaded; the usage word at the end of a power's line, in its color.
  - **D&D 5e:** ruled lines in the place of boxes; the ability scores as a ruled table.
  - **D&D 3.5 and Pathfinder 1:** section bands in small capitals; stats as running text.
  - **Pathfinder 2e:** bold run-in labels ("**Vs.** AD; **Distance** Melee; **Target** One creature"), text separated by semicolons, traits in a parenthesis.
  - **Draw Steel:** the three Tier results side by side under the power's line.
  - **Lancer:** square corners and hard edges; nothing rounded.
- **On the sheet:** a maroon name plate (#6e2318, the book's heading color); Health, Defenses and Speed as lines of text with thin bars; an Action as lines of text (a cost stamp, the name, the traits in italics, the frequency word at the right in its color), then the Tiers; the Attributes and Modifiers as a ruled table.
- **In the HUD:** the same name plate on the left; an Action is a line of text (a small diamond in the frequency's color, the name, its cost stamps), not a chip; the PC's categories are words on a line (small capitals, a hairline between them, the open one underlined in gold); a category's panel is a sidebar box with a band for its title and dotted leaders to the stamps.
- **The one clicked thing is the cost stamp** (a square tab: light on the dark page, dark on the parchment).

### Lucas's sixth review (2026-11-12): the HUD reverted, the sheet's bottom redone, a color per rank
- **The HUD goes back to the dark table look of the fourth review ("it was fine").** The book look is for the sheet only. `npc-hud.css` is the fourth review's file again, with one block added at its end for the sheet (scoped to `.ops`). **This overrides "In the HUD" in the fifth review above.** One thing the HUD takes from the sheet: the portrait's ring is in the rank's color.
- **The sheet's top part is fine** (the name plate, the tabs, the stats as ruled lines): kept.
- **The sheet's bottom had too much "AI feel" and was less intuitive.** Redone:
  - a group's name is a heading on a rule (gold small capitals), not a filled band;
  - **each Action starts with a header bar in its frequency's color** (as 4e shades a power's header), so it is plain where one Action ends and the next begins; the frequency word is at the bar's right;
  - **the Tiers are a ruled table** (lines on every side, a header row with the Tier names);
  - **the Attributes and Modifiers are tiles again**, as in the fourth review ("looked better before").
- **The name plate has one color per rank** (Lucas: "a good idea"), as 4e colors its monsters: Minion slate (#4d545c), Grunt olive (#4b5a26), Standard maroon (#6e2318), Elite purple (#4f2c69). The colors are my pick; the sheet page shows the four.

### Lucas's seventh review (2026-11-12): no Tier table; a tint behind the whole Action; the rank colors are good
- **The rank colors are decided** (Minion slate, Grunt olive, Standard maroon, Elite purple).
- **No table for the Tiers** (it looked worst on Rally the Tribe, a description-only Action). **The Tiers are side by side again, made clearer:** each under a thick rule in its Tier's color, the Tier's name in that color, the result under it. **This replaces "the Tiers are a ruled table" in the sixth review.**
- **A faint tint of the frequency's color fills the whole Action**, under the stronger header bar (his idea, from the background of the not-picked one-line mockup): Rally the Tribe is a blue bar over a darker blue body.
- **The layout must hold every kind of Action** (Lucas): a description-only Action is its bar, its rules line and its text, with no Tiers; **an effect on Tier 2 and Tier 3 both is written once under the Tiers ("Tier 2+ Prone.")**, not in each cell; an effect on one Tier stays in that Tier's cell (Ground Slam's Prone on Tier 1).

### Lucas's eighth review (2026-11-12): "Effects", and five ways to draw the Tiers
- **"Much better."** The tint behind the whole Action and the side-by-side Tiers stay.
- **I had misread "Tier 2+":** it is not a line of its own. It is the Action's **Effects** (the card's Effects block, such as Smite's Bright light): **named "Effects", in its own color (gold), under a horizontal line, after the Tiers.** A description-only Action has only its Effects. An effect of one Tier only stays in that Tier. **This replaces "Tier 2+ Prone." in the seventh review.**
- **The Tiers could be more intuitive: Lucas picks one of five** (the sheet page, "The Tiers: five ways"; the sheets use A until he picks):
  - **A.** Columns under a thick rule in the Tier's color (today's).
  - **B.** Three lines, the Tier's name in a column on the left (4e, Draw Steel).
  - **C.** The chat card's ladder: the names in three joined colored segments, each result under its segment.
  - **D.** One line, a numbered square before each result (the shortest).
  - **E.** Tinted cells under a thin rule.

### Still for Lucas to pick (after the reviews)
1. ~~(a) full text or (b) one line~~: (a), decided.
2. The portrait: shown, hidden, or a per-user setting.
3. ~~The HUD's height~~: 70 px, two lines, the same for PCs and NPCs (decided by the second review).
4. The Elite: flat (proposed) or categories.
5. ~~The pick bar~~: in the HUD's place (5c), decided.
6. Keep or drop: the NPC's Check / Save buttons. (The dimming: keep, decided.)
7. ~~The band colors~~ (answered by the third review: one color for every group name). Before: Basic green and Special blue (the At-will and Round frequency colors), Reactions navy (the Reactions card), Escalation amber. Each row's left edge is its own frequency's color.
8. The PC's Escalation category: Passives listed as text beside the Actions (proposed), or only the Actions.
9. ~~The empty bar~~: at the HUD's height (the slim variant is dropped).

### To check before the build
- The Action line against the Bestiary's turn budget pack (riders, forced movement, Setup): the one line has room for "and Prone"; a long rider wraps to a second line (the Ogre's Ground Slam takes three).
- The Paladin's panel uses today's cards; the Stage 0 class cards may change what the categories hold.
- Not tried in Foundry: how the HUD sits with Foundry V14's own bottom elements (the hotbar and the players list are moved by the system; the mockup's screen is a stand-in).
- Whether 5c's redraw is what "bugged" meant (Lucas didn't say what looked wrong; the first version replaced the whole HUD with a stretched bar).
- Whether the book look is close to the 4e sheet he had in mind (send the screenshot again to compare).
- ~~The Tiers' drawing~~: **B, three lines (Lucas, 2026-11-12). Decided; the sheets use it.**
