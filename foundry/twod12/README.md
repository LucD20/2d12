# 2d12 System (Draft) for Foundry VTT V14

The Foundry VTT system of the 2d12 homebrew RPG (id `twod12`). The version is in `system.json`.

- **Install:** copy the `twod12` folder into `Data/systems/` (or unzip `twod12.zip` there), restart Foundry and create a world with this system.
- **How it works, and the changelog:** `docs/reference.md`. The rules are in the book (Core Rules and its documents).
- **Traits (v0.0.180):** on sheets, the pickers and the roll dialog's preview they are grouped chips with labels (Roll, Requires, Kind, Damage, Keywords, as in the book); on chat cards they are tight chips with a short line between groups and the group's name in the tooltip.
- **Rules (v0.0.181):** the Bestiary by Stage (levels 1-4, 5-7, 8-10) with CV ×100, the PC Health factor (Level + 17) ÷ 16 and the Modifier steps at levels 5 and 8, Guard, and the book's P1 Paladin and A1 Archer (the class items keep their structure; the new class window is pack C2).
- **Automation (v0.0.186):** cards are automated with settings on their items that you can edit (once per round, only against the marked creature, `[Mod]` in Bonus Damage, Ignore a Bane, Rally Points), not with code that tests their names. Talents carry their Category, Prerequisites (typed rows) and Theme as data. **v0.0.207 (editability sweep):** every card mechanic is on its item (Chat message, Weapon property, Starting Mastery settings; an Action's Weapon used); test t164 fails if a card's name appears in module/ code. The basic mechanics (no settings) are listed in foundry-backlog.md.
- **Weapon hands (v0.0.208, W):** a [Weapon] Action has a button per hand (2H, or M and O) instead of the "Which weapon?" window; a weapon remembers its hand (main / off; Swap on the Items tab); a held weapon comes before the Fists. The trait Gun and the property Firearm (D2).
- **Recommended module:** Quick Insert (switched on once per world when it is installed).

## Tests
`node tools/tests/run.mjs` runs every test (Node 18 or newer, no install needed). A test FAILS if it throws; CHANGED means its printed output differs from `tools/tests/expected/<name>.txt` (check the difference; accept intended changes with `--update`). Run some tests only with their names: `node tools/tests/run.mjs t44 t62`. Foundry never loads this folder.

## Compendiums
The starting content is written in `tools/content.mjs` and compiled with the Foundry CLI: install `@foundryvtt/foundryvtt-cli` outside this folder (`npm install @foundryvtt/foundryvtt-cli` in its parent), then run `node twod12/tools/build-packs.mjs` from there.
