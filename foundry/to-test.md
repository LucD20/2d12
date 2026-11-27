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

### rt-pregens · v0.0.527 · The pregens' new Health and Rally Points
Do: In a new world (or after importing them again from the PCs compendium), open Aveline, Durgan, Sylwen and Kaela (the level 1 ones) and look at their Health bars and the Rally Points line.
Expect: Aveline: Vigor 33, Resolve 17, Health 50, each Rally Point heals 13. Durgan: Vigor 33, Resolve 17, Health 50, heals 13. Sylwen: Vigor 25, Resolve 16, Health 41, heals 11. Kaela: Vigor 27, Resolve 14, Health 41, heals 11. Their Rally Points count is unchanged (Paladins 7, Archers 6). The Paladin class item says high 30 / low 15, the Archer's high 24 / low 12.

### rt-update · v0.0.527 · An existing world's characters get the new Health
Do: In your playtest world, accept "Update from the compendium" when asked (or run it from the system settings), then open Durgan.
Expect: His class item says high 30 / low 15 and his sheet shows Vigor 33, Resolve 17, Health 50 (a Rally Point heals 13); the damage he had is kept.

### rt-creatures · v0.0.527 · The creatures' new Health and dice
Do: Import the Orc Warrior and the Ogre Chieftain again from the NPCs compendium and open their sheets; with the Orc Warrior, roll Hamstringing Axe against Durgan until a Tier 2 and a Tier 3; with the Ogre Chieftain, roll Crushing Grip against Aveline.
Expect: Orc Warrior: Vigor 28, Resolve 17, Health 45; Hamstringing Axe's card reads Tier 2 "[V] 2 + 1d10! Sl", Tier 3 "[V] 8 + 1d12! Sl; Hindered (EoT)", its Critical row still "[V] 1d10! Sl"; the damage card rolls those dice and explodes on a 10 (or a 12). Ogre Chieftain: Vigor 55, Resolve 35, Health 90; Crushing Grip "2 + 1d10! Bl" / "8 + 1d12! Bl; Grabbed"; Crack the Ground's Tier 1 "20 + 2d12 Bl", Tier 2 "11 + 1d12 Bl"; Backhand's button deals 2.

### ct-cards · v0.0.522 · The Paladin and Archer traits on the class cards
Do: Open Aveline's sheet and look at Smite, Judge and Drawing Light (the Actions tab and each card's preview), and her Feature Sworn Blade; then Kaela's Strafe, Slip Away and Harrying Shot, and her Feature Shifting Aim. Use Kaela's Strafe once and look at its chat card.
Expect: Smite's traits read "Signature · Weapon · Strike · Divine · Paladin · Unfailing", Judge's "Divine · Paladin", Drawing Light's end "Divine · Magical · Paladin"; Strafe's "Weapon · Projectile · Ranged · Strike · Archer", Harrying Shot's end "Strike · Archer"; Slip Away now has a traits line, "Archer". The class word is the Keywords' color, like Divine, with no fill; nothing wraps onto a second line that didn't before. Sworn Blade and Shifting Aim show no trait. The chat card's traits line ends "Archer".

### ct-update · v0.0.522 · An existing world's class cards get the trait
Do: In an existing world, after the update, accept "Update from the compendium" (or run it from the system settings); open Durgan's Lay On Hands and Sylwen's Quick Shots.
Expect: Lay On Hands reads "Divine · Focus · Paladin", Quick Shots "Weapon · Projectile · Ranged · Strike · Archer"; their class picks (Hallmark Action, Reaction) are kept.

### hq-other · v0.0.521 · No "Special Actions" on an NPC; Hurled Goblin and Lay On Hands' words
Do: As the GM, open the Ogre Chieftain's sheet (Hurled Goblin's card), add an Effect with a "More uses of a Frequency" setting and open its Details; then open Durgan's Lay On Hands.
Expect: The setting says "its own Round Actions (not the Basic Actions) can be used twice per turn-cycle" (its list line "Own Round Actions twice per turn-cycle"); no "Special" in either; Hurled Goblin's Effect reads "the ogre places the Minion in an empty square adjacent to the target (hit or miss); it takes no damage and triggers no Reactions."; Lay On Hands' Setup button reads "Advance 5 squares".

### hq-human · v0.0.521 · A Human's choices lock after level 1
Do: Log in as a player who owns Aveline (Human Paladin, level 1 confirmed) and click Species: Choices on her Build tab. Then do the same as the GM.
Expect: As the player: the Species window shows her two Attributes and the +3 side ticked, every option off (hovering one gives the reason: "Locked: your level 1 is confirmed..."), the same reason at the bottom, and only a Close button. As the GM: the options work and Save choices saves them.

### cu-cards · v0.0.520 · Tend and the Basic Actions' new cards
Do: In a world from before v0.0.520, refresh the Basic Actions when asked (or Update from the compendium, Basic Actions too), then open Aveline's Actions tab and the HUD's Basic tab.
Expect: Heal is now Tend (in Utility, same rolls and Rally Point button); Relocate has no Strike trait; Seek's card writes its lines once, with a Use button for 1 AP and one for 2 AP; Crawl's 2 AP block starts with "Requirement: Your Speed is 5 or higher."; Advance's card has its Advance button, and using Advance still moves at once (no card first).

### cl-escalation · v0.0.520 · An NPC's Escalation switch without the default ladder
Do: Open the Ogre Chieftain's sheet, Builder tab: turn Escalation on (no "Default ladder" switch beside it any more). Start a combat with it and Aveline, and play two rounds.
Expect: The Ogre's Escalation rises each round as before; the chat line says "Ogre Chieftain's Escalation rises to N." with no "Now: Pressing..." text; its combat line shows the Bloodied +1 and Strained +1 hooks and the Escalation marks, but no Pressing / Relentless / Second Wind rungs; its first attack each round gets no free Boon. The sheet opens without an error.

### cl-ruler · v0.0.520 · No Ruler line in Designer mode
Do: Turn on Designer mode, open Aveline's Smite card on her sheet, then use Smite against the Orc Warrior.
Expect: No "Ruler" line on the card or under the chat card (the Odds and the Automation lines stay in Designer mode).

### bst-sheets · v0.0.519 · Rev 2 · The four playtest creatures' sheets
Do: In a new world (or after importing them again from the NPCs compendium), open the Goblin Sneak, the Grave Wisp, the Orc Warrior and the Ogre Chieftain.
Expect: Goblin Sneak: Minion, CV 30, 2 ticks (a "Ticks 2/2" bar, no Vigor or Resolve), AD 13, WD 12, Weapon and Power +2, Speed 6, Shiv, Jeer, Knife in the Back, Shriek and Scatter. Grave Wisp: Grunt, CV 50, Vigor 8, Resolve 14 (Health 22), AD 12, WD 14, Speed 6, its new portrait, the damage line "Immunity Cold · Resistance Psychic 3 · Weakness Holy 3", Drifting, Slipping Touch, Guttering Glance, Pass Through, Dying Flare. Orc Warrior: Standard, Vigor 28, Resolve 17 (Health 45), 13 / 13, Speed 5. Ogre Chieftain: Elite, CV 200, Vigor 55, Resolve 35 (Health 90), AD 14, WD 12, Large, Reach 2, Steadiness 1, Speed 5, no Escalation; Crushing Grip, Roar, Great Sweep, Hurled Goblin, Crack the Ground, Backhand. None of the old cards (Rusty Knife, Club, Rally the Tribe...).

## Hiding

### ox-pointout · v0.0.526 · Rev 2 · Point Out on a creature Unsensed for another reason than Hide
Do: In a combat, give Kaela the Blinded status and put a Goblin Sneak more than 10 squares from her, in bright light where Sylwen sees it. Use Sylwen's Point Out on the goblin (Tier 2: pick Kaela). Move the goblin one square. Then use the Goblin Sneak's Hide.
Expect: Before: Kaela's roll against the goblin skips it (Unsensed). After Point Out: a line "Kaela perceives Goblin Sneak as Hidden (was Unsensed)"; her Actions against it are Doomed (Hidden), not skipped. After the goblin moves, it is still Hidden to her. After the goblin uses Hide, it is Unsensed to her again. A goblin Hidden from Hide that Sylwen herself perceives only as Hidden stays Hidden for Kaela (never better than Sylwen).

### ox-thickwall · v0.0.525 · A thick wall blocks Hearing
Do: In a combat, put the Orc Warrior behind a wall, within 10 squares of Kaela and out of her sight. Open that wall's settings (double-click it) and tick the new "Thick wall (2d12)" box under the Sound restriction, then untick it.
Expect: Ticked: the orc's sound ripple goes from Kaela's view and her Actions skip it (Unsensed); the box shows ticked when the settings are opened again. Unticked: the ripple is back (Hidden through a thin wall).

## The HUD

### bst-ticks-show · v0.0.519 · A Minion's ticks, for the GM and the players
Do: Put two Goblin Sneaks on the map in a combat. Look at them as the GM, then log in as a player (or use a player's view). Right-click one goblin for the Token HUD; select it for the system's HUD.
Expect: Each goblin shows two red pips at the top of its token, for the players too. The HUD shows one bar "2/2 ticks" (two segments); the Token HUD has one box with 2 in it (type -1: one pip goes; +1: it comes back).

## Starting a combat

### bst-squads · v0.0.519 · Squads of 2
Do: Put four Goblin Sneaks in a combat and open the Initiative window.
Expect: Two squads of two (never three in one); putting three in one squad shows "3 in squad (book: ≤2)".

## The roll dialog

### ct-filter · v0.0.522 · An Effect can name [Paladin] Actions
Do: As the GM, add an Effect to Aveline with a "Boons and Banes" setting (1 Boon) whose trait filter is "all of: Paladin" (the picker's Keywords group); roll her Smite, then her Basic Attack. Remove the Effect after.
Expect: The picker's Keywords list Archer, Divine, Fear, Focus, Magical, Paladin, Subtle, Unfailing. Smite's roll dialog has the Boon; the Basic Attack's doesn't.

### cu-choose · v0.0.520 · You choose the Attribute you roll
Do: Kaela targets the Orc Warrior and uses Trip.
Expect: the roll dialog has two Roll buttons, "Roll · Instinct +N" and "Roll · Body +N" (the higher first); the second one rolls at once with Body, against the orc's Body DC (the chat card says Body).

### cu-fists · v0.0.520 · The Basic Attack never uses the Fists
Do: Aveline stows her weapons (both hands empty) and uses Basic Attack, then the Fists Basic Action.
Expect: Basic Attack is refused with a note ("holds no weapon ... use the Fists Basic Action"); Fists works as before. With her sword in hand, Basic Attack offers only the sword.

### cu-drawing · v0.0.520 · Drawing Light isn't Doomed for being Engaged
Do: Durgan stands next to the Orc Warrior and uses Drawing Light on it.
Expect: no "You are Engaged (Doomed)" chip in the roll dialog (Kaela's bow shot from next to the orc still gets it).

### bst-cornered · v0.0.519 · Cornered: 1 Boon on the Bloodied orc's Shove
Do: Damage the Orc Warrior to Bloodied (22 Vigor damage), then use its Shove on Durgan. Do it again after healing it below 22.
Expect: Bloodied: the roll dialog shows a "Cornered" Boon, on; the roll has it. Not Bloodied: no Cornered chip. Its Trip never gets it.

### bst-knife · v0.0.519 · Knife in the Back needs a flank
Do: With a Goblin Sneak, target Kaela and use Knife in the Back, once with another goblin on Kaela's opposite side and once alone.
Expect: Flanking: no warning, the flanking Field Boon in the dialog. Alone: the dialog warns "doesn't flank Kaela (its Requirement). Used anyway."

## Chat cards

### ox-shakeoff · v0.0.525 · Shake Off's card: the book's Save line and three Tiers
Do: Look at Shake Off on Durgan's sheet, its hover card and the HUD's card. Give Durgan a Lingering (the Orc Warrior's Barbed Javelin, Tier 3) and use Shake Off on him; click the card's "The target's Save" button.
Expect: Every card reads Save (the better of the Lingering's two Attributes, against DC 13 or the DC the Lingering writes) with the button at its end, then Tier 1, Tier 2, Tier 3 as three lines; no paragraph repeating them. The button rolls Durgan's Save against the Lingering, as before.

### ox-empowered · v0.0.525 · Empowered's die deals the damage you choose
Do: Make Aveline Empowered (the Conditions) and use Binding Light on the Orc Warrior until a Tier 2 or 3; roll its damage. Then, next turn, Empowered again, use her Basic Attack.
Expect: Binding Light deals two kinds (Vigor from the Longsword, Resolve Holy): the bottom bar asks which one the 1d6! deals, and the die joins that one. The Basic Attack deals one kind: no question, the die joins it.

### hq-crit-basic · v0.0.521 · The Basic Attack's Critical row
Do: With Aveline, make Basic Attacks against the Orc Warrior until one is a Critical (or set the dice), first with nothing else, then with Smite's Holy damage on the same attack.
Expect: The card shows "Critical: [V] 1d10!" under Tier 3. On the Critical, the pick bar asks "Its 1d10!: choose the damage type, or don't apply it": one option, her sword's Slash ([V] 1d10! Sl), then Don't apply; with Smite, a second option [R] 1d10! Ho. The die is rolled with the chosen type and explodes; the damage card shows the Critical line; the Encounter Log counts the Critical as before.

### hq-crit-npc · v0.0.521 · The creatures' Critical rows
Do: With the Goblin Sneak, roll Shiv against Kaela until a Critical; then the Orc Warrior's Hamstringing Axe against Durgan; then the Grave Wisp's Guttering Glance against Sylwen.
Expect: Each card shows its own Critical row ([V] 1d10! Pi, [V] 1d10! Sl, [R] 1d10! Ps). On the Critical the pick bar asks "Apply: [V] 1d10! Pi." / Don't apply; the 1d10 explodes on a 10; the damage is the row's pool and subtype.

### mn-shiv-crit · v0.0.523 · A Critical on Shiv offers its row; no default row
Do: With the Goblin Sneak, roll Shiv against Kaela until a Critical (or set the dice). Then, on the Goblin Sneak's sheet, make a new Action, give it a Tier 2 of [V] 1d4 Pi and tick "Basic attack" in its sheet.
Expect: On the Critical the pick bar asks "Apply: [V] 1d10! Pi." / Don't apply; applied, the 1d10 explodes on a 10 (the face counts 9 and is rolled again) and deals Pierce to Kaela's Vigor. The new Action's Critical row stays empty when "Basic attack" is ticked: nothing fills it, and a Critical with it adds nothing.

### mn-empowered · v0.0.523 · Rev 2 · A Minor enemy's Empowered die explodes
Do: Outside a combat, give the Grave Wisp Empowered by hand from the Conditions, then roll its Slipping Touch against Sylwen until a Tier 2 or 3, and again until the Empowered die shows a 6 (or set the dice). Then the same with a Goblin Sneak (Empowered from the Conditions) and its Shiv against Kaela.
Expect: The damage card has the Empowered die as 1d6! (Cold for the wisp, Pierce for the goblin); on a 6 it counts 5 and is rolled again, the exploded face shown, as it does for the Orc Warrior. The Tier's own dice (1d10, 2 + 1d12 since v0.0.527) still never explode (they write no !).

### bst-ticks-damage · v0.0.519 · Damage removes a Minion's ticks by the Tier
Do: With Sylwen, make a Basic Attack against a Goblin Sneak; apply the damage of a Tier 1 hit (roll again until you get one), then of a Tier 2 on another goblin.
Expect: The Tier 1 removes 1 tick ("Took 1 tick"; the goblin counts as Bloodied: one pip left); the Tier 2 removes 2 and the goblin goes Down. The damage's size doesn't matter. A heal on the first goblin (Durgan's Lay On Hands) gives back 1 tick and ends Bloodied.
Do: With Aveline, use Word of Radiance (or any Save Action) on two goblins.
Expect: Each goblin's own Save, turned over: a Tier 1 Save removes 3 (Down), a Tier 2 removes 2, a Tier 3 with no damage removes none.

## Conditions and their Tiers

### hq-lingering · v0.0.521 · Rev 2 · Lingerings of different subtypes run together; Shake Off ends one
Do: Give Durgan a Lingering 1d10 Pi (the Orc Warrior's Barbed Javelin, Tier 3, since v0.0.527), then a Lingering 1d6 Fi (by hand from the Conditions), then another Lingering 1d10 Pi. End his turn. Then use Shake Off on him.
Expect: He keeps two Lingerings: the Piercing one (the second Piercing one, not higher, leaves the first) and the Fire one. At the end of his turn each deals its own damage card. Shake Off asks in the bottom bar which Lingering it ends (both listed by name); the Save uses that Lingering's Attributes and DC, and only that one ends (or is halved on a Tier 2).

## Movement

### cl-crawl · v0.0.528 · Crawl ignores Difficult Terrain; no square without paying for it
Do: In a combat, draw a Difficult Terrain region next to Kaela and put Sylwen beside her. Make Kaela Prone and Crawl (1 AP) 1 square into the region; Crawl again (1 AP) into Sylwen's space and try to end there. Then make Kaela Stand, step out of the region, use Advance and move in the open until she has 1 square of it left, and try to drag her 1 square into the region.
Expect: The Crawl's area shows the square in the region (not hatched) and she enters it for 1 square, as on open ground. Sylwen's space is in the second Crawl's area, but ending there is refused ("You can't end your movement in Sylwen's space"). Standing, each square of the region costs her Advance 2 (the ruler shows it); with 1 square of the Advance left the area stops short of the region, and the drag into it spends another AP (a new Advance), as before v0.0.525.

### ox-dead · v0.0.525 · A dead creature doesn't get in the way
Do: In a combat, take a Goblin Sneak to 0 with Aveline (no Unconscious status on it). Advance Durgan through its square, then end a movement in it. Then give another goblin at 0 the Unconscious status and move Durgan through it.
Expect: The dead goblin's square costs nothing extra and Durgan can stop in it (the movement area includes it). The Unconscious goblin's square costs double and Durgan can't end there.

### ox-charge · v0.0.525 · Charge stops at the weapon's normal Range
Do: Durgan (Arming Sword) Charges an Orc Warrior 5 squares away. Then Sylwen, with her Hunting Bow in hand, Charges an orc about 16 squares away; then with only her Dagger in hand.
Expect: Durgan stops adjacent, as before. Sylwen with the bow stops on the first square from which the orc is within 12 squares (the bow's normal Range), the line and texts saying "in Range"; an orc already within 12 is "too close". With the Dagger, if it is a Thrown weapon the bottom bar first asks "Dagger (in hand)" or "Dagger (thrown)", and she stops where that Range reaches.

### cu-inway · v0.0.520 · A creature Down but still fighting holds its space
Do: Durgan is Dying and keeps fighting; as the GM, drag the Orc Warrior through Durgan's square. Then Durgan collapses (Unconscious) and you drag it again.
Expect: first, the move is refused (his space blocks, like any standing creature); after he collapses, the orc can pass through his square as Difficult Terrain (never ending there).

### bst-ticks-collision · v0.0.519 · A Collision removes 1 tick, never a second one for the same Action
Do: With Durgan, Shove a Goblin Sneak into a wall (Tier 2). Then give a fresh goblin 3 ticks (its Builder tab, Frame, Ticks 3), catch it beside a wall with Aveline's Word of Radiance (until its result against it removes 2 ticks) and click the card's Pushed button to push it into the wall.
Expect: The Shove's Collision removes 1 tick (the Shove dealt it no damage). Word of Radiance's result removes its ticks once (1 left) and the Collision of its own Push (clicked from its card) removes none.

### bst-drift · v0.0.519 · The Grave Wisp's Drifting
Do: In a combat, drag the Grave Wisp through Aveline's space and through another wisp's, then try to end its movement in Aveline's square.
Expect: The movement passes through both spaces with no extra cost (no Difficult Terrain); ending in a creature's space is refused. An Orc Warrior can't pass through Aveline's space (it blocks).

## Reactions and Judge

### rt-judge · v0.0.527 · Judge no longer reduces damage
Do: At the start of an encounter, Aveline Judges the Orc Warrior; Durgan stands within 5 squares of her. The Orc Warrior hits Durgan with Hamstringing Axe (a Tier 2), then again in a later round.
Expect: No question "Reduce that damage by 2?" and no "Judge: the damage to Durgan is reduced" line: Durgan takes the whole damage both times; the Encounter Log shows no "Judge (Aveline)" reduction. The orc still counts as Profane for Aveline (her Smite rolls d8s against it).

### rt-feint · v0.0.527 · Feint: 1 Boon on a Tier 2, 2 Boons on a Tier 3
Do: Durgan Feints the Orc Warrior until a Tier 2 (Designer mode: Force a Tier, or roll), then makes a Basic Attack against it; next turn, a Feint with a Tier 3, then a Basic Attack against it; then a Basic Attack against another creature after a Tier 3 Feint.
Expect: Tier 2: the chat line says "+1 Boon on next [Strike] against Orc Warrior this turn" and the Basic Attack's roll dialog shows 1 Boon from Feint (Orc Warrior). Tier 3: "+2 Boons", the roll shows 2 Boons and is not Favored. The Effect is spent on that Strike; a Strike against another creature doesn't use it. Feint's card reads Tier 2 "You gain 1 Boon...", Tier 3 "You gain 2 Boons...".

### ox-shifting · v0.0.525 · Shifting Aim on another creature's turn
Do: On the Orc Warrior's turn, push Sylwen 1 square (the GM's Alt-drag, or the orc's Shove), then use a [Ranged, Strike] of Sylwen's during that turn (Snap Shot if its Trigger fits, or her Basic Attack from the sheet). Then a second one in the same turn.
Expect: The first roll dialog shows Shifting Aim's Field Boon (on); the second doesn't (a Strike since). With no move during that turn, no Boon.

### ox-judge · v0.0.525 · Judge's re-Judge when the Judged creature goes Down is a Reaction
Do: Aveline Judges an Orc Warrior; take it Down. Click the message's Judge button with another orc targeted. Then do it again with Aveline Staggered.
Expect: The message's button reads "Judge (0R)"; the card it posts says 0R and the orc is Judged. Staggered: the dialog warns "Aveline is Staggered: no Reactions until it ends. Used anyway." The start-of-encounter message's button still reads "Judge (0 AP)".

### cu-feint · v0.0.520 · Feint's Critical blocks only the Reactions you trigger
Do: Kaela Feints the Bloodied Orc Warrior with a Critical (Designer mode: Force a Tier, or roll until one), then hits it; then Sylwen hits it.
Expect: Kaela's hit: Blood for Blood is not offered (a note: Feinted); Sylwen's hit: Blood for Blood is offered against Sylwen as usual.

### bst-blood · v0.0.519 · Blood for Blood is offered by itself
Do: Make the Orc Warrior Bloodied with Sylwen's Basic Attack from 2 squares away, then hit it again with Vigor damage; then hit it with Resolve damage (Durgan's Drawing Light), and once from 4 squares away.
Expect: The Vigor hit that Bloodies it (and the next) offers Blood for Blood (Use / Pass); Use: Advance up to 2, then the Basic attack button with 1 Bane takes the axe when Sylwen is in reach (the javelin when she isn't; both: a pick window). The Resolve hit and the hit from 4 squares offer nothing.

### rt-npcrally · v0.0.527 · An NPC has no Rally Points
Do: Deal 10 damage to a Grave Wisp (make it Durgan's ally for the test, or as the GM). With Durgan, use Lay On Hands at 2 AP on the wisp and click its Rally Point button.
Expect: A warning "Grave Wisp has no Rally Points." (or "no Rally Point left"); the wisp heals nothing from it (the Guard of Lay On Hands still lands).

### bst-flare · v0.0.519 · Dying Flare when the Grave Wisp would go Down
Do: Bring the Grave Wisp to 1 Health, put Aveline and an Orc Warrior next to it, and hit it with Kaela.
Expect: Before the damage lands, the Reactions message offers Dying Flare (an Interrupt). Use: the 1 Emanation around the wisp, an Instinct Save for Aveline and the orc (DC 13; the wisp itself is not in it); a Tier 1 gives Hindered (EoT). Then the held damage lands and the wisp goes Down (nothing is saved).

### bst-shriek · v0.0.519 · Shriek and Scatter when a goblin goes Down
Do: Three Goblin Sneaks within 6 squares of each other; end one goblin's turn with 1 AP kept. Take another goblin Down with Sylwen.
Expect: The goblin with a kept AP is offered Shriek and Scatter (it has no Reaction Point: the AP pays); Use: Evade 1 and the Jeer button. A goblin with no AP left shows in the "No Reactions" line. A goblin farther than 6 squares isn't offered it.

### bst-backhand · v0.0.519 · Rev 2 · The Ogre's Backhand doesn't stop the mover
Do: Move Durgan (Advance) into a square adjacent to the Ogre Chieftain, with movement to spare. Then Evade into an adjacent square with Aveline.
Expect: Durgan's movement is offered Backhand (a Trigger, no Move back on the message); Use: the 2 Blunt damage button (1 before v0.0.527) and Pushed 2. Durgan still has the rest of his movement. Aveline's Evade offers nothing.

## Areas, light and Cover

### bst-crack · v0.0.519 · Crack the Ground leaves a broken floor
Do: With the Ogre Chieftain, use Crack the Ground (aim the Line 3 at Aveline and Durgan in a row). Then move Aveline and the ogre across the Line.
Expect: The Line 3 starts from the ogre's space; each creature in it makes an Instinct Save against DC 13 ([V] 5 + 2d8 / 3 + 1d8 / nothing). The Line stays on the map; moving into it costs double for Aveline and for the ogre too; it is gone when the encounter ends.

## Ending an encounter and resting

### cu-dying · v0.0.520 · Stabilizing rolls nothing; damage while Unconscious and Down rolls the Table
Do: Durgan is Dying and collapsed (Unconscious). End his turns until his Body Check is a Tier 3; on another Dying try, damage him while he is Unconscious.
Expect: the Tier 3 says he stabilizes, with no roll on the Dying Table; damage while he is Unconscious and Down rolls the Dying Table (an Unconscious Durgan who wasn't Dying becomes Dying or Shattered by his Dominant Damage first).

### bst-oldworld · v0.0.519 · An old world's Minions
Do: In your playtest world, open an old Goblin Sneak (from before this version), then import the four creatures again from the NPCs compendium.
Expect: The old goblin now shows 2 ticks (its old damage read as ticks lost: it may show Down); the imported ones are the new sheets above.

## The Encounter Log

### dm-log-cost · v0.0.524 · The Encounter Log names a fight by its cost in Rally Points a PC
Do: Start a combat with the four pregens, Aveline, Durgan, Sylwen and Kaela, against two Orc Warriors. Let the orcs deal damage to the PCs' Health (some to each), heal one PC with a Rally Point, then open the Encounter Log; afterwards apply damage by hand until the party has taken about 50, then about 85, then about 110 in all (count a healed point too).
Expect: The top line reads "Party: N% HP · X.X RP a PC · Easy" (one decimal; X.X is the damage that reached Health, healed or not, divided by 34, which is 9 + 9 + 8 + 8 for the four pregens' Rally Points). The name follows the cost: up to 1.25 Easy, above it up to 2 Normal (about 50 taken: 1.5), above 2 up to 3 Hard (about 85: 2.5), above 3 Deadly (about 110: 3.2); no "Trivial". The Health table's legend reads "Difficulty by cost in Rally Points a PC: Easy up to 1¼ · Normal up to 2 · Hard up to 3 · Deadly above 3". Copy for Analysis: its "Party Health Cost" line ends with the same "X.X RP a PC · name". The look is as before (the same label, colored by the name).

## Windows
