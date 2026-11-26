# Playtest 8 (Stage 0, level 1; Lucas, 2026-11-26)

Lucas's solo playtest of the rebuilt Bestiary (Foundry v0.0.519): the four level 1 pregens against the Ogre Chieftain (Elite, CV 200, Health 72),
the Orc Warrior (Standard, 100, Health 36), the Grave Wisp (Grunt, 50, Health 18) and two Goblin Sneaks (Minions, 30 each, 2 ticks):
**CV 410, about 102 a PC** (100 is normal). Over in round 2, nobody Down. The first fight measured by the Encounter Log.

**What was applied from it (2026-11-26):** the two clarifications (section 3) are in the book, Chapter 2. **Nothing else changed:** no card, no
number (Lucas on Trip: "Keep as is, we need more playtests"). The HUD's fixed buttons are a mockup (`foundry/mockups/sit-fixed/`), not built.

## 1. Lucas's notes (as he wrote them)

**Playtest notes**
- It played much much much faster. I dont know if it was luck or if it was intended. It also felt easy until the ogre did his turn and did so
  much damage with the encounter action.
- Feint is almost a necessary use I'd say when using an encounter ability.
- Demoralize didnt have a chance of shining.
- With Feint and Demoralize, I feel trip might have lost its spark, it might be just me though. Keep as is, we need more playtests.
- I am curious to see if this is the intended play. It felt almost brainless, doing attack after attack most of the time.

**Clarifications**
- Darting blade has a movement after, like many other abilities. If the Wisp's Dying Flare triggers on this damage, is the trigger before the
  movement or after? I would say since the effect is after the damage, not a setup, it happens then the movement happens.
- "An X enters a sqaure adjacent to you" many players can say "Oh, but I moved closer, that means it enters right? So it procs?" for stuff like
  Backhand. We either do "move" according to the movement rules or we clarify it.

**Improvements**
- When using the area, if I move it around, the "Cancel" button on the hud also moves around depending if it is left or right, but if the hud
  is in a certain position, I try to hover over Cancel and it moves since it is also moving on the map. Lets make all buttons of the
  situational tab be fixed. Lets do a mockup of each and make sure it is always fixed.

## 2. The full report (Claude, 2026-11-26)

Everything here is counted from the Encounter Log's report (section 5) and the cards as they are in `cards/stage0/` and `cards/basic-actions.json`.
**One fight is one sample: nothing here is a reason to change a number yet.** Where the log doesn't say something (an Escalation, which Boons
and Banes a roll had, a Save's Tier), it is marked as not known, not guessed.

### 2.1 The verdict against the targets

| Measure | The target (Chapter 14, `bestiary-design.md`) | Playtest 8 |
|---|---|---|
| Cost in Rally Points a PC | Normal: about 1½ (1¼ to 1¾) | **1.3 to 1.4** (45 by the log, 47 with two Collision damage it missed, see 2.9; one Rally Point of each PC removes 8 + 9 + 9 + 8 = 34) |
| Downs | "a PC goes Down now and then" | **0**; the lowest PC was Aveline at 15 of 35 |
| Length | decided in round 2, over in round 3 (decision 13) | **over at the end of round 2**: 14 turns in all (8 of the party's, 6 of the enemies') |
| The party's damage | about 17 a turn at the table, 23 on paper (decision 4) | **18.4 a turn** (147 in 8 turns) |
| An enemy turn's damage to Health | about 8 a Standard's turn (decision 14) | **about 7** (45 over 6 enemy turns worth 6.1 Standard turns: the ogre's two count double) |
| Rally Points used, Guard kept | (none assumed) | **0 and 0**: nobody healed, nobody kept an AP |

The cost and both damage rates are on target. The length is one round short, and the cost arrived in one blow instead of over the fight.

### 2.2 Why it was fast

In order of weight:

1. **The enemies had 130 Health in all** (ogre 72, orc 36, wisp 18, two goblins of 2 ticks). Playtest 6's line-up, the last one recorded with
   its numbers, had 220 (130 + 60 + 3 × 10) and took 4 rounds. At about 69 a round the new 130 lasts 1.9 rounds when nothing is wasted. The
   target "over in round 3" needs about a round of waste, and the party wasted almost nothing: **17 of overkill** (ogre 12, orc 3, wisp 2),
   2 AP unspent (Kaela's, with nothing left to shoot), 3 AP on movement.
2. **The turn order.** Round 1: Sylwen, Goblin 1, Goblin 2, Durgan, ogre, Aveline, wisp, Kaela, orc. Both goblins and the wisp died in round 1
   after one turn each. The orc acted last, so in round 2 it was dead before its turn. **The enemies took 6 of the 10 turns two rounds
   would give them**; the party took all 8 of its own.
3. **The dice, a little.** The party's 20 rolls gave 6 Tier 1, 8 Tier 2, 6 Tier 3; the same rolls give about 7 / 9½ / 3½ on average (a count
   without exploding 12s, so a little low on Tier 3). The two or so extra Tier 3s fell where they counted: Durgan's round 2 was a Tier 3 Smite
   and a Tier 3 Basic Attack on a Doubles, 34 damage, and it left the orc at 2. Two damage dice also exploded on big hits (Aveline's Longsword
   for 14, the orc's axe for 9). The enemies' 12 attack rolls were average (4 / 5 / 3 against about 4 / 6 / 2).
4. **Two Encounter cards landing in the same round.** The two Smites dealt 59 of the 147 (40%).

**At average dice (an estimate of one swing, not a simulation):** had Durgan's two round 2 rolls been Tier 2s, he deals about 27 instead of
34, the orc ends the round on about 4 Health instead of dead, takes its second turn, and the fight ends on the party's first turns of round 3.
That is the target. So the design gives "end of round 2 to early round 3", and this fight sat at the fast edge of it.

### 2.3 Round by round

| | The party dealt | The party took (to Health) | Enemies standing at its end |
|---|---:|---:|---|
| Round 1 | 61 (17 + 12 + 20 + 12) | 22 | ogre (37 of 72 left), orc (36 of 36) |
| Round 2 | 86 (11 + 34 + 37 + 4) | 23 by the log, 25 with the Collisions | none |

- **Round 1** removed three of the five enemies (110 of the 410 CV) for 22 damage spread over three PCs. The front line met the enemies
  where they came; neither Archer was reached.
- **Round 2** was three blows: Durgan's 34 on the orc, the ogre's Crack the Ground (25 on two PCs), Aveline's 36 on the ogre.
- **The fight was decided when round 1 ended**: two enemies left against four PCs who had lost 22 of 128.

### 2.4 Each PC

| PC | Round 1 | Round 2 | Dealt | Took | Reactions |
|---|---|---|---:|---:|---|
| **Sylwen** | Basic Attack T3 9; Quick Shots T1 2; Basic Attack T2 6 | Advance; Demoralize T1; Quick Shots T2 11 | 28 | 12 | none offered |
| **Durgan** | Basic Attack on each goblin (both killed); Charge, Basic Attack T3 8 on the wisp | Feint T1; Smite T3 23; Basic Attack T3 11 | 46 | 13 | Shield of Faith: passed once (on 1 damage), used once (−3) |
| **Aveline** | Binding Light T1 5; Basic Attack T2 14; Basic Attack T1 1 | Feint T3; Smite T2 Favored 36; Drawing Light T1 1 | 57 | 19 (20 with the Collision) | Rebuke on the orc (Hindered; its move went on) |
| **Kaela** | Strafe T3 6; Darting Blade T2 6 (the wisp killed) | Advance; Basic Attack T2 4 (the orc killed) | 16 | 1 (2 with the Collision) | none offered |

- **Durgan had the best fight:** three kills' worth in round 1 (two Minions and half the wisp for 4 AP), then the orc almost alone.
- **Aveline dealt the most and paid the most:** every blow of the ogre was on her (Taunted or not), 19 of the party's 45.
- **The Archers dealt 44 of the 147 (30%) with half the party's AP.** Sylwen's two Quick Shots were 13 for 4 AP; Kaela's whole round 1 was
  12 for 4 AP, at −4 Boons and Banes on the Strafe (the log doesn't say which Banes). It agrees with what `core-rework.md` H6 already
  watches: ranged damage is low. **Neither Archer used Steady Draw's Special** (once an encounter, the Reaction Point for 2dE more on a
  Basic Attack's Tier 2 or 3): Sylwen had two such Basic Attacks in round 1, Kaela one in round 2, and both ended the fight with their
  Reaction Point unspent.

### 2.5 What the party's AP bought

30 of the party's 32 AP were spent:

| Spent on | AP | Damage | Damage an AP |
|---|---:|---:|---:|
| Basic Attacks (9 rolls) | 9 | 57 | **6.3** |
| Smite (2) | 4 | 59 | **14.8** |
| The other class cards (Quick Shots 2, Binding Light, Strafe, Darting Blade, Drawing Light) | 11 | 31 | **2.8** |
| Maneuvers (Feint 2, Demoralize 1) | 3 | 0 | one Favored roll |
| Movement (two Advances, the Charge's move) | 3 | — | — |

**This is the number behind "attack after attack": apart from Smite, the Basic Attack was the party's best button, at more than twice the
damage an AP of the Round cards.** Two things make the gap bigger than it is: the Round cards rolled badly (Quick Shots and Binding Light a
Tier 1 each), and their riders had no time to matter (Binding Light's Immobilized never landed; Quick Shots' and Darting Blade's Evade and
Strafe's Push moved someone but changed no outcome the log shows). The Basic Attack's At-will Banes (−1 on the second, −2 on the third of a
turn) were paid five times and did not stop it: the nine Basic Attacks were five firsts, three seconds and one third.

So the play Lucas felt is the play the numbers reward in a fight of this length: open with the Round card because it is there, then Basic
Attacks, and Smite when the target is worth it.

### 2.6 Each enemy

| Enemy (CV) | Turns | What it did | Dealt (raw) | Its Reaction | Died to |
|---|---:|---|---:|---|---|
| **Goblin Sneak 1** (30) | 1 | Advance; Shiv T1; Shiv T1 | 0 | none (no AP kept) | one Basic Attack |
| **Goblin Sneak 2** (30) | 1 | Charge; Shiv T2 1; Shiv T3 3 | 4 | none (no AP kept) | one Basic Attack |
| **Grave Wisp** (50) | 1 | Slipping Touch T3 4; Pass Through T1 | 5 with the Flare | Dying Flare: 1 on Kaela | Durgan's Charge 8, Strafe 6, Darting Blade 6 |
| **Orc Warrior** (100) | 1 | Advance, Rebuked (Hindered), Advance, Advance; Hamstringing Axe T2 9 | 9 | Blood for Blood: Tier 1, nothing | Smite 23, Basic Attack 11, Drawing Light 1, Basic Attack 4 |
| **Ogre Chieftain** (200) | 2 | R1: Advance; Crushing Grip T2 1; Great Sweep T3 6 on one target. R2: Shove T2; Advance; Crack the Ground 11 + 14 | 32 | Backhand: never offered | 48 over round 1 and Sylwen's round 2, then Smite 36 |

- **The Minions did what Chapter 14 says a Minion is for** (fodder): 4 damage and two of Durgan's AP. A Minion's Reaction needs a kept AP
  and both spent all 3, so Shriek and Scatter never happened; and both were dead before the ogre's turn, so **Hurled Goblin was never possible**.
- **The wisp** died in round 1 to 4 AP of two PCs. Its Dying Flare (the reason for the first clarification) dealt 1.
- **The orc spent 3 of its 4 AP walking**, because Rebuke Hindered it on the way: one Reaction of Aveline's cost it about one attack. It made
  two attack rolls in the whole fight. Its 9 was a 1d4! that exploded twice (the average is about 3); **Barbed Javelin and Cornered were never seen.**
- **The ogre rolled low in round 1** (a Tier 2 Crushing Grip for 1, a Tier 3 Great Sweep for 6 where 4 + 1d8 averages 8½, on one target of
  its two) and Shield of Faith took 3 of it: 4 damage to Health from an Elite's first turn. Its round 2 was the opposite: 25 from one Action.
  Over two turns it landed 27, 13.5 a turn against the 16 an Elite's two Standards would give: in line. **It never Grabbed anyone**
  (Crushing Grip needs a Tier 3) **and Backhand was never offered** (nobody walked up to it: it came to Aveline).
- **So of the enemies' special pieces, the party saw two**: Crack the Ground and Dying Flare. Blood for Blood fired and missed. Backhand,
  Hurled Goblin, the Grab, Shriek and Scatter, the Javelin, Cornered and Pass Through's damage were not seen. The creatures have not been
  tested yet; their turn-one basics have.

### 2.7 What nobody used

- **Rally Points and Steel Yourself:** none. Nobody was low enough, early enough, to give up an attack.
- **Guard from kept AP:** none; every PC spent everything (Kaela's 2 were left only because the fight ended).
- **Trip, Shove (by a PC), Lay On Hands, Harrying Shot, Slip Away, Snap Shot:** none. The two Archer Reactions were never offered: no enemy
  came next to an Archer on its own movement.
- **Reactions:** the party was offered 3 and used 2 (Shield of Faith, Rebuke). The enemies used 2 of the 3 Reaction Points that could pay
  for one (the wisp's and the orc's; the ogre's went unused).
- **Escalation:** the log doesn't say what anyone's was. Aveline's Smite dealt 20 Resolve, so it was not 1.

### 2.8 Lucas's five notes

1. **"Much much much faster. Luck or intended?"** Mostly intended: 2.2. The Bestiary's own numbers put the end between the last turns of
   round 2 and the first of round 3; this fight got the fast edge through the turn order and two or so Tier 3s. **"Easy until the ogre's
   turn":** yes: before Crack the Ground the party had taken 22 in nine enemy attack rolls; that one Action then dealt 25. An Elite's
   Encounter Action is meant to be the fight's moment, and it was the only one the enemies got.
2. **"Feint is almost a necessary use with an encounter ability."** Twice, both before a Smite. Durgan's failed (Tier 1) and the Smite rolled
   a Tier 3 anyway; Aveline's was a Tier 3 (Favored) and her Smite a Tier 2, and the log doesn't show whether the third die changed the
   Tier. So this fight shows the habit, not the payoff. The reasoning behind the habit is sound: 1 AP is worth about 6 damage as a Basic
   Attack (2.5), and Smite's step from Tier 1 to Tier 2 is 16 Vigor, from Tier 2 to Tier 3 another die. Feint also asks nothing else of the
   turn (it uses Reach, and the Paladin is already there). **On watch:** the charter's "no one best button": a 1 AP step that is always
   right before the big card is a tax, not a choice.
3. **"Demoralize didn't have a chance of shining."** One use: Sylwen on the ogre, Tier 1, nothing. Even on a Tier 2 its Vulnerable 1 (EoT)
   would have had one more attack of hers to work on. In a two-round fight a rider that pays over several hits has little room.
4. **"Trip might have lost its spark."** Not used. In this fight nothing asked for it: no enemy was worth an AP to put Prone, because each
   was dead within a round of being reached. Not evidence against Trip; evidence that the fight gave control nothing to do.
5. **"Almost brainless, attack after attack."** 2.5: outside Smite the Basic Attack was the best damage an AP, the fight was decided in round
   1, and nothing forced a choice between attacking and something else (no PC in danger, no enemy escaping, no terrain used). **Claude's
   opinion, not a decision:** this is what a two-round fight looks like more than a fault of the Actions. Choices come from pressure and
   from time, and this fight had neither until its last enemy turn.

### 2.9 What the log got wrong or leaves out (for Foundry)

Wrong:
- **Collision damage is missing from the tables.** Aveline was Pushed into Kaela; Aveline's Current is 15 where 35 − 19 is 16, Kaela's 27
  where 29 − 1 is 28, and the party's 81 where 128 − 45 is 83. The 2 damage is in no column, so the Party Health Cost reads 45 where it was 47.
- The title lists "Goblin Sneak, Ogre Chieftain, Grave Wisp": the Orc Warrior fought and is missing.
- The watchlist's States line holds a card's text: "R2 Orc Warrior → Bloodied · Drawing Light: You can Slide the target that distance instead
  of pulling it." (and the Orc Warrior had already become Bloodied that round).
- Kaela's round 2 turn has no "[AP 4/4]".
- Order inside a turn: "Aveline Pushed 1 (hits Kaela)" is written before the Shove that pushed her; "OC: Taunted (Durgan)" before the Shield
  of Faith that Taunted it.
- "Aveline: Crack the Ground" is written as if it were a state of hers (it is the Zone's effect).

What this report could not count because the log doesn't hold it (suggestions, not asked for):
- **Which Boons and Banes** a roll had (only their sum: Kaela's "−4 B/B").
- **Each PC's Escalation** when it changed, and Smite's dice.
- **A Save's Tier** (Rebuke, Dying Flare, Crack the Ground show the damage only).
- **A Favored roll's third die**, to see whether Favored changed the Tier.
- **The squares between creatures** (who was Engaged, who Flanked, how far the Archers stood).
- **AP spent a turn** by kind, and the cost in Rally Points a PC itself (the log gives a percentage of Health; Chapter 14 measures in Rally Points).

### 2.10 What one fight can't tell, and what the next ones should show

Not known after this fight: whether the fights are a round short on average or this one was the fast edge; what the Bestiary's Reactions
and special Actions do to a party (most never happened); what a fight does when the party doesn't act first; what Demoralize and Trip are
worth; whether Feint's Favored pays for its AP.

For the next playtests (Claude's suggestions; none is a decision):
- **The same line-up again, unchanged**, at least twice more: three samples of one fight say what the dice and the turn order were.
- **One fight where the enemies are met later or act first** (a start farther apart, or the ogre and the orc ahead of the party): it shows
  Backhand, Hurled Goblin, Blood for Blood and the Archers' Reactions, which need enemies alive and moving.
- **Watch three counts:** the turn the last enemy dies on; how many enemies get a second turn; the damage an AP of Basic Attacks against the
  Round cards (2.5's table). If the fights keep ending in round 2 with the Basic Attack ahead, the lever is the fight's length (decision
  13's 36 Health a PC), and the maneuvers' and Round cards' riders are judged after that, not before.

## 3. The two clarifications (applied to the book, 2026-11-26)

1. **A Reaction happens at its moment, not at the end of the triggering Action** (Lucas: "since the effect is after the damage, not a setup, it
   happens then the movement happens"). Chapter 2, Reactions, a new line "At its moment", with his case as the example (Darting Blade, the wisp's
   Dying Flare: the Archer is still beside the wisp, is in the Area and makes the Save; then the wisp goes Down; then the Evade 2).
   Foundry already resolved it in this order (the log: Dying Flare, then Evade 2).
2. **"Enters a square" is the movement of the creature named** (Lucas: "We either do 'move' according to the movement rules or we clarify it").
   Chapter 2, a new section "Entering a Square" (and a Glossary row): a creature enters a square when its own movement brings it there; when you
   are the one who moves, the other creature has entered nothing, has not moved closer and has not moved away; only its own Move Action counts
   (Evade, Forced Movement and Reposition don't trigger Reactions, as before). Foundry already works this way (`moment.mjs`, `enemyEnters` /
   `enemyAdjacent` fire only on the mover's own movement).

**Assumptions Claude made writing them (Lucas's to revert):**
- **A creature already adjacent that steps to another adjacent square "enters a square adjacent to you".** It is the literal reading and what
  Foundry does today (so walking around the ogre inside its reach can be Backhanded once a round).
- **"Everything the Action hasn't done yet waits"** includes what follows the damage inside the same Tier's line: a Reaction to the damage
  comes before the "; Prone" of that line. He ruled only on an Effect line after the Tiers; this extends his ruling by the same logic.

## 4. The Encounter Log's mistakes

Section 2.9 (the list is also in `foundry/foundry-backlog.md`, "PLAYTEST 8 PLAYED").

## 5. The report (as pasted)

# 2d12 Encounter Report — vs Goblin Sneak, Ogre Chieftain, Grave Wisp (2 rounds)
**Party Health Cost:** 45/128 HP (**35%** taken vs **39%** attempted · 5 prevented · Normal (35–45%))

## Incoming Damage & Health Pressure (% of Max HP)
| Creature | Raw | Reduced | Self/Ally | Adjust | Net ([V]/[R]) | Max HP | Heal (RP) | Current | Taken % | Attempted % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sylwen | 14 | 2 | 0 | 0 | 12 (12/0) | 29 | 0 (0) | 17 | **41%** | 48% |
| Durgan | 13 | 0 | 0 | 0 | 13 (9/4) | 35 | 0 (0) | 22 | **37%** | 37% |
| Aveline | 22 | 3 | 0 | 0 | 19 (19/0) | 35 | 0 (0) | 15 | **54%** | 63% |
| Kaela | 1 | 0 | 0 | 0 | 1 (0/1) | 29 | 0 (0) | 27 | **3%** | 3% |
| **Party Total** | **50** | **5** | **0** | **0** | **45 (40/5)** | **128** | **0 (0)** | **81** | **35%** | **39%** |
| Goblin Sneak 1 | 9 | 7 | 0 | 0 | 2 (2/0) | 2 | 0 (0) | 0 | **100%** | 450% |
| Goblin Sneak 2 | 8 | 6 | 0 | 0 | 2 (2/0) | 2 | 0 (0) | 0 | **100%** | 400% |
| Ogre Chieftain | 84 | 0 | 0 | 0 | 84 (59/25) | 72 | 0 (0) | 0 | **117%** | 117% |
| Grave Wisp | 20 | 0 | 0 | 0 | 20 (20/0) | 18 | 0 (0) | 0 | **111%** | 111% |
| Orc Warrior | 39 | 0 | 0 | 0 | 39 (31/8) | 36 | 0 (0) | 0 | **108%** | 108% |

## Offense, Mitigation & Rolls
| Creature | Dealt ([V]/[R]) | /Rd | Allies | Prevented | Heal Given | T1/T2/T3/Crit | Rx Used/Off | AP Kept | States |
|---|---:|---:|---:|---:|---:|:---:|:---:|---:|---|
| Sylwen | 28 (28/0) | 14.0 | — | — | — | 2/2/1/0 | — | 0 | — |
| Durgan | 46 (39/7) | 23.0 | — | 3 | — | 1/2/3/0 | 1/2 | 0 | — |
| Aveline | 57 (31/26) | 28.5 | — | 2 | — | 3/2/1/0 | 1/1 | 0 | — |
| Kaela | 16 (16/0) | 8.0 | — | — | — | 0/2/1/0 | — | 0 | — |
| Goblin Sneak 1 | 0 (0/0) | 0.0 | — | — | — | 2/0/0/0 | — | 0 | Down R1 |
| Goblin Sneak 2 | 4 (4/0) | 2.0 | — | — | — | 0/1/1/0 | — | 0 | Down R1 |
| Ogre Chieftain | 27 (27/0) | 13.5 | — | — | — | 0/2/1/0 | — | 0 | Bloodied R2, Down R2 |
| Grave Wisp | 5 (0/5) | 2.5 | — | — | — | 1/0/1/0 | 1/1 | 0 | Bloodied R1, Down R1 |
| Orc Warrior | 9 (9/0) | 4.5 | — | — | — | 1/1/0/0 | 1/1 | 0 | Bloodied R2, Down R2 |

## Turn-by-Turn Log

### Round 1
- Sylwen [AP 4/4]: Durgan Judge 0A vs GW; Aveline Judge 0A vs GW; Basic Attack vs OC T3 [12,7,3+2 = 23/14]; OC takes 9 Vigor; Quick Shots vs OC T1 [4,7+2 = 13/14]; OC takes 2 Vigor; Evade 2; Basic Attack vs OC T2 [11,5+2 -2 B/B = 16/14]; OC takes 6 Vigor.
- GS1 [AP 3/3]: Advance 3; Shiv vs Durgan T1 [3,5+2 = 10/14]; Shiv vs Durgan T1 [5,1+2 -1 B/B = 7/14].
- GS2 [AP 3/3]: Charge vs Durgan; Charge 5; Shiv vs Aveline T2 [2,10+2 +1 B/B = 15/14]; Aveline takes 1 Vigor; Shiv vs Aveline T3 [2,12,12+2 -1 B/B = 32/14]; Aveline takes 3 Vigor.
- Durgan [AP 4/4]: Basic Attack vs GS1 T2 [8,10+1 = 19/13]; GS1 goes Down; GS1: Dead; GS1 takes 2 Vigor (raw 9, −7); Basic Attack vs GS2 T2 [11,6+1 -1 B/B = 17/13]; GS2 goes Down; GS2: Dead; GS2 takes 2 Vigor (raw 8, −6); Charge vs GW; Charge 4; Basic Attack vs GW T3 [8,12,7+1 -1 B/B = 26/12]; GW becomes Bloodied ([V]); GW: Bloodied; GW takes 8 Vigor.
- OC [AP 4/4]: Advance 3; Crushing Grip vs Aveline T2 [4,8+2 = 14/14]; [Rx passed: Durgan Shield of Faith]; Aveline takes 1 Vigor; Great Sweep vs Aveline T3 [12,7,7+2 = 27/14]; OC: Taunted (Durgan); Durgan Rx Shield of Faith vs Aveline; Aveline takes 3 Vigor (raw 6, Shield of Faith −3).
- Aveline [AP 4/4]: Binding Light vs OC T1 [1,10+2 = 13/14]; OC takes 5 Resolve; Basic Attack vs OC T2 [5,9+1 = 15/14]; OC takes 14 Vigor; Basic Attack vs OC T1 [4,7+1 -1 B/B = 11/14]; OC takes 1 Vigor.
- GW [AP 3/3]: Slipping Touch vs Durgan T3 [4,12,6+2 = 23/13]; Durgan takes 4 Resolve; Advance 4; Pass Through vs Durgan T1 [2,7+2 = 11/13].
- Kaela [AP 4/4]: Advance 4; Strafe vs GW T3 [10,10+2 -4 B/B = 18/12]; GW takes 6 Vigor; Darting Blade vs GW T2 [11,4+2 = 17/12]; GW Rx Dying Flare vs Kaela (Instinct Save); GW goes Down; GW: Dead; GW takes 6 Vigor; Kaela takes 1 Resolve; Evade 2.
- OW [AP 4/4]: Advance 4; OW: Hindered (EoT); Aveline Rx Rebuke vs OW (Appeal Save); Advance 2; Advance 2; Hamstringing Axe vs Durgan T2 [9,7+2 = 18/14]; Durgan takes 9 Vigor.

### Round 2
- Sylwen [AP 4/4]: Advance 2; Demoralize vs OC T1 [6,4+1 = 11/12]; Quick Shots vs OC T2 [7,11+2 -1 B/B = 19/14]; OC takes 11 Vigor.
- Durgan [AP 4/4]: Feint vs OW T1 [1,7+1 = 9/10]; Smite vs OW T3 [12,10,3+2 = 26/13]; OW takes 16 Vigor, 7 Resolve; Basic Attack vs OW T3 [7,7+1 = 15/13]; OW becomes Bloodied ([V]); OW: Bloodied; OW takes 11 Vigor; OW Rx Blood for Blood vs Durgan; OW Hamstringing Axe vs Durgan T1 [4,3+2 -1 B/B = 8/14].
- OC [AP 4/4]: Aveline Pushed 1 (hits Kaela); Shove 1A vs Aveline T2 [11,1+3 -1 B/B = 14/13]; Advance 1; Crack the Ground vs Aveline, Sylwen (Instinct Save); Aveline takes 11 Vigor; Aveline: Crack the Ground; Sylwen takes 12 Vigor (raw 14, Judge (Aveline) −2); Sylwen: Crack the Ground.
- Aveline [AP 4/4]: Aveline: Feint (Ogre Chieftain) (EoT); Feint vs OC T3 [4,12,2+0 = 17/10]; Smite vs OC T2 [9,7+2 Favored = 18/14]; OC becomes Bloodied ([V]+[R]); OC goes Down; OC: Bloodied; OC: Dead; OC takes 16 Vigor, 20 Resolve; Drawing Light vs OW T1 [3,4+2 -1 B/B = 8/13]; OW takes 1 Resolve; OW becomes Bloodied · Drawing Light: You can Slide the target that distance instead of pulling it..
- Kaela: Advance 2; Basic Attack vs OW T2 [5,11+2 = 18/13]; OW goes Down; OW: Dead; OW takes 4 Vigor.

## Enemy Damage: What Reached the Party, and What Cards Took
| Enemy | Raw | Reductions took | Of it, class cards | Landed | Would reach a plain PC |
|---|---:|---:|---:|---:|---:|
| Goblin Sneak 2 | 4 | 0 | 0 | 4 | 4 |
| Ogre Chieftain | 32 | 5 | 5 | 27 | 32 |
| Grave Wisp | 5 | 0 | 0 | 5 | 5 |
| Orc Warrior | 9 | 0 | 0 | 9 | 9 |

## Core Rework Watchlist (Section R)
- **States & Lines:** R1 Goblin Sneak 1 → Down; R1 Goblin Sneak 2 → Down; R1 Grave Wisp → Bloodied ([V]); R1 Grave Wisp → Down; R2 Orc Warrior → Bloodied ([V]); R2 Ogre Chieftain → Bloodied ([V]+[R]); R2 Ogre Chieftain → Down; R2 Orc Warrior → Bloodied · Drawing Light: You can Slide the target that distance instead of pulling it.; R2 Orc Warrior → Down
