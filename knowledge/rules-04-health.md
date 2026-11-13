# Chapter 4: Health

## Health Pool

Your **Health Pool** is the sum of two thresholds, **Vigor** and **Resolve**:

1. **Your class** gives a **high** and a **low** Health value. When you build your character, you assign one to Vigor and the other to Resolve; the choice can't be changed later.
2. **Your species** adds its bonus to each (see the [[Species]] document).
3. **Your Stage:** at Stages 1, 2 and 3, each threshold grows by your class's step for its value (the high step or the low step; see [[Stages]]).
4. **The floor:** neither threshold can be less than a third of your Health Pool (rounded up). If one is, move points from the other threshold to it until it reaches a third; the Health Pool doesn't change.

Your Attributes don't change your Health.

> [!example]
> A Human Paladin (high 20, low 10) puts the high value on Vigor: Vigor 20 + 3 = **23**, Resolve 10 + 2 = **12**, Health Pool **35**.
>
> Steven, an Elf Archer (high 16, low 8), puts the high value on Resolve: Vigor 8 + 1 = 9, Resolve 16 + 4 = 20, Health Pool 29. A third of 29 is 10, so 1 point moves: Vigor **10**, Resolve **19**.

Vigor and Resolve are not separate pools. All damage reduces the same Health Pool. The thresholds only decide which states you reach.

## Damage

Record every point of damage as:

- **Vigor** or **Resolve** (see [[Damage Types]])
- **Lethal** or **Nonlethal**

Damage is **Lethal** unless an Action or effect says it is Nonlethal. Lethal and Nonlethal damage both count toward the thresholds and toward your total damage. They never cancel or convert each other. Damage keeps accumulating after you are Down.

When you have Vigor damage **equal to or more than** your Vigor, you are **[[Bloodied]]**. When you have Resolve damage **equal to or more than** your Resolve, you are **[[Strained]]**.

### Instances of Damage

An Action's damage can come in several **instances**: each part with its own pool and damage type is one instance. "[V] 1[W] + [Mod] + [R] 2d8 Ho" deals two: the weapon's damage with your Modifier (Vigor, the weapon's type), and 2d8 Holy (Resolve). Each [W] is its own instance (2[W] is two, see the [[Gear]] document), and extra damage from another effect, such as Divine Surge's 1d8, is its own instance. Each target takes its own instances. Rules that count instances, such as Hallowed Stance ("one instance of damage per Action"), count them this way.

### Lethal and Nonlethal

Actions deal **Lethal** damage by default. Actions with the **Nonlethal** trait deal **Nonlethal** damage by default. A Nonlethal Action can deal Lethal damage by taking a Bane, and a Lethal Action can deal Nonlethal damage by taking a Bane as well.

How damage is written on a card ([V], [R], [W], [Mod] and the damage types) is in [[Roll Effects]]. Empowered, which adds a die to your damage, is in [[Chapter 8: Conditions|Conditions]].

## Going Down

When your total damage equals or goes above your Health Pool, you are **Down**. Follow these steps in order:

1. **Nonlethal damage ≥ 50% of your Health Pool:** you fall **Unconscious**.
2. **Some Nonlethal damage, but under 50%:** choose to fall **Unconscious** or keep fighting as **Desperate**.
3. **No Nonlethal damage:** check your **Dominant Damage** and become **Dying** or **Shattered**.

### Getting Back Up

When your damage drops below your Health Pool, you are no longer Down: Desperate, Dying and Shattered end, and if you are Unconscious, you wake up at once.

### NPCs Going Down

When an NPC goes Down, they **die** if they have more Lethal damage, or fall **Unconscious** if they have more Nonlethal damage. If they are equal, the GM chooses.

### Dominant Damage

Compare your total Vigor damage to your total Resolve damage. The higher one is your **Dominant Damage**. On a tie, the creature that goes Down chooses.

Dominant Damage doesn't do anything by itself, but it determines the condition you gain when you go Down. Some abilities might also make use of it. You know which Dominant Damage a creature has if you perceive them (Hidden is enough).

- **Vigor** is dominant: you become **Dying**.
- **Resolve** is dominant: you become **Shattered**.

## Wounds and the Tables

Every result on the Dying or Shattered Table is a **Wound**. A Wound from the Dying Table is a **Body Wound**. A Wound from the Shattered Table is a **Mind Wound**.

**Roll:** 2d12 (no exploding dice) **− your Body** (Dying) or **Mind** (Shattered) **+ 1d6 per Wound of the same kind you already have** (Body Wounds for the Dying Table, Mind Wounds for the Shattered Table).

*Example:* a character with 3 Body and 1 Body Wound rolls 2d12 − 3 + 1d6 on the Dying Table.

| Result | Outcome |
|---|---|
| 4 or less | Something very minor |
| 5 to 8 | Something minor |
| 9 to 12 | Something minor |
| 13 to 16 | Something moderate |
| 17 to 20 | Something moderate |
| 21 to 23 | Something severe |
| 24 | Something severe |
| 25 to 26 | "Soft" death |
| 27 or more | Death |

> [!tbd]
> The entries of the Dying and Shattered Tables are placeholders.

## Rally Points

Each character begins with Rally Points equal to **your class's Rally value + 1**, and 1 more at each [[Stages|Stage]] after Stage 0 (Rally + 2 at Stage 1, + 3 at Stage 2, + 4 at Stage 3).

When a Rally Point is used, normally with Steel Yourself, the target removes **⌈their Health Pool ÷ 4⌉** damage. You choose which damage to remove.

**Heal.** When a feature says a creature **heals** a number, it removes that much damage. The creature chooses which damage, as with a Rally Point. A heal to several creatures is rolled once: each of them heals that much.

If you are [[Exhausted]], use your Health Pool as if you weren't: Exhausted doesn't lower your Rally Points or the damage each one removes.

While **Down** (Desperate, Dying or Shattered) or **Unconscious**, you can't use Steel Yourself. Other Actions can still let you use Rally Points, such as Lay On Hands.

Nonlethal damage is removed like any other damage.

Only a Rest restores Rally Points. Sleep does not. A new encounter does not.

**NPCs.** NPCs have no Rally Points. When an Action lets an NPC use one (an ally's Lay On Hands on it) or measures something in its Rally Points (Guard equal to what one of their Rally Points heals), one of its Rally Points removes **9** damage at Stage 0, and it spends nothing (the later Stages' numbers come with their Bestiary tables).

## Guard

Some effects give you **Guard**, written with a value: **Guard 6**. When you take damage, your Guard takes it first (Vigor or Resolve damage alike), and only the rest reaches your Health. Damage your Guard takes isn't damage you take: it doesn't count toward your thresholds or your Health Pool, and it doesn't trigger anything that happens when you take damage. A [[Riders|rider]] on that damage still happens: Guard takes damage that was dealt.

- Damage reduction (such as Hallowed Stance) applies first; Guard takes what is left.
- Guard isn't Health: it can't be healed, and Rally Points don't restore it.
- It doesn't stack: if you gain Guard while you have some, keep the higher value (see [[Stacking]]). The exception is the Guard your [[Unspent AP]] give you: it adds to your other Guard, damage takes it first, and it lasts 1 round (from the start of your turn until you regain AP again).
- It ends at the end of the encounter.

> [!example]
> Zack has Guard 6 and takes 8 Vigor damage: his Guard takes 6 and ends, and he takes 2 Vigor damage.

## Recovery

There are three ways to recover, from shortest to longest: a Breather, a Sleep and a Rest.

### Take a Breather

**Taking a Breather** is 10 minutes of rest. It removes all of your Nonlethal damage. It is not a Rest (see below).

### Sleep

**Sleep** is 8 hours of non-strenuous activity, such as sleeping or keeping a quiet watch. You can complete a Sleep at most once every 16 hours. Completing a Sleep lets you use your Daily Actions again.

If you go 24 hours without completing a Sleep, you are **[[Exhausted]] 1**. The value increases by 1 for every further 24 hours without one.

Completing a Sleep reduces your Exhausted value by 2.

### Rest

To complete a **Rest**, a character spends a day (24 hours) resting in a safe place. A Rest includes a [[Sleep]].

A **safe place** is a place where you are sure you can rest safely, such as a town. The GM decides what is a safe place. Towns are almost always safe. Someone might still try to attack you while you rest and sleep, but it isn't the same as sleeping in the wilderness, where a beast could show up at any moment. A town with a lot of unrest might not be safe. The GM has the final say.

When you complete a Rest, you remove all the damage you took and you regain all your Rally Points. If you have Wounds, roll a Body Check for your Body Wounds and a Mind Check for your Mind Wounds. Each check removes Wounds of its own type only (Body Check → Body Wounds; Mind Check → Mind Wounds).

| Roll | Result |
|---|---|
| **Tier 1** | You remove 1 Wound. |
| **Tier 2** | You remove 2 Wounds. |
| **Tier 3** | You remove 3 Wounds. |

## Health States

### Bloodied

You are Bloodied while your Vigor damage is equal to or more than your Vigor. It has **no effect by itself**: Actions and features use it, such as "when an ally becomes Bloodied" or "against a Bloodied target".

### Strained

You are Strained while your Resolve damage is equal to or more than your Resolve. Like Bloodied, it has **no effect by itself**: Actions and features use it.

Every creature knows whether a creature it perceives is Bloodied or Strained: the GM says so when an NPC becomes either.

> [!tip]
> A feature that cares about an **enemy** being Bloodied or Strained usually says **"when it becomes"**: an enemy is Bloodied for about a round before it goes Down, so "while" rarely matters. A rider on your own Action can say "while" ("if the target is Strained, heal 2 more").

### Desperate

You are **Down** and still fighting. You are [[Slowed]] 1, or increase your Slowed value by 1 (to a maximum of 3), while Desperate.

- If your Nonlethal damage reaches 50% of your Health Pool, you fall **Unconscious**.
- If you take any **Lethal** damage, check your Dominant Damage and become **Dying** or **Shattered**.

*Example:* Health Pool 46, with 28 Lethal and 13 Nonlethal damage (5 damage away from Down). You take 5 Nonlethal damage and go Down with 18 Nonlethal, which is under 23 (50%). You choose to fight on as **Desperate**. You then take 5 more Nonlethal damage, reaching 23, and fall **Unconscious**. Your 28 Lethal damage and all conditions remain.

### Dying

You are [[Slowed]] 1, or increase your Slowed value by 1 (to a maximum of 3), while Dying.

When you become Dying for the first time in an encounter, roll on the Dying Table. Then choose to **collapse** or **keep fighting**. If you become Dying again in the same encounter, don't roll: choose to collapse or keep fighting.

**If you collapse,** you are **Unconscious**. At the end of each of your turns, make a Body Check:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Dying Table. |
| **Tier 2** | No effect. |
| **Tier 3** | You stabilize: roll on the Dying Table. You are no longer Dying, but you stay Unconscious. |

**If you keep fighting,** at the end of each of your turns, make a Body Check:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Dying Table. |
| **Tier 2** | No effect. |
| **Tier 3** | No effect. |

After this check, you may choose to stop fighting and fall Unconscious.

If you take damage while you keep fighting, make a Body Check if it was Vigor damage, or a Mind Check if it was Resolve damage:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Dying Table. |
| **Tier 2** | Roll on the Dying Table. |
| **Tier 3** | No effect. |

After the check, you may choose to collapse and fall Unconscious.

### Shattered

You are [[Slowed]] 1, or increase your Slowed value by 1 (to a maximum of 3), while Shattered.

When you become Shattered for the first time in an encounter, roll on the Shattered Table. Then choose to **give up** or **keep fighting**. If you become Shattered again in the same encounter, don't roll: choose to give up or keep fighting.

**If you give up,** you are **Unconscious**. At the end of each of your turns, make a Mind Check:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Shattered Table. |
| **Tier 2** | No effect. |
| **Tier 3** | You stabilize: roll on the Shattered Table. You are no longer Shattered, but you stay Unconscious. |

**If you keep fighting,** at the end of each of your turns, make a Mind Check:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Shattered Table. |
| **Tier 2** | No effect. |
| **Tier 3** | No effect. |

After this check, you may choose to stop fighting and fall Unconscious.

If you take damage while you keep fighting, make a Body Check if it was Vigor damage, or a Mind Check if it was Resolve damage:

| Roll | Result |
|---|---|
| **Tier 1** | Roll on the Shattered Table. |
| **Tier 2** | Roll on the Shattered Table. |
| **Tier 3** | No effect. |

After the check, you may choose to give up and fall Unconscious.

### Unconscious

- You can't take Actions, you are **Prone**, and you drop everything you hold.
- You can't be [[Engaged]], and you threaten no one (see [[Flanking]]).
- While Unconscious, every creature is [[Senses|Unsensed]] to you.
- All your [[Rolls]] are **Doomed**, whatever the Attribute. The only exceptions are the Checks you roll each turn while Dying (Body) or Shattered (Mind); those are not Doomed.
- Unless you are Down, a creature can wake you with the Interact Action (1A).
- You can't wake up while Dying or Shattered, or while your damage is equal to or more than your Health Pool.
- While Unconscious and not Dying nor Shattered, every hour you remove damage equal to what one of your Rally Points removes.
- If you take damage while Down, you roll on the Dying or Shattered Table. If you weren't Dying or Shattered yet, check your Dominant Damage first and become one of them.

An Unconscious creature isn't a threat, so creatures normally don't attack them, even mindless ones (some very cruel creatures might). A creature that keeps fighting while Dying or Shattered is still a threat, and is attacked like anyone else.
