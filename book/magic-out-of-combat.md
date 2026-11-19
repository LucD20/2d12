# Magic outside a fight: the working file

**Opened 2026-11-19.** The piece decision 87 of `book/magic-design.md` left to design. **Nothing here is decided and nothing is in the book.** This file is to this piece what the magic record is to magic: Lucas's words, what is already fixed, the problems to design against, the steps, then each decision as it is taken. The magic record stays the authority for everything else; a decision taken here is also entered there.

---

## 1. Lucas's words

- On spells (decision 49): "unique, cool sounding, you can make arguments for out of combat uses".
- On the split (decision 87): "people will pick spells that buff for 10 minutes and then can just cast them as a more permanent buff. Should we make these combat only and the 'out of combat' stuff we create per path or school?"
- On what magic makes (decision 93): "I think the out of combat spells will need something like this, like creating a bridge."
- On identity (decision 106): "I think it's an amazing idea that Paths can cause changes on the user just by them having that knowledge. We can work on that during out of combat design plus path designs."
- **On this piece (2026-11-19): "This is a huge can of worms, with the biggest problem being solving everything with magic, or martials feeling lame etc." "Make sure to get info about roleplay and magic out of combat."**
- On roleplay (2026-11-07, `roleplay-skills.md`): "it is a Roleplaying game, so this is a big part of the system." His dislikes there: 4e's reputation for no roleplay, Draw Steel's over-the-top out-of-combat features, Pathfinder 2e's skill feats.
- The standing tests: horizontal growth; fits Talents and Classes; complex but intuitive; the least ambiguity.

---

## 2. What is already fixed

### By the magic record

| Fixed | Decision |
|---|---|
| A spell with a duration (rounds, EoT, the encounter) is combat only; an instant spell can be cast outside for its Surge | 87 |
| Lasting magic outside a fight is its own piece: the Path is what it is made of, the School what it does; a higher rank opens wider uses; the Surge held outside pays for it | 87 |
| Surge outside an encounter is a pool equal to the party's Momentum (0 to 4); it refills whenever the party gains Momentum; armor's cut doesn't apply there | 71, 100, 105 |
| A casting is always noticed (who casts, on whom) unless the spell is [Subtle]; a spell is identified by those who meet its Path and School | 97, 98 |
| A rank is never a number on a roll or a DC; ranks stop at 6 | 18, 105 |
| Magic doesn't restore Health (Guard only); spells that remove Wounds come with the Wounds tables | 36, 105 |
| Magic doesn't take a whole turn from a PC or a major enemy; charm is "can't target it with a harmful Action", control is one Action | 39 |
| Bringing back the dead is to exist, heavily limited, likely once | 93 |
| A Path changes the person who walks it (an idea to design here) | 106 |
| A counterspell is a Talent tree | 99 |
| A caster's Mastery outside fights is part of the Mastery review | 103 |

**One sentence to reword when this piece exists:** the third Limit, "magic that lasts needs a fight to feed it", is true of battle spells only.

### By Lucas's own rules for play outside combat (`items-economy.md`, Part 2; marked [Lucas] or [agreed] there; not in rules-src)

| # | The rule | What it means here |
|---|---|---|
| 1 | A hostile Action attempted against a creature that is aware of it rolls Initiative first | A spell on someone in a talk scene starts a fight unless it is [Subtle] or not hostile |
| 5, 6 | Outside an encounter, effects that last rounds, EoT or the encounter don't work: "combat effects feed on Escalation" | The wall decision 87 stands on |
| 11 | Round and Turn Actions can be used out of combat; the resource they spend is the limit | An instant spell with no Surge cost is free outside |
| 13 | Effects with long durations (his examples: Truespeech, Message, Light, Water-breathing) last as written | This piece's home: such effects are expected to exist |
| **14** | **A long-duration effect never grants a combat bonus** (a Buff, a bonus to rolls, Defenses or damage, Guard, Empowered, Boons, Favored). It can change the *circumstances* of a fight, not its *numbers* | The firewall against prebuffing, already written |
| 15, 16 | Preparation is allowed (positioning, scouting, an ambush); knowing what you will face gives +1 Escalation at the start | What scouting magic can honestly buy |

### By the proposals for roleplay and skills (`roleplay-skills.md`; proposals of 2026-11-07, **not decided**)

- **Skills are not written.** The proposal: 8 to 12 broad skills raised by Talents; Backgrounds as 1 Boon; Routine (a Tier 2 without rolling when trained and unpressed); Challenges and Negotiations for big moments only.
- Its rules for every out-of-combat ability: **anyone can attempt anything plausible**; **no certainty** ("it never auto-solves a scene"); separate budgets from combat picks; the idea sets the roll.
- **MASTER-PLAN puts Skills (D3) before Magic (D4): "spells may use skills".** Magic was taken first. This piece is where that order bites: "magic helps a Check" needs to know what a Check outside combat is.

### By the expedition loop (`expedition-loop.md`; a candidate, not in rules-src)

- **Alert:** a site's number, 0 to 6; a loud event raises it by 1; a Sleep in the site is rolled against it. Loud or visible magic has a ready price here.
- Prisoners, shortcuts and scouting pay in the preparation bonus or in Alert.

---

## 3. The research (read before the steps)

| Note | What it gives this piece |
|---|---|
| `research/out-of-combat-magic.md` | Eight shapes with their weaknesses; Fabula Ultima as the closest match; what free-form games all end up adding; abuse and disuse; **a verb + noun pair says what may be attempted and never, alone, how much** |
| `research/crucible.md` | Out-of-fight magic written by substance: one entry a Rune, three fixed uses, and an open "the GM decides" clause to avoid |
| `research/ars-magica.md` | Five verbs each with a hard edge; spontaneous magic; the Limits |
| `research/dominions-magic.md`, `dominions-rules.md` | Rituals as a separate list (347 of 832 spells): scrying, searching, wards, remote attacks |
| `research/revival.md` | A return as a rite, not a spell |
| **`research/magic-vs-skills.md`** (2026-11-19) | Why casters outshine everyone outside a fight; nine mechanisms; what each game's fix cost; what feels good for the non-magical; **a 12-point checklist** |
| **`research/roleplay-and-utility-magic.md`** (2026-11-19) | A divination is not a mystery's enemy; ten scene-breaking families and their fixes; eight principles of fun utility magic; **toolbox against solution**; how magic marks its user; raw themes for each Path |

---

## 4. The problems to design against

**Two failures, opposite each other. Both are common.**

### Abuse: magic solves everything, and the others watch

The research's diagnosis (`research/magic-vs-skills.md`): the gap is **breadth outside the fight**, not damage; a niche protects **an outcome**, so a spell that reaches the same outcome by another road destroys it ("You have a chance to pick a lock? I just use knock"). The mechanisms, and where 2d12 stands on each:

| # | Mechanism | 2d12 today |
|---|---|---|
| 1 | The spell is **certain** where the skill rolls | **Open.** The project's proposal for every out-of-combat ability is "no certainty" |
| 2 | **One need a day:** a rare spell covers the day's one lock, and the at-will skill never gets its turn | **Open.** Depends on the price |
| 3 | **No opportunity cost** | Mostly closed: the Surge held outside is 0 to 4, earned by encounters overcome, not by sleeping |
| 4 | **A toolkit changed daily** | Partly open: few spells known, but swapped on a Rest |
| 5 | **Magic is general by default:** what it can't do must be written | **Open.** The Limits of Magic have nothing on skills |
| 6 | **Magic is exclusive:** nobody else can sense it, answer it or help | Partly closed: a casting is always noticed |
| 7 | A bonus so large that the roll is decided | Closed: a rank is never a number |
| 8 | A lasting buff carried into everything | Closed: duration spells are combat only; item 14 |
| 9 | **It drifts back** with every new spell | **Open.** Needs a written test every later spell passes |

### Disuse: magic hedged until nobody uses it

D&D 4e's rituals lost to their cost and casting time; Fabula Ultima's get forgotten; Pathfinder 2e's casters are reported as feeling weak after its fix. A second magic system is invisible unless ready-made uses sit on the sheet.

### And four more

- **Negotiation.** Free-form magic becomes arguing with the GM ("Mother May I"). Every free-form game ended up adding the same supports: a never-list, named scope steps, fixed prices, worked examples.
- **A pair is not a limit.** In every game read, verb + noun says *what* may be attempted and never, alone, *how much*.
- **Scene-breakers.** Finding out (the dead, truth, locating), charm, flight and teleport, shelters, opening, invisibility. Repeatable and certain breaks a scene; once and partial gives a lead.
- **The non-magical side isn't written.** Skills, Routine, Backgrounds and Challenges are proposals. What feels good there, by the research: being good without spending, no roll for your own trade, things only they do.

### Two tests a rule or a use can be held to

- **Toolbox or solution?** A solution names the obstacle it removes (open the lock, feed the party, make the camp safe, force the truth). A toolbox names a thing it does and leaves the obstacle to the player (an image, an unseen hand, a voice for a tree).
- **The 12-point checklist** of `research/magic-vs-skills.md`, section 6.

---

## 5. The steps (one decision at a time; the order is Claude's proposal)

| # | The step | What is decided | Why here |
|---|---|---|---|
| **1** | **The stance** | The one principle magic outside a fight obeys against "solves everything". The two printed answers contradict each other: magic *helps* the Check (Pathfinder 2e) or magic *changes what is possible and never does what a skill does* (Worlds Without Number). 2d12's own decisions lean one way already | Everything after is written to it |
| **2** | **The Check outside a fight** | What this piece assumes of Skills, which aren't written: an Attribute Check as the rules have it, with Skills as a hook to fill later; or the few Skills decisions it leans on taken first | "Magic and a Check" needs to know what a Check is |
| **3** | **The shape** | A few written uses for each Path; a free-form rule with a price table; or both (written uses on the sheet, and a bounded rule for the rest) | Abuse and disuse pull opposite ways here |
| **4** | **What the two words mean outside** | One line for each Path (what it works on) and one for each School (what it does), each with a hard edge | The pair is the permission |
| **5** | **How much** | The scope steps in named things: how big, how far, how many, how long. And permanence (Lucas's bridge) | The pair can't say this |
| **6** | **The price** | Surge from the pool of 0 to 4; time; being noticed, and Alert in a site; whether a Check is rolled and what failing costs | Mechanisms 1, 2 and 3 |
| **7** | **What a rank opens** | New kinds of doing and wider scope, never a number | Horizontal growth |
| **8** | **The scene-breakers** | A policy for each family: finding out, charm, travel, shelter, opening, hiding. Which are written narrow, which are rare, which don't exist | Where "solves everything" actually happens |
| **9** | **The others at the table** | What a non-caster has that magic can't reach; helpers who can only help; magic's place in a Challenge | "Martials feeling lame" |
| **10** | **The Path changes its user** | Lucas's idea (106): a mark, a temperament, how the world reacts. Free, visible and chosen marks are the ones tables keep | His to shape; it also feeds roleplay |
| **11** | **The never-list, the name, the examples** | The Limits for this piece; what it is called; the ready-made uses that sit on the sheet | Against negotiation and disuse |
| **12** | **The test** | Six scenes run with a caster and without one (a locked door, a chasm, a witness who won't talk, a night in a dangerous place, a murder, a negotiation), then an independent audit against the checklist | Before anything is shown as done |

---

### The order as agreed (Lucas, 2026-11-19: "Yes")

**Side by side with the frame of Skills, not the list** (`research/skills-or-magic-first.md`: magic leans on nine decisions about skills, and none of them is the number of skills or their bonuses). Steps 1 and 2 become one sitting of five short decisions, taken together because they are one balance seen from two sides:

1. The stance for magic outside a fight.
2. Whether anything succeeds without a roll, for skills and for magic alike (Routine; "no certainty").
3. What a failed Check costs outside a fight.
4. How one character helps another's Check.
5. What skills cover, as five or six broad categories of outcome (not the final list).

The skill list, its numbers and the Skill Talents stay for the Skills session (D3), which inherits whatever is fixed here. Then steps 3 to 12 as above.

---

## 6. Decisions

| # | Decided | Lucas's words | Record |
|---|---|---|---|
| 1 | **The stance: magic changes what is possible and never does what a skill does. When magic makes something attemptable, the Check that follows belongs to whoever is best suited, not automatically to the caster.** No bonus to a Check from magic. A Talent may open one skill's outcome to magic, as a Check with a roll | "C is the way to go"; "B falls into the lameness of 'just a bonus'"; "A Talent to roll to pick a lock with your Power modifier or something" | 114 |
| 2 | **Without a roll: Routine for skills, never for magic.** Routine: if 11 + your total skill modifier is at least the task's DC, and there is no threat and no time pressure, you do it. A use of magic outside a fight always rolls, or has a printed limit that leaves the obstacle standing | "A"; "If 11 + total skill mod beats the DC of the task, the character can do as a Routine (no threats, no time constraint etc)" | 115 |
| 3 | **A failed Check: one guide for every Check, magic included** (Tier 1 no, or yes at a real cost; Tier 2 yes, but; Tier 3 yes, and more). **A casting always spends its Surge and is always noticed,** whatever the result. No mishap table | "A" | 116 |
| 4 | **No help Action outside a fight.** When several characters work at one task, the one best suited makes the Check; what the others do can change the task itself (its DC, or whether it can be attempted), or is a Check of its own. In a fight, a help Basic Action gives 1 Support Boon, no roll | "Do you think it would be too hurtful to just remove out of combat help?"; "A, it's good. And add some examples" | 117 |

**Examples for decision 4** (drafts; the first two are Lucas's):
- **Everyone talks to the merchant.** Nobody rolls to help. The GM asks one Check, from the PC best at persuading; what the others said can change what is being asked for, and so its DC.
- **A locked door.** One Check, from the PC best at locks. Three people crowding the lock add nothing.
- **Holding the ladder.** It doesn't add to the climber's roll. It makes the climb an easier climb (a lower DC), or a possible one.
- **Keeping the guard busy while a friend slips past.** That is its own Check, with its own result; if it works, the friend's task has changed (the guard isn't looking).
- **A caster freezes a path across the river.** The magic made the crossing possible; the surest-footed PC makes the Check to lead the others over (decision 1).

| # | Decided | Lucas's words | Record |
|---|---|---|---|
| 5 | **What skills cover: five kinds of outcome, as a guide and not a wall.** Getting past; swaying people; finding out; enduring and travelling; making and mending. **The test for any use of magic: does it open a way, or solve it right away?** Charm, domination, an alarm and the like are to exist, each written so that it opens a way | "Yeah magic should open ways, not solve them right away. So it is option A with a bit of C; we shouldn't lock behind too much otherwise there is no charm spells, dominate, alarm, etc" | 118 |

**The frame is closed (decisions 113 to 118).** Next: step 3, the shape.
