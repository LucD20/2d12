# Areas and Zones on the grid (SIM-2)

Written by `node book/ruler/sim/areas.mjs`; don't edit, run it again.

Runs: 400 fights a cell. **The party** is fights.txt's with two builds changed to use the Area cards: the Smite Paladin opens with Consecrated Ground (2 AP), then Word of Radiance (3 AP); the Double Shot Archer with Covering Fire, then Volley, then Rain of Arrows (Dailies allowed). Final Verdict and Hallowed Dawn are the Paladins' own Escalation 3 turns. **On the grid** an Area is placed where it holds the most of the creatures it is for (a damaging Area never where an ally stands; one that lasts counts allies too) and hits who stands in it, with Line of Effect from its Point of Origin; a Zone stays on its squares for its rounds. **By count** (the ruler until now, and report.md's open field): the number of creatures the card's ruler line says.

| Card | Its Area (the card) | The ruler line's number |
|---|---|---|
| Consecrated Ground 2 | 2 Emanation, within 10 squares; all creatures; 3 rounds | 2 enemies, 2 allies |
| Covering Fire | 2 Emanation, within your weapon's normal range; all creatures; 3 rounds | 2 enemies, 2 allies |
| Word of Radiance 3 | 3 Burst, within 10 squares; enemies | 2.3 enemies |
| Volley | 2 Emanation, within your weapon's normal range; all creatures | 2 enemies |
| Rain of Arrows | 3 Emanation, within its maximum range; enemies | 2.5 enemies |
| Final Verdict | 1 Emanation, around you; enemies | 1.5 enemies |
| Hallowed Dawn | 2 Emanation, around you; all creatures | 3 allies |

## 1. The fights: by count against on the grid

Each cell: rounds · the party's Health lost · a PC goes Down · the party wins.

| Encounter | Map | By count | On the grid | On the grid, the party holding the line |
|---|---|---|---|---|
| 4 Standards | open | 3.9 · 13% · 20% · 98% | 3.9 · 16% · 28% · 100% | 3.7 · 13% · 21% · 100% |
| 4 Standards | closequarters | (a map is always the grid) | 3.8 · 17% · 30% · 99% | 3.8 · 17% · 30% · 99% |
| 4 Standards | corridor | (a map is always the grid) | 3.9 · 18% · 33% · 98% | 3.6 · 12% · 18% · 100% |
| 4 Standards | longsight | (a map is always the grid) | 3.8 · 20% · 34% · 97% | 3.5 · 9% · 14% · 100% |
| 4 Standards | pillars | (a map is always the grid) | 3.9 · 17% · 27% · 99% | 3.6 · 10% · 17% · 100% |
| 4 Standards | rough | (a map is always the grid) | 3.8 · 17% · 28% · 99% | 3.5 · 10% · 13% · 100% |
| 6 Standards | open | 5.7 · 46% · 66% · 71% | 5.5 · 48% · 68% · 70% | 5.6 · 38% · 65% · 83% |
| 6 Standards | closequarters | (a map is always the grid) | 5.3 · 56% · 76% · 60% | 5.3 · 56% · 76% · 60% |
| 6 Standards | corridor | (a map is always the grid) | 5.8 · 53% · 77% · 67% | 5.6 · 44% · 72% · 76% |
| 6 Standards | longsight | (a map is always the grid) | 5.3 · 47% · 70% · 72% | 5.2 · 32% · 55% · 88% |
| 6 Standards | pillars | (a map is always the grid) | 5.5 · 51% · 70% · 64% | 5.2 · 42% · 60% · 75% |
| 6 Standards | rough | (a map is always the grid) | 5.3 · 42% · 67% · 77% | 5.4 · 32% · 57% · 88% |

## 2. What each Area did (a use)

Enemies in it when it is placed · for a Zone: enemy Strikes that took its Bane, turns an ally healed in it, enemy Strikes against an ally it defended (all over its rounds).

**4 Standards**

| Card | open | closequarters | corridor | longsight | pillars | rough |
|---|---|---|---|---|---|---|
| Consecrated Ground 2 | 2.2 · 6.0 · 2.1 · 0.0 | 2.7 · 6.6 · 2.9 · 0.0 | 2.7 · 6.2 · 2.9 · 0.0 | 2.2 · 5.8 · 3.0 · 0.0 | 2.5 · 6.7 · 3.0 · 0.0 | 2.4 · 5.3 · 2.7 · 0.0 |
| Covering Fire | 2.1 · 2.5 · 0.0 · 6.1 | 1.9 · 6.0 · 0.0 · 10.2 | 1.8 · 6.1 · 0.0 · 10.0 | 0.7 · 4.7 · 0.0 · 6.9 | 1.7 · 5.3 · 0.0 · 10.5 | 2.2 · 7.2 · 0.0 · 10.3 |
| Word of Radiance 3 | 2.6 | 3.0 | 2.7 | 3.1 | 2.9 | 3.0 |
| Volley | 1.7 | 2.2 | 2.2 | 1.6 | 2.4 | 2.5 |
| Rain of Arrows | 1.5 | 1.4 | 1.5 | 1.5 | 1.4 | 1.5 |
| Final Verdict | 1.2 | 1.4 | 1.4 | 1.4 | 1.3 | 1.3 |
| Hallowed Dawn | - | - | - | - | - | - |

**6 Standards**

| Card | open | closequarters | corridor | longsight | pillars | rough |
|---|---|---|---|---|---|---|
| Consecrated Ground 2 | 2.6 · 8.5 · 3.1 · 0.0 | 3.5 · 9.9 · 4.1 · 0.0 | 3.2 · 10.6 · 4.2 · 0.0 | 3.2 · 12.1 · 4.8 · 0.0 | 3.1 · 11.2 · 4.4 · 0.0 | 2.9 · 11.3 · 4.5 · 0.0 |
| Covering Fire | 2.6 · 3.8 · 0.0 · 10.2 | 2.2 · 10.8 · 0.0 · 18.9 | 2.4 · 10.7 · 0.0 · 21.5 | 1.3 · 10.5 · 0.0 · 19.1 | 2.0 · 9.6 · 0.0 · 22.9 | 2.5 · 12.0 · 0.0 · 19.0 |
| Word of Radiance 3 | 3.8 | 4.4 | 4.3 | 5.0 | 4.6 | 4.7 |
| Volley | 2.8 | 3.3 | 3.5 | 2.3 | 3.4 | 3.2 |
| Rain of Arrows | 3.0 | 3.2 | 3.0 | 3.0 | 3.3 | 3.2 |
| Final Verdict | 1.8 | 2.4 | 2.3 | 2.3 | 2.2 | 2.3 |
| Hallowed Dawn | - | - | - | - | - | - |


A Zone's cell: enemies in it · Strikes with its Bane · heals · Strikes defended. Hallowed Dawn's Area is for allies (its heals are counted as heals, not here).

## 3. Not on the grid yet

Covering Fire's damage to enemies that enter it and Rain of Arrows' Hazardous Terrain (their cards' text has them; their ruler lines don't), a Line, an Area that hits allies on purpose, enemies walking around a Zone, Light.
