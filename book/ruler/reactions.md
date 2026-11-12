# Reactions: how often they trigger, and the game without the basic Opportunity Attack

Written by `node book/ruler/sim/reactions.mjs`; don't edit, run it again. **Nothing here is in the book**: two measurements for Lucas (2026-11-12).

Runs: 400 fights a cell; two cells differ for real when they are more than about 4 points apart. The party: fights.txt's four R builds, level 1, today's rules and Bestiary. The PCs in order: Paladin (Smite) / Paladin (Lay On Hands) / Archer (Double Shot) / Archer (Rolling Shot).

## 1. How often each Reaction fires (today's rules)

A PC has 1 Reaction AP a round. **Fires a round:** the Reaction's uses over the rounds its owner was up. **Rounds with a Reaction:** the share of the owner's rounds in which it used its Reaction AP on anything. The plan policy keeps the Reaction AP for the class Reaction; "react to the first trigger" spends it on whatever comes first.

**The party plays: the plan**

| Fight | PC | Reaction | Fires a round | Rounds with a Reaction | NPC Opportunity Attacks on it a fight |
|---|---|---|---:|---:|---:|
| 4 Standards (normal) | Paladin (Smite) | Rebuke: 0.54 | 0.54 | 52% | 0.00 |
| 4 Standards (normal) | Paladin (Lay On Hands) | Shield of Faith: 0.70; Opportunity Attack: 0.00 | 0.70 | 67% | 0.00 |
| 4 Standards (normal) | Archer (Double Shot) | Overwatch: 0.59 | 0.59 | 56% | 0.00 |
| 4 Standards (normal) | Archer (Rolling Shot) | Covering Shot: 0.73; Opportunity Attack: 0.00 | 0.73 | 69% | 0.00 |
| 6 Standards (CV 6, deadly) | Paladin (Smite) | Rebuke: 0.64 | 0.64 | 61% | 0.00 |
| 6 Standards (CV 6, deadly) | Paladin (Lay On Hands) | Shield of Faith: 0.85 | 0.85 | 81% | 0.00 |
| 6 Standards (CV 6, deadly) | Archer (Double Shot) | Overwatch: 0.81 | 0.81 | 73% | 0.00 |
| 6 Standards (CV 6, deadly) | Archer (Rolling Shot) | Covering Shot: 0.79; Opportunity Attack: 0.00 | 0.79 | 73% | 0.00 |
| Elite + 2 Standards | Paladin (Smite) | Rebuke: 0.48 | 0.48 | 47% | 0.00 |
| Elite + 2 Standards | Paladin (Lay On Hands) | Shield of Faith: 0.65; Opportunity Attack: 0.01 | 0.66 | 64% | 0.00 |
| Elite + 2 Standards | Archer (Double Shot) | Overwatch: 0.46 | 0.46 | 43% | 0.00 |
| Elite + 2 Standards | Archer (Rolling Shot) | Covering Shot: 0.69 | 0.69 | 67% | 0.00 |

**The party plays: react to the first trigger**

| Fight | PC | Reaction | Fires a round | Rounds with a Reaction | NPC Opportunity Attacks on it a fight |
|---|---|---|---:|---:|---:|
| 4 Standards (normal) | Paladin (Smite) | Rebuke: 0.38; Opportunity Attack: 0.17 | 0.55 | 54% | 0.00 |
| 4 Standards (normal) | Paladin (Lay On Hands) | Shield of Faith: 0.63; Opportunity Attack: 0.15 | 0.78 | 74% | 0.00 |
| 4 Standards (normal) | Archer (Double Shot) | Overwatch: 0.57; Opportunity Attack: 0.02 | 0.59 | 55% | 0.00 |
| 4 Standards (normal) | Archer (Rolling Shot) | Covering Shot: 0.73; Opportunity Attack: 0.01 | 0.74 | 70% | 0.00 |
| 6 Standards (CV 6, deadly) | Paladin (Smite) | Rebuke: 0.50; Opportunity Attack: 0.19 | 0.69 | 67% | 0.00 |
| 6 Standards (CV 6, deadly) | Paladin (Lay On Hands) | Shield of Faith: 0.74; Opportunity Attack: 0.15 | 0.89 | 86% | 0.00 |
| 6 Standards (CV 6, deadly) | Archer (Double Shot) | Overwatch: 0.77; Opportunity Attack: 0.03 | 0.80 | 73% | 0.00 |
| 6 Standards (CV 6, deadly) | Archer (Rolling Shot) | Covering Shot: 0.87; Opportunity Attack: 0.01 | 0.88 | 79% | 0.00 |
| Elite + 2 Standards | Paladin (Smite) | Rebuke: 0.32; Opportunity Attack: 0.17 | 0.48 | 48% | 0.00 |
| Elite + 2 Standards | Paladin (Lay On Hands) | Shield of Faith: 0.62; Opportunity Attack: 0.13 | 0.75 | 73% | 0.00 |
| Elite + 2 Standards | Archer (Double Shot) | Overwatch: 0.37; Opportunity Attack: 0.01 | 0.38 | 36% | 0.00 |
| Elite + 2 Standards | Archer (Rolling Shot) | Covering Shot: 0.74; Opportunity Attack: 0.00 | 0.75 | 71% | 0.00 |

## 2. Without the basic Opportunity Attack

Each fight cell: rounds · Health lost · a PC Down · won. **Damage taken:** each PC's share of the damage the party took (even = 25% each). **Down:** how often each PC went Down. **OAs:** Opportunity Attacks a fight, the PCs' / the enemies'.

**4 Standards (normal), the open field; the party plays the plan**

| Rule | The enemies | The fight | Damage taken | Down | OAs |
|---|---|---|---|---|---|
| Today: everyone has it | spread their attacks (the plan) | 3.6 · 12% · 22% · 100% | 34% / 26% / 19% / 20% | 10% / 6% / 4% / 6% | 0.02 / 0.00 |
| Today: everyone has it | go for the nearest PC | 3.6 · 16% · 27% · 99% | 47% / 44% / 2% / 7% | 19% / 15% / 2% / 5% | 0.00 / 0.00 |
| Today: everyone has it | go for the back line | 3.9 · 14% · 30% · 100% | 17% / 13% / 32% / 38% | 3% / 2% / 14% / 17% | 0.05 / 0.00 |
| Nobody has it | spread their attacks (the plan) | 3.6 · 13% · 22% · 100% | 36% / 27% / 18% / 20% | 10% / 7% / 6% / 5% | 0.00 / 0.00 |
| Nobody has it | go for the nearest PC | 3.6 · 16% · 27% · 99% | 47% / 44% / 2% / 7% | 19% / 15% / 2% / 5% | 0.00 / 0.00 |
| Nobody has it | go for the back line | 4.0 · 15% · 33% · 100% | 19% / 13% / 32% / 36% | 4% / 3% / 15% / 19% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | spread their attacks (the plan) | 3.6 · 13% · 21% · 99% | 36% / 26% / 17% / 21% | 11% / 7% / 5% / 6% | 0.01 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the nearest PC | 3.6 · 16% · 27% · 99% | 47% / 44% / 2% / 7% | 19% / 15% / 2% / 5% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the back line | 3.9 · 14% · 32% · 100% | 18% / 13% / 32% / 38% | 3% / 2% / 15% / 18% | 0.04 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | spread their attacks (the plan) | 3.6 · 13% · 23% · 100% | 34% / 27% / 18% / 21% | 10% / 6% / 6% / 6% | 0.01 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the nearest PC | 3.6 · 16% · 27% · 99% | 47% / 44% / 2% / 7% | 19% / 15% / 2% / 5% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the back line | 3.9 · 14% · 32% · 100% | 18% / 13% / 32% / 38% | 3% / 2% / 15% / 18% | 0.04 / 0.00 |

**6 Standards (CV 6, deadly), the open field; the party plays the plan**

| Rule | The enemies | The fight | Damage taken | Down | OAs |
|---|---|---|---|---|---|
| Today: everyone has it | spread their attacks (the plan) | 5.6 · 44% · 66% · 74% | 29% / 26% / 23% / 22% | 46% / 28% / 43% / 39% | 0.00 / 0.00 |
| Today: everyone has it | go for the nearest PC | 5.0 · 51% · 67% · 64% | 38% / 36% / 11% / 15% | 63% / 47% / 38% / 41% | 0.00 / 0.00 |
| Today: everyone has it | go for the back line | 6.6 · 48% · 80% · 73% | 23% / 22% / 27% / 28% | 28% / 22% / 67% / 66% | 0.00 / 0.00 |
| Nobody has it | spread their attacks (the plan) | 5.6 · 43% · 63% · 73% | 30% / 26% / 23% / 22% | 44% / 27% / 44% / 39% | 0.00 / 0.00 |
| Nobody has it | go for the nearest PC | 5.0 · 51% · 67% · 64% | 38% / 36% / 11% / 15% | 63% / 47% / 38% / 41% | 0.00 / 0.00 |
| Nobody has it | go for the back line | 6.7 · 49% · 81% · 72% | 24% / 22% / 26% / 28% | 30% / 23% / 67% / 68% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | spread their attacks (the plan) | 5.6 · 43% · 63% · 73% | 30% / 26% / 23% / 22% | 43% / 27% / 43% / 38% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the nearest PC | 5.0 · 51% · 67% · 64% | 38% / 36% / 11% / 15% | 63% / 47% / 38% / 41% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the back line | 6.6 · 48% · 80% · 73% | 23% / 22% / 27% / 28% | 28% / 22% / 67% / 66% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | spread their attacks (the plan) | 5.6 · 43% · 63% · 73% | 30% / 26% / 23% / 22% | 43% / 27% / 43% / 38% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the nearest PC | 5.0 · 51% · 67% · 64% | 38% / 36% / 11% / 15% | 63% / 47% / 38% / 41% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the back line | 6.6 · 48% · 80% · 73% | 23% / 22% / 27% / 28% | 28% / 22% / 67% / 66% | 0.00 / 0.00 |

**4 Standards (normal), the pillars; the party plays the plan**

| Rule | The enemies | The fight | Damage taken | Down | OAs |
|---|---|---|---|---|---|
| Today: everyone has it | spread their attacks (the plan) | 3.7 · 20% · 32% · 97% | 32% / 29% / 20% / 20% | 15% / 13% / 11% / 9% | 0.01 / 0.01 |
| Today: everyone has it | go for the nearest PC | 3.8 · 28% · 42% · 94% | 45% / 41% / 5% / 9% | 32% / 29% / 7% / 10% | 0.00 / 0.00 |
| Today: everyone has it | go for the back line | 3.9 · 18% · 35% · 99% | 19% / 13% / 32% / 35% | 6% / 2% / 19% / 18% | 0.04 / 0.00 |
| Nobody has it | spread their attacks (the plan) | 3.7 · 19% · 31% · 98% | 31% / 29% / 18% / 22% | 14% / 10% / 10% / 9% | 0.00 / 0.00 |
| Nobody has it | go for the nearest PC | 3.8 · 27% · 42% · 94% | 44% / 41% / 5% / 10% | 32% / 26% / 7% / 12% | 0.00 / 0.00 |
| Nobody has it | go for the back line | 3.8 · 17% · 34% · 100% | 19% / 14% / 33% / 34% | 5% / 1% / 19% / 16% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | spread their attacks (the plan) | 3.7 · 20% · 32% · 98% | 32% / 29% / 19% / 20% | 16% / 12% / 10% / 7% | 0.01 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the nearest PC | 3.8 · 27% · 42% · 94% | 44% / 41% / 5% / 10% | 32% / 26% / 7% / 12% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the back line | 3.9 · 18% · 36% · 99% | 19% / 13% / 32% / 35% | 6% / 3% / 19% / 17% | 0.04 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | spread their attacks (the plan) | 3.7 · 20% · 32% · 97% | 32% / 29% / 20% / 20% | 15% / 13% / 11% / 9% | 0.01 / 0.01 |
| The Paladins and the enemies have it; the Archers don't | go for the nearest PC | 3.8 · 28% · 42% · 94% | 45% / 41% / 5% / 9% | 32% / 29% / 7% / 10% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the back line | 3.9 · 18% · 35% · 99% | 19% / 13% / 32% / 35% | 6% / 2% / 19% / 18% | 0.04 / 0.00 |

**6 Standards (CV 6, deadly), the pillars; the party plays the plan**

| Rule | The enemies | The fight | Damage taken | Down | OAs |
|---|---|---|---|---|---|
| Today: everyone has it | spread their attacks (the plan) | 5.3 · 58% · 78% · 60% | 28% / 28% / 21% / 23% | 56% / 42% / 57% / 56% | 0.01 / 0.01 |
| Today: everyone has it | go for the nearest PC | 4.4 · 79% · 90% · 33% | 30% / 33% / 18% / 19% | 87% / 75% / 71% / 71% | 0.00 / 0.00 |
| Today: everyone has it | go for the back line | 6.2 · 57% · 84% · 61% | 25% / 25% / 24% / 26% | 41% / 34% / 75% / 71% | 0.01 / 0.01 |
| Nobody has it | spread their attacks (the plan) | 5.3 · 58% · 78% · 58% | 27% / 28% / 21% / 23% | 56% / 44% / 58% / 57% | 0.00 / 0.00 |
| Nobody has it | go for the nearest PC | 4.5 · 77% · 90% · 35% | 31% / 33% / 17% / 19% | 86% / 74% / 68% / 69% | 0.00 / 0.00 |
| Nobody has it | go for the back line | 6.3 · 56% · 85% · 64% | 24% / 25% / 24% / 27% | 38% / 33% / 76% / 70% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | spread their attacks (the plan) | 5.2 · 58% · 77% · 58% | 28% / 28% / 21% / 23% | 56% / 44% / 57% / 56% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the nearest PC | 4.5 · 77% · 90% · 35% | 31% / 33% / 17% / 19% | 86% / 74% / 68% / 69% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | go for the back line | 6.2 · 56% · 85% · 64% | 25% / 25% / 24% / 26% | 39% / 32% / 75% / 70% | 0.01 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | spread their attacks (the plan) | 5.3 · 56% · 75% · 62% | 28% / 28% / 21% / 23% | 54% / 41% / 55% / 55% | 0.00 / 0.01 |
| The Paladins and the enemies have it; the Archers don't | go for the nearest PC | 4.4 · 79% · 90% · 33% | 30% / 33% / 18% / 19% | 87% / 75% / 71% / 71% | 0.00 / 0.00 |
| The Paladins and the enemies have it; the Archers don't | go for the back line | 6.1 · 57% · 85% · 61% | 24% / 25% / 25% / 26% | 41% / 34% / 75% / 71% | 0.01 / 0.01 |

**How the party plays** (6 Standards, the open field):

| Rule | The party | The enemies | The fight | Damage taken | Down | OAs |
|---|---|---|---|---|---|---|
| Today: everyone has it | holds the line | the plan | 5.4 · 34% · 56% · 85% | 29% / 25% / 24% / 22% | 31% / 19% / 36% / 27% | 0.10 / 0.00 |
| Today: everyone has it | holds the line | the back line | 6.7 · 49% · 81% · 71% | 23% / 22% / 27% / 27% | 32% / 24% / 69% / 66% | 0.24 / 0.00 |
| Today: everyone has it | kites | the plan | 5.9 · 49% · 72% · 68% | 29% / 27% / 22% / 23% | 49% / 32% / 48% / 48% | 0.00 / 0.00 |
| Today: everyone has it | kites | the back line | 7.0 · 58% · 86% · 60% | 24% / 24% / 26% / 26% | 45% / 35% / 72% / 74% | 0.01 / 0.00 |
| Today: everyone has it | tactical (hold + kite + protect) | the plan | 5.8 · 43% · 62% · 75% | 29% / 26% / 22% / 23% | 42% / 28% / 39% / 41% | 0.13 / 0.21 |
| Today: everyone has it | tactical (hold + kite + protect) | the back line | 7.1 · 53% · 83% · 67% | 24% / 24% / 26% / 26% | 37% / 27% / 70% / 74% | 0.28 / 0.60 |
| Nobody has it | holds the line | the plan | 5.5 · 40% · 59% · 77% | 29% / 26% / 23% / 21% | 37% / 25% / 42% / 38% | 0.00 / 0.00 |
| Nobody has it | holds the line | the back line | 6.7 · 45% · 78% · 77% | 23% / 21% / 27% / 28% | 26% / 20% / 65% / 64% | 0.00 / 0.00 |
| Nobody has it | kites | the plan | 5.9 · 51% · 73% · 68% | 29% / 28% / 21% / 23% | 55% / 36% / 44% / 50% | 0.00 / 0.00 |
| Nobody has it | kites | the back line | 7.0 · 53% · 84% · 66% | 23% / 24% / 27% / 27% | 37% / 29% / 69% / 72% | 0.00 / 0.00 |
| Nobody has it | tactical (hold + kite + protect) | the plan | 5.9 · 39% · 61% · 77% | 29% / 27% / 21% / 23% | 41% / 23% / 35% / 39% | 0.00 / 0.00 |
| Nobody has it | tactical (hold + kite + protect) | the back line | 7.1 · 48% · 82% · 73% | 23% / 22% / 27% / 28% | 30% / 22% / 64% / 73% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | holds the line | the plan | 5.5 · 33% · 56% · 86% | 29% / 24% / 23% / 23% | 31% / 18% / 33% / 26% | 0.10 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | holds the line | the back line | 6.7 · 49% · 81% · 71% | 23% / 22% / 27% / 27% | 32% / 24% / 69% / 66% | 0.24 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | kites | the plan | 5.9 · 51% · 73% · 68% | 29% / 28% / 21% / 23% | 55% / 36% / 44% / 50% | 0.00 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | kites | the back line | 7.0 · 54% · 88% · 66% | 23% / 24% / 26% / 27% | 37% / 31% / 68% / 76% | 0.01 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | tactical (hold + kite + protect) | the plan | 6.0 · 44% · 65% · 72% | 30% / 26% / 21% / 23% | 49% / 28% / 39% / 42% | 0.13 / 0.00 |
| Only the Paladins have it (a class Reaction); the enemies don't | tactical (hold + kite + protect) | the back line | 7.2 · 52% · 85% · 68% | 24% / 23% / 26% / 27% | 36% / 26% / 68% / 75% | 0.32 / 0.00 |

(6.6 minutes.)
