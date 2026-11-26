<!-- doc: gear -->
# Gear

## Weapons

Each weapon belongs to a [[Weapon Groups|Weapon Group]] and has its own **Weapon Technique**, which you unlock with [[Mastery]]. A Weapon Technique can only be used with the weapon it belongs to, while you wield it: its Weapon Actions use that weapon, never another one.

> [!example]
> A Paladin with a Weapon Modifier of +1 deals [V] 6 + 1d4! + 1 Sl on a Tier 2 with a Longsword Basic Attack: 8 to 10, and more when the die explodes.

### Weapon Damage [W]

**[W]** is the damage of your weapon: on each Tier, **a flat number plus at most one small die**. **A weapon's die explodes**, so it is written with **!** (see [[Exploding Dice]]): on its highest face, count it as one less and roll it again. An Action that deals 1[W] adds one instance of the weapon's damage. 2[W] is two instances: the flat number twice and two dice. A weapon's damage has its own pool and subtype, written in its table.

*Example:* an Action that deals 2[W] deals [V] 0 / 12 + 2d4! / 18 + 2d6! with a Longsword, and [V] 0 / 2 + 2d4! / 4 + 2d4! with a Hunting Bow.

**[D]** is your weapon's **die** on that Tier, without its flat number: written beside [W], it means you roll that die once more. A Longsword's Tier 3 is 9 + 1d6!, so "1[W] + 1[D]" deals 9 + 2d6!; with a Hunting Bow (2 + 1d4!) it deals 2 + 2d4!. A weapon whose Tier has no die adds nothing.

### Reading the Weapon Tables

- **Group:** its [[Weapon Groups|Weapon Group]].
- **Range:** in squares. Melee weapons have a [[Weapon Range|Range]] too: 1 for most of them. For a ranged weapon, the first number is the normal range, the second the far range (1 Bane) and the third the maximum range (2 Banes).
- **Damage:** Tier 1 / Tier 2 / Tier 3, all [V]. Tier 1 is 0 for every weapon. A [[Thrown]] weapon's damage is for the weapon in hand.
- **Rung:** Basic, Advanced or Exotic (see [[Mastery]]). Only Basic weapons are written so far.

> [!tbd]
> **Every weapon in these tables except the Arming Sword, the Longsword, the Hunting Bow and the Recurve Bow is a placeholder**, made to playtest and to fill the tables: its numbers and its properties are rewritten when its Weapon Group is, and it has no Weapon Technique until then (its old one left the book, Lucas 2026-11-25). Those four are the model.

### Melee

| Name | Group | Properties | Subtype | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Arming Sword | Swords | Melee | Slash | 1 | [V] 0 / 3 + 1d4! / 4 + 1d6! | Basic |
| Longsword | Swords | Melee, Two-handed | Slash | 1 | [V] 0 / 6 + 1d4! / 9 + 1d6! | Basic |
| Dagger | Daggers | Light, Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic (placeholder) |
| Handaxe | Axes | Light, Melee, Thrown | Slash | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 2 + 1d8! | Basic (placeholder) |
| Greataxe | Axes | Melee, Two-handed | Slash | 1 | [V] 0 / 4 + 1d6! / 10 + 1d8! | Basic (placeholder) |
| Mace | Hammers | Melee | Blunt | 1 | [V] 0 / 3 + 1d4! / 5 + 1d4! | Basic (placeholder) |
| Maul | Hammers | Melee, Two-handed | Blunt | 1 | [V] 0 / 6 + 1d4! / 9 + 1d6! | Basic (placeholder) |
| Spear | Polearms | Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic (placeholder) |
| Pike | Polearms | Long, Melee, Two-handed | Pierce | 3 | [V] 0 / 4 + 1d6! / 6 + 1d8! | Basic (placeholder) |
| Knuckle Dagger | Unarmed | Barehanded, Melee | Pierce | 1 | [V] 0 / 2 + 1d4! / 3 + 1d4! | Basic (placeholder) |

#### Melee Weapon Techniques

The two swords are the two ways to hold one. The **Arming Sword** leaves a hand free, and its Technique uses that hand on the foe. The **Longsword** takes both hands, hits half again as hard, and its Technique holds the foe's blade.

**Arming Sword:**

@@CARD:Seizing Cut@@

**Longsword:**

@@CARD:Thwart Cut@@

### Ranged

| Name | Group | Properties | Subtype | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Hunting Bow | Bows | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [V] 0 / 1 + 1d4! / 2 + 1d4! | Basic |
| Recurve Bow | Bows | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [V] 0 / 1 + 1d4! / 1 + 1d6! | Basic |
| Hand Crossbow | Crossbows | Projectile, Ranged, Reload | Pierce | 6 / 12 / 24 | [V] 0 / 1d4! / 1 + 1d4! | Basic (placeholder) |
| Crossbow | Crossbows | Projectile, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic (placeholder) |
| Pistol | Firearms | Firearm, Ranged, Reload | Pierce | 5 / 10 / 20 | [V] 0 / 1d4! / 2 + 1d8! | Basic (placeholder) |
| Musket | Firearms | Firearm, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | [V] 0 / 1d4! / 4 + 1d8! | Basic (placeholder) |

The two bows deal the same on average and are played in opposite ways. The **Hunting Bow** reaches farther, and its Technique is for the archer who holds a position: a wound that keeps bleeding. The **Recurve Bow** is the short bow of the archer who never stands still: its Technique begins with a step.

#### Ranged Weapon Techniques

**Hunting Bow:**

@@CARD:Wounding Shot@@

**Recurve Bow:**

@@CARD:Circling Shot@@

### Hands

You have two hands: your **main hand** and your **off hand**. You choose which is which when you make your character. Each weapon you hold uses one or two hands.

**[Strike, Weapon] Actions with a weapon you hold in your off hand take 2 Banes.** A weapon you hold with both hands doesn't take them, and a [[Light (property)|Light]] weapon takes only 1. Your [[Fists (the weapon)|Fists]] use a free hand: with only your off hand free, they take 1 Bane.

> [!example]
> Steven holds an Arming Sword in each hand. A Basic Attack with the one in his main hand has no Bane for his hands; one with the Arming Sword in his off hand takes 2 Banes.

 A weapon with the **Two-handed** property must be held with both hands: [Strike, Weapon] Actions with it held in one hand **take 3 Banes, and the off-hand Banes too if that hand is your off hand**. A weapon or your Fists in the other hand don't take them.

Actions with the [[Handle]] trait need a free hand; [[Release]] and [[Regrip]] change what your hands hold.

### Properties

Weapons have properties instead of traits: Melee, Ranged, Light, Long, Projectile, Firearm, Strung, Thrown, Reload, Two-handed, Barehanded and Non-threatening. Every weapon has the property of its kind: a melee weapon has Melee, a ranged weapon has Ranged.

An Action with the Weapon trait and the Melee or Ranged trait needs a weapon with that property.

#### Barehanded

A **Barehanded** weapon can't be disarmed and doesn't occupy a hand (or a similar appendage), but you must still have a free hand to use it. Fists are Barehanded. A hidden blade, a Knuckle Dagger or a spiked buckle could be too.

> [!tbd]
> How a creature is disarmed, or a weapon broken, is not written yet.

#### Firearm

A **Firearm** (placeholder rule) shoots with powder, such as a pistol or a musket. It is not a Projectile weapon: Projectile Actions can't use it. Firearm Actions need a Firearm.

#### Light (property)

A **Light** weapon (placeholder rule) is a small melee weapon you hold in one hand, such as a Dagger or a Handaxe. In your off hand, a Light weapon takes **1 Bane** instead of 2 (see [[Hands]]). Some Actions need a Light weapon, such as the Archer's Darting Blade.

#### Long

A weapon with the **Long** property (placeholder rule) is made to keep enemies at a distance: you take **1 Field Bane** on Weapon Actions with it against adjacent creatures, and it doesn't threaten them (see [[Flanking]]).

#### Projectile

A **Projectile** weapon shoots something, such as a bow or a crossbow, instead of being swung or thrown. Projectile Actions need a Projectile weapon.

#### Strung

You hold a **Strung** weapon in one hand and draw it with the other: **[Strike, Weapon] Actions with it take 3 Banes while your other hand holds something.** A Strung weapon never takes the off-hand Banes (see [[Hands]]): either hand can hold it. Every bow is Strung.

#### Thrown

A weapon with the **Thrown** property (placeholder rule) can be used in hand or thrown, and it has a Range for each, written like "Range 1, Thrown 4 / 8 / 12". Used in hand, a Weapon Action with it is a Melee Action; thrown, it is a Ranged Action, uses the thrown Range and **deals 1 less damage on Tiers 2 and 3**. A thrown weapon leaves your hand.

#### Non-threatening

A weapon with the **Non-threatening** property doesn't threaten: you can't flank with it (see [[Flanking]]), unless a feature says otherwise. Fists have it.

#### Reload (property)

A weapon with the Reload property (placeholder rule) doesn't need to be reloaded every time you use it: you can reload quickly between shots. But you can make a more powerful shot that does require a reload.

Before you roll a Weapon Strike with the weapon, you can choose to make a **Reload Shot**: the Strike is **[[Favored and Doomed Rolls|Favored]]**, and its damage adds **1d6!**, as [[Empowered]] does (even if you already dealt damage this turn; you don't become Empowered). After the shot, you must Reload before you can use that weapon again. See the Reload Action in [[Chapter 6: Basic Actions]].

### Weapon Groups

Every weapon belongs to one of nine **Weapon Groups**: **Swords**, **Daggers**, **Axes**, **Hammers**, **Polearms**, **Bows**, **Crossbows**, **Firearms** and **Unarmed** (Fists and the Knuckle Dagger). Weapons of a group are used the same way, so what you learn with one helps with the others: see [[Mastery]].

### Mastery

Anyone can use any weapon; you get better with the ones you use. You have a **Mastery** with each weapon, starting at 0.

**When your side wins an encounter that was normal or harder, you gain 1 Mastery with one weapon you made a [Strike] Action with in it.** Your side wins when the encounter ends with every enemy Down, fled or surrendered. The difficulty is the one the encounter was built with (see [[Building an encounter]]): the GM says it when the fight ends. You gain 1 Mastery an encounter, with one weapon: if you made Strikes with several, you choose.

Mastery belongs to you, not to the weapon you hold: it is for a kind of weapon (a Hunting Bow, a Longsword), so a better or different Hunting Bow uses the same Mastery, and you keep it when you lose the weapon.

**The group follows.** Your Mastery with a weapon is never lower than **half your highest Mastery with a weapon of its [[Weapon Groups|group]]** (rounded down). When you gain Mastery with a weapon, it rises by 1 from what it is.

> [!example]
> Zack has 20 Mastery with the Hunting Bow. His Mastery with every other bow is at least 10, so the Recurve Bow's Weapon Technique is unlocked for him. If he wins his next fight shooting the Recurve Bow, he can raise it to 11.

**Every weapon's unlocks are at the same Mastery**, except an Exotic weapon's Weapon Technique, unlocked at 20 (below).

| Mastery | You unlock |
|---|---|
| **10** | The weapon's **Weapon Technique**. Until then, you can't use it. |
| **20, 30, 45, 60** | The weapon's later unlocks. |

**Basic, Advanced and Exotic weapons.** Every weapon is on one of three rungs. Anyone can use a **Basic** weapon. [Strike] Actions with an **Advanced** weapon are [[Favored and Doomed Rolls|Doomed]] while your Mastery with it is below 10, and with an **Exotic** weapon while it is below 20: you reach them by using the simpler weapons of the group. An Advanced weapon's Technique is unlocked at 10 like any other, an Exotic weapon's at 20.

> [!tbd]
> Only the two Basic swords and the two Basic bows are written this way so far, each with its Weapon Technique. Not written yet: each weapon's unlocks at 20, 30, 45 and 60, the Advanced and Exotic weapons, a rule to help a table that fights less than about five times a level, how classes or Talents grant Mastery beyond the Archer's starting Mastery (5 with one Projectile weapon), and Spell Mastery for casters (D4).

### Fists (the weapon)

Every creature counts as having **Fists**. They are a weapon like any other, with the properties Barehanded, Melee and Non-threatening, in the Unarmed group. While you have a free hand, your Fists count as a weapon you are wielding, alongside any other weapon you hold: a Weapon Action can use them. Fists have no Weapon Technique.

| Name | Group | Properties | Subtype | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Fists | Unarmed | Barehanded, Melee, Non-threatening | Blunt | 1 | [V] 0 / 2 / 1d6! | - |

Fists are used with the [[Chapter 6: Basic Actions|Fists Basic Action]], and with a Weapon Action that isn't the Basic Attack.

## Armor

The armor a creature wears gives its **Armor value**, and its Armor Defense is **11 + that value** (see [[Defenses]]).

| Armor | Armor value | Armor Defense |
|---|---|---|
| Unarmored | 0 | 11 |
| Light | 1 | 12 |
| Medium | 2 | 13 |
| Heavy | 3 | 14 |

> [!tbd]
> Wards (a holy symbol, a charm, a ring) and their Ward values are not written yet: a character's Ward value is 0 for now.

### Armor Training

Each class has an **Armor Training**: Light, Medium or Heavy. Each one includes the lighter ones (Heavy covers Medium and Light), and every creature is trained in Unarmored. The Paladin has Heavy and the Archer Light.

If you wear armor you are not trained in, **all your Rolls are Doomed**, and **Actions that roll against your Armor Defense or Ward Defense are Favored**.

> [!tbd]
> Armor properties and named armors are not written yet: Resistance by damage subtype (padded, mail, plate), drawbacks (Bulky −1 Speed, Noisy for stealth), Warded (+1 WD), shields (a Block Reaction), and an unarmored Talent tree.

