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

### ox-pointout · v0.0.530 · Rev 3 · Point Out on a creature Unsensed for another reason than Hide: the ripple, and removing it by hand
Do: In a combat, give Kaela the Blinded status and put a Goblin Sneak more than 10 squares from her, in bright light where Sylwen sees it. Select Kaela and look at the goblin; use Sylwen's Point Out on the goblin (Tier 2: pick Kaela). Select Kaela again and look; target the goblin with her. Move the goblin one square. Select the goblin: open the HUD's Situational tab and look at its Hiding entry; click the ✕ on Kaela's "Pointed out" row. Then Point Out again and use the Goblin Sneak's Hide.
Expect: Before: the goblin is not on Kaela's map (no ripple) and her roll against it skips it (Unsensed). After Point Out: a line "Kaela perceives Goblin Sneak as Hidden (was Unsensed)"; with Kaela selected the goblin shows as the Hearing ripple, she can target it and her Actions against it are Doomed (Hidden), not skipped. After the goblin moves, it is still Hidden to her. The goblin's Hiding entry (title "Hide, Point Out · 1") has a row "Kaela · Pointed out ✕"; the ✕ posts "Goblin Sneak: Kaela no longer perceives it by Point Out (set by hand)", the row goes, and the goblin is Unsensed to Kaela again (no ripple). After the second Point Out, the goblin's Hide makes it Unsensed to her again and its "Pointed out" row goes. Also: a Blinded Kaela with a goblin within 10 squares in the combat (not hiding) sees its ripple and can target it; if not, say so with the goblin's distance.

## The HUD

### sf-area · v0.0.530 · Rev 2 · Placing an area: Cancel and the Ties never move; the mouse on the HUD changes nothing
Do: In a combat, select Sylwen and use Volley: before clicking, move the mouse over the enemies, over empty squares, then farther than its range, and then to the HUD's Cancel. Cancel it. Then select the Ogre Chieftain, use Crack the Ground and move the mouse around the ogre until the Line has a tie (the HUD's Ties Left / Right come on), then away again with no tie, then straight onto the HUD's Cancel (hover it, don't click); click Left and Right; then Cancel. Try it once with a narrower Foundry window too.
Expect: The question fills the Situational tab: "Place 2 Burst" (or "Place Line 3") and "within N sq." on the first line, then "Click to place.", then its own lines for the count ("2 enemies, 1 ally ...") or "Too far (12 sq., max 10)." in red, the keys' line, then the buttons. Cancel stays in the HUD's bottom right corner the whole time, whatever the count says. For the Line, Ties Left / Right are always at the left of the buttons' row: greyed out with no tie, usable (the side chosen filled) with one; nothing shifts when they come on. With the mouse on the HUD (Cancel or anywhere on it) the area on the map stays where it was and Left / Right don't change: hovering Cancel no longer lights Left. In a narrower window the keys' line goes, and Cancel still stays in its corner.

### sf-forced · v0.0.530 · Rev 2 · Forced Movement: the bar whole, in the tab and in the HUD's middle
Do: Select Durgan and Shove the Goblin Sneak (1 AP; on a Tier 2 or 3); move the mouse over several squares, against a wall, then to Don't move it. Then, with Durgan's Bulwark of Faith, Slide a creature: before clicking a square, look at Take back a step; click two squares, take one back, then finish. Do the Slide once with the HUD showing the question in its middle (the Situational tab not open, as in your picture), and once with a narrower window.
Expect: The title reads "Goblin Sneak is Pushed up to N squares" (N by the Tier); the sentence under it starts with a capital ("Away from Durgan: click the square where it ends."; the Slide: "In any direction: click the squares ..."), the result under the mouse on its own lines ("Pushed 1 ...", "Wall: ..."), the keys' line, then Rules at the left and Don't move it at the right end, never moving; moving the mouse onto the HUD doesn't change the result line. In the HUD's middle everything is inside the gold box: the title inside it at the top, the text, the result, the buttons in one row (Rules and Take back a step at the left, Don't move it at the right end), the keys' line last, inside; the rule's small reminder is not there (Rules opens it); nothing sticks out above or below. For the Slide, Take back a step is greyed out until a square is clicked, and greyed again when every step is taken back; it never appears or disappears.

### sf-charge · v0.0.530 · Rev 2 · Charge: only a creature nearer than 3 squares of running is "too close"; Give up stays in the corner
Do: In a combat, put the Goblin Sneak 5 squares from Durgan and the Orc Warrior 2 squares from him. Select Durgan and use Charge with no target: look at the HUD and the map. Pick the Goblin Sneak from its picture, then the orc (too close); move the goblin so the path has a tie (Ties Left / Right); then Give up. Charge again at the goblin and use it; then use the Basic Attack (1A) from the HUD (and once Cancel it). Then do one Charge with Aveline (Longsword) at an enemy 6 squares away, and one with Kaela (Recurve Bow in hand) at an enemy 10 squares away.
Expect: Only the orc (2 squares) is marked "too close (needs 3)"; the goblin is a picture in the row, with Ties Left / Right at the right end of that row (greyed out with no tie), then Charge (greyed out) and "Give up · 2 AP back" in the bottom right corner. Picked, the goblin's line runs to the square next to it ("4 squares · in Reach"), and Charge is usable (filled); "Charge anyway" when blocked takes the same place and width. No button moves through the whole Charge. The keys' line is not in the tab (no room). The Basic Attack (1A) entry: Basic Attack at the left, Cancel at the right end. Aveline stops adjacent; Kaela stops where the enemy is within 6 squares (the Recurve Bow's normal Range), the texts saying "in Range".

## Starting a combat

## The roll dialog

### bst-cornered · v0.0.530 · Rev 2 · Cornered: on the orc's sheet, and 1 Boon on the Bloodied orc's Shove
Do: Import the Orc Warrior again from the NPCs compendium and open its sheet's Actions tab; click Cornered. Damage it to Bloodied (28 Vigor damage: all of its Vigor), then use its Shove on Durgan. Do it again after healing it (any Vigor back), and use its Trip once while Bloodied.
Expect: Under its Actions a "Features" section lists Cornered; a click opens its card ("While the orc is Bloodied, its Shove gains 1 Boon"). Bloodied: the roll dialog of the Shove shows a "Cornered" Boon, on; the roll has it. Not Bloodied: no Cornered chip. Its Trip never gets it.

## Chat cards

### ox-shakeoff · v0.0.530 · Rev 2 · Shake Off: its card, and the Save's result message on one line
Do: Look at Shake Off on Durgan's sheet, its hover card and the HUD's card. Give Durgan a Lingering (the Orc Warrior's Barbed Javelin, Tier 3) and use Shake Off on him; click the card's "The target's Save" button and look at the message it posts.
Expect: Every card reads Save (the better of the Lingering's two Attributes, against DC 13 or the DC the Lingering writes) with the button at its end, then Tier 1, Tier 2, Tier 3 as three lines; no paragraph repeating them. The button rolls Durgan's Save against the Lingering, as before. Its message: the title "Shake Off", then one line "Durgan: Body Save N vs. DC 13: Tier X" (his first name only, the words flowing, no stray colon or bracket), then "Lingering [V] 1d10 Pi (Bo/In) goes on (no effect)." (or "ends.", or "takes half its damage ..."), with no name repeated.

## Conditions and their Tiers

### hq-lingering · v0.0.530 · Rev 3 · Lingerings of different subtypes run together; the Token HUD adds another; Shake Off ends one
Do: Import the Orc Warrior again from the NPCs compendium. Give Durgan a Lingering with its Barbed Javelin (Tier 3), then, from the Token HUD's conditions, click Lingering (he already has one): choose "Add another Lingering" and give 1d6 Fi in the window; then another Lingering with the javelin. Click Lingering in the Token HUD once more and choose "End" on the Fire one, then add it again. End his turn. Then use Shake Off on him.
Expect: The javelin's card and its Tier 3 say "Lingering 1d10 Pi (Bo/In)" and the applied one is Piercing. The Token HUD's click on Lingering, when he has one, asks in the bottom bar: "Add another Lingering", one "End Lingering ..." for each he has, and Cancel. He keeps two Lingerings: the Piercing one (the second Piercing one, not higher, leaves the first) and the Fire one; "End" removes only that one. At the end of his turn each deals its own damage card. Shake Off asks in the bottom bar which Lingering it ends (both listed by name); the Save uses that Lingering's Attributes and DC, and only that one ends (or is halved on a Tier 2).

## Movement

### ox-charge · v0.0.530 · Rev 2 · Charge stops at the weapon's normal Range
Do: Durgan (Arming Sword) Charges an Orc Warrior 5 squares away. Then Sylwen, with her Hunting Bow in hand, Charges an orc about 14 squares away; then with only her Dagger in hand.
Expect: Durgan stops adjacent, as before (the orc at 5 squares is not "too close"). Sylwen with the bow stops on the first square from which the orc is within 8 squares (the Hunting Bow's normal Range, 8/16/24), the line and texts saying "in Range"; an orc already within 10 is "too close" (fewer than 3 squares to run). With the Dagger the bottom bar first asks "Dagger (in hand) (Range 1)" or "Dagger (thrown) (Range 4)", and she stops where that Range reaches.

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows
