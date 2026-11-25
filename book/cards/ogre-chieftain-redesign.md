# The Ogre Chieftain: the first Elite (the record)

> **Status (2026-11-25, later): DECIDED, IN THE BOOK AND BUILT (Foundry v0.0.508).** Chapter 14 writes it as a stat block; its cards: `cards/stage0/bestiary.json` (Crushing Grip and Hurled Goblin Silver, the rest Gold). Not tested by Lucas. The sheet near the end of this file is the creature; the "Closed" section is the last word.

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

## Lucas's answer (2026-11-25)

"Hmm.. Roused is interesting but the Risk is quite big. People will have to synergize dealing both kinds of damage to not trigger it earlier, and causing Roused while it is in melee with another PC, hurts that other PC. Should we do per elite? As features? Or its best to do one default elite feature?"

"M2 + R2 + R3 as an extra special (2AP, round, can keep as is because of its extra special effect) + S1 + A "ground slam" ability, like it hits the ground, hits all creatures in a 3 line, makes it difficult terrain EoE; once an Encounter + X1 but changed to Turn - a flat 1 bludgeoning damage and shove 2, no rolls; literally a backhand from an ogre. + F1"

"Lots of features and questions here. Review it one by one."

## Claude's review, one by one (2026-11-25)

### 1. Roused, and "per Elite or one default?"

- **His two objections hold.** With any thresholds an Elite is Roused exactly once before it dies (one of the two must fill first), so the players never avoid it: they only choose when, and the PC who chooses is often not the PC who pays. That is a quarrel at the table built into a rank.
- **What can't be per creature is the size.** The count says an Elite must be worth one extra turn in a fight beyond a Standard's turns (about 9 or 10 more damage to Health at the table, or the like in effect). Whatever form it takes, every Elite needs that much, or CV 200 lies.
- **What should be per creature is the form.** **Claude's proposal now: one default slot, not one default effect. "An Elite has an Encounter Action of its own, worth about a turn."** It is used on the Elite's own turn (no out-of-turn swing landing on a bystander), the GM picks the moment, the players see the card and learn it, and each Elite's is different: the research's elites are noticed when they do something of their own. It is also where bigger dice have a place (a PC's own Encounter Action, Smite, takes about 70% of a Standard).
- **Lucas's own sheet for the ogre already does this:** his Ground Slam is that Encounter Action. So the ogre needs no Roused.
- **Roused stays as a possible signature** for a creature meant to enrage (a berserker), written on its sheet where the players can read it, not as the rank's rule.
- For quick building (G8's "Default Elite"): a Standard with twice the Health and one Encounter Action that hits several creatures for about twice a Round Special.

### 2. Crushing Grip (M2: the melee Basic attack; a Tier 3 adds Grabbed)

- Good for an ogre with Reach 2: a Grabbed PC is Immobilized until it Breaks Free (1 AP, a Body or Instinct Check against DC 13) or is out of the ogre's Reach, and it stands where Great Sweep and Ground Slam land next.
- **One sentence it needs:** the ogre holds one creature at a time (a club in one hand, the other free); a new Grab lets the first one go.
- A Tier 3 is about one hit in four, so it is free [judgment].

### 3. Roar (R2: the second Basic attack, against Ward Defense; a Tier 3 adds Staggered (EoT))

- Fine as written. It gives the ogre Resolve damage and its two Basic attacks the two Defenses, his default.
- Staggered switches off a PC's Reactions until the end of its turn (Shield of Faith, Snap Shot): a short cancel, on a Tier 3 only.

### 4. Hurled Goblin as a second Special (2 AP, Round)

- **It works as a 2 AP card:** a Basic attack's damage (2.9) is well under a Special's 6, and the goblin landing beside the target is what the other 3 points buy: it saves the goblin its move and sets up Knife in the Back.
- **What the card must say:** the Minion is willing and within the ogre's Reach; the target is within 6 squares with Line of Effect; the goblin is Repositioned to an empty square adjacent to the target, the ogre's choice (hit or miss; no square, no throw); it takes no damage and keeps its own turn. As a Special it has no Critical die.
- With no goblin beside it the card can't be used; the ogre sweeps instead. Right for a chieftain.

### 5. Great Sweep (S1)

- Fine: up to two creatures in Reach 2, [V] 2 + 1d6 Bl / 4 + 1d8 Bl each (4.8 a creature). The Standard's two-creature Special.

### 6. Ground Slam (new; once an Encounter)

- **The name is the old sheet's** (its Encounter Action was Ground Slam, a different shape). His to keep; otherwise Split the Earth.
- **What he gave:** the ogre hits the ground; all creatures in a Line 3; the Line is Difficult Terrain until the encounter ends.
- **What it still needs, with Claude's defaults:** 2 AP. A Save Action: an Instinct Save against its Weapon DC (13), each creature in the Line, allies too. Tier 1: [V] 5 + 2d8 Bl. Tier 2: [V] 3 + 1d8 Bl. Tier 3: no effect. Effect: the squares of the Line are Difficult Terrain for every creature (EoE).
- **Why that size:** it is the Elite's extra turn. About 8 to each creature in it on average; a Line 3 holds one PC or two. A Tier 1 of 14 is 40 to 48% of a PC in one roll: big, once a fight, and seen coming once the players know the card.
- **The terrain matters more than it looks:** an Evade can't enter Difficult Terrain and a Charge can't cross it, so the ogre breaks the footing in front of itself for the rest of the fight, for both sides. A lasting change to the map is one of the things the research found tables like.
- A Line starts from the ogre's own space (Chapter 3); for a Large creature the card should say from which edge: any square of its edge, its choice.

### 7. The Reaction ("X1 but changed to Turn": read as Backhand, X3)

- **Claude's reading:** he wrote X1 (Meat Shield) and described a backhand, which was X3. Taken as **Backhand (Reaction; Turn, 1R). Interrupt: an enemy would enter a square adjacent to the ogre. Effect: it takes [V] 1 Bl and is Pushed 2. No roll.** To confirm.
- **Turn, not Round:** it can answer each enemy on its own turn, but each use costs 1R: the Reaction Point pays for one a round, and any more come from AP the ogre kept (an NPC's kept AP gives no Guard, so that is a real price).
- **What it does to the mover:** the push lands before the PC enters the square, so its movement is disrupted and ends where it stood (Chapter 2); it is then 2 squares farther, still inside the ogre's Reach 2, and has to spend again to close. About 1 AP taken from one melee PC a round, with no roll to fail.
- **The flat 1** is his own exception to "no damage line that is only a flat number": noted on the card as meant.
- **Collision makes it more than 1:** pushed into a wall it is 2 a square not moved, into another creature 1 each. A PC's Steadiness lowers the 2.
- **To watch:** it is felt only by PCs who fight in melee; with Grabbed and Great Sweep the ogre is a creature the Archers are safest from. Fine for one Elite, a pattern to avoid across the Bestiary.
- A Grabbed creature can be pushed by its holder (Chapter 8), and the push takes it out of the Grab's reach only if it leaves Reach 2.

### 8. Its size (F1)

- Large (4), Reach 2, Steadiness 1: free (Chapter 14), and what makes Great Sweep, the Line and Backhand cover real ground.

### 9. The whole sheet against the Elite's size

- **Its turns on paper:** a move, Great Sweep and a Crushing Grip, 8.0 on one PC and 12.7 with two in the Sweep; standing, with a Roar, 10.5 to 15.2. The Ground Slam turn (the Slam and the Sweep), 12.7 to 25.
- **Over a fight of two such ogres** (about two turns each, one of them the Slam turn): about 27 to Health each at the table with the Backhands, 54 for the pair, against the 51 a normal fight should cost. **The set is an Elite's worth with no Roused.**
- Six cards and a size line: the most on any sheet so far, on a creature that comes one or two at a time.

### The sheet as it stands (not built; the lines in italics are Claude's defaults)

**Ogre Chieftain.** Elite, CV 200, level 1. Health 72 (*Vigor 44, Resolve 28*). *Armor Defense 14, Ward Defense 12.* Weapon +2, Power +2. *Body +3, Instinct +1, Appeal +1, Mind -1.* Large (4), Reach 2, Steadiness 1, Speed 5. 4 AP and the Reaction Point. A club in one hand, the other free. Tags: Ogre.

- **Crushing Grip** (Basic attack; At-will, 1 AP; [Weapon, Melee, Strike]; Reach (2); one creature; Weapon vs. Armor Defense). Tier 2: [V] 1d4! Bl. Tier 3: [V] 2 + 1d6! Bl; Grabbed. *The ogre holds one creature at a time.*
- **Roar** (Basic attack; At-will, 1 AP; [Power, Ranged, Strike, Fear]; 6 sq.; one creature; Power vs. Ward Defense). Tier 2: [R] 1d4! Ps. Tier 3: [R] 1d4! Ps; Staggered (EoT).
- **Great Sweep** (Special; Round, 2 AP; [Weapon, Melee, Strike]; Reach (2); up to two creatures; Weapon vs. Armor Defense). Tier 2: [V] 2 + 1d6 Bl. Tier 3: [V] 4 + 1d8 Bl.
- **Hurled Goblin** (Special; Round, 2 AP; [Weapon, Ranged, Strike]; 6 sq.; one creature; Weapon vs. Armor Defense). Requirement: a willing Minion ally is within the ogre's Reach. Tier 2: [V] 1d4! Bl. Tier 3: [V] 1 + 1d6! Bl. Effect: the Minion is Repositioned to an empty square adjacent to the target, the ogre's choice.
- **Ground Slam** (Special; Encounter, *2 AP*; [Weapon, Save, Area]; Area: Line 3; all creatures in the Area; *Instinct Save against its Weapon DC, 13*). *Tier 1: [V] 5 + 2d8 Bl. Tier 2: [V] 3 + 1d8 Bl. Tier 3: no effect.* Effect: the squares of the Line are Difficult Terrain (EoE).
- **Backhand** (Reaction; Turn, 1R). Interrupt: an enemy would enter a square adjacent to the ogre. Effect: it takes [V] 1 Bl and is Pushed 2.

## Lucas's answers to the review (2026-11-25)

"1. Yes. 2. Yes, but the name could sound more "ogreish". 3. Not really interrupts it, since the PC can move in with 2 movements only, get backhanded, then still has movement, it doesnt disrupt movemetn."

- **1. Decided: the Elite's rule is a slot. "An Elite has an Encounter Action of its own, worth about a turn."** Roused is only a possible signature for some creature, never the rank's rule. (K6 is closed.)
- **2. Decided: the Slam's numbers** (2 AP; an Instinct Save against DC 13; [V] 5 + 2d8 Bl / 3 + 1d8 Bl / no effect; the Line 3 is Difficult Terrain for everyone, EoE). **Its name is open:** Claude's candidates, plain and heavy as an ogre would say it: **Crack the Ground** (used below until he picks), Flatten, Pound the Earth, Earthbreaker.
- **3. Corrected: the Backhand doesn't disrupt the movement.** Claude had it as an Interrupt that stops the mover where it stood and costs it about 1 AP: wrong. His ruling: the PC is knocked back and goes on with the movement it has left. So it is written as a **Trigger** (the enemy has entered the square), with the sentence that says so. What it costs a PC is 2 squares of movement and 1 damage, not an Action.

### What follows from the Backhand as he rules it (Claude's notes)

- **An Evade never triggers it:** an Evade is movement that triggers no Reactions (Chapter 3). So stepping in with an Evade is every PC's answer, from the core.
- **Once a turn:** a PC knocked back walks in again on the same Advance if it has the squares, and the ogre can't answer twice.
- **A Charge is the one case where it costs an Action:** a Charge's movement ends on the first square that reaches its target; the Backhand then throws the charger 2 squares back, and its Basic Attack has no target (Chapter 2: the attack is made "if there is a valid target"). **For Lucas to say:** leave it (charging an ogre is a mistake the players learn once), or let a Charge go on.
- The push is from the ogre: 3 squares from it after the blow, outside its Reach 2. Into a wall or another creature it adds Collision damage.

## The sheet (decided but for the Slam's name; not built)

**Ogre Chieftain.** Elite, CV 200, level 1. Health 72 (Vigor 44, Resolve 28). Armor Defense 14, Ward Defense 12. Weapon +2, Power +2. Body +3, Instinct +1, Appeal +1, Mind -1. Large (4), Reach 2, Steadiness 1, Speed 5. 4 AP and the Reaction Point. A club in one hand, the other free. Tag: Ogre.

- **Crushing Grip** (Basic attack; At-will, 1 AP; [Weapon, Melee, Strike]; Reach (2); one creature; Weapon vs. Armor Defense). *A hand closes round you like a door shutting.* Tier 2: [V] 1d4! Bl. Tier 3: [V] 2 + 1d6! Bl; Grabbed. The ogre holds one creature at a time: a new Grab lets the first go.
- **Roar** (Basic attack; At-will, 1 AP; [Power, Ranged, Strike, Fear]; 6 sq.; one creature; Power vs. Ward Defense). *It turns its whole face toward you and bellows.* Tier 2: [R] 1d4! Ps. Tier 3: [R] 1d4! Ps; Staggered (EoT).
- **Great Sweep** (Special; Round, 2 AP; [Weapon, Melee, Strike]; Reach (2); up to two creatures; Weapon vs. Armor Defense). *The club goes round at chest height.* Tier 2: [V] 2 + 1d6 Bl. Tier 3: [V] 4 + 1d8 Bl.
- **Hurled Goblin** (Special; Round, 2 AP; [Weapon, Ranged, Strike]; 6 sq.; one creature; Weapon vs. Armor Defense). *The goblin has time to look surprised.* Requirement: a willing Minion ally is within the ogre's Reach. Tier 2: [V] 1d4! Bl. Tier 3: [V] 1 + 1d6! Bl. Effect: the Minion is Repositioned to an empty square adjacent to the target, the ogre's choice (hit or miss); it takes no damage.
- **Crack the Ground** (the Elite's Encounter Action; Encounter, 2 AP; [Weapon, Save, Area]; Area: Line 3, from any square of the ogre's edge; all creatures in the Area; Instinct Save against its Weapon DC, 13). *It brings the club down two-handed, and the floor gives.* Tier 1: [V] 5 + 2d8 Bl. Tier 2: [V] 3 + 1d8 Bl. Tier 3: no effect. Effect: the squares of the Line are Difficult Terrain for every creature (EoE).
- **Backhand** (Reaction; Turn, 1R). *You stepped inside its reach as if it weren't looking.* Trigger: an enemy enters a square adjacent to the ogre. Effect: it takes [V] 1 Bl and is Pushed 2. Its movement isn't disrupted: it goes on with the movement it has left.

## Closed (Lucas, 2026-11-25)

"Crack the Ground is good. Charge: Its fine, or we can add a Body/Instinct save (t1 is normal effect, t2 is the 1 damageo only, t3 no effect) if it is too strong."

- **The Encounter Action is Crack the Ground.**
- **The Backhand stays as written, with no roll** (Claude's call, as he left it): what it takes is 2 squares of movement and 1 damage, once a round for the ogre's Reaction Point; an Evade walks past it; only a Charge loses an Action to it, and that is a lesson learned once. A roll would add an interruption to every approach for a card that small. **On watch for the table; his fix is ready if it proves too strong: a Body or Instinct Save (Tier 1 the whole effect, Tier 2 the 1 damage only, Tier 3 nothing).**

