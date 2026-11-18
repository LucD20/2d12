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

### small-pc-sheet · v0.0.442 · The small PC sheet
Do: In a combat, open Sylwen's sheet (it opens at 540 × 840); look over the top part, in the dark interface, then the light one.
Expect: A name plate (her portrait, her name in the serif, Level · Stage · Elf Archer · Medium · Sight, Hearing 10, "Round N" at the right with the eye for Senses); ruled lines for Health and to Down with Guard, Dominant Damage, the Vigor and Resolve gauges (damage taken, Nonlethal hatched), AD, WD, Speed, Reach, Size, Steady, Immune / Resist / Weak, Rally's pips and the two Wounds counts; seven tiles (Body to Instinct with "Vs. N" under each, then Weapon, Power and Signature with their DC); the combat line (her hooks at the left, her two hands one above the other with no word "Hands", then AP and Esc. as two rows of marks). No side panel; nothing cut off or overlapping.
Rev: 2

### small-sheet-works · v0.0.442 · Everything on the small sheet still works
Do: On Sylwen's sheet: rename her in the plate; click her portrait; click anywhere on the Vigor gauge (its word, its bar, just above or under the bar; then Shift-click, right-click); click the gauge's numbers; click Guard and right-click it; click a Rally pip; change a Wounds count; click the Body tile; click a hand tile; click an AP pip, the Reaction AP diamond and an Escalation pip; the eye (Senses).
Expect: Each does what it did on the old sheet: the name saves, the image picker opens, damage is added anywhere on the gauge (Nonlethal with Shift) and removed with a right-click, the numbers open the HP edit (and add no damage), Guard goes up and down, Rally and the Wounds save, Body rolls its Check, the hand menu opens, the AP and the Escalation change, the Senses window opens.
Rev: 2

### action-bars · v0.0.442 · Each Action is one bar; the stamp is its Use button
Do: On Sylwen's sheet, Actions tab: look at the bars; click Snap Shot's bar (not its stamp), then click Quick Shots' "2 AP" stamp; with 1 AP left, look at a 2 AP stamp and click it.
Expect: Each bar: the cost stamp(s) at the left, the name with its automation diamond, "Distance · Vs." at the right (8 / 16 / 24 · AD). Under "Once per round" no Frequency is written at the end; under Reactions the word stays, muted (Snap Shot: "Turn"). A click on the bar opens the short card under it (no Flavor, no rank word, no Distance, no Attack line, no Your roll); the stamp opens the roll dialog on that Version. A stamp she can't pay is struck and dashed; a click still uses it with a warning, as the old Use button did.
Rev: 2

### combat-line · v0.0.442 · The combat line: the hooks, the Hands, AP and Esc.
Do: In a combat, open Aveline's sheet at Escalation 4 with both hooks left; then use her Critical hook; then give Sylwen her Dagger in the off hand; then narrow and widen Aveline's window.
Expect: At the left "Hooks left" and each hook in bold with a small gold diamond ("Critical", "Kindled Wrath"); when one is used it goes, with none "None this encounter", faded. At the right two rows: AP (the AP pips, the Reaction AP's diamond, a hairline, the Strikes as orange slashes) and Esc. (six diamonds, the 2nd, 4th and 6th ringed, filled up to 4, then "4"). The line keeps the same height with one or two hand tiles and with any number of hooks: long hooks shrink, then go to two smaller lines, never past the line.

### out-of-combat · v0.0.442 · Out of combat
Do: Open Sylwen's sheet with no combat.
Expect: The combat line says only "Out of combat", centered and faded, with her hand tiles at its right.

### build-ink · v0.0.442 · The Build tab's costs in ink
Do: Open Aveline's Build tab.
Expect: Each Action's cost is an outlined stamp in ink ("2 AP", "1R"), its Frequency a muted word; no colored pill or square.

### two-hands-stamp · v0.0.441 · Two weapons that fit one Action
Do: Give Aveline a second one-handed melee weapon in her off hand (Items tab), then look at her Weapon Actions on the Actions tab and use one with each small hand button.
Expect: After the stamp, a small button for each hand (the sword icon with 1H / 2H); each uses the Action with that hand's weapon. With one fitting weapon there is only the stamp, and it uses that weapon (a two-handed weapon in one hand still asks first).

### small-npc-sheet · v0.0.441 · The small NPC sheet
Do: Open the Orc Warrior's sheet (540 × 760), then the Ogre Chieftain's (an Elite), in and out of combat.
Expect: The plate in the rank's color (Standard red, Elite purple) with "Standard" or "Elite" and the round; the scroll icon posts the stat block to the chat (GM); "Generate Action · Browse compendium · New Action" as links over the Actions; no Rally, Wounds, Hands or Signature; the Ogre's combat line shows Elite Escalation with its pips, rungs and phases. The Builder tab fits the width (its rank and role buttons wrap). Avenge Kin's bar says "Round".

### npc-statblock-gone · v0.0.441 · The one-page NPC sheet is retired
Do: In a world where an NPC used the one-page stat block sheet, reload as the GM and open that NPC; look in Game Settings for "New NPCs open with"; open an NPC's sheet settings (the window's menu).
Expect: The NPC opens on the small NPC sheet; the setting is gone; the sheet list has no "2d12 NPC Stat Block (one page)". "Post stat block" still posts to the chat.

### sheet-tabs-fit · v0.0.441 · The other tabs in the small sheet
Do: On Sylwen's sheet open Effects, Items, Build, Mastery, Upkeep and Notes; on the Orc Warrior's, Builder and Loot.
Expect: Everything is readable at 540 px wide (one column where there were two); nothing is cut off at the right; the Upkeep tab's Wounds section has Roll Dying / Roll Shattered (moved there from the side panel).

### e6-blunt · v0.0.441 · A damage type's word on a dark card
Do: In the dark interface, open the Orc Warrior's Cleaver on its sheet and Aveline's Smite; then the same in the light interface.
Expect: "Slash", "Blunt", "Holy" and their flat amounts are in their bright color on the dark card (readable), and in the parchment's darker ink on the light one. A trait word in a card's text ("[Strike]" in Avenge Kin's Trigger) is plain bold ink, with no tinted box.

## The HUD

### hud-identity · v0.0.441 · The HUD's identity column
Do: In a combat, select Durgan's token; then Sylwen's with a changed Speed (give her Hindered).
Expect: Under the bars: Guard, Rally and Steel Yourself; AP and Esc.; a row for conditions; then "AD 14  WD 13  Speed 4 | Weapon +1  Power +2" and "Body +2  Mind +1  Appeal −1  Instinct +2" in words (no Wpn, Pow, Bo, In), all inside the bar. A click on Instinct rolls the Check, Shift-click the Save; Sylwen's halved Speed is underlined.

### hud-conditions · v0.0.441 · Conditions as marks under AP
Do: Make Sylwen Prone and Hindered (end of turn), then add Dazed and Lingering 2.
Expect: With two, each is its icon in a small square and its word ("Prone", "Hindered EoT"); with four, the icons alone (a duration keeps its small text). The HUD's height never changes. A click opens the Effect.

### hud-basic-tab · v0.0.441 · The Basic tab
Do: Select Sylwen, make her Prone, open the HUD's Basic tab; click Stand's "1 AP".
Expect: Four columns, Attack, Movement, Control, Utility, every Basic Action on one line with its cost stamps (no "+N more"); Advance, Evade and Charge are dim with struck stamps, in their place. Stand's stamp uses Stand. The Orc Warrior's Basic tab shows its Fists in the Attack column.

### hud-right · v0.0.441 · The right column: Situational, Hands, macro bar
Do: Select Sylwen's token with nothing waiting; click a hand tile; drag a macro onto the bar; make her Prone.
Expect: The right column: "Nothing waiting." on top, her two hand tiles side by side (Hunting Bow Main, Free (Fists) Off), Foundry's macro bar as one row of ten at the bottom (the macros still work). A hand tile opens the Hands panel. Prone puts "Prone" with Stand · 1 AP, Crawl 1 · 1 AP and Crawl 3 · 2 AP in the Situational section (gold top line); each button uses that Version.

### item-traits · v0.0.440 · An item sheet's traits
Do: From Aveline's sheet open Smite's item sheet, then her weapon's; in the dark interface, then the light one.
Expect: The traits (and a weapon's properties) are plain words with a dot between them, in ink: no colored chips, in the card at the top and in the edit part.
Rev: 2

## Starting a combat

### minion-squad · v0.0.440 · Minion squads: even, the GM's groups, the GM's order
Do: Make the Goblin Sneak a Minion (its sheet's rank), put four Goblin Sneaks, Aveline and Sylwen in a combat and open the Initiative window. Click one Goblin's "Squad 1 of 2". Roll. Start the combat; when a Goblin squad's turn comes, and at the end of that Goblin's turn, answer the bottom bar.
Expect: Two squads of two by default (not three and one); a click moves that Goblin to the other squad (the label changes). One roll per squad ("×2" on the card), each Goblin with its own turn, no PC's turn inside a squad. Before a squad's turn the bar asks which Goblin goes now; the one picked goes, and at the end of its turn the bar asks again while two or more are left. A Minion has 3 AP and no Reaction AP.
Rev: 3

## The roll dialog

### smite-dice · v0.0.440 · Smite's dice in the roll dialog
Do: Aveline at Escalation 3: Judge the Orc Warrior, then Smite it; look at the roll dialog's Tiers, tick "Reaction AP: 1 more Smite die", look again. Then Smite a Goblin Sneak that isn't Judged.
Expect: The Reaction AP chip shows (not under "+1 off"). Against the Judged Orc the Tiers read 3d8! Holy (Tier 3: 4d8!) and one more die when ticked; the chat card's Tiers say the same. Against the Goblin: d6s.

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

### save-fold · v0.0.440 · The Save card folds after its damage
Do: Aveline uses Word of Radiance on two enemies; each rolls its Save; apply the damage to both.
Expect: Once both are applied, the Save's lines fold under one line (each creature's Tier and name, an arrow); a click opens them again. The damage part stays.

### resolve-color · v0.0.440 · The Resolve blue on a dark card
Do: In the dark interface, send Aveline's Smite to the chat.
Expect: "[R] 1d6!" in the Smite dice line is an easy-to-read light blue.

### chat-follow · v0.0.418 · The chat follows a growing card
Do: Aveline uses Smite (its card grows when the damage is written into it); scroll up a little in the chat, then click a damage stamp's link to its roll card.
Expect: At the bottom, the chat follows the card as it grows. The jump to the roll card stays there (no snap back down).

### chat-removed · v0.0.418 · Lines removed from the chat
Do: Play a round with Aveline, Sylwen and two Orcs: someone becomes Bloodied, Durgan uses a Reaction, someone goes Down, someone moves.
Expect: No Bloodied / Strained, Reaction-use, "next damage reduced", "is Down" or movement lines. The stamp is stretched; the Critical's arrow sits over CRIT, the CRIT zone shows only on a Critical; Bloodied is in the Vigor red on dark.

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

### card-surfaces · v0.0.438 · The same card in the chat, a tooltip and the HUD
Do: In the dark interface, send Aveline's Smite to the chat (right-click its row, Send to chat), hover one of her Actions' rows, and open an Action from her HUD; then do the same with a light sheet.
Expect: The Vigor heart and Resolve brain icons are the light red and blue of the sheet's card everywhere (no dark red on dark), the keyword highlights the same color; a card in a tooltip reads left-aligned, as in the sheet.

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

### setup-in-hud · v0.0.441 · A Setup's movement in the HUD
Do: In a combat, select Kaela's token and use Strafe (2 AP); move her token; then use an Action whose card gives an Evade or Advance (Sylwen's Footwork).
Expect: No floating bar over the map: the Situational section shows "Strafe: You Advance. Move your token, then Continue." with Continue: the roll and Cancel the Action (Enter and Escape still work). The Evade / Advance shows there too with End movement (and Advance instead for an Evade). With the HUD turned off they float at the bottom as before.

### setup-move · v0.0.440 · A Setup runs when you press Roll
Do: In a combat, on Durgan's turn: target an ally 4 squares away and use Lay On Hands; press Roll in the roll dialog. On Kaela's turn use Circling Shot. On Durgan's turn at Escalation 6, use Smite (Hallowed Stance's Advance 3).
Expect: The roll dialog opens first (no "out of range" block; a note "Out of range now: the Setup first"); Roll starts the Setup's bar (move your token, Continue); then the roll is made from where you stand, without the dialog again. Circling Shot: Evade 1, then the shot, Tier 3's Evade 1. Cancel on the Setup's bar cancels the Action (no AP spent). The Encounter Log writes it as one line.
Rev: 2

## Reactions and Judge

### rx-situational · v0.0.441 · A trigger shows only in the Situational section
Do: Sylwen keeps 1 AP and her Reaction AP; the Goblin Sneak moves next to her. As her player, have her Actions tab open.
Expect: The chime and the name on the map as before; the HUD stays on the Actions tab (no jump to Reactions); the Situational section shows "Snap Shot · Reaction", the trigger's line and Use · 1R / Pass, all inside the bar (nothing hangs under it). Use and Pass answer the Reaction.

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

### pick-forms · v0.0.415 · The forms
Do: On Aveline's sheet open the Senses editor; in the Encounter Log, Edit line and Add a note; place an area by hand; Recovery; on an NPC, Generate Weapon.
Expect: Each is a pick window; Save keeps what you typed; Generate Weapon's preview follows the type.
