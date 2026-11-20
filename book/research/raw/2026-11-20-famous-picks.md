# The famous picks: which feats, talents and edges players take first (raw report)

**Date:** 2026-11-20. **Asked by Lucas,** after reviewing the four test Talents (`book/cards/talents-first-pass.md`, section 8): "One better way to test things: Make a quick research of the most used feats, talents, etc used in other systems, like 4e, 2e, 3.5, pf1e, 13th, star wars etc. From there, we can build some of the most famous ones, the ones we can expect people to look at first."

**What was read.** In the repository: `research/README.md`, `research/talents.md` (not repeated here: its traps and structures stand), `talents-design.md` section 7 (T1 to T13), `cards/talents-first-pass.md`, `cards/basic-actions.json`, `cards/stage0/paladin.json` and `archer.json`, `decided.md`, and the Momentum, Escalation, Rally Point, Initiative and off-hand rules in `rules-src/`. On the web: about 45 searches and 35 page loads. **Pages were read through a summarizing reader:** a [read] or [checked] quote was returned by that reader from the page, not copied by eye.

**How far to trust it.** Marks: [read] rules text or data on a page opened; [checked] an opinion on a page opened; [lead] a search snippet, or a page that refused; [memory] no page opened. **The weak spots, plainly:**
- **Only two sources count picks.** D&D Beyond's 5e statistics (2019 and 2020; the rankings are in images the reader could not see, so only the article's sentences are [read]) and Pathbuilder's Pathfinder 1e counts (the page refused; its numbers are a [lead] from a search snippet). Everything else is ratings and forum talk: evidence of what is *considered* a must-take, not of what is *taken*.
- **Refused or dead:** paizo.com threads (403 on every one), d20srd.org, dandwiki, the Fantasy Grounds and 13th Age (Tapatalk) forums, Bell of Lost Souls, the Star Wars fandom wiki (402), dungeonsmaster.com's 4e feat poll (500), Pathbuilder (Cloudflare), the Wayback Machine (blocked here). Reddit and Giant in the Playground were not tried (they refuse, per the README).
- **Nothing found:** no usage data for Pathfinder 2e, 4e, 13th Age, Savage Worlds, Star Wars, Lancer or Draw Steel; no rating of 13th Age talents, Lancer talents or Draw Steel kits (Lancer searches return only the video game FragPunk). Those entries are [memory] and say so.

**Other games' rules and opinions, never 2d12's.** The last section only sorts and observes; it designs nothing.

---

## 1. The two counts

- **D&D Beyond, 5e 2014, February 2019** [read: EN World's article]: "War Caster, Tough, Lucky, and Sharpshooter lead the pack." Great Weapon Master was in the top four a year earlier. Feats arrive at levels 4 to 7, when "over a third of characters choose a feat"; at level 8, half. A commenter on the same page: Bard is the only full caster whose top feat is not War Caster [checked]. https://www.enworld.org/threads/here-are-the-most-popular-d-d-feats-war-caster-leads-the-pack.666137/
- **D&D Beyond, February 2020 revisit** [read: EN World's article]: "the percentage of characters using feats has increased slightly"; the per-class rankings are screenshots. A commenter reads them as Sharpshooter on about 40% of rangers, 14% of rogues, 16% of fighters, with Crossbow Expert not in the top three [checked, a commenter's reading]; another: War Caster wins because "all three of its bonuses matter" [checked]. https://www.enworld.org/goto/post?id=7919364 . A search summary of the same thread: the Top 3 per class are each "in the 10-15% range" outside the ranger, and the next 19 feats are "roughly 2 to 6 percent" each [lead].
- **Pathbuilder, Pathfinder 1e, "Feat Frequency in 20391 PFRPG Builds", "heavily skewed towards low level builds"** [lead: snippet; the page refused]: Weapon Focus 5,472 (about 27%), Power Attack 4,727 (23%), Improved Initiative 4,267 (21%), Dodge 3,627 (18%). Combat Reflexes and Toughness are named among the most common in another snippet, without numbers [lead]. https://pathbuilder2e.com/legacy/feat_data.php

**What the counts say together:** at low level the first picks are a flat accuracy number (Weapon Focus), the damage trade (Power Attack, Great Weapon Master, Sharpshooter), going first (Improved Initiative), a flat defense or hit point number (Dodge, Tough), a reroll (Lucky), and the pick that lets a caster fight (War Caster).

---

## 2. The famous picks, system by system

Evidence: **D** a count; **C** several independent ratings or threads agree; **S** one rating or thread; **M** memory only.

### D&D 3.5 and Pathfinder 1e

| Pick | What it does | Why taken | Evidence |
|---|---|---|---|
| Weapon Focus | +1 to hit with one weapon [memory] | A number on every attack; gate to Weapon Specialization and many chains [memory] | D (Pathbuilder #1) |
| Power Attack | PF1: "a –1 penalty on all melee attack rolls [...] to gain a +2 bonus on all melee damage rolls", +50% two-handed, scaling with BAB [read, d20pfsrd]; 3.5: trade any amount up to BAB [memory] | Damage; the gate to Cleave and others. Called a "baseline combat option" that should not be a feat [lead, Paizo "Remove the Feat Tax"] | D (#2), C |
| Improved Initiative | +4 initiative [memory] | Going first; a rogue catches more foes flat-footed, so more Sneak Attack [lead, Paizo "Non-numerical feats"] | D (#3) |
| Dodge, Mobility, Spring Attack | +1 AC; +4 AC against attacks of opportunity from moving; move, attack, move [memory] | Defense, then a chain to a mobile fighter | D (Dodge #4); the chain is the standard "tax" example [memory] |
| Combat Reflexes | "additional attacks of opportunity per round equal to your Dexterity bonus", and while flat-footed [read, d20pfsrd] | Reach and lockdown builds | lead |
| Toughness | +3 hit points (PF1 scaling) [memory] | Survival; argued not a "tax" because nothing requires it [lead, Paizo] | lead |
| Cleave / Great Cleave | An extra attack when you drop a foe (3.5) [memory] | Extra damage against crowds | M |
| Combat Expertise to Improved Trip | Trade attack for AC; gate to the maneuver feats [memory] | Maneuvers; Combat Expertise is "probably the most egregious feat tax" [lead, GiantITP] | lead |
| Point-Blank Shot, Precise Shot, Rapid Shot, Deadly Aim, Manyshot | +1 within 30 ft; no −4 shooting into melee; an extra shot at −2; Power Attack for ranged [memory] | The archer's spine: Point-Blank is "a prerequisite for most ranged feats" [lead, Paizo threads]; Rapid Shot "worth far more than deadly aim at lower levels" [lead] | C (lead) |
| Furious Focus (PF1) | No Power Attack penalty on the first attack each turn with a two-handed weapon [read, d20pfsrd] | Removes the trade's cost where it bites | M |
| Weapon Finesse | Dexterity for melee attacks [memory] | A whole style depends on it; named first in a Paizo "most used feats" thread [lead] | lead |
| Leadership | A cohort and followers [memory] | Action economy; the classic "ban it" feat [memory] | M |
| Natural Spell, Extra Turning, Quicken Spell, Dazing Spell | Cast in wild shape; more uses of turning; cast as a swift action; a spell dazes [memory] | Core of a druid build; more of a class resource; a second spell a turn; a condition on any damage spell (PF1's notorious one) [memory] | M |

**A designer's view:** Owen K.C. Stephens (2020), revising PF1's feats on his blog, folds the Power Attack family into "stance feats" and says general feats "can be condensed down to just a few options" [read]. https://www.goodreads.com/author_blog_posts/20498027-pf1-essential-feats-part-3-general-feats

### D&D 4e

| Pick | What it does | Why taken | Evidence |
|---|---|---|---|
| Weapon / Implement Expertise | +1 to hit, +2 paragon, +3 epic [memory] | Added because PC attacks "were lagging behind" monster defenses [lead, EN World "Math fixes"]; "the +2 attack bonus at paragon is more than almost any other feat out there" (Stalker0); "pretty much nobody likes the feats" (Nifft) [checked] | C |
| Improved Defenses | +1 to +3 to Fortitude, Reflex and Will [memory] | The same math fix for non-AC defenses; one GM gives it free [lead] | C (lead) |
| Superior Will / Fortitude / Reflex | A defense number, plus (Will) a save against daze and stun at the start of your turn [lead] | "the additional save is what makes Superior Will a must-have" [lead, EN World] | S |
| Toughness, Weapon Focus, Improved Initiative | Hit points, damage, initiative numbers [memory] | The same reasons as 3.5 | M |

https://www.enworld.org/goto/post?id=5089195 ; a poster reports the 4e team saying "must-take feats" are "a sign of bad design" [lead].

### D&D 5e, 2014 and 2024

| Pick | What it does | Why taken | Evidence |
|---|---|---|---|
| War Caster | Advantage on Constitution saves for concentration; somatic components with weapons or a shield in hand; a spell in place of an opportunity attack [read, wikidot] | Casters in melee; "enables a particular build" [checked, Arcane Eye, S tier] | **D (#1, 2019)** |
| Tough | +2 hit points a level [memory] | Survival; a strong pick "when there's no appealing Ability Score Improvement" (jmartkdr2) [checked] | D (top 4) |
| Lucky | Luck points: roll an extra die and choose, or impose one on an attack against you [memory] | Reliability on any roll; 2024 S tier, "automatic Advantage on multiple attack rolls" [checked, Arcane Eye] | D (top 4), C |
| Sharpshooter | 2014: ignore long-range disadvantage, ignore half and three-quarters cover, −5 to hit for +10 damage [memory]. **2024: no trade**: ignore cover, no disadvantage within 5 feet of an enemy or at long range, +1 Dexterity [read, wikidot 2024] | Damage (2014); "Damage, ignore long range, ignore cover" [checked, RPGBot] | D (top 4) |
| Great Weapon Master | 2014: an extra attack on a critical or a kill; −5 to hit for +10 with a heavy weapon [read, wikidot]. 2024: + Proficiency Bonus damage with a Heavy weapon on the Attack action, Hew kept [read] | "All of the damage you could ever want" [checked, RPGBot]; S tier [checked, Arcane Eye] | D (top 4 in 2018) |
| Polearm Master | A bonus-action attack with the butt; opportunity attacks when a creature *enters* reach [read, wikidot] | "entirely created a build archetype"; with Sentinel "so good that it is now considered a faux pas" [checked, Arcane Eye, S tier] | C |
| Sentinel | A hit by your opportunity attack sets speed to 0; Disengage doesn't protect; a reaction attack when an adjacent creature attacks someone else [read, wikidot] | Lockdown and protection; "one of the most problematic feats out there" [checked, Arcane Eye, A tier] | C |
| Crossbow Expert | Ignore loading; no disadvantage in melee; a bonus-action hand-crossbow attack [memory] | "Turn a hand crossbow into a semi-automatic" [checked, RPGBot] | C |
| Resilient (Con) | Proficiency in a save, +1 attribute [memory] | Concentration [checked, Arcane Eye, A tier] | S |
| Alert | 2014: +5 initiative, can't be surprised. 2024: + Proficiency Bonus to initiative, and **swap your initiative with a willing ally** [read, wikidot 2024] | Going first; the swap "can turn the tide of a fight" [checked, Arcane Eye] | S |
| Mobile | +10 speed, Dash ignores difficult terrain, no opportunity attacks from a creature you attacked [checked, Arcane Eye] | Hit and run | S |
| Fey Touched, Magic Initiate | Misty Step and another spell; cantrips and a 1st-level spell [checked, RPGBot] | A new verb from outside your class; Fey Touched "an insanely good deal" [checked, Arcane Eye, S tier] | C |
| Observant, Skill Expert | Perception numbers; Expertise [checked, RPGBot] | Skill reliability | S |
| Healer, Musician, Savage Attacker | Healing kit use; a party reroll (2024); reroll damage [checked, Arcane Eye] | Musician S tier as "a free reroll for the whole party"; Savage Attacker D tier: "about 1.65 average damage" [checked] | S |

Sources: https://arcaneeye.com/players/dnd-5e-feats-tier-list/ (the reader mixed 2014 and 2024 text) ; https://arcaneeye.com/?p=18312 ; https://arcaneeye.com/dnd-feat-guides/polearm-master-5e/ ; https://arcaneeye.com/dnd-feat-guides/sentinel-5e/ ; https://rpgbot.net/dnd5/characters/feats/ ; https://dnd5e.wikidot.com/feat:sentinel ; https://dnd2024.wikidot.com/feat:sharpshooter . **The 2024 revision is itself evidence** [read]: the two famous −5/+10 trades were removed; Sharpshooter is now three lifted limits; a search summary reports the Polearm Master and Sentinel lock broken by 2024's wording [lead].

### Pathfinder 2e

| Pick | What it does | Why taken | Evidence |
|---|---|---|---|
| Toughness | "Increase your maximum Hit Points by your level", recovery DC −1 [read, pf2.d20pfsrd] | "People actually make characters without Toughness?" [lead, Paizo]; RPGBot would "pick up options like Toughness first" for a fighter [checked] | C |
| Fleet | +5 feet Speed [lead] | Always on; offsets heavy armor [checked, RPGBot fighter] | C |
| Incredible Initiative | +2 to initiative [lead] | "Going first is always great" [checked, RPGBot] | C |
| Battle Medicine | One action: heal yourself or an adjacent ally "even in combat", Treat Wounds' DC; "temporarily immune to your Battle Medicine for 1 day" [read, pf2.d20pfsrd] | Combat healing for a party without a healer [checked, RPGBot Medicine]. `talents.md` already records it as the case of combat leaking into the skill slot | C |
| Assurance | Take "10 + your proficiency bonus" without other modifiers [read] | Certain results; Athletics for maneuvers against penalties [checked, RPGBot: "Great, but not always effective"] | S |
| Intimidating Glare, Bon Mot | Demoralize without language; an insult that lowers Will and Perception [checked, TheGamer] | A combat action from a skill | S |
| Attack of Opportunity / Reactive Strike | Fighter's free level-1 Reaction: Strike a creature in reach that manipulates, moves, makes a ranged attack, leaves a square [lead, Roll20 legacy]; others reach it at level 6 [lead]; renamed in the Remaster [read, Paizo FAQ, as a search summary] | "a significant deterrent" [checked, RPGBot] | C (memory and lead) |
| Reactive Shield | Raise a shield as a Reaction [memory] | "a good fallback" for shield users [checked, RPGBot] | S |
| Sudden Charge | Two actions: "Stride twice", then a melee Strike [read] | "Great action economy" [checked, RPGBot] | C |
| Point-Blank Shot / Stance | Remove the volley penalty or add damage close in [memory] | "Crucial for archers" [checked, RPGBot] | S |
| Double Slice | Two Strikes, one per hand, one penalty [memory] | "Essential for two-weapon users" [checked, RPGBot] | S |
| Power Attack | Two actions, one Strike with an extra damage die [memory] | RPGBot finds it "hard to recommend" [checked] | S |

Sources: https://rpgbot.net/p2/characters/classes/fighter/ ; https://rpgbot.net/p2/characters/skills/medicine/ ; https://www.thegamer.com/pathfinder-2e-best-general-feats/ ; https://pf2.d20pfsrd.com/feat/battle-medicine/ .

### Star Wars (Fantasy Flight) and Genesys

| Pick | What it does [memory] | Why taken | Evidence |
|---|---|---|---|
| Grit, Toughened | +1 strain threshold; +2 wound threshold, ranked | "Two talents will help keep anyone in the game longer: Grit and Toughened" (HappyDaze) [checked] | S |
| Parry, Reflect (and Improved) | Spend strain to reduce a melee (Parry) or ranged (Reflect, lightsaber) hit by 2 + ranks; Improved: hit back on a despair or threats | "reflect, parry, Force rating+1 are pretty much the indispensable talents" for a Jedi (use headbutt) [checked]; "they will also prevent a large amount of total damage over the course of the game" (DaverWattra) [checked] | C |
| Force Rating | +1 Force die | "the most indespensable Talent" (Jedi Ronin) [checked] | S |
| Dedication | +1 to a characteristic, the bottom row of every tree | The race to one box; `talents.md` already records it | C (lead and memory) |
| Defensive Training, Sixth Sense | Always-on defense | "always on, requiring no activation cost" [checked] | S |
| Side Step, Defensive Stance, Dodge | Strain or a maneuver for a defense upgrade | Rated poorly: "a huge opportunity cost to spending a maneuver" [checked] | S |
| Quick Draw, Quick Strike, Adversary | Draw as an incidental; boost against foes who haven't acted; an NPC's upgrade | Nothing found | M |

Sources: https://ffg-forum-archive.entropicdreams.com/topic/205713-indispensable-talents%E2%80%A6 ; https://ffg-forum-archive.entropicdreams.com/topic/239426-best-and-worst-defensive-talents .

### Savage Worlds

The Edges' one-line summaries [read, rulespal, the old Test Drive]: Level Headed "Act on best of two cards in combat"; Quick "Discard draw of 5 or less for new card"; Frenzy "1 extra Fighting attack at -2"; Sweep "Attack all adjacent foes at -2"; First Strike "Automatically attack one foe who moves adjacent per round"; Block "Parry +1"; Combat Reflexes "+2 to recover from being Shaken"; Brawny "Toughness +1"; Luck "+1 benny per session"; Command "+1 to troops recovering from being Shaken"; Trademark Weapon "+1 Fighting or Shooting with one particular weapon"; Dodge "-1 to be hit with ranged attacks"; Nerves of Steel "Ignore 1 point of wound penalties"; Two-Fisted "attack with a weapon in each hand without multi-action penalty". https://rulespal.com/savage-worlds/rulebook

**Which are taken:** a licensee: "If you always set up four combats per session, everyone will end up picking Quick, Block, Dodge, etc..."; "most the heroes of a Veteran posse in Deadlands pick the Brave Edge"; in Weird Wars "the Quick Edge: be quick or be dead" [checked, Giuseppe Rotondo, 2020] https://axianspice.blogspot.com/2020/09/about-character-variety-in-savage-worlds.html . Quick and Level Headed are "quite a powerful ability" [lead, EN World]; a blog computes initiative wins at 64.6% (Quick), 66.5% (Level Headed), 72.7% (both) [lead]. Richard Woolcock's simulator (100,000 fights a pairing) finds the extra-attack pairs "fairly closely matched": Ambidextrous + Two-Fisted 52.9%, Improved Frenzy 51.8%, Improved Counterattack 50.9%, Lunge + First Strike 44.4% [read] https://savage-stuff.blogspot.com/2015/01/reach-and-first-strike-effective-yet.html . Evidence: C for Quick and Level Headed, S for the rest.

### 13th Age, Lancer, Draw Steel, GURPS, Shadowrun (all thin)

- **13th Age:** no rating or count of talents was found; the Pelgrane build articles list sample talents without reasons [lead]. From memory: the fighter's Skilled Intercept and Comeback Strike, the rogue's Swashbuckle, the ranger's Double Melee or Ranged Attack and Archery, the wizard's Cantrip Mastery and Evocation, the paladin's Bastion are the usual first picks [memory]. **Feats attach to the talent or spell they improve** [memory; `talents.md`].
- **Lancer:** nothing found. From memory: Crack Shot, Brawler, Nuclear Cavalier, Ace and Walking Armory are common early talents; Lancer's talents are three-rank picks [memory].
- **Draw Steel:** nothing found on kit popularity [lead: only the kit rules pages]. From memory: kits are a weapon-and-armor bundle that set Stamina, speed, damage and a signature ability.
- **GURPS:** Combat Reflexes appears on SJ Games' own fighter templates [lead]; High Pain Threshold, Luck and Extra Attack are common [memory].
- **Shadowrun:** not searched; from memory, Edge spent on rerolls and qualities such as Toughness and High Pain Tolerance.

---

## 3. The families (in Claude's rank order, section 4a)

| # | Family | Picks | Why it is famous |
|---|---|---|---|
| 1 | **The power-for-accuracy trade and the damage number** | Power Attack, Deadly Aim, Furious Focus, Great Weapon Master, Sharpshooter (2014), PF2 Power Attack, Weapon Focus, Trademark Weapon | The top of both counts; the largest damage increase in its system; it carries chains (Cleave, Weapon Specialization) |
| 2 | **Initiative** | Improved Initiative, Alert, Incredible Initiative, Level Headed, Quick | Pathbuilder #3; always useful; the first turn decides many fights; ambushers need it |
| 3 | **Hit points and staying up** | Toughness (3.5, PF1, PF2), Tough, Grit, Toughened, Brawny, Nerves of Steel, Hard to Kill, High Pain Threshold | D&D Beyond top 4; "keep anyone in the game longer"; the safe pick when nothing else fits |
| 4 | **The attack of opportunity and its upgrades** | Combat Reflexes, Sentinel, Polearm Master, War Caster's spell, Attack of Opportunity / Reactive Strike, First Strike, Step Up | The one Reaction a martial has; upgrades turn it into lockdown, the most argued combo in 5e |
| 5 | **Casting under fire** | War Caster, Resilient (Con), Combat Casting [memory], Natural Spell | D&D Beyond #1: casters take it before any spell feat |
| 6 | **The ranged package** | Point-Blank, Precise, Rapid Shot, Manyshot, Sharpshooter, Crossbow Expert, Point-Blank Stance, Marksman | Shooting into melee and through cover are penalties every archer meets every fight; the picks remove them |
| 7 | **Luck and rerolls** | Lucky, Musician (2024), Luck and Great Luck, GURPS Luck | D&D Beyond top 4; works on any roll, including saves |
| 8 | **Defense: dodge, parry, shield** | Dodge, Improved Defenses, Superior Will, Block, Parry, Reflect, Reactive Shield, Shield Master, Defensive Duelist [memory] | Dodge is Pathbuilder #4; Parry and Reflect the Jedi staples |
| 9 | **Extra attacks: cleave, sweep, frenzy** | Cleave, Great Cleave, Whirlwind Attack, Frenzy, Sweep, Rapid Shot, GWM's Hew, Polearm Master's butt | More attacks is the action economy; Whirlwind is the chain's famous goal |
| 10 | **Mobility and the charge** | Mobility, Spring Attack, Mobile, Fleet, Fleet-Footed, Sudden Charge, Lunge [memory] | Getting to the fight (or away) without paying a turn or an opening |
| 11 | **Magic from outside the class** | Magic Initiate, Fey Touched, Adopted Ancestry [checked, TheGamer] | A new verb (Misty Step) on a character who had none |
| 12 | **Dual wielding** | Two-Weapon Fighting chain, Double Slice, Two-Fisted, Ambidextrous, Dual Wielder | A whole style that does not work without the pick ("Essential for two-weapon users") |
| 13 | **Healing in a fight** | Battle Medicine, Healer, Second Wind [memory] | A party without a healer; one of the best-liked PF2 skill feats |
| 14 | **Skill reliability** | Assurance, Skill Expert, Skill Focus, Reliable Talent [memory, a class feature] | Certainty on the skill the character is known for |
| 15 | **Saves** | Iron Will, Great Fortitude, Lightning Reflexes, Resilient, Superior Will, SW Combat Reflexes | Protect against losing a turn; Superior Will's extra save is "what makes [it] a must-have" |
| 16 | **Combat maneuvers** | Combat Expertise, Improved Trip, Improved Grapple, Shield Master's shove, Tavern Brawler, Snagging Strike, Assurance (Athletics) | Trip, disarm and grapple were near useless without them in 3.5, so the picks became the style |
| 17 | **Metamagic** | Quicken, Empower, Dazing Spell, Elemental Adept, Spell Sniper | A caster's way to bend every spell at once; Dazing Spell is PF1's infamous one |
| 18 | **Combat uses of social skills** | Intimidating Glare, Bon Mot, SWADE's Tests | The social picks that do get taken: actions inside a fight |
| 19 | **Leadership and followers** | Leadership, Command, Inspiring Leader | More bodies on the field, or a party-wide benefit; often banned |
| 20 | **More of a class resource; a characteristic** | Extra Turning, Extra Rage, Dedication, half-feats | Restores or raises a number the class runs on |

---

## 4. What seems to transfer

### (a) The families players reach for first, ranked

Claude's ranking, the order of section 3: the two counts first, then how many systems carry the family, then the ratings. **1** the damage trade (Power Attack, Great Weapon Master); **2** initiative (Improved Initiative, Alert, Level Headed); **3** hit points (Toughness, Tough, Grit and Toughened); **4** the attack of opportunity and its upgrades (Sentinel, Polearm Master, Combat Reflexes); **5** casting under fire (War Caster); **6** the ranged package (Point-Blank, Precise Shot, Sharpshooter, Crossbow Expert); **7** luck (Lucky); **8** dodge, parry, shield (Dodge, Parry and Reflect); **9** extra attacks (Cleave, Frenzy, Sweep); **10** mobility and the charge (Mobile, Spring Attack, Sudden Charge); **11** outside magic (Fey Touched, Magic Initiate); **12** dual wielding (Double Slice, Two-Fisted); **13** healing in a fight (Battle Medicine); **14** skill reliability (Assurance); **15** saves (Resilient, Superior Will); **16** maneuvers (Improved Trip, Shield Master); **17** metamagic (Quicken, Dazing Spell); **18** social skills in a fight (Bon Mot, Intimidating Glare); **19** leadership (Leadership); **20** more of a class resource (Extra Rage, Dedication). The first eight are on firmer ground (a count or several independent sources); from 9 down the order is judgment.

### (b) The usual shape against T1

T1: a Talent never gives a bare number; it adds a verb, changes a rule, or lifts a limit (more uses of a Frequency count as a number: T11).

| # | Family | Usual shape | Is the shape allowed? |
|---|---|---|---|
| 1 | Damage trade | A number (−1/+2, −5/+10, +PB, +1 hit) | **Needs a different shape.** Forms on record that are verbs: PF2's Power Attack (a separate two-action Strike); GWM's Hew (an attack on a kill or a critical) |
| 2 | Initiative | A number (+4, +2, +PB) | **Needs a different shape.** On record: Alert 2024's swap with an ally (a verb); Level Headed's "act on the best of two" (a rule; but close to a Boon, which T1 holds back) |
| 3 | Hit points | A number | **Needs a different shape.** On record: Nerves of Steel and Hard to Kill (ignore a penalty: a lifted limit); PF2 Toughness's recovery DC; Second Wind (a verb) |
| 4 | Attack of opportunity | Rule changes and new triggers (Sentinel, Polearm Master); Combat Reflexes is a count | **Allowed**, except more Reactions a round (a number under T11) |
| 5 | Casting under fire | A lifted limit (hands), a verb (spell as the Reaction), a number (advantage on concentration) | **Mostly allowed**; the concentration advantage is a Boon; a lighter armor cost is out (`decided.md`, answered 2026-11-19) |
| 6 | Ranged package | Lifted limits (cover, melee, long range, loading) and one number (+1, −5/+10) | **Allowed in its lifted-limit form,** which is exactly 2024's Sharpshooter |
| 7 | Luck | A reroll or a pool of rerolls | **Unclear:** a reroll is a rule, but a count of them is a number, and a choice of two dice is a Boon. A question for Lucas |
| 8 | Defense | Passive numbers (Dodge, Block, Improved Defenses) or a Reaction (Parry, Reflect, Reactive Shield) | **The Reaction form is allowed; the passive form is not** |
| 9 | Extra attacks | Verbs (an extra attack on a drop, all adjacent foes) | **Allowed;** Lucas's own warning is about this family ("Whirlwind", T6) |
| 10 | Mobility | Numbers (+5, +10 speed) and verbs (Spring Attack, Sudden Charge) and rule changes (Mobile's no-reaction clause) | **The verb and rule forms are allowed** |
| 11 | Outside magic | New verbs (spells) | **Allowed;** 2d12 routes it through a Magic Talent (decision 27) |
| 12 | Dual wielding | Penalty removal (Two-Fisted, Ambidextrous), a two-weapon Action (Double Slice) | **The Action is allowed; fewer Banes** is a lifted limit or a number: a question for Lucas |
| 13 | Healing in a fight | A verb with a per-target daily limit | **Allowed if it passes T2's checklist**: Battle Medicine's one-day immunity is that shape |
| 14 | Skill reliability | A fixed result (Assurance, a rule) or a number (Skill Focus, Expertise) | **Assurance's form is a rule;** the number forms are out (T7) |
| 15 | Saves | A number, sometimes with a rule (Superior Will's early save) | **Only the rule part** |
| 16 | Maneuvers | Mixed: no provocation (a lifted limit), +4 (a number), a free attack after (a verb) | **The lifted-limit and verb parts** |
| 17 | Metamagic | Raising a cost to add an effect (Quicken, Dazing); numbers (Empower) | **Adding an effect is allowed; making it cheaper is not** (T1, `decided.md`) |
| 18 | Social in combat | New actions (Bon Mot) or lifted limits (Intimidating Glare's language) | **Allowed as combat Talents,** never as Skill Talents (T2's wall) |
| 19 | Leadership | A new body (cohort) or a number to allies | **A body is a verb,** but `decided.md` limits summons to one at a time |
| 20 | Class resource | More uses, +1 characteristic | **Out:** a number (T1, T11), and Talents don't touch class cards (T9) |

**What this shows:** the top three families (damage, initiative, hit points) are almost always bare numbers in their sources, so a 2d12 version would need a different shape from the one players remember. Families 4 to 6 (the Reaction, casting under fire, the ranged package) are famous *and* already rule changes and lifted limits. The 2024 D&D revision moved the same way: it took the number out of Sharpshooter and kept the lifted limits.

### (c) Counterparts already in 2d12 (observations)

- **The attack of opportunity:** the test Talent Opportunity Attack, with Spellwatch and Spellbreaker (War Caster's magic side reversed) and Bodyguard (close to Sentinel's third clause: it guards an ally, though its trigger is the enemy leaving, not attacking). Hamstring is near Sentinel's "speed 0". **One gap to check:** `basic-actions.json` still carries Opportunity Attack as a Basic Action every creature has (pack R-core), while T9 and the first pass make it a Talent ("not built in as a Basic Action").
- **The ranged package:** the Archer's Clear Lines (allies give no cover, no Field Bane for an engaged target) is Precise Shot and Sharpshooter 2024 in a class Passive; Leaning and Lean and Loose touch cover; Snap Shot covers shooting at a creature that closes in; Overwatch's Return Fire is a held shot. A Talent in this family would sit close to the Archer's own cards.
- **Mobility and the charge:** the Charge and Evade Basic Actions; the Archer's Footwork, Slip Away and Fleet; the Paladin's Setup Advances. Shoulder Through (with Break the Line) is the 2d12 Spring Attack and Sudden Charge family.
- **Combat maneuvers:** Trip, Shove, Haul, Relocate and Grab rules exist as Basic Actions. Called Shot's hand is a disarm; Bull Rush is a branch. No grapple Talent yet.
- **Defense and shields:** the Paladin's Shield of Faith is a Parry-shaped Reaction (it reduces damage). Chapter 15 says shields are "not written yet" and names "a Block Reaction" as the plan. No dodge or parry Talent yet.
- **Casting under fire:** decided in part: [Handle], [Incanted], [Focus]; the armor Surge cost; "a counterspell is a Talent" [99]; Spellwatch and Silencing Shot. Lowering the armor cost is out.
- **Metamagic:** Overcast's stretches (Carry, Fork, Echo) are the built-in form; Talents never give ranks.
- **Magic from outside the class:** a Magic Talent opens a Path and a School (decision 27).
- **Healing in a fight:** Steel Yourself and Rally Points for everyone; Lay On Hands for the Paladin; T2's bypass checklist covers the out-of-fight side.
- **Hit points:** Rally Points rise with Stage; no Talent. **Initiative:** an Instinct Check with ties and swapping already in Chapter 2; no Talent.
- **Extra attacks:** the Archer's Quick Shots, One More Arrow and Opening Shot (an ally's attack), the Paladin's Reckoning and Word of Radiance; no Cleave-like Talent.
- **Dual wielding:** the off-hand rule (2 Banes, 1 with a Light weapon), Darting Blade and Blade and Bow.
- **Luck and rerolls:** the exploding dice are in the base roll; Momentum and Escalation are shared or per-character tracks, not a reroll; no luck pick.
- **Skill reliability:** "Routine meets the DC, a Tier 2 at most" (`decided.md`, answered 2026-11-19) reads like Assurance written into the base rules.
- **Leadership:** summons (one at a time, a Minion) and the Archer's Spotter; no follower Talent.
- **No counterpart, and T1 or T9 keep it so:** more uses of a class resource; attribute bumps.

---

## Sources that could not be opened

Named in the header (paizo.com, d20srd.org, dandwiki, Fantasy Grounds, Tapatalk, Bell of Lost Souls, the fandom wiki, dungeonsmaster.com, Pathbuilder, the Wayback Machine). Every other URL above was opened.
