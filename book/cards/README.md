# The cards: one source for every card (pack CS, 2026-11-03)

Every card (a Basic Action, a class Action, a Technique, a Talent, an NPC Action) is written **once**, here, in a JSON file per chapter. From it:
- **the book** renders the card where its chapter writes `@@CARD:Name@@` (`build_rules.py`, through `cards.py`: the same Markdown block the chapter used to hold, so the HTML is the same);
- **Foundry** builds the item: the Basic Actions as `module/basic-data.mjs` (`node tools/gen-basic.mjs`, a generated file; test t177 fails when it is stale), the compendium items from `tools/content.mjs` (from CS-2 on);
- **the ruler** reads one `action` line per Version (`spec.mjs cardLines`): every build has every card; a class file's own `action` line for the same name overrides it.

A rule change is **one edit in one file**. The design and its decisions: `book/card-source-proposal.md`. Status: `basic-actions.json` (CS-1); the Paladin and the Archer (CS-2), Gear, Talents and the Bestiary (CS-3) are still written by hand in rules-src, content.mjs and the ruler.

## Files
`basic-actions.json` (Chapter 6), then `paladin.json`, `archer.json`, `gear.json`, `talents.json`, `bestiary.json`. Each is `{ "_about": "...", "cards": [ ... ] }`; one object per card, one field per line, the keys in the order below. JSON: double quotes inside a text are written `\"`, no trailing commas, no comments (`"_note"` fields are ignored). A name must be unique across all files.

## A card (the core, shared by the three targets)
| Field | Meaning (write it as the book writes it) |
|---|---|
| `name` | The card's name (the head). |
| `category`, `level` | The head's category (`Basic Action`, `Divine Power`, `Paladin Escalation`, `Weapon Technique`) and the level after it (`Divine Power 1`); no `level` = none shown (0 in Foundry). |
| `flavor` | The Flavor line (I write it for every new card). |
| `traits` | Lowercase, in the book's order (by group: Roll, Requires, Kind, Damage, Keywords, alphabetical inside). `power` is the book's word (Foundry's key is `magic`). |
| `frequency` | `At-will`, `Turn`, `Round`, `Encounter`, `Daily`. |
| `escalation` | The Escalation it needs (a number). |
| `target`, `area`, `distance`, `vs` | The book's texts: `One creature`, `2 / 3 Emanation`, `Weapon` / `Reach` / `5 sq.`, `AD` / `WD` / `Body` / `Body or Instinct (the one used to roll)` / `DC 13` / `Instinct Save`. |
| `requirements`, `prerequisites`, `setup` | Their lines. |
| `interrupt` or `trigger` | The Reaction's line; its presence makes the card a Reaction (`1 / 2R`). |
| `rules` | Prose before the table (Weapon Attack's "You attack with the weapon you are wielding..."). Foundry: the item's description. |
| `versions` | One per Version (one column): `ap`; `tiers` (three strings: the damage as the book writes it, `[B] 1[W] + [Mod] + [M] 1d6 Ho`, then `; the effect text`; a cell with no damage is all text: `No effect.`, `Pulled 1.`); `effects` (the Effects cell, or the whole cell of a card with no tiers); `critical`; `mode` (a Split Action: `weapon` / `power`). A card with one Version writes one. |
| `text` | A Passive's or Talent's whole text (a card with no `versions`). |
| `notes` | Prose after the table (Steel Yourself's "You can't use this Action while Down..."). Foundry: the description. |
| `modifies` | The "Modifies" lines of a Talent that changes other Actions. |
| `weapon` | A Technique's weapon (Foundry puts the Technique on it). |
| `npc` | A Bestiary card's NPC (Foundry embeds the Action on the actor). |
| `book: false` | A card the book doesn't show (Break Free: a rule of Chapter 8 as a Foundry Action). |

**Links and bold:** the book's `[[Heading|label]]` and `**bold**` are written in the texts; Foundry and the ruler strip them.

## How the book, Foundry and the ruler read a card (the rules, so nothing is written twice)
- **Cost:** the Versions' AP: `1 / 2 / 3 AP`, `1 / 2R` for a Reaction, `0 AP`; no Versions = a passive card (no cost).
- **Foundry's text of a Version = the book's text** (links and bold stripped), through `convertEffects` (gen.mjs: `Pushed 2`, `Evade 1`, `Reposition 1`, `Evade half your Speed (rounded down)`, `uses 1 Rally Point`, `Appeal Save: 1d6 / 1d4 / 0`, a condition that ends its clause: `Prone.`, `Hindered (EoT);` become buttons; `a Prone creature` and `no longer Prone` stay words), **plus the card's `foundry.append`** (Lucas, 2026-11-03: buttons the text can't derive and map instructions come after the book's text, never instead of it). A cell that is one button keeps no final period.
- **Tiers:** `[B] 1[W] + [Mod] + [M] 1d6 Ho` becomes Foundry's Instances `1WB,1d6MH`; a [Weapon] Action adds [Mod] on Tiers 2 and 3 by itself, so its `[Mod]` is left out there (kept on Tier 1: `[B] [Mod] Pi` is `ModBPi`). The ruler takes the damage as written (it ignores pools and type codes).
- **Distance:** `Weapon` → `weapon`, `Reach` → `reach`, `5 sq.` → `5`; none → `self` for a card with no Target, else empty.
- **Vs:** `AD`, `WD` and `DC N` → none (the traits say which Defense); an Attribute → it; `A or B (the one used to roll)` → `roll`; `Instinct Save` → `instinct`. The ruler: `vs ad`, `vs wd`, `vs save instinct`.
- **Traits:** Foundry sorts them (keys); `power` → `magic`.
- **The ruler:** a line per Version that has damage tiers or a `ruler` string: `action Name [AP] | ap N | frequency | traits ... | [reaction] | [escalation N] | [vs ...] | [tiers a / b / c] | <ruler string>`; the Version's number is written only when the card has several (`Smite 2`). A text cell among damage cells counts as `0`.

## The extras (per target, on the same card)
- `foundry` (card level): `basic` (the key in BASIC_ACTIONS, for a Basic Action), `img`, `folder`, `automation` (`gold` / `silver` / `bronze` / `none`) and `automationNote`, `weaponUse` (`fists`, `kick`), `areaCfg` (the Foundry-only parts of an Area: who it targets, centered, kept, rounds), `settings` and `modifiers` (a Feature's or Talent's), `marksTarget`, `basicAttack`, `description` (a Feature whose Foundry text differs), `appendSetup`.
- `foundry` (in a Version): `append` (a string appended to the Version's text, or `{ "effects": ..., "x1": ..., "x2": ..., "x3": ..., "critical": ... }` for the tier texts), `fx` (`{ "t2": ["{{fx:Hindered (until Move)}}"] }`: the Effects a tier applies, by name), `areaSize`.
- `ruler` (in a Version): the modeling string appended to the line (`heal 1 self`, `on 2+: defense 1 ally`, `does Weapon Attack x2 | different`); `[PMod]` is the build's `power-mod`. `ruler` (card level): `{ "passive": "escalation 2: reduce [PMod] adjacent 1" }` for a Passive's line, `{ "skip": true }` or `false` for a card the ruler never models.

An extra never repeats a core field (a tier, a cost, a trait, the Frequency): test t177 fails on it.

## After editing a card
1. `cd book && python3 build_rules.py` (the card check lists a marker with no card, a card no chapter places, a block still written by hand).
2. `cd foundry/twod12 && node tools/gen-basic.mjs` when the card is a Basic Action (then the compendium: `node tools/build-packs.mjs`), and `node tools/tests/run.mjs`.
3. The ruler reads the files when it runs: nothing to do.
