# CS: one source for every card (proposal, 2026-11-03)

**Status: proposal only.** Nothing is migrated: the book, Foundry and the ruler are as they were. The proof in `book/card-source-proof/` is throwaway. MASTER-PLAN places the pack between playtest 3 and prep pack R (step 0.3b).

**The recommendation in three lines.** Put every card in one JSON file per chapter (`book/cards/*.json`, about 85 cards): its core (name, cost and Versions, traits, Frequency, Target, Distance, Area, Vs, Requirements, Interrupt or Trigger, tiers, Effects, Flavor, category, level) once, with the Foundry automation and the ruler's modeling as extra fields on the same card. The book builder, `content.mjs` and `spec.mjs` read those files directly (no generated copies to go stale); a test fails when a card lacks a target or an extra contradicts the core. Three sessions, each gated by the built HTML, the packs and the ruler's report being identical before and after; done before pack R, so R edits every card once instead of three times.

## 1. What can be shared and what can't

I read the three formats for the sample: Weapon Attack and Charge (Linked Actions), Smite (three Versions, Effects per Version), Lay On Hands (no roll), Double Shot (no roll of its own), Word of Radiance (Area), Shield of Faith and Bulwark of Faith (Reactions), Aura of Protection and the Passives (Escalation), Lock & Loose and Reaping Sweep (Techniques), Opportunity Attack (a Talent that changes other Actions), the Orc Warrior's Cleaver and Brutal Swing (Bestiary).

### What the three already agree on (the core, shared)
| Field | Book (rules-src block) | Foundry (content.mjs) | Ruler (spec line) |
|---|---|---|---|
| Name | `<span>Smite</span>` | `name` | `action Smite 2` (the Version's AP after the name when there are several) |
| Category and level | `<span class="cat">Divine Power 1</span>` | `category`, `level` | (comment) |
| Cost and Versions | `1 / 2 / 3 AP`, `1 / 2R`, `0R`, none | `versions[].ap`, `reaction` | `ap N`, `reaction`; one line per Version |
| Traits | `*Divine • Signature • Strike • Weapon*` | `traits: ["divine", ...]` (Power is the key `magic`, label Power) | `traits divine signature strike weapon` |
| Frequency | `**Frequency:** Round` | `frequency: "round"` (`atwill`) | `round` (`at-will`) |
| Target, Distance, Area, Vs | `**Target:**`, `**Distance:** 5 sq.`, `**Area:** 2 / 3 Emanation`, `**Vs:** WD` | `targets`, `distance: "5"`, `areaCfg.size` + `versions[].areaSize`, `vs` (absent = AD) | `vs ad` / `vs wd` / `vs save instinct`; `area N` is modeling |
| Requirements, Escalation | `**Requirements:**`, `**Escalation:** 1` | `requirements`, `escalation` | `escalation 1` |
| Interrupt / Trigger | `**Interrupt:** A [Strike] Action would damage...` | `reaction: true, reactionKind: "interrupt", trigger: "..."` | `reaction` |
| Tiers | `[B] 1[W] + [Mod] + [M] 1d4 Ho` | `"1WB,1d4MH"` (Instances; a [Weapon] Action adds [Mod] on Tiers 2 and 3 by itself, so it is left out) | `tiers ... / ... / ...` (pools and type codes ignored) |
| Effects and Critical | the `**Effects**` row, one cell per Version; `**Critical**` | `versions[].effects`, `critical` (text run through `convertEffects`) | modeling (`on 2+: defense 1 ally`) |
| Flavor | `**Flavor:**` | the `FLAVOR` table (copied by hand from the book) | none |

The proof converts each of these mechanically for Weapon Attack, Smite and Lock & Loose and gets today's book block byte for byte, today's Foundry item field for field and today's ruler numbers (section 6).

### What stays per target (extra fields on the same card)
- **Foundry's automation**, kept as data on the card's `foundry` block, never as code: the icon and folder, the automation rank chip (Gold / Silver / Bronze / none) and its "By hand" note, the Effects a Version applies (`fx`: all / t1 / t2 / t3, by Effect name), `areaCfg`'s Foundry-only parts (who it targets, centered, kept, rounds), `weaponUse` (Fists, kick), `settings` on Features and Talents (Boons and Banes, Bonus Damage, Aura, Grant...), `modifiers` (Opportunity Attack's "Weapon Attack out of turn has a Critical"), and the **Foundry text of a Version when it carries buttons** (`@Use[...]`, `@Move[...]`, `@Effect[...]{...}`, `@Guard[...]`, the `[2Emanation 1/round]` template marker). Charge, Double Shot, Rolling Shot, Lay On Hands 2 and Smite's three Effects are such overrides; Lay On Hands' Target and Lock & Loose's tier texts are derived (the generator strips the book's `[[links]]`). Where a Version has no override, its Foundry text *is* the book's text.
- **The Effects, Conditions, weapons, armor, species, classes, PCs and the NPC actors** stay in `content.mjs`: they are not cards. The Bestiary's NPC Actions (Cleaver, Brutal Swing, Hold the Line, Ground Slam, Rally the Tribe...) are cards: they move to `bestiary.json` with an `npc` field, and `content.mjs` embeds them on their actor.
- **The ruler's modeling** stays the ruler's, as a `ruler` string per Version in the card: areas hit (`area 2`), heal targets (`heal 1 self`), `then Smite Light`, Linked Actions (`does Weapon Attack x2 | different | evade 1`), `allies 2.5 | rounds 2.5`, the effects (`on 2+: defense 1 ally`), and the Passives' lines (`escalation 2: reduce 2 adjacent 1`). Two of them bake a build's number into the card (`reduce 2` is the Power Modifier, `rally-bonus 4` is Power + 2): those keep a `[PMod]` placeholder `spec.mjs` fills from the build (`power-mod`), a ten-line change; until then the class file keeps its own line, which overrides the card's. **The builds** (attributes, weapon, turns, plan, `when`, `targeted`, the `Smite 2` names in turns) stay in `classes/*.txt`: they are not cards. The `catalogue/*.txt` files that hold **old cards** on purpose (the pre-P1 Paladin in `paladin.txt`) keep their lines: they are not the book's cards.
- **The book's rules prose** stays prose in rules-src: everything around the cards (the chapters, the examples, the Bestiary's NPC bullets with their average damage, the glossary). Only the card blocks move. A card's own prose (Weapon Attack's "You attack with the weapon you are wielding...", Steel Yourself's "You can't use this Action while Down") is part of the card (`rules` before the table, `notes` after).

### What the three disagree on today (found while reading them)
- **Shield of Faith**: the book and Foundry say 0R, 1d8 + Power Modifier; `catalogue/paladin-p1.txt` still prices `ap 1 | block 1d6+[Mod]` (the OT change was not carried to the ruler).
- **Word of Radiance and Aura of Protection** in `catalogue/paladin.txt` are the pre-P1 cards (on purpose: that file is the old set), but nothing marks them as such; a newcomer would take them for the book's.
- **Foundry lacks 14 of the 16 Weapon Techniques and 15 of the 17 weapons** (D2 is in the book with defaults; Foundry's list is in foundry-backlog.md for X). Expected, but invisible: the test (section 3) lists "cards with no Foundry item" as information, so the gap is always known.
- **Weapon Attack** is written 28 times across the ruler's files, Smite 26 times, Steel Yourself 23 (the same line copied into each build and catalogue); every AP change in pack R would be 20 to 30 edits per card in the ruler alone.

## 2. The format

### Where
`book/cards/` with one file per chapter that has cards: `basic-actions.json` (17), `paladin.json` (17), `archer.json` (16), `gear.json` (16 Techniques), `talents.json` (19), `bestiary.json` (the 11 NPC Actions of the four example NPCs, Foundry only until the Bestiary writes them as cards). Each file is `{ "cards": [ ... ] }`, one object per card, keys in the order below, one field per line (so a diff shows one changed field). The book's own folder, because the rules come first and the book is where Lucas reads them; Foundry and the ruler read across (`../../book/cards/`), as `content.mjs` already imports `../module/gen.mjs`.

### The language: JSON (not YAML, not a .mjs module)
- **YAML** is the friendliest to the eye, but nearly every tier value starts with `[B]` or `[M]`, which YAML reads as a list: every damage cell would need quotes, as would every text with a colon (`Interrupt: A [Strike] Action...`, `Vs: AD`). And both sides need a library (PyYAML and js-yaml, two YAML dialects with their own surprises: `Vs: No` is `false` in YAML 1.1). The format would fight the notation the whole book uses.
- **A .mjs module** is what `content.mjs` is today and the nicest for Foundry (helpers, comments, template strings), but Python cannot read it: the book would need Node at build time, or a generated JSON committed beside it (two copies again, the thing we are removing).
- **JSON** is read natively by Python and Node, needs nothing installed, fails loudly on a typo (the test says the file and the position), and diffs well one field per line. Its costs: no comments (a `"_note"` field, ignored by the generators), double quotes inside text must be escaped (the book's cards use none: the proof needed no escaping), no trailing commas. Chosen.

### The entry (the fields)
Core, shared by the three targets: `name`, `category`, `level` (absent = 0, no number in the head), `flavor`, `traits` (lowercase, the book's words: `power`, which Foundry maps to its key `magic`), `frequency` (the book's word), `escalation`, `target`, `area`, `distance` (the book's text: `Weapon`, `Reach`, `5 sq.`; Foundry derives `weapon`, `reach`, `5`), `vs` (`AD`, `WD`, `Instinct Save`), `requirements`, `prerequisites`, `interrupt` or `trigger` (the text; its presence makes the card a Reaction), `setup`, `rules` (prose before the table), `versions` (each: `ap`, `tiers` of three strings written as the book writes them, with `; effect text` after the damage, `critical`, `effects`, `mode` for a Split Action), `notes` (prose after the table), `text` (a Passive's or Talent's whole text), `modifies`, `weapon` (a Technique's weapon), `npc` (a Bestiary card's NPC).
Per target: `foundry` (card level: `img`, `folder`, `automation`, `automationNote`, `basic` (the key in BASIC_ACTIONS), `areaCfg` extras, `settings`, `weaponUse`, `modifiers`, `description` for a Feature whose Foundry text differs; per Version, inside `versions[]`: `effects`, `x1`..`x3`, `critical`, `fx`, `areaSize`) and `ruler` (per Version: the modeling string appended to the line; card level: `passive` for the Passives' line, `skip: true` for a card the ruler never uses). Effects are named (`{{fx:Smite (+1 Defense)}}`), never by uuid: the generator resolves the name with `uuidOf`, as `content.mjs` does today.

### Five of the sample cards, written out

**Charge** (a Basic Action, a Linked Action; the Foundry text is an override with buttons; the Foundry Requirements has no final period, which the generator strips):
```json
{ "name": "Charge", "category": "Basic Action",
  "flavor": "You close the distance in one straight, reckless line.",
  "traits": ["move", "self"], "frequency": "Round",
  "requirements": "You have at least Speed 3.",
  "versions": [
    { "ap": 2,
      "effects": "Advance at least 3 squares and up to your Speed in a straight line. You can't Charge through Difficult Terrain (an unwilling creature's space is Difficult Terrain), even if you have movement left: the Charge ends in the last **empty** square where the line is legal. At the end of your movement, make a Weapon Attack (1A) with 1 Boon against a creature of your choice.",
      "foundry": { "effects": "Advance at least 3 squares and up to your Speed in a straight line: @Move[charge|distance:speed+2*has(Battering Charge)|min:3|uncapped:yes|label:Charge]. You can't Charge through Difficult Terrain. At the end of your movement, make a Weapon Attack (1A) with 1 Boon: @Use[Weapon Attack|boons:1|empowered:has(Battering Charge)|label:Weapon Attack (1A, 1 Boon)]" } }
  ],
  "foundry": { "basic": "charge", "img": "icons/svg/thrust.svg" },
  "ruler": { "skip": true, "_note": "the map model plays Charge in code (map.mjs): no spec line" } }
```

**Smite** (three Versions, Effects per Version, Foundry text overrides for the light template and the Effect button; the proof's entry):
```json
{ "name": "Smite", "category": "Divine Power", "level": 1,
  "flavor": "Your weapon blazes with holy light.",
  "traits": ["divine", "signature", "strike", "weapon"], "frequency": "Round",
  "target": "One creature", "distance": "Weapon", "vs": "AD",
  "versions": [
    { "ap": 1,
      "tiers": ["[B] 1[W]", "[B] 1[W] + [Mod] + [M] 1d4 Ho", "[B] 1[W] + [Mod] + [M] 1d6 Ho"],
      "effects": "The target sheds Bright light in a 1 Emanation and takes 1 Bane when they try to hide, for 1 round.",
      "foundry": { "effects": "The target sheds Bright light in a [1Emanation 1/round] and takes 1 Bane when they try to hide, for 1 round." } },
    { "ap": 2,
      "tiers": ["[B] 1[W] + [M] 1d6 Ho", "[B] 1[W] + [Mod] + [M] 1d10 Ho", "[B] 1[W] + [Mod] + [M] 2d8 Ho"],
      "effects": "As 1 AP, but a 2 Emanation. You or one ally in the light gain +1 Defense for 1 round.",
      "foundry": { "effects": "The target sheds Bright light in a [2Emanation 1/round] and takes 1 Bane when they try to hide, for 1 round. You or one ally in the light gain @Effect[{{fx:Smite (+1 Defense)}}]{+1 Defense for 1 round}." },
      "ruler": "on 2+: defense 1 ally" },
    { "ap": 3,
      "tiers": ["[B] 1[W] + [M] 1d6 Ho", "[B] 1[W] + [Mod] + [M] 1d10 Ho", "[B] 1[W] + [Mod] + [M] 2d8 Ho"],
      "effects": "As 2 AP, and you or one ally in the light gain [[Guard]] 1d8 + [Mod]. You choose who gains the Defense and who gains the Guard separately: the same creature or two different ones.",
      "foundry": { "effects": "The target sheds Bright light in a [2Emanation 1/round] and takes 1 Bane when they try to hide, for 1 round. You or one ally in the light gain @Effect[{{fx:Smite (+1 Defense)}}]{+1 Defense for 1 round}. You or one ally in the light gain @Guard[1d8+mod]{Guard 1d8 + [Mod]}. You choose who gains the Defense and who gains the Guard separately: the same creature or two different ones." },
      "ruler": "on 2+: defense 1 ally; on 2+: guard 1d8+[Mod] self" }
  ],
  "foundry": { "img": "icons/svg/sun.svg", "folder": "Paladin", "automation": "gold" } }
```

**Shield of Faith** (a Reaction, an Escalation Active, no roll; today the ruler's catalogue line is stale, see section 1):
```json
{ "name": "Shield of Faith", "category": "Paladin Escalation",
  "flavor": "A shimmer of light holds steady between them and harm.",
  "traits": ["divine", "focus"], "escalation": 1, "frequency": "Turn",
  "target": "The creature the Strike would damage (you or an ally)", "distance": "5 sq.",
  "interrupt": "A [Strike] Action would damage you or an ally within 5 squares.",
  "versions": [
    { "ap": 0, "effects": "The damage that Strike deals to the target is reduced by 1d8 + your Power Modifier.",
      "ruler": "block 1d8+[PMod]" }
  ],
  "foundry": { "img": "icons/svg/shield.svg", "folder": "Paladin", "level": 1, "automation": "none" } }
```
(`level` sits in `foundry` here because the book's head writes "Paladin Escalation" with no number while the Foundry item says level 1; the migration decides whether the book should show the 1 or Foundry drop it. A difference the test would have flagged.)

**Word of Radiance** (an Area with a size per Version; Foundry derives `areaCfg` from Area and Distance and adds who it targets):
```json
{ "name": "Word of Radiance", "category": "Paladin Feature", "level": 1,
  "flavor": "You speak a word, and light pours from your hands across everything that stands against you.",
  "traits": ["area", "divine", "power"], "frequency": "Encounter",
  "target": "All enemies in the Area", "area": "2 / 3 Emanation", "distance": "5 sq.", "vs": "WD",
  "versions": [
    { "ap": 2, "tiers": ["[M] 1d10 Ho", "[M] 2d8 Ho", "[M] 3d6 Ho; Prone"], "ruler": "area 2 | on 3: debuff Prone" },
    { "ap": 3, "tiers": ["[M] 2d6 Ho", "[M] 2d10 Ho", "[M] 3d8 Ho; Prone"], "ruler": "area 2.5 | on 3: debuff Prone" }
  ],
  "foundry": { "img": "icons/svg/sun.svg", "folder": "Paladin", "automation": "gold", "area": { "targets": "enemies" } } }
```
(Derived: `areaCfg: { size: 2, shape: "emanation", within: 5, targets: "enemies", center: false, keep: false, rounds: 0 }` and `areaSize: 3` on the 3 AP Version; no `distance` key, as today; `"Prone"` becomes the tier's text and `convertEffects` makes it the Condition button.)

**Lock & Loose** (a Weapon Technique tied to the Crossbow; a tier effect applied by a compendium Effect, so its Foundry text stays plain; the proof's entry):
```json
{ "name": "Lock & Loose", "category": "Weapon Technique",
  "flavor": "A bolt to the knee, and they go nowhere.",
  "traits": ["ranged", "shot", "strike", "weapon"], "frequency": "Round",
  "target": "One creature", "distance": "Weapon", "vs": "AD", "weapon": "Crossbow",
  "versions": [
    { "ap": 1,
      "tiers": ["[B] [Mod] Pi", "[B] 1d4+2+[Mod] Pi; For 1 round, the creature is Hindered until they use a Move Action.", "[B] 1d10 + [Mod] Pi; Immobilized"],
      "foundry": { "x2": "For 1 round, the creature is Hindered until they use a Move Action.", "fx": { "t2": ["{{fx:Hindered (until Move)}}"] } },
      "ruler": "on 2: debuff Hindered (until it moves); on 3: debuff Immobilized" }
  ],
  "foundry": { "img": "icons/svg/target.svg", "folder": "Weapon Techniques" } }
```
(`weapon` makes `content.mjs` put the Technique on the Crossbow's `actions` list, as the hand-written `weapon(...)` line does today; a Technique whose weapon is not in Foundry yet is listed by the test as "no Foundry item".)

A Passive (Hallowed Stance) is the same object without `versions`: `"text"` holds its rule, `foundry.description` only if Foundry's text differs ("(Not automated.)" is appended by the generator from `automation: "none"`), `foundry.settings` its settings when it has them, `"ruler": { "passive": "escalation 2: reduce [PMod] adjacent 1" }`. A Talent that changes other Actions (Opportunity Attack) is an Action card with `"modifies"` for the book's "Modifies" lines and `foundry.modifiers` for the item's.

## 3. How each target is generated

Nothing generated is committed except one file (the Basic Actions' module data, below); each target reads `book/cards/*.json` when it builds, so the three cannot disagree, only be incomplete.

**The book.** rules-src keeps the chapters as they are, with a marker where each card block was: `@@CARD:Smite@@` (the same shape as `@@DIAGRAM:name@@`). `build_rules.py` loads `book/cards/*.json` once, renders the card's Markdown block (the proof's `book_block.py`: 40 lines, standard library) and hands it to today's `card()` unchanged; so the HTML, the colors (`CLASS_TOKEN`, the CSS variables), the trait groups and the open-and-close cards are untouched by construction. Small follow-ups: `rules_tools.py --where Term` also searches the card files; the checks (duplicate names, a card without a Frequency) run on the cards; `INDEX.md` lists the marker's line. A card block still written by hand in a chapter becomes a warning ("a card not in book/cards"), so the two ways cannot coexist silently.

**Foundry.** `content.mjs` gets `cardItem(card)` (the proof's `foundryItem`: about 60 lines, using `parseTierFull` and `convertEffects` as the hand-written `version()` does) and loops over the card files: Actions, Features and Talents become compendium items with their `foundry` extras; `weapon` adds the Technique to its weapon; `npc` embeds the NPC Action on its actor. The `FLAVOR` and `AUTO` tables disappear (they are fields of the card). The **Basic Actions** are not compendium items: `module/basic.mjs` builds them on every actor from `BASIC_ACTIONS`, code Foundry runs in the browser, which cannot read the book's folder. So `tools/gen-basic.mjs` writes `module/basic-data.mjs` (generated, committed, headed "generated from book/cards/basic-actions.json, do not edit") from the 17 cards, and `basic.mjs` imports it; the test fails when it is stale. **Lucas's rules hold:** the generators are data to data, `module/` gains no code that looks up a card's name (t164 is unchanged and still passes: the only names in `module/` are the Basic Actions', which it allows), and every automation stays a setting or field on the item, now written in the card's `foundry` block instead of a `content.mjs` call.

**The ruler.** `spec.mjs` loads the card files at start and registers one `action` line per Version (the proof's `rulerLines`: the generated text goes through the same `parseSpec`, so there is one parser and one syntax) and one `passive` line per Passive with a `ruler.passive`, with `[PMod]` filled from the build's `power-mod`. Every build sees every card; a class file that still writes an `action` line for a card **overrides** it (experiments, options, old cards), and `catalogue/*.txt` keeps its lines. The class files lose their copied card lines (Weapon Attack, Steel Yourself, Smite 1 to 3...) and keep what is theirs: numbers, weapon, turns, plan, `when`, and modeling lines that are not cards.

**The test (t175, the next free number).** It loads the card files and fails when: a card has no Foundry item and no `foundry: false` (the Techniques of weapons not in Foundry are listed as information, not failure); a Foundry item or an NPC Action exists in `content.mjs` by hand with a card's name; a rules-src chapter has a card block or lacks the marker of a card of its chapter; `module/basic-data.mjs` is stale; a `foundry` extra repeats a core field (a tier, a cost, a trait: only the core may say them); a tier does not parse (Foundry's `parseTierFull` leaves text where damage was expected, or the ruler's `parseDamage` throws); a Version's `ruler` string does not parse. Because the targets read one source, "the three disagree" can only mean "a card is missing somewhere" or "an extra contradicts the core", and those are what it checks. The book's side of the same check runs in `build_rules.py` (it prints the warnings with the others).

## 4. Verification for the migration

Each migration session proves it changed nothing:
1. **The book:** `python3 build_rules.py` into a second folder before and after, `cmp` the seven HTML files: identical. The proof shows the method works (the committed HTML already rebuilds byte-identical in this cloud session, so the comparison is clean).
2. **Foundry:** `node tools/build-packs.mjs` before and after, `diff -r packs/_source` (JSON, stable ids from the names): identical; `node tools/tests/run.mjs`: 172 ok, plus t175; `npx eslint` clean.
3. **The ruler:** `node book/ruler/spec.mjs --quiet` before and after, `diff report.md` empty (seeded random numbers, so the same files give the same report); `--check` prints `ok`. `positions.mjs` and `econ.mjs` are not rerun (13 minutes; they read the same class files, so an unchanged report.md covers them).
4. **Lucas, by eye in Foundry** (one short checklist with the first version after each session): the compendium folders look the same (Paladin, Archer, Talents, Weapon Techniques, the old-cards folders); drag Smite, Lock & Loose and Charge onto a PC and use them (the buttons, the Effects applied, the rank chip and its tooltip); the Orc Warrior's Actions; the Basic Actions refreshed on an old actor (the v0.0.214 notification); the class window's Picks still offer the same cards.

## 5. The migration plan

Three sessions (M each), one branch and one commit each (`pack-cs-1`, `pack-cs-2`, `pack-cs-3`), before prep pack R:
1. **CS-1: the tooling and the Basic Actions.** The JSON loader and marker in `build_rules.py`, `cardItem` in `content.mjs`, `gen-basic.mjs` and `basic-data.mjs`, the loader in `spec.mjs`, t175, the README notes (rules-src, ruler, foundry-backlog). The 17 Basic Actions move (the hardest Foundry texts: `@Move` and `@Use` buttons, all overrides; the simplest book blocks). Weapon Attack, Steel Yourself and Charge leave the 28 + 23 ruler lines behind. Gate: the three diffs identical.
2. **CS-2: the Paladin and the Archer** (33 cards: Versions, Reactions, Areas, Escalation Actives and Passives, Features with settings, the Hallmark pairs). The class files lose their copied lines; `[PMod]` in `spec.mjs`. Gate: the diffs; the stale Shield of Faith line is fixed on purpose and reported (report.md changes only in prices.md's section for it, if at all: the P1 build does not use it).
3. **CS-3: Gear, Talents and the Bestiary** (16 Techniques, 19 Talents, 11 NPC Actions): `weapon`, `modifies` / `modifiers`, `npc`, the Talents' settings. Then the updates: README (rules-src), ruler/README, foundry-backlog "basic mechanics" and tools, HANDOFF, rules-backlog (a note that cards live in book/cards). Gate: the diffs, and the "no Foundry item" list is exactly D2's list for X.

Basic Actions first because they prove the two mechanisms the other cards don't need (the generated module file, the full-text overrides) on 17 small cards, and they are the lines most copied in the ruler. The order inside a session is a card at a time: migrate it, rebuild, diff; a card either moved or it didn't, so a session that runs out of time commits what it has.

**Risks.** (a) Card blocks with a layout the renderer doesn't know yet (a note between two fields, `Setup` lines, Split modes, the Opportunity Attack prose-as-Effects): the diff finds each; the renderer grows a field, never the card a special case. (b) Many Foundry texts are overrides (every card with a button: about 30), so a wording change on such a card still means two texts in one entry; honest, and no worse than today. (c) `convertEffects` turns some book words into buttons that the hand-written items avoided (Lock & Loose's "Hindered" is plain text on purpose): each is an `x2`-style override, found by the Foundry diff. (d) The two ruler lines with a build's number (`reduce 2`, `rally-bonus 4`): `[PMod]`, or the class file keeps the line. (e) Pack R lands before CS finishes: then R-book edits the cards wherever they are at that moment; nothing is lost, only the saving.
**Rollback.** Each session is one commit whose outputs are provably identical: `git revert` restores the hand-written blocks and lines; the card files can stay (nothing reads them without the loaders). A half-migrated chapter is also safe: the test says which cards are where.

## 6. The proof

`book/card-source-proof/` (throwaway, read nothing but itself): `cards.json` holds Weapon Attack, Smite and Lock & Loose in the format above; `proof.mjs` (Node) generates the book block, the Foundry item data and the ruler lines and diffs them against rules-src, `content.mjs` / `basic.mjs` and the class files; `book_block.py` renders the book block in Python with the standard library. Both print **ALL MATCH**: the three book blocks are byte-identical (Node and Python), the Foundry items identical field by field (the tier Instances, the texts, the Effects applied, the automation rank; 7 to 9 fields each), and the ruler lines parse to the same damage and effects (the text differs only in spacing and in the `[B]` / `Ho` / `Pi` tags the ruler reads and ignores). The full output is in the folder's README. Two things it exposed, both answered by the format: the automation rank is a Foundry-only field (`foundry.automation`), and Lock & Loose's Hindered text needs an `x2` override or Foundry turns it into a Condition button.

## 7. What it costs and what it saves, honestly

**Today**, a rule change to one card touches: the chapter in rules-src (1 edit), `content.mjs` (1 edit, plus the `FLAVOR` and `AUTO` tables for a new card), and the ruler (every build and catalogue that uses the card: Smite 26 lines in 15 files, Weapon Attack 28, a Technique 13; of these, 6 to 8 are the current builds, the rest old sets kept on purpose). Realistically **3 files and 8 to 10 edits per card**, by hand, with no check that they agree; section 1 lists the drift this already produced. Pack R changes the AP cost of nearly all 85 cards: roughly **250 hand edits**, then the weapon Techniques again.
**After**, the same change is **1 edit in 1 file** (the card's `ap` or tier or text), plus the Foundry override text when the card has one (same entry) and the ruler modeling string when the model changes (same entry). Pack R becomes about 85 edits plus the `turn` lines of the builds that name Versions by AP (`Smite 2`), which are modeling and move anyway. New cards (the Hallmark Reactions, the Escalation ladder, the Bow group's six Techniques) are written once.
**The price:** about three sessions (the size of R-classes), about 200 lines of generator code in three languages' worth of files (Python, two Node tools), one generated module file, and Lucas reading cards in JSON when he reads a diff (the built book and Foundry stay where he reads the rules). The JSON is less pleasant than the Markdown block for a long Effects text, and quotes inside text must be escaped.
**Worth it?** Yes, now: pack R and the weapon line would otherwise pay the three-places tax on every card twice in the next months, and the test turns "did we remember Foundry and the ruler" into a build error. Not worth it if pack R were small or the ruler were about to be retired; neither is the case.

## 8. Questions for Lucas (answer by exception; my default first)

1. **The source language.** Default: **JSON in `book/cards/`** (section 2). Alternative: the Markdown card block in rules-src stays the source and Node parses it for Foundry and the ruler (the book changes nothing, but the Foundry and ruler extras have no natural home in a Markdown block: an HTML comment or a fenced block per card).
2. **Foundry's button texts.** Default: **an override per Version** in the card's `foundry` block (the book's text and Foundry's text side by side in one entry). Alternative: one text with the buttons written in it (`@Move[...]`), which the book strips to its label; one text, but the book's source carries Foundry markup.
3. **When.** Default: **before prep pack R** (three sessions after playtest 3). Alternative: after R-book, migrating the cards with their new costs (one fewer pass over the old cards, but R-classes and R-Foundry edit three places one last time).
4. **The Bestiary's example NPC Actions.** Default: **in `bestiary.json`** (Foundry generated from them; the book's bullets stay prose, checked by name, AP and Frequency with a warning). Alternative: leave the 11 NPC Actions in `content.mjs` (they are examples, not rules).

## Assumptions I made
- One file per chapter, not one per card: 85 files is noise in a diff and in a folder; a chapter file is 300 to 600 lines.
- Effects are referenced by name (`{{fx:...}}`) and resolved with `uuidOf`, as `content.mjs` does; the Effects themselves are not cards and stay there.
- The Basic Actions get a generated, committed module file rather than moving to the compendium: the sheet builds them on every actor and the browser cannot read the book's folder.
- The ruler reads the cards directly (no generated `cards.txt`), so no generated file can go stale; a class file's own line overrides a card's.
- The Bestiary's bullets (with the average damage) stay prose; only the Foundry side of an NPC Action is generated.
- The proof covers three cards; the five written-out entries include two more (Charge, Shield of Faith, Word of Radiance) whose derivation rules (`areaCfg`, the final period of Requirements, `level` in the head) the migration settles with the diff.
