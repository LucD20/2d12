# 2d12: project handoff

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT V14 system. Read this file first, then **MASTER-PLAN.md** (the order of all open work).

## Where we are now (v0.0.210, 167 tests; READ THIS FIRST)
- **Foundry:** v0.0.210 and v0.0.209 (Lucas's v0.0.208 test fixed) on top of v0.0.208 (pack W, fewer clicks for weapons: a button per hand on [Weapon] Actions, the hands remembered, Swap; the Gun trait and the Firearm property) is on branch `claude/laughing-brown-g5zkem`, **not tested by Lucas yet** (its checklist is in the session report; what to check: foundry/foundry-backlog.md, Leftovers). v0.0.207 was tested (2026-10-31: all works): every card mechanic is a setting or field on its item, the basic mechanics are listed in foundry/foundry-backlog.md.
- **Book:** seven documents built from book/rules-src (Core Rules, Species, Gear, Talents, Paladin, Archer, Bestiary). P1, A1, E3, LV, OT are in the book; **D2 (Weapon Mastery, Weapon Groups and Gear) is in the book with my defaults, waiting for Lucas's answers by exception** (the prep document and its decision sheet: `book/gear-d2.md`): 17 weapons in 8 groups, a Mastery per weapon (3 / 4 / 5), 14 new Weapon Techniques, Expert 8, Master 15 (one more [W] from level 8), 1 Mastery per group per encounter, the Firearm property and [Gun], main hand and off hand (names only). Open: D3, D4 and B1 to B4.
- **Weapon Trees (design, after D2's answers):** the Bow group is designed and confirmed in `book/weapon-trees.md` (six bows, the rules they need: Strung, Volley, Bleed, Arcs, Group Mastery); not in rules-src. The Line area is decided: `book/line-area-prompt.md` (its own pack).
- **Next (MASTER-PLAN section 3):** Lucas playtests v0.0.208 (hands) with the current classes; a pack for the fixes + the Line (v0.0.211); the Sword group designed like the bows; then both groups into the book together; then the weapons in Foundry.
- **History:** every earlier "where we are" entry (2026-10-23 to v0.0.207) is in `archive/old-notes/HANDOFF-to-v0.0.207.md` (older: `handoff-history-v0.0.166.md`); each version's details are in the changelog (foundry/twod12/docs/reference.md).

## What is in the repository
```
HANDOFF.md, MASTER-PLAN.md   this file; the order of all open work
CLAUDE.md                    the rules and commands every Claude Code session reads
notes.txt                    Lucas's running notes (merged at the start of each pack)
PROJECT-INSTRUCTIONS.md, SETUP.md   the claude.ai Project "2d12 design" and the one-time setup
Update Foundry.cmd           Lucas's double-click update of his local Foundry (tools/sync-pack.ps1: finds the newest pack-* branch)
tools/                       knowledge.py (the Project's knowledge files into knowledge/), the sync scripts
book/
  rules-src/                 THE RULEBOOK SOURCE (01-roll.md ... 09-glossary.md = Core; 11-species, 12-paladin, 13-archer, 14-bestiary, 15-gear, 16-talents), README.md (conventions), INDEX.md
  build_rules.py             python3 build_rules.py -> the seven HTML documents (also: --where Term); rules_tools.py: its checks
  diagrams/                  diagrams.py draws every diagram; a chapter places one with @@DIAGRAM:name@@
  ruler/                     the numbers (README.md, spec.mjs, classes/*.txt, prices, positions, progression, ratings.py)
  rules-backlog.md           THE LOG OF RULE DECISIONS and the open items of the book
  *.md (paladin-p1, archer-a1, options-talents, bestiary-e3, progression-lv, gear-d2, class-charter; paladin- and archer-old-cards)   the design documents behind the book's changes, and the cards that left it
foundry/
  twod12/                    the system (id twod12): module/, templates/, styles/, lang/, packs/ (built, gitignored), tools/ (content.mjs, build-packs.mjs, tests/), docs/reference.md, README.md
  foundry-backlog.md         what is left in the system, the basic mechanics, known limits, tools
  reference.md               a copy of twod12/docs/reference.md (the system reference with the changelog)
  mockups/                   the UI mockups and design briefs
archive/                     history: finished drafts, old notes, the old HANDOFF / MASTER-PLAN / backlog
```
Python needs `markdown`. Node 18+ for the tests.

## Commands
- Book: `cd book && python3 build_rules.py` ("unresolved refs: 0" is the goal). `python3 build_rules.py --where Flanking`.
- System tests: **in a fresh clone (a cloud session) first build the packs** (below): about 10 tests read packs/_source and fail with ENOENT without it. Then `cd foundry/twod12 && node tools/tests/run.mjs` (167 tests; each has an expected output in tools/tests/expected; accept a meant change with `node tools/tests/run.mjs --update t84`). **Test numbers have gaps (t1, t6, t21, t31; also t12b, t37b): the next new one is t170.** Lint: `npx eslint@8 --no-eslintrc -c tools/eslint.json --ext .mjs module`.
- Compendiums: the content is in `tools/content.mjs`; in foundry/ run `npm install @foundryvtt/foundryvtt-cli` (node_modules and package files: never commit them), then `node twod12/tools/build-packs.mjs`.
- A version: bump `version` in system.json, add the changelog entry to docs/reference.md (copy it to foundry/reference.md), run the tests, give Lucas a short test checklist; commit on a `pack-...` branch (Update Foundry.cmd finds it). No zips.

## How the user and I work (keep this)
- The user (Lucas) tests in Foundry and answers with bullet points ("works", "bug", "idea"). Reply concisely and directly.
- **Every delivered version of the system gets a short test checklist** based on what was added, changed or removed, and a changelog entry in docs/reference.md. Always run the tests before delivering.
- When the user says "analyze", "brainstorm", "not applying anything yet" or "don't write yet": discuss only and note the decisions in the backlogs, no code or book edits, until told to apply.
- He decides rules; ask when something is ambiguous (questions at the end).
- Corrections apply going forward, not retroactively, unless asked.
- Rules text is written for the book first (rules-src), then Foundry; each rule change is logged in rules-backlog.md.
- I cannot run Foundry. What cannot be tried there is said plainly, with a diagnostic command when possible.
- Ability and item descriptions: concise and direct.
- **Lucas doesn't write Flavor: I write the Flavor line of every new card** (Actions, Talents, Features) and he changes it if he wants.

## Things to know
- Known gaps: Avenger's Oath, Hallowed Stance, Aegis and Mercy's Reward are text only; Sacred Weapon's "increase Empowered" is text; the 3 AP areas of Word of Radiance and Consecrated Ground are text (an Area belongs to the Action, not the version); Divine Surge finds "your next Smite" by name. A world with its own Tags list must add "Profane".
- Left on purpose: the CSS is still in the order it grew (version-tagged blocks). Moving rules changes which one wins, so regroup it only with a visual check.
- The Builder tab and the side view (heightcover.mjs) draw on light backgrounds with fixed dark text: Foundry's theme text color is light in a dark theme.

## Open items (waiting on Lucas)
- The Reactions text, and the Talents that need "haven't moved" / "haven't left your square" (Patient Hunter, Consecrated Stance).
- Magic Talents (raw and primal): a list of ideas.
- The book's "To be decided" boxes (Open Items appendix of each document): Hide and sneaking, bursts/cones/lines, Resist and Weak, the Bestiary's Level 2+ rows, and the rest.
- Tags: Profane Judgment uses them (the On damage setting); more tag-based abilities can use the same setting or `hasTag(actor, tag)`.
- Not built, on purpose: tracking "moved" and "left your square" (build it when the first Talent needs it: store the square at the start and end of each turn and a flag set only by your own movement); Interrupt automation (used by hand).
- **User wish (later):** show current values like PF2e across the whole NPC sheet (attributes and other numbers too), not only the sidebar cells done in v0.0.120.
Known limits and unverified items are in foundry/foundry-backlog.md.

## Starting a session
- **Claude Code (a pack):** a new session, "Read HANDOFF.md and MASTER-PLAN.md and run pack N".
- **Design chats and mockups:** a new chat in the claude.ai Project "2d12 design" (its knowledge files: `python tools/knowledge.py`, then replace the files in the Project); paste its DECISIONS block into notes.txt.
