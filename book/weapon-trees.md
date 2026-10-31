# Weapon Trees (design, from 2026-10-31; nothing in rules-src yet)

Lucas's decisions so far (gear-d2.md section 10): **Group Mastery = the Mastery gained with all weapons of the group / 3** (rounded down); a
weapon you start using begins at your Group Mastery, and what you gain with it adds on top (its starting value doesn't count in the group
total). **Stage 1 Basic, Stage 2 Advanced, Stage 3 Exotic weapons.** Pace: about 5 combats a level, 0.9 Mastery a combat (the cap: 1 per
group per encounter), so **Group Mastery is about 6 at level 5 and 11 at level 8**, whatever bows you used.

## The rules every tree uses (draft)

| | Basic | Advanced | Exotic |
|---|---|---|---|
| Opens at | Group Mastery 0 | Group Mastery 6 (about level 5) | Group Mastery 11 (about level 8) |
| Below it | | 2 Banes on [Strike] Actions with it | 2 Banes |
| A Weapon Attack (DE, Modifier +2, Defense 13) | about 4.5 | about 5.0 (+10%) | about 5.4 (+20%) |
| Its own unlocks | many, from 3, going on into Stages 2 and 3 | fewer, from its starting Mastery (6) up | fewest, from 11 up |

- **Deeper is not stronger over a weapon's life:** the Basic weapon's later unlocks pay for its smaller dice. Staying on it is a real choice.
- **Master** (one more [W] from level 8) becomes "level 8 and Group Mastery 11": every bow of the group has it then.
- **Unlocks are mostly utility** (Lucas, answer 2): different for each weapon, from what the real weapon was good at.

## The Bow tree (proposal)

```
                Shortbow (Basic)
               /                \
   Recurve Bow (Advanced)    Longbow (Advanced)
          |                        |
   Flight Bow (Exotic)       Warbow (Exotic)
```

Two lines from one root: **the skirmisher's** (Recurve, Flight: moving, speed, reach) and **the line archer's** (Longbow, Warbow: range,
weight of the arrow). The lines are flavor: a gate is only Group Mastery, so a Recurve user can pick up a Warbow at 11.

| Weapon | Stage | The real weapon (short research) | Its identity in the game |
|---|---|---|---|
| **Shortbow** | Basic | A short wooden self bow (one piece of wood), light draw; quick to nock and shoot, easy in brush, in tight places and on horseback. Effective out to about 50 to 100 m. | Handy and quick: utility in close and cramped fights |
| **Recurve Bow** | Advanced | The tips curve away from the archer, so a short bow stores more energy; composite (wood, horn, sinew) bows of the steppe peoples (Scythians, Huns, Mongols, Turks): shot from horseback at speed. | Shooting on the move |
| **Longbow** | Advanced | The English and Welsh yew longbow, as tall as the archer; heavy draws (the Mary Rose bows: about 100 to 180 lb); massed volleys at long range. | Range and steady volleys |
| **Flight Bow** | Exotic | Turkish flight bows, made only for distance: very light arrows and an overdraw guide (siper); records over 800 m (Sultan Selim III, 1798). Light hits. | Extreme range, precision over power |
| **Warbow** | Exotic | The heaviest war longbows; heavy bodkin and broadhead arrows; years of training to draw (archers' skeletons show it). | The heaviest arrow: big hits, slow |

## 1. Shortbow (Basic): the baseline, for Lucas's review

| Group | Properties | Type | Range | Damage | Weapon Attack |
|---|---|---|---|---|---:|
| Bows | Projectile, Ranged, Two-handed | Pierce | 8 / 16 / 32 | [B] 0 / 1d6 / 1d10 | 4.51 DE |

**Its unlocks (Shortbow Mastery; about 0.9 a combat):**

| Mastery | About | Unlock | Kind | Worth |
|---:|---|---|---|---|
| 3 | session 2-3 (level 1) | **Skirmish Shot** (its Weapon Technique: D2's card, Tier 3: Evade 1) | Technique | +1.1 DE once a round |
| 8 | level 2 | **Quick Nock:** once each turn, you draw or stow it without the Interact Action (D2's Expert, as the Shortbow's own) | utility | 1 AP when you switch weapons |
| 14 | level 3-4 | **Close Quarters:** while you are Engaged, [Ranged] Actions with it take 1 Bane for it instead of 2 | utility | +0.44 DE a Shot while Engaged (3.61 → 4.05); about +2% of a turn |
| 20 | Stage 2 (level 5-6) | **Skirmisher:** Skirmish Shot's Evade 1 works on a Tier 2 too | Technique step | about +2% of a turn |
| 28 | Stage 3 (level 8) | **Hunter's Bow:** to be decided with the rest of the tree (a utility that keeps the Shortbow worth holding next to the Exotic bows) | utility | |

**Why these:** each is what a short bow did well (quick, close, handy) and none adds dice. Against an Advanced bow at level 5 (+10% on
every Weapon Attack, but its own unlocks start at 6), the Shortbow at 18-20 has its Technique, Quick Nock, Close Quarters and Skirmisher:
about even in damage, better when the fight is close.

**Questions on the Shortbow (answer what you want; the rest stays):**
1. The baseline damage 1d6 / 1d10 (as D2) and Range 8 / 16 / 32?
2. The unlock steps 3, 8, 14, 20, 28 (one about every level or two)?
3. Close Quarters as the Shortbow's thing (D2 gave the Engaged Bane to the Pistol's Point Blank: one of them should change)?

Next, once the Shortbow is settled: the Recurve Bow.
