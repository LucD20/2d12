# To test in Foundry: the running list

The one list of what Lucas tries in Foundry (since v0.0.425; it replaced the per-version "TO TEST" sections of foundry-backlog.md, which stay as
history). **Foundry shows it:** turn on the world setting **Test checklist** (GM): a bar shows one test at a time (Shift+K shows or hides it),
Pass / Fail / Skip; a Fail asks what happened and keeps the console's errors; the bar's List has every test and **Copy report** (paste it to
Claude). The answers are saved in the world.

**How Claude keeps it** (`foundry/twod12/tools/build-checklist.mjs` builds `foundry/twod12/checklist.json` from this file; t268 fails when they
differ):
- `## Group` = where you meet it in play. `### id · vX · Title`, then `Do:` and `Expect:` (a field can go on over several lines), and `Rev: N`
  when a test's text is rewritten so that it must be tried again (its old answer no longer counts).
- A new version adds its tests here (in the group where they are met), rewrites a test it changes (Rev + 1) and deletes a test it replaces.
- A test Lucas reports as passed is deleted from here in the next version (the report's PASS line); a failed one stays until its fix (Rev + 1).
- Only what the automated tests can't see: how it looks, how it feels, Foundry itself. v0.0.387 to v0.0.406 are not here: Lucas tested them at
  the merge ("All works except momentum").
- **Each test's Do names the creature to test it with** (Lucas, 2026-11-18: "When asking for an action on the checklist, write which PC has it").
- The names: the compendium's PCs Aveline (Paladin, Smite), Durgan (Paladin, Lay On Hands), Sylwen (Archer, Quick Shots), Kaela (Archer,
  Strafe); the NPCs Goblin Sneak, Orc Warrior, Grave Wisp, Ogre Chieftain.

## Characters and sheets

## Hiding

## The HUD

### pt-fxzoom · v0.0.532 · The effect icons on a token stay readable when zoomed out
Do: Give the Orc Warrior three conditions (Prone, Vulnerable 1, Taunted by Durgan). Zoom the map out step by step to the farthest zoom, then back in past 100%.
Expect: Zoomed out, the icons on the orc's token stop shrinking at about 16 pixels on screen (they grow over the token, from its top-left corner); at 100% and closer they are Foundry's normal size, never bigger. If they jump or sit in the wrong place after a token refresh, say so (this could not be tried outside Foundry).

## Starting a combat

## The roll dialog

## Chat cards

### pt-dcolor · v0.0.532 · "1[D] + [Mod]" is in the damage color
Do: Open Durgan's Basic Attack card (the sheet, the HUD's card, and a roll of it in the chat).
Expect: Tier 3's "1[W] + 1[D] + [Mod]" is all in the Vigor damage color on every face, as Tier 2's "1[W] + [Mod]" is.

## Conditions and their Tiers

### pt-grab · v0.0.532 · Grabbed makes the creature Vulnerable 1 while held
Do: Update the Conditions from the compendium (or use a fresh world). The Ogre Chieftain Grabs Aveline (Crushing Grip's Tier 3, or Grabbed by the ogre from the Token HUD). A Goblin Sneak attacks Aveline with its Shiv (look at the roll dialog). Then Aveline uses Break Free and succeeds.
Expect: While held, Aveline shows Grabbed with Immobilized and Vulnerable 1 linked under it; the goblin's roll dialog against her shows the Vulnerable chip (1 Boon). If she already had Vulnerable 2, only the 2 counts. When Grabbed ends (Break Free, or the ogre lets go), the Immobilized and the Vulnerable 1 go with it; nothing to remove by hand.

### hq-lingering · v0.0.531 · Rev 4 · The Token HUD sits under every window; its Lingering click still adds or ends one
Do: Select Kaela (or the Orc Warrior) and open her character sheet. Right-click her token so Foundry's Token HUD shows (combat toggle, the status palette, the Vigor / Resolve boxes), then drag the sheet over the HUD. Open the status palette and click Lingering: give 1d6 Fi in the window that opens; click Lingering again and choose "Add another Lingering", then once more and choose "End" on one.
Expect: The sheet covers the Token HUD where they overlap (the HUD is under it, not drawn through it); the Lingering damage window opens above the Token HUD, and any other window (the sheet, a pick window) is above it too. The Token HUD's Vigor / Resolve boxes and its status palette are still above the system's HUD bar at the bottom. With a Lingering already on, the click asks in the bottom bar "Add another Lingering", one "End Lingering ..." for each, and Cancel; "End" removes only that one.

## Movement

### ox-charge · v0.0.532 · Rev 3 · Charge is Melee only, and asks for the weapon once
Do: Durgan (Arming Sword) Charges an Orc Warrior 5 squares away and makes the granted Basic Attack (1A) from the HUD's Situational tab. Then Sylwen with only her Hunting Bow in hand uses Charge. Then Sylwen with her Dagger in hand Charges an orc about 6 squares away. Last, the Ogre Chieftain Charges Aveline from about 6 squares.
Expect: Durgan stops adjacent and his Basic Attack opens on the Arming Sword with no "Which weapon?" question and no second Roll button for another weapon. Sylwen with only the bow is refused at once ("can't Charge without a Melee weapon in hand"), no AP spent. With the Dagger she gets no question either: she stops adjacent (the Dagger in hand, Range 1) and attacks with it in hand (no "Thrown" notice). The ogre stops 2 squares from Aveline (Crushing Grip's Reach (2)) and attacks with Crushing Grip, never Roar.

### pt-collision · v0.0.532 · A Prone, Unconscious or dead creature causes no Collision
Do: Kill the Orc Warrior (or mark it Dead) and knock a Goblin Sneak Prone. Durgan uses Shove (or any Push) on the other Goblin Sneak so that its line passes through the dead orc's square, then through the Prone goblin's square, to a free square beyond. Then aim a Push to end exactly on the Prone goblin's square.
Expect: The Push passes through both and lands beyond them, with no "hits" plate, no damage to anyone, and the log's line has no "(hits ...)". Aimed on the Prone goblin's square, it stops on the square before it: the plate says "not in a lying creature's space", no Collision and no damage. A standing creature in the way is still a Collision as before.

### pt-area · v0.0.532 · The Advance's area: an ally's space is crossed, not a stop
Do: Put Kaela next to Aveline (Aveline between Kaela and an open space) and click Aveline's Advance in the HUD on Aveline's turn. Then, on another turn, give Kaela a Crawl (1 AP) first, then an Advance.
Expect: Aveline's area goes past Kaela's square at double cost (it reaches 1 square less beyond Kaela than in open ground); Kaela's own square is hatched and not filled as a square Aveline can stop in. After Kaela's Crawl is used up, her Advance's area again counts Difficult Terrain and allies' squares as double (the Crawl's "ignores Difficult Terrain" ended with it).

### pt-diag · v0.0.532 · The second diagonal counts across two drags
Do: On Sylwen's turn, note her squares left, drag her token 1 square diagonally and drop it; then drag her 1 more square diagonally and drop it; read the squares left in the movement bar after each drop. Then end her turn and start Kaela's: drag Kaela 1 square diagonally.
Expect: The first drop costs 1 square, the second 2 (the second diagonal costs 2, as in one drag of 2 diagonals); the area drawn after the first drop already shows the next diagonal costing 2. Kaela's first diagonal on her own turn costs 1 (the count starts again on a new turn).

## Reactions and Judge

### pt-judge · v0.0.532 · Judge's card names the creature retargeted while the dialog is open
Do: Durgan targets the Grave Wisp and uses Judge (1 AP); while its roll dialog is open, target the Ogre Chieftain on the map (T, not the dialog's Target button), then press Roll.
Expect: The card that posts names the Ogre Chieftain, and the ogre carries the Judged mark (the Wisp doesn't). The same holds for any Action: the Action resolves on the creatures targeted when Roll is pressed.

### pt-marks · v0.0.532 · Marks in the Situational tab, and Apply effect on the card
Do: Durgan Judges the Grave Wisp, then (from his Shield of Faith or a Taunt) Taunts the Ogre Chieftain; select Durgan and open the HUD's Situational tab. Click the ✕ on the Wisp's row, then on the ogre's. Then click the "Apply effect" button on Judge's card with the Wisp targeted; then with nothing targeted.
Expect: A "Marks" entry (by you · 2) lists "Grave Wisp · Judged" and "Ogre Chieftain · Taunted", each with a ✕; it folds on its title like Hiding, and its buttons never move. Each ✕ removes that one and posts a short system line ("... is no longer Judged by Durgan (removed by hand)"); the Wisp's ring goes. Apply effect marks the targeted Wisp again; with nothing targeted it marks the card's own target.

### pt-taunt · v0.0.532 · Taunted takes no Bane when the taunter is among the targets
Do: Durgan Taunts the Ogre Chieftain (or apply Taunted by Durgan from the Token HUD). On the ogre's turn, use Great Sweep (or any Action with several targets) against Durgan and Aveline; then against Aveline alone.
Expect: With Durgan among the targets the roll dialog shows no Taunted chip (no Bane); against Aveline alone it shows Taunted (1 Bane).

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

### pt-log · v0.0.532 · The Encounter Log: Collision in Raw, the Saves, Weak, the title
Do: Run a short fight with all four creatures: the Ogre Chieftain's Backhand Pushes Kaela into a wall (or a creature), the ogre uses Crack the Ground on two PCs who both pass, Durgan hits the Grave Wisp with Drawing Light (Holy: its Weakness 3), then end the combat and Copy for Analysis.
Expect: Kaela's Collision damage is in the Raw column (not Adjust), with the ogre as its origin. Crack the Ground writes one line a PC: "Aveline: Instinct Save N vs DC N (Crack the Ground) T3" even when nobody is hurt (the Grave Wisp's Dying Flare too). The Wisp's Raw includes its Weakness's extra (Raw is never below Net). The report's title lists every kind of enemy (Ogre Chieftain, Orc Warrior, Grave Wisp, Goblin Sneak).

## Windows
