# Boons and Banes, Favored's Doubles: the draft for review

**Status (2026-11-08): a draft for Lucas to review (round 2: his first review applied). Nothing is in rules-src, Foundry or the ruler yet.** The decisions are in `rules-backlog.md`, "MODIFIERS, FLAT BOONS, FAVORED'S DOUBLES". Answer by number ("3: fine; 5: change X").
Not in this draft: Weapon and Power Modifiers as class values (decided, drafted separately). It changes the "Body Rolls" table of Chapter 1 (section 2b), so that table is left as it is here.

## What the draft does

1. Boons and Banes are a flat +1 / -1 and cancel each other.
2. Three **names** carry a limit: **Field**, **Pressure** and **Support**. Boons with the same name add up to 2, and so do Banes with the same name. Unnamed ones always add up (a condition's Boons and Banes are unnamed).
3. A name exists only where several sources share a limit. Engaged (2 Banes) and the At-will Bane are one rule each, so they have no name. **Range Banes have no name** (Lucas, round 2): they stack with Cover.
4. Cover is 1 / 2 Field Banes, and **High cover makes the roll Doomed, with no Field Banes from the Cover**. Flanking gives up to 2.
5. Favored: any two matching faces of the three dice are Doubles. Three of a kind is a Critical.

---

## 1. Chapter 1, Doubles (`01-roll.md`)

**Draft** (one sentence added at the end):

> If both d12s show the **same number** (before explosions), the result moves **up one tier**: Failure becomes Marginal Success, and Marginal Success becomes Full Success. Full Success can't go higher: it becomes a **Critical** instead (see below).
>
> A **Doomed** roll can't produce Doubles. On a **Favored** roll, any two of the three dice that match are Doubles (see [[Favored and Doomed Rolls]]).

## 2. Chapter 1, Critical

**Draft** (the first sentence gains three of a kind; the rest is unchanged):

> A result is a **Critical** when you roll **Doubles on a result that is already Tier 3**, when your total is **20 or more above the DC** (33 or more against DC 13), or when a **Favored** roll shows **the same number on all three dice**. Doubles that raise a Tier 2 to Tier 3 are not a Critical.

## 2b. Chapter 1, "An effect on Actions names their trait" and its table

No change in this draft. The Modifiers decision rewrites it, because "1 Boon on Body Rolls" stops reaching Weapon rolls once Modifiers are class values.

## 3. Chapter 1, Boons and Banes (replaces the whole section)

**Now:** each Boon adds 1d3-1, each Bane subtracts 1d3-1, they don't cancel, roll all of them.

**Draft:**

> ## Boons and Banes
>
> - Each **Boon** adds **1** to your total, and each **Bane** subtracts **1**.
> - Boons and Banes **cancel each other**: 3 Boons and 1 Bane add 2 to your total.
>
> ### Named Boons and Banes
>
> Some Boons and Banes have a **name**: **Field**, **Pressure** or **Support**. **Boons with the same name add up to 2, and so do Banes with the same name.** Any more of that name add nothing. Boons and Banes without a name always add up.
>
> | Name | Where it comes from | For example |
> |---|---|---|
> | **Field** | Where you and the target are, and how well you see it | [[Cover]], [[Flanking]], [[Prone]], [[Senses\|Obscured]], a [[Long]] weapon against an adjacent creature, shooting into a melee |
> | **Pressure** | Banes an effect of another creature puts on you | A zone that hinders your Strikes, a blow that leaves you reeling |
> | **Support** | Boons an effect gives several allies at once | A war cry for every ally within 5 squares |
>
> Apply the limit to each side first, then cancel: 3 Field Banes and 1 Field Boon are 2 Banes and 1 Boon, so 1 Bane.

## 4. Chapter 1, Favored and Doomed Rolls (replaces the section, its examples and its procedure)

**Now:** Favored keeps "the highest Tier possible", and the creature may keep a lower pair if it makes Doubles. Step 4 compares the kept dice.

**Draft:**

> ## Favored and Doomed Rolls
>
> When a roll is **Favored**, you roll **3d12** and keep the **two highest**. If **any two** of the three dice show the same number (before explosions), you have **Doubles**, even when one of them is not kept. If all three show the same number, the result is a **Critical**, whatever the total.
>
> When a roll is **Doomed**, you roll **3d12** and keep the **two lowest**. A Doomed roll can't produce Doubles.
>
> A roll that is both Favored and Doomed is a normal roll. A roll can't be Favored or Doomed twice.
>
> > [!example]
> > You are Doomed and roll three different-colored dice: 10 (blue), 12 (green) and 12 (red). You reroll the two 12s and get 10 (green) and 5 (red): green is 11 + 10 = 21 and red is 11 + 5 = 16. You keep the two lowest, blue and red, so your result is **26** (10 + 16), with no Doubles.
>
> > [!example]
> > You are Favored and roll 1 (blue), 1 (green) and 5 (red). You keep the two highest, a 1 and the 5 (**6**), and the two 1s are Doubles: the result moves up one tier.
>
> 1. Roll 3d12.
> 2. Each die explodes on its own (a 12 counts as 11 and is rolled again; further 12s explode again). After all explosions, each die has its own total.
> 3. Keep the two highest totals (Favored) or the two lowest totals (Doomed).
> 4. Favored only: if any two of the three dice showed the same face before exploding, you have Doubles; if all three did, a Critical.

## 5. Chapter 1, Saves (the Save Actions paragraph)

**Draft** ("and it is not a Strike" removed, Lucas round 2: a future Save Action may be one; the last sentence changes):

> A Save Action has no Critical. Boons and Banes on your own rolls don't apply to it; effects on the target's Saves do. **Vulnerable** gives the target that many Banes on the Save. **Cover** gives it Field Boons (1 for Low cover, 2 for Medium), and **High cover makes its Save Favored**, counted from the center of the area's Point of Origin to the target.

## 6. Chapter 1, Several Targets

**Draft** (the paragraph on 3d12 and the two examples):

> You roll every die that any of the targets needs, and each target uses only the ones that apply to it. If any target has Favored or Doomed, roll 3d12: a Favored target keeps the two highest and has Doubles if any two of the three dice match, a Doomed target keeps the two lowest, and any other target uses the first two d12 you rolled.
>
> > [!example]
> > You attack Peter and Will with one Action. You have 1 Boon against Will but not against Peter. You roll 2d12 once: Will's total gets +1 and Peter's doesn't.
>
> > [!example]
> > You attack one Favored target and one non-Favored target with the same Action. You roll 3d12. For the Favored target you keep the two highest, and any pair among the three dice is Doubles. For the other target you use the first two d12 in the order rolled, and only those two can be Doubles.

## 7. Chapter 1, Summary

**Draft** (steps 3, 5 and 6):

> 3. Add **1 for each Boon** and subtract **1 for each Bane**. Named ones (Field, Pressure, Support) count up to 2 of each name.
> 5. If both d12s match, move the result **up one tier**.
> 6. A **Favored** roll is 3d12: keep the two highest, and any pair among the three is Doubles. A **Doomed** roll is 3d12: keep the two lowest, with no Doubles.

## 8. Chapter 2, Stacking (`02-turns.md`)

**Draft** (the second item of "Four things do add up"):

> - **Boons and Banes**, up to the limit of their name (see [[Named Boons and Banes]]).

## 9. Chapter 2, At-will

No change. The At-will Bane stays unnamed: one rule, and the 3 Strikes of a turn keep it at 2 at most.

## 10. Chapter 3, Weapon Range (`03-movement.md`)

The range Banes stay unnamed (Lucas, round 2: they stack with Cover). Only the third bullet changes:

> - **Long.** A weapon with the [[Long]] property takes 1 Field Bane against adjacent creatures. A pike with Range 3 and Long is at its best 2 or 3 squares away.

## 11. Chapter 3, Ranged Combat While Engaged

**Draft:**

> Using a [Ranged] Action while you are [[Engaged]] is hard: you suffer **2 Banes**.
>
> When you use a [Ranged] Action against a creature that is Engaged with a creature other than yourself, you suffer **1 Field Bane**.

## 12. Chapter 3, Flanking

**Draft** (the rule sentence and Examples 2 and 3; the rest is unchanged):

> Creatures that threaten the same enemy **flank** it. A creature that flanks an enemy gains **1 Field Boon** on its [Melee] Actions against that enemy for **each other creature** that flanks it (2 at most, the limit of Field Boons). But each **ally of that enemy that threatens the flanker** cancels 1 of those Boons, and a creature never gains fewer than 0.
>
> **Example 2: Three flankers.** A third ally threatens it too: 2 Field Boons each, which is the limit.
>
> **Example 3: Four or more.** A fourth ally adds no Boon, but it still counts for cancelling: if an ally of the goblin threatens one of the flankers, that flanker keeps 2 (3 minus 1, then the limit).

The diagram `flanking1` shows "3" on the fourth example: it becomes 2 (`diagrams/diagrams.py`).
Example 3's cancelling sentence follows Lucas's answer A: count the other flankers, subtract the cancels, then apply the limit of 2.

## 13. Chapter 3, Cover

**Draft** (the table and the bullets):

> | Blocked corners | Cover | Effect on your Actions against it |
> |---|---|---|
> | 0 | None | None |
> | 1 | Low | 1 Field Bane |
> | 2 | Medium | 2 Field Banes |
> | 3 | High | **Doomed** (and no Field Banes from the Cover) |
> | 4 | Total | No Line of Effect: you can't target them |
>
> - **Creatures in the way.** If another creature is on the line from the center of your square to the center of the target's space, the target has **Low cover** (1 Field Bane). Creatures never count as blocked corners, and cover doesn't add up: you take the highest cover that applies.
> - **Cover and the rest.** Cover applies to melee and ranged Actions alike. Its Field Banes count with your other Field Banes. High cover gives no Field Banes, only Doomed; your other Field Banes still apply (Prone, Obscured). A target that is Hidden and behind High cover is still only Doomed once.

The sentence "The number of Banes is the number of blocked corners" is deleted.

## 14. Chapter 3, the Line area

No change (range Banes stay unnamed).

## 15. Chapter 3, Senses

**Draft** (the Obscured row):

> | **Obscured** | 1 Field Bane. | 1 Field Boon. |

## 16. Chapter 7, Ranged (`07-traits.md`)

No change (range Banes stay unnamed).

## 17. Chapter 8, Prone (`08-conditions.md`)

**Draft** (the first bullet):

> - Melee Actions against you gain 1 Field Boon, and Ranged Actions against you suffer 1 Field Bane.

Frightened, Sickened, Taunted and Vulnerable don't change: their Boons and Banes are unnamed, so they stack.

## 18. Gear (`15-gear.md`)

- Ranges (line 20): no change.
- Long (line 108): "you take **1 Field Bane** on Weapon Actions with it against adjacent creatures".
- **Two-handed in one hand: no change.** It stays 3 Banes, unnamed, so the limit doesn't apply to it.
- Ringing Blow (card): "its next [Strike] Action takes 1 Pressure Bane (EoT)".
- Point Blank (card): no change (Engaged's Banes are unnamed).

## 19. Basic Actions and the Bestiary

- Charge (1 Boon), Reload (2 Boons): no change, unnamed.
- The Bestiary's Mild row: "1 Pressure Bane on its next roll".
- Elite Escalation 1 ("1 Boon on its first attack each round"): no change, unnamed.
- Rally the Tribe (card): "allies within 5 squares gain 1 Support Boon on their next [Weapon] Action".

## 20. Glossary (`09-glossary.md`)

| Term | Draft |
|---|---|
| **Bane, Boon** | Subtract or add 1 to a roll; they cancel each other. Named ones count up to 2 of each name. |
| **Field** (new) | A named Boon or Bane from position and sight: Cover, Flanking, Prone, Obscured, Long, shooting into a melee. Up to 2. |
| **Pressure** (new) | A named Bane another creature's effect puts on you. Up to 2. |
| **Support** (new) | A named Boon an effect gives several allies at once. Up to 2. |
| **Named Boons and Banes** (new) | Field, Pressure and Support: up to 2 Boons and 2 Banes of each name. Unnamed ones always add up. |
| **Cover** | How well a target is protected: 1 Field Bane for each blocked corner, up to 2; three blocked corners make the roll Doomed. |
| **Flanking** | ...each gets 1 Field Boon on [Melee] Actions against it for each other flanker, up to 2, minus 1 for each ally of the enemy that threatens it. |
| **Favored** | 3d12, keep the two highest; any pair among the three is Doubles, three of a kind a Critical. |
| **Obscured, Long, Ranged Combat While Engaged** | "Bane" becomes "Field Bane" where the rule is Field (Engaged's 2 and the range Banes stay unnamed). |
| **Stacking** | "...Boons and Banes (up to the limit of their name)..." |

## 21. A writing rule for cards (`book/cards/README.md`, `rules-src/README.md`)

> - Give a Boon or Bane a **name** only when several sources must share a limit. A Bane an effect puts on enemies is **Pressure**; a Boon an effect gives several allies at once (an aura, a zone, "allies within N") is **Support**; one from position or sight is **Field**.
> - An unnamed Boon or Bane is 1, rarely 2, never "1 for each X": anything that scales gets a name, so it gets a limit.

## 22. Outside this draft (to do when it is applied)

- **Class cards** (card by card with Lucas): Consecrated Ground, Covering Fire and Harrying Shots become Pressure. Marked Quarry and Hunter's Focus stay unnamed (2 Boons against the quarry). Covering Shot (one ally) stays unnamed. Talents later.
- **Foundry:** calc.mjs (flat b/b, the names and their limit, any pair on Favored, three of a kind), rolls.keepDice, the roll dialog's b/b inputs (a field per name), the roll's tooltip (for example "Field 2 (3, limit 2)"), flanking.mjs (limit 2), cover (High is Doomed), the dice tests (t42 and the rest).
- **Ruler:** calc.mjs is shared with Foundry. spec.mjs and map.mjs (Field limit without the range Banes, flankBoons up to 2, High cover Doomed), then re-run report.md, rclasses.md and rbestiary.md.
- **Diagrams:** flanking1 (3 becomes 2), cover (High cover's label).

## Decided in round 2 (Lucas, 2026-11-08)

- **A. Flanking:** subtract the cancels first, then apply the limit of 2.
- **B. High cover on a Save:** the Save is Favored.
- **C. Pressure** applies to any roll the effect names (Saves and Checks included).
- Range Banes are unnamed (they stack with Cover); the "No name" list and the Zack example are cut (unnamed b/b stack, nothing more needs saying); "and it is not a Strike" removed from Save Actions; Engaged's "they have no name" sentence and Cover's "(2 at most)" removed (don't repeat a rule that is already in place; "see Chapter N" when needed).

## Assumptions I made

- With High cover, the target's other Field b/b (Prone, Obscured) and the range Banes still apply.
- The limit is applied to each side before cancelling (3 Field Banes + 1 Field Boon = 1 Bane).
- A roll can't be Favored twice or Doomed twice (new sentence; it was implied before).
