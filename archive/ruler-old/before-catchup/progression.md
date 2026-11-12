# Progression models: the numbers (pack LV)

Written by `node book/ruler/progression.mjs` (the spec ruler, spec.mjs, with the map model). Don't edit this file: edit the script and run it again. The proposal that reads these numbers is `book/progression-lv.md`.

Runs: 800 fights a measurement, 500 a calibration step. Half the fights start with Momentum. The party: 2 weapon users (melee, AD 14) + 2 casters (ranged, AD 13, the round-1 floor). NPCs: the Bestiary's level 1 Medium NPCs with Health and damage multiplied by the level's factors; their Defense and Modifier never change (decided).

- **A. Bounded.** Growth from the decided numbers only: the Modifier steps (+3 at level 5, +4 at level 8), Mastery 2[W] at level 8 for weapon users and keep the best for Power damage at level 8 for casters (matched by level), the tier's Overcast limit and Momentum. Picks after level 3 are options (sidegrades), not power.
- **B. Escalation-heavy.** The Modifier steps as in A, but no Mastery 2[W] or keep the best before level 10; the growth is in Escalation: each Escalation spent (the weapon user's Surge, the caster's Overcast) adds 1d8 / 2d6 / 2d8 by tier, and the weapon user gains a hold passive at level 5 (while Escalation 2+: Empowered 1 on its Strikes).
- **C. +10% a level (the charter today).** To compare: the charter's +10% sustained damage a level (from Talents; a flat damage factor here), Modifiers stay +2, Health (level + 10) / 10 (x2 at level 10, the book today); Momentum and Overcast as decided.

## 1. The stand-in PCs by level

Damage a turn against Defense 13 (one target, Monte Carlo): **Esc 0** = the main turn with no Escalation (no floor); **3.5-round fight** = rounds 1 to 3 and half of round 4, the Encounter Nova in round 1, no Daily, half the fights with Momentum, Escalation spent as the plan says. Health = the Health Pool.

| Model | Level | Modifier | Weapon user: Esc 0 / 3.5-round fight / Health | Caster: Esc 0 / 3.5-round fight / Health | growth of the fight damage (avg of both, level 1 = 100%) | Health (level 1 = 100%) |
|---|---:|---:|---|---|---:|---:|
| A | 1 | +2 | 21.2 / 104.0 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| A | 3 | +2 | 21.2 / 107.9 / 40 | 21.2 / 108.2 / 30 | 102% | 111% |
| A | 5 | +3 | 25.3 / 122.1 / 44 | 25.3 / 126.7 / 33 | 117% | 122% |
| A | 8 | +4 | 43.4 / 182.5 / 50 | 33.7 / 159.2 / 37 | 161% | 138% |
| A | 10 | +4 | 43.4 / 182.5 / 54 | 33.7 / 159.2 / 39 | 161% | 148% |
| B | 1 | +2 | 21.2 / 104.0 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| B | 3 | +2 | 21.2 / 107.9 / 40 | 21.2 / 108.2 / 30 | 102% | 111% |
| B | 5 | +3 | 25.3 / 144.7 / 44 | 25.3 / 138.2 / 33 | 133% | 122% |
| B | 8 | +4 | 29.7 / 169.0 / 50 | 29.7 / 166.6 / 37 | 158% | 138% |
| B | 10 | +4 | 43.4 / 220.7 / 54 | 33.7 / 182.1 / 39 | 190% | 148% |
| C | 1 | +2 | 21.2 / 104.0 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| C | 3 | +2 | 25.4 / 129.5 / 42 | 25.4 / 129.9 / 31 | 122% | 116% |
| C | 5 | +2 | 29.6 / 151.1 / 49 | 29.6 / 158.0 / 36 | 146% | 135% |
| C | 8 | +2 | 36.0 / 187.6 / 59 | 36.0 / 195.7 / 43 | 181% | 162% |
| C | 10 | +2 | 40.2 / 209.6 / 64 | 40.2 / 218.8 / 47 | 202% | 176% |

## 2. NPC Health and damage by level (a Standard fight lasts 3.5 rounds)

**Health factor**: what the level 1 Bestiary's NPC Health is multiplied by so that 4 Standards last 3.5 rounds (mean) against the party of that level (found by bisection). **Damage factor**: NPC damage follows the PCs' Health (the share of Health a hit takes stays the same). Level 1 shows the refit E3 needs for 3.5 rounds (the Bestiary was built for about 3).

| Level | A: Health / damage factor | B: Health / damage factor | C: Health / damage factor |
|---:|---:|---:|---:|
| 1 | 1.22 / 1.00 | 1.22 / 1.00 | 1.22 / 1.00 |
| 2 | 1.22 / 1.06 | 1.22 / 1.06 | 1.32 / 1.08 |
| 3 | 1.24 / 1.11 | 1.24 / 1.11 | 1.52 / 1.16 |
| 4 | 1.22 / 1.16 | 1.22 / 1.16 | 1.57 / 1.27 |
| 5 | 1.43 / 1.22 | 1.62 / 1.22 | 1.75 / 1.35 |
| 6 | 1.43 / 1.27 | 1.57 / 1.27 | 1.90 / 1.44 |
| 7 | 1.43 / 1.32 | 1.61 / 1.32 | 2.03 / 1.54 |
| 8 | 1.97 / 1.38 | 1.90 / 1.38 | 2.20 / 1.62 |
| 9 | 1.99 / 1.44 | 1.90 / 1.44 | 2.34 / 1.70 |
| 10 | 1.99 / 1.48 | 2.32 / 1.48 | 2.43 / 1.76 |

NPC Health a level (the factor's growth from level 1): A 117% at level 5, 163% at level 10; B 133% at level 5, 191% at level 10; C 143% at level 5, 199% at level 10.

## 3. Fight length and Health lost by difficulty

The NPCs of the party's level (section 2's factors). Rounds (mean) · Health lost (share of the party's Health Pool) · a PC Down · the party wins.

### A. Bounded

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.6 r · 19% · Down 3% · won 100% | 2.5 r · 19% · Down 2% · won 100% | 2.6 r · 19% · Down 3% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 33% · Down 17% · won 100% | 3.5 r · 33% · Down 17% · won 100% | 3.5 r · 33% · Down 15% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.7 r · 41% · Down 47% · won 100% | 3.8 r · 41% · Down 47% · won 98% | 3.7 r · 42% · Down 48% · won 99% |
| CV 5 (5 Standards) |  | 4.8 r · 51% · Down 48% · won 96% | 4.0 r · 41% · Down 29% · won 100% | 4.2 r · 43% · Down 32% · won 100% |
| hard (CV 6) | 4-4.5 | 6.0 r · 74% · Down 79% · won 70% | 5.4 r · 61% · Down 63% · won 88% | 5.5 r · 64% · Down 70% · won 85% |
| CV 7 (7 Standards) |  | 5.7 r · 92% · Down 96% · won 27% | 6.1 r · 84% · Down 89% · won 47% | 6.0 r · 86% · Down 90% · won 42% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.8 r · 93% · Down 98% · won 26% | 5.5 r · 83% · Down 92% · won 48% | 5.5 r · 87% · Down 93% · won 38% |
| deadly (CV 8) | 5 | 4.5 r · 99% · Down 100% · won 3% | 5.1 r · 96% · Down 98% · won 12% | 4.9 r · 97% · Down 99% · won 9% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 4.1 r · 100% · Down 100% · won 0% | 4.4 r · 100% · Down 100% · won 2% | 4.1 r · 100% · Down 100% · won 0% |

### B. Escalation-heavy

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.6 r · 19% · Down 3% · won 100% | 2.6 r · 19% · Down 3% · won 100% | 2.6 r · 19% · Down 4% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 33% · Down 17% · won 100% | 3.5 r · 33% · Down 16% · won 100% | 3.5 r · 33% · Down 17% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.7 r · 41% · Down 47% · won 100% | 3.7 r · 42% · Down 48% · won 99% | 3.8 r · 42% · Down 49% · won 99% |
| CV 5 (5 Standards) |  | 4.8 r · 51% · Down 48% · won 96% | 4.0 r · 42% · Down 30% · won 98% | 4.2 r · 45% · Down 36% · won 98% |
| hard (CV 6) | 4-4.5 | 6.0 r · 74% · Down 79% · won 70% | 5.4 r · 62% · Down 63% · won 87% | 5.4 r · 64% · Down 67% · won 83% |
| CV 7 (7 Standards) |  | 5.7 r · 92% · Down 96% · won 27% | 5.9 r · 84% · Down 89% · won 48% | 5.9 r · 84% · Down 90% · won 49% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.8 r · 93% · Down 98% · won 26% | 5.4 r · 81% · Down 90% · won 53% | 5.3 r · 85% · Down 93% · won 43% |
| deadly (CV 8) | 5 | 4.5 r · 99% · Down 100% · won 3% | 5.0 r · 96% · Down 98% · won 13% | 5.0 r · 96% · Down 99% · won 13% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 4.1 r · 100% · Down 100% · won 0% | 4.3 r · 100% · Down 100% · won 2% | 4.2 r · 100% · Down 100% · won 2% |

### C. +10% a level (the charter today)

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.6 r · 19% · Down 3% · won 100% | 2.4 r · 19% · Down 5% · won 100% | 2.5 r · 18% · Down 4% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 33% · Down 17% · won 100% | 3.5 r · 33% · Down 22% · won 100% | 3.5 r · 34% · Down 23% · won 100% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.7 r · 41% · Down 47% · won 100% | 3.7 r · 41% · Down 47% · won 98% | 3.7 r · 41% · Down 51% · won 98% |
| CV 5 (5 Standards) |  | 4.8 r · 51% · Down 48% · won 96% | 3.9 r · 42% · Down 33% · won 98% | 4.0 r · 42% · Down 33% · won 99% |
| hard (CV 6) | 4-4.5 | 6.0 r · 74% · Down 79% · won 70% | 5.3 r · 63% · Down 66% · won 82% | 5.4 r · 63% · Down 66% · won 83% |
| CV 7 (7 Standards) |  | 5.7 r · 92% · Down 96% · won 27% | 5.7 r · 87% · Down 91% · won 39% | 5.9 r · 84% · Down 89% · won 45% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.8 r · 93% · Down 98% · won 26% | 5.3 r · 81% · Down 91% · won 50% | 5.3 r · 83% · Down 91% · won 47% |
| deadly (CV 8) | 5 | 4.5 r · 99% · Down 100% · won 3% | 4.7 r · 97% · Down 99% · won 11% | 4.9 r · 96% · Down 98% · won 12% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 4.1 r · 100% · Down 100% · won 0% | 4.2 r · 100% · Down 100% · won 2% | 4.3 r · 100% · Down 100% · won 2% |

## 4. The CV of a lower-level NPC (the level-gap factor)

The party of the level against Standards of 1 to 4 levels lower: how many of them take as much of the party's Health as 4 Standards of its own level (interpolated between whole counts). **CV each** = 4 / that count; **a level** = the factor for one level of gap (CV each to the power 1 / gap). The brainstorm's guess: about ×0.8 a level. The last column is a prediction (Lanchester's square law: a side's strength grows with its numbers squared, so a creature's worth is the square root of Health × damage): it should match CV each.

### A. Bounded

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 4.1 | 0.98 | 0.98 | 3.5 | 0.97 |
| 3 | 1 | 4.3 | 0.93 | 0.96 | 3.5 | 0.94 |
| 5 | 4 | 4.7 | 0.85 | 0.85 | 3.3 | 0.90 |
| 5 | 3 | 5.1 | 0.79 | 0.89 | 3.4 | 0.89 |
| 5 | 2 | 5.1 | 0.78 | 0.92 | 3.5 | 0.86 |
| 5 | 1 | 5.3 | 0.76 | 0.93 | 3.6 | 0.84 |
| 10 | 9 | 4.0 | 1.00 | 1.00 | 3.5 | 0.99 |
| 10 | 8 | 4.1 | 0.98 | 0.99 | 3.5 | 0.96 |
| 10 | 7 | 5.2 | 0.77 | 0.92 | 3.2 | 0.80 |
| 10 | 6 | 5.2 | 0.77 | 0.94 | 3.2 | 0.79 |

### B. Escalation-heavy

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 4.1 | 0.98 | 0.98 | 3.5 | 0.97 |
| 3 | 1 | 4.3 | 0.93 | 0.96 | 3.5 | 0.94 |
| 5 | 4 | 5.1 | 0.78 | 0.78 | 3.1 | 0.84 |
| 5 | 3 | 5.3 | 0.75 | 0.87 | 3.3 | 0.83 |
| 5 | 2 | 5.4 | 0.74 | 0.90 | 3.3 | 0.81 |
| 5 | 1 | 5.6 | 0.72 | 0.92 | 3.4 | 0.78 |
| 10 | 9 | 4.4 | 0.90 | 0.90 | 3.2 | 0.90 |
| 10 | 8 | 4.4 | 0.90 | 0.95 | 3.2 | 0.88 |
| 10 | 7 | 5.3 | 0.76 | 0.91 | 3.2 | 0.79 |
| 10 | 6 | 5.3 | 0.75 | 0.93 | 3.1 | 0.76 |

### C. +10% a level (the charter today)

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 5.0 | 0.80 | 0.80 | 3.5 | 0.90 |
| 3 | 1 | 5.4 | 0.74 | 0.86 | 3.6 | 0.83 |
| 5 | 4 | 4.7 | 0.85 | 0.85 | 3.4 | 0.92 |
| 5 | 3 | 5.1 | 0.78 | 0.88 | 3.4 | 0.86 |
| 5 | 2 | 5.9 | 0.68 | 0.88 | 3.5 | 0.78 |
| 5 | 1 | 6.3 | 0.64 | 0.89 | 3.5 | 0.72 |
| 10 | 9 | 4.5 | 0.89 | 0.89 | 3.5 | 0.96 |
| 10 | 8 | 4.7 | 0.85 | 0.92 | 3.4 | 0.91 |
| 10 | 7 | 5.1 | 0.78 | 0.92 | 3.3 | 0.85 |
| 10 | 6 | 5.5 | 0.73 | 0.92 | 3.4 | 0.80 |

## 5. The weapon user against the caster, round by round

Damage a round against one target at Defense 13 (no map: the same target, no range or melee Banes), half the fights with Momentum; **fight** = a 3.5-round fight (rounds 1-3 + half of round 4). The brainstorm's check: the fight totals equal, the caster's round 1 at least 90% of the weapon user's. Caster variants: the tier's Overcast limit (1 / 2 / 3) or a fixed one, with or without the round-1 floor (once a fight, Overcast 1 without Escalation).

### A. Bounded

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.2 | 23.1 | 27.1 | 29.5 | 104.0 | |
| 1 | caster, tier limit, floor | 43.3 | 25.9 | 26.1 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.3 | 25.9 | 25.9 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 5 | weapon user | 44.5 | 29.6 | 31.2 | 33.7 | 122.1 | |
| 5 | caster, tier limit, floor | 49.4 | 32.2 | 30.1 | 30.1 | 126.7 | 111% · 104% |
| 5 | caster, tier limit, no floor | 47.1 | 30.0 | 30.1 | 30.1 | 122.3 | 106% · 100% |
| 5 | caster, limit 1, floor | 47.4 | 30.0 | 30.0 | 30.1 | 122.5 | 107% · 100% |
| 5 | caster, limit 3, floor | 51.9 | 30.2 | 29.9 | 29.9 | 127.0 | 117% · 104% |
| 10 | weapon user | 59.8 | 47.6 | 49.2 | 51.5 | 182.5 | |
| 10 | caster, tier limit, floor | 60.6 | 40.8 | 38.6 | 38.3 | 159.2 | 101% · 87% |
| 10 | caster, tier limit, no floor | 58.6 | 38.4 | 38.4 | 38.4 | 154.5 | 98% · 85% |
| 10 | caster, limit 1, floor | 56.1 | 38.3 | 38.5 | 38.3 | 152.0 | 94% · 83% |
| 10 | caster, limit 2, floor | 58.3 | 40.8 | 40.7 | 38.3 | 159.0 | 98% · 87% |

### B. Escalation-heavy

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.2 | 23.1 | 27.1 | 29.5 | 104.0 | |
| 1 | caster, tier limit, floor | 43.3 | 25.9 | 26.1 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.3 | 25.9 | 25.9 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 5 | weapon user | 49.4 | 34.4 | 39.0 | 43.7 | 144.7 | |
| 5 | caster, tier limit, floor | 53.4 | 36.1 | 32.5 | 32.5 | 138.2 | 108% · 96% |
| 5 | caster, tier limit, no floor | 49.8 | 32.6 | 32.6 | 32.5 | 131.3 | 101% · 91% |
| 5 | caster, limit 1, floor | 49.9 | 32.5 | 32.6 | 32.4 | 131.2 | 101% · 91% |
| 5 | caster, limit 3, floor | 56.8 | 32.5 | 32.5 | 32.6 | 138.0 | 115% · 95% |
| 10 | weapon user | 69.7 | 55.3 | 62.0 | 67.3 | 220.7 | |
| 10 | caster, tier limit, floor | 69.8 | 47.6 | 43.1 | 43.1 | 182.1 | 100% · 83% |
| 10 | caster, tier limit, no floor | 65.2 | 43.1 | 43.1 | 43.1 | 173.0 | 94% · 78% |
| 10 | caster, limit 1, floor | 60.8 | 43.2 | 43.1 | 42.9 | 168.5 | 87% · 76% |
| 10 | caster, limit 2, floor | 65.2 | 47.8 | 47.8 | 43.1 | 182.3 | 94% · 83% |

### C. +10% a level (the charter today)

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.2 | 23.1 | 27.1 | 29.5 | 104.0 | |
| 1 | caster, tier limit, floor | 43.3 | 25.9 | 26.1 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.3 | 25.9 | 25.9 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.6 | 117% · 106% |
| 5 | weapon user | 57.0 | 35.6 | 38.0 | 41.1 | 151.1 | |
| 5 | caster, tier limit, floor | 64.3 | 39.4 | 36.3 | 36.1 | 158.0 | 113% · 105% |
| 5 | caster, tier limit, no floor | 61.0 | 36.2 | 36.1 | 36.3 | 151.4 | 107% · 100% |
| 5 | caster, limit 1, floor | 60.6 | 36.3 | 36.5 | 36.2 | 151.5 | 106% · 100% |
| 5 | caster, limit 3, floor | 67.1 | 36.2 | 36.5 | 36.2 | 158.0 | 118% · 105% |
| 10 | weapon user | 81.6 | 48.3 | 51.6 | 56.2 | 209.6 | |
| 10 | caster, tier limit, floor | 91.2 | 53.6 | 49.3 | 49.3 | 218.8 | 112% · 104% |
| 10 | caster, tier limit, no floor | 87.0 | 49.2 | 49.2 | 49.2 | 210.0 | 107% · 100% |
| 10 | caster, limit 1, floor | 82.3 | 49.2 | 49.5 | 49.2 | 205.6 | 101% · 98% |
| 10 | caster, limit 2, floor | 87.5 | 53.3 | 53.5 | 49.2 | 218.9 | 107% · 104% |

## 6. What matches Mastery 2[W] for a caster

Model A at level 8 (Modifier +4, Overcast limit 3, the floor): the weapon user with 1[W] and with 2[W]; the caster with each candidate. Same columns as section 5.

| Build | round 1 | round 2 | round 3 | round 4 | fight | against the weapon user with 2[W]: round 1 · fight |
|---|---:|---:|---:|---:|---:|---|
| weapon user, 1[W] | 50.9 | 33.8 | 35.6 | 37.8 | 139.2 | 85% · 76% |
| weapon user, 2[W] | 59.8 | 47.6 | 49.2 | 51.5 | 182.5 | |
| caster, nothing | 55.6 | 36.6 | 34.4 | 34.4 | 143.8 | 93% · 79% |
| caster, keep the best (1 extra die) | 60.6 | 40.8 | 38.6 | 38.3 | 159.2 | 101% · 87% |
| caster, keep the best (2 extra dice) | 64.0 | 43.3 | 40.8 | 40.8 | 168.5 | 107% · 92% |
| caster, keep the best (3 extra dice) | 66.9 | 44.7 | 42.1 | 42.1 | 174.8 | 112% · 96% |
| caster, Spell Mastery (a second [W] of dice: +1d8 / +2d6) | 65.0 | 50.2 | 48.1 | 48.2 | 187.4 | 109% · 103% |
| caster, Spell Mastery + keep the best 1 | 70.0 | 55.4 | 53.1 | 52.7 | 204.8 | 117% · 112% |

## 7. The Standard day (easy, normal, normal, hard)

spec.mjs day(): four fights with no Rest between; Momentum after each fight harder than easy (the model's starting Escalation); Rally Points carried over (the book's formula: 6 or 5 + (Body + Mind + level) / 2 rounded up, each heals a quarter of the Pool); a Daily only in the hard fight. The NPCs of the party's level. **Today's scale**: 3 Standards | 4 Standards | Elite + 2 Standards | 2 Elites + 2 Standards (hard = CV 6). **Proposed scale** (hard = CV 1.25 a PC): 3 Standards | 4 Standards | Elite + 2 Standards | Elite + 3 Standards (CV 5).

| Model | Level 1: cleared · Downs a day · Rally Points left | Level 5: cleared · Downs a day · Rally Points left | Level 10: cleared · Downs a day · Rally Points left |
|---|---|---|---|
| A. Bounded, today's scale | 22% · 4.39 · 42% of 30 | 42% · 3.78 · 50% of 38 | 37% · 4.05 · 59% of 48 |
| A. Bounded, proposed scale | 77% · 2.67 · 32% of 30 | 90% · 1.94 · 46% of 38 | 92% · 2.13 · 55% of 48 |
| B. Escalation-heavy, today's scale | 22% · 4.39 · 42% of 30 | 52% · 3.51 · 47% of 38 | 48% · 3.61 · 58% of 48 |
| B. Escalation-heavy, proposed scale | 77% · 2.67 · 32% of 30 | 96% · 1.74 · 44% of 38 | 93% · 2.01 · 55% of 48 |
| C. +10% a level (the charter today), today's scale | 22% · 4.39 · 42% of 30 | 50% · 3.68 · 47% of 38 | 50% · 3.62 · 56% of 48 |
| C. +10% a level (the charter today), proposed scale | 77% · 2.67 · 32% of 30 | 91% · 2.00 · 44% of 38 | 91% · 2.06 · 54% of 48 |
| Level 1 against today's Bestiary (NPC Health x1: fights of about 3 rounds), today's scale | 52% · 3.30 · 42% of 30 |  |  |
| Level 1 against today's Bestiary, proposed scale | 94% · 1.58 · 40% of 30 |  |  |

Run time: 205 s.
