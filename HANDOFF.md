# 2d12: project handoff

**THE ORDER OF ALL OPEN WORK IS IN MASTER-PLAN.md (2026-10-25): read it right after this file.** Packs: Phase 1 Foundry catches up (Q quick UI, M1 movement A, M2 path tool, R rules sync, F format), Phase 2 design sessions (D1 Archer, D2 Mastery/Groups/Gear, D3 Skills, D4 Magic/Momentum), Phase 3 build (C content, X new systems).

A homebrew tabletop RPG (the "2d12 system") and its Foundry VTT implementation. This bundle has everything. Read this file first.

## Where we are now (v0.0.175, 140 tests; READ THIS FIRST)
- **2026-10-28: v0.0.175** (branch pack-3-movement-b): Lucas's test of v0.0.174 passed except the path tool's movement (now one movement with waypoints, and the reachable squares are shown). **Lucas's PC gets branches by double-clicking `Update Foundry.cmd`** (project root; it runs tools/sync-pack.ps1 -Interactive: newest unmerged pack branch, or back to main after a merge, tests, packs rebuilt when needed, waits for Foundry to be closed; Task Scheduler is optional and was never in use): /testpack and /mergepack in a cloud session only change the cloud copy. The compendium packs are not in git: the sync (or build-packs) makes them on his PC.
- **2026-10-28: Pack 3 (M2, movement B) DONE as v0.0.174, waiting for Lucas's test** (branch pack-3-movement-b, its pull request): the path tool for Slid and Reposition (Relocate within Reach, no Hazardous Terrain, Line of Effect at every square), Immobilized's DC, Steadiness bonuses from effects, Features and Talents, and the grey tiers table fixed. Packs Q and M1 are merged into main (v0.0.170-173). **Next: R** (the rules sync), then F (the format).
- **2026-10-28: v0.0.173** (branch pack-1-quick-ui, its pull request): Lucas's test of v0.0.172 passed except two fixes (the tiers table's grey rows, the Snapshot now a PNG); his rule answers are applied: **Reposition can't move through creatures** (book Chapter 3, the figure, the glossary; Foundry stops it there) and **a diagonal between two creatures is Difficult Terrain only between two unwilling ones**. Next: M2 (the path tool).
- **2026-10-28: Pack 1 (Q, quick UI) DONE as v0.0.172, waiting for Lucas's test** (branch pack-1-quick-ui, its pull request): the Steadiness tile always shown, a custom Steadiness in the Builder, the Damage Instance dialog restyled, a Snapshot button on Cover height, the Talent's Traits drop-down, Show help on Action and Talent sheets. Pack 2 (M1) is merged into main (v0.0.170-171). **Next: M2** (the path tool); before it, Lucas answers the Reposition proposal in book/rules-backlog.md.
- **2026-10-28: v0.0.171** (same branch, pack-2-movement-a): fixes from Lucas's test of v0.0.170: the solid-corner check for your own movement is a world setting (off by default), and the movement label counts a diagonal between two creatures. The book change "Reposition can't move through creatures" is PROPOSED in book/rules-backlog.md, not applied.
- **2026-10-28: Pack 2 (M1, movement A) DONE as v0.0.170, waiting for Lucas's test** (branch pack-2-movement-a, its pull request): Pulled with the strict cone (the book's two figures are test t140), Haul, Corners (walls touching the corner point, Tiles marked Solid; a diagonal between two creatures), Forced Movement never squeezes, the Squeezing condition (GM-applied), the straight-line tie for Charge. **Pack 1 (Q) has NOT been run yet** (Lucas asked for Pack 2 first): Q becomes the next version (v0.0.171), then M2 (the path tool). The changelog of v0.0.170 is in foundry/twod12/docs/reference.md.
- **Foundry system** (foundry/twod12) is at **v0.0.169** (the polish pass: item sheets and Edit Versions in the sheet's look, waiting for Lucas's test; v0.0.167 was a cleanup). The agreed order of the next work is at the top of foundry/foundry-backlog.md. Recent work: the Bestiary NPC model and the NPC **Builder** tab (v0.0.163-164), Ward Defense = 11 + Power Modifier (v0.0.162), the **Line of Effect** button (v0.0.165), Leaning cover from the vision peek point and the **Cover height calculation** side view (v0.0.166). What each version did: foundry/twod12/docs/reference.md (Changelog).
- **The book** (book/) builds **seven documents** from one source: Core Rules, Species, Gear, Talents, Paladin, Archer, Bestiary (`python3 build_rules.py`; 0 unresolved refs; 9 open "to be decided" boxes). The Bestiary uses ratings per role and the **CV Multiplier** / **Combat Value (CV)**.
- **Book Chapter 3 v2 is APPLIED (2026-10-23)** (Lucas's change log, with his answers): see book/rules-backlog.md ("Core Rules change log v2 APPLIED") and archive/book-drafts/changelog-core-v2-applied.txt. **v0.0.169 (F1, waiting for Lucas's test): Foundry follows the book for the [Ranged] Engaged banes, Fists as a weapon (Non-threatening), Shove/Relocate, Collision from the chosen destination and Steadiness (species, NPC Builder row); F2 (Haul and Pulled), F3 (the path tool: Slid, the new Reposition, Immobilized's DC) and F4 (Corners, Squeezing) are next.** **Foundry is still BEHIND the book** for those for Forced Movement (Pulled, Slid, the new Reposition), Corners, Squeezing, Unarmed and the [Ranged] Engaged banes: the staged plan F1-F4 is at the top of foundry/foundry-backlog.md. **Also applied the same day: the Handle Actions (Shove, Relocate, Haul), SR, Steadiness, Immobilized's new rule and Fists as an ordinary weapon with the property Non-threatening** (rules-backlog, archive/book-drafts/changelog-handle-actions-applied.txt); the Foundry plan F1-F4 in the backlog lists their Foundry part. **Lucas's notes of 2026-10-25: Batches A-D APPLIED (rules-backlog.md); NEXT: the Foundry quick version (F-a to F-d in foundry-backlog.md), then the Archer design session.** **Core review v3 applied (2026-10-24): names (list of 20, README "Names in the examples"), Y for you in diagrams, Corners, Straight Line, Pulled; the Foundry part is in foundry-backlog.md.** **Format applied to ALL documents (2026-10-23): text colors, trait groups (Roll / Requires / Kind / Damage / Keywords), weapon properties uncolored: see rules-src/README.md; Foundry must follow it: foundry-backlog.md, "FORMAT". Pick lists are named Repertoire (decided).** **Ruler by level, the Bestiary's levels 1-3 and the new Rally Points are DONE (rules-backlog, ruler/README.md); the NPC scaling is centered on Medium (fixed). NEXT: the Foundry passes (F2 and on) with the new Rally formula, the NPC tables and the format; or the book's Mastery, Weapon Groups and Gear.** **Paladin and Archer rewritten in the class style (2026-10-23): `<!-- style: class -->`, see rules-src/README.md and rules-backlog.md (LEVELS); Bane and Boon capitalized everywhere; next: re-run the ruler with the level list, then the Bestiary's Level 2+ rows and Rally Points.** Next in Lucas's order: levels for Paladin and Archer, per-weapon Mastery and Weapon Groups, Gear, then the Foundry passes; the Foundry "next version" items (Talent Traits dropdown, a help-tips toggle on Action and Talent sheets) are in the backlog.
- **Nothing asked is waiting.** Candidates for next work (ask Lucas): PC levels (they fill the Bestiary's empty Level 2+ rows), Mastery steps 8 and 15, the book's open boxes, the rest of foundry/foundry-backlog.md "Not started" (Magic Talents, Hide, bursts/cones/lines, Patient Hunter, elevation in movement and areas, rewriting the opening of docs/reference.md).
- **Cleanup (v0.0.167):** finished drafts and old notes are in archive/ (keep or drop it; nothing in the bundle needs it).

## What is in the bundle
```
2d12-project/
  HANDOFF.md                 this file
  book/                      the rules (HTML, seven documents), built from Markdown
    rules-src/               the chapters (01-roll.md ... 09-glossary.md = Core; 11-species, 12-paladin, 13-archer, 14-bestiary, 15-gear, 16-talents), README.md (conventions, the documents), INDEX.md (a generated map)
    build_rules.py           python3 build_rules.py -> core-rules.html, species.html, gear.html, talents.html, paladin.html, archer.html, bestiary.html (also: --where Term)
    rules_tools.py           the checks the build runs (links, glossary, cards, placeholders)
    rules.css, rules-assets/ the look of the book
    diagrams/                diagrams.py draws every diagram of the book; a chapter places one with @@DIAGRAM:name@@
    ruler/                   the level 1 numbers: README.md (the PC ruler), ratings.py (the Bestiary's tables), defense.mjs, tablecheck.mjs, ruler.mjs... (they use the system's dice math; run them from anywhere)
    rules-backlog.md         THE LOG OF RULE DECISIONS and the open items of the book
  foundry/
    twod12/                  the Foundry system (id twod12, Foundry V14): module/, templates/, styles/, lang/, packs/, tools/, docs/reference.md, README.md
    foundry-backlog.md       what is left in the system, known limits, tools, and what could not be tried in Foundry
    reference.md             a copy of twod12/docs/reference.md (the system reference with the changelog)
  archive/                   history: finished book drafts (book-drafts/), old notes (old-notes/: the old HANDOFF, the old system README, the sheet design, the first message)
```
Python needs `markdown`. Node 22 is enough for the tests.

## Commands
- Book: `cd book && python3 build_rules.py` (builds the seven documents; "unresolved refs: 0" is the goal). `python3 build_rules.py --where Flanking`.
- System tests: `cd foundry/twod12 && node tools/tests/run.mjs` (138 tests; each has an expected output in tools/tests/expected; accept a meant change with `node tools/tests/run.mjs --update t84`). **Test numbers have gaps (t12b, t37b; t133 is old, new ones are t135-t142): check before creating a test file.** Lint: `npx eslint@8 --no-eslintrc -c tools/eslint.json --ext .mjs module`.
- Compendiums: the content is written in `tools/content.mjs` and compiled with the Foundry CLI: in foundry/ run `npm install @foundryvtt/foundryvtt-cli` (it creates node_modules and package files there: never ship them), then `node twod12/tools/build-packs.mjs`.
- Package for the user: bump `version` in system.json, add the changelog entry to docs/reference.md (copy it to foundry/reference.md), zip the `twod12` folder (without node_modules) as `twod12.zip`, run the tests from a fresh unzip. The project zip leaves out node_modules, package files and __pycache__.

## How the user and I work (keep this)
- The user (Lucas) tests in Foundry and answers with bullet points ("works", "bug", "idea"). Reply concisely and directly.
- **Every delivered version of the system gets a short test checklist** based on what was added, changed or removed, and a changelog entry in docs/reference.md. Always run the tests from a fresh unzip before delivering.
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

## First message for the new chat
> Continue the 2d12 project. I uploaded the bundle (2d12-project.zip). Read HANDOFF.md ("Where we are now"), unzip it, run the tests and the book build to check it all works, then tell me the state in a few lines. Then: [what to do next].
