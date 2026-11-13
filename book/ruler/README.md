# The ruler (for the class and Bestiary numbers)

## The PC budget (2026-11-13)

`sim/pcbudget.mjs` writes `pc-budget.md`: what a PC's Actions, the riders it puts on enemies, its Reactions and its helps are worth, in points of a plain PC's turn (three Weapon Attacks = 100; 0 = a PC that deals no damage; the scale is the party's cost). The guide for the card sessions is `book/cards/README.md`, "The PC budget". `prices.md`, `rclasses.md` and `worth.json` are older (before pack R's 4 AP or pinned to `RULES_R`): not for new cards.

## The Bestiary's turn budget (2026-11-12): enemies that do more than damage

Until this pack the ruler's enemies only dealt damage. Now an NPC can carry its own Actions and a Reaction, built on the Bestiary's price list (the system's `config.mjs npcBudget`; `sim/budget.mjs`: `npcBuilt`, `actionPoints`, `riderPrice`, `pointsExpr`, `bestTurn`), and the engine (`sim/engine.mjs`, the block "the Bestiary's turn budget") runs them: riders on a hit, in the Setup or on Tier 3 only; Forced Movement with Collision (pushed only when it hurts; `RULES.forcedUse "always"` to push every hit); the conditions on PCs (the PCs' own rolls through `roundrules.mjs rollerConditionMods` and `vulnerableBoons`, an enemy's Bleed staunched for 1 AP); Reactions (`struck`, `allyHit`, `allyStruck`, `approach`; 1R and 2R); helps (Boons on the allies' next attack, a heal); Save Actions and Actions that hit several creatures. **An NPC without `acts` turns exactly as before:** `spec.mjs --check` prints "ok" and report.md is unchanged.

| Script | Writes | What |
|---|---|---|
| `sim/calib.mjs` (`calibLib.mjs`) | `budget.md` (about 16 minutes) | the calibration: every price as a worth in points of a Medium Standard's turn, today's damage-only Standard the yardstick |
| `sim/stage0fx.mjs` (called by `stage0.mjs`), `sim/designs.mjs` | `stage0.md` sections 9 to 12 | the fights with enemies that use effects, the four Ranks, the six Roles, the Grunt and the Minion settled |

**Reports that changed on purpose:** `stage0.md` (sections 9 to 12 new) and `budget.md` (new). The prices and what was decided: rules-backlog.md, "THE BESTIARY'S TURN BUDGET: APPLIED".

## Stage 0 into the book (2026-11-12): what the ruler runs now

The book changed (Chapters 2, 3, 5, 6, 14, 15: rules-backlog.md, "STAGE 0 INTO THE BOOK: APPLIED") and the ruler followed. Each rule went into the system's pure modules first (`foundry/twod12/module/roundrules.mjs`, the Stage 0 block; `config.mjs npcStage0`), then into the engine's rule sets (`sim/core.mjs`):

| Rule set | What it is | Who uses it |
|---|---|---|
| `RULES_BOOK` (**the default**) | The book today for the classes as their cards are written: pack R's rules, **no Opportunity Attack** for anyone, **a [Ranged] Action while Engaged is Doomed**, the new weapon table (the class files' `weapon` lines: Greatsword 0 / 5+1d6 / 8+1d8, Crossbow 0 / 2+1d4 / 4+1d4). The Escalation ladder is still 1 to 3, because the class cards are | `spec.mjs` (report.md), `sim/run.mjs`, `sim/view.mjs` |
| `RULES_S0` | `RULES_BOOK` + **Escalation 1 to 6** and **Momentum 0 to 4** (a day's fights start at Escalation 1 + Momentum) | `sim/stage0.mjs`, `sim/stage0fit.mjs` (through `sim/stage0lib.mjs`), with the Bestiary's Stage 0 table and the builds cut to the Stage 0 level lists |
| `RULES_R` | Pack R's rules as they were until 2026-11-12 (an Opportunity Attack for every creature, 2 Banes, the old weapon table through `WEAPONS_R`) | The studies of that time, which pin it: `maps.md`, `policies.md`, `areas.md`, `playtest-4-sim.md`, `reactions.md`, `rclasses.md`, `rbestiary.md` (their scripts still write them byte for byte; checked for playtest-4-sim.md and reactions.md) |
| `RULES_PRE_R` | The book before pack R | `report-pre-r.md` and the pre-R studies |

**When the class cards are written for Stage 0** (the card sessions), `RULES` becomes `RULES_S0` (one line in `sim/core.mjs`) and report.md's party becomes the Stage 0 builds; until then `stage0.md` is the report for levels 1 to 3 and report.md is the pack R party under the rules that changed for everyone.

**Reports that changed on purpose:** `report.md` (the default rule set and the weapons: the normal fight 3.7 → 3.4 rounds, 14% → 13% of the party's Health, a PC Down in 24% → 22%; the deadly fight won 74% → 77%; the section "Reactions in the 4 + 1 AP economy" is gone with the basic Opportunity Attack) and `stage0.md` (written again by the new `sim/stage0.mjs`; the prototype's report and script are in `archive/ruler-old/stage0-prototype/`). `node book/ruler/spec.mjs --check` prints "ok".

**The Bestiary's Stage 0 table** (`node book/ruler/sim/stage0fit.mjs`, then `stage0.md` sections 2 and 3): over pack R's first row the normal fight lasts 3.5 rounds with Health × 0.93 to 1.04 (the melee weapons deal more now, so the placeholder's × 0.90 was too low); for damage the two targets still don't meet (× 0.61 to 0.81 for "costs a fifth", × 0.93 to 0.97 for "a Down in 1 fight of 5"). **Chosen: Health × 0.95 (a Standard 30 + 30 = 60) and damage × 0.75**, written as ready numbers; `stage0fit.mjs h,d` measures another pair.

**After Lucas's answers (the same day; rules-backlog.md, the top entry):** a Standard's Medium 2 AP Special half a step up (4 + 1d6 / 8 + 1d8), **a Grunt 3 AP** (`npcStage0.grunt.ap`), **a Minion dies to any damage** (`oneHit`: a pool of 1 in the engine), **an Elite on the 1-to-6 ladder** with its abilities at 2, 4 and 6 (`RULES_S0.eliteMax`, `eliteRungs`; `RULES_BOOK` keeps 1 to 3 with the rest of the old ladder, so report.md didn't move). `stage0.md` was written again: with no Momentum the normal fight is 3.4 to 3.5 rounds, 10 to 13% of the party's Health (25 to 30% with the Rally Points), a PC Down in 8 to 10%; the deadly fight is won 76% at level 1 and 87 to 88% at levels 2 and 3; eight Grunts cost what four Standards do or a little less.

## The catch-up (2026-11-12): the ruler runs the book's rules today

Until this pack the ruler's default was the book before pack R (5 AP, no Reaction AP, Escalation spent), and the dice the book had before
2026-11-08. Now **the default is the book today**, as `book/rules-src` and the Foundry system have it. Nothing in the book or the cards changed.

**What changed in the ruler**

| Rule | Before the catch-up | After (the book, Foundry) | Where |
|---|---|---|---|
| Boons and Banes | each 1d3-1, no cancelling | flat +1 / -1, they cancel; 5 or more left = Favored / Doomed | the system's `calc.mjs` (the ruler always read it; its reports were older than the change) |
| Favored | the two highest; only the kept pair is Doubles | any pair of the three is Doubles; three of a kind a Critical | `calc.mjs` |
| Named Boons and Banes | every one added up | Field ones up to 2 a side (Cover, shooting into a melee, Prone, Flanking); range and Engaged have no name and add on top | `map.mjs mapMods`, with `calc.mjs bbCount` |
| Flanking | up to 3, then the cancels | the cancels first, then 2 at most | `map.mjs flankBoons` |
| High cover | not there (Cover was 1 or 2 Banes) | the roll is Doomed, no Field Banes from the Cover (`map cover 2% 3`; the open field's default draws none) | `map.mjs`, `spec.mjs` |
| A Critical | 1 Tier 3 in 12 | the exact share of the roll's Tier 3s (`calc.mjs critProb`: Doubles on a Tier 3, 20 over the Defense, three of a kind) | `spec.mjs` |
| NPC Modifiers | ceil(Body / 2 + 1) | a rating of the role's table (Weapon Medium, Power Low; a Standard's Power Medium; a `power` NPC leads with Power); `wmod-high`, `pmod-low` in fights.txt. The same numbers at the defaults | `spec.mjs npcOf`, the system's `data.mjs` |
| AP | 5, no Reaction AP (the `rework/*-r1.txt` scripts switched pack R on) | **4 AP + 1 Reaction AP** for PCs and NPCs (Minions 3 + 1), gained at the start of the turn: **none before a creature's first turn of the encounter** | `spec.mjs RULES` (= `RULES_R`; the old set is `RULES_PRE_R`) |
| Unused AP | nothing (pack R's scripts: Guard 2 from the turn's end to the next turn) | Guard 2 / 3 / 4 by Stage for each AP still unused **when the next turn starts**, for 1 round; a kept AP can pay a Reaction and then gives none | `spec.mjs` (`guardAt "next"`), the system's `guard.mjs` |
| Escalation | spent, from 0 | a level from 1 (2 with Momentum, which only the next encounter uses), +1 a round, on a Critical and on the class's hook; nothing spends it | `spec.mjs RULES`, `day()` |
| Opportunity Attack | a Talent (a class file's line), against a creature you threaten; NPCs: Elites only, paid from the next turn | every creature has it (1R, an adjacent enemy that leaves a square with a Move Action or stands up; a ranged weapon shoots with Engaged's 2 Banes); an NPC needs its Reaction AP | `spec.mjs` (`oaAll`) |
| NPC turns | its Bestiary Strikes (2 for a Standard) | every AP left after moving: the Encounter Special once, the Round Special, Basic attacks (config.mjs `npcSpecial`); Elite Escalation and phases | `spec.mjs npcOf` (`kit`), `kitSeq` |
| The party | the 5 AP classes of `classes/` | the four R builds of `rework/` (now with their sheet's `vigor` / `resolve` and `hook` lines) | `fights.txt` (the old one: `fights-pre-r.txt`) |

**Which report runs which rules**

| Report | Script | Rules | State |
|---|---|---|---|
| `report.md` | `spec.mjs` | the book today; the R builds | regenerated: a new report (before: the 5 AP classes) |
| `report-pre-r.md` | `spec.mjs --pre-r` | before pack R, with today's dice and map; the 5 AP classes | new file: what the old report.md is now |
| `rclasses.md`, `worth.json` | `rclasses.mjs` | the book today (`RULES_R`) | regenerated |
| `rbestiary.md` | `rbestiary.mjs` | the book today over the pre-R tables it fits | regenerated. **Its Stage 3 Health fit now differs from the book's tables:** written to `bestiary-r-refit.json` as a proposal; `bestiary-r.json` (the book's tables) is untouched |
| `positions.json`, `prices.md`, `progression.md` | `positions.mjs`, `econ.mjs`, `progression.mjs` | before pack R (`RULES_PRE_R`, pinned in each script: they study the 5 AP classes), today's dice and map | regenerated; they hardly move |
| `rework.md`, `rework-sheet.md` | `rework.mjs` | pack R's prep | **kept as the record of 2026-11-04**: the script names cards and builds that pack R-classes replaced (it stops at "Elusive"), so it can't write them again |
| `bestiary.md` | `bestiary.mjs` | pack E3's refit | **kept as the record of 2026-10-29**: it refits the Bestiary of that day, which the refit itself replaced |

The reports as they were are in `archive/ruler-old/before-catchup/`. The hand-written scripts of 2026-10-24 (`ruler.mjs`, `levels.mjs`, `defense.mjs`...) are the 5 AP level 1 arithmetic and stay as they are.

### Before / after: what moved, and why

**1. The dice and the map rules alone move almost nothing** (the 5 AP classes, old report.md against report-pre-r.md): every turn within 0.1 damage, every fight within 2 points (4 Standards: 4.0 rounds, 20% Health lost, a Down in 24% → 26%; 6 Standards 61% → 60%, won 65% → 66%), the Standard day cleared 57% → 60%. A flat Boon is worth the same as the old one on average (+9% of the roll, 0.50 → 0.51 DE); **Favored is worth more: +35% → +37%** (any pair is Doubles). The Field limit takes 0.03 Banes off an average Archer shot (1.53 → 1.50: Cover, into melee and Prone seldom pass 2 together), and Flanking's limit of 2 never matters with 2 melee PCs (0.20 Boons a Weapon Action, as before). The prices of positions and conditions move by less than their own noise (the largest: Prone on a Paladin 6.6 → 6.3 DE).

**2. The current classes under pack R** (rclasses.md: the same builds and rules before and after; what changed is the Reaction AP's start, the Guard's timing, the dice):

| The four R builds, level 1 | Before | After |
|---|---|---|
| 4 Standards (normal) | 3.6 rounds · 12% lost · Down 21% · won 100% | 3.7 · 12% · Down 22% · won 99% |
| ... damage the party takes | 52.8 | **59.2** |
| 6 Standards (deadly) | 5.6 · 36% · Down 58% · won 82% | 5.7 · **42%** · Down **66%** · won **77%** |
| 2 Elites + 2 Standards (deadly) | 5.9 · 33% · Down 55% · won 86% | 5.9 · 33% · Down 58% · won 87% |
| Reactions a fight: Smite Paladin / Lay On Hands Paladin | 2.16 / 2.63 | **1.59 / 2.17** |
| The turns (Smite Paladin Main 26.0, Apex 34.2; Double Shot Archer Main 28.6) | the same | the same |

**Why: a creature has no Reaction AP before its first turn of the encounter** (Chapter 2: it is gained when you regain AP; Foundry does the same). The ruler gave everyone one from the first moment, so a PC that rolled low on Initiative reacted to the NPCs' first advance. That was about a quarter of all Reactions: with a Reaction AP from the first moment the normal fight costs 12% with a Down in 19%, without it 13% and 23% (report.md, "Reactions in the 4 + 1 AP economy").

**3. Reactions in the 4 + 1 AP economy** (the numbers that moved most):

| Reaction's worth (AP a turn of its owner; the floor for a 1R Reaction is 1) | Before | After |
|---|---:|---:|
| Shield of Faith | 0.90 | **0.75** |
| Rebuke (with its Push and Frightened) | 0.48 | **0.34** |
| Bulwark of Faith as it was | 0.75 | 0.60 |
| Overwatch | 1.04 | **0.75** |
| Covering Shot | 1.37 | **1.05** |
| Quick Draw (the stand-in) | 0.69 | 0.52 |
| Opportunity Attack as a Paladin's only Reaction | 0.33 | 0.26 |

- **The Reaction AP is the most valuable AP of the round.** Take the class Reactions away and the normal fight costs 25% of the party's Health instead of 13% (a Down in 42% instead of 23%, 4.2 rounds instead of 3.8); the deadly fight is won 46% of the time instead of 71%. With no Reaction AP at all (a Reaction paid only with a kept turn AP) the result is the same as with no Reactions: nobody keeps a turn AP for one.
- **Opportunity Attack is still worth about nothing, for a new reason.** Before pack R the Paladin spent all 5 AP and never had one left (the README's "worth 0"). Now every PC has a Reaction AP, and a better Reaction for it. A PC that makes every Opportunity Attack it can (0.3 a fight, 1.8 damage) **loses more than it gains**: its class Reaction misses the AP (the normal fight 13% → 15% of Health, a Down 23% → 25%; the deadly fight 46% → 48%). So the ruler's PCs keep the Reaction AP for the class Reaction and make an Opportunity Attack only with an AP to spare (`RULES.oaPolicy "spare"`; `"first"` is the other row): they make none. As a PC's only Reaction it is worth 0.26 AP a turn (it fires 0.7 times a fight for a Paladin).
- **The NPCs' Opportunity Attack never fires** (0.00 a fight): melee PCs don't walk away from an enemy, the Rolling Shot Archer Evades, and the Double Shot Archer's `Kite` turn has no step (it shoots while Engaged, about 1.2 shots a fight with the 2 Banes). Its cost is hidden in what the PCs don't do. A decision policy that moves more (SIM-3) will price it.
- **The unused AP's Guard is worth about nothing in these builds:** the Paladins spend all 4 AP; the Archers leave 0.7 AP a fight (turns cut by a move or a missing target), most of it then pays a Reaction, and what is left gives 0.2 to 0.3 Guard a fight, almost never used. Taking the rule away changes no number. Its value is as an option (a turn with nothing good to do), which a plan-following ruler doesn't have.
- **The mercy Passives are worth a little more** because the party takes more: Font of Mercy 0.23 → 0.28 AP a turn, Mending Light 0.67 → 0.70, Hallowed Stance 0.54 → 0.61.

**4. The Bestiary's fit** (rbestiary.md; the book's tables are unchanged):

| | Before | After |
|---|---|---|
| The normal fight at the book's tables (the party with the reserve) | 3.4 rounds · 12% lost · cost 18% · Down 19% | 3.5 · 13% · cost **21%** · Down **22%** |
| The cost reaches 25% at d = | 0.81 | 0.74 |
| A Down in 10% of the fights at d = | 0.62 | 0.58 |
| The Stage 1 damage factor (the knee) | × 0.70 | × 0.70 (kept) |
| The Elite factor | 1.01: × 1.00 | 1.02: × 1.00 (kept) |
| Stage 2 Health fit | 1.07: today's rows kept | 1.02: kept |
| **Stage 3 Health fit** | 1.22: **× 1.20** (in the book) | 1.14: under the script's own rule ("within 15%: today's rows kept") **× 1.00** |

The normal fight is 3 points dearer than when the Bestiary was fitted and still inside the target ("about a fifth, a Down in about 1 fight of 5"). The Stage 3 row is the one disagreement the catch-up found between the ruler and the book: a question for Lucas (the Stage 2 and 3 party is a model, with no Stage 2 or 3 cards yet).

**5. report.md is a new report** (the R builds; the old one was the 5 AP classes): 4 Standards 3.8 rounds, 14% of the party's Health, a PC Down in 25%; 5 Standards (hard) 4.8 rounds, 27%, Down 46%, won 90%; 6 Standards (deadly) 5.8 rounds, 46%, Down 69%, won 73%; 2 Elites + 2 Standards 6.0 rounds, 39%, won 81%. The Standard day (easy, normal, normal, hard) is cleared 93% of the time with 57% of the Rally Points left; the short hard day 76%. For scale, the 5 AP classes against the pre-R Bestiary: 4.0 rounds and 20%; 6 Standards 61%, won 65%; the Standard day cleared 57%.

**What SIM-1 should know** is in `book/sim-brief.md` section 3. **Not modeled** is unchanged (the map's lists below; `book/sim-brief.md` section 6): walls, terrain, Senses, Resist / Weak, NPC Saves and special Actions, Vigor and Resolve as two pools, a ranged NPC's Opportunity Attack, Cover on Saves, High cover on the open field, the class cards' Pressure and Support names (none is written on a card yet, so every card Boon and Bane adds up).

## The spec-driven ruler (2026-10-29): `spec.mjs`

Describe a class build in a plain file (`classes/*.txt`: its numbers, Actions with AP, Frequency, traits and Tier results, passives,
the turns it can take and its plan by round) and the fights in `fights.txt`; one script writes the whole table to **`report.md`**:

- each turn's damage against Defense 12 to 14 (Monte Carlo, at the Escalation the turn needs, and at Escalation 3), the best turn,
  and the turn's AP and Strikes, with the rules checked: at most 4 AP (`RULES.ap`; 5 before pack R) and 3 Strikes, At-will Banes, Round / Turn / Encounter Frequency,
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
node book/ruler/spec.mjs            # the book today: rework/*.txt and fights.txt; writes report.md and prints it (about 3 minutes)
node book/ruler/spec.mjs --quiet    # writes report.md only
node book/ruler/spec.mjs --check    # the simulation against the exact dice math (calc.mjs); prints only "ok" (about 1 minute)
node book/ruler/spec.mjs --pre-r    # the classes before pack R: classes/*.txt and fights-pre-r.txt under RULES_PRE_R; writes report-pre-r.md (about 5 minutes)
```

It uses the system's own code, one copy of each rule: the dice (`calc.mjs`: exploding d12s, Doubles, flat Boons and Banes that cancel, the limit of 2
for named ones, 5 or more left = Favored / Doomed, Favored's any pair and three of a kind), the Bestiary (`config.mjs` npcHm, npcDamage, the roles
and ratings, the Special multipliers, the AP), the NPC Modifier ratings (`data.mjs` npcModRatings, npcModValue) and the unused AP's Guard (`guard.mjs`).
Random numbers are seeded, so the same files give the same report. **`--check`** rolls the dice one by one (`rollDice`) against the exact odds,
checks the map's Boons and Banes against the book's examples (`mapChecks`: Flanking, the Field limit, High cover) and one Weapon Attack of every
build against the exact math.

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
| `vigor`, `resolve` | `vigor 23` · `resolve 12` | Pack R's sheet (the catch-up): the Health thresholds as the sheet shows them (Chapter 4: the class's Stage line + the species). With them Rally Points = the Rally value + the Stage. Without them: the `health` line's old formula |
| `hook` | `hook ally` · `hook quarry` | The class's Escalation hook (the Paladin: an ally within 5 squares becomes Bloodied or goes Down; the Archer: its Marked Quarry goes Down) |
| `no-opportunity` | | It never makes the basic Opportunity Attack (every build has that Reaction without a line, while `RULES.oaAll`) |
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
`1 elite, 2 standard high` (a rating after the role, Medium by default; `ranged` for a ranged Basic attack, `speed-6` for another Speed, `power` for a Ward Defense attacker, `wmod-high` / `pmod-low` for a Modifier's rating). The map model's settings: `map on` / `map off`, `map start 8`, `map back 2`, `map cover 5% 2, 15% 1` (`3` is High cover: Doomed), `map npc-reactions elite` (only before pack R: now every creature has the Opportunity Attack) (map.mjs `MAP`). Days: `day-runs 1000`, `day <name>: <fight> | <fight> | ...` and
`day-party <name>: paladin-smite-1, archer-1, ...` (class file names; the NPCs use the party's level). A Daily Action is kept for a hard fight (CV 1.25 or more per PC) or the last fight of the day. `party` takes file names too. NPCs are the Bestiary's at that level with Foundry's default
ratings (Body High, the rest Medium): a Standard has 57 Health, Defense 13, Modifier +2. What the fight leaves out: Rally Points used by the PCs themselves, NPC special Actions, Body and Mind as two pools,
and (with `map on`) walls, Difficult Terrain, elevation and Large creatures; with `map off`, all positions and Reactions.

### Results before the catch-up (2026-10-29; the classes before pack R, 5 AP, level 1 unless said; those tables today: `report-pre-r.md`)

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

### Adventuring days: Archer and Paladin compared (2026-10-29; before the catch-up: the classes before pack R)

`fights-pre-r.txt` (then fights.txt) has three days of 3 to 4 fights with no Rest (the Bestiary's CV: 1 per PC normal, 3/4 easy, 1 1/2 hard), run 1,000 times for
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

**A record, not run again (the catch-up, 2026-11-12):** `rework.md` and `rework-sheet.md` are as written on 2026-11-04. The script can't write them again: pack R-classes replaced the builds of `rework/` and the cards it names (it stops at the "Elusive" passive). Its "today" is `RULES_PRE_R`, and its rework pieces are the prep's models (Guard from the turn's end, a Reaction AP from the first moment, Opportunity Attack as a Talent).

`node book/ruler/rework.mjs` (about 5 minutes; `--quick` about 2) writes **`rework.md`**; the prep document that reads it is **`book/rework-r.md`** (its numbers part; the decision sheet is its section 14, from `--sheet` below). It runs the spec ruler with the map model under the rework's rules (book/playtest-2.md) and today's, side by side:
the 4 AP builds of **`rework/*.txt`** (the P1 and A1 builds with their turns cut to 4 AP and a Reaction each; the files of `classes/` are untouched, so report.md doesn't move) against the Bestiary at level 1.

**New in spec.mjs (all opt-in; the defaults are the book today):**
- **`RULES`** (an exported object a script sets per run): `ap` (AP a PC regains a turn, 5), `reactionAp` (AP a PC may spend only on Reactions, kept on top of what its turn left, 0), `escalation` (`spent`: an Active costs its Escalation, the book; `level`: an Active needs its Escalation and spends nothing, a passive works from its level, `(keep N)` is ignored), `npcAp` / `minionAp` (an NPC's AP a turn, 5 / 3; its Strikes keep 1 AP for moving), `npcReactionAp` (an NPC's Reaction AP: an Elite's Opportunity Attack costs it first, then its next turn's AP).
- **`reaction Name: block 1d8+[Mod]`** in a class file: a Reaction that takes that much off one NPC hit on the PC or an ally within 5 squares, once per NPC turn, paid with a kept AP (Shield of Faith as a 1R Reaction). `opportunity` and `quick-draw` as before.
- **Body and Mind pools:** `parseDamage` keeps the `[M]` parts of an expression (`mindShare`); a ruler string's `extra` or `surge` can say `mind` (`extra 2d8 mind next strike`: the Paladin's Holy riders in book/cards/paladin.json say it). The fight records each creature's Mind damage, the round an NPC becomes Bloodied (Body damage at its Body threshold) or Strained and the round it dies, the round a PC becomes Bloodied (NPC Basic attacks are Body), each PC's turns by Escalation level (`st.escTurns`), its turns while Bloodied, its Reactions' damage and what its block Reaction took off (`st.blockCredit`).

**What it measures** (rework.md's sections): 1 each build's turns at 5 and 4 AP; 2 the CV 4 fights rule by rule (PCs 4 + 1, NPCs 4 + 1, Escalation as a level); 3 the NPC and PC Health factors for 3.5 rounds and a third of the party's Health, and the fights by CV at them; 4 Escalation as a level: the turns at each level with and without Momentum, what each Passive and Active is worth, the Archer's Actives as Round or Encounter; 5 the Reaction AP: none, Opportunity Attack + Quick Draw, Shield of Faith as a block; 6 Overcast as the caster's Passive ladder (LV's stand-ins at levels 1 / 5 / 8); 7 Bloodied and Strained: the thresholds and when NPCs and PCs reach them; 8 Slowed priced at 5 and 4 AP, Minions at 3 and 2 AP; 9 the Standard day; 10 the Special multipliers' arithmetic. **The findings: book/rework-r.md.**

**Part 2, the decision sheet's numbers (2026-11-04): `node book/ruler/rework.mjs --sheet`** (about 6 minutes; `--sheet --quick` about 2) writes **`rework-sheet.md`**; book/rework-r.md section 14 reads it. New `RULES` switches in spec.mjs (all off by default, so report.md and rework.md don't move): `npcSpecials` (0 = the Bestiary's Strikes; else the scale of the Special multipliers: an NPC with a `kit` spends every AP left after moving on its Encounter Special once, its Round Special once a round, then Basic attacks with the At-will Bane, 3 Strikes; rework.mjs's `KIT`: Minions and Grunts 1 AP × 1.4, Standards 2 AP × 2.2, Elites that and 3 AP × 3.5), `apGuard` (Guard per turn AP left unspent, until the start of the PC's next turn, adding to other Guard; `st.apGuardGiven`, `apGuardUsed`, `apLeft`), `apGuardKeep` (those AP may still pay a Reaction, losing their Guard), `escHooks` (+1 Escalation once an encounter on a Critical, about 1 Tier 3 in 12, and on the build's `escHook`: `ally` = an ally within 5 squares becomes Bloodied or goes Down, `quarry` = its Marked Quarry goes Down; used only when it raises the Escalation; `st.hookCrit`, `hookClass`). `reaction Name: block 1d8+[Mod] spill`: the part of the block the hit doesn't use becomes Guard on the target (Stacking: the higher value). rework.mjs gives the builds the Stage Health line (`LINE`, `SPECIES`: Human, high on Vigor; Rally = Rally + Stage) with `{ line: true }`, and `START` sets the Escalation a fight starts with (part 2: 1, Momentum 2 in half the fights). **What it measures:** 1 an NPC's turn with its Specials; 2 the CV 4 fights adding the Health line, Escalation from 1 with the hooks, Guard and the Specials one by one; 3 the Escalation timing and the hooks; 4 Guard from unspent AP (with turns that hold an AP); 5 the Bestiary factors (NPC Health h for 3.5 rounds, NPC damage d for a quarter, 30% and a third of the party's Health, and for a Down in 1 fight of 10) and the fights by CV at them; 6 Shield of Faith's size; 7 the two dice-cut shapes (ceilings on Encounter dice, × 0.75 on everything); 8 the Health line at levels 1 / 5 / 8 against today's Stage rows, and the heal and Guard cards against the pools; 9 the Archer's Reaction (Quick Draw with 1[W], 2[W], Empowered, a Boon; Overwatch); 10 Divine Surge and Vanish as Escalation 1 Passives. A Reaction is priced by what it did itself (its damage, its block, its Guard used, `st.spillUsed`), not by the party's total damage (capped by the NPCs' Health in a fight to the death). Also new: `RULES.oaDisrupt` (a Critical Opportunity Attack stops the movement; on by default, off in the sheet: Lucas 2026-11-04), `reaction Name: overwatch` (a Trigger after an enemy within 10 squares makes a Strike, once per NPC turn) and `reaction Name: quick-draw with Quick Shot (+1 boon)` (the Action a Reaction makes).

## Pack R-classes (2026-11-04): `rclasses.mjs`, the rebuilt classes under pack R's rules

**After the catch-up (2026-11-12):** its rules are `spec.mjs RULES_R` (the default: the book today), so it now has no Reaction AP before a creature's first turn, the Guard when the next turn starts, the basic Opportunity Attack on every build (the "None" rows take it off) and the exact Criticals. What moved: the catch-up's table above (the Reactions' worth about a quarter lower).

`node book/ruler/rclasses.mjs` (about 4 minutes; `--quick` about 30 s) writes **`rclasses.md`**: the R builds of `rework/*.txt` (the Paladin and the Archer rebuilt by pack R-classes: a Hallmark Reaction, one Escalation Passive per rung, an Apex) measured with every piece of the rework on (`RULES`: 4 + 1 AP, Escalation as a level from 1 with the hooks, Guard from unspent AP, the NPC Specials, no Opportunity Attack disrupt) at the decision sheet's fit (NPC Health × 1, the Basic attack tables × 0.6; rework-r.md 14.2 item 3; since pack R-bestiary (2026-11-05) the live tables of config.mjs: RULES.bestiary "r", FIT d 1) and the Stage Health line: the turns, the normal / hard / deadly fights, each Hallmark Reaction's worth (its own damage, block or Guard a fight per turn of its owner), each Passive's worth (the wrath ones on the turn tables, since a fight to the death caps damage by the NPCs' Health; the mercy ones by what they did in the normal and the hard fight) against the rung budgets (item 15: rung 1 0.4-0.6 AP a turn, rung 2 0.6-0.8, rung 3 0.8-1), and each Apex in the fights with and without its turn. **The pre-R class files (`classes/*.txt`) keep the old cards' lines at their end** (the cards that pack R-classes changed), so `report.md` doesn't move: they are the 5 AP Paladin and Archer as they were.

**New in spec.mjs (opt-in, nothing moves):** a class file's own lines take `[PMod]` too (`[PMod+2]`, `[PModx2]`, `[PModx2+1]`); `extra ... each` (on every matching Action) and `... bloodied` (only against a Bloodied or Strained target); the start-of-turn passives `mend` (Mending Light) and `surge` (Divine Surge as a Passive); `mend` with `allies N` heals the N most hurt (Hallowed Dawn); `reduce ... always` (no "haven't left your square" clause); `vulnerable N round` (until the giver's next turn); `reaction Name: block 9 spill round ally` (`round`: once a round, `ally`: never on itself: Bulwark of Faith), `reaction Name: callshot` (Call the Shot, considered and dropped: Vulnerable 1 on your Marked Quarry when an ally damages it) and `reaction Name: ready` (Ready Shot: after an enemy's Strike within 10 squares, once a round, +1 AP on your next turn, spent on the build's `when ready: <turn>`); `when escalation 3: <turn>` (the Apex turn, while its Encounter Actions are unused); `turnDamage(..., { bloodied: true })` (the target counts as Bloodied).

## Pack R-bestiary (2026-11-05): `rbestiary.mjs`, the Bestiary re-fitted to the rebuilt party

**After the catch-up (2026-11-12):** the same script under `RULES_R` (Guard 2 / 3 / 4 by Stage from the system). `bestiary-r.json` is the tables the book and config.mjs have; a run whose fit differs writes `bestiary-r-refit.json` and says so (today: the Stage 3 Health rows, see the catch-up's table 4).

`node book/ruler/rbestiary.mjs` (about 2 minutes; `--quick` about 20 s) writes **`rbestiary.md`** and **`bestiary-r.json`** (the new tables; the book's rows and config.mjs's arrays are copied from it, and the script says whether config.mjs matches). The party: rclasses.mjs's four R builds at Stage 1, 2 and 3 (the Health line, Rally + Stage, Guard 2 / 3 / 4, the Weapon Attribute +1 a Stage, Modifiers +1 at Stage 3, WD 13 / 14 / 14, 2[W] at Stage 3; Shield of Faith's Stage steps), with a reserve for the Folk Traits (each PC's damage × 1.07). The NPCs: the pre-R tables × the factors it fits (damage d, Health h, an Elite factor ed), their Specials, one in four `power`. What it measures: the Stage 1 damage factor against the two targets (the cost = the Health lost + the Rally Points spent in the fight; a Down in 1 fight of 10) with a grid over the Special scale and NPC Health; the `power` NPCs' share; Elite Escalation and the phases, and the Elite factor; Minions and Grunts; the Stage 2 and 3 Health fits for 3.5 rounds; the difficulty table; the tables and each role's "deals a turn" (raw, against AD 13, and measured).

**New in spec.mjs (opt-in; report.md doesn't move):** `RULES.bestiary` (`"today"`: the pre-R tables frozen in `bestiary-today.mjs`, the default; `"r"`: config.mjs's live tables, which R-bestiary writes: rclasses.mjs and rbestiary.mjs's final sections use them), `RULES.eliteEsc` (an Elite's Escalation: 1 in round 1, +1 a round; its first attack each round has 1 Boon; at 2 its Round Special twice a round; at 3 its Encounter Special comes back once) and `RULES.elitePhases` (+1 when it becomes Bloodied and when it becomes Strained); an NPC tag **`power`** (fights.txt: `1 standard power`): it rolls against the PC's WD and its damage is Resolve damage on the PC (a PC's Bloodied is now its Vigor damage at its Vigor, Strained its Resolve damage at its Resolve; `st.mindTaken`, `st.strainedTurns`); an NPC's `dealt` and its turns by Escalation. **Found on the way:** the committed report.md was stale since R-classes part 3 (the pre-R Paladin's Lay On Hands turns still had the rider): regenerated on 2026-11-05 from an untouched checkout, identical to what the patched ruler writes.

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

### What positions found (level 1, the classes before pack R: 5 AP; before the catch-up; the tables: prices.md section 5, report-pre-r.md)

**After the catch-up (2026-11-12):** run again with today's dice and map rules (the rules pinned to `RULES_PRE_R`): every price within its noise (the Archer's shots carry 1.50 Banes from the map instead of 1.53). For the classes of today, Reactions and Opportunity Attack are in the catch-up's section at the top; Speed and the movement conditions wait for SIM-2's maps.


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

**After the catch-up (2026-11-12):** still the 5 AP price list (`RULES_PRE_R`; 1 AP = 4.66 DE is the 5 AP baseline turn / 5), with today's dice: +1 Boon 0.51 DE (+9%), +1 Bane -10%, Favored **+37%** (was +35%), the rest within 0.1. Under pack R, 1 AP = 5.8 DE (rclasses.mjs `AP_DE`: the 4 AP turn / 4) and the cards' worth is rclasses.md's ledger.

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
- **`reactions.md` (2026-11-12):** how often each Reaction fires (the class Reactions 0.5 to 0.85 a round; the Opportunity Attack almost never) and the fights with nobody having the Opportunity Attack (the same within noise; who takes the damage follows whom the enemies choose). `node book/ruler/sim/reactions.mjs`. Findings: rules-backlog.md, "THREE IDEAS BEFORE THE STAGE 0 ANSWERS".
- **`stage0.md` (the Stage 0 run, 2026-11-12; a prototype, nothing in the book):** levels 1 to 3 on `book/decisions-s1.md`'s lists with Escalation 1 to 6 and Momentum (`node book/ruler/sim/stage0.mjs`). Against today's Stage 1 rows Stage 0 is too hard (level 1: 31% of Health lost, a PC Down in 40%); the row used: Health × 0.90, damage × 0.85. The Escalation 6 Passive works in 5% of turns without Momentum. Ranged against melee: Guard 3 for a melee PC that ends its turn Engaged closes the gap; a smaller ranged die does not. The findings and what Lucas has to decide: `book/rules-backlog.md`, the two entries at the top.
- **`playtest-4-sim.md` (SIM-4, 2026-11-12):** Playtest 4's encounter replayed in SIM beside what happened at the table (`node book/ruler/sim/playtest4.mjs`). **It found an error in the engine, fixed the same day:** an enemy at 0 Health was out only at the end of that turn, so the rest of the turn kept hitting it. Now it is out at once (`RULES.outAtOnce`) and the reports have **"damage that counted"** beside "damage dealt". Every current report was run again (report.md: the normal fight 3.8 → 3.7 rounds, the same 14% of the party's Health; 2 Standards + 8 Minions 13% → 10%; the deadly fight won 73% → 74%). `report-pre-r.md` and the pre-R studies keep the old behaviour (they are records of the 5 AP classes).
- **`policies.md` (SIM-3, 2026-11-12):** every headline fight under 8 party policies and 4 enemy policies (`node book/ruler/sim/policies.mjs`). The other reports are the plan policy's; this one is the range around them.
- **`areas.md` (2026-11-12):** what the Area cards do placed on the grid (how many creatures each holds, what a Zone does over its rounds) against the number their ruler lines assume (`node book/ruler/sim/areas.mjs`).
- **`maps/*.txt`, `maps.md` (SIM-2, 2026-11-12):** the maps (walls, Difficult Terrain, start zones) and the fights on each, with the price of Speed and of the movement conditions by map (`node book/ruler/sim/maps.mjs`). `report.md` stays the open field.
- **`sim/` (SIM-1, 2026-11-12): the engine** (`core.mjs` rules, dice, NPCs; `turn.mjs` a PC turn; `engine.mjs` the fight and the day; `policy.mjs` the decisions; `run.mjs` one fight written out). Its README: `sim/README.md`. spec.mjs exports it all again, so every script below works as before, and every report came out unchanged.
- `spec.mjs` with `rework/*.txt` and `fights.txt`: the spec-driven ruler on the book's rules today (top of this file); it writes `report.md`. With `--pre-r`: `classes/*.txt` and `fights-pre-r.txt` under the rules before pack R; it writes `report-pre-r.md`.
- `econ.mjs` with `catalogue/*.txt`: the price list of the core rules (pack E1); it writes `prices.md`.
- `map.mjs`: the map model (pack E2): grid, movement, Banes and Boons of positions, conditions, Forced Movement; `spec.mjs` uses it (`map on`).
- `positions.mjs`: the prices of positions (pack E2); it writes `positions.json` (econ.mjs reads it).
- `progression.mjs`: the progression models over levels 1-10 (pack LV); it writes `progression.md`.
- `rclasses.mjs` with `rework/*.txt`: the rebuilt classes under pack R (pack R-classes); it writes `rclasses.md` and `worth.json` (the ledger). `rbestiary.mjs`: the Bestiary re-fitted to them (pack R-bestiary); it writes `rbestiary.md` and `bestiary-r.json`; `bestiary-today.mjs` is the pre-R tables, frozen.
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

**A record, not run again (the catch-up, 2026-11-12):** `bestiary.md` is as written on 2026-10-29. Its "today's Bestiary" was the tables before the refit; the script now reads the tables after it (`bestiary-today.mjs`), so a new run answers another question.

`node book/ruler/bestiary.mjs` (about 23 minutes; `--quick` about 7) writes **`bestiary.md`**; the proposal that reads it is **`book/bestiary-e3.md`**.
The real classes (2 P1 Smite Paladins + 2 A1 Archers, Double Shot and Rolling Shot, levels 1-3; a mixed party as a check) on the map, with LV's
decisions (3.5-round standard fights, the CV scale ¾ / 1 / 1¼ / 1½ a PC, the Health factor (Level + 17) / 16): today's Bestiary; the tier 1 refit
(NPC Health and damage factors by bisection for 3.5 rounds and a target Health lost, 33% and 40%); fights by CV; what an Elite, a Grunt and a
Minion are worth in Standards and the fixes that bring them to their CV; the Standard day; tiers 2-3 from LV's stand-ins; the proposed tables by
tier; the PCs' Health with the new factor. **New in spec.mjs:** an NPC with `exact: true` rolls its table's average exactly (the nearest dice
moved by a flat amount; opt-in, so report.md and the other reports don't change). **Findings:** the real classes lose 22% a normal fight against
today's Bestiary; the refit is Health ×1.10, damage ×1.38 for a third; an Elite is worth about 2.6 Standards (fix: today's Elite damage), a Grunt
0.57 (fix: Health ×0.69; Lucas chose ×0.75, CV 0.51-0.53), Minions ¼; the Standard day 93% / 95% / 100% at levels 1-3 (today 82% / 71% / 94%).
