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

### bst-sheets · v0.0.508 · The four playtest creatures' sheets
Do: In a new world (or after importing them again from the NPCs compendium), open the Goblin Sneak, the Grave Wisp, the Orc Warrior and the Ogre Chieftain.
Expect: Goblin Sneak: Minion, CV 30, 2 ticks (a "Ticks 2/2" bar, no Vigor or Resolve), AD 13, WD 12, Weapon and Power +2, Speed 6, Shiv, Jeer, Knife in the Back, Shriek and Scatter. Grave Wisp: Grunt, CV 50, Vigor 6, Resolve 12, AD 12, WD 14, Speed 6, its new portrait, the damage line "Immunity Cold · Resistance Psychic 3 · Weakness Holy 3", Drifting, Slipping Touch, Guttering Glance, Pass Through, Dying Flare. Orc Warrior: Standard, Vigor 22, Resolve 14, 13 / 13, Speed 5. Ogre Chieftain: Elite, CV 200, Vigor 44, Resolve 28, AD 14, WD 12, Large, Reach 2, Steadiness 1, Speed 5, no Escalation; Crushing Grip, Roar, Great Sweep, Hurled Goblin, Crack the Ground, Backhand. None of the old cards (Rusty Knife, Club, Rally the Tribe...).

### b5-migrate · v0.0.507 · An old world: the Arts and the Escalation Passives removed once
Do: In your playtest world (back it up first), load as the GM. A window "Arts and Escalation" asks to Remove: click Remove. Then open Durgan's sheet (or any of your Paladins and Archers that had an Art).
Expect: The window lists the characters that had them. A GM chat card lists, per character, what was removed. Durgan has no Hold the Line, Commandment, Armor of Faith, Tireless Vigil or Hallowed Stance any more; Smite, Judge, Lay On Hands, Shield of Faith, Kindled Wrath and Bulwark of Faith are still there. The window doesn't come back at the next load.

### b5-build-tab · v0.0.507 · The class window: no Art and no Escalation choices
Do: Open Kaela's sheet, the Build tab, and open the class window (Change level or the Class entry) at levels 1, 2 and 3. Do the same for Aveline.
Expect: Level 1: Features, a Hallmark Action, a Hallmark Reaction, a Skill Talent (no Art, no Escalation 2 ability). Level 2: the Escalation Hook, an Encounter Pick, a Talent (no Escalation 4 ability). Level 3: only a Skill Talent. Nothing is marked as missing or incomplete because of a removed choice.

### b5-pregens · v0.0.507 · The compendium's pregens without Arts or Escalation abilities
Do: Import Aveline, Durgan, Sylwen and Kaela (level 1 and level 4) from the PCs compendium and look at their Actions tab and the HUD in a combat.
Expect: No Art (no Modes button), no Escalation Passive, no Reckoning. Aveline level 1: Judge, Smite, Sworn Blade, Drawing Light, Binding Light, Rebuke and the Basic Actions. Smite still rolls 1 die per Escalation; the Escalation ladder and Momentum still show.

## The HUD

### bst-ticks-show · v0.0.508 · A Minion's ticks, for the GM and the players
Do: Put two Goblin Sneaks on the map in a combat. Look at them as the GM, then log in as a player (or use a player's view). Right-click one goblin for the Token HUD; select it for the system's HUD.
Expect: Each goblin shows two red pips at the top of its token, for the players too. The HUD shows one bar "2/2 ticks" (two segments); the Token HUD has one box with 2 in it (type -1: one pip goes; +1: it comes back).

## Starting a combat

### bst-squads · v0.0.508 · Squads of 2
Do: Put four Goblin Sneaks in a combat and open the Initiative window.
Expect: Two squads of two (never three in one); putting three in one squad shows "3 in squad (book: ≤2)".

## The roll dialog

### bst-cornered · v0.0.508 · Cornered: 1 Boon on the Bloodied orc's Shove
Do: Damage the Orc Warrior to Bloodied (22 Vigor damage), then use its Shove on Durgan. Do it again after healing it below 22.
Expect: Bloodied: the roll dialog shows a "Cornered" Boon, on; the roll has it. Not Bloodied: no Cornered chip. Its Trip never gets it.

### bst-knife · v0.0.508 · Knife in the Back needs a flank
Do: With a Goblin Sneak, target Kaela and use Knife in the Back, once with another goblin on Kaela's opposite side and once alone.
Expect: Flanking: no warning, the flanking Field Boon in the dialog. Alone: the dialog warns "doesn't flank Kaela (its Requirement). Used anyway."

### flank-opposite · v0.0.506 · Flanking: a flat 1 Field Boon from opposite sides, and the cancel
Do: Put Aveline and Durgan on opposite sides of Orc Warrior (Durgan diagonally across from Aveline counts too) and open Aveline's Basic Attack roll dialog against it. Then move Durgan beside Aveline (both on the Orc's same side) and open it again. Then put Goblin Sneak next to Aveline, Durgan back across, and open it a third time.
Expect: First: a "Flanking" chip, 1 Field Boon (never "Flanking 2", whoever else stands around). Second: no Boon; its n/a reason says Durgan threatens the Orc "but not from its opposite side". Third: no Boon; the reason names Goblin Sneak (the Orc's side) threatening Aveline.

## Chat cards

### bst-ticks-damage · v0.0.508 · Damage removes a Minion's ticks by the Tier
Do: With Sylwen, make a Basic Attack against a Goblin Sneak; apply the damage of a Tier 1 hit (roll again until you get one), then of a Tier 2 on another goblin.
Expect: The Tier 1 removes 1 tick ("Took 1 tick"; the goblin counts as Bloodied: one pip left); the Tier 2 removes 2 and the goblin goes Down. The damage's size doesn't matter. A heal on the first goblin (Durgan's Lay On Hands) gives back 1 tick and ends Bloodied.
Do: With Aveline, use Word of Radiance (or any Save Action) on two goblins.
Expect: Each goblin's own Save, turned over: a Tier 1 Save removes 3 (Down), a Tier 2 removes 2, a Tier 3 with no damage removes none.

## Conditions and their Tiers

## Movement

### bst-ticks-collision · v0.0.508 · A Collision removes 1 tick, never a second one for the same Action
Do: With Durgan, Shove a Goblin Sneak into a wall (Tier 2). Then give a fresh goblin 3 ticks (its Builder tab, Frame, Ticks 3), catch it beside a wall with Aveline's Word of Radiance (until its result against it removes 2 ticks) and click the card's Pushed button to push it into the wall.
Expect: The Shove's Collision removes 1 tick (the Shove dealt it no damage). Word of Radiance's result removes its ticks once (1 left) and the Collision of its own Push (clicked from its card) removes none.

### bst-drift · v0.0.508 · The Grave Wisp's Drifting
Do: In a combat, drag the Grave Wisp through Aveline's space and through another wisp's, then try to end its movement in Aveline's square.
Expect: The movement passes through both spaces with no extra cost (no Difficult Terrain); ending in a creature's space is refused. An Orc Warrior can't pass through Aveline's space (it blocks).

### block-enemy · v0.0.506 · An enemy's space blocks; an ally's is Difficult Terrain; the diagonal between two enemies blocks
Do: In combat on Sylwen's turn, drag her through Orc Warrior's square; then diagonally between Orc Warrior and Goblin Sneak placed corner to corner; then through Kaela's square (Advance), and with Evade 2 and Evade 1 through Kaela. Look at the movement range shown while dragging.
Expect: Through the Orc: refused ("Orc Warrior's space blocks your movement ... Tumble to pass through, or go around"). The diagonal between the two enemies: refused ("You can't slip diagonally between ..."). Through Kaela: allowed, her square counts 2 on the ruler. Evade 2 through Kaela: allowed (her square costs 2); Evade 1 can't reach past her. The range area doesn't spread through enemies or between two corner-to-corner enemies.

### tumble-pass · v0.0.506 · Tumble passes enemies and the diagonal between two
Do: On Kaela's turn, use Tumble (1 AP: Advance half her Speed) and drag her through Goblin Sneak's square to the far side; use it again (2 AP: Evade 2) between Orc Warrior and Goblin Sneak corner to corner. Try to end inside the Goblin's square.
Expect: Both movements pass (the Check is by hand: its card says so); she can't end in an enemy's square. After the Tumble, a normal Advance is blocked by the enemies again.

### charge-and-down · v0.0.506 · Charge stops at allies and enemies; a Down creature is Difficult Terrain
Do: Aim Aveline's Charge at Ogre Chieftain with Durgan on the straight line, then with Goblin Sneak on it. Then bring Goblin Sneak to 0 (Down) and drag Sylwen through its square.
Expect: The Charge stops before Durgan ("an ally's or a Down creature's space is Difficult Terrain") and before the Goblin ("blocks movement"). The Down Goblin's square can be crossed by an Advance at double cost.

## Reactions and Judge

### bst-blood · v0.0.508 · Blood for Blood is offered by itself
Do: Make the Orc Warrior Bloodied with Sylwen's Basic Attack from 2 squares away, then hit it again with Vigor damage; then hit it with Resolve damage (Durgan's Drawing Light), and once from 4 squares away.
Expect: The Vigor hit that Bloodies it (and the next) offers Blood for Blood (Use / Pass); Use: Advance up to 2, then the Basic attack button with 1 Bane takes the axe when Sylwen is in reach (the javelin when she isn't; both: a pick window). The Resolve hit and the hit from 4 squares offer nothing.

### bst-rally · v0.0.508 · An NPC's Rally Point is a quarter of its Health
Do: Deal 10 damage to a Grave Wisp and 20 to the Ogre Chieftain. With Durgan, use Lay On Hands on the wisp, then on the ogre.
Expect: The wisp heals 5 (a quarter of 18, rounded up) and the ogre 18 (a quarter of 72); neither spends anything. An Orc Warrior would heal 9.

### bst-flare · v0.0.508 · Dying Flare when the Grave Wisp would go Down
Do: Bring the Grave Wisp to 1 Health, put Aveline and an Orc Warrior next to it, and hit it with Kaela.
Expect: Before the damage lands, the Reactions message offers Dying Flare (an Interrupt). Use: the 1 Emanation around the wisp, an Instinct Save for Aveline and the orc (DC 13; the wisp itself is not in it); a Tier 1 gives Hindered (EoT). Then the held damage lands and the wisp goes Down (nothing is saved).

### bst-shriek · v0.0.508 · Shriek and Scatter when a goblin goes Down
Do: Three Goblin Sneaks within 6 squares of each other; end one goblin's turn with 1 AP kept. Take another goblin Down with Sylwen.
Expect: The goblin with a kept AP is offered Shriek and Scatter (it has no Reaction Point: the AP pays); Use: Evade 1 and the Jeer button. A goblin with no AP left shows in the "No Reactions" line. A goblin farther than 6 squares isn't offered it.

### bst-backhand · v0.0.508 · The Ogre's Backhand doesn't stop the mover
Do: Move Durgan (Advance) into a square adjacent to the Ogre Chieftain, with movement to spare. Then Evade into an adjacent square with Aveline.
Expect: Durgan's movement is offered Backhand (a Trigger, no Move back on the message); Use: the 1 Blunt damage button and Pushed 2. Durgan still has the rest of his movement. Aveline's Evade offers nothing.

## Areas, light and Cover

### bst-crack · v0.0.508 · Crack the Ground leaves a broken floor
Do: With the Ogre Chieftain, use Crack the Ground (aim the Line 3 at Aveline and Durgan in a row). Then move Aveline and the ogre across the Line.
Expect: The Line 3 starts from the ogre's space; each creature in it makes an Instinct Save against DC 13 ([V] 5 + 2d8 / 3 + 1d8 / nothing). The Line stays on the map; moving into it costs double for Aveline and for the ogre too; it is gone when the encounter ends.

## Ending an encounter and resting

### bst-oldworld · v0.0.508 · An old world's Minions
Do: In your playtest world, open an old Goblin Sneak (from before this version), then import the four creatures again from the NPCs compendium.
Expect: The old goblin now shows 2 ticks (its old damage read as ticks lost: it may show Down); the imported ones are the new sheets above.

## The Encounter Log

## Windows
