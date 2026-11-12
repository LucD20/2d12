# Pack R-bestiary: the Bestiary re-fitted to the rebuilt party

Written by `node book/ruler/rbestiary.mjs`; don't edit, run it again. Read by `book/rules-src/14-bestiary.md` (its tables and targets) and `book/rules-backlog.md` (pack R-bestiary).

Runs: 800 fights a measurement. **The party:** rclasses.md's (a Smite Paladin, a Lay On Hands Paladin, a Double Shot Archer, a Rolling Shot Archer; Human, high on Vigor) at **Stage 1** (level 1: 35 / 35 / 29 / 29 Health, WD 13, Guard 2 an unspent AP), **Stage 2** (level 5: the Health line, Rally + 2, Guard 3, the Weapon Attribute +1, WD 14) and **Stage 3** (level 8: Rally + 3, Guard 4, the Attribute +2 and Modifiers +1 (cap 4), WD 14, 2[W] (Master, from level 8); Shield of Faith 3d6 / 4d6). **The reserve:** the fit is made with each PC dealing × 1.07 (about a Talent's worth, the future Folk Traits: rules-backlog.md), so today's party has a little less than the fit assumes. **The rules:** rclasses.md's (4 + 1 AP, Escalation from 1 with Momentum in half the fights and the hooks, Guard from unspent AP, the NPC Specials, Opportunity Attack without the disrupt) plus **Elite Escalation** (1 in round 1, +1 a round: its first attack each round has 1 Boon; at 2 its Round Special twice a round; at 3 its Encounter Special comes back once) and the **Elite phases** (+1 Escalation when it becomes Bloodied and when it becomes Strained). **The NPCs:** today's tables (bestiary-today.mjs) × the factors fitted here; **a `power` NPC attacks Ward Defense and deals [R]**; the normal fight is 3 Standards + 1 power Standard (CV 400). **The targets:** 25% of the party's Health, a Down in 10% of the fights, 3.5 rounds.

## 1. The Stage 1 fit: the NPC damage factor

The normal fight (3 Standards + 1 power Standard) with the NPC Basic attack tables × d over today's (Health × 1), the party with the reserve and without. The decision sheet's × 0.6 was fitted on the P1 builds; the rebuilt party takes much less (rclasses.md section 2: 7%, a Down in 10% at × 0.6).

| d | With the reserve: rounds · lost · Down · won | Taken · healed back a fight | Without the reserve | Taken a fight |
|---|---|---|---|---|
| × 0.40 | 3.2 r · lost 3% · cost 7% · Down 1% · won 100% | 28.1 · 24.7 (5.1 by Rally Points) | 3.3 r · lost 2% · cost 6% · Down 1% · won 100% | 30.4 |
| × 0.50 | 3.3 r · lost 5% · cost 11% · Down 6% · won 100% | 37.9 · 31.5 (7.4 by Rally Points) | 3.4 r · lost 4% · cost 11% · Down 5% · won 100% | 38.9 |
| × 0.60 | 3.3 r · lost 9% · cost 16% · Down 13% · won 100% | 47.1 · 36.0 (9.8 by Rally Points) | 3.5 r · lost 8% · cost 17% · Down 13% · won 100% | 49.8 |
| × 0.70 | 3.4 r · lost 13% · cost 21% · Down 22% · won 99% | 56.3 · 40.2 (10.3 by Rally Points) | 3.5 r · lost 14% · cost 22% · Down 22% · won 100% | 59.5 |
| × 0.80 | 3.5 r · lost 19% · cost 28% · Down 33% · won 98% | 68.5 · 43.6 (11.3 by Rally Points) | 3.7 r · lost 21% · cost 31% · Down 36% · won 98% | 74.4 |
| × 0.90 | 3.6 r · lost 25% · cost 34% · Down 41% · won 95% | 78.7 · 46.2 (11.5 by Rally Points) | 3.9 r · lost 30% · cost 40% · Down 51% · won 94% | 90.2 |
| × 1.00 | 3.8 r · lost 34% · cost 44% · Down 58% · won 91% | 93.6 · 49.8 (12.6 by Rally Points) | 3.9 r · lost 38% · cost 48% · Down 60% · won 88% | 100.7 |
| × 1.20 | 3.9 r · lost 56% · cost 65% · Down 77% · won 71% | 124.6 · 52.3 (10.6 by Rally Points) | 3.9 r · lost 56% · cost 66% · Down 78% · won 69% | 130.2 |

The same with the Special multipliers scaled (× 0.75: a Standard's 2 AP Special × 1.65 instead of × 2.2; × 0.5: × 1.1) and NPC Health × 1.25 (a longer fight with smaller hits):

| d | Specials × 0.75 | Specials × 0.5 | Health × 1.25 |
|---|---|---|---|
| × 0.40 | 3.2 r · lost 2% · cost 5% · Down 0% · won 100% | 3.2 r · lost 1% · cost 3% · Down 0% · won 100% | 3.9 r · lost 2% · cost 7% · Down 1% · won 100% |
| × 0.50 | 3.2 r · lost 2% · cost 7% · Down 1% · won 100% | 3.2 r · lost 2% · cost 5% · Down 0% · won 100% | 3.9 r · lost 5% · cost 12% · Down 6% · won 100% |
| × 0.60 | 3.3 r · lost 4% · cost 10% · Down 4% · won 100% | 3.2 r · lost 3% · cost 7% · Down 1% · won 100% | 4.0 r · lost 9% · cost 19% · Down 17% · won 100% |
| × 0.70 | 3.3 r · lost 7% · cost 14% · Down 10% · won 100% | 3.2 r · lost 4% · cost 8% · Down 3% · won 100% | 4.2 r · lost 16% · cost 26% · Down 28% · won 98% |
| × 0.80 | 3.3 r · lost 11% · cost 18% · Down 14% · won 100% | 3.2 r · lost 5% · cost 11% · Down 5% · won 100% | 4.3 r · lost 23% · cost 35% · Down 41% · won 96% |
| × 0.90 | 3.4 r · lost 15% · cost 23% · Down 25% · won 100% | 3.3 r · lost 7% · cost 13% · Down 8% · won 100% | 4.4 r · lost 33% · cost 45% · Down 56% · won 90% |
| × 1.00 | 3.5 r · lost 19% · cost 28% · Down 33% · won 99% | 3.3 r · lost 11% · cost 18% · Down 16% · won 100% | 4.5 r · lost 46% · cost 58% · Down 66% · won 78% |
| × 1.20 | 3.7 r · lost 32% · cost 42% · Down 54% · won 93% | 3.4 r · lost 16% · cost 24% · Down 29% · won 99% | 4.3 r · lost 67% · cost 77% · Down 85% · won 56% |

**The two targets don't meet:** the cost reaches 25% at d = 0.74, where a PC goes Down in about 29% of the fights; a Down in 10% comes at d = 0.59, where the fight costs 15%. Whatever the shape (smaller Specials, more NPC Health), the Down rate follows the cost about 2 points under it: the Downs come from focus (the NPCs strike the hurt PC and the one in front), not from the shape of the damage. **The default: D1 = × 0.70, the knee between them:** with the reserve 3.4 r · lost 13% · cost 21% · Down 22% · won 99% (a Paladin Down in 14%, an Archer in 10%); today's party (no reserve) 3.5 r · lost 14% · cost 22% · Down 22% · won 100%. The Stage 1 tables are today's × 0.7; × 0.6 gives the 1-in-10 at a cost of about 15%, × 0.9 the quarter with a Down in 2 fights of 5 (the table): Lucas picks by exception.

## 2. Ward Defense: the `power` NPCs

A `power` NPC rolls its attacks against the PC's WD and its damage is Resolve damage ([R]); the Vs. AD damage tables serve it unchanged. The PCs' WD is 13 at Stage 1 against the Paladin's AD 14 and the Archer's AD 13, so a Vs. WD attack is a little stronger against the Paladin and the same against the Archer; what moves is which pool takes it: Resolve is the low pool (12 and 10 at level 1), so a party facing Resolve attackers is Strained early.

A Medium Standard's Basic attack at D1 (4.2 / 7.7, Modifier +2) deals on average 3.56 against AD 14 (the Paladin), 3.97 against AD 13 (the Archer) and 3.97 against WD 13 (both): the Paladin takes 12% more from a Vs. WD attack.

| The 4 Standards | rounds · lost · Down · won | Taken a fight · of it Resolve | PC turns while Strained (of all PC turns) |
|---|---|---|---|
| 4 Vs. AD | 3.3 r · lost 13% · cost 20% · Down 20% · won 100% | 54.7 · 0.0 | 0.0 (0%) |
| 3 Vs. AD + 1 Vs. WD (the normal fight) | 3.4 r · lost 13% · cost 21% · Down 22% · won 99% | 56.3 · 18.8 | 0.9 (8%) |
| 2 + 2 | 3.4 r · lost 14% · cost 23% · Down 25% · won 100% | 59.2 · 36.5 | 1.8 (16%) |
| 4 Vs. WD (a ghost pack) | 3.4 r · lost 15% · cost 24% · Down 25% · won 99% | 60.4 · 60.4 | 3.1 (28%) |

So the Vs. AD damage table fits Vs. WD attacks as it is: the fight's cost barely moves with the share of Resolve attackers; what they change is the Strained hooks, which is their point.

## 3. Elites: Elite Escalation and the phases

An Elite fight at CV 400 (1 Elite + 2 Standards; 2 Elites) against the normal fight, with Elite Escalation off, on, and on with the phases; then the Elite's own damage factor (ed, on top of D1) that brings 2 Elites to the normal fight's cost.

| Fight | Elite rules | rounds · lost · Down · won | Taken a fight | An Elite's turns at Escalation 1 / 2 / 3 | An Elite deals a turn |
|---|---|---|---|---|---|
| 1 Elite + 2 Standards | no Escalation | 3.4 r · lost 11% · cost 17% · Down 17% · won 100% | 47.0 | 0.00 / 0.00 / 0.00 | 9.2 |
| 1 Elite + 2 Standards | Escalation | 3.4 r · lost 12% · cost 19% · Down 21% · won 100% | 50.6 | 1.00 / 1.00 / 0.99 | 10.4 |
| 1 Elite + 2 Standards | Escalation + phases | 3.4 r · lost 12% · cost 19% · Down 21% · won 100% | 50.9 | 1.00 / 0.98 / 1.01 | 10.5 |
| 2 Elites | no Escalation | 3.5 r · lost 9% · cost 14% · Down 13% · won 100% | 42.6 | 0.00 / 0.00 / 0.00 | 8.6 |
| 2 Elites | Escalation | 3.5 r · lost 11% · cost 18% · Down 17% · won 100% | 48.9 | 1.00 / 0.91 / 0.61 | 9.7 |
| 2 Elites | Escalation + phases | 3.5 r · lost 12% · cost 19% · Down 19% · won 100% | 49.8 | 1.00 / 0.74 / 0.77 | 10.0 |

| 2 Elites, Elite damage × ed | rounds · lost · Down · won | Taken a fight | An Elite deals a turn |
|---|---|---|---|
| × 0.80 | 3.4 r · lost 5% · cost 11% · Down 5% · won 100% | 34.8 | 7.2 |
| × 0.90 | 3.5 r · lost 8% · cost 14% · Down 11% · won 100% | 42.1 | 8.6 |
| × 1.00 | 3.5 r · lost 12% · cost 19% · Down 19% · won 100% | 49.8 | 10.0 |
| × 1.10 | 3.6 r · lost 16% · cost 23% · Down 28% · won 99% | 56.3 | 11.1 |
| × 1.20 | 3.6 r · lost 19% · cost 27% · Down 36% · won 99% | 63.4 | 12.2 |
| × 1.30 | 3.8 r · lost 24% · cost 32% · Down 45% · won 98% | 72.1 | 13.6 |

**The Elite factor: 2 Elites cost the normal fight's 13% at ed = 1.04; rounded, ED = × 1.05:** 2 Elites 3.6 r · lost 14% · cost 21% · Down 26% · won 100%; 1 Elite + 2 Standards 3.5 r · lost 15% · cost 22% · Down 26% · won 100%. The Elite's Basic attack rows are today's × 0.7 × 1.05; its Health rows stay.

## 4. Minions and Grunts at CV 400

| Fight | rounds · lost · Down · won | Taken a fight | A Minion / Grunt / Standard deals a turn |
|---|---|---|---|
| 4 Standards | 3.3 r · lost 13% · cost 20% · Down 20% · won 100% | 54.7 | - / - / 7.0 |
| 2 Standards + 8 Minions | 3.1 r · lost 9% · cost 15% · Down 11% · won 100% | 48.0 | 1.9 / - / 6.9 |
| 8 Grunts | 3.3 r · lost 9% · cost 18% · Down 7% · won 100% | 61.4 | - / 4.5 / - |
| 4 Grunts + 2 Standards | 3.4 r · lost 11% · cost 19% · Down 17% · won 100% | 56.7 | - / 4.3 / 7.2 |
| 16 Minions | 2.9 r · lost 6% · cost 10% · Down 1% · won 100% | 35.8 | 1.6 / - / - |

A role's "deals a turn" is what it dealt (its Basic attacks and Specials, after the party's blocks, Guard and Defenses) per turn it took; a Minion's turns are few (it dies first).

## 5. Stages 2 and 3

The party at Stage 2 and 3 (the header's model) against the normal fight with the NPC damage rows at today's × D1 × 1.2 / × 1.5 (decision sheet item 17) and the Health rows × h over today's: h fitted so the fight lasts 3.5 rounds; what the fight then costs.

| Stage | h | rounds · lost · Down · won | Taken a fight | The party's Health | A PC's main turn at Escalation 3 (Smite Paladin / Double Shot Archer, Defense 13) |
|---|---|---|---|---|---|
| 2 | × 1.00 | 3.3 r · lost 16% · cost 25% · Down 21% · won 100% | 82.2 | 192 | 35.2 / 36.7 |
| 2 | × 1.25 | 4.1 r · lost 21% · cost 32% · Down 33% · won 98% | 107.3 | 192 | 35.2 / 36.7 |
| 2 | × 1.50 | 4.8 r · lost 25% · cost 40% · Down 41% · won 95% | 131.5 | 192 | 35.2 / 36.7 |
| 2 | **× 1.00 (the fit: 1.07; today's rows kept: within 15%)** | 3.3 r · lost 16% · cost 25% · Down 21% · won 100% | 82.2 | 192 | 35.2 / 36.7 |
| 3 | × 1.00 | 3.1 r · lost 16% · cost 24% · Down 20% · won 100% | 105.3 | 268 | 53.7 / 57.5 |
| 3 | × 1.25 | 3.7 r · lost 20% · cost 30% · Down 27% · won 99% | 132.6 | 268 | 53.7 / 57.5 |
| 3 | × 1.50 | 4.3 r · lost 23% · cost 36% · Down 37% · won 98% | 162.0 | 268 | 53.7 / 57.5 |
| 3 | **× 1.20 (the fit: 1.22)** | 3.5 r · lost 20% · cost 29% · Down 29% · won 99% | 129.4 | 268 | 53.7 / 57.5 |

For scale, at Stage 1 the same turns are 30.8 / 31.2 and the party's Health 128. The Stage 2 and 3 party is a model (no Talents beyond level 1, no Stage Talents; R-classes wrote no level 5 or 8 cards): read the rows as the direction, and re-fit when the classes have their Stage 2 and 3 picks.

## 6. The difficulty table (Stage 1, the fitted tables)

| Enemies (total CV) | rounds · lost · Down · won | Taken a fight |
|---|---|---|
| 3 Standards (300, easy) | 2.6 r · lost 7% · cost 12% · Down 10% · won 100% | 31.9 |
| 2 Standards + 4 Minions (300, easy) | 2.5 r · lost 7% · cost 11% · Down 7% · won 100% | 29.2 |
| 4 Standards (400, normal) | 3.3 r · lost 13% · cost 20% · Down 20% · won 100% | 54.7 |
| 3 Standards + 1 Vs. WD Standard (400, normal) | 3.4 r · lost 13% · cost 21% · Down 22% · won 99% | 56.3 |
| 1 Elite + 2 Standards (400) | 3.5 r · lost 15% · cost 22% · Down 26% · won 100% | 54.9 |
| 2 Elites (400) | 3.6 r · lost 14% · cost 21% · Down 26% · won 100% | 53.5 |
| 8 Grunts (400) | 3.3 r · lost 9% · cost 18% · Down 7% · won 100% | 61.4 |
| 2 Standards + 8 Minions (400) | 3.1 r · lost 9% · cost 15% · Down 11% · won 100% | 48.0 |
| 5 Standards (500, hard) | 4.4 r · lost 26% · cost 38% · Down 43% · won 93% | 92.3 |
| 1 Elite + 3 Standards (500, hard) | 4.4 r · lost 20% · cost 31% · Down 39% · won 97% | 81.4 |
| 6 Standards (600, deadly) | 5.3 r · lost 40% · cost 57% · Down 62% · won 81% | 131.7 |
| 2 Elites + 2 Standards (600, deadly) | 5.5 r · lost 39% · cost 55% · Down 61% · won 83% | 125.4 |

The party with the reserve. Today's party (without it) takes about 2 points more of its Health in the normal fight (section 1).

## 7. The tables

Today's tables × the factors: damage × 0.70 / 0.84 / 1.05 by Stage (an Elite × 1.05 more), Health × 1.00 / 1.00 / 1.20; damage rounded to 0.5, multipliers to 0.25. **This fit DIFFERS from the book's tables (config.mjs, `bestiary-r.json`): it is written to `bestiary-r-refit.json` as a proposal, and nothing is changed until Lucas decides.**

| Role | Health, every rating Medium, Stage 1 / 2 / 3 | Deals a turn against AD 13 (its Basic attack and Specials, 1 AP to move) | Deals a turn, measured (after the party's Guard, blocks and reduction; section 4) | Takes about (PC turns at Defense 13, Stage 1) |
|---|---|---|---|---|
| minion | 6 / 8 / 10 | 4.8 | 1.9 | 0.2 |
| grunt | 24 / 26 / 38 | 7.9 | 4.5 | 0.8 |
| standard | 56 / 62 / 98 | 12.7 | 7.0 | 1.8 |
| elite | 118 / 136 / 216 | 17.7 | 10.5 | 3.8 |

A Stage 1 PC's main turn at Escalation 2 against Defense 13 averages 31.0 here (the mean of the Smite Paladin's and the Double Shot Archer's). "Deals a turn against AD 13" is the design target an NPC's Actions are checked against (the Builder's "should deal"): the expected damage of its turn's attacks, before anything the party does about it.

### Minions

**Health Multiplier**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | ×0 | ×0.75 | ×1 | ×1.25 |
| **Stage 2 (levels 5-7)** | ×0 | ×1 | ×1.25 | ×1.5 |
| **Stage 3 (levels 8-10)** | ×0 | ×1.5 | ×2 | ×2.75 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** |
|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | 1 / 2.5 | 1.5 / 3.5 | 2 / 4 | 2.5 / 5 |
| **Stage 2 (levels 5-7)** | 1.5 / 3.5 | 2 / 5 | 3 / 5.5 | 3.5 / 7 |
| **Stage 3 (levels 8-10)** | 2 / 5 | 3 / 7 | 4 / 8 | 5 / 10 |

### Grunts

**Health Multiplier**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | ×2 | ×3 | ×4.25 | ×5.25 | ×6.25 |
| **Stage 2 (levels 5-7)** | ×2.5 | ×3.75 | ×4.75 | ×6 | ×7.25 |
| **Stage 3 (levels 8-10)** | ×4 | ×6 | ×8 | ×10 | ×12 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | 2 / 3 | 2.5 / 3.5 | 3 / 4 | 4 / 5.5 | 4.5 / 6.5 |
| **Stage 2 (levels 5-7)** | 3 / 4 | 3.5 / 5 | 4 / 6.5 | 5.5 / 8 | 6.5 / 10 |
| **Stage 3 (levels 8-10)** | 4 / 6.5 | 5 / 7 | 6.5 / 9 | 8 / 11 | 9 / 14 |

### Standards

**Health Multiplier**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | ×3.75 | ×5.75 | ×7.75 | ×9.75 | ×11.5 |
| **Stage 2 (levels 5-7)** | ×4.5 | ×6.75 | ×9 | ×11.25 | ×13.5 |
| **Stage 3 (levels 8-10)** | ×7.5 | ×11 | ×15 | ×18.5 | ×22.5 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | 3 / 4 | 3.5 / 6 | 4 / 7.5 | 5.5 / 9 | 6.5 / 11 |
| **Stage 2 (levels 5-7)** | 4 / 6.5 | 5 / 8.5 | 6.5 / 11.5 | 8 / 13.5 | 10 / 16.5 |
| **Stage 3 (levels 8-10)** | 6.5 / 9 | 7 / 12 | 9 / 16.5 | 11 / 19 | 14 / 23 |

### Elites

**Health Multiplier**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | ×6.5 | ×10 | ×13.25 | ×16.5 | ×19.75 |
| **Stage 2 (levels 5-7)** | ×7.75 | ×11.5 | ×15.5 | ×19.25 | ×23.25 |
| **Stage 3 (levels 8-10)** | ×13 | ×19.25 | ×25.5 | ×32 | ×38.5 |

**Basic attack, average damage: Tier 2 / Tier 3**

| Stage | **Terrible** | **Low** | **Medium** | **High** | **Extreme** |
|---|---|---|---|---|---|
| **Stage 1 (levels 1-4)** | 3 / 4.5 | 4 / 6.5 | 5 / 8 | 6.5 / 10 | 7.5 / 11.5 |
| **Stage 2 (levels 5-7)** | 4.5 / 6.5 | 6 / 9.5 | 8 / 12 | 9.5 / 14.5 | 11 / 17 |
| **Stage 3 (levels 8-10)** | 6 / 9.5 | 9 / 13 | 11 / 16.5 | 13 / 20.5 | 16 / 23.5 |

```
    // minion
      hm: [[0,0.75,1,1.25],[0,1,1.25,1.5],[0,1.5,2,2.75]],
      basic: [[[1,2.5],[1.5,3.5],[2,4],[2.5,5]],[[1.5,3.5],[2,5],[3,5.5],[3.5,7]],[[2,5],[3,7],[4,8],[5,10]]] },
    // grunt
      hm: [[2,3,4.25,5.25,6.25],[2.5,3.75,4.75,6,7.25],[4,6,8,10,12]],
      basic: [[[2,3],[2.5,3.5],[3,4],[4,5.5],[4.5,6.5]],[[3,4],[3.5,5],[4,6.5],[5.5,8],[6.5,10]],[[4,6.5],[5,7],[6.5,9],[8,11],[9,14]]] },
    // standard
      hm: [[3.75,5.75,7.75,9.75,11.5],[4.5,6.75,9,11.25,13.5],[7.5,11,15,18.5,22.5]],
      basic: [[[3,4],[3.5,6],[4,7.5],[5.5,9],[6.5,11]],[[4,6.5],[5,8.5],[6.5,11.5],[8,13.5],[10,16.5]],[[6.5,9],[7,12],[9,16.5],[11,19],[14,23]]] },
    // elite
      hm: [[6.5,10,13.25,16.5,19.75],[7.75,11.5,15.5,19.25,23.25],[13,19.25,25.5,32,38.5]],
      basic: [[[3,4.5],[4,6.5],[5,8],[6.5,10],[7.5,11.5]],[[4.5,6.5],[6,9.5],[8,12],[9.5,14.5],[11,17]],[[6,9.5],[9,13],[11,16.5],[13,20.5],[16,23.5]]] },
```

(1.8 minutes.)