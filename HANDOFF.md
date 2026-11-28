# 2d12: project handoff

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT V14 system. **Read `CLAUDE.md` first** (the rules of work, the commands, the layout), then this file (where things stand), then **MASTER-PLAN.md** (the order of what is left).

**Rewritten 2026-11-25 as the current state only** (the cleanup audit, pass 2). The dated log this file carried from v0.0.208 to v0.0.519 is in `archive/old-notes/HANDOFF-to-2026-11-25.md`, word for word; what each Foundry version did is in `foundry/twod12/docs/reference.md` (Changelog). **Keep this file short: replace a line when it stops being true, don't add a dated entry on top.**

## Where things stand (2026-11-27)

- **Foundry: v0.0.541** (2026-11-28: **the Arms Modifier** (the roll is the Arms trait, Weapon only needs a weapon), the Charge's Basic Attack no longer counts toward the At-will count, Snap Shot's Setup, Hurled Goblin and Crushing Grip without a weapon, and playtest 12's Foundry bugs; **make a new world**; v0.0.540 (2026-11-28: a Reaction's granted use can wait on the HUD (Slip Away's Interact); v0.0.539: every plate of the combat strip shows its Strike slashes, a Critical row's short Apply and its Linked Action used, a granted use no longer switches the HUD's tab; v0.0.538: a no-roll Setup's frame says "Continue"; v0.0.537: Lucas's checklist on v0.0.536, 10 passed; the party strip's Strike slashes, a Save Action's roll dialog with the user's Boons, Banes, Favored and Doomed, Slip Away's Interact as a granted use; v0.0.536 (2026-11-27: **Favored and Doomed are not Boons or Banes** (Lucas's option A: they decide the dice; Boons and Banes add in every state, at most 4 after cancelling, never turning a roll Favored or Doomed; a Doomed caster gives Favored Saves) and the review's approved rows (Quick Shots, Lay On Hands Guard 4 + Pow, Consecrated Ground Guard 2 + Pow); v0.0.535 the same day: **the action economy and the rebuilt Reactions at level 1** (4 AP regained at the end of the turn and 4 at an encounter's start, no Reaction Point, no Guard from unspent AP, a turn begun with 0 AP, a repeated At-will [Strike] Doomed, Strained Speed −2 and Bloodied's open space, the new moments, the eight level 1 Reactions, Hit and Run removed); the full history is the changelog, `foundry/twod12/docs/reference.md`). 331 tests pass. Released from the `pack-action-economy` branch, and once it reaches main. **Not tested by Lucas:** `rx-slipaway` Rev 4, `ar-arms`, `ar-cards`, `pt12-bugs` in `foundry/to-test.md`. Existing worlds need "Update from the compendium" on the four pregens and the four creatures (or import them again) and the Conditions compendium's Slowed, Quickened, Dazed and Staggered.
- **The book:** Chapters 1 to 9 (Core Rules), 11 Species, 12 Paladin, 13 Archer, 14 Bestiary, 15 Gear; six HTML documents; the Talents document is set aside. Only Stage 0 (levels 1 to 3) is written. `python3 build_rules.py`: 0 unresolved refs, 24 open boxes.
- **The core rework** (`book/core-rework.md`, section P is its order): batches 1 to 4 built. Batch 5 (Escalation): the first step is built (no Arts, no Escalation Passives, the Escalation Die dE, Steady Draw's 2dE); the rest waits (Lucas: no extra levels until level 1 feels good). Batches 6 and 7 are the Bestiary.
- **The Bestiary** (`book/bestiary-design.md`): rebuilt from the ground up. Decided and in the book as playtest rules: the normal fight (CV 100 a PC, under "Building an encounter"), the four ranks' defaults (Minion with ticks, Grunt, Standard, Elite; an NPC's other Actions have no default shape, only reference numbers, since Lucas's review of 2026-11-26), and four creatures, one a rank (Goblin Sneak, Grave Wisp, Orc Warrior, Ogre Chieftain). **Retuned after playtests 8 to 10 (Lucas, 2026-11-26; `bestiary-design.md`, the last section):** the normal fight lasts 3 to 4 rounds; PC Health +½ (Paladin 30 / 15, Archer 24 / 12); enemy damage about ×2.36 (a Standard's Basic attack 2 + 1d10! / 8 + 1d12!, a Minion's and a Grunt's 1d10 / 2 + 1d12) and Health a quarter more (Grunt 22, Standard 45, Elite 90); Judge has no damage reduction; Feint's Tier 2 is 1 Boon and its Tier 3 2 Boons; NPCs have no Rally Points. **The designers' measure of a fight** (its cost in Rally Points a PC, and its Downs; Easy up to 1¼, Normal up to 2, Hard up to 3, Deadly above 3) **is in the record, not in the book** (Lucas, 2026-11-26: "a designers thing only"; `bestiary-design.md`, "The designers' measure of a fight, out of the book"); the Encounter Log uses it. **The Boss is parked until after playtest 8. Every number is a playtest value.**
- **The Hide package** (Hide, Sneak, Seek, Point Out; v0.0.513 to v0.0.518): in the book and in Foundry, tested by Lucas.
- **Playtests 8, 9 and 10 are played** (the same fight three times); playtest 8 (Lucas, solo, on v0.0.519; the record and Claude's report: `book/playtest-8.md`): the four pregens against the four new creatures (CV 410), over in round 2, no Down, 1.3 Rally Points a PC (normal). Its numbers changed only after playtests 9 and 10 (v0.0.527; `rules-backlog.md`, the top entry). Its two clarifications are in Chapter 2 ("At its moment", "Entering a Square"). Found: the Situational tab's moving buttons (built in v0.0.529, rule A of `foundry/mockups/sit-fixed/`) and the Encounter Log's mistakes (`foundry-backlog.md`, "PLAYTEST 8 PLAYED").

## What is happening now

1. **Playtest 12 is played** (`book/playtest-12.md`: "Much much more interesting"; 2.5 rounds, 1.8 Rally Points a PC). Its notes are built (v0.0.541: the Foundry bugs, the Charge, Snap Shot, Hurled Goblin, the Arms Modifier); the path search and Push's Tab wait for Foundry's redesign after Stage 0. **Now: the fight's length** (Lucas: "4 can start now"), one decision at a time (`book/bestiary-design.md`, the last section); then playtest 13, the same fight.
2. **The cleanup audit** (`book/audit-2026-11-25/`): answered and applied (the book; Foundry v0.0.520, v0.0.521, v0.0.525); 5 questions still held (`work-order.json`, `do: "hold"`). The approved removals and moves are done.

## Waiting on Lucas

- The fight's length, its first decision (`book/bestiary-design.md`, the last section); his checklist on v0.0.541 (`foundry/to-test.md`: 4 tests), whether to keep Claude's choices on the breakdown (v0.0.533's changelog: the opened breakdown spanning the card, "Applied:" under the total, "Caster's Banes" kept as the Save's label), and whether to keep Claude's choices in it (v0.0.532's changelog: where a Forced Movement ends against a lying creature, the diagonals' count for the whole turn, an Action rerun on targets changed while its dialog is open); whether Wounding Shot's Lingering gets a subtype too (`book/rules-backlog.md`, the top entry).
- Whether to keep Claude's choices on the sit-fixed mockup's open questions (v0.0.529's changelog: a Reaction under a question, the order under it, the narrower windows, two questions at once). The Encounter Log's fixes (playtest 8) are still to build.
- Claude's choices at the build of v0.0.535 and v0.0.536, to keep or revert (`book/rules-backlog.md`, the top section, and the two changelog entries: Tireless Vigil's wording, Quickened at the turn's start, Kaela's level 2 pick now Covering Fire, Quick Shots' Critical as a button). The rest of the Actions review (Demoralize's Tier 3, the Minor enemies' die, Crack the Ground, Shiv's Advance) is not applied: the answers stand in `book/cards/review-2026-11-27/answers.md`. Still asked: write magic decisions 55 and 56 (Nonlethal leaves on a Sleep; no Breather) into Chapter 4 now?
- Small things waiting on his word: where a Forced Movement ends when its path finishes in a Prone or Unconscious creature's square (the book says the last legal square before it: Claude's reading).
- The cleanup audit's 5 held questions (`work-order.json`, `do: "hold"`: an NPC's items and losing its weapon, B3-033 / B3-065; the reminders B2-050, B3-011, B3-015; B2-008 and B2-080 stay reminders too).
- An NPC losing its weapon (B3-033, B3-065, B3-069), with the loot sentence: "after I am happy with the current playtest". Open, with Claude's proposal (not decided) in `book/bestiary-design.md`, "An NPC losing its weapon".
- The small creatures' attacks (seven of ten Shivs missed in three fights): "to do after the new numbers are in".
- **Playtests 9 and 10 are played** (the three fights together: `book/playtest-10.md`, section 1: the party deals 16 a turn, about 2.3 rounds, about 1 Rally Point a PC, no Down, class cards take a fifth). **His decisions on them are applied** (v0.0.527, above); the class margin is now his class Actions' pass ("I will rebalance the classes actions"), after the next playtest.
- Reviewed, not decided: a Rally Point of a third of Health (`book/bestiary-design.md`; "I will playtest as is"; his 2026-11-26 answer for now: "Lets keep as is"). On watch: Crack the Ground (its Tier 1 now averages 33).
- The older list of open items that stood here was not checked line by line: it is in the archived copy.

## Known to be broken or behind

- The ruler and the SIM (`book/ruler/sim/`) are frozen on the old Bestiary's numbers, on their own copy of the old tables (`book/ruler/sim/tables.mjs`, `npcbudget.mjs`); `node book/ruler/spec.mjs --check` prints "ok".
- The NPC Builder tab still works on the old rating tables; the four new creatures use typed numbers.
- Three creature cards leave something by hand: Pass Through, Hurled Goblin, Crushing Grip (`foundry/automation-ratings.md`).
- The SIM still plays the old economy (the Reaction Point, the Guard of unspent AP, the 1 and 2 Banes of a repeat: it calls `roundrules.mjs atWillBanes`, left as it was); the new rules are `regainAP`, `atWillRepeat` there, for when it is unfrozen. It does read the new Favored / Doomed rule (`calc.mjs bbResolve`), so its reports would move if rerun.
- Foundry lets an Evade cross a Bloodied (or Unconscious) enemy's space; the book allows an Evade only through an ally's (`foundry/foundry-backlog.md`, the top section).

## Which file is current, by topic

| Topic | The record | Also |
|---|---|---|
| The order of work | `MASTER-PLAN.md` | `book/core-rework.md` section P |
| Rule decisions, logged | `book/rules-backlog.md` | |
| What Foundry has left | `foundry/foundry-backlog.md` | the changelog: `foundry/twod12/docs/reference.md`; Lucas's checklist: `foundry/to-test.md` |
| The core rework | `book/core-rework.md` | |
| The Bestiary | `book/bestiary-design.md` | each creature: `book/cards/*-redesign.md`; research: `book/research/monster-building.md`, `enemies-at-the-table.md`, `encounter-difficulty.md` |
| Reactions | `book/reactions-design.md` (level 1 built in v0.0.535) | research: `book/research/reactions.md`, `dc20.md`, `action-economy.md` |
| Classes and cards | `book/class-charter.md`, `book/cards/README.md`, `book/cards/card-structure.md` | the cards: `book/cards/stage0/` |
| Weapons | `book/cards/bows-redesign.md`, `book/cards/swords-redesign.md` | every other weapon is a placeholder |
| Magic, play outside a fight | `book/decided.md` (the map), `book/magic-design.md`, `book/magic-out-of-combat.md` | guarded: `bash book/tools/guard.sh check` |
| Talents | `book/talents-design.md` | the current cards: `book/cards/talents-playtest.md` |
| The look | `foundry/mockups/style-book.md`, `foundry/mockups/style-audit.md` | the Situational tab's fixed buttons: `foundry/mockups/sit-fixed/` |
| Playtests | `book/playtest-2.md` to `playtest-6.md`, `playtest-8.md` to `playtest-12.md` | playtest 7 has no file of its own: its notes are `foundry/foundry-backlog.md`, "PLAYTEST 7" |
| Research outside the project | `book/research/README.md` (the index) | |
| The numbers | `book/ruler/README.md` | `book/ruler/benchmark.mjs`, `fight-identity.mjs` (the Bestiary's counts) |

Paused, each with its record above: magic (the skeleton is done; next, a playtest kit), Talents (restarted for the four playtest PCs, T15), the weapon line.

## Starting a session

A new Claude Code session: "Read HANDOFF.md and MASTER-PLAN.md and run <the pack>". One pack a session. Design and mockups happen in Claude Code too.
