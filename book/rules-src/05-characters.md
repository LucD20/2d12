<!-- part: Part II: Characters -->
# Chapter 5: Characters

## Building a Character

1. **Attributes.** All four Attributes (Body, Mind, Appeal, Instinct) start at **0**.
2. **Species.** Apply your species' Attribute changes (the species are in the [[Species]] document). It also gives you **Species Body Health** and **Species Mind Health**, a **Speed**, your **Reach** (1), your **Steadiness** and your **Size** (all current species are Medium (3)).
3. **Class.** Apply your class' Attribute increases. It also gives you a **Body Health Multiplier** and a **Mind Health Multiplier**, a **Rally** value, a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**. Your Speed is your species' Speed plus your class' Speed Modifier.
4. **Choices.** When a species or class says "or", pick one. A class's choices between two Attributes must be different from each other (see [[Distinct Choices]]).
5. **[[Health Pool]].** Calculate it from your Attributes, the Health Multipliers and the Species Health values:
    - Body Damage Threshold = ((Body + 2) × Body Health Multiplier + Species Body Health) × (Level + 17) ÷ 16
    - Mind Damage Threshold = ((Mind + 2) × Mind Health Multiplier + Species Mind Health) × (Level + 17) ÷ 16
    - Health Pool = the two thresholds added together.
6. **[[Rally Points]]** = your class' Rally value + ⌈(Body + Mind + your level) ÷ 2⌉.
7. **Features and Talents.** Take the Features and Class Actions of your class for your level, the Picks its level list gives you, and the Talents they let you pick (the Talents are in the [[Talents]] document; weapons and armor in the [[Gear]] document).
8. **Escalation.** Choose the Escalation abilities your class's level list gives you, from its [[Escalation]] abilities.

## Classes

Your class gives you Attribute increases, a **Body Health Multiplier** and a **Mind Health Multiplier** (used for your Health Pool), a **Rally** value (used for Rally Points), a **Speed Modifier**, a **Weapon Modifier** and a **Power Modifier**, an **[[Armor Training]]**, and a list of **Escalation** abilities. Round modifiers up. A class's Weapon Modifier and Power Modifier use the higher of the Attributes it lists for each, and can't use the same Attribute.

When you pick your class, you choose its Attribute increases when they say "or". These choices can't be changed later.

Each class is written in its own document: [[Paladin]] and [[Archer]].

### Class Actions, Picks and the Repertoire

A class's **Class Actions** are the Actions it gives you at level 1. A class can give a **Hallmark Action** instead: a choice of two Actions that are the class's fantasy (the Paladin: Smite or Lay On Hands; the Archer: Double Shot or Rolling Shot); you take one, and the other is not yours. A Hallmark Action doesn't need the [[Signature]] trait: that trait only sets the Modifier an Action rolls (Smite has it, Double Shot makes no roll of its own). Its **Repertoire** is everything else it offers, listed by [[Frequency]]: **Passive** (it works on its own), **Turn**, **Round**, **Encounter** and **Daily**. A **Pick** is one choice from the Repertoire: the level list says how many Picks you take at each level and from which list (an Encounter Pick comes from the Encounter list; a Pick "from any list" can come from any of them). Escalation abilities are chosen the same way, from the class's Escalation list.

### Leveling Up

Each class has a **level list**: what you gain at each level (Features, Class Actions, Picks and Escalation abilities). When you reach a new level, you take what its entry gives you. Your Health thresholds grow with your level too (see Building a Character, step 5).

### Stages

The levels are grouped in **Stages**: **Stage 1** is levels 1 to 4, **Stage 2** levels 5 to 7, **Stage 3** levels 8 to 10. A new Stage raises your Modifiers (see [[Weapon, Power and Signature Modifiers]]) and the NPCs of the [[Bestiary]] (their tables have one row per Stage).

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

**Your Modifiers grow with your [[Stages|Stage]]:** your Weapon and Power Modifiers are **+1 at level 5** (Stage 2) and **+2 at level 8** (Stage 3), but **never above +4**. A Modifier of +3 at level 1 is +4 from level 5 on.

If the same Attribute is the higher one for both Modifiers, one of them uses its other Attribute instead. You choose which, and you can change that choice when you level up.

Your **Signature Modifier** is the higher of your Weapon Modifier and your Power Modifier (if they are equal, choose one). Its Attribute is your **Signature Attribute**. Actions with the Signature trait roll it.

> [!example]
> A Paladin with Body 1, Mind 2 and Appeal 3. Both Modifiers want Appeal. If the Weapon Modifier keeps it, it is 3 (3 ÷ 2 = 1.5, rounded up to 2, + 1) and the Power Modifier uses Mind: 2 (2 ÷ 2 + 1); the Signature Modifier is 3, from Appeal. If the Power Modifier keeps Appeal instead, it is 3, and the Weapon Modifier uses Body: 2 (1 ÷ 2 = 0.5, rounded up to 1, + 1).

### Escalation Abilities

Each class has a list of **Escalation** abilities: **Passives**, which work while you have enough Escalation, and **Actives**, Actions that cost Escalation on top of their AP. Your class's level list says how many of each you choose at every level. See [[Escalation]] for how you gain and spend it.
