<!-- part: Part II: Characters -->
# Chapter 5: Characters

## Building a Character

1. **Attributes.** All four Attributes (Body, Mind, Appeal, Instinct) start at **0**.
2. **Species.** Apply your species' Attribute changes (the species are in the [[Species]] document). It also gives you a **Vigor** and a **Resolve** bonus, a **Speed**, your **Reach** (1), your **Steadiness** and your **Size** (all current species are Medium (3)).
3. **Class.** Apply your class' Attribute increases. It also gives you a **high** and a **low Health value** (and the steps they grow by at each Stage), a **Rally** value, a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**. Your Speed is your species' Speed plus your class' Speed Modifier.
4. **Choices.** When a species or class says "or", pick one. A class's choices between two Attributes must be different from each other (see [[Distinct Choices]]).
5. **[[Health Pool]].** Assign your class's high Health value to Vigor or to Resolve and the low one to the other, then add your species' bonuses (neither can be under a third of the total). Your Health Pool is the two added together.
6. **[[Rally Points]]** = your class' Rally value + your Stage (1 at level 1).
7. **Level 1.** Take your class's Features, its **Hallmark Action** and **Hallmark Reaction** (a choice of two each), its **Encounter Pick** and a **Talent** (the Talents are in the [[Talents]] document; weapons and armor in the [[Gear]] document).
8. **Escalation.** Choose one **Escalation Passive** for each Escalation level (1, 2 and 3) and your **Apex** from your class's [[Escalation]] abilities.

## Classes

Your class gives you Attribute increases, a **high** and a **low Health value** with their Stage steps (used for your Health Pool), a **Rally** value (used for Rally Points), a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**, an **[[Armor Training]]**, and a list of **Escalation** abilities. Round modifiers up. A class's Weapon Modifier and Power Modifier use the higher of the Attributes it lists for each, and can't use the same Attribute.

When you pick your class, you choose its Attribute increases when they say "or". These choices can't be changed later.

Each class is written in its own document: [[Paladin]] and [[Archer]].

### Class Actions, Picks and the Repertoire

At level 1, every class gives you the same kinds of things:

- A **Hallmark Action**: a choice of two Actions that are the class's fantasy; you take one, and the other is not yours. A Hallmark Action doesn't need the [[Signature]] trait: that trait only sets the Modifier an Action rolls.
- A **Hallmark Reaction**: a choice of two Reactions, the same way.
- An **Encounter Pick**.
- The **Escalation** abilities: three Escalation Passives (one per Escalation level) and the Apex (see [[Escalation Abilities]]).
- Its **Features**, and a **Talent**.

A class's **Class Actions** are the Actions it gives you at level 1, the Hallmark Action and the Hallmark Reaction among them. Its **Repertoire** is everything else it offers, listed by [[Frequency]]: **Passive** (it works on its own), **Turn**, **Round**, **Encounter** and **Daily**. A **Pick** is one choice from the Repertoire: the level list says how many Picks you take at each level and from which list (an Encounter Pick comes from the Encounter list; a Pick "from any list" can come from any of them). Two classes' lists don't need to match: each offers what fits it.

### Leveling Up

Each class has a **level list**: what you gain at each level (Features, Class Actions and Picks). You gain a **Talent at every level**. When you reach a new level, you take what its entry gives you. **Levels give options; Stages change the numbers** (below).

### Stages

The levels are grouped in **Stages**: **Stage 1** is levels 1 to 4, **Stage 2** levels 5 to 7, **Stage 3** levels 8 to 10. Your numbers change only when you reach a new Stage, and the NPCs of the [[Bestiary]] follow them (their tables have one row per Stage).

| | Stage 1 (levels 1-4) | Stage 2 (levels 5-7) | Stage 3 (levels 8-10) |
|---|---|---|---|
| **Attributes** | | +1 to one Attribute of your choice | +1 to one Attribute of your choice |
| **Modifiers** | | | +1 to your Weapon and Power Modifiers (never above +4) |
| **Health** | your class's values | + your class's Stage 2 steps | + your class's Stage 3 steps |
| **Guard per unspent AP** | 2 | 3 | 4 |
| **Rally Points** | Rally + 1 | Rally + 2 | Rally + 3 |
| **Talent** | one a level | a **Stage Talent** at level 5 | a **Stage Talent** at level 8 |

A **Stage Talent** comes from a bigger list than the other Talents, and replaces the level's Talent (see the [[Talents]] document).

### Distinct Choices

When your class gives you a choice between two Attributes, you can't pick an Attribute you already picked from another choice of the same kind:

- **Attribute increases.** Each one goes to a different Attribute. If a class offers "Body or Appeal +1" and "Appeal or Instinct +1" and you pick Appeal for the first, you must pick Instinct for the second.
- **Weapon and Power Modifiers.** They never use the same Attribute (see below).

The two kinds don't limit each other: a Paladin who adds +1 to Body can still use Body for the Weapon Modifier.

### Weapon, Power and Signature Modifiers

Each class lists two Attributes for its **Weapon Modifier** and two for its **Power Modifier**. Each Modifier uses the **higher** of its two Attributes; you never add them together:

- **Weapon Modifier** = the higher of the class's two Weapon Attributes ÷ 2 + 1
- **Power Modifier** = the higher of the class's two Power Attributes ÷ 2 + 1

The Attribute a Modifier uses is your **Weapon Attribute** or your **Power Attribute**.

**Your Modifiers grow with your [[Stages|Stage]]:** your Weapon and Power Modifiers are **+1 at Stage 3** (level 8), and they also follow your Attributes, which grow at each Stage; a Modifier is **never above +4**. Checks and Saves use your Attribute Modifier, which only the Attribute changes.

If the same Attribute is the higher one for both Modifiers, one of them uses its other Attribute instead. You choose which, and you can change that choice when you level up.

Your **Signature Modifier** is the higher of your Weapon Modifier and your Power Modifier (if they are equal, choose one). Its Attribute is your **Signature Attribute**. Actions with the Signature trait roll it.

> [!example]
> A Paladin with Body 1, Mind 2 and Appeal 3. Both Modifiers want Appeal. If the Weapon Modifier keeps it, it is 3 (3 ÷ 2 = 1.5, rounded up to 2, + 1) and the Power Modifier uses Mind: 2 (2 ÷ 2 + 1); the Signature Modifier is 3, from Appeal. If the Power Modifier keeps Appeal instead, it is 3, and the Weapon Modifier uses Body: 2 (1 ÷ 2 = 0.5, rounded up to 1, + 1).

### Escalation Abilities

Each class has a list of **Escalation** abilities: **Escalation Passives**, which work while your Escalation is at least their number, and **Apex** Actions, the class's big Encounter Action that needs Escalation 3. At level 1 you choose one Passive for each Escalation level (1, 2 and 3) and one Apex. Nothing spends Escalation. See [[Escalation]] for how it rises.
