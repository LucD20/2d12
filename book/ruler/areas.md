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
| 4 Standards | open | 4.0 · 11% · 21% · 99% | 4.0 · 16% · 26% · 98% | 3.8 · 13% · 20% · 99% |
| 4 Standards | closequarters | (a map is always the grid) | 3.9 · 18% · 31% · 98% | 4.0 · 19% · 32% · 97% |
| 4 Standards | corridor | (a map is always the grid) | 4.1 · 17% · 32% · 97% | 3.8 · 13% · 20% · 100% |
| 4 Standards | longsight | (a map is always the grid) | 3.8 · 17% · 27% · 98% | 3.6 · 10% · 16% · 100% |
| 4 Standards | pillars | (a map is always the grid) | 4.0 · 15% · 25% · 99% | 3.8 · 11% · 18% · 99% |
| 4 Standards | rough | (a map is always the grid) | 3.9 · 16% · 28% · 99% | 3.7 · 10% · 15% · 100% |
| 6 Standards | open | 5.9 · 47% · 70% · 71% | 5.9 · 46% · 75% · 75% | 5.8 · 41% · 68% · 80% |
| 6 Standards | closequarters | (a map is always the grid) | 5.5 · 61% · 80% · 54% | 5.5 · 61% · 80% · 54% |
| 6 Standards | corridor | (a map is always the grid) | 5.8 · 53% · 78% · 65% | 5.8 · 47% · 71% · 73% |
| 6 Standards | longsight | (a map is always the grid) | 5.6 · 46% · 70% · 70% | 5.5 · 32% · 57% · 88% |
| 6 Standards | pillars | (a map is always the grid) | 5.5 · 52% · 73% · 65% | 5.5 · 44% · 69% · 73% |
| 6 Standards | rough | (a map is always the grid) | 5.6 · 45% · 73% · 75% | 5.7 · 35% · 62% · 84% |

## 2. What each Area did (a use)

Enemies in it when it is placed · for a Zone: enemy Strikes that took its Bane, turns an ally healed in it, enemy Strikes against an ally it defended (all over its rounds).

**4 Standards**

| Card | open | closequarters | corridor | longsight | pillars | rough |
|---|---|---|---|---|---|---|
| Consecrated Ground 2 | 2.2 · 5.2 · 2.2 · 0.0 | 2.6 · 6.7 · 3.1 · 0.0 | 2.6 · 6.3 · 2.8 · 0.0 | 2.2 · 6.2 · 2.9 · 0.0 | 2.5 · 6.5 · 3.0 · 0.0 | 2.3 · 4.7 · 2.8 · 0.0 |
| Covering Fire | 2.2 · 2.8 · 0.0 · 5.9 | 1.8 · 6.0 · 0.0 · 10.4 | 1.7 · 5.9 · 0.0 · 9.7 | 1.0 · 5.2 · 0.0 · 8.1 | 1.5 · 5.9 · 0.0 · 10.2 | 1.9 · 8.4 · 0.0 · 11.1 |
| Word of Radiance 3 | 2.6 | 3.1 | 2.9 | 3.1 | 2.8 | 2.9 |
| Volley | 2.0 | 2.2 | 2.2 | 1.8 | 2.3 | 2.5 |
| Rain of Arrows | 1.6 | 1.5 | 1.5 | 1.4 | 1.6 | 1.5 |
| Final Verdict | 1.2 | 1.4 | 1.4 | 1.4 | 1.3 | 1.3 |
| Hallowed Dawn | - | - | - | - | - | - |

**6 Standards**

| Card | open | closequarters | corridor | longsight | pillars | rough |
|---|---|---|---|---|---|---|
| Consecrated Ground 2 | 2.6 · 9.3 · 3.3 · 0.0 | 3.5 · 10.5 · 4.3 · 0.0 | 3.5 · 10.5 · 4.2 · 0.0 | 3.1 · 12.2 · 5.1 · 0.0 | 3.0 · 11.2 · 4.6 · 0.0 | 2.9 · 10.3 · 4.6 · 0.0 |
| Covering Fire | 2.5 · 4.3 · 0.0 · 11.1 | 2.5 · 11.0 · 0.0 · 22.7 | 2.2 · 10.1 · 0.0 · 21.8 | 1.2 · 11.1 · 0.0 · 19.1 | 2.2 · 9.7 · 0.0 · 21.6 | 2.6 · 11.3 · 0.0 · 20.2 |
| Word of Radiance 3 | 4.1 | 4.4 | 4.1 | 5.0 | 4.6 | 4.6 |
| Volley | 2.8 | 3.5 | 3.3 | 2.6 | 3.3 | 3.3 |
| Rain of Arrows | 3.3 | 3.2 | 3.4 | 3.3 | 3.3 | 3.2 |
| Final Verdict | 1.8 | 2.3 | 2.3 | 2.3 | 2.3 | 2.2 |
| Hallowed Dawn | - | - | - | - | - | - |


A Zone's cell: enemies in it · Strikes with its Bane · heals · Strikes defended. Hallowed Dawn's Area is for allies (its heals are counted as heals, not here).

## 3. Not on the grid yet

Covering Fire's damage to enemies that enter it and Rain of Arrows' Hazardous Terrain (their cards' text has them; their ruler lines don't), a Line, an Area that hits allies on purpose, enemies walking around a Zone, Light.
