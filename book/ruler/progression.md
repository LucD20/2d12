# Progression models: the numbers (pack LV)

Written by `node book/ruler/progression.mjs` (the spec ruler, spec.mjs, with the map model). Don't edit this file: edit the script and run it again. The proposal that reads these numbers is `archive/book-drafts/progression-lv.md`.

Runs: 800 fights a measurement, 500 a calibration step. Half the fights start with Momentum. The party: 2 weapon users (melee, AD 14) + 2 casters (ranged, AD 13, the round-1 floor). NPCs: the Bestiary's level 1 Medium NPCs with Health and damage multiplied by the level's factors; their Defense and Modifier never change (decided).

- **A. Bounded.** Growth from the decided numbers only: the Modifier steps (+3 at level 5, +4 at level 8), Mastery 2[W] at level 8 for weapon users and keep the best for Power damage at level 8 for casters (matched by level), the tier's Overcast limit and Momentum. Picks after level 3 are options (sidegrades), not power.
- **B. Escalation-heavy.** The Modifier steps as in A, but no Mastery 2[W] or keep the best before level 10; the growth is in Escalation: each Escalation spent (the weapon user's Surge, the caster's Overcast) adds 1d8 / 2d6 / 2d8 by tier, and the weapon user gains a hold passive at level 5 (while Escalation 2+: Empowered 1 on its Strikes).
- **C. +10% a level (the charter today).** To compare: the charter's +10% sustained damage a level (from Talents; a flat damage factor here), Modifiers stay +2, Health (level + 10) / 10 (x2 at level 10, the book today); Momentum and Overcast as decided.

## 1. The stand-in PCs by level

Damage a turn against Defense 13 (one target, Monte Carlo): **Esc 0** = the main turn with no Escalation (no floor); **3.5-round fight** = rounds 1 to 3 and half of round 4, the Encounter Nova in round 1, no Daily, half the fights with Momentum, Escalation spent as the plan says. Health = the Health Pool.

| Model | Level | Modifier | Weapon user: Esc 0 / 3.5-round fight / Health | Caster: Esc 0 / 3.5-round fight / Health | growth of the fight damage (avg of both, level 1 = 100%) | Health (level 1 = 100%) |
|---|---:|---:|---|---|---:|---:|
| A | 1 | +2 | 21.2 / 104.1 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| A | 3 | +2 | 21.2 / 107.9 / 40 | 21.2 / 108.2 / 30 | 102% | 111% |
| A | 5 | +3 | 25.3 / 122.2 / 44 | 25.3 / 126.8 / 33 | 117% | 122% |
| A | 8 | +4 | 43.5 / 182.5 / 50 | 33.7 / 159.2 / 37 | 161% | 138% |
| A | 10 | +4 | 43.5 / 182.5 / 54 | 33.7 / 159.2 / 39 | 161% | 148% |
| B | 1 | +2 | 21.2 / 104.1 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| B | 3 | +2 | 21.2 / 107.9 / 40 | 21.2 / 108.2 / 30 | 102% | 111% |
| B | 5 | +3 | 25.3 / 144.8 / 44 | 25.3 / 138.4 / 33 | 133% | 122% |
| B | 8 | +4 | 29.7 / 169.1 / 50 | 29.7 / 166.6 / 37 | 158% | 138% |
| B | 10 | +4 | 43.5 / 220.6 / 54 | 33.7 / 182.1 / 39 | 190% | 148% |
| C | 1 | +2 | 21.2 / 104.1 / 36 | 21.2 / 108.2 / 27 | 100% | 100% |
| C | 3 | +2 | 25.4 / 129.5 / 42 | 25.4 / 129.8 / 31 | 122% | 116% |
| C | 5 | +2 | 29.7 / 151.1 / 49 | 29.6 / 158.0 / 36 | 146% | 135% |
| C | 8 | +2 | 36.0 / 187.5 / 59 | 36.0 / 195.7 / 43 | 180% | 162% |
| C | 10 | +2 | 40.2 / 209.6 / 64 | 40.2 / 218.7 / 47 | 202% | 176% |

## 2. NPC Health and damage by level (a Standard fight lasts 3.5 rounds)

**Health factor**: what the level 1 Bestiary's NPC Health is multiplied by so that 4 Standards last 3.5 rounds (mean) against the party of that level (found by bisection). **Damage factor**: NPC damage follows the PCs' Health (the share of Health a hit takes stays the same). Level 1 shows the refit E3 needs for 3.5 rounds (the Bestiary was built for about 3).

| Level | A: Health / damage factor | B: Health / damage factor | C: Health / damage factor |
|---:|---:|---:|---:|
| 1 | 1.02 / 1.00 | 1.02 / 1.00 | 1.02 / 1.00 |
| 2 | 1.02 / 1.06 | 1.02 / 1.06 | 1.12 / 1.08 |
| 3 | 1.04 / 1.11 | 1.04 / 1.11 | 1.25 / 1.16 |
| 4 | 1.04 / 1.16 | 1.04 / 1.16 | 1.36 / 1.27 |
| 5 | 1.20 / 1.22 | 1.34 / 1.22 | 1.47 / 1.35 |
| 6 | 1.23 / 1.27 | 1.36 / 1.27 | 1.59 / 1.44 |
| 7 | 1.21 / 1.32 | 1.37 / 1.32 | 1.72 / 1.54 |
| 8 | 1.66 / 1.38 | 1.59 / 1.38 | 1.87 / 1.62 |
| 9 | 1.71 / 1.44 | 1.59 / 1.44 | 1.94 / 1.70 |
| 10 | 1.68 / 1.48 | 1.93 / 1.48 | 2.09 / 1.76 |

NPC Health a level (the factor's growth from level 1): A 117% at level 5, 164% at level 10; B 131% at level 5, 188% at level 10; C 143% at level 5, 204% at level 10.

## 3. Fight length and Health lost by difficulty

The NPCs of the party's level (section 2's factors). Rounds (mean) · Health lost (share of the party's Health Pool) · a PC Down · the party wins.

### A. Bounded

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.5 r · 23% · Down 11% · won 100% | 2.4 r · 23% · Down 12% · won 100% | 2.5 r · 24% · Down 12% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 40% · Down 34% · won 98% | 3.5 r · 41% · Down 39% · won 99% | 3.6 r · 43% · Down 45% · won 98% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.5 r · 40% · Down 45% · won 100% | 3.6 r · 43% · Down 55% · won 98% | 3.6 r · 43% · Down 52% · won 99% |
| CV 5 (5 Standards) |  | 4.8 r · 66% · Down 75% · won 80% | 4.1 r · 55% · Down 60% · won 91% | 4.4 r · 60% · Down 66% · won 87% |
| hard (CV 6) | 4-4.5 | 5.1 r · 89% · Down 95% · won 34% | 4.9 r · 79% · Down 87% · won 54% | 5.0 r · 85% · Down 91% · won 43% |
| CV 7 (7 Standards) |  | 4.0 r · 99% · Down 100% · won 5% | 4.3 r · 95% · Down 97% · won 16% | 4.2 r · 97% · Down 99% · won 10% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.4 r · 89% · Down 96% · won 35% | 5.0 r · 82% · Down 91% · won 47% | 5.1 r · 85% · Down 93% · won 43% |
| deadly (CV 8) | 5 | 3.3 r · 100% · Down 100% · won 1% | 3.5 r · 99% · Down 100% · won 2% | 3.4 r · 100% · Down 100% · won 1% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 3.6 r · 100% · Down 100% · won 0% | 3.7 r · 100% · Down 100% · won 1% | 3.7 r · 100% · Down 100% · won 1% |

### B. Escalation-heavy

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.5 r · 23% · Down 11% · won 100% | 2.4 r · 23% · Down 11% · won 100% | 2.5 r · 24% · Down 14% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 40% · Down 34% · won 98% | 3.5 r · 42% · Down 41% · won 99% | 3.5 r · 42% · Down 41% · won 98% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.5 r · 40% · Down 45% · won 100% | 3.6 r · 43% · Down 54% · won 98% | 3.5 r · 42% · Down 50% · won 98% |
| CV 5 (5 Standards) |  | 4.8 r · 66% · Down 75% · won 80% | 4.1 r · 56% · Down 61% · won 88% | 4.3 r · 59% · Down 64% · won 87% |
| hard (CV 6) | 4-4.5 | 5.1 r · 89% · Down 95% · won 34% | 4.7 r · 80% · Down 85% · won 50% | 4.9 r · 83% · Down 90% · won 49% |
| CV 7 (7 Standards) |  | 4.0 r · 99% · Down 100% · won 5% | 4.3 r · 95% · Down 98% · won 16% | 4.2 r · 95% · Down 98% · won 14% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.4 r · 89% · Down 96% · won 35% | 4.9 r · 82% · Down 90% · won 48% | 5.1 r · 83% · Down 92% · won 46% |
| deadly (CV 8) | 5 | 3.3 r · 100% · Down 100% · won 1% | 3.5 r · 99% · Down 100% · won 3% | 3.4 r · 100% · Down 100% · won 2% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 3.6 r · 100% · Down 100% · won 0% | 3.6 r · 100% · Down 100% · won 1% | 3.7 r · 100% · Down 100% · won 1% |

### C. +10% a level (the charter today)

| Fight | target rounds | Level 1 | Level 5 | Level 10 |
|---|---:|---|---|---|
| easy (CV 3) | 2.5 | 2.5 r · 23% · Down 11% · won 100% | 2.4 r · 24% · Down 15% · won 100% | 2.4 r · 23% · Down 10% · won 100% |
| standard (CV 4) | 3.5 | 3.5 r · 40% · Down 34% · won 98% | 3.5 r · 42% · Down 42% · won 98% | 3.5 r · 41% · Down 38% · won 98% |
| standard: Elite + 2 Standards (CV 4) | 3.5 | 3.5 r · 40% · Down 45% · won 100% | 3.5 r · 42% · Down 48% · won 97% | 3.6 r · 43% · Down 50% · won 98% |
| CV 5 (5 Standards) |  | 4.8 r · 66% · Down 75% · won 80% | 4.0 r · 55% · Down 59% · won 88% | 4.1 r · 54% · Down 58% · won 90% |
| hard (CV 6) | 4-4.5 | 5.1 r · 89% · Down 95% · won 34% | 4.7 r · 79% · Down 85% · won 54% | 4.9 r · 81% · Down 90% · won 50% |
| CV 7 (7 Standards) |  | 4.0 r · 99% · Down 100% · won 5% | 4.3 r · 95% · Down 97% · won 16% | 4.3 r · 95% · Down 97% · won 15% |
| hard: 2 Elites + 2 Standards (CV 6) | 4-4.5 | 5.4 r · 89% · Down 96% · won 35% | 5.0 r · 79% · Down 89% · won 56% | 5.0 r · 81% · Down 91% · won 50% |
| deadly (CV 8) | 5 | 3.3 r · 100% · Down 100% · won 1% | 3.4 r · 100% · Down 100% · won 1% | 3.5 r · 99% · Down 100% · won 2% |
| deadly: 2 Elites + 4 Standards (CV 8) | 5 | 3.6 r · 100% · Down 100% · won 0% | 3.8 r · 99% · Down 100% · won 3% | 3.8 r · 100% · Down 100% · won 1% |

## 4. The CV of a lower-level NPC (the level-gap factor)

The party of the level against Standards of 1 to 4 levels lower: how many of them take as much of the party's Health as 4 Standards of its own level (interpolated between whole counts). **CV each** = 4 / that count; **a level** = the factor for one level of gap (CV each to the power 1 / gap). The brainstorm's guess: about ×0.8 a level. The last column is a prediction (Lanchester's square law: a side's strength grows with its numbers squared, so a creature's worth is the square root of Health × damage): it should match CV each.

### A. Bounded

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 4.6 | 0.87 | 0.87 | 3.7 | 0.97 |
| 3 | 1 | 4.9 | 0.82 | 0.90 | 3.7 | 0.94 |
| 5 | 4 | 4.7 | 0.84 | 0.84 | 3.4 | 0.91 |
| 5 | 3 | 4.7 | 0.84 | 0.92 | 3.4 | 0.89 |
| 5 | 2 | 5.1 | 0.78 | 0.92 | 3.4 | 0.86 |
| 5 | 1 | 5.3 | 0.76 | 0.93 | 3.6 | 0.84 |
| 10 | 9 | 3.9 | 1.02 | 1.02 | 3.5 | 1.00 |
| 10 | 8 | 4.2 | 0.96 | 0.98 | 3.5 | 0.96 |
| 10 | 7 | 5.2 | 0.77 | 0.91 | 3.3 | 0.80 |
| 10 | 6 | 5.4 | 0.74 | 0.93 | 3.4 | 0.79 |

### B. Escalation-heavy

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 4.6 | 0.87 | 0.87 | 3.7 | 0.97 |
| 3 | 1 | 4.9 | 0.82 | 0.90 | 3.7 | 0.94 |
| 5 | 4 | 5.1 | 0.79 | 0.79 | 3.2 | 0.86 |
| 5 | 3 | 5.1 | 0.79 | 0.89 | 3.2 | 0.84 |
| 5 | 2 | 5.3 | 0.75 | 0.91 | 3.3 | 0.82 |
| 5 | 1 | 5.6 | 0.72 | 0.92 | 3.4 | 0.79 |
| 10 | 9 | 4.6 | 0.86 | 0.86 | 3.3 | 0.90 |
| 10 | 8 | 4.7 | 0.85 | 0.92 | 3.3 | 0.88 |
| 10 | 7 | 5.3 | 0.75 | 0.91 | 3.2 | 0.80 |
| 10 | 6 | 5.5 | 0.73 | 0.92 | 3.3 | 0.78 |

### C. +10% a level (the charter today)

| Party level | NPC level | Standards for the same Health lost | CV each | a level | rounds of that fight | √(Health × damage) of the NPC against one of the party's level |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 4.8 | 0.83 | 0.83 | 3.4 | 0.91 |
| 3 | 1 | 5.3 | 0.76 | 0.87 | 3.4 | 0.84 |
| 5 | 4 | 5.0 | 0.79 | 0.79 | 3.5 | 0.93 |
| 5 | 3 | 5.4 | 0.75 | 0.86 | 3.5 | 0.85 |
| 5 | 2 | 6.0 | 0.67 | 0.87 | 3.5 | 0.78 |
| 5 | 1 | 6.3 | 0.63 | 0.89 | 3.6 | 0.72 |
| 10 | 9 | 4.2 | 0.96 | 0.96 | 3.4 | 0.95 |
| 10 | 8 | 4.7 | 0.84 | 0.92 | 3.4 | 0.91 |
| 10 | 7 | 5.2 | 0.76 | 0.91 | 3.4 | 0.85 |
| 10 | 6 | 5.6 | 0.71 | 0.92 | 3.4 | 0.79 |

## 5. The weapon user against the caster, round by round

Damage a round against one target at Defense 13 (no map: the same target, no range or melee Banes), half the fights with Momentum; **fight** = a 3.5-round fight (rounds 1-3 + half of round 4). The brainstorm's check: the fight totals equal, the caster's round 1 at least 90% of the weapon user's. Caster variants: the tier's Overcast limit (1 / 2 / 3) or a fixed one, with or without the round-1 floor (once a fight, Overcast 1 without Escalation).

### A. Bounded

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.1 | 23.1 | 27.2 | 29.5 | 104.1 | |
| 1 | caster, tier limit, floor | 43.4 | 25.9 | 26.0 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.2 | 25.9 | 26.0 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 5 | weapon user | 44.5 | 29.7 | 31.3 | 33.6 | 122.2 | |
| 5 | caster, tier limit, floor | 49.5 | 32.2 | 30.1 | 30.1 | 126.8 | 111% · 104% |
| 5 | caster, tier limit, no floor | 47.2 | 30.1 | 30.1 | 30.1 | 122.4 | 106% · 100% |
| 5 | caster, limit 1, floor | 47.3 | 30.0 | 30.1 | 30.1 | 122.5 | 106% · 100% |
| 5 | caster, limit 3, floor | 51.8 | 30.2 | 30.0 | 29.9 | 126.9 | 116% · 104% |
| 10 | weapon user | 59.9 | 47.6 | 49.2 | 51.5 | 182.5 | |
| 10 | caster, tier limit, floor | 60.6 | 40.9 | 38.5 | 38.3 | 159.2 | 101% · 87% |
| 10 | caster, tier limit, no floor | 58.6 | 38.4 | 38.4 | 38.4 | 154.6 | 98% · 85% |
| 10 | caster, limit 1, floor | 56.1 | 38.3 | 38.5 | 38.3 | 152.0 | 94% · 83% |
| 10 | caster, limit 2, floor | 58.3 | 40.8 | 40.8 | 38.3 | 159.0 | 97% · 87% |

### B. Escalation-heavy

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.1 | 23.1 | 27.2 | 29.5 | 104.1 | |
| 1 | caster, tier limit, floor | 43.4 | 25.9 | 26.0 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.2 | 25.9 | 26.0 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 5 | weapon user | 49.6 | 34.4 | 39.0 | 43.6 | 144.8 | |
| 5 | caster, tier limit, floor | 53.5 | 36.1 | 32.5 | 32.5 | 138.4 | 108% · 96% |
| 5 | caster, tier limit, no floor | 49.8 | 32.6 | 32.7 | 32.5 | 131.3 | 101% · 91% |
| 5 | caster, limit 1, floor | 49.9 | 32.5 | 32.6 | 32.3 | 131.2 | 101% · 91% |
| 5 | caster, limit 3, floor | 56.9 | 32.5 | 32.5 | 32.6 | 138.1 | 115% · 95% |
| 10 | weapon user | 69.7 | 55.3 | 62.0 | 67.3 | 220.6 | |
| 10 | caster, tier limit, floor | 69.8 | 47.6 | 43.2 | 43.1 | 182.1 | 100% · 83% |
| 10 | caster, tier limit, no floor | 65.2 | 43.2 | 43.1 | 43.0 | 173.0 | 94% · 78% |
| 10 | caster, limit 1, floor | 60.8 | 43.2 | 43.1 | 42.9 | 168.6 | 87% · 76% |
| 10 | caster, limit 2, floor | 65.3 | 47.7 | 47.7 | 43.1 | 182.3 | 94% · 83% |

### C. +10% a level (the charter today)

| Level | Build | round 1 | round 2 | round 3 | round 4 | fight | caster / weapon: round 1 · fight |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 39.1 | 23.1 | 27.2 | 29.5 | 104.1 | |
| 1 | caster, tier limit, floor | 43.4 | 25.9 | 26.0 | 25.9 | 108.2 | 111% · 104% |
| 1 | caster, tier limit, no floor | 41.2 | 25.9 | 26.0 | 25.9 | 106.0 | 105% · 102% |
| 1 | caster, limit 2, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 1 | caster, limit 3, floor | 45.7 | 25.9 | 25.9 | 25.9 | 110.5 | 117% · 106% |
| 5 | weapon user | 56.9 | 35.6 | 38.0 | 41.2 | 151.1 | |
| 5 | caster, tier limit, floor | 64.3 | 39.3 | 36.3 | 36.2 | 158.0 | 113% · 105% |
| 5 | caster, tier limit, no floor | 60.9 | 36.3 | 36.1 | 36.3 | 151.4 | 107% · 100% |
| 5 | caster, limit 1, floor | 60.7 | 36.2 | 36.5 | 36.3 | 151.5 | 107% · 100% |
| 5 | caster, limit 3, floor | 67.0 | 36.3 | 36.5 | 36.2 | 158.0 | 118% · 105% |
| 10 | weapon user | 81.6 | 48.2 | 51.7 | 56.1 | 209.6 | |
| 10 | caster, tier limit, floor | 91.1 | 53.7 | 49.2 | 49.4 | 218.7 | 112% · 104% |
| 10 | caster, tier limit, no floor | 87.0 | 49.3 | 49.2 | 49.3 | 210.1 | 107% · 100% |
| 10 | caster, limit 1, floor | 82.4 | 49.1 | 49.5 | 49.2 | 205.6 | 101% · 98% |
| 10 | caster, limit 2, floor | 87.4 | 53.4 | 53.5 | 49.2 | 218.9 | 107% · 104% |

## 6. What matches Mastery 2[W] for a caster

Model A at level 8 (Modifier +4, Overcast limit 3, the floor): the weapon user with 1[W] and with 2[W]; the caster with each candidate. Same columns as section 5.

| Build | round 1 | round 2 | round 3 | round 4 | fight | against the weapon user with 2[W]: round 1 · fight |
|---|---:|---:|---:|---:|---:|---|
| weapon user, 1[W] | 50.9 | 33.8 | 35.6 | 37.8 | 139.3 | 85% · 76% |
| weapon user, 2[W] | 59.9 | 47.6 | 49.2 | 51.5 | 182.5 | |
| caster, nothing | 55.7 | 36.6 | 34.4 | 34.4 | 143.9 | 93% · 79% |
| caster, keep the best (1 extra die) | 60.6 | 40.9 | 38.5 | 38.3 | 159.2 | 101% · 87% |
| caster, keep the best (2 extra dice) | 64.0 | 43.2 | 40.8 | 40.7 | 168.4 | 107% · 92% |
| caster, keep the best (3 extra dice) | 66.9 | 44.7 | 42.1 | 42.1 | 174.8 | 112% · 96% |
| caster, Spell Mastery (a second [W] of dice: +1d8 / +2d6) | 65.1 | 50.1 | 48.1 | 48.3 | 187.5 | 109% · 103% |
| caster, Spell Mastery + keep the best 1 | 70.0 | 55.4 | 53.0 | 52.8 | 204.8 | 117% · 112% |

## 7. The Standard day (easy, normal, normal, hard)

spec.mjs day(): four fights with no Rest between; Momentum after each fight harder than easy (the model's starting Escalation); Rally Points carried over (the book's formula: 6 or 5 + (Body + Mind + level) / 2 rounded up, each heals a quarter of the Pool); a Daily only in the hard fight. The NPCs of the party's level. **Today's scale**: 3 Standards | 4 Standards | Elite + 2 Standards | 2 Elites + 2 Standards (hard = CV 6). **Proposed scale** (hard = CV 1.25 a PC): 3 Standards | 4 Standards | Elite + 2 Standards | Elite + 3 Standards (CV 5).

| Model | Level 1: cleared · Downs a day · Rally Points left | Level 5: cleared · Downs a day · Rally Points left | Level 10: cleared · Downs a day · Rally Points left |
|---|---|---|---|
| A. Bounded, today's scale | 25% · 4.65 · 39% of 30 | 44% · 4.38 · 45% of 38 | 37% · 4.48 · 56% of 48 |
| A. Bounded, proposed scale | 68% · 3.41 · 31% of 30 | 82% · 3.07 · 41% of 38 | 83% · 2.82 · 51% of 48 |
| B. Escalation-heavy, today's scale | 25% · 4.65 · 39% of 30 | 51% · 4.13 · 45% of 38 | 49% · 4.10 · 55% of 48 |
| B. Escalation-heavy, proposed scale | 68% · 3.41 · 31% of 30 | 85% · 2.83 · 41% of 38 | 86% · 2.83 · 51% of 48 |
| C. +10% a level (the charter today), today's scale | 25% · 4.65 · 39% of 30 | 51% · 3.94 · 44% of 38 | 46% · 4.09 · 54% of 48 |
| C. +10% a level (the charter today), proposed scale | 68% · 3.41 · 31% of 30 | 86% · 2.84 · 40% of 38 | 84% · 2.70 · 51% of 48 |
| Level 1 against today's Bestiary (NPC Health x1: fights of about 3 rounds), today's scale | 29% · 4.43 · 39% of 30 |  |  |
| Level 1 against today's Bestiary, proposed scale | 77% · 3.06 · 31% of 30 |  |  |

Run time: 282 s.
