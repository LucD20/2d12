# What the applied answers leave to follow

Places the passes saw that an applied answer now contradicts, which no answer named. They follow from Lucas's decisions; a last pass applies them (list here, one line each, with the answer they follow from).

## After pass B1 (Chapters 1 to 4)
- Chapter 2, Unspent AP: the sentence now says "start of your next turn" twice; its example still has Drak gain "Guard 2 for 1 round" (B1-030: it ends when you regain AP again).
- Glossary, Guard: the unspent-AP Guard still "lasts 1 round" (B1-030).
- Glossary, Interrupt and Trigger: still "before / after the Action that triggers it" (B1-033: the moment it names).
- Glossary, Moves closer and Moving away: still "the distance after the movement" (B1-038: each square).
- Chapter 2, Disrupting Actions: "When an Action is disrupted, it doesn't happen" against B1-037 (a Trigger stops the Action where it is) and B1-044 (what already happened stays).
- Chapter 2, Requirements: "a Requirement line ... you must meet them" (singular now, B1-042).
- Glossary, Escalation: still names the Escalation Passives (B3-009 rewrites the row) and says "never spent" (B1-059 keeps it once, in Chapter 2).
- Glossary: "Debuff" is now defined (B1-049) and has no row.
- Glossary, Initiative slot: links to End of Turn; the definition now opens Rounds and Durations (B1-056).
- Chapter 1, the tier table's Result column still names Failure / Marginal Success / Full Success (B1-001 moved Doubles and the Summary to Tier numbers; the names stay as flavor by its second option not taken).
- rules-src/README.md line 29: still says Roll Effects holds Cleave (B1-015).
- B1-082 against B1-063 (both on Chapter 3's Down creature sentence): B1-063's text was applied (a creature that is Down and still fighting holds its space; an Unconscious and a dead one are Difficult Terrain).

## After pass B2 (Chapters 5 to 8, Species, Gear, the Basic Actions' cards)
- B2-012 writes "the weapon's type and subtype" where B2-071 asks for "pool and subtype" everywhere; Chapter 4's "(Vigor, the weapon's type)" and the Glossary's [W] row ("damage type") were left (B2-071).
- Glossary: Release still "let go of it with one hand" (B2-034); Regrip still "(1 AP, no Handle)" (B2-033); Leaning still "cover is calculated" (B2-028).
- Gear, Fists: still "a Weapon Action can use them" beside the new "isn't the Basic Attack" (B2-020).
- Chapter 8, Immobilized: the Lana and Jared example still says "nothing happens and the effect is wasted" (B2-063: only the movement fails).
- Chapter 1, Empowered: "the one creature it chose before the Saves" also stands for rolls that aren't Saves (B2-060).
- Examples still on placeholder weapons (B2-073): Light's "such as a Dagger or a Handaxe", "a pistol, a musket", "a bow, a crossbow" in the traits and the Glossary, the Glossary's Light row, the Archer document's "such as a Dagger". (The Knuckle Dagger sentence stays: B2-077.)
- rules-src/README.md: still lists Split in the Roll trait group and Divine, Fear, Focus, Magical as separate entries (B2-051, B2-043).
- B1-069 against B2-073: B1-069 put "a Pike has Range 3" into Chapter 3; B2-073 (only the four designed weapons in examples) took the Pike out again. The Long bullet keeps its rule sentence, without the pike.
- "Up to" before a movement's distance, elsewhere (B2-009's list, a question for Lucas): Charge ("at least 3 squares and up to your Speed"), Lay On Hands ("You Advance up to 5 squares").

## For Foundry (from pass B2; the cards' `foundry` blocks were not touched)
- `book/cards.py` gained two things `cardmodel.mjs` must mirror (t260): a Version's own Requirement line (Crawl's 2 AP), and Versions whose lines are all equal printed once (Seek).
- Advance's `sub` "move up to your Speed" no longer matches its text (no Move button); Shake Off's `sub` "makes a Save" no longer matches and its new `vs` reads as a roll; Relocate's Reposition was kept within Reach by a requirement text now cut (B2-021); Break Free rolls "the higher" Attribute against B2-046 (you choose); `module/basic-data.mjs` is stale (t177); Heal is now Tend.
