# 2d12: project handoff

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT V14 system. Read this file first, then **MASTER-PLAN.md** (the order of all open work).

## Where we are now (v0.0.230, 175 tests; READ THIS FIRST)
- **v0.0.230 (2026-11-03, branch `pack-cs-1`): pack CS-2, the Paladin's and the Archer's 33 cards in `book/cards/paladin.json` and `archer.json`** (the book identical; Foundry builds their items from the cards, texts = the book's with buttons appended; the ruler reads them, 190 copied lines gone, report.md unchanged). **Not tested by Lucas yet** (checklist in the session report). **Next: CS-3 (Gear, Talents, Bestiary), then prep pack R.**
- **v0.0.229 (2026-11-03, branch `pack-cs-1`):** an Action's description (a card's prose) is shown on the Action card (sheet and chat); Lucas saw it nowhere in v0.0.228.
- **v0.0.228 (2026-11-03, branch `pack-cs-1`):** Lucas tested v0.0.227 (all works but item 7): the Basic Actions of an existing creature are now replaced when their texts or fields differ from the generated data (a card edited in book/cards reaches old creatures too).
- **v0.0.227 (2026-11-03, branch `pack-cs-1`): pack CS-1, one source for every card, the Basic Actions.** Lucas accepted the proposal with all defaults plus one change (the Foundry text of a card is the book's text, buttons appended). The 17 Basic Actions (and Break Free) live in `book/cards/basic-actions.json` (format: `book/cards/README.md`); `06-basic-actions.md` places them with `@@CARD:Name@@` (the built HTML byte-identical); Foundry generates `module/basic-data.mjs` from it (`node tools/gen-basic.mjs`; t177 fails when stale); the ruler reads it (the class files lost their Weapon Attack / Steel Yourself lines; report.md unchanged). **Not tested by Lucas yet** (checklist in the session report). **Next: CS-2 (Paladin and Archer cards), CS-3 (Gear, Talents, Bestiary), then prep pack R** (MASTER-PLAN step 0.3b).
- **Pack CS proposal (2026-11-03, branch `pack-cs-proposal`; nothing applied):** `book/card-source-proposal.md` proposes one source per card (`book/cards/*.json`, about 85 cards) from which the book's card block, the Foundry item and the ruler's action line are generated, with a test when one is missing; the proof `book/card-source-proof/` regenerates Weapon Attack, Smite and Lock & Loose identical to today's three formats. Planned as MASTER-PLAN step 0.3b (after playtest 3, before prep pack R, three sessions); Lucas answers its 4 questions by exception. Found on the way: the ruler's Shield of Faith line is stale (1 AP, 1d6; the book says 0R, 1d8).
- **v0.0.226 (2026-11-03, branch `pack-p3-polish`):** an Evade always moves its user; Evade instead after Advance instead.
- **v0.0.225 (2026-11-03, branch `pack-p3-polish` on top of pack-p3-fixes):** a card\'s Evade / Advance in a bottom bar, the Setup bar minimizes windows, a fourth Strike asks first. Next: Lucas\'s test, then prep pack R.
- **v0.0.224 (2026-11-03), branch `pack-p3-fixes` (on top of pack-encounter-log, v0.0.223):** playtest 3 (book/playtest-3.md): the answers in the book (Charge a Strike toward its target, its Weapon Attack counts toward At-will; Relocate At-will; Immobilized removed by 1 AP [Move], Break Free in Foundry) and Foundry's fixes (mark, Remove, Darkness in the move area, live log, Setup bar, Strike pips, AP / Strike markers, the marker's portrait). Next: Lucas's test, then prep pack R.
- **v0.0.223 (2026-11-03), branch `pack-encounter-log` (from main, after PR #19):** the Encounter Log for playtests (every Action with tiers, movement, damage, healing, conditions, Down; remove / edit / note; Copy in the playtest format). Next: Lucas's test, then playtest 3 (with the log).
- **v0.0.222 (2026-11-03, branch `pack-p2-polish`):** Round uses recorded after the current round (the round moved back) no longer block; the Fists never show Unloaded.
- **v0.0.221 (2026-11-03), branch `pack-p2-polish` (on top of pack-p2-test-fixes):** the Charge given-up greying fixed, movement messages as system lines, a Large creature's Charge centered, Reload an ally's weapon (book wording too), shortcuts (pack K: Shift+A/W/R/Q, Alt+1..9), the class colors in system messages. Next: Lucas's test, then playtest 3 (MASTER-PLAN step 0.3).
- **v0.0.220 (2026-11-03):** the Charge messages are system cards; **standing rule: every new chat message uses sysmsg.mjs (sysCard / sysLine), never plain text** (CLAUDE.md).
- **v0.0.219 (2026-11-02, branch `pack-p2-test-fixes`):** Lucas tested v0.0.218 (all works): the Charge picker gets a limit outline, a refund when given up, no chat line, a fixed-size bar.
- **v0.0.218 (2026-11-02, branch `pack-p2-test-fixes`):** the Charge picker (Charge aimed like a Line: blue / green / red squares, tie side, Reach at the end, click to move; no dragging). Lucas hasn't tested v0.0.217 or v0.0.218 yet.
- **v0.0.217 (2026-11-02, same branch `pack-p2-test-fixes`):** Lucas tested v0.0.216 (all works but the roll dialog's x): a target is removed by right-clicking its tile (or the x). **Next: Lucas's playtest 3** (MASTER-PLAN step 0.3), then prep pack R.
- **v0.0.216 (2026-11-02), branch `pack-p2-test-fixes` (on top of pack-p2-fixes and pack-l-line), not tested yet:** Lucas tested v0.0.214 (all works) and v0.0.215 (all works but 3, 11, 12, 15): Encounter uses kept on the combatant too, the roll dialog's x, the class window's Escalation scroll, damaging Emanations don't affect their user by default, the Line bar's look, the NPC's Basic attack box (and the Bestiary rule). Details: the changelog and foundry-backlog.md Leftovers.
- **v0.0.215 (2026-11-02), branch `pack-p2-fixes` (on top of pack-l-line), not tested by Lucas yet:** Lucas's playtest 2 bug and change list: the At-will Bane bug, the false "Charge disrupted", the class window scroll, Action-only Talents and granted Actions shown as cards, choices made in the class window, Armor Training on the Loadout, token defaults, the Rally card, Shift+L / Shift+H, "By hand" notes on the automation diamond, Rally the Tribe, Emanations with no Distance around the user, removing a target in the roll dialog, Escalation Passive descriptions, per-version Area sizes. Details and what to check: foundry/foundry-backlog.md, Leftovers.
- **Pack L (2026-11-02), v0.0.214 on branch `pack-l-line`, not tested by Lucas yet:** the **Line area** in the book (03-movement.md Areas > Line, three figures; Straight Line uses the same squares with one tie side) and in Foundry (an Area shape "Line": aimed from your square, Tab / a bar button for the tie side, cut at walls, 1 square high, no cover between its creatures; Charge and straight Pushed / Pulled paths take one tie side); **NPCs have no Weapon Attack** (nor the Fists Action; an NPC's Charge ends with its Basic attack). notes.txt was empty: no v0.0.208 fixes. What to check: foundry/foundry-backlog.md, Leftovers (L).
- **Foundry:** v0.0.213 (Techniques only with their weapon), v0.0.212 (one-hand Banes, Interact), v0.0.211 (Regrip), v0.0.210 and v0.0.209 (Lucas's v0.0.208 test fixed) on top of v0.0.208 (pack W, fewer clicks for weapons: a button per hand on [Weapon] Actions, the hands remembered, Swap; the Gun trait and the Firearm property) is on branch `claude/laughing-brown-g5zkem`, **not tested by Lucas yet** (its checklist is in the session report; what to check: foundry/foundry-backlog.md, Leftovers). v0.0.207 was tested (2026-10-31: all works): every card mechanic is a setting or field on its item, the basic mechanics are listed in foundry/foundry-backlog.md.
- **Book:** seven documents built from book/rules-src (Core Rules, Species, Gear, Talents, Paladin, Archer, Bestiary). P1, A1, E3, LV, OT are in the book; **D2 (Weapon Mastery, Weapon Groups and Gear) is in the book with my defaults, waiting for Lucas's answers by exception** (the prep document and its decision sheet: `book/gear-d2.md`): 17 weapons in 8 groups, a Mastery per weapon (3 / 4 / 5), 14 new Weapon Techniques, Expert 8, Master 15 (one more [W] from level 8), 1 Mastery per group per encounter, the Firearm property and [Gun], main hand and off hand (names only). Open: D3, D4 and B1 to B4.
- **Weapon Trees (design, after D2's answers):** the Bow group is designed and confirmed in `book/weapon-trees.md` (six bows, the rules they need: Strung, Volley, Bleed, Arcs, Group Mastery); not in rules-src. The Line area is in the book and Foundry since pack L (v0.0.214).
- **Playtest 2 (2026-11-02) led to a rework, decided but not applied:** 4 AP + 1 Reaction AP, a Hallmark Reaction per class, Escalation as a level (a Passive per level, big Encounter abilities at 3, nothing spent; Overcast must follow), Bloodied / Strained without Banes as hooks, NPCs without Weapon Attack. Everything: `book/playtest-2.md` and rules-backlog.md "PLAYTEST 2".
- **Next (MASTER-PLAN section 3, step 0):** ~~pack L~~ (done, v0.0.214), Lucas's test of v0.0.214 and playtest 3 (the baseline), then the rework (prep pack R, R-book, R-classes, R-Foundry), playtest 4, and only then the weapon line (Sword design, WB, WF).
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
  playtest-2.md               playtest 2's log, findings and the rework it decided (pack R starts here)
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
- System tests: **in a fresh clone (a cloud session) first build the packs** (below): about 10 tests read packs/_source and fail with ENOENT without it. Then `cd foundry/twod12 && node tools/tests/run.mjs` (175 tests; each has an expected output in tools/tests/expected; accept a meant change with `node tools/tests/run.mjs --update t84`). **Test numbers have gaps (t1, t6, t21, t31; also t12b, t37b): the next new one is t178.** Lint: `npx eslint@8 --no-eslintrc -c tools/eslint.json --ext .mjs module`.
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
