# The automated playtest environment (SIM): a brief

Lucas, 2026-11-11. A design document in progress (in `tools/knowledge.py` DESIGN_DOCS). It is the brief for the session that builds it (Lucas plans to give it to Fable), and the list of what the ruler still lacks. Nothing here is built yet.

## 1. What it is, and where it goes in the order

A simulator that plays whole encounters on a grid: tokens with sizes, a map with walls and terrain, both sides choosing their Actions and moves, thousands of seeded runs, and a viewer to watch one fight round by round. It is for wide playtesting before the table: does Stage 0 hold up on real maps, does a class or an NPC break, which options nobody would ever pick.

The order (MASTER-PLAN section 3, item 3):

1. **The ruler catch-up, the rules part** (section 3 below). First, so the simulator copies and is checked against the book's current rules.
2. **SIM**, this document (built in four parts, section 5). It takes the place of the "three preset maps" step that was proposed for the catch-up.
3. **The Stage 0 run in SIM** (several maps, several decision policies). Then Stage 0 into the book, the class card sessions, Stage 0 in Foundry, Playtest 5.

Stage 0 does not need to be in the book first: SIM runs Stage 0 builds as data, which is the point (find the problems before writing them down).

## 2. What already exists (read these first)

- **The ruler** (`book/ruler/`, README.md): `spec.mjs` reads class builds (`classes/*.txt`) and fights (`fights.txt`) and writes `report.md`: turns, duels, Monte Carlo fights, adventuring days. Seeded; `node book/ruler/spec.mjs --check` compares the simulation with the exact dice math. `map.mjs` and `positions.mjs` are its map model today: an open field (distances, Engaged, Cover drawn per shot, range, Flanking, Prone, Hindered, Immobilized); `RULES` in spec.mjs switches pack R's rules on (the `rework/*-r1.txt` files use them).
- **The cards** (`book/cards/*.json`, loaded by `book/cards/load.mjs`): every card of the book, one source for the book, Foundry and the ruler (pack CS). The Mithril cards carry their automation as data (the "After the damage" steps).
- **The Foundry system's pure code**, already loaded under Node by its 243 tests with small stand-ins: the dice (`foundry/twod12/module/calc.mjs`: exploding d12s, Doubles, Boons and Banes, Favored), the Bestiary (`config.mjs`: npcHm, npcDamage, roles and ratings), the effects' rules (`fxrules.mjs` compile), the durations (`effects.mjs` durationStep / pendingSteps), the movement limits, the Turn Log lines (`ticker.mjs`).
- **Real play to compare with:** the Encounter Log's Copy (`foundry/twod12/module/enclog.mjs` exportText: "OC - Charge 4, WA vs DP T3; ...", by Round, with the abbreviations) and the playtest logs (`book/playtest-3.md`, `book/playtest-4.md`).

## 3. Before SIM: the ruler catch-up, rules part (Claude Code, M)

- `calc.mjs` as Foundry has it: flat Boons and Banes and the new Favored.
- `map.mjs`: Flanking's cancels then the limit of 2, High cover Doomed, the Field limit.
- `rbestiary.mjs`: the NPC Modifier ratings.
- **Pack R's rules as the default** (`RULES` in spec.mjs still defaults to 5 AP and no Reaction AP; the r1 files switch them on): 4 AP + 1 Reaction AP, Guard from unused AP, Escalation as a level with Momentum. Every place that assumes 5 AP is checked (the README's results still say "5 AP" in places).
- `report.md` regenerated; the README's results marked "before / after the catch-up".

## 4. The environment (SIM): requirements

### 4.1 One rules engine, not three
SIM must not reimplement the rules. It imports the Foundry system's pure modules and the card JSON, as the ruler does. Where a rule lives only in Foundry code that needs Foundry (a hook, a document), the session moves the rule into a pure function in the system (with a test) and both use it. A third copy of the rules would drift from the book and from Foundry within a month. If a rule has to be written for SIM alone, it is listed in SIM's README as "SIM-only, to move into the system".

### 4.2 It is the ruler's map layer
SIM replaces `map.mjs` / `positions.mjs`; `spec.mjs` keeps its inputs (class files, fights.txt, days) and keeps writing `report.md`, with a `map <name>` setting per fight. **Gate:** on the open-field map with the old decision rules, SIM reproduces today's `report.md` within the Monte Carlo noise before any new number is trusted. Seeded runs (the same files give the same report); `--check` stays.

### 4.3 The map
- A square grid, the book's distances (every second diagonal 2), maps as small JSON or text files (`book/ruler/maps/`): walls, Low / Medium / High cover objects, Difficult Terrain, elevation (later), start zones for each side.
- **Line of Effect and Cover** as the book draws them (center to center, corners; Foundry's `stepCorners` and the cover code are the reference).
- Tokens with sizes (Large later), Engaged, the threat squares, Collision.
- Areas: Emanation, Burst, Line, Cone as the book shapes them (CLAUDE.md: a 2 Emanation = 21 squares; a Burst on a corner); areas that last (Zones: Consecrated Ground, Covering Fire, Rain of Arrows) with their rounds.
- **A starter set of maps:** an open field (the gate), scattered pillars and cover, a corridor with a chokepoint, Difficult Terrain patches, a ranged-friendly map (long sight lines) and a melee-friendly one (short ones).

### 4.4 Turns, Actions, conditions
Initiative and the side grouping, 4 AP + 1 Reaction AP, the 3 Strikes, Frequencies, Escalation and Momentum, the Reaction moments (Opportunity Attack, Rebuke, Beacon's Step...), every condition with its duration (the system's durationStep), Forced Movement into walls and terrain, Saves (PC and NPC), Resist / Weak / Immune, Guard (and the unused AP's Guard), Down, Dying, Rally Points.

### 4.5 How creatures choose (half the result)
Automated combat is only as good as its decisions. Decision **policies**, switchable per creature or side, for example: focus the weakest, protect the healer, kite (ranged keeps its distance), hold a chokepoint, spend Encounter Actions early / late, keep the Reaction AP. A **sensitivity report**: each headline number under two or three policies, so a result that only holds under one policy is visible. Mistakes on purpose (a "casual player" policy) are welcome.

### 4.6 Output
- `report.md` as today, plus per map and per policy: win rate, rounds, Health lost, Downs, damage by source, AP spent by kind (attack, move, Reaction, wasted), how often each Action and option was used (an option nobody picks is a finding).
- **A replay viewer:** one HTML file that plays a seeded fight round by round on the grid (tokens, moves, areas, the log beside it), opened from a run's seed. Without it, bad decisions hide inside averages.
- Each fight's log in the Encounter Log's playtest format, so a SIM fight and a table fight read the same.

### 4.7 Checked against real play
Playtest 4's encounter replayed in SIM (the same creatures, the map approximated) and compared with the table: rounds, Downs, who did the damage. A large gap means the decisions or a rule are wrong, not the table.

## 5. Built in four parts (one session each)

| Part | What | Done when |
|---|---|---|
| SIM-1 | The shared engine: the rules SIM needs pulled into pure system functions with tests; SIM's turn loop on the open field | `report.md` reproduced on the open field (the gate in 4.2); the system's tests still pass |
| SIM-2 | Maps, Line of Effect and Cover, movement and Forced Movement, terrain, areas and Zones | the starter maps run; Speed and the movement conditions get a price above 0 where the map allows it |
| SIM-3 | Decision policies and the sensitivity report | each headline number under 2 or 3 policies |
| SIM-4 | The replay viewer and the Encounter Log output; Playtest 4 replayed | a fight can be watched; the Playtest 4 comparison is written in SIM's README |

## 6. What the ruler still lacks (the README's "not modeled" lists), and where it goes

| Missing | Where |
|---|---|
| The current rules (flat Boons and Banes, Favored, Flanking, High cover, the Field limit, NPC Modifier ratings, pack R's AP as the default) | the catch-up (section 3) |
| Stage 0: levels 1 to 3 on `book/decisions-s1.md`'s level lists, no Talents; Escalation 1 to 6 with Momentum 0 to 4 | the Stage 0 run, after SIM |
| Walls and Line of Effect, Difficult Terrain, Collision, Large creatures, elevation; so Speed (worth 0 on an open field), Push / Pull / Slide, Slowed, Hindered, Immobilized, Evade, range | SIM-2 |
| Areas that last: Covering Fire's 1d4 on entering, Rain of Arrows' hazardous terrain, Consecrated Ground and the other Zones | SIM-2 |
| Resist, Weak, Immune | SIM-1 (the system's `creatureDamageLines`) |
| NPC Saves, so the Boon on Saves (Shield of Faith 3 and Aura of Protection 3 read "under" for it) | SIM-1 |
| NPC special Actions (the Bestiary's), the Elite's phases | SIM-1 |
| Body and Mind as two pools (Vigor and Resolve) | SIM-1 |
| Rally Points a PC spends on itself | SIM-3 (a decision) |
| Riders: Lock & Loose's and Pinning Shot's, Vanish's Bane on the first Strike, True Shot, Rolling Shot, Hand of Mercy, Long Draw | SIM-1 / SIM-2 |
| Senses and Light: Darkness, Dim, Blinded, Hearing | SIM-2 (a map's light) |
| The pack AU conditions as the Bestiary uses them: Frightened, Taunted, Sickened, Staggered, Dazed, Grabbed, Bleed | SIM-1 |
| Reactions in the 4 + 1 AP economy (the README's "Opportunity Attack is worth 0" was measured with 5 AP and no Reaction AP) | the catch-up, then SIM-3 |
| A check against the table | SIM-4 |

## 7. Not in SIM (for now)
Base building, mounts and vehicles, the expedition loop between fights (Alert, the Parting Beat), Skills and Magic (D3, D4), destructible terrain (with B2), Stage 1 and later (the same engine runs them when their cards exist).

## 8. Questions for Lucas (defaults in brackets; answer by exception)
1. Where SIM lives [`book/ruler/sim/`, Node only, no new dependencies; the viewer one HTML file with no build step].
2. Who builds it [Fable, from this brief; Claude Code does the ruler catch-up first and reviews SIM-1's engine against the system's tests].
3. The first maps [the six of 4.3; Lucas draws more later as text files].
4. The decision policies to start with [focus the weakest, protect the healer, kite, casual].
5. The gate's noise [within 3% of today's `report.md` on win rate and rounds, on the open field].
