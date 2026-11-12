# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/rework/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

**The rules: the book today for the classes as their cards are written (pack R, and since Stage 0 went into the book on 2026-11-12: the flat-plus-one-die weapon table, no basic Opportunity Attack, a [Ranged] Action while Engaged is Doomed). The class cards still sit on the 1-to-3 Escalation ladder, so these builds do too; Stage 0's levels 1 to 3 on the 1-to-6 ladder with Momentum 0 to 4 and the Bestiary's Stage 0 table are in stage0.md.** 4 AP + 1 Reaction AP (NPCs 4 + 1, Minions 3); Escalation is a level from 1 (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard 2 / 3 / 4 (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); no creature has an Opportunity Attack; NPCs use their Specials (Round: 1 AP × 1.4, 2 AP × 2.2, 3 AP × 3.5 for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs); an enemy at 0 Health is out at once (the rest of that turn goes to another enemy: since 2026-11-12).

## Archer (Double Shot) (ranged damage), `rework/archer-double-r1.txt`

Health 29 (Body 19 + Mind 10) · AD 13 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 6 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 1 | 29.0 | 27.7 | 26.5 | 30.3 | 4 | 3 | Double Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 29.0 | 27.7 | 26.5 | 30.3 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the step | 1 | 22.9 | 22.0 | 21.1 | 24.5 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 29.4 | 28.1 | 26.9 | 30.6 | 4 | 3 | Double Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex (**best**) | 3 | 35.3 | 33.8 | 32.2 | 33.8 | 4 | 2 | Deathmark, Double Shot 2 |  |
| Kite | 1 | 22.9 | 22.0 | 21.1 | 24.5 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Steel | 1 | 16.4 | 15.6 | 14.8 | 17.9 | 4 | 1 | Steel Yourself 2, Double Shot 2 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 6.5 | 1 / 1.0 | 5 / 5.1 |
| Grunt | 28 | 13 | 2 | 8.0 | 1 / 1.4 | 4 / 4.2 |
| Standard | 63 | 13 | 2 | 15.7 | 3 / 2.9 | 2 / 2.5 |
| Elite | 132 | 14 | 3 | 19.3 | 6 / 5.6 | 2 / 2.0 |

## Archer (Rolling Shot) (ranged damage), `rework/archer-rolling-r1.txt`

Health 29 (Body 19 + Mind 10) · AD 13 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 6 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (**best**) | 1 | 25.8 | 24.7 | 23.6 | 27.2 | 4 | 3 | Rolling Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 28.7 | 27.3 | 26.1 | 29.9 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the long roll | 1 | 22.2 | 21.3 | 20.3 | 23.7 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 25.8 | 24.7 | 23.6 | 27.2 | 4 | 3 | Rolling Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex | 3 | 22.7 | 21.8 | 20.8 | 21.8 | 4 | 2 | Open Season, Rolling Shot 2 |  |
| Kite | 1 | 22.2 | 21.3 | 20.3 | 23.7 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Steel | 1 | 12.2 | 11.5 | 10.8 | 13.4 | 4 | 1 | Steel Yourself 2, Rolling Shot 2 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 6.5 | 1 / 1.0 | 5 / 5.0 |
| Grunt | 28 | 13 | 2 | 8.0 | 2 / 1.7 | 4 / 4.2 |
| Standard | 63 | 13 | 2 | 15.7 | 3 / 3.3 | 2 / 2.5 |
| Elite | 132 | 14 | 3 | 19.3 | 7 / 6.8 | 2 / 2.0 |

## Paladin (Lay On Hands) (tank / support), `rework/paladin-hands-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 13 · Weapon Modifier +1 · Power Modifier +2 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 14.9 | 13.4 | 11.8 | 13.4 | 4 | 2 | Lay On Hands 2, Weapon Attack, Weapon Attack |  |
| Heal 1 and three attacks (**best**) | 1 | 21.3 | 19.0 | 16.7 | 19.0 | 4 | 3 | Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Nova (plan) | 1 | 16.8 | 15.5 | 14.2 | 15.5 | 4 | 1 | Lay On Hands 2, Holy Wrath 2 |  |
| Apex | 3 | 7.9 | 7.1 | 6.3 | 7.1 | 4 | 1 | Hallowed Dawn, Weapon Attack |  |
| Two attacks | 1 | 14.9 | 13.4 | 11.8 | 13.4 | 2 | 2 | Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.2 | 60+ / - |
| Grunt | 28 | 13 | 2 | 7.2 | 2 / 2.7 | 48 / 46.9 |
| Standard | 63 | 13 | 2 | 14.0 | 5 / 5.6 | 4 / 4.1 |
| Elite | 132 | 14 | 3 | 17.6 | 12 / 12.1 | 2 / 2.8 |

## Paladin (Smite) (tank / support), `rework/paladin-smite-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 38.4 | 35.5 | 32.5 | 40.2 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and one attack | 1 | 31.7 | 29.6 | 27.5 | 33.1 | 4 | 2 | Smite 3, Weapon Attack |  |
| Nova (plan) | 1 | 36.2 | 34.1 | 31.9 | 37.6 | 4 | 2 | Holy Wrath 3, Weapon Attack |  |
| Nova with Smite | 1 | 39.2 | 36.7 | 34.2 | 40.7 | 4 | 2 | Holy Wrath 2, Smite 2 |  |
| Apex (**best**) | 3 | 43.2 | 40.7 | 38.2 | 40.7 | 4 | 2 | Final Verdict, Smite 2 |  |
| Two attacks | 1 | 21.4 | 19.6 | 17.6 | 22.4 | 2 | 2 | Weapon Attack, Weapon Attack |  |
| Steel | 1 | 20.4 | 19.2 | 17.9 | 21.2 | 4 | 1 | Steel Yourself 2, Smite 2 |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.0 | 7 / 6.7 |
| Grunt | 28 | 13 | 2 | 7.2 | 1 / 1.3 | 5 / 5.4 |
| Standard | 63 | 13 | 2 | 14.0 | 2 / 2.3 | 3 / 3.2 |
| Elite | 132 | 14 | 3 | 17.6 | 4 / 4.2 | 2 / 2.5 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer (Double Shot), Archer (Rolling Shot); 2000 runs each)

The Bestiary's target for a normal fight (CV 100 a PC: 4 Standards against 4 PCs): about **3.5 rounds**, about **a fifth of the party's Health** with the Rally Points it spends, a PC Down in about **1 fight of 5** (pack R-bestiary: rbestiary.md).

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer (Double Shot) Down | Archer (Rolling Shot) Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards (normal) | 4 | 3 / 3.4 / 4 | 99% | 13% | 22% | 2 | 10% | 7% | 5% | 5% | 3.2 / 18% |
| 2 Elites | 4 | 4 / 3.6 / 4 | 100% | 13% | 23% | 2 | 14% | 6% | 4% | 3% | 3.3 / 18% |
| Elite + 2 Standards | 4 | 3 / 3.5 / 4 | 100% | 13% | 21% | 2 | 10% | 7% | 5% | 5% | 3.3 / 15% |
| 8 Grunts | 4 | 3 / 3.4 / 4 | 100% | 11% | 9% | 2 | 3% | 4% | 2% | 3% | 3.2 / 11% |
| 2 Standards + 8 Minions | 4 | 3 / 3.1 / 4 | 100% | 10% | 11% | 2 | 3% | 3% | 4% | 2% | 3.4 / 24% |
| 3 Standards + 1 Ward attacker | 4 | 3 / 3.5 / 4 | 99% | 15% | 24% | 2 | 11% | 8% | 6% | 7% | 3.3 / 21% |
| 5 Standards (CV 5, hard) | 5 | 4 / 4.4 / 6 | 93% | 25% | 42% | 2 | 23% | 16% | 17% | 19% | 4.1 / 31% |
| 6 Standards (CV 6, deadly) | 6 | 5 / 5.2 / 7 | 77% | 42% | 63% | 2 | 42% | 27% | 38% | 38% | 4.4 / 52% |
| 2 Elites + 2 Standards (CV 6, deadly) | 6 | 5 / 5.5 / 7 | 86% | 35% | 58% | 2 | 37% | 22% | 32% | 25% | 4.9 / 45% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane, choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (each Advance is an AP its attacks don't get), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover 5% Medium, 15% Low); Flanking for both sides (Field Boons: the cancels, then 2 at most); Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 1 in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 3 standard (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 5 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 94% · a PC Down during the day 65% · Downs a day 1.26 · Rally Points left at the end 59% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.6 | 8% | 8% |
| 2: 4 standard | 99% | 3.5 | 13% | 22% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 11% | 22% |
| 4: 5 standard | 94% | 4.3 | 21% | 38% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 373.1 | 90.7 | 354.6 | 311.9 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 329.9 | 84.3 | 315.2 | 274.5 |
| ... a turn (its own turns) | 30.1 | 7.4 | 26.6 | 23.5 |
| Damage a turn (its own turns) | 33.9 | 8.0 | 29.9 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 35.8 | 8.2 | 32.8 | 34.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 32.8 | - | 28.5 | 22.5 |
| Share of the party's damage (%) | 33 | 8 | 31 | 28 |
| Turns taken | 11.0 | 11.3 | 11.9 | 11.7 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 80.2 | 76.1 | 41.1 | 46.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 3.5 | 17.0 | 0.1 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 3.9 | 0.0 | 0.0 |
| Damage taken | 76.8 | 59.1 | 41.0 | 45.6 |
| Damage taken a round of combat | 5.5 | 4.3 | 3.0 | 3.3 |
| Times Down | 0.47 | 0.25 | 0.25 | 0.28 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.26 | 1.41 | 0.02 | 0.03 |
| Rally Points used through an ally's Lay On Hands | 1.43 | 0.00 | 0.85 | 0.97 |
| Rally Points used between fights | 2.09 | 1.29 | 1.14 | 1.28 |
| Rally Points left | 3.22 | 4.30 | 3.98 | 3.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 26.9 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 12.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 100.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 12.6 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.9 | 6.6 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 6.8 | 0.0 | 0.0 |
| Turns that start Engaged | 5.9 | 6.3 | 3.3 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 45.0 | 34.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 20.3 | 16.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.0 | 3.5 |
| Flanking Boons on its melee Actions | 7.1 | 3.7 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 6.7 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.5 / 15.4 | 7.6 / 0.0 | 6.7 / 40.5 | 8.2 / 53.8 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.2 / 0.1 / 0.0 | 2.4 / 1.0 / 0.0 | 2.1 / 0.8 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.49 | 0.00 | 7.93 | 7.66 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.23 | 3.34 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.16 | 1.92 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.54 | 2.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.74 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 71% · a PC Down during the day 96% · Downs a day 3.64 · Rally Points left at the end 30% · Health at the end 52%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.2 | 26% | 21% |
| 2: 4 standard | 98% | 3.1 | 42% | 49% |
| 3: 1 elite, 2 standard | 99% | 3.0 | 38% | 55% |
| 4: 5 standard | 73% | 3.8 | 61% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 266.3 | 284.0 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 233.1 | 251.4 |
| ... a turn (its own turns) | 27.5 | 26.1 |
| Damage a turn (its own turns) | 31.3 | 29.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.0 | 34.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 31.3 | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 8.5 | 9.7 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 79.9 | 42.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.9 | 42.7 |
| Damage taken a round of combat | 6.7 | 3.6 |
| Times Down | 1.12 | 0.70 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.69 | 0.13 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.08 | 3.22 |
| Rally Points left | 1.24 | 2.65 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.9 | 0.0 |
| Turns that start Engaged | 4.1 | 2.8 |
| Shots ([Ranged] Actions) | 0.0 | 36.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.2 |
| ... while Engaged (2 Banes) | 0.0 | 3.9 |
| Flanking Boons on its melee Actions | 4.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.6 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.0 / 11.3 | 5.6 / 32.9 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.3 / 0.4 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.09 | 6.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.57 |
| **Debuff:** Immobilized (times) | 0.00 | 1.49 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.20 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 98% · a PC Down during the day 44% · Downs a day 0.63 · Rally Points left at the end 67% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 3.4 | 3% | 6% |
| 2: 4 standard | 100% | 4.5 | 5% | 14% |
| 3: 1 elite, 2 standard | 100% | 4.5 | 4% | 11% |
| 4: 5 standard | 99% | 5.4 | 8% | 22% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 130.2 | 433.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 121.9 | 383.2 |
| ... a turn (its own turns) | 8.0 | 24.6 |
| Damage a turn (its own turns) | 8.6 | 27.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 9.3 | 32.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 7.1 | 23.0 |
| Share of the party's damage (%) | 12 | 38 |
| Turns taken | 15.3 | 15.6 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 85.7 | 49.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 24.0 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.5 | 0.0 |
| Damage taken | 61.7 | 48.7 |
| Damage taken a round of combat | 3.5 | 2.7 |
| Times Down | 0.16 | 0.16 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.84 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.81 | 1.29 |
| Rally Points used between fights | 0.69 | 0.64 |
| Rally Points left | 4.67 | 4.07 |
| **Buffs:** healed allies (Lay On Hands) | 17.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 13.1 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 66.3 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.3 | 0.0 |
| **Map:** AP spent moving | 8.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.4 | 0.0 |
| Turns that start Engaged | 9.2 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 45.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.1 |
| ... while Engaged (2 Banes) | 0.0 | 3.5 |
| Flanking Boons on its melee Actions | 6.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 9.7 / 0.0 | 11.3 / 82.0 |
| AP left unspent / Guard they gave / Guard used | 0.2 / 0.1 / 0.0 | 4.5 / 3.0 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.72 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.91 |
| **Debuff:** Immobilized (times) | 0.00 | 3.07 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.74 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.93 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 5 standard (CV 5) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 3 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 92% · a PC Down during the day 69% · Downs a day 1.43 · Rally Points left at the end 55% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.4 | 10% | 8% |
| 2: 5 standard | 96% | 4.4 | 20% | 38% |
| 3: 2 elite | 100% | 3.6 | 11% | 20% |
| 4: 1 elite, 3 standard | 96% | 4.4 | 18% | 35% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 411.8 | 99.8 | 385.5 | 352.8 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 354.5 | 92.9 | 338.3 | 304.5 |
| ... a turn (its own turns) | 29.0 | 7.3 | 25.8 | 23.2 |
| Damage a turn (its own turns) | 33.7 | 7.8 | 29.4 | 27.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 35.1 | 8.5 | 31.3 | 33.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.0 | - | 28.2 | - |
| Share of the party's damage (%) | 33 | 8 | 31 | 28 |
| Turns taken | 12.2 | 12.8 | 13.1 | 13.1 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 97.3 | 96.1 | 52.7 | 56.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.5 | 26.6 | 0.1 | 0.6 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 6.2 | 0.0 | 0.0 |
| Damage taken | 91.8 | 69.6 | 52.5 | 55.9 |
| Damage taken a round of combat | 6.0 | 4.6 | 3.5 | 3.7 |
| Times Down | 0.54 | 0.24 | 0.33 | 0.32 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.27 | 1.67 | 0.02 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.51 | 0.00 | 1.07 | 1.10 |
| Rally Points used between fights | 2.28 | 1.18 | 1.37 | 1.32 |
| Rally Points left | 2.94 | 4.16 | 3.55 | 3.55 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 30.1 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 13.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 134.3 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 14.9 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.8 | 6.6 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 6.7 | 0.0 | 0.0 |
| Turns that start Engaged | 7.1 | 7.6 | 4.2 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 49.7 | 38.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 23.2 | 19.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 5.7 | 3.7 |
| Flanking Boons on its melee Actions | 7.3 | 3.8 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.7 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 6.5 / 19.0 | 9.2 / 0.0 | 7.7 / 45.6 | 9.6 / 63.2 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.0 / 0.0 | 3.1 / 1.6 / 0.1 | 2.7 / 1.4 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.86 | 0.00 | 8.28 | 8.38 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.78 | 3.84 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.21 | 2.28 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.29 | 2.26 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.82 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 53% · a PC Down during the day 99% · Downs a day 4.58 · Rally Points left at the end 30% · Health at the end 32%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 99% | 3.1 | 47% | 33% |
| 2: 5 standard | 78% | 3.8 | 61% | 79% |
| 3: 2 elite | 99% | 3.1 | 39% | 62% |
| 4: 1 elite, 3 standard | 69% | 4.0 | 57% | 88% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 263.6 | 282.1 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 225.5 | 245.0 |
| ... a turn (its own turns) | 27.1 | 25.3 |
| Damage a turn (its own turns) | 31.9 | 29.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.2 | 32.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 31.7 | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 8.2 | 9.6 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 86.4 | 52.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.4 | 52.0 |
| Damage taken a round of combat | 7.2 | 4.5 |
| Times Down | 1.37 | 0.92 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.72 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.75 | 3.42 |
| Rally Points left | 1.54 | 2.41 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 0.0 |
| Turns that start Engaged | 4.5 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 36.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.9 |
| ... while Engaged (2 Banes) | 0.0 | 5.3 |
| Flanking Boons on its melee Actions | 3.2 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 6.1 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.3 / 12.3 | 6.1 / 35.6 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.4 / 0.4 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.25 | 5.70 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.52 |
| **Debuff:** Immobilized (times) | 0.00 | 1.42 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.76 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 99% · a PC Down during the day 39% · Downs a day 0.55 · Rally Points left at the end 65% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.4 | 2% | 4% |
| 2: 5 standard | 99% | 5.3 | 7% | 19% |
| 3: 2 elite | 100% | 4.5 | 3% | 8% |
| 4: 1 elite, 3 standard | 100% | 5.5 | 5% | 15% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 150.2 | 482.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 139.9 | 417.8 |
| ... a turn (its own turns) | 8.1 | 24.0 |
| Damage a turn (its own turns) | 8.7 | 27.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 9.5 | 31.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 7.2 | 22.9 |
| Share of the party's damage (%) | 12 | 38 |
| Turns taken | 17.2 | 17.4 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 106.6 | 62.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 35.1 | 0.5 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.7 | 0.0 |
| Damage taken | 71.5 | 61.7 |
| Damage taken a round of combat | 3.7 | 3.2 |
| Times Down | 0.13 | 0.15 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.83 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.90 | 1.68 |
| Rally Points used between fights | 0.55 | 0.56 |
| Rally Points left | 4.72 | 3.76 |
| **Buffs:** healed allies (Lay On Hands) | 20.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 12.5 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 86.9 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 8.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.1 | 0.0 |
| Turns that start Engaged | 11.2 | 6.3 |
| Shots ([Ranged] Actions) | 0.0 | 50.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 25.8 |
| ... while Engaged (2 Banes) | 0.0 | 4.1 |
| Flanking Boons on its melee Actions | 8.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 11.5 / 0.0 | 13.1 / 90.6 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 5.3 / 4.1 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.68 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.63 |
| **Debuff:** Immobilized (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.93 |

### Short hard day (normal, hard, deadly)

Fight 1: 4 standard (CV 4) · Fight 2: 1 elite, 3 standard (CV 5) · Fight 3: 6 standard (CV 6)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 83% · a PC Down during the day 74% · Downs a day 1.79 · Rally Points left at the end 58% · Health at the end 78%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.5 | 13% | 21% |
| 2: 1 elite, 3 standard | 98% | 4.4 | 16% | 32% |
| 3: 6 standard | 85% | 5.1 | 32% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 337.6 | 90.7 | 310.7 | 287.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 300.2 | 85.0 | 277.2 | 251.0 |
| ... a turn (its own turns) | 30.8 | 8.0 | 26.6 | 23.8 |
| Damage a turn (its own turns) | 34.6 | 8.5 | 29.8 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 35.8 | 9.1 | 31.9 | 32.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.6 | - | - | 22.7 |
| Share of the party's damage (%) | 33 | 9 | 30 | 28 |
| Turns taken | 9.8 | 10.6 | 10.4 | 10.6 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 84.5 | 90.9 | 52.9 | 55.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.7 | 28.7 | 0.1 | 0.9 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 6.6 | 0.0 | 0.0 |
| Damage taken | 78.9 | 62.2 | 52.8 | 54.0 |
| Damage taken a round of combat | 6.2 | 4.9 | 4.1 | 4.3 |
| Times Down | 0.59 | 0.30 | 0.47 | 0.43 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.28 | 1.52 | 0.03 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.31 | 0.00 | 0.99 | 1.06 |
| Rally Points used between fights | 2.07 | 0.95 | 1.45 | 1.33 |
| Rally Points left | 3.34 | 4.53 | 3.52 | 3.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 27.7 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 9.2 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 106.8 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 13.8 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.2 | 5.2 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 5.3 | 0.0 | 0.0 |
| Turns that start Engaged | 5.8 | 6.5 | 3.8 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 40.1 | 31.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 18.2 | 15.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.8 | 3.2 |
| Flanking Boons on its melee Actions | 6.2 | 3.4 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 6.8 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.5 / 15.5 | 7.8 / 0.0 | 6.8 / 40.5 | 7.7 / 50.2 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.0 / 0.0 | 2.4 / 1.4 / 0.1 | 2.2 / 1.2 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.43 | 0.00 | 6.84 | 7.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.10 | 3.25 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.96 | 1.97 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 1.79 | 1.80 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 2.81 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 31% · a PC Down during the day 99% · Downs a day 4.88 · Rally Points left at the end 41% · Health at the end 23%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.1 | 43% | 47% |
| 2: 1 elite, 3 standard | 86% | 4.0 | 59% | 80% |
| 3: 6 standard | 37% | 3.9 | 80% | 94% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 219.2 | 232.5 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 195.3 | 205.9 |
| ... a turn (its own turns) | 28.9 | 26.2 |
| Damage a turn (its own turns) | 32.3 | 29.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 30.3 | 32.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 24 | 26 |
| Turns taken | 6.8 | 7.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 80.0 | 51.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.0 | 51.5 |
| Damage taken a round of combat | 7.8 | 5.1 |
| Times Down | 1.36 | 1.08 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.74 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.02 | 2.70 |
| Rally Points left | 2.24 | 3.12 |
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
| Turns that start Engaged | 3.6 | 2.9 |
| Shots ([Ranged] Actions) | 0.0 | 30.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.8 |
| ... while Engaged (2 Banes) | 0.0 | 4.4 |
| Flanking Boons on its melee Actions | 2.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.4 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 3.7 / 10.4 | 5.4 / 31.3 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.2 / 0.6 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.00 | 4.91 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.16 |
| **Debuff:** Immobilized (times) | 0.00 | 1.27 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.48 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 93% · a PC Down during the day 53% · Downs a day 0.94 · Rally Points left at the end 64% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.5 | 5% | 14% |
| 2: 1 elite, 3 standard | 100% | 5.5 | 6% | 18% |
| 3: 6 standard | 94% | 6.5 | 15% | 34% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 134.7 | 389.1 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 127.0 | 343.1 |
| ... a turn (its own turns) | 8.8 | 24.6 |
| Damage a turn (its own turns) | 9.3 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 10.1 | 31.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 13 | 37 |
| Turns taken | 14.4 | 14.0 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 103.5 | 61.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 37.4 | 0.6 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.8 | 0.0 |
| Damage taken | 66.1 | 60.3 |
| Damage taken a round of combat | 4.0 | 3.6 |
| Times Down | 0.17 | 0.29 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.89 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.77 | 1.49 |
| Rally Points used between fights | 0.60 | 0.91 |
| Rally Points left | 4.75 | 3.60 |
| **Buffs:** healed allies (Lay On Hands) | 18.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 9.4 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 75.1 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.0 | 0.0 |
| **Map:** AP spent moving | 6.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.3 | 0.0 |
| Turns that start Engaged | 9.8 | 5.4 |
| Shots ([Ranged] Actions) | 0.0 | 40.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.2 |
| ... while Engaged (2 Banes) | 0.0 | 3.5 |
| Flanking Boons on its melee Actions | 7.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 10.1 / 0.0 | 10.6 / 72.6 |
| AP left unspent / Guard they gave / Guard used | 0.1 / 0.1 / 0.0 | 4.3 / 3.4 / 0.3 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.70 |
| **Debuff:** Immobilized (times) | 0.00 | 2.86 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.04 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 2.92 |
