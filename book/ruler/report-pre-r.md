# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs --pre-r` from `book/ruler/classes/*.txt` and `book/ruler/fights-pre-r.txt`. Don't edit this file: edit those and run the script again.

**The rules: the book before pack R** (`--pre-r`: 5 AP, no Reaction AP, Escalation spent, the pre-R Bestiary, Opportunity Attack as a Talent), with today's dice and map rules (flat Boons and Banes, the new Favored, the Field limit, Flanking up to 2). The builds are the classes as they were before pack R-classes: this report is kept for the pre-R studies (prices.md, positions.json, bestiary.md, progression.md, rework.md).

## Archer (ranged damage), `classes/archer-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Lock & Loose + attack (plan) | 0 | 26.1 | 24.3 | 22.4 | 27.2 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.1 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 41.3 | 38.5 | 35.5 | 38.5 | 5 | 3 | Double Shot 3, Twin Shot, Lock & Loose |  |
| Reload Shot | 0 | 28.9 | 27.3 | 25.4 | 30.1 | 5 | 3 | Double Shot 3, Weapon Attack, Lock & Loose (reload shot) |  |
| Reload and shoot | 0 | 16.4 | 15.6 | 14.8 | 17.9 | 5 | 2 | Reload, Double Shot 3, Lock & Loose (reload shot) |  |
| Steel | 0 | 13.9 | 13.0 | 12.0 | 15.9 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 20.1 | 18.8 | 17.5 | 21.7 | 5 | 2 | advance, Double Shot 3, Lock & Loose |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Lock & Loose + attack · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.1 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 5.8 | 2 / 2.2 |

## Archer (ranged damage), `classes/archer-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 29.0 | 27.0 | 25.0 | 30.0 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.1 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.2 | 40.9 | 37.5 | 40.9 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 12.0 | 15.9 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.9 | 21.3 | 19.5 | 24.1 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.2 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.4 |
| Elite | 132 | 14 | 3 | 16.9 | 5 / 5.5 | 2 / 2.3 |

## Archer (ranged damage), `classes/archer-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 29.0 | 27.0 | 25.0 | 30.0 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.1 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.2 | 40.9 | 37.5 | 40.9 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 12.0 | 15.9 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.9 | 21.3 | 19.5 | 24.1 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.9 | 5 / 5.5 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.2 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan, **best**) | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Kite | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.6 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 5.8 | 2 / 2.2 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.2 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.1 | 28.2 | 33.6 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Kite | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.8 | 3 / 3.4 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 5.6 | 2 / 2.3 |

## Archer (Double Shot, options) (ranged damage), `classes/archer-double-3-options.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.2 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 3 | 32.8 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Nova | 0 | 21.2 | 20.5 | 19.6 | 23.1 | 5 | 1 | Volley, Double Shot 3 |  |
| Focus (**best**) | 0 | 34.1 | 32.6 | 31.0 | 36.0 | 5 | 3 | Deadeye, Double Shot 3, Lock & Loose |  |
| Kite | 3 | 32.8 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.2 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 5.6 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 26.6 | 25.2 | 23.7 | 27.9 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.1 | 28.2 | 33.6 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Focus | 0 | 23.7 | 22.6 | 21.5 | 26.3 | 5 | 2 | Hunter's Focus, Double Shot 3, Lock & Loose |  |
| Kite | 2 | 29.8 | 28.3 | 26.7 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 3 / 3.6 |
| Elite | 132 | 14 | 3 | 16.9 | 5 / 5.0 | 2 / 2.4 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan, **best**) | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.7 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.1 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 6.0 | 2 / 2.2 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.3 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.9 | 6 / 5.8 | 2 / 2.3 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.3 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Focus | 0 | 23.4 | 22.4 | 21.3 | 26.1 | 5 | 2 | Hunter's Focus, Rolling Shot 3, Lock & Loose |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.9 | 5 / 5.0 | 2 / 2.4 |

## Paladin (book) (tank / support), `classes/paladin-book-1.txt`

Health 36 (Body 21 + Mind 15) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Smite and two attacks | 0 | 24.2 | 22.4 | 20.6 | 22.4 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and two attacks | 0 | 26.5 | 24.7 | 22.9 | 24.7 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Surge Smite 3 (plan, **best**) | 1 | 30.9 | 29.2 | 27.4 | 29.2 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Radiance opening (plan) | 0 | 25.9 | 24.5 | 23.0 | 24.5 | 5 | 2 | Word of Radiance 2, Smite 2, Weapon Attack |  |
| Surge | 1 | 28.7 | 26.9 | 25.1 | 26.9 | 4 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack |  |
| Heal (when an ally is hurt) | 1 | 23.4 | 22.1 | 20.8 | 22.1 | 4 | 2 | Lay On Hands 1, Divine Surge, Smite 2, Weapon Attack |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.7 | 19.1 | 18.3 | 19.1 | 5 | 1 | Steel Yourself 2, Divine Surge, Smite 3 |  |

Plan: round 1: Radiance opening · round 2+: Surge Smite 3 · when an ally is below 50% Health: Heal · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 28 / 27.8 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.6 | 10 / 10.6 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 5 / 5.4 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.5 | 3 / 3.1 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 27.6 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.7 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 4 / 4.0 | 6 / 6.0 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 9.8 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 27.6 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.7 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 4 / 4.0 | 6 / 6.5 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 9.8 | 4 / 3.8 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 17.8 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 29.1 | 27.6 | 26.2 | 31.3 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 5.8 | 5.3 | 4.8 | 7.8 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 36 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.9 | 14 / 13.8 |
| Standard | 63 | 13 | 2 | 9.2 | 5 / 4.7 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 10 / 10.5 | 4 / 4.0 |

## Paladin (Smite, hold) (tank / support), `classes/paladin-smite-1-hold.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge (keep 2), Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge (keep 2), Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge (keep 2), Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge (keep 2), Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 5.9 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite, options) (tank / support), `classes/paladin-smite-1-options.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan, **best**) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Aura of Protection, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Nova (plan) | 0 | 24.2 | 22.9 | 21.7 | 22.9 | 5 | 1 | Word of Radiance 3, Smite 2 |  |
| Steel | 0 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.8 | 11 / 11.6 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.2 | 6 / 5.9 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.5 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 5.9 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 24.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 22.5 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 40.0 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 17.8 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 12.9 |
| Standard | 63 | 13 | 2 | 9.2 | 2 / 2.5 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 5.8 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 26.4 | 24.3 | 22.3 | 27.9 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 26.4 | 24.3 | 22.3 | 27.9 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 24.5 | 22.5 | 20.6 | 26.0 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 42.5 | 40.0 | 37.7 | 43.7 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 17.8 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 19.2 | 17.8 | 16.3 | 21.2 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 19.2 | 17.8 | 16.3 | 21.2 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 35 / 35.8 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 14 / 13.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.0 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight before pack R (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 4 / 4.0 / 5 | 99% | 20% | 26% | 2 | 5% | 8% | 9% | 10% | 3.3 / 17% |
| 2 Elites | 4 | 4 / 4.2 / 5 | 99% | 22% | 31% | 2 | 5% | 8% | 13% | 14% | 3.3 / 17% |
| Elite + 2 Standards | 4 | 4 / 4.0 / 5 | 100% | 19% | 25% | 2 | 4% | 7% | 11% | 8% | 3.3 / 15% |
| 8 Grunts | 4 | 4 / 4.1 / 5 | 100% | 17% | 9% | 2 | 1% | 2% | 3% | 4% | 3.7 / 19% |
| 2 Standards + 8 Minions | 4 | 4 / 4.0 / 4 | 100% | 12% | 11% | 2 | 1% | 2% | 6% | 3% | 3.7 / 16% |
| 6 Standards (CV 6, hard) | 6 | 6 / 6.0 / 8 | 66% | 60% | 75% | 2 | 40% | 47% | 55% | 56% | 5.4 / 45% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Vigor and Resolve together; Bloodied and Strained are followed for the hooks and the Elite's phases); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range and for shooting while Engaged (no name), Field Banes (up to 2 together) for shooting into melee, a Prone target and Cover (Low 1, Medium 2; High cover: Doomed; a creature in the line is Low cover; the map's own cover 5% Medium, 15% Low); Flanking for both sides (Field Boons: the cancels, then 2 at most); Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 11% · a PC Down during the day 100% · Downs a day 5.05 · Rally Points left at the end 27% · Health at the end 6%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 23% | 10% |
| 2: 4 standard | 94% | 4.0 | 43% | 50% |
| 3: 1 elite, 2 standard | 96% | 3.9 | 39% | 54% |
| 4: 2 elite, 2 standard | 12% | 4.5 | 80% | 99% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 270.7 | 235.4 |
| Damage a turn (its own turns) | 25.6 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.6 | 11.2 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 97.5 | 60.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.2 | 60.9 |
| Damage taken a round of combat | 6.6 | 4.2 |
| Times Down | 1.28 | 1.25 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.26 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 1.43 | 1.73 |
| Rally Points used between fights | 3.66 | 2.82 |
| Rally Points left | 1.64 | 2.41 |
| **Buffs:** healed allies (Lay On Hands) | 25.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.5 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 3.9 | 0.0 |
| Turns that start Engaged | 6.6 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 39.9 |
| ... into melee (1 Bane) | 0.0 | 24.4 |
| ... with Cover | 0.0 | 17.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.2 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.74 | 5.84 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.06 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.66 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Prone (times) | 0.74 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.81 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 60% · a PC Down during the day 97% · Downs a day 3.59 · Rally Points left at the end 34% · Health at the end 50%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 23% | 14% |
| 2: 4 standard | 99% | 3.8 | 38% | 43% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 31% | 40% |
| 4: 2 elite, 2 standard | 61% | 5.9 | 70% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 339.4 | 245.1 |
| Damage a turn (its own turns) | 26.4 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.0 | 11.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 115.4 | 53.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.2 | 53.9 |
| Damage taken a round of combat | 5.0 | 3.4 |
| Times Down | 0.68 | 1.12 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.30 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.98 | 4.30 |
| Rally Points left | 2.71 | 2.36 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 20.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 35.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.0 | 0.0 |
| **Map:** AP spent moving | 6.5 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.2 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 42.0 |
| ... into melee (1 Bane) | 0.0 | 27.9 |
| ... with Cover | 0.0 | 19.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 11.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.87 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.69 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 61% · a PC Down during the day 98% · Downs a day 3.73 · Rally Points left at the end 30% · Health at the end 49%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 24% | 15% |
| 2: 4 standard | 99% | 3.9 | 39% | 45% |
| 3: 1 elite, 2 standard | 99% | 3.7 | 35% | 45% |
| 4: 2 elite, 2 standard | 62% | 6.3 | 70% | 91% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 346.2 | 248.8 |
| Damage a turn (its own turns) | 26.4 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.2 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.3 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 121.8 | 55.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.5 | 0.0 |
| Damage taken | 86.8 | 55.3 |
| Damage taken a round of combat | 5.3 | 3.4 |
| Times Down | 0.69 | 1.18 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.60 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.17 | 4.42 |
| Rally Points left | 2.23 | 2.24 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 6.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 20.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.6 | 0.0 |
| **Map:** AP spent moving | 6.4 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 8.6 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 42.5 |
| ... into melee (1 Bane) | 0.0 | 28.2 |
| ... with Cover | 0.0 | 19.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.3 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.96 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.75 |
| **Debuff:** Immobilized (times) | 0.00 | 2.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.87 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 83% · a PC Down during the day 70% · Downs a day 1.57 · Rally Points left at the end 29% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.2 | 3% | 4% |
| 2: 4 standard | 100% | 4.4 | 8% | 18% |
| 3: 1 elite, 2 standard | 100% | 4.3 | 7% | 16% |
| 4: 2 elite, 2 standard | 83% | 6.8 | 32% | 55% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 235.3 | 336.4 |
| Damage a turn (its own turns) | 14.8 | 21.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.3 | 23.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 16.0 | 15.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 140.2 | 70.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 97.3 | 70.8 |
| Damage taken a round of combat | 5.2 | 3.8 |
| Times Down | 0.28 | 0.50 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.52 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.70 | 3.63 |
| Rally Points used between fights | 0.53 | 1.19 |
| Rally Points left | 2.25 | 2.17 |
| **Buffs:** healed allies (Lay On Hands) | 51.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 33.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 45.6 | 0.0 |
| Guard given (damage it took instead of Health) | 42.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.4 | 0.0 |
| **Map:** AP spent moving | 7.5 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.5 | 0.0 |
| Turns that start Engaged | 10.6 | 5.3 |
| Shots ([Ranged] Actions) | 0.0 | 57.1 |
| ... into melee (1 Bane) | 0.0 | 41.7 |
| ... with Cover | 0.0 | 26.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 14.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.50 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.40 |
| **Debuff:** Immobilized (times) | 0.00 | 3.10 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.82 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 70% · a PC Down during the day 84% · Downs a day 2.44 · Rally Points left at the end 35% · Health at the end 60%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 9% | 5% |
| 2: 4 standard | 99% | 4.0 | 20% | 24% |
| 3: 1 elite, 2 standard | 100% | 3.9 | 14% | 22% |
| 4: 2 elite, 2 standard | 71% | 6.2 | 51% | 76% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 376.5 | 203.9 | 287.1 |
| Damage a turn (its own turns) | 26.3 | 15.2 | 21.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 12.2 | 23.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - | - |
| Share of the party's damage (%) | 33 | 18 | 25 |
| Turns taken | 14.4 | 13.6 | 13.3 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 129.5 | 119.3 | 62.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 88.9 | 84.1 | 62.2 |
| Damage taken a round of combat | 5.3 | 5.0 | 3.7 |
| Times Down | 0.42 | 0.54 | 0.74 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.58 | 3.78 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 2.69 | 0.00 | 2.20 |
| Rally Points used between fights | 1.37 | 2.16 | 2.15 |
| Rally Points left | 3.37 | 2.07 | 2.61 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 57.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 24.1 | 27.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 52.3 | 0.0 |
| Guard given (damage it took instead of Health) | 40.6 | 35.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.1 | 0.0 | 0.0 |
| **Map:** AP spent moving | 6.8 | 6.8 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 6.8 | 0.0 |
| Turns that start Engaged | 9.5 | 8.6 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 48.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 34.0 |
| ... with Cover | 0.0 | 0.0 | 22.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 13.2 | 11.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 7.09 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.48 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.84 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 93% · Downs a day 2.88 · Rally Points left at the end 38% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 22% | 10% |
| 2: 4 standard | 100% | 3.6 | 34% | 34% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 29% | 32% |
| 4: 2 elite, 2 standard | 73% | 6.0 | 63% | 84% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 343.5 | 264.2 |
| Damage a turn (its own turns) | 26.3 | 22.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.2 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 115.5 | 54.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.6 | 54.2 |
| Damage taken a round of combat | 5.1 | 3.4 |
| Times Down | 0.48 | 0.96 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.34 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.98 | 4.24 |
| Rally Points left | 3.68 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 21.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.2 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.4 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 42.5 |
| ... into melee (1 Bane) | 0.0 | 29.1 |
| ... with Cover | 0.0 | 19.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.67 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.18 |
| **Debuff:** Hindered (times) | 0.00 | 2.16 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.97 |
| **Debuff:** Immobilized (times) | 0.00 | 0.54 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.90 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 91% · a PC Down during the day 56% · Downs a day 1.04 · Rally Points left at the end 37% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.2 | 3% | 2% |
| 2: 4 standard | 100% | 4.3 | 6% | 13% |
| 3: 1 elite, 2 standard | 100% | 4.1 | 5% | 10% |
| 4: 2 elite, 2 standard | 91% | 6.6 | 22% | 44% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 232.3 | 357.5 |
| Damage a turn (its own turns) | 14.7 | 23.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.1 | 25.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 15.9 | 15.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 134.8 | 70.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 94.1 | 70.6 |
| Damage taken a round of combat | 5.2 | 3.9 |
| Times Down | 0.16 | 0.37 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.38 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.53 | 3.71 |
| Rally Points used between fights | 0.43 | 1.03 |
| Rally Points left | 3.67 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 56.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 33.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 45.5 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.8 | 0.0 |
| **Map:** AP spent moving | 7.7 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.7 | 0.0 |
| Turns that start Engaged | 10.3 | 5.3 |
| Shots ([Ranged] Actions) | 0.0 | 56.8 |
| ... into melee (1 Bane) | 0.0 | 42.0 |
| ... with Cover | 0.0 | 26.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 15.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.56 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.13 |
| **Debuff:** Hindered (times) | 0.00 | 3.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.94 |
| **Debuff:** Immobilized (times) | 0.00 | 0.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 84% · Downs a day 1.61 · Rally Points left at the end 46% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 7% |
| 2: 4 standard | 100% | 3.5 | 32% | 26% |
| 3: 1 elite, 2 standard | 100% | 3.2 | 22% | 19% |
| 4: 2 elite, 2 standard | 97% | 5.4 | 42% | 67% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 361.0 | 268.1 |
| Damage a turn (its own turns) | 28.2 | 22.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.8 | 24.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.2 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 12.9 | 11.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 102.1 | 48.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 7.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.7 | 0.0 |
| Damage taken | 64.8 | 48.6 |
| Damage taken a round of combat | 4.3 | 3.2 |
| Times Down | 0.17 | 0.64 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.73 | 0.26 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.58 | 4.68 |
| Rally Points left | 4.69 | 3.05 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 20.9 | 0.0 |
| Banes given (damage its areas stopped) | 3.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.8 | 0.0 |
| Guard given (damage it took instead of Health) | 29.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.8 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.0 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 42.5 |
| ... into melee (1 Bane) | 0.0 | 29.6 |
| ... with Cover | 0.0 | 19.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.71 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.20 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.96 |
| **Debuff:** Immobilized (times) | 0.00 | 0.55 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 100% · a PC Down during the day 32% · Downs a day 0.38 · Rally Points left at the end 49% · Health at the end 97%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.1 | 3% | 1% |
| 2: 4 standard | 100% | 4.2 | 4% | 6% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 3% | 6% |
| 4: 2 elite, 2 standard | 100% | 5.9 | 7% | 22% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 243.8 | 354.6 |
| Damage a turn (its own turns) | 16.1 | 23.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 13.9 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 21.9 | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 15.2 | 15.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.3 | 66.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 8.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.1 | 0.0 |
| Damage taken | 75.4 | 66.3 |
| Damage taken a round of combat | 4.4 | 3.9 |
| Times Down | 0.03 | 0.16 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.74 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.01 | 3.90 |
| Rally Points used between fights | 0.23 | 0.78 |
| Rally Points left | 5.01 | 3.32 |
| **Buffs:** healed allies (Lay On Hands) | 53.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 32.0 | 0.0 |
| Banes given (damage its areas stopped) | 4.7 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 41.5 | 0.0 |
| Guard given (damage it took instead of Health) | 35.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.4 | 0.0 |
| **Map:** AP spent moving | 7.5 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 7.5 | 0.0 |
| Turns that start Engaged | 9.7 | 5.3 |
| Shots ([Ranged] Actions) | 0.0 | 56.0 |
| ... into melee (1 Bane) | 0.0 | 41.4 |
| ... with Cover | 0.0 | 25.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 13.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.44 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.14 |
| **Debuff:** Hindered (times) | 0.00 | 2.97 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.94 |
| **Debuff:** Immobilized (times) | 0.00 | 0.53 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 71% · a PC Down during the day 94% · Downs a day 2.96 · Rally Points left at the end 35% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 22% | 11% |
| 2: 4 standard | 100% | 3.5 | 34% | 36% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 28% | 33% |
| 4: 2 elite, 2 standard | 71% | 5.9 | 63% | 83% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 330.9 | 272.4 |
| Damage a turn (its own turns) | 26.5 | 23.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 23.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.6 | 11.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 106.0 | 49.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 73.5 | 49.2 |
| Damage taken a round of combat | 4.7 | 3.2 |
| Times Down | 0.54 | 0.94 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.20 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.18 |
| Rally Points left | 2.86 | 2.46 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.2 | 0.0 |
| Turns that start Engaged | 7.8 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 44.9 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 11.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.90 |
| **Debuff:** Immobilized (times) | 0.00 | 3.11 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.59 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 74% · a PC Down during the day 92% · Downs a day 2.75 · Rally Points left at the end 36% · Health at the end 64%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 23% | 11% |
| 2: 4 standard | 100% | 3.5 | 33% | 33% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 27% | 28% |
| 4: 2 elite, 2 standard | 74% | 6.1 | 61% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 339.5 | 284.6 |
| Damage a turn (its own turns) | 26.2 | 24.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.5 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.1 | 11.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 105.3 | 47.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 72.5 | 47.4 |
| Damage taken a round of combat | 4.5 | 3.0 |
| Times Down | 0.49 | 0.88 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.19 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.99 | 4.09 |
| Rally Points left | 2.82 | 2.54 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 19.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.9 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 8.0 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 34.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 12.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.20 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.18 |
| **Debuff:** Immobilized (times) | 0.00 | 3.29 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.73 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 82% · a PC Down during the day 89% · Downs a day 2.31 · Rally Points left at the end 41% · Health at the end 74%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 20% | 7% |
| 2: 4 standard | 100% | 3.4 | 31% | 28% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 26% | 27% |
| 4: 2 elite, 2 standard | 82% | 5.9 | 56% | 77% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 334.8 | 284.6 |
| Damage a turn (its own turns) | 26.6 | 24.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.0 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.7 | 11.5 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 103.3 | 49.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.9 | 49.4 |
| Damage taken a round of combat | 4.7 | 3.2 |
| Times Down | 0.37 | 0.78 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.14 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.83 | 4.07 |
| Rally Points left | 4.03 | 2.54 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 21.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.5 | 0.0 |
| **Map:** AP spent moving | 6.4 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 7.9 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 42.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 11.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.52 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.65 |
| **Debuff:** Immobilized (times) | 0.00 | 2.27 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.78 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 87% · a PC Down during the day 85% · Downs a day 2.03 · Rally Points left at the end 41% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 21% | 9% |
| 2: 4 standard | 100% | 3.4 | 30% | 26% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 25% | 24% |
| 4: 2 elite, 2 standard | 87% | 5.8 | 53% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 342.6 | 297.0 |
| Damage a turn (its own turns) | 26.3 | 25.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.7 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.1 | 11.8 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 100.8 | 47.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 69.6 | 47.1 |
| Damage taken a round of combat | 4.5 | 3.0 |
| Times Down | 0.30 | 0.71 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.10 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.90 | 4.03 |
| Rally Points left | 4.00 | 2.60 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 20.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 31.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.3 | 0.0 |
| **Map:** AP spent moving | 7.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 7.9 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 31.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 15.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 13.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.03 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.83 |
| **Debuff:** Immobilized (times) | 0.00 | 2.43 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.77 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.77 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 71% · Downs a day 1.16 · Rally Points left at the end 52% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.8 | 19% | 6% |
| 2: 4 standard | 100% | 3.3 | 28% | 19% |
| 3: 1 elite, 2 standard | 100% | 3.0 | 20% | 15% |
| 4: 2 elite, 2 standard | 99% | 4.9 | 36% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 340.7 | 298.4 |
| Damage a turn (its own turns) | 28.4 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.9 | 25.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.9 | 28.7 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.1 | 11.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 87.6 | 42.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.6 | 0.0 |
| Damage taken | 55.8 | 42.4 |
| Damage taken a round of combat | 4.0 | 3.0 |
| Times Down | 0.11 | 0.47 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.55 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.24 | 4.17 |
| Rally Points left | 5.21 | 3.55 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 20.7 | 0.0 |
| Banes given (damage its areas stopped) | 3.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 25.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.2 | 0.0 |
| **Map:** AP spent moving | 6.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 7.2 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 40.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 19.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 11.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.55 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.35 |
| **Debuff:** Immobilized (times) | 0.00 | 2.19 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.02 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.02 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 70% · Downs a day 1.12 · Rally Points left at the end 52% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 7% |
| 2: 4 standard | 100% | 3.3 | 27% | 20% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 19% | 14% |
| 4: 2 elite, 2 standard | 99% | 4.9 | 34% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 347.0 | 311.0 |
| Damage a turn (its own turns) | 28.2 | 27.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 23.8 | 25.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.7 | 29.9 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.4 | 11.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 84.6 | 42.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 6.1 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.7 | 0.0 |
| Damage taken | 53.7 | 42.2 |
| Damage taken a round of combat | 3.8 | 3.0 |
| Times Down | 0.09 | 0.47 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.49 | 0.28 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.16 | 4.16 |
| Rally Points left | 5.35 | 3.56 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 3.0 |
| Divine Surge given (extra damage dealt by allies) | 19.0 | 0.0 |
| Banes given (damage its areas stopped) | 3.3 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.3 | 0.0 |
| Guard given (damage it took instead of Health) | 24.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 2.9 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 7.2 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 29.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 12.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.91 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (times) | 0.00 | 2.31 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.16 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.03 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 1% · a PC Down during the day 100% · Downs a day 4.77 · Rally Points left at the end 49% · Health at the end 0%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 99% | 3.8 | 40% | 20% |
| 2: 6 standard | 26% | 4.7 | 83% | 94% |
| 3: 2 elite | 87% | 4.2 | 48% | 78% |
| 4: 1 elite, 4 standard | 4% | 3.0 | 59% | 100% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 187.4 | 159.6 |
| Damage a turn (its own turns) | 25.8 | 20.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 21.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 7.3 | 7.7 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 82.2 | 54.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.6 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.6 | 54.2 |
| Damage taken a round of combat | 8.2 | 5.6 |
| Times Down | 1.18 | 1.20 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.27 | 0.06 |
| Rally Points used through an ally's Lay On Hands | 1.10 | 1.48 |
| Rally Points used between fights | 2.02 | 1.77 |
| Rally Points left | 3.60 | 3.70 |
| **Buffs:** healed allies (Lay On Hands) | 20.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 2.7 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 1.8 | 0.0 |
| Turns that start Engaged | 5.4 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 26.5 |
| ... into melee (1 Bane) | 0.0 | 14.8 |
| ... with Cover | 0.0 | 12.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 4.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.46 | 4.31 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.07 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.66 |
| **Debuff:** Immobilized (times) | 0.00 | 1.65 |
| **Debuff:** Prone (times) | 0.46 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.44 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 30% · a PC Down during the day 100% · Downs a day 4.83 · Rally Points left at the end 40% · Health at the end 20%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 41% | 33% |
| 2: 6 standard | 62% | 5.7 | 69% | 87% |
| 3: 2 elite | 99% | 3.7 | 34% | 50% |
| 4: 1 elite, 4 standard | 49% | 5.6 | 71% | 91% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 317.1 | 208.4 |
| Damage a turn (its own turns) | 26.3 | 20.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 21.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.3 | 10.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 132.9 | 60.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 87.8 | 60.9 |
| Damage taken a round of combat | 6.1 | 4.2 |
| Times Down | 0.93 | 1.49 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.51 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.21 | 3.93 |
| Rally Points left | 3.28 | 2.73 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 18.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 45.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.4 | 4.4 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 0.0 |
| Turns that start Engaged | 9.0 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 35.1 |
| ... into melee (1 Bane) | 0.0 | 22.0 |
| ... with Cover | 0.0 | 16.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 8.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.38 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.43 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.39 |
| **Debuff:** Immobilized (times) | 0.00 | 1.99 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 35% · a PC Down during the day 100% · Downs a day 4.85 · Rally Points left at the end 36% · Health at the end 22%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 42% | 33% |
| 2: 6 standard | 64% | 6.2 | 69% | 89% |
| 3: 2 elite | 98% | 3.9 | 38% | 51% |
| 4: 1 elite, 4 standard | 54% | 5.9 | 69% | 93% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 332.0 | 216.3 |
| Damage a turn (its own turns) | 26.2 | 20.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 21.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.6 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.9 | 10.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 144.5 | 62.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 24.1 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.5 | 0.0 |
| Damage taken | 93.1 | 62.4 |
| Damage taken a round of combat | 6.1 | 4.1 |
| Times Down | 0.91 | 1.52 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.79 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.42 | 4.10 |
| Rally Points left | 2.79 | 2.55 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 6.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 27.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.5 | 0.0 |
| **Map:** AP spent moving | 4.4 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 0.0 |
| Turns that start Engaged | 9.7 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 36.4 |
| ... into melee (1 Bane) | 0.0 | 22.7 |
| ... with Cover | 0.0 | 17.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 8.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.55 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.45 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (times) | 0.00 | 2.11 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 62% · a PC Down during the day 81% · Downs a day 2.62 · Rally Points left at the end 22% · Health at the end 49%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.4 | 3% | 3% |
| 2: 6 standard | 87% | 6.4 | 24% | 45% |
| 3: 2 elite | 99% | 4.5 | 11% | 26% |
| 4: 1 elite, 4 standard | 72% | 6.6 | 43% | 66% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 260.3 | 351.2 |
| Damage a turn (its own turns) | 15.2 | 21.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.9 | 22.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 17.3 | 16.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 177.5 | 93.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 117.9 | 93.9 |
| Damage taken a round of combat | 6.0 | 4.7 |
| Times Down | 0.52 | 0.79 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.91 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.96 | 4.27 |
| Rally Points used between fights | 0.45 | 1.13 |
| Rally Points left | 1.68 | 1.59 |
| **Buffs:** healed allies (Lay On Hands) | 58.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 37.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 59.0 | 0.0 |
| Guard given (damage it took instead of Health) | 59.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 15.4 | 0.0 |
| **Map:** AP spent moving | 6.4 | 7.2 |
| AP lost to moving (Actions dropped or made smaller) | 6.4 | 0.0 |
| Turns that start Engaged | 12.8 | 7.4 |
| Shots ([Ranged] Actions) | 0.0 | 58.9 |
| ... into melee (1 Bane) | 0.0 | 41.6 |
| ... with Cover | 0.0 | 27.6 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 13.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.38 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.64 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.99 |
| **Debuff:** Immobilized (times) | 0.00 | 3.39 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.63 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 47% · a PC Down during the day 95% · Downs a day 3.58 · Rally Points left at the end 34% · Health at the end 34%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 16% | 9% |
| 2: 6 standard | 74% | 6.0 | 47% | 68% |
| 3: 2 elite | 100% | 4.0 | 17% | 31% |
| 4: 1 elite, 4 standard | 63% | 6.1 | 54% | 79% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 391.0 | 208.4 | 274.1 |
| Damage a turn (its own turns) | 26.4 | 15.5 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.9 | 12.7 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 37.3 | - | - |
| Share of the party's damage (%) | 34 | 18 | 24 |
| Turns taken | 15.0 | 13.7 | 12.9 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 154.9 | 142.3 | 76.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 100.2 | 95.6 | 76.7 |
| Damage taken a round of combat | 6.0 | 5.8 | 4.6 |
| Times Down | 0.63 | 0.80 | 1.08 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.83 | 4.07 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 2.57 | 0.00 | 2.39 |
| Rally Points used between fights | 1.22 | 1.87 | 2.23 |
| Rally Points left | 3.39 | 2.06 | 2.34 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 58.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 27.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 58.9 | 0.0 |
| Guard given (damage it took instead of Health) | 54.8 | 46.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 21.0 | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.4 | 5.1 | 5.7 |
| AP lost to moving (Actions dropped or made smaller) | 5.4 | 5.1 | 0.0 |
| Turns that start Engaged | 11.1 | 10.1 | 5.8 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 46.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 30.9 |
| ... with Cover | 0.0 | 0.0 | 21.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 11.6 | 9.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 7.27 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.56 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.57 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.69 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.60 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 52% · a PC Down during the day 99% · Downs a day 4.11 · Rally Points left at the end 37% · Health at the end 41%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 38% | 26% |
| 2: 6 standard | 75% | 5.9 | 62% | 81% |
| 3: 2 elite | 100% | 3.6 | 31% | 41% |
| 4: 1 elite, 4 standard | 69% | 5.9 | 63% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 351.4 | 251.3 |
| Damage a turn (its own turns) | 26.1 | 22.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 23.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.7 | 11.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 141.1 | 66.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 92.9 | 66.4 |
| Damage taken a round of combat | 5.9 | 4.2 |
| Times Down | 0.69 | 1.37 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.67 | 0.42 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.69 | 4.38 |
| Rally Points left | 3.64 | 2.20 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 21.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.7 | 0.0 |
| **Map:** AP spent moving | 5.2 | 4.7 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 9.9 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 39.5 |
| ... into melee (1 Bane) | 0.0 | 25.7 |
| ... with Cover | 0.0 | 18.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.14 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.61 |
| **Debuff:** Hindered (times) | 0.00 | 2.22 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.60 |
| **Debuff:** Immobilized (times) | 0.00 | 0.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.61 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 81% · a PC Down during the day 70% · Downs a day 1.65 · Rally Points left at the end 25% · Health at the end 71%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 2% | 1% |
| 2: 6 standard | 94% | 6.2 | 16% | 34% |
| 3: 2 elite | 100% | 4.3 | 7% | 14% |
| 4: 1 elite, 4 standard | 86% | 6.5 | 28% | 51% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 269.9 | 397.1 |
| Damage a turn (its own turns) | 15.0 | 23.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.8 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 18.1 | 17.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 177.4 | 95.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 117.7 | 95.8 |
| Damage taken a round of combat | 5.8 | 4.7 |
| Times Down | 0.27 | 0.56 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.90 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 3.01 | 4.59 |
| Rally Points used between fights | 0.41 | 1.03 |
| Rally Points left | 2.68 | 1.37 |
| **Buffs:** healed allies (Lay On Hands) | 68.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 38.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 61.6 | 0.0 |
| Guard given (damage it took instead of Health) | 59.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.0 | 0.0 |
| **Map:** AP spent moving | 7.0 | 7.4 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 13.1 | 7.6 |
| Shots ([Ranged] Actions) | 0.0 | 62.1 |
| ... into melee (1 Bane) | 0.0 | 44.8 |
| ... with Cover | 0.0 | 29.1 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 14.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.60 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.75 |
| **Debuff:** Hindered (times) | 0.00 | 3.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.65 |
| **Debuff:** Immobilized (times) | 0.00 | 0.38 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.68 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 92% · a PC Down during the day 93% · Downs a day 2.63 · Rally Points left at the end 34% · Health at the end 81%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 36% | 19% |
| 2: 6 standard | 95% | 5.5 | 44% | 66% |
| 3: 2 elite | 100% | 3.3 | 25% | 28% |
| 4: 1 elite, 4 standard | 97% | 5.3 | 46% | 69% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 430.7 | 289.7 |
| Damage a turn (its own turns) | 28.5 | 22.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.0 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.4 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 15.2 | 12.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 139.6 | 67.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 13.8 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 79.0 | 66.9 |
| Damage taken a round of combat | 4.6 | 3.9 |
| Times Down | 0.24 | 1.07 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.05 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.02 | 5.85 |
| Rally Points left | 3.94 | 1.77 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 24.9 | 0.0 |
| Banes given (damage its areas stopped) | 2.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.8 | 0.0 |
| Guard given (damage it took instead of Health) | 46.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.2 | 5.1 |
| AP lost to moving (Actions dropped or made smaller) | 6.2 | 0.0 |
| Turns that start Engaged | 10.7 | 5.2 |
| Shots ([Ranged] Actions) | 0.0 | 44.8 |
| ... into melee (1 Bane) | 0.0 | 30.4 |
| ... with Cover | 0.0 | 21.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.55 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.80 |
| **Debuff:** Hindered (times) | 0.00 | 2.46 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.72 |
| **Debuff:** Immobilized (times) | 0.00 | 0.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.69 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 44% · Downs a day 0.68 · Rally Points left at the end 36% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.3 | 2% | 1% |
| 2: 6 standard | 99% | 5.8 | 8% | 21% |
| 3: 2 elite | 100% | 3.9 | 4% | 7% |
| 4: 1 elite, 4 standard | 99% | 5.7 | 10% | 26% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 296.9 | 405.6 |
| Damage a turn (its own turns) | 16.8 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 15.0 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 17.7 | 17.0 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 163.6 | 91.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 15.5 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.2 | 0.0 |
| Damage taken | 94.4 | 91.5 |
| Damage taken a round of combat | 4.8 | 4.7 |
| Times Down | 0.06 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.13 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.49 | 5.02 |
| Rally Points used between fights | 0.24 | 0.94 |
| Rally Points left | 4.14 | 2.04 |
| **Buffs:** healed allies (Lay On Hands) | 67.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 38.5 | 0.0 |
| Banes given (damage its areas stopped) | 2.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 55.2 | 0.0 |
| Guard given (damage it took instead of Health) | 53.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 21.7 | 0.0 |
| **Map:** AP spent moving | 7.3 | 7.4 |
| AP lost to moving (Actions dropped or made smaller) | 7.3 | 0.0 |
| Turns that start Engaged | 12.6 | 7.5 |
| Shots ([Ranged] Actions) | 0.0 | 62.3 |
| ... into melee (1 Bane) | 0.0 | 45.5 |
| ... with Cover | 0.0 | 29.5 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 14.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.68 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.78 |
| **Debuff:** Hindered (times) | 0.00 | 3.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.69 |
| **Debuff:** Immobilized (times) | 0.00 | 0.39 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.66 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 49% · a PC Down during the day 99% · Downs a day 4.18 · Rally Points left at the end 35% · Health at the end 36%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 38% | 24% |
| 2: 6 standard | 73% | 5.7 | 63% | 82% |
| 3: 2 elite | 99% | 3.5 | 29% | 37% |
| 4: 1 elite, 4 standard | 68% | 5.8 | 65% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 336.3 | 256.0 |
| Damage a turn (its own turns) | 26.3 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.0 | 10.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 128.4 | 59.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 83.9 | 59.0 |
| Damage taken a round of combat | 5.6 | 3.9 |
| Times Down | 0.76 | 1.33 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.44 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.61 | 4.25 |
| Rally Points left | 2.95 | 2.35 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 21.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 44.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 9.3 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 42.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.3 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 9.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.33 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.60 |
| **Debuff:** Immobilized (times) | 0.00 | 2.85 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.89 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 53% · a PC Down during the day 98% · Downs a day 3.98 · Rally Points left at the end 34% · Health at the end 41%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 38% | 27% |
| 2: 6 standard | 75% | 5.9 | 62% | 82% |
| 3: 2 elite | 100% | 3.5 | 28% | 32% |
| 4: 1 elite, 4 standard | 71% | 5.8 | 60% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 347.7 | 267.6 |
| Damage a turn (its own turns) | 26.1 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.5 | 11.2 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 129.1 | 58.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 83.4 | 58.3 |
| Damage taken a round of combat | 5.3 | 3.7 |
| Times Down | 0.71 | 1.28 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.46 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.71 | 4.29 |
| Rally Points left | 2.83 | 2.26 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 21.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 45.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.9 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 9.5 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 32.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.88 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.82 |
| **Debuff:** Immobilized (times) | 0.00 | 3.04 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.01 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 68% · a PC Down during the day 96% · Downs a day 3.45 · Rally Points left at the end 34% · Health at the end 56%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 35% | 21% |
| 2: 6 standard | 83% | 5.7 | 56% | 76% |
| 3: 2 elite | 100% | 3.4 | 27% | 32% |
| 4: 1 elite, 4 standard | 82% | 5.7 | 56% | 76% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 360.6 | 286.3 |
| Damage a turn (its own turns) | 26.3 | 24.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.9 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.9 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 131.4 | 63.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.9 | 63.6 |
| Damage taken a round of combat | 5.4 | 3.9 |
| Times Down | 0.54 | 1.19 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.50 | 0.47 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.60 |
| Rally Points left | 3.56 | 1.93 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 24.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 45.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 9.7 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 43.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.7 |
| ... while Engaged (2 Banes) | 0.0 | 1.3 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.69 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.00 |
| **Debuff:** Immobilized (times) | 0.00 | 2.47 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.22 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 75% · a PC Down during the day 95% · Downs a day 3.13 · Rally Points left at the end 33% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 34% | 17% |
| 2: 6 standard | 87% | 5.8 | 54% | 75% |
| 3: 2 elite | 100% | 3.3 | 25% | 25% |
| 4: 1 elite, 4 standard | 87% | 5.9 | 53% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 375.5 | 303.1 |
| Damage a turn (its own turns) | 26.0 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.6 | 12.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 132.8 | 61.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.6 | 61.2 |
| Damage taken a round of combat | 5.1 | 3.6 |
| Times Down | 0.48 | 1.09 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.57 | 0.49 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.06 | 4.62 |
| Rally Points left | 3.36 | 1.89 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 24.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 47.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.5 | 0.0 |
| **Map:** AP spent moving | 6.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.1 | 0.0 |
| Turns that start Engaged | 10.2 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 33.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 12.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.17 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.16 |
| **Debuff:** Immobilized (times) | 0.00 | 2.65 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.62 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 85% · Downs a day 1.93 · Rally Points left at the end 39% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.4 | 33% | 13% |
| 2: 6 standard | 98% | 5.0 | 37% | 56% |
| 3: 2 elite | 100% | 3.0 | 21% | 18% |
| 4: 1 elite, 4 standard | 99% | 4.9 | 41% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 409.7 | 328.8 |
| Damage a turn (its own turns) | 28.9 | 26.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.1 | 25.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.3 | 12.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 120.2 | 58.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.6 | 0.0 |
| Damage taken | 68.5 | 58.6 |
| Damage taken a round of combat | 4.3 | 3.6 |
| Times Down | 0.15 | 0.81 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.79 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.75 | 5.47 |
| Rally Points left | 4.46 | 2.16 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 25.6 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 39.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.6 | 0.0 |
| **Map:** AP spent moving | 6.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.1 | 0.0 |
| Turns that start Engaged | 9.6 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 44.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 1.4 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.78 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 2.55 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.17 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.88 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 87% · Downs a day 1.80 · Rally Points left at the end 40% · Health at the end 88%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.5 | 33% | 12% |
| 2: 6 standard | 99% | 5.0 | 36% | 56% |
| 3: 2 elite | 100% | 3.1 | 20% | 15% |
| 4: 1 elite, 4 standard | 98% | 4.9 | 39% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 411.6 | 345.3 |
| Damage a turn (its own turns) | 28.6 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.0 | 25.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.4 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.4 | 12.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 116.4 | 57.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.1 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 65.8 | 57.5 |
| Damage taken a round of combat | 4.0 | 3.5 |
| Times Down | 0.15 | 0.75 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.72 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.65 | 5.34 |
| Rally Points left | 4.63 | 2.25 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.8 |
| Divine Surge given (extra damage dealt by allies) | 24.9 | 0.0 |
| Banes given (damage its areas stopped) | 1.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.3 | 0.0 |
| Guard given (damage it took instead of Health) | 39.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.5 | 0.0 |
| **Map:** AP spent moving | 6.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 9.5 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 33.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.08 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.10 |
| **Debuff:** Immobilized (times) | 0.00 | 2.66 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.89 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 2% · a PC Down during the day 100% · Downs a day 4.89 · Rally Points left at the end 52% · Health at the end 1%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 97% | 3.9 | 44% | 44% |
| 2: 2 elite, 2 standard | 24% | 5.2 | 86% | 97% |
| 3: 6 standard | 9% | 3.8 | 79% | 99% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 167.2 | 148.7 |
| Damage a turn (its own turns) | 25.2 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.5 | 21.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 6.7 | 7.1 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 79.9 | 51.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.6 | 51.3 |
| Damage taken a round of combat | 8.1 | 5.4 |
| Times Down | 1.23 | 1.21 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.18 | 0.06 |
| Rally Points used through an ally's Lay On Hands | 1.01 | 1.21 |
| Rally Points used between fights | 2.02 | 1.71 |
| Rally Points left | 3.79 | 4.02 |
| **Buffs:** healed allies (Lay On Hands) | 17.6 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 3.0 | 3.0 |
| AP lost to moving (Actions dropped or made smaller) | 2.1 | 0.0 |
| Turns that start Engaged | 4.5 | 3.0 |
| Shots ([Ranged] Actions) | 0.0 | 25.1 |
| ... into melee (1 Bane) | 0.0 | 14.0 |
| ... with Cover | 0.0 | 10.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 4.3 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.42 | 3.86 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.10 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.44 |
| **Debuff:** Immobilized (times) | 0.00 | 1.43 |
| **Debuff:** Prone (times) | 0.42 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.44 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 35% · a PC Down during the day 100% · Downs a day 4.32 · Rally Points left at the end 49% · Health at the end 29%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.7 | 38% | 38% |
| 2: 2 elite, 2 standard | 61% | 6.0 | 70% | 87% |
| 3: 6 standard | 57% | 5.7 | 71% | 88% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 257.6 | 175.3 |
| Damage a turn (its own turns) | 25.9 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 22.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 10.1 | 8.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 117.5 | 51.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 79.8 | 51.4 |
| Damage taken a round of combat | 6.4 | 4.1 |
| Times Down | 0.89 | 1.27 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.50 | 0.33 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.71 | 3.17 |
| Rally Points left | 3.79 | 3.49 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 15.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Map:** AP spent moving | 3.8 | 3.2 |
| AP lost to moving (Actions dropped or made smaller) | 3.8 | 0.0 |
| Turns that start Engaged | 7.3 | 3.2 |
| Shots ([Ranged] Actions) | 0.0 | 29.6 |
| ... into melee (1 Bane) | 0.0 | 19.0 |
| ... with Cover | 0.0 | 13.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 7.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.35 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.74 |
| **Debuff:** Immobilized (times) | 0.00 | 1.61 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 41% · a PC Down during the day 99% · Downs a day 4.32 · Rally Points left at the end 43% · Health at the end 33%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.8 | 41% | 41% |
| 2: 2 elite, 2 standard | 66% | 6.3 | 68% | 89% |
| 3: 6 standard | 62% | 6.1 | 69% | 88% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 272.3 | 179.7 |
| Damage a turn (its own turns) | 25.8 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 21.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 10.8 | 8.7 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 128.6 | 54.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.3 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.4 | 0.0 |
| Damage taken | 83.5 | 54.1 |
| Damage taken a round of combat | 6.3 | 4.1 |
| Times Down | 0.82 | 1.34 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.78 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.90 | 3.50 |
| Rally Points left | 3.31 | 3.14 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 6.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 24.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.5 | 0.0 |
| **Map:** AP spent moving | 3.9 | 3.3 |
| AP lost to moving (Actions dropped or made smaller) | 3.9 | 0.0 |
| Turns that start Engaged | 7.9 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 30.3 |
| ... into melee (1 Bane) | 0.0 | 19.4 |
| ... with Cover | 0.0 | 13.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 7.9 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.47 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.28 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.83 |
| **Debuff:** Immobilized (times) | 0.00 | 1.64 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.50 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 64% · a PC Down during the day 81% · Downs a day 2.47 · Rally Points left at the end 29% · Health at the end 56%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.4 | 8% | 17% |
| 2: 2 elite, 2 standard | 85% | 6.9 | 28% | 54% |
| 3: 6 standard | 76% | 6.4 | 37% | 60% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 206.0 | 279.9 |
| Damage a turn (its own turns) | 14.8 | 21.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.7 | 22.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 14.1 | 12.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 152.8 | 77.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 104.3 | 77.6 |
| Damage taken a round of combat | 6.4 | 4.7 |
| Times Down | 0.48 | 0.75 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.63 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.60 | 3.47 |
| Rally Points used between fights | 0.55 | 1.35 |
| Rally Points left | 2.22 | 2.18 |
| **Buffs:** healed allies (Lay On Hands) | 49.5 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 28.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 45.9 | 0.0 |
| Guard given (damage it took instead of Health) | 48.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.2 | 0.0 |
| **Map:** AP spent moving | 5.3 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 5.3 | 0.0 |
| Turns that start Engaged | 10.3 | 5.4 |
| Shots ([Ranged] Actions) | 0.0 | 46.8 |
| ... into melee (1 Bane) | 0.0 | 33.0 |
| ... with Cover | 0.0 | 21.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.44 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.41 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.71 |
| **Debuff:** Immobilized (times) | 0.00 | 2.73 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 56% · a PC Down during the day 93% · Downs a day 3.23 · Rally Points left at the end 39% · Health at the end 46%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.0 | 19% | 22% |
| 2: 2 elite, 2 standard | 77% | 6.2 | 47% | 71% |
| 3: 6 standard | 73% | 6.0 | 48% | 74% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 319.6 | 173.8 | 229.6 |
| Damage a turn (its own turns) | 25.9 | 15.3 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.5 | 12.7 | 22.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - | - |
| Share of the party's damage (%) | 33 | 18 | 24 |
| Turns taken | 12.4 | 11.5 | 10.6 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 137.3 | 124.9 | 64.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 91.5 | 84.9 | 64.9 |
| Damage taken a round of combat | 6.4 | 5.9 | 4.5 |
| Times Down | 0.57 | 0.72 | 0.97 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.79 | 3.65 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 2.30 | 0.00 | 1.94 |
| Rally Points used between fights | 1.27 | 1.77 | 2.26 |
| Rally Points left | 3.64 | 2.58 | 2.76 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 49.8 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 20.4 | 22.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 48.1 | 0.0 |
| Guard given (damage it took instead of Health) | 45.8 | 40.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.3 | 0.0 | 0.0 |
| **Map:** AP spent moving | 4.7 | 4.4 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 4.7 | 4.4 | 0.0 |
| Turns that start Engaged | 9.0 | 8.3 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 38.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 25.9 |
| ... with Cover | 0.0 | 0.0 | 17.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.4 | 8.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 5.98 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.36 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.82 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.16 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.53 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 56% · a PC Down during the day 98% · Downs a day 3.70 · Rally Points left at the end 45% · Health at the end 50%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 34% | 27% |
| 2: 2 elite, 2 standard | 75% | 6.0 | 64% | 84% |
| 3: 6 standard | 74% | 5.8 | 62% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 283.5 | 205.7 |
| Damage a turn (its own turns) | 25.7 | 22.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.7 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 11.2 | 9.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 124.4 | 55.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.0 | 55.2 |
| Damage taken a round of combat | 6.2 | 4.1 |
| Times Down | 0.67 | 1.18 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.64 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.15 | 3.69 |
| Rally Points left | 4.21 | 2.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 17.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.4 | 0.0 |
| **Map:** AP spent moving | 4.3 | 3.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 0.0 |
| Turns that start Engaged | 8.0 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 32.4 |
| ... into melee (1 Bane) | 0.0 | 21.4 |
| ... with Cover | 0.0 | 14.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.55 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.36 |
| **Debuff:** Hindered (times) | 0.00 | 1.75 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.52 |
| **Debuff:** Immobilized (times) | 0.00 | 0.28 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.55 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 82% · a PC Down during the day 67% · Downs a day 1.53 · Rally Points left at the end 35% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.2 | 6% | 10% |
| 2: 2 elite, 2 standard | 91% | 6.6 | 20% | 43% |
| 3: 6 standard | 90% | 6.2 | 21% | 41% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 212.6 | 312.8 |
| Damage a turn (its own turns) | 14.9 | 23.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 12.8 | 24.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 20 | 30 |
| Turns taken | 14.4 | 13.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 149.7 | 77.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 101.9 | 77.4 |
| Damage taken a round of combat | 6.3 | 4.7 |
| Times Down | 0.26 | 0.51 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.57 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.61 | 3.71 |
| Rally Points used between fights | 0.43 | 1.15 |
| Rally Points left | 3.39 | 2.13 |
| **Buffs:** healed allies (Lay On Hands) | 57.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 29.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 47.5 | 0.0 |
| Guard given (damage it took instead of Health) | 47.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.8 | 0.0 |
| **Map:** AP spent moving | 5.4 | 5.4 |
| AP lost to moving (Actions dropped or made smaller) | 5.4 | 0.0 |
| Turns that start Engaged | 10.4 | 5.5 |
| Shots ([Ranged] Actions) | 0.0 | 48.6 |
| ... into melee (1 Bane) | 0.0 | 35.1 |
| ... with Cover | 0.0 | 22.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 12.5 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.65 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.46 |
| **Debuff:** Hindered (times) | 0.00 | 2.81 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.53 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 91% · a PC Down during the day 91% · Downs a day 2.39 · Rally Points left at the end 45% · Health at the end 85%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 33% | 24% |
| 2: 2 elite, 2 standard | 96% | 5.4 | 43% | 66% |
| 3: 6 standard | 95% | 5.4 | 47% | 64% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 340.5 | 231.3 |
| Damage a turn (its own turns) | 28.1 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 24.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.4 | - |
| Share of the party's damage (%) | 30 | 20 |
| Turns taken | 12.2 | 10.0 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 117.7 | 55.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.9 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 67.7 | 55.0 |
| Damage taken a round of combat | 4.8 | 3.9 |
| Times Down | 0.26 | 0.94 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.94 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.18 | 4.91 |
| Rally Points left | 4.88 | 2.75 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.7 | 0.0 |
| Guard given (damage it took instead of Health) | 38.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.0 | 0.0 |
| **Map:** AP spent moving | 4.9 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 0.0 |
| Turns that start Engaged | 8.5 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 35.6 |
| ... into melee (1 Bane) | 0.0 | 24.3 |
| ... with Cover | 0.0 | 16.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 10.1 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.81 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.44 |
| **Debuff:** Hindered (times) | 0.00 | 1.89 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.59 |
| **Debuff:** Immobilized (times) | 0.00 | 0.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 42% · Downs a day 0.60 · Rally Points left at the end 45% · Health at the end 95%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 4.2 | 5% | 8% |
| 2: 2 elite, 2 standard | 100% | 6.0 | 8% | 22% |
| 3: 6 standard | 99% | 5.6 | 8% | 20% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 232.6 | 328.4 |
| Damage a turn (its own turns) | 16.5 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 14.9 | 25.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 21.2 | - |
| Share of the party's damage (%) | 21 | 29 |
| Turns taken | 14.2 | 13.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 136.1 | 75.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.7 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.2 | 0.0 |
| Damage taken | 80.5 | 75.2 |
| Damage taken a round of combat | 5.1 | 4.8 |
| Times Down | 0.06 | 0.24 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.84 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.09 | 4.21 |
| Rally Points used between fights | 0.31 | 0.94 |
| Rally Points left | 4.76 | 2.85 |
| **Buffs:** healed allies (Lay On Hands) | 57.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 29.9 | 0.0 |
| Banes given (damage its areas stopped) | 4.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 44.0 | 0.0 |
| Guard given (damage it took instead of Health) | 42.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.7 | 0.0 |
| **Map:** AP spent moving | 6.0 | 5.6 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 9.9 | 5.7 |
| Shots ([Ranged] Actions) | 0.0 | 50.4 |
| ... into melee (1 Bane) | 0.0 | 36.8 |
| ... with Cover | 0.0 | 23.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.76 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.44 |
| **Debuff:** Hindered (times) | 0.00 | 2.90 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.55 |
| **Debuff:** Immobilized (times) | 0.00 | 0.31 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.61 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 52% · a PC Down during the day 98% · Downs a day 3.74 · Rally Points left at the end 44% · Health at the end 45%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 35% | 30% |
| 2: 2 elite, 2 standard | 73% | 5.9 | 64% | 84% |
| 3: 6 standard | 72% | 5.6 | 62% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 269.6 | 209.0 |
| Damage a turn (its own turns) | 25.8 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.8 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 10.6 | 8.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 111.6 | 50.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.8 | 50.0 |
| Damage taken a round of combat | 5.8 | 3.9 |
| Times Down | 0.72 | 1.15 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.41 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.04 | 3.54 |
| Rally Points left | 3.55 | 3.09 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 16.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 36.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.5 | 0.0 |
| **Map:** AP spent moving | 4.3 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 0.0 |
| Turns that start Engaged | 7.2 | 3.2 |
| Shots ([Ranged] Actions) | 0.0 | 34.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.7 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 8.2 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.45 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.76 |
| **Debuff:** Immobilized (times) | 0.00 | 2.34 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.36 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 59% · a PC Down during the day 96% · Downs a day 3.54 · Rally Points left at the end 42% · Health at the end 51%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 33% | 28% |
| 2: 2 elite, 2 standard | 78% | 6.0 | 61% | 76% |
| 3: 6 standard | 76% | 5.9 | 61% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 280.5 | 225.7 |
| Damage a turn (its own turns) | 25.6 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.6 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.1 | 9.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 113.1 | 49.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.8 | 49.1 |
| Damage taken a round of combat | 5.5 | 3.6 |
| Times Down | 0.68 | 1.09 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.45 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.21 | 3.69 |
| Rally Points left | 3.35 | 2.92 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 17.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 7.6 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 27.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 9.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.23 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 2.59 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.59 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 71% · a PC Down during the day 95% · Downs a day 3.10 · Rally Points left at the end 44% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 31% | 24% |
| 2: 2 elite, 2 standard | 84% | 5.8 | 56% | 76% |
| 3: 6 standard | 84% | 5.6 | 56% | 73% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 288.2 | 231.5 |
| Damage a turn (its own turns) | 25.7 | 24.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.3 | 9.4 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 114.4 | 52.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.5 | 52.1 |
| Damage taken a round of combat | 5.7 | 3.8 |
| Times Down | 0.52 | 1.03 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.47 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.28 | 3.84 |
| Rally Points left | 4.25 | 2.76 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.1 |
| Divine Surge given (extra damage dealt by allies) | 18.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.9 | 0.0 |
| **Map:** AP spent moving | 4.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.6 | 0.0 |
| Turns that start Engaged | 7.8 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 35.0 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.9 |
| Flanking Boons on its melee Actions | 9.4 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 7.69 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.18 |
| **Debuff:** Immobilized (times) | 0.00 | 1.97 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.54 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.50 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 74% · a PC Down during the day 95% · Downs a day 2.87 · Rally Points left at the end 44% · Health at the end 67%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 30% | 22% |
| 2: 2 elite, 2 standard | 86% | 5.8 | 53% | 71% |
| 3: 6 standard | 86% | 5.8 | 54% | 74% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 295.3 | 244.5 |
| Damage a turn (its own turns) | 25.6 | 24.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.4 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.7 | 9.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 113.2 | 50.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.4 | 50.5 |
| Damage taken a round of combat | 5.4 | 3.6 |
| Times Down | 0.48 | 0.96 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.41 | 0.43 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.35 | 3.81 |
| Rally Points left | 4.25 | 2.76 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 18.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.7 | 0.0 |
| **Map:** AP spent moving | 5.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 0.0 |
| Turns that start Engaged | 7.9 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 26.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 12.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.6 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.21 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.41 |
| **Debuff:** Immobilized (times) | 0.00 | 2.07 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.53 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 84% · Downs a day 1.71 · Rally Points left at the end 50% · Health at the end 90%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.2 | 29% | 19% |
| 2: 2 elite, 2 standard | 99% | 4.9 | 37% | 53% |
| 3: 6 standard | 98% | 4.9 | 42% | 55% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 321.5 | 262.8 |
| Damage a turn (its own turns) | 28.3 | 26.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 25.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.3 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.4 | 9.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 101.8 | 47.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.0 | 0.0 |
| Damage taken | 59.3 | 47.6 |
| Damage taken a round of combat | 4.6 | 3.6 |
| Times Down | 0.16 | 0.70 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.74 | 0.32 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.06 | 4.47 |
| Rally Points left | 5.20 | 3.21 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 19.9 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.3 | 0.0 |
| Guard given (damage it took instead of Health) | 32.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.2 | 0.0 |
| **Map:** AP spent moving | 5.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 0.0 |
| Turns that start Engaged | 7.5 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 35.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.3 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 9.8 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.48 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.24 |
| **Debuff:** Immobilized (times) | 0.00 | 2.09 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.67 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 80% · Downs a day 1.55 · Rally Points left at the end 51% · Health at the end 91%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.3 | 28% | 16% |
| 2: 2 elite, 2 standard | 99% | 4.8 | 34% | 49% |
| 3: 6 standard | 98% | 5.0 | 40% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 322.8 | 276.4 |
| Damage a turn (its own turns) | 28.0 | 27.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.7 | 26.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.0 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.6 | 10.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 97.5 | 46.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.0 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.0 | 0.0 |
| Damage taken | 56.6 | 45.9 |
| Damage taken a round of combat | 4.3 | 3.5 |
| Times Down | 0.14 | 0.64 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.72 | 0.34 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.91 | 4.34 |
| Rally Points left | 5.37 | 3.32 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 19.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.1 | 0.0 |
| Guard given (damage it took instead of Health) | 31.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.1 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 7.5 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 26.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 12.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Reaction attacks made (Opportunity Attack, Overwatch, Quick Draw) / Opportunity Attacks taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Opportunity Attacks made (the basic Reaction): how many / their damage | 0.0 / 0.0 | 0.0 / 0.0 |
| Reactions used (all kinds) / the damage they dealt | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.73 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.31 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.24 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.70 |
