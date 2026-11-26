---
name: testpack
description: Check out a pack branch for Lucas to test in Foundry - fetch, checkout, pull, run the tests, rebuild the compendium packs when needed, and show the version's test checklist. Use when Lucas types /testpack <branch>.
argument-hint: <branch>
disable-model-invocation: true
---

# /testpack <branch>

Get the branch `$ARGUMENTS` ready for Lucas to test in Foundry. Run from the repository root. If no branch was given, ask for it and stop.


**Where this runs:** these steps change the checkout of the session that runs them. In a cloud session that is the cloud copy, not Lucas's PC: say so in the report. On his PC nothing is synced by a script (the sync scripts were removed on 2026-11-26): Foundry's Update button installs the release that a push to main or a `pack-*` branch publishes.

1. **Clean tree.** Run `git status --porcelain`. If anything is changed or untracked, stop: show Lucas the list (and `git diff --stat`) and do nothing else.
2. **Switch.** `git fetch origin`, then `git checkout $ARGUMENTS`, then `git pull`. If any of them fails, show the error and stop.
3. **Report and test.** Print the branch (`git branch --show-current`) and the `version` in `foundry/twod12/system.json`. Then run the tests: `cd foundry/twod12 && node tools/tests/run.mjs`. Report the summary line; for any FAIL or CHANGED test, show its name and what differs (`node tools/tests/<name>.mjs` against `tools/tests/expected/<name>.txt`). Never run `--update` here.
4. **Compendium packs** (they are not in git, so they go stale after every pull). Check `git diff --quiet origin/main -- foundry/twod12/tools/content.mjs foundry/twod12/system.json` (also rebuild if `foundry/twod12/packs/` doesn't exist). If they differ, rebuild the packs without asking: **Lucas always has Foundry closed when he runs /testpack** (Foundry reads this folder through a junction, and the packs must not be rebuilt while it is open). In `foundry/`, run `npm install @foundryvtt/foundryvtt-cli` if `foundry/node_modules` is missing, then `node twod12/tools/build-packs.mjs`. Show the item counts it prints. Never commit node_modules or the package files.
5. **Test checklist.** Since v0.0.425 the tests live in `foundry/to-test.md` and Foundry shows them (the world setting **Test checklist**, GM; Shift+K): say how many tests are open and which were added for this version (their `vX` is this version), and remind Lucas to turn the setting on. Paste back his **Copy report** to Claude.
6. **What to do in Foundry.** If `system.json` or the packs changed (step 4), tell Lucas to **restart the Foundry server** (quit Foundry and start it again) before testing; otherwise a **reload (F5)** of the world is enough.

Keep the report short: branch, version, tests, packs (rebuilt or not), the checklist, and the Foundry step.
