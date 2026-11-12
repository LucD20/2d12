# Brief: the one-page NPC sheet and the HUD (planning done with Lucas, 2026-11-12; NO mockups yet, nothing built)

**Why:** for playtesting, to make play faster. Running an NPC today means opening the sheet and moving between tabs. Lucas's references: the 4e alternate NPC sheet (a compact stat block), pf2e-hud (a persistent bar at the bottom) and Token Action HUD (categories, one click to use). **They are examples of what to do, not designs to copy.** pf2e-hud does a lot Lucas doesn't use.

**Next step:** the mockups (listed in section 4), drawn from the book's Stage 0 numbers (the Bestiary's example NPCs) and pack HP's Health model, since those are the targets. Build after "Stage 0 in Foundry" (MASTER-PLAN section 3, item 6). The Bestiary's turn budget pack changes what an NPC Action carries (riders, forced movement, Reactions, Setup), so the Action line's format is checked against it before building.

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
