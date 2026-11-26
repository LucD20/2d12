# 2d12: project handoff

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT V14 system. **Read `CLAUDE.md` first** (the rules of work, the commands, the layout), then this file (where things stand), then **MASTER-PLAN.md** (the order of what is left).

**Rewritten 2026-11-25 as the current state only** (the cleanup audit, pass 2). The dated log this file carried from v0.0.208 to v0.0.519 is in `archive/old-notes/HANDOFF-to-2026-11-25.md`, word for word; what each Foundry version did is in `foundry/twod12/docs/reference.md` (Changelog). **Keep this file short: replace a line when it stops being true, don't add a dated entry on top.**

## Where things stand (2026-11-26)

- **Foundry: v0.0.525** (the cleanup audit's open Foundry items: a dead creature doesn't affect movement, Charge stops at the weapon's normal Range, Shake Off's card writes the book's Save line and Tiers, one square of Difficult Terrain always, Point Out on any Unsensed creature, Empowered's damage chosen, a thick wall (a Wall settings checkbox) blocks Hearing, Shifting Aim off the Archer's turn, Judge's re-Judge as a 0R Reaction; only Hit and Run's automation is left open; v0.0.524: the Encounter Log names a fight by its cost in Rally Points a PC, at the record's edges: Easy up to 1¼, Normal up to 2, Hard up to 3, Deadly above 3; v0.0.523: Lucas's review of the Bestiary's wording: a Minor enemy's dice follow the general rule, its Empowered die explodes too; no default Critical row when "Basic attack" is ticked; v0.0.522: the class traits: [Paladin] on every Paladin Action and [Archer] on every Archer Action, Keywords, in the book's Chapter 7 too; v0.0.521: Lucas's answers to the audit's held questions, the Critical only from each card's Critical row, a Human's choices locked after level 1, Lingerings by subtype, no "Special Actions"; v0.0.520 followed the audit's book: `book/audit-2026-11-25/foundry-needs.md`; in `foundry/foundry-backlog.md`, "THE CLEANUP AUDIT: WHAT FOUNDRY STILL HAS TO FOLLOW", only Hit and Run's automation is open). 320 tests pass. Released once it reaches main (v0.0.519 is the release before it). **Not tested by Lucas:** the 15 `bst-*` tests (the Bestiary's rebuild), the 7 `cu-*` and 2 `cl-*` tests (v0.0.520), the 5 `hq-*` tests (v0.0.521), the 3 `ct-*` tests (v0.0.522) the 2 `mn-*` tests (v0.0.523), `dm-log-cost` (v0.0.524) and the 9 `ox-*` tests (v0.0.525) in `foundry/to-test.md`. Existing worlds need the four creatures imported again from the NPCs compendium, the Basic Actions refreshed (Heal becomes Tend; the Basic Attack's and Fists' Critical rows) and "Update from the compendium" (Drawing Light's and Harrying Shot's Critical rows, the class traits; v0.0.525: Shake Off among the Basic Actions, Judge's message).
- **The book:** Chapters 1 to 9 (Core Rules), 11 Species, 12 Paladin, 13 Archer, 14 Bestiary, 15 Gear; six HTML documents; the Talents document is set aside. Only Stage 0 (levels 1 to 3) is written. `python3 build_rules.py`: 0 unresolved refs, 24 open boxes.
- **The core rework** (`book/core-rework.md`, section P is its order): batches 1 to 4 built. Batch 5 (Escalation): the first step is built (no Arts, no Escalation Passives, the Escalation Die dE, Steady Draw's 2dE); the rest waits (Lucas: no extra levels until level 1 feels good). Batches 6 and 7 are the Bestiary.
- **The Bestiary** (`book/bestiary-design.md`): rebuilt from the ground up. Decided and in the book as playtest rules: the normal fight (CV 100 a PC, under "Building an encounter"), the four ranks' defaults (Minion with ticks, Grunt, Standard, Elite; an NPC's other Actions have no default shape, only reference numbers, since Lucas's review of 2026-11-26), and four creatures, one a rank (Goblin Sneak, Grave Wisp, Orc Warrior, Ogre Chieftain). **The designers' measure of a fight** (its cost in Rally Points a PC, and its Downs; Easy up to 1¼, Normal up to 2, Hard up to 3, Deadly above 3) **is in the record, not in the book** (Lucas, 2026-11-26: "a designers thing only"; `bestiary-design.md`, "The designers' measure of a fight, out of the book"); the Encounter Log uses it. **The Boss is parked until after playtest 8. Every number is a playtest value.**
- **The Hide package** (Hide, Sneak, Seek, Point Out; v0.0.513 to v0.0.518): in the book and in Foundry, tested by Lucas.
- **Playtest 8 is played** (Lucas, solo, on v0.0.519; the record and Claude's report: `book/playtest-8.md`): the four pregens against the four new creatures (CV 410), over in round 2, no Down, 1.3 Rally Points a PC (normal). No card and no number changed (on watch: `rules-backlog.md`, "PLAYTEST 8: ON WATCH"; `bestiary-design.md`, its last section). Its two clarifications are in Chapter 2 ("At its moment", "Entering a Square"). Found: the Situational tab's moving buttons (the mockup `foundry/mockups/sit-fixed/`, not built) and the Encounter Log's mistakes (`foundry-backlog.md`, "PLAYTEST 8 PLAYED").

## What is happening now

1. **After playtest 8** (Lucas, 2026-11-26): **two more playtests, then the numbers are adjusted** (the class margin and the retune). Its report (`book/playtest-8.md`, section 2.10) suggests the same fight again and one where the enemies act first (the five fights suggested earlier: `foundry/foundry-backlog.md`, "Playtest 8, the fights Claude suggests").
2. **The cleanup audit** (`book/audit-2026-11-25/`): Lucas answered its 282 questions; they are applied to the book (`applied.md`; the held questions he answered on 2026-11-26 in its last section), 6 are still held (`work-order.json`, `do: "hold"`), and Foundry follows the book in v0.0.520, v0.0.521 and v0.0.525 (`foundry-needs.md`; only Hit and Run's automation is left open in `foundry/foundry-backlog.md`). The approved removals and moves are done too (old drafts, card builders and mockups in `archive/`; the sync scripts, the Elite ladder, the Ruler line and 21 unused functions gone).

## Waiting on Lucas

- His checklist on v0.0.519 to v0.0.525.
- His answers on the sit-fixed mockup (`foundry/mockups/sit-fixed/README.md`: rule A or B, the narrower windows, two questions at once, the order under a question); then a Foundry version builds it with the Encounter Log's fixes.
- The cleanup audit's 6 held questions (`work-order.json`, `do: "hold"`: an NPC's items and losing its weapon, B3-033 / B3-065; the reminders B2-050, B3-011, B3-015, F-033; B2-008 and B2-080 stay reminders too).
- An NPC losing its weapon (B3-033, B3-065, B3-069): "We need to work more on it. Save it for when we are done running the audit." Open, with Claude's proposal (not decided) in `book/bestiary-design.md`, "An NPC losing its weapon".
- **Two more playtests** (Lucas, 2026-11-26: "Margin: I will roll two more playtests and then we adjust from there"), then **the class margin's size** (decision 4's correction, no value yet) and the retune (decision 16). Answered the same day: Hard ends at 3 Rally Points a PC, Deadly above; Chapter 14's "by default" sentences stay ("All rest are good").
- Reviewed, not decided: a Rally Point of a third of Health (`book/bestiary-design.md`; "I will playtest as is"). On watch: the Ogre's Backhand (a Save is ready if it is too strong).
- The older list of open items that stood here was not checked line by line: it is in the archived copy.

## Known to be broken or behind

- The ruler and the SIM (`book/ruler/sim/`) are frozen on the old Bestiary's numbers, on their own copy of the old tables (`book/ruler/sim/tables.mjs`, `npcbudget.mjs`); `node book/ruler/spec.mjs --check` prints "ok".
- The NPC Builder tab still works on the old rating tables; the four new creatures use typed numbers.
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
| The look | `foundry/mockups/style-book.md`, `foundry/mockups/style-audit.md` | the Situational tab's fixed buttons: `foundry/mockups/sit-fixed/` |
| Playtests | `book/playtest-2.md` to `playtest-6.md`, `playtest-8.md` | playtest 7 has no file of its own: its notes are `foundry/foundry-backlog.md`, "PLAYTEST 7" |
| Research outside the project | `book/research/README.md` (the index) | |
| The numbers | `book/ruler/README.md` | `book/ruler/benchmark.mjs`, `fight-identity.mjs` (the Bestiary's counts) |

Paused, each with its record above: magic (the skeleton is done; next, a playtest kit), Talents (restarted for the four playtest PCs, T15), the weapon line.

## Starting a session

A new Claude Code session: "Read HANDOFF.md and MASTER-PLAN.md and run <the pack>". One pack a session. Design and mockups happen in Claude Code too.
