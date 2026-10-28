# 2d12 System (Draft) for Foundry VTT V14

The Foundry VTT system of the 2d12 homebrew RPG (id `twod12`). The version is in `system.json`.

- **Install:** copy the `twod12` folder into `Data/systems/` (or unzip `twod12.zip` there), restart Foundry and create a world with this system.
- **How it works, and the changelog:** `docs/reference.md`. The rules are in the book (Core Rules and its documents).
- **Recommended module:** Quick Insert (switched on once per world when it is installed).

## Tests
`node tools/tests/run.mjs` runs every test (Node 18 or newer, no install needed). A test FAILS if it throws; CHANGED means its printed output differs from `tools/tests/expected/<name>.txt` (check the difference; accept intended changes with `--update`). Run some tests only with their names: `node tools/tests/run.mjs t44 t62`. Foundry never loads this folder.

## Compendiums
The starting content is written in `tools/content.mjs` and compiled with the Foundry CLI: install `@foundryvtt/foundryvtt-cli` outside this folder (`npm install @foundryvtt/foundryvtt-cli` in its parent), then run `node twod12/tools/build-packs.mjs` from there.
