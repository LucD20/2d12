# Brief: a redesign of hands and grips on the sheet (for a new chat; Lucas, 2026-10-31, after v0.0.211)

## What is confusing today
- **Three places** show hands: the Items tab (the Loadout strip with Main hand / Off hand / Armor tiles, and each weapon row's
  Dropped / Worn / 1H / 2H buttons), the Actions tab (the 2H / M / O buttons, v0.0.208 to v0.0.211) and dialogs (Release, Regrip, no free hand).
- The **1H / 2H** buttons of a weapon row and the **Main / Off** hands are two ideas for the same thing (where a weapon is held).
- Costs are hidden: Swap hands and 1H → 2H spend Regrip (1 AP in combat), drawing is free on the sheet (the book: Interact, 1 AP), Release is 0 AP.
- The M and O letters on the Actions tab don't say what each hand holds without a tooltip.

## The rules it must show (book: 15-gear.md Hands, 06-basic-actions.md)
Two hands, main and off (names only); a Two-handed weapon in one hand: 3 Banes on [Strike, Weapon] Actions; **Release** (0 AP: one hand
off a grip, or drop); **Regrip** (1 AP, no Handle: both hands on a weapon, move it to the other hand, swap); **Interact** (1 AP, Handle:
draw, stow, grab); Handle Actions need a free hand; Fists need a free hand. Coming: **Strung** (a bow in one hand, 3 Banes with the other
hand full), the **off-hand Bane** (2, light 1; a Strung weapon only with the main hand full), versatile weapons (a bastard sword: one or two
hands), shields.

## Ideas (to choose from in the mockup)
1. **One "Hands" widget, always visible** (header, under the AP pips, or the top of the Actions tab): two tiles, Main and Off, each with the
   held weapon's icon and name, or "Free (Fists)"; a two-handed grip merges them into one wide tile. **Click a tile:** a small menu with
   the cost on each line: Regrip (both hands / move / swap) 1 AP, Release 0 AP, Stow (Interact 1 AP), Draw... (the weapons you carry).
   **Drag a weapon** from the Items tab onto a tile to draw it into that hand.
2. **The Actions tab's hand buttons use the same picture** as the widget: the weapon's icon (small) instead of M / O, so a player
   connects "this button = that hand". The letters stay in the tooltip.
3. **The weapon rows of the Items tab lose 1H / 2H**: a weapon is On you / Dropped / In hand; *how* it is held lives in the widget only.
4. **Warnings on the tile**, not only in dialogs: amber when a Two-handed weapon is in one hand (3 Banes), and later a Strung bow with the
   other hand full, an off-hand weapon (its Bane).
5. **Costs on every control** (0 AP, 1 AP), greyed when you can't pay; out of combat everything is free (as now).
6. **One chat line per change**, with the two hands drawn as icons (before → after).
7. **Shortcuts (pack K):** swap hands, Release, draw the last weapon.

## Questions for Lucas in that chat
1. Where the widget lives: the header (always visible), the Actions tab, or the Items tab only?
2. Should other items take a hand (a torch, a shield, a potion)? Today only weapons do.
3. Drawing a weapon on the sheet: should it spend Interact (1 AP) in combat, as the book says (today it is free on the sheet)?
4. Keep the Items tab's Loadout strip, or let the widget replace it?

## States the mockup should show
Empty hands; a Longsword (main) and a Dagger (off); a Greatsword in both hands; a Greatsword in one hand (the warning); a Crossbow
unloaded; a bow (Strung) with the other hand free, and with a dagger in it; the Fists' buttons with one free hand and with none.
