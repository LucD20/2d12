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
- The names: the compendium's PCs Aveline (Paladin, Smite), Durgan (Paladin, Lay On Hands), Sylwen (Archer, Quick Shots), Kaela (Archer,
  Strafe); the NPCs Goblin Sneak, Orc Warrior, Grave Wisp, Ogre Chieftain.

## The test bar

### bar-works · v0.0.425 · This bar works
Do: Read this test, click **Pass**. Then open **List**, click **Show** on another test, and press Shift+K twice.
Expect: Pass moves to the next open test; Show brings that test here; Shift+K hides the bar and shows it again. The bar can be dragged by its top line and folded (the arrow).

### bar-fail · v0.0.425 · A Fail keeps a note and the console errors
Do: On any test, click **Fail**, type a note, Save. Open List, click **Copy report**, paste it somewhere.
Expect: The report has a FAIL line with your note (and "console:" lines if Foundry logged errors since that test was shown). Click Fail again on that test: it opens again. Clear it before you go on.

### book-links · v0.0.427 · The book's links
Do: Open the Core Rules in the Claude app (or the published page) and click a few links (a condition, Stacking, a Basic Action such as Shake Off); in the Archer's document click Darting Blade's "Light".
Expect: Each scrolls to its target and opens the chapter or card around it; Shake Off lands on its card; "Light" lands on Gear's weapon property.

## After the update

### update-compendium · v0.0.418 · Update from the compendium
Do: Open the world as the GM after the update. When asked, accept **Update from the compendium**.
Expect: The PCs' cards are refreshed (Judge on a Paladin ends with "Multiple Paladins can Judge the same creature: it is Judged by each of them."). Nothing you added to a sheet by hand is removed.

### update-npcs · v0.0.419 · NPCs from the compendium again
Do: Delete the NPCs on the scene and drag the Goblin Sneak, Orc Warrior, Grave Wisp and Ogre Chieftain in again from the compendium.
Expect: Their melee cards read "Distance: Reach (1)" (the Ogre: its own Reach), and the cards with a push write "Pushed N" in Tiers 2 and 3.

### compendium-content · v0.0.413 · What the compendiums hold
Do: Open the compendiums.
Expect: Actions: the Basic Actions, the Paladin's, the Archer's and four Weapon Techniques (no "old cards", Talents or Testing folders). Weapons: Arming Sword, Longsword, Dagger, Hunting Bow, Recurve Bow and the armors. NPCs: the four above. PCs: Durgan holds an Arming Sword; Sylwen and Kaela are the Archers.

## Characters and sheets

### new-paladin · v0.0.409 · A new Paladin's levels
Do: Make a new character, drop the Paladin class from the compendium, open the class window.
Expect: Level 1: Judge and Smite granted; Binding Light or Lay On Hands; Shield of Faith or Rebuke; an Art (three); Armor of Faith or Roving Judgment. Level 2: Kindled Wrath, the three Encounter Picks, Weight of Judgment or Tireless Vigil. Level 3: the two Arts you don't have, Reckoning or Hallowed Stance.

### new-archer · v0.0.411 · A new Archer's levels
Do: Make a new character, drop the Archer class, open the class window.
Expect: Level 1 offers Quick Shots or Strafe, Slip Away or Snap Shot, an Art, Lean and Loose or Blade and Bow (Shifting Aim and Darting Blade granted); Light Armor Training. Shifting Aim's bow choice opens the system's pick window and gives Mastery 5 with that bow.

### stages · v0.0.407 · Stage 0 on the sheet
Do: Open a level 1 to 3 character's sheet and its Build tab; take a test character to level 4.
Expect: The sheet says Stage 0. The Build tab's "Next levels" at level 3 reads "Stage 1: Stage Talent · ... · Rally +1 · +1 to one Modifier" with no Health part (the steps aren't written yet). At level 4 the class window asks which Modifier takes the +1. The Talent slots say they stay empty and don't block "complete".

### action-card · v0.0.410 · The Action card in the book's look
Do: Open Smite, Judge and Commandment on a Paladin's Actions tab, in the dark and the light interface.
Expect: Smite: the Flavor in italic, the traits line, Distance and Target, Smite dice, Attack, Tier 1 / 2 / 3, Special, then Use. Judge: two blocks (0 AP, 1 AP) each with its Use. Commandment: three Mode blocks, Kneel with its own Save. Both themes readable.

### sheet-pills · v0.0.421 · The Frequency word on Reactions only
Do: Look at a Paladin's Basic Actions and Reactions on the sheet.
Expect: A Basic Action's box shows only its cost ("1 AP"); a Reaction's shows its Frequency and cost ("Turn · 1R").

### rally-edit · v0.0.418 · Rally Points editable by the player
Do: As a player, change your character's Rally Points on the sheet.
Expect: It saves, and a short system line in the chat says the change.

### item-traits · v0.0.418 · An item sheet's traits
Do: Open a weapon's and an Action's item sheet.
Expect: The traits are the card's plain words (no colored chips), and a sheet keeps its own light look inside a dark interface where it has one.

### npc-level · v0.0.418 · The NPC sheet's Level
Do: On an NPC sheet, change its Level, then click its image.
Expect: The Level saves; the image picker opens.

### class-editor · v0.0.421 · The Class Levels Editor saves a section's title
Do: Open a class's Levels Editor, rename a section, save, open it again.
Expect: The new title is kept.

### builder-tab · v0.0.436 · The NPC Builder tab
Do: Open the Orc Warrior's Builder tab; click the Striker preset on a copy. Then make a new NPC and set its rank to Elite, then back to Standard.
Expect: Health 60 (Vigor 36, Resolve 24), AD 13, WD 11, CV 100 (its Low Ward Defense is half a step: counted as none); the Damage row "25/AP" for a Standard; the turn-budget table, with no list of old notes under it; Best turn "about 93 of 100 (damage only: riders and shares not counted)". Striker sets High damage, High Vigor, Low Resolve, Low AD, Low Weapon Modifier, CV unchanged; Soldier and Skirmisher also keep CV 100. The new Elite has Escalation on, at 1, and its ladder reads "2 · Pressing | 4 · Relentless | 6 · Second Wind"; back to Standard, Escalation is off.
Rev: 3

### no-levels-class · v0.0.415 · A class without levels
Do: Drop a class item with no levels on a character.
Expect: A warning to give it levels first (no Attribute window).

## Starting a combat

### ogre-large · v0.0.435 · The Ogre Chieftain is Large
Do: Drag the Ogre Chieftain from the compendium onto a scene.
Expect: Its token is 2 × 2, and its sheet's Size is Large (4).

### minion-squad · v0.0.433 · Three Goblins on one Initiative roll
Do: Put three Goblin Sneaks and two PCs in a combat and roll Initiative from the Initiative window.
Expect: One roll, the same Initiative for the three (the card says "×3"), each with its own turn, and the three act one after another: no PC's turn between them. A Goblin Sneak has 3 AP and no Reaction AP.
Rev: 2

### minion-eot · v0.0.433 · A Goblin's EoT in the squad's slot
Do: In that combat, on a PC's turn, make the third Goblin Hindered (EoT); in the first Goblin's turn, give the second Goblin an effect for 1 round.
Expect: The third Goblin's Hindered ends at the end of its own turn, not the first one's. The 1-round effect ends at the end of the third Goblin's turn in the next round, not before.

### momentum-start · v0.0.407 · Momentum and Escalation at the start
Do: Before starting, set Momentum to 2 (left-click +1, right-click −1 on the strip). Start the combat; go to round 2.
Expect: The strip reads "Preparing the encounter · Momentum 2", then "Round 1 · Momentum 2"; every PC starts at Escalation 3 (an Elite at 1). Round 2 raises everyone by 1, up to 6 (six pips on the sheet and the HUD).

### elite-steps · v0.0.434 · The Elite's default ladder by name
Do: Turn on the Ogre Chieftain's Escalation (Default ladder ticked) and play to round 2, then make it Bloodied.
Expect: The system lines name the steps: "Pressing (1 Boon on its first [Strike] Action each turn-cycle)", then with Relentless ("each of its Round Special Actions twice per turn-cycle"). Its first [Strike] each turn-cycle has the Boon in the roll dialog; a Save Action or an Action that isn't a Strike doesn't take it.
Rev: 2

### judge-start · v0.0.409 · Judge at the start of an encounter
Do: Start a combat with Aveline and Durgan in it.
Expect: Each Paladin's player is reminded to Judge (target it and use Judge, 0 AP). Both can Judge the same Orc: its token shows both rings, and it counts as Profane for each of them.

## Your turn: Actions and the roll dialog

### roll-order · v0.0.417 · The roll dialog follows the card
Do: Open the roll dialog of Smite, Lay On Hands and Rebuke.
Expect: Smite: "Smite dice" above Attack, then Tier 1 to 3, then Special. Lay On Hands: Setup above the Tiers. Rebuke: Trigger at the top. A label reads "Requirement". Judge's dialog has no "Attack: ..." line (it has no roll).

### smite-dice · v0.0.409 · Smite by Escalation and the Reaction AP die
Do: At Escalation 3, Smite the Judged enemy; tick "Reaction AP: 1 more Smite die" in the roll dialog. Then Smite an enemy that isn't Judged.
Expect: Against the Judged one: d8s (Tier 2: 3d8! Holy with the weapon), 4 dice with the tick and the Reaction AP spent. Against the other: d6s.

### hands-banes · v0.0.412 · The hands' Banes
Do: Strike with a weapon in the off hand; then with a bow while the other hand holds a Dagger; then with a bow and the other hand free.
Expect: Off hand: 2 Banes in the roll dialog (a Dagger: 1); the bow with a Dagger in the other hand: 3 Banes; the bow with a free hand: none.

### doomed-engaged · v0.0.407 · A ranged shot while Engaged
Do: With an Archer adjacent to an enemy, use a [Ranged] Action.
Expect: The roll dialog's chip reads "You are Engaged (Doomed)" and the roll is Doomed.

### shifting-aim · v0.0.411 · Shifting Aim and Blade and Bow
Do: On Sylwen's turn, shoot from where you started; Evade a square and shoot; shoot again without moving. At Escalation 2 with Blade and Bow, use Darting Blade after a shot, twice.
Expect: No Boon on the first shot; "Shifting Aim" (1 Field Boon) on the second; none on the third. Darting Blade gets 1 Boon the first time that turn, none the second.

### quick-shots · v0.0.411 · Quick Shots and One More Arrow
Do: Use Quick Shots at Tier 2 and Tier 3; at Escalation 6, make your turn's first Strike.
Expect: Tier 2 deals the bow twice (2[W]), Tier 3 three times, then the Evade 2 button. At Escalation 6 the first Strike deals 1[W] more.

### wounding-shot · v0.0.414 · Wounding Shot and Lingering
Do: Use Wounding Shot from where you started your turn; then move a square and try again. Land a Tier 2.
Expect: From your square it rolls; after moving it is refused ("has left its square this turn"). Tier 2 applies "Lingering [V] 1 (Bo/In)"; at the end of the creature's turn its damage card says "Ends with Shake Off (1 AP)".

### exploding · v0.0.407 · Exploding dice and Empowered
Do: Roll Weapon Attacks until a die shows its top face. Give a PC Empowered and make two damaging Actions in its turn.
Expect: A 6 on a d6 shows "6!", counts 5 and adds a new roll. The first damage card has an "Empowered 1d6!" line; the second has none.

### reload-shot · v0.0.431 · A Reload Shot's die
Do: Give a weapon the Reload property (its sheet). Deal damage with another Action, then make a Reload shot with the weapon in the same turn.
Expect: The shot is Favored and its damage has the 1d6! even after the first damage of the turn; an Empowered PC's own Empowered die isn't spent by it.

### arts-modes · v0.0.409 · An Art's Modes (Commandment)
Do: Use Commandment from the sheet or the HUD; pick Kneel.
Expect: A pick window asks Challenge / Courage / Kneel. Kneel rolls the target's Appeal Save; Tier 1 or 2 makes it Prone by itself.

### lantern · v0.0.409 · Lantern of Faith
Do: Use Kindle, then Glare on an enemy.
Expect: Kindle lights you (Bright 3) until the encounter ends. Glare: an Instinct Save; on a failure the target is Half-Blinded until the end of its turn.

### hud-techniques · v0.0.418 · The HUD shows only usable Techniques
Do: Select Durgan without the Mastery for Seizing Cut and open the HUD.
Expect: Seizing Cut is not in the HUD (it shows once the Mastery unlocks it at 10). The HUD shows the Pow Defense.

### mod-as-written · v0.0.426 · [Mod] where the card writes it
Do: Land a Tier 2 Smite with Aveline; a Tier 2 Trick Shots (Pin) with an Archer; a Tier 2 and a Tier 3 Seizing Cut (any character with the Mastery, or give it by hand).
Expect: Smite's Tier 2 adds the Signature Modifier to 1[W] and the Smite dice; Trick Shots' Pin deals [Mod] damage (a Damage button) and Hindered; Seizing Cut's Tier 2 is 1[W] alone, its Tier 3 1[W] + [Mod].

### npc-no-mod · v0.0.426 · An NPC's damage shows no Modifier
Do: Open the Orc Warrior's Cleaver roll dialog and land a Tier 2.
Expect: The Tier 2 line reads 1 + 1d4! (no "+ Weapon Modifier"), and that is what it deals.

### hud-weapon · v0.0.426 · The weapon is chosen before the dialog
Do: Give Sylwen her Dagger and bow in hand. From the HUD, use Weapon Attack, then Quick Shots.
Expect: Weapon Attack asks "Which weapon?" before the roll dialog, and the dialog's hands' Banes and range are that weapon's. Quick Shots uses the bow without asking (a Shot needs a bow).

### one-more-arrow · v0.0.426 · One More Arrow waits for a [W] hit
Do: At Escalation 6, roll a Tier 1 Quick Shots ([V] [Mod]), then a Tier 2 Strike that deals [W] the same turn.
Expect: The Tier 1 doesn't use it up; the Tier 2 Strike deals 1[W] more.

### setup-range · v0.0.426 · A Setup and the range
Do: Use Darting Blade on a creature 8 squares away; at Escalation 6 with Hallowed Stance, open Smite's chat card.
Expect: Darting Blade is out of range (no "the Setup first" note: its Setup moves nobody). Smite's card shows "Setup: You Advance 3" with its button.

### stance-setup · v0.0.428 · Hallowed Stance before the roll
Do: At Escalation 6 with Hallowed Stance, on Aveline's turn use Smite on an enemy 4 squares away.
Expect: Before the roll dialog the Setup bar lets you Advance up to 3 (move, then Continue); the range is then checked from where you stopped. Not offered off your turn.

### free-cost-hud · v0.0.428 · A free cost in the HUD
Do: With Roving Judgment active (Escalation 2), spend all your AP, look at Judge's 1 AP in the HUD and on the sheet.
Expect: It isn't struck (it costs 0 now) and can be used.

### avg-empowered · v0.0.428 · The roll dialog's Avg with Empowered
Do: Give a PC Empowered and open a damaging Action's roll dialog.
Expect: The Avg adds 4 once, "(with Empowered 1d6!)", not one per die.

### card-order-book · v0.0.429 · Seven cards in the book's order
Do: Open Rebuke, Reckoning, Hit and Run, Circling Shot, Trick Shots, Weapon Attack and Steel Yourself on a sheet, and use Rebuke and Hit and Run.
Expect: Rebuke's and Reckoning's Effect sits above their Save (sheet and chat card); Hit and Run's Effect above its Attack, drawn once on the chat card; Circling Shot and Knock Back show no Tier 1 line; Weapon Attack's Special is above its Attack, Steel Yourself's at the end.

## Chat cards

### card-order · v0.0.417 · The chat card follows the card
Do: Use Smite, Rebuke (its Save card) and Judge.
Expect: Smite: "Smite dice:" above the Tier stamp, "Special:" under it, before the Flavor. Rebuke's Save card: the Trigger above the Save and its Effect line (Hindered). Judge: "Judged:" and its Special once.

### chat-click · v0.0.418 · Click uses, right-click opens the rule
Do: Click anywhere on a chat card's button (its icon, its word); right-click a button.
Expect: A click uses it. A right-click opens its rule only (Foundry's message menu does not open).

### chat-drag · v0.0.421 · Drag a condition from the chat
Do: Drag a condition button (e.g. Prone) from a chat card onto a token. Try dragging a button from a sheet.
Expect: The token gets the condition. A sheet's button doesn't drag.

### chat-follow · v0.0.418 · The chat follows a growing card
Do: Use an Action whose card grows (the damage written into it); scroll up a little in the chat, then click a damage stamp's link to its roll card.
Expect: At the bottom, the chat follows the card as it grows. The jump to the roll card stays there (no snap back down).

### chat-removed · v0.0.418 · Lines removed from the chat
Do: Play a round: someone becomes Bloodied, someone uses a Reaction, someone goes Down, someone moves.
Expect: No Bloodied / Strained, Reaction-use, "next damage reduced", "is Down" or movement lines. The stamp is stretched; the Critical's arrow sits over CRIT, the CRIT zone shows only on a Critical; Bloodied is in the Vigor red on dark.

### old-card · v0.0.417 · An old chat card still works
Do: In a chat card posted before the update, click Apply and retarget.
Expect: It redraws with its old lines and Apply works.

### save-retarget · v0.0.426 · A damage-free Save card retargeted
Do: Use Rebuke with no target, then target the enemy and click the card's target button.
Expect: The enemy is Hindered (the Effect runs for the creature the retarget added).

### empowered-one · v0.0.426 · Empowered with several creatures
Do: Give a PC Empowered and hit three enemies with an area (two on the same Tier).
Expect: One Empowered 1d6! is rolled, and only one creature (the first hit) takes it: it has its own line on the card.

### save-effect-words · v0.0.430 · A self-running Effect on the Save card
Do: Use Reckoning on two enemies.
Expect: They are pushed once on use; the Save card's "Effect: Each target is Pushed 2." is words (no button to push again).

### save-card-before · v0.0.431 · The Save card before the roll
Do: As the GM, use Rebuke on an Orc Warrior; then use Word of Radiance on two enemies. Look at the cards as a player who owns neither.
Expect: Rebuke: under "Appeal Save — DC 13", one quiet line "Tier 1 or 2: Its Move Action is disrupted." (no colored bands, no Tier 3 line), then Roll Appeal Save. Word of Radiance: a row per enemy with its own Roll button, then "Tier 1: 3d6 Ho; Pushed 3", "Tier 2: …", "Tier 3: …" with the pool icons. The player sees "Waiting for …" instead of the buttons.

### save-card-rolled · v0.0.431 · The Save card after one roll
Do: Use Rebuke on an Orc Warrior and roll its Save; click the ladder. Then use Word of Radiance on one enemy, roll, click Damage, then Apply.
Expect: The attack card's Tier stamp ("TIER 2", "vs DC 13") and ladder (≤12 / 13–19 / 20+, the total above it, its Tier filled), and only that Tier's words under it. The ladder opens the roll. The target button is gone. Word of Radiance: Damage at the bottom; once it is rolled, its Damage part is under the card and Apply works.

### save-card-many · v0.0.431 · The Save card with several creatures
Do: Use Reckoning on three enemies; roll two of their Saves (on different Tiers), click one's total, then roll the third.
Expect: A row each: its Tier pill and total (the total opens its roll), or its Roll button. Under the rows, each Tier rolled as on the attack card (the Tier, the names, its words). The quiet "Tier 1 or 2: …" line stays until the last one rolls, then goes.

## Conditions and their Tiers

### tier-no-damage · v0.0.421 · A Tier's condition with no damage
Do: Use Trip (2 AP) and land a Tier 2; use Trick Shots' Pin and Startle; use Thwart Cut and land a Tier 1.
Expect: Each condition is applied by itself when its Tier lands (Prone, the Pin's and the Startle's, Pressed).

### reckoning · v0.0.421 · Reckoning
Do: Use Reckoning on several enemies.
Expect: Everyone is pushed; only those who rolled Tier 1 or 2 are Frightened (none is Frightened before its Save).

### seizing-cut · v0.0.421 · Seizing Cut's order
Do: Land Seizing Cut at Tier 3 (both hands full first: Release is offered).
Expect: Slid 1 first; Grabbed is a button to click after the Slide.

### thwart-pressed · v0.0.412 · Thwart Cut's Pressed
Do: Land Thwart Cut; the target makes its next Strike.
Expect: The target is Pressed 1 (Tier 3: 2) until the end of its turn; its Strike shows the Pressure Banes.

### immobilized-dc · v0.0.421 · Immobilized from a Tier
Do: Immobilize a creature with a Tier; try to Break Free.
Expect: Its DC is 11 + the user's Modifier (not 13).

### shake-off · v0.0.414 · Shake Off
Do: Target a Lingering creature (or none, for yourself) and use Shake Off; get each Tier once.
Expect: A Save card. Tier 3: it ends. Tier 2: the next end-of-turn card is halved ("Halved (Shake Off, Tier 2)"), then it ends. Tier 1: a line says it goes on.

### rider-zero · v0.0.432 · A rider at 0 damage
Do: Give the Orc Warrior Resist 10 Pierce (an Effect with a Resist setting). Hit it with Trick Shots' Pin on a Tier 2.
Expect: The damage is 0 (Resist), and the Orc is still Hindered (1 round); the card doesn't say the rest of the Tier is lost.

### npc-fists · v0.0.435 · An NPC without its weapon
Do: Open the Orc Warrior's sheet and HUD; use its Fists on a PC.
Expect: Fists is there (it wasn't before); it rolls the Orc's Weapon Modifier and deals 1[W] (the Fists' die) plus its Weapon Modifier on Tiers 2 and 3. The GM uses it only when the Orc has lost its cleaver.

### npc-no-ap-guard · v0.0.435 · No Guard from an NPC's unspent AP
Do: End an Orc Warrior's turn with 1 AP left; then end a PC's turn with 1 AP left.
Expect: At the Orc's next turn it gains no Guard; the PC gains Guard for its unused AP as before.

### minor-empowered · v0.0.435 · A Goblin's Empowered die
Do: Make a Goblin Sneak Empowered and hit a PC with its Rusty Knife; then make the Orc Warrior Empowered and hit.
Expect: The Goblin's Empowered die is 1d6 and never explodes; the Orc's is 1d6! as before.

### npc-unconscious · v0.0.433 · An NPC Down on Nonlethal damage
Do: Take an Orc Warrior Down with more Nonlethal damage than Lethal (a Nonlethal Action, or a Lethal Action switched with its Bane); then a copy with equal Lethal and Nonlethal.
Expect: The first falls Unconscious, not Dead (it stops flanking). For the equal one the GM gets a pick window: "It dies" or "It falls Unconscious".

### one-source · v0.0.424 · A condition from a second creature
Do: Make an Orc Frightened of Aveline for 3 rounds, then Frightened of Durgan for 1 round.
Expect: It is Frightened of Durgan only, for 1 round. Made Frightened of Durgan again for 2 rounds: it keeps the longer duration.

### reaction-conditions · v0.0.418 · A Reaction's condition
Do: Rebuke an enemy that walks away; Snap Shot an enemy that walks up.
Expect: Each is Hindered and its movement is cut to half from that moment.

### lingering-end · v0.0.426 · Lingering ends with the encounter, keeps the higher
Do: Give an Orc Lingering 2 (Wounding Shot Tier 3), then Lingering 1 (Tier 2). End the encounter; start another.
Expect: It keeps Lingering 2 (the higher average). After the encounter it has no Lingering left.

### shake-off-other · v0.0.426 · Shake Off on another player's creature
Do: As a player (not the GM), with the GM connected, use Shake Off on another player's Lingering character and get a Tier 3.
Expect: The Lingering ends (no permission error in the console).

### shake-off-ally · v0.0.427 · Shake Off by an ally: the current turn
Do: On Kaela's turn, she uses Shake Off on Durgan's Lingering and gets a Tier 2.
Expect: At the end of Kaela's turn Durgan takes half the Lingering's damage ("Halved (Shake Off, Tier 2)"), then it ends; nothing at the end of Durgan's own turn.

## Movement

### advance-one · v0.0.414 · Advance is one piece
Do: In combat, Advance, move 2 of 5 squares, then use a Weapon Attack; drag again.
Expect: The squares left are gone (the banner closes); dragging pays 1 AP for a new Advance.

### advance-interact · v0.0.414 · One Interact inside an Advance
Do: Advance, move 2, draw a weapon (or Interact); Interact a second time. Also Release mid-Advance.
Expect: The first Interact pays 1 AP and the Advance's squares stay; the second ends it. Release (0 AP) doesn't end it.

### off-turn-move · v0.0.421 · Moving on someone else's turn
Do: End a creature's turn with squares left; on the next creature's turn, drag the first one.
Expect: It isn't free movement (refused, or the GM's normal drag). A Reaction's squares (e.g. Slip Away's) are free during that turn only.

### steadiness · v0.0.421 · Steadiness asked on the right screen
Do: Push a player's creature with a GM creature; push a neutral creature with another neutral one.
Expect: The pushed creature's player is asked (Apply / Ignore), not the GM. Two neutral creatures don't count as allies.

### trade-places · v0.0.410 · Trade Places
Do: Use Hold the Line's Trade Places on an adjacent ally.
Expect: The Swap button swaps both tokens at once; no Reaction is offered.

### swap-size · v0.0.431 · Trade Places needs the same Size
Do: Make an ally's token 2 × 2 (a Large creature) and use Hold the Line's Trade Places on it.
Expect: Refused with a notice ("not the same Size: they can't swap squares"); nothing moves.

### speed-halve-last · v0.0.431 · Speed: halved last
Do: Give a PC with Speed 6 the Hindered condition and Exhausted 2; look at its Speed on the sheet and the HUD.
Expect: Speed 2 ((6 − 2) halved), not 1.

### setup-move · v0.0.418 · A Setup's movement
Do: Use Lay On Hands on an ally 4 squares away; use Circling Shot.
Expect: No "out of range" block; the Setup's button Advances (Circling Shot: Evade 1, then the shot, Tier 3's Evade 1). The Encounter Log writes it as one line ("Strafe (Setup: Advance 2)").

## Reactions and Judge

### avenge-kin · v0.0.433 · Avenge Kin offers itself
Do: Put two Orc Warriors next to each other; a PC hits one of them with a Strike that deals damage.
Expect: The Reactions message offers the other Orc's Avenge Kin (its trigger: an ally within 2 squares takes damage from a [Strike] Action).

### judge-question · v0.0.421 · Judge's reduction is a question
Do: The Judged enemy damages an ally within 5 squares of the Paladin. Answer "Not now"; then hit again the same round and answer "Reduce by N".
Expect: The Paladin's player is asked on the bottom bar. "Not now" reduces nothing and keeps the round's use; the second hit asks again and is reduced. Unanswered for 2 minutes counts as "Not now".

### two-judges · v0.0.423 · Two Paladins Judge the same Orc
Do: Aveline and Durgan both Judge one Orc; it damages an ally near both.
Expect: Each Paladin is asked for their own reduction; Smite reads it as Profane for each.

### judge-cycle · v0.0.431 · Judge once per turn-cycle
Do: Put the Paladin last in the order. The Judged Orc damages an ally near him (reduce it); next round the Orc acts before the Paladin and damages the ally again.
Expect: The second damage isn't offered a reduction (still the Paladin's turn-cycle); after the Paladin's turn starts, the next one is.

### armor-faith-judge · v0.0.431 · Armor of Faith and Judge's 0R
Do: With Escalation 2 or more, Judge again as a 0R when the creature you Judged goes Down; then use Shield of Faith.
Expect: No Guard from Judge's 0R; Shield of Faith gives the Guard (1 + Power Modifier).

### shield-of-faith · v0.0.409 · Shield of Faith and its target
Do: An enemy Strikes an ally within 5 of the Paladin; use Shield of Faith. Then try with the ally behind a wall from the Paladin.
Expect: The damage is 1 + Pow less and the attacker is Taunted (1 round). Behind a wall: the Reactions message says it's blocked ("no Line of Effect to ...").

### rebuke-move-back · v0.0.409 · Rebuke and Snap Shot's Move back
Do: An enemy within 3 walks away from the Paladin: use Rebuke; an enemy walks up to an Archer: use Snap Shot or Slip Away.
Expect: The Reactions message offers each; Move back puts the enemy on the square before.

### hud-jump · v0.0.421 · The HUD doesn't jump
Do: Accept a Reaction from the Reactions message with the HUD open.
Expect: The HUD keeps its place and size.

### passives · v0.0.409 · The Paladin's passives
Do: At Escalation 2 use a [Divine] Reaction (Armor of Faith) or Judge's 1 AP (Roving Judgment); reach Escalation 4 and 6.
Expect: Guard 1 + Pow, or Judge's 1 AP costs 0; at 4, two Reaction AP (Tireless Vigil); at 6, a [Divine] Action's card shows "Setup: You Advance 3" (Hallowed Stance).

### rebuke-far · v0.0.426 · Rebuke when the enemy runs far
Do: An Orc adjacent to Aveline (with Rebuke) Advances 6 squares away from her.
Expect: The Reactions message offers Rebuke (it is measured on the squares it left, not where it stopped).

### shield-not-ally · v0.0.426 · Shield of Faith not against an ally
Do: An Archer's Volley hits Durgan, next to Aveline (with Shield of Faith).
Expect: Shield of Faith is not offered (it answers an enemy's Strike).

### kindled-wrath · v0.0.426 · Kindled Wrath
Do: Make an ally of Aveline Strained (Resolve damage), then Bloodied.
Expect: Strained raises nothing; Bloodied raises her Escalation once, and the line names the ally.

### rescue-reach · v0.0.426 · Rescue moves the ally 2 squares
Do: Use Hold the Line's Rescue on an adjacent ally and move it 2 squares away from you.
Expect: Allowed (a Reposition isn't held within your Reach); Relocate still is.

### snap-shot-doom · v0.0.428 · Snap Shot isn't Doomed by the mover
Do: An enemy walks up next to Sylwen; use Snap Shot from the Reactions message before clicking Move back.
Expect: The roll is not Doomed for being Engaged (the enemy hasn't entered yet); another enemy already adjacent still makes it Doomed.

## Areas, light and Cover

### area-cover · v0.0.419 · Creatures in an area give no Cover
Do: The Ogre uses Ground Slam on several creatures in a row.
Expect: No creature gets Cover from another inside the area (walls still give it). The Ogre's allies in it are hit too.

### area-hover · v0.0.422 · The hover card over an area
Do: Hover a placed area (Covering Fire, Consecrated Ground).
Expect: A small card follows the mouse: its name and what it does inside.

### consecrated · v0.0.409 · Consecrated Ground and Word of Radiance
Do: Place Consecrated Ground; walk an enemy in; start an ally's turn inside. Use Word of Radiance on enemies with one Judged.
Expect: Enemies pay double in it; the ally gains Guard equal to your Power Modifier (a line). Word of Radiance: Appeal Saves, d8s against the Judged one, Pushes 3 / 2 / 1.

### covering-fire · v0.0.411 · Covering Fire, Volley, Spotter
Do: Place Covering Fire and walk an enemy in; use Volley on a 3 Burst; Call Out a creature in Dim light.
Expect: The enemy takes [V] 2 + Weapon Modifier and pays double; Volley makes Prone on a Critical; your allies see the called-out creature Clear for 1 round.

### senses-light · v0.0.410 · Dim and Bright light on a roll
Do: Attack with you and the enemy both in Dim light; you in Bright and the enemy in Dim; the enemy in Bright and you in Dim.
Expect: Both Dim: 1 Field Bane, no Boon. You Bright, it Dim: 1 Field Bane, no Boon. It Bright, you Dim: 1 Field Boon.

### clear-lines · v0.0.411 · Clear Lines and Opening Shot
Do: At Escalation 4, shoot past an ally at an enemy Engaged with another ally; land a Tier 3.
Expect: No Cover from your ally and no Field Bane; the Tier 3 line names your allies who threaten the target.

### spotter-self · v0.0.426 · Call Out helps the allies, not the caller
Do: Sylwen Calls Out an Orc in Dim light; Sylwen attacks it; an ally attacks it.
Expect: Sylwen still has the Obscured Field Bane; the ally doesn't.

### volley-range · v0.0.427 · Volley's Burst within the bow's normal range
Do: Place Volley's and Covering Fire's Burst beyond the bow's normal range.
Expect: The placement is limited to the weapon's normal range (the cards read "Distance: Weapon (Normal range)").
Rev: 2

### ht-once · v0.0.431 · Hazardous Terrain once per turn-cycle
Do: Place Covering Fire; move an enemy into it (Advance), move it again inside it in the same turn, and end its turn there.
Expect: One hit only (on entering); none for the second move or the end of the turn; it can be hit again from its next turn.

### radiance-d8 · v0.0.428 · Word of Radiance against the Judged one
Do: Aveline Judges an Orc, then uses Word of Radiance on it and another enemy (both fail on the same Tier).
Expect: On the Save card the Judged Orc has its own damage line with d8s; the other enemy takes the d6 roll.

## Ending an encounter and resting

### momentum-end · v0.0.407 · Momentum at the end
Do: End an encounter (Overcome, then another one Retreat); a PC goes Down; two PCs Sleep the same night.
Expect: The window asks Overcome / Retreat / Neither (Overcome 3, Retreat 0); a Down: −1; the first Sleep −1, the second nothing.

### mastery · v0.0.412 · Mastery at the end of an encounter
Do: End an Overcome encounter in which characters made Strikes; answer "Normal or harder".
Expect: Each character who made a Strike gains 1 Mastery (several weapons: you pick); a chat line says so. The Mastery tab shows 10 / 20 / 30 / 45 / 60.

### thrill-wrath · v0.0.411 · Thrill of the Kill and Kindled Wrath
Do: An enemy the Archer damaged goes Down; an ally of the Paladin becomes Bloodied.
Expect: The Archer's Escalation +1; the Paladin's Escalation +1 (once).

### swap-rest · v0.0.407 · Swap on a Rest
Do: Complete a Rest as a player and open the Build tab.
Expect: "Swap on a Rest" shows (gone when an encounter starts); it asks the level, then the class window with that level's choices; the Attribute buttons are locked unless the optional world setting is on.

### thrill-kill · v0.0.426 · Thrill of the Kill on a first hit
Do: The Archer's first damage on an enemy brings it Down; later, an ally she hit with a Volley goes Down.
Expect: The kill raises her Escalation; the ally's Down doesn't.

### mastery-step · v0.0.426 · Mastery's + and −
Do: A character with the Hunting Bow at 20 Mastery: on the Mastery tab, click + on the Recurve Bow (it shows 10).
Expect: It goes to 11 at once (it counted from the shown 10).

### sleep-momentum · v0.0.428 · Sleep after a fight
Do: Without moving the world clock: Sleep (−1 Momentum), fight an encounter, Sleep again.
Expect: The second Sleep takes −1 too (a fight ended between them); two Sleeps with no fight between take only one.

## The Encounter Log

### log-allies · v0.0.421 · Damage to allies and numbered names
Do: In a fight with two Goblin Sneaks, an area hits an ally and the user itself; open the Encounter Log.
Expect: The damage table has a "To allies" column (damage to itself counts there); the Goblins are "Goblin Sneak 1" and "Goblin Sneak 2" in the window and in the copied text.

### log-struck · v0.0.421 · A struck line's reason
Do: Hover a struck line in the Encounter Log.
Expect: Its reason shows (one of the few hovers left).

## Windows

### pick-windows · v0.0.415 · Every question is a pick window
Do: Meet a few of these: a Split Action's mode, a Strike out of your turn, a fourth Strike, Shift+E, the GM's "movement left", swap initiative, not enough AP, End Combat with a creature Dying, an Action with both hands full, Regrip, Reload, waking an Unconscious creature.
Expect: Each opens in the class window's style (no Foundry dialog) and Cancel closes it doing nothing.

### pick-forms · v0.0.415 · The forms
Do: Open the Senses editor, the Encounter Log's Edit line and Add a note, an area placed by hand, Recovery, Generate Weapon.
Expect: Each is a pick window; Save keeps what you typed; Generate Weapon's preview follows the type.
