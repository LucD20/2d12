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
