# Research C: the PF2e Champion (and Guardian), and "divine against profane" as a mechanic

Date: 2026-11-14. For the Paladin redesign (soft tank, soft support, soft nova; divine against profane).

## READ THIS FIRST: how far to trust this file

- **No page could be opened directly in this session.** The environment's network allowlist is empty: every fetch (2e.aonprd.com, paizo.com, rpgbot.net, enworld.org, pf2easy.com, reddit.com) was refused, and a request to allow those hosts was rejected. Reddit is also closed to the search tool itself.
- Everything below therefore comes from **WebSearch result summaries** (the search tool reads the pages and relays text). Where the tool relayed rule text word for word, I mark it **[relayed text]**; treat it as "very probably the page's words, not checked by me against the page". Poster quotes are marked the same way and **must be re-checked before being quoted anywhere**.
- Anything I added from my own memory is tagged **(from memory, unverified)**.
- The search budget for the turn ran out (limit of 200 shared calls) before the last topics were covered. The gaps are listed in section 7.
- "Rules say" and "posters think" are kept in separate subsections.

---

## 1. The PF2e Champion: what the rules say

### 1.1 The frame (Remaster, Player Core 2)

- **Champion's Aura** [relayed text, Archives of Nethys class page]: "You're surrounded by an aura in a 15-foot emanation. It has the aura and divine traits. Any follower of your deity within the aura immediately knows you're a champion of your deity. This aura is used as the range for your champion's reaction and for various other effects. You can suppress or resume the aura as a single action, which has the concentrate trait, and it ends if you fall unconscious." Source: https://2e.aonprd.com/Classes.aspx?ID=58
  - Design note: the Remaster turned "within 15 feet" into a named aura, so that feats and other rules can refer to it and change it (Paizo preview, relayed by Bell of Lost Souls: a "defined champion's aura for your reactions, aura feats, and other abilities"). Sources: https://paizo.com/blog/player-core-2-preview-the-champion-remastered , https://www.belloflostsouls.net/2024/06/preview-the-new-remastered-champion-class-from-pathfinder-player-core-2.html
- **Causes and sanctification** (Paizo preview, relayed): the cause no longer follows alignment. Justice, Liberation and Obedience are open to all; Redemption and Grandeur only to holy champions; Desecration and Iniquity only to unholy ones. Sanctification is optional for some causes. Source: https://paizo.com/blog/player-core-2-preview-the-champion-remastered
- **The common trigger** of the protective reactions [relayed]: "An enemy damages your ally, and both are in your champion's aura." **The common payload:** "the ally gains resistance to all damage against the triggering damage equal to 2 + your level." Sources: https://2e.aonprd.com/Causes.aspx , https://app.demiplane.com/nexus/pathfinder2e/classes/champion-rm

### 1.2 The reaction of each cause

| Cause (old name) | Reaction | What it adds to "ally resists 2 + level" | Confidence |
|---|---|---|---|
| Justice (Paladin) | Retributive Strike | "If the enemy is within reach, make a melee Strike against it." | relayed (d20pfsrd, EN World poster) |
| Redemption (Redeemer) | Glimpse of Redemption | The enemy chooses: repent (the ally takes no damage) or refuse (the ally resists 2 + level and the enemy is enfeebled 2 until the end of its next turn). | relayed (third-party wiki; already known to the project) |
| Liberation (Liberator) | Liberating Step | Trigger is wider: "An enemy damages, grabs, or restrains your ally". The ally resists if damaged, may try to break free of grabbed / restrained / immobilized / paralyzed, and "can Step as a free action". | relayed (AoN Liberation page, Demiplane) |
| Grandeur (new) | Flash of Grandeur | "Until the end of your next turn, the attacker is affected by revealing light." | relayed (Demiplane / AoN) |
| Obedience (Tyrant) | Iron Command | "You command your enemy to kneel before you in obedience. If they dare to refuse, they must pay the price in pain and anguish." The enemy chooses kneel (prone) or mental damage. The exact damage dice were not read. | partly relayed |
| Desecration (Desecrator) | Selfish Shield | Protects **you only**: "You gain resistance against the triggering damage equal to 2 + half your level", plus offensive pressure on the attacker. | relayed |
| Iniquity (Antipaladin) | Destructive Vengeance | "You increase the amount of damage you take by 1d6, and you deal 1d6 spirit damage to the triggering enemy" (2d6 at 5, 3d6 at 9, 4d6 at 12, 5d6 at 16, 6d6 at 19), and "until the end of your next turn, your Strikes against the triggering creature deal 2 extra spirit damage." | relayed |

Sources: https://2e.aonprd.com/Causes.aspx , https://2e.aonprd.com/Causes.aspx?ID=9 (Grandeur), https://2e.aonprd.com/Causes.aspx?ID=12 (Liberation), https://app.demiplane.com/nexus/pathfinder2e/classes/champion-rm , https://pf2.d20pfsrd.com/class/champion/ , https://theroleplayersguild.com/articles/pf2e/classes/champion

**Upgrades of the reaction (the same card grows; no new card):**
- Level 9, **Relentless Reaction**: the enemy also takes persistent spirit damage equal to your Charisma modifier (Grandeur and Justice relayed; Liberation: only "if the triggering enemy was using any effects to make your ally grabbed, restrained, immobilized, or paralyzed").
- Level 11, **Exalted Reaction**: the reaction spreads. Liberation [relayed]: "you and all other allies in your champion's aura can Step as a free action". Grandeur: the revealing light extends to other enemies in the aura. Legacy Paladin (relayed from an older guide): each ally within 15 feet with the target in reach may Strike it at a penalty; legacy Redeemer: the resistance may go to you and all allies within 15 feet at reduced value.
- **Revealing light** (what Flash of Grandeur applies) [relayed, AoN spell page]: the creature is dazzled; "if the creature was invisible, it becomes concealed instead. If the creature was already concealed for any other reason, it is no longer concealed." Source: https://2e.aonprd.com/Spells.aspx?ID=1653 . A Paizo thread notes GMs disagree on whether it also cancels the concealment its own dazzle causes: https://paizo.com/threads/rzs7vul5

### 1.3 Lay on Hands (a focus spell, 1 action)

- [relayed, Demiplane remaster entry and legacy mirrors] A willing living target regains **6 Hit Points**; if the target is someone other than yourself, it also gains **+2 status bonus to AC for 1 round**. Against an undead: "The target takes 1d6 vitality damage with a basic Fortitude save; on a failure, the target also takes a -2 status penalty to AC for 1 round." Heightened (+1): +6 healing, +1d6 damage. The Remaster removed the components and gave it the manipulate trait.
- It is a focus spell: 1 Focus Point, back after 10 minutes of Refocus, so it is an every-fight resource, not a daily one (from memory, unverified on a page this session).
- An errata / FAQ line [relayed, Paizo Remaster FAQ] lets a feat make it offensive against any wrongdoer: "You can use lay on hands to damage a creature you witness harming an innocent or a ally as if it were undead; in this case, lay on hands deals spirit damage instead of vitality damage and gains the holy trait." **This is "profane by behaviour" in a printed rule: the target counts as undead because of what it did.**
- Sources: https://app.demiplane.com/nexus/pathfinder2e/spells/lay-on-hands-rm , https://pf2.d20pfsrd.com/focus/lay-on-hands/ , https://paizo.com/pathfinder/remaster/faq

### 1.4 Shield, weapon, speed: Blessing of the Devoted (level 3; legacy "Divine Ally")

- **Legacy Divine Ally** [relayed text]: *Blade Ally*: "Select one weapon or handwraps of mighty blows when you make your daily preparations. In your hands, the item gains the effect of a property rune and you also gain the weapon's critical specialization effect." (good: disrupting, ghost touch, returning, shifting; evil: fearsome, returning, shifting). *Shield Ally*: "In your hands, the shield's Hardness increases by 2 and its HP and BT increase by half." *Steed Ally*: a young animal companion as a mount. The choice was permanent.
- **Remaster Blessing of the Devoted** [relayed, AoN class page]:
  - *Blessed Armament*: the armament's critical specialization, and one property rune from "fearsome, ghost touch, returning, shifting, or vitalizing", changeable at daily preparations.
  - *Blessed Shield*: "In your hands, a shield gains the minor reinforcing rune" (it rises with level; if the shield already has it, Hardness +1 instead).
  - *Blessed Swiftness*: "You gain a +5-foot status bonus to Speed. If you're mounted, your mount gains the bonus instead." And: "when the movement of one of your allies triggers an enemy's reaction while the ally is in your champion's aura, the ally gains a +2 status bonus to all defenses against that reaction."
- **Shield Block** is a class feature from level 1 (general rule: a reaction that reduces the damage by the shield's Hardness; you and the shield take the rest) (from memory, unverified this session). It competes with the champion's reaction for the one reaction a round; an EN World poster names this as a limit (section 2.2).
- Sources: https://2e.aonprd.com/Classes.aspx?ID=58 , https://app.demiplane.com/nexus/pathfinder2e/class-features/blessed-shield-rm , https://www.worldanvil.com/block/727660 , https://app.demiplane.com/nexus/pathfinder2e/classes/champion

### 1.5 Feats

Read (relayed):
- **Smite** (Remaster, feat 6, 1 action, concentrate; Player Core 2 p. 96) [relayed, AoN]: you designate one enemy you can see; your Strikes against it get a **status bonus to damage of +3 (+4 with master proficiency)** until the start of your next turn; **if you are holy / unholy and the target has the opposite trait, +4 (+6)**. "If the target takes a hostile action against you or one of your allies before the start of your next turn, the duration extends to the end of that enemy's next turn." Source: https://2e.aonprd.com/Feats.aspx?ID=5901
  - **This is the textbook answer to "Smite Evil does nothing against non-evil": the declared target always gets the bonus, the profane one gets a bigger one (+1 or +2), and the Smite sustains itself for free while the enemy keeps misbehaving.**
- **Ranged Reprisal** (legacy, Paladin only): Retributive Strike with a ranged weapon. Renamed **Nimble Reprisal** in the Remaster (Foundry pf2e changelog). Sources: https://pathfinder2.dragonlash.com/classes/champion/champion-feats/ranged-reprisal/ , https://github.com/foundryvtt/pf2e/wiki/Remaster-Changes
- **Divine Grace** [relayed, older source]: "You call upon your deity's grace, gaining a +2 circumstance bonus to the save." (a reaction to a saving throw against a spell; level 2) (level from memory, unverified).
- **Aura of Courage** [relayed, legacy]: "You stand strong in the face of danger and inspire your allies to do the same." (legacy: tenets of good). Its effect, from memory, unverified: when you become frightened, reduce the value by 1; at the end of your turn, allies within 15 feet who are frightened reduce theirs by 1 too.
- **Expand Aura**: legacy version is a level 16 feat (Advanced Player's Guide table, relayed); a Remaster guide describes it as "a temporary 30-foot aura" (https://theroleplayersguild.com/articles/pf2e/classes/champion). The exact Remaster level and action cost were not read.
- **Divine Reflexes**: an extra reaction each round usable only for the champion's reaction (guide, relayed; level not read).
- **Shield Paragon** (level 20, requires blessed shield) [relayed, AoN]: the shield is always raised; "If the shield would be destroyed, it vanishes to your deity's realm instead."
- Guides list **Defensive Advance, Quick Shield Block, Shield Warden** as the shield build's priority feats, without text.

Not read; from memory, unverified:
- *Quick Shield Block*: one extra reaction each round, only for Shield Block.
- *Shield Warden* (feat 6): you may Shield Block when an adjacent ally is hit, not only yourself.
- *Legacy Smite Evil* (feat 6, needed blade ally): +4 good damage (+6 with master) on Strikes against one foe for 1 round, extended while that foe attacks your allies. The Remaster Smite keeps the shape and drops the "evil only" gate.
- *Legacy Divine Smite* (level 9): persistent good damage equal to Charisma on a Retributive Strike hit; this became the Relentless Reaction.

### 1.6 The Guardian (Battlecry!, 2025): Paizo's later tank

- **Taunt** (1 action, concentrate) [relayed, PathDB and AoN]: choose an enemy within **30 feet**; if the taunted enemy takes a hostile action that includes an ally but not you, it takes a **-1 circumstance penalty to attack rolls and DCs for that action** and becomes **off-guard until the start of its next turn**. It lasts until the start of your next turn; one Taunt at a time. No check, no save in the final version (RPGBot: "with no checks or saves"). Sources: https://pathdb.net/classes/guardian , https://2e.aonprd.com/Classes.aspx?ID=67 , https://rpgbot.net/p2/characters/classes/guardian/
  - The **playtest** Taunt was different: a Will save, and the taunted enemy got a **+2 bonus against the Guardian** (forum relays). That bonus is what the "Taunt is Bad" thread attacks.
- **Intercept Attack** (reaction) [relayed]: trigger "an ally within 10 feet of you takes physical damage. You can Step, but you must end your movement adjacent to the triggering ally. You take the damage instead of the triggering ally." It bypasses your AC (RPGBot). An archetype feat adds resistance to that damage equal to half level in medium or heavy armor.

---

## 2. The PF2e Champion: what players say

All of this is forum opinion, relayed by the search tool. Reddit could not be searched at all.

### 2.1 Praise

- The reaction as a **catch-22**: a Paizo thread's own summary of the class is "You can attack my allies and take a Champion's Reaction, or you can attack durable me and go through my Shield Block." (thread: "PSA: All-champion ... parties are terrifying catch-22s", https://paizo.com/threads/rzs42phm )
- "A disincentive to attack anyone else is all it takes to be an effective tank"; "unlike other martials, the champion has ways to discourage enemies from attacking the squishies"; at a shield champion's table "the rest of the players expect the champ to stay up and only worry if he is getting pummeled". (Paizo threads surfaced: https://paizo.com/threads/rzs6a2c1 , https://paizo.com/threads/rzs43be1 )
- EN World play report (Extinction Curse): the champion "has proven to be a very effective tank" and the reaction "turned out to be surprisingly effective". https://www.enworld.org/threads/play-report-extinction-curse-spoilers.670199/page-3
- EN World defenders: "it's a defender class, not a striker"; if the defensive powerhouse had a rogue's or fighter's offense "something would be very wrong"; an enemy who ignores the champion "faces a set of bad choices". https://www.enworld.org/threads/i-think-i-am-giving-up-on-pf2er.704710/page-25
- GMs find it *too* good at high level: the champion's AC and repeated blocking are "super annoying as a GM". https://paizo.com/threads/rzs43xyj

### 2.2 Complaints

1. **The 15 feet.** "Wishes for the Remastered Champion" (Paizo, January 2024): the range never grows "outside of a class feat at level 16" while enemies get bigger; 15 feet is "far too short a range given how battlefields set up and flanking works"; proposals: 30 feet, or only the enemy in range and the ally within the enemy's reach. A dissenter does not want the range to protect an offensive flank around a huge dragon. Another thread: it is unreasonable to ask allies to stay within 15 feet all the time. https://paizo.com/threads/rzs43xdv , https://paizo.com/threads/rzs431wu
   - EN World: "you have to be perfectly placed to use it", and against something larger than Large "you're probably too far away from your ally to help".
2. **Retributive Strike needs reach on top of the aura.** Guides say the Paladin wants a reach weapon, and that being just out of reach is frustrating at low level; the Redeemer has no such need, and one Paizo poster ranks the Paladin "the weakest of the three Good Champion types" and the Redeemer "the most reliable". https://paizo.com/threads/rzs43xyj , https://rpgbot.net/p2/characters/classes/champion/
3. **Enemies learn.** RPGBot's "Tank Fallacy" (applied to the evil causes whose reaction triggers only when *you* are hit): the reaction "becomes largely useless once enemies figure it out". The mirror complaint, EN World: nothing compels an enemy ("he doesn't have the ability to mark enemies or compel them to attack him"); the reaction only makes attacking others worse. Paizo ("Midnight's thought", April 2025): before level 7 "the champion doesn't have anything that truly makes him a tank", it is "essentially a fighter" with a shield; replies answer that Shield Block is "about 25% of total hp at first level, every turn".
4. **One reaction a round.** An EN World "PF2 Peeves" poster: Shield Block and Retributive Strike compete for the same reaction. A Paizo poster: the champion works best when it is not the only one in melee, because "a reaction that never triggers is dead weight". https://www.enworld.org/threads/pf2-peeves.652918/
5. **Reactive, never proactive; dull turns.** Paizo blog comment on the playtest: paladins "are still reactive rather than proactive". RPGBot: the class is boring for less tactical players, who "may feel like all they do is attack and raise their shield". EN World critics: enemies have little reason to target a champion because its damage is low.
6. **Weak early feats.** "Champions practically lack strong level 2/4 feats as oaths are situational." (Paizo, https://paizo.com/threads/rzs6a2c1 )

### 2.3 The Guardian's reception

- **Playtest (2024), harsh on Taunt.** "Taunt is Bad" (Paizo): until level 4 a Guardian who Taunts ends "with a worse 'AC' (due the enemy +2 bonus) than any other melee martial"; it "doesn't feel like an action I want to use"; "a debuff and not a taunt"; a one-round duration is "the biggest design whiff"; "Taunt being a will save that affects mindless creatures rubs me the wrong way"; weak against bosses. A thread is named "Neo tank fallacy". https://paizo.com/threads/rzs4anca , https://paizo.com/threads/rzs4al13 , https://paizo.com/threads/rzs4b18d
- **Release (2025), warmer.** The final Taunt lost the save and the enemy's bonus. A defender: "Taunt is not a magical compulsion that forces anyone to follow it", it is a soft taunt and the GM still decides. RPGBot still calls it "a persistent tax on your action economy" (1 action every round). Role Players Guild: Taunt is "both defense and setup" (the off-guard helps the whole party), and Intercept Attack is "enormous when used on the right hit". A one-shot report: "amazing battlefield presence compared to Champions" but "self-sustain is rather lackluster". https://paizo.com/threads/rzs6pfkg , https://paizo.com/threads/rzs6u28g , https://theroleplayersguild.com/articles/pf2e/classes/guardian
- **Against the Champion.** Posters: the champion's reaction has 15 feet where Intercept is "melee-ish"; the champion can counter-attack; Intercept "is also self limiting as you take damage from it"; the champion "forces" the enemy to drag a victim away to switch the reaction off, which Taunt does not. Others find Intercept stronger for a fragile ally because it needs no save and removes the whole hit. https://paizo.com/threads/rzs4aipp , https://paizo.com/threads/rzs4abrr
- Meeple Mountain review: Taunt at least makes "the GM stop to think about their decision of who to attack". https://www.meeplemountain.com/reviews/pathfinder-battlecry/
- An itch.io essay ("tanking in ttrpgs", relayed): taking more damage does not make a tank; a tank needs control over the enemy's choices and a way to protect allies. https://itch.io/blog/1125694/tanking-in-ttrpgs

---

## 3. "Divine against profane": what the rules say

### 3.1 PF2e Remaster: holy, unholy, sanctification

- [relayed, Demiplane's Sanctification rule] Holy and unholy are **traits**, not damage types. Holy "signals devotion to altruism, helping others, and battling against unholy forces like fiends and undead". A character has holy, unholy or neither, never both. An ability with the **sanctified** trait takes your trait when you use it. A deity says you "can be" or "must be" holy or unholy. https://app.demiplane.com/nexus/pathfinder2e/rules/sanctification-rm , https://2e.aonprd.com/Traits.aspx?ID=519
- Good / evil / lawful / chaotic damage is gone; the new neutral type is **spirit** damage, which "will work on anything with a soul" (forum relay). A sanctified champion's Strikes carry the holy trait, which only matters against a creature with a weakness to holy. Errata replaced "weakness 7 to good" by "weakness 7 to holy" in *litany of righteousness*. https://paizo.com/pathfinder/remaster/faq , https://paizo.com/threads/rzs43vtg
- Undead are not automatically unholy (forum relay); the anti-undead lever is **vitality** damage instead (Lay on Hands, the vitalizing rune).
- Typical size of the weakness on fiends (5, 10, 15 by level): from memory, unverified; no Monster Core page was read.

### 3.2 D&D 5e (2014 SRD) [relayed text]

- **Divine Smite**: "The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8." The base (2d8 radiant for a 1st-level slot, +1d8 per slot level, decided after the hit) works on anything.
- **Divine Sense**: "You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity."
- **Turn the Unholy** (Oath of Devotion): "Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw."
- **Sacred Weapon** (Oath of Devotion): "The weapon emits bright light in a 20-foot radius and dim light 20 feet beyond that."
- **2024**: Divine Smite is a spell (bonus action, so once a turn, never on an Opportunity Attack; one free use per long rest), 2d8 radiant, still +1d8 against fiends and undead; Divine Sense became a Channel Divinity use lasting 10 minutes; one source says Turn the Unholy was removed from Devotion.
- **Vow of Enmity** (Vengeance): 2014: bonus action, 10 feet, advantage on attack rolls against one creature for 1 minute (the advantage and the minute are from memory, unverified); 2024: no action (part of the Attack action), 30 feet, and you may move it to another target when the first drops to 0.
- **2024 Ranger's Favored Enemy**: no creature type at all; Hunter's Mark always prepared with free casts (2 a day, rising to 6).
- Sources: https://dnd-srd-sphinx.readthedocs.io/en/latest/class/paladin.html , https://5thsrd.org/character/classes/paladin/ , https://www.dndbeyond.com/posts/1749-2024-paladin-vs-2014-paladin-whats-new , https://www.wargamer.com/dnd/2024-paladin , https://www.wargamer.com/dnd/ranger-changes

### 3.3 D&D 4e

- **Turn Undead** (cleric, encounter, close burst) [relayed, 4e wiki]: 1d10 + Wisdom radiant, **push up to 3 + Charisma modifier squares**, immobilized until the end of your next turn; half damage on a miss. The clearest "holy as forced movement" precedent. https://dnd4.fandom.com/wiki/Turn_undead
- **Radiant**: undead commonly take extra radiant damage or lose insubstantial when hit by it (4e wiki, relayed). https://dnd4.fandom.com/wiki/Radiant
- **The "radiant mafia"** (relayed): a party in which one character (typically the Morninglord paragon path, whose level 16 feature makes a target hit by radiant vulnerable to radiant) hands out radiant vulnerability and everyone else deals radiant. Every divine class could join. **The lesson: there the "holy" bonus was not gated on a creature type; it was a status the party applied, so it worked in every campaign, and it became the strongest party build in the game.** https://press.invincible.ink/how-to-be-the-castlevania-gang-in-4e-dd/ , https://dnd4.fandom.com/wiki/Morninglord , https://cjsgrimoire.wordpress.com/2011/05/16/the-radiant-mafia/
- Paladin's Divine Challenge (a mark: the marked enemy takes radiant damage when it attacks someone else): from memory, unverified.

### 3.4 D&D 3.5 and Pathfinder 1e Smite Evil

- **3.5** [relayed from forum quotes of the rule]: one smite a day at level 1, one more per five levels; "If the paladin accidentally smites a creature that is not evil, the smite has no effect, but the ability is still used up for that day." A miss also spends it.
- **Pathfinder 1e** (relayed from forum quotes of the errata): the smite lasts until the target is dead, bypasses damage reduction, adds Charisma to attack and level to damage; against evil outsiders, evil dragons and undead the level bonus is doubled, after errata only "on the FIRST successful attack".

### 3.5 Declared targets: Draw Steel and 13th Age

- **Draw Steel, Censor's Judgment** [relayed, Steel Compendium]: a maneuver, ranged 10, one enemy: "The target is judged by you until the end of the encounter, you use this ability again, you willingly end this effect (no action required), or another censor judges the target." Riders: "Whenever a creature judged by you uses a main action and is within your line of effect, you can use a free triggered action to deal ... holy damage to them" (twice your Presence; 4 on the pregenerated sheet). Spend 1 wrath when judging: a target with low Presence is frightened (save ends); if it already is, it takes holy damage instead. Further 1-wrath free triggered actions against the judged target exist (the list was cut off). Each order adds a first-use-per-turn rider: Oracle deals holy damage, Paragon vertically pulls the judged creature, Exorcist teleports you toward it. **The class's whole "against the profane" identity is a mark the player places; no creature type is involved.** https://steelcompendium.io/v2/Browse/feature/ability/censor/level-1/judgment/ , https://files.mcdmproductions.com/DrawSteel/HumanCensor.pdf
- **13th Age, Smite Evil** [relayed, SRD]: "As a free action before you make a paladin melee attack roll, you can declare that you're using a Smite Evil attack. Add +1d12 to the damage roll AND deal half damage with the attack if it misses." Once per battle plus Charisma modifier times per day (relayed from another source). Despite the name it has no evil-only gate (from memory, unverified). **Paladin's Challenge** (one version, relayed): on a melee hit, challenge the enemy as a free action; until the battle ends, you and it each take -4 to attacks against anyone else; one challenge at a time. https://www.13thagesrd.com/classes/paladin/

### 3.6 Holy light as a tool (what was found)

- PF2e **Flash of Grandeur**: the champion's reaction puts revealing light on the attacker (dazzled, invisible becomes concealed, concealment removed) until the end of the champion's next turn; at level 11 on every enemy in the aura. The only class reaction found that uses light as its punishment. (1.2)
- PF2e's legacy **Light of Iomedae** (relayed): the light does not make invisible undead visible but "does make it easy to pinpoint the exact squares where they are".
- 5e **Sacred Weapon** sheds bright light for 20 feet and dim light for 20 more (a real counter to darkness; it reveals nothing by itself).
- **Consecrate** (3.5 SRD, relayed): undead in the area take -1 to attack rolls, damage rolls and saves, and "cannot be created within or summoned into a consecrated area"; the numbers double with an altar. An older version: undead take 1 damage a round inside. https://www.dandwiki.com/wiki/SRD:Consecrate
- 4e **Turn Undead**: a burst that pushes and immobilizes (3.3). 5e Turn the Unholy: the turned creature must spend its turns moving away (from memory, unverified).

---

## 4. "Divine against profane": what players and designers say

1. **PF2e Remaster: weaker and more campaign-dependent for the champion's feats, better for landing the weakness.** One Paizo poster: the change lets "an otherwise low damage martial trigger fiend weaknesses from level 1", but "many feats which dealt good damage before now deal spirit damage, but only to unholy creatures", which he calls downgrades. Others: the trait by itself does "pretty much nothing" without a weakness; with it, "you're leaving a lot of damage on the table if you aren't triggering weakness against fiends". https://paizo.com/threads/rzs43vtg , https://paizo.com/threads/rzs534t3 , https://paizo.com/threads/rzs43y1z
2. **The campaign thread** ("Advice on Champion characters in APs without many Unholy enemies?", Paizo, February 2024; a Kingmaker GM). Advice given: tell the player in session 0; the GM "can always add sanctified/unholy to specific NPCs" or swap in fiends and undead of the same level; skip the anti-unholy feats; house-rule them to plain spirit damage. A report from a hobgoblin-army campaign: the anti-evil feats were lackluster and **the value came from the Champion's Reaction and Shield Block**. https://paizo.com/threads/rzs43xyj
   - Reading: the class survived a campaign with no profane enemies only because its core never depended on them.
3. **Favored Enemy is the named version of the problem.** EN World: it is "worthless because it never comes up, it's too good because it comes up all the time, or it's somewhere in between", and "we aren't given a baseline to work off of". Paizo (PF1): poor design because it needs the GM to build the game around one character; one of two central abilities "can go unused for long stretches". https://www.enworld.org/threads/ranger-problems-favored-enemy-presentation-choices-and-capstones.469425/ , https://paizo.com/threads/rzs2jwl3
   - Fixes posters list: make it a ribbon (5e 2014: exploration and social only); **remove the type and let the player mark a target** (Hunter's Mark, which the 2024 ranger made official); let the player re-choose.
   - Reception of the 2024 fix: it solved the dependency and created a new complaint. Hunter's Mark needs concentration and a bonus action, and Wargamer's headline is "Even with new rules, DnD fans still dislike the Ranger". **A declared mark must be cheap to place and must not fight the class's other buttons.**
4. **3.5 Smite Evil.** Forum posters: "woefully underwhelming"; "1 smite / 4 level, is ridiculous"; a miss wastes it; many encounters are not evil. Fixes: more uses, the Gray Guard (smite anyone "aiding and abetting evil", an early behaviour-based gate), "always add cha bonus to damage and have smite evil deal double total damage". https://forums.giantitp.com/archive/index.php/t-533647.html , https://www.enworld.org/threads/paladin-smite-question-3-5.274201/
5. **PF1 Smite Evil: the opposite failure.** Threads named "Smite Evil too powerful" and "Dealing with Smite Evil"; one poster: "In PF1, Smite ruined a lot of climatic fights". The GM's usual counter was to make the villain not evil ("No evil, no smite evil"), which is the favored-enemy problem again from the other side. Jason Bulmahn's reply to calls for a nerf (relayed): "No, please don't fix the 'problem'"; only the doubled damage was cut to the first hit. One fan fix: the smite as a binding vow (keep attacking the target or lose it). https://paizo.com/threads/rzs2ku9d , https://paizo.com/threads/rzs2mw99 , https://minmaxforum.com/index.php?topic=6578.0
6. **5e Divine Smite** is the accepted middle: full value against everything, +1d8 against fiends and undead. The 2024 change (once a turn, a bonus action, not on reactions) was aimed at the nova, not at the type bonus.
7. **Type systems as a straitjacket** (Age of Dusk blog, relayed): a comprehensive type-based system "tended to act like a straight-jacket for new creations". 4e made Undead a keyword instead of a type. https://princeofnothingblogs.wordpress.com/2025/11/08/on-enemy-design/

---

## 5. Takeaways for the Paladin brief (my reading, not sources)

1. **The Champion is the brief's "soft tank": it never takes the hit, it makes the hit smaller and costly.** One reaction, a fixed aura, "ally resists 2 + level, then my cause's rider". Tables praise the dilemma it creates and complain about four things: the range, a second gate on top of the range (reach), one use a round, and nothing to do on its own turn.
2. **The rider is the identity.** Seven causes share one trigger and one payload and differ by one clause (a Strike, the enemy's choice, a free Step, revealing light, kneel or pain). That is "one main thing and at most one rider" exactly.
3. **Avoid double gates.** Retributive Strike needs aura and reach, and is rated the least reliable; Glimpse of Redemption needs only the aura and is rated the most reliable.
4. **The reaction grows instead of multiplying:** persistent damage at 9, the whole aura at 11, a second reaction by feat.
5. **Soft taunts are accepted only when cheap and free of a self-penalty.** The Guardian's playtest Taunt (a save, +2 for the enemy against you) was rejected; the final one (-1 and off-guard when it ignores you, no roll) was accepted but is still called an action tax.
6. **Against the profane, the settled pattern is "always works, more against the profane"**: 5e Divine Smite (+1d8), PF2e Remaster Smite (+3, or +4 against the opposite trait). A gate that makes the ability do nothing (3.5) or a doubled bonus on a type (PF1) both failed, in opposite directions.
7. **The player declares the target of judgment.** Draw Steel's Judgment, 13th Age's Challenge, the Vow of Enmity, the 2024 ranger. The PF2e Smite adds the best detail found: the mark extends itself while the enemy keeps harming your allies.
8. **Profane by behaviour has printed precedent.** PF2e's Lay on Hands treats "a creature you witness harming an innocent or an ally" as undead; the Gray Guard smites those "aiding and abetting evil"; Liberating Step triggers on grabbing or restraining, not only on damage. A behaviour list for 2d12 (hidden, cursing, frightening, summoned, preventing healing) follows the same logic; no source read proposes that exact list.
9. **Light as the punishment is rare and liked.** Flash of Grandeur is the one clear case: the enemy that harms your ally is lit up, so it cannot hide and the party hits it more easily. Forced movement away from the holy thing (4e Turn Undead's push) and a consecrated zone that weakens the profane and forbids summoning (Consecrate) are the two other shapes found.
10. **Do not let the anti-profane part be the class's power budget.** In the hobgoblin campaign report the Champion was fine because the reaction and the shield carried it.

---

## 6. Sources (all reached through search-result summaries only; none opened directly)

Rules references
1. Archives of Nethys, Champion class: https://2e.aonprd.com/Classes.aspx?ID=58
2. Archives of Nethys, Causes (and Grandeur, Liberation): https://2e.aonprd.com/Causes.aspx , https://2e.aonprd.com/Causes.aspx?ID=9 , https://2e.aonprd.com/Causes.aspx?ID=12
3. Archives of Nethys, Smite feat: https://2e.aonprd.com/Feats.aspx?ID=5901
4. Archives of Nethys, Revealing Light: https://2e.aonprd.com/Spells.aspx?ID=1653
5. Archives of Nethys, Guardian class: https://2e.aonprd.com/Classes.aspx?ID=67
6. Demiplane Nexus, Champion (remaster) / Lay on Hands / Sanctification / Blessed Shield: https://app.demiplane.com/nexus/pathfinder2e/classes/champion-rm , https://app.demiplane.com/nexus/pathfinder2e/spells/lay-on-hands-rm , https://app.demiplane.com/nexus/pathfinder2e/rules/sanctification-rm , https://app.demiplane.com/nexus/pathfinder2e/class-features/blessed-shield-rm
7. d20pfsrd, Champion (legacy) and Lay on Hands: https://pf2.d20pfsrd.com/class/champion/ , https://pf2.d20pfsrd.com/focus/lay-on-hands/
8. Paizo, Official Remaster FAQ: https://paizo.com/pathfinder/remaster/faq
9. Paizo blog, "Player Core 2 Preview: The Champion, Remastered": https://paizo.com/blog/player-core-2-preview-the-champion-remastered
10. PathDB, Guardian: https://pathdb.net/classes/guardian
11. Foundry pf2e wiki, Remaster Changes: https://github.com/foundryvtt/pf2e/wiki/Remaster-Changes
12. 5e SRD paladin: https://dnd-srd-sphinx.readthedocs.io/en/latest/class/paladin.html , https://5thsrd.org/character/classes/paladin/
13. D&D Beyond, "2024 Paladin vs. 2014 Paladin": https://www.dndbeyond.com/posts/1749-2024-paladin-vs-2014-paladin-whats-new
14. 4e wiki, Turn Undead / Radiant / Morninglord: https://dnd4.fandom.com/wiki/Turn_undead , https://dnd4.fandom.com/wiki/Radiant , https://dnd4.fandom.com/wiki/Morninglord
15. Steel Compendium, Judgment; MCDM pregenerated Censor: https://steelcompendium.io/v2/Browse/feature/ability/censor/level-1/judgment/ , https://files.mcdmproductions.com/DrawSteel/HumanCensor.pdf
16. 13th Age SRD, Paladin: https://www.13thagesrd.com/classes/paladin/
17. 3.5 SRD, Consecrate: https://www.dandwiki.com/wiki/SRD:Consecrate

Guides, reviews, essays
18. RPGBot, Champion Handbook and Guardian guide: https://rpgbot.net/p2/characters/classes/champion/ , https://rpgbot.net/p2/characters/classes/guardian/
19. The Role Players Guild, Champion and Guardian guides: https://theroleplayersguild.com/articles/pf2e/classes/champion , https://theroleplayersguild.com/articles/pf2e/classes/guardian
20. Bell of Lost Souls, the Champion preview: https://www.belloflostsouls.net/2024/06/preview-the-new-remastered-champion-class-from-pathfinder-player-core-2.html
21. Meeple Mountain, Battlecry! review: https://www.meeplemountain.com/reviews/pathfinder-battlecry/
22. Wargamer, 2024 paladin and ranger: https://www.wargamer.com/dnd/2024-paladin , https://www.wargamer.com/dnd/ranger-changes
23. Invincible Ink, "How To Be: The Castlevania Gang (In 4e D&D)": https://press.invincible.ink/how-to-be-the-castlevania-gang-in-4e-dd/
24. Altoholism and Aestus, Censor guides: https://altoholism.blogspot.com/2025/10/draw-steel-class-deep-dive-censor.html , https://aestusguides.com/articles/draw-steel-censor-class-guide/
25. Age of Dusk, "On Enemy Design": https://princeofnothingblogs.wordpress.com/2025/11/08/on-enemy-design/
26. itch.io, "tanking in ttrpgs": https://itch.io/blog/1125694/tanking-in-ttrpgs

Forum threads
27. Paizo, "Wishes for the Remastered Champion": https://paizo.com/threads/rzs43xdv
28. Paizo, "Champions reactions targets": https://paizo.com/threads/rzs431wu
29. Paizo, "PSA: All-champion parties are terrifying catch-22s": https://paizo.com/threads/rzs42phm
30. Paizo, "Midnight's thought; the champion doesn't do a good job at being a champion prior to level 7": https://paizo.com/threads/rzs6a2c1
31. Paizo, "Advice on Champion characters in APs without many Unholy enemies?": https://paizo.com/threads/rzs43xyj
32. Paizo, "The new damage types: Holy/Unholy and Vitality/Void": https://paizo.com/threads/rzs43vtg
33. Paizo, "Sanctification and You: A Guide by Captain Morgan": https://paizo.com/threads/rzs43y1z
34. Paizo, "Does the remastered champion dedication give you holy/unholy on strikes?": https://paizo.com/threads/rzs534t3
35. Paizo, "Revealing Light - Surprisingly Incredible or Absolutely Crunked": https://paizo.com/threads/rzs7vul5
36. Paizo, Guardian: "Taunt is Bad" https://paizo.com/threads/rzs4anca ; "How do I use Taunt?" https://paizo.com/threads/rzs4b18d ; "Neo tank fallacy" https://paizo.com/threads/rzs4al13 ; "Guardian Class Feedback" https://paizo.com/threads/rzs4aipp ; "What's stopping the Guardian from just being a bunch of class feats?" https://paizo.com/threads/rzs4abrr ; "Battlecry! Guardian" https://paizo.com/threads/rzs6pfkg ; "How strong is the Guardian?" https://paizo.com/threads/rzs6u28g
37. Paizo (PF1), "Smite Evil too powerful" https://paizo.com/threads/rzs2ku9d ; "Dealing with Smite Evil" https://paizo.com/threads/rzs2mw99 ; "Ranger's favored enemy, disapointing" https://paizo.com/threads/rzs2jwl3
38. EN World, "I think I am giving up on PF2ER" (pages 24 to 28): https://www.enworld.org/threads/i-think-i-am-giving-up-on-pf2er.704710/page-25
39. EN World, "Play report (Extinction Curse spoilers)": https://www.enworld.org/threads/play-report-extinction-curse-spoilers.670199/page-3
40. EN World, "PF2 Peeves": https://www.enworld.org/threads/pf2-peeves.652918/
41. EN World, "Ranger Problems: Favored Enemy, Presentation, Choices, and Capstones": https://www.enworld.org/threads/ranger-problems-favored-enemy-presentation-choices-and-capstones.469425/
42. EN World, "Paladin Smite Question 3.5": https://www.enworld.org/threads/paladin-smite-question-3-5.274201/
43. Giant in the Playground, "Paladin smite evil" (archive): https://forums.giantitp.com/archive/index.php/t-533647.html
44. Min/Max forum, "Pathfinder's Smite Evil: too powerful?": https://minmaxforum.com/index.php?topic=6578.0

## 7. Could not read

- **Every site, directly.** WebFetch and curl were refused for 2e.aonprd.com, paizo.com, rpgbot.net, www.enworld.org, pf2easy.com, www.reddit.com (the environment "2d12 Main" has an empty network allowlist; the request to add the hosts was rejected). To re-check a quote, these hosts must be allowed in the environment's network settings: 2e.aonprd.com, paizo.com, www.enworld.org, forums.giantitp.com, rpgbot.net, steelcompendium.io.
- **Reddit (r/Pathfinder2e)**: closed to the search tool as well. Nothing in this file comes from Reddit. The brief's complaint "the reaction didn't trigger so I did nothing special" was found only in the Paizo and EN World forms quoted in 2.2.
- **Not reached before the search budget ran out:** a GiantITP / EN World debate on "smite should work on everything"; a designer's essay on keying holy effects to behaviours (none found; point 8 of section 5 rests on three rule precedents, not on an essay); Draw Steel's full list of the Censor's 1-wrath triggered actions and its reception by players; exact Remaster text and levels of Quick Shield Block, Shield Warden, Divine Grace, Aura of Courage, Expand Aura, Iron Command's damage; how many Monster Core creatures have a weakness to holy; the comments under Paizo's Champion preview; 4e Divine Challenge and consecrated-zone powers; the exact 13th Age Smite Evil frequency.
