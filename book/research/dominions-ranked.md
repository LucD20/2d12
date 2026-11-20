# Dominions 6's High and Medium mechanics, reviewed against 2d12 and ranked

**Date:** 2026-11-20. **Asked by Lucas** (after `dominions-mechanics.md`): "Keep that document and create a new one. For each High and medium fit rule, you review it comparing to my rules. From there, you order it from 'Best fit' on top, going down to not as best fit (all are still fits, since they are best and medium). Make sure to review each of them with 2d12 rules and make sure they are actually a decent candidate. Then add a 'Complexity' column too, on how complex it would be to put them into the 2d12 rules. Low and Unsure you can keep in the mechanics doc."

**What was done.** Each of the 121 rows rated High or Medium in `dominions-mechanics.md` was checked again against the rule it would touch, in the files themselves: Chapters 1 (riders, subtypes, Saves, the Action DC), 2 (Reactions and their moments, Frequency, durations, Escalation, Momentum), 3 (Size, movement, Forced Movement, Collision, Steadiness, terrain, Deadly Hazards, Reach, areas and Auras, Light, Senses), 4 (Health, Going Down, the Wound tables, Rally Points, Guard, recovery), 6 and the Basic Action cards (Hide is a placeholder), 7 (traits, Tags), 8 (conditions, Lingering), 14 (ranks, the points, NPC Reactions, Elite Escalation, roles, building an encounter) and 15 (Hands, properties, Mastery, armor); and the design notes `decided.md`, `magic-design.md` (decisions 112 to 128 above all), `items-economy.md`, `expedition-loop.md`, `roleplay-skills.md`, `talents-design.md` (T1 to T17), `rules-backlog.md` (the Chapter 4 review's proposals) and `research/revival.md`.

**What the review changed.** 15 rows did not hold and went back to the mechanics note as Low or Unsure (section 1); 5 rows were merged into others; **101 candidates remain**, ranked in section 2. **Nothing here is decided;** the scores are Claude's.

**Read with:** `dominions-mechanics.md` (each mechanic's full Dominions text and numbers; the IDs here are its IDs) and the four earlier Dominions notes.

---

## How to read the ranking

**Fit (1 to 10)** adds four judgments:
- **The hook:** does it stand on words 2d12 already has (Bloodied, Lingering, Size, the Start of the Encounter stack, the Disruptive tags, the Elite's phases...), or does it need a piece nobody has written?
- **The need:** does it fill something the project has named as missing (a `[!tbd]` box, a placeholder card, an open question in `decided.md`, a proposal waiting for it)?
- **Lucas's tests:** tactical, the least ambiguity, horizontal growth (no bigger numbers), fun; and his standing rules (no lost turns for a PC or a major enemy; a Tag adds, never switches off; items give options, not numbers; magic opens a way, never solves it).
- **The cost of a conflict:** a candidate that rubs against a decision loses points, and the "Watch for" column says where.

**Complexity (1 to 5)**, how much it takes to put it in the rules:

| | Complexity | What it means |
|---|---|---|
| **1** | Trivial | A sentence in a rule that exists, a writer's guide line, or a stat-block or card pattern using only existing words |
| **2** | Low | One new card, stat-block line or paragraph; at most one small new term; may need a price from the Bestiary's points |
| **3** | Medium | A new word (a condition, a trait, a property) or text across two or more chapters; may need the ruler or the SIM to price it |
| **4** | High | Part of a piece that isn't written yet (the Wound tables, travel, deities, mounts): it waits for that piece's own frame |
| **5** | Very high | A subsystem of its own (crafting, a campaign layer of places and faith, base building) |

The order is by Fit, then, at equal Fit, the lower Complexity first.

---

## 1. The rows that did not hold (moved back to the mechanics note)

| ID | Was | Now | Why, after the review |
|---|---|---|---|
| A3 (rout weighted by kind) | Medium | Low | **Already there:** "the fight is decided at half its CV" (`expedition-loop.md` 14) weights by rank by itself: a Minion is 25 of the CV, an Elite 200 |
| B10 (starvation) | Medium | Low | **Already there:** the Rough Day (`items-economy.md` Part 4, 16): fewer Rally Points at the next Rest, Exhausted 1 from the third in a row |
| C7 (two weapons by their size) | High | Low | **Already there:** Chapter 15's Hands rule is Dominions' answer (the off hand 2 Banes, a Light weapon 1); open question 16 is about Talents lowering it, not the base |
| D6 (a value shows its sources) | High | Low | **Already there** in Foundry (the dice's sources named, v0.0.440) |
| G3 (a failed infiltration warns) | High | Low | **Already there:** the failed-Check guide (Tier 1: "no, or yes at a real cost", decision 116) and Alert (+1 on a failed stealth Challenge) |
| G12 (anonymous rituals) | Medium | Low | 2d12 has no remote harmful magic among its families (decision 128), and [Subtle] already hides a casting; "it seems natural" has nothing to hide |
| G15 (the watched notice the scout) | Medium | Low | **Already decided:** "finding and watching from afar: [...] the watched can notice" (decision 128) |
| G17 (no fight until someone is found) | High | Low | **Already there:** Starting a fight (`items-economy.md` Part 2, 1 and 2): Initiative when a hostile Action is attempted against a creature aware of it; Surprise from the Senses |
| K5 (a hunter that kills its caster if it finds no target) | Medium | Low | 2d12's spells target what you perceive within Line of Effect; nothing "seeks". It would need a seeking spell first |
| K17 (fetching a person from afar) | Medium | Low | Far travel of another creature is one of the rare, GM-given families (decision 128); as a villain's kidnapping it is plot, not a rule |
| L1 (three trigger words on items) | High | Low | **Already there:** 2d12's card language has all three (when you make the Strike; on a Tier; when it deals damage, after Guard) and "a rider happens whatever damage" (Chapter 1) |
| G9 (a place that seems other until entered) | Medium | Unsure | Decision 128 bounds hiding and disguise to "sight only; a face only": a disguised building or land is beyond it, unless a rare card says so |
| G10 (a place forgotten by those who leave) | Medium | Unsure | Memory is past "sight only", and the scale is a whole fort |
| L4 (tainted items draw horrors) | Medium | Unsure | It needs a horror-mark clock, which is itself Unsure (M3) |
| F8 (preaching capped by rank; inquisitors; heretics) | Medium | Unsure | Each piece acts on a place's Faith (F6), which is Unsure |

**Merged:** A2 into A1 (the leader's fall is part of the decided fight); A11 and E-c into A10 (a creature bound to a leader or to an anchor is one rule); C11 into C10 (displacing is a trample without the damage); J2 into J1 (target priority is half of the Tactics line).

---

## 2. The ranking

### Best fit (Fit 9): stand on existing words and fill a named gap

| # | ID | The mechanic | Fit | Why it fits (the 2d12 hook, the gap) | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 1 | H6 | **The place changes how a condition ends:** rain and water put out burning; deep cold slows thawing | 9 | Lingering already has one kind per subtype and ends by Shake Off or at EoE (Chapter 8). One line: "in rain, or in water, a Lingering Fire ends at the end of your turn". Tactical (drag them into the river), exact, no number | Name which subtypes have one (Fire in water; maybe Cold by a fire) and stop there | 1 |
| 2 | E-a | **A second form when wounded** (the dragon god turns into a dragon when hurt) | 9 | The Elite already has phases: "when it becomes Bloodied, and when it becomes Strained, its Escalation increases by 1 [...] the players always see an Elite change" (Chapter 14). A form change is a phase with a body: "When it becomes Bloodied: it takes its second form (these Actions replace those)" | Price the second form's Actions from the same turn budget; it must not be a second Health bar (that is E-f) | 2 |
| 3 | A10 (+A11, E-c) | **Bound to a leader or an anchor:** without its master the mindless stop, still strike what is adjacent, and crumble; the lion statues crumble when the courtyard lion falls | 9 | 2d12's summon leaves when its summoner goes Down (`decided.md` 1, Summons): the same rule for NPCs, a Bestiary line "Bound to [X]: when X goes Down, these stop moving and fall apart at the end of the next round". Makes the leader a target the players choose (A1), and fills the morale gap with no morale roll | A bound creature is worth less CV (it can be switched off): price it in the Bestiary measurement | 2 |
| 4 | G4 | **Group stealth:** the hiders' strength is the leader's Stealth minus 1 for each other member | 9 | Hiding and sneaking are not written (Chapter 3's `[!tbd]`; Hide is a placeholder card), and the Lead Check (the highest modifier rolls for the party, `decided.md` 3) would let the best sneak carry everyone. One sentence fixes it: "a Lead Check to sneak takes 1 Bane for each PC beyond the first two" | Write it with the Hide rules, not before; the Bane count is the Check's rule, not a Talent's number (T1 is for Talents) | 2 |
| 5 | M1 | **Every order written once, each step saying what it guarantees** (Dominions' 63-step turn sequence) | 9 | Open item 14 in `decided.md` ("the order of a turn's start, a chapter for the book"): Sustain, regaining AP, Slowed and Dazed, unspent-AP Guard, Lingering, Surge. The same for a Sleep (Upkeep, Bind, Momentum -1, Exhausted -2, Daily Actions) and a Rest (Wound Checks, Rally Points) | Every class and spell card that acts "at the start of your turn" must be placed in it; Foundry follows | 3 |
| 6 | A7 | **Fear that makes the weakest flee:** a stronger fear than Frightened that sends Minor enemies (Minions and Grunts) out of the fight, and does to anyone else what Frightened does | 9 | Precedent: a Forced Movement into a Deadly Hazard already kills Minor enemies and only Imperils the rest (Chapter 3). Respects the Limits of Magic (no whole turn taken from a PC or a major enemy). A runner counts for the win (Mastery: "Down, fled or surrendered") but raises Alert by 1 (`expedition-loop.md` 9): a real trade. A home for Death's fear | Define "flees" once (it leaves by the nearest exit; it isn't Down, so hooks on "goes Down" don't fire); price it | 3 |

### Strong fit (Fit 8)

| # | ID | The mechanic | Fit | Why it fits | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 7 | G1 | **What each finding-out method reveals is a printed list** | 8 | Decision 128 ("once and partial gives a lead") and decision 119 (a printed limit) already ask for it; this makes it a writer's rule: "it reveals who, how many and where; never what they plan" | Keep the lists short; a list that grows becomes a certainty | 1 |
| 8 | G2 | **What you learn depends on who you are:** a spy who is a mage also reads the magic, a priest the faith | 8 | Tier 3's "yes, and more" (decision 116) read by the character: a rank in a Path, or the Divine, adds what that knowledge sees. Close to decisions 97-98 (you recognize what you have opened) and 106 (a Path changes the person) | It must add, never be required: if a mystery needs a Death caster to be solved, it is PF2e's permission trap | 1 |
| 9 | I2 | **The dead as a resource of Death:** a place's unburied dead, sensed only by a Death caster, used by necromancy | 8 | Death's small magic (decision 119: free, never changes a Check); a Death summon or spell that needs a body nearby (magic-design 5o C: "a body raised from an enemy that went Down") | The count needs no number: "you sense where the dead lie, and roughly how many" | 1 |
| 10 | C10 (+C11) | **Trample:** a much larger creature moves through smaller ones and throws them aside; they Save or take damage | 8 | Every piece exists: Size ranks, "passing through the squares of an unwilling creature is Difficult Terrain", Slid, Collision, Prone, and the Bestiary prices Forced Movement and riders. "Trample: Advance through creatures at least 2 SR smaller as normal terrain; each is Slid 1 and makes a Body Save (Tier 1: damage and Prone)" | "No movement ends in another creature's square" (Chapter 3) stays true: the trampled are slid out first | 2 |
| 11 | J1 (+J2) | **A Tactics line:** an NPC follows a written order (holds two rounds, then charges) and a target priority (the casters, the closest, the rearmost) | 8 | Roles already "tell the GM how to play it" (Chapter 14); the line makes it exact and readable for a new GM | Chapter 14's tip: if every enemy strikes the same PC the fight plays one step harder; a focusing priority must be counted in the CV. For a player's summon an order would take the control away from its player: keep it for NPCs | 2 |
| 12 | C26 | **Berserk at Bloodied:** fights on, can't be routed or frightened, until it falls unconscious | 8 | Bloodied "has no effect by itself: Actions and features use it" (Chapter 4). For NPCs a priced passive; for PCs a Talent that changes a rule ("you can't be Frightened, and you can't end your turn farther from the nearest enemy, until EoE") with no bare number (T1) | The restriction is the price; check against "a lower cost or a lifted penalty only by an Action" (T14): immunity to Frightened is a lifted penalty, so the Talent should be an Action that starts the rage | 2 |
| 13 | L3 | **Cursed items as the strongest ones:** they can't be taken off and carry a printed price | 8 | Bind already exists (bound and unbound at a Sleep, `items-economy.md` 8a): "Cursed: it can't be unbound" is one line, and "specific items can have their own specific effects" (7) allows the price | The price must be a story or a rule cost, never a number on the Modifiers (item rule 4) | 2 |
| 14 | L6 | **Extra Life:** an item that saves you from one death | 8 | The Disruptive tag's Death covers "resurrection, undoing a Down" (`items-economy.md` 34); `revival.md`: "an item, a place or a rite, not a card" | The revival note's two questions: what happens at the second death, and what the dead player does meanwhile | 2 |
| 15 | A1 (+A2) | **Fights end on nerve, and the leader's fall decides it** | 8 | `expedition-loop.md` 14 (a proposal: the fight is decided at half the CV or when the leader is Down) and its Parting Beat; Dominions is a whole tactical game run on it. New: the leader must be marked on the stat block so the players can aim for it | It is a proposal still waiting for Lucas, with Alert and the runners; it needs the ruler's check | 3 |
| 16 | C16 | **The order of an Action against you, written once** | 8 | Chapter 4 has "damage reduction first, then Guard"; Chapter 2 has when an Interrupt and a Trigger happen; Chapter 1 has Resistance once per Action and riders. One numbered list (Interrupts; the roll; Resistance; reductions; Guard; split or shared damage such as Shared Burden and Ricochet; riders; Triggers) ends the questions between them | It moves text out of four chapters into one place; every reference must point there | 3 |
| 17 | B6 | **Each Wound names how it heals** (a Rest's Check, a healer's service, one rite, a place) | 8 | A Rest's Wound Checks exist (Chapter 4); the town Services (`items-economy.md` 21: crafter, sage, temple...) can take a healer; "spells that remove Wounds come with the Wounds tables" (decided) | Most Wounds should still go at a Rest (the Chapter 4 review's proposal 5: "permanent ones rare and marked") | 3 |
| 18 | B4 | **Wounds that matter on the road:** a limp slows the march and can worsen into a cripple on a forced one | 8 | Gives the Body Wounds a cost between fights, where the Supplies, the Rough Day and the Forage already live | Needs a travel and forced-march rule (H1), not written | 3 |
| 19 | I1 | **Places of power found by rank:** a site of a Path is found only by a caster whose rank in it reaches the site's difficulty | 8 | Horizontal growth in its purest form: decision 126 (what a rank opens outside a fight) and a reason to explore; GM content keyed to ranks, never a number | What a site gives must be written (a card cast there, a free stretch there, a summon's body): K14 is one of its gifts | 3 |
| 20 | F15 | **A return prepared in advance:** you come back where you prepared it, changed, and only if that place is still yours | 8 | The shape `revival.md` lacks ("a ritual the party performs" meets "a Rest"): a rite done in safety before the danger, with a place that can be lost; a mark as its price (F13) | Decision 93: likely once; the second death; what happens if the place has fallen | 3 |
| 21 | B3 | **The Wound tables' entries by body part**, a minor and a major tier: the eye, the voice, the mind; the chest, a wound that won't close; the arm; the leg | 8 | The Dying and Shattered Tables are placeholders ("something minor", "something severe"); Dominions gives a worked list for the Body Table, and Battle Fright, Dementia, Feeblemindedness and Mute for the Mind one | Dominions' afflictions are permanent; the Chapter 4 review asks for "recoverable severities, permanent ones rare and marked, some player choice, no repeated bands": scale them down | 4 |

### Good fit (Fit 7)

| # | ID | The mechanic | Fit | Why it fits | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 22 | L9 | **An item that acts by itself at the start of every fight** | 7 | The Start of the Encounter stack (Chapter 2) already orders such effects (Judge) | It is a combat effect, not a long-duration one, so `items-economy.md` 14 doesn't forbid it | 1 |
| 23 | L10 | **A free resource each fight:** an item that gives 1 Surge at the start of each encounter | 7 | Items may give Escalation hooks (the Banner of the Last Stand gives 1 Escalation); Surge is a per-fight resource that can't be hoarded | Surge is unplayed (decision 66 onward): price it after the first caster playtest | 1 |
| 24 | L11 | **Group effects measured by size:** "it covers creatures whose SR adds up to 9" | 7 | Size ranks exist (Chapter 3), and a Medium creature is SR 3, as Dominions' human is size 3: a horse costs more than a halfling, exactly | Use it only on cards that cover a group (flight, water-breathing, a shelter) | 1 |
| 25 | A5 | **Bloodied as the count of a group's losses** ("a group breaks when half its members are Bloodied") | 7 | NPCs have both thresholds (every rank's Health is Vigor and Resolve); Bloodied is a pure hook; an alternative trigger for the decided fight | Minions are Bloodied almost at once (6 Vigor): count only Standards and Elites, or use it for Grunts and up | 1 |
| 26 | B7 | **A Wound held by a cursed item** can't heal while the item is worn | 7 | One line joining L3 and B6 | Comes with both | 1 |
| 27 | L8 | **An effect when the bearer goes Down** (a burst of fire) | 7 | "A creature goes Down" is a defined moment (Chapter 2); magic at the moment of going Down was flagged worth having (magic-design 5o C) | For PCs, Down is not death: say whether it fires again on a second Down | 1 |
| 28 | F13 | **Coming back costs a change, not a number:** a Path rank lost, or a mark of Death gained | 7 | `revival.md`'s "a mark that is a trait, not a number" and decision 106 (a Path changes the person) | A non-caster has no Path to lose: the mark must be the general price, the rank a caster's option | 2 |
| 29 | G7 | **An ambush recipe:** the place follows the victim's habits, each guard is there by chance, the bystanders are in the fight | 7 | Surprise from the Senses (`items-economy.md` Part 2) and encounter building (Chapter 14): a GM chapter page | GM guidance, not a rule: keep it out of the player's chapters | 2 |
| 30 | H2 | **Survival in one terrain as a Skill Talent family** (forest, swamp, mountain, waste): faster travel there, Forage that always feeds, no Exhausted from its weather | 7 | Survival is in the proposed skill list (`roleplay-skills.md` 7); Skill Talents give nothing in an encounter but may shape before it (T2); Forage is an Instinct Check (`items-economy.md`) | Waits for the Skills pass (D3) and the travel rules; check it against the permission trap (nobody else loses the right to forage) | 3 |
| 31 | C2 | **Gear damaged in two steps:** Damaged, then Broken; magic gear repairs itself after the fight unless broken | 7 | Lucas's Sunder question (`decided.md` 15: "1 Bane to AD"); Dulled and Repair (`items-economy.md` 19); shields are not written (Chapter 15's `[!tbd]`) | **An NPC's gear is flavor** (Chapter 14): against an NPC, Damaged and Broken must be conditions on the NPC, not its armor. Needs the armor and shield pass | 3 |
| 32 | F1 | **A god built from a few domains,** each blessing costing what it requires | 7 | Deities are not written; Aveline's Cold Domain is already a Faith Talent on a god's domain (T16); `pillars-of-eternity.md` has the player's ask (a warrior of a chosen god) | Divine is not magic (decision 12): domains must not become Paths again; T3 (no Talent written for one class) and T10 (a way into the Divine for others) are open | 5 |

### Fits (Fit 6)

| # | ID | The mechanic | Fit | Why it fits | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 33 | C5 | **Underwater, only piercing weapons work well** ("Slash and Blunt Strikes take 1 Bane") | 6 | "Subtypes have no rules by themselves, but other rules use them" (Chapter 1): an environment rule may | Rare in play; write it with swimming | 1 |
| 34 | C25 | **An ability that works only in a light level** (Sun Awe: not in the dark or underground) | 6 | Light has three exact levels (Chapter 3): "only while it is in Bright light" can't be argued | A Bestiary and Talent pattern, nothing more | 1 |
| 35 | G13 | **An effect you can't perceive doesn't tell you whether it worked** | 6 | Out-of-fight spells reach "a place you have been" (decision 124): one sentence for what the caster knows | Narrow: few cards reach out of sight | 1 |
| 36 | G16 | **A warning item:** a chance to see an ambush coming | 6 | Surprise comes from the Senses; items may give senses (`items-economy.md` 5) | Write it as a sense ("you hear Hidden creatures within 5 squares while you sleep"), not a percentage | 1 |
| 37 | J3 | **An Elite's Opening:** its plan for rounds 1 and 2, with a fallback | 6 | The Tactics line's (J1) first rows | Must not lock the GM out of reacting to the table | 1 |
| 38 | K8 | **Monsters sent as adventure hooks:** a rival's ritual sends a beast that ravages a land "until it is found and slain" | 6 | GM content; a hunt with a clear end | Nothing to write in the rules | 1 |
| 39 | K18 | **Dream magic needs a sleeper with a mind** | 6 | "A Tag adds, never switches off, except where the fiction demands it" (`dominions-rules.md` 5, `divine-profane.md`): a model of a fiction gate for Glamour's cards | Write it on the card, not as a general Tag rule | 1 |
| 40 | A15 | **Where a retreat ends:** a Check, easier in land you know; a failure lands you somewhere worse | 6 | The Retreat's consequence table (`items-economy.md` Part 4, 21): Dominions gives its entries | Entries, not a new rule | 1 |
| 41 | A9 | **A runner with a Lingering that would take it Down dies of it off the map** | 6 | Answers Lucas's worry ("they'll tell the tale") without a chase; the Parting Beat's runners | Lingering ends at EoE (Chapter 8): the rule must count it ("a runner whose damage left is at most twice its Lingering doesn't make it") | 2 |
| 42 | A4 | **A group's break line on its stat block** ("Breaks: when its leader is Down or half its members are Bloodied") | 6 | A finer version of the decided fight, for an Elite's retinue or a squad | One line per group, never a roll every round | 2 |
| 43 | C24 | **Attacking it is the risk:** a creature whose gaze answers every melee Strike against it | 6 | An NPC passive on the moment "a creature makes a [Strike] Action" (Chapter 2) | No death and no lost turn: a Save for Immobilized or Slowed 1, not stone | 2 |
| 44 | C27 | **A fear Aura** around a creature | 6 | Aura and Frightened (always "of" a source) exist | Its Save "at the start of your turn" goes into M1's order | 2 |
| 45 | I8 | **A place where strong magic hurts:** spending Surge there deals damage | 6 | Hazardous Terrain's patterns (Entering, Turn, Movement): add one, "when a creature spends Surge"; an encounter twist for casters | Only spells spend Surge now; an NPC caster gains 1 a round | 2 |
| 46 | I4 | **Wards over a place, each failing its own way** (a count of seals, a chance, a breaking point, a key for friends) | 6 | Abjuration outside a fight "warns or bars, never harms" (decision 123); shelter and alarm (decision 128) | Dominions' trap domes harm: leave them out. Few spells come from afar in 2d12 (scrying, messages), so the wards guard against those | 2 |
| 47 | I10 | **The four humours as moods of a crowd,** cast by the four Elements | 6 | The Elements' temperaments (magic-design 5p, 2); a mood opens a way and never decides for a mind (decisions 114, 123) | No Boon to the Check that follows (decision 114) | 2 |
| 48 | H10 | **Travel magic with honest limits:** not true teleport (mountains block it), a prepared destination, a path that drifts, a road with its own dangers | 6 | Decision 128: flight and far travel (slow or vertical; a distant arrival only at a place you have been; the far ones rare) | Content for rare cards, not a rule | 2 |
| 49 | K1 | **Each Path finds things its own way** (fire on soil, birds, livers, dreams of water) | 6 | Content for each Path's small magic and finding-out cards (decision 119) | Decision 128's "a direction, not a place" | 2 |
| 50 | C12 | **Swallowed:** taken inside a huge creature until it is freed | 6 | Built from Grabbed, Blinded and a Lingering; a Bestiary Action | A swallowed PC must keep a turn (it can still Strike the swallower); the way out must be written (the swallower goes Down, or one blow of N damage frees it) | 3 |
| 51 | C6 | **Repel:** a longer weapon strikes first at a shorter attacker and can stop the attack | 6 | The Long property, Reach, and weapons may give Reactions (Techniques); the Round Frequency is Dominions' "harder to repeat" | Waits for the Polearms group's redesign, done the bows' way | 3 |
| 52 | E-b | **A trinity:** three bodies sharing one power, weaker as each falls | 6 | An encounter pattern on Chapter 14's ranks | Its CV must be measured (linked creatures change the fight) | 3 |
| 53 | E-k | **More Tags from Dominions' kinds:** Spiritform can't take a skin buff; the Lifeless can't be healed but can drain | 6 | The Tag list is a `[!tbd]` (Chapter 7) | Write it with the whole Tag list | 3 |
| 54 | L2 | **Control weapons:** little damage, a sure rider (a whip, a net, a bola) | 6 | Chapter 15's own principle: "what the weapon can do pays for the difference" | Waits for a weapon group's redesign; Tier 1 is 0 for every weapon | 3 |
| 55 | F2 | **Two kinds of a god's gift:** always on, or invoked in battle | 6 | Aveline's Rime Strike is the invoked kind (a Round Action); a passive is a Feature | Part of F1 | 4 |

### Fits, narrower (Fit 5)

| # | ID | The mechanic | Fit | Why it fits | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 56 | A13 | **A banner** that keeps its bearer's allies steady (only the best one counts) | 5 | The Banner of the Last Stand exists (`items-economy.md`); Stacking keeps only the best | Lift a limit ("allies in its Aura end Frightened on a Tier 2"), no number | 1 |
| 57 | C28 | **A heat or chill Aura** that lays a weak zone around a creature | 5 | An Aura with [HT]; Stacking stops it hitting one victim twice | [HT] once per turn-cycle already | 1 |
| 58 | D4 | **A Path changes your lifespan** (Nature longer, Fire shorter: "burn bright, burn fast") | 5 | A line in each Path's temperament (magic-design 5p, 2; decision 106) | Flavor only | 1 |
| 59 | F11 | **A god with no believers ceases to exist** | 5 | Setting truth for the Divine | Flavor only | 1 |
| 60 | G5 | **Crowds hide you** | 5 | A Field Boon to Hide in a dense town | Waits for Hide | 1 |
| 61 | H7 | **The party moves at its slowest; a group effect covers only those it names** | 5 | Decision 124's "how many" scale already implies the second half | Waits for travel | 1 |
| 62 | I5 | **A zone as strong as its surroundings** (ice walls in the cold, gone when it warms) | 5 | Zones and Light already read the place | Spell content | 1 |
| 63 | K3 | **"It ends if you leave the place"** as a printed limit | 5 | Decision 124's durations, decision 119's printed limit | A limit, not a rule | 1 |
| 64 | K14 | **A place that extends a Path's reach** one scale | 5 | One of a site's gifts (I1), on decision 124's scales | Comes with I1 | 1 |
| 65 | K15 | **A card that works only in some places, or for some casters** (only a flier, only in barren land) | 5 | Cards already have a Requirements line | Use rarely: a requirement nobody meets is a dead card | 1 |
| 66 | L7 | **An escape item:** home when hurt, death if home has fallen | 5 | Disruptive (Travel) | One item | 1 |
| 67 | L12 | **Who can use an item:** by body, by kind, by Path, by Size | 5 | The card's Requirements; the "Weapon needs" setting | Never a Path requirement that makes an item permission for one class (T3) | 1 |
| 68 | C3 | **Acid rusts iron gear** | 5 | Gives the Acid subtype a job, once C2 exists | NPC gear is flavor (as C2) | 1 |
| 69 | G14 | **The watcher can be noticed and cut off** (the silver cord) | 5 | The watched can notice (decision 128); the counterspell tree starts with recognizing (decision 99) | Harming the watcher is new: a Talent of the counterspell tree | 2 |
| 70 | B8 | **A disease Wound** that worsens until treated | 5 | Sickened is its in-fight cousin; a clock on the sheet | Comes with the Wound tables | 2 |
| 71 | C23 | **A dancing blade** that strikes beside you on its own | 5 | A [Woven] spell (one at a time; ends on Down) | Spell cards are placeholders (decision 84) | 2 |
| 72 | E-e | **A creature that asks a question,** and a wrong answer hurts | 5 | A knowledge Check as an encounter | Its harm goes through damage and Wounds, never a beheading | 2 |
| 73 | F5 | **The Chosen:** one champion of a god at a time, given a charge, and a wait if he dies | 5 | A campaign role or a quest reward for a Paladin | Waits for deities (F1) | 2 |
| 74 | F14 | **A return only for one who fell on his god's ground** | 5 | Consecrated Ground exists; a place-bound revival | Decision 93's limits | 2 |
| 75 | K2 | **Scrying shaped by its Path** (only through a forest's animals, only through dreams) | 5 | Finding-out content | Decision 128: "you must have seen the thing"; Dominions scries places never seen | 2 |
| 76 | L5 | **Armor or a shield that answers the blow** (the attacker Saves or suffers) | 5 | The moment "a creature deals damage to you"; items may give Reactions | A passive that fires every hit must be priced like a Reaction | 2 |
| 77 | B5 | **The weapon's subtype picks the Wound** (Slash cuts, Blunt breaks, Pierce festers) | 5 | Dominant Damage already picks the table; this picks the column | One more lookup at the worst moment of a fight | 3 |
| 78 | E-f | **A creature with two lives** | 5 | An Elite pattern | A second Health bar changes the CV a lot: measure it | 3 |
| 79 | F10 | **Each god's holy ground has its own property** (it raises the dead, it brings rain, it shows false names) | 5 | Consecrated Ground's variant by deity | Waits for F1 | 3 |
| 80 | H5 | **Weather in a fight** (rain, storm, snow), each one line | 5 | Zones, Light, [Ranged] Banes, Difficult Terrain | A table of weathers to write | 3 |
| 81 | I9 | **A town's unrest,** moved by the PCs' deeds, with thresholds | 5 | Alert's twin for towns; the town stat block | Waits for Alert (a proposal) | 3 |
| 82 | K9 | **Pacts and changes with a price:** power in steps, each costing a piece of humanity | 5 | Talents with ranks (T4, T11) and marks (`roleplay-and-utility-magic.md`) | Each rank must be worth a whole pick (T13); the price is a mark, never a number | 3 |
| 83 | C13 | **Mounts as two creatures** (areas hit both; a frightened mount throws its rider) | 5 | Size, Frightened, Prone, Collision exist | Flying is a `[!tbd]`; a whole module to write | 4 |
| 84 | H1 | **Travel costs by terrain** | 5 | The expedition loop and Supplies | A travel system to write first | 4 |
| 85 | L15 | **Crafting asks a rank in the item's Path** | 5 | Horizontal; "crafting with loot" is planned (`items-economy.md` 30) | Waits for crafting | 5 |

### Fits, low priority (Fit 4 and 3)

| # | ID | The mechanic | Fit | Why it fits | Watch for | Complexity |
|---|---|---|---|---|---|---|
| 86 | E-d | **A boss that never moves and owns its room** | 4 | Already possible: Speed is free in the Bestiary | Advice, not a rule | 1 |
| 87 | E-h | **A creature hard to strike truly** (the first Strike each round takes 1 Bane) | 4 | A Pressure Bane on a Tag | Small | 1 |
| 88 | H3 | **Rivers and passes that open by season** | 4 | GM world-building | Waits for travel | 1 |
| 89 | J4 | **A bodyguard tied to one leader** | 4 | The Soldier role already protects allies | A variant, little new | 1 |
| 90 | L14 | **An artifact that "wants" to exist** and is cheaper once the world is ready | 4 | The Unique availability exists | Flavor | 1 |
| 91 | M7 | **A culture in five lines** (people, warfare, magic, priests, faith) | 4 | A format for the setting | Setting work | 1 |
| 92 | M8 | **Cultures first, peoples second** | 4 | A principle for Species against cultures | It would touch Chapter 11's design if taken | 1 |
| 93 | F4 | **Blessed by being on your god's ground** | 4 | Consecrated Ground's cousin | Overlaps F10 | 2 |
| 94 | K16 | **Sending an object far, with a limit** | 4 | Out-of-fight utility on decision 124's scales | Not among decision 128's families | 2 |
| 95 | C4 | **Rules that key on Blunt, Pierce and Slash** (Blunt breaks shields, Slash wounds) | 4 | Allowed when a rule uses them (Chapter 1) | Never a general property for each subtype: Chapter 1 says subtypes have no rules by themselves | 3 |
| 96 | F12 | **Calling back by pooled effort** toward a threshold only the GM knows | 4 | A revival rite | Pooling effort is helping, and there is no help outside a fight (decision 117) | 3 |
| 97 | J6 | **A hireling's contract,** the last employer favored at renewal | 4 | Base building's followers | Waits for followers | 3 |
| 98 | I6 | **A land's six traits** (order or turmoil, plenty or sloth, heat or cold...) | 4 | The town stat block has tags | A campaign layer of its own | 5 |
| 99 | I7 | **A blessing overdone has its own price** | 3 | GM advice for I6 | Flavor | 1 |
| 100 | I3 | **A workshop or a shrine required for great rites** | 3 | Base building (proposals) | Waits for base building | 5 |
| 101 | I11 | **A base's guards refilled after each fight** | 3 | Base building | Waits for base building | 5 |

---

## 3. What the ranking shows

**Clusters.** The top of the list falls into five groups, each one piece of work:
- **Enemies who break** (A10, A7, A1, A5, A4, A9, J1): the morale rule 2d12 lacks, built from the decided-fight proposal, summons' "leaves on Down", the Deadly Hazard precedent and Bloodied. No morale roll anywhere.
- **The Bestiary's new patterns** (E-a, C10, C26, C24, C27, C12, E-b): each priced with the points; the Elite's phases carry the first.
- **The order of things** (M1, C16): two sections that remove arguments everywhere else.
- **Wounds** (B6, B4, B3, B7, B8, B5): the Wound tables' content, held by the Chapter 4 review's rule that most Wounds heal at a Rest.
- **Finding out and hiding** (G4, G1, G2, G13, G16, G5): the Hide rules and the finding-out cards.

**What waits on an unwritten piece** (Complexity 4 and 5, and some 3s):

| Piece not written | Candidates waiting on it |
|---|---|
| Hide and sneaking | G4, G5 |
| The Wound tables | B3, B4, B5, B6, B7, B8 |
| Travel and the forced march | B4, H1, H2, H3, H7 |
| The Skills pass (D3) | H2, G2 |
| Armor properties and shields | C2, C3, L5 |
| A weapon group's redesign | C6 (Polearms), L2 |
| The Tag list | E-k, K18 |
| Deities | F1, F2, F5, F10, F4 |
| Revival | L6, F13, F15, F14, F12 |
| Flying | C13 |
| Crafting, base building, a campaign layer of places | L15, I3, I6, I9, I11, J6 |

**The ones ready now** (Fit 7 or more, Complexity 1 or 2): H6, E-a, A10, G4 (with Hide), G1, G2, C10, J1, C26, L3, L6, I2, L9, L10, L11, A5, B7, L8, F13, G7.

---

## 4. Sources

- `book/research/dominions-mechanics.md` (the mechanics, their Dominions text and the first fit ratings) and its reading log `raw/2026-11-20-dominions-manual-notes.md`.
- The 2d12 rules checked: `book/rules-src/01-roll.md`, `02-turns.md`, `03-movement.md`, `04-health.md`, `06-basic-actions.md` and `book/cards/basic-actions.json`, `placeholders.json` (Hide), `07-traits.md`, `08-conditions.md`, `14-bestiary.md`, `15-gear.md`.
- The design notes checked: `book/decided.md`, `book/magic-design.md` (decisions 12, 84, 92, 93, 97 to 99, 106, 112 to 128; reviews 5o, 5p), `book/items-economy.md`, `book/expedition-loop.md`, `book/roleplay-skills.md`, `book/talents-design.md` and `cards/talents-playtest.md`, `book/rules-backlog.md` (the Chapter 4 review), `book/research/revival.md`, `divine-profane.md`, `pillars-of-eternity.md`.
