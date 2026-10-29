<!-- part: Part I: Core Rules -->
# Chapter 1: The Roll

Roll **2d12** and add the relevant **Modifier**. Compare the total to the **DC** to find the outcome tier.

Many other effects can add extra dice to the roll.

There are four **Attributes**: **Body**, **Mind**, **Appeal** and **Instinct**. They start at 0, and your Species and Class change them when you [[Building a Character|build your character]].

Your **Attribute Modifier** for an Attribute equals its value: with Body 2, your Body Modifier is +2. Weapon, Power and Signature rolls use their own Modifiers instead (see Chapter 5).

## Outcome Tiers

| Tier | Result | Total |
|---|---|---|
| **Tier 1** | Failure | Below the DC |
| **Tier 2** | Marginal Success | From the DC to DC + 6 |
| **Tier 3** | Full Success | DC + 7 or more |

A Tier 2 or Tier 3 result is a **success**; rules that care about it say "when you get a Tier 2 or 3 result." The names of the tiers are flavor: the rules use Tier 1, 2 and 3.

For improvised rolls, such as during roleplay, you don't always need three results: coming up with them every time can take a toll on the GM. When you just want a yes or no, Tier 1 is a failure and Tier 2 or 3 is a success.

## Exploding Dice

When a d12 shows a **12**, it **explodes**: count that die as **11**, then roll it again and add the result. If the new roll is a 12, it explodes again.

> [!example]
> You roll a 12 and a 5. The 12 explodes: you count it as 11 and reroll it, getting an 8. The total is 11 + 8 + 5 = **24**, plus your Modifier.

## Doubles

If both d12s show the **same number** (before explosions), the result moves **up one tier**: Failure becomes Marginal Success, and Marginal Success becomes Full Success. Full Success can't go higher: it becomes a **Critical** instead (see below).

A **Doomed** roll can't produce Doubles (see [[Favored and Doomed Rolls]]).

## Critical

A result is a **Critical** when you roll **Doubles on a result that is already Tier 3**, or when your total is **20 or more above the DC** (33 or more against DC 13). Doubles that raise a Tier 2 to Tier 3 are not a Critical.

A Critical only matters for the few Actions that have a **Critical** row, written under Tier 3 and above the Effects. On a Critical, you get the Tier 3 result and the Critical effect as well. For any other Action, a Critical is simply a Tier 3.

## Boons and Banes

- Each **Boon** adds **1d3-1** to your total (0, 1 or 2).
- Each **Bane** subtracts **1d3-1** from your total.
- Boons and Banes **don't cancel each other**. Roll all of them.

## Favored and Doomed Rolls

When a roll is **Favored**, you roll **3d12** and keep the **highest Tier possible**: usually that's the two highest die results, but sometimes it can be a Double (see below). When a roll is **Doomed**, you roll **3d12** and keep the **two lowest**. A roll that is both Favored and Doomed is a normal roll.

Roll three dice, then see if there are any explosions, calculated per die.

> [!example]
> You are Doomed and roll three different-colored dice: 10 (blue), 12 (green) and 12 (red). You reroll the two 12s and get 10 (green) and 5 (red): green is 11 + 10 = 21 and red is 11 + 5 = 16. You keep the two lowest, blue and red, so your result is **26** (10 + 16).

For Favored rolls you calculate the same way, but if keeping a lower die would give you a higher Tier, the Favored creature chooses which dice to keep.

> [!example]
> You are Favored and roll 1 (blue), 1 (green) and 5 (red). The two highest are a 1 and the 5, but keeping the two 1s gives you Doubles, which can be the better result. You choose which two to keep.

1. Roll 3d12.
2. Each die explodes on its own (a 12 counts as 11 and is rolled again; further 12s explode again). After all explosions, each die has its own total.
3. Keep the two highest totals (Favored) or the two lowest totals (Doomed). A Favored creature can instead keep lower totals if they give a higher Tier.
4. Favored only: for Doubles, compare the faces the two kept dice showed before exploding. A Doomed roll can't produce Doubles.

## Rolls

A **Roll** is anything you roll. There are six kinds, and every roll is exactly one of them:

| Kind | What it is |
|---|---|
| **Check** | One Attribute Modifier against a DC, outside an Action: a "Body Check" (see [[Checks]]). |
| **Save** | A roll to resist something: an "Appeal Save" (see [[Saves]]). |
| **Weapon roll** | An Action with the Weapon trait. It rolls your [[Weapon, Power and Signature Modifiers\|Weapon Modifier]]. |
| **Power roll** | An Action with the Power trait. It rolls your Power Modifier. |
| **Signature roll** | An Action with the Signature trait. It rolls your Signature Modifier. |
| **Attribute Action** | Any other Action that rolls: it rolls the Attribute Modifier named by its Body, Mind, Appeal or Instinct trait. |

If an Action has multiple traits that reference the type of roll, such as the Trip Basic Action that has both Body and Instinct traits, it is both a Body and Instinct Action, even though you only use one Attribute.

A Split Action is a Weapon roll or a Power roll, depending on the mode you choose when you use it.

An effect on Actions names their **trait**: "1 Boon on [Weapon] Actions" helps every Action with the Weapon trait, whatever Modifier it rolls (a [Signature, Weapon] Action too), and doesn't help a Body roll, even if your Weapon Modifier uses your Body Attribute in its calculation when you picked your class. An effect that names a Check or a Save applies only to that kind. An effect that names an Attribute and "Rolls" applies to every kind that uses that Attribute (for a Weapon, Power or Signature roll, the Attribute behind its Modifier). "Your Rolls" means all of them.

Like the previous example, if you actually got "1 Boon on Body Rolls", it would apply to your Weapon rolls, since they use your Body.

| The effect says | Attribute\* Check | Attribute\* Save | Weapon roll (Attribute\*) | Power roll (Attribute\*) | Signature roll (Attribute\*) | Attribute\* Action |
|---|---|---|---|---|---|---|
| 1 Boon on Attribute\* Checks | ✔ | — | — | — | — | — |
| 1 Boon on Attribute\* Saves | — | ✔ | — | — | — | — |
| 1 Boon on [Weapon] Actions | — | — | ✔ | — | ✔ if it has the Weapon trait | — |
| 1 Boon on [Power] Actions | — | — | — | ✔ | ✔ if it has the Power trait | — |
| 1 Boon on Attribute\* Rolls | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |

\*Body, Mind, Appeal or Instinct (the same one in each row and column).

## Checks

A **Check** is a roll of one Attribute Modifier against a DC, written "Body Check" or "Instinct Check". The default DC is 13 unless something says otherwise, like "DC 12 Body Check".

## Saves

Some effects make a creature roll a **Save**, written like "Appeal Save: 1d6 / 1d4 / 0 [M] Holy". The creature that must save rolls the named Attribute Modifier against the DC of the effect.

The DC is usually 11 + the Weapon, Power or Signature Modifier that sets it (or 11 + ⌈Attribute ÷ 2⌉ + 1 for an Attribute-based Save); if no DC is listed, it is usually 13.

The three values are what happens on its Tier 1 / Tier 2 / Tier 3 result: here 1d6 Holy Mind damage on a Tier 1, 1d4 on a Tier 2 and nothing on a Tier 3. Boons, Banes, Doubles, Favored and Doomed work on Saves like on any roll.

### Save Actions

An Action with the **Save** trait doesn't roll: each target rolls the Save the card names (its Vs. line says, for example, **Instinct Save**). The DC comes from the Action's other traits: **11 + your Weapon Modifier** for a [Save, Weapon] Action, **11 + your Power Modifier** for a [Power, Save] Action, **11 + your Signature Modifier** for a [Save, Signature] Action, and for a Save Action that rolls an Attribute (such as [Body, Save]), **11 + ⌈Attribute ÷ 2⌉ + 1**.

The tiers are the target's result: **Tier 1 is the worst for them**. So everything that follows your result on an attack follows theirs here, reversed: a [Save, Weapon] Action deals its [Mod] on **Tier 1 and 2**, and its **Effects** row happens on **Tier 1 and 2**.

A Save Action has no Critical, and it is not a Strike. Boons and Banes on your own rolls don't apply to it; effects on the target's Saves do. **Vulnerable** gives the target that many Banes on the Save, and **Cover** gives them Boons, counted from the center of the area's Point of Origin to the target.

## Roll Effects

Each Tier of a roll says what happens: damage, a condition, a movement, healing. This is how the most common effects are written. Conditions are in [[Chapter 8: Conditions|Conditions]], Heal and Rally Points in [[Rally Points]], and Forced Movement in [[Forced Movement]].

### Damage on a Card

The damage of an Action is what its card says: it adds a Modifier or a weapon's damage only when the card writes [Mod] or [W]. A Weapon Action writes the weapon's damage and its Modifier on the card; a Power Action writes its dice.

### Modifier Damage [Mod]

When an Action deals damage equal to your Modifier, it is written **[Mod]**. The Modifier is always the one you used to roll for that Action. You never add a Modifier to the same damage twice.

When a Weapon Action adds your Modifier to its damage, the Modifier joins the **weapon's damage** and keeps its damage type and subtype: if the weapon deals Mind damage, so does the Modifier.

**Power Actions** don't add their Modifier to damage on any Tier: their damage is the dice on the card.

### Damage Types

All damage a creature takes is either Body or Mind damage, though each of those has different subtypes. Blunt damage will almost always be Body damage, but not always. Damage is written this way:

- **[B]:** the damage is applied to Body.
- **[M]:** the damage is applied to Mind.
- **[C]:** the origin chooses which type (Body or Mind) the damage deals.

Some Actions include two types of damage. For example, "[B] 1d4+1d6+3 Sl; [M] 1d8 Ps" means Body takes 1d4+1d6+3 Slash damage and Mind takes 1d8 Psychic damage.

### Damage Subtypes

Subtypes don't have rules by themselves, but other rules use them, such as Resist and Weak. They are shortened to **two letters**, so they never look like the damage types [B], [M] and [C]:

| Subtype | Short | Subtype | Short | Subtype | Short |
|---|---|---|---|---|---|
| {{dt:Acid}} | {{dc:Ac}} | {{dt:Fire}} | {{dc:Fi}} | {{dt:Psychic}} | {{dc:Ps}} |
| {{dt:Blunt}} | {{dc:Bl}} | {{dt:Force}} | {{dc:Fo}} | {{dt:Slash}} | {{dc:Sl}} |
| {{dt:Cold}} | {{dc:Co}} | {{dt:Holy}} | {{dc:Ho}} | {{dt:Thunder}} | {{dc:Th}} |
| {{dt:Electricity}} | {{dc:El}} | {{dt:Pierce}} | {{dc:Pi}} | {{dt:Unholy}} | {{dc:Un}} |

> [!tbd]
> Resist and Weak, which use damage subtypes, are not written yet.

### Cleave

When you **Cleave** N, you deal the Modifier used as damage (with the same damage type and subtype as your weapon) to up to N creatures that are adjacent to the original target.

## Several Targets

When one Action affects several creatures (an Area, or a Strike that says "all creatures"), you **roll once**, after the targets are chosen (for an Area, after you place it). The dice are shared, but every target is calculated on its own:

- The **DC** is [[Versus|calculated against each creature]].
- Each creature has its own Boons, Banes, Favored and Doomed: cover, Prone, Vulnerable, range and so on can apply to one target and not to another.
- The **Tier**, Doubles and Critical are decided separately for each creature.
- **Damage is rolled per Tier:** once the Action is rolled and you see which creatures landed on which Tier, roll that Tier's damage once and apply it to every creature on that Tier.

For instance, if the Action deals 1d4 / 1d6 / 1d8, and two creatures get Tier 1 and one gets Tier 2, you roll 1d4 once and apply it to the two creatures on Tier 1.

All damage is rolled per die. If the Tier 2 damage of a Save is [B] 1d8 Co + [M] 1d6 Ho, the creature causing the Save rolls both 1d8 and 1d6 and deals that damage to all creatures who got a Tier 2. If the creature causing the Save is Empowered or Enfeebled, the value is added to all the damage rolls.

You roll every die that any of the targets needs, and each target uses only the ones that apply to it. If any target has Favored or Doomed, roll 3d12; for a target without it, use the first two d12 you rolled.

> [!example]
> You attack Peter and Will with one Action. You have 1 Boon against Will but not against Peter. You roll 2d12 and 1 Boon: the Boon is only added to the total you compare with Will's DC.

> [!example]
> You attack one Favored target and one non-Favored target with the same Action. You roll 3d12 (Favored) and keep the two highest for the Favored target; for the non-Favored target, use the first two d12 in the order rolled. Each target checks its own kept dice for Doubles.

## Rounding

Round up by default. When a rule divides or multiplies a number and the result isn't a whole number, round it up, unless the rule says otherwise.

## Reading an Action

Actions are written as cards. Every card has the same structure, in this order:

**Title bar** — Name · Category and level · Frequency · Cost  
*Flavor*  
**Traits**  
**Meta-line 1** — Escalation  
**Meta-line 2** — Targets ✦ Area  
**Meta-line 3** — Distance: X ✦ Vs. X (a Save: "Instinct Save")  
**Requirements**  
**Setup**  
**Trigger / Interrupt**  
**Tier 1 / Tier 2 / Tier 3**  
**Critical**  
**Effects**

@@SAMPLE_CARD@@

**"As X AP".** Some results refer to another cell of the tier table:

- **"As X AP"** means the result in the X AP column on the same Tier. So a Tier 2 effect that says "As 2 AP" uses the same effect as the Tier 2 effect of the 2 AP Version.
- **"As X AP, TY"** means the result in the X AP column on Tier Y. So a Tier 2 effect that says "As 2 AP, T3" uses the same effect as the Tier 3 effect of the 2 AP Version.
- **"As Tier N"** means the result in the same column on Tier N. So a Tier 2 effect that says "As Tier 1" uses the same effect as the Tier 1 effect of this exact Version.

> [!example]
> **Weapon Attack** | At-will | 1AP  
> *You strike with the weapon in your hands.*  
> *Strike · Weapon*  
> **One creature ✦ Weapon ✦ Vs. AD**  
> **Tier 1:** 0  
> **Tier 2:** [B] 1[W] + [Mod]  
> **Tier 3:** [B] 1[W] + [Mod]

**Values that change between Versions.** When an entry under the traits changes from one Version to another, it has one value per Version, in the order of the costs, separated by slashes: **One / one / two creatures**, **5 / 10 sq.**, **Aura 2 / 3 / 3**. Target counts are spelled out in words; distances, areas and other mechanical values use numerals. A distance in squares is written with "sq." (**Distance: 5 sq.**).

### Notation

| Written | Means |
|---|---|
| [[Damage Types\|**[B]**, **[M]**, **[C]**]] | The damage is applied to Body, to Mind, or to the one the origin chooses. On cards in Foundry, a heart {{pool:B}} stands for Body and a brain {{pool:M}} for Mind. |
| [[Weapon Damage\|**[W]**]] | The damage of your weapon. |
| [[Rules Language\|**[Trait]**]] | An Action with that trait: "a [Strike] Action", "[Melee] Actions". Several traits in one pair of brackets mean an Action with all of them: "[Ranged, Weapon] Actions". |
| [[Modifier Damage\|**[Mod]**]] | Damage equal to the Modifier used on the roll: your Weapon Modifier on a Weapon roll, your Power Modifier on a Power roll, your Signature Modifier on a Signature roll, or your Attribute Modifier on an Attribute Action. |
| [[Hazardous Terrain\|**[HT: …]**]] | Hazardous Terrain: written in the text of an effect that creates an area, with its patterns (Entering, Turn, Movement). |
| [[Damage Subtypes\|{{dc:Bl}}, {{dc:Co}}, {{dc:Ho}}, {{dc:Pi}}, {{dc:Ps}}, {{dc:Sl}}...]] | Damage subtypes, always two letters: Blunt, Cold, Holy, Pierce, Psychic, Slash... |
| [[Areas\|**Area: 1 Emanation**]] | The area an Action affects, on its own line. A **Distance** line says how far away it can be placed. |
| [[Weapon Range\|**Distance: Weapon**]] | The Range of the weapon you use for the Action. **Distance: Reach** is your Reach. |
| [[End of Turn\|**EoT**]] | Until the end of the turn of the affected creature. |
| [[Effect Timing\|**(T2/T3)**]] | The effect only happens on those tiers. |
| [[Critical\|**Critical**]] | An extra effect on Doubles with a result that is already Tier 3, or a total 20 or more above the DC. |
| [[Evade\|**Evade 2**]], [[Advance\|**Advance 2**]], [[Pushed\|**Pushed 2**]], [[Pulled\|**Pulled 2**]], [[Slid\|**Slid 2**]], [[Reposition\|**Reposition 2**]] | Movement of up to that many squares. |
| [[Rounds\|**for 2 rounds**]] | How long an effect lasts. |
| [[Versus\|**Vs. Body**]] | The Defense of the target. |
| [[0 AP Actions\|**0 AP**]] | An Action that costs no AP. You can use it only on your turn. |
| [[Linked Actions\|**Weapon Attack (1A)**, **(1A/2A)**]] | A Linked Action and the Version you use (or a choice of two). |
| [[Reactions\|**1R**, **0R**]] | A Reaction that uses 1 AP, or none. |
| [[Escalation\|**1 Escalation**]] | The Escalation an Escalation Action costs, on top of its AP. |

### Rules Language

A single creature is referred to as **they**: "the creature is Hindered until they use a Move Action."

**Allies.** Your **allies** are the creatures on your side. You are never your own ally.

**Origin.** The origin of an effect is the creature that uses the Action, or the Point of Origin of an Area. When a rule says "the origin chooses", the origin decides, not the creature affected.

**Since your last turn, this turn.** A feature that says "since your last turn" counts from the end of your last turn. One that says "this turn" counts from the start of your turn.

**Up to.** A number of things you can use, gain or move is a maximum: you can use fewer, or none, unless the rule says you **must**. "The target can use 2 Rally Points" lets them use 0, 1 or 2.

**Specific beats general.** When a card or a feature says something different from a general rule, the card or feature wins for that case. The Evade Action, for example, doesn't trigger Reactions although movement normally does.

When a rule names a trait before the word "Action," it means an Action with that trait. For example, a **Divine Action** is an Action with the Divine trait. The same goes for a Weapon Action, a Power Action or a Nonlethal Action.

- Traits inside one pair of square brackets, such as **[Ranged, Strike, Weapon] Action**, mean an Action with **all** of those traits: [Trait A, Trait B] is Trait A **and** Trait B. It doesn't mean *only*, it just must include the trait: a [Melee] Weapon Attack (1A) is the Weapon Attack Action that uses 1 AP and has the Melee trait, so it doesn't apply to a [Ranged] Weapon Attack (1A).
- Separate brackets joined by "and" mean **either**: "[Strike] and [Weapon] Actions" are Actions with the Strike trait, the Weapon trait, or both. Alternatives can also be written with "or" inside the brackets: [Melee or Ranged].
- A **Body Action** is an Action with the Body trait, and so on; an Action can be more than one (Trip is both a Body and an Instinct Action).

**Weapons by property.** When a rule names a weapon [[Properties|property]] before the word "weapon," it means a weapon with that property. A **Two-handed weapon** is a weapon with the Two-handed property, and a **Projectile weapon** is a weapon with the Projectile property, such as a bow or a crossbow.

## Summary

1. Roll **2d12** and add the relevant Modifier.
2. Any **12** counts as 11 and is rolled again, adding the result.
3. Add **Boons** (1d3-1 each) and subtract **Banes** (1d3-1 each).
4. Compare to the **DC**: below it is a Failure, from the DC up to DC + 6 is a Marginal Success, and DC + 7 or more is a Full Success.
5. If both d12s match, move the result **up one tier**.
6. A **Favored** roll is 3d12, keeping the two highest. A **Doomed** roll is 3d12, keeping the two lowest.
