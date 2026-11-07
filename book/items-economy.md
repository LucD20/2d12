# Items and Economy (design, from 2026-11-06; nothing in rules-src yet)

Decided with Lucas in a brainstorm session (2026-11-06), logged part by part after his review. **[Lucas]** = his idea or confirmation; **[agreed]** = proposed by Claude and approved by him. The numbers are a first draft to tune with the ruler (`book/ruler/econ.mjs` prices everything in DE, damage-equivalents; 1 AP = 5.8 DE under pack R).

Parts: 1 Items (below), 2 Actions Out of Combat, 3 Loot and Money, 4 Carrying and Expenses.

## Part 1: Items

### Goals
1. **[Lucas]** **No mandatory items:** the game never expects a PC to own an item (his biggest dislike in PF2e).
2. **[Lucas]** **No item so cheap that you buy it just because you can** (PF2e's Tailwind is the worst offender; a potion of retreat too).
3. **[Lucas]** **No Attribute is king, and no Attribute is worth dumping.** Every new mechanic is checked against it (Part 4 gives each Attribute one job in the economy).

### What items may do
4. **[agreed]** **The Bestiary never assumes items.** No item changes a PC's Modifiers, Defenses, Health or Rally Points: those come from the Stage. The one exception is a **narrow +1** (for example +1 Ward Defense only): it is a bonus, so it never stacks with other bonuses (Stacking).
5. **[agreed]** **Items give options, not numbers:** damage subtypes (Resist, Weak and Immunity make them matter), riders from the conditions vocabulary, Reactions on the Reaction AP, Daily or Encounter powers (a wand is an Action card with a Frequency), Escalation hooks, armor properties, senses and other utility.
6. **[agreed]** **An item's Action must be worth more than the AP it costs** (1 AP = 5.8 DE), or it is a trap. The ruler checks it. Example: a Pitch Flask with "Immobilized / Hindered / nothing" was worth 3.6 DE for 1 AP; "Immobilized / Immobilized / Hindered" is worth 6.4.
7. **[Lucas]** **Specific items can have their own specific effects** on top of these rules (a named weapon is more than its enchantment).

### Bind
8. **[Lucas]** **Items that must be bound have the Bind trait.** A Bind item works only while bound; an item without the trait works without binding (so non-Bind items can still exist). **[agreed]** A creature can have **Stage + 1** Bind items bound (2 at Stage 1, 3 at Stage 2, 4 at Stage 3).
8a. **[Lucas]** **You bind and unbind items when you complete a Sleep** (the same moment you will prepare spells and choose Actions, for later systems). So a broke PC unbinds an item at the next Sleep to stop its Upkeep.
9. **[agreed]** **An effect that lasts all day is a Bind item:** the slot is its real cost, more than its price (Wayfarer's Boots: +1 Speed is worth 0.0 DE in combat, so its price is the minimum and the slot is what it costs).

### Consumables
10. **[Lucas]** Every consumable has a **Usage** entry: the AP it takes to use it **from your pack** (Draught of Mending: Usage 2; a bomb with an area: Usage 3).
11. **[agreed]** **The Belt** holds **3 consumables at every level** (a bigger Belt from a higher level has no justification). **The Belt reduces Usage by 1, to a minimum of 1 AP.** A Bandolier (a Bind item) or a Talent gives +1 Belt space. From the pack an item is slower, not forbidden.
12. **[Lucas]** **Retrieving an item from an ally** takes the item's Usage; the ally's Belt reduces it by 1 as usual.
13. **[Lucas]** **You fill your Belt when you Take a Breather.**

### Prices
14. **[agreed]** **Permanent items: 100 SC per 1 DE they add a fight** (minimum 50 SC).
15. **[agreed]** **Consumables: 5 SC per 1 DE of one use** (minimum 10 SC). They cost more per DE than permanent items: they need no slot.
16. **[agreed]** **Items sell at ½ of their price.**
17. **[agreed]** **Healing potions** heal the same amount in or out of combat, and **a creature can benefit from one per Sleep** (so there is no reason to wait for a fight to drink one, and healing stays scarce: Rally Points stay the day's healing):

| Draught of Mending | Lesser (Stage 1) | Greater (Stage 2) | Superior (Stage 3) |
|---|---|---|---|
| Heals | 5 | 10 | 15 |
| Against a Rally Point of that Stage | about ½ (9) | about ¾ (13) | about ¾ (18) |
| Price | 25 SC | 50 SC | 75 SC |

Dropped on the way: a "dregs" heal for any potion (it would get around the one-per-Sleep limit; buff potions don't spoil, so nothing is wasted).

### Upkeep
18. **[agreed]** **A bound Bind item costs 5 CC a day per 100 SC of its price** (Rimebite 2 SC a day, Wayfarer's Boots 2.5 CC). **[Lucas]** **Paid on each Sleep**, from your coin, with Supplies (Part 4). *Assumption (Claude):* only bound Bind items have Upkeep; an item in your pack and a non-Bind item cost nothing. *Assumption:* if you can't pay a Sleep's Upkeep, you choose which bound item goes unpaid.
19. **[Lucas]** **An unpaid item becomes Dulled:** it stops working, and you must **Repair** it or pay someone to (a future mechanic: Repair).
19a. **[Lucas]** **The Upkeep counter** (a grace period, 2026-11-06): each Sleep adds your bound items' Upkeep to the counter; you pay it off from your coin whenever you have it (Foundry: automatically at each Sleep). Owing Upkeep is being **in debt**. Your items become **Dulled** if you **complete a Rest while in debt**, or after **4 Sleeps in debt** (so "I never Rest" doesn't dodge it). A Rest comes after a few Sleeps, so the PC has time to recover. *Proposed (Claude), for Lucas to confirm:* **once an item is Dulled, its Upkeep stops** (nothing maintains it, and Dulled is already the penalty): the debt freezes and never spirals, and Repairing it pays the frozen debt (plus what Repair costs). Lucas's alternatives, not chosen yet: the counter keeps growing by a fixed amount per level after the items are Dulled; or no debt at all (0 coin with no penalty).
20. Why Upkeep and not a per-level price for Supplies: bread doesn't cost more because you are famous, but enchanted steel needs oils and runes re-inked. Upkeep grows with what you own, so the money sink grows with wealth by itself (about 6% of the treasure at every level with Supplies: Part 3).

### Saving for big items
21. **[Lucas]** **Saving for a higher-level item is fine** (and fun).
22. **[agreed]** **No "item level ≤ your level" rule** (PF2e's: it removes the fun of saving and the "a relic far above our station" moment). Three soft brakes instead: the town's **market level** (a town sells items only up to a level: a village 3, a city 7, the capital 10), **Upkeep grows with the price**, and **the slots don't grow**.
23. What the treasure curve allows (Part 3's table): a normal saver (half of what they earned) buys an item about **1 level** early; going all-in (owning nothing else) about **3**. Treasure grows about ×1.3 a level, so each level's items cost more than all the levels before.

### Weapons and armor
24. **[Lucas]** **Mundane weapons and armor sit in one price band at every Stage.** Mastery, not price, limits a high-Stage weapon: Advanced weapons open at Group Mastery 6 (about level 5) and Exotic at 11 (about level 8) (`book/weapon-trees.md`), and by then your old weapon has grown with you through Mastery. **[agreed]** The bands:

| | Basic | Advanced | Exotic |
|---|---|---|---|
| Weapons | 5 / 10 / 15 SC | 20 / 25 / 30 SC | 30 / 40 / 50 SC |

| Armor | Light | Medium | Heavy |
|---|---|---|---|
| Price | 10 SC | 25 SC | 40 SC |

25. **[agreed]** **Magic on a weapon or armor is an enchantment** on top of the mundane item: Rimebite = an axe (15 SC) + its enchantment (about 400 SC). Armor properties (Warded, Resist by subtype) are enchantments too.
26. **[Lucas]** **Moving an enchantment** to another weapon takes **a day at a crafter** and costs **10% of its price within the same Weapon Group, 25% to another group.** (10% is a small tax on the upgrade from Basic to Advanced to Exotic, about 30-40 SC at level 5, and a real cost on swapping every town.) Exalted weapons don't move: their power is the weapon itself.
27. **[Lucas]** **Weapons, armor and shields are never Kit:** they always take a place (the paper doll or the pack: Part 4).

### Special items
28. **[Lucas]** **Unidentified items:** only for a rare type of item. It shows its name and "?" until a Breather and a Mind Check, or a sage for a few SC.
29. **[Lucas]** **Exalted weapons** (his name for named items that grow): a weapon gains a property at Expert (8) and at Master (15) Mastery. Much later.
30. **[Lucas]** **Crafting with loot:** its own section later (commission an item with loot lots of the right type, SC and downtime days: 2 Hides + half the price for a Hides armor; Arcana pays part of an enchantment).
31. **[Lucas]** **A mundane price list:** weapons, armor, mounts, services, Kit extras.

### The example items (drafts; not in Lucas's card format yet: book/cards/README.md comes first when they become cards)

| Item | Stage | Kind | What it does | Worth | Price |
|---|---|---|---|---|---|
| Emberglass Edge | 1 | weapon enchantment, Bind | Each Weapon Action with it: its damage keeps its subtype or becomes Fire | about 0.3 DE a fight (Resist / Weak only) | 50 SC |
| Wayfarer's Boots | 1 | worn, Bind | +1 Speed; mud, snow and undergrowth aren't Difficult Terrain for you | 0.0 DE in combat: the slot is the cost | 50 SC |
| Warded Mantle | 1 | worn, Bind | +1 Ward Defense (a bonus) | about 0.4 DE a fight (1 NPC in 4 targets WD) | 50 SC |
| Pitch Flask | 1 | consumable, Usage 2 | Thrown, Range 5. Body Save: Immobilized (EoT) / Immobilized (EoT) / Hindered (EoT) | 6.4 DE against a Standard | 30 SC |
| Draught of Mending (Lesser) | 1 | consumable, Usage 2 | Heal 5; one per Sleep | 5.5 DE | 25 SC |
| Rimebite | 2 | named axe, Bind | Its damage can be Cold. Once a round, on a Tier 3 with it, the target is Hindered (EoT) | about 4 DE a fight | 400 SC |
| Bulwark Shield | 2 | shield, Bind | 1R, Round. Trigger: a Strike hits you or an adjacent ally. Block 1d6 + 2 | about 2 DE a fight; it competes for the Reaction AP and takes a hand | 200 SC |
| Banner of the Last Stand | 2 | carried, Bind | Once an encounter, when an ally within 5 squares goes Down, you gain 1 Escalation (its own hook kind) | about 1.5 DE a fight | 150 SC |
| Wand of Grasping Roots | 2 | card, Daily, Bind | 2 AP, [Power, Save], a 3 Burst within 10. Body Save: Immobilized (EoT) / Immobilized (EoT) / Hindered (EoT) | about 19 DE on 3 targets for 2 AP, once a day: about 2 DE a fight | 200 SC |
| Owl-eye Lenses | 2 | worn, Bind | Dark Sight | large: Hidden in Darkness makes you Doomed; about 9 DE a fight if 1 fight in 4 is dark | 900 SC (the item you save for) |

What a magic +1 does to the fights, for the record (the ruler, 2000 fights, every PC with the item; Health taken a fight, normal / hard / deadly): none 50 / 128 / 114; +1 weapon 43 / 109 / 99; +1 armor 43 / 110 / 100; both 37 / 94 / 86; +2 and +2 27 / 68 / 65. Each +1 cuts about 14%, both about 25% (a difficulty step): why item 4 keeps numbers out.

### Rarity (logged 2026-11-06, after a search on PF2e's rarity)
What players say about PF2e's rarity: the main complaint is that **one label mixes three meanings** (rare in the world, too strong, disruptive to a campaign), so asking for an Uncommon item "because of lore" feels like gatekeeping; GMs swing to the extremes (ban all Uncommon and Rare, or allow all); what works is "Common = no permission" and Rare = GM-placed treasure. On campaign-breaking items, the known advice (the Alexandrian on Zone of Truth): a truth effect breaks a mystery only when it skips the investigation. 2d12 is written by one designer, so it can keep the meanings apart.

32. **[Lucas]** **Availability (lore and economy, never power), one word on the card:** **Common** (sold in any market up to its market level), **Regional** (sold only in towns with the matching tag: Part 3's town block), **Rare** (never sold: GM-placed treasure). **Unique** for one-of-a-kind treasure (Exalted weapons).
33. **[Lucas]** **Power is never a rarity:** an item too strong for its price is re-priced by the ruler or rewritten (not made "rare because strong", PF2e's confusion).
34. **[Lucas]** **The Disruptive trait names what the item bends**, with a parameter like Resist: **Disruptive (Mystery)**. The list (short and fixed): **Mystery** (investigations: Potion of Truth, speak with the dead, detect lies), **Darkness** (dark campaigns: Owl-eye Lenses, Dark Sight potions), **Travel** (distance and isolation: teleportation, long flight), **Survival** (the Supplies and Forage system: endless food or water, create shelter), **Stealth** (infiltration: long invisibility, perfect disguise), **Social** (intrigue: charm, compulsion), **Death** (stakes: resurrection, undoing a Down). Most items have no tag.
35. **[Lucas]** **How the GM uses it:** at session zero the GM names the campaign's themes ("Mystery and Darkness"); items tagged with those themes become Rare for that campaign, the rest stay as written. Transparent (a powergamer can read why the Potion of Truth isn't for sale: the rules back the GM), and the GM limits only what breaks this campaign (a dungeon crawl can sell Potions of Truth freely).
36. **[Lucas]** **Design the item well first, tag it second:** a Disruptive item narrows, it doesn't close (a Potion of Truth: 3 yes-or-no questions, and the target can choose silence).

## Part 2: Actions Out of Combat

A new section of the book, **"Actions Out of Combat"**: most of these rules go there.

### Starting a fight
1. **[Lucas]** **When a creature *attempts* a hostile Action against a creature that is aware of it, roll Initiative before the Action happens.** A lie doesn't skip it ("I am just casting a healing spell"… then a fireball; "GM, can I roll to lie?" doesn't suffice), and neither does "while we are talking, I attack!".
2. **[agreed]** **Surprise comes from the Senses rules, not a new roll:** a creature is **Surprised** if, when Initiative is rolled, every enemy acting against it is Hidden or Unsensed to it. An ambush from Hiding works; a betrayal in the middle of a conversation doesn't (the target perceives the traitor). What decides surprise is a known pain in the TTRPG community: this keeps it on rules the book already has.
3. **[Lucas]** **Some leeway, in very niche cases:** a GM note (a target that is charmed, asleep, or fully distracted by something else). **Talents make it mechanical**, for example *Sudden Strike*: during a conversation, before Initiative, an Appeal Check against the target's Instinct; on a Tier 3 it is Surprised.
4. **[Lucas]** **The surprise round (still in the works):** no Escalation is gained; only creatures that aren't Surprised regain AP, 2 AP + 1R (or 3 AP and no 1R); a Boon against Surprised targets.

### Durations
5. **[Lucas]** **Outside an encounter, effects with a duration in turns or rounds (EoT included), or that last until the end of the encounter, don't work, and abilities that mention "during the encounter" can't be used.**
6. **[agreed]** **Why:** combat effects feed on Escalation, which only exists in an encounter.
7. **[agreed]** **Conditions follow how they end.** One that ends by an Action or an event lasts until that happens (Prone until you stand, which costs nothing out of combat; stuck in a web until you break free); one with its own timer is unchanged (Exhausted, Wounds, Sickened from a poison). **Examples:** you slip and fall, then enemies attack: Initiative is rolled with you Prone. You get stuck in a spider's web, then the spider comes: Initiative is rolled with you stuck (Immobilized or Hindered, as the web says).
8. **[agreed]** Guard already ends at the end of an encounter: the rule covers it.
9. **[Lucas]** **Every "next" effect gets EoT** ("1 Boon on your next [Weapon] Action (EoT)"), so it can't be gained in town and saved for the first swing. Rally the Tribe (Bestiary) needs it.
10. **[agreed]** **An Encounter Action used between fights stays spent through the next encounter** (the rule already says it resets when an encounter ends).
11. **[Lucas]** **Round and Turn Actions can be used out of combat** (Lay On Hands is Round): the resource they spend is the limit (Lay On Hands spends Rally Points).
12. **[Lucas]** **Designer's Note, the bag of rats:** an encounter is a scene with real stakes, and the GM says when one starts. A fight against harmless creatures started to reset Encounter abilities (a bag of rats, a chicken) isn't an encounter: it doesn't reset them, doesn't trigger Escalation hooks and doesn't count for Momentum.

### Utility
13. **[agreed]** **Effects with long durations** (Truespeech, Message, Light, Water-breathing) last as written: the duration rule doesn't touch them.
14. **[Lucas]** **A long-duration effect never grants a combat bonus** (a Buff, a bonus to rolls, Defenses or damage, Guard, Empowered, Boons, Favored), except for extreme, unique cases. It can change the *circumstances* of a fight (Light, Senses), not its *numbers*.

### Preparation
15. **[agreed]** **Preparation is allowed:** positioning, Hiding, picking Cover, scouting, setting up an ambush, filling your Belt. Real tactics with no number attached: the line between preparing and prebuffing.
16. **[Lucas]** **Preparation bonus ideas (before combat), for some circumstances:** when you know what you are about to face, you start the encounter with +1 Escalation (as Momentum does; they don't stack). **Rule or Designer's Note:** walking a dungeon expecting danger behind every door doesn't give it. **You must know what you will face** to gain any preparation bonus.

## Part 3: Loot and Money

### Coins
1. **[Lucas]** **Silver is the main coin**, written **CC, SC, GC** (not cp / sp / gp).
2. **[agreed]** 10 CC = 1 SC, 10 SC = 1 GC. Gold is rare, mostly a treasure coin. A commoner's day of work pays 1 SC.

### Treasure per level
3. **[Lucas]** **An estimate of SC per level**, and the book says where it can come from: **enemy loot**, **items and caches found** while exploring (NPCs can use items; most just don't have them), and **rewards** (quests, talking to NPCs, interacting, games). His example: 1000 SC at level 6 = 300 in found items + 400 in rewards + 300 in enemy loot.
4. **[agreed]** The table, per PC (a PC starts with **100 SC**):

| Level | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Treasure gained in the level | 150 | 200 | 250 | 300 | 400 | 500 | 600 | 800 | 1000 | 1200 SC |

5. **[agreed]** **Default split: 30% enemy loot, 30% found, 40% rewards;** the GM shifts it (a treasure-hunt arc gives more to found). Found items count at their sell price (½). So avoiding a fight never cuts the income by much.
6. **[agreed]** **The fit** (an estimate: 7 days a level, half of what was earned in Bind items): Supplies + Upkeep cost **about 6% of the treasure at every level** (Supplies fall from 5% to under 1%, Upkeep grows from 1 to 75 SC a level): a steady drip; the big spending stays on items, mules and property. Refilling the Belt every adventure day (3 consumables at 30 / 50 / 80 SC by Stage, 3.5 adventure days a level) would cost about **70-210% of a level's treasure**: consumables are never bought "because you can". A centerpiece item costs about one level's treasure (Rimebite 400 SC at level 5).

### Monster loot
7. **[Lucas]** **Each monster has a set amount of sellable loot**, and its **level means something**: low-level monsters give copper.
8. **[agreed]** **Lots by role:** Minion ½ (a group shares them), Grunt 1, Standard 2, Elite 4 (twice its CV).
9. **[agreed]** **The value of 1 lot follows the monster's level** (that level's treasure ÷ 100):

| Monster level | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 lot | 15 CC | 2 SC | 25 CC | 3 SC | 4 SC | 5 SC | 6 SC | 8 SC | 1 GC | 12 SC |

About 14 CV fought per PC per level × 2 lots per CV × (treasure ÷ 100) = about 30% of the treasure: the enemy share.
10. **[Lucas]** **The monster's level sets its lot value, not the party's:** a level 2 goblin pays level 2 loot even to a level 6 party (farming weak monsters doesn't pay).

### Loot types
11. **[Lucas]** **Loot can only be sold in towns, or to travelling merchants and the like.** It comes in **types**, a monster can carry a mix, and some vendors or towns pay more or less for some types. **Valuable loot is light and worth more; poor loot is heavy and worth less: weight is the lever.**
12. **[Lucas / agreed]** The five types (one word each; Lucas named Valuables, asked for a resources word for scraps and something like Idol for relics):

| Type | What it is | Weight (squares) | Value |
|---|---|---|---|
| **Valuables** | coin, gems, jewelry | 1 | ×1.5 |
| **Arcana** | reagents, cores, essences | 1 | ×1.5 |
| **Idols** | effigies, holy and unholy objects | 2 | ×1 |
| **Hides** | pelts, bone, horn | 3 | ×1 |
| **Salvage** | wood, axe heads, blades, armor scraps | 5 | ×½ |

With a typical mix (Salvage and Hides common, Valuables and Arcana rarer) a lot averages ×1 in value and about 3 squares.
13. **[agreed]** **The GM shifts the mix** to fit the monster: a beast with no Valuables but a rich hide, a cultist with Idols.
14. *Suggestion (Claude, from how peddlers worked: they carried little coin and had to haul what they bought):* **a travelling merchant** buys everything at ×½ (Valuables at ×1) and has a small **Purse** (the town block below, item 24). A convenience, never the best deal.

### Towns
15. **[agreed]** **Each town has a sell multiplier per type** (×2, ×1.5 or ×½: a mage city pays ×2 for Arcana, a forge town ×1.5 for Salvage). Every town buys everything at ×½ at least; **Valuables sell at ×1 everywhere** (the safe coin).
16. **[Lucas]** **No Supplies multiplier** (dropped: at 1 SC a day, ×2 or ×3 barely matters past level 1). Instead, availability: every town sells Supplies at 1 SC a day unless it has the **No Supplies** tag (a besieged town, a famine, a hostile outpost): you leave with what you have or Forage.

### The town stat block (logged 2026-11-06)
Short and to the point (Lucas). What players say about settlement rules (a search, 2026-11-06): PF1e's Base Value and Purchase Limit were constantly misread (a per-item limit read as a total budget) and its "75% chance an item is in stock" was argued over; shopping can eat a session (the advice: a short procedure with a clear payoff, or a summary); tactical games often abstract money away (Draw Steel's Wealth score), which the optional quick-sell covers for tables that want it.

> **Kelvah** · Level 5 · Town
> **Tags:** Idols+, Hides · **Poor:** Arcana
> **Purse** 250 SC · **Safe**
> **Services:** crafter, sage, stable, temple
> **Special Wares** (optional): Owl-eye Lenses, a Lesser Wand of Grasping Roots
> *A pilgrim town on the river; the shrine buys every relic it can find.*

17. **[Lucas]** **Level** = the market level: the town sells items up to that level. **[Lucas]** **Availability is never random:** every Common item up to its Level, and every Regional item of its tags, is always on sale (no "75% chance").
18. **[Lucas / agreed]** **Tags** are loot types: a tag (*Idols*) means the town sells Regional Idol items and buys Idols lots at ×1.5; a **+** (*Idols+*) is a specialty, ×2. **Poor** types sell at ×½. Every other type sells at ×1, Valuables always at ×1. Other tags: **No Supplies**.
19. **[Lucas]** **Purse:** how much the town can spend buying from you, **in total, per week**: loot lots and items alike (the rules say "in total" plainly; the block just says Purse). It stops "dump the whole dungeon in the first village" and makes the trip to the city a choice. *Alternative name if Purse reads unclear: Coffers.*
20. **[agreed]** **Safe:** you can Rest there (a town with unrest might not be).
21. **[agreed]** **Services** (one word each): **crafter** (moves enchantments; Repair later), **sage** (identifies items), **stable** (mules), **temple** (a safe Rest even when the town isn't Safe), **stash** (storage; base building later).
22. **[Lucas]** **Special Wares (optional, for the GM):** items **outside the rules' band** that this town happens to have: above its Level, Regional items of another region, a Rare find. **It never limits** what the town sells (the Level and the tags do): "Stock" was dropped because it reads like the whole stock.
23. **[agreed]** **Sizes, a guide:**

| Size | Level | Purse |
|---|---|---|
| Hamlet | 1-2 | 10-50 SC |
| Village | 3 | 100 SC |
| Town | 4-6 | 150-350 SC |
| City | 7-8 | 500-650 SC |
| Capital | 9-10 | 800-1000 SC |

24. **[agreed]** **The travelling merchant** in the same block: Level 2-4 (the GM's pick), no tags, buys everything at ×½ (Valuables ×1), Purse 50 SC, no Services ("sells a little of everything, pays badly, and is gone tomorrow").
25. **[Lucas]** **The Town Visit:** a short checklist in the book, everyone at once, with Foundry buttons: **sell, buy, Supplies, pay Upkeep, Rest, Services.** A town visit takes minutes, not half a session.
26. Left out on purpose: a population number (the size word is enough); skilled work by town size (PF2e's Earn Income is capped by settlement level; a Talent could later earn more than 1 SC a day in bigger towns).

### Selling
27. **[Lucas]** **Quick-sell (optional rule):** sell everything anywhere at ¾, ignoring the multipliers (for players who don't want the trading game). GM note: grant more treasure from time to time to make up for it.
28. **[Lucas]** **Haggling: no general rule.** A **Designer's Note** says how a GM can run it, and warns that it can turn into a tired Appeal roll to see if the price goes up. Better prices come from **Talents** ("you sell for +X").
29. **[Lucas]** **Rare drops (optional rule):** roll 1d12 for each Elite and the boss; on a 12 it explodes into a rare drop. GM note: it makes the players wealthier.
30. **[Lucas]** **A loot ledger**, mostly in Foundry.

## Part 4: Carrying and Expenses

### The inventory
1. **[Lucas]** **The pack is a grid of squares**, Diablo-style: simple to explain ("each item fills that many squares"), and it can look great in Foundry.
2. **[agreed]** The book counts squares only, no item shapes (Tetris shapes are fun but make the paper rules fiddly).
3. **[Lucas / agreed]** **The paper doll** (no squares): **1 worn armor**; **up to 4 weapons and shields on your body, the ones in your hands included** (a sword and a shield in hand plus a bow and a dagger stowed on your belt or back); your bound Bind items. A fifth weapon goes in the pack.
4. **[agreed]** **The Belt** (3 consumables, Part 1): no squares.
5. **[agreed]** **The pack holds your Load in squares:**

| In the pack | Squares |
|---|---|
| A loot lot | 1 to 5 (Part 3) |
| A spare consumable | 1 |
| A spare one-handed weapon or a shield | 1 |
| A spare two-handed weapon | 2 |
| Carried armor (Light / Medium / Heavy) | 2 / 4 / 6 |
| Each Supply beyond the first 7 (1 Supply = 1 day of food and lodging) | 1 |

**Drawing a weapon from the pack takes +1 AP** over a normal draw (as Usage does for consumables).
6. **[Lucas / agreed]** **Load = 10 + 2 × Body** (Body −1 to +4: 8, 10, 12, 14, 16, 18). The base is high and Body is an edge, not a requirement (Lucas: it must not be a burden for non-martial classes, and Body must not become king): on a normal day everyone carries a third of their share of the loot, a strong PC about 1 lot more.
7. **[agreed]** **Over your Load:** Speed −2 in encounters.
8. **[agreed]** **A mule:** 25 SC, +20 squares, 5 CC a Sleep for its feed. A whole day's loot (about 24 squares a PC) always needs a mule or a cart.

What a PC carries in the middle of an adventuring day (Stage 1, after 2 fights of 4; the day's loot is about 8 lots a PC, a lot about 3 squares): a Body +2 Paladin (Heavy armor, Greatsword) fills about 12 of 14 squares with Hides ×2, Salvage, Valuables; a Body +1 Archer about 9 of 12 with Arcana ×2, Idols, Hides, Valuables and a spare Draught; a Body 0 caster about 9 of 10. The second Salvage lot and a drake hide stay on the cave floor: the choice the weight lever is for.

### The Kit
9. **[Lucas]** **The Kit is always available and weighs nothing:** torches, rope, bedroll, waterskin, flint, chalk, crowbar and the like. **Weapons, armor and shields are never Kit.**
10. **[Lucas]** **The Kit wears down on Rough Days** (a short "Rough Day table" in the book, a note for the GM): at 0 Supplies you still have the whole Kit; after a Rough Day you have only **1d4 torches** left, the rest is still there, and the GM keeps track of the wear: the bedroll starts to wear out, rope that is used isn't replenished, and so on. Buying Supplies again restores the Kit.

### Supplies
11. **[Lucas]** **A regular expense abstracts rations, lodging and animals,** and it must not be exploitable by "I never go to town", "I lost my money this week" or "I'll just forage, even in town".
12. **[agreed]** **Supplies are prepaid, per PC: 1 SC a day, flat at every level, and each Sleep spends 1** (Sleep is already at most once every 16 hours and needed for Daily Actions and against Exhausted: nobody skips it, and there is nothing to count by the week). Bought anywhere a vendor exists (the town's Supplies multiplier applies). The first 7 Supplies weigh nothing. Supplies already bought can't be lost with your purse.
13. **[agreed]** **In town** a Sleep spends a Supply, or you pay for the day directly. Broke, you sleep rough: a **Rough Day**.
14. **[agreed]** **Forage:** wilderness only, as the day's activity (never in a town, a dungeon or a desert unless the GM says the land feeds you). It costs half of the day's travel (or the GM makes an extra encounter check). An Instinct Check: Tier 2, tonight's Supply; Tier 3, tonight's Supply for you and an ally. Foraged food never stockpiles.
15. **[agreed]** **Work (in town):** a day of labor earns 1 SC: enough to eat, never enough for an adventurer's life.
16. **[Lucas / agreed]** **A Rough Day** (named so it isn't read as a "short rest") is a Sleep without a Supply, Forage or payment: at your next Rest you regain **1 fewer Rally Point per Rough Day** (at least 1); from the **3rd Rough Day in a row, Exhausted 1**; and the Kit wears down (item 10).
17. **[agreed]** **Per PC by default** (it works for split parties and players who come and go). Anyone can buy Supplies for anyone. Table option: **a shared purse** (one party number; each Sleep spends 1 per PC present).
18. **[Lucas]** Upkeep for bound Bind items is paid on each Sleep, with the Supplies (Part 1).

### No Attribute is king
19. **[Lucas]** No Attribute is king and none is worth dumping (why the game has 4 Attributes and the Weapon and Power Modifiers; Body no longer feeds Health). **[agreed]** Each Attribute gets one job in the economy, none of them big alone:

| Attribute | Its job |
|---|---|
| Body | Load |
| Mind | identifying rare items; crafting later |
| Appeal | selling (the haggling Talents), hiring porters and retainers, reward negotiations |
| Instinct | Forage; travel and finding caches later |

### Stash, home base and Retreat
20. **[Lucas]** **A stash or home base** (a rented room, then a house; storage there ignores Load and costs Upkeep): **later, as base building**, which many players welcome. A high-level money sink.
21. **[Lucas]** **Retreat** (a trend he wants): it prevents a total party kill and saves even Downed PCs, if the player is willing (a meta choice). **Its cost (decided 2026-11-06): the loot.** You drop all the loot lots you carry, and you roll on a **consequence table** (in the spirit of Warhammer: The Old World) whose results can also remove Supplies (and Momentum, and the like). If that leaves a PC at 0 Supplies, the next Sleep is a Rough Day. The table: later.

### Foundry
22. **[Lucas]** **The ledger and the inventory, mostly in Foundry:** the paper doll, the Belt row, the pack as a grid of Load squares (colored by loot type; squares past the Load in red, with a sysLine warning), a Supplies field spent by the Sleep button (a warning at 0, the Rough Day count).

## Open, for later sessions
- **The surprise round** (Part 2, item 4) and Talents for surprise (Sudden Strike).
- **Repair** (Dulled items; the Upkeep counter's open choice, Part 1 item 19a), **crafting with loot**, **Exalted weapons**, **base building**, **Retreat's consequence table**.
- **The mundane price list** (weapons, armor, mounts, services, Kit extras) and the **Rough Day table**.
- **The rare-drop table** (optional rule) and the **unidentified** item type.
- **Talents:** haggling (sell for +X), the Bandolier as a Talent, Sudden Strike.
- **The example items as cards**, written Lucas's way (book/cards/README.md), priced by the ruler (econ.mjs: a worth line per item; the AP check).
- **Where it goes in the book:** a Treasure and Items chapter (or Gear sections), "Actions Out of Combat", the Bestiary's Loot line and lot table, towns in the GM chapter. Then the Foundry pack (foundry-backlog.md).
