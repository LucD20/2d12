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
