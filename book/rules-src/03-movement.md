<!-- part: Part I: Core Rules -->
# Chapter 3: Movement and the Environment


## Playing on the Grid

Fights are played on a map divided into **squares**, on a table or in a virtual tabletop. Every creature is a **token** that stands on one or more squares, and every distance in these rules is counted in squares.

You move around the grid using Actions. Some allow you to move up to your Speed (like Advance); others have special rules, like the Evade Action, which lets you move without triggering Reactions.

When calculating distances and movement, each square counts as 1, but every second diagonal counts as 2 squares (1, 2, 1, 2...). Areas and ranges are measured the same way. Exception: Forced Movement and Reposition count each diagonal square as 1 (see [[Forced Movement]] and [[Reposition]]). If you are calculating your movement on your turn, the count continues through your whole turn, across every Action that moves you. If you move when it isn't your turn, you calculate it from the start: you don't keep track of the movement from your previous turn.

- **Counting squares:** count the squares from one creature to the other, not the one they stand on. A creature next to you, even diagonally, is 1 square away.
- **Elevation:** count the squares up or down as you count the squares on the map, then add them together like a diagonal: the larger count, plus half the smaller one (rounded down). A creature 4 squares away and 4 squares up is 6 squares away. How tall a creature is: see [[Size]].

## Size

Every creature has a **Size**: a rank from 1 to 7, its **SR** (Size Rank), written with its name first, such as Medium (3). Size says how many squares a creature occupies, and it is used to compare creatures.

| Size | Rank | Occupies | Squares |
|---|---|---|---|
| Tiny | 1 | 1 × 1 | 1 |
| Small | 2 | 1 × 1 | 1 |
| Medium | 3 | 1 × 1 | 1 |
| Large | 4 | 2 × 2 | 4 |
| Huge | 5 | 3 × 3 | 9 |
| Gargantuan | 6 | 4 × 4 | 16 |
| Titanic | 7 | 5 × 5 | 25 |

The side of the area a creature occupies is its rank minus 2, and at least 1. An Action can compare SR: "The target's SR is at most 1 higher than yours" means the target's rank is no more than one above yours. Any smaller creature qualifies.

A creature is as tall as it is wide: one that occupies more than one square also occupies more squares height-wise, so imagine it as a cube. A Large creature (2 × 2) is 2 squares tall, and a Gargantuan one (4 × 4) is 4 squares tall. This might feel odd for some creatures, such as a horse, but the simplification is necessary for the game to work.

Size doesn't change Reach by itself: a Large creature still has Reach 1. Anything that makes a creature bigger says whether its Reach changes too.

### Squeezing

Creatures can normally squeeze to reach places smaller than themselves, but not to the point that wouldn't make sense. A creature can squeeze through a space one rank below theirs (a Large creature, 2 × 2, can squeeze through a gap 1 square wide), and each square they move this way counts as Difficult Terrain. If a creature stops moving while squeezing to do another Action, meaning they don't fit completely in the space they are in, all their Rolls are Doomed and they are Vulnerable equal to half their level (rounded up) until they move to a space where they fit completely. Some creatures have features that change this, like a Gargantuan (4 × 4) snake with "The snake can squeeze through 1 square", but this doesn't mean the creature can safely end its turn while squeezing: unless otherwise noted, the Doomed penalty and the Vulnerable condition above still apply.

Forced Movement and Reposition never squeeze a creature: they stop in the last square where it fits completely (see [[Collision]]).

@@DIAGRAM:squeeze@@

## Movement

An Action that lets you move gives a distance, written "Advance 5" or "Evade 2". You can always move less than the specified amount: "Advance 5" means up to 5 squares, not exactly 5. But each time you move with an Action, you can't move more than your current Speed, unless an ability says otherwise: with Speed 2, an Action that lets you Evade 3 lets you Evade only 2. Forced Movement and Reposition don't use your Speed.

### Advance

Advance is the normal movement, and the Action every creature uses to move. **You only move with an Action that moves you**: Advance, Evade, or another Action that says so (someone else moving you, with Forced Movement or Reposition, is not you moving). An Advance can trigger reactions.

You can split an Advance: move part of it, use other Actions, then move the rest later in the same turn. Movement you don't use is lost at the end of your turn. You can only split the movement of the Advance Action itself. If another Action moves you as part of a sequence (such as Charge), you can't split that movement. For instance, when you Charge, you can't Advance 3, make your Weapon Attack (1A) and then Advance the rest of your movement.

When you split an Advance, it is still one Action. A Reaction that triggers on your movement can fire only once for that Advance, no matter how many segments you move in.

### Evade

Evade is a type of movement that doesn't trigger reactions. You can't Evade into or pass through Difficult Terrain. What an Evade costs is decided by the Action that lets you Evade, such as the [[Chapter 6: Basic Actions|Evade Action]]. The Evade Action doesn't have the Move trait.

You can't split an Evade the way you can split the Advance Action. If an Action lets you Evade 3 and you Evade 1 square, you can't Evade the other 2 squares later for free.

When an Action allows you to Evade, you can use the movement as an Advance instead. By itself this brings no benefit, but it lets a creature move willingly through reactions, or move at all if they are unable to Evade.

### Moving and Leaving Your Square

Rules ask three different questions about movement, and the answers are not the same:

| Movement | A Move Action | You moved | You left your square |
|---|---|---|---|
| Advance, Charge, Crawl | Yes | Yes | Yes |
| Evade | No | Yes | Yes |
| Stand | Yes | No | No |
| Forced Movement (Pushed, Pulled and Slid) | No | No | Yes |
| Reposition | No | No | Yes |

- **Move** with a capital letter always means a **Move Action**: an Action with the [[Chapter 7: Traits|Move]] trait. "Until you use a Move Action" ends only with a Move Action.
- **"You haven't moved"** is about your own movement: moving with an Action, Evade included. Forced Movement and Reposition are not you moving, and standing up is not moving.
- **"You haven't left your square"** is about any change of position, Forced Movement and Reposition included. A creature that occupies several squares leaves its square when any square it occupies changes.

### Corners

You can't cut solid corners when you move. Moving diagonally takes you through the corner point where four squares meet. If a wall or anything solid occupies that point, the corner is solid and you can't move diagonally past it: you must go around. A wall that ends exactly at the corner counts, and so does a pillar that stands on the corner or an object that fills a square beside your path, because each of them reaches the point. A small object in the middle of a square doesn't reach the corner, so it doesn't block the diagonal. This applies to every movement of yours (Advance, Evade, Charge) and to Forced Movement and Reposition. A creature that occupies several squares follows the rule with each square it occupies.

Creatures aren't solid corners: you can move diagonally between two creatures. If both are unwilling, this is Difficult Terrain, as if you were passing through the squares of an unwilling creature; a willing creature lets you pass. If a Forced Movement would move a creature diagonally between two creatures, it doesn't pass through them: it stops in the last legal square and [[Collision]] applies as normal. A Reposition can't pass between two creatures either: it stops in the last legal square, without Collision damage.

@@DIAGRAM:corners@@

## Straight Line

When an Action, effect or rule moves a creature (yourself included) in a straight line, like the Charge Action, draw a line from the center of the creature's square to the center of the destination square. The creature moves along the same squares as a [[Line]]: one square per step along the line's longer direction, at each step the square whose center is nearest to the line, ending in the destination. Where the line passes exactly between two squares, choose a side once, left or right (looking toward the destination), for the whole movement: every tie takes that side. The creature that moves chooses for its own movement; the origin chooses for a Forced Movement. If a square on the line isn't a legal move (for Charge: Difficult Terrain, a creature in the way, or a solid corner), the movement stops in the last legal square before it.

In the figures, Y is you. Blue squares are the squares the token passes, the green square is where it ends, and red squares are not legal. The line is what counts: the path of the token on the grid does not have to be exactly straight, because a token moves from square to square.

@@DIAGRAM:straight@@

## Forced Movement

Forced Movement is movement you impose on another creature, choosing where it goes. There are three types: Pushed, Pulled and Slid. [[Reposition]] also moves a creature of your choice, but it isn't Forced Movement. Every Forced Movement follows these rules:

- It doesn't trigger reactions.
- It ignores Difficult Terrain.
- It can move a creature into [[Hazardous Terrain]] or a Deadly Hazard.
- It doesn't use the creature's Speed, and each square counts as 1, even when it is diagonal.
- Its value is reduced by the creature's [[Steadiness]].
- The **origin** of Forced Movement is the creature using the Action, unless the effect names another creature or a point as its origin ("Pushed 1, away from the target", "Pushed 2 from the Burst's center"): the direction is then taken from there, and the creature using the Action still chooses the destinations.
- Its value is a maximum: you can always move the creature less, down to 0. Moving a creature 0 squares is no movement and no Forced Movement on it: nothing that happens when a creature is moved, enters or leaves a square happens. It can never make a creature end its movement inside another creature or an object: this is [[Collision]], and it only happens when the destination you chose is blocked.

### Pushed

Being **Pushed** is a Forced Movement. Pushed has a value: up to that many squares you are moved. The [[Rules Language|origin]] chooses the destination. Each square you are pushed into must be farther from the origin than the previous one (measured in a straight line between the centers of the squares), and the path must stay within a cone spreading from the origin through you.

That cone is every step going in a direction within 45° of the straight line from the origin to you. Each square counts as 1 toward the value, even when it is diagonal. The 45° edge counts for Pushed. It doesn't for Pulled, whose cone is narrower.

If something blocks the way to the destination the origin chose, Collision applies.

> [!example]
> A goblin stands directly below you and you use Pushed 3 on them. They can end in any square in the cone shown below: 1 square to the side after 1 step, 2 after 2 steps, and 3 after 3 steps. They can't be moved sideways or back toward you. If the goblin were diagonal from you, the cone would point diagonally.

@@PUSH_DIAGRAM@@

### Pulled

Being **Pulled** is a Forced Movement, the opposite of Pushed. Pulled has a value: up to that many squares you are moved. The origin chooses the destination. Each square you are pulled into must be closer to the origin than the previous one (measured in a straight line between the centers of the squares), and the path must stay inside a cone that has its apex on you and points toward the origin.

That cone is every direction less than 45° from the straight line from you to the origin: the 45° edge is not part of it. Each square counts as 1 toward the value, even when it is diagonal. A creature that is next to the origin can't be pulled any closer, so it stops there.

You can't be pulled into the origin's square. The origin can end the movement next to it, or choose its own square as the destination: then Collision applies, with the origin as the creature in the way, and both take damage for the unused squares.

> [!example]
> A goblin stands directly above you, 3 squares away, and you use Pulled 3 on them. They can end in any square in the cone shown below: straight toward you after 1 step, or any of the 3 squares next to you after 2 steps. Then they stop. You can leave them there, with no damage, or choose your own square as the destination: the 3rd square is then unused, Collision applies and you and the goblin take 1 damage each.

@@DIAGRAM:pull@@

### Slid

Being **Slid** is a Forced Movement. Slid has a value: up to that many squares of path you are moved. The origin chooses the destination and the exact path the creature takes: a Slid can curve, moving the creature closer to the origin, farther from it, or sideways.

Each square of the path must be next to the previous one, and each counts as 1 toward the value, even when it is diagonal. The path can't cross a wall or pass through an object, and it can't pass through another creature's square or the origin's: if the path the origin chose does, Collision applies at that point. The origin must have [[Line of Effect]] to the creature at every square of the path; if it would lose it, the movement ends there (that is not a Collision, so there is no damage).

> [!example]
> A goblin stands 2 squares east of you, with a brazier (Hazardous Terrain) in the square between you. You use Slid 3: the goblin goes 1 square northwest, then 1 west, ending in the square directly north of you. It used 2 of its 3 squares, passed beside the brazier without entering it, and you had Line of Effect to it all along. The path curved: the value counted squares of path, not straight-line distance.

@@DIAGRAM:slid@@

### Collision

Collision happens when something is in the way of the destination the origin chose. For Pushed and Pulled, calculate it from the center of the creature: draw a line from where the creature started to where the Forced Movement was meant to end. For Slid, follow the path the origin chose. If something is in the way, the creature stops in the **last legal square** the line or the path passes through: a square where the whole creature fits and that has no object or creature in it.

A creature that stops short takes Lethal Blunt Vigor damage for its **unused squares**: the squares between where it stopped and the destination the origin chose.

- **An object** (a wall, a closed door, etc.): **2 damage** for each unused square.
- **Another creature, or the origin:** **1 damage** for each unused square, to each of the two creatures.

The origin decides how far to aim. If it chooses a destination the creature can reach, there is no Collision and no damage: moving a creature less than the value never hurts it.

> [!example]
> Pushed 4 aimed at a destination 4 squares away, with a wall right behind you, deals 8 damage. Aimed through a creature after 1 square, it deals 3 damage to each. Pushed 1 square, with nothing in the way, deals no damage.

A Reposition stops at an object or a creature without taking Collision damage.

## Reposition

Reposition moves a creature of your choice along a path, but it isn't Forced Movement. Reposition has a value: up to that many squares of path. Your Reach and the creature's Size don't limit it. The path follows the rules of [[Slid]] (each square next to the previous one, each counting as 1 even when it is diagonal, and the origin must have Line of Effect to the creature at every square), with these rules:

- It doesn't trigger reactions.
- It ignores Difficult Terrain.
- Its value is reduced by the creature's [[Steadiness]].
- It can't move a creature into Hazardous Terrain or a Deadly Hazard, though it can move the creature to a less advantageous position, for example into a flanked square.
- It can't pass through creatures or objects: it stops in the last legal square before one, without Collision damage. It can never make a creature end its movement inside another creature or an object.

> [!example]
> Dave stands between you and a goblin, in a line, with an empty square between you and Dave. Reposition 2 can't move the goblin through Dave's square, but the path can go around him: 1 square diagonally over Dave, then 1 square diagonally down, into the empty square next to you.

@@DIAGRAM:reposition@@

The four movements side by side:

| | Pushed | Pulled | Slid | Reposition |
|---|---|---|---|---|
| Forced Movement | Yes | Yes | Yes | No |
| Direction | Away (cone) | Toward (cone) | Any path | Any path |
| The origin needs Line of Effect | No | No | Yes | Yes |
| Into Hazardous Terrain or a Deadly Hazard | Yes | Yes | Yes | No |
| Creatures in the way | Collision | Collision | Collision | Stops, no damage |
| Objects in the way | Collision damage | Collision damage | Collision damage | Stops, no damage |
| Each diagonal square counts | 1 | 1 | 1 | 1 |

## Steadiness

Some creatures are harder to move than others. Every creature has a **Steadiness**: normally 0, and never negative. When you are moved by Forced Movement or Reposition, reduce its value by your Steadiness: a Pushed 3 against Steadiness 1 is a Pushed 2, and a value of 0 or less moves you nowhere. The value is reduced before the origin chooses the destination, so a creature with Steadiness also takes less damage from Collision (the origin can aim less far). You can choose not to apply your Steadiness, for example when an ally helps you.

## Difficult Terrain

Each square of difficult terrain counts double the squares it would normally count. The GM decides where it is (rubble, deep snow...). Darkness is Difficult Terrain for creatures that can't see in it. Passing through the squares of an unwilling creature is Difficult Terrain too.

@@DIAGRAM:difficult@@

## Hazardous Terrain

**Hazardous Terrain** is any terrain that deals damage or inflicts a harmful condition on the creatures in it. The effect that creates it is marked **[HT]** in its text and declares one or more trigger patterns.

**[HT]** is notation, like [W] and [Mod]: it is written in the text of the effect that creates the area, not among the Action's traits (a Weapon Attack whose Tier 2 leaves caltrops is not a hazard itself). It declares its pattern(s) after a colon, such as **[HT: Entering]** or **[HT: Entering, Turn]**: "The area lasts 2 rounds [HT: Entering, Turn]." The three patterns are:

- **Entering:** "When a creature enters this area." A creature in the area when it appears is treated as entering it.
- **Turn:** "When a creature ends its turn in this area."
- **Movement:** "When a creature moves within this area." Triggers once per Movement (Advance, Evade, or Forced Movement) that crosses any square of the area.

An [HT] effect with no declared pattern uses Entering and Turn by default.

**Turn-cycle limit.** Entering and Turn both count against the same per-creature turn-cycle limit. A creature that enters and ends its turn in the same area is affected at most once per turn-cycle. The Movement pattern is exempt: it can hit the same creature multiple times per round, once per Movement.

**Size.** An [HT] area affects a creature once regardless of its Size.

> [!example]
> A 2 Emanation of fire (Distance 10 sq.) has [HT: Entering, Turn]. A creature that walks into it takes 1d8 Body Fire damage on entering; a creature already inside takes the same damage when it ends its turn there. A creature that enters, leaves and re-enters with a different Movement in the same turn-cycle is affected at most once.

### Deadly Hazards

Some hazards kill at once: a fall into a chasm, a pit of lava, a crushing trap. These are **Deadly Hazards**. A Forced Movement into one kills [[Minor enemies]], and a Reposition can't move a creature into a Deadly Hazard at all (see [[Reposition]]). Any other creature, Player Characters included, isn't killed: they barely avoid it and are **[[Imperiled]]**, for example hanging from the edge of the chasm.

A creature that enters a Deadly Hazard voluntarily (by its own movement, or by choosing not to escape) also chooses: it is either Imperiled or outright killed.

## Reach

**Reach** is how far your body reaches: how far you can interact with things in the world. By default, every Species has a Reach of 1: you can reach 1 square from your position.

When an Action shows "Reach" as its distance (touching an ally, grabbing an object, tripping a creature), it means your Reach. Weapons don't change your Reach: they have a [[Weapon Range|Range]] of their own (see Weapon Range, where a Reach above 1 adds to the Range of your melee weapons).

You can't target a creature or an object beyond the distance of an Action (its Reach or its range).

@@DIAGRAM:reach@@

### Weapon Range

Every weapon has a **Range**, melee weapons included. An Action whose distance is **Weapon** uses the Range of the weapon you use for it. Weapon Actions have that distance unless they say otherwise.

- **How it is written.** A Range is written like the ranges of ranged weapons: normal / far (1 Bane) / maximum (2 Banes). A single number is a normal range with no far or maximum range. Most melee weapons have Range 1; a lance has Range 1 / 2.
- **Reach above 1.** Your Reach above 1 adds to every number of the Range of your melee weapons: with Reach 2, a lance attacks at 2 / 3. It doesn't change the Range of a ranged or thrown attack.
- **Long.** A weapon with the [[Long]] property takes 1 Field Bane against adjacent creatures. A pike with Range 3 and Long is at its best 2 or 3 squares away.

### Weapon Actions and Your Weapon

A Weapon Action takes its distance and its Melee or Ranged nature from the weapon you use for it, and from how you use it. With a Ranged weapon, or a weapon with the Thrown property when thrown, it uses the weapon's ranged Range and counts as a Ranged Action (Prone's Bane applies to it). With a Melee weapon used in hand, it uses the weapon's melee Range and counts as a Melee Action (Prone's Boon applies). An Action that has the Melee or Ranged trait itself needs a weapon used that way. While you have a free hand, you can use your [[Fists]] as your weapon.

## Engaged

You are **Engaged** if you are adjacent to an enemy (next to you, even diagonally) and both of you can be Engaged. Being Engaged does not depend on what you perceive: an enemy next to you that you cannot see still Engages you.

A condition can say that you can't be Engaged, as [[Unconscious]] does. A creature that can't be Engaged is never Engaged, and the creatures next to it are not Engaged with it.

By itself, being Engaged does nothing. Other rules use the word, such as [[Ranged Combat While Engaged]] below.

@@DIAGRAM:engaged@@

### Ranged Combat While Engaged

Using a [Ranged] Action while you are [[Engaged]] is very hard: the roll is **[[Favored and Doomed Rolls|Doomed]]**.

When you use a [Ranged] Action against a creature that is Engaged with a creature other than yourself, you suffer **1 Field Bane**.

## Flanking

A creature **threatens** every enemy within the **normal range** of a Melee weapon, for as long as it qualifies to use that weapon's Weapon Attack (1A). The 3-Strike limit doesn't remove the threat: it prevents using the Action, not qualifying for it. Some conditions, such as Unconscious, cause a creature to threaten no one, and a weapon with the [[Non-threatening]] property doesn't threaten, unless a feature says otherwise. The far range of a Melee weapon doesn't count, and a Melee weapon with the Long property doesn't threaten adjacent enemies.

Like [[Engaged]], threatening does not depend on what you perceive, but it uses range and not adjacency: a creature with a Range 2 weapon threatens an enemy 2 squares away, which is not Engaged with it.

Creatures that threaten the same enemy **flank** it. A creature that flanks an enemy gains **1 Field Boon** on its [Melee] Actions against that enemy for **each other creature** that flanks it. But each **ally of that enemy that threatens the flanker** cancels 1 of those Boons, and a creature never gains fewer than 0.

Blue tokens are allies and red-brown tokens are enemies. A badge is the Boons that creature gets on [Melee] Actions against the creature in the middle (G, John in the fifth picture) or against D in the last one.

**Example 1: Two flankers.** Philip and John both threaten a goblin: each has 1 Boon on [Melee] Actions against it.

**Example 2: Three flankers.** A third ally threatens it too: 2 Field Boons each, which is the limit.

**Example 3: Four or more.** A fourth ally adds no Boon, but it still counts for cancelling: if an ally of the goblin threatens one of the flankers, that flanker keeps 2 (3 minus 1, then the limit).

@@DIAGRAM:flanking1@@

**Example 4: Range 2.** Philip holds a weapon with Range 2 and stands 2 squares from the goblin. He threatens it, so he flanks with John, who is next to it: 1 Boon each.

**Example 5: Three goblins on John.** Three goblins threaten John, and Philip stands next to two of them. The goblin on the left has the other two goblins flanking with it and no ally of John's next to it: 2 Boons. The other two also have 2 goblins flanking with them, but Philip threatens each of them and cancels 1: 1 Boon each.

@@DIAGRAM:flanking2@@

**Example 6: Two lines of fighters.** Two lines of fighters face each other, all of them against D, the second fighter on the left. Each fighter has allies beside it that threaten the enemies in front of them, so almost every Boon is cancelled: D's neighbors cancel the Boons, and only a fighter at the very end of a line can still gain 1, against the second fighter of the other line.

@@DIAGRAM:flanking3@@

## Line of Effect

To target a creature with an Action, you need **Line of Effect** to them: a straight line from the center of your square to **any corner of the target's space** that nothing blocks. Walls and similar solid obstacles block a line. If all four corners are blocked, you have no Line of Effect and can't target the creature, even if you perceive it.

An area effect checks Line of Effect from its **[[Areas|Point of Origin]]** to each creature in the area (from the center of the space, when the Point of Origin is a creature's space).

A Large creature (2x2 squares or bigger) uses the four corners of its whole space. A Large creature that is the one targeting picks any square it occupies as its starting square.

A line that only touches the end of a wall isn't blocked.

> [!tbd]
> Targeting walls and objects (and the Breach trait, to hit a creature behind a wall you break) is not written yet.

## Cover

**Cover** is how well a target is protected from you. Count the corners of the target's space that are blocked from the center of your square:

| Blocked corners | Cover | Effect on your Actions against it |
|---|---|---|
| 0 | None | None |
| 1 | Low | 1 Field Bane |
| 2 | Medium | 2 Field Banes |
| 3 | High | **Doomed** (and no Field Banes from the Cover) |
| 4 | Total | No Line of Effect: you can't target them |

- **Creatures in the way.** If another creature is on the line from the center of your square to the center of the target's space, the target has **Low cover** (1 Field Bane). Creatures never count as blocked corners, and cover doesn't add up: you take the highest cover that applies.
- **Cover and the rest.** Cover applies to melee and ranged Actions alike. Its Field Banes count with your other Field Banes. High cover gives no Field Banes, only Doomed; your other Field Banes still apply (Prone, Obscured). A target that is Hidden and behind High cover is still only Doomed once.

@@DIAGRAM:cover@@

### Leaning

A creature behind a wall can lean out to attack. While you are **Leaning**, you calculate cover from one of **your corners** instead of the center of your square, and your own cover against other creatures' Actions is reduced by 1 level (Total → High → Medium → Low → none). A creature leaning out of Total cover becomes High cover (still targetable). Leaning lasts until the end of your turn, so Reactions can use it. You can stop Leaning at any time on your turn, at no cost. See the Leaning Basic Action.

## Areas

Some Actions have an **Area**, written on its own line, for example **Area: 1 Emanation**. These Actions have the [[Area]] trait. An Area Action can also have a **Distance**, on the next line: how far from the creature using the Action its area can be placed, for example **Distance: 10 sq.** With no Distance, an Emanation is around the creature that uses the Action.

Every area spreads from a **Point of Origin**: for an Emanation, its target (a creature's space or a square); for a Line, your square; for other areas, the point the Action says they start from (for example, the tip of a cone). The Point of Origin is a place, not the creature that uses the Action, which is still called the origin.

### Emanation

An Emanation, written with a value like **1 Emanation**, extends a number of squares around its **target**: a creature or a square. It affects every creature in its area unless the Action says otherwise. If its target is a creature, the origin decides whether that creature is affected too. For example, the Paladin decides whether the target of a 3 AP Smite also makes the Appeal Save, and a creature using Whirlwind (an Emanation around itself) decides whether it is affected.

An Emanation around a creature extends that many squares from every square the creature occupies, so it follows the creature's Size. A 1 Emanation around a Medium (3) creature covers 3 × 3 squares (its square and the 8 around it); around a Huge (5) creature, which occupies 3 × 3, it covers 5 × 5. A **Distance** of 10 sq. means the Emanation is placed up to 10 squares from the creature using the Action; with no Distance, it is around that creature.

@@DIAGRAM:emanation@@

### Aura

An Aura is an area that **follows its origin**. It extends a number of squares from every square the origin occupies (the same footprint as an Emanation around that creature) and moves with them. It is written with a value, like **Aura 2**, and its Point of Origin is always the creature it belongs to. The origin decides whether they are affected themselves. A creature gains an Aura's effect as soon as it enters the Aura, and loses it when it leaves. An Emanation, by contrast, is placed at a target and stays there.

### Burst

A **Burst**, written with a value like **2 Burst**, is centered on a **corner**, the point where four squares meet, never on the center of a square or on a creature. It affects every square whose center is within that many squares of the corner, measured in a straight line: a 1 Burst covers the 4 squares around the corner, and a 2 Burst covers 12 (a 4 × 4 block without its corners). Otherwise it works like an Emanation: it affects every creature in its area unless the Action says otherwise, and its Point of Origin is the corner, placed within the Action's Distance.

@@DIAGRAM:burst@@

### Line

A **Line**, written with a value like **Line 10**, is a row of squares that always starts from you: its Point of Origin is the center of your square, as for an Aura. It has no Distance: its value is how far it reaches.

**Aim** it at any square. Draw a segment from the center of your square through the center of that square, and take one square per step along the segment's longer direction: at each step, the square whose center is nearest to the segment. The first square is the one next to you. The Line goes on past the square you aimed at until the next square would be farther from you than its value (counted like any distance: every second diagonal counts 2). Only those squares are the Line, never every square the segment touches. A Line 10 is 10 squares straight, 8 squares at a slope like 2 to 1 or 5 to 2, and 7 squares on a diagonal.

- **Ties.** Where the segment passes exactly between two squares, choose a side before rolling: left or right, seen from above looking from you toward the square you aimed at. Every tie in that Line takes that side. A Line with no ties has nothing to choose. Both sides give the same number of squares, though not always the same shape.
- **Larger creatures.** A creature bigger than Medium starts the Line from one of the squares of its space on the side it aims toward.
- **Walls.** A Line stops at the first square it can't enter (a wall or a solid obstacle): the squares behind it are not part of the Line. This matters for a Line that stays on the map, or Hazardous Terrain.
- **Height.** A Line is 1 square high unless the Action says otherwise: it doesn't reach a creature flying above its squares.
- **Targets and cover.** A Line affects every creature in its squares unless the Action says otherwise, and the Action is [[Several Targets|rolled once for all of them]]. [[Line of Effect]] and [[Cover]] are checked from your square, as for any area, but creatures in the Line don't give cover to other creatures in it (walls still do).
- **No range Banes.** The Line's value is its reach, so a weapon's far or maximum range adds no Banes inside it. Other Banes still apply: Engaged for a [Ranged] Action, Cover from walls.

> [!example]
> You use a Line 6 and aim at the square 2 squares east and 1 south of you. The segment passes exactly between two squares at the first, third and fifth steps. You choose left: the Line takes the square directly east of you, then goes 1 south for every 2 squares east, 5 squares in all (the 6th would be 7 squares away). Had you chosen right, it would start with the square diagonally southeast of you: a different shape, the same 5 squares.

@@DIAGRAM:line1@@

@@DIAGRAM:line2@@

@@DIAGRAM:line3@@

### Other areas

Other areas (cones) also affect every creature in them unless the Action says otherwise. [[Line of Effect]] and [[Cover]] are checked from the Point of Origin to each creature, and the Action is [[Several Targets|rolled once for all its targets]].

> [!tbd]
> Cones are not written yet (and Lines wider than 1 square).

## Light

Light affects **Sight** (see [[Senses]]): the light **where a creature is** decides how well you see it.

A light source sheds **Bright light** in an Emanation of its size, and **Dim light** for the same number of squares beyond that. A torch with Bright light 4 gives Bright light in a 4 Emanation and Dim light from 5 to 8 squares away (an 8 Emanation). Smite's Bright light 2 gives Bright light in a 2 Emanation and Dim light from 3 to 4. Beyond that, the light of the scene applies (daylight, night, a dark cave...).

A light has the same shape as an area: around a creature or an object it is an [[Areas|Emanation]], counted from every square it occupies, and a light placed on a corner is a [[Areas|Burst]]. So a Bright light 2 reaches the same squares as a 2 Emanation, and its Dim light works the same way with its own size.

@@DIAGRAM:light@@

Light never makes a square darker: where several lights reach, use the brightest one. A torch carried in daylight changes nothing. A creature is in one light level at a time, so its penalties never stack. A creature bigger than one square is in the brightest light of any square it occupies: you see the part of it that is lit.

### Bright

You see creatures in Bright light Clearly, and you move normally. Bright light is daylight outside, or the Bright light of a light source.

### Dim

When you target something that is in Dim light, the target is Obscured (see [[Senses]]). Dim light is twilight, a full moon, or the Dim light of a light source, such as the edge of a bonfire's light.

### Darkness

When you target something that is in Darkness, you can't see it: it is Hidden if you perceive it some other way, and Unsensed if you don't (see [[Senses]]). Squares in darkness are Difficult Terrain for you.

## Senses

You perceive creatures through your **senses**. Each sense lets you perceive some creatures as **Clear**, **Obscured** or **Hidden**. Use your best sense for each creature; a sense never makes a creature harder to perceive. A creature you perceive with none of your senses is **Unsensed**.

| Perception | Your Actions against it | Its Actions against you |
|---|---|---|
| **Clear** | Normal. | Normal. |
| **Obscured** | 1 Field Bane. | 1 Field Boon. |
| **Hidden** | **Doomed**. | **[[Favored and Doomed Rolls\|Favored]]**. |
| **Unsensed** | You can't target it. | **[[Favored and Doomed Rolls\|Favored]]**. |

Actions with the [[Area]] trait ignore Senses: they target the creatures in their area however well you perceive them.

A roll that is both Favored and Doomed is a normal roll (see [[Favored and Doomed Rolls]]). But **you gain no Favored or Boon from a creature's poor perception of you if you perceive that creature as Hidden**: two creatures that are each Hidden to the other are both Doomed against each other, and neither is Favored.

Every creature has **Sight** and **Hearing**:

- **Sight:** You perceive creatures in Bright light as Clear and creatures in Dim light as Obscured. You can't see creatures in Darkness, or creatures you have no [[Line of Effect]] to.
- **Hearing:** You perceive creatures that make noise within **10 squares** as Hidden, even through walls. Creatures in combat make noise, even standing in the same square on their turn. A creature can **Hide** to stop making noise.

So in Darkness you usually still hear a creature, and it is Hidden to you; an invisible creature that you only hear is Hidden too.

> [!tbd]
> Hiding and sneaking are not written yet.

### Sight Senses

Sight Senses change how light works for your Sight. They also remove the Difficult Terrain of Darkness.

- **Dim-light Sight:** For your Sight, Dim light counts as Bright.
- **Dark Sight:** For your Sight, Dim light and Darkness count as Bright.

### Other Senses

Other senses work in any light, but only within their range and conditions, and only to perceive creatures: they don't help your Rolls that require sight. Some examples:

- **Lesser Heatsight (6 sq.):** You perceive creatures within 6 squares as Obscured, if they give off heat or are much colder than their surroundings.
- **Heatsight (6 sq.):** As Lesser Heatsight, but you perceive them as Clear.
- **Tremorsense (6 sq.):** You perceive creatures within 6 squares as Clear, if they touch the same ground as you and no thick wall is between you.

> [!example]
> A Goblin with Dark Sight stands in Darkness, and Krysta, who has only Sight and Hearing, stands in Bright torchlight. Krysta can only hear the Goblin, so it is Hidden to her: her Actions against it are Doomed, and its Actions against her are Favored. The Goblin sees Krysta Clearly.
>
> A Snake with Lesser Heatsight attacks Krysta in the same Darkness. Krysta is warm, so the Snake perceives her as Obscured (1 Bane on its Actions), while she only hears the Snake (Hidden: Doomed against it, and the Snake is Favored against her). In Dim light, the Snake's heatsight would give it nothing more than its Sight.
>
> A Cave Worm with Tremorsense loses Krysta when she climbs a rope. If she is also quiet (she Hides) and it is dark, she is Unsensed: the Worm can't target her.
>
> Krysta and a Goblin, neither with Dark Sight, fight in Darkness. Each only hears the other, so each is Hidden to the other: both are Doomed against each other, and neither is Favored.

The GM decides how each creature perceives each other when it isn't obvious.
