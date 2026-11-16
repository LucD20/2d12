<!-- part: Part I: Core Rules -->
# Chapter 2: Turns and Actions

## Encounters

An **encounter** is a fight or a similar scene: it starts when Initiative is rolled and ends when the GM says it's over. It can't end while a creature is Dying or Shattered: every creature must be unharmed, stabilized or dead. If a creature becomes Dying or Shattered outside of an encounter, it rolls on the Dying or Shattered Table, then Initiative is rolled and that creature goes last.

> [!tip]
> Sometimes, rolling Initiative when a single creature becomes Dying or Shattered and there is no obvious danger around, and an ally can stabilize them easily, is just going to slow down the game. In these non-threatening situations, feel free to roll on the Dying or Shattered Table once, and then the creature stabilizes.

## Initiative

At the start of combat, **every creature rolls Initiative**. Initiative is a Check, normally an Instinct Check, but the GM can call for a different Attribute, for everyone or for some creatures only. The total is the creature's initiative.

Initiative is a **zipper**. The creatures are split into however many different **groups** exist. Usually it is the PCs against a single group of enemies, but three-way combat is possible. Each group puts its creatures in order from the highest result to the lowest. The group with the highest single result goes first. Then the groups take turns, one creature at a time, in the order of their highest result, each taking its highest remaining creature. A group with no creatures left is skipped.

> [!example]
> Victor rolls 14, Paul 13, Wes 10, Goblin Warrior 12 and Goblin Scoundrel 10. The PCs' highest result is 14 and the enemies' is 12, so the order is: Victor, Goblin Warrior, Paul, Goblin Scoundrel, Wes.
>
> In a three-way fight, Mark rolls 13 and Nick 9, the enemies Goblin Warrior 12 and Goblin Scoundrel 8, and a third group Kobold Mage 13 and Kobold Shaman 5. The order is Mark, Kobold Mage, Goblin Warrior, Nick, Kobold Shaman, Goblin Scoundrel.

**Ties** are broken by the higher Attribute Modifier used for the Initiative roll. If they are still tied, the Friendly creature (a PC or an ally of the PCs) goes first.

### The Start of the Encounter

Some abilities happen **at the start of an encounter**, such as the Archer's [[Mark Quarry]]. After Initiative is rolled and before the first turn, each of them waits in a **stack**, in the turn order. The GM can change that order: an ally can go later, for example to act after another ally's ability. Then they resolve one at a time, in the stack's order, and the first turn begins.

> [!example]
> Chris and Krysta are Archers. Chris rolls 15 and Krysta 13, so the stack is Chris's Mark Quarry, then Krysta's. Chris wants to know which enemy Krysta marks before choosing his own, so the GM puts Krysta's first.

### Swapping Initiative

On your turn, if you haven't taken any Actions yet and aren't Down, you can spend **1 AP** to swap places in the turn order with an ally who hasn't had a turn this round. The ally takes the turn now, at your place in the order, and gains its AP as normal.

You act at the ally's old place. Until then, your remaining Actions are **frozen**: you can't use them. When your new turn arrives, you carry on with the AP you had left instead of gaining new AP. You can't swap again that round.

> [!example]
> PC1 (first in the order) swaps with PC3 and keeps 3 AP. The order becomes PC3, NPC1, PC2, NPC2, PC1. When PC1's turn comes, PC1 has 3 AP.

## Turns and Rounds

A **turn** is the time one creature acts, from the start of their turn to the end of it. A **[[Rounds|round]]** is one full cycle of turns. Limits that say "per turn" count each turn separately, including other creatures' turns: you can make up to 3 Strikes in your turn, and up to 3 more (as reactions) in another creature's turn.

A **turn-cycle** is the period from the start of a creature's turn to the start of that creature's next turn. In the order "Victor, Goblin Warrior, Paul, Goblin Scoundrel, Wes", Wes's turn-cycle runs from the start of Wes's turn to the start of Wes's next turn.

## Action Points

At the start of your turn in combat, you **regain AP**: you lose any AP you didn't use and gain **4 Action Points (AP)** and **1 Reaction AP**. You spend AP to do things on your turn. The Reaction AP pays only for [[Reactions]], on your turn or another creature's.

### Unspent AP

If you end your turn without spending all your AP, you keep the rest until your next turn starts: nothing else happens then, and those AP can still pay for [[Reactions]]. When you regain AP at the start of your next turn, each AP you still had unused gives you **[[Guard]]** for 1 round: **2** per AP at Stages 0 and 1, **3** at Stage 2 and **4** at Stage 3 (see [[Stages]]).

- This Guard **adds** to any Guard you already have (an exception to [[Stacking]]), and what is left of it ends 1 round later, when you regain AP again. Damage takes it before your other Guard.
- A kept AP you spend on a Reaction is one AP less when your turn starts, so it gives no Guard.
- Your Reaction AP never becomes Guard, and your first turn of an encounter has no unused AP.

> [!example]
> Drak (Stage 0) has Guard 5 from a card and ends his turn with 1 AP left: nothing changes until his next turn (he could still spend that AP on a Reaction). When his next turn starts, he regains his AP and gains Guard 2 for 1 round, on top of his Guard 5: Guard 7. A goblin then hits him for 3: his Guard from AP takes 2 and his other Guard 1, so he has Guard 4 left.

### Losing and Gaining Action Points

When something gives or takes Action Points, it says whether it happens **now** or **when you regain AP**.

- **Now.** "The target loses 1 AP" means they lose 1 AP they have right now; if they have none, it has no effect. "The target gains 1 AP" means they gain 1 AP right now. Unless otherwise stated, you can't have more than 4 AP, and losing or gaining AP never changes your Reaction AP.
- **When you regain AP.** Changes to the AP you regain at the start of your turn are the [[Slowed]] and [[Quickened]] conditions: Slowed 1 means you regain 1 AP less, Quickened 1 means you regain 1 AP more. Neither changes your Reaction AP.

## Reactions

A **Reaction** is an Action you use in response to something another creature does. Its card has an **Interrupt** or a **Trigger** line that says what it responds to, and which of the two it is decides when it happens. Its cost is written with an R, such as **1R**: it uses that many Action Points, but only as a response. A **0R** Reaction uses no AP; its Frequency still limits it.

- **Paying:** A Reaction is paid with your **Reaction AP**, with AP you kept from your turn (see [[Unspent AP]]), or with both: a 2R Reaction can use your Reaction AP and one kept AP. On your own turn, your turn's AP can pay for it too. Your Reaction AP lasts until you regain AP at the start of your next turn. A feature can give you a second Reaction AP: it follows the same rules, and the feature says what it can pay for.
- **No Reaction by default:** No creature has a Reaction of its own: every Reaction comes from a class, an item or a creature's entry. Moving away from an enemy doesn't let it attack you, unless it has a Reaction that says so.
- **Interrupt:** An Interrupt happens **before** the Action that triggers it. "Interrupt: A creature would Advance" means the Reaction happens before the creature uses the Advance Action. An Interrupt can say that part of its effect happens after the triggering Action ("after the damage, they are Slid 1"): that part waits for it.
- **Trigger:** A Trigger happens **after** the Action that triggers it. "Trigger: A creature deals damage to you" happens after you take the triggering damage.
- **Once per triggering Action:** You can react only once to the same Action, but several creatures can react to it. Some Actions, mainly Move Actions, can happen throughout different squares. It is still a single Action, and you decide when you take the Reaction: for instance, you can wait for the creature to move into a more advantageous position before taking your Reaction, instead of taking it as soon as the creature moves.
- **Multiple creatures reacting to the same trigger, at the same time:** You must decide to react before making the rolls: when a creature triggers a Reaction from several creatures, they all decide whether they will react before making any rolls. The creatures taking the Reactions decide the order; if they are opposed, the GM decides or asks for a simple Check to decide who goes first, similar to how Initiative is rolled. If the triggering creature becomes an invalid target after a creature reacts (such as being killed), the remaining creatures still lose the AP as if they had used the Reaction.
- **On any turn:** A Reaction can happen during any turn, including your own: if another creature's Action moves them away from you during your turn, you can react to that.
- You can't use an Action outside your turn unless it is a Reaction.

### What a Reaction Responds To

An Interrupt or a Trigger names a **moment** the rules define, and the Action that holds the moment is the triggering Action. The moments cards use: a creature would leave a square during a Move Action, or uses the Stand Action; an enemy would enter a square adjacent to you or to an ally; an enemy moves closer to you (see [[Moving Closer]]); a creature would be moved by [[Forced Movement]], or would fall Prone; a creature makes a [Strike] Action, or would damage someone; a creature would use a [Power] Action; a creature scores a Tier 3 or a [[Critical]]; an ally or an enemy becomes Bloodied or Strained; a creature goes Down; a creature uses a Rally Point; a creature Charges, or enters a square from which it Flanks you. A card can name another moment, as long as the rules define when it happens: "ends a Move Action" is not one (an Advance can be split through the turn).

While the name "triggering" is similar to "Trigger", it isn't only for Trigger Reactions: it also applies to Interrupt Reactions. The **triggering creature** is the creature who caused the Reaction to happen; the **triggering Action** is the Action that caused the Reaction to happen, and so on.

> [!tip]
> The clarification above might make you think you need to move one square at a time during a game, but this slows the game down a lot. You can just make the full movement and let the creature reacting decide when it happens during the movement. You might need to move the token back to where the Reaction happened if the movement is disrupted (see below), but that doesn't happen often. Doing it this way removes the suspense of "When will this creature start moving? Should I use my Reaction now, or wait and see if it moves into a more favorable position, with the chance that it stops moving before I react?" The table should decide how to run it.

### A Reaction's Target

Every Reaction has a Target line, and its Interrupt or Trigger is written about **the target**. The creature whose Action sets the Reaction off is the **triggering creature**.

**To use a Reaction** you need [[Line of Effect]] to its target, as for every Action. You must also **perceive** the target and the triggering creature (see [[Senses]]): Hidden is enough; Unsensed is not.

**Only the Target line targets.** A Reaction can also do something to the triggering creature when it isn't the target: Shield of Faith's target is the ally, and it Taunts the attacker. You need no Line of Effect to the triggering creature for that; perceiving it is enough.

A feature that says "when..." has no target: you must perceive the creatures it names.

> [!example]
> Zack, a Paladin, has Shield of Faith: "Target: One ally. Interrupt: An enemy's [Strike] Action would damage the target." An orc behind an arrow slit shoots Nari, who stands 3 squares from Zack in the open. Zack has Line of Effect to Nari and hears the orc: he uses Shield of Faith, Nari's damage is reduced, and the orc is Taunted by him. Had Nari been behind a wall, with no Line of Effect from Zack, he couldn't.

> [!example]
> Zack has Rebuke: "Target: One enemy. Trigger: The target moves away from you." A goblin 2 squares from him, on the other side of a wall, runs off. Zack hears it, but Rebuke targets the goblin and he has no Line of Effect to it: he can't use Rebuke.

> [!example]
> Zack has Kindled Wrath: "when an ally becomes Bloodied or goes Down, your Escalation increases by 1". Nari becomes Bloodied behind a wall, 6 squares from Zack. Zack hears him (within 10 squares), and Kindled Wrath has no target: his Escalation increases. At 12 squares behind that wall, out of sight and hearing, it wouldn't.

### Disrupting Actions

When an Action is **disrupted**, it doesn't happen, and the resources and AP spent on it are wasted. Some Actions can disrupt another Action, usually with a Critical.

An Interrupt disrupts the Action before it happens. For example, a Reaction with "Interrupt: A creature uses a Move Action" triggers when a creature uses an Action that Stands and then Advances (1 AP): the creature doesn't Stand, and the whole Action is disrupted (because you can't Advance while Prone).

A Trigger that names a Move Action fires at any point during the Move Action (after the first square it moves), but it is a single trigger: you can use the Reaction only once per Move Action, even with AP to spare. If the Action does something before moving (Stand, then Advance), the Stand happens first; the Trigger fires during the Advance.

When the disrupted Action is only a Linked Action, the Action stops only if that part is necessary for it. What already happened stays, and a disrupted movement ends in the square the creature was in. For example, a Charge disrupted before the creature has moved the 3 squares it needs is cancelled, and they make no Weapon Attack. If it is disrupted after those 3 squares, the Charge ends there, and they make the Weapon Attack if there is a valid target.

### Moving Closer

A creature **moves closer to you** when the distance between you, counted in squares (every second diagonal counts as 2, as always), is smaller after their movement than before. An Interrupt checks this before the creature enters the square; a Trigger checks it if the creature entered any square nearer to you during the movement. The creature moves closer when it would enter a square that is nearer to you than the square it came from. A step to the side that leaves the distance the same is not closer. Evade, Forced Movement and Reposition don't trigger Reactions, so a Reaction to a creature moving closer can't react to any of them.

### Moving Away

A creature **moves away from you** when the distance between you, counted the same way, is larger after their movement than before. Everything else mirrors [[Moving Closer]]:

- An Interrupt checks before the creature enters the farther square; a Trigger checks whether it entered any square farther from you during the movement.
- A step that leaves the distance the same is neither closer nor away.
- A movement that comes closer and then goes away (a creature running past you) moves away from its first farther square.
- For a creature larger than one square, count from its nearest square to your nearest square.
- "Within 3 squares of you" on such a Reaction is checked in the square the creature is in when you take the Reaction.
- If the movement is disrupted, it ends in the square the creature was in when the Reaction was taken.
- Evade, Forced Movement and Reposition don't trigger Reactions, so they are never "moving away".

## Actions

An Action is something you spend AP on. Every Action is written as a card; see [[Reading an Action]].

Actions that roll have three tiers.

Whenever an Action is mentioned in the rules, its **traits** appear next to it. For example, in "You must use 1 AP [Move] to get up from Prone," Move is a [[Chapter 7: Traits|trait]].

### Setup

Some Actions have a **Setup** line. It says what happens before the rest of the Action.

- **A Setup is optional**, unless it says you **must**. You can do part of it: "You Advance up to 5 squares" lets you move fewer, or not at all.
- **The Action's Distance and its targets are checked after the Setup.** You can start out of reach, and the Setup brings you there. If no valid target is within the Distance after the Setup, the rest of the Action doesn't happen, and its cost is still paid.
- **A Setup that names the Action's target fixes it.** If the Setup says "toward the target", you choose that target before the Setup, and it stays the Action's target.
- **If an Action in your Setup is disrupted, the rest of the Action still happens.** Only then, if the Setup had named a target, you can choose another target for the rest of the Action.
- **Setups don't stack.** When something gives a Setup to an Action that already has one, you choose which of the two Setups to use.

### Targets

An Action that targets something can only be used if it has a valid target. An Action with no valid target can't be used. An Action that names a number of targets needs that many: "Two creatures" can't be used against one. "Up to" means any number from one to that many. Most Actions target creatures only, but the GM can allow one to target an unattended object, such as a barrel, a crate or a door. Usually the Action rolls against DC 13 for the object, but the GM can set a different DC depending on the circumstances.

### Willing and Unwilling

Some Actions target a **willing** creature, and some rules change for an **unwilling** one (passing through its square, for example). A creature is **willing** when it accepts the effect: you choose for yourself, and each creature chooses for itself when the effect would happen. An **Unconscious** creature counts as willing. Any other creature that doesn't accept is **unwilling**. A creature doesn't have to know what the effect does to accept it.

### Requirements

Some Actions have **Requirements**, written under the Frequency line (and above the Interrupt or Trigger of a Reaction). To use the Action, you must meet them; otherwise you can't use it at all. They are checked when you start to use the Action, before you pay its cost and before any Setup. Charge requires at least Speed 3: with Speed 2, you can't Charge, and a Speed bonus that the Charge itself gives doesn't count toward it.

### 0 AP Actions

A **0 AP** Action costs no AP, but it is still an Action: you can use it only on your turn, and its Frequency still limits it. An Action that costs no AP and is used in response to something is a Reaction, written **0R** (see [[Reactions]]). [[Linked Actions]] cost no AP either, because they are part of another Action.

### Linked Actions

An Action that another Action lets you use as part of it is a **Linked Action**. It is written with the AP of the Version you use, such as "Weapon Attack (1A)", or "(1A/2A)" when you choose between two Versions.

- It is part of the original Action, so it **costs no AP**.
- It keeps its traits and requirements, unless the Action says otherwise: you must still be able to use it. If an Action lets you Evade (a Linked Action) while you are Immobilized, you can't.
- It affects the target of the original Action, unless it says otherwise. If the original Action doesn't list a target, you can choose the target per Linked Action.
- It doesn't count toward its own uses: not toward its Frequency, the 3 Strikes of the turn, or At-will Banes, unless the Action says otherwise (a Charge's Weapon Attack counts toward At-will Banes).
- If it isn't optional and you can't make it, the whole Action is **[[Disrupting Actions|disrupted]]**. A Linked Action is optional when the Action says you **can** make it ("you can Evade 2"), and required when it says you **do** it ("you Advance 5, make a Weapon Attack (1A) and Advance 5 again").

If a Linked Action has no valid target, the rest of the Action is disrupted (that Linked Action and anything after it don't happen); what already happened stays. By default, you can't change the target of a Linked Action. For example, if a player asks to change the target from a creature to an object so they can continue the Action, the GM should probably accept it only if it makes sense, such as attacking a door on the way, and not "attacking the ground".

> [!example]
> Double Shot lets you make two Weapon Attacks (1A). Afterwards you can still use Weapon Attack as its own Action, and that first use has no At-will Bane.

### Targets of Effects

Unless something says otherwise, the effects of an Action, and the Actions it lets you use (Linked Actions), affect the **target of the Action**. Remember, if the Action doesn't have a target, you choose who to target on each individual Linked Action. If you use Shove on an enemy, the enemy is the one who is Pushed.

Only the Target line makes a creature a target. A card can name another creature in its text (an Area card's "allies in the Area", a Reaction's "triggering creature"): what the card does to that creature follows the card's words, and the rules about targets don't apply to it.

### Effect Timing

Every line of a card says when it happens (see [[Reading an Action]]):

- A **Tier** line happens only on that Tier. A line for two Tiers says so: "Tier 1 or 2". A Tier that isn't written does nothing.
- An **Effect** line happens whenever the card is used, whatever the roll. Before the roll's line, it happens before the roll; after the Tiers, after them.
- Actions with no roll have no Tiers: their Effect simply happens.

Inside a Tier's line, the damage is written first and applied first; what follows the semicolon happens after the damage is applied ("[V] 1[W] + [Mod]; Prone").

Some cards mark an effect for some Tiers only, with the Tiers in parentheses: "Immobilized (T3)" is only Immobilized on a Tier 3 result, and "(T2/T3)" is Tier 2 or Tier 3.

### Buffs

A **Buff** is an effect that modifies another Action, such as Rimebrand's extra damage on your Weapon Actions.

- A Buff that gives a single value ("+[R] 1d6 Co") applies on every Tier, Tier 1 included.
- A Buff that gives a value per Tier ("+[R] 1d4/1d6/1d8 Co") applies its Tier 1 value on a Tier 1, its Tier 2 value on a Tier 2 and its Tier 3 value on a Tier 3.
- A Buff that only applies from Tier 2 onward is written with a 0 on Tier 1: "+[R] 0/1d6/1d8 Co".
- On an Action with several targets, a Buff or a Debuff is rolled once per Tier, not per creature (see [[Several Targets]]).

**Raising Defenses.** "+1 Defense" raises **every** Defense of the creature: Armor Defense, Ward Defense and every Vs. Attribute. "+1 AD", "+1 WD" or "+1 Defense vs Body" raises only that one. A feature can narrow it further, such as "+1 Defense vs Actions that Push". These bonuses don't add up with each other (see [[Stacking]]).

#### Stacking

The same effect never stacks with itself, and bonuses from different effects don't add up either: for each value (Vulnerable, Slowed, a Defense, [[Guard]]...), a creature uses only the **highest bonus** and the **highest penalty** that apply. If a creature gets the same effect again, it keeps the higher value and the longer duration: two effects that make it Vulnerable 1 do not make it Vulnerable 2.

Five things do add up:

- An effect that says it **increases** a value: "increase your Slowed value by 1" adds to the Slowed you have.
- **Boons and Banes**, up to the limit of their name (see [[Named Boons and Banes]]).
- **Named bonuses.** A bonus to a value such as a Defense or a Speed can have a name, as Boons and Banes do: Field, Pressure or Support. Bonuses with different names add up; with the same name, only the highest counts. An unnamed bonus never adds to another bonus: it counts only when it is higher than the named ones together.
- An effect that **increases** your [[Slowed]] value (being Desperate, Dying or Shattered).
- The **Guard** your [[Unspent AP]] give you: it adds to the Guard you have.

For example, Jacob has a +1 Support bonus to every Defense and a +1 Field bonus to Armor Defense: his Armor Defense rises by 2. A second +1 Support bonus changes nothing, and an unnamed +1 bonus doesn't add to them either: he keeps +2.

**Equipment is not a bonus.** Your armor gives your Armor value and your charm your Ward value; effects add to those. With +1 AD and +1 Defense, your Armor Defense rises by 1 (not 2) and every other Defense by 1.

> [!example]
> Weight of Judgment reduces the Speed of a creature a Paladin Judged by 2. If two Paladins with it Judge the same creature, its Speed is still reduced by 2, not 4: it is the same effect.

### Frequency

Some Actions have a **Frequency**, written in the title bar of the card, such as **At-will**, **Turn** (once per turn), **Round** (once per round), **Encounter** (once per encounter) or **Daily** (once per [[Sleep]]). Actions with no Frequency can be used as often as you have AP.

Some traits can change the Frequency or expand the Frequency rules, such as the Strike trait, which limits you to a maximum of three Strikes per turn (see [[Strike|Chapter 7]]).

#### At-will

An **At-will** Action can be used any number of times, but each use after the first in a turn adds **1 Bane** to the roll. For example, if you use Weapon Attack three times in one turn, the first roll is normal, the second has 1 Bane, and the third has 2 Banes. This doesn't apply to Linked Actions.

Each use after the first in a turn adds 1 Bane per specific At-will Action. Different At-will Actions each have their own first-use count.

On an Action with no roll, At-will has no mechanical effect: it is a stylistic default for Actions that can be used freely on your turn.

#### Turn

A **Turn** Action can be used once per turn: once on your turn, and once on each other creature's turn, as long as you have the AP. A Reaction with the Turn Frequency can answer one creature on its turn and another on theirs.

#### Round

A **Round** Action can be used once per turn-cycle, not once per round number: if you are at the end of the Initiative order, use a Round Action, end your turn and a new round begins, you still can't use it again until your whole turn-cycle completes.

#### Encounter

An **Encounter** Action can be used once during a whole encounter. It resets when the encounter ends, which is the GM's call.

#### Daily

A **Daily** Action can be used once, and again only after you complete a [[Sleep]].

## Versus

An Action that rolls uses a **Modifier** and, if it targets a creature, rolls against a **Defense** or DC. The Modifier is your Weapon, Power, Signature or Attribute Modifier (see [[Weapon, Power and Signature Modifiers|Chapter 5]]). Every Action that rolls says so on its **Attack** line, which names the Modifier and the Defense: "Attack: Weapon vs. Armor Defense". The Defense is Armor Defense (AD), Ward Defense (WD), an Attribute ("vs. Body") or a specific DC.

### Defenses

An Action against a creature rolls against one of its **Defenses**. A creature has three kinds:

| Defense | DC |
|---|---|
| **Armor Defense (AD)** | the creature's Armor Defense |
| **Ward Defense (WD)** | the creature's Ward Defense |
| **Vs. an Attribute** | 12 + the target's Attribute |
| **Vs. DC** | A set DC, such as "Vs. DC 13": some Actions have a set DC, and others target something that has no Defenses, such as a stationary object. |

- **Armor value** is the value provided by the [[Armor|armor]] a creature wears. **Armor Defense** is 11 + Armor value + other items + bonuses − penalties.
- **Ward value** is the value provided by the ward a creature carries or is, such as a holy symbol, a charm, a ring or a feature. **Ward Defense** is 11 + your [[Weapon, Power and Signature Modifiers|Power Modifier]] + Ward value + other items + bonuses − penalties. A creature without a ward normally has Ward value 0; items and features can increase this value.


## Rounds and Durations

### Until

When an effect says it lasts **until** something happens, it lasts through that something, and ends once it has been resolved. For example, a creature that is Hindered until they use a Move Action is still Hindered during that Move Action, and stops being Hindered afterwards. "Until you leave your square" ends after any movement, Forced Movement and Reposition included (see [[Moving and Leaving Your Square]]).

### Your Next Action

When an Action says an effect happens on your **next Action** and gives no duration (unlike "For 1 round"), you must make that Action before the end of your current turn. If you don't, the effect is wasted.

### Rounds

A **round** is one full cycle of turns. It starts with the first creature's turn and ends when the last creature ends their turn.

An effect that lasts a number of rounds counts down by 1 at the end of its origin's turn (the creature that created the effect), starting with the origin's next turn, meaning the first "end of turn" is ignored if the effect is created during the origin's turn. An effect that lasts 2 rounds is written "for 2 rounds", or with the rounds in parentheses after it: "Taunted by you (1 round)". Durations are written only as rounds or as [[End of Turn|EoT]]: nothing lasts "until the start of your next turn".

> [!example]
> On the first round of combat, Victor (the first creature in the turn order) causes an effect on Wes that lasts 2 rounds. The effect ends at the end of Victor's turn on the third round.

### End of Turn

When an effect lasts until the end of the turn of the affected creature, it is marked **EoT**.

An EoT effect on yourself still ends at the end of the current turn. A duration in rounds is different: it does not count down at the end of the turn in which the effect was created, because it has to last a whole round.

Each position in the turn order is an **initiative slot**. Effects end at the end of an initiative slot, not of a creature. If a creature swaps initiative, an EoT effect still ends at the end of the slot the creature was in when the effect was applied, and a duration in rounds counts down at the end of the slot in which the effect was applied (the origin's own slot when it was applied on its turn, the current slot when it was applied as a Reaction or out of turn).

## Escalation

**Escalation** is a character's adrenaline: a level from **1 to 6** that rises as a fight goes on. Each PC has their own. It is never spent: your class's Escalation abilities work while your Escalation is high enough.

- **Start:** you start every encounter at **Escalation 1 + your party's [[Momentum]]**.
- **Rounds:** at the start of every round after the first, if you aren't Unconscious, your Escalation increases by 1. While Unconscious, you keep the Escalation you have.
- **Critical:** once an encounter, when you score a [[Critical]] on one of your Actions, your Escalation increases by 1.
- **Your class's hook:** each class names one more event that, once an encounter, increases your Escalation by 1 (the Paladin: an ally within 5 squares of you becomes Bloodied or goes Down; the Archer: your Marked Quarry goes Down). You gain your class's hook at level 2.
- **At most 6:** you can't have more than 6 Escalation, unless a feature says so. A Critical or a hook that happens while your Escalation is already 6 does nothing, and it isn't used up for the encounter.
- **The end:** when the encounter ends, your Escalation goes back to 1, and the abilities that need it stop working.

Your class has two kinds of Escalation abilities:

- **Escalation Passives**, at Escalation **2, 4 and 6**: each works while your Escalation is at least its number ("while your Escalation is 4 or more"). You gain them one level at a time (see [[Stages]]).
- **The Apex**: an Encounter Action whose card says **Escalation 6**. You can use it only while your Escalation is 6; it spends nothing. It comes at level 4, the first level of Stage 1.

An Action with an **Escalation** line on its card needs that much Escalation, the same way.

> [!example]
> Nari's party has Momentum 1, so he starts a fight at Escalation 2: his Escalation 2 Passive works from his first turn. Round 2 starts: he is at 3. In round 2 he scores a Critical: he is at 4, and his Escalation 4 Passive starts working. Round 3 starts: 5. Round 4: 6, and he stays there. When the fight ends, he is back at 1.

NPCs have no Escalation, except Elites (see the [[Bestiary]]).

### Momentum

**Momentum** is the edge your party builds over an expedition: a number from **0 to 4** that the whole party shares. Each of you starts an encounter at Escalation 1 + Momentum, so at 5 at most.

- **Gaining:** +1 after each encounter the party overcomes: a fight, a negotiation, a sneak, a Challenge.
- **Losing:** -1 each time a PC goes Down, and -1 at each [[Sleep]]. If the party retreats from an encounter, it loses all of it.
- **A [[Rest]]** clears it: you leave a Rest with Momentum 0.
- It is never under 0 or above 4.

> [!example]
> Jacob's party has Momentum 2 after two fights, so the third starts at Escalation 3. In it Jacob goes Down: Momentum 1. They win: Momentum 2 again. They sleep in the ruins: 1 in the morning.

> [!tip]
> The GM's valve: after a bad turn of the dice for the whole table, the GM can give every PC +1 Escalation. Nothing else raises it, and nothing spends it.
