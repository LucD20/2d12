# 2d12 (Lucas's homebrew TTRPG + its FoundryVTT V14 system)

Read first, in this order: **HANDOFF.md** (state), **MASTER-PLAN.md** (the order of all open work), then the pack you were asked to run.

## What is here
- `book/rules-src/*.md` = **the rulebook source (the only thing to edit)**. `python3 build_rules.py` (in `book/`) builds 7 HTML documents; never edit the HTML. Conventions: `book/rules-src/README.md`. Numbers: `book/ruler/` (README + scripts). Diagrams: `book/diagrams/diagrams.py`.
- `foundry/twod12/` = the Foundry system (module/, templates/, tools/content.mjs = the compendium content, tools/tests = 187 tests; build the packs first in a fresh clone).
- Backlogs: `book/rules-backlog.md` (rules log), `foundry/foundry-backlog.md` (what Foundry must follow). `archive/` = applied change logs.

## Commands
- Book: `cd book && python3 build_rules.py` (goal: `unresolved refs: 0`; it also runs checks: names, pronouns, headings). Needs Python `markdown`.
- Tests: `cd foundry/twod12 && node tools/tests/run.mjs` (Node 18+; 187 tests, all must pass; `--update tNN` only for a change I meant). Test numbers have gaps: check before creating one. Lint: `npx eslint@8 --no-eslintrc -c tools/eslint.json --ext .mjs module`.
- Compendiums: in `foundry/`, `npm install @foundryvtt/foundryvtt-cli`, then `node twod12/tools/build-packs.mjs`. **Never commit or ship node_modules or package files.**
- A Foundry version: bump `version` in `system.json`, add the changelog entry to `docs/reference.md` (copy it to `foundry/reference.md`), run the tests, and give Lucas **a short test checklist for that version** (what was added, changed, removed).

## How to work (Lucas's rules)
- **One pack per session** (see MASTER-PLAN.md). Run it start to finish. **Don't stop to ask minor questions:** choose, and list them under "Assumptions I made" in the final report so Lucas can revert any. Ask only when something is truly blocked or a rule is ambiguous (one batch, at the end).
- Merge `notes.txt` (Lucas's messy running notes; his legend: [ADD] [DEL] [CHG] [Q] [IDEA] [NOTE] [FOUNDRY]) at the start of a pack, and say what was merged.
- "analyze", "brainstorm", "not applying yet", "don't write yet" = discuss only; note decisions in the backlogs; no edits until told to apply.
- Lucas decides the rules. Rules go into the book first (rules-src), then Foundry. Log every rule change in `rules-backlog.md`; update README, backlogs and HANDOFF at the end of every pack.
- Corrections apply going forward, not retroactively, unless asked.
- **Chat messages (Lucas, 2026-11-03):** every new feature that posts to the chat uses the system's design, never a plain text line: `sysCard` (title bar, bold lead line, text line) or `sysLine` (a short follow-up with an icon) from `foundry/twod12/module/sysmsg.mjs`, or the Action card look for Action results. When you touch an old plain message, convert it too.
- **No Foundry default windows (Lucas, 2026-11-05):** every new choice or prompt uses the system's style, never a `DialogV2` / `Dialog` window: a choice in a window is a pick window (`foundry/twod12/module/pickwindow.mjs`, the class window's format), a choice on the map is the bottom bar (`pickbar.mjs`, the Line bar's look). When you touch an old dialog, convert it (the list: foundry/foundry-backlog.md).
- **Cards are written Lucas's way:** before writing or changing a card, read `book/cards/README.md`, "Writing cards with Lucas" (his format and automation rules, learned card by card; cards come a few at a time, with him). A card done with him is **Mithril** (`automation: "mithril"`) and goes into `book/cards/with-lucas.txt`.
- Ability and item text: concise and direct. **Lucas doesn't write Flavor: write the Flavor line of every new Action, Talent or Feature.**
- You cannot run Foundry. Say plainly what could not be tried and give a diagnostic when possible (with the Chrome extension connected you may smoke-test in the browser, but Lucas's own test stays the source of truth).
- Commit after each pack (clear message). Don't commit zips.
- At the end of every pack, run python tools/knowledge.py and tell me to re-upload knowledge/ to the Project; in a cloud session skip it, I run it locally. When a pack creates a design document still in progress, add it to DESIGN_DOCS in tools/knowledge.py; when one is fully applied to rules-src, remove it.

## Book conventions that bite (details: rules-src/README.md)
- Names in examples: only the list in the README, each used once before any repeats; he/him except Krysta and Lana; **in diagrams "you" is Y** (never O or K). Bane and Boon capitalized. Damage always writes its pool: `[V] 1[W] + [Mod]` ([V] Vigor, [R] Resolve since pack R-core; the old [B] / [M] are still read, don't write them). Write `[Strike] Action` when you mean the trait.
- Trait groups: Roll, Requires, Kind, Damage, Keywords (`GROUPS` in build_rules.py). Weapon properties have no color. Text colors come from `CLASS_TOKEN` and the CSS variables.
- Dist for areas: an Emanation is the 1-2-1 shape (a 2 Emanation = 21 squares); a Burst is on a corner. Light uses the same shapes and only matters where the TARGET is.

## Gotchas
- Foundry CSS is in the order it grew (version-tagged blocks): don't regroup without a visual check. The Builder tab and the cover-height window use light backgrounds with fixed dark text.
- Known gaps and unverified items: `foundry/foundry-backlog.md`.
- Foundry reads foundry/twod12 through a junction: `C:\Users\Lucas\AppData\Local\FoundryVTT\Data\systems\twod12` -> `D:\Minha Pasta\RPG\2d12-project\foundry\twod12` (the real Foundry data folder; not C:\data\Data). Rebuild the compendium packs only with Foundry closed. Lucas updates his Foundry by double-clicking `Update Foundry.cmd` (tools/sync-pack.ps1): give each pack branch a name starting with `pack-` so it finds it.
