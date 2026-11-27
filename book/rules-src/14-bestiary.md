<!-- doc: bestiary -->
# Bestiary: Building NPCs

An NPC is built from its **rank**'s defaults: how much it counts for in a fight. **An NPC's items are flavor and loot:** its Health, Defenses and damage never come from its weapons or armor. **An NPC's Actions are its own:** written for it, never copies of a PC's cards.

## Building an encounter

Add up the **Combat Value (CV)** of the enemies: Minion 30, Grunt 50, Standard 100, Elite 200 (see [[The ranks]]). **CV 100 a PC is a normal fight.**

- A Minion's CV of 30 is for Minions mixed with other enemies; about three of them count for one PC. A fight of Minions alone is not a straight line: the last ones standing act the most, so eight against four PCs are less than an easy fight and sixteen a hard one.

> [!tbd]
> Not rebuilt yet: the CV of an easy, a hard and a deadly fight; the caps (Minions a PC, a Boss); the party's size; what an NPC of an earlier Stage counts for. Until then, the GM reads how hard a fight is from its CV against CV 100 a PC.

> [!tbd]
> How many fights a day between Rests holds: the old guide is two easy, two normal and one hard fight; to confirm at the table.

### The normal fight

**A normal fight is CV 100 a PC: one Standard a PC, a fight the party wins.** It is not an even match.

- **It lasts 3 to 4 rounds.**
- **It is built for a fresh party at Momentum 0:** full Health, Rally Points in hand. **Momentum doesn't change the budget:** it is the party's reward.
- **The enemies spread their attacks** as far as their Actions make them. Every enemy striking the same PC is the GM's choice, and it makes the fight harder than its CV says.

## The ranks

An NPC has one of four ranks. Each has a **default**: the numbers to build it with when nothing else is chosen.

| Rank | CV | Staying power | AP | Basic attack (Tier 2 / Tier 3) | Its damage to Health a turn, at the table |
|---|---|---|---|---|---|
| **Minion** | 30 | 2 ticks | 3, no Reaction Point | [V] 1d10 / 2 + 1d12 | about 8 |
| **Grunt** | 50 | Health 22 (11 / 11) | 3 and the Reaction Point | [V] 1d10 / 2 + 1d12 | about 9½ |
| **Standard** | 100 | Health 45 (23 / 22) | 4 and the Reaction Point | [V] 2 + 1d10! / 8 + 1d12! | about 19 |
| **Elite** | 200 | Health 90 (45 / 45) | 4 and the Reaction Point | [V] 2 + 1d10! / 8 + 1d12! | about 19, and its Encounter Action |

- **Every rank:** Armor Defense 13, Ward Defense 13, Weapon Modifier +2, Power Modifier +2. **A rank never moves its Defenses or its Modifiers.**
- **The damage a turn at the table is a playtest value:** an estimate for the table to check, after the PCs' Guard, Cover and movement.

### Minions

- **Minions are announced:** the players know which enemies are Minions and how many ticks each has left.

### Ticks

A Minion has **ticks** instead of Health: 2 by default (its entry can give it another number). Damage removes ticks; when it has none left, it goes Down.

1. **An Action that damages a Minion removes ticks equal to its Tier against that Minion** (Tier 1 removes 1, Tier 2 removes 2, Tier 3 removes 3), **once an Action, whatever the Action does.** A Tier that deals it no damage removes none: a Tier 1 that deals nothing, or damage that its [[Resistance, Weakness and Immunity|Resistance or Immunity]] takes to 0.
2. **A Save Action** removes ticks by the Minion's own Save, turned over: its Tier 1 removes 3, its Tier 2 removes 2, its Tier 3 removes 1, each only if that Tier deals it damage.
3. **An Area:** each Minion in it is its own target, with its own Tier (see [[Several Targets]]).
4. **Damage with no Tier removes 1 tick each time it lands:** a [[Lingering]] at the end of its turn, a hazard, a zone, a [[Collision]] from an Action that dealt it no damage (a Shove). **An Action removes ticks only once:** if its Tier removed ticks, its own Forced Movement's Collision removes no more.
5. **A rider with no damage removes none.** The rider still applies: a Minion can be Prone, Hindered or Taunted.
6. **A heal** of any size restores 1 tick, up to its ticks.
7. **With 1 tick left, a Minion counts as Bloodied or Strained, by the damage that left it there:** Vigor damage makes it Bloodied, Resolve damage Strained, damage to both pools both. It stops counting so when a heal gives it a tick back.

When a Minion goes Down, each tick it lost counts as the damage that removed it, Lethal or Nonlethal, and [[NPCs Going Down]] decides whether it dies or falls Unconscious.

> [!example]
> A goblin has 2 ticks. Drak's Basic Attack gets a Tier 1 against it and deals 2: the goblin loses 1 tick and counts as Bloodied. A second goblin is caught by a Save Action: its Save is a Tier 2, so it loses 2 ticks and goes Down. A third is Shoved into a wall: the Shove dealt it no damage, so the Collision removes 1 tick.

### Squads

**Minions act in squads of up to 2.** A squad takes one place in its side's turn order: the GM rolls one Initiative for it (see [[Initiative]]) and decides who goes together when Initiative is rolled, and the order inside the squad. Each Minion still has its own turn (its own AP, its own start and end of turn) and takes it whole before the next one starts. A Minion's EoT effects end at the end of its own turn; durations in rounds count down at the end of the slot, after the last of them.

### Grunts

**A Grunt is half a Standard:** weaker than a PC. For reference, a 2 AP Round Action of its own deals about 13 / 20 to one creature, or 6 / 10½ to each of two.

Grunts are for mixing in with other enemies: a fight of Grunts alone runs longer than its CV says.

### Minor enemies

**Minor enemies** are the Minion and Grunt ranks. Both have **3 AP** a turn. A Forced Movement into a [[Deadly Hazards|Deadly Hazard]] kills a Minor enemy.

### Standards

**A Standard is the unit: CV 100, one for each PC in a normal fight.**

- **Its Basic attack:** [V] 2 + 1d10! on a Tier 2, [V] 8 + 1d12! on a Tier 3.
- **For reference:** a 2 AP Round Action of its own deals about 16½ / 26 to one creature, or 12 / 19 to each of up to two.
- **The turn its damage a turn counts:** 1 AP to move, a 2 AP Round Action and a Basic attack; a turn that doesn't need to move adds a second Basic attack, with its At-will Bane.
- **About 19 damage to Health a turn at the table** (a playtest value): about two fifths of a PC's Health, about one and a half Rally Points.

### Elites

**An Elite is two units: CV 200, the place of two Standards in a normal fight.** Its default is a Standard with **Health 90** (Vigor 45, Resolve 45) and **an Encounter Action of its own**: the same Defenses, Modifiers, AP and attacks.

**An Elite's Encounter Action is worth about a turn:** about one extra Standard's turn in a fight (about 19 more damage to Health at the table, or the like in effect). The size is the rank's; the form is the creature's, written on its card. For reference, one that hits several creatures deals about twice a Standard's 2 AP Round Action.

### The Boss

> [!tbd]
> The Boss (a rank for a fight against a single creature, or one with one or two others) is not rebuilt yet: its turns, its Health and the rule that keeps a class from shutting it down come after the playtest of the four ranks above.

## An NPC's numbers

**A creature changes its rank's default inside the totals.** It can move Health between its Vigor and its Resolve, the total held (neither below a third of the total, as for a PC), and a point between its Armor Defense and its Ward Defense, the total held. Its Attributes are chosen for the creature. The one exception: a fast creature can give up a Defense point or some Health, and a slow one can gain Health (see [[Speed, Size and Steadiness]]).

- **Its Health Pool** is its Vigor and Resolve added together.
- **Its Attributes** (Body, Mind, Appeal, Instinct) are for its Checks, its Saves and its Attribute DCs (11 + the Attribute); they don't change its Health, its Defenses or its Modifiers.
- **Its Modifiers** are for its rolls and its DCs only: its damage is written whole on its cards, with nothing added.
- **Its level says which PCs it is built for.** A higher level gives a creature options (more Actions, riders, Features), never a number on a roll, a Defense or a DC. The creatures in this chapter are level 1 ([[Stages|Stage]] 0).

> [!tbd]
> Not rebuilt yet: the ratings (Terrible, Low, Medium, High, Extreme) and their tables, the roles (ready sets of numbers and a way to play a creature), and the numbers of Stages 1, 2 and 3.

### Speed, Size and Steadiness

An NPC has **Speed 5**, is **Medium** (3) and has **Steadiness 0** unless its entry says otherwise. Speed, [[Size]] and [[Steadiness]] are free, but balanced inside the creature: a fast creature (Speed 6 or more, or one that flies) chooses its fights, so it pays with a downside (less Vigor, a lower Armor Defense); a slow one (Speed 4 or less) gets an upside (more Health, Reach). A big or heavy creature can have a larger Size and Steadiness 1 or more.

### NPCs and Health

What differs for an NPC's Health: see [[Rally Points]] and [[NPCs Going Down]].

## An NPC's Actions

**An NPC has no set list of Actions:** as many Actions, Reactions and Features as the GM wants, of any AP cost and any [[Frequency]], written in the same card Structure as a PC's (riders, Setup and Effect lines, Bloodied and Strained lines). **Every Basic Action is an NPC's too** (see [[Chapter 6: Basic Actions|Basic Actions]]: Fists, Shove and Trip included), except Steel Yourself and the Basic Attack card, whose place its own Basic attacks take.

- **An NPC's Tier 1 deals nothing unless its card says so:** a creature can be designed to do something on it.
- Give every damage line a die: a flat number alone is rare.
- **Every NPC has an answer to the back line:** a ranged attack, a way through, or a reason for the back line to come closer.

### What an Action attacks, rolls and damages

Every NPC Action that attacks makes **three separate choices**:

1. **The Defense it attacks:** Armor Defense or Ward Defense.
2. **The Modifier it rolls:** the Weapon Modifier (a [Weapon] Action) or the Power Modifier (a [Power] Action).
3. **The pool it damages:** [V] (Vigor) or [R] (Resolve).

**A Weapon Action against Armor Defense that deals [V]**, and **a Power Action against Ward Defense that deals [R]**, are the usual sets, not a limit.

- **Distance.** An NPC's melee Action has Distance Reach (X), X its Reach: written "Reach (1)". A ranged one has its squares (see [[Weapon Range]]). A melee Action has the Melee trait, a ranged one the Ranged trait.
- **Its [Weapon] Actions need the weapon its entry describes**, in hand: the weapon gives them their nature, not their numbers. A [Power] Action needs no weapon.
- **Threatening.** An NPC threatens every enemy within the Distance of its melee Basic attack while it could use it (see [[Flanking]]); one with no melee Basic attack threatens no one.

### Basic attacks

**Every NPC has two Basic attacks by default:** normally a melee one and a ranged one, or one against each Defense. Each is 1 AP and At-will, and **they share one At-will count**, as a PC's At-will [Strike] Actions do (see [[Strike]]): the second one of a turn takes 1 Bane, whichever it is.

- **When a rule calls for a Basic Attack** (the Basic Attack at the end of a [[Charge]], for example), an NPC uses one of its own Basic attacks: one that can reach the target, its choice when both can (for a Charge, one of its Melee Basic attacks).

### Losing its weapon

> [!tbd]
> Disarming and breaking weapons are not written yet.

One that loses its weapon (disarmed, the weapon broken) can't use its [Weapon] Actions and makes Fists Strikes instead, with its Weapon Modifier as their [Mod]. If it takes up another weapon of the same kind, nothing changes; another kind of weapon, and the GM adjusts its Actions in the middle of the fight (usually the damage type, or the damage dice a step).

### Its other Actions

**An NPC's other Actions** are every one that is not a Basic attack. One can have any AP cost and any Frequency: **what limits it is its power**, balanced against the creature's other Actions.

### NPC Reactions

**No NPC has a Reaction by default:** a Reaction is designed for each creature, **written like any Action, with its Frequency** (At-will, Turn, Round or Encounter; see [[Reactions]]). An NPC pays for one as a PC does, with its Reaction Point or an AP it kept from its turn; a Minion, which has no Reaction Point, only with an AP it kept. **An NPC gains no Guard from unspent AP:** an AP it keeps only pays for a Reaction (see [[Unspent AP]]).

> [!tbd]
> Pricing an NPC's Actions is not rebuilt yet: the old points engine, the price of riders, the price of a Frequency and the best-turn check are out. Until a simpler pricing is written (ready numbers for each rank and AP cost), an Action is checked against its rank's reference numbers and its damage a turn.

## The playtest creatures (Stage 0, level 1)

The four creatures of the next playtest, one for each rank. **Their numbers are playtest values.** The Flavor line of each card is in italics.

### Goblin Sneak

**Goblin Sneak** (Minion, CV 30, level 1). **2 ticks.** Armor Defense 13, Ward Defense 12. Weapon Modifier +2, Power Modifier +2. Instinct +2, Body 0, Mind 0, Appeal −1. Speed 6, Reach 1, Medium. 3 AP, no Reaction Point. It acts in squads of 2. Tag: Goblin. A short blade in its hand.

- **Shiv** (Basic attack; At-will, 1 AP; [Weapon, Melee, Strike]; Reach (1); one creature; Weapon vs. Armor Defense). *A short, ugly blade, and it knows where the armor ends.* Tier 2: [V] 1d10 Pi. Tier 3: [V] 2 + 1d12 Pi. Critical: [V] 1d10! Pi.
- **Jeer** (Basic attack; At-will, 1 AP; [Power, Ranged, Strike]; 6 sq.; one creature; Power vs. Ward Defense). *It says something about your mother, in Goblin, and somehow you understand.* Tier 2: [R] 1d10 Ps. Tier 3: [R] 1d10 Ps; Taunted by the goblin (1 round). Critical: [R] 1d10! Ps.
- **Knife in the Back** (Round, 2 AP; [Weapon, Melee, Strike]; Reach (1); one creature; Weapon vs. Armor Defense). *You were looking at the other one.* Requirement: the goblin flanks the target. Tier 2: [V] 6 + 1d12 Pi. Tier 3: [V] 13 + 1d12 Pi.
- **Shriek and Scatter** (Reaction; Encounter, 1R; 6 sq.; one ally with the Goblin Tag). *One of them drops, and the rest remember how much they hate you.* Trigger: the target goes Down. Effect: the goblin can Evade 1, then uses Jeer.

### Grave Wisp

**Grave Wisp** (Grunt, CV 50, level 1). Health 22 (Vigor 8, Resolve 14). Armor Defense 12, Ward Defense 14. Weapon Modifier +2, Power Modifier +2. Mind +2, Instinct +1, Appeal 0, Body −1. Speed 6, Reach 1, Medium. 3 AP and the Reaction Point.

**Resistance** Psychic 3 · **Weakness** Holy 3 · **Immunity** Cold

- **Drifting** (Feature). *Nothing in its way is quite solid to it.* The wisp's own movement can pass through creatures' spaces (it can't end in one), and a creature's space is never Difficult Terrain for it.
- **Slipping Touch** (Basic attack; At-will, 1 AP; [Power, Melee, Strike]; Reach (1); one creature; Power vs. Ward Defense). *It reaches for you and is already somewhere else.* Tier 1: the wisp can Evade 1. Tier 2: [R] 1d10 Co. Tier 3: [R] 2 + 1d12 Co. Critical: [R] 1d10! Co.
- **Guttering Glance** (Basic attack; At-will, 1 AP; [Power, Ranged, Strike]; 6 sq.; one creature; Power vs. Ward Defense). *The light goes out behind your eyes.* Tier 2: [R] 1d10 Ps. Tier 3: [R] 1d10 Ps; Half-Blinded (EoT). Critical: [R] 1d10! Ps.
- **Pass Through** (Round, 2 AP; [Power, Move, Strike]; up to two enemies; Power vs. Ward Defense). *It drifts straight through you, and the cold stays.* Setup: the wisp Advances in a straight line; the targets are enemies whose space it passed through. Tier 2: [R] 1d10 Co. Tier 3: [R] 4 + 1d12 Co.
- **Dying Flare** (Reaction; Encounter, 1R; [Power, Save, Area]; Area: 1 Emanation; all creatures in the Area; Instinct Save against its Power DC, 13). *It goes out the way a lamp does when it is dropped.* Interrupt: the wisp would go Down. Tier 1: [R] 1d10 Co; Hindered (EoT). Tier 2: [R] 1d10 Co. Tier 3: no effect. Then the wisp goes Down.

### Orc Warrior

**Orc Warrior** (Standard, CV 100, level 1). Health 45 (Vigor 28, Resolve 17). Armor Defense 13, Ward Defense 13. Weapon Modifier +2, Power Modifier +2. Body +2, Instinct +1, Appeal +1, Mind −1. Speed 5, Reach 1, Medium, Steadiness 0. 4 AP and the Reaction Point. A war axe in one hand, the other free, javelins on its back.

- **Hamstringing Axe** (Basic attack; At-will, 1 AP; [Weapon, Melee, Strike]; Reach (1); one creature; Weapon vs. Armor Defense). *The orc cuts low, at the leg that would carry you away.* Tier 2: [V] 2 + 1d10! Sl. Tier 3: [V] 8 + 1d12! Sl; Hindered (EoT). Critical: [V] 1d10! Sl.
- **Barbed Javelin** (Basic attack; At-will, 1 AP; [Weapon, Ranged, Strike]; 6 sq.; one creature; Weapon vs. Armor Defense). *The orc throws a short spear that stays in the wound.* Setup: the orc draws a javelin. Tier 2: [V] 2 + 1d10! Pi. Tier 3: [V] 2 + 1d10! Pi; Lingering 1d10 Pi (Bo/In). Critical: [V] 1d10! Pi.
- **War Howl** (Round, 2 AP; [Power, Save, Area, Fear]; Area: 2 Emanation; all enemies in the Area; Mind Save against its Power DC, 13). *The orc throws its head back and howls, and the sound gets into your bones.* Tier 1: [R] 5 + 1d12! Ps; Vulnerable 1 (EoT). Tier 2: [R] 4 + 1d10! Ps. Tier 3: no effect.
- **Blood for Blood** (Reaction; Round, 1R; 2 sq.; the triggering creature). *The wound only makes it angrier.* Requirement: the orc is Bloodied. Trigger: the target deals Vigor damage to the orc (the blow that makes it Bloodied counts). Effect: the orc Advances up to 2 toward the target, then makes a Basic attack against it with 1 Bane.
- **Cornered** (Feature). *Hurt, it stops fencing and starts throwing its weight around.* While the orc is Bloodied, its [[Shove]] gains 1 Boon.

### Ogre Chieftain

**Ogre Chieftain** (Elite, CV 200, level 1). Health 90 (Vigor 55, Resolve 35). Armor Defense 14, Ward Defense 12. Weapon Modifier +2, Power Modifier +2. Body +3, Instinct +1, Appeal +1, Mind −1. Speed 5, Reach 2, Large (4), Steadiness 1. 4 AP and the Reaction Point. A club in one hand, the other free. Tag: Ogre.

- **Crushing Grip** (Basic attack; At-will, 1 AP; [Weapon, Melee, Strike]; Reach (2); one creature; Weapon vs. Armor Defense). *A hand closes round you like a door shutting.* Tier 2: [V] 2 + 1d10! Bl. Tier 3: [V] 8 + 1d12! Bl; Grabbed. Critical: [V] 1d10! Bl. The ogre holds one creature at a time: a new Grab lets the first go.
- **Roar** (Basic attack; At-will, 1 AP; [Power, Ranged, Strike, Fear]; 6 sq.; one creature; Power vs. Ward Defense). *It turns its whole face toward you and bellows.* Tier 2: [R] 2 + 1d10! Ps. Tier 3: [R] 2 + 1d10! Ps; Staggered (EoT). Critical: [R] 1d10! Ps.
- **Great Sweep** (Round, 2 AP; [Weapon, Melee, Strike]; Reach (2); up to two creatures; Weapon vs. Armor Defense). *The club goes round at chest height.* Tier 2: [V] 6 + 1d12 Bl. Tier 3: [V] 13 + 1d12 Bl.
- **Hurled Goblin** (Round, 2 AP; [Weapon, Ranged, Strike]; 6 sq.; one creature; Weapon vs. Armor Defense). *The goblin has time to look surprised.* Requirement: a willing Minion ally is within the ogre's Reach. Tier 2: [V] 2 + 1d10! Bl. Tier 3: [V] 5 + 1d12! Bl. Effect: the ogre places the Minion in an empty square adjacent to the target (hit or miss); it takes no damage and triggers no Reactions.
- **Crack the Ground** (its Encounter Action; Encounter, 2 AP; [Weapon, Save, Area]; Area: Line 3; all creatures in the Area; Instinct Save against its Weapon DC, 13). *It brings the club down two-handed, and the floor gives.* Tier 1: [V] 20 + 2d12 Bl. Tier 2: [V] 11 + 1d12 Bl. Tier 3: no effect. Effect: the squares of the Line are Difficult Terrain for every creature (EoE).
- **Backhand** (Reaction; Turn, 1R; the triggering creature). *You stepped inside its reach as if it weren't looking.* Trigger: an enemy enters a square adjacent to the ogre. Effect: it takes [V] 2 Bl and is Pushed 2, with no roll. Its movement isn't disrupted: it goes on with the movement it has left.
