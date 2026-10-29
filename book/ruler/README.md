# The ruler (for the class and Bestiary numbers)

## The spec-driven ruler (2026-10-29): `spec.mjs`

Describe a class build in a plain file (`classes/*.txt`: its numbers, Actions with AP, Frequency, traits and Tier results, passives,
the turns it can take and its plan by round) and the fights in `fights.txt`; one script writes the whole table to **`report.md`**:

- each turn's damage against Defense 12 to 14 (Monte Carlo, at the Escalation the turn needs, and at Escalation 3), the best turn,
  and the turn's AP and Strikes, with the rules checked: at most 5 AP and 3 Strikes, At-will Banes, Round / Turn / Encounter Frequency,
  the Escalation an Action needs, a Reload Shot only with a Reload weapon, and nothing with an unloaded weapon but a Reload;
- the build's Health (the book's thresholds and level factor), AD, WD, Rally Points and what each heals;
- **duels** against one Medium NPC of each role (the Bestiary at the build's level): its damage a turn to this PC, **rounds to kill it**
  and **rounds for it to put this PC Down**;
- a **Monte Carlo fight** of the party against each encounter of `fights.txt` (2,000 runs): rounds, the party's win rate, Health lost,
  how often a PC goes Down and in which round, each PC's chance to go Down;
- **adventuring days** (`day` and `day-party` in fights.txt): 3 to 4 fights with no Rest, Health and Rally Points carried over; per PC: damage,
  damage a turn, Health, damage taken and reduced, Downs, Rally Points used and left, healing given, the damage its Defense bonuses stopped and its
  Vulnerable added, and every debuff it applied.

```
node book/ruler/spec.mjs            # writes report.md and prints it (about 10 seconds)
node book/ruler/spec.mjs --quiet    # writes report.md only
node book/ruler/spec.mjs --check    # the simulation against the exact dice math (calc.mjs); must print only "ok"
```

It uses the system's own code: the dice (`calc.mjs` tierProbs: exploding d12s, Doubles, Boons and Banes as 1d3-1, Favored) and the
Bestiary (`config.mjs` npcHm, npcDamage, the roles and ratings). Random numbers are seeded, so the same files give the same report.

### The spec files

One thing per line; `#` starts a comment. A class file (`classes/paladin-1.txt` is the full example):

| Line | Example | Meaning |
|---|---|---|
| `class`, `role`, `level` | `class Paladin` · `level 1` | Its name (the party in fights.txt uses it, with the level) |
| `attributes` | `attributes body 2, mind 1, instinct 0, appeal 0` | |
| `health` | `health body x4 +3, mind x3 +4` | Multiplier and species bonus: ⌈((Attribute + 2) × mult + species) × (level + 10) / 10⌉ |
| `armor`, `ward` | `armor 3` | AD = 11 + armor; WD = 11 + Power Modifier + ward |
| `weapon-mod`, `power-mod`, `rally` | `rally 6` | Modifiers; the class's Rally value (Rally Points = rally + ⌈(Body + Mind + level) / 2⌉) |
| `targeted` | `targeted 1.5` | How often NPCs choose this PC (1 = as often as anyone; a tank in front more, an archer behind less) |
| `weapon` | `weapon Crossbow (ranged, projectile, reload): 0 / 1d4+2 / 1d10+2` | Its properties in brackets, then Tier 1 / 2 / 3. A [Weapon] Action takes Ranged or Melee from it, and Shot when it is Projectile |
| `action` | see below | One Version of an Action (write Versions as `Smite 2`, `Smite 3`: they share Frequency) |
| `passive` | `passive Marked Quarry: boon 1 shot strike quarry` · `passive Killer's Focus: escalation 2: extra 1d6 first shot strike weapon` | Always on (from an Escalation) |
| `turn` | `turn Main: Smite 2, Weapon Attack, Weapon Attack, move 1` | A turn: Actions in order; `move N` spends AP; `(reload shot)` after a Weapon Action makes it a Reload Shot |
| `plan` | `plan Opening, Main` | The turn of round 1, round 2...; the last one repeats |
| `when` | `when ally below 50%: Heal` · `when self below 35%: Steel` · `when unloaded: Reload turn` | A turn that replaces the plan's |

An `action` line is fields separated by `|`: the name, then any of
`ap N` · a Frequency (`at-will`, `turn`, `round`, `encounter`, `daily`) · `traits a b c` · `vs ad` / `vs wd` / `vs save instinct` / `vs dc 13` ·
`tiers T1 / T2 / T3` (damage as the book writes it: `[B] 1[W] + [Mod] + [M] 2d6 Ho`; pools and damage types are read and ignored) ·
`escalation N` · `area N` (how many creatures it hits) · `does Weapon Attack x2` (Linked Actions) with `each boon 1` / `each extra 1d6` and
`different` (each against a different creature) · `then Smite Light` (a Linked Action after its roll) · effects.

Effects: `on 2+: ...`, `on 3: ...`, `on 1: ...` or `always: ...`, several separated by `;`:
`boon N next <traits>` · `bane N next ...` · `empowered N next ...` / `empowered N turn` (every Action of the turn) · `favored next ...` ·
`extra 1d8 next @Smite` (`@Name`: only that Action) · `vulnerable N` · `taunt N` (Banes on the target's attacks against others) ·
`heal N` (the most hurt ally uses N of its Rally Points; `heal N self`: you do) · `debuff Prone` (counted in the day report only) · `defense N ally` / `defense N allies` / `defense N self` (until your next turn) · `reload` ·
`reduce N` (a passive: each NPC hit deals N less). The traits after `next` must all be on the Action (the book's [Shot, Strike] rule);
`quarry` limits it to your Marked Quarry.

The fight (`fights.txt`): `level`, `runs`, `defenses`, `party Paladin, Paladin, Archer, Archer`, and `encounter <name>: 4 standard` or
`1 elite, 2 standard high` (a rating after the role, Medium by default). Days: `day-runs 1000`, `day <name>: <fight> | <fight> | ...` and
`day-party <name>: paladin-1, archer-1, ...` (class file names; the NPCs use the party's level). NPCs are the Bestiary's at that level with Foundry's default
ratings (Body High, the rest Medium): a Standard has 57 Health, Defense 13, Modifier +2. What the fight leaves out: movement and
positions, Reactions, Rally Points used by the PCs themselves, NPC special Actions, Body and Mind as two pools.

### Results (2026-10-29, level 1 unless said; the full tables: `report.md`)

- **The spec matches the hand-written ruler** where the rules are the same: Paladin L1 Smite 2 + two Weapon Attacks 22.4 at Defense 13
  (ruler.mjs 22.5); Paladin L2 Sacred Weapon turn 27.3 (levels.mjs 27.4). `--check` agrees with the exact math within 0.02.
- **Archer and [Shot]** (fixed 2026-10-29): a Weapon Action with a Projectile weapon is a Shot (the book, Traits: Shot; Foundry does the same),
  so Double Shot's Linked Weapon Attacks, the Weapon Attack and Lock & Loose (now also written with Shot on its card) all get Marked Quarry's Boon,
  and the first of them each round gets Killer's Focus. The first spec run had missed that rule (22.9 for the main turn). The L1 Archer's main
  turn is **24.8** at Defense 13, the same as the old ruler; 27.6 at Escalation 3. **Marked Quarry is worth 6 to 8% of every Archer turn.**
- **Smite 3 is worth more than the old ruler counted:** its Bright light makes enemies in it (the target too) roll an Appeal Save
  (1d6 / 1d4 / 0): +2.3 on the target alone, so Smite 3 + two Weapon Attacks is 24.7 against Smite 2's 22.4 (ruler.mjs had them equal).
- **Best turns:** Paladin L1 Divine Surge + Smite 3 + two Weapon Attacks 29.2 from Escalation 1; Paladin L2 Sacred Weapon + Divine Surge + Smite 2
  + two Weapon Attacks 32.8;
  Archer L1 Double Shot 3 + Twin Shot + Lock & Loose 39.0 from Escalation 2 (Twin Shot counted as two attacks: a high estimate); L2 with Wing Clip 41.5
  (Double Shot 3 + Wing Clip + Lock & Loose: 27.0 at Escalation 0).
  A Reload Shot as the last attack is worth +2.9 (27.7 against 24.8), but the next turn pays 1 AP and a roll for the Reload (15.6 that turn): not worth it on a plan.
- **Duels** (Defense 13 Standard, 57 Health): one PC kills it in about 3 rounds; it puts an Archer Down in about 4 rounds and the Paladin
  in about 8 (AD 14 and Hallowed Stance). An Elite (120 Health) takes about 5 rounds and puts either Down in 2 to 3. NPC damage a turn
  against an AD 13 PC: Minion 2.0, Grunt 4.9, Standard 7.7, Elite 16.8 (the book's targets: 3 to 4, 5, 7 to 8, 15).
- **Party fights** (2 Paladins + 2 Archers, CV 4): 3 rounds, 29 to 38% of the party's Health lost, a PC Down in 1 to 16%
  of the fights (2 Elites the most: 16%). The book's target is about 3 rounds and 40%: the length is on target, the Health lost is a little low
  (the sim ignores NPC special Actions, which are part of what makes a fight cost 40%). CV 6 (6 Standards): 4 to 5 rounds, 47%, a PC Down in 26%.

### Adventuring days: Archer and Paladin compared (2026-10-29)

`fights.txt` has three days of 3 to 4 fights with no Rest (the Bestiary's CV: 1 per PC normal, 3/4 easy, 1 1/2 hard), run 1,000 times for
three parties of 2 Paladins + 2 Archers (level 1; level 2; level 2 with one Paladin taking Shield of Faith instead of Sacred Weapon). Health and
Rally Points carry over; Encounter Actions and Escalation start again each fight; Rally Points are used in a fight (Steel Yourself, when below
35% Health; the Paladin's Lay On Hands on an ally below 50%) and between fights. Per PC, over the Standard day (easy, normal, normal, hard):

| Per PC, Standard day | Paladin L1 | Archer L1 | Paladin L2 | Archer L2 |
|---|---:|---:|---:|---:|
| Damage a turn in real fights | 27.1 | 24.6 | 27.7 | 26.2 |
| Share of the party's damage | 26% | 24% | 26% | 24% |
| Health Pool / Rally Points | 36 / 8 | 27 / 7 | 39 / 9 | 29 / 7 |
| Damage taken (the day) | 79 (+6 reduced) | 50 | 95 (+7 reduced) | 60 |
| Times Down a day | 0.44 | 0.46 | 0.60 | 0.67 |
| Healed allies (Lay On Hands) | 25 | 0 | 29 | 0 |
| Vulnerable 2 given: extra party damage | 0 | 3.7 | 0 | 4.0 |
| Debuffs a day | Prone 1 | Hindered 3, Immobilized 2, Bane on a Save 3, Vulnerable 1.6 | Prone 1 | Hindered 3.7, Immobilized 1.2, Bane on a Save 3, Vulnerable 1.6 |

- **DPS: the Archer doesn't out-damage the Paladin.** In real fights (openings, heals and Steel Yourself turns included) the L1 Archer deals 9%
  less than the L1 Paladin a turn, and the same at L2 (Wing Clip). Each class is a quarter of the party's damage. For a ranged-damage class, that is the main D1 question.
- **Health:** the Paladin has 33% more Health and takes 1.6 times the damage (NPCs choose it 1.5 times as often: an assumption), and both go
  Down equally often (0.4 to 0.9 a day). Hallowed Stance takes 6 to 13 damage off a day (the sim gives it only to the Paladin itself, not to adjacent allies).
- **Buffs:** Lay On Hands brings back 25 to 39 Health a day, but from the allies' own Rally Points: it is action economy (a Down ally back up, a
  heal mid-fight), not new Health. **Shield of Faith 1 AP stops only 1 to 2 damage a day** while it costs the support Paladin about 2 damage a turn
  (26.5 against 27.8 with Sacred Weapon): as written it is a weak pick. Sacred Weapon is the Paladin's real buff (+5 damage a turn, on itself).
- **Debuffs:** the Archer's control is where its value is: about 5 Hindered or Immobilized and 3 "Bane on the next Save" a day (none of them
  measured in damage: the fight has no movement or Saves by the PCs), and Vulnerable 2 (Marksman's Shot, Tier 3) worth only about 4 damage a day (it ends with the target's turn).
- **The day:** normal fights cost 20 to 35% of the party's Health each; Rally Points run out after about 4 fights (7 to 26% left). A hard fight at the end of the day (2 Elites + 2 Standards)
  is lost in 27% (L1) to 45% (L2) of the days; alone, 6 Standards are lost 4% of the time. **Level 2 is harder than level 1** against the Bestiary's
  level 2 NPCs (Standard day cleared 55% against 73%): the Bestiary grows NPC Health by the best turn's growth (+14%), but in real fights the PCs' damage a turn grows 2 to 6%.

## The level 1 PC ruler (2026-10-24, the hand-written scripts)

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
- `spec.mjs` with `classes/*.txt` and `fights.txt`: the spec-driven ruler (top of this file); it writes `report.md`.

They import the system's dice math (`foundry/twod12/module/calc.mjs`) by a relative path: run them from anywhere with `node book/ruler/<name>.mjs` or `python3 book/ruler/<name>.py`.
- `ruler.mjs`: the PC ruler above (a level 1 PC's damage a turn against AD 12 to 14).
- `ratings.py`: writes the Bestiary's rating tables (levels as rows, ratings as columns); levels 2 and 3 scale NPC Health by the PCs' damage growth and NPC damage by the PCs' Health factor (a draft: `book/draft-bestiary-levels.md`).
- `levels.mjs`: the PC ruler by level (above).
- `defense.mjs`: what a Defense value costs the PCs, and NPC offence against the PC Defense range.
- `tablecheck.mjs`: the Basic attack tables against the "deals about" targets.
- `roles.mjs`, `npcdmg.mjs`, `bigger.mjs`, `fight.py`: the earlier role, NPC damage and fight checks.
