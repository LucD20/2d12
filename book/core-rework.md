# The core rework: every decision (2026-11-21)

What came out of playtest 7 and the core review (seven reviewers; three rounds of Lucas's answers, 2026-11-21). **Nothing here is applied yet.** Each item is worked on in its own session, one decision at a time; this file is the list, the conflicts and the order. The backlog entries it gathers: `rules-backlog.md` (PLAYTEST 7; THE CORE REVIEW; its SECOND ROUND, with the third round inside it). The research: `research/wounded-states.md`, `research/crucible.md`, the core review's report (in the chat of 2026-11-21, not in the repository).

**Lucas answers on the reading page "Core Rework Desk"** (https://claude.ai/artifact/48RJN9Zuss5riaVLbTxd2F, private): every item that needs him, one click each; Claude reads the answers from the page's store (collection `answers`, one document per item id).

**Status words.** **Decided**: Lucas said yes. **Leaning**: his direction, a detail open. **Open**: still to choose. **Stands**: a proposal of the review he didn't mention; by his rule ("the things I haven't mentioned … is either because I agree or they have conflicts with the new ones") it is agreed unless a conflict below says otherwise. **Rejected**. **Later**: after this rework.

---

## A. Rolls and the Critical

| # | Item | Status | Detail |
|---|---|---|---|
| A1 | **A Critical gets something every time** | Decided | Today: a Tier 3, plus Escalation once an encounter. |
| A2 | Its extra: **an exploding die** | Leaning | 1d6!, 1d8! or 1d10! (Claude: **1d8!**, average 5, above Empowered's 1d6!). Replaces the earlier "a d12 or regain 1 AP" and the review's +1d12. |
| A3 | **The five-Boons cliff**: a Favored or Doomed source counts as 5 Boons or 5 Banes; cancel; 5 or more left is Favored or Doomed | Stands | Today the 5th Bane can help a Doomed roll (Chapter 1). |
| A4 | **Save Actions feel the user's Banes**: each Bane on the user gives every target 1 Boon on its Save | Stands | **Reverses** Chapter 1's rule that a Save Action ignores the user's own Banes (Taunted, Daunted, Pressed never touch Kneel or Ground Slam today). Confirm in its session. |
| A5 | **Exhausted gives Banes** (not "a penalty equal to the value") | Decided | Then it counts toward 5 and cancels with Boons. |
| A6 | Range Banes stay unnamed | Decided (asked whether to change) | Field is "where you and the target are"; a range Bane is not a Field Bane. A one-line note may be enough. |
| A7 | Three formulas for an Attribute's number (Action DC 11 + A, Vs. Attribute 12 + A, Attribute Save DC 11 + ⌈A÷2⌉ + 1) | Stands (to look at) | The review flagged it; no fix chosen. |

## B. The turn's filler and the Basic Actions

| # | Item | Status | Detail |
|---|---|---|---|
| B1 | **Weapon Attack, Tier 1 deals [Mod]** (PCs) | Decided | The convention the class cards already use. |
| B2 | Weapon Attack, **Tier 3 adds the weapon's die again** | Leaning ("interesting") | Bows' Tier 3 is one point above Tier 2 today. |
| B3 | **The At-will Bane stays** | Decided | The review's "from the third use" is rejected. |
| B4 | **Each class carries its own Basic attacks, a Weapon one and a Power one** (a class with no Power, the Archer, still has a small themed one) | Leaning (an idea) | Would also end the Paladin's At-will Bane problem (two At-will Strikes to alternate). **Decide before B1/B2 are written:** if each class has its own, B1/B2 may become the template, not one card. |
| B5 | **New Basic Actions open to all**: a debuff on an enemy, a help for an ally (PF2e's Demoralize and Aid as models), a Mind-damage basic attack | Decided (the shapes open) | The cheapest debuff ("a Weapon Attack can deal [R]") rejected. |
| B6 | **Mind and Appeal get their own Basic Actions**, so Body and Instinct aren't kings; **an Action can have several Attributes** | Decided | Starting map (not one Attribute an Action): Body: Shove, Grab, Haul; Instinct: Trip, Break Free, reflexes; Mind: Feint, Tumble, Heal; Appeal: Demoralize, Aid, Heal. |
| B7 | **Trip and Shove are subpar**: lose the Strike trait or get better | Decided (how open) | |
| B8 | **Tumble**: a Basic Action to pass through an enemy's square | Decided (its roll open) | Goes with D3. Maybe on Mind. |
| B9 | **Heal (allies)**: for the playtest, **Heal · At-will · 2 AP; Mind or Appeal vs DC 13; Tier 1 no effect, Tier 2 the ally can use 1 Rally Point, Tier 3 2** | Decided (playtest version) | For a Down ally, who can't Steel Yourself. The Medicine skill (first round) waits for skills: the book has none. Lay On Hands keeps its Reach and Guard. |
| B10 | **Steel Yourself: a Round Action, 1 AP (1 Rally Point) or 2 AP (2)** | Decided | Already Round; today 2 / 3 AP. |
| B11 | **Break Free written in Tiers** (Lucas's draft: At-will · 1 AP; Body, Instinct, Move; "Body or Instinct vs. Action DC"; Tier 2 or 3: no longer Immobilized) | Decided (wording open) | Claude's notes: a "Check:" roll line, not "Attack:"; Doubles now free you below the DC; Self as a trait and a Distance is redundant. Foundry v0.0.476 rolls a Check today. |
| B12 | **Leaning → the Action Lean** (the state stays Leaning); **it ends when you leave your square** (an Evade and a push too) | Decided | |

## C. Health and damage that matter

| # | Item | Status | Detail |
|---|---|---|---|
| C1 | **Bloodied: Speed −2 (minimum 1) and Steadiness −1** | Decided | Replaces "no effect by itself" (Chapter 4) and playtest 1's "Bloodied and Strained lose their Banes, become hooks". −2 stacks with Hindered by Chapter 3's order (changes first, then halve). Rejected: losing Guard from unspent AP (and NPCs gain none anyway, Chapter 14), halving Speed, Pressed. |
| C2 | **Steadiness can be negative; a negative Steadiness adds to Forced Movement** | Decided | Chapter 3 says "never negative" today. See conflict K4. |
| C3 | **Strained: the creature doesn't gain its free Reaction AP** (it must keep AP for Reactions) | Decided | Rejected: a Minion or Grunt fleeing at Strained (Bloodied and Strained should be even). |
| C4 | **Bloodied: and Strained: lines on Actions**, labeled like Attack and Special ("Bloodied: the target is Pushed 1"; "Strained: Tier 3 gains Dazed 1") | Decided | Timing (Claude's proposal): the line applies if the target is Bloodied as the Action resolves, after its own damage. A card-Structure change (CARD-ONE: `card-structure.md`, `cardmodel.mjs`, `cards.py`). |
| C5 | **Reductions don't reduce Collision damage** (Judge, Shield of Faith: Collision is another instance) | Decided | |
| C6 | **A protection floor** (reductions never take a hit below half: Draw Steel) | Open ("evaluate carefully") | Protecting a Dying ally must stay possible. |
| C7 | **Down stays a setback**; the Wound table is a placeholder | Later (asked: now?) | Claude: after combat feels good (playtest 8), as Lucas first said. |
| C8 | **Expedition pace**: the Rest is the tick; between Rests about **2 easy, 2 moderate, 1 hard fight** (4 to 6) | Decided (a rough guide) | Consistent with the review's targets: about 190% of the party's Health against 1.7 to 2× Health in Rally Points. |

## D. Movement and position

| # | Item | Status | Detail |
|---|---|---|---|
| D1 | **Flanking: a flat 1 Field Boon, the cancel kept** (helping a flanked ally), **"opposite" generous** (the three squares opposite) | Decided ("needs careful ruling"); **ruled 2026-11-25 (batch 4, decision 1; Lucas: "all rest seems good", then on the flat 1: "Keep it")** | The review's "no cancels" rejected. **The ruling:** two creatures flank an enemy when both threaten it and the second is within 45° of the straight line from the first through the enemy's center (between square centers; the 45° edge counts; next to a one-square enemy, the three squares across; any square of each flanker's space, so reach and Large creatures work); a flanker gains 1 Field Boon on its [Melee] Actions against that enemy (more flankers add nothing); an ally of the enemy that threatens the flanker cancels it; [Melee] only; Minions included (D2). **Why flat 1 (rechecked 2026-11-25):** the core review's "flanking rewards piling on" (the old rule added about 22% to a swarm's damage on a Paladin); 1 Boon is about +7.5% damage per attacker against +14% for 2; it leaves the Field cap's second Boon to Prone (Trip) and the rest; one check, no counting. |
| D2 | **Minions flank**, for now | Decided | |
| D3 | **An unwilling creature's square blocks movement** (allies pass); Tumble (B8) is the way through | Decided; **ruled 2026-11-25 (batch 4, decision 2; Lucas: "All good", the diagonal "B, proceed")** | Footwork's Weave becomes the exception it reads as. **The ruling:** your own movement (Advance, Evade, Charge, Crawl) can't enter or pass through an unwilling creature's space; an ally's (any willing creature's) space is Difficult Terrain, never ended in; **an ally's space is the one Difficult Terrain an Evade can cross** (at double cost: Evade 1 can't); **moving diagonally between two unwilling creatures is blocked** (it was Difficult Terrain; no major game does it by rule, players expect it: `research/diagonal-between-creatures.md`), between an ally and an enemy or two allies it stays free; **a Down creature (Dying, Shattered, Unconscious, Desperate) and a dead one is Difficult Terrain** on either side; no size exception; Forced Movement and Reposition keep their rules; Charge can't pass allies (Difficult Terrain) and stops at enemies. **Tumble:** passing diagonally between two enemies counts as crossing one creature: the higher of their DCs, no Bane for the second (Lucas's B; his alternative was a set DC 11). |
| D4 | **A Large creature's straight line (Charge)**: the line between the centers of its start and destination; every square moves the same steps; the left / right tie as today; **with a diagram** | Decided | |
| D5 | **A dead or Prone creature gives no Cover** | Decided | Chapter 3 "Creatures in the way"; `cover.mjs`. |
| D6 | ~~Grazing the center line counts~~ **Reversed (Lucas, 2026-11-22): a line that only touches a creature's space doesn't count** ("on the line") | Decided | Applied in the book and Foundry v0.0.478. |
| D7 | "Pushed 0" | Decided (a Foundry glitch) | The book still says both "0 squares is no Forced Movement" (03:122) and "Collision at 0 against a wall" (03:173): settle the sentence. |
| D8 | Every NPC has an **answer to the back line** | Decided | Ranged or thrown options, Evades, movement Reactions, "Setup: Advance 2". |

## E. Conditions

| # | Item | Status | Detail |
|---|---|---|---|
| E1 | **Frightened → Daunted** | Decided | Commandment's Courage: "ignore Daunted". Foundry's status id changes (a migration). |
| E2 | **A condition with a source ends when its source goes Down** (Daunted, Taunted; Grabbed has it) | Decided | The word stays **source** (Chapter 8's); "origin" stays for Forced Movement and areas. |
| E3 | **Prone has been given too liberally**; Save riders "Tier 1 or 2" depend on the rider | Decided (which cards open) | Kneel knocks the Orc Prone 83% for 1 AP, Trip 23%. Touches class cards: see question 3. |
| E4 | **Save-ends leftovers** (02-turns.md "until a Save ends it"; 08 "the Save that would end Frightened"); **EoT in the Glossary** says which turn | Stands | Text fixes. |
| E5 | "Doomed on its next roll" priced as a Mild rider | Stands (to look at) | With the Bestiary's rider prices. |

## F. Escalation and Surge

| # | Item | Status | Detail |
|---|---|---|---|
| F1 | **The Escalation Passives may go**; martials' Actions grow stronger with Escalation or open new uses (as Smite); casters spend it as **Surge** | Decided (direction) | Surge already exists in the magic record (decisions 66 to 90: gained when Escalation rises and each round, spent by spells; decision 68: "the classes at their next pass"). No conflict: the martial side is the class passes' work. |
| F2 | The ladder's pace: fights of 3 to 3½ rounds reach Escalation 4 to 5; the 6 rung is a round-4-or-Momentum event | Later | A level 2+ question (a level 1 PC has only its Escalation 2 ability; section N); decide with F1 at the class pass. |

## G. The Bestiary (mechanics first, numbers after)

| # | Item | Status | Detail |
|---|---|---|---|
| G1 | **Keep ranks, roles, sheets; rebuild the numbers**; **mechanics first, the tables later** | Decided | |
| G2 | **Five ranks: Minion, Grunt, Standard, Elite, Boss** (Minion fodder; Grunt weaker than a PC; Standard on level; Elite above; **Boss** for a single-boss or boss + 1 to 2 fight, with its own turn mechanic: Nimble's one turn per PC, or Draw Steel's two turns) | Decided (the Boss's mechanic open) | The review gave the Elite two turns; that now belongs to the Boss (see K6). |
| G3 | **Minions have ticks, not Health**: a Tier removes that many (1 / 2 / 3); most Minions 2; **one tick reduction per Action** (its Forced Movement damage doesn't tick again; Lingering apart); **no overflow** | Decided | Replaces the review's "one hit, a Tier 3 drops another". See K1, K2. |
| G4 | **NPCs play by the PCs' rules** (no NPC-only Strike limit: PF2e's "different rules" complaint) | Decided (scope open: question 1) | |
| G5 | **No generic NPC Reaction-AP rule: a Reaction designed for each enemy** | Decided | The review's "idle Reaction AP pays for Stand / Break Free" rejected. |
| G6 | **NPC Specials hitting up to two creatures: yes, but not all** (modular) | Decided | Spreading damage becomes the card's shape. |
| G7 | **The GM's focus-fire tip: at most a small note**; no targeting "habit" line | Decided | |
| G8 | **Defenses by role** (a real spread, AD 11 to 16) and **one Defense point ≈ 10% of Health**; Ward Defense priced low until PC cards attack it | Stands | B5's Mind attack would be the first PC card against Ward Defense. |
| G9 | **Targets**: easy ~25%, normal ~35-45%, hard ~55-65% of party Health | Decided (with C8) | |
| G10 | Kept aside for the rebuild: Elite Escalation, the rider list, Frequency pricing, the best-turn check; ranks must differ by more than Health | Decided | |
| G11 | A simpler pricing (ready lines per rank and AP; the points engine only in Foundry's Builder) | Stands | With the numbers, after the mechanics. |
| G12 | The examples rebuilt, a Grunt among them | Later (the numbers) | |

## H. Classes and cards

| # | Item | Status | Detail |
|---|---|---|---|
| H1 | **The Paladin's fixed Weapon +1 / Power +2 "defeats the purpose of the system"**: a remedy | Decided (the remedy open) | Claude: he chooses his Modifier order like any class; Smite (already) and Binding Light roll Signature. Reverses the redesign's 2026-11-14 decision. |
| H2 | **Binding Light gets [Signature]** | Decided (an oversight) | |
| H3 | **Arts are hard to remember; prompts for every trigger; fewer Modes; an option budget per level** (Root 5) | Decided | Foundry prompts first; Modes and budget at the class passes. |
| H4 | **A Talent can be just an Action** (Rime Strike as the Talent; Oath of Burden with Bear the Blow inline) | Decided | |
| H5 | Quick Shots' Critical AP is not dead (movement, help) | Decided (no change) | |
| H6 | Ranged damage stays low for now; watch the Field Bane on a target Engaged with another creature | Decided (watch) | |
| H7 | The four playtest Talents were left out of playtest 7 on purpose | Noted | It was played at level 1, where the pregens have no Talent (section N). |
| H8 | **The Talents' anchor (+6 a turn) and `ruler/pc-budget.md` go stale** with B1/B2 | Stands | Re-anchor after the Weapon Attack; Talents (T15 onward) wait for it. |
| H9 | "No shutting down a boss" is a Talents rule (talents-design.md) but not a class-card rule | Stands (to settle) | With the Boss (G2). |

## I. Foundry and measurement

| # | Item | Status | Detail |
|---|---|---|---|
| I1 | **The Encounter Log upgrade** (the review's section 7: per roll, per turn, Reactions offered / used, per creature per round, an automatic summary; one numbering for same-name creatures) | Decided | Before playtest 8, so it measures. |
| I2 | **Foundry blocks, not warns** (an Advance while Immobilized, a 5th AP), chapter by chapter | Decided | |
| I3 | Playtest 7's bugs and asks (`foundry-backlog.md`, "PLAYTEST 7"): Prone + Break Free, Charge's Weapon Attack in Situational, the Charge reselect glitch, Quick Shots' and Slip Away's movement, Darting Blade's stow, the strike pips, Quick Shots not faded at 1 AP, Daunted not removed at Down, dead tokens' Cover, the Dying save's old card, hover tips, ± AP on the strip, the current turn | Logged | |
| I4 | The SIM: Lucas distrusts its white-room numbers | Decided | Measure at the table; run the SIM on the current cards only when a whole-fight comparison is needed. |

## J. Rejected (so no session reopens them by accident)

The targeting habit line; the At-will Bane from the third use; Minion overflow; the one-hit Minion; a Minion or Grunt fleeing at Strained; Pressed for Bloodied; Bloodied losing kept-AP Guard; halving Speed for Bloodied; the cheapest debuff ("a Weapon Attack can deal [R]"); flanking with no cancels; a generic NPC Reaction-AP rule; an NPC-only Strike limit.

---

## K. Conflicts checked

| # | Between | What | Resolution |
|---|---|---|---|
| K1 | C1 / C3 / C4 and G3 | Minions have no Health, so they are never Bloodied or Strained: no Speed −2, and every "Bloodied:" line skips them. | Fine by default (a Minion is one or two hits). If a line should reach them, one sentence: "a Minion with 1 tick left counts as Bloodied". Decide in the Minion session. |
| K2 | G3 and B1, Save Actions, areas | "A Tier removes that many ticks": a Weapon Attack's Tier 1 [Mod] now removes 1 (good), but what does a **Save Action** remove (the target's Save Tier inverted?), a **0 after reductions**, an area hitting the squad, a rider with no damage? | Write in the Minion session: which Actions tick, and that a Save's failure counts as the user's Tier. |
| K3 | C3 and G5 | Strained costs an NPC nothing until it has a Reaction; Minions have none (Chapter 14). Strained also needs Resolve damage, which few cards deal (the Archer none, 4 Bestiary lines). | Even only once G5 (a Reaction per enemy) and B5 (the Mind attack) land. Do them together or accept the gap for playtest 8. |
| K4 | C2 and Chapter 3 | "You can choose not to apply your Steadiness" (an ally helping you): with a negative Steadiness, refusing it helps you. And Reposition is reduced by Steadiness too. | A negative Steadiness always applies, and applies only to Forced Movement (Lucas: "add to forced movement"): Reposition unchanged. Confirm in its session. |
| K5 | B4 and B1 / B2 / B3 | If each class carries its own Weapon and Power Basic attacks, the shared Weapon Attack's fixes may be the template rather than one card, and the At-will Bane's sting on the Paladin disappears. | Decide B4 first, then B1 / B2 on its shape. |
| K6 | G2 and the review's Elite package | The review gave the Elite two turns; Lucas gives that to the Boss. The Elite still needs something beyond Health (the review: "a turn slot with a lot of Health"). | The Elite's shape is its own decision in the Bestiary session (Shrugs It Off, a sweeping Special, phase turns at Bloodied / Strained are the review's other candidates). |
| K7 | G4 and Chapter 14 | "NPCs play by the PCs' rules" against today's NPC-only rules: Minions and Grunts have 3 AP; an NPC gains no Guard from unspent AP; Minions have no Reactions; NPCs have no Weapon Attack (the Basic attack). | Question 1 (the scope). |
| K8 | A2 and B2 | A Weapon Attack Critical gets Tier 3 (the weapon's die again) plus the exploding die. | Not a conflict: check the total against a PC's Health in the Critical session (an Ogre Smash Tier 3 + 1d8! ≈ 15.5 against an Archer's 29). |
| K9 | F1 and the magic record | Surge is already defined (66 to 90). | None: F1 is consistent; the martial side waits for the class passes (decision 68). |
| K10 | B9 and the first round | "A Heal needs the Medicine skill" against the playtest Heal on Mind or Appeal. | The playtest version stands; the skill gate when Skills exist. |
| K11 | B11 and Foundry v0.0.476 | Foundry just made Break Free a Check; the Tier version changes it (Doubles free you). | Ordinary: the Foundry version that follows the book. |
| K12 | E1 and the playtest notes | "Frightened" stays in older records. | Corrections go forward only (CLAUDE.md); archives keep the old word. |

## L. A quick review of the decisions themselves

- **The set is coherent.** Each of the review's five roots has its answer: the numbers (G, measured at the table), the filler (B1 to B4, A1 / A2), the enemies' shape (G2, G3, G6, G8), the structure (D1 to D3, G5, C1 to C4), the overload (H3, I1).
- **Watch the PC side's growth.** B1, B2, A2 and B5 / B7 all add PC output; the review's 30 to 45% for the Weapon Attack alone. The Bestiary's Health must absorb it, so **the numbers come last**, after the PC side is settled.
- **Bloodied and Strained are even only once Resolve damage is common** (K3): the Mind attack (B5) and the Reactions per enemy (G5) carry Strained's half.
- **Flanking + Minions flanking + blocking squares**: blocking makes surrounding a Paladin harder, flanking rewards it; with Minions dying faster (G3) the swarm should thin. To watch in playtest 8, not a conflict.
- **The Heal's 2 AP At-will** for 0 / 1 / 2 Rally Points is weaker than Steel Yourself for a standing ally (right: its job is a Down ally) and the At-will Bane taxes a second one.
- **Three reversals of earlier decisions** need Lucas's eye in their sessions: A4 (Save Actions and the user's Banes), H1 (the Paladin's fixed Modifiers), C1 (Bloodied's "no effect by itself").

## N. Correction: every playtest was played at level 1 (Stage 0)

Lucas, 2026-11-21: "All playtests have been level 0." The playtest 7 log uses only level 1 picks (Commandment, Spotter, Strafe, Hold the Line, Roving Judgment); "the level 4 pregens" in the backlog came from pack TALENTS-PT (the Talents are on the level 4 builds) and was wrong. Level 4 (Stage 1 in Chapter 5) has never been played. **What the core review said that changes:**

- **"The rest was bad luck" is much weaker.** The review's replay of playtest 7 used level 4 Modifiers (the Archers +3 instead of +2, Durgan's Power +3). At level 1: the party's expected damage is **64 a round, not 73** (real: 57, so 11% below expected, not 22%); the party's Tier 1s, **20 against 16 expected** (a result that bad or worse 21% of the time, not 7%); Sylwen's 9 Tier 1s in 17, against 5 expected (3%, not 0.7%). **So "PCs missing more than they should" is mostly the system's designed rate at level 1, not dice:** it strengthens Root 2 (B1, B2, A2, H1). At expected dice playtest 7 would have lasted about 4½ rounds, not 3.8.
- **Root 5 (option overload) is smaller than stated.** "12 of 39 class options used (31%)" counted the level 4 build; at level 1 a PC has 5 to 6 class options. The Encounter Picks, Weight of Judgment, Opening Shot, Lantern of Faith and Trick Shots weren't on the sheets. What still holds at level 1: **Arts used 3 times in 20 PC turns, Footwork (Kaela's Art) and Lay On Hands (Durgan's Hallmark) never used, Quick Shots' free Evade skipped**: the unprompted options still vanish (H3 stands).
- **The Escalation ladder's pace (F2) is a level 2+ question:** a level 1 PC has only its Escalation 2 ability. Moved to Later.
- **The Bestiary's anchor holds:** about 13 to 14 a PC-turn is the level 1 table output (57 a round measured), which is what Stage 0 must be built on. The review's "about 57 a round at level 4" was this same level 1 fight.
- **Unchanged:** the Paladins strike at +1 at level 1 (H1), the Minion and rank findings (Root 3), the structural findings (Root 4), the Weapon Attack's Tier 1 and Tier 3 (Root 2).
- **The Talents' anchor (H8)** was priced on the level 4 builds, at the table never: it stays "re-anchor after the Weapon Attack".

## O. Lucas's answers to the general questions (2026-11-21)

1. **NPC parity: case by case.** Parity is the default; each NPC-only rule (Minions' and Grunts' 3 AP, no Guard from unspent AP, Minions' no Reactions, the Basic attack) is kept or dropped in the Bestiary session, with a reason (K7).
2. **One Foundry version per batch**, right after its book changes, each with its checklist.
3. **The class cards may change freely**: the rework can rewrite any Stage 0 Paladin or Archer card it touches (Bloodied / Strained lines included).
4. **Playtest rules go into the book with a playtest note** (Heal, B9).
5. **Playtest 8: level 1 (Stage 0)**, the level every playtest has used (section N).
6. **Solo again.**
7. **The SIM is frozen** until a decision needs a whole-fight comparison; rules still go into `roundrules.mjs` first for Foundry (its `spec.mjs --check` and reports are not kept in step meanwhile).

## Q. Lucas's answers on the desk (2026-11-21)

All 32 answered (A3 and A7 with a question; Claude's replies in the chat of 2026-11-21). What each changes:

- **A2 (decided): the Critical adds 1d10!** ("Crits are allowed to be strong, but I will keep a close watch"). **Its damage type and subtype are chosen before the damage is rolled, from the ones the Action deals:** an Action dealing only [V] Piercing crits [V] Piercing; one dealing [V] Piercing and [R] Holy, the player picks one before rolling.
- **A3 (decided, after Claude's explanation):** a Favored or Doomed source counts as 5 Boons or 5 Banes before cancelling; 5 or more left makes the roll Favored or Doomed (so a 5th Bane never helps, a 5th Boon never hurts).
- **A4 (decided):** Save Actions feel the user's Banes (each Bane on the user gives every target 1 Boon on its Save).
- **A6 (decided):** range Banes stay unnamed; one line says a range Bane is not a Field Bane.
- **A7 (decided direction): one formula for every DC, named by what sets it: Body DC, Instinct DC, Mind DC, Appeal DC, Action DC.** Shove: Body vs. Body DC; Relocate: Body or Instinct vs. the same Attribute's DC. Today's "Vs. an Attribute" (12 + the Attribute: Chapter 2's Defenses table, the Glossary, Chapter 14) and the Attribute-based Save DC (11 + ⌈Attribute ÷ 2⌉ + 1: Chapter 1) are still in the book. **Decided: 11 + X everywhere** (the Action DC's number; Shove and Trip get 1 easier, as B7 wants).
- **B1 (corrected):** Basic attacks are made by class (B4), so the Tier 1 [Mod] can differ per class.
- **B2:** decided with B4. **B4 (decided): each class carries its own Basic attacks, a Weapon one and a Power one.** **Its shape (batch 3, decision 1, 2026-11-22): each class writes its own two cards (b), "though riders and effects are going to be very similar"** (`cards/basic-attacks-redesign.md`, his examples). **Revised the same day: one shared Weapon Basic Attack, [V] [Mod] / 1[W] + [Mod] / 1[W] + 1[D] + [Mod] ([D], new: the weapon's die on that Tier), each class adding one line to it; each class's own Power attack, dice only, no [Mod]; every class chooses its Modifier order (H1).** **K8 (corrected): the shared Weapon Attack will stop existing.** **"Basic attack" becomes the default word for PCs and NPCs alike, covering a class's Weapon and Power Basic attacks** (Lucas: "much better design"); the rules that call for "a Weapon Attack" (Charge's attack, Chapter 14's swap rule, Fists) are reworded in batch 3.
- **B6 (decided):** the map is the starting point; batch 3 goes Action by Action.
- **B11 (decided):** Claude's three notes on Break Free (a Check line, Doubles free you, no Self trait).
- **C4 (changed): where the line sits decides when it applies.** A Bloodied: / Strained: line **before the Tiers** applies only if the target is already Bloodied / Strained; a line **after the Tiers** applies if the target becomes so during this Action.
- **C5 (corrected): a "would damage" Reaction can trigger on Collision damage.** The creature that moves the target causes the Collision, so it is that creature's damage; a Reaction that reduces damage picks one: the Action's damage or the Collision ("you deal 2 + Pushed 2 against a wall: react on the 2 or on the Pushed"; the Pushed is a gamble, the origin may not even move the target). What stays: one reduction doesn't reduce both.
- **C6 (decided):** try the half floor in batch 4, checked against the Paladin's protection cards. **C7:** Wounds later.
- **D3 (decided): an ally's square is Difficult Terrain** (D&D 5e does it). The ladder: open ground; an ally's square, Difficult Terrain; an enemy's square, blocked (Tumble to pass). In batch 4 with blocking.
- **D6 (corrected):** "on the line" needs a diagram.
- **D7 (decided): a creature pushed into a wall it touches takes the Collision; the push still counts as leaving its square and as being moved by Forced Movement, even with 0 squares moved.**
- **E3, E4, E5, F2, G2, G11, H1, H8 (decided as Claude proposed).** H1: the Paladin chooses his Modifier order.
- **G8 (changed): for the playtest, NPCs get one number for each stat: a "Default Standard" and a "Default Elite"; the roles' variations come after.** (The Defenses-by-role spread waits.)
- **H3 (corrected): no Foundry prompts yet;** they come later, chapter by chapter.
- **H9 (decided): classes have a better chance of "shutting down" than Talents, but never shut a boss down.**
- **I2 (corrected): Foundry blocks some things, not all;** using an Action without enough AP is allowed, with a warning.
- **K1 (changed): a Minion with 1 tick left counts as Bloodied or Strained, by the damage that caused it** ([V] Bloodied, [R] Strained); if both, the one who dealt it decides.
- **K2 to K6 (decided as proposed).** K3: Strained's gap on NPCs is accepted for playtest 8.
- **N1 (decided):** "level 0" meant the level 1 pregens (Stage 0).
- **P1 (changed): the Encounter Log comes last, just before playtest 8;** meanwhile every batch adds to a list of what the log must track (`core-rework.md`, section R).

## R. What the Encounter Log must track (added as we go)

The review's section 7 is the start (per roll, per turn, Reactions offered and used, per creature per round, a summary, one numbering for same-name creatures). Each batch adds here what its rules need watched.

- Critical: the 1d10! rolled and the type chosen (A2).
- Bloodied and Strained: when each starts, by which damage; the lines they turned on (C1, C3, C4); a Minion's last tick counted as which (K1).
- Reactions on Collision damage (C5); Pushed 0 against a wall (D7).
- The protection floor when it applies (C6).

## P. The order of work


1. ~~**Batch 1: the settled fixes**~~ **BUILT 2026-11-21 (the book and Foundry v0.0.477; rules-backlog.md, the top entry).** (small, no dependencies; the Encounter Log moved to the end, P1). Book: A3, A4, A5, A6, A7 (one DC formula), D4 and D6 (with their diagrams), D5, D7, E1, E2, E4, C5, B10, B11, B12, H2. Foundry, in the same version: I2 (some blocks, warnings for the rest), I3.
2. ~~**Batch 2: damage that matters**~~ **BUILT 2026-11-22 (the book and Foundry v0.0.479).** (the book written 2026-11-22; A2 revised: only Basic attacks get the 1d10!, Trip and Shove their own Critical rows, a Critical always optional; Strained: no Reaction Point at the start of your turn; the Reaction AP is the Reaction Point). A2 (the Critical's die), C1 + C2 (Bloodied, negative Steadiness), C3 (Strained), C4 (the labeled lines: the card Structure, then the gallery). Everything after uses these words.
3. ~~**Batch 3: the Basic layer**~~ **BUILT 2026-11-22 (the book and Foundry v0.0.480, branch `pack-batch3-foundry`).** (the class cards may change freely: answer 3). B4 first (shared Basic Attack + each class's line and Power Basic attack: Sworn Blade, Drawing Light, Steady Draw, Harrying Shot), B1 / B2 (`[D]`), Fists Option B exploding `1d6!`, H1 (every class chooses Modifier order), B5 / B6 / B7 / B8 / B9 (Aid, Demoralize, Feint, Heal, Tumble; Trip & Shove 2 Versions no `[Strike]`; Haul no `[Strike]`), E3 (Kneel). Then H8 (re-anchor the Talents and `pc-budget.md`).
4. **Batch 4: the front line.** D1, D2, D3 (with B8 Tumble), C6 (the protection floor).
5. **Batch 5: the Bestiary's mechanics.** G2 (the Boss and the Elite's shape, K6), G3 (ticks, K1, K2), G4 (parity, K7), G5, G6, D8, G8, H9.
6. **Batch 6: the Bestiary's numbers.** G9 targets with C8's pace, G11 pricing, G12 the examples (with a Grunt), against the PC side of batches 2 to 4.
7. **The Encounter Log** (I1, with section R's list), then **playtest 8**: the level 1 pregens (Stage 0) against playtest 7's line-up rebuilt plus two Grunts, measured by the new log; solo.
8. **Later:** F1 / F2 (Escalation for martials) and H3's Modes at the class passes; C7 (Wounds); the Talents' restart (T15) on the new anchor; magic's playtest kit; progression past Stage 0.

Each batch: one decision at a time with Lucas, then the book (rules-src first), then one Foundry version (tests, the checklist naming the PC or NPC, the gallery for card changes), the backlogs, HANDOFF.
