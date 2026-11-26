# Bypassing a cost outside a fight: free healing, unlimited retries, and how games keep a cost real

**Date:** 2026-11-19. **Asked by Lucas,** while setting the rules for Talents (`book/talents-design.md`, decision T2):

> "Things shouldn't simply allow you to bypass. Big problem with 2e is the out of combat healing: Garden of Healing from animist is simply broken out of combat and trivializes it; Medic's and Skill feat's 'Treat Condition' makes conditions not last anything out of combat, since each attempt takes actions (so less than 6 seconds) and has no limit, you can attempt non stop. Feel free to make a research about this topic and add to our files."

**What was read, and how far to trust it.** One researcher, about 60 searches and page loads. Marks: **[read]** rules text or a designer's own words on a page opened; **[checked]** an opinion on a page opened; **[lead]** a search summary, or a page that refused; **[memory]** no page opened. Pages came through a reader that returns extracts and short quotes: **recheck a quote on its page before printing it.**
- **Opened:** Archives of Nethys (Pathfinder 2e Remaster pages), Roll20's Pathfinder 2e and 13th Age compendiums, d20pfsrd, 5thsrd.org, D&D Beyond's 2024 glossary, aidedd.org, steelcompendium.io (Draw Steel: Heroes 1.01b), a copy of Daggerheart's rules (en.daggerheart.su), a copy of the Blades in the Dark SRD, a copy of Dungeon World's moves, rpgbot.net, EN World, the Burning Wheel forum, the Alexandrian, DM David, Alphastream, Pelgrane, M.T. Black.
- **Refused:** every paizo.com page (forums and blog), Reddit and its mirrors, web.archive.org, d20srd.org, the Angry GM. **So no Paizo designer's words were read** (1.5 is leads). Worlds Without Number, Shadow of the Demon Lord, Fabula Ultima and Forbidden Lands: no rules page found. Savage Worlds, Lancer, Torchbearer and Warhammer 4e: rules only through fans [lead].

**Not repeated here:** the table of recovery clocks, Paizo's Stamina-variant warning, Starfinder's Resolve-paid breather, the first Treat Wounds reception quotes and the five-minute workday (`resources-and-recovery.md`, `raw/2026-11-18-recovery-and-rest.md`); Pathfinder 2e's rising Aid DC (`helping.md`).

**Other games' rules and opinions, never 2d12's.**

---

## 1. Pathfinder 2e: out-of-combat recovery

### 1.1 The rules (Remaster)

| What | Time | The limit as printed | Removes | Source |
|---|---|---|---|---|
| **Treat Wounds** (trained Medicine, toolkit) | 10 minutes | Can't benefit again for 1 hour (the hour overlaps the treatment); DC 15 / 20 / 30 / 40 for 2d8 / +10 / +30 / +50; an hour's treatment doubles it | HP **and the wounded condition** | Player Core p. 242 [read, summarized] |
| **Continual Recovery** | — | "your patient becomes immune for only 10 minutes instead of 1 hour" | | [read, Roll20; edition not marked] |
| **Ward Medic** | — | 2 patients at once; 4 at master, 8 at legendary | | [lead] |
| **Battle Medicine** | 1 action | Treat Wounds' DC and healing; "The target is then immune to your Battle Medicine for 1 day." "This does not make them immune to, or otherwise count as, Treat Wounds." | HP | Player Core p. 253 [read] |
| **Medic Dedication** | — | "Once per day, you can use Battle Medicine on a creature that's temporarily immune"; at master, "once per hour" | | Player Core 2 p. 208 [read] |
| **Godless Healing** | — | +5 HP, and the Battle Medicine immunity "only 1 hour, instead of 1 day" | | Hellfire Dispatches p. 60 [read] |
| **Treat Condition** (Medic feat 4) | **2 actions** | **None**: no frequency, no immunity. A counteract check; critical success −2, success −1, **critical failure +1** | clumsy, enfeebled, sickened; **Holistic Care** adds frightened, stupefied, stunned | Player Core 2 p. 208 [read] |
| **Refocus** | 10 minutes | "This restores 1 Focus Point"; no cap | | Player Core p. 298 [read] |
| **Garden of Healing** (Animist, focus 1) | 1 action, sustained up to 1 minute | "heals each creature within the emanation for 1d4 Hit Points" on casting and the first Sustain each round; a healed creature "does not receive any healing from additional castings of the spell while the bonus persists" (10 minutes); +1d4 a pulse per rank | HP, 10-foot emanation | War of Immortals p. 18 [read] |

"**Assured Medic**" is not a Pathfinder 2e feat that a search could find; the nearest is Assurance in Medicine (a fixed result), described by posters as the way to hit Treat Wounds' fixed DCs [lead]. Paizo states the purpose in the skill's text: "Treat Wounds is especially useful, allowing your adventuring party to heal up between fights." (Player Core p. 241) [read]

### 1.2 Why Garden of Healing breaks outside a fight

The arithmetic [judgment]: a 1-minute sustain is 10 pulses, **about 25 HP to every creature in the area at rank 1**, times the rank when heightened. Its lockout is **10 minutes**; the Focus Point comes back with a **10-minute** Refocus. **The lockout is as long as the refresh, so outside a fight it binds nothing.**
- rpgbot.net [checked]: "But it is outside of combat where this spell truly shines." "With just 1 minute, you can heal your entire party for 10d4 hit points right at level 1", then "get your focus point back after another 9 minutes, and do it again." "Your party should always be at full health before every encounter." In a fight: "nothing too impressive".
- Paizo playtest threads [lead]: "every party member 25 HP on average per spell rank every 10 minutes"; "every group member is full health within a minute of the fight ending". Whether the printed lockout came after the playtest: not verified.

### 1.3 Why Treat Condition breaks outside a fight

From the text [read; judgment]: two actions, no frequency, no immunity. In a fight the price is two of three actions; outside one it is seconds, so it is retried until the condition is gone, and its critical failure (+1) deters nothing when the next try is six seconds away. Its siblings carry an hour's and a day's immunity. **No reception page was found** for it; the problem is Lucas's reading, and the text supports it. The **wounded condition** has the same shape: written to make a second drop deadlier, cleared by a 10-minute Treat Wounds [read].

### 1.4 The pattern [judgment]

Every limit here is **a per-target window measured in time**, and the feats shrink the window (1 hour to 10 minutes; a day to an hour) or multiply the patients (2, 4, 8). **None spends anything time doesn't give back.** CapnZapp: Medicine alone brings a character to full in about 20 to 80 minutes [checked, EN World 2020].

### 1.5 Was removing attrition intended?

- **The rules:** yes, for Hit Points (the Medicine text above) [read].
- **Jason Bulmahn,** playtest blog "Sending Your Heroes to the Mirrored Moon" (24 September 2018): reported as adding mass bandaging to Medicine after the playtest showed a jump in dying rates, to ease healing between fights without a magical healer [lead: refused].
- **Michael Sayre** (September 2023, relayed): healing between fights is slow enough at levels 1 to 4 that parties clear about 30 to 60% of a floor a day; the game isn't balanced on three encounters a day [lead]. **Mark Seifter, Logan Bonner:** nothing found.
- **Players** [checked, EN World 2020 and 2021]: CapnZapp, "PF2 was never about attrition"; kenada, full health "is an assumption made to reason about the guidelines for building encounters", and "I wish they had made easy healing the default with gritty rules you could layer on top if you wanted attrition"; payn, "it was designed to get out of resource attrition on the adventuring day"; CapnZapp, "published APs make zero concessions to help make this expectation a fact"; AaronOfBarbaria suggests "limiting how often characters can regain HP from the Treat Wounds action".
- **House rules** [lead, Paizo threads]: Treat Wounds once an hour or a day beside a Stamina pool; a critical failure that ends healing for the day; three a day; Worlds Without Number's System Strain. Against: "a really poor and finicky rule".

**The inverted five-minute day** [judgment]: 5e's problem is resting after one fight because rest is cheap; Pathfinder 2e made the stop after every fight the expected play, so a fight's cost lives only inside it.

---

## 2. Repeated attempts with no limit

### 2.1 What rules say

- **D&D 3.5 / Pathfinder 1e, Take 20** [read, d20pfsrd]: when "faced with no threats or distractions, and the skill being attempted carries no penalties for failure"; "Taking 20 takes 20 times as long"; "it assumes that you fail many times before succeeding". A skill with no Try Again entry "can be retried without any inherent penalty other than the additional time required." **The unlimited retry, written down and priced in time.**
- **5e 2014 DMG p. 237** [lead]: sometimes "the only real cost is the time it takes"; ten times the time succeeds; repeating never makes the impossible possible.
- **5e 2024 DMG p. 28** [checked, quoted by a poster]: "If failure has no consequences and a character can try and try again, you can skip the ability check."
- **Pathfinder 2e prints a window per action** [read]: Demoralize, "the target is temporarily immune to your attempts to Demoralize it for 10 minutes"; Track, a failure retried after 1 hour, a critical failure not for 24 hours.

### 2.2 What writers say

- **Justin Alexander, "Let It Ride"** (2016) [read]: "make a single check and let the result of that check ride forward"; a new check after failure, "a change in approach", or "a seismic event" (Burning Wheel's rule [memory]).
- **David Hartlage** (2021) [checked]: "Dungeons & Dragons plays best when players can only retry ability checks if something changed after the first roll"; "Often the price of failure comes from losing time against a ticking clock."
- **Alphastream** (2026) [checked]: "A thief can try to pick a lock once"; give failure a cost, not a dead end.
- **EN World, 2025** [checked]: a ladder of waits (an action, a minute, an hour, a day, then locked out until something changes); or a penalty on a rushed retry.

### 2.3 The printed fixes

| Fix | Where | Known cost |
|---|---|---|
| **Once per rest or day** | 5e 2014 Healer feat [memory]; Battle Medicine | Unexplained in the fiction; feats shrink it |
| **A window after an attempt** | Treat Wounds, Demoralize, Garden of Healing | **Binds only if it outlasts the refresh and time is scarce** |
| **A resource per attempt** | Starfinder (Resolve), 4e and 5e 2024 (the patient's surge or Hit Die), Torchbearer, Lancer | Tracking; the resource needs a slow clock |
| **A time cost** | Take 20, 5e's ten times, Treat Wounds | **Zero unless the adventure charges for time** |
| **Failure worsens or locks out** | Treat Condition, Track, Treat Wounds' 1d8 | Worsening is no lock if the next try is free; a lock needs a "what changed" rule |
| **Let it ride / fail forward** | The Alexandrian, Burning Wheel | The GM invents each cost |
| **One attempt per circumstance** | Hartlage; 5e's social checks | "Did it change?" is a judgment |
| **Escalating interval or penalty** | Aid's rising DC; the EN World ladder | Bookkeeping |

---

## 3. Out-of-combat healing elsewhere

| Game | Healing outside a fight | What keeps it a cost | Reception |
|---|---|---|---|
| **D&D 4e** | Short rest: spend any number of healing surges | Surges are daily [lead: rules quoted by a poster] | Liked for it [checked, EN World 2008]: unlimited "would essentially mean their never injured"; "That removes a lot of the tension from the game"; "I want it to be a decision." |
| **5e 2014** | Short rest: spend Hit Dice | A long rest returns "up to a number of dice equal to half"; one per 24 hours [read] | The short rest is skipped (`resources-and-recovery.md`) |
| **5e 2024** | Same | Long rest returns "all lost Hit Points and all spent Hit Point Dice"; 16 hours between [read] | Loosened [judgment]. **The Healer feat spends the patient's die:** "That creature can expend one of its Hit Point Dice, and you then roll that die" [read] |
| **13th Age** | "Out of combat, you can spend recoveries freely" [read] | About 8; past zero "a cumulative -1 penalty on all your attacks and defenses"; all back "After the fourth battle" [read] | Praised (`resources-and-recovery.md`) |
| **Draw Steel** | "Outside of combat, you can spend as many Recoveries as you have remaining" [read] | Back only at a respite: "24 hours uninterrupted", "in a safe place", broken by "enemies attacking"; Victories convert there [read] | Resting early costs power [lead] |
| **Daggerheart** | Short rest (an hour), two moves: "clear a number of Hit Points equal to 1d4 + your tier" [read, a copy] | "up to three short rests before their next rest must be a long rest"; **the GM gains 1d4 Fear** [read] | The cost goes to the GM's side [judgment] |
| **Blades in the Dark** | Recover, one of two downtime activities; more cost "1 coin or 1 rep" [read] | A healing clock; "Whenever you suffer new harm, clear any ticks" [read] | — |
| **Dungeon World** | Make Camp: "consume a ration"; after sleep "heal damage equal to half your max HP" [read, a copy] | "After three days of rest you remove one debility" [read] | — |
| **Torchbearer** | Conditions recovered only in camp or town, spending **checks** earned in play [lead] | Forum, 2015 [checked]: "If you change the game so that checks are not needed, you make camping cheap, easy and frequent"; "Conditions are the stick, checks are the carrot" | The clearest case for a recovery that spends something |
| **Lancer** | Rest (an hour): spend Repairs | Repair Cap; a Full Repair needs "10 hours relatively uninterrupted in a secure location" [lead, a fan copy] | — |
| **Mothership** | Stress removed by Shore Leave in port, for credits [checked, the Alexandrian 2026] | Money; leaving the job | Players skip it when the price outweighs their Stress |
| **Worlds Without Number** | Healing adds System Strain to the patient; it falls about 1 a night [memory; a fan page: lead] | The limit sits on the patient | Offered as a fix for Pathfinder 2e [lead] |
| **Savage Worlds** | Healing rolls only in the "golden hour" after injury [lead, a 2010 poster, Deluxe] | A window after the injury | — |
| **Warhammer 4e** | Heal test: "only benefit from one Heal roll after each encounter" [lead, a fan page] | Once per encounter | — |

Shadow of the Demon Lord, Fabula Ultima and Forbidden Lands: not found [memory only]. **Praised for keeping attrition:** 4e's surges, 13th Age's four battles, Torchbearer's checks. **Blamed:** Pathfinder 2e's Medicine (free in the fiction, slow at the table), 5e's short rest (skipped). The difference [judgment]: whether the recovery **spends something time doesn't give back.**

---

## 4. A cost that refreshes, and one that disappears

- **Paizo** (`resources-and-recovery.md`) [read]: a no-cost breather is "too powerful if there's no cost to use it!"
- **M.T. Black** [checked]: long rests only in a settlement; a dungeon room can't be used to "hole up". The cost moves from time to place.
- **Gareth Ryder-Hanrahan** (Pelgrane, 2016, GUMSHOE) [checked]: some abilities refresh only at an adventure's end; extra refreshes are earned (a safe haven, covering up an incident); "Reward engagement, not success."
- **The Alexandrian on Mothership** [checked]: "a player will skip shore leave if their PC hasn't racked up enough stress to make it worthwhile". Too dear is skipped as surely as free is spammed.

**The line these sources draw** [judgment]: a cost **refreshes** when it returns on a clock the party can't shorten without paying (a day in safety, four battles, earned checks, money). It **disappears** when it returns on a clock the party controls for free (minutes of waiting), when its lockout is no longer than its refresh, or when picks shrink the clock until it stops binding.

---

## What seems to transfer

### (a) How an out-of-combat effect bypasses a cost: a checklist

1. **Unlimited retries:** can it be tried again at once after a failure? A worse result is no limit if the next try is free. (Treat Condition; Take 20.)
2. **A time cost when time is free:** is its only price minutes or hours outside a fight? (Treat Wounds, Refocus.)
3. **A lockout no longer than the refresh.** (Garden of Healing: 10 minutes against a 10-minute Refocus.)
4. **A per-fight refresh paying for a per-day effect:** does something that returns every fight or every few minutes restore what is meant to last a day? (Focus spells healing HP; the wounded condition cleared between fights.)
5. **A cost moved to nobody:** do neither the patient nor the helper spend anything slow? (Battle Medicine.)
6. **A window that picks shrink** (1 hour to 10 minutes; a day to an hour).
7. **Throughput instead of a limit:** a per-target limit multiplied by more patients or more helpers (Ward Medic; "your" Battle Medicine, so each medic heals again).
8. **A quick remover for a lasting cost:** does anything clear in seconds or minutes what was written to cross fights or days?

### (b) The fixes on record

| Fix | Game | Known cost |
|---|---|---|
| A daily pool, spent freely outside a fight, refilled only by a long rest in safety | 4e, 13th Age, Draw Steel | An unexplained daily limit; a number to track |
| Refill by fights, not hours | 13th Age | Count battles; resting early must be a loss |
| The patient pays | 4e Lay on Hands, 5e 2024 Healer, Worlds Without Number | The patient's pool must exist and be slow |
| A currency for recovery, earned or bought | Torchbearer, Blades, Mothership, Lancer | Too dear and it is skipped |
| A cap on short rests; the GM gains from them | Daggerheart | A resource on the GM's side |
| Recovery only in a place | M.T. Black; Draw Steel; Mothership | Judging "safe"; travel |
| A clock reset by new harm | Blades | One more track |
| A window after an attempt | Pathfinder 2e | Only if time is scarce and the window outlasts any refresh |
| One attempt per circumstance; let it ride | The Alexandrian, Hartlage, Burning Wheel | A GM judgment each time |
| An escalating interval or penalty | Pathfinder 2e's Aid; an EN World ladder | Bookkeeping |

### (c) What 2d12's files already apply

- **Rally Points come back only at a Rest; a Sleep and a new encounter don't** (`rules-src/04-health.md`): the daily pool of 4e, 13th Age and Draw Steel. **A Rest is 24 hours in a safe place**: Draw Steel's respite, M.T. Black's settlement. **One Sleep in 16 hours**: 5e 2024's wait.
- **The Breather is deleted** (`book/magic-design.md` decisions 55, 56): checklist line 2 closed for Nonlethal damage. The book isn't changed yet: `rules-src/04-health.md` still prints "Take a Breather", and `book/ideas/expedition-loop.md` items 11 and 13 still use it.
- **The patient pays:** Lay On Hands spends the target's Rally Point; "Round and Turn Actions can be used out of combat: the resource they spend is the limit" (`book/items-economy.md` Part 2, item 11). Line 5, solved the 5e 2024 Healer's way.
- **Magic doesn't restore Health (Guard only); spells that remove Wounds come with the Wounds tables** (`book/magic-out-of-combat.md`, the fixed list; magic-design decisions 36, 105): closes the Garden of Healing route for spells.
- **Wounds leave only at a Rest, one Check for each kind** (`04-health.md`): one attempt a Rest. **The Exhausted Save comes again "in 12 hours"** (`rules-src/08-conditions.md`): a timed retry.
- **Conditions follow how they end; a condition with its own timer is unchanged outside a fight; round-measured effects don't work there; an Encounter Action used between fights stays spent; the bag of rats** (`items-economy.md` Part 2, items 5, 7, 10, 12): lines 4 and 8 for the base rules, until a card or Talent adds a quick remover, which T2 now forbids.
- **Retries:** "you can try again if you can pay again" (magic-design decision 116, the Surge pool): a resource per attempt. **Repeating an approach takes 1 Bane** in Challenges (`book/roleplay-skills.md` item 9), as At-will Actions do in a turn: an escalating penalty. **"Not the same witness again before a Sleep"** (`magic-out-of-combat.md`, the scene-breakers table): one attempt per circumstance, with a clock. **Tier 1 "yes at a real cost"** (`roleplay-skills.md` item 6; decision 116): fail forward. **No general retry rule for a plain Check exists in `rules-src`** (searched): line 1 is open for skills.
- **Time costs something in a site:** Alert, a Sleep rolled against it, fights drawing neighbours (`book/ideas/expedition-loop.md` items 11 to 13); Momentum lost to a Sleep. This is what makes a time cost real.
- **Talents:** T1 (never a bare number) and T2 (no out-of-combat use repeatable without limit; a lasting cost never cleared by quick, free attempts) (`book/talents-design.md`). This checklist is T2's test.
- **One rule to hold against line 2** [observation, not a proposal]: "While Unconscious and not Dying nor Shattered, every hour you remove damage equal to what one of your Rally Points removes" (`04-health.md`, Unconscious) is a heal priced only in time. Chapter 4 doesn't say whether a sleeping character is Unconscious; `book/ideas/expedition-loop.md` item 13 says "a Sleep heals nothing".

## Sources

Archives of Nethys: Treat Wounds https://2e.aonprd.com/Actions.aspx?ID=57 ; Battle Medicine https://2e.aonprd.com/Feats.aspx?ID=5125 ; Treat Condition https://2e.aonprd.com/Feats.aspx?ID=6375 ; Medic https://2e.aonprd.com/Archetypes.aspx?ID=69 ; Godless Healing https://2e.aonprd.com/Feats.aspx?ID=869 ; Garden of Healing https://2e.aonprd.com/Spells.aspx?ID=2166 ; Refocus https://2e.aonprd.com/Actions.aspx?ID=2621 ; Demoralize https://2e.aonprd.com/Actions.aspx?ID=2395 ; Track https://2e.aonprd.com/Actions.aspx?ID=2408 ; Medicine https://2e.aonprd.com/Skills.aspx?ID=42 . Roll20: https://roll20.net/compendium/pf2/Continual%20Recovery ; https://roll20.net/compendium/13thage/Combat . rpgbot: https://rpgbot.net/p2/characters/classes/animist/apparitions/ .
EN World: https://www.enworld.org/threads/healing-in-pf2.672266/ ; https://www.enworld.org/threads/pathfinder-2e-is-it-raw-or-rai-to-always-take-10-minutes-and-heal-between-encounters.682675/ ; https://www.enworld.org/goto/post?id=8265147 ; https://www.enworld.org/threads/why-are-healing-surges-limited.227396/page-2 ; https://www.enworld.org/goto/post?id=9697399 .
Refused (leads): https://paizo.com/community/blog/v5748dyo6sg9r ; https://paizo.com/threads/rzs43vfn ; https://paizo.com/threads/rzs43vjn ; https://lr.ggtyler.dev/r/Pathfinder2e/comments/16g5zpf/michael_sayre_on_caster_design_schroedingers ; https://theangrygm.com/the-gms-burden-and-other-stories ; https://pelgranepress.com/2012/08/14/self-healing-in-13th-age/ .
Retries: https://www.d20pfsrd.com/skills/ ; https://thealexandrian.net/wordpress/38313/roleplaying-games/the-art-of-rulings-part-8-let-it-ride ; https://dmdavid.com/tag/how-to-avoid-boring-rerolls-of-dds-ability-checks/ ; https://alphastream.org/index.php/2026/04/21/how-many-times-can-a-pc-reroll-a-check/ .
Other games: https://5thsrd.org/adventuring/resting/ ; https://www.dndbeyond.com/sources/dnd/free-rules/rules-glossary ; https://www.aidedd.org/feat/healer ; https://steelcompendium.io/v2/Browse/rule/health/recoveries/ ; https://steelcompendium.io/v2/Browse/rule/resource/respite/ ; https://en.daggerheart.su/rule/using-downtime ; https://raw.githubusercontent.com/amazingrando/blades-in-the-dark-srd-content/master/Blades-in-the-Dark-SRD.md ; https://exposit.github.io/dw-srd/dw_special_moves.html ; https://forums.burningwheel.com/t/camping-without-checks/15043 ; https://lancer-rpg-operation-quiet-glass.vercel.app/mechanics/mech-combat/repairs-and-rest/ ; https://thealexandrian.net/wordpress/53248/roleplaying-games/mothership-thinking-about-shore-leave ; https://www.enworld.org/goto/post?id=5330339 ; https://www.worldanvil.com/w/warhammer-fantacy-cooledcross/a/heal-article (not opened).
Refresh against disappear: https://pelgranepress.com/2016/04/04/the-plain-people-of-gaming-refreshes-as-thematic-reinforcement/ ; https://www.mtblackgames.com/blog/five-minute .
