# Pack CS proof: three cards from one source

Throwaway (2026-11-03, pack CS proposal: `book/card-source-proposal.md`). Nothing in the real builds reads this folder.

- `cards.json`: Weapon Attack, Smite and Lock & Loose in the proposed format (core fields shared by the three targets, `foundry` and `ruler` extras).
- `proof.mjs` (Node): generates the book's card block, the Foundry item data and the ruler's action lines, and diffs each against what exists today (rules-src, tools/content.mjs or module/basic.mjs, the class files of the ruler).
- `book_block.py` (Python, standard library only): the book side as `build_rules.py` would do it; diffs the block against rules-src.

Run from the repository root (the Foundry packs don't need to be built; the Foundry CLI isn't needed):
```
node book/card-source-proof/proof.mjs
python3 book/card-source-proof/book_block.py
```

## The output (2026-11-03)
```

=== Weapon Attack
  book block (rules-src/06-basic-actions.md): IDENTICAL (24 lines)
  Foundry item (module/basic.mjs): IDENTICAL (7 fields: level, traits, targets, distance, frequency, versions, flavor)
  ruler line (classes/paladin-smite-1.txt): DIFFERENT
    - action Weapon Attack | ap 1 | at-will | traits strike weapon | vs ad | tiers 0 / 1[W] + [Mod] / 1[W] + [Mod]
    + action Weapon Attack | ap 1 | at-will | traits strike weapon | vs ad | tiers 0 / [B] 1[W] + [Mod] / [B] 1[W] + [Mod]
    parsed by spec.mjs (what the numbers use): IDENTICAL (the text differs only in spacing or in the pool / type tags the ruler ignores)

=== Smite
  book block (rules-src/12-paladin.md): IDENTICAL (23 lines)
  Foundry item (tools/content.mjs): IDENTICAL (9 fields: category, level, traits, targets, distance, frequency, versions, flavor, automation)
  ruler line (classes/paladin-smite-1.txt): DIFFERENT
    - action Smite 1 | ap 1 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] / [B] 1[W] + [Mod] + [M] 1d4 / [B] 1[W] + [Mod] + [M] 1d6
    + action Smite 1 | ap 1 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] / [B] 1[W] + [Mod] + [M] 1d4 Ho / [B] 1[W] + [Mod] + [M] 1d6 Ho
    parsed by spec.mjs (what the numbers use): IDENTICAL (the text differs only in spacing or in the pool / type tags the ruler ignores)
  ruler line (classes/paladin-smite-1.txt): DIFFERENT
    - action Smite 2 | ap 2 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] + [M] 1d6 / [B] 1[W] + [Mod] + [M] 1d10 / [B] 1[W] + [Mod] + [M] 2d8 | on 2+: defense 1 ally
    + action Smite 2 | ap 2 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] + [M] 1d6 Ho / [B] 1[W] + [Mod] + [M] 1d10 Ho / [B] 1[W] + [Mod] + [M] 2d8 Ho | on 2+: defense 1 ally
    parsed by spec.mjs (what the numbers use): IDENTICAL (the text differs only in spacing or in the pool / type tags the ruler ignores)
  ruler line (classes/paladin-smite-1.txt): DIFFERENT
    - action Smite 3 | ap 3 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] + [M] 1d6 / [B] 1[W] + [Mod] + [M] 1d10 / [B] 1[W] + [Mod] + [M] 2d8 | on 2+: defense 1 ally; on 2+: guard 1d8+[Mod] self
    + action Smite 3 | ap 3 | round | traits divine signature strike weapon | vs ad | tiers [B] 1[W] + [M] 1d6 Ho / [B] 1[W] + [Mod] + [M] 1d10 Ho / [B] 1[W] + [Mod] + [M] 2d8 Ho | on 2+: defense 1 ally; on 2+: guard 1d8+[Mod] self
    parsed by spec.mjs (what the numbers use): IDENTICAL (the text differs only in spacing or in the pool / type tags the ruler ignores)

=== Lock & Loose
  book block (rules-src/15-gear.md): IDENTICAL (22 lines)
  Foundry item (tools/content.mjs): IDENTICAL (8 fields: category, level, traits, targets, distance, frequency, versions, flavor)
  ruler line (classes/archer-double-1.txt): DIFFERENT
    - action Lock & Loose | ap 1 | round | traits ranged shot strike weapon | vs ad | tiers [Mod] / 1d4 + 2 + [Mod] / 1d10 + [Mod] | on 2: debuff Hindered (until it moves); on 3: debuff Immobilized
    + action Lock & Loose | ap 1 | round | traits ranged shot strike weapon | vs ad | tiers [B] [Mod] Pi / [B] 1d4+2+[Mod] Pi / [B] 1d10 + [Mod] Pi | on 2: debuff Hindered (until it moves); on 3: debuff Immobilized
    parsed by spec.mjs (what the numbers use): IDENTICAL (the text differs only in spacing or in the pool / type tags the ruler ignores)

ALL MATCH: the book blocks, the Foundry items and the ruler's numbers are the same as today's.
```

What it shows: the book block is byte-identical for the three cards (Node and Python); the Foundry item data is identical field by field (versions included: the tier Instances, the texts, the Effects applied, the automation rank); the ruler lines differ in text only where the book writes the pool tags and damage type codes the ruler ignores (`[B]`, `Ho`, `Pi`) and in spacing (`1d4+2+[Mod]`), and parse to the same damage, so the numbers are the same.
