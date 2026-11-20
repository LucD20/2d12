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

## The HUD

### art-card · v0.0.465 · The Art's card: where it opens, a second click
Do: Aveline clicks Commandment on her HUD; click Commandment again; open it again and right-click Commandment; open it from her sheet.
Expect: The card opens beside the Art clicked (to its right, its bottom level with it), not high up the window. A second click on the Art closes it (it doesn't reopen); a right-click on it closes it too.
Rev: 3

## Starting a combat

## The roll dialog

### warn-dialog · v0.0.460 · Rules broken: warnings in the roll dialog
Do: As a player (not the GM): Sylwen targets the Orc Warrior behind a wall (all four corners blocked) and uses a Weapon Attack; then a target the GM marked Unsensed; then Quick Shots' second shot at the creature of the first; give her bow Reload and shoot it unloaded.
Expect: None of them stops the Action: the roll dialog opens with its warning written above the bottom bar, one ruled line with a small red warning icon ("No Line of Effect to Orc Warrior: all four corners are blocked", "… is Unsensed: it can't be targeted (the roll is Doomed)", "… was already a target: the card asks for a different creature", "… is unloaded: Reload it before using it again"), and Roll works.
Rev: 2

## Chat cards

### save-nonlethal · v0.0.465 · A Save Action's Nonlethal switch looks like a cost
Do: Durgan uses Word of Radiance on two goblins; look at the roll dialog's Damage row; turn the switch on.
Expect: "Nonlethal: +1 Boon on each Save" has a red outline and a minus mark (a cost, like a Bane), on and off.
Rev: 3

### chat-follow · v0.0.465 · The chat follows a card grown by its dice
Do: With the chat at its bottom (and Dice So Nice on, if you use it), Sylwen makes a Weapon Attack on the Orc Warrior and clicks Damage; then Apply.
Expect: After the dice land, the card's last line is in sight; after Apply too. The card reads: its lines, its Special and Flavor, then the roll and the damage.
Rev: 4

### empowered-one · v0.0.465 · Empowered with several creatures: chosen on the map
Do: Give Sylwen Empowered; she uses Volley on three enemies, two or more hit; click Damage; click one of the hit enemies' tokens on the map.
Expect: The HUD's Situational tab asks which creature takes the 1d6! (their pictures, and the gold rings on the map); the one clicked takes it, on its own line.
Rev: 3

## Conditions and their Tiers

### shake-off-other · v0.0.465 · Shake Off's Save in the system's look
Do: On Kaela's turn, she uses Shake Off on Durgan's Lingering (another player's creature).
Expect: One card titled "Shake Off": "Durgan: Body Save 15 vs DC 13: Tier 2" (his Attribute), then what happens to the Lingering; no old roll card.
Rev: 2

## Movement

### forced-move · v0.0.461 · A Forced Movement: one look, Escape, Backspace
Do: Durgan's Rebuke pushes the Orc Warrior: hover squares, then press Escape. Push it again and click a square into a wall. Then a Slid 3 (any card): click two squares, press Backspace, then right-click and drag the map, then Enter.
Expect: The squares to click in gold, the Orc's path in pale ink with an arrow, Durgan's pale ring, the result on a dark plate near the end and in the HUD; no text following the pointer, no Foundry notification. Escape: the Orc stays and the card says "Orc Warrior was Pushed 0 by Durgan". Into the wall: red where it stops, "N Vigor" damage (not "Body"). Slid: the steps numbered, Backspace takes the last back (the HUD's Take back a step too), a right-click only pans, Enter moves it.

### push-list · v0.0.461 · Picking whom to push
Do: Durgan uses an Action that pushes the creatures around its target (three goblins); push one, then press the end button.
Expect: One end button, "Done: the rest stay" (no Stop); after the first push the text says "1 of 3 moved"; the ones moved leave the list.


### charge-new · v0.0.461 · Charge: pick the enemy, then confirm
Do: In a combat with no target, Durgan uses Charge; read the map and the HUD; click an empty square; click the Goblin Sneak (or its picture in the HUD); click an empty square again; press Enter. Then a Charge whose line Aveline blocks; then press Escape on one.
Expect: Before a target: the enemies it can Charge wear the gold ring with its slow ripple and a number, their pictures are in the HUD ("Pick the enemy to Charge"), the others a quiet plate ("too close (needs 3)", "too far (11)"); the limit a faint pale edge; an empty square does nothing. With the Goblin: a pale line with a dot a square, his faint portrait where he stops, a plate "5 squares · in Reach / then Weapon Attack (1A) on Goblin Sneak"; Charge filled, Give up · 2 AP back quiet, and a key line. An empty square still does nothing; Enter, the Charge button or a click on the Goblin charges. Blocked: a red cross before Aveline, the plate in red, Give up filled and Charge anyway. Escape gives up (AP back); a right-click only pans.
Rev: 3

### rewind-refund · v0.0.462 · Move back gives back only the last movement
Do: In a combat, the Ogre Chieftain drags 1 square, then drags again toward Kaela (Slip Away triggers on the second drag); on the Reactions card click Move back all the way (Shift-click). Then once a drag that buys an Advance (1 AP) and Move back all the way.
Expect: The Ogre goes back to where the second drag started, and only the second drag's squares come back (the first square stays spent). A drag that bought its Advance: back where it started with its AP and squares as before that drag.
Rev: 2

### large-difficult · v0.0.460 · A Large creature passing a creature: each step pays
Do: Move Durgan as a Large token (2 × 2) straight past the Goblin Sneak so his space slides along its square for two steps; watch the ruler's label while dragging, then drop.
Expect: Each step in which his space covers the Goblin's square costs 1 more: two steps alongside read "(+2)" (4 squares for 2), not "(+1)"; an ally's square costs nothing extra.
Rev: 2

### pushed-button · v0.0.462 · A Pushed button on a card (diagnostic)
Do: With the console open (F12), the Ogre Chieftain uses Overhead Smash on Durgan with a Tier 2, in the open; click the card's "Pushed 2".
Expect: A bar in the HUD's Situational tab asks which creature to push; Durgan is pushed 2. If nothing happens, Fail it and paste the console line that starts "twod12 | pushed-button diagnostic" (it says what the card holds where you clicked).
Rev: 2

## Reactions and Judge

### judge-gm-dock · v0.0.463 · Judge's question for the GM, and Line of Effect
Do: As the GM with no token selected, the Judged Orc Warrior damages an ally near Durgan (Durgan an NPC-run Paladin, or the GM answering for him): click Durgan's token. Then a wall between Durgan and the ally.
Expect: The question moves into Durgan's HUD, Situational tab (not a small floating bar). With the wall (no Line of Effect from Durgan to the ally) no question and no reduction.

### sit-order · v0.0.463 · The Situational section's order and the area's question
Do: Sylwen is Prone; she uses an area Action (Volley) and places it.
Expect: The area's question ("Volley: apply the area shown on the map? …", capitalized) is above Prone's Stand / Crawl; no "Right-click pans the map" in any key line.


### armor-faith-source · v0.0.463 · Armor of Faith's names as text
Do: Durgan at Escalation 2 uses Shield of Faith on Aveline when the Orc Warrior's Strike would damage her.
Expect: The chat line reads "Armor of Faith (Durgan's Passive, for using Shield of Faith): Durgan gains Guard 3" with the two names in bold, a dotted underline, no box; a click opens each card.
Rev: 2

### two-judges · v0.0.463 · Two Paladins Judge the same Orc: the breakdown
Do: Aveline and Durgan both Judge one Orc; it damages an ally near both; both reduce; apply, then open the row's breakdown (the equals button).
Expect: Each Paladin is asked; the breakdown lists "Judge (Aveline) −N" and "Judge (Durgan) −N", then any Guard it took; no "Cannot read properties of null" in the console.
Rev: 2

### rescue-reach · v0.0.464 · Rescue stays within your Reach
Do: Durgan uses Hold the Line's Rescue on an adjacent ally (Aveline): try to move her 2 squares away from him, then to another square next to him.
Expect: Only the squares within Durgan's Reach are offered (the gold squares); a square farther away says "the target must remain within Durgan's Reach (1)"; a square next to him works.
Rev: 2

## Areas, light and Cover

### area-hover · v0.0.463 · The hover card over an area
Do: Hover Aveline's Consecrated Ground, then Sylwen's Covering Fire.
Expect: Consecrated Ground: "Difficult Terrain (enemies)" and "Allies and you: Guard your Power Modifier at the start of their turns", and its rounds; Covering Fire its own lines.
Rev: 2

### consecrated · v0.0.463 · Word of Radiance on a Judged creature: one damage line
Do: Aveline Judges the Orc Warrior and uses Word of Radiance on it and the Ogre Chieftain; both roll their Saves; open the damage.
Expect: The Orc's Tier shows its d8 damage only (no extra d6 group with no one in it); Apply applies what is shown.
Rev: 2

### covering-fire · v0.0.411 · Covering Fire, Volley, Spotter
Do: Sylwen places Covering Fire and the GM walks an enemy in; she uses Volley on a 3 Burst; she Calls Out (Spotter) a creature in Dim light.
Expect: The enemy takes [V] 2 + Weapon Modifier and pays double; Volley makes Prone on a Critical; your allies see the called-out creature Clear for 1 round.

### clear-lines · v0.0.411 · Clear Lines and Opening Shot
Do: Sylwen at Escalation 4 (Clear Lines) shoots past Aveline at an Orc Engaged with Durgan; then Kaela (Opening Shot) lands a Tier 3.
Expect: No Cover from your ally and no Field Bane; the Tier 3 line names your allies who threaten the target.

### spotter-self · v0.0.426 · Call Out helps the allies, not the caller
Do: Sylwen Calls Out an Orc in Dim light; Sylwen attacks it; an ally attacks it.
Expect: Sylwen still has the Obscured Field Bane; the ally doesn't.

### ht-once · v0.0.431 · Hazardous Terrain once per turn-cycle
Do: Sylwen places Covering Fire; the GM moves an Orc into it (Advance), moves it again inside it in the same turn, and ends its turn there.
Expect: One hit only (on entering); none for the second move or the end of the turn; it can be hit again from its next turn.

## Ending an encounter and resting

### thrill-wrath · v0.0.411 · Thrill of the Kill and Kindled Wrath
Do: An enemy Sylwen damaged goes Down; Durgan, an ally of Aveline, becomes Bloodied.
Expect: The Archer's Escalation +1; the Paladin's Escalation +1 (once).

### thrill-kill · v0.0.426 · Thrill of the Kill on a first hit
Do: Sylwen's first damage on an Orc brings it Down; later, Aveline, whom Sylwen hit with a Volley, goes Down.
Expect: The kill raises her Escalation; the ally's Down doesn't.

## The Encounter Log

### log-allies · v0.0.421 · Damage to allies and numbered names
Do: In a fight with two Goblin Sneaks, Sylwen's Volley hits Aveline and the Goblins; open the Encounter Log.
Expect: The damage table has a "To allies" column (damage to itself counts there); the Goblins are "Goblin Sneak 1" and "Goblin Sneak 2" in the window and in the copied text.

## Windows

