# The level 1 PC ruler (for the NPC / Bestiary rules)

Computed by `book/ruler/ruler.mjs` with the system's own dice math (foundry/twod12/module/calc.mjs: exploding d12s, Doubles, boons and banes as 1d3-1),
from the book's numbers: Weapon Modifier 2 at level 1 (Attribute 2), Greatsword 0 / 1d8 / 2d6, Crossbow 0 / 1d4+2 / 1d10+2, Smite, Wing Clip,
Lock & Loose (Bow Mastery), Double Shot (its two attacks are not Strikes and take no At-will banes; Double Shot itself is one Strike), Precise Aim,
Marked Quarry (+1 boon), a Reload Shot (Favored, Empowered 2), at most 3 Strikes and 5 AP a turn, At-will banes on the 2nd and 3rd Weapon Attack.
Expected damage per turn against one creature (sustained: no Encounter or Daily Actions, no Escalation).

```
=== AD 12  (+2 vs 12: Tier 1/2/3 = 22% / 46% / 32%)
  Paladin   24.3  Smite 3 AP + Weapon Attack + Weapon Attack (1 bane)
  Paladin   24.3  Smite 2 AP + Weapon Attack + Weapon Attack (1 bane), 1 AP to move
  Paladin   16.0  Weapon Attack x3 (0, 1, 2 banes)
  Archer    28.5  Precise Aim + Double Shot + Wing Clip + Lock & Loose (quarry)
  Archer    33.4  same, the 2nd Double Shot attack a Reload Shot (Reload next turn)
  Archer    26.2  Double Shot + Wing Clip + Lock & Loose, no quarry, no aim

=== AD 13  (+2 vs 13: Tier 1/2/3 = 28% / 45% / 27%)
  Paladin   22.5  Smite 3 AP + Weapon Attack + Weapon Attack (1 bane)
  Paladin   22.5  Smite 2 AP + Weapon Attack + Weapon Attack (1 bane), 1 AP to move
  Paladin   14.5  Weapon Attack x3 (0, 1, 2 banes)
  Archer    26.6  Precise Aim + Double Shot + Wing Clip + Lock & Loose (quarry)
  Archer    31.5  same, the 2nd Double Shot attack a Reload Shot (Reload next turn)
  Archer    24.1  Double Shot + Wing Clip + Lock & Loose, no quarry, no aim

=== AD 14  (+2 vs 14: Tier 1/2/3 = 35% / 42% / 23%)
  Paladin   20.7  Smite 3 AP + Weapon Attack + Weapon Attack (1 bane)
  Paladin   20.7  Smite 2 AP + Weapon Attack + Weapon Attack (1 bane), 1 AP to move
  Paladin   12.9  Weapon Attack x3 (0, 1, 2 banes)
  Archer    24.5  Precise Aim + Double Shot + Wing Clip + Lock & Loose (quarry)
  Archer    29.4  same, the 2nd Double Shot attack a Reload Shot (Reload next turn)
  Archer    21.9  Double Shot + Wing Clip + Lock & Loose, no quarry, no aim

=== Health Pool at level 1
  Human Paladin (Body 2, Mind 1), Heavy armor AD 14: Body 19 + Mind 13 = 32
  Dwarf Paladin (Body 2, Mind 2), AD 14: Body 21 + Mind 15 = 36
  Human Archer (Body 1, Mind 1, Instinct 2), Medium armor AD 13: Body 12 + Mind 12 = 24
  Elf Archer (Body -1, Mind 2, Instinct 2), AD 13: Body 4 + Mind 15 = 19
```

Notes:
- Smite 2 AP and 3 AP deal the same damage (3 AP adds its area Save, not counted here): the Paladin's efficient turn is Smite 2 AP + two Weapon Attacks + 1 AP to move.
- A Reload Shot needs a Reload (1 AP, a roll vs DC 13) before the next shot: over two turns the Archer averages about 28 at AD 13.
- Each point of the target's AD costs about 2 damage a turn (about 8%).
- The Elf Archer's Body threshold is 4 (Body -1, x3, +1): one Tier 2 hit makes it Bloodied. Worth a look.

## By level (2026-10-24, `levels.mjs`)
With the level list of the Paladin and the Archer (L1: Class Actions and Core Features + 1 Encounter Pick; L2: + 1 Pick from any list; L3: + 1 Pick from any list + 1 Daily Pick),
a level adding the best Round Pick for damage. Best sustained damage a turn (Paladin / Archer / average):

```
AD 12: L1 24.3 / 26.6 / 25.4   L2 29.5 / 28.5 / 29.0   L3 the same as L2
AD 13: L1 22.5 / 24.8 / 23.7   L2 27.4 / 26.6 / 27.0   L3 the same as L2
AD 14: L1 20.7 / 23.0 / 21.8   L2 25.3 / 24.5 / 24.9   L3 the same as L2
Health Pool: Human Paladin 36 / 39 / 42, Dwarf Paladin 41 / 44 / 48, Human Archer 27 / 29 / 31, Elf Archer 22 / 23 / 26
```

- **Level 1:** the Paladin is unchanged (Smite 2 AP + two Weapon Attacks). The Archer has no Round Pick at level 1 any more (no Wing Clip): its best turn is Double Shot 3 AP + Lock & Loose + Weapon Attack, 24.8 at AD 13 (it was 26.6).
- **Level 2:** the first Round Pick: the Paladin's Sacred Weapon (Empowered 1 on every attack of the turn) beats Vow of Enmity (27.4 against 26.5 at AD 13); the Archer takes Wing Clip back. +14% on average.
- **Level 3:** no sustained gain: the turn already uses 5 AP and 3 Strikes, so a second Round Pick adds options, not damage (Vow of Enmity + Sacred Weapon costs a Weapon Attack: 25.7). Growth after level 2 has to come from Attributes, Mastery or damage, as planned.
- **Health:** the thresholds are multiplied by (Level / 10 + 1), ×1.1 at level 1. The "Health Pool at level 1" above leaves that factor out (it is about 10% low); the numbers here have it.

## What was applied from it (2026-10-24)
- **Bestiary, levels 1 to 3** (`ratings.py`: `BUMP`, `rel`, `dfac`, `hfac`): level 1 Basic attack damage is raised by half of the rating's bump (Terrible +2.5% ... Extreme +7.5%); from level 2 a **Medium** NPC grows exactly like the PCs (Health follows the PCs' damage, damage follows the PCs' Health), so its fight stays at 1.05 of the old level 1 design (a 5% margin for the PCs), and the other ratings differ from Medium by (1 + their bump) / (1 + 10%) a level (Terrible -4.5%, Low -2.3%, High +2.3%, Extreme +4.5% in how hard the fight is). Level 1 Health, Attributes and Defenses are as written. Fight difficulty at levels 1 / 2 / 3: Terrible 1.02 / 0.98 / 0.93, Low 1.04 / 1.01 / 0.99, Medium 1.05 / 1.05 / 1.05, High 1.06 / 1.09 / 1.11, Extreme 1.07 / 1.12 / 1.17.
- **Rally Points:** the class's Rally value (Paladin 6, Archer 5) + ceil((Body + Mind + level) / 2), each removing ceil(Pool / 4): 1.6 to 2.4 Health Pools a day at level 1, 1.9 to 2.5 at level 3, 2.2 to 2.8 at level 5 (six builds: Human, Dwarf and Elf of each class).

## The scripts in this folder
They import the system's dice math (`foundry/twod12/module/calc.mjs`) by a relative path: run them from anywhere with `node book/ruler/<name>.mjs` or `python3 book/ruler/<name>.py`.
- `ruler.mjs`: the PC ruler above (a level 1 PC's damage a turn against AD 12 to 14).
- `ratings.py`: writes the Bestiary's rating tables (levels as rows, ratings as columns); levels 2 and 3 scale NPC Health by the PCs' damage growth and NPC damage by the PCs' Health factor (a draft: `book/draft-bestiary-levels.md`).
- `levels.mjs`: the PC ruler by level (above).
- `defense.mjs`: what a Defense value costs the PCs, and NPC offence against the PC Defense range.
- `tablecheck.mjs`: the Basic attack tables against the "deals about" targets.
- `roles.mjs`, `npcdmg.mjs`, `bigger.mjs`, `fight.py`: the earlier role, NPC damage and fight checks.
