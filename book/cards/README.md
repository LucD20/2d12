# The cards: one source for every card (pack CS, 2026-11-03)

Every card (a Basic Action, a class Action, a Technique, a Talent, an NPC Action) is written **once**, here, in a JSON file per chapter. From it:
- **the book** renders the card where its chapter writes `@@CARD:Name@@` (`build_rules.py`, through `cards.py`: the same Markdown block the chapter used to hold, so the HTML is the same);
- **Foundry** builds the item: the Basic Actions as `module/basic-data.mjs` (`node tools/gen-basic.mjs`, a generated file; test t177 fails when it is stale), the compendium items from `tools/content.mjs` (from CS-2 on);
- **the ruler** reads one `action` line per Version (`spec.mjs cardLines`): a build gets the card Actions its turns, reactions and Linked Actions name (with their other Versions); a class file's own `action` line for the same name overrides it (the catalogue's old cards, the pre-A1 Archer builds). A Passive is a build's choice: the class file names it (`passive Hallowed Stance`) and the card's `ruler.passive` string fills the line; a full line (`passive Hallowed Stance: escalation 2: reduce 2`) overrides the card's.

A rule change is **one edit in one file**. The design and its decisions: `book/card-source-proposal.md`. Status: **complete** (CS-1 v0.0.227 the Basic Actions, CS-2 v0.0.230 the Paladin and the Archer, CS-3 v0.0.232 Gear, Talents and the Bestiary): every card of the book is here; no chapter writes a card by hand, content.mjs holds no card, the class files write no card line.

## Files
`basic-actions.json` (Chapter 6), `paladin.json` (the Paladin document), `archer.json` (the Archer document; Mark Quarry is Foundry-only), `gear.json` (the Weapon Techniques; `weapon` names each one's weapon, from gear-d2.md), `talents.json` (the Talents; a card with `talent` is a Talent item), `bestiary.json` (the example NPCs' Actions, Foundry-only; `npc` names the actor). Each is `{ "_about": "...", "cards": [ ... ] }`; one object per card, one field per line, the keys in the order below. JSON: double quotes inside a text are written `\"`, no trailing commas, no comments (`"_note"` fields are ignored). A name must be unique across all files.

## A card (the core, shared by the three targets)
| Field | Meaning (write it as the book writes it) |
|---|---|
| `name` | The card's name (the head). |
| `category`, `level` | The head's category (`Basic Action`, `Divine Power`, `Paladin Escalation`, `Weapon Technique`) and the level after it (`Divine Power 1`); no `level` = none shown (0 in Foundry). |
| `flavor` | The Flavor line (I write it for every new card). |
| `traits` | Lowercase, in the book's order (by group: Roll, Requires, Kind, Damage, Keywords, alphabetical inside). `power` is the book's word (Foundry's key is `magic`). |
| `frequency` | `At-will`, `Turn`, `Round`, `Encounter`, `Daily`. |
| `escalation` | The Escalation it needs (a number): an Action's requirement ("Escalation 3", the Apex), or a Passive's rung (the card shows "Escalation N"; Foundry and the ruler read the rung from the text and the `ruler.passive` string). |
| `target`, `area`, `distance`, `vs` | The book's texts: `One creature`, `2 / 3 Emanation`, `Weapon` / `Reach` / `5 sq.`, `AD` / `WD` / `Body` / `Body or Instinct (the one used to roll)` / `DC 13` / `Instinct Save`. |
| `requirements`, `prerequisites`, `setup` | Their lines. |
| `interrupt` or `trigger` | The Reaction's line; its presence makes the card a Reaction (`1 / 2R`). |
| `rules` | Prose before the table (Weapon Attack's "You attack with the weapon you are wielding..."). Foundry: the item's description. |
| `versions` | One per Version (one column): `ap`; `tiers` (three strings: the damage as the book writes it, `[V] 1[W] + [Mod] + [R] 1d6 Ho`, then `; the effect text`; a cell with no damage is all text: `No effect.`, `Pulled 1.`); `effects` (the Effects cell, or the whole cell of a card with no tiers); `critical`; `mode` (a Split Action: `weapon` / `power`). A card with one Version writes one. |
| `text` | A Passive's or Talent's whole text (a card with no `versions`). |
| `notes` | Prose after the table (Steel Yourself's "You can't use this Action while Down..."). Foundry: the description. |
| `modifies` | The "Modifies" lines of a Talent that changes other Actions. |
| `weapon` | A Technique's weapon (Foundry puts the Technique on it when the weapon is in the compendium; t177 lists the others). |
| `cost` | A costed card with no table (Opportunity Attack: `1R` and prose): its `text` is its one Version (a Basic Action with an `interrupt` / `trigger` is a Reaction in Foundry too, since R-core). |
| `talent` | A Talent (an item of the Talents pack): `group` (combat / mobility / magic / skill), `theme`, `prereqs` (`[{ "kind": "talent", "name": "Brawler" }]`, `level`, `trait`), `prereqMode`, `modifiers`, `choiceLabel` / `choiceCount` / `choiceOptions` (Action names), `traits`, `description` (an Action-Talent's own line: "You gain the Sacred Weapon Action."). A Talent with Versions is also the Action it grants; `foundry.actions` names other Actions it grants (Brawler: Pummel). |
| `npc` | A Bestiary card's NPC (Foundry embeds the Action on the actor). |
| `book: false` | A card the book doesn't show (Break Free: a rule of Chapter 8 as a Foundry Action). |

**Links and bold:** the book's `[[Heading|label]]` and `**bold**` are written in the texts; Foundry and the ruler strip them.

## How the book, Foundry and the ruler read a card (the rules, so nothing is written twice)
- **Cost:** the Versions' AP: `1 / 2 / 3 AP`, `1 / 2R` for a Reaction, `0 AP`; no Versions = a passive card (no cost).
- **Foundry's text of a Version = the book's text** (links and bold stripped), through `convertEffects` (gen.mjs: `Pushed 2`, `Evade 1`, `Reposition 1`, `Evade half your Speed (rounded down)`, `uses 1 Rally Point`, `Appeal Save: 1d6 / 1d4 / 0`, a condition that ends its clause: `Prone.`, `Hindered (EoT);` become buttons; `a Prone creature` and `no longer Prone` stay words), **plus the card's `foundry.append`** (Lucas, 2026-11-03: buttons the text can't derive and map instructions come after the book's text, never instead of it). A cell that is one button keeps no final period.
- **Tiers:** `[V] 1[W] + [Mod] + [R] 1d6 Ho` becomes Foundry's Instances `1WB,1d6MH`; a [Weapon] Action adds [Mod] on Tiers 2 and 3 by itself, so its `[Mod]` is left out there (kept on Tier 1: `[V] [Mod] Pi` is `ModBPi`; kept everywhere on a Save Action, whose tiers are the target's result). The ruler takes the damage as written (it ignores pools and type codes).
- **Distance:** `Weapon` → `weapon`, `Reach` → `reach`, `5 sq.` → `5`; none → `self` for a card with no Target, else empty. **Area:** `2 / 3 Emanation` (or Burst, Line) with the Distance (`5 sq.`, `Your weapon's normal range`) becomes `areaCfg` (size, shape, within or withinRange; the Foundry-only parts from `foundry.areaCfg`) and the other sizes the Versions' `areaSize`; `Aura 2` is the item's Distance. **Features:** a card with no Versions is a Feature item: `text` (bold kept, links stripped) plus `foundry.append` is its description, `(Passive)` leaves the category, `foundry.settings` and `foundry.actions` (names) are its settings and granted Actions.
- **Vs:** `AD`, `WD` and `DC N` → none (the traits say which Defense); an Attribute → it; `A or B (the one used to roll)` → `roll`; `Instinct Save` → `instinct`. The ruler: `vs ad`, `vs wd`, `vs save instinct`.
- **Traits:** Foundry sorts them (keys); `power` → `magic`.
- **The ruler:** a line per Version that has damage tiers or a `ruler` string: `action Name [AP] | ap N | frequency | traits ... | [reaction] | [escalation N] | [vs ...] | [tiers a / b / c] | <ruler string>`; the Version's number is written only when the card has several (`Smite 2`). A text cell among damage cells counts as `0`.

## The extras (per target, on the same card)
- `foundry` (card level): `basic` (the key in BASIC_ACTIONS, for a Basic Action), `img`, `folder`, `automation` (`gold` / `silver` / `bronze` / `none`) and `automationNote`, `weaponUse` (`fists`, `kick`), `areaCfg` (the Foundry-only parts of an Area: who it targets, centered, kept, rounds), `settings` and `modifiers` (a Feature's or Talent's), `marksTarget`, `basicAttack`, `description` (a Feature whose Foundry text differs), `appendSetup`.
- `foundry` (in a Version): `append` (a string appended to the Version's text, or `{ "effects": ..., "x1": ..., "x2": ..., "x3": ..., "critical": ... }` for the tier texts), `fx` (`{ "t2": ["{{fx:Hindered (until Move)}}"] }`: the Effects a tier applies, by name), `areaSize`.
- `foundry.npcWeapon` (an NPC Action): the weapon in the NPC's hands (the attack's look); `foundry.areaCfg.center` for an Emanation centered on the user.
- `ruler` (in a Version): the modeling string appended to the line (`heal 1 self`, `on 2+: defense 1 ally`, `does Weapon Attack x2 | different`); `[PMod]` is the build's `power-mod` (`[PMod+2]`, `[PModx2]`, `[PModx2+1]` since pack R-classes). Pack R-classes added: `extra 1d6 mind each strike` (on every matching Action), `extra 1d8 mind first-hit strike bloodied` (`bloodied`: only against a Bloodied or Strained target), `mend 3d6+[Mod] any` with `allies 3` (the three most hurt), `vulnerable 2 round` (until your next turn, not EoT), and the passives `surge 1d8 mind` (the focus target at the start of your turn) and `mend [PModx2+1] any` (at the start of your turn); `reduce [PModx2] adjacent 1 always` (no "haven't left your square" clause). An `extra` or `surge` whose dice are Resolve damage (Holy) says `mind` (`extra 2d8 mind next strike`; pack R prep: the fight counts Body and Mind damage for Bloodied / Strained; without it the dice count as Body). `ruler` (card level): `{ "passive": "escalation 2: reduce [PMod] adjacent 1" }` for a Passive's line (used by the builds that name the Passive), `{ "skip": true }` or `false` for a card the ruler never models.

An extra never repeats a core field (a tier, a cost, a trait, the Frequency): test t177 fails on it.

## Cards with Lucas (planned, 2026-11-05)
Lucas writes a few cards at a time, in prose or in this format, saying on each what Foundry should automate; the session completes them (the `foundry` block above) and prices them, and the first ones are kept here as worked examples ("How Lucas writes a card"). Until then, Smite (settings on the item), Divine Surge (an Effect the ally's button uses) and Overwatch (a Reaction with a Trigger) are the cards to copy. MASTER-PLAN section 1, item 6.

## After editing a card
1. `cd book && python3 build_rules.py` (the card check lists a marker with no card, a card no chapter places, a block still written by hand).
2. `cd foundry/twod12 && node tools/gen-basic.mjs` when the card is a Basic Action (then the compendium: `node tools/build-packs.mjs`), and `node tools/tests/run.mjs`.
3. The ruler reads the files when it runs: nothing to do.

## Writing cards with Lucas (2026-11-05: the rules are his, learned card by card)

Lucas makes cards a few at a time, with Claude, and writes each in his own way so that Claude learns how he wants them, automation included. This section holds that way: every correction he makes to a generated card becomes a rule here, with the card as the example. Read it before writing any card. Until the first cards: the format above, Lucas's automation rule (a card is automated with general settings he can see and edit on the item, never with code that looks for its name; what needs no automation stays text), concise text, and a Flavor line written by Claude.

**How a card session goes:** Lucas writes two to four cards (the dice, the effect, what Foundry should do by itself and what stays by hand); Claude writes each as a card here, its Foundry item (the compendium build) and its worth line (the ruler), and gives a checklist; Lucas corrects; the corrections are written below as rules.

**Rules so far:** none yet.
