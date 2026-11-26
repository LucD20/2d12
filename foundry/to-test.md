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

### cu-cards · v0.0.520 · Tend and the Basic Actions' new cards
Do: In a world from before v0.0.520, refresh the Basic Actions when asked (or Update from the compendium, Basic Actions too), then open Aveline's Actions tab and the HUD's Basic tab.
Expect: Heal is now Tend (in Utility, same rolls and Rally Point button); Relocate has no Strike trait; Seek's card writes its lines once, with a Use button for 1 AP and one for 2 AP; Crawl's 2 AP block starts with "Requirement: Your Speed is 5 or higher."; Advance's card has its Advance button, and using Advance still moves at once (no card first).

### cl-escalation · v0.0.520 · An NPC's Escalation switch without the default ladder
Do: Open the Ogre Chieftain's sheet, Builder tab: turn Escalation on (no "Default ladder" switch beside it any more). Start a combat with it and Aveline, and play two rounds.
Expect: The Ogre's Escalation rises each round as before; the chat line says "Ogre Chieftain's Escalation rises to N." with no "Now: Pressing..." text; its combat line shows the Bloodied +1 and Strained +1 hooks and the Escalation marks, but no Pressing / Relentless / Second Wind rungs; its first attack each round gets no free Boon. The sheet opens without an error.

### cl-ruler · v0.0.520 · No Ruler line in Designer mode
Do: Turn on Designer mode, open Aveline's Smite card on her sheet, then use Smite against the Orc Warrior.
Expect: No "Ruler" line on the card or under the chat card (the Odds and the Automation lines stay in Designer mode).

### bst-sheets · v0.0.519 · The four playtest creatures' sheets
Do: In a new world (or after importing them again from the NPCs compendium), open the Goblin Sneak, the Grave Wisp, the Orc Warrior and the Ogre Chieftain.
Expect: Goblin Sneak: Minion, CV 30, 2 ticks (a "Ticks 2/2" bar, no Vigor or Resolve), AD 13, WD 12, Weapon and Power +2, Speed 6, Shiv, Jeer, Knife in the Back, Shriek and Scatter. Grave Wisp: Grunt, CV 50, Vigor 6, Resolve 12, AD 12, WD 14, Speed 6, its new portrait, the damage line "Immunity Cold · Resistance Psychic 3 · Weakness Holy 3", Drifting, Slipping Touch, Guttering Glance, Pass Through, Dying Flare. Orc Warrior: Standard, Vigor 22, Resolve 14, 13 / 13, Speed 5. Ogre Chieftain: Elite, CV 200, Vigor 44, Resolve 28, AD 14, WD 12, Large, Reach 2, Steadiness 1, Speed 5, no Escalation; Crushing Grip, Roar, Great Sweep, Hurled Goblin, Crack the Ground, Backhand. None of the old cards (Rusty Knife, Club, Rally the Tribe...).

## Hiding

## The HUD

### bst-ticks-show · v0.0.519 · A Minion's ticks, for the GM and the players
Do: Put two Goblin Sneaks on the map in a combat. Look at them as the GM, then log in as a player (or use a player's view). Right-click one goblin for the Token HUD; select it for the system's HUD.
Expect: Each goblin shows two red pips at the top of its token, for the players too. The HUD shows one bar "2/2 ticks" (two segments); the Token HUD has one box with 2 in it (type -1: one pip goes; +1: it comes back).

## Starting a combat

### bst-squads · v0.0.519 · Squads of 2
Do: Put four Goblin Sneaks in a combat and open the Initiative window.
Expect: Two squads of two (never three in one); putting three in one squad shows "3 in squad (book: ≤2)".

## The roll dialog

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

### bst-ticks-damage · v0.0.519 · Damage removes a Minion's ticks by the Tier
Do: With Sylwen, make a Basic Attack against a Goblin Sneak; apply the damage of a Tier 1 hit (roll again until you get one), then of a Tier 2 on another goblin.
Expect: The Tier 1 removes 1 tick ("Took 1 tick"; the goblin counts as Bloodied: one pip left); the Tier 2 removes 2 and the goblin goes Down. The damage's size doesn't matter. A heal on the first goblin (Durgan's Lay On Hands) gives back 1 tick and ends Bloodied.
Do: With Aveline, use Word of Radiance (or any Save Action) on two goblins.
Expect: Each goblin's own Save, turned over: a Tier 1 Save removes 3 (Down), a Tier 2 removes 2, a Tier 3 with no damage removes none.

## Conditions and their Tiers

## Movement

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

### cu-feint · v0.0.520 · Feint's Critical blocks only the Reactions you trigger
Do: Kaela Feints the Bloodied Orc Warrior with a Critical (Designer mode: Force a Tier, or roll until one), then hits it; then Sylwen hits it.
Expect: Kaela's hit: Blood for Blood is not offered (a note: Feinted); Sylwen's hit: Blood for Blood is offered against Sylwen as usual.

### bst-blood · v0.0.519 · Blood for Blood is offered by itself
Do: Make the Orc Warrior Bloodied with Sylwen's Basic Attack from 2 squares away, then hit it again with Vigor damage; then hit it with Resolve damage (Durgan's Drawing Light), and once from 4 squares away.
Expect: The Vigor hit that Bloodies it (and the next) offers Blood for Blood (Use / Pass); Use: Advance up to 2, then the Basic attack button with 1 Bane takes the axe when Sylwen is in reach (the javelin when she isn't; both: a pick window). The Resolve hit and the hit from 4 squares offer nothing.

### bst-rally · v0.0.519 · An NPC's Rally Point is a quarter of its Health
Do: Deal 10 damage to a Grave Wisp and 20 to the Ogre Chieftain. With Durgan, use Lay On Hands on the wisp, then on the ogre.
Expect: The wisp heals 5 (a quarter of 18, rounded up) and the ogre 18 (a quarter of 72); neither spends anything. An Orc Warrior would heal 9.

### bst-flare · v0.0.519 · Dying Flare when the Grave Wisp would go Down
Do: Bring the Grave Wisp to 1 Health, put Aveline and an Orc Warrior next to it, and hit it with Kaela.
Expect: Before the damage lands, the Reactions message offers Dying Flare (an Interrupt). Use: the 1 Emanation around the wisp, an Instinct Save for Aveline and the orc (DC 13; the wisp itself is not in it); a Tier 1 gives Hindered (EoT). Then the held damage lands and the wisp goes Down (nothing is saved).

### bst-shriek · v0.0.519 · Shriek and Scatter when a goblin goes Down
Do: Three Goblin Sneaks within 6 squares of each other; end one goblin's turn with 1 AP kept. Take another goblin Down with Sylwen.
Expect: The goblin with a kept AP is offered Shriek and Scatter (it has no Reaction Point: the AP pays); Use: Evade 1 and the Jeer button. A goblin with no AP left shows in the "No Reactions" line. A goblin farther than 6 squares isn't offered it.

### bst-backhand · v0.0.519 · The Ogre's Backhand doesn't stop the mover
Do: Move Durgan (Advance) into a square adjacent to the Ogre Chieftain, with movement to spare. Then Evade into an adjacent square with Aveline.
Expect: Durgan's movement is offered Backhand (a Trigger, no Move back on the message); Use: the 1 Blunt damage button and Pushed 2. Durgan still has the rest of his movement. Aveline's Evade offers nothing.

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

## Windows
