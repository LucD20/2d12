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

**Some damage dice explode the same way.** A damage die written with **!** (1d6!) explodes: when it shows its highest face, count that face as **one less**, then roll it again and add the result; it can explode again. A d6! that shows a 6 and then a 4 deals 5 + 4 = 9. Every weapon's die is written with ! (see [[Weapon Damage [W]]]); a die with no ! never explodes.

## Doubles

If both d12s show the **same number** (before explosions), the result moves **up one tier**: Failure becomes Marginal Success, and Marginal Success becomes Full Success. Full Success can't go higher: it becomes a **Critical** instead (see below).

A **Doomed** roll can't produce Doubles. On a **Favored** roll, any two of the three dice that match are Doubles (see [[Favored and Doomed Rolls]]).

## Critical

A result is a **Critical** when you roll **Doubles on a result that is already Tier 3**, when your total is **20 or more above the DC** (33 or more against DC 13), or when a **Favored** roll shows **the same number on all three dice**. Doubles that raise a Tier 2 to Tier 3 are not a Critical.

A Critical matters for the few Actions that have a **Critical** row, written under Tier 3 and above the Effects. On a Critical, you get the Tier 3 result and the Critical effect as well. For any other Action, a Critical is simply a Tier 3. Once an encounter, a Critical on one of your Actions also raises your Escalation by 1 (see [[Escalation]]).

## Boons and Banes

- Each **Boon** adds **1** to your total, and each **Bane** subtracts **1**.
- Boons and Banes **cancel each other**: 3 Boons and 1 Bane add 2 to your total.

### Named Boons and Banes

Some Boons and Banes have a **name**: **Field**, **Pressure** or **Support**. The rule or Action that gives them writes the name ("1 Field Bane", "1 Support Boon"); a Boon or Bane written without a name has none. **Boons with the same name add up to 2, and so do Banes with the same name.** Any more of that name add nothing. Boons and Banes without a name always add up.

| Name | What it is | For example |
|---|---|---|
| **Field** | Where you and the target are, and how well you see it | [[Cover]], [[Flanking]], [[Prone]], [[Senses\|Obscured]], a [[Long]] weapon against an adjacent creature, shooting into a melee |
| **Pressure** | Banes an effect of another creature puts on you | A zone that hinders your Strikes, a blow that leaves you reeling |
| **Support** | Boons an effect gives several allies at once | A war cry for every ally within 5 squares |

Apply the limit to each side first, then cancel: 3 Field Banes and 1 Field Boon are 2 Banes and 1 Boon, so 1 Bane.

### Five Boons or Banes

After the limits and the cancelling, if you still have **5 or more Boons**, you don't add them: the roll is **Favored** instead. With **5 or more Banes**, the roll is **Doomed** instead. 8 Boons and 3 Banes leave 5 Boons: the roll is Favored. 6 Boons and 2 Banes leave 4 Boons: add 4.

## Favored and Doomed Rolls

When a roll is **Favored**, you roll **3d12** and keep the **two highest**. If **any two** of the three dice show the same number (before explosions), you have **Doubles**, even when one of them is not kept. If all three show the same number, the result is a **Critical**, whatever the total.

When a roll is **Doomed**, you roll **3d12** and keep the **two lowest**. A Doomed roll can't produce Doubles.

A roll that is both Favored and Doomed is a normal roll. A roll can't be Favored or Doomed twice.

Roll three dice, then see if there are any explosions, calculated per die.

> [!example]
> You are Doomed and roll three different-colored dice: 10 (blue), 12 (green) and 12 (red). You reroll the two 12s and get 10 (green) and 5 (red): green is 11 + 10 = 21 and red is 11 + 5 = 16. You keep the two lowest, blue and red, so your result is **26** (10 + 16), with no Doubles.

> [!example]
> You are Favored and roll 1 (blue), 1 (green) and 5 (red). You keep the two highest, a 1 and the 5 (**6**), and the two 1s are Doubles: the result moves up one tier.

1. Roll 3d12.
2. Each die explodes on its own (a 12 counts as 11 and is rolled again; further 12s explode again). After all explosions, each die has its own total.
3. Keep the two highest totals (Favored) or the two lowest totals (Doomed).
4. Favored only: if any two of the three dice showed the same face before exploding, you have Doubles; if all three did, a Critical.

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

An effect on Actions names their **trait**: "1 Boon on [Weapon] Actions" helps every Action with the Weapon trait, whatever Modifier it rolls (a [Signature, Weapon] Action too). An effect that names a Check or a Save applies only to that kind. An effect that names an Attribute and "Rolls" applies to every kind that rolls that Attribute: its Checks, its Saves and its Attribute Actions. Weapon, Power and Signature rolls use no Attribute. "Your Rolls" means all of them.

| The effect says | Attribute\* Check | Attribute\* Save | Attribute\* Action | Weapon roll | Power roll | Signature roll |
|---|---|---|---|---|---|---|
| 1 Boon on Attribute\* Checks | ✔ | — | — | — | — | — |
| 1 Boon on Attribute\* Saves | — | ✔ | — | — | — | — |
| 1 Boon on Attribute\* Rolls | ✔ | ✔ | ✔ | — | — | — |
| 1 Boon on [Weapon] Actions | — | — | — | ✔ | — | ✔ if it has the Weapon trait |
| 1 Boon on [Power] Actions | — | — | — | — | ✔ | ✔ if it has the Power trait |

\*Body, Mind, Appeal or Instinct (the same one in each row and column).

## Checks

A **Check** is a roll of one Attribute Modifier against a DC, written "Body Check" or "Instinct Check". The default DC is 13 unless something says otherwise, like "DC 12 Body Check".

## Saves

Some effects make a creature roll a **Save**, written like "Appeal Save: [R] 1d6 / 1d4 / 0 Ho". The creature that must save rolls the named Attribute Modifier against the DC of the effect.

The DC is usually 11 + the Weapon, Power or Signature Modifier that sets it (or 11 + ⌈Attribute ÷ 2⌉ + 1 for an Attribute-based Save); if no DC is listed, it is usually 13.

The three values are what happens on its Tier 1 / Tier 2 / Tier 3 result: here 1d6 Holy Resolve damage on a Tier 1, 1d4 on a Tier 2 and nothing on a Tier 3. Boons, Banes, Doubles, Favored and Doomed work on Saves like on any roll.

### Save Actions

An Action with the **Save** trait doesn't roll: each target rolls the Save the card names (its roll line says, for example, **Save: Instinct**). The DC comes from the Action's other traits: **11 + your Weapon Modifier** for a [Save, Weapon] Action, **11 + your Power Modifier** for a [Power, Save] Action, **11 + your Signature Modifier** for a [Save, Signature] Action, and for a Save Action that rolls an Attribute (such as [Body, Save]), **11 + ⌈Attribute ÷ 2⌉ + 1**. These are your **Power DC**, your **Weapon DC**, your **Signature DC** and the DC of an Attribute (your **Body DC**): a rule or a card can name one ("an Appeal Save against your Power DC").

The tiers are the target's result: **Tier 1 is the worst for them**. So everything that follows your result on an attack follows theirs here, reversed: a [Save, Weapon] Action deals its [Mod] on **Tier 1 and 2**, and a line for two Tiers is written **Tier 1 or 2**.

A Save Action has no Critical. Boons and Banes on your own rolls don't apply to it; effects on the target's Saves do. **Vulnerable** gives the target that many Banes on the Save. **Cover** gives it Field Boons (1 for Low cover, 2 for Medium), and **High cover makes its Save Favored**, counted from the center of the area's Point of Origin to the target.

## Roll Effects

Each Tier of a roll says what happens: damage, a condition, a movement, healing. This is how the most common effects are written. Conditions are in [[Chapter 8: Conditions|Conditions]], Heal and Rally Points in [[Rally Points]], and Forced Movement in [[Forced Movement]].

### Damage on a Card

The damage of an Action is what its card says: it adds a Modifier or a weapon's damage only when the card writes [Mod] or [W]. A Weapon Action writes the weapon's damage and its Modifier on the card; a Power Action writes its dice.

### Modifier Damage [Mod]

When an Action deals damage equal to your Modifier, it is written **[Mod]**. The Modifier is always the one you used to roll for that Action. You never add a Modifier to the same damage twice.

When a Weapon Action adds your Modifier to its damage, the Modifier joins the **weapon's damage** and keeps its damage type and subtype: if the weapon deals Resolve damage, so does the Modifier.

**Power Actions** don't add their Modifier to damage on any Tier: their damage is the dice on the card.

### Damage Types

All damage a creature takes is either **Vigor damage** (wounds, bruises, broken bones) or **Resolve damage** (fear, pain, despair), named after the two thresholds of the [[Health Pool]]; each of those has different subtypes. Blunt damage will almost always be Vigor damage, but not always. Damage is written this way:

- **[V]:** Vigor damage.
- **[R]:** Resolve damage.
- **[C]:** the origin chooses which type (Vigor or Resolve) the damage deals.

Vigor and Resolve are not the Body and Mind Attributes: an Action of any Attribute can deal either.

Some Actions include two types of damage. For example, "[V] 1d4+1d6+3 Sl + [R] 1d8 Ps" deals 1d4+1d6+3 Slash Vigor damage and 1d8 Psychic Resolve damage.

### Damage Subtypes

Subtypes don't have rules by themselves, but other rules use them, such as Resist and Weak. They are shortened to **two letters**, so they never look like the damage types [V], [R] and [C]:

| Subtype | Short | Subtype | Short | Subtype | Short |
|---|---|---|---|---|---|
| {{dt:Acid}} | {{dc:Ac}} | {{dt:Fire}} | {{dc:Fi}} | {{dt:Psychic}} | {{dc:Ps}} |
| {{dt:Blunt}} | {{dc:Bl}} | {{dt:Force}} | {{dc:Fo}} | {{dt:Slash}} | {{dc:Sl}} |
| {{dt:Cold}} | {{dc:Co}} | {{dt:Holy}} | {{dc:Ho}} | {{dt:Thunder}} | {{dc:Th}} |
| {{dt:Electricity}} | {{dc:El}} | {{dt:Pierce}} | {{dc:Pi}} | {{dt:Unholy}} | {{dc:Un}} |

### Resist, Weak and Immune

Some creatures take less, or more, damage of a subtype. It is written on the creature, with a number: **Resist 2 Fire**, **Weak 5 Holy**, **Immune Fire**. A Hatchling might have Resist 2 Fire, a Young dragon Resist 5 and an Ancient one Immune Fire.

- Each time you take damage from one Action or effect, add up **all its damage of that subtype**, Vigor and Resolve together, and apply your line **once**: **Resist N** reduces the total by N (minimum 0), **Weak N** adds N. "[V] 1d8 Fi + [R] 5 Fi" against Resist 5 Fire is (1d8 + 5) − 5: one reduction, never one per part.
- When the damage is split between Vigor and Resolve, the resisting creature chooses which part it reduces first; for Weak, the origin chooses where the extra goes.
- **Immune** makes that damage 0.
- Damage that comes back each turn, such as [[Lingering]], counts each time it lands: Resist 5 Fire stops a Lingering 3 Fi entirely.
- Two Resists or two Weaks of the same subtype don't add up: the highest applies (see [[Stacking]]).

### Riders

In a tier cell, what follows the damage **rides on it**: "[V] 2d8 Pi; Prone" knocks the target Prone only if the Action deals that damage, more than 0 once Resist and Immune are applied. [[Guard]] doesn't stop a rider: Guard takes damage that was dealt. An effect that must happen even without the damage is written on the **Effects** row, or in a cell of its own with no damage. A Save Action's cells read the same way, each on its own result.

### Cleave

When you **Cleave** N, you deal the Modifier used as damage (with the same damage type and subtype as your weapon) to up to N creatures that are adjacent to the original target.

## Several Targets

When one Action affects several creatures (an Area, or a Strike that says "all creatures"), you **roll once**, after the targets are chosen (for an Area, after you place it). The dice are shared, but every target is calculated on its own:

- The **DC** is [[Versus|calculated against each creature]].
- Each creature has its own Boons, Banes, Favored and Doomed: cover, Prone, Vulnerable, range and so on can apply to one target and not to another.
- The **Tier**, Doubles and Critical are decided separately for each creature.
- **Damage is rolled per Tier:** once the Action is rolled and you see which creatures landed on which Tier, roll that Tier's damage once and apply it to every creature on that Tier.

For instance, if the Action deals 1d4 / 1d6 / 1d8, and two creatures get Tier 1 and one gets Tier 2, you roll 1d4 once and apply it to the two creatures on Tier 1.

All damage is rolled per die. If the Tier 2 damage of a Save is [V] 1d8 Co + [R] 1d6 Ho, the creature causing the Save rolls both 1d8 and 1d6 and deals that damage to all creatures who got a Tier 2. If the creature causing the Save is Empowered, its 1d6! goes to one creature it damages (see [[Empowered]]).

You roll every die that any of the targets needs, and each target uses only the ones that apply to it. If any target has Favored or Doomed, roll 3d12: a Favored target keeps the two highest and has Doubles if any two of the three dice match, a Doomed target keeps the two lowest, and any other target uses the first two d12 you rolled.

> [!example]
> You attack Peter and Will with one Action. You have 1 Boon against Will but not against Peter. You roll 2d12 once: Will's total gets +1 and Peter's doesn't.

> [!example]
> You attack one Favored target and one non-Favored target with the same Action. You roll 3d12. For the Favored target you keep the two highest, and any pair among the three dice is Doubles. For the other target you use the first two d12 in the order rolled, and only those two can be Doubles.

## Rounding

Round up by default. When a rule divides or multiplies a number and the result isn't a whole number, round it up, unless the rule says otherwise.

## Reading an Action

Actions are written as cards. Every card has the same structure, from top to bottom:

1. **The name.**
2. **Escalation, Frequency and cost**, at the right of the name: the [[Escalation]] the card needs (if any), its [[Frequency]] and its cost in Action Points. A card with no cost says **Passive**.
3. **The Flavor:** one sentence that describes what is done and seen. It is not a rule.
4. **The traits**, on a line of their own.
5. **Distance and Area:** how far the Action reaches, and the area it affects.
6. **Target:** whom it affects.
7. **The roll**, as the first line of what the Action does: **Attack: Weapon vs. Armor Defense** (you roll that Modifier against that [[Defenses|Defense]]) or **Save: Appeal** (each target rolls that [[Saves|Save]]).
8. **The Tiers:** what happens on each result of the roll. A line can stand for two Tiers ("Tier 1 or 2"); a Tier that isn't written does nothing.
9. **The other lines.** Every line of a card has a label that says what it is:

| Label | What the line is |
|---|---|
| **Requirement** | What must be true to use the card (see [[Requirements]]). |
| **Interrupt**, **Trigger** | The moment a [[Reactions|Reaction]] answers. |
| **Setup** | What happens before the rest of the Action (see [[Setup]]). |
| A word in bold (**Smite dice**, **Judged**) | A word the card defines for its own text. |
| **Effect** | What happens when the card is used, whatever the roll. Before the roll's line, it happens before the roll; after the Tiers, after them. |
| **Critical** | An extra result on a [[Critical]], under Tier 3. |
| **Special** | A rule about the card itself: a limit, an exception, an extra cost. |
| **Passive** | What a card with no cost does. It works on its own. |

The lines are written in the order they happen.

**Versions and Modes.** Some cards have parts under a heading of their own. A **Version** is the same Action at another cost: its heading is the cost ("1 AP", "2 AP"), and you pay the cost of the Version you use. A **Mode** is one of several things the card can do at the same cost: its heading is the Mode's name, followed by the traits only that Mode has, and each time you use the card you choose one Mode. A part has its own lines, and its own Distance and Target when they differ. Lines written above the parts belong to all of them. The card's Frequency counts every use of the card, whichever Version or Mode.

The numbers on the two cards below are the numbers of the list. The first card needs no Escalation and has no Area, so neither is printed; the second has two Versions, and **10** marks the heading of one.

@@SAMPLE_CARD@@

**"As X AP".** Some results refer to another cell of the tier table:

- **"As X AP"** means the result in the X AP column on the same Tier. So a Tier 2 effect that says "As 2 AP" uses the same effect as the Tier 2 effect of the 2 AP Version.
- **"As X AP, TY"** means the result in the X AP column on Tier Y. So a Tier 2 effect that says "As 2 AP, T3" uses the same effect as the Tier 3 effect of the 2 AP Version.
- **"As Tier N"** means the result in the same column on Tier N. So a Tier 2 effect that says "As Tier 1" uses the same effect as the Tier 1 effect of this exact Version.

> [!example]
> **Weapon Attack** | At-will · 1 AP  
> *You strike with the weapon in your hands.*  
> *Weapon · Strike*  
> **Distance: Weapon ✦ Target: One creature**  
> **Attack:** Weapon vs. Armor Defense  
> **Tier 1:** 0  
> **Tier 2:** [V] 1[W] + [Mod]  
> **Tier 3:** [V] 1[W] + [Mod]

**Values written with slashes.** Some cards write an entry under the traits once for all their Versions, with one value per Version, in the order of the costs, separated by slashes: **One / one / two creatures**, **5 / 10 sq.**, **Aura 2 / 3 / 3**. Target counts are spelled out in words; distances, areas and other mechanical values use numerals. A distance in squares is written with "sq." (**Distance: 5 sq.**).

### Notation

| Written | Means |
|---|---|
| [[Damage Types\|**[V]**, **[R]**, **[C]**]] | Vigor damage, Resolve damage, or the one the origin chooses. On cards in Foundry, a heart {{pool:V}} stands for Vigor and a brain {{pool:R}} for Resolve. |
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
| [[Versus\|**Attack: Body vs. Body**]] | The Modifier you roll, and the Defense of the target. |
| [[Save Actions\|**Save: Instinct**]] | The Save each target rolls. |
| [[Rounds\|**(1 round)**]] | After a condition or an effect: it lasts 1 round. |
| [[0 AP Actions\|**0 AP**]] | An Action that costs no AP. You can use it only on your turn. |
| [[Linked Actions\|**Weapon Attack (1A)**, **(1A/2A)**]] | A Linked Action and the Version you use (or a choice of two). |
| [[Reactions\|**1R**, **0R**]] | A Reaction that uses 1 AP, or none (which AP can pay: see [[Reactions]]). |
| [[Escalation\|**Escalation 4**]] | The Escalation an Action needs: you can use it only while your Escalation is at least that number. Nothing is spent. |

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
3. Add **1 for each Boon** and subtract **1 for each Bane**. Named ones (Field, Pressure, Support) count up to 2 of each name. If 5 or more Boons are left after cancelling, the roll is Favored instead; 5 or more Banes, Doomed.
4. Compare to the **DC**: below it is a Failure, from the DC up to DC + 6 is a Marginal Success, and DC + 7 or more is a Full Success.
5. If both d12s match, move the result **up one tier**.
6. A **Favored** roll is 3d12: keep the two highest, and any pair among the three is Doubles. A **Doomed** roll is 3d12: keep the two lowest, with no Doubles.
