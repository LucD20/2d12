# Playtest 9 (2026-11-26): the same fight again

Lucas ran playtest 8's fight a second time, solo: the four level 1 pregens against the Ogre Chieftain, the Orc Warrior, the Grave Wisp and two Goblin Sneaks (CV 410). **On the released v0.0.519** (the Log's header still says "Easy (~25%)": v0.0.520 to v0.0.526 were not merged yet). His report is section 2, as pasted; Claude's reading is section 1. Lucas added no notes of his own this time.

## 1. Claude's reading

| | Playtest 8 | Playtest 9 | The plan |
|---|---:|---:|---|
| The fight ended | end of round 2 | round 3, the third PC's turn | decided in round 2, over in round 3 |
| PC turns / enemy turns | 8 / about 7 | 11 / 9 | |
| The party's damage a turn | 18.4 | **12.5** (138 in 11 turns) | about 17 at the table, 23 on paper |
| Damage that reached Health | 45 | 39 | |
| Raw enemy damage (a plain party's) | 50 | 50 | about 51 |
| Cost, Rally Points a PC (34 for one each) | 1.3 | **1.15** (Easy by the notes' edges) | 1½ |
| The same for a plain party (the raw) | 1.5 | **1.5** | 1½ |
| Class cards took | 5 | 11 (Judge 6, Shield of Faith 6, less the wisp's 1 by Resistance) | |
| Downs | 0 | 0 | |

- **This fight ran as designed.** Three rounds, and the raw damage is the plan's 51 almost to the point, twice in a row. What the Paladins' cards took (11 of 50, a fifth) is the whole distance between "Normal" and "Easy": the first measure of the class margin Lucas asked for.
- **The party dealt 12.5 a turn, not 18.4.** The dice were ordinary (9 Tier 1s, 18 Tier 2s, 7 Tier 3s in 34 rolls, no Critical) and the AP went elsewhere: **9 AP on Feint and Demoralize** (3 in playtest 8), 2 Smites for 27 (59 in playtest 8, one of them a Tier 1 here), 11 Basic Attacks for 49 to Health (62 before the Minions' ticks): 4.5 an AP, against 6.3.
- **The ogre never used Crack the Ground** (25 of playtest 8's 50). Its 30 raw came from Great Sweep three times and Crushing Grip; it was Immobilized in round 1 and Taunted twice. Backhand was used once. Still unseen: Hurled Goblin, the Grab's hold, Cornered, Shriek and Scatter.
- **Durgan took 30 of the 50** (86% of his Health attempted, Bloodied in round 3): flanked by the orc and both goblins in round 1.
- **Kaela dealt 15 in three rounds** (4 Tier 1s in 10 rolls); Sylwen 48, with two Snap Shots for 15.
- **The Orc Warrior spent 4 AP moving in round 1** and attacked once in two turns: 7 damage from a Standard.

### What the log shows that looks wrong (read in the log, not checked in the code)
- The Ogre Chieftain is listed "Bloodied R2, Bloodied R3".
- "OC Rx Backhand vs Durgan; OC takes 1 Vigor": the ogre took 1 damage on its own Reaction (a Collision?).
- Kaela, round 1: "OC: Vulnerable 1" is written before the Demoralize that gave it (the known order mistake).
- Durgan's round 3 turn has no "[AP 4/4]".
- "Harrying Shot: On a Tier 3, the target is Daunted of you (EoT)." is printed inside a state line (the known mistake).

## 2. The report, as pasted

**Party Health Cost:** 39/128 HP (**30%** taken vs **39%** attempted · 11 prevented · Easy (~25%))

### Incoming Damage & Health Pressure (% of Max HP)
| Creature | Raw | Reduced | Self/Ally | Adjust | Net ([V]/[R]) | Max HP | Heal (RP) | Current | Taken % | Attempted % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Kaela | 0 | 0 | 0 | 0 | 0 (0/0) | 29 | 0 (0) | 29 | **0%** | 0% |
| Sylwen | 6 | 0 | 0 | 0 | 6 (3/3) | 29 | 0 (0) | 23 | **21%** | 21% |
| Durgan | 30 | 4 | 0 | 0 | 26 (26/0) | 35 | 0 (0) | 9 | **74%** | 86% |
| Aveline | 14 | 7 | 0 | 0 | 7 (7/0) | 35 | 0 (0) | 28 | **20%** | 40% |
| **Party Total** | **50** | **11** | **0** | **0** | **39 (36/3)** | **128** | **0 (0)** | **89** | **30%** | **39%** |
| Ogre Chieftain | 77 | 0 | 0 | 0 | 77 (49/28) | 72 | 0 (0) | 0 | **107%** | 107% |
| Orc Warrior | 40 | 0 | 0 | 0 | 40 (38/2) | 36 | 0 (0) | 0 | **111%** | 111% |
| Grave Wisp | 21 | 3 | 0 | 0 | 18 (16/2) | 18 | 0 (0) | 0 | **100%** | 117% |
| Goblin Sneak 1 | 11 | 9 | 0 | 0 | 2 (2/0) | 2 | 0 (0) | 0 | **100%** | 550% |
| Goblin Sneak 2 | 7 | 5 | 0 | 0 | 2 (2/0) | 2 | 0 (0) | 0 | **100%** | 350% |

### Offense, Mitigation & Rolls
| Creature | Dealt ([V]/[R]) | /Rd | Prevented | T1/T2/T3/Crit | Rx Used/Off | States |
|---|---:|---:|---:|:---:|:---:|---|
| Kaela | 15 (11/4) | 5.0 | — | 4/5/1/0 | 2/2 | — |
| Sylwen | 48 (37/11) | 16.0 | — | 2/4/3/0 | 2/2 | — |
| Durgan | 37 (27/10) | 12.3 | 7 | 2/4/3/0 | 2/2 | Bloodied R3 |
| Aveline | 38 (31/7) | 12.7 | 4 | 1/5/0/0 | 1/1 | — |
| Ogre Chieftain | 20 (20/0) | 6.7 | — | 3/7/1/0 | 1/1 | Bloodied R2, Bloodied R3, Strained R3, Down R3 |
| Orc Warrior | 7 (7/0) | 2.3 | — | 0/2/2/0 | — | Bloodied R1, Down R2 |
| Grave Wisp | 3 (0/3) | 1.0 | — | 2/1/0/0 | 1/1 | Bloodied R2, Down R3 |
| Goblin Sneak 1 | 4 (4/0) | 1.3 | — | 1/1/0/0 | — | Bloodied R1, Down R2 |
| Goblin Sneak 2 | 5 (5/0) | 1.7 | — | 0/1/0/0 | — | Bloodied R2, Down R2 |

(AP kept: 0 for every creature. The Allies and Heal Given columns were empty.)

### Turn by turn

**Round 1**
- OC [AP 4/4]: Durgan Judge 0A vs GW; Aveline Judge 0A vs GW; Advance 3; Great Sweep vs Aveline T1, Durgan T1 [3,6+2 = 11/14]; Crushing Grip vs Aveline T2 [11,3+2 = 16/14]; Aveline takes 1 Vigor.
- Kaela [AP 4/4]: OC: Vulnerable 1; Demoralize vs OC T3 [10,9+1 = 20/12]; Basic Attack vs OC T1 [4,6+2 -1 B/B = 11/14]; OC takes 1 Vigor; Advance 2; Strafe vs OC T2 [3,11+2 = 16/14].
- OW [AP 4/4]: Advance 4; Advance 1; Advance 1; Advance 1; OW: Feint (Durgan) (EoT); Feint vs Durgan T2 [9,10-1 = 18/12]; Hamstringing Axe vs Durgan T3 (flanked) [7,7+2 +3 B/B = 19/14]; Durgan takes 4 Vigor; Durgan: Hindered (EoT).
- Sylwen [AP 4/4]: Quick Shots vs OW T1 [5,2+2 -1 B/B = 8/13]; OW takes 2 Vigor; Evade 1; Darting Blade vs OW T3 (flanked) [9,10+2 = 21/13]; OW takes 7 Vigor; OW: Staggered (EoT); Evade 2.
- GW [AP 3/3]: Advance 3; Guttering Glance vs Aveline T1 [1,2+2 -1 B/B = 4/13]; Guttering Glance vs Aveline T2 [6,9+2 -2 B/B = 15/13]; Aveline takes 0 damage (raw 1, Judge (Durgan) −2).
- Durgan [AP 4/4]: Basic Attack vs OW T2 [3,11+1 = 15/13]; OW takes 8 Vigor; Durgan: Feint (Orc Warrior) (EoT); Feint vs OW T2 [5,8+1 = 14/10]; OW: Vulnerable 1 (EoT); Demoralize vs OW T2 [8,5-1 = 12/12]; Basic Attack vs OW T1 [1,4+1 +2 B/B = 8/13]; OW becomes Bloodied ([V]); OW: Bloodied; OW takes 5 Vigor.
- GS1 [AP 3/3]: Advance 4; Shiv vs Durgan T1 (flank cancelled) [8,1+2 = 11/14]; Shiv vs Durgan T2 (flank cancelled) [12,2,5+2 -1 B/B = 19/14]; Durgan takes 4 Vigor.
- GS2 [AP 3/3]: Advance 5; Knife in the Back vs Durgan T2 (flanked) [10,1+2 +1 B/B = 14/14]; Durgan takes 5 Vigor.
- Aveline [AP 4/4]: Binding Light vs OC T2 [4,8+2 +1 B/B = 15/14]; OC takes 9 Vigor, 3 Resolve; OC: Immobilized; Aveline: Feint (Goblin Sneak) (EoT); Feint vs GS1 T2 [3,9+0 = 12/11]; Basic Attack vs GS1 T1 [1,7+1 +2 B/B = 11/13]; GS1 becomes Bloodied ([V]); GS1: Bloodied; GS1 takes 1 Vigor (raw 3, −2).

**Round 2**
- OC [AP 4/4]: Break Free vs Aveline T3 [8,9+3 = 20/13]; Shove 1A vs Aveline T1 [7,2+3 = 12/13]; Great Sweep vs Aveline T2, Durgan T2 (flank cancelled) [7,10+2 = 19/14]; OC: Taunted (Durgan); Durgan Rx Shield of Faith vs Aveline; Aveline takes 4 Vigor (raw 7, Shield of Faith −3); Durgan takes 5 Vigor (raw 7, Judge (Aveline) −2).
- Kaela [AP 4/4]: Basic Attack vs GS1 T2 [2,2+2 -1 B/B = 5/13]; GS1 goes Down; GS1 takes 1 Vigor (raw 8, −7); GS1: Dead; Harrying Shot vs OW T1 [2,5+1 -1 B/B = 7/13]; OW takes 2 Resolve; Strafe vs OW T1 [5,3+2 = 10/13]; OW takes 2 Vigor.
- OW [AP 4/4]: Advance 2; Sylwen Rx Snap Shot vs OW T3 [9,12,5+2 +1 B/B = 28/13]; OW takes 6 Vigor; OW: Immobilized (EoT); OW: Hindered (EoT); Aveline Rx Rebuke vs OW (Appeal Save); Barbed Javelin vs Sylwen T2 [9,5+2 = 16/12]; Sylwen takes 3 Vigor; Break Free vs Sylwen T3 [11,8+2 = 21/13]; Advance 1.
- Sylwen [AP 4/4]: Darting Blade vs OW T2 [6,7+2 = 15/13]; OW goes Down; OW: Dead; OW takes 8 Vigor; Quick Shots vs GS2 T1 [9,1+2 -2 B/B = 10/13]; GS2 becomes Bloodied ([V]); GS2: Bloodied; GS2 takes 1 Vigor (raw 2, −1).
- GW [AP 3/3]: Advance 6; Sylwen Rx Snap Shot vs GW T2 [9,1+2 = 12/12]; GW becomes Bloodied ([V]); GW: Bloodied; GW takes 9 Vigor; GW: Hindered (EoT); Pass Through vs Durgan T1 [1,6+2 = 9/14]; Advance 2; Kaela Rx Slip Away vs GW; Kaela Evade 1; Kaela Advance 2.
- Durgan [AP 4/4]: Basic Attack vs GS2 T2 [8,7+1 = 16/13]; GS2 goes Down; GS2 takes 1 Vigor (raw 5, −4); GS2: Dead; Advance 2; OC Rx Backhand vs Durgan; OC takes 1 Vigor; Durgan Pushed 1; Advance 1; Durgan: Feint (Ogre Chieftain) (EoT); Feint vs OC T3 [12,4,8+1 = 24/10]; Basic Attack vs OC T3 [9,11+1 +4 B/B = 25/14]; OC takes 13 Vigor.
- Aveline [AP 4/4]: Aveline: Feint (Ogre Chieftain) (EoT); Feint vs OC T2 [2,11+0 = 13/10]; Smite vs OC T2 [4,8+2 +2 B/B = 16/14]; OC takes 13 Vigor, 4 Resolve; Basic Attack vs OC T2 [4,4+1 = 9/14]; OC becomes Bloodied ([V]); OC: Bloodied; OC takes 8 Vigor.

**Round 3**
- OC [AP 4/4]: Great Sweep vs Aveline T2, Durgan T2 [8,7+2 = 17/14]; OC: Taunted (Durgan); Durgan Rx Shield of Faith vs Aveline; Aveline takes 2 Vigor (raw 5, Shield of Faith −3); Durgan takes 3 Vigor (raw 5, Judge (Aveline) −2); Crushing Grip vs Durgan T2 [3,11+2 = 16/14]; Durgan becomes Bloodied ([V]); Durgan: Bloodied; Durgan takes 3 Vigor; Crushing Grip vs Durgan T2 [3,10+2 -1 B/B = 14/14]; Durgan takes 2 Vigor.
- Kaela [AP 4/4]: Harrying Shot vs GW T2 [11,4+1 -1 B/B = 15/14]; GW takes 2 Resolve (raw 5, Resistance −3); Basic Attack vs GW T1 [5,2+2 -2 B/B = 7/12]; GW takes 2 Vigor; GW: Vulnerable 1 (EoT); Demoralize vs GW T2 [5,6+1 = 12/11]; Basic Attack vs GW T2 [11,6+2 -2 B/B = 17/12]; GW Rx Dying Flare vs Sylwen (Instinct Save); GW goes Down; GW: Dead; GW takes 5 Vigor; Sylwen takes 3 Resolve.
- Sylwen [AP 4/4]: OC: Vulnerable 1 (EoT); Demoralize vs OC T2 [11,6+1 = 18/12]; Basic Attack vs OC T2 [9,6+2 = 17/14]; OC takes 4 Vigor; Harrying Shot vs OC T3 [12,11,2+1 -1 B/B = 24/12]; OC takes 11 Resolve; OC becomes Bloodied · Harrying Shot: On a Tier 3, the target is Daunted of you (EoT).; OC: Daunted (Sylwen) (EoT); Advance 7.
- Durgan: Durgan: Feint (Ogre Chieftain) (EoT); Feint vs OC T3 [10,5+1 +1 B/B = 17/10]; Smite vs OC T1 [4,6+2 Favored = 12/14]; OC becomes Strained ([R]); OC goes Down; OC: Strained; OC: Dead; OC takes 10 Resolve.

### Enemy damage: what reached the party, and what cards took
| Enemy | Raw | Reductions took | Of it, class cards | Landed | Would reach a plain PC |
|---|---:|---:|---:|---:|---:|
| Ogre Chieftain | 30 | 10 | 10 | 20 | 30 |
| Orc Warrior | 7 | 0 | 0 | 7 | 7 |
| Grave Wisp | 4 | 1 | 2 | 3 | 5 |
| Goblin Sneak 1 | 4 | 0 | 0 | 4 | 4 |
| Goblin Sneak 2 | 5 | 0 | 0 | 5 | 5 |

### The watchlist
- **Flanking Boons:** PCs 1, enemies 2, cancelled 3.
- **States:** R1 Orc Warrior Bloodied, Goblin Sneak 1 Bloodied; R2 Goblin Sneak 1 Down, Orc Warrior Down, Goblin Sneak 2 Bloodied then Down, Grave Wisp Bloodied, Ogre Chieftain Bloodied; R3 Durgan Bloodied, Grave Wisp Down, Ogre Chieftain Strained and Down.
