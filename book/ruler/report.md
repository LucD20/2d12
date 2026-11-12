# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/rework/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

**The rules: the book today (pack R; the ruler's default since the catch-up of 2026-11-12).** 4 AP + 1 Reaction AP (NPCs 4 + 1, Minions 3); Escalation is a level from 1 (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard 2 / 3 / 4 (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); every creature has the Opportunity Attack Reaction (an adjacent enemy that leaves a square with a Move Action or stands up); NPCs use their Specials (Round: 1 AP × 1.4, 2 AP × 2.2, 3 AP × 3.5 for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs).

## Archer (Double Shot) (ranged damage), `rework/archer-double-r1.txt`

Health 29 (Body 19 + Mind 10) · AD 13 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 6 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 1 | 30.1 | 28.6 | 27.3 | 31.2 | 4 | 3 | Double Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 30.1 | 28.6 | 27.3 | 31.2 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the step | 1 | 23.6 | 22.6 | 21.6 | 25.1 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 30.4 | 29.1 | 27.6 | 31.6 | 4 | 3 | Double Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex (**best**) | 3 | 36.3 | 34.7 | 33.0 | 34.7 | 4 | 2 | Deathmark, Double Shot 2 |  |
| Kite | 1 | 23.6 | 22.6 | 21.6 | 25.1 | 4 | 2 | Double Shot 3, Lock & Loose |  |
| Steel | 1 | 17.1 | 16.2 | 15.3 | 18.6 | 4 | 1 | Steel Yourself 2, Double Shot 2 |  |

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
| Main (**best**) | 1 | 26.5 | 25.3 | 24.1 | 27.8 | 4 | 3 | Rolling Shot 2, Lock & Loose, Weapon Attack |  |
| Big | 1 | 29.4 | 28.0 | 26.6 | 30.5 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack | 5 AP (4 a turn) |
| Main with the long roll | 1 | 22.5 | 21.6 | 20.6 | 24.0 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Pin (plan) | 1 | 26.5 | 25.3 | 24.1 | 27.8 | 4 | 3 | Rolling Shot 2, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Apex | 3 | 23.5 | 22.5 | 21.5 | 22.5 | 4 | 2 | Open Season, Rolling Shot 2 |  |
| Kite | 1 | 22.5 | 21.6 | 20.6 | 24.0 | 4 | 2 | Rolling Shot 3, Lock & Loose |  |
| Steel | 1 | 12.6 | 11.9 | 11.1 | 13.7 | 4 | 1 | Steel Yourself 2, Rolling Shot 2 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 6.5 | 1 / 1.0 | 5 / 5.0 |
| Grunt | 28 | 13 | 2 | 8.0 | 2 / 1.6 | 4 / 4.2 |
| Standard | 63 | 13 | 2 | 15.7 | 3 / 3.2 | 2 / 2.5 |
| Elite | 132 | 14 | 3 | 19.3 | 7 / 6.7 | 2 / 2.1 |

## Paladin (Lay On Hands) (tank / support), `rework/paladin-hands-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 13 · Weapon Modifier +1 · Power Modifier +2 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 8.8 | 7.8 | 6.9 | 7.8 | 4 | 2 | Lay On Hands 2, Weapon Attack, Weapon Attack |  |
| Heal 1 and three attacks | 1 | 12.4 | 11.1 | 9.8 | 11.1 | 4 | 3 | Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Nova (plan, **best**) | 1 | 13.5 | 12.6 | 11.6 | 12.6 | 4 | 1 | Lay On Hands 2, Holy Wrath 2 |  |
| Apex | 3 | 4.6 | 4.1 | 3.7 | 4.1 | 4 | 1 | Hallowed Dawn, Weapon Attack |  |
| Two attacks | 1 | 8.8 | 7.8 | 6.9 | 7.8 | 2 | 2 | Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.2 | 60+ / - |
| Grunt | 28 | 13 | 2 | 7.2 | 4 / 4.0 | 48 / 47.1 |
| Standard | 63 | 13 | 2 | 14.0 | 8 / 8.5 | 4 / 4.2 |
| Elite | 132 | 14 | 3 | 17.6 | 19 / 19.6 | 2 / 2.7 |

## Paladin (Smite) (tank / support), `rework/paladin-smite-r1.txt`

Health 35 (Body 23 + Mind 12) · AD 14 · WD 12 · Weapon Modifier +2 · Power Modifier +1 · Rally Points 7 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured at the Escalation the turn needs ("Esc": 1, or its Action's Escalation; the Passives of that level and below work), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 28.0 | 26.0 | 24.1 | 30.8 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and one attack | 1 | 24.6 | 23.1 | 21.6 | 26.6 | 4 | 2 | Smite 3, Weapon Attack |  |
| Nova (plan) | 1 | 29.1 | 27.6 | 26.1 | 31.1 | 4 | 2 | Holy Wrath 3, Weapon Attack |  |
| Nova with Smite | 1 | 32.0 | 30.2 | 28.3 | 34.2 | 4 | 2 | Holy Wrath 2, Smite 2 |  |
| Apex (**best**) | 3 | 36.0 | 34.2 | 32.3 | 34.2 | 4 | 2 | Final Verdict, Smite 2 |  |
| Two attacks | 1 | 14.4 | 13.3 | 12.1 | 16.1 | 2 | 2 | Weapon Attack, Weapon Attack |  |
| Steel | 1 | 16.8 | 15.9 | 15.0 | 17.9 | 4 | 1 | Steel Yourself 2, Smite 2 |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan; the NPC doesn't move: all its AP go to its Specials and Basic attacks, the Encounter Special once; no Elite Escalation, no Reactions, no Guard):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 5.8 | 1 / 1.0 | 7 / 6.7 |
| Grunt | 28 | 13 | 2 | 7.2 | 1 / 1.5 | 5 / 5.4 |
| Standard | 63 | 13 | 2 | 14.0 | 3 / 2.6 | 3 / 3.2 |
| Elite | 132 | 14 | 3 | 17.6 | 5 / 5.1 | 2 / 2.4 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer (Double Shot), Archer (Rolling Shot); 2000 runs each)

The Bestiary's target for a normal fight (CV 100 a PC: 4 Standards against 4 PCs): about **3.5 rounds**, about **a fifth of the party's Health** with the Rally Points it spends, a PC Down in about **1 fight of 5** (pack R-bestiary: rbestiary.md).

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer (Double Shot) Down | Archer (Rolling Shot) Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards (normal) | 4 | 4 / 3.8 / 5 | 99% | 14% | 25% | 2 | 11% | 8% | 6% | 7% | 3.6 / 18% |
| 2 Elites | 4 | 4 / 3.9 / 5 | 100% | 13% | 23% | 2 | 14% | 6% | 3% | 4% | 3.6 / 18% |
| Elite + 2 Standards | 4 | 4 / 3.8 / 5 | 100% | 14% | 23% | 2 | 11% | 7% | 6% | 5% | 3.6 / 17% |
| 8 Grunts | 4 | 4 / 3.9 / 4 | 99% | 11% | 13% | 2 | 5% | 6% | 3% | 4% | 3.7 / 9% |
| 2 Standards + 8 Minions | 4 | 4 / 3.9 / 5 | 99% | 13% | 21% | 2 | 8% | 6% | 8% | 6% | 4.0 / 25% |
| 3 Standards + 1 Ward attacker | 4 | 4 / 3.8 / 5 | 99% | 15% | 26% | 2 | 13% | 8% | 6% | 8% | 3.6 / 22% |
| 5 Standards (CV 5, hard) | 5 | 5 / 4.8 / 6 | 90% | 27% | 46% | 2 | 28% | 16% | 20% | 22% | 4.5 / 34% |
| 6 Standards (CV 6, deadly) | 6 | 5 / 5.8 / 8 | 73% | 46% | 69% | 2 | 47% | 29% | 45% | 42% | 4.9 / 54% |
| 2 Elites + 2 Standards (CV 6, deadly) | 6 | 6 / 6.0 / 8 | 81% | 39% | 62% | 2 | 40% | 26% | 37% | 29% | 5.4 / 47% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane, choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (each Advance is an AP its attacks don't get), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover 5% Medium, 15% Low); Flanking for both sides (Field Boons: the cancels, then 2 at most); every creature's Opportunity Attack (1R: its Reaction AP, or an AP kept from its turn; a PC with a class Reaction keeps its Reaction AP for it and makes an Opportunity Attack only with an AP to spare: the better choice, see the Reactions section; a ranged PC's is a shot with Engaged's 2 Banes; ranged NPCs make none); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 1 in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).

## Reactions in the 4 + 1 AP economy

Each row is the same 2000 fights (the same seed, every creature rolling its own dice) with one piece changed or taken away. "The rules as they are" keeps a PC's Reaction AP for its class Reaction (an Opportunity Attack only with an AP to spare). **Per PC, a fight:** the Reactions it used, the Opportunity Attacks among them and their damage, the Opportunity Attacks it took and their damage, the turn AP it left unspent and the Guard they gave / the Guard that stopped damage. The class Reactions: Rebuke (Paladin (Smite)), Shield of Faith (Paladin (Lay On Hands)), Overwatch (Archer (Double Shot)), Covering Shot (Archer (Rolling Shot)).

**4 Standards (normal)** (CV 4)

| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| The rules as they are | 3.8 | 99% | 13% | 23% | 61.9 | 2.03 | 0.00 · 0.0 | 0.00 · 0.0 | 0.35 · 0.1 · 0.0 |
| The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP) | 3.7 | 99% | 15% | 25% | 64.5 | 2.07 | 0.29 · 1.8 | 0.00 · 0.0 | 0.36 · 0.1 · 0.0 |
| No Opportunity Attack for the PCs | 3.8 | 99% | 13% | 23% | 61.9 | 2.03 | 0.00 · 0.0 | 0.00 · 0.0 | 0.35 · 0.1 · 0.0 |
| No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1) | 3.8 | 99% | 13% | 23% | 61.9 | 2.03 | 0.00 · 0.0 | 0.00 · 0.0 | 0.35 · 0.1 · 0.0 |
| No class Reaction (the PCs keep the Opportunity Attack) | 4.2 | 97% | 25% | 42% | 87.4 | 0.44 | 0.44 · 2.6 | 0.00 · 0.0 | 0.48 · 0.4 · 0.1 |
| No Reactions for the PCs | 4.4 | 98% | 24% | 40% | 88.6 | 0.00 | 0.00 · 0.0 | 0.00 · 0.0 | 0.47 · 0.4 · 0.1 |
| No Reaction AP for the PCs (a Reaction needs an AP kept from the turn) | 4.3 | 98% | 23% | 40% | 87.6 | 0.17 | 0.00 · 0.0 | 0.00 · 0.0 | 0.45 · 0.1 · 0.0 |
| A Reaction AP from the first moment of the encounter (before the first turn too) | 3.6 | 100% | 12% | 19% | 54.2 | 2.60 | 0.00 · 0.0 | 0.00 · 0.0 | 0.34 · 0.1 · 0.0 |
| No Guard from unused AP | 3.8 | 99% | 13% | 23% | 62.0 | 2.03 | 0.00 · 0.0 | 0.00 · 0.0 | 0.00 · 0.0 · 0.0 |

| Per PC, a fight (the rules as they are) | Paladin (Smite) | Paladin (Lay On Hands) | Archer (Double Shot) | Archer (Rolling Shot) |
|---|---:|---:|---:|---:|
| Turns | 3.1 | 3.1 | 3.3 | 3.3 |
| Reactions used | 1.61 | 2.19 | 1.98 | 2.33 |
| ... Opportunity Attacks | 0.00 | 0.01 | 0.00 | 0.00 |
| Damage its Reactions dealt | 4.6 | 0.0 | 12.6 | 16.7 |
| ... its Opportunity Attacks | 0.0 | 0.0 | 0.0 | 0.0 |
| Damage its Reactions blocked | 0.0 | 16.0 | 0.0 | 2.0 |
| Opportunity Attacks it took | 0.00 | 0.00 | 0.00 | 0.00 |
| ... their damage | 0.0 | 0.0 | 0.0 | 0.0 |
| Turn AP left unspent | 0.00 | 0.04 | 0.75 | 0.62 |
| Guard from them: given | 0.0 | 0.0 | 0.3 | 0.2 |
| ... used | 0.0 | 0.0 | 0.0 | 0.0 |
| Its Reactions' damage as a share of its damage (%) | 5 | 0 | 12 | 18 |

**6 Standards (CV 6, deadly)** (CV 6)

| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| The rules as they are | 5.7 | 71% | 46% | 69% | 147.7 | 3.27 | 0.00 · 0.0 | 0.00 · 0.0 | 0.46 · 0.3 · 0.0 |
| The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP) | 5.7 | 70% | 48% | 71% | 150.3 | 3.30 | 0.40 · 2.3 | 0.00 · 0.0 | 0.47 · 0.3 · 0.0 |
| No Opportunity Attack for the PCs | 5.7 | 71% | 46% | 69% | 147.6 | 3.27 | 0.00 · 0.0 | 0.00 · 0.0 | 0.46 · 0.3 · 0.0 |
| No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1) | 5.7 | 71% | 46% | 69% | 147.7 | 3.27 | 0.00 · 0.0 | 0.00 · 0.0 | 0.46 · 0.3 · 0.0 |
| No class Reaction (the PCs keep the Opportunity Attack) | 5.7 | 46% | 69% | 85% | 177.3 | 0.67 | 0.67 · 4.0 | 0.00 · 0.0 | 0.45 · 0.6 · 0.2 |
| No Reactions for the PCs | 5.9 | 46% | 69% | 85% | 184.3 | 0.00 | 0.00 · 0.0 | 0.00 · 0.0 | 0.41 · 0.6 · 0.2 |
| No Reaction AP for the PCs (a Reaction needs an AP kept from the turn) | 5.9 | 47% | 69% | 85% | 182.6 | 0.22 | 0.00 · 0.0 | 0.00 · 0.0 | 0.40 · 0.2 · 0.0 |
| A Reaction AP from the first moment of the encounter (before the first turn too) | 5.6 | 78% | 41% | 63% | 134.4 | 3.99 | 0.00 · 0.0 | 0.00 · 0.0 | 0.47 · 0.3 · 0.0 |
| No Guard from unused AP | 5.8 | 70% | 46% | 69% | 147.8 | 3.28 | 0.00 · 0.0 | 0.00 · 0.0 | 0.00 · 0.0 · 0.0 |

| Per PC, a fight (the rules as they are) | Paladin (Smite) | Paladin (Lay On Hands) | Archer (Double Shot) | Archer (Rolling Shot) |
|---|---:|---:|---:|---:|
| Turns | 3.7 | 4.6 | 4.2 | 4.1 |
| Reactions used | 2.47 | 3.88 | 3.44 | 3.30 |
| ... Opportunity Attacks | 0.00 | 0.00 | 0.00 | 0.00 |
| Damage its Reactions dealt | 7.1 | 0.0 | 21.3 | 22.3 |
| ... its Opportunity Attacks | 0.0 | 0.0 | 0.0 | 0.0 |
| Damage its Reactions blocked | 0.0 | 28.7 | 0.0 | 3.1 |
| Opportunity Attacks it took | 0.00 | 0.00 | 0.00 | 0.00 |
| ... their damage | 0.0 | 0.0 | 0.0 | 0.0 |
| Turn AP left unspent | 0.00 | 0.00 | 1.00 | 0.84 |
| Guard from them: given | 0.0 | 0.0 | 0.7 | 0.5 |
| ... used | 0.0 | 0.0 | 0.1 | 0.1 |
| Its Reactions' damage as a share of its damage (%) | 6 | 0 | 16 | 19 |

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 3 standard (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 5 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 93% · a PC Down during the day 66% · Downs a day 1.35 · Rally Points left at the end 57% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.9 | 8% | 11% |
| 2: 4 standard | 99% | 3.8 | 13% | 24% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 10% | 21% |
| 4: 5 standard | 94% | 4.7 | 21% | 40% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 354.3 | 67.1 | 407.3 | 362.2 |
| Damage a turn (its own turns) | 29.4 | 5.4 | 31.7 | 28.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.2 | 5.1 | 33.8 | 35.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 28.4 | - | 30.5 | - |
| Share of the party's damage (%) | 30 | 6 | 34 | 30 |
| Turns taken | 12.0 | 12.5 | 12.9 | 12.7 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 88.1 | 82.8 | 46.6 | 49.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 5.0 | 21.3 | 0.1 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 5.4 | 0.0 | 0.0 |
| Damage taken | 83.0 | 61.5 | 46.4 | 49.4 |
| Damage taken a round of combat | 5.5 | 4.1 | 3.1 | 3.3 |
| Times Down | 0.51 | 0.23 | 0.29 | 0.31 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.28 | 1.54 | 0.01 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.55 | 0.00 | 0.99 | 1.06 |
| Rally Points used between fights | 2.13 | 1.06 | 1.22 | 1.34 |
| Rally Points left | 3.03 | 4.40 | 3.78 | 3.59 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 29.8 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 15.3 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 111.9 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 13.9 | 0.0 | 0.0 |
| **Map:** AP spent moving | 7.4 | 7.0 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.4 | 7.1 | 0.0 | 0.0 |
| Turns that start Engaged | 6.5 | 7.1 | 3.6 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 49.6 | 38.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 22.9 | 18.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.4 | 3.5 |
| Flanking Boons on its melee Actions | 9.8 | 4.5 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.3 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.1 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 6.1 / 17.0 | 8.6 / 0.1 | 7.3 / 47.0 | 9.1 / 64.6 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.1 / 0.0 | 3.0 / 1.6 / 0.1 | 2.6 / 1.2 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.63 | 0.00 | 9.21 | 9.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.00 | 4.04 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.60 | 2.58 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.62 | 2.64 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.79 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 57% · a PC Down during the day 97% · Downs a day 4.21 · Rally Points left at the end 30% · Health at the end 40%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.4 | 27% | 22% |
| 2: 4 standard | 96% | 3.3 | 47% | 55% |
| 3: 1 elite, 2 standard | 99% | 3.3 | 40% | 60% |
| 4: 5 standard | 60% | 3.9 | 66% | 86% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 243.8 | 320.8 |
| Damage a turn (its own turns) | 27.8 | 31.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 28.0 | 35.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 27.7 | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 8.7 | 10.2 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 84.4 | 47.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.4 | 47.2 |
| Damage taken a round of combat | 6.7 | 3.8 |
| Times Down | 1.29 | 0.82 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.74 | 0.15 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.02 | 3.18 |
| Rally Points left | 1.24 | 2.67 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.8 | 0.0 |
| Turns that start Engaged | 4.4 | 3.0 |
| Shots ([Ranged] Actions) | 0.0 | 39.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.9 |
| ... while Engaged (2 Banes) | 0.0 | 4.2 |
| Flanking Boons on its melee Actions | 5.2 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 6.1 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.3 / 11.8 | 6.1 / 37.8 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.5 / 0.6 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.10 | 7.00 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.95 |
| **Debuff:** Immobilized (times) | 0.00 | 1.78 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.27 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 98% · a PC Down during the day 45% · Downs a day 0.66 · Rally Points left at the end 66% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 3.7 | 3% | 8% |
| 2: 4 standard | 100% | 4.9 | 6% | 16% |
| 3: 1 elite, 2 standard | 100% | 4.8 | 4% | 11% |
| 4: 5 standard | 98% | 5.9 | 8% | 22% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 93.6 | 499.4 |
| Damage a turn (its own turns) | 5.6 | 29.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 5.7 | 33.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 5.2 | 24.1 |
| Share of the party's damage (%) | 8 | 42 |
| Turns taken | 16.8 | 17.1 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 93.2 | 54.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 28.3 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.4 | 0.0 |
| Damage taken | 64.9 | 53.8 |
| Damage taken a round of combat | 3.4 | 2.8 |
| Times Down | 0.16 | 0.17 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.88 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.81 | 1.44 |
| Rally Points used between fights | 0.68 | 0.65 |
| Rally Points left | 4.63 | 3.91 |
| **Buffs:** healed allies (Lay On Hands) | 18.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 14.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 72.6 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Map:** AP spent moving | 8.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.9 | 0.0 |
| Turns that start Engaged | 10.3 | 5.5 |
| Shots ([Ranged] Actions) | 0.0 | 50.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 24.4 |
| ... while Engaged (2 Banes) | 0.0 | 3.8 |
| Flanking Boons on its melee Actions | 8.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.2 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 11.0 / 0.2 | 12.5 / 98.2 |
| AP left unspent / Guard they gave / Guard used | 0.2 / 0.1 / 0.0 | 5.5 / 4.1 / 0.3 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 12.62 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.86 |
| **Debuff:** Immobilized (times) | 0.00 | 3.90 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.86 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.94 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 5 standard (CV 5) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 3 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 88% · a PC Down during the day 72% · Downs a day 1.58 · Rally Points left at the end 53% · Health at the end 83%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 99% | 3.9 | 11% | 12% |
| 2: 5 standard | 94% | 4.7 | 21% | 39% |
| 3: 2 elite | 100% | 3.7 | 10% | 18% |
| 4: 1 elite, 3 standard | 96% | 4.8 | 20% | 39% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 388.0 | 73.6 | 435.9 | 400.2 |
| Damage a turn (its own turns) | 29.8 | 5.3 | 31.2 | 28.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.1 | 5.3 | 32.8 | 33.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 29.0 | - | - | 23.9 |
| Share of the party's damage (%) | 30 | 6 | 34 | 31 |
| Turns taken | 13.0 | 13.8 | 14.0 | 14.0 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 104.7 | 103.6 | 59.0 | 62.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.9 | 30.4 | 0.1 | 0.6 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 7.5 | 0.0 | 0.0 |
| Damage taken | 97.8 | 73.2 | 58.8 | 61.4 |
| Damage taken a round of combat | 6.0 | 4.6 | 3.7 | 3.8 |
| Times Down | 0.60 | 0.27 | 0.36 | 0.34 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.30 | 1.77 | 0.03 | 0.03 |
| Rally Points used through an ally's Lay On Hands | 1.59 | 0.00 | 1.21 | 1.33 |
| Rally Points used between fights | 2.22 | 1.06 | 1.34 | 1.27 |
| Rally Points left | 2.89 | 4.17 | 3.42 | 3.37 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 33.7 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 14.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 146.1 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 16.2 | 0.0 | 0.0 |
| **Map:** AP spent moving | 7.0 | 6.9 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 7.0 | 0.0 | 0.0 |
| Turns that start Engaged | 7.7 | 8.4 | 4.6 | 5.5 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 54.1 | 41.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 25.2 | 21.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 6.0 | 3.9 |
| Flanking Boons on its melee Actions | 10.2 | 4.8 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 8.6 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 7.2 / 20.4 | 10.1 / 0.0 | 8.6 / 53.8 | 10.4 / 72.9 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.0 / 0.0 / 0.0 | 3.6 / 2.2 / 0.1 | 3.2 / 1.8 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 2.03 | 0.00 | 9.80 | 9.80 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.63 | 4.46 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.77 | 2.84 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.41 | 2.49 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.74 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 36% · a PC Down during the day 100% · Downs a day 5.24 · Rally Points left at the end 33% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 98% | 3.4 | 53% | 43% |
| 2: 5 standard | 70% | 4.0 | 67% | 84% |
| 3: 2 elite | 98% | 3.4 | 43% | 68% |
| 4: 1 elite, 3 standard | 53% | 4.1 | 62% | 93% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 232.7 | 302.0 |
| Damage a turn (its own turns) | 28.7 | 31.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 28.3 | 34.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 22 | 28 |
| Turns taken | 8.1 | 9.6 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 88.5 | 57.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 88.5 | 57.1 |
| Damage taken a round of combat | 7.4 | 5.0 |
| Times Down | 1.51 | 1.11 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.81 | 0.19 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.37 | 3.30 |
| Rally Points left | 1.82 | 2.50 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.6 | 0.0 |
| Turns that start Engaged | 4.6 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 37.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.4 |
| ... while Engaged (2 Banes) | 0.0 | 5.3 |
| Flanking Boons on its melee Actions | 3.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 6.5 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.5 / 13.1 | 6.5 / 40.4 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.5 / 0.6 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.32 | 6.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.84 |
| **Debuff:** Immobilized (times) | 0.00 | 1.70 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.76 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 97% · a PC Down during the day 48% · Downs a day 0.70 · Rally Points left at the end 61% · Health at the end 96%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 5.0 | 2% | 5% |
| 2: 5 standard | 98% | 6.0 | 8% | 23% |
| 3: 2 elite | 100% | 4.8 | 4% | 8% |
| 4: 1 elite, 3 standard | 98% | 6.1 | 8% | 21% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 110.4 | 555.7 |
| Damage a turn (its own turns) | 5.8 | 29.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 5.9 | 32.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 5.3 | 24.2 |
| Share of the party's damage (%) | 8 | 42 |
| Turns taken | 19.1 | 19.1 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 118.9 | 71.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 42.9 | 0.4 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.6 | 0.0 |
| Damage taken | 75.9 | 70.9 |
| Damage taken a round of combat | 3.5 | 3.3 |
| Times Down | 0.14 | 0.21 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.90 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.92 | 1.89 |
| Rally Points used between fights | 0.59 | 0.73 |
| Rally Points left | 4.58 | 3.38 |
| **Buffs:** healed allies (Lay On Hands) | 22.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 13.9 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 94.7 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.8 | 0.0 |
| **Map:** AP spent moving | 8.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.6 | 0.0 |
| Turns that start Engaged | 12.8 | 6.9 |
| Shots ([Ranged] Actions) | 0.0 | 56.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 28.5 |
| ... while Engaged (2 Banes) | 0.0 | 4.2 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 13.0 / 0.0 | 14.5 / 108.7 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.1 / 0.0 | 6.3 / 5.6 / 0.4 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 13.81 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 6.70 |
| **Debuff:** Immobilized (times) | 0.00 | 4.37 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.73 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.91 |

### Short hard day (normal, hard, deadly)

Fight 1: 4 standard (CV 4) · Fight 2: 1 elite, 3 standard (CV 5) · Fight 3: 6 standard (CV 6)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 76% · a PC Down during the day 81% · Downs a day 2.12 · Rally Points left at the end 55% · Health at the end 70%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.8 | 12% | 21% |
| 2: 1 elite, 3 standard | 96% | 4.7 | 19% | 37% |
| 3: 6 standard | 79% | 5.8 | 37% | 60% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 311.9 | 67.9 | 355.8 | 326.0 |
| Damage a turn (its own turns) | 30.1 | 5.7 | 31.7 | 28.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 31.3 | 5.7 | 33.2 | 33.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 29.3 | - | - | 23.9 |
| Share of the party's damage (%) | 29 | 6 | 34 | 31 |
| Turns taken | 10.3 | 11.8 | 11.2 | 11.4 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 93.9 | 108.6 | 58.1 | 62.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.9 | 38.1 | 0.1 | 0.8 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 7.8 | 0.0 | 0.0 |
| Damage taken | 86.9 | 70.6 | 57.8 | 61.4 |
| Damage taken a round of combat | 6.3 | 5.0 | 4.1 | 4.4 |
| Times Down | 0.70 | 0.35 | 0.56 | 0.52 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.32 | 1.89 | 0.04 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.41 | 0.00 | 1.11 | 1.22 |
| Rally Points used between fights | 2.05 | 0.82 | 1.46 | 1.33 |
| Rally Points left | 3.22 | 4.29 | 3.39 | 3.42 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 30.8 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 10.3 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 117.1 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 15.9 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.2 | 5.3 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 5.4 | 0.0 | 0.0 |
| Turns that start Engaged | 6.3 | 7.6 | 4.0 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 43.9 | 33.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 19.9 | 16.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.8 | 3.4 |
| Flanking Boons on its melee Actions | 8.1 | 4.2 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.5 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 6.0 / 16.9 | 9.0 / 0.0 | 7.5 / 48.0 | 8.6 / 60.6 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.0 / 0.0 / 0.0 | 2.9 / 2.0 / 0.2 | 2.7 / 1.7 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.59 | 0.00 | 8.11 | 8.11 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.74 | 3.86 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.45 | 2.39 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 1.93 | 1.86 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 2.81 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 19% · a PC Down during the day 100% · Downs a day 5.33 · Rally Points left at the end 44% · Health at the end 13%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 97% | 3.3 | 47% | 54% |
| 2: 1 elite, 3 standard | 79% | 4.3 | 64% | 85% |
| 3: 6 standard | 25% | 4.0 | 85% | 97% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 191.9 | 251.3 |
| Damage a turn (its own turns) | 28.3 | 31.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 26.7 | 34.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 22 | 28 |
| Turns taken | 6.7 | 7.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 82.2 | 54.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 82.2 | 54.0 |
| Damage taken a round of combat | 7.9 | 5.3 |
| Times Down | 1.49 | 1.17 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.76 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.78 | 2.55 |
| Rally Points left | 2.46 | 3.27 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 3.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 3.8 | 0.0 |
| Turns that start Engaged | 3.7 | 3.0 |
| Shots ([Ranged] Actions) | 0.0 | 31.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.1 |
| ... while Engaged (2 Banes) | 0.0 | 4.3 |
| Flanking Boons on its melee Actions | 3.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.7 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 3.8 / 10.5 | 5.7 / 34.9 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.3 / 0.7 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.00 | 5.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.36 |
| **Debuff:** Immobilized (times) | 0.00 | 1.43 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.50 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 89% · a PC Down during the day 55% · Downs a day 1.03 · Rally Points left at the end 62% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.9 | 5% | 16% |
| 2: 1 elite, 3 standard | 99% | 6.0 | 6% | 17% |
| 3: 6 standard | 90% | 7.3 | 17% | 36% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 95.4 | 450.5 |
| Damage a turn (its own turns) | 6.0 | 29.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 6.2 | 32.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | 24.3 |
| Share of the party's damage (%) | 9 | 41 |
| Turns taken | 15.8 | 15.4 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 115.1 | 68.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 44.2 | 0.8 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.9 | 0.0 |
| Damage taken | 70.9 | 67.4 |
| Damage taken a round of combat | 3.9 | 3.7 |
| Times Down | 0.19 | 0.32 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 1.00 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.80 | 1.72 |
| Rally Points used between fights | 0.57 | 0.81 |
| Rally Points left | 4.63 | 3.47 |
| **Buffs:** healed allies (Lay On Hands) | 20.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 10.6 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 81.4 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.1 | 0.0 |
| **Map:** AP spent moving | 6.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 11.0 | 5.9 |
| Shots ([Ranged] Actions) | 0.0 | 45.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.1 |
| ... while Engaged (2 Banes) | 0.0 | 3.8 |
| Flanking Boons on its melee Actions | 8.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 11.4 / 0.0 | 11.9 / 89.7 |
| AP left unspent / Guard they gave / Guard used | 0.1 / 0.0 / 0.0 | 5.2 / 4.5 / 0.4 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.55 |
| **Debuff:** Immobilized (times) | 0.00 | 3.62 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.10 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 2.92 |
