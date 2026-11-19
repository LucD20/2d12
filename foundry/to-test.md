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

### rally-window · v0.0.454 · The Rally window and its line
Do: Give Durgan 9 Vigor, 2 Vigor Nonlethal and 6 Resolve damage; click his Rally (sheet or HUD); click "Change the split", move a point with − and +, Use. Then use Lay On Hands' "up to N" Rally Points on Aveline (an Action that lets her use several), pick 2 on the window's first line, Use; once more and Cancel.
Expect: A 400 px window in the dark table look: "Durgan heals 9" (with parts under it when there are bonuses), his Rally Points as marks with "N of 7 left", Vigor and Resolve as bars (the healed part hatched, "12 → 18 / 23"), "Split evenly between the two." and "Change the split", which shows the rows with − and +. Nothing in the chat while the window is open or after Cancel. After Use, one line with the heart: "Durgan heals 9 · 1 Rally Point, 6 left", then "9 Vigor …", then the parts when there are several. With "up to N", the count is the window's first line (no separate "How many?" window).

### npc-symbols · v0.0.454 · The NPC sheet's symbols
Do: Open the Orc Warrior's and the Ogre Chieftain's sheets in the dark and the light interface; give the Orc a Resist and a Weak (its Builder).
Expect: A small line drawing in the word's color before AD (a shield with a dot), WD (a talisman), Speed (a boot), Reach (a spear), Size, Steady (an anchor), Guard (a buckler), Immune (a barred ring), Resist (a half-filled shield), Weak (a cracked shield); none on the Attribute tiles; nothing moves, the sheet keeps its height. A PC's sheet has none.

### g3-res · v0.0.452 · The dark Resolve color
Do: In the dark interface, have Aveline Smite the Orc Warrior and read the chat card's line "Smite dice: [R] 1d6! Ho…"; open Smite on her sheet and in the roll dialog, and Durgan's Word of Radiance.
Expect: "[R] 1d6!" in the chat card (the "!" with the dice) and "Ho" in Holy's gold, and every Resolve damage on the sheet and in the dialog read in the same pale blue, easy to read on the dark card (the chat card no longer darker than the rest); the other colors in chat cards (Attributes, Boons, Banes) readable too; Vigor's red unchanged. The roll dialog too: its Smite dice line and Tiers in the same pale blue, not the dark blue.
Rev: 5

## The HUD

### art-card · v0.0.454 · A click on an Art opens its card
Do: Aveline clicks Commandment's cost on her sheet, then on her HUD; then use Sylwen's Spotter with no AP left.
Expect: No "choose a Mode" window: the Art's card opens beside what was clicked, with a top line ("Commandment", "Paladin Art · Once per round", "Choose a Mode") and each Mode's "Use · 1 AP"; a click on one uses that Mode; Escape, the × or a click elsewhere closes it. With no AP left each Use button stays in place, struck and faded, with no reason written beside it; a click still opens the roll dialog, which warns.

### hud-used · v0.0.453 · A used Action from the HUD: a warning, not a stop
Do: In a combat, Sylwen uses Quick Shots, then clicks it again on her HUD (its line reads "used", its stamp struck); then with 1 AP left click a 2 AP stamp. Ask for an Escalation 2 Passive's or the Apex's line before her Escalation reaches it.
Expect: The used Action and the 2 AP stamp still open the roll dialog, which says why it isn't allowed ("used this round", "Not enough AP") and lets you Roll. A struck stamp shows the hand pointer and lights on hover. Only an Escalation lock stays unclickable.

### strip-marks · v0.0.453 · The combat strip: the Reaction diamond, no state words
Do: In the dark interface, start a combat with Durgan and the Orc Warrior; let the Orc become Bloodied, then put Durgan Down.
Expect: Each creature's Reaction AP diamond on the strip is filled in the same gold as a full AP square (empty: the outline). No "Bloodied", "Strained", "Dying" or "Down" word under the names.

## Starting a combat

### squad-pictures · v0.0.454 · The Minions' picker with pictures
Do: Three Goblin Sneaks as one squad (merge them in the Initiative window) in a combat with Aveline; when their turn comes, look at the HUD's Situational tab; hover the squares; click one.
Expect: "Goblin Sneak · 3 of the squad left" and "Which one goes now?", then a square per Goblin with its token's picture and its number in a corner; a hover shows the name and lights its token on the map; a click (or a click on the token) picks it.

### judge-start · v0.0.453 · Judge on the Start of the Encounter card
Do: Put Aveline, Durgan and the Ogre Chieftain in a combat, roll Initiative and start it.
Expect: The "Start of the Encounter" card has a row for each Paladin: "Aveline can Judge a creature (0 AP, at the start of the encounter)" with its Judge button; Resolve runs them in order (each asks for its target), as the other rows.

### minion-squad · v0.0.453 · Minion squads: the recommendation, the GM's groups and order
Do: Make the Goblin Sneak a Minion (its sheet's rank), put three Goblin Sneaks, Aveline and Sylwen in a combat and open the Initiative window. Click the label of the Goblin that is alone in its squad, then the label of one of the pair; then add a fourth and a fifth Goblin. Roll. Start the combat; when a Goblin squad's turn comes, and at the end of that Goblin's turn, answer the bar.
Expect: Three Goblins start as two squads, 2 + 1 (four: 2 + 2; five: 2 + 2 + 1). The lone one's click puts it with the others (one squad of three); a click on one of a pair after the last squad makes a new squad; a squad never holds more than three; two Goblins can be split. One roll per squad, each Goblin its own turn, no PC's turn inside a squad; before a squad's turn the bar asks which Goblin goes now, and again at the end of each turn while two or more are left.
Rev: 4
## The roll dialog

### unfailing · v0.0.453 · Unfailing: Smite isn't spent on a Tier 1
Do: In a combat, Aveline Smites the Orc Warrior until she gets a Tier 1 (the GM's force-Tier in the roll dialog helps); then Smite again; then get a Tier 2 and try a third time.
Expect: Smite's traits read "… Unfailing …" (sheet, card, book). After the Tier 1 a chat line says "Unfailing: a Tier 1, so Smite isn't spent. Aveline can use it again."; Smite is not marked used and its Strike still counts (the strip). After the Tier 2 it is used as usual.

### effects-tier1 · v0.0.453 · An Effect line happens on a Tier 1 too
Do: Sylwen uses Quick Shots on the Orc Warrior and gets a Tier 1 (force it); then Darting Blade with the Dagger, a Tier 1.
Expect: Each chat card shows its Effect line (not dimmed, no "Tier 2+") with its Evade 2 button, and Sylwen can Evade 2. The roll dialog writes "Effects" with no "(T2+)". The Orc's Club and Overhead Smash still Push only on a Tier 2 or 3.

### warn-dialog · v0.0.453 · Rules broken: warnings in the roll dialog
Do: As a player (not the GM): Sylwen targets the Orc Warrior behind a wall (all four corners blocked) and uses a Weapon Attack; then a target the GM marked Unsensed; then Quick Shots' second shot at the creature of the first; give her bow Reload and shoot it unloaded.
Expect: None of them stops the Action: each opens the roll dialog with its warning above the bar ("No Line of Effect to Orc Warrior: all four corners are blocked", "… is Unsensed: it can't be targeted (the roll is Doomed)", "… was already a target: the card asks for a different creature", "… is unloaded: Reload it before using it again"), and Roll works.

### g2-darting · v0.0.453 · Darting Blade without a Light weapon: a warning
Do: Sylwen with her Hunting Bow in hand and her Dagger worn: use Darting Blade; then with the Dagger drawn; then put the Dagger in her pack (no Light weapon at all) and use it again; open Darting Blade's item sheet.
Expect: Its Setup draws a Light weapon; with the Dagger in hand only the Dagger makes the Strike. With no Light weapon the Action is not stopped: the roll dialog opens with the warning "Darting Blade needs a light weapon in hand" above its bar, and Roll still works. The item sheet shows "Weapon needs: A Light weapon".
Rev: 2
### dice-sources · v0.0.440 · Where a die comes from
Do: Sylwen at Escalation 6 uses Quick Shots (her turn's first Strike) and lands a Tier 2; open the damage breakdown. Then give Sylwen Empowered and make a damaging Action; open its breakdown.
Expect: The roll dialog has the note "One More Arrow: +1[W] on a Tier that deals [W]". The breakdown lists a part "(One More Arrow)" with its own die, and a part "(Empowered)" with its 1d6! (no "−4 Flat +4 Empowered").

### reload-chip · v0.0.440 · The Reload shot's chip
Do: Give Sylwen's bow the Reload property (its sheet) and open a Weapon Attack's roll dialog with it.
Expect: The "Reload shot" chip shows in the Boons row while off (dashed, struck through), green when on. If its outline is still red, send a screenshot.

### warn-only · v0.0.440 · A Requirement only warns
Do: On Sylwen's turn, move a square, then use Wounding Shot.
Expect: A warning ("has left its square this turn (its Requirement). Used anyway."), and the Action goes on.

## Chat cards

### dmg-ledger · v0.0.454 · The damage breakdown and Apply's right-click
Do: Durgan Smites the Orc Warrior (give it Resist 2 Slash and Weak 2 Holy in its Builder, and Guard 2); on the card click the equals button beside Apply; right-click Apply and choose Apply half; then right-click Undo and choose Apply double. Then a Goblin Sneak's Rusty Knife hits Sylwen while Durgan's Shield of Faith reduces it.
Expect: The equals button opens a ledger under the Orc's row: Vigor: Slash (its dice) 8, Resist Slash −2, Guard −2, Takes 4; Resolve: Holy (its dice) 7, Weak Holy +2, Takes 9; "Lethal · Full" under it. No Full / Half / Double buttons: the right-click on Apply opens "Apply full / Apply half (rounded up) / Apply double", and on Undo the same to change it. On Sylwen's row the ledger reads "Shield of Faith −3" (not "Guard"), and Takes 0.

### save-fold · v0.0.440 · The Save card folds after its damage
Do: Aveline uses Word of Radiance on two enemies; each rolls its Save; apply the damage to both.
Expect: Once both are applied, the Save's lines fold under one line (each creature's Tier and name, an arrow); a click opens them again. The damage part stays.

### chat-follow · v0.0.453 · The chat follows a growing card
Do: With the chat at its bottom, Sylwen makes a Weapon Attack on the Orc Warrior: click Damage, then Apply. Then scroll up a little and click a damage stamp's link to its roll card.
Expect: At the bottom, the chat follows the card each time it grows (after Damage, after Apply): its last line stays in sight. Scrolled up, or after the jump to the roll card, it stays where you are.
Rev: 2
### empowered-one · v0.0.426 · Empowered with several creatures
Do: Give Sylwen Empowered; she uses Volley on three enemies (two on the same Tier).
Expect: One Empowered 1d6! is rolled, and only one creature (the first hit) takes it: it has its own line on the card.

### save-effect-words · v0.0.430 · A self-running Effect on the Save card
Do: Aveline (level 3, Escalation 6) uses Reckoning on two enemies.
Expect: They are pushed once on use; the Save card's "Effect: Each target is Pushed 2." is words (no button to push again).

## Conditions and their Tiers

### reckoning · v0.0.440 · Reckoning
Do: Aveline (level 3, Escalation 6) uses Reckoning on several enemies.
Expect: Its Save card is in the chat first (the new look, the Roll buttons), then each enemy is pushed (Push 2, one at a time); only those who roll Tier 1 or 2 are Frightened (none before its Save).
Rev: 2

### seizing-cut · v0.0.440 · Seizing Cut's Slide, then Grabbed
Do: Durgan (Arming Sword, one hand free) uses Seizing Cut on the Orc Warrior; land a Tier 3 (the GM can click Tier 3 in the roll dialog), then click Apply on the damage. Then land a Tier 1. Then left-click a condition on any card, and right-click it.
Expect: Tier 3: when the damage is applied, the Slide 1 starts by itself (place the Orc), then the Orc is Grabbed. Tier 1: the Reposition 1 starts on use. A left click on a condition applies it to the targeted or selected token; a right-click opens its rule.
Rev: 2

### shake-off · v0.0.440 · Shake Off
Do: Sylwen lands Wounding Shot on the Orc (Lingering); the GM uses the Orc's Shake Off; get each Tier once, one of them on a Lingering whose damage rolls 1.
Expect: A Save card. Tier 3: it ends. Tier 2: the next end-of-turn card is halved, rounded up (1 stays 1, 7 becomes 4; "Halved (Shake Off, Tier 2)"), then it ends. Tier 1: a line says it goes on.
Rev: 2

### species-class-card · v0.0.439 · Species and Class cards
Do: Make a new character and open the class window: look at the Paladin and a Species; on Aveline's sheet expand the Class and Species rows; send the Paladin class to the chat.
Expect: The same card look as a Feature: the name with "Class" (or "Species") on the right, the Flavor, the text as plain prose; nothing broken or empty that showed before. Using an Action still opens the roll dialog with its card (nothing changed there).

### npc-fists · v0.0.441 · An NPC's Fists
Do: Open the Orc Warrior's HUD, Basic tab, and its sheet's Basic Actions; use its Fists on Aveline.
Expect: Fists is in the Basic tab's Attack column (every Basic Action shows, in four groups); it rolls the Orc's Weapon Modifier and deals 1[W] (the Fists' die) plus its Weapon Modifier on Tiers 2 and 3. The GM uses it only when the Orc has lost its cleaver.
Rev: 3

### shake-off-other · v0.0.426 · Shake Off on another player's creature
Do: As Sylwen's player (not the GM), with the GM connected, use Shake Off on Kaela (another player's character) while she is Lingering, and get a Tier 3.
Expect: The Lingering ends (no permission error in the console).

### shake-off-ally · v0.0.427 · Shake Off by an ally: the current turn
Do: On Kaela's turn, she uses Shake Off on Durgan's Lingering and gets a Tier 2.
Expect: At the end of Kaela's turn Durgan takes half the Lingering's damage ("Halved (Shake Off, Tier 2)"), then it ends; nothing at the end of Durgan's own turn.

## Movement

### charge-new · v0.0.453 · Charge: another target, never on a creature, in the HUD
Do: In a combat, Durgan targets the Goblin Sneak and uses Charge; while the Charge line is shown, click the Orc Warrior's token; then a Charge whose line would end on Aveline's space; then click "Weapon Attack (1A, 1 Boon)" on the Charge card, on its name.
Expect: The Charge bar asks in the HUD's Situational tab (the tab opens by itself). The click on the Orc makes it the Charge's target (the line goes toward it; the bar names it); clicking an ally does nothing. A line that would end in a creature's space stops on the last free square before it. The chip's name uses the Weapon Attack (no item sheet).

### rewind-refund · v0.0.453 · Move back refunds the movement
Do: In a combat, the Orc Warrior drags its token (no Advance first: the drag buys an Advance, 1 AP) toward Kaela, who has Slip Away; on the Reactions card click Move back, once all the way (Shift-click), once part of the way (pick a square).
Expect: All the way: the Orc is back where it started with its AP and free squares as before the drag (its AP pips). Part of the way: the squares gone back return as movement left (the strip and the movement bar), its AP stay spent.

### large-difficult · v0.0.453 · A Large creature passing creatures pays Difficult Terrain
Do: Move the Ogre Chieftain (Large) past the Orc Warrior so that only the edge of its space crosses the Orc's square (not its center), with an enemy of the Ogre there; watch the ruler while dragging.
Expect: Every square of the Ogre's movement in which its space overlaps an unwilling creature's square costs double (the ruler's number), not only when its center crosses it; an ally's square costs nothing extra.

### pushed-button · v0.0.453 · A Pushed button on a card (diagnostic)
Do: With the console open (F12), the Ogre Chieftain uses Overhead Smash on Durgan with a Tier 2, in the open; click the card's "Pushed 2" button.
Expect: A bar (in the HUD's Situational tab when the HUD is up) asks which creature to push; Durgan is pushed 2. If nothing happens, Fail it with the console's errors and say where the HUD was (which token selected, folded or not).

## Reactions and Judge

### armor-faith-source · v0.0.453 · Armor of Faith says what granted it
Do: Durgan at Escalation 2 uses Shield of Faith on Aveline when the Orc Warrior's Strike would damage her.
Expect: The chat line reads "Armor of Faith (Durgan's Passive, for using Shield of Faith): Durgan gains Guard 3", both names links that open their cards.

### judge-in-hud · v0.0.441 · Judge's question in the Situational section
Do: Durgan Judges the Orc Warrior; the Orc hits Sylwen within 5 squares of Durgan. As Durgan's player, look at his HUD.
Expect: The question "Reduce that damage by 1?" is in the Situational section with Not now and Reduce by 1 only (no third Cancel button); Escape still closes it.

### avenge-kin · v0.0.440 · Avenge Kin offers itself
Do: Delete the Orcs on the scene and drag two fresh Orc Warriors from the compendium, next to each other. Aveline hits one of them with a Strike that deals damage (apply it).
Expect: The Reactions message offers the other Orc's Avenge Kin (its trigger: an ally within 2 squares takes damage from a [Strike] Action), aimed at Aveline (the attacker).
Rev: 2

### judge-question · v0.0.421 · Judge's reduction is a question
Do: Aveline Judges the Orc Warrior; the Orc damages Sylwen within 5 squares of Aveline. Answer "Not now"; then it hits Sylwen again the same round: answer "Reduce by N".
Expect: The Paladin's player is asked on the bottom bar. "Not now" reduces nothing and keeps the round's use; the second hit asks again and is reduced. Unanswered for 2 minutes counts as "Not now".

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

### passives · v0.0.409 · The Paladin's passives
Do: Durgan at Escalation 2 uses a [Divine] Reaction (Armor of Faith: Shield of Faith); Aveline at Escalation 2 uses Judge's 1 AP (Roving Judgment); Durgan reaches Escalation 4 and 6.
Expect: Guard 1 + Pow, or Judge's 1 AP costs 0; at 4, two Reaction AP (Tireless Vigil); at 6, a [Divine] Action's card shows "Setup: You Advance 3" (Hallowed Stance).

### rebuke-far · v0.0.426 · Rebuke when the enemy runs far
Do: An Orc adjacent to Aveline (with Rebuke) Advances 6 squares away from her.
Expect: The Reactions message offers Rebuke (it is measured on the squares it left, not where it stopped).

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

### cover-lines · v0.0.453 · The cover lines as they count
Do: Turn on Sylwen's Line of Effect button and target the Orc Warrior with Kaela standing so that one corner line crosses her square but the center line doesn't; then move Kaela onto the center line; then put a wall on two corners.
Expect: The four corner lines are thin and dashed (faint green when clear, red when a wall blocks them); the center line is solid and stronger (pale when clear; red-orange with a ring around Kaela when she is on it). The label reads "No cover: walls block 0 of 4 corners, no creature on the center line", then "Low cover: … Kaela on the center line", then "Medium cover: walls block 2 of 4 corners …".

### area-hover · v0.0.422 · The hover card over an area
Do: Hover a placed area: Sylwen's Covering Fire, or Aveline's Consecrated Ground.
Expect: A small card follows the mouse: its name and what it does inside.

### consecrated · v0.0.409 · Consecrated Ground and Word of Radiance
Do: Aveline places Consecrated Ground; walk an enemy in; start Durgan's turn inside. Aveline uses Word of Radiance on enemies with one Judged.
Expect: Enemies pay double in it; the ally gains Guard equal to your Power Modifier (a line). Word of Radiance: Appeal Saves, d8s against the Judged one, Pushes 3 / 2 / 1.

### covering-fire · v0.0.411 · Covering Fire, Volley, Spotter
Do: Sylwen places Covering Fire and the GM walks an enemy in; she uses Volley on a 3 Burst; she Calls Out (Spotter) a creature in Dim light.
Expect: The enemy takes [V] 2 + Weapon Modifier and pays double; Volley makes Prone on a Critical; your allies see the called-out creature Clear for 1 round.

### senses-light · v0.0.410 · Dim and Bright light on a roll
Do: Sylwen attacks with her and the enemy both in Dim light; her in Bright and the enemy in Dim; the enemy in Bright and her in Dim.
Expect: Both Dim: 1 Field Bane, no Boon. You Bright, it Dim: 1 Field Bane, no Boon. It Bright, you Dim: 1 Field Boon.

### clear-lines · v0.0.411 · Clear Lines and Opening Shot
Do: Sylwen at Escalation 4 (Clear Lines) shoots past Aveline at an Orc Engaged with Durgan; then Kaela (Opening Shot) lands a Tier 3.
Expect: No Cover from your ally and no Field Bane; the Tier 3 line names your allies who threaten the target.

### spotter-self · v0.0.426 · Call Out helps the allies, not the caller
Do: Sylwen Calls Out an Orc in Dim light; Sylwen attacks it; an ally attacks it.
Expect: Sylwen still has the Obscured Field Bane; the ally doesn't.

### volley-range · v0.0.427 · Volley's Burst within the bow's normal range
Do: Sylwen places Volley's and Covering Fire's Burst beyond her bow's normal range.
Expect: The placement is limited to the weapon's normal range (the cards read "Distance: Weapon (Normal range)").
Rev: 2

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

### log-struck · v0.0.421 · A struck line's reason
Do: Hover a struck line in the Encounter Log.
Expect: Its reason shows (one of the few hovers left).

## Windows

### pick-windows · v0.0.415 · Every question is a pick window
Do: With Aveline and Sylwen, meet a few of these: a Split Action's mode, a Strike out of your turn, a fourth Strike, Shift+E, the GM's "movement left", swap initiative, not enough AP, End Combat with a creature Dying, an Action with both hands full, Regrip, Reload, waking an Unconscious creature.
Expect: Each opens in the class window's style (no Foundry dialog) and Cancel closes it doing nothing.
