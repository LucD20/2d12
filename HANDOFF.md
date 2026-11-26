# 2d12: project handoff

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT V14 system. **Read `CLAUDE.md` first** (the rules of work, the commands, the layout), then this file (where things stand), then **MASTER-PLAN.md** (the order of what is left).

**Rewritten 2026-11-25 as the current state only** (the cleanup audit, pass 2). The dated log this file carried from v0.0.208 to v0.0.519 is in `archive/old-notes/HANDOFF-to-2026-11-25.md`, word for word; what each Foundry version did is in `foundry/twod12/docs/reference.md` (Changelog). **Keep this file short: replace a line when it stops being true, don't add a dated entry on top.**

## Where things stand (2026-11-26)

- **Foundry: v0.0.520** (the cleanup audit followed: `book/audit-2026-11-25/foundry-needs.md`, 29 built, 40 already so, 12 open in `foundry/foundry-backlog.md`, "THE CLEANUP AUDIT: WHAT FOUNDRY STILL HAS TO FOLLOW"). 317 tests pass. Released once it reaches main (v0.0.519 is the release before it). **Not tested by Lucas:** the 15 `bst-*` tests (the Bestiary's rebuild) and the 7 `cu-*` tests (v0.0.520) in `foundry/to-test.md`. Existing worlds need the four creatures imported again from the NPCs compendium, and the Basic Actions refreshed (Heal becomes Tend).
- **The book:** Chapters 1 to 9 (Core Rules), 11 Species, 12 Paladin, 13 Archer, 14 Bestiary, 15 Gear; six HTML documents; the Talents document is set aside. Only Stage 0 (levels 1 to 3) is written. `python3 build_rules.py`: 0 unresolved refs, 20 open boxes.
- **The core rework** (`book/core-rework.md`, section P is its order): batches 1 to 4 built. Batch 5 (Escalation): the first step is built (no Arts, no Escalation Passives, the Escalation Die dE, Steady Draw's 2dE); the rest waits (Lucas: no extra levels until level 1 feels good). Batches 6 and 7 are the Bestiary.
- **The Bestiary** (`book/bestiary-design.md`): rebuilt from the ground up. Decided and in the book as playtest rules: the measure of a fight (Rally Points a PC, and Downs), the bands, the normal fight (CV 100 a PC), the four ranks' defaults (Minion with ticks, Grunt, Standard, Elite), and four creatures, one a rank (Goblin Sneak, Grave Wisp, Orc Warrior, Ogre Chieftain). **The Boss is parked until after playtest 8. Every number is a playtest value.**
- **The Hide package** (Hide, Sneak, Seek, Point Out; v0.0.513 to v0.0.518): in the book and in Foundry, tested by Lucas.
- **The Encounter Log** records what playtest 8 needs (built in v0.0.488 and v0.0.511).

## What is happening now

1. **Playtest 8** (Lucas): level 1 pregens against the new creatures. The fights Claude suggests are in `foundry/foundry-backlog.md`, "Playtest 8, the fights Claude suggests".
2. **The cleanup audit** (`book/audit-2026-11-25/`): Lucas answered its 282 questions; 223 are applied to the book (`applied.md`), 16 are held as questions (`work-order.json`, `do: "hold"`), and Foundry follows the book in v0.0.520 (`foundry-needs.md`; the 12 open items in `foundry/foundry-backlog.md`).

## Waiting on Lucas

- His checklist on v0.0.519 and v0.0.520, and playtest 8's report.
- The cleanup audit's 16 held questions (`work-order.json`, `do: "hold"`), and the open Foundry items that are his call (an "up to N targets" Action with no target; when Human's choices lock).
- Reviewed, not decided: a Rally Point of a third of Health (`book/bestiary-design.md`; "I will playtest as is"). On watch: the Ogre's Backhand (a Save is ready if it is too strong).
- The older list of open items that stood here was not checked line by line: it is in the archived copy.

## Known to be broken or behind

- `node book/ruler/spec.mjs --check` fails on the Paladin's Weapon Attack (since batch 4). The ruler and the SIM (`book/ruler/sim/`) are frozen on the old Bestiary's numbers.
- The NPC Builder tab still works on the old rating tables; the four new creatures use typed numbers.
- The gallery's saved shots (`foundry/twod12/tools/gallery/`) are behind in the cloud environment: run it with `--update` on a machine whose shots are current.
- Three creature cards leave something by hand: Pass Through, Hurled Goblin, Crushing Grip (`foundry/automation-ratings.md`).

## Which file is current, by topic

| Topic | The record | Also |
|---|---|---|
| The order of work | `MASTER-PLAN.md` | `book/core-rework.md` section P |
| Rule decisions, logged | `book/rules-backlog.md` | |
| What Foundry has left | `foundry/foundry-backlog.md` | the changelog: `foundry/twod12/docs/reference.md`; Lucas's checklist: `foundry/to-test.md` |
| The core rework | `book/core-rework.md` | |
| The Bestiary | `book/bestiary-design.md` | each creature: `book/cards/*-redesign.md`; research: `book/research/monster-building.md`, `enemies-at-the-table.md`, `encounter-difficulty.md` |
| Classes and cards | `book/class-charter.md`, `book/cards/README.md`, `book/cards/card-structure.md` | the cards: `book/cards/stage0/` |
| Weapons | `book/cards/bows-redesign.md`, `book/cards/swords-redesign.md` | every other weapon is a placeholder |
| Magic, play outside a fight | `book/decided.md` (the map), `book/magic-design.md`, `book/magic-out-of-combat.md` | guarded: `bash book/tools/guard.sh check` |
| Talents | `book/talents-design.md` | the current cards: `book/cards/talents-playtest.md` |
| The look | `foundry/mockups/style-book.md`, `foundry/mockups/style-audit.md` | |
| Playtests | `book/playtest-2.md` to `playtest-6.md` | |
| Research outside the project | `book/research/README.md` (the index) | |
| The numbers | `book/ruler/README.md` | `book/ruler/benchmark.mjs`, `fight-identity.mjs` (the Bestiary's counts) |

Paused, each with its record above: magic (the skeleton is done; next, a playtest kit), Talents (restarted for the four playtest PCs, T15), the weapon line.

## Starting a session

A new Claude Code session: "Read HANDOFF.md and MASTER-PLAN.md and run <the pack>". One pack a session. Design and mockups happen in Claude Code too.
