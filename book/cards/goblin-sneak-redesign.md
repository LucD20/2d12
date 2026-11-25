# The Goblin Sneak: the first Minion (the record)

> **Status (2026-11-25): IDEAS SHOWN, with a proposed Default Minion, waiting for Lucas's review. Nothing is chosen. Design only: no card source, no Foundry (the Foundry pass comes once, when every NPC is done).** The Bestiary's record is `book/bestiary-design.md`; the earlier creatures', `orc-warrior-redesign.md` and `grave-wisp-redesign.md`.

## Lucas's words (2026-11-25)

"Wisp is good, next is the Goblin Sneak as a Minion. Also, note: NPcs will also have levels. These are Stage 0 Level 1 enemies. Level is mainly guidance, since PCs get stronger in the sense of more options (talents, magic, equipment, mastery...) NPCs need to get also horizontaly stronger."

**Nothing is copied from the old sheet** (no Rusty Knife, no Dirty Trick, no Pressure Bane rider, none of its ratings or its Speed).

## What is already decided about Minions (`core-rework.md` G3, K1, D2; Chapter 14's rules)

- **Ticks, not Health.** A Tier removes that many ticks (1 / 2 / 3); most Minions have 2. One tick reduction an Action (its Forced Movement's damage doesn't tick again; Lingering apart). No overflow.
- A Minion with 1 tick left counts as Bloodied or Strained, by the damage that caused it.
- Minions share turns: up to 3 in one turn slot (the recommendation: squads of 2). Minions flank.
- Chapter 14's rules for Minor enemies, kept case by case (K7): 3 AP; dice that never explode; **no Reaction Point and no Reactions**.
- Every enemy has two Basic attacks by default (Lucas, the Grave Wisp).

## The Default Minion (Claude's derivation; his to change)

| | Default Grunt | Default Minion | Why |
|---|---|---|---|
| Staying power | Health 18 | **2 ticks** | A plain PC's Basic Attack kills it 72% of the time and leaves 1 tick otherwise: about 1.3 attacks |
| Defenses, Modifiers | 13 / 13, +2 / +2 | **the same** | A rank moves none |
| AP | 3 | **3, no Reaction Point** | Chapter 14's rules, kept |
| Basic attack | 1d4 / 1d6 | **1d4 / 1d6** | A Minion hits like a Grunt and dies like a Minion. Smaller hits (about 2) would vanish under the Guard of one kept AP |
| Damage to Health a turn, at the table | about 4 | **about 3½** | The same two Basic attacks after a move |
| CV | 50 | **30** | The count below |

**The count** (`node book/ruler/fight-identity.mjs`, the Minion version: a PC turn at the table as 2 Basic Attacks, 3 one turn in four; squads of 2):

| Minions against four PCs | It ends in round | Minion turns | Cost, Rally Points a PC |
|---:|---:|---:|---:|
| 8 (2 a PC) | 1.8 | 6.2 | 0.7 |
| 12 (3 a PC) | 2.1 | 11.8 | 1.2 |
| 16 (4 a PC) | 2.9 | 19.1 | 2.0 |

- **About 13 Minions are a normal fight (1½), so CV 30.** At the old 25, four a PC, the same goblins make a fight between normal and hard.
- **A Minion's worth is not a straight line** (P8): the last ones standing act the most. Eight alone are less than an easy fight; sixteen are a hard one. CV 30 is right for Minions mixed with others, and for about three a PC; the rule should say so and keep a cap (today: no more than 4 a PC).
- **A third tick** is worth about a fifth more: eleven 3-tick Minions are a normal fight (CV about 36).
- The count lets the PCs strike a new Minion with every attack; at the table they have to reach them, so real Minions live a little longer than this.

**What removes a tick (K2; Claude's proposals, each one sentence for the rule):**

1. **An Action that damages a Minion removes ticks equal to its Tier against that Minion** (1 / 2 / 3), once an Action. A Tier that deals it no damage removes none (a Tier 1 that deals nothing; damage a Resistance or an Immunity takes to 0).
2. **A Save Action:** the Minion's own Save, turned over: its Tier 1 removes 3, its Tier 2 removes 2, its Tier 3 removes 1, each only if that Tier deals it damage (decided as proposed, K2).
3. **An Area:** each Minion in it is its own target, with its own Tier (Chapter 1, Several Targets).
4. **Damage with no Tier removes 1 tick:** a Collision from an Action that didn't already tick it, a Lingering at the end of its turn, a hazard, a zone. This is the research's "easy kills, not free kills": two such hits for a 2-tick Minion, never one (the top complaint about 4e's minion was damage with no roll killing it).
5. **A rider with no damage removes none;** the rider still applies (a Minion can be Prone, Hindered, Taunted).
6. **A heal** of any size restores 1 tick, up to its ticks.
7. **Minions are announced:** the players know which enemies are Minions and how many ticks each has (Draw Steel and 13th Age 2e print the same; the least ambiguity).

**A squad on one PC.** Two goblins in a slot can put four attacks on one PC, about 9 on paper; three, six attacks and about 13. Draw Steel capped this after a squad nearly dropped a hero in its draft. Claude's default: no cap, squads of 2 as the rule's recommendation says, and the GM's note that three on one PC is the hard setting.

## The Goblin Sneak's numbers (Claude's proposal)

- **2 ticks.** Armor Defense 13, Ward Defense 12 (quick, and a coward: a point off the total, as befits fodder; or 13 / 13).
- **Instinct +2, Body 0, Mind 0, Appeal -1.** Weapon +2, Power +2. **Speed 6.** 3 AP, no Reaction Point. Its dice never explode. **Level 1** (Stage 0).

## The ideas

### The melee Basic attack (1 AP, At-will; [Weapon, Melee, Strike]; Reach (1); one creature; Weapon vs. Armor Defense)

**M1. Shiv** (the plain one). *A short, ugly blade, and it knows where the armor ends.*
- Tier 2: [V] 1d4 Pi. Tier 3: [V] 1d6 Pi.

**M2. Stab and Scurry.** *It is in, it is out, and it is laughing.*
- Tier 2: [V] 1d4 Pi. Tier 3: [V] 1d6 Pi. Effect: on a Tier 2 or 3, the goblin can Evade 1.
- Hit and run: a melee PC has to step after it. It also breaks the goblin's own flanking, so the GM chooses each time.

**M3. Cheap Shot.** *It hits you where no one fights fair.*
- Tier 2: [V] 1d4 Pi. Tier 3: [V] 1d6 Pi; Staggered (EoT).
- No Reactions until the end of your turn: the goblin opens the way for the orcs behind it.

### The second Basic attack (1 AP, At-will)

**R1. Thrown Rock** (the plain one). [Weapon, Ranged, Strike]; 5 sq.; Weapon vs. Armor Defense. *Whatever was on the floor.*
- Tier 2: [V] 1d4 Bl. Tier 3: [V] 1d4 Bl.

**R2. Blowdart.** [Weapon, Ranged, Strike]; 5 sq.; Weapon vs. Armor Defense. *A prick at the neck, and your stomach turns.*
- Tier 2: [V] 1d4 Pi. Tier 3: [V] 1d4 Pi; Sickened 1 (EoT).
- Banes on your Body and Instinct Saves and no potions until the end of your turn. It sets up the wisps' Dying Flare (an Instinct Save); alone it does little.

**R3. Jeer.** [Power, Ranged, Strike]; 6 sq.; Power vs. Ward Defense. *It says something about your mother, in Goblin, and somehow you understand.*
- Tier 2: [R] 1d4 Ps. Tier 3: [R] 1d4 Ps; Taunted by the goblin (1 round).
- The second Basic attack against the other Defense (Lucas's default allows it). Fodder that makes you want to hit it: your Actions against anyone else take 1 Bane, until you kill the goblin (a condition ends when its source goes Down).

### A third card (a Special or a Feature)

A Minion lives about a turn and a half: one more card is plenty, and none is fine.

**T1. Knife in the Back** (Special; Round, 2 AP; [Weapon, Melee, Strike]; Reach (1); one creature; Weapon vs. Armor Defense). *You were looking at the other one.*
- Requirement: the goblin flanks the target.
- Tier 2: [V] 2 + 1d6 Pi. Tier 3: [V] 4 + 1d8 Pi.
- The "Sneak": a Grunt-size heavy hit (4.8, 5.3 with flanking's Boon) that the players can deny with the core alone: don't let two goblins get on opposite sides of you. Risk: two goblins of one squad doing it to the same PC is about 10 in one slot.

**T2. Skulk** (Feature). *It comes from where you weren't looking.*
- A goblin that isn't Engaged when its turn starts gains 1 Boon on its first [Strike] Action that turn.
- Simple, and it pays the goblin for circling instead of standing in the line. About a third of a point a turn.

**T3. Pile On** (Feature). *One of them is a nuisance.*
- While another goblin is adjacent to its target, the goblin's melee Basic attack deals 1d4 more on a Tier 3.
- The pack. It rewards exactly what Draw Steel had to cap: all of a squad on one PC. Claude would not take it.

**T4. Nothing more.** Two Basic attacks, the lightest block for a creature that comes in sixes.

### A Reaction

None proposed: Chapter 14 gives a Minion no Reaction Point (two or three act in a slot already, and a Reaction each would be a lot of interruptions). Lucas can give it one.

## Claude's pick (not decided)

**Shiv (M1), Jeer (R3), Knife in the Back (T1). 2 ticks, 13 / 12, Speed 6.**

- Two plain Basic attacks against the two Defenses, and one thing of its own that is about position.
- Its turn on paper: a move and two Shivs, 4.4; a move and Knife in the Back, 5.3; Knife in the Back and a Shiv, 7.6. The Default Minion wants about 4½ moving and 6 standing: the flanking turn runs over, which is the goblin's whole point.
- With the others: goblins Jeer and circle, the orcs hold the front and howl, the wisps go through to the back.
