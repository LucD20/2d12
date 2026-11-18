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

### sheet-pills · v0.0.440 · The Frequency word on Reactions only
Do: Open Durgan's sheet; look at his Basic Actions and his Reactions (Bulwark of Faith, Shield of Faith).
Expect: A Basic Action's box shows only its cost ("1 AP"); a Reaction's pill shows its Frequency and cost on one line ("Encounter · 1R" for Bulwark of Faith), not wrapped.
Rev: 2

### item-traits · v0.0.440 · An item sheet's traits
Do: From Aveline's sheet open Smite's item sheet, then her weapon's; in the dark interface, then the light one.
Expect: The traits (and a weapon's properties) are plain words with a dot between them, in ink: no colored chips, in the card at the top and in the edit part.
Rev: 2

### npc-level · v0.0.440 · The NPC sheet's header
Do: Open the Ogre Chieftain's sheet (an Elite) at its usual size; change its Level, then click its image.
Expect: The header fits without widening the window: the name and rank, then Level · Stage · Size · CV · Senses, and the buttons wrap to a row of their own when there is no room. The Level saves; the image picker opens.
Rev: 2

### hud-defs-pips · v0.0.440 · The HUD's Attributes and AP pips
Do: In a combat, in the dark interface, open Aveline's HUD.
Expect: The bottom row shows AD, WD, Spd, Wpn, Pow, then Bo, Mi, Ap and In (Instinct inside the bar); a full AP pip is solid gold, a spent one dark.

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

### statblock-card · v0.0.437 · The stat block follows the card
Do: Open the Orc Warrior and the Ogre Chieftain with the one-page NPC sheet; read Avenge Kin, Ground Slam and Rally the Tribe; then drag Aveline's Rebuke onto an NPC and look at it.
Expect: Each Action reads as its card: the Trigger on a row of its own, then "Attack Weapon vs. Armor Defense; Distance …; Target …" on one line, then its Tiers; Rebuke shows "Tier 1 or 2" on one line with the label not wrapped. The look (header bar in the frequency's color, the Tier colors, the Effects box) is as before; the buttons still use the Action.

### npc-fists · v0.0.440 · An NPC's Fists
Do: Open the Orc Warrior's HUD, Basic tab, and its sheet's Basic Actions; use its Fists on Aveline.
Expect: Fists is in the Basic tab's first column (the attacks come first; the movements may be under "+N more"); it rolls the Orc's Weapon Modifier and deals 1[W] (the Fists' die) plus its Weapon Modifier on Tiers 2 and 3. The GM uses it only when the Orc has lost its cleaver.
Rev: 2

### shake-off-other · v0.0.426 · Shake Off on another player's creature
Do: As Sylwen's player (not the GM), with the GM connected, use Shake Off on Kaela (another player's character) while she is Lingering, and get a Tier 3.
Expect: The Lingering ends (no permission error in the console).

### shake-off-ally · v0.0.427 · Shake Off by an ally: the current turn
Do: On Kaela's turn, she uses Shake Off on Durgan's Lingering and gets a Tier 2.
Expect: At the end of Kaela's turn Durgan takes half the Lingering's damage ("Halved (Shake Off, Tier 2)"), then it ends; nothing at the end of Durgan's own turn.

## Movement

### setup-move · v0.0.440 · A Setup runs when you press Roll
Do: In a combat, on Durgan's turn: target an ally 4 squares away and use Lay On Hands; press Roll in the roll dialog. On Kaela's turn use Circling Shot. On Durgan's turn at Escalation 6, use Smite (Hallowed Stance's Advance 3).
Expect: The roll dialog opens first (no "out of range" block; a note "Out of range now: the Setup first"); Roll starts the Setup's bar (move your token, Continue); then the roll is made from where you stand, without the dialog again. Circling Shot: Evade 1, then the shot, Tier 3's Evade 1. Cancel on the Setup's bar cancels the Action (no AP spent). The Encounter Log writes it as one line.
Rev: 2

## Reactions and Judge

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
