# Research E: a front-liner who is neither a damage dealer nor a sponge

Date: 2026-11-14. For the Paladin redesign ("soft tank, soft support, soft nova").

## READ THIS FIRST: what this file is and is not

The brief asked for 18+ pages actually read. **That was not possible in this session**, and the file is weaker than asked:

- **Page reads were blocked.** The session's network ("2d12 Main", limited, no allowed hosts) refused every forum, blog and rules site (enworld.org, paizo.com, forums.giantitp.com, forum.rpg.net, 2e.aonprd.com, pelgranepress.com, steelcompendium.io, dnd4.fandom.com, itch.io, substack, rpgpub.com, wikipedia, web.archive.org). I proposed adding 20 hosts to the environment; the change was rejected. Only GitHub could be fetched.
- **The web search budget ran out** after about 14 searches (a limit shared by all agents of the turn). Four planned searches never ran: PF2e Champion reaction experience, the 5e Monk / PF2e melee caster "can't tank" complaints, how 13th Age's intercept plays at the table, and GM advice (Angry GM, Sly Flourish, The Alexandrian) on attacking the tank.

So every finding carries one of three tags:

- **[READ]** = rules text I fetched and read (13 files, all open rules data on GitHub: Draw Steel, Lancer, and a 13th Age derivative).
- **[SNIPPET]** = from a search result's summary of a page I could **not** open. The quoted words are what the search tool returned as the page's words; I could not check them against the page, their context, or who said them. Treat as leads, not as evidence.
- **(from memory, unverified)** = my own recollection of a rule, no page read.

Nothing below is a 2d12 rule. "For 2d12" lines are my reading, for Lucas to accept or drop.

---

## 1. Tanking in tabletop: why aggro doesn't exist, and the families of solutions

### What the rules say

**Draw Steel's Taunted is a penalty, not a compulsion. [READ]** A taunted creature has a double bane on ability rolls for any ability that doesn't target the taunter, while it has line of effect to the taunter; a new taunt replaces the old one (paraphrase; the fetch tool would not return the full sentence verbatim). The Director keeps the choice; ignoring the tank is just very expensive.
Source: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Conditions/Taunted.md

**Draw Steel Censor: Judgment is a punishment mark with a menu. [READ]** A Maneuver, Ranged 10, one enemy, lasts the encounter. Base effect: when the judged creature uses a main action within your line of effect, a free triggered action deals holy damage equal to twice your Presence. When the judged creature drops to 0 Stamina, a free triggered action moves Judgment to a new target. Then, for 1 wrath each, one of: an adjacent judged creature that starts to shift is struck and can't move; a judged creature within 10 takes a bane on a power roll; its single-target ability loses 1 potency; if you damage it with a melee ability, it is taunted until the end of its next turn. The Censor also gains 1 wrath the first time each round the judged creature damages it or it damages the judged creature.
Source: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Censor.md
- Notes: (a) the punishment triggers on *any main action*, not only on "attacked someone else", so the mark is never dead; (b) the mark re-arms itself for free on a kill, so the player never spends a turn re-marking; (c) the resource loop pays the Censor for the duel in both directions (hit it, or be hit by it).

**Draw Steel Tactician: Mark makes the target everyone's best target. [READ]** Mark (Maneuver, Ranged 10): you and allies gain an edge on power rolls against the marked creature. When you or an ally deals rolled damage to it, spend 1 focus for one of: extra damage (twice Reason), the attacker spends a Recovery, the attacker shifts, or (melee) the target is taunted. Level 2 "Goaded" (Mastermind): when a marked creature strikes you or an ally, you can redirect the strike to you or another ally. The class text calls it "a strategist, defender, and leader".
Source: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Tactician.md

**13th Age-style Paladin's Challenge: a mutual duel. [READ, with a caveat]** In the 5th-age-srd (a fan adaptation of the 13th Age Archmage Engine mixed with 4e/5e ideas; I could not open Pelgrane's own SRD to compare), hitting an enemy lets the paladin lock it into a challenge that imposes attack and disengage penalties on **both** of them; one challenged enemy at a time. The Fighter there has "Threatening" (a penalty to disengage checks from the fighter) and "Skilled Intercept" (a save, 11+, to intercept an enemy moving to attack a nearby ally).
Sources: https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Classes/Paladin.md , https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Classes/Fighter.md

**Lancer's defenders mostly protect by geometry, not by a mark. [READ]** Drake, Tortuga and Gorgon all carry the trait Guardian ("Adjacent allied characters can use the Drake for hard cover."). Gorgon's core power: hostile characters must pass a Systems save before attacking it or allies within range 3. Talent Bonded: when your adjacent Bondmate takes damage, you can take it instead; "Cover Me!" lets you spend your Overwatch to threaten whoever attacks them. Black Witch's Mag Parry: a reaction for you or an adjacent ally, 1d6, on 5+ the attack misses. Swallowtail: an ally gains Resistance to an attack and may teleport away.
Sources: https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/frames.json (first 100,000 characters only; Saladin, Zheng, Napoleon not reached), https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/talents.json

### What posters and essayists think (all [SNIPPET], pages not read)

- **Why aggro doesn't transfer:** the GM picks targets, so there is no threat table to manipulate; "if enemies can choose to attack weaker targets instead, durability becomes irrelevant" and a tank must "redirect danger toward themselves". Lead: itch.io blog "tanking in ttrpgs", https://itch.io/blog/1125694/tanking-in-ttrpgs
- **"The Tank Fallacy" (RPGBot):** a character so durable, and so little of a threat, that enemies do better by ignoring it. Listed ways out: be enough of a threat that you can't be ignored, inhibit or prevent enemy attacks, keep enemies from reaching allies, make allies unusually durable. Lead: https://rpgbot.net/the-tank-fallacy/
- **4e marks seen as too weak on their own:** "a mark alone is only a -2 penalty"; the punishment is what matters. One EN World poster called marking "weak sauce" as aggro. Leads: https://www.enworld.org/threads/tabletop-aggro.281314/ , https://forum.rpg.net/index.php?threads/d-d-4e-defenders-and-their-mark.465144/
- **The two-sided test of a defender:** the enemy's choice is "either attack the defender, or be punished", and "a good defender needs to make both A and B painful for the enemy". Lead: https://www.enworld.org/threads/the-defenders-masochism.318677/ (or the rpg.net thread above; the search summary did not say which).
- **Taunts and agency:** a GiantITP thread ("Building a better Taunt") has the complaint that a taunt removes the GM's agency, and the reply that by that logic no monster could be run by its rules. Same thread: with a penalty-style taunt (5e's disadvantage wording), "anything you would *WANT* to taunt is smart enough to find a way to ignore it". Leads: https://forums.giantitp.com/showthread.php?p=26174722 , https://www.enworld.org/threads/how-should-taunting-work.658133/page-5
- **PF2e Guardian (playtest threads):** Taunt "doesn't fit into the standard martial action flow" (it costs an action that competes with attacking); Intercept in the playtest "only hurt the Guardian"; the released version leaves the attacker off-guard, which posters say made it worth using. One group reported the class "did its job". Leads: https://paizo.com/threads/rzs4aipp&page=3 , https://paizo.com/threads/rzs6ofb6 , https://paizo.com/threads/rzs4cn3j

### The families, sorted (my synthesis; rules [READ] where a game is named above, the rest from memory)

| Family | Example | Who keeps the choice | Known complaint |
|---|---|---|---|
| Punishment mark | Draw Steel Judgment [READ]; 4e Divine Challenge (already known to us) | The GM | Dead if it only fires on "attacks an ally" and the GM plays around it |
| Soft taunt (penalty) | Draw Steel Taunted [READ]; 4e mark -2 (from memory, unverified) | The GM, at a cost | Too small a penalty is ignored [SNIPPET] |
| Hard taunt (must attack) | PF1 Antagonize (from memory, unverified) | Nobody | "Mind control", GM agency [SNIPPET] |
| Stickiness | 13th Age disengage check, Threatening [READ]; Judgment's 1-wrath "can't shift" [READ]; 5e Sentinel (from memory, unverified) | The GM, but moving is risky | Needs the enemy to already be next to you |
| Interception | 13th Age intercept [READ]; Lancer Bonded [READ]; Draw Steel Goaded [READ] | The tank | The tank takes the full hit: needs toughness |
| Mitigation for the ally | Draw Steel Parry (half damage) [READ]; Conduit's Word of Judgment (bane on the roll) [READ]; Lancer Guardian cover [READ] | The tank | Invisible if it is passive (see section 3) |
| Threat by being dangerous | RPGBot's fix [SNIPPET]; Tactician's Mark (edge for all allies) [READ] | The GM | Needs real damage, which the brief rules out as a constant |

**For 2d12 (my reading):** a Paladin who is not a steady damage dealer cannot use "threat by being dangerous" every round, and one who "can't take hits for you" should not be built on interception. That leaves the punishment mark, the soft taunt and ally mitigation as the natural core. The "soft nova" is where the missing threat can live: a mark that **stores** something the enemy fears (Draw Steel's wrath builds from the duel; a judged enemy that keeps ignoring you is feeding the explosion). That turns "ignore the paladin" from the safe option into the dangerous one, without steady damage.

---

## 2. "Stay in front so the squishies can stay back": what makes a front line real

### What the rules say

**Lancer: engagement stops movement outright. [READ]** "If a character moves adjacent to a hostile character, they both gain the ENGAGED status for as long as they remain adjacent to one another." Ranged attacks by an Engaged character get +1 difficulty. And: characters that become Engaged by targets of equal or greater Size "during the course of a movement stop moving immediately and lose any unused movement." Overwatch is a reaction: trigger, "A hostile character starts any movement (including BOOST and other actions) inside one of your weapons' THREAT." Disengage is a **Full** action ("you ignore engagement and your movement does not provoke reactions").
Sources: https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/statuses.json , https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/actions.json
- Note: the front line here does not depend on an attack hitting. Walking next to a same-size enemy ends your move, full stop. Getting past costs your whole turn.

**13th Age (via the 5th-age-srd derivative): interception is a free choice of the defender. [READ, with the caveat above]** "If you move past someone who is not already engaged, they have the option to engage you and make you stop where they are". "Only one creature can intercept a single enemy moving past them at a time." Leaving an engagement is a disengage check; on a failure "you don't move, lose your move action for that turn, and remain engaged." Ranged attacks draw opportunity attacks from engaged enemies.
Source: https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Character-Rules/Combat.md
- Note: a front-liner who is **already engaged cannot intercept**. One enemy pins the tank and the second walks by. That is the rule's built-in limit, and Skilled Intercept exists to bend it.

**Draw Steel: everyone has the opportunity attack, and it is cheap to avoid. [READ]** "all characters can make an opportunity attack free strike." Trigger: "the enemy willingly moves to a space that isn't adjacent to the creature without shifting". The Disengage move action lets a creature shift 1 square. You can move through an enemy's space as difficult terrain. A creature with a bane on the roll against that enemy cannot make the opportunity attack. Tactician's Overwatch hands the free strike to an ally when a creature within 10 moves.
Source: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Chapters/Combat.md
- Note: the universal free strike is a small tax; the real front line in Draw Steel comes from class tools (Judgment's "can't shift", taunts, forced movement).

**From memory, unverified:** 5e gives everyone one opportunity attack per round, with Sentinel adding speed 0 on a hit, ignoring Disengage and a reaction attack when an adjacent enemy attacks someone else. PF2e gives Reactive Strike to the Fighter at level 1 and to few others, and it can disrupt a move on a critical hit. 4e's Fighter stops movement on an opportunity attack hit and may attack a marked adjacent enemy that shifts.

### What posters think (all [SNIPPET])

- In 5e, a smart enemy may decide the tank "isn't worth it", eat one opportunity attack and reach the back line; one reaction a round means "several enemies can overwhelm you". Sentinel is the standard answer because it stops the move instead of only taxing it. Leads: https://www.dungeonsolvers.com/how-to-be-a-tank-in-dd-5e/ , https://musedungeon.com/characters/feats/sentinel-5e/ , https://www.dndbeyond.com/forums/dungeons-dragons-discussion/tips-tactics/158485-backliners-being-hit-by-enemy
- 4e launch Paladin: Divine Challenge required the paladin to stay engaged with the target, which sat badly with heavy armor and slow speed ("moving in 5s and your opponent is moving in 7s"); posters felt it lagged in upper Heroic; later books added a second mark system (Divine Sanction) and the Cavalier's simple aura. Leads: https://press.invincible.ink/4e-the-paladins-engagement/ , https://forum.rpg.net/index.php?threads/4e-improving-divine-challenge.443034/

### Synthesis (mine)

Three things make a line real, in falling order of strength:
1. **Movement simply ends** next to the front-liner (Lancer engagement, 13th Age intercept). No roll, no reaction spent, works on every enemy.
2. **Leaving costs the action economy** (Lancer's Full-action Disengage, 13th Age's failed check losing the move).
3. **Leaving costs damage** (the opportunity attack). The weakest: one per round, avoidable by a shift, and a low-damage character's attack is no deterrent.

**For 2d12 (my reading):** with no basic opportunity attack at low level, and a Paladin whose single hit should not be scary, option 3 is the wrong tool twice over. Options 1 and 2 fit the brief: a Paladin-specific "ward" around itself where an enemy's move ends or costs more (a zone, not an attack), ideally limited the way 13th Age limits it (once per round, or only while not already pinned) so the GM can still solve it with numbers. This also answers the 4e launch Paladin's flaw: the tool should not require the slow armored character to chase its target.

---

## 3. The psychology: reactive, invisible, and how protection becomes a moment

### What I could gather (all [SNIPPET]; this section is the thinnest, two of its planned searches never ran)

- **Prevented damage is not seen.** An RPGPub thread: tanking as "the ability to take damage so others don't" is "not a particularly active role" and hard to make satisfying because the player doesn't see the damage being removed; it is called an extension of the healer problem. A counterpoint there: in GURPS you prevent the hit with a Defense Roll, so the prevention is an active success. Lead: https://www.rpgpub.com/threads/tanks-in-ttrpgs-why-so-much-fuss.11345/
- **Being ignored is the fun part, if you have a punishment.** 4e defenders "are a lot more fun to play and much more powerful if enemies ignore them": they "get to do fun things like interrupt the attack, deal bonus damage, move their foes around, inflict conditions". Lead: https://tobolds.blogspot.com/2012/04/tactics-in-d-4e.html (Tobold's Blog) or the EN World "defender's masochism" thread.
- **The GM's side of it:** "If the defender's punishment mechanic never triggers, the defender's player is having less fun than they could have"; letting monsters break a mark sometimes is a gift to the player. Lead: http://onlinedungeonmaster.com/2011/09/12/how-should-a-dm-handle-a-monster-whos-marked/
- **Swordmage, Aegis of Shielding:** one player counted about 30 damage prevented over three encounters and translated it into "3-5 healing surges" for the party. Posters liked that it "doesn't require a successful hit to do its job" and "feels the most defending in play"; critics said it blocks damage but not conditions. Leads: https://www.enworld.org/threads/swordmage-4e-your-experiences.251374/ , https://forum.rpg.net/threads/4e-how-does-the-swordmage-play-out.416077/ , https://stirgessuck.wordpress.com/2009/01/05/my-life-as-a-swordmage-class-details/

### What the rules I read do about it

- **A number said out loud.** Draw Steel's Parry: the ally "takes half damage" [READ]. Half of a rolled number is a figure the table hears; a +2 to a defense is not. The Swordmage player above did the same thing by hand (counting prevented damage).
- **The protector moves.** Parry includes a shift of 1 square toward the ally; "No Dying on My Watch" (Tactician, level 2) moves the Tactician toward the damaged ally, lets the ally spend a Recovery and gain temporary Stamina, then frightens the attacker [READ]. The token crossing the map is the visible part.
- **The trigger is the enemy's turn, the payoff is the player's resource.** Censor gains wrath when the judged enemy damages it; Tactician gains focus when anyone damages the marked enemy [READ]. Protection feeds the player's next big turn instead of being a turn "lost".
- **A named interrupt, not a passive.** Every one of the Draw Steel protective tools is a named triggered action with a flavor line ("Your quick reflexes cost an enemy the precision they seek.") [READ].

### Synthesis (mine)

The complaints reduce to three, each with a known answer:
1. *"My best turn is the GM's turn"* → give the protector a real own-turn job (setting the mark, placing the ward) and make reactions **also** pay into their own resource.
2. *"Nobody sees what I prevented"* → protection that states a number (half, or minus N from a rolled total), moves a token, or changes who is hit. Avoid flat defense bonuses and auras (matches our existing "always-on bonuses are invisible").
3. *"The GM just plays around me"* → the mark must hurt in both branches (the two-sided test in section 1), and should pay something even when never triggered.

**For 2d12 (my reading):** the "explode before they see it coming" line in the brief is the strongest tool here. If each protect-reaction banks toward the nova (Draw Steel's wrath/focus pattern), then a round spent shielding is visibly loading the gun, and the invisible-protector problem and the soft-nova fantasy solve each other.

---

## 4. Moderate toughness: surviving in front without being a sponge

### What the rules say

**Draw Steel's numbers [READ]:** Censor 21 Stamina at level 1, +9 per level, 12 Recoveries. Tactician 21 / +9 / 10 Recoveries. Fury 21 / +9 / 10. Conduit (the healer) 18 / +6 / 8. So the "paladin" has the **same Stamina as the other front-liners but the most Recoveries of the four**: its toughness is depth across the day, not a bigger bar in the fight. And it spends that depth on others: "My Life for Yours" (triggered, Ranged 10): "You spend a Recovery and the target regains Stamina equal to your recovery value."
Sources: the four class files under https://github.com/SteelCompendium/data-md/tree/main/Rules/Classes

**Unarmored melee survives by reaction, not by a pool [READ]:** Fury's "Unearthly Reflexes": "You take half the damage from the triggering effect," plus a shift. "Furious Change": when you lose Stamina, gain temporary Stamina equal to Might; 1 Ferocity to also spend a Recovery.

**Lancer [READ]:** defenders are not uniformly thick. Drake HP 8 / Armor 3, Tortuga 8 / 2, but Gorgon HP 12 / Armor 0 defends by making attacks miss or need a save first. Black Witch (HP 6, Armor 1) protects adjacent allies with a parry reaction. Brace (a reaction any mech has) reduces a hit "at the cost of your next turn's actions": survival paid for with tempo.

**13th Age derivative Paladin [READ, caveat]:** heavy armor and the best AC, Lay on Hands as a **quick action** that heals "as if they had spent a recovery" (the paladin's own, as I remember 13th Age; unverified), Bastion: once per battle take half of a nearby ally's damage yourself.

**4e Swordmage (from memory, unverified; the wiki was blocked):** cloth or leather armor, Swordmage Warding gives +3 AC with a hand free, lower hit points and surges than the Fighter or Paladin. Aegis is a close burst 2 mark, a minor action; then the swordmage is free to walk away. Shielding: immediate interrupt, reduce the damage of the marked creature's attack on an ally (Con modifier + 5 per tier per a fan wiki [SNIPPET]). Assault: immediate reaction, teleport next to the marked creature and make a melee basic attack. Ensnarement: teleport the marked creature next to you. The design point: the swordmage is the one defender who **wants** to be away from its mark, because the aegis only fires when the marked creature attacks someone who is not the swordmage. It survives by not being there.

### What posters think (all [SNIPPET])

- Shielding called "basically the meanest thing you can do to a monster that doesn't require attack rolls or saving throws" and "far and away the best, because it allows you to play tag with the enemy". Dissent: "the reduced damage doesn't quite scale enough"; Assault "isn't a popular choice, but its the better one" and makes "a pretty hot second defender". Action clash noted: Shielding is an immediate interrupt and competes with the class's other immediate powers. Leads: https://www.enworld.org/threads/swordmage-4e-your-experiences.251374/ , http://www.giantitp.com/forums/archive/index.php/t-101137.html , https://paizo.com/threads/rzs2ifm7
- The 4e launch Paladin's failure was about reach and speed, not toughness (section 2).
- **Not researched (search budget):** the 5e Monk and PF2e melee-caster "tank that can't tank" threads. From memory, unverified: the common complaint about the 5e Monk is that the class is pushed into melee with a d8 hit die and must spend its main resource to defend itself, so defending and doing its job compete for the same points.

### Synthesis (mine)

Ways a soft front-liner stays up, by how well they fit the brief:
1. **Pays itself when it protects** (temporary Stamina, a Recovery, or resource on the trigger). Fits best: doing the job is what keeps you alive.
2. **Defends by reaction, not by a pool** (halve one hit a round). Readable, bounded, and a decision.
3. **Depth instead of height** (more Recoveries, same Stamina): tough across the day, not immune in the round. Draw Steel's Censor is exactly this.
4. **Is not where the hit lands** (Swordmage). Fits "can't take hits for you" but fights "stay in front".
5. **Thick armor and hit points.** The sponge; ruled out by the brief.

**The warning from the Monk pattern (unverified):** do not make the Paladin's self-defense and its ally-defense draw on the same scarce resource, or the player will always save it for themselves. Draw Steel avoids this by making the ally tool cost a Recovery (deep pool) and the self tool cost nothing extra.

---

## 5. "Don't let allies go down": mechanics liked more than plain healing

### What the rules say

**The ally's own reserve, triggered by someone else, is the Draw Steel standard [READ].**
- Conduit, Healing Grace (a Maneuver, so it does not cost the main action): "The target can spend a Recovery." Extra piety adds a target, ends an effect, stands a prone ally up, or adds a Recovery.
- Censor, The Gods Punish and Defend (3 wrath): holy damage, and "You can spend a Recovery to allow yourself or one ally within 10 squares to regain Stamina equal to your recovery value."
- Conduit, Drain: damage, and "You or one ally within distance can spend a Recovery."
- Tactician, Mark: an ally who damages the marked creature may spend a Recovery (1 focus). The healing is a **rider on the ally's own attack**.
- Tactician, No Dying on My Watch: move to the ally, they spend a Recovery and gain temporary Stamina, the attacker may be frightened.
- A dying hero cannot use Catch Breath on their own in combat: "While dying, you can't use the Catch Breath maneuver in combat." So the game makes another character's trigger the way back up, by rule.
Sources: Censor.md, Conduit.md, Tactician.md and Combat.md in https://github.com/SteelCompendium/data-md/tree/main/Rules

**Two different pools in one class [READ]:** the Censor's "My Life for Yours" spends the **Censor's** Recovery for the ally (sacrifice: the paladin's depth is the party's), while "The Gods Punish and Defend" is worded as the Censor spending a Recovery too. The Conduit and Tactician versions spend the **ally's**. Both patterns exist side by side; the sacrifice version is what makes 12 Recoveries on a 21-Stamina class make sense.

**The trigger of My Life for Yours [READ]:** "the target starts their turn or takes damage". It can answer the hit itself, at range 10, as a triggered action: death prevention and healing in one tool, with no "go down first" step.

**13th Age (derivative) [READ, caveat]:** everyone can rally once a battle as a standard action, spending a recovery; a second rally needs a save (11+). Paladin's Lay on Hands is a quick action. Fighter's Tough as Iron: rally as a quick action once per battle.

**Lancer [READ]:** Lancaster's Redundant Systems: adjacent characters can spend the Lancaster's Repairs as their own (the supporter's reserve, the ally's action).

### What posters think (all [SNIPPET])

- **4e's minor-action heal:** "they're minor actions specifically because the designers know that healing is otherwise a suboptimal option"; "A Leader can generally heal an ally and attack in the same turn". Healing surges are "your main daily resource". Leads: https://www.enworld.org/threads/you-dont-need-a-healer-in-4e-yeah-right.233472/ , https://egopoisoning.com/2015/07/22/im-seriously-going-to-talk-about-4e-class-roles-in-this-case/ , https://www.enworld.org/threads/the-art-of-leading-by-mkill.468821/
- **5e yo-yo healing:** blamed mostly on one spell: Healing Word is "way too powerful" at level 1 and "there is barely a cost to using it" (bonus action, at range). Posters report "much less problem with yo-yo healing from cure wounds or lay on hands", because those cost an action and need the healer to reach the ally. The underlying cause named: in-combat healing is too weak to keep someone up, so the only efficient heal is the one from 0. Lead: https://www.enworld.org/threads/house-rule-for-in-combat-healing-and-yoyo-at-0-hp.701034/page-8

### Synthesis (mine)

What separates the liked versions from the disliked ones:
1. **It does not eat the helper's turn** (4e minor action, Draw Steel maneuver or triggered action, 13th Age quick action). The helper still attacks.
2. **It is big enough to matter before 0.** A surge-sized heal (a quarter to a third of the ally's total) makes healing a wounded ally correct, which is the actual cure for yo-yo play. Small heals make "wait until they drop" optimal.
3. **It rides on something else** (an attack, a mark, a move).
4. **It spends a deep, shared-feeling reserve** (the ally's own, or the paladin's own on their behalf), so there is a daily cost and a real question of whose pool pays.
5. **It can fire on the hit** (death prevention) instead of after the fall.

**For 2d12 (my reading):** Rally Points already are the surge / Recovery pattern, so the Paladin's support can be "the cheapest and fastest way in the party to let an ally spend a Rally Point" (as a rider or a Reaction on the hit), and need not be a heal of its own. The Censor shows the paladin-flavored twist worth a decision from Lucas: does the Paladin trigger the **ally's** Rally Point (support), or spend **its own** for them (sacrifice, the "soft tank" who bleeds its depth instead of its hit points)? The second is a way to "take the hit for you" without taking the hit.

---

## Cross-cutting: the closest published match to the brief

Draw Steel's Censor is nearly the brief verbatim [READ]: its class text says censors "are at their best against the strongest foes" (divine action against one chosen enemy), it has front-liner Stamina without extra bulk, the deepest Recovery pool, a punishment mark with a soft taunt, heals by spending its own Recoveries at range as a reaction, and builds wrath from the duel toward 3-, 5- and higher-cost abilities (the nova). What it does **not** have, and 2d12 would need because it lacks a universal opportunity attack: any way to hold a line against enemies other than the judged one. For that, Lancer's engagement and 13th Age's intercept (section 2) are the models.

---

## Sources

### Read (rules text fetched from GitHub)
1. Draw Steel, Censor class: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Censor.md
2. Draw Steel, Tactician class: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Tactician.md
3. Draw Steel, Conduit class: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Conduit.md
4. Draw Steel, Fury class: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Classes/Fury.md
5. Draw Steel, Combat chapter: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Chapters/Combat.md
6. Draw Steel, Taunted condition: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Conditions/Taunted.md
7. Lancer, statuses (Engaged, Immobilized, Slowed): https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/statuses.json
8. Lancer, actions (Overwatch, Brace, Disengage): https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/actions.json
9. Lancer, talents (first 100,000 of 107,126 characters): https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/talents.json
10. Lancer, frames (first 100,000 of 140,094 characters): https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/frames.json
11. 5th-age-srd (fan adaptation of the 13th Age Archmage Engine), Combat: https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Character-Rules/Combat.md
12. 5th-age-srd, Paladin: https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Classes/Paladin.md
13. 5th-age-srd, Fighter: https://raw.githubusercontent.com/tylertitsworth/5th-age-srd/main/Classes/Fighter.md

Note on all 13: the fetch tool answers through a small model and refuses long verbatim quotes, so the quoted pieces are short and the rest is its paraphrase. Check a rule against the file before building on its exact wording. Lancer's rules.json was fetched but holds no rules prose.

### Could not read (found by search, used only as [SNIPPET] leads)
Blocked by the session's network unless noted.
- EN World: Tabletop Aggro https://www.enworld.org/threads/tabletop-aggro.281314/
- EN World: The defender's masochism https://www.enworld.org/threads/the-defenders-masochism.318677/
- EN World: Swordmage 4e, your experiences? https://www.enworld.org/threads/swordmage-4e-your-experiences.251374/
- EN World: How should taunting work? https://www.enworld.org/threads/how-should-taunting-work.658133/page-5
- EN World: You don't need a healer in 4E... yeah right! https://www.enworld.org/threads/you-dont-need-a-healer-in-4e-yeah-right.233472/
- EN World: The Art of Leading (mkill) https://www.enworld.org/threads/the-art-of-leading-by-mkill.468821/
- EN World: The Art of Defending (mkill) https://www.enworld.org/threads/the-art-of-defending-by-mkill.469247/
- EN World: house rule for in-combat healing and yo-yo at 0 HP https://www.enworld.org/threads/house-rule-for-in-combat-healing-and-yoyo-at-0-hp.701034/page-8
- RPG.net: [D&D 4e] Defenders and their Mark https://forum.rpg.net/index.php?threads/d-d-4e-defenders-and-their-mark.465144/
- RPG.net: [4E] Improving Divine Challenge https://forum.rpg.net/index.php?threads/4e-improving-divine-challenge.443034/
- RPG.net: [4e] How does the Swordmage play out? https://forum.rpg.net/threads/4e-how-does-the-swordmage-play-out.416077/
- GiantITP: Building a better Taunt https://forums.giantitp.com/showthread.php?p=26174722
- GiantITP: Breakdown the Swordmage http://www.giantitp.com/forums/archive/index.php/t-101137.html
- GiantITP: thread t-204842 (Swordmage) and t-635394 (13th Age intercept) https://forums.giantitp.com/archive/index.php/t-204842.html , https://forums.giantitp.com/archive/index.php/t-635394.html
- Paizo: Guardian Class Feedback https://paizo.com/threads/rzs4aipp&page=3 ; Intercept Attacks kept as is https://paizo.com/threads/rzs6ofb6 ; Just ran a playtest with the guardian https://paizo.com/threads/rzs4cn3j ; Swordmage Powers https://paizo.com/threads/rzs2ifm7
- RPGPub: Tanks in ttrpgs, why so much fuss? https://www.rpgpub.com/threads/tanks-in-ttrpgs-why-so-much-fuss.11345/
- RPGBot: The Tank Fallacy https://rpgbot.net/the-tank-fallacy/ (not attempted after the block; snippet only)
- itch.io blog: tanking in ttrpgs https://itch.io/blog/1125694/tanking-in-ttrpgs
- Dragna Carta: The scapegoat problem, why 5e's martial... https://dragnacarta.substack.com/p/the-scapegoat-problem-why-5es-martial (title only, nothing used)
- Cat's Musings https://conchcat.bearblog.dev/02252026-01/ (title only, nothing used)
- r/RPGdesign: Tank subclasses (redlib mirror) https://redlib.hyperreal.coffee/r/RPGdesign/comments/1guqn8f/tank_subclasses/ (nothing used)
- Invincible Ink: 4e, the Paladin's Engagement https://press.invincible.ink/4e-the-paladins-engagement/ (not attempted; snippet only)
- Tobold's Blog: Tactics in D&D 4E https://tobolds.blogspot.com/2012/04/tactics-in-d-4e.html (not attempted; snippet only)
- Online Dungeon Master: How should a DM handle a monster who's marked? http://onlinedungeonmaster.com/2011/09/12/how-should-a-dm-handle-a-monster-whos-marked/ (not attempted; snippet only)
- Ego Poisoning: 4e class roles https://egopoisoning.com/2015/07/22/im-seriously-going-to-talk-about-4e-class-roles-in-this-case/ (not attempted; snippet only)
- Stirges Suck: My Life as a Swordmage https://stirgessuck.wordpress.com/2009/01/05/my-life-as-a-swordmage-class-details/ (not attempted; snippet only)
- Dungeon Solvers, Muse Dungeon, D&D Beyond forums on 5e tanking and Sentinel (links in section 2; not attempted; snippet only)
- D&D 4e wiki: Swordmage https://dnd4.fandom.com/wiki/Swordmage
- Pelgrane: 13th Sage mailbag, disengaging https://pelgranepress.com/2022/08/07/13th-sage-mailbag-shocked-condition-and-disengaging/ and the Archmage Engine SRD PDFs
- Steel Compendium site https://steelcompendium.io/ (its data was read from GitHub instead)
- Archives of Nethys (Guardian) https://2e.aonprd.com/ ; the Foundry pf2e repository paths I guessed for Taunt and Intercept Attack returned 404
- Tribality https://www.tribality.com/?p=6459 ; Wikipedia, Tank (video games); web.archive.org (refused by the fetch tool itself)

### Not researched at all (search budget ended)
- PF2e Champion reaction: how it feels in play (waiting on the GM, the GM avoiding the trigger).
- 5e Monk and PF2e melee casters as "tank that can't tank".
- How 13th Age's intercept plays at the table (opinions).
- The Alexandrian, Sly Flourish, The Angry GM, Matt Colville's videos and MCDM design diaries on tanking, the Tactician and the Censor. One search for MCDM's reason for making Taunted a penalty found no designer statement.
- Level Up / A5E design notes; Game Developer (Gamasutra) pieces on tank design.
- r/RPGdesign, r/Pathfinder2e, r/dndnext, r/4eDnD threads (no Reddit page was reachable or returned by search).
- Lancer's Saladin, Zheng, Napoleon frames and community opinion on Lancer defenders.
- ICON (the earlier research file's open item).

### To finish this properly
Allow these hosts in the environment's network settings, then rerun: www.enworld.org, forum.rpg.net, forums.giantitp.com, paizo.com, 2e.aonprd.com, pelgranepress.com, dnd4.fandom.com, rpgbot.net, www.rpgpub.com, old.reddit.com, thealexandrian.net, slyflourish.com, theangrygm.com, tobolds.blogspot.com, press.invincible.ink. And raise the web search budget (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION) or run this topic in its own turn.
