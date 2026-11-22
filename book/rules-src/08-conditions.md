<!-- part: Part III: Reference -->
# Chapter 8: Conditions

These conditions are in alphabetical order. Unless a card says otherwise, a creature can't have the same condition twice: if they would gain a condition they already have, keep the longer duration, and for a condition with a value, such as Vulnerable 3, the highest value (see [[Stacking]]). **A condition with a source**, such as Daunted of a creature, Taunted by one or Grabbed by one, comes from one source at a time: if you gain it from a different source, the new one replaces the old one, with its own duration. **It ends when its source goes Down or is Unconscious** (an object that is a source: when it is destroyed). The effect that gives a condition says how long it lasts (EoT or a number of rounds: see [[Effect Timing]]); a condition written with no duration lasts until the encounter ends (EoE). **Ignoring a condition.** A creature that ignores a condition keeps it, but the condition does nothing to it; its duration still runs, and it works again when the creature stops ignoring it. The conditions that come from damage (Bloodied, Strained, Desperate, Dying, Shattered and Unconscious) are in [[Health States]].

### Blinded

You can't see: for your Sight, everything is Darkness (see [[Senses]]). Creatures you only hear are Hidden to you, so your Actions against them are Doomed, and you can't target a creature you don't perceive. Any other Roll that needs sight is Doomed. Actions with the Area trait still affect the creatures in their area. Every square is [[Difficult Terrain]] for you, as Darkness is for a creature that can't see in it: you move by feel.

### Daunted

Daunted is always **of** a source: a creature or an object. While you perceive the source with your Sight (it is Clear or Obscured to you: see [[Senses]]), all your [[Rolls]] take **1 Bane**, and every square that brings you closer to the source is [[Difficult Terrain]] for you (Forced Movement ignores it). Put a wall between you and the source, or let the source stand in Darkness, and it is out of your Sight: the Bane and the Difficult Terrain stop until you see it again.

### Dazed

Dazed always has a value, such as **Dazed 1**. When you become Dazed, you lose that many AP right away (never your Reaction Point). If you have fewer AP than the value, you lose the AP you have, and the rest is taken from the AP you regain at the start of your next turn; then Dazed ends. Dazed is the condition that takes AP now; [[Slowed]] takes them on your next turn.


### Empowered

The first time you deal damage on each of your turns, add **1d6!** to it (see [[Exploding Dice]]). The die deals the same kind of damage as the Action (its pool and its type). If the Action damages several creatures, you choose which one takes it. For a [[Save Actions|Save Action]], you choose it before the creatures roll their Saves; if that creature then takes no damage, the die is lost. Empowered has no value: you are Empowered or you aren't, and being Empowered twice changes nothing.

> [!tbd]
> The die grows at later Stages (with those Stages' numbers).

### Exhausted

Exhausted always has a value, such as **Exhausted 2**. While you are Exhausted:

- Your Speed is reduced by the value (to a minimum of 1).
- All your [[Rolls]] take as many **Banes** as the value.
- Your Resolve is reduced by 4 times the value.

A lower Resolve lowers your Health Pool, but not your Rally Points: they use your Health Pool as if you weren't Exhausted. The [[Health Pool|floor]] of a third doesn't apply to it.

If your Resolve reaches 0, you must make a **Mind Save** (DC 13). Resolve cannot go below 0.

| Tier | Result |
|---|---|
| **Tier 1** | You fall Unconscious and start a [[Sleep]]. You can't wake up while your Resolve is 0. |
| **Tier 2** | Your Exhausted value increases by 1, and you must make this Save again in 12 hours. |
| **Tier 3** | You must make this Save again in 12 hours. |

### Grabbed

A creature within its Reach holds you: you are [[Immobilized]], and only the holder can [[Forced Movement|Force Move]] or [[Reposition]] you (the holder's own Forced Movement or Reposition of you ignores your Immobilized). Grabbed ends when the holder lets go (no Action), when you are no longer within the holder's Reach, when the holder goes Down or is Unconscious, or when you end Immobilized with [[Break Free]] (1 AP [Move]: a Body or Instinct Check against the [[Action DC]] of the Action that grabbed you). The holder can't use the hand or limb that holds you for anything else.

### Half-Blinded

Your Sight perceives no creature better than Obscured: a creature that would be Clear to you is Obscured (see [[Senses]]). Your other senses aren't affected.

### Hindered

Your Speed is halved, rounded down. If you become Hindered while you are moving, the movement you have left is halved too, rounded down.

### Immobilized

You can't use Move Actions or Evade. If you become Immobilized while you are moving, your movement ends. Unless otherwise specified, you can remove Immobilized with [[Break Free]] (1 AP [Move]: a Body or Instinct Check against the [[Action DC]] of the Action that Immobilized you): the one Move Action you can use while Immobilized.

An Immobilized creature is also hard to move. An Action or effect that attempts to [[Forced Movement|Force Move]] or [[Reposition]] you and doesn't roll is automatically disrupted: you aren't moved.

> [!example]
> Lana is Immobilized and her ally, Jared, has a feature that says "At the start of your turn, you can Reposition 3 an ally within Reach." If Jared attempts to use this on Lana, nothing happens and the effect is wasted.

If the Action rolls, the movement also needs the roll to beat the [[Action DC]] of the Action that Immobilized you (11 + the Modifier that Action used; 13 with no Action behind it; the highest if there are several). A Save Action doesn't roll, but it always has a Modifier: the origin rolls 2d12 + that Modifier against that Action DC, once for all the Immobilized creatures it would move. If the result is below it, you aren't moved. The rest of the Action works as usual. Steadiness applies after this check.


### Imperiled

You barely avoided a [[Deadly Hazards|Deadly Hazard]]: you are hanging from a ledge, balancing on the lip of a lava pit, or pinned at the edge of a crushing trap. While you are Imperiled:

- All your [[Rolls]] are Doomed.
- You are Vulnerable 3.

At the start of your turn you get back to safety, to a legal square next to the hazard, and stop being Imperiled. This takes no Action, but you are [[Slowed]] 1 that turn (or increase your Slowed value by 1), so no condition can keep you there. A creature can help you get to safety with the Interact Action (1 AP, Handle).

### Lingering

**Lingering X (Attributes)** is damage that keeps coming: at the end of each of your turns, you take X damage, a number or dice rolled each time. It is Vigor damage when the Attributes are **Bo/In** and Resolve damage when they are **Mi/Ap**, unless the Lingering writes its pool before the value: **Lingering [V] 1 (Ap)** is Vigor damage with an Appeal Save. A Lingering can have a subtype, written after the value: **Lingering [R] 1d6 Ho (Mi/Ap)**: a wound that bleeds, a fire that clings, holy light that keeps burning.

You can end it with the [[Shake Off]] Action (1 AP), on yourself or on a Lingering creature within your Reach: the Lingering creature makes a Save with the better of the two Attributes against **DC 13**, or the DC the Lingering writes (**Lingering 1d6 (Bo/In; DC 15)**). **Tier 1:** no effect. **Tier 2:** you take half the Lingering at the end of the current turn (even when it is another creature's turn, such as an ally's who used Shake Off on you), then it ends. **Tier 3:** it ends. Healing doesn't end a Lingering; the end of the encounter does. If you would gain Lingering again, keep the one with the higher average (see [[Stacking]]).

### Pressed

Pressed always has a value, such as **Pressed 1**. Your [Strike] Actions take that many **Pressure Banes** (see [[Named Boons and Banes]]: at most 2 count). If you would be Pressed twice, only the highest value applies.

### Prone

- Melee Actions against you gain 1 Field Boon, and Ranged Actions against you suffer 1 Field Bane.
- You can't [[Evade]].
- The only [Move] Actions you can use are [[Crawl|Crawl]], [[Stand|Stand]] and [[Break Free]].

### Quickened

Quickened always has a value, such as **Quickened 2**. You increase your maximum AP, and the AP you regain at the start of your turn, by the value: if you are Quickened 2, you regain 6 AP when your turn begins. You don't gain AP when you become Quickened, only when you regain AP at the start of your next turn. Quickened never changes your Reaction Point, and the extra AP you don't spend become Guard like any other ([[Unspent AP]]).

### Sickened

Sickened always has a value, such as **Sickened 1**. Your Body and Instinct Saves take that many Banes, and you can't eat, drink or swallow anything: no potions.

### Slowed

Slowed always has a value, such as **Slowed 2**. You decrease the AP you regain at the start of your turn by the value: if you are Slowed 2, you regain only 2 AP when your turn begins. You also reduce your maximum AP by the value. You don't lose AP when you become Slowed, only when you regain AP at the start of your next turn. Slowed never changes your Reaction Point: a Slowed creature still has its Reaction.

**Slowed and Quickened** cancel each other out, but they don't reduce each other's value: if you are Quickened 2 and Slowed 2, you regain the normal 4 AP. If one of them ends before your turn comes around (you lose Slowed 2 but are still Quickened 2), you regain 6 AP.

### Staggered

You can't use [[Reactions]]. Your Reaction Point isn't lost: you can use it again when Staggered ends.

### Taunted

Taunted is always **by** a creature. Your Actions against any creature other than it take **1 Bane**.

### Vulnerable

Vulnerable always has a value, such as **Vulnerable 3**. Actions against you gain a number of Boons equal to that value. If you would have Vulnerable twice, only the highest value applies.
