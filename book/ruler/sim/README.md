# SIM: the automated playtest environment

The brief: `book/sim-brief.md`. Built in four parts. **SIM-1 is done (2026-11-12, Foundry v0.0.365)**: the shared engine and its turn loop on the open field. **SIM-2 is done (2026-11-12, v0.0.366)**: maps with walls and Difficult Terrain, Line of Effect and Cover by corners, movement by paths, Forced Movement with Collision, the fights by map (`../maps.md`); areas and Zones on the grid (finished the same day, after SIM-3: `../areas.md`). The viewer's first version is built. **SIM-3 is done (2026-11-12, no Foundry version)**: decision policies for the party and the enemies and the sensitivity report (`../policies.md`). **SIM-4 is done (2026-11-12, no Foundry version)**: a fight in the Encounter Log's playtest format, and Playtest 4 replayed and compared with the table (`../playtest-4-sim.md`; the comparison is below). The four parts are built.

## What is here

| File | What |
|---|---|
| `core.mjs` | The rules a run can change (`RULES`; `RULES_R` the book today, `RULES_PRE_R` before pack R), the system's modules it imports, the dice (`rollDice`, `rng`), damage expressions, the Bestiary's NPCs (`npcOf`, `npcKit`) |
| `turn.mjs` | One PC turn: its Actions in order (AP, the 3 Strikes, Frequencies, Escalation, Linked Actions, effects): `runTurn`, `turnFor`, `turnDamage` |
| `engine.mjs` | The encounter: rounds and turns, Reactions, the NPCs' turns, conditions, Down; `fight()`, `day()`. Options: `policy`, `log` |
| `policy.mjs` | The decisions, apart from the rules: `planPolicy` is the ruler's old decision rules (who to hit, which turn, whom to heal, when to react, how an NPC picks its target) |
| `run.mjs` | One fight written out as text, round by round (`--seed N`, `--json`) |
| `view.mjs`, `viewer-template.html` | **The fight viewer** (2026-11-12, brought forward from SIM-4 at Lucas's request): `view.mjs` plays every encounter of fights.txt and writes **`fights.html`**, one file to open in a browser |
| `../map.mjs` | The map layer: distances, Engaged, Flanking, range, conditions, movement, Forced Movement. With no map it is the open field (Cover drawn by chance per shot), exactly as before SIM-2; with a map (`loadMap`): walls, Line of Effect and Cover by corners, paths around walls and through Difficult Terrain, Collision |
| `../maps/*.txt` | **The maps** (SIM-2): `pillars`, `corridor`, `rough`, `longsight`, `closequarters`; `open` is the open field |
| `enclog.mjs` | A fight's log in the Encounter Log's playtest format (SIM-4): the system's own `module/enclog.mjs exportText`, fed with the engine's events |
| `playtest4.mjs` | **Playtest 4 replayed** (SIM-4): the table's encounter run 1,500 times a map, beside what happened at the table; it writes `../playtest-4-sim.md` |
| `stage0.mjs` | **The Stage 0 run** (2026-11-12, a prototype: nothing of it is in the book): levels 1 to 3 on decisions-s1.md's lists, Escalation 1 to 6 with Momentum, the Bestiary's Stage 0 row fitted, the ranged-against-melee candidates; it writes `../stage0.md` |
| `policies.mjs` | **The sensitivity report** (SIM-3): every headline fight under each party policy and each enemy policy, on three maps; it writes `../policies.md` |
| `areas.mjs`, `parties.mjs` | What the Area cards do on the grid against the number their ruler lines assume, with a party that uses them; it writes `../areas.md` |
| `maps.mjs` | The fights on every map and the price of Speed and of the movement conditions there; it writes `../maps.md` |
| `../spec.mjs` | Reads the class files and `fights.txt`, writes `report.md`; it exports everything above again, so the other scripts didn't change |

```
node book/ruler/spec.mjs --check                          # must print only "ok"
node book/ruler/spec.mjs --quiet                          # writes report.md (the gate: it must come out unchanged)
node book/ruler/sim/run.mjs                               # the encounters of fights.txt
node book/ruler/sim/run.mjs "4 Standards (normal)" --seed 3
node book/ruler/sim/view.mjs                               # writes sim/fights.html: open it in a browser
node book/ruler/sim/maps.mjs                               # writes maps.md (about 25 minutes; --quick about 9)
node book/ruler/sim/policies.mjs                           # writes policies.md (about 11 minutes; --quick about 4)
node book/ruler/sim/run.mjs "2 Elites" --seed 7 --playtest  # one fight in the Encounter Log's playtest format
node book/ruler/sim/playtest4.mjs                          # writes playtest-4-sim.md (about 3 minutes)
node book/ruler/sim/stage0.mjs                             # writes stage0.md (about 7 minutes; --quick for a draft)
```

## Maps (SIM-2)

A map is a text file in `book/ruler/maps/`, one character a square; a line that starts with `;` is its title. The top row is the far side.

| Character | What |
|---|---|
| `#` | A wall, or anything solid that fills its square (a pillar): it blocks lines and movement, and its corners are solid (no diagonal past it) |
| `~` | Difficult Terrain (each square counts double) |
| `P` / `N` | Where the party / the enemies can start (melee creatures take the squares nearest the other side) |
| `.` | Open ground |

Draw a new one and it is in the viewer and in `maps.md` the next time their scripts run (`fight(..., { map: { ...MAP, grid: MP.loadMap("name") } })`). **What a map changes:** Cover is the corners of the target's square that walls block from the center of yours (the system's `gridrules.mjs coverLevel`; 4 blocked = no Line of Effect: it can't be targeted), for melee and ranged alike, with a creature in the way still Low cover; a movement follows the cheapest path (the second diagonal 2, Difficult Terrain double, no solid corner: `corners.mjs stepCorners`; no square with a creature in it); Pushed and Pulled go in a straight line and a creature thrown into a wall or a creature takes Collision damage (`gridrules.mjs collisionDamage`); a ranged creature that can target no enemy moves to a square with a line to one.

### Areas and Zones (2026-11-12)

On a map an Action with an Area is placed on the grid and hits who stands in it. The Area is the card's own (`area` and `distance` in `book/cards/*.json`: spec.mjs writes it on the Action's line as `shape emanation 2 dist 10 who all`): an Emanation or an Aura N around a square, a Burst N on a corner (the system's `gridrules.mjs emanationSquares`, `burstSquares`), within the card's Distance, with Line of Effect from its Point of Origin to each creature. **An Area that lasts is a Zone:** its squares stay for the card's rounds (an Aura follows its maker), and what it does is read from where a creature stands when it matters: an enemy that Strikes from inside takes its Bane, an ally that starts its turn inside is healed, an ally struck inside has its Defense bonus. The policy decides where it goes (`placeArea`): the spot with the most of the creatures it is for; a damaging Area that hits "all creatures" never where an ally stands; one that lasts and deals no damage (Consecrated Ground, Covering Fire) counts allies too, so it lands on the party's line while the enemies are still far.

On the open field of `report.md` nothing changed: an Area still hits the number of creatures its card's ruler line says (`RULES.areasOnGrid` false: the gate). `book/ruler/areas.md` (`node book/ruler/sim/areas.mjs`, about 5 minutes) compares the two with a party that uses the Area cards (`parties.mjs`):

- **The ruler lines' numbers are right for the normal fight and low for a big one.** Against 4 Standards a Volley holds 1.6 to 2.5 enemies (its line says 2), Consecrated Ground 2.2 to 2.7 (2), Final Verdict 1.2 to 1.4 (1.5), Word of Radiance's 3 Burst 2.6 to 3.1 (2.3). Against 6 Standards: Volley 2.3 to 3.5, Consecrated Ground 2.6 to 3.5, Final Verdict 1.8 to 2.4, Word of Radiance 3.8 to 5.0, Rain of Arrows 3.0 to 3.3 (2.5).
- **A Zone works only for who stays in it.** On the plan policy the Paladins walk out of their own Consecrated Ground to meet the enemy, and the party with the Area cards does a little worse on the grid than by count (the normal fight on the open field: 16% of its Health against 13%). Holding the line with it is the best result measured on most maps (the normal fight in the long hall 9% against 20%; the deadly fight there won 88% against 72%).
- **Hallowed Dawn reaches fewer allies than its line says.** Its 2 Emanation around the Paladin holds 1 or 2 allies on a map, not the 3 of its ruler line (the Archers stand back): it heals 34 Health a deadly fight instead of 44, which is 5 points of the party's Health. This alone moved `maps.md` (the normal fight on the maps: 16 to 22% of the party's Health, was 16 to 18%; the deadly fight among the pillars is won 57%, was 60%).
- **Covering Fire** defends about 10 Strikes against allies in a normal fight and 20 in a deadly one, and its Bane lands on 5 to 11 enemy Strikes: far more than its line's "2 enemies, 2 allies" for 3 rounds assumed.

**Not on the grid yet:** Covering Fire's damage to enemies that enter it and Rain of Arrows' Hazardous Terrain (the cards' text has them, their ruler lines don't), a Line, an Area that hits allies on purpose, enemies walking around a Zone, Hazardous Terrain on a map, Large creatures, elevation, doors, Leaning, light and Senses, a Slide's Collision. Threatening and Engaged ignore walls (two creatures on either side of a wall's corner count as adjacent, though they can't target each other).

**The gate holds:** with no map, `report.md` and the other reports come out unchanged.

## The viewer (`fights.html`)

Double-click `book/ruler/sim/fights.html`. Pick an **Encounter** and a **Fight** (each is a seed: "3: won, 4 rounds"), press **Play** (Space), or step with the arrow keys (Left / Right one step, Down the next turn, Home the start). Pick a **Map** first, and how the **Party plays** (the plan, tactical or casual policy). The map shows walls (dark) and Difficult Terrain (tinted) and every creature on the grid (blue the party, red the enemies; the tag is its first letter and number), its Health bar and Guard, a gold ring on whose turn it is, a line for each attack coloured by Tier (dashed for a Reaction) with the damage, **a green line and ring for anything that helps an ally** (a heal, a Rally Point, Guard, a block: Lucas, 2026-11-12), and a dotted trail for a move. Beside it: every creature's Health, Guard, Escalation and conditions now, and the log (click a line to jump there). The top line gives the encounter's numbers over 300 fights.

It is one file with no build step and nothing loaded from the network. It knows no rule: it draws the engine's log (each event's `ch` list says whose Health, Guard, place and conditions changed). `node book/ruler/sim/view.mjs` writes it again after a change to the rules, the builds or fights.txt (`--seeds 12` for more fights to watch, `"2 Elites"` for one encounter, `--out file.html`). To change how it looks, edit `viewer-template.html`, not `fights.html`.

**Zones are blue squares for their rounds, an Area flashes when it is used; "Party plays" has a fourth choice, the party with the Area cards.** Not there yet: each roll's Boons and Banes, heals as their own lines, the Encounter Log's playtest format, Playtest 4 replayed (SIM-4).

## The gate (sim-brief.md 4.2)

SIM-1 moved the fight out of `spec.mjs` and split its decisions from its rules without changing a roll: `report.md`, `report-pre-r.md`, `rclasses.md` and `rbestiary.md` came out byte for byte the same as the ruler catch-up left them, which is stricter than the brief's 3%. **The gate is the committed `report.md`.** It has changed on purpose once since: 2026-11-12, an enemy at 0 Health is out at once (`RULES.outAtOnce`; "Checked against the table" below). Any later change to the engine is checked the same way: run them and `git status` must be clean, or the change is a rule or a decision that moved and the README says which.

## One rules engine, not three

The engine imports the rules from the Foundry system; it has no copy of them.

| Rule | The system's file |
|---|---|
| The dice: exploding d12s, Doubles, flat Boons and Banes, named ones up to 2, five = Favored / Doomed, Favored's any pair, Criticals | `module/calc.mjs` |
| A turn's AP, the Reaction AP's start, the unused AP's Guard, the 3 Strikes, the At-will Bane, Escalation's start and raise, Momentum, the Elite's ladder, Flanking's count, Cover's effect, Prone, Engaged, the range Banes | `module/roundrules.mjs` (new in v0.0.365; test t246) |
| The Bestiary's tables, roles, AP, Special multipliers, Stages | `module/config.mjs` |
| NPC Modifier ratings | `module/data.mjs` (it needs two stand-ins for Foundry's globals: the top of `core.mjs`) |
| Guard per AP | `module/guard.mjs` |
| Every card | `book/cards/*.json` (`book/cards/load.mjs`) |

### SIM-only rules, to move into the system

These are written only here. Each is a rule the system also has, in code that needs Foundry (a hook, a document), or doesn't automate. They move into pure system functions as SIM-2 and SIM-3 touch them:

- **A PC turn** (`turn.mjs runTurn`): spending AP, a lower Version when AP are short, Frequencies (Round, Turn, Encounter, Daily), Linked Actions, "next" and "turn" effects, Empowered, Vulnerable as Boons for the attacker. Foundry: `actions.mjs useAction`, `usage.mjs`.
- **The Reaction moments** (`engine.mjs`): Opportunity Attack (an adjacent enemy leaves a square or stands), Overwatch and Quick Draw (moves closer), Rebuke, Shield of Faith and Bulwark (a hit on an ally), Covering Shot, once per triggering Action. Foundry: `moment.mjs`.
- **An NPC's turn** (`engine.mjs kitSeq`): the Encounter Special once, the Round Special, Basic attacks. Which Specials a role has (`core.mjs npcKit`) is the ruler's reading of the Bestiary: Foundry's NPCs carry their own Actions.
- **Elite phases and the Escalation hooks** (when they fire): Foundry: `escalation.mjs raiseEscalation`.
- **Conditions and their ends** (`map.mjs applyCondition`): Hindered, Immobilized, Prone, Slowed, Dazed, Staggered, Blinded, Frightened (its Bane), Taunted, Bleed. Foundry: the Effect items and `effects.mjs durationStep` (pure: SIM-2 should use it).
- **Health:** one pool with Vigor and Resolve followed for Bloodied and Strained; Guard before Health; Rally Points. Foundry: `data.mjs deriveHealth`, `guard.mjs absorbGuard` (pure: to use).
- **In the system but not rewired to `roundrules.mjs` yet:** Cover's Banes and Doomed in `actions.mjs` and `inline.mjs` (the same rule written three times there), the Strikes counter, the At-will Bane.

## Decisions (policy.mjs)

The engine asks the policy; `planPolicy` answers as the ruler always did (report.md is the plan policy on the open field: the gate). `fight(..., { policy, npcPolicy })` takes one for the party and one for the enemies.

**The party's policies** (`POLICIES`; `makePolicy(name, switches)` builds one, each switch one decision):

| Switch | What it decides |
|---|---|
| `hold` | A melee PC doesn't walk to an enemy it can't reach with one Advance while melee enemies are still coming (rounds 1 and 2): it keeps its place and its AP (Guard at its next turn) |
| `kite` | A ranged PC that starts its turn Engaged steps away first (1 AP), then takes what is left of its turn |
| `protect` | A melee PC walks to the enemy nearest to a ranged ally (within 3 squares of one), not to the one nearest to itself |
| `novaLate` | The round 1 turn with an Encounter Action waits for round 2 |
| `react: "first"` | Every Reaction on its first trigger, the Opportunity Attack too |
| `focus: "nearest"` | No focus fire: each PC hits the enemy nearest to it |

`POLICIES`: `plan`, each switch alone (`hold`, `kite`, `protect`, `novaLate`, `reactFirst`), `tactical` (hold + kite + protect), `casual` (no focus fire, first trigger). **The enemies'** (`NPC_POLICIES`): `plan` (the PC it can strike most, a hurt one a little more), `weakest` (every NPC on the PC with the least Health left), `nearest`, `back` (the Archers first).

**What `policies.md` found (300 fights a cell; the party's Health lost, a PC Down, the party wins):**

- **Decisions move the result as much as the encounter's size.** The normal fight on the open field costs 11% of the party's Health when it holds the line and 21% when it plays casually (the plan: 14%). The deadly fight in the corridor is won 65% of the time holding the line, 58% on the plan, 32% casually.
- **Holding the line is the best single decision** everywhere (normal fight 14% → 11% on the open field, deadly fight won 77% → 85%): the enemies come to the party, the Paladins get whole turns and their unused AP's Guard is finally used.
- **Focus fire is worth about a third of the fight:** without it (casual) the deadly fight costs 62% instead of 41% on the open field.
- **Kiting as written here doesn't pay:** the step away costs an AP of shots and the party takes the same. Protecting the back line and holding the Encounter Action for round 2 are inside the noise. Reacting to the first trigger costs up to 4 points on the maps.
- **How the GM plays the enemies matters more than anything the party does.** Enemies that all strike the weakest PC put a PC Down in 48% of the normal fights (the plan: 23%) and win the deadly fight 42% of the time (23%); enemies that all walk to the nearest PC are as dangerous on a map (the corridor's deadly fight: won 25%), because they pile on the front line. The Bestiary's fit ("a Down in about 1 fight of 5") is the plan policy's.
- **Whom the party hits first hardly matters** once an enemy at 0 Health is out at once (below): the enemy closest to dying (the plan), the hit sized to the target (`threat`) and the Minions left for last all land within 1 point of each other; leaving the Minions for last is a little worse.

Each number of report.md, maps.md, rclasses.md and rbestiary.md is the plan policy's; policies.md is the range around them.

Still decided inside the engine: where a creature walks (a melee PC to the nearest enemy, a Charge when it can; a ranged PC away from the enemies but in range, an Evade 1 next to an Opportunity Attack), the order of an NPC's attacks, and that a PC uses a Reaction on its first trigger.

On a map the plan policy is weak on purpose (it is the open field's): nobody holds a chokepoint, nobody steps behind cover, the melee PCs walk to the nearest enemy wherever it stands. `maps.md` is read with that in mind; SIM-3's policies are what make a map's numbers trustworthy.

Known gaps of `planPolicy`, each a finding for SIM-3 (README of the ruler, "The catch-up"): nobody holds an AP on purpose (the unused AP's Guard is never priced), nobody walks away from an enemy (an NPC's Opportunity Attack never fires), the Double Shot Archer's `Kite` turn has no step, a PC never spends a Rally Point on itself outside its `when self below` turn.

## Checked against the table: Playtest 4 (SIM-4)

`book/playtest-4.md` is the one fight of the current rules played at the table and written down: the four level 1 PCs against an Ogre Chieftain, an Orc Warrior, a Bandit Thug and three Goblin Sneaks, stopped in the middle of round 4. `playtest4.mjs` runs the same encounter (the enemies with their compendium ratings, Kaela with her Shortbow, three maps since the table's wasn't recorded) and sets the table beside SIM's fights: `book/ruler/playtest-4-sim.md`.

**It found an error in the engine, fixed the same day (`RULES.outAtOnce`).** An enemy brought to 0 Health was marked out only at the end of that turn, so the rest of the turn went on hitting it, and "damage dealt" counted those hits: SIM's damage a turn read 46% above the table's. Now an enemy at 0 Health is out at once and the rest of the turn goes to another enemy, and every PC has **damage that counted** (what the enemies' Health could take) beside damage dealt. What the fix moved in the reports: fights are a little shorter (the normal fight 3.8 → 3.7 rounds, the same 14% of the party's Health), encounters with many small enemies are easier (2 Standards + 8 Minions: 13% → 10% of the party's Health, a Down in 21% → 12%), the deadly fight is won 74% (73%); the Bestiary's Stage 3 Health fit is back where the book has it (1.22: × 1.20), and its Elite factor reads 1.04 (the book: × 1.00).

**After the fix, what agrees with the table:**

- **Aveline, Durgan and Sylwen:** 22.7 / 4.3 / 22.5 damage a turn at the table; SIM's damage that counted is 24.5 / 4.8 / 23.8, and the table sits at SIM's 39th, 50th and 42nd percentile.
- **Attack rolls a PC turn:** 2.4 at the table, 2.4 in SIM.
- **The enemies:** the Ogre dealt 10.3 a turn at the table; SIM's Ogre deals 13.5 (the table is at its 34th percentile). A Goblin: 1.0 against 1.8.
- **Durgan's Lay On Hands** spent 2 Rally Points against 1.3.

**What doesn't, and why:**

- **Kaela** dealt 11.5 a turn; SIM's Rolling Shot Archer with her Shortbow 18.4 (the table is at its 6th percentile). She moved in every turn, used the 1 AP Rolling Shot where the build takes the 2 AP one with its extra die, and spent Actions on Covering Fire and Open Season: decisions. With her, the party's damage that counted is 15% above the table's (17.9 a PC turn against 15.5).
- **Whom the party hits.** The table killed one Goblin and the Thug and put everything else into the Ogre and the Orc; neither was out after 3 rounds. SIM's party kills the three Goblins and, in 93% of its fights, the Orc by then. SIM measured both ways (above): it makes no difference to the result.
- **A PC Down:** none at the table in 3 rounds; in SIM in 38 to 49% of its fights by then. One fight can't decide it; it points the same way as the Ogre's damage: SIM's enemies are a little harder on the party than this table's were.
- **The dice:** the PCs' rolls at the table were Tier 1 / 2 / 3 21% / 59% / 21% over 34 rolls, SIM's about 33% / 42% / 25%: more Tier 2 than expected, within what 34 rolls allow.

**No rule was found to disagree.** One fight of three and a half rounds is a small sample: the next table fight exported with the Encounter Log's Copy goes through the same script.

## The log

`fight(party, npcs, R, { log: true })` returns `log`: every event in order, each `{ round, type, ... }`. Types: `start` (the map with its walls and Difficult Terrain, Initiative, every creature's place and Health), `round`, `turn`, `move` (from, to, how), `action` (a PC's Action on a target: Tier, damage), `attack` (an NPC's Basic attack or Special), `reaction` (`protects`: the ally it protects), `hold` (a PC keeps its place), `help` (a heal, a Rally Point, Guard, a Defense bonus: who, target, amount), `collision`, `down`, `dead`, `end`. Writing the log changes no roll. `run.mjs` prints it as text, or with `--playtest` in the Encounter Log's playtest format (`enclog.mjs`).

Each event also has `ch`: the creatures whose state changed since the last event (`i` its place in the start list, `dmg`, `pos`, `out`, `guard`, `esc`, `cond`), so Forced Movement, heals, Guard and conditions show without their own event. Not in the log yet as lines of their own: the Boons and Banes of each roll, heals, conditions put on and ended, Escalation raises.

## The Stage 0 run (2026-11-12)

`stage0.mjs` is a prototype: it changes no rule and no card. It builds its parties from the R class files (`rework/*-r1.txt`) by editing their text: the level, the Passives' rungs moved to Escalation 2 / 4 / 6 and kept only from the level that gives them, no Apex, no hook at level 1. Its rules are `{ ...RULES_R, escMax: 6 }` with `startEsc` 1 + Momentum.

The switches it added to the engine, all off by default (the gate: `report.md` unchanged):

| Switch | What it does |
|---|---|
| `RULES.escMax` (3) | The highest Escalation |
| `RULES.engagedRanged` ("banes") | "doomed": a [Ranged] Action while Engaged is Doomed (candidate C2) |
| `RULES.rangedOa` (false) | A [Ranged] Action while Engaged draws an Opportunity Attack from an adjacent enemy with a Reaction AP (C3) |
| `RULES.meleeGuard` (0) | A melee PC that ends its turn Engaged has that much Guard until its next turn (B2) |
| `pc.alt = { build, cost }` | A second weapon: the PC switches to that build once, when an enemy is within 2 squares, for `cost` AP (E) |

Candidates A (a smaller ranged die) and B1 (+2 melee damage) are edits of the build's text, not rules. `st.escHist` counts the PCs' turns by Escalation.
