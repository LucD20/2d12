# Talents: the d20 family's feat systems (raw report, 2026-11-19)

**The designer's words (Lucas, 2026-11-19):** "The talents is going to be the actual meat of the game, so far we have been doing the skeleton. Talents is going to be the main thing, how things work, how all of it comes together. How a diplomatic paladin differs from a quiet, ranged paladin, with similar strengths and capabilities. I don't want to fall into the trap of skill feats from 2e, or skill tax from 1e and 3.5, or competing talents like edges from Swade (why nobody really gets social edges instead of combat edges)."

**The scope:** the feat systems of the d20 family only (Savage Worlds and the non-d20 games belong to another report). **These are other games' rules and other people's opinions, never 2d12's.** Nothing here designs a Talent.

**What was read in 2d12 first:** `rules-src/05-characters.md`, `rules-src/set-aside/16-talents.md`, the entry "TALENT STRUCTURE: PROPOSAL" in `rules-backlog.md` (2026-11-09; this report does not repeat its sources: FFG Star Wars, WFRP, Lancer, GURPS), `roleplay-skills.md`, `class-charter.md`, `magic-design.md` decision 121 and section 5l, `research/README.md`.

## How far to trust this

| Mark | Meaning here |
|---|---|
| **[read]** | Rules text, or a designer's own words, on a page that was opened and read as plain text |
| **[checked]** | An opinion or commentary on a page that was opened (the poster and date are given) |
| **[lead]** | A search tool's summary, or a page that refused to load: check before quoting it to anyone |
| **[memory]** | From Claude's own knowledge, no page opened: the weakest mark |

**Opened and read as text:** Archives of Nethys' index (Pathfinder 2e rules and feats, both the 2019 and the Remaster printings), Paizo's blog and forums, EN World threads, D&D Beyond's free rules (2014 and 2024), the 3.5 SRD on dandwiki, d20pfsrd (Pathfinder 1e), the 13th Age SRD and Pelgrane's "Changes from 1e" PDF, Draw Steel's rules (the SteelCompendium copy on GitHub), Kobold Press's blog, The Alexandrian, Rob Donoghue's blog, Michael Iantorno's site, a5e.tools.

**Could not be opened (said plainly):**
- **Monte Cook's "Ivory Tower Game Design" itself.** His old site is gone and the Web Archive is blocked from here. His words below are only those quoted by The Alexandrian.
- **Mark Seifter's video on feats and improvisation** (the Arcane Mark channel, July 2024): a video. Only the EN World thread discussing it was read; his first post there is the bare video.
- **Michael Sayre's threads** (Twitter, mirrored on Reddit): Reddit and its mirrors refuse automated readers. Nothing of his on skill feats was found. No statement of Jason Bulmahn's on why the feats are split was found either.
- **d20srd.org, Giant in the Playground, RPG.net, Reddit, the Saga Edition wiki (Fandom), sw5e.com, Schwalb Entertainment's blog, RPGBot's single-feat pages, Bell of Lost Souls:** refused or returned nothing.
- **D&D Beyond's feat-popularity figures:** the EN World posts carry them as pictures.
- **So these games are mostly [memory]:** D&D 4e's rules, Starfinder, DC20, Shadow of the Demon Lord and Weird Wizard, Dungeon Crawl Classics, Castles & Crusades, Nimble, Star Wars Saga Edition, SW5e. Their sections are short on purpose.

---

## 1. The systems

### D&D 3.0 and 3.5 (2000, 2003)

- **Picks.** A feat at level 1 and at every level divisible by three: 7 over 20 levels, 8 for a human [memory]. The fighter gets bonus feats besides (the SRD's table shows them at 1st, 2nd and on) [read, dandwiki SRD:Fighter], 11 in all [memory]. Wizards get a few bonus feats for metamagic and item creation [memory].
- **One shared budget.** General, item creation and metamagic feats come out of the same slots. A "fighter feat" is only a tag: "This designation does not restrict characters of other classes from selecting these feats" [read, SRD "About Feats"].
- **Prerequisites and chains.** "Your character must have the indicated ability score, class feature, feat, skill, base attack bonus, or other quality designated in order to select or use that feat" [read]. Whirlwind Attack: "Dex 13, Int 13, Combat Expertise, Dodge, Mobility, Spring Attack, base attack bonus +4" [read]: four feats bought before the fifth, out of seven in a career.
- **Size of a pick.** From a bare number (Toughness: "You gain +3 hit points" [read]) to a new action, to a whole subsystem (Craft Wondrous Item). Tussock, commenting on The Alexandrian: "each 3.0 feat had to have a constant effect, and to make the effect better had to use a short chain of feats" [checked].
- **Retraining.** None in the core books; a later supplement added it [memory].
- **The skill tax.** A second currency, skill points. "Each skill point you spend on a cross-class skill gets your character 1/2 rank in that skill", and the maximum rank in a cross-class skill is half that of a class skill [read, SRD Skills]. A fighter who wanted to be persuasive paid double for half the ceiling, out of the smallest allowance in the game [memory]. Staying useful at a skill meant paying a point into it every level, because the DCs rose with level [memory].
- **Two characters of one class** differ by their feat chain (the archer, the tripper, the charger), and the chain is chosen at level 1 because the prerequisites must be laid in order [memory].
- **Reception.** Monte Cook's essay, as The Alexandrian quotes it: "Toughness, for example, has its uses, but in most cases it's not the best choice of feat", and the feat "could have been written to make it clear that it was for 1st-level elf wizards" [checked: Cook's words as quoted by Justin Alexander, 2011-02-27]. Alexander's reading: Cook's point is that the designers "probably should have included more instructions on when those tools are useful"; the usual quote, "we wanted to reward mastery of the game", is cut out of context, and Toughness is "a special purpose tool", not a planted trap [checked]. The counter-reading, in the same comments: Toughness's use is "temporal rather than situational" (good only at level 1), and "From a player's standpoint, mastery of the game involves a great deal of number-crunching ... This boils the game down to something less about roleplaying and more about optimal character builds" [checked].

Source: https://www.dandwiki.com/wiki/SRD:About_Feats , https://www.dandwiki.com/wiki/SRD:Skills_Summary , https://thealexandrian.net/wordpress/2498/roleplaying-games/thought-of-the-day-ivory-tower-design

### Pathfinder 1e (2009)

- **Picks.** A feat at every odd level, 10 over 20 [memory]; the same single budget, the same chains. Fighter bonus feats stay.
- **Traits, a second small silo.** "a character trait is approximately equal in power to half a feat"; "a new PC should gain two traits"; "you may not select more than one from the same list" [read, d20pfsrd]. They were written as "story seeds" for a background. In play the combat-useful ones (an initiative bonus, a save bonus) were the standard picks [memory].
- **Archetypes** replace named class features with others: variety inside a class without spending feats [memory].
- **Retraining** (a later book): time and money; unlike Pathfinder 2e, the new feat only has to be legal now, not at the level the old one was taken [read, d20pfsrd FAQ].
- **Bloat.** Thousands of feats across the line [memory; d20pfsrd's index page alone is 4,000 lines of text].
- **"The Elephant in the Room"** ("Mathew", on Michael Iantorno's site, 2012-09-05) is the best-known statement of the feat tax [read]: "Many veteran players lament that you need three feats to go to the bathroom in Pathfinder"; feats sit "in sprawling tiers, often requiring an investment of three or more feats to unlock a single more advanced one"; "many rungs on the feat ladder are considered either undesirable" or dull. Its fixes are four moves:
 1. **Make it a basic option.** Power Attack, Deadly Aim and Combat Expertise become things anyone with base attack +1 can do. "Power Attack is too useful to be a feat."
 2. **Fold it into the gear.** Weapon Finesse, "the ultimate feat tax", becomes a weapon property.
 3. **Merge the family.** The six "Improved" maneuver feats become two; Mobility goes into Dodge.
 4. **Drop the pure prerequisite.** Point-Blank Shot no longer gates archery; Combat Expertise "is taken to progress to better feats then promptly forgotten about".
- **Why the tax hurts,** from the comments there: "The main problem with 'feat taxes' is that they force martial classes to become 1-trick-ponies, which are not only boring to play, but make them obsolete in many fights, whereas casters can still take a fairly flexible box of toys" [checked]. **And the defense:** "Feat taxes can be annoying, but they're there for a reason. A big one is Improved Trip ... because tripping is such an excellent move" [checked]: the tax as a price on power.

Source: https://michaeliantorno.com/feat-taxes-in-pathfinder/ , https://www.d20pfsrd.com/traits/

### D&D 4e (2008)

- **Picks** [memory]: 18 feats over 30 levels (level 1, every even level, and the first level of each tier), in three tiers (heroic, paragon, epic) gated by level. Powers are a separate track, and inside it **utility powers have their own slots** (levels 2, 6, 10, 16, 22): the non-attack pick never competes with an attack. Backgrounds and themes arrived later as free extra layers. Multiclassing is a feat. Retraining: one feat, power or skill at each level.
- **Size of a pick.** Mostly small numbers and conditional bonuses, since the powers carry the actions [memory].
- **The math-fix feats.** "The 'math fix' feats people refer to are feats that resulted when the designers realized that PC attack bonuses were lagging behind high paragon and particularly epic monster defenses ... The Expertise feats ... addressed the attack bonus issue"; "many DMs give players some of these feats for free as a house rule" [checked: Mentat55, EN World, 2011-04-23; first printed in Player's Handbook 2, he says]. No designer's own statement was found.
- **Why it reads as a tax** [checked, EN World]:
 - Nifft (2010-02-13): "Waste of at least one feat for every PC in the game, and feats are fun things, so losing one is bad."
 - Turtlejay (same thread): "It is hard to justify taking a feat that is *cool*, when you should be taking the one that lets you hit a little more often." He liked the idea of separating "flavor" feats from "function" feats.
 - A poster in "What's the big deal with 'feat taxes?'" (2011): the choice isn't sword bonus against breath weapon, "it's, 'Am I going to have more fun hitting 50% of the time, or 35% of the time?'"
 - The same thread, on the later versions that add a small trick to the +1: they "at least give me something interesting", but "it would have been better to give PCs a flat +1 to hit at 11th and again at 21st level and make the expertise feats just provide the extra kicker".
 - The counter-view, same thread: "You chose mechanics over flavor on your own."
 - Truename: number-crunchers call them a needed fix "and thus a feat tax"; actual play at high level reports them "unnecessary and overpowered".

Source: https://www.enworld.org/threads/math-fixes-can-you-clarify.304993/ , https://www.enworld.org/threads/general-consensus-on-expertise-feats.272000/ , https://www.enworld.org/goto/post?id=5573532

### D&D 5e (2014) and 5e (2024)

- **2014.** Feats are "special options you can choose instead of increasing your ability scores as you gain levels. Your DM decides whether these options are available" [read, D&D Beyond basic rules 2014]. Five such points in most classes (levels 4, 8, 12, 16, 19; more for the fighter and rogue) [memory]. So a feat is **a swap against a number**: +2 to the main ability against a feat. A feat is big (a bundle of two or three benefits) and there are almost no chains [memory].
- **What followed** [memory, with one lead]: the picks concentrate on feats that add damage or protect the main routine (Great Weapon Master, Sharpshooter, Polearm Master, Sentinel, War Caster, Lucky). EN World's thread on D&D Beyond's data is titled "Here Are The Most Popular D&D Feats (War Caster Leads The Pack!)" [read: the title only]; a search summary of it names War Caster, Tough, Lucky and Sharpshooter as the top four, and feats used by 9% of low-level characters against 44% after level 12 [lead]. Actor, Linguist and Keen Mind are rated at the bottom by the guides [memory; RPGBot's pages did not open]: each costs the same slot as +2 to the number every roll uses. "Half-feats" (+1 to an ability and a smaller benefit) were the 2014 game's own patch [memory].
- **2024.** Feats are in the core rules and sorted into categories: "Origin, General, Fighting Style, or Epic Boon" [read, D&D Beyond free rules]. "Your background gives you a feat, and at certain levels, your class gives you the Ability Score Improvement feat or the choice of another feat" [read]. "A background gives your character a specified Origin feat" [read]. The Ability Score Improvement is itself now a "General Feat (Prerequisite: Level 4+)" [read]. Epic Boons need "Level 19+" [read]. The other General feats each carry +1 to an ability [memory]: the half-feat made the rule, so the swap costs half as much.
- **What changed and what did not.** The level-1 pick is its own silo (Origin feats cannot be had for a level-4 slot's price, and the level-4 feats cannot be had at level 1). But the Origin list mixes fight and non-fight picks (Alert, Savage Attacker, Magic Initiate, Skilled [read]), and the level-4 slot is still one budget shared with the number. No designer's statement of the reason was found [lead only].

Source: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/customization-options , https://www.dndbeyond.com/sources/dnd/free-rules/feats , https://www.dndbeyond.com/sources/dnd/free-rules/character-origins

### Pathfinder 2e (2019; Remaster 2023)

- **Four silos, each with its own slots** [read, Archives of Nethys, unless marked]:
 - **Class feats:** at level 1 or 2 and every even level (the fight, mostly) [memory for the final schedule].
 - **Skill feats:** "At 2nd level and every 2 levels thereafter, most classes gain a skill feat ... Your character must be trained in the corresponding skill".
 - **General feats:** "at 3rd level and every 4 levels thereafter ... you can select any general feat (including skill feats)".
 - **Ancestry feats:** levels 1, 5, 9, 13, 17 [memory].
 - Skill ranks rise on a fifth track.
- **The stated intent.** Logan Bonner, "Leveling Up!" (2018-03-12) [read]: "we wanted to build in more robust customization into the structure of every class"; "Most feats require very few prerequisites, so you won't need to worry about picking a feat you really don't want in order to eventually get one you do"; the aim, options "expansive and satisfying, but not overwhelming". Mark Seifter, "Feats of Skill" (2018-06-08) [read]: "Every character gets at least 10 skill feats"; they "customize how you use skills in the game, from combat tricks to social exploits, from risk-averse failure prevention to high-risk heroism". **Combat tricks were inside the skill silo by design.**
- **Retraining.** "You can spend a week of downtime retraining to swap out one of your feats ... you could swap a skill feat for another skill feat, but not for a wizard feat"; the new choice must be one you could have made then [read].
- **What the silos solved.** A social or exploration pick never costs a fighting pick; chains nearly gone; every level gives a choice.
- **What they did not solve: permission.** The feats named in the complaints, from their rules text [read]:

| Feat | 2019 text | Remaster text | The complaint |
|---|---|---|---|
| Group Impression | "you can compare your Diplomacy check result to the Will DCs of two targets instead of one" | "up to 10 targets you conversed with, **with no penalty**" | Read as: without it you can't address two people. The Remaster's three words concede that anyone can, at a penalty |
| Group Coercion | two targets | five targets | The same |
| Pickpocket | "You can Steal or Palm an Object that's closely guarded, such as in a pocket, without taking the -5 penalty" | the same | It removes a penalty; many read it as the permission to pick pockets |
| Intimidating Glare | Demoralize "loses the auditory trait and gains the visual trait, and you don't take a penalty if the creature doesn't understand your language" | the same | Scaring someone with a look needs a feat |
| Titan Wrestler | "You can attempt to Disarm, Grapple, Shove, or Trip creatures up to two sizes larger than you" | the same, plus Reposition | A pure gate, and a combat one in a skill slot |
| Battle Medicine | one action: a Medicine check to heal in a fight, once a day a target | the same | In-fight healing bought with a skill slot: the "obvious" pick |
| Bon Mot | one action: Diplomacy against Will; -2 or -3 to the target's Perception and Will saves | the same | A debuff that sets up spells, in a skill slot |
| Assurance | "forgo rolling ... to instead receive a result of 10 + your proficiency bonus" | the same | Take 10, once universal, now a feat a skill |

- **The complaint in posters' words** [checked]:
 - stonehead (EN World, 2025-09-24): "Many skill feats give you abilities that normal people already have" and "A good number of well-liked skill feats are just combat buffs in disguise" (he names Titan Wrestler, Bon Mot, Battle Medicine). A third group is tied to subsystems tables rarely use (Quick Coercion, Hobnobber, the survival feats).
 - Staffan's reply there: the game shrinks what a basic skill does so the feats have something to change.
 - Seramus (same thread): a feat's existence makes some GMs rule that a character cannot try without it.
 - Retreater (EN World, 2024-07-14): "It's like most feats exist to reduce penalties ... There are too many feats to remember to apply penalties to those who don't have them. Instead, the design should've been the opposite: it's the responsibility of the player who invested in the feat to remember to apply the bonus."
 - Thomas Shey (2024-07-15): "They *absolutely* should have spelled out that its okay to use penalties rather than the feat."
 - Paizo forum, "Skill Feats: What Should Be Baked In?" (2019-03-20): Pick a Lock and Disable a Device are base uses while Pickpocket is a feat: "That feels...backwards."
 - Paizo forum, "Fix for gating skill feats?" (2021): "they could have just gated that stuff around proficiency and then still had feats that made it easier to do specific hard stuff."
- **The designers' answer.** Seifter in the 2019 thread [read: his own posts]: a poster proposes to house-rule "no feat = hefty penalty"; he replies, "That will be an impossible houserule to make (technically). Therefore it is a very clever idea": a hint that the printed rule is already that (the feat removes a penalty; it does not grant the attempt). The defense as posters give it: "The base action is Coerce ... If someone tries to get it to do more ... you apply an adjustment using the general rules" (The-Magic-Sword, 2024-07-14) [checked]. What the video's own argument is: not read. The persistent finding is that **the rule's intent ("try it at a penalty") was not printed where the feat is read**, so a feat worded "you can..." was read as "others cannot".
- **Assurance,** from Seifter [read]: it "helps assure that you can cover easier DCs and make them every time". Why Take 10 left the base rules, as a poster reports his earlier comments: it leaves only DCs you always make and DCs you make half the time or less [checked].
- **Archetypes and Free Archetype.** An archetype is bought "using one of your class feat choices" [read]: multiclassing and themes compete with the class's own fighting feats. The Free Archetype variant gives "an extra class feat at 2nd level and every even level thereafter that they can use only for archetype feats"; it "introduces a shared aspect to every character without taking away any of that character's existing choices" [read, GM Core]. It is widely described as the most used variant; no poll was found [lead]. Posters on why: it "just expands laterally"; "it seemed that I pretty much always felt hyped for the next level" (EN World, 2023) [checked]. **What that says:** the players' own fix for "my concept costs me my class feats" was a fifth silo.

Source: https://2e.aonprd.com (Rules.aspx?ID=143, 2108, 2448, 2127, 2751; Feats.aspx?ID=789, 5155, 818, 5187, 6466, 760, 756, 5162, 854, 5226, 788, 5154), https://paizo.com/blog/leveling-up , https://paizo.com/community/blog/v5748dyo5lkue , https://paizo.com/threads/rzs42idl , https://paizo.com/threads/rzs43fxv , https://www.enworld.org/threads/skill-feats-shouldnt-give-you-abilities-that-normal-people-have.715437/ , https://www.enworld.org/threads/mark-seifter-wants-to-set-the-record-straight-feats-and-improvisation-in-pathfinder-2e-video.705490/

### 13th Age (2013; 2e 2025)

- **Two layers** [read, 13th Age SRD]:
 - **Class talents:** a few big picks from the class's list ("Choose three of the following class talents. You get an additional fighter class talent at 6th level").
 - **Feats:** "Characters choose a feat at 1st level, and at every subsequent level", in three tiers (adventurer, champion from level 5, epic from level 8).
- **Feats attach.** Each talent, power and spell prints its own feats under it; "you must have the talent, power, or spell in order to choose the feat". In 1e the tiers had to be taken in order.
- **Free-floating feats are few:** eleven general feats (Further Backgrounding, Improved Initiative, Linguist, Precise Shot, Rapid Reload, Reach Tricks, Ritual Casting, Skill Escalation, Strong Recovery, Toughness, Secret School Technique) [read].
- **Non-combat is elsewhere, and free:** player-written Backgrounds (points), One Unique Thing, icon relationships [memory; see `roleplay-skills.md`].
- **Size of a pick.** A feat is a modifier of something you own (once a battle, a wider critical range, a rider) [read, the Fighter].
- **The 2e change.** "The default is now that you don't need to take lower-tier feats to take the higher-tier feat" [read, Pelgrane, "Changes from 1e"]: even a three-step ladder on your own ability was felt as a tax.
- **Reception.**
 - Critical Hits' review (2013-09-23): "it's hard to differentiate between two characters of the same class at the lowest tier", though feats "built to boost specific powers" give "a lot of potential options as characters progress"; a commenter running two Sorcerers answers that the talents "can produce very different feels" [checked].
 - Rob Donoghue, "Why Feats Fail Me" (2012-10-03): "stats, class, talents and feats dont' tell much of a story"; feats "can have meaning in the setting or be mechanically potent, but not both", because "The more mechanically desirable a feat is, the fewer constraints you want to put on it"; and "feats tend to be a little bit too small" [checked].
 - A commenter there: "Each feat needs to be indiviually balanced against dozens or hundreds of other feats with flavorful but mechanically weak feats ignored and powerful feats being treated as mandatory" [checked].

Source: https://www.13thagesrd.com/feats/ , the SRD's Fighter on GitHub (Obsidian-TTRPG-Community/13th-Age-SRD-Markdown), https://pelgranepress.com/files/13th_Age/13A_2e/13A_Changes_from_1e.pdf , https://critical-hits.com/blog/2013/09/23/a-review-of-13th-age , https://walkingmind.evilhat.com/2012/10/03/why-feats-fail-me/

### Draw Steel (2025)

- **Perks have their own schedule, apart from abilities** [read, the rules]: "You are granted one perk from your career and can choose other perks from your class as your level increases": at levels 2, 4, 6, 8 and 10 in the class tables read (Censor, Conduit).
- **Six types:** crafting, exploration, interpersonal, intrigue, lore, supernatural. The class narrows the type for some picks ("one interpersonal, lore, or supernatural perk") and leaves others open ("one perk of your choice").
- **What a perk is for:** "features you can use to customize your hero and give them heroic moments outside of combat ... many are versatile enough that they can also be used in battle".
- **Fighting picks are a different currency:** abilities chosen by their Heroic Resource cost at set levels, and a **kit** (a fighting style, swappable at a respite).
- **Complications:** optional, "both a positive benefit and a negative drawback".
- **Titles:** rewards earned in play, about "one title per echelon"; "You can turn a perk into a 1st-echelon title simply by giving it a prerequisite".
- **Reception** is in `roleplay-skills.md` (Lucas found many perks over the top: certainty); nothing new was searched.

Source: https://raw.githubusercontent.com/SteelCompendium/data-md/main/Rules/Chapters/Perks.md (and Classes.md, Complications.md, Rewards.md, Making a Hero.md)

### Tales of the Valiant (2024)

- Talents replace feats: "player-chosen abilities, gained periodically, which grant new features, augment current powers, or otherwise enhance a character's capabilities" [read, Kobold Press].
- "Talents are divided into three categories: magic, martial, and technical"; "Technical talents affect a character's non-combat abilities"; "When your class grants an Improvement, you can choose a talent from your class-allowed lists" [read].
- A background offers a choice among three talents, and no talent gives an ability score [checked, Gnome Stew's review]. The Improvement gives the ability increase **and** the talent, not one or the other [memory].
- **The cost:** a class's allowed lists decide what it may be. A fighter does not see the technical list [memory].

Source: https://koboldpress.com/?p=49433 , https://gnomestew.com/tales-of-the-valiant-players-guide-review/

### Level Up: Advanced 5th Edition (2021)

- Feats stay 5e's swap. It adds **synergy feats**, chains gated by class levels or by an earlier feat (the list shows prerequisites such as "3 levels in berserker, 3 levels in druid" and "Vampire Spawn feat") [read, a5e.tools' list].
- Its answer to the non-combat problem is outside feats: each class gets its own exploration or social picks at set levels (called knacks in the playtest), and a **Destiny** chosen at creation [memory].
- A search summary has a designer saying knacks were "an easy way for us to silo them off for playtesting, but they are more folded in as class features in the actual book" [lead].

Source: https://a5e.tools/rules/feats

### Shorter entries (mostly [memory]; verify before relying on them)

- **Starfinder 1e:** a feat at level 1 and every odd level, one budget, fewer chains than Pathfinder 1e; a **theme** gives a free non-combat layer [memory]. **Starfinder 2e** uses Pathfinder 2e's four silos [memory].
- **DC20 (beta):** a talent at most levels, chosen from general talents, the class's talents or a **multiclass talent** (another class's feature); ancestry traits bought with **ancestry points**; skills and trades on separate points [memory; only the product page for beta 0.10.5 was found].
- **Shadow of the Demon Lord, Weird Wizard:** no feats. A novice path at level 1, an expert path at 3, a master path at 7; each path is a fixed bundle spread over later levels. Two characters differ by the combination of paths. A search summary has Schwalb say the system "never penalizes you for your choices since you're always getting something from the ones you already made" [lead; his blog did not open].
- **Dungeon Crawl Classics:** no feats and no skill list; a warrior's variety is the Mighty Deed, improvised at the table [memory].
- **Castles & Crusades:** no feats in the core; differences come from class and the prime attributes [memory].
- **Nimble:** nothing verified.
- **Star Wars Saga Edition:** two tracks. Each class level gives, in turn, a **talent** from that class's trees (odd levels) or a **bonus feat** from that class's list (even levels), and character level gives general feats on 3.5's schedule [checked: a forum summary in a search result; memory]. Skill training is bought with a feat [checked, a fan's page]: the non-combat pick competes with the fighting feats there. Praise: "two Soldiers can look completely different" [lead].
- **SW5e:** 5e's swap [memory; the site did not open].

---

## 2. The six questions

### (1) What makes a pick feel like a tax

1. **It restores a number the game's math assumes.** 4e's Expertise: "Am I going to have more fun hitting 50% of the time, or 35% of the time?" [checked]. The table's fix was to give it free.
2. **It is a rung, never used for itself.** Combat Expertise, "taken to progress to better feats then promptly forgotten about" [read].
3. **It is the first pick of every character of a kind.** "Power Attack is too useful to be a feat" [read]: if every two-hander takes it, it is a class feature with a price tag.
4. **It removes a penalty the rules put there first** (Weapon Finesse; Precise Shot's -4): the pick buys back the baseline.
5. **It competes with a universal number.** 5e 2014: a feat against +2 to the ability every roll uses [read: the rule; memory: the result].
6. **It keeps a skill usable as the DCs rise** (3.5's ranks every level; the cross-class half rank) [read: the rule].
7. **It is a ladder on your own ability that must be climbed in order.** 13th Age dropped it [read].

The defense on record, twice: a tax is a price on something strong (Improved Trip) [checked]. The answer on record: then price the strong thing, not a dead rung before it.

### (2) What makes a pick feel like permission

1. **The base action was narrowed so the feat has room** (Staffan on Make an Impression) [checked].
2. **The fallback is not printed at the feat.** The intent "anyone can try, at a penalty" lives in general advice; the feat says "you can" [checked: Thomas Shey; read: the Remaster adding "with no penalty"].
3. **The wording is "You can X"** where X is something a person could plainly attempt (two listeners, a glare, a pocket).
4. **The bookkeeping lands on the GM.** Feats that remove penalties ask the GM to remember the penalty for everyone else (Retreater) [checked].
5. **The gate is on a thing the fiction allows** (Titan Wrestler), with no "harder" in between, only "no".
6. **A general rule became a feat** (Take 10 into Assurance): what everyone had is now bought, skill by skill.

What did not draw the complaint: feats on the edge of realism and beyond (Cat Fall at legendary, Legendary Thief). Stonehead's own best feats are those "on the edge of realism" [checked].

### (3) Combat and non-combat picks on one budget, and every fix tried

What happens: the fighting pick wins (3.5, Pathfinder 1e, 5e 2014, Saga's Skill Training), because the fight is where a weak character is felt by the whole table, and because the fighting pick is a number used every round.

| The fix | Games | How it went |
|---|---|---|
| **Separate slots** | Pathfinder 2e (skill feats), Draw Steel (perks), 4e (utility powers), A5E (knacks) | The competition ends. New failure: **combat effects leak into the non-combat silo** and become its best picks (Battle Medicine, Bon Mot) [checked]; and the silo must be filled, which breeds permission feats |
| **A separate currency** | 3.5 (skill points), DC20 (skill and trade points) | Works for numbers; 3.5 spoiled it with class lists and the half rank |
| **Free at creation** | 13th Age (Backgrounds, One Unique Thing), Pathfinder 1e traits, Starfinder themes, 5e 2024 Origin feats, Draw Steel's career perk | No competition at all. But a free list that mixes fight and non-fight picks gets raided for the fight (traits; Alert and Savage Attacker in the Origin list) |
| **Bundle a number with the flavor** | 5e's half-feats; 2024's +1 on every General feat | Lowers the price of the flavor pick; inside the list the ranking still exists |
| **Class-allowed lists** | Tales of the Valiant, Saga Edition | Guarantees each class picks from its own lane; costs concept freedom |
| **An extra, restricted slot** | Pathfinder 2e's Free Archetype | The most adopted variant [lead]: players would rather have a second lane than choose |
| **No picks** | Demon Lord, DCC, C&C | No traps and no tax; less to differ by inside one path |

Not found in this family: a single pick that always carries one combat half and one non-combat half (Option C of `roleplay-skills.md`). The half-feat is the nearest thing, and its second half is a number.

### (4) How many options at one decision point

No measured figure was found: everything here is structure and inference [judgment].

- The systems people call bloated present an **unfiltered** list at every pick (Pathfinder 1e: thousands; 3.5 with supplements).
- The systems praised for clarity filter before the player reads:
 - by level and class (Pathfinder 2e: a handful of class feats a level);
 - by what you already own (13th Age: the feats under your three talents);
 - by type (Draw Steel: one of six perk types, sometimes three; about half a dozen perks a type);
 - by category (5e 2024: four Origin feats in the free rules).
- 13th Age's talent pick is "three of" a list of about eight to ten.
- Bonner's stated aim: "expansive and satisfying, but not overwhelming" [read].

### (5) Trap options and system mastery

1. **A pick whose value depends on time, with no label** (Toughness: fine at level 1, dead by level 6) [checked]. Cook's own remedy, as quoted: say on the feat who it is for.
2. **A pick balanced one by one against hundreds:** "flavorful but mechanically weak feats ignored and powerful feats being treated as mandatory" [checked].
3. **Permanence.** A trap is only a trap if you are stuck with it. 3.5 had no retraining; Pathfinder 2e asks a week; Draw Steel swaps a kit at a respite.
4. **Planning ahead.** Chains force the level-1 player to know the level-9 feat. Bonner: "you won't need to worry about picking a feat you really don't want in order to eventually get one you do" [read].
5. **Supplements.** Each book adds picks stronger than the core's (tussock on late 3.5) [checked].

### (6) Modify an existing ability, or add a new one

- **Modify** (13th Age's feats; 4e's feats; metamagic; 2d12's set-aside "Talents That Modify Actions"):
 - nothing new to remember on your turn; no orphan picks; the list is filtered by what you own;
 - the cost: picks can be "a little bit too small" (Donoghue) [checked], and at low level two characters of a class look alike until the big picks differ (Critical Hits) [checked].
- **Add** (Pathfinder 2e class feats; 5e's big feats; Battle Medicine):
 - each is felt at once, "they all tend to do something new" [checked];
 - the cost: more buttons, and competition with the buttons you have.
- **Both layers, on separate tracks** (13th Age: talents add, feats modify; Saga: talents and feats; Draw Steel: abilities, kit, perks): the big pick sets the identity, the small pick tunes it.

---

## 3. What seems to transfer

### (a) The structures

| Structure | Games | What it solved | What it cost |
|---|---|---|---|
| **One shared budget** | 3.5, Pathfinder 1e, Starfinder 1e, Saga's feats | Full freedom; any concept can be reached in principle | Taxes, chains, traps; the fighting pick crowds out the rest; planning from level 1 |
| **Silos by kind, each with its own slots** | Pathfinder 2e, Draw Steel, 4e's utility powers, A5E, Tales of the Valiant | Non-combat picks stop competing; every level has a choice | Each silo must be filled (permission feats); combat leaks into the skill silo; more to track |
| **Picks attached to what you own** | 13th Age, metamagic, 4e's power feats | No orphan picks, a short list, no new buttons | Small picks; little cross-class sharing; a ladder becomes a tax if its order is forced |
| **A pick as a swap against a number** | 5e 2014; softened in 2024 | Simple; feats can be optional | The number wins, or only the picks that beat the number are taken; flavor picks die |
| **Trees** | Saga's talent trees; Pathfinder 1e's chains in practice | A visible path; a specialist's story | Rungs taken for the next rung; lock-in |
| **Free layers at creation** | 13th Age, Pathfinder 1e traits, 5e 2024, Draw Steel's career | Non-combat identity with no competition | Raided for the fight if the list mixes both |
| **Fixed bundles, no picks** | Demon Lord, DCC | No traps, fast level-ups | Variety only between paths, not inside one |

### (b) The three traps, as tests to hold a Talent against

**Tax (D&D 3.5, Pathfinder 1e, 4e).** A Talent fails if any of these is true:
1. It raises, or restores, a number the base math assumes (to hit, a Defense, a DC, a skill's usefulness).
2. Its main use is to be a Prerequisite.
3. Every character of one kind would take it first.
4. It removes a penalty that the rules impose on a normal use of the character's own kit.
5. Its upgrades must be taken in a fixed order.
6. Without it, the same slot could have bought a universal number.

**Permission (Pathfinder 2e).** A Talent fails if any of these is true:
1. Its sentence is "you can X" and a GM would let an untrained person try X.
2. The base action had to be narrowed for it to exist.
3. What a character without it rolls is not printed in the base rule.
4. It asks the GM to remember a penalty for everyone who lacks it.
5. It turns something everyone had into something bought once a skill.

A pass, by the same sources: the Talent makes the attempt faster, cheaper, wider or better on a high result, or opens what is beyond a normal person.

**Competition (5e, Saga; Savage Worlds is another report).** A slot fails if any of these is true:
1. A combat option and a non-combat option can both fill it.
2. A number can fill it.
3. It is a non-combat slot and an effect usable in a fight can fill it (Battle Medicine).
4. It is a free creation-time list and it mixes fight and non-fight picks.

### (c) What in 2d12's files already resembles a fix

- **`rules-src/05-characters.md`:**
 - the level list already has **two kinds of slots** (a Skill Talent at levels 1 and 3, a Talent at 2, a Stage Talent at 4): Pathfinder 2e's and Draw Steel's separate schedules;
 - "Levels give options; Stages change the numbers" and "A Modifier is never above +4" remove the ground the math-fix tax and the feat-against-number swap stand on;
 - "Swapping on a Rest" is the most generous retraining rule in this whole survey (Pathfinder 2e asks a week of downtime): a trap pick costs one Rest.
- **`rules-src/set-aside/16-talents.md`:** "Talents That Modify Actions", keyed by trait, is 13th Age's attached feat made general (it reaches any Action with the trait, not one named card). The same file has the chain "Brawler, then Kickboxer" and the Prerequisite "Body 2": the tax tests above apply to both.
- **`class-charter.md`, rule 11:** a card that counts "your Reactions" names a trait, and "a later Talent can carry the trait to work with the class's cards": the hook that lets a Talent attach to a class's cards without being a class feat.
- **`roleplay-skills.md`:**
 - proposal 1 ("A skill or Talent never grants permission for a mundane action: it makes you better at it") is the sentence Pathfinder 2e did not print;
 - proposal 2 (no certainty) meets Assurance and Draw Steel's perks;
 - proposal 3 (separate budgets, options A, B, C) is the silo; option C has no clean precedent here;
 - proposal 8 (Backgrounds) and 11 (a free out-of-combat Feature a class) are the free creation-time layer;
 - Lucas's own note on direction 4, "Talent tax", already names the 3.5 trap.
- **`rules-backlog.md`, "TALENT STRUCTURE: PROPOSAL":** "Skill Talents never give combat numbers" answers the leak, but the leak Pathfinder 2e shows is wider than numbers: Battle Medicine and Bon Mot are **actions used in a fight**, not bonuses. Its "Ranks I-III" is a ladder on one's own Talent: 13th Age 2e's removal of forced order is the evidence to weigh.
- **`magic-design.md`:**
 - decision 44 and section 5l ("the base rule carries the limit; Talents are how a character grows past it, sideways"): each seed lifts a limit on something extraordinary, and the base rule states what a character without it does (one summon; one [Woven] spell; no counter), which is exactly what the permission test asks for;
 - the 5l seed "Changing a spell by its trait" is the attached pick again;
 - decision 121 holds the three tests in short form.
