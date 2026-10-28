---
name: mergepack
description: Merge a tested pack branch into main and push it, refresh knowledge/, run the tests and rebuild the compendium packs when needed. Use when Lucas types /mergepack <branch>.
argument-hint: <branch>
disable-model-invocation: true
---

# /mergepack <branch>

Merge the branch `$ARGUMENTS` into `main`. Run from the repository root. If no branch was given, ask for it and stop.

1. **Merge.** Run `git status --porcelain`: if the working tree isn't clean, show what is there and stop. Then `git checkout main`, `git pull`, `git merge $ARGUMENTS`. If the merge has conflicts, show the conflicted files (`git diff --name-only --diff-filter=U`) and the conflict hunks, and stop: don't resolve them and don't push.
2. **Push and knowledge.** `git push origin main`. Then run `python tools/knowledge.py` and tell Lucas to re-upload `knowledge/` to the Project. (In a cloud session, skip knowledge.py and say so: Lucas runs it locally.)
3. **Tests and packs.** Run the tests (`cd foundry/twod12 && node tools/tests/run.mjs`) and report the summary line, with any FAIL or CHANGED test. Then apply the packs rule of /testpack step 4: if `foundry/twod12/tools/content.mjs` or `foundry/twod12/system.json` changed in this merge (`git diff --quiet ORIG_HEAD HEAD -- <those files>`), or `foundry/twod12/packs/` is missing, ask Lucas **"Is Foundry closed?"** (unlike /testpack, he may have it open after a merge) and only on yes rebuild: in `foundry/`, `npm install @foundryvtt/foundryvtt-cli` if `foundry/node_modules` is missing, then `node twod12/tools/build-packs.mjs`. Never commit node_modules or the package files.
4. **Report.** The merged version (`version` in `foundry/twod12/system.json`), the commit, the tests, whether the packs were rebuilt, and remind Lucas that **`/testpack main`** puts Foundry back on main whenever it is on another branch.
