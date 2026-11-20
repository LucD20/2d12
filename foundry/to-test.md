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

### pc-symbols · v0.0.460 · The stat symbols on the PC sheet
Do: Open Aveline's sheet (dark and light).
Expect: AD, WD, Speed, Reach, Size, Steady and Guard have the same small symbols as the NPC sheet (AD a shield with a dot, WD the talisman); Immune / Resist / Weak theirs; the Attributes none.

### inventory · v0.0.460 · The Inventory's menus close on a second click
Do: Open Sylwen's Inventory; click the Dagger's Where button, then click it again; same with the Hunting Bow's Where; on her Overview, click a hand tile twice.
Expect: The second click closes the menu (it no longer flicks open again).
Rev: 2

## The HUD

### sit-pictures · v0.0.460 · Pictures in the Situational section
Do: Start a combat with three Goblin Sneaks set as one squad (Initiative window); when the squad's turn comes, read the HUD's Situational section.
Expect: The goblins' pictures are small squares (about 34 px) in one wrapping row; the section doesn't fill or need scrolling for them. If what covered the section was something else, send a screenshot.

### setup-squares · v0.0.461 · A Setup's squares left, in the Situational section
Do: In a combat, Sylwen uses Strafe (the Advance Setup): read the HUD's Situational section, move her token 2 squares, read it again; then Cancel.
Expect: "Strafe: You Advance. Move your token, then Continue." (no braces), "4 of 6 squares left" on its own line with the number big, updated as she moves; Continue: the roll filled, Cancel the Action quiet, and the key line "Enter Continue · Esc Cancel the Action · Right-click pans the map".
Rev: 2

### art-card · v0.0.460 · The Art's card: moved, and a Mode used at once
Do: Aveline clicks Commandment on her HUD; drag the card by its top line; click outside it; click a Mode's "Use · 1 AP"; open it again and Shift-click a Mode's Use.
Expect: The card moves with the drag and, once moved, stays open on an outside click (the ×, Escape or a Use close it). A plain click uses the Mode straight to the chat (no roll dialog, unless something blocks it, such as no target); Shift-click opens the roll dialog.
Rev: 2

## Starting a combat

### judge-start · v0.0.462 · Judge on the Start of the Encounter card, once
Do: Put Aveline, Durgan and the Ogre Chieftain in a combat, roll Initiative and start it; Resolve the card.
Expect: One Judge row for each Paladin (not two), each with its Judge button; Resolve asks each for its target once. No "The Combat … does not exist" error in the console when a combat is deleted mid-movement.
Rev: 2

## The roll dialog

### area-place · v0.0.460 · An area Action: Place before the targets
Do: With the Orc Warrior targeted, Durgan uses Word of Radiance from his HUD (not the sheet): read the dialog; click "Place 2 Emanation" and place it; then use it again and press Roll without placing.
Expect: From the HUD as from the sheet, the dialog opens first (no area asked before it). No creature rows until the area is placed: a "Place 2 Emanation" button stands where they go, its outline pulsing slowly in bronze. Placed, the creatures in it show. Roll without placing asks to place it, then rolls.

### warn-dialog · v0.0.460 · Rules broken: warnings in the roll dialog
Do: As a player (not the GM): Sylwen targets the Orc Warrior behind a wall (all four corners blocked) and uses a Weapon Attack; then a target the GM marked Unsensed; then Quick Shots' second shot at the creature of the first; give her bow Reload and shoot it unloaded.
Expect: None of them stops the Action: the roll dialog opens with its warning written above the bottom bar, one ruled line with a small red warning icon ("No Line of Effect to Orc Warrior: all four corners are blocked", "… is Unsensed: it can't be targeted (the roll is Doomed)", "… was already a target: the card asks for a different creature", "… is unloaded: Reload it before using it again"), and Roll works.
Rev: 2

### g2-darting · v0.0.460 · Darting Blade draws its Light weapon
Do: Sylwen with her Hunting Bow in both hands and her Dagger on her (Inventory: "On you"), no off-hand weapon: use Darting Blade on the Orc Warrior and Roll. Then put the Dagger in her pack (no Light weapon at all) and use it again.
Expect: With the Dagger on her: the dialog shows the Dagger's Strike (not Fists); on Roll a chat line says "Sylwen draws Dagger, Hunting Bow in one hand (Darting Blade's Setup)", the Dagger is in her off hand and the bow in one hand. With no Light weapon: the roll dialog opens with the warning "Darting Blade needs a light weapon in hand" above its bar (it then rolls with what she holds), and Roll still works.
Rev: 3

### reload-chip · v0.0.460 · The Reload shot's chip
Do: Give Sylwen's bow the Reload property (its sheet) and open a Weapon Attack's roll dialog with it; click the "Reload shot" chip on, then off, without clicking anywhere else.
Expect: No red outline after a click: green when on, dashed and struck through when off. (Pressing Tab still shows a blue focus outline.)
Rev: 2

### warn-only · v0.0.460 · A Requirement warns in the roll dialog
Do: On Sylwen's turn, move a square, then use Wounding Shot.
Expect: No Foundry popup: the roll dialog opens with "Wounding Shot: Sylwen has left its square this turn (its Requirement). Used anyway." written above its bar, and Roll works. (With the HUD's Skip roll dialog on, the popup comes instead.)
Rev: 2

## Chat cards

### save-nonlethal · v0.0.460 · A Save Action switched to Nonlethal
Do: Durgan uses Word of Radiance on two goblins; in the roll dialog's Damage row, turn on "Nonlethal: +1 Boon on each Save", Use; each goblin rolls its Save; apply the damage.
Expect: The switch is in the Damage row (next to Empowered). No Bane on Durgan. Each goblin's Save dialog starts with 1 Boon more. The damage card says Nonlethal and the damage is applied as Nonlethal.
Rev: 2

### dmg-ledger · v0.0.460 · Apply's right-click menu
Do: Durgan Smites the Orc Warrior with the chat scrolled to the bottom (the card the last message); right-click Apply; then, once applied, right-click Undo.
Expect: The menu (Apply full / Apply half, rounded up / Apply double) floats over the page by the button, above it when there is no room below, never under the chat's input; a click on a line applies it and closes the menu.
Rev: 2

### chat-follow · v0.0.460 · The chat follows a growing card
Do: With the chat at its bottom, Sylwen makes a Weapon Attack on the Orc Warrior: click Damage, then Apply; then Durgan Smites it (Damage, Apply). Then scroll up a little and click a damage stamp's link to its roll card.
Expect: At the bottom, the chat follows the card each time it grows (after Damage, after Apply, after the dice): its last line stays in sight. Scrolled up, or after the jump to the roll card, it stays where you are.
Rev: 3

### empowered-one · v0.0.460 · Empowered with several creatures: you choose
Do: Give Sylwen Empowered; she uses Volley on three enemies and two or more are hit; click Damage.
Expect: A window "Empowered" asks which creature takes the Empowered 1d6! (each listed with its Tier); the one picked has its own line on the damage card with the die, the others don't. Closing the window gives it to the first one hit.
Rev: 2

## Conditions and their Tiers

### npc-fists · v0.0.460 · An NPC's Fists on its sheet
Do: Open the Orc Warrior's sheet, Basic Actions; use its Fists on Aveline.
Expect: Fists is in the sheet's Basic Actions, as on its HUD; it rolls the Orc's Weapon Modifier and deals 1[W] (the Fists' die) plus its Weapon Modifier on Tiers 2 and 3. (Weapon Attack, Reload, Regrip and Release stay hidden on an NPC's sheet.)
Rev: 4

### shake-off-other · v0.0.426 · Shake Off on another player's creature
Do: As Sylwen's player (not the GM), with the GM connected, use Shake Off on Kaela (another player's character) while she is Lingering, and get a Tier 3.
Expect: The Lingering ends (no permission error in the console).

### shake-off-ally · v0.0.462 · Shake Off by an ally: it finds the Lingering creature
Do: On Kaela's turn, with Kaela's token selected and Durgan (Lingering) targeted, she uses Shake Off; get a Tier 2. Then once with nothing targeted, on Kaela herself with a Lingering.
Expect: Durgan rolls the Save (not "Kaela has no Lingering"); at the end of Kaela's turn he takes half the Lingering's damage ("Halved (Shake Off, Tier 2)"), then it ends; nothing at the end of Durgan's own turn. With nothing targeted, Kaela's own Lingering.
Rev: 2

## Movement

### map-attention · v0.0.461 · A token that needs you: the ring and its ripple
Do: The Orc Warrior moves away from Aveline (she can Rebuke); then Durgan uses Rebuke's Pushed on two goblins (the push list); in Configure Settings turn "Map: the attention ripple" off and repeat.
Expect: Aveline wears a steady gold ring with a slow ripple growing out of it and fading (about every 2.4 s), and a dark plate "Rebuke? / Use or Pass in the HUD". The goblins to pick wear the same ring and ripple with a number (as their pictures in the HUD); the hovered one brighter. With the setting off (or the system's reduced motion): the ring alone, no ripple. The serious look: no glow, no flashing.

### move-range · v0.0.461 · Advance and Evade on the map
Do: Sylwen Advances (a card's free Advance) in a scene with a Difficult Terrain region and an enemy near; then an Evade (Slip Away); press Escape during each.
Expect: Where she can stop in pale ink (no blue); Difficult Terrain inside the Advance's area hatched; the Evade's edge dashed, the squares next to it she can't enter hatched red. The HUD's bar shows "N squares left" big, updated as she moves, and a key line; Escape ends the movement (as End movement).

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

### armor-faith-source · v0.0.453 · Armor of Faith says what granted it
Do: Durgan at Escalation 2 uses Shield of Faith on Aveline when the Orc Warrior's Strike would damage her.
Expect: The chat line reads "Armor of Faith (Durgan's Passive, for using Shield of Faith): Durgan gains Guard 3", both names links that open their cards.

### judge-in-hud · v0.0.441 · Judge's question in the Situational section
Do: Durgan Judges the Orc Warrior; the Orc hits Sylwen within 5 squares of Durgan. As Durgan's player, look at his HUD.
Expect: The question "Reduce that damage by 1?" is in the Situational section with Not now and Reduce by 1 only (no third Cancel button); Escape still closes it.

### two-judges · v0.0.423 · Two Paladins Judge the same Orc
Do: Aveline and Durgan both Judge one Orc; it damages an ally near both.
Expect: Each Paladin is asked for their own reduction; Smite reads it as Profane for each.

### judge-cycle · v0.0.431 · Judge once per turn-cycle
Do: Put Aveline last in the order. The Orc she Judged damages Sylwen near her (reduce it); next round the Orc acts before Aveline and damages Sylwen again.
Expect: The second damage isn't offered a reduction (still the Paladin's turn-cycle); after the Paladin's turn starts, the next one is.

### armor-faith-judge · v0.0.431 · Armor of Faith and Judge's 0R
Do: Durgan at Escalation 2 or more (Armor of Faith): Judge again as a 0R when the creature he Judged goes Down; then use Shield of Faith.
Expect: No Guard from Judge's 0R; Shield of Faith gives the Guard (1 + Power Modifier).

### shield-of-faith · v0.0.409 · Shield of Faith and its target
Do: An Orc Strikes Sylwen within 5 squares of Durgan; Durgan uses Shield of Faith. Then try with Sylwen behind a wall from Durgan.
Expect: The damage is 1 + Pow less and the attacker is Taunted (1 round). Behind a wall: the Reactions message says it's blocked ("no Line of Effect to ...").

### rebuke-move-back · v0.0.409 · Rebuke and Snap Shot's Move back
Do: An Orc within 3 squares walks away from Aveline: she uses Rebuke. An Orc walks up to Sylwen: she uses Snap Shot; one walks up to Kaela: she uses Slip Away.
Expect: The Reactions message offers each; Move back puts the enemy on the square before.

### shield-not-ally · v0.0.426 · Shield of Faith not against an ally
Do: Sylwen's Volley hits Aveline, next to Durgan (with Shield of Faith).
Expect: Shield of Faith is not offered (it answers an enemy's Strike).

### kindled-wrath · v0.0.426 · Kindled Wrath
Do: Make Sylwen, an ally of Aveline, Strained (Resolve damage), then Bloodied.
Expect: Strained raises nothing; Bloodied raises her Escalation once, and the line names the ally.

### rescue-reach · v0.0.426 · Rescue moves the ally 2 squares
Do: Durgan uses Hold the Line's Rescue on an adjacent ally (Aveline) and moves her 2 squares away from him.
Expect: Allowed (a Reposition isn't held within your Reach); Relocate still is.

### snap-shot-doom · v0.0.428 · Snap Shot isn't Doomed by the mover
Do: An enemy walks up next to Sylwen; use Snap Shot from the Reactions message before clicking Move back.
Expect: The roll is not Doomed for being Engaged (the enemy hasn't entered yet); another enemy already adjacent still makes it Doomed.

## Areas, light and Cover

### area-hover · v0.0.422 · The hover card over an area
Do: Hover a placed area: Sylwen's Covering Fire, or Aveline's Consecrated Ground.
Expect: A small card follows the mouse: its name and what it does inside.

### consecrated · v0.0.409 · Consecrated Ground and Word of Radiance
Do: Aveline places Consecrated Ground; walk an enemy in; start Durgan's turn inside. Aveline uses Word of Radiance on enemies with one Judged.
Expect: Enemies pay double in it; the ally gains Guard equal to your Power Modifier (a line). Word of Radiance: Appeal Saves, d8s against the Judged one, Pushes 3 / 2 / 1.

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

