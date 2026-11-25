# The Ogre Chieftain: the first Elite (the record)

> **Status (2026-11-25): THE ELITE'S RULE (K6) PROPOSED THREE WAYS, the Default Elite derived under Claude's pick, the ogre's ideas shown. Nothing is chosen. Design only: no card source, no Foundry (the Foundry pass comes once, when every NPC is done).** The Bestiary's record is `book/bestiary-design.md`; the earlier creatures', `orc-warrior-redesign.md`, `grave-wisp-redesign.md`, `goblin-sneak-redesign.md`.

## Lucas's words (2026-11-25)

Claude: "Before its cards, it needs one thing settled: what an Elite has beyond twice a Standard's Health." Lucas: **"Ok, lets settle it and start."** The creature is Claude's choice, the Ogre Chieftain (the Elite the playtests used); **nothing is copied from the old sheet** (no Club, no Overhead Smash, no Ground Slam, no Rally the Tribe, no push riders, no Elite Escalation, none of its ratings or its Speed).

## What an Elite is (decided before today)

- **Above a PC; CV 200, two PCs' worth** (G2). The two turns a round went to the Boss, so the Elite "still needs something beyond Health" (K6). Ranks must differ by more than Health (G10). Elite Escalation is deprecated.
- **From the research:** everywhere an elite is twice the staying power plus two attacks, two targets or two turns, never twice the damage a hit; elites are noticed only when they have a job; a visible change at half Health is among the most praised features.

## What an Elite has to deliver (the count)

Twice a Standard's Health is 72. Two such Elites against four PCs get **about 3.9 turns** before the last one falls (`ruler/fight-identity.mjs`); four Standards get 6.7. One body acts once a round however much Health it has, so for the same fight to cost the same 1½ Rally Points a PC:

| | Turns in the fight | Damage to Health a turn it needs |
|---|---:|---:|
| Four Standards | 6.7 | 7.6 |
| Two Elites, a turn each a round | 3.9 | **13.1** (1.7 times a Standard's) |
| Two Elites, each with one extra turn | 5.9 | **8.6** (a Standard's, and a little) |

So the "something" has a size: it is worth about seven tenths of a Standard's turn every round, or one whole extra turn in the fight.

## K6, three ways

**1. Roused: a second turn when it is Bloodied or Strained.** *(Claude's pick.)*
- **The rule:** the first time in an encounter an Elite becomes Bloodied or Strained, it is Roused: when the current turn ends, it takes a turn (it regains its AP and its Reaction Point as at the start of any turn). Once an encounter.
- **Why:** it is the one answer that needs no bigger number: an Elite keeps a Standard's attacks and Defenses, and nothing on its sheet is above a PC's but its Health. It is the visible change at half Health, built on the two thresholds only 2d12 has. It gives the Elite the second place in the turn order that one body lacks under the zipper, at a moment the players choose. And an Elite that is focused down in a round still gets its say.
- **What the players do with it:** they decide when to Bloody it (after its own turn, when it stands badly) and which threshold to push: with Vigor 36 and Resolve 36 it is Roused at half its Health either way; a creature with uneven thresholds is Roused early through its weak one.
- **Not the Boss's two turns:** once a fight, at an event, not every round.
- **Risk:** its extra turn and its own turn can fall close together: about 16 to Health on one PC inside a round.

**2. Wide: every attack of an Elite hits up to two creatures.**
- A Standard's numbers on each creature. It doubles what the Elite does when two PCs stand in its reach and nothing when they don't, so its worth swings with where the PCs stand; it spreads damage (good for the Downs). One sentence, no event to track. It is "the two-target Special" (G6) made the rank's rule.

**3. Watchful: two Reaction Points and two Reactions, with hits one size up.**
- The Elite acts on the PCs' turns twice a round. More to answer, and more interruptions (the redesigns' rule 16); it needs bigger dice on top to reach 13 a turn, which is the squint.

**Rejected, with the reason:** twice the damage a hit (no game read does it, and Lucas: players squint at enemies' bigger numbers); two turns every round (the Boss's, G2); more AP in its turn (a turn holds at most 3 Strikes, so AP past the fourth buy little); ending a condition each turn (it makes an Elite last, not threaten: a candidate for the Boss, H9); a commander's orders as the rank's rule (a job belongs to a creature, not to every Elite).

## The Default Elite (under way 1)

| | Default Standard | Default Elite |
|---|---|---|
| Health | 36 (18 / 18) | **72 (36 / 36)** |
| Defenses, Modifiers | 13 / 13, +2 / +2 | **the same** (a rank moves none) |
| AP | 4 and the Reaction Point | **the same** |
| Basic attack, Special | 1d4! / 2 + 1d6!; about 7 / 11 on one creature, 5 / 8 on each of two | **the same** |
| Damage to Health a turn, at the table | about 8 | **about 8½**, and one more turn in the fight |
| The rank's rule | | **Roused** |
| CV | 100 | **200** |

## The Ogre Chieftain's numbers (Claude's proposal)

- **Health 72: Vigor 44, Resolve 28** (a great body and a slow mind). It is Roused through its Resolve after 28 damage, through its Vigor after 44: a party that presses Resolve wakes it early.
- **Armor Defense 14, Ward Defense 12** (a point moved, the total held). **Body +3, Instinct +1, Appeal +1, Mind -1.** Weapon +2, Power +2.
- **Large (4), Reach 2, Steadiness 1, Speed 5** (Size, Reach and Steadiness are free: Chapter 14). 4 AP and the Reaction Point. **Level 1.** Tags: Ogre, Orc-kin.

## The ideas

### The melee Basic attack (1 AP, At-will; [Weapon, Melee, Strike]; Reach (2); one creature; Weapon vs. Armor Defense)

**M1. Maul** (the plain one). *A club the size of a fence post, swung without hurry.*
- Tier 2: [V] 1d4! Bl. Tier 3: [V] 2 + 1d6! Bl.

**M2. Crushing Grip.** *A hand closes round you like a door shutting.*
- Tier 2: [V] 1d4! Bl. Tier 3: [V] 2 + 1d6! Bl; Grabbed.
- Grabbed is Immobilized until you Break Free or leave its Reach: the ogre holds a PC where its orcs can reach it. A Tier 3 only [judgment: free].

**M3. Shield-Breaker.** *It hits the arm you raised.*
- Tier 2: [V] 1d4! Bl. Tier 3: [V] 2 + 1d6! Bl; Vulnerable 1 (EoT).
- The chief opens a PC up for the rest. The Orc Warrior's War Howl gives the same condition; the two don't add up.

### The second Basic attack (1 AP, At-will)

**R1. Thrown Boulder** (the plain one). [Weapon, Ranged, Strike]; 6 sq.; Weapon vs. Armor Defense. *It picks up something no one else could and throws it.*
- Tier 2: [V] 1d4! Bl. Tier 3: [V] 1 + 1d6! Bl.

**R2. Roar.** [Power, Ranged, Strike, Fear]; 6 sq.; Power vs. Ward Defense. *It turns its whole face toward you and bellows.*
- Tier 2: [R] 1d4! Ps. Tier 3: [R] 1d4! Ps; Staggered (EoT).
- The second Basic attack against the other Defense. No Reactions until the end of your turn: the chief silences the PC who was about to answer its charge.

**R3. Hurled Goblin.** [Weapon, Ranged, Strike]; 6 sq.; Weapon vs. Armor Defense. *The goblin has time to look surprised.*
- Requirement: a willing Minion ally is within its Reach. Tier 2: [V] 1d4! Bl. Tier 3: [V] 1 + 1d6! Bl. Effect: the Minion lands in an empty square adjacent to the target (hit or miss).
- A joke that works: it moves a goblin behind a PC, where Knife in the Back is waiting. It needs a goblin beside the chief, and one more sentence about the landing.

### The Special (2 AP, Round)

**S1. Great Sweep.** [Weapon, Melee, Strike]; Reach (2); up to two creatures; Weapon vs. Armor Defense. *The club goes round at chest height.*
- Tier 2: [V] 2 + 1d6 Bl. Tier 3: [V] 4 + 1d8 Bl.
- The plain two-creature Special, at Reach 2 from a Large body: it covers a lot of ground. 4.8 a creature.

**S2. Marching Orders.** [Appeal]; no roll; up to two allies within 6 squares that can hear it. *It points, and they go.*
- Effect: each target makes one of its Basic attacks, or Advances.
- Its job: a chieftain. Two orc axes are 6.4, a Special's worth, struck from wherever the orcs stand. It is nothing alone, which is the players' answer: kill its followers, or kill it. The research's elites that are noticed "have a job".

**S3. Skull-Ringer.** [Weapon, Melee, Strike]; Reach (2); one creature; Weapon vs. Armor Defense. *It brings the club straight down.*
- Tier 2: [V] 3 + 1d6! Bl. Tier 3: [V] 6 + 1d8! Bl; Dazed 1.
- The single heavy hit. Dazed 1 takes 1 AP now: the strongest thing a card can take, so it sits on a Tier 3 only and the damage is a point under a Standard's 7 / 11 [judgment].

### The Reaction (1R)

**X1. Meat Shield** (Round). *It hauls the nearest goblin into the way.*
- Interrupt: a [Strike] Action would damage the ogre. Requirement: a Minion ally is within its Reach. Effect: that Minion takes the Strike's damage and riders in the ogre's place (it loses ticks by the Strike's Tier).
- The followers get a second job, and the players a reason to clear them first. It costs the ogre a goblin each time.

**X2. Shake It Off** (Round). *It tosses its head like a bull with a fly on it.*
- Trigger: an enemy's Action gives the ogre a condition. Effect: the ogre takes 1d6 damage that nothing reduces, and that condition ends.
- The research's accepted protection: the players' card still did something, and the ogre visibly pays. (A Boss will need this more than an Elite: H9.)

**X3. Backhand** (Round). *You stepped inside its reach as if it weren't looking.*
- Interrupt: an enemy would enter a square adjacent to the ogre. Effect: the ogre makes a melee Basic attack against it.
- Its Reach 2 becomes a zone to cross. It fires most rounds: the most interruptions of the three.

### Features

**F1. Its size** (free): Large (4), Reach 2, Steadiness 1.

**F2. The Tribe Breaks.** When the ogre goes Down, each ally with the Goblin or Orc Tag that can see it is Dazed 1.
- A reason to go for the chief first: 72 Health to get through, and the rest lose an AP when it falls. A real choice between two orders of killing.

**F3. Nothing more.**

## Claude's pick (not decided)

**Way 1 (Roused). Vigor 44, Resolve 28; 14 / 12. Maul (M1), Roar (R2), Marching Orders (S2), Meat Shield (X1), its size and The Tribe Breaks (F1, F2).**

- An Elite with a job: it fights through its followers, hides behind them, and their nerve goes with it.
- Its turn on paper: a move, Marching Orders (two orc axes, 6.4) and a Maul, 9.6; standing, 12.5. A Standard's turn, as the Default Elite asks, and it gets one more when it is Roused.
- If the first Elite should be the plain reference instead: Maul, Thrown Boulder, Great Sweep, Shake It Off, its size only.
