# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/rework/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

**The rules: the book today for the classes as their cards are written (pack R, and since Stage 0 went into the book on 2026-11-12: the flat-plus-one-die weapon table, no basic Opportunity Attack, a [Ranged] Action while Engaged is Doomed). The class cards still sit on the 1-to-3 Escalation ladder, so these builds do too; Stage 0's levels 1 to 3 on the 1-to-6 ladder with Momentum 0 to 4 and the Bestiary's Stage 0 table are in stage0.md.** 4 AP + 1 Reaction AP (NPCs 4 + 1, Minions 3); Escalation is a level from 1 (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard 2 / 3 / 4 (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); no creature has an Opportunity Attack; NPCs use their Specials (Round: 1 AP × 1.4, 2 AP × 2.2, 3 AP × 3.5 for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs); an enemy at 0 Health is out at once (the rest of that turn goes to another enemy: since 2026-11-12).

## Archer (Double Shot) (ranged damage), `rework/archer-double-r1.txt`

Health 29 (Body 19 + Mind 10) · AD 13 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 6 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 1 | 30.2 | 28.9 | 27.5 | 31.4 | 4 | 3 | Double Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 30.2 | 28.9 | 27.5 | 31.4 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the step | 1 | 23.7 | 22.8 | 21.8 | 25.3 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 30.6 | 29.3 | 28.0 | 31.8 | 4 | 3 | Double Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex (**best**) | 3 | 36.6 | 34.9 | 33.3 | 34.9 | 4 | 2 | Deathmark, Double Shot 2 |  |
| Kite | 1 | 23.7 | 22.8 | 21.8 | 25.3 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Steel | 1 | 17.2 | 16.4 | 15.5 | 18.7 | 4 | 1 | Steel Yourself 2, Double Shot 2 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 6.5 | 1 / 1.0 | 5 / 5.1 |
| Grunt | 28 | 13 | 2 | 8.0 | 1 / 1.4 | 4 / 4.2 |
| Standard | 63 | 13 | 2 | 15.7 | 3 / 2.8 | 2 / 2.5 |
| Elite | 132 | 14 | 3 | 19.3 | 5 / 5.4 | 2 / 2.0 |

## Archer (Rolling Shot) (ranged damage), `rework/archer-rolling-r1.txt`

Health 29 (Body 19 + Mind 10) · AD 13 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 6 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (**best**) | 1 | 26.6 | 25.5 | 24.4 | 27.9 | 4 | 3 | Rolling Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 29.4 | 28.1 | 26.8 | 30.6 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the long roll | 1 | 22.6 | 21.6 | 20.7 | 24.2 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 26.6 | 25.5 | 24.4 | 27.9 | 4 | 3 | Rolling Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex | 3 | 23.5 | 22.6 | 21.6 | 22.6 | 4 | 2 | Open Season, Rolling Shot 2 |  |
| Kite | 1 | 22.6 | 21.6 | 20.7 | 24.2 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Steel | 1 | 12.7 | 11.9 | 11.2 | 13.9 | 4 | 1 | Steel Yourself 2, Rolling Shot 2 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 6.5 | 1 / 1.0 | 5 / 5.0 |
| Grunt | 28 | 13 | 2 | 8.0 | 2 / 1.6 | 4 / 4.2 |
| Standard | 63 | 13 | 2 | 15.7 | 3 / 3.2 | 2 / 2.5 |
| Elite | 132 | 14 | 3 | 19.3 | 7 / 6.6 | 2 / 2.1 |

## Paladin (Lay On Hands) (tank / support), `rework/paladin-hands-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 13 · Weapon Modifier +1 · Power Modifier +2 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 15.6 | 14.0 | 12.3 | 14.0 | 4 | 2 | Lay On Hands 2, Weapon Attack, Weapon Attack |  |
| Heal 1 and three attacks (**best**) | 1 | 22.2 | 19.9 | 17.5 | 19.9 | 4 | 3 | Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Nova (plan) | 1 | 17.2 | 15.9 | 14.6 | 15.9 | 4 | 1 | Lay On Hands 2, Holy Wrath 2 |  |
| Apex | 3 | 8.2 | 7.4 | 6.5 | 7.4 | 4 | 1 | Hallowed Dawn, Weapon Attack |  |
| Two attacks | 1 | 15.6 | 14.0 | 12.3 | 14.0 | 2 | 2 | Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.2 | 60+ / - |
| Grunt | 28 | 13 | 2 | 7.2 | 2 / 2.7 | 48 / 47.0 |
| Standard | 63 | 13 | 2 | 14.0 | 5 / 5.5 | 4 / 4.1 |
| Elite | 132 | 14 | 3 | 17.6 | 11 / 11.6 | 2 / 2.7 |

## Paladin (Smite) (tank / support), `rework/paladin-smite-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 39.5 | 36.5 | 33.4 | 41.3 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and one attack | 1 | 32.5 | 30.3 | 28.2 | 33.7 | 4 | 2 | Smite 3, Weapon Attack |  |
| Nova (plan) | 1 | 37.0 | 34.7 | 32.5 | 38.1 | 4 | 2 | Holy Wrath 3, Weapon Attack |  |
| Nova with Smite | 1 | 40.0 | 37.4 | 34.9 | 41.4 | 4 | 2 | Holy Wrath 2, Smite 2 |  |
| Apex (**best**) | 3 | 44.0 | 41.4 | 38.9 | 41.4 | 4 | 2 | Final Verdict, Smite 2 |  |
| Two attacks | 1 | 22.1 | 20.3 | 18.3 | 23.0 | 2 | 2 | Weapon Attack, Weapon Attack |  |
| Steel | 1 | 20.8 | 19.5 | 18.2 | 21.5 | 4 | 1 | Steel Yourself 2, Smite 2 |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.0 | 7 / 6.7 |
| Grunt | 28 | 13 | 2 | 7.2 | 1 / 1.3 | 5 / 5.4 |
| Standard | 63 | 13 | 2 | 14.0 | 2 / 2.2 | 3 / 3.2 |
| Elite | 132 | 14 | 3 | 17.6 | 4 / 4.1 | 2 / 2.5 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer (Double Shot), Archer (Rolling Shot); 2000 runs each)

The Bestiary's target for a normal fight (CV 100 a PC: 4 Standards against 4 PCs): about **3.5 rounds**, about **a fifth of the party's Health** with the Rally Points it spends, a PC Down in about **1 fight of 5** (pack R-bestiary: rbestiary.md).

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer (Double Shot) Down | Archer (Rolling Shot) Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards (normal) | 4 | 3 / 3.3 / 4 | 100% | 12% | 20% | 2 | 10% | 7% | 3% | 5% | 3.2 / 17% |
| 2 Elites | 4 | 3 / 3.5 / 4 | 100% | 13% | 22% | 2 | 13% | 6% | 2% | 4% | 3.3 / 18% |
| Elite + 2 Standards | 4 | 3 / 3.4 / 4 | 100% | 13% | 21% | 2 | 10% | 8% | 5% | 4% | 3.2 / 17% |
| 8 Grunts | 4 | 3 / 3.3 / 4 | 100% | 10% | 7% | 2 | 3% | 4% | 1% | 2% | 3.2 / 11% |
| 2 Standards + 8 Minions | 4 | 3 / 3.1 / 4 | 100% | 10% | 12% | 2 | 4% | 3% | 4% | 2% | 3.3 / 23% |
| 3 Standards + 1 Ward attacker | 4 | 3 / 3.4 / 4 | 99% | 14% | 22% | 2 | 11% | 6% | 4% | 6% | 3.2 / 22% |
| 5 Standards (CV 5, hard) | 5 | 4 / 4.3 / 5 | 93% | 25% | 43% | 2 | 24% | 15% | 17% | 19% | 4.0 / 30% |
| 6 Standards (CV 6, deadly) | 6 | 5 / 5.1 / 7 | 78% | 41% | 62% | 2 | 41% | 26% | 37% | 37% | 4.4 / 51% |
| 2 Elites + 2 Standards (CV 6, deadly) | 6 | 5 / 5.3 / 7 | 85% | 36% | 58% | 2 | 38% | 25% | 33% | 25% | 4.8 / 44% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane, choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (each Advance is an AP its attacks don't get), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover 5% Medium, 15% Low); Flanking for both sides (Field Boons: the cancels, then 2 at most); Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 1 in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 3 standard (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 5 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 94% · a PC Down during the day 66% · Downs a day 1.26 · Rally Points left at the end 58% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.6 | 8% | 8% |
| 2: 4 standard | 100% | 3.4 | 14% | 24% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 11% | 21% |
| 4: 5 standard | 95% | 4.2 | 21% | 37% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 367.5 | 92.7 | 358.5 | 317.7 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 324.5 | 85.8 | 316.8 | 277.7 |
| ... a turn (its own turns) | 30.1 | 7.7 | 27.3 | 24.2 |
| Damage a turn (its own turns) | 34.1 | 8.4 | 30.8 | 27.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 35.7 | 8.7 | 34.0 | 36.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.1 | - | 29.4 | 23.2 |
| Share of the party's damage (%) | 32 | 8 | 32 | 28 |
| Turns taken | 10.8 | 11.1 | 11.7 | 11.5 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 78.4 | 77.4 | 39.8 | 44.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 3.2 | 18.2 | 0.0 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 3.5 | 0.0 | 0.0 |
| Damage taken | 75.2 | 59.2 | 39.8 | 44.4 |
| Damage taken a round of combat | 5.5 | 4.4 | 2.9 | 3.2 |
| Times Down | 0.49 | 0.26 | 0.25 | 0.27 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.24 | 1.45 | 0.02 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 1.38 | 0.00 | 0.80 | 0.92 |
| Rally Points used between fights | 2.19 | 1.29 | 1.23 | 1.28 |
| Rally Points left | 3.19 | 4.26 | 3.95 | 3.79 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 25.6 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 13.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 97.3 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 12.1 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.9 | 6.6 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 6.7 | 0.0 | 0.0 |
| Turns that start Engaged | 5.7 | 6.1 | 3.1 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 44.0 | 33.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 20.1 | 16.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.0 | 3.2 |
| Flanking Boons on its melee Actions | 6.8 | 3.4 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 6.5 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.3 / 14.7 | 7.5 / 0.0 | 6.5 / 40.7 | 8.0 / 55.9 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.2 / 0.1 / 0.0 | 2.3 / 1.0 / 0.1 | 2.0 / 0.7 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.42 | 0.00 | 7.66 | 7.63 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.23 | 3.25 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.96 | 1.96 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.47 | 2.42 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.70 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 72% · a PC Down during the day 95% · Downs a day 3.48 · Rally Points left at the end 31% · Health at the end 55%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.2 | 25% | 21% |
| 2: 4 standard | 97% | 3.0 | 41% | 46% |
| 3: 1 elite, 2 standard | 99% | 2.9 | 37% | 55% |
| 4: 5 standard | 74% | 3.7 | 59% | 79% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 266.2 | 287.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 232.3 | 253.6 |
| ... a turn (its own turns) | 28.1 | 26.9 |
| Damage a turn (its own turns) | 32.1 | 30.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.7 | 35.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 32.0 | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 8.3 | 9.5 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 78.2 | 40.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.2 | 40.7 |
| Damage taken a round of combat | 6.7 | 3.5 |
| Times Down | 1.08 | 0.65 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.65 | 0.11 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.09 | 3.06 |
| Rally Points left | 1.25 | 2.84 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.6 | 0.0 |
| Turns that start Engaged | 4.1 | 2.6 |
| Shots ([Ranged] Actions) | 0.0 | 35.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 15.8 |
| ... while Engaged (2 Banes) | 0.0 | 3.7 |
| Flanking Boons on its melee Actions | 3.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.3 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 3.9 / 10.9 | 5.3 / 33.0 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.2 / 0.4 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.02 | 6.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.49 |
| **Debuff:** Immobilized (times) | 0.00 | 1.49 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.20 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 99% · a PC Down during the day 40% · Downs a day 0.54 · Rally Points left at the end 69% · Health at the end 98%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 3.3 | 3% | 6% |
| 2: 4 standard | 100% | 4.4 | 4% | 12% |
| 3: 1 elite, 2 standard | 100% | 4.4 | 4% | 9% |
| 4: 5 standard | 99% | 5.2 | 7% | 19% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 130.5 | 435.9 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 121.8 | 383.9 |
| ... a turn (its own turns) | 8.2 | 25.1 |
| Damage a turn (its own turns) | 8.8 | 28.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 9.6 | 33.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 23.7 |
| Share of the party's damage (%) | 12 | 38 |
| Turns taken | 14.9 | 15.3 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 82.4 | 47.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 22.6 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.4 | 0.0 |
| Damage taken | 59.8 | 47.3 |
| Damage taken a round of combat | 3.5 | 2.7 |
| Times Down | 0.14 | 0.13 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.76 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.81 | 1.27 |
| Rally Points used between fights | 0.66 | 0.57 |
| Rally Points left | 4.77 | 4.16 |
| **Buffs:** healed allies (Lay On Hands) | 16.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 13.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 65.6 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.0 | 0.0 |
| **Map:** AP spent moving | 8.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.3 | 0.0 |
| Turns that start Engaged | 9.0 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 44.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.7 |
| ... while Engaged (2 Banes) | 0.0 | 3.4 |
| Flanking Boons on its melee Actions | 6.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 9.5 / 0.0 | 11.0 / 83.4 |
| AP left unspent / Guard they gave / Guard used | 0.2 / 0.1 / 0.0 | 4.3 / 2.8 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.37 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.71 |
| **Debuff:** Immobilized (times) | 0.00 | 2.94 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.94 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 5 standard (CV 5) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 3 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 94% · a PC Down during the day 67% · Downs a day 1.27 · Rally Points left at the end 57% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.3 | 11% | 8% |
| 2: 5 standard | 96% | 4.1 | 18% | 33% |
| 3: 2 elite | 100% | 3.4 | 10% | 19% |
| 4: 1 elite, 3 standard | 98% | 4.3 | 16% | 33% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 413.0 | 100.3 | 387.4 | 355.0 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 353.8 | 92.7 | 338.6 | 305.9 |
| ... a turn (its own turns) | 29.5 | 7.4 | 26.5 | 24.0 |
| Damage a turn (its own turns) | 34.5 | 8.0 | 30.3 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 36.4 | 8.7 | 32.3 | 34.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.5 | - | 29.0 | 23.1 |
| Share of the party's damage (%) | 33 | 8 | 31 | 28 |
| Turns taken | 12.0 | 12.6 | 12.8 | 12.7 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 93.4 | 91.1 | 50.4 | 54.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.4 | 24.0 | 0.1 | 0.5 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 6.0 | 0.0 | 0.0 |
| Damage taken | 88.0 | 67.1 | 50.3 | 54.2 |
| Damage taken a round of combat | 6.0 | 4.6 | 3.4 | 3.7 |
| Times Down | 0.49 | 0.21 | 0.29 | 0.28 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.21 | 1.60 | 0.02 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.44 | 0.00 | 1.02 | 1.11 |
| Rally Points used between fights | 2.20 | 1.10 | 1.29 | 1.28 |
| Rally Points left | 3.15 | 4.30 | 3.67 | 3.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 29.1 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 14.3 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 133.2 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 14.0 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.8 | 6.7 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 6.8 | 0.0 | 0.0 |
| Turns that start Engaged | 6.9 | 7.3 | 4.0 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 48.5 | 37.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 22.7 | 19.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 5.7 | 3.7 |
| Flanking Boons on its melee Actions | 7.3 | 3.7 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.5 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 6.4 / 17.9 | 8.9 / 0.0 | 7.5 / 45.5 | 9.4 / 65.8 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.1 / 0.0 | 2.9 / 1.3 / 0.1 | 2.5 / 1.1 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.78 | 0.00 | 8.00 | 8.12 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.59 | 3.65 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.10 | 2.23 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.31 | 2.23 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.83 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 59% · a PC Down during the day 99% · Downs a day 4.33 · Rally Points left at the end 28% · Health at the end 37%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.0 | 46% | 30% |
| 2: 5 standard | 82% | 3.6 | 58% | 72% |
| 3: 2 elite | 99% | 3.1 | 40% | 64% |
| 4: 1 elite, 3 standard | 73% | 3.9 | 56% | 84% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 271.9 | 292.6 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 232.4 | 253.2 |
| ... a turn (its own turns) | 27.6 | 26.0 |
| Damage a turn (its own turns) | 32.5 | 30.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.5 | 33.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 32.5 | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 8.4 | 9.7 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 85.5 | 51.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.5 | 51.5 |
| Damage taken a round of combat | 7.2 | 4.4 |
| Times Down | 1.29 | 0.87 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.71 | 0.16 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.92 | 3.51 |
| Rally Points left | 1.36 | 2.32 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 4.5 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 37.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.8 |
| ... while Engaged (2 Banes) | 0.0 | 5.2 |
| Flanking Boons on its melee Actions | 3.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 6.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.4 / 12.6 | 6.0 / 36.2 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.4 / 0.4 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.26 | 5.72 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.48 |
| **Debuff:** Immobilized (times) | 0.00 | 1.43 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.82 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 98% · a PC Down during the day 39% · Downs a day 0.57 · Rally Points left at the end 65% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 2% | 3% |
| 2: 5 standard | 99% | 5.2 | 7% | 20% |
| 3: 2 elite | 100% | 4.4 | 3% | 7% |
| 4: 1 elite, 3 standard | 99% | 5.4 | 6% | 16% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 152.3 | 483.6 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 141.1 | 417.5 |
| ... a turn (its own turns) | 8.4 | 24.6 |
| Damage a turn (its own turns) | 9.1 | 28.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 9.9 | 32.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 23.6 |
| Share of the party's damage (%) | 12 | 38 |
| Turns taken | 16.9 | 17.0 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 104.4 | 62.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 33.9 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.6 | 0.0 |
| Damage taken | 70.4 | 61.6 |
| Damage taken a round of combat | 3.7 | 3.2 |
| Times Down | 0.12 | 0.16 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.87 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.90 | 1.64 |
| Rally Points used between fights | 0.54 | 0.62 |
| Rally Points left | 4.69 | 3.74 |
| **Buffs:** healed allies (Lay On Hands) | 20.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 12.9 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 85.2 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.1 | 0.0 |
| **Map:** AP spent moving | 7.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.9 | 0.0 |
| Turns that start Engaged | 10.9 | 6.1 |
| Shots ([Ranged] Actions) | 0.0 | 49.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 25.2 |
| ... while Engaged (2 Banes) | 0.0 | 4.0 |
| Flanking Boons on its melee Actions | 8.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 11.2 / 0.0 | 12.7 / 93.1 |
| AP left unspent / Guard they gave / Guard used | 0.1 / 0.1 / 0.0 | 5.0 / 3.7 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.44 |
| **Debuff:** Immobilized (times) | 0.00 | 3.29 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.60 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.94 |

### Short hard day (normal, hard, deadly)

Fight 1: 4 standard (CV 4) · Fight 2: 1 elite, 3 standard (CV 5) · Fight 3: 6 standard (CV 6)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 83% · a PC Down during the day 75% · Downs a day 1.80 · Rally Points left at the end 58% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.4 | 14% | 22% |
| 2: 1 elite, 3 standard | 98% | 4.3 | 16% | 32% |
| 3: 6 standard | 85% | 5.1 | 32% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 335.0 | 92.0 | 314.7 | 287.3 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 298.2 | 85.7 | 280.1 | 250.3 |
| ... a turn (its own turns) | 31.6 | 8.1 | 27.5 | 24.4 |
| Damage a turn (its own turns) | 35.5 | 8.6 | 30.8 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 36.9 | 9.5 | 33.1 | 33.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - | - | - |
| Share of the party's damage (%) | 33 | 9 | 31 | 28 |
| Turns taken | 9.5 | 10.5 | 10.2 | 10.3 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 82.1 | 91.2 | 51.8 | 54.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.0 | 29.2 | 0.0 | 0.9 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 6.0 | 0.0 | 0.0 |
| Damage taken | 77.1 | 61.9 | 51.6 | 52.9 |
| Damage taken a round of combat | 6.2 | 4.9 | 4.1 | 4.2 |
| Times Down | 0.61 | 0.30 | 0.46 | 0.43 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.24 | 1.53 | 0.03 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 1.24 | 0.00 | 0.95 | 1.00 |
| Rally Points used between fights | 2.11 | 0.97 | 1.43 | 1.29 |
| Rally Points left | 3.42 | 4.50 | 3.59 | 3.69 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 26.3 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 9.2 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 104.8 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 13.4 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.0 | 5.2 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 5.3 | 0.0 | 0.0 |
| Turns that start Engaged | 5.6 | 6.4 | 3.6 | 4.1 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 39.3 | 30.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 18.0 | 14.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.7 | 3.1 |
| Flanking Boons on its melee Actions | 6.0 | 3.2 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 6.7 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.2 / 14.8 | 7.8 / 0.0 | 6.7 / 41.3 | 7.6 / 52.3 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.0 / 0.0 | 2.3 / 1.4 / 0.1 | 2.1 / 1.1 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.37 | 0.00 | 6.82 | 6.88 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.06 | 3.12 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.90 | 1.95 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 1.86 | 1.82 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 2.80 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 36% · a PC Down during the day 99% · Downs a day 4.64 · Rally Points left at the end 42% · Health at the end 27%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 98% | 3.0 | 41% | 43% |
| 2: 1 elite, 3 standard | 88% | 3.8 | 57% | 77% |
| 3: 6 standard | 42% | 3.9 | 78% | 92% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 222.4 | 236.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 196.5 | 209.1 |
| ... a turn (its own turns) | 29.1 | 27.1 |
| Damage a turn (its own turns) | 32.8 | 30.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 30.9 | 34.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 6.7 | 7.7 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 77.7 | 49.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.7 | 49.9 |
| Damage taken a round of combat | 7.8 | 5.1 |
| Times Down | 1.29 | 1.02 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.75 | 0.16 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.97 | 2.70 |
| Rally Points left | 2.28 | 3.14 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 3.6 | 2.8 |
| Shots ([Ranged] Actions) | 0.0 | 30.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.4 |
| ... while Engaged (2 Banes) | 0.0 | 4.2 |
| Flanking Boons on its melee Actions | 3.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.3 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 3.7 / 10.2 | 5.3 / 32.2 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.1 / 0.5 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.00 | 4.83 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.08 |
| **Debuff:** Immobilized (times) | 0.00 | 1.25 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.50 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 94% · a PC Down during the day 50% · Downs a day 0.89 · Rally Points left at the end 66% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.4 | 4% | 12% |
| 2: 1 elite, 3 standard | 100% | 5.4 | 6% | 18% |
| 3: 6 standard | 94% | 6.3 | 14% | 32% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 135.1 | 390.5 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 126.7 | 342.3 |
| ... a turn (its own turns) | 9.1 | 25.2 |
| Damage a turn (its own turns) | 9.6 | 28.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 10.6 | 32.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 23.9 |
| Share of the party's damage (%) | 13 | 37 |
| Turns taken | 14.0 | 13.6 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 98.4 | 58.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 35.0 | 0.7 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.8 | 0.0 |
| Damage taken | 63.4 | 57.9 |
| Damage taken a round of combat | 4.0 | 3.6 |
| Times Down | 0.17 | 0.28 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.85 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.74 | 1.45 |
| Rally Points used between fights | 0.56 | 0.88 |
| Rally Points left | 4.86 | 3.67 |
| **Buffs:** healed allies (Lay On Hands) | 17.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 9.5 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 71.9 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 6.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.3 | 0.0 |
| Turns that start Engaged | 9.4 | 5.2 |
| Shots ([Ranged] Actions) | 0.0 | 39.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 19.5 |
| ... while Engaged (2 Banes) | 0.0 | 3.5 |
| Flanking Boons on its melee Actions | 6.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 9.8 / 0.0 | 10.4 / 74.2 |
| AP left unspent / Guard they gave / Guard used | 0.1 / 0.1 / 0.0 | 4.1 / 3.0 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.51 |
| **Debuff:** Immobilized (times) | 0.00 | 2.81 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.02 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 2.92 |
