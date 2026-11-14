# Research D: paladin-likes outside D&D / Pathfinder (Censor, Lancer defenders, ICON Stalwarts, Nimble Oathsworn, Fabula Ultima Guardian)

Date: 2026-11-14. Question: how do other grid tactics games build a "soft tank, soft support, soft nova" holy warrior, and what do players say about it?

## Read this first: what this file rests on

- **This session's network blocked almost every website.** steelcompendium.io, reddit, EN World, RPG.net, lancer.wiki.gg, blogs: all refused. Only GitHub was reachable.
- **Rules below were read in full from GitHub copies of the rules text** (cloned and read locally). They are exact. Five data sources, about 25 files read.
- **Player opinion below was NOT read on the page.** It comes only from the search tool's summaries of its results. Every such line is tagged **[search summary, page not read]**. Treat it as a lead, not as a quote. No wording in it should be cited as a poster's words.
- **The search budget ran out** (shared limit) after about 17 searches. Several opinion questions got no search at all; they are listed under "Not covered".
- So the target of "18+ sources actually read" was **not met for opinion**: it was met only for rules files.

---

## 1. Draw Steel: the Censor (rules, read in full)

Source: Steel Compendium `data-md`, `Rules/Classes/Censor.md` (Draw Steel Heroes, source tag `mcdm.heroes.v1`), commit 79822d6 of 2026-03-26.

### 1.1 What the book says the class is

- "As a censor, you're at your best against the strongest foes. Your judgment terrifies heretics, stops enemies in their tracks, and even hurls them across the battlefield."
- The exact phrase "the Censor shuts down a single enemy" was **not found** in the class text. Not verified as MCDM's wording.
- Numbers: Might 2 and Presence 2 to start. Stamina 21 at level 1, +9 per level. **Recoveries: 12** (a search summary says this is the most of any class; not checked against all nine).

### 1.2 Wrath (the heroic resource)

- Start of an encounter: wrath equal to your **Victories**.
- Start of each of your turns: **+2 wrath** (flat, not rolled; 3 at level 7 "Focused Wrath"; 4 at level 10).
- "the first time each combat round that a creature judged by you [...] deals damage to you, you gain 1 wrath."
- "The first time each combat round that you deal damage to a creature judged by you, you gain 1 wrath." (2 at level 4, "Wrath Beyond Wrath".)
- All wrath is lost at the end of the encounter.
- So the income is 2 a turn for free, up to 4 a round if you and the judged creature are trading blows. **The class is paid for staying in a duel with its mark.**

Worked timeline, level 1, 0 Victories (my arithmetic from the rules above):

| Moment | Wrath | What it buys |
|---|---|---|
| Turn 1 start | 2 | signature only (plus 1-wrath Judgment riders) |
| Turn 1, after damaging the judged creature | 3 | a 3-wrath ability, but the main action is already used |
| Before turn 2, if the judged creature hurt you | 4 | |
| Turn 2 start | 6 | a 5-wrath ability |

With 3 Victories the same hero starts at 5 and can use a 5-wrath ability on turn 1.

### 1.3 Judgment (the mark), exact text

Maneuver, Ranged 10, one enemy.

- "The target is judged by you until the end of the encounter, you use this ability again, you willingly end this effect (no action required), or another censor judges the target."
- "Whenever a creature judged by you uses a main action and is within your line of effect, you can use a free triggered action to deal holy damage equal to twice your Presence score to them." (4 damage at level 1, every time it acts, no roll, no cost.)
- **On a kill:** "When a creature judged by you is reduced to 0 Stamina, you can use a free triggered action to use this ability against a new target."
- Spend 1 wrath for one of these free triggered actions (only one per trigger):
  - An adjacent judged creature starts to shift: you make a melee free strike and "their speed becomes 0 until the end of the current turn".
  - A judged creature within 10 makes a power roll: it takes a bane.
  - A judged creature within 10 uses an ability with a potency against one creature: the potency is reduced by 1.
  - You damage a judged creature with a melee ability: it is taunted by you until the end of its next turn.
- Taunted (Conditions/Taunted.md): "a double bane on ability rolls for any ability that doesn't target the creature who taunted them".

Design reading: the mark is **free to place, automatic in its damage, and its protection is bought one wrath at a time**. The same wrath pays for the big abilities, so every act of protection delays the burst.

### 1.4 Orders (subclass)

Judgment Order Benefit, the first time on a turn you judge a creature:

- **Exorcist:** teleport up to twice Presence squares toward the judged creature (no line of effect needed). Level 2: judged creatures can't Hide. Level 5: sees through disguises and illusions.
- **Oracle:** deal holy damage equal to twice Presence to the judged creature. Level 2 "It Was Foretold": one main action before anyone else at the start of an encounter. Level 5 "Prophecy": pre-rolled 2d10 results, one per Victory, to replace a power roll.
- **Paragon:** vertical pull the judged creature up to twice Presence squares. Level 2 "Lead by Example": allies gain flanking against any creature you are adjacent to. Level 5 "Stand Fast!": you and allies within 5 can spend 1d6 Stamina at the start of a turn to end a save-ends effect.

### 1.5 My Life for Yours (exact text)

Triggered action, Ranged 10, self or one ally.

- "**Trigger:** The target starts their turn or takes damage."
- "**Effect:** You spend a Recovery and the target regains Stamina equal to your recovery value."
- "**Spend 1 Wrath:** You can end one effect on the target that is ended by a saving throw or that ends at the end of their turn, or a prone target can stand up."
- A recovery value is one-third of the Stamina maximum (The Basics). So this is a heal of a third of the **Censor's** own Stamina, paid from the Censor's own daily pool, once a round (it takes the round's triggered action).
- It does **not** prevent or redirect the hit. The ally still takes it.
- Later upgrades (Life domain): level 4 "Blessing of Life" adds Presence to healing within range; level 7 "Font of Grace" gives 1 wrath usable only on this ability and "the target of My Life for Yours gains 10 temporary Stamina."

### 1.6 Signature abilities (at will), exact numbers

Tiers are ≤11 / 12-16 / 17+ on 2d10 + characteristic. M = Might, P = Presence.

| Ability | Reach | Damage | Rider |
|---|---|---|---|
| Back Blasphemer! | 2 cube within 1 | 2 / 4 / 6 holy | push 1 / 2 / 3 |
| Every Step... Death! | Ranged 10 | 5+P / 7+P / 10+P psychic | until the end of your next turn, 1 psychic per square the target willingly moves |
| Halt Miscreant! | Melee 1 | 2+M / 5+M / 7+M holy | slowed (save ends) if Presence potency beats them |
| Your Allies Cannot Save You! | Melee 1 | 3+M / 5+M / 8+M holy | each enemy adjacent to the target is pushed away up to Presence squares |

Note the pattern: **each signature isolates or pins one enemy**. None of them protects an ally directly.

### 1.7 Heroic abilities (the burst)

3 wrath:
- **Behold a Shield of Faith!** 3+M / 6+M / 9+M holy; until your next turn, enemies take a bane on ability rolls against you or any ally adjacent to you.
- **Driving Assault.** 3+M / 6+M / 9+M; push 1 / 3 / 5, then shift up to your speed toward the target.
- **The Gods Punish and Defend.** 5+M / 8+M / 11+M holy; you can spend a Recovery to heal yourself or an ally within 10.
- **Repent!** Ranged 10, 5+P / 8+P / 11+P holy; dazed (save ends) on potency.

5 wrath:
- **Arrest.** 6+M / 9+M / 13+M holy, grabbed; if the grabbed target strikes, spend 3 wrath to deal Presence holy damage and **change the target of the strike**.
- **Behold the Face of Justice!** 3+M / 5+M / 8+M; enemies within 2 of the target frightened, pushed 2, take Presence psychic.
- **Censored.** 2+M / 3+M / 5+M holy; "When a target who is not a leader or solo creature is made winded by this ability, they are reduced to 0 Stamina." (An execute: bring them to half, then they die.)
- **Purifying Fire.** 5+M / 9+M / 12+M holy; fire weakness 3 / 5 / 7 (save ends), and your abilities can deal fire to that target.

7 wrath (level 3), all are maneuvers creating a 2 aura until the end of the encounter:
- **Edict of Disruptive Isolation:** enemies take Presence holy at the end of your turns; +2d6 if judged or adjacent to another enemy.
- **Edict of Perfect Order:** an enemy using a Malice ability takes 3 x Presence holy; +2d6 if judged.
- **Edict of Purifying Pacifism:** an enemy making a strike takes 2 x Presence holy; +2d6 if judged.
- **Edict of Stillness:** an enemy leaving the area takes 2 x Presence holy; +2d6 if judged and moving willingly.

9 wrath (level 5): **Righteous Judgment** 10+M / 14+M / 20+M, and until the end of the encounter allies who damage your judged target gain 1 surge. **Shield of the Righteous** same damage, you and adjacent allies gain 10 / 15 / 20 temporary Stamina. **Gods Grant Thee Strength** (an ally ends a condition, gains 2 surges, shifts, uses a signature strike for free). **Orison of Victory** (maneuver, 1 burst, surges and a cleanse).

Paragon, level 6, 9 wrath: **Intercede** (free triggered, Ranged 10): "The target is unaffected by the strike and you become the target instead [...] You take half the damage from the strike, and the target gains 3 surges." **This is the only true "take the hit for you" in the class, and it costs 9 wrath, the price of the biggest attack.**

11 wrath (level 8): Excommunication, Hand of the Gods (10+M / 15+M / 21+M), Pillar of Holy Fire, Your Allies Turn on You!

Level 3 "Look On My Work and Despair": spend 1 wrath when judging to frighten; when Judgment jumps to a new target on a kill, the new target is frightened for free (or takes twice Presence holy if already frightened).

### 1.8 Kits

"You can use and gain the benefits of a kit." Quick Build: **Warrior Priest** (heavy armor, light weapon; Stamina +9 per echelon, Speed +1, Stability +1, melee damage +1/+1/+1; signature Weakening Brand 3 / 5 / 8 + characteristic holy, and the target has damage weakness equal to that characteristic until the end of its next turn). **Shining Armor** (heavy armor, shield, medium weapon; Stamina +12 per echelon, Stability +1, melee damage +2/+2/+2; signature Protective Attack 5 / 8 / 11 + M or A, "The target is taunted until the end of their next turn"). The kit, not the class, decides how tanky the body is.

### 1.9 The comparison classes (resource gain and their "mark", read in full)

| Class | Start of turn | Extra gain | Their mark or zone |
|---|---|---|---|
| Censor (wrath) | +2 | +1 when the judged creature damages you, +1 when you damage it (once a round each) | Judgment: one enemy; automatic damage when it acts; 1-wrath riders that hinder it |
| Tactician (focus) | +2 | +1 the first time anyone damages a marked creature; +1 the first time an ally within 10 uses a heroic ability | Mark: "you and allies [...] gain an edge on power rolls made against that creature"; spend 1 focus for extra damage (twice Reason), an ally's Recovery, an ally's shift, or a taunt |
| Fury (ferocity) | +1d3 | +1 the first time each round you take damage; +1d3 the first time you become winded or dying | none: paid for being hurt |
| Null (discipline) | +2 | +1 when an enemy in the Null Field uses a main action; +1 when the Director spends Malice | Null Field: 1 aura, enemies' potencies -1; 1 discipline for a rider |
| Conduit (piety) | +1d3 | can pray for more, with a risk of damage on a 1 | none |
| Shadow (insight) | +1d3 | +1 when you deal damage with a surge | none |

Reading: Mark and Judgment are near twins in wording (same range, same duration, same jump on a kill, same taunt rider). The difference is direction: **Mark helps the party hit the target; Judgment hurts the target for acting.** The Tactician's book description claims the defender words outright ("you stand between your compatriots and death"); the Censor's does not.

### 1.10 How Draw Steel builds the burst (rules)

From `Rules/Chapters/The Basics.md`:

- "This game is built so that each adventure you play and each battle you fight gets more exciting as it goes on."
- "The things a hero can achieve at the end of the story are far more daring and impactful than what they do at the start, and the final showdown against a villain's forces is more deadly and desperate than the first."
- Victories: 1 per combat won (the Director may give none for a trivial fight, more for a hard one). They become XP at a respite and reset to 0.
- Every class starts each encounter with heroic resource equal to Victories.
- Recoveries only come back on a respite (24 hours).
- So resting is a trade: you get Recoveries back but lose the head start. The first fight of a day starts at 0 and the burst comes on round 2 or 3; the fifth fight starts at 4 and the burst is on round 1.
- Outside combat, a heroic ability costs nothing but can't be reused until you earn a Victory or rest.

---

## 2. Draw Steel: what players say [search summaries, pages not read]

- **Role.** A fan table (rpgstack) lists the Censor as "Defender/Striker". A Medium overview describes it as a holy warrior specialized in one-on-one combat. A wiki calls it "essentially Paladins" who mark enemies. One guide says Censors lean to single-target damage through Judgment and are "a bit self-sacrificial"; another describes Judgment as a damage-over-time effect on one enemy that can't be removed. [search summary, page not read]
- **Aestus Guides (Censor class guide).** Reported points: the strongest build is Purifying Fire plus Judgment's holy damage, described as a very strong plan for killing bosses and solos; 12 Recoveries is a standout; My Life for Yours is strong but not something to use every round (nobody may need it, and Recoveries run out); the Life domain is the best pairing; levels 8-9 are a rough patch, level 10 a big payoff. [search summary, page not read]
- **Slow start.** The same site's other guides reportedly say the Censor's +2 wrath at the start is "not enough to do anything powerful", that judging adds no resource by itself, that the Censor "still has to walk forward and hit", and give a round-1 ceiling of 4 for the Censor against 9 for the Conduit. [search summary, page not read] My arithmetic in 1.2 agrees with the ceiling of 4.
- **jaimeeek's Censor guide (blog, 2026-02).** Reported: the extra Recoveries are prized for maximising My Life for Yours; warns against spending Recoveries too fast. [search summary, page not read]
- **Altoholism (blog, 2025-10).** The summary reports "3 wrath at the start of each turn, up from 2". **This conflicts with the rules text I read** (2 at level 1, 3 only at level 7). Either the summary is wrong or the blog describes a different printing. Unverified.
- **EN World, "Draw Steel: Fake variety helps no one".** A critique that the classes' resources are near-identical under different names; a commenter suggests one shared resource. [search summary, page not read] The table in 1.9 supports the observation: five of six read classes share the frame "Victories at the start, 2 or 1d3 a turn, +1 for a class trigger".
- **Pacing.** Reviews (Gaming Trend, The Dice Society, Behind the Wall Games) reportedly describe Victories as letting the strong abilities arrive sooner, "possibly in round 1", and describe the trade between resting for Recoveries and keeping Victories as push-your-luck. The Director's Malice also scales with the heroes' Victories. [search summary, page not read]
- **Nothing was found** comparing how the Censor feels next to the Fury, Tactician, Conduit or Null in play, and nothing calling the build-up better or worse than a round-1 nova in a poster's own words. The searches for those ran into the budget limit.

---

## 3. Lancer (rules, read in full)

Source: `massif-press/lancer-data` (the official data used by COMP/CON), `lib/frames.json`, `systems.json`, `talents.json`, `actions.json`, `weapons.json`, commit a928f09.

### 3.1 Role tags of the core frames

- **Defender:** Drake, Saladin, Gorgon.
- **Defender + another:** Tortuga (Defender / Striker), Balor (Striker / Defender), Napoleon (Defender / Controller).
- Sherman is Striker / Artillery. Black Witch is Controller / Support. Nelson is Striker. Everest is Balanced. There is no "Guardian" frame: **Guardian is a trait** (below). There is no "Paladin" tag.

### 3.2 How each defender protects

| Frame | Stats | How it protects |
|---|---|---|
| **Saladin** | HP 12, Armor 1, Evasion 6 | **Warp Shield:** "1/round, the Saladin can give +1 difficulty to any attack against it or an allied character within Sensors as a reaction before the roll is made." **Guardian:** "Adjacent allied characters can use the Saladin for hard cover." Core power Tachyon Shield: pick an ally in Sensors; reaction 1/round when they are attacked: "They gain Resistance to all damage from the attack, and if the attack misses, you may force the attacker to reroll it against a character or object of your choice". |
| **Drake** | HP 8, Armor 3, Evasion 6, Speed 3 | Guardian (hard cover for adjacent allies), Blast Plating (resists area attacks). Core power Fortress Protocol: becomes Immobilized, unfolds two immune cover sections, shares its immunities with anyone using it for cover. |
| **Napoleon** | HP 6, Armor 2, Size 1/2 | "When the Napoleon Braces, it reduces incoming damage to 1 instead of gaining Resistance." Core power Trueblack Aegis: all damage reduced to 1 for the scene, but it can no longer take most actions, reactions or Overcharge. |
| **Tortuga** | HP 8, Armor 2 | Guardian; +1 Accuracy on reaction attacks. Core power: an extra Overwatch a round, and Overwatch hits Immobilize. A defender by **threat**, not by absorbing. |
| **Balor** | HP 12, Armor 0 | Regains 1/4 of its HP at the end of each turn; deals 2 kinetic to adjacent enemies at the start of their turns. |
| **Black Witch** | HP 6 | Mag Parry: "1/round, as a reaction, you may attempt to parry an attack that would deal Kinetic Damage to you or an adjacent allied character. Roll 1d6: on 5+, the attack misses." |

Systems that guard an ally:
- **Argonaut Shield** (Drake 1), quick action: an adjacent ally gains "Resistance to all damage; however, you take half of the damage your target would take before calculating Armor and Resistance." Lasts while adjacent. (Damage sharing: the ally takes half, you take half and then apply your Armor 3.)
- **ENCLAVE-Pattern Support Shield** (Saladin 1): burst 3 dome, you are Immobilized, attacks from outside get +1 difficulty; reaction: "Take two Heat, then grant the attack's target Resistance to all damage from this attack."
- **Flash Anchor** (Saladin 2), reaction, 2 Heat: prevents a push, pull, knockback or Prone on you or an ally.
- **NOAH-Class NHP** (Saladin 3): 1 Heat and roll 1d6, on 4+ a ranged attack on you or an adjacent ally misses; "Each time a ranged attack fails to hit you or an adjacent allied character, the attacker takes 4 kinetic damage."
- **Stasis Bolt** (Napoleon 1): charge it as a quick action; reaction when you or an ally within 5 is targeted by a ranged attack: a contested roll, and if you win "the attack automatically misses".
- Talent **Bonded** rank 2, **Intercede** (reaction, 1/round): "You are adjacent to your Bondmate [...] and they take damage from a source within your line of sight. You may take the damage instead." Rank 3: spend your Overwatch to threaten whoever attacks your Bondmate; they pick another target or eat your attack first.
- Talent **Heavy Gunner**, Covering Fire (quick action): the target is Impaired, and if it moves more than 1 space you attack it as a reaction for half damage.

**Pattern: Lancer's defenders mostly make the attack worse (cover, difficulty, Resistance, a forced miss) and pay in Heat or in their own mobility. Only two things in the core data take the damage for someone (Intercede, and half of it with the Argonaut Shield).** The heat cost matters: a Saladin's defensive reactions fill the same gauge an attacker would use to Overcharge.

### 3.3 Basic actions named in the request

- **Brace** (reaction): Resistance to the triggering attack, +1 difficulty to other attacks until the end of your next turn, but "you cannot take reactions until the end of your next turn and on that turn, you can only take one quick action". A heavy tempo tax.
- **Bolster** (quick tech): an ally gets +2 Accuracy on their next skill check or save. Not on attacks.
- **Overcharge** (free, 1/turn): one extra quick action. Heat cost climbs each use until a full repair: 1, then 1d3, then 1d6, then 1d6+4.
- **Barrage** (full action): attack with two weapons, or one Superheavy.
- **Stabilize** (full action): clear all heat or restore all HP (costs 1 Repair), plus reload or clear a condition.

### 3.4 The nova budget in Lancer (rules)

- **Core Power.** One per frame; in the core rules a mech has 1 Core Power use, restored by a full repair, so about once a mission **(from memory, unverified; the data only shows each core system's activation)**.
- **Overcharge.** The escalating heat track above is a per-mission budget of extra actions: the first is nearly free, the fourth costs 1d6+4 heat.
- **Nuclear Cavalier** (talent): rank 1 "The first attack roll you make on your turn while in the Danger Zone deals +2 Heat on a hit." Rank 2: that attack becomes Energy and "deals +1d6 Energy bonus damage on a hit." Rank 3: gain the Fuel Rod Gun. So running hot is the damage stance. Danger Zone is half your heat cap or more (from memory, unverified).
- **Built, then spent in one shot (the closest match to the brief):**
  - **Sherman, ZF4 SOLIDCORE:** "It begins with 1 Charge, dealing 1d6 energy with line 4. Each time you Stabilize, you gain an additional 1 Charge, up to a maximum of 4. The ZF4 gains an additional +4 line and +1d6 energy damage for each charge, and resets to 1 Charge after each attack. Charges persist between scenes". Core power: +3 Charges at once. **The defensive action (Stabilize: cool down, repair) is what loads the gun.**
  - **Barbarossa, Apocalypse Rail:** a die starts at 4 and drops 1 each turn you don't move; fire at 3 (2d6, blast 2), 2 (3d6) or 1 (4d6); moving resets it. "If you reach the end of the scene without using it, you regain 1 CP."
- "Alpha strike" as the community's word: not confirmed on any page I could read. One fan build page reportedly describes a turn of Overcharge into the Danger Zone, then a Skirmish with Nuclear Cavalier 2, a Roland Chamber and a Limit Break. [search summary, page not read]

### 3.5 Lancer: what players say [search summaries, pages not read]

- One r/LancerRPG build thread (via a mirror) reportedly: the Drake is "more of a tank than support", tough, slow and heavy hitting; Drake and Saladin have good synergies; Portable Bunker, Aegis Shield Generator, Argonaut Shield, Enclave Shield and Hardlight Defense System "all fulfill similar roles". [search summary, page not read]
- The Lancer wiki reportedly notes the Tachyon Shield is not very good on the Saladin itself because of its low Evasion. [search summary, page not read] This fits the rules: the redirect only happens on a miss.
- **Nothing was found** on whether defenders feel good or passive. The search for it ran into the budget limit.

---

## 4. ICON 1.5 (Massif Press): the Stalwart jobs (rules, read in full)

Source: `zengulus/icon`, `src/content/generated/icon-1.5.json`: the text of ICON 1.5 (Tom Bloom, published 2023-06-07, the free playtest), pages 99 and 116-141. Note: ICON has since been reworked toward a 2.0; this is the 1.5 text.

### 4.1 The class

"Strengths: Tough, good at punishing foes, protecting allies, and controlling the battlefield. Weaknesses: Lower mobility and weak to ranged attackers". Armor 2 ("Reduce all damage taken by 2"), HP 40.

They protect with **three tools, none of which is taking the hit**:

- **Rampart:** "Foes cannot enter or exit any space affected by a character's Rampart by dashing, flying, or teleporting." Every Stalwart has it on adjacent spaces. The book calls it "a super-engagement".
- **Vigilance X** (a stock of d6 charges, up to 6, kept until the end of combat; every Stalwart gains +1 at the end of each turn). Spend any number, roll that many d6, keep the highest:
  - "When an ally in range 2 is damaged by a foe's ability, reduce the damage by the amount rolled as if with armor"
  - "When a foe breaks adjacency with you, deal that much damage to them."
  - **One stock pays for both protecting and punishing. It builds by itself each turn, so a Stalwart who has not had to guard yet is holding a bigger answer.**
- **Weakened** ("All damage dealt reduced by 2") and **Slashed** ("Take 4 damage after you or an ally uses an ability that moves you").

**Heroics:** each ability has a stronger "Heroic" line. Each job has its own price for switching it on.

### 4.2 The four jobs

- **Bastion** ("Unbreakable Knight"). Protects by **moving people**. Heroic price (Strive): after it, "you can't use heroics until the end of your next turn, and deal half damage during that turn." Press the Advantage: once a round when you shove, "you and an ally of your choice anywhere can each rush 1." Shieldmaster: aura 1; ending your turn with an ally in it gives Vigilance +1 and Sturdy. **Endless Battlement** (stance): an ally in range 4 gains an aura; interrupt "A foe targets your ally with an ability": you leap to any space in the aura and adjacent foes take 2 damage. **Catapult** (interrupt): shove an ally 2 in any direction when they end a move next to you. Limit Break **Helion** (2 resolve): every character on the battlefield is shoved 1 in a direction you choose; bloodied foes are weakened, foes at 25% are stunned.
- **Demon Slayer.** A wind-up striker. **Hissatsu:** "If you don't attack during your turn, your next attack ability gains +1 boon, true strike, and upgrades its damage die to d10." Demon Edge: taking a slow turn gives Vigilance +1 and bonus damage. The book: "they benefit from attacking every other turn, and waiting to strike". Limit Break **Split Heaven and Hell** (3 resolve): end your turn; at the start of your next (slow) turn, a line 5 dealing **100% of max hp at 1 space, 50% at 2-4, 25% at 5+** (legends always 25%). It can be **cancelled for a full refund**, or **held** to grow wider and longer. "relatively easy to avoid for foes without assistance from your allies".
- **Colossus.** Stronger the lower its HP: starts combat with Defiance (can't drop below 1 hp once), Regeneration when bloodied. Wolfheart: "Once a round, you may sacrifice 25% of your max hp to make an ability Heroic". Limit Break Gigantas Crusher (3 resolve): sacrifice 25% of your hp, the foe takes 50% of its max hp (25% on a save).
- **Knave.** The taunt tank. **Taunt (1 action):** "A foe in range 3 gains hatred of you." **Hatred of X:** "Deal half damage to all foes other than foe X." Counter: "When damaged by an ability, deal 2 damage back". Heroic price (Spite): you gain Hatred+ of the closest foe. Limit Break **Mock** (2 resolve): a foe becomes slashed+, weakened+, loses evasion and gains hatred+ of you until the end of its next turn (two turns on elites and legends).

### 4.3 Resolve: ICON's build-then-spend

- Limit Breaks are once per combat and cost Resolve.
- "Party Resolve goes up by 1 at the start of each round in combat, and depletes to 0 after combat ends." It is **shared**: spending it needs the team's consent.
- "All characters gain 1 personal resolve after every combat".
- "Personal resolve resets to 0 after you camp, meaning you might want to push on instead of resting in order to get the most out of your abilities."
- So a 3-resolve Limit Break is a round-3 event in the first fight after camp, and a round-1 or round-2 event later. Same shape as Draw Steel's Victories, plus a pool the party argues over.
- Several masteries switch on late: "At round 4 or higher in combat, valiant becomes a free action."

### 4.4 ICON: what players say [search summaries, pages not read]

- RPG.net, "Sell me on/off ICON playtest": reportedly praised as rich, crunchy, well-defined grid combat built on Lancer's lessons; one poster says there is essentially no room for improvisation (you do what the sheet says); another that it relies on a very tight balance. [search summary, page not read]
- Nothing found on how Stalwarts feel.

---

## 5. Nimble: the Oathsworn (rules, read in full)

Source: `Nimble-Co/FoundryVTT-Nimble` (the publisher's own Foundry system), `packs/classes/core/oathsworn.json` and `packs/classFeatures/core/oathsworn/**`, commit a60eb9a of 2026-11-13. **This is the best match to "explode before they see it coming".**

Class pitch: "Defend with Devotion. Shield your allies from harm and channel righteous judgment. **The more you face evil, the more potent your strikes become.**" d10 hit die, Strength and Will.

### 5.1 Radiant Judgment (level 1), exact text

"Whenever an enemy attacks you, if you have no Judgment Dice, roll your Judgment dice (2d6). On your next melee attack this encounter, if you hit, deal that much additional radiant damage. The dice are expended whether you hit or miss."

- Die size grows: d8 at level 3, d10 at 5, d12 at 8, d20 at 10; one more die at 14.
- **Being attacked loads the smite.** There is no pool to manage and no slot to spend: the loop is "get attacked, hit back hard".
- The amount is rolled when you are attacked, so the table sees the number sitting there before the swing.
- The condition "if you have no Judgment Dice" means it never stacks: one charge at a time. Being attacked three times does not triple it.
- A search summary says an earlier preview stacked them (a d8 per attack, up to WIL dice) and that a later changelog widened it to "your next Reach attack". [search summary, page not read] So the designer moved **from a stacking pool to a single charge**.

### 5.2 The rest of the kit

- **Lay on Hands:** "This pool's maximum is always equal to 5×LVL and recharges on a Safe Rest. Action: Touch a target and spend any amount of remaining healing power to restore that many HP."
- **Zealot** (level 2): "Whenever you attack with a melee weapon, you may spend mana (up to your highest unlocked spell tier) to choose one for each mana spent: Condemning Strike. Deal +5 radiant damage. Blessed Aim. Decrease your target's armor by 1 step for this attack." This is the nova dial: mana pool is WIL + LVL per Safe Rest.
- **Interpose** (a basic reaction every hero has): "When a creature within 2 spaces would be struck with an attack, you can push them out of the way and become the new target. You enter their space and move them to an adjacent space of your choice." **Defend** (another reaction): "Reduce damage from any single attack by your Armor value."
- **My Life, for My Friends** (level 4): "You can Interpose for free."
- **Sacred Decrees** (pick 1 at level 3, more later), among them:
  - **Explosive Judgment:** "(1/encounter) 2 actions: Expend your Judgment Dice, deal that much radiant damage to all enemies in your aura."
  - **Shining Mandate:** "The first time each round you are attacked while you already have Judgment Dice, select an ally within your aura to roll one and apply it to their next attack." (The overflow goes to an ally: soft support out of the same mechanic.)
  - **Courage!:** "(1/encounter) When you or an ally in your aura would drop to 0 HP, set their HP to 1 instead."
  - **Reliable Justice:** roll Judgment Dice with advantage.
  - **Well Armored:** "Whenever you Interpose, gain temp HP equal to your STR."
  - **Radiant Aura:** end a harmful condition on a creature in your aura, WIL times per Safe Rest.

### 5.3 Subclasses split the brief's three roles

- **Oath of Refuge (the tank):** aura of Reach 4, "you can Interpose for an ally anywhere within your aura"; level 7 "When you Interpose, the attacking enemy is also Taunted by you"; level 11 allies in the aura "cannot drop below 1 HP" (they gain a Wound instead).
- **Oath of Vengeance (the nova):** "Whenever you roll Judgment Dice, roll 1 more. [...] Your Radiant Judgment also triggers when an ally within your aura is attacked while you have no Judgment Dice." Level 7 Avenger: "Whenever you or an ally within your aura gain any Wounds, change up to that many Judgment Dice to their max. Then, move up to half your speed for free." **(An ally going down is what maxes the smite.)**
- **Oathbreaker:** Judgment triggers "whenever you could Interpose but don't"; can swap HP with an ally about to drop; can spend Lay on Hands as damage.

Interaction worth noting: Interposing makes you the target, so **protecting an ally is also what loads the Judgment Dice**. Defence feeds offence with no bookkeeping.

### 5.4 Nimble: what players say [search summaries, pages not read]

- A blog (khajeeting, "Thoughts on Nimble") reportedly says the class feels unlike any other: they want to be hit and want to protect their friends. [search summary, page not read]
- A player reportedly described an Oathsworn with a leaping ancestry jumping across the field to Interpose: "a mobile tank". [search summary, page not read]
- The designer's blog post "The CORE problem of D&D martial classes: and how Nimble fixes it" exists; its content was not read.

---

## 6. Fabula Ultima: the Guardian (rules, read in full)

Source: `League-of-Fabulous-Developers/FoundryVTT-Fabula-Ultima`, `src/packs/skills/*.json`, commit 7290a56. No grid in this game.

- **Protect:** "When another creature is threatened by an attack, spell or other danger, you may take their place (any Checks that are part of the danger will be performed against you; you may declare the use of this Skill before or after the Checks have been made). If the danger already affected you, it affects you twice (resolve both instances separately). You cannot protect multiple creatures from the same danger. If you use this Skill during a conflict, you cannot use it again until the start of your next turn."
  - Free, no roll, once a round, and **it can be declared after the attack roll is known**. The limit is one ally a round and double damage from areas.
- **Bodyguard:** if you Guard and cover an ally, they gain Resistance to all damage until your next turn.
- **Defensive Mastery:** damage you suffer reduced by the skill level (1-5). **Fortress:** +3 max HP per level.
- This is the opposite pole from the brief: a true sponge, by design.

---

## 7. What all of this says about the brief (other games' answers, not 2d12's rules)

1. **"Can't take hits for you" is the common design, not the exception.** Draw Steel's Censor heals after the hit (My Life for Yours) and only redirects at 9 wrath (Intercede, Paragon, level 6). Lancer's defenders give cover, difficulty and Resistance. ICON's Stalwarts reduce the hit (Vigilance), block movement (Rampart) and halve the enemy's damage to others (Hatred). Only Nimble and Fabula Ultima make redirection a basic move.
2. **The mark is how a soft tank protects.** Judgment (Draw Steel) and Hatred (ICON) both make attacking someone else worse instead of impossible: a bane for 1 wrath, half damage, a double bane when taunted.
3. **Three ways to build the burst, by what loads it:**
   - *Time and the duel:* Draw Steel (2 a turn, +1 for hitting the mark, +1 for being hit by it; Victories carry the charge between fights). ICON's Resolve (1 a round, shared).
   - *Being attacked:* Nimble's Judgment Dice (one charge, rolled in the open, spent on the next hit). ICON's Vigilance (stock that also pays for guarding).
   - *Giving up a turn:* ICON's Demon Slayer (don't attack this turn, the next attack is upgraded; the Limit Break can be held or cancelled for a refund). Lancer's Sherman (Stabilize loads the gun) and Barbarossa (stand still, the die counts down).
4. **The same currency for guarding and for the burst creates the decision.** Draw Steel's 1-wrath Judgment riders and ICON's Vigilance both make each act of protection cost a piece of the burst. Nimble does the reverse: guarding (Interpose) loads the burst.
5. **A single charge instead of a pool.** Nimble moved (per the search summaries) from stacking dice to "if you have no Judgment Dice": less to track, no hoarding, and the burst is frequent and medium, not rare and huge. Draw Steel is the pool model: rarer, bigger, and reportedly slow on round 1.
6. **An execute is a cheap way to make a burst feel like an explosion.** Draw Steel's Censored (5 wrath: a non-boss made winded by it dies) and ICON's percentage Limit Breaks do it without large numbers.
7. **The burst can be an aura, not a hit.** The Censor's 7-wrath Edicts are maneuvers that punish every enemy near you for the rest of the fight, more against the judged one. That is "stay in front" turned into the big spend.

---

## Sources (rules read in full, on GitHub)

1. Steel Compendium, Draw Steel rules as markdown: https://github.com/SteelCompendium/data-md (files read: `Rules/Classes/Censor.md`, `Tactician.md`, `Fury.md`, `Null.md`, `Conduit.md`, `Shadow.md` (resource and mark sections), `Rules/Chapters/The Basics.md`, `Rules/Conditions/Taunted.md`, `Rules/Kits/Warrior Priest.md`, `Rules/Kits/Shining Armor.md`). The same text is published at https://steelcompendium.io/compendium/main/Rules/Classes/Censor/ (site not reachable from this session).
2. Lancer data (Massif Press): https://github.com/massif-press/lancer-data (`lib/frames.json`, `systems.json`, `talents.json`, `actions.json`, `weapons.json`).
3. Nimble's Foundry system (Nimble Co.): https://github.com/Nimble-Co/FoundryVTT-Nimble (`packs/classes/core/oathsworn.json`, `packs/classFeatures/core/oathsworn/`, `packs/subclasses/core/oathsworn/`, `public/lang/en.json` for Interpose and Defend).
4. ICON 1.5 text inside a fan character tool: https://github.com/zengulus/icon (`src/content/generated/icon-1.5.json`, pages 99, 116-123, 126-128, 134-135, 140-141).
5. Fabula Ultima's Foundry system: https://github.com/League-of-Fabulous-Developers/FoundryVTT-Fabula-Ultima (`src/packs/skills/`: Protect, Bodyguard, Defensive Mastery, Fortress, Dual Shieldbearer).

## Seen only as search-result summaries (pages NOT read; leads to check)

- https://aestusguides.com/articles/draw-steel-censor-class-guide/ (and its Conduit and Elementalist guides)
- https://altoholism.blogspot.com/2025/10/draw-steel-class-deep-dive-censor.html (its reported wrath number conflicts with the rules read)
- https://jaimeeek.blogspot.com/2026/02/draw-steel-censor-guide.html
- https://www.enworld.org/threads/draw-steel-fake-variety-helps-no-one.714344/
- https://forum.rpg.net/threads/draw-steel-how-is-it-to-run.930243/
- https://gamingtrend.com/reviews/draw-steel-heroes-review/
- https://thedicesociety.com/draw-steel-review/
- https://behindthewallgames.com/2025/07/31/draw-steel-release/
- https://medium.com/@pictor_dice_camp/draw-steel-is-a-lot-6843841de2f4
- https://rpgstack.com/systems/draw_steel/classes
- https://libredd.it/r/LancerRPG/comments/lfwxzk/new_to_lancer_and_would_like_help_planning_a_build/
- https://lancer.wiki.gg/wiki/Saladin
- https://majinevelyn.com/docs/Lancer/Quick%20Builds%20-%20Lancer.html
- https://forum.rpg.net/threads/sell-me-on-off-icon-playtest.901405/
- https://khajeeting.neocities.org/blogposts/thoughts-on-nimble
- https://nimblerpg.com/blogs/news/the-core-problem-of-d-d-martial-classes-and-how-nimble-fixes-it
- https://nimblerpg.com/blogs/news/core-rules-gmg-heroes-full-changelog
- https://nimble.nexus/classes/oathsworn-7tk46satt48vyr5fey9aatqhgn
- https://www.enworld.org/threads/nimble-expansion.717853/page-5

## Could not read

- **steelcompendium.io** (the requested source): blocked by this session's network settings. Its content was read from its GitHub data repository instead.
- **Every other website** (reddit and mirrors, EN World, RPG.net, lancer.wiki.gg, the blogs above, itch.io, YouTube): blocked the same way. To read them, the hosts must be allowed in the session's network settings.
- `massif-press/icon-data` and `massif-press/compcon-icon` on GitHub: do not exist or are private.

## Not covered (search budget ran out, or nothing found)

- Player opinion comparing the Censor with the Fury, Tactician, Conduit and Null in play.
- Player opinion on Draw Steel's build-up against "nova on round 1", in posters' own words.
- Whether Lancer defenders feel good or passive; the community's use of "alpha strike".
- Opinion on ICON's Stalwarts and on Fabula Ultima's Guardian.
- Gloomhaven / Frosthaven tank classes, Trespasser, Strike!, Beacon, Valiant, Tactiquest: not searched at all.
- MCDM's own sentence "the Censor shuts down a single enemy": not found in the class text; not verified.
