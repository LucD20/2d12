# The cleanup audit (2026-11-25)

Lucas: "I feel at this point, there is more confusion with rules, left over things and others that are getting in the way." Then: "Do it. Also, during the pass, checking for wording (like unnecessary wording you might have added, because I know sometimes some sentences are added because they are more a instruction you needed than necessary to be added). You can then give me in a file, could be a html with the wording/contradiction problems and the 'should be removed' options as well, then from the html I answer them all and send it to you."

Three passes. **Nothing in the rulebook or in Foundry is changed by the audit: every finding is a question on the answer page.**

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

**Nothing in the rulebook or in Foundry was changed.** When Lucas sends his answers, one pack applies them: the book first (rules-src, logged in `rules-backlog.md`), then Foundry.
