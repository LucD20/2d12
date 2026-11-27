# Playtest 11 (2026-11-27): the same fight on the new numbers

Lucas ran the fight of playtests 8 to 10 again, solo, on v0.0.530 or v0.0.531: the four level 1 pregens against the Ogre Chieftain, the Orc Warrior, the Grave Wisp and two Goblin Sneaks (CV 410). **The first fight on v0.0.527's numbers** (PC Health up by half, enemy damage about 2.36 times, enemy Health a quarter more, Judge without its reduction, Feint's 1 and 2 Boons). The old economy and the old Reactions are still in. He added no notes. Section 1 is Claude's reading, section 2 the numbers, section 3 the log as pasted.

## 1. Claude's reading

| | Playtests 8 to 10 (average) | Playtest 11 | The aim |
|---|---:|---:|---|
| The last enemy fell | about 2.3 rounds | round 3, the second PC (2.5) | 3 to 4 rounds (3.5) |
| PC turns / enemy turns | 9.3 / 7.3 | 10 / **5** | |
| The party's damage a turn | 16.1 | **16.3** (163 in 10 turns) | |
| Raw enemy damage | 42 | 92 | |
| Its share of the party's Health | 33% | **51%** | |
| Cost, Rally Points a PC | 1.0 | **1.8** (Normal, near Hard at 2) | 1½ |
| The same for a plain party | 1.3 | 1.9 | |
| Class cards took | a fifth | **8 of 92** (Shield of Faith's 3, three times) | |
| The worst-hit PC | 31% to 74% taken | **Aveline: 61 raw against 50 Health** (122%) | |
| Downs | 0 | 0 (Tend's 26 in round 1 kept Aveline up) | |
| Rally Points spent in the fight | 0 | **2** (Tend on Aveline) | |
| AP kept | 0 | **1** (Durgan, round 1) | |

1. **The cost is where it was meant to be.** 1.8 Rally Points a PC, Normal, against a plan of 1½. Claude's estimate of 2.3 to 2.6 was too high: it assumed the enemies would get more turns, and they got fewer (5, against 7.3).
2. **The fight is still short: 2.5 rounds.** A quarter more enemy Health moved it from about 2.3 to 2.5. The party's damage is the same 16 a turn for the fourth time. The aim of 3.5 is a round away.
3. **An enemy's turn is now worth what the rank says** (92 raw in 5 turns: 18 a turn, the Standard's "about 19"). All the cost came from those five turns, and four of them were in round 1.
4. **It is swingy, and one PC carries it.** Aveline took 40 of her 50 Health in round 1 before the ogre acted (the orc's Tier 3 for 19, the goblin's Critical for 16 and its second Shiv for 8), and 61 in the fight. Without Kaela's Tend she is Down in round 2. The other three took 31 between them.
5. **A Minion hit like a Standard.** Goblin Sneak 1 dealt 24 in one turn: half a Paladin's Health from CV 30. Its Tier 3 is 2 + 1d12 and its Critical adds 1d10!. The rank's line says "about 8 a turn".
6. **For the first time the party spent to stay up:** 2 Rally Points in the fight, and an AP kept. The fight asked for a defensive choice, which three easy fights never did.
7. **Shield of Faith's 3 is now a rounding error** (it took 3 from hits of 14 to 19; the fifth that class cards took is under a tenth). As expected once the dice grew and Judge's reduction went.
8. **Crack the Ground and Dying Flare show no result in the log** (both targets of Crack the Ground and the Flare's targets have no damage line: they saved, or the Log drops a Save's Tier 3). War Howl dealt 15 to two PCs.
9. **Feint was used twice** (5 and 6 times in the two fights before): with 1 and 2 Boons it is no longer the ritual before a Smite. One Smite was used (29 damage), by Durgan; Aveline never used hers.

### What the log shows that looks wrong (read in the log, not checked in the code)
- "Kaela Pushed 0 (hits Orc Warrior)": the Orc Warrior was dead. A dead creature stopped a Push (Collision was left as it was when a dead creature stopped affecting movement).
- Backhand's 2 damage is in the Adjust column, not in Raw (twice), as in playtest 10.
- The Grave Wisp's row: Raw 15, Net 21.
- Crack the Ground and Dying Flare post no result line when nobody is hurt.
- "Aveline heals 26 (2 RP)" is in the Heal column of the one healed; the Rally Points are hers.
- The report's title leaves out the Ogre Chieftain; Sylwen's last turn has no "[AP 4/4]".

## 2. The numbers

**Party Health Cost:** 88/182 (48% taken, 51% attempted, 8 prevented, 1.8 RP a PC, Normal).

| Creature | Raw | Reduced | Net | Max | Healed | Dealt | T1/T2/T3/Crit | Rx | AP kept |
|---|---:|---:|---:|---:|---:|---:|:---:|:---:|---:|
| Durgan | 19 | 0 | 21 | 50 | 0 | 61 | 1/6/2/0 | 3/3 | 1 |
| Sylwen | 2 | 2 | 0 | 41 | 0 | 41 | 3/3/2/0 | 1/1 | 0 |
| Aveline | 61 | 6 | 55 | 50 | 26 (2 RP) | 35 | 3/1/2/1 | 0 | 0 |
| Kaela | 10 | 0 | 12 | 41 | 0 | 26 | 1/1/2/0 | 0 | 0 |
| Orc Warrior | 47 | 0 | 47 | 45 | | 31 | 1/0/1/0 | 1/1 | |
| Grave Wisp | 15 | 0 | 21 | 22 | | 0 | 0/2/0/0 | 1/1 | |
| Goblin Sneak 1 | 10 | 8 | 2 | 2 ticks | | 24 | 0/1/1/1 | | |
| Goblin Sneak 2 | 2 | 0 | 2 | 2 ticks | | 0 | | | |
| Ogre Chieftain | 91 | 0 | 91 | 90 | | 29 | 2/1/2/0 | 2/2 | |

What reached the party: Orc Warrior 34 raw (31 landed), Grave Wisp 2 (0), Goblin Sneak 1 24 (24), Ogre Chieftain 32 (29).

## 3. The log, as pasted

**Round 1**
- Durgan [AP 3/4, kept 1]: Judge 0A vs GW; Aveline Judge 0A vs GW; Drawing Light vs GW T3 [9,10+2 = 21/14]; GW takes 9 Resolve; GW Pulled 1 (hits a wall); Drawing Light vs GW T2 [10,6+2 -1 B/B = 17/14]; GW takes 4 Resolve; GW Pulled 1; Drawing Light vs GS2 T2 [11,1+2 -2 B/B = 12/12]; GS2 goes Down; GS2: Dead; GS2 takes 2 Resolve; GS2 Pulled 1.
- OW [AP 4/4]: OW's Advance is blocked by Aveline; Advance 4; Advance 1; War Howl vs Aveline, Kaela, Durgan, Sylwen (Mind Save); Kaela takes 10 Resolve; Kaela: Vulnerable 1 (EoT); Durgan takes 5 Resolve; Hamstringing Axe vs Aveline T3 [12,9,7+2 = 29/14]; OW: Taunted (Durgan); Durgan Rx Shield of Faith vs Aveline; Aveline takes 16 Vigor (raw 19, Shield of Faith −3); Aveline: Hindered (EoT).
- Sylwen [AP 4/4]: Basic Attack vs OW T2 [9,6+2 -1 B/B = 16/13]; OW takes 4 Vigor; Advance 1; Darting Blade vs OW T2 (flanked) [6,7+2 = 15/13]; OW takes 6 Vigor; Evade 2.
- GW [AP 3/3]: Advance 6; Sylwen Rx Snap Shot vs GW T3 [9,10+2 = 21/12]; GW becomes Bloodied ([V]); GW: Bloodied; GW takes 6 Vigor; GW: Immobilized (EoT); Break Free vs GW T2 [7,8+1 = 16/13]; Guttering Glance vs Sylwen T2 [8,5+2 = 15/12]; GW: Taunted (Durgan); Durgan Rx Shield of Faith vs Sylwen; Sylwen takes 0 damage (raw 2, Shield of Faith −3).
- Aveline [AP 4/4]: Binding Light vs OW T1 [2,7+2 = 11/13]; OW takes 3 Resolve; Basic Attack vs OW T1 [6,5+1 = 12/13]; OW takes 8 Vigor; OW: Vulnerable 1; Demoralize vs OW T3 [10,8+1 = 19/12].
- GS1 [AP 3/3]: Charge vs Aveline; Charge 5; Shiv vs Aveline T3! [9,9+2 +1 B/B = 21/14]; Aveline takes 16 Vigor; Shiv vs Aveline T2 [7,11+2 -1 B/B = 19/14]; Aveline becomes Bloodied ([V]); Aveline: Bloodied; Aveline takes 8 Vigor.
- Kaela [AP 4/4]: Basic Attack vs OW T3 [12,2,5+2 = 20/13]; OW takes 9 Vigor; Advance 2; Tend vs Aveline T2 [5,10+1 = 16/13]; Aveline heals 26 (2 RP).
- OC [AP 4/4]: Advance 3; Crack the Ground vs Aveline, Kaela (Instinct Save); Crushing Grip vs Aveline T2 (flanked) [10,4+2 +1 B/B = 17/14]; Aveline takes 4 Vigor.

**Round 2**
- Durgan [AP 4/4]: Basic Attack vs OW T2 [8,3+1 +1 B/B = 13/13]; OW becomes Bloodied ([V]); OW: Bloodied; OW takes 8 Vigor; OW Rx Blood for Blood vs Durgan; OW Hamstringing Axe vs Durgan T1 [2,4+2 -1 B/B = 7/14]; Durgan: Feint (Orc Warrior) (EoT); Feint vs OW T3 [4,12,2+1 +1 B/B = 19/10]; Basic Attack vs OW T1 [2,6+1 +2 B/B = 11/13]; OW takes 4 Vigor; Basic Attack vs OW T2 [8,11+1 -1 B/B = 19/13]; OW goes Down; OW: Dead; OW takes 5 Vigor.
- Sylwen [AP 4/4]: Basic Attack vs GW T1 [6,1+2 = 9/12]; GW Rx Dying Flare; GW goes Down; GW: Dead; GW takes 2 Vigor; Quick Shots vs OC T2 [5,9+2 -1 B/B = 15/14]; OC takes 8 Vigor; Basic Attack vs OC T3 [9,9+2 -2 B/B = 18/14]; OC takes 10 Vigor.
- Aveline [AP 4/4]: Basic Attack vs OC T1 [3,4+1 = 8/14]; OC takes 1 Vigor; Binding Light vs OC T3! [11,11+2 = 24/14]; OC takes 19 Vigor, 2 Resolve; OC: Immobilized; Basic Attack vs GS1 T2 [12,4,3+1 -1 B/B = 18/13]; GS1 goes Down; GS1: Dead; GS1 takes 2 Vigor (raw 10, −8).
- Kaela [AP 4/4]: Advance 1; OC Rx Backhand vs Kaela; Kaela takes 2 Vigor; Kaela Pushed 0 (hits Orc Warrior); Darting Blade vs OC T3 [8,8+2 = 18/14]; OC takes 15 Vigor; OC: Staggered (EoT); Evade 2; Basic Attack vs OC T1 [2,8+2 -1 B/B = 11/14]; OC becomes Bloodied ([V]); OC: Bloodied; OC takes 2 Vigor.
- OC [AP 4/4]: Great Sweep vs Durgan T3, Aveline T3 [9,10+2 = 21/14]; Durgan takes 14 Vigor; OC: Taunted (Durgan); Durgan Rx Shield of Faith vs Aveline; Aveline takes 11 Vigor (raw 14, Shield of Faith −3); Crushing Grip vs Durgan T1 [4,7+2 = 13/14]; Crushing Grip vs Durgan T1 [2,9+2 -1 B/B = 12/14].

**Round 3**
- Durgan [AP 4/4]: Advance 2; OC Rx Backhand vs Durgan; Durgan Pushed 1; Advance 1; Durgan takes 2 Vigor; Durgan: Feint (Ogre Chieftain) (EoT); Feint vs OC T2 [9,4+1 = 14/10]; Smite vs OC T2 [1,11+2 +1 B/B = 15/14]; OC takes 13 Vigor, 16 Resolve.
- Sylwen: Quick Shots vs OC T1 [11,2+2 -2 B/B = 13/14]; OC takes 2 Vigor; Basic Attack vs OC T1 [5,3+2 -2 B/B = 8/14]; OC goes Down; OC: Dead; OC takes 3 Vigor.

**The watchlist:** Flanking Boons: PCs 1, enemies 1, cancelled 0. Moves refused by blocking: R1 Orc Warrior (Advance) by Aveline. Crits: R1 Goblin Sneak 1 Shiv vs Aveline; R2 Aveline Binding Light vs Ogre Chieftain. Pushed 0: R2 Ogre Chieftain, Kaela Pushed 0 (hits Orc Warrior).
