# The ruler: class builds and fights (level 1)

Written by `node book/ruler/spec.mjs` from `book/ruler/classes/*.txt` and `book/ruler/fights.txt`. Don't edit this file: edit those and run the script again.

## Archer (ranged damage), `classes/archer-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Lock & Loose + attack (plan) | 0 | 26.5 | 24.8 | 22.9 | 27.6 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 41.9 | 39.0 | 36.1 | 39.0 | 5 | 3 | Double Shot 3, Twin Shot, Lock & Loose |  |
| Reload Shot | 0 | 29.3 | 27.7 | 25.9 | 30.6 | 5 | 3 | Double Shot 3, Weapon Attack, Lock & Loose (reload shot) |  |
| Reload and shoot | 0 | 16.4 | 15.6 | 14.7 | 17.8 | 5 | 2 | Reload, Double Shot 3, Lock & Loose (reload shot) |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 20.0 | 18.8 | 17.5 | 21.7 | 5 | 2 | advance, Double Shot 3, Lock & Loose |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Lock & Loose + attack · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.1 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.7 | 2 / 2.2 |

## Archer (ranged damage), `classes/archer-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.8 | 41.5 | 38.2 | 41.5 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.4 | 2 / 2.3 |

## Archer (ranged damage), `classes/archer-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Double Shot + Wing Clip + Lock & Loose (plan) | 0 | 28.9 | 27.0 | 24.9 | 29.9 | 5 | 3 | Double Shot 3, Wing Clip, Lock & Loose |  |
| Aimed Marksman (plan) | 0 | 20.8 | 19.2 | 17.6 | 22.0 | 5 | 2 | Precise Aim 1, Marksman's Shot, Double Shot 2 |  |
| Twin (plan, **best**) | 2 | 44.8 | 41.5 | 38.2 | 41.5 | 5 | 3 | Double Shot 3, Twin Shot, Wing Clip |  |
| Steel | 0 | 13.9 | 13.0 | 11.9 | 15.8 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |
| Kite | 0 | 22.8 | 21.2 | 19.4 | 24.0 | 5 | 2 | advance, Double Shot 3, Wing Clip |  |

Plan: round 1: Aimed Marksman · round 2: Double Shot + Wing Clip + Lock & Loose · round 3+: Twin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.5 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.9 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.5 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-1.txt`

Health 27 (Body 14 + Mind 13) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 7) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 27.0 | 25.5 | 24.1 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan, **best**) | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 10 / 10.2 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.6 | 5 / 4.9 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 3.0 | 3 / 3.3 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.7 | 2 / 2.2 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 27.0 | 25.5 | 24.1 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.0 | 28.2 | 33.5 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.2 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.8 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.6 | 2 / 2.3 |

## Archer (Double Shot, options) (ranged damage), `classes/archer-double-3-options.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 27.0 | 25.5 | 24.1 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 3 | 32.7 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Nova | 0 | 21.2 | 20.5 | 19.6 | 23.1 | 5 | 1 | Volley, Double Shot 3 |  |
| Focus (**best**) | 0 | 33.9 | 32.3 | 30.8 | 35.7 | 5 | 3 | Deadeye, Double Shot 3, Lock & Loose |  |
| Kite | 3 | 32.7 | 31.0 | 29.2 | 31.0 | 5 | 3 | Double Shot 3, Lock & Loose, Twin Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.3 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.6 | 2 / 2.4 |

## Archer (Double Shot) (ranged damage), `classes/archer-double-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 27.0 | 25.5 | 24.1 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 31.8 | 30.0 | 28.2 | 33.5 | 5 | 2 | Marksman's Shot, Double Shot 3 |  |
| Focus | 0 | 23.7 | 22.6 | 21.5 | 26.3 | 5 | 2 | Hunter's Focus, Double Shot 3, Lock & Loose |  |
| Kite | 2 | 29.8 | 28.3 | 26.6 | 28.3 | 5 | 3 | Double Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 13.7 | 12.9 | 12.0 | 15.6 | 5 | 1 | Steel Yourself 2, Double Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.5 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 3 / 3.6 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.0 | 2 / 2.4 |

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
| Elite | 132 | 14 | 3 | 16.8 | 6 / 6.0 | 2 / 2.2 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-2.txt`

Health 29 (Body 15 + Mind 14) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 7 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin (plan) | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.2 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Nova (once used: Pin) · round 2+: Pin · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 10.9 |
| Grunt | 28 | 13 | 2 | 6.3 | 1 / 1.4 | 5 / 5.3 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.9 | 3 / 3.5 |
| Elite | 132 | 14 | 3 | 16.8 | 6 / 5.8 | 2 / 2.3 |

## Archer (Rolling Shot) (ranged damage), `classes/archer-rolling-3.txt`

Health 31 (Body 16 + Mind 15) · AD 13 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 8) · targeted ×0.75

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main | 0 | 25.9 | 24.6 | 23.1 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Weapon Attack |  |
| Pin | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Nova (**best**) | 0 | 30.7 | 29.1 | 27.2 | 32.5 | 5 | 2 | Marksman's Shot, Rolling Shot 3 |  |
| Focus | 0 | 23.4 | 22.4 | 21.2 | 26.1 | 5 | 2 | Hunter's Focus, Rolling Shot 3, Lock & Loose |  |
| Kite | 2 | 28.8 | 27.2 | 25.6 | 27.2 | 5 | 3 | Rolling Shot 3, Lock & Loose, Pinning Shot (else Weapon Attack) |  |
| Steel | 0 | 12.6 | 11.9 | 11.0 | 14.6 | 5 | 1 | Steel Yourself 2, Rolling Shot 3 |  |

Plan: round 1: Focus (once used: Nova (once used: Pin) · round 2+: Nova (once used: Pin) · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.8 | 1 / 1.0 | 11 / 11.6 |
| Grunt | 28 | 13 | 2 | 6.3 | 2 / 1.8 | 5 / 5.6 |
| Standard | 63 | 13 | 2 | 10.3 | 3 / 2.6 | 4 / 3.7 |
| Elite | 132 | 14 | 3 | 16.8 | 5 / 5.0 | 2 / 2.4 |

## Paladin (book) (tank / support), `classes/paladin-book-1.txt`

Health 36 (Body 21 + Mind 15) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 9) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Smite and two attacks | 0 | 24.2 | 22.4 | 20.6 | 22.4 | 4 | 3 | Smite 2, Weapon Attack, Weapon Attack |  |
| Smite 3 and two attacks | 0 | 26.5 | 24.7 | 22.9 | 24.7 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Surge Smite 3 (plan, **best**) | 1 | 30.9 | 29.2 | 27.4 | 29.2 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Radiance opening (plan) | 0 | 25.9 | 24.5 | 23.0 | 24.5 | 5 | 2 | Word of Radiance 2, Smite 2, Weapon Attack |  |
| Surge | 1 | 28.6 | 26.9 | 25.1 | 26.9 | 4 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack |  |
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
| Elite | 132 | 14 | 3 | 15.1 | 5 / 5.5 | 3 / 3.1 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 36.7 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.3 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.8 | 3 / 3.4 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 20.8 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 14.4 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 36.7 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.5 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.8 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.7 | 4 / 3.7 |

## Paladin (Lay On Hands) (tank / support), `classes/paladin-hands-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 22.9 | 20.8 | 18.7 | 23.5 | 5 | 3 | Divine Surge, Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 22.9 | 20.8 | 18.7 | 23.5 | 5 | 3 | Lay On Hands 2, Weapon Attack, Weapon Attack, Weapon Attack |  |
| Heal and move | 1 | 16.0 | 14.4 | 12.9 | 16.9 | 5 | 3 | Divine Surge, Lay On Hands 1, Weapon Attack, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 38.1 | 36.7 | 35.2 | 40.3 | 5 | 1 | Divine Surge, Lay On Hands 2, Holy Wrath 3 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 16.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Consecrate | 1 | 12.8 | 11.8 | 10.6 | 14.3 | 5 | 1 | Divine Surge, Consecrated Ground 2, Lay On Hands 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 36 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.3 | 14 / 13.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.3 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 7.2 | 4 / 4.0 |

## Paladin (Smite, hold) (tank / support), `classes/paladin-smite-1-hold.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge (keep 2), Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge (keep 2), Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge (keep 2), Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 3 / 3.4 |

## Paladin (Smite, options) (tank / support), `classes/paladin-smite-1-options.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Aura of Protection, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Nova (plan, **best**) | 0 | 22.9 | 21.8 | 20.6 | 21.8 | 5 | 1 | Word of Radiance 3, Smite 2 |  |
| Steel | 0 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.2 |
| Grunt | 28 | 13 | 2 | 5.6 | 2 / 1.8 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 3.5 | 5 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 7.3 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-1.txt`

Health 39 (Body 21 + Mind 18) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 8 (each heals 10) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 30 / 30.4 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 11 / 11.5 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 5.8 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 3 / 3.4 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-2.txt`

Health 43 (Body 23 + Mind 20) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 11) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 21.3 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 38.9 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 14.4 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 16.6 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 33 / 33.6 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 12.8 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.7 | 6 / 6.4 |
| Elite | 132 | 14 | 3 | 15.1 | 6 / 6.4 | 4 / 3.7 |

## Paladin (Smite) (tank / support), `classes/paladin-smite-3.txt`

Health 46 (Body 25 + Mind 21) · AD 14 · WD 13 · Weapon Modifier +2 · Power Modifier +2 · Rally Points 9 (each heals 12) · targeted ×1.5

**Damage a turn** (Monte Carlo, 20,000 turns each; measured with the Escalation the turn spends ("Esc"; its passives see what is left after spending), and once at Escalation 3; the target's Defense is both AD and WD; an Action against "a different creature" or an area counts only the target, but a Linked Action that needs a different creature still hits it; **best** = the most damage at Def 13 among the valid turns):

| Turn | Esc | Def 12 | Def 13 | Def 14 | Def 13, Esc 3 | AP | Strikes | Steps | Problems |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Main (plan) | 1 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Divine Surge, Smite 3, Weapon Attack, Weapon Attack |  |
| Main without Escalation | 0 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Smite 3, Weapon Attack, Weapon Attack |  |
| Smite 2 and move | 1 | 23.1 | 21.3 | 19.5 | 24.8 | 5 | 3 | Divine Surge, Smite 2, Weapon Attack, Weapon Attack, move 1 |  |
| Nova (plan, **best**) | 1 | 41.1 | 38.9 | 36.7 | 42.4 | 5 | 2 | Divine Surge, Holy Wrath 3, Smite 2 |  |
| Three attacks | 0 | 16.0 | 14.4 | 12.9 | 16.9 | 3 | 3 | Weapon Attack, Weapon Attack, Weapon Attack |  |
| Steel | 1 | 17.9 | 16.6 | 15.2 | 20.0 | 5 | 2 | Steel Yourself 2, Divine Surge, Smite 2, Weapon Attack |  |
| Consecrate | 1 | 17.9 | 16.6 | 15.2 | 20.0 | 5 | 2 | Divine Surge, Consecrated Ground 2, Smite 2, Weapon Attack |  |

Plan: round 1: Nova · round 2: Consecrate (once used: Main) · round 3+: Main · when itself below 35% Health: Steel

**Duels** (one of each, Medium NPCs; rounds counted with this build's plan):

| NPC | its Health | its Defense | its Modifier | its damage a turn to this PC | rounds to kill it (median / mean) | rounds for it to put this PC Down (median / mean) |
|---|---:|---:|---:|---:|---:|---:|
| Minion | 7 | 12 | 2 | 2.5 | 1 / 1.0 | 35 / 35.9 |
| Grunt | 28 | 13 | 2 | 5.6 | 1 / 1.2 | 13 / 13.7 |
| Standard | 63 | 13 | 2 | 9.2 | 3 / 2.9 | 7 / 6.9 |
| Elite | 132 | 14 | 3 | 15.1 | 7 / 6.7 | 4 / 4.0 |

## Party fights (Paladin (Smite), Paladin (Lay On Hands), Archer, Archer; 2000 runs each)

The book's target for a typical fight (CV 4 against 4 PCs): about **3 rounds** and about **40% of the party's Health**.

| Encounter | CV | rounds (median / mean / 90%) | party won | Health lost | a PC goes Down | first Down (median round) | Paladin (Smite) Down | Paladin (Lay On Hands) Down | Archer Down | Archer Down | no positions: rounds / Health lost |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 Standards | 4 | 4 / 3.8 / 5 | 99% | 26% | 27% | 2 | 5% | 5% | 10% | 13% | 3.3 / 23% |
| 2 Elites | 4 | 4 / 4.0 / 5 | 99% | 28% | 36% | 2 | 7% | 8% | 15% | 16% | 3.2 / 23% |
| Elite + 2 Standards | 4 | 4 / 3.9 / 5 | 99% | 25% | 30% | 2 | 6% | 5% | 14% | 10% | 3.2 / 21% |
| 8 Grunts | 4 | 4 / 4.0 / 5 | 100% | 25% | 13% | 2 | 1% | 2% | 5% | 7% | 3.6 / 28% |
| 2 Standards + 8 Minions | 4 | 4 / 3.9 / 4 | 100% | 19% | 16% | 2 | 1% | 1% | 8% | 5% | 3.6 / 24% |
| 6 Standards (CV 6, hard) | 6 | 6 / 5.9 / 8 | 63% | 66% | 80% | 2 | 45% | 46% | 59% | 64% | 5.4 / 52% |

How the fight is simulated: initiative is shuffled once; every PC follows its plan (the round's turn; its `when` turn when it is unloaded or an ally is hurt) and attacks its Marked Quarry if it has one, else the enemy closest to dying (a new quarry when the old one dies); each NPC makes its Strikes a turn (Minion 1, Grunt and Standard 2, Elite 3; At-will Banes on the 2nd and 3rd), choosing a PC at random weighted by `targeted` (a taunted NPC takes the taunt's Banes against anyone else); Defense bonuses last until their giver's next turn; one Health Pool per creature (Body and Mind together); a PC at its Health Pool is Down and stops; nobody uses Rally Points on their own. **Positions (pack E2, map.mjs; `map on` in fights.txt):** the melee PCs start on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away; a melee PC closes in first (a Charge when it can: 2 AP, 1 Boon), and AP spent moving drop the turn's last Actions (a lower Version, else a Weapon Attack); a ranged PC that starts its turn Engaged takes its `when engaged` turn (it steps away: an Advance, or an Evade 1 next to an NPC with an Opportunity Attack), and stays within its normal range; an NPC chooses the PC it can strike most after moving (its Bestiary Strikes keep 1 AP for moving: each extra Advance costs part of a Strike), stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move; [Ranged] Banes for range, Cover (a creature in the line; the map's own cover 5% Medium, 15% Low), shooting while Engaged and into melee; Flanking for both sides; Opportunity Attacks with AP kept from the turn (the PCs' Talent; NPCs: elite); Hindered, Immobilized, Prone, Slowed and Forced Movement act on the NPCs. **Without positions** (`map off`) every PC reaches every NPC at once and NPCs choose a PC weighted by `targeted`. Escalation is 0 in round 1 (with Momentum in a day: half the level, rounded up, up to 2), then +1 a round (up to 3); an Escalation Active spends what it costs, and a passive works only while the PC has at least its number (so spending can turn it off).

## Adventuring days (1000 days each)

The fights of a day in order, with no Rest: damage and Rally Points carry over, Encounter Actions and Escalation start again each fight. Between fights every PC uses Rally Points (Steel Yourself, no AP limit out of combat) while its damage is at least 3/4 of what one heals; a PC that is Down gets back up with one Rally Point through an ally's Lay On Hands (or one Rally Point's worth after an hour Unconscious). In a fight a PC uses Steel Yourself when its `when self below` turn says so. A lost fight ends the day.

Credits: **Defense given**, **Vulnerable given** and **Banes given** are the average damage they changed (the same roll made with and without the bonus); **reduced** is what Hallowed Stance took off; **Divine Surge given** is the extra damage allies dealt (not counted in anyone's own damage); **healed allies** is the Health its Lay On Hands gave back (from the allies' own Rally Points); **new Health** is healing that uses no Rally Point; **Font of Mercy** is the extra Health on every Rally Point used in the party. A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. **Nova turns** are the turns with an Encounter or Daily Action. Debuffs with no number in the fight (Prone, Hindered, Immobilized) are counted.

### Standard day (easy, normal, normal, hard)

Fight 1: 2 standard, 4 minion (CV 3) · Fight 2: 4 standard (CV 4) · Fight 3: 1 elite, 2 standard (CV 4) · Fight 4: 2 elite, 2 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 12% · a PC Down during the day 99% · Downs a day 5.03 · Rally Points left at the end 26% · Health at the end 7%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 23% | 11% |
| 2: 4 standard | 95% | 3.9 | 42% | 49% |
| 3: 1 elite, 2 standard | 96% | 3.9 | 40% | 53% |
| 4: 2 elite, 2 standard | 14% | 4.5 | 80% | 98% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 274.9 | 236.4 |
| Damage a turn (its own turns) | 25.8 | 20.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 25.0 | 22.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 10.7 | 11.3 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 99.1 | 60.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 3.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 95.9 | 60.5 |
| Damage taken a round of combat | 6.6 | 4.2 |
| Times Down | 1.27 | 1.25 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.27 | 0.04 |
| Rally Points used through an ally's Lay On Hands | 1.48 | 1.69 |
| Rally Points used between fights | 3.74 | 2.88 |
| Rally Points left | 1.52 | 2.39 |
| **Buffs:** healed allies (Lay On Hands) | 25.1 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 5.6 | 4.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 6.7 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 40.3 |
| ... into melee (1 Bane) | 0.0 | 24.8 |
| ... with Cover | 0.0 | 17.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.79 | 5.83 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.57 |
| **Debuff:** Immobilized (times) | 0.00 | 2.26 |
| **Debuff:** Prone (times) | 0.79 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 97% · Downs a day 3.61 · Rally Points left at the end 34% · Health at the end 49%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 24% | 13% |
| 2: 4 standard | 98% | 4.0 | 39% | 48% |
| 3: 1 elite, 2 standard | 100% | 3.8 | 30% | 39% |
| 4: 2 elite, 2 standard | 60% | 6.3 | 70% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 320.8 | 254.5 |
| Damage a turn (its own turns) | 24.0 | 20.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 22.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.6 | 12.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 118.4 | 54.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.5 | 54.1 |
| Damage taken a round of combat | 4.9 | 3.2 |
| Times Down | 0.68 | 1.13 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.35 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.91 | 4.29 |
| Rally Points left | 2.74 | 2.35 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 22.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.2 | 0.0 |
| **Map:** AP spent moving | 6.7 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 8.7 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 43.4 |
| ... into melee (1 Bane) | 0.0 | 29.2 |
| ... with Cover | 0.0 | 19.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.3 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.05 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.75 |
| **Debuff:** Immobilized (times) | 0.00 | 2.30 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 63% · a PC Down during the day 98% · Downs a day 3.60 · Rally Points left at the end 29% · Health at the end 51%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 24% | 14% |
| 2: 4 standard | 99% | 4.1 | 40% | 46% |
| 3: 1 elite, 2 standard | 100% | 3.9 | 34% | 42% |
| 4: 2 elite, 2 standard | 64% | 6.7 | 68% | 90% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 333.7 | 257.8 |
| Damage a turn (its own turns) | 23.9 | 20.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 22.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.2 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.1 | 12.3 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 128.1 | 55.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 20.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.3 | 55.9 |
| Damage taken a round of combat | 4.9 | 3.2 |
| Times Down | 0.62 | 1.17 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.59 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.16 | 4.48 |
| Rally Points left | 2.25 | 2.14 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 7.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 22.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.7 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 9.3 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 44.1 |
| ... into melee (1 Bane) | 0.0 | 29.9 |
| ... with Cover | 0.0 | 20.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.12 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.85 |
| **Debuff:** Immobilized (times) | 0.00 | 2.27 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 73% · a PC Down during the day 85% · Downs a day 2.46 · Rally Points left at the end 21% · Health at the end 52%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 8% | 6% |
| 2: 4 standard | 100% | 3.9 | 15% | 23% |
| 3: 1 elite, 2 standard | 100% | 3.8 | 12% | 24% |
| 4: 2 elite, 2 standard | 73% | 6.3 | 49% | 80% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 311.7 | 275.3 |
| Damage a turn (its own turns) | 22.1 | 21.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.7 | 22.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.2 | 12.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 126.2 | 60.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 89.2 | 60.2 |
| Damage taken a round of combat | 5.3 | 3.6 |
| Times Down | 0.45 | 0.78 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.00 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.44 | 3.81 |
| Rally Points used between fights | 0.91 | 1.69 |
| Rally Points left | 1.65 | 1.48 |
| **Buffs:** healed allies (Lay On Hands) | 50.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 24.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.3 | 0.0 |
| **Map:** AP spent moving | 6.7 | 4.3 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 9.3 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 47.0 |
| ... into melee (1 Bane) | 0.0 | 32.7 |
| ... with Cover | 0.0 | 21.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.79 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.23 |
| **Debuff:** Immobilized (times) | 0.00 | 2.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 66% · a PC Down during the day 91% · Downs a day 2.90 · Rally Points left at the end 27% · Health at the end 49%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 13% | 6% |
| 2: 4 standard | 99% | 3.9 | 26% | 30% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 19% | 28% |
| 4: 2 elite, 2 standard | 66% | 6.1 | 58% | 84% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 326.6 | 301.7 | 265.8 |
| Damage a turn (its own turns) | 24.2 | 22.4 | 21.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 18.8 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - | - |
| Share of the party's damage (%) | 28 | 26 | 23 |
| Turns taken | 13.6 | 13.6 | 12.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 126.0 | 116.4 | 56.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 87.2 | 82.1 | 56.8 |
| Damage taken a round of combat | 5.3 | 5.0 | 3.4 |
| Times Down | 0.56 | 0.56 | 0.89 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.73 | 3.52 | 0.08 |
| Rally Points used through an ally's Lay On Hands | 2.98 | 0.00 | 2.27 |
| Rally Points used between fights | 2.23 | 2.17 | 2.83 |
| Rally Points left | 2.06 | 2.31 | 1.82 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 61.1 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 22.8 | 24.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.8 | 34.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 19.1 | 0.1 | 0.0 |
| **Map:** AP spent moving | 6.5 | 6.6 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 6.6 | 0.0 |
| Turns that start Engaged | 8.9 | 8.7 | 4.2 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 45.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 31.4 |
| ... with Cover | 0.0 | 0.0 | 20.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.0 | 11.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 6.51 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 2.13 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 4.05 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.45 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.86 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 75% · a PC Down during the day 94% · Downs a day 2.78 · Rally Points left at the end 37% · Health at the end 66%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 21% | 8% |
| 2: 4 standard | 100% | 3.8 | 35% | 34% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 28% | 32% |
| 4: 2 elite, 2 standard | 75% | 6.4 | 62% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 325.9 | 275.9 |
| Damage a turn (its own turns) | 24.0 | 22.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.7 | 12.3 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.8 | 53.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 81.5 | 53.7 |
| Damage taken a round of combat | 4.9 | 3.2 |
| Times Down | 0.46 | 0.93 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.38 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 4.05 | 4.21 |
| Rally Points left | 3.57 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 22.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 37.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.4 | 0.0 |
| **Map:** AP spent moving | 6.6 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 8.9 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 44.3 |
| ... into melee (1 Bane) | 0.0 | 30.4 |
| ... with Cover | 0.0 | 20.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.78 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.15 |
| **Debuff:** Hindered (times) | 0.00 | 2.31 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.56 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.90 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 86% · a PC Down during the day 71% · Downs a day 1.63 · Rally Points left at the end 28% · Health at the end 69%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 7% | 2% |
| 2: 4 standard | 100% | 3.7 | 11% | 16% |
| 3: 1 elite, 2 standard | 100% | 3.7 | 9% | 14% |
| 4: 2 elite, 2 standard | 86% | 6.0 | 35% | 64% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 308.4 | 297.2 |
| Damage a turn (its own turns) | 22.2 | 22.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.7 | 24.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 14.0 | 13.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 120.9 | 60.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.3 | 60.0 |
| Damage taken a round of combat | 5.3 | 3.7 |
| Times Down | 0.25 | 0.57 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.90 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.47 | 3.88 |
| Rally Points used between fights | 0.78 | 1.46 |
| Rally Points left | 2.86 | 1.65 |
| **Buffs:** healed allies (Lay On Hands) | 57.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 25.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 13.5 | 0.0 |
| **Map:** AP spent moving | 6.9 | 4.4 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 9.0 | 4.4 |
| Shots ([Ranged] Actions) | 0.0 | 47.8 |
| ... into melee (1 Bane) | 0.0 | 33.8 |
| ... with Cover | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 12.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.95 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.07 |
| **Debuff:** Hindered (times) | 0.00 | 2.52 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.89 |
| **Debuff:** Immobilized (times) | 0.00 | 0.54 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 82% · Downs a day 1.70 · Rally Points left at the end 45% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 7% |
| 2: 4 standard | 100% | 3.7 | 33% | 29% |
| 3: 1 elite, 2 standard | 100% | 3.3 | 23% | 22% |
| 4: 2 elite, 2 standard | 96% | 5.7 | 42% | 66% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 346.9 | 276.5 |
| Damage a turn (its own turns) | 25.8 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.9 | 24.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.2 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 13.5 | 12.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 106.0 | 51.1 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.0 | 0.0 |
| Damage taken | 64.4 | 51.1 |
| Damage taken a round of combat | 4.1 | 3.2 |
| Times Down | 0.16 | 0.69 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.76 | 0.31 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.49 | 4.83 |
| Rally Points left | 4.75 | 2.87 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 22.7 | 0.0 |
| Banes given (damage its areas stopped) | 3.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.9 | 0.0 |
| Guard given (damage it took instead of Health) | 31.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.1 | 0.0 |
| **Map:** AP spent moving | 6.9 | 3.9 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 8.5 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 43.8 |
| ... into melee (1 Bane) | 0.0 | 30.8 |
| ... with Cover | 0.0 | 20.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 12.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.76 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.12 |
| **Debuff:** Hindered (times) | 0.00 | 2.26 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.92 |
| **Debuff:** Immobilized (times) | 0.00 | 0.58 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.85 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 46% · Downs a day 0.69 · Rally Points left at the end 41% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 6% | 2% |
| 2: 4 standard | 100% | 3.7 | 9% | 11% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 6% | 8% |
| 4: 2 elite, 2 standard | 99% | 5.5 | 14% | 36% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 312.0 | 308.3 |
| Damage a turn (its own turns) | 22.9 | 23.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 25.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 13.7 | 13.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 108.0 | 57.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 9.7 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 68.0 | 57.6 |
| Damage taken a round of combat | 4.4 | 3.7 |
| Times Down | 0.06 | 0.28 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.06 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.08 | 4.18 |
| Rally Points used between fights | 0.46 | 1.24 |
| Rally Points left | 4.40 | 2.58 |
| **Buffs:** healed allies (Lay On Hands) | 56.7 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 25.0 | 0.0 |
| Banes given (damage its areas stopped) | 4.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.5 | 0.0 |
| Guard given (damage it took instead of Health) | 30.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 17.0 | 0.0 |
| **Map:** AP spent moving | 7.0 | 4.4 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 8.6 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 48.6 |
| ... into melee (1 Bane) | 0.0 | 35.0 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 11.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.08 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 2.12 |
| **Debuff:** Hindered (times) | 0.00 | 2.61 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.93 |
| **Debuff:** Immobilized (times) | 0.00 | 0.54 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 71% · a PC Down during the day 93% · Downs a day 2.98 · Rally Points left at the end 35% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 23% | 12% |
| 2: 4 standard | 100% | 3.7 | 34% | 37% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 28% | 31% |
| 4: 2 elite, 2 standard | 71% | 6.2 | 64% | 83% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 316.1 | 280.4 |
| Damage a turn (its own turns) | 24.1 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.3 | 11.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 108.1 | 50.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 74.1 | 50.2 |
| Damage taken a round of combat | 4.6 | 3.1 |
| Times Down | 0.52 | 0.97 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.25 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.24 |
| Rally Points left | 2.81 | 2.37 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.8 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.9 | 0.0 |
| **Map:** AP spent moving | 6.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.5 | 0.0 |
| Turns that start Engaged | 8.3 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 46.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 12.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.95 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.01 |
| **Debuff:** Immobilized (times) | 0.00 | 3.25 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.69 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 74% · a PC Down during the day 90% · Downs a day 2.73 · Rally Points left at the end 36% · Health at the end 64%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 23% | 11% |
| 2: 4 standard | 100% | 3.7 | 33% | 33% |
| 3: 1 elite, 2 standard | 100% | 3.6 | 27% | 30% |
| 4: 2 elite, 2 standard | 74% | 6.2 | 61% | 80% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 320.6 | 298.0 |
| Damage a turn (its own turns) | 23.9 | 24.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.5 | 12.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 106.0 | 47.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.7 | 47.8 |
| Damage taken a round of combat | 4.4 | 2.9 |
| Times Down | 0.50 | 0.87 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.17 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.94 | 4.14 |
| Rally Points left | 2.89 | 2.45 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 20.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 34.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 7.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.0 | 0.0 |
| Turns that start Engaged | 8.3 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 36.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 13.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.75 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 5.34 |
| **Debuff:** Immobilized (times) | 0.00 | 3.44 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.96 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 84% · a PC Down during the day 88% · Downs a day 2.20 · Rally Points left at the end 40% · Health at the end 76%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 20% | 9% |
| 2: 4 standard | 100% | 3.5 | 31% | 26% |
| 3: 1 elite, 2 standard | 100% | 3.4 | 26% | 26% |
| 4: 2 elite, 2 standard | 85% | 6.0 | 55% | 76% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 314.8 | 295.7 |
| Damage a turn (its own turns) | 24.0 | 24.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.2 | 11.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 102.6 | 49.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 70.4 | 49.8 |
| Damage taken a round of combat | 4.5 | 3.2 |
| Times Down | 0.34 | 0.76 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.11 | 0.42 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.85 | 4.17 |
| Rally Points left | 4.04 | 2.41 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 23.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 32.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.4 | 0.0 |
| **Map:** AP spent moving | 6.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.8 | 0.0 |
| Turns that start Engaged | 8.1 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 44.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 20.8 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 12.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.96 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.79 |
| **Debuff:** Immobilized (times) | 0.00 | 2.45 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 85% · a PC Down during the day 84% · Downs a day 2.07 · Rally Points left at the end 41% · Health at the end 77%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 21% | 9% |
| 2: 4 standard | 100% | 3.5 | 30% | 25% |
| 3: 1 elite, 2 standard | 100% | 3.5 | 24% | 23% |
| 4: 2 elite, 2 standard | 85% | 6.2 | 54% | 72% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 323.9 | 308.6 |
| Damage a turn (its own turns) | 23.8 | 25.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 13.7 | 12.4 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 104.6 | 47.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 71.1 | 47.3 |
| Damage taken a round of combat | 4.4 | 2.9 |
| Times Down | 0.32 | 0.71 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.20 | 0.41 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.81 | 3.95 |
| Rally Points left | 3.99 | 2.64 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.0 |
| Divine Surge given (extra damage dealt by allies) | 21.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 33.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.7 | 0.0 |
| **Map:** AP spent moving | 7.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.1 | 0.0 |
| Turns that start Engaged | 8.4 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 33.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 14.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.01 |
| **Debuff:** Immobilized (times) | 0.00 | 2.57 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.99 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.82 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 69% · Downs a day 1.16 · Rally Points left at the end 52% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 2.9 | 19% | 7% |
| 2: 4 standard | 100% | 3.4 | 29% | 20% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 20% | 14% |
| 4: 2 elite, 2 standard | 99% | 5.1 | 35% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 328.2 | 305.2 |
| Damage a turn (its own turns) | 26.3 | 26.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.0 | 25.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.4 | 28.4 |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.6 | 11.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 89.3 | 42.8 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 8.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 54.6 | 42.8 |
| Damage taken a round of combat | 3.8 | 3.0 |
| Times Down | 0.09 | 0.49 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.51 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.20 | 4.23 |
| Rally Points left | 5.28 | 3.48 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.1 |
| Divine Surge given (extra damage dealt by allies) | 22.2 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.6 | 0.0 |
| Guard given (damage it took instead of Health) | 26.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.0 | 0.0 |
| **Map:** AP spent moving | 6.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.6 | 0.0 |
| Turns that start Engaged | 7.6 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 41.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 19.6 |
| ... while Engaged (2 Banes) | 0.0 | 1.1 |
| Flanking Boons on its melee Actions | 12.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.84 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.42 |
| **Debuff:** Immobilized (times) | 0.00 | 2.27 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.15 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.01 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 99% · a PC Down during the day 64% · Downs a day 1.02 · Rally Points left at the end 53% · Health at the end 93%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 2 standard, 4 minion | 100% | 3.0 | 20% | 7% |
| 2: 4 standard | 100% | 3.5 | 28% | 19% |
| 3: 1 elite, 2 standard | 100% | 3.1 | 20% | 14% |
| 4: 2 elite, 2 standard | 99% | 5.0 | 32% | 46% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 330.0 | 322.3 |
| Damage a turn (its own turns) | 25.9 | 27.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.8 | 25.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.9 | 29.7 |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 12.8 | 11.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 87.2 | 41.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 7.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 1.8 | 0.0 |
| Damage taken | 53.2 | 41.6 |
| Damage taken a round of combat | 3.7 | 2.8 |
| Times Down | 0.08 | 0.43 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.53 | 0.29 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.09 | 4.13 |
| Rally Points left | 5.38 | 3.58 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 3.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.8 |
| Divine Surge given (extra damage dealt by allies) | 20.6 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 5.5 | 0.0 |
| Guard given (damage it took instead of Health) | 26.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.1 | 0.0 |
| **Map:** AP spent moving | 7.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 7.2 | 0.0 |
| Turns that start Engaged | 7.5 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 30.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 14.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.1 |
| Flanking Boons on its melee Actions | 13.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.36 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.60 |
| **Debuff:** Immobilized (times) | 0.00 | 2.39 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 1.01 |

### Long day (normal, hard, normal, hard)

Fight 1: 8 grunt (CV 4) · Fight 2: 6 standard (CV 6) · Fight 3: 2 elite (CV 4) · Fight 4: 1 elite, 4 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 1% · a PC Down during the day 100% · Downs a day 4.78 · Rally Points left at the end 48% · Health at the end 0%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 41% | 24% |
| 2: 6 standard | 25% | 4.6 | 83% | 95% |
| 3: 2 elite | 83% | 4.3 | 48% | 75% |
| 4: 1 elite, 4 standard | 2% | 3.0 | 60% | 100% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 184.7 | 155.9 |
| Damage a turn (its own turns) | 25.7 | 20.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.9 | 21.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 7.2 | 7.6 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 83.0 | 54.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.8 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.2 | 54.0 |
| Damage taken a round of combat | 8.3 | 5.6 |
| Times Down | 1.19 | 1.20 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.26 | 0.06 |
| Rally Points used through an ally's Lay On Hands | 1.13 | 1.41 |
| Rally Points used between fights | 2.08 | 1.82 |
| Rally Points left | 3.53 | 3.72 |
| **Buffs:** healed allies (Lay On Hands) | 20.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.8 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 2.6 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 1.8 | 0.0 |
| Turns that start Engaged | 5.4 | 3.9 |
| Shots ([Ranged] Actions) | 0.0 | 26.1 |
| ... into melee (1 Bane) | 0.0 | 14.5 |
| ... with Cover | 0.0 | 12.2 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 4.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.47 | 4.22 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.02 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.64 |
| **Debuff:** Immobilized (times) | 0.00 | 1.58 |
| **Debuff:** Prone (times) | 0.47 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.40 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 29% · a PC Down during the day 100% · Downs a day 4.77 · Rally Points left at the end 40% · Health at the end 20%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 42% | 33% |
| 2: 6 standard | 62% | 6.0 | 69% | 87% |
| 3: 2 elite | 100% | 3.8 | 35% | 46% |
| 4: 1 elite, 4 standard | 48% | 5.9 | 72% | 93% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 300.2 | 217.8 |
| Damage a turn (its own turns) | 24.1 | 20.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.6 | 21.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.2 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 12.7 | 10.5 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 136.2 | 61.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 89.0 | 61.0 |
| Damage taken a round of combat | 5.9 | 4.1 |
| Times Down | 0.93 | 1.46 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.57 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.20 | 3.90 |
| Rally Points left | 3.23 | 2.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 20.2 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 47.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 4.3 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.3 | 0.0 |
| Turns that start Engaged | 9.6 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 36.7 |
| ... into melee (1 Bane) | 0.0 | 23.4 |
| ... with Cover | 0.0 | 17.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 8.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.54 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.43 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.47 |
| **Debuff:** Immobilized (times) | 0.00 | 2.06 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 33% · a PC Down during the day 100% · Downs a day 4.78 · Rally Points left at the end 36% · Health at the end 22%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.1 | 42% | 33% |
| 2: 6 standard | 64% | 6.6 | 68% | 87% |
| 3: 2 elite | 99% | 4.1 | 36% | 53% |
| 4: 1 elite, 4 standard | 53% | 6.2 | 70% | 91% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 316.5 | 222.1 |
| Damage a turn (its own turns) | 23.8 | 20.2 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 21.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 13.6 | 10.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 150.1 | 63.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 28.6 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.1 | 0.0 |
| Damage taken | 92.5 | 62.9 |
| Damage taken a round of combat | 5.8 | 3.9 |
| Times Down | 0.86 | 1.52 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.84 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.34 | 4.07 |
| Rally Points left | 2.82 | 2.54 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 7.4 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 29.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.9 | 0.0 |
| **Map:** AP spent moving | 4.6 | 4.7 |
| AP lost to moving (Actions dropped or made smaller) | 4.6 | 0.0 |
| Turns that start Engaged | 10.3 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 37.4 |
| ... into melee (1 Bane) | 0.0 | 23.8 |
| ... with Cover | 0.0 | 17.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 9.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.73 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.46 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.56 |
| **Debuff:** Immobilized (times) | 0.00 | 2.17 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.59 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 35% · a PC Down during the day 96% · Downs a day 4.16 · Rally Points left at the end 19% · Health at the end 19%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 11% | 6% |
| 2: 6 standard | 82% | 5.9 | 37% | 62% |
| 3: 2 elite | 98% | 4.1 | 21% | 46% |
| 4: 1 elite, 4 standard | 43% | 5.6 | 58% | 92% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 320.3 | 267.6 |
| Damage a turn (its own turns) | 22.5 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 22.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.4 | 12.6 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 155.7 | 73.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 105.3 | 73.7 |
| Damage taken a round of combat | 6.2 | 4.3 |
| Times Down | 0.83 | 1.24 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 3.24 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.40 | 4.15 |
| Rally Points used between fights | 0.81 | 1.57 |
| Rally Points left | 1.55 | 1.26 |
| **Buffs:** healed allies (Lay On Hands) | 52.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 24.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 50.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.6 | 0.0 |
| **Map:** AP spent moving | 5.3 | 5.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.3 | 0.0 |
| Turns that start Engaged | 10.6 | 5.6 |
| Shots ([Ranged] Actions) | 0.0 | 45.0 |
| ... into melee (1 Bane) | 0.0 | 29.7 |
| ... with Cover | 0.0 | 21.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 10.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 6.95 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.62 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.35 |
| **Debuff:** Immobilized (times) | 0.00 | 2.60 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.64 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 34% · a PC Down during the day 97% · Downs a day 4.20 · Rally Points left at the end 30% · Health at the end 20%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 4.0 | 26% | 13% |
| 2: 6 standard | 69% | 5.8 | 55% | 76% |
| 3: 2 elite | 99% | 3.9 | 22% | 41% |
| 4: 1 elite, 4 standard | 50% | 5.8 | 60% | 89% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 319.2 | 296.2 | 237.3 |
| Damage a turn (its own turns) | 24.3 | 22.8 | 20.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.9 | 19.5 | 21.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.3 | - | - |
| Share of the party's damage (%) | 29 | 27 | 22 |
| Turns taken | 13.4 | 13.3 | 11.3 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 142.2 | 140.5 | 65.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 93.5 | 94.7 | 65.9 |
| Damage taken a round of combat | 6.1 | 6.2 | 4.3 |
| Times Down | 0.82 | 0.84 | 1.27 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.84 | 3.71 | 0.08 |
| Rally Points used through an ally's Lay On Hands | 2.66 | 0.00 | 2.30 |
| Rally Points used between fights | 1.83 | 1.88 | 2.67 |
| Rally Points left | 2.67 | 2.41 | 1.95 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 58.5 | 0.0 |
| Defense given (damage it stopped) | 7.5 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 22.9 | 21.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.7 | 45.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.6 | 0.1 | 0.0 |
| **Map:** AP spent moving | 4.9 | 4.7 | 5.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.9 | 4.7 | 0.0 |
| Turns that start Engaged | 9.8 | 9.9 | 5.1 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 40.1 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 26.2 |
| ... with Cover | 0.0 | 0.0 | 18.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.2 | 8.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 6.18 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.46 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.81 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 2.37 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.57 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 51% · a PC Down during the day 98% · Downs a day 4.06 · Rally Points left at the end 37% · Health at the end 40%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 38% | 23% |
| 2: 6 standard | 74% | 6.1 | 62% | 82% |
| 3: 2 elite | 100% | 3.7 | 31% | 39% |
| 4: 1 elite, 4 standard | 69% | 6.1 | 63% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 329.5 | 259.1 |
| Damage a turn (its own turns) | 23.7 | 21.9 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 23.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 14.1 | 11.7 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 144.5 | 65.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 94.1 | 65.9 |
| Damage taken a round of combat | 5.8 | 4.0 |
| Times Down | 0.70 | 1.33 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.72 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.68 | 4.31 |
| Rally Points left | 3.60 | 2.24 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 7.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 22.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 50.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.0 | 0.0 |
| **Map:** AP spent moving | 5.1 | 4.9 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 10.4 | 5.0 |
| Shots ([Ranged] Actions) | 0.0 | 40.8 |
| ... into melee (1 Bane) | 0.0 | 26.7 |
| ... with Cover | 0.0 | 19.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.7 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.24 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.55 |
| **Debuff:** Hindered (times) | 0.00 | 2.35 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.56 |
| **Debuff:** Immobilized (times) | 0.00 | 0.33 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.62 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 65% · a PC Down during the day 89% · Downs a day 2.94 · Rally Points left at the end 19% · Health at the end 43%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 10% | 3% |
| 2: 6 standard | 90% | 5.6 | 28% | 50% |
| 3: 2 elite | 100% | 3.8 | 13% | 25% |
| 4: 1 elite, 4 standard | 73% | 6.2 | 45% | 81% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 346.3 | 311.1 |
| Damage a turn (its own turns) | 22.3 | 22.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.3 | 24.4 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 15.6 | 13.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 160.1 | 77.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 108.3 | 77.3 |
| Damage taken a round of combat | 6.0 | 4.3 |
| Times Down | 0.51 | 0.97 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 3.42 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.72 | 4.57 |
| Rally Points used between fights | 0.80 | 1.42 |
| Rally Points left | 2.06 | 0.99 |
| **Buffs:** healed allies (Lay On Hands) | 65.4 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 27.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 51.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 16.0 | 0.0 |
| **Map:** AP spent moving | 6.0 | 5.8 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 11.3 | 6.0 |
| Shots ([Ranged] Actions) | 0.0 | 49.1 |
| ... into melee (1 Bane) | 0.0 | 33.8 |
| ... with Cover | 0.0 | 23.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 11.5 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.80 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.68 |
| **Debuff:** Hindered (times) | 0.00 | 2.81 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.64 |
| **Debuff:** Immobilized (times) | 0.00 | 0.36 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.65 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 90% · a PC Down during the day 93% · Downs a day 2.69 · Rally Points left at the end 34% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 37% | 20% |
| 2: 6 standard | 95% | 5.8 | 44% | 70% |
| 3: 2 elite | 100% | 3.3 | 24% | 26% |
| 4: 1 elite, 4 standard | 95% | 5.6 | 47% | 67% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 413.0 | 297.4 |
| Damage a turn (its own turns) | 26.3 | 22.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.3 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.9 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 15.8 | 13.1 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 143.9 | 68.5 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.2 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.6 | 0.0 |
| Damage taken | 78.6 | 68.4 |
| Damage taken a round of combat | 4.4 | 3.8 |
| Times Down | 0.25 | 1.10 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 1.04 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.93 | 5.90 |
| Rally Points left | 4.03 | 1.70 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 26.6 | 0.0 |
| Banes given (damage its areas stopped) | 2.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.9 | 0.0 |
| Guard given (damage it took instead of Health) | 49.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.6 | 0.0 |
| **Map:** AP spent moving | 6.2 | 5.3 |
| AP lost to moving (Actions dropped or made smaller) | 6.2 | 0.0 |
| Turns that start Engaged | 11.3 | 5.4 |
| Shots ([Ranged] Actions) | 0.0 | 46.1 |
| ... into melee (1 Bane) | 0.0 | 31.5 |
| ... with Cover | 0.0 | 22.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.7 |
| Flanking Boons on its melee Actions | 13.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.65 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.81 |
| **Debuff:** Hindered (times) | 0.00 | 2.57 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.68 |
| **Debuff:** Immobilized (times) | 0.00 | 0.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.69 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 64% · Downs a day 1.24 · Rally Points left at the end 29% · Health at the end 79%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 8% | 1% |
| 2: 6 standard | 99% | 5.4 | 12% | 27% |
| 3: 2 elite | 100% | 3.5 | 8% | 14% |
| 4: 1 elite, 4 standard | 97% | 5.5 | 19% | 52% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 377.7 | 347.5 |
| Damage a turn (its own turns) | 23.5 | 23.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.8 | 24.9 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 16.1 | 14.7 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 148.0 | 78.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 16.4 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 3.0 | 0.0 |
| Damage taken | 84.5 | 78.6 |
| Damage taken a round of combat | 4.7 | 4.3 |
| Times Down | 0.10 | 0.52 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.61 | 0.00 |
| Rally Points used through an ally's Lay On Hands | 2.39 | 5.42 |
| Rally Points used between fights | 0.42 | 1.26 |
| Rally Points left | 3.57 | 1.32 |
| **Buffs:** healed allies (Lay On Hands) | 70.2 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.7 |
| Divine Surge given (extra damage dealt by allies) | 30.4 | 0.0 |
| Banes given (damage its areas stopped) | 1.7 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.9 | 0.0 |
| Guard given (damage it took instead of Health) | 47.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 24.7 | 0.0 |
| **Map:** AP spent moving | 6.9 | 6.2 |
| AP lost to moving (Actions dropped or made smaller) | 6.9 | 0.0 |
| Turns that start Engaged | 11.2 | 6.4 |
| Shots ([Ranged] Actions) | 0.0 | 53.3 |
| ... into melee (1 Bane) | 0.0 | 37.5 |
| ... with Cover | 0.0 | 24.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.8 |
| Flanking Boons on its melee Actions | 12.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.19 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.82 |
| **Debuff:** Hindered (times) | 0.00 | 3.09 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.70 |
| **Debuff:** Immobilized (times) | 0.00 | 0.40 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.71 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 48% · a PC Down during the day 98% · Downs a day 4.05 · Rally Points left at the end 35% · Health at the end 36%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 38% | 25% |
| 2: 6 standard | 72% | 6.0 | 62% | 81% |
| 3: 2 elite | 100% | 3.6 | 29% | 33% |
| 4: 1 elite, 4 standard | 68% | 6.0 | 64% | 84% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 316.0 | 264.1 |
| Damage a turn (its own turns) | 23.9 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 13.5 | 11.1 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 130.8 | 58.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.6 | 58.6 |
| Damage taken a round of combat | 5.5 | 3.8 |
| Times Down | 0.73 | 1.30 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.53 | 0.43 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.56 | 4.16 |
| Rally Points left | 2.92 | 2.40 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 22.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 46.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 5.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.0 | 0.0 |
| Turns that start Engaged | 9.7 | 4.5 |
| Shots ([Ranged] Actions) | 0.0 | 43.5 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 21.9 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 10.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.67 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.73 |
| **Debuff:** Immobilized (times) | 0.00 | 2.96 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.98 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 54% · a PC Down during the day 98% · Downs a day 3.99 · Rally Points left at the end 33% · Health at the end 40%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.9 | 38% | 25% |
| 2: 6 standard | 77% | 6.1 | 61% | 81% |
| 3: 2 elite | 100% | 3.6 | 28% | 31% |
| 4: 1 elite, 4 standard | 70% | 6.3 | 62% | 85% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 332.4 | 284.0 |
| Damage a turn (its own turns) | 23.6 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.7 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.3 | 11.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 132.3 | 58.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.3 | 58.9 |
| Damage taken a round of combat | 5.1 | 3.5 |
| Times Down | 0.71 | 1.28 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.51 | 0.50 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.75 | 4.27 |
| Rally Points left | 2.73 | 2.24 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 23.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.3 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 10.2 | 4.7 |
| Shots ([Ranged] Actions) | 0.0 | 34.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 11.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.39 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.99 |
| **Debuff:** Immobilized (times) | 0.00 | 3.20 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.21 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 67% · a PC Down during the day 96% · Downs a day 3.35 · Rally Points left at the end 35% · Health at the end 56%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 35% | 18% |
| 2: 6 standard | 82% | 5.9 | 56% | 74% |
| 3: 2 elite | 100% | 3.4 | 28% | 31% |
| 4: 1 elite, 4 standard | 82% | 6.0 | 56% | 76% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 339.5 | 292.4 |
| Damage a turn (its own turns) | 23.7 | 24.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 36.0 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.5 | 12.0 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 134.8 | 62.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 86.7 | 62.9 |
| Damage taken a round of combat | 5.3 | 3.8 |
| Times Down | 0.51 | 1.17 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.60 | 0.48 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.88 | 4.51 |
| Rally Points left | 3.52 | 2.01 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 25.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 48.1 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.6 | 0.0 |
| **Map:** AP spent moving | 5.5 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.5 | 0.0 |
| Turns that start Engaged | 10.3 | 4.8 |
| Shots ([Ranged] Actions) | 0.0 | 44.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 22.4 |
| ... while Engaged (2 Banes) | 0.0 | 1.3 |
| Flanking Boons on its melee Actions | 11.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.91 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.09 |
| **Debuff:** Immobilized (times) | 0.00 | 2.60 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.21 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.58 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 95% · Downs a day 3.14 · Rally Points left at the end 34% · Health at the end 61%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.8 | 35% | 18% |
| 2: 6 standard | 85% | 6.1 | 54% | 72% |
| 3: 2 elite | 100% | 3.5 | 26% | 24% |
| 4: 1 elite, 4 standard | 86% | 6.3 | 54% | 74% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 353.9 | 310.0 |
| Damage a turn (its own turns) | 23.6 | 24.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.4 | 24.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.9 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 15.2 | 12.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 134.8 | 61.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 85.4 | 61.7 |
| Damage taken a round of combat | 4.9 | 3.5 |
| Times Down | 0.47 | 1.10 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.58 | 0.52 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.98 | 4.55 |
| Rally Points left | 3.44 | 1.92 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 25.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 49.5 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.6 | 0.0 |
| **Map:** AP spent moving | 6.0 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.0 | 0.0 |
| Turns that start Engaged | 10.8 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 34.4 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 16.8 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 10.58 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.33 |
| **Debuff:** Immobilized (times) | 0.00 | 2.78 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.47 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 86% · Downs a day 1.92 · Rally Points left at the end 39% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.6 | 33% | 12% |
| 2: 6 standard | 98% | 5.2 | 38% | 57% |
| 3: 2 elite | 100% | 3.1 | 21% | 15% |
| 4: 1 elite, 4 standard | 98% | 5.1 | 41% | 57% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 389.2 | 338.2 |
| Damage a turn (its own turns) | 26.3 | 26.3 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.2 | 25.5 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.4 | 28.2 |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 14.8 | 12.8 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 124.8 | 59.6 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 14.2 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 68.3 | 59.6 |
| Damage taken a round of combat | 4.1 | 3.5 |
| Times Down | 0.15 | 0.81 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.82 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.66 | 5.52 |
| Rally Points left | 4.52 | 2.10 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.2 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.8 |
| Divine Surge given (extra damage dealt by allies) | 28.2 | 0.0 |
| Banes given (damage its areas stopped) | 1.8 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.6 | 0.0 |
| Guard given (damage it took instead of Health) | 42.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.7 | 0.0 |
| **Map:** AP spent moving | 6.3 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.3 | 0.0 |
| Turns that start Engaged | 10.0 | 5.0 |
| Shots ([Ranged] Actions) | 0.0 | 46.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 23.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.5 |
| Flanking Boons on its melee Actions | 12.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.14 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.12 |
| **Debuff:** Immobilized (times) | 0.00 | 2.68 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.35 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.84 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 97% · a PC Down during the day 84% · Downs a day 1.73 · Rally Points left at the end 41% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 8 grunt | 100% | 3.7 | 32% | 13% |
| 2: 6 standard | 98% | 5.2 | 35% | 55% |
| 3: 2 elite | 100% | 3.1 | 20% | 14% |
| 4: 1 elite, 4 standard | 99% | 5.1 | 39% | 53% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 391.3 | 357.5 |
| Damage a turn (its own turns) | 26.3 | 27.1 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 26.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 34.6 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 14.9 | 13.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 118.4 | 57.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 13.5 | 0.2 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 64.3 | 57.0 |
| Damage taken a round of combat | 3.8 | 3.3 |
| Times Down | 0.13 | 0.73 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.70 | 0.40 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.57 | 5.32 |
| Rally Points left | 4.74 | 2.29 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 2.4 |
| Divine Surge given (extra damage dealt by allies) | 27.0 | 0.0 |
| Banes given (damage its areas stopped) | 1.9 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.3 | 0.0 |
| **Map:** AP spent moving | 6.7 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 6.7 | 0.0 |
| Turns that start Engaged | 10.0 | 5.0 |
| Shots ([Ranged] Actions) | 0.0 | 34.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 13.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 11.50 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.20 |
| **Debuff:** Immobilized (times) | 0.00 | 2.84 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 4.46 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.86 |

### Short hard day (normal, hard, hard)

Fight 1: 4 standard (CV 4) · Fight 2: 2 elite, 2 standard (CV 6) · Fight 3: 6 standard (CV 6)

**Level 1, the book's Paladin today** (paladin-book-1, paladin-book-1, archer-1, archer-1; NPCs of level 1): the day cleared 2% · a PC Down during the day 100% · Downs a day 4.80 · Rally Points left at the end 52% · Health at the end 1%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 97% | 3.8 | 43% | 41% |
| 2: 2 elite, 2 standard | 25% | 5.2 | 85% | 96% |
| 3: 6 standard | 9% | 3.9 | 79% | 99% |

| Per PC, over the day | Paladin (book) `paladin-book-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 168.3 | 151.1 |
| Damage a turn (its own turns) | 25.2 | 20.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 24.3 | 22.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 6.7 | 7.2 |
| Health Pool | 36 | 27 |
| Damage aimed at it (before reduction) | 80.0 | 51.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 2.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 77.2 | 51.2 |
| Damage taken a round of combat | 8.0 | 5.3 |
| Times Down | 1.22 | 1.18 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.15 | 0.05 |
| Rally Points used through an ally's Lay On Hands | 1.00 | 1.28 |
| Rally Points used between fights | 2.02 | 1.64 |
| Rally Points left | 3.83 | 4.03 |
| **Buffs:** healed allies (Lay On Hands) | 17.9 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.0 |
| Divine Surge given (extra damage dealt by allies) | 0.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 0.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 0.0 | 0.0 |
| **Map:** AP spent moving | 2.9 | 3.0 |
| AP lost to moving (Actions dropped or made smaller) | 2.1 | 0.0 |
| Turns that start Engaged | 4.5 | 3.0 |
| Shots ([Ranged] Actions) | 0.0 | 25.4 |
| ... into melee (1 Bane) | 0.0 | 14.3 |
| ... with Cover | 0.0 | 11.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 4.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.41 | 3.90 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.08 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.41 |
| **Debuff:** Immobilized (times) | 0.00 | 1.49 |
| **Debuff:** Prone (times) | 0.41 | 0.00 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.45 |

**Level 1, P1 Smite** (paladin-smite-1, paladin-smite-1, archer-1, archer-1; NPCs of level 1): the day cleared 37% · a PC Down during the day 99% · Downs a day 4.31 · Rally Points left at the end 46% · Health at the end 30%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.9 | 39% | 39% |
| 2: 2 elite, 2 standard | 63% | 6.3 | 69% | 88% |
| 3: 6 standard | 58% | 5.9 | 70% | 87% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 248.2 | 184.5 |
| Damage a turn (its own turns) | 23.6 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 21.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 10.8 | 8.9 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 121.1 | 52.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 80.9 | 52.2 |
| Damage taken a round of combat | 6.1 | 3.9 |
| Times Down | 0.86 | 1.29 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.58 | 0.35 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.79 | 3.31 |
| Rally Points left | 3.63 | 3.35 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.1 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 16.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.2 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.1 | 0.0 |
| **Map:** AP spent moving | 4.0 | 3.3 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 7.8 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 31.2 |
| ... into melee (1 Bane) | 0.0 | 20.2 |
| ... with Cover | 0.0 | 14.5 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.59 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.30 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.87 |
| **Debuff:** Immobilized (times) | 0.00 | 1.72 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 1, P1 Smite holding Escalation** (paladin-smite-1-hold, paladin-smite-1-hold, archer-1, archer-1; NPCs of level 1): the day cleared 38% · a PC Down during the day 100% · Downs a day 4.41 · Rally Points left at the end 43% · Health at the end 31%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 4.0 | 41% | 44% |
| 2: 2 elite, 2 standard | 66% | 6.6 | 67% | 88% |
| 3: 6 standard | 57% | 6.3 | 71% | 90% |

| Per PC, over the day | Paladin (Smite, hold) `paladin-smite-1-hold` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 259.4 | 187.2 |
| Damage a turn (its own turns) | 23.3 | 20.5 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 21.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 11.4 | 9.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 134.7 | 55.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 24.5 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 83.8 | 55.2 |
| Damage taken a round of combat | 6.0 | 3.9 |
| Times Down | 0.84 | 1.37 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.78 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.87 | 3.56 |
| Rally Points left | 3.35 | 3.09 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 6.7 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 26.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 8.4 | 0.0 |
| **Map:** AP spent moving | 4.0 | 3.5 |
| AP lost to moving (Actions dropped or made smaller) | 4.0 | 0.0 |
| Turns that start Engaged | 8.4 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 31.6 |
| ... into melee (1 Bane) | 0.0 | 20.4 |
| ... with Cover | 0.0 | 14.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 8.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 4.70 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.29 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 2.94 |
| **Debuff:** Immobilized (times) | 0.00 | 1.76 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 1, P1 Lay On Hands** (paladin-hands-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 55% · a PC Down during the day 92% · Downs a day 3.24 · Rally Points left at the end 25% · Health at the end 37%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.9 | 15% | 20% |
| 2: 2 elite, 2 standard | 82% | 6.1 | 39% | 67% |
| 3: 6 standard | 67% | 5.9 | 51% | 78% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|
| Damage dealt | 263.8 | 225.1 |
| Damage a turn (its own turns) | 22.0 | 21.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.0 | 22.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.1 | 10.4 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 133.8 | 62.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 92.5 | 62.7 |
| Damage taken a round of combat | 6.5 | 4.3 |
| Times Down | 0.62 | 1.00 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 2.91 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.24 | 3.44 |
| Rally Points used between fights | 0.86 | 1.77 |
| Rally Points left | 1.99 | 1.77 |
| **Buffs:** healed allies (Lay On Hands) | 46.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 20.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 12.8 | 0.0 |
| **Map:** AP spent moving | 4.6 | 4.2 |
| AP lost to moving (Actions dropped or made smaller) | 4.6 | 0.0 |
| Turns that start Engaged | 8.8 | 4.3 |
| Shots ([Ranged] Actions) | 0.0 | 37.7 |
| ... into melee (1 Bane) | 0.0 | 25.3 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 9.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 5.78 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.38 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.61 |
| **Debuff:** Immobilized (times) | 0.00 | 2.17 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.57 |

**Level 1, P1 one of each** (paladin-smite-1, paladin-hands-1, archer-1, archer-1; NPCs of level 1): the day cleared 44% · a PC Down during the day 97% · Downs a day 3.82 · Rally Points left at the end 35% · Health at the end 32%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 99% | 3.9 | 26% | 28% |
| 2: 2 elite, 2 standard | 72% | 6.4 | 56% | 82% |
| 3: 6 standard | 63% | 5.8 | 57% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Paladin (Lay On Hands) `paladin-hands-1` | Archer `archer-1` |
|---|---:|---:|---:|
| Damage dealt | 264.0 | 247.1 | 203.0 |
| Damage a turn (its own turns) | 23.4 | 22.2 | 21.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.5 | 18.9 | 22.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - | - |
| Share of the party's damage (%) | 29 | 27 | 22 |
| Turns taken | 11.4 | 11.2 | 9.5 |
| Health Pool | 39 | 39 | 27 |
| Damage aimed at it (before reduction) | 130.6 | 121.9 | 58.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 | 0.0 |
| Damage taken | 88.0 | 83.3 | 58.4 |
| Damage taken a round of combat | 6.4 | 6.0 | 4.2 |
| Times Down | 0.74 | 0.75 | 1.17 |
| Rally Points (of 8 / 8 / 7): used in combat (Steel Yourself) | 0.97 | 3.38 | 0.10 |
| Rally Points used through an ally's Lay On Hands | 2.48 | 0.00 | 1.88 |
| Rally Points used between fights | 1.80 | 1.69 | 2.69 |
| Rally Points left | 2.75 | 2.94 | 2.34 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 50.7 | 0.0 |
| Defense given (damage it stopped) | 7.1 | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 | 1.3 |
| Divine Surge given (extra damage dealt by allies) | 18.3 | 18.5 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 42.6 | 38.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 18.4 | 0.1 | 0.0 |
| **Map:** AP spent moving | 4.4 | 4.3 | 3.8 |
| AP lost to moving (Actions dropped or made smaller) | 4.4 | 4.3 | 0.0 |
| Turns that start Engaged | 8.3 | 8.1 | 3.8 |
| Shots ([Ranged] Actions) | 0.0 | 0.0 | 34.3 |
| ... into melee (1 Bane) | 0.0 | 0.0 | 22.5 |
| ... with Cover | 0.0 | 0.0 | 15.6 |
| ... while Engaged (2 Banes) | 0.0 | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.1 | 8.3 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 0.00 | 5.20 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 0.00 | 1.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.00 | 3.25 |
| **Debuff:** Immobilized (times) | 0.00 | 0.00 | 1.95 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.00 | 0.55 |

**Level 2, P1 Smite** (paladin-smite-2, paladin-smite-2, archer-2, archer-2; NPCs of level 2): the day cleared 57% · a PC Down during the day 97% · Downs a day 3.70 · Rally Points left at the end 44% · Health at the end 51%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.7 | 36% | 30% |
| 2: 2 elite, 2 standard | 76% | 6.4 | 63% | 84% |
| 3: 6 standard | 75% | 6.1 | 61% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 273.9 | 213.9 |
| Damage a turn (its own turns) | 23.3 | 22.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.2 | 23.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 28 | 22 |
| Turns taken | 11.9 | 9.6 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 127.7 | 56.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 84.3 | 56.4 |
| Damage taken a round of combat | 5.9 | 3.9 |
| Times Down | 0.65 | 1.20 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.70 | 0.42 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.15 | 3.77 |
| Rally Points left | 4.15 | 2.82 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.5 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 18.9 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 43.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.8 | 0.0 |
| **Map:** AP spent moving | 4.5 | 3.7 |
| AP lost to moving (Actions dropped or made smaller) | 4.5 | 0.0 |
| Turns that start Engaged | 8.6 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 33.9 |
| ... into melee (1 Bane) | 0.0 | 22.6 |
| ... with Cover | 0.0 | 15.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.4 |
| Flanking Boons on its melee Actions | 9.6 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.70 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.34 |
| **Debuff:** Hindered (times) | 0.00 | 1.86 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.53 |
| **Debuff:** Immobilized (times) | 0.00 | 0.30 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.54 |

**Level 2, P1 Lay On Hands** (paladin-hands-2, paladin-hands-2, archer-2, archer-2; NPCs of level 2): the day cleared 77% · a PC Down during the day 83% · Downs a day 2.35 · Rally Points left at the end 26% · Health at the end 58%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.7 | 12% | 14% |
| 2: 2 elite, 2 standard | 92% | 5.8 | 28% | 54% |
| 3: 6 standard | 83% | 6.0 | 38% | 65% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-2` | Archer `archer-2` |
|---|---:|---:|
| Damage dealt | 279.0 | 257.9 |
| Damage a turn (its own turns) | 22.0 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 24.6 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.8 | 11.1 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 133.9 | 67.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 92.2 | 67.0 |
| Damage taken a round of combat | 6.2 | 4.5 |
| Times Down | 0.38 | 0.80 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 2.89 | 0.02 |
| Rally Points used through an ally's Lay On Hands | 2.47 | 3.88 |
| Rally Points used between fights | 0.84 | 1.69 |
| Rally Points left | 2.79 | 1.41 |
| **Buffs:** healed allies (Lay On Hands) | 57.3 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 22.3 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 14.1 | 0.0 |
| **Map:** AP spent moving | 5.1 | 4.5 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 9.1 | 4.6 |
| Shots ([Ranged] Actions) | 0.0 | 40.5 |
| ... into melee (1 Bane) | 0.0 | 28.0 |
| ... with Cover | 0.0 | 18.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.19 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.38 |
| **Debuff:** Hindered (times) | 0.00 | 2.34 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.54 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 3, P1 Smite** (paladin-smite-3, paladin-smite-3, archer-3, archer-3; NPCs of level 3): the day cleared 93% · a PC Down during the day 90% · Downs a day 2.27 · Rally Points left at the end 45% · Health at the end 86%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 33% | 24% |
| 2: 2 elite, 2 standard | 97% | 5.6 | 41% | 65% |
| 3: 6 standard | 95% | 5.6 | 47% | 62% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 326.1 | 242.1 |
| Damage a turn (its own turns) | 25.8 | 23.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.0 | 24.3 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.7 | - |
| Share of the party's damage (%) | 29 | 21 |
| Turns taken | 12.7 | 10.5 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.8 | 55.2 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 13.7 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.7 | 0.0 |
| Damage taken | 66.7 | 55.1 |
| Damage taken a round of combat | 4.6 | 3.8 |
| Times Down | 0.23 | 0.91 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.92 | 0.37 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.20 | 4.95 |
| Rally Points left | 4.88 | 2.68 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.4 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 21.2 | 0.0 |
| Banes given (damage its areas stopped) | 4.1 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.7 | 0.0 |
| Guard given (damage it took instead of Health) | 39.4 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 5.1 | 0.0 |
| **Map:** AP spent moving | 5.1 | 4.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 9.0 | 4.0 |
| Shots ([Ranged] Actions) | 0.0 | 37.3 |
| ... into melee (1 Bane) | 0.0 | 25.9 |
| ... with Cover | 0.0 | 17.3 |
| ... while Engaged (2 Banes) | 0.0 | 0.5 |
| Flanking Boons on its melee Actions | 11.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 2.96 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.45 |
| **Debuff:** Hindered (times) | 0.00 | 2.06 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.58 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 3, P1 Lay On Hands** (paladin-hands-3, paladin-hands-3, archer-3, archer-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 53% · Downs a day 0.86 · Rally Points left at the end 39% · Health at the end 87%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.7 | 10% | 7% |
| 2: 2 elite, 2 standard | 100% | 5.3 | 10% | 26% |
| 3: 6 standard | 98% | 5.3 | 16% | 36% |

| Per PC, over the day | Paladin (Lay On Hands) `paladin-hands-3` | Archer `archer-3` |
|---|---:|---:|
| Damage dealt | 293.0 | 284.7 |
| Damage a turn (its own turns) | 23.0 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 20.9 | 25.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 28.4 | - |
| Share of the party's damage (%) | 25 | 25 |
| Turns taken | 12.8 | 11.9 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 119.9 | 64.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 12.7 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.4 | 0.0 |
| Damage taken | 70.4 | 64.8 |
| Damage taken a round of combat | 5.0 | 4.5 |
| Times Down | 0.07 | 0.36 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 2.12 | 0.01 |
| Rally Points used through an ally's Lay On Hands | 2.03 | 4.54 |
| Rally Points used between fights | 0.41 | 1.30 |
| Rally Points left | 4.45 | 2.15 |
| **Buffs:** healed allies (Lay On Hands) | 59.0 | 0.0 |
| Defense given (damage it stopped) | 0.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.5 |
| Divine Surge given (extra damage dealt by allies) | 24.0 | 0.0 |
| Banes given (damage its areas stopped) | 4.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 4.5 | 0.0 |
| Guard given (damage it took instead of Health) | 36.8 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 20.9 | 0.0 |
| **Map:** AP spent moving | 5.6 | 4.8 |
| AP lost to moving (Actions dropped or made smaller) | 5.6 | 0.0 |
| Turns that start Engaged | 8.8 | 4.9 |
| Shots ([Ranged] Actions) | 0.0 | 43.6 |
| ... into melee (1 Bane) | 0.0 | 31.2 |
| ... with Cover | 0.0 | 19.9 |
| ... while Engaged (2 Banes) | 0.0 | 0.6 |
| Flanking Boons on its melee Actions | 10.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 3.41 |
| **Debuff:** Bane on its next Save (times) | 0.00 | 1.47 |
| **Debuff:** Hindered (times) | 0.00 | 2.52 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 0.57 |
| **Debuff:** Immobilized (times) | 0.00 | 0.32 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.60 |

**Level 1, A1 Double Shot** (paladin-smite-1, paladin-smite-1, archer-double-1, archer-double-1; NPCs of level 1): the day cleared 52% · a PC Down during the day 97% · Downs a day 3.74 · Rally Points left at the end 44% · Health at the end 45%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 35% | 30% |
| 2: 2 elite, 2 standard | 71% | 6.3 | 64% | 83% |
| 3: 6 standard | 74% | 5.9 | 62% | 81% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Double Shot) `archer-double-1` |
|---|---:|---:|
| Damage dealt | 255.9 | 213.5 |
| Damage a turn (its own turns) | 23.5 | 23.8 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 23.8 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.1 | 9.0 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 114.5 | 50.3 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 75.6 | 50.3 |
| Damage taken a round of combat | 5.7 | 3.7 |
| Times Down | 0.71 | 1.16 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.48 | 0.39 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.03 | 3.56 |
| Rally Points left | 3.49 | 3.05 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.7 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 18.1 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 38.9 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.2 | 0.0 |
| Turns that start Engaged | 7.8 | 3.3 |
| Shots ([Ranged] Actions) | 0.0 | 35.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.0 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 9.1 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.60 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.78 |
| **Debuff:** Immobilized (times) | 0.00 | 2.44 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.38 |

**Level 1, A1 Rolling Shot** (paladin-smite-1, paladin-smite-1, archer-rolling-1, archer-rolling-1; NPCs of level 1): the day cleared 58% · a PC Down during the day 98% · Downs a day 3.67 · Rally Points left at the end 41% · Health at the end 50%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.6 | 34% | 28% |
| 2: 2 elite, 2 standard | 80% | 6.3 | 60% | 81% |
| 3: 6 standard | 72% | 6.1 | 63% | 82% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-1` | Archer (Rolling Shot) `archer-rolling-1` |
|---|---:|---:|
| Damage dealt | 268.0 | 235.6 |
| Damage a turn (its own turns) | 23.2 | 24.0 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 18.9 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | - | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 11.7 | 9.8 |
| Health Pool | 39 | 27 |
| Damage aimed at it (before reduction) | 116.8 | 50.4 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.1 | 50.4 |
| Damage taken a round of combat | 5.3 | 3.5 |
| Times Down | 0.71 | 1.13 |
| Rally Points (of 8 / 7): used in combat (Steel Yourself) | 1.45 | 0.44 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.30 | 3.72 |
| Rally Points left | 3.25 | 2.84 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 6.0 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 0.0 |
| Divine Surge given (extra damage dealt by allies) | 18.0 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.7 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 6.8 | 0.0 |
| **Map:** AP spent moving | 4.8 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.8 | 0.0 |
| Turns that start Engaged | 8.1 | 3.4 |
| Shots ([Ranged] Actions) | 0.0 | 28.6 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.7 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 10.2 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.56 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 4.18 |
| **Debuff:** Immobilized (times) | 0.00 | 2.67 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.70 |

**Level 2, A1 Double Shot** (paladin-smite-2, paladin-smite-2, archer-double-2, archer-double-2; NPCs of level 2): the day cleared 70% · a PC Down during the day 94% · Downs a day 3.07 · Rally Points left at the end 43% · Health at the end 63%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 31% | 23% |
| 2: 2 elite, 2 standard | 84% | 6.0 | 57% | 74% |
| 3: 6 standard | 83% | 6.0 | 56% | 73% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Double Shot) `archer-double-2` |
|---|---:|---:|
| Damage dealt | 271.2 | 242.6 |
| Damage a turn (its own turns) | 23.3 | 24.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.2 | 24.1 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.5 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.8 | 9.9 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.9 | 52.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 78.6 | 52.0 |
| Damage taken a round of combat | 5.6 | 3.7 |
| Times Down | 0.54 | 1.00 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.54 | 0.45 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.34 | 3.80 |
| Rally Points left | 4.12 | 2.75 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.9 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.2 |
| Divine Surge given (extra damage dealt by allies) | 20.8 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 40.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 4.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 4.6 | 0.0 |
| Turns that start Engaged | 8.3 | 3.5 |
| Shots ([Ranged] Actions) | 0.0 | 36.7 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.7 |
| ... while Engaged (2 Banes) | 0.0 | 1.0 |
| Flanking Boons on its melee Actions | 9.8 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.19 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.33 |
| **Debuff:** Immobilized (times) | 0.00 | 2.16 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.71 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.52 |

**Level 2, A1 Rolling Shot** (paladin-smite-2, paladin-smite-2, archer-rolling-2, archer-rolling-2; NPCs of level 2): the day cleared 73% · a PC Down during the day 95% · Downs a day 3.00 · Rally Points left at the end 43% · Health at the end 65%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.5 | 30% | 23% |
| 2: 2 elite, 2 standard | 89% | 6.2 | 53% | 73% |
| 3: 6 standard | 82% | 6.1 | 56% | 75% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-2` | Archer (Rolling Shot) `archer-rolling-2` |
|---|---:|---:|
| Damage dealt | 286.1 | 252.1 |
| Damage a turn (its own turns) | 23.1 | 24.7 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 19.1 | 24.0 |
| Damage a Nova turn (with an Encounter or Daily Action) | 35.8 | - |
| Share of the party's damage (%) | 27 | 23 |
| Turns taken | 12.5 | 10.2 |
| Health Pool | 43 | 29 |
| Damage aimed at it (before reduction) | 118.1 | 52.0 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 0.0 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 0.0 | 0.0 |
| Damage taken | 76.8 | 52.0 |
| Damage taken a round of combat | 5.2 | 3.5 |
| Times Down | 0.48 | 1.02 |
| Rally Points (of 9 / 7): used in combat (Steel Yourself) | 1.53 | 0.47 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 3.33 | 3.82 |
| Rally Points left | 4.14 | 2.72 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 5.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.6 |
| Divine Surge given (extra damage dealt by allies) | 19.6 | 0.0 |
| Banes given (damage its areas stopped) | 0.0 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 0.0 | 0.0 |
| Guard given (damage it took instead of Health) | 41.3 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 7.2 | 0.0 |
| **Map:** AP spent moving | 5.2 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.2 | 0.0 |
| Turns that start Engaged | 8.7 | 3.6 |
| Shots ([Ranged] Actions) | 0.0 | 27.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.4 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 12.0 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.48 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.51 |
| **Debuff:** Immobilized (times) | 0.00 | 2.18 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 2.79 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.56 |

**Level 3, A1 Double Shot** (paladin-smite-3, paladin-smite-3, archer-double-3, archer-double-3; NPCs of level 3): the day cleared 96% · a PC Down during the day 82% · Downs a day 1.71 · Rally Points left at the end 50% · Health at the end 89%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 29% | 18% |
| 2: 2 elite, 2 standard | 99% | 5.0 | 35% | 51% |
| 3: 6 standard | 97% | 5.2 | 42% | 57% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Double Shot) `archer-double-3` |
|---|---:|---:|
| Damage dealt | 305.9 | 271.7 |
| Damage a turn (its own turns) | 25.9 | 26.6 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 22.1 | 25.7 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.2 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 11.9 | 10.2 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 103.3 | 48.7 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.9 | 0.0 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.2 | 0.0 |
| Damage taken | 57.8 | 48.6 |
| Damage taken a round of combat | 4.3 | 3.6 |
| Times Down | 0.16 | 0.70 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.72 | 0.38 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.91 | 4.48 |
| Rally Points left | 5.37 | 3.14 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.6 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.4 |
| Divine Surge given (extra damage dealt by allies) | 21.3 | 0.0 |
| Banes given (damage its areas stopped) | 3.6 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.4 | 0.0 |
| Guard given (damage it took instead of Health) | 33.6 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 4.2 | 0.0 |
| **Map:** AP spent moving | 5.1 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.1 | 0.0 |
| Turns that start Engaged | 7.9 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 36.8 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 17.8 |
| ... while Engaged (2 Banes) | 0.0 | 1.2 |
| Flanking Boons on its melee Actions | 10.4 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 8.73 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.26 |
| **Debuff:** Immobilized (times) | 0.00 | 2.22 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.26 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.70 |

**Level 3, A1 Rolling Shot** (paladin-smite-3, paladin-smite-3, archer-rolling-3, archer-rolling-3; NPCs of level 3): the day cleared 98% · a PC Down during the day 82% · Downs a day 1.56 · Rally Points left at the end 51% · Health at the end 92%

| Fight | won (of the days that reach it) | rounds (mean) | party Health lost in it | a PC goes Down in it |
|---|---:|---:|---:|---:|
| 1: 4 standard | 100% | 3.4 | 29% | 17% |
| 2: 2 elite, 2 standard | 100% | 5.1 | 33% | 52% |
| 3: 6 standard | 98% | 5.2 | 40% | 52% |

| Per PC, over the day | Paladin (Smite) `paladin-smite-3` | Archer (Rolling Shot) `archer-rolling-3` |
|---|---:|---:|
| Damage dealt | 309.8 | 284.8 |
| Damage a turn (its own turns) | 25.7 | 27.4 |
| Damage a turn without its Nova turns (no Encounter or Daily Action) | 21.9 | 26.2 |
| Damage a Nova turn (with an Encounter or Daily Action) | 33.3 | - |
| Share of the party's damage (%) | 26 | 24 |
| Turns taken | 12.1 | 10.4 |
| Health Pool | 46 | 31 |
| Damage aimed at it (before reduction) | 98.9 | 46.9 |
| Reduced (Hallowed Stance, its own or an adjacent ally's) | 11.2 | 0.1 |
| Reduced for adjacent allies (its Hallowed Stance) | 2.5 | 0.0 |
| Damage taken | 54.7 | 46.8 |
| Damage taken a round of combat | 4.0 | 3.4 |
| Times Down | 0.13 | 0.65 |
| Rally Points (of 9 / 8): used in combat (Steel Yourself) | 0.64 | 0.36 |
| Rally Points used through an ally's Lay On Hands | 0.00 | 0.00 |
| Rally Points used between fights | 2.88 | 4.42 |
| Rally Points left | 5.48 | 3.22 |
| **Buffs:** healed allies (Lay On Hands) | 0.0 | 0.0 |
| Defense given (damage it stopped) | 4.3 | 0.0 |
| Vulnerable given (extra damage dealt by the party) | 0.0 | 1.9 |
| Divine Surge given (extra damage dealt by allies) | 20.1 | 0.0 |
| Banes given (damage its areas stopped) | 3.4 | 0.0 |
| Healed with new Health (Smite, Consecrated Ground) | 6.2 | 0.0 |
| Guard given (damage it took instead of Health) | 33.0 | 0.0 |
| Extra healing on Rally Points (Font of Mercy) | 3.9 | 0.0 |
| **Map:** AP spent moving | 5.6 | 0.0 |
| AP lost to moving (Actions dropped or made smaller) | 5.6 | 0.0 |
| Turns that start Engaged | 7.9 | 3.7 |
| Shots ([Ranged] Actions) | 0.0 | 27.2 |
| ... into melee (1 Bane) | 0.0 | 0.0 |
| ... with Cover | 0.0 | 13.1 |
| ... while Engaged (2 Banes) | 0.0 | 0.2 |
| Flanking Boons on its melee Actions | 11.9 | 0.0 |
| Opportunity Attacks made / taken | 0.0 / 0.0 | 0.0 / 0.0 |
| Conditions it put on NPCs (Hindered, Immobilized, Prone...) | 0.00 | 9.05 |
| **Debuff:** Hindered (until it moves) (times) | 0.00 | 3.40 |
| **Debuff:** Immobilized (times) | 0.00 | 2.31 |
| **Debuff:** Immobilized (EoT) (times) | 0.00 | 3.35 |
| **Debuff:** Vulnerable 2 (times) | 0.00 | 0.71 |
