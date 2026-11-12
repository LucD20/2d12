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

### Still for Lucas to pick (after the review)
1. ~~(a) full text or (b) one line~~: (a), decided.
2. The portrait: shown, hidden, or a per-user setting.
3. The HUD's height: 70 px two lines (liked), or the slim 40 px one line (no portrait, the hotbar in one row).
4. The Elite: flat (proposed) or categories.
5. The pick bar: in the HUD's place (proposed) or floating above it.
6. Keep or drop: the NPC's Check / Save buttons; the dimming of used and locked Actions.
7. The band colors: Basic green and Special blue (the At-will and Round frequency colors), Reactions navy (the Reactions card), Escalation amber. Each row's left edge is its own frequency's color.
8. The PC's Escalation category: Passives listed as text beside the Actions (proposed), or only the Actions.
9. The empty bar: at the HUD's height (proposed) or slim.

### To check before the build
- The Action line against the Bestiary's turn budget pack (riders, forced movement, Setup): the one line has room for "and Prone"; a long rider wraps to a second line (the Ogre's Ground Slam takes three).
- The Paladin's panel uses today's cards; the Stage 0 class cards may change what the categories hold.
- Not tried in Foundry: how the HUD sits with Foundry V14's own bottom elements (the hotbar and the players list are moved by the system; the mockup's screen is a stand-in).
- Whether 5c's redraw is what "bugged" meant (Lucas didn't say what looked wrong; the first version replaced the whole HUD with a stretched bar).
- The Quick row: how an Action is pinned (right-click, as the sheet's Favorites, is the mockup's guess), and whether an NPC's HUD needs one (no: all its Actions are already visible).
