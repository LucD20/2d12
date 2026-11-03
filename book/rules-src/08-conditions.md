<!-- part: Part III: Reference -->
# Chapter 8: Conditions

These conditions are in alphabetical order. A creature can't have the same condition twice: if they would gain a condition they already have, keep the longer duration, and for a condition with a value, such as Vulnerable 3, the highest value (see [[Stacking]]). The conditions that come from damage (Bloodied, Strained, Desperate, Dying, Shattered and Unconscious) are in [[Health States]].

### Empowered

**Empowered N** adds N to every die of the damage: with Empowered 1, a d6 deals 1 more, and 2d6 deals 2 more. Flat numbers, and damage with no dice, don't change.

### Enfeebled

**Enfeebled N** is the opposite: it subtracts N from every die of the damage, but each die still deals at least 1. Enfeebled always has a value.

A creature uses one Empowered value and one Enfeebled value, the highest of each (see [[Stacking]]). Subtract the Enfeebled value from the Empowered value, and the result applies to every die of every instance of damage the Action deals. For example, a Reload Shot makes a Strike Empowered 2, and a Fear effect makes the same creature Enfeebled 1: the Strike is Empowered 1.

### Exhausted

Exhausted always has a value, such as **Exhausted 2**. While you are Exhausted:

- Your Speed is reduced by the value (to a minimum of 1).
- All your [[Rolls]] take a penalty equal to the value.
- Your Mind Damage Threshold is reduced by 4 times the value.

A lower Mind Damage Threshold lowers your Health Pool, but not your Rally Points: they use your Health Pool as if you weren't Exhausted.

If your Mind Damage Threshold reaches 0, you must make a **Mind Save** (DC 13). Mind Damage Threshold cannot go below 0.

| Tier | Result |
|---|---|
| **Tier 1** | You fall Unconscious and start a [[Sleep]]. You can't wake up while your Mind Damage Threshold is 0. |
| **Tier 2** | Your Exhausted value increases by 1, and you must make this Save again in 12 hours. |
| **Tier 3** | You must make this Save again in 12 hours. |

### Hindered

Your Speed is halved, rounded down.

### Immobilized

You can't use Move Actions or Evade. Unless otherwise specified, you can remove Immobilized by spending 1 AP [Move]: the one Move Action you can use while Immobilized.

An Immobilized creature is also hard to move. An Action or effect that attempts to [[Forced Movement|Force Move]] or [[Reposition]] you and doesn't roll is automatically disrupted: you aren't moved.

> [!example]
> Lana is Immobilized and her ally, Jared, has a feature that says "At the start of your turn, you can Reposition 3 an ally within Reach." If Jared attempts to use this on Lana, nothing happens and the effect is wasted.

If the Action rolls, the movement also needs the roll to beat the **Immobilized DC**: 11 + the Modifier the origin of the condition used (the Power Modifier for a Power Action, the Weapon Modifier for a Weapon Action, and so on; 13 if the condition has no origin; the highest if there are several). A Save Action doesn't roll, but it always has a Modifier: the origin rolls 2d12 + that Modifier against the Immobilized DC, once for all the Immobilized creatures it would move. If the result is below the Immobilized DC, you aren't moved. The rest of the Action works as usual. Steadiness applies after this check.


### Imperiled

You barely avoided a [[Deadly Hazards|Deadly Hazard]]: you are hanging from a ledge, balancing on the lip of a lava pit, or pinned at the edge of a crushing trap. While you are Imperiled:

- All your [[Rolls]] are Doomed.
- You are Vulnerable 3.

At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled. This takes no Action, but you are [[Slowed]] 1 that turn (or increase your Slowed value by 1), so no condition can keep you there. A creature can help you get to safety with the Interact Action (1 AP, Handle).

### Prone

- Melee Actions against you gain 1 Boon, and Ranged Actions against you suffer 1 Bane.
- You can't [[Evade]].
- The only [Move] Actions you can use are [[Chapter 6: Basic Actions|Crawl]] and [[Chapter 6: Basic Actions|Stand]].

### Quickened

Quickened always has a value, such as **Quickened 2**. You increase your maximum AP, and the AP you regain at the start of your turn, by the value: if you are Quickened 2, you regain 7 AP when your turn begins. You don't gain AP when you become Quickened, only when you regain AP at the start of your next turn.

### Slowed

Slowed always has a value, such as **Slowed 2**. You decrease the AP you regain at the start of your turn by the value: if you are Slowed 2, you regain only 3 AP when your turn begins. You also reduce your maximum AP by the value. You don't lose AP when you become Slowed, only when you regain AP at the start of your next turn.

**Slowed and Quickened** cancel each other out, but they don't reduce each other's value: if you are Quickened 2 and Slowed 2, you regain the normal 5 AP. If one of them ends before your turn comes around (you lose Slowed 2 but are still Quickened 2), you regain 7 AP.

### Vulnerable

Vulnerable always has a value, such as **Vulnerable 3**. Actions against you gain a number of Boons equal to that value. If you would have Vulnerable twice, only the highest value applies.
