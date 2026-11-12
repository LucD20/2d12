# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/rework/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

**The rules: the book today (pack R; the ruler's default since the catch-up of 2026-11-12).** 4 AP + 1 Reaction AP (NPCs 4 + 1, Minions 3); Escalation is a level from 1 (2 with Momentum), never spent, +1 on a Critical and on the class's hook (once an encounter each); each AP still unused when the next turn starts gives Guard 2 / 3 / 4 (by Stage) for 1 round; a creature gains its Reaction AP at the start of its turn (none before its first turn of the encounter); every creature has the Opportunity Attack Reaction (an adjacent enemy that leaves a square with a Move Action or stands up); NPCs use their Specials (Round: 1 AP × 1.4, 2 AP × 2.2, 3 AP × 3.5 for an Elite's Encounter one) and Elites their Escalation and phases; the Bestiary's live tables (config.mjs); Boons and Banes are flat and cancel, Field ones up to 2, High cover Doomed, Flanking up to 2 after the cancels (calc.mjs, map.mjs); an enemy at 0 Health is out at once (the rest of that turn goes to another enemy: since 2026-11-12).

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
| 4 Standards (normal) | 4 | 4 / 3.7 / 4 | 99% | 14% | 24% | 2 | 12% | 8% | 6% | 6% | 3.5 / 18% |
| 2 Elites | 4 | 4 / 3.8 / 5 | 100% | 13% | 23% | 2 | 15% | 6% | 3% | 3% | 3.6 / 19% |
| Elite + 2 Standards | 4 | 4 / 3.7 / 4 | 100% | 13% | 22% | 2 | 11% | 7% | 6% | 4% | 3.5 / 16% |
| 8 Grunts | 4 | 4 / 3.5 / 4 | 100% | 11% | 11% | 2 | 4% | 5% | 2% | 3% | 3.5 / 9% |
| 2 Standards + 8 Minions | 4 | 3 / 3.2 / 4 | 100% | 10% | 12% | 2 | 5% | 3% | 5% | 2% | 3.6 / 24% |
| 3 Standards + 1 Ward attacker | 4 | 4 / 3.7 / 4 | 99% | 15% | 26% | 2 | 13% | 8% | 6% | 8% | 3.5 / 21% |
| 5 Standards (CV 5, hard) | 5 | 4 / 4.7 / 6 | 92% | 27% | 45% | 2 | 27% | 17% | 19% | 21% | 4.4 / 34% |
| 6 Standards (CV 6, deadly) | 6 | 5 / 5.6 / 8 | 74% | 44% | 64% | 2 | 45% | 28% | 41% | 41% | 4.9 / 55% |
| 2 Elites + 2 Standards (CV 6, deadly) | 6 | 5 / 5.8 / 8 | 81% | 38% | 60% | 2 | 41% | 26% | 35% | 29% | 5.3 / 46% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC spends every AP left after moving on attacks (3 Strikes at most): its Encounter Special once (an Elite), its Round Special once a round, then Basic attacks with the At-will Bane, choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (each Advance is an AP its attacks don't get), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover 5% Medium, 15% Low); Flanking for both sides (Field Boons: the cancels, then 2 at most); every creature's Opportunity Attack (1R: its Reaction AP, or an AP kept from its turn; a PC with a class Reaction keeps its Reaction AP for it and makes an Opportunity Attack only with an AP to spare: the better choice, see the Reactions section; a ranged PC's is a shot with Engaged's 2 Banes; ranged NPCs make none); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 1 in round 1 (2 with Momentum: in a day, after a fight harder than easy), then +1 a round (up to 3), +1 on a Critical and on the class's hook; nothing spends it: an Action with an Escalation line and a Passive work while the PC has at least their number. An Elite's Escalation: 1 in round 1, +1 a round and at each phase (Bloodied, Strained).

## Reactions in the 4 + 1 AP economy

Each row is the same 2000 fights (the same seed, every creature rolling its own dice) with one piece changed or taken away. "The rules as they are" keeps a PC's Reaction AP for its class Reaction (an Opportunity Attack only with an AP to spare). **Per PC, a fight:** the Reactions it used, the Opportunity Attacks among them and their damage, the Opportunity Attacks it took and their damage, the turn AP it left unspent and the Guard they gave / the Guard that stopped damage. The class Reactions: Rebuke (Paladin (Smite)), Shield of Faith (Paladin (Lay On Hands)), Overwatch (Archer (Double Shot)), Covering Shot (Archer (Rolling Shot)).

**4 Standards (normal)** (CV 4)

| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| The rules as they are | 3.6 | 99% | 13% | 22% | 60.0 | 1.94 | 0.00 · 0.0 | 0.00 · 0.0 | 0.32 · 0.1 · 0.0 |
| The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP) | 3.6 | 99% | 15% | 25% | 62.7 | 1.99 | 0.28 · 1.6 | 0.00 · 0.0 | 0.33 · 0.1 · 0.0 |
| No Opportunity Attack for the PCs | 3.6 | 99% | 13% | 22% | 60.0 | 1.94 | 0.00 · 0.0 | 0.00 · 0.0 | 0.32 · 0.1 · 0.0 |
| No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1) | 3.6 | 99% | 13% | 22% | 60.0 | 1.94 | 0.00 · 0.0 | 0.00 · 0.0 | 0.32 · 0.1 · 0.0 |
| No class Reaction (the PCs keep the Opportunity Attack) | 4.1 | 97% | 25% | 41% | 84.2 | 0.41 | 0.41 · 2.5 | 0.00 · 0.0 | 0.43 · 0.3 · 0.1 |
| No Reactions for the PCs | 4.2 | 98% | 23% | 39% | 85.0 | 0.00 | 0.00 · 0.0 | 0.00 · 0.0 | 0.43 · 0.3 · 0.1 |
| No Reaction AP for the PCs (a Reaction needs an AP kept from the turn) | 4.1 | 98% | 23% | 39% | 84.3 | 0.15 | 0.00 · 0.0 | 0.00 · 0.0 | 0.41 · 0.1 · 0.0 |
| A Reaction AP from the first moment of the encounter (before the first turn too) | 3.5 | 100% | 12% | 18% | 52.1 | 2.52 | 0.00 · 0.0 | 0.00 · 0.0 | 0.31 · 0.1 · 0.0 |
| No Guard from unused AP | 3.6 | 99% | 13% | 22% | 60.0 | 1.94 | 0.00 · 0.0 | 0.00 · 0.0 | 0.00 · 0.0 · 0.0 |

| Per PC, a fight (the rules as they are) | Paladin (Smite) | Paladin (Lay On Hands) | Archer (Double Shot) | Archer (Rolling Shot) |
|---|---:|---:|---:|---:|
| Turns | 3.0 | 3.0 | 3.2 | 3.1 |
| Reactions used | 1.55 | 2.09 | 1.89 | 2.25 |
| ... Opportunity Attacks | 0.00 | 0.00 | 0.00 | 0.00 |
| Damage dealt · the part that counted against Health | 84.4 | 16.0 | 96.9 | 86.2 |
| ... that counted | 76.1 | 15.3 | 85.7 | 74.7 |
| Damage its Reactions dealt | 4.4 | 0.0 | 12.0 | 16.1 |
| ... its Opportunity Attacks | 0.0 | 0.0 | 0.0 | 0.0 |
| Damage its Reactions blocked | 0.0 | 15.3 | 0.0 | 1.9 |
| Opportunity Attacks it took | 0.00 | 0.00 | 0.00 | 0.00 |
| ... their damage | 0.0 | 0.0 | 0.0 | 0.0 |
| Turn AP left unspent | 0.00 | 0.04 | 0.68 | 0.54 |
| Guard from them: given | 0.0 | 0.0 | 0.3 | 0.2 |
| ... used | 0.0 | 0.0 | 0.0 | 0.0 |
| Its Reactions' damage as a share of its damage (%) | 5 | 0 | 12 | 18 |

**6 Standards (CV 6, deadly)** (CV 6)

| | rounds | party won | Health lost | a PC goes Down | damage the party took | Reactions used | Opportunity Attacks made · their damage | Opportunity Attacks taken · their damage | AP unspent · Guard given · Guard used |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| The rules as they are | 5.6 | 74% | 45% | 67% | 142.1 | 3.17 | 0.00 · 0.0 | 0.00 · 0.0 | 0.44 · 0.3 · 0.0 |
| The PCs make every Opportunity Attack they can (the first trigger takes the Reaction AP) | 5.5 | 73% | 47% | 70% | 145.2 | 3.19 | 0.39 · 2.3 | 0.00 · 0.0 | 0.46 · 0.3 · 0.0 |
| No Opportunity Attack for the PCs | 5.6 | 74% | 45% | 67% | 142.1 | 3.17 | 0.00 · 0.0 | 0.00 · 0.0 | 0.44 · 0.3 · 0.0 |
| No Opportunity Attack for the NPCs (a ranged PC next to one Advances instead of an Evade 1) | 5.6 | 74% | 45% | 67% | 142.1 | 3.17 | 0.00 · 0.0 | 0.00 · 0.0 | 0.44 · 0.3 · 0.0 |
| No class Reaction (the PCs keep the Opportunity Attack) | 5.6 | 51% | 67% | 84% | 172.5 | 0.65 | 0.65 · 3.8 | 0.00 · 0.0 | 0.45 · 0.6 · 0.2 |
| No Reactions for the PCs | 5.8 | 51% | 66% | 84% | 178.3 | 0.00 | 0.00 · 0.0 | 0.00 · 0.0 | 0.43 · 0.6 · 0.2 |
| No Reaction AP for the PCs (a Reaction needs an AP kept from the turn) | 5.8 | 51% | 66% | 83% | 177.0 | 0.22 | 0.00 · 0.0 | 0.00 · 0.0 | 0.41 · 0.2 · 0.0 |
| A Reaction AP from the first moment of the encounter (before the first turn too) | 5.4 | 79% | 39% | 60% | 129.4 | 3.89 | 0.00 · 0.0 | 0.00 · 0.0 | 0.46 · 0.3 · 0.0 |
| No Guard from unused AP | 5.6 | 73% | 45% | 67% | 142.3 | 3.17 | 0.00 · 0.0 | 0.00 · 0.0 | 0.00 · 0.0 · 0.0 |

| Per PC, a fight (the rules as they are) | Paladin (Smite) | Paladin (Lay On Hands) | Archer (Double Shot) | Archer (Rolling Shot) |
|---|---:|---:|---:|---:|
| Turns | 3.6 | 4.4 | 4.1 | 4.0 |
| Reactions used | 2.41 | 3.71 | 3.33 | 3.23 |
| ... Opportunity Attacks | 0.00 | 0.00 | 0.00 | 0.00 |
| Damage dealt · the part that counted against Health | 107.2 | 29.2 | 126.2 | 113.7 |
| ... that counted | 97.7 | 27.9 | 112.8 | 98.4 |
| Damage its Reactions dealt | 6.8 | 0.0 | 20.7 | 21.9 |
| ... its Opportunity Attacks | 0.0 | 0.0 | 0.0 | 0.0 |
| Damage its Reactions blocked | 0.0 | 27.5 | 0.0 | 3.1 |
| Opportunity Attacks it took | 0.00 | 0.00 | 0.00 | 0.00 |
| ... their damage | 0.0 | 0.0 | 0.0 | 0.0 |
| Turn AP left unspent | 0.00 | 0.00 | 0.97 | 0.79 |
| Guard from them: given | 0.0 | 0.0 | 0.6 | 0.4 |
| ... used | 0.0 | 0.0 | 0.1 | 0.1 |
| Its Reactions' damage as a share of its damage (%) | 6 | 0 | 16 | 19 |

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 3 standard (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 5 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 92% · a PC Down during the day 68% · Downs a day 1.39 · Rally Points left at the end 57% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.8 | 8% | 9% |
| 2: 4 standard | 99% | 3.6 | 14% | 25% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 11% | 20% |
| 4: 5 standard | 93% | 4.6 | 22% | 42% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 321.9 | 63.6 | 387.1 | 347.0 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 291.8 | 60.9 | 342.6 | 304.1 |
| ... a turn (its own turns) | 25.4 | 5.0 | 27.3 | 24.5 |
| Damage a turn (its own turns) | 28.0 | 5.3 | 30.9 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 29.1 | 5.0 | 32.9 | 35.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 27.5 | - | 29.8 | 23.3 |
| Share of the party's damage (%) | 29 | 6 | 35 | 31 |
| Turns taken | 11.5 | 12.1 | 12.6 | 12.4 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 87.5 | 83.3 | 44.1 | 47.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 4.5 | 21.3 | 0.1 | 0.3 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 4.9 | 0.0 | 0.0 |
| Damage taken | 83.0 | 62.0 | 43.9 | 47.1 |
| Damage taken a round of combat | 5.7 | 4.2 | 3.0 | 3.2 |
| Times Down | 0.56 | 0.27 | 0.27 | 0.29 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.27 | 1.49 | 0.02 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 1.45 | 0.00 | 0.93 | 0.97 |
| Rally Points used between fights | 2.29 | 1.20 | 1.18 | 1.25 |
| Rally Points left | 2.99 | 4.31 | 3.87 | 3.77 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 27.7 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 12.4 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 107.7 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 13.1 | 0.0 | 0.0 |
| **Map:** AP spent moving | 7.1 | 6.9 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 7.1 | 0.0 | 0.0 |
| Turns that start Engaged | 6.2 | 6.8 | 3.5 | 4.2 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 47.3 | 36.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 21.8 | 18.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.1 | 3.5 |
| Flanking Boons on its melee Actions | 7.9 | 4.1 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.1 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.8 / 16.4 | 8.5 / 0.1 | 7.0 / 44.7 | 9.0 / 64.8 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.2 / 0.1 / 0.0 | 2.9 / 1.4 / 0.1 | 2.5 / 1.1 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.58 | 0.00 | 8.29 | 8.27 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.52 | 3.55 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.24 | 2.28 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.53 | 2.45 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.81 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 60% · a PC Down during the day 97% · Downs a day 4.12 · Rally Points left at the end 31% · Health at the end 43%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 2.3 | 27% | 23% |
| 2: 4 standard | 96% | 3.3 | 46% | 56% |
| 3: 1 elite, 2 standard | 99% | 3.2 | 39% | 56% |
| 4: 5 standard | 63% | 3.9 | 65% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 227.9 | 305.6 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 204.5 | 269.4 |
| ... a turn (its own turns) | 23.8 | 27.2 |
| Damage a turn (its own turns) | 26.5 | 30.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 26.3 | 35.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 26.5 | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 8.6 | 9.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 83.3 | 45.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 83.3 | 45.9 |
| Damage taken a round of combat | 6.8 | 3.8 |
| Times Down | 1.26 | 0.80 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.70 | 0.14 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 5.03 | 3.14 |
| Rally Points left | 1.27 | 2.72 |
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
| Turns that start Engaged | 4.2 | 2.9 |
| Shots ([Ranged] Actions) | 0.0 | 37.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.1 |
| ... while Engaged (2 Banes) | 0.0 | 4.1 |
| Flanking Boons on its melee Actions | 4.3 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.8 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.1 / 11.4 | 5.8 / 36.3 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.4 / 0.5 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.08 | 6.40 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.64 |
| **Debuff:** Immobilized (times) | 0.00 | 1.54 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.22 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 97% · a PC Down during the day 44% · Downs a day 0.64 · Rally Points left at the end 67% · Health at the end 96%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 3 standard | 100% | 3.6 | 3% | 7% |
| 2: 4 standard | 100% | 4.8 | 5% | 14% |
| 3: 1 elite, 2 standard | 100% | 4.7 | 4% | 10% |
| 4: 5 standard | 98% | 5.7 | 9% | 23% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 91.2 | 473.9 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 87.4 | 416.6 |
| ... a turn (its own turns) | 5.4 | 25.2 |
| Damage a turn (its own turns) | 5.6 | 28.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 5.7 | 33.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 5.4 | 23.7 |
| Share of the party's damage (%) | 8 | 42 |
| Turns taken | 16.2 | 16.6 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 90.9 | 52.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 27.0 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.4 | 0.0 |
| Damage taken | 63.9 | 51.9 |
| Damage taken a round of combat | 3.4 | 2.7 |
| Times Down | 0.15 | 0.17 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.84 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.82 | 1.34 |
| Rally Points used between fights | 0.66 | 0.64 |
| Rally Points left | 4.67 | 4.02 |
| **Buffs:** healed allies (Lay On Hands) | 17.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 13.1 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 70.9 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.5 | 0.0 |
| **Map:** AP spent moving | 8.3 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.4 | 0.0 |
| Turns that start Engaged | 10.1 | 5.2 |
| Shots ([Ranged] Actions) | 0.0 | 48.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 23.5 |
| ... while Engaged (2 Banes) | 0.0 | 3.6 |
| Flanking Boons on its melee Actions | 8.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.2 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 10.6 / 0.2 | 12.2 / 94.3 |
| AP left unspent / Guard they gave / Guard used | 0.2 / 0.1 / 0.0 | 5.2 / 3.7 / 0.2 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.25 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.22 |
| **Debuff:** Immobilized (times) | 0.00 | 3.31 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.94 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 5 standard (CV 5) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 3 standard (CV 5)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 91% · a PC Down during the day 68% · Downs a day 1.43 · Rally Points left at the end 55% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 11% | 10% |
| 2: 5 standard | 93% | 4.5 | 21% | 39% |
| 3: 2 elite | 100% | 3.7 | 10% | 18% |
| 4: 1 elite, 3 standard | 98% | 4.6 | 17% | 33% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 361.7 | 68.3 | 414.1 | 377.1 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 321.4 | 65.4 | 362.4 | 323.5 |
| ... a turn (its own turns) | 25.2 | 4.9 | 26.7 | 23.8 |
| Damage a turn (its own turns) | 28.4 | 5.2 | 30.6 | 27.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 29.1 | 5.1 | 31.8 | 33.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 28.2 | - | 29.7 | 23.3 |
| Share of the party's damage (%) | 30 | 6 | 34 | 31 |
| Turns taken | 12.8 | 13.3 | 13.6 | 13.5 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 100.0 | 98.7 | 55.3 | 57.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.9 | 28.1 | 0.1 | 0.5 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 7.4 | 0.0 | 0.0 |
| Damage taken | 93.1 | 70.6 | 55.1 | 57.3 |
| Damage taken a round of combat | 6.0 | 4.6 | 3.6 | 3.7 |
| Times Down | 0.54 | 0.25 | 0.33 | 0.31 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.28 | 1.65 | 0.03 | 0.03 |
| Rally Points used through an ally's Lay On Hands | 1.59 | 0.00 | 1.20 | 1.15 |
| Rally Points used between fights | 2.18 | 1.14 | 1.27 | 1.26 |
| Rally Points left | 2.96 | 4.21 | 3.50 | 3.57 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 32.2 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 11.6 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 138.7 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 15.4 | 0.0 | 0.0 |
| **Map:** AP spent moving | 7.0 | 6.9 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 7.0 | 0.0 | 0.0 |
| Turns that start Engaged | 7.5 | 7.9 | 4.3 | 5.1 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 51.5 | 39.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 24.2 | 20.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 5.7 | 3.9 |
| Flanking Boons on its melee Actions | 8.4 | 4.4 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 8.1 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 6.9 / 19.7 | 9.7 / 0.0 | 8.1 / 50.3 | 10.0 / 70.3 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.0 / 0.0 | 3.4 / 1.9 / 0.1 | 3.0 / 1.7 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.94 | 0.00 | 8.68 | 8.75 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.89 | 4.04 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.45 | 2.43 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 2.34 | 2.28 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 3.75 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 44% · a PC Down during the day 99% · Downs a day 5.01 · Rally Points left at the end 30% · Health at the end 25%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 99% | 3.1 | 49% | 38% |
| 2: 5 standard | 76% | 3.9 | 63% | 80% |
| 3: 2 elite | 100% | 3.4 | 42% | 68% |
| 4: 1 elite, 3 standard | 59% | 4.1 | 59% | 91% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 223.7 | 304.0 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 197.3 | 261.7 |
| ... a turn (its own turns) | 23.8 | 26.4 |
| Damage a turn (its own turns) | 27.2 | 30.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 26.5 | 34.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 8.2 | 9.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 89.6 | 55.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 89.6 | 55.4 |
| Damage taken a round of combat | 7.3 | 4.7 |
| Times Down | 1.49 | 1.02 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.81 | 0.19 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.64 | 3.43 |
| Rally Points left | 1.55 | 2.39 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 4.6 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 38.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.5 |
| ... while Engaged (2 Banes) | 0.0 | 5.4 |
| Flanking Boons on its melee Actions | 3.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 6.5 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 4.4 / 12.6 | 6.5 / 39.8 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.5 / 0.6 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.28 | 5.86 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.58 |
| **Debuff:** Immobilized (times) | 0.00 | 1.50 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.77 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 98% · a PC Down during the day 42% · Downs a day 0.60 · Rally Points left at the end 63% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.7 | 2% | 4% |
| 2: 5 standard | 99% | 5.7 | 8% | 21% |
| 3: 2 elite | 100% | 4.7 | 4% | 9% |
| 4: 1 elite, 3 standard | 99% | 5.8 | 6% | 16% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 104.0 | 529.1 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 99.4 | 457.2 |
| ... a turn (its own turns) | 5.4 | 24.7 |
| Damage a turn (its own turns) | 5.7 | 28.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 5.8 | 32.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 5.3 | 23.7 |
| Share of the party's damage (%) | 8 | 42 |
| Turns taken | 18.3 | 18.5 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 115.4 | 66.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 40.5 | 0.6 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.8 | 0.0 |
| Damage taken | 74.9 | 65.1 |
| Damage taken a round of combat | 3.6 | 3.1 |
| Times Down | 0.14 | 0.16 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.86 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.94 | 1.76 |
| Rally Points used between fights | 0.61 | 0.61 |
| Rally Points left | 4.60 | 3.63 |
| **Buffs:** healed allies (Lay On Hands) | 21.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 12.4 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 91.1 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Map:** AP spent moving | 8.3 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 8.4 | 0.0 |
| Turns that start Engaged | 12.2 | 6.6 |
| Shots ([Ranged] Actions) | 0.0 | 54.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 27.7 |
| ... while Engaged (2 Banes) | 0.0 | 4.2 |
| Flanking Boons on its melee Actions | 10.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 12.5 / 0.0 | 14.1 / 106.1 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 6.1 / 5.2 / 0.3 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 12.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 6.11 |
| **Debuff:** Immobilized (times) | 0.00 | 3.67 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.62 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 3.92 |

### Short hard day (normal, hard, deadly)

Fight 1: 4 standard (CV 4) · Fight 2: 1 elite, 3 standard (CV 5) · Fight 3: 6 standard (CV 6)

**Level 1, the four R builds** (paladin-smite-r1, paladin-hands-r1, archer-double-r1, archer-rolling-r1; NPCs of level 1): the day cleared 77% · a PC Down during the day 80% · Downs a day 1.98 · Rally Points left at the end 57% · Health at the end 72%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 12% | 21% |
| 2: 1 elite, 3 standard | 97% | 4.6 | 17% | 34% |
| 3: 6 standard | 80% | 5.5 | 36% | 59% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Double Shot) `archer-double-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|---:|---:|
| Damage dealt | 294.0 | 63.4 | 341.1 | 309.7 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 268.1 | 60.8 | 304.4 | 270.4 |
| ... a turn (its own turns) | 26.5 | 5.3 | 27.8 | 24.7 |
| Damage a turn (its own turns) | 29.0 | 5.6 | 31.1 | 28.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 29.3 | 5.5 | 32.5 | 33.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 28.8 | - | - | 23.7 |
| Share of the party's damage (%) | 29 | 6 | 34 | 31 |
| Turns taken | 10.2 | 11.4 | 11.0 | 11.0 |
| Health Pool | 35 | 35 | 29 | 29 |
| Damage aimed at it (before reduction) | 91.2 | 101.9 | 56.4 | 57.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.2 | 34.8 | 0.1 | 0.7 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 7.0 | 0.0 | 0.0 |
| Damage taken | 85.0 | 67.1 | 56.1 | 56.2 |
| Damage taken a round of combat | 6.4 | 5.0 | 4.2 | 4.2 |
| Times Down | 0.66 | 0.33 | 0.51 | 0.48 |
| Rally Points (of 7 / 7 / 6 / 6): used in combat (Steel Yourself) | 0.30 | 1.74 | 0.02 | 0.03 |
| Rally Points used through an ally's Lay On Hands | 1.39 | 0.00 | 1.04 | 1.10 |
| Rally Points used between fights | 2.08 | 0.81 | 1.33 | 1.26 |
| Rally Points left | 3.23 | 4.45 | 3.61 | 3.61 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 29.1 | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 0.0 | 8.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 113.4 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 15.1 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.2 | 5.3 | 0.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 5.3 | 0.0 | 0.0 |
| Turns that start Engaged | 6.1 | 7.2 | 3.9 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 42.2 | 32.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 0.0 | 0.0 |
| ... with Cover | 0.0 | 0.0 | 19.4 | 15.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 4.8 | 3.3 |
| Flanking Boons on its melee Actions | 7.1 | 3.9 | 0.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 7.2 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 5.8 / 16.6 | 8.5 / 0.0 | 7.2 / 45.1 | 8.3 / 57.3 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 0.1 / 0.0 / 0.0 | 2.8 / 1.8 / 0.1 | 2.5 / 1.4 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.59 | 0.00 | 7.33 | 7.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.34 | 3.41 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.14 | 2.10 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 0.00 | 1.84 | 1.83 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.00 | 2.82 |

**Level 1, two Smite Paladins and two Double Shot Archers** (paladin-smite-r1, paladin-smite-r1, archer-double-r1, archer-double-r1; NPCs of level 1): the day cleared 26% · a PC Down during the day 100% · Downs a day 5.11 · Rally Points left at the end 42% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 98% | 3.2 | 46% | 51% |
| 2: 1 elite, 3 standard | 83% | 4.2 | 61% | 81% |
| 3: 6 standard | 32% | 4.0 | 83% | 95% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-r1` | Archer (Double Shot) `archer-double-r1` |
|---|---:|---:|
| Damage dealt | 187.1 | 246.4 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 170.1 | 217.8 |
| ... a turn (its own turns) | 25.0 | 27.5 |
| Damage a turn (its own turns) | 27.4 | 31.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.7 | 34.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 6.8 | 7.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 81.8 | 52.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.8 | 52.6 |
| Damage taken a round of combat | 7.9 | 5.1 |
| Times Down | 1.44 | 1.12 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.79 | 0.18 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.93 | 2.63 |
| Rally Points left | 2.28 | 3.20 |
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
| Turns that start Engaged | 3.8 | 2.9 |
| Shots ([Ranged] Actions) | 0.0 | 30.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.0 |
| ... while Engaged (2 Banes) | 0.0 | 4.4 |
| Flanking Boons on its melee Actions | 3.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 5.5 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 3.8 / 10.7 | 5.5 / 34.2 |
| AP left unspent / Guard they gave / Guard used | 0.0 / 0.0 / 0.0 | 1.3 / 0.7 / 0.1 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 1.00 | 5.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.21 |
| **Debuff:** Immobilized (times) | 0.00 | 1.32 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 1.49 |

**Level 1, two Lay On Hands Paladins and two Rolling Shot Archers** (paladin-hands-r1, paladin-hands-r1, archer-rolling-r1, archer-rolling-r1; NPCs of level 1): the day cleared 92% · a PC Down during the day 54% · Downs a day 0.94 · Rally Points left at the end 64% · Health at the end 91%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.7 | 5% | 14% |
| 2: 1 elite, 3 standard | 100% | 5.9 | 7% | 21% |
| 3: 6 standard | 92% | 7.0 | 14% | 33% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-r1` | Archer (Rolling Shot) `archer-rolling-r1` |
|---|---:|---:|
| Damage dealt | 90.8 | 430.7 |
| Damage that counted (what the enemies' Health could take: not the part of a killing hit past the last point) | 87.6 | 379.8 |
| ... a turn (its own turns) | 5.7 | 25.5 |
| Damage a turn (its own turns) | 5.9 | 28.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 6.1 | 32.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 9 | 41 |
| Turns taken | 15.2 | 14.9 |
| Health Pool | 35 | 29 |
| Damage aimed at it (before reduction) | 110.7 | 62.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 41.9 | 0.7 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.8 | 0.0 |
| Damage taken | 68.8 | 61.9 |
| Damage taken a round of combat | 4.0 | 3.5 |
| Times Down | 0.19 | 0.28 |
| Rally Points (of 7 / 6): used in combat (Steel Yourself) | 0.91 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 0.79 | 1.57 |
| Rally Points used between fights | 0.64 | 0.79 |
| Rally Points left | 4.67 | 3.63 |
| **Buffs:** healed allies (Lay On Hands) | 19.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 9.4 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 78.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.4 | 0.0 |
| **Map:** AP spent moving | 6.4 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 10.4 | 5.6 |
| Shots ([Ranged] Actions) | 0.0 | 43.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.5 |
| ... while Engaged (2 Banes) | 0.0 | 3.7 |
| Flanking Boons on its melee Actions | 8.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 11.0 / 0.0 | 11.6 / 87.7 |
| AP left unspent / Guard they gave / Guard used | 0.1 / 0.1 / 0.0 | 5.1 / 4.2 / 0.3 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.32 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.10 |
| **Debuff:** Immobilized (times) | 0.00 | 3.17 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.05 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 2.92 |
