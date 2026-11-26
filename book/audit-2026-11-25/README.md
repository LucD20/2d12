# The cleanup audit (2026-11-25)

Lucas: "I feel at this point, there is more confusion with rules, left over things and others that are getting in the way." Then: "Do it. Also, during the pass, checking for wording (like unnecessary wording you might have added, because I know sometimes some sentences are added because they are more a instruction you needed than necessary to be added). You can then give me in a file, could be a html with the wording/contradiction problems and the 'should be removed' options as well, then from the html I answer them all and send it to you."

Three passes. **The audit itself changed nothing in the rulebook or in Foundry: every finding was a question on the answer page.** What was done after the answers is at the end of this file.

1. **The book against itself** (`findings-book-*.json`): contradictions, a rule stated in one place only, a word with no rule, a number from something replaced, an unmarked placeholder, and wording that is an instruction to the writer and not a rule.
2. **The records** (`findings-records.json`): which files are current, which are history.
3. **Foundry and the tools against the book** (`findings-foundry.json`): what the system still carries that the book dropped.

`index.html` is the answer page; it reads `findings.json`, which `node book/audit-2026-11-25/build.mjs` writes from the findings files after checking that every quote is in its file, word for word (a finding whose quote isn't found is listed and left out).

## A finding

```json
{ "id": "B1-001", "file": "book/rules-src/02-turns.md", "line": 52, "where": "Chapter 2, Unspent AP",
  "kind": "contradiction | stated-once | undefined-word | stale | placeholder-unmarked | ambiguity | wording-instruction | wording-rationale | wording-repeat | other",
  "quote": "one line or part of one line, copied word for word from the file",
  "other": [{ "file": "...", "line": 0, "quote": "the other side, word for word" }],
  "problem": "one or two plain sentences",
  "options": ["Remove it", "Keep it", "Reword: <the whole new text>"],
  "pick": 0, "confidence": "high | medium | low" }
```

## What came out (2026-11-26)

282 questions on the answer page: **243 on the rulebook** (Chapters 1 to 4: 90; Chapters 5 to 8, Species, Gear and the Basic Actions' cards: 79; the classes, the Bestiary and the Glossary: 74), **33 on Foundry and the tools**, **6 on the project's files**. By kind, in the book: 60 that can be read two ways, 37 the same rule repeated, 35 other (examples and arithmetic that don't follow their rule, steps out of order), 32 notes to the writer, 26 leftovers of something replaced, 25 contradictions, 14 reasons in the place of rules, 7 rules written in one place only, 6 words with no rule, 1 unmarked placeholder (Chapter 15's twelve weapons).

Four independent readers, one pass each; Claude read every finding, checked every quote against its file with `build.mjs` (none missing) and spot-checked the larger claims in the text. Seven findings were left out (`DROP` in `build.mjs`, each with its reason: six said the same as another reader's, one asked for the "NPCs have no Escalation" sentence Lucas removed). **Not checked:** the drawn diagrams, the built HTML pages, anything in Foundry by running it.

Pass 2 (these records) was applied directly: `HANDOFF.md` and `MASTER-PLAN.md` rewritten as the current state, the old files in `archive/old-notes/`.

The answer page is published as the artifact "2d12 Cleanup Audit" (https://claude.ai/artifact/4G7jW9VNCei8tLDPUxTNyf); Lucas's answers save in its database (collection `answers`, one document a finding: `choice` is the option's index from 0, `note` his own words) and its Copy my answers button gives them as text.

**Lucas answered all 282 (2026-11-26).** His answers: `answers.json`; how each was read: `work-order.json`; what changed in the book: `applied.md`; what Foundry followed: `foundry-needs.md`; the questions still held for him: `work-order.json`, `do: "hold"`.

## The removals and moves (2026-11-26, after the answers)

Done in Foundry v0.0.520's commit, from Lucas's answers to the Foundry and files questions:

- **Moved to `archive/`:** the card-source proof and proposal and 17 old drafts (`book-drafts/`), the Action Builder and the Card Workbench (`card-builder/`; `book/cards/manual/budget.js` stays, two files read it), 23 old mockup pages (`mockups/`). **Moved to `book/ideas/`:** `base-building.md`, `expedition-loop.md`. **Moved to `book/cards/set-aside/`:** `gear.json`, `talents.json` and Opportunity Attack's card.
- **Removed:** the sync scripts (`Update Foundry.cmd`, `tools/`), the default Elite ladder, the Ruler line on cards, the old Builder model (`npcBuilderContext`), FLAVOR / AUTO / AUTO_NOTE in `content.mjs`, 21 functions nothing called, test t179.
- **Repaired:** `node book/ruler/spec.mjs --check` prints "ok" again; the SIM reads its own frozen copy of the old Bestiary's tables (`book/ruler/sim/tables.mjs`, `npcbudget.mjs`), and its reports come out unchanged; the gallery's shots are saved again (98).
- **Not moved:** `playtest-2.md` to `playtest-6.md` (the SIM reads one; HANDOFF names them). **Not edited:** the guarded magic files, so 15 of them keep the old paths of moved files.
- **CLAUDE.md** (F-039): the test count, the sync scripts' sentence, the SIM's frozen copy, what `archive/`, `book/ideas/` and `book/cards/set-aside/` hold.

## The held questions answered (2026-11-26)

Lucas answered 16 of the held questions (B1-003, B1-023, B2-004, B2-009, B2-066, B2-069, B3-004, B3-035, B3-037 to B3-040, B3-052, B3-053, B3-070, B3-074): applied to the book and to Foundry v0.0.521 (`applied.md`, "The held questions answered"; `organize.mjs` carries his words as `ANSWERED`). Six stay held (`do: "hold"`): B3-033 and B3-065 (an NPC's items), B2-050, B3-011, B3-015, F-033.
