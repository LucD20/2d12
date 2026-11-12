# SIM: the automated playtest environment

The brief: `book/sim-brief.md`. Built in four parts. **SIM-1 is done (2026-11-12, Foundry v0.0.365)**: the shared engine and its turn loop on the open field. **SIM-2 is done (2026-11-12, v0.0.366)**: maps with walls and Difficult Terrain, Line of Effect and Cover by corners, movement by paths, Forced Movement with Collision, the fights by map (`../maps.md`); areas and Zones are **not** drawn on the map yet (below). The viewer's first version is built. SIM-3 (decision policies) and SIM-4 (the Encounter Log's format, Playtest 4 replayed) are next.

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
| `maps.mjs` | The fights on every map and the price of Speed and of the movement conditions there; it writes `../maps.md` |
| `../spec.mjs` | Reads the class files and `fights.txt`, writes `report.md`; it exports everything above again, so the other scripts didn't change |

```
node book/ruler/spec.mjs --check                          # must print only "ok"
node book/ruler/spec.mjs --quiet                          # writes report.md (the gate: it must come out unchanged)
node book/ruler/sim/run.mjs                               # the encounters of fights.txt
node book/ruler/sim/run.mjs "4 Standards (normal)" --seed 3
node book/ruler/sim/view.mjs                               # writes sim/fights.html: open it in a browser
node book/ruler/sim/maps.mjs                               # writes maps.md (about 25 minutes; --quick about 9)
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

**Not on the maps yet:** areas drawn on the grid (an Action's Emanation, Burst or Line still hits the number of creatures its card's ruler line says; the shapes themselves are pure functions with tests: `gridrules.mjs emanationSquares`, `burstSquares`, `linearea.mjs lineSquares`), Zones that stay (Consecrated Ground's and Covering Fire's squares, Rain of Arrows' hazard), Hazardous Terrain, Large creatures, elevation, doors, Leaning, light and Senses, a Slide's Collision. Threatening and Engaged ignore walls (two creatures on either side of a wall's corner count as adjacent, though they can't target each other).

**The gate holds:** with no map, `report.md` and the other reports come out unchanged.

## The viewer (`fights.html`)

Double-click `book/ruler/sim/fights.html`. Pick an **Encounter** and a **Fight** (each is a seed: "3: won, 4 rounds"), press **Play** (Space), or step with the arrow keys (Left / Right one step, Down the next turn, Home the start). Pick a **Map** first. The map shows walls (dark) and Difficult Terrain (tinted) and every creature on the grid (blue the party, red the enemies; the tag is its first letter and number), its Health bar and Guard, a gold ring on whose turn it is, a line for each attack coloured by Tier (dashed for a Reaction) with the damage, **a green line and ring for anything that helps an ally** (a heal, a Rally Point, Guard, a block: Lucas, 2026-11-12), and a dotted trail for a move. Beside it: every creature's Health, Guard, Escalation and conditions now, and the log (click a line to jump there). The top line gives the encounter's numbers over 300 fights.

It is one file with no build step and nothing loaded from the network. It knows no rule: it draws the engine's log (each event's `ch` list says whose Health, Guard, place and conditions changed). `node book/ruler/sim/view.mjs` writes it again after a change to the rules, the builds or fights.txt (`--seeds 12` for more fights to watch, `"2 Elites"` for one encounter, `--out file.html`). To change how it looks, edit `viewer-template.html`, not `fights.html`.

Not there yet: areas and Zones, each roll's Boons and Banes, heals as their own lines, the Encounter Log's playtest format, Playtest 4 replayed (SIM-4).

## The gate (sim-brief.md 4.2)

SIM-1 moved the fight out of `spec.mjs` and split its decisions from its rules without changing a roll: **`report.md`, `report-pre-r.md`, `rclasses.md` and `rbestiary.md` come out byte for byte the same** as the ruler catch-up left them (the same seeds, the same dice in the same order), which is stricter than the brief's 3%. Any later change to the engine is checked the same way: run them and `git status` must be clean, or the change is a rule or a decision that moved and the README says which.

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

The engine asks the policy; `planPolicy` answers as the ruler always did. SIM-3 adds policies with the same functions and reports every headline number under two or three.

Still decided inside the engine, to move into the policy in SIM-3: where a creature walks (a melee PC to the nearest enemy, a Charge when it can; a ranged PC away from the enemies but in range, an Evade 1 next to an Opportunity Attack), the order of an NPC's attacks, and that a PC uses a Reaction on its first trigger.

On a map the plan policy is weak on purpose (it is the open field's): nobody holds a chokepoint, nobody steps behind cover, the melee PCs walk to the nearest enemy wherever it stands. `maps.md` is read with that in mind; SIM-3's policies are what make a map's numbers trustworthy.

Known gaps of `planPolicy`, each a finding for SIM-3 (README of the ruler, "The catch-up"): nobody holds an AP on purpose (the unused AP's Guard is never priced), nobody walks away from an enemy (an NPC's Opportunity Attack never fires), the Double Shot Archer's `Kite` turn has no step, a PC never spends a Rally Point on itself outside its `when self below` turn.

## The log

`fight(party, npcs, R, { log: true })` returns `log`: every event in order, each `{ round, type, ... }`. Types: `start` (the map with its walls and Difficult Terrain, Initiative, every creature's place and Health), `round`, `turn`, `move` (from, to, how), `action` (a PC's Action on a target: Tier, damage), `attack` (an NPC's Basic attack or Special), `reaction` (`protects`: the ally it protects), `help` (a heal, a Rally Point, Guard, a Defense bonus: who, target, amount), `collision`, `down`, `dead`, `end`. Writing the log changes no roll. `run.mjs` prints it as text; SIM-4 writes it in the Encounter Log's playtest format and draws it.

Each event also has `ch`: the creatures whose state changed since the last event (`i` its place in the start list, `dmg`, `pos`, `out`, `guard`, `esc`, `cond`), so Forced Movement, heals, Guard and conditions show without their own event. Not in the log yet as lines of their own: the Boons and Banes of each roll, heals, conditions put on and ended, Escalation raises.
