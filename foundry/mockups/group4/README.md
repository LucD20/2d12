# Group 4: the Inventory tab and the NPC's Loot tab (mockup)

Lucas, 2026-11-19: "the Items tab renamed Inventory and turned into a compact inventory, like PF2e / 5e; Generate Weapon and New Item become
links, like the NPC's 'Generate Action · Browse compendium'; then the NPC Loot tab in the same look."

**A mockup only: nothing in `foundry/twod12/` or `book/` changed.** The research behind it: `book/research/inventory-ui.md` (its "How it applies
to 2d12" is the starting point) and `book/research/gear-and-hands.md`.

- `index.html` (`group4.mjs`, `group4.css`): open it through a local server from the repository's root
  (`/foundry/mockups/group4/index.html?theme=dark|light`; the links at the top switch).
- **Today** is the system's own template (`templates/actor-sheet-pc.hbs`, the Items and Loot tabs) and CSS, as built in v0.0.454, with the tab's
  model built the way `actor-sheets.mjs` (`_prepareContext`) and `pcsheet.mjs` (`pcModel`, `lootRows`) build it; the rest of the sheet is
  `../sheets/model.mjs` with the build's fields (`../sheets/built.mjs`). **The proposal** is the same sheet with the tab's HTML replaced
  (drawn in `group4.mjs`, in the sheet's own classes plus `.g4-*` rules). The menus use the system's own models: `pcsheet.mjs handMenuModel`
  (the HUD hand tile's menu), `pickwindow.mjs pickWindowHtml` / `pwStepHtml` (the Give window), `sysmsg.mjs sysLine` (the chat line).
- Screenshots (2x, one a part, dark and light): `inventory-p1-dark.jpg` ... `inventory-p6-light.jpg` (each 0.3 to 0.8 MB).
  `node foundry/mockups/group4/shoot.mjs` remakes them (Playwright; `--1x`, `--out <dir>`).
- Creatures: Sylwen and Aveline (compendium PCs: `../sheets/actors.json`), the Orc Warrior. **Example data, added for the mockup:** Sylwen's five
  gear items (Rope, Torch ×3, Rations ×4, Waterskin, Spare bowstring ×2) and 34 coins; her Dagger sheathed (on her) and the Hunting Bow in her main
  hand, in combat (round 2, 3 AP); the Orc Warrior's loot (Hide Armor, 14 Coins, a Bone Charm, 2 Rations; its Cleaver is the compendium's); the
  "states" sheet (a Longsword held in one hand, an Unloaded Hand Crossbow, a dropped Spear, a Heavy armor beyond Medium training, a Leather
  Jerkin carried) is not a compendium PC.

## The parts

1. **Sylwen's Inventory, today and proposed** (540 × 840, the whole sheet).
2. **A line opened** (the Hunting Bow and the Rations).
3. **Where it is: the menu** (the Hunting Bow in hand, the Dagger on her, the armor); every state a line shows; an empty section (Aveline's Gear);
   the right-click menu on a gear line.
4. **Choice 1:** Where as a word and a menu (A) or three words (B).
5. **Choice 2:** the add links on one line (A) or under each section (B).
6. **The NPC's Loot tab, today and proposed** (540 × 760); Give…, today's window and the proposed one with How many; the chat line; an NPC with
   no items; a Loot line opened.

## The proposal in short

- **The tab is named Inventory.** Three sections, each a heading on a rule (the Actions tab's `ps2-band`) with its column words in plain small text
  at the right: **Weapons** (Damage · Mastery · Where), **Armor** (Defense · Where), **Gear** (Qty · Weight). **Every item is one ruled line**
  (two only when a warning needs a sentence).
- **The first line:** Coins (typed, as today) and the gear's total Weight on the left; **Generate Weapon · Browse compendium · New Item** on the
  right, in the NPC sheet's `ps2-links` style.
- **A weapon's line:** the name; its damage type and range in muted italics; the three Tiers' damage; its Mastery (n / 10); **Where**, one word
  (Main hand, Off hand, Both hands, On you, Dropped) on an outlined button that opens a menu.
- **The menu (A):** a weapon in hand gets the HUD hand tile's own menu (`handMenuModel`, unchanged: grip, change to, Stow, Drop, each with its
  Basic Action and cost; "free" out of combat; struck with its reason when the AP are short). A weapon on you or dropped gets one small new pure
  function's menu (`placeMenuModel` in `group4.mjs`): draw it into each free hand, or put the held one away and draw it (Interact, 1 AP; the
  `draw` and `chg` keys `applyHandPick` already runs), then Drop / Pick up at no cost (today's segment). Armor: the two other places, no cost.
- **A gear line:** the name, the start of its description in muted italics, the quantity with − and + (a click on the number types it), the line's
  weight.
- **A click on a name opens the line's detail under it** (the short card's place on the Actions tab: a tinted panel ending on the bronze rule).
  A weapon: its properties as the card's trait words; Range, the damage type, the Weapon Group; Weapon damage [W] Tier 1 / 2 / 3; Mastery and the
  Weapon Technique by name (locked or unlocked). Armor: category, Armor value → AD, Ward, trained or not. Gear: the full description, weight and
  cost each and for the stack. Every detail ends with **Send to chat · Edit · Remove**.
- **The Loot tab:** the same lines: the name, a muted note (weapon or armor "flavor"; gear its cost each), the quantity (gear: − and +), and one
  verb, **Give…**, an outlined button. Give… opens today's pick window with **How many** first when the stack is more than 1 (the pick window's own
  stepper; the whole stack by default); the chat line says how many.

## Options and recommendations

1. **Where it is: A, a word and a menu (recommended)** or **B, three words** (today's segment restyled: Dropped · On you · In hand, the current
   one underlined, one click). Why A: one line an item (B's 190 px push the damage and Mastery to a second line on every weapon and armor); it
   is the HUD's own menu, so the hands are set one way everywhere; it shows the cost before the click. B's only gain is one click less.
2. **The add links: A, one line at the top (recommended; the request)** or **B, under each section** (Generate Weapon · Browse compendium under
   Weapons, Browse compendium under Armor, New Item · Browse compendium under Gear). Why A: it is what was asked, the NPC's own line, and costs
   no height (it shares the Coins line); B adds three lines and repeats Browse three times.

## Decisions to ask Lucas

1. Choice 1 (Where): A or B?
2. Choice 2 (the links): A or B?
3. **A click on a name opens the detail**, not the item's window (that becomes the detail's Edit link and the right-click Edit). Right?
4. **Remove is no longer on the line** (today the gear lines have a trash icon): it is in the detail's links and the right-click menu, still asking
   first. Right, or keep a small trash on the line?
5. **The gear's picture is gone** (it sent the item to the chat; that is now Send to chat in the detail and the right-click menu). Keep pictures?
6. **Picking up a dropped weapon onto you, or dropping a sheathed one, costs nothing**, as today's segment. Should they cost an Interact (1 AP) in
   combat, as drawing does? (A rules question: Chapter 7's Interact.)
7. **Coins on an NPC:** the NPC has no Coins number (only the PC does), so the mockup's Orc carries "Coins" as a gear item, which Give… moves as an
   item, not into the PC's Coins. Should an NPC get a Coins number on the Loot tab, given to a PC's Coins with a count? (Not drawn.)
8. **Added to the Loot tab** (each can be dropped): the links Browse compendium · New Item, and the line's detail. Keep?
9. **Later, not drawn (from the research):** a defeated NPC's Loot opened to the players (pf2e's "lootable NPCs"); "Give all to…"; containers. Wanted?
10. **Browse compendium** opens the system's Weapons pack (the only equipment pack today; there is no armor or gear pack). An Equipment pack later?

## Assumptions I made

- The damage on a weapon's line is the three Tiers in the book's way (`0 / 1 + 1d4! / 2 + 1d4!`, `explode.mjs weaponTierText`), without the pool
  mark ([V]): every weapon's pool is Vigor today; the detail writes "Weapon damage [W]".
- Mastery on the line is "n / 10" (the Weapon Technique's step, `mastery.mjs TECHNIQUE_AT`, as today's "Mastery n / 10").
- The muted sub on a weapon's line is the damage type and the range (or Melee / Thrown); the Weapon Group and properties move to the detail.
- Gear's Weight column is the line's total (quantity × weight), as today; the Coins line's Weight is the gear's total, as today (weapons and armor
  have no weight in the data).
- The first row of the open menu is shown focused (the HUD focuses it on open).
- The NPC's note ("An NPC's items are flavor and loot…") is kept whole, in muted italics.
- In the Give window the count starts at the whole stack (today's result if the GM clicks a PC at once); the mockup shows it lowered to 5.
- The chat line after a partial give says what is left on the NPC ("(9 left)").

## What today has, and where it goes (nothing that works is lost)

**The Items tab (PC)**

| Today | Proposal |
|---|---|
| Tab "Items" | **Kept, renamed** "Inventory" |
| Generate Weapon button (`generateWeapon`) | **Kept as a link** on the first line |
| New Item button (`newGear`) | **Kept as a link** on the first line |
| — | **Added:** Browse compendium link (opens the Weapons pack) |
| Coins field (`system.coins`) and "Weight n" in the Gear header | **Moved** to the first line (same field, typed) |
| Weapon card: name opens the item (`openItem`) | **Moved:** the name opens the detail; Edit in the detail and the right-click menu |
| Weapon: sub line (group, properties, damage type, range) | **Kept:** damage type and range on the line; group and properties **moved** to the detail |
| Weapon: T1 / T2 / T3 boxes | **Kept** on the line as one text (`0 / 1 + 1d4! / 2 + 1d4!`); written out in the detail |
| Weapon: Mastery n / 10 | **Kept** on the line |
| Weapon: "Technique locked / unlocked" | **Moved** to the detail, with the Technique's name |
| Weapon: segment Dropped / On you / In hand 1H·2H (`setWhere`) | **Kept** as the Where button and its menu (A), or as three words (B) |
| Weapon: "Unloaded" chip that reloads (`reloadWeapon`; a hover text) | **Kept** as words under the line, "Unloaded. Reload (1 AP)"; the hover text goes |
| Weapon: amber "1H" chip (a Two-handed weapon in one hand) | **Kept** as the warning sentence under the line and the Where button in the warning ink |
| A dropped item faded | **Kept** |
| Armor: name, Trained / Untrained text | **Kept:** name and category on the line, "Untrained" in the warning ink; the training's words in the detail |
| Armor: "Armor value n → AD n · Ward +n" | **Kept:** "AD n · Ward +n" on the line, the Armor value in the detail |
| Armor: segment Dropped / Carried / Worn | **Kept** as the Where button and its menu (A), or three words (B) |
| Untrained warning box | **Kept** as a line in the warning ink under Armor |
| Gear: picture that sends to chat (`sendItem`) | **Moved:** Send to chat in the detail and the right-click menu; the picture **dropped** |
| Gear: name opens the item | **Moved:** to the detail's Edit (and right-click Edit) |
| Gear: quantity typed (`input.gq`) | **Kept:** − and + and a click on the number to type it |
| Gear: weight (line total) | **Kept** |
| Gear: cost (line total) | **Moved** to the detail (each and all) |
| Gear: pencil (`openItem`), trash (`confirmDelete`, asks first) | **Moved** to the detail's links and the right-click menu (still asks first) |
| Drag a row to reorder (grip icons; `itemOrder`) | **Kept** (the whole line drags); the grip icons **dropped** |
| Right-click on weapon and armor rows (Edit, Send to chat, Drop, Remove) | **Kept**, and **added** on gear lines (Edit, Send to chat, Remove) |
| Empty texts | **Kept**, one muted line each (no dashed box) |
| Drop an item anywhere on the sheet | **Kept** (unchanged) |

**The Loot tab (NPC)**

| Today | Proposal |
|---|---|
| The note "An NPC's items are flavor and loot…" | **Kept** (muted italics) |
| Grey header band "ITEM · QTY" (spaced capitals) | **Replaced** by the Inventory's heading on a rule ("Loot", Qty) |
| Name opens the item; the note (flavor / cost each); Qty | **Kept** (the name opens the detail, with Edit); Qty with − and + on gear |
| "Give to a PC" (`giveLoot`: pick window, the whole stack, chat line) | **Kept** as "Give…": the same window and click, How many first when Qty > 1; the line says how many |
| Right-click on a loot row (Edit, Send to chat, Drop, Remove) | **Kept** |
| "No items." and the dashed "Drag items here" box | **Replaced** by one line: "No loot. Drag items onto the sheet, or New Item." |
| — | **Added:** Browse compendium · New Item links; the line's detail |

## For the build (if approved)

- `templates/actor-sheet-pc.hbs`: the `items` tab's markup (renamed `inventory`) and the `loot` tab's; `pcsheet.mjs`: the tab's label, the rows'
  model (`dmgLine`, `whereWord`), a pure `placeMenuModel` beside `handMenuModel` (tests: a weapon on you, dropped, a Two-handed weapon, no free
  hand); `actor-sheets.mjs`: `toggleItem`, `whereMenu` (the HUD's menu code, opening down), `qtyStep`, `browseItems`, the gear lines in the
  right-click menu, `giveLoot` with a count (split the stack; the line "takes n …"). `system.css` and `node tools/build-theme.mjs`; the gallery
  is not concerned (no Action card changes).
- **No new hover texts** (t264): the Unloaded chip's hover goes; − and + carry `aria-label`s.
- Not reproduced here: Foundry's real context menu look (drawn in the sheet's menu look), dragging, typing a quantity, the item's own window,
  the menu out of combat ("free"), the dropped weapon's menu (described above), the Give window's stepper being live.
