# Targeting and reactions in other games (raw report, 2026-11-15)

**The question.** How do published games word "who is the target" of a reaction, above all a protective reaction whose trigger names two creatures (an attacker and an ally)? What do they require the reactor to see or reach, and where did players find it ambiguous?

**How far to trust this.** Other games' rules and other people's opinions, never 2d12's rules.
- **[read]** = I read the rules text itself, in full, on the page or file linked.
- **[checked]** = an opinion I found on its page (poster and date given when the page shows them).
- **[lead]** = seen only in a search tool's summary; the page was not opened. Not to be quoted to anyone before it is opened.
- Not opened on purpose: Reddit, Giant in the Playground, RPG.net (they refuse automated readers).
- "No trouble found" below means my searches found none. It does not mean none exists (Reddit, where most Draw Steel and 5e talk lives, was not read).

Sources of the rules text: the 4e Compendium crawl (github.com/toddcblank/4eitems, files named below), Archives of Nethys (2e.aonprd.com, through its search index) and the Foundry PF2e data (github.com/foundryvtt/pf2e), Draw Steel as markdown (github.com/SteelCompendium/data-rules-md), the 5e SRD 5.1 (5thsrd.org), SRD 5.2.1 as markdown (github.com/oldmanumby/dnd.srd.5.2.1), the Sage Advice Compendium (D&D Beyond page and the 2021 PDF, v2.7), Lancer (github.com/massif-press/lancer-data), ICON 1.5 (github.com/zengulus/icon), 13th Age 1e SRD (github.com/13vaults/13vaults.com), Magic's Comprehensive Rules (yawgatog.com/resources/magic-rules/).

---

## 1. D&D 4e

### Rules text [read]

- **Line of effect** (glossary-543, Rules Compendium p.313): "A clear line from one point to another point in an encounter that doesn't pass through or touch blocking terrain. Unless noted otherwise, there must be line of effect between the origin square of an effect and its intended target for that target to be affected."
- **Line of sight** (glossary-544, RC p.313): "A clear line from one point to another point in an encounter that doesn't pass through or touch an object or an effect—such as a stone wall, a thick curtain, or a cloud of fog—that blocks the vision of the viewer."
- **Close attack** (glossary-123, PHB p.271): "For a target to be affected by a close attack, there must be line of effect from the origin square to the target." **Burst** (glossary-126): "A burst affects a target only if there is line of effect from the burst's origin square to the target."
- **Melee / Ranged attack** (glossary-121, 122): "Melee attacks target individuals." "Ranged attacks target individuals."
- **Targeting what you can't see** (glossary-643, RC p.221): "the attacker has to target a square rather than the enemy [...] It makes the attack roll normally (taking the -5 penalty for attacking a target that has total concealment)." So 4e does not forbid targeting the unseen; it penalizes it.
- **Immediate action** (glossary-120, PHB p.268, RC p.195): "Trigger: Each immediate action—usually a power—defines its trigger." "Interrupts: An immediate interrupt jumps in when its trigger occurs, taking place before the trigger finishes. If an interrupt invalidates a triggering action, the triggering action is lost." "Reactions: [...] The triggering action or event occurs and is completely resolved before the reaction takes place." **Nothing in this entry says the reactor must see or perceive the trigger.**
- **Opportunity attack** (glossary-331, PHB p.290, RC p.246) is the one place sight is written in: "Able to Attack: You can't make an opportunity attack unless you are able to make a melee basic attack and you can see your enemy."
- **Ready an action** (glossary-332): "Choose the specific action the creature is readying [...] as well as the intended target, if applicable." No "perceivable" wording.
- **Effect** (glossary-302): "Some powers have 'Effect' entries, which contain some but not necessarily all of the powers' effects. In an attack power, the effects of such an entry are not contingent on a hit or a miss."

All glossary and power files: https://github.com/toddcblank/4eitems/tree/master/crawled (file names as given).

### How protective triggered powers fill the Target line [read]

4e uses **three different shapes**, all in print at the same time:

**(a) Target = the attacker ("The triggering enemy"); the ally is named in the Trigger and the Effect but is never a target.**
- **Knightly Intercession** (Paladin 9, power-7261): "Immediate Interrupt, Close burst 10. Trigger: An enemy within 10 squares of you hits your ally with a melee or a ranged attack. Target: The triggering enemy. Effect: The triggering attack hits you instead of the ally. You pull the target to a square adjacent to you and then make the following attack against it."
- **Mind Spike** (Battlemind, power-10440): "Immediate Reaction, Melee 1. Trigger: An adjacent enemy marked by you deals damage to your ally with an attack that doesn't include you as a target. Target: The triggering enemy. Effect: The target takes force and psychic damage equal to the damage that its attack dealt to your ally."
- **Warden's Fury** (power-5093): "Trigger: An enemy marked by you makes an attack that does not include you as a target. Target: The triggering enemy." **Warden's Grasp** (power-5094): "Immediate Reaction, Close burst 5. [...] Target: The triggering enemy in the burst."
- **Disruptive Strike** (Ranger 3, power-1416): "Trigger: You or an ally is attacked by a creature. Target: The attacking creature. [...] The target takes a penalty to its attack roll for the triggering attack equal to 3 + your Wisdom modifier."

**(b) Target = the protected creature; the attacker is only "the triggering attack".**
- **Interposing Shield** (Fighter 16, power-1156): "Immediate Interrupt, Melee 1. Trigger: An ally adjacent to you is hit by an attack. Target: The triggering ally. Effect: The target gains a +2 power bonus to AC and Reflex against the triggering attack."
- **Shield Block** (Fighter 8, Essentials, power-12677): "Trigger: An attack hits or misses you or an ally adjacent to you and deals damage. Target: The character hit or missed by the triggering attack. Effect: The damage dealt to the target is reduced by 1d10 + your Constitution modifier."
- **Channeling Shield** (Swordmage 2, power-5740): "Immediate Interrupt, Close burst 10. Trigger: An attack hits you or an ally within 10 squares of you. Target: The creature hit by the triggering attack. Effect: You reduce the damage the target takes from the triggering attack by 5 + your Constitution modifier."

**(c) No Target line at all: Trigger and Effect in prose.**
- **Guardian's Counter** (power-14149): "Immediate Interrupt, Close burst 2. Trigger: An ally within 2 squares of you is hit by an attack and you are not included in the attack. Effect: You and the ally shift up to 2 squares as a free action, swapping positions. You become the target of the triggering attack, in place of the ally. After the attack is resolved, you can make a basic attack against the attacker."
- **Combat Challenge** (power-7419): "Immediate Interrupt, Melee. Effect: Whenever an enemy marked by you is adjacent to you and shifts or makes an attack that does not include you as a target, you can make a melee basic attack against that enemy."
- **Battle Guardian** (Essentials, power-12661): "Opportunity Action, Personal. Trigger: An enemy subject to your defender aura either shifts or makes an attack that targets an ally of yours but not you [...]. Effect: You make a melee basic attack against the triggering enemy."
- **The marks**: the *mark* has a Target line ("Target: One creature in the burst"), and the protective reaction is buried inside the mark's Effect with no target of its own. **Aegis of Shielding** (power-3323): "If that attack hits and the marked target is within 10 squares of you, you can use an immediate interrupt to reduce the damage dealt by that attack to any one creature by an amount equal to 5 + your Constitution modifier." **Divine Challenge** (power-805, 2010 revision): "the target takes radiant damage the first time each round when it targets any of your allies with an attack power that doesn't include you as a target."

**What the Target line names for a protect-an-ally reaction:** whichever creature the power's main effect lands on. Punish-the-attacker powers name the enemy; reduce-the-damage powers name the ally; swap and redirect powers name nobody. A second creature is reached with a role word ("the ally", "the triggering attack", "the attacker") and is not a target.

**Does a triggered power need line of sight to its trigger?** Not by any general rule I could read. Only the opportunity attack says "you can see your enemy". The Aegis of Shielding interrupt has a range (10 squares) and no sight or line-of-effect clause of its own; whether the general line-of-effect rule reaches an effect with no stated origin square and no Target line is not answered in the text I read.

### Trouble players reported

- [checked] EN World, "Struggling with Swordmage // Questions about monster", Lord Zardoz, Apr 23, 2013, #25: "Your best option may be to simply experiment with various ways of interrupting line of sight. If the Swordmage cannot see the attacker, then the power probably cannot be used." (https://www.enworld.org/goto/post?id=6120945) Note the "probably": the poster is guessing, because the power does not say.
- [read] The official fix history shows where the wording failed: Divine Challenge carries "Update (11/17/2010): The power has been revised for clarity and ease of use" (power-805); Guardian's Counter carries "Update (6/28/2011)".
- [lead] EN World threads on interrupt timing ("Rules on interrupts of movement", "Immediate Interrupts: Rule vs Etiquette?", "What was the final clarification for the timing issues of Divine Challenge and Divine Sanction?" https://www.enworld.org/threads/what-was-the-final-clarification-for-the-timing-issues-of-divine-challenge-and-divine-sanction.583334/). Not opened: 4e's recorded arguments, in the search results, are about *timing* (interrupt or reaction, before or after the hit), not about who the target is.

---

## 2. Pathfinder 2e (Remaster first, legacy beside it)

### Rules text [read]

- **Targets** (Player Core p.426, https://2e.aonprd.com/Rules.aspx?ID=2380): "Some effects require you to choose specific targets. Targeting can be difficult or impossible if your chosen creature is undetected by you, if the creature doesn't match restrictions on who you can target, or if some other ability prevents it from being targeted. [...] Some effects target or require an ally, or otherwise refer to an ally. This must be someone on your side [...]. You don't count as your own ally."
- **Targets (spells)** (Player Core p.300, https://2e.aonprd.com/Rules.aspx?ID=2240): "The target must be within the spell's range, and you must be able to see it (or otherwise perceive it with a precise sense) to target it. At the GM's discretion, you can attempt to target a creature you can't see".
- **Line of effect** (Player Core p.426, https://2e.aonprd.com/Rules.aspx?ID=2382): "When creating an effect, you usually need an unblocked path to the target of a spell, the origin point of an effect's area, or the place where you create something with a spell or other ability. This is called a line of effect. You have line of effect unless a creature is entirely behind a solid physical barrier. Visibility doesn't matter for line of effect [...]. Usually a 1-foot-square gap is enough to maintain a line of effect, though the GM makes the final call."
- **Line of sight** (Player Core p.427, https://2e.aonprd.com/Rules.aspx?ID=2383): "Some effects require you to have line of sight to your target. As long as you can precisely sense the area [...] and it is not blocked by a solid barrier [...], you have line of sight."
- **Reactions** (Player Core p.15, https://2e.aonprd.com/Rules.aspx?ID=2023): "You only get one reaction per encounter round, and you can use it only when its specific trigger is fulfilled." **Limitations on Triggers** (p.414, ID=2339): "The triggers listed in the stat blocks of reactions and some free actions limit when you can use those actions."
- **A rule that you must perceive the trigger: it exists only for Ready.** GM Core p.27 (https://2e.aonprd.com/Rules.aspx?ID=2553): "the trigger must be something that happens in the game world and is observable by the character, rather than a rules concept that doesn't exist in-world." No such sentence exists for reactions in general (I read Reactions, Reactions in Encounters, Limitations on Triggers; none has it).
- Instead, sight is written **into single triggers**: Nimble Dodge (https://2e.aonprd.com/Feats.aspx?ID=4916): "Trigger: A creature targets you with an attack and you can see the attacker". Cringe (https://2e.aonprd.com/Feats.aspx?ID=5612): "Trigger: A creature you are aware of critically succeeds on a Strike against you".

### The champion's reactions [read]

PF2e reactions have **no Target line**: Trigger, then Effect.

- **Retributive Strike**, legacy (Core Rulebook p.107, https://2e.aonprd.com/Actions.aspx?ID=5): "Trigger: An enemy damages your ally, and both are within 15 feet of you. You protect your ally and strike your foe. The ally gains resistance to all damage against the triggering damage equal to 2 + your level. If the foe is within reach, make a melee Strike against it."
- **Retributive Strike**, Remaster (Player Core 2 p.92, https://2e.aonprd.com/Actions.aspx?ID=2807): "Trigger: An enemy damages your ally, and both are in your champion's aura. [...] If the enemy is within reach, make a melee Strike against it."
- **Champion's Aura** (Player Core 2; foundryvtt/pf2e `class-features/champions-aura.json`): "You're surrounded by an aura in a 15-foot emanation. [...] This aura is used as the range for your champion's reaction".
- **Glimpse of Redemption**, Remaster (https://2e.aonprd.com/Actions.aspx?ID=2810): same trigger. "The enemy must choose to repent or refuse [...]. Repent: The ally is unharmed by the triggering damage. Refuse: The ally gains resistance [...]. After the damaging effect is applied, the enemy becomes enfeebled 2 until the end of its next turn."
- **Liberating Step**, Remaster (https://2e.aonprd.com/Actions.aspx?ID=2808): "Trigger: An enemy damages, grabs, or restrains your ally, and both are in your champion's aura. [...] the ally can then Step as a free action if it's able to move."
- **Flash of Grandeur** (foundryvtt/pf2e `actions/class/champion/flash-of-grandeur.json`): same trigger; "Until the end of your next turn, the attacker is affected by Revealing Light."
- **Shield Block** (https://2e.aonprd.com/Feats.aspx?ID=5212): "Trigger: While you have your shield raised, you would take physical damage (bludgeoning, piercing, or slashing) from an attack."
- **Reactive Strike** (Player Core): "Trigger: A creature within your reach uses a manipulate action or a move action, makes a ranged attack, or leaves a square during a move action it's using. [...] Make a melee Strike against the triggering creature."
- **Guardian, Intercept Attack** (Battlecry!, `actions/class/guardian/intercept-attack.json`): "Trigger: An ally within 10 feet of you takes physical damage. You can Step, but you must end your movement adjacent to the triggering ally. You take the damage instead of the triggering ally."

**What the Target line names for a protect-an-ally reaction:** there is none. Both creatures are roles in the Trigger ("an enemy", "your ally"), and the effect speaks of "the ally", "the enemy", "the triggering damage". Only the embedded Strike targets anything by the general rules.

### Trouble players reported [checked: every post below was read on its page]

**"Champions reactions targets"**, https://paizo.com/threads/rzs431wu
- Aswaarg, May 26, 2020: "I have a Paladin player who, from time to time, tries to apply his retributive strike to an ally that is in his 15 feet range, but is not in his line of sight (or line of effect). [...] The ability does not say how it works, only the triggers (no targets specified for example). [...] My ruling is the ally is a target and the player needs to see the target [...] and needs to have line of effect."
- thenobledrake, May 26, 2020: "pretty sure needing line of effect is the default assumption of the rules (though needing line of sight only occurs when the rules say 'you can see' or the like)".
- Albhander, May 28, 2020: "for damage reduction the requirement is clear, that both the ally and the enemy are within 15 feet [...] If you need to see the enemy and ally I would specify it as they do in other reactions".

**"do you need to be aware of a trigger to use a reaction?"**, https://paizo.com/threads/rzs435ec (the example is Glimpse of Redemption behind a pillar)
- Lightning Raven, Aug 21, 2020: "I would say no because there's no indication whatsoever that your character would know they needed to protect the ally in that specific moment. Line of Effect and Line of Sight both impede its use."
- Claxon, Aug 21, 2020: "In general, I think if you're not aware of the actions an enemy is taking, you can't react to it. I'm not sure if that explicitly encapsulated in the rules though."
- The Gleeful Grognard, Aug 21, 2020: "RAW with glimpse of redemption you don't need to know, see or even hear the event. But I wager that is a pretty loose reading for RAI."
- Tarpeius, Aug 21, 2020: "The rules on reactions include no requirement that the (re)actor have awareness. Further, there are reaction triggers that do require awareness, like kobold Cringe". Later: "You lack line of effect with the wall there. It's necessary for targeting, even with awareness, unless the GM says otherwise."
- Falco271, Aug 21, 2020: "with the champion's reaction, you only need to know that your ally was damaged. [...] You don't have to know that part, but the magic will only work if the attacker is within range."
- mrspaghetti, Aug 21, 2020: "Unless a particular reaction had text to the contrary, I'd say you need to be aware of a trigger to use a reaction to that trigger."
- Four readings in one thread: needs sight; needs awareness only; needs line of effect only; needs nothing.

**"Reactions while blind"**, https://paizo.com/threads/rzs6v0c4 (after the Remaster's aura wording, so the aura did not end the question)
- Seyonne2450, Aug 22, 2025: "My GM ruled that you can't react while blind, so he did not let me use my retributive strike, even though both enemy and ally was in my aura."
- TheFinish, Aug 22, 2025: "Your Reaction does not target your ally, per se, and so it cannot fail. The Strike you make as part of Retributive Strike though does target the enemy so that one can fail if you don't pass the flat check. [...] Compare for example with a reaction like Nimble Dodge where the trigger specifies you must be able to see the attacker. [...] But Retributive Strike doesn't have this restriction, so it works fine." Also: "you don't need the enemy to be in your reach for you to use Retributive Strike. [...] You only get to strike if the enemy is in Reach, but the damage reduction happens regardless."
- NorrKnekten, Aug 23, 2025: "If the enemy was entirely Undetected [...] the player have no clue if the attacking creature is in the aura or not."
- Finoan, Aug 23, 2025: "The specific rules for the Ready action and reaction are that the trigger must be observable in-game by the character. But that does not get upgraded to a general rule for all reactions. That is a rule for Ready specifically."

**"How do you use reactions when you can't know the trigger?"**, https://paizo.com/threads/rzs5hzix
- Ravingdork, Nov 29, 2024: "Over the years I've seen several reactions that have triggers that aren't known to players. How is one expected to use such abilities?"
- Finoan, Nov 29, 2024: "There are literally dozens of these types of reactions. Opportune Riposte: Does your character know the difference between a failed attack and a critically failed attack? [...] The game does require a certain amount of meta-gaming in order to function."

**"What the Heck Happens During a Champion's React?!"**, https://paizo.com/threads/rzs439yd
- Firehazurd, Jan 5, 2021: "these abilities only have the 'Champion' trait and not a lot of guidance is given for what is actually happening. [...] does that mean a Champion can do this reaction even if they're neck deep in cement? Even if they're blind?"
- A reply in the same thread (poster's name not confirmed by me): "For being blind, you still need line of sight to the targets required by the ability, meaning unless you know their location (being hidden or not), you can't target them with the ability." This contradicts TheFinish above.

**Reach** (the "within 15 feet of whom" issue): the text itself answers it (both within 15 feet of *you*; the Strike only "if the foe is within reach"), and the Ranged Reprisal feat exists to patch the gap: "if the foe that triggered your reaction is within 5 feet of your reach but not in your reach, as part of your reaction you can Step" (quoted in https://paizo.com/threads/rzs43141, Zanroth, May 5, 2020 [checked]; the feat's own page not opened).

[lead] Other thread titles from the search, not opened: "Paladin's retributive strike and map", "Retributive strike timing", "Requesting ruling to test new Paladin's Reactions: are you your own ally?", "Subtle trait and reactive strike", "Conceal Spell vs Reactive Strike".

---

## 3. Draw Steel (MCDM)

### Rules text [read] (data-rules-md, `Chapters/Classes.md` and `Chapters/Combat.md`)

- **Format of every ability:** name and flavor; a first row with Keywords on the left and the Type on the right (Main action, Maneuver, Triggered, Free triggered); a second row with Distance and Target; then Trigger (triggered abilities only), Power Roll or Effect, and a "Spend" line.
- **Trigger:** "If an ability requires a triggered action or a free triggered action to use, a 'Trigger' entry is part of the ability. For example, the trigger for the tactician's Parry ability is: 'A creature deals damage to the target.' A tactician can use their Parry ability only when that specific triggering event occurs."
- **Distance:** "An ability's 'Distance' entry [...] indicates how close you need to be to a creature or object to affect that target with the ability."
- **Target:** "The 'Target' entry of an ability [...] notes the number of creatures, objects, or both who can be targeted by that ability. You can always affect fewer targets than the number indicated by this entry." "Self: If an ability targets 'self,' it can affect only the creature using the ability. Your own abilities can affect you only if they target 'self.'" "Ally: [...] it can affect only willing creatures who are friendly to the creature using the ability."
- **Line of effect:** "To target a creature or object with an ability or effect, including making a strike against them, you must have line of effect to that target. If any solid object, such as a wall or pillar, completely blocks the target from you, then you don't have line of effect. [...] imagine drawing a straight line from any corner of the space you occupy on an encounter map to any corner of a space the target occupies."
- **Sight is not a separate requirement.** Concealment (Combat.md): "Even if you have line of effect to such a target, a creature or object has concealment from you if you can't see or otherwise observe them. You can target a creature or object with concealment using a strike, provided they aren't hidden". Hidden (Tests.md): "While you are hidden from another creature, the creature can't target you with abilities that don't have the Area keyword."
- **Triggered actions** (Combat.md): "You can use one triggered action per round, either on your turn or another creature's turn, but only when the action's trigger occurs." A surprised or unconscious creature can't take them. **I found no sentence that the reactor must perceive the trigger** (searched Classes.md and Combat.md for "triggered action"; not a full read of both chapters).

### Protective triggered actions [read] (`Abilities/<class>/...`)

**Shape 1: the Target is the protected creature, and the Trigger is written about "the target".** The attacker is "a creature" in the Trigger and "the triggering creature" in the Effect; it is never a target.
- **Parry** (Tactician): "Melee, Weapon | Triggered | Melee 2 | Self or one ally. Trigger: A creature deals damage to the target. Effect: You can shift 1 square. If the target is you, or if you end this shift adjacent to the target, the target takes half the damage."
- **Intercede** (Censor, 9 Wrath): "Ranged 10 | One ally. Trigger: A creature makes a strike against the target. Effect: The target is unaffected by the strike and you become the target instead, even if you aren't a valid target for it."
- **Instant Retaliation** (Tactician, 9 Focus): "Melee 1 | One ally. Trigger: A creature deals damage to the target. Effect: The target takes half the damage. You then make a power roll against the triggering creature. [...] dazed (save ends)". The attacker gets a power roll and a condition without being on the Target line.
- **Riposte** (Troubadour): "Melee 1 | Self or one ally. Trigger: The target takes damage from a melee strike. Effect: The target makes a free strike against the creature who made the triggering strike."
- **Word of Judgment** (Conduit): "Ranged 10 | One ally. Trigger: The target would take damage from an ability that uses a power roll. Effect: The power roll takes a bane against the target."
- **My Life for Yours** (Censor): "Ranged 10 | Self or one ally. Trigger: The target starts their turn or takes damage."
- **Skin Like Castle Walls** (Elementalist), **Repel** (Talent): same shape. **Pain of Your Own Making** (Censor): "The effect ends on the target and is applied to the creature who imposed the effect on them. That creature also takes damage".

**Shape 2: the Target is the attacker; the ally is "the triggering ally".**
- **No Dying on My Watch** (Tactician, 5 Focus): "Ranged, Strike, Weapon | Triggered | Ranged 5 | One enemy. Trigger: The target deals damage to an ally. Effect: You move up to your speed toward the triggering ally [...]. The triggering ally can spend a Recovery and gains 5 temporary Stamina for each enemy you came adjacent to during the move. You then make a power roll against the target. [...] the target is frightened of the triggering ally (save ends)". This single card moves the reactor, gives the ally a heal and temporary Stamina, and puts a condition on the attacker: one Target line (the enemy), one role word for the other creature.
- **Overwatch** (Tactician): "Ranged 10 | One creature. Trigger: The target moves."

**A third creature picked in the Effect:** Lines of Force (Fury): "Self or one creature. Trigger: The target would be force moved. Effect: You can select a new target of the same size or smaller within distance to be force moved instead."

**What the Target line names for a protect-an-ally reaction:** by default the protected creature ("Self or one ally"), and the Trigger is phrased as something that happens *to the target*, so the Target line and the Trigger cannot disagree. When the card is mainly an attack on the offender, the Target is the enemy and the ally becomes "the triggering ally". Distance and line of effect are measured to the Target only; the second creature has no stated range or line requirement (Parry halves damage from an archer 20 squares away).

### Trouble players reported

None found: one search returned no forum or FAQ thread on triggered-action targets. Reddit and the MCDM Discord were not read. [lead] The search summary says the backer-packet Parry had a different trigger ("a creature making a Weapon attack against the target", steelcompendium.io backer page, not opened), so the "to the target" phrasing was kept across versions while the event changed.

---

## 4. D&D 5e (2014 and 2024)

### Rules text [read]

- **Targets**, 2014 (SRD 5.1, https://5thsrd.org/spellcasting/casting_a_spell/): "A typical spell requires you to pick one or more targets to be affected by the spell's magic. A spell's description tells you whether the spell targets creatures, objects, or a point of origin for an area of effect". "A Clear Path to the Target: To target something, you must have a clear path to it, so it can't be behind total cover."
- **Total cover**, 2014 (https://5thsrd.org/combat/cover/): "A target with total cover can't be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect."
- **Target**, 2024 rules glossary (SRD 5.2.1): "A target is the creature or object targeted by an attack roll, forced to make a saving throw by an effect, or selected to receive the effects of a spell or another phenomenon." The 2014 rules had no such definition.
- **Reaction**, 2024 glossary: "A Reaction is a special action taken in response to a trigger defined in the Reaction's description."
- **Ready** (both editions): "First, you decide what perceivable circumstance will trigger your reaction." As in PF2e, "perceivable" is a rule of Ready only.
- 5e has **no Target line and no Trigger line**. A reaction's trigger is prose in the feature, or in a spell's Casting Time. Sight is written into each trigger:
  - **Shield** (2014): "1 reaction, which you take when you are hit by an attack or targeted by the magic missile spell". Range: Self.
  - **Hellish Rebuke** (2014): "1 reaction, which you take in response to being damaged by a creature within 60 feet of you that you can see".
  - **Counterspell** (2014): "1 reaction, which you take when you see a creature within 60 feet of you casting a spell". 2024: "...casting a spell with Verbal, Somatic, or Material components".
  - **Feather Fall** (2014): "1 reaction, which you take when you or a creature within 60 feet of you falls" (no "see").
  - **Protection** fighting style, 2014 (https://5thsrd.org/character/classes/fighter/): "When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield."
  - **Protection**, 2024 (https://www.aidedd.org/feat/protection): "When a creature you can see attacks a target other than you that is within 5 feet of you, you can take a Reaction to interpose your Shield if you're holding one. You impose Disadvantage on the triggering attack roll and all other attack rolls against the target until the start..." (the rest was cut in my read).
  - **Interception**, 2024 (https://www.aidedd.org/feat/interception): "When a creature you can see hits another creature within 5 feet of you with an attack roll, you can take a Reaction to reduce the damage dealt to the target by 1d10 plus your Proficiency Bonus."
  - **Sentinel**, 2024 (https://www.aidedd.org/feat/sentinel): "Guardian. Immediately after a creature within 5 feet of you takes the Disengage Action or hits a target other than you with an attack, you can make an Opportunity Attack against that creature." (no "see" here; the Opportunity Attack rule supplies it).
  - **Opportunity Attack**, 2024: "You can make an Opportunity Attack when a creature that you can see leaves your reach".
- In Protection and Interception **"the target" means the attacker's target** (the ally), not the reactor's. The reactor has no target; the creature it must see is the attacker; the ally only has to be within 5 feet.

### Sage Advice [read]

2024 Sage Advice Compendium (https://www.dndbeyond.com/sources/dnd/sae/sage-advice-compendium):
- "Can a Blinded creature make an Opportunity Attack? An Opportunity Attack is triggered when a creature that you can see leaves your reach. If you can't see an enemy, you can't make an Opportunity Attack against it."
- "A use of Uncanny Dodge works against only one attack, since it expends your Reaction, and only if you can see the attacker."
- "If you can't see something, it's not within your line of sight. Speaking of 'line of sight,' the game uses the English meaning of the term, which has no special meaning in the rules."
- On Telekinesis from inside Resilient Sphere: "you can't affect a new target. The sphere provides Total Cover that stops you from targeting anything outside it."

2021 Sage Advice Compendium v2.7 (PDF, https://media.wizards.com/2020/dnd/downloads/SA-Compendium.pdf):
- Subtle Spell against Counterspell: "it's impossible for anyone to perceive the spell being cast. So, since you can't see the casting, counterspell is of no use."
- Twinned Spell, the closest thing 2014 had to a definition of targeting, given as a list of what disqualifies a spell: "The spell has a range of self. The spell can target an object. The spell allows you to choose more than one creature to be affected by it [...]. The spell can force more than one creature to make a saving throw before the spell's duration expires. The spell lets you make a roll of any kind that can affect more than one creature".

**What the Target line names for a protect-an-ally reaction:** nothing; there is no line. The word "target" in the feature points at the *attacker's* victim.

### Trouble players reported

- [checked] EN World, "D&D 5E (2014) Spells, Targetting, and Glass Windows", Reynard, Jul 13, 2024, #13: "Everything is an exception. Half the spells say 'a target you can see' and the rest don't. It's sloppy." Same poster, #11 (quoted as "Reynard said" in #12): "I just don't understand why spells don't have an entry that just tells you. Targeting: line of sight and line of effect / or / Targeting: line of sight / or / Targeting: any targeting sense". Voadam, #12: "the targeting entry sets up a general rule of line of effect required and barriers that provide total cover block line of effect at the barrier. Individual spells could specify an exception [...] Teleporting seems to target yourself though not the destination." (https://www.enworld.org/goto/post?id=9404637)
- [lead] D&D Beyond, "Wall of Force and Counterspell" (https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/39671-wall-of-force-and-counterspell): the search summary says posters note that Counterspell "lists no target, but does mention creature", and argue whether a caster seen through a Wall of Force (total cover, clear view) can be counterspelled. Page opened, quote not located.
- [lead] The same search summary: a Sage Advice ruling that "a closed window does actually block targeting, even though you can see through the window", disputed by posters. Not found in the two compendiums I read.
- [lead] D&D Beyond threads "War Caster and targeting", "True Strike and overthinking it": arguments over whether a creature in an area, or the point of origin of a Self-range spell, is a "target". Not opened.
- Not found: a thread on Protection and an unseen attacker. The EN World thread "Thoughts about the Protection Fighting Style" (Jan 2020, read) is about its strength, not its wording.

---

## 5. Lancer, ICON, 13th Age (brief)

### Lancer [read] (massif-press/lancer-data, `lib/actions.json`, `systems.json`, `frames.json`, `talents.json`)

Reactions are data with two fields, `trigger` and `detail` (the effect). No target field.
- **Overwatch**: "Trigger: A hostile character starts any movement (including BOOST and other actions) inside one of your weapons' THREAT. [...] immediately use that weapon to SKIRMISH against the triggering character as a reaction, before they move."
- **Brace**: "Trigger: You are hit by an attack and damage has been rolled."
- **Tactical Simulation** (Swallowtail): "Trigger: An allied character in line of sight takes damage from another character in line of sight. Effect: Roll 1d6. On 4+, [...] your ally gains Resistance to all damage dealt by the attack and may teleport up to 3 spaces". **Both creatures are given their own sight requirement inside the trigger.**
- **Flash Lock** (Flash Anchor): "Trigger: You or an allied character in Sensors and line of sight is pushed, pulled, knocked back or knocked Prone. [...] The movement or status is prevented, and the target gains Immunity". Range and sight to the ally only.
- **Interdiction Point** (Stasis Bolt): "Trigger: You or an allied character within range 5 are targeted by a ranged attack." No sight clause.
- **Mag Parry** (Black Witch): "Trigger: An incoming attack will deal Kinetic Damage to you or an adjacent allied character".
- **Intercede** (Bonded talent; read in the 2026-11-14 pass): "You are adjacent to your Bondmate [...] and they take damage from a source within your line of sight. You may take the damage instead." Sight to the *source*, adjacency to the ally.
- **Unleash SCYLLA**: "Skirmish against the character that triggered the reaction."

**Target of a protect-an-ally reaction:** none named. The trigger carries each creature's range and sight condition separately, card by card; cards differ (sight to both, to the ally only, to the source only, to neither). The general Lancer rule on reactions and sight in the core book was not available in the data files (not read).

### ICON 1.5 [read] (zengulus/icon, `src/content/generated/icon-1.5.json`)

- "Some abilities give you interrupts, which are abilities that trigger under certain circumstances and 'interrupt' whatever is going on. Each interrupt can only be used a certain number of times a round, and you can only use one interrupt on any turn".
- "Targeting: Abilities may specify targets: Self, Ally, Foe, Characters, Others, Object, Space, or any combination of these." "You can only use abilities against characters in range and line of sight, unless specified. Line of sight means you can both see and interact with the character."
- Interrupts are "Interrupt N / Trigger / Effect": **Heroic Intervention** (Bastion): "Interrupt 1. Trigger: A foe targets your ally with an ability. Effect: You soar into the air, removing yourself from the battlefield, then return in any space in the aura. Adjacent foes take 2 damage." **Dire Parry** (Knave): "Interrupt 1. Trigger: A foe targets an ally in range 2 with an ability. Effect: Gamble, then deal that much damage to your foe."

**Target of a protect-an-ally interrupt:** none named; the ally is chosen beforehand by a stance or an aura ("choose an ally in range 4. That ally gains aura 1"), which removes the choice at reaction time.

### 13th Age 1e [read] (13vaults, `content/1e/rules/combat-rules.mdx`, `classes/fighter.mdx`, `classes/paladin.mdx`)

- "Interrupt Actions: You can use one interrupt action when it's not your turn. You can't use another one until the end of your next turn."
- **Skilled Intercept** (Fighter): "Once per round as a free action, roll a normal save (11+) to intercept an enemy who is moving to attack one of your nearby allies. [...] The moving enemy makes its attack with you as a target instead."
- **Bastion** (Paladin; quoted in the 2026-11-14 pass): "Once per battle when a nearby ally is hit by an attack, you can choose to lose hit points equal to half of that damage, and have your ally take only half of the damage instead."

**Target of a protect-an-ally power:** none named. With no grid and no line-of-sight rule in the combat chapter (no match for "line of sight" in it), "nearby" is the whole requirement.

No player trouble searched for these three.

---

## 6. Games that separate "target" from "affected"

- **Magic: The Gathering** [read] (Comprehensive Rules, https://yawgatog.com/resources/magic-rules/): "115.1. Some spells and abilities require their controller to choose one or more targets for them. The targets are object(s) and/or player(s) the spell or ability will affect. These targets are declared as part of the process of putting the spell or ability on the stack." "115.1a. An instant or sorcery spell is targeted if its spell ability identifies something it will affect by using the phrase 'target [something]'". "115.10. Spells and abilities can affect objects and players they don't target. In general, those objects and players aren't chosen until the spell or ability resolves." "115.10a. Just because an object or player is being affected by a spell or ability doesn't make that object or player a target of that spell or ability. Unless that object or player is identified by the word 'target' in the text of that spell or ability, or the rule for that keyword ability, it's not a target."
- **Gloomhaven** [read, a rules reference site, not the rulebook itself] (https://rules.dized.com/gloomhaven/rule/attack-actions/targeted-definition): "An ability is considered targeted only if it says 'Target' or 'Attack'".
- **Frosthaven official FAQ** [read] (https://cephalofairgames.github.io/frosthaven-faq): the publisher uses "targeted" as a category with consequences and had to patch it: "Rulebook p33 - Recover is not a targeted effect. All references to 'targeted' are also changed to 'recovering'"; "Line of sight is still required from your summon, as Heal is a targeted ability"; "Loot isn't a targeted ability".
- **Draw Steel** (section 3) does the same thing without saying so: the Target line names one creature, and "the triggering creature" / "the triggering ally" is affected without being a target.
- **4e** (section 1) likewise: Knightly Intercession targets the enemy and changes what happens to "the ally".

---

## 7. Designer commentary on templating reactions

Little found.
- [read, opening only] SlugFest Games, "RulesFest: Templating and Why it's Useful" (https://slugfestgames.com/?p=1469): "in most card games that have text on the cards, the designers make some efforts toward consistency when wording the cards. Specifically, if two cards are meant to function the same way, they are worded the same way." A card game, and not about reactions.
- [read] 4e's own rule for an untyped trigger is a piece of templating guidance (glossary-120): "If an effect has a trigger but is neither an immediate action nor an opportunity action, assume that it behaves like an immediate reaction, waiting for its trigger to completely resolve. However, ignore this guideline when the effect has to interrupt its trigger to function."
- [lead] Solasta dev diary "Reaction System" (https://www.solasta-game.com/news/7-dev-diary-1-reaction-system), a video game's handling of 5e reactions. Not opened.
- Not found: a designer essay or design diary on how to word a reaction's trigger and target (MCDM, Paizo, Massif).

---

## Patterns

How games answer "who is the target of a reaction with two creatures in its trigger":

**P1. The Target line names the protected creature; the Trigger is written about "the target"; the attacker is a role word.**
Draw Steel (Parry, Intercede, Instant Retaliation, Riposte, Word of Judgment); 4e (Interposing Shield "Target: The triggering ally", Shield Block, Channeling Shield). Range and line of effect are owed to the ally only. The attacker can still be hit by the Effect ("make a power roll against the triggering creature") without being a target. *Recorded confusion: none found for either game.*

**P2. The Target line names the attacker; the ally is "the ally" / "the triggering ally" and is affected without being a target.**
4e (Knightly Intercession, Mind Spike, Warden's Fury, Disruptive Strike); Draw Steel (No Dying on My Watch). Used when the card is mainly a punishment. *Recorded confusion: none found on the target; 4e's arguments were about timing.*

P1 and P2 are one rule seen from two sides: **one Target line, chosen by where the card's main effect lands, and a fixed role word for the other creature.** Both games use both.

**P3. No Target line: Trigger and Effect in prose, both creatures as roles, sight and line of effect left to the general rules.**
PF2e (all champion reactions, Intercept Attack), 4e (Guardian's Counter, Combat Challenge, the marks), 13th Age, ICON. *This is where the recorded confusion is.* PF2e's champion produced the same question in 2020, 2021 and 2025, with four incompatible answers (needs sight, needs awareness, needs line of effect, needs nothing), because the general rules speak of "targets" and the card has none: "The ability does not say how it works, only the triggers (no targets specified for example)."

**P4. The sense requirement is written into each trigger ("a creature you can see").**
5e (Protection, Interception, Hellish Rebuke, Counterspell, Opportunity Attack), PF2e on a few cards (Nimble Dodge, Cringe), Lancer (Tactical Simulation: "An allied character in line of sight takes damage from another character in line of sight"), 4e's opportunity attack. Each card is clear alone. The cost is recorded twice: cards that omit the phrase are read as "then it isn't needed" (TheFinish on Retributive Strike against Nimble Dodge), and players call the mix sloppy ("Half the spells say 'a target you can see' and the rest don't").

**P5. Only the word "target" targets; being affected is not being targeted.**
Magic (rule 115.10a), Gloomhaven ("targeted only if it says 'Target' or 'Attack'"). Stated as a rule, where Draw Steel and 4e only do it by habit. Frosthaven's FAQ shows the upkeep it needs: each ability type must be declared targeted or not (Heal yes, Loot no, Recover changed).

**P6. A zone replaces the per-creature range.**
PF2e Remaster ("both are in your champion's aura"), 4e Essentials (defender aura), ICON (the ally carries an aura). It settled "within 15 feet of whom" and reach; it did not settle sight or line of effect (the 2025 "Reactions while blind" thread is after the aura wording).

**A requirement to perceive the trigger exists as a general rule in none of the games read.** PF2e and 5e have it only for Ready ("observable by the character", "perceivable circumstance"); PF2e players noticed and argued over whether it extends ("That is a rule for Ready specifically"). Draw Steel reaches a similar result through targeting instead: a hidden creature can't be targeted, and an unseen but not hidden one can.

**Least recorded confusion:** P1/P2 as Draw Steel and 4e print them (a Target line on every triggered card, the trigger phrased around "the target", a fixed word for the other creature). **Most:** P3 in PF2e. Caveat: Draw Steel is recent and its main forums were not read; 4e's forums are old and only partly searchable.

---

## Not found / not opened

- 4e: the Player's Handbook section on choosing targets and "Seeing and Targeting" (PHB p.272-273) is not in the Compendium crawl; the definition of "target" itself was not found as a glossary entry. Shield Bearer / Guardian paragon powers: not looked up. Divine Challenge's pre-2010 text: not in the crawl.
- 4e forum trouble on Aegis of Shielding and line of effect: one search, nothing relevant; the EN World timing threads are leads.
- PF2e: no official Paizo ruling or errata on sight or line of effect for the champion's reaction was found (the threads say none exists; not verified against the errata pages). Ranged Reprisal's own page not opened. The "you are your own ally?" playtest thread not opened.
- Draw Steel: no player trouble found; Reddit, Discord and the MCDM forums not read. Classes.md and Combat.md were searched, not read end to end.
- 5e: the 2024 Player's Handbook text of Protection after "until the start..." (cut in my read); the D&D Beyond Wall of Force thread (opened, quote not located); the "closed window" Sage Advice ruling (not in either compendium read; a lead); Crawford's tweets on what counts as a target (not searched: sageadvice.eu not tried).
- Lancer: the core book's general rule on reactions and line of sight (only the data files were read). ICON 2.0: not read (1.5 only). 13th Age 2e: not read.
- Gloomhaven / Frosthaven rulebooks themselves: not read (a reference site and the official FAQ only).
- Designer essays on templating reactions: none found in two searches.
- Refused sites, left alone: Reddit, Giant in the Playground, RPG.net.
