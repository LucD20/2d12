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

**The cards come from `book/cards/*.json` (pack CS, 2026-11-03):** a build gets one `action` line per Version of every card its turns, reactions and Linked Actions name, with the card's other Versions (`cardLines` in spec.mjs: every card of the book since CS-3), so a class file no longer writes them; a Passive is the build's choice, so the class file names it (`passive Hallowed Stance`, `passive Marked Quarry`) and the card's ruler string fills the line. A class file's own full `action` or `passive` line for the same name overrides the card's (the pre-A1 Archer builds archer-1..3, the old cards of catalogue/paladin.txt and archer.txt, paladin-book-1, the simplified Smite of catalogue/talents.txt). `[PMod]` in a card's ruler string is the build's `power-mod`. The format of a card and of its `ruler` string: `book/cards/README.md`.

One thing per line; `#` starts a comment. A class file (`classes/paladin-1.txt` is the full example):

| Line | Example | Meaning |
|---|---|---|
| `class`, `role`, `level` | `class Paladin` · `level 1` | Its name (the party in fights.txt uses it, with the level) |
| `attributes` | `attributes body 2, mind 1, instinct 0, appeal 0` | |
| `health` | `health body x4 +3, mind x3 +4` | Multiplier and species bonus: ⌈((Attribute + 2) × mult + species) × (level + 10) / 10⌉ (the book since E3: (Level + 17) / 16; the class files keep the old factor unless they say `health-factor`) |
| `armor`, `ward` | `armor 3` | AD = 11 + armor; WD = 11 + Power Modifier + ward |
| `weapon-mod`, `power-mod`, `rally` | `rally 6` | Modifiers; the class's Rally value (Rally Points = rally + ⌈(Body + Mind + level) / 2⌉) |
| `targeted` | `targeted 1.5` | How often NPCs choose this PC (1 = as often as anyone; a tank in front more, an archer behind less) |
| `weapon` | `weapon Crossbow (ranged, projectile, reload, range 10/20/40): 0 / 1d4+2 / 1d10+2` | Its properties in brackets, then Tier 1 / 2 / 3. A [Weapon] Action takes Ranged or Melee from it, and Shot when it is Projectile. `range` (the map model): normal / far / maximum; melee 1 and ranged 10/20/40 by default |
| `speed` | `speed 6` | The map model: species + class (Human 5; Archer +1) |
| `reaction` | `reaction Opportunity Attack: opportunity` · `reaction Quick Draw: quick-draw` | The map model: Reactions it makes with the AP it keeps after its turn |
| `action` | see below | One Version of an Action (write Versions as `Smite 2`, `Smite 3`: they share Frequency) |
| `passive` | `passive Marked Quarry: boon 1 shot strike quarry` · `passive Killer's Focus: escalation 2: extra 1d6 first shot strike weapon` | Always on (from an Escalation) |
| `turn` | `turn Main: Smite 2, Weapon Attack, Weapon Attack, move 1` | A turn: Actions in order; `move N` spends AP (the map model: only when it moves); `advance`, `evade 1`, `evade 2` (the Basic Actions: Speed, 1 square, half Speed); `(reload shot)` after a Weapon Action makes it a Reload Shot; `(keep 2)` after an Escalation Active spends it only if 2 are left after (holding for a passive) |
| `plan` | `plan Opening, Main` · `plan Nova, Consecrate \| Main, Main` | The turn of round 1, round 2...; the last one repeats. `A \| B`: A while its Encounter and Daily Actions are unused (a Daily only in a hard fight), else B |
| `when` | `when ally below 50%: Heal` · `when self below 35%: Steel` · `when unloaded: Reload turn` · `when engaged: Kite` | A turn that replaces the plan's (`engaged`: the map model, it starts its turn next to an enemy) |
| `health-factor` | `health-factor 1.65` | Progression models (pack LV): the level factor of Health instead of the book's (level + 10) / 10 |
| `damage-scale` | `damage-scale 1.4` | Pack LV: every damage it deals × this (growth that is on no card: model C's +10% a level) |
| `keep-best` | `keep-best 1 power` | Pack LV: its Actions with these traits roll N extra dice of the largest size rolled and drop the lowest N of that size |
| `overcast-floor` | `overcast-floor 1` | Pack LV: once a fight, an Action that costs Escalation costs up to N less (the round-1 floor) |

**Escalation fallback (pack LV):** when a turn names an Action whose Escalation you don't have, a lower Version of it that you can pay for is used
instead (`Bolt 3` → `Bolt 2`...; write Overcast as Versions with `escalation N`); with no such Version it is skipped, as before.

An `action` line is fields separated by `|`: the name, then any of
`ap N` · a Frequency (`at-will`, `turn`, `round`, `encounter`, `daily`) · `traits a b c` · `vs ad` / `vs wd` / `vs save instinct` / `vs dc 13` ·
`tiers T1 / T2 / T3` (damage as the book writes it: `[B] 1[W] + [Mod] + [M] 2d6 Ho`; pools and damage types are read and ignored) ·
`escalation N` · `favored` (its own roll is Favored) · `area N` (how many creatures it hits) · `allies N` and `rounds N` (how many allies a buff, heal or area reaches, and for how long) · `does Weapon Attack x2` (Linked Actions) with `each boon 1` / `each extra 1d6` and
`different` (each against a different creature) · `then Smite Light` (a Linked Action after its roll) · effects.

Effects: `on 2+: ...`, `on 3: ...`, `on 1: ...` or `always: ...`, several separated by `;`:
`boon N next <traits>` · `bane N next ...` · `empowered N next ...` / `empowered N turn` (every Action of the turn) · `favored next ...` ·
`extra 1d8 next @Smite` (`@Name`: only that Action) · `vulnerable N` · `taunt N` (Banes on the target's attacks against others) ·
`heal N` (the most hurt ally uses N of its Rally Points; `heal N self`: you do) · `debuff Prone` (counted in the day report only) · `defense N ally` / `defense N allies` / `defense N self` (until your next turn) · `reload` ·
`reduce N` (a passive: each NPC hit deals N less; `reduce 2 adjacent 1`: also for 1 adjacent ally, the one most often in front) ·
`mend 1d8 any` (new Health, not a Rally Point: `any` the most hurt of you and your allies, `ally`, `self`) · `surge 1d8` (the next ally who damages the target before your next turn deals that extra, credited to you) ·
`banes N strike power` with `area`/`rounds` (the enemies in the area take N Banes on their Strikes while it lasts) · `heal-dice 1d4` with `allies`/`rounds` (they heal it at the start of their turns) ·
`bonus N <traits>` (a passive: +N damage on matching Actions that deal damage) · `rally-bonus N` (a passive: you and your allies heal N more for each Rally Point; the best one in the party counts) ·
`block 1d6+[Mod]` (price list only: a ward Reaction that takes that much off one hit on an ally) ·
`debuff Hindered (EoT)` / `debuff Hindered (until it moves)` / `debuff Immobilized (EoT)` / `debuff Immobilized` (until it escapes) / `debuff Prone` / `debuff Slowed 1` (the map model puts them on the NPC) · `push N` / `pull N` / `slide N` (Forced Movement) · `evade N` (you Evade before the roll: Rolling Shot) ·
`cover` (your next Strike ignores Cover) · passives `steady-nerves` and `long-draw`. The traits after `next` must all be on the Action (the book's [Shot, Strike] rule);
`quarry` limits it to your Marked Quarry.

The fight (`fights.txt`): `level`, `runs`, `defenses`, `party Paladin, Paladin, Archer, Archer`, and `encounter <name>: 4 standard` or
`1 elite, 2 standard high` (a rating after the role, Medium by default; `ranged` for a ranged Basic attack, `speed-6` for another Speed). The map model's settings: `map on` / `map off`, `map start 8`, `map back 2`, `map cover 5% 2, 15% 1`, `map npc-reactions elite` (map.mjs `MAP`). Days: `day-runs 1000`, `day <name>: <fight> | <fight> | ...` and
`day-party <name>: paladin-smite-1, archer-1, ...` (class file names; the NPCs use the party's level). A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. `party` takes file names too. NPCs are the Bestiary's at that level with Foundry's default
ratings (Body High, the rest Medium): a Standard has 57 Health, Defense 13, Modifier +2. What the fight leaves out: Rally Points used by the PCs themselves, NPC special Actions, Body and Mind as two pools,
and (with `map on`) walls, Difficult Terrain, elevation and Large creatures; with `map off`, all positions and Reactions.

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

## The playtest 2 rework (pack R prep, 2026-11-04): `rework.mjs`

`node book/ruler/rework.mjs` (about 5 minutes; `--quick` about 2) writes **`rework.md`**; the prep document that reads it is **`book/rework-r.md`** (its numbers part; the decision sheet is its section 14, from `--sheet` below). It runs the spec ruler with the map model under the rework's rules (book/playtest-2.md) and today's, side by side:
the 4 AP builds of **`rework/*.txt`** (the P1 and A1 builds with their turns cut to 4 AP and a Reaction each; the files of `classes/` are untouched, so report.md doesn't move) against the Bestiary at level 1.

**New in spec.mjs (all opt-in; the defaults are the book today):**
- **`RULES`** (an exported object a script sets per run): `ap` (AP a PC regains a turn, 5), `reactionAp` (AP a PC may spend only on Reactions, kept on top of what its turn left, 0), `escalation` (`spent`: an Active costs its Escalation, the book; `level`: an Active needs its Escalation and spends nothing, a passive works from its level, `(keep N)` is ignored), `npcAp` / `minionAp` (an NPC's AP a turn, 5 / 3; its Strikes keep 1 AP for moving), `npcReactionAp` (an NPC's Reaction AP: an Elite's Opportunity Attack costs it first, then its next turn's AP).
- **`reaction Name: block 1d8+[Mod]`** in a class file: a Reaction that takes that much off one NPC hit on the PC or an ally within 5 squares, once per NPC turn, paid with a kept AP (Shield of Faith as a 1R Reaction). `opportunity` and `quick-draw` as before.
- **Body and Mind pools:** `parseDamage` keeps the `[M]` parts of an expression (`mindShare`); a ruler string's `extra` or `surge` can say `mind` (`extra 2d8 mind next strike`: the Paladin's Holy riders in book/cards/paladin.json say it). The fight records each creature's Mind damage, the round an NPC becomes Bloodied (Body damage at its Body threshold) or Strained and the round it dies, the round a PC becomes Bloodied (NPC Basic attacks are Body), each PC's turns by Escalation level (`st.escTurns`), its turns while Bloodied, its Reactions' damage and what its block Reaction took off (`st.blockCredit`).

**What it measures** (rework.md's sections): 1 each build's turns at 5 and 4 AP; 2 the CV 4 fights rule by rule (PCs 4 + 1, NPCs 4 + 1, Escalation as a level); 3 the NPC and PC Health factors for 3.5 rounds and a third of the party's Health, and the fights by CV at them; 4 Escalation as a level: the turns at each level with and without Momentum, what each Passive and Active is worth, the Archer's Actives as Round or Encounter; 5 the Reaction AP: none, Opportunity Attack + Quick Draw, Shield of Faith as a block; 6 Overcast as the caster's Passive ladder (LV's stand-ins at levels 1 / 5 / 8); 7 Bloodied and Strained: the thresholds and when NPCs and PCs reach them; 8 Slowed priced at 5 and 4 AP, Minions at 3 and 2 AP; 9 the Standard day; 10 the Special multipliers' arithmetic. **The findings: book/rework-r.md.**

**Part 2, the decision sheet's numbers (2026-11-04): `node book/ruler/rework.mjs --sheet`** (about 6 minutes; `--sheet --quick` about 2) writes **`rework-sheet.md`**; book/rework-r.md section 14 reads it. New `RULES` switches in spec.mjs (all off by default, so report.md and rework.md don't move): `npcSpecials` (0 = the Bestiary's Strikes; else the scale of the Special multipliers: an NPC with a `kit` spends every AP left after moving on its Encounter Special once, its Round Special once a round, then Basic attacks with the At-will Bane, 3 Strikes; rework.mjs's `KIT`: Minions and Grunts 1 AP × 1.4, Standards 2 AP × 2.2, Elites that and 3 AP × 3.5), `apGuard` (Guard per turn AP left unspent, until the start of the PC's next turn, adding to other Guard; `st.apGuardGiven`, `apGuardUsed`, `apLeft`), `apGuardKeep` (those AP may still pay a Reaction, losing their Guard), `escHooks` (+1 Escalation once an encounter on a Critical, about 1 Tier 3 in 12, and on the build's `escHook`: `ally` = an ally within 5 squares becomes Bloodied or goes Down, `quarry` = its Marked Quarry goes Down; used only when it raises the Escalation; `st.hookCrit`, `hookClass`). `reaction Name: block 1d8+[Mod] spill`: the part of the block the hit doesn't use becomes Guard on the target (Stacking: the higher value). rework.mjs gives the builds the Stage Health line (`LINE`, `SPECIES`: Human, high on Vigor; Rally = Rally + Stage) with `{ line: true }`, and `START` sets the Escalation a fight starts with (part 2: 1, Momentum 2 in half the fights). **What it measures:** 1 an NPC's turn with its Specials; 2 the CV 4 fights adding the Health line, Escalation from 1 with the hooks, Guard and the Specials one by one; 3 the Escalation timing and the hooks; 4 Guard from unspent AP (with turns that hold an AP); 5 the Bestiary factors (NPC Health h for 3.5 rounds, NPC damage d for a quarter, 30% and a third of the party's Health, and for a Down in 1 fight of 10) and the fights by CV at them; 6 Shield of Faith's size; 7 the two dice-cut shapes (ceilings on Encounter dice, × 0.75 on everything); 8 the Health line at levels 1 / 5 / 8 against today's Stage rows, and the heal and Guard cards against the pools; 9 the Archer's Reaction (Quick Draw with 1[W], 2[W], Empowered, a Boon; Overwatch); 10 Divine Surge and Vanish as Escalation 1 Passives. A Reaction is priced by what it did itself (its damage, its block, its Guard used, `st.spillUsed`), not by the party's total damage (capped by the NPCs' Health in a fight to the death). Also new: `RULES.oaDisrupt` (a Critical Opportunity Attack stops the movement; on by default, off in the sheet: Lucas 2026-11-04), `reaction Name: overwatch` (a Trigger after an enemy within 10 squares makes a Strike, once per NPC turn) and `reaction Name: quick-draw with Quick Shot (+1 boon)` (the Action a Reaction makes).

## Positions: the map model (pack E2, 2026-10-29): `map.mjs`, `positions.mjs`

**Talents are left out of the class files (Lucas, 2026-10-29):** classes are compared with classes; a Talent is priced on its own (catalogue/, and
positions.mjs adds Opportunity Attack to price it). So the level 2 Paladin files equal level 1 (its level 2 is only a Talent).

The fights of `spec.mjs` now happen on a grid (`map on` in fights.txt; `map off` gives the old fight, and the report shows both). **`map.mjs`** has the geometry and
the book's rules (Chapter 3): distances with every second diagonal 2, Engaged, [Ranged] 2 Banes while Engaged and 1 Bane into melee, Cover (a creature on the line
from center to center, and the map's own cover drawn per shot: 5% Medium, 15% Low), far and maximum range, Flanking for both sides, Prone, Hindered, Immobilized,
Slowed, Pushed / Pulled / Slid, Evade, Opportunity Attack and Quick Draw with the AP kept after a turn. **The fight** (`fight()` in spec.mjs):

- **Start:** the melee PCs on a line, the ranged PCs 2 squares behind and to the sides, the NPCs 8 squares away (ranged NPCs 3 more): a crossbow starts in normal range.
- **A melee PC** closes in before its Actions (a Charge when it can: 2 AP, 1 Boon on its first Weapon Attack); the AP it spends moving drop the turn's last Actions (a lower Version first, else a Weapon Attack).
- **A ranged PC** that starts its turn Engaged takes its `when engaged` turn (`turn Kite: advance, Double Shot 3, Lock & Loose`): it steps away from the enemies (an Evade 1 next to an NPC with an Opportunity Attack), staying in normal range of its target.
- **An NPC** stands up from Prone (1 AP), ends Immobilized with Interact (1 AP) when it must move, chooses the PC it can strike most after moving (and a hurt one a little more), moves and strikes. Its Bestiary Strikes keep 1 AP for moving: a Standard has 2 Strikes with 5 AP, so a second Advance costs half a Strike. NPC Opportunity Attacks: Elites only (`map npc-reactions`).
- Left out: walls and Line of Effect (an open field), Difficult Terrain, Collision, Large creatures, elevation. So Speed buys little (see below).

**`positions.mjs`** prices movement and conditions (about 13 minutes; it writes `positions.json`, which `econ.mjs` reads for prices.md section 5; run it again after
changing map.mjs, the fight, or `paladin-smite-1` / `archer-1`). Each price is a pair of fights with the same dice (each creature rolls its own dice stream, so a change
to one leaves the others' rolls alone), the change in one: the party of a Standard day against 4 Standards that don't die, 6,000 pairs, 2 rounds from the round the
condition is put on (rounds 1, 2 and 3 averaged). **Value = damage dealt more + damage taken less.**

### What positions found (level 1; the tables: prices.md section 5, report.md)

- **Positions cost the Archer a fifth of its damage.** Real sustained damage a turn: Archer 121% → **96%** of the baseline (its budget is 100-105%), the Smite Paladin
  87% → 81%. The Archer's shots carry **1.6 Banes from the map** on average: 72% of them go into melee (the target is Engaged with a Paladin: 1 Bane, 2.4 DE a round for the
  party), 53% have Cover, mostly a creature in the line (1.9 DE a round), and range costs 0.9. The 2 Banes for shooting while Engaged cost nothing, because the
  Archer steps away (47% of its turns start Engaged; stepping away is worth 1.5 DE a turn against standing and shooting).
- **Hard fights get much harder; normal ones don't.** A normal fight costs the same Health (4 Standards: 14%), but every fight lasts longer (3.0 → 3.4 rounds) and the
  NPCs focus the hurt PCs: the P1 Smite party's Standard day is cleared 79% of the time (95% without positions), Downs a day 0.8 → 2.3, and its hard fight (2 Elites +
  2 Standards) costs 60% of the party's Health (45%). Not Flanking (NPCs flank the Paladins: 2.2 DE a round for them, and taking it away changes the hard fight by 3%) nor
  Opportunity Attacks: the PCs' lower damage makes the fight a round longer. Pack E3 (the Bestiary refit) must use the map.
- **Conditions on one Standard** (DE; 1 AP = 4.66): Immobilized (EoT) **4.7** (an AP: a melee NPC that can't reach loses its Strikes), Slowed 2 3.6, Hindered (EoT) 1.5,
  Immobilized until it escapes 1.5, Slowed 1 1.4, Prone 1.2, Pulled 2 1.2 (3.2 while it closes in), Pushed 1 to 4 **0.8 to 1.1** (the NPC walks back with its spare AP: the
  distance hardly matters), Slid 2 1.0, Lock & Loose's Hindered until it moves 0.7, Vulnerable 1 (EoT) 0.6 (E1 assumed 1.23: fewer party attacks reach it than 2.5).
- **The Bestiary's condition steps, checked on the PCs** (one step on a Standard's 2 AP Special is about 2.1 DE): Prone and Slowed 1 are worth **about 3 steps**
  (the Bestiary: Moderate, 2), Slowed 2 **5.7** (Severe, 3), Pushed 2 and 4 about 0.7 and 1.3 (Mild 1, Moderate 2), Immobilized until it escapes 1.9 (Severe 3),
  Hindered 0 on an Archer and 0.9 on a Paladin (Mild 1). Losing AP is the expensive kind; movement conditions are cheap. For E3.
- **Speed is worth nothing on an open field:** ±1 Speed changes 0.0 to 0.07 DE a turn for either class. Every Advance costs 1 AP whatever its length, and there is no
  terrain to go around. Speed needs walls and Difficult Terrain to be priced (not modeled).
- **Opportunity Attack, the P1 Paladin's level 1 Talent, is worth 0:** the Paladin spends all 5 AP every turn, so it never has AP left for a Reaction, and keeping 1 AP
  costs 1.8 DE a turn (its last Weapon Attack). For the Options step (a Talent the default build can use).
- **Evade** is worth the AP of the step away on the turns the Archer starts Engaged: Rolling Shot 1 (Evade 1 + a Weapon Attack) is 2.1 DE a turn better than the Advance
  (efficiency 1.65: over), 2.4 if every Standard had an Opportunity Attack. Steady Nerves is worth 0.1 to a kiting Archer, 2.0 (8% of a turn) to one that stands and shoots.
  Long Draw 0.5. True Shot 0.07 of its band (ignores 0.58 Banes of Cover on one shot). Patient Hunter's condition holds on 70% of the Archer's turns.
- **Measured instead of assumed:** an NPC Strike goes to each Paladin 34% of the time and to each Archer 16% (the `targeted` weights 1.5 / 0.75 gave 33% / 17%:
  confirmed); econ.mjs now uses these for Hunter's Focus (0.16, was 0.3) and Champion's Challenge (0.66, was 0.75). Perfect Shot was priced at 0 (its "favored next..."
  was read as the Action's own Favored): fixed, 16% of a turn.

## Options and Talents (pack OT, 2026-10-30): IN THE BOOK

`catalogue/paladin-options.txt`, `catalogue/archer-options.txt` (every option of a Pick slot, next to its default), `catalogue/talents.txt`
(melee Talents on the P1 Paladin's numbers) and `catalogue/talents-ranged.txt` (ranged, on the A1 Archer's); the builds
`classes/paladin-smite-1-options.txt` and `classes/archer-double-3-options.txt` take options in the simulated days (prices.md section 3). The
cards, the prices and the decision sheet: `book/options-talents.md`. Escalation Actives are compared per turn (a use × the uses a fight ÷ the rounds).
**Fixed the same day:** since pack C1 the scripts crashed on Foundry's new config (the Bestiary by Stage, CV ×100): `econ.mjs` uses the flat
model A baseline, `spec.mjs` reads `npcDamage(role, rating, level)` and `roleCv()` (CV ÷ 100). prices.md and report.md now use the E3 Bestiary
(a Standard: 63 Health, 10.7 damage a turn against AD 13), so their P1 and A1 rows moved by 0 to 4 points.

## The Archer main build (pack A1, 2026-10-29): PROPOSED

`classes/archer-double-1..3.txt` and `archer-rolling-1..3.txt` are the A1 main build with each Signature (`archer-1..3.txt` stay as today's
Archer, the Paladin's partners in the price list); `catalogue/archer-a1.txt` prices the new cards; the cards, the budget table and the questions:
**`book/archer-a1.md`**. Level 1: sustained 102-104% of the baseline (today's 96%), Health 86%; levels 2-3 against model A (flat at 23.3: prices.md's
brackets now use it). New in the spec files: `floor [Mod] shot strike quarry` (a passive: damage on a Tier 1), `clear-shot` (no Bane for a [Ranged]
Action against a creature Engaged with someone else), `elusive N` (the first NPC Strike against you each round takes N Banes), `boon 1 encounter ...`
/ `empowered 1 encounter ...` (until the fight ends: Hunter's Focus), and `Pinning Shot (else Weapon Attack)` in a turn (when the Escalation isn't there).

## Progression models (pack LV, 2026-10-29): `progression.mjs`

`node book/ruler/progression.mjs` (about 3½ minutes; `--quick` about 1) writes **`progression.md`**; the proposal that reads it is **`book/progression-lv.md`**.
Three models of growth over levels 1-10 (A Bounded: Modifier +3 at 5, +4 at 8, Mastery 2[W] / keep the best at 8; B Escalation-heavy; C +10% a level),
each with two stand-in PCs a level generated in the script (a weapon user and a caster with the same level 1 budget: the caster's spells are the
weapon user's Actions with [W] written as Power dice, Overcast +1 die per Escalation up to the tier's limit). For each model: the NPC Health that
keeps a standard fight (4 Standards) at 3.5 rounds, found by bisection (NPC damage × the PCs' Health growth; Defense and Modifier flat); fight
length and Health lost by CV; the CV of a lower-level NPC (how many make the same fight); the weapon user against the caster by round; what
matches 2[W] for a caster; the Standard day.

- **Fight length holds** in every model once NPC Health follows the PCs' damage (easy 2.5, standard 3.5 rounds, 19% / 33% of the party's Health).
- **Hard = CV 1.25 a PC, deadly = 1.5**: CV 1.5 lasts 5.4-6 rounds (61-74% Health), CV 2 is a wipe.
- **The level gap** is √(Health × damage) of the lower NPC against one of the party's level (within 0.05 of the measured CV): about ×0.9 a level, by tier in model A (×1 / ×0.8 / ×0.65).
- **Weapon user against caster:** the caster's round 1 is 94-112% of the weapon user's without any floor; 2[W] is +31% of a weapon user's fight, keep the best +10% of a caster's (Spell Mastery, +1 Power die, matches: 103%).

## The Paladin main build (pack P1, 2026-10-29): PROPOSED

`classes/paladin-smite-1..3.txt` and `paladin-hands-1..3.txt` are the P1 main build with each Signature (`paladin-smite-1-hold.txt`: the same, holding
Escalation for Hallowed Stance); `paladin-book-1.txt` is today's Paladin (the old level 2 files are in `archive/ruler-old/classes-old/`); `archer-3.txt` is a
stand-in (the level 2 Archer at level 3) until A1. `catalogue/paladin-p1.txt` prices the new cards. The cards, the budget table and the
questions: **`book/paladin-p1.md`**. Level 1: sustained 86-87% of the baseline (today's Paladin 109%), Nova 151-161% (104%), Health 124% (114%),
support 18-27% of a turn; growth +10% a level. `econ.mjs` section 3 now lists every class file, with the sustained budget checked on the turns
without an Encounter or Daily Action (a once-a-fight Nova is a third of the turns), the all-turns number beside it, Health against a frozen
pre-P1 baseline and, at levels 2 and 3, the charter's +10% curve. Runtime: spec.mjs about 2 minutes, econ.mjs about 20 seconds.

## The price list of the core rules (pack E1, 2026-10-29): `econ.mjs`

**Correction (2026-10-29, the same day): Escalation is spent** (the book: an Active costs its Escalation, spending turns passives off).
The first run treated it as a threshold. Both scripts now spend it, and the days add **Momentum** (book/class-charter.md). The numbers
below and in prices.md are after the fix where they say "real"; with it the Archer's real damage a turn is 107% of the baseline at L1
(within its budget) and the Paladin's 117% (over). The adventuring-day tables earlier in this file are from before the fix (Escalation as
a threshold, no Momentum): report.md has the current ones.

`node book/ruler/econ.mjs` writes **`prices.md`**: what everything an Action can do is worth in **damage-equivalents (DE)** at levels 1 to 3,
then every Action, Reaction and passive of `catalogue/paladin.txt` and `catalogue/archer.txt` (every card of the class, in the spec format)
priced against it, with a verdict for its Frequency. Exact dice math where it can; the simulated Standard day for timing (how many rounds reach
each Escalation, how often an ally goes Down, how often Lay On Hands is used). Its assumptions are at the end of prices.md, and in `A` at the top of the script.

**The exchange rate (level 1):** 1 AP = 4.66 DE (the Bestiary's baseline turn, 23.3, / 5); a Weapon Attack 5.4; a Standard's turn against AD 13
7.9; a Rally Point heals 8 (1 Health = 1.1 DE); a Down prevented 35 DE. **The price list:** +1 Boon = +9% of the roll it helps (0.5 DE on a
Weapon Attack; +1 Modifier and -1 Defense are the same), +1 Bane -10%, Favored +35% (3.7 Boons), Doomed -44%, Empowered 1 = +1 a die that
lands (+18% on a Greatsword attack, +13% on a Crossbow attack), Vulnerable 1 until its turn ends 1.2 DE, **+1 Defense for a round on an ally 0.87 DE**
(11% of what it takes), 1 Bane on an enemy's Strikes for its turn 0.87 DE. **Frequency bands** (DE per AP / 4.66): At-will 0.9-1.1, Round 1.0-1.3,
Encounter 1.4-2.0, Daily 2.0-3.0. **Escalation timing** in a Standard day (nothing spent): Escalation 1 or more in 85% of the rounds with Momentum (70% without), 2 or more 55% (40%), 3 or more 29% (14%); an Active that costs 1 / 2 / 3 is used 2.8 / 1.2 / 0.55 times a fight with Momentum.

**What it finds (level 1):**
- **Buffs and Defense are priced far below damage.** A point of Defense for a round is worth 0.87 DE against 4.66 for the AP that buys it, so
  Shield of Faith (0.19 of its band), Aura of Protection (0.4-0.6 against an Encounter band of 1.4-2.0), Champion's Challenge (0.14), Vow of Enmity (0.4-0.5),
  Precise Aim (0.11), Sanctified Ground (0.56) and Suppressing Fire (0.08) are all well under. The Paladin's support kit can't support yet:
  its only strong support is Lay On Hands (1.89, over: it gives an ally a Steel Yourself for 1 AP) and the Down savers (Divine Intervention 5.3, Call to Arms 67% of a turn for 0 AP).
- **Nova doesn't exist:** the Paladin's best Encounter turn (Word of Radiance + Smite 2 + an attack, 24.3) deals less than its Round turn (Smite 3 + two attacks with Divine Surge, 29.2).
  The Archer's Encounter and Daily attacks are under their bands: Marksman's Shot 0.68, Volley 0.88, Deadeye 0.89 and Rain of Arrows 0.82 (Daily band 2.0-3.0).
- **Over:** Smite 1 (1.60: 1 AP for +1d4 over a Weapon Attack), Wing Clip (1.62), Twin Shot (3.44, now in only 14% of the rounds at Escalation 3), Lay On Hands, Divine Intervention, Call to Arms; a little over: Smite 2, Consecrated Ground 3, Hunter's Focus.
- **Double Shot 3 is under (0.86):** its 3rd AP buys only 1 DE (a Boon on each attack). Its real value is that its two attacks don't use Strikes or take At-will Banes (not priced).
- **Role budgets** (real damage a turn in the simulated day, Nova, Health, as a share of the baseline; after the Escalation fix): Paladin L1 117% / 104% / 114% against a budget of 85-90% / 150-180% / 120-130%; Archer L1 107% / 82% / 86% against 100-105% / 110-130% / 80-85%.
  The Paladin deals too much sustained damage; neither class has a Nova; the Paladin needs more Health.
- **Against the roles:** Hallowed Stance (the Paladin, fine: a tank stands) and **Patient Hunter** (the Archer: a Boon only while it doesn't move, against "very mobile").
- **Not priced yet (pack E2, positions):** Evade, Push, Cover, range, Hindered, Immobilized, Prone, the Boon on Saves (NPC Save Actions), ending an effect: Rolling Shot, Vanish, True Shot, Lock & Loose's and Pinning Shot's riders, Hand of Mercy and Long Draw get "+ E2": their verdicts aren't final. **Priced since pack E2** (above), except the Boon on Saves and hazardous areas ("+ ?").

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
- `econ.mjs` with `catalogue/*.txt`: the price list of the core rules (pack E1); it writes `prices.md`.
- `map.mjs`: the map model (pack E2): grid, movement, Banes and Boons of positions, conditions, Forced Movement; `spec.mjs` uses it (`map on`).
- `positions.mjs`: the prices of positions (pack E2); it writes `positions.json` (econ.mjs reads it).
- `progression.mjs`: the progression models over levels 1-10 (pack LV); it writes `progression.md`.
- `rework.mjs` with `rework/*.txt`: the playtest 2 rework's numbers (pack R prep); it writes `rework.md` (part 1) and, with `--sheet`, `rework-sheet.md` (part 2, the decision sheet).

**Audit of 2026-11-04 (book/rework-r.md section 14.4; report.md rewritten, small deltas):** Hallowed Stance is off on a turn the Paladin moved ("haven't left your square since your last turn"); a passive's `first-hit` scope (Radiant Zeal: the first Strike *that deals damage*) against `first` (Killer's Focus: the first Action); a Linked attack that must repeat a target (Double Shot with one enemy left) takes the At-will Bane; a card's Guard `[Mod]` is the Action's Modifier; the Opportunity Attack fires on an NPC's Stand too; Quick Draw once per Advance; `RULES.bloodiedBanes` (the book's Bloodied Banes on [Strike] and [Weapon] Actions, PCs and NPCs; off by default: the calibrations never had them and pack R removes them; on today's 4 Standards fight they move the Health lost 32% → 33% and the Downs 27% → 30%).

They import the system's dice math (`foundry/twod12/module/calc.mjs`) by a relative path: run them from anywhere with `node book/ruler/<name>.mjs` or `python3 book/ruler/<name>.py`.
- `ruler.mjs`: the PC ruler above (a level 1 PC's damage a turn against AD 12 to 14).
- `ratings.py`: writes the Bestiary's rating tables (levels as rows, ratings as columns); levels 2 and 3 scale NPC Health by the PCs' damage growth and NPC damage by the PCs' Health factor (a draft: `book/draft-bestiary-levels.md`).
- `levels.mjs`: the PC ruler by level (above).
- `defense.mjs`: what a Defense value costs the PCs, and NPC offence against the PC Defense range.
- `tablecheck.mjs`: the Basic attack tables against the "deals about" targets.
- `roles.mjs`, `npcdmg.mjs`, `bigger.mjs`, `fight.py`: the earlier role, NPC damage and fight checks.

## The Bestiary refit (pack E3, 2026-10-29): `bestiary.mjs`: IN THE BOOK (2026-10-30)

`node book/ruler/bestiary.mjs` (about 23 minutes; `--quick` about 7) writes **`bestiary.md`**; the proposal that reads it is **`book/bestiary-e3.md`**.
The real classes (2 P1 Smite Paladins + 2 A1 Archers, Double Shot and Rolling Shot, levels 1-3; a mixed party as a check) on the map, with LV's
decisions (3.5-round standard fights, the CV scale ¾ / 1 / 1¼ / 1½ a PC, the Health factor (Level + 17) / 16): today's Bestiary; the tier 1 refit
(NPC Health and damage factors by bisection for 3.5 rounds and a target Health lost, 33% and 40%); fights by CV; what an Elite, a Grunt and a
Minion are worth in Standards and the fixes that bring them to their CV; the Standard day; tiers 2-3 from LV's stand-ins; the proposed tables by
tier; the PCs' Health with the new factor. **New in spec.mjs:** an NPC with `exact: true` rolls its table's average exactly (the nearest dice
moved by a flat amount; opt-in, so report.md and the other reports don't change). **Findings:** the real classes lose 22% a normal fight against
today's Bestiary; the refit is Health ×1.10, damage ×1.38 for a third; an Elite is worth about 2.6 Standards (fix: today's Elite damage), a Grunt
0.57 (fix: Health ×0.69; Lucas chose ×0.75, CV 0.51-0.53), Minions ¼; the Standard day 93% / 95% / 100% at levels 1-3 (today 82% / 71% / 94%).
