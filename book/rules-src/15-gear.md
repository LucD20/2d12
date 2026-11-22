<!-- doc: gear -->
# Gear

## Weapons

Your class determines your Weapon Modifier. Each weapon belongs to a [[Weapon Groups|Weapon Group]] and has its own **Weapon Technique**, which you unlock with [[Mastery]]. A Weapon Technique can only be used with the weapon it belongs to, while you wield it: its Weapon Actions use that weapon, never another one.

> [!example]
> A Paladin with a Weapon Modifier of +1 deals [V] 6 + 1d4! + 1 Sl on a Tier 2 with a Longsword Basic Attack: 8 to 10, and more when the die explodes.

### Weapon Damage [W]

**[W]** is the damage of your weapon: on each Tier, **a flat number plus at most one small die**. **A weapon's die explodes**, so it is written with **!** (see [[Exploding Dice]]): on its highest face, count it as one less and roll it again. An Action that deals 1[W] adds one instance of the weapon's damage. 2[W] is two instances: the flat number twice and two dice. A weapon's damage has its own type, written in its table ([V] for every weapon so far): 1[W] deals that type, whatever the rest of the Action deals. Later weapons, such as wands and staves, may deal Resolve damage or both.

*Example:* an Action that deals 2[W] deals [V] 0 / 12 + 2d4! / 18 + 2d6! with a Longsword, and [V] 0 / 4 + 2d4! / 8 + 2d4! with a Crossbow.

**[D]** is your weapon's **die** on that Tier, without its flat number: written beside [W], it means you roll that die once more. A Longsword's Tier 3 is 9 + 1d6!, so "1[W] + 1[D]" deals 9 + 2d6!; with a Hunting Bow (2 + 1d4!) it deals 2 + 2d4!. A weapon whose Tier has no die adds nothing.

### Reading the Weapon Tables

- **Group:** its [[Weapon Groups|Weapon Group]].
- **Range:** in squares. Melee weapons have a [[Weapon Range|Range]] too: 1 for most of them. For a ranged weapon, the first number is the normal range, the second the far range (1 Bane) and the third the maximum range (2 Banes).
- **Damage:** Tier 1 / Tier 2 / Tier 3, all [V]. Tier 1 is 0 for every weapon. A [[Thrown]] weapon's damage is for the weapon in hand.
- **Rung:** Basic, Advanced or Exotic (see [[Mastery]]). Only Basic weapons are written so far.

A melee weapon deals more than a ranged one, which strikes from safety. Among melee weapons, one that takes both hands deals the most and one that leaves a hand free less: what the weapon can do pays for the difference. The die tells weapons apart: a d4 on a big flat number is steady (Hammers, Crossbows), a d8 swings (Axes, Firearms), a d6 is in the middle.

> [!tbd]
> **Every weapon in these tables except the Arming Sword, the Longsword, the Hunting Bow and the Recurve Bow is a placeholder**, made to playtest and to fill the tables: its numbers, its properties and its Weapon Technique are rewritten when its Weapon Group is. Those four are the model.

### Melee

| Name | Group | Properties | Type | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Arming Sword | Swords | Melee | Slash | 1 | [V] 0 / 3 + 1d4! / 4 + 1d6! | Basic |
| Longsword | Swords | Melee, Two-handed | Slash | 1 | [V] 0 / 6 + 1d4! / 9 + 1d6! | Basic |
| Dagger | Daggers | Light, Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic |
| Handaxe | Axes | Light, Melee, Thrown | Slash | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 2 + 1d8! | Basic |
| Greataxe | Axes | Melee, Two-handed | Slash | 1 | [V] 0 / 4 + 1d6! / 10 + 1d8! | Basic |
| Mace | Hammers | Melee | Blunt | 1 | [V] 0 / 3 + 1d4! / 5 + 1d4! | Basic |
| Maul | Hammers | Melee, Two-handed | Blunt | 1 | [V] 0 / 6 + 1d4! / 9 + 1d6! | Basic |
| Spear | Polearms | Melee, Thrown | Pierce | 1, Thrown 4 / 8 / 12 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic |
| Pike | Polearms | Long, Melee, Two-handed | Pierce | 3 | [V] 0 / 4 + 1d6! / 6 + 1d8! | Basic |
| Knuckle Dagger | Unarmed | Barehanded, Melee | Pierce | 1 | [V] 0 / 2 + 1d4! / 3 + 1d4! | Basic |

> [!tbd]
> The placeholder weapons' Techniques, below and in the Ranged list, still write the dice of the earlier weapon table (a Greataxe's 1d6 / 2d8), and Point Blank still writes a Bane while Engaged: each is rewritten with its Weapon Group.

#### Melee Weapon Techniques

The two swords are the two ways to hold one. The **Arming Sword** leaves a hand free, and its Technique uses that hand on the foe. The **Longsword** takes both hands, hits half again as hard, and its Technique holds the foe's blade.

**Arming Sword:**

@@CARD:Seizing Cut@@

**Longsword:**

@@CARD:Thwart Cut@@

**The placeholder weapons:**

@@CARD:Stick and Slip@@

@@CARD:Hooking Chop@@

@@CARD:Rending Chop@@

@@CARD:Ringing Blow@@

@@CARD:Bowl Over@@

@@CARD:Lunge@@

@@CARD:Keep Them Off@@

@@CARD:Gut Punch@@
### Ranged

| Name | Group | Properties | Type | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Hunting Bow | Bows | Projectile, Ranged, Strung | Pierce | 8 / 16 / 24 | [V] 0 / 1 + 1d4! / 2 + 1d4! | Basic |
| Recurve Bow | Bows | Projectile, Ranged, Strung | Pierce | 6 / 12 / 18 | [V] 0 / 1 + 1d4! / 1 + 1d6! | Basic |
| Hand Crossbow | Crossbows | Projectile, Ranged, Reload | Pierce | 6 / 12 / 24 | [V] 0 / 1d4! / 1 + 1d4! | Basic |
| Crossbow | Crossbows | Projectile, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | [V] 0 / 2 + 1d4! / 4 + 1d4! | Basic |
| Pistol | Firearms | Firearm, Ranged, Reload | Pierce | 5 / 10 / 20 | [V] 0 / 1d4! / 2 + 1d8! | Basic |
| Musket | Firearms | Firearm, Ranged, Reload, Two-handed | Pierce | 10 / 20 / 40 | [V] 0 / 1d4! / 4 + 1d8! | Basic |

The two bows deal the same on average and are played in opposite ways. The **Hunting Bow** reaches farther, and its Technique is for the archer who holds a position: a wound that keeps bleeding. The **Recurve Bow** is the short bow of the archer who never stands still: its Technique begins with a step.

#### Ranged Weapon Techniques

**Hunting Bow:**

@@CARD:Wounding Shot@@

**Recurve Bow:**

@@CARD:Circling Shot@@

**The placeholder weapons:**

@@CARD:Sting@@

@@CARD:Lock & Loose@@

@@CARD:Point Blank@@

@@CARD:Thunderclap@@
### Hands

You have two hands: your **main hand** and your **off hand**. You choose which is which when you make your character. Each weapon you hold uses one or two hands.

**[Strike, Weapon] Actions with a weapon you hold in your off hand take 2 Banes.** A weapon you hold with both hands doesn't take them, and a [[Light (property)|Light]] weapon takes only 1. Your [[Fists (the weapon)|Fists]] use a free hand: with only your off hand free, they take 1 Bane.

> [!example]
> Steven holds an Arming Sword in his main hand and a Dagger in his off hand. A Basic Attack with the Arming Sword has no Bane for his hands; one with the Dagger takes 1 Bane, as a Light weapon in the off hand. With the two weapons the other way around, the Arming Sword in his off hand would take 2 Banes.

 A weapon with the **Two-handed** property must be held with both hands: holding it with one hand gives **3 Banes on [Strike, Weapon] Actions with that weapon**. A weapon or your Fists in the other hand don't take them.

You need a hand free to use Handle Actions. A creature with both hands full has to **Release** something first (0 AP: drop an object, or let go of it with one hand), and can **[[Regrip|Regrip]]** (1 AP) to hold a weapon with both hands again, move a weapon to the other hand or swap the weapons in your hands (Regrip doesn't need a free hand).

### Properties

Weapons have properties instead of traits: Melee, Ranged, Light, Long, Projectile, Firearm, Strung, Thrown, Reload, Two-handed, Barehanded and Non-threatening. Every weapon has the property of its kind: a melee weapon has Melee, a ranged weapon has Ranged.

An Action with the Weapon trait and the Melee or Ranged trait needs a weapon with that property. A Weapon Action without them takes [[Weapon Actions and Your Weapon|the property of the weapon you use]].

#### Barehanded

A **Barehanded** weapon can't be disarmed and doesn't occupy a hand (or a similar appendage), but you must still have a free hand to use it. Fists are Barehanded. A hidden blade, a Knuckle Dagger or a spiked buckle could be too.

#### Firearm

A **Firearm** shoots with powder, such as a pistol or a musket. It is not a Projectile weapon: Projectile Actions can't use it. Firearm Actions need a Firearm, and a Weapon Action with a Firearm is a Firearm Action.

#### Light (property)

A **Light** weapon is a small melee weapon you hold in one hand, such as a Dagger or a Handaxe. In your off hand, a Light weapon takes **1 Bane** instead of 2 (see [[Hands]]). Some Actions need a Light weapon, such as the Archer's Darting Blade.

#### Long

A weapon with the **Long** property is made to keep enemies at a distance: you take **1 Field Bane** on Weapon Actions with it against adjacent creatures, and it doesn't threaten them (see [[Flanking]]). A Pike has Range 3 and Long.

#### Projectile

A **Projectile** weapon shoots something, such as a bow or a crossbow, instead of being swung or thrown. Projectile Actions need a Projectile weapon.

#### Strung

You hold a **Strung** weapon in one hand and draw it with the other: **[Strike, Weapon] Actions with it take 3 Banes while your other hand holds something.** A Strung weapon never takes the off-hand Banes (see [[Hands]]): either hand can hold it. Every bow is Strung.

#### Thrown

A weapon with the **Thrown** property can be used in hand or thrown, and it has a Range for each, written like "Range 1, Thrown 4 / 8 / 12". Used in hand, a Weapon Action with it is a Melee Action; thrown, it is a Ranged Action, uses the thrown Range and **deals 1 less damage on Tiers 2 and 3** (a thrown Dagger: [V] 0 / 1 + 1d4! / 3 + 1d4!). A thrown weapon leaves your hand.

#### Non-threatening

A weapon with the **Non-threatening** property doesn't threaten: you can't flank with it (see [[Flanking]]), unless a feature says otherwise. Fists have it.

#### Reload (property)

A weapon with the Reload property doesn't need to be reloaded every time you use it: you can reload quickly between shots. But you can make a more powerful shot that does require a reload.

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

**Every weapon's unlocks are at the same Mastery**, except an Exotic weapon's Weapon Technique, unlocked at 20 (below). A deeper weapon has fewer of them.

| Mastery | You unlock |
|---|---|
| **10** | The weapon's **Weapon Technique**. Until then, you can't use it. |
| **20, 30, 45, 60** | The weapon's later unlocks. |

**Basic, Advanced and Exotic weapons.** Every weapon is on one of three rungs. Anyone can use a **Basic** weapon. [Strike] Actions with an **Advanced** weapon are [[Favored and Doomed Rolls|Doomed]] while your Mastery with it is below 10, and with an **Exotic** weapon while it is below 20: you reach them by using the simpler weapons of the group. An Advanced weapon's Technique is unlocked at 10 like any other, an Exotic weapon's at 20.

> [!tbd]
> Only the two Basic swords and the two Basic bows are written this way so far, each with its Weapon Technique. Not written yet: each weapon's unlocks at 20, 30, 45 and 60, the Advanced and Exotic weapons, a rule to help a table that fights less than about five times a level, how classes or Talents grant Mastery beyond the Archer's starting Mastery (5 with one Projectile weapon), and Spell Mastery for casters (D4).

### Fists (the weapon)

Every creature counts as having **Fists**. They are a weapon like any other, with the properties Barehanded, Melee and Non-threatening, in the Unarmed group. While you have a free hand, your Fists count as a weapon you are wielding, alongside any other weapon you hold: a Weapon Action can use them. Fists have no Weapon Technique: Unarmed Talents give their Actions.

| Name | Group | Properties | Type | Range | Damage | Rung |
|---|---|---|---|---|---|---|
| Fists | Unarmed | Barehanded, Melee, Non-threatening | Blunt | 1 | [V] 0 / 2 / 1 + 1d4! | - |

Fists are used with the [[Chapter 6: Basic Actions|Fists Basic Action]], or with any Weapon Action.

## Armor

The armor a creature wears gives its **Armor value**, and its Armor Defense is **11 + that value** (see [[Defenses]]).

| Armor | Armor value | Armor Defense |
|---|---|---|
| Unarmored | 0 | 11 |
| Light | 1 | 12 |
| Medium | 2 | 13 |
| Heavy | 3 | 14 |

### Armor Training

Each class has an **Armor Training**: Light, Medium or Heavy. Each one includes the lighter ones (Heavy covers Medium and Light), and every creature is trained in Unarmored. The Paladin has Heavy and the Archer Light.

If you wear armor you are not trained in, **all your Rolls are Doomed**, and **Actions that roll against your Armor Defense or Ward Defense are Favored**.

> [!tbd]
> Armor properties and named armors are not written yet: Resist by damage subtype (padded, mail, plate), drawbacks (Bulky −1 Speed, Noisy for stealth), Warded (+1 WD), shields (a Block Reaction), and an unarmored Talent tree.

