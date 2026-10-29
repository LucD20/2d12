<!-- doc: gear -->
# Gear

## Weapons

Your class determines your Weapon Modifier. Each weapon also has its own Weapon Technique, which you unlock with [[Mastery]].

> [!example]
> A Paladin whose Weapon Modifier uses Body deals 1d8 + Body slash damage on Tier 2 with a Greatsword Weapon Attack.

### Weapon Damage [W]

**[W]** is the damage of your weapon. An Action that deals 1[W] adds one instance of the weapon's damage. 2[W] is two instances, including any modifier and all dice. A weapon's damage has its own type, written in its table ([B] for every weapon so far): 1[W] deals that type, whatever the rest of the Action deals. Later weapons, such as wands and staves, may deal Mind damage or both.

*Example:* an Action that deals 2[W] deals 0 / 2d8 / 4d6 with a Greatsword, and 0 / 2d4+4 / 2d10+4 with a Crossbow.

### Melee

Melee weapons have a [[Weapon Range|Range]] too: 1 for most of them.

| Name | Properties | Type | Range | Damage (Tier 1 / Tier 2 / Tier 3) |
|---|---|---|---|---|
| Greatsword | Two-handed | Slash | 1 | [B] 0 / 1d8 / 2d6 |

<div class="action" markdown="1">
<div class="action-head"><span>Reaping Sweep</span><span>1 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** A wide, heavy arc for anyone standing too close.

*Melee • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Sl |
| **Tier 2** | [B] 1d10 + [Mod] Sl; Cleave 1 |
| **Tier 3** | [B] 2d6 + [Mod] Sl; Cleave 2 |

</div>

### Ranged

**Range:** the first number is the normal range. The second is the far range, which causes 1 Bane. The third is the maximum range, which causes 2 Banes. Ranges are always in squares.

| Name | Properties | Type | Range | Damage (Tier 1 / Tier 2 / Tier 3) |
|---|---|---|---|---|
| Crossbow | Projectile, Reload, Two-handed | Pierce | 10 / 20 / 40 | [B] 0 / 1d4+2 / 1d10+2 |

<div class="action" markdown="1">
<div class="action-head"><span>Lock & Loose</span><span>1 AP</span><span class="cat">Weapon Technique</span></div>

**Flavor:** A bolt to the knee, and they go nowhere.

*Ranged • Shot • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Pi |
| **Tier 2** | [B] 1d4+2+[Mod] Pi; For 1 round, the creature is Hindered until they use a Move Action. |
| **Tier 3** | [B] 1d10 + [Mod] Pi; Immobilized |

</div>

### Hands

You have two hands. Each weapon you hold uses one or two hands. A weapon with the **Two-handed** property must be held with both hands: holding it with one hand gives **3 Banes on all [Strike, Weapon] Actions**, including Actions that use another weapon. Actions without the Weapon trait, such as Trip and Shove, don't take these Banes.

You need a hand free to use Handle Actions. A creature with both hands full has to **Release** something first (0 AP: drop an object, or let go of it with one hand), and can **Interact** (1 AP) to grip a weapon with both hands again.

### Properties

Weapons have properties instead of traits: Melee, Ranged, Long, Projectile, Thrown, Reload, Two-handed, Barehanded and Non-threatening. Every weapon has the property of its kind: a melee weapon has Melee, a ranged weapon has Ranged.

An Action with the Weapon trait and the Melee or Ranged trait needs a weapon with that property. A Weapon Action without them takes [[Weapon Actions and Your Weapon|the property of the weapon you use]].

#### Barehanded

A **Barehanded** weapon can't be disarmed and doesn't occupy a hand (or a similar appendage), but you must still have a free hand to use it. Fists are Barehanded. A hidden blade or a spiked buckle could be too.

#### Long

A weapon with the **Long** property is made to keep enemies at a distance: you take **1 Bane** on Weapon Actions with it against adjacent creatures, and it doesn't threaten them (see [[Flanking]]). A pike has Range 3 and Long.

#### Projectile

A **Projectile** weapon shoots something, such as a bow or a crossbow, instead of being swung or thrown. [[Shot]] Actions need a Projectile weapon.

#### Thrown

A weapon with the **Thrown** property can be used in hand or thrown, and it has a Range for each, written like "Range 1, Thrown 4 / 8 / 12". Used in hand, a Weapon Action with it is a Melee Action; thrown, it is a Ranged Action and uses the thrown Range. A thrown weapon leaves your hand.

#### Non-threatening

A weapon with the **Non-threatening** property doesn't threaten: you can't flank with it (see [[Flanking]]), unless a feature says otherwise. Fists have it.

#### Reload

A weapon with the Reload property doesn't need to be reloaded every time you use it: you can reload quickly between shots. But you can make a more powerful shot that does require a reload.

Before you roll a Weapon Strike with the weapon, you can choose to make a **Reload Shot**: the Strike is **[[Favored and Doomed Rolls|Favored]]** and **[[Empowered]] 2**. After the shot, you must Reload before you can use that weapon again. See the Reload Action in [[Chapter 6: Basic Actions]].

### Mastery

Anyone can use any weapon; you get better with the ones you use. Each time you get a **Tier 3** on a Weapon Action with a weapon, you gain **1 Mastery** with that kind of weapon (once per Action, even against several targets).

Mastery belongs to you, not to the weapon you hold: it is for a kind of weapon (a Greatsword, a Crossbow), so a better or different Greatsword uses the same Mastery, and you keep it when you lose the weapon.

| Mastery | You unlock |
|---|---|
| **3** | The weapon's **Weapon Technique**. Until then, you can't use it. |
| **8** | To be decided. |
| **15** | To be decided. |

> [!tbd]
> What 8 and 15 Mastery unlock (an Advanced Technique?), and how classes or Talents grant Mastery (the Archer's Sharpshooter starts at 3 with one weapon).

### Fists

Every creature counts as having **Fists**. They are a weapon like any other, with the properties Barehanded, Melee and Non-threatening. While you have a free hand, your Fists count as a weapon you are wielding, alongside any other weapon you hold: a Weapon Action can use them.

| Name | Properties | Type | Range | Damage (Tier 1 / Tier 2 / Tier 3) |
|---|---|---|---|---|
| Fists | Barehanded, Melee, Non-threatening | Blunt | 1 | [B] 0 / 1 / 1d4 |

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

