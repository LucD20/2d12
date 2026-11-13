# The cards: one source for every card (pack CS, 2026-11-03)

Every card (a Basic Action, a class Action, a Technique, a Talent, an NPC Action) is written **once**, here, in a JSON file per chapter. From it:
- **the book** renders the card where its chapter writes `@@CARD:Name@@` (`build_rules.py`, through `cards.py`: the same Markdown block the chapter used to hold, so the HTML is the same);
- **Foundry** builds the item: the Basic Actions as `module/basic-data.mjs` (`node tools/gen-basic.mjs`, a generated file; test t177 fails when it is stale), the compendium items from `tools/content.mjs` (from CS-2 on);
- **the ruler** reads one `action` line per Version (`spec.mjs cardLines`): a build gets the card Actions its turns, reactions and Linked Actions name (with their other Versions); a class file's own `action` line for the same name overrides it (the catalogue's old cards, the pre-A1 Archer builds). A Passive is a build's choice: the class file names it (`passive Hallowed Stance`) and the card's `ruler.passive` string fills the line; a full line (`passive Hallowed Stance: escalation 2: reduce 2`) overrides the card's.

A rule change is **one edit in one file**. The design and its decisions: `book/card-source-proposal.md`. Status: **complete** (CS-1 v0.0.227 the Basic Actions, CS-2 v0.0.230 the Paladin and the Archer, CS-3 v0.0.232 Gear, Talents and the Bestiary): every card of the book is here; no chapter writes a card by hand, content.mjs holds no card, the class files write no card line.

## Files
`basic-actions.json` (Chapter 6), `paladin.json` (the Paladin document), `archer.json` (the Archer document; Mark Quarry is Foundry-only), `gear.json` (the Weapon Techniques; `weapon` names each one's weapon, from gear-d2.md), `talents.json` (the Talents; a card with `talent` is a Talent item), `bestiary.json` (the example NPCs' Actions, Foundry-only; `npc` names the actor), `placeholders.json` (cards 1: Actions the book hasn't written yet, `placeholder: true`, so that links to them resolve: Hide; a card leaves it when the Action is written). Each is `{ "_about": "...", "cards": [ ... ] }`; one object per card, one field per line, the keys in the order below. JSON: double quotes inside a text are written `\"`, no trailing commas, no comments (`"_note"` fields are ignored). A name must be unique across all files.

**`set-aside.txt` (2026-11-12, Stage 0):** the names of the cards the book shows in no chapter for now, one a line: every Talent and Opportunity Attack. The cards stay in their files unchanged (Foundry and the ruler still read them, a Mithril card stays Mithril); `build_rules.py` doesn't ask for a marker for them and warns if one is placed or if a name is no card. To bring a card back, delete its line and place `@@CARD:Name@@`.

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
| `placeholder` | `true`: an Action the book hasn't written yet (Hide), with a `text`. The book shows the text where the chapter places the card; Foundry builds an Action item with no Versions (links open it to read); the ruler ignores it. |

**Links and bold:** the book's `[[Heading|label]]` and `**bold**` are written in the texts. The ruler strips them. **Foundry keeps the links (cards 1, Lucas, 2026-11-05):** a link to a rule of the book is a book link (`@Book[Heading]{label}`: the book's anchor; the Journal import comes later, until then the chip says where to read), a link to a card opens the compendium item to read (`[[Hide]]`; a Basic Action has no compendium item: a book link). Every card is an anchor in the book (`card-hide`), so `[[Hide]]` resolves. A link's `|` inside a table cell is safe (build_rules.py `cells`).

## How the book, Foundry and the ruler read a card (the rules, so nothing is written twice)
- **Cost:** the Versions' AP: `1 / 2 / 3 AP`, `1 / 2R` for a Reaction, `0 AP`; no Versions = a passive card (no cost).
- **Foundry's text of a Version = the book's text** (links and bold stripped), through `convertEffects` (gen.mjs: `Pushed 2`, `Evade 1`, `Reposition 1`, `Evade half your Speed (rounded down)`, `uses 1 Rally Point`, `Appeal Save: 1d6 / 1d4 / 0`, a condition that ends its clause: `Prone.`, `Hindered (EoT);` become buttons; `a Prone creature` and `no longer Prone` stay words), **plus the card's `foundry.append`** (Lucas, 2026-11-03: buttons the text can't derive and map instructions come after the book's text, never instead of it). A cell that is one button keeps no final period.
- **Tiers:** `[V] 1[W] + [Mod] + [R] 1d6 Ho` becomes Foundry's Instances `1WB,1d6MH`; a [Weapon] Action adds [Mod] on Tiers 2 and 3 by itself, so its `[Mod]` is left out there (kept on Tier 1: `[V] [Mod] Pi` is `ModBPi`; kept everywhere on a Save Action, whose tiers are the target's result). The ruler takes the damage as written (it ignores pools and type codes).
- **Distance:** `Weapon` → `weapon`, `Reach` → `reach`, `5 sq.` → `5`; none → `self` for a card with no Target, else empty. **Area:** `2 / 3 Emanation` (or Burst, Line) with the Distance (`5 sq.`, `Your weapon's normal range`) becomes `areaCfg` (size, shape, within or withinRange; the Foundry-only parts from `foundry.areaCfg`) and the other sizes the Versions' `areaSize`; `Aura 2` is the item's Distance. **Features:** a card with no Versions is a Feature item: `text` (bold kept, links stripped) plus `foundry.append` is its description, `(Passive)` leaves the category, `foundry.settings` and `foundry.actions` (names) are its settings and granted Actions.
- **Vs:** `AD`, `WD` and `DC N` → none (the traits say which Defense); an Attribute → it; `A or B (the one used to roll)` → `roll`; `Instinct Save` → `instinct`. The ruler: `vs ad`, `vs wd`, `vs save instinct`.
- **Traits:** Foundry sorts them (keys); `power` → `magic`.
- **The ruler:** a line per Version that has damage tiers or a `ruler` string: `action Name [AP] | ap N | frequency | traits ... | [reaction] | [escalation N] | [vs ...] | [tiers a / b / c] | <ruler string>`; the Version's number is written only when the card has several (`Smite 2`). A text cell among damage cells counts as `0`.

## The extras (per target, on the same card)
- `foundry` (card level): `basic` (the key in BASIC_ACTIONS, for a Basic Action), `img`, `folder`, `automation` (`gold` / `silver` / `bronze` / `none`) and `automationNote`, `weaponUse` (`fists`, `kick`), `areaCfg` (the Foundry-only parts of an Area: who it targets, centered, kept, rounds), `settings` and `modifiers` (a Feature's or Talent's; v0.0.323, PACK EFFECT-SHEET: `settings` stays the format written here, and the build reads them into the Details tab's rules (`foundry/twod12/module/fxrules.mjs` migrate), so the cards are not rewritten; a card can also write `rules` in that model's shape), `marksTarget`, `basicAttack`, `description` (a Feature whose Foundry text differs), `appendSetup`.
- `foundry` (in a Version): `append` (a string appended to the Version's text, or `{ "effects": ..., "x1": ..., "x2": ..., "x3": ..., "critical": ... }` for the tier texts), `fx` (`{ "t2": ["{{fx:Hindered (until Move)}}"] }`: the Effects a tier applies, by name; `all` for the Version), `areaSize`, **`text`** (cards 1: the Version's Foundry text written in full, in the place of the book's Effects cell when that cell says "As 1 AP, but..."; the same links and buttons are derived from it), **`after`** (cards 1: the chips that run one after the other once the damage is applied, on Tier 2 or 3: `@Guard[1d8+mod|who:pick|area:2] @Move[pushed|distance:1|pick:yes|area:2|from:target]`; the item's "After the damage" field, editable in game).
- `foundry.npcWeapon` (an NPC Action): the weapon in the NPC's hands (the attack's look); `foundry.areaCfg.center` for an Emanation centered on the user.
- `ruler` (in a Version): the modeling string appended to the line (`heal 1 self`, `on 2+: defense 1 ally`, `does Weapon Attack x2 | different`); `[PMod]` is the build's `power-mod` (`[PMod+2]`, `[PModx2]`, `[PModx2+1]` since pack R-classes). Pack R-classes added: `extra 1d6 mind each strike` (on every matching Action), `extra 1d8 mind first-hit strike bloodied` (`bloodied`: only against a Bloodied or Strained target), `mend 3d6+[Mod] any` with `allies 3` (the three most hurt), `vulnerable 2 round` (until your next turn, not EoT), and the passives `surge 1d8 mind` (the focus target at the start of your turn) and `mend [PModx2+1] any` (at the start of your turn); `reduce [PModx2] adjacent 1 always` (no "haven't left your square" clause). An `extra` or `surge` whose dice are Resolve damage (Holy) says `mind` (`extra 2d8 mind next strike`; pack R prep: the fight counts Body and Mind damage for Bloodied / Strained; without it the dice count as Body). `ruler` (card level): `{ "passive": "escalation 2: reduce [PMod] adjacent 1" }` for a Passive's line (used by the builds that name the Passive), `{ "skip": true }` or `false` for a card the ruler never models.

An extra never repeats a core field (a tier, a cost, a trait, the Frequency): test t177 fails on it.

## Cards with Lucas (started 2026-11-05: cards session 1, Smite)
Lucas writes a few cards at a time, in prose or in this format, saying on each what Foundry should automate; the session completes them (the `foundry` block above) and prices them, and the first ones are kept below as worked examples. Smite (session 1) is the card to copy for a Strike with an effect on the target and a chain after the damage; Divine Surge (an Effect the ally's button uses) and Overwatch (a Reaction with a Trigger) for those shapes. MASTER-PLAN section 1, item 6.

## The PC budget (2026-11-13: read before a card session)

A guide for sizing a class card before it is written, measured the way the Bestiary's turn budget was. **It is for Lucas and Claude, not a rule of the book.** The numbers and how they were measured: `book/ruler/pc-budget.md` (`node book/ruler/sim/pcbudget.mjs`). They are for Stage 0 (levels 1 to 3) and today's rules (4 AP, exploding weapon dice, enemies that use effects).

**The scale.** A **plain PC** has its class's Health, armor, weapon and Modifiers and nothing else; its turn is three Weapon Attacks. **That turn is 100 points; a Weapon Attack is 25.** 0 points is a PC that deals no damage. Everything is placed on that line by what the party's fights cost with it (its Health lost with the Rally Points spent), so damage, protection and healing share one unit.

**What the fights say first:**
- **Health is worth much more than damage.** Saving the party 1 Health takes about 5 damage dealt in a normal fight, and about 3 in a hard or a deadly one (the old price list had 1.1). A card that gives new Health or stops damage is far stronger than its dice look.
- **The third Weapon Attack of a turn is weak** (2 At-will Banes): almost anything is better than it.

**Prices for an Action's damage** (its average damage over its own Weapon Attack's, × 25):

| The Action | Points | Measured |
|---|---|---|
| 1 AP | 25 | a Weapon Attack |
| 2 AP | 50 | with a Weapon Attack: worth 106 to 107 (three Weapon Attacks: 100): already a little better, no premium needed |
| 3 AP | 75 | worth 100: exactly three Weapon Attacks |
| 2 AP at 60 | | worth 115 to 117: each 10 points over is felt |
| Encounter, double its AP (2 AP: 100) | | adds about 30 points to **every** turn of a normal fight: a third of a plain PC |

**What a class adds today** (the Stage 0 builds in the plain PC's seat; levels 1 / 2 / 3): Smite Paladin 115 / 126 / 118; Lay On Hands Paladin 126 / 161 / 163; Double Shot Archer 174 / 163 / 168; Rolling Shot Archer 194 / 182 / 200. The Archers get far more from their class than the Smite Paladin does (the ranged seat's scale is small, so its numbers are good to about ±6).

**Riders a PC puts on an enemy** (on a hit; the price on one Action that carries it; against Standards, and against an Elite, which lives longer):

| Size | Price | Riders (Standards · an Elite) |
|---|---:|---|
| **Mild** | 3 | Hindered and Immobilized (0 from melee, 2 to 3 from range), Taunted 1 to 3, Frightened 2 to 4 · 6, Vulnerable 1 1 to 3 · 4, **Bleed 1d4 or 1d6 (0 to 2: the party kills its target before it bleeds)** |
| **Moderate** | 8 | Vulnerable 2 5, Slowed 1 7 to 10 · 12, Prone 7 to 9 · 11 |
| **Severe** | 12 | Dazed 1 11 to 15 · 20, Blinded (EoT) 12 to 15 · 26 |
| **Extreme** | 18 | Slowed 2 13 to 20 · 26 |

Against an Elite a rider that takes AP or its aim is worth one size more. This is not the Bestiary's table: a Bleed is strong on a PC and nearly nothing on an enemy; Blinded and Dazed are stronger on an enemy than on a PC.

**Reactions** (the classes' own, on the plain PC, for free):

| Reaction | Fires in | Adds a turn |
|---|---:|---:|
| Shield of Faith (block 2d6 + [Mod]) | 82% of its rounds | **66** |
| Covering Shot | 111% | 16 |
| Rebuke | 66% | 14 |
| Overwatch | 85% | 10 |

All four fire well over the half of the rounds they are meant to; Shield of Faith alone is worth two thirds of a plain PC. **A 1R Reaction should add about 10 to 15 points** (half an AP: the Reaction AP is free, but it fires only sometimes); one that blocks damage needs small numbers.

**1 AP that isn't an attack** (in the place of the third Weapon Attack):

| The AP | Worth |
|---|---:|
| the most hurt ally heals 1d8 + [Mod] of new Health | 69 |
| ... 2d6 + [Mod] | 85 |
| you gain Guard 1d8 + [Mod] | 35 |
| an ally gains +1 Defense until your next turn | 12 |
| nothing (the unused AP's Guard) | 12 |
| an ally spends one of its own Rally Points (Lay On Hands' heal alone) | -11 |

So **1 Health of new healing is about 12 points and 1 point of Guard about 6**; a heal paid with the ally's Rally Point only moves Health it already had (its worth is the Down it prevents and what the card adds on top).

**Each Passive and Feature on its own** (what it adds to the plain turn; a fight that starts at Escalation 1 · at Escalation 3, with Momentum 2):

| | Adds |
|---|---|
| Radiant Zeal (Escalation 2) | 3 · 7 |
| Searing Blows (4) | 0 · 4 |
| Reckoning (6) | 0 · 0 |
| Font of Mercy (2) | 0 · 0 |
| Mending Light (4) | 9 · 37 |
| Hallowed Stance (6) | 0 · 3 |
| Sharpshooter | 4 · 14 |
| Marked Quarry (with its Tier 1 floor) | 26 · 39 |
| Killer's Focus (2) | 9 · 34 |
| Hunter's Edge (4) | 0 · 10 |
| Finisher (6) | 1 · 12 |

The Archer's are good to about ±5. **A Passive at Escalation 6 does nothing without Momentum** (the fight ends first), and one at 4 very little. Marked Quarry and Killer's Focus are most of what the Archer's class adds; the Paladin's damage Passives add almost nothing, and Mending Light is its strongest by far.

**Areas** (a 2 AP Round area Action and a Weapon Attack; the points each creature in it takes; worth against 4 · 6 Standards):

| Area | It catches (4 · 6 Standards) | 50 to each (the full price) | 33 (two thirds) | 25 (half) |
|---|---|---|---|---|
| 2 Burst within 10 (the ranged seat) | 1.6 · 2.1 | 162 · 222 | 123 · 161 | 106 · 131 |
| 1 Emanation around you (melee) | 1.3 · 1.6 | 133 · 156 | 106 · 117 | 87 · 97 |
| 2 Emanation around you (melee) | 1.7 · 2.1 | 140 · 169 | 112 · 126 | 91 · 103 |

So **a PC's area from range deals half to each** (even against 4, good against 6) and **an area around yourself two thirds** (you must stand in the middle of them). At the full price to each an area is worth half a class by itself.

**On maps with walls** (pillars and a corridor; `pc-budget.md` section 9, in Health saved a fight): the guide holds. The melee seat is worth more among walls (the plain PC saves 13 Health a fight in the open, 16 and 18 on the maps) and the ranged seat about the same (8, 10, 7); the classes keep their order (level 2, open · pillars · corridor: Smite Paladin 15 · 18 · 19, Lay On Hands 19 · 22 · 24, Double Shot 13 · 17 · 12, Rolling Shot 14 · 17 · 14); Prone and Slowed 1 are worth a little more (2.3 → 3 to 4 Health a fight); Shield of Faith 9 → 10 to 11; the 1 AP heal 6 → 7 to 8; Overwatch and Covering Shot don't collapse behind walls (1 to 3). **A PC's Push is worth nothing as the ruler plays it** (it pushes on every hit, its own target too: -2 from melee, 0 to 1 from range): a player who pushes into a wall or off a ledge gets what the Bestiary's Push gets; price it as Mild.

**The targets (Lucas, 2026-11-13):**
- **A class is worth about 150** in Stage 0 (the plain PC: 100). Read as level 3's number, with about 130 at level 1 and 140 at level 2, since each level adds something (an assumption: say if every level should be 150).
- **The Paladins come up, the Archers stay** (Lucas, the same day, replacing "the Archers come down"). The points are against each seat's own plain PC, and the two plain PCs are not equal: a plain Paladin saves the party 13 Health a fight, a plain Archer 8. In Health saved (level 2) the builds are Lay On Hands 18.8, Smite 14.7, Rolling Shot 14.2, Double Shot 12.7: the Archers are not ahead. **150 for a Paladin is about 20 Health saved a fight; 150 for an Archer about 12, where the Archers already are** (163 to 200).
- **Shield of Faith adds about 15** (today 66): as any 1R Reaction, 10 to 15. That brings the Lay On Hands Paladin to about 110 to 115, level with Smite (115 to 126).
- **So each Paladin needs about 35 points of new class value** to reach 150: in Smite's damage (a 2 AP Smite is 45 points, under two Weapon Attacks), in its Passives (Radiant Zeal 3 to 7, Searing Blows 0 to 4, Reckoning 0) or in something new.
- **Healing in a fight (Claude's choice, Lucas can change it):** its AP cost stays, and it is **paid with Rally Points**: a heal that spends the target's Rally Point is priced at what the card adds on top (and the Down it prevents). **New Health** (no Rally Point) costs **12 points a Health**: a 1 AP Round card gives about 2 new Health, and a bigger one is an Encounter Action.

**How to use it in a session:** (1) the card's damage in points against its AP's price; (2) add its riders, its heal or Guard and its Reaction at the prices above; (3) compare with the class's budget for its level. The ledger at the end of `pc-budget.md` has every class Action's damage in points today (Smite 2: 45 for 2 AP; Double Shot 2: 50; Holy Wrath 2: 50 to 54; Rolling Shot 2: 36).

**Not in it:** levels 4 and up (Stage 1 isn't written); a Push aimed by a player; Zones and areas that last. `book/ruler/prices.md` and the cards' old worth lines (`book/ruler/worth.json`) are from before pack R's 4 AP and are not to be used for new cards.

## The Action Builder (2026-11-13: a tool for Lucas and Claude, not a rule)

A page to design a class Action or an NPC Action and see live whether it is within budget: **https://claude.ai/artifact/7Rjq4sNYS8bPZW2jXb7R7g** (private to Lucas). Stage 0 only, as the budgets are. It shows "within limits", not perfect balance: the SIM is the measure.

- **Use:** pick the tab (PC Action: the PC budget above; NPC Action: the Bestiary's turn budget), fill the form or start from an existing card, read the points against what the AP and Frequency should cost, then **Copy for Claude** and paste it into a chat: it holds the card in this folder's format (with its `ruler` lines where the form can say them), the computed numbers and the form itself. **Save draft** keeps the Action with the page (its `drafts` collection, which Claude can read with the ArtifactData tool); the Action being edited is also kept in the browser.
- **The form (Lucas, 2026-11-13, second pass):** the left side is the card in the order he writes it: Name, Traits (the book's groups in their colors, a click each), Frequency, Kind, Vs., Modifier (picked freely, +0 to +4; until picked it is the build's for the Kind), Weapon (what `1w` stands for, with its Tier 2 and Tier 3 damage), Targets, then the Versions. It has **no Category, Level or Flavor** (a card it was filled from keeps its own; Claude writes the Flavor). **Damage is typed**: `1w + mod + r 1d8 ho` = `[V] 1[W] + [Mod] + [R] 1d8 Ho` (`w` = [W], `mod` = [Mod], `v` / `r` before a piece = its pool, none = the pool before it, the first is Vigor; the type by its code or its name; the book's own text reads too; `shortDmg` in engine.js). **Riders are picked on their Tier** ("then": Slid 1 on Tier 2, Slid 2 on Tier 3), or on the Hit row (the Effects line) or the Always / Setup row. A PC's rider on a Tier costs that Tier's share of the hits; an NPC's on one Tier only is one size less (the book's "Tier 3 only"), on every Tier one size more (the Setup's). The right side: the card, the budget, then "Tested with" (the build, Boons, Banes, Favored / Doomed, the fight, an Elite).
- **Files:** `builder-data.mjs` (reads pc-budget.md, areas.md, this README's rider prices, 15-gear.md's weapons, the rework builds, config.mjs's npcBudget / npcStage0 / npcDefense, build_rules.py's trait groups and damage types, budget.mjs's price functions and the cards), `builder/engine.js` (all the pricing, no page), `builder/ui.js` and `builder/template.html` (the page), `builder/build.mjs`, `builder/test.mjs`. `builder/data.json` and `builder/action-builder.html` are written by the build: don't edit them.
- **Refresh** (after pcbudget.mjs or the Bestiary is measured again, or a card changes): `node book/cards/builder/build.mjs`, then `node book/cards/builder/test.mjs` (a Weapon Attack must price at 25, Smite and Double Shot where pc-budget.md's ledger has them, the Tier chances equal to calc.mjs's), then ask Claude to publish `book/cards/builder/action-builder.html` to the same link (the Artifact tool with that `url`).
- **The dice and the prices are not written twice:** the build pastes the system's `calc.mjs` and budget.mjs's `expr`, `actionPoints`, `riderPrice`, `turnBudget` into the page as they are.
- **The class audit tab (2026-11-13, the Paladin):** `builder/audit.json` lists a class's cards ranked worst first (today vs budget, lame, underused, what the research suggests, Claude's suggestions); "Open in the builder" loads the card with those notes above the live budget (a Passive or a Feature opens a blank Action with its notes). Edit `audit.json` and rebuild to change it; the research behind it: `book/research/tactical-combat.md`.
- **What it can't price:** Passives and Features, Zones and areas that last, a Push aimed by a player, an effect the rider lists don't have (write it in the Effects text: it is copied, not priced), levels 4 and up, and a creature's whole turn (the Bestiary's best-turn check and the Encounter pay-back are shown as notes).

## After editing a card
1. `cd book && python3 build_rules.py` (the card check lists a marker with no card, a card no chapter places, a block still written by hand).
2. `cd foundry/twod12 && node tools/gen-basic.mjs` when the card is a Basic Action (then the compendium: `node tools/build-packs.mjs`), and `node tools/tests/run.mjs`.
3. The ruler reads the files when it runs: nothing to do.

## Writing cards with Lucas (2026-11-05: the rules are his, learned card by card)

**Named Boons and Banes (2026-11-08):** the name is part of the text, never deduced: an Action gives a Field, Pressure or Support Boon or Bane only when it writes the name ("1 Pressure Bane"), and then it always is one. Give a name only when several sources must share a limit: a Bane an effect puts on enemies is **Pressure**, a Boon an effect gives several allies at once (an aura, a zone, "allies within N") is **Support**, one from position or sight is **Field**. An unnamed Boon or Bane is 1, rarely 2, never "1 for each X" (anything that scales gets a name, so it gets a limit). The rule: Chapter 1, Named Boons and Banes.


Lucas makes cards a few at a time, with Claude, and writes each in his own way so that Claude learns how he wants them, automation included. This section holds that way: every correction he makes to a generated card becomes a rule here, with the card as the example. Read it before writing any card. Until the first cards: the format above, Lucas's automation rule (a card is automated with general settings he can see and edit on the item, never with code that looks for its name; what needs no automation stays text), concise text, and a Flavor line written by Claude.

**How a card session goes:** Lucas writes two to four cards (the dice, the effect, what Foundry should do by itself and what stays by hand); Claude writes each as a card here, its Foundry item (the compendium build) and its worth line (the ruler), and gives a checklist; Lucas corrects; the corrections are written below as rules.

**How Lucas writes a card (his notation, notes.txt, 2026-11-05):** he writes only what changes; what he doesn't mention stays as it is. `[the book's text today](what I want in Foundry)`: the bracket is the book's words, the parenthesis what Foundry should show or do; "book too" when the book's text changes as well; a line starting with "When clicking on..." / "On click:" is the automation. Everything he asks for must be a setting or a field anyone can change on the item in game, never code that looks for the card's name (t164).

**Rules so far (each from a card; the card is the example):**
1. **An area in a card's text is a chip, even when the Action doesn't place it** (Smite: the 1 / 2 Emanation of the light). The chip reads the book's way, "1 Emanation", "2 Burst", "6 Line", with the shape's footprint as its icon (Lucas's mockup; the book writes "Line 6", the chip "6 Line"). The text derives it: "in a 2 Emanation" and "Line 6" become chips by themselves.
2. **A rule named in a text is a book link** (Smite: "Bright light" links to Light > Bright). Write it as the book's link, `[[Bright|Bright light]]`; Foundry keeps it as a book link (the Journal import comes later). A label with a `|` is fine in a table cell.
3. **An Action named in a text is a link that opens it to read, never a roll** (Smite: "try to Hide"). Write `[[Hide]]`; Foundry links the compendium item. **An Action the book hasn't written yet gets a placeholder card** (`placeholders.json`, `placeholder: true`), so the link resolves in the book and in Foundry.
4. **"As N AP" is the book's; Foundry says it all.** Write the Version's full text in `foundry.text` (Smite 2 AP: "The target sheds Bright light in a 2 Emanation...", where the book says "As 1 AP, but a 2 Emanation."). The book's cell stays as the book wants it (word count).
5. **"[Mod]" in a chip shows the number** (Smite: "Guard 1d8+3" when the Paladin's Modifier is 3; "Guard 1d8 + [Mod]" with no creature). Plain text keeps "[Mod]" ("(2d6 + [Mod] at Stage 2...)" is information). "Guard 1d8 + [Mod]" in a text becomes the Guard chip by itself (a `[[Guard]]` link before the dice is the chip).
6. **An effect on the target goes with the Damage button** (Smite: the light; `fx.all` on the Version with the Effect's name: `{{fx:Smite (Bright light 1)}}`): the effect is a compendium Effect with settings (the light's size, a note), applied on Tier 2 or 3 when the damage is applied. What the effect can't do yet is a note on it and in `automationNote` (the Bane on Hide: Hide isn't written).
7. **What happens after the damage is a chain of chips in `foundry.after`** (Smite 3 AP), each asking its question in order: `@Guard[1d8+mod|who:pick|area:2]` asks "who gains Guard 1d8+3?" (you, or an ally within 2 of the target); `@Move[pushed|distance:1|pick:yes|area:2|from:target]` lists the creatures within 2 of the target (the target left out), moves the one clicked away from the target, and lists the rest again until Done. The options are general: `who:pick` / `who:all` / `self:yes` (who gains a Guard or an Effect), `area:N` (look in an N Emanation around the card's target), `pick:yes` (one creature at a time), `from:target` (the target is the origin of the Forced Movement). The text's own chips stay plain (clicking "Pushed 1" by hand moves the card's targets, as before).
8. **The book's text changes too when he says "book too"** (Smite 3 AP: "in the Bright light" instead of "in the light"; the links). Log it in rules-backlog.md like any rule change.
9. **A question asked on the map is a bar at the bottom, never a Foundry window** (v0.0.247, Lucas: "Who gains the Guard?" and the Push list are bars in the Line bar's look; `pickbar.mjs`); a choice in a window is a pick window (`pickwindow.mjs`). A chat line about a Push names the creature that pushes, even when the origin is another creature.
10. **"Targets:" is labeled on every card** (book and Foundry), and the meta texts (Targets, Trigger, Area, Distance, Vs.) read like the rules text: **a trait in a text is a chip with its tooltip, never a link** ("[Strike] Action" in Rebuke's Trigger), an Attribute in its color ("Appeal Save").
11. **Link a term once per card**, the first time it appears ("[[Aura]]" in Beacon), not again.
12. **A Save Action's conditions apply when the Save is rolled; its Forced Movement stays a chip the player clicks** (Rebuke: Frightened with the Save, Pushed 2 by click). A condition named in a text will link to its compendium item once the conditions pass (R-Foundry 2) gives it one.
13. **An Aura is the Area line** ("Area: Aura 2"), never a Distance (Beacon).
14. **What happens to several targets after the damage is the same chain**, with the options a multi-target card needs: `t2:1|t3:2` (a Move chip's distance by each creature's Tier), `from:area` (the placed area's center is the Push's origin), `@Condition[prone|crit:yes]` (only the creatures that rolled a Critical; it comes after the Pushes in the chain). Word of Radiance: `@Move[pushed|distance:1|t3:2|pick:yes|from:area] @Condition[prone|crit:yes]`. A rule that is already in the book is not repeated on the card (its notes line about the Burst's center is gone).
15. **Inline Actions are built** (v0.0.249): the `inline` list on the card (the format below) becomes a nested card in the book and an Action item in Foundry's "Inline" folder, carried by the parent's effect with the "Grants an Action while active" setting (Beacon's Step on the Actions tab while the Beacon lasts). A 0R Reaction spends no AP (Chapter 2). The Flavor line is mine.
16. **Durations are EoT or N rounds, never "until the end / start of a turn"** (Lucas, session 3): the EoT and 1-round rules carry that meaning. `rounds:eot` on a chip reads as EoT.
17. **Healing opens the Rally window or the Heal window** (the system's style), never a dialog: the split is symmetrical by default (each damage type's share of its threshold), the player changes it. **A heal to several creatures is rolled once** (Chapter 4), then each creature's answerer (its player, else the GM) chooses the split on their own client. "The target can use 1 Rally Point, healing 1d6 + your Power Modifier more" (Lay On Hands 2 AP) is one chip, `@Rally[1|extra:1d6+pow]`, that rolls the extra as it is clicked; the book says it in those words, and "As 2 AP, but 2 Rally Points." at 3 AP. "Heals twice what 1 Rally Point would heal" (Miraculous Recovery) is `@Heal[rp*2]{twice a Rally Point's heal}`: no Rally Point is spent.
18. **"(4d6 at Stage 2, 6d6 at Stage 3)" after a heal or a Guard gives the chip its Stage dice** (`s2:` / `s3:`); the parenthesis stays on the card as information and the chip shows the Stage's formula with the numbers ("Heal 3d6+3", "Guard 2d6+3" at Stage 2).
19. **A no-damage Version with a chain gets Apply buttons** on its card (Hallowed Dawn: "Allies: Apply Heal/Effects", "Enemies: Apply Damage/Effects"; Miraculous Recovery: one "Apply Heal/Effects"): the chips of the chain name their side (`side:allies` / `side:enemies`) when the two sides get different things. "End one effect on them" is `@EndEffect[eot1]` (EoT or 1 round left) or `@EndEffect[any]` (a non-permanent effect): the creature's answerer picks it in a window (the book says the Paladin chooses; in Foundry the ally does, Lucas's call).
20. **A condition with a value is a chip** ("Enfeebled 1", "Vulnerable 2 (1 round)": `@Condition[enfeebled|value:1]`), applying the compendium condition with that value.
21. **A card written with Lucas is Mithril** (the rank above Gold, `automation: "mithril"`) and goes into `book/cards/with-lucas.txt`; its automationNote still lists what the rules leave by hand.
22. **A Reaction's Interrupt / Trigger line comes first** on the card (book and Foundry), before Targets: it is what the player reads first (session 4). A Reaction's Targets is "The triggering creature" and it has no Distance when the Interrupt says it ("an ally within 5 squares").
23. **"Reduced by 2d6 + your Power Modifier (3d6 at Stage 2, 4d6 at Stage 3)" is a Reduce chip** (`@Reduce[2d6+pow|s2:3d6+pow|s3:4d6+pow]`): the reduction is rolled when it is applied and waits on the creature for its next damage (Shield of Faith). "Guard equal to what one of their Rally Points heals" is the chip **Guard RP** (`@Guard[rally]`). **`near:N`** on a who-picker or a Push list means the allies within N squares of you (a Reaction's "an ally within 5 squares").
24. **A chain can stop and wait** (`@Pause[After the damage]`): what comes after the Pause is a second Apply button on the card, named by the label (Bulwark of Faith: the Guard first, the Slid after the damage).
25. **A card's inline Actions are written on its Foundry text too** (a link to the item and the Action's line), so the sheet's preview shows them after "you gain the following Action:". A card's effect is named after the card (Beacon, Beacon (+1 Defense)) and lasts what the card says (3 rounds).
26. **A picker asks only when the card has no targets** (session 4, Lucas's test): with a target on the card, the Guard, the reduction, the Slid go to it. "Guard RP" shows the number (the target's Rally Point heal). An inline Action shows in the sheet's Granted area while its effect lasts.
27. **Every setting stays editable in game:** the Effects are items (their settings in the Effect's sheet), the chain is the Version's "After the damage" field, the chips' options are text. Nothing in module code names the card.
28. **An effect with a Grant setting puts its uses on the card** (v0.0.260, Lucas's notes for Double Shot): the card gets a ticket line ("Double Shot: Weapon Attack · 2 of 2 left · free") and one button per use; a click uses the Action with that granted use (the sheet's ticket drops too), the button grays; a use from the sheet grays it as well; with uses left, a short card repeats the buttons under the Action's own card. Nothing to write on the card: the Grant setting of the Effect is enough.
29. **"Make a [Ranged, Shot] Weapon Attack" is a granted use, never a Use button** (session 5, Rolling Shot, Covering Shot): the Version applies an Effect with a Grant (`fx.all`), the card gets the button (rule 28). What rides on that attack goes on the same Effect: the extra damage (a Bonus Damage setting for [Ranged, Shot, Strike]), the Boon (the Grant's Boons). The traits in the text carry their tooltips. "On a Tier 3, the ally takes half of the triggering damage" is the Grant's "On [a result], [what happens]" (the result: a Tier 1 or more, 2 or more, 3, a Critical, any result; what happens: the target's next damage is halved, or the card says a line): the attacker's next damage card lights its Half button; the player clicks it. "The card says" puts the line on the granted use's card rows (the Critical row for a Critical, the Tier rows from that Tier up). A Grant has two such lines (Overwatch: Hindered on a Tier 2 or more, Pushed 2 on a Critical), and the line's chips also run by themselves after the damage for the targets that rolled the result (a chain chip takes `tier:2` or `crit:yes`). An effect a Version applies can come "when the target is Down" (Deathmark's shot: the fx entry `{ "uuid": "{{fx:X}}", "mode": "down" }`). "It ignores Low cover" is the effect's "Ignores cover" setting (the levels as chips), and the text links the book's Cover (`[[Cover|Low cover]]`).
30. **"For N rounds, enemies in the area take..., and allies in it heal 1d4 at the start of each of their turns" is a Zone** (session 5, Consecrated Ground): the Version's `fx.all` names an Effect whose "Zone" settings say who gets what (an Effect while inside; a heal at the start of each turn inside); the area is kept (`areaCfg.keep`, its rounds; a Version's own rounds: `foundry.areaRounds`), and the region does the rest. "heal 1d4" in the text is a Heal chip too (a heal by hand).
31. **"You or an ally within 5 squares would go Down" is a moment** (session 5, Divine Intervention): `foundry.moment: "wouldDown"`, `foundry.momentRange: 5`; the Reaction is offered by itself before the damage lands, and its chain (`foundry.after`, the Guard RP) runs by itself on the creature it answered for: no button on the card. No Distance (the Interrupt says it), Targets the triggering creature (rule 22).
32. **Every Reaction's Interrupt or Trigger line is a moment** (pack RX, v0.0.272, Lucas's design): `foundry.moment` (one of `wouldDown` "a creature would go Down", `strikeDamage` "a Strike would damage an ally within N", `strikeAgainst` "a Strike is made against an ally within N", `enemyCloser` "an enemy within N moves closer", `allyDamage` "an ally within N takes damage", `enemyMoves` "an enemy within N moves or stands up"), `foundry.momentRange` (the N, to the ally or the enemy who moves; 0: anywhere; Opportunity Attack 1 since v0.0.273), `foundry.momentSelf: true` for "you or an ally", `foundry.momentTarget: "source"` when the Reaction is made against the attacker (Covering Shot, Rebuke; the default is the creature of the moment); an inline Action writes the same keys on its line's object (Beacon's Step). A Distance in squares (Rebuke's 5 sq.) also limits how far its target can be. When the moment comes, one chat message lists every Reaction it triggered (a row per creature and Reaction, Use / Pass for its owner); nothing lands until every row is answered or skipped; the rows used resolve last in, first out. An Interrupt holds the damage until answered (what it sets, a reduction or a Guard, counts on that damage; a granted Weapon Attack is made at once, so its Tier 3's half halves it); a Trigger is offered after and holds nothing. A chain's steps after a `@Pause` stay buttons on the card (Bulwark of Faith's Slid). The book's text is unchanged: the moment is Foundry's.
33. **Diamond (Lucas, 2026-11-09):** a Mithril card that any later change touches (even only its text or its buttons) becomes **Diamond** (`automation: "diamond"`) and is listed at the end of `book/cards/with-lucas.txt` with what changed; the pack's final report names it. Lucas revises it, then it is Mithril again.
34. **Only the condition's name is a button (Lucas, 2026-11-09, Rebuke):** "Frightened of you for 1 round" makes "Frightened" the chip; "of you for 1 round" stays text (the chip still carries the duration). The same for every condition: "Dazed 1", "Bleed" [R] 1d6 Ho (Mi/Ap).

**Inline Actions (Lucas, 2026-11-05; built in v0.0.249, Beacon's Step the first):** a card can give a small Action of its own while its effect lasts (Beacon's step toward a hit ally). Lucas writes it on one line, after the sentence that grants it ("While the Beacon is active, you gain the following Action:"):

> Beacon's Step — 0R | Round | Interrupt: an ally in the Aura takes damage. | Effects: you Evade 1 toward the ally.

The name, then a dash (an em dash or a plain hyphen), then one field per pipe: the cost first (0R, 1R, 1 AP), the Frequency second, then `[traits]` in brackets when it has any, then the labeled fields (Interrupt or Trigger, Target, Requirements, Effects), each starting with its label and a colon. Only the name, the cost and Effects are required; no Target line when the trigger already names the creature. In the card's JSON it becomes the parent's `inline` list, with a card's keys: `{ "name": "Beacon's Step", "cost": "0R", "frequency": "Round", "interrupt": "An ally in the Aura takes damage.", "effects": "You Evade 1 toward the ally." }`. The book renders it as a small nested card inside the parent (its own Frequency color); Foundry builds an Action item in the "Inline" folder, which the parent's effect puts on the creature with the "Grants an Action while active" setting and takes away when it ends (the Class group of the Actions tab). A 0R Reaction spends no AP (Chapter 2: "A 0R Reaction uses no AP; its Frequency still limits it"). Optional keys: `traits`, `target`, `requirements`, `trigger` (instead of `interrupt`), `flavor` (mine), `automation`, `automationNote`.

**Worked example, Smite (paladin.json):** the three Versions have `fx.all` (the light effects), the 2 and 3 AP Versions `foundry.text` (written in full), the 3 AP Version `foundry.after` (the Guard's who-picker, then the Push picker), the card `automation: "silver"` with an `automationNote` (what stays by hand: the Bane on Hide, the Stage 2 / 3 Guard dice). Lucas's notes for it (2026-11-05) are kept in rules-backlog.md, "CARDS SESSION 1".
