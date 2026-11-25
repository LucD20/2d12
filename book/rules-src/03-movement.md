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

**A movement you must make** ("You must Advance 2") moves you the whole distance, and each square you enter must be one you haven't entered during that movement. A card that says **freely** ("You must Advance 5 freely") lets you enter a square again. If you can't make the whole movement, the Action is disrupted (see [[Linked Actions]]).

**No movement ends in another creature's square:** an Advance, an Evade, a Forced Movement or a Reposition.

**Creatures in your way.** Your own movement (an Advance, an Evade, a Charge, a Crawl) **can't enter or pass through an unwilling creature's space**: an enemy holds its ground. **An ally's space** (any willing creature's) is [[Difficult Terrain]]: you can pass through it, never end in it, and it is the one Difficult Terrain an Evade can cross (at its double cost). **A Down creature** (Dying, Shattered, Unconscious or Desperate) **and a dead one** are Difficult Terrain too, whichever side they are on. Size doesn't change this. The [[Tumble]] Action is the way past an enemy, and an Action can say otherwise (Footwork's Weave). Forced Movement and Reposition keep their own rules (see [[Collision]]).

**Changes to your Speed.** Apply every other change first, then halve it: with Speed 6, a −2 to your Speed and Hindered, your Speed is (6 − 2) halved = 2. Halving rounds down.

### Advance

Advance is the normal movement, and the Action every creature uses to move. **You only move with an Action that moves you**: Advance, Evade, or another Action that says so (someone else moving you, with Forced Movement or Reposition, is not you moving). An Advance can trigger reactions.

**An Advance is one piece.** You move once, up to the distance, and stop: the movement you don't use is lost. You can't move part of an Advance, use another Action, then move the rest later. For instance, with Speed 5 you can't Advance 2, make a Basic Attack and then Advance the other 3: that is two Advance Actions.

**Interact during an Advance.** During the Advance Action, at any one point of the movement, you can use the [[Interact|Interact Action]] (draw a weapon, open a door on the way, help an ally stand up), paying its 1 AP then, and go on with the same Advance. Once an Advance, and only in the Advance Action used on its own: not in an Advance that is part of another Action (a Linked Action such as "Advance 5, make a Basic Attack (1A) and Advance 5 again", a Setup such as "Setup: Advance 3", or a Charge), unless its card says so, and not during an Evade.

A Reaction that triggers on your movement can fire only once for an Advance, at the square the reacting creature chooses (see [[Reactions]]).

### Evade

Evade is a type of movement that doesn't trigger reactions. You can't Evade into or pass through Difficult Terrain, except an ally's space, which an Evade can cross at its double cost (it can't end there). What an Evade costs is decided by the Action that lets you Evade, such as the [[Evade|Evade Action]]. The Evade Action doesn't have the Move trait.

An Evade is one piece too, and nothing fits inside it: if an Action lets you Evade 3 and you Evade 1 square, the other 2 squares are lost.

When an Action allows you to Evade, you can use the movement as an Advance instead. By itself this brings no benefit, but it lets a creature move willingly through reactions, or through Difficult Terrain, where an Evade can't go. A creature that can't use Move Actions (Immobilized) or is Prone can't use the movement as an Advance either.

### Flying

> [!tbd]
> Flying isn't written yet: going up and down, ending a turn in the air, falling when knocked Prone or Immobilized. Until it is, a creature that flies hovers just above the ground: it moves as on the ground, and the GM rules where flying matters.

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

Creatures aren't solid corners, but **two unwilling creatures corner to corner block the diagonal between them**, as their spaces would (Tumble passes it: [[Tumble]]). Between an ally and an enemy, or between two allies, the diagonal is free: you don't enter either space. If a Forced Movement would move a creature diagonally between two creatures, it doesn't pass through them: it stops in the last legal square and [[Collision]] applies as normal. A Reposition can't pass between two creatures either: it stops in the last legal square, without Collision damage.

@@DIAGRAM:corners@@

## Straight Line

When an Action, effect or rule moves a creature (yourself included) in a straight line, like the Charge Action, draw a line from the center of the creature's square to the center of the destination square. The creature moves along the same squares as a [[Line]]: one square per step along the line's longer direction, at each step the square whose center is nearest to the line, ending in the destination. Where the line passes exactly between two squares, choose a side once, left or right (looking toward the destination), for the whole movement: every tie takes that side. The creature that moves chooses for its own movement; the origin chooses for a Forced Movement. If a square on the line isn't a legal move (for Charge: Difficult Terrain, a creature in the way, or a solid corner), the movement stops in the last legal square before it.

**A creature larger than one square** draws the line from the center of its space to the center of the space it ends in, and its whole space moves together: at each step every one of its squares moves the same way, so its shape never changes. The line's squares are found as for a Medium creature (one step along the longer direction, the left or right tie chosen once), and each step must be legal for every square the creature enters.

@@DIAGRAM:straight-large@@

**Toward a creature.** When a rule moves you in a straight line **toward a creature**, the line goes to the center of that creature's space. You can stop in any square on the line, and you can't enter the creature's space: the movement brings you closer to it, never around it.

In the figures, Y is you. Blue squares are the squares the token passes, the green square is where it ends, and red squares are not legal. The line is what counts: the path of the token on the grid does not have to be exactly straight, because a token moves from square to square.

@@DIAGRAM:straight@@

## Forced Movement

Forced Movement is movement you impose on another creature, choosing where it goes. There are three types: Pushed, Pulled and Slid. [[Reposition]] also moves a creature of your choice, but it isn't Forced Movement. Every Forced Movement follows these rules:

- It doesn't trigger Reactions from movement. (A Reaction that triggers on the Forced Movement itself, "a creature would be moved by Forced Movement", still does.)
- It ignores Difficult Terrain.
- It can move a creature into [[Hazardous Terrain]] or a Deadly Hazard.
- It doesn't use the creature's Speed, and each square counts as 1, even when it is diagonal.
- Its value is reduced by the creature's [[Steadiness]].
- The **origin** of Forced Movement is the creature using the Action, unless the effect names another creature or a point as its origin ("Pushed 1, away from the target", "Pushed 2 from the Burst's center"): the direction is then taken from there, and the creature using the Action still chooses the destinations.
- **A creature as the origin is measured from its square nearest the creature it moves.** For Pushed and Pulled, the distances and the cone are taken from that square, not from the center of a larger creature's space: a Large creature pushes straight away from the side it touches. When several of its squares are equally near, use the one whose center is nearest the moved creature's center.
- **A larger creature being moved is measured from its squares nearest the origin.** For Pushed and Pulled, each of its squares nearest the origin gives its own straight line and cone, and the creature can move within any of them; "farther" and "closer" are the distance from the origin to the creature's nearest square. A Large creature pushed from its side can go straight away or diagonally to either side, as a Medium one can.
- Its value is a maximum: you can always move the creature less, down to 0. **Choosing** to move a creature 0 squares is no movement and no Forced Movement on it: nothing that happens when a creature is moved, enters or leaves a square happens. A creature aimed farther but stopped before its first square (a wall right behind it) is different: see [[Collision]]. It can never make a creature end its movement inside another creature or an object: this is [[Collision]], and it only happens when the destination you chose is blocked.

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

**Stopped at once.** A creature aimed at a square it can't enter from where it stands (a wall or a creature right next to it, on the way) moves 0 squares and takes the Collision for every square. It still **counts as moved by Forced Movement and as leaving its square**, for every rule that cares (Leaning ends, for example). A Forced Movement reduced to 0 by [[Steadiness]] is not this: it moves the creature nowhere, and nothing happens.

> [!example]
> Pushed 4 aimed at a destination 4 squares away, with a wall right behind you, deals 8 damage. Aimed through a creature after 1 square, it deals 3 damage to each. Pushed 1 square, with nothing in the way, deals no damage.

A Reposition stops at an object or a creature without taking Collision damage.

## Reposition

Reposition moves a creature of your choice along a path, but it isn't Forced Movement. Reposition has a value: up to that many squares of path. **You move the creature yourself, so it stays within your Reach the whole way:** every square of its path, and the square where it ends, is within your Reach. The creature's Size doesn't limit it. The path follows the rules of [[Slid]] (each square next to the previous one, each counting as 1 even when it is diagonal, and the origin must have Line of Effect to the creature at every square), with these rules:

- It doesn't trigger Reactions from movement.
- It ignores Difficult Terrain.
- Its value is reduced by the creature's [[Steadiness]].
- It can't move a creature into Hazardous Terrain or a Deadly Hazard, though it can move the creature to a less advantageous position, for example into a flanked square.
- It can't pass through creatures or objects: it stops in the last legal square before one, without Collision damage. It can never make a creature end its movement inside another creature or an object.

> [!example]
> You hold a weapon with Reach 2. Dave stands next to you and a goblin next to him, in a line. Reposition 2 can't move the goblin through Dave's square, but the path can go around him, staying within your Reach: 1 square diagonally over Dave, then 1 square to the side, into the square next to you.

@@DIAGRAM:reposition@@

The four movements side by side:

| | Pushed | Pulled | Slid | Reposition |
|---|---|---|---|---|
| Forced Movement | Yes | Yes | Yes | No |
| Direction | Away (cone) | Toward (cone) | Any path | Any path |
| The origin needs Line of Effect at every square of the path | No | No | Yes | Yes |
| Into Hazardous Terrain or a Deadly Hazard | Yes | Yes | Yes | No |
| Creatures in the way | Collision | Collision | Collision | Stops, no damage |
| Objects in the way | Collision damage | Collision damage | Collision damage | Stops, no damage |
| Each diagonal square counts | 1 | 1 | 1 | 1 |

All four need [[Line of Effect]] to the creature when they begin, like anything a card does to a creature (see [[Targets of Effects]]); the table's row is about the rest of the path.

### Swapping Places

When a rule makes two creatures **swap squares**, each enters the square the other left, at the same moment. Each of them is moved by a [[Reposition]]: it is not a Move Action, it triggers no Reactions, and both have left their square (see [[Moving and Leaving Your Square]]).

Only two creatures of the same Size can swap squares. Steadiness doesn't stop a swap with a willing creature: it chooses not to apply it.

## Steadiness

Some creatures are harder to move than others. Every creature has a **Steadiness**: normally 0. When you are moved by Forced Movement or Reposition, reduce its value by your Steadiness: a Pushed 3 against Steadiness 1 is a Pushed 2, and a value of 0 or less moves you nowhere. The value is reduced before the origin chooses the destination, so a creature with Steadiness also takes less damage from Collision (the origin can aim less far). You can choose not to apply your Steadiness, for example when an ally helps you.

**Below 0.** Steadiness can go below 0 (being [[Bloodied]] lowers it by 1). A negative Steadiness adds to a **Forced Movement** (a Pushed 2 against Steadiness −1 is a Pushed 3), never to a Reposition, and it always applies: you can't choose to ignore it.

## Difficult Terrain

Each square of difficult terrain counts double the squares it would normally count. The GM decides where it is (rubble, deep snow...). Darkness is Difficult Terrain for creatures that can't see in it. An ally's space, and a Down or dead creature's, is Difficult Terrain too; an unwilling creature's space blocks your movement (see [[Movement|Creatures in your way]]).

@@DIAGRAM:difficult@@

## Hazardous Terrain

**Hazardous Terrain** is any terrain that deals damage or inflicts a harmful condition on the creatures in it. The effect that creates it is marked **[HT]** in its text and declares one or more trigger patterns.

**[HT]** is notation, like [W] and [Mod]: it is written in the text of the effect that creates the area, not among the Action's traits (a Basic Attack whose Tier 2 leaves caltrops is not a hazard itself). It declares its pattern(s) after a colon, such as **[HT: Entering]** or **[HT: Entering, Turn]**: "The area lasts 2 rounds [HT: Entering, Turn]." The three patterns are:

- **Entering:** "When a creature enters this area." A creature in the area when it appears is treated as entering it.
- **Turn:** "When a creature ends its turn in this area."
- **Movement:** "When a creature moves within this area." A movement (an Advance, an Evade or a Forced Movement) that crosses any square of the area.

An [HT] effect with no declared pattern uses Entering and Turn by default.

**Once per turn-cycle.** An [HT] area affects each creature at most once per turn-cycle (from the start of that creature's turn to the start of its next), whatever its patterns: a creature that Advances into an area with Entering and Movement, or enters it and ends its turn there, is affected once.

**Size.** An [HT] area affects a creature once regardless of its Size.

> [!example]
> A 2 Emanation of fire (Distance 10 sq.) has [HT: Entering, Turn]. A creature that walks into it takes [V] 1d8 Fi damage on entering; a creature already inside takes the same damage when it ends its turn there. A creature that enters, leaves and re-enters with a different Movement in the same turn-cycle is affected at most once.

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

A Weapon Action takes its distance and its Melee or Ranged nature from the weapon you use for it, and from how you use it. With a Ranged weapon, or a weapon with the Thrown property when thrown, it uses the weapon's ranged Range and counts as a Ranged Action (Prone's Bane applies to it). With a Melee weapon used in hand, it uses the weapon's melee Range and counts as a Melee Action (Prone's Boon applies). An Action that has the Melee or Ranged trait itself needs a weapon used that way. While you have a free hand, you can use your [[Fists (the weapon)|Fists]] as your weapon.

## Engaged

You are **Engaged** if you are adjacent to an enemy (next to you, even diagonally) and both of you can be Engaged. Being Engaged does not depend on what you perceive: an enemy next to you that you cannot see still Engages you.

A condition can say that you can't be Engaged, as [[Unconscious]] does. A creature that can't be Engaged is never Engaged, and the creatures next to it are not Engaged with it.

By itself, being Engaged does nothing. Other rules use the word, such as [[Ranged Combat While Engaged]] below.

@@DIAGRAM:engaged@@

### Ranged Combat While Engaged

Using a [Ranged] Action while you are [[Engaged]] is very hard: the roll is **[[Favored and Doomed Rolls|Doomed]]**.

When you use a [Ranged] Action against a creature that is Engaged with a creature other than yourself, you suffer **1 Field Bane**.

## Flanking

A creature **threatens** every enemy within the **normal range** of a Melee weapon, for as long as it qualifies to use that weapon's Basic Attack (1A). The 3-Strike limit doesn't remove the threat: it prevents using the Action, not qualifying for it. Some conditions, such as Unconscious, cause a creature to threaten no one, and a weapon with the [[Non-threatening]] property doesn't threaten, unless a feature says otherwise. The far range of a Melee weapon doesn't count, and a Melee weapon with the Long property doesn't threaten adjacent enemies.

Like [[Engaged]], threatening does not depend on what you perceive, but it uses range and not adjacency: a creature with a Range 2 weapon threatens an enemy 2 squares away, which is not Engaged with it.

Two creatures **flank** an enemy when both threaten it and they stand on **opposite sides** of it: the second is within 45° of the straight line from the first through the center of the enemy's space (measured between the centers of squares; the 45° edge counts, and any square of a larger creature's space can be used). Next to a one-square enemy, these are the three squares across from you. A creature that flanks an enemy gains **1 Field Boon** on its [Melee] Actions against that enemy; more flankers add nothing. But if an **ally of that enemy threatens the flanker**, it gains no Boon (it has to watch its own back). The Boon counts toward the limit of 2 Field Boons (see [[Named Boons and Banes]]), so it leaves room for another, such as a [[Prone]] target's.

Blue tokens are allies and red-brown tokens are enemies. A badge is the Boon that creature gets on [Melee] Actions against the creature in the middle (G, John in the fifth picture) or against D in the last one.

**Example 1: Opposite sides.** Philip and John stand on opposite sides of a goblin and both threaten it: each has 1 Field Boon on [Melee] Actions against it.

**Example 2: The three squares across.** Philip stands diagonally across from John: still opposite, 1 Boon each. A third ally beside John threatens the goblin too, but no one stands across from it: it gains nothing.

**Example 3: More flankers.** Five allies surround the goblin. Each has someone across from it: 1 Boon each, never more.

@@DIAGRAM:flanking1@@

**Example 4: Range 2.** Philip holds a weapon with Range 2 and stands 2 squares from the goblin, across from John. He threatens it, so he flanks with John: 1 Boon each.

**Example 5: Three goblins on John.** Goblins A and C stand across from each other and flank John. Philip threatens C, so C gains no Boon; A still has 1. Goblin B has no goblin across from it: nothing.

@@DIAGRAM:flanking2@@

**Example 6: Two lines of fighters.** Two lines of fighters face each other, all of them against D, the second fighter on the left. No one stands on D's far side, so no one flanks it: a line holds against a line.

@@DIAGRAM:flanking3@@

## Line of Effect

To target a creature with an Action, or to do anything to a creature with a card or a feature (see [[Targets of Effects]]), you need **Line of Effect** to them: a straight line from the center of your square to **any corner of the target's space** that nothing blocks. Walls and similar solid obstacles block a line. If all four corners are blocked, you have no Line of Effect and can't target the creature, even if you perceive it.

An area effect checks Line of Effect from its **[[Areas|Point of Origin]]** to each creature in the area (from the center of the space, when the Point of Origin is a creature's space).

A creature larger than one square (Large, 2 × 2 squares or bigger) that is targeting picks any square it occupies as its starting square. When it is the target, check each square it occupies and use the one with the least cover (if any square has Line of Effect, it can be targeted).

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

- **Creatures in the way.** If another creature is on the line from the center of your square to the center of the target's space, the target has **Low cover** (1 Field Bane). The line must pass **through** the creature's space: a line that only touches it, at a corner or along an edge, doesn't count. **A Prone or dead creature gives no cover**: it lies too low to be in the way. Against an area, the creatures inside it never give cover ([[Cover against an area]]). Creatures never count as blocked corners, and cover doesn't add up: you take the highest cover that applies.
- **Cover and the rest.** Cover Banes apply to [Strike] and [Area] Actions, melee and ranged alike (Line of Effect still applies to every Action). Its Field Banes count with your other Field Banes. High cover gives no Field Banes, only Doomed; your other Field Banes still apply (Prone, Obscured). A target that is Hidden and behind High cover is still only Doomed once.

@@DIAGRAM:cover@@

@@DIAGRAM:on-the-line@@

### Leaning

A creature behind a wall can lean out to attack. While you are **Leaning**, you calculate cover from one of **your corners** instead of the center of your square, and your own cover against other creatures' Actions is reduced by 1 level (Total → High → Medium → Low → none). A creature leaning out of Total cover becomes High cover (still targetable). Leaning lasts until the end of your turn, so Reactions can use it, and ends early when you **leave your square** (any movement: an Advance, an Evade, a Forced Movement). You can stop Leaning at any time on your turn, at no cost. You start it with the [[Lean]] Basic Action.

## Areas

Some Actions have an **Area**, written on its own line, for example **Area: 1 Emanation**. These Actions have the [[Area]] trait. An Area Action can also have a **Distance**, on the next line: how far from the creature using the Action its area can be placed, for example **Distance: 10 sq.** With no Distance, an Emanation is around the creature that uses the Action.

Every area spreads from a **Point of Origin**: for an Emanation, its target (a creature's space or a square); for a Line, your square; for other areas, the point the Action says they start from (for example, the tip of a cone). The Point of Origin is a place, not the creature that uses the Action, which is still called the origin.

### Cover against an area

[[Line of Effect]] and [[Cover]] are checked from the area's Point of Origin to each creature in it. **The creatures inside an area never give Cover against it**, to each other or to themselves: only walls and objects do. For example, an Ogre slams the ground in a 2 Emanation around itself with three Goblins and Wes in it: Wes, behind a Goblin, gets no Cover from that Goblin, but a pillar between the Ogre and Wes still gives him Cover.

### Emanation

An Emanation, written with a value like **1 Emanation**, extends a number of squares around its **target**: a creature or a square. It affects every creature in its area unless the Action says otherwise. If its target is a creature, the origin decides whether that creature is affected too. For example, a creature using Ground Slam (an Emanation around itself) decides whether it is affected.

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
- **Targets and cover.** A Line affects every creature in its squares unless the Action says otherwise, and the Action is [[Several Targets|rolled once for all of them]]. [[Line of Effect]] and [[Cover]] are checked from your square, as for any area, and the creatures in the Line give no cover to each other (walls still do; see [[Cover against an area]]).
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

A light source sheds **Bright light** in an Emanation of its size, and **Dim light** for the same number of squares beyond that. A torch with Bright light 4 gives Bright light in a 4 Emanation and Dim light from 5 to 8 squares away (an 8 Emanation). Lantern of Faith's Bright light 3 gives Bright light in a 3 Emanation and Dim light from 4 to 6. Beyond that, the light of the scene applies (daylight, night, a dark cave...).

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
| **Obscured** | 1 Field Bane. | 1 Field Boon, if it is Clear to you. |
| **Hidden** | **Doomed**. | **[[Favored and Doomed Rolls\|Favored]]**. |
| **Unsensed** | You can't target it. | **[[Favored and Doomed Rolls\|Favored]]**. |

Actions with the [[Area]] trait ignore Senses: they target the creatures in their area however well you perceive them.

When you use an Action against a creature, ask two questions, in this order:

1. **How do you perceive it?** That is the "Your Actions against it" column: nothing if it is Clear, 1 Field Bane if it is Obscured, Doomed if it is Hidden. If it is Unsensed, you can't target it.
2. **Does it perceive you worse than you perceive it?** Only then do you gain the "Its Actions against you" column, read for how it perceives **you**: 1 Field Boon if you are Obscured to it, Favored if you are Hidden or Unsensed to it. **You never gain this against a creature that is Hidden to you.**

@@DIAGRAM:senses@@

So two creatures that are each Obscured to the other each take 1 Field Bane and gain nothing, and two creatures that are each Hidden to the other are both Doomed against each other. A roll that is both Favored and Doomed is a normal roll (see [[Favored and Doomed Rolls]]).

Every creature has **Sight** and **Hearing**:

- **Sight:** You perceive creatures in Bright light as Clear and creatures in Dim light as Obscured. You can't see creatures in Darkness, or creatures you have no [[Line of Effect]] to.
- **Hearing:** You perceive creatures that make noise within **10 squares** as Hidden, around corners and through walls, unless a **thick wall** is between you. Creatures in combat make noise, even standing in the same square on their turn. A creature can [[Hide]] to stop making noise.

A **thick wall** is a wall at least **1 square** thick. A thick wall usually blocks Hearing and Tremorsense; the GM can rule otherwise for a wall that carries sound (a hollow wooden wall, a pipe through stone).

So in Darkness you usually still hear a creature, and it is Hidden to you; an invisible creature that you only hear is Hidden too.

### Hiding

The [[Hide]] Action makes you **Hidden** or **Unsensed** to some creatures **from Hide**. This is kept for each creature on its own: you can be Unsensed to one Goblin, Hidden to another and Clear to a third. Against a creature, you use whichever is worse for it: what Hide gave you, or what its senses give it.

- **Moving while hidden:** an Advance, an Evade or any other movement isn't [Subtle]: once it is resolved, Hide ends against every creature. To move and stay hidden, use [[Sneak]].
- **Finding a hidden creature:** [[Seek]] finds creatures that are Hidden or Unsensed to you from Hide; [[Point Out]] shows one you perceive to your allies.
- **Reactions:** a creature to which you are Hidden can still react to you, and one to which you are Unsensed can't (see [[Reactions]]).

**Hide ends** against a creature when any of these happens:

1. **It gains Sight of you without High Cover:** Hide ends against it. If you were Unsensed to it and you still have High Cover against it, you are Hidden to it instead.
2. **It finds you:** its [[Seek]], or an ally's [[Point Out]], improves how it perceives you.
3. **You use an Action that isn't [Subtle]:** once that Action is resolved, Hide ends against every creature, and your Senses are back to normal. Attacking from Darkness leaves you Hidden by Hearing to the creature you attacked, not Clear: its senses still decide how it perceives you.

> [!example]
> Drak crouches behind a crate (High Cover) in a dark storeroom while two Goblins search for him. He uses Hide: against the first Goblin, which can't see him, he gets a Tier 2 and is Unsensed to it; against the second, which has Dark Sight and sees him over the crate, he gets a Tier 2 and is Hidden to it. He uses Sneak to reach the door. The first Goblin never sees him, so he stays Unsensed to it. The second one does: he stays Hidden to it during the movement, but at the door he has no High Cover against it, so Hide ends against it at the end of his turn. On his next turn he strikes the first Goblin with his Basic Attack: the Action isn't [Subtle], so after it Hide ends, and the Goblin perceives him with its own senses again (Hidden, by Hearing, in the dark).

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
