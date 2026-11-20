# Group 2 (Lucas on v0.0.442, 2026-11-19): hands and dual wielding

**A mockup only: nothing in `foundry/twod12/` changed.** Each part draws today's screen (v0.0.443, the system's own code and CSS) beside the
proposal, dark and light.

- `index.html` (`group2.mjs`, `group2.css`): open it through a local server from the repository's root
  (`/foundry/mockups/group2/index.html?theme=dark|light`; the links at the top switch).
- Screenshots (2x): `group2-dark.jpg`, `group2-light.jpg`. `node foundry/mockups/group2/shoot.mjs` remakes them (Playwright;
  `--parts` also saves one picture a section).

**The characters are stand-ins.** Aveline carries her Longsword, **Sylwen's Dagger and the compendium's Arming Sword** (put on her for these
pictures). Sylwen holds her Hunting Bow and her Dagger. The target is the Orc Warrior (AD 13).

## What each part proposes

**1. The roll dialog: one Roll button for each weapon** ("instead of click -> choose weapon -> roll, it becomes click -> roll").
Aveline, the Longsword in the main hand (Two-handed, in one hand: 3 Banes), the Dagger in the off hand (Light: 1 Bane), Weapon Attack.
- *Removed:* the "Which weapon?" window before the dialog (`actions.mjs pickWeapon`, asked since v0.0.426 when several held weapons fit).
- *Added:* in the card, where the Tiers are, **a small table with one column for each weapon**: a first line with the weapon's name and its
  hand, then every line the weapon changes (the Distance, Tier 1 to 3, the Critical when it differs; the Melee or Ranged trait when the two
  weapons differ on it). What is the same for both (the name, the Flavor, the Target, Special, Attack) stays written once.
- *Moved:* the Distance, from the card's first line to that table. The Tier lines, into that table.
- *Changed:* the roll line ("2d12 + 1 Weapon ▲0 ▼3") is written once for each weapon, in the same columns, with **the Banes of its hand as
  chips under it** (they were in the shared Banes row). The shared Modifiers keep only what counts for both.
- *Changed:* the bar. The Roll mode sits under the label column, then **"Roll · Longsword" and "Roll · Dagger"**, each under its column.
  A weapon thrown reads "Roll · Dagger (thrown)".
- A weapon that can't reach the target: its button is struck (dashed, as a struck Version: a click still rolls) and the reason is written
  in its column ("Orc Warrior is 4 squares away: its Range is 1").
- One weapon fits (Sylwen's Quick Shots, a Shot: only the bow): today's dialog, nothing changed.
- **Option B** (drawn, not proposed): today's dialog for the main hand's weapon, and only the bar changes (two buttons, each with its
  weapon's Tier 2 / Tier 3 damage and Banes on a second line). Shorter, but the card shows one weapon while the other button rolls other numbers.

**2. The Actions tab loses the hand buttons** ("you can likely remove the 1H 1H buttons").
- *Removed:* the `ps2-hb` buttons after the stamps (Smite and Binding Light show two "1H" today). Nothing else moves.
- With them goes the window the sheet opens today when a hand button's weapon is a Two-handed one in one hand ("Regrip first / use it in one
  hand", `actor-sheets.mjs useWith`): the dialog shows the 3 Banes, and Regrip is on the hand tile (part 3).

**3. The HUD's hand tile opens a menu just above itself** ("a reversed dropdown").
- *Removed (from the tile's click):* the "Hands and Gear" panel at the HUD's left end (it only opens item sheets).
- *Added:* a menu that opens upward from the tile, 4 px above it, its left edge on the tile's, moved left to stay 4 px inside the screen.
  The tile clicked is filled (the HUD's one filled button).
- The menu: a first line (the weapon in bold, its hand), a warning line when the grip costs Banes, then three groups under thin lines:
  1. the grip: "Hold with both hands" (Regrip), "Hold with one hand" (Release), "Move to your off hand" or "Swap hands with the Dagger"
     (Regrip); for a Two-handed weapon whose other hand is full, also "Drop the Dagger, then hold with both hands" (Release, Regrip);
  2. "Change to the …", one row for each weapon carried and not in a hand (Interact: stow and draw in the same Action);
  3. "Stow" (Interact), "Drop" (Release).
  A free hand's menu: "Draw the …" for each weapon carried, then "Hold the Longsword with both hands".
- Each row ends with its Action's name and its cost ("Regrip 1 AP"); out of combat "free".
- A row that can't be done now is struck, with its reason under it in plain ink ("Your off hand holds the Dagger.", "No AP left").
- Drawn: the main hand's and the off hand's tile (two weapons, in combat), the main hand's and the free hand's tile (off hand free, out of
  combat), a two-handed grip with no AP left.

## Choices I made

- **Both weapons shown in the dialog, in columns** (not the main hand's alone): nothing has to be guessed before the click. Option B is the other way.
- **The button reads "Roll · Longsword"**; the hand's word is at the top of the column, not on the button. For a Save or a no-roll Action it would read "Use · …".
- **Both Roll buttons are filled** (neither is the default look); **Enter rolls the main hand's**.
- **The hand's Banes are chips under each weapon's roll line**, still clickable as today.
- **A weapon out of range is struck but still rolls**, as the dialog treats a Version you can't pay for (v0.0.293).
- **The menu has the same rows in the same places for every weapon**: "Hold with both hands" is always there, struck when the other hand is
  full. The one-click "Drop …, then hold with both hands" only for a Two-handed weapon (what the sheet's hand button offers today).
- **The menu is up to 340 px wide**, wider than a tile (about 145 px), so on the main hand's tile it is moved left a little to stay on the screen.
- **The same menu would replace the sheet's hand menu** (`pcsheet.mjs handMenu`), so both read alike. The sheet is not drawn.
- An Action with two Versions and two weapons (not drawn): the Version buttons stay where they are, before the Roll buttons.

## Rule questions (not decided here)

1. **A Thrown weapon and "fits".** Today a Dagger fits a [Ranged, Weapon] Action (thrown), and for Weapon Attack the distance decides: in
   hand within its melee Range, thrown beyond. Should an adjacent target also offer "Dagger (thrown)" as its own button? And is a thrown
   weapon out of the hand afterwards (Foundry doesn't move it)?
2. **An Action that asks for a kind of weapon** (Darting Blade: a Light weapon). The code only checks Melee, Ranged, Shot and Gun, so a
   Longsword would get a Roll button on Darting Blade. Should "fits" read the Action's requirement?
3. **Fists as the second weapon.** With one hand free, should Weapon Attack offer "Roll · Fists" beside the held weapon? Assumed no (Fists is its own Basic Action).
4. **Interact with both hands full.** The book says a Handle Action needs a free hand, and Interact lists "stow an object you hold" and
   "swap two objects". The menu offers Stow and "Change to" with both hands full (as the sheet's menu offers Stow today). Is that right?
5. **Changing to a weapon from a full hand costs 1 AP** (Interact's swap). Assumed from the card's text.
6. **Holding a one-handed weapon with both hands** (the Dagger): Regrip allows it today. Does it do anything? If not, the row can go for weapons without Two-handed.
7. **Changing to a Two-handed weapon while the other hand is full**: it would arrive in one hand (3 Banes). Offer it, strike it, or offer "drop the other, then draw"? Not drawn.

## What is the system's own code, and what is not

- **Real:** every "Today" picture: `rolldlg.mjs dialogHtml` (the Tiers by `actions.mjs attackModelParts`, the card's lines by
  `cardlines.mjs`, the hand's Banes by `loadout.mjs handBanes` / `oneHandedTwoHander`, the Range by `weaponrange.mjs`),
  `pickwindow.mjs pickWindowHtml`, the sheet's template on `../sheets/model.mjs`, `hudview.mjs tokenBarHtml` on `../hud3/model.mjs`,
  `hudmodel.mjs hudPanelHtml`. The proposed dialog is built from each weapon's real dialog (what is equal is kept once, what differs goes to the columns).
- **Not real:** the dialog's input is put together in `group2.mjs dlgInput` (in Foundry `rollinput.mjs` builds it from the live scene), with
  only the hand's Banes and the Nonlethal chip; the target's distance is a number I set. `proposeDialog`, `optionB`, `tileMenu`, `menuHtml`,
  `placeMenus` and the `.g2-*` CSS are the mockup's. The pick window is drawn 580 px wide (640 in Foundry). The macro bar and the icons are stand-ins.
- **Not drawn:** the menu on the sheet's tiles; Sylwen's HUD (a Strung bow's warning line is written in `tileMenu`); several targets; a
  Save Action with two weapons; the keyboard.
- Hover texts: none on the page (the system's own `data-tooltip` attributes are stripped from the drawn HTML).
