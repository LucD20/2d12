# The automated playtest environment (SIM): a brief

Lucas, 2026-11-11. A design document in progress (in `tools/knowledge.py` DESIGN_DOCS). It is the brief for the session that builds it (Lucas plans to give it to Fable), and the list of what the ruler still lacks. **SIM-1 is built (2026-11-12, Foundry v0.0.365): `book/ruler/sim/` (its README says what is there).** SIM-2 to SIM-4 are not.

## 1. What it is, and where it goes in the order

A simulator that plays whole encounters on a grid: tokens with sizes, a map with walls and terrain, both sides choosing their Actions and moves, thousands of seeded runs, and a viewer to watch one fight round by round. It is for wide playtesting before the table: does Stage 0 hold up on real maps, does a class or an NPC break, which options nobody would ever pick.

The order (MASTER-PLAN section 3, item 3):

1. ~~**The ruler catch-up, the rules part**~~ (section 3 below): **done 2026-11-12** (branch `pack-ruler-catchup`). First, so the simulator copies and is checked against the book's current rules.
2. **SIM**, this document (built in four parts, section 5). It takes the place of the "three preset maps" step that was proposed for the catch-up.
3. **The Stage 0 run in SIM** (several maps, several decision policies). Then Stage 0 into the book, the class card sessions, Stage 0 in Foundry, Playtest 5.

Stage 0 does not need to be in the book first: SIM runs Stage 0 builds as data, which is the point (find the problems before writing them down).

## 2. What already exists (read these first)

- **The ruler** (`book/ruler/`, README.md): `spec.mjs` reads class builds (`rework/*.txt`: the four R builds, the classes of today) and fights (`fights.txt`) and writes `report.md`: turns, duels, Monte Carlo fights, the Reactions table, adventuring days. Seeded; `node book/ruler/spec.mjs --check` compares the simulation with the exact dice math and prints only "ok". `map.mjs` is its map model today: an open field (distances, Engaged, Cover drawn per shot, range, Flanking, Prone, Hindered, Immobilized). Since the catch-up (2026-11-12) `RULES` in spec.mjs defaults to the book today (`RULES_R`); the classes and rules before pack R are `classes/*.txt`, `fights-pre-r.txt` and `RULES_PRE_R` (`--pre-r`).
- **The cards** (`book/cards/*.json`, loaded by `book/cards/load.mjs`): every card of the book, one source for the book, Foundry and the ruler (pack CS). The Mithril cards carry their automation as data (the "After the damage" steps).
- **The Foundry system's pure code**, already loaded under Node by its 243 tests with small stand-ins: the dice (`foundry/twod12/module/calc.mjs`: exploding d12s, Doubles, Boons and Banes, Favored), the Bestiary (`config.mjs`: npcHm, npcDamage, roles and ratings), the effects' rules (`fxrules.mjs` compile), the durations (`effects.mjs` durationStep / pendingSteps), the movement limits, the Turn Log lines (`ticker.mjs`).
- **Real play to compare with:** the Encounter Log's Copy (`foundry/twod12/module/enclog.mjs` exportText: "OC - Charge 4, WA vs DP T3; ...", by Round, with the abbreviations) and the playtest logs (`book/playtest-3.md`, `book/playtest-4.md`).

## 3. Before SIM: the ruler catch-up, rules part: DONE (2026-11-12, branch `pack-ruler-catchup`)

What was asked, and where it is now (the detail and the before / after numbers: `book/ruler/README.md`, "The catch-up"):

- ~~`calc.mjs` as Foundry has it: flat Boons and Banes and the new Favored.~~ The ruler has no copy: it imports the system's `calc.mjs`. Its reports were older than the change; all re-run. `spec.mjs rollDice` rolls one roll die by die with the system's `bbFive`, `keepThree` and `tierOf`.
- ~~`map.mjs`: Flanking's cancels then the limit of 2, High cover Doomed, the Field limit.~~ Done, with the system's `bbCount` for the limit.
- ~~`rbestiary.mjs`: the NPC Modifier ratings.~~ Done in `spec.mjs npcOf`, with the system's `npcModRatings` / `npcModValue` (data.mjs).
- ~~**Pack R's rules as the default.**~~ Done: `RULES` = `RULES_R` (4 AP + 1 Reaction AP, the unused AP's Guard, Escalation as a level with Momentum, the NPCs' Specials, Elite Escalation, Opportunity Attack for every creature).
- ~~`report.md` regenerated; the README's results marked "before / after the catch-up".~~ Done.

### What SIM-1 should know

1. **The gate is `book/ruler/report.md` as committed on `pack-ruler-catchup`:** `node book/ruler/spec.mjs --quiet` writes it again byte for byte (seeded; about 3 minutes), and `node book/ruler/spec.mjs --check` prints only "ok". Its headline rows (the R builds, level 1, the open field): 4 Standards 3.8 rounds, 14% of the party's Health lost, a PC Down in 25%, won 99%; 5 Standards 4.8 rounds, 27%, won 90%; 6 Standards 5.8 rounds, 46%, won 73%; the Standard day cleared 93%.
2. **The rules the ruler takes from the system (import them, don't copy them):** `calc.mjs` (tierProbs, critProb, bbCount, bbFive, rollState, keepThree, tierOf), `config.mjs` (npcHm, npcDamage, npcRoles with `ap` and `cv`, npcSpecial, apPerTurn, reactionAp, guardPerAp, escalation, stageOf), `data.mjs` (npcModRatings, npcModValue; it needs two stand-ins for Foundry's globals: the top of spec.mjs), `guard.mjs` (guardPerAP), and the cards (`book/cards/load.mjs`).
3. **Rules that live only in the ruler (SIM-only today, to move into pure system functions):** the turn loop and Frequencies (`runTurn`), the NPC's turn (`kitSeq`: Encounter Special, Round Special, Basic attacks), Elite Escalation and phases, the Escalation hooks, the Reaction moments (Opportunity Attack, Overwatch, Rebuke, the blocks: inside `fight()`), the unused AP's Guard at the start of the next turn (Foundry: `combat.mjs unusedApGuard`, not pure to import yet), Momentum in `day()`, the map's Boons and Banes (`map.mjs mapMods`, `flankBoons`), the conditions (`map.mjs applyCondition`).
4. **Decisions hidden in the ruler that are policies, not rules (SIM-3):** a PC keeps its Reaction AP for its class Reaction and makes an Opportunity Attack only with an AP to spare (`RULES.oaPolicy`; taking every Opportunity Attack loses Health); a PC's Reactions fire on their first trigger; every PC follows its file's plan and spends every AP (so the unused AP's Guard is worth nothing here); the Double Shot Archer's `Kite` turn has no step, so it shoots while Engaged; the NPCs choose the PC they can strike most; nobody leaves an enemy's side, so the NPCs' Opportunity Attack never fires.
5. **Found by the catch-up:** a creature has no Reaction AP before its first turn of the encounter (the book and Foundry; the ruler gave one from the first moment). It removes about a quarter of the PCs' Reactions and moved the Reactions' worth most (README). The Bestiary's Stage 3 Health fit moved (1.22 → 1.14): `book/ruler/bestiary-r-refit.json`, a question for Lucas; the book's tables are unchanged.
6. **Not reproducible any more, kept as records:** `rework.md`, `rework-sheet.md` (pack R's prep) and `bestiary.md` (pack E3): their scripts name cards, builds and tables that later packs replaced. SIM doesn't need them.
7. **Still not there** (section 6): High cover is in `map.mjs` but the open field draws none; Cover on Saves; a ranged NPC's Opportunity Attack; the class cards' Pressure and Support names (no card has one yet); Stage 2 and 3 builds on the Modifier track (they come with the Stage 0 run).

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
| SIM-1 | **DONE (2026-11-12, v0.0.365, branch `pack-sim-1`).** The shared engine: the rules SIM needs pulled into pure system functions with tests; SIM's turn loop on the open field. Built: `book/ruler/sim/` (`core.mjs`, `turn.mjs`, `engine.mjs`, `policy.mjs`, `run.mjs`, README), the system's `module/roundrules.mjs` with test t246, the fight's log | `report.md` reproduced on the open field (the gate in 4.2): **byte for byte, with report-pre-r.md, rclasses.md and rbestiary.md**; the system's 244 tests pass |
| SIM-2 | **DONE (2026-11-12, v0.0.366, branch `pack-sim-2`; areas and Zones on the grid finished after SIM-3, branch `pack-sim-areas`: `book/ruler/areas.md`).** Maps, Line of Effect and Cover, movement and Forced Movement, terrain, areas and Zones. Built: `book/ruler/maps/*.txt` (five maps and the open field), the map layer in `book/ruler/map.mjs`, the system's `module/gridrules.mjs` with test t247, `sim/maps.mjs` → `book/ruler/maps.md`, the viewer draws the maps. **Left:** Covering Fire's damage on entering and Rain of Arrows' Hazardous Terrain, a Line | the starter maps run; Speed and the movement conditions get a price above 0 where the map allows it: **yes** (`maps.md` section 2) |
| SIM-3 | **DONE (2026-11-12, branch `pack-sim-3`; no Foundry version).** Decision policies and the sensitivity report. Built: `sim/policy.mjs` (`makePolicy` switches: hold the line, kite, protect the back line, Encounter Actions in round 2, react to the first trigger, no focus fire; the mixes `tactical` and `casual`; the enemies' `weakest`, `nearest`, `back`), `sim/policies.mjs` → `book/ruler/policies.md`, the viewer's "Party plays" selector | each headline number under 2 or 3 policies: **yes, 8 party policies and 4 enemy policies on 3 maps** |
| SIM-4 | **DONE (2026-11-12, branch `pack-sim-4`; no Foundry version): `sim/enclog.mjs` (the system's own Encounter Log export, fed with SIM's events; `run.mjs --playtest`), `sim/playtest4.mjs` → `book/ruler/playtest-4-sim.md`, the comparison in `sim/README.md`.** The replay viewer (**its first version is built, 2026-11-12, at Lucas's request: `book/ruler/sim/fights.html`, written by `view.mjs`; it grows with each part**) and the Encounter Log output; Playtest 4 replayed | a fight can be watched; the Playtest 4 comparison is written in SIM's README |

### After SIM-1: what SIM-2 should know

1. **Start from `book/ruler/sim/README.md`** (the files, the gate, the rules imported from the system, the list "SIM-only rules, to move into the system", what the policy decides and what the engine still decides).
2. **The gate is now exact:** after any change, `node book/ruler/spec.mjs --quiet`, `--pre-r --quiet`, `rclasses.mjs` and `rbestiary.mjs` must leave `git status` clean on the open field, unless the change is a rule or a decision on purpose (then the README says which). `--check` prints only "ok"; the system's tests (244) pass.
3. **The map is still `book/ruler/map.mjs`** (an open field with Cover drawn by chance per shot). SIM-2 replaces it: a grid with walls and terrain from `book/ruler/maps/`, Line of Effect and Cover by corners (the system's `cover.mjs` and `flanking.mjs` read tokens and the canvas: their geometry needs a pure core, as `roundrules.mjs` did for the counts), and a `map <name>` line per fight. The engine reaches the map only through `MP` (`core.mjs`): `mapMods`, `walk`, `force`, `place`, `adj`, `dist`, `threatens`, `engaged`, `applyCondition`.
4. **Movement decisions are still inside `engine.mjs`** (`pcMove`, `approach`, `npcTurnMap`): they move to the policy with the maps.
5. **The pure pieces of the system not used yet:** `effects.mjs durationStep` (durations), `guard.mjs absorbGuard` (Guard over two pools), `ccdamage.mjs creatureDamageLines` (Resist / Weak / Immune), `enclog.mjs exportText` (the log's playtest format, SIM-4).
6. **The log** (`fight(..., { log: true })`, `sim/run.mjs`) has turns, moves, Actions, attacks, Reactions, Down; it lacks each roll's Boons and Banes, conditions, heals and Guard (SIM-4 adds what the viewer needs).

### After SIM-2: what SIM-3 should know

1. **`book/ruler/maps.md` is read with the plan policy in mind.** On a map nobody holds a chokepoint or steps behind cover, the melee PCs walk to the nearest enemy wherever it stands, the R Archers' turns have no step (they move only when they can target nobody). Every map costs the party more Health than the open field under this policy; how much of that is the map and how much the policy is SIM-3's first question.
2. **Where the decisions are:** `sim/policy.mjs` (targets, turns, heals, Reactions, an NPC's choice) and, still inside `sim/engine.mjs`, movement: `pcMove`, `approach` (a Charge when it can; on a map a ranged PC's move to see), `npcTurnMap`. They move into the policy first.
3. **The map layer's helpers for a policy:** `MP.coverOf` / `canTarget` (Line of Effect), `MP.gap` and `MP.nearest` (the way there around walls), `MP.sightScore` (a square's worth for a shooter), `MP.walk` with a score or a goal.
4. **Left from SIM-2:** areas and Zones on the grid (so Consecrated Ground, Covering Fire and Rain of Arrows are still priced as on the open field), Hazardous Terrain, Large creatures, elevation, light and Senses, a Slide's Collision; Threatening and Engaged ignore walls.
5. **The gate still holds on the open field** (report.md unchanged). A new policy changes the numbers on purpose: report each headline number under the plan policy and the new ones, side by side.

### After SIM-3: what SIM-4 and the Stage 0 run should know

1. **A number is now a range.** `book/ruler/policies.md`: the normal fight costs 9 to 20% of the party's Health by how the party plays (the plan: 14%), and a PC goes Down in 21% to 50% of them by how the enemies choose targets. The Stage 0 run reports each headline number under the plan, tactical and casual party policies and under the plan and focus-the-weakest enemy policies, and fits the Bestiary's row knowing which one the target means (a question for Lucas: rules-backlog "SIM-3").
2. **Not built as policies:** a Rally Point a PC spends on itself by choice, cover-seeking (a shooter stepping behind a pillar), holding a chokepoint by its place on the map (hold the line waits where it stands), per-creature policies in one party (the option is per side).
3. **Areas and Zones are on the grid** (2026-11-12, after SIM-3): `book/ruler/areas.md`. A Zone works only for who stays in it, so the Area cards are read with the hold-the-line policy beside the plan; the cards' ruler-line numbers (how many creatures an Area holds) are right for a normal fight and low for 6 enemies.
4. **SIM-4:** the log has what the viewer needs (`hold`, `help`, `collision` since SIM-2 and 3); the Encounter Log's playtest format (`foundry/twod12/module/enclog.mjs exportText`) and Playtest 4's replay are its work.

### After SIM-4: what the Stage 0 run should know

1. **SIM's "damage dealt" counts damage past an enemy's last point of Health** (about a quarter of what the party rolls against a mixed encounter). Compare classes by rounds, Health lost and win rates, or add a damage-that-counted number, before reading "damage a turn" rows as a class's worth.
2. **The plan policy's target choice wastes hits on Minions** ("closest to dying"); the table ignored them. A `focus` that weighs overkill and the enemy's threat is the first policy to add (`sim/policy.mjs`: `minionsLast` is a start).
3. **Against the one table fight there is, nothing else disagrees** (rolls a turn, the enemies' damage, the dice): `book/ruler/playtest-4-sim.md`. One fight is a small sample.

## 6. What the ruler still lacks (the README's "not modeled" lists), and where it goes

| Missing | Where |
|---|---|
| ~~The current rules (flat Boons and Banes, Favored, Flanking, High cover, the Field limit, NPC Modifier ratings, pack R's AP as the default)~~ | **done: the catch-up (section 3)** |
| Stage 0: levels 1 to 3 on `book/decisions-s1.md`'s level lists, no Talents; Escalation 1 to 6 with Momentum 0 to 4 | the Stage 0 run, after SIM |
| ~~Walls and Line of Effect, Difficult Terrain, Collision~~ (**done: SIM-2**; Speed and the movement conditions priced by map: `book/ruler/maps.md`). Still: Large creatures, elevation, a Slide's Collision | SIM-2 (left) |
| ~~Areas that last (Consecrated Ground, Covering Fire, Beacon's Aura) and an Action's area on the grid~~ (**done 2026-11-12**: `book/ruler/areas.md`). Still: Covering Fire's 1d4 on entering, Rain of Arrows' hazardous terrain | left |
| Resist, Weak, Immune | SIM-1 (the system's `creatureDamageLines`) |
| NPC Saves, so the Boon on Saves (Shield of Faith 3 and Aura of Protection 3 read "under" for it) | SIM-1 |
| NPC special Actions (the Bestiary's), the Elite's phases | SIM-1 |
| Body and Mind as two pools (Vigor and Resolve) | SIM-1 |
| Rally Points a PC spends on itself | not built in SIM-3 (only the builds' `when self below` turn) |
| Riders: Lock & Loose's and Pinning Shot's, Vanish's Bane on the first Strike, True Shot, Rolling Shot, Hand of Mercy, Long Draw | SIM-1 / SIM-2 |
| Senses and Light: Darkness, Dim, Blinded, Hearing | SIM-2 (a map's light) |
| The pack AU conditions as the Bestiary uses them: Frightened, Taunted, Sickened, Staggered, Dazed, Grabbed, Bleed | SIM-1 |
| Reactions in the 4 + 1 AP economy: **measured in the catch-up** (report.md's Reactions table; README: the Reaction AP is worth half the normal fight's cost, Opportunity Attack still about 0 because the class Reaction is the better use of the one Reaction AP). Which Reaction to take, and when, is a decision | SIM-3 |
| ~~A check against the table~~ | **done: SIM-4** (`book/ruler/playtest-4-sim.md`) |

## 7. Not in SIM (for now)
Base building, mounts and vehicles, the expedition loop between fights (Alert, the Parting Beat), Skills and Magic (D3, D4), destructible terrain (with B2), Stage 1 and later (the same engine runs them when their cards exist).

## 8. Questions for Lucas (defaults in brackets; answer by exception)
1. Where SIM lives [`book/ruler/sim/`, Node only, no new dependencies; the viewer one HTML file with no build step]. **SIM-1 took the defaults of 1, 2 and 5 (Lucas, 2026-11-12: "proceed with SIM-1"); the gate came out exact, not within 3%.**
2. Who builds it [Fable, from this brief; Claude Code does the ruler catch-up first and reviews SIM-1's engine against the system's tests].
3. The first maps [the six of 4.3; Lucas draws more later as text files].
4. The decision policies to start with [focus the weakest, protect the healer, kite, casual].
5. The gate's noise [within 3% of today's `report.md` on win rate and rounds, on the open field].
